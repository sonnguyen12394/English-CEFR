# UI contract: bài học và bài tập theo dạng IELTS

## Màn ✍️ Viết (`ieSkView('W')`)

- Danh sách "📘 Dạng bài": Academic 16 bài (Task 1 ×5, nhận kiểu đề, 5 kiểu Task 2, bố cục, 4 tiêu chí); General Training 12 (thư, nhận kiểu đề, 5 kiểu, bố cục, 4 tiêu chí). Tiêu chí yếu trên bản đồ lên đầu, ghi "yếu".
- "Thêm" → "📝 Viết theo Task": 2 nút cũ (Task 1 / Task 2 ngẫu nhiên) + hàng "Task 1 theo loại" (Academic: Xu hướng · Bảng, tròn · Bản đồ · Quy trình · Hai biểu đồ) + hàng "Task 2 theo kiểu" (Đồng ý? · Hai quan điểm · Lợi – hại · Vấn đề – giải pháp · Hai câu hỏi); nút viên `.chips.tap` (≥ 44 px).

## Màn 🎧 Nghe (`ieSkView('L')`)

- "Thêm" → "📝 Luyện theo dạng câu": 6 nút `.big2` (Điền phiếu, bảng · Điền câu, trả lời ngắn · Trắc nghiệm · Chọn HAI · Bản đồ, mặt bằng · Ghép), mỗi nút `data-ielk`.

## Màn 🗣 Nói (`ieSkView('S')`)

- Danh sách "📘 Phần thi": Part 1 · Part 2 · nhóm thẻ Part 2 · Part 3 · kiểu câu hỏi Part 3 · 4 tiêu chí.

## Màn bài học (`xlView`)

- Không đổi khuôn. Bài Task 2 theo kiểu: ví dụ = đề + bài mẫu chia đoạn có nhãn vai trò; làm thử 3 câu "Đoạn này làm nhiệm vụ gì?". Bài tiêu chí: ô "Band thấp" / "Band cao" + vì sao; làm thử 3 câu. "🏋️ Bài tập dạng này" mở đúng dạng (data-model.md).
