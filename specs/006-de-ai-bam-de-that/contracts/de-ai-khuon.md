# Hợp đồng: khuôn đề AI v2 (thay đổi so với specs/003-luyen-de-ai/contracts/de-ai.md)

Gọi hàm máy chủ `de-ai` không đổi: `{ act: 'tao', ky, sk, dang, muc, du }` → `{ id }`; trang hỏi trạng thái bảng `de_ai` như cũ.

## Khoá `dang` mới / bỏ

- Thêm: IELTS `R-mf`, `R-se`, `R-sum`, `R-dia`, `L-note`; Cambridge `box` (Pre-A1), `resp`, `story`, `comp`, `name` (A1; `name` cả Pre-A1), `sn` (A2, B1).
- Không còn cho chọn (máy chủ trả "Dạng đề này chưa có."): IELTS `L-sa`; Cambridge Pre-A1 / A1 `mc` (đọc, nghe), `w`, `open`, `gap` (Pre-A1 / A1 vẫn không có như cũ).

## Đầu ra AI (khuôn có cấu trúc)

- Giữ mọi trường v1. Thay `task.table` bằng `task.chart = { kind, title, unit, cats: string[], series: [{ name, v: number[] }] }` (Task 1 Academic).
- Nhóm câu (`groups[]`) có `ty` theo bảng dạng câu của đề (một đề Đọc IELTS có 2–3 `ty`).

## `de_ai.de` lưu (đề đã qua máy kiểm)

```text
v: 2
part: "IELTS Listening Part 4" | "B2 First · Reading and Use of English Part 1" | …   (mới)
min: phút làm bài (IELTS Đọc 20)
text | lines | groups[] (như v1; câu trong nhóm đã xếp theo thứ tự bài khi dạng cần thứ tự)
task.chart (Task 1 v2) | task.table (v1, đề cũ)
speak.p1: 9–12 câu (IELTS v2)
```

## Trang

- Mở được cả `v: 1` và `v: 2`; tên đề: `part` nếu có, không thì tên dạng như v141.
- Task 1: `task.chart` → `ieChart`; `task.table` → bảng như v141.
- Dạng cũ không còn trong danh sách vẫn có tên (bảng tên cũ) và kỹ năng suy từ `sk`.
