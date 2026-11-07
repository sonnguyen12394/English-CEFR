# Quickstart: kiểm đề AI bám cấu trúc đề thật

## 1. Máy soạn (không cần khoá AI)

```bash
node tools/test/run.mjs        # phải xanh hết; C61 kiểm bảng khuôn + máy kiểm, C57 luồng đề AI với máy chủ giả
```

C61 kiểm (chạy thẳng `supabase/functions/de-ai/khuon.js` bằng node):
- mọi dạng ở danh sách trang (`daiDangs`) có khuôn ở máy chủ và ngược lại; Pre-A1 / A1 không còn dạng ngoài đề thật, không có Viết AI;
- số câu / số lựa chọn / giới hạn từ / độ dài khớp bảng [data-model.md](data-model.md) (B2 → C2 điền 8 chỗ, viết lại câu B2 5 · C1 6 · C2 8 từ, Nghe C1 / C2 trắc nghiệm 4 lựa chọn, IELTS Nghe 10 câu, IELTS Đọc 13 câu 700–900 từ);
- máy kiểm xếp câu theo vị trí câu chứa đáp án; bỏ câu trích không có trong bài; bỏ câu chèn khi bài thiếu [1]–[4]; từ chối biểu đồ sai số liệu; nhận đáp án viết lại câu C2 7 từ;
- đề v1 cũ vẫn qua máy kiểm phía trang và mở được.

Chromium khổ iPhone SE: màn đề AI IELTS Đọc dài (cuộn được, không tràn ngang), Task 1 biểu đồ đường vẽ ra, Cambridge A1 hàng 🤖 không có Viết.

## 2. Sau khi người sáng lập cài khoá `ANTHROPIC_API_KEY`

1. Triển khai lại hàm máy chủ `de-ai` (index.ts + khuon.js + trung.js + chude.js).
2. Làm thử 1 đề mỗi loại: IELTS Đọc (T/F/NG), IELTS Nghe Part 4, TOEIC Part 3, Cambridge B2 điền trắc nghiệm, Movers chọn câu đáp.
3. Xem: số câu, độ dài, thứ tự, tên phần đề thật; 🛠 "Đề AI: số lượt, token, tiền 7 ngày" (mốc: Đọc IELTS ≤ 0,30 USD / đề).
4. Ghi lại đề nào chạm giờ ("AI soạn quá lâu"): ≥ 2 / 10 thì làm theo research D9.
