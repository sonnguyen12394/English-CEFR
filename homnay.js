// 📅 Hôm nay + 🧭 Kiểm tra xếp cấp (v74, 28/10/2026, người sáng lập: "phân tích điểm mạnh yếu … làm cho phần học CEFR trở nên giá trị").
// Dữ liệu thật (Supabase, 28/10): app được mở nhiều lần mỗi ngày nhưng không ghi tiến độ lần nào (0 câu trả lời); tài khoản học có 0 từ. Vấn đề chính không phải thiếu
// tính năng mà là chưa học đều. Tệp này thêm: ① đo phút học mỗi ngày (S.act, tính từ nhịp save()), mục tiêu phút, chuỗi ngày, 7 ngày gần nhất;
// ② ô Hôm nay ở đầu Tổng quan: 3 việc rõ ràng (ôn bài đến hạn → học bài mới → luyện 1 kỹ năng); ③ kiểm tra xếp cấp (chỉ gợi ý cấp bắt đầu, KHÔNG đổi luật đo:
// muốn bỏ qua cấp dưới vẫn dùng 🎚 Đặt tiến độ ở 💾 Sao lưu hoặc thi chuyển cấp như cũ). Không tính vào 📘 Học / 🔁 Nhớ / Thi chuyển cấp.

// ---------- ① phút học: mỗi lần save() (mỗi câu trả lời, mỗi bài) cộng khoảng cách tới lần trước nếu < 3 phút, không thì 15 giây ----------
const ACT_GAP = 180000, ACT_BASE = 15000, ACT_DAY_MIN = 5;
// v99: dùng kết quả 🧭 xếp cấp. Xếp cao hơn cấp đang học (và chưa chọn "học từ đầu") → gợi ý 🚀 thi vượt các phần bắt buộc chưa thử ở cấp đó.
const plTop = (stage = ovStage()) => { const P = S && S.place; return P && P.top && !P.no && LEVELS.indexOf(P.top) > LEVELS.indexOf(stage) ? P.top : null; };
const plLeft = lv => typeof vcLvOf !== 'function' ? [] : ovReq(lv).filter(([id]) => { const L = vcLvOf(id, lv); return L && !ovPassed(id, L) && !vcLast(id, L) && !vcBlock(id); });   // ngày có ≥ 5 phút mới tính vào chuỗi
// v133 (4/11/2026, ĐỔI LUẬT ĐO; người sáng lập "bạn tự tính cho hợp lý đi" sau khi Claude đề xuất "kết quả kiểm tra là nơi bắt đầu học"):
//   cấp kiểm tra xếp được (đúng ≥ 80% câu của cấp, plResult) là nơi BẮT ĐẦU học. Bấm "Tiếp" ở kết quả (hoặc việc "Bắt đầu học ở …" ở Hôm nay) → mọi phần tính đã qua
//   các cấp DƯỚI cấp đó như 🚀 thi vượt (lần thi đạt ghi pl: true; bài / từ chưa học của cấp dưới thành đã học + nhớ, hạn ôn rải 30–150 ngày nên vẫn quay lại để kiểm dần),
//   trừ 🧭 chỗ hổng nền đã xác nhận (để học lại). Cấp xếp được vẫn phải học và thi như thường: bài kiểm tra chỉ đo hiểu từ và ngữ pháp, không đo nghe, nói, viết.
//   "Tôi muốn học lại từ đầu" (S.place.no) thì không đổi gì. Trước v133: phải 🚀 thi vượt từng phần (việc đầu tiên ở Hôm nay) hoặc học lại từ Pre-A1.
const plSolid = () => { const P = S && S.place; return P && P.top && !P.no ? P.top : null; };
const plPend = (stage = ovStage()) => { const L = plSolid(); return L && !(S.place.ap && S.place.ap.lv === L) && LEVELS.indexOf(L) > LEVELS.indexOf(stage) ? L : null; };
function plApply(L, now = Date.now()) { if (!S.place || !L || typeof vcApply !== 'function') return 0; const skip = new Set((S.place.gap || []).filter(g => !g.ok).map(g => g.k)); let n = 0;
  for (const [id] of OV) { const Lb = vcLvs(id).filter(l => LEVELS.indexOf(l) < LEVELS.indexOf(L)).pop(); if (Lb) n += vcApply(id, Lb, now, skip, true); }
  S.place.ap = { lv: L, at: now, n }; S.place.st = ovStage(); S.t = Date.now(); save(); return n; }
const actSt = () => (S.act = S.act || {});
function actTick(now = Date.now()) { if (!S) return; const d = dayOf(now), A = actSt(), o = A[d] = A[d] || { ms: 0, n: 0, last: 0 };
  o.ms += o.last && now - o.last < ACT_GAP ? now - o.last : ACT_BASE; o.n++; o.last = now;
  const old = Object.keys(A).filter(k => +k < d - 400); for (const k of old) delete A[k]; }   // giữ ~13 tháng
