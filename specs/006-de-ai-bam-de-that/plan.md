# Implementation Plan: Đề AI bám cấu trúc đề thật

**Branch**: `claude/ecstatic-curie-q9g1ja` | **Date**: 2026-11-07 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/006-de-ai-bam-de-that/spec.md`

## Summary

Đề AI (tab 🎯 Luyện đề → 🤖) đang là "bài luyện ngắn theo dạng", lệch đề thật ở số câu, độ dài, thứ tự câu, số lựa chọn, giới hạn từ, và có dạng không có trong đề thật (Starters / Movers). Sửa bảng khuôn của hàm máy chủ `de-ai` theo đề thật từng kỳ thi × cấp ([data-model.md](data-model.md)), máy kiểm xếp câu theo thứ tự bài và kiểm câu trích / câu chèn / biểu đồ, thêm 11 dạng (IELTS 5, Cambridge 6), bỏ 3 dạng ngoài đề thật ở Pre-A1 / A1; trang hiện tên phần đề thật, vẽ biểu đồ Task 1, đề cũ vẫn mở. Không đổi luật đo.

## Technical Context

**Language/Version**: JavaScript trên trình duyệt (trang, không bước dựng); TypeScript + JS trên Deno (hàm máy chủ Supabase Edge Functions)

**Primary Dependencies**: `npm:@anthropic-ai/sdk@1.3.0` (đầu ra có khuôn bằng Zod `zod@4.6.7`), Supabase JS; trang dùng bộ chạy câu hỏi có sẵn `ieRun` (ielts.js), bộ vẽ `ieChart`

**Storage**: bảng `de_ai` (jsonb `de`, không đổi cột), `S.dai` trên máy người học

**Testing**: `node tools/test/run.mjs` (máy DOM giả + `tools/test/fake-sb.js`); test mới C61 chạy `khuon.js` bằng node; e2e Chromium khổ iPhone (không thay kiểm iPhone)

**Target Platform**: Safari / Chrome trên iPhone; Supabase Free (hàm máy chủ ≤ 150 giây)

**Project Type**: ứng dụng web một trang + hàm máy chủ

**Performance Goals**: đề soạn xong trong ≤ 140 giây (giới hạn cũ); đề Đọc IELTS dài ~2 lần đầu ra cũ

**Constraints**: trần 200 lượt AI / ngày cả app; không chép đề thật; chưa có khoá AI nên chỉ kiểm bằng máy chủ giả

**Scale/Scope**: ~45 dạng đề AI (IELTS 18, TOEIC 6, Cambridge ~21 theo cấp)

## Constitution Check

| Nguyên tắc | Đánh giá |
|---|---|
| I. Luật đo là của người sáng lập | ✅ Không đổi. Đề AI không tạo thẻ, không tính 📘 / 🔁 / Thi; bản đồ kỳ thi chỉ thêm dạng câu đã có khoá |
| II. Kiểm giao diện chỉ trên iPhone | ⚠️ Máy soạn không có WebKit: thử Chromium khổ iPhone, ghi "chưa kiểm trên iPhone" |
| III. Test xanh trước khi phát hành | ✅ C61 mới, sửa C57; `tools/release.mjs` chặn khi đỏ |
| IV. Dữ liệu sửa qua nguồn | ✅ Không có tệp dựng nào bị sửa tay |
| V. Trung thực về độ tin cậy | ✅ Nhãn "AI soạn, chưa giáo viên kiểm" giữ; số trong bảng khuôn chưa tra được nguồn ghi "hiểu biết"; chi phí ghi là ước |

Sau thiết kế: không vi phạm, không cần mục Complexity Tracking.

## Project Structure

### Documentation (this feature)

```text
specs/006-de-ai-bam-de-that/
├── spec.md · plan.md · research.md · data-model.md · quickstart.md
├── contracts/de-ai-khuon.md
├── checklists/requirements.md
└── tasks.md (speckit-tasks)
```

### Source Code (repository root)

```text
supabase/functions/de-ai/
├── khuon.js     # MỚI: bảng khuôn theo đề thật (KHUON / TY), spec(), clean(), xếp thứ tự, kiểm trích / chèn / biểu đồ (JS thuần, Deno + node)
├── index.ts     # SỬA: nhập spec / clean từ khuon.js; khuôn Zod `task.chart`; lời nhắc theo nhóm dạng; de.v 2 + part
├── chude.js     # SỬA: chủ đề theo Part (Nghe Part 1 / 2 đời thường, Part 3 / 4 học thuật)
└── trung.js     # giữ
deai.js          # SỬA: daiDangs theo cấp + tên phần đề thật, daiSks bỏ kỹ năng rỗng, tên dạng cũ, Task 1 chart → ieChart, tên đề = de.part
huongdan.js      # SỬA: đoạn 🤖 đề AI (theo khuôn đề thật)
tools/test/run.mjs, fake-sb.js, e2e-webkit.mjs   # C61 mới, sửa C57, e2e theo danh sách dạng mới
CLAUDE.md, README.md                             # đoạn v144
```

**Structure Decision**: giữ cấu trúc hiện có; chỉ thêm `khuon.js` để test chạy được bảng khuôn (research D1).

## Triển khai

- Hàm máy chủ `de-ai` triển khai lại bằng công cụ Supabase (4 tệp). Khoá AI chưa có nên đề mới chưa soạn được cho tới khi người sáng lập cài khoá; triển khai không ảnh hưởng người dùng.
- Trang: `node tools/release.mjs` → bản 142, gộp `main` để lên web khi người sáng lập bảo.
