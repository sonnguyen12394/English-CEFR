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
for (const [n, c] of [['mapFix', 'fix'], ['mapRoot', 'fix'], ['mapRelearn', 'fix'], ['mapGapFix', 'fix'], ['errRun', 'fix'], ['ieltsView', 'ex:ielts'], ['toeicView', 'ex:toeic'], ['cbView', 'ex:cambridge'],
  ['vwRun', ''], ['overview', ''], ['home', ''], ['partView', ''], ['kView', ''], ['learn', ''], ['mapView', ''], ['ltView', ''], ['ltPlanView', ''], ['dict', ''], ['minhView', '']]) {
  const f = window[n]; if (typeof f === 'function') window[n] = function (...a) { LT_FIX_ON = c === 'fix'; LT_EX_ON = c.startsWith('ex:') && !!(S && S.lt && S.lt.goal) && ltKind() === c.slice(3); return f.apply(this, a); }; }   // v109: chỉ kỳ thi của mục tiêu
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
function ltHave(stage = ovStage()) { const i = OV_LV.indexOf(stage), pl = typeof plTop === 'function' ? plTop(stage) : null; let h = ovDone(stage) ? LV_SC[stage] : i > 0 ? LV_SC[OV_LV[i - 1]] : -1; if (pl) h = Math.max(h, LV_SC[pl]); return h; }
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
const ltFrom = (stage = ovStage()) => { const pl = typeof plTop === 'function' ? plTop(stage) : null, i = OV_LV.indexOf(stage); return pl ? LT_GLH[pl] : i > 0 ? LT_GLH[OV_LV[i - 1]] : 0; };
const ltEff = (stage = ovStage()) => { const pl = typeof plTop === 'function' ? plTop(stage) : null; return pl ? OV_LV.indexOf(pl) + 1 : OV_LV.indexOf(stage); };   // chỉ số cấp thật sự đang ở
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
    return `<p style="margin:4px 0">${P.wk != null ? `Còn <b>${P.wk} tuần</b> · ` : ''}${P.g != null ? `band ước (Overall) cách mục tiêu <b>${bandTxt(Math.max(0, P.g))}</b>` : 'chưa có band ước: làm 1 đề thử IELTS ở 📚 Học → 🎓 Thi'}</p>
      ${sp.ex ? `<p class="mute" style="margin:2px 0">Mỗi tuần ~${String(Object.values(P.hrs).reduce((a, b) => a + b, 0)).replace('.', ',')} giờ luyện đề: ${Object.entries(P.hrs).map(([x, h]) => `${IE_SK[x][0]} ${String(h).replace('.', ',')} giờ`).join(' · ')} (Viết / Nói nặng hơn). Mỗi 2 tuần 1 đề thử app, mỗi 4 tuần 1 đề thật.</p>` : ''}
      ${warn ? `<p style="margin:2px 0">⚠️ Còn ${P.wk} tuần, cần tăng ${bandTxt(P.g)} band: kinh nghiệm thường gặp (không phải số chính thức) là ${P.need[0]}–${P.need[1]} tuần. Cân nhắc lùi ngày thi hoặc hạ mục tiêu.</p>` : ''}`; }
  if (k === 'toeic') { const o = toSt(), now = toNow(), wk = o.date ? Math.max(0, Math.ceil((new Date(o.date + 'T12:00:00') - Date.now()) / (7 * DAY))) : null;
    return `<p style="margin:4px 0">${wk != null ? `Còn <b>${wk} tuần</b> · ` : ''}${now.tot != null ? `điểm ước cách mục tiêu <b>${Math.max(0, o.target - now.tot)}</b>` : 'chưa có điểm ước: làm 1 đề thử TOEIC ở 📚 Học → 🎓 Thi'}</p>`; }
} catch (e) {} return ''; }

