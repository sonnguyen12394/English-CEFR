---
description: "Danh sách việc: bộ kiểm nội dung đề TOEIC"
---

# Tasks: Bộ kiểm nội dung đề TOEIC

**Input**: `specs/011-kiem-noi-dung-de/` (spec.md, plan.md, research.md, data-model.md, contracts/, quickstart.md)

**Tests**: có (FR-006, test C69; trước gộp main: C67).

**Organization**: theo user story của spec.md. Mã luật, mức, nội dung: research.md R2. Khuôn tệp: data-model.md, contracts/tep.md.

## Format: `[ID] [P?] [Story] Description`

## Phase 1: Setup

- [X] T001 Tra bản đồ mã (`graphify query`) cho bộ dựng TOEIC và thứ tự phương án đề trọn; tạo `content/toeic/kiem-ok.json` ({ "_note", "ok": [] }) và thư mục `content/toeic/giai-mu/`

---

## Phase 2: Foundational (chặn mọi story)

- [X] T002 Khung máy kiểm `tools/kiem-toeic.mjs`: đọc đề đã dựng (Đề 1–2 từ `toeic.json` `tron` + kho, Đề 3+ từ `toeic-tron/deN.json`); đánh số câu 1–200 theo thứ tự p1 → p7 như `trB`; chữ cái đáp án như app (Part 1 / 2 theo `a`, câu chèn [1]–[4] giữ thứ tự, còn lại sắp `[đáp án, ...sai]` theo `trH(mãĐề + sốCâu + chữ)`, `trH` chép từ `totron.js`); dấu nội dung "md5 10 ký tự" theo đơn vị câu lẻ (Part 1, 2, 5) / bài (Part 3, 4, 6, 7); khớp "đã xem" theo (`id`, `ma`, `dau`), "Không ghi được cho `muc = loi`, `GM-CHUA`, `GM-CU`"; in kết quả, mã thoát 1 khi có lỗi; xuất module `kiemDe`, `kiemTatCa`, `RULES` (contracts/cli.md)
- [X] T003 Tiện ích trong `tools/kiem-toeic.mjs`: đổi số đọc bằng chữ về số + so theo ranh giới từ (R6); bảng tên nam / nữ (R7); nhận emoji người (Part 1); kho chữ tiếng Anh của app cho `C-CHU` (R5, bỏ chữ của đề đang kiểm); tách câu, từ nội dung (bỏ từ chức năng)

**Checkpoint**: `node tools/kiem-toeic.mjs` chạy được trên Đề 1–6 (chưa có luật).

---

## Phase 3: User Story 1 - Bộ tiêu chí lưu trong repo (P1)

**Goal**: một tài liệu tiêu chí theo Part dùng cho mọi lần soạn.

**Independent Test**: mỗi câu trong bộ câu cài lỗi (T006) chỉ ra được mã tiêu chí trong tài liệu.

- [X] T004 [P] [US1] Viết `docs/TIEU-CHI-DE-TOEIC.md`: mục đích; quy trình soạn một đề (soạn → tự soát theo tiêu chí → dựng / máy kiểm → giải mù → xử lý cảnh báo → giọng → test, phát hành); mọi mã luật của research.md R2 (mã · mức · máy / giải mù / người · nội dung · ví dụ sai → sửa, ví dụ lấy từ dữ liệu thật của repo khi có) và các tiêu chí chỉ người kiểm `H-*`; cách ghi "đã xem"
- [X] T005 [P] [US1] Thêm vào mục "Luật" của `CLAUDE.md`: soạn / sửa câu đề TOEIC phải theo `docs/TIEU-CHI-DE-TOEIC.md`, qua `node tools/kiem-toeic.mjs` (0 lỗi) và giải mù trước khi phát hành

---

## Phase 4: User Story 2 - Máy kiểm tự động khi dựng (P1)

**Goal**: luật tự động chia lỗi / cảnh báo, chặn dựng khi có lỗi, có báo cáo.

**Independent Test**: bộ câu cài lỗi bị bắt đủ; bộ câu sạch 0 kết quả (C69 phần a).

### Tests

- [X] T006 [P] [US2] Bộ câu cài lỗi + câu sạch `tools/test/kiem-mau.json`: "mỗi luật tự động ≥ 1 câu" ở `sai` (đủ trường như dữ liệu đã dựng), `sach` ≥ 50 câu / bài lấy từ đề đã đọc lại và chắc đúng
- [X] T007 [US2] Test C67 (sau khi gộp main: **C69**, vì C67 / C68 đã dùng cho v150 / v151) trong `tools/test/run.mjs`: (a) mỗi câu `sai` bị đúng luật `ma` của nó bắt, `sach` 0 kết quả; (c) mọi mã trong `RULES` có trong `docs/TIEU-CHI-DE-TOEIC.md`; phần (b) cổng dữ liệu thật để tắt tới T024

