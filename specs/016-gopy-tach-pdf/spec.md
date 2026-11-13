# Đặc tả: Tách PDF theo trang trong 💬 Góp ý (016)

**Ngày**: 13/11/2026 · **Trạng thái**: chờ người sáng lập "ok" · **Không đổi luật đo**

## Gốc vấn đề

Người sáng lập gửi 3 ảnh iLovePDF (Split: Range · Pages · Size) và muốn ô 💬 Góp ý có các chức năng này, kèm tải về các tệp đã tách.
Hiện app (v157–v160) chỉ cắt tệp thành mảnh 25 MB **theo byte** để vượt giới hạn 50 MB / tệp của Supabase Free. Các mảnh này
không phải PDF, không mở được. Muốn như iLovePDF thì phải tách **theo trang**, tạo PDF thật.

Đã chọn với người sáng lập (13/11/2026): mục đích cả hai (gửi Claude đọc một phần + tải về dùng); thử cả tệp tới 450 MB; làm đủ 3 chế độ;
tải về ở cả máy đang tách lẫn 🗂 Quản lý góp ý.

## Câu chuyện người dùng

### 1. Tách theo khoảng trang (P1)
Chọn PDF → ✂️ Tách PDF → Range: thêm khoảng "từ trang a đến trang b" (nhiều khoảng), tuỳ chọn "Gộp các khoảng thành 1 tệp";
kiểu Cố định: "mỗi N trang một tệp". Bấm Tách → danh sách tệp kết quả (tên, số trang, cỡ).
**Chấp nhận**: PDF 70 trang, khoảng 1–10 và 30–40 → 2 tệp 10 + 11 trang mở được; bật gộp → 1 tệp 21 trang; Cố định N = 20 → 4 tệp (20, 20, 20, 10).

### 2. Tách theo trang (P1)
Pages: "Tách mọi trang" (mỗi trang 1 tệp) hoặc "Chọn trang" (gõ "1, 4, 7-9"); chọn trang có thêm "gộp các trang đã chọn thành 1 tệp".
**Chấp nhận**: 70 trang → 70 tệp; chọn "1,4,7-9" không gộp → 5 tệp, gộp → 1 tệp 5 trang.

### 3. Tách theo cỡ (P2)
Size: "Tối đa N MB mỗi tệp" (KB / MB). Mỗi tệp gồm các trang liền nhau, cỡ ≤ N. Một trang lớn hơn N thì thành tệp riêng, ghi "⚠️ vượt N MB".
**Chấp nhận**: tệp 43 MB / 70 trang, N = 10 MB → các tệp ≤ 10 MB (trừ trang đơn quá lớn), đủ 70 trang, đúng thứ tự.

### 4. Tải về (P1)
Mỗi tệp kết quả có nút ⬇️; "⬇️ Tải tất cả (.zip)" khi > 1 tệp. Tải về không gửi gì lên máy chủ.

### 5. Gửi kèm góp ý (P1)
Chạm "📤 Gửi kèm góp ý" ở một tệp kết quả → tệp đó thành PDF của góp ý (đi đường gửi 📄 hiện có: mảnh 25 MB, gửi lại khi mất mạng).
Luật máy chủ giữ nguyên: 1 PDF / góp ý, tối đa 2 tệp lưu / tài khoản, kho 800 MB. Muốn gửi nhiều phần thì gộp thành 1 tệp trước.

### 6. Tải về ở 🗂 Quản lý góp ý (P2)
Dòng 📄 của góp ý có "⬇️ Tải PDF": ghép đủ các mảnh, kiểm cỡ + SHA-256, lưu thành 1 tệp PDF trên máy.
Chỉ tài khoản không ẩn danh (tài khoản chung của người sáng lập). Máy gửi đã có 👁 Xem ≤ 50 MB (v158); thêm ⬇️ Tải cho mọi cỡ.

## Yêu cầu

- **FR-001** Tách làm trên máy người dùng; tệp gốc không gửi đi khi chỉ tách / tải về.
- **FR-002** Kết quả là PDF hợp lệ, giữ nguyên nội dung trang (không nén lại, không đổi chất lượng).
- **FR-003** Hiện số trang + cỡ tệp gốc trước khi tách (như ảnh: "Cỡ gốc 43,21 MB · 70 trang").
- **FR-004** Báo lỗi bằng lời thường khi: khoảng sai (a > b, vượt số trang), PDF có mật khẩu / hỏng, máy hết bộ nhớ.
- **FR-005** Có thanh tiến độ "Đang tách tệp a/b"; nút Huỷ.
- **FR-006** Chưa tải xong thư viện tách (mất mạng lần đầu) thì báo, không đứng im.
- **FR-007** Tệp > 150 MB: cảnh báo trước "Tệp lớn, iPhone có thể tải lại trang giữa chừng. Nếu bị, hãy tách bằng iLovePDF / máy tính rồi gửi từng phần."
  Nếu trang bị tải lại khi đang tách (lần mở sau thấy dấu "đang tách" trong localStorage), báo câu này và ghi cỡ tệp đã thất bại.
- **FR-008** Không lưu tệp kết quả lâu dài trên máy (chỉ trong bộ nhớ trang); rời màn thì mất, có câu nhắc.
- **FR-009** Tải về ở 🗂 Quản lý góp ý chỉ cho tài khoản không ẩn danh; máy chủ kiểm.

## Tiêu chí thành công

- **SC-001** Tệp 43 MB / 70 trang (như ảnh) tách cả 3 chế độ trên iPhone dưới 30 giây, không tải lại trang.
- **SC-002** Mọi tệp kết quả mở được bằng app Tệp / Safari, đúng số trang.
- **SC-003** Người sáng lập tải về được PDF đã gửi ở 🗂 Quản lý góp ý, khớp SHA-256 tệp gốc.
- **SC-004** Ghi lại cỡ lớn nhất tách được trên iPhone thật (mốc 100 / 200 / 450 MB).

## Mốc dừng / đổi hướng

Thử trên iPhone thật lần lượt 100, 200, 450 MB. Cỡ nào làm Safari tải lại trang thì đặt trần tách = cỡ lớn nhất đã qua,
tệp lớn hơn chỉ gửi nguyên như hiện nay (FR-007). Không viết thêm máy chủ tách (Supabase Free không đủ bộ nhớ / 150 giây).

## Giả định

- Thư viện tách PDF tải từ CDN khi mở công cụ lần đầu (~0,5 MB), không tải khi vào app.
- Gói .zip không nén (PDF vốn đã nén), giới hạn tổng như tệp gốc.
- Bộ nhớ Safari iPhone giới hạn khoảng 1–2 GB mỗi trang (suy luận, chưa đo); tách cần giữ tệp gốc + bản đã đọc + tệp kết quả.
- Chế độ Size đo cỡ thật bằng cách lưu thử, nên chậm hơn 2 chế độ kia.
- "Tải về ở Quản lý góp ý" tốn lượt tải tháng (~5 GB / tháng gói Free) mỗi lần tải.

## Ngoài phạm vi

Nén PDF, xoay / xoá trang, ảnh thu nhỏ từng trang (iLovePDF có), tách tệp ở Google Drive chưa chép về máy, thay đổi luật đo.
