# Khuôn đề thử TOEIC trọn (v175)

Một tệp để soạn đề mới nhanh và sát đề thật. Soạn đề: đọc tệp này + sổ lỗi (`content/toeic/so-loi.json`, tab 🛡️ Kiểm đề). Soát từng câu: `docs/TIEU-CHI-DE-TOEIC.md`.

Nguồn số đo: Phần Đọc đo trên 8 đề ETS (Đề 9–16, sách ETS TEST 01–08; bảng `de_rieng`, không có trong repo) và Đề 1–8 của app, 14/11/2026. Chỉ ghi số, mẫu câu và cách viết; KHÔNG chép câu ETS. Phần Nghe: không có đề ETS Nghe trong app, khuôn theo cơ cấu công khai của ETS + luật đã chạy ở Đề 3–8 (chưa đo so đề thật). Ngưỡng là ý kiến của Claude rút từ 8 đề.

Máy giữ khuôn:
- `node tools/do-khuon.mjs [deN]` đo 13 số Phần Đọc so khoảng ETS + chuỗi loại văn bản Part 7. Đề mới (không phải Đề 1–8) lệch khuôn thì `tools/build-toeic.mjs` dừng (luật `D-KHUON-ETS`). Đề 1–8 soạn trước khuôn: chỉ nhắc (gần hết số ngoài khuôn).
- Giải không có bài: `node tools/giai-mu.mjs xuat deN khongbai phieu.txt` → phiên Claude phụ đoán Part 7 chỉ từ câu hỏi + phương án → `so deN tra-loi.json` → `content/toeic/giai-mu/deN-kb.json`. Đo 14/11/2026: **đề ETS (Đề 10) cũng bị đoán đúng 67%** (người đoán có hiểu biết chung, câu hỏi tự gợi ý), Đề 3 70%, Đề 7 80%. Nên mốc là ETS, không phải 25%: đề mới ≤ `KB_MAX` 75% thì qua, test C80 chặn phát hành. Phép đo 54 câu sai số ~6 điểm: chỉ bắt đề lộ rõ (như Đề 7); soát tay "che bài" vẫn cần.

## Cơ cấu (giữ như đề thật, bộ dựng kiểm)

| Part | Số câu | Khuôn |
|---|---|---|
| 1 | 6 | 4 tranh có người + 2 tranh cảnh / đồ vật |
| 2 | 25 | Wh- 12 · Yes / No 5 · lựa chọn 2 · đề nghị / nhờ 3 · trần thuật 3 |
| 3 | 39 = 13 bài × 3 | 2 bài 3 người; 3 bài cuối có bảng; ≥ 2 câu hàm ý |
| 4 | 30 = 10 bài × 3 | 2 bài cuối có bảng; ≥ 2 câu hàm ý; ≥ 4 loại bài nói |
| 5 | 30 | xem "Part 5" dưới |
| 6 | 16 = 4 đoạn × 4 | mỗi đoạn 1 câu chèn |
| 7 | 54 | 10 bộ văn bản đơn 2 · 2 · 2 · 2 · 3 · 3 · 3 · 4 · 4 · 4 câu; 2 bộ 2 văn bản; 3 bộ 3 văn bản; mỗi bộ nhiều văn bản 5 câu, ≥ 1 câu đối chiếu |

## Part 5 (điền câu)

Số đo ETS: câu 14–15 từ; 12–14 / 30 câu là 4 từ khác gốc chọn theo nghĩa. Đề 1–8: câu 11–12 từ, 5–11 câu từ vựng (khuôn cũ chỉ gợi ý "từ vựng 5": đó là gốc lỗi).

Khuôn 30 câu (gợi ý, mỗi dạng ≥ 1 như máy kiểm đòi):

