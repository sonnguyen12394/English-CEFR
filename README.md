# Từ vựng tiếng Anh (Pre-A1 → A1 → A2)

Học riêng 918 từ A1 (96 unit): 825 từ lấy từ game English Ladder (`sonnguyen12394.github.io`) + 93 từ / 11 unit "A1 bổ sung" (23/10/2026, theo đối chiếu Cambridge, `docs/DOI-CHIEU-CAMBRIDGE.md`; 63 từ lấy từ cấp A2 / B1 của game, 30 từ tự soạn ở `content/a1-bosung-soan.json`, chưa người thật kiểm).

- Trang: https://sonnguyen12394.github.io/English-CEFR/
- **Hai cấp** (người sáng lập 23/10/2026: "2 cấp, 2 cổng"): **Pre-A1** 379 từ / 45 bài (từ có trong Cambridge Pre A1 Starters, `content/cambridge-yle.json`, + số đếm) → **A1** 539 từ / 59 bài. Mỗi cấp chia chặng theo 11 chủ đề, bài 6–10 từ (xếp ở `tools/extract-a1.mjs`). Bài A1 khoá tới khi qua Thi chuyển cấp Pre-A1. "Đã học" tính theo từng từ (có thẻ ôn), nên xếp lại bài không mất tiến độ.
- 📘 Học = từ thuộc unit đã học xong / 918. 45 từ trừu tượng / học thuật đã chuyển sang A2 (người sáng lập 23/10/2026; `content/a2-chuyen-ids.txt`, dữ liệu ở `content/a2-tu-a1.json`). 🔁 Nhớ chia 4 mặt (người sáng lập 22/10/2026): 📖 Nghĩa · 🎧 Nghe · ✍️ Viết · 🧩 Dùng. Một mặt của từ là nhớ khi đúng mặt đó ở một ngày sau ngày học, lần gần nhất của mặt đó đúng, khả năng nhớ của từ ≥ 0,9. 🔁 Nhớ tổng = mặt thấp nhất.
- Thi chuyển cấp Pre-A1: mở khi Học 100% + mỗi mặt Nhớ ≥ 80% trên 379 từ Pre-A1; 2 vòng × 30 câu (≥ 26 qua, ≤ 21 chưa, giữa thì vòng 2, cần ≥ 48/60); qua là mở A1.
- Thi chuyển cấp A1 mở khi 📘 Học 100% và MỖI mặt Nhớ ≥ 80% trên TẤT CẢ 918 từ. Bài thi (`exam.js`, 23/10/2026): câu MỚI chưa gặp khi luyện (`exam-a1.json`, soạn ở `content/exam-s*.txt`, dựng + kiểm bằng `node tools/build-exam.mjs ../sonnguyen12394.github.io`; tự soát, chưa người thật kiểm); 2 vòng × 40 câu (vòng 1 ≥ 34 qua, ≤ 29 chưa qua, 30–33 làm vòng 2, cần ≥ 64/80); mỗi vòng 22 gõ từ có gợi ý nghĩa, 8 nghĩa từ trong câu, 10 nghe; không gợi ý chữ cái. Qua lần 1 → sau 14 ngày thi lại (từ khác), qua mới ghi "Đạt bền". Đối chiếu Cambridge: `docs/DOI-CHIEU-CAMBRIDGE.md`.
- Tiến độ lưu ở Supabase, bảng `vocab_state` (RLS: mỗi tài khoản một dòng của mình). Trang tự đăng nhập bằng tài khoản riêng `hoc-a1@english-cefr.app` (mật khẩu nằm trong `app.js`; tài khoản này bị chặn khỏi bảng `soxuong`). Mọi máy mở trang dùng chung một tiến độ.
- Lấy lại dữ liệu từ game: `node tools/extract-a1.mjs ../sonnguyen12394.github.io` → `a1.json`.
- 💬 Góp ý (như game, v167–v169): nút nổi mọi màn, loại 🐞 / 🤔 / 💡 / 📝, ≤ 3 ảnh, tự kèm màn / câu đang làm; mất mạng thì lưu máy rồi gửi sau. 🗂 Quản lý góp ý ở cuối trang chính (không khoá). Máy chủ: bảng `gopy`, kho ảnh riêng tư `gopy`. Mã ở `gopy.js`.
  Đọc góp ý mới: `select id, at, kind, txt, ctx->>'h1' man, ctx->>'item' cau, imgs from gopy where status = 'moi' order by at;`
- 🏋️ Luyện tập có 4 kiểu (người sáng lập 22/10/2026: bài dính nhiều từ thì chấm cả các từ ấy; mã ở `tonghop.js`): ⚡ Từng từ · 📰 Đọc bài (📖 Nghĩa cho từ trong câu bằng chứng của câu trả lời đúng) · 🎧 Nghe câu (🎧 Nghe cho mọi từ đã học trong câu) · ✍️ Nghe chép (🎧 Nghe + ✍️ Viết cho từng từ chép đúng / sai). Từ dưới 3 chữ cái không chấm kèm.

## A2 (23/10/2026, người sáng lập: "làm kỹ A2 trước")
- `a2.json` dựng bằng `node tools/extract-a2.mjs ../sonnguyen12394.github.io`: 870 từ A2 của game − 61 từ trùng A1 của trang − 10 dạng -ing − 82 từ trừu tượng / học thuật chuyển sang B1 (`content/b1-chuyen-tu-a2.txt`, dữ liệu ở `content/b1-tu-a2.json`; chọn theo kinh nghiệm, chưa đối chiếu EVP) + 45 từ chuyển từ A1 = **762 từ / 83 bài / 13 chặng**.
- Mở bài A2 khi qua Thi chuyển cấp A1 lần 1. Cổng A2: Học 100% + mỗi mặt Nhớ ≥ 80% trên 762 từ A2, **và A1 "Đạt bền"**. Bài thi A2 như A1 (2 vòng × 40, thi lại sau 14 ngày), mỗi vòng 30 câu A2 + 10 câu Pre-A1/A1.
- Câu thi A2: `content/exam2-s*.txt` → `node tools/build-exam.mjs ../sonnguyen12394.github.io a2` → `exam-a2.json` (762 câu mới, tự soạn, chưa người thật kiểm).
- B1–C2: chưa làm; dữ liệu có sẵn ở game (B2–C2 gần như chưa có âm thanh thu sẵn).

## B1–C2: tra và đo cấp (23/10/2026, người sáng lập: "làm đến C2 … để xác định cấp độ từ vựng")
- `ref.json` (`node tools/extract-ref.mjs ../sonnguyen12394.github.io`): 3.490 từ B1 890 (gồm 82 từ chuyển từ A2) · B2 1.020 · C1 1.020 · C2 560 từ game, bỏ từ trùng cấp dưới. **Chỉ tra** trong 📖 Từ điển, chưa có bài học / thi.
- 🧭 **Xác định cấp độ từ vựng** (`place.js`): mỗi cấp Pre-A1 → C2 lấy 15 từ, chọn nghĩa hoặc "Không biết"; biết = (đúng − sai/3)/15; dừng khi một cấp < 35%; cấp đạt = cấp cao nhất mà nó và mọi cấp dưới ≥ 80%. Chỉ đo nhận ra nghĩa, sai số khoảng ±15%. Lưu ở `S.place`.
- Cấp B1–C2 lấy theo game, **chưa soát** như A1 / A2 (chưa đối chiếu EVP).
