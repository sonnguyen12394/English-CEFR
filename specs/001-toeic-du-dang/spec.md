# Feature Specification: TOEIC đủ dạng câu (bài học + bài tập theo từng dạng)

**Feature Branch**: `claude/happy-shannon-5j2r27`

**Created**: 2026-11-07

**Status**: Draft

**Input**: User description: "Phần mục tiêu toeic xem xét lại các dạng bài học và bài tập xem có đủ chưa, nếu chưa đủ thì làm thêm cho đủ" (người sáng lập, 7/11/2026). Không đổi luật đo CEFR (luyện thi không tính).

## Kiểm kê hiện trạng (7/11/2026)

Claude đóng vai giáo viên luyện TOEIC + người ra đề, đối chiếu từng dạng câu của đề thật TOEIC Listening & Reading (mô tả công khai của ETS, cách chia dạng thông dụng của sách luyện thi) với kho của app.

Hiện có: 📘 20 bài học (Nghe 7, Đọc 12, Từ công sở 1). Kho: Part 1 12 tranh · Part 2 50 câu · Part 3 25 hội thoại · Part 4 25 bài nói · Part 5 108 câu (7 dạng) · Part 6 20 đoạn · Part 7 20 bộ · 300 từ công sở. 🏋️ Bài tập theo Part, Part 5 theo dạng, câu từng sai, tốc độ; chưa có bài tập theo dạng câu cho Part 1–4, 6, 7.

**Bảng dạng câu** (chuẩn "đủ" của đặc tả này; ✅ = đã đủ, ⚠️ = có nhưng thiếu, ❌ = chưa có; cột tình trạng xét bài học + kho câu, còn bài tập riêng theo dạng thì hiện chỉ Part 5 có, User Story 2 áp cho mọi dạng):

| # | Part · dạng câu (đề thật) | 📘 Bài học | 🏋️ Kho bài tập | Tình trạng |
|---|---|---|---|---|
| L1 | Part 1 · Tranh có người | chung 1 bài | 7 tranh | ⚠️ chưa tách bài học |
| L2 | Part 1 · Tranh đồ vật, cảnh (has been / is being) | chung 1 bài | 5 tranh | ⚠️ chưa tách bài học |
| L3 | Part 2 · Câu hỏi Wh- | có | 27 câu | ✅ |
| L4 | Part 2 · Câu hỏi Yes / No (cả phủ định, câu đuôi, câu hỏi gián tiếp) | ❌ | 9 câu | ❌ bài học |
| L5 | Part 2 · Câu hỏi lựa chọn (A hay B) | ❌ | 5 câu | ❌ bài học, kho mỏng |
| L6 | Part 2 · Đề nghị, nhờ vả, mời | ❌ | 7 câu | ❌ bài học |
| L7 | Part 2 · Câu trần thuật (không phải câu hỏi) | ❌ | 2 câu | ❌ bài học, kho rất mỏng (đề thật ~3–4 / 25 câu) |
| L8 | Part 2 · 4 kiểu bẫy | có | 50 câu | ✅ |
| L9 | Part 3–4 · Câu hỏi chung (chủ đề, mục đích, nơi, người nói) | nằm trong bài chung | nhiều | ⚠️ chưa có bài học riêng |
| L10 | Part 3–4 · Câu hỏi chi tiết | bài chung Part 3, Part 4 | nhiều | ✅ |
| L11 | Part 3–4 · Câu hỏi việc sắp làm, đề nghị, yêu cầu | nằm trong bài chung | nhiều | ⚠️ chưa có bài học riêng |
| L12 | Part 3–4 · Câu hàm ý | có | 3 câu (Part 3 chỉ 1) | ⚠️ kho mỏng |
| L13 | Part 3–4 · Câu có bảng | có | 6 bài | ✅ |
| L14 | Part 3 · Hội thoại 3 người | trong bài Part 3 | 3 bài | ✅ |
| L15 | Part 4 · Loại bài nói (tin nhắn thoại, thông báo, quảng cáo, bản tin, giới thiệu, tham quan, họp) | ❌ | 25 bài, 0 quảng cáo | ❌ bài học, thiếu quảng cáo |
| R1–R7 | Part 5 · 7 dạng (dạng từ, động từ, giới từ, liên từ, đại từ, so sánh / đảo ngữ, từ vựng) | 7 bài | 108 câu | ✅ |
| R8 | Part 5 · Từ hạn định, lượng từ (each, every, all, another, other…) | ❌ | 0 | ❌ |
| R9 | Part 6 · Chọn từ theo cả đoạn (thì theo ngữ cảnh, từ nối giữa câu, đại từ) | bài chung | 60 chỗ, gần hết là dạng từ trong một câu | ⚠️ thiếu câu cần cả đoạn |
| R10 | Part 6 · Chèn câu | nằm trong bài chung | 19 chỗ, 3 phương án sai lạc đề hẳn ("Water boils at 100 degrees") | ⚠️ quá dễ, không luyện đúng kỹ năng |
| R11 | Part 7 · Mục đích, chi tiết (một văn bản) | có | nhiều | ✅ |
| R12 | Part 7 · Câu suy luận, câu NOT | nằm trong bài chung | suy luận ~10, NOT 1 | ⚠️ bài học, NOT mỏng |
| R13 | Part 7 · Từ gần nghĩa nhất ("closest in meaning to") | ❌ | 2 câu | ❌ |
| R14 | Part 7 · Chèn câu vào vị trí [1]–[4] | nằm trong bài chung | 1 câu | ❌ |
| R15 | Part 7 · Chuỗi tin nhắn, câu ý định | có | 2 bộ | ⚠️ kho mỏng |
| R16 | Part 7 · Nhiều văn bản (2–3 văn bản, câu đối chiếu) | có | 5 bộ đôi, 3 bộ ba | ✅ |
| R17 | Quản lý giờ Đọc | có | luyện tốc độ | ✅ |
| V1 | Từ công sở | có | 300 từ | ✅ |

