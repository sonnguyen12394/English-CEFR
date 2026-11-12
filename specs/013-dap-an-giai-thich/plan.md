# Kế hoạch: Đáp án giải thích chi tiết (Part 5–6)

1. **Mẫu (mốc dừng 1)**: soạn `gt` cho Đề 1 Part 5 (30 câu, câu kho trong `content/toeic/doc.json`) + màn thẻ ở `trRvQ` (totron.js) + bộ dựng giữ `gt`, kiểm đủ trường + `strip` bỏ `gt`. Phát hành, người sáng lập xem trên iPhone. Chờ "ok".
2. **Soạn tiếp**: Part 5 Đề 2–8 (210 câu), rồi Part 6 cả 8 đề (128 chỗ trống, câu chèn có dịch câu chèn). Tự soát từng câu (đáp án khớp, nghĩa đúng loại từ).
3. **Test**: C71 (đủ `gt` 368 câu, khoá `og` = 4 phương án, `ly` nhắc đáp án, dấu nội dung không đổi → giải mù vẫn 200/200), e2e mở thẻ. Kiểm tiếp cận sáng / tối, 320 px.
4. **Phát hành** bằng `node tools/release.mjs`, đẩy web, ghi CLAUDE.md v156, README, danh sách kiểm iPhone.

Rủi ro: 368 lời giải dài là việc soạn lớn (ước 1–2 phiên làm việc); sai nghĩa / sai lý do khó máy bắt → tự soát + nhờ người sáng lập / giáo viên xem mẫu Đề 1. Nếu sau mẫu anh muốn đổi kiểu thì chỉ phải sửa 30 câu.
