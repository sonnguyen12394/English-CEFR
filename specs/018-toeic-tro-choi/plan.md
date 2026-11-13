# Kế hoạch: 🎮 Trò chơi Reading TOEIC (v167)

- Tệp mới `trochoi.js` (nạp sau totron.js; tiền tố hàm `tg`, vì `tc` đã dùng ở tracuu.js). Lối vào `tgRow()` ở màn TOEIC (toeic.js, `after` của xHome, cạnh đề thử trọn).
- Nguồn: `trB(de)` của mọi đề trong `TO.tron` (tải tệp đề bằng `trLoad`); câu sai đọc từ `S.to.tronA` qua `trAGet` / `trSt3`.
- Săn cặp: `q.ev` ↔ `q.a` (Part 7, bỏ NOT / chèn câu, ev ≤ 15 từ); nghĩa từ `lg.dich`, `lg.og[a]`; 📘 xem bài gốc tô `<mark>` câu chứa đáp án.
- Họ từ: Part 5 `x.t === 'form'`, loại từ đọc từ `lg.og` (`tgPos`); bước 1 chỉ khi loại từ đáp án duy nhất; bước 2 chọn, đã đúng ≥ 1 lần thì tự gõ.
- Lịch ôn `S.to.tc.it` (1 → 3 → 7 → 21 ngày), đếm `S.to.tc.st`. Không đụng S.to.mock, toLog, thẻ học.
- CSS `.tcc` `.tcs` `.tcno` `.tcyes` dùng biến màu chung; nút ≥ 44 px.
- Test C79.
