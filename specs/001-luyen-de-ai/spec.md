# Đặc tả tính năng: 🎯 Luyện đề do AI soạn và chấm

**Nhánh**: `claude/ecstatic-curie-q9g1ja`

**Ngày tạo**: 2026-11-07

**Trạng thái**: Bản nháp

**Yêu cầu gốc**: "Tôi muốn thêm 1 mục luyện đề theo mục tiêu để kế bên mục học. Ở mục này thì AI sẽ tạo bài để làm rồi chấm điểm."

**Người sáng lập đã chọn (7/11/2026)**: AI soạn MỌI đề · tab thứ 5 cạnh 📚 Học, bỏ 🎓 Luyện thi khỏi 📚 Học · kỳ thi theo mục tiêu · không giới hạn lượt AI cho mỗi người.

**Luật đo**: KHÔNG đổi. Luyện đề không tính 📘 Học / 🔁 Nhớ / Thi chuyển cấp (như luyện thi từ v68).

## Kịch bản người dùng và kiểm thử *(bắt buộc)*

### Kịch bản 1: Làm một đề Đọc / Nghe do AI soạn (Ưu tiên: P1)

Người học có mục tiêu IELTS 6.5 mở tab 🎯 Luyện đề. Màn hiện kỳ thi mục tiêu và các kỹ năng. Họ chọn 📰 Đọc, chọn một dạng câu (hoặc "dạng bất kỳ"), bấm "▶ Tạo đề mới". Sau vài giây AI soạn xong một bài đọc mới kèm câu hỏi đúng dạng của kỳ thi. Người học làm bài, nộp, thấy điểm, đáp án đúng, lời giải thích từng câu và câu trong bài chứa đáp án.

**Vì sao ưu tiên này**: đây là lõi của yêu cầu ("AI tạo bài rồi chấm"). Đọc / Nghe chấm bằng máy theo đáp án nên rẻ và nhanh nhất.

**Kiểm độc lập**: đặt mục tiêu IELTS, mở tab, tạo 1 đề Đọc, làm hết câu, nộp, thấy điểm và lời giải.

**Kịch bản chấp nhận**:

1. **Cho** mục tiêu là IELTS Academic, **khi** người học bấm "Tạo đề mới" ở 📰 Đọc, **thì** trong ≤ 120 giây (đề dự trữ: ngay) có một bài đọc tiếng Anh mới và 6–8 câu đúng dạng đề IELTS Đọc; trong lúc chờ, người học rời màn được, quay lại vẫn thấy đề.
2. **Cho** đề đã hiện, **khi** người học nộp bài, **thì** thấy số câu đúng / tổng, band ước (ghi rõ "ước tính, chưa đối chiếu đề thật"), đáp án + giải thích từng câu.
3. **Cho** AI trả về đề hỏng (thiếu đáp án, đáp án không có trong bài, câu trùng), **khi** máy kiểm, **thì** đề bị loại và tự soạn lại một lần; vẫn hỏng thì báo "Chưa tạo được đề, thử lại".
4. **Cho** mục tiêu TOEIC, **khi** tạo đề Đọc, **thì** câu theo dạng Part 5 / 6 / 7, điểm ước theo thang TOEIC.
5. **Cho** mục tiêu Cambridge (hoặc 📈 Giỏi lên), **khi** tạo đề, **thì** đề theo phần của bài thi Cambridge ở cấp mục tiêu (Giỏi lên: cấp đang học).

---

### Kịch bản 2: Làm đề Viết / Nói do AI soạn và AI chấm (Ưu tiên: P2)

Người học chọn ✍️ Viết, bấm "Tạo đề mới". AI ra một đề Viết đúng dạng (vd. IELTS Task 2, TOEIC không có Viết thì không hiện). Người học viết, nộp. AI chấm theo thang của kỳ thi (band IELTS 4 tiêu chí / thang Cambridge), chỉ ra tối đa vài lỗi chính, gợi ý sửa. Lỗi tự vào 📒 Sổ lỗi như AI chấm hiện có. Nói: AI ra câu hỏi / thẻ, người học nói (máy chép lời), AI chấm bản chép.

