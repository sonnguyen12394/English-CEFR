# Đặc tả tính năng: Góp ý kèm PDF lớn

**Nhánh**: `claude/dazzling-knuth-a3zadz`
**Ngày tạo**: 12/11/2026
**Trạng thái**: Bản nháp
**Yêu cầu**: người sáng lập: "Tôi muốn phần góp ý có thể upload file pdf với dung lượng khoảng 400mb để lưu vào supabase", rồi "thiết kế để tôi up file pdf lớn lên thì nó sẽ tự đo dung lượng và cắt ra cho vừa đủ kích thước lưu". Trả lời câu hỏi: tải lên, xem xong thì xoá · cắt sao cho Claude đọc được · mọi người học được tải · tài liệu của người dùng.

## Bối cảnh đã đo (12/11/2026)

- Dự án Supabase của app ở **gói Free**. Theo tài liệu Supabase (Claude hiểu, chưa tra lại): mỗi tệp tối đa 50 MB, tổng lưu trữ 1 GB.
- Kho `gopy` hiện có 4 ảnh, 381 kB.
- Mọi máy đang dùng chung một tài khoản (đăng nhập ẩn danh chưa bật, xem v136). Vì vậy quyền "đọc góp ý" hiện là của mọi máy. Nếu PDF đọc được như ảnh thì ai mở app cũng xem được tài liệu người khác.
- Cắt nhỏ chỉ vượt được giới hạn 50 MB / tệp, không vượt được tổng 1 GB.

## Kịch bản người dùng & kiểm thử *(bắt buộc)*

### Câu chuyện 1: Gửi góp ý kèm một PDF lớn (Ưu tiên: P1)

Người học mở 💬 Góp ý, chọn một tệp PDF 400 MB. App báo dung lượng, số mảnh sẽ tải, thời gian ước. Người học bấm Gửi, thấy thanh tiến độ theo mảnh. Xong thì góp ý ghi "📄 tên.pdf · 400 MB".

**Vì sao ưu tiên**: đây là toàn bộ giá trị người sáng lập cần.

**Kiểm độc lập**: chọn PDF 120 MB, gửi, thấy góp ý có đủ mảnh trên máy chủ, tổng byte khớp tệp gốc.

**Kịch bản chấp nhận**:

1. **Cho** PDF 400 MB và kho còn chỗ, **khi** bấm Gửi, **thì** tệp được chia thành các mảnh ≤ 25 MB, tải lần lượt, thanh tiến độ ghi "mảnh a/b".
2. **Cho** mạng rớt ở mảnh 7/16, **khi** có mạng lại và người học bấm "Tải tiếp", **thì** app tải tiếp từ mảnh 7, không tải lại mảnh đã xong.
3. **Cho** tệp không phải PDF, **khi** chọn, **thì** app từ chối và nói rõ lý do.
4. **Cho** kho sắp đầy (tệp mới làm tổng vượt trần), **khi** chọn tệp, **thì** app báo "Kho tài liệu đang đầy, còn N MB" trước khi tải, không tải mảnh nào.

---

### Câu chuyện 2: Claude đọc được tài liệu (Ưu tiên: P1)

Người sáng lập nói "đọc góp ý PDF mới nhất". Claude lấy các mảnh, ghép lại thành đúng tệp gốc, đọc nội dung.

**Vì sao ưu tiên**: người sáng lập chọn "cắt sao cho Claude đọc được".

**Kiểm độc lập**: sau câu chuyện 1, Claude ghép tệp, mã băm ghép = mã băm gốc ghi lúc tải, mở đọc được trang đầu và trang cuối.

**Kịch bản chấp nhận**:

1. **Cho** góp ý có PDF đủ mảnh, **khi** Claude lấy tệp, **thì** tệp ghép khớp từng byte với tệp gốc.
2. **Cho** góp ý thiếu mảnh (người học bỏ dở), **khi** Claude lấy, **thì** Claude báo "thiếu mảnh x, y", không ghép tệp hỏng.

---

### Câu chuyện 3: Xem xong thì xoá (Ưu tiên: P2)

Ở 🗂 Quản lý góp ý, người sáng lập thấy dòng 📄 PDF (tên, dung lượng, số mảnh, ngày) và nút Xoá tệp. Claude cũng xoá được sau khi đọc, khi người sáng lập bảo. Xoá tệp giữ lại chữ góp ý.

**Vì sao ưu tiên**: kho 1 GB chỉ chứa ~2 tệp 400 MB; không xoá thì tính năng chết sau 2 lần dùng.

**Kiểm độc lập**: xoá một tệp, dung lượng kho giảm đúng bằng cỡ tệp, góp ý vẫn còn chữ và ghi "đã xoá tệp".

**Kịch bản chấp nhận**:

1. **Cho** góp ý có PDF, **khi** bấm Xoá tệp (bấm 2 lần để chắc), **thì** mọi mảnh bị xoá, góp ý ghi "📄 đã xoá".
2. **Cho** tệp bỏ dở quá 2 ngày, **khi** người sáng lập mở quản lý góp ý, **thì** thấy dòng "tệp dở" và xoá được.

### Trường hợp biên

