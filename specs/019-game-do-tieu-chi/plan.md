# Kế hoạch: 🗺 Chinh phục đề đo được và hiểu thật

**Nhánh**: `claude/dreamy-goldberg-hzll1q` · **Ngày**: 14/11/2026 · **Đặc tả**: [spec.md](spec.md)

## Tóm tắt

Thứ tự đã duyệt: ⑤ ghi dữ liệu + màn 🛠 tiêu chí → ② đề đối chứng → ① 🐉 Boss ẩn → ③ ⭐ tạm / Boss tái đấu → ④ bớt ghép nghĩa (+ soạn `ev` Part 7 kho) → ⑥ tự gõ khó dần. Một tệp mới `tgdo.js` giữ phần đo (ghi + tính tiêu chí + đối chứng); `trochoi.js` sửa luồng game. Không đổi luật đo, không ghi điểm đề thử / thẻ học.

## Bối cảnh kỹ thuật

- JS thuần, không build; dữ liệu người học trong `S` (Supabase `vocab_state`), phần game ở `S.to.tc` (`tgSt()`).
- Câu đề: `trB(de).Q` (totron.js), câu kho `TO.p5` (nhãn `t`), `TO.p7` (bộ văn bản, câu có `ty`); dựng câu bằng `toP5Q` / `toP7Qs` (toeic.js).
- Màn 🛠: `bkTools()` (backup.js).
- Test: `tools/test/run.mjs` (Node + vm), thêm **C81**; C79 sửa theo luồng mới.
- Dung lượng: nhật ký ghi dạng mảng gọn, giữ ≤ 2.000 dòng (~60 KB); số tổng hợp giữ mãi.

## Kiểm hiến pháp

| Nguyên tắc | Đánh giá |
|---|---|
| I. Luật đo của người sáng lập | ✅ Không chạm 📘 / 🔁 / Thi. Game không tính luật đo. |
| II. Kiểm chỉ trên iPhone | ⚠️ Chromium khổ iPhone SE kiểm sơ bộ; ghi "chưa kiểm trên iPhone". Luật thiết kế 4 bước cho màn đổi. |
| III. Test xanh | ✅ C81 mới; release.mjs. |
| IV. Sửa qua nguồn | ✅ `ev` Part 7 sửa ở `content/toeic/doc.json` → `build-toeic.mjs`; không sửa tay toeic.json. |
| V. Trung thực | ✅ `ev` Claude soạn, máy kiểm nguyên văn; ngưỡng tiêu chí ghi là ý kiến của Claude. |

Không có vi phạm.

## Cấu trúc thay đổi

```
docs/TIEU-CHI-GAME-TOEIC.md      mới: bộ tiêu chí (FR-001)
tgdo.js                          mới: tgLog, tgTran, tiêu chí (tgCrit*), đề đối chứng (tgDc*), màn 🛠 tgCritView
trochoi.js                       sửa: gọi ghi nhật ký; Boss ẩn; ⭐ tạm; Boss tái đấu (A/B đổi chỗ); thử thách 🔁 diễn đạt lại; gợi ý gõ 3 mức; loại đề đối chứng
backup.js                        sửa: nút 🗺 Bộ tiêu chí game ở bkTools
index.html                       sửa: nạp tgdo.js; CSS nếu cần (dùng biến chung)
content/toeic/doc.json           sửa: thêm ev cho câu Part 7 kho (153 câu, trừ câu chèn câu)
tools/build-toeic.mjs            sửa: kiểm ev Part 7 kho có nguyên văn trong văn bản
tools/test/run.mjs               sửa: C81 mới, C79 theo luồng mới
tools/graph-vung.py              sửa: thêm tgdo.js vào VUNG
CLAUDE.md                        đoạn v176
```

## Các pha

| Pha | Việc | Ai làm | Model · effort |
|---|---|---|---|
| 0 | Bộ tiêu chí ra tệp | Phiên chính | Opus · medium |
| 1 | ⑤ ghi nhật ký + màn tiêu chí | Phiên chính | Opus · high (dữ liệu người học) |
| 2 | ② đề đối chứng | Phiên chính | Opus · high (đổi luồng) |
| 3 | ① Boss ẩn | Phiên chính | Opus · high |
| 4 | ③ ⭐ tạm + tái đấu | Phiên chính | Opus · high |
| 5a | ④ thử thách diễn đạt lại, bỏ ghép nghĩa khỏi lên 🌳 | Phiên chính | Opus · medium |
| 5b | Soạn `ev` câu Part 7 kho (153 câu trừ câu chèn) (mẫu 5 câu do phiên chính) | `soan-theo-khuon` | Sonnet · medium |
| 5c | Soát ≥ 10% `ev` | `soat-lai` | Opus · medium |
| 6 | ⑥ gợi ý gõ 3 mức | Phiên chính | Opus · low |
| 7 | Dựng, test, e2e, graphify | `tho-may` | Haiku · low |
| 8 | Chụp + chấm thiết kế màn đổi, phát hành | Phiên chính | Opus · medium |

Không nên dùng: Haiku cho `ev` (nội dung giảng dạy); Fable (không cần). Rủi ro Sonnet: `ev` trích sai câu (câu chứa đáp án khác) → máy kiểm chỉ bắt "có nguyên văn", không bắt "đúng câu" → `soat-lai` đọc ngẫu nhiên ≥ 16 câu, sai > 1/10 thì soạn lại đợt.

## Rủi ro

- Thêm `ev` vào câu kho: giải mù không đổi (dấu nội dung bỏ `ev`), nhưng mục "đã xem" của máy kiểm có thể tính lại dấu kèm `ev` → chạy `kiem-toeic.mjs`, ghi lại nếu cần.
- Boss ẩn lấy câu đề khác làm lộ đề (người sáng lập đã chấp nhận) → ghi "đã lộ N câu".
- ⭐ tạm làm chậm chinh phục (G1 có thể dài hơn 14 ngày) → đo rồi xét lại ngưỡng.
- Nhật ký phình dữ liệu đồng bộ → giới hạn dòng.

## Kiểm lại sau thiết kế

Thiết kế giữ trong game, không đổi luật đo, nguồn dữ liệu qua bộ dựng. ✅
