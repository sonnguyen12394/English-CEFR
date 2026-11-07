// 🗺 Bản đồ band IELTS (v83, bước 2 + 3; người sáng lập 29/10/2026 chọn làm luôn dù dữ liệu thật còn 0 bài IELTS — các ngưỡng dưới đây là ước đoán, chỉnh lại sau 2 tuần học thật).
// Chỗ yếu = dạng câu (Đọc / Nghe, ielts.js `S.ie.ty`) hoặc tiêu chí chấm (Viết / Nói, `S.ie.cr`), không phải từng bài. Khác CEFR: chữa bằng bài MỚI cùng dạng (làm lại bài cũ = nhớ đáp án).
//   Ưu tiên = band có thể tăng × độ chắc. Đọc / Nghe: tỉ trọng dạng × khoảng thiếu tới 75% × 40 câu / ~4,5 câu mỗi band. Viết / Nói: (band mục tiêu − band tiêu chí) / 4 (band kỹ năng = trung bình 4 tiêu chí).
//     Độ chắc: dạng ≥ 8 câu ở ≥ 2 bài = 1, ít hơn = 0,5; tiêu chí AI chấm = 1, máy ước = 0,5 (AI có thì dùng AI).
//   🎯 Nhóm đang chữa tối đa 3 chỗ, mỗi kỹ năng tối đa 1 (kỹ năng cần vài tuần, không phải vài ngày như một từ). Còn lại ⏳ hàng chờ.
//   Một lần thử = một lượt có ≥ 4 câu của dạng, trên bài chưa gặp trong 30 ngày (luyện hoặc đề thử), hoặc một bài Viết / Nói được chấm; mỗi ngày tính 1.
//   Lượt đạt: dạng ≥ 75%; tiêu chí ≥ band mục tiêu. Chữa xong = đạt 2 lượt liền ở 2 ngày khác nhau (lượt trượt xoá chuỗi đạt; v107: lượt đạt cùng ngày với lượt trượt chưa tính).
//   Thử 3 ngày chưa xong → ⏸ gác 14 ngày; quay lại vẫn kẹt → 🧱 truy nền CEFR (thường thiếu từ / ngữ pháp), không tự quay lại; học nền xong bấm "Đã học nền" để thử lại.
//   Từ lần thử 2: 📘 xem cách làm dạng / cách nâng tiêu chí trước khi thử.
const IM_ACT = 3, IM_TRY = 3, IM_PARK_D = 14, IM_FRESH_D = 30, IM_MIN_Q = 4;
const IM_W = { 'R-h': 0.2, 'R-tf': 0.3, 'R-comp': 0.3, 'R-mc': 0.2, 'R-gt': 0.5, 'L-form': 0.5, 'L-mc': 0.5 };
const IM_SK = { R: '📖 Đọc', L: '🎧 Nghe', W: '✍️ Viết', S: '🗣 Nói' };
const IM_HOWK = { 'R-h': 'h', 'R-tf': 'tf', 'R-comp': 'comp', 'R-mc': 'time', 'R-gt': 'time', 'L-form': 'listen', 'L-mc': 'listen' };
const IM_TIP = {
  W: [['Hoàn thành đề', ['Trả lời ĐỦ mọi phần đề hỏi; Task 1 phải có câu tổng quan (2 nét chính).', 'Ý chính rõ, mỗi ý có lý do + ví dụ cụ thể. Đủ số từ: thiếu từ bị chặn band.']],
    ['Mạch lạc', ['Mỗi đoạn một ý, câu đầu đoạn nói ý đó.', 'Từ nối đa dạng (however, as a result, for instance…), không lạm dụng một từ; dùng đại từ / từ thay thế để khỏi lặp.']],
    ['Vốn từ', ['Dùng cụm từ theo chủ đề (collocation) thay từ chung chung (good, bad, thing).', 'Diễn đạt lại từ của đề bằng từ đồng nghĩa; sai chính tả trừ điểm.']],
    ['Ngữ pháp', ['Trộn câu đơn với câu phức (although, which, if…), có câu bị động, câu điều kiện.', 'Soát lỗi chia động từ, mạo từ, số ít / số nhiều: bài nhiều lỗi nhỏ khó vượt band 6.']]],
  S: [['Trôi chảy', ['Trả lời dài hơn câu hỏi: ý + lý do + ví dụ.', 'Dùng từ đệm tự nhiên (well, actually, I suppose) thay vì im lặng; Part 2 nói đủ 2 phút.']],
    ['Vốn từ', ['Chuẩn bị từ theo chủ đề hay gặp (nhà, việc làm, du lịch, công nghệ…).', 'Thử vài cụm ít phổ biến, thành ngữ đơn giản đúng ngữ cảnh.']],
    ['Ngữ pháp', ['Dùng đủ thì: quá khứ khi kể, hoàn thành khi nói trải nghiệm, điều kiện khi giả định.', 'Câu phức với because, although, which; sửa lỗi ngay nếu nhận ra.']],
    ['Phát âm', ['Nhấn trọng âm từ và câu; nối âm; đuôi -s, -ed rõ.', 'Máy chỉ đo qua lời chép: nhờ giáo viên / AI nghe thật để chắc.']]] };
