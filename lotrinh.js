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
for (const [n, c] of [['mapFix', 'fix'], ['mapRoot', 'fix'], ['mapRelearn', 'fix'], ['mapGapFix', 'fix'], ['errRun', 'fix'], ['ieltsView', 'ex'], ['toeicView', 'ex'], ['cbView', 'ex'],
  ['vwRun', ''], ['overview', ''], ['home', ''], ['partView', ''], ['kView', ''], ['learn', ''], ['mapView', ''], ['ltView', ''], ['dict', ''], ['minhView', '']]) {
  const f = window[n]; if (typeof f === 'function') window[n] = function (...a) { LT_FIX_ON = c === 'fix'; LT_EX_ON = c === 'ex'; return f.apply(this, a); }; }
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

// ---------- 🎯 màn mục tiêu (v108: 4 loại; đổi loại thì vẽ lại, giữ ngày và phút đang chọn) ----------
function ltGoalView(kind) { BACK = null; window.CUR = { view: 'lo-trinh-muc-tieu' }; $app.onclick = null; const L = ltSt(), g = L.goal || {}, st = ovStage(), si = OV_LV.indexOf(st);
  const v = id => (document.getElementById(id) || {}).value, k = kind || ltKind(L.goal ? g : { kind: S.ie && S.ie.set ? 'ielts' : S.exSel === 'toeic' ? 'toeic' : 'cefr' });
  const date = kind ? (v('ltdate') || '') : ltGoalDate(L.goal ? g : { kind: k }), mins = +v('ltmin') || actGoal();
  const lvs = OV_LV.filter((l, i) => i >= si), def = (L.goal && g.lv && OV_LV.indexOf(g.lv) >= si && g.lv) || OV_LV[Math.min(OV_LV.length - 1, si + 2)] || st, ie = S.ie || {}, to = S.to || {};
  const field = k === 'ielts' ? `<p style="margin:6px 0">Loại thi</p><select id="ltiet">${Object.entries(IE_TYPE).map(([x, n]) => `<option value="${x}"${x === (ie.type || 'ac') ? ' selected' : ''}>${n}</option>`).join('')}</select>
      <p style="margin:6px 0">Band mục tiêu</p><select id="ltband">${IE_BANDS.map(b => `<option value="${b}"${b === (ie.target || 6.5) ? ' selected' : ''}>${bandTxt(b)}</option>`).join('')}</select>`
    : k === 'toeic' ? `<p style="margin:6px 0">Điểm mục tiêu (Nghe + Đọc, 10–990)</p><select id="ltscore">${TO_TG.map(x => `<option value="${x}"${x === (to.target || 600) ? ' selected' : ''}>${x}</option>`).join('')}</select>`
    : `<p style="margin:6px 0">${k === 'cambridge' ? 'Cấp thi Cambridge' : 'Học tới cấp nào?'} <span class="mute">(đang học ${LVN[st]})</span></p>
      <select id="ltlv">${lvs.map(l => `<option value="${l}"${l === def ? ' selected' : ''}>${LVN[l]}${k === 'cambridge' && typeof MOCK !== 'undefined' && MOCK[l] ? ' · ' + esc(MOCK[l].name) : ''}</option>`).join('')}</select>`;
  $app.innerHTML = `<div id="lt"></div>${L.goal ? '<div class="row top"><button class="link" data-lt="home">← Lộ trình</button><span class="uname">🎯 Mục tiêu</span></div>' : ''}<h1>🎯 Mục tiêu học</h1>
    <div class="box"><p style="margin:0 0 6px">Bạn học để làm gì?</p><div class="chips">${Object.entries(LT_KIND).map(([x, n]) => `<button class="chip ${x === k ? 'on' : ''}" data-ltk="${x}">${n}</button>`).join('')}</div>
      <input type="hidden" id="ltkind" value="${k}">${field}
      <p style="margin:6px 0">${k === 'cefr' ? 'Ngày cần đạt' : 'Ngày thi'} <span class="mute">· không bắt buộc</span></p><input id="ltdate" type="date" value="${esc(date || '')}">
      <p style="margin:6px 0">Mỗi ngày học</p><select id="ltmin">${[10, 15, 30, 45].map(x => `<option value="${x}"${x === mins ? ' selected' : ''}>${x} phút</option>`).join('')}</select></div>
    <p id="lthint" style="margin:6px 0"></p>
    <button class="pri" data-lt="goal">💾 Lưu mục tiêu và bắt đầu</button>
    <p class="mute">🧱 Nền CEFR luôn là gốc; mục tiêu thi thêm phần riêng của kỳ thi đó (📚 Học chỉ hiện đúng kỳ thi bạn chọn). Cấp hoàn thành vẫn do 🚪 Thi chuyển cấp quyết.</p>`; ltHint(); }
