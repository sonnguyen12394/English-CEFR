# Hoàn thiện Pre-A1 → A2 (bắt đầu 26/10/2026)

Người sáng lập 26/10/2026: "bạn tự tính cách làm đi, làm xong từ Pre-A1 tới A2 để tôi yên tâm thì tôi mới học".
Claude tự quyết các điểm chuyên môn; mỗi quyết định ghi lý do ở mục "Quyết định" dưới đây.

## Thế nào là "xong" một cấp (đo được, máy tự kiểm bằng `node tools/test/run.mjs`)

| # | Tiêu chí | Cách đo |
|---|---|---|
| X1 | Mỗi phần của cấp có bài học, luyện tập, Thi chuyển cấp | test `parts` mở được 3 màn của mỗi phần |
| X2 | Mỗi yêu cầu 🔁 Nhớ đang đo đều được dạy trong bài học và có câu luyện | test `teach`: mỗi khoá Nhớ có ít nhất một dạng câu bài học |
| X3 | Phủ từ của đề Cambridge tương ứng (Starters / Movers / Key) | ≥ 85% từ thông dụng của danh sách (bỏ tên riêng, từ chỉ dành cho trẻ em) có ở cấp đó hoặc cấp dưới |
| X4 | Câu thi đúng cấp | ≤ 5% số từ trong câu thi thuộc cấp cao hơn; câu nghe Pre-A1 / A1 do máy đọc câu thi |
| X5 | Không lỗi câu hỏi | mọi từ × mọi dạng câu: đáp án nằm trong phương án, không trùng phương án, ≥ 3 phương án |
| X6 | Chạy được trên iPhone (WebKit) | `node tools/test/e2e-webkit.mjs`: học 1 bài, luyện, thi qua của cấp, không lỗi trang |
| X7 | Thời gian hợp lý | mô phỏng: học 30 phút / ngày tới đủ cổng mọi phần của cấp ≤ 90 ngày (Pre-A1 ≤ 60) |
| X8 | Có cổng thật | ô 📝 Kiểm bằng đề thật của cấp (đề mẫu Cambridge) |

Giới hạn không vượt được bằng máy: nội dung AI soạn chưa người thật kiểm; bước 🗣 nói cần iPhone thật.

## Các bước

1. Bộ test trong repo (`tools/test/`): kiểm X1–X6 tự động. ⏳
2. Hai quyết định treo từ buổi kiểm thử A1: bỏ bài ⬆️ Nâng cấp riêng (dạy trong luyện tập); chuyển so sánh hơn / nhất, must / have to sang A1. ⏳
3. Pre-A1: thêm 🎧 Nghe và 📰 Đọc kiểu Starters (nghe / đọc câu ngắn, chọn hình). ⏳
4. A2: soát với A2 Key (từ, ngữ pháp, 4 kỹ năng), sửa. ⏳
5. Mô phỏng thời gian mọi phần (X7), chỉnh độ dài bài nếu quá. ⏳
6. Chạy toàn bộ test, ghi bảng kết quả cuối vào đây. ⏳

## Quyết định

(ghi khi làm)
