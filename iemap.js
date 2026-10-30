// 🗺 Bản đồ band IELTS (v83, bước 2 + 3; người sáng lập 29/10/2026 chọn làm luôn dù dữ liệu thật còn 0 bài IELTS — các ngưỡng dưới đây là ước đoán, chỉnh lại sau 2 tuần học thật).
// Chỗ yếu = dạng câu (Đọc / Nghe, ielts.js `S.ie.ty`) hoặc tiêu chí chấm (Viết / Nói, `S.ie.cr`), không phải từng bài. Khác CEFR: chữa bằng bài MỚI cùng dạng (làm lại bài cũ = nhớ đáp án).
//   Ưu tiên = band có thể tăng × độ chắc. Đọc / Nghe: tỉ trọng dạng × khoảng thiếu tới 75% × 40 câu / ~4,5 câu mỗi band. Viết / Nói: (band mục tiêu − band tiêu chí) / 4 (band kỹ năng = trung bình 4 tiêu chí).
//     Độ chắc: dạng ≥ 8 câu ở ≥ 2 bài = 1, ít hơn = 0,5; tiêu chí AI chấm = 1, máy ước = 0,5 (AI có thì dùng AI).
//   🎯 Nhóm đang chữa tối đa 3 chỗ, mỗi kỹ năng tối đa 1 (kỹ năng cần vài tuần, không phải vài ngày như một từ). Còn lại ⏳ hàng chờ.
//   Một lần thử = một lượt có ≥ 4 câu của dạng, trên bài chưa gặp trong 30 ngày (luyện hoặc đề thử), hoặc một bài Viết / Nói được chấm; mỗi ngày tính 1.
//   Lượt đạt: dạng ≥ 75%; tiêu chí ≥ band mục tiêu. Chữa xong = đạt 2 lượt liền ở 2 ngày khác nhau (lượt trượt xoá chuỗi đạt).
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
    if (b < tg) out.push({ u, sk: k, t: imName(u), v: `${bandTxt(b)} ${ai.length ? '(🧑‍🏫 AI)' : '(máy ước)'}`, p: imR2((tg - b) / 4 * (ai.length ? 1 : 0.5)), sure: !!ai.length }); }
  return out.sort((a, b) => b.p - a.p); }
// số bài chưa gặp trong 30 ngày cho một dạng (kho nhỏ: hết bài mới thì lượt luyện không tính lần thử)
const imFreshOk = (id, now = Date.now()) => { const r = ieSt().r[id]; return !r || now - r.at >= IM_FRESH_D * DAY; };
function imPool(u) { if (u === 'R-para') return IE && IE.para || []; if (u === 'R-gt') return KIT.doc.items ? KIT.doc.items.filter(x => ['b1', 'b2'].includes(x.lv)) : [];
  if (u[0] === 'R') return IE ? IE.doc : []; if (u === 'L-map' || u === 'L-match') return IE && IE.ln ? IE.ln.filter(x => x.qs.some(q => IE_LTY[q.k] === u)) : [];
  if (u[0] === 'L') { const ln = IE && IE.ln ? IE.ln.filter(x => x.qs.some(q => IE_LTY[q.k] === u)) : []; return [...ln, ...(KIT.nghe.items ? KIT.nghe.items.filter(x => ['b1', 'b2', 'c1', 'c2'].includes(x.lv) && (u === 'L-form' ? ngForm(x) : true)) : [])]; } return []; }
const imFreshN = u => imPool(u).filter(x => imFreshOk(x.id)).length;
// nhóm đang chữa: S.ie.fo = { a: [{ u, at, tr (số ngày đã thử), td, pd (ngày đạt liền nhau), r (lần quay lại) }], p: [{ u, at, r, root }], n: số chỗ chữa xong }
const imFocus = (now = Date.now()) => { const o = ieSt(); return fcFocus(o.fo = o.fo || {}, imWeak, { act: IM_ACT, cap: () => 1, try: IM_TRY, parkD: IM_PARK_D, info: u => ({ u, sk: u[0], t: imName(u), v: 'đã đạt ngưỡng, chờ đủ 2 lượt', p: 0 }) }, now); };
// một lượt của chỗ đang chữa (gọi từ ieTyLog / ieCrLog trong ielts.js)
const imHit = (u, pass, now = Date.now()) => fcHit(ieSt().fo, u, pass, now);

