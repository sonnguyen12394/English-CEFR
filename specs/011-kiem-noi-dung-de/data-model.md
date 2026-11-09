# Data Model: Bộ kiểm nội dung đề TOEIC

## Tiêu chí (Rule) — trong mã `tools/kiem-toeic.mjs` + mô tả ở `docs/TIEU-CHI-DE-TOEIC.md`
- `ma`: mã cố định, vd. `P34-HAMY` (in hoa, chữ không dấu, gạch nối). Đổi nghĩa thì đổi mã.
- `part`: p1 … p7 hoặc `chung`, `gm` (giải mù).
- `muc`: `loi` | `canh`. `canh` có thể ghi "đã xem", trừ `GM-CHUA`, `GM-CU`.
- `ten`: một câu tiếng Việt (in trong báo cáo).
- `goi_y`: cách sửa thường gặp (một câu).
- Ràng buộc: mã nào có trong mã nguồn cũng phải có một mục cùng mã trong tài liệu (C67 kiểm).

## Kết quả kiểm (Finding)
- `de`: mã đề (`de1` … `de8`).
- `n`: số câu trong đề 1–200 (câu thuộc bài nhiều câu: số câu đầu–cuối của bài khi lỗi ở cấp bài).
- `id`: mã câu nguồn (vd. `t3-09`, `d05-p4-10`), `sec`: p1 … p7.
- `ma`, `muc`, `ly_do` (tiếng Việt, có trích chữ của câu), `goi_y`.
- `dau`: dấu nội dung câu (md5 10 ký tự) lúc kiểm.
- `da_xem`: lý do nếu khớp một mục "đã xem".

## Đã xem (Ack) — `content/toeic/kiem-ok.json`
```json
{ "_note": "…", "ok": [ { "id": "t3-09", "ma": "P34-SAI-DUNG", "dau": "a1b2c3d4e5", "ly_do": "…", "ngay": "2026-11-09" } ] }
```
- Khớp khi cùng `id`, `ma`, `dau`. `dau` khác (câu đã sửa) → không khớp, cảnh báo hiện lại; mục cũ in là "đã cũ" để dọn.
- Không ghi được cho `muc = loi`, `GM-CHUA`, `GM-CU`.

## Dấu nội dung câu (dau)
- md5 của chuỗi JSON gồm: Part, lời bài (lines / text / docs / s / gaps), câu hỏi, phương án, đáp án, bảng (g), tranh (pic), sx. Không gồm giải thích `why` và `ev` (sửa giải thích không bắt xem lại cảnh báo về nội dung câu; riêng luật `C-GT-*` dùng dấu có cả `why`).
- Đơn vị dấu: câu lẻ (Part 1, 2, 5), bài (Part 3, 4, 6, 7 — cả bài, vì sửa lời bài ảnh hưởng mọi câu của bài).

## Kết quả giải mù — `content/toeic/giai-mu/deN.json`
```json
{ "_note": "…", "de": "de3", "lan": [ { "ngay": "2026-11-09", "phan": "nghe", "cau": 100, "khop": 97 } ],
  "cau": { "45": { "id": "d03-p3-05", "dau": "…", "da": "B", "chon": "C", "chac": 2, "hai": "B", "ghi": "…", "ngay": "2026-11-09" } } }
```
- `da`: chữ cái đáp án lúc giải (theo thứ tự trong app); `chon`: chữ phiên giải mù chọn; `hai`: chữ thứ hai cũng được (hoặc null); `chac`: 1 đoán / 2 khá chắc / 3 chắc.
- Câu giải lại ghi đè mục của câu đó, thêm một dòng `lan`.
- Máy kiểm: `chon ≠ da` → `GM-LECH`; `hai` khác null → `GM-HAI`; `dau` khác dấu hiện tại → `GM-CU`; đề không có tệp hoặc thiếu câu → `GM-CHUA`.

## Bộ câu cài lỗi — `tools/test/kiem-mau.json`
- `sai`: danh sách { `ma` (luật phải bắt), `sec`, `x` (câu / bài đủ trường như dữ liệu đã dựng) }; mỗi luật tự động ≥ 1 câu.
- `sach`: danh sách câu / bài đúng (lấy từ đề đã soát) → máy không được báo lỗi nào.
