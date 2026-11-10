# Feature Specification: Bộ kiểm nội dung đề TOEIC

**Feature Branch**: `claude/ecstatic-curie-q9g1ja` → gộp vào `claude/kiem-noi-dung-de-7l02h6` · **Created**: 2026-11-09 · **Status**: Đã làm hết: US1–US3 (bản 150 = v153), US4 Đề 7–8 (bản 151 = v154)

**Input**: Người sáng lập (9/11/2026, sau bản 148 = Đề 5–6): "Tôi nghĩ là bạn cần làm bộ kiểm nội dung đề để dựa vào đó mà kiểm lỗi khi sinh bài vì có vài câu không hợp lý lắm. Giờ làm bộ đó rồi lưu lại để kiểm nội dung các đề cũ rồi hãy làm tiếp".

## Hiện trạng (9/11/2026, đo trên dữ liệu)

- Nội dung TOEIC: kho luyện 562 câu (Part 1–7) + 6 đề trọn × 200 câu (Đề 1–2 lấy từ kho, Đề 3–6 soạn mới, 800 câu). Tất cả Claude soạn, chưa giáo viên kiểm, chưa người học thật nào dùng.
- Máy kiểm hiện có (`tools/build-toeic.mjs`) chỉ kiểm **hình thức**: cơ cấu đề, số câu, nhãn dạng câu, đáp án nằm trong phương án, câu trích chứa đáp án có nguyên văn trong bài, trùng / gần trùng chữ, bảng có đủ phương án. Máy KHÔNG kiểm **ý**: đáp án có đúng và duy nhất không, phương án sai có lỡ đúng không, câu hỏi có hợp lý không.
- Đợt 2 (v150) Claude tự phát hiện 28 câu gần trùng mà máy đợt 1 bỏ sót, sau khi người sáng lập đã dùng đợt 1: tự soát bằng mắt không đủ.
- Quét thử 9 luật nhanh (chỉ đọc) trên kho + Đề 1–6, ra 3 nhóm:
  - **Nghi lỗi thật, cần xem**: 1 câu bảng mà lời nghe nói thẳng tên đáp án (d05-p4-10: "The children's parade has been moved…", bảng chỉ dùng để đổi "cuối ngày" thành 4 giờ); 19 giải thích tiếng Việt không nhắc tới đáp án (phần lớn chỉ viết chung "If + hiện tại đơn", không sai, nhưng không giúp người học thấy vì sao).
  - **Báo nhầm nhiều**: 85 phương án sai có đủ từ trong bài (gần hết là bẫy "lặp từ" đúng kiểu đề thật, vd. "Call the client" khi câu hỏi hỏi người khác), 17 câu "giọng nam / nữ không khớp" (luật quá thô: "What does the woman ask the man to do?" bị bắt nhầm), 1 câu bảng ("lowest" chứa chữ "west"), 1 câu NOT và 1 câu Part 2 ("No later than six" bị coi là trả lời No), đọc lại đều đúng. → Luật tự động phải chọn lọc, nếu không sẽ thành danh sách quá dài không ai đọc.
  - Kết luận: phần máy bắt được chắc chắn (lỗi) khác phần máy chỉ nghi (cần người hoặc Claude đọc lại). Bộ kiểm phải tách 2 loại này.

## Clarifications

### Session 2026-11-09

- Q: Người sáng lập đã thấy câu không hợp lý thuộc loại nào? → A: **Không nhớ cụ thể, Claude tự soát** toàn bộ theo bộ tiêu chí (không có danh sách câu mẫu của người sáng lập).
- Q: Đợt này bộ kiểm áp cho nội dung nào? → A: **Chỉ đề thử trọn TOEIC** (Đề 1–6 và các đề mới). Đề 1–2 dùng câu của kho luyện nên 400 / 562 câu của kho được kiểm theo; 162 câu kho còn lại, IELTS, Cambridge, đề soạn sẵn để đợt sau.
- Q: Có thêm bước "giải mù" không? → A: **Có, cho đề cũ và đề mới**: một phiên Claude khác làm đề không xem đáp án (Đề 1–6 và mỗi đề mới); câu chọn khác đáp án hoặc báo "có 2 phương án đều được" thì đánh dấu để Claude xem lại (người sáng lập chấp nhận tốn thêm lượt dùng gói Pro).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Bộ tiêu chí soát câu hỏi, lưu trong repo (Priority: P1)

