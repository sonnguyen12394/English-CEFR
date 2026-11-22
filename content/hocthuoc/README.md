# Bài học thuộc TOEIC (bản mẫu)

- `baiN.in.json`: đầu vào (câu của đề, mã giọng, câu hỏi đề), dựng bằng `tools/hocthuoc/prep.mjs` (bài 3–12) / `prep2.mjs` (bài 13+, danh sách `dot1.json`). Chạy ở gốc repo.
- `baiN.js`: bài đã soạn (thợ Sonnet theo khuôn bài 2, thợ Opus soát). Kiểm khuôn: `node tools/hocthuoc/check.mjs content/hocthuoc/baiN.js`.
- Bản mẫu Artifact "Học thuộc rồi nói lại": `tools/hocthuoc/build.py` ghép `base.html` + các bài (đường dẫn trong script là thư mục scratchpad của phiên soạn, cần sửa khi chạy lại).
- Danh sách và tiêu chí chọn bài: `docs/BAI-HOC-THUOC.md`. Chỉ Đề 1–8 (nội dung app tự soạn); Đề 9–16 (ETS) không lưu ở đây.
- Nội dung Claude soạn, chưa giáo viên kiểm.
