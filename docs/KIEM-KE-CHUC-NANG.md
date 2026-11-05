# Kiểm kê chức năng (5/11/2026, sau v135)

Bước 1 của kế hoạch "gọt app": liệt kê chức năng người học nhìn thấy, chỗ trùng, dữ liệu dùng thật, đề xuất. **Chưa sửa gì.** Đề xuất có dấu ⚖️ là chạm luật đo: người sáng lập duyệt trước.

Vai trò khi đánh giá: thiết kế sản phẩm di động (mỗi việc một chỗ), khoa học ghi nhớ (ôn một lịch), giáo viên luyện thi (người học cần bài, không cần nhiều cách đo).

## 1. Dữ liệu dùng thật (Supabase, bảng `vocab_state`)

| Tài khoản | Lần cuối | Đã dùng |
|---|---|---|
| 1847… | 31/10 | 1 bài Từ vựng (10 thẻ), 1 ngày, ~1 phút |
| 2829… | 4/11 | 0 thẻ, 0 bài kỹ năng, 0 bài kỳ thi; kiểm tra trình độ dừng ở A2 (6/10); mục tiêu IELTS cần C1, thi 1/12/2026; 7 ngày mở app, tối đa ~7 phút / ngày |

Cả 2 có vẻ là máy người sáng lập thử. Sổ lỗi, sổ từ, bản đồ, đề thử, IELTS, TOEIC, Cambridge, thư viện, tra cứu (trừ 5 lần tra): **0 lần dùng**. Góp ý: 7.

**Kết luận dữ liệu:** không có chức năng nào có bằng chứng "người học dùng" hay "người học bỏ qua". Mọi đề xuất dưới đây dựa trên nguyên tắc thiết kế, là **suy luận**, cần bước 2 (người học thật) xác nhận.

Một tín hiệu đáng để ý: mục tiêu "IELTS 1/12 cần C1" từ A2 với 0 bài là không thể (ước Cambridge ~700 giờ). Người dùng thật cũng sẽ đặt mục tiêu kiểu này; màn mục tiêu cần nói rõ hơn hiện nay.

## 2. Bản đồ chức năng theo việc người học làm

Ký hiệu đề xuất: ✅ giữ · 🔗 gộp · 🙈 ẩn khỏi người học (giữ cho người sáng lập / giáo viên) · ✂️ bỏ.

### 2.1 Ôn lại theo lịch: 4 cơ chế

| Chức năng | Ở đâu | Lịch | Có trong nút "Ôn bài cũ" (`revRun`)? |
|---|---|---|---|
| Thẻ nhớ 7 phần Nền | màn từng phần, Hôm nay | `MEM_R` 80–90% | Có, nhưng chỉ mở **1 phần** nhiều bài đến hạn nhất (`revPart`) |
| 📒 Sổ lỗi | 👤 Tôi | Leitner 1 → 35 ngày | Có |
| 📌 Sổ từ (từ đề thật, từ tra) | Tra cứu, 👤 Tôi | Leitner 1 → 35 ngày (`S.ie.vw`) | Có |
| 📚 Từ công sở TOEIC (300 từ) | TOEIC | Leitner riêng | **Không** |

Đề xuất:
- 🔗 Từ công sở TOEIC vào nút ôn chung khi mục tiêu là TOEIC. Không chạm luật đo CEFR.
- 🔗 Nút ôn chung đi hết mọi phần đến hạn, không dừng ở 1 phần. Không đổi luật đo, chỉ đổi thứ tự.
- ✅ Giữ 4 lịch riêng bên trong (gộp lịch = đổi luật đo, lợi ích nhỏ vì người học chỉ thấy 1 nút).

### 2.2 Tìm và chữa chỗ yếu: 6 cơ chế, 3 nơi hiện

| Chức năng | Ở đâu |
|---|---|
| 🗺 Bản đồ Nền (theo bài) | 🧭 Lộ trình › 📈 Tiến độ › bản đồ đầy đủ |
| 🗺 Bản đồ Cambridge / IELTS / TOEIC (theo dạng) | cùng màn, hàng chọn 4 mục |
| 🧭 Chỗ hổng nền (sau kiểm tra trình độ) | trong bản đồ Nền, Hôm nay |
| 🧱 Học lại bài gốc (gác 2 lần) | trong bản đồ Nền |
| ⚡ Gợi ý học lại bài hay quên (`relearnUnits`) | màn Từ vựng |
| Mục "Thêm" của bản đồ: từng chỗ đang chữa, gốc, độ phủ, quét lại 21 ngày, hàng chờ, tạm gác, cân bằng Hiểu / Tạo ra, cách tính | gập trong bản đồ |

