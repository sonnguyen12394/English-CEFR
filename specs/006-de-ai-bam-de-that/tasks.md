# Tasks: Đề AI bám cấu trúc đề thật

**Input**: specs/006-de-ai-bam-de-that/ (plan.md, spec.md, data-model.md, research.md, contracts/de-ai-khuon.md, quickstart.md)

**Tests**: bắt buộc (hiến pháp III; FR-013): test mới C61, sửa C57, e2e.

## Format: `[ID] [P?] [Story] Description`

## Phase 1: Setup

- [ ] T001 Tạo `supabase/functions/de-ai/khuon.js` (JS thuần, `export`): chuyển `KY`, `CEFR`, `TFNG`, `YNNG`, `LETTERED`, `IE_R`, `IE_L`, `spec()`, `clean()`, `wc()` từ `supabase/functions/de-ai/index.ts`; `index.ts` nhập lại; hành vi chưa đổi (C57, C58 vẫn xanh)

## Phase 2: Foundational

- [ ] T002 `khuon.js`: luật theo dạng câu `TY` (nhãn cố định, số lựa chọn, giới hạn từ, đáp án có trong bài, theo thứ tự, lựa chọn chung của nhóm); `clean()` áp luật theo `gr.ty` thay cho cả đề; `de.v = 2`, `de.part`
- [ ] T003 `khuon.js`: xếp câu theo vị trí `ev` trong bài / lời nghe cho dạng "theo thứ tự" (giữ chỗ câu không định vị được; nhóm xếp theo câu đầu)
- [ ] T004 `khuon.js`: phần trích trong ngoặc kép của câu hỏi phải có nguyên văn trong bài / lời nghe, không thì bỏ câu; câu chèn "[1]…[4]" cần bài có đủ `[1] [2] [3] [4]`, không thì bỏ câu
- [ ] T005 [P] `tools/test/run.mjs`: khung C61 nhập `khuon.js` bằng node; test xếp thứ tự, câu trích, câu chèn với đề giả

## Phase 3: User Story 1 - IELTS giống một bài / một Part đề thật (P1) 🎯 MVP

**Independent Test**: C61 kiểm khuôn IELTS; C57 làm hết một đề giả Đọc v2 và Nghe Part 4.

- [ ] T006 [US1] `khuon.js` IELTS Đọc: mọi dạng = 1 bài 700–900 từ, 13 câu (nhận 12–14), 2–3 nhóm, dạng chọn 5–7 câu (dưới 4 câu = lỗi khuôn), 20 phút; thêm `R-mf`, `R-se`, `R-sum`, `R-dia` theo bảng data-model; `R-gt` = 4–7 văn bản A–G, 350–600 từ, nhóm `R-gt` + `R-tf`
- [ ] T007 [US1] `khuon.js` IELTS Nghe theo Part: `L-form` Part 1, `L-match` Part 2, `L-mc` Part 3, `L-note` Part 4 (nhóm `L-form`, ONE WORD ONLY), 10 câu (nhận 9–10), người nói và độ dài theo data-model; `L-sa` thành dạng cũ (không nhận đề mới)
- [ ] T008 [US1] `supabase/functions/de-ai/index.ts`: lời nhắc theo nhóm dạng (dạng chính + dạng kèm, đánh chữ đoạn khi có `R-h` / `R-mi`, câu theo thứ tự, câu chữ giới hạn từ của đề thật); `supabase/functions/de-ai/chude.js`: Nghe `L-form` / `L-match` chủ đề đời thường, `L-mc` / `L-note` học thuật
- [ ] T009 [US1] `khuon.js` + `index.ts`: Task 1 `task.chart` (line / bar / pie / table; "3–8 nhãn, 1–4 dãy (tròn 1–2), số ≥ 0, tròn đơn vị % mỗi dãy cộng 98–102"); Nói `p1` 9–12 câu, chủ đề 1 về nơi ở / công việc / học tập
- [ ] T010 [US1] `deai.js`: `daiDangs` IELTS (Đọc thêm 4 dạng, Nghe theo Part), tên đề = `de.part`, `daiIeX` Task 1 đọc `task.chart` (đề cũ `task.table`), bảng tên dạng cũ (`L-sa`)
- [ ] T011 [US1] `tools/test/run.mjs` C61: khuôn IELTS (Đọc 13 câu / 700–900 từ / 20 phút / nhóm dạng; Nghe 10 câu theo Part; Task 1 chart; p1 9–12 câu)

## Phase 4: User Story 2 - Cambridge đúng số câu, lựa chọn, giới hạn từ (P1)

**Independent Test**: C61 so khuôn từng cấp × phần với bảng data-model.

