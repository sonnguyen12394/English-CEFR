// 🔎 Bến Dò Tin (specs/020-thanh-pho-toeic, v191): phố thứ năm của 🏙 Thành phố TOEIC. Câu hỏi Part 7 (trừ từ gần nghĩa, chèn câu).
// Không dùng màn chữ rơi (đáp án Part 7 là cả câu, đọc cả bài): màn riêng, dùng chung tiếng / nhạc / cư dân / tiến độ kiểu phố.
// 4 cư dân = 4 loại câu hỏi (P mục đích · C chi tiết · K đúng–sai / NOT · Y suy luận). Bậc: ① nhận loại câu hỏi → ② chạm câu chứa đáp án
//   → ③ dò rồi chọn (3 phương án) → ④ như đề (4 phương án, giờ theo nhịp đề). Ván theo đề đang chọn (v183): câu Part 7 của đề + văn bản kho anh em.
// Kho: ben.json (content/toeic/ben.json qua tools/build-ben.mjs). Tiến độ S.to.phos.ben (cùng khuôn phố: in, mu, mc, it, st). Không tính luật đo.
PH_ACCX.P = (ink, sk) => `<circle cx="50" cy="20" r="13" style="fill:#fff;stroke:#e0567a;stroke-width:4"/><circle cx="50" cy="20" r="6" style="fill:#e0567a;stroke:${ink};stroke-width:1.5"/>`;
PH_ACCX.C = (ink, sk) => `<circle cx="46" cy="18" r="10" style="fill:#e9f4ff;stroke:${ink};stroke-width:3"/><path d="M53 25 L64 34" style="stroke:${ink};stroke-width:4;stroke-linecap:round"/>`;
PH_ACCX.K = (ink, sk) => `<rect x="34" y="8" width="32" height="24" rx="4" style="fill:#fff;stroke:${ink};stroke-width:2.5"/><path d="M39 21 l5 5 l9 -11" style="fill:none;stroke:#2e9b5c;stroke-width:3;stroke-linecap:round"/>`;
PH_ACCX.Y = (ink, sk) => `<path d="M34 26 Q30 12 44 12 Q48 4 58 9 Q70 8 68 20 Q72 30 58 30 L40 30 Q34 30 34 26 Z" style="fill:#fff;stroke:${ink};stroke-width:2.5"/><circle cx="44" cy="36" r="2.5" style="fill:${ink}"/>`;
const BEN_TY = { purpose: 'P', detail: 'C', true: 'K', not: 'K', infer: 'Y', intent: 'Y' };
const BEN_MUC = {
  b1: { ten: '🏷 Bậc 1 · Loại câu hỏi', sub: 'Đọc câu hỏi, bắt đúng loại · không cần đọc bài · 5 tim', md: 'loai', tim: 5, sec: 20 },
  b2: { ten: '🔎 Bậc 2 · Dò câu chứa đáp án', sub: 'Đọc câu hỏi, chạm đúng câu trong bài · 5 tim', md: 'do', tim: 5, sec: 45 },
  b3: { ten: '🌿 Bậc 3 · Dò rồi chọn', sub: 'Đọc bài, chọn 1 trong 3 đáp án · 4 tim, 3 gợi ý', md: 'chon', k: 3, tim: 4, sec: 75, goi: 3 },
  b4: { ten: '🔥 Bậc 4 · Như đề thật', sub: '4 đáp án, giờ theo nhịp đề · 3 tim, 1 gợi ý', md: 'chon', k: 4, tim: 3, sec: 61, goi: 1 } };