**Vì sao ưu tiên này**: Viết / Nói là chỗ người học khó tự chấm nhất, AI chấm đã có sẵn ở app.

**Kiểm độc lập**: tạo đề Viết, nộp một bài, thấy điểm theo tiêu chí.

**Kịch bản chấp nhận**:

1. **Cho** mục tiêu IELTS, **khi** tạo đề Viết, **thì** đề ghi rõ Task 1 hoặc Task 2, số từ tối thiểu, thời gian gợi ý.
2. **Cho** bài đã nộp, **khi** AI chấm xong, **thì** thấy band từng tiêu chí + band chung + lỗi chính, ghi "AI chấm, chưa giáo viên kiểm".
3. **Cho** máy không chép được lời nói, **khi** mở 🗣 Nói, **thì** báo rõ và cho gõ câu trả lời thay.
4. **Cho** mục tiêu TOEIC (L&R), **thì** không có ô Viết / Nói.

---

### Kịch bản 3: Đề Nghe do AI soạn (Ưu tiên: P2)

AI soạn lời bài nghe (hội thoại / bài nói) + câu hỏi. App đọc lời bằng giọng máy của thiết bị (không có giọng tự nhiên dựng sẵn như kho cũ). Người học nghe theo số lần của kỳ thi, trả lời, nộp, xem lời bài nghe sau khi nộp.

**Kiểm độc lập**: tạo 1 đề Nghe, bấm nghe, nộp, thấy điểm và lời bài.

**Kịch bản chấp nhận**:

1. **Cho** đề Nghe hội thoại 2 người, **khi** phát, **thì** 2 người có 2 giọng khác nhau (nếu máy có).
2. **Cho** chưa nộp bài, **thì** lời bài nghe không hiện.

---

### Kịch bản 4: Tab mới thay chỗ 🎓 Luyện thi trong 📚 Học (Ưu tiên: P1)

Thanh dưới có 5 mục: 🧭 Lộ trình · 📚 Học · 🎯 Luyện đề · 🔍 Tra cứu · 👤 Tôi. Mọi nội dung luyện thi đang ở 📚 Học (thẻ "Luyện {kỳ thi}", màn IELTS / TOEIC / Cambridge, bài học dạng đề, bài tập kho, thi thử, đề thật) chuyển sang tab 🎯 Luyện đề. 📚 Học chỉ còn Nền tiếng Anh. Việc "Luyện IELTS…" ở 📅 Hôm nay mở vào tab mới.

**Kiểm độc lập**: mở 📚 Học không còn thẻ luyện thi; tab 🎯 Luyện đề có đủ các màn cũ + phần đề AI.

**Kịch bản chấp nhận**:

1. **Cho** người học bấm việc luyện đề ở Hôm nay, **thì** tab 🎯 Luyện đề sáng và mở đúng bài.
2. **Cho** chưa đặt mục tiêu, **khi** mở tab, **thì** màn mời đặt mục tiêu ở 🧭 Lộ trình (1 nút) và vẫn xem được Cambridge theo cấp đang học.
3. **Cho** khổ iPhone SE (320 px), **thì** 5 mục thanh dưới nằm trên 1 hàng, vùng bấm ≥ 44 px, không tràn ngang.

---

### Kịch bản 5: Xem lại đề đã làm (Ưu tiên: P3)

Đề AI soạn và kết quả được lưu. Người học xem danh sách đề đã làm (ngày, kỹ năng, điểm) và mở lại xem lời giải. Kết quả theo dạng câu / tiêu chí đưa vào 🗺 bản đồ band / điểm của kỳ thi như bài tập luyện thi hiện có.

**Kịch bản chấp nhận**:

