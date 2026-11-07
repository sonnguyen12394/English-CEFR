# Feature Specification: IELTS đủ dạng (bài học + bài tập theo từng dạng)

**Feature Branch**: `claude/happy-shannon-5j2r27`

**Created**: 2026-11-07

**Status**: Draft

**Input**: User description: "Làm tương tự với ielts" (người sáng lập, 7/11/2026, sau v139 TOEIC đủ dạng câu): rà các dạng bài học và bài tập của mục tiêu IELTS theo đề thật, thiếu thì làm thêm cho đủ. Không đổi luật đo CEFR (luyện thi không tính).

## Kiểm kê hiện trạng (7/11/2026)

Claude đóng vai giáo viên luyện IELTS + người ra đề, đối chiếu dạng câu / dạng bài của đề thật IELTS (Academic và General Training; mô tả công khai của IDP / British Council, cách chia dạng của sách luyện thi) với kho của app.

Hiện có: 📘 31 bài học (Đọc 15 Academic / 16 GT · Nghe 6 · Viết 7 Academic / 3 GT · Nói 3). Kho: Đọc 15 bài học thuật (430–700 từ) + 2 bộ GT · Nghe 9 phần (90 câu) · Viết Task 1 13 đề, thư GT 6, Task 2 12 đề (đều có bài mẫu) · Nói 20 chủ đề Part 1, 18 thẻ Part 2 (kèm câu Part 3). Bài tập theo dạng: Đọc đủ 13 dạng; Nghe chỉ "điền phiếu" và "trắc nghiệm"; Viết theo Task (Task 1 / Task 2 ngẫu nhiên); Nói theo Part.

**Bảng dạng** (chuẩn "đủ" của đặc tả này; ✅ đủ · ⚠️ có nhưng thiếu · ❌ chưa có):

| # | Kỹ năng · dạng (đề thật) | 📘 Bài học | 🏋️ Bài tập riêng | Kho | Tình trạng |
|---|---|---|---|---|---|
| L1 | Nghe · điền phiếu, ghi chú, bảng, lưu đồ | có | có | 5 phần | ✅ |
| L2 | Nghe · điền câu, trả lời ngắn | có | ❌ | 1 phần (7 câu) | ⚠️ |
| L3 | Nghe · trắc nghiệm một đáp án | có | có | 4 phần | ✅ |
| L4 | Nghe · chọn HAI đáp án | có | ❌ | 2 phần | ⚠️ |
| L5 | Nghe · bản đồ, sơ đồ, mặt bằng | có | ❌ | 1 phần (5 câu) | ⚠️ kho mỏng; bản đồ chỗ yếu mở đúng bài chỉ ~50% |
| L6 | Nghe · ghép (matching) | có | ❌ | 3 phần | ⚠️ |
| R1–R16 | Đọc · 11 dạng đề thật + chọn HAI, điền bảng, văn bản GT, diễn đạt lại, quản lý giờ | có | có | ≥ 3 bài mỗi dạng | ✅ |
| W1 | Viết · Task 1 xu hướng (đường, cột) | có | ⚠️ mở Task 1 ngẫu nhiên | 4 đề | ⚠️ |
| W2 | Viết · Task 1 bảng, biểu đồ tròn | có | ⚠️ | 2 đề | ⚠️ |
| W3 | Viết · Task 1 bản đồ | có | ⚠️ | 3 đề | ⚠️ |
| W4 | Viết · Task 1 quy trình | có | ⚠️ | 3 đề | ⚠️ |
| W5 | Viết · Task 1 hai biểu đồ | có | ⚠️ | 1 đề | ⚠️ |
| W6 | Viết · thư GT (trang trọng, nửa trang trọng, thân mật) | có | có | 6 đề | ✅ |
| W7 | Viết · Task 2 nhận kiểu đề | có | có | 12 đề | ✅ |
| W8 | Viết · Task 2 đồng ý hay không (opinion) | ❌ | ❌ | 3 đề + bài mẫu | ❌ |
| W9 | Viết · Task 2 bàn hai quan điểm (discussion) | ❌ | ❌ | 3 đề + bài mẫu | ❌ |
| W10 | Viết · Task 2 lợi và hại | ❌ | ❌ | 2 đề + bài mẫu | ❌ |
| W11 | Viết · Task 2 vấn đề và giải pháp | ❌ | ❌ | 2 đề + bài mẫu | ❌ |
| W12 | Viết · Task 2 hai câu hỏi | ❌ | ❌ | 2 đề + bài mẫu | ❌ |
| W13 | Viết · Task 2 bố cục bài luận | có | có | 12 đề | ✅ |
| W14–W17 | Viết · 4 tiêu chí chấm (hoàn thành đề, mạch lạc, vốn từ, ngữ pháp) | ❌ (chỉ mẹo ngắn ở bản đồ) | viết bài bất kỳ | — | ❌ bản đồ báo yếu theo tiêu chí nhưng không có bài học |
| S1–S3 | Nói · Part 1, Part 2, Part 3 | có | có | 20 chủ đề, 18 thẻ | ✅ |
| S4 | Nói · Part 2 các nhóm thẻ đề (người, nơi chốn, đồ vật, sự kiện, hoạt động…) | ❌ | Part 2 | 18 thẻ | ❌ |
| S5 | Nói · Part 3 các kiểu câu hỏi (ý kiến, so sánh xưa – nay, dự đoán, nguyên nhân – giải pháp, so sánh hai nhóm) | ❌ | Part 3 | ~54 câu | ❌ |
| S6–S9 | Nói · 4 tiêu chí chấm (trôi chảy, vốn từ, ngữ pháp, phát âm) | ❌ (chỉ mẹo ngắn ở bản đồ) | nói bài bất kỳ | — | ❌ |

