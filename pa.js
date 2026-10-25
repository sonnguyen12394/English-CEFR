// 👄 Phát âm (người sáng lập 25/10/2026: phần riêng trong 8 mục, xây trước Ngữ pháp). Đơn vị học = bộ cặp âm (pa.json, 26 bộ chép từ game,
// tools/build-pa.mjs chia cấp Pre-A1 8 · A1 9 · A2 9). Luật như 📚 Từ vựng (người sáng lập: "dùng Nhớ như Từ vựng"):
//   📘 Học = đã học hết bộ âm của cấp; 🔁 Nhớ = mỗi mặt ≥ 80%: đúng ở một ngày sau ngày học, lần gần nhất đúng, khả năng nhớ ≥ 90%.
//   Hai mặt: 👂 Phân biệt (nghe một từ của cặp, chọn đúng từ) · 👄 Đọc đúng (đọc từ có âm đó, bộ chấm âm trên máy ≥ 80).
//   🎵 Trọng âm (bản nháp v30) để sau: bộ chấm âm chỉ chấm âm, chưa chấm được nhấn.
// Một lượt luyện chấm mỗi bộ một lần mỗi mặt (đúng hết câu của bộ trong lượt = đúng). Bằng chứng ở S.pa (thẻ theo bộ, cùng dạng thẻ từ), không đụng S.cards.
// Thi chuyển cấp: 2 cặp cuối mỗi bộ (không dùng khi học / luyện): mỗi bộ 2 câu nghe + 1 từ đọc; đạt khi ≥ 85% (như từ vựng); trượt thì 7 ngày sau thi lại.
let PA = null, PABY = {};
const PA_LV = ['pre', 'a1', 'a2'], PA_DIMS = [['pb', '👂 Phân biệt'], ['doc', '👄 Đọc đúng']], PA_PASS = 0.85;
DIM_OF.pa_pb = ['pb']; DIM_OF.pa_doc = ['doc'];
const paSt = () => (S.pa = S.pa || {}), paRuns = () => (S.paX = S.paX || []);
async function paLoad() { if (PA) return PA; PA = (await (await fetch('pa.json?v=1')).json()).sets; for (const x of PA) PABY[x.id] = x; return PA; }
const paPassed = lv => paRuns().some(r => r.lv === lv && r.pass);
const paLevel = () => PA_LV.find(l => !paPassed(l)) || PA_LV[PA_LV.length - 1];
const paLocked = lv => PA_LV.indexOf(lv) > 0 && !paPassed(PA_LV[PA_LV.indexOf(lv) - 1]);
function paParts(lv, now = Date.now()) { const L = PA.filter(x => x.lv === lv), st = paSt(), dim = { pb: 0, doc: 0 }; let learn = 0, due = 0;
  for (const x of L) { const c = st[x.id]; if (c) learn++; if (isDue(c, now)) due++; for (const [k] of PA_DIMS) if (heldDim(c, k, now)) dim[k]++; }
  const T = L.length || 1, dq = { pb: Math.floor(dim.pb / T * 100), doc: Math.floor(dim.doc / T * 100) };
  return { T: L.length, learn, due, dim, dq, lq: Math.floor(learn / T * 100), mq: Math.min(dq.pb, dq.doc) }; }
const paW = (w, ipa, x) => ({ id: 'pa:' + x.id + ':' + w, w, ipa: '/' + ipa + '/', vi: `${x.title} · ${x.vi}`, say: true, set: x.id });
const paSay = w => `<button class="chip" data-sayt="${esc(w)}">🔊 ${esc(w)}</button>`;
document.addEventListener('click', e => { const b = e.target.closest('[data-sayt]'); if (b) speak(b.dataset.sayt); });