### Luật

- [X] T008 [P] [US2] Luật chung trong `tools/kiem-toeic.mjs`: `C-TRUNG-PA`, `C-GT-LECH`, `C-GT-THIEU`, `C-DAI`, `C-DANG`, `C-CHU`, `C-CACH`
- [X] T009 [P] [US2] Luật Part 1: `P1-EMOJI`, `P1-CANH-NGUOI`, `P1-VAT` (bảng vật → emoji lấy từ các tranh đang dùng)
- [X] T010 [P] [US2] Luật Part 2: `P2-YESNO` (không tính "No later…", "Not yet"), `P2-BAY` (bỏ: ồn, xem research.md R3)
- [X] T011 [P] [US2] Luật Part 3–4: `P34-HAMY`, `P34-NGUOI`, `P4-SX`, `P34-TEN`, `P34-BANG-COT`, `P34-BANG-LO`, `P34-GIOI`, `P34-SAI-DUNG`, `P3-LUOT` (A, C = nữ; B = nam; Part 4 theo `sx`)
- [X] T012 [P] [US2] Luật Part 5–6: `P5-CHO`, `P5-HOA`, `P5-AAN`, `P5-HO-TU`, `P6-HOA`, `P6-CHEN-CO`, `P6-THI-MOC`
- [X] T013 [P] [US2] Luật Part 7: `P7-GIO`, `P7-TINH`, `P7-THU-NGAY`, `P7-CHEN-CO`, `P7-NOT`, `P7-SO`
- [X] T014 [US2] Luật giải mù đọc `content/toeic/giai-mu/deN.json`: `GM-CHUA`, `GM-LECH`, `GM-HAI`, `GM-CU` (data-model.md)
- [X] T015 [US2] Báo cáo `node tools/kiem-toeic.mjs --html` → `docs/kiem-de-toeic.html` (theo đề → Part; đếm lỗi / cảnh báo chưa xem / đã xem; tỉ lệ khớp giải mù; đọc được trên điện thoại)
- [X] T016 [US2] `tools/build-toeic.mjs` gọi máy kiểm sau khi ghi tệp dựng: in "kiểm nội dung: a lỗi · b cảnh báo chưa xem"; có lỗi thì in từng dòng và thoát 1

**Checkpoint**: C69 (a), (c) xanh.

---

## Phase 5: User Story 3 - Kiểm và sửa đề cũ (P1)

**Goal**: Đề 1–6 sạch: 0 lỗi, 0 cảnh báo chưa xem, giải mù xong.

**Independent Test**: C69 (b) xanh; báo cáo `docs/kiem-de-toeic.html` ghi 0 lỗi, 0 chưa xem cho Đề 1–6.

- [X] T017 [US3] Chạy máy kiểm trên Đề 1–6, chỉnh luật ồn trong `tools/kiem-toeic.mjs` tới khi cảnh báo ≤ 5 / 100 câu (thu hẹp, không ghi "đã xem" hàng loạt); ghi số trước / sau vào research.md
- [X] T018 [US3] Sửa mọi lỗi: câu Đề 1–2 sửa ở kho `content/toeic/*.json`, Đề 3–6 ở `content/toeic/tron/de03–06.json` (ưu tiên sửa lời bài / câu hỏi để giữ chữ cái đáp án, R8); dựng lại
- [X] T019 [US3] Đọc từng cảnh báo: câu kém thì sửa, câu ổn thì ghi `content/toeic/kiem-ok.json` kèm lý do
- [X] T020 [P] [US3] `tools/giai-mu.mjs`: `xuat <de> <nghe|doc> <tệp> [--cau …]` (phiếu theo contracts/tep.md, không đáp án / giải thích / câu trích / nhãn) và `so <de> <tệp.json>` (đối chiếu, ghi `content/toeic/giai-mu/<de>.json`, in tỉ lệ khớp)
- [ ] T021 [US3] Giải mù Đề 1–6: 12 phiếu (Nghe, Đọc) → 12 phiên Claude phụ chạy song song, mỗi phiên viết JSON trả lời → `so` từng đề → `content/toeic/giai-mu/de1.json … de6.json`
- [ ] T022 [US3] Xử lý câu lệch / "2 phương án": sửa câu (kho hoặc `tron/deNN.json`) hoặc ghi "đã xem" lý do đáp án gốc đúng; loại lỗi mới thì thêm tiêu chí vào `docs/TIEU-CHI-DE-TOEIC.md` (+ luật máy nếu tự động được, + câu cài lỗi)
- [ ] T023 [US3] Giải lại các câu đã sửa (`xuat --cau`) tới khi hết `GM-CU`, câu sửa khớp 100%
- [ ] T024 [US3] Bật phần (b) của C69 (trước gộp: C67) trong `tools/test/run.mjs`: Đề 1–6 0 lỗi, 0 cảnh báo chưa xem, đủ giải mù
- [ ] T025 [US3] Dựng giọng Kokoro cho câu nghe đã sửa (`tools/build-audio.py` → `n/`); liệt kê câu Đề 3–6 đổi chữ cái đáp án (in từ máy kiểm) vào đoạn v153 của `CLAUDE.md`

