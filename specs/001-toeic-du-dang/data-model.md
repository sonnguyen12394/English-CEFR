# Data Model: TOEIC đủ dạng câu

Chỉ thêm trường; không đổi trường cũ, không đổi mã cũ. `toeic.json` dựng bởi `tools/build-toeic.mjs` từ `content/toeic/*.json`.

## Câu / bài trong kho (`toeic.json`)

| Kho | Trường mới | Giá trị | Nguồn | Kiểm lúc dựng |
|---|---|---|---|---|
| `p1[]` | `k` | `people` · `scene` | suy từ câu đúng (có người / không), ghi tay được | — |
| `p2[]` | `ty` | `wh` · `yn` · `or` · `req` · `stmt` | suy từ câu hỏi (thứ tự: or → req → yn / phủ định / câu đuôi / gián tiếp → wh → stmt), ghi tay được | không suy được → lỗi; `stmt` không có nhãn bẫy `yn` |
| `p3[].qs[]`, `p4[].qs[]` | `ty` | `gist` · `next` · `imp` · `graphic` · `detail` | suy từ đầu câu hỏi | câu `graphic` cần bảng `g` (như cũ) |
| `p4[]` | `ty` | `msg` (tin nhắn thoại) · `ann` (thông báo) · `ad` (quảng cáo) · `news` (bản tin) · `intro` (giới thiệu, hội thảo, khai mạc) · `tour` (tham quan, hướng dẫn) · `meet` (họp nội bộ) | ghi tay trong `content/toeic/nghe.json` | thiếu / sai → lỗi; ≥ 2 bài `ad` |
| `p5[]` | `t` (giá trị mới) | `det` (từ hạn định, lượng từ) | ghi tay | `t` thuộc 8 dạng |
| `p6[].gaps[]` | `t` | `insert` · `conn` · `tense` · `word` | `insert` suy (phương án ≥ 5 từ), `conn` suy (phương án là từ nối câu), `tense` ghi tay, còn lại `word` | đúng 1 `insert` mỗi đoạn; phương án câu chèn có từ chung với đoạn |
| `p7[].qs[]` | `ty` | `purpose` · `infer` · `not` · `syn` · `insert` · `intent` · `detail` | suy từ đầu câu hỏi | `syn`: từ được hỏi có trong văn bản · `insert`: văn bản đủ [1]–[4], đáp án là một dấu · `intent`: bộ có tin nhắn / trò chuyện |

Câu mới Part 2 và Part 5 thêm vào **cuối** kho (bộ 10 câu đánh số theo vị trí).

## Bài học (`XL_TXT.to` trong baihoc.js)

Thêm 13 mục `{ k, ic, t, u?, what, how, trap? }`. Mã bài học = `to:<kỹ năng>:<k>`. Mã cũ giữ: `to:L:p1`, `to:L:p2`, `to:L:p2t`, `to:L:p3`, `to:L:g`, `to:L:imp`, `to:L:p4`, `to:R:p5-*`, `to:R:p6`, `to:R:p7`, `to:R:p7m`, `to:R:p7c`, `to:R:time`, `to:V:voc`.

Mới: `to:L:p1o`, `to:L:p2-yn`, `to:L:p2-or`, `to:L:p2-req`, `to:L:p2-st`, `to:L:gist`, `to:L:next`, `to:L:p4-ty`, `to:R:p5-det`, `to:R:p6-ins`, `to:R:p7-inf`, `to:R:p7-syn`, `to:R:p7-ins`.

Mỗi bài học chọn ví dụ + 3 câu làm thử theo nhãn dạng ở bảng trên (vd. `p2-st` → `p2[].ty === 'stmt'`; `p7-syn` → câu `ty === 'syn'`).

## Bài tập theo dạng (`TO_DR` trong toeic.js)

| Mã | Dạng | Lấy gì |
|---|---|---|
| `p1:people`, `p1:scene` | Part 1 | 5 câu đúng loại tranh |
| `p2:wh`, `p2:yn`, `p2:or`, `p2:req`, `p2:stmt` | Part 2 | tối đa 8 câu đúng loại |
| `q:gist`, `q:next`, `q:imp`, `q:graphic` | Part 3–4 | 2 bài (Part 3 hoặc 4) có câu loại đó, cả bài |
| `t3` | Part 3 | 2 hội thoại 3 người |
| `p6:ctx` | Part 6 | 2 đoạn có chỗ `tense` / `conn` |
| `p6:ins` | Part 6 | 2 đoạn (mỗi đoạn có 1 câu chèn), cả bài |
| `q7:infer`, `q7:syn`, `q7:insert`, `q7:intent` | Part 7 | 2 bộ có câu loại đó (`infer` gồm cả `not`), cả bộ |

Dạng còn lại dùng bài tập có sẵn: Part 2 bẫy / Part 3 / Part 4 / Part 6 / Part 7 / nhiều văn bản theo Part (`data-top`), Part 5 theo dạng (`data-top="t:<dạng>"`, có `det`), tốc độ (`data-tospd`), từ công sở (`data-tovoc`).

## Trạng thái người học (không đổi lược đồ)

- `S.to.r[mã câu / bài]` = { at, ok, n, k } như cũ (bài tập theo dạng ghi giống luyện theo Part).
- `S.to.ty[đơn vị]` lịch sử bản đồ: thêm đơn vị `p5:det` (tự có qua `toLog`).
- `S.exl[mã bài học]` = { at, ok, n } như cũ.