Mỗi khi soạn câu TOEIC mới (đề trọn, kho luyện, đề soạn sẵn), Claude soát từng câu theo MỘT bộ tiêu chí viết sẵn theo từng Part (đáp án đúng và duy nhất; phương án sai thật sự sai nhưng hợp lý; không lộ đáp án qua độ dài / dạng câu / từ lặp; người nói nam / nữ khớp câu hỏi; câu hàm ý, câu bảng, câu chèn, câu NOT, câu đối chiếu đúng luật riêng; phép tính, ngày giờ khớp; giải thích khớp đáp án; tiếng Anh tự nhiên; không định kiến). Mỗi tiêu chí có mã, mô tả ngắn, ví dụ đúng / sai, cách kiểm (máy hay người). Tài liệu nằm trong repo và CLAUDE.md trỏ tới, nên phiên Claude sau cũng dùng.

**Why this priority**: là gốc của mọi lần kiểm; không có bộ tiêu chí thì máy kiểm và người kiểm không biết thế nào là "không hợp lý".

**Independent Test**: mở tài liệu, chọn ngẫu nhiên 10 câu đã biết có lỗi (bộ câu cài lỗi, xem SC-002) → mỗi câu chỉ ra được tiêu chí nó vi phạm.

**Acceptance Scenarios**:

1. **Given** một câu Part 3 có phương án sai mà người được hỏi thật sự đã nói trong bài, **When** soát theo bộ tiêu chí, **Then** câu đó vi phạm tiêu chí "phương án sai thật sự sai" và có ghi cách sửa.
2. **Given** một phiên Claude mới bắt đầu soạn đề, **When** đọc CLAUDE.md, **Then** thấy chỉ dẫn phải soát theo bộ tiêu chí và chạy máy kiểm trước khi dựng.

---

### User Story 2 - Máy kiểm tự động khi dựng (Priority: P1)

Khi dựng nội dung TOEIC, máy chạy các luật tự động được của bộ tiêu chí. Kết quả chia 2 loại: **lỗi** (chắc chắn sai, dừng dựng) và **cảnh báo** (có thể sai, cần đọc lại). Mỗi dòng ghi: đề, số câu trong đề (1–200) hoặc mã câu, Part, mã tiêu chí, lý do bằng tiếng Việt, gợi ý sửa. Cảnh báo đã đọc và thấy ổn được ghi vào một danh sách "đã xem" kèm lý do, để lần sau không hiện lại; câu đổi nội dung thì cảnh báo hiện lại.

**Why this priority**: bắt lỗi trước khi lên web, không phụ thuộc trí nhớ của người soát.

**Independent Test**: chạy máy kiểm trên bộ câu cài lỗi (mỗi luật ít nhất 1 câu sai cố ý) và bộ câu sạch → bắt đủ câu cài lỗi, không báo lỗi câu sạch.

**Acceptance Scenarios**:

1. **Given** câu hàm ý hỏi "when she says" mà câu được trích do người nam nói, **When** dựng, **Then** báo lỗi, dựng dừng.
2. **Given** câu "Look at the graphic" mà đáp án không cần nhìn bảng vẫn chọn được (lời nghe nói thẳng giá trị đáp án), **When** dựng, **Then** báo cảnh báo câu bảng không cần bảng.
3. **Given** cảnh báo đã được ghi "đã xem, ổn vì …", **When** dựng lại mà câu không đổi, **Then** cảnh báo không hiện; sửa câu đó thì cảnh báo hiện lại.

---

### User Story 3 - Kiểm và sửa nội dung cũ (Priority: P1)

Chạy bộ kiểm (máy kiểm + giải mù) trên 6 đề thử trọn (Đề 1–6; Đề 1–2 là câu của kho luyện). Ra một báo cáo dễ đọc (theo đề, theo Part) để người sáng lập xem được mà không cần đọc mã. Lỗi thì sửa; cảnh báo thì Claude đọc lại từng câu, sửa câu thật sự kém, ghi lý do cho câu ổn. Đề 3–6 đã có người làm thử (người sáng lập) nên sửa giữ nguyên chữ cái đáp án khi làm được; câu nào buộc đổi thì ghi lại.

**Why this priority**: người sáng lập đã thấy câu không hợp lý trong đề đang dùng; đề mới chưa nên soạn khi đề cũ còn lỗi cùng kiểu.

**Independent Test**: sau khi sửa, chạy lại bộ kiểm trên Đề 1–6 → 0 lỗi, mọi cảnh báo (kể cả câu giải mù chọn khác đáp án) đã sửa hoặc có lý do "đã xem".

**Acceptance Scenarios**:

1. **Given** báo cáo có N câu lỗi, **When** Claude sửa xong và chạy lại, **Then** còn 0 lỗi.
2. **Given** phiên giải mù chọn khác đáp án ở một câu, **When** Claude đọc lại, **Then** hoặc sửa câu (đáp án / phương án / lời bài) cho chỉ còn một đáp án, hoặc ghi lý do đáp án gốc đúng và phiên giải mù sai; loại lỗi mới thì thêm vào bộ tiêu chí.

---

### User Story 4 - Soạn tiếp Đề 7–8 qua bộ kiểm (Priority: P2)

Sau khi đề cũ sạch, soạn tiếp đợt 3 (Đề 7–8) của đặc tả 010; mỗi câu qua bộ tiêu chí khi soạn, qua máy kiểm khi dựng và qua giải mù; phát hành chỉ khi 0 lỗi và 0 cảnh báo chưa xem.

**Why this priority**: là việc người sáng lập muốn làm tiếp, nhưng phụ thuộc US1–US3.

**Independent Test**: dựng Đề 7–8 → máy kiểm 0 lỗi, 0 cảnh báo chưa xem; giải mù khớp đáp án hoặc mọi câu lệch đã xử lý; bảng kiểm giáo viên có Đề 7–8.

**Acceptance Scenarios**:

1. **Given** Đề 7 có một câu bị cảnh báo, **When** chưa ghi "đã xem" hoặc chưa sửa, **Then** không phát hành.

---

### Edge Cases

- Câu đúng kiểu đề thật nhưng giống lỗi (bẫy lặp từ, câu trả lời gián tiếp ở Part 2, đáp án Part 2 lặp lại lựa chọn trong câu hỏi lựa chọn): không được báo lỗi; nhiều nhất là cảnh báo có thể ghi "đã xem".
- Số đọc bằng chữ trong lời nghe ("seven twenty-five") so với số trong bảng ("7:25"), từ chứa từ ("lowest" chứa "west"): luật so chữ phải hiểu được, không báo nhầm.
- Hội thoại 3 người (2 người nữ): câu hỏi "the woman" có thể chỉ một trong hai; câu hỏi gọi tên ("Priya") phải tra người nói theo tên.
- Sửa câu ở đề đã có bài làm lưu (📋): chữ cái đáp án Part 3–7 được xếp theo nội dung phương án, đổi chữ trong phương án có thể đổi thứ tự; ghi lại các câu bị đổi.
- Nội dung ngoài đề trọn TOEIC (162 câu kho luyện không nằm trong Đề 1–2, IELTS, Cambridge, đề soạn sẵn, đề AI): ngoài phạm vi đợt này; máy kiểm có thể chạy xem trên kho nhưng không bắt buộc sửa.
- Phiên giải mù cũng có thể sai (nhất là Part 1 chỉ thấy mô tả tranh, Part 2–4 chỉ đọc chữ không nghe): câu lệch là "cần xem", không tự coi là lỗi.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Có một bộ tiêu chí soát câu TOEIC theo từng Part, mỗi tiêu chí có mã, mô tả, ví dụ đúng / sai, mức (lỗi / cảnh báo / chỉ người kiểm), cách kiểm (máy / người); lưu trong repo, CLAUDE.md trỏ tới.
- **FR-002**: Máy kiểm chạy mọi tiêu chí tự động được trên đề trọn TOEIC (Đề 1–6 và đề mới); chia lỗi / cảnh báo; lỗi dừng dựng.
- **FR-003**: Mỗi kết quả ghi được vị trí người dùng tìm thấy trong app (đề + số câu 1–200, hoặc Part + bài trong kho luyện), mã tiêu chí, lý do và gợi ý sửa bằng tiếng Việt.
- **FR-004**: Có danh sách "cảnh báo đã xem" (câu, tiêu chí, lý do, ngày); cảnh báo tự hiện lại khi câu đổi nội dung.
- **FR-005**: Có báo cáo dễ đọc cho người sáng lập (một trang, theo đề / Part, đếm lỗi, cảnh báo, đã sửa, đã xem).
- **FR-006**: Có bộ câu cài lỗi cố ý cho từng luật tự động (để thử máy kiểm) và test tự động bảo đảm máy bắt đủ, không báo lỗi câu sạch.
- **FR-007**: Chạy trên Đề 1–6, sửa mọi lỗi, xử lý mọi cảnh báo (sửa hoặc ghi lý do); sửa Đề 3–6 giữ chữ cái đáp án khi làm được, câu đổi chữ cái được liệt kê. Câu của kho dùng trong Đề 1–2 sửa ở kho (một chỗ, cả luyện lẫn đề cùng đổi).
- **FR-008**: Câu sửa có lời nghe thì dựng lại giọng; bảng kiểm giáo viên cập nhật; không đổi luật đo; luyện thi không tính vào 📘 / 🔁.
- **FR-009**: Người sáng lập không có câu mẫu; Claude tự soát toàn bộ Đề 1–6 theo bộ tiêu chí. Loại lỗi mới phát hiện khi soát hoặc giải mù được thêm vào bộ tiêu chí (và thành luật máy nếu tự động được).
- **FR-010**: Phạm vi đợt này: chỉ đề thử trọn TOEIC (Đề 1–6 + đề mới). Bộ tiêu chí viết sao cho dùng lại được cho kho luyện và kỳ thi khác ở đợt sau.
- **FR-011**: Giải mù: mỗi đề (Đề 1–6 và đề mới) được một phiên Claude khác làm mà không thấy đáp án, giải thích, câu trích; phiên đó trả lời từng câu kèm mức chắc và ghi chú khi thấy 2 phương án đều được. Câu trả lời khác đáp án hoặc có ghi chú "2 phương án" thành cảnh báo phải xử lý (sửa hoặc ghi lý do). Tỉ lệ khớp được ghi lại theo đề.
- **FR-012**: Sau khi nội dung cũ sạch, soạn Đề 7–8 (đặc tả 010, đợt 3) qua bộ kiểm; phát hành khi 0 lỗi, 0 cảnh báo chưa xem.

