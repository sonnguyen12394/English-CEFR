# Nghiên cứu (Phase 0): Sổ lỗi soạn đề

Ngày 10/11/2026. Mọi số đo trên dữ liệu thật của 8 đề (Đề 1–8, bản 151). Đo bằng script chỉ đọc (không đổi đề).

## R1. Một nguồn cho danh mục lỗi

- **Decision**: nguồn là `content/toeic/so-loi.json` (Claude soạn tay, như mọi nội dung khác); `node tools/build-toeic.mjs` kiểm và dựng ra `kiemde.json` ở gốc (app tải khi mở tab), gộp thêm phần máy tính: tên + mức của từng luật (đọc từ máy kiểm và bộ tiêu chí), tình trạng 8 đề (lỗi, cảnh báo, giải mù vòng đầu, số câu giải lại), số loại lỗi theo trạng thái.
- **Rationale**: hiến pháp IV (sửa qua nguồn, không sửa tay tệp dựng); số liệu không chép tay ở nhiều nơi (FR-005); tệp riêng nhỏ, không làm nặng `toeic.json`.
- **Alternatives**: ghi thẳng vào `docs/TIEU-CHI-DE-TOEIC.md` (app không đọc được markdown gọn gàng, số liệu phải chép tay); nhét vào `toeic.json` (mọi màn TOEIC phải tải thêm).

## R2. Gom lỗi đã sửa từ đâu

- **Decision**: rà 5 nguồn: (1) đoạn v149–v154 của `CLAUDE.md`; (2) ví dụ + mã trong bộ tiêu chí; (3) ghi chú phiên giải mù (`content/toeic/giai-mu/deN.json`, trường `ghi`, `hai`; lịch sử `lan`); (4) "đã xem" ở `content/toeic/kiem-ok.json`; (5) commit v149–v154 (danh sách câu sửa). Mỗi lỗi gộp vào một **loại**; ví dụ chọn câu thật, ghi bản trước → bản sau. Lỗi hiển thị người sáng lập gặp trên iPhone (v148: màn sẵn sàng ghi 100 thay vì 200 câu) là một nhóm riêng.
- **Rationale**: SC-001 đòi đủ 100%; ghi chú giải mù là nguồn "lỗi khi làm đề" duy nhất có văn bản.
- **Ước lượng**: khoảng 30–40 loại lỗi trong 4 khâu (soạn / làm đề / hiển thị / còn mở).

## R3. Tab thứ 6 trên thanh dưới

- **Decision**: thêm `🛡️ Kiểm đề` ngay sau `🎯 Luyện đề`, ai cũng thấy. Mỗi tab co đều (bỏ bề rộng tối thiểu 64 px hiện nay, vì 6 × 64 = 384 px > 320 px làm thanh dưới cuộn ngang); chữ nhãn 11–12 px, biểu tượng 20 px; đo bằng Chromium ở 320 px và 390 px: không cắt chữ, không cuộn, mỗi tab ≥ 44 px.
- **Tên**: "Kiểm đề" (7 chữ, vừa ô ~53 px). Không dùng "Sổ lỗi" vì trùng `📒 Sổ lỗi` của người học (lỗi AI chỉ ra khi chấm, ở 👤 Tôi); không dùng 🔎 vì gần giống 🔍 Tra cứu.
- **Rationale**: người sáng lập chọn tab cho mọi người (đã được nêu cái giá: iPhone nhỏ chật). Hướng dẫn giao diện iOS khuyên 3–5 tab; 6 tab vẫn dùng được nếu nhãn ngắn và đo kỹ.
- **Alternatives**: nút trong màn 🎯 Luyện đề, tab chỉ hiện trên máy người sáng lập (người sáng lập không chọn).

## R4. Phản hồi ✓ / ✗ + ghi chú

