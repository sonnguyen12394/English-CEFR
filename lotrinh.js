// 🔄 Lộ trình (v105, 1/11/2026, người sáng lập bàn "kiểm tra đầu vào + phương pháp học sửa lỗi" rồi "ok làm vậy đi, làm thêm chức năng ở mục mới kế bên học CEFR").
// Chu trình: 🎯 mục tiêu → 🧭 xếp cấp → các 📆 đợt 10 ngày (mỗi ngày: ôn đến hạn + chữa chỗ yếu ≤ 40% số phút + bài mới) → 📝 kiểm tra nhẹ cuối đợt
// (10 câu kiểu xếp cấp ở cấp đang học + cấp kế, rồi 🔎 quét lại từ của bản đồ) → 📊 tổng kết đợt → đợt sau. 🧭 Xếp cấp lại chỉ khi: ≥ 60 ngày, vừa hoàn thành
// một cấp, trượt thi vượt, hoặc chưa xếp lần nào; còn ≤ 30 ngày tới ngày thi thì làm 📝 đề mẫu chính thức thay xếp cấp.
// Vì sao không xếp cấp lại mỗi 10 ngày: ~200 giờ học / cấp (ước của Cambridge) nên 10 ngày × 15–30 phút tiến bộ nhỏ hơn sai số của bài 15–30 câu.
// KHÔNG đổi luật đo: xếp cấp và kiểm tra nhẹ chỉ để chọn chỗ học; cấp hoàn thành vẫn do 🚪 Thi chuyển cấp / 🚀 thi vượt quyết. Mọi việc học vẫn ghi như thường.
const LT_D = 10, LT_FIX = 0.4, LT_RE_D = 60, LT_EXAM_D = 30, LT_FIX_OK = 0.5, LT_DAYS_OK = 3, LT_MINI = 5, LT_CF = 4;
const ltSt = () => (S.lt = S.lt || { d: [], fx: {} });
const ltCur = () => { const L = ltSt(), c = L.d[L.d.length - 1]; return c && !c.end ? c : null; };
const ltDay = (c, now = Date.now()) => dayOf(now) - c.d0 + 1;
const ltFixMin = d => Math.round(((ltSt().fx || {})[d] || 0) / 60000);
const ltCap = () => Math.max(1, Math.round(actGoal() * LT_FIX));
const ltPassed = () => OV_LV.flatMap(l => OV.filter(([id]) => ovIn(id, l) && ovPassed(id, l)).map(([id]) => id + '|' + l));
const ltBase = l => PL_LV.includes(l) ? l : PL_LV.includes(l.replace(/p$/, '')) ? l.replace(/p$/, '') : PL_LV[PL_LV.length - 1];
const ltFmt = d => { const x = new Date(d * DAY + 12 * 3600000); return `${x.getUTCDate()}/${x.getUTCMonth() + 1}`; };
const ltHasData = () => Object.keys(S.cards || {}).length || Object.values(S.k || {}).some(k => Object.keys(k.cards || {}).length);

// ---------- ⏱ phút chữa lỗi / phút luyện đề: phút của actTick cộng thêm vào S.lt.fx[ngày] (buổi chữa: bản đồ, sổ lỗi) hoặc S.lt.ex[ngày] ----------
// v108: phút luyện đề = đang ở màn 🌏 IELTS / 💼 TOEIC / 🎓 Cambridge hoặc việc mở từ đó (đề thử, dạng đề…); về màn nền (Học, phần, bài, Lộ trình…) thì thôi.
let LT_FIX_ON = false, LT_EX_ON = false;
{ const t0 = actTick; actTick = function (now = Date.now()) { if (!S) return; const d = dayOf(now), A = actSt(), b = (A[d] || {}).ms || 0; t0(now);
    if (LT_FIX_ON || LT_EX_ON) { const L = ltSt(), k = LT_FIX_ON ? 'fx' : 'ex', o = L[k] = L[k] || {}; o[d] = (o[d] || 0) + (((A[d] || {}).ms || 0) - b); for (const x of Object.keys(o)) if (+x < d - 60) delete o[x]; } }; }
for (const [n, c] of [['mapFix', 'fix'], ['mapRoot', 'fix'], ['mapRelearn', 'fix'], ['mapGapFix', 'fix'], ['errRun', 'fix'], ['ieltsView', 'ex:ielts'], ['imFix', 'ex:ielts'], ['tmFix', 'ex:toeic'], ['ieSkView', 'ex:ielts'], ['toeicView', 'ex:toeic'], ['toSkView', 'ex:toeic'], ['cbView', 'ex:cambridge'], ['cbSkView', 'ex:cambridge'],
  ['vwRun', ''], ['overview', ''], ['home', ''], ['partView', ''], ['kView', ''], ['learn', ''], ['mapView', ''], ['ltView', ''], ['ltPlanView', ''], ['dict', ''], ['minhView', '']]) {
  const f = window[n]; if (typeof f === 'function') window[n] = function (...a) { LT_FIX_ON = c === 'fix'; LT_EX_ON = c.startsWith('ex:') && !!(S && S.lt && S.lt.goal) && ltKind() === c.slice(3); return f.apply(this, a); }; }   // v109: chỉ kỳ thi của mục tiêu
// v131 📘 bài học của kỳ thi (baihoc.js xlView(kỳ thi, …)): tính phút luyện đề khi là kỳ thi của mục tiêu
{ const f = window.xlView; if (typeof f === 'function') window.xlView = function (...a) { LT_FIX_ON = false; LT_EX_ON = !!(S && S.lt && S.lt.goal) && ltKind() === a[0]; return f.apply(this, a); }; }
const ltExMin = d => Math.round(((ltSt().ex || {})[d] || 0) / 60000);

// ---------- 🎯 mục tiêu (v108, người sáng lập: "học CEFR là nền, mục tiêu IELTS / TOEIC cung cấp thêm nội dung riêng; lộ trình đi từ mục tiêu → tìm điểm yếu → khắc phục → bài mới tới khi đạt") ----------
// 4 loại; mỗi mục tiêu có "nền CEFR cần có": Lên trình / Cambridge = cấp đã chọn; IELTS = ieBase(band) (6.5 → B2+); TOEIC = toBase(điểm) (bảng ETS).
// Band / điểm / ngày thi của IELTS, TOEIC lưu ở S.ie / S.to (một chỗ duy nhất, sửa ở màn kỳ thi cũng đúng); S.lt.goal = { kind, lv, date, at }.
const LT_KIND = { cefr: '📈 Lên trình (không thi)', cambridge: '🎓 Thi Cambridge', ielts: '🌏 Thi IELTS', toeic: '💼 Thi TOEIC' }, LT_EXN = { cambridge: 'Cambridge', ielts: 'IELTS', toeic: 'TOEIC' };
const ltKind = (g = ltSt().goal) => g && LT_KIND[g.kind] ? g.kind : 'cefr';
function ltGoalLv(g = ltSt().goal) { const k = ltKind(g); if (k === 'ielts' && typeof ieBase === 'function') return ieBase(ieSt().target); if (k === 'toeic' && typeof toBase === 'function') return toBase(toSt().target); return (g && LVN[g.lv] && g.lv) || 'a1'; }
const ltGoalDate = (g = ltSt().goal) => { const k = ltKind(g); return (k === 'ielts' ? (S.ie || {}).date : k === 'toeic' ? (S.to || {}).date : '') || (g && g.date) || ''; };
function ltGoalName(g = ltSt().goal) { const k = ltKind(g); if (k === 'ielts') return `IELTS ${bandTxt(ieSt().target)} ${IE_TYPE[ieSt().type] || ''}`.trim(); if (k === 'toeic') return `TOEIC ${toSt().target}`;
  const lv = ltGoalLv(g); return k === 'cambridge' ? `Thi Cambridge ${LVN[lv]}${typeof MOCK !== 'undefined' && MOCK[lv] ? ` (${MOCK[lv].name})` : ''}` : `Lên ${LVN[lv]}`; }