// ---------- màn chính của phần ----------
function paView() {
  if (!PA) { $app.innerHTML = '<div id="part" data-p="pa"></div><p class="mute">Đang tải bộ âm…</p>'; return paLoad().then(paView).catch(() => { $app.innerHTML = '<div id="part" data-p="pa"></div><p>Không tải được bộ âm. Thử lại sau.</p>'; }); }
  BACK = paView; window.CUR = { view: 'phat-am' };
  if (!NO.vocab && !NO.loading && nHas()) nLoad();   // đã tải lần trước: nạp lại từ bộ nhớ máy (chỉ khi vào Phát âm, đỡ tốn bộ nhớ)
  const now = Date.now(), lv = paLevel(), p = paParts(lv, now), st = paSt(), L = PA.filter(x => x.lv === lv), nx = L.find(x => !st[x.id]);
  const open = p.lq >= GATE_LEARN && p.mq >= GATE_MEM, run = paRuns().filter(r => r.lv === lv).slice(-1)[0], wait = run && !run.pass ? Math.max(0, 7 - (dayOf(now) - dayOf(run.at))) : 0;
  $app.innerHTML = `<div id="part" data-p="pa"></div>${ovBack}<h1>👄 Phát âm</h1>
    <p class="mute">Cấp đang học: <b>${LVN[lv]}</b> (${p.T} bộ cặp âm). Mỗi bộ: một cặp âm người Việt hay nhầm, kèm cách đặt miệng.</p>
    <div class="box">
      <div class="row"><b>📘 Học ${p.lq}%</b><span class="mute">cần ${GATE_LEARN}% · ${p.learn}/${p.T} bộ</span></div>${bar(p.lq, GATE_LEARN, 'var(--accent)')}
      <div class="row" style="margin-top:10px"><b>🔁 Nhớ ${p.mq}%</b><span class="mute">= mặt thấp nhất · mỗi mặt cần ${GATE_MEM}%</span></div>${bar(p.mq, GATE_MEM, 'var(--good)')}
      <div class="dims">${PA_DIMS.map(([k, l]) => `<div><div class="row"><span>${l}</span><span class="${p.dq[k] >= GATE_MEM ? 'okc' : 'mute'}">${p.dq[k]}%</span></div>${bar(p.dq[k], GATE_MEM, 'var(--good)')}</div>`).join('')}</div>
      <p class="mute" style="margin:6px 0 0">👂 Phân biệt: nghe một từ, chọn đúng từ trong cặp. 👄 Đọc đúng: đọc từ có âm đó, bộ chấm âm ≥ 80. Tính khi đúng ở một ngày sau ngày học.</p>
    </div>
    <div class="duo">
      <button class="big2 ${p.due ? '' : 'pri'}" data-pa="learn" ${nx ? '' : 'disabled'}>📘 Học<small>${nx ? esc(nx.title) : `Đã học hết ${LVN[lv]}`}</small></button>
      <button class="big2 ${p.due ? 'pri' : ''}" data-pa="menu" ${p.learn ? '' : 'disabled'}>🏋️ Luyện tập<small>${!p.learn ? 'Học 1 bộ trước' : p.due ? `${p.due} bộ cần ôn` : 'Rèn 🔁 Nhớ'}</small></button>
    </div>
    <div class="box"><b>🚪 Thi chuyển cấp Phát âm ${LVN[lv]}</b>
      <p class="mute" style="margin:4px 0">Mở khi 📘 Học ${GATE_LEARN}% và mỗi mặt 🔁 Nhớ ≥ ${GATE_MEM}%. Mỗi bộ: 2 câu nghe + 1 từ đọc, toàn cặp chưa gặp. Đạt khi đúng ≥ ${PA_PASS * 100}%. Cần bộ chấm âm.</p>
      ${paPassed(lv) ? `<p>✅ Đã đạt Phát âm ${LVN[lv]}.</p>` : wait ? `<p class="mute">Lần trước chưa đạt (${run.ok}/${run.n}). Thi lại sau ${wait} ngày; trong lúc chờ, luyện tiếp.</p>`
        : `<button class="${open ? 'pri' : ''}" data-pa="exam" ${open ? '' : 'disabled'}>${open ? '🚪 Vào thi' : `🔒 Còn thiếu: ${p.lq < GATE_LEARN ? `học ${p.T - p.learn} bộ` : ''}${p.lq < GATE_LEARN && p.mq < GATE_MEM ? ' · ' : ''}${p.mq < GATE_MEM ? `Nhớ ${p.mq}% / ${GATE_MEM}%` : ''}`}</button>`}</div>
    <h2>Lộ trình</h2>
    <div class="chips">${PA_LV.map(l => `<button class="chip ${l === (PA_VIEW || lv) ? 'on' : ''}" data-palv="${l}">${paPassed(l) ? '✅ ' : paLocked(l) ? '🔒 ' : ''}${LVN[l]} · ${PA.filter(x => x.lv === l).length} bộ</button>`).join('')}</div>
    <div id="palist">${paList(PA_VIEW || lv, nx, now)}</div>
    ${nModelBox()}`;
  $app.onclick = e => { const b = e.target.closest('[data-pa]'), lb = e.target.closest('[data-palv]'), u = e.target.closest('[data-paset]');
    if (lb) { PA_VIEW = lb.dataset.palv; document.getElementById('palist').innerHTML = paList(PA_VIEW, nx, now); $app.querySelectorAll('[data-palv]').forEach(x => x.classList.toggle('on', x === lb)); return; }
    if (u) { if (paLocked(PABY[u.dataset.paset].lv)) return toast('Bộ này mở khi qua Thi chuyển cấp Phát âm cấp trước.'); return paLearn(PABY[u.dataset.paset]); }
    if (e.target.closest('[data-n="load"]')) return nLoad(), paView();
    if (!b) return; const a = b.dataset.pa;
    if (a === 'learn' && nx) paLearn(nx); if (a === 'menu') paMenu(); if (a === 'exam') paExam(lv); };
  window.scrollTo(0, 0);
}
let PA_VIEW = null;
function paList(lv, nx, now) { const st = paSt();
  return PA.filter(x => x.lv === lv).map(x => { const c = st[x.id], m = PA_DIMS.map(([k, l]) => `<span class="dm ${heldDim(c, k, now) ? 'on' : ''}" title="${l}">${l.split(' ')[0]}</span>`).join('');
    return `<button class="urow ${nx && nx.id === x.id ? 'next' : ''}" data-paset="${x.id}"><span>${c ? '🔵' : nx && nx.id === x.id ? '▶️' : '⚪'} ${esc(x.title)} <span class="mute">· ${esc(x.vi)}</span></span><span>${c ? m : ''}</span></button>`; }).join(''); }