const actMin = d => Math.round(((actSt()[d] || {}).ms || 0) / 60000);
function actStreak(now = Date.now()) { const t = dayOf(now); let d = actMin(t) >= ACT_DAY_MIN ? t : t - 1, n = 0; while (actMin(d) >= ACT_DAY_MIN) { n++; d--; } return n; }
const actGoal = () => (S.goal = S.goal || 15);

// ---------- ② ô Hôm nay ----------
// tổng bài cần ôn của mọi phần (cấp đang học của từng phần, như "Nên làm")
function todayDue() { if (!(PA && Object.values(KIT).every(P => P.items))) return null; let n = 0;
  for (const [id] of OV) { const l = id === 'tv' ? curLevel() : id === 'pa' ? paLevel() : kLv(KIT[id]), s = ovStat(id, l); if (s) n += s.due; } return n; }
const todayNew = () => { const t = dayOf(Date.now()); return Object.values(S.cards || {}).filter(c => c.d0 === t).length + Object.values(S.k || {}).reduce((s, k) => s + Object.values(k.cards || {}).filter(c => c.d0 === t).length, 0); };
const TODAY_SK = ['nghe', 'noi', 'doc', 'viet'];
const todaySkill = () => { const t = dayOf(Date.now()); return TODAY_SK.some(id => { const k = (S.k || {})[id]; return k && (Object.values(k.cards || {}).some(c => c.last && !c.vc && dayOf(c.last) === t) || (k.runs || []).some(r => !r.vc && dayOf(r.at) === t)); }); };   // v133: thẻ / lần thi tạo khi bỏ qua theo kiểm tra (vc) không phải đã luyện
// v86: nơi duy nhất bảo "làm gì" (o = { due: [phần, cấp] nhiều bài ôn nhất, low: [phần, cấp] 📘 Học thấp nhất } từ overview); bài kỹ năng do 🗺 bản đồ chọn trước
// v107 (người sáng lập "làm hết đi" sau khi Claude rà lại: 4 chỗ cùng bảo "hôm nay làm gì"): ô Hôm nay là danh sách việc DUY NHẤT (todayPlan).
//   🔄 Lộ trình chỉ giữ mục tiêu, đợt, tổng kết và lối tắt về đây; nút ▶ Chữa tiếp của bản đồ và "Nên làm hôm nay" của IELTS / TOEIC là cùng việc, không phải danh sách khác.
//   Luật của Lộ trình áp ở đây cho mọi người: chữa lỗi tối đa LT_FIX số phút mục tiêu (đủ thì nhắc chuyển sang bài mới); ngày 10 của đợt có 📝 kiểm tra cuối đợt.
//   Đang ôn IELTS / TOEIC thì thêm 1 việc luyện thi (nhãn lấy từ ieToday / toToday). Trả về [{ done (true / false; null = nút phụ, không đếm), html }].
const TODAY_EXAM = () => S.exSel === 'toeic' && S.to ? 'toeic' : S.ie && S.ie.set && S.exSel !== 'cefr' && S.exSel !== 'toeic' ? 'ielts' : null;   // chưa đặt mục tiêu (cũ)
// v108: có 🎯 mục tiêu thì việc luyện đề và tỉ lệ nền / đề theo ltSplit (lotrinh.js): nền thiếu ≥ 2 cấp → chưa luyện đề (chỉ một dòng xem dạng đề);
//   nền chiếm ≤ 30 % → bỏ "luyện 1 bài kỹ năng" nền (luyện đề đã luyện kỹ năng); nền đủ (10 %) → bỏ cả "bài mới" nền, giữ ôn + chữa. Việc luyện đề xong khi đủ số phút đề.
// v112 (giao diện trực quan): việc hôm nay là dữ liệu có cấu trúc { k, ic, title (tên việc ngắn, lời thường), meta (một dòng), done (true / false; null = phần phụ), attr (data-* để bấm), extra (html phụ) }.
//   Thứ tự: kiểm tra trình độ (người mới) → ôn bài cũ → bài kiểm tra 10 ngày → sửa lỗi sai → bài mới / thi vượt → luyện kỹ năng → luyện đề. Luật như v107–v111.
const TODAY_CUT = (s, n = 34) => { s = String(s || ''); return s.length > n ? s.slice(0, n - 1) + '…' : s; };
// v133: số phút ước của một bài mới (chỉ để người học biết việc dài bao lâu) và tên việc bằng chữ thường: "Từ vựng B1 · Bài 4" + dòng vì sao
const TODAY_MIN = { tv: 7, pa: 5, np: 6, nghe: 6, doc: 6, noi: 5, viet: 8 };
function todayNewTitle(id, lv, nn) { const o = (OV.find(x => x[0] === id) || [id, '', id]), L = LVN[lv] || '';
  if (id === 'tv' && typeof nextUnit === 'function') { const u = nextUnit(); if (u) { const i = UNITS.filter(x => x.lv === u.lv).indexOf(u) + 1; return [`Từ vựng ${LVN[u.lv]} · Bài ${i}`, `Bài kế tiếp ở trình độ của bạn: ${u.words.slice(0, 3).map(w => w.w).join(', ')}…`]; } }
  return [TODAY_CUT(`${o[2]} ${L}${nn ? ' · ' + nn : ''}`, 40), 'Bài kế tiếp ở trình độ của bạn']; }
