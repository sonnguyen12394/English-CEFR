# Kế hoạch 021: 🌙 Đêm ở Khu phố

**Đặc tả**: `spec.md` · **Bản mẫu**: https://claude.ai/artifact/EQbiLzGrUWvmDR56j9THBm (v4) · **Không đổi luật đo.**

## Tóm tắt
Màn 🏙 Thành phố (`cyView`, thanhpho.js) đổi thành bản đồ khu phố (tệp mới `khupho.js`). Ban ngày: 8 nhà = 8 phố, lâu đài = Chinh phục đề, chạm nhà → đi tới → thẻ phố → Vào phố. 🌙 Bắt đầu đêm: ván tìm kẻ giả mạo của bản mẫu v4, nhưng việc là câu thật của đề đang chọn, ghi kết quả như câu đề ở phố.

## Bối cảnh kỹ thuật
- JS thuần, không thư viện; nạp sau thanhpho.js (index.html). CSS trong index.html, dùng biến chung (`--card`, `--fg`, `--accent`…); bản đồ đêm có biến riêng `--kp-*` (cố ý một kiểu đêm).
- Dùng lại: `trB(de)` (câu đề), `tgDe` / `tgSt` / `tgJ` / `tgJState` (đề đang chọn, ⭐), `CY_PHO` + `cyC` + `cyCount` + `cyLv` (phố của câu, bậc), `PH_PHO[k].CH` + `phFace(t)` (cư dân, hình), `phSrc` (cắt câu Part 6), lời giải `q.lg` (og loại: nghĩa, ly, dich), lịch ôn phố `S.to.pho.it` / `S.to.phos[k].it` (khoá `de:<đề>:<n>`, cùng khuôn `phMark`: lv, d theo `PH_HEN`), `acFix` (đánh thức âm thanh), `trProbe9` / `trLkList` / `trLkAll` (đề riêng).
- Lưu mới: `S.to.kp` = { snd, hoc, bay: { [đề]: [[sai, đúng]] } } (Hồ sơ bẫy ≤ 40 / đề). Ván đêm không lưu.

## Quyết định (research ngắn)
- R1 Phố của câu: dùng đúng hàm của Thành phố (`canFix` của phố, không có thì `need`), để số khớp màn phố.
- R2 Chọn việc: câu Part 5–7 có phố; thứ tự: ⭐ sai → tới hạn ôn ở phố (`it.d <= hôm nay`) → chưa làm → còn lại; lấy 5, tối đa 2 câu / phố, ≤ 1 câu Part 7 (dài).
- R3 Hiện câu: Part 5 = câu + 4 phương án; Part 6 = câu cắt bằng `phSrc` + "📄 Xem cả đoạn"; Part 7 = câu hỏi + 4 phương án + "📄 Xem cả bài". Phương án xáo, chấm theo chữ đáp án.
- R4 Nối dây: câu dạng từ có 4 phương án mà nhãn `og` cho 4 loại khác nhau trong N / V / A / R → trò nối dây với chính 4 phương án đó, xong nối dây rồi chọn đáp án cho câu (2 bước).
- R5 Luật khai: lấy từ câu Part 5 / 6 của đề có `lg.og` dạng "loại: nghĩa". Đúng = "Ô trống cần {loại đáp án}: “{đáp án}”." Sai = "Ô trống cần {loại phương án nhiễu}: “{nhiễu}”." chọn nhiễu khác loại với đáp án; không có thì luật soạn sẵn theo phố (`KP_LAW`, Claude soạn 2 cặp / phố). Cư dân thật nói luật đúng của câu khác của đề.
- R6 Ghi kết quả: đúng không gợi ý → `tgJ(de).c[n] = { s: 'ok' }` + lịch ôn phố lên bậc; sai → `s: 'sai'`, hẹn ngày mai. Như `phMark` (`real: 1`). Không ghi đề thử, bản đồ, thẻ Nền.
- R7 Cư dân máy: 6 người lấy từ phố mà đề cần (mỗi phố 1 người, đủ 6 thì thôi, thiếu thì lấy thêm phố khác); tên `PH_PHO[k].CH[t].name`, hình `phFace(t)`.
- R8 Âm thanh: Web Audio tự tổng hợp như bản mẫu, đánh thức bằng `acFix`; tắt được (`S.to.kp.snd`).

## Kiểm (theo hiến pháp / CLAUDE.md)
- Thiết kế giao diện: design-critique trước (chụp Thành phố hiện tại), làm theo biến CSS chung, ux-copy, accessibility-review sau.
- Test mới C99: Thành phố là bản đồ (8 nhà + lâu đài), vào phố ≤ 2 chạm; đêm lấy câu của đề đúng phố; luật sai sinh từ câu đề; ghi ⭐ / lịch ôn đúng khuôn; Hồ sơ bẫy lưu; không đụng thẻ học. Sửa C82 (Thành phố) nếu chữ đổi.
- Chromium khổ 320 px: 0 lỗi trang, 0 tràn ngang, nút ≥ 44 px. Chưa kiểm trên iPhone.
- Phát hành bằng `tools/release.mjs`, ghi đoạn v202 vào CLAUDE.md.

## Model / effort
| Bước | Ai | Model · effort | Vì sao |
|---|---|---|---|
| Thiết kế màn bản đồ ngày + nối vào app, luật khai, ghi kết quả | Phiên chính | Opus · high | Đổi màn chính + ghi tiến độ người học |
| 16 cặp luật soạn sẵn `KP_LAW` | Phiên chính | Opus · medium | Ít, cần đúng kiến thức |
| Chạy test, e2e, đo phủ 16 đề | tho-may | Haiku · low | Việc máy móc |
Không giao Sonnet (không có nội dung hàng loạt). Rủi ro: tốn hạn mức vì việc lớn (~1 phiên dài).
