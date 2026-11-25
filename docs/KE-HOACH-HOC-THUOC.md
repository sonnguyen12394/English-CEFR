# Kế hoạch làm tiếp: 📖 Học thuộc (TOEIC + giao tiếp hằng ngày)

Viết ngày 22/11/2026, cập nhật 23/11/2026 (thêm 2 mục tiêu, mục 2). Để chuyển sang tài khoản / phiên khác làm tiếp. Đọc hết tệp này trước khi làm.

## 1. Hiện trạng (bản 208, v212, 23/11/2026)

- App: 🎯 Luyện đề → TOEIC → 📚 → dòng **📖 Học thuộc bài đề** → trang con `hoc-thuoc/` (khung iframe, tiến độ ở `S.ht`). Xem đoạn v209 trong `CLAUDE.md`.
- 100 bài đã lên web (`hoc-thuoc/bai/`; nguồn `content/hocthuoc/baiN.js` + `baiN.in.json`). Mọi bài có mã chủ đề TOEIC (G0 xong: `tools/hocthuoc/chu.json`, trường `chu` / `muc` trong `.in.json` và meta). Bài đã soạn nhưng soát KHÔNG ĐẠT nằm ở `tools/hocthuoc/hoan.json` (bộ dựng bỏ qua):

| Đề | Đã có | Ghi chú |
|---|---|---|
| Đề 1 | 45 bài: Part 3 13 · Part 4 10 · Part 6 4 · Part 7 14 · Part 2 3 bộ | Đủ (bài 25–66 + bài 6, 9) |
| Đề 2 | 40: Part 3 13 · Part 4 10 · Part 6 4 · Part 7 10 · Part 2 3 bộ | Bài 67–105 (v210). Bài 99–103 viết lại tay, soát Opus đạt, lên web ở v223: **Đề 2 đủ 45 / 45** |
| Đề 3 | 5: Part 3 #1, #4 · Part 4 #1, #7 · Part 7 #3 | Bài 1 (Part 3 #1) nằm trong `base.html` |
| Đề 4 | 3: Part 4 #3 · Part 6 #3 · Part 7 #1 | |
| Đề 5 | 4: Part 3 #4 · Part 4 #2, #4 · Part 6 #4 | Bài 2 (Part 4 #4) nằm trong `base.html` |
| Đề 6 | 0 | |
| Đề 7 | 3: Part 3 #4 · Part 6 #2, #4 | |
| Đề 8 | 0 | |

- 💬 Giao tiếp: v214 thêm 🙋 Bản thân & gia đình 1011–1020 + 🎮 Sở thích & cuối tuần 1021–1030 (người sáng lập cho soạn tiếp trước G3); v215 thêm ❤️ Cảm xúc 1031–1040 + 📖 Kể chuyện 1041–1050; còn gt-hn, gt-hd, gt-kh. Chủ đề 🤝 Bạn bè đủ 10 bài 1001–1010 (v211 mẫu 1001–1003; v212 thêm 1004–1010: hội thoại 3, hỏi – đáp 1 bộ, bài nói 2, đọc hiểu 1). Bước kế: người sáng lập thử trên iPhone (G3) + 1–2 người học thật dùng 2 tuần (G4 ②) rồi mới soạn 7 chủ đề còn lại. Lối vào: trong trang 📖 Học thuộc, ô Đổi bài → 🎯 TOEIC · 💬 Giao tiếp → chủ đề → dạng.
- Một đề đủ = 45 bài: Part 3 13 · Part 4 10 · Part 6 4 · Part 7 15 · Part 2 3 bộ (10 + 10 + 5 câu).
- **Còn khoảng 252 bài** (Đề 3: 40 · Đề 4: 42 · Đề 5: 41 · Đề 6: 43 · Đề 7: 42 · Đề 8: 44; đã trừ bộ Part 7 dài hơn 200 từ). Số bài mới bắt đầu từ **106** (danh sách đợt Đề 2: `tools/hocthuoc/dot3.json`; đợt kế tiếp ghi `dot4.json`).
- Đề 9–16 (ETS, bảng `de_rieng`): KHÔNG làm. Người sáng lập đã từ chối cho Claude đọc bảng này (21/11). Chỉ làm khi người sáng lập cho phép rõ ràng; nội dung không vào repo.