| Dạng | Số câu | Cách viết theo đề thật |
|---|---|---|
| Từ vựng (`voc`) | 11–13 | 4 từ cùng loại từ, thường cùng hình (cả 4 đều -ly, cả 4 đều -tion): không đoán bằng hình thức. Chọn bằng cụm cố định hoặc nghĩa cả câu. Nhóm hay gặp: trạng từ (promptly, abruptly, widely, diligently, unseasonably), cụm danh từ (top priority, on a regular basis, a maximum of, lack of), tính từ + danh từ (unforeseen circumstances, impartial advice), động từ + tân ngữ (complete training, familiarize oneself with, absorb noise), tính từ + giới từ (relieved to, composed of). Phương án sai là từ thật của công sở, có từ hiếm (enlist, revoke, obedient) |
| Dạng từ (`form`) | 6–7 | 4 dạng cùng gốc; đáp án nhìn vị trí (trước danh từ, sau mạo từ, sau động từ to be…) |
| Động từ (`verb`) | 3–4 | thì / thể / dạng của cùng động từ; dấu hiệu thời gian hoặc chủ ngữ số ít / nhiều |
| Giới từ / liên từ (`prep`, `conj`) | 4–5 | **trộn loại từ** trong 4 phương án (vd. một giới từ, một liên từ, hai trạng từ): phải nhìn sau chỗ trống là mệnh đề hay danh từ. Đề app cũ để cả 4 cùng loại nên dễ hơn |
| Đại từ / lượng từ (`pron`, `det`) | 2–3 | |
| Cấu trúc (`struct`) | 1 | so sánh, đảo ngữ hiếm trong đề thật (~1%); không quá 1 câu |

Câu dài 13–16 từ, thường có một mệnh đề phụ hoặc cụm giới từ (văn phong thông báo, e-mail công ty). Dễ dần: 10 câu đầu nhiều dạng từ / động từ, 10 câu cuối nhiều từ vựng.

## Part 6 (điền đoạn)

Số đo ETS: đoạn 87–106 từ; chỗ trống trạng từ nối (however, therefore…) 0–1 / 16 câu; loại văn bản đổi: e-mail, quảng cáo, thông báo, bài báo, mô tả sản phẩm, chỉ đường, blog, nhận xét, tài liệu giới thiệu.

- Đoạn 90–110 từ, 4 chỗ: 1 câu chèn + 3 chỗ từ vựng / dạng từ / thì theo mạch đoạn (đáp án cần đọc câu khác của đoạn: vd. "It opened last week" → "has launched").
- Trạng từ nối: tối đa 1 chỗ cả đề.
- Câu chèn: 3 câu sai cùng chủ đề, đúng ngữ pháp, sai vì mạch (nhắc điều chưa có, sai thời gian, ngược câu trước / sau).

## Part 7 (đọc hiểu)

### Độ dài

| | ETS | Đề 1–8 | Khuôn |
|---|---|---|---|
| Văn bản đơn (từ / bộ) | 137–169 | 79–95 | 130–170 (bộ 2 câu ngắn hơn, bộ 4 câu dài hơn) |
| Bộ nhiều văn bản (từ / bộ) | 330–400 | 121–181 | 300–400 |
| Tổng Part 7 | 3.080–3.590 | 1.490–1.790 | ≥ 2.800 |

Đề app cũ chỉ dài bằng nửa: người học làm kịp 75 phút ở app nhưng hết giờ ở đề thật.

### Mẫu câu hỏi (54 câu một đề)

| Mẫu | ETS (8 đề, / 432) | Đề 1–8 (/ 432) | Khuôn một đề |
|---|---|---|---|
| What is indicated / mentioned / stated / true about … | 70 | 39 | 8–10 |
| What is suggested about … · What can be concluded about … | 38 | 15 | 4–6 |
| … most likely … (Who most likely is…, What will X most likely do…) | 62 | 49 | 7–9 |
| What is the purpose of … · What is one purpose of … · Why was … written | 31 | 35 | 4 |
| According to the [article / e-mail / Web page], … | 39 | 5 | 4–5 |
| NOT (What is NOT mentioned / indicated / offered …) | 15 | 12 | 2 |
| Chèn câu [1]–[4] | 16 | 16 | 2 |
| Từ gần nghĩa (closest in meaning) | 18 | 27 | 2–3 |
| Ý định trong tin nhắn (At 9:05 A.M., what does X mean / imply when…) | 17 | 20 | 2 |
| Hỏi thẳng số / giờ / ngày / nơi (How much, When, Where…) | 19 | 36 | ≤ 3 |

ETS hỏi kiểu "cái gì là đúng / suy ra được" nhiều gấp đôi: thí sinh phải đọc cả bài, kiểm từng phương án. Đề app cũ hỏi thẳng chi tiết nhiều gấp đôi.

