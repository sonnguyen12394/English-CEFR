// 🔄 Lộ trình (v105, 1/11/2026, người sáng lập bàn "kiểm tra đầu vào + phương pháp học sửa lỗi" rồi "ok làm vậy đi, làm thêm chức năng ở mục mới kế bên học CEFR").
// Chu trình: 🎯 mục tiêu → 🧭 xếp cấp → các 📆 đợt 10 ngày (mỗi ngày: ôn đến hạn + chữa chỗ yếu ≤ 40% số phút + bài mới) → 📝 kiểm tra nhẹ cuối đợt
// (10 câu kiểu xếp cấp ở cấp đang học + cấp kế, rồi 🔎 quét lại từ của bản đồ) → 📊 tổng kết đợt → đợt sau. 🧭 Xếp cấp lại chỉ khi: ≥ 60 ngày, vừa hoàn thành
// một cấp, trượt thi vượt, hoặc chưa xếp lần nào; còn ≤ 30 ngày tới ngày thi thì làm 📝 đề mẫu chính thức thay xếp cấp.
// Vì sao không xếp cấp lại mỗi 10 ngày: ~200 giờ học / cấp (ước của Cambridge) nên 10 ngày × 15–30 phút tiến bộ nhỏ hơn sai số của bài 15–30 câu.
// KHÔNG đổi luật đo: xếp cấp và kiểm tra nhẹ chỉ để chọn chỗ học; cấp hoàn thành vẫn do 🚪 Thi chuyển cấp / 🚀 thi vượt quyết. Mọi việc học vẫn ghi như thường.
const LT_D = 10, LT_FIX = 0.4, LT_RE_D = 60, LT_EXAM_D = 30, LT_FIX_OK = 0.5, LT_DAYS_OK = 3, LT_MINI = 5;
const ltSt = () => (S.lt = S.lt || { d: [], fx: {} });
const ltCur = () => { const L = ltSt(), c = L.d[L.d.length - 1]; return c && !c.end ? c : null; };
const ltDay = (c, now = Date.now()) => dayOf(now) - c.d0 + 1;
const ltFixMin = d => Math.round(((ltSt().fx || {})[d] || 0) / 60000);
const ltCap = () => Math.max(1, Math.round(actGoal() * LT_FIX));
const ltPassed = () => OV_LV.flatMap(l => OV.filter(([id]) => ovIn(id, l) && ovPassed(id, l)).map(([id]) => id + '|' + l));
const ltBase = l => PL_LV.includes(l) ? l : PL_LV.includes(l.replace(/p$/, '')) ? l.replace(/p$/, '') : PL_LV[PL_LV.length - 1];
const ltFmt = d => { const x = new Date(d * DAY + 12 * 3600000); return `${x.getUTCDate()}/${x.getUTCMonth() + 1}`; };
const ltHasData = () => Object.keys(S.cards || {}).length || Object.values(S.k || {}).some(k => Object.keys(k.cards || {}).length);

// ---------- ⏱ phút chữa lỗi: khi đang ở buổi chữa (bản đồ, sổ lỗi) thì phút của actTick cộng thêm vào S.lt.fx[ngày] ----------
let LT_FIX_ON = false;
{ const t0 = actTick; actTick = function (now = Date.now()) { if (!S) return; const d = dayOf(now), A = actSt(), b = (A[d] || {}).ms || 0; t0(now);
    if (LT_FIX_ON && S.lt) { const fx = S.lt.fx = S.lt.fx || {}; fx[d] = (fx[d] || 0) + (((A[d] || {}).ms || 0) - b); for (const k of Object.keys(fx)) if (+k < d - 60) delete fx[k]; } }; }
for (const [n, on] of [['mapFix', 1], ['mapRoot', 1], ['mapRelearn', 1], ['errRun', 1], ['vwRun', 0], ['overview', 0], ['home', 0], ['partView', 0], ['kView', 0], ['learn', 0], ['mapView', 0]]) {
  const f = window[n]; if (typeof f === 'function') window[n] = function (...a) { LT_FIX_ON = !!on; return f.apply(this, a); }; }

