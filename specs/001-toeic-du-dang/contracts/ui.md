# UI contract: bài học và bài tập theo dạng TOEIC

## Màn 🎧 Nghe / 📰 Đọc TOEIC (`toSkView`)

- Danh sách "📘 Dạng câu" (khuôn `xSkill`, không đổi): Nghe 15 bài, Đọc 17 bài, theo thứ tự ở research.md R10. Dạng đang yếu trên bản đồ lên trước như cũ.
- "Thêm" có khối mới **🎯 Luyện theo dạng câu**, chia theo Part:
  - Nghe: Part 1 (Tranh có người · Tranh đồ vật, cảnh) · Part 2 (Câu Wh- · Yes / No · Lựa chọn · Đề nghị, nhờ vả · Câu trần thuật) · Part 3–4 (Câu hỏi chung · Việc sắp làm · Câu hàm ý · Câu có bảng · 3 người nói).
  - Đọc: Part 6 (Chọn từ theo cả đoạn) · Part 7 (Suy luận, câu NOT · Từ gần nghĩa · Chèn câu [1]–[4] · Tin nhắn: ý định). Part 5 theo dạng giữ khối cũ "✏️ Part 5 theo dạng ngữ pháp" (thêm "Từ hạn định, lượng từ").
  - Mỗi nút: `data-todr="<mã>"` (data-model.md), có số câu / bài trong kho; vùng bấm ≥ 44 px.

## Màn bài học (`xlView`)

- Không đổi khuôn. Nút "🏋️ Bài tập dạng này" (`d.go`) mở bài tập đúng dạng: `data-todr="<mã>"`, hoặc nút có sẵn (`data-top`, `data-tospd`, `data-tobt`).

## Lượt bài tập theo dạng (`toDrill(mã, back)`)

- Tiêu đề lượt: "🎯 <tên dạng>" (vd. "🎯 Part 2 · Câu trần thuật").
- Chạy bằng `ieRun` như luyện theo Part: báo đúng / sai từng câu, nghe 2 lần, kết quả ghi `S.to.r` + `toLog`.
- Xong / "← Thôi" về màn kỹ năng đã mở (hoặc bài học nếu mở từ bài học, như nút có sẵn).
- Kho hết bài chưa làm: lấy bài làm lâu nhất, không báo lỗi. Kho rỗng: toast "Chưa có bài.".

## Câu chèn [1]–[4] Part 7

- Phương án luôn theo thứ tự [1] [2] [3] [4] (không xáo).
