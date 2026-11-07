# Kế hoạch cài đặt: Tách 📚 Đề có sẵn và 🤖 Đề AI

**Nhánh**: `claude/ecstatic-curie-q9g1ja` | **Ngày**: 2026-11-07 | **Đặc tả**: [spec.md](spec.md)

## Tóm tắt

Màn đầu mỗi kỳ thi ở tab 🎯 Luyện đề thành màn chọn: tên kỳ thi, band / điểm ước và 2 nút to **📚 Đề có sẵn** (nút chính, "miễn phí · còn N bài chưa làm") · **🤖 Đề AI soạn** (nút phụ, "tốn phí AI"). Phần 📚 = nội dung có sẵn của v137 (ô kỹ năng, Thêm). Phần 🤖 = ô đề AI của v137 + dòng nhắc chi phí + "còn N bài có sẵn chưa làm" theo từng kỹ năng, bấm sang đúng màn kỹ năng. Mỗi phần có hàng chọn 📚 · 🤖 và nút "‹ Luyện đề". Đề dự trữ chỉ soạn khi làm liền ≥ 2 đề AI cùng dạng trong ngày. Không đổi cách chấm, bản đồ, luật đo.

## Bối cảnh kỹ thuật

- JavaScript thuần ở trang; không đổi máy chủ (`de-ai`, `el-cham` giữ nguyên).
- Trạng thái phần đang mở: biến phiên `EX_PART` (`null` = màn 2 nút · `'san'` · `'ai'`), không lưu vào `S`.
- Sửa: `parts.js` (`xHome` 3 chế độ, `xSkill` dời hàng 🤖 xuống sau danh sách bài), `toeic.js` (`EX_PART`, bấm `data-expart`, `exGo` mở thẳng phần 📚, tab mở màn 2 nút), `deai.js` (`daiLeft` đếm bài có sẵn chưa làm, ô nhắc trong phần 🤖, `daiBack` về phần 🤖, luật đề dự trữ), `ielts.js` / `toeic.js` / `dieuhuong.js` (truyền `k`, số bài chưa làm), `huongdan.js` (luật), `index.html` (CSS hai nút), test `run.mjs` (C55 mới; I1, C13, C27, C29, C37, C50, C53, T1 đặt `EX_PART = 'san'` hoặc kiểm màn 2 nút), e2e.
- Giao diện theo luật thiết kế: chụp + chấm màn trước khi sửa, biến CSS chung, chữ ux-copy, kiểm khả năng tiếp cận; chỉ Chromium khổ iPhone SE, ghi "chưa kiểm trên iPhone".

## Kiểm theo hiến pháp

| Nguyên tắc | Trạng thái |
|---|---|
| I. Luật đo | ✅ Không đổi |
| II. iPhone | ✅ Ghi "chưa kiểm trên iPhone"; theo luật thiết kế |
| III. Test xanh | ✅ C55 mới + sửa test cũ; phát hành v138 bằng `tools/release.mjs` |
| IV. Dữ liệu qua nguồn | ✅ Không đụng tệp dựng |
| V. Trung thực | ✅ Nhắc chi phí AI; nhãn AI giữ nguyên |

## Cấu trúc tài liệu

`specs/002-tach-de-san-de-ai/`: spec.md · plan.md · tasks.md · checklists/requirements.md (không cần research / data-model / contracts: không có dữ liệu hay giao tiếp máy chủ mới).

## Rủi ro

| Rủi ro | Chặn |
|---|---|
| Thêm 1 lần chạm tới bài có sẵn | Hôm nay vẫn mở thẳng bài; nút 📚 là nút chính |
| Người học không thấy phần 🤖 có gì | Nút 🤖 ghi rõ "mỗi lần một đề mới"; đề AI đã xong hiện dòng nhắc ở màn 2 nút |
| Test cũ dựa vào ô kỹ năng ở màn đầu | Sửa test đặt `EX_PART = 'san'`; thêm C55 cho màn 2 nút |
