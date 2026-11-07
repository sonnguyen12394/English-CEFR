---

description: "Chia việc: Cambridge đủ dạng"
---

# Tasks: Cambridge đủ dạng (bài học + bài tập theo từng dạng của đề thật)

**Input**: Design documents from `specs/005-cambridge-du-dang/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/ui.md, quickstart.md

**Tests**: có (hiến pháp III) → test C60 trong `tools/test/run.mjs` + kiểm lúc dựng trong `tools/build-b.mjs`.

**Organization**: US1 Viết theo thể loại · US2 Nói thảo luận cặp + đề thử Nói · US3 Đọc tin ngắn A2 / B1 · US4 tiêu chí chấm.

## Format: `[ID] [P?] [Story] Description`

---

## Phase 1: Setup

- [X] T001 Soát đề truyện B1 trùng ("The Wrong Bus" ở b1-w2 / b1-w6) trong nguồn của viet.json (content/bs/…); nếu đề thi trùng đề học thì thay đề thi bằng truyện khác có bài mẫu, dựng lại viet.json bằng công cụ dựng của nó

---

## Phase 2: Foundational

- [X] T002 `cbGenre(x)` trong cbmap.js: suy thể loại của đề Viết từ `genre` (thu, bao, truyen, luan, review, baocao, dexuat); test nhỏ: mọi đề B1 → C2 xếp được thể loại

---

## Phase 3: User Story 1 - Viết theo thể loại (P1) 🎯 MVP

**Goal**: 17 bài học thể loại (B1 3 · B2 5 · C1 5 · C2 4) + bài tập theo thể loại.

**Independent Test**: B2 bài "Báo cáo": đề + bài mẫu báo cáo + bố cục; làm thử 3 câu; "Bài tập dạng này" mở đề báo cáo.

- [X] T003 [US1] Soạn `XL_TXT.cb.the` (7 thể loại: ic, t, what, how, trap, bo, mcq ×3) và `XL_TXT.cb.theLv` trong baihoc.js
- [X] T004 [US1] xlCb: bài viết B1 → C2 thêm bài thể loại sau bài chung (mã `cb:<cấp>:<bài thi>:the:<g>`); ví dụ = đề cuối của thể loại ở cấp + bài mẫu chia đoạn + ô "🏗 Bố cục thường gặp"; làm thử = câu "Đề này thuộc thể loại nào?" (đề khác của cấp) + 2 câu soạn sẵn; `go` = `data-cbx="genre|<cấp>|<bài>|<g>"`
- [X] T005 [US1] cbmap.js: cbClick nhánh `genre` (đề đúng thể loại, chưa viết trước rồi viết lâu nhất, chạy như dòng bài Viết); Thêm của màn Viết có hàng "✍️ Viết theo thể loại" (`.chips.tap`): design-critique trước (Chromium khổ iPhone SE) → frontend-design + design-system → ux-copy → accessibility-review sau

---

## Phase 4: User Story 2 - Nói thảo luận cặp đúng đề thật (P1)

**Goal**: bài học thảo luận cặp + đề thử Nói A2 → C2 dùng nhiệm vụ thảo luận cặp; tên / thứ tự phần đúng đề thật.

**Independent Test**: B2 bài "Phần 3: thảo luận cặp" có câu hỏi + 5 gợi ý + lời mẫu; đề thử Nói B2 có phần thảo luận cặp (mode cap), không còn đóng vai; C2 ghi Phần 2 thảo luận cặp · Phần 3 nói dài.

- [X] T006 [US2] Soạn `XL_TXT.cb.spk.rp` (thảo luận cặp), `capm` (2 câu đáp mẫu / cấp), `capq` (3 câu làm thử / cấp, lời bạn thi lấy từ cap.json) trong baihoc.js
- [X] T007 [US2] baihoc.js: `XL_CBS` theo thứ tự đề thật + tên phần theo cấp (A2, C2); xlCbSpk(rp) dùng nhiệm vụ đầu tiên của cấp trong cap.json (nạp cap.json khi mở bài học Nói)
- [X] T008 [US2] mocknoi.js: mkSpeak A2 → C2 phần thảo luận cặp mode `cap` (mở đầu, 2 lượt giữa, chốt) thay đóng vai; thứ tự / tên phần theo cấp; mkSpeakRun hiện nhiệm vụ + phát lời bạn thi; mkSpeakScore: ④ Tương tác dùng `capChecks`; nạp cap.json trước mọi đường vào đề thử Nói (mock.js / cbmap.js)
- [X] T009 [US2] tools/test/run.mjs (kiểm đề thử mọi cấp): câu trả lời mẫu cho lượt `cap` (đáp lời + lý do + hỏi lại / chốt) để kiểm chấm Nói vẫn ≥ 60% ở ②③④

---

## Phase 5: User Story 3 - Đọc tin ngắn A2 / B1 (P2)

- [X] T010 [P] [US3] Soạn 4 bộ tin ngắn (`k: "sn"`; A2 ×2 · 6 văn bản, B1 ×2 · 5 văn bản; ≤ 40 từ; 3 phương án; giải thích) trong content/bs/dangthi.json; tools/build-b.mjs kiểm; dựng nghe.json
- [X] T011 [US3] dangthi.js `DT_Q.sn` + `dtSet` nhận bộ chỉ định; uoe.js: A2 "Phần 1: đọc tin ngắn" + "Phần 3: bài đọc dài", B1 phần 1 dùng `sn`; cbmap.js: CB_KEY / CB_DT / CB_SHORT / CB_HOWT cho `sn`, cbBai một dòng mỗi bộ, cbDo / cbRes; mock.js mkResult ghi `S.cbx[id bộ]`; baihoc.js XL_TXT.cb what / ic / trap cho `sn`

---

## Phase 6: User Story 4 - Tiêu chí chấm (P2)

- [X] T012 [P] [US4] Soạn `XL_TXT.cb.tcW` (4) và `tcS` (4): what, how, trap, ex { p, lo, hi, why }, mcq ×3
- [X] T013 [US4] xlCb: bài Viết B1 → C2 thêm 4 bài tiêu chí, bài Nói A2 → C2 thêm 4 bài (mã `cb:<cấp>:<bài thi>:tc:<i>`; hiện bằng khuôn ví dụ thấp / cao của IELTS, `go` = bài kế tiếp của bài thi)

---

## Phase 7: Polish

- [X] T014 Test C60 trong tools/test/run.mjs: bài học thể loại / tiêu chí / thảo luận cặp / tin ngắn đủ ví dụ + 3 làm thử đúng dạng; nút genre mở đúng thể loại; đề thử Nói A2 → C2 có mode cap, không mode rp, tên phần đúng; đề thử Đọc A2 / B1 phần 1 tin ngắn ≤ 40 từ; ≥ 2 bộ tin ngắn mỗi cấp; mã bài cũ còn (B1 phần 1, bài Nói rp); sửa test cũ nếu lệch theo nhãn mới (C44, C46, C47…)
- [X] T015 [P] Bảng kiểm giáo viên mục v143 (tin ngắn, thể loại + bố cục + câu làm thử, thảo luận cặp, tiêu chí) trong tools/export-review.mjs → docs/kiem-noi-dung.html
- [X] T016 [P] 📘 Luật mục luyện thi: đoạn Cambridge theo dạng trong huongdan.js
- [X] T017 `node tools/test/run.mjs` xanh; soát Chromium theo quickstart.md; `graphify update . && python3 tools/graph-vung.py`
- [X] T018 Đoạn v143 trong CLAUDE.md; `node tools/release.mjs` (bản 141) → commit → push nhánh claude/happy-shannon-5j2r27 → báo người sáng lập (hỏi tạo PR)

---

## Dependencies & Execution Order

- T001, T002 trước US1. US2, US3, US4 độc lập với nhau. T010, T012 là nội dung, làm song song.
- Thứ tự làm thực tế: T001–T002 → T003–T005 → T006–T009 → T010–T011 → T012–T013 → T014–T018.

## Parallel Opportunities

- T010, T012 (nội dung khác tệp); T015, T016.

## Implementation Strategy

- MVP: US1 + US2 (Viết theo thể loại, Nói thảo luận cặp đúng đề thật).
- Rồi US3, US4; cuối cùng Polish + phát hành bản 141.
- Mốc dừng: build-b hoặc C60 đỏ ở dạng nào thì sửa dạng đó trước; không phát hành khi test đỏ.
