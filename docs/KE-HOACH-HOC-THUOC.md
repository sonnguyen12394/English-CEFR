# Kế hoạch làm tiếp: 📖 Học thuộc bài đề TOEIC

Viết ngày 22/11/2026 để chuyển sang tài khoản / phiên khác làm tiếp. Đọc hết tệp này trước khi làm.

## 1. Hiện trạng (bản 205, v209)

- App: 🎯 Luyện đề → TOEIC → 📚 → dòng **📖 Học thuộc bài đề** → trang con `hoc-thuoc/` (khung iframe, tiến độ ở `S.ht`). Xem đoạn v209 trong `CLAUDE.md`.
- 66 bài đã lên web (`hoc-thuoc/bai/`; nguồn `content/hocthuoc/baiN.js` + `baiN.in.json`):

| Đề | Đã có | Ghi chú |
|---|---|---|
| Đề 1 | 45 bài: Part 3 13 · Part 4 10 · Part 6 4 · Part 7 14 · Part 2 3 bộ | Đủ (bài 25–66 + bài 6, 9) |
| Đề 2 | 6: Part 3 #13 · Part 4 #2, #5 · Part 7 #2, #3 · Part 2 bộ 1 | |
| Đề 3 | 5: Part 3 #1, #4 · Part 4 #1, #7 · Part 7 #3 | Bài 1 (Part 3 #1) nằm trong `base.html` |
| Đề 4 | 3: Part 4 #3 · Part 6 #3 · Part 7 #1 | |
| Đề 5 | 4: Part 3 #4 · Part 4 #2, #4 · Part 6 #4 | Bài 2 (Part 4 #4) nằm trong `base.html` |
| Đề 6 | 0 | |
| Đề 7 | 3: Part 3 #4 · Part 6 #2, #4 | |
| Đề 8 | 0 | |

- Một đề đủ = 45 bài: Part 3 13 · Part 4 10 · Part 6 4 · Part 7 15 · Part 2 3 bộ (10 + 10 + 5 câu).
- **Còn khoảng 291 bài** (Đề 2: 39 · Đề 3: 40 · Đề 4: 42 · Đề 5: 41 · Đề 6: 43 · Đề 7: 42 · Đề 8: 44; đã trừ bộ Part 7 dài hơn 200 từ). Số bài mới bắt đầu từ **67**.
- Đề 9–16 (ETS, bảng `de_rieng`): KHÔNG làm. Người sáng lập đã từ chối cho Claude đọc bảng này (21/11). Chỉ làm khi người sáng lập cho phép rõ ràng; nội dung không vào repo.

## 2. Quy trình một đợt (= một đề, ~40 bài)

Chạy mọi lệnh ở gốc repo. Trước khi đọc mã: `graphify query "<câu hỏi>"` (luật trong CLAUDE.md).

1. **Danh sách bài** (phiên chính): tạo `tools/hocthuoc/dotN.json` dạng `[[số bài, đề, "p3", thứ tự], ...]`, theo mẫu `tools/hocthuoc/dot2.json` (Đề 1). Part 2: `[n, đề, "p2", 0 | 1 | 2]` = bộ 10 câu thứ mấy. Bỏ bài đã có (bảng trên). Bộ Part 7 dài hơn 200 từ thì bỏ (Đề 6 có 2, Đề 8 có 1).
2. **Đầu vào**: `node tools/hocthuoc/prep2.mjs content/hocthuoc tools/hocthuoc/dotN.json` → `content/hocthuoc/baiN.in.json`.
3. **Soạn** (thợ `soan-theo-khuon`, Sonnet): mỗi thợ ~7 bài, 6 thợ chạy song song. Lời giao phải tự đủ: đọc `tools/hocthuoc/LUAT-SOAN.md` + bài mẫu theo dạng (bai2 bài nói · bai7 hội thoại 3 người · bai9, bai12 Part 6 · bai19, bai23 Part 7 · bai24 Part 2); chỉ tạo `content/hocthuoc/baiN.js` của mình; tự chạy `node tools/hocthuoc/check.mjs content/hocthuoc/baiN.js` tới khi in OK; không commit.
4. **Soát** (thợ `soat-lai`, Opus medium): đọc ngẫu nhiên ≥ 10% (ít nhất 5 bài) của đợt. Tìm lỗi kiến thức: phương án nhiễu cũng đúng, câu ④ thiếu đáp án gõ, dịch sai, điểm ngữ pháp sai tên bài Nền. Lỗi nặng > 1/10 thì giao soạn lại cả đợt kèm danh sách lỗi.
5. **Dựng**: `python3 tools/hocthuoc/build.py <thư mục tạm>` (bài không qua máy kiểm thì bị bỏ, có in "BỎ bài") → `python3 tools/hocthuoc/build-web.py <thư mục tạm>` → `hoc-thuoc/` mới.
6. **Kiểm**: mở `hoc-thuoc/index.html` qua máy chủ tĩnh, khổ iPhone SE (Chromium chỉ để soát, không thay iPhone): chọn bài mới, chạy ⚡ Đua giờ, 💡 / ✍️; không lỗi trang, không tràn ngang. `node tools/test/run.mjs` (C103 kiểm đủ tệp bài).
7. **Phát hành**: cập nhật bảng mục 1 của tệp này + đoạn v… trong `CLAUDE.md` → `node tools/release.mjs` → commit, push nhánh của phiên → PR vào main (người sáng lập đã cho đẩy lên web) → gộp.

