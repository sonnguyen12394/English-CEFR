# Contract: khuôn tệp

## Phiếu giải mù (chữ thường, UTF-8)
```
ĐỀ THỬ TOEIC — de3 — PHẦN NGHE (câu 1–100)
Bạn là thí sinh giỏi. Mỗi câu chọn MỘT chữ cái. …(hướng dẫn trả lời JSON)…

PART 1 — chọn câu tả đúng tranh
[1] Tranh (trong nhà): khối nâu 80×58 ở giữa dưới; 🧑‍💼 (person: office worker) giữa, cỡ lớn; 🎤 (microphone) giữa-phải…
(A) A man is giving a speech.
(B) …
PART 2 — chọn lời đáp hợp nhất
[7] Woman: When is the new employee orientation?
(A) … (B) … (C) …
PART 3 — hội thoại
[32–34] Man: … / Woman: … / Woman 2: …
[32] Where does the conversation most likely take place?
(A) … (B) … (C) … (D) …
(Bảng: tiêu đề | cột … ) khi bài có bảng
PART 4 — bài nói (Speaker: woman / man / không rõ)
…
```
Phần Đọc: PART 5 câu điền, PART 6 đoạn có {1}…{4} và câu hỏi theo từng chỗ, PART 7 văn bản (tiêu đề + nội dung) rồi câu hỏi.

## Câu trả lời giải mù (JSON, phiên phụ viết ra)
```json
{ "de": "de3", "phan": "nghe", "cau": [ { "n": 1, "chon": "A", "chac": 3, "hai": null, "ghi": "" } ] }
```
- `chon`: A–D (Part 2: A–C); `chac`: 1–3; `hai`: chữ cái khác cũng đúng được, hoặc null; `ghi`: ≤ 25 chữ, chỉ khi thấy câu / bài có vấn đề (2 đáp án, sai sự thật, tiếng Anh lạ, tranh không rõ…).

## `content/toeic/kiem-ok.json`, `content/toeic/giai-mu/deN.json`
Xem data-model.md.