function todayItems(stage = ovStage(), o = {}) { const now = Date.now(), t = dayOf(now), due = todayDue(), nw = todayNew(), sk = todaySkill(), out = [];
  const sp = S.lt && S.lt.goal && typeof ltSplit === 'function' ? ltSplit() : null, exK = sp ? (sp.k === 'cefr' ? null : sp.k) : TODAY_EXAM();
  const has = Object.keys(S.cards || {}).length || Object.values(S.k || {}).some(k => Object.keys(k.cards || {}).length);
  const mf = typeof mapFocus === 'function' && has ? mapFocus() : null;
  const mapSk = mf && (mf.act.find(w => TODAY_SK.includes(w.id)) || mf.queue.find(w => TODAY_SK.includes(w.id)));
  const lowSk = mapSk ? [mapSk.id] : TODAY_SK.filter(id => KIT[id] && KIT[id].items && KIT[id].lvs.includes(kLv(KIT[id]))).map(id => [id, ovStat(id, kLv(KIT[id]))]).filter(([, s]) => s).sort((a, b) => a[1].lq - b[1].lq)[0];
  const low = o.low || (() => { const r = OV.filter(([id]) => ovIn(id, stage) && !ovPassed(id, stage)).map(x => [x, ovStat(x[0], stage)]).filter(([, s]) => s && s.lq < 100).sort((a, b) => a[1].lq - b[1].lq)[0]; return r ? [r[0][0], stage] : null; })();
  const nm = id => (OV.find(x => x[0] === id) || [id, '', id]), add = it => out.push({ ...it, meta: it.meta != null ? it.meta : it.sub }), extra = html => out.push({ done: null, extra: html });
  // tên bài mới kế tiếp của phần (để người học biết sẽ học gì)
  const nextName = id => { try { if (id === 'tv') { const u = nextUnit(); return u ? u.vi : ''; } if (KIT[id] && KIT[id].items) { const P = KIT[id], x = kItems(P, kLv(P)).find(y => !kSt(id).cards[y.id]); return x ? P.name(x) : ''; } } catch (e) {} return ''; };
  // 🧭 người mới: kiểm tra trình độ trước
  if (!Object.keys(S.cards || {}).length && !S.place && !(S.lt && S.lt.self)) add({ k: 'place', ic: '🧭', title: 'Kiểm tra trình độ', sub: 'Để app bắt đầu đúng chỗ, khỏi học lại cái đã biết', min: 5, done: false, attr: 'data-place' });
  // 🔁 ôn: MỘT nút ôn chung (dieuhuong.js revRun: sổ lỗi → sổ từ → bài đến hạn)
  { const R = typeof revCount === 'function' ? revCount() : { n: due || 0, c: due, e: 0, v: 0 }, what = [R.c ? `${R.c} bài` : '', R.v ? `${R.v} từ đã lưu` : '', R.e ? `${R.e} lỗi viết / nói` : ''].filter(Boolean).join(' · ');
    if (R.n) S.rvd = t;   // v133: hôm nay có bài cần ôn → ôn xong vẫn hiện ✓; chưa có bài nào cần ôn thì không hiện việc ôn (khỏi ✓ "xong" khi chưa làm gì)
    if (R.n || (has && S.rvd === t)) add({ k: 'rev', ic: '🔁', title: R.n ? `Ôn ${R.n} mục cũ` : 'Ôn bài cũ', sub: R.n ? `${what} · ôn đúng lúc để không quên` : 'Xong. App tự nhắc khi tới ngày ôn.', min: R.n ? Math.max(1, Math.min(actGoal(), Math.ceil(R.n / 6))) : 0, done: !R.n && due != null, attr: R.n && typeof revRun === 'function' ? 'data-rev' : 'data-today="due"' }); }
  // 📝 ngày 10 của đợt
  { const c = S.lt && S.lt.goal && typeof ltCur === 'function' ? ltCur() : null; if (c && ltDay(c, now) >= LT_D) add({ k: 'chk', ic: '📝', title: 'Bài kiểm tra 10 ngày', sub: 'Xem bạn tiến bộ tới đâu sau 10 ngày', min: 10, done: false, attr: 'data-lt="chk"' }); }
  // 🩹 sửa lỗi sai: chỗ cần học lại (xếp cấp phát hiện) trước, rồi chỗ hay sai; tối đa LT_FIX số phút
  { const gn = typeof plGaps === 'function' ? plGaps(now).filter(g => !g.cho).length : 0, act = mf ? mf.act.length : 0, did = mf && mf.act.some(w => w.td === t);
    const fx = typeof ltFixMin === 'function' ? ltFixMin(t) : 0, cap = typeof ltCap === 'function' ? ltCap() : 0, full = cap && fx >= cap;
    const nr = has && typeof mapRed === 'function' ? mapRed(now).length : 0;   // v119: bản đồ theo bài: việc chữa ghi số bài yếu (mapToday chữa bài yếu nhất)
    if (gn || act || nr) add({ k: 'fix', ic: '🩹', title: 'Sửa lỗi sai', sub: full ? `Đủ cho hôm nay (${fx}/${cap} phút)` : gn ? `${gn} chỗ bài kiểm tra phát hiện: học lại cho chắc` : did && !nr ? 'Đã sửa hôm nay' : nr ? `${nr} bài làm sai nhiều: sửa trước khi quên` : `${Math.min(MAP_TODAY, act)} chỗ hay quên`, min: cap || 3, done: !!(full || (did && !gn && !nr)), attr: 'data-today="fix"' });
    if (mf && mf.root.length) extra(`<button class="link" data-map-rl="${esc(mapKey(mf.root[0]))}" style="margin:0 0 4px">🧱 Học lại bài gốc: ${mf.root.length} chỗ kẹt lâu ›</button>`); }
  // 📘 bài mới (v99: xếp cấp cao hơn → thi vượt thay cho bài mới cấp thấp)
  // v133: kiểm tra xếp được cấp cao hơn mà chưa chọn nơi bắt đầu → MỘT việc "Bắt đầu học ở …" (thay việc 🚀 thi vượt của v99; thi vượt vẫn có ở 📈 Tiến độ)
  { const pp = typeof plPend === 'function' ? plPend(stage) : null;
    if (pp) add({ k: 'plstart', ic: '🧭', title: `Bắt đầu học ở ${LVN[pp]}`, sub: 'Theo bài kiểm tra: không phải học lại các cấp dưới', min: 1, done: false, attr: 'data-plstart' });
    else if (!sp || sp.nen > 10) { const nn = low ? nextName(low[0]) : '', rd = low && KIT[low[0]] && KIT[low[0]].newQs;   // v116: 📰 Đọc / 🎧 Nghe: bài mới là 🏋️ bài tập (làm trước, xem sau)
      const nt = low ? todayNewTitle(low[0], low[1], nn) : null;
      add({ k: 'new', ic: rd ? '🆕' : '📘', title: nw ? 'Học bài mới' : nt ? nt[0] : rd ? 'Làm bài mới' : 'Học bài mới', sub: nw ? `Đã học ${nw} mục mới hôm nay` : nt ? nt[1] : `Bài kế tiếp ở ${LVN[stage]}`, min: nw ? 0 : TODAY_MIN[low ? low[0] : 'tv'] || 6, done: nw > 0, attr: low && !nw ? `data-today="part" data-tp="${low[0]}" data-tpl="${low[1]}"` : 'data-today="new"' }); } }
  // 🎧 kỹ năng (bỏ khi nền chỉ còn phần nhỏ: luyện đề đã luyện kỹ năng)
  if (!sp || sp.nen >= 70) add({ k: 'skill', ic: lowSk ? nm(lowSk[0])[1] : '🎧', title: lowSk ? `Luyện ${nm(lowSk[0])[2]}` : 'Luyện kỹ năng', sub: sk ? 'Đã luyện hôm nay' : mapSk ? 'Kỹ năng này còn chỗ làm sai' : lowSk ? 'Kỹ năng bạn học ít nhất ở cấp này' : 'Nghe, Nói, Đọc, Viết', min: sk ? 0 : 5, done: sk, attr: `data-today="skill"${lowSk ? ` data-tsk="${lowSk[0]}"` : ''}` });
  // 🎓 luyện đề của mục tiêu: đủ số phút đề là xong
  if (exK) { const en = { ielts: 'IELTS', toeic: 'TOEIC', cambridge: 'Cambridge' }[exK];
    if (sp && !sp.ex) extra(`<p class="mute" style="margin:2px 0 6px">🎓 Chưa cần luyện đề ${en}: trình độ còn xa mức đề thi cần, học tiếng Anh trước. <button class="link" data-ltex>Xem dạng đề ›</button></p>`);   // v113: chỉ mở màn kỳ thi, không tự vào bài
    else { let lab = ''; if (exK !== 'cambridge') try { lab = String((exK === 'ielts' ? ieToday() : toToday())[1] || '').replace(/<[^>]+>/g, '').replace(/^\W+\s*/, ''); } catch (e) {}
      const o2 = exK === 'ielts' ? S.ie || {} : exK === 'toeic' ? S.to || {} : {}, at = r => r && r.at && dayOf(r.at) === t, exM = sp ? sp.exM : 0, done = sp ? ltExMin(t) >= exM : Object.values(o2.r || {}).some(at) || ['w', 's', 'mock', 'spd'].some(k => (o2[k] || []).some(at));
      // v133: chưa có chỗ yếu cần chữa → học bài học kế tiếp của kỳ thi (một dạng câu), mở thẳng bài đó; học hết bài học thì luyện như ieToday / toToday
      let act = ''; if (exK !== 'cambridge') try { act = String((exK === 'ielts' ? ieToday() : toToday())[0] || ''); } catch (e) {}
      const nl = !/data-(im|tm|err|vwrun)/.test(act) && typeof exNextLesson === 'function' ? exNextLesson(exK, typeof ltGoalLv === 'function' ? ltGoalLv() : stage) : null;
      add({ k: 'exam', ic: '🎓', title: nl ? `${en} ${nl.skn} · ${TODAY_CUT(nl.d.t, 30)}` : lab ? `${en} · ${TODAY_CUT(lab, 32)}` : `Luyện ${en}`,
        sub: done ? (sp ? `Đủ ${exM} phút hôm nay` : 'Đã luyện hôm nay') : sp ? `Vì mục tiêu là ${en}: mỗi ngày ${exM} phút ${nl ? 'học một dạng câu của đề' : 'luyện đề'}` : exK === 'cambridge' ? 'Đề thử, dạng đề' : 'Bài nên làm',
        min: done ? 0 : sp ? exM : 5, done, attr: nl && !done ? `data-xl="${exK}|${esc(nl.sk)}|${nl.i}"` : 'data-today="exam"' }); } }
  if (typeof relearnUnits === 'function') for (const [u, ws] of relearnUnits().slice(0, 2)) extra(`<button class="link" data-relearn="${u.id}" style="margin:0 0 4px">🔁 Học lại ${esc(u.vi || uLabel(u))}: ${ws.length} từ hay quên ›</button>`);
  if (mf && !o.lt) extra(`<button class="link" data-mapv${o.lt ? '="lt"' : ''} style="margin:0 0 4px">🗺 Bản đồ chỗ yếu ›</button>`);
  return out; }
