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

Bộ dựng (`tools/build-toeic.mjs`) đã kiểm sẵn, không nhắc lại ở đây: cơ cấu đề (số câu từng Part, thứ tự, bài có bảng ở cuối, 3 người nói…), dạng câu tối thiểu, nhãn dạng, câu trích `ev` có nguyên văn trong bài, trùng nguyên văn và **gần trùng** với kho luyện / đề khác (Part 2, Part 5).

## Quy trình soạn một đề

1. Soạn theo khuôn đề (`specs/010-toeic-10-de-tron/research.md` R4) và bối cảnh mới (không lặp chủ đề của đề trước).
2. Tự soát từng câu theo `H-*` (đọc như thí sinh: che đáp án, tự chọn).
3. `node tools/build-toeic.mjs` → sửa hết **lỗi**.
4. `node tools/kiem-toeic.mjs deN` → đọc từng **cảnh báo**: câu kém thì sửa; câu ổn thì ghi "đã xem" (dưới).
5. Giải mù: `node tools/giai-mu.mjs xuat deN nghe …` và `… doc …` → giao 2 phiên Claude phụ → `node tools/giai-mu.mjs so deN …`.
6. Xử lý từng câu lệch (`GM-LECH`, `GM-HAI`): sửa cho chỉ còn một đáp án, hoặc ghi lý do đáp án gốc đúng. Câu đã sửa → giải lại (`--cau`) tới khi hết `GM-CU`.
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
- `P3-LUOT` (C) · Hội thoại 2 người có 2 lượt liền của cùng một người.

### Part 5–6 (điền câu, điền đoạn)
- `P5-CHO` (L) · Câu không có đúng một chỗ "-------".
- `P5-HOA` / `P6-HOA` (L) · Chỗ trống đầu câu mà phương án không viết hoa; Part 6: chỗ trống giữa câu mà phương án viết hoa.
- `P5-AAN` (L) · "a / an" ngay trước chỗ trống không hợp chữ đầu của đáp án.
- `P5-HO-TU` (C) · Câu "từ loại" (`t: form`) mà phương án không cùng gốc từ (ít nhất 3 phương án chung 4 chữ cái đầu).
- `P6-CHEN-CO` (L) · Câu chèn đáp án đã có nguyên văn trong đoạn.
- `P6-THI-MOC` (C) · Chỗ chọn thì (`t: tense`) mà câu đó và 2 câu kề không có mốc thời gian (next week, last month, since…): thiếu mốc thì nhiều thì cùng đúng.

### Part 7 (đọc hiểu)
- `P7-GIO` (L) · Giờ trong chuỗi tin nhắn phải tăng dần; câu ý định "At 2:16 P.M. … writes, "X"" phải có dòng 2:16 P.M. chứa "X".
- `P7-TINH` (L) · Phép tính viết trong giải thích sai ("$150 + $160 = $310", "$310, trừ $30 → $280").
- `P7-THU-NGAY` (L) · Cùng một ngày tháng mà 2 chỗ ghi 2 thứ khác nhau trong một bộ.
- `P7-CHEN-CO` (L) · Câu chèn [1]–[4] đã có nguyên văn trong bài.
- `P7-NOT` (C) · Câu NOT: đáp án (điều bài KHÔNG nói) có đủ chữ trong bài, hoặc phương án "có nói" gần như không có chữ nào trong bài. Thường là báo nhầm khi bài diễn đạt khác (vd. "survey" = "asked residents for their opinions") → đọc lại rồi ghi "đã xem".
- `P7-SO` (C) · Số / tiền / ngày trong đáp án không có trong bài và giải thích không có phép tính dẫn tới nó.

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