const imName = u => IE_TY[u] || (IM_SK[u[0]].split(' ')[0] + ' ' + IE_CR[u[0]][+u.slice(2)]);
const imR2 = x => Math.round(x * 100) / 100;
// mọi chỗ yếu, xếp theo ưu tiên: { u, sk, t, v (số đo), p, sure }
// Chỗ đã chữa xong chỉ xét lại bằng lượt làm SAU ngày chữa xong (fx), không thì lượt sai cũ trong 10 lượt gần nhất kéo nó vào lại nhóm ngay.
function imWeak() { const o = ieSt(), tg = o.target, T = o.ty || {}, fx = (o.fo || {}).fx || {}, out = [];
  for (const k of Object.keys(IE_TY)) { const a = (T[k] || []).filter(b => b.at > (fx[k] || 0)).slice(-10), n = a.reduce((s, b) => s + b.n, 0); if (!n) continue;
    const pct = Math.round(a.reduce((s, b) => s + b.ok, 0) / n * 100), sure = n >= IE_TY_N && new Set(a.flatMap(b => b.ids)).size >= 2;
    if (pct < IE_TY_OK) out.push({ u: k, sk: k[0], t: IE_TY[k], v: `${pct}% · ${n} câu`, p: imR2((IM_W[k] || 0.3) * (IE_TY_OK - pct) / 100 * 40 / 4.5 * (sure ? 1 : 0.5)), sure }); }
  for (const k of ['W', 'S']) for (let i = 0; i < 4; i++) { const u = k + ':' + i, cs = (o.cr || []).filter(r => r.k === k && r.at > (fx[u] || 0)), ai = cs.filter(r => r.src === 'ai').slice(-5), a = ai.length ? ai : cs.filter(r => r.src === 'may').slice(-5);
    if (!a.length) continue; const b = ieRound(a.reduce((s, r) => s + (r.c[i] || 0), 0) / a.length);
    // v99: máy chỉ báo tới IE_MAXM (7.0): mục tiêu cao hơn thì điểm máy = trần chưa nói được là yếu; máy chấm cần ≥ 2 bài mới chắc
    if (b < (ai.length ? tg : Math.min(tg, IE_MAXM))) out.push({ u, sk: k, t: imName(u), v: `${bandTxt(b)} ${ai.length ? '(🧑‍🏫 AI)' : `(máy ước, ${a.length} bài)`}`, p: imR2((tg - b) / 4 * (ai.length ? 1 : 0.5)), sure: !!ai.length || a.length >= 2 }); }
  return out.sort((a, b) => b.p - a.p); }
