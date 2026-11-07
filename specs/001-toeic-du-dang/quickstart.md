# Quickstart: kiểm TOEIC đủ dạng câu

## 1. Dựng kho

```sh
node tools/build-toeic.mjs
```

Kỳ vọng: không lỗi; dòng tóm tắt in số câu theo dạng, mỗi dạng đạt mức tối thiểu FR-010 (vd. "Part 2 wh 27 · yn 11 · or 7 · req 8 · stmt 8").

## 2. Giọng câu nghe mới

```sh
python -I tools/build-audio.py <thư mục mô hình Kokoro> 4
```

Kỳ vọng: "N cần dựng" bằng số câu nghe mới; chạy lần hai "0 cần dựng".

## 3. Test

```sh
node tools/test/run.mjs
```

Kỳ vọng: xanh hết, có C55 "TOEIC đủ dạng câu" (33 dạng có bài học + bài tập; kho tối thiểu; câu chèn Part 6 có phương án cùng chủ đề; câu chèn [1]–[4] giữ thứ tự; bài tập theo dạng chỉ có câu / bài đúng dạng và ghi kết quả như luyện thường).

## 4. Soát tay (Chromium khổ iPhone SE, chỉ sơ bộ)

1. 📚 Học → Xem thêm → 💼 TOEIC → 🎧 Nghe: danh sách 📘 có 15 bài theo thứ tự đề; mở "Part 2: Câu trần thuật": ví dụ là câu trần thuật, làm thử 3 câu trần thuật, xong ghi "đã học".
2. Trong bài đó bấm "🏋️ Bài tập dạng này": 8 câu trần thuật; làm xong danh sách bài tập Part 2 ghi kết quả.
3. 📰 Đọc → Thêm → 🎯 Luyện theo dạng câu → "Chèn câu [1]–[4]": 2 bộ Part 7 có câu chèn, phương án [1]–[4] theo thứ tự.
4. Mở 3 đoạn Part 6 bất kỳ: câu chèn có 4 phương án cùng chủ đề.
5. Không lỗi trang, không tràn ngang.

## 5. iPhone

Máy soạn không có WebKit: ghi "chưa kiểm trên iPhone", nhờ người sáng lập thử bước 4.1–4.3 trên Safari.
