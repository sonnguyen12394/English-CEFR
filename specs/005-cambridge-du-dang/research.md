# Research: Cambridge đủ dạng

Người sáng lập trả lời 3 câu (7/11/2026): không làm dày kho; làm 8 bài tiêu chí; đổi đề thử Nói sang thảo luận cặp.

## R1. Thể loại Viết theo cấp

- **Decision**: B1 = email (phần 1, bắt buộc) + bài báo / truyện (phần 2, chọn); B2 = bài luận (phần 1) + email / thư, bài báo, báo cáo, nhận xét; C1 = bài luận + email / thư, đề xuất, báo cáo, nhận xét; C2 = tóm tắt luận 2 đoạn (phần 1, đã có bài học) + bài báo, thư, báo cáo, nhận xét. Thể loại của đề suy từ chữ `genre` có sẵn (email / thư → thư; truyện; bài báo; bài luận; nhận xét; báo cáo; đề xuất).
- **Rationale**: mô tả công khai của Cambridge English (Writing Part 1 / Part 2 các cấp); kho đã ghi thể loại cho cả 40 đề.
- **Alternatives**: chia theo "phần 1 / phần 2" (không dạy được bố cục riêng từng thể loại).

## R2. Bài học thể loại: ví dụ và làm thử

- **Decision**: ví dụ = đề cuối cùng của thể loại ở cấp đó + bài mẫu chia đoạn, kèm ô "🏗 Bố cục thường gặp" của thể loại (soạn một lần, dùng chung các cấp); làm thử 3 câu = 1 câu "Đề này thuộc thể loại nào?" (đề khác của cấp, phương án = các thể loại của cấp) + 2 câu soạn sẵn của thể loại (giọng văn, câu mở / kết, đặc điểm). Không gắn nhãn từng đoạn cho bài mẫu (khác IELTS): bài mẫu báo cáo / đề xuất có dòng tiêu đề mục, truyện B1 là một đoạn liền, nhãn theo vị trí dễ sai; ô bố cục cho cùng thông tin mà không phải soạn 17 bộ nhãn.
- **Rationale**: đúng dạng, đủ 3 câu cả khi thể loại chỉ có 1 đề ở cấp.
- **Alternatives**: nhãn từng đoạn ghi tay (đổi đặc tả FR-002 từ "có nhãn việc của đoạn" thành "chia đoạn + bố cục thường gặp").

## R3. Bài tập theo thể loại

- **Decision**: nút `genre` chọn đề Viết đúng thể loại trong cấp của đề thử (đề chưa viết trước, rồi đề viết lâu nhất), làm như đề thi (có giờ, máy chấm như cũ). Thêm của màn Viết có hàng nút thể loại (`.chips.tap`, 44 px).

## R4. Thảo luận cặp

- **Decision**: bài học dùng nhiệm vụ đầu tiên của cấp trong `cap.json` (câu hỏi + 5 gợi ý + lời bạn thi) kèm 2 câu đáp mẫu soạn sẵn mỗi cấp; làm thử 3 câu mỗi cấp "Bạn thi nói: … Bạn đáp thế nào?" (câu tốt: đáp lời + lý do + hỏi lại / chốt; câu kém: chỉ "Yes", nói chuyện khác, nói một mình không hỏi lại). Đề thử Nói: một nhiệm vụ, 4 lượt (mở đầu, 2 lượt giữa, chốt), máy phát lời bạn thi (giọng đã có), người học nói lượt mình; ④ Tương tác = trung bình các dấu hiệu `capChecks` (đáp lời, lý do, hỏi lại / chốt) của từng lượt + bắt đầu nói nhanh như cũ.
- **Thứ tự / tên phần**: A2: Phần 1 phỏng vấn · Phần 1 (tiếp) kể về bạn · Phần 2 thảo luận cặp · Phần 2 (tiếp) câu hỏi thêm; B1, B2, C1: Phần 1 · Phần 2 ảnh · Phần 3 thảo luận cặp · Phần 4 thảo luận; C2: Phần 1 · Phần 2 thảo luận cặp · Phần 3 nói dài · Phần 3 (tiếp) thảo luận. "Nhắc lại câu" vẫn ghi là cách app đo.
- **Rationale**: đề Cambridge không có đóng vai; kho 👥 nói cặp đã đúng dạng và có giọng.

## R5. Đọc tin ngắn A2 / B1

- **Decision**: dạng mới `sn` trong `content/bs/dangthi.json`: mỗi bộ A2 6 văn bản, B1 5 văn bản (tin nhắn, thông báo, biển báo, email, nhãn hàng), ≤ 40 từ, câu hỏi 3 phương án (thường là "Văn bản nói gì?"), giải thích; 2 bộ mỗi cấp. Đề thử A2 tách "Phần 1, 3" thành "Phần 1: đọc tin ngắn" + "Phần 3: bài đọc dài"; B1 giữ nhãn "Phần 1: đọc tin ngắn", đổi bộ sinh câu. Danh sách bài tập có một dòng mỗi bộ.
- **Rationale**: dạng thật chưa có; bài đọc dài của Nền vẫn dùng ở A2 phần 3.

## R6. Tiêu chí chấm

- **Decision**: Viết B1 → C2: nội dung · hiệu quả giao tiếp · bố cục · ngôn ngữ (4 thang của Cambridge, diễn giải của Claude). Nói A2 → C2: ngữ pháp và từ vựng · tổ chức lời nói · phát âm · tương tác (trùng 4 tiêu chí đề thử Nói của app đang chấm; A2 thật không có "tổ chức lời nói" riêng: ghi chú trong bài). Mỗi bài: giám khảo nhìn gì, cách làm, bẫy, ví dụ thấp / cao cùng một ý + vì sao, 3 câu làm thử. Bài tập dạng này: Viết → đề kế tiếp; Nói → bài nói kế tiếp. Không có ô bản đồ riêng.

## R7. Đề B1 trùng

- **Decision**: đề truyện B1 "The Wrong Bus" có 2 bản (bài học + bài thi). Soát nguồn; nếu đề thi trùng đề học thì thay đề thi bằng truyện khác (bài mẫu mới), dựng lại `viet.json`.
