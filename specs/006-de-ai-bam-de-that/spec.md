# Feature Specification: Đề AI bám cấu trúc đề thật

**Feature Branch**: `claude/ecstatic-curie-q9g1ja`

**Created**: 2026-11-07

**Status**: Clarified

**Input**: User description: "Dò lại đề do AI tạo có bám sát cấu trúc đề thực tế chưa. Nếu chưa thì chỉnh sửa." (người sáng lập, 7/11/2026, sau v141 🎯 Luyện đề AI và v142 tách 📚 Đề có sẵn · 🤖 Đề AI soạn)

## Kiểm kê hiện trạng (7/11/2026)

Claude đóng vai người ra đề IELTS, TOEIC, Cambridge. Đọc lời nhắc soạn đề, khuôn đầu ra và bộ máy kiểm của hàm máy chủ `de-ai` (bản đang chạy), so với mô tả công khai của đề thật.

- **Đã tra nguồn**: ielts.org (Nghe 4 phần × 10 câu, câu theo đúng thứ tự lời nghe, nghe 1 lần); tóm tắt bài Nghe C1 Advanced của Cambridge English (Phần 3: 6 câu, 4 lựa chọn); trang luyện thi (B2 First phần 1: 8 chỗ trống, 4 lựa chọn; viết lại câu từ khoá C1 3–6 từ, C2 3–8 từ; IELTS Đọc 3 bài, tổng ~2.000–2.750 từ, 40 câu).
- **Theo hiểu biết, chưa tra được nguồn chính thức**: viết lại câu từ khoá B2 2–5 từ; độ dài từng bài đọc Cambridge; số câu từng phần Nghe Cambridge (A2 5 · B1 6 · B2 10 · C1 8 · C2 9 câu điền).
- Máy chủ chưa có khoá `ANTHROPIC_API_KEY` nên chưa có đề AI thật nào để xem; rà dựa trên lời nhắc và máy kiểm (cái quyết định khuôn đề).

**Bảng** (✅ khớp · ⚠️ lệch · ❌ sai dạng / thiếu):

