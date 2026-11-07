# Data Model: Cambridge đủ dạng

Chỉ thêm trường / mục; không đổi trạng thái người học.

## Nội dung

| Kho | Thêm | Kiểm lúc dựng |
|---|---|---|
| `content/bs/dangthi.json` → `nghe.json` `dt[]` | 4 bộ `{ id, k: "sn", lv: "a2" \| "b1", t, items: [{ kind, txt, q?, a, w: [2], why }] }` (A2 6 văn bản, B1 5) | số văn bản đúng cấp; `txt` ≤ 40 từ; 3 phương án khác nhau; đáp án không nằm trong `w` |
| `viet.json` (nguồn của nó) | sửa đề thi truyện B1 nếu trùng đề học | kiểm cũ của Viết (bài mẫu qua bộ chấm) |

## Bài học (`XL_TXT.cb` trong baihoc.js)

- `the`: 7 thể loại `{ thu, bao, truyen, luan, review, baocao, dexuat }`, mỗi mục `{ ic, t, what, how[], trap[], bo[] (bố cục thường gặp), mcq[3] }`; `theLv`: thể loại theo cấp `{ b1: [thu, bao, truyen], b2: [luan, thu, bao, baocao, review], c1: [luan, thu, dexuat, baocao, review], c2: [bao, thu, baocao, review] }`.
- `tcW` (4) và `tcS` (4): `{ ic, t, what, how[], trap[], ex: { p, lo, hi, why }, mcq[3] }`.
- `capm`: 2 câu đáp mẫu mỗi cấp cho nhiệm vụ đầu tiên của cấp; `capq`: 3 câu làm thử mỗi cấp `{ who (lời bạn thi), a, w[≥2], why }`.
- `spk.rp`: viết lại thành thảo luận cặp; `what` / `how` / `trap` cho `sn`.
- Mã bài: thể loại `cb:<cấp>:<bài thi>:the:<g>`; tiêu chí `cb:<cấp>:<bài thi>:tc:<i>`; bài cũ giữ mã.

## Bài tập / đề thử

| Nút / phần | Mở gì |
|---|---|
| `data-cbx="genre\|<cấp>\|<bài>\|<g>"` | một đề Viết thể loại g trong cấp (chưa viết trước, rồi viết lâu nhất), làm như đề thi |
| dòng "📖 Tin ngắn · bộ n" | bộ tin ngắn đó, làm như đề thi; kết quả `S.cbx[id bộ]` |
| Đề thử Nói A2 → C2, phần thảo luận | `mode: "cap"`: lượt bạn thi (máy nói) + lượt người học; chấm bằng `capChecks` |