Kết luận: 48 dạng; 24 đủ; 24 thiếu bài học riêng, bài tập riêng hoặc kho mỏng. Lỗi cũ: bản đồ chỗ yếu chữa "Nghe trả lời ngắn" mở bài Part 2 / 3 không có dạng đó; chữa "Nghe bản đồ" chỉ đúng khi bốc trúng bài có bản đồ.

## Clarifications

### Session 2026-11-07

- Q: Có làm thêm 8 bài học tiêu chí chấm Viết / Nói không? → A: Có, làm 8 bài tiêu chí.
- Q: Có viết thêm bài đọc dài như đề thật (700–900 từ) không? → A: Có, thêm 2 bài dài.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Task 2 từng kiểu bài luận có bài học riêng (Priority: P1)

Người ôn IELTS mở ✍️ Viết, thấy 5 bài học Task 2 theo kiểu đề: đồng ý hay không, bàn hai quan điểm, lợi và hại, vấn đề và giải pháp, hai câu hỏi. Mỗi bài: kiểu đề này nhận ra thế nào, bố cục riêng của kiểu đó, bài mẫu chia đoạn có nhãn đúng vai trò (vd. "Thân bài 2: giải pháp"), bẫy, làm thử nhận ra vai trò các đoạn của một bài mẫu khác cùng kiểu.

**Why this priority**: Task 2 tính gấp đôi Task 1; lỗi hay gặp nhất là trả lời thiếu phần đề hỏi, mà mỗi kiểu đề đòi bố cục khác nhau. Hiện chỉ có một bài chung cho cả 5 kiểu.

**Independent Test**: Mở từng bài: ví dụ là bài mẫu đúng kiểu, nhãn đoạn đúng vai trò; làm thử dùng bài mẫu khác cùng kiểu.

**Acceptance Scenarios**:

1. **Given** người học mở bài "Task 2: Vấn đề và giải pháp", **When** xem ví dụ, **Then** bài mẫu là đề vấn đề – giải pháp, các đoạn ghi "Mở bài", "Thân bài 1: vấn đề / nguyên nhân", "Thân bài 2: giải pháp", "Kết luận".
2. **Given** làm thử xong, **When** về màn Viết, **Then** bài ghi "đã học", band ước và bản đồ không đổi.

---

### User Story 2 - Mỗi dạng có bài tập riêng (Priority: P1)

Nút "🏋️ Bài tập dạng này" ở bài học (và "Thêm" của màn kỹ năng) mở đúng dạng: Nghe theo dạng câu (một phần nghe có dạng đó, làm cả phần như đề thật), Viết Task 1 đúng loại biểu đồ, Task 2 đúng kiểu đề.

**Why this priority**: Hiện bài "Task 1: bản đồ" bấm bài tập có thể ra biểu đồ cột; Nghe chỉ luyện riêng được 2 / 6 dạng.

**Independent Test**: Bấm bài tập ở mỗi bài học: đề / phần nghe mở ra có đúng dạng của bài.

**Acceptance Scenarios**:

1. **Given** bài học "Task 1: bản đồ", **When** bấm "🏋️ Bài tập dạng này", **Then** mở một đề Task 1 bản đồ (đề viết lâu nhất chưa làm trước).
2. **Given** màn 🎧 Nghe → Thêm, **When** bấm "Bản đồ", **Then** mở một phần nghe có câu bản đồ, làm cả phần, kết quả ghi như luyện thường.
3. **Given** bản đồ chỗ yếu báo "Nghe trả lời ngắn" yếu, **When** bấm chữa, **Then** mở phần nghe có câu trả lời ngắn (không mở bài Part 2 / 3 khác dạng).

---

### User Story 3 - Bài học 4 tiêu chí chấm Viết / Nói (Priority: P2)

Mỗi tiêu chí chấm Viết (hoàn thành đề, mạch lạc, vốn từ, ngữ pháp) và Nói (trôi chảy, vốn từ, ngữ pháp, phát âm) là một bài học: giám khảo xem gì, cách nâng tiêu chí, ví dụ câu / đoạn band thấp so với band cao kèm lời giải, bẫy, làm thử 3 câu "câu nào cao band hơn ở tiêu chí này". Bản đồ báo tiêu chí nào yếu thì bài học đó lên đầu, ghi "yếu".

**Why this priority**: Bản đồ chỗ yếu Viết / Nói báo theo tiêu chí, nhưng người học không có bài nào để học tiêu chí đó.

**Independent Test**: Đặt tiêu chí "Viết · Mạch lạc" yếu: bài học "Mạch lạc" lên đầu danh sách, có ví dụ và 3 câu làm thử.

---

### User Story 4 - Nói Part 2 theo nhóm thẻ, Part 3 theo kiểu câu hỏi (Priority: P3)

Hai bài học Nói: "Part 2: các nhóm thẻ đề" (nhận nhóm thẻ, chuẩn bị một câu chuyện dùng được cho nhiều thẻ) và "Part 3: các kiểu câu hỏi" (mỗi kiểu một khung trả lời). Làm thử: nhận nhóm của thẻ / kiểu của câu hỏi thật trong kho.

**Why this priority**: Cách dạy chuẩn của lớp luyện IELTS; dùng lại kho có sẵn, ít nội dung mới.

**Independent Test**: Mở 2 bài: ví dụ là thẻ / câu hỏi thật trong kho, làm thử 3 câu đúng nhóm / kiểu.

---

### User Story 5 - Kho Nghe bản đồ đủ để luyện (Priority: P3)

Thêm một phần Nghe Part 2 có mặt bằng tòa nhà (plan labelling), để dạng bản đồ có ≥ 2 phần và có cả hai kiểu đề thật (bản đồ ngoài trời, mặt bằng trong nhà).

**Independent Test**: Kho Nghe có ≥ 2 phần có câu bản đồ, phần mới có giọng đọc tự nhiên.

### User Story 6 - Bài đọc dài như đề thật (Priority: P3)

Thêm 2 bài đọc học thuật 750–900 từ, 13–14 câu, nhiều dạng câu, để "⏱ Cả bài có giờ" và đề thử tập được sức đọc như thi thật (bài của app hiện 430–704 từ).

**Independent Test**: Kho có 2 bài ≥ 750 từ; mở "Cả bài có giờ" gặp được bài dài; câu hỏi đúng khuôn (kiểm lúc dựng như bài cũ).

### Edge Cases