// số bài chưa gặp trong 30 ngày cho một dạng (kho nhỏ: hết bài mới thì lượt luyện không tính lần thử)
const imFreshOk = (id, now = Date.now()) => { const r = ieSt().r[id]; return !r || now - r.at >= IM_FRESH_D * DAY; };
function imPool(u) { if (u === 'R-para') return IE && IE.para || [];
  // v132: văn bản GT = bộ General Training soạn riêng (chưa có thì bài Đọc B1–B2 của Nền); dạng câu Đọc chỉ lấy bài học thuật (câu của bộ GT ghi vào R-gt)
  if (u === 'R-gt') { const g = IE ? IE.doc.filter(x => x.gt) : []; return g.length ? g : KIT.doc.items ? KIT.doc.items.filter(x => ['b1', 'b2'].includes(x.lv)) : []; }
  if (u[0] === 'R') return IE ? IE.doc.filter(x => !x.gt && (typeof ieHasK !== 'function' || ieHasK(x, u.slice(2)))) : [];   // v123: bài có dạng đó
  // v130: dòng dưới từng bị chú thích ở trên nuốt mất (bản đồ / ghép / trả lời ngắn chỉ có ở bài IELTS, không lấy bài Nghe CEFR)
  if (u === 'L-map' || u === 'L-match' || u === 'L-sa') return IE && IE.ln ? IE.ln.filter(x => x.qs.some(q => IE_LTY[q.k] === u)) : [];
  if (u[0] === 'L') { const ln = IE && IE.ln ? IE.ln.filter(x => x.qs.some(q => IE_LTY[q.k] === u)) : []; return [...ln, ...(KIT.nghe.items ? KIT.nghe.items.filter(x => ['b1', 'b2', 'c1', 'c2'].includes(x.lv) && (u === 'L-form' ? ngForm(x) : true)) : [])]; } return []; }
const imFreshN = u => imPool(u).filter(x => imFreshOk(x.id)).length;
// nhóm đang chữa: S.ie.fo = { a: [{ u, at, tr (số ngày đã thử), td, pd (ngày đạt liền nhau), r (lần quay lại) }], p: [{ u, at, r, root }], n: số chỗ chữa xong }
// v99 (nhật ký trải nghiệm: sai 1 / 2 câu trắc nghiệm đã thành "chỗ yếu" ở ▶ Nên làm hôm nay): chỉ chỗ yếu đủ chắc mới vào nhóm đang chữa;
// chỗ chưa đủ dữ liệu vẫn hiện ở bảng theo dạng ("chưa đủ chắc")
const imSure = () => imWeak().filter(w => w.sure);
const imFocus = (now = Date.now()) => { const o = ieSt(); return fcFocus(o.fo = o.fo || {}, imSure, { act: IM_ACT, cap: () => 1, try: IM_TRY, parkD: IM_PARK_D, info: u => ({ u, sk: u[0], t: imName(u), v: 'đã đạt ngưỡng, chờ đủ 2 lượt', p: 0 }) }, now); };
// một lượt của chỗ đang chữa (gọi từ ieTyLog / ieCrLog trong ielts.js)
const imHit = (u, pass, now = Date.now()) => fcHit(ieSt().fo, u, pass, now);

// ---------- ▶ chữa một chỗ ----------
function imTeach(u, go) { const k = u[0], html = IE_TY[u] ? (typeof ieHow === 'function' ? ieHow([IM_HOWK[u]]).replace('<details', '<details open') : '')
    : `<div class="box"><b>${esc(IE_CR[k][+u.slice(2)])}</b>${IM_TIP[k][+u.slice(2)][1].map(s => `<p style="margin:4px 0">• ${esc(s)}</p>`).join('')}</div>`;
  $app.innerHTML = `<div class="row top"><button class="link" data-a="back">← IELTS</button><span class="uname">📘 Trước khi thử</span></div><h1>📘 ${esc(imName(u))}</h1>
    <p class="mute">Đọc lại cách làm rồi mới thử: làm thêm mà không đổi cách làm thì dễ sai như cũ.</p>${html}<button class="pri" data-im="go">Thử →</button>`;
  $app.onclick = e => { if (e.target.closest('[data-a="back"]')) return ieltsView(); if (e.target.closest('[data-im="go"]')) { scrollTo(0, 0); go(); } }; }
