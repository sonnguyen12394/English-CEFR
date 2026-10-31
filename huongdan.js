// 📘 Luật và cách dùng (v96, 31/10/2026, người sáng lập: "gom lại 1 chỗ luật và cách dùng thôi").
// MỘT chỗ duy nhất: 👤 Của tôi → 📘 Luật và cách dùng (không rải ❓ khắp nơi). Số liệu lấy thẳng từ hằng số trong mã (GATE_MEM, MEM_R, MAP_ACT…),
// đổi luật trong mã thì chữ ở đây đổi theo; test C14 kiểm. Chỉ giải thích, không đổi luật đo.
let HD_Q = '';
const hdDays = a => a.join(' → ') + ' ngày';
// [mã, tiêu đề, nội dung HTML]; nội dung là hàm: đọc hằng số lúc mở (tệp này nạp sau cùng)
const HD = [
  ['batdau', '🚀 Bắt đầu trong 5 phút', () => `
    <p>1. Mở tab <b>🎯 Học</b>. Người mới: bấm <b>🧭 Kiểm tra xếp cấp</b> (5–10 phút) để biết nên học từ cấp nào. Kết quả chỉ là gợi ý.</p>
    <p>2. Mỗi ngày làm theo ô <b>📅 Hôm nay</b>, từ trên xuống: ôn mục đến hạn → học 1 bài mới → luyện 1 bài kỹ năng.</p>
    <p>3. Chọn mục tiêu phút mỗi ngày (10, 15, 30 hoặc 45). Đều đặn quan trọng hơn học dồn.</p>
    <p>4. Khi một phần đủ điều kiện, nút <b>🚪 Thi chuyển cấp</b> mở ở thẻ phần đó. Qua đủ các phần của cấp là đạt cấp.</p>
    <p>5. Gặp từ lạ: chạm vào từ trong bài, hoặc tìm ở tab <b>📖 Tra cứu</b>. Bấm 📌 để lưu vào Sổ từ.</p>`],
  ['tab', '🧭 4 tab dùng làm gì', () => `
    <p><b>🎯 Học</b>: ô Hôm nay, 7 phần (Từ vựng, Phát âm, Ngữ pháp, Nghe, Nói, Đọc, Viết) theo cấp, Thư viện đọc. Đây là chỗ học chính và chỗ duy nhất tính 📘 Học / 🔁 Nhớ / Thi chuyển cấp.</p>
    <p><b>🎓 Luyện thi</b>: 🎓 Cambridge (đề thử theo khuôn Starters → Proficiency, dạng đề thật), 🌏 IELTS, 💼 TOEIC. Chuyển kỳ thi bằng nút ở đầu màn. Luyện ở đây <b>không tính</b> vào luật đo của 🎯 Học.</p>
    <p><b>📖 Tra cứu</b>: tìm từ, ngữ pháp, lỗi hay gặp, phát âm, cụm từ; 📘 Cẩm nang thi (mẹo theo kỹ năng). Gõ tiếng Anh hoặc tiếng Việt.</p>
    <p><b>👤 Của tôi</b>: tiến độ, 🗺 bản đồ chỗ yếu, 📌 sổ từ, 📒 sổ lỗi, kết quả thi thật, 💾 dữ liệu và tài khoản, góp ý, và trang này.</p>`],
  ['cap', '🪜 Cấp và phần', () => `
    <p>Cấp: Pre-A1 → A1 → A2 → A2+ → B1 → B1+ → B2 → B2+ → C1 → C2. Cấp "+" là nửa khó hơn của cấp đó.</p>
    <p>Mỗi cấp có các phần (không phải cấp nào cũng đủ 7 phần; Nói, Viết bắt đầu từ A1). Mỗi phần có 3 mục tiêu riêng: <b>📘 Học</b>, <b>🔁 Nhớ</b>, <b>🚪 Thi chuyển cấp</b>.</p>
    <p><b>Đạt cấp</b> khi mọi phần của cấp đó đã qua Thi chuyển cấp. Mỗi phần lên cấp riêng: Ngữ pháp có thể ở B1 khi Từ vựng còn ở A2.</p>
    <p>Cấp sau xem trước và học trước được, không khoá cứng.</p>`],
  ['hoc', '📘 Học: tính thế nào', () => `
    <p>📘 Học = phần trăm bài của <b>cấp đang học</b> đã học xong. Chỉ tính bài của cấp này, không tính cấp trước.</p>
    <p>Học xong một bài = làm hết lượt học của bài đó. Từ vựng có ⚡ kiểm tra đầu bài: từ nào chọn đúng nghĩa và tự gõ đúng thì được tính đã học luôn, khỏi học lại.</p>
    <p>Cần 📘 Học ${GATE_LEARN}% mới mở Thi chuyển cấp.</p>`],
  ['nho', '🔁 Nhớ: tính thế nào', () => `
    <p>Mỗi bài có nhiều <b>mặt</b> cần nhớ. Ví dụ một từ: nghĩa, nghe ra, viết đúng chính tả, nói… Mỗi mặt được đo riêng.</p>
    <p>Máy ước <b>khả năng nhớ</b> của từng mặt, dựa trên số lần bạn trả lời đúng / sai và khoảng cách giữa các lần. Một mặt tính là <b>nhớ</b> khi khả năng nhớ ≥ ${Math.round(MEM_R * 100)}%.</p>
    <p>🔁 Nhớ của phần = phần trăm mặt đang nhớ. Cần <b>mỗi mặt</b> ≥ ${GATE_MEM}% mới mở Thi chuyển cấp.</p>
    <p><b>Dồn cấp</b>: 🔁 Nhớ tính cả các cấp trước (Nhớ A1 = A1 + Pre-A1). Từ B1, Từ vựng tính cấp này + 1 cấp liền trước + 100 từ mẫu cấp cũ hơn (đổi mỗi tuần).</p>
    <p>Lịch ôn nhắc bài sớm hơn một chút (khi khả năng nhớ xuống khoảng 90%) để bạn ôn trước khi quên.</p>`],
  ['thi', '🚪 Thi chuyển cấp', () => `
    <p><b>Mở khi</b>: 📘 Học ${GATE_LEARN}% và mỗi mặt 🔁 Nhớ ≥ ${GATE_MEM}%. Thẻ phần ghi rõ còn thiếu bao nhiêu bài và bao nhiêu mặt nhớ.</p>
    <p><b>Đề</b>: câu mới chưa gặp khi luyện; khoảng 70% cấp mới + 30% các cấp trước.</p>
    <p><b>Ngưỡng đạt</b>: Ngữ pháp ${Math.round(KIT.np.pass * 100)}% · Phát âm ${Math.round(PA_PASS * 100)}% · Đọc, Nghe, Nói ${Math.round(KIT.doc.pass * 100)}% · Viết ${Math.round(KIT.viet.pass * 100)}%.</p>
    <p><b>Từ vựng</b>: thi theo vòng. Pre-A1: vòng 30 câu, đúng ≥ 26 là qua, ≤ 21 là chưa, ở giữa thì làm vòng 2 (cần ≥ 48/60). Từ A1: vòng 40 câu (≥ 34 qua, ≤ 29 chưa, ở giữa cần ≥ 64/80).</p>
    <p><b>Đạt bền</b> (Từ vựng từ A1): qua lần đầu rồi thi lại sau ≥ ${X.RETEST_D} ngày với câu mới. Muốn thi Từ vựng cấp sau (A2, A2+…) cần cấp trước "Đạt bền".</p>
    <p><b>Trượt</b>: không mất gì; luyện tiếp, ${K_RETRY} ngày sau thi lại.</p>`],
  ['vuot', '🚀 Thi vượt cấp', () => `
    <p>Đã biết sẵn? Bấm vào ô cấp chưa tới ở 🎯 Học (hoặc từ kết quả 🧭 xếp cấp) để thi vượt từng phần, không cần đủ 📘 Học / 🔁 Nhớ.</p>
    <p><b>Qua</b>: phần đó đạt mọi cấp ≤ cấp vừa thi; bài chưa học của các cấp đó tính là đã học, sẽ quay lại ôn rải trong ${VC_S.join('–')} ngày.</p>
    <p><b>Trượt</b>: không đổi gì; thi vượt lại sau ${VC_WAIT} ngày.</p>`],
  ['homnay', '📅 Ô Hôm nay', () => `
    <p><b>Phút học</b>: tính khi bạn làm bài (mỗi câu trả lời). Nghỉ quá 3 phút thì khoảng nghỉ không tính.</p>
    <p><b>Chuỗi ngày 🔥</b>: ngày có ≥ ${ACT_DAY_MIN} phút mới vào chuỗi.</p>
    <p><b>Nút ôn chung</b>: gom mọi thứ đến hạn: 📒 sổ lỗi → 📌 sổ từ → bài đến hạn của phần nhiều bài nhất. Bấm "← Thôi" lúc nào cũng được.</p>
    <p><b>Bài mới</b> mở thẳng phần có 📘 Học thấp nhất. <b>Bài kỹ năng</b> do 🗺 bản đồ chỗ yếu chọn (chưa có dữ liệu thì chọn kỹ năng thấp nhất).</p>`],
  ['bando', '🗺 Bản đồ chỗ yếu', () => `
    <p>Gom mọi lần sai / quên (luyện, thi, tra từ) thành <b>chỗ cần chữa</b>. Chỉ đọc dữ liệu, không đổi luật đo.</p>
    <p>Chỉ chữa tối đa <b>${MAP_ACT} chỗ</b> một lúc (Từ vựng ≤ ${MAP_TV_MAX} nếu phần khác cũng có chỗ yếu); còn lại xếp ⏳ hàng chờ. Ô Hôm nay mỗi ngày đưa ${MAP_TODAY} chỗ.</p>
    <p><b>Chữa xong</b> khi làm đúng ở một ngày <b>sau</b> lần sai gần nhất (sai rồi đúng ngay trong ngày chưa tính).</p>
    <p>Mỗi chỗ thử tối đa ${MAP_TRY} ngày; chưa được thì ⏸ tạm gác ${MAP_PARK_D} ngày rồi thử lại. Kẹt lần 2 → 🧱 học lại bài gốc.</p>
    <p>🔎 Quét lại mỗi ${MAP_SCAN_D} ngày để kiểm từ đang nhớ và từ chưa học.</p>`],
  ['so', '📌 Sổ từ · 📒 Sổ lỗi', () => `
    <p><b>📌 Sổ từ</b>: từ bạn lưu khi tra, khi chạm trong bài, từ đề thật. Ôn kiểu thẻ: nhìn từ, nghĩ nghĩa, rồi tự chấm nhớ / chưa nhớ. Nhớ thì giãn ${hdDays(VW_DAYS)}; chưa nhớ thì hỏi lại. Sổ từ không tính vào 🔁 Nhớ.</p>
    <p><b>📒 Sổ lỗi</b>: lỗi AI hoặc giáo viên chỉ ra khi chấm bài Viết / Nói. Ôn bằng cách tự sửa lại câu; đúng thì giãn ${hdDays(ERR_DAYS)}, sai thì ôn lại ngày mai.</p>
    <p>Cả hai nằm ở 👤 Của tôi; việc ôn đến hạn tự vào nút ôn chung ở ô Hôm nay.</p>`],
  ['luyenthi', '🎓 Luyện thi', () => `
    <p><b>🎓 Cambridge</b>: đề thử theo khuôn, thời gian của đề thật; câu bốc ngẫu nhiên từ kho app, không phải đề chính thức. 📝 Đề mẫu chính thức và 🎯 Sẵn sàng thi mở khi ≥ 3 phần của cấp qua Thi chuyển cấp.</p>
    <p><b>🌏 IELTS</b>: band là <b>máy ước</b> (Viết / Nói tối đa 7.0). Muốn chính xác: làm đề thật (sách Cambridge IELTS…) rồi nhập kết quả theo từng câu; app tự hiệu chỉnh band và lập 🗺 bản đồ band theo dạng câu.</p>
    <p><b>💼 TOEIC</b>: điểm ước theo tỉ lệ đúng, <b>không</b> phải bảng quy đổi của ETS. Nhập điểm đề thật để hiệu chỉnh.</p>
    <p>Luyện thi không tính vào 📘 Học / 🔁 Nhớ / Thi chuyển cấp.</p>`],
  ['tin', '🤖 Độ tin cậy', () => `
    <p>Pre-A1 → A2 dựa trên danh sách Cambridge / Oxford. <b>B1 → C2, IELTS, TOEIC, mẹo, lỗi hay gặp</b> do AI soạn, <b>chưa giáo viên kiểm</b>.</p>
    <p>Máy chấm Nói / Viết đo gián tiếp (độ dài, từ đúng cấp, từ nối…), chưa đối chiếu người chấm thật. 🧑‍🏫 AI chấm sát hơn nhưng vẫn là ước lượng.</p>
    <p>Thấy câu sai: bấm 💬 → <b>⚑ Câu sai</b>. Thước đo đáng tin nhất là điểm thi thật.</p>`],
  ['dulieu', '💾 Dữ liệu và tài khoản', () => `
    <p>Tiến độ lưu trên máy và trên máy chủ, tự đồng bộ. Không cần đăng ký: ô 👤 tài khoản ở đầu 💾 Dữ liệu cho biết máy này dùng tài khoản riêng hay tài khoản chung.</p>
    <p>Đổi máy / sợ mất: 👤 Của tôi → 💾 Dữ liệu → tải tệp sao lưu, rồi nhập ở máy kia. Trước mỗi lần nhập, sửa hay đặt tiến độ, máy tự chụp lại bản cũ (giữ 5 bản gần nhất).</p>
    <p>🎚 Đặt tiến độ (trong 💾 Dữ liệu) dùng để học lại hoặc thử; có bản chụp để quay lại.</p>`],
  ['hoi', '❓ Hỏi đáp', () => `
    <p><b>Vì sao 🔁 Nhớ giảm?</b> Khả năng nhớ giảm dần theo thời gian. Mặt quá hạn ôn tụt dưới ${Math.round(MEM_R * 100)}% thì không còn tính nhớ. Ôn bài đến hạn để lấy lại.</p>
    <p><b>Sao chưa mở Thi?</b> Xem dòng "Còn N bài chưa học + M mặt nhớ nữa" ở thẻ phần. Cần đủ cả 📘 Học ${GATE_LEARN}% và mỗi mặt Nhớ ≥ ${GATE_MEM}%.</p>
    <p><b>Đã biết cấp dưới, có phải học lại?</b> Không: dùng 🚀 Thi vượt cấp, hoặc ⚡ kiểm tra đầu bài để bỏ qua từ đã biết.</p>
    <p><b>Làm đề thử có giúp lên cấp?</b> Không tính vào luật đo; dùng để làm quen đề và biết chỗ yếu.</p>
    <p><b>Tra từ đã học có bị trừ?</b> Tra = chưa nhớ chắc: từ đó sẽ được hỏi lại sớm hơn. Không phải phạt, là để ôn đúng chỗ.</p>
    <p><b>Mỗi ngày nên học bao lâu?</b> 15–30 phút đều đặn tốt hơn 2 giờ một lần. Làm theo ô Hôm nay là đủ.</p>
    <p><b>Thiếu luật / thấy sai?</b> Bấm 💬 góp ý.</p>`],
];
const hdFold = s => String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd');
function hdView() { window.CUR = { view: 'luat' }; BACK = null;
  $app.innerHTML = `<div id="bk"></div><div class="row top"><button class="link" data-a="back">← Của tôi</button><span class="uname">📘 Luật và cách dùng</span></div><h1>📘 Luật và cách dùng</h1>
    <input id="hdq" type="search" placeholder="Tìm: nhớ, thi, chuỗi, band…" value="${esc(HD_Q)}" autocomplete="off"><div id="hdl"></div>`;
  const q = document.getElementById('hdq'); q.oninput = () => { HD_Q = q.value; hdList(); }; hdList();
  $app.onclick = e => { if (e.target.closest('[data-a="back"]')) { scrollTo(0, 0); return minhView(); } }; }
function hdList() { const q = hdFold(HD_Q.trim()), el = document.getElementById('hdl'); if (!el) return;
  const rows = HD.map(([id, t, f]) => [id, t, f()]).filter(([, t, h]) => !q || hdFold(t + ' ' + h.replace(/<[^>]+>/g, ' ')).includes(q));
  el.innerHTML = rows.length ? rows.map(([id, t, h]) => `<details class="box" data-hd="${id}"${q ? ' open' : ''}><summary><b>${t}</b></summary>${h}</details>`).join('')
    : '<p class="mute">Không thấy. Thử từ khác, hoặc bấm 💬 hỏi.</p>'; }
document.addEventListener('click', e => { if (S && e.target.closest('[data-hdv]')) { scrollTo(0, 0); hdView(); } });
