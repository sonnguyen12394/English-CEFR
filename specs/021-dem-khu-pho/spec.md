# Đặc tả 021: 🌙 Đêm ở Khu phố (trò tìm kẻ giả mạo theo đề TOEIC)

**Feature Branch**: `claude/sleepy-heisenberg-2axnix`
**Created**: 17/11/2026
**Status**: Draft
**Input**: Người sáng lập "Ok làm đi" sau bản mẫu https://claude.ai/artifact/EQbiLzGrUWvmDR56j9THBm (v4). Kịch bản `docs/KICH-BAN-KHU-PHO.md` bản 5; tiêu chí `docs/TIEU-CHI-GAMEPLAY.md` G1–G12 + W1–W8. Mượn cơ chế chung của thể loại tìm kẻ giả mạo (Goose Goose Duck…), không chép tên, hình, bản đồ, vai, tiếng.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Chơi một đêm theo đề đã chọn (Priority: P1)

Người ôn TOEIC chọn một đề ở 🏙 Thành phố, vào 🌙 Đêm ở Khu phố. Màn vai cho biết mình là cư dân, có 1 kẻ giả mạo trong 6 cư dân máy. Người học đi tới các nhà có việc; mỗi việc là MỘT câu thật của đề đó (câu đang sai trước, rồi câu tới hạn ôn, rồi câu chưa làm), đặt ở nhà của phố mà câu thuộc về. Đúng thì thanh việc chung đầy thêm; đầy thanh thì cư dân thắng.

**Why this priority**: Đây là lõi học: trò chơi chỉ có giá trị nếu việc là câu thật của đề người học đang ôn.

**Independent Test**: Chọn Đề 3, vào một đêm, làm đủ việc → thấy câu là câu của Đề 3 (đúng số câu, đúng phương án), thắng khi thanh đầy, câu làm đúng / sai được ghi lại như câu làm ở phố.

**Acceptance Scenarios**:

1. **Given** Đề 3 có câu đang sai, **When** vào một đêm, **Then** các việc lấy câu đang sai trước, mỗi việc ở nhà của phố của câu đó, phương án xáo.
2. **Given** người học làm đúng một câu đề không dùng gợi ý, **When** về hành trình ⚔️ Chinh phục đề, **Then** câu đó hiện ⭐ đúng như khi làm đúng ở phố bậc 3–4.
3. **Given** người học làm sai, **When** xem lời giải, **Then** thấy đáp án, vì sao (lời giải có sẵn của câu), việc vẫn còn và câu vào lịch ôn ngày mai.
4. **Given** đề chưa có câu nào làm (người mới), **When** vào đêm, **Then** việc lấy câu chưa làm theo thứ tự đề, không lỗi.

---

### User Story 2 - Họp phố, nhận ra luật sai, bỏ phiếu (Priority: P1)

Kẻ giả mạo ru ngủ cư dân ở chỗ vắng và tắt đèn. Người học thấy người ngủ (hoặc rung chuông khẩn) → màn phát hiện → họp: lời khai hiện lần lượt, có nhân chứng tố (từ chuyện thật trong đêm), kẻ giả mạo đổ tội, người bị tố chối; mỗi cư dân nói một luật tiếng Anh, kẻ giả mạo nói luật sai lấy từ phương án nhiễu của chính đề. Bỏ phiếu → màn đuổi → ô "Luật sai ✗ → Luật đúng ✓" → Hồ sơ bẫy.

**Why this priority**: Họp là phần "wow" và là chỗ học nhận ra phương án nhiễu.

**Independent Test**: Ép một người ngủ trong vòng sáng → báo → họp có ≥ 1 luật sai lấy từ câu của đề đang chơi, bỏ phiếu đúng → thắng; ô học hiện luật đúng.

**Acceptance Scenarios**:

1. **Given** họp mở, **When** lời khai hiện, **Then** có đúng một lời khai luật sai (của kẻ giả mạo), luật sai và luật đúng sinh từ một câu của đề đang chơi (phương án nhiễu + luật của phố).
2. **Given** có nhân chứng thật đứng gần lúc cư dân bị ru ngủ, **When** họp, **Then** nhân chứng có thể tố kẻ giả mạo; không bao giờ tố sai người.
3. **Given** bỏ phiếu xong, **When** đuổi một người, **Then** màn bay qua trời sao + chữ chạy cho biết có phải kẻ giả mạo; sau đó luôn có ô luật sai → đúng.

---

### User Story 3 - Cảm giác chơi và dùng được trên điện thoại (Priority: P2)

