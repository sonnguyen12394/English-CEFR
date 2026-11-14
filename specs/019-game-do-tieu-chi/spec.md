# Đặc tả: 🗺 Chinh phục đề đo được và hiểu thật

**Thư mục**: `specs/019-game-do-tieu-chi` · **Ngày**: 14/11/2026 · **Trạng thái**: Đã làm (v176)

**Yêu cầu của người sáng lập**: hỏi game giải mục tiêu "giải được toàn bộ đề và hiểu đề" thế nào; xin "bộ tiêu chí để đánh giá chứ không phải phân tích bằng lời"; "dựa vào bộ tiêu chí ấy xem xét lại game và đưa thêm góp ý"; duyệt thứ tự làm 5 → 2 → 1 → 3 → 4 (+ 6): "Ok".

## Gốc vấn đề

Game v173 có 2 mức mỗi câu Phần Đọc: ⭐ Đúng, 🌳 Hiểu. Đo theo bộ tiêu chí (14/11/2026):

| Mã | Kết quả | Căn cứ |
|---|---|---|
| H1 có đủ thử thách | 🔴 | Đề 1–2: 42 / 100 câu có 2 thử thách (54 câu Part 7 chỉ có ghép nghĩa); Đề 3–8: 92–93 |
| H2 câu mới cùng dạng | 🔴 | không có |
| V2 ghép nghĩa ≤ 30% | 🔴 | Đề 1–2: 65%; Đề 3–8: 45–47% |
| G2 giữ được kết quả | 🟠 | chữa câu sai = đọc lời giải rồi làm lại ngay là ⭐ (nhớ ngắn hạn) |
| G1, G3, H3, H4, N1, E1, E2 | ⚪ | không đo được: app không ghi thứ tự phương án, ngày chơi, trận bỏ dở; không có đề "chưa chơi" để so |

Dữ liệu thật (Supabase 14/11/2026): chỉ tài khoản chung có dữ liệu trò chơi bản cũ (v168, mỗi trò 3 câu); chưa có trận Boss nào.

Hệ quả: game chưa chứng minh được người học **làm được đề mới**; "🌳 Hiểu" vẫn hỏi lại đúng câu cũ nên có thể là nhớ câu.

## Bộ tiêu chí (chuẩn để đo tính năng này)

Lưu thành `docs/TIEU-CHI-GAME-TOEIC.md` (FR-001). Game ĐẠT khi qua 6 tiêu chí bắt buộc **G1, G2, H2, H3, H4, N1**; trượt H3 hoặc H4 = đang học vẹt dù tiêu chí khác đạt. Ngưỡng là ý kiến của Claude, xét lại sau 1 quý.

| Mã | Tiêu chí | Đạt khi |
|---|---|---|
| G1 | Chinh phục được đề | ≤ 14 ngày chơi tới 100/100 ⭐ |
| G2 | Giữ được kết quả | làm lại cả Phần Đọc 75 phút, cách ≥ 7 ngày sau chinh phục: ≥ 95/100 |
| G3 | Không nhớ chữ cái | tỉ lệ đúng khi phương án đổi chỗ kém khi giữ thứ tự ≤ 5 điểm % |
| H1 | Đủ thử thách 🌳 | ≥ 90% câu mỗi đề có ≥ 2 thử thách, tối đa 1 là ghép nghĩa |
| H2 | Làm được câu mới cùng dạng | câu chưa gặp cùng dạng, ở dạng đã đạt 🌳: đúng ≥ 80% |
| H3 | Lên điểm ở đề mới | đề đối chứng tăng ≥ 6 câu sau khi chinh phục 2 đề |
| H4 | Không học vẹt | đề đã chơi − đề đối chứng ≤ 15 câu |
| N1 | Nhớ sau 21 ngày | lượt ôn mốc 21 ngày đúng ≥ 80% |
| N2 | 🏡 không sai lại | câu 🏡 sai khi làm đề ≤ 10% |
| V1 | Thử thách không lộ đáp án | 0 thử thách lộ từ đáp án trước khi trả lời |
| V2 | Không dồn vào kiểu dễ thuộc | ghép nghĩa ≤ 30% thử thách để lên 🌳 |
| E1 | Chơi đều | ≥ 3 ngày / tuần trong 2 tuần đầu |
| E2 | Không bỏ giữa chừng | trận bỏ dở ≤ 20% |
| E3 | Thấy hay | hỏi sau 1 tuần, trung bình ≥ 4 / 5 |
| K1 | Chạy trên iPhone | người sáng lập xác nhận |
| K2 | Không lỗi trang, vùng bấm ≥ 44 px | test tự động |

