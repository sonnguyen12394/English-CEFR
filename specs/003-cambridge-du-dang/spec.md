# Feature Specification: Cambridge đủ dạng (bài học + bài tập theo từng dạng của đề thật)

**Feature Branch**: `claude/happy-shannon-5j2r27`

**Created**: 2026-11-07

**Status**: Clarified

**Input**: User description: "Làm tương tự với mục tiêu còn lại" (người sáng lập, 7/11/2026, sau v139 TOEIC và v140 IELTS đủ dạng): rà bài học (📘) và bài tập (🏋️) của mục tiêu 🎓 Cambridge theo đề thật 7 cấp; dạng nào thiếu hoặc sai thì làm cho đủ. Không đổi luật đo; luyện thi không tính vào 📘 Học / 🔁 Nhớ / Thi chuyển cấp.

"Mục tiêu còn lại" = 🎓 Cambridge: 4 loại mục tiêu của app là 📈 Giỏi lên · 🌏 IELTS · 💼 TOEIC · 🎓 Cambridge; IELTS, TOEIC đã làm; 📈 Giỏi lên học bằng 🧱 Nền 7 kỹ năng, không có đề thi nên không có "dạng đề".

## Kiểm kê hiện trạng (7/11/2026)

Claude đóng vai giáo viên luyện thi Cambridge + người ra đề, đối chiếu từng phần của đề thật (mô tả công khai của Cambridge English cho Pre A1 Starters, A1 Movers, A2 Key, B1 Preliminary, B2 First, C1 Advanced, C2 Proficiency; hiểu biết của Claude, chưa giáo viên kiểm) với kho, bài học (v131) và bài tập (v122) của app.

Hiện có: mỗi PHẦN của khuôn đề thử 7 cấp có một 📘 bài học (dạng là gì, cách làm, ví dụ có lời giải, 3 câu làm thử) và ít nhất một bài tập; bài Viết mỗi cấp chỉ là MỘT phần chung ("Phần 1–2: email, bài báo / truyện"…); kho đề Viết B1 → C2 có 10 đề mỗi cấp, đều ghi thể loại và có bài mẫu.

**Bảng dạng** (✅ đủ · ⚠️ có nhưng thiếu / mỏng · ❌ chưa có hoặc sai dạng):

