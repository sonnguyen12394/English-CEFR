# Từ vựng A1 (repo English-CEFR)

Trang học từ vựng, cấp theo Oxford 3000/5000 làm chuẩn chính (người sáng lập 23/10/2026), không có thì CEFR-J / Octanove (`tools/oxford-levels.py` → `tools/build-levels.mjs`; nguồn: game English Ladder + `content/a1-bosung.json`): Pre-A1 365 → A1 554 → A2 394 → A2+ 394 từ, mỗi cấp một Thi chuyển cấp; B1, B1+, B2, B2+, C1, C2 (3.463 từ) chỉ để tra (`ref.json`). Cấp "+" = nửa khó hơn của cấp (cách chia ở README). Danh sách Oxford có bản quyền: không commit (`content/ref/oxford/` trong .gitignore). Xem `README.md`.

## Luật
- Kiểm giao diện chỉ trên iPhone (WebKit, như Safari / Chrome trên iPhone). Không kiểm bằng Chrome máy tính / Android thay (người sáng lập 22/10/2026).
- Máy soạn không chạy được WebKit thì nói rõ "chưa kiểm trên iPhone" và nhờ người sáng lập thử trên máy thật; không báo là đã kiểm.
- Viết tiếng Việt có dấu, câu ngắn.
- Xử lý góp ý (bảng `gopy`, xem `README.md`): đọc cả ảnh kèm theo; luôn chọn vai trò chuyên môn phù hợp (vd. thiết kế giao diện di động, khoa học ghi nhớ, giáo viên tiếng Anh) để tư vấn và phản biện trước, rồi mới làm (người sáng lập 22/10/2026). Đổi luật đo (📘 Học / 🔁 Nhớ / Thi chuyển cấp) thì hỏi người sáng lập trước.
- Tăng `APP_V` trong `app.js` và `?v=` trong `index.html` mỗi lần phát hành (iPhone giữ tệp cũ).
