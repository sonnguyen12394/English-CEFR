# Kịch bản chơi: Khu phố Đề · 🎭 Kẻ giả mạo (bản 4, 17/11/2026)

Người sáng lập: "Goose Goose Duck… cơ chế chơi khá giống", "làm gameplay lại theo hướng đó". Chỉ mượn cơ chế chung của thể loại tìm kẻ giả mạo (đi bản đồ, danh sách nhiệm vụ, họp bỏ phiếu); KHÔNG dùng tên, hình, bản đồ, tiếng của trò đó. Chơi một người. Chấm theo `docs/TIEU-CHI-GAMEPLAY.md`. Bản 3 (khu phố không có kẻ giả mạo) nằm trong lịch sử git. Chưa có người chơi thật; chưa kiểm trên iPhone.

## 1. Ý chính
Mỗi đề là một khu phố. Mỗi **ngày ở phố** (một buổi 10–15 phút) có MỘT 🎭 **kẻ giả mạo** đội lốt một cư dân. Hắn gây sự cố bằng cách nói **luật nghe rất hợp lý nhưng sai**, đúng kiểu phương án nhiễu của đề TOEIC. Mầm làm nhiệm vụ, nhặt manh mối, cuối ngày **họp phố** chỉ mặt kẻ giả mạo và nói luật đúng.

Vì sao hợp học thi: muốn bắt được kẻ giả mạo phải biết luật thật. Bắt được = hiểu vì sao phương án nhiễu sai.

## 2. Một ngày ở phố
1. **☀️ Sáng – Bảng tin:** "Hôm nay 3 việc · 1 kẻ giả mạo trong phố · ~12 phút". Số việc theo phút mục tiêu ở 🧭 Lộ trình (~4 phút / việc: 10 phút → 2–3 · 15 → 3–4 · 30 → 7).
2. **🔍 Làm việc (nhặt manh mối):** ▶ Nhiệm vụ kế tiếp hoặc chạm cư dân. Mỗi câu điều tra có lời khai của cư dân; lời khai sai được ghi vào 📒 Sổ manh mối kèm tên người nói.
3. **🚨 Phá hoại (1 lần / ngày, từ ngày 2):** kẻ giả mạo gây sự cố khẩn: một câu có giờ theo nhịp đề thật (Part 5 ~22 giây, Part 6 ~34, Part 7 ~61). Sửa kịp → cứu ô phố + 1 manh mối chắc.
4. **🔔 Họp phố:** mở khi có ≥ 2 manh mối (gọi họp lúc nào cũng được, không cần làm hết việc). Chọn kẻ giả mạo trong các nghi phạm, rồi chọn luật đúng thay cho luật hắn nói. ≤ 1 phút.
5. **🌙 Tối – Kết quả:** bắt đúng → kẻ giả mạo lộ mặt, sương tan thêm, bẫy của hắn vào 🗂 **Hồ sơ bẫy**. Bắt sai → hắn trốn (không mất gì), lời giải hiện ra, mai hắn quay lại. "Xong hôm nay" = điểm dừng; chơi thêm vẫn được.

## 3. Nhiệm vụ

| Dấu | Nhiệm vụ | Khi nào | Làm gì |
|---|---|---|---|
| 🔭 | **Trinh sát** | Còn ô sương; người mới bắt đầu ở đây | Thi lượt 10 câu của đề (trận Boss nhỏ). Câu sai → ⚠️ |
| 🕵️ | **Điều tra** | Câu đề đang sai (⚠️) | Câu đề + 2–3 lời khai của cư dân (mỗi lời khai ≤ 12 từ). Chọn đáp án, rồi chạm "🔍 lời khai sai". Phương án xáo |
| 🎓 | **Học nghề** | Phố của câu chưa mở bậc 3 | Ván phố bậc 1–2 (Loại Từ: 🪑 luật ghế) |
| 🔁 | **Kẻ tái phạm** | Bẫy trong Hồ sơ tới hạn ôn 1 → 3 → 7 → 21 ngày | Kẻ giả mạo cũ quay lại với CÙNG bẫy trên câu MỚI (câu kho của phố). Lật được → bẫy giãn lịch |
| 🏅 | **Chứng chỉ nghề** | Câu đã đúng mà luật chưa vững | 3 câu kho mới liền đúng, không gợi ý (luật 🧠 v187) → 🌳 |

