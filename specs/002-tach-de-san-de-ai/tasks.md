---
description: "Việc cần làm: tách 📚 Đề có sẵn và 🤖 Đề AI"
---

# Việc cần làm: Tách 📚 Đề có sẵn và 🤖 Đề AI

**Đầu vào**: `specs/002-tach-de-san-de-ai/` (spec, plan). **Test**: bắt buộc (C55).
`[USn]` = kịch bản n trong spec: US1 màn 2 nút + 2 phần · US2 nhắc bài có sẵn trong phần 🤖 · US3 đề dự trữ · US4 lối vào khác.

## Phase 1: Chuẩn bị

- [ ] T001 Chụp Chromium khổ iPhone SE màn IELTS, TOEIC, Cambridge của v137; chấm màn (design-critique), ghi 3 vấn đề vào `specs/002-tach-de-san-de-ai/plan.md` mục "Chấm màn"

## Phase 2: US1 — Màn 2 nút + 2 phần (P1) 🎯 MVP

- [ ] T002 [US1] Thêm biến phiên `EX_PART` (`null` | `'san'` | `'ai'`) và bộ bấm `data-expart` (đổi phần, vẽ lại kỳ thi đang mở) trong `toeic.js`; bấm tab 🎯 Luyện đề (`app.js`) và hàng chọn kỳ thi đặt `EX_PART = null`
- [ ] T003 [US1] `xHome` trong `parts.js` 3 chế độ theo `EX_PART`: màn 2 nút (tiêu đề, band / điểm, `btnbig` 📚 "miễn phí · còn N bài chưa làm" + `btnbig ghost` 🤖 "mỗi lần một đề mới · tốn phí AI", dòng nhắc đề AI đã xong / đang soạn, nhắc ⚖️); phần 📚 (nút "‹ Luyện đề", hàng chọn 📚 · 🤖, ô kỹ năng, Thêm, không ô 🤖); phần 🤖 (nút "‹ Luyện đề", hàng chọn, ô đề AI, ô nhắc bài có sẵn)
- [ ] T004 [US1] `ieltsView` (`ielts.js`), `toeicView` (`toeic.js`), `cbView` (`dieuhuong.js`) truyền `k`, số bài có sẵn chưa làm và ô nhắc cho `xHome`
- [ ] T005 [US1] CSS hai nút ở màn chọn trong `index.html` (biến CSS chung, cao ≥ 44 px, 320 px không cắt chữ)

## Phase 3: US2 — Nhắc bài có sẵn trong phần 🤖 (P1)

- [ ] T006 [US2] `daiLeft(k, lv)` trong `deai.js`: số bài có sẵn chưa làm theo kỹ năng (IELTS `ieBai` / `ieRes`, TOEIC `toBai` / `toRes`, Cambridge `cbBai` / `cbRes` theo bài thi); ô nhắc "📚 {kỹ năng}: còn N bài có sẵn chưa làm · miễn phí ›" (bấm: `EX_PART = 'san'` + mở màn kỹ năng) hoặc "đã làm hết bài có sẵn"; dòng "Mỗi đề AI tốn tiền gọi AI" trong ô đề AI
- [ ] T007 [US2] `xSkill` (`parts.js`): dời hàng 🤖 Đề AI mới xuống sau danh sách bài có sẵn; `daiSkRow` ghi "khi làm hết bài có sẵn hoặc muốn bài mới · tốn phí AI"

## Phase 4: US3 + US4 — Đề dự trữ, lối vào (P2)

- [ ] T008 [US3] `daiSave` (`deai.js`): chỉ gọi `daiPrefetch` khi đã có ≥ 2 đề AI cùng kỳ thi + dạng xong trong ngày (tính cả đề vừa xong)
- [ ] T009 [US4] `exGo` (`toeic.js`) đặt `EX_PART = 'san'` trước khi mở; `daiBack`, `data-daihome`, đề AI xong mở phần 🤖 (`EX_PART = 'ai'`); về từ màn kỹ năng giữ phần đang mở

## Phase 5: Test, tài liệu, phát hành

- [ ] T010 Test C55 trong `tools/test/run.mjs`: màn 2 nút (đúng 2 `btnbig`, không `data-daigo`), phần 📚 không có `data-daigo`, phần 🤖 có ô AI + ô nhắc số bài, nút "‹ Luyện đề", đề dự trữ chỉ sau đề AI thứ 2 cùng dạng trong ngày, Hôm nay mở phần 📚; sửa I1, C13, C27, C29, C37, C50, C53, T1 (đặt `EX_PART = 'san'` / `'ai'` khi cần) và `tools/test/e2e-webkit.mjs`
- [ ] T011 Kiểm khả năng tiếp cận màn 2 nút + 2 phần (vùng bấm, tương phản, 320 px); ghi trước / sau
- [ ] T012 `huongdan.js` mục 5 tab + luyện thi; `CLAUDE.md` đoạn v138; `README.md`; `graphify update . && python3 tools/graph-vung.py`
- [ ] T013 `node tools/release.mjs` (v138), commit, push nhánh `claude/ecstatic-curie-q9g1ja`

## Phụ thuộc

T001 → T002 → T003 → T004 / T005 → T006 / T007 → T008 / T009 → T010 → T011 → T012 → T013. MVP = Phase 1–2.