async function imFix(u) { await Promise.all([ieLoad(), kLoad(KIT.nghe), kLoad(KIT.doc)]); const f = imFocus().act.find(w => w.u === u), d = dayOf(Date.now()), k = u[0];
  if (typeof TH_APP !== 'undefined' && !TH_APP.has(u) && u !== 'R-para') return imTeach(u, () => ieThat(k));   // v87: dạng app chưa có bài → chữa bằng đề thật rồi nhập kết quả
  const run = () => {
    if (u === 'R-para') return ieRun('🗺 ' + IE_TY[u], ieParaQs(10), ieltsView);
    if (k === 'W') return ieWrite('t2');
    if (k === 'S') return ieSpeak(['p1', 'p2', 'p3']);
    if (k === 'L' && ['L-map', 'L-match', 'L-sa'].includes(u)) { const pool = imPool(u), R = ieSt().r, fresh = shuf(pool.filter(x => imFreshOk(x.id))), x = fresh[0] || [...pool].sort((a, b) => ((R[a.id] || {}).at || 0) - ((R[b.id] || {}).at || 0))[0];   // v140: đúng phần có dạng đó, làm cả phần
      if (!x) return toast('Chưa có bài nghe hợp dạng này.'); if (!fresh.length) toast('Hết bài mới cho dạng này: lượt này không tính lần thử (đã gặp bài trong 30 ngày).'); return ieRun('🗺 ' + IE_TY[u], ieLnQs(x), ieltsView); }
    if (k === 'L') { const qs = ieListen(u === 'L-form' ? [0, 3] : [1, 2]).map(it => it.q); return qs.length ? ieRun('🗺 ' + IE_TY[u], qs, ieltsView) : toast('Chưa có bài nghe hợp dạng này.'); }
    const pool = imPool(u), fresh = shuf(pool.filter(x => imFreshOk(x.id))), xs = (fresh.length ? fresh : [...pool].sort((a, b) => (ieSt().r[a.id] || {}).at - (ieSt().r[b.id] || {}).at)).slice(0, 2);
    if (!fresh.length) toast('Hết bài mới cho dạng này: lượt này không tính lần thử (đã gặp bài trong 30 ngày).');
    const qs = u === 'R-gt' ? xs.flatMap(x => x.paras ? ieRQs(x) : kRead(KIT.doc, x, 'ct', false).map(q => Object.assign(q, { ty: 'R-gt' }))) : xs.flatMap(x => ieRQs(x, [u.slice(2)]));
    return ieRun('🗺 ' + IE_TY[u], qs, ieltsView); };
  if (k === 'S' && !SREC) return toast('Phần Nói cần máy chép lời: mở trang bằng Safari trên iPhone.');
  if (k === 'W' || k === 'S' || (f && f.tr >= 1 && f.td !== d)) return imTeach(u, run);   // Viết / Nói: luôn xem cách nâng tiêu chí trước; dạng câu: từ lần thử 2
  run(); }

// ---------- v120 bản đồ IELTS ở 🗺 Chỗ yếu (người sáng lập 3/11/2026: "bản đồ mới có theo phần học nền, còn theo mục tiêu như IELTS chưa có"; chọn "mỗi phần một việc cần chữa") ----------
// Cùng khuôn với bản đồ nền (v119) nhưng ô = DẠNG CÂU (Đọc / Nghe) hoặc TIÊU CHÍ CHẤM (Viết / Nói), vì IELTS chấm theo dạng / tiêu chí, không theo bài
// (làm lại bài cũ = nhớ đáp án). Dữ liệu và luật như imWeak / imFocus (không đổi): 🟥 yếu = dưới ngưỡng (dạng < IE_TY_OK%, tiêu chí < band mục tiêu) và đủ chắc;
// 🟨 chưa chắc = có dữ liệu nhưng chưa đủ (dạng < IE_TY_N câu hoặc 1 bài; Viết / Nói 1 bài máy chấm); 🟩 đạt = đủ ngưỡng và đủ chắc, hoặc đã chữa xong; ⬜ chưa làm.
const IM_SHORT = { 'R-h': 'Tiêu đề', 'R-tf': 'T/F/NG', 'R-yn': 'Y/N/NG', 'R-comp': 'Điền từ', 'R-sum': 'Tóm tắt', 'R-mc': 'Trắc nghiệm', 'R-mi': 'Tìm đoạn', 'R-mf': 'Nối đặc điểm', 'R-se': 'Nối câu',
  'R-dia': 'Sơ đồ', 'R-sa': 'Trả lời ngắn', 'R-para': 'Diễn đạt lại', 'R-gt': 'Văn bản GT', 'L-form': 'Điền phiếu', 'L-mc': 'Trắc nghiệm', 'L-map': 'Bản đồ', 'L-match': 'Ghép', 'L-sa': 'Trả lời ngắn' };