1. **Cho** đã làm 3 đề, **thì** danh sách hiện 3 dòng, mới nhất trên cùng.
2. **Cho** đề Đọc IELTS dạng TRUE / FALSE / NOT GIVEN làm sai nhiều, **thì** ô dạng đó trên bản đồ band ghi nhận kết quả (nguồn "AI").

### Trường hợp biên

- Mất mạng hoặc chức năng AI trên máy chủ lỗi / hết tiền: báo bằng lời thường, vẫn dùng được bài kho cũ trong tab.
- AI soạn đề dính nội dung nhạy cảm hoặc chép đề thật: lời nhắc soạn đề cấm chép đề chính thức; máy kiểm không thấy được việc chép nên ghi nhãn "AI soạn, chưa giáo viên kiểm".
- Đề có câu nhiều đáp án đúng: máy không bắt được hết; mỗi câu có nút ⚑ "Câu sai" (góp ý loại `sai` hiện có) để báo.
- Người học bỏ dở đề: đề giữ lại để làm tiếp trong 24 giờ.
- Người học bấm "Tạo đề mới" liên tục: không giới hạn theo người (người sáng lập chọn), nhưng trần chung cả app ở FR-012.
- Bài Viết quá dài (> 6.000 ký tự): báo như AI chấm hiện có.

## Yêu cầu *(bắt buộc)*

### Yêu cầu chức năng

- **FR-001**: Thanh dưới PHẢI có 5 mục, 🎯 Luyện đề đứng ngay sau 📚 Học.
- **FR-002**: Tab PHẢI theo kỳ thi của mục tiêu ở 🧭 Lộ trình: IELTS (Academic / General Training), TOEIC L&R, Cambridge ở cấp mục tiêu; mục tiêu 📈 Giỏi lên → Cambridge ở cấp đang học. Vẫn xem được kỳ thi khác ở mục "Kỳ thi khác" gập.
- **FR-003**: Với mỗi kỹ năng của kỳ thi, người học PHẢI tạo được một đề mới do AI soạn, chọn dạng câu / phần cụ thể hoặc "bất kỳ".
- **FR-004**: Đề AI soạn PHẢI theo đúng dạng, độ dài, số câu, mức khó của kỳ thi và cấp / band mục tiêu.
- **FR-005**: Trước khi hiện, đề PHẢI qua máy kiểm: đủ đáp án, đáp án nằm trong danh sách lựa chọn, câu điền từ có đáp án xuất hiện trong bài (Đọc) / lời nghe (Nghe), không trùng câu, đúng số từ giới hạn; hỏng thì soạn lại 1 lần.
- **FR-006**: Câu Đọc / Nghe / Ngữ pháp / Từ PHẢI chấm bằng máy theo đáp án AI đưa kèm; kết quả hiện ngay, có giải thích từng câu.
- **FR-007**: Bài Viết / Nói PHẢI do AI chấm theo thang của kỳ thi (band IELTS / thang Cambridge) với điểm từng tiêu chí; lỗi chính vào 📒 Sổ lỗi.
- **FR-008**: Đề Nghe PHẢI phát bằng giọng máy của thiết bị, tách giọng theo người nói khi máy có nhiều giọng.
- **FR-009**: Mọi nội dung luyện thi đang ở 📚 Học PHẢI chuyển sang tab mới; 📚 Học chỉ còn Nền tiếng Anh. Lối tắt ở Hôm nay, 🗺 Chỗ yếu, 👤 Tôi trỏ sang tab mới.
- **FR-010**: Kết quả đề AI PHẢI lưu cùng dữ liệu học của người học (đề, câu trả lời, điểm, ngày) và đưa vào bản đồ band / điểm của kỳ thi với nguồn "AI"; KHÔNG tính luật đo CEFR.
- **FR-011**: Mọi đề / lời chấm AI PHẢI ghi nhãn "AI soạn / AI chấm, chưa giáo viên kiểm"; điểm ước ghi "ước tính".
- **FR-012**: Không giới hạn số lượt AI cho mỗi người (người sáng lập chọn). Giữ một trần an toàn cho CẢ app: 200 lượt AI / ngày (soạn đề + chấm, tính chung với AI chấm hiện có); chạm trần thì báo "App đã dùng hết lượt AI hôm nay", bài kho cũ vẫn dùng được (người sáng lập chọn 7/11/2026, vì mọi máy đang dùng chung một tài khoản).
- **FR-013**: Lời nhắc soạn đề PHẢI cấm chép đề chính thức của Cambridge / IELTS / ETS và cấm nội dung nhạy cảm.
- **FR-014**: Lỗi mạng / máy chủ PHẢI báo bằng lời thường và không làm mất bài đang làm dở.

