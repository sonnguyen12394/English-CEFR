# Kế hoạch: 🏘 Phố Loại Từ (019)

## Tệp

| Tệp | Việc |
|---|---|
| `content/toeic/pho.json` | Nguồn kho câu riêng (Claude soạn). Mỗi câu: `id`, `s` (có `___`), `a`, `o` = [[từ, loại N/V/A/R, nghĩa]] × 4, `ghe` (kiểu ghế), `nha` (nhóm cùng nhà hoặc null), `why` (≤ 25 từ, nhắc ghế / nhóm), `vi` (dịch). |
| `tools/build-pho.mjs` | Kiểm + dựng `pho.json` ở gốc: đủ trường, đáp án trong phương án, 4 phương án khác nhau, loại hợp lệ, `nha` khi 2 phương án cùng loại với đáp án, câu ≤ 22 từ, không trùng nguyên văn / gần trùng (Jaccard ≥ 0,6) câu Part 5 kho + đề trọn + câu khác trong kho. |
| `pho.js` (mới, nạp sau trochoi.js) | Màn làm quen, thám tử (4 cư dân + 4 nhóm cùng nhà), ván 2 màn có bé Mầm, kết quả, sổ thần chú, lịch ôn, lối vào `phoRow`, lối chữa từ Chinh phục đề (`phoFix`). Hình SVG, tiếng dùng `tgSfx`, tra từ dùng `.tdtap` + `tdPop` có sẵn (trò tạm dừng khi thẻ tra đang mở). |
| `index.html` | `<script src="pho.js">`, CSS lớp `.ph*` (biến màu chung + 4 màu cư dân có bản tối). |
| `trochoi.js` | `tgRow` thêm dòng 🏘; màn bí kíp của `tgSua` có nút "🏘 Chữa ở Phố Loại Từ" khi câu là Part 5 dạng từ. |
| `tools/test/c81.mjs` + `run.mjs` | Test C81. |
| `huongdan.js` | 📘 Luật mục luyện thi thêm một đoạn. |

## Dữ liệu người học

`S.to.pho = { in: 1 (đã làm quen), cd: { N, V, A, R, nguoi, vdang, edng, so: { at, lv, n } }, it: { id: { d (ngày hẹn), lv, at, s (0 sai / 1 đúng) } }, st: { van, cau, ok, ok2, tra, bo } }`. Câu thật dùng mã `de:<đề>:<số câu>`. Không đụng `S.cards`, `S.to.mock`, `S.to.ty`, bản đồ.

## Ván

1. Đầu ván: ⚡ Nhớ nhanh 3 câu thần chú đã mở (chạm cư dân đúng), không gợi ý.
2. Chọn 10 câu: câu đến hạn ôn → câu thật từng sai (≤ 3) → câu kho chưa gặp (ưu tiên nhóm cùng nhà đã mở, ghế đa dạng). Câu có `nha` chưa mở → mở vụ thám tử nhóm đó trước câu.
3. Màn 1 (5 câu có màu) → màn 2 (5 câu áo xám, nhanh hơn). 3 tim, combo, sao.
4. Đúng: hẹn 1 → 3 → 7 → 21 ngày; sai: hẹn ngày mai. Thần chú lên cấp khi đúng ở câu chưa gặp.
5. Câu thật bắt đúng ở ván chữa từ Chinh phục đề → `S.to.tc.j[de].c[n] = ok` (như hạ quái).

## Chia việc

| Bước | Ai làm | Model | Effort | Vì sao |
|---|---|---|---|---|
| Khuôn, 12 câu mẫu, bộ dựng, pho.js, nối Chinh phục đề | Phiên chính | Opus | medium–high | Thiết kế + mã, mẫu sai thì cả đợt sai |
| Soạn ~110 câu theo khuôn + mẫu | `soan-theo-khuon` | Sonnet | medium | Soạn hàng loạt, đã có mẫu |
| Soát ≥ 12 câu ngẫu nhiên | `soat-lai` | Opus | medium | Bắt nhiễu cũng đúng, loại từ sai |
| Dựng, test, e2e | `tho-may` / phiên chính | Haiku / Opus | low | Chạy lệnh |

Không dùng Haiku cho câu (nội dung giảng dạy). Rủi ro Sonnet: phương án nhiễu cũng đúng (vd. trạng từ đứng nhiều chỗ), loại từ gắn sai cho từ hai loại (vd. *complete* vừa động từ vừa tính từ): bộ dựng chặn từ hai loại trong danh sách, Opus soát.
