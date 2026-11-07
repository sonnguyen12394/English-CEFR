# Mô hình dữ liệu: 🎯 Luyện đề AI

## 1. Bảng Supabase `de_ai` (mới)

| Cột | Kiểu | Ghi chú |
|---|---|---|
| `id` | uuid, khoá chính, mặc định `gen_random_uuid()` | mã đề |
| `uid` | uuid, không rỗng | người dùng lấy từ JWT ở máy chủ |
| `at` | timestamptz, mặc định `now()` | lúc yêu cầu |
| `ky` | text | `ielts-ac` · `ielts-gt` · `toeic` · `cb-pre` … `cb-c2` |
| `sk` | text | `doc` · `nghe` · `viet` · `noi` · `np` (ngữ pháp / từ, câu lẻ) |
| `dang` | text | khoá dạng câu / phần (xem contracts), `*` = bất kỳ |
| `muc` | text | cấp / band / điểm mục tiêu dùng để soạn (vd. `6.5`, `b1`, `650`) |
| `st` | text | `dang` (đang soạn) · `xong` · `loi` |
| `de` | jsonb, rỗng được | đề (khuôn ở contracts/de-ai.md) |
| `chk` | jsonb, rỗng được | `{ n, khop, bo: [chỉ số câu bỏ] \| 'het-gio', trung?: lý do lần 1 bị coi là trùng }` |
| `err` | text, rỗng được | lời báo lỗi tiếng Việt |
| `tin`, `tout` | int | token vào / ra (cộng cả lượt giải) |
| `du` | bool, mặc định false | đề dự trữ (soạn sẵn) |
| `chude` | text | khoá chủ đề máy chọn trước khi soạn (vd. `ac-ocean`, `to-hotel`) |
| `tom` | text | ý chính một dòng (AI ghi, tiếng Anh) dùng cho danh sách tránh |
| `lan` | int, mặc định 1 | 2 = phải soạn lại vì trùng / hỏng |

- Chỉ mục: `(uid, at desc)`, `(uid, ky, sk, at desc)` (chống trùng).
- RLS bật. Người dùng chỉ **đọc** dòng của mình (`uid = auth.uid()`); không thêm / sửa / xoá từ trang (máy chủ dùng service role). Người ẩn danh đọc được dòng của chính họ như mọi người.
- Dọn: dòng `dang` quá 10 phút coi là `loi` (máy chủ sửa khi có yêu cầu mới). **Không xoá đề cũ** (FR-015): đề là lịch sử chống trùng. Ước dung lượng: ~5 KB / đề → 10.000 đề ≈ 50 MB, trong hạn 500 MB của gói Free.

## 2. Bảng `el_cham` (có sẵn, đổi cách dùng)

- Thêm `kind = 'de'`: một dòng cho mỗi đề soạn xong (tin / tout cộng cả lượt giải), `lv` = `ky`.
- Trần chung 200 lượt / ngày = đếm mọi dòng 24 giờ qua có `kind ≠ 'ban'` (AI chấm + soạn đề). Bỏ trần mỗi người (20) ở `el-cham`.

## 3. Trong dữ liệu học `S` (trang, nhỏ)

```
S.dai = {
  r:   [ { id, ky, sk, dang, at, ok, n, band?, pt?, ai? } ],  // kết quả, ≤ 100 dòng gần nhất (mới nhất cuối)
  du:  { 'ky|sk': id },                                     // đề dự trữ chưa làm, ≤ 1 mỗi kỹ năng
  mo:  { id, at, i, ans: [...] } | null,                    // đề đang làm dở (giữ 24 giờ)
  wait:{ 'ky|sk': { id, at } }                              // đề đang soạn (để quay lại màn vẫn thấy)
}
```

- `ok / n`: số câu đúng / tổng (Đọc, Nghe, câu lẻ); `band` (IELTS ước), `pt` (TOEIC ước), `ai` = điểm AI chấm (Viết / Nói: `{ band | pct, c: [4 tiêu chí] }`).
- Không ghi vào `S.ie.r` / `S.to.r` / `S.cbx` (kết quả bài có sẵn), không đụng `cards`, `units`, `exams` (luật đo CEFR).

## 4. Ghi vào bản đồ kỳ thi (đã có, thêm nguồn `ai`)

- IELTS: `ieTyLog(res, 'ai', fresh = mọi câu)` theo `q.ty` (dạng câu); Viết / Nói: `ieCrLog(k, task, C, 'ai')` từ AI chấm như hiện có.
- TOEIC: `toLog(res, 'ai', fresh)` theo đơn vị `p5:<t>`, `tr:<k>`, Part.
- Cambridge: `cbmap.js` đọc thêm `S.dai.r` có `ky = cb-<cấp>` theo khoá phần (`cbKey`), cùng cửa sổ `CB_WIN` 20 câu gần nhất.
- Mọi đề AI là bài chưa gặp nên tính là "lần thử" của nhóm đang chữa như bài mới.

## 5. Chống trùng (FR-015 → FR-017)

```
yêu cầu ─► lấy lịch sử cùng uid + ky + sk (tối đa 50 đề, mới nhất trước)
        ─► chọn chủ đề: trong CHU_DE[ky][sk] lấy chủ đề chưa có trong lịch sử; hết thì chủ đề lâu nhất chưa gặp + "góc nhìn khác"
        ─► lời nhắc: "Viết về {chủ đề}" + danh sách tránh (tên + chủ đề + tom của ≤ 30 đề gần nhất)
        ─► soạn ─► máy kiểm khuôn ─► KIỂM TRÙNG với lịch sử (≥ 3 đề gần nhất toàn văn, thực tế tới 50):
              • cùng `chude` hoặc tên đề gần giống (chuẩn hoá chữ thường, bỏ dấu câu)
              • một câu hỏi trùng nguyên văn (chuẩn hoá) với câu của đề cũ
              • bài đọc / lời nghe chung ≥ 15% cụm 5 từ liên tiếp (tỉ lệ trên số cụm của đề mới)
           trùng ─► soạn lại 1 lần với chủ đề khác (lan = 2) ─► vẫn trùng ─► loi "Chưa tạo được đề mới khác đề cũ, thử lại sau"
        ─► giải độc lập ─► xong
```

- Ngưỡng 15% là ý kiến của Claude (hai bài khác chủ đề thường chung < 2% cụm 5 từ; chép lại > 30%); đo lại ở bước thử.
- Kiểm trùng là hàm thuần (`supabase/functions/_shared/trung.js`) để test được bằng `node` ở máy soạn.
- `CHU_DE` nằm trong mã hàm máy chủ (Claude soạn, ~40 chủ đề IELTS học thuật, ~20 GT, ~25 TOEIC, ~30 Cambridge chia nhóm cấp Pre-A1–A2 / B1–B2 / C1–C2).

## 6. Chuyển trạng thái đề

```
(trang) yêu cầu ──► dang ──soạn + máy kiểm + giải──► xong ──► (trang) làm ──► kết quả vào S.dai.r
                     │                                  │
                     └──quá hạn / AI lỗi / khuôn hỏng──► loi   (soạn lại tối đa 1 lần trước khi báo loi)
xong + du=true ──(người học mở)──► đề dự trữ dùng ngay, xoá khỏi S.dai.du
```