## Câu chuyện người dùng

### Câu chuyện 1: 📊 Đo được game (ưu tiên 1, việc ⑤)

Người sáng lập mở 💾 Dữ liệu → 🛠 → "🗺 Bộ tiêu chí game". Màn hiện từng tiêu chí: số đo, ngưỡng, 🟢 đạt / 🔴 trượt / ⚪ chưa đủ dữ liệu (ghi còn thiếu gì, vd. "cần 20 câu ôn mốc 21 ngày, hiện 3"). Dòng đầu: "Game: ĐẠT / CHƯA ĐẠT · a/6 tiêu chí bắt buộc".

Để có số, mỗi lần làm câu trong game ghi: đề, câu, đúng / sai, thứ tự phương án có bị đổi không, loại việc (Boss, chữa, thử thách loại gì, Boss ẩn), thời gian trả lời, ngày. Mỗi trận ghi lúc bắt đầu và lúc kết thúc (kết thúc thiếu = bỏ dở).

**Kiểm**: 1) chơi 1 trận rồi thoát giữa chừng → E2 đếm 1 trận bỏ dở; 2) chưa đủ dữ liệu → ⚪ kèm số còn thiếu, không ghi 🟢 / 🔴; 3) màn không ghi điểm đề thử, không đổi thẻ học.

### Câu chuyện 2: ⚖️ Đề đối chứng (ưu tiên 1, việc ②)

Lần đầu vào game, người học được nhắc: "Làm 1 đề đối chứng trước khi chơi để biết game có giúp bạn không" (Q2: người học tự chọn đề; đề đã có bài làm thì app cảnh báo "đề này bạn đã làm, kết quả đo sẽ kém tin cậy" nhưng không chặn; chọn xong thì khoá, đổi được trước khi làm lần "trước"). Đề đối chứng KHÔNG chơi được trong game và không có câu nào của nó xuất hiện ở bất kỳ thử thách / Boss ẩn nào. Sau khi chinh phục 2 đề, game nhắc làm lại đề đối chứng (Phần Đọc 75 phút). Màn chính có ô "⚖️ Đề đối chứng: trước a · sau b (+c câu) · đề đã chơi d (chênh e)".

**Kiểm**: 1) đề đối chứng không có trong hàng chọn đề của game; 2) không câu nào của đề đối chứng vào kho câu mới; 3) H3, H4 tính từ 2 lần làm đề đối chứng và lần làm lại đề đã chinh phục.

### Câu chuyện 3: 🐉 Boss ẩn: câu mới cùng dạng (ưu tiên 1, việc ①)

Khi một câu đạt 🌳, ở lượt kế tiếp người học gặp 🐉 Boss ẩn: 1 câu CHƯA từng gặp cùng dạng (Part 5 cùng nhãn dạng; Part 7 cùng loại câu hỏi) (Q1: nguồn = câu kho luyện chưa nằm trong đề + câu của các đề KHÁC đề đang chơi, trừ đề đối chứng; ưu tiên kho trước, rồi đề chưa từng làm / chơi ít nhất. Đề có câu đã bị dùng làm Boss ẩn ghi "đã lộ N câu" ở hàng chọn đề và ở màn tiêu chí; H3 / H4 chỉ tính bằng đề đối chứng). Đúng → dạng đó ghi "hiểu dạng" (đếm cho H2); sai → mở 📘 bài học của dạng đó (đường có sẵn từ v146), dạng chưa tính hiểu. Câu mới đã dùng không dùng lại làm "câu mới".

**Kiểm**: 1) câu Boss ẩn chưa xuất hiện ở đề đang chơi, đề đã chơi, đề đối chứng, hay Boss ẩn trước; 2) đúng dạng (nhãn khớp); 3) hết câu mới của một dạng thì ghi rõ "hết câu mới dạng này", không lấy câu cũ.

### Câu chuyện 4: ⭐ tạm, ⭐ thật (ưu tiên 2, việc ③)

