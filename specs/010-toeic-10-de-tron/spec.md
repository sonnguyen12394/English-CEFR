# Feature Specification: Thêm 10 đề thử TOEIC trọn 200 câu

**Feature Branch**: `claude/ecstatic-curie-q9g1ja` · **Created**: 2026-11-08 · **Status**: Dừng sau đợt 3 (người sáng lập 10/11/2026: "Không soạn đề nữa chỉ làm xong đề cũ thì thôi"): Đề 3–4 + 📋 Bài làm và đáp án (v149, bản 147); Đề 5–6 (v152, bản 148 → 150 sau gộp); Đề 7–8 (v154, bản 151). Đề 9–12 huỷ.

**Input**: "Soạn thêm 10 đề nữa cho tôi" (người sáng lập, 8/11/2026). Ngay trước đó người sáng lập hỏi "Cần bao nhiêu dạng đề TOEIC là đủ để rèn luyện đi thi được 990". Claude trả lời: app đã đủ 33 dạng câu, có 2 đề trọn, kho 562 câu (≈ 2,8 đề); giới luyện thi thường khuyên 15–30 đề trọn chất lượng như đề thật. Claude khuyên chưa soạn thêm mà tìm người học thật trước; người sáng lập vẫn chọn soạn thêm 10 đề.

## Hiện trạng (8/11/2026, đếm trên dữ liệu)

- 2 đề trọn (v147, v148) lấy 400 / 562 câu của kho chung. Kho: Nghe 237 (Part 1: 12 · Part 2: 60 · Part 3: 28 bài / 84 câu · Part 4: 27 bài / 81 câu), Đọc 325 (Part 5: 118 · Part 6: 24 đoạn / 96 câu · Part 7: 31 bộ / 111 câu). Làm xong 2 đề là đã gặp ~71% kho.
- Kho có giải thích tiếng Việt cho Part 1, 5, 6, 7; Part 2–4 không có (kết quả hiện lời nghe).
- Kho chỉ có 4 hội thoại 3 người, 3 hội thoại có bảng, 3 bài nói có bảng. Đề 1 có 2 bài 3 người, 2 bài có bảng ở Part 3 (đề thật thường 3).
- Bộ chạy đề trọn: `totron.js` (Nghe tự chạy, Đọc 75 phút, làm tiếp trong 3 giờ, kết quả + 🎯 Sai ở đâu, khung cấu trúc 200 câu).
- Nội dung Claude soạn, chưa giáo viên kiểm. Điểm ước theo tỉ lệ đúng, không phải bảng ETS. Độ khó chưa đối chiếu đề ETS. Chưa có người học TOEIC thật nào dùng.

### Khối lượng của 10 đề

| Phần | Mỗi đề | 10 đề |
|------|--------|-------|
| Part 1 (tranh vẽ) | 6 câu | 60 tranh, 240 câu nghe |
| Part 2 | 25 câu | 250 câu, 1.000 câu nghe |
| Part 3 | 13 hội thoại × 3 câu | 130 hội thoại, 390 câu |
| Part 4 | 10 bài nói × 3 câu | 100 bài nói, 300 câu |
| Part 5 | 30 câu | 300 câu |
| Part 6 | 4 đoạn × 4 chỗ | 40 đoạn, 160 câu |
| Part 7 | 15 bộ văn bản, 54 câu | 150 bộ, 540 câu |
| **Tổng** | **200 câu** | **2.000 câu mới** (gấp ~3,6 lần kho hiện có) |

- Âm thanh: ~2.500 câu nghe mới, ~30 MB (tệp giọng hiện có trung bình 12 KB). Bộ dựng giọng Kokoro chưa cài trên máy soạn hiện tại; cài lại cần tải ~300 MB.
- Viết: toàn bộ kho TOEIC hiện có là ~256 KB nội dung nguồn; 10 đề cần ~900 KB, tức nhiều phiên làm việc dài trên gói Pro của người sáng lập.

## Clarifications

### Session 2026-11-08

