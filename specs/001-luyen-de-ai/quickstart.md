# Kiểm nhanh: 🎯 Luyện đề AI

## Cần có

- Supabase: bảng `de_ai` (migration `supabase/migrations/20261107_v137_de_ai.sql`), hàm `de-ai` đã triển khai, khoá `ANTHROPIC_API_KEY` đã cài (người sáng lập).
- Máy soạn: `node`, Chromium có sẵn (Playwright).

## 1. Test tự động (không tốn tiền AI)

```bash
node tools/test/run.mjs          # phải xanh hết; test C53 dùng hàm de-ai giả (fake-sb.js trả đề mẫu cố định)
```

C53 kiểm:
- Thanh dưới 5 mục, 🎯 Luyện đề sau 📚 Học; khổ 320 px không tràn ngang, mỗi nút ≥ 44 px.
- 📚 Học không còn thẻ "Luyện …" và hàng "Kỳ thi khác"; màn kỳ thi sáng tab 🎯.
- Ô 🤖 có MỘT nút chính; bấm → màn chờ → đề mẫu hiện → làm hết → kết quả có đáp án + giải thích + nhãn "AI soạn, chưa giáo viên kiểm".
- Kết quả vào `S.dai.r`; IELTS dạng `R-tf` vào `S.ie.ty` nguồn `ai`; `S.cards`, `S.units`, `S.exams` không đổi (luật đo).
- Máy kiểm phía trang loại đề hỏng (đáp án không có trong lựa chọn).
- Lỗi 429 / 503 / quá giờ: báo bằng lời thường, màn kỳ thi vẫn dùng được.
- Việc luyện đề ở 📅 Hôm nay mở đúng màn trong tab 🎯.
- Chống trùng (hàm thuần `supabase/functions/de-ai/trung.js`, test bằng node): đề cùng chủ đề / trùng câu hỏi / chung ≥ 15% cụm 5 từ bị báo trùng; hai bài khác chủ đề không bị báo; chọn chủ đề bỏ qua chủ đề đã gặp, hết thì lấy chủ đề lâu nhất.

## 2. Thử thật một lần (TỐN TIỀN, ~$0,15 mỗi đề; cần người sáng lập đồng ý)

Người sáng lập đồng ý ngày 7/11/2026 ("Ok" sau khi đọc kế hoạch: chi ~0,30 USD đo thử, giữ lớp AI giải lại, đưa bảng + hàm lên Supabase). Lần gọi đầu bị chặn: máy chủ chưa cài khoá `ANTHROPIC_API_KEY`. Cách cài: Anthropic Console → API Keys → tạo khoá (đặt giới hạn chi tiêu tháng) → Supabase → dự án → Edge Functions → Secrets → thêm `ANTHROPIC_API_KEY`. Không dán khoá vào khung chat.

1. Mở app, đặt mục tiêu IELTS 6.5 ở 🧭 Lộ trình.
2. Tab 🎯 Luyện đề → ▶ Làm đề AI mới (Đọc). Ghi số giây tới khi đề hiện (mục tiêu ≤ 120 giây).
3. Làm bài; đối chiếu từng đáp án với bài đọc bằng mắt; ghi số câu sai đáp án / có hai đáp án đúng (mục tiêu ≤ 1 câu / đề).
4. Làm đề thứ hai cùng kỹ năng: phải hiện gần như ngay (đề dự trữ). Chủ đề phải khác đề thứ nhất.
4b. Tạo liền 5 đề Đọc IELTS: 5 chủ đề khác nhau; xem cột `lan` trong `de_ai` (số đề phải soạn lại vì trùng).
5. Viết 1 bài Task 2 → AI chấm → có band 4 tiêu chí.
6. Supabase: `select kind, count(*), sum(tin), sum(tout) from el_cham group by kind;` → tính tiền theo bảng giá ở research.md R6.

## 3. iPhone (người sáng lập)

Mở trên Safari iPhone: thanh dưới 5 mục đọc rõ, bấm trúng; làm 1 đề Nghe (giọng máy đọc được, 2 giọng khác nhau); khoá máy giữa lúc chờ đề rồi mở lại → đề vẫn hiện. Claude không kiểm được trên iPhone: ghi "chưa kiểm trên iPhone".

## Mốc dừng / đổi hướng

- Sau 20 đề thật: > 1 câu sai / đề → tạm tắt dạng đó, sửa lời nhắc hoặc đổi cách soạn.
- Đề đầu > 120 giây ở > 10% lần → hỏi người sáng lập: đổi Sonnet 5.5 hoặc rút ngắn đề.
- Sau 1 quý (2/2027): < 3 người học thật làm ≥ 5 đề AI → xét lại tính năng trước khi mở rộng (SC-007).