| # | Kỳ thi · dạng | Đề thật | Đề AI hiện tại | Tình trạng |
|---|---|---|---|---|
| I1 | IELTS Đọc, mỗi bài | 700–900 từ, 13–14 câu, 2–3 dạng, ~20 phút | 450–650 từ, 6–8 câu một dạng ("mọi dạng": 7–9 câu, 2 dạng) | ⚠️ |
| I2 | IELTS Đọc, thứ tự câu | T/F/NG, Y/N/NG, điền câu, trả lời ngắn, trắc nghiệm theo thứ tự bài | không bắt thứ tự | ⚠️ |
| I3 | IELTS Đọc, số dạng | 11+ dạng: thêm nối đặc điểm, nối nửa câu, tóm tắt có khung từ, ghi chú / bảng / lưu đồ, chọn HAI | 7 dạng | ❌ thiếu |
| I4 | IELTS Nghe | 4 phần × 10 câu; Part 1 hội thoại đời thường 2 người (điền phiếu), Part 2 độc thoại, Part 3 thảo luận học tập 2–4 người, Part 4 bài giảng (ghi chú ONE WORD ONLY); câu theo thứ tự lời nghe | 6–10 câu theo dạng, không gắn Part, không bắt thứ tự, không có ghi chú bài giảng | ⚠️ |
| I5 | IELTS Viết Task 1 (Academic) | biểu đồ đường / cột / tròn / bảng / quy trình / bản đồ | chỉ bảng số liệu | ⚠️ |
| I6 | IELTS Viết Task 2, thư GT | thư 3 ý + "Dear …"; Task 2 năm kiểu đề, 250 từ | như đề thật | ✅ |
| I7 | IELTS Nói Part 1 | ~3 chủ đề, chủ đề đầu về nơi ở / công việc / học tập, 4–5 phút | 4 câu, 1 chủ đề | ⚠️ |
| I8 | IELTS Nói Part 2 + 3 | thẻ đề "You should say" 3 ý + "and explain"; Part 3 4–6 câu | như đề thật | ✅ |
| T1 | TOEIC Part 2 | câu hỏi + 3 câu đáp, chỉ nghe | như đề thật (8 câu) | ✅ |
| T2 | TOEIC Part 3 / 4 | mỗi bài 3 câu, 4 lựa chọn; có câu hàm ý ("What does the man mean when he says…") | 3 câu, không có câu hàm ý | ⚠️ |
| T3 | TOEIC Part 5 / 6 | câu lẻ 4 lựa chọn; đoạn 4 chỗ trống có 1 câu chèn | như đề thật | ✅ |
| T4 | TOEIC Part 7 | 1–2 văn bản, 2–5 câu; có câu chèn câu [1]–[4], câu ý định trong chuỗi tin nhắn | không có 2 loại câu này | ⚠️ |
| C1 | Cambridge B2 → C2 điền trắc nghiệm / điền từ / tạo dạng từ | 8 chỗ trống | 6 | ⚠️ |
| C2 | Viết lại câu từ khoá | B2 2–5 từ · C1 3–6 · C2 3–8 | 5 cho mọi cấp | ⚠️ |
| C3 | Nghe trắc nghiệm | A2 → B2 3 lựa chọn; C1 / C2 phần phỏng vấn 4 lựa chọn | 3 cho mọi cấp | ⚠️ |
| C4 | Nghe điền | A2 5 · B1 6 · B2 10 · C1 8 · C2 9 câu | 6–8 | ⚠️ |
| C5 | Đọc bài dài trắc nghiệm | A2 / B1 5 câu, B2 → C2 6 câu; bài B2 → C2 dài hơn | 5–6 câu; bài B2 350–500 từ, C1 450–650 | ⚠️ |
| C6 | Starters / Movers | đề thật dựa nhiều vào tranh; dạng chữ có trong đề thật: Movers chọn câu đáp A–C, điền truyện bằng từ trong khung, điền trắc nghiệm 3 lựa chọn, đọc truyện điền 1–3 từ; Starters điền từ trong khung; nghe viết tên / số | AI có "đọc hiểu trắc nghiệm", "nghe trắc nghiệm chữ", "viết đoạn": không có trong đề thật | ❌ |
| C7 | Key / Preliminary Đọc phần 1 | 5–6 tin ngắn, mỗi tin 1 câu 3 lựa chọn | AI không có | ❌ thiếu |
| C8 | Viết A2 → C2 | A2 email 3 ý; B1 email / bài báo; B2 bài luận 2 ý + 1 ý mình; C1 bài luận chọn 2 / 3; C2 Part 2 | như đề thật | ✅ |

## Clarifications

### Session 2026-11-07

- Q: IELTS Đọc nên dài như đề thật, giữ bài ngắn, hay cả hai? → A: **Chỉ còn bài dài như đề thật**: mọi đề Đọc IELTS AI là 1 bài 700–900 từ, 13 câu, 2–3 dạng, 20 phút; dạng người học chọn là một nhóm 5–7 câu trong bài, "mọi dạng" thì AI chọn 2–3 dạng. Ước ~0,25 USD / đề (trước ~0,15; số ước, chưa đo vì chưa có khoá AI).
- Q: Starters / Movers? → A: **Thay bằng dạng chữ của đề thật**: bỏ "đọc hiểu trắc nghiệm", "nghe trắc nghiệm chữ", "viết đoạn"; thêm Movers chọn câu đáp, điền truyện bằng từ trong khung, điền trắc nghiệm 3 lựa chọn, đọc truyện điền 1–3 từ; Starters điền từ trong khung; nghe viết tên / số (cả 2 cấp).
- Q: Thêm dạng đề thật còn thiếu? → A: **Thêm hết dạng làm được bằng chữ**: IELTS Đọc nối đặc điểm, nối nửa câu, tóm tắt có khung từ, điền ghi chú / bảng / lưu đồ; Cambridge Key / Preliminary đọc tin ngắn.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Đề IELTS AI giống một bài / một phần của đề thật (Priority: P1)