// ---------- ▶ chữa một chỗ ----------
function imTeach(u, go) { const k = u[0], html = IE_TY[u] ? (typeof ieHow === 'function' ? ieHow([IM_HOWK[u]]).replace('<details', '<details open') : '')
    : `<div class="box"><b>${esc(IE_CR[k][+u.slice(2)])}</b>${IM_TIP[k][+u.slice(2)][1].map(s => `<p style="margin:4px 0">• ${esc(s)}</p>`).join('')}</div>`;
  $app.innerHTML = `<div class="row top"><button class="link" data-a="back">← Học IELTS</button><span class="uname">📘 Trước khi thử</span></div><h1>📘 ${esc(imName(u))}</h1>
    <p class="mute">Đọc lại cách làm rồi mới thử: làm thêm mà không đổi cách làm thì dễ sai như cũ.</p>${html}<button class="pri" data-im="go">Thử →</button>`;
  $app.onclick = e => { if (e.target.closest('[data-a="back"]')) return ieltsView(); if (e.target.closest('[data-im="go"]')) { scrollTo(0, 0); go(); } }; }
async function imFix(u) { await Promise.all([ieLoad(), kLoad(KIT.nghe), kLoad(KIT.doc)]); const f = imFocus().act.find(w => w.u === u), d = dayOf(Date.now()), k = u[0];
  if (typeof TH_APP !== 'undefined' && !TH_APP.has(u) && u !== 'R-para') return imTeach(u, () => ieThat(k));   // v87: dạng app chưa có bài → chữa bằng đề thật rồi nhập kết quả
  const run = () => {
    if (u === 'R-para') return ieRun('🗺 ' + IE_TY[u], ieParaQs(10), ieltsView);
    if (k === 'W') return ieWrite('t2');
    if (k === 'S') return ieSpeak(['p1', 'p2', 'p3']);
    if (k === 'L') { const qs = ieListen(u === 'L-form' ? [0, 3] : u === 'L-map' ? [1] : u === 'L-match' ? [2] : [1, 2]).map(it => it.q); return qs.length ? ieRun('🗺 ' + IE_TY[u], qs, ieltsView) : toast('Chưa có bài nghe hợp dạng này.'); }
    const pool = imPool(u), fresh = shuf(pool.filter(x => imFreshOk(x.id))), xs = (fresh.length ? fresh : [...pool].sort((a, b) => (ieSt().r[a.id] || {}).at - (ieSt().r[b.id] || {}).at)).slice(0, 2);
    if (!fresh.length) toast('Hết bài mới cho dạng này: lượt này không tính lần thử (đã gặp bài trong 30 ngày).');
    const qs = u === 'R-gt' ? xs.flatMap(x => kRead(KIT.doc, x, 'ct', false).map(q => Object.assign(q, { ty: 'R-gt' }))) : xs.flatMap(x => ieRQs(x, [u.slice(2)]));
    return ieRun('🗺 ' + IE_TY[u], qs, ieltsView); };
  if (k === 'S' && !SREC) return toast('Phần Nói cần máy chép lời: mở trang bằng Safari trên iPhone.');
  if (k === 'W' || k === 'S' || (f && f.tr >= 1 && f.td !== d)) return imTeach(u, run);   // Viết / Nói: luôn xem cách nâng tiêu chí trước; dạng câu: từ lần thử 2
  run(); }

