# Contract: lệnh dòng lệnh

## `node tools/kiem-toeic.mjs [de…] [--html] [--tat-ca]`
- Không tham số: kiểm mọi đề trọn (Đề 1 … N) từ `toeic.json` + `toeic-tron/*.json` (bản đã dựng).
- `de3 de5`: chỉ các đề đó.
- `--tat-ca`: in cả cảnh báo đã xem (mặc định ẩn, chỉ đếm).
- `--html`: viết `docs/kiem-de-toeic.html` (báo cáo cho người sáng lập).
- In: mỗi đề một khối; mỗi dòng `de3 · câu 45 · Part 3 · d03-p3-05 · P34-SAI-DUNG · cảnh báo · lý do · gợi ý`; cuối: tổng lỗi / cảnh báo chưa xem / đã xem / giải mù khớp a / b.
- Mã thoát: 1 nếu có lỗi; 0 nếu không (cảnh báo không đổi mã thoát).
- Dùng như module: `import { kiemDe, kiemTatCa, RULES } from './kiem-toeic.mjs'` — `kiemDe(de, { ack, gm, corpus })` trả danh sách kết quả.

## `node tools/giai-mu.mjs xuat <de> <nghe|doc> <tệp ra> [--cau 45,46,…]`
- Viết phiếu chữ (contracts/tep.md) cho phần Nghe (câu 1–100) hoặc Đọc (101–200) của đề; `--cau` chỉ các câu đó (giải lại).
- Không chứa đáp án, giải thích, câu trích, nhãn.

## `node tools/giai-mu.mjs so <de> <tệp trả lời.json>`
- Đọc câu trả lời của phiên giải mù, đối chiếu đáp án, ghi / cập nhật `content/toeic/giai-mu/<de>.json`, in tỉ lệ khớp và danh sách câu lệch / "2 phương án".

## `node tools/build-toeic.mjs` (sửa)
- Sau khi dựng: gọi máy kiểm cho mọi đề; có lỗi → in và thoát 1 (không ghi tệp dựng? — ghi tệp trước rồi mới kiểm, để lệnh kiểm riêng đọc được; thoát 1 làm release dừng). In số cảnh báo chưa xem.