| # | Dạng (đề thật) | Cấp | 📘 Bài học | 🏋️ Bài tập | Kho | Tình trạng |
|---|---|---|---|---|---|---|
| R1 | Đọc phần 1: tin nhắn, thông báo, biển báo ngắn (mỗi câu 1 văn bản 15–40 từ, 3 phương án) | A2, B1 | gộp với bài đọc dài | bài đọc dài 70–280 từ | 0 bộ | ❌ sai dạng |
| R2 | Đọc: nối câu với người / người với văn bản | A2, B1 | có | có | 3 bộ | ✅ |
| R3 | Đọc: bài dài trắc nghiệm | A2 → C2 | có | có | 3 bộ / cấp | ✅ |
| R4 | Đọc: khuyết câu | B1, B2 | có | có | tự sinh | ✅ |
| R5 | Đọc: khuyết đoạn | C1, C2 | có | có | 1 bộ / cấp | ⚠️ mỏng |
| R6 | Đọc: so ý 4 văn bản; nối câu với đoạn | B2 → C2 | có | có | 3 bộ | ✅ |
| U1 | Dùng tiếng Anh: điền trắc nghiệm, điền từ, tạo dạng từ, viết lại câu từ khoá | A2 → C2 | có | có | 2–3 bộ | ✅ |
| W1 | Viết: email, thư (thân mật, trang trọng) | A2 → C2 | ⚠️ chung một bài | ⚠️ đề lẫn thể loại | A2 8 · B1 5 · B2 2 · C1 2 · C2 2 | ⚠️ |
| W2 | Viết: bài báo (article) | B1, B2, C2 | ⚠️ chung | ⚠️ | B1 3 · B2 1 · C2 2 | ⚠️ |
| W3 | Viết: truyện | B1 | ⚠️ chung | ⚠️ | 2 (trùng tên đề) | ⚠️ |
| W4 | Viết: bài luận (essay) | B2, C1 | ⚠️ chung | ⚠️ | B2 3 · C1 3 | ⚠️ |
| W5 | Viết: nhận xét (review) | B2, C1, C2 | ⚠️ chung | ⚠️ | 2 · 2 · 1 | ⚠️ |
| W6 | Viết: báo cáo (report) | B2, C1, C2 | ⚠️ chung | ⚠️ | 2 · 1 · 2 | ⚠️ |
| W7 | Viết: đề xuất (proposal) | C1 | ⚠️ chung | ⚠️ | 2 | ⚠️ |
| W8 | Viết: tóm tắt + đánh giá 2 đoạn (C2 phần 1) | C2 | có | có | 3 | ✅ |
| W9 | Viết: truyện theo tranh (A2 phần 7) | A2 | có | có | 1 bộ | ⚠️ mỏng |
| W10–W13 | Viết: 4 tiêu chí chấm (nội dung · hiệu quả giao tiếp · bố cục · ngôn ngữ) | B1 → C2 | ❌ | — | — | ❌ |
| S1 | Nói: phỏng vấn | mọi cấp | có | có | | ✅ |
| S2 | Nói: tả / so sánh ảnh, nói dài một mình | B1 → C2 | có | có | 2 bộ ảnh / cấp | ✅ |
| S3 | Nói: thảo luận cặp (một câu hỏi + 5 gợi ý, đáp lời bạn, hỏi lại, cùng chốt) | A2 → C2 | ❌ bài học dạy đóng vai (gọi món, mua bán) | có (👥 nói cặp 3 bộ / cấp) | 15 bộ | ❌ sai dạng; đề thử Nói phần này cũng là đóng vai |
| S4 | Nói: thảo luận mở rộng | A2 → C2 | có | | | ✅ |
| S5 | Thứ tự phần Nói đúng đề thật | A2 (2 phần), C2 (3 phần) | ghi "Phần 1–4" như B1 / B2 | | | ❌ sai nhãn |
| S6–S9 | Nói: 4 tiêu chí chấm (ngữ pháp và từ vựng · tổ chức lời nói · phát âm · tương tác) | A2 → C2 | ❌ | — | — | ❌ (đề thử Nói đã chấm theo 4 tiêu chí này) |
| L1 | Nghe: chọn tranh | Starters → B1 | có | có | A2 1 bộ · B1 1 bộ (Starters / Movers tự sinh) | ⚠️ mỏng |
| L2 | Nghe: điền thông tin, điền câu | A2 → C2 | có | có | 20–41 bài | ✅ |
| L3 | Nghe: hội thoại, phỏng vấn trắc nghiệm | A2 → C2 | có | có | 20–42 bài | ✅ |
| L4 | Nghe: nối người nói | B2 → C2 | có | có | 3 bộ / cấp | ✅ |
| L5 | Nghe: nối người với vật / ngày | Movers, A2 | có | có | 1 bộ / cấp | ⚠️ mỏng |
| Y1 | Starters, Movers: các phần còn lại (nối tên, viết tên, tô màu, yes / no, chọn từ, truyện tranh, câu đáp, chọn từ đúng, tả tranh, Nói theo tranh) | Pre-A1, A1 | có | có | 1 bộ mỗi phần (15 phần) | ⚠️ mỏng |

Kết luận: chỗ **sai dạng** 3 (R1, S3, S5); **thiếu bài học / bài tập riêng** 15 (W1–W7 theo thể loại, W10–W13, S6–S9); **kho mỏng** (1 bộ) 21 phần (R5 ×2, W9, L1 ×2, L5 ×2, Y1 ×15 gồm cả Nói theo tranh). Các dạng còn lại đủ.

## Clarifications

### Session 2026-11-07