Thứ tự đề gợi ý: Đề 2 → 3 → 4 → 5 → 7 → 6 → 8 (đề đã có vài bài trước, để người học có đề "gần đủ" sớm).

## 3. Ai làm, model, effort

| Bước | Ai làm | Model | Effort | Vì sao |
|---|---|---|---|---|
| 1 Danh sách, 2 đầu vào | Phiên chính | Opus | low–medium | Máy móc nhưng phải chọn bài đúng |
| 3 Soạn ~40 bài | 6 thợ `soan-theo-khuon` | Sonnet | medium | Khuôn + mẫu đã duyệt; low dễ lệch khuôn |
| 4 Soát | `soat-lai` | Opus | medium | Đã có khuôn để so; đợt đầu của tài khoản mới dùng high |
| 5–6 Dựng, test | `tho-may` | Haiku | low | Chỉ chạy lệnh, báo kết quả |
| 7 Phát hành, CLAUDE.md | Phiên chính | Opus | medium | Có test chặn |

- Không dùng Haiku cho nội dung; không dùng max / Fable.
- Hạn mức gói Pro: một đợt ~40 bài (~2.400 câu luyện) tốn nhiều. Làm **một đề mỗi phiên**, hết hạn mức thì dừng sau bước 5 của các bài đã qua máy kiểm, commit, ghi số bài đã xong vào mục 1.
- Rủi ro dùng Sonnet: phương án nhiễu cũng đúng, câu ④ thiếu đáp án gõ (đã gặp ở Đề 1). Cách soát: bước 4 + đọc thêm 2–3 bài.

## 4. Bộ tiêu chí mỗi đợt

| Mã | Tiêu chí | Cách đo | Ngưỡng đạt | Bắt buộc? |
|---|---|---|---|---|
| HT1 | Bài qua máy kiểm khuôn | `check.mjs` / build.py không in "BỎ bài" | 100% | Có |
| HT2 | Lỗi kiến thức nặng | `soat-lai` đọc ≥ 10% | ≤ 1 / 10 bài | Có |
| HT3 | Đủ bài của đề | đếm theo mục 1 | 45 (trừ bộ Part 7 > 200 từ) | Có |
| HT4 | Có giọng đọc | mã giọng trong L không rỗng (Part 3, 4, 2) | ≥ 95% câu | Có |
| HT5 | Bộ test app | `node tools/test/run.mjs` | Đạt hết | Có |
| HT6 | Giao diện trang con | Chromium khổ iPhone SE | 0 lỗi trang, 0 tràn ngang | Có |
| HT7 | Kiểm trên iPhone | người sáng lập thử | 1 bài mới chạy Đua giờ được | Chưa đo được, cần iPhone |
| HT8 | Giáo viên kiểm | giáo viên thật đọc mẫu | — | Chưa đo được, cần giáo viên |

Ngưỡng là ý kiến của Claude. Đánh giá theo quý: hết quý 1/2027 có ≥ 2 người học thật dùng ≥ 5 bài chưa; chưa có thì dừng soạn thêm đề, ưu tiên tìm người dùng.

## 5. Việc tồn (làm khi rảnh, trước hoặc giữa các đợt)

1. **Nối âm / nuốt âm (LK, EL) cho bài 47–66** còn trống: thợ Sonnet theo bài mẫu có LK / EL (bài 2, 7), soát 5 bài.
2. **Bài 46**: vài câu luyện mới gần trùng nhau; viết lại câu trùng.
3. **Ghi chú ở kết quả đề thử**: "Bạn đã học thuộc N bài của đề này, điểm có thể cao hơn sức thật" (yêu cầu của người sáng lập 21/11, chưa làm). Việc giao diện + đọc `S.ht`: phiên chính Opus high, theo luật thiết kế trong `.claude/CLAUDE.md`.
4. **Kiểm iPhone** (người sáng lập): máy chép lời trong khung iframe, tiếng 🔊, tắt mở lại app còn tiến độ, nút "‹ Luyện đề".

## 6. Lời nhắn để dán sang tài khoản mới

> Đọc `docs/KE-HOACH-HOC-THUOC.md` và đoạn v209 trong `CLAUDE.md`. Làm đợt kế tiếp theo mục 2 (bắt đầu Đề 2, số bài từ 67), giao thợ theo mục 3, chấm theo mục 4. Không đọc bảng `de_rieng`. Xong đợt thì phát hành và cập nhật bảng mục 1.
