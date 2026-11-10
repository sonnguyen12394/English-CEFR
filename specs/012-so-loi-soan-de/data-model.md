# Mô hình dữ liệu: Sổ lỗi soạn đề

## 1. Nguồn danh mục `content/toeic/so-loi.json` (Claude soạn tay)

```json
{
  "v": 1,
  "nhom": [ { "id": "p2", "t": "Part 2 · hỏi – đáp" }, { "id": "de", "t": "Cả đề" } ],
  "muc": [
    {
      "ma": "L-BAN-HIEU",
      "ten": "Lời đáp sai lại là lời đáp gián tiếp hợp lý",
      "khau": "lam",
      "nhom": "p2",
      "mo": "Phương án sai của Part 2 nghe như một cách đáp vòng hợp lý, nên có 2 đáp án.",
      "vd": [ { "de": "de7", "id": "d07-p2-20", "truoc": "I'll work late tomorrow.", "sau": "The station has a new café.", "ai": "giaimu" } ],
      "bat": ["giaimu"],
      "gap": [ { "de": "de1", "n": 1 }, { "de": "de7", "n": 2 } ],
      "luat": ["H-BAN-HIEU"],
      "tt": "nho"
    }
  ]
}
```

| Trường | Bắt buộc | Ý nghĩa / kiểm |
|---|---|---|
| `ma` | có | Mã mục, duy nhất, dạng `L-…` (không trùng mã luật) |
| `ten` | có | Tên dễ hiểu, tiếng Việt, ≤ 80 ký tự |
| `khau` | có | `soan` (khi soạn) · `lam` (khi làm đề: giải mù, người sáng lập) · `hien` (hiển thị đề trên iPhone) |
| `nhom` | có | Một `id` của `nhom` (Part 1–7 hoặc `de` cả đề, `app` hiển thị) |
| `mo` | có | Một câu mô tả |
| `vd` | ≥ 1 | Ví dụ thật: `de`, `id` câu / bài (nếu có), `truoc`, `sau` (nguyên văn tiếng Anh), `ai` ∈ `bat` |
| `bat` | ≥ 1 | `dung` (bộ dựng) · `kiem` (máy kiểm) · `giaimu` · `tusoat` (Claude tự soát) · `nguoi` (người sáng lập) |
| `gap` | ≥ 1 | Đã gặp ở đề nào, bao nhiêu câu / bài (`n`), tuỳ chọn `ban` (bản phát hành) |
| `luat` | ≥ 1 | Mã luật phòng: luật máy (`P5-GHEP`, `C-CAN`…, phải có trong máy kiểm / bộ dựng) hoặc tiêu chí người soát (`H-*`, phải có trong bộ tiêu chí) |
| `tt` | có | `chan` (máy chặn: lỗi) · `nhac` (máy nhắc: cảnh báo) · `nho` (người soát phải nhớ) · `mo` (còn mở) |
| `pa` | khi `tt = mo` | Các phương án `[{ t, gia }]` để người sáng lập quyết |

Luật kiểm khi dựng: mã duy nhất; trường bắt buộc đủ; `nhom`, `khau`, `bat`, `tt` trong danh sách; mọi mã `luat` có thật; `tt = chan` thì ít nhất một luật mức lỗi; `tt = nhac` thì ít nhất một luật mức cảnh báo.

## 2. Tệp dựng `kiemde.json` (gốc repo, app tải khi mở tab)

`= so-loi.json` + phần máy tính lúc dựng:

- `luat`: `{ [mã]: { ten, muc: 'loi' | 'canh' | 'nguoi', noi: 'dung' | 'kiem' | 'tieuchi' } }` (tên luật đọc từ máy kiểm / bộ dựng / bộ tiêu chí).
- `de`: `[{ id, t, loi, canh, xem, gm: { khop, tong, dau: [khop, tong], lai } }]` tình trạng kiểm từng đề (máy kiểm + giải mù vòng đầu + số câu đã giải lại).
- `dem`: `{ tong, chan, nhac, nho, mo, soan, lam, hien }` số mục theo trạng thái / khâu.
- `ngay`: ngày dựng.

## 3. Phản hồi của người sáng lập

- Trên máy: `S.kd = { [ma]: { v: 1 | 0, n: 'ghi chú', at: ms } }` (đồng bộ như dữ liệu học; không ảnh hưởng luật đo).
- Gửi về: một dòng góp ý (`gopy`): `kind: 'khac'`, `txt: '🛡️ Kiểm đề · {ma} · ✓ Đúng ý'` hoặc `'… · ✗ Chưa đúng: {ghi chú}'`, `ctx: { view: 'kiemde', ma, v }`, `app_v`. Đổi ý (✓ → ✗) gửi dòng mới; Claude lấy dòng mới nhất của mỗi `ma`.

## 4. Thứ tự phương án đã cân bằng

- Đề 3–8 (`toeic-tron/deN.json`) và Đề 1–2 (mục `tron` của `toeic.json`): thêm `ord`: mảng 200 phần tử theo số câu; phần tử là chuỗi hoán vị (vd. `"2031"`: ô A hiện phương án số 2 của `[đáp án, ...sai]`…) cho câu Part 3–7; `null` cho Part 1–2 (Part 1 theo tệp nguồn, Part 2 theo hoán vị đã ghi trong câu). App, máy kiểm, phiếu giải mù dùng `ord` nếu có; không có (đề cũ trước bản này) thì như cũ.
- `toeic-tron/doi-chu.json`: `{ "ov": 2, "de1": ["ABCD", "BACD", …200], … }`: chữ cũ → chữ mới của từng câu (chuỗi 4 ký tự: vị trí i là chữ mới của chữ cũ thứ i), dùng để chuyển bài làm cũ.
- Bài làm đã lưu (`S.to.tronA[...]`), đề đang làm dở: thêm `ov: 2` khi lưu / sau khi chuyển; thiếu `ov` → chuyển bằng `doi-chu.json` rồi lưu lại.
- Kết quả giải mù (`content/toeic/giai-mu/deN.json`): `da`, `chon`, `hai` đổi sang chữ mới một lần (cùng phương án); `dau` giữ nguyên.

## 5. Không đổi

Luật đo, `S` của các phần học, bảng máy chủ (dùng `gopy` sẵn có), đề AI, kho đề soạn sẵn.