// ---------- 🧭 khi nào xếp cấp lại ----------
function ltRe(now = Date.now()) { const P = S.place, g = ltSt().goal;
  if (g && g.date) { const left = Math.ceil((Date.parse(g.date) - now) / DAY); if (left >= 0 && left <= LT_EXAM_D) return { k: 'real', t: `Còn ${left} ngày tới ngày thi: làm 📝 đề mẫu chính thức (🎓 Luyện thi → Cambridge) thay xếp cấp` }; }
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
  const b = ltBase(ovStage()), lvs = [b, PL_LV[PL_LV.indexOf(b) + 1]].filter(Boolean), qs = lvs.flatMap(l => plQs(l).slice(0, LT_MINI).map(x => ({ ...x, lv: l }))), R = {}; let i = 0;
  for (const l of lvs) R[l] = [0, 0];
  const show = () => { if (i >= qs.length) return done(R); const it = qs[i], q = it.q;
    $app.innerHTML = `<div class="row top"><button class="link" data-a="back">← Thôi</button><span class="uname">📝 Kiểm tra cuối đợt · ${i + 1}/${qs.length}</span></div>
      <p class="mute">Không đoán bừa: không biết thì chọn "Chưa biết".</p>${it.w ? `<p class="q">${q.top}</p><p class="mute">${q.sub}</p>` : `${q.head || ''}<p class="q">${q.q}</p>`}
      ${q.opts.map((o, k) => `<button class="opt" data-po="${k}">${esc(o)}</button>`).join('')}<button class="opt" data-po="-1" style="opacity:.75">🤷 Chưa biết</button>`;
    $app.onclick = e => { if (e.target.closest('[data-a="back"]')) return ltView(); const bt = e.target.closest('[data-po]'); if (!bt) return; const k = +bt.dataset.po;
      R[it.lv][1]++; if (k >= 0 && q.opts[k] === q.a) R[it.lv][0]++; i++; show(); }; };
  show(); }
function ltCheck() { const c = ltCur(); if (!c) return ltView();
  ltMini(R => { c.chk = { R }; S.t = Date.now(); save();
    const fin = sc => { if (sc) c.chk.scan = sc; ltClose(c); scrollTo(0, 0); ltSumView(c); };
    if (typeof mapScan === 'function' && ltHasData()) return mapScan(Date.now(), fin); fin(null); }); }

// ---------- 📊 tổng kết đợt ----------
function ltSumHtml(c, prev) { const s = c.sum, R = (c.chk || {}).R || {}, P = prev && prev.chk && prev.chk.R || {}, sc = (c.chk || {}).scan;
  const pct = r => r && r[1] ? Math.round(r[0] / r[1] * 100) : null;
  return `<p style="margin:6px 0">📅 Học <b>${s.on}/${s.n}</b> ngày (≥ ${ACT_DAY_MIN} phút) · ⏱ ${s.min} phút · 🩹 chữa lỗi ${s.fx} phút${s.min ? ` (${Math.round(s.fx / s.min * 100)}%)` : ''} · 🆕 ${s.nw} mục mới</p>
    <p style="margin:4px 0">🗺 Chỗ yếu đã chọn đầu đợt: chữa xong <b>${s.selOk}/${s.sel}</b>${s.fixed > s.selOk ? ` · cả đợt chữa xong ${s.fixed} chỗ` : ''}</p>
    ${s.pass.length ? `<p style="margin:4px 0">🚪 Qua thi mới: ${s.pass.map(x => { const [id, l] = x.split('|'), o = OV.find(z => z[0] === id); return `${o ? o[1] + ' ' + o[2] : id} ${LVN[l]}`; }).join(', ')}</p>` : ''}
    ${Object.keys(R).length ? `<p style="margin:4px 0">📝 Kiểm tra nhẹ: ${Object.entries(R).map(([l, r]) => `${LVN[l]} ${r[0]}/${r[1]}${pct(P[l]) != null && pct(r) != null ? ` (đợt trước ${pct(P[l])}%)` : ''}`).join(' · ')}</p>` : ''}
    ${sc ? `<p style="margin:4px 0">🔎 Quét lại: từ đang nhớ đúng ${sc.heldOk}/${sc.held}${sc.unl ? ` · từ chưa học đã biết ${sc.known}/${sc.unl}` : ''}</p>` : ''}
    <p style="margin:6px 0 0">${s.okFix == null ? '⬜ Đầu đợt chưa có chỗ yếu để đo' : `${s.okFix ? '✅' : '⚠️'} Chữa xong ≥ ${Math.round(LT_FIX_OK * 100)}% chỗ đã chọn`} · ${s.okDays ? '✅' : '⚠️'} Học ≥ ${LT_DAYS_OK} ngày trong đợt</p>
    <p class="mute" style="margin:4px 0 0">Kiểm tra nhẹ chỉ ${LT_MINI} câu mỗi cấp: lên xuống 20% giữa 2 đợt là bình thường, xem xu hướng qua nhiều đợt.</p>`; }
