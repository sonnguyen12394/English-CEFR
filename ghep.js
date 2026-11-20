// 🧩 Phố Ghép Đoạn (specs/020-thanh-pho-toeic, v193): phố thứ bảy (cuối) của 🏙 Thành phố TOEIC. Câu chèn Part 6 (chọn câu cho ô trống) và Part 7 (vị trí [1]–[4]).
// Màn riêng như 🔎 Bến Dò Tin (đọc cả đoạn, không dùng chữ rơi); dùng chung tiếng / nhạc / mặt cư dân / khuôn tiến độ phố (S.to.phos.ghep).
// 4 cư dân = 4 loại chữ nối ngược về câu trước: GC chỉ lại (this, it, such…) · GT thêm ý (also, in addition…) · GN đổi chiều (however, instead…) · GQ tiếp nối (as a result, then…).
// Bậc: ① 🔗 chạm chữ nối trong câu chèn → ② 📍 chạm câu phải đứng ngay trước → ③ 🧭 chọn vị trí [1]–[4] (Part 7) → ④ 🔥 chọn câu cho ô trống (Part 6). Bậc 3–4 có câu đề.
// Kho: ghep.json (content/toeic/ghep.json qua tools/build-ghep.mjs). Không tính luật đo, không đổi điểm đề thử.
PH_ACCX.GC = (ink, sk) => `<path d="M64 20 H38 M46 12 L38 20 L46 28" style="fill:none;stroke:#e0567a;stroke-width:5;stroke-linecap:round;stroke-linejoin:round"/>`;
PH_ACCX.GT = (ink, sk) => `<circle cx="50" cy="20" r="12" style="fill:#5cc28a;stroke:${ink};stroke-width:2.5"/><path d="M50 13 V27 M43 20 H57" style="stroke:#fff;stroke-width:3.5;stroke-linecap:round"/>`;
PH_ACCX.GN = (ink, sk) => `<path d="M34 14 H60 L54 8 M66 28 H40 L46 34" style="fill:none;stroke:#3a8ff0;stroke-width:4;stroke-linecap:round;stroke-linejoin:round"/>`;
PH_ACCX.GQ = (ink, sk) => `<path d="M34 20 H62 M54 12 L62 20 L54 28" style="fill:none;stroke:#f08c3a;stroke-width:5;stroke-linecap:round;stroke-linejoin:round"/><circle cx="34" cy="20" r="4" style="fill:${ink}"/>`;
const GH_LK = [['GN', /\b(however|but|instead|otherwise|nevertheless|still|even so|on the other hand|in contrast|unfortunately)\b/i],
  ['GQ', /\b(as a result|therefore|thus|so|consequently|then|after that|afterward|afterwards|at that time|since then|later|first|finally|next|by then)\b/i],
  ['GT', /\b(also|in addition|additionally|moreover|furthermore|besides|as well|too|for example|for instance|similarly)\b/i],
  ['GC', /\b(this|that|these|those|such|it|its|they|them|their|there|the same|both|one of them|the former|the latter|he|she|his|her)\b/i]];
const ghTy = s => { for (const [t, re] of GH_LK) if (re.test(String(s || ''))) return t; return 'GC'; };
const GH_MUC = {
  b1: { ten: '🔗 Bậc 1 · Chữ nối ngược', sub: 'Chạm chữ trong câu chèn chỉ về câu trước · 5 tim', md: 'chu', tim: 5, sec: 25 },
  b2: { ten: '📍 Bậc 2 · Câu đứng trước', sub: 'Chạm câu phải đứng ngay trước câu chèn · 5 tim', md: 'truoc', tim: 5, sec: 45 },
  b3: { ten: '🧭 Bậc 3 · Vị trí [1]–[4]', sub: 'Chèn câu vào đoạn như Part 7 · 4 tim, 3 gợi ý', md: 'vitri', tim: 4, sec: 60, goi: 3 },
  b4: { ten: '🔥 Bậc 4 · Câu nào hợp ô trống', sub: 'Chọn 1 trong 4 câu như Part 6 · 3 tim, 1 gợi ý', md: 'chon', tim: 3, sec: 45, goi: 1 } };