const todayRow = (it, next) => `<button class="task${it.done ? ' done' : ''}${next ? ' next' : ''}" ${it.attr}><span class="c">${it.done ? '✓' : next ? '▶' : esc(it.ic)}</span><span class="t"><b>${esc(it.title)}</b><span>${esc(it.sub != null ? it.sub : it.meta || '')}</span></span>${it.min && !it.done ? `<span class="min">${it.min} phút</span>` : '<span class="chev">›</span>'}</button>`;
// tương thích (v107–v111): [{ done, html }]
function todayPlan(stage = ovStage(), o = {}) { const it = todayItems(stage, o), nx = it.find(x => x.done === false); return it.map(x => ({ done: x.done, html: x.extra || todayRow(x, x === nx) })); }
// v112: ô việc hôm nay = danh sách dòng ✓ / ▶ / biểu tượng (ở 🧭 Lộ trình); o.items dùng lại danh sách đã tính
function todayBox(stage, o = {}) { const it = o.items || todayItems(stage, o), main = it.filter(x => x.done != null), nx = main.find(x => !x.done);
  const c = !o.lt && S.lt && S.lt.goal && typeof ltCur === 'function' ? ltCur() : null;
  return `${c ? `<button class="link" data-ltgo style="margin:2px 0">🧭 Đợt ${c.n} · ngày ${Math.min(ltDay(c), LT_D)}/${LT_D} · mục tiêu ${esc(ltGoalName(S.lt.goal))} ›</button>` : ''}
    <div class="tasks" id="today">${main.length ? main.map(x => todayRow(x, x === nx)).join('') : '<p class="mute" style="padding:12px 0">Chưa có việc nào.</p>'}</div>
    ${it.filter(x => x.extra).map(x => x.extra).join('')}`; }
