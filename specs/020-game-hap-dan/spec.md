# Đặc tả: 🎉 Chinh phục đề hấp dẫn hơn

**Thư mục**: `specs/020-game-hap-dan` · **Ngày**: 14/11/2026 · **Trạng thái**: Đã làm (v177)

**Yêu cầu của người sáng lập**: "Bao nhiêu tiêu chí để đánh giá 1 game hấp dẫn, dựa vào bộ tiêu chí ấy làm game cho hấp dẫn hơn đi", rồi "Tự tính làm" (Claude chọn hướng A).

## Bộ 10 tiêu chí hấp dẫn

Gộp từ GameFlow (Sweetser & Wyeth 2005: 8 yếu tố, 38 tiêu chí) và PENS (Ryan, Rigby & Przybylski 2006: 3 nhu cầu). Điểm là Claude tự chấm từ mã + ảnh chụp (thang 1–5), chưa có người chơi thật chấm.

| # | Tiêu chí | v176 | v177 (dự kiến) | Đo bằng |
|---|---|---|---|---|
| 1 | Mục tiêu rõ | 4 | 5 | nhiệm vụ ngày cho từng buổi |
| 2 | Phản hồi tức thì | 4 | 4 | — |
| 3 | Thử thách vừa sức | 3 | 3 | (hướng B, chưa làm) |
| 4 | Thấy mình giỏi lên | 2 | 3–4 | làng lớn dần, huy hiệu dạng câu; câu hỏi 1 |
| 5 | Được tự chọn | 2 | 2 | (hướng B, chưa làm); câu hỏi 2 |
| 6 | Nhịp, tập trung | 3 | 3 | — |
| 7 | Đắm chìm, thế giới | 2 | 3–4 | làng 10 công trình, đồ trang trí |
| 8 | Thưởng bất ngờ | 1 | 3 | rương độ hiếm thường / hiếm / quý |
| 9 | Kết nối người khác | 1 | 1 | (hướng C, chưa làm) |
| 10 | Lý do quay lại mỗi ngày | 2 | 3–4 | nhiệm vụ + rương mỗi ngày; câu hỏi 3 |

## Làm (hướng A)

1. 🏘 Làng trên đảo: 7 công trình theo ⭐ thật (10 · 25 · 40 · 55 · 70 · 85 · 100) + 3 theo 🌳 (20 · 50 · 80); suy từ tiến độ, không lưu thêm.
2. 📜 3 nhiệm vụ mỗi ngày, chốt lúc mở game đầu ngày, chỉ chọn việc đang có thể làm (hạ quái, xác nhận 🌿, hạ Boss, cứu cây, Boss ẩn, vun cây); đếm bằng sự kiện học.
3. 🎁 Xong 3 việc → mở rương 1 lần / ngày: đồ trang trí đảo, thường 70% · hiếm 25% · quý 5%, ưu tiên đồ chưa có.
4. 🏅 Huy hiệu "Bậc thầy {dạng}" khi 🐉 Boss ẩn của dạng đúng ≥ 2 lần và lần cuối đúng; bộ sưu tập gập.
5. 💬 3 câu hỏi nhanh (rút từ PENS: giỏi lên · tự chọn · muốn chơi tiếp, 1–5) sau 5 trận, một lần; gửi về như góp ý (`ctx.view = 'tgks'`); tiêu chí E3 của bộ tiêu chí game đọc số này.

## Luật

- Chỉ thưởng việc học; không thưởng chơi nhanh; không phạt khi bỏ ngày (tránh áp lực chuỗi ngày).
- Không đổi luật đo, không ghi điểm đề thử / thẻ học.

## Chưa làm

- Hướng B (chọn vũ khí / khiên bằng sao), hướng C (đấu bóng ma, mã lớp).
- Mốc đo: 3 câu hỏi của ≥ 2 người chơi thật; trung bình < 4 thì hỏi cụ thể chỗ nào trước khi làm B / C.
