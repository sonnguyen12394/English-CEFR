# Kế hoạch cài đặt: 🎯 Luyện đề do AI soạn và chấm

**Nhánh**: `claude/ecstatic-curie-q9g1ja` | **Ngày**: 2026-11-07 | **Đặc tả**: [spec.md](spec.md)

**Đầu vào**: `specs/003-luyen-de-ai/spec.md`

## Tóm tắt

Thêm tab thứ 5 🎯 Luyện đề cạnh 📚 Học. Tab mở màn kỳ thi của mục tiêu (IELTS / TOEIC / Cambridge); mọi màn luyện thi đang ở 📚 Học chuyển sang đây. Đầu màn có ô 🤖 Đề mới do AI soạn: trang gọi hàm máy chủ mới `de-ai`, hàm soạn đề bằng Claude chạy nền, kiểm đề bằng máy + một lượt AI giải độc lập, lưu đề vào bảng `de_ai`; trang hỏi trạng thái, rồi cho làm đề bằng bộ chạy câu hỏi có sẵn (`ieRun`), chấm câu bằng đáp án, chấm Viết / Nói bằng `el-cham` có sẵn. Kết quả vào `S.dai` và bản đồ kỳ thi (nguồn `ai`); không tính luật đo CEFR. Trần chung 200 lượt AI / ngày cho cả app, bỏ trần mỗi người.

## Bối cảnh kỹ thuật

**Ngôn ngữ / phiên bản**: JavaScript thuần ở trang (không bước dựng); TypeScript trên Deno cho hàm máy chủ Supabase.

**Phụ thuộc chính**: `@supabase/supabase-js@2.45.4` (trang và máy chủ), `npm:@anthropic-ai/sdk@1.3.0` + `zod@4.6.7` (máy chủ, như `el-cham`); mô hình `claude-opus-5-5`.

**Lưu trữ**: Supabase Postgres: bảng mới `de_ai`, bảng có sẵn `el_cham` (đếm lượt), `vocab_state` (dữ liệu học `S`, thêm `S.dai` nhỏ).

**Kiểm thử**: `node tools/test/run.mjs` (Chromium, `fake-sb.js` giả Supabase; thêm giả `functions.invoke` + bảng `de_ai`), `node tools/test/e2e-webkit.mjs`; test mới C57.

**Nền tảng đích**: Safari / Chrome trên iPhone (WebKit). Máy soạn chỉ có Chromium → ghi "chưa kiểm trên iPhone".

**Loại dự án**: ứng dụng web một trang + hàm máy chủ Supabase.

**Mục tiêu hiệu năng**: đề đầu tiên của một kỹ năng ≤ 120 giây; đề thứ hai trở đi ≤ 3 giây (đề dự trữ); màn kỳ thi mở ≤ 1 giây như hiện nay.

**Ràng buộc**: Supabase gói Free: hàm máy chủ ≤ 150 giây, CPU 2 giây [đã kiểm]; trần 200 lượt AI / ngày cả app; không chép đề chính thức; không đổi luật đo; `S` phải nhỏ (ghi nguyên khối mỗi lần lưu).

**Quy mô**: hiện 2 tài khoản, ~0–1 người học thật; 3 kỳ thi × 4–5 kỹ năng × ~30 dạng.

## Kiểm theo hiến pháp

| Nguyên tắc | Trạng thái |
|---|---|
| I. Luật đo của người sáng lập | ✅ Không đổi. Đề AI không tạo thẻ, không đụng 📘 Học / 🔁 Nhớ / Thi chuyển cấp; chỉ ghi `S.dai` và bản đồ kỳ thi (bản đồ không phải luật đo). Test C57 kiểm `cards` / `units` / `exams` không đổi. |
| II. Kiểm giao diện chỉ trên iPhone | ✅ Thử sơ bộ Chromium khổ iPhone SE / 13; báo "chưa kiểm trên iPhone"; danh sách kiểm iPhone ở quickstart. Đổi giao diện theo luật thiết kế (chấm màn → biến CSS chung → chữ ux-copy → kiểm khả năng tiếp cận). |
| III. Test xanh trước khi phát hành | ✅ C57 mới; sửa C13, C27, C29, C37, C50, e2e theo chỗ mới; phát hành bằng `tools/release.mjs` (v141). |
| IV. Dữ liệu sửa qua nguồn | ✅ Không đụng tệp dựng (`ielts.json`, `toeic.json`…). Đề AI là dữ liệu lúc chạy trên Supabase. |
| V. Trung thực về độ tin cậy | ✅ Nhãn "AI soạn / AI chấm, chưa giáo viên kiểm"; band / điểm ghi "ước tính"; lời nhắc cấm chép đề chính thức; đề chưa kiểm chéo ghi rõ. |
| Ràng buộc kỹ thuật | ✅ JS thuần, CSS trong `index.html`, RLS cho bảng mới, đã tra `graphify` trước khi lập kế hoạch. |

Kiểm lại sau thiết kế: không có vi phạm. Một điểm cần nói rõ (không vi phạm): v87 từng quyết "app không tự soạn cho đủ đề"; người sáng lập đã đổi ở v123 và nay chọn "AI soạn mọi đề".

## Cấu trúc

### Tài liệu (tính năng này)

```text
specs/003-luyen-de-ai/
├── spec.md · plan.md · research.md · data-model.md · quickstart.md
├── contracts/de-ai.md
├── checklists/requirements.md
└── tasks.md            (bước /speckit-tasks)
```