Đêm có đèn, đom đóm, nhân vật đi lắc lư, nói bong bóng; âm thanh tự tổng hợp cho mọi sự kiện (tắt được); màn toàn màn hình cho phát hiện / họp khẩn / mất điện; chế độ học (mặc định bật) dừng phố khi đang làm câu; giảm chuyển động thì bỏ hiệu ứng trang trí.

**Why this priority**: Người sáng lập yêu cầu "wow"; phải chạy được một tay trên iPhone.

**Independent Test**: Chơi trọn một đêm trên khổ 320 px: không lỗi trang, không tràn ngang, mọi nút ≥ 44 px, tắt tiếng / chế độ học hoạt động.

**Acceptance Scenarios**:

1. **Given** chế độ học bật, **When** mở một việc, **Then** cư dân máy và đồng hồ đêm dừng tới khi đóng việc.
2. **Given** máy đặt giảm chuyển động, **When** chơi, **Then** không có đom đóm / rung / bay, chữ hiện ngay.

---

### Edge Cases

- Đề có ít câu ở một số phố: việc rải theo phố có câu; nhà của phố không có câu thì không có việc.
- Đề riêng có mã chưa mở: chỉ đề đã mở mới chọn được (như Thành phố).
- Câu Part 6 / Part 7: dùng cách cắt câu + câu trước + "Xem cả đoạn" có sẵn của phố; câu Part 7 chèn câu / tìm câu chứa đáp án dùng màn chọn phù hợp, không ép vào trắc nghiệm nếu phố đó có màn riêng. [Giả định: bản đầu chỉ trắc nghiệm 4 phương án cho mọi phố + nối dây cho câu loại từ; xem Assumptions.]
- Đóng app giữa đêm: đêm không lưu; câu đã trả lời đã được ghi.
- Mọi cư dân bị ru ngủ khi người học đang làm việc (chế độ học tắt): kẻ giả mạo thắng, vẫn có ô học.
- Không có phương án nhiễu dùng được để sinh luật sai: dùng bảng luật sai soạn sẵn của phố đó.

## Clarifications

### Session 17/11/2026
- Q: Lối vào ở đâu? → A: Thay màn Thành phố bằng bản đồ khu phố (ngày: đi vào phố; đêm: ván tìm kẻ giả mạo).
- Q: Câu đề làm trong đêm có ghi kết quả không? → A: Có, ghi như câu đề làm ở phố bậc 3–4 (⭐ Chinh phục đề + lịch ôn).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Màn 🏙 Thành phố được THAY bằng bản đồ khu phố: 8 nhà = 8 phố, 🏰 lâu đài = ⚔️ Chinh phục đề, quảng trường có chuông. Ban ngày: chạm nhà → Mầm đi tới → thẻ phố (bậc, số câu của đề, đang sai) + nút "Vào phố" (≤ 2 chạm). Nút 🌙 Bắt đầu đêm mở một ván trên cùng bản đồ. Hàng chọn đề + mở đề riêng giữ ở đầu màn; danh sách phố dạng thẻ vẫn có trong "Thêm" gập (cho người không muốn đi bản đồ).
- **FR-002**: Mỗi đêm có 6 cư dân máy lấy từ cư dân của các phố mà đề cần; 1 kẻ giả mạo bí mật, đổi mỗi đêm.
- **FR-003**: Việc của người học trong đêm là 5–6 câu thật của đề, chọn theo thứ tự: câu đang sai → câu tới hạn ôn của phố → câu chưa làm; mỗi câu đặt ở nhà của phố của nó (dùng cách gắn phố có sẵn của app).
- **FR-004**: Có ít nhất 2 kiểu trò: trắc nghiệm theo chủ đề nhà, và nối dây loại từ (từ cùng họ của câu dạng từ) khi đề có câu loại từ.
- **FR-005**: Kết quả từng câu đề ghi như câu đề làm ở phố bậc 3–4: đúng không gợi ý → ⭐ đúng ở Chinh phục đề + lịch ôn 1 → 3 → 7 → 21 ngày; sai → ⭐ mất, lịch ôn ngày mai.
- **FR-006**: Kẻ giả mạo ru ngủ cư dân khi đứng riêng và ngoài tầm nhìn người học; một lần tắt đèn mỗi đêm, sửa bằng một câu đề ở Chợ / nhà phố bất kỳ có câu.
- **FR-007**: Họp mở bằng báo người ngủ (trong vòng sáng) hoặc chuông khẩn (1 lần / đêm); lời khai hiện lần lượt; có 3 loại lời: tố (nhân chứng thật), đổ tội (kẻ giả mạo), chối.
- **FR-008**: Luật sai của kẻ giả mạo sinh từ một câu của đề đang chơi: luật đúng = luật của đáp án (bảng luật của phố / lời giải), luật sai = luật nghe hợp lý dẫn tới một phương án nhiễu của chính câu đó. Cư dân thật chỉ nói luật đúng.
- **FR-009**: Bỏ phiếu: người học và cư dân máy cùng bỏ; nhiều phiếu nhất bị đuổi (hoà / bỏ qua nhiều nhất = không đuổi); màn đuổi cho biết có phải kẻ giả mạo.
- **FR-010**: Sau mỗi buổi họp luôn hiện luật sai → luật đúng; các bẫy vào 🗂 Hồ sơ bẫy của đề, xem lại được ở màn đầu Đêm ở Khu phố.
- **FR-011**: Thắng / thua: cư dân thắng khi đầy thanh việc chung hoặc đuổi được kẻ giả mạo; kẻ giả mạo thắng khi cư dân thức ≤ 1 + số kẻ giả mạo. Thua không mất gì; màn cuối có số câu đúng / sai và bẫy đã gặp.
- **FR-012**: Âm thanh tự tổng hợp ≥ 10 loại sự kiện, nút tắt riêng; màn toàn màn hình cho phát hiện / họp khẩn / mất điện; nhân vật đi, thở, quay mặt, nói bong bóng.
- **FR-013**: Chế độ học (mặc định bật) dừng đêm khi làm câu; giảm chuyển động bỏ hiệu ứng trang trí; mọi nút ≥ 44 px; đúng / sai / vai có chữ + ký hiệu.
- **FR-014**: Không đổi luật đo 📘 Học / 🔁 Nhớ / Thi chuyển cấp; không ghi điểm đề thử trọn, bản đồ chỗ yếu, thẻ học Nền.

