# Feature Specification: Sai ở đâu · học lại gì (câu sai trong đề → bài học có sẵn)

**Feature Branch**: `claude/ecstatic-curie-q9g1ja` · **Created**: 2026-11-08 · **Status**: Draft (chờ người sáng lập "ok")

**Input**: "Khi làm đề xong nếu sai thì có cách nào phát hiện và đối chiếu với các bài học có sẵn để học và ôn lại và Rà soát các bài học đã đủ dạng để ôn lại bài khi làm sai trong đề thi" (người sáng lập, 8/11/2026).

## Hiện trạng (rà 8/11/2026 bằng script đọc toàn kho, chỉ đọc)
- **Độ phủ bài học theo dạng câu**
  - 🌏 IELTS: 12 dạng Đọc + 5 dạng Nghe có trong kho đều có 📘 bài học và 🏋️ bài tập dạng đó. Đề AI / đề soạn sẵn dùng thêm dạng `L-note` (Nghe Part 4 ghi chú ONE WORD ONLY): chưa nối bài học nào.
  - 💼 TOEIC: 33 dạng đều có bài học + bài tập. Nhưng 14 bài học không có ô bản đồ: tranh cảnh Part 1; Part 2 câu Yes / No, lựa chọn, đề nghị, trần thuật; Part 3–4 câu hỏi chung, việc sắp làm, hàm ý, có bảng, loại bài nói; Part 6 chèn câu; Part 7 suy luận / NOT, từ gần nghĩa, chèn câu. Bản đồ TOEIC chỉ ghi theo Part, dạng Part 5, bẫy Part 2 (`toLog`), nên sai các dạng trên bao nhiêu cũng không bao giờ được ghi "yếu". Câu đề AI / soạn sẵn TOEIC không có nhãn dạng (chỉ Part).
  - 🎓 Cambridge: mọi phần của mọi bài thi (10 cấp) có một bài học + ô bản đồ.
- **Màn kết quả**: đề thử IELTS (có bảng theo dạng), TOEIC (theo Part), Cambridge (theo phần), bài luyện / đề AI / đề soạn sẵn (`ieRun`, chỉ số câu đúng), dạng đề thật Cambridge (`uRun`) đều liệt kê câu sai nhưng KHÔNG có nút tới bài học / bài tập của dạng đó. Đường gián tiếp duy nhất: kết quả vào bản đồ → khi "đủ chắc" (≥ 8 câu ở ≥ 2 bài) bài học ghi "yếu · xem lại"; sau một đề thường chưa đủ.
- Lỗi chữ: kết quả đề thử TOEIC còn ghi "chưa có Part 1" (Part 1 có từ v127).

## Quyết định đề xuất (chờ duyệt)
- **D1 Phạm vi**: mọi màn kết quả trong 🎯 Luyện đề (IELTS, TOEIC, Cambridge: đề thử, bài có sẵn, đề AI, đề soạn sẵn); đề trọn 200 câu (008) dùng lại khi làm. Thi chuyển cấp của 🧱 Nền để đợt sau (đề thi lên cấp dùng lại câu khi thi lại: chỉ được chỉ tên bài, không lộ đáp án).
- **D2 Sai vì từ**: trong "Xem câu sai" có câu chứa đáp án + từ chưa học trong câu đó (chip 📌 lưu Sổ từ, ôn trong 🔁 ôn chung).
- **D3 Cờ "vừa sai"**: hiện ngay sau 1 đề khi một dạng sai ≥ 2 câu và đúng < 60%; tách khỏi "yếu" của bản đồ (bản đồ giữ luật đủ chắc). Hết cờ khi học lại bài đó (xong làm thử) hoặc lần sau đúng ≥ 75% dạng đó (≥ 3 câu). Ngưỡng là ý kiến của Claude.
- **D4 Thứ tự**: làm 009 trước 008 (nhỏ hơn, có ích ngay cho mọi đề; 008 dùng lại ô này). Phiên bản: 009 = v146 (bản 144), 008 = v147.