- Người thi General Training: không thấy bài học / bài tập Task 1 biểu đồ (như hiện nay); Task 2 và tiêu chí thì có.
- Bài học cũ giữ mã ("đã học" không mất); bài học mới thêm vào đúng chỗ trong danh sách theo thứ tự học.
- Máy không chép được lời: bài học Nói vẫn xem và làm thử được (làm thử là trắc nghiệm); bài tập Nói báo cần Safari trên iPhone như hiện nay.
- Kho một dạng hết bài chưa làm: lấy bài làm lâu nhất.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Viết MUST có 5 bài học Task 2 theo kiểu đề (W8–W12), mỗi bài có ví dụ = bài mẫu đúng kiểu chia đoạn có nhãn vai trò, làm thử = nhận vai trò đoạn của bài mẫu khác cùng kiểu.
- **FR-002**: Nhãn vai trò đoạn của 12 bài mẫu Task 2 MUST đúng nội dung từng đoạn (ghi tay, công cụ dựng kho kiểm số nhãn = số đoạn).
- **FR-003**: "🏋️ Bài tập dạng này" MUST mở đúng dạng: Task 1 theo loại biểu đồ của bài, Task 2 theo kiểu đề của bài, Nghe theo dạng câu của bài (một phần nghe có dạng đó, làm cả phần).
- **FR-004**: Màn Nghe → Thêm MUST có bài tập theo 6 dạng câu; màn Viết → Thêm MUST có Task 1 theo 5 loại (chỉ Academic) và Task 2 theo 5 kiểu.
- **FR-005**: Bản đồ chỗ yếu chữa dạng Nghe (bản đồ, ghép, trả lời ngắn) MUST mở phần nghe có đúng dạng đó.
- **FR-006**: Nói MUST có bài học "Part 2: các nhóm thẻ đề" và "Part 3: các kiểu câu hỏi", làm thử dùng thẻ / câu hỏi thật trong kho.
- **FR-007**: Viết và Nói MUST có 8 bài học tiêu chí chấm (W14–W17, S6–S9); mỗi bài nối với ô tiêu chí của bản đồ (yếu thì lên đầu, ghi "yếu"), có ví dụ band thấp / band cao kèm lời giải, 3 câu làm thử; "🏋️ Bài tập dạng này" mở một đề viết / một lượt nói bất kỳ (mọi đề đều chấm đủ 4 tiêu chí).
- **FR-008**: Kho Nghe MUST có ≥ 2 phần có câu bản đồ (thêm 1 phần mặt bằng tòa nhà, Part 2), có giọng đọc tự nhiên, kiểm lúc dựng (chữ cái trên mặt bằng đủ, đáp án có trên mặt bằng).
- **FR-009**: Kết quả bài tập ghi như luyện thường (band ước, bản đồ band); cách ước band, luật bản đồ không đổi; luật đo CEFR không đổi.
- **FR-011**: Đọc MUST có thêm 2 bài học thuật dài như đề thật (750–900 từ, 13–14 câu, mỗi bài ≥ 3 dạng câu khác nhau), dùng được ở "Cả bài có giờ", danh sách bài đọc, đề thử và bài tập theo dạng.
- **FR-010**: Bài học mới MUST ghi "Claude soạn, chưa giáo viên kiểm", vào bảng kiểm giáo viên; không chép đề IELTS; tên người / nơi bịa.

### Key Entities

- **Dạng**: một hàng của bảng dạng (dạng câu Nghe / Đọc, loại Task Viết, kiểu đề Task 2, phần thi Nói, tiêu chí chấm).
- **Bài học**: một dạng; trạng thái đã học của người học; dạng yếu trên bản đồ lên đầu.
- **Bài tập theo dạng**: một lượt luyện / một đề đúng dạng; kết quả ghi như luyện thường.
- **Bài mẫu Task 2**: đề + bài mẫu + nhãn vai trò từng đoạn.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 48 / 48 dạng có bài học (hoặc nằm trong bài nói rõ dạng đó) với ví dụ và ≥ 3 câu làm thử (hiện 24 / 48).
- **SC-002**: Mọi dạng có bài tập đúng dạng, mở trong 1 chạm từ bài học và ≤ 2 chạm từ màn kỹ năng (hiện Nghe 2 / 6, Viết Task 1 0 / 5, Task 2 theo kiểu 0 / 5).
- **SC-003**: Bản đồ chữa "Nghe bản đồ / ghép / trả lời ngắn" mở đúng phần có dạng đó 100% (hiện ~50% / 100% / 0%).
- **SC-004**: Kiểm dựng kho và bộ test tự động qua hết; chưa kiểm trên iPhone thì ghi rõ.
- **SC-006**: Kho Đọc học thuật có ≥ 2 bài 750–900 từ (hiện 0; dài nhất 704 từ).
- **SC-005** (sau phát hành, cần người học thật): ≥ 2 người ôn IELTS dùng ≥ 2 tuần; hỏi lại bài học Task 2 / tiêu chí có giúp viết rõ bố cục hơn không.

## Assumptions

- "Đủ" theo chuẩn người sáng lập v129: mỗi dạng có bài học + vài bài tượng trưng; không cần số lượng như sách luyện thi.
- Bảng dạng là ý kiến chuyên môn của Claude (đề IELTS hiện hành; 4 tiêu chí chấm Viết / Nói theo band descriptors công khai), chưa giáo viên kiểm.
- Đọc đã đủ dạng (v123, v132): không thêm dạng Đọc.
- Bản đồ band giữ ô cũ (dạng câu + 4 tiêu chí mỗi kỹ năng), không thêm ô.
- Dữ liệu thật (kiểm kê v136): chưa người học nào dùng IELTS; thêm / đổi tên bài học không ảnh hưởng tiến độ ai.
- Ngoài phạm vi: thư GT theo mục đích, Nghe "summary completion" / sơ đồ máy móc (hiếm), đổi cách chấm Viết / Nói.
