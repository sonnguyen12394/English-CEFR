# Plan: Đề thử TOEIC trọn 200 câu

1. Nội dung (`content/toeic/doc.json`): thêm câu thứ 5 cho các bộ 2 / 3 văn bản đang có 3–4 câu; soạn 3 bộ 3 văn bản mới (5 câu, đủ dạng: mục đích, chi tiết, suy luận, NOT, từ gần nghĩa, câu nối văn bản); 1 bộ văn bản đơn. Bộ dựng kiểm như cũ (từ gần nghĩa có trong bài, dấu [1]–[4], câu ý định).
2. `content/toeic/tron.json` → `toeic.json` mục `tron` (2 đề); `build-toeic.mjs` kiểm cơ cấu, không trùng, cân dạng (Part 1 người / cảnh, Part 2 đủ 5 loại câu, Part 5 đủ 8 dạng, Part 3 có 2 bài 3 người).
3. `totron.js` (tệp mới, thêm vào index.html, khu vực TOEIC): màn chọn đề + quy chế · bộ chạy Nghe tự nhịp (`speak` trả Promise khi phát xong; giọng máy dự phòng có `onend` + hạn giờ ước) · bộ chạy Đọc (đơn vị = câu Part 5 / đoạn Part 6 / bộ Part 7; ‹ Trước · Sau ›; 📋 bảng 101–200; ⚑ đánh dấu; nộp) · lưu tiến độ `S.to.tron` mỗi câu · làm tiếp · kết quả + xem lại · hệ số giờ cho test (`TRON.k`).
4. Lối vào: màn TOEIC (phần 📚 Đề có sẵn) dòng "🎓 Đề thử trọn 200 câu · 2 giờ"; ô "Làm tiếp đề thử đang dở" khi có.
5. Test C63 + bước e2e; 📘 Luật; CLAUDE.md v146; README; release bản 144.
