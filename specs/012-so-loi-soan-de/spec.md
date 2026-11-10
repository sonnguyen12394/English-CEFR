# Feature Specification: Sổ lỗi soạn đề

**Feature Branch**: `claude/kiem-noi-dung-de-7l02h6` · **Created**: 2026-11-10 · **Status**: Đã làm rõ (4 câu, 10/11); chờ người sáng lập duyệt kế hoạch

**Input**: Người sáng lập (10/11/2026, khi Đề 7 đã xong và Đề 8 đang giải mù): "Không soạn đề nữa chỉ làm xong đề cũ thì thôi. Cập nhật những lỗi đã sửa trong lúc tạo đề và làm đề vào cấu trúc đề để cân nhắc không tái phạm lần sau. Làm thành chức năng để ở kế bên mục luyện đề để tôi kiểm tra xem làm có đúng ý không." Sau đó: "Tiếp tục nhưng nhớ sau đề 8 không tiếp tục tạo thêm đề nữa mà làm theo yêu cầu đã nói."

## Hiện trạng (10/11/2026)

- Đề thử TOEIC trọn: 8 đề × 200 câu (Đề 1–2 ghép từ kho luyện; Đề 3–8 soạn mới). Claude soạn, chưa giáo viên kiểm, chưa người học thật nào dùng.
- Ba lớp kiểm đã có (v153, `specs/011-kiem-noi-dung-de`): bộ tiêu chí `docs/TIEU-CHI-DE-TOEIC.md` (mã `H-*` cho người soát, mã luật máy), máy kiểm `tools/kiem-toeic.mjs`, giải mù (phiên Claude phụ làm đề không xem đáp án). Bộ dựng `tools/build-toeic.mjs` chặn câu gần trùng, bài chép khuôn, sai cơ cấu.
- Lỗi đã tìm và sửa nằm **rải rác**: đoạn v149–v154 của CLAUDE.md, ví dụ trong bộ tiêu chí, ghi chú của phiên giải mù (`content/toeic/giai-mu/deN.json`), lịch sử commit. Không có một chỗ gom theo loại lỗi, nên lần soạn sau không biết lỗi nào hay tái phạm, và người sáng lập không xem được trong app.
- Lỗi tái phạm thật đã thấy: Đề 8 nháp (10/11) lặp lại đúng những lỗi đã sửa ở đề trước: 4 câu tranh Part 1 trùng nguyên văn Đề 4, 3 câu Part 5 gần trùng, 7 bài chép khuôn đề cũ (thuê xe như Đề 5, đăng ký khách như Đề 6, giới thiệu nhân viên xuất sắc như Đề 4…), 3 từ nối Part 6 cùng loại "thêm ý" trong một đề (Đề 7 cũng bị). Bộ dựng và giải mù bắt được, nhưng tốn một vòng sửa + giải lại.
- Các nhóm lỗi đã sửa (sơ bộ, sẽ đếm lại khi làm danh mục):
  - **Khi soạn** (bộ dựng / máy kiểm / tự soát): câu Part 2 / 5 gần trùng kho hoặc đề khác; bài Part 3 / 4 / 6 / 7 chép khuôn bài cũ; tranh Part 1 trùng nguyên văn; lặp tình huống trong một đề (2 bài giờ mở cửa thư viện, 2 dịch vụ in, 2 bài hồ bơi câu lạc bộ thể hình…); lặp tên người / tên hiệu; nhiễu Part 5 ghép giả "từ + giới từ"; phương án câu chèn Part 6 lạc đề; đáp án Part 2 dồn một chữ; câu trích 📍 không nguyên văn trong bài; phép tính sai trong giải thích; đáp án dài hơn hẳn phương án sai; câu NOT có phương án "có trong bài" mà không có chữ nào trong bài; từ lạ / chính tả.
  - **Khi làm đề** (giải mù, người sáng lập thử): nhiễu lỡ đúng (2 đáp án đều được); lời đáp sai Part 2 lại là lời đáp gián tiếp hợp lý; câu chèn [1]–[4] đặt được 2 chỗ; lỗi logic / sự thật (40 người × 5 phút ≠ cả ngày, "All cruises" gồm chuyến không phải cruise, xe đưa đón chạy từ đúng bãi sắp xây nhà); câu hỏi bảng không cần bảng; tranh Part 1 không rõ (người đứng mà câu nói ngồi, cửa không rõ là cửa); phương án số / giờ / ngày không xếp thứ tự; tiếng Anh không tự nhiên ("parking ticket" ở xưởng sửa xe); giọng nam / nữ Part 4 sai người nói; từ nối / đại từ cùng loại lặp trong một Part; đáp án dồn một chữ trong một Part (còn mở).
  - **Khi hiển thị đề trên iPhone** (người sáng lập thử): màn sẵn sàng ghi 100 câu thay vì cả đề 200 câu (v148).