const GH_FIX = { ten: '🛠 Chữa câu', md: 'chon', tim: 5, sec: 120, goi: 99 };
PH_PHO.ghep = { key: 'ghep', view: 'toeic-ghep', ic: '🧩', ten: 'Phố Ghép Đoạn', file: 'ghep.json', sub: 'Chèn câu vào đoạn văn · Part 6, Part 7',
  desc: 'Câu chèn luôn có một chữ chỉ ngược về câu ngay trước (this, also, however, as a result…). Tìm chữ đó, rồi tìm câu nó chỉ tới.',
  lo: 'câu chèn', ORD: ['GC', 'GT', 'GN', 'GQ'], SHORT: { GC: 'Chỉ lại', GT: 'Thêm ý', GN: 'Đổi chiều', GQ: 'Tiếp nối' }, NHA: {}, G: {}, MUC: GH_MUC, FIX: GH_FIX,
  CH: { GC: { name: 'Chỉ lại', pos: 'Chỉ lại', suf: 'this, these, such, it, they, there', line: 'Câu có this / these / such / it / they thì câu ngay trước phải có đúng thứ được chỉ: "this feature" cần câu trước nói về một chức năng.' },
    GT: { name: 'Thêm ý', pos: 'Thêm ý', suf: 'also, in addition, for example', line: 'Câu có also / in addition thì câu trước đã nói một ý cùng loại; for example thì câu trước là ý chung, câu chèn là ví dụ.' },
    GN: { name: 'Đổi chiều', pos: 'Đổi chiều', suf: 'however, instead, otherwise', line: 'Câu có however / instead thì câu trước nói điều ngược lại. Đọc câu trước: nếu cùng chiều thì sai chỗ.' },
    GQ: { name: 'Tiếp nối', pos: 'Tiếp nối', suf: 'as a result, then, after that', line: 'Câu có as a result / then / after that thì câu trước là nguyên nhân hoặc việc xảy ra trước.' } },
  canFix: q => !!(q && ((q.sec === 'p6' && q.gt === 'insert') || (q.sec === 'p7' && q.qt === 'insert'))), fixLab: '🧩 Chữa ở Phố Ghép Đoạn · tìm chữ nối ngược',
  own: () => ghView(), fix: (de, n) => ghFix(de, n) };
