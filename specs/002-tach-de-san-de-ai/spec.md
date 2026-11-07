# Đặc tả tính năng: Tách 📚 Đề có sẵn và 🤖 Đề AI trong tab 🎯 Luyện đề

**Nhánh**: `claude/ecstatic-curie-q9g1ja`

**Ngày tạo**: 2026-11-07

**Trạng thái**: Bản nháp

**Yêu cầu gốc**: "Tách ra làm 2 phần là đề do AI soạn và đề mẫu có sẵn trong app để có thể tận dụng những bài có sẵn đỡ tốn chi phí gọi AI."

**Liên quan**: sửa tiếp tính năng `specs/001-luyen-de-ai/` (v137).

**Luật đo**: KHÔNG đổi (luyện đề không tính 📘 Học / 🔁 Nhớ / Thi chuyển cấp).

## Gốc vấn đề

Ở v137, việc nổi nhất trên màn kỳ thi là nút to "▶ Làm đề AI mới" (tốn tiền mỗi lần bấm). Bài có sẵn (miễn phí) nằm dưới, không có nút chính. Kho bài có sẵn khá dày: IELTS 17 bài đọc, 9 phần nghe, 31 đề viết, 38 chủ đề nói; TOEIC 12 + 50 + 25 + 25 câu / bài Nghe, 108 câu Part 5, 20 đoạn Part 6, 20 bộ Part 7; Cambridge mỗi cấp nhiều bài đọc, nghe, dạng đề thật. Thêm khoản tốn ngầm: sau mỗi đề AI, app tự soạn sẵn 1 đề AI kế tiếp (đề dự trữ), kể cả khi người học không quay lại.

## Kịch bản người dùng và kiểm thử *(bắt buộc)*

### Kịch bản 1: Thấy rõ hai phần, phần miễn phí trước (Ưu tiên: P1)

Người học mở tab 🎯 Luyện đề. Màn đầu có tên kỳ thi, band / điểm ước và **2 nút to**: 📚 Đề có sẵn (miễn phí, nút chính) · 🤖 Đề AI soạn (tốn phí). Bấm 📚 thì thấy ô kỹ năng, bài học dạng đề, bài tập, thi thử cả đề, đề thật (như v137 nhưng không có ô 🤖). Bấm 🤖 thì thấy ô đề AI (một nút chính, chọn kỹ năng, đề đang dở, đề đã làm) kèm dòng "mỗi đề AI tốn tiền gọi AI".

**Kiểm độc lập**: mở tab → thấy 2 nút; bấm 📚 → không có nút gọi AI; bấm 🤖 → thấy ô đề AI; "‹ Luyện đề" về màn 2 nút.

**Kịch bản chấp nhận**:

1. **Cho** người học mở tab, **thì** màn đầu có đúng 2 nút to 📚 · 🤖, chưa có nút nào gọi AI ngay (nút 🤖 chỉ mở phần đề AI).
2. **Cho** đang ở 📚, **khi** bấm 🤖 Đề AI, **thì** thấy ô đề AI như v137 và dòng nhắc chi phí.
3. **Cho** đổi qua lại, **thì** chỉ đổi phần nội dung, không rời màn kỳ thi, không mất kỳ thi đang chọn.
4. **Cho** khổ 320 px, **thì** hàng chọn 2 phần nằm một dòng, mỗi nút cao ≥ 44 px, chữ không bị cắt.

---

### Kịch bản 2: Phần 🤖 nhắc dùng bài có sẵn trước (Ưu tiên: P1)

Trong phần 🤖, mỗi kỹ năng / dạng ghi số bài có sẵn chưa làm (vd. "📚 còn 12 bài đọc có sẵn chưa làm · miễn phí ›"), bấm là sang đúng màn kỹ năng ở phần 📚. Khi kỹ năng đó đã làm hết bài có sẵn, dòng nhắc đổi thành "Đã làm hết bài có sẵn: đề AI cho bài mới".

**Kịch bản chấp nhận**:

1. **Cho** IELTS Đọc còn 12 bài có sẵn chưa làm, **khi** mở 🤖, **thì** thấy "còn 12 bài … chưa làm" và nút sang màn Đọc phần 📚.
2. **Cho** đã làm hết bài đọc có sẵn, **thì** dòng nhắc nói đã hết và nút chính đề AI vẫn bấm được.
3. Không chặn người học dùng đề AI khi còn bài có sẵn (chỉ nhắc).

---

### Kịch bản 3: Giảm tiền đề dự trữ (Ưu tiên: P2)

App chỉ soạn sẵn đề AI kế tiếp theo luật ở FR-006 (chờ người sáng lập chọn), thay vì sau mọi đề AI.

**Kịch bản chấp nhận**:

1. **Cho** người học làm 1 đề AI rồi thoát, **thì** không có đề dự trữ nào được soạn (trừ khi người sáng lập chọn giữ như cũ).

---

### Kịch bản 4: Lối vào khác vẫn đúng chỗ (Ưu tiên: P2)

