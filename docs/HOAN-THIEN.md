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

> Sửa 27/10/2026 (v53): các số X7 ở bảng trên đo bằng bản mô phỏng trước khi sửa cho sát thực tế; chạy lại đúng mã v51 ra Pre-A1 81 ngày ở 2 lượt ôn / ngày. Số đúng ở mục "Luật Nhớ từ B1 (v53)" bên dưới.
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


## Luật Nhớ từ B1 (v53, 27/10/2026)

Người sáng lập: "Đối chiếu với các bài thi thật để tìm phương án" rồi "Mục tiêu là học app xong có thể thi thật nên cứ cân nhắc làm đi".

- **Q7. Từ B1, 🔁 Nhớ Từ vựng = cấp đang học + 1 cấp liền trước (đủ từng từ) + mẫu 100 từ của các cấp cũ hơn, đổi mỗi tuần** (`memWords`, `MEM_SAMPLE`, `MEM_FULL_FROM` trong app.js). Lý do: đề Cambridge chỉ hỏi một mẫu từ; B2 First đạt từ 160 điểm thang Cambridge (khoảng 60% câu, nguồn không chính thức). Ngưỡng 80% và Thi chuyển cấp (có ~30% câu cấp cũ, lấy từ mọi cấp trước: `cumWords`) giữ nguyên. Pre-A1 → A2+ không đổi.
- **Q8. Yêu cầu chiều sâu từ B1 (🔗 🧱 🔧 🛠 🎚 🔄 🎩 ⚡ 🌫) chỉ áp cho từ cấp đó trở lên** (`wDims`): đề thật hỏi các mặt này (Use of English: cụm, tạo dạng từ, viết lại câu) trên mẫu câu, không trên mọi từ đã học.
- **Q9. Từ B1, câu ôn chọn yêu cầu thiếu theo trọng số 1 / √(số từ có yêu cầu)** (`typeFor`, `dimN`): yêu cầu hiếm (🧱 mẫu câu ~25 từ / cấp) trước đây gần như không được hỏi. Pre-A1 → A2+ giữ chọn đều.
- 🏋️ Luyện tập chỉ lấy từ đang tính 🔁 Nhớ.

Mô phỏng (`node tools/test/sim.mjs`, CFG=1,4,15: 1 bài / ngày, 4 lượt ôn, 15 từ nói; Từ vựng ~25 phút + 6 phần kia ~15 phút ≈ 40 phút / ngày), số ngày tới cổng Từ vựng:

| Pre-A1 | A1 | A2 | A2+ | B1 | B1+ | B2 | B2+ | C1 | C2 |
|---|---|---|---|---|---|---|---|---|---|
| 61 | 149 | ~80 | 65 | 95 | 75 | ~150 | 118 | 305 | 151 |

Trước Q7–Q9: B1, B2, C1 > 800 ngày (không tới cổng). Tổng tới C2 ≈ 1.250 ngày (~3,4 năm) ở ~40 phút / ngày; tới A2+ ≈ 355 ngày. Ở 2 lượt ôn / ngày (~30 phút) gần gấp đôi (A1 ~300, B1 173, C1 661).
Mô phỏng, không phải người thật: tỉ lệ đúng giả định theo dạng câu. Chưa người thật học thử.

## 🎓 Đề thử kiểu Cambridge (v54–v55, 27/10/2026)

- Người sáng lập hỏi "sao không tái hiện đề Cambridge vào app". Claude trả lời: đề mẫu có bản quyền, và đưa vào app thì mất tác dụng kiểm độc lập. Người sáng lập chọn "làm khuôn đưa ra ngẫu nhiên các dạng đề thử".
- `mock.js`: khuôn theo cấu trúc đề thật (bài thi, thời gian, phần); mỗi lần bốc câu ngẫu nhiên từ kho app. Số câu ít hơn đề thật.
- `mocknoi.js` (v55, "bạn tự sáng tạo cách để làm được"): bài Nói gồm 4 phần như đề thật, cộng phần nhắc lại câu (Elicited Imitation); máy đo gián tiếp 4 tiêu chí giám khảo. Kiểm (mô phỏng): trả lời mẫu 96–100%, người yếu 16–49%, im lặng 0%.
- Hạn chế: câu có thể trùng câu đã gặp (dùng chung kho); ngưỡng đạt là ước tính; chấm Nói chưa đối chiếu giám khảo thật.