// ---------- ⚖️ chia thời gian nền / đề (v108; người sáng lập duyệt 2/11/2026; số % là ý kiến của Claude, chưa có nghiên cứu xác nhận) ----------
// Nền thiếu ≥ 2 cấp so với nền cần có → 100 % nền (đề thi dùng ngôn ngữ trên trình hiện tại: luyện đề chưa có ích; Claude thêm bậc này khi làm, đã báo người sáng lập);
// thiếu ≥ 1 cấp → 70 % nền / 30 % đề; thiếu < 1 cấp → 30 / 70; đủ nền → 10 / 90 (giữ ôn nền). "Lên trình (không thi)" → 100 % nền. Cấp "+" tính nửa cấp.
const LV_SC = { pre: 0, a1: 1, a2: 2, a2p: 2.5, b1: 3, b1p: 3.5, b2: 4, b2p: 4.5, c1: 5, c2: 6 }, LT_SPLIT = [[2, 100], [1, 70], [0.01, 30], [-99, 10]];
// nền đang có: cấp đã hoàn thành trong app (hoặc cấp 🧭 xếp được nếu cao hơn); chưa xong cấp nào = -1
function ltHave(stage = ovStage()) { const i = OV_LV.indexOf(stage), pl = typeof plSolid === 'function' ? plSolid() : null; let h = ovDone(stage) ? LV_SC[stage] : i > 0 ? LV_SC[OV_LV[i - 1]] : -1; if (pl) h = Math.max(h, LV_SC[pl]); return h; }
function ltSplitFor(k, need) { const gap = Math.round((LV_SC[need] - ltHave()) * 10) / 10, nen = k === 'cefr' ? 100 : LT_SPLIT.find(([t]) => gap >= t)[1], m = actGoal(), exM = Math.round(m * (100 - nen) / 100);
  return { k, need, gap, nen, ex: 100 - nen, exM, nenM: m - exM }; }
const ltSplit = (g = ltSt().goal) => ltSplitFor(ltKind(g), ltGoalLv(g));
function ltSplitTxt(sp) { if (sp.k === 'cefr') return '⚖️ 100% thời gian cho 🧱 nền CEFR (mục tiêu không thi).';
  const n = String(sp.gap).replace('.', ','), why = sp.gap >= 2 ? `nền còn thiếu ${n} cấp so với mức cần (${LVN[sp.need]}). Đề thi dùng ngôn ngữ trên trình hiện tại nên luyện đề lúc này chưa có ích`
    : sp.gap >= 1 ? `nền còn thiếu ${n} cấp (cần ${LVN[sp.need]})` : sp.gap > 0 ? `nền gần đủ (cần ${LVN[sp.need]})` : `nền đã đủ (${LVN[sp.need]}): giữ ôn nền, dồn sức luyện đề`;
  return `⚖️ 🧱 Nền <b>${sp.nen}%</b> (~${sp.nenM} phút) · 🎯 ${LT_EXN[sp.k]} <b>${sp.ex}%</b> (~${sp.exM} phút): ${why}.`; }

// ---------- ⏳ ước thời gian tới mục tiêu (v107: dữ liệu thật có mục tiêu Pre-A1 → B1 trong 30 ngày mà app không báo) ----------
// Số giờ học có hướng dẫn Cambridge công bố, tính từ đầu: A1 ~90–100 · A2 ~180–200 · B1 ~350–400 · B2 ~500–600 · C1 ~700–800 · C2 ~1.000–1.200 giờ
// (lấy giữa khoảng); Pre-A1 và cấp "+" là nội suy. Chỉ để báo "khó kịp", không phải lời hứa: tự học qua app có thể nhanh hoặc chậm hơn nhiều.
const LT_GLH = { pre: 45, a1: 95, a2: 190, a2p: 270, b1: 375, b1p: 460, b2: 550, b2p: 650, c1: 750, c2: 1100 };
// mốc đã có: cấp 🧭 xếp được (nếu cao hơn cấp đang học), không thì cấp liền trước cấp đang học
// v133: kiểm tra xếp được cấp L = đã vững L (học từ L): mốc giờ = giờ của L, kể cả khi đã bấm "bắt đầu học ở L"
const ltFrom = (stage = ovStage()) => { const pl = typeof plSolid === 'function' ? plSolid() : null, i = OV_LV.indexOf(stage), a = i > 0 ? LT_GLH[OV_LV[i - 1]] : 0; return pl ? Math.max(a, LT_GLH[pl]) : a; };
const ltEff = (stage = ovStage()) => { const pl = typeof plSolid === 'function' ? plSolid() : null; return Math.max(OV_LV.indexOf(stage), pl ? OV_LV.indexOf(pl) : -1); };   // chỉ số cấp thật sự đang ở
function ltNeed(lv, mins = actGoal(), stage = ovStage()) { const h = Math.max(0, LT_GLH[lv] - ltFrom(stage)); return { h, days: Math.ceil(h * 60 / Math.max(5, mins)) }; }
// cấp cao nhất kịp trong `days` ngày (null nếu không cấp nào kịp)
function ltFit(days, mins = actGoal(), stage = ovStage()) { let best = null; for (const l of OV_LV.slice(Math.min(ltEff(stage), OV_LV.length - 1))) if (ltNeed(l, mins, stage).days <= days) best = l; return best; }
function ltFeas(g, mins = actGoal(), now = Date.now()) { const lv = ltGoalLv(g), date = ltGoalDate(g), n = ltNeed(lv, mins), left = date ? Math.ceil((Date.parse(date) - now) / DAY) : null;
  return { ...n, lv, left, late: left != null && left >= 0 && n.days > left, fit: left != null && left >= 0 ? ltFit(left, mins) : null }; }
function ltFeasTxt(g, mins = actGoal(), now = Date.now()) { const f = ltFeas(g, mins, now); if (!f.h) return '';
  const mo = f.days / 30, est = mo >= 24 ? `${Math.round(mo / 12)} năm` : mo >= 2 ? `${Math.round(mo)} tháng` : `${f.days} ngày`;
  return `⏳ Ước cần ~${f.h} giờ học${ltKind(g) === 'ielts' || ltKind(g) === 'toeic' ? ` để có nền ${LVN[f.lv]}` : ''}, tức khoảng ${est} với ${mins} phút / ngày.${f.late ? ` <b>⚠️ Còn ${f.left} ngày: khó kịp.</b> Lùi ngày${mins < 45 ? ', tăng phút mỗi ngày' : ''}${f.fit && f.fit !== f.lv ? `, hoặc chọn mục tiêu vừa sức hơn (nền khoảng ${LVN[f.fit]})` : ''}.` : ''}
    <span class="mute">(ước theo số giờ học Cambridge công bố cho từng cấp; chỉ để tham khảo)</span>`; }

// ---------- 🧭 khi nào xếp cấp lại ----------
function ltRe(now = Date.now()) { const P = S.place, g = ltSt().goal;
  // v107: chỉ gợi ý 📝 đề mẫu chính thức khi đã gần cấp mục tiêu (≤ 1 cấp); xa hơn thì ô mục tiêu báo "khó kịp" (dữ liệu thật: Pre-A1 được khuyên làm đề mẫu B1)
  const date = g ? ltGoalDate(g) : ''; if (date) { const left = Math.ceil((Date.parse(date) - now) / DAY), k = ltKind(g);
    if (left >= 0 && left <= LT_EXAM_D && OV_LV.indexOf(ltGoalLv(g)) - ltEff() <= 1) return { k: 'real', t: `Còn ${left} ngày tới ngày thi: ${k === 'ielts' ? 'làm đề thật IELTS (sách Cambridge IELTS) rồi nhập kết quả ở màn IELTS' : k === 'toeic' ? 'làm đề thật TOEIC (của ETS) rồi nhập điểm ở màn TOEIC' : 'làm 📝 đề mẫu chính thức ở màn 🎓 Cambridge'} thay xếp cấp` }; }
  if (!P) return { k: 'first', t: 'Chưa xếp cấp lần nào' };
  const age = Math.floor((now - P.at) / DAY);
  if (age >= LT_RE_D) return { k: 'age', t: `Đã ${age} ngày từ lần xếp trước (xếp lại sau ${LT_RE_D} ngày)` };
  if (P.st && OV_LV.indexOf(ovStage()) > OV_LV.indexOf(P.st)) return { k: 'lv', t: 'Bạn vừa hoàn thành một cấp từ lần xếp trước' };
  if (((S.vc || {}).log || []).some(x => !x.pass && x.at > P.at)) return { k: 'vc', t: 'Có phần trượt 🚀 thi vượt: xếp lại cho đúng cấp' };
  return null; }