Nơi hiện: việc "Sửa lỗi sai" ở Hôm nay · danh sách chỗ yếu ở Tiến độ · màn bản đồ. Luật "chữa xong" có 3 biến thể: Nền (đúng ở ngày sau lần sai), IELTS / TOEIC (đạt 2 ngày liền, nhóm 3 chỗ, gác 14 ngày), Cambridge (không có nhóm, hết đỏ khi các lần gần đây ổn).

Đề xuất:
- 🙈 Tab bản đồ của kỳ thi KHÔNG phải mục tiêu: đưa vào "Xem thêm" (v121 cố ý hiện cả 4 theo yêu cầu người sáng lập; đây là đề xuất đảo lại).
- 🙈 Mục "Thêm" của bản đồ (8 khối kỹ thuật): chuyển sang chế độ người sáng lập / giáo viên. Người học chỉ cần: việc cần chữa + lưới bài.
- 🔗 ⚡ gợi ý học lại ở màn Từ vựng: trùng với 🟥 bài yếu của bản đồ → bỏ ô riêng, để bản đồ lo.
- ⚖️ (để sau bước 2) Một luật "chữa xong" chung cho 4 bản đồ.

### 2.3 Đo trình độ: 4 kiểu

| Chức năng | Mục đích | Ghi chú |
|---|---|---|
| 🧭 Kiểm tra trình độ + câu xác nhận | chọn nơi bắt đầu (v133: tính đã qua cấp dưới) | ✅ cốt lõi |
| 📝 Kiểm tra cuối đợt 10 ngày | "chỉ xem xu hướng" | tiến bộ 10 ngày nhỏ hơn sai số bài (chính `CLAUDE.md` v105 ghi) |
| 🔎 Quét lại 21 ngày (`mapScan`) | độ phủ từ | chạy cùng kiểm tra cuối đợt |
| 🚀 Thi vượt cấp | lên cấp nhanh | ✅ giữ ở Tiến độ |

Đề xuất:
- ✂️ Kiểm tra cuối đợt 10 ngày: bỏ (bằng chứng yếu theo chính lý do của v105). Giữ tổng kết đợt (số ngày, phút, chỗ chữa xong). Không chạm luật đo.

### 2.4 Luyện thi: mỗi kỳ thi ~10 cửa

Mỗi kỳ thi có: 📘 bài học theo dạng · 🏋️ bài tập · 🎓 thi thử cả đề · làm từng phần · 📝 nhập đề thật · 🎯 sẵn sàng thi · 🧱 nền cần có · 🗺 bản đồ · 📘 Cẩm nang · cách tính. IELTS thêm: 📏 hiệu chuẩn band, 📤 gửi giáo viên, 📥 dán lỗi giáo viên, 📥 từ mới từ đề thật, ✍️ viết lại bài.

Trùng rõ nhất:
- 📘 **Cẩm nang thi** (Tra cứu, `camnangView`) và 📘 **bài học kỳ thi** (v131, `baihoc.js`) cùng lấy mẹo `IE_HOW` / `TO_HOW` / `CB_HOWT`. → 🔗 bỏ Cẩm nang khỏi Tra cứu; ở Tra cứu chỉ là lối tắt tới bài học.
- 📏 hiệu chuẩn band, 📤 / 📥 giáo viên: chỉ có ích khi đã thi thật / có giáo viên. → 🙈 gom vào một mục "Có giáo viên / đã thi thật" trong "Thêm".
- 🎓 Cambridge làm từng phần (`cbPart`) và bài tập của phần đó: gần như một việc. → 🔗 một cửa.

### 2.5 Học Nền: phần "luyện thêm, không tính"

Hiểu câu, dò có giờ, đoán nghĩa từ, tách âm, khung Nói / Viết, nghe đuôi từ, nghe trọng âm, đoạn văn có khung. Đã gập trong "Thêm" (v116, v118). → ✅ giữ gập. Không có dữ liệu để bỏ.

Công cụ chấm âm: 🎚 hiệu chuẩn, 🧑‍🏫 đối chiếu giáo viên. → 🙈 chuyển sang chế độ người sáng lập / giáo viên (người học một mình không dùng được đối chiếu giáo viên).

### 2.6 Đọc / nghe thêm: 2 chức năng một việc