// ---------- 🎯 ô mục tiêu ở 📚 Học: tên mục tiêu, việc hôm nay, ⚖️ chia thời gian, nút mở phần riêng của kỳ thi ----------
function ltGoalCard(stage = ovStage()) { const g = S.lt && S.lt.goal;
  if (!g) return `<div class="box"><b>🎯 Chưa đặt mục tiêu</b><p class="mute" style="margin:6px 0">Đặt mục tiêu ở 🔄 Lộ trình: app chia việc mỗi ngày theo mục tiêu. Mục 🎓 Thi ở hàng trên vẫn mở được mọi kỳ thi.</p><button class="pri" data-ltgo>🎯 Đặt mục tiêu ›</button></div>`;
  const sp = ltSplit(g), TP = typeof todayPlan === 'function' ? todayPlan(stage).filter(x => x.done != null) : [], ok = TP.filter(x => x.done).length, ic = { cambridge: '🎓', ielts: '🌏', toeic: '💼' }[sp.k];
  return `<div class="box"><div class="row"><b>🎯 ${esc(ltGoalName(g))}</b><button class="link" data-ltgo>🔄 Lộ trình ›</button></div>
    <p class="mute" style="margin:4px 0">📅 Việc hôm nay: ${ok}/${TP.length} xong · ⚖️ nền ${sp.nen}%${sp.k !== 'cefr' ? ` · đề ${sp.ex}%` : ''}</p>
    ${sp.k !== 'cefr' ? `<button data-ltex style="margin:6px 0 0">${ic} Phần riêng cho mục tiêu: luyện ${LT_EXN[sp.k]} ›${sp.ex ? '' : '<small style="display:block;opacity:.85">chưa nên luyện đề, học nền trước; vẫn xem được dạng đề</small>'}</button>` : ''}</div>`; }

// ---------- 🧭 màn chính = HÔM NAY (v112, giao diện trực quan): lời chào + 🔥 · vòng phút hôm nay · MỘT nút ▶ Học tiếp · danh sách việc ✓ / ▶ · ô 🎯 mục tiêu ----------
// Mọi con số kế hoạch (ước thời gian, ⚖️ chia nền / đề, đợt 10 ngày, xếp cấp, tuần còn lại…) dồn vào màn "Đường tới mục tiêu" (ltPlanView), mở khi bấm ô 🎯.
const ltRing = (m, g) => { const r = 38, C = 2 * Math.PI * r, f = Math.max(0, Math.min(1, g ? m / g : 0));
  return `<svg width="92" height="92" viewBox="0 0 92 92" role="img" aria-label="${m} trên ${g} phút"><circle cx="46" cy="46" r="${r}" fill="none" style="stroke:var(--line)" stroke-width="10"/><circle cx="46" cy="46" r="${r}" fill="none" style="stroke:var(--good)" stroke-width="10" stroke-linecap="round" stroke-dasharray="${C.toFixed(1)}" stroke-dashoffset="${(C * (1 - f)).toFixed(1)}" transform="rotate(-90 46 46)"/><text x="46" y="45" text-anchor="middle" font-size="22" font-weight="800" style="fill:var(--fg)">${m}</text><text x="46" y="62" text-anchor="middle" font-size="12" style="fill:var(--mute)">/ ${g} phút</text></svg>`; };
const ltHello = () => { const h = new Date().getHours(); return h < 11 ? 'Chào buổi sáng' : h < 14 ? 'Chào buổi trưa' : h < 18 ? 'Chào buổi chiều' : 'Chào buổi tối'; };
// ô 🎯: tên mục tiêu, còn bao lâu, thanh từ trình độ đang có tới trình độ cần
function ltGoalBox(g, stage) { const k = ltKind(g), need = ltGoalLv(g), date = ltGoalDate(g), left = date ? Math.ceil((Date.parse(date) - Date.now()) / DAY) : null;
  const have = ltHave(stage), f = Math.max(0.04, Math.min(1, (have + 1) / (LV_SC[need] + 1))), wk = left != null && left >= 0 ? (left >= 14 ? `còn ${Math.ceil(left / 7)} tuần` : `còn ${left} ngày`) : '';
  return `<button class="goalcard" data-ltplan><span style="font-size:30px">🎯</span><span style="flex:1;min-width:0"><b>${esc(ltGoalName(g))}</b>${wk ? ` <span class="mute">· ${wk}</span>` : ''}
    <span style="display:block;margin:8px 0 4px">${bar(Math.round(f * 100), 100, ovDone(need) ? 'var(--good)' : 'var(--accent)')}</span><span class="mute" style="font-size:14px">Đang học ${LVN[stage]} → ${k === 'cefr' ? 'mục tiêu' : 'cần'} ${LVN[need]}</span></span><span class="chev">›</span></button>`; }