const ltReIn = (now = Date.now()) => S.place ? Math.max(0, LT_RE_D - Math.floor((now - S.place.at) / DAY)) : 0;

// ---------- 📆 đợt ----------
function ltStart(now = Date.now()) { const L = ltSt(), f = typeof mapFocus === 'function' && ltHasData() ? mapFocus(now) : null;
  L.d.push({ n: L.d.length + 1, d0: dayOf(now), sel: f ? f.act.map(mapKey) : [], pass: ltPassed() }); S.t = Date.now(); save(); }
function ltSum(c, end) { const days = [...Array(end - c.d0 + 1)].map((_, i) => c.d0 + i), on = days.filter(d => actMin(d) >= ACT_DAY_MIN).length;
  const min = days.reduce((s, d) => s + actMin(d), 0), fx = days.reduce((s, d) => s + ltFixMin(d), 0);
  const fixed = new Set(((S.focus || {}).h || []).filter(([d, , q]) => q && d >= c.d0 && d <= end).map(x => x[2]));
  const inR = cd => cd && cd.d0 >= c.d0 && cd.d0 <= end, nw = Object.values(S.cards || {}).filter(inR).length + Object.values(S.k || {}).reduce((s, k) => s + Object.values(k.cards || {}).filter(inR).length, 0);
  const sel = c.sel || [], selOk = sel.filter(q => fixed.has(q)).length;
  return { on, n: days.length, min, fx, sel: sel.length, selOk, fixed: fixed.size, nw, pass: ltPassed().filter(x => !(c.pass || []).includes(x)),
    okFix: sel.length ? selOk / sel.length >= LT_FIX_OK : null, okDays: on >= LT_DAYS_OK }; }
function ltClose(c, now = Date.now()) { const end = dayOf(now); c.end = end; c.sum = ltSum(c, end); ltStart(now); return c; }

// ---------- 📝 kiểm tra nhẹ cuối đợt: 10 câu kiểu xếp cấp (cấp đang học + cấp kế), chỉ đo xu hướng ----------
async function ltMini(done) { $app.innerHTML = '<p class="mute">Đang tải…</p>'; await Promise.all([loadEB(), kLoad(KIT.np)]); window.CUR = { view: 'lt-kiem-tra' };
  const b = ltBase(ovStage()), lvs = [b, PL_LV[PL_LV.indexOf(b) + 1]].filter(Boolean), qs = lvs.flatMap(l => plQs(l).slice(0, LT_MINI).map(x => ({ ...x, lv: l }))), R = {}, W = []; let i = 0;
  for (const l of lvs) R[l] = [0, 0];
  const show = () => { if (i >= qs.length) return done(R, W, b); const it = qs[i], q = it.q;
    $app.innerHTML = `<div class="row top"><button class="link" data-a="back">← Thôi</button><span class="uname">📝 Kiểm tra cuối đợt · ${i + 1}/${qs.length}</span></div>
      <p class="mute">Không đoán bừa: không biết thì chọn "Chưa biết".</p>${it.w ? `<p class="q">${q.top}</p><p class="mute">${q.sub}</p>` : `${q.head || ''}<p class="q">${q.q}</p>`}
      ${q.opts.map((o, k) => `<button class="opt" data-po="${k}">${esc(o)}</button>`).join('')}<button class="opt" data-po="-1" style="opacity:.75">🤷 Chưa biết</button>`;
    $app.onclick = e => { if (e.target.closest('[data-a="back"]')) return ltView(); const bt = e.target.closest('[data-po]'); if (!bt) return; const k = +bt.dataset.po;
      R[it.lv][1]++; if (k >= 0 && q.opts[k] === q.a) R[it.lv][0]++; else W.push(it); i++; show(); }; };
  show(); }
function ltCheck() { const c = ltCur(); if (!c) return ltView();
  ltMini((R, W, b) => { c.chk = { R }; S.t = Date.now(); save();
    const fin = sc => { if (sc) c.chk.scan = sc; ltClose(c); scrollTo(0, 0); ltSumView(c); };
    const scan = () => typeof mapScan === 'function' && ltHasData() ? mapScan(Date.now(), fin) : fin(null);
    // v106: câu sai ở mục ĐÃ HỌC của cấp đang học → 🔎 hỏi thêm 2 câu (chấm như luyện tập, bản đồ tự thấy); mục chưa học là việc học mới, không xác nhận
    const cands = typeof plConfirm === 'function' ? (W || []).filter(r => r.lv === b && plHas(r)).slice(0, LT_CF) : [];
    if (!cands.length) return scan();
    plConfirm(cands, { gap: false, intro: `Bạn sai ${cands.length} câu ở bài đã học. Hỏi thêm ${PL_CF_N} câu mỗi chỗ để biết sai thật hay chỉ bấm nhầm; sai thật thì 🗺 bản đồ tự đưa vào chỗ cần chữa.` },
      cf => { c.chk.cf = cf; S.t = Date.now(); save(); scan(); }); }); }

// ---------- 📊 tổng kết đợt ----------
function ltSumHtml(c, prev) { const s = c.sum, R = (c.chk || {}).R || {}, P = prev && prev.chk && prev.chk.R || {}, sc = (c.chk || {}).scan;
  const pct = r => r && r[1] ? Math.round(r[0] / r[1] * 100) : null;
  return `<p style="margin:6px 0">📅 Học <b>${s.on}/${s.n}</b> ngày (≥ ${ACT_DAY_MIN} phút) · ⏱ ${s.min} phút · 🩹 chữa lỗi ${s.fx} phút${s.min ? ` (${Math.round(s.fx / s.min * 100)}%)` : ''} · 🆕 ${s.nw} mục mới</p>
    <p style="margin:4px 0">🗺 Chỗ yếu đã chọn đầu đợt: chữa xong <b>${s.selOk}/${s.sel}</b>${s.fixed > s.selOk ? ` · cả đợt chữa xong ${s.fixed} chỗ` : ''}</p>
    ${s.pass.length ? `<p style="margin:4px 0">🚪 Qua thi mới: ${s.pass.map(x => { const [id, l] = x.split('|'), o = OV.find(z => z[0] === id); return `${o ? o[1] + ' ' + o[2] : id} ${LVN[l]}`; }).join(', ')}</p>` : ''}
    ${Object.keys(R).length ? `<p style="margin:4px 0">📝 Kiểm tra nhẹ: ${Object.entries(R).map(([l, r]) => `${LVN[l]} ${r[0]}/${r[1]}${pct(P[l]) != null && pct(r) != null ? ` (đợt trước ${pct(P[l])}%)` : ''}`).join(' · ')}</p>` : ''}
    ${(c.chk || {}).cf && c.chk.cf.n ? `<p style="margin:4px 0">${plCfTxt(c.chk.cf)}</p>` : ''}
    ${sc ? `<p style="margin:4px 0">🔎 Quét lại: từ đang nhớ đúng ${sc.heldOk}/${sc.held}${sc.unl ? ` · từ chưa học đã biết ${sc.known}/${sc.unl}` : ''}</p>` : ''}
    <p style="margin:6px 0 0">${s.okFix == null ? '⬜ Đầu đợt chưa có chỗ yếu để đo' : `${s.okFix ? '✅' : '⚠️'} Chữa xong ≥ ${Math.round(LT_FIX_OK * 100)}% chỗ đã chọn`} · ${s.okDays ? '✅' : '⚠️'} Học ≥ ${LT_DAYS_OK} ngày trong đợt</p>
    <p class="mute" style="margin:4px 0 0">Kiểm tra nhẹ chỉ ${LT_MINI} câu mỗi cấp: lên xuống 20% giữa 2 đợt là bình thường, xem xu hướng qua nhiều đợt.</p>`; }