**Ngày không có câu sai để điều tra** (người mới vừa trinh sát đúng hết, hoặc đề đã hết ⚠️): kẻ giả mạo trà trộn vào câu kho của phố bạn luyện ít nhất, hoặc là một kẻ tái phạm; họp vẫn diễn ra. Ngày đầu: 🔭 trinh sát trước, kẻ giả mạo xuất hiện ở các câu vừa sai.

Không có ván phố chữ rơi bị bỏ: Học nghề, Kẻ tái phạm, Chứng chỉ vẫn là ván phố như hiện nay.

## 4. Lời khai: máy sinh từ dữ liệu có sẵn
Mỗi câu đề đã có 4 phương án + lời giải (`lg.og` loại: nghĩa, `ly` vì sao); phố có luật có bảng luật (luật ghế, kiểu quan hệ, luật chia thì…).
- **Lời khai thật** (cư dân thật): luật của đáp án. Vd. Bác Danh từ: "Sau *your* là ghế của tôi."
- **Lời khai giả** (kẻ giả mạo): luật của một phương án nhiễu, nói như thật. Vd. "Sau *your* cần động từ, chọn *apply*." · "Sau *despite* là cả một câu." · "*meet* và *reach* đều đi với *deadline*."
- Khuôn theo phố: Loại Từ (ghế), Cầu Nối (phía sau ô trống), Động Từ (mốc thời gian), Đại Từ (vị trí / số), Cấu Trúc (cặp từ), Chợ (cụm đi kèm / nghĩa), Bến Dò Tin ("đáp án ở dòng N" chỉ sai dòng), Ghép Đoạn ("*this* chỉ về câu N" chỉ sai câu).
- Cần soạn: ~3 khuôn lời khai giả × 8 phố (Claude soạn, soát); máy điền từ dữ liệu đề.

## 5. Suy luận
- Nghi phạm trong họp: bậc đầu 3 người, sau 4, rồi 5 (cư dân đã gặp trong ngày).
- Kẻ giả mạo nói sai ≥ 2 lần / ngày; có lúc nói thật để trà trộn.
- Cư dân thật không bao giờ nói sai, nên lời khai sai = dấu vết chắc chắn; khó ở chỗ phải biết luật mới nhận ra lời khai nào sai.
- Họp: chọn người + chọn luật đúng. Đúng người mà sai luật = "bắt được nhưng chưa rõ vì sao": hắn lộ mặt, bẫy vẫn vào lịch ôn sớm (ngày mai).

## 6. Đúng, sai, vừa sức
- **Đúng:** ≤ 1 giây "✓ Đúng" + ô sáng + tiếng; lời khai giả bị gạch, ghi vào sổ.
- **Sai câu:** "✗ Chưa đúng" + chữ mốc + vì sao + dịch; lời khai đã dẫn sai được tô "🎭 bẫy". Không mất gì.
- **Thua họp 2 ngày liền:** ngày sau bớt 1 nghi phạm và kẻ giả mạo nói sai 3 lần.
- **Nghỉ ≥ 3 ngày:** hôm đó 2 việc + họp, kẻ giả mạo là kẻ tái phạm đã quen.
- Ván phố giữ 4 bậc như hiện nay; thua 2 ván liền thì gợi ý ôn bậc dưới / học lại luật.

