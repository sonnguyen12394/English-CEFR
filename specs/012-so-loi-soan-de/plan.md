# Implementation Plan: Sổ lỗi soạn đề

**Branch**: `claude/kiem-noi-dung-de-7l02h6` | **Date**: 2026-11-10 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/012-so-loi-soan-de/spec.md` (đã làm rõ 4 câu với người sáng lập)

## Summary

Gom mọi lỗi đã tìm và đã sửa khi soạn, khi làm thử 8 đề thử TOEIC trọn thành **một danh mục** (`content/toeic/so-loi.json`, ~30–40 loại lỗi), mỗi loại có ví dụ thật trước → sau, bắt bằng gì, đã gặp ở đâu, luật để không lặp lại. Nối danh mục vào bộ tiêu chí và quy trình soạn đề; thêm 6 luật máy mới cho lỗi máy bắt được (đo trước trên 8 đề, R7). **Cân bằng vị trí đáp án cả 8 đề** (người sáng lập chọn): bộ dựng tính hoán vị phương án theo cách "sửa ít nhất" và ghi vào dữ liệu đề; app, máy kiểm, phiếu giải mù cùng đọc; kết quả giải mù và bài làm đã lưu được đổi chữ theo cùng phương án. Hiện danh mục ở **tab thứ 6 "🛡️ Kiểm đề"** ngay cạnh 🎯 Luyện đề, ai cũng thấy; mỗi mục có nút ✓ Đúng ý / ✗ Chưa đúng + ghi chú, gửi về như góp ý để Claude đọc.

## Technical Context

**Language/Version**: JavaScript thuần trong trình duyệt (không bước build); công cụ Node 22 (`tools/*.mjs`); Python 3 + Kokoro cho giọng đọc
**Primary Dependencies**: không thêm thư viện. Dùng sẵn: `toqt.js` (`tqNat`), `totron.js` (đề thử trọn), `gopy.js` (hàng đợi góp ý), `tools/build-toeic.mjs`, `tools/kiem-toeic.mjs`, `tools/giai-mu.mjs`
**Storage**: tệp tĩnh `kiemde.json` (dựng từ `content/toeic/so-loi.json`); dấu ✓ / ✗ trong dữ liệu học `S.kd`; phản hồi vào bảng `gopy` sẵn có (`kind: 'khac'`, `ctx.view: 'kiemde'`); hoán vị phương án trong `toeic.json` (Đề 1–2) và `toeic-tron/deN.json` (Đề 3–8); `toeic-tron/doi-chu.json` để chuyển bài làm cũ
**Testing**: `node tools/test/run.mjs` (C69 mở rộng: 6 luật mới có câu cài lỗi + câu sạch; C70 mới: sổ lỗi + cân bằng); e2e `tools/test/e2e-webkit.mjs` thêm bước tab Kiểm đề (chạy bản Chromium khi máy soạn không có WebKit)
**Target Platform**: Safari / Chrome trên iPhone (WebKit); kiểm sơ bộ Chromium khổ iPhone SE / 13
**Project Type**: web app một trang (PWA), dữ liệu học trên Supabase
**Performance Goals**: mở tab < 1 giây (tệp `kiemde.json` dự kiến < 60 KB); không ảnh hưởng tốc độ mở đề thử trọn
**Constraints**: dùng được không mạng; vùng bấm ≥ 44 px; 6 tab vừa 320 px không cuộn, không cắt chữ; không đổi luật đo; không gọi AI; không thêm bảng máy chủ
**Scale/Scope**: 8 đề × 200 câu; ~30–40 mục lỗi; 6 luật máy mới; ~1.000 câu Part 3–7 xét lại thứ tự (dự kiến đổi chữ ~25–35% câu); Part 2: ~15–25 câu đổi hoán vị → dựng lại ~40–60 câu giọng đọc

## Constitution Check

| Nguyên tắc | Đánh giá |
|---|---|
| I. Luật đo của người sáng lập | Không chạm 📘 Học / 🔁 Nhớ / Thi chuyển cấp. Đề thử trọn là luyện thi, không tính luật đo. ✅ |
| II. Kiểm giao diện chỉ trên iPhone | Tab mới + màn mới: kiểm sơ bộ Chromium, ghi "chưa kiểm trên iPhone", có mục trong danh sách kiểm iPhone của `release.mjs`. ✅ |
| III. Test xanh trước khi phát hành | C69 mở rộng, C70 mới, e2e thêm bước; phát hành bằng `release.mjs`. ✅ |
| IV. Sửa qua nguồn | Danh mục sửa ở `content/toeic/so-loi.json` → dựng `kiemde.json`; hoán vị do bộ dựng ghi, không sửa tay `toeic.json` / `toeic-tron/*`. ✅ |
| V. Trung thực về độ tin cậy | Màn ghi "Claude soạn, chưa giáo viên kiểm"; giải mù cũng là Claude (ghi rõ giới hạn). ✅ |
| Quy trình thiết kế (CLAUDE.md, .claude/CLAUDE.md) | design-critique trước, frontend-design / design-system / ux-copy khi làm, accessibility-review sau. ✅ |

Không có vi phạm. Đánh giá lại sau thiết kế: không đổi.

## Project Structure

### Documentation (this feature)

```text
specs/012-so-loi-soan-de/
├── spec.md · plan.md · research.md · data-model.md · quickstart.md
├── contracts/ui.md
├── checklists/requirements.md
└── tasks.md            (bước /speckit-tasks)
```

### Source Code (repository root)

```text
content/toeic/so-loi.json        MỚI · nguồn danh mục lỗi (Claude soạn)
kiemde.json                      MỚI · dựng từ nguồn + số liệu máy (không sửa tay)
kiemde.js                        MỚI · màn 🛡️ Kiểm đề, ✓ / ✗ + ghi chú
index.html                       tab thứ 6, CSS thanh dưới, nạp kiemde.js
app.js                           syncTabs, bấm tab, APP_V
toqt.js                          tqNat thêm số chữ / giờ chữ / thời lượng / nhãn
totron.js                        đọc hoán vị `ord`, chuyển bài làm cũ (doi-chu.json)
toeic.json · toeic-tron/*.json   dựng lại (hoán vị, Part 2 cân bằng)
toeic-tron/doi-chu.json          MỚI · bảng đổi chữ cũ → mới
tools/build-toeic.mjs            cân bằng (sửa ít nhất), ghi `ord`, dựng kiemde.json
tools/kiem-toeic.mjs             đọc `ord`; luật C-CAN, C-SO-KHUON, C-LAP-NOI, P34-THUTU, P1-GIOI, P34-NGUYEN
tools/giai-mu.mjs                (qua kiem-toeic) phiếu theo `ord`
content/toeic/giai-mu/*.json     đổi chữ da / chon / hai một lần
content/toeic/kiem-ok.json       "đã xem" cho câu đúng mà luật mới báo
docs/TIEU-CHI-DE-TOEIC.md        quy trình nối sổ lỗi; tiêu chí mới
tools/test/run.mjs · kiem-mau.json · e2e-webkit.mjs   C69, C70, bước e2e
n/                               giọng Part 2 câu đổi hoán vị
CLAUDE.md · README.md · tools/release.mjs             đoạn v155, danh sách kiểm iPhone
```

**Structure Decision**: giữ cấu trúc hiện tại (web app một trang, mỗi màn một tệp JS, dữ liệu dựng bằng `tools/`). Tính năng gồm 1 tệp màn mới, 1 nguồn dữ liệu mới, sửa bộ dựng / máy kiểm / đề thử trọn.

## Phases

1. **Danh mục (US1)**: gom lỗi từ 5 nguồn (R2) → `so-loi.json`; bộ dựng kiểm + dựng `kiemde.json`; bộ tiêu chí nối quy trình; test C70.
2. **Luật máy mới (US1, FR-003)**: mở rộng `tqNat` (R5) → 6 luật (R7) + câu mẫu; xử lý câu bị báo trong 8 đề (sửa → giải lại, hoặc "đã xem").
3. **Cân bằng (US4)**: chụp thứ tự cũ → thuật toán sửa ít nhất trong bộ dựng → `ord` + Part 2 → app / máy kiểm đọc `ord` → đổi chữ kết quả giải mù → `doi-chu.json` + chuyển bài làm cũ trong app → giọng Part 2 → kiểm 56 Part.
4. **Tab + màn (US2)**: design-critique → thanh dưới 6 tab → `kiemde.js` → ux-copy → accessibility-review.
5. **Phản hồi (US3)**: ✓ / ✗ + ghi chú → `S.kd` + góp ý; hướng dẫn Claude đọc phản hồi.
6. **Hoàn tất**: tài liệu (CLAUDE.md v155, README, release.mjs), test, e2e, phát hành bản 152, commit, đẩy.

## Rủi ro và mốc dừng

- **6 tab chật trên iPhone nhỏ**: đo ở 320 px; nếu chữ vẫn bị cắt khi đã 11 px thì báo người sáng lập trước khi phát hành (phương án: bỏ chữ, chỉ biểu tượng + nhãn dài khi chạm giữ — không tự làm).
- **Cân bằng đổi chữ đáp án**: mọi câu đổi chữ được ghi vào bảng đổi; bài làm cũ chuyển được; nếu thuật toán phải đổi > 40% câu của một Part thì dừng, báo lại.
- **Luật mới báo nhiều câu đang có**: mỗi câu bị báo phải sửa (rồi giải lại) hoặc ghi "đã xem" có lý do; nếu một luật báo > 15 câu đúng ở 8 đề thì hạ thành tiêu chí người soát.
- **Ước công**: lớn (nhiều tệp, ~1 ngày làm); không cần người sáng lập làm gì ngoài xem kế hoạch và thử trên iPhone sau khi phát hành.

## Complexity Tracking

Không có vi phạm hiến pháp cần biện minh.