- Tệp > trần một tệp (450 MB): từ chối trước khi tải.
- Hai người cùng tải khiến tổng vượt trần: mảnh nào làm vượt trần thì máy chủ từ chối; tệp đó thành "dở", xoá được.
- Đóng app giữa chừng: tệp ở dạng dở; mở lại góp ý thấy "Tải tiếp" nếu tệp vẫn còn trên máy (chọn lại đúng tệp, app nhận ra bằng tên + cỡ + mã băm mảnh đầu).
- iPhone khoá màn hình khi đang tải: tải dừng; mở lại thì tiếp.
- Người dùng ẩn danh (khi đăng nhập ẩn danh được bật): vẫn tải được, không đọc lại được.
- Tệp có mật khẩu / PDF hỏng: app không mở PDF nên vẫn tải; Claude báo khi không đọc được.

## Yêu cầu *(bắt buộc)*

### Yêu cầu chức năng

- **FR-001**: Ô góp ý có nút "📄 Thêm PDF" (tối đa 1 PDF mỗi góp ý), ngoài 3 ảnh như cũ.
- **FR-002**: App đo cỡ tệp ngay khi chọn và hiện: dung lượng, số mảnh, chỗ còn trống của kho.
- **FR-003**: App cắt tệp theo byte thành mảnh ≤ 25 MB, không đọc cả tệp vào bộ nhớ một lúc (iPhone không treo với tệp 400 MB).
- **FR-004**: Mảnh tải lần lượt; mảnh lỗi thử lại tối đa 3 lần; quá thì dừng, giữ tiến độ, cho "Tải tiếp".
- **FR-005**: Góp ý ghi bản kê tệp: tên, cỡ, loại, số mảnh, cỡ từng mảnh, mã băm từng mảnh, trạng thái (đang tải / đủ / đã xoá).
- **FR-006**: Trần: một tệp ≤ 450 MB; tổng PDF trong kho ≤ 800 MB (chừa ~200 MB cho ảnh và dữ liệu khác). Máy chủ chặn, không chỉ app.
- **FR-007**: Mỗi tài khoản tối đa 1 tệp đang tải dở và 2 tệp đang lưu. Vì mọi máy đang dùng chung tài khoản, giới hạn này thực tế là cho cả app cho tới khi bật đăng nhập ẩn danh.
- **FR-008**: Không máy nào đọc lại được mảnh PDF từ app (chỉ được tải lên). Chỉ Claude (qua cửa riêng có khoá bí mật trên máy chủ) đọc và xoá được.
- **FR-009**: 🗂 Quản lý góp ý hiện dòng 📄 (tên, cỡ, số mảnh đủ / thiếu, ngày) và nút Xoá tệp (bấm 2 lần); xoá tệp không xoá chữ góp ý.
- **FR-010**: Xoá góp ý hẳn thì xoá luôn mọi mảnh của nó.
- **FR-011**: Mất mạng lúc gửi: chữ góp ý vẫn lưu trên máy như cũ; PDF không lưu trên máy (quá lớn), app nói rõ "PDF cần mạng để gửi".
- **FR-012**: Claude có công cụ dòng lệnh: liệt kê góp ý có PDF, tải các mảnh, kiểm mã băm, ghép thành tệp, xoá tệp.

### Thực thể chính

- **Tệp đính kèm PDF**: thuộc một góp ý; tên, cỡ, số mảnh, trạng thái, ngày tạo.
- **Mảnh**: một phần byte liên tiếp của tệp; số thứ tự, cỡ, mã băm.

## Tiêu chí thành công *(bắt buộc)*

- **SC-001**: Gửi được PDF 400 MB từ iPhone qua Wi-Fi, ghép lại khớp 100% byte.
- **SC-002**: Rớt mạng giữa chừng, tải tiếp không mất mảnh đã xong (thử 3 lần rớt mạng giả).
- **SC-003**: Tổng PDF trong kho không bao giờ vượt 800 MB, kể cả khi 2 máy tải cùng lúc.
- **SC-004**: Từ app, không lấy được nội dung mảnh PDF nào (thử đọc trực tiếp bị từ chối).
- **SC-005**: Xoá tệp trả lại đúng dung lượng trong 1 phút.
- **SC-006**: Claude lấy và đọc được tệp trong ≤ 10 phút cho tệp 400 MB.

## Giả định

- Giữ gói Free; không trả tiền gói Pro.
- Người sáng lập chỉ cần Claude đọc tệp; người sáng lập không cần mở PDF ngay trong app (họ đã có tệp gốc).
- Mảnh 25 MB: nhỏ hơn hẳn trần 50 MB, đủ nhỏ để thử lại khi rớt mạng trên 4G.
- 400 MB qua Wi-Fi 20 Mbit/s mất ~3 phút; qua 4G chậm có thể 15–30 phút. App phải nói rõ và khuyên dùng Wi-Fi.
- Lượng tải về (egress) gói Free ~5 GB / tháng: mỗi lần Claude đọc tệp 400 MB tốn 400 MB, đủ cho ~10 lần / tháng.
- Đây là tính năng cho cả app nhưng chưa đổi luật đo; không đụng 📘 Học / 🔁 Nhớ / Thi.
- Chưa kiểm trên iPhone cho tới khi người sáng lập thử máy thật.
