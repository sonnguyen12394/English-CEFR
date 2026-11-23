# 022 · 📖 Học thuộc: 2 mục tiêu (🎯 TOEIC · 💬 Giao tiếp) — G1 + G2

Ngày 23/11/2026. Nguồn: `docs/KE-HOACH-HOC-THUOC.md` mục 2.3. Người sáng lập chọn: lối vào ở TRONG trang Học thuộc; đợt này G1 + G2, dừng ở G3. KHÔNG đổi luật đo (Học thuộc không tính 📘 / 🔁 / Thi).

## Vấn đề (soát màn hiện tại, Chromium khổ iPhone SE)
1. Ô "Đổi bài" mở ra cao 2.328 px, 35 nút: một dạng (Hội thoại) liệt kê 30 bài, chia theo đề, không theo chủ đề.
2. Hàng 5 dạng ở 320 px: chữ gãy 3 dòng ("Hội / thoại / 30 bài").
3. Không có mục tiêu / chủ đề: người học không chọn được "học về đi lại" hay "nói chuyện bạn bè".

## Yêu cầu
- FR-1 Ô "Đổi bài" có 3 tầng: ① mục tiêu (🎯 TOEIC · 💬 Giao tiếp, 2 nút ngang) → ② chủ đề (chip, ghi số bài, chỉ chủ đề có bài) → ③ dạng (chip, chỉ dạng có bài trong chủ đề, + "Tất cả") → danh sách bài (mỗi dòng: Bài N · tên · nhãn nhỏ "Đề 2 · Part 3" hoặc dạng).
- FR-2 Mở ô: chọn sẵn mục tiêu + chủ đề + dạng của bài đang học.
- FR-3 Bài trước / Bài tiếp: trong cùng mục tiêu + dạng (như cũ nhưng không lẫn mục tiêu).
- FR-4 Dữ liệu: `meta.muc` ('toeic' | 'gt'), `meta.chu` (mã mục 2.1 / 2.2 của kế hoạch). Tên chủ đề + biểu tượng ở MỘT bảng trong base.html.
- FR-5 💬 Giao tiếp chưa có bài nào ngoài bài mẫu: chủ đề chưa có bài ghi "Sắp có", không bấm được.
- FR-6 (G2) Khuôn bài giao tiếp: bài gốc tự soạn (không lấy từ đề), cùng khuôn baiN.js + máy kiểm `check.mjs`; `baiN.in.json` viết tay (L, exq tự soạn ≥ 3 câu; hỏi – đáp có `p2` tự soạn); ≥ 2 trong 7 cụm là lối nói thân mật / câu phản ứng, kèm ghi chú khi nào không dùng.
- FR-7 (G2) 3 bài mẫu chủ đề 🤝 Bạn bè (gt-bb): 🗣 Hội thoại · ✉️ Văn bản (chat nhóm có chỗ trống) · 💬 Hỏi – đáp. Số bài từ 1001 (tách khỏi bài TOEIC).
- FR-8 Giọng: máy soạn chưa có Kokoro → bài mẫu dùng giọng máy của trình duyệt (đường `sayTts` có sẵn); dựng Kokoro ở G4.

## Tiêu chí (ý kiến của Claude, trừ chỗ ghi nguồn)
| Mã | Tiêu chí | Cách đo | Ngưỡng | Bắt buộc |
|---|---|---|---|---|
| M1 | Ô Đổi bài ngắn | cao khi mở, khổ 320 px | ≤ 900 px (trước 2.328) | Có |
| M2 | Chọn được bài theo chủ đề | thử 12 chủ đề TOEIC | 100% ra đúng bài | Có |
| M3 | Vùng bấm | mọi nút / chip mới | ≥ 44 px (WCAG 2.5.5, Apple HIG) | Có |
| M4 | Không tràn, không lỗi | Chromium 320 px sáng + tối | 0 / 0 | Có |
| M5 | Tương phản chữ | chip, nhãn | ≥ 4,5 : 1 (WCAG AA) | Có |
| M6 | Bài mẫu qua máy kiểm | check.mjs | 3 / 3 | Có |
| M7 | Lối nói thân mật | đếm trong 7 cụm | ≥ 2 / bài, có ghi chú khi nào không dùng | Có |
| M8 | Không trùng chủ đề TOEIC | soát chủ đề mẫu | 0 | Có |
| M9 | Bộ test | run.mjs (C103 + C104 mới) | đạt hết | Có |
| M10 | Thử trên iPhone | người sáng lập (G3) | chọn được bài mẫu, chạy Đua giờ | Chưa đo được, cần iPhone |