// mục tiêu đang chọn trên màn (chưa lưu): { kind, lv = nền cần có, date }
function ltFormGoal() { const v = id => (document.getElementById(id) || {}).value, k = v('ltkind') || 'cefr', d = v('ltdate');
  const lv = k === 'ielts' ? ieBase(+v('ltband') || 6.5) : k === 'toeic' ? toBase(+v('ltscore') || 600) : v('ltlv');
  return { kind: k, lv, date: /^\d{4}-\d{2}-\d{2}$/.test(d || '') ? d : '' }; }
function ltHint() { const el = document.getElementById('lthint'), f = ltFormGoal(), mn = +(document.getElementById('ltmin') || {}).value || actGoal(); if (!el || !LVN[f.lv]) return;
  const m0 = S.goal; S.goal = mn; const sp = ltSplitFor(f.kind, f.lv); S.goal = m0;   // chia phút theo số phút đang chọn (chưa lưu)
  el.innerHTML = `${f.kind === 'ielts' || f.kind === 'toeic' ? `<span class="mute">Nền CEFR cần có: <b>${LVN[f.lv]}</b>.</span><br>` : ''}${ltFeasTxt({ kind: 'cefr', lv: f.lv, date: f.date }, mn)}<br>${ltSplitTxt(sp)}`; }
document.addEventListener('change', e => { if (S && e.target.closest && e.target.closest('#ltlv, #ltdate, #ltmin, #ltiet, #ltband, #ltscore')) ltHint(); });

// ---------- 🎯 ô mục tiêu ở 📚 Học: tên mục tiêu, việc hôm nay, ⚖️ chia thời gian, nút mở phần riêng của kỳ thi ----------
function ltGoalCard(stage = ovStage()) { const g = S.lt && S.lt.goal;
  if (!g) return `<div class="box"><b>🎯 Chưa đặt mục tiêu</b><p class="mute" style="margin:6px 0">Đặt mục tiêu ở 🔄 Lộ trình: app chia việc mỗi ngày và chỉ hiện nội dung đúng kỳ thi bạn chọn.</p><button class="pri" data-ltgo>🎯 Đặt mục tiêu ›</button></div>`;
  const sp = ltSplit(g), TP = typeof todayPlan === 'function' ? todayPlan(stage).filter(x => x.done != null) : [], ok = TP.filter(x => x.done).length, ic = { cambridge: '🎓', ielts: '🌏', toeic: '💼' }[sp.k];
  return `<div class="box"><div class="row"><b>🎯 ${esc(ltGoalName(g))}</b><button class="link" data-ltgo>🔄 Lộ trình ›</button></div>
    <p class="mute" style="margin:4px 0">📅 Việc hôm nay: ${ok}/${TP.length} xong · ⚖️ nền ${sp.nen}%${sp.k !== 'cefr' ? ` · đề ${sp.ex}%` : ''}</p>
    ${sp.k !== 'cefr' ? `<button data-ltex style="margin:6px 0 0">${ic} Phần riêng cho mục tiêu: luyện ${LT_EXN[sp.k]} ›${sp.ex ? '' : '<small style="display:block;opacity:.85">chưa nên luyện đề, học nền trước; vẫn xem được dạng đề</small>'}</button>` : ''}</div>`; }

