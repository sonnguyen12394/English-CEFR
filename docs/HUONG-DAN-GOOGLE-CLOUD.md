# Hướng dẫn tạo dự án Google Cloud cho nút "☁️ Từ Google Drive"

Làm một lần, ~15 phút, miễn phí (không cần thẻ). Giao diện Google hay đổi: tên mục dưới đây theo hiểu biết của Claude, có thể lệch chút. Cần gửi lại cho Claude 3 mã: **Client ID**, **API key**, **Project number**. Cả 3 là mã công khai (nằm trong mã trang), không phải mật khẩu.

1. Vào https://console.cloud.google.com, đăng nhập bằng tài khoản Google đang giữ PDF.
2. Bấm chọn dự án (góc trên trái) → **Dự án mới** (New project). Tên: `english-cefr`. Tạo xong nhớ chọn đúng dự án này.
3. Menu ☰ → **APIs & Services** → **Library**. Tìm và bấm **Enable** cho 2 mục: **Google Drive API** và **Google Picker API**.
4. **APIs & Services** → **OAuth consent screen** (hoặc **Google Auth platform**):
   - Loại người dùng: **External**. Tên ứng dụng: `English CEFR`. Email hỗ trợ và email liên hệ: email của bạn.
   - **Scopes** (Phạm vi): thêm `.../auth/drive.file` (mô tả: "See, edit, create and delete only the specific Google Drive files you use with this app"). **Không** thêm quyền Drive nào khác.
   - **Test users**: thêm email của bạn (và email người học muốn dùng thử, tối đa 100). Để chế độ **Testing**.
5. **APIs & Services** → **Credentials** → **Create credentials** → **OAuth client ID**:
   - Application type: **Web application**. Tên: `english-cefr-web`.
   - **Authorized JavaScript origins**: `https://sonnguyen12394.github.io` (không có dấu `/` cuối, không có `/English-CEFR`).
   - Bấm Create → chép **Client ID** (dạng `123456789-abc….apps.googleusercontent.com`).
6. **Create credentials** → **API key** → chép key. Bấm **Edit API key** để giới hạn:
   - Application restrictions: **Websites** → thêm `https://sonnguyen12394.github.io/*`.
   - API restrictions: chỉ chọn **Google Picker API**.
7. Vào trang chủ của dự án (**Dashboard**) → ô **Project info** → chép **Project number** (dãy số, không phải Project ID).
8. Gửi Claude 3 mã: Client ID, API key, Project number.

## Lưu ý
- Chế độ **Testing**: chỉ email trong danh sách Test users đăng nhập được; Google có thể bắt đăng nhập lại sau 7 ngày. Muốn mọi người học dùng thì bấm **Publish app** (In production). Theo hiểu biết của Claude (chưa tra lại), quyền `drive.file` không cần Google duyệt.
- Lần đăng nhập đầu Google hiện cảnh báo "Google hasn't verified this app": bấm **Advanced** → **Go to English CEFR (unsafe)**. Bình thường với ứng dụng chế độ Testing.
- Muốn thu hồi quyền: https://myaccount.google.com/permissions → English CEFR → Remove access.
