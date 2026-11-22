# Luật soạn bài học thuộc TOEIC (khuôn đã duyệt, rút kinh nghiệm 2 lần soát)

Thư mục: /tmp/claude-0/-home-user-English-CEFR/48c67d5c-dc08-58ba-be65-4b058158838d/scratchpad/bai

- Đầu vào: `baiN.in.json` có L = câu [người nói, câu tiếng Anh, '', mã giọng], exq = câu hỏi đề thật, dang, kind, title, nguon, g (bảng của đề nếu có).
- Khuôn mẫu, đọc kỹ trước khi soạn:
  - bai2.js: bài nói.
  - bai7.js: hội thoại 3 người.
  - bai9.js, bai12.js: văn bản Part 6.
  - bai19.js, bai23.js: văn bản Part 7.
  - bai24.js: bộ hỏi – đáp Part 2.
- Đầu ra: `baiN.js` chứa `const BAIN = { meta, L, IPA, STR, LK, INT, PAU, EL, VNK, CUM, VNY, EXQ, NEWQ2, MU };`. Chỉ tạo tệp của mình, không sửa tệp khác.

## Luật

0. **Chọn mục:** 7 cụm từ + 5 điểm ngữ pháp có TRONG bài, ưu tiên thứ hay ra trong TOEIC: cụm công sở, collocation, loại từ Part 5, thì, bị động, mệnh đề quan hệ, giới từ / liên từ, to V / V-ing, so sánh. Không chọn tên riêng, không chọn từ quá dễ. Bài ngắn, ít điểm ngữ pháp thì chọn cả cấu trúc câu (câu hỏi Wh-, đề nghị "Would you like…", mệnh lệnh lịch sự…).
1. **L:** giữ NGUYÊN người nói, câu tiếng Anh, mã giọng. Chỉ điền bản dịch tiếng Việt tự nhiên. Dòng tiêu đề, dòng giờ trong lịch cũng dịch, giữ tên riêng.
2. **meta** = { de, dang, t, sub, who }:
   - de: 'Đề X · Part Y · <loại>'.
   - dang: đúng chuỗi `dang` của đầu vào.
   - t: tên bài tiếng Việt ngắn.
   - sub: 1 câu, kết thúc "Chạm một câu để nghe và xem dịch.".
   - who: { <mỗi người nói>: [vai tiếng Việt, nhãn ngắn ≤ 4 ký tự] }.
     - Hội thoại: A nữ, B nam, C nữ thứ hai (giọng của app), ví dụ A: ['Khách', 'Nữ'].
     - Bài nói N: [vai đúng bài, '📢'].
     - Văn bản W: ['E-mail' | 'Thư' | 'Thông báo' | 'Tin nhắn' | 'Hoá đơn' …, '✉️'].
     - Part 2: A: ['Người hỏi', 'Nữ'], B: ['Người đáp', 'Nam'].
3. **IPA** Anh–Mỹ, mỗi câu một chuỗi các từ cách nhau bằng "|".
   - SỐ TỪ = số từ của câu tách theo dấu cách. Ký hiệu đứng riêng ("—", "(1)", "·") chép nguyên.
   - Từ chức năng đọc dạng nhẹ (of /əv/, to /tə/, can /kən/, the /ðə/ hoặc /ði/ trước nguyên âm).
   - Ngày tháng đọc số thứ tự. Giờ "9:00" đọc "naɪn".
   - Viết theo dạng `[...].map(x => x.split('|'))`.
4. **STR / LK / EL / INT / PAU** như mẫu. Chỉ ghi nối âm, nuốt âm có thật; không có thì để mảng rỗng. "thank you" là nối âm, không phải nuốt âm.
5. **VNK:** mỗi câu 1–5 cụm (câu > 4 từ thì ≥ 2 cụm). Ghép các cụm bằng dấu cách PHẢI ra đúng y bản dịch.
6. **VNY:** mỗi câu 0–5 ý chính, mỗi ý vài cách nói. Không dùng từ quá chung (được, để, có, là, và, của, cho, đi, rồi).
7. **EXQ** lấy từ exq:
   - Thường: { q, o: [a, ...w], a: 0, vi: lời giải tiếng Việt ngắn trích câu chứa đáp án }.
   - Part 6: q = 'Chỗ trống k: ' + câu chứa chỗ đó, đáp án thay bằng ___. Câu chèn thì q = "Câu nào điền vào chỗ trống k hợp nhất?".
   - exq < 3 câu thì tự thêm câu hỏi đúng sự thật trong bài. Câu Part 2 chỉ có 3 phương án thì thêm 1 nhiễu.
8. **NEWQ2:** 7 câu MỚI có ___, 4 phương án, a: 0 (đáp án luôn ở vị trí ĐẦU, app tự xáo).
9. **CUM:** 7 [cụm, nghĩa].
10. **MU:** 12 mục, 7 từ vựng (v1..v7, g:'v', có vi) rồi 5 ngữ pháp (g1..g5, g:'g'). Mỗi mục có t, line, hl (chép NGUYÊN VĂN trong câu đó) và 4 bậc:
    - b1: s chép nguyên văn từ câu của bài, phần đang hỏi bọc [[ ]]. Ngữ pháp: vi kết thúc bằng " · 🧱 Bài Nền liên quan: <tên> · <cấp>".
    - b2: 'Câu mới: “…” — …', kiểm tra hiểu.
    - b3: từ vựng 1 câu, ngữ pháp 2 câu; có ___.
    - b4: tự gõ: q có ___, hint, ans: [MỌI đáp án chấp nhận], vi.
    - Câu trắc nghiệm luôn a: 0.
11. **Mỗi câu trắc nghiệm CHỈ MỘT đáp án đúng.**

## Lỗi nặng đã gặp: phải tự kiểm từng câu

- **Nhiễu thì quá khứ, to V, V-ing, từ nối gần nghĩa vẫn hợp câu.** Ví dụ "The bus ___ at the station every ten minutes": "stopped" cũng đúng. "We had not received your payment yet": "had" cũng đúng. "Meanwhile, the company cut its costs" cũng hợp lý. Câu chia thì PHẢI có mốc khoá (tomorrow, next week, every day + chủ ngữ số ít, already, since…), hoặc nhiễu phải sai ngữ pháp thật. Đặt từng phương án nhiễu vào chỗ trống, đọc lên, nếu thành câu đúng thì thay nhiễu khác.
- **b4 thiếu đáp án hợp lý.** Gợi ý "vì" thì phải nhận because / as / since. "người tham dự" thì nhận participants / attendees. "bao gồm" thì nhận cover / include. Nhận cả dạng viết tắt ('ll, n't) và nháy cong ’.
- **Câu mới sai collocation:** "register to the conference" sai, phải là "register for". Đọc lại mọi câu tiếng Anh tự soạn.
- **b3 chép nguyên câu b2 hoặc NEWQ2** thì lộ đáp án. Câu luyện trong một bài không được trùng nhau.
- **Dịch và VNK phải khớp:** sửa bản dịch thì sửa luôn VNK.

## Kiểm

Sau mỗi bài chạy: `node /tmp/claude-0/-home-user-English-CEFR/48c67d5c-dc08-58ba-be65-4b058158838d/scratchpad/bai/check.mjs /tmp/claude-0/-home-user-English-CEFR/48c67d5c-dc08-58ba-be65-4b058158838d/scratchpad/bai/baiN.js`, sửa tới khi in "OK bài N". Rồi tự đọc lại đáp án, nhiễu, dịch.
