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
| X7 | Thời gian hợp lý | mô phỏng `node tools/test/sim.mjs`: ban đầu đặt ≤ 90 ngày / cấp ở 30 phút / ngày; **A1 không đạt** (xem Kết quả) |
| X8 | Có cổng thật | ô 📝 Kiểm bằng đề thật của cấp (đề mẫu Cambridge) |

Giới hạn không vượt được bằng máy: nội dung AI soạn chưa người thật kiểm; bước 🗣 nói cần iPhone thật.

## Các bước

1. Bộ test trong repo (`tools/test/run.mjs` X1–X5, `tools/test/e2e-webkit.mjs` X6, `tools/test/sim.mjs` X7). ✅
2. Bỏ bài ⬆️ Nâng cấp riêng (dạy trong luyện tập); so sánh hơn / nhất, have to, must sang A1. ✅
3. Pre-A1: 📰 Đọc 16 bài, 🎧 Nghe 16 bài kiểu Starters (12 học + 4 thi mỗi phần). ✅
4. A2: thêm 40 từ Key / Flyers, ngữ pháp mệnh đề quan hệ + bị động. ✅
5. Mô phỏng thời gian, thêm 🗓 gợi ý mỗi ngày ở Tổng quan. ✅
6. Chạy toàn bộ test (v51, 27/10/2026). ✅

## Quyết định (Claude, được giao "tự tính", 27/10/2026)

- **Q1. Danh sách Cambridge thắng Oxford ở Pre-A1, A1** (đổi quyết định "Oxford làm chính" 23/10 cho hai cấp này). Lý do: cổng thật là đề Cambridge Starters / Movers; nhiều từ rất cơ bản (jump, smile, toy, sock, headache, plate…) bị Oxford xếp A2. Đã chuyển 36 từ A2 → Pre-A1, 79 từ A2 → A1; thêm 14 + 3 từ chưa có. A2, A2+ vẫn theo Oxford.
- **Q2. Bỏ bài ⬆️ Nâng cấp riêng.** Lý do: 47 bài thêm làm A1 dài, người học phải làm hai loại bài. Thay bằng: từ cấp trước gặp yêu cầu mới lần đầu trong 🏋️ Luyện tập = được dạy (giải thích sau câu, nhãn 🆕); từ ngày sau mới tính Nhớ. 📘 Học chỉ tính từ của cấp mới.
- **Q3. Ngữ pháp:** so sánh hơn, so sánh nhất, have to, must lên A1 (có trong đề Movers, dùng hằng ngày). Thêm A2: mệnh đề quan hệ, bị động (có trong A2 Key).
- **Q4. Pre-A1 có 5 phần** (Từ vựng, Phát âm, Ngữ pháp, Đọc, Nghe). Nói và Viết của Starters là từ đơn, câu rất ngắn: đã nằm trong 🗣 Nói ra từ và ✍️ Chính tả của Từ vựng.
- **Q5. Câu nghe trong đề Pre-A1, A1 luôn do máy đọc câu thi** (câu thu sẵn của game có thành ngữ, cụm động từ khó dù từng từ đúng cấp).
- **Q6. Không hạ chuẩn Nhớ để đạt X7.** Mô phỏng cho thấy A1 dài (nhiều từ × 9 yêu cầu). Giữ chuẩn vì người sáng lập đã duyệt 12 yêu cầu (26/10). Thử ưu tiên dạng câu phủ nhiều yêu cầu: chậm hơn (A1 263 ngày), đã bỏ.

## Kết quả (v51, 27/10/2026)

| Tiêu chí | Pre-A1 | A1 | A2 |
|---|---|---|---|
| X1 màn, đề mọi phần | ✅ | ✅ | ✅ |
| X2 yêu cầu Nhớ được dạy | ✅ 6 | ✅ 9 | ✅ 12 |
| X3 phủ từ Cambridge | ✅ 100% Starters | ✅ ~100% Starters + Movers | ✅ 94% + Flyers (tính cả A2+) |
| X4 câu thi đúng cấp | ✅ 1,8% vượt | ✅ 0,2% | ✅ 0% |
| X5 câu hỏi hợp lệ | ✅ | ✅ | ✅ |
| X6 WebKit iPhone 13 giả lập | ✅ | ✅ | ✅ |
| X7 thời gian (mô phỏng, ~45 phút / ngày) | ✅ ~46–53 ngày | ❌ ~147 ngày | ~104 ngày |
| X8 cổng thật (đề mẫu Cambridge) | ✅ | ✅ | ✅ |

Tổng tới A2 theo mô phỏng: khoảng 300 ngày × 45–55 phút ≈ 230–280 giờ. Cambridge ước A2 Key cần khoảng 180–200 giờ học có hướng dẫn; chuẩn Nhớ của app (≥ 80% mọi yêu cầu trên mọi từ, dồn cấp) chặt hơn nên lâu hơn.

Chưa kiểm được bằng máy: bước 🗣 nói và 👄 bộ chấm âm (cần iPhone thật; Thi Phát âm cần tải bộ chấm âm vài trăm MB); nội dung AI soạn chưa người thật kiểm.

## B1 → C2 (v52, 27/10/2026; người sáng lập: "làm hết tới C2")

Đã làm: 3.447 từ / 434 bài + câu thi mới, 9 yêu cầu 🔁 Nhớ mới (21 tổng), ngữ pháp 46 điểm, Đọc 40, Nghe 40, Nói 24, Viết 16 (mỗi kỹ năng có cấp B1, B2, C1, C2), ô 📝 đề thật B1 Preliminary → C2 Proficiency. Phát âm dừng ở A2.

| Tiêu chí | B1 | B1+ | B2 | B2+ | C1 | C2 |
|---|---|---|---|---|---|---|
| X1 màn, đề | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| X2 yêu cầu Nhớ được dạy | ✅ 15 | ✅ 15 | ✅ 18 | ✅ 18 | ✅ 20 | ✅ 21 |
| X4 câu thi đúng cấp | ✅ 0,5% | ✅ 0,6% | ✅ 0% | ✅ 0% | ✅ 0% | ✅ 0% |
| X5 câu hỏi hợp lệ, bài mẫu tự qua luật chấm | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| X6 WebKit iPhone 13 giả lập | ✅ | (chung B1) | ✅ | (chung B2) | ✅ | ✅ |
| X7 thời gian Từ vựng (mô phỏng, 2 lượt ôn / ngày) | ❌ > 800 ngày | 238 ngày | ❌ > 800 | 605 | ❌ > 800 | 437 |
| X8 đề thật Cambridge | ✅ | – | ✅ | – | ✅ | ✅ |

**X7 không đạt ở B1, B2, C1: Từ vựng không tới cổng.** Mô phỏng B1 (`/tmp` diag, 27/10/2026):
- Nhớ dồn cấp = 2.213 từ (A1 → B1), mỗi từ tới 15 yêu cầu. Câu ôn mỗi ngày bị hút vào sửa từ cũ vừa sai (từ "quên" được ưu tiên trước), từ B1 thiếu yêu cầu mới ít được hỏi.
- Kể cả 6 lượt ôn / ngày (~45 phút) trong 720 ngày: yêu cầu mới dừng ở 64–72% (cần 80%). Cho yêu cầu B chỉ áp cho từ cấp B: không đổi đáng kể.
- Kết luận: luật đo hiện tại (mọi yêu cầu ≥ 80% trên mọi từ dồn cấp) không khả thi ở B1 trở lên. Cần người sáng lập chọn cách đổi (luật đo, Q6). Chưa đổi gì.
