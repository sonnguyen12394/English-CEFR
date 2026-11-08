# Quickstart: kiểm một đợt đề mới

1. Dựng và kiểm nội dung: `node tools/build-toeic.mjs`
   - Mong đợi: in "🎓 N đề trọn" và bảng dạng câu từng đề; không dòng lỗi. Có lỗi thì bộ dựng dừng, `toeic.json` không đổi.
2. Dựng giọng cho câu nghe mới: `python3 tools/build-audio.py`
   - Mong đợi: "… cần dựng" giảm về 0 sau khi chạy. Không cài được Kokoro thì ghi lại số câu thiếu giọng (trang dùng giọng máy).
3. Test: `node tools/test/run.mjs` (C66 kiểm 12 đề × 200 câu, câu đề mới không ở kho luyện, `ev` có trong bài, chạy nhanh một đề mới tới kết quả).
4. Chạy thử trên Chromium khổ iPhone SE: 🎯 Luyện đề → TOEIC → 📚 → 🎓 Đề thử trọn → Đề 3 → màn sẵn sàng có khung 200 câu → Bắt đầu (hệ số giờ nhỏ) → Đọc → nộp → kết quả có ô 🎯 Sai ở đâu.
5. Tự soát: đọc lại từng câu của đợt; ghi số câu sửa vào đoạn vN của CLAUDE.md.
6. Phát hành: `node tools/release.mjs`; ghi "chưa kiểm trên iPhone".
7. Mốc dừng sau đợt 1: chờ người sáng lập "tiếp". Khuyên: 1 người học thật làm 1 đề mới + 1 đề ETS trong cùng tuần; lệch > 100 điểm mỗi phần thì sửa độ khó trước khi soạn đợt 2.
