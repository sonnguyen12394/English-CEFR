# Research: Bộ kiểm nội dung đề TOEIC

Nguồn tham khảo (theo hiểu biết của Claude, chưa tra lại bản gốc): mô tả công khai đề TOEIC Listening & Reading của ETS (cấu trúc 7 Part, dạng câu); nguyên tắc viết câu trắc nghiệm phổ biến (Haladyna, Downing & Rodriguez 2002: một đáp án đúng, phương án sai hợp lý, không lộ đáp án qua độ dài / dạng / từ lặp, tránh "all of the above"…). Số đo lấy từ quét thử trên dữ liệu ngày 9/11/2026.

## R1. Hai mức kết quả + "đã xem" gắn dấu nội dung
- **Decision**: **lỗi** = luật chắc chắn (sai hình thức hoặc mâu thuẫn rõ), dừng dựng; **cảnh báo** = luật nghi ngờ, không dừng dựng nhưng chặn phát hành (C67) cho tới khi sửa hoặc ghi vào `content/toeic/kiem-ok.json` { mã câu, mã luật, dấu nội dung, lý do, ngày }. Dấu = md5 10 ký tự của câu (lời bài + câu hỏi + phương án + đáp án); câu đổi thì dấu đổi, cảnh báo hiện lại.
- **Rationale**: quét thử cho thấy luật "nghi" báo nhầm nhiều; nếu coi là lỗi thì phải làm câu kém đi để qua máy; nếu chỉ in ra thì sẽ bị bỏ qua. Ghi "đã xem" có lý do giữ được dấu vết ai đã quyết thế nào.
- **Alternatives considered**: một mức (hoặc ồn, hoặc lỏng); chỉ danh sách tay (không lặp lại được, phụ thuộc trí nhớ).

## R2. Danh mục luật tự động (mã · mức · nội dung)

Chung (mọi Part có phương án chữ):
- `C-TRUNG-PA` · lỗi · 2 phương án trùng nhau (không phân biệt hoa thường, dấu câu).
- `C-GT-LECH` · lỗi · giải thích ghi "→ X" mà X là phương án sai.
- `C-GT-THIEU` · cảnh báo · giải thích (Part 1, 5, 6, 7) không nhắc đáp án (người học không thấy vì sao).
- `C-DAI` · cảnh báo · đáp án dài hơn hẳn mọi phương án sai (> 1,6 lần và hơn 12 ký tự) ở Part 3, 4, 7.
- `C-DANG` · cảnh báo · chỉ riêng đáp án khác dạng (vd. chỉ đáp án mở đầu "To …", chỉ đáp án là câu có dấu chấm).
- `C-CHU` · cảnh báo · từ chữ thường ≥ 4 chữ cái không có ở bất cứ chỗ nào khác trong nội dung tiếng Anh của app (kho từ, bài đọc, thư viện, kho TOEIC / IELTS) → có thể gõ sai.
- `C-CACH` · lỗi · 2 dấu cách liền, cách trước dấu câu, ngoặc kép lẻ.

Part 1:
- `P1-EMOJI` · lỗi · tranh "có người" mà không có hình người; tranh "cảnh" mà có hình người.
- `P1-CANH-NGUOI` · lỗi · tranh cảnh mà câu đúng nói người làm gì hoặc dùng "is / are being + V3" (cần có người đang làm).
- `P1-VAT` · cảnh báo · câu đúng nhắc vật cụ thể (vase, suitcase, bench…) mà tranh không có hình tương ứng (bảng vật → emoji lấy từ chính các tranh đang dùng).

Part 2:
- `P2-YESNO` · lỗi · câu hỏi Wh- hoặc câu lựa chọn mà đáp án mở đầu "Yes," / "No," (không tính "No later than…", "Not yet").
- `P2-BAY` · cảnh báo · nhãn bẫy không khớp: "rep" mà phương án không lặp từ / gần âm nào của câu hỏi; phương án mở đầu Yes / No mà không gắn "yn".