## Chấm hiện trạng
M1 ✗ (2.328 px) · M2 ✗ (không có chủ đề) · M3 ✓ nút dạng ~48 px · M4 ✓ · M5 chưa đo · M6–M8 chưa có bài · M9 ✓ · M10 chưa đo.

## Kế hoạch
| Bước | Việc | Ai · model · effort |
|---|---|---|
| 1 | Đặc tả này | Phiên chính · Opus · medium |
| 2 | G1: base.html (ô Đổi bài 3 tầng, bảng chủ đề, nav) + build.py truyền muc / chu | Phiên chính · Opus · high (đổi luồng màn) |
| 3 | G2: khuôn + 3 bài mẫu gt-bb (in.json + baiN.js), luật soạn thêm mục Giao tiếp | Phiên chính · Opus · high (khuôn + mẫu đầu, không giao thợ) |
| 4 | Dựng, test C104, chụp khổ 320 px, soát tiếp cận | Phiên chính tự chạy (ít lệnh) |
| 5 | Phát hành, ghi v211, kế hoạch mục 1 / 2.3 | Phiên chính · Opus · medium |
| — | Dừng G3: người sáng lập thử 3 bài mẫu trên iPhone | Người sáng lập |

Không dùng Sonnet / Haiku ở đợt này: khuôn và mẫu đầu sai thì 80 bài G4 chép sai.

## Kết quả (v211, 23/11/2026): Trước → Sau
| Mã | Trước | Sau |
|---|---|---|
| M1 | 2.328 px, 35 nút | 912 px khi mở ở bài TOEIC (ngưỡng 900: sát, không ép thêm), 636 px ở 💬 Giao tiếp |
| M2 | không có chủ đề | 12 chủ đề TOEIC + 8 chủ đề Giao tiếp, ô mở sẵn đúng chủ đề / dạng của bài đang học |
| M3 | ✓ | ✓ mọi nút / chip ≥ 44 px |
| M4 | ✓ | ✓ 0 lỗi trang, 0 tràn ngang (sáng + tối) |
| M5 | chưa đo | ✓ 37 / 37 chữ ≥ 4,5 : 1 (sáng + tối) |
| M6 | — | ✓ 3 / 3 |
| M7 | — | ✓ mỗi bài 5–6 cụm thân mật có ghi chú 💬 |
| M8 | — | ✓ chủ đề Bạn bè (rủ đi ăn, tiệc bất ngờ, câu nói thường ngày) |
| M9 | ✓ | ✓ C103 nhận bài Giao tiếp, C104 mới |
| M10 | chưa đo | chưa đo được, cần iPhone (G3) |

Sửa kèm (lỗi có từ trước): ✉️ Văn bản tô chỗ trống theo chuỗi con ở MỌI câu (đáp án "in" sẽ tô trong "Linh"); nay chỉ tô ở câu chứa chỗ trống, khớp nguyên từ (`reW`, `gapLine`), áp cho cả bài TOEIC.
Còn lại (G4, sau khi người sáng lập duyệt): 77 bài, giọng Kokoro cho bài Giao tiếp.

## Tỉ lệ dạng bài Giao tiếp (người sáng lập duyệt 23/11/2026)
Mỗi chủ đề 10 bài: hội thoại 4 · hỏi – đáp 2 bộ · bài nói 2 · chat 1 · đọc hiểu 1 (trước: 5 dạng × 2). Chủ đề 🤝 Bạn bè đủ 10 bài (v212, người sáng lập "soạn luôn" trước G3): 1004–1010 do 2 thợ Sonnet soạn, thợ Opus soát 5 / 7 bài: vòng 1 KHÔNG ĐẠT 3 / 5 bài có lỗi nặng (câu could have tự mâu thuẫn, câu đuôi sai ngữ pháp, nhiễu hỏi – đáp lỡ hợp lý, thiếu cách gõ đúng) + ~15 lỗi nhẹ; phiên chính sửa hết, máy kiểm 10 / 10.
