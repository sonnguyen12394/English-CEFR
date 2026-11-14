# Bộ tiêu chí soát câu đề TOEIC

Dùng mỗi khi **soạn hoặc sửa** câu của đề thử trọn TOEIC (`content/toeic/tron/deNN.json`, và câu kho luyện dùng trong Đề 1–2). Người sáng lập yêu cầu ngày 9/11/2026 vì "có vài câu không hợp lý lắm". Đặc tả: `specs/011-kiem-noi-dung-de`.

Tiêu chí dựa trên cấu trúc đề công khai của ETS và nguyên tắc viết câu trắc nghiệm phổ biến (một đáp án đúng; phương án sai hợp lý nhưng sai rõ; không lộ đáp án qua hình thức). Claude soạn theo hiểu biết, chưa đối chiếu tài liệu nội bộ của ETS. Bộ kiểm giảm lỗi, không thay giáo viên.

## Ba lớp kiểm

| Lớp | Ai / cái gì | Bắt được | Mức |
|---|---|---|---|
| 1. Soát khi soạn | Claude đọc từng câu theo các tiêu chí `H-*` dưới đây | nghĩa, độ tự nhiên, độ khó | người |
| 2. Máy kiểm | `node tools/kiem-toeic.mjs` (tự chạy sau `node tools/build-toeic.mjs`) | lỗi hình thức, lệch người nói, câu bảng, phép tính… (mã `C-*`, `P1-*` … `P7-*`) | **lỗi** = dừng dựng · **cảnh báo** = sửa hoặc ghi "đã xem" |
| 3. Giải mù | một phiên Claude khác làm đề KHÔNG thấy đáp án (`tools/giai-mu.mjs`) | câu có 2 đáp án, đáp án sai, câu khó hiểu (mã `GM-*`) | cảnh báo |

Cổng phát hành (test C69): **0 lỗi, 0 cảnh báo chưa xem, mọi đề đã giải mù**.

Bộ dựng (`tools/build-toeic.mjs`) đã kiểm sẵn, không nhắc lại ở đây: cơ cấu đề (số câu từng Part, thứ tự, bài có bảng ở cuối, 3 người nói…), dạng câu tối thiểu, nhãn dạng, câu trích `ev` có nguyên văn trong bài, trùng nguyên văn và **gần trùng** với kho luyện / đề khác (Part 2, Part 5), và từ v153 **bài chép khuôn** Part 3 / 4 / 6 / 7 (đổi tên người / số nhưng giữ câu chữ: cụm 5 từ trùng ≥ 10% hoặc từ nội dung trùng ≥ 0,25). Giải mù Đề 4 / 6 chỉ ra loại lỗi này; đo lại thấy 6 bài của Đề 3–5 chép khuôn bài kho (thư "office chairs out of stock… Ergo Plus", tin nhắn "van broke down on Route 9", thông báo hoãn chuyến bay, gia hạn tạp chí, quảng cáo trường ngoại ngữ, tiệm bánh "Golden Crust") → viết tình huống mới.

## Quy trình soạn một đề

