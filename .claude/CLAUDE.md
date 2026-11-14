# graphify
- **graphify** (`.claude/skills/graphify/SKILL.md`) - any input to knowledge graph. Trigger: `/graphify`
When the user types `/graphify`, use the installed graphify skill or instructions before doing anything else.

# Thiết kế giao diện (chép từ Anthropic, xem `.claude/skills/NGUON-THIET-KE.md`)
- `/design-critique` chấm màn · `/accessibility-review` khả năng tiếp cận · `/design-system` chuẩn hoá màu / chữ / khoảng cách · `/frontend-design` làm đẹp thành phần · `/ux-copy` chữ trên nút, câu giải thích · `/user-research`, `/research-synthesis` hỏi và tổng hợp ý người học thật.
- Vẫn theo luật trong CLAUDE.md gốc: kiểm giao diện chỉ trên iPhone; đổi luật đo phải hỏi người sáng lập.
- LUẬT (người sáng lập 5/11/2026): mọi việc đổi giao diện (màn, nút, CSS, bố cục) PHẢI dùng kỹ năng, không cần người sáng lập gõ lệnh:
  1. Trước khi sửa: `design-critique` màn sẽ đổi (chụp Chromium khổ iPhone SE), nêu 3 vấn đề chính.
  2. Khi sửa: theo `frontend-design` + `design-system` (dùng biến CSS chung, không thêm màu / cỡ chữ lẻ).
  3. Chữ trên nút, câu giải thích: theo `ux-copy` (tiếng Việt có dấu, câu ngắn).
  4. Sau khi sửa: `accessibility-review` nhanh (tương phản, vùng bấm ≥ 44 px, cỡ chữ), báo kết quả trước / sau.
  Việc nhỏ (sửa 1 chữ, 1 màu) thì chỉ bước 2–3. Vẫn ghi "chưa kiểm trên iPhone" nếu chưa thử máy thật.

# Spec Kit (github.com/github/spec-kit, MIT, commit ec9a6f3, cài 5/11/2026)
- Lệnh: `/speckit-specify` viết đặc tả · `/speckit-clarify` hỏi chỗ thiếu · `/speckit-plan` kế hoạch · `/speckit-tasks` chia việc · `/speckit-implement` làm · `/speckit-analyze`, `/speckit-checklist` soát. Hiến pháp: `.specify/memory/constitution.md` (chép từ CLAUDE.md).
- Chỉ dùng cho tính năng MỚI hoặc thay đổi lớn; sửa nhỏ làm thẳng. Đặc tả đổi luật đo phải dừng chờ người sáng lập duyệt.

# TỰ DÙNG CÔNG CỤ (người sáng lập 5/11/2026: "tôi không biết xài lệnh, tự biết sử dụng")
Người sáng lập chỉ nói việc bằng lời thường, KHÔNG gõ lệnh `/...`. Claude tự chọn và chạy công cụ, không bảo người sáng lập gõ lệnh:
1. Mọi việc chạm mã: tra `graphify query` trước, báo ngắn "sửa X đụng tới: …" trước khi sửa.
2. Việc LỚN = tính năng mới, màn mới, đổi luồng màn, đổi dữ liệu / nội dung hàng loạt, sửa ≥ 3 tệp, hoặc đổi luật đo → tự chạy Spec Kit theo thứ tự: speckit-specify → speckit-clarify (hỏi người sáng lập tối đa 5 câu bằng lời thường, có phương án gợi ý) → speckit-plan → speckit-tasks → báo kế hoạch ngắn, chờ "ok" → speckit-implement. Đổi luật đo: dừng chờ duyệt ở bước đặc tả.
3. Việc NHỎ (sửa lỗi, sửa chữ, 1–2 tệp) → làm thẳng, không Spec Kit.
4. Việc giao diện → luật thiết kế ở trên (design-critique → frontend-design / design-system → ux-copy → accessibility-review).
5. Khi báo lại: nói bằng lời thường đã làm gì, không liệt kê tên lệnh trừ khi được hỏi.

# Tự giao việc cho thợ (sub agent) để tiết kiệm hạn mức (người sáng lập 14/11/2026)
Người sáng lập không gõ lệnh: Claude tự chọn thợ theo BẢNG dưới (xếp từ các loại việc đã làm ở v86 → v173). 4 thợ ở `.claude/agents/`.