Kết luận: 33 dạng; 16 dạng đủ bài học + kho; 17 dạng thiếu bài học riêng, kho mỏng hoặc câu sai kiểu; 26 dạng (trừ 7 dạng Part 5) chưa có bài tập riêng theo dạng.

## Clarifications

### Session 2026-11-07

- Q: Đợt này làm đủ cả bảng dạng câu TOEIC hay chỉ lấp các dạng chưa có gì? → A: Làm đủ cả bảng (17 dạng thiếu + bài tập riêng cho mọi dạng).
- Q: Có viết lại phương án sai của câu chèn Part 6 ở cả 19 đoạn cũ không? → A: Có, sửa cả 19 đoạn cũ; đoạn mới cũng làm đúng kiểu.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Mỗi dạng câu có một bài học riêng (Priority: P1)

Người học ôn TOEIC mở 🎧 Nghe hoặc 📰 Đọc, thấy danh sách 📘 bài học theo đúng thứ tự đề thật; mỗi dạng câu của bảng trên là một bài: dạng này là gì, cách làm, ví dụ có lời giải (câu thật trong kho), bẫy, làm thử 3 câu cùng dạng.

**Why this priority**: Sách luyện thi dạy theo dạng câu (Part 2 theo loại câu hỏi, Part 7 theo loại câu hỏi). Không có bài học riêng thì người học gặp câu trần thuật, câu từ gần nghĩa, câu chèn [1]–[4] lần đầu ngay trong đề.

**Independent Test**: Mở từng bài học mới: có đủ 5 phần, ví dụ đúng dạng, làm thử 3 câu đúng dạng, không ghi kết quả.

**Acceptance Scenarios**:

1. **Given** người học mở 🎧 Nghe TOEIC, **When** xem danh sách 📘 Dạng câu, **Then** có bài riêng cho mọi dạng L1–L15 (dạng chung một bài thì ghi rõ trong bài).
2. **Given** người học mở bài "Part 2: Câu trần thuật", **When** xem ví dụ, **Then** ví dụ là một câu trần thuật thật trong kho, có lời giải và loại bẫy của từng lời đáp sai; làm thử 3 câu đều là câu trần thuật.
3. **Given** người học làm thử xong một bài học, **When** về màn kỹ năng, **Then** bài đó ghi "đã học", điểm ước và bản đồ không đổi.

