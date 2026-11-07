# Quickstart: kiểm IELTS đủ dạng

1. `node tools/build-ielts.mjs`: không lỗi; in số bài, phần nghe (10 phần), bài mẫu Task 2 có nhãn.
2. `python -I tools/build-audio.py <thư mục mô hình Kokoro> 4`: dựng giọng phần nghe mới; lần hai "0 cần dựng".
3. `node tools/test/run.mjs`: xanh hết, có C56 "IELTS đủ dạng" (48 dạng có bài học + bài tập đúng dạng; bản đồ chữa Nghe đúng phần; kho tối thiểu; 2 bài đọc dài).
4. Soát Chromium khổ iPhone SE: ✍️ Viết → bài "Task 2: Vấn đề và giải pháp" (nhãn đoạn đúng, làm thử 3 câu) → "Bài tập dạng này" mở đề vấn đề – giải pháp; 🎧 Nghe → Thêm → "Bản đồ, mặt bằng" mở phần có bản đồ; 🗣 Nói → bài "Phát âm" làm thử được. Không lỗi trang, không tràn ngang.
5. iPhone: chưa kiểm (máy soạn không có WebKit) → nhờ người sáng lập thử bước 4.
