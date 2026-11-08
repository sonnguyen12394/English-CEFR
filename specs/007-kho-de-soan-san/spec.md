# Feature Specification: Kho đề soạn sẵn (dùng gói Pro, không tốn tiền API)

**Feature Branch**: `claude/ecstatic-curie-q9g1ja` · **Created**: 2026-11-08 · **Status**: Đã duyệt (người sáng lập "ok" kế hoạch 5 bước)

**Input**: "có cách nào dùng gói pro này kết nối với app không chứ tôi không muốn tốn tiền api" → Claude đề xuất 2 cách hợp lệ (gói Pro không gắn được vào máy chủ: điều khoản chỉ cho người đăng ký tự dùng): ① Claude soạn sẵn đề trong phiên Claude Code (tính vào gói Pro), app phát đề từ kho, không gọi API; ② người học chép lời nhắc chấm Viết / Nói sang AI của chính họ. Người sáng lập: "ok" (làm cả hai).

## User Scenarios

### US1 - Làm đề 🤖 không tốn tiền API (P1)
Người học bấm 🎯 Luyện đề → 🤖 → ▶ Làm đề mới. App mở ngay một đề soạn sẵn cùng kỳ thi + dạng mà người học chưa làm; không gọi máy chủ.
**Acceptance**: có đề trong kho → mở trong < 1 giây, `sb.functions.invoke` không được gọi; làm xong lưu kết quả như đề AI (bản đồ, band / điểm ước); mở lại được từ "Đề đã làm". Hết đề của dạng → chưa có khoá AI thì báo "Đã làm hết đề soạn sẵn của dạng này" + gợi ý dạng còn đề; có khoá thì gọi AI như cũ.

### US2 - Chấm Viết / Nói bằng AI của người học (P2)
Ở mọi chỗ có nút 🧑‍🏫 AI chấm có thêm 📋 Chép lời nhắc chấm bài: chép đề + bài làm + thang chấm (tiếng Anh, yêu cầu trả lời tiếng Việt) để dán vào Claude / ChatGPT của người học.
**Acceptance**: bấm → lời nhắc vào bộ nhớ tạm (hoặc hiện ô chữ để chép tay nếu máy chặn); không gọi máy chủ.

## Requirements
- FR-001 Đề trong kho cùng khuôn với đề AI (`supabase/functions/de-ai/khuon.js`: `spec` + `clean`); bộ dựng loại đề có lỗi cứng hoặc câu bị máy kiểm bỏ.
- FR-002 Kho là tệp tĩnh `dekho.json` ← `content/dekho/*.json` qua `node tools/build-dekho.mjs`; không sửa tay `dekho.json`.
- FR-003 Mỗi đề có `for` (các mã kỳ thi dùng được: IELTS Nghe / Đọc học thuật cho cả Academic và GT; Cambridge cấp "+" dùng đề cấp gốc).
- FR-004 IELTS Đọc: một bài dùng được cho mọi dạng có nhóm ≥ 3 câu trong bài.
- FR-005 Chọn đề: đề chưa làm, theo thứ tự trong kho. Đề kho không chống trùng với đề AI (khác nguồn).
- FR-006 Ghi rõ nguồn: "📚 Đề soạn sẵn · Claude soạn, chưa giáo viên kiểm". KHÔNG đổi luật đo; luyện đề không tính.
- FR-007 Đề dự trữ AI (`daiPrefetch`) chỉ khi dạng đó hết đề kho.

## Success Criteria
- SC-001 100% đề trong kho qua máy kiểm khuôn (bộ dựng đỏ nếu không).
- SC-002 Đợt đầu ≈ 24 đề: IELTS Đọc 5 · IELTS Nghe 4 (Part 1–4) · TOEIC Part 5 / 6 / 7 × 3 · Cambridge B1, B2 Đọc × 3.
- SC-003 Chi phí API của kho = 0.
- Mốc dừng: sau 1 quý (2/2027) chưa ai làm hết đề kho của một dạng thì không soạn thêm.

## Rủi ro
- Không có lượt AI thứ hai giải độc lập như đề AI: Claude tự soát khi soạn; người học báo ⚑ Câu sai.
- Soạn đề tốn hạn mức gói Pro: chia nhiều phiên.
