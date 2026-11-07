# Data model: khuôn dạng đề AI theo đề thật

Một dòng = một dạng đề AI người học chọn được (`ky × sk × dang`). Cột "Phần đề thật" hiện ở tên đề (FR-001). "Thứ tự" = câu tới người học theo vị trí câu chứa đáp án (FR-002). Số trong ngoặc là số AI được yêu cầu; máy kiểm nhận trong khoảng.

Nguồn: xem [research.md](research.md). Chỗ ghi *(hiểu biết)* là theo hiểu biết của Claude, chưa tra được nguồn chính thức.

## IELTS (Academic / General Training)

### Đọc: mọi dạng là một bài như đề thật (FR-004)

Bài 700–900 từ, 13 câu (nhận 12–14), 2–3 nhóm dạng, 20 phút. Dạng người học chọn là một nhóm 5–7 câu; AI chọn 1–2 dạng kèm. "Mọi dạng" (`*`) thì AI chọn 2–3 dạng. Có nối tiêu đề hoặc tìm đoạn thì đoạn văn đánh chữ "A." "B." …

| dang | Dạng | Lựa chọn | Giới hạn từ | Thứ tự |
|---|---|---|---|---|
| R-tf | TRUE / FALSE / NOT GIVEN | 3 nhãn cố định | – | ✓ |
| R-yn | YES / NO / NOT GIVEN (bài nghị luận) | 3 nhãn cố định | – | ✓ |
| R-mc | Trắc nghiệm | 4 (A–D) | – | ✓ |
| R-comp | Điền câu | – | NO MORE THAN TWO WORDS (từ trong bài) | ✓ |
| R-sa | Trả lời ngắn | – | NO MORE THAN THREE WORDS AND/OR A NUMBER | ✓ |
| R-h | Nối tiêu đề | danh sách tiêu đề = số đoạn hỏi + 2–3 | – | – |
| R-mi | Tìm đoạn chứa ý | chữ đoạn | – | – |
| R-mf *(mới)* | Nối đặc điểm | 3–5 tên / mốc (A–E), một tên dùng nhiều lần được | – | – |
| R-se *(mới)* | Nối nửa câu | nửa sau = số câu + 2–3 | – | ✓ |
| R-sum *(mới)* | Tóm tắt có khung từ | khung từ = số chỗ trống + 3–5 | từ trong khung | ✓ |
| R-dia *(mới)* | Điền ghi chú / bảng / lưu đồ | – | ONE WORD ONLY hoặc NO MORE THAN TWO WORDS (từ trong bài) | ✓ |
| R-gt (GT) | General Training phần 1: 4–7 văn bản ngắn A–G, tổng 350–600 từ | nhóm R-gt (nối nhận định với văn bản, 6–8) + nhóm R-tf (5–7) | – | R-tf ✓ |

### Nghe: mỗi dạng là một Part (FR-003)

10 câu (nhận 9–10), nghe 1 lần, câu theo thứ tự lời nghe. Người nói tối đa 3 (giọng máy A nữ, B nam, C nữ thứ hai; đề thật Part 3 tới 4 người).

| dang | Part | Người nói, bối cảnh | Nhóm câu | Lời nghe |
|---|---|---|---|---|
| L-form | Part 1 | 2 người, đời thường (đặt chỗ, hỏi thông tin) | điền phiếu / ghi chú / bảng, ONE WORD AND/OR A NUMBER (+ tối đa 4 câu trắc nghiệm A–C) | 450–700 từ *(hiểu biết)* |
| L-match | Part 2 | 1 người (có thể 1 người dẫn), đời thường xã hội | nối 4–6 (danh sách A–G có thừa) + trắc nghiệm A–C 4–6 | 500–750 từ |
| L-mc | Part 3 | 2–3 người, học tập / đào tạo | trắc nghiệm A–C 5–6 + nối 4–5 | 500–750 từ |
| L-note *(mới)* | Part 4 | 1 người, bài giảng | 10 chỗ ghi chú ONE WORD ONLY, ghi dạng câu L-form trên bản đồ | 550–800 từ |
| L-sa | – | đề cũ (không còn cho chọn) | | |

### Viết

| dang | Đề thật | Khuôn AI |
|---|---|---|
| t1 (Academic) | biểu đồ đường / cột / tròn / bảng / quy trình / bản đồ, 150 từ, 20 phút | AI chọn đường / cột / tròn / bảng; số liệu `chart` (loại, tên, đơn vị, 3–8 nhãn, 1–4 dãy số); câu đề "The graph / chart / table below shows…"; app vẽ bằng bộ vẽ sẵn có |
| gt1, t2 | như cũ | như cũ |

### Nói

| dang | Đề thật | Khuôn AI |
|---|---|---|
| p1 | ~3 chủ đề, 4–5 phút | 9–12 câu: chủ đề 1 về nơi ở / công việc / học tập (3–4 câu) + 2 chủ đề (3–4 câu mỗi chủ đề) |
| p2 | thẻ đề + Part 3 | như cũ |

## TOEIC Listening & Reading

| dang | Phần | Khuôn AI |
|---|---|---|
| p2 | Part 2 | như cũ: 8 câu, 3 câu đáp, chỉ nghe |
| p3 | Part 3 | như cũ (1 hội thoại 2–3 người, 3 câu, 4 lựa chọn) + được 1 câu hàm ý "What does the man / woman mean when he / she says, '…'?" (câu trích nguyên văn trong lời nghe) |
| p4 | Part 4 | như cũ + được 1 câu "Why does the speaker say, '…'?" |
| p5, p6 | Part 5, 6 | như cũ |
| p7 | Part 7 | như cũ + được câu chèn câu (bài có đủ [1] [2] [3] [4]; lựa chọn "[1]"…"[4]") hoặc câu ý định (chuỗi tin nhắn có tên + giờ; câu trích nguyên văn) |

