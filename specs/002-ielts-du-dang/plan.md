# Implementation Plan: IELTS đủ dạng (bài học + bài tập theo từng dạng)

**Branch**: `claude/happy-shannon-5j2r27` | **Date**: 2026-11-07 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/002-ielts-du-dang/spec.md`

## Summary

Đủ 48 dạng của IELTS: +15 bài học (Viết: 5 kiểu Task 2 + 4 tiêu chí chấm; Nói: nhóm thẻ Part 2, kiểu câu hỏi Part 3 + 4 tiêu chí chấm), bài tập theo dạng cho Nghe (6 dạng) và Viết (Task 1 theo 5 loại, Task 2 theo 5 kiểu), sửa bản đồ chữa nhầm bài Nghe (bản đồ, ghép, trả lời ngắn), +1 phần Nghe mặt bằng tòa nhà, +2 bài đọc dài 750–900 từ. Nhãn vai trò đoạn của 12 bài mẫu Task 2 ghi tay trong `content/ielts/viet.json`, kiểm lúc dựng. Nhãn bản ghi dạng: v140, phát hành bản 139. Không đổi luật đo CEFR, cách ước band, ô bản đồ band.

## Technical Context

**Language/Version**: JavaScript thuần trên trình duyệt; Node 22 cho công cụ dựng / test; Python 3 cho giọng (Kokoro, đã cài tạm ở scratchpad).

**Primary Dependencies**: không thêm thư viện.

**Storage**: `ielts.json` dựng từ `content/ielts/*.json` (`tools/build-ielts.mjs`); giọng `n/`; trạng thái người học `S.ie` (`r`, `ty`, `cr`, `w`, `s`), `S.exl`: không đổi lược đồ.

**Testing**: `node tools/build-ielts.mjs` (kiểm nhãn vai trò, phần nghe mới, bài dài), `node tools/test/run.mjs` (test C56 mới + cũ: I1–I4, C46, C47…), Chromium khổ iPhone SE soát sơ bộ.

**Target Platform**: web trên iPhone (Safari / WebKit).

**Project Type**: web app một trang.

**Performance Goals**: `ielts.json` tăng ~15–20 KB.

**Constraints**: bài học cũ giữ mã (`ie:W:w2-type`, `ie:W:w2-struct`, `ie:S:p1`…); không chép đề IELTS; nội dung mới ghi "Claude soạn, chưa giáo viên kiểm".

**Scale/Scope**: 48 dạng · +15 bài học · ~20 nút bài tập theo dạng · 32 câu ví dụ / làm thử tiêu chí · 12 bài mẫu gắn nhãn · 1 phần nghe · 2 bài đọc dài.

## Constitution Check

| Nguyên tắc | Đánh giá | Kết quả |
|---|---|---|
| I. Luật đo | Không chạm 📘 Học / 🔁 Nhớ / Thi chuyển cấp; luyện IELTS không tính; bản đồ band giữ ô và luật. | ✅ |
| II. Kiểm giao diện chỉ trên iPhone | Đổi "Thêm" của màn Nghe / Viết, danh sách bài học dài hơn: design-critique → frontend-design + design-system → ux-copy → accessibility-review; ghi "chưa kiểm trên iPhone". | ✅ (có điều kiện) |
| III. Test xanh trước khi phát hành | Test C56; `tools/release.mjs`. | ✅ |
| IV. Sửa qua nguồn | `content/ielts/*.json` → `build-ielts.mjs`; giọng `build-audio.py`. | ✅ |
| V. Trung thực | Ghi "Claude soạn, chưa giáo viên kiểm"; bảng kiểm giáo viên; không chép đề. | ✅ |

## Project Structure

### Documentation (this feature)

```text
specs/002-ielts-du-dang/
├── spec.md · plan.md · research.md · data-model.md · quickstart.md
├── contracts/ui.md
└── tasks.md
```

### Source Code (repository root)

```text
content/ielts/
├── viet.json    # t2[].roles: nhãn vai trò từng đoạn của 12 bài mẫu
├── nghe.json    # +1 phần Part 2 mặt bằng tòa nhà (il-p2-plan)
└── doc.json     # +2 bài học thuật 750–900 từ
tools/build-ielts.mjs     # kiểm roles = số đoạn; phần nghe / bài đọc mới qua kiểm cũ
baihoc.js                 # XL_TXT.ie: +15 bài; XL_TXT.crit (ví dụ + làm thử tiêu chí); xlIe: ví dụ / làm thử / go theo dạng
ielts.js                  # data-ielk (Nghe theo dạng), data-iew "task:loại" (Viết theo loại / kiểu); Thêm của Nghe / Viết
iemap.js                  # imFix: Nghe bản đồ / ghép / trả lời ngắn dùng phần IELTS có đúng dạng
tools/export-review.mjs · tools/test/run.mjs · huongdan.js · CLAUDE.md · n/ · app.js / index.html / version.json (release)
```

**Structure Decision**: giữ cấu trúc; mở rộng `baihoc.js`, `ielts.js`, `iemap.js`, công cụ dựng.

## Complexity Tracking

Không có vi phạm.