## Tự kiểm: học xong có thi thật được không? (v56, 27/10/2026)

Người sáng lập: "tự kiểm tra lại app xem đã có thể giúp tôi đạt năng lực thi ngoài đời thật chưa, sáng tạo những thứ cần thiết".

| Mặt | Trước v56 | Đánh giá | Đã làm ở v56 |
|---|---|---|---|
| Giờ học | Mô phỏng: tới B2 ≈ 793 ngày × ~40 phút ≈ 530 giờ; tới C2 ≈ 835 giờ | B2 khớp Cambridge (500–600 giờ); C1, C2 thấp hơn (700–800, 1.000–1.200) | 📚 Đọc nghe thêm ngoài app: mục tiêu giờ theo cấp (đề xuất) |
| Lượng đọc / nghe | Mỗi cấp B1 → C2: Đọc ~1.800–2.700 từ, Nghe ~1.250–1.900 từ (≈ một đề thi) | **Lỗ hổng lớn nhất**: đề thật đòi đọc / nghe nhanh văn bản thật | 📚 nguồn miễn phí theo cấp (BBC Learning English, News in Levels, Breaking News English, TED, BBC News, The Guardian, Gutenberg) + ghi giờ (`S.ext`) |
| Dạng bài đề thật | Đề thử: câu đơn, đọc hiểu, viết, nghe | Thiếu "đoạn văn khuyết câu" (B1 Đọc phần 4, B2 phần 6, C1 phần 7, C2 phần 6) | 🧩 tự sinh từ bài đọc (`mkGap`) |
| Viết | Chấm ý (từ khoá) + độ dài | Đề thật chấm 4 tiêu chí; app không bắt lỗi | ✍️ 4 tiêu chí (Nội dung · Mục đích · Bố cục · Ngôn ngữ) + bắt 23 lỗi hay gặp của người Việt (`wErrors`); bài mẫu 85–100%, bài cố tình sai 29%, bài mẫu không bị báo lỗi |
| Giọng nghe | Giọng thu sẵn nữ Mỹ / giọng máy, tốc độ chậm | Đề Cambridge giọng Anh–Anh, tốc độ thường | 🇬🇧 đề thử bài Nghe: giọng Anh (GB / IE / AU nếu máy có), tốc độ 1 (`EXAM_VOX`) |
| Biết khi nào đi thi | Chỉ có từng ô riêng | Không có chỗ gom bằng chứng | 🎯 Sẵn sàng thi: 5 điều kiện (qua Thi chuyển cấp mọi phần · đề thử đạt 2 lần, 2 ngày · đủ giờ đọc nghe thêm · đề mẫu chính thức đạt · giáo viên chấm Nói đạt) |

Còn lại (chưa làm được bằng máy) ở v56 → đã khắc phục ở v57 (mục dưới), trừ việc cần người thật:
- Nội dung AI soạn, chưa người thật kiểm. Đề xuất: nhờ giáo viên soát ngẫu nhiên khoảng 10% mỗi cấp.
- Chưa thử với người học thật: mọi thời gian là mô phỏng.

## Khắc phục để thi lấy bằng (v57, 27/10/2026)

Người sáng lập: "bạn đủ giỏi để khắc phục những khuyết điểm đó; làm sao để tôi dùng được app học đạt thành tựu thi ngoài lấy bằng".

