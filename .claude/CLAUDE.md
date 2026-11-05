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
