# Tasks: Thêm 10 đề thử TOEIC trọn 200 câu

**Input**: specs/010-toeic-10-de-tron/ (spec.md, plan.md, research.md, data-model.md, quickstart.md)
**Tests**: có (hiến pháp III: tính năng mới có test riêng) — C66 trong `tools/test/run.mjs` + 1 bước e2e.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: làm song song được (khác tệp, không chờ việc chưa xong)
- **[Story]**: US1 làm thêm đề chưa gặp · US2 đề sát đề thật về dạng câu · US3 xem đáp án và học lại · US4 📋 bài làm và đáp án

## Phase 1: Setup

- [X] T001 Khởi động lại nhánh `claude/ecstatic-curie-q9g1ja` từ `origin/main` (PR #9 đã gộp) ở thư mục gốc repo
- [X] T002 Cài kokoro-onnx 0.6.1 + mô hình v1.0 trên máy soạn cho `tools/build-audio.py`; không cài được thì ghi lại, đợt đó dùng giọng máy

## Phase 2: Foundational (chặn mọi đợt đề)

- [X] T003 `tools/build-toeic.mjs`: tách hàm kiểm của kho (Part 1, 2, 3–4, 5, 6, 7) để dùng cho câu đề mới; đọc `content/toeic/tron/de*.json`; kiểm số câu từng Part, thứ tự (bài có bảng ở cuối Part 3–4; Part 7 đơn → 2 → 3 văn bản), `id` dạng `d03-p3-05` không trùng; ghi `toeic-tron/deN.json` và `toeic.json` mục `tron` thêm `{ id, t, f }`
- [X] T004 [P] `totron.js`: `trLoad(de)` tải `toeic-tron/deN.json` theo `f` (có hạn giờ, lỗi thì báo "Không tải được đề"); `trB` dựng từ câu của tệp đề; tải trước ở `trReady`, `trResume`, vào lại đề dở trong `trView`; Đề 1–2 không đổi
- [X] T005 [P] `tools/build-audio.py`: đọc thêm câu nghe của `toeic-tron/*.json` (Part 1–4), gán giọng như kho
- [X] T006 `tools/test/run.mjs` C66 (khung): 12 đề × 200 câu đúng cơ cấu; câu đề mới KHÔNG có trong `TO.p1…p7`; mỗi đề mới chạy nhanh (hệ số giờ) từ Bắt đầu tới kết quả không lỗi

**Checkpoint**: bộ dựng, bộ chạy, giọng, test sẵn sàng nhận đề mới.

## Phase 3: User Story 1 - Làm thêm đề trọn chưa gặp (P1) 🎯 MVP = đợt 1

**Goal**: Đề 3, Đề 4 làm được như thi thật, câu chưa gặp ở đâu trong app.
**Independent Test**: chọn Đề 3 → làm hết → kết quả; C66 xanh; không câu nào trùng kho / Đề 1–2.

- [X] T007 [P] [US1] Soạn `content/toeic/tron/de03.json`: 200 câu theo research.md R4 (cơ cấu, dạng) + R5 (độ khó như đề thật) + data-model.md (`ev` cho câu Part 3, 4, 7 "trừ câu NOT và câu chèn [1]–[4]"; `x: 1` "≥ 1 câu mỗi bộ" nhiều văn bản; `ty` bài Part 4 "msg / ann / ad / news / intro / tour / meet"); giải thích tiếng Việt Part 1, 5, 6, 7
- [X] T008 [P] [US1] Soạn `content/toeic/tron/de04.json` như T007, khác chủ đề / bối cảnh Đề 3
- [X] T009 [US1] `node tools/build-toeic.mjs` sửa tới xanh; `python3 tools/build-audio.py` dựng giọng câu nghe Đề 3–4 (`n/`)
- [X] T010 [US1] Tự soát từng câu Đề 3–4 (đáp án duy nhất, phương án sai thật sự sai, `ev` đúng chỗ, Part 1 tranh chỉ đúng một câu tả); ghi số câu sửa
- [X] T011 [US1] `totron.js` màn chọn đề: danh sách 12 đề đọc gọn ở khổ 320 px (chụp Chromium khổ iPhone SE trước / sau, kiểm tiếp cận nhanh)

**Checkpoint**: Đề 3–4 chạy được độc lập.

## Phase 4: User Story 2 - Đề sát đề thật về dạng câu (P2)

**Goal**: mỗi đề mới đủ dạng câu như đề thật; bộ dựng tự đếm.
**Independent Test**: bộ dựng in bảng dạng câu từng đề; bỏ một câu hàm ý khỏi Đề 3 thì bộ dựng dừng.

- [X] T012 [US2] `tools/build-toeic.mjs`: kiểm dạng tối thiểu mỗi đề mới (research.md R4: Part 1 "4 có người, 2 cảnh", Part 2 "Wh- 12 · Yes / No 5 · lựa chọn 2 · đề nghị 3 · trần thuật 3", mỗi chữ A / B / C "≤ 11"; Part 3 "2 hội thoại 3 người; 3 hội thoại cuối có bảng; ≥ 2 câu hàm ý"; Part 4 "2 bài cuối có bảng; ≥ 2 câu hàm ý; ≥ 4 loại bài nói"; Part 5 đủ 8 dạng; Part 6 "mỗi đoạn 1 câu chèn; ≥ 1 từ nối, ≥ 1 thì"; Part 7 "2 · 2 · 2 · 2 · 3 · 3 · 3 · 4 · 4 · 4 câu", 2 chuỗi tin nhắn có câu ý định, 2 câu chèn, "≥ 2 từ gần nghĩa", "≥ 1 NOT"); in bảng dạng câu từng đề
- [X] T013 [US2] `tools/build-toeic.mjs`: kiểm `ev` có nguyên văn trong lời nghe / bài đọc; kiểm trùng nguyên văn (chuẩn hoá chữ) với kho và đề khác (research.md R3)
- [X] T014 [US2] C66 thêm: mỗi đề mới đủ dạng tối thiểu; 100% `ev` có trong bài (`tools/test/run.mjs`)

## Phase 5: User Story 3 - Xem đáp án và học lại (P3)

**Goal**: câu sai của đề mới vào ô 🎯 Sai ở đâu, có 📍 câu chứa đáp án và giải thích.
**Independent Test**: làm sai câu từ gần nghĩa Part 7 Đề 3 → ô 🎯 Sai ở đâu dẫn tới bài học "từ gần nghĩa", có 📍.

- [X] T015 [P] [US3] `toeic.js`: `toTalkQs`, `toP7Qs` giữ `ev` của câu hỏi; `hoclai.js` `hlEv` hiện `ev` cho câu đề mới
- [X] T016 [US3] C66 thêm: làm sai một câu Part 3, Part 7 của Đề 3 → ô 🎯 Sai ở đâu nối đúng bài học, có 📍; e2e thêm 1 bước mở Đề 3 (`tools/test/e2e-webkit.mjs`)

## Phase 5b: User Story 4 - Xem lại bài làm và đáp án (P2)

**Goal**: nộp xong thấy bài làm + đáp án của cả 200 câu, xem lại từng bài có lời nghe / bài đọc; mở lại app vẫn xem được (mọi đề, kể cả Đề 1–2).
**Independent Test**: làm Đề 1 (đúng / sai / bỏ trống vài câu) → 📋 bảng 200 ô đúng màu → chạm câu 35 → thấy hội thoại, chữ đã chọn, đáp án → tắt mở lại → từ danh sách đề vẫn mở được.

- [X] T015b [US4] Thiết kế: chụp màn kết quả hiện tại (Chromium khổ iPhone SE), chấm 3 vấn đề; bản phác bảng 200 ô + màn xem lại theo khuôn sẵn có (`.trgrid`, `.trplan`), chữ theo ux-copy
- [X] T015c [US4] `totron.js`: `trSubmit` lưu `S.to.tronA[de] = { at, a }` ("chuỗi 200 ký tự … '-' = bỏ trống"); mục "📋 Bài làm và đáp án" ở `trRes`: số đúng / sai / bỏ trống, lọc Tất cả · Câu sai · Bỏ trống, bảng 200 ô theo Part (ô ≥ 44 px, màu + ký hiệu, không chỉ dựa vào màu)
- [X] T015d [US4] `totron.js`: màn xem lại một bài (`trRv`): tranh Part 1, lời nghe hiện chữ + 🔊 nghe lại Part 2–4, câu / đoạn / văn bản Part 5–7; mỗi câu đánh dấu đã chọn / đáp án, giải thích, 📍 câu chứa đáp án; ‹ Trước · Sau › (theo lọc); không sửa được đáp án
- [X] T015e [US4] `totron.js` danh sách đề: "📋 Xem bài làm lần gần nhất" khi có `S.to.tronA[de]`; đề làm trước bản này ghi "chưa lưu bài làm từng câu"
- [X] T015f [US4] C66 thêm: lưu đúng chuỗi bài làm, bảng 200 ô đúng màu, xem lại câu 35 có lời nghe + đáp án, mở lại từ danh sách đề; e2e 1 bước; kiểm tiếp cận sáng + tối (vùng bấm ≥ 44 px, tương phản)

## Phase 6: Polish đợt 1 + mốc dừng

- [X] T017 [P] `tools/export-review.mjs`: bảng kiểm giáo viên thêm câu Đề 3–4 (gập theo đề)
- [X] T018 [P] 📘 Luật (`huongdan.js` mục luyện thi): số đề đọc từ dữ liệu; CLAUDE.md đoạn v149; README; `tools/release.mjs` mục kiểm iPhone
- [X] T019 Chạy `node tools/test/run.mjs` + e2e Chromium; `node tools/release.mjs` (bản 147); `graphify update . && python3 tools/graph-vung.py`; commit, đẩy nhánh
- [X] T020 MỐC DỪNG: báo người sáng lập; chờ "tiếp". Khuyên 1 người học thật làm 1 đề mới + 1 đề ETS trong cùng tuần (lệch > 100 điểm mỗi phần thì sửa độ khó trước)

## Phase 7: Đợt 2–5 (mỗi đợt chỉ làm khi người sáng lập nói "tiếp")

- [X] T021 [P] [US1] Đợt 2: soạn `content/toeic/tron/de05.json`, `de06.json` → dựng, giọng, tự soát, test, release v150
- [ ] T022 [P] [US1] Đợt 3: `de07.json`, `de08.json` → như T021, v151
- [ ] T023 [P] [US1] Đợt 4: `de09.json`, `de10.json` → như T021, v152
- [ ] T024 [P] [US1] Đợt 5: `de11.json`, `de12.json` → như T021, v153; cập nhật spec Status "Đã làm"

## Dependencies & Execution Order

- Phase 1 → Phase 2 → (US4 T015b–T015f làm trước, dùng được ngay cho Đề 1–2) → (US1 T007–T011 ∥ US2 T012–T014 ∥ US3 T015–T016) → Phase 6 → **dừng** → Phase 7 (tuần tự từng đợt).
- T009 cần T003, T005; T010 cần T009; T012–T013 cần T003 (Đề 3–4 phải qua kiểm sau T012–T013).
- Mỗi đợt ở Phase 7 cần đợt trước đã phát hành và lời "tiếp" của người sáng lập.

### Parallel Opportunities

- T004, T005 song song (khác tệp) sau T003.
- T007, T008 song song (2 tệp đề độc lập).
- T015 song song với US1, US2.
- T017, T018 song song.

## Parallel Example: User Story 1

```text
T007 soạn content/toeic/tron/de03.json
T008 soạn content/toeic/tron/de04.json
```

## Implementation Strategy

- MVP = Phase 1 + 2 + US4 (📋 Bài làm và đáp án) + đợt 1 (Đề 3–4) + US2 + US3, phát hành một bản (v149, bản 147), rồi dừng.
- Mỗi đợt sau thêm 2 đề, mỗi đợt một bản; lỗi chung lộ ra ở đợt 1 thì sửa khung trước khi soạn tiếp.