Part 3–4:
- `P34-HAMY` · lỗi · câu trích trong câu hàm ý không có nguyên văn trong lời, hoặc do người khác giới với câu hỏi nói ("when she says" mà dòng đó của người nam).
- `P34-NGUOI` · lỗi · câu hỏi về "the man" mà bài không có người nam (hoặc "the woman" mà không có người nữ).
- `P4-SX` · lỗi · câu hỏi Part 4 dùng he / she / his / her cho người nói mà bài chưa ghi giới tính (`sx`) hoặc ghi ngược.
- `P34-TEN` · lỗi · người nói tự giới thiệu ("This is …", "My name is …", "I'm …") bằng tên rõ giới tính (bảng tên nam / nữ thông dụng) khác với giọng của dòng / bài.
- `P34-BANG-COT` · lỗi · 4 phương án câu bảng không cùng một cột của bảng.
- `P34-BANG-LO` · cảnh báo · lời nghe nói thẳng giá trị đáp án của câu bảng (so theo ranh giới từ; số đọc bằng chữ đổi về số trước khi so: "seven twenty-five" = 7:25).
- `P34-GIOI` · cảnh báo · câu hỏi về lời nói của "the man / the woman" (suggest, offer, recommend, ask, request, say, mention, explain, agree, want to know) mà câu chứa đáp án do người kia nói.
- `P34-SAI-DUNG` · cảnh báo · phương án sai trùng ≥ 90% từ nội dung (≥ 2 từ) với một câu do chính người được hỏi nói (Part 3) / người nói (Part 4) → có thể cũng đúng.
- `P3-LUOT` · cảnh báo · hội thoại 2 người có 2 lượt liền của cùng một người.

Part 5:
- `P5-CHO` · lỗi · câu không có đúng một chỗ "-------".
- `P5-HOA` · lỗi · chỗ trống đầu câu mà đáp án không viết hoa (hoặc giữa câu mà viết hoa, trừ tên riêng).
- `P5-AAN` · lỗi · "a" / "an" ngay trước chỗ trống không hợp chữ đầu của đáp án.
- `P5-HO-TU` · cảnh báo · dạng "từ loại" (`form`) mà 4 phương án không cùng gốc (tiền tố chung < 4 chữ cái).

Part 6:
- `P6-HOA` · lỗi · như `P5-HOA` cho chỗ trống.
- `P6-CHEN-CO` · lỗi · câu chèn đáp án đã có nguyên văn trong đoạn.
- `P6-THI-MOC` · cảnh báo · chỗ chọn thì (`tense`) mà câu chứa và 2 câu kề không có mốc thời gian (next / last / ago / since / by / tomorrow / yesterday / ngày tháng / will…).

Part 7:
- `P7-GIO` · lỗi · giờ trong chuỗi tin nhắn không tăng dần; câu ý định "At 2:16 P.M. … writes, "X"" mà không có dòng 2:16 P.M. hoặc "X" không nằm ở dòng đó.
- `P7-TINH` · lỗi · phép tính trong giải thích sai ("$150 + $160 = $310", "40 × $18 = $720").
- `P7-THU-NGAY` · lỗi · cùng một ngày tháng mà 2 chỗ ghi 2 thứ khác nhau trong một bộ.
- `P7-CHEN-CO` · lỗi · câu chèn [1]–[4] đã có nguyên văn trong bài.
- `P7-NOT` · cảnh báo · câu NOT: đáp án có đủ ý trong bài, hoặc phương án "có nói" không tìm thấy trong bài.
- `P7-SO` · cảnh báo · số / ngày / tiền trong đáp án không có trong văn bản và giải thích không có phép tính dẫn tới nó.

