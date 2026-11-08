# Data Model: Thêm 10 đề thử TOEIC trọn 200 câu

## Tệp nguồn một đề: `content/toeic/tron/deNN.json`

```json
{ "id": "de3", "t": "Đề 3",
  "p1": [Câu Part 1 × 6], "p2": [Câu Part 2 × 25], "p3": [Hội thoại × 13], "p4": [Bài nói × 10],
  "p5": [Câu Part 5 × 30], "p6": [Đoạn × 4], "p7": [Bộ văn bản × 15] }
```

Thứ tự trong mảng = thứ tự trong đề (câu 1 → 200). Mỗi mục cùng khuôn với kho hiện có (`content/toeic/p1.json`, `nghe.json`, `p5.json`, `doc.json`), thêm:

| Trường | Ở đâu | Bắt buộc | Kiểm |
|--------|-------|----------|------|
| `id` | mọi mục | có | dạng `d03-p3-05`; không trùng kho, không trùng đề khác |
| `ev` | câu hỏi Part 3, 4, 7 | có, trừ câu NOT và câu chèn [1]–[4] | có nguyên văn trong lời nghe (Part 3: nối các `lines`; Part 4: `text`) hoặc văn bản Part 7 |
| `x: 1` | câu hỏi Part 7 bộ nhiều văn bản | ≥ 1 câu mỗi bộ | câu phải đối chiếu ≥ 2 văn bản |
| `ty` | bài Part 4 | có | msg / ann / ad / news / intro / tour / meet |
| `t` | câu Part 5; chỗ trống Part 6 (tense) | có (Part 5); ghi tay khi là thì theo ngữ cảnh | như kho |

Nhãn dạng còn lại suy bằng `toqt.js` như kho (Part 1 `k`, Part 2 `ty`, câu hỏi Part 3–4 `ty`, Part 6 `t`, Part 7 `ty`); ghi tay thì thắng.

## Kiểm mỗi đề (bộ dựng dừng khi sai)

- Số câu: Part 1 6 · Part 2 25 · Part 3 39 (13 × 3) · Part 4 30 (10 × 3) · Part 5 30 · Part 6 16 (4 × 4) · Part 7 54.
- Dạng tối thiểu: theo research.md R4 (Part 1 người + cảnh; Part 2 đủ 5 loại; Part 3 2 bài 3 người, 3 bài có bảng ở cuối, ≥ 2 hàm ý; Part 4 2 bài có bảng ở cuối, ≥ 2 hàm ý, ≥ 4 loại bài; Part 5 đủ 8 dạng; Part 6 mỗi đoạn 1 câu chèn, ≥ 1 từ nối, ≥ 1 thì; Part 7 cơ cấu 10 bộ đơn 29 câu + 2 + 3 bộ nhiều văn bản, 2 chuỗi tin nhắn, 2 câu chèn, ≥ 2 từ gần nghĩa, ≥ 1 NOT, mỗi bộ nhiều văn bản ≥ 1 câu `x`).
- Đáp án: Part 1 không chữ nào quá 3 / 6; Part 2 (sau khi xáo theo `id`) không chữ nào quá 11 / 25.
- Mọi kiểm của kho cũ (phương án 4 khác nhau, đáp án nằm trong phương án, bảng có đáp án, từ gần nghĩa có trong bài, dấu [1]–[4], câu ý định trích đúng tin nhắn, phương án câu chèn Part 6 cùng chủ đề).
- Không trùng nguyên văn (chuẩn hoá chữ) với kho và đề khác.

## Tệp dựng: `toeic-tron/deN.json`

`{ id, t, p1…p7 }` cùng khuôn với mục tương ứng trong `toeic.json` (Part 2 đã xáo lời đáp + `lines`; Part 1 có `lines`; nhãn dạng đã suy). Không sửa tay.

## `toeic.json` mục `tron`

```json
[ { "id": "de1", "t": "Đề 1", "p1": ["t1-05", …], … },   // Đề 1–2: mã câu kho (như v147)
  { "id": "de3", "t": "Đề 3", "f": "toeic-tron/de3.json" } ]   // đề mới: chỉ trỏ tệp
```

## Bài làm lần gần nhất (MỚI, US4)

`S.to.tronA[de] = { at, a }`: `a` = chuỗi 200 ký tự, ký tự thứ n là chữ đã chọn ở câu n (A–D, theo thứ tự phương án cố định của đề), "-" = bỏ trống. Ghi khi nộp (cả khi hết giờ tự nộp); làm lại thì thay. ~200 byte / đề, 12 đề ~2,5 KB. Chỉ để xem, không vào luật đo, không ghi bản đồ.

## Trạng thái người học (không đổi khuôn)

- `S.to.tron` (đề đang dở): `de` có thể là `de3`… như cũ.
- `S.to.mock` (kết quả): `full: 1, de` như cũ.
- `S.to.r[id]` (bài đã gặp): ghi cả mã câu đề mới; không ảnh hưởng luyện (mã không có trong kho).