- Q: Có làm dày các phần chỉ có 1 bộ luyện (21 phần, phần lớn Starters / Movers) không? → A: Không; đợt này chỉ lấp dạng thiếu và sửa chỗ sai (Viết theo thể loại, Nói thảo luận cặp, Đọc tin ngắn A2 / B1, tiêu chí chấm). Kho mỏng để đợt sau.
- Q: Có làm bài học tiêu chí chấm Viết / Nói của Cambridge như IELTS không? → A: Có, làm hết: 4 bài Viết + 4 bài Nói.
- Q: Đề thử Nói phần thảo luận có đổi từ đóng vai sang thảo luận cặp như đề thật không? → A: Có, đổi sang thảo luận cặp; phần Tương tác chấm bằng đáp lời, nêu lý do, hỏi lại, chốt như 👥 Nói cặp.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Viết theo thể loại có bài học và bài tập riêng (Priority: P1)

Người ôn B1 → C2 mở ✍️ Viết của cấp mình, thấy bài học theo từng thể loại đề thật có (B1: email, bài báo, truyện; B2: bài luận, email / thư, bài báo, báo cáo, nhận xét; C1: bài luận, email / thư, đề xuất, báo cáo, nhận xét; C2: tóm tắt luận, bài báo, thư, báo cáo, nhận xét). Mỗi bài: thể loại này để làm gì, người đọc là ai, giọng văn, bố cục, câu mở / kết hay dùng; ví dụ là đề + bài mẫu đúng thể loại, chia đoạn, kèm bố cục thường gặp của thể loại; làm thử 3 câu (nhận ra thể loại của đề, giọng văn, câu mở / kết, đặc điểm của thể loại). Nút "🏋️ Bài tập dạng này" mở một đề đúng thể loại, đề chưa viết trước.

**Why this priority**: Viết là một bài thi riêng (B1 25%, B2 → C2 20–25% điểm); đề thật bắt chọn thể loại ở phần 2 và mỗi thể loại có bố cục, giọng văn riêng. Hiện chỉ có một bài học chung.

**Independent Test**: mở bài "Báo cáo" ở B2: ví dụ là đề báo cáo + bài mẫu báo cáo + bố cục thường gặp; làm thử đủ 3 câu; "Bài tập dạng này" mở một đề báo cáo.

**Acceptance Scenarios**:

1. **Given** người học ở B2, **When** mở ✍️ Viết, **Then** danh sách 📘 có bài chung cũ và 5 bài thể loại của B2, theo thứ tự đề thật.
2. **Given** bài "Truyện" ở B1, **When** bấm "🏋️ Bài tập dạng này", **Then** mở một đề truyện chưa viết (không có thì đề viết lâu nhất).
3. **Given** cấp có thể loại chỉ 1 đề trong kho, **When** mở bài học, **Then** làm thử vẫn đủ 3 câu (lấy đề cùng thể loại ở cấp gần nhất, hoặc câu không cần đề thứ hai).

---

### User Story 2 - Nói phần thảo luận cặp đúng đề thật (Priority: P1)

Người ôn A2 → C2 mở 🗣 Nói, thấy bài học "thảo luận cặp" đúng dạng đề thật: một câu hỏi với 5 gợi ý, hai người lần lượt nêu ý, đáp lời bạn, hỏi lại ý bạn, rồi cùng chốt một lựa chọn. Ví dụ là một nhiệm vụ thật trong kho 👥 nói cặp (câu hỏi, gợi ý, lời mẫu của hai người, câu chốt); làm thử 3 câu chọn câu đáp tốt nhất. Thứ tự và tên các phần Nói đúng đề thật của từng cấp (A2: 2 phần; B1, B2, C1: 4 phần; C2: 3 phần).

**Why this priority**: bài học hiện dạy đóng vai (gọi món, mua bán) — dạng không có trong đề Cambridge; người học chuẩn bị sai việc.

**Independent Test**: mở bài thảo luận cặp ở B2: ví dụ có câu hỏi + 5 gợi ý + lời mẫu; không còn chữ "đóng vai"; danh sách bài Nói C2 ghi Phần 1 phỏng vấn · Phần 2 thảo luận cặp · Phần 3 nói dài + thảo luận.

**Acceptance Scenarios**:

1. **Given** người học ở A2, **When** mở 🗣 Nói, **Then** các bài ghi đúng 2 phần của đề A2 Key.
2. **Given** bài thảo luận cặp, **When** làm thử, **Then** 3 câu hỏi "Bạn đáp thế nào?" với một câu đáp tốt (đáp lời + lý do + hỏi lại / chốt) và câu kém hơn.

---

### User Story 3 - Đọc phần 1 tin ngắn đúng dạng (Priority: P2)

Người ôn A2 / B1 làm phần 1 Đọc như đề thật: mỗi câu một tin nhắn, thông báo, biển báo hay email ngắn, chọn 1 trong 3 câu nói đúng ý văn bản. Có bài học (dạng này là gì, cách làm, bẫy: phương án lặp đúng từ trong văn bản nhưng sai ý), bài tập riêng và đề thử dùng đúng dạng.

**Why this priority**: dạng thật không có trong app; phần này hiện dùng bài đọc dài.

**Independent Test**: đề thử Đọc A2 có "Phần 1: tin nhắn, thông báo" 6 câu ngắn; B1 có 5 câu; mỗi văn bản ≤ 40 từ, 3 phương án.

**Acceptance Scenarios**:

1. **Given** đề thử Đọc A2, **When** làm phần 1, **Then** 6 văn bản ngắn khác nhau, mỗi văn bản một câu hỏi 3 phương án.
2. **Given** màn Đọc A2, **When** xem danh sách bài tập, **Then** có các bộ tin ngắn (ít nhất 2 bộ mỗi cấp).

---

### User Story 4 - Bài học tiêu chí chấm Viết / Nói của Cambridge (Priority: P2)

Người ôn B1 → C2 có 4 bài học tiêu chí Viết (nội dung, hiệu quả giao tiếp, bố cục, ngôn ngữ) và người ôn A2 → C2 có 4 bài tiêu chí Nói (ngữ pháp và từ vựng, tổ chức lời nói, phát âm, tương tác). Mỗi bài: giám khảo nhìn gì, ví dụ hai đoạn khác mức cùng một ý + vì sao, 3 câu làm thử.

**Why this priority**: đề thử Nói của app đã chấm theo 4 tiêu chí này nhưng không có chỗ học; đề thật chấm Viết theo 4 tiêu chí.

**Independent Test**: mở bài "Hiệu quả giao tiếp" ở B2: có ví dụ thấp / cao và 3 câu làm thử.

---

### Ngoài phạm vi đợt này

- Làm dày 21 phần chỉ có 1 bộ luyện (R5, W9, L1, L5, Starters / Movers): để đợt sau, khi có người học dùng thật cho biết phần nào cần thêm.
- 📈 Giỏi lên (🧱 Nền 7 kỹ năng): không có đề thi, không thuộc đợt này.

### Edge Cases