function ltSumView(c) { $app.onclick = null; const L = ltSt(), prev = L.d[L.d.indexOf(c) - 1], re = ltRe();
  $app.innerHTML = `<div id="lt"></div><h1>📊 Tổng kết đợt ${c.n}</h1><div class="box">${ltSumHtml(c, prev)}</div>
    ${re && re.k !== 'real' ? `<div class="box"><b>🧭 Nên xếp cấp lại</b><p class="mute" style="margin:6px 0">${esc(re.t)}.</p><button data-lt="place">🧭 Xếp cấp lại</button></div>` : ''}
    <button class="pri" data-lt="home">▶ Bắt đầu đợt ${c.n + 1}</button>`; }

// ---------- 🎯 mục tiêu ----------
function ltGoalView() { BACK = null; window.CUR = { view: 'lo-trinh-muc-tieu' }; $app.onclick = null; const L = ltSt(), g = L.goal || {}, st = ovStage(), si = OV_LV.indexOf(st);
  const lvs = OV_LV.filter((l, i) => i >= si), def = g.lv || OV_LV[Math.min(OV_LV.length - 1, si + 2)] || st;
  $app.innerHTML = `<div id="lt"></div>${L.goal ? '<div class="row top"><button class="link" data-lt="home">← Lộ trình</button><span class="uname">🎯 Mục tiêu</span></div>' : ''}<h1>🎯 Mục tiêu học</h1>
    <div class="box"><p style="margin:0 0 6px">Học tới cấp nào? <span class="mute">(đang học ${LVN[st]})</span></p>
      <select id="ltlv">${lvs.map(l => `<option value="${l}"${l === def ? ' selected' : ''}>${LVN[l]}</option>`).join('')}</select>
      <p style="margin:6px 0">Ngày cần đạt (ngày thi, nếu có) <span class="mute">· không bắt buộc</span></p><input id="ltdate" type="date" value="${esc(g.date || '')}">
      <p style="margin:6px 0">Mỗi ngày học</p><select id="ltmin">${[10, 15, 30, 45].map(x => `<option value="${x}"${x === actGoal() ? ' selected' : ''}>${x} phút</option>`).join('')}</select></div>
    <button class="pri" data-lt="goal">💾 Lưu mục tiêu</button>
    <p class="mute">Mục tiêu chỉ để app chia việc và báo còn bao lâu. Cấp hoàn thành vẫn do 🚪 Thi chuyển cấp quyết.</p>`; }