## 2. Hai mục tiêu · chủ đề · dạng bài (người sáng lập 23/11/2026)

Mỗi bài thuộc MỘT mục tiêu, MỘT chủ đề, MỘT dạng. **Chủ đề trùng nhau thì xếp vào 🎯 TOEIC** (ví dụ: mua sắm, nhà hàng, đi lại, khách sạn, hẹn bác sĩ, thuê nhà, sửa đồ, gọi điện đặt lịch). Mục tiêu 💬 Giao tiếp chỉ giữ chủ đề TOEIC không có.

### 2.1. 🎯 Mục tiêu TOEIC: 12 chủ đề

Bài lấy từ Đề 1–8 (như hiện nay). Mỗi bài ghi mã chủ đề `chu` trong `baiN.in.json` / `meta`.

| Mã | Chủ đề | Hay gặp | Gồm cả phần trùng với giao tiếp |
|---|---|---|---|
| vp | 🏢 Văn phòng | họp, lịch làm việc, máy in, memo, chuyển văn phòng | gọi điện đặt lịch họp |
| ns | 👥 Nhân sự | tuyển dụng, phỏng vấn, đào tạo, thăng chức, phúc lợi | |
| kd | 💼 Kinh doanh chung | hợp đồng, doanh số, tiếp thị, ra mắt sản phẩm | |
| tc | 💰 Tài chính | ngân sách, hoá đơn, thanh toán, ngân hàng | |
| mb | 🛒 Mua bán | đặt hàng, giao hàng, trả hàng, giảm giá | mua sắm |
| sx | 🏭 Sản xuất | nhà máy, kho, kiểm tra chất lượng, an toàn | |
| dl | ✈️ Đi lại | vé, khách sạn, thuê xe, tàu xe, hoãn chuyến | đi lại, khách sạn |
| an | 🍽 Ăn uống, giải trí | nhà hàng, đặt bàn, tiệc, sự kiện, bảo tàng | nhà hàng, đặt vé |
| nha | 🏠 Nhà cửa | thuê nhà / văn phòng, sửa chữa, xây dựng | thuê nhà, sửa đồ |
| sk | 🏥 Sức khoẻ | hẹn bác sĩ, bảo hiểm, phòng khám | hẹn bác sĩ |
| kt | 💻 Kỹ thuật | máy tính, phần mềm, mạng, bảo trì | |
| pt | 📰 Phát triển công ty | nghiên cứu, chi nhánh mới, thông cáo, giải thưởng | |

Nguồn: danh sách chủ đề trong tài liệu thí sinh của ETS (theo hiểu biết của Claude, chưa tra lại bản mới nhất).

Dạng bài (giữ như app hiện nay): 🗣 Hội thoại (Part 3) · 📢 Bài nói (Part 4) · ✉️ Văn bản (Part 6) · 📄 Đọc hiểu (Part 7) · 💬 Hỏi – đáp (Part 2). Một chủ đề không cần đủ 5 dạng: dạng nào có trong đề thì có.

### 2.2. 💬 Mục tiêu Giao tiếp tự nhiên hằng ngày: 8 chủ đề