- **Decision**: chạm ✓ Đúng ý → lưu ngay; chạm ✗ Chưa đúng → mở ô ghi chú + nút Gửi. Lưu dấu ở dữ liệu học của máy (`S.kd`, đồng bộ như mọi dữ liệu học) để mở lại vẫn thấy; đồng thời xếp hàng một góp ý (`gyLS` → `gyFlush` của `gopy.js`, không mạng thì gửi sau) với `kind: 'khac'`, chữ "🛡️ Kiểm đề · {mã} · ✓ Đúng ý / ✗ Chưa đúng: {ghi chú}", `ctx: { view: 'kiemde', ma, v }`. Claude đọc bằng truy vấn bảng `gopy` lọc `ctx->>'view' = 'kiemde'`.
- **Rationale**: bảng `gopy` chỉ nhận `kind` ∈ {loi, kho, y, khac, sai} (ràng buộc ở migration v86); dùng `khac` + `ctx` thì không phải đổi máy chủ. Người ẩn danh được thêm góp ý (RLS), nên ai bấm cũng gửi được.
- **Alternatives**: bảng mới (phải migration + RLS, không cần); chỉ lưu trên máy (Claude không đọc được).

## R5. Cân bằng vị trí đáp án (đo 10/11)

- **Hiện trạng**: thứ tự phương án Part 3–7 = sắp theo băm (`trH`) của mã đề + số câu + chữ, trừ phương án số / giờ / ngày cùng khuôn (tăng dần, `tqNat`) và câu chèn [1]–[4]; Part 2 = hoán vị theo băm mã câu lúc dựng; Part 1 = thứ tự trong tệp nguồn. Đo: Part 1 cả 8 đề 1–2 câu mỗi chữ (đạt); Part 2 lệch ở 5 / 8 đề (Đề 3: A 6, Đề 4: C 6, Đề 7: B 11, Đề 8: B 6 / C 11; Đề 2 chuỗi 5); Part 3–7 lệch nhiều (Đề 1 Part 3 B 17/39, Part 6 C 1/16; Đề 7 Part 6 B 1/16, Part 7 A 5/54; Đề 8 Part 4 C 3/30); chuỗi 5 câu liền ở 4 Part.
- **Decision**:
  - Ngưỡng (FR-013): N câu, k chữ (Part 2: 3, còn lại 4) → mỗi chữ trong [⌊N/k⌋ − 1, ⌈N/k⌉ + 1]; không quá 3 câu liền cùng chữ. Ví dụ Part 6 (16): 3–5; Part 3 (39): 8–11; Part 7 (54): 12–15; Part 2 (25): 7–10.
  - **Sửa ít nhất**: bắt đầu từ thứ tự hiện tại, chỉ đổi chỗ đáp án của một số câu "tự do" (không phải số / giờ / ngày, không phải [1]–[4]) từ chữ thừa sang chữ thiếu (đổi chỗ đáp án với một phương án sai trong cùng câu), theo thứ tự cố định, tới khi mọi Part trong ngưỡng. Câu nào không phải đổi giữ nguyên chữ.
  - **Một nơi tính**: bộ dựng tính thứ tự cuối và ghi vào dữ liệu đề đã dựng (mỗi câu một hoán vị); app, máy kiểm, phiếu giải mù chỉ đọc hoán vị đó (FR-014). Đề 1–2 (ghép từ kho) ghi hoán vị trong mục `tron` của `toeic.json`; Đề 3–8 trong `toeic-tron/deN.json`.
  - **Part 2** (phương án là chữ cái, lời đọc kèm "A. … B. …"): sửa hoán vị lúc dựng cho câu cần đổi; câu đổi thì dựng lại giọng đọc 2 dòng bị đổi chỗ (Kokoro). Câu Part 2 của Đề 1–2 nằm trong kho luyện: đổi luôn ở kho (kho luyện chỉ đổi chữ cái, không đổi nội dung).
  - **Xếp số tốt hơn trước khi cân bằng**: `tqNat` thêm số viết bằng chữ (two, twelve, fifty…), giờ chữ (noon, five o'clock), thời lượng khác đơn vị (40 minutes · one hour · two hours), nhãn chữ + số (B4, C2) — vì đo thấy 10 câu có phương án số nhưng app không xếp được (Đề 3 câu 90 "Noon · Five o'clock · Eleven o'clock · Nine o'clock", Đề 4 câu 161 "About two hours · About 40 minutes · …", Đề 4 câu 178 "Two · Twelve · Six · Five"…). Làm trước bước cân bằng để chữ cái chỉ đổi một lần.
- **Rationale**: người sáng lập chọn cân bằng cả 8 đề; sửa ít nhất thì bài làm đã lưu và kết quả giải mù ít đổi; ghi hoán vị vào dữ liệu thì không thể lệch giữa app và phiếu giải mù.
- **Alternatives**: xếp lại toàn bộ theo một dãy cân bằng ngẫu nhiên (đổi chữ ~75% câu, không cần); tính ở app lúc chạy (3 nơi phải giống hệt nhau, dễ lệch).

## R6. Giữ kết quả giải mù và bài làm đã lưu

- **Decision**: trước khi đổi, chụp thứ tự cũ (số câu → các phương án theo thứ tự hiện) của 8 đề; sau khi dựng lại, đổi `da` / `chon` / `hai` trong `content/toeic/giai-mu/deN.json` theo chữ của cùng phương án (nội dung không đổi nên dấu nội dung `dau` không đổi, không phải giải lại). Từ hai bản chụp sinh tệp đổi chữ nhỏ `toeic-tron/doi-chu.json` (mỗi đề 200 chuỗi kiểu "BADC" = chữ cũ A → B…); app dùng khi mở bài làm cũ (📋 Bài làm và đáp án, bài làm một phần / từng lượt) và đề đang làm dở chưa có dấu phiên bản cách xếp, rồi lưu lại với dấu mới.
- **Rationale**: FR-016, FR-017; người sáng lập có 1 bài làm thật (Đề 1 phần Đọc).

## R7. Luật máy mới để không tái phạm (đo trên 8 đề)

| Luật | Mức | Bắt gì | Đo trên 8 đề hiện tại |
|---|---|---|---|
| `C-CAN` | lỗi | Part lệch vị trí đáp án / chuỗi > 3 câu cùng chữ | nhiều Part (R5) → sửa hết bằng R5 |
| `C-SO-KHUON` | cảnh báo | ≥ 3 phương án ngắn có số / giờ / ngày mà app không xếp được | 18 nghi, ~10 thật → sau khi mở rộng `tqNat` đo lại, còn lại viết cùng khuôn |
| `C-LAP-NOI` | cảnh báo | Part 6 một đề có cùng một từ nối là đáp án 2 lần, hoặc ≥ 3 đáp án cùng loại ("thêm ý") | 1 (Đề 1: "However" 2 lần) |
| `P34-THUTU` | cảnh báo | Câu hỏi Part 3–4 không theo thứ tự lời nói (câu trích của câu sau đứng trước câu trước) | 4 (Đề 4 câu 45, 75, 76; Đề 6 câu 93) |
| `P1-GIOI` | cảnh báo | Câu đúng Part 1 nói "A man / A woman" mà tranh chỉ có người trung tính | 0 (đã sửa ở v153; luật giữ để không tái phạm) |
| `P34-NGUYEN` | cảnh báo | Đáp án Part 3–4 (≥ 4 từ) chép nguyên văn lời nói (đề thật hay diễn đạt lại) | 5 → sửa hoặc ghi "đã xem" nếu liệt kê tự nhiên ("Hair nets and coats") |

Mỗi luật có câu cài lỗi + câu sạch trong `tools/test/kiem-mau.json`; câu đang có trong 8 đề bị báo thì sửa (giải lại câu đó) hoặc ghi "đã xem" có lý do.

## R8. Quy trình soạn đề nối với sổ lỗi

- **Decision**: bước 1 của "Quy trình soạn một đề" (bộ tiêu chí): đọc sổ lỗi (tab 🛡️ Kiểm đề hoặc `content/toeic/so-loi.json`), so tình huống với các mục "khi soạn"; bước 5 (giải mù): so ghi chú với các mục "khi làm đề", lỗi mới thì thêm mục. CLAUDE.md luật soạn đề TOEIC trỏ tới sổ lỗi. Test mới (C70) kiểm: mã mục duy nhất, mỗi mục có ví dụ + luật phòng có thật, số liệu dựng từ dữ liệu.

## R9. Không làm

- Không soạn đề mới (FR-011). Không đổi đề AI / kho đề soạn sẵn / IELTS / Cambridge. Không đổi luật đo. Không thêm bảng máy chủ.
