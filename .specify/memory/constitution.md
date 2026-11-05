# Hiến pháp English-CEFR

Các nguyên tắc dưới đây chép lại từ `CLAUDE.md` (luật người sáng lập đã đặt). Khi hai nơi khác nhau, `CLAUDE.md` thắng; sửa luật thì sửa `CLAUDE.md` trước rồi cập nhật tệp này.

## Nguyên tắc cốt lõi

### I. Luật đo là của người sáng lập
📘 Học / 🔁 Nhớ / Thi chuyển cấp chỉ đổi khi người sáng lập duyệt. Mọi đặc tả (spec) chạm vào cách tính tiến độ, cổng thi, ngưỡng nhớ phải ghi rõ "ĐỔI LUẬT ĐO" và dừng chờ duyệt trước khi lập kế hoạch.

### II. Kiểm giao diện chỉ trên iPhone
Giao diện chỉ được coi là đã kiểm khi thử trên iPhone (WebKit). Máy soạn không chạy được WebKit thì ghi "chưa kiểm trên iPhone"; Chromium khổ iPhone chỉ là kiểm sơ bộ. Đổi giao diện theo luật thiết kế trong `.claude/CLAUDE.md` (design-critique → frontend-design / design-system → ux-copy → accessibility-review).

### III. Test xanh trước khi phát hành (không thương lượng)
`node tools/test/run.mjs` phải qua hết; phát hành bằng `node tools/release.mjs` (tăng `APP_V`, `?v=`, `version.json` cùng một số). Tính năng mới có test riêng (đánh số C…, I…, T…).

### IV. Dữ liệu sửa qua nguồn, không sửa tay tệp dựng
Không sửa tay `a1.json`, `a2.json`, `b.json`, `uoe.json`, `ielts.json`, `toeic.json`, `pa.json`; sửa `content/*` rồi chạy công cụ dựng tương ứng (`tools/fix-pre.mjs`, `build-b.mjs`, `build-uoe.mjs`, `build-ielts.mjs`, `build-toeic.mjs`, `build-bac.mjs`…). Đổi câu nghe thì dựng lại giọng bằng `tools/build-audio.py`.

### V. Trung thực về độ tin cậy
Nội dung Claude soạn ghi "chưa giáo viên kiểm". Không chép đề Cambridge / IELTS / ETS (bản quyền). Danh sách Oxford không commit. Máy chấm chưa đối chiếu người thật thì chỉ tham khảo.

## Ràng buộc kỹ thuật
- Web app JS thuần, không bước build; CSS trong `index.html`; dữ liệu học trên Supabase (RLS, tài khoản ẩn danh mỗi máy).
- Viết tiếng Việt có dấu, câu ngắn, trong giao diện và tài liệu.
- Trước khi sửa mã: tra bản đồ `graphify query`, liệt kê phần bị ảnh hưởng.

## Quy trình làm việc
- Spec Kit (`/speckit-specify` → `/speckit-clarify` → `/speckit-plan` → `/speckit-tasks` → `/speckit-implement`) dùng cho tính năng MỚI hoặc thay đổi lớn (nhiều tệp, đổi luồng màn, đổi dữ liệu). Sửa nhỏ, sửa lỗi, sửa chữ thì làm thẳng.
- Góp ý người dùng (bảng `gopy`): chọn vai trò chuyên môn phù hợp để phản biện trước, rồi mới làm.
- Mỗi bản phát hành ghi một đoạn vN vào `CLAUDE.md`.

## Quản trị
Hiến pháp này phục vụ `CLAUDE.md`, không thay thế nó. Sửa đổi cần người sáng lập đồng ý.

**Version**: 1.0.0 | **Ratified**: 2026-11-05 | **Last Amended**: 2026-11-05
