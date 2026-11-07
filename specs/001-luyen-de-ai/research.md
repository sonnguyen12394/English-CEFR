# Nghiên cứu (Phase 0): 🎯 Luyện đề do AI soạn và chấm

Ngày: 2026-11-07. Mỗi mục: Quyết định · Lý do · Phương án đã xét.
Ký hiệu: **[đã kiểm]** = tra được ngay lúc soạn (tài liệu, dữ liệu thật); **[suy luận]** = ước tính, cần đo khi làm.

## R1. Mô hình AI và mức suy nghĩ

- **Quyết định**: soạn đề bằng `claude-opus-5-5` (cùng mô hình với AI chấm `el-cham` đang có), mức suy nghĩ (effort) `medium`; lượt giải kiểm chéo (R3) dùng effort `low`. Bật dự phòng phía máy chủ (`server-side-fallback-2026-07-01`, `fallbacks: "default"`) như `el-cham`.
- **Lý do**: lỗi đắt nhất của đề tự sinh là đáp án sai / hai đáp án đúng; soạn câu hỏi trắc nghiệm có bẫy đúng chuẩn là việc cần suy luận. Opus 5.5 giá $4 / $20 mỗi triệu token vào / ra **[đã kiểm, bảng giá 6/10/2026]**.
- **Đã xét**: Sonnet 5.5 ($2 / $10, nhanh hơn) rẻ một nửa; Haiku 5.5 rẻ nhất nhưng yếu ở viết bẫy. Không tự hạ mô hình vì tiền: đó là quyết định của người sáng lập. Nếu đo thấy chậm / tốn quá (R5, R6) thì hỏi người sáng lập đổi sang Sonnet 5.5.

## R2. Lấy đề ra dạng dữ liệu có khuôn

- **Quyết định**: dùng đầu ra có khuôn (`client.beta.messages.parse` + `betaZodOutputFormat` của `@anthropic-ai/sdk@1.3.0`, lược đồ Zod), đúng như `supabase/functions/el-cham/index.ts` đang chạy. Mỗi "họ đề" (đọc có bài, câu lẻ, nghe, viết, nói) một lược đồ; xem `contracts/de-ai.md`.
- **Lý do**: cách này đã chạy trong dự án; khuôn bảo đảm JSON đúng dạng, máy kiểm (R3) chỉ còn kiểm nội dung.
- **Đã xét**: yêu cầu JSON bằng lời rồi tự `JSON.parse` (dễ hỏng); công cụ (tool use) chỉ để lấy JSON (thừa, đầu ra có khuôn là cách được khuyên).

## R3. Bảo đảm chất lượng đề (rủi ro số 1)

- **Quyết định**: 3 lớp, chạy trên máy chủ trước khi trả đề:
  1. **Lời nhắc**: bảng mô tả từng dạng đề (độ dài, số câu, cách viết bẫy), cấm chép đề chính thức Cambridge / IELTS / ETS, cấm nội dung nhạy cảm; mỗi câu phải kèm câu trong bài chứa đáp án (`ev`) và giải thích tiếng Việt.
  2. **Máy kiểm cố định** (không tốn tiền): đủ trường, đáp án nằm trong danh sách lựa chọn, lựa chọn không trùng, câu điền có đáp án xuất hiện nguyên văn trong bài / lời nghe và đúng giới hạn số từ, `ev` có trong bài, số câu đúng khuôn, độ dài bài trong khoảng.
  3. **Giải độc lập** (thêm 1 lượt AI, effort `low`): đưa bài + câu hỏi KHÔNG kèm đáp án cho một lượt AI khác giải; câu nào lượt giải ra khác đáp án → bỏ câu đó (còn đủ số câu tối thiểu) hoặc soạn lại 1 lần. Ghi `chk = { n, khop, bo }` để đo SC-002 / SC-003.
- **Lý do**: lớp 2 bắt lỗi khuôn; lớp 3 bắt đúng loại lỗi đã gặp nhiều nhất ở đợt soát v115 (52 bài có phương án nhiễu cũng đúng). Thêm ~30–40% chi phí mỗi đề **[suy luận]**.
- **Đã xét**: chỉ lớp 1–2 (rẻ hơn nhưng không bắt được "hai đáp án đúng"); cho người học báo ⚑ Câu sai (vẫn giữ, nhưng là chữa cháy sau khi người học đã bị chấm sai).
- **Cần người sáng lập xác nhận**: lớp 3 làm mỗi đề tốn thêm ~30–40%. Đề xuất GIỮ.