async function ltView() { BACK = null; window.CUR = { view: 'lo-trinh' }; $app.onclick = null;
  if (!(PA && Object.values(KIT).every(P => P.items))) { $app.innerHTML = '<div id="lt"></div><p class="mute">Đang tải…</p>'; try { await Promise.all([paLoad(), ...Object.values(KIT).map(kLoad)]); } catch (e) {} }
  const L = ltSt(); if (!L.goal) return ltGoalView();
  if (ltKind(L.goal) === 'ielts' && typeof ieLoad === 'function') try { await ieLoad(); } catch (e) {} if (ltKind(L.goal) === 'toeic' && typeof toLoad === 'function') try { await toLoad(); } catch (e) {}
  const now = Date.now(), t = dayOf(now), stage = ovStage(), g = L.goal; if (!ltCur()) ltStart(now);   // v107: có mục tiêu là có đợt
  const m = actMin(t), gm = actGoal(), stk = actStreak(now), items = todayItems(stage, { lt: 1 }), main = items.filter(x => x.done != null), nx = main.find(x => !x.done), ok = main.filter(x => x.done).length;
  $app.innerHTML = `<div id="lt"></div>
    <div class="hello"><span class="mute">${ltHello()} 👋</span>${stk ? `<span class="pill">🔥 ${stk} ngày</span>` : ''}</div>
    <h1 style="font-size:28px">Hôm nay</h1>
    <div class="ringrow">${ltRing(m, gm)}<div><b style="font-size:18px">${m >= gm ? 'Đạt mục tiêu hôm nay 🎉' : `Còn ${gm - m} phút`}</b><p class="mute" style="margin:0">${m >= gm ? 'Học thêm nếu muốn' : 'để xong việc hôm nay'}</p></div></div>
    ${nx ? `<button class="btnbig" data-ltnext>▶ Học tiếp<small>${esc(nx.title)} · ${esc(nx.meta)}</small></button>`
      : `<button class="btnbig" data-ltmore style="background:var(--good)">🎉 Xong việc hôm nay<small>Muốn học thêm: mở 📚 Học</small></button>`}
    <h2>Việc hôm nay <span class="mute" style="font-size:15px;font-weight:400">${ok}/${main.length}</span></h2>
    ${todayBox(stage, { lt: 1, items })}
    ${ltGoalBox(g, stage)}`; }