- Q: 10 đề mới soạn và đưa lên web theo nhịp nào? → A: **Theo đợt 2 đề**: mỗi đợt 2 đề (400 câu) là một bản phát hành; sau đợt đầu dừng kiểm chất lượng rồi mới làm tiếp.
- Q: Câu mới chỉ nằm trong đề thử trọn hay cũng vào luyện từng Part? → A: **Chỉ trong đề thử trọn** (giữ câu mới cho lúc thi thử).
- Q: Chưa có giáo viên, kiểm đáp án bằng cách nào? → A: người sáng lập: "Khi soạn đề bạn cũng cần soạn đáp án" → **Claude soạn đáp án + giải thích cùng lúc với câu hỏi**, tự soát, máy kiểm khi dựng; không mở phiên phụ giải lại (không tốn thêm lượt).
- Q: Độ khó của 10 đề mới? → A: **Như đề thật**: mỗi Part dễ dần sang khó.
- Người sáng lập thêm: "Sau khi làm bài xong thì sẽ có 1 phần hiện bài làm và đáp án" → **User Story 4: 📋 Bài làm và đáp án** cho cả 200 câu, mọi đề (Đề 1–12), xem ngay sau khi nộp và xem lại sau.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Làm thêm đề trọn chưa gặp (Priority: P1)

Người ôn TOEIC đã làm Đề 1 và Đề 2 chọn một đề mới (Đề 3 → Đề 12) và làm như thi thật, gặp toàn câu chưa thấy ở đâu trong app.

**Why this priority**: đề trọn chỉ đo đúng khi câu còn mới. Kho hiện có chỉ đủ ~2,8 đề, nên sau 2 đề người học không còn đề mới.

**Independent Test**: chọn Đề 3, làm hết 200 câu, ra kết quả; kiểm không câu nào trùng Đề 1–2 hoặc kho luyện.

**Acceptance Scenarios**:

1. **Given** app có 12 đề, **When** người học mở "Đề thử trọn 200 câu", **Then** thấy Đề 1 → Đề 12, mỗi đề ghi kết quả lần trước hoặc "Chưa làm".
2. **Given** người học chọn Đề 7, **When** làm hết, **Then** đề có đúng 200 câu, cơ cấu 6 · 25 · 39 · 30 · 30 · 16 · 54.
3. **Given** mọi đề, **When** so câu giữa các đề và với kho luyện, **Then** không có câu trùng.

---

### User Story 2 - Đề sát đề thật về dạng câu (Priority: P2)

Mỗi đề mới có đủ các dạng câu như đề thật, đúng thứ tự trong đề.

**Why this priority**: người học cần quen đủ dạng câu trong nhịp thi thật; đề thiếu dạng thì điểm ước lệch.

**Independent Test**: bộ dựng đếm dạng câu từng đề.

**Acceptance Scenarios**:

1. **Given** một đề mới, **When** bộ dựng kiểm, **Then** có: Part 1 cả tranh người và tranh cảnh; Part 2 đủ 5 loại câu (hỏi Wh-, Yes / No, lựa chọn, đề nghị, trần thuật), đáp án A / B / C không dồn một chữ; Part 3 2 hội thoại 3 người, 3 hội thoại có bảng ở cuối Part, ≥ 2 câu hàm ý; Part 4 2 bài nói có bảng ở cuối Part, ≥ 2 câu hàm ý; Part 5 đủ 8 dạng; Part 6 mỗi đoạn 1 câu chèn; Part 7 2 chuỗi tin nhắn có câu ý định, 2 câu chèn [1]–[4], ≥ 2 câu từ gần nghĩa, ≥ 1 câu NOT, mỗi bộ nhiều văn bản ≥ 1 câu phải đối chiếu 2 văn bản.

---

### User Story 3 - Xem đáp án và học lại sau khi làm (Priority: P3)

Sau mỗi đề, người học xem câu sai, giải thích, và đi tới bài học của dạng sai (ô 🎯 Sai ở đâu có sẵn từ v146).

**Why this priority**: làm đề mà không học lại chỗ sai thì ít tiến bộ; tính năng đã có, chỉ cần câu mới gắn đúng nhãn dạng.

**Independent Test**: làm sai một câu Part 7 từ gần nghĩa của Đề 3; ô 🎯 Sai ở đâu dẫn tới bài học "từ gần nghĩa".

**Acceptance Scenarios**:

1. **Given** người học làm sai câu ở đề mới, **When** xem kết quả, **Then** câu đó nằm trong ô 🎯 Sai ở đâu, nối tới đúng bài học của dạng.
2. **Given** câu Part 1, 5, 6, 7 của đề mới, **When** xem câu sai, **Then** có giải thích tiếng Việt như kho cũ.

### User Story 4 - Xem lại bài làm và đáp án (Priority: P2)

Nộp bài xong, người học xem cả bài làm của mình và đáp án của 200 câu, không chỉ câu sai; mở lại app vẫn xem được bài làm lần gần nhất của mỗi đề.

**Why this priority**: học từ đề cần so từng câu mình chọn với đáp án và đọc lại lời nghe / bài đọc; hiện nay chỉ thấy danh sách câu sai (gập trong ô 🎯 Sai ở đâu), không có lời nghe / bài đọc, rời màn kết quả là mất.