Không có trong đề nên **phải soạn bài mới** (Claude soạn, lối nói thân mật, cấp A2–B1). Mỗi chủ đề 10 bài, chia theo độ sát với nói thật (người sáng lập duyệt 23/11/2026; tỉ lệ là ý kiến của Claude): 🗣 Hội thoại 4 · 💬 Hỏi – đáp 2 bộ (20 câu) · 📢 Bài nói 2 · ✉️ Tin nhắn / chat 1 · 📄 Đọc hiểu 1. 8 chủ đề = **80 bài**, khoảng 560 cụm (7 cụm / bài). Lý do: thuộc cụm làm sẵn giúp nói trôi chảy (hướng "học theo cụm" của Lewis 1993, Wray 2002; theo hiểu biết của Claude, chưa tra lại); đọc hiểu cần hiểu hơn là thuộc nên ít bài nhất. Thời gian ước (chưa đo): 20–30 phút / bài → 27–40 giờ cho 80 bài, ~4–5 tháng nếu 15 phút / ngày.

| Mã | Chủ đề | Ví dụ tình huống |
|---|---|---|
| gt-bt | 🙋 Bản thân & gia đình | quê ở đâu, làm nghề gì, con cái, bố mẹ |
| gt-bb | 🤝 Bạn bè & các mối quan hệ | rủ đi chơi, làm quen, hẹn hò, giận nhau làm lành |
| gt-st | 🎮 Sở thích & cuối tuần | thể thao, game, nấu ăn, phim (nói chuyện về sở thích, không phải đặt vé) |
| gt-cx | ❤️ Cảm xúc & ý kiến | vui, buồn, lo, khen, chê, đồng ý / không đồng ý lịch sự |
| gt-kc | 📖 Kể chuyện & chuyện phiếm | kể chuyện cuối tuần, chuyện vui, chuyện xui |
| gt-hn | ☀️ Chuyện vặt hằng ngày | thời tiết, giao thông, việc nhà, chào hỏi xã giao |
| gt-hd | 🎓 Học hành & dự định | học tiếng Anh, thi cử, kế hoạch năm tới, ước mơ |
| gt-kh | 🚨 Tình huống khẩn | lạc đường, mất đồ, bị ốm đột ngột, gọi cấp cứu |

Dạng bài: cùng 5 dạng và cùng giao diện như TOEIC, nội dung đổi sang đời thường:

| Dạng | Bên TOEIC | Bên giao tiếp |
|---|---|---|
| 🗣 Hội thoại | Part 3 công sở | 2–3 người quen nói chuyện, 80–140 từ |
| 📢 Bài nói | Part 4 thông báo | một người kể chuyện / tin nhắn thoại / vlog ngắn, 70–120 từ |
| ✉️ Văn bản | Part 6 e-mail, memo | tin nhắn, chat nhóm, bài mạng xã hội có chỗ trống |
| 📄 Đọc hiểu | Part 7 | bài blog / diễn đàn ngắn + câu hỏi hiểu |
| 💬 Hỏi – đáp | Part 2 | 10 câu nói thường ngày + 3 lời đáp, chọn lời đáp tự nhiên nhất |

Điểm học xuyên suốt (mỗi bài giao tiếp có trong 7 cụm từ): **≥ 2 cụm lối nói thân mật hoặc câu phản ứng giữ nhịp** ("No way!", "Sounds good", "Sorry, come again?", gonna / kinda…), kèm ghi chú khi nào không dùng (thi, e-mail công việc).

### 2.3. Việc cần làm để có 2 mục tiêu