### Thực thể chính

- **Đề AI**: kỳ thi, cấp / band, kỹ năng, dạng câu / phần, bài đọc hoặc lời nghe (theo người nói), danh sách câu (câu hỏi, lựa chọn, đáp án, giải thích, câu chứa đáp án), ngày tạo.
- **Lượt làm đề AI**: đề, câu trả lời, điểm theo câu, điểm ước (band / điểm), thời gian làm, đã nộp chưa.
- **Lượt chấm AI**: bài Viết / bản chép Nói, điểm tiêu chí, lỗi chính, lời góp ý.

## Tiêu chí thành công *(bắt buộc)*

### Kết quả đo được

- **SC-001**: Đề AI đầu tiên của một kỹ năng hiện trong ≤ 120 giây ở ≥ 90% lần thử; từ đề thứ hai trở đi (đề dự trữ) ≤ 3 giây. (Sửa từ "≤ 30 giây" sau khi đo giới hạn máy chủ và tốc độ AI, xem research.md R4–R5.)
- **SC-002**: ≥ 95% đề hiện cho người học qua máy kiểm lần đầu hoặc lần soạn lại.
- **SC-003**: Trong 20 đề mẫu giáo viên / người sáng lập soát, ≤ 1 câu / đề có đáp án sai hoặc nhiều đáp án đúng (mốc dừng: vượt thì tạm tắt loại đề đó, đổi cách soạn).
- **SC-004**: Từ mở tab tới bắt đầu làm đề ≤ 3 lần chạm.
- **SC-005**: 📚 Học không còn mục luyện thi nào; mọi lối luyện thi cũ vẫn mở được trong tab mới (test tự động kiểm).
- **SC-006**: Chi phí AI mỗi đề được ghi lại để người sáng lập xem tổng tiền / ngày ở 🛠 công cụ.
- **SC-007** (sau 1 quý): có ≥ 3 người học thật làm ≥ 5 đề AI; nếu dưới mức này, xét lại tính năng trước khi mở rộng.

## Giả định

- Dùng chung khoá AI và cơ chế gọi AI qua máy chủ đang có (chấm Viết / Nói); người sáng lập trả tiền theo lượt.
- Đề Nghe dùng giọng máy của thiết bị, chất lượng thấp hơn giọng tự nhiên của kho cũ; chấp nhận được cho luyện tập.
- Đề Đọc / Nghe không có tranh / bản đồ / biểu đồ trong đợt này (dạng cần hình như IELTS Nghe bản đồ, TOEIC Part 1, Starters / Movers tranh → dùng bài kho cũ). Task 1 IELTS: AI mô tả số liệu dạng bảng chữ.
- Kho bài cũ (~800 bài) vẫn giữ trong tab mới làm "bài có sẵn"; không xoá.
- TOEIC chỉ L&R nên không có Viết / Nói.
- Màn và nút mới theo luật thiết kế của dự án; chỉ kiểm sơ bộ trên Chromium khổ iPhone, ghi "chưa kiểm trên iPhone".
- Ngoài phạm vi: AI soạn đề thi thử cả bài (40 câu, nhiều phần) trong đợt này; chỉ đề theo kỹ năng / dạng.