Chữa câu sai (đọc bí kíp rồi đánh lại) đúng → ⭐ tạm (ô 🌱 nhạt). Đúng lại ở ngày sau (phương án đổi chỗ) → ⭐ thật. 🏆 Chinh phục chỉ tính ⭐ thật. Câu ⭐ của lượt đã xanh hết được Boss thi lại sau 7 ngày (trận "Boss tái đấu"); sai → câu thành 👾 lại.

**Kiểm**: 1) chữa đúng cùng ngày → chưa tính vào 100/100; 2) giả ngày sau đúng → ⭐ thật; 3) lượt đã xanh 7 ngày → có việc "Boss tái đấu" trong MỘT nút.

### Câu chuyện 5: 🔁 Bớt ghép nghĩa (ưu tiên 2, việc ④)

Thử thách để lên 🌳 không dùng ghép nghĩa nếu câu có kiểu khác. Part 7 thêm thử thách "🔁 Câu nào diễn đạt lại?": hiện câu chứa đáp án trong bài, chọn 1 trong 4 phương án (đổi chỗ) nói cùng ý. Ghép nghĩa chỉ còn ở lần ôn, và khi câu không có kiểu nào khác. Part 7 kho của Đề 1–2 được soạn thêm câu chứa đáp án (trích nguyên văn bài) để có thử thách dò câu + diễn đạt lại.

**Kiểm**: 1) mọi đề ≥ 90% câu có ≥ 2 thử thách, tối đa 1 là ghép nghĩa (H1); 2) ghép nghĩa ≤ 30% thử thách lên 🌳 (V2); 3) câu chứa đáp án mới có nguyên văn trong bài.

### Câu chuyện 6: ✍️ Tự gõ khó dần (ưu tiên 3, việc ⑥)

Lần đầu tự gõ: gợi ý chữ đầu + số chữ + nghĩa cả câu (như hiện nay). Lần ôn: bỏ nghĩa cả câu; ôn mốc 21 ngày: chỉ còn số chữ.

**Kiểm**: 3 mức gợi ý theo số lần ôn.

### Trường hợp biên

- Người học chưa làm đề đối chứng: game vẫn chơi được; màn tiêu chí ghi H3 / H4 ⚪ "chưa có đề đối chứng".
- Người học đã làm đề đối chứng trước v này ở đề thử trọn: lần làm gần nhất trước khi chơi game được tính là "trước".
- Đề riêng có mã (Đề 9–16): đã mở mã thì câu của nó cũng là nguồn câu mới (như đề khác); chưa mở thì không.
- Người học chọn đề đối chứng đã làm: cảnh báo, không chặn; màn tiêu chí ghi H3 / H4 "kém tin cậy".
- Câu ⭐ cũ trước bản này: giữ là ⭐ thật (không làm người học mất tiến độ).
- Máy không có mạng: dữ liệu đo lưu trên máy, đồng bộ như dữ liệu học.
- Dữ liệu đo phình to: giữ tối đa N dòng gần nhất (đặt trong kế hoạch), số tổng hợp giữ mãi.

## Yêu cầu chức năng

- **FR-001** Lưu bộ tiêu chí ở `docs/TIEU-CHI-GAME-TOEIC.md` (mã, cách đo, ngưỡng, bắt buộc / không).
- **FR-002** Ghi mỗi câu trả lời trong game: đề, câu, đúng / sai, phương án đổi chỗ hay giữ, loại việc, thời gian trả lời, ngày.
- **FR-003** Ghi trận bắt đầu / kết thúc; trận bắt đầu không có kết thúc = bỏ dở.
- **FR-004** Màn 🛠 "🗺 Bộ tiêu chí game" tính mọi tiêu chí đo được bằng máy; ⚪ khi thiếu dữ liệu, ghi số còn thiếu; E3, K1 ghi "người sáng lập ghi tay".
- **FR-005** Đề đối chứng: chọn / gán (Q2), loại khỏi game và khỏi mọi nguồn câu mới; nhắc làm trước khi chơi và sau khi chinh phục 2 đề; ô so sánh ở màn chính.
- **FR-006** 🐉 Boss ẩn sau khi câu đạt 🌳: 1 câu chưa gặp cùng dạng; đúng → "hiểu dạng"; sai → lối tới bài học dạng đó.
- **FR-007** Câu mới không bao giờ trùng câu đã gặp trong game, câu của đề đang chơi, câu của đề đối chứng; câu lấy từ đề khác thì đề đó ghi "đã lộ N câu".
- **FR-008** ⭐ tạm khi chữa đúng cùng ngày; ⭐ thật khi đúng ở ngày sau; chinh phục chỉ tính ⭐ thật.
- **FR-009** Boss tái đấu: lượt đã xanh ≥ 7 ngày được thi lại, nằm trong thứ tự của MỘT nút.
- **FR-010** Thử thách lên 🌳 ưu tiên kiểu không phải ghép nghĩa; thêm kiểu "diễn đạt lại" cho Part 7.
- **FR-011** Soạn câu chứa đáp án cho câu Part 7 kho dùng ở Đề 1–2; máy kiểm có nguyên văn trong bài; không đổi đáp án / chữ cái.
- **FR-012** Gợi ý tự gõ giảm theo số lần ôn (3 mức).
- **FR-013** Không ghi điểm đề thử, không đổi bản đồ điểm, không tạo thẻ học, không đổi luật đo CEFR.
- **FR-014** Câu ⭐ / 🌳 có trước bản này giữ nguyên trạng thái.

