# Đặc tả: 🎮 Trò chơi TOEIC Reading trong 🎯 Luyện đề

**Thư mục**: `specs/018-toeic-tro-choi` · **Ngày**: 13/11/2026 · **Trạng thái**: Đã làm (v167)

**Yêu cầu của người sáng lập**: "Dựa vào các đề TOEIC trên web, tạo trò chơi để nhớ từ vựng, ngữ nghĩa, cấu trúc để làm bài Reading tốt." Rồi: "Trò chơi đặt thành 1 mục trong Luyện đề. Lấy nội dung trong đề để chơi. Mục tiêu vẫn là làm được các đề trong phần luyện đề TOEIC."

## Gốc vấn đề

Người học mất điểm Reading ở 4 chỗ: cụm cố định Part 5, họ từ Part 5, diễn đạt lại Part 7, dò tin chậm. App đã có bài học / bài tập theo dạng, nhưng chưa có luyện nhanh, lặp nhiều lần riêng cho 2 chỗ: **cặp diễn đạt lại** (bài viết một kiểu, đáp án viết kiểu khác) và **họ từ** (chọn đúng loại từ).

Dữ liệu sẵn có trong đề (đo 13/11/2026, Đề 3–8): 305 / 324 câu Part 7 có câu chứa đáp án → mỗi câu là một cặp "chữ trong bài ↔ chữ trong đáp án"; 36 câu Part 5 dạng từ; 180 câu có "Cấu trúc hay dùng" trong lời giải. Đề 1–2 lấy câu từ kho luyện, có dữ liệu tương tự.

## Rủi ro chính

Chơi bằng câu của đề → người học nhớ đáp án → làm đề thử điểm cao giả → không còn đo được tiến bộ thật. Câu Q1 dưới đây quyết cách tránh.

## Câu chuyện người dùng

### Câu chuyện 1: 🔁 Săn cặp diễn đạt lại (ưu tiên 1)

Người học mở 🎯 Luyện đề → TOEIC → 🎮 Trò chơi → "Săn cặp". Màn hiện 5 cụm bên trái (trích từ bài đọc) và 5 cụm bên phải (đáp án viết lại), xáo thứ tự. Chạm ghép cặp, có đồng hồ. Ghép sai: cặp rung đỏ, hiện nghĩa tiếng Việt của cả hai. Hết lượt: số cặp đúng, thời gian, danh sách cặp sai kèm "📘 Xem bài gốc" (mở văn bản Part 7 chứa câu đó, chỉ ở chế độ xem).

**Kiểm**: 1) mọi cặp lấy từ câu Part 7 có câu chứa đáp án; 2) không có hai cụm trái giống nhau trong một lượt; 3) ghép đúng hết 5 cặp ra kết quả; 4) cặp sai có lại ở lượt sau.

### Câu chuyện 2: 🧩 Xếp họ từ (ưu tiên 1)

Màn hiện 4 dạng của một gốc từ (lấy từ 4 phương án câu Part 5 dạng từ, vd. directs / directly / direction / directed) và 4 ô danh từ · động từ · tính từ · trạng từ (ô nào đề không có thì ghi "—"). Kéo / chạm xếp vào ô. Bước 2: câu gốc có chỗ trống, chọn dạng đúng. Có bước tự gõ ở lần gặp lại (sai thì gợi ý chữ đầu).

**Kiểm**: 1) loại từ lấy từ lời giải nghĩa từng phương án của câu; 2) câu điền dùng đúng đáp án của đề; 3) sai ở bước 2 thì từ đó quay lại ở lượt sau.

### Câu chuyện 3 (sau, chỉ khi 1–2 được dùng): nối cụm cố định Part 5, đua dò tin Part 7, phân loại từ nối Part 6, bắn nhiễu.

### Câu chuyện 4: Nhớ lại từ sai

Cặp / từ chơi sai vào hàng ôn của trò chơi (gặp lại ngày sau, rồi giãn dần). Màn 🎮 ghi "N mục cần chơi lại hôm nay".

## Yêu cầu chức năng