## Clarifications

### Session 2026-11-10

- Q: Có soạn thêm đề không? → A: **Không.** Làm xong Đề 7–8 rồi dừng (người sáng lập nói 2 lần). Đề 9–12 của đặc tả 010 (T023, T024) huỷ.
- Q: Sổ lỗi đặt ở đâu, ai thấy? → A: **Tab riêng cho mọi người** ở thanh dưới, ngay cạnh 🎯 Luyện đề (thanh dưới thành 6 tab). Claude đã nêu cái giá: iPhone nhỏ chật, chữ dễ bị cắt → phải đo ở 320 px. Tên tab không dùng "Sổ lỗi" vì trùng 📒 Sổ lỗi của người học (lỗi AI chỉ ra khi chấm, ở 👤 Tôi).
- Q: Kiểm "đúng ý" thế nào? → A: **Mỗi mục có nút ✓ Đúng ý / ✗ Chưa đúng + ô ghi chú**, gửi về như góp ý để Claude đọc rồi sửa; mở lại vẫn thấy dấu đã chọn.
- Q: Phạm vi? → A: **Đề thử TOEIC trọn** (8 đề): lỗi khi soạn, khi làm đề (giải mù), và lỗi hiển thị người sáng lập gặp trên iPhone. Bài học ghi vào bộ tiêu chí + máy kiểm; không đổi đề AI / kho đề soạn sẵn.
- Q: Lỗi "đáp án dồn một chữ" (vd. Part 6 Đề 7 chỉ 1/16 câu đáp án B)? → A: **Cân bằng cả 8 đề.** Người sáng lập chấp nhận chữ cái đáp án đổi ở gần hết câu và bài làm đã lưu (Đề 1 phần Đọc) xem lại có thể lệch chữ; Claude chuyển bài làm cũ sang chữ mới nếu làm được.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Danh mục lỗi đã sửa, gắn luật để không tái phạm (Priority: P1)

Mỗi loại lỗi đã tìm và đã sửa khi soạn đề và khi làm đề có MỘT mục trong danh mục: tên dễ hiểu, khâu (soạn đề / làm đề / hiển thị), Part, ví dụ thật (sai → đã sửa), bắt bằng gì, đã gặp ở đề nào và bao nhiêu lần, luật để không tái phạm (mã tiêu chí người soát hoặc luật máy), trạng thái (máy đã chặn / người soát phải nhớ / còn mở chờ quyết). Bộ tiêu chí và quy trình soạn đề dẫn tới danh mục (bước "đọc sổ lỗi trước khi soạn"); lỗi máy bắt được mà chưa có luật thì thêm luật máy.

**Why this priority**: là phần "cập nhật vào cấu trúc đề để không tái phạm": không có danh mục thì màn trong app không có gì để hiện, và lần soạn sau (người hay máy) lặp lại lỗi như Đề 8 nháp.