function ltSumView(c) { $app.onclick = null; const L = ltSt(), prev = L.d[L.d.indexOf(c) - 1], re = ltRe();
  $app.innerHTML = `<div id="lt"></div><h1>📊 Tổng kết đợt ${c.n}</h1><div class="box">${ltSumHtml(c, prev)}</div>
    ${re && re.k !== 'real' ? `<div class="box"><b>🧭 Nên xếp cấp lại</b><p class="mute" style="margin:6px 0">${esc(re.t)}.</p><button data-lt="place">🧭 Xếp cấp lại</button></div>` : ''}
    <button class="pri" data-lt="home">▶ Bắt đầu đợt ${c.n + 1}</button>`; }

// ---------- 🎯 màn mục tiêu = 3 bước (v112, giao diện trực quan: mỗi màn MỘT câu hỏi, ô lớn có hình, một nút "Tiếp") ----------
// ① học để làm gì (+ band / điểm / cấp) → ② trình độ (kiểm tra nhanh / đã kiểm tra / mới bắt đầu / học tiếp) → ③ mỗi ngày bao lâu + ngày thi + ước tính → "Bắt đầu học".
// Giá trị đang chọn nằm ở LT_W và các ô ẩn #ltkind #ltlv #ltband #ltiet #ltscore #ltmin #ltdate (ltFormGoal đọc như trước).
let LT_W = null;
const LT_WK = [['cefr', '📈', 'Giỏi lên', 'Không cần thi'], ['ielts', '🌏', 'Thi IELTS', 'Du học, định cư'], ['toeic', '💼', 'Thi TOEIC', 'Đi làm, ra trường'], ['cambridge', '🎓', 'Thi Cambridge', 'Chứng chỉ A2 → C2']];
const LT_WMIN = [[10, 'Nhẹ nhàng'], [15, 'Vừa sức · phổ biến'], [30, 'Nghiêm túc'], [45, 'Tăng tốc']];
const ltWLvs = k => { const si = OV_LV.indexOf(ovStage()), L = (k === 'cambridge' ? ['a2', 'b1', 'b2', 'c1', 'c2'].filter(l => typeof MOCK === 'undefined' || MOCK[l]) : ['a1', 'a2', 'b1', 'b2', 'c1', 'c2']).filter(l => OV_LV.indexOf(l) >= si); return L.length ? L : ['c2']; };
function ltWInit() { const g = ltSt().goal, ie = S.ie || {}, to = S.to || {}, k = g ? ltKind(g) : ie.set ? 'ielts' : S.exSel === 'toeic' ? 'toeic' : 'cefr';
  const W = { step: 1, kind: k, lv: g && g.lv, band: ie.target || 6.5, type: ie.type || 'ac', score: to.target || 600, mins: actGoal(), date: g ? ltGoalDate(g) : '' }; ltWFix(W); return W; }
function ltWFix(W) { const L = ltWLvs(W.kind); if (!L.includes(W.lv)) W.lv = L[Math.min(L.length - 1, W.kind === 'cambridge' ? 0 : 1)]; }
function ltGoalView(kind) { LT_W = ltWInit(); if (kind && LT_KIND[kind]) { LT_W.kind = kind; ltWFix(LT_W); } ltWizard(); }
function ltWizard() { const W = LT_W, st = ovStage(); BACK = null; window.CUR = { view: 'lo-trinh-muc-tieu' }; $app.onclick = null;
  const chips = (arr, key, cur) => `<div class="chipset">${arr.map(([v, n]) => `<button class="${String(v) === String(cur) ? 'on' : ''}" data-ltwv="${key}|${v}">${n}</button>`).join('')}</div>`;
  let body;
  if (W.step === 1) { const sub = W.kind === 'ielts' ? `<p class="mute" style="margin:0">Loại thi</p>${chips(Object.entries(IE_TYPE), 'type', W.type)}<p class="mute" style="margin:10px 0 0">Band muốn đạt</p>${chips(IE_BANDS.map(x => [x, bandTxt(x)]), 'band', W.band)}`
      : W.kind === 'toeic' ? `<p class="mute" style="margin:0">Điểm muốn đạt (Nghe + Đọc)</p>${chips(TO_TG.map(x => [x, x]), 'score', W.score)}`
      : `<p class="mute" style="margin:0">${W.kind === 'cambridge' ? 'Kỳ thi muốn đạt' : 'Muốn lên tới trình độ'}</p>${chips(ltWLvs(W.kind).map(l => [l, W.kind === 'cambridge' && typeof MOCK !== 'undefined' && MOCK[l] ? esc(MOCK[l].name) : LVN[l]]), 'lv', W.lv)}`;
    body = `<h1>Bạn học tiếng Anh để làm gì?</h1><p class="mute">Chọn 1. Đổi lại lúc nào cũng được.</p>
      <div class="grid2" style="margin-top:14px">${LT_WK.map(([k, ic, t, d]) => `<button class="optc ${k === W.kind ? 'on' : ''}" data-ltk="${k}"><span class="ic">${ic}</span><b>${t}</b><span class="s">${d}</span></button>`).join('')}</div>
      <div class="box" style="margin-top:14px">${sub}</div>
      <button class="btnbig" data-ltw="2">Tiếp</button>`; }
  else if (W.step === 2) { const P = S.place, has = ltHasData();
    body = `<h1>Bạn đang ở trình độ nào?</h1><p class="mute">Để app bắt đầu đúng chỗ, khỏi học lại cái đã biết.</p>
      <button class="optr" data-ltwp><span class="ic">🧭</span><span><b>Kiểm tra nhanh · 5 phút</b><span class="s">Khuyên dùng: app hỏi vài câu rồi tự xếp</span></span></button>
      ${P ? `<button class="optr on" data-ltw="3"><span class="ic">✅</span><span><b>Đã kiểm tra: ${P.top ? LVN[P.top] : 'mới bắt đầu'}</b><span class="s">Ngày ${ltFmt(dayOf(P.at))} · dùng kết quả này</span></span></button>` : ''}
      ${has ? `<button class="optr" data-ltw="3"><span class="ic">📚</span><span><b>Học tiếp từ ${LVN[st]}</b><span class="s">Theo tiến độ đã có trong app</span></span></button>`
        : `<button class="optr" data-ltw="3" data-ltself="new"><span class="ic">🌱</span><span><b>Tôi mới bắt đầu</b><span class="s">Học từ đầu</span></span></button>`}
      <button class="link" data-ltw="1">‹ Quay lại</button>`; }
  else body = `<h1>Mỗi ngày bạn học bao lâu?</h1><p class="mute">Đều đặn mỗi ngày nhớ lâu hơn học dồn.</p>
      ${LT_WMIN.map(([m, n]) => `<button class="optr ${m === +W.mins ? 'on' : ''}" data-ltwv="mins|${m}"><span class="ic">⏱</span><span><b>${m} phút</b><span class="s">${n}</span></span></button>`).join('')}
      <p style="margin:12px 0 4px">${W.kind === 'cefr' ? 'Ngày muốn đạt' : 'Ngày thi'} <span class="mute">· nếu đã biết</span></p><input id="ltdate" type="date" value="${esc(W.date || '')}">
      <div class="box" id="lthint"></div>
      <button class="btnbig" data-lt="goal">Bắt đầu học</button><button class="link" data-ltw="2">‹ Quay lại</button>`;
  $app.innerHTML = `<div class="wiz">${ltSt().goal ? '<div class="row top"><span class="mute">🎯 Đổi mục tiêu</span><button class="link" data-lt="home">✕ Đóng</button></div>' : ''}<div class="wdots">${[1, 2, 3].map(i => `<i class="${i <= W.step ? 'on' : ''}"></i>`).join('')}</div>${body}
    <input type="hidden" id="ltkind" value="${W.kind}"><input type="hidden" id="ltlv" value="${W.lv}"><input type="hidden" id="ltband" value="${W.band}"><input type="hidden" id="ltiet" value="${W.type}"><input type="hidden" id="ltscore" value="${W.score}"><input type="hidden" id="ltmin" value="${W.mins}">${W.step === 3 ? '' : `<input type="hidden" id="ltdate" value="${esc(W.date || '')}">`}</div>`;
  scrollTo(0, 0); if (W.step === 3) ltHint(); }
