---

description: "Chia việc: IELTS đủ dạng"
---

# Tasks: IELTS đủ dạng (bài học + bài tập theo từng dạng)

**Input**: Design documents from `specs/002-ielts-du-dang/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/ui.md, quickstart.md

**Tests**: có (hiến pháp III) → test C56 trong `tools/test/run.mjs` + kiểm lúc dựng trong `tools/build-ielts.mjs`.

**Organization**: US1 Task 2 theo kiểu · US2 bài tập theo dạng + sửa bản đồ · US3 tiêu chí chấm · US4 Nói nhóm thẻ / kiểu câu hỏi · US5 phần nghe mặt bằng · US6 bài đọc dài.

## Format: `[ID] [P?] [Story] Description`

---

## Phase 1: Setup

- [X] T001 Kiểm bộ đọc giọng Kokoro tạm còn dùng được (venv + mô hình ở scratchpad), không commit

---

## Phase 2: Foundational

- [X] T002 Ghi nhãn vai trò `roles` cho 12 bài mẫu Task 2 trong content/ielts/viet.json (đọc từng đoạn, nhãn đúng nội dung: "Mở bài…", "Thân bài 1: …", "Kết luận…"); tools/build-ielts.mjs kiểm "số nhãn = số đoạn; nhãn không rỗng"
- [X] T003 Dựng ielts.json (`node tools/build-ielts.mjs`); `node tools/test/run.mjs` vẫn xanh

---

## Phase 3: User Story 1 - Task 2 từng kiểu có bài học riêng (P1) 🎯 MVP

**Goal**: 5 bài học Task 2 theo kiểu đề.

**Independent Test**: mỗi bài: ví dụ là bài mẫu đúng kiểu có nhãn vai trò; làm thử 3 câu nhận vai trò đoạn của bài mẫu khác cùng kiểu.

- [X] T004 [US1] Viết 5 bài học `w2-op`, `w2-dis`, `w2-ad`, `w2-ps`, `w2-tq` (sau `w2-type`) trong XL_TXT.ie.W ở baihoc.js: dạng này là gì, nhận ra đề thế nào, bố cục riêng, bẫy
- [X] T005 [US1] xlIeW ở baihoc.js: bài theo kiểu → ví dụ = bài mẫu cuối của kiểu, đoạn ghi nhãn `roles`; làm thử = 3 câu "Đoạn này làm nhiệm vụ gì?" lấy đoạn bài mẫu khác cùng kiểu, phương án = nhãn của kiểu đó (không trùng); `go` = `data-iew="t2:<kiểu>"`

---

## Phase 4: User Story 2 - Mỗi dạng có bài tập riêng (P1)

**Goal**: bài tập đúng dạng cho Nghe (6), Viết Task 1 (5 loại), Task 2 (5 kiểu); bản đồ chữa Nghe đúng phần.

**Independent Test**: bấm bài tập ở mỗi bài học / nút Thêm → đề / phần nghe đúng dạng; chữa "Nghe trả lời ngắn" mở phần có trả lời ngắn.

- [X] T006 [US2] ielts.js: `data-ielk="<dạng>"` (nhóm form = form / tab / flow, sent = sent / sa, mc, mc2, map, match) chọn phần nghe IELTS có dạng đó, chưa làm / làm lâu nhất trước, làm cả phần (`ieRun`, ghi như luyện thường); `data-iew="t1:<loại,…>"` / `"t2:<kiểu>"` chọn đề đúng loại / kiểu (đề viết lâu nhất trước)
- [X] T007 [US2] baihoc.js xlIe: `go` của 6 bài học Nghe → `data-ielk`, của 5 bài Task 1 → `data-iew="t1:<loại>"`, thư GT → `gt1`, nhận kiểu đề / bố cục → `t2`
- [X] T008 [US2] iemap.js imFix: L-map / L-match / L-sa dùng phần nghe IELTS trong `imPool(u)` (mới trước), làm cả phần; L-form / L-mc như cũ
- [X] T009 [US2] Thêm của màn Nghe (6 nút `.big2` `data-ielk`) và màn Viết (hàng Task 1 theo loại, chỉ Academic; hàng Task 2 theo kiểu; `.chips.tap`) trong ielts.js ieSkView: design-critique trước (Chromium khổ iPhone SE) → frontend-design + design-system → ux-copy → accessibility-review sau

---

## Phase 5: User Story 3 - Bài học 4 tiêu chí chấm Viết / Nói (P2)

**Goal**: 8 bài học tiêu chí nối ô bản đồ.

**Independent Test**: đặt ô "Viết · Mạch lạc" yếu → bài "Mạch lạc" lên đầu, ghi "yếu"; mỗi bài có ví dụ band thấp / cao và 3 câu làm thử.

- [X] T010 [P] [US3] Soạn `XL_TXT.crit` trong baihoc.js: 8 mục (W: hoàn thành đề, mạch lạc, vốn từ, ngữ pháp; S: trôi chảy, vốn từ, ngữ pháp, phát âm), mỗi mục `ex { lo, hi, why }` + 3 câu `mcq { q, a, w, why }`
- [X] T011 [US3] 8 bài học `wc-tr`, `wc-cc`, `wc-lr`, `wc-gr` (W, `u` W-0…W-3) và `sc-fc`, `sc-lr`, `sc-gr`, `sc-pr` (S, `u` S-0…S-3) trong XL_TXT.ie + xlIe dựng ví dụ / làm thử từ `XL_TXT.crit`; `go` Viết → `data-iew="t2"`, Nói → `data-ies="all"`

---

## Phase 6: User Story 4 - Nói nhóm thẻ Part 2, kiểu câu hỏi Part 3 (P3)

- [X] T012 [US4] `IE_P2CAT` (nhóm thẻ theo tiêu đề) và `IE_P3TY` (kiểu câu hỏi) + 2 bài học `p2-cat` (sau `p2`), `p3-q` (sau `p3`) trong baihoc.js; làm thử = nhận nhóm / kiểu của thẻ / câu thật; `go` → `data-ies="p2"` / `"p3"`

---

## Phase 7: User Story 5 - Phần nghe mặt bằng (P3)

- [X] T013 [P] [US5] Soạn phần Part 2 `il-p2-plan` (mặt bằng tòa nhà, 5 câu mặt bằng chữ A–H + 5 trắc nghiệm) trong content/ielts/nghe.json; dựng ielts.json; giọng Kokoro (`python -I tools/build-audio.py <mô hình> 4`)

---

## Phase 8: User Story 6 - Bài đọc dài (P3)

- [X] T014 [P] [US6] Soạn 2 bài học thuật 750–900 từ, 13–14 câu, ≥ 3 dạng mỗi bài trong content/ielts/doc.json; dựng ielts.json (kiểm như bài cũ)

---

## Phase 9: Polish

- [X] T015 Test C56 trong tools/test/run.mjs: 48 dạng (danh sách bài học AC / GT, mã cũ còn), ví dụ + ≥ 3 làm thử đúng dạng, nhãn vai trò, bài tập đúng loại / kiểu / dạng nghe, imFix Nghe đúng phần, nhóm Part 2 / kiểu Part 3 phủ hết kho, kho: ≥ 2 phần bản đồ, ≥ 2 bài đọc 750–900 từ, giọng phần mới đủ
- [X] T016 [P] Bảng kiểm giáo viên mục v140 (nhãn vai trò, tiêu chí, phần nghe, bài đọc dài; bài học mới đọc từ XL_TXT) trong tools/export-review.mjs → docs/kiem-noi-dung.html
- [X] T017 [P] 📘 Luật mục luyện thi: câu về IELTS theo dạng trong huongdan.js
- [X] T018 `node tools/test/run.mjs` xanh; soát Chromium theo quickstart.md; `graphify update . && python3 tools/graph-vung.py`
- [X] T019 Đoạn v140 trong CLAUDE.md; `node tools/release.mjs` (bản 139) → commit → push nhánh claude/happy-shannon-5j2r27

---

## Dependencies & Execution Order

- Phase 2 (nhãn vai trò) chặn US1. US2, US3, US4 độc lập với nhau sau Phase 2. US5, US6 là nội dung, làm song song.
- Thứ tự làm thực tế: T001–T003 → T013, T014, T010 (nội dung, song song) → T004–T005 → T006–T009 → T011–T012 → T015–T019.

## Parallel Opportunities

- T010, T013, T014 (nội dung khác tệp) song song; T016, T017 song song.

## Implementation Strategy

- MVP: US1 + US2 (Task 2 theo kiểu, bài tập đúng dạng, sửa bản đồ).
- Rồi US3 (tiêu chí), US4, US5, US6; cuối cùng Polish + phát hành bản 139.
- Mốc dừng: build-ielts hoặc C56 đỏ ở dạng nào thì sửa dạng đó trước; không phát hành khi test đỏ.