// ô bộ chấm âm (tải / đang tải / sẵn sàng): dùng chung trạng thái của noi.js
const nModelBox = () => NO.vocab ? `<p class="mute">🧪 Bộ chấm âm đã sẵn sàng trên máy.</p>`
  : NO.loading ? `<p class="mute">⏳ Đang tải bộ chấm âm: <span id="nprog">${nProg()}</span></p>`
  : `<div class="box"><b>🧪 Bộ chấm âm</b><p class="mute" style="margin:4px 0">Mặt 👄 Đọc đúng và Thi chuyển cấp cần bộ chấm âm chạy trên máy. Tải miễn phí một lần (vài trăm MB, nên dùng Wi-Fi). Âm thanh không rời máy.</p><button data-n="load">⬇️ Tải bộ chấm</button></div>`;
// bộ chấm tải xong / lỗi khi đang ở màn Phát âm: vẽ lại để nút Đọc / Thi mở ngay
window.nOnModel = t => { if (t !== 'ready' && t !== 'error') return; const v = (window.CUR || {}).view; if (v === 'phat-am') paView(); else if (v === 'pa-luyen') paMenu(); };

// ---------- 👂 câu nghe phân biệt (dùng cho học, luyện, thi) ----------
// items: [{ x: bộ, p: cặp [từA, ipaA, từB, ipaB], k: 0 | 1 (từ được đọc) }]; quiet = thi (không hiện đáp án, không mẹo)
function paQuiz({ title, items, quiet, done }) { let i = 0; const res = [];
  const show = () => { if (i >= items.length) return done(res);
    const it = items[i], say = it.p[it.k * 2], o = [[it.p[0], it.p[1]], [it.p[2], it.p[3]]];
    window.CUR = { view: 'pa-nghe', item: it.x.id + ':' + say };
    $app.innerHTML = `${backRow(`${title} · ${i + 1}/${items.length}`)}<p class="q">👂 Nghe rồi chọn từ bạn nghe thấy</p>
      <p class="mute">${esc(it.x.title)} · ${esc(it.x.a)} – ${esc(it.x.b)}</p><button class="chip" data-sayt="${esc(say)}">🔊 Nghe lại</button>
      ${o.map(([w, ip], k) => `<button class="opt" data-k="${k}"><b>${esc(w)}</b> <span class="mute">/${esc(ip)}/</span></button>`).join('')}<div id="fb"></div>`;
    speak(say); let ans = false;
    $app.onclick = e => { if (e.target.closest('[data-a="home"]')) return (!quiet || confirm('Bỏ bài thi? Lần này không tính.')) && paView();
      if (e.target.closest('[data-a="go"]')) { i++; return show(); }
      const b = e.target.closest('[data-k]'); if (!b || ans) return; ans = true; const good = +b.dataset.k === it.k; res.push({ x: it.x, ok: good });
      if (quiet) { i++; return show(); }
      $app.querySelectorAll('[data-k]').forEach(x => { if (+x.dataset.k === it.k) x.classList.add('ok'); else if (x === b) x.classList.add('no'); });
      document.getElementById('fb').innerHTML = `<div class="box">${good ? '✅ Đúng.' : `❌ Từ vừa đọc là <b>${esc(say)}</b>.`} ${paSay(o[0][0])} ${paSay(o[1][0])}${good ? '' : `<p class="mute">${esc(it.x.tip)}</p>`}</div><button class="pri" data-a="go">Tiếp →</button>`; };
  };
  show(); }
