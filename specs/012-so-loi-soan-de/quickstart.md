# Cách kiểm (quickstart): Sổ lỗi soạn đề

1. Dựng và kiểm nội dung: `node tools/build-toeic.mjs` → 0 lỗi; dòng "kiểm đề: N loại lỗi …"; `kiemde.json` được viết. `node tools/kiem-toeic.mjs` → 8 đề: 0 lỗi, 0 cảnh báo chưa xem, giải mù 200/200; luật `C-CAN` đạt cả 56 Part (8 đề × 7 Part).
2. Test: `node tools/test/run.mjs` → C69 (luật máy mới bắt đủ câu cài lỗi) và C70 (sổ lỗi: mã duy nhất, mục đủ trường, luật có thật, ít nhất một ví dụ, số liệu khớp dữ liệu) xanh.
3. App (Chromium khổ iPhone SE 320 px và iPhone 13): thanh dưới 6 tab không cuộn, không cắt chữ; bấm 🛡️ Kiểm đề → tóm tắt + danh sách; mở 1 mục → ví dụ, luật; ✓ → "Đã ghi ✓", mở lại màn vẫn thấy; ✗ + ghi chú → góp ý xếp hàng (Supabase giả trong e2e nhận dòng `ctx.view = 'kiemde'`).
4. Đề thử trọn sau khi cân bằng: mở Đề 7 → Part 6: đáp án chia đều 3–5 câu mỗi chữ; câu phương án giờ vẫn tăng dần; 📋 bài làm cũ (giả lập bài làm lưu trước khi đổi) vẫn hiện đúng câu đã chọn.
5. Phiếu giải mù: `node tools/giai-mu.mjs xuat de7 doc …` cho chữ cái khớp app (cùng `ord`).
6. Đọc phản hồi của người sáng lập: truy vấn bảng `gopy` lọc `ctx->>'view' = 'kiemde'` (Supabase), dòng mới nhất mỗi mã.
7. iPhone thật (người sáng lập, ~3 phút): thanh dưới 6 tab đọc rõ, bấm trúng; mở Kiểm đề, mở 2 mục, ✓ một mục, ✗ + ghi chú một mục.
