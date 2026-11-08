# Implementation Plan: Thêm 10 đề thử TOEIC trọn 200 câu

**Branch**: `claude/ecstatic-curie-q9g1ja` | **Date**: 2026-11-08 | **Spec**: [spec.md](spec.md)

## Summary

Soạn Đề 3 → Đề 12 (2.000 câu mới) theo đợt 2 đề, mỗi đợt một bản phát hành. Câu mới chỉ nằm trong đề trọn: mỗi đề một tệp riêng, tải khi vào đề, không vào kho luyện (`TO.p1…p7`), nên phần luyện từng Part, bài học, bản đồ không thể dùng nhầm. Bộ dựng `tools/build-toeic.mjs` kiểm từng đề như kho cũ, thêm kiểm câu trích chứa đáp án (`ev`) có nguyên văn trong lời nghe / bài đọc, không trùng câu, đủ dạng. Bộ chạy `totron.js` giữ nguyên, chỉ thêm bước tải tệp đề.

## Technical Context

**Language/Version**: JS thuần (trang), Node 22 (bộ dựng, test), Python 3 (dựng giọng `tools/build-audio.py`)
**Primary Dependencies**: kokoro-onnx 0.6.1 + mô hình v1.0 (cài tạm trên máy soạn, ~300 MB); không thêm thư viện cho trang
**Storage**: tệp tĩnh trên GitHub Pages: `toeic.json` (kho + danh sách đề), `toeic-tron/deN.json` (đề mới), `n/*.mp3` (giọng)
**Testing**: `node tools/test/run.mjs` (thêm C66), e2e Chromium khổ iPhone 13 (thêm 1 bước)
**Target Platform**: Safari / Chrome trên iPhone
**Project Type**: web app một trang, nội dung tĩnh
**Performance Goals**: mở màn TOEIC không chậm hơn: `toeic.json` không phình (đề mới ở tệp riêng, ~90 KB / đề, chỉ tải khi vào đề)
**Constraints**: không sửa tay `toeic.json`; không chép đề ETS; KHÔNG đổi luật đo
**Scale/Scope**: 10 đề × 200 câu = 2.000 câu; ~2.500 câu nghe (~30 MB giọng); 60 tranh Part 1; 5 đợt

## Constitution Check

| Nguyên tắc | Đánh giá |
|------------|----------|
| I. Luật đo của người sáng lập | Đạt: luyện thi không tính 📘 Học / 🔁 Nhớ / Thi chuyển cấp; không đổi cách tính. |
| II. Kiểm giao diện chỉ trên iPhone | Đạt có điều kiện: chỉ đổi danh sách đề (thêm dòng); ghi "chưa kiểm trên iPhone" tới khi người sáng lập thử. |
| III. Test xanh trước khi phát hành | Đạt: C66 + bộ dựng dừng khi lỗi; phát hành bằng `tools/release.mjs`. |
| IV. Dữ liệu sửa qua nguồn | Đạt: soạn ở `content/toeic/tron/`, dựng ra `toeic-tron/`, không sửa tay tệp dựng. |
| V. Trung thực về độ tin cậy | Đạt: ghi "Claude soạn, chưa giáo viên kiểm"; điểm ước không phải bảng ETS; người / công ty hư cấu. |

Sau thiết kế (Phase 1): không đổi, không có vi phạm cần biện minh.

## Project Structure

### Documentation (this feature)

```text
specs/010-toeic-10-de-tron/
├── spec.md
├── plan.md            # tệp này
├── research.md        # quyết định R1–R9
├── data-model.md      # khuôn tệp đề mới
├── quickstart.md      # cách kiểm từng đợt
├── checklists/requirements.md
└── tasks.md
```

### Source Code (repository root)

```text
content/toeic/tron/de03.json … de12.json   # MỚI: nguồn mỗi đề (đủ câu, đúng thứ tự)
content/toeic/tron.json                    # giữ Đề 1–2 (mã câu kho); thêm danh sách tệp đề mới
toeic-tron/de3.json … de12.json            # MỚI (dựng): đề đã kiểm, nhãn dạng, Part 2 đã xáo
toeic.json                                 # `tron` thêm { id, t, f } cho đề mới (không chứa câu)
tools/build-toeic.mjs                      # kiểm + dựng đề mới (dùng chung hàm kiểm của kho)
tools/build-audio.py                       # đọc thêm câu nghe của toeic-tron/*.json
totron.js                                  # tải tệp đề trước khi dựng (trB), danh sách 12 đề
toeic.js                                   # toTalkQs / toP7Qs giữ `ev` (📍 câu chứa đáp án ở kết quả)
tools/export-review.mjs                    # bảng kiểm giáo viên: thêm câu đề mới
tools/test/run.mjs, tools/test/e2e-webkit.mjs
```

**Structure Decision**: mỗi đề một tệp nguồn + một tệp dựng; kho luyện không đổi.

## Đợt làm

| Đợt | Đề | Bản | Ghi chú |
|-----|----|-----|---------|
| 0 | khung | cùng bản đợt 1 | bộ dựng, totron.js tải tệp, build-audio, C66 |
| 1 | Đề 3–4 | v149 · bản 147 | **mốc dừng**: chờ người sáng lập "tiếp"; khuyên 1 người học thật làm 1 đề app + 1 đề ETS |
| 2 | Đề 5–6 | v150 | |
| 3 | Đề 7–8 | v151 | |
| 4 | Đề 9–10 | v152 | |
| 5 | Đề 11–12 | v153 | |

## Complexity Tracking

Không có vi phạm hiến pháp cần biện minh.