**Independent Test**: lấy 10 lỗi đã sửa ngẫu nhiên trong lịch sử v149–v154 (CLAUDE.md, ghi chú giải mù) → mỗi lỗi tìm được đúng một mục trong danh mục, mục có ví dụ thật và luật phòng; mỗi mã luật trong danh mục có thật trong bộ tiêu chí hoặc máy kiểm.

**Acceptance Scenarios**:

1. **Given** lỗi "tranh Part 1 trùng nguyên văn đề cũ" (Đề 8 nháp chép Đề 4), **When** mở danh mục, **Then** có mục ghi ví dụ đó, "bộ dựng chặn", đã gặp 1 lần ở Đề 8, luật phòng là luật trùng nguyên văn của bộ dựng.
2. **Given** lỗi "lời đáp sai Part 2 là lời đáp gián tiếp hợp lý", **When** mở danh mục, **Then** mục ghi các ví dụ sai → đã sửa ("I'll work late tomorrow" → …), bắt bằng giải mù, luật `H-BAN-HIEU`, trạng thái "người soát phải nhớ" (máy không bắt được).
3. **Given** một lỗi máy bắt được mà chưa có luật (vd. phương án số không cùng khuôn nên không xếp được), **When** làm xong tính năng, **Then** máy kiểm có luật mới cảnh báo, kèm câu cài lỗi trong bộ test.

---

### User Story 2 - Màn "Sổ lỗi soạn đề" cạnh 🎯 Luyện đề (Priority: P2)

Người sáng lập mở một màn trong app, là một tab riêng ở thanh dưới ngay cạnh 🎯 Luyện đề, ai cũng thấy, xem danh mục theo nhóm: mỗi mục một dòng (tên + số lần + trạng thái), chạm mở ra ví dụ sai → đã sửa, bắt bằng gì, luật phòng. Đầu màn có tóm tắt: bao nhiêu loại lỗi, bao nhiêu đã có máy chặn, bao nhiêu còn mở; dòng tình trạng 8 đề (máy kiểm 0 lỗi, giải mù 200/200).

**Why this priority**: người sáng lập yêu cầu xem trong app để kiểm "đúng ý"; cần danh mục (US1) trước.

**Independent Test**: mở app trên iPhone khổ nhỏ (320 px) → tới màn sổ lỗi trong ≤ 2 chạm từ 🎯 Luyện đề → mở 1 mục, đọc được ví dụ và luật; không tràn ngang; vùng bấm ≥ 44 px.

**Acceptance Scenarios**:

1. **Given** người sáng lập ở 🎯 Luyện đề, **When** chạm lối vào sổ lỗi, **Then** thấy tóm tắt và danh sách nhóm lỗi.
2. **Given** một mục đang gập, **When** chạm, **Then** mở ra ví dụ sai → đã sửa, bắt bằng gì, luật phòng, đề đã gặp.
3. **Given** máy không mạng, **When** mở sổ lỗi, **Then** vẫn xem được (dữ liệu tĩnh đi kèm app).

---

### User Story 3 - Đánh dấu "đúng ý / chưa đúng" từng mục (Priority: P3)

Ở mỗi mục, người sáng lập cho biết mục đó đã đúng ý chưa bằng nút ✓ Đúng ý / ✗ Chưa đúng và ô ghi chú; phản hồi gửi về như góp ý (kèm mã mục), Claude đọc để sửa danh mục / luật; mở lại màn vẫn thấy dấu đã chọn.

**Why this priority**: khép vòng "kiểm xem làm có đúng ý không"; màn chỉ đọc (US2) đã dùng được mà chưa cần phần này.

**Independent Test**: đánh dấu ✗ một mục kèm ghi chú → Claude đọc được ghi chú ở nơi lưu phản hồi, biết mục nào.

**Acceptance Scenarios**:

1. **Given** một mục người sáng lập thấy chưa đúng, **When** chọn ✗ và ghi chú, **Then** phản hồi lưu lại kèm mã mục, Claude đọc được.
2. **Given** đã đánh dấu, **When** mở lại màn, **Then** thấy dấu đã chọn.

