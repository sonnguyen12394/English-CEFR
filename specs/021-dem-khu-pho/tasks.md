# Việc 021: 🌙 Đêm ở Khu phố

## Đợt 1 · Nền
- [x] T001 design-critique màn 🏙 Thành phố hiện tại (Chromium khổ iPhone SE), ghi 3 vấn đề.
- [x] T002 Tạo `khupho.js` (nạp sau thanhpho.js), CSS `.kp*` trong index.html, biến `--kp-*`; `S.to.kp` (snd, hoc, bay).

## Đợt 2 · US1 bản đồ ngày + đêm có câu thật (P1)
- [x] T003 `cyView` vẽ bản đồ: hàng chọn đề, 8 nhà theo `CY_PHO` (mờ khi đề không cần), lâu đài (Chinh phục đề), chuông; Mầm đi bằng chạm; chạm nhà → thẻ phố (bậc, số câu, đang sai) + Vào phố; "Thêm" gập chứa danh sách thẻ cũ.
- [x] T004 `kpPick(de)`: chọn 5 việc theo R2; nhà của việc có dấu !.
- [x] T005 Màn việc: trắc nghiệm Part 5 / 6 / 7 (R3), nối dây (R4); chấm, lời giải từ `lg`.
- [x] T006 `kpMark`: ghi ⭐ Chinh phục đề + lịch ôn phố (R6).
- [x] T007 Vòng đêm: cư dân máy (R7), tầm nhìn, ru ngủ, tắt đèn (sửa = 1 câu đề), thanh việc chung, thắng / thua.

## Đợt 3 · US2 họp (P1)
- [x] T008 `kpLaw(de)`: luật đúng / sai từ câu đề (R5) + `KP_LAW` dự phòng.
- [x] T009 Họp: báo / chuông, lời khai lần lượt (tố, đổ tội, chối), bỏ phiếu, màn đuổi, ô luật sai → đúng, Hồ sơ bẫy (`S.to.kp.bay`).

## Đợt 4 · US3 cảm giác + tiếp cận (P2)
- [x] T010 Âm thanh (R8), màn toàn màn hình, đom đóm, nhân vật đi / thở / nói; chế độ học; giảm chuyển động.
- [x] T011 accessibility-review (sáng + tối, 44 px, tương phản), ux-copy các chữ.

## Đợt 5 · Kiểm + phát hành
- [x] T012 Test C99, sửa C82 nếu cần; e2e bước Thành phố.
- [x] T013 Chạy `tools/test/run.mjs`, e2e (tho-may); chấm lại G1–G12, W1–W8 trong app.
- [x] T014 CLAUDE.md đoạn v202, 📘 Luật mục luyện thi, `tools/release.mjs`, graphify update, commit, PR, gộp main.