// ---------- màn chính ----------
async function ltView() { BACK = null; window.CUR = { view: 'lo-trinh' }; $app.onclick = null;
  if (!(PA && Object.values(KIT).every(P => P.items))) { $app.innerHTML = '<div id="lt"></div><p class="mute">Đang tải…</p>'; try { await Promise.all([paLoad(), ...Object.values(KIT).map(kLoad)]); } catch (e) {} }
  const L = ltSt(); if (!L.goal) return ltGoalView();
  const now = Date.now(), t = dayOf(now), stage = ovStage(), g = L.goal, c = ltCur(), re = ltRe(now), P = S.place;
  const gi = OV_LV.indexOf(g.lv), si = OV_LV.indexOf(stage), gDone = ovDone(g.lv), left = g.date ? Math.ceil((Date.parse(g.date) - now) / DAY) : null;
  const goalBox = `<div class="box"><div class="row"><b>🎯 Mục tiêu: ${LVN[g.lv]}</b><button class="link" data-lt="edit">✏️ Đổi</button></div>
    <p style="margin:4px 0">${gDone ? `🎉 Đã hoàn thành ${LVN[g.lv]} trong app. Làm 📝 đề mẫu chính thức ở 🎓 Luyện thi để biết đạt thật chưa, rồi đặt mục tiêu mới.` : `Đang học <b>${LVN[stage]}</b> · còn ${Math.max(1, gi - si + 1)} cấp${left != null ? ` · ${left >= 0 ? `còn <b>${left}</b> ngày (≈ ${Math.ceil(left / LT_D)} đợt)` : 'đã qua ngày đặt'}` : ''}`}</p>
    <p class="mute" style="margin:0">⏱ ${actGoal()} phút / ngày</p></div>`;
  const plBox = `<div class="box"><b>🧭 Xếp cấp</b>${P ? `<p style="margin:4px 0">Lần gần nhất ${ltFmt(dayOf(P.at))}: ${P.top ? `nắm khá vững <b>${LVN[P.top]}</b>` : 'nên bắt đầu từ Pre-A1'}${P.no ? ' · bạn chọn học từ cấp đang học' : ''}.</p>` : ''}
    ${re && re.k !== 'real' ? `<p class="mute" style="margin:4px 0">${esc(re.t)}.</p><button class="${c ? '' : 'pri'}" data-lt="place">🧭 ${P ? 'Xếp cấp lại' : 'Kiểm tra xếp cấp'} (5–10 phút)</button>`
      : re ? `<p style="margin:4px 0">📝 ${esc(re.t)}.</p><button data-cbl-go>🎓 Mở Cambridge</button>` : `<p class="mute" style="margin:4px 0">Xếp lại sau ${ltReIn(now)} ngày, hoặc sớm hơn khi hoàn thành một cấp / trượt thi vượt.</p>`}</div>`;
  if (!c) { $app.innerHTML = `<div id="lt"></div><h1>🔄 Lộ trình</h1>${goalBox}${plBox}
      <div class="box"><b>📆 Học theo đợt ${LT_D} ngày</b><p class="mute" style="margin:6px 0">Mỗi ngày: ôn mục đến hạn → chữa chỗ yếu (tối đa ${Math.round(LT_FIX * 100)}% số phút) → bài mới. Ngày ${LT_D}: kiểm tra nhẹ ~10 phút và tổng kết đợt.</p>
        <button class="${re && re.k === 'first' ? '' : 'pri'}" data-lt="start">▶ Bắt đầu đợt 1${re && re.k === 'first' ? ' (bỏ qua xếp cấp)' : ''}</button></div>`; return; }
  const i = ltDay(c, now), days = [...Array(LT_D)].map((_, k) => c.d0 + k), m = actMin(t), fx = ltFixMin(t), cap = ltCap();
  const f = typeof mapFocus === 'function' && ltHasData() ? mapFocus(now) : null, R = typeof revCount === 'function' ? revCount(now) : { n: 0 };
  const step = (ok, lab, attr, sub) => `<button class="${ok ? '' : 'pri'}" ${attr} style="margin:4px 0;${ok ? 'opacity:.7' : ''}">${ok ? '✅' : '⬜'} ${lab}${sub ? `<small style="display:block;font-weight:400;opacity:.85">${sub}</small>` : ''}</button>`;
  const pl = plTop(stage), vcl = pl ? plLeft(pl) : [], nw = todayNew();
  const low = OV.filter(([id]) => ovIn(id, stage) && !ovPassed(id, stage)).map(o => [o, ovStat(o[0], stage)]).filter(([, s]) => s && s.lq < 100).sort((a, b) => a[1].lq - b[1].lq)[0];
  const fixDone = fx >= cap, did = f && f.act.some(w => w.td === t);
  const plan = [
    R.n ? step(false, `① Ôn ${R.n} mục đến hạn`, 'data-lt="rev"', 'làm trước, chống quên') : step(true, '① Không còn mục đến hạn', 'data-lt="none"'),
    f && f.act.length ? step(did || fixDone, fixDone ? `② Đủ phần chữa lỗi hôm nay (${fx}/${cap} phút)` : `② Chữa ${Math.min(MAP_TODAY, f.act.length)} chỗ yếu`, 'data-lt="fix"', `🩹 ${fx}/${cap} phút · tối đa ${Math.round(LT_FIX * 100)}% thời gian để còn học cái mới`)
      : step(true, '② Chưa có chỗ yếu cần chữa', 'data-lt="none"', ltHasData() ? '' : 'làm bài trước, app mới thấy chỗ yếu'),
    vcl.length && !nw ? step(false, `③ 🚀 Thi vượt ${vcl.length} phần lên ${LVN[pl]}`, `data-vcv="${pl}"`, 'xếp cấp cao hơn cấp đang học')
      : step(nw > 0, nw ? `③ Đã học ${nw} mục mới hôm nay` : `③ Học bài mới ${LVN[stage]}${low ? `: ${low[0][1]} ${low[0][2]}` : ''}`, low && !nw ? `data-lt="part" data-ltp="${low[0][0]}"` : 'data-lt="new"', `≥ ${100 - Math.round(LT_FIX * 100)}% thời gian`)];
  const hist = L.d.filter(x => x.end).slice().reverse();
  $app.innerHTML = `<div id="lt"></div><h1>🔄 Lộ trình</h1>${goalBox}
    <div class="box"><div class="row"><b>📆 Đợt ${c.n} · ngày ${Math.min(i, LT_D)}/${LT_D}</b><span class="mute">${ltFmt(c.d0)} → ${ltFmt(c.d0 + LT_D - 1)}</span></div>
      <div style="display:grid;grid-template-columns:repeat(${LT_D},1fr);gap:4px;margin:8px 0">${days.map(d => `<div title="${actMin(d)} phút" style="height:10px;border-radius:3px;background:${actMin(d) >= ACT_DAY_MIN ? 'var(--good)' : d === t ? 'var(--accent)' : 'var(--line)'}"></div>`).join('')}</div>
      <div class="row"><span><b>${m}</b><span class="mute"> / ${actGoal()} phút hôm nay</span></span><span class="mute">🔥 ${actStreak(now)} ngày</span></div>${bar(Math.round(Math.min(1, m / actGoal()) * 100), 100, 'var(--good)')}
      <p style="margin:10px 0 2px"><b>Việc hôm nay</b></p>${plan.join('')}
      ${i >= LT_D ? `<button class="pri" data-lt="chk" style="margin-top:8px">📝 Kiểm tra cuối đợt (~10 phút) → tổng kết</button>` : `<p class="mute" style="margin:8px 0 0">📝 Kiểm tra cuối đợt mở vào ngày ${LT_D} (còn ${LT_D - i} ngày).</p>`}</div>
    ${plBox}
    ${f ? `<button data-mapv="lt">🗺 Bản đồ chỗ yếu: đang chữa ${f.act.length}${f.queue.length ? ` · ${f.queue.length} chờ` : ''} · ✅ ${f.done} ›</button>` : ''}
    ${hist.length ? `<details class="box"><summary>📊 Các đợt trước (${hist.length})</summary>${hist.map(x => `<div style="margin:8px 0"><b>Đợt ${x.n}</b> <span class="mute">${ltFmt(x.d0)} → ${ltFmt(x.end)}</span>${ltSumHtml(x, L.d[L.d.indexOf(x) - 1])}</div>`).join('<hr style="border:0;border-top:1px solid var(--line)">')}</details>` : ''}
    <p class="mute">Lộ trình chỉ chia việc. Mọi bài vẫn tính 📘 Học / 🔁 Nhớ / Thi như ở 🎯 Học. Luật: 👤 Của tôi → 📘 Luật và cách dùng → 🔄 Lộ trình.</p>`; }