document.addEventListener('change', e => { const g = S && e.target.closest && e.target.closest('select[data-goal]'); if (g && +g.value) { S.goal = +g.value; S.t = Date.now(); save(); overview(); } });
document.addEventListener('click', e => { if (!S) return;
  if (e.target.closest('[data-plno]') && S.place) { S.place.no = 1; S.t = Date.now(); save(); scrollTo(0, 0); return overview(); }
  const b = e.target.closest('[data-today]'); if (!b) return; const k = b.dataset.today; scrollTo(0, 0);
  if (k === 'due' || k === 'new') { const nb = document.querySelector('#app [data-ovp].pri'); if (nb && k === 'due') return nb.click(); return k === 'new' ? (HOME.lv = curLevel(), HOME.open = null, home()) : overview(); }
  if (k === 'fix') { if (typeof MAP_BACK !== 'undefined') MAP_BACK = document.getElementById('lt') ? 'lt' : 'hoc'; return mapToday(); }
  if (k === 'part') { const P = KIT[b.dataset.tp], x = P && P.newQs && P.items ? kNextNew(P) : null;   // v116: Đọc / Nghe vào thẳng 🆕 bài mới (🏋️ bài tập)
    if (x) return kNew(P, x, () => kView(P.id)); return ovOpenPart(b.dataset.tp, b.dataset.tpl); }
  if (k === 'skill') { const id = b.dataset.tsk || 'nghe'; KIT[id].view = kLv(KIT[id]); return kView(id); }
  if (k === 'exam') return typeof exGo === 'function' ? exGo() : exOpen(); });

