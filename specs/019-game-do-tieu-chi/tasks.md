# Việc: 019 🗺 Chinh phục đề đo được và hiểu thật

[P] = làm song song được. Câu chuyện: US1 đo · US2 đối chứng · US3 Boss ẩn · US4 ⭐ tạm · US5 bớt ghép nghĩa · US6 gõ khó dần.

## Pha 0: Chuẩn bị
- [x] T001 `docs/TIEU-CHI-GAME-TOEIC.md`: bộ tiêu chí (mã, cách đo, ngưỡng, bắt buộc), lấy từ spec.md
- [x] T002 `tgdo.js` mới + nạp ở `index.html` (sau trochoi.js) + thêm vào `VUNG` của `tools/graph-vung.py`

## Pha 1: US1 đo được (ưu tiên 1)
- [x] T003 [US1] `tgdo.js`: `tgLog(de, n, việc, ok, sh, giây, lv)` ghi `lg` (2.000 dòng), `ag`, `dy`; `tgTran(việc, de)` → mã trận, `tgTranEnd(mã)`
- [x] T004 [US1] `trochoi.js`: gọi `tgLog` ở tgBattle / tgSua / tgHieu; `tgTran` lúc vào trận, `tgTranEnd` lúc ra kết quả; ghi `j[de].t0`, `j[de].w`
- [x] T005 [US1] `tgdo.js`: `tgCrit()` tính G1–G3, H1–H4, N1–N2, V2, E1–E2 → `{ mã, số, ngưỡng, kq: 'ok'|'no'|'na', thiếu }`; H1 / V2 tính tĩnh từ `tgPool`
- [x] T006 [US1] `tgdo.js` `tgCritView()` + nút "🗺 Bộ tiêu chí game" ở `bkTools` (backup.js); dòng đầu ĐẠT / CHƯA ĐẠT a/6
- [x] T007 [US1] C81 phần đo: thoát giữa trận → bỏ dở; ⚪ kèm số thiếu; không ghi `S.to.mock`, không tạo thẻ

## Pha 2: US2 đề đối chứng
- [x] T008 [US2] `tgdo.js`: `S.to.tc.dc`; ô chọn đề ở màn game khi chưa có (cảnh báo đề đã làm); nút làm Phần Đọc 75 phút (`trStart(de, 'R')`); lấy "trước" / "sau" từ `S.to.tronA`
- [x] T009 [US2] `trochoi.js`: bỏ đề đối chứng khỏi chip đề; ô "⚖️ trước a · sau b · chênh"; nhắc làm lần "sau" khi ≥ 2 đề chinh phục
- [x] T010 [US2] C81: đề đối chứng không có trong game, H3 / H4 tính đúng

## Pha 3: US3 🐉 Boss ẩn
- [x] T011 [US3] `tgdo.js` `tgNewPool(de)`: kho tự do → đề chưa làm → đề chơi ít; loại đề đang chơi, đề đối chứng, câu trong `bn`; khoá dạng `t` / `gt` / `qt`
- [x] T012 [US3] `trochoi.js`: câu đạt 🌳 → đẩy dạng vào `bq`; MỘT nút có việc "🐉 Boss ẩn" (sau ôn đến hạn, trước vun cây); trận 1 câu / dạng; đúng → `dg`; sai → nút 📘 bài học dạng (`hlLes` / `xlView`); ghi `bn`, `lo`
- [x] T013 [US3] hàng chọn đề + màn tiêu chí ghi "đã lộ N câu"; dạng hết câu mới ghi rõ
- [x] T014 [US3] C81: câu Boss ẩn chưa gặp, đúng dạng, không thuộc đề đang chơi / đối chứng; `lo` tăng

## Pha 4: US4 ⭐ tạm + Boss tái đấu
- [x] T015 [US4] `tgSua` ghi `tm: 1`; `tgJState` / `tgJCount`: ⭐ tạm không tính 100/100; ô 🌱 nhạt (`.tgt.tam`)
- [x] T016 [US4] việc "✅ Xác nhận N câu" (câu ⭐ tạm ngày < hôm nay, đổi chỗ) trong MỘT nút, sau chữa câu sai
- [x] T017 [US4] Boss tái đấu: lượt xanh hết ⭐ thật, lần tái đấu / làm gần nhất ≥ 7 ngày; đổi chỗ ngẫu nhiên 50% câu (`sh`); sai → 👾
- [x] T018 [US4] C79 sửa theo luồng mới; C81: ⭐ tạm, xác nhận ngày sau, tái đấu 7 ngày

## Pha 5: US5 bớt ghép nghĩa
- [x] T019 [US5] Phiên chính soạn mẫu `ev` 5 câu Part 7 kho (`content/toeic/doc.json`), `tools/build-toeic.mjs` kiểm `ev` kho có nguyên văn trong văn bản
- [x] T020 [US5] `soan-theo-khuon`: soạn `ev` các câu Part 7 kho còn lại (trừ chèn câu [1]–[4]) theo mẫu
- [x] T021 [US5] `soat-lai`: đọc ngẫu nhiên ≥ 16 câu; sai > 1/10 thì làm lại đợt
- [x] T022 [US5] `trochoi.js`: kiểu thử thách `dl` 🔁 diễn đạt lại; thứ tự `ld, ev, dl, go, ng`; lên 🌳 dùng tối đa 1 `ng`
- [x] T023 [US5] C81: mọi đề H1 ≥ 90%, ghép nghĩa ≤ 30% thử thách lên 🌳

## Pha 6: US6 gõ khó dần
- [x] T024 [US6] gợi ý ✍️ theo mức: vun cây = chữ đầu + số chữ + nghĩa câu; ôn mức 1 = bỏ nghĩa câu; ôn mức ≥ 2 = chỉ số chữ; C81 kiểm 3 mức

## Pha 7: Hoàn thiện
- [x] T025 `tho-may`: build-toeic, kiem-toeic, run.mjs, e2e, `graphify update . && python3 tools/graph-vung.py`
- [x] T026 Thiết kế: chụp Chromium khổ iPhone SE màn game / đối chứng / tiêu chí (sáng + tối), design-critique → sửa → accessibility-review
- [x] T027 Đoạn v176 ở CLAUDE.md; phát hành bằng `tools/release.mjs`; ghi "chưa kiểm trên iPhone"
