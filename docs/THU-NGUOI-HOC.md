# Thử app với người học thật (bước 2 của kế hoạch gọt app)

Soạn 5/11/2026 sau v136. Người làm: người sáng lập. Claude đọc số liệu và tổng hợp.

## 0. Việc phải làm trước (bắt buộc)

1. **Bật đăng nhập ẩn danh**: Supabase → Authentication → Sign In / Providers → bật "Allow anonymous sign-ins". Nếu không bật, mọi máy dùng chung một tài khoản. Tiến độ của 5 người sẽ lẫn vào nhau, và số liệu vô dụng.
   Máy đã từng mở app (dùng tài khoản chung) vẫn giữ tài khoản chung. Nếu người thử đã mở app trước đó: 💾 Dữ liệu → "👤 Tách máy này ra tài khoản riêng".
2. Kiểm: mở app trên một máy mới → 👤 Tôi → 💾 Dữ liệu phải ghi "👤 Tài khoản riêng của máy này". Nếu vẫn ghi "👥 Đang dùng tài khoản chung" thì chưa bật được.
3. Bạn tự chạy thử 1 ngày trên iPhone của mình bằng danh sách kiểm 5 phút (in ra khi chạy `node tools/release.mjs`).

## 1. Mục tiêu và tiêu chí

| Câu hỏi | Đo bằng | Đạt khi |
|---|---|---|
| Người mới có hiểu màn không? | Thử 5 giây (mục 3) | ≥ 4 / 5 người nói đúng "màn này để làm gì, bấm gì tiếp" ở 📅 Hôm nay, 📚 Học, màn một kỹ năng |
| Có quay lại không? | Số ngày học ≥ 5 phút (`S.act`, Claude đọc trên Supabase) | ≥ 3 / 5 người học ≥ 5 / 7 ngày ở tuần 2 |
| Chức năng nào thừa? | Mục nào 0 lần dùng ở mọi người sau 2 tuần | Danh sách để ✂️ bỏ thật (đã ẩn / gộp ở v136) |
| Chỗ nào khó? | Câu hỏi "cái này là gì", chỗ bấm sai | Ghi lại, mỗi chỗ ≥ 2 người gặp thì sửa |

**Mốc dừng / đổi hướng:** sau 2 tuần, nếu < 2 / 5 người quay lại ≥ 3 ngày ở tuần 2, thì vấn đề không nằm ở giao diện. Khi đó dừng gọt và hỏi người học: họ cần gì mà app chưa cho.

## 2. Chọn người (3–5 người)

- Đang học tiếng Anh thật, có mục tiêu riêng (ví dụ thi IELTS, đi làm, giúp con học). Không chọn người chỉ "thử cho vui".
- Có cả 3 nhóm, mỗi nhóm ít nhất 1 người: mới bắt đầu (A1–A2), trung bình (B1), luyện IELTS / TOEIC.
- Dùng iPhone hoặc điện thoại của họ. Không đưa máy của bạn.
- Không chọn người thân gần nhất. Họ dễ nói "hay" để bạn vui.
- Nói trước: 15 phút / ngày × 14 ngày, 2 lần nói chuyện 15 phút. Hỏi xin phép đọc số liệu học (chỉ số phút, bài, không có nội dung riêng).

## 3. Buổi đầu (30 phút, ngồi cạnh hoặc gọi video chia sẻ màn hình)

**Nguyên tắc:** bạn chỉ quan sát, không giải thích, không chỉ chỗ bấm. Họ hỏi thì đáp "Bạn nghĩ nên làm gì?". Ghi lại nguyên văn.

1. **Làm quen (3 phút):** "Bạn học tiếng Anh để làm gì? Đang học bằng cách nào? Mỗi ngày được bao nhiêu phút?"
2. **Tự mở app (10 phút):** đưa link, nói "Bạn cứ dùng như lần đầu tự tải về." Họ vừa làm vừa nói to điều mình nghĩ.
   - Ghi: họ chọn mục tiêu gì, có làm kiểm tra trình độ không, dừng hoặc lưỡng lự ở đâu.
