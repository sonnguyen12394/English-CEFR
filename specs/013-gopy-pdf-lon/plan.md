# Kế hoạch: Góp ý kèm PDF lớn

## Cách làm (máy chủ quyết, app chỉ tải)
1. **Kho riêng `gopy-pdf`** (riêng tư, mỗi tệp ≤ 26 MB). App KHÔNG có quyền đọc / xoá / ghi thẳng.
2. **Bảng `gopy_pdf`** (chỉ máy chủ đọc / ghi): id, người tải, tên, cỡ, số mảnh, bản kê mảnh (cỡ, mã băm SHA-256), trạng thái `dang` / `du` / `xoa`, ngày.
3. **Hàm máy chủ `gopy-pdf`**:
   - `start` (người dùng đăng nhập): kiểm PDF, cỡ ≤ 450 MB, tổng đã giữ chỗ + tệp mới ≤ 800 MB, mỗi tài khoản ≤ 1 dở + 2 lưu; dọn tệp dở > 2 ngày; giữ chỗ, trả mã tệp + đường tải có ký tên cho từng mảnh (hạn 2 giờ).
   - `sign`: cấp lại đường tải cho mảnh còn thiếu (tải tiếp).
   - `done`: máy chủ tự kiểm mỗi mảnh có thật và đúng cỡ → `du`.
   - `xoa`: xoá mọi mảnh (tài khoản không ẩn danh, như luật xoá góp ý hiện có).
   - `list` / `get` / `del` cho Claude: cần khoá bí mật `PDF_CLAUDE_KEY` (đặt trên máy chủ, không nằm trong mã); `get` trả đường tải về có ký tên.
   Giữ chỗ trong bảng nên 2 máy tải cùng lúc vẫn không vượt trần (khoá dòng khi cộng).
4. **App (`gopy.js`)**: nút 📄 Thêm PDF; đo cỡ → báo số mảnh, chỗ trống, khuyên Wi-Fi; cắt bằng `Blob.slice` 25 MB (chỉ giữ 1 mảnh trong bộ nhớ), băm, tải lần lượt, thử lại 3 lần; tiến độ lưu trên máy để "Tải tiếp" (chọn lại tệp, nhận bằng tên + cỡ + băm mảnh đầu); xong thì gửi góp ý như cũ, kèm `ctx.pdf` = { id, tên, cỡ }. Quản lý góp ý: dòng 📄 + Xoá tệp (bấm 2 lần).
5. **Công cụ Claude `tools/gopy-pdf.mjs`**: `list`, `get <id>` (tải mảnh, kiểm băm, ghép vào scratchpad), `del <id>`. Đọc bằng công cụ PDF theo trang.

## Đụng tới
gopy.js (ô góp ý, gửi, quản lý), supabase/functions/gopy-pdf (mới), migration mới, tools/gopy-pdf.mjs (mới), test mới C71 + fake-sb, 📘 Luật (mục dữ liệu), CLAUDE.md, phát hành bản mới.

## Rủi ro
- iPhone Safari dừng tải khi khoá màn hình → có Tải tiếp.
- Gói Free giới hạn tải về ~5 GB / tháng → Claude đọc tệp 400 MB ~10 lần / tháng.
- Mạng của phiên Claude phải tới được máy chủ Supabase (kiểm ở bước 1).