### Cách viết đáp án và phương án sai (quan trọng nhất)

Số đo ETS: đáp án là phương án dài nhất ở ~19% câu (đề app ~37%); đáp án và phương án sai dài bằng nhau ~5–6 từ (đề app: đáp án dài hơn); chữ của bài có trong đáp án / phương án sai gần bằng nhau (0,45 / 0,42; đề app 0,49 / 0,34).

Đáp án:
1. **Diễn đạt lại, khái quát hơn bài.** Bài liệt kê "laptop stands, chairs, standing desks" → đáp án "A maker of computer furniture". Bài "visit our Testimonials page … independent assessments" → "Read product reviews". Bài "brochure of our new products with a price list" → "A list of new items for purchase".
2. Đáp án suy luận phải cần ghép 2 chỗ của bài (vd. khu nhà ở và khu thương mại "connected by a park with paved pathways" → "within walking distance of the new homes").
3. Câu hỏi mục đích: đáp án dạng "To + động từ + danh từ trừu tượng" ("To explain the cause of a delay"), 3 phương án sai cùng dạng "To …".

Phương án sai (viết theo 3 kiểu, trộn trong mỗi bộ):
- **Có trong bài, sai chỗ:** dùng lại chữ của bài nhưng sai thời gian / người / mục đích (bài có nói thay mái nhà ga, nhưng việc xảy ra tháng 3 là gửi đề xuất tranh tường → "A railway station's roof will be replaced" là bẫy).
- **Có từ của bài, sai ý:** bài nói "expedited delivery … for an extra fee" → bẫy "To learn about faster delivery options" cho câu "vì sao gửi e-mail".
- **Hợp lý ngoài đời, bài không nói:** "It recently hired more workers", "It is looking for new investors".

Luật hình thức:
- 4 phương án song song ngữ pháp (cùng bắt đầu "To …", "It …", "By …", cùng là cụm danh từ).
- Dài ngang nhau (lệch ≤ 2 từ); đáp án không phải lúc nào cũng dài / cụ thể nhất.
- Từ gần nghĩa: 3 phương án sai là các nghĩa khác của cùng từ đó (driven → caused · sai: urged, chased, transported).
- NOT: 3 phương án có trong bài, rải ở các đoạn khác nhau; phương án đúng hợp lý nhưng bài không nói.
- Câu hỏi theo thứ tự bài.

**Chống đoán bằng lẽ thường (bài học khi thử khuôn, v175).** Mẫu đầu tiên soạn theo khuôn (17 câu Part 7) bị đoán đúng 15 / 17 khi KHÔNG có bài, tệ hơn đề cũ (Đề 3 70%) và ETS (67%). Lý do: đáp án "diễn đạt lại, khái quát" thành câu hợp lẽ thường nhất của loại văn bản đó (bảng giá → "giảm giá khi đặt nhiều"; thiệp mời → "kỷ niệm một mốc của công ty"; cỡ dùng thử → "để so sánh nhiều loại"), còn phương án sai mang từ tuyệt đối ("every order", "only", "at no extra charge") nên tự loại. Luật:
- Với mỗi câu, viết ra "lẽ thường": người chưa đọc bài sẽ đoán gì từ câu hỏi + loại văn bản. Rồi **hoặc** đáp án là chi tiết riêng của bài, trái hoặc khác lẽ thường (bảng giá này lại tính phí giao hàng theo khoảng cách, không giảm theo số lượng), **hoặc** ít nhất một phương án sai chính là lẽ thường đó (có vẻ đúng, nhưng bài này không nói / nói ngược).
- Ít nhất 2 trong 3 phương án sai phải là điều thường gặp ở loại văn bản đó (thứ thí sinh tin là có).
- Không dùng từ tuyệt đối (every, all, only, never, always, no extra charge) chỉ ở phương án sai; nếu dùng thì cả đáp án cũng có lúc dùng.
- Trong một bộ, đáp án không phải phương án dài nhất ở quá 1 câu.

Cách soát nhanh trước khi dựng: che bài, chỉ đọc câu hỏi + 4 phương án. Đoán ra đáp án thì viết lại phương án sai (máy làm đúng việc này ở bước giải không có bài).

