# Implementation Plan: Cambridge đủ dạng (bài học + bài tập theo từng dạng của đề thật)

**Branch**: `claude/happy-shannon-5j2r27` | **Date**: 2026-11-07 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/003-cambridge-du-dang/spec.md`

## Summary

Lấp dạng thiếu và sửa chỗ sai của mục tiêu 🎓 Cambridge (không làm dày kho): ① ✍️ Viết theo thể loại B1 → C2 (7 thể loại; bài học + bài tập + nút ở Thêm); ② 🗣 Nói thảo luận cặp đúng đề thật (bài học dùng nhiệm vụ 👥 nói cặp có sẵn; đề thử Nói A2 → C2 đổi phần đóng vai sang thảo luận cặp, chấm ④ Tương tác bằng dấu hiệu đáp lời / lý do / hỏi lại / chốt; tên và thứ tự phần đúng đề thật A2, C2); ③ 📖 Đọc phần 1 tin ngắn A2 / B1 (2 bộ mỗi cấp, dạng mới `sn`; đề thử, bài học, bài tập); ④ 8 bài tiêu chí chấm (Viết 4 cho B1 → C2, Nói 4 cho A2 → C2). Không đổi luật đo.

## Technical Context

**Language/Version**: JavaScript thuần trên trình duyệt; Node 22 cho công cụ dựng / test.

**Primary Dependencies**: không thêm thư viện.

**Storage**: `nghe.json` mục `dt` dựng từ `content/bs/dangthi.json` (`tools/build-b.mjs`); `viet.json` (đề Viết, có `genre` + bài mẫu); `cap.json` (15 nhiệm vụ thảo luận cặp, đã có giọng); kết quả `S.cbx`, `S.cap`, đề thử `mkRuns` — không đổi lược đồ.

**Testing**: `node tools/build-b.mjs` (kiểm bộ tin ngắn), `node tools/test/run.mjs` (test C57 mới + cũ: kiểm đề thử mọi cấp, C44, C46, C47…), Chromium khổ iPhone SE soát màn mới.

**Target Platform**: web trên iPhone (Safari / WebKit).

**Project Type**: web app một trang.

**Performance Goals**: `nghe.json` tăng ~8 KB; `baihoc.js` tăng ~25 KB (chữ bài học).

**Constraints**: mã bài học cũ giữ (B1 "Phần 1: đọc tin ngắn" giữ nhãn; bài Nói phần thảo luận giữ khoá `rp`); A2 phần 1, 3 tách đôi nên mã bài cũ của phần gộp đổi (chưa có người học dùng). Không chép đề Cambridge.

**Scale/Scope**: +7 thể loại × cấp (B1 3 · B2 5 · C1 5 · C2 4 = 17 bài học thể loại) · +8 bài tiêu chí (Viết 4 ở 4 cấp, Nói 4 ở 5 cấp) · 4 bộ tin ngắn (22 văn bản) · sửa bài Nói phần thảo luận ở 5 cấp + đề thử Nói 5 cấp.

## Constitution Check

| Nguyên tắc | Đánh giá | Kết quả |
|---|---|---|
| I. Luật đo | Không chạm 📘 Học / 🔁 Nhớ / Thi chuyển cấp; luyện Cambridge không tính. Đổi đề thử Nói (đề thử là luyện thi, không tính luật đo). | ✅ |
| II. Kiểm giao diện chỉ trên iPhone | Màn bài học / bài thi Cambridge thêm dòng, Thêm của Viết thêm hàng nút: design-critique → frontend-design + design-system → ux-copy → accessibility-review; ghi "chưa kiểm trên iPhone". | ✅ |
| III. Test xanh trước khi phát hành | Test C57; `tools/release.mjs`. | ✅ |
| IV. Sửa qua nguồn | Bộ tin ngắn ở `content/bs/dangthi.json` → `build-b.mjs`; đề Viết B1 trùng sửa ở nguồn của `viet.json`. | ✅ |
| V. Trung thực | Ghi "Claude soạn, chưa giáo viên kiểm"; bảng kiểm giáo viên; không chép đề. | ✅ |

## Project Structure

### Documentation (this feature)

```text
specs/003-cambridge-du-dang/
├── spec.md · plan.md · research.md · data-model.md · quickstart.md
├── contracts/ui.md
└── tasks.md
```

### Source Code (repository root)

```text
content/bs/dangthi.json   # +4 bộ tin ngắn (k "sn": A2 ×2 · 6 văn bản, B1 ×2 · 5 văn bản)
tools/build-b.mjs         # kiểm bộ "sn": số văn bản, ≤ 40 từ, 3 phương án khác nhau, đáp án không lẫn
dangthi.js                # DT_Q.sn; dtSet nhận bộ chỉ định (bài tập theo bộ)
uoe.js                    # A2: phần 1 tin ngắn + phần 3 bài đọc dài (tách phần gộp); B1 phần 1 dùng tin ngắn
cbmap.js                  # CB_KEY / CB_DT / CB_SHORT / CB_HOWT cho "sn"; cbBai dòng theo bộ tin ngắn; nút "genre" (Viết theo thể loại) ở Thêm + cbClick
baihoc.js                 # XL_TXT.cb: 7 thể loại, 8 tiêu chí, thảo luận cặp (lời mẫu + làm thử), tin ngắn; xlCb: bài thể loại / tiêu chí; XL_CBS theo cấp + tên phần A2 / C2
mocknoi.js                # mkSpeak: phần thảo luận cặp (mode "cap") thay đóng vai, thứ tự / tên phần theo cấp; mkSpeakScore: ④ Tương tác dùng capChecks
mock.js                   # mkResult ghi S.cbx cho bộ tin ngắn; nạp cap.json trước đề thử Nói
tools/export-review.mjs · tools/test/run.mjs · huongdan.js · CLAUDE.md · app.js / index.html / version.json (release)
```

**Structure Decision**: giữ cấu trúc; mở rộng `baihoc.js`, `cbmap.js`, `mocknoi.js`, `dangthi.js`, `uoe.js`, công cụ dựng.

## Complexity Tracking

Không có vi phạm.