function ltFormGoal() { const v = id => (document.getElementById(id) || {}).value, k = v('ltkind') || 'cefr', d = v('ltdate');
  const lv = k === 'ielts' ? ieBase(+v('ltband') || 6.5) : k === 'toeic' ? toBase(+v('ltscore') || 600) : v('ltlv');
  return { kind: k, lv, date: /^\d{4}-\d{2}-\d{2}$/.test(d || '') ? d : '' }; }
// ước tính ngắn (bước 3): bao lâu, có kịp ngày thi không, mỗi ngày chia nền / đề
const ltEstTxt = fe => { const mo = fe.days / 30; return !fe.h ? 'bạn đã đủ trình độ cần' : mo >= 24 ? `khoảng ${Math.round(mo / 12)} năm` : mo >= 2 ? `khoảng ${Math.round(mo)} tháng` : `khoảng ${fe.days} ngày`; };
function ltHint() { const el = document.getElementById('lthint'), f = ltFormGoal(), mn = +(document.getElementById('ltmin') || {}).value || actGoal(); if (!el || !LVN[f.lv]) return;
  const m0 = S.goal; S.goal = mn; const sp = ltSplitFor(f.kind, f.lv), fe = ltFeas({ kind: 'cefr', lv: f.lv, date: f.date }, mn); S.goal = m0;   // theo số phút đang chọn (chưa lưu)
  el.innerHTML = `<p style="margin:0">⏳ Ước tính: <b>${ltEstTxt(fe)}</b>${f.kind === 'ielts' || f.kind === 'toeic' ? ` để có trình độ ${LVN[f.lv]}` : ''}</p>
    ${fe.late ? `<p style="margin:6px 0 0">⚠️ Còn ${fe.left} ngày: <b>khó kịp</b>. Nên lùi ngày thi hoặc học nhiều phút hơn.</p>` : ''}
    ${sp.k !== 'cefr' ? `<p class="mute" style="margin:6px 0 0">Mỗi ngày: nền ${sp.nenM} phút${sp.exM ? ` · luyện đề ${sp.exM} phút` : ' (chưa cần luyện đề)'}</p>` : ''}
    <p class="mute" style="margin:6px 0 0;font-size:13px">Ước theo số giờ học Cambridge công bố; chỉ để tham khảo.</p>`; }
document.addEventListener('change', e => { if (!S || !e.target.closest) return; if (e.target.closest('#ltdate') && LT_W) LT_W.date = e.target.value || ''; if (e.target.closest('#ltlv, #ltdate, #ltmin, #ltiet, #ltband, #ltscore')) ltHint(); });

// ---------- 📅 kế hoạch kỳ thi ở ô mục tiêu (v111: chuyển từ màn IELTS / TOEIC về Lộ trình; phần học chỉ còn nội dung) ----------
function ltExamPlan(k, sp) { try {
  if (k === 'ielts') { const P = iePlan(), warn = P.wk != null && P.need && P.wk < P.need[0];
    return `<p style="margin:4px 0">${P.wk != null ? `Còn <b>${P.wk} tuần</b> · ` : ''}${P.g != null ? `band ước (Overall) cách mục tiêu <b>${bandTxt(Math.max(0, P.g))}</b>` : 'chưa có band ước: làm 1 đề thử IELTS ở 📚 Học → 🎓 Luyện thi'}</p>
      ${sp.ex ? `<p class="mute" style="margin:2px 0">Mỗi tuần ~${String(Object.values(P.hrs).reduce((a, b) => a + b, 0)).replace('.', ',')} giờ luyện đề: ${Object.entries(P.hrs).map(([x, h]) => `${IE_SK[x][0]} ${String(h).replace('.', ',')} giờ`).join(' · ')} (Viết / Nói nặng hơn). Mỗi 2 tuần 1 đề thử app, mỗi 4 tuần 1 đề thật.</p>` : ''}
      ${warn ? `<p style="margin:2px 0">⚠️ Còn ${P.wk} tuần, cần tăng ${bandTxt(P.g)} band: kinh nghiệm thường gặp (không phải số chính thức) là ${P.need[0]}–${P.need[1]} tuần. Cân nhắc lùi ngày thi hoặc hạ mục tiêu.</p>` : ''}`; }
  if (k === 'toeic') { const o = toSt(), now = toNow(), wk = o.date ? Math.max(0, Math.ceil((new Date(o.date + 'T12:00:00') - Date.now()) / (7 * DAY))) : null;
    return `<p style="margin:4px 0">${wk != null ? `Còn <b>${wk} tuần</b> · ` : ''}${now.tot != null ? `điểm ước cách mục tiêu <b>${Math.max(0, o.target - now.tot)}</b>` : 'chưa có điểm ước: làm 1 đề thử TOEIC ở 📚 Học → 🎓 Luyện thi'}</p>`; }
} catch (e) {} return ''; }

// ---------- 🎯 ô mục tiêu ở 📚 Học: tên mục tiêu, việc hôm nay, ⚖️ chia thời gian, nút mở phần riêng của kỳ thi ----------
function ltGoalCard(stage = ovStage()) { const g = S.lt && S.lt.goal;
  if (!g) return `<div class="box"><b>🎯 Chưa đặt mục tiêu</b><p class="mute" style="margin:6px 0">Đặt mục tiêu ở 🧭 Lộ trình: app chia việc mỗi ngày theo mục tiêu. Mục 🎓 Thi ở hàng trên vẫn mở được mọi kỳ thi.</p><button class="pri" data-ltgo>🎯 Đặt mục tiêu ›</button></div>`;
  const sp = ltSplit(g), TP = typeof todayPlan === 'function' ? todayPlan(stage).filter(x => x.done != null) : [], ok = TP.filter(x => x.done).length, ic = { cambridge: '🎓', ielts: '🌏', toeic: '💼' }[sp.k];
  return `<div class="box"><div class="row"><b>🎯 ${esc(ltGoalName(g))}</b><button class="link" data-ltgo>🧭 Lộ trình ›</button></div>
    <p class="mute" style="margin:4px 0">📅 Việc hôm nay: ${ok}/${TP.length} xong · ⚖️ nền ${sp.nen}%${sp.k !== 'cefr' ? ` · đề ${sp.ex}%` : ''}</p>
    ${sp.k !== 'cefr' ? `<button data-ltex style="margin:6px 0 0">${ic} Phần riêng cho mục tiêu: luyện ${LT_EXN[sp.k]} ›${sp.ex ? '' : '<small style="display:block;opacity:.85">chưa nên luyện đề, học nền trước; vẫn xem được dạng đề</small>'}</button>` : ''}</div>`; }

// ---------- 🧭 màn chính = HÔM NAY (v112, giao diện trực quan): lời chào + 🔥 · vòng phút hôm nay · MỘT nút ▶ Học tiếp · danh sách việc ✓ / ▶ · ô 🎯 mục tiêu ----------
// Mọi con số kế hoạch (ước thời gian, ⚖️ chia nền / đề, đợt 10 ngày, xếp cấp, tuần còn lại…) dồn vào màn "Đường tới mục tiêu" (ltPlanView), mở khi bấm ô 🎯.
const ltRing = (m, g) => { const r = 38, C = 2 * Math.PI * r, f = Math.max(0, Math.min(1, g ? m / g : 0));
  return `<svg width="92" height="92" viewBox="0 0 92 92" role="img" aria-label="${m} trên ${g} phút"><circle cx="46" cy="46" r="${r}" fill="none" style="stroke:var(--line)" stroke-width="10"/><circle cx="46" cy="46" r="${r}" fill="none" style="stroke:var(--good)" stroke-width="10" stroke-linecap="round" stroke-dasharray="${C.toFixed(1)}" stroke-dashoffset="${(C * (1 - f)).toFixed(1)}" transform="rotate(-90 46 46)"/><text x="46" y="45" text-anchor="middle" font-size="22" font-weight="800" style="fill:var(--fg)">${m}</text><text x="46" y="62" text-anchor="middle" font-size="12" style="fill:var(--mute)">/ ${g} phút</text></svg>`; };