// ---------- màn chính: mục tiêu · 📅 Hôm nay (danh sách việc duy nhất) · đợt · xếp cấp · tổng kết ----------
async function ltView() { BACK = null; window.CUR = { view: 'lo-trinh' }; $app.onclick = null;
  if (!(PA && Object.values(KIT).every(P => P.items))) { $app.innerHTML = '<div id="lt"></div><p class="mute">Đang tải…</p>'; try { await Promise.all([paLoad(), ...Object.values(KIT).map(kLoad)]); } catch (e) {} }
  const L = ltSt(); if (!L.goal) return ltGoalView();
  const now = Date.now(), t = dayOf(now), stage = ovStage(), g = L.goal, k = ltKind(g), need = ltGoalLv(g), date = ltGoalDate(g), re = ltRe(now), P = S.place, plFirst = !!re && re.k === 'first'; let c = ltCur();
  if (!c) { ltStart(now); c = ltCur(); }   // v107: có mục tiêu là có đợt
  const sp = ltSplit(g), left = date ? Math.ceil((Date.parse(date) - now) / DAY) : null, gDone = (k === 'cefr' || k === 'cambridge') && ovDone(need);
  const goalBox = `<div class="box"><div class="row"><b>🎯 ${esc(ltGoalName(g))}</b><button class="link" data-lt="edit">✏️ Đổi</button></div>
    <p style="margin:4px 0">Đang học <b>${LVN[stage]}</b>${k !== 'cefr' ? ` · nền cần <b>${LVN[need]}</b>` : ''}${left != null ? ` · ${left >= 0 ? `còn <b>${left}</b> ngày` : 'đã qua ngày đặt'}` : ''}</p>
    ${gDone ? `<p style="margin:4px 0">🎉 Đã hoàn thành ${LVN[need]} trong app. Làm 📝 đề mẫu chính thức ở màn 🎓 Cambridge để biết đạt thật chưa, rồi đặt mục tiêu mới.</p>` : `<p style="margin:4px 0">${ltFeasTxt(g)}</p>`}
    <p style="margin:4px 0">${ltSplitTxt(sp)}</p>${k !== 'cefr' ? `<button data-ltex style="margin:4px 0 0">${{ cambridge: '🎓', ielts: '🌏', toeic: '💼' }[k]} Phần riêng: luyện ${LT_EXN[k]} ›</button>` : ''}</div>`;
  const plBox = `<div class="box"><b>🧭 Xếp cấp</b>${P ? `<p style="margin:4px 0">Lần gần nhất ${ltFmt(dayOf(P.at))}: ${P.top ? `nắm khá vững <b>${LVN[P.top]}</b>` : 'nên bắt đầu từ Pre-A1'}${P.no ? ' · bạn chọn học từ cấp đang học' : ''}.</p>` : ''}
    ${re && re.k !== 'real' ? `<p class="mute" style="margin:4px 0">${esc(re.t)}.</p><button class="${plFirst ? 'pri' : ''}" data-lt="place">🧭 ${P ? 'Xếp cấp lại' : 'Kiểm tra xếp cấp'} (5–10 phút)</button>`
      : re ? `<p style="margin:4px 0">📝 ${esc(re.t)}.</p><button data-ltex>📝 Mở màn ${LT_EXN[k] || 'Cambridge'}</button>` : `<p class="mute" style="margin:4px 0">Xếp lại sau ${ltReIn(now)} ngày, hoặc sớm hơn khi hoàn thành một cấp / trượt thi vượt.</p>`}</div>`;
  const i = ltDay(c, now), days = [...Array(LT_D)].map((_, x) => c.d0 + x), f = typeof mapFocus === 'function' && ltHasData() ? mapFocus(now) : null, hist = L.d.filter(x => x.end).slice().reverse();
  $app.innerHTML = `<div id="lt"></div><h1>🔄 Lộ trình</h1>${goalBox}
    ${typeof todayBox === 'function' ? todayBox(stage, { lt: 1 }) : ''}
    <div class="box"><div class="row"><b>📆 Đợt ${c.n} · ngày ${Math.min(i, LT_D)}/${LT_D}</b><span class="mute">${ltFmt(c.d0)} → ${ltFmt(c.d0 + LT_D - 1)}</span></div>
      <div style="display:grid;grid-template-columns:repeat(${LT_D},1fr);gap:4px;margin:8px 0">${days.map(d => `<div title="${actMin(d)} phút" style="height:10px;border-radius:3px;background:${actMin(d) >= ACT_DAY_MIN ? 'var(--good)' : d === t ? 'var(--accent)' : 'var(--line)'}"></div>`).join('')}</div>
      <p class="mute" style="margin:0">🩹 chữa lỗi hôm nay ${ltFixMin(t)}/${ltCap()} phút${k !== 'cefr' ? ` · 🎯 luyện ${LT_EXN[k]} ${ltExMin(t)}/${sp.exM} phút` : ''}</p>
      ${i >= LT_D ? `<button class="pri" data-lt="chk" style="margin-top:8px">📝 Kiểm tra cuối đợt (~10 phút) → tổng kết</button>` : `<p class="mute" style="margin:8px 0 0">📝 Kiểm tra cuối đợt mở vào ngày ${LT_D} (còn ${LT_D - i} ngày).</p>`}</div>
    ${plBox}
    ${f ? `<button data-mapv="lt">🗺 Bản đồ chỗ yếu: đang chữa ${f.act.length}${f.queue.length ? ` · ${f.queue.length} chờ` : ''} · ✅ ${f.done} ›</button>` : ''}
    ${hist.length ? `<details class="box"><summary>📊 Các đợt trước (${hist.length})</summary>${hist.map(x => `<div style="margin:8px 0"><b>Đợt ${x.n}</b> <span class="mute">${ltFmt(x.d0)} → ${ltFmt(x.end)}</span>${ltSumHtml(x, L.d[L.d.indexOf(x) - 1])}</div>`).join('<hr style="border:0;border-top:1px solid var(--line)">')}</details>` : ''}
    <p class="mute">Bài làm ở đây tính 📘 Học / 🔁 Nhớ / Thi như ở 📚 Học (luyện đề không tính vào luật đo CEFR). Luật: 👤 Của tôi → 📘 Luật và cách dùng → 🔄 Lộ trình.</p>`; }

