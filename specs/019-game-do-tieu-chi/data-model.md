# Mô hình dữ liệu: 019 (trong `S.to.tc`)

| Khoá | Dạng | Ý nghĩa | Giới hạn |
|---|---|---|---|
| `lg` | `[[ngày, đề, câu, việc, ok, sh, giây, lv], …]` | mỗi câu trả lời trong game. việc: `b` Boss · `t` tái đấu · `x` xác nhận ⭐ tạm · `s` chữa · `h:<kiểu>` vun cây · `o:<kiểu>` ôn · `n` Boss ẩn | 2.000 dòng |
| `ag` | `{ k: [n, ok] }` | số tổng hợp giữ mãi (theo việc, sh, lv) | — |
| `tr` | `[[việc, đề, lúc bắt đầu, lúc xong \| 0], …]` | trận; xong = 0 là bỏ dở | 300 |
| `dy` | `[ngày, …]` | ngày có chơi | 400 |
| `j[de].c[n]` | `{ s, at, tm? }` | ⭐; `tm: 1` = ⭐ tạm | — |
| `j[de].w` | ngày | ngày đạt 100/100 ⭐ thật lần đầu (G1, G2) | — |
| `j[de].t0` | ngày | ngày chơi đầu (G1) | — |
| `j[de].td` | `{ ck: ngày }` | lần tái đấu gần nhất mỗi lượt | — |
| `dc` | `{ de, at, cu: 0/1, pre: {at, ok}, post: {at, ok} }` | đề đối chứng; `cu` = đã làm trước khi chọn | — |
| `bn` | `{ mã câu: [ngày, ok, dạng] }` | câu đã dùng làm Boss ẩn | — |
| `bq` | `[dạng, …]` | dạng chờ Boss ẩn | 20 |
| `dg` | `{ dạng: [n, ok, ngày] }` | kết quả Boss ẩn theo dạng | — |
| `lo` | `{ de: số câu }` | đề đã lộ câu cho Boss ẩn | — |

Chuyển trạng thái câu: ☁️ → (Boss) ⭐ thật / 👾 → (chữa đúng) ⭐ tạm → (xác nhận ngày sau) ⭐ thật → (2 thử thách) 🌳 → (ôn 3/7/21) 🏡. Sai ở Boss / tái đấu / xác nhận / đề → 👾.

Mã câu Boss ẩn: kho `k:<id>` (Part 7 `k:<id bộ>:<i>`), đề `d:<de>:<số câu>`.