// ---------- ③ 🧭 kiểm tra xếp cấp: bậc thang, mỗi cấp 5 câu (3 nghĩa từ + 2 ngữ pháp) ----------
// Đúng ≥ 4/5 → lên cấp; ≤ 2/5 → dừng; 3/5 → thêm 1 vòng ở cấp đó. Kết quả = cấp cao nhất đúng ≥ 4/5. Chỉ đo hiểu từ và ngữ pháp (thụ động), không đo nghe nói.
const PL_LV = ['pre', 'a1', 'a2', 'b1', 'b2', 'c1'];
// v99 (nhật ký trải nghiệm vai giáo viên: "plummet" có nhiễu "ban phước", "đi dạo ung dung": loại trừ là đúng, không cần biết từ):
// phương án nhiễu lấy từ cùng bài (cùng chủ đề) rồi cùng cấp, cùng loại từ; bỏ từ đồng / trái nghĩa và nghĩa trùng 2 tiếng liền nhau với đáp án
const plBi = s => { const t = String(s).toLowerCase().split(/[^\p{L}]+/u).filter(Boolean); return new Set(t.slice(1).map((x, i) => t[i] + ' ' + x)); };
function plDis(w, n = 3) { const rel = new Set([...(w.rel ? [...w.rel.syn, ...w.rel.ant] : [])].map(x => x.toLowerCase())), bw = plBi(w.vi), pos = String(w.pos || '').split(',')[0], out = [], seen = new Set([w.vi]);
  const rv = new Set(rel.size ? WORDS.filter(x => rel.has(x.w.toLowerCase())).map(x => x.vi) : []);   // nghĩa của từ đồng / trái nghĩa (từ khác cùng nghĩa cũng loại)
  const ok = x => x.id !== w.id && x.vi && !seen.has(x.vi) && !rv.has(x.vi) && String(x.pos || '').split(',')[0] === pos && !rel.has(x.w.toLowerCase()) && ![...plBi(x.vi)].some(b => bw.has(b));
  const unit = ((UBY[w.u] || {}).words || []), lvw = WORDS.filter(x => wLv(x) === wLv(w));
  for (const x of [...shuf(unit), ...shuf(lvw)]) { if (out.length >= n) break; if (ok(x)) { seen.add(x.vi); out.push(x.vi); } }
  return out; }
function plQs(lv) { const ws = shuf(WORDS.filter(w => wLv(w) === lv && w.vi)).slice(0, 12), out = [];
  for (const w of ws) { if (out.length >= 3) break; const q = question(w, 'w2vi'), d = plDis(w); if (q && d.length === 3) q.opts = shuf([w.vi, ...d]); if (q && q.opts && q.opts.includes(q.a)) out.push({ w, q }); }
  const P = KIT.np, gl = P.lvs.includes(lv) ? lv : P.lvs.filter(l => LEVELS.indexOf(l) <= LEVELS.indexOf(lv)).pop(), gi = shuf(P.items.filter(x => x.lv === gl));
  for (const x of gi) { if (out.length >= 5) break; const q = (P.q(x, 'nhan', 'test') || [])[0]; if (q && q.opts && q.opts.includes(q.a)) out.push({ g: x, q }); }
  return out; }
// bậc thang: cấp vừa làm (lv) đúng ≥ 80% → lên; ≤ 40% → xuống (nếu chưa làm); ở giữa → thêm 1 vòng ở cấp đó (tối đa 10 câu), vẫn ở giữa → xuống (v107); không còn bước → dừng (null)
function plNext(R, lv) { const [a, n] = R[lv], p = a / n, i = PL_LV.indexOf(lv), up = PL_LV[i + 1], dn = PL_LV[i - 1];
  if (p >= 0.8) return up && !R[up] ? up : null;
  if (p <= 0.4) return dn && !R[dn] ? dn : null;
  return n < 10 ? lv : dn && !R[dn] ? dn : null; }   // v107: 10 câu vẫn ở vùng giữa → đo xuống 1 cấp (dữ liệu thật: A2 6/10 rồi dừng → "bắt đầu từ đầu" dù có thể đã nắm A1)