const BEN_FIX = { ten: '🛠 Chữa câu', md: 'chon', k: 4, tim: 5, sec: 120, goi: 99 };
PH_PHO.ben = { key: 'ben', view: 'toeic-ben', ic: '🔎', ten: 'Bến Dò Tin', file: 'ben.json', sub: 'Tìm chi tiết, mục đích, đúng–sai, suy luận · Part 7',
  desc: 'Đọc câu hỏi trước, đoán loại, rồi dò đúng câu chứa đáp án trong bài. Đáp án đúng thường nói lại ý của câu đó bằng chữ khác.',
  lo: 'Part 7', ORD: ['P', 'C', 'K', 'Y'], SHORT: { P: 'Cô Mục đích', C: 'Bác Chi tiết', K: 'Anh Đúng–Sai', Y: 'Bé Suy luận' }, NHA: {}, G: {}, MUC: BEN_MUC, FIX: BEN_FIX,
  CH: { P: { name: 'Cô Mục đích', pos: 'Mục đích', suf: 'Why was … written? · purpose', line: 'Hỏi bài viết để làm gì. Đọc kỹ 2 câu đầu và câu có please / I am writing to / we would like.' },
    C: { name: 'Bác Chi tiết', pos: 'Chi tiết', suf: 'When / Where / How much / What …', line: 'Hỏi một chi tiết. Lấy từ khoá của câu hỏi (tên, ngày, số, nơi), dò trong bài tới câu có nó, đọc kỹ câu đó.' },
    K: { name: 'Anh Đúng–Sai', pos: 'Đúng–sai', suf: 'indicated / true / NOT mentioned', line: 'Không có từ khoá rõ: đối chiếu từng phương án với bài. Câu NOT: loại 3 phương án bài có nhắc, còn lại là đáp án.' },
    Y: { name: 'Bé Suy luận', pos: 'Suy luận', suf: 'suggested / most likely / mean when …', line: 'Đáp án không có chữ y nguyên trong bài. Tìm câu liên quan rồi suy ra điều chắc chắn đúng, không đoán theo lẽ thường.' } },
  canFix: q => !!(q && q.sec === 'p7' && BEN_TY[q.qt]), fixLab: '🔎 Chữa ở Bến Dò Tin · dò câu chứa đáp án',
  own: () => benView(), fix: (de, n) => benFix(de, n) };