document.addEventListener('click', e => { if (!S) return; const b = e.target.closest('[data-lt]'); if (b) { const a = b.dataset.lt, L = ltSt(); scrollTo(0, 0);
    if (a === 'none') return;
    if (a === 'home') return ltView();
    if (a === 'edit') return ltGoalView();
    if (a === 'goal') { const lv = (document.getElementById('ltlv') || {}).value, d = (document.getElementById('ltdate') || {}).value, mn = +(document.getElementById('ltmin') || {}).value;
      if (!LVN[lv]) return toast('Chọn cấp mục tiêu.'); L.goal = { lv, date: /^\d{4}-\d{2}-\d{2}$/.test(d || '') ? d : '', at: Date.now() }; if (mn) S.goal = mn; S.t = Date.now(); save(); return ltView(); }
    if (a === 'start') { ltStart(); return ltView(); }
    if (a === 'place') return placeView(ltView);
    if (a === 'rev') return revRun(ltView);
    if (a === 'fix') { MAP_BACK = 'lt'; return mapToday(); }
    if (a === 'part') return ovOpenPart(b.dataset.ltp, ovStage());
    if (a === 'new') { HOME.lv = curLevel(); HOME.open = null; return home(); }
    if (a === 'chk') return ltCheck(); }
  if (e.target.closest('[data-cbl-go]')) { scrollTo(0, 0); cbView(); } });
