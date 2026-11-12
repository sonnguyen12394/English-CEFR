# Việc: Đáp án giải thích chi tiết

**Bàn giao**: đọc `BAN-GIAO.md` trước. **Model**: T001–T004 Opus 5.5 medium · T005–T006 Sonnet 5.5 medium · T007 Opus 5.5 medium.
**Mốc dừng**: chờ người sáng lập "ok" kế hoạch; sau T004 chờ người sáng lập xem mẫu trên iPhone.

- [x] T001 `tools/kiem-toeic.mjs` `strip` bỏ `gt`; `tools/build-toeic.mjs` giữ `gt`, kiểm đủ trường (FR-002, FR-003)
- [x] T002 Soạn `gt` Đề 1 Part 5 (30 câu kho) — design-critique màn xem lại trước khi sửa
- [x] T003 `totron.js` `trRvQ`: thẻ giải thích (Chọn (X), nghĩa 4 phương án, vì sao, cấu trúc, Dịch); ux-copy; accessibility-review
- [ ] T004 Test C71 phần mẫu, phát hành, đẩy web → người sáng lập xem (mốc dừng)
- [ ] T005 Soạn `gt` Part 5 Đề 2–8
- [ ] T006 Soạn `gt` Part 6 Đề 1–8 (gồm câu chèn)
- [ ] T007 C71 đủ 368 câu; e2e; CLAUDE.md v156, README, release.mjs; phát hành, đẩy web

**12/11/2026**: T001–T003 xong. Tên trường là `lg` (không phải `gt`: câu Part 6 của app đã dùng `q.gt` cho nhãn dạng chỗ trống). T004: test C71 + e2e bước câu 101, phát hành chờ người sáng lập xem trên iPhone.