const ltHello = () => { const h = new Date().getHours(); return h < 11 ? 'Chào buổi sáng' : h < 14 ? 'Chào buổi trưa' : h < 18 ? 'Chào buổi chiều' : 'Chào buổi tối'; };
// v133 (bản mẫu "Đề xuất · Hôm nay"): ô mục tiêu nói MỘT trình độ: "Bạn đang B1 · cần khoảng B2+", thanh qua các cấp còn lại, bao lâu với số phút đang chọn
// % của cấp đang học = trung bình các phần bắt buộc (phần đã qua thi = 100%)
//   v133: một phần chưa qua thi = 80% × 📘 Học / GATE_LEARN, + 20% × 🔁 Nhớ / GATE_MEM khi đã học đủ (Nhớ dồn cả cấp dưới nên chưa học bài nào thì không cộng)
const ltLvPct = lv => { const r = ovReq(lv); if (!r.length) return 0; return Math.round(r.reduce((t, [id]) => { if (ovPassed(id, lv)) return t + 1; const x = ovStat(id, lv); if (!x) return t; const l = Math.min(1, x.lq / GATE_LEARN); return t + 0.8 * l + (l >= 1 ? 0.2 * Math.min(1, x.mq / GATE_MEM) : 0); }, 0) / r.length * 100); };
const ltCurLv = (stage = ovStage()) => (typeof plPend === 'function' && plPend(stage)) || stage;   // cấp đang ở (kiểm tra xếp được mà chưa chọn: lấy cấp kiểm tra)
function ltGoalBox(g, stage) { const k = ltKind(g), need = ltGoalLv(g), cur = ltCurLv(stage), date = ltGoalDate(g), left = date ? Math.ceil((Date.parse(date) - Date.now()) / DAY) : null;
  const ok = ovDone(need) || OV_LV.indexOf(cur) > OV_LV.indexOf(need), path = OV_LV.slice(OV_LV.indexOf(cur), Math.max(OV_LV.indexOf(cur), OV_LV.indexOf(need)) + 1);
  const lab = path.length <= 5 ? path : [path[0], path[1], '…', path[path.length - 1]], fe = ltFeas(g);
  const f = ok ? 100 : Math.max(3, Math.round(ltLvPct(cur) / Math.max(1, path.length - 1))), wk = left != null && left >= 0 ? (left >= 14 ? `còn ${Math.ceil(left / 7)} tuần tới ngày thi` : `còn ${left} ngày tới ngày thi`) : '';
  return `<button class="goalcard" data-ltplan><span style="flex:1;min-width:0"><span class="row"><b>Mục tiêu: ${esc(ltGoalName(g))}</b><span class="chev">›</span></span>
    <span class="mute" style="display:block;font-size:15px">${ok ? `Bạn đã đủ trình độ cần (${LVN[need]})` : `Bạn đang <b style="color:var(--fg)">${LVN[cur]}</b> · ${k === 'cefr' ? 'mục tiêu' : 'cần khoảng'} <b style="color:var(--fg)">${LVN[need]}</b>`}</span>
    <span style="display:block;margin:8px 0 4px">${bar(f, 100, ok ? 'var(--good)' : 'var(--accent)')}</span>
    ${ok ? '' : `<span class="lvlabels">${lab.map((l, i) => `<span${i === 0 ? ' class="on"' : ''}>${l === '…' ? '…' : LVN[l]}</span>`).join('')}</span>`}
    <span class="mute" style="display:block;font-size:14px;margin-top:4px">${fe.h ? `${ltEstTxt(fe).replace(/^k/, 'K')} nếu học ${actGoal()} phút mỗi ngày` : ''}${fe.h && wk ? ' · ' : ''}${wk}${fe.late ? ' · ⚠️ khó kịp' : ''}</span></span></button>`; }
// v114 (người sáng lập: "để tất cả bản đồ chỗ yếu vào bên trong lộ trình, tách lộ trình thành 2 phần"): 🧭 Lộ trình có 2 phần ngang hàng
//   📅 Hôm nay (ltView) · 🗺 Chỗ yếu (mapView: bản đồ CEFR + bản đồ band IELTS + bản đồ điểm TOEIC). Bản đồ chỉ còn ở đây; nơi khác chỉ lối tắt.
const ltSeg = cur => `<div class="seg" role="tablist">${[['today', '📅 Hôm nay'], ['map', '📈 Tiến độ']].map(([k, t]) => `<button data-ltseg="${k}" role="tab" aria-selected="${k === cur}"${k === cur ? ' class="on"' : ''}>${t}</button>`).join('')}</div>`;
async function ltView() { BACK = null; window.CUR = { view: 'lo-trinh' }; $app.onclick = null;
  if (!(PA && Object.values(KIT).every(P => P.items))) { $app.innerHTML = '<div id="lt"></div><p class="mute">Đang tải…</p>'; try { await Promise.all([paLoad(), ...Object.values(KIT).map(kLoad)]); } catch (e) {} }
  const L = ltSt(); if (!L.goal) return ltGoalView();
  if (ltKind(L.goal) === 'ielts' && typeof ieLoad === 'function') try { await ieLoad(); } catch (e) {} if (ltKind(L.goal) === 'toeic' && typeof toLoad === 'function') try { await toLoad(); } catch (e) {}
  const now = Date.now(), t = dayOf(now), stage = ovStage(), g = L.goal; if (!ltCur()) ltStart(now);   // v107: có mục tiêu là có đợt
  const m = actMin(t), gm = actGoal(), stk = actStreak(now), items = todayItems(stage, { lt: 1 }), main = items.filter(x => x.done != null), nx = main.find(x => !x.done), ok = main.filter(x => x.done).length;
  // v133 (bản mẫu "Đề xuất · Hôm nay"): lời chào + chuỗi ngày · vòng phút · MỘT nút ▶ Học tiếp ghi rõ việc và số phút · việc hôm nay (số phút + vì sao) · ô mục tiêu một trình độ
  $app.innerHTML = `<div id="lt"></div>${ltSeg('today')}
    <div class="hello"><h1 style="font-size:28px;margin:4px 0">${ltHello()}</h1>${stk ? `<span class="pill">🔥 ${stk} ngày liền</span>` : ''}</div>
    <div class="ringrow">${ltRing(m, gm)}<div><b style="font-size:19px">${m >= gm ? 'Xong mục tiêu hôm nay 🎉' : `Còn ${gm - m} phút`}</b><p class="mute" style="margin:0">${m >= gm ? 'Học thêm nếu muốn' : main.length ? `Xong ${ok} / ${main.length} việc hôm nay` : 'để xong việc hôm nay'}</p></div></div>
    ${nx ? `<button class="btnbig" data-ltnext>▶ Học tiếp<small>${esc(nx.title)}${nx.min ? ` · khoảng ${nx.min} phút` : ''}</small></button>`
      : `<button class="btnbig" data-ltmore style="background:var(--good)">🎉 Xong việc hôm nay<small>Muốn học thêm: mở 📚 Học</small></button>`}
    <h2>Việc hôm nay</h2>
    ${todayBox(stage, { lt: 1, items })}
    ${ltGoalBox(g, stage)}`; }