const plResult = R => PL_LV.filter(l => R[l] && R[l][0] / R[l][1] >= 0.8).pop() || null;
async function placeView(back, lab) { const out = typeof back === 'function' ? back : S.lt && S.lt.goal && typeof ltView === 'function' ? ltView : overview;   // v112: lab = nhãn nút đi tiếp (màn mục tiêu 3 bước), khi đó kết quả chỉ có MỘT nút $app.innerHTML = '<p class="mute">Đang tải…</p>'; await Promise.all([loadEB(), kLoad(KIT.np)]); window.CUR = { view: 'xep-cap' };
  const R = {}, res = []; let lv = 'a2', qs = plQs(lv), i = 0;
  const show = () => { if (i >= qs.length) { R[lv] = R[lv] || [0, 0]; const nx = R[lv][1] ? plNext(R, lv) : null; if (!nx) return end(); lv = nx; qs = plQs(lv); i = 0; if (!qs.length) return end(); }
    const it = qs[i], q = it.q;
    $app.innerHTML = `<div class="row top"><button class="link" data-a="back">← Thôi</button><span class="uname">🧭 Xếp cấp · câu ${res.length + 1}</span></div>
      <p class="mute">Không đoán bừa: không biết thì chọn "Chưa biết". Làm 15–30 câu, khoảng 5–10 phút.</p>${it.w ? `<p class="q">${q.top}</p><p class="mute">${q.sub}</p>` : `${q.head || ''}<p class="q">${q.q}</p>`}
      ${q.opts.map((o, k) => `<button class="opt" data-po="${k}">${esc(o)}</button>`).join('')}<button class="opt" data-po="-1" style="opacity:.75">🤷 Chưa biết</button>`;
    $app.onclick = e => { if (e.target.closest('[data-a="back"]')) return out(); const b = e.target.closest('[data-po]'); if (!b) return; const k = +b.dataset.po, ok = k >= 0 && q.opts[k] === q.a;
      const r = R[lv] = R[lv] || [0, 0]; r[1]++; if (ok) r[0]++; res.push({ lv, ok, it }); i++; show(); }; };
  // v106: câu sai ở cấp đã nắm vững (≤ cấp xếp được) chỉ là giả thuyết → 🔎 hỏi thêm 2 câu mỗi chỗ (chandoan.js); sai thật mới vào 🗺 bản đồ (🧭 chỗ hổng nền)
  const end = () => { const top = plResult(R), start = top || 'pre', old = ((S.place || {}).gap || []).filter(g => !g.ok);   // v133: học từ cấp xếp được
    S.place = { at: Date.now(), top, start, R, st: ovStage(), gap: old }; S.t = Date.now(); save();
    const cands = top && typeof plConfirm === 'function' ? res.filter(r => !r.ok && LEVELS.indexOf(r.lv) <= LEVELS.indexOf(top)).slice(0, PL_CF_MAX).map(r => ({ ...r.it, lv: r.lv })) : [];
    if (!cands.length) return result(null);
    plConfirm(cands, { gap: true, intro: `Bạn sai ${cands.length} câu ở cấp bạn nắm khá vững. Một câu sai có thể chỉ là bấm nhầm hay đoán. Hỏi thêm ${PL_CF_N} câu mỗi chỗ (~${Math.max(1, Math.round(cands.length * PL_CF_N * 12 / 60))} phút): sai thật mới đưa vào 🗺 bản đồ.` },
      cf => { S.place.cf = cf; S.t = Date.now(); save(); result(cf); }); };
  const result = cf => plResView({ fresh: true, cf, lab, back: out });
  if (!qs.length) return end(); show(); }
