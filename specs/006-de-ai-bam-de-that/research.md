# Research: Đề AI bám cấu trúc đề thật

## Nguồn đã tra (7/11/2026)

- ielts.org, IELTS Academic Listening format: 4 phần, mỗi phần 10 câu; câu theo đúng thứ tự thông tin trong lời nghe; nghe 1 lần.
- Cambridge English, "C1 Advanced Overview of the Listening Paper": Phần 3 là 6 câu trắc nghiệm, 4 lựa chọn.
- Trang luyện thi (test-english.com, global-exam.com, esl-lounge.com, engxam.com): B2 First Reading and Use of English Part 1 có 8 chỗ trống, 4 lựa chọn; Part 4 có 6 câu viết lại từ khoá; C1 Part 4 3–6 từ; C2 Part 4 3–8 từ; IELTS Academic Reading 3 bài, tổng khoảng 2.000–2.750 từ, 40 câu.
- Chưa tra được nguồn chính thức (ghi *hiểu biết* trong data-model): B2 Part 4 2–5 từ; độ dài từng bài Cambridge; số câu từng phần Nghe Cambridge.

## Quyết định

**D1. Tách bảng khuôn + máy kiểm ra tệp JS thuần `supabase/functions/de-ai/khuon.js`.**
- Vì: test hiện chỉ chạy được `trung.js` / `chude.js` bằng node; `spec` / `clean` nằm trong `index.ts` (TypeScript, nhập gói npm) nên chưa có test nào kiểm khuôn. Tệp JS thuần chạy được cả Deno (máy chủ) lẫn node (test C61).
- Đã xét: giữ trong `index.ts` và chạy node `--experimental-strip-types` (không được: `index.ts` nhập `npm:` không có trên máy test).

**D2. Luật theo từng dạng câu (`TY`), không theo cả đề.**
- Vì: đề IELTS Đọc nay có 2–3 dạng trong một bài; nhãn cố định (T/F/NG), số lựa chọn, giới hạn từ, "đáp án có trong bài", "theo thứ tự" là của từng nhóm câu.
- Đã xét: một luật cho cả đề như v141 (không đủ cho bài nhiều dạng).

**D3. Xếp câu theo thứ tự bằng vị trí câu chứa đáp án (`ev`).**
- Vì: AI hay lệch thứ tự; máy xếp lại rẻ hơn soạn lại. Câu không có `ev` hoặc `ev` không tìm thấy thì giữ chỗ cũ; các nhóm xếp theo câu đầu tiên của nhóm.
- Đã xét: bắt soạn lại khi lệch (tốn lượt AI, có thể hết giờ 150 giây).

**D4. IELTS Nghe theo Part, dạng câu vẫn ghi theo khoá cũ.**
- Vì: bản đồ band và thống kê dùng khoá dạng câu (L-form, L-mc, L-match). Part 4 ghi chú → nhóm `L-form` như bài có sẵn (v130: điền bảng / câu → L-form). Khoá chọn đề mới `L-note`; `L-sa` thành đề cũ.

**D5. Đọc IELTS dạng mới dùng khoá đã có trên bản đồ.**
- `R-mf`, `R-se`, `R-sum`, `R-dia` đã có trong `IE_TY` (v87). Ghi chú / bảng / lưu đồ → `R-dia` ("Điền sơ đồ / bảng / quy trình").

**D6. Task 1 biểu đồ: AI đưa số liệu theo khuôn của bộ vẽ sẵn có (`ieChart`).**
- Khuôn `chart = { kind: line | bar | pie | table, title, unit, cats, series: [{ name, v }] }`; máy kiểm: 3–8 nhãn, 1–4 dãy (tròn 1–2), số ≥ 0, đủ phần tử; tròn đơn vị % thì mỗi dãy cộng 98–102. Bản đồ / quy trình không làm bằng AI (cần vẽ).

**D7. Câu trích (hàm ý, ý định) và câu chèn kiểm bằng máy.**
- Câu có trích dẫn trong ngoặc kép: phần trích phải có nguyên văn trong bài / lời nghe, không thì bỏ câu (lỗi nhẹ). Câu chèn [1]–[4]: bài phải có đủ 4 dấu, không thì bỏ câu.

**D8. Tin ngắn Cambridge (`sn`) là câu lẻ, mỗi câu kèm văn bản của nó.**
- Vì: đề thật in mỗi tin cạnh câu hỏi của nó; dạng câu lẻ (`single`) có sẵn (như viết lại câu). Máy kiểm: tin ≤ 40 từ.

**D9. Giờ của máy chủ.**
- Bài IELTS dài ~2 lần đầu ra cũ. Gói Supabase Free giới hạn 150 giây; giữ `T_ALL` 140 giây, `T_GEN` 100 giây. Rủi ro: chạm giờ khi AI chậm → đề báo "AI soạn quá lâu, thử lại". Đo khi có khoá; nếu ≥ 2 / 10 đề chạm giờ thì giảm phần giải thích (`why_vi` ngắn hơn) hoặc hạ effort lượt soạn.

**D10. Chi phí (ước, chưa đo).**
- Đọc IELTS dài ~0,25 USD / đề (cũ ~0,15); Nghe một Part ~0,20; dạng khác gần như cũ. Mốc SC-005: Đọc IELTS ≤ 0,30, còn lại ≤ 0,20; đo bằng 🛠 "Đề AI: số lượt, token, tiền 7 ngày".