Việc luyện đề ở 📅 Hôm nay (bài có sẵn của kỳ thi mục tiêu) mở phần 📚. Lối tắt bản đồ, danh sách đề AI, đề AI đang soạn xong mở phần 🤖.

### Trường hợp biên

- Đề AI đang soạn xong khi người học đang ở phần 📚: hiện một dòng nhỏ "✅ Đề AI đã soạn xong ›" ở đầu phần 📚 (bấm mở phần 🤖), không tự chuyển phần.
- Kỳ thi chưa có bài có sẵn cho một dạng AI (vd. dạng chỉ AI có): dòng nhắc không hiện cho dạng đó.
- Máy chủ báo chưa cài khoá AI / hết lượt: phần 🤖 hiện lời báo và nút "Sang 📚 Đề có sẵn".

## Yêu cầu *(bắt buộc)*

### Yêu cầu chức năng

- **FR-001**: Màn đầu mỗi kỳ thi (IELTS, TOEIC, Cambridge) PHẢI có hàng chọn 2 phần 📚 Đề có sẵn · 🤖 Đề AI ngay dưới tên kỳ thi.
- **FR-002**: Phần 📚 PHẢI chứa đủ nội dung có sẵn như v137 (ô kỹ năng, "Thêm": thi thử cả đề, đề thật, sẵn sàng thi, nền cần có, bản đồ, cẩm nang) và KHÔNG có nút gọi AI.
- **FR-003**: Phần 🤖 PHẢI chứa ô đề AI của v137 và một dòng nói rõ mỗi đề AI tốn tiền; chọn dạng, đề dở, đề đã làm như cũ.
- **FR-004** (người sáng lập 7/11/2026: "hiện cả 2 nút chức năng để bấm"): màn đầu mỗi kỳ thi KHÔNG tự mở phần nào; dưới tên kỳ thi và dòng band / điểm ước PHẢI có 2 nút to: **📚 Đề có sẵn** (nút chính, ghi "miễn phí · còn N bài chưa làm") và **🤖 Đề AI soạn** (nút phụ, ghi "mỗi lần một đề mới · tốn phí AI"). Bấm nút nào thì vào phần đó; trong mỗi phần có hàng chọn 📚 · 🤖 để đổi thẳng và nút "‹ Luyện đề" về màn 2 nút.
- **FR-005**: Phần 🤖 PHẢI ghi số bài có sẵn chưa làm theo từng kỹ năng của kỳ thi và có nút sang đúng màn kỹ năng phần 📚; hết bài có sẵn thì ghi đã hết.
- **FR-006** (người sáng lập chọn): chỉ soạn sẵn đề AI kế tiếp khi người học vừa làm xong ≥ 2 đề AI cùng kỳ thi + dạng trong cùng một ngày; làm 1 đề rồi thoát thì không soạn sẵn.
- **FR-007**: Màn một kỹ năng (phần 📚) giữ hàng "🤖 Đề AI mới" nhưng đặt SAU danh sách bài có sẵn và ghi "khi làm hết bài có sẵn hoặc muốn bài mới".
- **FR-008**: Việc luyện đề ở 📅 Hôm nay mở phần 📚; lối tắt đề AI (đề xong, danh sách đề AI) mở phần 🤖.
- **FR-009**: Không đổi cách chấm, cách ghi kết quả, bản đồ, luật đo của v137.

### Thực thể chính

- **Phần đang mở của tab Luyện đề**: 📚 hoặc 🤖, theo kỳ thi.
- **Số bài có sẵn chưa làm**: theo kỳ thi × kỹ năng, tính từ kết quả bài có sẵn đã ghi.

## Tiêu chí thành công *(bắt buộc)*

- **SC-001**: Màn đầu tab 🎯 Luyện đề: 0 nút gọi AI trực tiếp; 2 nút to 📚 · 🤖 thấy ngay không cần cuộn ở khổ 320 × 568 px.
- **SC-002**: Từ màn đầu tới đề AI mới ≤ 2 lần chạm; tới một bài có sẵn ≤ 3 lần chạm (📚 → kỹ năng → bài); việc luyện đề ở 📅 Hôm nay vẫn mở thẳng bài.
- **SC-003** (sau 1 tháng có người dùng thật): ≥ 60% lượt luyện đề là bài có sẵn; số đề AI mỗi người học / tuần đo được ở 🛠.
- **SC-004**: Số đề dự trữ không được dùng ≤ 20% số đề dự trữ đã soạn (đo ở 🛠, nếu giữ đề dự trữ).

## Giả định

- Không thêm bài có sẵn mới trong đợt này; chỉ sắp xếp và nhắc.
- Đếm "bài chưa làm" dùng đúng danh sách bài ở màn kỹ năng v134 (cùng cách ghi "a/b đã làm").
- Kiểm sơ bộ trên Chromium khổ iPhone SE; ghi "chưa kiểm trên iPhone".