document.addEventListener('click', e => { if (!S) return; let b = e.target.closest('[data-ltk]'); if (b) { scrollTo(0, 0); return ltGoalView(b.dataset.ltk); }
  b = e.target.closest('[data-lt]'); if (b) { const a = b.dataset.lt, L = ltSt(); scrollTo(0, 0);
    if (a === 'home') return ltView();
    if (a === 'edit') return ltGoalView();
    if (a === 'goal') { const f = ltFormGoal(), v = id => (document.getElementById(id) || {}).value, mn = +v('ltmin');
      if (!LVN[f.lv]) return toast('Chọn mục tiêu.');
      if (f.kind === 'ielts') { const o = ieSt(); o.type = v('ltiet') || o.type; o.target = +v('ltband') || o.target; o.set = 1; o.date = f.date || null; }
      if (f.kind === 'toeic') { const o = toSt(); o.target = +v('ltscore') || o.target; o.date = f.date || null; }
      L.goal = { kind: f.kind, lv: f.lv, date: f.date, at: Date.now() }; S.exSel = f.kind === 'ielts' || f.kind === 'toeic' ? f.kind : 'cefr'; if (mn) S.goal = mn;
      if (!ltCur()) ltStart(); S.t = Date.now(); save(); return ltView(); }
    if (a === 'place') return placeView(ltView);
    if (a === 'chk') return ltCheck(); }
  if (e.target.closest('[data-ltex]')) { scrollTo(0, 0); return exOpen(); }
  if (e.target.closest('[data-ltedit]')) { scrollTo(0, 0); return ltGoalView(); }
  if (e.target.closest('[data-ltgo]')) { scrollTo(0, 0); ltView(); } });
