# Implementation Plan: TOEIC đủ dạng câu (bài học + bài tập theo từng dạng)

**Branch**: `claude/happy-shannon-5j2r27` | **Date**: 2026-11-07 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/001-toeic-du-dang/spec.md`

## Summary

Đủ 33 dạng câu của đề TOEIC L&R: 13 bài học mới (20 → 33), bài tập riêng theo dạng cho mọi dạng (17 lượt luyện theo dạng mới, mở từ bài học và từ "Thêm"), kho thêm ~75 câu (Part 2 +10, Part 3 +3 bài, Part 4 +2 quảng cáo, Part 5 +10 lượng từ, Part 6 +4 đoạn, Part 7 +7 bộ) và viết lại 57 phương án sai của câu chèn Part 6 cũ. Nhận dạng câu suy từ câu hỏi lúc dựng kho (`tools/build-toeic.mjs`), chỉ nhãn tay chỗ không suy được (loại bài nói Part 4, câu thì theo ngữ cảnh Part 6). Không đổi luật đo CEFR, cách ước điểm, luật bản đồ (chỉ thêm ô Part 5 lượng từ).

## Technical Context

**Language/Version**: JavaScript thuần chạy trên trình duyệt (không bước build); Node 22 cho công cụ dựng và test; Python 3 cho dựng giọng.

**Primary Dependencies**: không thêm thư viện cho app. Dựng giọng: kokoro-onnx 0.6.1 + mô hình v1.0 (cài tạm trong scratchpad, không commit), ffmpeg.

**Storage**: `toeic.json` dựng từ `content/toeic/*.json`; tệp giọng `n/*.mp3` + `n/index.json`; trạng thái người học `S.to` (kết quả bài `r`, lịch sử bản đồ `ty`), `S.exl` (bài học đã học) trên Supabase: không đổi lược đồ.

**Testing**: `node tools/build-toeic.mjs` (kiểm dạng mới), `node tools/test/run.mjs` (test C53 mới + test cũ), `tools/test/e2e-webkit.mjs` (máy soạn không có WebKit → ghi "chưa kiểm trên iPhone"); Chromium khổ iPhone SE để soát sơ bộ.

**Target Platform**: web trên iPhone (Safari / WebKit).

**Project Type**: web app một trang (JS thuần + JSON tĩnh).

**Performance Goals**: `toeic.json` 175 KB → ≤ 230 KB; mở màn TOEIC không chậm hơn đáng kể (một lần tải như cũ).

**Constraints**: câu / bài cũ giữ mã; câu Part 2, Part 5 mới thêm vào CUỐI kho (bộ 10 câu đánh số theo vị trí); bài học cũ giữ mã (`to:L:p2`, `to:R:p6`, `to:R:p7`…); không chép đề ETS; nội dung ghi "Claude soạn, chưa giáo viên kiểm".

**Scale/Scope**: 33 dạng · 33 bài học · 17 bài tập theo dạng mới · ~75 câu mới · 57 phương án viết lại · ~70 câu giọng mới.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Nguyên tắc | Đánh giá | Kết quả |
|---|---|---|
| I. Luật đo của người sáng lập | Không chạm 📘 Học / 🔁 Nhớ / Thi chuyển cấp; luyện TOEIC vẫn không tính. Bản đồ điểm TOEIC thêm 1 ô (Part 5 lượng từ) theo luật cũ. | ✅ Qua (không ĐỔI LUẬT ĐO) |
| II. Kiểm giao diện chỉ trên iPhone | Đổi giao diện: khối "🎯 Luyện theo dạng câu" trong "Thêm", danh sách bài học dài hơn. Theo luật thiết kế: design-critique trước, frontend-design + design-system, ux-copy, accessibility-review sau. Máy soạn không có WebKit → báo "chưa kiểm trên iPhone". | ✅ Qua (có điều kiện) |
| III. Test xanh trước khi phát hành | Thêm test C53; sửa test cũ nếu đổi chữ; phát hành bằng `tools/release.mjs`. | ✅ Qua |
| IV. Sửa qua nguồn | Sửa `content/toeic/*.json`, dựng `toeic.json` bằng `build-toeic.mjs`; giọng bằng `build-audio.py`. | ✅ Qua |
| V. Trung thực về độ tin cậy | Nội dung mới ghi "Claude soạn, chưa giáo viên kiểm", vào bảng kiểm giáo viên; tên bịa; không chép ETS. | ✅ Qua |

Sau thiết kế (Phase 1): không phát sinh vi phạm. Không cần Complexity Tracking.

## Project Structure

### Documentation (this feature)

```text
specs/001-toeic-du-dang/
├── spec.md              # đặc tả (đã hỏi người sáng lập 2 câu)
├── plan.md              # tệp này
├── research.md          # quyết định + lý do
├── data-model.md        # dạng câu, nhãn mới trong toeic.json
├── quickstart.md        # cách kiểm
├── contracts/ui.md      # mã bài học, mã bài tập theo dạng, nút
└── tasks.md             # chia việc (speckit-tasks)
```

### Source Code (repository root)

```text
content/toeic/
├── nghe.json      # Part 2 +10 câu (cuối kho), Part 3 +3 bài, Part 4 +2 bài quảng cáo, nhãn loại bài nói ty cho mọi bài Part 4
├── p5.json        # +10 câu dạng det (lượng từ), cuối kho
└── doc.json       # Part 6: viết lại phương án sai câu chèn 19 đoạn, +4 đoạn (nhãn tense); Part 7 +7 bộ
tools/
├── build-toeic.mjs    # suy nhãn dạng (k, ty, t), kiểm dạng mới, in số câu theo dạng
├── export-review.mjs  # thêm mục kiểm cho nội dung mới
└── test/run.mjs       # test C53; sửa test cũ nếu cần
toeic.js       # TO_T5 + det; TO_DR (bài tập theo dạng) + toDrill; khối "🎯 Luyện theo dạng câu" ở "Thêm"; câu chèn [1]–[4] giữ thứ tự phương án
baihoc.js      # XL_TXT.to: 13 bài học mới, sửa mô tả bài cũ; xlTo chọn ví dụ / làm thử theo nhãn dạng; go = data-todr
tomap.js       # TM_SHORT / TM_TIP thêm det
tracuu.json    # t5tip.det (cẩm nang)
huongdan.js    # 📘 Luật: một câu về bài tập theo dạng TOEIC
n/             # giọng câu nghe mới (build-audio.py)
CLAUDE.md      # đoạn v137
app.js, index.html, version.json   # release.mjs tăng phiên bản
```

**Structure Decision**: giữ nguyên cấu trúc dự án (JS thuần, dữ liệu dựng từ `content/`); không thêm tệp mã mới, mở rộng `toeic.js` (bài tập), `baihoc.js` (bài học), `tools/build-toeic.mjs` (nhãn + kiểm).

## Complexity Tracking

Không có vi phạm hiến pháp cần biện minh.