Người ôn IELTS bấm 🤖 Đề AI soạn → Đọc hoặc Nghe. Đề nhận được có độ dài, số câu, thứ tự câu và bối cảnh như một bài đọc hoặc một Part nghe của đề thật.

**Why this priority**: đề lệch khuôn làm band ước sai và tập sai thói quen (quen câu không theo thứ tự, quen bài ngắn hơn đề thi). IELTS có 4 kỹ năng, nhiều dạng nhất.

**Independent Test**: máy chủ giả trả đề theo khuôn mới; test kiểm số câu, độ dài, thứ tự, Part.

**Acceptance Scenarios**:

1. **Given** người học chọn Nghe Part 4, **When** AI soạn xong, **Then** đề có 1 người nói (bài giảng), 10 câu ghi chú, mỗi đáp án ONE WORD ONLY có trong lời nghe, câu theo thứ tự lời nghe.
2. **Given** người học chọn Đọc T/F/NG, **When** máy kiểm nhận đề có câu không theo thứ tự bài, **Then** câu được xếp lại theo vị trí câu chứa đáp án trước khi tới người học.
3. **Given** người học chọn Đọc T/F/NG, **When** AI soạn xong, **Then** đề là 1 bài 700–900 từ, 13 câu, 2–3 dạng, có nhóm T/F/NG 5–7 câu, làm trong 20 phút.

---

### User Story 2 - Đề Cambridge đúng số câu, số lựa chọn, giới hạn từ của từng cấp (Priority: P1)

Người ôn Cambridge chọn cấp rồi một phần. Đề AI có đúng số chỗ trống, số câu, số lựa chọn, giới hạn từ như phần đó ở cấp đó (bảng C1–C5), tên đề ghi phần tương ứng của đề thật.

**Why this priority**: sửa ít, tác động rõ: B2 → C2 đang thiếu 2 chỗ trống mỗi bài, viết lại câu C1 / C2 đang chặn đáp án dài hơn 5 từ là đúng ở đề thật.

**Independent Test**: test gọi khuôn từng cấp × phần, so với bảng.

**Acceptance Scenarios**:

1. **Given** cấp B2, phần điền trắc nghiệm, **When** AI soạn, **Then** có 8 chỗ trống, mỗi chỗ 4 lựa chọn, tên đề "B2 First · Reading and Use of English Part 1".
2. **Given** cấp C2, viết lại câu từ khoá, **When** đáp án 7 từ, **Then** máy kiểm nhận (giới hạn 3–8 từ).
3. **Given** cấp C1, nghe phỏng vấn, **Then** mỗi câu 4 lựa chọn.

---

### User Story 3 - Starters / Movers chỉ có dạng của đề thật (Priority: P2)

Người học Pre-A1 / A1 (thường là trẻ em hoặc người mới) chỉ gặp dạng đề AI có trong đề Starters / Movers thật: bỏ 3 dạng không có trong đề thật (đọc hiểu trắc nghiệm, nghe trắc nghiệm chữ, viết đoạn), thay bằng dạng chữ có trong đề thật. Viết không còn đề AI ở 2 cấp này (đề thật viết theo tranh), vẫn có bài có sẵn ở 📚.

**Why this priority**: ít người học ở cấp này; đề thật dựa vào tranh nên AI chỉ làm được một phần.

**Independent Test**: danh sách dạng AI của Pre-A1 / A1 chỉ gồm dạng có trong khuôn đề thử `MOCK` của cấp đó; khuôn từng dạng đúng số câu.

**Acceptance Scenarios**:

1. **Given** cấp A1, Đọc, **When** mở hàng 🤖, **Then** có "Phần 2: chọn câu đáp" (5–6 câu, 3 lựa chọn) và không có "Đọc hiểu trắc nghiệm".
2. **Given** cấp Pre-A1, Nghe, **Then** có "Phần 2: nghe viết tên / số" (5 câu, đáp án 1 từ hoặc số).

---

### User Story 4 - Thêm dạng đề thật còn thiếu (Priority: P2)