0. Đọc sổ lỗi soạn đề (tab 🛡️ Kiểm đề trong app, nguồn `content/toeic/so-loi.json`): so tình huống định soạn với các mục "khi soạn"; lỗi nào đã có luật máy thì máy chặn, lỗi "người soát phải nhớ" thì tự soát kỹ (v155).
1. Soạn theo khuôn đề (`specs/010-toeic-10-de-tron/research.md` R4) và bối cảnh mới (không lặp chủ đề của đề trước). Trước khi dựng, liệt kê tình huống từng bài của đề và so với nhau (`H-LAP`): v154 khi soạn Đề 7 có 2 bài giờ mở cửa thư viện (Part 4, Part 6), 2 dịch vụ in (Part 7), 2 bài hồ bơi câu lạc bộ thể hình (Part 3, Part 7). Người soạn hay vô tình viết lại bài đề cũ (Đề 8 nháp: thuê xe như Đề 5, đăng ký khách như Đề 6, giới thiệu nhân viên xuất sắc như Đề 4, cả 4 câu tranh công nhân của Đề 4): bộ dựng chặn, nhưng nên tránh từ lúc soạn.
2. Tự soát từng câu theo `H-*` (đọc như thí sinh: che đáp án, tự chọn). Phần Đọc theo `docs/KHUON-DE-TOEIC.md`; đo bằng `node tools/do-khuon.mjs deN`.
3. `node tools/build-toeic.mjs` → sửa hết **lỗi**.
4. `node tools/kiem-toeic.mjs deN` → đọc từng **cảnh báo**: câu kém thì sửa; câu ổn thì ghi "đã xem" (dưới).
5. Giải mù: `node tools/giai-mu.mjs xuat deN nghe …` và `… doc …` → giao 2 phiên Claude phụ → `node tools/giai-mu.mjs so deN …`. Thêm giải không có bài (v175): `… xuat deN khongbai …` → phiên phụ thứ 3 → `so deN …` (≤ 75%, test C80).
6. Xử lý từng câu lệch (`GM-LECH`, `GM-HAI`): sửa cho chỉ còn một đáp án, hoặc ghi lý do đáp án gốc đúng. Câu đã sửa → giải lại (`--cau`) tới khi hết `GM-CU`. So ghi chú giải mù với các mục "khi làm đề" của sổ lỗi; loại lỗi mới thì thêm mục vào `content/toeic/so-loi.json` (v155).
7. Dựng giọng câu nghe mới / sửa (`tools/build-audio.py`; đổi giới tính người nói thì xoá tệp giọng cũ của câu đó trước).
8. `node tools/test/run.mjs` (C69 xanh) → `node tools/release.mjs`.

## Tiêu chí người soát (`H-*`, không có luật máy)

- `H-DUNG` · Đáp án đúng theo bài và **duy nhất**: che đáp án, tự làm; nếu phải "nghĩ nhiều" để loại một phương án thì phương án đó chưa sai rõ.
- `H-SAI-HOP-LY` · Phương án sai cùng chủ đề, cùng dạng, nghe có lý với người chưa đọc kỹ; không vô lý tới mức tự loại (vd. "A doctor" cho người bán ghế văn phòng).
- `H-SAI-DUNG` · Phương án sai không được đúng theo bài. Bẫy "lặp từ" hợp lệ khi từ đó trong bài nói về **người khác / lúc khác / việc khác**. Ví dụ đã sửa: d06-p4-10 "What are the listeners asked to do?" có phương án sai "Visit store owners" trong khi bài nói "top salespeople … meeting with store owners" (người nghe có thể chính là nhóm bán hàng) → đổi thành "Attend a trade show".
- `H-BAY` · Bẫy đúng kiểu đề thật: Part 2 lặp từ / từ gần âm (`rep`), từ liên quan (`rel`), Yes / No cho câu Wh- (`yn`), sai loại thông tin (`type`); nhãn `tr` ghi đúng loại bẫy (bản đồ điểm TOEIC đọc nhãn này).
- `H-TU-NHIEN` · Tiếng Anh tự nhiên, đúng văn phong công sở; lời nói nghe như người thật nói (có "Hmm", "Well", câu ngắn); chính tả Mỹ (color, center) trừ khi bài cố ý là người Anh.
- `H-THAT` · Số liệu, giờ giấc, giá, khoảng cách hợp đời thực; ngày và thứ khớp nhau; phép tính đúng (máy chỉ kiểm phép tính viết trong giải thích).
- `H-DO-KHO` · Mỗi Part dễ dần sang khó; Part 5 không toàn câu dễ đoán.
- `H-TRANH` · Tranh Part 1 nhìn ra được hành động / vật mà câu đúng tả (emoji trên iPhone là kiểu Apple, khác máy soạn); câu đúng không cần đoán.
- `H-NHAY-CAM` · Không định kiến giới, nghề, quốc tịch; không chủ đề nhạy cảm (chính trị, tôn giáo, bệnh nặng, tai nạn).
- `H-GT` · Giải thích tiếng Việt đúng, ngắn, nói được **vì sao** chọn đáp án (và vì sao phương án bẫy sai khi cần).
- `H-LAP` · Trong **một đề**, không lặp tình huống, câu hỏi + đáp án, tên người / tên hiệu ở 2 bài (đề thật không có 2 cuộc gọi nhắc lịch hẹn hay 2 bản tin kẹt xe trên cùng một con đường). Đề 1–2 ghép từ kho luyện nên dễ lặp nhất: thay bằng bài kho chưa dùng (`content/toeic/tron.json`) hoặc đổi tình huống. Ví dụ đã sửa (v153): Đề 1 có 2 bài trả áo khoác "hết cỡ" (t3-04, t3-14), 3 bài mở đầu "sales figures"; Đề 2 có 2 bản tin Highway 9 (t4-04, t4-12) và 2 cuộc gọi nhắc lịch hẹn "đến sớm" (t3-17, t4-02). Máy bắt một phần (`C-LAP-CAU`, `C-LAP-TEN`).
- `H-BAN-HIEU` · Lời đáp sai Part 2 không được là một **lời đáp gián tiếp hợp lý** (đề thật hay lấy lời đáp gián tiếp làm đáp án đúng). Ví dụ đã sửa: "Let's review the budget before the meeting." · nhiễu "The meeting was canceled." (cũng là lời đáp hợp lý: khỏi xem trước) → "The meeting lasted two hours."; câu lựa chọn "…printed or sent by e-mail?" · nhiễu "Yes, please print it." (vẫn chọn một bên) → "Yes, I'd like that."
- `H-BANG-CAN` · Câu "Look at the graphic" phải **cần bảng** mới trả lời được: lời nghe nhắc ô khác của cùng hàng (vd. "the only sunny day this week" → nhìn bảng ra Thursday), không nói thẳng đáp án và không suy được bằng lý lẽ thường ("the next day" sau thứ Bảy là Chủ nhật, không cần bảng; d06-p3-11 đã sửa ở v153).