📚 Thư viện đọc (truyện Gutenberg, tự ghi giờ) và 📚 "đọc nghe thêm ngoài app" (ghi giờ tay, `S.ext`, ở Cambridge / sẵn sàng thi). → 🔗 một mục "Đọc thêm" ở 📚 Học › Xem thêm, ghi giờ chung.

### 2.7 Tra cứu: 5 mục + nhiều chip

Từ & cụm từ (12 chip con) · Ngữ pháp & lỗi · Phát âm (44 âm, cặp âm, 5 nhóm quy tắc) · Cẩm nang thi · tìm kiếm chung. Chức năng tra từ có người dùng (5 lần tra); phần còn lại 0. → ✅ giữ ô tìm + từ + ngữ pháp; 🔗 Cẩm nang như 2.4; các chip con còn lại để nguyên tới khi có dữ liệu.

### 2.8 Việc của người sáng lập lẫn trong app của người học

📊 Từ người học tra mà app chưa có (`tdMissView`) · 💾 sửa tệp dữ liệu, 🎚 đặt tiến độ theo phần × cấp · 📋 bảng kiểm nội dung giáo viên · 🎚 / 🧑‍🏫 bộ chấm âm. → 🙈 một mục "Công cụ người sáng lập" (chỉ tài khoản chung / bấm 5 lần vào số phiên bản). Không chạm luật đo.

## 3. Trùng trong mã (người học không thấy)

| Chỗ | Mức | Đề xuất |
|---|---|---|
| 4 tệp bản đồ (`bando`, `cbmap`, `iemap`, `tomap`) tự dựng khối "Việc cần chữa" + lưới | ~100–150 dòng (ước) | gộp hàm vẽ khi làm 2.2 |
| 3 bộ Leitner (sổ lỗi, sổ từ, từ TOEIC) | nhỏ | gộp hàm lịch khi làm 2.1 |
| 5 nguồn "việc hôm nay" | đã ghép 1 danh sách từ v107 | ✅ giữ |

## 4. Xếp thứ tự (đề xuất)

| # | Việc | Người học thấy gì | Luật đo | Công |
|---|---|---|---|---|
| 1 | 🙈 Gom việc của người sáng lập (2.8, công cụ chấm âm) | bớt 5–6 mục khó hiểu | không | nhỏ |
| 2 | 🔗 Bỏ Cẩm nang trùng bài học kỳ thi (2.4) | bớt 1 thẻ Tra cứu, 3 lối tắt | không | nhỏ |
| 3 | ✂️ Bỏ kiểm tra cuối đợt 10 ngày (2.3) | bớt 1 việc lạ ở Hôm nay ngày 10 | không | nhỏ |
| 4 | 🔗 Ôn chung đi hết phần + từ TOEIC (2.1) | "Ôn bài cũ" là ôn hết | không | vừa |
| 5 | 🙈 Bản đồ: ẩn tab kỳ thi không phải mục tiêu + khối kỹ thuật (2.2) | bản đồ 1 màn | không (đảo quyết định v121) | vừa |
| 6 | 🔗 Đọc thêm một mục (2.6), Cambridge làm từng phần một cửa (2.4) | bớt 2 cửa | không | vừa |
| — | ⚖️ Một luật "chữa xong" cho 4 bản đồ | ít | **có** | lớn; để sau bước 2 |

Việc 1–4 không chạm luật đo, không bỏ nội dung học, rủi ro thấp. Việc 5 đảo một quyết định cũ của người sáng lập.

## 5. Điều gì khiến việc gọt thất bại

- Gọt theo cảm giác rồi lại thêm theo cảm giác: không có người học thì vòng này lặp lại.
- Ẩn chức năng mà test (`tools/test/run.mjs`) đang kiểm: phải sửa test cùng lúc, không tắt test.
- Bỏ thứ người học thật cần mà ta không biết: vì thế chỉ 🙈 ẩn / 🔗 gộp, chưa ✂️ xoá mã (trừ kiểm tra 10 ngày).

## 6. Bước 2 (người sáng lập làm)

3–5 người học thật, 2 tuần, 15 phút / ngày. Ghi: màn mở nhiều nhất, nút không ai bấm, câu hỏi "cái này là gì". Tiêu chí: mỗi người nói được "màn này để làm gì" trong 5 giây; quay lại ≥ 5 / 7 ngày. Sau 2 tuần, mục nào 0 lần dùng ở mọi người → ✂️ bỏ thật.