## R4. Thời gian chạy trên máy chủ

- **Sự thật [đã kiểm]**: dự án Supabase của app ở gói **Free**: mỗi lần chạy hàm máy chủ tối đa **150 giây** (đồng hồ thật), phải trả lời trong 150 giây, CPU 2 giây (chờ mạng không tính). Có chạy nền `EdgeRuntime.waitUntil` nhưng cũng bị trần 150 giây.
- **Quyết định**: hàm `de-ai` nhận yêu cầu → ghi một dòng đề trạng thái `dang` → trả mã đề ngay → soạn + kiểm + giải chạy nền (`waitUntil`) → cập nhật dòng `xong` / `loi`. Trang hỏi lại trạng thái mỗi 3 giây, tối đa 160 giây. Đặt hạn chờ AI: soạn 100 giây, giải 35 giây; giải quá hạn thì đề vẫn hiện, ghi `chk.bo = 'het-gio'` và nhãn "chưa kiểm chéo".
- **Lý do**: không giữ kết nối lâu (iPhone khoá máy / đổi app là mất), người học rời màn được, quay lại vẫn thấy đề.
- **Đã xét**: chờ đồng bộ một lần gọi (dễ quá 150 giây → lỗi 504); luồng trực tiếp (stream) về trang (phức tạp, vẫn bị trần 150 giây).

## R5. Độ dài đề và tốc độ

- **Quyết định**: đề AI là **bài luyện theo dạng**, không phải cả bài thi: IELTS Đọc 1 bài 450–650 từ + 6–8 câu thuộc 1–2 dạng; IELTS Nghe 1 phần (lời ~350–500 từ) + 6–10 câu; TOEIC Part 5 bộ 10 câu, Part 6 một đoạn 4 câu, Part 7 1–2 văn bản 3–5 câu, Part 2 bộ 8 câu, Part 3 / 4 một bài 3 câu; Cambridge theo phần của cấp (một phần mỗi đề). Đề cả bài (40 câu) ngoài phạm vi đợt này (đã ghi ở spec).
- **Ước tính [suy luận]**: đầu ra ~3–6 nghìn token kể cả suy nghĩ; Opus ra chữ cỡ 50–100 token / giây → 40–100 giây cho đề Đọc, cộng 10–30 giây giải kiểm chéo. **SC-001 cũ (≤ 30 giây) không thực tế** → sửa ở spec thành: đề đầu tiên của một kỹ năng ≤ 120 giây ở ≥ 90% lần; từ đề thứ hai ≤ 3 giây nhờ đề dự trữ (R7). Đo thật ở bước thử đầu tiên (T004 trong tasks) rồi chốt.

## R6. Chi phí

- **Bảng ước [suy luận, giá đã kiểm]** (Opus 5.5: vào $4 / triệu token, ra $20 / triệu token):

| Lượt | Vào | Ra (cả suy nghĩ) | Tiền |
|---|---|---|---|
| Soạn đề Đọc IELTS (6–8 câu) | ~3 nghìn | ~5 nghìn | ~$0,11 |
| Giải kiểm chéo | ~3 nghìn | ~1,5 nghìn | ~$0,04 |
| Soạn đề TOEIC Part 5 (10 câu) | ~2,5 nghìn | ~3,5 nghìn | ~$0,08 + $0,03 |
| Soạn đề Viết / Nói (chỉ đề) | ~2 nghìn | ~1,5 nghìn | ~$0,04 |
| AI chấm Viết / Nói (`el-cham` có sẵn) | ~3 nghìn | ~4 nghìn | ~$0,09 |

