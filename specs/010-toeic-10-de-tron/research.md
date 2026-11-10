# Research: Thêm 10 đề thử TOEIC trọn 200 câu

## R1. Câu mới để ở đâu
- **Decision**: mỗi đề một tệp nguồn `content/toeic/tron/deNN.json` chứa đủ câu theo thứ tự đề; bộ dựng ra `toeic-tron/deN.json`; `toeic.json` chỉ ghi `{ id, t, f }`.
- **Rationale**: người sáng lập chọn "chỉ trong đề thử trọn". Câu không vào `TO.p1…p7` nên mọi chỗ luyện (danh sách bài, bài học, luyện theo dạng, bản đồ chữa, đề thử rút gọn, đếm "còn N bài") không thấy, không cần sửa từng chỗ. `toeic.json` giữ ~230 KB (gộp vào sẽ thành ~1 MB, tải mỗi lần mở màn TOEIC).
- **Alternatives**: gộp vào kho + cờ `tron` (phải lọc ở ~10 chỗ, dễ sót); gộp vào `toeic.json` mục `tron` (phình tệp).

## R2. Kiểm đáp án khi không có giáo viên
- **Decision**: người sáng lập chọn "soạn đáp án cùng lúc với đề". Thêm trường `ev` (câu trích chứa đáp án, nguyên văn) cho câu Part 3, 4, 7 (trừ câu NOT và câu chèn [1]–[4]); bộ dựng dừng khi `ev` không có trong lời nghe / bài đọc. Part 6 có giải thích `why` như kho. Claude tự soát từng đợt; ghi số câu sửa.
- **Rationale**: buộc mỗi đáp án có chỗ dựa trong bài; bắt được lỗi hay gặp nhất (đáp án nói điều bài không nói). `ev` còn hiện ở kết quả (📍 câu chứa đáp án, hoclai.js `hlEv`).
- **Alternatives**: phiên phụ giải lại không xem đáp án (người sáng lập không chọn: tốn thêm lượt); chờ giáo viên (chưa có).

## R3. Kiểm trùng
- **Decision**: chuẩn hoá chữ (thường, bỏ dấu câu, gộp khoảng trắng) rồi so: câu hỏi Part 2, câu Part 5, lời Part 3, bài Part 4, đoạn Part 6, văn bản Part 7, 4 câu tả Part 1, với cả kho cũ và các đề khác. Trùng nguyên văn = lỗi.
- **Rationale**: đủ để bắt chép lại; câu do Claude soạn mới nên khả năng trùng ý thấp.
- **Sửa ở đợt 2 (v150)**: giả định "trùng ý thấp" SAI: quét theo từ thấy 28 câu Part 2 / Part 5 chỉ đổi 1–2 chữ so với kho hoặc đề khác (Claude viết lại câu đã gặp mà không nhận ra). Thêm luật: Jaccard theo từ (tập từ chữ thường) ≥ 0,6 với câu hỏi Part 2, ≥ 0,55 với câu Part 5, so với kho + mọi đề = lỗi. Ngưỡng chọn theo các cặp thật đã gặp (cặp gần trùng thấp nhất 0,56; cặp khác hẳn thường < 0,5); Part 3, 4, 6, 7 quét câu mở đầu / tiêu đề chưa thấy cặp nào, chưa chặn.

## R4. Cơ cấu và dạng câu mỗi đề (cố định, bộ dựng kiểm)
- **Decision**:
  - Part 1: 6 tranh (4 có người, 2 cảnh); đáp án A–D không chữ nào quá 3.
  - Part 2: 25 câu: hỏi Wh- 12 · Yes / No 5 · lựa chọn 2 · đề nghị 3 · trần thuật 3; mỗi chữ A / B / C ≤ 11.
  - Part 3: 13 hội thoại × 3 câu: 2 hội thoại 3 người; 3 hội thoại cuối có bảng; ≥ 2 câu hàm ý.
  - Part 4: 10 bài nói × 3 câu: 2 bài cuối có bảng; ≥ 2 câu hàm ý; ≥ 4 loại bài nói.
  - Part 5: 30 câu, đủ 8 dạng (gợi ý: dạng từ 6 · động từ 5 · giới từ 4 · liên từ 3 · đại từ 3 · lượng từ 2 · cấu trúc 2 · từ vựng 5).
  - Part 6: 4 đoạn × 4 chỗ, mỗi đoạn 1 câu chèn; cả đề ≥ 1 từ nối, ≥ 1 thì theo ngữ cảnh.
  - Part 7: văn bản đơn 10 bộ = 2 · 2 · 2 · 2 · 3 · 3 · 3 · 4 · 4 · 4 câu (29 câu), 2 chuỗi tin nhắn có câu ý định, 2 câu chèn [1]–[4], ≥ 2 câu từ gần nghĩa, ≥ 1 câu NOT; rồi 2 bộ 2 văn bản, 3 bộ 3 văn bản, mỗi bộ 5 câu, mỗi bộ ≥ 1 câu đối chiếu (`x: 1`).
- **Rationale**: cơ cấu từng Part là của ETS (đã kiểm chứng); số câu từng dạng trong một đề theo mô tả của giới luyện thi (ETS không công bố).

## R5. Độ khó "như đề thật"
- **Decision**: mỗi Part dễ dần sang khó: Part 5 10 câu đầu dạng từ / động từ rõ dấu hiệu, 10 câu cuối từ vựng, cấu trúc, liên từ; Part 3–4 bài đầu ngắn, ít bẫy; Part 7 văn bản ngắn trước, bộ nhiều văn bản cuối. Từ vựng công sở mức B1–C1.
- **Rationale**: người sáng lập chọn "như đề thật"; ETS không công bố phân bố, đây là cách đề luyện thường làm.

## R6. Giọng đọc
- **Decision**: `tools/build-audio.py` đọc thêm `toeic-tron/*.json`, gán giọng như kho (Part 1 một giọng / tranh; Part 2 câu hỏi một giới, lời đáp giới kia; Part 3 A nữ · B nam · C nữ thứ hai; Part 4 một giọng). Cài lại kokoro-onnx 0.6.1 + mô hình v1.0 trên máy soạn; không cài được thì phát hành với giọng máy và ghi rõ.
- **Rationale**: như kho cũ; tệp giọng khoá theo nội dung câu nên không đụng tệp cũ.

## R7. Tranh Part 1
- **Decision**: cách vẽ hiện có (`toPic`: nền in / out / sea, khối màu, biểu tượng); mỗi tranh chỉ một câu tả đúng; câu sai dùng bẫy của đề thật (is being + V3 khi không ai làm, sai vật, sai vị trí).
- **Rationale**: như v127; ảnh chụp không làm được.

## R8. Tải đề trong totron.js
- **Decision**: `trLoad(de)` tải `toeic-tron/deN.json` (theo `f`) rồi `trB` dựng như cũ (đơn vị, đánh số 1–200, xáo phương án cố định theo đề). Đề 1–2 vẫn dựng từ kho. Tải trước khi vẽ màn sẵn sàng, khi vào lại đề dở và ở test.
- **Rationale**: thay đổi nhỏ nhất ở bộ chạy; màn chọn đề không cần tải 10 tệp.

## R9. Nhịp và mốc dừng
- **Decision**: đợt 0 (khung) + đợt 1 (Đề 3–4) phát hành cùng bản; sau đợt 1 dừng chờ người sáng lập. Mỗi đợt sau 2 đề.
- **Rationale**: người sáng lập chọn theo đợt 2 đề; lỗi chung (độ khó, khuôn) lộ ra sớm, chỉ phải sửa 2 đề.
