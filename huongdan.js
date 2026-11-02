// 📘 Luật và cách dùng (v96, 31/10/2026, người sáng lập: "gom lại 1 chỗ luật và cách dùng thôi").
// MỘT chỗ duy nhất: 👤 Của tôi → 📘 Luật và cách dùng (không rải ❓ khắp nơi). Số liệu lấy thẳng từ hằng số trong mã (GATE_MEM, MEM_R, MAP_ACT…),
// đổi luật trong mã thì chữ ở đây đổi theo; test C14 kiểm. Chỉ giải thích, không đổi luật đo.
let HD_Q = '';
const hdDays = a => a.join(' → ') + ' ngày';
// [mã, tiêu đề, nội dung HTML]; nội dung là hàm: đọc hằng số lúc mở (tệp này nạp sau cùng)
const HD = [
  ['batdau', '🚀 Bắt đầu trong 5 phút', () => `
    <p>1. Lần đầu mở app: trả lời <b>3 câu</b>, mỗi màn một câu: học để làm gì (giỏi lên, IELTS, TOEIC, Cambridge) → trình độ (kiểm tra nhanh 5 phút hoặc "mới bắt đầu") → mỗi ngày bao nhiêu phút.</p>
    <p>2. Mỗi ngày mở app là vào <b>🧭 Lộ trình → Hôm nay</b>: vòng tròn số phút, danh sách việc (✓ xong, ▶ việc kế tiếp). Chỉ cần bấm <b>▶ Học tiếp</b>; xong một việc, quay lại bấm tiếp.</p>
    <p>3. Bấm ô <b>🎯 mục tiêu</b> ở cuối màn Hôm nay để xem đường tới mục tiêu: các cấp, ước tính thời gian, mỗi ngày chia nền / luyện đề, 10 ngày này.</p>
    <p>4. Muốn tự chọn bài: tab <b>📚 Học</b> (🧱 Nền tiếng Anh: 7 kỹ năng; 🎓 Luyện thi: Cambridge, IELTS, TOEIC). Mỗi kỹ năng: 📘 Học bài mới, 🏋️ Luyện tập, 🚪 bài thi lên cấp.</p>
    <p>5. Gặp từ lạ: chạm vào từ trong bài, hoặc tìm ở tab <b>🔍 Tra cứu</b>. Bấm 📌 để lưu vào Sổ từ.</p>`],
  ['tab', '🧭 4 tab dùng làm gì', () => `
    <p><b>🧭 Lộ trình</b> (mở đầu tiên): màn <b>Hôm nay</b> (vòng phút, ▶ Học tiếp, việc hôm nay: chỗ duy nhất bảo "làm gì") và màn <b>Đường tới mục tiêu</b> (cấp, ước tính, chia nền / đề, đợt ${LT_D} ngày, đo trình độ, đổi mục tiêu). Chạy từ mục tiêu → tìm chỗ yếu → chữa → bài mới, tới khi đạt.</p>
    <p><b>📚 Học</b>: kho bài, 2 mục ở đầu: <b>🧱 Nền tiếng Anh</b> (7 kỹ năng theo cấp CEFR: Từ vựng, Phát âm, Ngữ pháp, Nghe, Nói, Đọc, Viết; Thư viện đọc) là gốc, chỗ duy nhất tính 📘 Học / 🔁 Nhớ / Thi chuyển cấp · <b>🎓 Luyện thi</b> (bên trong chọn 🎓 Cambridge, 🌏 IELTS hoặc 💼 TOEIC; mở được tất cả). Kỳ thi của mục tiêu có dấu 🎯. 📚 Học <b>chỉ chứa nội dung</b>; mục tiêu, ngày thi, giờ học, kế hoạch và việc hôm nay đều ở 🧭 Lộ trình. Luyện đề không tính vào luật đo nền.</p>
    <p><b>🔍 Tra cứu</b>: tìm từ, ngữ pháp, lỗi hay gặp, phát âm, cụm từ; 📘 Cẩm nang thi (mẹo theo kỹ năng). Gõ tiếng Anh hoặc tiếng Việt.</p>
    <p><b>👤 Tôi</b>: tiến độ, 🗺 bản đồ chỗ yếu, 📌 sổ từ, 📒 sổ lỗi, kết quả thi thật, 💾 dữ liệu và tài khoản, góp ý, và trang này.</p>`],
  ['cap', '🪜 Cấp và phần', () => `
    <p>Cấp: Pre-A1 → A1 → A2 → A2+ → B1 → B1+ → B2 → B2+ → C1 → C2. Cấp "+" là nửa khó hơn của cấp đó.</p>
    <p>Mỗi cấp có các phần (Phát âm có Pre-A1 → C2; B1 → C2 là các cặp âm khó hơn: tr / ch, -ed, ng / nk…). Mỗi phần có 3 mục tiêu riêng: <b>📘 Học</b>, <b>🔁 Nhớ</b>, <b>🚪 Thi chuyển cấp</b>.</p>
    <p><b>Hoàn thành cấp trong app</b> khi mọi phần <b>bắt buộc</b> của cấp đã qua Thi chuyển cấp. Bắt buộc: 📚 Từ vựng, 🧱 Ngữ pháp, 📰 Đọc, 🎧 Nghe; ✍️ Viết phần câu (🧩 xếp câu, 🔗 nối câu: máy chấm chắc); 👄 Phát âm phần nghe (máy đã tải bộ chấm âm thì cả phần đọc); 🗣 Nói khi máy chép được lời (mở bằng Safari). Chỉ để <b>tham khảo</b> (vẫn nên luyện, không chặn): bài viết dài (✅ đủ ý, 📝 đúng dạng), từ B1 bài nói một mạch, và 🗣 Nói trên máy không chép được lời.</p>
    <p><b>Hoàn thành trong app chưa phải bằng CEFR.</b> Đề trong app lấy từ kho bài của app. Chữ <b>"đạt A1, A2…"</b> chỉ dùng khi bạn làm <b>📝 đề mẫu chính thức</b> của Cambridge (📚 Học → 🎓 Luyện thi → Cambridge) và đúng đủ ngưỡng. Kết quả hiện ở 👤 Tôi.</p>
    <p>Mỗi phần lên cấp riêng: Ngữ pháp có thể ở B1 khi Từ vựng còn ở A2.</p>
    <p>Cấp sau xem trước và học trước được, không khoá cứng.</p>`],
  ['cachhoc', '🪜 Cách học từng phần (theo bậc)', () => `
    <p>Mỗi phần đi từ dễ đến khó theo <b>bậc</b>. Bạn không cần tự chọn bậc: màn Hôm nay và ▶ Luyện theo bậc tự chọn. Bước làm quen (ghi "luyện, không tính") không tính 🔁 Nhớ.</p>
    <p><b>📚 Từ vựng (${VSTAGE.length} bậc)</b>: ${VSTAGE.map(s => s[0]).join(' → ')}. Bài học ngày đầu chỉ hỏi bậc 1 (nghĩa, nghe, chọn đúng chữ). Luyện tập chỉ hỏi bậc trên khi bậc 1 của từ đã vững. Sai câu tự gõ thì làm lại bằng dạng dễ hơn (🧩 xếp chữ cái, chọn từ điền câu), đúng rồi tự gõ lại.</p>
    <p><b>🧱 Ngữ pháp</b>: ${esc(KIT.np.how)}</p>
    <p><b>👄 Phát âm</b>: nghe phân biệt cặp âm (ship / sheep) → đọc từ có âm đó (cần bộ chấm âm). Máy chưa tải bộ chấm âm thì chỉ tính phần nghe. Luyện thêm (không tính): 👂 nghe đuôi từ (-s, -ed, phụ âm cuối người Việt hay nuốt), 🎵 nghe trọng âm. Đọc sai âm nào thì có mẹo đặt miệng cho âm đó. Câu đọc to (Nói, Đọc to) có thể 👄 chấm âm cả câu khi máy đã tải bộ chấm âm: thử nghiệm, chưa tính.</p>
    <h3 style="margin:10px 0 4px">4 kỹ năng</h3>
    <p><b>🎧 Nghe</b>: ${esc(KIT.nghe.how)}</p>
    <p><b>🗣 Nói</b>: ${esc(KIT.noi.how)}</p>
    <p><b>📰 Đọc</b>: ${esc(KIT.doc.how)}</p>
    <p><b>✍️ Viết</b>: ${esc(KIT.viet.how)}</p>
    <p class="mute">Thứ tự bậc theo nghiên cứu dạy ngôn ngữ (Nation: từ vựng; Field: nghe; Graham & Perin: viết). Cách chia cụ thể do Claude đề xuất, người sáng lập duyệt 31/10/2026, chưa đo trên người học thật.</p>`],
  ['hoc', '📘 Học: tính thế nào', () => `
    <p>📘 Học = phần trăm bài của <b>cấp đang học</b> đã học xong. Chỉ tính bài của cấp này, không tính cấp trước.</p>
    <p>Học xong một bài = làm hết lượt học của bài đó. Từ vựng có ⚡ kiểm tra đầu bài: từ nào chọn đúng nghĩa và tự gõ đúng thì được tính đã học luôn, khỏi học lại.</p>
    <p>Cần 📘 Học ${GATE_LEARN}% (không cần 100%) mới mở Thi chuyển cấp. Bài còn lại vẫn nên học; đề thi có thể hỏi cả từ / bài chưa học.</p>`],
  ['nho', '🔁 Nhớ: tính thế nào', () => `
    <p>Mỗi bài có nhiều <b>mặt</b> cần nhớ. Ví dụ một từ: nghĩa, nghe ra, viết đúng chính tả, nói… Mỗi mặt được đo riêng.</p>
    <p>Máy ước <b>khả năng nhớ</b> của từng mặt, dựa trên số lần bạn trả lời đúng / sai và khoảng cách giữa các lần. Một mặt tính là <b>nhớ</b> khi khả năng nhớ ≥ ${Math.round(MEM_R * 100)}%.</p>
    <p>🔁 Nhớ của phần = mặt thấp nhất. Cần <b>mỗi mặt</b> ≥ ${GATE_MEM}% mới mở Thi chuyển cấp.</p>
    <p><b>Từ vựng: hiểu và tự dùng.</b> Ai cũng hiểu được nhiều từ hơn số từ tự dùng được. Vì vậy các mặt tự tạo ra (💭 nghĩa → nhớ ra từ, ✍️ chính tả, 🧩 tự điền từ vào câu) chỉ đòi ở từ cấp ≤ ${LVN[VPROD_MAX]} (≈ 1.900 từ thông dụng nhất). Từ B1 trở lên chỉ cần hiểu, cộng các yêu cầu chiều sâu của cấp (cụm từ, dạng từ, đồng nghĩa: giống bài thi thật). Câu gõ trong Thi Từ vựng cũng chỉ hỏi từ thông dụng.</p>
    <p><b>🗣 Nói ra từ</b> do máy nghe chấm: chỉ để tham khảo, không chặn thi.</p>
    <p><b>📰 Đọc, 🎧 Nghe: đo trên bài mới.</b> 💡 Ý chính và 🔍 chi tiết chỉ tính khi làm bài chưa gặp, hoặc gặp lần cuối ≥ ${K_FRESH_D} ngày trước (làm lại bài vừa gặp là nhớ đáp án, không phải kỹ năng). Mặt này = tỉ lệ câu đúng ở các lần làm mới (tính cả cấp trước), không giảm theo ngày. ✍️ Chép lại vẫn tính khi ôn bài cũ. <b>📖🗣 Đọc to</b> = tỉ lệ đoạn đọc to đạt (máy chép ra ≥ ${Math.round(K_TO * 100)}% từ) ở lần đọc gần nhất của mỗi bài: đọc lại vẫn tính; chỉ tính khi máy chép được lời.</p>
    <p><b>Dồn cấp</b>: 🔁 Nhớ tính cả các cấp trước (Nhớ A1 = A1 + Pre-A1). Từ B1, Từ vựng tính cấp này + 1 cấp liền trước + 100 từ mẫu cấp cũ hơn (đổi mỗi tuần).</p>
    <p>Lịch ôn nhắc bài sớm hơn một chút (khi khả năng nhớ xuống khoảng 90%) để bạn ôn trước khi quên.</p>`],
  ['thi', '🚪 Thi chuyển cấp', () => `
    <p><b>Mở khi</b>: 📘 Học ${GATE_LEARN}% và mỗi mặt 🔁 Nhớ ≥ ${GATE_MEM}%. Thẻ phần ghi rõ còn thiếu bao nhiêu bài và bao nhiêu mặt nhớ.</p>
    <p><b>Giữ mở ${GATE_HOLD_D} ngày</b>: khả năng nhớ dao động theo ngày. Cổng đã mở thì giữ mở ${GATE_HOLD_D} ngày dù Nhớ tụt xuống dưới ${GATE_MEM}%, để bạn không phải chạy theo con số. Nên ôn bài đến hạn trước khi thi.</p>
    <p><b>Đề</b>: câu mới chưa gặp khi luyện; khoảng 70% cấp mới + 30% các cấp trước.</p>
    <p><b>Ngưỡng qua</b> chia 2 bậc. Kiến thức từng mục: Từ vựng 85% · Ngữ pháp ${Math.round(KIT.np.pass * 100)}% · Phát âm ${Math.round(PA_PASS * 100)}%. Kỹ năng tổng hợp: Đọc ${Math.round(KIT.doc.pass * 100)}% · Nghe ${Math.round(KIT.nghe.pass * 100)}% · Nói ${Math.round(KIT.noi.pass * 100)}% · Viết ${Math.round(KIT.viet.pass * 100)}% (gần ngưỡng đạt của đề Cambridge).</p>
    <p><b>Từ vựng</b>: thi theo vòng. Pre-A1: vòng 30 câu, đúng ≥ 26 là qua, ≤ 21 là chưa, ở giữa thì làm vòng 2 (cần ≥ 48/60). Từ A1: vòng 40 câu (≥ 34 qua, ≤ 29 chưa, ở giữa cần ≥ 64/80).</p>
    <p><b>Nhớ bền</b> (Từ vựng từ A1): qua lần đầu rồi thi lại sau ≥ ${X.RETEST_D} ngày với câu mới. Muốn thi Từ vựng cấp sau (A2, A2+…) cần cấp trước "Nhớ bền".</p>
    <p><b>Trượt</b>: không mất gì; luyện tiếp, ${K_RETRY} ngày sau thi lại.</p>`],
  ['vuot', '🚀 Thi vượt cấp', () => `
    <p>Đã biết sẵn? Bấm vào ô cấp chưa tới ở 📚 Học (hoặc từ kết quả 🧭 xếp cấp) để thi vượt từng phần, không cần đủ 📘 Học / 🔁 Nhớ.</p>
    <p><b>Qua</b>: phần đó hoàn thành mọi cấp ≤ cấp vừa thi (trong app); bài chưa học của các cấp đó tính là đã học, sẽ quay lại ôn rải trong ${VC_S.join('–')} ngày.</p>
    <p><b>Trượt</b>: không đổi gì; thi vượt lại sau ${VC_WAIT} ngày.</p>`],
  ['homnay', '📅 Ô Hôm nay', () => `
    <p><b>Phút học</b>: tính khi bạn làm bài (mỗi câu trả lời). Nghỉ quá 3 phút thì khoảng nghỉ không tính.</p>
    <p><b>Chuỗi ngày 🔥</b>: ngày có ≥ ${ACT_DAY_MIN} phút mới vào chuỗi.</p>
    <p><b>Nút ôn chung</b>: gom mọi thứ đến hạn: 📒 sổ lỗi → 📌 sổ từ → bài đến hạn của phần nhiều bài nhất. Bấm "← Thôi" lúc nào cũng được.</p>
    <p><b>Bài mới</b> mở thẳng phần có 📘 Học thấp nhất. <b>Bài kỹ năng</b> do 🗺 bản đồ chỗ yếu chọn (chưa có dữ liệu thì chọn kỹ năng thấp nhất).</p>
    <p>Màn <b>Hôm nay</b> ở <b>🧭 Lộ trình</b> là <b>chỗ duy nhất</b> bảo hôm nay làm gì (bấm ▶ Học tiếp). Chữa lỗi tối đa ${typeof LT_FIX !== 'undefined' ? Math.round(LT_FIX * 100) : 40}% số phút mục tiêu; đủ thì app nhắc chuyển sang bài mới. Ngày ${typeof LT_D !== 'undefined' ? LT_D : 10} của đợt có 📝 kiểm tra cuối đợt. Mục tiêu là kỳ thi thì có việc 🎓 luyện đề, đủ số phút theo tỉ lệ ⚖️ nền / đề là xong; nền đã chiếm phần nhỏ thì bỏ bớt việc nền trùng (luyện kỹ năng, bài mới).</p>`],
  ['bando', '🗺 Bản đồ chỗ yếu', () => `
    <p>Gom mọi lần sai / quên (luyện, thi, tra từ) thành <b>chỗ cần chữa</b>. Chỉ đọc dữ liệu, không đổi luật đo.</p>
    <p>Màn bản đồ là <b>một danh sách 🎯 Việc cần chữa</b>, gốc trước: 🌱 🧭 chỗ hổng nền (bài xếp cấp phát hiện), bài Đọc / Nghe yếu do thiếu từ, 🧱 học lại bài gốc; rồi nhóm đang chữa. Nút ▶ Chữa tiếp luôn làm việc đầu danh sách. 🔎 Độ phủ là một ô riêng; hàng chờ, tạm gác, cân bằng kỹ năng gập trong "Xem thêm".</p>
    <p><b>🧭 Xếp cấp khác 🔎 kiểm tra tìm điểm yếu.</b> Xếp cấp hỏi rộng, mỗi từ / điểm ngữ pháp chỉ 1 câu: tin được ở mức <b>cấp</b>, không tin được ở <b>từng mục</b> (có thể đoán, bấm nhầm). Nên câu sai ở cấp bạn nắm vững được hỏi thêm ${typeof PL_CF_N !== 'undefined' ? PL_CF_N : 2} câu dạng khác; sai thêm ≥ 1 câu mới là sai thật. Mục chưa học → 🧭 chỗ hổng nền (không tính 📘 Học); mục đã học → chấm như luyện tập, bản đồ tự thấy. Hết hổng khi làm đúng ở một ngày sau lần sai gần nhất. Câu xác nhận không đổi cấp xếp được.</p>
    <p>Chỉ chữa tối đa <b>${MAP_ACT} chỗ</b> một lúc (Từ vựng ≤ ${MAP_TV_MAX} nếu phần khác cũng có chỗ yếu); còn lại xếp ⏳ hàng chờ. Ô Hôm nay mỗi ngày đưa ${MAP_TODAY} chỗ.</p>
    <p><b>Chữa xong</b> khi làm đúng ở một ngày <b>sau</b> lần sai gần nhất (sai rồi đúng ngay trong ngày chưa tính). Mọi bản đồ (CEFR, IELTS, TOEIC) dùng chung nguyên tắc này. Riêng dạng câu IELTS / TOEIC đo bằng tỉ lệ đúng của một lượt 4–8 câu, dễ trúng may, nên cần đạt 2 ngày liền.</p>
    <p>Mỗi chỗ thử tối đa ${MAP_TRY} ngày; chưa được thì ⏸ tạm gác ${MAP_PARK_D} ngày rồi thử lại. Kẹt lần 2 → 🧱 học lại bài gốc.</p>
    <p>🔎 Quét lại mỗi ${MAP_SCAN_D} ngày để kiểm từ đang nhớ và từ chưa học.</p>`],
  ['so', '📌 Sổ từ · 📒 Sổ lỗi', () => `
    <p><b>📌 Sổ từ</b>: từ bạn lưu khi tra, khi chạm trong bài, từ đề thật. Ôn kiểu thẻ: nhìn từ, nghĩ nghĩa, rồi tự chấm nhớ / chưa nhớ. Nhớ thì giãn ${hdDays(VW_DAYS)}; chưa nhớ thì hỏi lại. Sổ từ không tính vào 🔁 Nhớ.</p>
    <p><b>📒 Sổ lỗi</b>: lỗi AI hoặc giáo viên chỉ ra khi chấm bài Viết / Nói. Ôn bằng cách tự sửa lại câu; đúng thì giãn ${hdDays(ERR_DAYS)}, sai thì ôn lại ngày mai.</p>
    <p>Cả hai nằm ở 👤 Tôi; việc ôn đến hạn tự vào việc "Ôn bài cũ" ở màn Hôm nay.</p>`],
  ['luyenthi', '🎯 Mục tiêu thi: Cambridge, IELTS, TOEIC', () => `
    <p>Mọi kỳ thi đều mở được ở mục 🎓 Luyện thi của 📚 Học; mục tiêu (đổi ở 🧭 Lộ trình → ô 🎯 → ✏️ Đổi mục tiêu) được đánh dấu 🎯 và quyết việc luyện đề hằng ngày. Phút luyện đề chỉ tính khi luyện đúng kỳ thi của mục tiêu. <b>⚖️ Chia thời gian nền / đề</b> theo khoảng cách giữa nền đang có và nền kỳ thi cần (IELTS: 6.5 cần B2+; TOEIC: theo bảng ETS): thiếu ≥ 2 cấp → 100% nền (luyện đề chưa có ích); thiếu ≥ 1 cấp → 70% nền / 30% đề; thiếu &lt; 1 cấp → 30 / 70; đủ nền → 10 / 90. Đây là ý kiến của app, chưa có nghiên cứu xác nhận.</p>
    <p><b>🎓 Cambridge</b>: đề thử theo khuôn, thời gian của đề thật; câu bốc ngẫu nhiên từ kho app, không phải đề chính thức. 📝 Đề mẫu chính thức (chỗ duy nhất app ghi "đạt" một cấp) và 🎯 Sẵn sàng thi mở khi ≥ 3 phần của cấp qua Thi chuyển cấp.</p>
    <p><b>🌏 IELTS</b>: band là <b>máy ước</b> (Viết / Nói tối đa 7.0). Muốn chính xác: làm đề thật (sách Cambridge IELTS…) rồi nhập kết quả theo từng câu; app tự hiệu chỉnh band và lập 🗺 bản đồ band theo dạng câu.</p>
    <p><b>💼 TOEIC</b>: điểm ước theo tỉ lệ đúng, <b>không</b> phải bảng quy đổi của ETS. Nhập điểm đề thật để hiệu chỉnh.</p>
    <p>Luyện thi không tính vào 📘 Học / 🔁 Nhớ / Thi chuyển cấp.</p>`],
  ['tin', '🤖 Độ tin cậy', () => `
    <p>Pre-A1 → A2 dựa trên danh sách Cambridge / Oxford. <b>B1 → C2, IELTS, TOEIC, mẹo, lỗi hay gặp</b> do AI soạn, <b>chưa giáo viên kiểm</b>.</p>
    <p>Máy chấm chắc khi có đáp án biết trước: xếp câu, nối câu, nghe phân biệt, câu nói / đọc to so với câu mẫu (máy chép lời). Máy chấm gián tiếp (chưa đối chiếu người chấm thật): bài viết dài, bài nói một mạch (độ dài, ý, từ nối), điểm âm của bộ chấm âm. Phần chấm gián tiếp chỉ để tham khảo; 🧑‍🏫 AI chấm sát hơn nhưng vẫn là ước lượng.</p>
    <p>Thấy câu sai: bấm 💬 → <b>⚑ Câu sai</b>. Thước đo đáng tin nhất là điểm thi thật.</p>
    <p>Nhờ giáo viên kiểm nội dung mới: gửi trang <a href="docs/kiem-noi-dung.html" target="_blank" rel="noopener">📋 Bảng kiểm nội dung</a> (tích đúng / sai từng mục, chép kết quả gửi lại). Kiểm bộ chấm âm: 👄 Phát âm → 🏋️ Luyện → 🧑‍🏫 Đối chiếu giáo viên (cần ≥ ${PA_VAL_N} lần, chấm oan ≤ ${PA_VAL_FR * 100}%, bỏ sót ≤ ${PA_VAL_MISS * 100}%).</p>`],
  ['dulieu', '💾 Dữ liệu và tài khoản', () => `
    <p>Tiến độ lưu trên máy và trên máy chủ, tự đồng bộ. Không cần đăng ký: ô 👤 tài khoản ở đầu 💾 Dữ liệu cho biết máy này dùng tài khoản riêng hay tài khoản chung.</p>
    <p>Đổi máy / sợ mất: 👤 Tôi → 💾 Dữ liệu → tải tệp sao lưu, rồi nhập ở máy kia. Trước mỗi lần nhập, sửa hay đặt tiến độ, máy tự chụp lại bản cũ (giữ 5 bản gần nhất).</p>
    <p>🎚 Đặt tiến độ (trong 💾 Dữ liệu) dùng để học lại hoặc thử; có bản chụp để quay lại.</p>`],
  ['lotrinh', () => `🧭 Lộ trình: mục tiêu, xếp cấp, đợt ${LT_D} ngày`, () => `
    <p><b>Chu trình</b>: 🎯 mục tiêu → 🧭 xếp cấp → 📆 đợt ${LT_D} ngày → 📝 kiểm tra nhẹ cuối đợt → 📊 tổng kết → đợt sau.</p>
    <p><b>🧭 Xếp cấp</b> chỉ chọn chỗ bắt đầu, <b>không</b> trao hoàn thành cấp. Hoàn thành cấp chỉ do 🚪 Thi chuyển cấp hoặc 🚀 thi vượt. Xếp cấp lại khi: đã ${LT_RE_D} ngày, vừa hoàn thành một cấp, có phần trượt thi vượt, hoặc chưa xếp lần nào. Còn ≤ ${LT_EXAM_D} ngày tới ngày thi và chỉ còn cách mục tiêu ≤ 1 cấp thì làm 📝 đề mẫu chính thức thay xếp cấp.</p>
    <p><b>⏳ Ước thời gian</b>: số giờ học có hướng dẫn Cambridge công bố cho từng cấp (tính từ đầu: A1 ~90–100, A2 ~180–200, B1 ~350–400, B2 ~500–600, C1 ~700–800, C2 ~1.000–1.200 giờ; Pre-A1 và cấp "+" là nội suy) chia cho số phút mỗi ngày. Không kịp ngày đặt thì app báo "khó kịp" và gợi ý cấp vừa sức. Chỉ để tham khảo: tự học có thể nhanh hoặc chậm hơn nhiều.</p>
    <p><b>Vì sao không xếp cấp lại mỗi ${LT_D} ngày?</b> Lên một cấp cần khoảng 200 giờ học (ước của Cambridge). ${LT_D} ngày × 15–30 phút tiến bộ nhỏ hơn sai số của bài 15–30 câu: điểm lên xuống ngẫu nhiên, dễ nản hoặc tin nhầm.</p>
    <p><b>Mỗi ngày</b>: làm theo màn <b>Hôm nay</b> ở 🧭 Lộ trình, bấm ▶ Học tiếp (chỗ duy nhất bảo "làm gì"): ① ôn mục đến hạn → ② chữa chỗ yếu của 🗺 bản đồ, tối đa <b>${Math.round(LT_FIX * 100)}% số phút</b> mục tiêu → ③ bài mới (≥ ${100 - Math.round(LT_FIX * 100)}%). Đặt mục tiêu là bắt đầu đợt 1. Mục tiêu là kỳ thi thì có thêm việc luyện đề theo tỉ lệ ⚖️ nền / đề (xem mục 🎯 Mục tiêu thi). Mọi câu trả lời hằng ngày tự cập nhật bản đồ.</p>
    <p><b>Loại lỗi</b>: A. sai một câu đang làm: báo đúng ngay, làm lại dạng dễ rồi dạng khó, lượt làm lại không chấm. B. chỗ yếu (sai ≥ 2 lần hoặc quên): vào 🗺 bản đồ, chữa xong khi đúng ở một ngày sau. C. lỗi Viết / Nói do AI / giáo viên chỉ: vào 📒 sổ lỗi, tự sửa câu theo lịch ôn.</p>
    <p><b>📝 Kiểm tra cuối đợt</b> (ngày ${LT_D}, ~10 phút): ${LT_MINI} câu kiểu xếp cấp ở cấp đang học + ${LT_MINI} câu cấp kế (chỉ xem xu hướng, không đổi cấp), rồi 🔎 quét lại từ của bản đồ.</p>
    <p><b>📊 Tổng kết đợt</b>: số ngày học, phút, phút chữa lỗi, mục mới, phần mới qua thi. Đợt tốt khi chữa xong ≥ ${Math.round(LT_FIX_OK * 100)}% chỗ yếu đã chọn đầu đợt và học ≥ ${LT_DAYS_OK} ngày.</p>`],
  ['hoi', '❓ Hỏi đáp', () => `
    <p><b>Vì sao 🔁 Nhớ giảm?</b> Khả năng nhớ giảm dần theo thời gian. Mặt quá hạn ôn tụt dưới ${Math.round(MEM_R * 100)}% thì không còn tính nhớ. Ôn bài đến hạn để lấy lại.</p>
    <p><b>Sao chưa mở Thi?</b> Xem dòng "Còn N bài chưa học + M mặt nhớ nữa" ở thẻ phần. Cần đủ cả 📘 Học ${GATE_LEARN}% và mỗi mặt Nhớ ≥ ${GATE_MEM}% (trừ mặt tham khảo). Đã mở rồi thì giữ ${GATE_HOLD_D} ngày.</p>
    <p><b>Hoàn thành cấp trong app có phải đạt CEFR?</b> Chưa. Làm 📝 đề mẫu chính thức ở 📚 Học → 🎓 Luyện thi → 🎓 Cambridge; đủ ngưỡng thì 👤 Tôi ghi "Đạt bằng đề mẫu chính thức".</p>
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
  const rows = HD.map(([id, t, f]) => [id, typeof t === 'function' ? t() : t, f()]).filter(([, t, h]) => !q || hdFold(t + ' ' + h.replace(/<[^>]+>/g, ' ')).includes(q));
  el.innerHTML = rows.length ? rows.map(([id, t, h]) => `<details class="box" data-hd="${id}"${q ? ' open' : ''}><summary><b>${t}</b></summary>${h}</details>`).join('')
    : '<p class="mute">Không thấy. Thử từ khác, hoặc bấm 💬 hỏi.</p>'; }
document.addEventListener('click', e => { if (S && e.target.closest('[data-hdv]')) { scrollTo(0, 0); hdView(); } });