// ---------- ô 🗺 Bản đồ band ở màn Học IELTS ----------
function imBox() { const f = imFocus(), hasData = Object.keys(ieSt().ty || {}).length || (ieSt().cr || []).length;
  const row = w => `<div style="margin:8px 0;border-top:1px solid var(--line);padding-top:6px"><div class="row"><b>${IM_SK[w.sk].split(' ')[0]} ${esc(w.t)}</b><span class="mute">${esc(w.v)}</span></div>
    <p class="mute" style="margin:2px 0">thử ${w.tr}/${IM_TRY} · đạt liền ${w.pd}/2${w.r ? ` · quay lại lần ${w.r}` : ''}${IE_TY[w.u] ? (typeof TH_APP === 'undefined' || TH_APP.has(w.u) || w.u === 'R-para' ? ` · còn ${imFreshN(w.u)} bài mới` : ' · chữa bằng đề thật') : ''}${w.sure ? '' : ' · bằng chứng chưa chắc'}</p>
    <button class="pri" data-im="fix|${w.u}" style="margin-top:4px">▶ Chữa</button></div>`;
  return `<div class="box"><div class="row"><b>🗺 Bản đồ band</b><span class="mute">🎯 ${f.act.length}/${IM_ACT} · ⏳ ${f.queue.length} · ✅ ${f.done}</span></div>
    ${!hasData ? '<p class="mute" style="margin:6px 0 0">Chưa có dữ liệu theo dạng câu / tiêu chí. Làm 1 đề thử hoặc vài bài luyện: app tự tìm chỗ làm mất điểm nhiều nhất.</p>'
      : f.act.length ? `<p class="mute" style="margin:6px 0 0">Chữa tối đa ${IM_ACT} chỗ, mỗi kỹ năng 1. Mỗi lần thử phải là bài mới cùng dạng. Đạt 2 lượt liền ở 2 ngày khác nhau là xong.</p>${f.act.map(row).join('')}`
      : '<p class="mute" style="margin:6px 0 0">Chưa thấy chỗ yếu: các dạng đều ≥ 75% và tiêu chí đạt band mục tiêu. Làm thêm đề thử để chắc.</p>'}
    ${f.queue.length ? `<details style="margin:6px 0"><summary>⏳ Hàng chờ: <b>${f.queue.length}</b> chỗ</summary>${f.queue.slice(0, 8).map(w => `<p style="margin:2px 0;font-size:15px">${IM_SK[w.sk].split(' ')[0]} ${esc(w.t)} <span class="mute">· ${esc(w.v)}</span></p>`).join('')}</details>` : ''}
    ${f.park.length ? `<details style="margin:6px 0"><summary>⏸ Tạm gác: <b>${f.park.length}</b> chỗ</summary>${f.park.map(w => `<p style="margin:2px 0;font-size:15px">${esc(w.t)} <span class="mute">· quay lại ${new Date(w.at + IM_PARK_D * DAY).toLocaleDateString('vi-VN')}</span></p>`).join('')}</details>` : ''}
    ${f.root.length ? `<div style="margin:8px 0"><b>🧱 Kẹt lâu, cần học nền CEFR: ${f.root.length} chỗ</b><p class="mute" style="margin:2px 0">Đã gác, quay lại vẫn kẹt: thường do thiếu từ / ngữ pháp, luyện thêm dạng câu không giúp. Học nền ở 🎯 Học CEFR (🗺 Bản đồ chỗ yếu), xong bấm "Đã học nền" để thử lại.</p>
      <button data-iecefr="${ieBase(ieSt().target)}">🎯 Học nền CEFR ${LVN[ieBase(ieSt().target)]}</button>${f.root.map(w => `<button data-im="rl|${w.u}" style="margin:3px 0">✅ Đã học nền: ${esc(w.t)}</button>`).join('')}</div>` : ''}
    <p class="mute" style="margin:6px 0 0">Ngưỡng (75%, 3 chỗ, 3 lần thử, 14 ngày gác) là ước đoán, sẽ chỉnh theo dữ liệu thật.</p></div>`; }
document.addEventListener('click', e => { const b = e.target.closest('[data-im]'); if (!b || !S) return; const v = b.dataset.im, i = v.indexOf('|'), a = i < 0 ? v : v.slice(0, i), u = v.slice(i + 1);
  if (a === 'fix') { scrollTo(0, 0); return imFix(u); }
  if (a === 'rl') { fcRelease(ieSt().fo, u); S.t = Date.now(); save(); return ieltsView(); } });