| Khuyết điểm | Đã làm | Kiểm |
|---|---|---|
| Nội dung AI soạn chưa ai soát | Soát toàn bộ 13.436 câu tiếng Anh "mẫu đúng" (câu ví dụ, câu thi, bài đọc, bài nghe, bài mẫu Nói / Viết, câu ngữ pháp đã điền đáp án) bằng LanguageTool (công cụ độc lập, en-GB); xem từng chỗ bị đánh dấu | 633 chỗ bị đánh dấu, Claude xem từng chỗ: ~610 báo nhầm (tên riêng Việt Nam, từ chuyên môn đúng, chính tả / dùng từ Anh–Anh hợp lệ như "open your book at page", "enrolled on a course", lời chào thư, gợi ý tiếng Việt cố ý trong câu ngữ pháp, "do" nhấn mạnh); sửa 4 chỗ cho chuẩn Anh–Anh: drink-driving, shortcut, have a rest, second-largest. Không thấy lỗi ngữ pháp thật. Hạn chế: LanguageTool chỉ bắt lỗi bề mặt, không soát nghĩa / độ tự nhiên / đáp án |
| Bài nghe là giọng máy điện thoại | `tools/build-audio.py`: giọng tự nhiên Kokoro (bộ đã làm giọng af_bella của game), 80% Anh–Anh (bf_emma, bf_isabella, bf_alice, bf_lily / bm_george, bm_lewis, bm_daniel, bm_fable), 20% Mỹ; hội thoại 2 giọng nam / nữ; cả câu đọc to, nhắc lại câu, lời người kia khi đóng vai. Ra `n/<clipKey>.mp3` (24 kHz, 32 kbps); `sayOne` / `kPlayDlg` ưu tiên `n/` | Khoá Python khớp `clipKey` của app (đã thử 3 câu có dấu nháy cong, khoảng trắng) |
| Chấm Viết / Nói chỉ gián tiếp | 🧑‍🏫 AI chấm như giám khảo: edge function `el-cham` (Claude Opus 5.5, effort low, kết quả JSON theo khuôn, tự chuyển mô hình khi bị từ chối `fallbacks: "default"`): 4 tiêu chí Cambridge 0–5, lỗi + cách sửa, điểm mạnh, việc cần làm, bài viết lại; giới hạn 20 lần / người / ngày, 200 lần / app / ngày (bảng `el_cham`). Nút ở bài Viết (luyện, thi, đề thử) và bài Nói của đề thử | Đã triển khai; chưa có khoá thì báo "Chưa cài khoá", không tốn tiền |

Cài khoá AI (người sáng lập làm): console.anthropic.com → API Keys → tạo khoá, nạp tiền → Supabase → Edge Functions → Secrets → thêm `ANTHROPIC_API_KEY`. Không dán khoá vào trang hay vào chat.
Chi phí ước tính (suy luận, chưa đo): Opus 5.5 giá $4 / $20 mỗi triệu token vào / ra; một lượt chấm khoảng 1.500 token vào + 1.500–2.500 token ra ≈ $0,04 ≈ 1.000 đồng; 1–2 bài / ngày ≈ 30.000–60.000 đồng / tháng. Đo thật bằng cột `tin`, `tout` của bảng `el_cham` sau vài lần chấm.

## Bù khuyết điểm (v59+, 28/10/2026; người sáng lập: "sáng tạo các cách để bù đắp, khỏi hỏi tôi")
Thứ tự theo tác động: Bù 1 bài dài + dạng đề trên cả đoạn → Bù 2 nghe ghi chú, nhại theo → Bù 3 nói theo cặp → Bù 4 thư viện đọc mở rộng → Bù 5 tóm tắt C2, soát đáp án.

### Bù 1 (v59): 🧩 Dạng đề thật B1 → C2
- Khuyết điểm: bài đọc 160–290 từ (đề thật 400–850); Dùng tiếng Anh hỏi từng câu lẻ, đề thật làm trên cả đoạn; thiếu phần 4 viết lại câu từ khoá; thiếu nối câu với đoạn.
- Làm: `uoe.js` + `uoe.json` (dựng bằng `node tools/build-uoe.mjs` từ `content/bs/uoe-*.json`, có kiểm: số chỗ trống, 4 phương án khác nhau, đáp án 1 từ, viết lại câu đủ / đúng số từ và có từ khoá, độ dài bài).
  - 8 bài dài (B1 330 từ ×2; B2 566 + 505; C1 603 + 513; C2 774 + 573): trắc nghiệm 4 phương án hoặc nối 10 câu với 4 đoạn.
  - 12 bài điền từ trắc nghiệm, 12 bài điền một từ, 9 bài tạo dạng từ (6–8 chỗ / bài), 42 câu viết lại câu từ khoá.
  - 🎓 Đề thử B1 → C2: phần Đọc / Đọc và Dùng tiếng Anh thay câu lẻ bằng đúng thứ tự phần của đề thật (B2: phần 1–7; C1: thiếu phần 6 so sánh 4 ý kiến).
  - 🧩 Luyện dạng đề thật (ô ở Tổng quan từ B1): không tính giờ, báo đúng / sai + giải thích; câu hỏi hiện ngay câu chứa chỗ trống, cả bài ở dưới. Lưu `S.uoe[id] = { at, ok, n }`.
  - Không đổi luật đo: không tính vào 📘 Học / 🔁 Nhớ / Thi chuyển cấp.
