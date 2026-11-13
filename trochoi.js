// v167–v168 🎮 Trò chơi Reading TOEIC (specs/018-toeic-tro-choi; người sáng lập 13/11/2026: "tạo trò chơi để nhớ từ vựng, ngữ nghĩa, cấu trúc để làm bài Reading tốt",
//   "đặt thành 1 mục trong Luyện đề", "lấy nội dung tất cả đề"; v168: "chọn đề được để làm nội dung chơi, chơi hết 1 đề đã chọn, làm hết tất cả trò chơi còn lại").
//   KHÔNG đổi luật đo, không ghi điểm đề thử, không ghi bản đồ điểm TOEIC, không tạo thẻ học.
// Nội dung: câu của MỘT đề thử trọn người học chọn (TO.tron: Đề 1–8 + đề riêng đã mở mã trên máy; S.to.tc.de). Mỗi trò chơi hết đề theo lượt TG_N mục:
//   mục chưa chơi theo thứ tự đề (câu làm sai trong 📋 bài làm đề lên trước) → hết thì mục đến hạn ôn → hết thì "đã chơi hết đề", chơi lại mục sai / cả đề.
// 6 trò: 🔁 Săn cặp (Part 7 ev ↔ đáp án) · 🏃 Đua dò tin (Part 7: chạm câu chứa đáp án trong văn bản) · 🧩 Họ từ (Part 5 dạng từ) ·
//   🔗 Cụm hay dùng (cụm "tiếng Anh = nghĩa" trong lời giải lg.ct, ghép như Săn cặp) · 🔀 Từ nối (Part 6 từ nối + Part 5 liên từ: quan hệ hai vế → chọn từ) ·
//   🎯 Bắn nhiễu (Part 5: loại 3 phương án sai, chạm trúng đáp án là thua).
// Lịch ôn riêng S.to.tc.it[mã] = { b: hộp 0–4, d: ngày gặp lại, t: ngày chơi gần nhất, n, w }: sai → hộp 0, gặp lại ngày sau; đúng → hộp +1, gặp lại sau TG_I ngày.
// Đếm dùng S.to.tc.st[trò] = { r: số lượt, q: số mục, ok: đúng lần đầu, rv: số mục ôn lại, rvok: ôn lại đúng } (SC-003).
const TG_N = 5, TG_I = [1, 3, 7, 21], TG_EVW = 15, TG_VIEW = 'toeic-tro-choi';
const TG_G = [   // [mã, biểu tượng, tên, mô tả, đơn vị]
  ['pair', '🔁', 'Săn cặp diễn đạt lại', 'Part 7 · ghép chữ trong bài với chữ trong đáp án', 'cặp'],
  ['dt', '🏃', 'Đua dò tin', 'Part 7 · chạm câu chứa đáp án trong văn bản', 'câu'],
  ['ho', '🧩', 'Họ từ', 'Part 5 · nhận ra loại từ rồi điền câu', 'câu'],
  ['cum', '🔗', 'Cụm hay dùng', 'Part 5–7 · ghép cụm tiếng Anh với nghĩa', 'cụm'],
  ['noi', '🔀', 'Từ nối', 'Part 5–6 · nhận ra quan hệ hai vế rồi chọn từ', 'câu'],
  ['ban', '🎯', 'Bắn nhiễu', 'Part 5 · loại 3 phương án sai, giữ đáp án', 'câu']];
const TG_GN = Object.fromEntries(TG_G.map(g => [g[0], g]));
// quan hệ hai vế của từ nối / liên từ (từ không có ở đây thì bỏ bước 1)
const TG_CAT = { 'thêm ý': ['in addition', 'furthermore', 'moreover', 'also', 'and', 'besides', 'additionally'], 'đối lập': ['however', 'although', 'though', 'even though', 'despite', 'in spite of', 'nevertheless', 'but', 'yet', 'whereas'],
  'kết quả / mục đích': ['therefore', 'as a result', 'consequently', 'thus', 'so that', 'so', 'in order to'], 'nguyên nhân': ['because', 'because of', 'due to', 'since', 'as'],
  'điều kiện': ['if', 'unless', 'as long as', 'in case', 'provided that'], 'thời gian': ['once', 'as soon as', 'since then', 'when', 'until', 'before', 'after', 'meanwhile'],
  'lựa chọn': ['or', 'either', 'nor', 'neither', 'alternatively', 'otherwise'], 'nhấn mạnh': ['of course', 'in fact', 'indeed', 'actually'] };
