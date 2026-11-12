# Đặc tả tính năng: Gửi PDF góp ý từ Google Drive

**Nhánh**: `claude/dazzling-knuth-a3zadz` · **Ngày**: 12/11/2026 · **Trạng thái**: Bản nháp, chờ người sáng lập duyệt
**Yêu cầu**: người sáng lập gửi ảnh app Tệp trên iPhone: tệp PDF có biểu tượng đám mây (chưa tải về máy) hoặc "↑ Lỗi" nên tải lên web bị lỗi; "Tôi muốn có thể kết nối với driver tải file". Đã trả lời: kho = **Google Drive**, cách nối = **chọn tệp ngay trong app**.

## Gốc rễ đã suy ra (chưa kiểm trên iPhone)
- Tệp ở iCloud Drive mà chưa tải về iPhone thì Safari phải tải về trước khi web đọc được; tệp lớn qua 5G dễ treo, tệp "↑ Lỗi" có thể hỏng.
- App (v157–v158) không báo lỗi rõ khi không đọc được tệp: nút đứng ở "Đang gửi…".
- Web của bên thứ ba không nối được iCloud Drive; Google Drive có cách chính thức (Google Picker + Drive API).

## Câu chuyện người dùng

### 1. Chọn PDF từ Google Drive (P1)
Ở 💬 Góp ý bấm "📄 Từ Google Drive", đăng nhập Google, chọn một PDF. App hiện tên, cỡ, số phần; bấm Gửi thì tệp được chép từ Drive vào kho góp ý, có thanh tiến độ, tiếp tục được khi gián đoạn. Không cần tệp nằm trong iPhone.
- **Kiểm độc lập**: PDF 120 MB trên Drive → gửi → kho có đủ phần, SHA-256 mỗi phần khớp, Claude ghép được.
- Chấp nhận: (1) chỉ chọn được PDF; (2) app chỉ thấy đúng tệp đã chọn, không thấy phần còn lại của Drive; (3) tệp > 450 MB hoặc kho đầy bị chặn trước khi chép, báo rõ; (4) gián đoạn thì bấm Gửi lại, chép tiếp phần thiếu.

### 2. Báo lỗi rõ khi tệp trong máy không đọc được (P1)
Chọn PDF từ iPhone mà tệp chưa tải về (iCloud) hoặc hỏng thì app báo: "Không đọc được tệp. Mở app Tệp, chạm giữ tệp → Tải về ngay rồi thử lại, hoặc dùng 📄 Từ Google Drive." Nút Gửi không đứng im.

### 3. Quản lý như tệp thường (P2)
Tệp chép từ Drive hiện trong danh sách "Đã gửi" với 👁 Xem (≤ 50 MB) · ✏️ Sửa · 🔄 Thay tệp · 🗑 Xoá như v158.

## Yêu cầu
- FR-001 Nút "📄 Từ Google Drive" cạnh "📄 PDF"; chỉ hiện khi đã cấu hình khoá Google.
- FR-002 Quyền Google chỉ `drive.file` (chỉ tệp người dùng chọn); đăng nhập lấy mã truy cập ngắn hạn, không lưu.
- FR-003 Picker chỉ cho chọn PDF (`application/pdf`); tệp Google Docs không chép được thì báo.
- FR-004 Máy chủ chép Drive → kho theo từng phần 25 MB, tự tính SHA-256 từng phần (không để iPhone tải về rồi tải lên lại).
- FR-005 Cỡ tệp lấy từ Drive qua máy chủ (không tin cỡ do trang khai); trần 450 MB / tệp, 800 MB / kho, 1 tệp dở + 2 tệp lưu như v156.
- FR-006 Mã truy cập Google chỉ gửi tới máy chủ của app để chép, không ghi vào bảng, không ghi nhật ký.
- FR-007 Gián đoạn thì nhớ tiến độ (như `GP_LS`); gửi lại chép tiếp phần thiếu.
- FR-008 Mọi lỗi (chưa đăng nhập, từ chối quyền, hết hạn mã, Drive không trả tệp, mạng) có câu báo rõ, nút không đứng im.
- FR-009 Sửa lỗi ở tệp trong máy: câu báo rõ (câu chuyện 2), mọi chỗ gọi đọc tệp bọc `try / catch`.
- FR-010 Thẻ 📄 ở "Đã gửi" ghi nguồn ("từ Google Drive").

## Tiêu chí thành công
- SC-001 PDF 400 MB trên Drive gửi xong từ iPhone qua 5G / Wi-Fi: máy chủ làm phần nặng, iPhone chỉ cần mở app cho tới khi thanh chạy hết.
- SC-002 Ghép lại khớp 100% byte với tệp trên Drive.
- SC-003 Quyền chỉ đúng một tệp: thử lấy tệp khác bằng cùng mã thì bị Google từ chối.
- SC-004 Mọi lỗi liệt kê ở FR-008 có câu báo; không còn nút đứng im.

## Giả định và giới hạn
- Người sáng lập tự tạo dự án Google Cloud miễn phí (~15 phút, Claude hướng dẫn): bật Drive API + Picker API, màn hình đồng ý OAuth (External, thêm email mình làm người thử), Client ID kiểu Web, API key giới hạn theo trang. Client ID, API key, mã dự án là mã công khai, không phải bí mật.
- Dự án ở chế độ "Testing": chỉ email trong danh sách người thử đăng nhập được (tối đa 100). Muốn mọi người học dùng được thì chuyển "In production"; `drive.file` là quyền không nhạy cảm nên theo hiểu biết của Claude (chưa tra lại) không cần Google duyệt.
- Claude không đăng nhập Drive của bạn được: bước cuối (đăng nhập, chọn tệp) bạn tự thử trên iPhone.
- Chưa kiểm trên iPhone; cửa sổ chọn tệp của Google có thể khác trên Safari.
- Không đổi luật đo.