- [ ] T012 [US2] `khuon.js` Cambridge theo bảng data-model: B2 → C2 cloze / open / wf **8** chỗ; kwt B2 **5** · C1 **6** · C2 **8** từ; Nghe mc C1 / C2 **4** lựa chọn; số câu Nghe điền A2 5 · B1 6 · B2 10 · C1 8 · C2 9; độ dài bài; `part` từng cấp
- [ ] T013 [US2] `deai.js`: `daiDangs` Cambridge ghi phần đề thật ("Phần 1: điền trắc nghiệm"…), thứ tự như đề thật
- [ ] T014 [US2] `tools/test/run.mjs` C61: B2 điền 8 chỗ, C2 viết lại câu nhận đáp án 7 từ, C1 nghe 4 lựa chọn, B2 nghe điền 10 câu

## Phase 5: User Story 3 - Starters / Movers chỉ dạng đề thật (P2)

**Independent Test**: C61: danh sách dạng Pre-A1 / A1 chỉ gồm dạng có trong đề thật, không có Viết; đề cũ vẫn mở.

- [ ] T015 [US3] `khuon.js`: Pre-A1 `box`, `name`; A1 `resp`, `story`, `cloze` (5 chỗ, 3 lựa chọn), `comp`, `name`; Pre-A1 / A1 không còn `mc`, `w` (máy chủ trả "Dạng đề này chưa có.")
- [ ] T016 [US3] `deai.js`: `daiDangs` Pre-A1 / A1 theo khuôn mới; `daiSks(k, lv)` bỏ kỹ năng không có dạng; kỹ năng của đề cũ suy từ `de.sk`
- [ ] T017 [US3] `tools/test/run.mjs` C61: Pre-A1 / A1 không có ô Viết AI; đề cũ Pre-A1 `mc` qua `daiCheck` và mở được

## Phase 6: User Story 4 - Dạng đề thật còn thiếu (P2)

**Independent Test**: C61 khuôn + hiện đúng từng dạng mới (IELTS 4 dạng ở T006).

- [ ] T018 [US4] `khuon.js` + `deai.js`: Cambridge A2 / B1 `sn` (câu lẻ, mỗi câu kèm tin "≤ 40 từ", 3 lựa chọn; A2 6 câu, B1 5); tên "Phần 1: tin ngắn"
- [ ] T019 [US4] `tools/test/run.mjs` C61: `sn` khuôn + tin hiện trong câu hỏi; IELTS `R-se` / `R-sum` có danh sách lựa chọn dư 2–5 cái

## Phase 7: User Story 5 - Câu đúng loại trong dạng đang có (P2)

**Independent Test**: C61: câu hàm ý / câu chèn / câu ý định qua máy kiểm khi đúng, bị bỏ khi sai.

- [ ] T020 [US5] `khuon.js` + `index.ts`: TOEIC p3 / p4 được 1 câu hàm ý, p7 câu chèn câu hoặc câu ý định (lời nhắc + máy kiểm T004)
- [ ] T021 [US5] `tools/test/run.mjs` C61: p7 câu chèn thiếu dấu bị bỏ; p3 câu hàm ý trích sai bị bỏ

## Phase 8: Polish & Cross-Cutting

- [ ] T022 `tools/test/run.mjs` C57 + `tools/test/fake-sb.js`: đề giả v2 (`part`, `chart`) + đề v1 cũ; `tools/test/e2e-webkit.mjs` theo danh sách dạng mới
- [ ] T023 [P] `huongdan.js`: đoạn 🤖 đề AI theo khuôn đề thật (IELTS Đọc 1 bài 13 câu, Nghe 1 Part 10 câu, Cambridge đúng số câu từng phần, Starters / Movers không có Viết AI)
- [ ] T024 Chromium khổ iPhone SE: màn đề AI Đọc IELTS dài, Task 1 biểu đồ, Cambridge A1 hàng 🤖; kiểm tiếp cận nhanh; ghi "chưa kiểm trên iPhone"
- [ ] T025 Triển khai lại hàm máy chủ `de-ai` (`index.ts`, `khuon.js`, `trung.js`, `chude.js`); so bản triển khai với mã
- [ ] T026 `CLAUDE.md` đoạn v144 + dòng đầu, `README.md`, `graphify update . && python3 tools/graph-vung.py` (xếp `khuon.js` vào `VUNG`), `node tools/release.mjs` (bản 142), commit, push nhánh `claude/ecstatic-curie-q9g1ja`

## Dependencies & Execution Order

- T001 → T002–T004 (nền) → các user story. US1 và US2 độc lập với nhau sau nền; US3, US4 dùng luật nhóm của T002; US5 dùng T004.
- T022–T026 sau mọi story. T025 cần T001–T021 xong; lên web (gộp `main`) khi người sáng lập bảo.

## Parallel Opportunities

- T005 song song T002–T004 (tệp test riêng). T023 song song phase 8. Trong mỗi story: tệp `khuon.js` trước, `deai.js` và test sau.

## Implementation Strategy

- MVP = Phase 1–3 (IELTS) + Phase 4 (Cambridge số câu): sửa chỗ lệch nhiều người gặp nhất. Rồi US3 → US4 → US5 → Polish. Test xanh sau mỗi phase.