- Một đề Đọc / Nghe ≈ **$0,15**; một bài Viết (đề + chấm) ≈ **$0,13**.
- **Trần 200 lượt / ngày cả app** (người sáng lập chọn): chạm trần mỗi ngày ≈ **$30 / ngày ≈ $900 / tháng** (trường hợp xấu nhất, ví dụ người lạ có link bấm liên tục). Dùng thật hiện nay: ~0–1 người → dưới $1 / ngày.
- **Khuyến nghị cho người sáng lập** (việc của người sáng lập, Claude không làm được): đặt **giới hạn chi tiêu tháng** cho khoá trong Anthropic Console (ví dụ $30 / tháng). Đây là chốt chặn thật; trần 200 lượt chỉ là lớp thứ hai.
- **Sự thật [đã kiểm]**: bảng `el_cham` hiện **0 dòng** → AI chấm có từ 27/10 chưa được dùng lần nào thành công (hoặc khoá `ANTHROPIC_API_KEY` chưa cài). Bước thử đầu tiên phải xác nhận khoá chạy.

## R7. Đề dự trữ (giấu thời gian chờ)

- **Quyết định**: sau khi người học làm xong 1 đề AI của một kỹ năng, app soạn sẵn 1 đề kế tiếp cùng kỹ năng (tối đa 1 đề dự trữ mỗi kỹ năng, hết hạn 7 ngày, không soạn dự trữ khi đã chạm trần ngày). Đề dự trữ tính vào trần 200.
- **Lý do**: đề đầu chờ ~1–2 phút là chấp nhận được một lần; chờ mỗi lần sẽ làm người học bỏ.
- **Đã xét**: soạn sẵn cho mọi kỹ năng ngay khi mở tab (tốn tiền cho đề không ai làm); không dự trữ (mỗi đề chờ 1–2 phút).

## R8. Bộ nhớ đệm lời nhắc (prompt caching)

- **Quyết định**: chưa dùng ở đợt này.
- **Lý do**: lời nhắc cố định ~2–3 nghìn token; bộ nhớ đệm chỉ giữ ~5 phút và lần ghi đắt hơn 25%; với ~0–1 người dùng, gần như không lần nào trúng → tốn hơn. Xét lại khi > 50 đề / ngày.

## R9. Nơi lưu đề

- **Sự thật [đã kiểm]**: toàn bộ dữ liệu học `S` được ghi nguyên khối lên bảng `vocab_state` và `localStorage` mỗi lần `save()`.
- **Quyết định**: đề (bài đọc, lời nghe, câu hỏi) lưu ở bảng mới `de_ai` trên Supabase; trong `S` chỉ giữ chỉ mục nhỏ + kết quả (`S.dai`, ≤ 100 dòng gần nhất). Xem `data-model.md`.
- **Lý do**: mỗi đề 3–8 KB; 100 đề trong `S` = thêm ~0,5 MB ghi lại mỗi lần lưu, iPhone chậm và có thể vượt giới hạn `localStorage`.

## R10. Trần lượt và ai được gọi

- **Sự thật [đã kiểm]**: `el-cham` đang giới hạn 20 lượt / người / ngày và 200 / app / ngày; vì mọi máy đang dùng chung một tài khoản nên 20 lượt / người thực chất là 20 lượt cho cả app. Hàm `el-cham`, `el-ban` bật kiểm JWT (`verify_jwt: true`).
- **Quyết định**: bỏ giới hạn mỗi người ở `el-cham` (theo lựa chọn người sáng lập); trần chung 200 lượt / ngày đếm mọi lượt trong `el_cham` trừ bạn nói AI (`kind` ≠ `ban`): AI chấm + soạn đề (`kind = 'de'`, 1 dòng mỗi đề, đã gồm lượt giải kiểm chéo). Hàm `de-ai` lấy người dùng từ JWT (không tin `uid` trang gửi lên).

## R11. Nghe: giọng đọc

- **Quyết định**: lời nghe AI soạn phát bằng giọng máy của thiết bị qua `kPlay({ lines })` (kit.js, đã tách giọng nam / nữ / người thứ ba). Không dựng giọng Kokoro (chỉ chạy được trên máy soạn).
- **Lý do**: đề sinh lúc chạy, không có bước dựng giọng. Chất lượng thấp hơn kho cũ; ghi rõ trên màn.

## R12. Dùng lại mã có sẵn ở trang