## Bảng chọn nhanh: việc → ai làm
| Loại việc (ví dụ đã làm) | Ai làm | Model |
|---|---|---|
| Hỏi người sáng lập, phản biện, kế hoạch, Spec Kit (specify / clarify / plan / tasks) | Phiên chính | Opus |
| Đổi luật đo, thiết kế màn / luồng mới (v97, v101, v112, v118, v122, v133–v134, v141–v142) | Phiên chính (effort high) | Opus |
| Máy chủ Supabase, edge function, migration, bảo mật, dữ liệu người dùng (v141, v157–v161) | Phiên chính | Opus |
| Sửa lỗi khó / lỗi chập chờn, gộp nhánh, phát hành, viết đoạn vXXX vào CLAUDE.md | Phiên chính | Opus |
| Nghĩ KHUÔN mới + làm 2–3 MẪU đầu (lời giải `lg` v156, bài học kỳ thi v131, dạng đề mới v129) | Phiên chính | Opus |
| Rà / kiểm kê tìm lỗi, tìm chỗ thiếu: nội dung (v115), dạng đề (v123, v129, v132, v139–v140, v143), đề AI so đề thật (v144) | `soat-lai` → danh sách lỗi | Opus |
| Soát đầu ra của `soan-theo-khuon` (≥ 10%, ít nhất 5 mục) | `soat-lai` | Opus |
| Soạn hàng loạt theo khuôn + mẫu đã duyệt, từ ~20 mục: lời giải `lg` (v156), câu / bài cùng dạng (Part 5–7, bài Đọc / Nghe Nền v125, câu suy luận v103), từ công sở (v124), bài học `XL_TXT` theo mẫu (v131, v139–v140), sửa theo danh sách lỗi đã có (v115), kho đề soạn sẵn (v145) | `soan-theo-khuon` | Sonnet |
| Đề thử TOEIC trọn mới (v149–v154): soạn theo `docs/TIEU-CHI-DE-TOEIC.md` + sổ lỗi | `soan-theo-khuon` → `tho-may` (build, kiem-toeic) → `giai-mu` → `soat-lai` | Sonnet / Haiku / Sonnet / Opus |
| Giải đề mù (phiếu `tools/giai-mu.mjs xuat`, không xem đáp án) | `giai-mu` | Sonnet |
| Chạy test `tools/test/run.mjs`, e2e, `tools/release.mjs` (chỉ báo kết quả), bộ dựng `tools/build-*.mjs`, `tools/kiem-toeic.mjs`, `tools/export-review.mjs`, giọng `tools/build-audio.py`, `graphify update`, đếm / thống kê kho, chạy sẵn script chụp màn / đo px rồi báo số | `tho-may` | Haiku |
| Sửa 1–2 tệp, sửa chữ, việc phiên chính đã có sẵn ngữ cảnh, dưới ~5 phút | Phiên chính tự làm (không giao) | Opus |

## Quy trình mẫu
- Thêm nội dung theo khuôn: phiên chính làm khuôn + mẫu → `soan-theo-khuon` soạn → `tho-may` dựng + kiểm → `soat-lai` soát (sai > 1/10 thì `soan-theo-khuon` làm lại đợt đó) → phiên chính đọc thêm 2–3 mục, commit, phát hành.
- Rà lỗi lớn: `soat-lai` lập danh sách lỗi → phiên chính chọn lỗi sửa (hỏi người sáng lập nếu đổi luật) → `soan-theo-khuon` sửa theo danh sách → `tho-may` kiểm.
- Việc giao diện: phiên chính làm cả (luật thiết kế ở trên); `tho-may` chỉ chạy script chụp / đo.

## Luật chung
1. Thợ bắt đầu từ trắng: lời giao việc phải tự đủ (mục tiêu, tệp được sửa, khuôn + mẫu, lệnh kiểm, tiêu chí xong, nhắc luật graphify).
2. Không giao việc nhỏ (bảng dòng cuối): giao còn tốn hạn mức hơn tự làm.
3. Thợ không commit, không push, không phát hành, không đổi luật đo; chỉ phiên chính làm.
4. Nội dung giảng dạy không bao giờ giao Haiku.
5. Báo người sáng lập ngắn: việc nào giao thợ nào, kết quả soát.
6. Bảng này là ý kiến của Claude: sau 1–2 tuần, thợ nào hay sai (soát KHÔNG ĐẠT ≥ 2 đợt liền) thì chuyển loại việc đó về phiên chính và sửa bảng.