## Khuôn Phần Đọc theo đề ETS (v174)

So Đề 1–8 (Claude soạn) với 8 đề ETS Đọc (Đề 9–16, sách ETS TEST 01–08, chỉ có phần Đọc; số đo bằng máy, 14/11/2026). Chỉ ghi số và cách viết, không chép câu ETS. Phần Nghe chưa so được (không có đề ETS Nghe trong app). **Khuôn đầy đủ để soạn (cơ cấu, tỉ lệ dạng, mẫu câu hỏi, cách viết đáp án / phương án sai, loại văn bản, quy trình): `docs/KHUON-DE-TOEIC.md` (v175).** Đo: `node tools/do-khuon.mjs deN`; từ v175 đề mới (ngoài Đề 1–8) lệch khuôn thì bộ dựng dừng (`D-KHUON-ETS`), giải không có bài Part 7 > 75% thì test C80 chặn phát hành.

| Số đo | ETS (8 đề) | Đề 1–8 | Khuôn cho đề sau |
|---|---|---|---|
| Part 5 · số từ mỗi câu | 14–15 | 11–12 | 13–16 |
| Part 5 · câu từ vựng (4 từ khác gốc, không phải từ chức năng) | 12–14 / 30 | 5–11 (Đề 3–8: 5–8) | ≥ 11 / 30 |
| Part 6 · số từ mỗi đoạn | 87–106 | 74–94 | 90–110 |
| Part 6 · chỗ trống từ nối (however, therefore…) | 0–1 / 16 | 1–3 | ≤ 1 |
| Part 7 · tổng số từ | 3.080–3.590 | 1.490–1.790 | ≥ 2.800 |
| Part 7 · văn bản đơn (từ / bộ) | 137–169 | 79–95 | 130–170 |
| Part 7 · bộ nhiều văn bản (từ / bộ) | 330–400 | 121–181 | 300–400 |
| Part 7 · số từ đáp án / phương án sai | 5,1–6,1 / 5,1–6,0 (bằng nhau) | 3,8–4,9 / 3,4–4,1 (đáp án dài hơn) | dài bằng nhau, ~5–6 từ |
| Part 7 · đáp án là phương án dài nhất | 6–16 / 54 (~19%) | 13–24 / 54 (~37%) | ≤ 13 / 54 |
| Part 7 · chữ của bài có trong đáp án / phương án sai | ~0,45 / ~0,42 (gần bằng) | ~0,49 / ~0,34 | chênh ≤ 0,08 |
| Part 7 · câu "What is indicated / stated / true" | 10–13 / 54 | 3–8 | ≥ 9 |
| Part 7 · loại văn bản, thứ tự | đổi mỗi đề (coupon, chính sách, hợp đồng, biên bản, blog, thiệp mời…) | Đề 3–8 gần như một thứ tự; Đề 7 = Đề 8 | không lặp thứ tự của đề trước |

