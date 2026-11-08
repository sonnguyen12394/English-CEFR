# Feature Specification: Đề thử TOEIC trọn 200 câu, đúng giờ thật

**Feature Branch**: `claude/ecstatic-curie-q9g1ja` · **Created**: 2026-11-08 · **Status**: Clarified (chờ người sáng lập "ok" kế hoạch)

**Input**: "Làm đề thử trọn 200 câu đúng giờ thật đi" (người sáng lập, 8/11/2026, sau khi hỏi cấu trúc đề và quy chế thi TOEIC thật).

## Hiện trạng (8/11/2026)
- Đề thử TOEIC của app (`toMock`, toeic.js) là bản rút gọn: Nghe ~19 câu / 20 phút, Đọc ~33 câu / 30 phút; mỗi màn một câu, tự bấm sang câu, không quay lại.
- Đề thật (ETS): Nghe 100 câu ~45 phút (Part 1: 6 · Part 2: 25 · Part 3: 39 = 13 bài · Part 4: 30 = 10 bài), máy phát liên tục, nghe 1 lần; Đọc 100 câu 75 phút (Part 5: 30 · Part 6: 16 = 4 đoạn · Part 7: 54 = 29 câu văn bản đơn + 25 câu nhiều văn bản: 2 bộ 2 văn bản + 3 bộ 3 văn bản, mỗi bộ 5 câu), được làm theo thứ tự tuỳ ý trong 75 phút.
- Kho: Part 1 12 · Part 2 60 · Part 3 28 bài · Part 4 27 bài · Part 5 118 · Part 6 24 đoạn · Part 7 văn bản đơn 19 bộ / 56 câu · 2 văn bản 5 bộ (3–5 câu) · 3 văn bản 3 bộ (4–5 câu). Thiếu cho 2 đề: 3 bộ 3 văn bản, câu thứ 5 ở vài bộ nhiều văn bản, ~1 bộ văn bản đơn.

## Clarifications
### Session 2026-11-08
- Nhịp Nghe → **tự chạy như thi thật**: máy phát liên tục; Part 1–2 có 5 giây trả lời sau mỗi câu, Part 3–4 có thời gian cho 3 câu hỏi sau mỗi bài; không dừng, không nghe lại, không quay lại.
- Đọc → **75 phút, được nhảy câu và quay lại**: bảng 100 ô, đánh dấu câu xem lại, sửa đáp án đến khi nộp hoặc hết giờ.
- Tạm dừng → **không dừng, vào lại làm tiếp**: Đọc tính giờ theo đồng hồ thật kể cả khi thoát app; Nghe mở lại thì phát lại từ bài đang dở (iPhone dừng âm thanh khi app ở nền), ghi số lần gián đoạn.
- Số đề → **2 đề cố định, soạn thêm Part 7**: Đề 1, Đề 2 không trùng câu, đúng 200 câu và đúng cơ cấu từng Part.

## User Stories
### US1 (P1) Làm trọn một đề như thi thật
Người ôn TOEIC chọn Đề 1 hoặc Đề 2, đeo tai nghe, bấm Bắt đầu: Nghe 100 câu tự chạy, sang Đọc 100 câu 75 phút, nộp bài, xem điểm ước từng phần và từng Part.
**Acceptance**: đủ 200 câu đúng cơ cấu; Nghe không có nút dừng / nghe lại; Đọc có bảng câu, đánh dấu, quay lại; hết 75 phút tự nộp; kết quả có điểm ước Nghe / Đọc / tổng, đúng / sai từng Part, thời gian, xem lại câu sai (lời nghe + giải thích).
### US2 (P2) Lỡ thoát app vẫn làm tiếp
**Acceptance**: mở lại trong 3 giờ thấy "Làm tiếp đề thử đang dở"; Đọc còn đúng số phút theo đồng hồ thật; Nghe phát lại bài đang dở, các bài trước giữ nguyên đáp án; kết quả ghi số lần gián đoạn.
### US3 (P3) So tiến bộ
**Acceptance**: màn chọn đề ghi kết quả lần trước của từng đề; kết quả lần sau so với lần trước cùng đề.

## Requirements
- FR-001 Hai đề cố định khai báo ở `content/toeic/tron.json` (danh sách mã câu / bài theo Part), dựng vào `toeic.json` bằng `node tools/build-toeic.mjs`; bộ dựng dừng nếu sai số câu từng Part, trùng câu giữa 2 đề, mã không có.
- FR-002 Part 7 nhiều văn bản: mỗi bộ đúng 5 câu; mỗi đề 2 bộ 2 văn bản + 3 bộ 3 văn bản.
- FR-003 Điểm ước theo tỉ lệ đúng (`toScale`), ghi rõ không phải bảng quy đổi ETS; vào lịch sử `S.to.mock` (`full: 1`, mã đề) và bản đồ điểm (`toLog`, nguồn 'thi').
- FR-004 KHÔNG đổi luật đo (luyện thi không tính 📘 Học / 🔁 Nhớ / Thi chuyển cấp).
- FR-005 Âm thanh: giọng Kokoro có sẵn (n/), thiếu thì giọng máy; phát bị chặn thì hiện "▶ Bấm để nghe tiếp" và chưa tính giờ trả lời.

## Success Criteria
- SC-001 Bộ dựng xanh: 2 đề × 200 câu, cơ cấu 6 / 25 / 39 / 30 / 30 / 16 / 54, không trùng.
- SC-002 Test chạy đề nhanh (hệ số giờ) từ đầu đến kết quả không lỗi.
- SC-003 Người sáng lập làm thử trên iPhone: Nghe tự chạy hết Part 1 không phải bấm (mốc dừng: nếu iPhone chặn tự phát, đổi sang "bấm để nghe" từng bài).

## Rủi ro / lệch so với đề thật (chấp nhận)
- Tranh Part 1 là tranh vẽ, không phải ảnh chụp; giọng máy / Kokoro, không phải giọng thu chuẩn ETS.
- Câu có bảng: kho chỉ 3 bài Part 3 + 3 bài Part 4 (đề thật 3 + 2 mỗi đề) nên chia đều 2 đề, mỗi đề ít hơn thật.
- Thời gian Nghe phụ thuộc độ dài âm thanh của app, ước 38–45 phút.
