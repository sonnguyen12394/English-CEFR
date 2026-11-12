# Việc: Góp ý kèm PDF lớn

- [ ] T1 Kiểm mạng phiên Claude tới máy chủ Supabase (tải về được không)
- [ ] T2 Migration: kho `gopy-pdf` (26 MB / tệp), bảng `gopy_pdf`, hàm cộng chỗ có khoá dòng
- [ ] T3 Hàm máy chủ `gopy-pdf` (start / sign / done / xoa / list / get / del) + khoá `PDF_CLAUDE_KEY`; triển khai
- [ ] T4 App: nút 📄, đo cỡ, cắt, băm, tải, thử lại, tải tiếp, gửi góp ý kèm `ctx.pdf`
- [ ] T5 App: quản lý góp ý dòng 📄 + Xoá tệp; xoá góp ý hẳn xoá luôn tệp
- [ ] T6 Công cụ `tools/gopy-pdf.mjs` list / get / del
- [ ] T7 Test C71 (máy chủ giả): cắt đúng cỡ, ghép khớp byte, vượt trần bị chặn, tải tiếp, xoá
- [ ] T8 Thử thật: tải PDF 120 MB tạo sẵn, Claude ghép + đọc, xoá, đo dung lượng trả lại
- [ ] T9 design-critique + accessibility-review ô góp ý (Chromium khổ iPhone SE); 📘 Luật; CLAUDE.md; phát hành
