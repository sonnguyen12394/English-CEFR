# Implementation Plan: Bộ kiểm nội dung đề TOEIC

**Branch**: `claude/ecstatic-curie-q9g1ja` | **Date**: 2026-11-09 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/011-kiem-noi-dung-de/spec.md`

## Summary

Ba lớp kiểm cho câu đề thử trọn TOEIC, dùng chung cho đề cũ và đề mới:

1. **Bộ tiêu chí** viết tay `docs/TIEU-CHI-DE-TOEIC.md`: mỗi tiêu chí một mã, theo Part, có ví dụ đúng / sai lấy từ chính dữ liệu của app, ghi máy kiểm được hay phải người / giải mù kiểm; kèm quy trình soạn một đề. CLAUDE.md trỏ tới.
2. **Máy kiểm** `tools/kiem-toeic.mjs`: luật cố định, chia **lỗi** (chắc chắn sai, dừng dựng) và **cảnh báo** (có thể sai, phải sửa hoặc ghi "đã xem" kèm lý do trong `content/toeic/kiem-ok.json`, gắn dấu nội dung câu nên câu đổi thì cảnh báo hiện lại). Gắn vào `tools/build-toeic.mjs` (lỗi chặn dựng) và test C67 (0 lỗi + 0 cảnh báo chưa xem mới được phát hành). Báo cáo một trang `docs/kiem-de-toeic.html` cho người sáng lập.
3. **Giải mù** `tools/giai-mu.mjs`: xuất phiếu làm bài không đáp án (đánh số 1–200 và chữ cái A–D đúng như trong app), phiên Claude phụ làm, đối chiếu đáp án, lưu kết quả `content/toeic/giai-mu/deN.json`; câu lệch / "2 phương án đều được" / câu đã sửa sau khi giải thành cảnh báo của máy kiểm.

Rồi chạy cả 3 lớp trên Đề 1–6, sửa, phát hành bản 149 (v151); sau đó soạn Đề 7–8 qua cùng quy trình, phát hành bản 150 (v152).

## Technical Context

**Language/Version**: JavaScript (Node 22, ES module) cho công cụ; dữ liệu JSON. Không đổi mã app chạy trên trình duyệt (trừ khi sửa câu thì chỉ đổi dữ liệu).

**Primary Dependencies**: không thêm thư viện. Băm dấu nội dung bằng `node:crypto` (md5, 10 ký tự). Thứ tự phương án như app: hàm `trH` (FNV-1a) chép từ `totron.js`, sắp `[đáp án, ...phương án sai]` theo `trH(mãĐề + sốCâu + chữ)`; Part 1 / 2 theo chữ cái A–D / A–C; câu chèn [1]–[4] giữ thứ tự.

**Storage**: tệp trong repo: `content/toeic/kiem-ok.json` (cảnh báo đã xem), `content/toeic/giai-mu/deN.json` (kết quả giải mù), `docs/kiem-de-toeic.html` (báo cáo dựng ra, không sửa tay).

**Testing**: `tools/test/run.mjs` thêm C67: (a) bộ câu cài lỗi `tools/test/kiem-mau.json` → mỗi luật tự động bắt đúng câu của nó; bộ câu sạch → 0 kết quả; (b) Đề 1–6 thật: 0 lỗi, 0 cảnh báo chưa xem, đề nào cũng đã giải mù; (c) mã tiêu chí trong máy kiểm đều có trong `docs/TIEU-CHI-DE-TOEIC.md`.

**Target Platform**: máy soạn (Linux, Node). Báo cáo HTML xem được trên điện thoại qua GitHub Pages.

**Project Type**: công cụ dòng lệnh + tài liệu + sửa dữ liệu nội dung.

**Performance Goals**: máy kiểm 6 đề (1.200 câu) < 1 phút (thực tế dự kiến < 2 giây).

**Constraints**: không đổi luật đo; không sửa tay `toeic.json` / `toeic-tron/*`; câu nghe đổi chữ thì dựng lại giọng Kokoro; Đề 3–6 sửa thì ưu tiên giữ chữ cái đáp án (Part 2 giữ chỉ số đáp án nguồn; Part 3–7 thứ tự theo chữ của phương án, nên ưu tiên sửa lời bài / câu hỏi hơn sửa phương án, câu đổi chữ cái được liệt kê).

**Scale/Scope**: 6 đề × 200 câu (Đề 1–2 = 400 câu của kho luyện, sửa ở kho), ~40 luật tự động, 12 lượt giải mù (mỗi đề 2 phiếu: Nghe 1–100, Đọc 101–200), rồi Đề 7–8.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Nguyên tắc | Kế hoạch | Kết quả |
|---|---|---|
| I. Luật đo của người sáng lập | Không chạm 📘 / 🔁 / Thi chuyển cấp; luyện thi không tính | ✅ |
| II. Kiểm giao diện chỉ trên iPhone | Không đổi màn app; báo cáo là trang tài liệu; câu sửa vẫn ghi "chưa kiểm trên iPhone" | ✅ |
| III. Test xanh trước khi phát hành | C67 mới; phát hành bằng `tools/release.mjs` | ✅ |
| IV. Dữ liệu sửa qua nguồn | Sửa `content/toeic/*.json`, `content/toeic/tron/deNN.json` rồi `build-toeic.mjs`, `build-audio.py` | ✅ |
| V. Trung thực về độ tin cậy | Giải mù cũng là Claude (không phải người độc lập), ghi rõ; nội dung vẫn "chưa giáo viên kiểm" | ✅ |
| Tra bản đồ mã trước khi sửa | `graphify query` cho build-toeic / totron trước khi sửa | ✅ (làm ở bước làm) |

Sau thiết kế (Phase 1): không phát sinh vi phạm. Không cần mục Complexity Tracking.

## Project Structure

### Documentation (this feature)

```text
specs/011-kiem-noi-dung-de/
├── spec.md
├── plan.md              # tệp này
├── research.md          # quyết định R1–R9 + danh mục luật
├── data-model.md        # Tiêu chí, Kết quả, Đã xem, Kết quả giải mù
├── quickstart.md        # cách chạy và kết quả mong đợi
├── contracts/
│   ├── cli.md           # lệnh của kiem-toeic.mjs và giai-mu.mjs
│   └── tep.md           # khuôn kiem-ok.json, giai-mu/deN.json, phiếu giải mù, câu trả lời giải mù
├── checklists/requirements.md
└── tasks.md             # /speckit-tasks
```

### Source Code (repository root)

```text
docs/
├── TIEU-CHI-DE-TOEIC.md      # MỚI: bộ tiêu chí (viết tay)
└── kiem-de-toeic.html        # MỚI: báo cáo (dựng bằng kiem-toeic.mjs)
tools/
├── kiem-toeic.mjs            # MỚI: máy kiểm (module + lệnh)
├── giai-mu.mjs               # MỚI: xuất phiếu / đối chiếu giải mù
├── build-toeic.mjs           # SỬA: gọi máy kiểm, lỗi chặn dựng
└── test/
    ├── run.mjs               # SỬA: thêm C67
    └── kiem-mau.json         # MỚI: câu cài lỗi + câu sạch
content/toeic/
├── kiem-ok.json              # MỚI: cảnh báo đã xem
├── giai-mu/de1.json … de6.json   # MỚI: kết quả giải mù
├── *.json, tron/de03–06.json # SỬA: câu sai
└── tron/de07.json, de08.json # MỚI (đợt sau, US4)
CLAUDE.md                     # SỬA: luật "soạn đề TOEIC theo docs/TIEU-CHI-DE-TOEIC.md", đoạn v151 (+ v152)
```

**Structure Decision**: giữ kiểu repo hiện có (công cụ trong `tools/`, nguồn trong `content/`, tài liệu trong `docs/`). Máy kiểm là module riêng để bộ dựng, test và lệnh đứng riêng dùng chung một bộ luật.

## Thứ tự làm (chi tiết ở tasks.md)

1. Bộ tiêu chí + máy kiểm + bộ câu cài lỗi + C67 (chưa bật cổng 0 cảnh báo).
2. Chạy máy kiểm trên Đề 1–6 → sửa lỗi, xử lý cảnh báo (chỉnh luật nếu báo nhầm nhiều).
3. Giải mù Đề 1–6 (12 phiên phụ chạy song song) → đối chiếu → xử lý câu lệch → giải lại câu đã sửa.
4. Bật cổng C67 (0 lỗi, 0 cảnh báo chưa xem, đủ giải mù); dựng giọng câu nghe đã sửa; báo cáo; tài liệu v151; phát hành bản 149; đẩy nhánh. Hỏi người sáng lập có đưa lên web không.
5. Soạn Đề 7–8 theo bộ tiêu chí → máy kiểm → giải mù → giọng → phát hành bản 150 (v152).

## Rủi ro

- Luật báo nhầm nhiều (quét thử: 85 + 17 dòng nhầm) → người không đọc nổi. Cách giảm: chỉ luật chắc chắn mới là lỗi; luật nghi ngờ thu hẹp (vd. phương án sai chỉ xét câu do chính người được hỏi nói), chỉnh ngưỡng trên Đề 1–6 tới ≤ 5 cảnh báo / 100 câu.
- Giải mù dùng cùng dòng mô hình với người soạn → có thể cùng điểm mù. Ghi rõ là giới hạn; không thay giáo viên.
- Part 1 giải mù chỉ thấy mô tả tranh (emoji + vị trí), Part 2–4 chỉ đọc chữ: câu lệch có thể do phiếu, không do câu → đọc lại trước khi sửa.
- Sửa phương án ở Đề 3–6 đổi chữ cái đáp án → bài làm đã lưu của người sáng lập lệch ở câu đó; liệt kê câu đổi.
- Tốn lượt gói Pro: 12 phiên giải mù + 2 phiên cho mỗi đề mới (người sáng lập đã đồng ý).