const paPick = (x, src, n) => shuf(x[src]).slice(0, n).map(p => ({ x, p, k: Math.random() < 0.5 ? 0 : 1 }));
// chấm mỗi bộ một lần mỗi mặt trong lượt: đúng hết câu của bộ = đúng
function paGrade(res, type) { const by = new Map(), now = Date.now(); for (const r of res) by.set(r.x.id, (by.get(r.x.id) ?? true) && r.ok);
  for (const [id, ok] of by) grade({ cards: paSt() }, id, ok, now, type); save(); return by; }

// ---------- 📘 Học một bộ: cách đặt miệng + nghe các cặp + 6 câu nghe thử ----------
function paLearn(x) { window.CUR = { view: 'pa-hoc', item: x.id };
  $app.innerHTML = `${backRow('👄 ' + x.title)}<h1>${esc(x.title)}</h1><p class="mute">${esc(x.a)} – ${esc(x.b)} · ${esc(x.vi)}</p>
    <div class="box"><b>👄 Cách đặt miệng</b><p style="margin:6px 0 0">${esc(x.tip)}</p></div>
    <h2>Nghe từng cặp</h2><p class="mute">Bấm từng từ, nghe kỹ chỗ khác nhau, đọc theo.</p>
    ${x.pairs.map(p => `<div class="row" style="margin:6px 0"><span>${paSay(p[0])} <span class="mute">/${esc(p[1])}/</span></span><span>${paSay(p[2])} <span class="mute">/${esc(p[3])}/</span></span></div>`).join('')}
    <button class="pri" data-pl="quiz">👂 Nghe thử 6 câu →</button>`;
  $app.onclick = e => { if (e.target.closest('[data-a="home"]')) return paView(); if (!e.target.closest('[data-pl="quiz"]')) return;
    paQuiz({ title: '👂 ' + x.title, items: Array.from({ length: 6 }, () => paPick(x, 'pairs', 1)[0]), done: res => {
      const st = paSt(), first = !st[x.id], now = Date.now();
      if (first) st[x.id] = { S: 1, last: now, d0: dayOf(now), ok: 1, pv: 0, n: 0, lapse: 0 }; save();
      const ok = res.filter(r => r.ok).length;
      $app.innerHTML = `<div class="box"><b>✅ Xong bộ ${esc(x.title)}</b><p>Nghe đúng ${ok}/${res.length}.</p><p class="mute">${first ? 'Bộ này đã vào lịch ôn. Từ mai, 🏋️ Luyện tập mà đúng thì tính vào 🔁 Nhớ.' : 'Xem lại không đổi lịch ôn.'}</p></div>
        <button class="pri" data-pl="read">👄 Đọc thử 4 từ (không tính)</button><button data-a="home">Về 👄 Phát âm</button>`;
      $app.onclick = e => { if (e.target.closest('[data-a="home"]')) return paView(); if (e.target.closest('[data-pl="read"]')) paRead([x], 4, false); }; } }); };
  window.scrollTo(0, 0); }

