# Bộ tiêu chí đủ nội dung Nền CEFR (v203, 19/11/2026)

Dùng để đo lại mỗi khi thêm / bớt nội dung 🧱 Nền. Đếm bằng số mục trong np.json, doc.json, nghe.json, noi.json, viet.json, a1 / a2 / b.json (không tính bài thi `test: 1`).

| Mã | Tiêu chí | Cách đo | Ngưỡng đạt | Bắt buộc? | Nguồn |
|---|---|---|---|---|---|
| N1 | Số từ mỗi cấp gần Oxford 3000 / 5000 | so số từ | ≥ 85% | Có | Oxford 3000 / 5000 |
| N2 | Ngữ pháp phủ khung | điểm còn thiếu so với Core Inventory | thiếu ≤ 3 điểm / cấp | Có | British Council / EAQUALS Core Inventory (2010), English Grammar Profile (Cambridge); đối chiếu theo hiểu biết của Claude |
| N3 | Bài luyện Đọc mỗi cấp | đếm | ≥ 20 | Có | ý kiến của Claude (luật bài mới 30 ngày cần ~1 tháng không lặp) |
| N4 | Bài luyện Nghe mỗi cấp | đếm | ≥ 20 | Có | ý kiến của Claude |
| N5 | Đề luyện Nói mỗi cấp | đếm | ≥ 10 | Có | ý kiến của Claude |
| N6 | Đề luyện Viết mỗi cấp | đếm | ≥ 8 | Có | ý kiến của Claude |
| N7 | Bộ cặp âm mỗi cấp | đếm | ≥ 3 | Không | ý kiến của Claude |
| N8 | Nội dung có giáo viên kiểm | có / không | có | Có | chưa đo được, còn thiếu giáo viên thật |

## Lần đo

| Mã | 19/11/2026 (trước v203) | Sau v203 |
|---|---|---|
| N1 | đạt | đạt |
| N2 | A2 trở xuống đạt; B1 18 · B2 15 điểm (thiếu ước 5–10 / cấp) | B1 26 · B2 21 |
| N3 | Pre 12 · A1 24 · A2 30 · B1–C2 11 | B1 20 · B2 20 |
| N4 | Pre 12 · A1 32 · A2 32 · B1–C2 11 | B1 20 · B2 20 |
| N5 | Pre 12 · A1 14 · A2 14 · B1–C2 6 | chưa làm (đợt 2) |
| N6 | A1 8 · A2 8 · B1–C2 4 | chưa làm (đợt 2) |
| N7 | gần đạt (C2 2) | không đổi |
| N8 | chưa | chưa |

Kế hoạch: đợt 1 (v203) ngữ pháp B1 / B2 + Đọc / Nghe B1 / B2 → đợt 2 Nói / Viết B1 / B2 + Đọc / Nghe Pre-A1 → đợt 3 C1–C2 chỉ khi có người học thật tới B2 (mốc 2/2027).
