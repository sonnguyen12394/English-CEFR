# Bàn giao: Đáp án giải thích chi tiết Part 5–6 (đặc tả 013)

Ngày 10/11/2026. Người sáng lập chuyển sang tài khoản khác để làm tiếp. Phiên mới đọc tệp này trước, rồi `spec.md`, `plan.md`, `tasks.md`.

## Đang ở đâu

- Nhánh: `claude/kiem-noi-dung-de-7l02h6` (đã gộp vào main tới bản 152 qua PR #13; web đang chạy bản 152).
- Đặc tả, kế hoạch, danh sách việc đã viết và đẩy lên. **Chưa sửa mã, chưa soạn lời giải nào.**
- Trạng thái: chờ người sáng lập nói "ok" để làm bước 1 (T001–T004). Nếu phiên mới nhận "ok" / "làm tiếp" thì bắt đầu T001.
- Vì nhánh đã gộp vào main, PR mới cho việc này là PR mới (không dùng lại PR #13).

## Người sáng lập đã chọn (10/11/2026)

1. Phạm vi: Part 5–6 trước (8 đề ≈ 368 câu: Part 5 30 × 8, Part 6 16 × 8). Part 7, Part 1–4 làm sau khi người sáng lập xem mẫu.
2. Vị trí: 📋 Bài làm và đáp án của đề thử trọn (`trRv` / `trRvQ` trong `totron.js`). Kho luyện chưa làm.
3. Bố cục: thẻ xếp dọc, không bảng 3 cột. Mẫu tham khảo là ảnh bảng đáp án của một trung tâm (STT · đề + 4 phương án · "Chọn (B)", loại từ + nghĩa từng phương án, lý do, cấu trúc hay dùng, "Dịch: …"). Chỉ học bố cục, không chép nội dung trung tâm.

## Thiết kế dữ liệu (đã chốt trong spec)

- Thêm `gt` vào câu Part 5 / chỗ trống Part 6 ở NGUỒN: `content/toeic/tron/deNN.json` (Đề 3–8), câu kho `content/toeic/doc.json` (Đề 1–2, mã câu theo `content/toeic/tron.json`).
- `gt = { og: { "<chữ phương án>": "<loại từ: nghĩa>" }, ly: "vì sao (2–3 câu)", ct: "cấu trúc hay dùng (tuỳ chọn)", dich: "dịch cả câu" }`. Khoá `og` theo CHỮ phương án (thứ tự hiện ra do `ord` cân bằng quyết, không theo tệp nguồn).
- `gt` KHÔNG được vào dấu nội dung: sửa `strip` ở `tools/kiem-toeic.mjs` (dòng `const strip`, đang bỏ `why`, `ev`) để bỏ cả `gt` → không phải giải mù lại, không đổi chữ đáp án, "đã xem" giữ. Kiểm sau khi thêm: `node tools/kiem-toeic.mjs` vẫn 0 lỗi, 0 cảnh báo chưa xem, không có GM-CU.
- `tools/build-toeic.mjs` phải giữ `gt` khi dựng (`p5Chk`, `p6Mk` và chỗ chép câu kho vào toeic.json) và kiểm đủ trường. Không sửa tay `toeic.json` / `toeic-tron/*`.

## Model và effort đề xuất (luật mới trong CLAUDE.md)

| Bước | Model · effort |
|---|---|
| T001–T004 mẫu 30 câu Đề 1 + màn thẻ + test | Opus 5.5 · medium |
| T005–T006 soạn ~340 lời giải còn lại | Sonnet 5.5 · medium |
| T007 soát ngẫu nhiên ~20 câu, test, phát hành | Opus 5.5 · medium (sai > 2 / 20 câu thì soạn lại phần đó bằng Opus) |

## Nhắc phiên mới

- Theo CLAUDE.md: tra `graphify query` trước khi đọc mã; việc giao diện theo design-critique → frontend-design / design-system → ux-copy → accessibility-review; đề xuất model / effort trước khi làm; ghi "chưa kiểm trên iPhone".
- Trước khi soạn: đọc sổ lỗi `content/toeic/so-loi.json` (lỗi về giải thích: `H-GT`, `L-NHIEU-DUNG`, `L-HAI-DAP-AN`) và phản hồi ✓ / ✗ ở bảng `gopy` lọc `ctx->>'view' = 'kiemde'`.
- Mốc dừng sau T004: phát hành bản mẫu, chờ người sáng lập xem trên iPhone và nói đúng ý.
- Chưa có người ôn TOEIC thật nào dùng app: nhắc người sáng lập tìm 1–2 người dùng thử.