3. **Thử 5 giây (5 phút):** mở từng màn sau, cho xem 5 giây, tắt đi rồi hỏi "Màn này để làm gì? Bạn sẽ bấm gì tiếp?"
   - 🧭 Lộ trình → 📅 Hôm nay
   - 📚 Học
   - Màn một kỹ năng (ví dụ 📚 Từ vựng)
   - 🗺 Bản đồ chỗ yếu
   - 👤 Tôi
4. **3 việc (10 phút):** giao từng việc, không gợi ý.
   - "Học bài tiếp theo bạn nên học hôm nay."
   - "Tìm nghĩa từ *improve*."
   - "Xem bạn còn cách mục tiêu bao xa."
   - Ghi: làm được không, bao nhiêu giây, bấm sai mấy lần.
5. **Kết (2 phút):** "Có gì khó hiểu hay khó chịu không? Có muốn dùng tiếp 2 tuần không?"

## 4. Hằng ngày (nhắn Zalo, 1 câu, tối ngày 1, 3, 5, 7, 10, 14)

"Hôm nay bạn có mở app không? Nếu có: làm gì, có chỗ nào khó? Nếu không: vì sao?"

Không nhắc học ngoài các ngày này. Nhắc nhiều sẽ làm sai số đo "có quay lại không".

## 5. Nói chuyện ngày 7 và ngày 14 (15 phút mỗi lần)

1. "Kể lại lần gần nhất bạn mở app: lúc nào, làm gì, dừng ở đâu?" (hỏi việc thật, không hỏi ý kiến chung)
2. "Có lúc nào bạn định mở app mà không mở không? Vì sao?"
3. "Có màn hay nút nào bạn chưa bấm bao giờ không? Bạn nghĩ nó để làm gì?"
4. "Nếu chỉ giữ 3 thứ trong app, bạn giữ gì?"
5. "Ngoài app, bạn còn học tiếng Anh bằng gì? App thay được cái nào?"
6. Ngày 14: "Bạn có học tiếp không? Nếu app tốn tiền thì bao nhiêu là hợp lý?" (đừng tranh luận, chỉ ghi lại)

Câu tránh hỏi: "Bạn thấy app hay không?", "Bạn có thích chức năng X không?". Người được hỏi gần như luôn trả lời "có".

## 6. Số liệu Claude đọc (ngày 7, ngày 14)

Claude chạy trên Supabase (chỉ đọc), tách theo từng tài khoản:
- số ngày có ≥ 5 phút, tổng phút (`S.act`)
- số từ / bài đã học (`S.cards`, `S.k`), số lượt bài tập, bài thi
- có dùng: 🗺 bản đồ (`S.focus`), 📌 sổ từ (`S.ie.vw`), 📒 sổ lỗi (`S.err`), tra cứu (`S.dh`), IELTS / TOEIC / Cambridge (`S.ie`, `S.to`, `S.cbx`), thư viện (`S.ext` src lib), mục tiêu, kiểm tra trình độ
- góp ý mới (bảng `gopy`)

Bạn chỉ cần nhắn Claude: "đọc số liệu thử người học ngày 7".

## 7. Bảng ghi (chép vào Ghi chú cho từng người)

```
Người: ___  Nhóm: mới / B1 / IELTS-TOEIC  Máy: ___
Buổi đầu
- Mục tiêu chọn: ___  Kiểm tra trình độ: có / không → ___
- Lưỡng lự ở: ___
- 5 giây: Hôm nay ___ | Học ___ | Kỹ năng ___ | Bản đồ ___ | Tôi ___   (đúng / sai)
- Việc 1 ___ giây ___ lần sai | Việc 2 ___ | Việc 3 ___
- Câu nói nguyên văn: "___"
Hằng ngày: N1 ___ N3 ___ N5 ___ N7 ___ N10 ___ N14 ___
Ngày 7 / 14: giữ 3 thứ: ___  chưa bấm bao giờ: ___  học tiếp: có / không
```

## 8. Sau 2 tuần

Gửi Claude các bảng ghi. Claude tổng hợp theo chủ đề (dùng kỹ năng `research-synthesis`):
- chỗ ≥ 2 người gặp → sửa
- mục 0 lần dùng ở mọi người → ✂️ bỏ thật
- đối chiếu với tiêu chí ở mục 1 để quyết: đi tiếp, sửa, hay đổi hướng
