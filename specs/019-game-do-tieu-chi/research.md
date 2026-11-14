# Nghiên cứu: 019

## R1 Đo G3 (nhớ chữ cái) công bằng
- **Quyết định**: Boss tái đấu đổi chỗ phương án ngẫu nhiên 50% câu (A/B); G3 = tỉ lệ đúng câu giữ thứ tự − tỉ lệ đúng câu đổi chỗ, cùng loại trận.
- **Lý do**: so câu chữa (đổi chỗ) với câu Boss (giữ) bị lệch vì câu chữa là câu từng sai.
- **Đã xét**: luôn đổi chỗ mọi nơi (mất số đo G3); so trận khác loại (lệch mẫu).

## R2 Nhật ký gọn
- **Quyết định**: `S.to.tc.lg` = mảng dòng `[ngày, đề, câu, việc, đúng 0/1, đổi chỗ 0/1, giây, mức ôn]`, giữ 2.000 dòng mới nhất; `S.to.tc.ag` số tổng hợp theo tiêu chí giữ mãi; `S.to.tc.tr` trận `[việc, đề, bắt đầu, kết thúc|0]` giữ 300; `S.to.tc.dy` ngày chơi giữ 400.
- **Lý do**: dữ liệu đồng bộ cả khối `S`; đối tượng có tên khoá tốn gấp 3.

## R3 H1 khi Part 5 chỉ có 2 kiểu thử thách
- **Quyết định**: H1 = ≥ 2 thử thách, tối đa 1 ghép nghĩa; hiểu ở mức dạng do Boss ẩn đo.
- **Lý do**: Part 5 từ vựng / giới từ / cấu trúc / đại từ / động từ / lượng từ chỉ có ✍️ tự gõ ngoài ghép nghĩa. Kiểu "chọn lý do" đã xét: lý do nhắc tên từ nên đoán bằng so chữ.

## R4 Thử thách 🔁 diễn đạt lại (Part 7)
- **Quyết định**: hiện câu chứa đáp án `ev` (không hiện câu hỏi), chọn trong 4 phương án (đổi chỗ) câu nói cùng ý. Thứ tự lên 🌳: 🧩 → 🔎 → 🔁 → ✍️ → 🔗; 🔗 chỉ khi thiếu kiểu khác, và ở lần ôn.
- **Lý do**: luyện đúng kỹ năng Part 7 (bài viết một kiểu, đáp án viết kiểu khác), dữ liệu có sẵn ở Đề 3–8.

## R5 Nguồn câu Boss ẩn (Q1: lấy cả đề khác)
- **Quyết định**: thứ tự: kho luyện không nằm trong đề nào → câu của đề chưa từng làm / chơi → đề chơi ít nhất. Loại: đề đang chơi, đề đối chứng, câu đã dùng làm Boss ẩn. Khoá dạng: Part 5 `t`, Part 6 `gt`, Part 7 `qt`.
- **Đo kho (14/11)**: Part 5 kho tự do 138 (voc 71 … det 4), Part 7 kho tự do 45 câu; tính thêm câu Đề 3–8 thì mọi dạng ≥ 3.

## R6 ⭐ tạm
- **Quyết định**: `J.c[n].tm = 1` khi chữa đúng; việc "✅ Xác nhận" (trận ngắn, đổi chỗ) cho câu ⭐ tạm có ngày < hôm nay; đúng → bỏ `tm`; sai → 👾. Câu không có `tm` (dữ liệu cũ, bài làm 📋) là ⭐ thật.

## R7 Đề đối chứng (Q2: người học tự chọn)
- **Quyết định**: `S.to.tc.dc = { de, at, pre, post }`; "trước" = lần làm Phần Đọc / cả đề gần nhất trước lúc bắt đầu chơi game sau khi chọn (lấy từ `S.to.tronA`); "sau" = lần làm sau khi có ≥ 2 đề chinh phục. Đề đã có bài làm khi chọn → cảnh báo, H3 / H4 ghi "kém tin cậy".

## R8 Ngưỡng
Ngưỡng tiêu chí là ý kiến của Claude, chưa có nghiên cứu; xét lại 2/2027.