## User Stories
### US1 (P1) Xem ngay sai ở đâu, học lại gì
Ở mọi màn kết quả có câu sai, ô "🎯 Sai ở đâu · học lại gì": mỗi dạng một dòng (tên dạng, sai a / b), dạng sai nhiều nhất lên trước; nút 📘 Học lại dạng này (mở bài học) và 🏋️ Luyện dạng này (bài tập dạng đó); "Xem N câu sai" gập (câu, bạn chọn, đáp án, vì sao, 📍 câu chứa đáp án).
**Acceptance**: mọi câu sai thuộc đúng một dòng; bấm 📘 mở đúng bài học của dạng, về lại kết quả được; bấm 🏋️ mở bài tập dạng đó.
### US2 (P2) Danh sách bài học nhớ dạng vừa sai
**Acceptance**: sau một đề có dạng sai ≥ 2 câu và < 60%, danh sách 📘 Bài học của kỹ năng đó đưa bài dạng ấy lên đầu (sau bài "yếu" của bản đồ), ghi "vừa sai · xem lại"; học lại xong thì hết cờ.
### US3 (P3) Sai vì từ
**Acceptance**: mỗi câu sai có câu chứa đáp án (khi tìm được) và tối đa 5 từ chưa học trong câu đó; chạm 📌 lưu vào Sổ từ.

## Requirements
- FR-001 Hàm chung nối câu → bài học: IELTS theo `q.ty` (chọn HAI, điền bảng tách riêng); TOEIC theo Part + nhãn (Part 1 `k`, Part 2 `ty` + bẫy, Part 3–4 `qt`, Part 5 `t`, Part 6 `gt`, Part 7 `qt`); Cambridge theo cấp + bài thi + phần; đề AI Cambridge qua `CB_AI`.
- FR-002 Câu TOEIC của đề AI / soạn sẵn có nhãn dạng suy từ câu chữ, cùng luật với `tools/build-toeic.mjs` (test so luật trang với nhãn của cả kho).
- FR-003 IELTS `L-note` → bài "Điền phiếu, bảng, lưu đồ".
- FR-004 `S.xs` ghi dạng vừa sai theo id bài học (≤ 60 dòng); `xlBlock` dùng để xếp và ghi nhãn.
- FR-005 Đếm lượt bấm 📘 / 🏋️ từ ô này để đo (xem ở 🛠 Công cụ).
- FR-006 KHÔNG đổi luật đo (📘 Học / 🔁 Nhớ / Thi chuyển cấp); KHÔNG đổi bản đồ (ô, luật đủ chắc, nhóm đang chữa).
- FR-007 Giao diện theo luật thiết kế của dự án: nút ≥ 44 px, biến CSS chung, chữ ngắn có dấu.

## Success Criteria
- SC-001 Test duyệt toàn kho: 100% câu (IELTS mọi dạng Đọc / Nghe + `L-note`; TOEIC 33 dạng, cả câu đề soạn sẵn; Cambridge mọi phần 10 cấp) nối tới một bài học có thật.
- SC-002 Có ô ở 5 màn kết quả khi có câu sai: đề thử IELTS / TOEIC / Cambridge, bài luyện (gồm đề AI / soạn sẵn), dạng đề thật Cambridge.
- SC-003 Sau 1 đề có dạng sai ≥ 2 câu và < 60%: bài học dạng đó lên đầu danh sách với nhãn "vừa sai".
- SC-004 Test cũ + e2e xanh; Chromium khổ iPhone SE không lỗi trang, không tràn ngang.
- Mốc đo (1 quý, 2/2027): tỉ lệ lượt có câu sai mà người học bấm 📘 / 🏋️ từ ô này; dưới 20% thì đổi chỗ hiện (vd. đưa vào 📅 Hôm nay).

## Rủi ro
- Dạng câu chưa chắc là nguyên nhân: sai có thể vì từ / ngữ pháp, không vì cách làm (nhận định, chưa có dữ liệu app). D2 chỉ cho thấy từ chưa học, chưa tự phân biệt được.
- Một đề ít câu mỗi dạng → cờ "vừa sai" có thể nhiễu.
- Chưa có người học thật dùng 🎯 Luyện đề.