// ---------- 👄 đọc (bộ nói của noi.js, mode 'am') ----------
function paRead(sets, per, counted) {
  const list = shuf(sets).flatMap(x => shuf(x.pairs).slice(0, per).map(p => Math.random() < 0.5 ? paW(p[0], p[1], x) : paW(p[2], p[3], x))).slice(0, 10);
  const res = [];
  NO.ses = { mode: 'am', list, i: 0, got: [], sc: [], show: false, title: '👄 Đọc đúng',
    sub: `Nghe mẫu rồi đọc theo. Đúng = điểm âm ≥ ${N_OK}.`, foot: counted ? 'Tính mặt 👄 Đọc đúng của 👄 Phát âm (mỗi bộ: đúng hết từ của bộ trong lượt).' : 'Đọc thử: chưa tính.',
    onGrade: (w, ok) => res.push({ x: PABY[w.set], ok }),
    onEnd: () => { const by = counted ? paGrade(res, 'pa_doc') : null, ok = res.filter(r => r.ok).length;
      $app.innerHTML = `<div class="box"><b>Xong lượt đọc</b><p>Đạt ${ok}/${res.length} từ (điểm âm ≥ ${N_OK}).</p>${by ? `<p class="mute">${[...by].map(([id, g]) => `${g ? '✅' : '❌'} ${esc(PABY[id].title)}`).join(' · ')}</p>` : ''}</div>
        <button class="pri" data-a="home">Về 👄 Phát âm</button>`;
      $app.onclick = e => { if (e.target.closest('[data-a="home"]')) paView(); }; } };
  noiOpen(list[0], true); }

// ---------- 🏋️ Luyện tập: chọn bộ đến hạn / thiếu mặt ----------
function paTargets(dim, n) { const now = Date.now(), st = paSt(), L = PA.filter(x => st[x.id] && !paLocked(x.lv));
  const r = x => { const c = st[x.id]; return (heldDim(c, dim, now) ? 2 : 0) + (dayOf(now) - c.d0 >= MEM_DAYS ? 0 : 1) + recall(c, now); };
  return shuf(L).sort((a, b) => r(a) - r(b)).slice(0, n); }