- `H-ETS-TU-VUNG` · Part 5 nặng từ vựng như đề thật: khoảng 12 / 30 câu là 4 từ khác gốc cùng loại từ (chọn theo nghĩa + cụm cố định), câu dài 13–16 từ có mệnh đề phụ; bớt câu so sánh / đảo ngữ / đại từ dễ (v166 đã thêm câu từ vựng vào kho luyện, đề trọn chưa theo).
- `H-ETS-DOAN` · Part 6: đoạn 90–110 từ, loại văn bản đa dạng (mô tả sản phẩm, chỉ đường, blog, nhận xét…); chỗ trống chủ yếu từ vựng / dạng từ / thì theo mạch đoạn; trạng từ nối (however, therefore) tối đa 1 chỗ mỗi đề.
- `H-ETS-DAI` · Part 7 dài gấp đôi đề app cũ: văn bản đơn 130–170 từ, bộ nhiều văn bản 300–400 từ, tổng ≥ 2.800 từ. Đề ngắn làm người học quen tốc độ giả: làm kịp đề app nhưng hết giờ ở đề thật.
- `H-ETS-DAP-AN` · Part 7: đáp án **diễn đạt lại** (ít chép chữ của bài), phương án sai **dùng lại chữ của bài** nhưng sai ý; đáp án không dài / cụ thể hơn phương án sai. Ví dụ cần tránh (Đề 3, d03-p7-03, tiệm bánh): đáp án "Keeping display cases clean" (chép bài) · sai "Baking bread / Ordering supplies / Training new staff" (tự nghĩ, ngắn hơn) → đoán được mà không đọc. Cách soát: che bài, chỉ nhìn 4 phương án; nếu đoán ra đáp án thì viết lại.
- `H-ETS-HOI` · Part 7 nhiều câu "What is indicated / stated / true about …" (~10 / 54) và câu suy luận "most likely / suggested" (~10 / 54); bớt câu chi tiết hỏi thẳng một con số.
- `H-ETS-LE-THUONG` · Part 7: với mỗi câu, ghi lẽ thường người chưa đọc bài sẽ đoán; đáp án là chi tiết riêng của bài khác lẽ thường, hoặc lẽ thường nằm ở một phương án sai; không dùng every / only / no extra charge riêng ở phương án sai (v175: mẫu viết sai bị đoán 15/17 không cần bài, viết lại 7/17).
- `H-ETS-LOAI` · Loại văn bản và thứ tự bộ Part 7 đổi mỗi đề (tin nhắn / trò chuyện trực tuyến không cố định ở bộ đầu); đề mới không được trùng chuỗi loại văn bản của đề trước.

## Luật máy kiểm (`tools/kiem-toeic.mjs`)

Mức: **lỗi** (L) dừng dựng; **cảnh báo** (C) chặn phát hành tới khi sửa hoặc ghi "đã xem".

### Chung
- `C-TRUNG-PA` (L) · 2 phương án trùng nhau.
- `C-GT-LECH` (L) · Giải thích ghi "→ X" mà X là phương án sai (giải thích lệch đáp án sau khi sửa câu).
- `C-GT-THIEU` (C) · Part 5–6: giải thích không nhắc đáp án. Ví dụ: t5-09 "Câu điều kiện loại 1: If + hiện tại đơn, will + V." → thêm "(arrives)".
- `C-DAI` (C) · Part 3, 4, 7: đáp án dài hơn hẳn mọi phương án sai (> 1,6 lần và hơn 12 ký tự): thí sinh chọn câu dài nhất cũng đúng. Sửa: viết phương án sai dài tương đương hoặc rút gọn đáp án.
- `C-DANG` (C) · Chỉ riêng đáp án khác dạng (chỉ đáp án mở đầu "To …", chỉ đáp án là câu có dấu chấm).
- `C-CHU` (C) · Từ không có ở đâu khác trong nội dung tiếng Anh của app (có thể gõ sai). Từ đúng thì thêm vào `TU_OK` trong máy kiểm. Địa chỉ web / e-mail bỏ qua.
- `C-CACH` (L) · 2 dấu cách liền, dấu cách trước dấu câu, ngoặc kép lẻ. Ví dụ: t5-106 "by far the ------- ." → "-------.".