Giải mù (đọc từ `content/toeic/giai-mu/deN.json`):
- `GM-CHUA` · cảnh báo (không ghi "đã xem" được) · đề chưa giải mù.
- `GM-LECH` · cảnh báo · phiên giải mù chọn khác đáp án.
- `GM-HAI` · cảnh báo · phiên giải mù ghi có phương án thứ hai cũng được.
- `GM-CU` · cảnh báo (không ghi "đã xem" được) · câu đã sửa sau lần giải mù → giải lại câu đó.

Chỉ người / giải mù kiểm (ghi trong bộ tiêu chí, không có luật máy): `H-DUNG` đáp án đúng và duy nhất · `H-SAI-HOP-LY` phương án sai hợp lý, cùng chủ đề, không vô lý · `H-BAY` bẫy đúng kiểu đề thật (lặp từ, từ liên quan, sai người, sai thời gian) · `H-TU-NHIEN` tiếng Anh tự nhiên, đúng văn phong công sở · `H-THAT` số liệu, giờ giấc, giá cả hợp đời thực · `H-DO-KHO` dễ dần sang khó trong Part · `H-TRANH` tranh Part 1 nhìn ra được hành động / vật · `H-NHAY-CAM` không định kiến, không chủ đề nhạy cảm · `H-GT` giải thích tiếng Việt đúng, ngắn, nêu được vì sao.

- **Rationale**: mỗi luật nhắm một loại lỗi đã gặp thật trong repo (giọng nam đọc người nữ t4-03 / t4-22; phương án sai lỡ đúng d06-p4-10 "Visit store owners" sửa tay ở v150; câu gần trùng v150; giải thích không khớp) hoặc lỗi kinh điển của câu trắc nghiệm.
- **Alternatives considered**: kiểm chính tả bằng từ điển hệ thống (máy soạn không có `/usr/share/dict/words`; tải thêm thư viện thì thêm phụ thuộc và vướng bản quyền dữ liệu) → dùng chính kho chữ tiếng Anh của app.

## R3. Độ chính xác trước, độ phủ sau
- **Decision**: mỗi luật cảnh báo chỉnh trên Đề 1–6 tới khi tổng cảnh báo ≤ 5 / 100 câu; luật nào vẫn ồn thì thu hẹp (vd. `P34-SAI-DUNG` chỉ xét câu do chính người được hỏi nói) hoặc bỏ.
- **Rationale**: quét thử thô: 85 dòng "phương án sai có trong bài" gần hết là bẫy lặp từ đúng kiểu đề thật; 17 dòng giọng nam / nữ là báo nhầm. Danh sách dài thì không ai xem.
- **Alternatives considered**: giữ luật thô và ghi "đã xem" hàng loạt (mất ý nghĩa của "đã xem").

## R4. Giải mù
- **Decision**: `tools/giai-mu.mjs xuat` viết phiếu chữ cho mỗi đề, 2 phần (Nghe 1–100, Đọc 101–200), đánh số và chữ cái đúng như app; KHÔNG có đáp án, giải thích, câu trích, nhãn dạng, nhãn bẫy. Part 1: mô tả tranh (nền, khối màu, từng emoji kèm tên Unicode tiếng Anh và vị trí trái / giữa / phải, trên / dưới, cỡ). Part 2–4: lời nghe thành chữ, ghi người nói "Woman / Man / Woman 2" (người học nghe được giọng), bảng của câu bảng. Part 5–7 như trên màn. Mỗi phiếu giao một phiên Claude phụ (Agent, ngữ cảnh mới), yêu cầu: làm từng câu như thí sinh giỏi, ghi chữ chọn, mức chắc 1–3, chữ thứ hai nếu thấy cũng được, ghi chú ngắn nếu câu / bài có chỗ không hợp lý; trả về JSON. `tools/giai-mu.mjs so` đối chiếu, lưu `content/toeic/giai-mu/deN.json` (kèm dấu nội dung từng câu lúc giải), in tỉ lệ khớp. 12 phiên cho Đề 1–6 chạy song song; câu sửa xong giải lại bằng phiếu chỉ gồm các câu đó.
- **Rationale**: máy luật không hiểu nghĩa; câu có 2 đáp án đều đúng chỉ lộ ra khi có người (hoặc mô hình) làm mà không biết đáp án. Chia đôi đề để phiên phụ không quá dài.
- **Alternatives considered**: Claude chính tự giải lại (đã biết đáp án, không mù); dùng mô hình yếu hơn cho độc lập (sai nhiều, báo nhầm nhiều); chờ giáo viên (chưa có).
- **Giới hạn**: cùng dòng mô hình với người soạn; không nghe giọng thật; tranh chỉ là mô tả. Câu lệch là "cần xem", không tự là lỗi.

