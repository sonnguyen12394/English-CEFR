# Data Model: IELTS đủ dạng

Chỉ thêm trường / mục; không đổi trường cũ, không đổi mã cũ.

## Nội dung (`content/ielts/*.json` → `ielts.json`)

| Kho | Thêm | Kiểm lúc dựng |
|---|---|---|
| `viet.json` `t2[]` | `roles: [nhãn vai trò từng đoạn]` (vd. "Mở bài: viết lại đề + nêu quan điểm", "Thân bài 2: giải pháp") | số nhãn = số đoạn của bài mẫu; nhãn không rỗng |
| `nghe.json` `items[]` | 1 phần Part 2 `il-p2-plan`: `text`, `map` (mặt bằng: `t`, `items` [{ t, x, y, w, h, c }], chữ A–H), `qs` 10 câu (`k`: `map` ×5 có `a` là một chữ trên mặt bằng; `mc` ×5) | như phần bản đồ cũ: chữ trả lời có trên mặt bằng, đáp án có căn cứ trong lời nói |
| `doc.json` `items[]` | 2 bài học thuật 750–900 từ, 13–14 câu, ≥ 3 dạng | như bài cũ (đáp án có trong bài, ≥ 13 câu) |

## Bài học (`XL_TXT.ie` trong baihoc.js)

- Viết (mã `ie:W:<k>`): mới `w2-op`, `w2-dis`, `w2-ad`, `w2-ps`, `w2-tq` (5 kiểu Task 2, sau `w2-type`), `wc-tr`, `wc-cc`, `wc-lr`, `wc-gr` (4 tiêu chí, cuối danh sách, `u` = W-0…W-3).
- Nói (mã `ie:S:<k>`): mới `p2-cat` (sau `p2`), `p3-q` (sau `p3`), `sc-fc`, `sc-lr`, `sc-gr`, `sc-pr` (`u` = S-0…S-3).
- `XL_TXT.crit`: { W: [4 mục], S: [4 mục] }, mỗi mục { ex: { lo, hi, why }, mcq: [{ q, a, w: [≥ 1], why } × 3] }.

## Bài tập theo dạng

| Nút | Mở gì |
|---|---|
| `data-ielk="form"` `"sent"` `"mc"` `"mc2"` `"map"` `"match"` | một phần nghe IELTS có câu dạng đó (nhóm: form = form / tab / flow; sent = sent / sa), làm cả phần |
| `data-iew="t1:line,bar"` `"t1:table,pie"` `"t1:map"` `"t1:process"` `"t1:mixed"` | một đề Task 1 đúng loại |
| `data-iew="t2:opinion"` `"t2:discuss"` `"t2:advdis"` `"t2:probsol"` `"t2:twopart"` | một đề Task 2 đúng kiểu |

## Nhóm suy lúc chạy (không lưu)

- `IE_P2CAT` (nhóm thẻ Part 2 theo tiêu đề), `IE_P3TY` (kiểu câu hỏi Part 3 theo câu hỏi): mọi thẻ / câu trong kho phải xếp được nhóm (test).

## Trạng thái người học

Không đổi: `S.ie.r`, `S.ie.ty`, `S.ie.cr`, `S.ie.w`, `S.ie.s`, `S.exl`.