### Part 1 (tả tranh)
- `P1-EMOJI` (L) · Tranh "có người" (`k: people`) phải có hình người; tranh cảnh (`scene`) không có người.
- `P1-CANH-NGUOI` (L) · Tranh cảnh mà câu đúng nói người làm gì, hoặc dùng "is / are being + V3" (cần có người đang làm việc đó).
- `P1-GIOI` (C) · Câu đúng nói "A man / A woman / Some men…" mà tranh chỉ có người trung tính (🧑, 🧑‍💼…): thí sinh không biết là nam hay nữ. Đã sửa ở v153 (tranh 🧑 mà câu "A man is…"); luật giữ để không tái phạm (v155).
- `P1-VAT` (C) · Câu đúng nhắc vật cụ thể (vase, suitcase, bicycle…) mà tranh không có hình vật đó.

### Part 2 (hỏi – đáp)
- `P2-YESNO` (L) · Câu hỏi Wh- hoặc câu lựa chọn mà đáp án mở đầu "Yes," / "No,". ("No later than six." không tính.)

### Part 3–4 (hội thoại, bài nói)
Người nói: A = nữ, B = nam, C = nữ thứ hai; Part 4 theo `sx` ("f" / "m").
- `P34-HAMY` (L) · Câu hàm ý: câu được trích phải có nguyên văn trong lời và do đúng người được hỏi nói ("when she says" → dòng của người nữ).
- `P34-NGUOI` (L) · Hỏi "the man" mà bài không có người nam (hoặc ngược lại).
- `P4-SX` (L) · Câu hỏi Part 4 "when he / she says" mà bài chưa ghi `sx` hoặc ghi ngược. Ví dụ: t4-24 "What does the speaker imply when she says…" nhưng bài không ghi `sx` → giọng chọn ngẫu nhiên, có thể là giọng nam.
- `P34-TEN` (L) · Người nói tự giới thiệu ("This is …", "My name is …", "I'm …", "it's …") bằng tên rõ giới tính khác với giọng. Ví dụ đã sửa ở v149: t4-03 "This is Rachel Kim", t4-22 "Julia Brooks" đọc bằng giọng nam. Part 4 có tên mà chưa ghi `sx` cũng là lỗi.
- `P34-BANG-COT` (L) · 4 phương án câu bảng phải cùng một cột của bảng.
- `P34-BANG-LO` (C) · Lời nghe nói thẳng giá trị đáp án của câu bảng (số đọc bằng chữ đổi về số trước khi so: "seven twenty-five" = 7:25). Câu bảng tốt: lời nghe nhắc ô **khác** của cùng hàng, phải nhìn bảng mới ra đáp án. Ví dụ: d05-p4-10 lời nói "The children's parade has been moved…" mà câu hỏi lại hỏi sự kiện nào lúc 4 giờ.
- `P34-GIOI` (C) · Câu hỏi về lời của "the man / the woman" (suggest, offer, ask, say…) mà câu chứa đáp án do người kia nói.
- `P34-THUTU` (C) · Câu hỏi không theo thứ tự lời nói: câu trích chứa đáp án của câu sau đứng trước câu trước (đề thật hỏi theo thứ tự bài). Câu hỏi chung (chủ đề, nơi chốn, người nói là ai) không xét. Đo v155: Đề 4 câu 45, 75, 76; Đề 6 câu 93; Đề 8 bài nói hoãn sự kiện.
- `P34-NGUYEN` (C) · Đáp án (≥ 4 từ) chép nguyên văn một cụm trong lời nói: đề thật hay diễn đạt lại ("next Friday" → "In a week"). Liệt kê tự nhiên ("Hair nets and coats") thì ghi "đã xem" (v155).
- `P3-LUOT` (C) · Hội thoại 2 người có 2 lượt liền của cùng một người.