**Independent Test**: làm Đề 1 (chọn đúng vài câu, sai vài câu, bỏ trống vài câu), nộp → mở "📋 Bài làm và đáp án" → bảng 200 câu đúng màu; chạm câu 35 → thấy lời hội thoại, chữ bạn chọn, đáp án; tắt mở lại app → từ danh sách đề vẫn mở được bài làm.

**Acceptance Scenarios**:

1. **Given** người học vừa nộp bài, **When** xem kết quả, **Then** có mục "📋 Bài làm và đáp án": số câu đúng / sai / bỏ trống và bảng 200 ô theo Part; mỗi ô ghi số câu, tô màu đúng / sai / bỏ trống, ghi chữ đã chọn và chữ đáp án.
2. **Given** bảng bài làm, **When** chạm một câu, **Then** mở màn xem lại cả bài chứa câu đó: tranh (Part 1), lời nghe hiện chữ + 🔊 nghe lại (Part 2–4), câu / đoạn / văn bản (Part 5–7); mỗi câu đánh dấu phương án đã chọn và đáp án đúng, có giải thích và 📍 câu chứa đáp án khi có; ‹ Trước · Sau ›; lọc "Chỉ câu sai".
3. **Given** người học đã rời màn kết quả hoặc tắt app, **When** mở danh sách đề, **Then** mỗi đề đã làm có lối "📋 Xem bài làm lần gần nhất".
4. **Given** màn xem lại, **When** chạm phương án, **Then** không đổi được đáp án, không đổi điểm.

### Edge Cases

- Đang làm dở Đề 1 hoặc 2 khi app cập nhật thêm đề: đề dở giữ nguyên, làm tiếp được.
- Thiếu tệp giọng của một câu nghe: dùng giọng máy như v147.
- Câu mới bị máy kiểm bắt lỗi (sai cơ cấu, đáp án không có trong phương án, trùng): bộ dựng dừng, đề đó không được phát hành.
- Người học đã làm hết 12 đề: vẫn làm lại được, so với lần trước.
- Đề làm trước bản có 📋 Bài làm (Đề 1–2 trước bản 147) chưa lưu từng câu: danh sách đề ghi "chưa lưu bài làm từng câu", không có lối xem.
- Làm lại một đề: bài làm lần mới thay bài làm lần trước (chỉ giữ lần gần nhất mỗi đề).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: 10 đề mới (Đề 3 → Đề 12), mỗi đề đúng 200 câu, cơ cấu 6 · 25 · 39 · 30 · 30 · 16 · 54; Part 7 gồm 29 câu văn bản đơn + 2 bộ 2 văn bản + 3 bộ 3 văn bản, mỗi bộ nhiều văn bản 5 câu.
- **FR-002**: Mọi câu của đề mới là câu mới: không trùng câu kho hiện có, không trùng giữa các đề. Câu mới **chỉ dùng trong đề thử trọn**: không vào danh sách bài luyện từng Part, bài học, luyện theo dạng, bản đồ chữa, đề thử rút gọn. Sau khi nộp, người học vẫn xem lại câu sai ở màn kết quả; ô 🎯 Sai ở đâu dẫn tới bài học + bài tập bằng kho cũ.
- **FR-003**: Mỗi câu có đúng một đáp án đúng; phương án sai phải sai thật (không phải "cũng được"). Part 1, 5, 6, 7 có giải thích tiếng Việt ngắn như kho; Part 2–4 xem lời nghe sau khi nộp như hiện nay.
- **FR-004**: Mỗi câu gắn nhãn dạng như kho (để ô 🎯 Sai ở đâu và bản đồ điểm dùng được).
- **FR-005**: Bộ dựng kiểm và dừng khi: sai số câu từng Part, câu trùng, thiếu dạng theo User Story 2, bài có bảng không ở cuối Part, Part 7 sai thứ tự (văn bản đơn → 2 văn bản → 3 văn bản).
- **FR-006**: Câu nghe có giọng tự nhiên (Kokoro) như kho; không cài được thì dùng giọng máy và ghi rõ.
- **FR-007**: Tranh Part 1 vẽ theo cách hiện có (khối + biểu tượng); mỗi tranh chỉ đúng một câu tả.
- **FR-008**: Đáp án soạn cùng lúc với câu hỏi. Mỗi câu Part 3, 4, 7 (trừ câu NOT và câu chèn [1]–[4]) ghi câu chứa đáp án trích nguyên văn từ lời nghe / bài đọc; bộ dựng dừng khi câu trích không có trong lời nghe / bài đọc. Part 6 có giải thích như kho. Claude tự soát từng đợt trước khi phát hành (đọc lại từng câu, kiểm phương án sai thật sự sai).
- **FR-009**: Làm theo đợt 2 đề; mỗi đợt là một bản phát hành (Đề 3–4, 5–6, 7–8, 9–10, 11–12). Sau đợt đầu dừng chờ kiểm chất lượng (mốc dừng SC-006) trước khi làm đợt 2.
- **FR-010**: Bảng kiểm cho giáo viên (`docs/kiem-noi-dung.html`) thêm các câu mới.
- **FR-011**: Không chép đề ETS; người, công ty, nơi chốn trong đề là hư cấu.
- **FR-012**: KHÔNG đổi luật đo (luyện thi không tính 📘 Học / 🔁 Nhớ / Thi chuyển cấp).
- **FR-013**: Lưu bài làm lần gần nhất của mỗi đề (chữ đã chọn của 200 câu, ~200 ký tự / đề) cùng dữ liệu học để xem lại sau, kể cả trên máy khác cùng tài khoản.
- **FR-014**: Màn 📋 Bài làm và đáp án dùng cho mọi đề trọn (Đề 1–12); chỉ để xem, không sửa đáp án, không đổi điểm, không ghi thêm vào bản đồ điểm.

