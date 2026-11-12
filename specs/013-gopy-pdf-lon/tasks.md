# Việc: Góp ý kèm PDF lớn

- [x] T1 Kiểm mạng phiên Claude tới máy chủ Supabase (tải về được không)
- [x] T2 Migration: kho `gopy-pdf` (26 MB / tệp), bảng `gopy_pdf`, hàm cộng chỗ có khoá dòng
- [x] T3 Hàm máy chủ `gopy-pdf` (start / sign / done / xoa / list / get / del) + khoá `PDF_CLAUDE_KEY`; triển khai
- [x] T4 App: nút 📄, đo cỡ, cắt, băm, tải, thử lại, tải tiếp, gửi góp ý kèm `ctx.pdf`
- [x] T5 App: quản lý góp ý dòng 📄 + Xoá tệp; xoá góp ý hẳn xoá luôn tệp
- [x] T6 Công cụ `tools/gopy-pdf.mjs` list / get / del
- [x] T7 Test C71 (máy chủ giả): cắt đúng cỡ, ghép khớp byte, vượt trần bị chặn, tải tiếp, xoá
- [x] T8 Thử thật: tải PDF 120 MB tạo sẵn, Claude ghép + đọc, xoá, đo dung lượng trả lại
- [x] T9 design-critique + accessibility-review ô góp ý (Chromium khổ iPhone SE); 📘 Luật; CLAUDE.md; phát hành

Ghi chú khi làm: khoá của Claude đổi sang khoá tạm 24 giờ trong bảng gopy_pdf_key (người sáng lập: không muốn tạo secret). Thử thật T8 dùng PDF giả 60 MB (không phải 120 MB).
