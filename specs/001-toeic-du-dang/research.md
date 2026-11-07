# Research: TOEIC đủ dạng câu

Không còn NEEDS CLARIFICATION (người sáng lập trả lời 2 câu ngày 7/11/2026). Các quyết định kỹ thuật dưới đây do Claude chọn.

## R1. Bảng 33 dạng câu

- **Decision**: dùng bảng ở spec.md (Part 1: 2 loại tranh · Part 2: 5 loại câu hỏi + bẫy · Part 3–4: câu hỏi chung, chi tiết, việc sắp làm, hàm ý, có bảng, 3 người nói, loại bài nói · Part 5: 8 dạng · Part 6: chọn từ theo cả đoạn, chèn câu · Part 7: mục đích / chi tiết, suy luận / NOT, từ gần nghĩa, chèn câu [1]–[4], ý định trong tin nhắn, nhiều văn bản · quản lý giờ · từ công sở).
- **Rationale**: khuôn đề TOEIC L&R từ 2016 (Việt Nam từ 2019): Part 1 6 · Part 2 25 · Part 3 39 · Part 4 30 · Part 5 30 · Part 6 16 · Part 7 54 câu; các loại câu hỏi bên trong theo cách chia thông dụng của sách luyện thi. Đây là hiểu biết của Claude (đã kiểm chứng ở mức khuôn đề công khai; tỉ lệ từng loại câu là ước lượng), chưa giáo viên kiểm.
- **Alternatives**: chia nhỏ Part 5 như sách (14–17 chương ngữ pháp): quá nhiều bài cho mức "vài bài tượng trưng"; chỉ chia theo Part (như trước): thiếu dạng sách nào cũng dạy riêng.

## R2. Nhận dạng câu: suy lúc dựng kho, nhãn tay khi cần

- **Decision**: `tools/build-toeic.mjs` suy nhãn và ghi vào `toeic.json`: Part 1 `k` (people / scene) từ câu đúng; Part 2 `ty` (wh / yn / or / req / stmt) từ câu hỏi; câu hỏi Part 3–4 `ty` (gist / next / imp / graphic / detail) và Part 7 `ty` (purpose / infer / not / syn / insert / intent / detail) từ đầu câu hỏi; chỗ trống Part 6 `t` (insert / conn / word, hoặc `tense` ghi tay). Nhãn ghi tay trong `content/` thắng nhãn suy. Nhãn tay bắt buộc: loại bài nói Part 4 (`ty`: msg / ann / ad / news / intro / tour / meet). Dựng kho dừng (lỗi) khi không suy được nhãn Part 2 hoặc thiếu nhãn Part 4.
- **Rationale**: câu hỏi TOEIC theo khuôn cố định ("What does the man mean when he says", "closest in meaning to", "In which of the positions marked") nên suy được chắc; kiểm ở lúc dựng thì câu mới soạn sai khuôn bị bắt ngay.
- **Alternatives**: nhãn tay hết (~300 câu, dễ sót, sửa mỗi lần thêm câu); suy lúc chạy (không kiểm được khi dựng, tốn ở máy người học).

## R3. Bài tập theo dạng: câu lẻ thì lẻ, bài nhiều câu thì cả bài

- **Decision**: Part 1, 2, 5 lấy câu lẻ đúng dạng (Part 1: 5, Part 2: 8, Part 5: 15). Part 3, 4, 6, 7 lấy 2 bài có dạng đó và làm CẢ bài. Chọn bài chưa làm / làm lâu nhất trước (như `toPick`). Ghi kết quả như luyện thường (`ieRun` + `toLog`).
- **Rationale**: kết quả lưu theo bài; hỏi một câu của bài 3 câu sẽ ghi "1/1" cho cả bài và làm bài thành "đã gặp" 30 ngày, sai số đo điểm ước và lần thử của bản đồ. Đề thật cũng hỏi mỗi dạng trong một bài có nhiều câu.
- **Alternatives**: chỉ hỏi câu đúng dạng, ghi riêng không tính: thành "luyện thêm", không vào điểm ước / bản đồ, trái nghĩa "🏋️ Bài tập (tính)" của app.

## R4. Câu chèn Part 6: phương án sai cùng chủ đề