Thêm các dạng đề thật làm được bằng chữ mà AI chưa có: IELTS Đọc nối đặc điểm, nối nửa câu, tóm tắt có khung từ, điền ghi chú / bảng / lưu đồ; Cambridge Key / Preliminary Đọc phần 1 tin ngắn.

**Why this priority**: tăng độ phủ; không sửa thì dạng thiếu vẫn còn bài có sẵn (📚) để luyện.

**Independent Test**: mỗi dạng mới có khuôn, máy kiểm, test với máy chủ giả, hiện đúng trên trang.

**Acceptance Scenarios**:

1. **Given** IELTS Đọc "nối nửa câu", **When** AI soạn, **Then** có danh sách nửa sau nhiều hơn số câu 2–3 cái, mỗi câu một đáp án.

---

### User Story 5 - Câu hỏi đúng loại trong dạng đang có (Priority: P2)

TOEIC Part 3 / 4 có câu hàm ý; Part 7 có câu chèn câu [1]–[4] hoặc câu ý định (chuỗi tin nhắn có giờ); IELTS Nói Part 1 có 3 chủ đề, chủ đề đầu về nơi ở / công việc / học tập; IELTS Viết Task 1 có biểu đồ đường / cột / tròn như đề thật, app vẽ từ số liệu AI đưa.

**Why this priority**: không đổi dạng, chỉ làm câu giống đề thật hơn.

**Independent Test**: test khuôn: Part 7 có câu chèn thì bài có đủ 4 dấu [1]–[4]; Task 1 có loại hình + số liệu vẽ được.

**Acceptance Scenarios**:

1. **Given** TOEIC Part 3, **When** AI soạn, **Then** có thể có 1 câu "What does the woman mean when she says '…'?" với câu trích có nguyên văn trong lời nghe.
2. **Given** IELTS Task 1, **When** AI chọn biểu đồ đường, **Then** trang vẽ biểu đồ đường từ số liệu, đề ghi "The graph below shows…".

### Edge Cases

- Đề cũ (khuôn cũ) đã lưu ở bảng `de_ai` và trên máy người học vẫn mở được, làm được, không bị máy kiểm phía trang chặn.
- Câu không có câu chứa đáp án → không xếp lại được → giữ chỗ cũ.
- AI trả ít câu hơn đề thật sau khi bỏ câu lệch (vd. 11 / 13) → vẫn dùng nếu ≥ ngưỡng tối thiểu của dạng.
- Câu trích ở câu hàm ý / câu chèn không có nguyên văn trong bài → bỏ câu đó.
- Biểu đồ AI đưa số không vẽ được (thiếu số, âm, quá nhiều cột) → lỗi khuôn, soạn lại.
- Chưa có khoá AI → giữ như hiện tại ("Chưa cài khoá AI").
- Trần 200 lượt / ngày không đổi; đề dài hơn tốn thêm token, không thêm lượt.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Mỗi dạng đề AI ghi phần tương ứng của đề thật ở tên đề (vd. "IELTS Listening Part 4", "B2 First · Reading and Use of English Part 1").
- **FR-002**: Với dạng mà đề thật theo thứ tự bài / lời nghe, câu hỏi tới người học theo thứ tự đó; máy kiểm xếp lại theo vị trí câu chứa đáp án; câu không định vị được giữ chỗ.
- **FR-003**: IELTS Nghe: mỗi đề AI là một Part của đề thật: 10 câu, đúng bối cảnh và số người nói (Part 1 2 người, đời thường; Part 2 1 người; Part 3 2–4 người, học tập; Part 4 1 người, bài giảng, ghi chú ONE WORD ONLY), lời nghe dài như một Part.
- **FR-004**: IELTS Đọc: mọi đề là 1 bài 700–900 từ (General Training phần 1: 4–7 văn bản ngắn, tổng 350–600 từ), 13 câu, 2–3 dạng, 20 phút; dạng người học chọn là một nhóm 5–7 câu; giới hạn từ ghi đúng câu chữ đề thật ("NO MORE THAN TWO WORDS AND/OR A NUMBER", "ONE WORD ONLY").
- **FR-005**: Cambridge: số chỗ trống, số câu, số lựa chọn, giới hạn từ, độ dài bài theo bảng C1–C5 cho từng cấp.
- **FR-006**: Starters / Movers: chỉ dạng chữ có trong đề thật (bảng ở User Story 3); không còn đề Viết AI ở Pre-A1 / A1.
- **FR-007**: Thêm 5 dạng: IELTS nối đặc điểm, nối nửa câu, tóm tắt có khung từ, điền ghi chú / bảng / lưu đồ; Cambridge A2 / B1 đọc tin ngắn (mỗi tin 1 câu 3 lựa chọn).
- **FR-008**: TOEIC Part 3 / 4 có thể có 1 câu hàm ý mỗi bài; Part 7 có thể có câu chèn câu (bài có đủ [1]–[4]) hoặc câu ý định (chuỗi tin nhắn có tên và giờ); câu trích phải có nguyên văn trong bài.
- **FR-009**: IELTS Nói Part 1: 3 chủ đề, chủ đề đầu về nơi ở / công việc / học tập, 9–12 câu.
- **FR-010**: IELTS Viết Task 1 (Academic): AI chọn biểu đồ đường, cột, tròn hoặc bảng; app vẽ bằng bộ vẽ biểu đồ sẵn có; đề ghi câu mở đầu đúng loại ("The graph / chart / table below shows…").
- **FR-011**: Máy kiểm khuôn (máy chủ + trang) kiểm theo khuôn mới; đề cũ vẫn mở được.
- **FR-012**: Không đổi luật đo; đề AI vẫn không tính 📘 Học / 🔁 Nhớ / Thi chuyển cấp; giữ trần 200 lượt AI / ngày; giữ nhãn "AI soạn, chưa giáo viên kiểm".
- **FR-013**: Test tự động kiểm khuôn từng dạng theo bảng đề thật bằng máy chủ giả.