const tgCat = w => { const k = String(w || '').toLowerCase().trim(); for (const [c, ws] of Object.entries(TG_CAT)) if (ws.includes(k)) return c; return null; };
const tgSt = () => { const o = toSt(); o.tc = o.tc || { it: {}, st: {} }; o.tc.it = o.tc.it || {}; o.tc.st = o.tc.st || {}; return o.tc; };
const tgDay = () => dayOf(Date.now());
const TG_VN = /[àáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ]/i;
// loại từ đọc từ lời giải ("trạng từ: trực tiếp"); không rõ thì null
function tgPos(v) { const k = String(v || '').split(':')[0].trim().toLowerCase();
  if (/\//.test(k.replace(/v3 \/ quá khứ/, 'v3')) || /so sánh/.test(k)) return null;
  if (/^danh từ/.test(k)) return 'danh từ'; if (/^tính từ/.test(k)) return 'tính từ'; if (/^trạng từ/.test(k)) return 'trạng từ';
  if (/^(v3|v-ing|phân từ)/.test(k)) return 'V3 / V-ing'; if (/^động từ/.test(k)) return 'động từ'; return null; }
// cụm "tiếng Anh = nghĩa" trong lời giải ("request a refund = ask for a refund = yêu cầu hoàn tiền · within 30 days = trong vòng 30 ngày")
function tgCums(ct) { const out = [];
  for (const seg of String(ct || '').split(' · ')) { const p = seg.split(' = ').map(s => s.trim()); if (p.length < 2) continue; const L = p[0], R = p[p.length - 1];
    if (!L || !R || TG_VN.test(L) || !TG_VN.test(R) || /[+…→]/.test(L) || L.length > 40 || R.length > 50) continue; out.push([L, R]); }
  return out; }
// tách văn bản thành câu theo vị trí gốc (không ghép lại bằng dấu cách; không dùng lookbehind: Safari cũ lỗi cú pháp):
//   chỉ cắt sau . ! ? khi theo sau là dấu cách + chữ hoa / số / ngoặc, không cắt sau Mr. Ms. a.m. A.M. chữ viết tắt một chữ hoa
const TG_ABBR = /(\b(Mr|Ms|Mrs|Dr|St|No|Inc|Co|Ltd|etc|Jr|Sr|Ave|Rd|vs|a\.m|p\.m|e\.g|i\.e)|\b[A-Z])\.$/;
function tgSents(text) { const out = [];
  for (const line of String(text || '').split('\n')) { const re = /[.!?]+(?=\s+["“(A-Z0-9])/g; let st = 0, m;
    while ((m = re.exec(line))) { const end = m.index + m[0].length, s = line.slice(st, end).trim(); if (TG_ABBR.test(s)) continue; if (s) out.push(s); st = end; }
    const rest = line.slice(st).trim(); if (rest) out.push(rest); }
  return out; }
const tgNorm = s => String(s || '').toLowerCase().replace(/[“”"’']/g, "'").replace(/\s+/g, ' ').trim();
const tgHit = (sent, ev) => { const a = tgNorm(sent), e = tgNorm(ev); return a.includes(e.slice(0, 25)) || (a.length >= 12 && e.includes(a.replace(/[.!?]+$/, ''))); };
// câu đã làm sai trong mọi bài làm 📋 đã lưu của đề (cả đề, một phần, từng lượt)
function tgWrong(de, B) { const w = new Set(); for (const k of Object.keys(toSt().tronA || {})) { if (k !== de && !k.startsWith(de + ':')) continue;
  const A = trAGet(de, k); if (!A) continue; for (const q of B.Q) if (trSt3(q, String(A.a || '')[q.n - 1]) === 'no') w.add(q.n); } return w; }
// kho mục của mọi đề: P[de][trò] = [mục]; mục theo thứ tự câu trong đề, câu làm sai lên trước khi chơi
async function tgPool() { const P = {}, D = (typeof TO !== 'undefined' && TO && TO.tron) || [];
  for (const d of D) if (d.f && !TR.D[d.id]) await trLoad(d.id);
  for (const d of D) { const B = trB(d.id); if (!B) continue; const wr = tgWrong(d.id, B), G = P[d.id] = { pair: [], dt: [], ho: [], cum: [], noi: [], ban: [] }, seen = new Set();
    for (const q of B.Q) { const id = d.id + ':' + q.n, w = wr.has(q.n), lg = q.lg || {}, base = { de: d.id, q, w };
      if (q.sec === 'p7' && q.ev && q.qt !== 'not' && !/^\[\d\]$/.test(q.a)) {
        if (q.ev.split(/\s+/).length <= TG_EVW && !seen.has('L' + q.ev) && !seen.has('R' + q.a)) { seen.add('L' + q.ev); seen.add('R' + q.a); G.pair.push({ ...base, id: 'pair:' + id, L: q.ev, R: q.a, vL: lg.dich || '', vR: (lg.og || {})[q.a] || '' }); }
        const docs = q.x.docs.map(dc => ({ title: dc.title, ss: tgSents(dc.text) })); if (docs.some(dc => dc.ss.some(s => tgHit(s, q.ev)))) G.dt.push({ ...base, id: 'dt:' + id, set: q.x.id, docs }); }
      if (q.sec === 'p5' && q.x && q.x.t === 'form' && lg.og && q.opts.every(o => lg.og[o])) { const pos = Object.fromEntries(q.opts.map(o => [o, tgPos(lg.og[o])])), pa = pos[q.a];
        G.ho.push({ ...base, id: id, pos, ask: pa && q.opts.filter(o => pos[o] === pa).length === 1 ? pa : null }); }   // mã cũ (v167) giữ cho Họ từ
      if (lg.ct) tgCums(lg.ct).forEach(([L, R], k) => { const key = 'C' + L.toLowerCase(); if (seen.has(key) || seen.has('V' + R)) return; seen.add(key); seen.add('V' + R); G.cum.push({ ...base, id: 'cum:' + id + ':' + k, L, R, vL: '', vR: '' }); });
      if ((q.sec === 'p6' && q.gt === 'conn') || (q.sec === 'p5' && q.x && q.x.t === 'conj')) G.noi.push({ ...base, id: 'noi:' + id, cat: tgCat(q.a) });
      if (q.sec === 'p5' && lg.og && q.opts.every(o => lg.og[o])) G.ban.push({ ...base, id: 'ban:' + id }); } }
  return P; }
// lượt kế tiếp trong một đề: chưa chơi (sai trong đề trước, rồi theo thứ tự đề) → đến hạn ôn; mode 'sai' = mục đang sai, 'all' = cả đề xáo
function tgNext(list, mode, n = TG_N) { const I = tgSt().it, t = tgDay();
  if (mode === 'sai') return shuf(list.filter(x => I[x.id] && I[x.id].b === 0)).slice(0, n);
  if (mode === 'all') return shuf(list).slice(0, n);
  const fresh = list.filter(x => !I[x.id]); if (fresh.length) return [...fresh.filter(x => x.w), ...fresh.filter(x => !x.w)].slice(0, n);
  return list.filter(x => I[x.id].d <= t && I[x.id].t !== t).sort((a, b) => I[a.id].d - I[b.id].d).slice(0, n); }
function tgProg(list) { const I = tgSt().it, t = tgDay(); let pl = 0, sai = 0, due = 0;
  for (const x of list) { const z = I[x.id]; if (!z) continue; pl++; if (z.b === 0) sai++; if (z.d <= t && z.t !== t) due++; }
  return { n: list.length, pl, sai, due, left: list.length - pl }; }
function tgMark(game, x, ok) { const T = tgSt(), t = tgDay(), z = T.it[x.id] || { b: 0, n: 0, w: 0 }, st = T.st[game] = T.st[game] || { r: 0, q: 0, ok: 0, rv: 0, rvok: 0 };
  if (z.n) { st.rv++; if (ok) st.rvok++; } else { st.q++; if (ok) st.ok++; }
  z.n++; if (ok) z.b = Math.min(z.b + 1, TG_I.length); else { z.w++; z.b = 0; } z.t = t; z.d = t + (ok ? TG_I[z.b - 1] : 1); T.it[x.id] = z; }
const tgDe = () => { const D = ((TO && TO.tron) || []).filter(d => TG_P && TG_P[d.id]), c = tgSt().de; return D.some(d => d.id === c) ? c : (D[0] || {}).id; };
const tgHead = (g, i, n) => `<div id="ie"></div><div class="row top"><button class="link tap" data-tgv>‹ Trò chơi</button><span class="mute">${esc(trName(tgDe()))} · ${i}/${n}</span></div><h2 style="margin:4px 0 8px">${TG_GN[g][1]} ${TG_GN[g][2]}</h2>`;
const tgBack = e => { if (e.target.closest('[data-tgv]')) { $app.onkeydown = null; tgView(); return true; } return false; };

// ---------- màn đầu: chọn đề + 6 trò ----------
let TG_P = null;
async function tgView() { window.CUR = { view: TG_VIEW }; BACK = null; scrollTo(0, 0);
  if (!TG_P) { $app.innerHTML = '<div id="ie"></div><p class="mute">Đang tải các đề…</p>'; await toLoad(); TG_P = await tgPool(); if (window.CUR.view !== TG_VIEW) return; }
  const D = ((TO && TO.tron) || []).filter(d => TG_P[d.id]), de = tgDe(), G = TG_P[de] || {};
  const all = TG_G.flatMap(g => G[g[0]] || []), pa = tgProg(all), wn = all.filter(x => x.w).length;
  const chip = d => { const p = tgProg(TG_G.flatMap(g => TG_P[d.id][g[0]])); return `<button class="chip${d.id === de ? ' on' : ''}" data-tgde="${esc(d.id)}" aria-pressed="${d.id === de}">${esc(d.t)}${p.pl && !p.left ? ' ✓' : ''}</button>`; };
  const row = g => { const L = G[g[0]] || [], p = tgProg(L), can = L.length >= (g[0] === 'pair' || g[0] === 'cum' ? 2 : 1);
    const sub = !L.length ? (g[0] === 'pair' || g[0] === 'dt' ? 'Đề này chưa có câu chứa đáp án ở Part 7' : 'Đề này không có câu dạng này')
      : !p.pl ? `${g[3]} · ${L.length} ${g[4]}` : p.left ? `Đã chơi ${p.pl}/${L.length} ${g[4]}${p.sai ? ` · ${p.sai} đang sai` : ''}` : `✓ Đã chơi hết ${L.length} ${g[4]}${p.due ? ` · ${p.due} cần chơi lại` : p.sai ? ` · ${p.sai} đang sai` : ''}`;
    return `<button class="hrow${p.n && !p.left ? ' ok' : ''}" data-tgg="${g[0]}"${can ? '' : ' disabled'}><span class="ic">${g[1]}</span><span class="t"><b>${g[2]}</b><small>${sub}</small></span><span class="chev">›</span></button>`; };
  $app.innerHTML = `<div id="ie"></div><div class="row top"><button class="link tap" data-tgb>‹ TOEIC</button></div>
    <h1>🎮 Trò chơi Reading</h1><p class="mute" style="margin-top:0">Chọn một đề, chơi hết từng trò. Mỗi lượt ${TG_N} mục, khoảng 1–2 phút.</p>
    <p class="tgs" style="margin-top:4px">Chọn đề</p><div class="chips tap">${D.map(chip).join('')}</div>
    <div class="box"><b>📝 ${esc(trName(de))} · đã chơi ${pa.pl}/${pa.n} mục</b><div class="bar"><i style="width:${pa.n ? Math.round(pa.pl / pa.n * 100) : 0}%;background:var(--good)"></i></div>
      <p class="mute" style="margin:2px 0 0">${pa.due ? `🔁 ${pa.due} mục cần chơi lại hôm nay. ` : ''}${wn ? `${wn} mục từ câu bạn làm sai trong đề, chơi trước.` : 'Chưa làm đề này? Câu nào bạn làm sai sau này sẽ được chơi trước.'}</p></div>
    <div class="box hcard">${TG_G.map(row).join('')}</div>
    <p class="mute" style="font-size:14px">⚠️ Trò chơi dùng câu thật của đề. Làm lại đề đã chơi thì điểm sẽ cao hơn thực lực. Không tính vào điểm đề thử, 📘 Học hay 🔁 Nhớ.</p>`;
  $app.onclick = e => { if (e.target.closest('[data-tgb]')) { EX_PART = 'san'; toeicView(); return; }
    const c = e.target.closest('[data-tgde]'); if (c) { tgSt().de = c.dataset.tgde; save(); tgView(); return; }
    const b = e.target.closest('[data-tgg]'); if (b && !b.disabled) tgPlay(b.dataset.tgg); }; }
// mở một lượt của trò; hết mục chưa chơi và mục đến hạn thì màn "đã chơi hết đề"
function tgPlay(g, mode) { const L = (TG_P[tgDe()] || {})[g] || [], its = tgNext(L, mode, g === 'dt' ? 99 : TG_N);
  if (!its.length) return tgDoneDe(g);
  if (g === 'dt') { const set = its[0].set; return tgDt(its.filter(x => x.set === set).slice(0, TG_N), mode); }
  if ((g === 'pair' || g === 'cum') && its.length < 2) { const more = tgNext(L, 'all').filter(x => x !== its[0]); its.push(more[0]); }
  ({ pair: tgMatch, cum: tgMatch, ho: tgHo, noi: tgNoi, ban: tgBan })[g](g, its, mode); }
function tgDoneDe(g) { const L = TG_P[tgDe()][g], p = tgProg(L); window.CUR = { view: TG_VIEW + '-xong' };
  $app.innerHTML = `${tgHead(g, p.pl, p.n)}<div class="box tgyes"><b>✓ Đã chơi hết ${p.n} ${TG_GN[g][4]} của ${esc(trName(tgDe()))}</b><p style="margin:6px 0 0">Mục chơi sai sẽ quay lại từ ngày mai; mục đúng giãn dần 1, 3, 7, 21 ngày.</p></div>
    ${p.sai ? `<button class="pri" data-tgm="sai">▶ Chơi lại ${p.sai} mục đang sai</button>` : ''}<button${p.sai ? '' : ' class="pri"'} data-tgm="all">↻ Chơi lại cả đề (không chờ lịch)</button><button data-tgv>‹ Chọn trò khác</button>`;
  $app.onclick = e => { if (tgBack(e)) return; const m = e.target.closest('[data-tgm]'); if (m) tgPlay(g, m.dataset.tgm); }; }

// ---------- 🔁 Săn cặp / 🔗 Cụm hay dùng: ghép L ↔ R ----------
const TG_LR = { pair: ['📖 Trong bài', '✅ Trong đáp án', 'Chạm một dòng "Trong bài", rồi chạm dòng "Trong đáp án" cùng ý.'], cum: ['🇬🇧 Cụm tiếng Anh', '🇻🇳 Nghĩa', 'Chạm một cụm tiếng Anh, rồi chạm nghĩa của nó.'] };
function tgMatch(g, its, mode) { window.CUR = { view: TG_VIEW + '-' + g }; const lab = TG_LR[g], P = tgProg(TG_P[tgDe()][g]);
  const G = { R: shuf(its.map((_, i) => i)), sl: -1, sr: -1, done: new Set(), miss: new Set(), t0: Date.now(), msg: '' };
  const draw = () => { $app.innerHTML = tgHead(g, Math.min(P.pl + G.done.size, P.n), P.n) + `<p class="mute" style="margin-top:0">${lab[2]}</p><div aria-live="polite">${G.msg}</div>
      <p class="tgs">${lab[0]}</p>${its.map((x, i) => `<button class="tcc${G.done.has(i) ? ' ok' : G.sl === i ? ' sel' : ''}" data-tgl="${i}"${G.done.has(i) ? ' disabled' : ''}>${esc(x.L)}</button>`).join('')}
      <p class="tgs">${lab[1]}</p>${G.R.map(i => `<button class="tcc${G.done.has(i) ? ' ok' : G.sr === i ? ' sel' : ''}" data-tgr="${i}"${G.done.has(i) ? ' disabled' : ''}>${esc(its[i].R)}</button>`).join('')}`; };
  const check = () => { const i = G.sl, j = G.sr; if (i < 0 || j < 0) return; G.sl = G.sr = -1;
    if (i === j) { G.done.add(i); if (!G.miss.has(i)) tgMark(g, its[i], true); G.msg = '';
      if (G.done.size === its.length) { save(); return tgEnd(g, its.map((x, k) => ({ x, ok: !G.miss.has(k) })), mode, Date.now() - G.t0); } }
    else { const a = its[i], b = its[j]; if (!G.miss.has(i)) { G.miss.add(i); tgMark(g, a, false); }
      G.msg = g === 'cum' ? `<div class="box tcno"><b>✗ Chưa khớp</b><p style="margin:6px 0 0">“${esc(b.L)}” = ${esc(b.R)}</p></div>`
        : `<div class="box tcno"><b>✗ Chưa khớp</b><p style="margin:6px 0 0">“${esc(a.L)}”${a.vL ? `<br><span class="mute">= ${esc(a.vL)}</span>` : ''}</p><p style="margin:6px 0 0">“${esc(b.R)}”${b.vR ? `<br><span class="mute">= ${esc(b.vR)}</span>` : ''}</p></div>`; }
    save(); draw(); };
  $app.onclick = e => { if (tgBack(e)) return; const l = e.target.closest('[data-tgl]'), r = e.target.closest('[data-tgr]');
    if (l && !l.disabled) { G.sl = +l.dataset.tgl; draw(); check(); } else if (r && !r.disabled) { G.sr = +r.dataset.tgr; draw(); check(); } };
  draw(); }

// ---------- 🏃 Đua dò tin: một bộ văn bản Part 7, chạm câu chứa đáp án của từng câu hỏi ----------
function tgDt(its, mode) { window.CUR = { view: TG_VIEW + '-dt' }; const P = tgProg(TG_P[tgDe()].dt), G = { i: 0, res: [], t0: Date.now(), tq: Date.now(), pick: null };
  const draw = () => { const x = its[G.i], q = x.q, done = G.pick != null, ok = G.res[G.i] && G.res[G.i].ok;
    const sent = (s, k) => { const hit = tgHit(s, q.ev), me = G.pick === k; return `<button class="tcc tgsn${done && hit ? ' ok' : me && !hit ? ' no' : ''}" data-tgs="${k}"${done ? ' disabled' : ''}>${esc(s)}</button>`; };
    let k = 0; const docs = x.docs.map(dc => `<p class="tgs">${esc(dc.title || 'Văn bản')}</p>${dc.ss.map(s => sent(s, k++)).join('')}`).join('');
    $app.innerHTML = tgHead('dt', Math.min(P.pl + G.i + (done ? 1 : 0), P.n), P.n) + `<div class="box tgq"><p class="mute" style="margin:0">Câu ${G.i + 1}/${its.length} của bộ này · ⏱ chạm câu chứa đáp án</p><p style="margin:4px 0 0;font-size:17px"><b>${q.q}</b></p>
      ${done ? `<p style="margin:8px 0 0">${ok ? '✓ Đúng' : '✗ Chưa đúng'} · đáp án: <b>${esc(q.a)}</b> · ${G.res[G.i].s} giây</p><button class="pri" data-tgn>${G.i + 1 < its.length ? 'Câu tiếp ›' : 'Xem kết quả'}</button>` : ''}</div>${docs}`;
    if (done) scrollTo(0, 0); };
  $app.onclick = e => { if (tgBack(e)) return; const s = e.target.closest('[data-tgs]'), x = its[G.i];
    if (s && G.pick == null) { G.pick = +s.dataset.tgs; const ss = x.docs.flatMap(d => d.ss), ok = tgHit(ss[G.pick], x.q.ev); G.res[G.i] = { x, ok, s: Math.round((Date.now() - G.tq) / 1000) }; tgMark('dt', x, ok); save(); draw(); return; }
    if (e.target.closest('[data-tgn]')) { if (G.i + 1 >= its.length) return tgEnd('dt', G.res, mode, Date.now() - G.t0); G.i++; G.pick = null; G.tq = Date.now(); draw(); scrollTo(0, 0); } };
  draw(); }

// ---------- 🧩 Họ từ ----------
function tgHo(g, its, mode) { window.CUR = { view: TG_VIEW + '-ho' }; const P = tgProg(TG_P[tgDe()].ho), G = { i: 0, step: 0, ok: [], res: null, t0: Date.now() };
  const cur = () => its[G.i], typ = x => ((tgSt().it[x.id] || {}).b || 0) >= 1;
  const draw = () => { const x = cur(), q = x.q, lg = q.lg, head = tgHead('ho', Math.min(P.pl + G.i + 1, P.n), P.n);
    if (G.step === 0 && x.ask) { $app.innerHTML = head + `<p class="mute" style="margin-top:0">Bước 1 · Nhận ra loại từ</p><p style="font-size:19px"><b>Từ nào là ${x.ask}?</b></p>${q.opts.map(o => `<button class="tcc" data-tga="${esc(o)}">${esc(o)}</button>`).join('')}`; return; }
    if (!G.res) { const t = typ(x); $app.innerHTML = head + `<p class="mute" style="margin-top:0">Bước 2 · ${t ? 'Tự gõ dạng đúng' : 'Chọn dạng đúng'} điền vào chỗ trống</p><p style="font-size:18px;line-height:1.6">${q.q}</p>`
      + (t ? `<p class="mute">Gợi ý: bắt đầu bằng “${esc(q.a[0])}”, ${q.a.length} chữ cái.</p><input class="tin" data-tgi autocomplete="off" autocapitalize="off" spellcheck="false" style="width:100%"><button class="pri" data-tgk>Kiểm</button>`
        : q.opts.map(o => `<button class="tcc" data-tgf="${esc(o)}">${esc(o)}</button>`).join('')); if (t) setTimeout(() => { const i = document.querySelector('[data-tgi]'); i && i.focus(); }, 50); return; }
    $app.innerHTML = head + tgReveal(q, G.res);
  };
  const fin = (ok, note) => { const x = cur(); ok = ok && G.s1 !== false; note = [G.n1, note].filter(Boolean).join('<br>'); G.ok[G.i] = ok; tgMark('ho', x, ok); save(); G.res = { ok, note, last: G.i + 1 >= its.length }; draw(); };
  $app.onclick = e => { if (tgBack(e)) return; const x = cur(), q = x.q;
    const a = e.target.closest('[data-tga]'); if (a) { G.s1 = a.dataset.tga === q.a; G.n1 = G.s1 ? '' : `Bước 1: “${esc(a.dataset.tga)}” là ${esc(q.lg.og[a.dataset.tga])}; ${x.ask} là “${esc(q.a)}”.`; G.step = 1; draw(); return; }
    const f = e.target.closest('[data-tgf]'); if (f) return fin(f.dataset.tgf === q.a, f.dataset.tgf === q.a ? '' : `Bạn chọn “${esc(f.dataset.tgf)}”.`);
    if (e.target.closest('[data-tgk]')) { const v = (document.querySelector('[data-tgi]') || {}).value || ''; const ok = v.trim().toLowerCase() === q.a.toLowerCase(); return fin(ok, ok ? '' : `Bạn gõ “${esc(v.trim())}”.`); }
    if (e.target.closest('[data-tgn]')) { if (G.i + 1 >= its.length) { $app.onkeydown = null; return tgEnd('ho', its.map((x, i) => ({ x, ok: G.ok[i] })), mode, Date.now() - G.t0); } G.i++; G.step = 0; G.res = null; G.s1 = undefined; G.n1 = ''; draw(); } };
  $app.onkeydown = e => { if (e.key === 'Enter' && e.target.matches && e.target.matches('[data-tgi]')) { e.preventDefault(); const b = document.querySelector('[data-tgk]'); b && b.click(); } };
  draw(); }
// ô kết quả một câu Part 5 / 6: đúng / sai, câu có đáp án, nghĩa 4 phương án, vì sao, cấu trúc, dịch
function tgReveal(q, r) { const lg = q.lg || {}, og = lg.og || {}, sent = q.sec === 'p6' ? '' : `<p style="font-size:17px;line-height:1.6">${q.q.replace('<b>-------</b>', `<b>${esc(q.a)}</b>`)}</p>`;
  return `<div class="box ${r.ok ? 'tgyes' : 'tcno'}"><b>${r.ok ? '✓ Đúng' : '✗ Chưa đúng'}</b>${r.note ? `<p style="margin:4px 0 0">${r.note}</p>` : ''}</div>${sent}
    <div class="box">${q.opts.map(o => `<p style="margin:4px 0"><b>${esc(o)}</b>${o === q.a ? ' ✓' : ''}${og[o] ? ` · <span class="mute">${esc(og[o])}</span>` : ''}</p>`).join('')}</div>
    <div class="box rvgt"><p style="margin:0"><b>Vì sao:</b> ${esc(lg.ly || q.why || '')}</p>${lg.ct ? `<p style="margin:6px 0 0"><b>Cấu trúc:</b> ${esc(lg.ct)}</p>` : ''}${lg.dich ? `<p style="margin:6px 0 0"><b>Dịch:</b> ${esc(lg.dich)}</p>` : ''}</div>
    <button class="pri" data-tgn>${r.last ? 'Xem kết quả' : 'Câu tiếp ›'}</button>`; }

// ---------- 🔀 Từ nối: ① quan hệ hai vế (khi biết loại của đáp án) ② chọn từ ----------
function tgNoi(g, its, mode) { window.CUR = { view: TG_VIEW + '-noi' }; const P = tgProg(TG_P[tgDe()].noi), G = { i: 0, step: 0, ok: [], res: null, t0: Date.now() }, cats = Object.keys(TG_CAT);
  const ctx = q => q.sec === 'p6' ? q.head.replace(/<p class="mute">[^<]*<\/p>/, '') : `<p style="font-size:18px;line-height:1.6">${q.q}</p>`;
  const draw = () => { const x = its[G.i], q = x.q, head = tgHead('noi', Math.min(P.pl + G.i + 1, P.n), P.n);
    if (G.res) { $app.innerHTML = head + (q.sec === 'p6' ? ctx(q) : '') + tgReveal(q, G.res) + (x.cat ? `<p class="mute">Quan hệ: ${x.cat}</p>` : ''); return; }
    if (G.step === 0 && x.cat) { G.co = G.co || shuf([x.cat, ...shuf(cats.filter(c => c !== x.cat)).slice(0, 3)]);
      $app.innerHTML = head + `<p class="mute" style="margin-top:0">Bước 1 · Hai vế quanh chỗ trống có quan hệ gì?</p>${ctx(q)}${G.co.map(c => `<button class="tcc" data-tgc="${esc(c)}">${esc(c[0].toUpperCase() + c.slice(1))}</button>`).join('')}`; return; }
    $app.innerHTML = head + `<p class="mute" style="margin-top:0">${x.cat ? 'Bước 2 · ' : ''}Chọn từ điền vào chỗ trống</p>${ctx(q)}${q.opts.map(o => `<button class="tcc" data-tgf="${esc(o)}">${esc(o)}</button>`).join('')}`; };
  $app.onclick = e => { if (tgBack(e)) return; const x = its[G.i], q = x.q;
    const c = e.target.closest('[data-tgc]'); if (c) { G.s1 = c.dataset.tgc === x.cat; G.step = 1; draw(); return; }
    const f = e.target.closest('[data-tgf]'); if (f) { const ok = f.dataset.tgf === q.a && G.s1 !== false; G.ok[G.i] = ok; tgMark('noi', x, ok); save();
      G.res = { ok, note: f.dataset.tgf === q.a ? (G.s1 === false ? `Chọn đúng từ, nhưng nhận sai quan hệ: hai vế có quan hệ ${x.cat}.` : '') : `Bạn chọn “${esc(f.dataset.tgf)}”.`, last: G.i + 1 >= its.length }; draw(); scrollTo(0, 0); return; }
    if (e.target.closest('[data-tgn]')) { if (G.i + 1 >= its.length) return tgEnd('noi', its.map((x, i) => ({ x, ok: G.ok[i] })), mode, Date.now() - G.t0); G.i++; G.step = 0; G.res = null; G.s1 = undefined; G.co = null; draw(); scrollTo(0, 0); } };
  draw(); }

// ---------- 🎯 Bắn nhiễu: chạm 3 phương án sai, chạm trúng đáp án là thua ----------
function tgBan(g, its, mode) { window.CUR = { view: TG_VIEW + '-ban' }; const P = tgProg(TG_P[tgDe()].ban), G = { i: 0, shot: [], ok: [], res: null, t0: Date.now() };
  const draw = () => { const x = its[G.i], q = x.q, og = q.lg.og, head = tgHead('ban', Math.min(P.pl + G.i + 1, P.n), P.n);
    if (G.res) { $app.innerHTML = head + tgReveal(q, G.res); return; }
    $app.innerHTML = head + `<p class="mute" style="margin-top:0">Chạm từng phương án SAI để loại. Còn ${3 - G.shot.length} phương án sai.</p><p style="font-size:18px;line-height:1.6">${q.q}</p>
      ${q.opts.map(o => G.shot.includes(o) ? `<div class="tcc tgout"><s>${esc(o)}</s><br><small class="mute">${esc(og[o])}</small></div>` : `<button class="tcc" data-tgf="${esc(o)}">🎯 ${esc(o)}</button>`).join('')}`; };
  $app.onclick = e => { if (tgBack(e)) return; const x = its[G.i], q = x.q;
    const f = e.target.closest('[data-tgf]'); if (f) { const o = f.dataset.tgf;
      if (o === q.a) { G.ok[G.i] = false; tgMark('ban', x, false); save(); G.res = { ok: false, note: `“${esc(o)}” là đáp án đúng, không được loại.`, last: G.i + 1 >= its.length }; draw(); return; }
      G.shot.push(o); if (G.shot.length === 3) { G.ok[G.i] = true; tgMark('ban', x, true); save(); G.res = { ok: true, note: `Còn lại “${esc(q.a)}” là đáp án.`, last: G.i + 1 >= its.length }; } draw(); return; }
    if (e.target.closest('[data-tgn]')) { if (G.i + 1 >= its.length) return tgEnd('ban', its.map((x, i) => ({ x, ok: G.ok[i] })), mode, Date.now() - G.t0); G.i++; G.shot = []; G.res = null; draw(); scrollTo(0, 0); } };
  draw(); }

// ---------- kết quả một lượt + xem bài gốc ----------
const TG_ROW = {
  pair: x => `<p style="margin:0">📖 “${esc(x.L)}”</p>${x.vL ? `<p class="mute" style="margin:2px 0 0">${esc(x.vL)}</p>` : ''}<p style="margin:8px 0 0">✅ “${esc(x.R)}”</p>${x.vR ? `<p class="mute" style="margin:2px 0 0">${esc(x.vR)}</p>` : ''}`,
  dt: x => `<p style="margin:0"><b>${x.q.q}</b></p><p style="margin:6px 0 0">📍 “${esc(x.q.ev)}”</p><p class="mute" style="margin:2px 0 0">✓ ${esc(x.q.a)}</p>`,
  cum: x => `<p style="margin:0"><b>${esc(x.L)}</b> = ${esc(x.R)}</p>`,
  ho: x => `<p style="margin:0"><b>${esc(x.q.a)}</b> · <span class="mute">${esc(x.q.lg.og[x.q.a])}</span></p><p style="margin:6px 0 0">${x.q.sec === 'p5' ? x.q.q.replace('<b>-------</b>', `<b>${esc(x.q.a)}</b>`) : ''}</p>` };
TG_ROW.ban = TG_ROW.noi = x => `<p style="margin:0"><b>${esc(x.q.a)}</b>${x.cat ? ` · <span class="mute">${x.cat}</span>` : ''}</p>${x.q.sec === 'p5' ? `<p style="margin:6px 0 0">${x.q.q.replace('<b>-------</b>', `<b>${esc(x.q.a)}</b>`)}</p>` : `<p class="mute" style="margin:6px 0 0">Part 6 · ${esc(x.q.x.title || '')}</p>`}`;
function tgEnd(g, res, mode, ms) { window.CUR = { view: TG_VIEW + '-kq' }; const st = tgSt().st; (st[g] = st[g] || { r: 0, q: 0, ok: 0, rv: 0, rvok: 0 }).r++; save();
  const ok = res.filter(r => r.ok).length, sec = Math.round(ms / 1000), M = res.filter(r => !r.ok).map(r => r.x), p = tgProg(TG_P[tgDe()][g]), u = TG_GN[g][4];
  const src = x => x.q.sec === 'p7' || x.q.sec === 'p6' ? `<button class="link tap" data-tgsrc="${esc(x.id)}">📘 Xem bài gốc · câu ${x.q.n}</button>` : '';
  const body = M.length ? `<p class="tgs">${M.length} ${u} sai: chơi lại từ ngày mai</p>${M.map(x => `<div class="box">${TG_ROW[g](x)}${src(x)}</div>`).join('')}` : '<p>🎉 Đúng hết ngay lần đầu.</p>';
  const nx = !mode && p.left ? `▶ Lượt tiếp · còn ${p.left} ${u} chưa chơi` : !mode && p.due ? `▶ Lượt tiếp · ${p.due} ${u} cần chơi lại` : '';
  const html = `<div id="ie"></div><div class="row top"><button class="link tap" data-tgv>‹ Trò chơi</button><span class="mute">${esc(trName(tgDe()))} · ${p.pl}/${p.n}</span></div><h2>${TG_GN[g][1]} ${TG_GN[g][2]}</h2>
    <div class="box"><b style="font-size:20px">${ok}/${res.length} ${u} đúng ngay · ${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')}</b>${g === 'dt' ? `<p class="mute" style="margin:4px 0 0">Đề thật: Part 7 khoảng 1 phút mỗi câu. Lượt này ${res.length ? Math.round(sec / res.length) : 0} giây / câu.</p>` : ''}
      <div class="bar"><i style="width:${p.n ? Math.round(p.pl / p.n * 100) : 0}%;background:var(--good)"></i></div><p class="mute" style="margin:2px 0 0">Đã chơi ${p.pl}/${p.n} ${u} của đề này</p></div>
    ${nx ? `<button class="pri" data-tgag>${nx}</button>` : !mode ? `<div class="box tgyes"><b>✓ Đã chơi hết ${p.n} ${u} của đề này</b></div><button class="pri" data-tgag>Chơi lại mục sai hoặc cả đề ›</button>` : `<button class="pri" data-tgag>▶ Lượt khác</button>`}${body}<button data-tgv>‹ Chọn trò khác</button>`;
  const its = res.map(r => r.x), draw = () => { $app.innerHTML = html; scrollTo(0, 0);
    $app.onclick = e => { if (tgBack(e)) return; if (e.target.closest('[data-tgag]')) return tgPlay(g, mode);
      const s = e.target.closest('[data-tgsrc]'); if (s) { const x = its.find(y => y.id === s.dataset.tgsrc); if (x) tgSrc(x, draw); } }; };
  draw(); }
function tgSrc(x, back) { const q = x.q; window.CUR = { view: TG_VIEW + '-bai' }; const ev = q.ev || x.L;
  const body = q.sec === 'p6' ? q.head.replace(/<p class="mute">[^<]*<\/p>/, '') : (ev ? q.foot.replace(esc(ev), `<mark>${esc(ev)}</mark>`) : q.foot);
  $app.innerHTML = `<div id="ie"></div><div class="row top"><button class="link tap" data-tgbk>‹ Kết quả</button></div><p class="mute">${esc(trName(x.de))} · câu ${q.n}</p>
    <div class="box"><p style="margin:0"><b>${q.q}</b></p><p style="margin:6px 0 0">✓ ${esc(q.a)}</p></div>${ev && q.sec === 'p7' ? '<p class="mute">📍 Câu chứa đáp án được tô màu.</p>' : ''}${body}<button data-tgbk>‹ Kết quả</button>`;
  $app.onclick = e => { if (e.target.closest('[data-tgbk]')) back(); }; scrollTo(0, 0); }

// lối vào ở màn TOEIC (phần 📚 Đề có sẵn), cạnh đề thử trọn
function tgRow() { if (typeof TO === 'undefined' || !TO || !(TO.tron || []).length) return '';
  return `<div class="box hcard" style="margin:12px 0 0"><button class="hrow" data-tgv><span class="ic">🎮</span><span class="t"><b>Trò chơi Reading</b><small>Chọn đề, chơi hết 6 trò: săn cặp, dò tin, họ từ, cụm từ, từ nối, bắn nhiễu</small></span><span class="chev">›</span></button></div>`; }
document.addEventListener('click', e => { if (S && e.target.closest('[data-tgv]') && !String((window.CUR || {}).view).startsWith(TG_VIEW)) { TG_P = null; tgView(); } });
