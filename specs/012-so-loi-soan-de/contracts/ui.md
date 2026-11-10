# Mô tả màn: tab 🛡️ Kiểm đề

## Thanh dưới (6 tab, mọi người)

`🧭 Lộ trình · 📚 Học · 🎯 Luyện đề · 🛡️ Kiểm đề · 🔍 Tra cứu · 👤 Tôi`

- Các tab chia đều bề ngang (không còn bề rộng tối thiểu 64 px, không cuộn ngang); nhãn 11–12 px, một dòng; biểu tượng 20 px.
- Ở 320 px: mỗi tab ~53 px (≥ 44 px), không cắt chữ "Lộ trình", "Luyện đề", "Kiểm đề", "Tra cứu". Đo bằng Chromium khổ iPhone SE và iPhone 13; iPhone thật (phông SF) nhờ người sáng lập xem.
- Tab sáng khi đang ở màn kiểm đề (`syncTabs` nhận khung của màn này).

## Màn kiểm đề (một màn, cuộn dọc)

1. **Đầu màn**: tiêu đề "🛡️ Kiểm đề"; một câu: "Lỗi đã tìm và sửa khi soạn, khi làm thử 8 đề thử TOEIC trọn, kèm luật để không lặp lại."
2. **Ô tóm tắt** (3 số lớn, một hàng): `N loại lỗi` · `M máy chặn / nhắc` · `K còn mở`; dòng dưới: "8 đề: máy kiểm 0 lỗi · giải mù 200/200 câu mỗi đề" (lấy từ `kiemde.json`), gập "Từng đề" (bảng 8 dòng: lỗi, cảnh báo, giải mù vòng đầu, số câu giải lại).
3. **Hàng lọc** (nút viên ≥ 44 px): `Tất cả` · `Khi soạn` · `Khi làm đề` · `Hiển thị` · `Còn mở`; nhớ lựa chọn trong phiên.
4. **Danh sách theo nhóm** (Part 1 … Part 7, Cả đề, Hiển thị), mỗi nhóm một tiêu đề + số mục. Mỗi mục một dòng gập (`<details>`):
   - Dòng tóm tắt: tên lỗi · nhãn trạng thái (🔒 Máy chặn · 🔔 Máy nhắc · 👁 Người soát · ⏳ Còn mở) · "gặp N lần" · dấu ✓ / ✗ nếu đã đánh dấu.
   - Mở ra: mô tả một câu; **Ví dụ** (Đề, câu): "Trước: …" (gạch, chữ màu nhạt) → "Sau: …"; **Bắt bằng**: bộ dựng / máy kiểm / giải mù / tự soát / người sáng lập; **Đã gặp**: Đề 7 (2 câu), Đề 8 (4 bài)…; **Luật để không lặp lại**: mã + tên luật + mức; mục còn mở: các phương án và cái giá.
   - Hàng phản hồi: `✓ Đúng ý` · `✗ Chưa đúng` (≥ 44 px). Chạm ✓: lưu ngay, hiện "Đã ghi ✓". Chạm ✗: hiện ô ghi chú (placeholder "Chỗ nào chưa đúng ý?") + nút `Gửi`; gửi xong hiện "Đã ghi ✗ · gửi cho Claude". Không mạng: "Đã ghi, sẽ gửi khi có mạng".
5. **Chân màn**: "Nội dung đề do Claude soạn, chưa giáo viên kiểm. Bộ tiêu chí đầy đủ: docs/TIEU-CHI-DE-TOEIC.md" + dòng ngày dựng.

## Không đổi

Màn 🎯 Luyện đề, đề thử trọn (trừ chữ cái đáp án sau khi cân bằng), các tab khác. Không gọi AI, dùng được không mạng (tệp tĩnh).

## Quy trình thiết kế (CLAUDE.md)

Trước khi sửa: design-critique thanh dưới + màn 🎯 Luyện đề (Chromium khổ iPhone SE). Khi sửa: biến màu / chữ chung (frontend-design, design-system); chữ theo ux-copy. Sau khi sửa: accessibility-review (tương phản sáng / tối, vùng bấm ≥ 44 px, cỡ chữ), báo trước / sau. Ghi "chưa kiểm trên iPhone".