### Key Entities

- **Tiêu chí (Rule)**: mã (vd. `P3-GIOI`), Part áp dụng, mô tả, ví dụ đúng / sai, mức, cách kiểm.
- **Kết quả kiểm (Finding)**: câu (mã + vị trí trong đề), tiêu chí, mức, lý do, gợi ý sửa.
- **Cảnh báo đã xem (Ack)**: câu, tiêu chí, dấu nội dung câu lúc xem, lý do, ngày.
- **Báo cáo (Report)**: tập kết quả theo đề / Part + số đếm.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Máy kiểm chạy trên 6 đề trọn xong trong dưới 1 phút trên máy soạn.
- **SC-002**: Bộ câu cài lỗi (≥ 1 câu mỗi luật tự động, ≥ 20 câu): máy bắt 100%; bộ câu sạch (≥ 50 câu đã soát tay): 0 lỗi báo nhầm.
- **SC-003**: Sau khi xử lý nội dung cũ: 0 lỗi; 100% cảnh báo đã sửa hoặc có lý do "đã xem"; cảnh báo còn lại (đã xem) ≤ 5 trên 100 câu để danh sách đọc được.
- **SC-004**: Giải mù Đề 1–6: ghi tỉ lệ khớp đáp án từng đề; 100% câu lệch được xử lý (sửa hoặc lý do); sau khi sửa, giải mù lại các câu đã sửa khớp 100%.
- **SC-005**: Đề 7–8 phát hành với 0 lỗi, 0 cảnh báo chưa xem, giải mù lệch đã xử lý hết.
- **SC-006 (đo sau, cần người thật)**: khi có giáo viên kiểm bảng kiểm, tỉ lệ câu giáo viên đánh "sai" trong phần đã qua bộ kiểm < 2%; nếu cao hơn thì xem lại tiêu chí.

## Assumptions

- Bộ tiêu chí dựa trên mô tả công khai của đề TOEIC (ETS) và nguyên tắc viết câu trắc nghiệm phổ biến (một đáp án đúng, phương án sai hợp lý, không lộ đáp án qua hình thức); Claude soạn theo hiểu biết, chưa đối chiếu tài liệu ETS nội bộ (không công bố).
- Không có khoá AI trên máy chủ, nên máy kiểm là luật cố định chạy trên máy soạn; phần cần hiểu nghĩa do Claude đọc lại theo bộ tiêu chí và do phiên giải mù (phiên Claude phụ trong Claude Code, tính vào gói Pro).
- Chưa có người học thật và giáo viên: "đúng" vẫn là theo Claude; bộ kiểm giảm lỗi chứ không thay giáo viên.
- Không đổi luật đo, không đổi giao diện người học (trừ khi sửa câu); báo cáo là trang tài liệu trong repo, không phải màn trong app.
- Đề 3–6: người sáng lập là người duy nhất từng làm; đổi chữ cái đáp án của câu đã sửa chấp nhận được nếu không tránh được.