// ---------- 📈 Tiến độ (v133, bản mẫu "Đề xuất · Tiến độ"; gộp "Đường tới mục tiêu" (v112) và "🗺 Chỗ yếu" (v114) thành phần thứ hai của 🧭 Lộ trình) ----------
// Trả lời 4 câu: đang ở đâu (MỘT trình độ + đường cấp) · bao lâu tới mục tiêu (số phút đang chọn và 45 phút) · mỗi ngày chia giờ thế nào, vì sao · cần sửa gì (3 chỗ yếu nhất).
// Bản đồ chỗ yếu đầy đủ (4 mục Nền · Cambridge · IELTS · TOEIC) là màn con: "Xem bản đồ chỗ yếu đầy đủ ›". Không đổi luật đo.
const ltPlus = l => /p$/.test(l) ? `Nửa khó hơn của ${LVN[l.replace(/p$/, '')]}` : '';
function ltFixRows(k, now = Date.now()) { const out = [], gaps = typeof plGaps === 'function' ? plGaps(now).filter(x => !x.cho) : [], red = ltHasData() && typeof mapRed === 'function' ? mapRed(now) : [];
  if (gaps.length) out.push(`<button class="fixrow" data-ltfix="gap"><span><b>🧭 ${gaps.length} chỗ hổng nền</b><small>Bài kiểm tra phát hiện, đã hỏi lại vẫn sai</small></span><span class="go">Sửa ›</span></button>`);
  red.slice(0, 3).forEach((l, i) => { const o = OV.find(x => x[0] === l.id) || ['', '', '']; out.push(`<button class="fixrow" data-ltfix="${i}"><span><b>${o[1]} ${esc(lsName(l))}</b><small>${esc(lsWhy(l))}</small></span><span class="go">Sửa ›</span></button>`); });
  try { const W = k === 'ielts' && typeof imSure === 'function' ? imSure() : k === 'toeic' && typeof tmSure === 'function' ? tmSure() : [];
    W.slice(0, 2).forEach(w => out.push(`<button class="fixrow" data-ltfix="${k === 'ielts' ? 'ie' : 'to'}|${esc(w.u)}"><span><b>${k === 'ielts' ? '🌏 IELTS' : '💼 TOEIC'} · ${esc(String(w.t).replace(/<[^>]+>/g, ''))}</b><small>${esc(w.v)}</small></span><span class="go">Sửa ›</span></button>`)); } catch (e) {}
  return out; }
async function ltPlanView() { BACK = null; window.CUR = { view: 'lo-trinh-tien-do' }; $app.onclick = null;
  const L = ltSt(); if (!L.goal) return ltGoalView();
  if (!(PA && Object.values(KIT).every(P => P.items))) { $app.innerHTML = '<div id="lt"></div><p class="mute">Đang tải…</p>'; try { await Promise.all([paLoad(), ...Object.values(KIT).map(kLoad)]); } catch (e) {} }
  if (ltKind(L.goal) === 'ielts' && typeof ieLoad === 'function') try { await ieLoad(); } catch (e) {} if (ltKind(L.goal) === 'toeic' && typeof toLoad === 'function') try { await toLoad(); } catch (e) {}
  const now = Date.now(), t = dayOf(now), stage = ovStage(), g = L.goal, k = ltKind(g), need = ltGoalLv(g), sp = ltSplit(g), c = ltCur() || (ltStart(now), ltCur()), re = ltRe(now), P = S.place;
  const pend = typeof plPend === 'function' ? plPend(stage) : null, cur = pend || stage, ci = OV_LV.indexOf(cur), ni = OV_LV.indexOf(need), date = ltGoalDate(g), left = date ? Math.ceil((Date.parse(date) - now) / DAY) : null;
  // ① đường cấp: cấp dưới (bỏ qua theo bài kiểm tra / đã xong) gộp một dòng, cấp đang học có %, các cấp còn lại, 🎯 cấp cần
  const ap = P && P.ap ? P.ap.lv : null, below = OV_LV.slice(0, OV_LV.indexOf(stage)), skip = ap ? below.filter(l => OV_LV.indexOf(l) < OV_LV.indexOf(ap)) : [], doneIn = below.filter(l => !skip.includes(l));
  const rng = a => a.length > 1 ? `${LVN[a[0]]} → ${LVN[a[a.length - 1]]}` : LVN[a[0]];
  const req = ovReq(cur), pass = req.filter(([id]) => ovPassed(id, cur)).length, nxt = OV_LV[ci + 1];
  const step = (cls, d, b, sub) => `<div class="lvstep ${cls}"><div class="d">${d}</div><b>${b}</b>${sub ? `<small>${sub}</small>` : ''}</div>`;
  const path = [skip.length ? step('ok', '✓', rng(skip), 'Bỏ qua theo bài kiểm tra') : '', doneIn.length ? step('ok', '✓', rng(doneIn), 'Đã xong trong app') : '',
    pend ? step('cur', '●', `${LVN[cur]} · theo bài kiểm tra`, `Chưa chọn nơi bắt đầu. <button class="link" data-plstart>Chọn ›</button>`)
      : step('cur', '●', `${LVN[cur]} · đang học · ${ltLvPct(cur)}%`, `${bar(ltLvPct(cur), 100, 'var(--accent)')}${nxt ? `Lên ${LVN[nxt]} khi ${req.length} kỹ năng qua bài thi lên cấp. Hiện ${pass} / ${req.length}.` : `Qua bài thi ${req.length} kỹ năng là xong cấp cuối.`}`),
    ...OV_LV.slice(ci + 1, ni).map(l => step('', '', LVN[l], ltPlus(l))),
    ni > ci ? step('goal', '🎯', `${LVN[need]} · mục tiêu`, k === 'cefr' ? '' : `Đủ trình độ cho ${esc(ltGoalName(g))}`) : step('ok', '✓', 'Đã đủ trình độ cho mục tiêu', '')].join('');
  // ② bao lâu: số phút đang chọn và 45 phút
  const mins = [...new Set([actGoal(), 45])].filter(m => m >= actGoal()), fe = ltFeas(g);
  const how = mins.map(m => { const f = ltFeas(g, m); return `<div class="row" style="font-size:15px;margin:2px 0"><span>${m} phút mỗi ngày</span><b>${f.h ? ltEstTxt(f) : 'đã đủ'}</b></div>`; }).join('');
  const wk = left != null && left >= 0 ? (left >= 14 ? `${Math.ceil(left / 7)} tuần` : `${left} ngày`) : '';
  // ③ chia giờ (mục tiêu là kỳ thi): một câu vì sao bằng lời thường
  const n = String(sp.gap).replace('.', ','), why = sp.gap >= 2 ? `Bạn còn thiếu khoảng ${n} cấp: học tiếng Anh trước, chưa cần luyện đề. Đề thi dùng từ và câu khó hơn trình độ hiện tại.`
    : sp.gap >= 1 ? `Bạn còn thiếu khoảng ${n} cấp, nên học tiếng Anh nhiều hơn luyện đề. Gần đủ trình độ thì app dồn giờ sang luyện đề.`
    : sp.gap > 0 ? 'Bạn gần đủ trình độ: dồn dần giờ sang luyện đề.' : 'Bạn đã đủ trình độ: dồn sức luyện đề, giữ ôn tiếng Anh.';
  const fix = ltFixRows(k, now), days = [...Array(LT_D)].map((_, x) => c.d0 + x), i = ltDay(c, now), hist = L.d.filter(x => x.end).slice().reverse();
  const vcOk = !pend && typeof vcView === 'function' && req.some(([id]) => !ovPassed(id, cur));
  $app.innerHTML = `<div id="lt"></div>${ltSeg('map')}
    <div class="row" style="align-items:flex-end;margin:4px 0 10px"><span><span class="mute">Trình độ của bạn</span><b class="lvbig">${LVN[cur]}</b></span>
      <span style="text-align:right;font-size:14px"><span class="mute">${P ? `Kiểm tra ngày ${ltFmt(dayOf(P.at))}` : 'Chưa kiểm tra'}</span><br><button class="link" data-lt="place">${P ? 'Đo lại' : 'Kiểm tra'} ›</button></span></div>
    <div class="box"><b>Đường tới ${esc(ltGoalName(g))}</b><div class="lvpath" style="margin-top:8px">${path}</div></div>
    <div class="box"><b>Bao lâu tới mục tiêu?</b>${fe.h ? how : '<p style="margin:4px 0">Bạn đã đủ trình độ cần.</p>'}
      ${wk ? `<p style="margin:6px 0 0">Ngày thi: còn ${wk}.${fe.late ? ` <b style="color:var(--warn)">⚠️ Khó kịp</b>: học nhiều phút hơn hoặc lùi ngày thi.` : ''}</p>` : ''}
      <p class="mute" style="margin:6px 0 0;font-size:13px">Ước theo số giờ học Cambridge công bố cho mỗi cấp; chỉ để tham khảo.</p><button class="link" data-lt="edit">Đổi số phút mỗi ngày ›</button></div>
    ${k === 'cefr' ? '' : `<div class="box"><b>${actGoal()} phút mỗi ngày chia thế nào?</b>
      <div class="split" style="margin-top:8px">${sp.nen ? `<div style="width:${sp.nen}%;background:var(--accent)">Tiếng Anh · ${sp.nenM} phút</div>` : ''}${sp.ex ? `<div style="width:${sp.ex}%;background:var(--warn)">${LT_EXN[k]} · ${sp.exM}’</div>` : ''}</div>
      <p style="margin:8px 0 0;font-size:15px">${why}</p>${k === 'ielts' || k === 'toeic' ? `<details><summary>Kế hoạch luyện đề theo tuần</summary>${ltExamPlan(k, sp)}</details>` : ''}</div>`}
    <div class="box"><b>Chỗ yếu cần sửa</b>${fix.length ? `<div style="margin-top:6px">${fix.join('')}</div>` : '<p class="mute" style="margin:4px 0">Chưa có. Làm bài tập, chỗ nào sai nhiều sẽ hiện ở đây.</p>'}
      <button class="link" data-mapv="lt" style="margin-top:4px">Xem bản đồ chỗ yếu đầy đủ ›</button></div>
    <div class="box"><b>10 ngày này</b><div class="days10">${days.map(d => `<i class="${actMin(d) >= ACT_DAY_MIN ? 'ok' : d === t ? 'now' : ''}" title="${actMin(d)} phút"></i>`).join('')}</div>
      <p class="mute" style="margin:0">Ngày ${Math.min(i, LT_D)} / ${LT_D} · ngày ${LT_D} có bài kiểm tra ngắn</p>${i >= LT_D ? '<button class="pri" data-lt="chk" style="margin-top:8px">📝 Làm bài kiểm tra 10 ngày</button>' : ''}</div>
    ${vcOk ? `<p class="mute" style="margin:6px 0">Thấy bài ${LVN[cur]} dễ? <button class="link" data-vcv="${cur}">🚀 Thi vượt ${LVN[cur]} ›</button></p>` : ''}
    ${re && re.k === 'first' ? '' : re && re.k !== 'real' ? `<p class="mute" style="margin:6px 0">🧭 Nên đo lại trình độ: ${esc(re.t).toLowerCase()}.</p>` : re ? `<p style="margin:6px 0">📝 ${esc(re.t)}. <button class="link" data-ltex>Mở ›</button></p>` : ''}
    <button class="btnbig ghost" data-lt="edit" style="font-size:16px">✏️ Đổi mục tiêu</button>
    ${hist.length ? `<details class="box"><summary>📊 Các đợt 10 ngày trước (${hist.length})</summary>${hist.map(x => `<div style="margin:8px 0"><b>Đợt ${x.n}</b> <span class="mute">${ltFmt(x.d0)} → ${ltFmt(x.end)}</span>${ltSumHtml(x, L.d[L.d.indexOf(x) - 1])}</div>`).join('<hr style="border:0;border-top:1px solid var(--line)">')}</details>` : ''}
    <p class="mute" style="font-size:13px">Luật chi tiết: 👤 Tôi → 📘 Luật và cách dùng.</p>`; }