- **Quyết định**: chuyển đề AI thành đối tượng câu hỏi của `ieRun` (ielts.js: `kind`, `q`, `opts`, `a`, `acc`, `why`, `head`, `play`, `ty`, `x.id`) để dùng lại màn làm câu, chấm, kết quả cho cả IELTS, TOEIC, Cambridge; Viết dùng `ieWrite` / luồng Viết Cambridge với đề AI; Nói dùng `ieSpeakCore`; AI chấm dùng `aiBtn` / `el-cham` (thi.js). Thêm cho `ieRun` tuỳ chọn `o.src` (ghi bản đồ nguồn `ai`) và `o.R` (kho kết quả riêng, đã có).
- **Lý do**: ít mã mới, cùng giao diện làm bài người học đã quen.

## R13. Tab thứ 5 và màn

- **Sự thật [đã kiểm]**: `syncTabs` (app.js) đặt tab sáng theo phần tử có trên màn; màn kỳ thi có `#ie` đang thuộc tab 📚 Học. Màn kỳ thi dựng bằng `xHome` / `xSkill` (parts.js).
- **Quyết định**: tab `ld` "🎯 Luyện đề" mở `exOpen()` (màn kỳ thi của mục tiêu); `#ie` chuyển sang tab `ld`. Đầu màn kỳ thi: hàng chọn 🎓 Cambridge · 🌏 IELTS · 💼 TOEIC (🎯 = mục tiêu) thay nút "‹ Học", rồi ô **🤖 Đề mới do AI soạn** (MỘT nút chính "▶ Làm đề AI mới: {kỹ năng · dạng nên luyện}" + hàng kỹ năng), rồi phần bài có sẵn như cũ. Màn kỹ năng có thêm nút "🤖 Đề AI mới" của kỹ năng đó. 📚 Học bỏ thẻ "Luyện {kỳ thi}" và hàng "Kỳ thi khác".
- **Đã xét**: màn trang chủ riêng cho tab (thêm một màn trùng với màn kỳ thi).
- Giao diện theo luật thiết kế của dự án (chụp + chấm màn trước khi sửa, biến CSS chung, chữ theo ux-copy, kiểm khả năng tiếp cận sau). 5 nút thanh dưới ở khổ 320 px: mỗi nút 64 px, đủ vùng bấm 44 px **[suy luận, đo khi làm]**.

## R16. Chống đề trùng (người sáng lập 7/11/2026: "lưu lại đề đã tạo ít nhất 3 phiên bản để AI không tạo trùng đề")

- **Quyết định**: 3 lớp. (1) **Lưu mọi đề** lâu dài trong `de_ai` (không xoá). (2) **Máy chọn chủ đề trước** từ danh sách chủ đề theo kỳ thi + kỹ năng, ưu tiên chủ đề người học chưa gặp; AI viết về chủ đề đó và được xem danh sách tên + chủ đề + ý chính của ≤ 30 đề cũ để tránh. (3) **Máy kiểm trùng** sau khi soạn: so với ít nhất 3 đề gần nhất cùng kỳ thi + kỹ năng bằng toàn văn (thực tế tới 50 đề, chạy trong mã nên không tốn tiền AI): trùng chủ đề / tên, trùng câu hỏi, hoặc ≥ 15% cụm 5 từ → soạn lại 1 lần.
- **Lý do**: chỉ đưa 3 đề gần nhất cho AI xem thì AI tránh được 3 đề đó nhưng dễ quay về chủ đề quen của nó ở đề thứ 4, thứ 5 (mô hình có chủ đề "ruột": đảo nhiệt đô thị, ong, làm việc từ xa…). Bảo AI "viết về X" chắc hơn bảo "đừng viết về A, B, C". Kiểm bằng máy bắt được cả khi AI vẫn lặp.
- **Chi phí [suy luận]**: danh sách tránh ~30 dòng × ~25 token ≈ 750 token vào ≈ $0,003 / đề; soạn lại vì trùng ước < 10% số đề → thêm < $0,02 / đề trung bình.
- **Đã xét**: chỉ lưu 3 đề và đưa nguyên văn cho AI (tốn ~2–3 nghìn token mỗi lần, vẫn lặp chủ đề cũ hơn); so nghĩa bằng AI (tốn thêm một lượt mỗi đề); tránh cả chủ đề của ~800 bài có sẵn trong kho (máy chủ không có sẵn kho này; để sau nếu cần).
- **Phạm vi**: theo tài khoản. Hiện mọi máy dùng chung một tài khoản nên lịch sử chung cả app.