- **Decision**: viết lại 3 phương án sai của 19 đoạn cũ + 4 đoạn mới: cùng chủ đề đoạn văn, đúng ngữ pháp, nhưng không nối được mạch (nhắc người / việc chưa có, sai thời gian, ngược ý câu trước hoặc sau, lặp ý đã nói). Lời giải (`why`) nói vì sao đáp án nối được câu trước và câu sau. Kiểm máy: mỗi phương án có ít nhất một từ nội dung chung với đoạn văn (bắt câu lạc đề hẳn). Kiểm người: Claude soát từng câu cho 1 đáp án; vào bảng kiểm giáo viên.
- **Rationale**: kỹ năng đề thật là mạch văn (từ nối, đại từ, thì); câu lạc đề làm người học đoán theo chủ đề.
- **Alternatives**: chỉ đoạn mới (người sáng lập không chọn).

## R5. Part 7 từ gần nghĩa, chèn câu [1]–[4]

- **Decision**: khuôn câu hỏi như đề thật: `In the notice, the word "X" in paragraph 2, line 1, is closest in meaning to` (app không có số dòng cố định trên điện thoại nên ghi đoạn, có thể bỏ dòng); `In which of the positions marked [1], [2], [3], and [4] does the following sentence best belong? "…"`; văn bản có đủ 4 dấu [1]–[4]; phương án "[1]"…"[4]" giữ thứ tự (không xáo). Kiểm dựng: từ X có trong văn bản; đủ 4 dấu; đáp án là một dấu.
- **Rationale**: giống đề thật; phương án xáo thứ tự [3] [1] [4] [2] gây rối, đề thật luôn theo thứ tự.

## R6. Part 2 câu trần thuật và nhãn bẫy

- **Decision**: câu trần thuật (vd. "The printer on the second floor is out of toner.") có lời đáp đúng là phản hồi tự nhiên (đề nghị giúp, hỏi lại, cho thêm thông tin, cách khác); 2 lời đáp sai gắn nhãn bẫy cũ (lặp từ / gần âm, sai loại thông tin, cùng chủ đề không trả lời). Nhãn `yn` (Yes / No cho câu Wh-) không dùng cho câu trần thuật.

## R7. Part 5 lượng từ (det)

- **Decision**: 10 câu: each / every + danh từ số ít; all / most / some of the + số nhiều; another + số ít / other + số nhiều / the others; few / a few / little / a little; much / many; the number of / an amount of; each other. Mẹo ở bài học, bản đồ (`TM_TIP`), cẩm nang (`t5tip`).

## R8. Giọng đọc

- **Decision**: cài kokoro-onnx 0.6.1 + `kokoro-v1.0.onnx` + `voices-v1.0.bin` vào scratchpad (đã thử: mạng tải được), chạy `python tools/build-audio.py <thư mục mô hình> 4`; công cụ tự dựng câu chưa có tệp. Không commit mô hình.
- **Rationale**: như v115, v124, v126 (giọng Mỹ + Anh cho TOEIC).

## R9. Bản đồ điểm và giao diện

- **Decision**: bản đồ giữ ô cũ, thêm ô "P5 · Lượng từ" (tự có vì ô lấy theo danh sách dạng Part 5). Bài tập theo dạng mở từ bài học ("🏋️ Bài tập dạng này") và từ khối "🎯 Luyện theo dạng câu" trong "Thêm" của màn Nghe / Đọc, chia theo Part. Kiểu nút theo design-critique lúc làm (ưu tiên lớp có sẵn; vùng bấm ≥ 44 px).
- **Alternatives**: thêm ô bản đồ cho từng loại câu Part 2 / 7: màn rối, chưa có dữ liệu thật để biết có ích.

## R10. Thứ tự bài học, mã bài học

- **Decision**: Nghe: p1 (tranh có người) · p1o (tranh đồ vật, cảnh) · p2 (câu Wh-) · p2-yn · p2-or · p2-req · p2-st · p2t (bẫy) · p3 · gist · next · imp · g · p4 · p4-ty. Đọc: 7 bài Part 5 cũ + p5-det (sau p5-pron) · p6 (chọn từ theo cả đoạn) · p6-ins · p7 · p7-inf · p7-syn · p7-ins · p7c · p7m · time. Mã cũ giữ nguyên; bài p1, p2, p6 đổi tên / thu hẹp nội dung.