| Bước | Việc | Ai làm · model · effort |
|---|---|---|
| ✅ G0 | Gán mã chủ đề TOEIC cho 66 bài cũ (55 bài chưa có `chu`); các đợt Đề 2–8 gán ngay ở bước Danh sách | Phiên chính · Opus · low (máy gợi ý theo từ khoá, người đọc lại) |
| ✅ G1 (v211) | App: danh sách bài chọn theo **mục tiêu → chủ đề → dạng** (thay chọn theo dạng → đề); `meta.muc` ('toeic' / 'gt') + `meta.chu`; lối vào 💬 Giao tiếp (đề xuất: 📚 Học, cạnh 🧱 Nền; **người sáng lập chọn**) | Phiên chính · Opus · high · Spec Kit (màn mới, đổi luồng) + luật thiết kế |
| ✅ G2 (v211, bai1001–1003 chủ đề gt-bb; luật ở `tools/hocthuoc/LUAT-SOAN.md` mục Giao tiếp) | Khuôn bài giao tiếp + 2–3 bài mẫu (1 chủ đề, các dạng): bài gốc tự soạn thay vì lấy từ đề, EXQ = câu hỏi hiểu tự soạn (máy kiểm cần ≥ 3), giọng Kokoro qua `tools/build-audio.py` (cần thêm nguồn câu `content/hocthuoc`) | Phiên chính · Opus · high |
| ⏳ G3 (đang chờ) | **Mốc dừng:** người sáng lập thử bài mẫu trên iPhone, duyệt khuôn | Người sáng lập |
| G4 (① ✅ v212; ③ đợt 1 gt-bt + gt-st ✅ v214, đợt 2 gt-cx + gt-kc ✅ v215, đợt 3 gt-hn + gt-hd ✅ v217, đợt 4 gt-kh ✅ v220: đủ 80 bài) | Soạn 80 bài giao tiếp theo khuôn, thứ tự: ① soạn đủ 10 bài chủ đề 🤝 Bạn bè (thêm 7: hội thoại 3, hỏi – đáp 1 bộ, bài nói 2, đọc hiểu 1) → ② 1–2 người học thật dùng 2 tuần, đo phút / bài, % cụm còn nhớ sau 7 ngày, số bài bỏ dở → ③ nhớ ≥ 60% (ý kiến của Claude) và ít bỏ dở thì soạn 7 chủ đề còn lại, mỗi đợt 2 chủ đề = 20 bài; không đạt thì sửa khuôn trước | `soan-theo-khuon` · Sonnet · medium; soát `soat-lai` · Opus · medium (thêm: lối nói có tự nhiên không, có lẫn văn công sở không) |

Thứ tự đề xuất: làm xong ít nhất **1–2 đề TOEIC** (mục 3) rồi mới làm G1–G4, để không dở dang cả hai. G0 làm cùng đợt Đề 2.

## 3. Quy trình một đợt TOEIC (= một đề, ~40 bài)

Chạy mọi lệnh ở gốc repo. Trước khi đọc mã: `graphify query "<câu hỏi>"` (luật trong CLAUDE.md).