---

### User Story 4 - Cân bằng vị trí đáp án cả 8 đề (Priority: P2)

Trong mỗi Part của mỗi đề thử trọn, số câu có đáp án A, B, C, D (Part 2: A, B, C) gần bằng nhau và không có quá 3 câu liền cùng một chữ, như đề thật. Đo ngày 10/11: Part lệch nặng nhất Đề 1 Part 3 B 17/39, Đề 1 Part 6 C 1/16, Đề 7 Part 6 B 1/16, Đề 7 Part 7 A 5/54, Đề 8 Part 4 C 3/30; chuỗi 5 câu liền cùng chữ ở Đề 2 Part 2, Đề 3 Part 7, Đề 5 Part 7, Đề 7 Part 3. Phương án số / giờ / ngày vẫn xếp tăng dần, câu chèn [1]–[4] giữ thứ tự; các câu khác bù cho cân. Máy kiểm có luật cấp đề để không tái phạm. Kết quả giải mù giữ nguyên (đổi chữ theo cách xếp mới, cùng nội dung, không phải làm lại); bài làm đã lưu được chuyển sang chữ mới khi xem lại.

**Why this priority**: người sáng lập chọn sửa cho cả 8 đề; đề thật cân bằng vị trí đáp án, lệch nặng làm người học đoán theo chữ.

**Independent Test**: chạy máy kiểm trên 8 đề → mọi Part trong ngưỡng, không chuỗi > 3; mở một câu ở app và ở phiếu giải mù → cùng chữ cái; xem lại bài làm đã lưu trước khi đổi → câu đúng vẫn đúng.

**Acceptance Scenarios**:

1. **Given** Đề 7 Part 6 (16 câu), **When** đổi cách xếp, **Then** mỗi chữ có 3–5 câu đáp án và không có 4 câu liền cùng chữ.
2. **Given** câu có phương án giờ "8:15 A.M. · 10:40 A.M. · …", **When** đổi cách xếp, **Then** phương án vẫn tăng dần.
3. **Given** bài làm Đề 1 phần Đọc đã lưu trước khi đổi, **When** mở 📋 Bài làm và đáp án, **Then** các câu đã chọn đúng vẫn hiện đúng (chữ đã chuyển theo cách xếp mới).
4. **Given** một đề mới (nếu sau này có), **When** dựng, **Then** máy kiểm chặn nếu một Part lệch quá ngưỡng.

---

### Edge Cases