let GH_K = null, GH_R = null, GH_BACK = null;
const ghSt = () => { const o = toSt(); o.phos = o.phos || {}; const p = o.phos.ghep = o.phos.ghep || {}; p.it = p.it || {}; p.st = p.st || {}; p.mu = p.mu || {}; return p; };
const ghOpen = m => { const M = Object.keys(GH_MUC), i = M.indexOf(m); return phThu() || i <= 0 || (ghSt().mu[M[i - 1]] || 0) >= PH_WIN; };
const ghMuc = () => { const P = ghSt(); return P.mc && ghOpen(P.mc) ? P.mc : 'b1'; };
const ghDec = s => String(s || '').replace(/<[^>]+>/g, '').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&');
async function ghLoad() { if (!GH_K) { try { GH_K = (await (await fetch('ghep.json?v=' + APP_V)).json()).items || []; } catch (e) { GH_K = []; } } return GH_K; }
const ghKItems = () => (GH_K || []).map(x => Object.assign({ kho: 1, ty: ghTy(x.lk) }, x));
// câu chèn của đề: Part 7 vị trí [1]–[4] (mode vitri) · Part 6 câu cho ô trống (mode chon)
function ghDeItems(de) { const B = de && typeof trB === 'function' && trB(de); if (!B) return [];
  return B.Q.filter(q => PH_PHO.ghep.canFix(q)).map(q => { const lg = q.lg || {}, ly = String(lg.ly || q.why || ''), why = (ly.replace(/^Đáp án "[^"]*"\s*[—–-]\s*/, '').match(/^[^.!?]*[.!?]/) || [ly])[0].slice(0, 220);
    const it = { id: `de:${de}:${q.n}`, de, n: q.n, real: 1, a: q.a, opts: q.opts, og: lg.og, why, vi: lg.dich || '' };
    if (q.sec === 'p7') { const m = ghDec(q.q).match(/["“](.+)["”]\s*$/); return Object.assign(it, { md: 'vitri', docs: (q.x && q.x.docs) || [], ins: m ? m[1] : '', ty: ghTy(m ? m[1] : '') }); }
    const g = +((String(q.q).match(/\((\d)\)/) || [])[1] || 0), X = q.x || {};
    const text = String(X.text || '').replace(/\{(\d)\}/g, (m0, d) => +d === g ? '{GAP}' : ((X.gaps || [])[d - 1] || {}).a || '');
    return Object.assign(it, { md: 'chon', title: X.title || '', text, ty: ghTy(q.a) }); }); }
const ghDue = it => { const c = ghSt().it[it.id]; return c && c.d && c.d <= Date.now(); };
const ghChac = it => { const c = ghSt().it[it.id]; return !!(c && c.s === 1 && c.lv >= 1); };
function ghPick(mu, only) { const M = GH_MUC[mu] || GH_FIX, de = typeof tgDe === 'function' ? tgDe() : null, K = ghKItems(), P = ghSt(), st = {};
  if (typeof tgJState === 'function' && de) for (const c of tgJState(de) || []) st[c.n] = c.st;
  const fresh = x => !P.it[x.id] || ghDue(x);
  if (only) { const sib = shuf(K.filter(x => x.ty === only.ty && fresh(x))).slice(0, 2); return [...sib, only]; }
  if (M.md === 'chu' || M.md === 'truoc') return shuf(K.filter(fresh)).concat(shuf(K.filter(x => !fresh(x)))).slice(0, 8);
  const D = ghDeItems(de).filter(x => x.md === M.md).sort((a, b) => ((st[a.n] === 'sai' ? 0 : ghChac(a) ? 2 : 1) - (st[b.n] === 'sai' ? 0 : ghChac(b) ? 2 : 1)));
  const out = [], used = new Set();
  for (const d of D) { const s = shuf(K.filter(x => x.ty === d.ty && !used.has(x.id) && fresh(x)))[0] || shuf(K.filter(x => !used.has(x.id)))[0]; if (s) { used.add(s.id); out.push(s); } out.push(d); }
  for (const x of shuf(K.filter(x => !used.has(x.id) && fresh(x))).concat(shuf(K.filter(x => !used.has(x.id) && !fresh(x))))) { if (out.length >= 8) break; out.push(x); }
  return out.slice(0, 8); }
// ── màn phố ──
const ghTop = (lab, right) => `<div id="ie"></div><div class="row top"><button class="link tap" data-ghback>‹ ${lab}</button><span class="mute">${right || ''}</span></div>`;
function ghBackGo() { const b = GH_BACK; GH_BACK = null; if (b) return b(); if (typeof cyView === 'function') return cyView(); EX_PART = 'san'; return toeicView(); }
function ghDeBox(de) { if (!de) return ''; const D = ghDeItems(de), nm = typeof tgDeName === 'function' ? tgDeName(de) : de;
  if (!D.length) return `<div class="box phde"><b>📝 ${esc(nm)}</b><p class="mute" style="margin:4px 0 0">Đề này chưa có câu chèn. Ván dùng đoạn văn kho của phố.</p></div>`;
  const ch = D.filter(ghChac).length;
  return `<div class="box phde"><div class="row" style="justify-content:space-between;gap:8px"><b>📝 ${esc(nm)} · ${D.length} câu chèn</b><span>${ch}/${D.length} chắc</span></div>
    <div class="bar"><i style="width:${Math.round(ch * 100 / D.length)}%"></i></div><small class="mute">${D.filter(x => x.md === 'vitri').length} câu Part 7 (bậc 3) · ${D.filter(x => x.md === 'chon').length} câu Part 6 (bậc 4)</small></div>`; }
async function ghView() { ghStop(); window.CUR = { view: 'toeic-ghep' }; BACK = null; scrollTo(0, 0); $app.onkeydown = null;
  $app.innerHTML = '<div id="ie"></div><p class="mute">Đang mở Phố Ghép Đoạn…</p>'; await toLoad();
  if (typeof TG_P !== 'undefined' && !TG_P && typeof tgPool === 'function') { try { if (typeof trProbe9 === 'function') await trProbe9(); if (typeof trLkList === 'function') await trLkList(); } catch (e) {} TG_P = await tgPool(); }
  await ghLoad(); const de = typeof tgDe === 'function' ? tgDe() : null; if (de && typeof trLoad === 'function') { try { await trLoad(de); } catch (e) {} }
  if (window.CUR.view !== 'toeic-ghep') return; phUse('loai');
  const P = ghSt(); if (!P.in) return ghIntro();
  const mu = ghMuc(), K = ghKItems(), seen = K.filter(x => P.it[x.id]).length;
  const hz = PH_PHO.ghep.ORD.map(t => phFace(t, 50)); hz.splice(2, 0, phFace('M', 76, 'happy'));
  $app.innerHTML = ghTop(typeof cyView === 'function' ? 'Thành phố' : 'TOEIC') + `<h1 style="margin:4px 0 6px">🧩 Phố Ghép Đoạn</h1><div class="phhero">${hz.join('')}</div>
    <p class="mute" style="margin:0 0 10px">${PH_PHO.ghep.desc}</p>${ghDeBox(de)}
    <h3 style="margin:6px 0">Chọn bậc · học từng việc rồi mới ghép</h3><div class="phmuc">${Object.keys(GH_MUC).map((m, i, A) => { const o = GH_MUC[m], op = ghOpen(m), b = P.mu[m];
      return `<button class="phmc${m === mu ? ' on' : ''}" data-ghmuc="${m}" aria-pressed="${m === mu}"${op ? '' : ' disabled'}><b>${op ? o.ten : '🔒 ' + o.ten.replace(/^\S+\s/, '')}</b><small>${op ? o.sub : `Mở khi thắng ${GH_MUC[A[i - 1]].ten.replace(/^\S+\s/, '')} (đúng ≥ 70%)`}</small>${b ? `<small class="phbest">Tốt nhất ${b} / ${PH_N}</small>` : ''}</button>`; }).join('')}</div>
    <button class="pri" data-ghplay style="min-height:56px;font-size:18px">▶ Chơi · ${GH_MUC[mu].ten}</button>${phSndRow()}
    <div class="box" style="margin-top:10px"><p style="margin:2px 0">🗺 Đã gặp ${seen} / ${K.length} đoạn kho của phố</p></div>
    <details class="more"><summary>Thêm</summary><button class="link tap" data-ghintro>👋 Làm quen lại 4 cư dân</button>${phThuBtn()}
      <p class="mute" style="font-size:14px">Không tính vào 📘 Học / 🔁 Nhớ, không đổi điểm đề thử. Câu chèn của đề làm ở bậc 3–4 ghi vào ⚔️ Chinh phục đề. Đoạn văn kho do Claude soạn, chưa giáo viên kiểm.</p></details>`;
  $app.onclick = e => { if (e.target.closest('[data-ghback]')) return ghBackGo(); if (phSndClick(e)) return ghView(); if (phThuClick(e)) return ghView(); const mb = e.target.closest('[data-ghmuc]'); if (mb && ghOpen(mb.dataset.ghmuc)) { P.mc = mb.dataset.ghmuc; save(); return ghView(); }
    if (e.target.closest('[data-ghplay]')) return ghStart(); if (e.target.closest('[data-ghintro]')) return ghIntro(); }; }
function ghIntro() { window.CUR = { view: 'toeic-ghep-intro' }; scrollTo(0, 0); const C = PH_PHO.ghep.CH;
  $app.innerHTML = ghTop(ghSt().in ? 'Phố' : 'Thành phố') + `<h2>4 cư dân của Phố Ghép Đoạn</h2><p class="mute">Mỗi người là một loại chữ nối ngược về câu trước. Thấy chữ nào trong câu chèn thì biết câu trước phải nói gì.</p>
    ${PH_PHO.ghep.ORD.map(t => `<div class="phwho" style="cursor:default">${phFace(t, 58)}<span class="t"><b>${C[t].name}</b><span>${C[t].pos !== C[t].name ? `<span class="phtag ph-${t}">${C[t].pos}</span>` : ''} <small class="mute">${esc(C[t].suf)}</small></span><small>${esc(C[t].line)}</small></span></div>`).join('')}
    <button class="pri" data-ghgo style="min-height:52px">${ghSt().in ? 'Về Phố' : '▶ Bắt đầu Bậc 1'}</button>`;
  $app.onclick = e => { if (e.target.closest('[data-ghback]')) return ghSt().in ? ghView() : ghBackGo(); if (e.target.closest('[data-ghgo]')) { const P = ghSt(); if (!P.in) { P.in = 1; save(); return ghStart(); } return ghView(); } }; }
// ── ván ──
function ghStop() { if (GH_R) { clearTimeout(GH_R.to); if (!GH_R.end && GH_R.i > 0) { const s = ghSt().st; s.bo = (s.bo || 0) + 1; } GH_R = null; } phMusic(false); }
async function ghStart(only, back) { ghStop(); await toLoad(); await ghLoad(); phUse('loai');
  const mu = only ? 'fix' : ghMuc(), M = only ? GH_FIX : GH_MUC[mu], L = ghPick(mu, only);
  if (!L.length) { toast('Chưa có câu cho bậc này.'); return ghView(); }
  GH_R = { mu, M, L, i: 0, ok: 0, hearts: M.tim, combo: 0, star: 0, goi: M.goi || 0, miss: [], back }; const s = ghSt().st; s.van = (s.van || 0) + 1; save();
  phMusic(true); ghQ(); }
const ghHud = () => { const R = GH_R; return `<div class="phhud trx"><button class="iconbtn" data-ghpause aria-label="Thoát ván">✕</button><button class="iconbtn" data-ghpause aria-label="Tạm dừng, nhạc và tiếng">⏸</button><span class="chip">❤️ ${Math.max(0, R.hearts)}/${R.M.tim}</span><span class="chip">⭐ ${R.star}</span><span class="chip"${R.combo >= 2 ? '' : ' hidden'}>🔥 ×${R.combo}</span><span class="chip">${R.i + 1}/${R.L.length}</span></div>`; };
const ghWords = s => String(s).split(/\s+/).filter(Boolean);
const ghNorm = w => String(w).toLowerCase().replace(/[^a-z']/g, '');
// một mục ở một kiểu ván → { head, body, check(v) → ok, ans: chữ đáp án, evI (câu cần tô sau khi trả lời) }
function ghBuild(it, md) {
  if (md === 'chu') { const W = ghWords(it.s[it.k]), L = new Set(ghWords(it.lk).map(ghNorm));
    return { head: 'Chạm chữ trong câu này chỉ ngược về câu trước', body: `<div class="box benq"><p style="margin:0">${W.map((w, i) => `<button class="ghw" data-ghv="${i}">${esc(w)}</button>`).join(' ')}</p></div>`,
      ok: v => L.has(ghNorm(W[v])), ans: `"${it.lk}"`, mark: v => L.has(ghNorm(W[v])) }; }
  if (md === 'truoc') { const R = it.s.filter((x, i) => i !== it.k);
    return { head: 'Câu chèn phải đứng NGAY SAU câu nào?', ins: it.s[it.k], body: `<div class="box bentext"><b class="bentt">${esc(it.kind)}</b>${R.map((x, i) => `<button class="bens" data-ghv="${i}">${esc(x)}</button>`).join('')}</div>`,
      ok: v => v === it.k - 1, ans: `"${String(R[it.k - 1]).replace(/[.!?]+$/, '')}"`, mark: v => v === it.k - 1 }; }
  if (md === 'vitri') {
    if (it.real) { let html = it.docs.map(d => `<div class="bendoc">${d.title ? `<b class="bentt">${esc(d.title)}</b>` : ''}<p>${esc(d.text).replace(/\[(\d)\]/g, (m0, d1) => `<button class="ghm" data-ghv="${d1}">[${d1}]</button>`)}</p></div>`).join('');
      return { head: 'Câu này đặt ở vị trí nào?', ins: it.ins, body: `<div class="box bentext">${html}</div>`, ok: v => `[${v}]` === it.a, ans: it.a, mark: v => `[${v}]` === it.a }; }
    const R = it.s.filter((x, i) => i !== it.k), slots = shuf([...Array(R.length).keys()].map(x => x + 1).filter(p => p !== it.k)).slice(0, 3).concat(it.k).sort((a, b) => a - b), lab = {}; slots.forEach((p, i) => { lab[p] = i + 1; });
    let html = ''; R.forEach((x, i) => { html += esc(x) + ' '; if (lab[i + 1]) html += `<button class="ghm" data-ghv="${lab[i + 1]}">[${lab[i + 1]}]</button> `; });
    return { head: 'Câu này đặt ở vị trí nào?', ins: it.s[it.k], body: `<div class="box bentext"><b class="bentt">${esc(it.kind)}</b><p style="margin:0;line-height:2.1">${html}</p></div>`, ok: v => +v === lab[it.k], ans: `[${lab[it.k]}]`, mark: v => +v === lab[it.k] }; }
  // chon: Part 6
  const opts = it.real ? it.opts.slice() : shuf([it.s[it.k], ...it.w]), A = it.real ? it.a : it.s[it.k];
  const text = it.real ? esc(it.text).replace('{GAP}', '<span class="phgap">______</span>') : it.s.map((x, i) => i === it.k ? '<span class="phgap">______</span>' : esc(x)).join(' ');
  return { head: 'Chọn câu hợp ô trống', body: `<div class="box bentext">${it.real && it.title ? `<b class="bentt">${esc(it.title)}</b>` : it.kind ? `<b class="bentt">${esc(it.kind)}</b>` : ''}<p style="margin:0">${text}</p></div><div class="benopts">${opts.map((o, i) => `<button data-ghv="${i}"><b>(${'ABCD'[i]})</b> ${esc(o)}</button>`).join('')}</div>`,
    ok: v => opts[v] === A, ans: `"${String(A).replace(/[.!?]+$/, '')}"`, mark: v => opts[v] === A, opts }; }
function ghQ() { const R = GH_R; if (!R) return; const it = R.L[R.i], M = R.M; R.it = it; R.done = false; R.hint = 0; window.CUR = { view: 'toeic-ghep-van' }; scrollTo(0, 0);
  const md = it.real ? it.md : M.md, B = ghBuild(it, md); R.B = B; R.md = md;
  $app.innerHTML = ghHud() + `<div class="tgtime"><i style="animation-duration:${M.sec}s"></i></div><div class="box benq"><small class="mute">${esc(B.head)}</small>${B.ins ? `<p class="tdtap" style="margin:4px 0 0;font-size:17px;font-weight:600">“${esc(B.ins)}”</p>` : ''}</div>${B.body}
    ${R.goi && (md === 'vitri' || md === 'chon') && (it.lk || it.real) ? `<button class="link tap" data-ghgoi>💡 Gợi ý (còn ${R.goi >= 99 ? 'không giới hạn' : R.goi})</button>` : ''}<div id="ghfb"></div>`;
  { const g = document.querySelector('.bentext .phgap'), bx = document.querySelector('.bentext'); if (g && bx && g.offsetTop) bx.scrollTop = Math.max(0, g.offsetTop - bx.offsetTop - 60); }   // ô trống Part 6 luôn trong tầm nhìn
  clearTimeout(R.to); R.to = setTimeout(() => ghAns(null), M.sec * 1000);
  $app.onclick = e => { if (!GH_R) return; if (e.target.closest('[data-ghpause]')) return ghPause(); if (e.target.closest('[data-ghnext]')) return ghNext(); if (e.target.closest('[data-ghquit]')) { ghStop(); return ghView(); }
    if (GH_R.done) return; if (e.target.closest('[data-ghgoi]')) return ghHint(); const b = e.target.closest('[data-ghv]'); if (b) return ghAns(b.dataset.ghv, b); }; }
function ghHint() { const R = GH_R; if (!R.goi || R.hint) return; R.hint = 1; if (R.goi < 99) R.goi--; const it = R.it, b = document.querySelector('[data-ghgoi]'); if (b) b.remove();
  const C = PH_PHO.ghep.CH[it.ty]; document.getElementById('ghfb').innerHTML = `<div class="box"><p style="margin:0">💡 ${it.lk ? `Chữ nối: <b>${esc(it.lk)}</b>. ` : ''}${esc(C.line)}</p></div>`; }
function ghPause() { const R = GH_R; clearTimeout(R.to); const el = document.getElementById('ghfb');
  el.innerHTML = `<div class="box">${phSndRow()}<button class="pri" data-ghres>▶ Chơi tiếp</button><button data-ghquit>‹ Thoát ván, về Phố</button>${phGyBtn}</div>`;
  el.scrollIntoView({ block: 'center', behavior: 'smooth' });
  el.onclick = e => { if (phSndClick(e)) { phMusic(phMusicOn()); return ghPause(); } if (e.target.closest('[data-phgy]')) return phGyGo(); if (e.target.closest('[data-ghres]')) { el.innerHTML = ''; el.onclick = null; R.to = setTimeout(() => ghAns(null), R.M.sec * 500); } }; }
function ghMark(it, ok) { const P = ghSt(), c = P.it[it.id] || { lv: 0 }, mu = GH_R.mu, deep = mu === 'b3' || mu === 'b4' || mu === 'fix';
  if (!deep) { P.it[it.id] = Object.assign(c, { at: Date.now() }); return; }
  if (ok && !GH_R.hint) { c.lv = Math.min(PH_HEN.length, (c.lv || 0) + 1); c.d = Date.now() + PH_HEN[c.lv - 1] * 864e5; c.s = 1; } else { c.lv = 0; c.d = Date.now() + 864e5; c.s = ok ? 1 : 0; }
  c.at = Date.now(); P.it[it.id] = c;
  if (it.real && typeof tgJ === 'function' && mu !== 'fix' && !GH_R.hint) tgJ(it.de).c[it.n] = { s: ok ? 'ok' : 'sai', at: Date.now() }; }
function ghAns(v, el) { const R = GH_R; if (!R || R.done) return; R.done = true; clearTimeout(R.to); const it = R.it, B = R.B, C = PH_PHO.ghep.CH;
  const vv = v === null ? null : (R.md === 'vitri' ? +v : +v), ok = v !== null && B.ok(vv);
  document.querySelectorAll('[data-ghv]').forEach(b => { b.disabled = true; if (B.mark(R.md === 'vitri' ? +b.dataset.ghv : +b.dataset.ghv)) b.classList.add(R.md === 'chon' ? 'yes' : 'ev'); }); if (el && !ok) el.classList.add('no');
  { const tb = document.querySelector('.tgtime i'); if (tb) tb.style.animationPlayState = 'paused'; const gb = document.querySelector('[data-ghgoi]'); if (gb) gb.remove(); }
  ghMark(it, ok); const S = ghSt().st; S.cau = (S.cau || 0) + 1;
  if (ok) { R.ok++; R.combo++; R.star += R.combo >= 3 ? 2 : 1; S.dung = (S.dung || 0) + 1; phSfx(R.combo >= 3 ? 'combo' : 'ok'); } else { R.combo = 0; R.hearts--; R.miss.push({ it, md: R.md }); phSfx('no'); }
  save(); const last = R.hearts <= 0 || R.i + 1 >= R.L.length, ty = `<span class="phtag ph-${it.ty}">${C[it.ty].pos}</span>`;
  const og = it.og && R.md === 'chon' && B.opts ? `<details class="more"><summary>Nghĩa các câu</summary>${B.opts.map(o => `<p style="margin:3px 0">${esc(o)}: <span class="mute">${esc(it.og[o] || '')}</span></p>`).join('')}</details>` : '';
  document.getElementById('ghfb').innerHTML = `<div class="phfb ${ok ? 'good' : 'bad'}"><p class="${ok ? 'ok' : 'ko'}">${ok ? '✓ Đúng rồi!' : v === null ? '✗ Hết giờ' : '✗ Chưa đúng'}${R.combo >= 3 ? ` · 🔥 ×${R.combo}` : ''}</p>
    <p style="margin:0">${ty} Đáp án: <b>${esc(B.ans)}</b>. ${esc(it.why || '')}</p>${it.vi ? `<p class="mute" style="margin:4px 0 0">🇻🇳 ${esc(it.vi)}</p>` : ''}${og}${!ok && R.hearts <= 0 ? '<p class="ko" style="margin:4px 0 0">💔 Hết tim</p>' : ''}
    <button class="pri" data-ghnext>${last ? 'Xem kết quả' : 'Câu tiếp ›'}</button></div>`;
  const fb = document.getElementById('ghfb'); if (fb && fb.scrollIntoView) try { fb.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); } catch (e) {} }
function ghNext() { const R = GH_R; if (R.hearts <= 0 || R.i + 1 >= R.L.length) return ghEnd(); R.i++; ghQ(); }
function ghEnd() { const R = GH_R; if (!R) return; R.end = true; clearTimeout(R.to); phMusic(false); const P = ghSt(), n = R.L.length, need = Math.ceil(n * PH_WIN / PH_N), win = R.hearts > 0 && R.ok >= need;
  const sc = Math.round(R.ok * PH_N / n), M = Object.keys(GH_MUC), nx = M[M.indexOf(R.mu) + 1], was = nx && ghOpen(nx);
  if (R.mu !== 'fix') { P.mu[R.mu] = Math.max(P.mu[R.mu] || 0, win ? Math.max(sc, PH_WIN) : Math.min(sc, PH_WIN - 1)); if (win && nx && ghOpen(nx) && !was) P.mc = nx; }
  phSfx(win ? 'win' : 'lose'); save(); const C = PH_PHO.ghep.CH, back = R.back, unl = win && nx && ghOpen(nx) && !was; GH_R = null; window.CUR = { view: 'toeic-ghep-kq' }; scrollTo(0, 0);
  $app.innerHTML = ghTop('Phố') + `<h2 style="margin:6px 0">${win ? '🎉 Thắng ván!' : '💪 Ván sau sẽ tốt hơn'}</h2><p style="font-size:20px;margin:4px 0">✓ <b>${R.ok}</b> / ${n} câu · ⭐ ${R.star}</p>
    ${unl ? `<p class="ok">🔓 Đã mở ${GH_MUC[nx].ten}</p>` : ''}${!win && R.mu !== 'b1' && R.mu !== 'fix' ? '<p class="mute">Khó quá? Chơi lại bậc trước cho chắc rồi quay lại.</p>' : ''}
    ${R.miss.length ? `<h3>Cần nhớ lại</h3>${R.miss.map(({ it }) => `<div class="box"><p style="margin:0 0 4px"><span class="phtag ph-${it.ty}">${C[it.ty].pos}</span> ${esc(it.real ? (it.ins || it.a) : it.s[it.k])}</p><p class="mute" style="margin:0;font-size:14px">${it.lk ? `Chữ nối "${esc(it.lk)}". ` : ''}${esc(it.why || '')}</p></div>`).join('')}` : ''}
    ${back ? '<button class="pri" data-ghbk>⚔️ Về đảo Chinh phục đề</button>' : '<button class="pri" data-ghagain>▶ Ván nữa</button>'}<button data-ghhome>‹ Về Phố</button>`;
  $app.onclick = e => { if (e.target.closest('[data-ghback]') || e.target.closest('[data-ghhome]')) return ghView(); if (e.target.closest('[data-ghagain]')) return ghStart(); if (e.target.closest('[data-ghbk]')) return back(); }; }
async function ghFix(de, n) { await toLoad(); await ghLoad(); if (typeof trLoad === 'function') { try { await trLoad(de); } catch (e) {} }
  const it = ghDeItems(de).find(x => x.n === n); if (!it) { toast('Câu này chưa vào được Phố Ghép Đoạn, chữa ở đảo nhé.'); return; }
  const P = ghSt(); if (!P.in) { P.in = 1; save(); }
  return ghStart(it, typeof tgView === 'function' ? () => tgView() : null); }