---

### User Story 2 - Mỗi dạng câu có bài tập riêng (Priority: P1)

Từ bài học (nút "🏋️ Bài tập dạng này") hoặc từ "Thêm" của màn kỹ năng, người học luyện đúng dạng vừa học: câu lẻ (Part 1, 2, 5) thì một lượt ~5–8 câu của dạng đó; dạng nằm trong bài nhiều câu (Part 3, 4, 6, 7) thì một lượt 2 bài có dạng đó, làm cả bài như đề thật.

**Why this priority**: Học dạng xong phải luyện ngay dạng đó; hiện chỉ Part 5 làm được.

**Independent Test**: Bấm "🏋️ Bài tập dạng này" ở mỗi bài học mới: lượt luyện chỉ gồm câu / bài có đúng dạng; làm xong thì kết quả ghi như luyện thường (danh sách bài, điểm ước, bản đồ).

**Acceptance Scenarios**:

1. **Given** bài học "Câu hàm ý", **When** bấm "🏋️ Bài tập dạng này", **Then** mở lượt có 2 bài nghe, mỗi bài có câu hàm ý; bài chưa làm trước.
2. **Given** màn 📰 Đọc TOEIC, **When** mở "Thêm" → luyện theo dạng câu, **Then** thấy nút cho từ gần nghĩa, chèn câu [1]–[4], câu NOT / suy luận, tin nhắn (ý định).
3. **Given** kho của một dạng hết bài chưa làm, **When** luyện dạng đó, **Then** app lấy bài làm lâu nhất (không báo lỗi).

---

### User Story 3 - Kho đủ bài tượng trưng cho mọi dạng (Priority: P2)

Mỗi dạng có ít nhất vài câu / bài tượng trưng (chuẩn v129 của người sáng lập): đủ cho ví dụ + 3 câu làm thử + ít nhất một lượt bài tập không trùng ví dụ.

**Why this priority**: Bài học và bài tập ở P1 cần câu để chạy; một số dạng chỉ có 0–2 câu.

**Independent Test**: Đếm kho theo dạng: mỗi dạng đạt mức tối thiểu ở FR-010.

**Acceptance Scenarios**:

1. **Given** kho Part 2, **When** đếm câu trần thuật, **Then** có ≥ 8 câu, mỗi câu 3 lời đáp, đúng một, có nhãn bẫy, có giọng đọc tự nhiên.
2. **Given** kho Part 7, **When** đếm câu từ gần nghĩa / chèn câu / câu NOT / câu ý định, **Then** mỗi loại ≥ 4 câu ở ≥ 3 bộ khác nhau.

---

### User Story 4 - Câu chèn Part 6 luyện đúng kỹ năng (Priority: P2)

Câu chèn Part 6 của đề thật có 4 câu cùng chủ đề; chọn đúng nhờ mạch văn (từ nối, đại từ, thì). Câu chèn của app phải như vậy, không có phương án lạc đề.

**Why this priority**: Phương án lạc đề làm câu quá dễ, người học quen đoán "câu nào cùng chủ đề" và mất điểm ở đề thật.

**Independent Test**: Đọc mọi câu chèn Part 6: 3 phương án sai đều nói về chủ đề của đoạn nhưng sai mạch (nhắc điều chưa có, sai thời gian, ngược ý câu trước / sau); không câu nào có 2 đáp án hợp lý.

**Acceptance Scenarios**:

1. **Given** một đoạn Part 6 bất kỳ, **When** xem câu chèn, **Then** 4 phương án cùng chủ đề đoạn văn; lời giải nói vì sao 3 câu kia không nối được.
2. **Given** các đoạn Part 6 mới, **When** đếm chỗ trống, **Then** có câu chọn thì theo ngữ cảnh và câu từ nối giữa hai câu (mỗi loại ≥ 4 chỗ).