- Một lỗi thuộc 2 khâu (vd. máy bắt khi soạn và giải mù cũng bắt): một mục, ghi đủ các cách bắt.
- Lỗi đã có luật máy nhưng vẫn tái phạm (Đề 8 nháp): mục ghi số lần tái phạm, để thấy luật máy có tác dụng (chặn trước khi phát hành).
- Lỗi còn mở chờ người sáng lập quyết (đáp án dồn một chữ trong một Part): ghi rõ "còn mở", các phương án và cái giá của mỗi phương án. Lỗi "đáp án dồn một chữ" người sáng lập đã quyết: cân bằng cả 8 đề (US4).
- Ví dụ trích nguyên văn câu đề: không lộ đáp án của câu đang có trong đề (ví dụ là bản trước khi sửa và bản sau khi sửa; người học thấy màn thì cũng chỉ thấy câu đã sửa và lời giải thích).
- Danh mục lớn dần: màn vẫn đọc nhanh (gập theo nhóm, mỗi nhóm hiện số mục).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Danh mục MUST gồm mọi loại lỗi đã tìm và đã sửa khi soạn và khi làm đề thử TOEIC trọn (Đề 1–8, v149–v154), gồm cả lỗi do người sáng lập thấy khi làm đề trên iPhone.
- **FR-002**: Mỗi mục MUST có: mã, tên dễ hiểu (tiếng Việt), khâu (soạn đề / làm đề / hiển thị), Part (hoặc "cả đề"), mô tả một câu, ít nhất một ví dụ thật (trước khi sửa → sau khi sửa), bắt bằng gì (bộ dựng / máy kiểm / giải mù / tự soát / người sáng lập), số lần gặp và ở đề nào, luật phòng (mã tiêu chí người soát hoặc luật máy), trạng thái (máy chặn / người soát phải nhớ / còn mở).
- **FR-002a**: Mục "còn mở" MUST ghi các phương án và cái giá của từng phương án để người sáng lập quyết.
- **FR-003**: Lỗi máy phát hiện được mà chưa có luật MUST có luật mới trong máy kiểm (lỗi hoặc cảnh báo) và câu cài lỗi trong bộ test; lỗi máy không phát hiện được MUST có tiêu chí người soát (mã `H-*`) trong bộ tiêu chí.
- **FR-004**: Quy trình soạn đề trong bộ tiêu chí MUST có bước đọc danh mục trước khi soạn và bước so lại danh mục trước khi giải mù; CLAUDE.md MUST chỉ tới danh mục.
- **FR-005**: Danh mục MUST là một nguồn duy nhất: màn trong app, bộ tiêu chí và báo cáo đều đọc từ đó, không chép tay số liệu ở nhiều nơi.
- **FR-006**: Mỗi mã luật phòng trong danh mục MUST có thật (trong bộ tiêu chí hoặc máy kiểm); bộ test MUST chặn phát hành khi có mã không tồn tại.
- **FR-007**: App MUST có tab riêng ở thanh dưới, ngay sau 🎯 Luyện đề, ai cũng thấy, mở màn sổ lỗi; tên tab ngắn, không trùng "📒 Sổ lỗi" của người học; 6 tab vừa khổ 320 px không cắt chữ, không cuộn ngang.
- **FR-008**: Màn MUST hiện tóm tắt (số loại lỗi, số đã có máy chặn, số còn mở, tình trạng kiểm của 8 đề) và danh sách theo nhóm; mỗi mục gập / mở được.
- **FR-009**: Màn MUST dùng được không cần mạng, không gọi AI, không đổi dữ liệu học, không đổi luật đo (📘 Học / 🔁 Nhớ / Thi chuyển cấp).
- **FR-010**: Mỗi mục MUST có nút ✓ Đúng ý / ✗ Chưa đúng và ô ghi chú; phản hồi gửi về như góp ý (mã mục, dấu, ghi chú, phiên bản app) để Claude đọc; dấu đã chọn lưu trên máy để mở lại vẫn thấy; không mạng thì xếp hàng gửi sau như góp ý.
- **FR-011**: Không soạn đề thử trọn mới sau Đề 8; đặc tả 010 ghi huỷ T023, T024; CLAUDE.md ghi dừng.
- **FR-012**: Màn theo luật thiết kế của dự án: biến màu / cỡ chữ chung, vùng bấm ≥ 44 px, không tràn ngang ở 320 px, nền sáng và tối đạt tương phản.
- **FR-013**: Mỗi Part của 8 đề MUST cân bằng vị trí đáp án: với N câu và k chữ (Part 2: 3, còn lại: 4), mỗi chữ có từ ⌊N/k⌋ − 1 tới ⌈N/k⌉ + 1 câu; không quá 3 câu liền cùng chữ. Phương án cùng khuôn số / giờ / ngày vẫn tăng dần; câu chèn [1]–[4] giữ thứ tự.
- **FR-014**: App, máy kiểm, phiếu giải mù MUST dùng cùng một cách xếp (một nơi định nghĩa), để chữ cái ở app khớp phiếu giải mù.
- **FR-015**: Máy kiểm MUST có luật cấp đề (mức lỗi, chặn phát hành) cho FR-013.
- **FR-016**: Kết quả giải mù đã có MUST được chuyển sang chữ cái mới theo nội dung phương án (không làm lại); 8 đề vẫn giải mù 200/200.
- **FR-017**: Bài làm đã lưu (cả đề, một phần, từng lượt) MUST hiện đúng câu đã chọn sau khi đổi cách xếp; đề đang làm dở (≤ 3 giờ) không bị chấm sai.
- **FR-018**: Câu Part 1–2 đổi thứ tự phương án MUST có giọng đọc mới (lời đọc kèm chữ cái).

