# Research: IELTS đủ dạng

Người sáng lập đã trả lời 2 câu (7/11/2026): làm 8 bài tiêu chí chấm; thêm 2 bài đọc dài.

## R1. Bảng 48 dạng

- **Decision**: Nghe 6 nhóm dạng câu (điền phiếu / ghi chú / bảng / lưu đồ; điền câu / trả lời ngắn; trắc nghiệm; chọn HAI; bản đồ / mặt bằng; ghép) · Đọc 16 (đã đủ) · Viết 17 (Task 1 năm loại, thư GT, nhận kiểu đề Task 2, năm kiểu Task 2, bố cục, 4 tiêu chí) · Nói 9 (Part 1–3, nhóm thẻ Part 2, kiểu câu hỏi Part 3, 4 tiêu chí).
- **Rationale**: dạng câu Nghe / Đọc theo danh sách công khai của IDP / British Council; Viết / Nói theo loại đề và 4 tiêu chí của band descriptors công khai; nhóm thẻ Part 2 và kiểu câu hỏi Part 3 theo cách dạy của lớp luyện thi. Hiểu biết của Claude, chưa giáo viên kiểm.
- **Alternatives**: chia Nghe theo Part 1–4 thay vì theo dạng câu (đề thật trộn dạng trong mỗi Part; bản đồ band đã theo dạng câu).

## R2. Bài học Task 2 theo kiểu

- **Decision**: nhãn vai trò từng đoạn (`roles`) ghi tay cho 12 bài mẫu trong `content/ielts/viet.json`; ví dụ = bài mẫu cuối cùng của kiểu, chia đoạn có nhãn; làm thử = 3 câu "Đoạn này làm nhiệm vụ gì?" lấy đoạn của bài mẫu KHÁC cùng kiểu (mỗi kiểu có 2–3 bài), phương án = nhãn vai trò của kiểu đó. Kiểm dựng: số nhãn = số đoạn.
- **Rationale**: bố cục mỗi kiểu khác nhau (lợi / hại, vấn đề / giải pháp, hai câu hỏi); nhãn theo vị trí đoạn sai ở bài 5 đoạn (đoạn 3 có thể là "nhìn mặt kia" hoặc "ý mình").
- **Alternatives**: nhãn suy theo vị trí (sai ở bài 5 đoạn); AI gắn nhãn lúc chạy (tốn tiền, không kiểm được).

## R3. Bài học tiêu chí chấm (8)

- **Decision**: nội dung trong `XL_TXT.crit` (baihoc.js, cùng chỗ nội dung bài học khác, bảng kiểm giáo viên đọc được): mỗi tiêu chí { what, how, trap, ex: { lo, hi, why } (đoạn band thấp ~5 và band cao ~7 cùng ý), mcq: 3 câu "Câu / đoạn nào cao band hơn ở tiêu chí này?" }. Mỗi bài nối ô bản đồ (`u` = W-0…W-3, S-0…S-3) nên dạng yếu lên đầu danh sách. Bài tập dạng này: Viết → một đề Task 2; Nói → một lượt cả bài (mọi đề đều chấm đủ 4 tiêu chí).
- **Rationale**: bản đồ đã báo yếu theo tiêu chí (`IM_TIP` chỉ là 2 câu mẹo); ví dụ band thấp / cao là cách dạy tiêu chí phổ biến.
- **Note**: mô tả band là diễn giải của Claude, không chép band descriptors nguyên văn.

## R4. Nói: nhóm thẻ Part 2, kiểu câu hỏi Part 3

- **Decision**: nhóm thẻ suy từ tiêu đề thẻ (người · nơi chốn · đồ vật / công nghệ · sự kiện / trải nghiệm · hoạt động / kỹ năng · sách, phim, website; `IE_P2CAT`), kiểu câu hỏi Part 3 suy từ câu hỏi (ý kiến · so sánh xưa – nay · dự đoán · nguyên nhân / giải pháp · so sánh hai nhóm; `IE_P3TY`), test bảo đảm mọi thẻ / câu được xếp nhóm. Làm thử = "Thẻ này thuộc nhóm nào?" / "Câu hỏi này thuộc kiểu nào?" dùng thẻ / câu thật.

## R5. Bài tập theo dạng

- **Decision**: Nghe `data-ielk="<dạng>"`: chọn một phần nghe IELTS có dạng đó (chưa làm / làm lâu nhất trước), làm CẢ phần như đề thật, ghi như luyện thường (`ieRun` → `S.ie.r`, `ieTyLog`). Viết `data-iew="t1:<loại,…>"` / `"t2:<kiểu>"`: chọn đề đúng loại / kiểu, đề viết lâu nhất trước. Thêm của Nghe: 6 nút cùng kiểu với Đọc (`.big2`); Thêm của Viết: hàng Task 1 theo loại (Academic) và Task 2 theo kiểu (nút viên `.chips.tap`, vùng bấm 44 px).
- **Rationale**: kết quả lưu theo bài; như TOEIC v139.

## R6. Sửa bản đồ chữa Nghe

- **Decision**: `imFix` với L-map / L-match / L-sa lấy phần nghe từ `imPool(u)` (chỉ bài IELTS có dạng đó), mới trước; L-form / L-mc giữ như cũ (có thêm bài Nghe CEFR khi hết bài IELTS).
- **Rationale**: trước đây chọn theo Part (`ieListen([1])`, `[1, 2]`) nên trả lời ngắn (chỉ ở Part 4) không bao giờ trúng; bản đồ trúng 1 / 2.

## R7. Nội dung mới

- **Phần nghe mặt bằng** (Part 2, một người nói): tòa nhà trung tâm cộng đồng / bảo tàng, 5 câu mặt bằng (chữ A–H, 3 chữ thừa) + 5 câu trắc nghiệm; mặt bằng vẽ bằng `ieMapSvg` (lưới 10 × 10); giọng Kokoro.
- **2 bài đọc dài** 750–900 từ, 13–14 câu, mỗi bài ≥ 3 dạng (vd. tiêu đề + T/F/NG + điền tóm tắt; tìm đoạn + nối đặc điểm + trả lời ngắn); người / nghiên cứu hư cấu.
- **Phát hành**: nhãn v140, bản 139.