### Key Entities

- **Đề trọn**: mã, tên (Đề 3…), danh sách mã câu / bài theo 7 Part.
- **Câu / bài mới**: mã riêng theo đề, Part, nhãn dạng, đáp án, phương án sai, giải thích (Part 1, 5, 6, 7), lời nghe (Part 1–4), bảng (nếu có), tranh (Part 1).
- **Tệp giọng**: một tệp mỗi câu nghe, khoá theo nội dung câu.
- **Bài làm lần gần nhất**: mã đề, thời điểm, chữ đã chọn của câu 1–200 (bỏ trống ghi riêng).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Bộ dựng xanh với 12 đề × 200 câu, cơ cấu đúng, 0 câu trùng giữa các đề và với kho.
- **SC-002**: Mỗi đề mới đạt đủ số dạng câu ở User Story 2 (bộ dựng đếm, không đếm tay).
- **SC-003**: 100% câu Part 3, 4, 7 (trừ câu NOT, câu chèn) có câu trích chứa đáp án tìm thấy nguyên văn trong lời nghe / bài đọc; 100% đáp án nằm trong phương án, không phương án trùng; ghi số câu Claude sửa khi tự soát mỗi đợt.
- **SC-004**: 100% câu nghe mới có giọng (Kokoro, hoặc ghi rõ giọng máy).
- **SC-005**: Test toàn bộ xanh; chạy nhanh một đề mới từ đầu tới kết quả không lỗi.
- **SC-006** (mốc dừng): sau đợt đầu, có ≥ 1 người học thật làm 1 đề mới của app và 1 đề ETS trong cùng tuần; điểm lệch > 100 mỗi phần thì dừng soạn tiếp, sửa độ khó trước.

- **SC-007**: Sau khi nộp, xem được bài làm và đáp án của 200 / 200 câu; tắt mở lại app vẫn xem được bài làm lần gần nhất của đề đó.

## Assumptions

- "Đề" = đề trọn 200 câu như Đề 1–2 (theo ngữ cảnh: câu hỏi về 990 và lời khuyên 15–30 đề trọn).
- Độ khó: như đề thật (người sáng lập chọn), mỗi Part dễ → khó dần. ETS không công bố phân bố độ khó; đây là theo mô tả của giới luyện thi.
- Số câu từng dạng trong đề thật (vd. 2 hội thoại 3 người, 3 bài có bảng) là theo mô tả của giới luyện thi; ETS chỉ công bố cơ cấu từng Part.
- Không có giáo viên kiểm và không có lượt giải lại độc lập; người soạn tự soát dễ bỏ sót chính lỗi mình mắc. Người sáng lập chấp nhận rủi ro đáp án sai, độ khó lệch; câu trích bằng chứng (FR-008) giảm một phần rủi ro.
- Soạn trong phiên Claude Code trên gói Pro của người sáng lập; khối lượng lớn nên kéo dài nhiều phiên, có thể chạm giới hạn lượt dùng của gói.
- Tranh Part 1 là tranh vẽ, không phải ảnh chụp (chấp nhận như v127).
- Không đổi bộ chạy đề `totron.js` ngoài việc hiện thêm đề.
