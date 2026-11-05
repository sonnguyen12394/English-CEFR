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
