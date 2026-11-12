# Kế hoạch: Gửi PDF góp ý từ Google Drive

## Cách làm
1. **Trang (gopy.js, index.html)**: tải `accounts.google.com/gsi/client` và `apis.google.com/js/api.js` khi bấm nút lần đầu (không tải lúc mở app). Mã truy cập `drive.file` lấy bằng `google.accounts.oauth2.initTokenClient`; `google.picker.PickerBuilder` chọn một PDF → nhận `fileId`, tên, cỡ. Hằng số cấu hình `GD_CLIENT`, `GD_KEY`, `GD_APP` (công khai) ở đầu gopy.js; trống thì ẩn nút.
2. **Máy chủ (hàm `gopy-pdf` bản 5)**: thêm lệnh cho người dùng đã đăng nhập:
   - `gstart { fid, tok }`: gọi Drive `files.get?fields=name,size,mimeType` bằng mã truy cập, kiểm PDF, cỡ ≤ 450 MB, giữ chỗ bằng `gopy_pdf_giu2`; trả mã tệp, số phần. Bảng `gopy_pdf` thêm cột `src` ('may' | 'drive').
   - `gcopy { id, i, tok, fid }`: tải phần i từ Drive bằng `Range: bytes=...` (25 MB), tính SHA-256, ghi vào kho `gopy-pdf`, cập nhật `parts[i].sha`; mỗi lệnh một phần để nằm trong giới hạn 150 giây của gói Free.
   - `done` như cũ (kiểm đủ phần, đúng cỡ).
   Mã truy cập chỉ nằm trong bộ nhớ lúc chạy, không ghi vào bảng hay nhật ký.
3. **Tiến độ**: trang gọi `gcopy` lần lượt từng phần, thử lại 3 lần mỗi phần, nhớ `GP_LS` để gửi lại chép tiếp; hết hạn mã (1 giờ) thì xin lại im lặng.
4. **Sửa lỗi tệp trong máy**: `gpCore` bọc `try / catch` quanh `slice` / `arrayBuffer` / `fetch`; NotReadableError / TypeError → câu báo iCloud ở câu chuyện 2.
5. **Quản lý**: thẻ "Đã gửi" ghi nguồn; xem / sửa / thay / xoá như v158. "Thay tệp" cũng cho chọn từ Drive.
6. **Test C74** (máy chủ giả: gstart/gcopy, chép tiếp, lỗi từng loại, không PDF, quá cỡ, kho đầy) + thử thật trên máy chủ với Drive API giả (Claude không đăng nhập Drive được) + người sáng lập thử iPhone.

## Đụng tới
gopy.js, index.html (CSS nút), supabase/functions/gopy-pdf, migration `src`, tools/test/run.mjs + fake-sb, huongdan.js (📘 Luật), CLAUDE.md, release.mjs (danh sách kiểm iPhone).

## Rủi ro
- Cửa sổ Google trên iPhone Safari bị chặn pop-up nếu không bấm trực tiếp → mở trong lần bấm nút, không qua `await` dài.
- Mã truy cập đi qua máy chủ của app: giới hạn ở quyền `drive.file` một tệp, hết hạn sau 1 giờ; nói rõ trong 📘 Luật.
- Gói Free hàm máy chủ: một phần 25 MB ≈ 5–15 giây, bộ nhớ 256 MB đủ; nếu quá giờ thì giảm phần xuống 10 MB cho tệp từ Drive (tệp từ máy giữ 25 MB).
- Dự án Google ở "Testing": mỗi 7 ngày Google có thể bắt đăng nhập lại.