function paMenu() { window.CUR = { view: 'pa-luyen' }; const lv = paLevel(), p = paParts(lv);
  $app.innerHTML = `${backRow('🏋️ Luyện phát âm')}<h1>🏋️ Luyện phát âm</h1><p class="mute">👂 ${p.dq.pb}% · 👄 ${p.dq.doc}% (cấp ${LVN[lv]}). Máy chọn bộ đến hạn hoặc còn thiếu mặt.</p>
    <button class="opt ${p.dq.pb <= p.dq.doc ? 'pri' : ''}" data-pm="pb"><b>👂 Luyện phân biệt (12 câu)</b><br><span style="font-size:14px;opacity:.85">Nghe một từ, chọn đúng từ trong cặp. 4 bộ × 3 câu.</span></button>
    <button class="opt ${p.dq.doc < p.dq.pb ? 'pri' : ''}" data-pm="doc"><b>👄 Luyện đọc đúng (8 từ)</b><br><span style="font-size:14px;opacity:.85">Đọc từ, bộ chấm âm ≥ 80. 4 bộ × 2 từ. ${NO.vocab ? '' : 'Cần tải bộ chấm âm.'}</span></button>
    ${nModelBox()}`;
  $app.onclick = e => { if (e.target.closest('[data-a="home"]')) return paView(); if (e.target.closest('[data-n="load"]')) return nLoad(), paMenu();
    const b = e.target.closest('[data-pm]'); if (!b) return;
    if (b.dataset.pm === 'pb') { const T = paTargets('pb', 4); paQuiz({ title: '👂 Phân biệt', items: shuf(T.flatMap(x => paPick(x, 'pairs', 3))), done: res => {
      const by = paGrade(res, 'pa_pb'), ok = res.filter(r => r.ok).length, q = paParts(paLevel());
      $app.innerHTML = `<div class="box"><b>Xong lượt nghe</b><p>Đúng ${ok}/${res.length}. 👂 Phân biệt giờ là ${q.dq.pb}%.</p><p class="mute">${[...by].map(([id, g]) => `${g ? '✅' : '❌'} ${esc(PABY[id].title)}`).join(' · ')}</p></div>
        <button class="pri" data-a="again">Luyện tiếp</button><button data-a="home">Về 👄 Phát âm</button>`;
      $app.onclick = e => { if (e.target.closest('[data-a="home"]')) paView(); if (e.target.closest('[data-a="again"]')) paMenu(); }; } }); }
    else paRead(paTargets('doc', 4), 2, true); };
  window.scrollTo(0, 0); }

// ---------- 🚪 Thi chuyển cấp ----------
function paExam(lv) { if (!NO.vocab) { toast('Thi cần bộ chấm âm: tải bộ chấm trước.'); return paView(); }
  const L = PA.filter(x => x.lv === lv);
  if (!confirm(`Thi chuyển cấp Phát âm ${LVN[lv]}: ${L.length * 2} câu nghe + ${L.length} từ đọc, toàn cặp chưa gặp. Không xem đáp án giữa chừng. Bắt đầu?`)) return;
  paQuiz({ title: '🚪 Thi · nghe', quiet: true, items: shuf(L.flatMap(x => x.test.map(p => ({ x, p, k: Math.random() < 0.5 ? 0 : 1 })))), done: r1 => {
    const list = shuf(L.map(x => { const p = x.test[Math.floor(Math.random() * x.test.length)]; return Math.random() < 0.5 ? paW(p[0], p[1], x) : paW(p[2], p[3], x); })), r2 = [];
    NO.ses = { mode: 'am', list, i: 0, got: [], sc: [], show: false, title: '🚪 Thi · đọc', sub: `Đọc từ (chưa gặp). Đúng = điểm âm ≥ ${N_OK}. Lần đọc đầu được tính.`, foot: 'Bài thi chuyển cấp Phát âm.',
      onGrade: (w, ok) => r2.push(ok), onEnd: () => {
        const ok = r1.filter(r => r.ok).length + r2.filter(Boolean).length, n = r1.length + list.length, pass = ok >= Math.ceil(n * PA_PASS);
        paRuns().push({ lv, at: Date.now(), ok, n, pass, nghe: r1.filter(r => r.ok).length + '/' + r1.length, doc: r2.filter(Boolean).length + '/' + list.length }); save();
        $app.innerHTML = `<div class="box"><b>${pass ? `✅ Đạt Phát âm ${LVN[lv]}` : '❌ Chưa đạt'}</b><p>Đúng ${ok}/${n} (cần ${Math.ceil(n * PA_PASS)}). Nghe ${r1.filter(r => r.ok).length}/${r1.length} · Đọc ${r2.filter(Boolean).length}/${list.length}.</p>
          <p class="mute">${pass ? (lv !== PA_LV[PA_LV.length - 1] ? `Đã mở Phát âm ${LVN[PA_LV[PA_LV.indexOf(lv) + 1]]}.` : '') : 'Luyện tiếp; 7 ngày sau thi lại.'} Điểm do máy chấm, chưa người thật kiểm.</p></div>
          <button class="pri" data-a="home">Về 👄 Phát âm</button>`;
        $app.onclick = e => { if (e.target.closest('[data-a="home"]')) paView(); }; } };
    noiOpen(list[0], true); } }); }
