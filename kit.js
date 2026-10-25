// Bộ máy chung cho 5 phần 🧱 Ngữ pháp · 📰 Đọc · 🎧 Nghe · 🗣 Nói · ✍️ Viết (người sáng lập 25/10/2026: "tự làm hết";
// cấu trúc như 📚 Từ vựng: 📘 Học · 🔁 Nhớ theo mặt · 🏋️ Luyện tập · 🚪 Thi chuyển cấp; "dùng Nhớ như Từ vựng" cho cả kỹ năng).
//   📘 Học = đã học hết đơn vị của cấp. 🔁 Nhớ = mỗi mặt ≥ 80%: đúng ở một ngày sau ngày học, lần gần nhất đúng, khả năng nhớ ≥ 90% (grade() của app.js).
//   Một lượt luyện chấm mỗi đơn vị một lần mỗi mặt: đúng ≥ 80% câu của mặt đó trong lượt = đúng.
//   Thi chuyển cấp dùng câu / bài giữ riêng (dữ liệu *.json, tools/build-skills.mjs), không gặp khi học; trượt thì 7 ngày sau thi lại.
// Bằng chứng ở S.k[phần] = { cards, runs }: không đụng Từ vựng (S.cards) hay Phát âm (S.pa). Một câu chỉ chấm cho một phần.
const KIT = {}, K_RETRY = 7;
const kSt = id => { const k = (S.k = S.k || {}); return (k[id] = k[id] || { cards: {}, runs: [] }); };
const kNorm = s => String(s).toLowerCase().replace(/[‘’`]/g, "'").replace(/[“”]/g, '"').replace(/\s+/g, ' ').trim().replace(/[.!?,;:]+$/g, '').trim();
const kWords = s => String(s).toLowerCase().replace(/[‘’]/g, "'").replace(/[^a-z0-9' ]+/g, ' ').split(/\s+/).filter(Boolean);
// tỉ lệ từ của câu mẫu có trong câu người học (theo thứ tự, cho phép thiếu / thừa): dùng cho nghe chép và đọc to
function kMatch(target, said) { const t = kWords(target), s = kWords(said); let j = 0, hit = 0;
  for (const w of t) { const k = s.indexOf(w, j); if (k >= 0) { hit++; j = k + 1; } } return t.length ? hit / t.length : 0; }
// từ khoá ý (như game: nhóm VÀ, mỗi nhóm HOẶC; '@num' = số; 'x$' = đúng từ x)
const K_NUM = /\b(\d+|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety|hundred)\b/;
function kHit(text, idea) { const t = ' ' + String(text).toLowerCase().replace(/[‘’]/g, "'").replace(/\s+/g, ' ') + ' ';
  return idea.every(g => g.some(a => a === '@num' ? K_NUM.test(t) : a.endsWith('$') ? new RegExp(`\\b${a.slice(0, -1).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`).test(t) : t.includes(a))); }
const kLv = P => P.lvs.find(l => !kPassed(P, l)) || P.lvs[P.lvs.length - 1];
const kPassed = (P, lv) => kSt(P.id).runs.some(r => r.lv === lv && r.pass);
const kLocked = (P, lv) => P.lvs.indexOf(lv) > 0 && !kPassed(P, P.lvs[P.lvs.indexOf(lv) - 1]);
const kItems = (P, lv) => P.items.filter(x => x.lv === lv && !x.test);
function kParts(P, lv, now = Date.now()) { const L = kItems(P, lv), st = kSt(P.id).cards, dim = {}; let learn = 0, due = 0;
  for (const [k] of P.dims) dim[k] = 0;
  for (const x of L) { const c = st[x.id]; if (c) learn++; if (isDue(c, now)) due++; for (const [k] of P.dims) if (heldDim(c, k, now)) dim[k]++; }
  const T = L.length || 1, dq = {}; for (const [k] of P.dims) dq[k] = Math.floor(dim[k] / T * 100);
  return { T: L.length, learn, due, dim, dq, lq: Math.floor(learn / T * 100), mq: Math.min(...Object.values(dq)) }; }
async function kLoad(P) { if (P.items) return P; const d = await (await fetch(P.file)).json(); P.items = d.items; P.raw = d; P.by = {}; for (const x of d.items) P.by[x.id] = x;
  for (const [k] of P.dims) DIM_OF[P.id + '_' + k] = [k]; return P; }
const kGo = id => kView(id);

// ---------- màn chính của phần ----------
function kView(id) { const P = KIT[id];
  if (!P.items) { $app.innerHTML = `<div id="part" data-p="${id}"></div><p class="mute">Đang tải ${P.t}…</p>`; return kLoad(P).then(() => kView(id)).catch(() => { $app.innerHTML = `<div id="part" data-p="${id}"></div><p>Không tải được ${P.t}. Thử lại sau.</p>`; }); }
  BACK = () => kView(id); window.CUR = { view: 'phan-' + id };
  const now = Date.now(), lv = kLv(P), p = kParts(P, lv, now), st = kSt(id), L = kItems(P, lv), nx = L.find(x => !st.cards[x.id]);
  const open = p.lq >= GATE_LEARN && p.mq >= GATE_MEM, run = st.runs.filter(r => r.lv === lv).slice(-1)[0], wait = run && !run.pass ? Math.max(0, K_RETRY - (dayOf(now) - dayOf(run.at))) : 0;
  const view = P.view && P.lvs.includes(P.view) ? P.view : lv;
  $app.innerHTML = `<div id="part" data-p="${id}"></div>${ovBack}<h1>${P.ic} ${P.t}</h1>
    <p class="mute">Cấp đang học: <b>${LVN[lv]}</b> (${p.T} ${P.unit}). ${P.intro}</p>
    ${P.needAsr && !SREC ? `<div class="box">⚠️ Trình duyệt này không chép được lời nói. Phần ${P.t} chấm bằng máy chép lời: mở trang bằng <b>Safari</b>.</div>` : ''}
    <div class="box">
      <div class="row"><b>📘 Học ${p.lq}%</b><span class="mute">cần ${GATE_LEARN}% · ${p.learn}/${p.T}</span></div>${bar(p.lq, GATE_LEARN, 'var(--accent)')}
      <div class="row" style="margin-top:10px"><b>🔁 Nhớ ${p.mq}%</b><span class="mute">= mặt thấp nhất · mỗi mặt cần ${GATE_MEM}%</span></div>${bar(p.mq, GATE_MEM, 'var(--good)')}
      <div class="dims">${P.dims.map(([k, l, d]) => `<div><div class="row"><span>${l}</span><span class="${p.dq[k] >= GATE_MEM ? 'okc' : 'mute'}">${p.dq[k]}%</span></div>${bar(p.dq[k], GATE_MEM, 'var(--good)')}<div class="mute" style="font-size:12px">${d}</div></div>`).join('')}</div>
      <p class="mute" style="margin:6px 0 0">Mỗi mặt tính khi làm đúng ở một ngày sau ngày học; giữ khi lần gần nhất đúng và khả năng nhớ ≥ 90%.</p>
    </div>
    <div class="duo">
      <button class="big2 ${p.due ? '' : 'pri'}" data-k="learn" ${nx ? '' : 'disabled'}>📘 Học<small>${nx ? esc(P.name(nx)) : `Đã học hết ${LVN[lv]}`}</small></button>
      <button class="big2 ${p.due ? 'pri' : ''}" data-k="menu" ${p.learn ? '' : 'disabled'}>🏋️ Luyện tập<small>${!p.learn ? 'Học 1 bài trước' : p.due ? `${p.due} bài cần ôn` : 'Rèn 🔁 Nhớ'}</small></button>
    </div>
    <div class="box"><b>🚪 Thi chuyển cấp ${P.t} ${LVN[lv]}</b>
      <p class="mute" style="margin:4px 0">Mở khi 📘 Học ${GATE_LEARN}% và mỗi mặt 🔁 Nhớ ≥ ${GATE_MEM}%. ${P.examTxt} Đạt khi đúng ≥ ${Math.round(P.pass * 100)}%.</p>
      ${kPassed(P, lv) ? `<p>✅ Đã đạt ${P.t} ${LVN[lv]}.</p>` : wait ? `<p class="mute">Lần trước chưa đạt (${run.ok}/${run.n}). Thi lại sau ${wait} ngày; trong lúc chờ, luyện tiếp.</p>`
        : `<button class="${open ? 'pri' : ''}" data-k="exam" ${open ? '' : 'disabled'}>${open ? '🚪 Vào thi' : `🔒 Còn thiếu: ${p.lq < GATE_LEARN ? `học ${p.T - p.learn} bài` : ''}${p.lq < GATE_LEARN && p.mq < GATE_MEM ? ' · ' : ''}${p.mq < GATE_MEM ? `Nhớ ${p.mq}% / ${GATE_MEM}%` : ''}`}</button>`}</div>
    <h2>Lộ trình</h2>
    <div class="chips">${P.lvs.map(l => `<button class="chip ${l === view ? 'on' : ''}" data-klv="${l}">${kPassed(P, l) ? '✅ ' : kLocked(P, l) ? '🔒 ' : ''}${LVN[l]} · ${kItems(P, l).length}</button>`).join('')}</div>
    <div id="klist">${kList(P, view, nx, now)}</div>`;
  $app.onclick = e => { const b = e.target.closest('[data-k]'), lb = e.target.closest('[data-klv]'), u = e.target.closest('[data-kx]');
    if (lb) { P.view = lb.dataset.klv; return kView(id); }
    if (u) { const x = P.by[u.dataset.kx]; if (kLocked(P, x.lv)) return toast(`Bài này mở khi qua Thi chuyển cấp ${P.t} cấp trước.`); return kLearn(P, x); }
    if (!b) return; const a = b.dataset.k;
    if (a === 'learn' && nx) kLearn(P, nx); if (a === 'menu') kMenu(P); if (a === 'exam') kExam(P, lv); };
  window.scrollTo(0, 0); }
function kList(P, lv, nx, now) { const st = kSt(P.id).cards;
  return kItems(P, lv).map(x => { const c = st[x.id], m = P.dims.map(([k, l]) => `<span class="dm ${heldDim(c, k, now) ? 'on' : ''}" title="${l}">${l.split(' ')[0]}</span>`).join('');
    return `<button class="urow ${nx && nx.id === x.id ? 'next' : ''}" data-kx="${x.id}"><span>${c ? '🔵' : nx && nx.id === x.id ? '▶️' : '⚪'} ${esc(P.name(x))}</span><span>${c ? m : ''}</span></button>`; }).join(''); }

// ---------- 📘 Học một bài: phần giảng (P.lesson) + làm thử (không tính) ----------
function kLearn(P, x) { window.CUR = { view: P.id + '-hoc', item: x.id };
  $app.innerHTML = `${backRow(P.ic + ' ' + P.name(x))}${P.lesson(x)}<button class="pri" data-kl="try">Làm thử →</button>`;
  $app.onclick = e => { if (e.target.closest('[data-a="home"]')) return kView(P.id);
    if (e.target.closest('[data-kl="vi"]')) { const v = document.getElementById('kvi'); if (v) v.hidden = !v.hidden; return; }
    if (!e.target.closest('[data-kl="try"]')) return;
    kQuiz({ P, title: '📘 ' + P.name(x), qs: P.tryQs(x), done: res => {
      const st = kSt(P.id).cards, first = !st[x.id], now = Date.now();
      if (first) st[x.id] = { S: 1, last: now, d0: dayOf(now), ok: 1, pv: 0, n: 0, lapse: 0 }; save();
      const ok = res.filter(r => r.ok).length;
      $app.innerHTML = `<div class="box"><b>✅ Xong: ${esc(P.name(x))}</b><p>Làm thử đúng ${ok}/${res.length}.</p><p class="mute">${first ? 'Bài này đã vào lịch ôn. Từ mai, 🏋️ Luyện tập mà đúng thì tính vào 🔁 Nhớ.' : 'Xem lại không đổi lịch ôn.'}</p></div>
        <button class="pri" data-a="home">Về ${P.ic} ${P.t}</button>`;
      $app.onclick = e => { if (e.target.closest('[data-a="home"]')) kView(P.id); }; } }); };
  window.scrollTo(0, 0); }

// ---------- 🏋️ Luyện tập ----------
function kTargets(P, k, n) { const now = Date.now(), st = kSt(P.id).cards, L = P.items.filter(x => !x.test && st[x.id] && !kLocked(P, x.lv));
  const r = x => { const c = st[x.id]; return (heldDim(c, k, now) ? 2 : 0) + (dayOf(now) - c.d0 >= MEM_DAYS ? 0 : 1) + recall(c, now); };
  return shuf(L).sort((a, b) => r(a) - r(b)).slice(0, n); }
function kMenu(P) { window.CUR = { view: P.id + '-luyen' }; const lv = kLv(P), p = kParts(P, lv);
  const low = P.dims.map(([k]) => k).sort((a, b) => p.dq[a] - p.dq[b])[0];
  $app.innerHTML = `${backRow('🏋️ Luyện ' + P.t)}<h1>🏋️ Luyện ${P.t}</h1><p class="mute">${P.dims.map(([k, l]) => `${l} ${p.dq[k]}%`).join(' · ')} (cấp ${LVN[lv]}). Máy chọn bài đến hạn hoặc còn thiếu mặt.</p>
    ${P.menu.map(([m, t, sub, ks], i) => `<button class="opt ${ks.includes(low) ? 'pri' : ''}" data-km="${i}"><b>${t}</b>${ks.includes(low) ? ' · nên làm' : ''}<br><span style="font-size:14px;opacity:.85">${sub}</span></button>`).join('')}`;
  $app.onclick = e => { if (e.target.closest('[data-a="home"]')) return kView(P.id); const b = e.target.closest('[data-km]'); if (!b) return;
    const [m, t, , ks, n] = P.menu[+b.dataset.km], T = kTargets(P, ks[0], n);
    kQuiz({ P, title: t, qs: T.flatMap(x => P.ask(x, m)), done: res => {
      const by = kGrade(P, res), q = kParts(P, kLv(P)), ok = res.filter(r => r.ok).length;
      $app.innerHTML = `<div class="box"><b>Xong lượt</b><p>Đúng ${ok}/${res.length}. ${P.dims.map(([k, l]) => `${l} ${q.dq[k]}%`).join(' · ')}</p>
        <p class="mute">${by.map(([x, k, g]) => `${g ? '✅' : '❌'} ${esc(P.name(x))} (${P.dims.find(d => d[0] === k)[1]})`).join(' · ')}</p></div>
        <button class="pri" data-a="again">Luyện tiếp</button><button data-a="home">Về ${P.ic} ${P.t}</button>`;
      $app.onclick = e => { if (e.target.closest('[data-a="home"]')) kView(P.id); if (e.target.closest('[data-a="again"]')) kMenu(P); }; } }); };
  window.scrollTo(0, 0); }
// chấm mỗi đơn vị một lần mỗi mặt: đúng ≥ 80% câu của mặt trong lượt
function kGrade(P, res) { const g = new Map(), now = Date.now();
  for (const r of res) { const key = r.x.id + '|' + r.k, o = g.get(key) || { x: r.x, k: r.k, ok: 0, n: 0 }; o.n++; if (r.ok) o.ok++; g.set(key, o); }
  const out = []; for (const o of g.values()) { const ok = o.ok >= Math.ceil(o.n * 0.8); grade({ cards: kSt(P.id).cards }, o.x.id, ok, now, P.id + '_' + o.k); out.push([o.x, o.k, ok]); }
  save(); return out; }

// ---------- 🚪 Thi chuyển cấp ----------
function kExam(P, lv) { if (P.needAsr && !SREC) return toast('Phần này cần máy chép lời: mở trang bằng Safari.');
  const qs = P.exam(lv);
  if (!confirm(`Thi chuyển cấp ${P.t} ${LVN[lv]}: ${qs.length} câu, toàn bài / câu chưa gặp. Không xem đáp án giữa chừng. Bắt đầu?`)) return;
  kQuiz({ P, title: '🚪 Thi ' + P.t, qs, quiet: true, done: res => {
    const ok = res.filter(r => r.ok).length, n = res.length, need = Math.ceil(n * P.pass), pass = ok >= need;
    kSt(P.id).runs.push({ lv, at: Date.now(), ok, n, pass }); save();
    const by = {}; for (const r of res) { const o = by[r.k] = by[r.k] || [0, 0]; o[1]++; if (r.ok) o[0]++; }
    $app.innerHTML = `<div class="box"><b>${pass ? `✅ Đạt ${P.t} ${LVN[lv]}` : '❌ Chưa đạt'}</b><p>Đúng ${ok}/${n} (cần ${need}). ${P.dims.filter(([k]) => by[k]).map(([k, l]) => `${l} ${by[k][0]}/${by[k][1]}`).join(' · ')}</p>
      <p class="mute">${pass ? (lv !== P.lvs[P.lvs.length - 1] ? `Đã mở ${P.t} ${LVN[P.lvs[P.lvs.indexOf(lv) + 1]]}.` : '') : `Luyện tiếp; ${K_RETRY} ngày sau thi lại.`} Máy chấm, chưa người thật kiểm.</p></div>
      <button class="pri" data-a="home">Về ${P.ic} ${P.t}</button>`;
    $app.onclick = e => { if (e.target.closest('[data-a="home"]')) kView(P.id); }; } }); }

// ---------- chạy câu hỏi ----------
// q = { x, k, kind: 'mc' | 'type' | 'write' | 'speak', head?, q, opts?, a?, acc?, check?(text) → { ok, html, ks? }, say?, why? }
// check có thể trả ks = { mặt: đúng / sai } để một câu chấm nhiều mặt (bài viết: ✅ Đủ ý + 📝 Đúng dạng bài).
function kQuiz({ P, title, qs, quiet, done }) { let i = 0; const res = []; let said = null;
  const push = (q, r) => { if (r.ks) for (const [k, ok] of Object.entries(r.ks)) res.push({ x: q.x, k, ok }); else res.push({ x: q.x, k: q.k, ok: r.ok }); };
  const show = () => { kAsrStop(); if (i >= qs.length) return done(res);
    const q = qs[i]; window.CUR = { view: P.id + '-cau', item: q.x.id + ':' + q.k, prompt: q.q };
    const body = q.kind === 'mc' ? q.opts.map((o, k) => `<button class="opt" data-ko="${k}">${esc(o)}</button>`).join('')
      : q.kind === 'type' ? `<form id="kf" autocomplete="off"><input id="kt" autocapitalize="off" autocorrect="off" spellcheck="false" aria-label="Câu trả lời"><button class="pri" type="submit">Kiểm tra</button></form>`
      : q.kind === 'write' ? `<form id="kf" autocomplete="off"><textarea id="kt" rows="7" autocapitalize="sentences" spellcheck="false" aria-label="Bài viết"></textarea><p class="mute" id="kwc">0 từ</p><button class="pri" type="submit">Nộp bài</button></form>`
      : `<button class="pri" data-ks="rec" ${SREC ? '' : 'disabled'}>🎤 Bấm rồi nói</button><div class="box"><b>📝 Máy nghe ra:</b> <span id="kheard">…</span></div>${SREC ? '' : '<p class="mute">Trình duyệt này không chép được lời: mở bằng Safari.</p>'}`;
    $app.innerHTML = `${backRow(`${title} · ${i + 1}/${qs.length}`)}${q.head || ''}<p class="q">${q.q}</p>${body}<div id="fb"></div>`;
    if (q.say && said !== q.say) { said = q.say; speak(...[].concat(q.say)); }
    let ans = false;
    const fin = r => { if (ans) return; ans = true; push(q, r); if (quiet) { i++; return show(); }
      document.getElementById('fb').innerHTML = `<div class="box">${r.ok ? '✅ Đúng.' : '❌ Chưa đúng.'} ${r.html || ''}${q.after || ''}</div><button class="pri" data-a="go">Tiếp →</button>`;
      document.getElementById('fb').scrollIntoView({ block: 'nearest' }); };
    const f = document.getElementById('kf'), t = document.getElementById('kt');
    if (f) { if (q.kind === 'write') t.oninput = () => { document.getElementById('kwc').textContent = kWords(t.value).length + ' từ'; };
      f.onsubmit = e => { e.preventDefault(); if (!t.value.trim()) return t.focus(); t.disabled = true; f.querySelector('button').remove();
        fin(q.check ? q.check(t.value) : (() => { const ok = q.acc.some(a => kNorm(a) === kNorm(t.value)); return { ok, html: ok ? '' : `Đáp án: <b>${esc(q.acc[0])}</b>.${q.why ? ' ' + esc(q.why) : ''}` }; })()); }; }
    $app.onclick = e => { if (e.target.closest('[data-a="home"]')) { if (quiet && !confirm('Bỏ bài thi? Lần này không tính.')) return; kAsrStop(); return kView(P.id); }
      if (e.target.closest('[data-a="go"]')) { i++; return show(); }
      if (e.target.closest('[data-ks="rec"]') && !ans) { const b = e.target.closest('[data-ks="rec"]');
        if (K_ASR.on) { b.disabled = true; b.textContent = '⏳ Đang chấm…'; return kAsrStop(txt => fin(q.check(txt))); }
        b.textContent = '⏹ Dừng'; return kAsrStart(txt => { const h = document.getElementById('kheard'); if (h) h.textContent = txt || '…'; }); }
      const o = e.target.closest('[data-ko]'); if (!o || ans || q.kind !== 'mc') return;
      const ok = q.opts[+o.dataset.ko] === q.a;
      if (!quiet) $app.querySelectorAll('[data-ko]').forEach(x => { if (q.opts[+x.dataset.ko] === q.a) x.classList.add('ok'); else if (x === o) x.classList.add('no'); });
      const w = q.why && typeof q.why === 'object' ? q.why[q.opts[+o.dataset.ko]] : q.why;
      fin({ ok, html: ok ? '' : (w ? esc(w) : `Đáp án: <b>${esc(q.a)}</b>.`) }); };
  };
  show(); }

// ---------- máy chép lời (Nói): nghe liên tục tới khi bấm Dừng ----------
const K_ASR = { on: false, r: null, fin: '', tmp: '', cb: null };
function kAsrStart(onText) { if (!SREC) return; let r; try { r = new SREC(); } catch (e) { return; }
  Object.assign(K_ASR, { on: true, r, fin: '', tmp: '' }); r.lang = 'en-US'; r.interimResults = true; r.continuous = true;
  r.onresult = e => { let tmp = ''; for (let i = e.resultIndex; i < e.results.length; i++) { const t = e.results[i][0].transcript; if (e.results[i].isFinal) K_ASR.fin += ' ' + t; else tmp += ' ' + t; }
    K_ASR.tmp = tmp; onText((K_ASR.fin + tmp).trim()); };
  // iPhone hay tự ngắt khi ngừng nhịp: còn đang nghe thì bật lại (giữ chữ đã có)
  r.onend = () => { if (K_ASR.on && K_ASR.r === r) { K_ASR.fin += ' ' + K_ASR.tmp; K_ASR.tmp = ''; try { r.start(); } catch (e) {} } else if (K_ASR.cb) { const cb = K_ASR.cb; K_ASR.cb = null; cb((K_ASR.fin + ' ' + K_ASR.tmp).trim()); } };
  r.onerror = () => {};
  try { r.start(); } catch (e) { K_ASR.on = false; } }
function kAsrStop(cb) { const r = K_ASR.r; if (!K_ASR.on) { if (cb) cb((K_ASR.fin + ' ' + K_ASR.tmp).trim()); return; }
  K_ASR.on = false; K_ASR.cb = cb || null; try { r && r.stop(); } catch (e) {}
  // máy không trả onend (Chrome / Cốc Cốc trên iPhone có thể vậy): 2,5 giây sau chấm với chữ đã có
  if (cb) setTimeout(() => { if (K_ASR.cb === cb) { K_ASR.cb = null; cb((K_ASR.fin + ' ' + K_ASR.tmp).trim()); } }, 2500); }