### Key Entities

- **Dạng đề AI**: kỳ thi, cấp, kỹ năng, phần đề thật tương ứng, số câu, độ dài, số lựa chọn, giới hạn từ, có theo thứ tự không, bối cảnh / số người nói.
- **Đề AI đã lưu**: khuôn cũ vẫn đọc được bên cạnh khuôn mới.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Sau khi làm, bảng kiểm kê không còn dòng ❌; dòng ⚠️ chỉ còn ở chỗ có lý do ghi rõ (cần tranh, bản đồ, giọng thu sẵn).
- **SC-002**: Với máy chủ giả, đề đúng số câu / số lựa chọn / giới hạn từ của bảng ở 100% dạng (test).
- **SC-003**: Khi đã có khoá AI: ≥ 95% đề có câu theo thứ tự bài ở các dạng cần thứ tự (đo trên 20 đề thật đầu tiên).
- **SC-004**: Khi đã có khoá AI: người sáng lập hoặc giáo viên chấm "giống đề thật" ≥ 4 / 5 cho mỗi kỳ thi trên 20 đề đầu tiên.
- **SC-005**: Khi đã có khoá AI: chi phí trung bình đề Đọc IELTS ≤ 0,30 USD, các dạng khác ≤ 0,20 USD (đo bằng 🛠 "Đề AI: số lượt, token, tiền 7 ngày").

## Assumptions

- Cấu trúc đề thật theo mô tả công khai hiện hành (nguồn ghi ở Kiểm kê); chỗ chưa tra được ghi "theo hiểu biết".
- Chỉ theo khuôn đề, không chép đề thật (bản quyền), như v141.
- Dạng cần tranh / bản đồ (IELTS bản đồ, TOEIC Part 1, phần tranh Starters / Movers) không làm bằng AI ở đợt này: vẫn có bài có sẵn ở 📚.
- Máy chủ chưa có khoá → kiểm bằng máy chủ giả; đo thật khi người sáng lập cài khoá.
- Hàm máy chủ `de-ai` phải triển khai lại sau khi sửa; trang phát hành bản mới.