## 7. Cư dân, tiến bộ, phần thưởng
- Cư dân 8 phố như hiện nay (Bác Danh từ… Anh Cặp Đôi). Đề nghị đổi tên "Chú Giới" (Chợ) vì lẫn "Chú Gạch Giới" (Cầu Nối).
- Kẻ giả mạo đội lốt cư dân của phố có câu sai trong ngày; lộ mặt là hình 🎭 (vẽ riêng, không dùng hình con vịt).
- **Mức thân 0 → 3:** phố có luật: +1 mỗi luật vững; Chợ / Bến / Ghép: +1 mỗi 3 câu "chắc". Cư dân bị nghi oan chỉ nói "Không phải tôi!", không trừ thân.
- **Tiến bộ nhìn thấy:** sương tan theo câu ⭐ đúng · 🌳 theo câu hiểu · 🗂 Hồ sơ bẫy "đã lật N bẫy" (đây là danh sách phương án nhiễu bạn đã hiểu, mở ra đọc được).
- Không tiền ảo, không cửa hàng.
- 🏰 Lâu đài (⚔️ Chinh phục đề) luôn vào được.

## 8. Ngày mẫu (Đề 3, 15 phút)
1. Bảng tin: "Sương còn 18 · 3 việc · 🎭 1 kẻ giả mạo".
2. 🕵️ Câu 113 ("Please submit your ___"). Bác Danh từ: "Sau *your* là ghế của tôi." Cô Tính từ: "Sau *your* phải mô tả, chọn *applicable*." → chọn *application*, chạm 🔍 lời Cô Tính từ. Manh mối 1.
3. 🚨 Phá hoại: câu 131 có giờ 34 giây. Bác Chia thì: "*By the time* … đã qua, lùi kim." Cô Tính từ: "Việc đang diễn ra, chọn *is starting*." → sửa kịp. Manh mối 2.
4. 🔁 Kẻ tái phạm hôm qua: "Sau *despite* là cả một câu" trên câu mới → lật bẫy, lịch giãn sang 3 ngày.
5. 🔔 Họp: nghi phạm Bác Danh từ · Cô Tính từ · Bác Chia thì → chỉ Cô Tính từ → chọn luật đúng "Sau tính từ sở hữu là danh từ". Cô Tính từ thật bước ra: "Tôi bị đội lốt!" 🎭 lộ mặt, sương còn 15.
6. "Xong hôm nay · Mai một kẻ khác sẽ tới."

## 9. Dùng trên điện thoại
Vùng bấm ≥ 44 px · 🚨 phá hoại có giờ: giảm chuyển động hoặc bật "Không tính giờ" thì giờ × 1,5 / bỏ giờ (vẫn được manh mối) · lời khai là thẻ bấm được, mỗi thẻ ≤ 12 từ, chữ ≥ 15 px · giảm chuyển động: không hoạt cảnh lộ mặt · tiếng / nhạc tắt riêng · đúng / sai và "bẫy" luôn có chữ + ký hiệu · chơi dọc một tay.

## 10. Rủi ro
1. **Chữ nhiều:** mỗi câu thêm 2–3 lời khai. Giữ ≤ 12 từ / lời khai, bậc đầu 2 lời khai.
2. **Lời khai giả quá lộ hoặc sai thật sự lại bị coi đúng:** máy chỉ sinh từ phương án nhiễu + bảng luật; Claude soát 100% khuôn; thợ soát ≥ 10% câu sinh ra.
3. **Lời khai dẫn người chưa biết vào bẫy, làm họ nhớ sai:** sau mỗi câu luôn hiện luật đúng + gạch lời khai giả; Hồ sơ bẫy ôn lại.
4. **Không có người chơi thật:** đo trước khi làm đủ 16 khu.

## 11. Đo khi có người chơi
Chạm từ bản đồ tới câu (≤ 2) · tỉ lệ bắt đúng kẻ giả mạo · tỉ lệ câu đúng trên câu có lời khai giả so với không có · phút / ngày · ngày quay lại / tuần · bảng hỏi PENS sau 1 tuần. Mốc dừng: 2 tuần, < 2 người chơi ≥ 5 ngày thì dừng.