### Part 5–6 (điền câu, điền đoạn)
- `P5-CHO` (L) · Câu không có đúng một chỗ "-------".
- `P5-HOA` / `P6-HOA` (L) · Chỗ trống đầu câu mà phương án không viết hoa; Part 6: chỗ trống giữa câu mà phương án viết hoa.
- `P5-AAN` (L) · "a / an" ngay trước chỗ trống không hợp chữ đầu của đáp án.
- `P5-HO-TU` (C) · Câu "từ loại" (`t: form`) mà phương án không cùng gốc từ (ít nhất 3 phương án chung 4 chữ cái đầu; từ ngắn ≤ 4 chữ so 3 chữ đầu, vd. easy · easily · ease · eased, v154).
- `P5-GHEP` (C) · Phương án nhiễu ghép giả "từ + giới từ" trong khi đáp án là một từ ("handily to", "while to", "allowed of"): sai lộ liễu, đề thật không dùng; thường người soạn ghép để né một phương án lỡ đúng → chọn từ khác sai rõ. Giới từ / liên từ nhiều chữ có thật ("because of", "due to", "each of"…) không tính. v153 sửa 15 câu kho (t5-22, t5-25, t5-32, t5-38, t5-41, t5-50, t5-53, t5-56, t5-60, t5-78, t5-79 "In spite", t5-81, t5-84, t5-97, t5-99). Áp cho cả chỗ trống Part 6.
- `P6-CHEN-CO` (L) · Câu chèn đáp án đã có nguyên văn trong đoạn.
- `P6-THI-MOC` (C) · Chỗ chọn thì (`t: tense`) mà câu đó và 2 câu kề không có mốc thời gian (next week, last month, since…): thiếu mốc thì nhiều thì cùng đúng.

### Part 7 (đọc hiểu)
- `P7-GIO` (L) · Giờ trong chuỗi tin nhắn phải tăng dần; câu ý định "At 2:16 P.M. … writes, "X"" phải có dòng 2:16 P.M. chứa "X".
- `P7-TINH` (L) · Phép tính viết trong giải thích sai ("$150 + $160 = $310", "$310, trừ $30 → $280"). Giờ đồng hồ tính riêng: "10:00 + 6 giờ = 16:00" (v154; trước đọc nhầm thành "00 + 6 = 16").
- `P7-THU-NGAY` (L) · Cùng một ngày tháng mà 2 chỗ ghi 2 thứ khác nhau trong một bộ.
- `P7-CHEN-CO` (L) · Câu chèn [1]–[4] đã có nguyên văn trong bài.
- `P7-NOT` (C) · Câu NOT: đáp án (điều bài KHÔNG nói) có đủ chữ trong bài, hoặc phương án "có nói" gần như không có chữ nào trong bài. Thường là báo nhầm khi bài diễn đạt khác (vd. "survey" = "asked residents for their opinions") → đọc lại rồi ghi "đã xem".
- `P7-SO` (C) · Số / tiền / ngày trong đáp án không có trong bài và giải thích không có phép tính dẫn tới nó.

### Cả đề (so các bài trong cùng một đề)
- `C-LAP-CAU` (C) · Cùng câu hỏi + cùng đáp án ở 2 bài (coi "the man / the woman / the listener" như nhau): dấu hiệu 2 bài cùng tình huống. Ví dụ: "What problem does the woman mention? → A size is not available." ở 2 hội thoại trả áo của Đề 1 (trước v153).
- `C-LAP-TEN` (C) · Cùng tên người (tên + họ, tên có trong bảng tên nam / nữ) hoặc cùng tên hiệu (chữ đứng trước Hotel / Inn / Center / Catering / Market…) ở 2 bài khác nhau. Ví dụ đã sửa: "Maria Lopez" (t6-hire, t7-email3), "Greenleaf" (Catering / Conference Center), "Harbor" (Harbor View Inn / Harbor Market).

- `C-LAP-NOI` (C) · Part 6 của một đề có cùng một từ nối là đáp án 2 lần ("However" 2 lần ở Đề 1), hoặc ≥ 3 đáp án từ nối cùng loại ("In addition", "Also", "Furthermore" đều là thêm ý; Đề 8 trước v155) (v155).
- `C-SO-KHUON` (C) · ≥ 3 phương án ngắn có số / giờ / ngày mà app không xếp tăng dần được (trộn khuôn, vd. "Noon · Five o'clock · Eleven o'clock · Nine o'clock" trước khi `tqNat` đọc giờ chữ): viết lại cùng khuôn (v155).
- `C-CAN` (L) · Vị trí đáp án lệch trong một Part ≥ 10 câu: mỗi chữ phải trong [⌊N/k⌋ − 1, ⌈N/k⌉ + 1] (k = 3 ở Part 2, 4 ở Part khác) và không quá 3 câu liền cùng chữ. Bộ dựng tự cân bằng (dưới), luật này bắt khi ai đó phá (v155).

