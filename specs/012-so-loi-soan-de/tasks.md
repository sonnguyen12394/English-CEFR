# Tasks: Sổ lỗi soạn đề

**Input**: `specs/012-so-loi-soan-de/` (spec, plan, research, data-model, contracts/ui, quickstart)
**Tests**: có (C69 mở rộng, C70 mới, bước e2e) — hiến pháp III.
**Mốc dừng**: chờ người sáng lập "ok" kế hoạch trước T001.

## Phase 1: Chuẩn bị

- [X] T001 Tra `graphify query` cho `trB`, `toOpts`, `units`, `syncTabs`, `gyFlush`, thanh dưới; ghi phần bị ảnh hưởng vào research.md
- [X] T002 [P] design-critique thanh dưới + màn 🎯 Luyện đề (Chromium khổ iPhone SE 320 px, iPhone 13), nêu 3 vấn đề; đo bề rộng nhãn tab ở 11 / 12 px
- [X] T003 [P] Chụp thứ tự phương án hiện tại của 8 đề (số câu → phương án theo thứ tự hiện) vào scratchpad để đổi chữ sau (R6)

## Phase 2: US1 — Danh mục lỗi + luật phòng (P1) 🎯 MVP

- [X] T004 [US1] Rà 5 nguồn (CLAUDE.md v149–v154, bộ tiêu chí, ghi chú giải mù `content/toeic/giai-mu/*.json`, `kiem-ok.json`, commit) → soạn `content/toeic/so-loi.json` theo data-model §1 (mỗi mục ≥ 1 ví dụ thật trước → sau)
- [X] T005 [US1] `tools/build-toeic.mjs`: kiểm nguồn sổ lỗi (mã duy nhất, trường bắt buộc, `luat` có thật, `tt` khớp mức luật) + dựng `kiemde.json` (luật, tình trạng 8 đề, đếm) — data-model §2
- [X] T006 [US1] `toqt.js` `tqNat`: số viết bằng chữ, giờ chữ (noon, five o'clock), thời lượng khác đơn vị, nhãn chữ + số; câu mẫu trong test
- [X] T007 [US1] `tools/kiem-toeic.mjs`: 6 luật mới (C-CAN lỗi; C-SO-KHUON, C-LAP-NOI, P34-THUTU, P1-GIOI, P34-NGUYEN cảnh báo) + câu cài lỗi / câu sạch trong `tools/test/kiem-mau.json`
- [X] T008 [US1] Xử lý câu 8 đề bị luật mới báo: sửa (rồi giải lại bằng phiên phụ) hoặc "đã xem" có lý do trong `content/toeic/kiem-ok.json`; luật báo > 15 câu đúng → hạ thành tiêu chí người soát
- [X] T009 [US1] `docs/TIEU-CHI-DE-TOEIC.md`: bước "đọc sổ lỗi trước khi soạn" + "so ghi chú giải mù với sổ lỗi"; mã luật mới; CLAUDE.md luật soạn đề trỏ tới sổ lỗi
- [X] T010 [US1] Test C70 (`tools/test/run.mjs`): sổ lỗi hợp lệ, số liệu dựng khớp dữ liệu, mọi mã luật có thật

## Phase 3: US4 — Cân bằng vị trí đáp án cả 8 đề (P2)

- [X] T011 [US4] `tools/build-toeic.mjs`: thuật toán "sửa ít nhất" theo Part (ngưỡng FR-013, chuỗi ≤ 3), ghi `ord` (Đề 1–2 vào `toeic.json` `tron`, Đề 3–8 vào `toeic-tron/deN.json`); Part 2 sửa hoán vị câu cần đổi (kể cả câu kho của Đề 1–2)
- [X] T012 [US4] `totron.js` `trB` và `tools/kiem-toeic.mjs` `units` dùng `ord` khi có (một nơi tính: bộ dựng)
- [X] T013 [US4] Đổi chữ `da` / `chon` / `hai` trong `content/toeic/giai-mu/*.json` theo bản chụp T003 (cùng phương án) → 8 đề vẫn giải mù 200/200 không phải làm lại
- [X] T014 [US4] Sinh `toeic-tron/doi-chu.json`; `totron.js` chuyển bài làm cũ (📋 cả đề, một phần, từng lượt) và đề đang làm dở thiếu `ov` → lưu `ov: 2`
- [X] T015 [US4] Giọng Kokoro cho dòng Part 2 đổi chữ (`tools/build-audio.py`)
- [X] T016 [US4] Kiểm: 56 Part trong ngưỡng (C-CAN), 8 đề 0 lỗi / 0 cảnh báo chưa xem / giải mù 200/200; tỉ lệ câu đổi chữ mỗi Part ≤ 40% (mốc dừng)

## Phase 4: US2 — Tab 🛡️ Kiểm đề (P2)

- [X] T017 [US2] `index.html`: tab thứ 6 sau 🎯 Luyện đề, CSS thanh dưới chia đều (bỏ min 64 px), nhãn 11–12 px; nạp `kiemde.js`
- [X] T018 [US2] `kiemde.js`: tải `kiemde.json`, màn theo contracts/ui.md (tóm tắt, từng đề, lọc khâu, nhóm, mục gập, ví dụ, luật, còn mở); `app.js` `syncTabs` + bấm tab
- [X] T019 [US2] ux-copy chữ trên màn; frontend-design / design-system (biến màu, cỡ chữ chung)
- [X] T020 [US2] accessibility-review: tương phản sáng / tối, vùng bấm ≥ 44 px, 320 px không tràn ngang, 6 tab không cắt chữ; báo trước / sau

## Phase 5: US3 — ✓ Đúng ý / ✗ Chưa đúng (P3)

- [X] T021 [US3] `kiemde.js`: nút ✓ / ✗ + ô ghi chú; lưu `S.kd`; xếp hàng góp ý (`gyLS` + `gyFlush`, `kind: 'khac'`, `ctx.view: 'kiemde'`); mở lại thấy dấu
- [X] T022 [US3] README / CLAUDE.md: cách Claude đọc phản hồi (truy vấn `gopy` lọc `ctx->>'view' = 'kiemde'`)

## Phase 6: Hoàn tất

- [X] T023 e2e: bước tab Kiểm đề (6 tab, mở mục, ✓, ✗ + ghi chú gửi góp ý giả), bước đề thử trọn sau cân bằng
- [X] T024 CLAUDE.md đoạn v155 + đầu tệp; README; `tools/release.mjs` mục 18 (iPhone: 6 tab, Kiểm đề, ✓ / ✗, chữ đáp án Part 6 Đề 7)
- [X] T025 `node tools/test/run.mjs` xanh; e2e Chromium; `node tools/release.mjs` (bản 152); `graphify update . && python3 tools/graph-vung.py`; commit, đẩy

## Thứ tự

T001–T003 → US1 (T004–T010) → US4 (T011–T016, cần T003, T006) → US2 (T017–T020, cần T005) → US3 (T021–T022, cần T018) → T023–T025.
Song song được: T002 ∥ T003; T004 ∥ T006; T019 ∥ T014.