### Thực thể chính

- **Lượt trả lời trong game**: đề, câu, đúng, đổi chỗ, loại việc, giây, ngày.
- **Trận**: loại (Boss, tái đấu, chữa, vun cây, Boss ẩn), đề, lúc bắt đầu, lúc kết thúc.
- **Đề đối chứng**: mã đề (người học chọn), đã làm trước đó không, các lần làm (trước / sau), điểm Phần Đọc.
- **Đề đã lộ**: mã đề, số câu đã dùng làm Boss ẩn.
- **Dạng đã hiểu**: dạng, câu mới đã làm, đúng / sai, ngày.
- **Câu mới đã dùng**: mã câu (để không dùng lại).

## Tiêu chí thành công

- **SC-001** Sau bản này, mọi tiêu chí G, H, N, V, E1, E2 có số đo hoặc ⚪ kèm lý do cụ thể (không còn ô "không đo được").
- **SC-002** H1 đạt ở cả 8 đề (≥ 90% câu có ≥ 2 thử thách, tối đa 1 là ghép nghĩa). Lý do không đòi "2 thử thách không ghép nghĩa": Part 5 từ vựng / giới từ / cấu trúc chỉ có tự gõ là kiểu khác; hiểu ở mức dạng do 🐉 Boss ẩn đo (H2).
- **SC-003** V2 đạt ở cả 8 đề (ghép nghĩa ≤ 30% thử thách lên 🌳).
- **SC-004** Mỗi dạng Part 5 (8 dạng) và loại câu hỏi Part 7 có ≥ 3 câu mới cho Boss ẩn khi tính cả câu đề khác (trừ đề đang chơi và đề đối chứng), hoặc ghi rõ dạng nào thiếu.
- **SC-005** 0 câu của đề đối chứng xuất hiện trong game (test kiểm).
- **SC-006** Mốc 2/2027: ≥ 2 người học thật có đủ dữ liệu cho 6 tiêu chí bắt buộc; trượt H3 hoặc H4 thì dừng thêm tính năng, sửa cách học.

## Giả định

- Kho luyện hiện có (đo 14/11/2026): Part 5 198 câu, 138 câu không nằm trong Đề 1–2 (voc 71, form 20, conj 11, prep 10, struct 10, pron 6, verb 6, det 4); Part 7 45 câu không nằm trong Đề 1–2 (detail 27, infer 8, purpose 4, not 2, true 2, insert 1, syn 1) → dạng mỏng thiếu câu mới.
- Câu Part 7 kho chưa có câu chứa đáp án (0 / 153).
- Người học thật là người ôn TOEIC Reading; người sáng lập tự ghi E3 / K1.
- Ngưỡng tiêu chí là ý kiến của Claude.
- Chưa kiểm trên iPhone.

## Quyết định của người sáng lập (14/11/2026)

- Q1 nguồn câu mới: **lấy cả câu đề khác** (đã biết cái giá: đề đó bị lộ, không còn là "đề mới" để đo; vì vậy H3 / H4 chỉ đo bằng đề đối chứng).
- Q2 đề đối chứng: **người học tự chọn** (app cảnh báo nếu chọn đề đã làm).