### Key Entities

- **Loại lỗi (mục sổ lỗi)**: mã, tên, khâu, Part, mô tả, trạng thái, luật phòng (một hoặc vài mã).
- **Ví dụ**: câu / bài (mã câu, đề), bản trước khi sửa, bản sau khi sửa, ai bắt được.
- **Lần gặp**: đề, số câu, lúc soạn hay lúc làm đề, bản phát hành.
- **Luật phòng**: mã tiêu chí người soát (`H-*`) hoặc mã luật máy (bộ dựng, máy kiểm), mức (chặn / cảnh báo / người nhớ).
- **Phản hồi của người sáng lập**: mã mục, ✓ / ✗, ghi chú, ngày.
- **Cách xếp phương án của đề**: theo từng Part, chữ cái đáp án của mỗi câu; một nơi định nghĩa cho app, máy kiểm, phiếu giải mù.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% loại lỗi đã sửa ở v149–v154 (đối chiếu CLAUDE.md, bộ tiêu chí, ghi chú giải mù 8 đề) có trong danh mục; 10 lỗi chọn ngẫu nhiên đều tìm thấy.
- **SC-002**: 100% mục có ít nhất một ví dụ thật và ít nhất một luật phòng; 100% mã luật có thật (test tự kiểm).
- **SC-003**: Từ 🎯 Luyện đề tới màn sổ lỗi ≤ 2 chạm; đọc xong một mục ≤ 30 giây; trên khổ 320 px không tràn ngang, mọi nút ≥ 44 px, tương phản đạt ở nền sáng và tối.
- **SC-004**: Mọi luật máy mới bắt đúng 100% câu cài lỗi của nó và không báo nhầm câu sạch; 8 đề vẫn 0 lỗi, 0 cảnh báo chưa xem.
- **SC-005**: Người sáng lập đọc màn và trả lời "đúng ý" hoặc chỉ ra chỗ sai trong một lần xem (đo bằng phản hồi của người sáng lập).
- **SC-006**: Không có đề thử trọn mới nào sau Đề 8.
- **SC-007**: 8 đề × 7 Part = 56 Part đều trong ngưỡng FR-013 (trước: nhiều Part lệch, chuỗi tới 5 câu); 8 đề vẫn 0 lỗi, 0 cảnh báo chưa xem, giải mù 200/200 sau khi đổi.

## Assumptions

- Phạm vi: đề thử TOEIC trọn (Đề 1–8) và lỗi hiển thị đề người sáng lập gặp khi làm đề. Kho luyện, IELTS, Cambridge, đề AI, kho đề soạn sẵn: ngoài phạm vi đợt này (danh mục để chỗ cho kỳ thi khác sau).
- "Cấu trúc đề" = cách dựng một đề: khuôn đề (đặc tả 010), bộ tiêu chí, quy trình soạn, luật máy. Danh mục được nối vào các chỗ này.
- Dữ liệu danh mục là tĩnh, đi kèm app; Claude cập nhật khi có lỗi mới.
- Màn hiện bằng tiếng Việt có dấu, câu ngắn; ví dụ tiếng Anh giữ nguyên văn.
- Chưa kiểm trên iPhone (máy soạn không có WebKit); nhờ người sáng lập thử.
- KHÔNG đổi luật đo.

## Out of Scope

- Soạn đề mới (Đề 9 trở đi).
- Áp danh mục cho IELTS, Cambridge, đề AI (để đợt sau nếu cần).