### Mã nguồn

```text
supabase/
├── migrations/20261107_v137_de_ai.sql      # MỚI: bảng de_ai + RLS + chỉ mục
└── functions/
    ├── de-ai/trung.js                    # MỚI: hàm thuần chống trùng (chọn chủ đề, cụm 5 từ, so câu hỏi), test được bằng node
    ├── de-ai/index.ts                      # MỚI: soạn đề nền, chọn chủ đề + danh sách tránh, máy kiểm, kiểm trùng, giải độc lập, ghi el_cham
    └── el-cham/index.ts                    # SỬA: bỏ PER_USER, trần chung đếm cả kind 'de'

deai.js        # MỚI: S.dai, gọi de-ai + hỏi trạng thái, màn chờ, máy kiểm phía trang, chuyển đề → câu ieRun,
               #      Viết / Nói qua ieWrite / ieSpeakCore + aiBtn, ghi kết quả + bản đồ, đề dự trữ, làm dở 24 giờ, danh sách đề đã làm
app.js         # SỬA: syncTabs (#ie, #dai → tab 'ld'), bấm tab 'ld' → exOpen()
index.html     # SỬA: nút tab thứ 5, <script deai.js>, CSS thanh dưới 5 mục + ô 🤖 (biến CSS chung)
parts.js       # SỬA: overview bỏ thẻ "Luyện …" + "Kỳ thi khác"; xHome thay "‹ Học" bằng hàng kỳ thi, chỗ cắm ô 🤖 (o.ai); xSkill thêm nút 🤖
toeic.js       # SỬA: exSwitch / data-exthi / data-exsel về tab mới; toeicView, toSkView truyền ô 🤖
ielts.js       # SỬA: ieRun nhận o.src; ieltsView, ieSkView truyền ô 🤖; ieWrite / ieSpeak nhận đề ngoài + tự gọi AI chấm
dieuhuong.js   # SỬA: cbView truyền ô 🤖; lối tắt ở 👤 Tôi
cbmap.js       # SỬA: cbSkView ô 🤖; bản đồ Cambridge đọc S.dai.r
lotrinh.js     # SỬA: tính phút luyện đề cho màn / bài AI
huongdan.js    # SỬA: 📘 Luật: 5 tab, mục luyện thi + đề AI
backup.js      # SỬA: 🛠 công cụ người sáng lập: số đề AI + token + tiền ước 7 ngày (đọc el_cham qua hàm máy chủ hoặc chỉ số trong S.dai)
tools/test/fake-sb.js, run.mjs, e2e-webkit.mjs   # SỬA / THÊM test C57
tools/graph-vung.py                              # SỬA: thêm deai.js vào khu "Luyện thi chung"
CLAUDE.md, README.md                             # SỬA: đoạn v141
```

**Quyết định cấu trúc**: một tệp trang mới `deai.js` (theo kiểu mỗi tính năng một tệp của dự án) + một hàm máy chủ mới; các màn cũ chỉ thêm chỗ cắm, không viết lại.

## Thứ tự làm (theo kịch bản trong spec)

1. **Thử trước (spike, tốn ~$0,30, cần người sáng lập đồng ý)**: triển khai bản nháp `de-ai` chỉ một dạng (IELTS Đọc `R-tf`), gọi 2 lần, đo giây / token / chất lượng; xác nhận khoá AI chạy (bảng `el_cham` đang 0 dòng). Đo xong mới chốt độ dài đề và mô hình.
2. **P1 Kịch bản 4 + 1**: tab mới + chuyển màn; bảng + hàm `de-ai` đủ họ đề Đọc / câu lẻ cho 3 kỳ thi; ô 🤖, màn chờ, làm đề, kết quả.
3. **P2 Kịch bản 2 + 3**: Viết / Nói (đề AI + AI chấm), Nghe (lời AI + giọng máy).
4. **P3 Kịch bản 5**: danh sách đề đã làm, bản đồ 3 kỳ thi nguồn `ai`, đề dự trữ, làm dở 24 giờ, số tiền ở 🛠.
5. **Phát hành**: test, tài liệu, `node tools/release.mjs` (v141), triển khai migration + hàm lên Supabase (việc ra ngoài: làm khi người sáng lập "ok" kế hoạch này), đẩy nhánh.

## Rủi ro chính và cách chặn

| Rủi ro | Chặn |
|---|---|
| Đề sai đáp án / hai đáp án đúng | 3 lớp kiểm (R3); nút ⚑ Câu sai; mốc dừng 20 đề |
| Tốn tiền | trần 200 / ngày; khuyên đặt giới hạn chi tiêu tháng ở Anthropic Console; đếm token mỗi đề |
| Quá 150 giây | chạy nền + hạn chờ AI; đề ngắn theo dạng |
| Khoá AI chưa cài | bước thử 1 phát hiện sớm; báo lời thường, bài có sẵn vẫn dùng |
| AI soạn đề trùng đề cũ | lưu mọi đề; máy chọn chủ đề chưa gặp; kiểm trùng toàn văn với ≥ 3 đề gần nhất (tới 50); soạn lại 1 lần (R16) |
| Người học không dùng | SC-007: xét lại sau 1 quý |

## Theo dõi độ phức tạp

Không có vi phạm hiến pháp cần biện minh.