---

### Edge Cases

- Người học đã "đã học" bài học Part 2 / Part 6 / Part 7 cũ: bài cũ giữ mã nên vẫn ghi đã học sau khi đổi tên / thu hẹp nội dung.
- Bộ 10 câu Part 2, Part 5 trong danh sách bài tập đánh số theo vị trí: câu mới thêm vào cuối kho để các bộ cũ không đổi câu.
- Máy chưa có tệp giọng cho câu mới: app đọc bằng giọng máy như hiện nay.
- Mục tiêu không phải TOEIC: vẫn xem và luyện được, không tính phút luyện đề (như hiện nay).
- Dạng mới của Part 5 (lượng từ) thêm một ô vào bản đồ điểm; không có dữ liệu thì ô "chưa làm".

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Mỗi dạng L1–L15, R1–R17, V1 trong bảng dạng câu MUST có đúng một 📘 bài học (các dạng gộp trong một bài thì bài đó nói rõ các dạng con), theo khuôn bài học kỳ thi hiện có: dạng này là gì → cách làm → ví dụ có lời giải → bẫy → làm thử 3 câu (không ghi kết quả).
- **FR-002**: Ví dụ và câu làm thử của mỗi bài học MUST đúng dạng của bài (vd. bài câu trần thuật chỉ lấy câu trần thuật).
- **FR-003**: Thứ tự bài học MUST theo thứ tự đề thật (Part 1 → 4, Part 5 → 7), dạng chung trước dạng con.
- **FR-004**: Bài học cũ MUST giữ mã để trạng thái "đã học" không mất.
- **FR-005**: Mỗi dạng MUST có bài tập riêng mở được từ bài học ("🏋️ Bài tập dạng này") và từ "Thêm" của màn kỹ năng (luyện theo dạng câu).
- **FR-006**: Bài tập theo dạng: Part 1, 2, 5 lấy câu lẻ đúng dạng (5–15 câu một lượt); Part 3, 4, 6, 7 lấy 2 bài có dạng đó, làm cả bài. Bài chưa làm / làm lâu nhất trước.
- **FR-007**: Kết quả bài tập theo dạng MUST ghi như luyện hiện nay (danh sách bài, điểm ước, bản đồ điểm); cách ước điểm và luật bản đồ không đổi.
- **FR-008**: Part 4 MUST có ít nhất 2 bài quảng cáo; mỗi bài nói Part 4 có nhãn loại bài nói để bài học loại bài nói chọn ví dụ và câu làm thử.
- **FR-009**: Part 5 MUST có dạng thứ 8 "Từ hạn định, lượng từ" (≥ 8 câu), có mẹo chữa ở bản đồ điểm và ở cẩm nang như 7 dạng cũ.
- **FR-010**: Kho tối thiểu theo dạng: Part 1 mỗi loại tranh ≥ 5 · Part 2 mỗi loại câu hỏi ≥ 7 (câu trần thuật ≥ 8) · câu hàm ý Part 3–4 ≥ 6 (Part 3 ≥ 3) · bài quảng cáo Part 4 ≥ 2 · Part 5 lượng từ ≥ 8 · Part 6: câu thì theo ngữ cảnh ≥ 4, câu từ nối giữa câu ≥ 4 · Part 7: từ gần nghĩa ≥ 6, chèn câu [1]–[4] ≥ 4, câu NOT ≥ 4, câu ý định ≥ 4 (mỗi loại ở ≥ 3 bộ).
- **FR-011**: Câu chèn Part 6 MUST có 4 phương án cùng chủ đề đoạn văn; 3 phương án sai vì không nối được mạch (nhắc điều chưa có, sai thời gian, ngược ý câu trước / sau), không vì lạc đề. Áp cho cả 19 đoạn cũ (viết lại phương án sai, giữ đáp án đúng và mã bài) và mọi đoạn mới; lời giải nói vì sao 3 câu kia không nối được.
- **FR-012**: Công cụ dựng kho MUST kiểm dạng mới: câu Part 2 phân loại được, câu từ gần nghĩa có từ được hỏi trong văn bản, câu chèn [1]–[4] có đủ 4 vị trí trong văn bản, câu chèn Part 6 có phương án cùng chủ đề (có từ chung với đoạn), không trùng mã, đáp án có trong phương án.
- **FR-013**: Câu nghe mới (Part 2, 3, 4) MUST có giọng đọc tự nhiên như câu cũ.
- **FR-014**: Nội dung mới MUST ghi "Claude soạn, chưa giáo viên kiểm", vào bảng kiểm giáo viên; tên người / công ty bịa; không chép đề ETS.
- **FR-015**: Luật đo CEFR (📘 Học / 🔁 Nhớ / Thi chuyển cấp) MUST không đổi; luyện TOEIC vẫn không tính.
- **FR-016**: Phạm vi đợt này: đủ cả bảng dạng câu (17 dạng thiếu được bổ sung bài học / kho; bài tập riêng theo dạng cho mọi dạng).