- **FR-001** 🎮 Trò chơi là một mục trong màn TOEIC của tab 🎯 Luyện đề, phần 📚 Đề có sẵn (không gọi AI, miễn phí).
- **FR-002** Nội dung chỉ lấy từ câu của các đề thử TOEIC trọn theo Q1; không soạn câu mới.
- **FR-003** Săn cặp: 5 cặp / lượt, lấy từ câu chứa đáp án ↔ đáp án đúng của câu Part 7; bỏ câu không có câu chứa đáp án, câu chèn [1]–[4], câu NOT.
- **FR-004** Xếp họ từ: lấy câu Part 5 dạng từ; loại từ đọc từ lời giải nghĩa phương án; câu thiếu lời giải thì bỏ.
- **FR-005** Mục chơi sai được hỏi lại ở ngày sau; đúng ở ngày sau thì giãn lịch (1 → 3 → 7 → 21 ngày).
- **FR-006** KHÔNG đổi luật đo (📘 Học / 🔁 Nhớ / Thi chuyển cấp), không ghi vào điểm đề thử, không ghi vào bản đồ điểm TOEIC.
- **FR-007** Một lượt ≤ 2 phút. Màn chơi dùng được ở khổ 320 px, vùng bấm ≥ 44 px, theo biến màu chung (nền sáng / tối).
- **FR-008** Đếm dùng: số lượt mỗi trò, tỉ lệ đúng lần đầu / lần gặp lại; xem ở 💾 Dữ liệu → 🛠.
- **FR-009** Đề riêng 9–16: có, chỉ khi máy đã mở mã (đề đã có trên máy), không đưa lên web.
- **FR-010** Câu của MỌI đề thử trọn (người sáng lập 13/11/2026: "lấy nội dung tất cả đề"); câu làm sai trong bài làm đề lên trước; màn trò chơi ghi rõ rủi ro "làm lại đề đã chơi, điểm cao hơn thực lực".
- **FR-011** Đợt đầu 2 trò: Săn cặp + Họ từ (Claude chọn, người sáng lập "tự tính làm đi").
- Ghi chú khi làm: Đề 1–2 (câu kho luyện) chưa có câu chứa đáp án ở Part 7 nên Săn cặp chỉ lấy Đề 3–8 (289 cặp, ≤ 15 từ); Họ từ lấy mọi đề (46 câu). FR-008 đếm dùng lưu ở S.to.tc.st, chưa hiện ở 🛠.

## Thực thể

- **Mục chơi**: mã câu gốc (đề + câu), loại trò, nội dung (cặp cụm / bộ 4 dạng từ + câu), nghĩa tiếng Việt.
- **Lịch ôn trò chơi**: mã mục, hộp, ngày gặp lại, số lần đúng / sai. Riêng, không trộn thẻ học CEFR.

## Tiêu chí thành công

- **SC-001** 100% mục chơi nối về một câu có thật trong đề; 0 cặp có đáp án sai (kiểm bằng máy).
- **SC-002** Lượt chơi xong trong ≤ 2 phút với 5 mục.
- **SC-003** Mục chơi sai lần đầu, gặp lại ngày sau đúng ≥ 70% (đo sau 2 tuần dùng thật).
- **SC-004** Mục tiêu thật: người chơi ≥ 10 lượt có tỉ lệ đúng câu Part 7 diễn đạt lại / Part 5 dạng từ ở đề CHƯA làm tăng ≥ 10 điểm % so trước khi chơi.
- **SC-005** Mốc dừng (1 quý, 2/2027): < 2 người học thật chơi ≥ 10 lượt → không làm câu chuyện 3.

## Giả định

- Một cụm "chữ trong bài" là câu chứa đáp án đã có; nếu dài > 15 từ thì cắt quanh phần trùng nghĩa (bước kế hoạch xét).
- Nghĩa tiếng Việt lấy từ lời giải sẵn có (nghĩa phương án, dịch câu chứa đáp án).
- Chưa kiểm trên iPhone khi làm xong; nhờ người sáng lập thử máy thật.
- Chưa có người ôn TOEIC thật nào dùng app (kiểm kê v136 → v166).

## Bổ sung v168 (13/11/2026)

Người sáng lập: "chọn đề được để làm nội dung chơi chứ không phải chơi ngẫu nhiên; thiết kế để chơi hết 1 đề đã chọn; làm hết tất cả trò chơi còn lại".

- **FR-012** Màn trò chơi có hàng chọn đề; mọi trò chỉ lấy câu của đề đang chọn.
- **FR-013** Chơi hết đề: mỗi lượt lấy mục chưa chơi (câu sai trong đề trước, rồi thứ tự đề); hết thì mục đến hạn; hết nữa thì báo "đã chơi hết đề" và cho chơi lại mục sai / cả đề.
- **FR-014** Thêm 4 trò: Đua dò tin, Cụm hay dùng, Từ nối, Bắn nhiễu (câu chuyện 3 cũ).
- **SC-006** Chơi hết một trò của một đề được bằng các lượt liên tiếp, tiến độ "a/b" tăng đúng số mục mỗi lượt.

## Bổ sung v169 (13/11/2026): một hành trình