const ltProgView = ltPlanView;

// ---------- ▶ Học tiếp: làm việc kế tiếp; khi đang học dở ở màn khác thì có dải nhắc "🧭 Hôm nay: còn N việc" để quay về ----------
let LT_SESS = false;
function ltNextGo() { LT_SESS = true; const b = document.querySelector('#today .task.next'); if (b) { b.click(); return; } toast('🎉 Xong hết việc hôm nay'); }
const LT_BANNER_ON = () => document.getElementById('grid') || document.getElementById('part') || document.getElementById('ov') || document.getElementById('ie') || ['ielts', 'toeic', 'cambridge'].includes((window.CUR || {}).view);
function ltBanner() { if (!S || !LT_SESS || document.getElementById('lt') || document.getElementById('ltbanner') || !LT_BANNER_ON() || !(S.lt && S.lt.goal)) return;
  let n = 0; try { n = todayItems(ovStage()).filter(x => x.done === false).length; } catch (e) { return; }
  $app.insertAdjacentHTML('afterbegin', `<div id="ltbanner" class="ltbanner"><button class="link" data-ltgo>🧭 ${n ? `Hôm nay còn ${n} việc · ▶ Tiếp` : '🎉 Xong việc hôm nay · về Lộ trình'}</button><button class="link" data-ltx aria-label="Ẩn">✕</button></div>`); }
new MutationObserver(() => { try { ltBanner(); } catch (e) {} }).observe($app, { childList: true });

document.addEventListener('click', e => { if (!S) return; let b;
  if ((b = e.target.closest('[data-ltk]'))) { if (!LT_W) LT_W = ltWInit(); LT_W.kind = b.dataset.ltk; ltWFix(LT_W); return ltWizard(); }
  if ((b = e.target.closest('[data-ltwv]'))) { if (!LT_W) LT_W = ltWInit(); const [key, val] = b.dataset.ltwv.split('|'); LT_W[key] = ['band', 'score', 'mins'].includes(key) ? +val : val; return ltWizard(); }
  if ((b = e.target.closest('[data-ltw]'))) { if (!LT_W) LT_W = ltWInit(); LT_W.step = +b.dataset.ltw; if (b.dataset.ltself) LT_W.self = b.dataset.ltself; return ltWizard(); }
  if (e.target.closest('[data-ltwp]')) { if (!LT_W) LT_W = ltWInit(); return placeView(() => { LT_W.step = 3; ltWizard(); }, 'Tiếp ›'); }
  if ((b = e.target.closest('[data-ltseg]'))) { scrollTo(0, 0); if (b.dataset.ltseg === 'map') { MAP_BACK = 'lt'; return ltPlanView(); } return ltView(); }   // v133: phần 2 = 📈 Tiến độ
  if ((b = e.target.closest('[data-ltfix]'))) { const v = b.dataset.ltfix; scrollTo(0, 0); MAP_BACK = 'lt';
    if (v === 'gap') return mapGapFix(); if (v.startsWith('ie|')) return imFix(v.slice(3)); if (v.startsWith('to|')) return tmFix(v.slice(3));
    const l = mapRed()[+v]; return l ? mapFixLesson(l) : ltPlanView(); }
  if (e.target.closest('[data-ltnext]')) return ltNextGo();
  if (e.target.closest('[data-ltmore]')) { scrollTo(0, 0); return overview(); }
  if (e.target.closest('[data-ltplan]')) { scrollTo(0, 0); return ltPlanView(); }
  if (e.target.closest('[data-ltx]')) { LT_SESS = false; const x = document.getElementById('ltbanner'); if (x) x.remove(); return; }
  b = e.target.closest('[data-lt]'); if (b) { const a = b.dataset.lt, L = ltSt(); scrollTo(0, 0);
    if (a === 'home') { LT_W = null; return ltView(); }
    if (a === 'edit') return ltGoalView();
    if (a === 'goal') { const f = ltFormGoal(), v = id => (document.getElementById(id) || {}).value, mn = +v('ltmin');
      if (!LVN[f.lv]) return toast('Chọn mục tiêu.');
      if (f.kind === 'ielts') { const o = ieSt(); o.type = v('ltiet') || o.type; o.target = +v('ltband') || o.target; o.set = 1; o.date = f.date || null; }
      if (f.kind === 'toeic') { const o = toSt(); o.target = +v('ltscore') || o.target; o.date = f.date || null; }
      L.goal = { kind: f.kind, lv: f.lv, date: f.date, at: Date.now() }; S.exSel = f.kind === 'ielts' || f.kind === 'toeic' ? f.kind : 'cefr'; if (mn) S.goal = mn;
      if (LT_W && LT_W.self) L.self = LT_W.self;   // tự chọn "mới bắt đầu": không nhắc kiểm tra trình độ nữa
      LT_W = null; if (!ltCur()) ltStart(); S.t = Date.now(); save(); return ltView(); }
    if (a === 'place') return placeView(ltPlanView);
    if (a === 'chk') return ltCheck(); }
  if (e.target.closest('[data-ltex]')) { scrollTo(0, 0); return exOpen(); }
  if (e.target.closest('[data-ltedit]')) { scrollTo(0, 0); return ltGoalView(); }
  if (e.target.closest('[data-ltgo]')) { scrollTo(0, 0); ltView(); } });