- Giới hạn (thật): kho nhỏ, mỗi dạng 2–12 bài / cấp, làm 3–4 đề thử là gặp lại. Claude soạn, chưa người thật kiểm; đáp án điền từ có thể sót cách viết đúng khác (báo bằng 💬 góp ý). Đề thật vẫn là thước đo cuối.

### Bù 2 (v60): 🎧 Nghe điền thông tin + 🗣 Nhại theo (`nghe2.js`)
- Khuyết điểm: Nghe chỉ có trắc nghiệm + chép câu; đề thật A2 Key phần 2, B1 phần 3, B2 / C1 / C2 phần 2 bắt điền từ / số khi nghe; chưa có luyện nói theo nhịp người bản xứ.
- 📝 Nghe điền: phiếu ghi chú tự sinh từ 82 bài nghe A2 → C2 (81 bài dùng được): mỗi câu một chỗ trống, ưu tiên số (chữ số hoặc chữ, "twenty-five" = 25), giờ, giá, tên riêng, rồi từ nội dung ≥ 7 chữ (bỏ trạng từ -ly); 3–6 chỗ / bài; nghe tối đa 2 lần, giọng Anh–Anh. Có trong 🎓 đề thử (bài Nghe) và ô 🎧 Nghe kiểu đề thật ở Tổng quan từ A2. Lưu `S.ng.nf`.
- 🗣 Nhại theo: 5 câu 6–16 từ có giọng Kokoro; nghe → nói lại; đạt khi khớp ≥ 80% từ và nhịp ≤ 1,3 lần thời gian giọng mẫu. Lưu `S.ng.sh` (tối đa 500).
- Giới hạn (thật): câu trên phiếu giữ nguyên lời bài (đề thật diễn đạt lại) nên dễ hơn đề một bậc; nhịp đo từ lúc máy chép được chữ đầu tới chữ cuối, chỉ ước lượng; chép lời cần Safari trên iPhone; chưa kiểm trên iPhone thật.

### Bù 3 (v61): 👥 Nói theo cặp (`cap.js`, `cap.json`, edge function `el-ban`)
- Khuyết điểm: đề thật A2 Key → C2 Proficiency đều có phần hai thí sinh thảo luận (câu hỏi chính + 5 gợi ý, rồi chốt); app chỉ có nói một mình nên tiêu chí Tương tác không được luyện.
- Làm: 15 đề (3 / cấp A2, B1, B2, C1, C2), bạn thi ảo nói 6 lượt bằng giọng Kokoro (110 câu mới trong `n/`), có câu đáp lại chung theo cấp. Mỗi lượt người học máy đo: ① đáp lời bạn, ② lý do, ③ hỏi lại (lượt cuối: chốt / đề xuất), ④ đủ số từ (A2 12 · B1 18 · B2 25 · C1 30 · C2 35). Đạt ≥ 60%. Kết quả có nút 🧑‍🏫 AI chấm theo 4 tiêu chí (nhấn Tương tác). Lưu `S.cap[id] = { at, pct }`.
- 🤖 Bạn AI (tuỳ chọn, `S.capAi`): edge function `el-ban` (Claude Haiku 5.5, 25–60 từ / lượt, đáp đúng ý người học, tiếng Anh đúng cấp). Giới hạn 60 lượt / người / ngày, 600 / app (bảng `el_cham`, kind `ban`; el-cham không tính lượt này). Chưa có khoá / lỗi: tự quay về lời soạn sẵn. Chi phí ước rất nhỏ mỗi lượt (đoán, chưa đo).
- Giới hạn (thật): máy đo cách tương tác bằng cụm từ trong lời chép, không đo ngữ pháp / phát âm; lời soạn sẵn không đáp đúng ý người học; chưa kiểm trên iPhone thật; chưa có khoá AI nên bạn AI chưa chạy thật lần nào.
