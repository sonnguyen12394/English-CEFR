# Từ vựng A1

Học riêng 870 từ A1 (87 unit) lấy từ game English Ladder (`sonnguyen12394.github.io`).

- Trang: https://sonnguyen12394.github.io/English-CEFR/
- 📘 Học = từ thuộc unit đã học xong / 870. 🔁 Nhớ chia 4 mặt (người sáng lập 22/10/2026): 📖 Nghĩa · 🎧 Nghe · ✍️ Viết · 🧩 Dùng. Một mặt của từ là nhớ khi đúng mặt đó ở một ngày sau ngày học, lần gần nhất của mặt đó đúng, khả năng nhớ của từ ≥ 0,9. 🔁 Nhớ tổng = mặt thấp nhất.
- Thi chuyển cấp A1 mở khi 📘 Học 100% và MỖI mặt Nhớ ≥ 80%. 40 câu từ vựng (16 gõ từ, 8 nghe, 16 trắc nghiệm; người sáng lập 22/10/2026), đúng ≥ 80% là qua. Luyện tập cũng trộn các dạng này.
- Tiến độ lưu ở Supabase, bảng `vocab_state` (RLS: mỗi tài khoản một dòng của mình). Trang tự đăng nhập bằng tài khoản riêng `hoc-a1@english-cefr.app` (mật khẩu nằm trong `app.js`; tài khoản này bị chặn khỏi bảng `soxuong`). Mọi máy mở trang dùng chung một tiến độ.
- Lấy lại dữ liệu từ game: `node tools/extract-a1.mjs ../sonnguyen12394.github.io` → `a1.json`.
- 💬 Góp ý (như game, v167–v169): nút nổi mọi màn, loại 🐞 / 🤔 / 💡 / 📝, ≤ 3 ảnh, tự kèm màn / câu đang làm; mất mạng thì lưu máy rồi gửi sau. 🗂 Quản lý góp ý ở cuối trang chính (không khoá). Máy chủ: bảng `gopy`, kho ảnh riêng tư `gopy`. Mã ở `gopy.js`.
  Đọc góp ý mới: `select id, at, kind, txt, ctx->>'h1' man, ctx->>'item' cau, imgs from gopy where status = 'moi' order by at;`
