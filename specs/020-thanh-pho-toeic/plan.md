# Kế hoạch 020 · đợt 1 (v181): khung Thành phố + 🌉 Phố Cầu Nối

## Kiến trúc
- `pho.js` tách thành ĐỘNG CƠ phố dùng chung + cấu hình từng phố `PHO[key]` (cư dân, vụ thám tử, kho, cách tính "đồng phục" / "ghế", câu báo sai, câu thật lấy từ đề). Phố Loại Từ thành cấu hình đầu tiên; trạng thái cũ `S.to.pho` giữ nguyên cho Loại Từ (không mất tiến độ), phố mới lưu `S.to.phos[key]`.
- Bậc dùng chung: b1 nhận dấu hiệu · b2 đoán ghế / quan hệ · b3 ghép 3 phương án · b4 đủ 4 phương án; luật mở bậc, gợi ý, tim, combo, lịch ôn, nhạc / tiếng như v180.
- `thanhpho.js` (mới): màn 🏙 Thành phố: thẻ mỗi phố (bậc đã mở, "Đề N có a câu cần phố này", phố chưa làm ghi "sắp có"), thẻ 🏰 Chinh phục đề ở cuối. Lối vào ở màn TOEIC phần 📚 thay 2 dòng ⚔️ / 🏘 hiện tại bằng một dòng 🏙.
- Chinh phục đề: trước trận ghi đề cần phố nào (đếm dạng câu theo nhãn `x.t` / `gt` / `qt` của đề) và phố nào bậc < 3; bí kíp câu sai: nút "Chữa ở {phố}" theo dạng câu (Loại Từ: form; Cầu Nối: prep, conj, P6 conn).

## 🌉 Phố Cầu Nối
- Cư dân: 🧱 Giới Từ (sau là danh từ / cụm danh từ / V-ing) · 🌉 Liên Từ (sau là cả mệnh đề S + V) · 🔗 Trạng Từ Nối (đứng đầu câu sau dấu chấm, có dấu phẩy: However, Therefore…).
- 6 nhóm quan hệ: ➕ thêm ý · ↔️ đối lập · ❓ nguyên nhân · ➡️ kết quả · ⏱ thời gian · 🔀 điều kiện.
- b1 "Nhìn phía sau": hiện phần sau ô trống, bắt đúng cư dân (cụm hay mệnh đề hay câu mới).
- b2 "Hai vế quan hệ gì": câu có ô trống, bắt đúng nhóm quan hệ.
- b3 ghép: 3 phương án (bỏ một phương án sai cả hai mặt) · b4 đủ 4 (because / because of / although / despite…).
- Kho: `content/toeic/cau.json` → `cau.json` qua `node tools/build-cau.mjs` (khuôn: `{id, s, a, o:[[từ, G|L|T, nhóm, nghĩa]×4], why ≤ 25 từ, vi}`; kiểm phần sau ô trống khớp loại của đáp án, nhóm của đáp án, gần trùng câu đề / ETS).
- Câu thật: P5 `prep` / `conj` + P6 `conn` của đề người học đã sai (tối đa 3 / ván).

## Không đổi
Luật đo, điểm đề thử, bản đồ, thẻ học. Câu thật đúng ở b3–b4 ghi hành trình Chinh phục đề như 019.