### Key Entities

- **Đêm**: đề, cư dân máy (vai, vị trí, nhà vừa ở, lịch sử chỗ), việc của người học (câu đề + nhà), thanh việc chung, sự kiện ru ngủ (người ngủ, nơi, nhân chứng, nghe thấy), trạng thái đèn, chuông đã dùng, các buổi họp. Không lưu giữa các lần mở app.
- **Câu đề**: câu Phần Đọc của đề (đã có), phố gắn với câu (đã có), lời giải (đã có).
- **Luật khai**: cặp (luật sai, luật đúng) gắn với một câu đề và một phương án nhiễu.
- **Hồ sơ bẫy**: danh sách luật sai → đúng đã gặp, theo đề, lưu cùng tiến độ người học.
- **Thiết lập**: tắt tiếng, chế độ học (theo máy).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% việc trong đêm là câu thật của đề đang chọn, đặt đúng phố của câu (kiểm trên 16 đề).
- **SC-002**: Mỗi buổi họp có đúng 1 luật sai và luật đó gắn với một câu của đề đang chơi (kiểm 50 buổi họp giả lập).
- **SC-003**: Từ màn đầu tới câu hỏi đầu tiên của đêm ≤ 3 chạm; từ Thành phố vào một phố ≤ 2 chạm; một đêm 5–8 phút với 5–6 câu.
- **SC-004**: Bộ tiêu chí `docs/TIEU-CHI-GAMEPLAY.md`: G1–G12 12 / 12 và W1–W8 8 / 8 khi chấm bản trong app.
- **SC-005**: Khổ 320 px: 0 lỗi trang, 0 tràn ngang, mọi nút ≥ 44 px; bộ test của app đạt hết.
- **SC-006** (chưa đo được, cần người chơi thật): người sáng lập chơi 1 đêm trên iPhone và muốn chơi tiếp đêm thứ hai; sau 2 tuần ≥ 2 người học chơi ≥ 5 đêm.

## Assumptions

- Bản đầu: việc là trắc nghiệm 4 phương án (câu đề Part 5 / chỗ trống Part 6 cắt câu như ở phố, câu Part 7 hiện kèm "Xem cả bài") và nối dây cho câu dạng từ; chèn câu / chạm câu chứa đáp án để đợt sau.
- Cư dân máy dùng hình và tên cư dân có sẵn của 8 phố; tên trùng "Chú Giới" (Chợ) / "Chú Gạch Giới" (Cầu Nối) chưa đổi trong đợt này.
- Kẻ giả mạo và cư dân máy là máy; không chơi nhiều người thật.
- Luật đúng / sai do máy sinh từ dữ liệu có sẵn (luật của phố, nhãn lời giải); khuôn câu luật sai mỗi phố do Claude soạn, chưa giáo viên kiểm.
- Không gọi AI, không đổi máy chủ.