// ---------- 🛣 Đường tới mục tiêu: đường cấp, ước tính, ⚖️ chia thời gian, 10 ngày này, kiểm tra trình độ, đổi mục tiêu, chỗ hay sai, các đợt trước ----------
async function ltPlanView() { BACK = null; window.CUR = { view: 'lo-trinh-duong' }; $app.onclick = null;
  const L = ltSt(); if (!L.goal) return ltGoalView();
  const now = Date.now(), t = dayOf(now), stage = ovStage(), g = L.goal, k = ltKind(g), need = ltGoalLv(g), sp = ltSplit(g), fe = ltFeas(g), c = ltCur() || (ltStart(now), ltCur()), re = ltRe(now), P = S.place;
  // đường cấp: từ cấp đã xong gần nhất tới cấp cần
  const si = OV_LV.indexOf(stage), ni = Math.max(OV_LV.indexOf(need), si), from = Math.max(0, si - 1), steps = OV_LV.slice(from, ni + 1);
  const pct = l => { const r = ovReq(l); return r.length ? Math.round(r.filter(([id]) => ovPassed(id, l)).length / r.length * 100) : 0; };
  const path = steps.map(l => { const st = ovDone(l) ? 'ok' : l === stage ? 'cur' : l === need ? 'goal' : '';
    return `<div class="lvstep ${st}${l === need && st !== 'ok' ? ' goal' : ''}"><div class="d">${st === 'ok' ? '✓' : l === need ? '🎯' : st === 'cur' ? '●' : ''}</div><b>${LVN[l]}</b><span>${st === 'ok' ? 'đã xong' : st === 'cur' ? `đang học · ${pct(l)}%` : l === need ? (k === 'cefr' ? 'mục tiêu' : `đủ trình độ cho ${esc(ltGoalName(g))}`) : ''}</span></div>`; }).join('');
  const i = ltDay(c, now), days = [...Array(LT_D)].map((_, x) => c.d0 + x), f = typeof mapFocus === 'function' && ltHasData() ? mapFocus(now) : null, hist = L.d.filter(x => x.end).slice().reverse();
  const why = k === 'cefr' ? 'Toàn bộ thời gian cho nền tiếng Anh.' : sp.gap >= 2 ? 'Trình độ còn xa mức cần: học nền trước, chưa cần luyện đề.' : sp.gap >= 1 ? 'Còn thiếu khoảng 1 cấp: chủ yếu học nền, luyện đề một ít.' : sp.gap > 0 ? 'Gần đủ trình độ: chuyển dần sang luyện đề.' : 'Đủ trình độ: dồn sức luyện đề, giữ ôn nền.';
  $app.innerHTML = `<div id="lt"></div><div class="row top"><button class="link" data-lt="home">‹ Hôm nay</button><span></span></div>
    <h1>Đường tới ${esc(ltGoalName(g))}</h1>
    <p class="mute" style="margin:0 0 6px">${fe.h ? `Ước tính ${ltEstTxt(fe)} nếu học ${actGoal()} phút mỗi ngày` : 'Bạn đã đủ trình độ cần cho mục tiêu này'}${fe.late ? ` · <b style="color:var(--warn)">⚠️ khó kịp ngày thi (còn ${fe.left} ngày)</b>` : ''}</p>
    <div class="lvpath">${path}</div>
    <h2>Mỗi ngày ${actGoal()} phút chia thế nào</h2>
    <div class="split">${sp.nen ? `<div style="width:${sp.nen}%;background:var(--accent)">Nền ${sp.nenM} phút</div>` : ''}${sp.ex ? `<div style="width:${sp.ex}%;background:var(--warn)">${LT_EXN[k]} ${sp.exM}’</div>` : ''}</div>
    <p class="mute" style="margin:6px 0 0">${why}</p>
    ${k === 'ielts' || k === 'toeic' ? ltExamPlan(k, sp) : ''}
    <h2>10 ngày này</h2>
    <div class="days10">${days.map(d => `<i class="${actMin(d) >= ACT_DAY_MIN ? 'ok' : d === t ? 'now' : ''}" title="${actMin(d)} phút"></i>`).join('')}</div>
    <p class="mute" style="margin:0">Ngày ${Math.min(i, LT_D)} / ${LT_D} · ngày ${LT_D} làm bài kiểm tra ngắn</p>
    ${i >= LT_D ? `<button class="btnbig" data-lt="chk">📝 Làm bài kiểm tra 10 ngày</button>` : ''}
    <div class="grid2" style="margin-top:16px"><button class="btnbig ghost" data-lt="place" style="font-size:16px;margin:0">🧭 Đo trình độ</button><button class="btnbig ghost" data-lt="edit" style="font-size:16px;margin:0">✏️ Đổi mục tiêu</button></div>
    ${re && re.k === 'first' ? `<p class="mute" style="margin:6px 0 0">🧭 Chưa đo trình độ: 5 phút để app bắt đầu đúng chỗ.</p>` : re && re.k !== 'real' ? `<p class="mute" style="margin:6px 0 0">🧭 Nên đo lại: ${esc(re.t).toLowerCase()}.</p>` : re ? `<p style="margin:6px 0 0">📝 ${esc(re.t)}. <button class="link" data-ltex>Mở ›</button></p>` : P ? `<p class="mute" style="margin:6px 0 0">Lần kiểm tra gần nhất ${ltFmt(dayOf(P.at))}: ${P.top ? `nắm khá vững ${LVN[P.top]}` : 'nên bắt đầu từ đầu'}.</p>` : ''}
    ${f ? `<button class="btnbig ghost" data-mapv="lt" style="font-size:16px">🗺 Các chỗ hay sai${f.act.length ? ` · ${f.act.length}` : ''}</button>` : ''}
    ${hist.length ? `<details class="box"><summary>📊 Các đợt 10 ngày trước (${hist.length})</summary>${hist.map(x => `<div style="margin:8px 0"><b>Đợt ${x.n}</b> <span class="mute">${ltFmt(x.d0)} → ${ltFmt(x.end)}</span>${ltSumHtml(x, L.d[L.d.indexOf(x) - 1])}</div>`).join('<hr style="border:0;border-top:1px solid var(--line)">')}</details>` : ''}
    <p class="mute" style="font-size:13px">Ước tính theo số giờ học Cambridge công bố; chỉ để tham khảo. Luật chi tiết: 👤 Tôi → 📘 Luật và cách dùng.</p>`; }

