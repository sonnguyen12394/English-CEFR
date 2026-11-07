---

description: "Chia việc: TOEIC đủ dạng câu"
---

# Tasks: TOEIC đủ dạng câu (bài học + bài tập theo từng dạng)

**Input**: Design documents from `specs/001-toeic-du-dang/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/ui.md, quickstart.md

**Tests**: có (hiến pháp III: tính năng mới có test riêng) → test C53 trong `tools/test/run.mjs` + kiểm lúc dựng trong `tools/build-toeic.mjs`.

**Organization**: theo user story của spec.md.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: làm song song được (tệp khác nhau, không chờ việc chưa xong)
- **[Story]**: US1 bài học · US2 bài tập theo dạng · US3 kho · US4 câu chèn Part 6

---

## Phase 1: Setup

- [ ] T001 [P] Cài bộ đọc giọng tạm (venv kokoro-onnx 0.6.1 + soundfile; tải kokoro-v1.0.onnx, voices-v1.0.bin) vào thư mục scratchpad, không commit; thử 1 câu bằng tools/build-audio.py

---

## Phase 2: Foundational (chặn mọi story)

- [ ] T002 Thêm suy nhãn dạng vào tools/build-toeic.mjs theo data-model.md: `p1[].k` "people · scene"; `p2[].ty` "wh · yn · or · req · stmt" (không suy được → lỗi; `stmt` không có bẫy `yn`); `p3/p4[].qs[].ty` "gist · next · imp · graphic · detail"; `p6[].gaps[].t` "insert · conn · tense · word" (đúng 1 `insert` mỗi đoạn); `p7[].qs[].ty` "purpose · infer · not · syn · insert · intent · detail" (`syn`: từ được hỏi có trong văn bản; `insert`: văn bản đủ [1]–[4], đáp án là một dấu); nhãn ghi tay trong content/ thắng nhãn suy; in số câu theo dạng
- [ ] T003 Ghi nhãn loại bài nói `ty` ("msg · ann · ad · news · intro · tour · meet") cho 25 bài Part 4 cũ trong content/toeic/nghe.json; build-toeic báo lỗi khi thiếu / sai
- [ ] T004 [P] Thêm dạng Part 5 `det` (Từ hạn định, lượng từ; đứng sau `pron`): TO_T5 trong toeic.js, TM_SHORT + TM_TIP trong tomap.js, t5tip trong tracuu.json, danh sách T5 trong tools/build-toeic.mjs
- [ ] T005 [P] Câu chèn [1]–[4] Part 7 giữ thứ tự phương án (không xáo) trong toP7Qs ở toeic.js
- [ ] T006 Dựng toeic.json (`node tools/build-toeic.mjs`), chạy `node tools/test/run.mjs`: test cũ vẫn xanh

**Checkpoint**: kho có nhãn dạng; story bắt đầu được.

---

## Phase 3: User Story 1 - Mỗi dạng câu có một bài học riêng (Priority: P1) 🎯 MVP

**Goal**: 33 bài học TOEIC (Nghe 15, Đọc 17, Từ công sở 1) theo thứ tự đề thật.

**Independent Test**: mở từng bài học: đủ 5 phần, ví dụ đúng dạng, 3 câu làm thử đúng dạng, làm thử không ghi kết quả (C53 phần bài học + C46).

- [ ] T007 [US1] Viết 13 bài học mới trong XL_TXT.to ở baihoc.js (Nghe: p1o, p2-yn, p2-or, p2-req, p2-st, gist, next, p4-ty; Đọc: p5-det, p6-ins, p7-inf, p7-syn, p7-ins), sửa tên / mô tả bài cũ p1 (tranh có người), p2 (câu Wh-), p6 (chọn từ theo cả đoạn), p7 (mục đích, chi tiết) theo research.md R10; giữ mã bài cũ
- [ ] T008 [US1] Mở rộng xlTo ở baihoc.js: ví dụ + 3 câu làm thử lấy theo nhãn dạng (`k`, `ty`, `t`) cho mọi bài mới; p4-ty làm thử "nghe câu mở đầu, chọn loại bài nói"; p6-ins ví dụ là câu chèn của đoạn đã viết lại
- [ ] T009 [US1] Test C53 phần bài học trong tools/test/run.mjs: đủ 33 bài, thứ tự, mã cũ còn, ví dụ và câu làm thử đúng dạng của bài

**Checkpoint**: US1 kiểm được độc lập (dạng có kho mỏng đủ 3 câu thử sau US3).

---

## Phase 4: User Story 2 - Mỗi dạng câu có bài tập riêng (Priority: P1)

**Goal**: 17 bài tập theo dạng mới, mở từ bài học và từ "Thêm".

**Independent Test**: bấm "🏋️ Bài tập dạng này" ở mỗi bài học: lượt chỉ có câu / bài đúng dạng; kết quả ghi như luyện theo Part (C53 phần bài tập).

- [ ] T010 [US2] Thêm TO_DR (17 mã ở data-model.md) + `toDrill(mã, back)` + bấm `data-todr` trong toeic.js: Part 1 "5 câu", Part 2 "tối đa 8 câu", Part 3–4 / 6 / 7 "2 bài có dạng đó, cả bài", chưa làm / làm lâu nhất trước; ghi `S.to.r` + `toLog` như luyện theo Part
- [ ] T011 [US2] Nút "🏋️ Bài tập dạng này" (`go`) của mọi bài học TOEIC trỏ đúng bài tập (`data-todr` hoặc nút có sẵn) trong baihoc.js
- [ ] T012 [US2] Khối "🎯 Luyện theo dạng câu" trong "Thêm" của toSkView ở toeic.js (contracts/ui.md): design-critique màn Nghe / Đọc trước (Chromium khổ iPhone SE, 3 vấn đề chính) → làm theo frontend-design + design-system (lớp có sẵn, vùng bấm ≥ 44 px) → chữ theo ux-copy → accessibility-review sau (trước / sau)
- [ ] T013 [US2] Test C53 phần bài tập trong tools/test/run.mjs: mỗi mã TO_DR chỉ có câu / bài đúng dạng, đủ số câu, ghi `S.to.r`, nút về đúng màn

**Checkpoint**: US1 + US2 dùng được cho mọi dạng có kho.

---

## Phase 5: User Story 3 - Kho đủ bài tượng trưng cho mọi dạng (Priority: P2)

**Goal**: đạt kho tối thiểu FR-010.

**Independent Test**: build-toeic in số câu theo dạng ≥ mức FR-010; C53 phần kho.

- [ ] T014 [P] [US3] Part 2 +10 câu ở CUỐI kho p2 (câu trần thuật 6, lựa chọn 2, phủ định / câu đuôi 2), 3 lời đáp, đúng một, nhãn bẫy, trong content/toeic/nghe.json
- [ ] T015 [P] [US3] Part 3 +3 hội thoại, mỗi bài có 1 câu hàm ý ("What does the man mean when he says…"), 1 bài 3 người nói, trong content/toeic/nghe.json
- [ ] T016 [P] [US3] Part 4 +2 bài quảng cáo (`ty: "ad"`, 1 bài có câu hàm ý) trong content/toeic/nghe.json
- [ ] T017 [P] [US3] Part 5 +10 câu `t: "det"` ở CUỐI kho trong content/toeic/p5.json
- [ ] T018 [P] [US3] Part 7 +7 bộ trong content/toeic/doc.json: 5 bộ một văn bản (chèn câu [1]–[4] ×3, từ gần nghĩa ×4, câu NOT ×3, có câu mục đích / suy luận), 2 bộ tin nhắn / trò chuyện (câu ý định ×2 mỗi bộ hoặc ×1 + chi tiết)
- [ ] T019 [US3] Dựng toeic.json, Claude soát mỗi câu mới đúng 1 đáp án; dựng giọng câu nghe mới (`python -I tools/build-audio.py <mô hình> 4`, n/ + n/index.json)
- [ ] T020 [US3] Test C53 phần kho tối thiểu (FR-010) + mọi câu nghe mới có tệp giọng trong tools/test/run.mjs

**Checkpoint**: mọi dạng đủ ví dụ + 3 câu làm thử + 1 lượt bài tập.

---

## Phase 6: User Story 4 - Câu chèn Part 6 luyện đúng kỹ năng (Priority: P2)

**Goal**: 23 câu chèn Part 6 có 4 phương án cùng chủ đề, sai vì mạch văn.

**Independent Test**: đọc mọi câu chèn Part 6; kiểm máy: mỗi phương án có từ chung với đoạn (C53 phần Part 6).

- [ ] T021 [US4] Viết lại 57 phương án sai + `why` của câu chèn ở 19 đoạn Part 6 cũ (giữ đáp án đúng, giữ mã) trong content/toeic/doc.json
- [ ] T022 [US4] Part 6 +4 đoạn (mỗi đoạn: 1 chỗ `t: "tense"` thì theo ngữ cảnh, 1 chỗ từ nối giữa câu, 1 chỗ từ / ngữ pháp, 1 câu chèn đúng kiểu) trong content/toeic/doc.json
- [ ] T023 [US4] Kiểm dựng "phương án câu chèn có ≥ 1 từ nội dung chung với đoạn" trong tools/build-toeic.mjs + test C53 phần Part 6 trong tools/test/run.mjs

---

## Phase 7: Polish & Cross-Cutting

- [ ] T024 [P] Bảng kiểm giáo viên: mục v137 (Part 2 / 3 / 4 / 5 / 7 mới, Part 6 viết lại + đoạn mới; bài học mới đọc từ XL_TXT) trong tools/export-review.mjs → docs/kiem-noi-dung.html
- [ ] T025 [P] 📘 Luật mục luyện thi: một câu về bài tập theo dạng TOEIC trong huongdan.js
- [ ] T026 Chạy đủ `node tools/test/run.mjs`; soát Chromium khổ iPhone SE theo quickstart.md §4 (không lỗi trang, không tràn ngang); `graphify update . && python3 tools/graph-vung.py`
- [ ] T027 Đoạn v137 trong CLAUDE.md (dòng tóm tắt đầu + đoạn chi tiết); `node tools/release.mjs` (tăng phiên bản, test xanh) → commit → push nhánh claude/happy-shannon-5j2r27

---

## Dependencies & Execution Order

- Phase 1 song song với Phase 2. Phase 2 chặn mọi story.
- US1 và US2 chạy được ngay cho dạng đủ kho; các dạng mỏng (câu trần thuật, hàm ý, quảng cáo, lượng từ, từ gần nghĩa, chèn câu [1]–[4], câu NOT, ý định) đủ 3 câu làm thử / 1 lượt bài tập sau US3.
- US4 độc lập với US1–US3 (chỉ sửa / thêm Part 6); bài học p6-ins đẹp hơn sau US4.
- Thứ tự làm thực tế: T001–T006 → T014–T018 (soạn nội dung, song song) → T007–T013 → T019–T020 → T021–T023 → T024–T027.

## Parallel Opportunities

- T014, T015, T016, T017, T018 (nội dung, tệp / khu riêng) làm song song.
- T004, T005 song song với T002–T003.
- T024, T025 song song.

## Implementation Strategy

- MVP: Phase 2 + US1 + US2 (bài học + bài tập theo dạng cho dạng đã đủ kho).
- Rồi US3 (kho) để mọi dạng chạy đủ, US4 (chất lượng Part 6), cuối cùng Polish + phát hành v137.
- Mốc dừng: build-toeic hoặc C53 đỏ ở dạng nào thì sửa nội dung dạng đó trước khi làm tiếp; không phát hành khi test đỏ.
