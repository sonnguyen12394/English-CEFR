# Bộ tiêu chí đánh giá game 🗺 Chinh phục đề

Người sáng lập 14/11/2026: "Tôi cần bộ tiêu chí để đánh giá chứ không phải phân tích bằng lời". Đặc tả `specs/019-game-do-tieu-chi`.

Mục tiêu game: (1) làm đúng hết Phần Đọc của đề đã chọn; (2) hiểu kiến thức để làm được đề mới, không học vẹt.

**Cách kết luận**: game ĐẠT khi qua 6 tiêu chí bắt buộc **G1, G2, H2, H3, H4, N1**. Trượt H3 hoặc H4 = người chơi đang học vẹt, dù tiêu chí khác đạt.

Ngưỡng là ý kiến của Claude, chưa có nghiên cứu làm căn cứ. Xét lại mốc 2/2027 (cần ≥ 2 người học thật). App tự tính ở 💾 Dữ liệu → 🛠 → "🗺 Bộ tiêu chí game" (`tgCrit` trong `tgdo.js`).

## G. Đúng hết đề đã chọn

| Mã | Bắt buộc | Tiêu chí | Cách đo | Đạt khi | Đủ dữ liệu khi |
|---|---|---|---|---|---|
| G1 | ✔ | Chinh phục được đề | số ngày chơi đề đó tới khi 100/100 ⭐ thật | ≤ 14 ngày chơi | có ≥ 1 đề chinh phục |
| G2 | ✔ | Giữ được kết quả | làm lại cả Phần Đọc 75 phút, cách lúc chinh phục ≥ 7 ngày | ≥ 95/100 | có 1 lần làm lại như vậy |
| G3 |  | Không nhớ chữ cái đáp án | Boss tái đấu đổi chỗ phương án ở ~50% câu: tỉ lệ đúng câu giữ thứ tự − câu đổi chỗ | ≤ 5 điểm % | ≥ 20 câu mỗi nhóm |

## H. Hiểu, làm được câu chưa gặp

| Mã | Bắt buộc | Tiêu chí | Cách đo | Đạt khi | Đủ dữ liệu khi |
|---|---|---|---|---|---|
| H1 |  | Đủ thử thách 🌳 | % câu mỗi đề có ≥ 2 thử thách, tối đa 1 là ghép nghĩa (tính từ dữ liệu đề) | ≥ 90% ở mọi đề | luôn |
| H2 | ✔ | Làm được câu mới cùng dạng | 🐉 Boss ẩn: câu chưa gặp cùng dạng với câu vừa đạt 🌳 | đúng ≥ 80% | ≥ 10 câu |
| H3 | ✔ | Lên điểm ở đề mới | đề đối chứng (không chơi trong game): lần "sau" (sau khi chinh phục 2 đề) − lần "trước" | tăng ≥ 6 câu | có cả 2 lần |
| H4 | ✔ | Không học vẹt | lần làm lại đề đã chinh phục (G2) − lần "sau" của đề đối chứng | chênh ≤ 15 câu | có G2 và lần "sau" |

## N. Nhớ lâu

| Mã | Bắt buộc | Tiêu chí | Cách đo | Đạt khi | Đủ dữ liệu khi |
|---|---|---|---|---|---|
| N1 | ✔ | Còn nhớ sau 21 ngày | lượt ôn mốc 21 ngày làm đúng | ≥ 80% | ≥ 20 lượt |
| N2 |  | 🏡 không bị sai lại | câu 🏡 trả lời sai trong game | ≤ 10% | ≥ 20 lượt |

## V. Thử thách đo đúng thứ cần đo

| Mã | Tiêu chí | Cách đo | Đạt khi |
|---|---|---|---|
| V1 | Thử thách không lộ đáp án | test C81 khi phát hành | 0 thử thách lộ từ đáp án trước khi trả lời |
| V2 | Không dồn vào kiểu dễ thuộc | % ghép nghĩa trong các thử thách lên 🌳 (tính từ dữ liệu đề) | ≤ 30% ở mọi đề |

## E. Người chơi muốn quay lại

| Mã | Tiêu chí | Cách đo | Đạt khi | Đủ dữ liệu khi |
|---|---|---|---|---|
| E1 | Chơi đều | số ngày chơi mỗi tuần, 2 tuần đầu | ≥ 3 ngày mỗi tuần | đã chơi đủ 14 ngày lịch |
| E2 | Không bỏ giữa chừng | % trận bắt đầu mà không xong | ≤ 20% | ≥ 10 trận |
| E3 | Thấy hay | hỏi người chơi sau 1 tuần, thang 1–5 | trung bình ≥ 4 | người sáng lập ghi tay |

## K. Kỹ thuật

| Mã | Tiêu chí | Đạt khi |
|---|---|---|
| K1 | Chạy trên iPhone thật: hình, tiếng | người sáng lập xác nhận |
| K2 | Không lỗi trang, vùng bấm ≥ 44 px | test tự động |