// ---------- v133 màn kết quả kiểm tra = nơi bắt đầu học (bản mẫu "Đề xuất · Kết quả kiểm tra"): một trình độ, lý do, một nút Tiếp ----------
const PL_SHOW = ['pre', 'a1', 'a2', 'b1', 'b2', 'c1', 'c2'];
function plResHtml(o = {}) { const P = S.place || {}, top = P.top, stage = ovStage(), pend = plPend(stage), start = pend || stage, R = P.R || {};
  const g = S.lt && S.lt.goal, need = g && typeof ltGoalLv === 'function' ? ltGoalLv(g) : null, k = g && typeof ltKind === 'function' ? ltKind(g) : 'cefr';
  const below = top ? PL_SHOW.filter(l => LEVELS.indexOf(l) < LEVELS.indexOf(top)) : [], gapN = (P.gap || []).filter(x => !x.ok).length;
  const steps = need && OV_LV.indexOf(need) > OV_LV.indexOf(start) ? OV_LV.slice(OV_LV.indexOf(start) + 1, OV_LV.indexOf(need) + 1) : [];
  const chip = l => `<span class="lvchip${l === top ? ' on' : top && LEVELS.indexOf(l) < LEVELS.indexOf(top) ? ' lo' : ''}">${LVN[l]}</span>`;
  const c1 = pend ? `<b>Bạn bắt đầu học ở ${LVN[pend]}</b><p>Không phải học lại ${below.map(l => LVN[l]).join(', ')}. Bài cũ vẫn mở để xem khi cần.</p>${gapN ? `<p>${gapN} chỗ bạn làm sai ở cấp dưới sẽ được ôn lại trong những ngày đầu.</p>` : ''}<p>Bài nào ở ${LVN[pend]} đã biết thì làm luôn bài tập để bỏ qua.</p>`
    : top && !P.no && LEVELS.indexOf(stage) >= LEVELS.indexOf(top) ? `<b>Bạn học ở ${LVN[stage]}</b><p>${P.ap ? 'Các cấp dưới đã tính là qua theo bài kiểm tra.' : 'Khớp với tiến độ bạn đã có trong app.'} Bài nào đã biết thì làm luôn bài tập để bỏ qua.</p>`
    : `<b>Bạn học từ ${LVN[stage]}</b><p>Đi từng bước. Bài nào đã biết thì làm luôn bài tập để bỏ qua.</p>`;
  const c2 = !need ? '' : `<div class="box"><b>${esc(typeof ltGoalName === 'function' ? ltGoalName(g) : '')}${k === 'cefr' ? '' : ` cần khoảng ${LVN[need]}`}</b>${steps.length ? `<p>Từ ${LVN[start]} còn ${steps.length} bước: ${steps.map(l => LVN[l]).join(' → ')}.</p><p>Học xong mỗi bước thì làm bài thi ngắn để lên bước sau.</p>` : '<p>Bạn đã đủ trình độ này.</p>'}</div>`;
  return `<div id="plres"></div>${o.lab ? '<div class="wdots"><i class="on"></i><i class="on"></i><i></i></div>' : ''}<h1 style="font-size:28px">${top ? `Bạn đang ở khoảng ${LVN[top]}` : 'Bạn học từ đầu'}</h1>
    <p class="mute" style="margin:0">${o.fresh ? 'Theo bài kiểm tra bạn vừa làm.' : P.at ? `Theo bài kiểm tra ngày ${new Date(P.at).toLocaleDateString('vi-VN')}.` : ''}</p>
    <div class="lvladder">${PL_SHOW.map(chip).join('')}</div>
    <div class="box">${c1}</div>${c2}
    <details class="box"><summary>Điểm từng cấp</summary><p class="mute" style="margin:6px 0 0">${PL_LV.filter(l => R[l]).map(l => `${LVN[l]}: ${R[l][0]}/${R[l][1]}`).join(' · ') || 'chưa có'}</p>
      ${o.cf && o.cf.n ? `<p style="margin:6px 0 0">${plCfTxt(o.cf)}</p>` : ''}<p class="mute" style="margin:6px 0 0">Bài này chỉ đo hiểu nghĩa từ và ngữ pháp, không đo nghe, nói, viết. Vững một cấp = đúng từ 80% số câu của cấp đó.</p></details>
    <button class="btnbig" data-pla="go">${esc(o.lab || 'Tiếp ›')}</button>${pend ? '<button class="link" data-pla="no" style="display:block;margin:4px auto">Tôi muốn học lại từ đầu</button>' : ''}`; }
function plResView(o = {}) { const back = o.back || (S.lt && S.lt.goal && typeof ltView === 'function' ? ltView : overview); window.CUR = { view: 'xep-cap-ket-qua' };
  $app.innerHTML = plResHtml(o); scrollTo(0, 0);
  $app.onclick = async e => { const b = e.target.closest('[data-pla]'); if (!b) return;
    if (b.dataset.pla === 'no') { S.place.no = 1; S.t = Date.now(); save(); return back(); }
    const L = plPend(); if (L) { $app.innerHTML = '<p class="mute">Đang xếp bài học…</p>'; try { await Promise.all([paLoad(), ...Object.values(KIT).map(kLoad)]); } catch (e) {} plApply(L); toast(`Bắt đầu học ở ${LVN[L]}`); }
    back(); }; }
document.addEventListener('click', e => { if (e.target.closest('[data-plstart]') && S && S.place) { scrollTo(0, 0); plResView({}); } });
document.addEventListener('click', e => { if (e.target.closest('[data-place]') && S) { scrollTo(0, 0); placeView(); } });