1. **Danh sách bài** (phiên chính): tạo `tools/hocthuoc/dotN.json` dạng `[[số bài, đề, "p3", thứ tự], ...]`, theo mẫu `tools/hocthuoc/dot2.json` (Đề 1). Part 2: `[n, đề, "p2", 0 | 1 | 2]` = bộ 10 câu thứ mấy. Bỏ bài đã có (bảng trên). Bộ Part 7 dài hơn 200 từ thì bỏ (Đề 6 có 2, Đề 8 có 1). Ghi mã chủ đề (mục 2.1) cho từng bài vào `baiN.in.json` trường `chu` sau khi chạy bước 2.
2. **Đầu vào**: `node tools/hocthuoc/prep2.mjs content/hocthuoc tools/hocthuoc/dotN.json` → `content/hocthuoc/baiN.in.json`.
3. **Soạn** (thợ `soan-theo-khuon`, Sonnet): mỗi thợ ~7 bài, 6 thợ chạy song song. Lời giao phải cấm sinh VNY / IPA / STR bằng script (v210: một thợ làm vậy, cả nhóm bị trả lại); tên bài Nền lấy đúng `title` trong `np.json` (máy đo được, xem đoạn v210 trong CLAUDE.md). Lời giao phải tự đủ: đọc `tools/hocthuoc/LUAT-SOAN.md` + bài mẫu theo dạng (bai2 bài nói · bai7 hội thoại 3 người · bai9, bai12 Part 6 · bai19, bai23 Part 7 · bai24 Part 2); chỉ tạo `content/hocthuoc/baiN.js` của mình; tự chạy `node tools/hocthuoc/check.mjs content/hocthuoc/baiN.js` tới khi in OK; không commit.
4. **Soát** (thợ `soat-lai`, Opus medium): đọc ngẫu nhiên ≥ 10% (ít nhất 5 bài) của đợt. Tìm lỗi kiến thức: phương án nhiễu cũng đúng, câu ④ thiếu đáp án gõ, dịch sai, điểm ngữ pháp sai tên bài Nền. Lỗi nặng > 1/10 thì giao soạn lại cả đợt kèm danh sách lỗi.
5. **Dựng**: `python3 tools/hocthuoc/build.py <thư mục tạm>` (bài trong `tools/hocthuoc/hoan.json` bị bỏ qua, in "HOÃN bài") (bài không qua máy kiểm thì bị bỏ, có in "BỎ bài") → `python3 tools/hocthuoc/build-web.py <thư mục tạm>` → `hoc-thuoc/` mới.
6. **Kiểm**: mở `hoc-thuoc/index.html` qua máy chủ tĩnh, khổ iPhone SE (Chromium chỉ để soát, không thay iPhone): chọn bài mới, chạy ⚡ Đua giờ, 💡 / ✍️; không lỗi trang, không tràn ngang. `node tools/test/run.mjs` (C103 kiểm đủ tệp bài).
7. **Phát hành**: cập nhật bảng mục 1 của tệp này + đoạn v… trong `CLAUDE.md` → `node tools/release.mjs` → commit, push nhánh của phiên → PR vào main (người sáng lập đã cho đẩy lên web) → gộp.

Thứ tự đề gợi ý: Đề 2 → 3 → 4 → 5 → 7 → 6 → 8 (đề đã có vài bài trước, để người học có đề "gần đủ" sớm).

## 4. Ai làm, model, effort (đợt TOEIC)

| Bước | Ai làm | Model | Effort | Vì sao |
|---|---|---|---|---|
| 1 Danh sách, 2 đầu vào | Phiên chính | Opus | low–medium | Máy móc nhưng phải chọn bài đúng |
| 3 Soạn ~40 bài | 6 thợ `soan-theo-khuon` | Sonnet | medium | Khuôn + mẫu đã duyệt; low dễ lệch khuôn |
| 4 Soát | `soat-lai` | Opus | medium | Đã có khuôn để so; đợt đầu của tài khoản mới dùng high |
| 5–6 Dựng, test | `tho-may` | Haiku | low | Chỉ chạy lệnh, báo kết quả |
| 7 Phát hành, CLAUDE.md | Phiên chính | Opus | medium | Có test chặn |

- Không dùng Haiku cho nội dung; không dùng max / Fable.
- Hạn mức gói Pro: một đợt ~40 bài (~2.400 câu luyện) tốn nhiều. Làm **một đề mỗi phiên**, hết hạn mức thì dừng sau bước 5 của các bài đã qua máy kiểm, commit, ghi số bài đã xong vào mục 1.
- Rủi ro dùng Sonnet: phương án nhiễu cũng đúng, câu ④ thiếu đáp án gõ (đã gặp ở Đề 1). Cách soát: bước 4 + đọc thêm 2–3 bài.

## 5. Bộ tiêu chí mỗi đợt