// ---------- ▶ Học tiếp: làm việc kế tiếp; khi đang học dở ở màn khác thì có dải nhắc "🧭 Hôm nay: còn N việc" để quay về ----------
let LT_SESS = false;
function ltNextGo() { LT_SESS = true; const b = document.querySelector('#today .task.next'); if (b) { b.click(); return; } toast('🎉 Xong hết việc hôm nay'); }
const LT_BANNER_ON = () => document.getElementById('grid') || document.getElementById('part') || document.getElementById('ov') || ['ielts', 'toeic', 'cambridge'].includes((window.CUR || {}).view);
function ltBanner() { if (!S || !LT_SESS || document.getElementById('lt') || document.getElementById('ltbanner') || !LT_BANNER_ON() || !(S.lt && S.lt.goal)) return;
  let n = 0; try { n = todayItems(ovStage()).filter(x => x.done === false).length; } catch (e) { return; }
  $app.insertAdjacentHTML('afterbegin', `<div id="ltbanner" class="ltbanner"><button class="link" data-ltgo>🧭 ${n ? `Hôm nay còn ${n} việc · ▶ Tiếp` : '🎉 Xong việc hôm nay · về Lộ trình'}</button><button class="link" data-ltx aria-label="Ẩn">✕</button></div>`); }
new MutationObserver(() => { try { ltBanner(); } catch (e) {} }).observe($app, { childList: true });

document.addEventListener('click', e => { if (!S) return; let b;
  if ((b = e.target.closest('[data-ltk]'))) { if (!LT_W) LT_W = ltWInit(); LT_W.kind = b.dataset.ltk; ltWFix(LT_W); return ltWizard(); }
  if ((b = e.target.closest('[data-ltwv]'))) { if (!LT_W) LT_W = ltWInit(); const [key, val] = b.dataset.ltwv.split('|'); LT_W[key] = ['band', 'score', 'mins'].includes(key) ? +val : val; return ltWizard(); }
  if ((b = e.target.closest('[data-ltw]'))) { if (!LT_W) LT_W = ltWInit(); LT_W.step = +b.dataset.ltw; if (b.dataset.ltself) LT_W.self = b.dataset.ltself; return ltWizard(); }
  if (e.target.closest('[data-ltwp]')) { if (!LT_W) LT_W = ltWInit(); return placeView(() => { LT_W.step = 3; ltWizard(); }, 'Tiếp ›'); }
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
