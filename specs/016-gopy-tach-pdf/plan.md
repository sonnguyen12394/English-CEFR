# Kế hoạch: 016 Tách PDF theo trang

## Cách làm
- **Tệp mới `tachpdf.js`** (nạp sau gopy.js): màn ✂️ Tách PDF (`tpView(file, back)`), 3 thẻ Range · Pages · Size giống ảnh (thẻ chọn có ✓),
  danh sách kết quả, ⬇️ từng tệp, ⬇️ .zip, 📤 Gửi kèm góp ý.
- **Thư viện**: pdf-lib 1.17.1 (MIT) qua cdnjs, nạp lười (`tpLib`). Đọc tệp `PDFDocument.load(buf, { ignoreEncryption: false, updateMetadata: false })`,
  mỗi tệp kết quả `create()` + `copyPages` + `save({ useObjectStreams: true })`; xong tệp nào giải phóng tệp đó (`await` giữa các tệp để trang thở).
- **Range**: Custom (danh sách khoảng, gộp) · Fixed (mỗi N trang). **Pages**: tất cả / chọn ("1, 4, 7-9", `tpParse`).
- **Size**: tham lam theo trang: thêm dần trang, ước cỡ bằng lưu thử; nhảy đôi rồi tìm nhị phân số trang để mỗi tệp ≤ N (≤ ~log2 lần lưu mỗi tệp).
- **.zip**: tự viết gói ZIP không nén (CRC32 + header, ~60 dòng, `tpZip`), không thêm thư viện.
- **Gửi kèm**: tệp kết quả → `File` → đặt vào `GY.pdf` như khi chọn ở ô 📄 rồi mở lại ô góp ý (dùng `gpCore` có sẵn).
- **Lối vào**: ô 📄 sau khi chọn tệp có nút "✂️ Tách PDF" (cạnh cỡ / số phần); khối chọn PDF (v160) thêm dòng "✂️ Tách PDF trên máy".
- **Dấu tải lại trang**: localStorage `tpRun = { size, at }` đặt trước khi tách, xoá khi xong → lần mở sau còn thì báo FR-007.
- **Quản lý góp ý**: nút ⬇️ Tải PDF ở dòng 📄 (`gpDown`): lệnh máy chủ mới `tai` (đường tải ký tên 10 phút cho mọi mảnh, cho người gửi hoặc tài khoản
  không ẩn danh, không giới hạn 50 MB) → tải từng mảnh, kiểm SHA-256 (bỏ khi null), ghép Blob → `a.download`. Máy gửi: thẻ "Đã gửi" thêm ⬇️ Tải dùng chung.
- **Máy chủ**: `supabase/functions/gopy-pdf/index.ts` thêm `tai` (bản 6), triển khai lại; không đổi bảng.

## Kiểm
- Test C76 (Node + Chromium): tạo PDF giả 70 trang bằng pdf-lib, chạy 3 chế độ, đếm trang mỗi tệp, cỡ ≤ N, zip đọc lại được, khoảng sai báo lỗi,
  gửi kèm đặt `GY.pdf`, `tai` bị chặn với người ẩn danh (máy chủ giả).
- Thiết kế: design-critique màn trước khi làm, accessibility-review sau (44 px, tương phản sáng + tối, Chromium khổ iPhone SE).
- iPhone thật: người sáng lập thử 43 MB rồi 100 / 200 / 450 MB (mốc dừng).

## Rủi ro
- Tệp lớn làm Safari tải lại trang (đã ghi mốc dừng). - pdf-lib chậm với PDF nhiều ảnh: chế độ Size có thể > 1 phút với tệp vài trăm MB.
- PDF có mật khẩu: pdf-lib không mở được → báo lỗi.
