# Đặc tả 020: 🏙 Thành phố TOEIC (các phố kỹ năng + Chinh phục đề là trận cuối)

Ngày: 15/11/2026 · Trạng thái: nháp, chờ người sáng lập trả lời câu hỏi làm rõ.

## Người sáng lập nói
"Phố loại từ khá ưng rồi, cứ phát huy thêm với mấy dạng khác. Còn chinh phục đề nói đúng ra là trò cuối chơi để có thể làm được đủ 100 câu mới phải."

## Vấn đề gốc
- Phố Loại Từ (019) chỉ dạy dạng chọn dạng từ: khoảng 7 / 100 câu Phần Đọc mỗi đề.
- ⚔️ Chinh phục đề đang là chỗ học mọi dạng còn lại, nhưng học bằng đọc lời giải (nặng chữ), không phải chơi.
- Muốn: mỗi nhóm kiến thức một "phố" chơi kiểu Phố Loại Từ (nhân vật, 4 bậc học từng việc, nhạc, gợi ý); Chinh phục đề thành trận cuối: dùng đủ kiến thức các phố để đúng hết 100 câu đề đã chọn.

## Số câu mỗi đề (đếm 8 đề app, phần Đọc 100 câu)
| Phố | Dạng câu trong đề | Câu / đề |
|---|---|---|
| 🏘 Loại Từ (đã có) | P5 dạng từ (+ một phần P6 chọn từ) | ~7 |
| 🌉 Cầu Nối | P5 giới từ 3–4 + liên từ 3, P6 từ nối ~2–3 | ~9 |
| ⏰ Động Từ | P5 thì / dạng động từ 4–5, P6 thì ~2–3 | ~7 |
| 👥 Đại Từ & Lượng Từ | P5 đại từ 2–3, lượng từ 2–3, cấu trúc 2–3 | ~7 |
| 🛒 Chợ Từ Vựng | P5 từ vựng 5–7, P6 chọn từ ~5, P7 từ gần nghĩa ~3 | ~14 |
| 🧩 Ghép Đoạn | P6 chèn câu 4, P7 chèn câu [1]–[4] 2 | ~6 |
| 🔎 Bến Dò Tin | P7 chi tiết 26, suy luận 7, mục đích 6–7, đúng / NOT 6–7, ý định 2 | ~48 |
| 🏰 Chinh phục đề | trận cuối, cả 100 câu | 100 |

## Yêu cầu (FR)
- FR-001 Màn 🏙 Thành phố: bản đồ các phố, mỗi phố ghi bậc đã mở và "đề đang chọn có N câu cần phố này".
- FR-002 Mỗi phố cùng khuôn Phố Loại Từ: cư dân có tính cách + "đồng phục" (dấu hiệu nhận ra), 4 bậc học từng việc (nhận dấu hiệu → đoán ghế / quan hệ → ghép → đủ phương án như đề), gợi ý 2 nấc, tim, combo, hoạt cảnh đúng / sai, nhạc nền + tiếng riêng, tra từ khi chạm.
- FR-003 Kho câu riêng mỗi phố (~100–120 câu, khuôn + máy kiểm như build-pho) + tối đa 3 câu thật người học đã sai trong đề.
- FR-004 Chinh phục đề là trận cuối: trước trận ghi đề cần những phố nào và phố nào còn yếu; câu sai trong trận có nút "Chữa ở {phố}" (như phFix của 019).
- FR-005 Không đổi luật đo (📘 Học / 🔁 Nhớ / Thi chuyển cấp); không ghi điểm đề thử / bản đồ / thẻ học. Câu thật đúng ở bậc 3–4 ghi hành trình Chinh phục đề như 019.
- FR-006 Mỗi bản phát hành một phố (sau bản khung), test riêng, chụp Chromium khổ iPhone SE sáng + tối, ghi "chưa kiểm trên iPhone".

## Cách chơi dự kiến từng phố (ý kiến của Claude, chỉnh khi làm mẫu)
- 🌉 Cầu Nối: cư dân Giới Từ (sau là danh từ / V-ing) và Liên Từ (sau là cả mệnh đề) + 6 nhóm nghĩa (thêm ý, đối lập, nguyên nhân, kết quả, thời gian, điều kiện). Bậc 1 nhìn phần sau ô trống: cụm danh từ hay mệnh đề → bậc 2 hai vế quan hệ gì → bậc 3 ghép → bậc 4 đủ 4 phương án (because / because of / although / despite…).
- ⏰ Động Từ: cư dân là các thì; "đồng phục" là từ tín hiệu (yesterday, since, by next…), thêm chủ động / bị động, to V / V-ing.
- 👥 Đại Từ & Lượng Từ: he / him / his / himself ngồi ghế theo vị trí; lượng từ đi với danh từ đếm được / không đếm được / số nhiều.
- 🛒 Chợ Từ Vựng: không chơi theo luật mà theo cụm: ghép từ với bạn đi kèm (collocation), lịch ôn ngắt quãng.
- 🧩 Ghép Đoạn: kéo câu chèn vào chỗ khớp đại từ / từ nối hai bên.
- 🔎 Bến Dò Tin: săn câu chứa đáp án trong văn bản, ghép câu diễn đạt lại.

## Điều có thể làm thất bại
- 7 phố × 100+ câu = ~700 câu mới: soạn nhiều, dễ sai đáp án → máy kiểm + soát Opus mỗi đợt.
- Từ vựng và Part 7 khó làm thành trò "luật" như loại từ → mẫu chơi riêng, có thể kém vui hơn.
- Mới có 1 người chơi (người sáng lập), chưa kiểm trên iPhone: làm nhiều phố trước khi thử máy thật thì sai hướng tốn công.

## Câu hỏi làm rõ (chờ người sáng lập)
Xem phần trả lời ở cuối khi có.

## Trả lời làm rõ (15/11/2026)
- Q1 Thứ tự: ngữ pháp trước: Cầu Nối → Động Từ → Đại Từ & Lượng Từ → Chợ Từ Vựng → Ghép Đoạn → Bến Dò Tin.
- Q2 Chinh phục đề: KHÔNG khoá, chỉ dẫn (đề cần phố nào, phố nào còn yếu; câu sai có nút chữa ở phố).
- Q3 Đợt đầu: khung Thành phố + Chinh phục đề thành trận cuối + Phố Cầu Nối; người sáng lập thử iPhone rồi mới làm phố tiếp, mỗi bản một phố.

## Bổ sung v182 (15/11/2026): phố theo đề đã chọn
Người sáng lập: "tất cả những trò chơi này nhằm phục vụ cho 1 đề đã chọn cụ thể trong 16 đề. Tức là độ rộng kiến thức tuỳ vào đề đã chọn." Chọn: chỉ câu đề + kho chung (không soạn câu anh em); sửa 2 phố đã có trước.
- FR-007 Thành phố có hàng chọn đề (chung với Chinh phục đề); thẻ phố ghi số câu của đề, số câu chắc, số câu đang sai; phố đề không cần thì ghi rõ.
- FR-008 Ván của phố = các câu của đề đã chọn thuộc phố: mỗi câu đề đi sau ≤ 2 câu kho cùng kiến thức; câu đang sai → chưa chắc → đến hạn ôn.
- FR-009 "Chắc" = đúng lần gần nhất ở bậc 3–4, không dùng gợi ý; hiện ở màn phố và Thành phố.