### Key Entities

- **Dạng câu**: một hàng của bảng dạng câu; thuộc một Part và một kỹ năng (Nghe / Đọc / Từ công sở); có tên, cách nhận ra (từ đầu câu hỏi, nhãn trong kho).
- **Bài học**: một dạng câu (hoặc nhóm dạng); nội dung chữ + ví dụ + câu làm thử; trạng thái đã học của người học.
- **Bài tập theo dạng**: một lượt luyện chỉ gồm câu / bài có dạng đó; kết quả ghi như luyện thường.
- **Câu / bộ câu**: câu Part 1, 2, 5 (lẻ) hoặc bài Part 3, 4, 6, 7 (nhiều câu); có nhãn dạng.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 33 / 33 dạng trong bảng có bài học riêng (hoặc nằm trong bài nói rõ dạng đó) với ví dụ có lời giải và 3 câu làm thử đúng dạng (hiện 16 / 33).
- **SC-002**: 33 / 33 dạng có bài tập riêng mở được trong ≤ 2 chạm từ màn kỹ năng và 1 chạm từ bài học (hiện 7 / 33, chỉ Part 5).
- **SC-003**: Mọi dạng đạt kho tối thiểu FR-010 (kiểm tự động).
- **SC-004**: 0 / 23 câu chèn Part 6 (19 cũ + 4 mới) có phương án lạc đề; 0 câu có 2 đáp án đúng khi Claude soát lại.
- **SC-005**: Kiểm dựng kho và bộ test tự động qua hết; chưa kiểm trên iPhone thì ghi rõ.
- **SC-006**: 100% câu nghe mới có tệp giọng tự nhiên.
- **SC-007** (sau phát hành, cần người học thật): ≥ 2 người ôn TOEIC thật học ≥ 5 bài học mới trong 2 tuần; hỏi lại: bài nào khó hiểu, dạng nào còn thiếu.

## Assumptions

- "Đủ" theo chuẩn người sáng lập v129 (3/11/2026): mỗi dạng có bài học + vài bài tượng trưng, không cần số lượng như sách luyện thi.
- Bảng dạng câu là ý kiến chuyên môn của Claude (đề TOEIC L&R từ 2016, áp dụng ở Việt Nam từ 2019, và cách chia dạng của sách luyện thi), chưa giáo viên kiểm.
- Bản đồ điểm giữ ô như hiện nay, chỉ thêm ô Part 5 lượng từ; không thêm ô cho từng loại câu Part 2 / Part 7 (tránh rối màn, chưa có dữ liệu thật).
- Dữ liệu thật (kiểm kê v136): chưa người học nào dùng TOEIC, nên đổi tên / tách bài học không ảnh hưởng tiến độ ai.
- Giọng đọc dựng bằng bộ đọc đã dùng (Kokoro) trên máy soạn; mạng tải được mô hình.
- Ngoài phạm vi: Nói / Viết TOEIC (không thuộc L&R), bài học "diễn đạt lại" riêng (để sau, khi có người học thật cần), đổi cách ước điểm.