## Cambridge (cấp "+" dùng khuôn của cấp gốc)

### Đọc

| Cấp | dang | Phần đề thật | Khuôn AI | Thứ tự |
|---|---|---|---|---|
| Pre-A1 | box *(mới)* | R&W Part 4 | đoạn 50–90 từ, 5 chỗ trống, khung 8 từ (3 thừa) | ✓ |
| A1 | resp *(mới)* | R&W Part 2 | đoạn hội thoại, 5–6 câu, mỗi câu 3 câu đáp A–C | ✓ |
| A1 | story *(mới)* | R&W Part 3 | truyện 80–130 từ, 5 chỗ trống, khung 8 từ | ✓ |
| A1 | cloze | R&W Part 4 | đoạn 80–130 từ, 5 chỗ trống, 3 lựa chọn | ✓ |
| A1 | comp *(mới)* | R&W Part 5 | truyện 150–250 từ, 6–7 câu điền 1–3 từ trong truyện | ✓ |
| A2 | sn *(mới)* | Reading Part 1 | 6 tin ngắn ≤ 40 từ, mỗi tin 1 câu 3 lựa chọn | – |
| A2 | mc | Reading Part 3 | bài 230–300 từ *(hiểu biết)*, 5 câu, 3 lựa chọn | ✓ |
| A2 | cloze | Reading Part 4 | đoạn 90–150 từ, 6 chỗ trống, 3 lựa chọn | ✓ |
| A2 | open | Reading Part 5 | đoạn 80–130 từ, 6 chỗ trống, 1 từ | ✓ |
| B1 | sn *(mới)* | Reading Part 1 | 5 tin ngắn, 3 lựa chọn | – |
| B1 | mc | Reading Part 3 | bài 300–400 từ *(hiểu biết)*, 5 câu, 4 lựa chọn | ✓ |
| B1 | cloze | Reading Part 5 | đoạn 120–170 từ, 6 chỗ trống, 4 lựa chọn | ✓ |
| B1 | open | Reading Part 6 | đoạn 120–170 từ, 6 chỗ trống | ✓ |
| B2 | cloze / open / wf | R&UoE Part 1 / 2 / 3 | đoạn 150–220 từ, **8** chỗ trống (cloze 4 lựa chọn) | ✓ |
| B2 | kwt | R&UoE Part 4 | 6 câu, **2–5 từ** gồm từ khoá *(hiểu biết)* | – |
| B2 | mc | R&UoE Part 5 | bài 550–650 từ *(hiểu biết)*, 6 câu, 4 lựa chọn | ✓ |
| C1 | cloze / open / wf | R&UoE Part 1 / 2 / 3 | đoạn 180–260 từ, **8** chỗ trống | ✓ |
| C1 | kwt | R&UoE Part 4 | 6 câu, **3–6 từ** | – |
| C1 | mc | R&UoE Part 5 | bài 650–800 từ *(hiểu biết)*, 6 câu, 4 lựa chọn | ✓ |
| C2 | cloze / open / wf | R&UoE Part 1 / 2 / 3 | đoạn 180–280 từ, **8** chỗ trống | ✓ |
| C2 | kwt | R&UoE Part 4 | 6 câu, **3–8 từ** | – |
| C2 | mc | R&UoE Part 5 | bài 700–850 từ *(hiểu biết)*, 6 câu, 4 lựa chọn | ✓ |

### Nghe (nghe 2 lần, câu theo thứ tự lời nghe)

| Cấp | dang | Phần đề thật | Khuôn AI |
|---|---|---|---|
| Pre-A1 | name *(mới)* | Listening Part 2 | hội thoại trẻ – người lớn 100–200 từ, 5 câu viết tên (đánh vần từng chữ) / số 1–20 |
| A1 | name *(mới)* | Listening Part 2 | hội thoại 120–220 từ, 5 câu tên / số 1–100 / từ |
| A2 | gap | Listening Part 2 | độc thoại 150–250 từ, **5** chỗ trống (1 từ / số / ngày / giờ) |
| A2 | mc | Listening Part 3 | hội thoại 250–350 từ, 5 câu, 3 lựa chọn |
| B1 | gap | Listening Part 3 | độc thoại 250–350 từ, **6** chỗ trống (1–2 từ / số) |
| B1 | mc | Listening Part 4 | phỏng vấn 400–550 từ, 6 câu, 3 lựa chọn |
| B2 | gap | Listening Part 2 | độc thoại 500–700 từ, **10** câu điền 1–3 từ |
| B2 | mc | Listening Part 4 | phỏng vấn 550–750 từ, **7** câu, 3 lựa chọn |
| C1 | gap | Listening Part 2 | độc thoại 500–700 từ, **8** câu |
| C1 | mc | Listening Part 3 | phỏng vấn 550–750 từ, **6** câu, **4** lựa chọn |
| C2 | gap | Listening Part 2 | độc thoại 550–750 từ, **9** câu |
| C2 | mc | Listening Part 3 | phỏng vấn 550–750 từ, **5** câu, **4** lựa chọn |

### Viết, Nói

- Viết: Pre-A1, A1 **không còn đề AI** (đề thật viết theo tranh); A2 → C2 như cũ.
- Nói phỏng vấn (p1): như cũ mọi cấp.

## Đề AI đã lưu (`de_ai.de`)

- Khuôn mới: `v: 2`, thêm `part` (tên phần đề thật), `task.chart` (Task 1). Khuôn cũ `v: 1` (`task.table`, dạng cũ L-sa, Cambridge Pre-A1 / A1 mc / w) vẫn mở và làm được.
