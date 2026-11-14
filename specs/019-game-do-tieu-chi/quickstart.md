# Kiểm nhanh: 019

1. `node tools/build-toeic.mjs` → 0 lỗi; mọi câu Part 7 kho (trừ chèn câu) có `ev` nguyên văn trong văn bản.
2. `node tools/kiem-toeic.mjs` → 0 lỗi, 0 cảnh báo chưa xem.
3. `node tools/test/run.mjs` → xanh, có C81:
   - chơi trận, thoát giữa chừng → `tr` có trận xong = 0, E2 đếm bỏ dở;
   - chữa đúng → ⭐ tạm, không tính 100/100; giả ngày sau xác nhận đúng → ⭐ thật;
   - lượt xanh ≥ 7 ngày → việc tái đấu; ~50% câu đổi chỗ (`sh`);
   - câu đạt 🌳 → `bq` có dạng → Boss ẩn câu chưa gặp, không thuộc đề đang chơi / đề đối chứng; `lo` tăng khi lấy câu đề khác;
   - đề đối chứng không có trong chip đề game;
   - mọi đề: H1 ≥ 90%, ghép nghĩa ≤ 30% thử thách lên 🌳;
   - màn 🛠 tiêu chí: 🟢 / 🔴 / ⚪ kèm số còn thiếu; không ghi `S.to.mock`, không tạo thẻ.
4. Chromium khổ iPhone SE (sáng + tối): màn game, màn đối chứng, màn tiêu chí: không lỗi trang, không tràn ngang, vùng bấm ≥ 44 px. Chưa kiểm trên iPhone.