Người sáng lập: "các trò chơi này đang thiếu mục tiêu chung… gộp tất cả trò chơi lại làm 1", "mục tiêu cuối cùng của trò chơi là làm đề thật đã chọn đúng hết", "bạn tự tính làm".

- **FR-015** Một màn "Chinh phục đề" thay 6 trò; đích = đúng hết 100 câu Phần Đọc của đề đã chọn.
- **FR-016** Thi lượt 10 câu như đề thật → câu sai được chữa bằng các trò làm từ chính câu đó → ngày sau thi lại đúng câu đó → đúng thì xanh.
- **FR-017** Bài làm đề mới hơn ghi đè trạng thái câu (làm lại cả đề mà sai thì câu quay lại đỏ).
- **SC-007** Đi được trọn một vòng thi → chữa → thi lại mà không phải rời màn hành trình; 100/100 xanh thì báo chinh phục.
- Rủi ro đã ghi trên màn: đề đã chinh phục cho điểm cao hơn thực lực; trình độ thật đo bằng đề chưa làm.

## Bổ sung v170 (13/11/2026): đủ đề

Người sáng lập: "trò chơi mới 8 đề chưa đủ, thêm toàn bộ đề toeic hiện có vào".

- **FR-018** Hành trình liệt kê mọi đề thử trọn của app: Đề 1–8 và đề riêng 9–16 (khi đã mở mã trên máy); chưa mở thì có nút mở ngay trong màn hành trình.

## Bổ sung v171: hai mức ⭐ Đúng / 🟦 Hiểu (14/11/2026)

Người sáng lập: "bỏ hết những luật cũ… cần có đủ kiến thức để giải các đề toeic hiện có mà không phải học vẹt… Ưu tiên 1 vẫn là làm đúng được hết đề được chọn, ưu tiên 2 là nắm và nhớ được kiến thức từng câu hỏi trong đề". Đồng ý đề xuất ("Làm đi"): chỉ Phần Đọc, 🟦 đạt trong cùng buổi, bỏ luật "ngày sau mới xanh".

- **FR-019** Mỗi câu Phần Đọc có 2 mức: ⭐ Đúng = lần làm gần nhất đúng (thi lượt, bài làm 📋 đề thử trọn, hoặc làm lại sau lời giải); 🟦 Hiểu = qua thử thách kiến thức của câu.
- **FR-020** Chữa câu sai: đọc lời giải cả nhóm (≤ 5 câu) rồi làm lại cả nhóm, phương án XÁO thứ tự (trừ [1]–[4]); đúng thì ⭐ ngay.
- **FR-021** Thử thách hỏi khác câu đề, chọn 2 theo thứ tự 🧩 chỗ trống cần loại từ / quan hệ gì (Part 5 dạng từ có loại từ duy nhất, từ nối có trong bảng quan hệ) · 🔎 chạm câu chứa đáp án (Part 7 có `ev`) · ✍️ tự gõ từ, không phương án, kèm nghĩa cả câu (Part 5–6, đáp án ≤ 3 từ) · 🔗 ghép 4 phương án với nghĩa (`lg.og`). Câu chỉ có 1 thử thách thì qua 1 là đủ. Thử thách trước không được lộ từ đáp án khi thử thách sau là tự gõ.
- **FR-022** Câu 🟦 hỏi lại MỘT thử thách khác kiểu lần trước sau 3 → 7 → 21 ngày; qua cả 3 = nhớ chắc; sai = về ⭐, làm lại 2 thử thách. Làm sai câu đó trong đề sau lúc đạt thì mất cả ⭐ lẫn 🟦.
- **FR-023** Một nút ▶: chữa câu sai → thi lượt chưa làm → ôn câu 🟦 đến hạn → hiểu câu ⭐ (nhóm 5; câu trượt hôm nay xếp sau) → xong. Màn có 2 thanh ⭐ Đúng a/100 · 🟦 Hiểu b/N (N = câu có thử thách), bản đồ 4 màu ⬜ 🟥 🟩 🟦.
- Bỏ (v169): chuỗi 6 trò chữa câu, luật "ngày sau mới đúng", màn trò riêng.
- Đo (mốc 2/2027, ý kiến của Claude): người học làm đề CHƯA chơi; tỉ lệ đúng ở dạng câu đã có nhiều câu 🟦 phải cao hơn dạng ít 🟦. Không cao hơn thì đổi thử thách.
- Giới hạn: ghép nghĩa vẫn nhớ thuộc được cặp từ – nghĩa của chính câu (đó là từ vựng, mang sang đề khác được). Chưa có câu MỚI cùng kiến thức; Đề 1–2 không có 🔎 (Part 7 kho chưa có `ev`), 58 câu chỉ có 1 thử thách.
