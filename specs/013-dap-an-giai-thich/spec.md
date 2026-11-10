# Đặc tả: Đáp án giải thích chi tiết (Part 5–6 đề thử TOEIC trọn)

**Nhánh**: `claude/kiem-noi-dung-de-7l02h6` · **Ngày**: 10/11/2026 · **Trạng thái**: chờ duyệt kế hoạch

## Yêu cầu của người sáng lập

"Tôi muốn đáp án được thiết kế giống ảnh để dễ hiểu" (ảnh: bảng đáp án Part 5 của một trung tâm: STT · đề + 4 phương án · "Chọn (B)", nghĩa / loại từ từng phương án, lý do, cấu trúc hay dùng, "Dịch: …").

Đã làm rõ (10/11/2026):
1. Phạm vi: **Part 5–6 trước** (8 đề ≈ 368 câu). Xong, người sáng lập xem đúng ý rồi mới làm Part 7, Part 1–4.
2. Vị trí: **📋 Bài làm và đáp án** của đề thử trọn (màn xem lại `trRv`). Kho luyện chưa làm.
3. Bố cục: **thẻ xếp dọc** (không bảng 3 cột: iPhone mỗi cột ~100 px).

## Hiện trạng

Mỗi câu chỉ có `why` một dòng (vd. "Bổ nghĩa cho động từ submit cần trạng từ: directly."). Không có nghĩa từng phương án, không có bản dịch, không có cấu trúc.

## Người dùng thấy gì (US1)

Ở 📋 Bài làm và đáp án, chạm một câu Part 5 (hoặc một đoạn Part 6): mỗi câu là một thẻ:
- Số câu · đề (Part 6: câu chứa chỗ trống) · 4 phương án, đánh dấu ✓ Đáp án / ✗ Bạn chọn như hiện nay.
- Ô giải thích: **Chọn (B)** · dạng câu (từ loại, thì, giới từ…) · 4 dòng "(A) she: đại từ nhân xưng, chủ ngữ — cô ấy" · **Vì sao** (2–3 câu: dấu hiệu trong câu → loại phương án nào) · **Cấu trúc hay dùng** (nếu có) · **Dịch:** cả câu tiếng Việt.
- Part 6 câu chèn: nghĩa 4 câu chèn + vì sao câu đúng nối mạch + dịch câu được chèn.

## Yêu cầu

- FR-001 Nguồn: thêm trường `gt` vào câu Part 5 / chỗ trống Part 6 ở nguồn (`content/toeic/tron/deNN.json` cho Đề 3–8; câu kho trong `content/toeic/doc.json` cho Đề 1–2). `gt = { og: { "<phương án>": "<loại từ: nghĩa>" }, ly: "…", ct: "…" (tuỳ chọn), dich: "…" }`. Khoá theo chữ phương án nên không lệch khi cân bằng đáp án.
- FR-002 Không đổi đề: `gt` không vào dấu nội dung (`strip` ở kiem-toeic.mjs) → không phải giải mù lại, không đổi chữ đáp án, "đã xem" giữ.
- FR-003 Bộ dựng kiểm: đủ 4 phương án trong `og`, có `ly` và `dich`; `ly` không mâu thuẫn đáp án (nhắc đáp án đúng); câu thiếu `gt` thì màn xem lại dùng `why` như cũ.
- FR-004 Giao diện: thẻ xếp dọc theo biến màu / cỡ chữ chung; 320 px không tràn ngang; chữ ≥ 15 px; tương phản ≥ 4,5 : 1 sáng / tối.
- FR-005 Không đổi luật đo, không đổi điểm, không gọi AI.

## Tiêu chí thành công

- SC-001 368 / 368 câu Part 5–6 của 8 đề có `gt` đủ trường.
- SC-002 Người sáng lập xem Đề 1 Part 5 trên iPhone và nói "đúng ý" trước khi soạn 7 đề còn lại (mốc dừng).
- SC-003 Test xanh; e2e có bước mở thẻ giải thích.

## Giới hạn

Lời giải do Claude soạn, chưa giáo viên kiểm. Chỉ học bố cục của ảnh, không chép nội dung của trung tâm trong ảnh.