let BEN_K = null, BEN_R = null, BEN_BACK = null;
const benSt = () => { const o = toSt(); o.phos = o.phos || {}; const p = o.phos.ben = o.phos.ben || {}; p.it = p.it || {}; p.st = p.st || {}; p.mu = p.mu || {}; return p; };
const benOpen = m => { const M = Object.keys(BEN_MUC), i = M.indexOf(m); return i <= 0 || (benSt().mu[M[i - 1]] || 0) >= PH_WIN; };
const benMuc = () => { const P = benSt(), m = P.mc && benOpen(P.mc) ? P.mc : 'b1'; return m; };
const benNorm = s => String(s || '').toLowerCase().replace(/[“”"’']/g, "'").replace(/\s+/g, ' ').trim();
const benHit = (sent, ev) => typeof tgHit === 'function' ? tgHit(sent, ev) : benNorm(sent).includes(benNorm(ev).slice(0, 25));
const benSents = t => typeof tgSents === 'function' ? tgSents(t) : String(t || '').split(/(?<=[.!?])\s+/);
async function benLoad() { if (!BEN_K) { try { BEN_K = (await (await fetch('ben.json?v=' + APP_V)).json()).items || []; } catch (e) { BEN_K = []; } } return BEN_K; }
// câu hỏi kho → mục thống nhất { id, ty, docs, q, opts, a, ev, why, vi }
const benKItems = () => (BEN_K || []).flatMap(t => t.qs.map((q, i) => ({ id: `${t.id}:${i}`, tx: t.id, ty: q.ty, kind: t.kind, docs: [{ title: t.kind, text: t.t }], q: q.q, a: q.a, w: q.w, ev: q.ev, why: q.why, vi: q.vi })));
// câu Part 7 của đề → mục thống nhất (câu từ gần nghĩa / chèn câu không vào bến)
function benDeItems(de) { const B = de && typeof trB === 'function' && trB(de); if (!B) return [];
  return B.Q.filter(q => q.sec === 'p7' && BEN_TY[q.qt]).map(q => { const lg = q.lg || {}, ly = String(lg.ly || q.why || '');
    return { id: `de:${de}:${q.n}`, de, n: q.n, real: 1, tx: `de:${de}:${(q.x || {}).id}`, ty: BEN_TY[q.qt], kind: q.kind || (q.x || {}).kind || '', docs: (q.x && q.x.docs) || [], q: q.q, a: q.a, opts: q.opts, og: lg.og,
      ev: q.ev || '', why: (ly.replace(/^Đáp án "[^"]*"\s*[—–-]\s*/, '').match(/^[^.!?]*[.!?]/) || [ly])[0].slice(0, 220), vi: lg.dich || '' }; }); }
const benDue = it => { const c = benSt().it[it.id]; return c && c.d && c.d <= Date.now(); };
const benChac = it => { const c = benSt().it[it.id]; return !!(c && c.s === 1 && c.lv >= 1); };
function benWrongDe(de) { const st = {}; if (typeof tgJState === 'function') for (const c of tgJState(de) || []) st[c.n] = c.st; return st; }
// ván: bậc 1 = 10 câu hỏi lẻ (đề + kho); bậc 2–4 = theo văn bản: văn bản kho anh em (cùng loại câu hỏi) rồi bộ văn bản của đề, tới khi ≥ 8 câu
function benPick(mu, only) { const M = BEN_MUC[mu] || BEN_FIX, de = typeof tgDe === 'function' ? tgDe() : null, D = benDeItems(de), K = benKItems(), P = benSt(), st = benWrongDe(de);
  if (only) { const sib = K.filter(x => x.ty === only.ty && (!P.it[x.id] || benDue(x))); return [...(sib.length ? K.filter(x => x.tx === shuf(sib)[0].tx) : []), only]; }
  const rank = it => (st[it.n] === 'sai' ? 0 : !benChac(it) ? 1 : benDue(it) ? 2 : 3) * 10 + Math.random();
  if (M.md === 'loai') { const d = D.slice().sort((a, b) => rank(a) - rank(b)).slice(0, 6), k = shuf(K.filter(x => !P.it[x.id] || benDue(x))).slice(0, 10 - d.length); return shuf([...d, ...k]).slice(0, 10); }
  const need = M.md === 'do' ? x => !!x.ev : () => true, out = [], used = new Set();
  const sets = {}; for (const it of D.filter(need)) (sets[it.tx] = sets[it.tx] || []).push(it);
  const ds = Object.values(sets).sort((a, b) => Math.min(...a.map(rank)) - Math.min(...b.map(rank)) || a.length - b.length);
  const kt = {}; for (const it of K) (kt[it.tx] = kt[it.tx] || []).push(it);
  const kSet = ty => { const c = shuf(Object.values(kt).filter(s => !used.has(s[0].tx))).sort((a, b) => (b.some(x => x.ty === ty) - a.some(x => x.ty === ty)) || (a.some(x => P.it[x.id]) - b.some(x => P.it[x.id])))[0]; if (c) used.add(c[0].tx); return c || []; };
  for (const s of ds) { if (out.length >= 8) break; const ty = (s.find(x => st[x.n] === 'sai') || s[0]).ty; out.push(...kSet(ty), ...s.slice(0, 5)); }
  while (out.length < 8) { const s = kSet(null); if (!s.length) break; out.push(...s); }
  return out.slice(0, 12); }
// ── màn Bến ──
const benTop = (lab, right) => `<div id="ie"></div><div class="row top"><button class="link tap" data-benback>‹ ${lab}</button><span class="mute">${right || ''}</span></div>`;
function benBackGo() { const b = BEN_BACK; BEN_BACK = null; if (b) return b(); if (typeof cyView === 'function') return cyView(); EX_PART = 'san'; return toeicView(); }
function benDeBox(de) { const D = benDeItems(de); if (!de) return ''; const nm = typeof tgDeName === 'function' ? tgDeName(de) : de;
  if (!D.length) return `<div class="box phde"><b>📝 ${esc(nm)}</b><p class="mute" style="margin:4px 0 0">Đề này chưa có câu Part 7 dò được. Ván dùng văn bản kho của bến. Đổi đề ở 🏙 Thành phố.</p></div>`;
  const st = benWrongDe(de), ch = D.filter(benChac).length, sai = D.filter(x => st[x.n] === 'sai').length, ev = D.filter(x => x.ev).length;
  return `<div class="box phde"><div class="row" style="justify-content:space-between;gap:8px"><b>📝 ${esc(nm)} · ${D.length} câu Part 7</b><span>${ch}/${D.length} chắc</span></div>
    <div class="bar"><i style="width:${Math.round(ch * 100 / D.length)}%"></i></div><small class="mute">${sai ? `${sai} câu bạn đang sai trong đề, lên trước · ` : ''}${ev < D.length ? `${D.length - ev} câu chưa có câu chứa đáp án (không vào bậc 2)` : 'mọi câu có câu chứa đáp án'}</small></div>`; }
async function benView() { benStop(); window.CUR = { view: 'toeic-ben' }; BACK = null; scrollTo(0, 0); $app.onkeydown = null;
  $app.innerHTML = '<div id="ie"></div><p class="mute">Đang mở Bến Dò Tin…</p>'; await toLoad();
  if (typeof TG_P !== 'undefined' && !TG_P && typeof tgPool === 'function') { try { if (typeof trProbe9 === 'function') await trProbe9(); if (typeof trLkList === 'function') await trLkList(); } catch (e) {} TG_P = await tgPool(); }
  await benLoad(); const de = typeof tgDe === 'function' ? tgDe() : null; if (de && typeof trLoad === 'function') { try { await trLoad(de); } catch (e) {} }
  if (window.CUR.view !== 'toeic-ben') return; phUse('loai');
  const P = benSt(); if (!P.in) return benIntro();
  const mu = benMuc(), K = benKItems(), seen = K.filter(x => P.it[x.id]).length, due = [...K, ...benDeItems(de)].filter(benDue).length;
  const hz = PH_PHO.ben.ORD.map(t => phFace(t, 50)); hz.splice(2, 0, phFace('M', 76, 'happy'));
  $app.innerHTML = benTop(typeof cyView === 'function' ? 'Thành phố' : 'TOEIC') + `<h1 style="margin:4px 0 6px">🔎 Bến Dò Tin</h1><div class="phhero">${hz.join('')}</div>
    <p class="mute" style="margin:0 0 10px">${PH_PHO.ben.desc}</p>${benDeBox(de)}
    <h3 style="margin:6px 0">Chọn bậc · học từng việc rồi mới ghép</h3><div class="phmuc">${Object.keys(BEN_MUC).map((m, i, A) => { const o = BEN_MUC[m], op = benOpen(m), b = P.mu[m];
      return `<button class="phmc${m === mu ? ' on' : ''}" data-benmuc="${m}" aria-pressed="${m === mu}"${op ? '' : ' disabled'}><b>${op ? o.ten : '🔒 ' + o.ten.replace(/^\S+\s/, '')}</b><small>${op ? o.sub : `Mở khi thắng ${BEN_MUC[A[i - 1]].ten.replace(/^\S+\s/, '')} (đúng ≥ 70%)`}</small>${b ? `<small class="phbest">Tốt nhất ${b} / ${PH_N}</small>` : ''}</button>`; }).join('')}</div>
    <button class="pri" data-benplay style="min-height:56px;font-size:18px">▶ Chơi · ${BEN_MUC[mu].ten}</button>${phSndRow()}
    <div class="box" style="margin-top:10px"><p style="margin:2px 0">${due ? `🔁 <b>${due}</b> câu đến hạn ôn, có trong ván này` : '🔁 Chưa có câu đến hạn ôn'}</p><p style="margin:2px 0">🗺 Đã gặp ${seen} / ${K.length} câu hỏi kho của bến</p></div>
    <details class="more"><summary>Thêm</summary><button class="link tap" data-benintro>👋 Làm quen lại 4 cư dân</button>
      <p class="mute" style="font-size:14px">Không tính vào 📘 Học / 🔁 Nhớ, không đổi điểm đề thử. Câu của đề làm ở bậc 3–4 ghi vào ⚔️ Chinh phục đề. Văn bản kho do Claude soạn, chưa giáo viên kiểm.</p></details>`;
  $app.onclick = e => { if (e.target.closest('[data-benback]')) return benBackGo(); if (phSndClick(e)) return benView(); const mb = e.target.closest('[data-benmuc]'); if (mb && benOpen(mb.dataset.benmuc)) { P.mc = mb.dataset.benmuc; save(); return benView(); }
    if (e.target.closest('[data-benplay]')) return benStart(); if (e.target.closest('[data-benintro]')) return benIntro(); }; }
function benIntro() { window.CUR = { view: 'toeic-ben-intro' }; scrollTo(0, 0); const C = PH_PHO.ben.CH;
  $app.innerHTML = benTop('Bến') + `<h2>4 cư dân của Bến Dò Tin</h2><p class="mute">Mỗi người là một loại câu hỏi Part 7. Nhận ra loại câu hỏi trước thì biết dò ở đâu, đọc thế nào.</p>
    ${PH_PHO.ben.ORD.map(t => `<div class="phwho" style="cursor:default">${phFace(t, 58)}<span class="t"><b>${C[t].name}</b><span><span class="phtag ph-${t}">${C[t].pos}</span> <small class="mute">${esc(C[t].suf)}</small></span><small>${esc(C[t].line)}</small></span></div>`).join('')}
    <button class="pri" data-bengo style="min-height:52px">${benSt().in ? 'Về Bến' : '▶ Bắt đầu Bậc 1'}</button>`;
  $app.onclick = e => { if (e.target.closest('[data-benback]')) return benView(); if (e.target.closest('[data-bengo]')) { const P = benSt(); if (!P.in) { P.in = 1; save(); return benStart(); } return benView(); } }; }
// ── ván ──
function benStop() { if (BEN_R) { clearTimeout(BEN_R.to); clearTimeout(BEN_R.nx); if (!BEN_R.end && BEN_R.i > 0) { const s = benSt().st; s.bo = (s.bo || 0) + 1; } BEN_R = null; } phMusic(false); }
async function benStart(only, back) { benStop(); await toLoad(); await benLoad(); phUse('loai');
  const mu = only ? 'fix' : benMuc(), M = only ? BEN_FIX : BEN_MUC[mu], L = benPick(mu, only);
  if (!L.length) { toast('Chưa có câu cho bậc này.'); return benView(); }
  BEN_R = { mu, M, L, i: 0, ok: 0, hearts: M.tim, combo: 0, star: 0, goi: M.goi || 0, miss: [], back }; const s = benSt().st; s.van = (s.van || 0) + 1; save();
  phMusic(true); benQ(); }
function benDocs(it, mode, evI) { let k = 0; return it.docs.map(d => { const S = benSents(d.text);
  return `<div class="bendoc">${d.title ? `<b class="bentt">${esc(d.title)}</b>` : ''}<p>${S.map(s => { const i = k++, cls = evI && evI.has(i) ? ' ev' : '';
    return mode === 'tap' ? `<button class="bens${cls}" data-bens="${i}">${esc(s)}</button>` : `<span class="bens tdtap${cls}" data-bensi="${i}">${esc(s)}</span>`; }).join(' ')}</p></div>`; }).join(''); }
const benAllS = it => it.docs.flatMap(d => benSents(d.text));
const benEvI = it => { const S = benAllS(it), out = new Set(); if (it.ev) S.forEach((s, i) => { if (benHit(s, it.ev)) out.add(i); }); return out; };
function benOpts(it, k) { const all = it.opts ? it.opts.slice() : shuf([it.a, ...it.w]); if (k >= all.length) return all; const wr = all.filter(o => o !== it.a); const drop = shuf(wr)[0]; return all.filter(o => o !== drop); }
function benHud() { const R = BEN_R; return `<div class="phhud trx"><button class="iconbtn" data-benpause aria-label="Tạm dừng, nhạc và tiếng">⏸</button><span class="chip">${'❤️'.repeat(Math.max(0, R.hearts))}${'🖤'.repeat(Math.max(0, R.M.tim - R.hearts))}</span><span class="chip">⭐ ${R.star}</span><span class="chip"${R.combo >= 2 ? '' : ' hidden'}>🔥 ×${R.combo}</span><span class="chip">${R.i + 1}/${R.L.length}</span></div>`; }
function benQ() { const R = BEN_R; if (!R) return; const it = R.L[R.i], M = R.M; R.it = it; R.done = false; R.hint = 0; window.CUR = { view: 'toeic-ben-van' }; scrollTo(0, 0);
  const C = PH_PHO.ben.CH, md = M.md, opts = md === 'chon' ? benOpts(it, M.k) : null; R.opts = opts;
  const qh = `<div class="box benq"><small class="mute">${md === 'loai' ? 'Câu hỏi này thuộc loại nào?' : md === 'do' ? 'Chạm câu trong bài chứa đáp án' : 'Đọc bài, chọn đáp án'}</small><p class="tdtap" style="margin:4px 0 0;font-size:18px;font-weight:600">${esc(it.q)}</p></div>`;
  const body = md === 'loai' ? `<div class="phpick" id="benpick">${PH_PHO.ben.ORD.map(t => `<button data-benty="${t}">${phFace(t, 44)}<span>${C[t].name}</span><small class="mute" style="font-weight:400">${esc(C[t].suf)}</small></button>`).join('')}</div>`
    : `${md === 'do' ? qh : ''}<div class="box bentext">${benDocs(it, md === 'do' ? 'tap' : 'read')}</div>${md === 'chon' ? qh + `<div class="benopts">${opts.map((o, i) => `<button data-beno="${i}"><b>(${'ABCD'[i]})</b> ${esc(o)}</button>`).join('')}</div>${R.goi ? `<button class="link tap" data-bengoi>💡 Gợi ý: tô câu chứa đáp án (còn ${R.goi >= 99 ? 'không giới hạn' : R.goi})</button>` : ''}` : ''}`;
  $app.innerHTML = benHud() + `<div class="tgtime"><i style="animation-duration:${M.sec}s"></i></div>${md === 'loai' ? qh : ''}${body}<div id="benfb"></div>`;
  clearTimeout(R.to); R.to = setTimeout(() => benAns(null), M.sec * 1000);
  $app.onclick = e => { if (!BEN_R) return; if (e.target.closest('[data-benpause]')) return benPause();
    if (e.target.closest('[data-bennext]')) return benNext(); if (e.target.closest('[data-benquit]')) { benStop(); return benView(); }
    if (BEN_R.done) return; const g = e.target.closest('[data-bengoi]'); if (g) return benHint();
    const t = e.target.closest('[data-benty]'); if (t) return benAns(t.dataset.benty, t);
    const s = e.target.closest('[data-bens]'); if (s) return benAns(+s.dataset.bens, s);
    const o = e.target.closest('[data-beno]'); if (o) return benAns(+o.dataset.beno, o); }; }
function benHint() { const R = BEN_R; if (!R.goi || R.hint) return; const I = benEvI(R.it); if (!I.size) { toast('Câu này chưa có câu chứa đáp án để tô.'); return; }
  R.hint = 1; if (R.goi < 99) R.goi--; for (const i of I) { const el = document.querySelector(`[data-bensi="${i}"]`); if (el) el.classList.add('ev'); } const b = document.querySelector('[data-bengoi]'); if (b) b.remove(); }
function benPause() { const R = BEN_R; clearTimeout(R.to);
  const el = document.getElementById('benfb'); el.innerHTML = `<div class="box">${phSndRow()}<button class="pri" data-benres>▶ Chơi tiếp</button><button data-benquit>‹ Rời ván</button></div>`;
  el.onclick = e => { if (phSndClick(e)) { phMusic(phMusicOn()); return benPause(); } if (e.target.closest('[data-benres]')) { el.innerHTML = ''; el.onclick = null; R.to = setTimeout(() => benAns(null), R.M.sec * 500); } }; }
function benMark(it, ok) { const P = benSt(), c = P.it[it.id] || { lv: 0 }, mu = BEN_R.mu, deep = mu === 'b3' || mu === 'b4' || mu === 'fix';
  if (!deep) { P.it[it.id] = Object.assign(c, { at: Date.now() }); return; }
  if (ok && !BEN_R.hint) { c.lv = Math.min(PH_HEN.length, (c.lv || 0) + 1); c.d = Date.now() + PH_HEN[c.lv - 1] * 864e5; c.s = 1; } else { c.lv = 0; c.d = Date.now() + 864e5; c.s = ok ? 1 : 0; }
  c.at = Date.now(); P.it[it.id] = c;
  if (it.real && typeof tgJ === 'function' && mu !== 'fix' && !BEN_R.hint) { const J = tgJ(it.de); J.c[it.n] = { s: ok ? 'ok' : 'sai', at: Date.now() }; } }
function benAns(v, el) { const R = BEN_R; if (!R || R.done) return; R.done = true; clearTimeout(R.to); const it = R.it, md = R.M.md, C = PH_PHO.ben.CH, I = benEvI(it);
  let ok = false, got = '';
  if (md === 'loai') { ok = v === it.ty; got = v ? C[v].name : 'hết giờ'; document.querySelectorAll('[data-benty]').forEach(b => { b.disabled = true; if (b.dataset.benty === it.ty) b.classList.add('yes'); }); if (el && !ok) el.classList.add('no'); }
  else if (md === 'do') { ok = v !== null && I.has(v); got = v === null ? 'hết giờ' : 'câu khác'; document.querySelectorAll('[data-bens]').forEach(b => { b.disabled = true; if (I.has(+b.dataset.bens)) b.classList.add('ev'); }); if (el && !ok) el.classList.add('no'); }
  else { ok = v !== null && R.opts[v] === it.a; got = v === null ? 'hết giờ' : R.opts[v]; document.querySelectorAll('[data-beno]').forEach(b => { b.disabled = true; if (R.opts[+b.dataset.beno] === it.a) b.classList.add('yes'); }); if (el && !ok) el.classList.add('no');
    for (const i of I) { const s = document.querySelector(`[data-bensi="${i}"]`); if (s) s.classList.add('ev'); } }
  benMark(it, ok); const S = benSt().st; S.cau = (S.cau || 0) + 1;
  if (ok) { R.ok++; R.combo++; R.star += R.combo >= 3 ? 2 : 1; S.dung = (S.dung || 0) + 1; phSfx(R.combo >= 3 ? 'combo' : 'ok'); }
  else { R.combo = 0; R.hearts--; R.miss.push({ it, got, md }); phSfx('no'); }
  save();
  const ty = `<span class="phtag ph-${it.ty}">${C[it.ty].pos}</span>`, last = R.hearts <= 0 || R.i + 1 >= R.L.length;
  const og = it.og && md === 'chon' ? `<details class="more"><summary>Nghĩa các đáp án</summary>${R.opts.map(o => `<p style="margin:3px 0">${esc(o)}: <span class="mute">${esc(it.og[o] || '')}</span></p>`).join('')}</details>` : '';
  document.getElementById('benfb').innerHTML = `<div class="phfb ${ok ? 'good' : 'bad'}"><p class="${ok ? 'ok' : 'ko'}">${ok ? '✓ Đúng rồi!' : `✗ Chưa đúng (${esc(got)})`}${R.combo >= 3 ? ` · 🔥 ×${R.combo}` : ''}</p>
    ${md === 'loai' ? `<p style="margin:0">${ty} ${esc(C[it.ty].line)}</p>` : `<p style="margin:0">${ty} ${md === 'do' ? 'Câu chứa đáp án đã tô.' : `Đáp án: <b>${esc(it.a)}</b>.`} ${esc(it.why || '')}</p>`}
    ${it.vi ? `<p class="mute" style="margin:4px 0 0">${esc(it.vi)}</p>` : ''}${og}${!ok && R.hearts <= 0 ? '<p class="ko" style="margin:4px 0 0">💔 Hết tim</p>' : ''}
    <button class="pri" data-bennext>${last ? 'Xem kết quả' : 'Câu tiếp ›'}</button></div>`;
  const fb = document.getElementById('benfb'); if (fb && fb.scrollIntoView) try { fb.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); } catch (e) {} }
function benNext() { const R = BEN_R; if (R.hearts <= 0 || R.i + 1 >= R.L.length) return benEnd(); R.i++; benQ(); }
function benEnd() { const R = BEN_R; if (!R) return; R.end = true; clearTimeout(R.to); phMusic(false); const P = benSt(), n = R.L.length, need = Math.ceil(n * PH_WIN / PH_N), win = R.hearts > 0 && R.ok >= need;
  const sc = Math.round(R.ok * PH_N / n), M = Object.keys(BEN_MUC), nx = M[M.indexOf(R.mu) + 1], was = nx && benOpen(nx);
  if (R.mu !== 'fix') { P.mu[R.mu] = Math.max(P.mu[R.mu] || 0, win ? Math.max(sc, PH_WIN) : Math.min(sc, PH_WIN - 1)); if (win && nx && benOpen(nx) && !was) P.mc = nx; }
  phSfx(win ? 'win' : 'lose'); save(); const C = PH_PHO.ben.CH, back = R.back; BEN_R = null; window.CUR = { view: 'toeic-ben-kq' }; scrollTo(0, 0);
  const unl = win && nx && benOpen(nx) && !was;
  $app.innerHTML = benTop('Bến') + `<h2 style="margin:6px 0">${win ? '🎉 Thắng ván!' : '💪 Ván sau sẽ tốt hơn'}</h2><p style="font-size:20px;margin:4px 0">✓ <b>${R.ok}</b> / ${n} câu · ⭐ ${R.star}</p>
    ${unl ? `<p class="ok">🔓 Đã mở ${BEN_MUC[nx].ten}</p>` : ''}${!win && R.mu !== 'b1' && R.mu !== 'fix' ? '<p class="mute">Khó quá? Chơi lại bậc trước cho chắc rồi quay lại.</p>' : ''}
    ${R.miss.length ? `<h3>Cần nhớ lại</h3>${R.miss.map(({ it, got, md }) => `<div class="box"><p style="margin:0 0 4px"><span class="phtag ph-${it.ty}">${C[it.ty].pos}</span> ${esc(it.q)}</p><p class="mute" style="margin:0;font-size:14px">${md === 'loai' ? `Bạn chọn ${esc(got)}. ${esc(C[it.ty].line)}` : `Đáp án: ${esc(it.a)}. ${esc(it.why || '')}`}</p></div>`).join('')}` : ''}
    ${back ? '<button class="pri" data-benbk>⚔️ Về đảo Chinh phục đề</button>' : '<button class="pri" data-benagain>▶ Ván nữa</button>'}<button data-benhome>‹ Về Bến</button>`;
  $app.onclick = e => { if (e.target.closest('[data-benback]') || e.target.closest('[data-benhome]')) return benView(); if (e.target.closest('[data-benagain]')) return benStart(); if (e.target.closest('[data-benbk]')) return back(); }; }
// chữa một câu Part 7 từ bí kíp Chinh phục đề: văn bản kho anh em (cùng loại câu hỏi) rồi chính câu đề
async function benFix(de, n) { await toLoad(); await benLoad(); if (typeof trLoad === 'function') { try { await trLoad(de); } catch (e) {} }
  const it = benDeItems(de).find(x => x.n === n); if (!it) { toast('Câu này chưa vào được Bến Dò Tin, chữa ở đảo nhé.'); return; }
  const P = benSt(); if (!P.in) { P.in = 1; save(); }
  return benStart(it, typeof tgView === 'function' ? () => tgView() : null); }