### Loại văn bản

ETS đổi loại và thứ tự mỗi đề; tin nhắn / trò chuyện trực tuyến không cố định ở bộ đầu (thường 1 chuỗi tin nhắn + 1 trò chuyện nhiều người ở bộ 10). Loại ETS hay dùng, đề app cũ chưa có hoặc ít: coupon, phiếu giảm giá, chính sách, hợp đồng, biên bản họp, thiệp mời, tờ rơi, blog, mô tả công việc, thông cáo báo chí, biên lai, biểu đồ, biển báo, bảng giá, lịch, nhận xét trực tuyến. Bộ nhiều văn bản ghép loại khác nhau (bài báo + thư + hoá đơn; e-mail + lịch + nhận xét; quảng cáo + bảng giá + nhận xét).

Trước khi soạn: viết ra chuỗi loại văn bản của 15 bộ; không trùng chuỗi đề trước (máy so).

## Phần Nghe (Part 1–4)

Chưa có số đo đề thật. Giữ cơ cấu ở bảng trên và các luật máy đang chạy (`docs/TIEU-CHI-DE-TOEIC.md`: bẫy Part 2, câu hỏi theo thứ tự, đáp án không chép nguyên văn lời nghe, bảng phải cần mới trả lời được, giới tính người nói). Bài học áp được từ Phần Đọc: đáp án Part 3–4 diễn đạt lại, phương án sai dùng từ có trong lời nghe nhưng sai ý.

## Đã thử khuôn (v175, 14/11/2026)

Thợ Sonnet soạn 10 câu Part 5 + 4 bộ Part 7 (17 câu) chỉ theo tệp này; Opus đo; phiên Claude phụ giải không có bài. Mẫu lưu ở `content/toeic/khuon/mau-v175.json` (dùng làm mẫu cho thợ lần sau).

| | Vòng 1 (khuôn chưa có luật lẽ thường) | Vòng 2 (thêm luật lẽ thường) | ETS |
|---|---|---|---|
| Văn bản đơn / bộ nhiều văn bản (từ) | 147 / 287 | 156 / 342 | 137–169 / 330–400 |
| Đáp án là phương án dài nhất | 8 / 17 | 5 / 17 | ~3 / 17 |
| Giải không có bài đoán đúng | **15 / 17 (88%)** | **7 / 17 (41%)** | 67% |
| Part 5: câu / từ, câu từ vựng | 15 từ, 6 / 10 | (giữ) | 14–15 từ, ~4 / 10 |

Còn lệch: câu "suggested / most likely" mới 2 / 17 (ETS ~4 / 17); đáp án dài nhất vẫn hơi cao. 17 câu là mẫu nhỏ, sai số lớn: cần đo lại khi có đề trọn đầu tiên.

## Quy trình soạn một đề mới (nhanh)

| Bước | Việc | Ai làm |
|---|---|---|
| 1 | Lập dàn đề: 15 chuỗi loại văn bản Part 7, tình huống từng bài Part 3–4 / 6 / 7 (không lặp trong đề và với đề trước), dạng 30 câu Part 5 theo bảng trên | Phiên chính (Opus) |
| 2 | Soạn theo khuôn + sổ lỗi + mẫu `content/toeic/khuon/mau-v175.json`, từng Part một tệp nguồn `content/toeic/tron/deNN.json`. Soạn 3 bộ Part 7 đầu, giải không có bài ngay (≤ 75%) rồi mới soạn tiếp: lỗi lẽ thường lộ sớm | Thợ soạn theo khuôn (Sonnet) |
| 3 | `node tools/build-toeic.mjs` (cơ cấu + luật máy + khuôn ETS) → sửa tới 0 lỗi | Thợ máy chạy, thợ soạn sửa |
| 4 | Giải không có bài (Part 7) ≤ `KB_MAX` → giải mù cả đề 200 / 200 | Thợ giải mù (Sonnet) |
| 5 | Soát ≥ 10% câu theo `docs/TIEU-CHI-DE-TOEIC.md`, thêm lỗi mới vào sổ | Thợ soát (Opus) |
| 6 | Giọng, test, phát hành | Thợ máy / phiên chính |