### Thứ tự phương án (app tự xếp)
- Phương án là số / tiền / giờ / ngày tháng / thứ / tầng / nhãn cùng khuôn ("The 7:15 train", "Floor 3", "$75.00", "On May 12", "Package A"): app xếp **tăng dần** như đề thật (nguyên tắc "place options in logical or numerical order"; `tqNat` ở `toqt.js`, v153). Phiên giải mù chê cách xếp lộn xộn cũ (Floor 2 · 4 · 1 · 3; Package D · A · C · B). Người soạn không phải tự xếp.
- Từ v155 app xếp được cả số viết bằng chữ (two, twelve, fifty), giờ chữ (noon, five o'clock), thời lượng khác đơn vị (40 minutes · one hour · two hours), nhãn chữ + số (B4, C2). Vẫn nên viết 4 phương án cùng khuôn; khuôn lạ mà máy không đọc được thì `C-SO-KHUON` nhắc.
- Cân bằng vị trí đáp án (người sáng lập quyết 10/11/2026, v155): bộ dựng tính thứ tự cuối ("sửa ít nhất": chỉ đổi chỗ đáp án của vài câu từ chữ thừa sang chữ thiếu) và ghi hoán vị `ord` vào dữ liệu đề; app, máy kiểm, phiếu giải mù cùng đọc. Vị trí đã chốt giữ ở `content/toeic/vi-tri-dap-an.json` (theo nội dung câu) nên sửa một câu không làm các câu khác đổi chữ; `node tools/build-toeic.mjs --can` cân bằng lại khi thêm đề / sửa nhiều. Đo trước khi sửa: Đề 1 Part 3 B 17/39, Đề 7 Part 6 B 1/16, Part 7 A 5/54, Đề 8 Part 4 C 3/30; chuỗi 5 câu liền cùng chữ ở 4 Part. Bài làm đã lưu đổi chữ theo bảng `content/toeic/doi-chu-v155.json`.

### Giải mù
- `GM-CHUA` (C, không ghi "đã xem" được) · Đề hoặc câu chưa giải mù.
- `GM-CU` (C, không ghi "đã xem" được) · Câu đã sửa sau lần giải mù → giải lại câu đó.
- `GM-LECH` (C) · Phiên giải mù chọn khác đáp án. Đọc lại câu: nếu phương án nó chọn cũng bảo vệ được → sửa câu; nếu nó đọc sai → ghi "đã xem" kèm lý do cụ thể.
- `GM-HAI` (C) · Phiên giải mù chọn đúng nhưng thấy phương án thứ hai cũng được → như trên.

Giới hạn của giải mù: phiên phụ cũng là Claude (có thể cùng điểm mù với người soạn); Part 1 chỉ thấy mô tả tranh (emoji + vị trí); Part 2–4 đọc chữ, không nghe giọng. Câu lệch là "cần xem", không tự là lỗi.

## Ghi "đã xem"

Chạy `node tools/kiem-toeic.mjs --ghi <id> <mã luật> "<lý do vì sao câu đúng>"` (máy tự lấy dấu nội dung hiện tại). Mục ghi vào `content/toeic/kiem-ok.json` có dạng:

```json
{ "id": "t7-web#1", "ma": "P7-NOT", "dau": "<dau in ra ở báo cáo>", "ly_do": "Bài chỉ cho đỗ xe miễn phí khi thuê cả ngày, nên 'Free parking' không đi kèm mọi phòng: đáp án đúng.", "ngay": "2026-11-09" }
```

- `id`: mã câu như máy in (câu thứ k của bài nhiều câu ghi `mãBài#k`); `dau`: dấu nội dung máy in (`node tools/kiem-toeic.mjs --tat-ca` hoặc báo cáo).
- Lý do phải nói **vì sao câu đúng**, không chỉ "ổn".
- Không ghi được cho lỗi, `GM-CHUA`, `GM-CU`. Câu đổi nội dung thì dấu đổi, mục cũ hết tác dụng (máy in danh sách mục cũ để dọn).

## Báo cáo

`node tools/kiem-toeic.mjs --html` → `docs/kiem-de-toeic.html`: mỗi đề số lỗi / cảnh báo / đã xem, tỉ lệ giải mù khớp, từng dòng theo số câu và chữ cái đáp án như trong app.