## R5. Kiểm chính tả bằng kho chữ của app
- **Decision**: gom mọi chữ tiếng Anh trong a1 / a2 / b.json, toeic.json (kho), ielts.json, uoe.json, nghe / doc / np.json, lib/*.json; chữ của đề đang kiểm không tính vào kho. Chữ thường ≥ 4 ký tự không có trong kho (kể cả sau khi bỏ đuôi -s / -es / -ed / -ing / -er / -est / -ly) → `C-CHU`.
- **Rationale**: bắt lỗi gõ (recieve, accomodate) mà không thêm dữ liệu ngoài.
- **Alternatives considered**: tải bộ từ điển (thêm phụ thuộc, bản quyền dữ liệu).

## R6. Số đọc bằng chữ
- **Decision**: trước khi so lời nghe với ô bảng / đáp án: đổi "zero … ninety-nine", "hundred", "thousand", "half past", "o'clock" về số; tách "7:25" thành 7 và 25; "$7" thành 7. So theo ranh giới từ.
- **Rationale**: tránh báo nhầm kiểu "lowest" chứa "west", và bắt được "seven twenty-five" = 7:25.

## R7. Tên người và giới tính
- **Decision**: bảng ~150 tên tiếng Anh thông dụng chia nam / nữ (lấy từ chính tên đang có trong kho + tên phổ biến); chỉ dùng cho câu tự giới thiệu ("This is …", "My name is …", "I'm …" ở đầu bài / đầu dòng). Tên không có trong bảng thì bỏ qua.
- **Rationale**: lỗi thật t4-03 Rachel Kim, t4-22 Julia Brooks đọc giọng nam (sửa tay ở v149); luật này bắt được loại đó.

## R8. Giữ chữ cái đáp án khi sửa Đề 3–6
- **Decision**: Part 2 giữ chỉ số đáp án nguồn (bộ dựng hoán vị theo mã câu, không theo chữ) → chữ cái không đổi. Part 3–7 thứ tự phương án = sắp theo `trH(mãĐề + sốCâu + chữ)` → đổi chữ một phương án có thể đổi thứ tự; ưu tiên sửa lời bài / câu hỏi; câu phải đổi phương án thì máy kiểm in "đổi chữ cái A → C" để ghi vào tài liệu.
- **Rationale**: người sáng lập đã làm thử Đề 3–4 (📋 bài làm lưu theo chữ cái); chưa có người học khác.

## R9. Chỗ chạy và cổng phát hành
- **Decision**: `build-toeic.mjs` gọi máy kiểm sau khi dựng: lỗi → dừng (exit 1); in số cảnh báo chưa xem. Test C67 trong `run.mjs`: 0 lỗi, 0 cảnh báo chưa xem, mọi đề đã giải mù, mọi luật bắt đúng câu cài lỗi của nó, câu sạch không bị bắt, mã luật có trong `docs/TIEU-CHI-DE-TOEIC.md`. `release.mjs` đã chạy run.mjs nên cổng tự có.
- **Rationale**: đang soạn thì cần dựng được dù còn cảnh báo; lúc phát hành mới bắt buộc sạch.