| Mã | Tiêu chí | Cách đo | Ngưỡng đạt | Bắt buộc? |
|---|---|---|---|---|
| HT1 | Bài qua máy kiểm khuôn | `check.mjs` / build.py không in "BỎ bài" | 100% | Có |
| HT2 | Lỗi kiến thức nặng | `soat-lai` đọc ≥ 10% | ≤ 1 / 10 bài | Có |
| HT3 | Đủ bài của đề | đếm theo mục 1 | 45 (trừ bộ Part 7 > 200 từ) | Có |
| HT4 | Có giọng đọc | mã giọng trong L không rỗng (Part 3, 4, 2) | ≥ 95% câu | Có |
| HT5 | Bộ test app | `node tools/test/run.mjs` | Đạt hết | Có |
| HT6 | Giao diện trang con | Chromium khổ iPhone SE | 0 lỗi trang, 0 tràn ngang | Có |
| HT7 | Kiểm trên iPhone | người sáng lập thử | 1 bài mới chạy Đua giờ được | Chưa đo được, cần iPhone |
| HT8 | Giáo viên kiểm | giáo viên thật đọc mẫu | — | Chưa đo được, cần giáo viên |
| HT9 | Mỗi bài có mã chủ đề, đúng mục tiêu | đếm `chu` / `muc` trong meta | 100% | Có |
| HT10 | (Giao tiếp) có lối nói thân mật | mỗi bài ≥ 2 cụm thân mật / phản ứng trong 7 cụm | 100% bài | Có |
| HT11 | (Giao tiếp) không trùng chủ đề TOEIC | soát chủ đề theo mục 2 | 0 bài trùng | Có |

Ngưỡng là ý kiến của Claude. Đánh giá theo quý: hết quý 1/2027 có ≥ 2 người học thật dùng ≥ 5 bài chưa; chưa có thì dừng soạn thêm đề, ưu tiên tìm người dùng.

## 6. Việc tồn (làm khi rảnh, trước hoặc giữa các đợt)

1. **Nối âm / nuốt âm (LK, EL) cho bài 47–66** còn trống: thợ Sonnet theo bài mẫu có LK / EL (bài 2, 7), soát 5 bài.
2. **Bài 46**: vài câu luyện mới gần trùng nhau; viết lại câu trùng.
3. **Ghi chú ở kết quả đề thử**: "Bạn đã học thuộc N bài của đề này, điểm có thể cao hơn sức thật" (yêu cầu của người sáng lập 21/11, chưa làm). Việc giao diện + đọc `S.ht`: phiên chính Opus high, theo luật thiết kế trong `.claude/CLAUDE.md`.
4. **Kiểm iPhone** (người sáng lập): máy chép lời trong khung iframe, tiếng 🔊, tắt mở lại app còn tiến độ, nút "‹ Luyện đề".

5. ✅ v223 (đã làm). **Bài 99–103 (Đề 2, hoãn ở v210):** soát 23/11 chấm nặng: VNY mỗi ý là nguyên cụm VNK có ngoặc / "(1)" nên bài tập gõ nghĩa không chấm được; IPA số ("1" ngày → fɝːst, số bàn faɪv / ten), "I am" ghi như A.M., ðə / ði; LK / EL rỗng; bài 99 MU g1.b3[1] và một câu NEWQ2 có nhiễu "too" cũng đúng, NEWQ2 1 / 3 gần trùng MU; bài 103 dịch L[8], L[9] cứng, who W thiếu lịch phỏng vấn. Giao `soan-theo-khuon` viết TAY (không sinh tự động), `soat-lai` đọc lại cả 5 bài, rồi bỏ số khỏi `hoan.json` và dựng lại.

## 7. Lời nhắn để dán sang tài khoản mới

> Đọc `docs/KE-HOACH-HOC-THUOC.md` và đoạn v209, v210 trong `CLAUDE.md`. Trước hết làm xong 5 bài hoãn 99–103 (mục 6.5). Rồi làm đợt kế tiếp theo mục 3 (Đề 3, số bài từ 106, gán mã chủ đề theo mục 2.1), giao thợ theo mục 4, chấm theo mục 5. Phần 💬 Giao tiếp (mục 2.2–2.3) chỉ bắt đầu sau 1–2 đề TOEIC và phải dừng ở G3 chờ người sáng lập duyệt. Không đọc bảng `de_rieng`. Xong đợt thì phát hành và cập nhật bảng mục 1.