- Cấp "+" (A2+, B1+, B2+) dùng cùng đề với cấp gốc: bài học / bài tập theo cấp gốc.
- Thể loại chỉ có 1 đề ở một cấp (B2 bài báo, C1 báo cáo, C2 nhận xét): làm thử và bài tập lấy đề cùng thể loại ở cấp liền kề, ghi rõ cấp.
- Hai đề B1 "The Wrong Bus" trùng tên: bỏ trùng hoặc đổi một đề cho khác nội dung.
- Trình duyệt không chép được lời nói: bài học Nói vẫn xem và làm thử được (chọn đáp án), bài tập Nói báo cần Safari như cũ.
- Mã bài học cũ giữ nguyên để không mất dấu "đã học".

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Mỗi dạng ở bảng trên có 📘 bài học: dạng là gì, cách làm, ví dụ có lời giải, bẫy, ≥ 3 câu làm thử đúng dạng (trừ bài chỉ có nội dung đã có từ trước).
- **FR-002**: Viết B1 → C2 có một bài học cho mỗi thể loại của đề thật cấp đó; ví dụ là đề + bài mẫu đúng thể loại chia đoạn + bố cục thường gặp của thể loại; làm thử nhận ra thể loại, giọng văn, câu mở / kết, đặc điểm.
- **FR-003**: "🏋️ Bài tập dạng này" của bài thể loại mở một đề đúng thể loại (đề chưa viết trước, rồi đề viết lâu nhất); "Thêm" của màn Viết có nút theo thể loại.
- **FR-004**: Bài học thảo luận cặp dùng nhiệm vụ trong kho 👥 nói cặp; không còn nội dung đóng vai trong bài học Nói của A2 → C2.
- **FR-005**: Tên và thứ tự các phần Nói của bài học (và đề thử nếu đổi) theo đề thật từng cấp: A2 2 phần, B1 / B2 / C1 4 phần, C2 3 phần.
- **FR-006**: A2, B1 có dạng "Đọc phần 1: tin nhắn, thông báo ngắn" (A2 6 câu, B1 5 câu mỗi bộ; văn bản ≤ 40 từ; 3 phương án; một đáp án); ít nhất 2 bộ mỗi cấp; bài học, bài tập, đề thử dùng dạng này; A2 phần 3 (bài đọc dài) tách khỏi phần 1.
- **FR-007**: 4 bài tiêu chí Viết (B1 → C2) + 4 bài tiêu chí Nói (A2 → C2); mỗi bài có ví dụ mức thấp / cao cùng một ý + vì sao, 3 câu làm thử.
- **FR-008**: Đề thử Nói A2 → C2: phần thảo luận dùng một nhiệm vụ thảo luận cặp trong kho (bạn thi máy nói lượt của mình, người học đáp từng lượt); ④ Tương tác chấm bằng các dấu hiệu đáp lời / nêu lý do / hỏi lại / chốt như 👥 nói cặp; tên phần đúng đề thật từng cấp.
- **FR-009**: Nội dung mới kiểm lúc dựng (đáp án có trong văn bản, đúng một đáp án, độ dài) và vào bảng kiểm giáo viên.
- **FR-010**: Không đổi luật đo; luyện thi không ghi vào 📘 Học / 🔁 Nhớ / Thi chuyển cấp; bài học không ghi kết quả bài.

### Key Entities

- **Bài học Cambridge**: theo phần của đề (cũ) + theo thể loại Viết (mới) + theo tiêu chí (mới); mã ổn định.
- **Đề Viết**: đã có thể loại + bài mẫu; bố cục thường gặp soạn theo thể loại (không gắn nhãn từng đoạn).
- **Bộ tin ngắn**: cấp, các văn bản ngắn, câu hỏi 3 phương án, giải thích.
- **Nhiệm vụ thảo luận cặp**: đã có (câu hỏi, 5 gợi ý, lời mẫu, câu chốt).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% dạng ở bảng có bài học + bài tập đúng dạng (test tự động kiểm từng dạng, từng cấp).
- **SC-002**: Bài học Nói A2 → C2 không còn ví dụ đóng vai; tên phần đúng đề thật ở 5 cấp.
- **SC-003**: Đề thử Đọc A2 / B1 phần 1 là văn bản ≤ 40 từ, 3 phương án, ở 100% lần bốc thử.
- **SC-004**: Mỗi thể loại Viết của một cấp: "Bài tập dạng này" mở đúng thể loại ở 100% lần thử.
- **SC-005**: Bộ test xanh hết; màn mới không lỗi trang, không tràn ngang trên khổ iPhone SE (Chromium); ghi "chưa kiểm trên iPhone" nếu chưa thử máy thật.

## Assumptions

- Cách chia phần, thể loại, tiêu chí theo mô tả công khai của Cambridge English và sách luyện thi, theo hiểu biết của Claude; chưa giáo viên kiểm. Không chép đề Cambridge (bản quyền).
- Tên tiêu chí Nói trùng 4 tiêu chí đề thử Nói của app đang chấm (① ngữ pháp và từ vựng ② mạch lạc / tổ chức lời nói ③ phát âm ④ tương tác).
- Bản đồ Cambridge (ô theo phần) giữ nguyên; bài tiêu chí không có ô bản đồ riêng.
- 📈 Giỏi lên (🧱 Nền) không thuộc đợt này.