const imShort = u => IE_TY[u] ? IM_SHORT[u] || IE_TY[u].replace(/ \(.*$/, '') : IE_CR[u[0]][+u.slice(2)];
const IM_ST = { yeu: 'yếu', on: 'chưa chắc', vung: 'đạt', chua: 'chưa làm' };
function imCell(u) { const o = ieSt(), fx = (o.fo || {}).fx || {}, tg = o.target;
  if (IE_TY[u]) { const a = ((o.ty || {})[u] || []).filter(b => b.at > (fx[u] || 0)).slice(-10), n = a.reduce((t, b) => t + b.n, 0);
    if (!n) return { u, s: fx[u] ? 'vung' : 'chua', v: '' };
    const pct = Math.round(a.reduce((t, b) => t + b.ok, 0) / n * 100), sure = n >= IE_TY_N && new Set(a.flatMap(b => b.ids)).size >= 2;
    return { u, s: !sure ? 'on' : pct < IE_TY_OK ? 'yeu' : 'vung', v: pct + '%' }; }
  const k = u[0], i = +u.slice(2), cs = (o.cr || []).filter(r => r.k === k && r.at > (fx[u] || 0)), ai = cs.filter(r => r.src === 'ai').slice(-5), a = ai.length ? ai : cs.filter(r => r.src === 'may').slice(-5);
  if (!a.length) return { u, s: fx[u] ? 'vung' : 'chua', v: '' };
  const b = ieRound(a.reduce((t, r) => t + (r.c[i] || 0), 0) / a.length), sure = !!ai.length || a.length >= 2;
  return { u, s: !sure ? 'on' : b < (ai.length ? tg : Math.min(tg, IE_MAXM)) ? 'yeu' : 'vung', v: bandTxt(b) }; }
const imRows = () => { const gt = ieSt().type === 'gt', ks = Object.keys(IE_TY).filter(k => k !== 'R-gt' || gt);
  return [['R', ks.filter(k => k[0] === 'R')], ['L', ks.filter(k => k[0] === 'L')], ['W', [0, 1, 2, 3].map(i => 'W:' + i)], ['S', [0, 1, 2, 3].map(i => 'S:' + i)]]; };
// khối IELTS của màn 🗺 Chỗ yếu: 🎯 Việc cần chữa (MỘT nút) → lưới dạng câu / tiêu chí → "Thêm" (ô 🗺 Bản đồ band cũ: thử, đạt liền, hàng chờ, tạm gác, kẹt cần học nền; bảng theo dạng)
function imMap(goal) { const o = ieSt(), f = imFocus(), W = imWeak(), sure = W.filter(w => w.sure), unsure = W.filter(w => !w.sure), rows = imRows(), cells = rows.map(([k, us]) => [k, us.map(imCell)]);
  const has = Object.keys(o.ty || {}).length || (o.cr || []).length, cnt = { yeu: 0, on: 0, vung: 0, chua: 0 }; for (const [, cs] of cells) for (const c of cs) cnt[c.s]++;
  const top = f.act[0] || sure[0], fix = u => `data-im="fix|${u}"`, lab = u => IE_TY[u] ? IM_SK[u[0]].split(' ')[0] + ' ' + imName(u) : imName(u);   // tên tiêu chí Viết / Nói đã có biểu tượng
  const main = top ? `<button class="pri" ${fix(top.u)} style="margin-top:8px">▶ Chữa chỗ mất band nhiều nhất<small style="display:block;font-weight:400;opacity:.9">${esc(lab(top.u))}</small></button>`
    : unsure[0] ? `<button class="pri" ${fix(unsure[0].u)} style="margin-top:8px">▶ Làm thêm để biết chắc<small style="display:block;font-weight:400;opacity:.9">${esc(lab(unsure[0].u))} · ${esc(unsure[0].v)}</small></button>`
    : `<button class="pri" data-mapex="ielts" style="margin-top:8px">▶ ${has ? 'Luyện tiếp IELTS' : 'Làm đề thử / luyện IELTS để tìm chỗ yếu'}</button>`;
  const row = w => `<button class="urow" ${fix(w.u)}><span>${esc(lab(w.u))}<small class="why">${esc(w.v)}${w.p ? ` · ≈ +${w.p} band nếu đạt` : ''}</small></span><span class="tag bad">chữa ›</span></button>`;
  return `<h2>🌏 IELTS${goal ? ' 🎯' : ''} <span class="mute" style="font-size:15px;font-weight:400">· theo dạng câu và tiêu chí chấm</span></h2>
    <div class="box"><div class="row"><b>🎯 Việc cần chữa</b><span class="mute">${sure.length} chỗ yếu</span></div>${main}
      ${top || unsure.length ? '<button class="link" data-mapex="ielts" style="margin:2px 0 6px">hoặc ▶ Luyện tiếp IELTS (không cần đợi chữa xong)</button>' : `<p class="mute" style="margin:6px 0 0">${has ? `Chưa thấy chỗ yếu chắc chắn: các dạng ≥ ${IE_TY_OK}%, tiêu chí đạt band mục tiêu ${bandTxt(o.target)}.` : 'Chưa có dữ liệu. Làm 1 đề thử hoặc vài bài luyện: app tự tìm dạng câu làm mất điểm.'}</p>`}
      ${sure.slice(0, 5).map(row).join('')}${sure.length > 5 ? `<details class="lvmore"><summary>Xem thêm ${sure.length - 5} chỗ yếu ›</summary>${sure.slice(5).map(row).join('')}</details>` : ''}
      ${unsure.length ? `<p class="mute" style="margin:8px 0 0;font-size:13px">🟨 ${unsure.length} chỗ có thể yếu nhưng chưa đủ dữ liệu (dạng câu: ≥ ${IE_TY_N} câu ở ≥ 2 bài; Viết / Nói: AI chấm hoặc ≥ 2 bài máy chấm).</p>` : ''}</div>
    <p class="mleg mute">${Object.keys(IM_ST).map(k => `<span><i class="${k}"></i>${IM_ST[k]} ${cnt[k]}</span>`).join('')}</p>
    <div class="mgrid">${cells.map(([k, cs]) => `<div class="xrow"><span class="ml">${IM_SK[k]}<small>${k === 'W' || k === 'S' ? 'tiêu chí' : 'dạng câu'}</small></span><span class="xc">${cs.map(c => `<button class="xchip ${c.s}" ${fix(c.u)}>${esc(imShort(c.u))}${c.v ? `<b>${esc(c.v)}</b>` : ''}</button>`).join('')}</span></div>`).join('')}</div>
    <p class="mute" style="font-size:13px;margin:4px 0 10px">Bấm một ô để luyện đúng dạng / tiêu chí đó (bài mới cùng dạng; Viết / Nói: xem cách nâng tiêu chí rồi làm 1 bài).</p>
    <details class="box more"><summary><b>Thêm</b> <span class="mute">· đang chữa, hàng chờ, tạm gác, kết quả theo dạng, cách tính</span></summary>${imBox()}${(t => t ? `<details class="box"><summary>📊 Kết quả theo dạng câu / tiêu chí</summary>${t}</details>` : '')(typeof ieTyBox === 'function' ? ieTyBox() : '')}</details>`; }

// ---------- ô 🗺 Bản đồ band ở màn Học IELTS ----------
function imBox() { const f = imFocus(), hasData = Object.keys(ieSt().ty || {}).length || (ieSt().cr || []).length;
  const row = w => `<div style="margin:8px 0;border-top:1px solid var(--line);padding-top:6px"><div class="row"><b>${IE_TY[w.u] ? IM_SK[w.sk].split(' ')[0] + ' ' : ''}${esc(w.t)}</b><span class="mute">${esc(w.v)}</span></div>
    <p class="mute" style="margin:2px 0">thử ${w.tr}/${IM_TRY} · đạt liền ${w.pd}/2${w.r ? ` · quay lại lần ${w.r}` : ''}${IE_TY[w.u] ? (typeof TH_APP === 'undefined' || TH_APP.has(w.u) || w.u === 'R-para' ? ` · còn ${imFreshN(w.u)} bài mới` : ' · chữa bằng đề thật') : ''}${w.sure ? '' : ' · bằng chứng chưa chắc'}</p>
    <button class="pri" data-im="fix|${w.u}" style="margin-top:4px">▶ Chữa</button></div>`;
  return `<div class="box"><div class="row"><b>🗺 Bản đồ band</b><span class="mute">🎯 ${f.act.length}/${IM_ACT} · ⏳ ${f.queue.length} · ✅ ${f.done}</span></div>
    ${!hasData ? '<p class="mute" style="margin:6px 0 0">Chưa có dữ liệu theo dạng câu / tiêu chí. Làm 1 đề thử hoặc vài bài luyện: app tự tìm chỗ làm mất điểm nhiều nhất.</p>'
      : f.act.length ? `<p class="mute" style="margin:6px 0 0">Chữa tối đa ${IM_ACT} chỗ, mỗi kỹ năng 1. Mỗi lần thử phải là bài mới cùng dạng. Đạt 2 lượt liền ở 2 ngày khác nhau (sau ngày trượt gần nhất) là xong.</p>${f.act.map(row).join('')}`
      : (n => n ? `<p class="mute" style="margin:6px 0 0">Có ${n} chỗ có thể yếu nhưng chưa đủ dữ liệu (dạng câu: ≥ ${IE_TY_N} câu ở ≥ 2 bài; Viết / Nói: AI chấm hoặc ≥ 2 bài máy chấm). Làm thêm rồi app mới đưa vào chữa.</p>`
        : '<p class="mute" style="margin:6px 0 0">Chưa thấy chỗ yếu: các dạng đều ≥ 75% và tiêu chí đạt band mục tiêu. Làm thêm đề thử để chắc.</p>')(imWeak().filter(w => !w.sure).length)}
    ${f.queue.length ? `<details style="margin:6px 0"><summary>⏳ Hàng chờ: <b>${f.queue.length}</b> chỗ</summary>${f.queue.slice(0, 8).map(w => `<p style="margin:2px 0;font-size:15px">${IE_TY[w.u] ? IM_SK[w.sk].split(' ')[0] + ' ' : ''}${esc(w.t)} <span class="mute">· ${esc(w.v)}</span></p>`).join('')}</details>` : ''}
    ${f.park.length ? `<details style="margin:6px 0"><summary>⏸ Tạm gác: <b>${f.park.length}</b> chỗ</summary>${f.park.map(w => `<p style="margin:2px 0;font-size:15px">${esc(w.t)} <span class="mute">· quay lại ${new Date(w.at + IM_PARK_D * DAY).toLocaleDateString('vi-VN')}</span></p>`).join('')}</details>` : ''}
    ${f.root.length ? `<div style="margin:8px 0"><b>🧱 Kẹt lâu, cần học nền CEFR: ${f.root.length} chỗ</b><p class="mute" style="margin:2px 0">Đã gác, quay lại vẫn kẹt: thường do thiếu từ / ngữ pháp, luyện thêm dạng câu không giúp. Học nền ở 📚 Học → 🧱 Nền tiếng Anh (🗺 các chỗ hay sai), xong bấm "Đã học nền" để thử lại.</p>
      <button data-iecefr="${ieBase(ieSt().target)}">🧱 Học nền CEFR ${LVN[ieBase(ieSt().target)]}</button>${f.root.map(w => `<button data-im="rl|${w.u}" style="margin:3px 0">✅ Đã học nền: ${esc(w.t)}</button>`).join('')}</div>` : ''}
    <p class="mute" style="margin:6px 0 0">Ngưỡng (75%, 3 chỗ, 3 lần thử, 14 ngày gác) là ước đoán, sẽ chỉnh theo dữ liệu thật.</p></div>`; }
document.addEventListener('click', e => { const b = e.target.closest('[data-im]'); if (!b || !S) return; const v = b.dataset.im, i = v.indexOf('|'), a = i < 0 ? v : v.slice(0, i), u = v.slice(i + 1);
  if (a === 'fix') { scrollTo(0, 0); return imFix(u); }
  if (a === 'rl') { fcRelease(ieSt().fo, u); S.t = Date.now(); save(); return document.getElementById('bdo') ? mapView() : ieltsView(); } });
