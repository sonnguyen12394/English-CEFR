# Quickstart: kiểm nội dung đề TOEIC

1. Dựng như cũ: `node tools/build-toeic.mjs` → cuối có dòng "kiểm nội dung: 0 lỗi · N cảnh báo chưa xem". Có lỗi thì thoát 1, in từng dòng lỗi.
2. Xem chi tiết: `node tools/kiem-toeic.mjs de3` → danh sách câu nghi vấn của Đề 3 (số câu như trong app).
3. Báo cáo cho người sáng lập: `node tools/kiem-toeic.mjs --html` → `docs/kiem-de-toeic.html` (mở trên điện thoại qua GitHub Pages sau khi gộp).
4. Giải mù một đề:
   - `node tools/giai-mu.mjs xuat de3 nghe <scratch>/de3-nghe.txt` và `… doc …`
   - giao mỗi phiếu cho một phiên Claude phụ (Agent), yêu cầu viết `<scratch>/de3-nghe.json` theo contracts/tep.md
   - `node tools/giai-mu.mjs so de3 <scratch>/de3-nghe.json` → "khớp 97/100", danh sách câu lệch.
5. Xử lý: sửa câu trong `content/toeic/...` → dựng lại → câu đã sửa hiện `GM-CU` → xuất phiếu `--cau` các câu đó → giải lại → hết `GM-CU`. Câu đúng mà vẫn bị cảnh báo → thêm mục vào `content/toeic/kiem-ok.json` kèm lý do.
6. Câu nghe đã sửa: `python tools/build-audio.py <km> 4`.
7. Cổng phát hành: `node tools/test/run.mjs` → C69 xanh khi 0 lỗi, 0 cảnh báo chưa xem, mọi đề đã giải mù; bộ câu cài lỗi bị bắt đủ.

Kết quả mong đợi sau đợt sửa đề cũ: Đề 1–6 "0 lỗi · 0 cảnh báo chưa xem · giải mù khớp ≥ 95%, câu lệch đã xử lý hết"; số cảnh báo đã xem ≤ 5 / 100 câu.