---

## Phase 6: Phát hành đợt kiểm (sau US3)

- [X] T026 Bảng kiểm giáo viên `tools/export-review.mjs` → `docs/kiem-noi-dung.html`: đầu khối đề trọn ghi link bộ tiêu chí + báo cáo máy kiểm
- [ ] T027 Tài liệu v153 (trước gộp: v151; v152 = Đề 5–6 của nhánh trước): `CLAUDE.md` (đầu tệp + đoạn v153), `README.md`, `tools/release.mjs` (mục kiểm iPhone), `specs/011-kiem-noi-dung-de/spec.md` Status, research.md số đo thật
- [ ] T028 `node tools/test/run.mjs`, e2e Chromium, `node tools/release.mjs` (bản 150; trước gộp: 149), `graphify update . && python3 tools/graph-vung.py`, commit, đẩy nhánh; báo người sáng lập kết quả + hỏi đưa lên web

---

## Phase 7: User Story 4 - Soạn Đề 7–8 qua bộ kiểm (P2)

**Goal**: đợt 3 của đặc tả 010 qua đủ 3 lớp kiểm.

**Independent Test**: Đề 7–8: 0 lỗi, 0 cảnh báo chưa xem, giải mù xong (C69 b tự gồm đề mới).

- [ ] T029 [P] [US4] Soạn `content/toeic/tron/de07.json` theo khuôn đề 010 + bộ tiêu chí (tự soát `H-*` từng câu khi soạn)
- [ ] T030 [P] [US4] Soạn `content/toeic/tron/de08.json` như T029
- [ ] T031 [US4] Dựng + máy kiểm (0 lỗi), xử lý cảnh báo; giải mù Đề 7–8 (4 phiếu) → sửa → giải lại tới hết lệch
- [ ] T032 [US4] Giọng Kokoro, bảng kiểm giáo viên, tài liệu v154 (trước gộp: v152) (`CLAUDE.md`, README, release.mjs, đặc tả 010 T022 [X]), test, e2e, `node tools/release.mjs` (bản 151; trước gộp: 150), commit, đẩy; dừng chờ "tiếp" trước Đề 9–10

---

## Dependencies & Execution Order

- Phase 1 → Phase 2 → (US1 ∥ US2) → US3 → Phase 6 → US4.
- US1 (tài liệu) và US2 (mã) làm song song được; C69 (c) cần cả hai.
- US3 cần máy kiểm (US2) và tài liệu (US1). Giải mù (T020–T023) cần đề đã sạch lỗi máy (T018) để khỏi giải lại nhiều lần.
- US4 chỉ bắt đầu sau phát hành bản 150 (đề cũ sạch; trước gộp: 149).

## Parallel Example

- T004 ∥ T005 ∥ T006; T008 ∥ T009 ∥ T010 ∥ T011 ∥ T012 ∥ T013 (cùng một tệp nhưng khác khối hàm: làm lần lượt trong một phiên, đánh [P] để chỉ không phụ thuộc nhau).
- T021: 12 phiên giải mù chạy nền cùng lúc.
- T029 ∥ T030.

## Implementation Strategy

- MVP = US1 + US2 (bộ tiêu chí + máy kiểm có test) → đủ để chặn lỗi hình thức ngay ở lần dựng sau.
- Rồi US3 (dọn đề cũ, phát hành bản 150), rồi US4 (Đề 7–8, bản 151). (Đánh số sau khi gộp main ngày 9/11/2026: main đã có bản 148–149 = v150, v151.)
- Mốc dừng: sau T028 báo người sáng lập số lỗi đã sửa + tỉ lệ khớp giải mù; nếu giải mù khớp < 90% ở đề nào thì báo trước khi soạn Đề 7–8 (cách soạn có vấn đề, cần đổi trước).
