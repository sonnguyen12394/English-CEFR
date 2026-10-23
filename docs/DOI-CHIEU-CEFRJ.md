# Soát cấp độ và độ đủ của kho từ (23/10/2026)

Máy đối chiếu, chưa người thật kiểm. Chạy lại: `python3 tools/check-levels.py`.

## Chuẩn dùng để so
- **CEFR-J Vocabulary Profile 1.5** (A1–B2), Tono Laboratory, Tokyo University of Foreign Studies, và **Octanove Vocabulary Profile C1/C2 1.0** (CC BY-SA 4.0): https://github.com/openlanguageprofiles/olp-en-cefrj (tệp ở `content/ref/`).
- Lưu ý: CEFR-J soạn cho người học Nhật (theo sách giáo khoa), nên từ du lịch / người lớn (passport, luggage) bị xếp cao hơn nhu cầu thực tế. Hai chuẩn khác nhau (CEFR-J, English Vocabulary Profile) thường chỉ khớp đúng cấp khoảng 60–70%: **lệch 1 cấp là bình thường, lệch ≥ 2 cấp mới chắc là sai**.

## 1. Đúng cấp
| Cấp trên trang | Số từ | Đúng cấp | Lệch 1 cấp | Lệch ≥ 2 cấp | Chuẩn không có |
|---|---|---|---|---|---|
| Pre-A1 (so với A1) | 379 | 92% | 4% | 1% | 2% |
| A1 | 539 | 71% | 23% | 4% | 2% |
| A2 | 762 | 44% | 42% | 7% | 7% |
| B1 | 890 | 39% | 39% | 6% | 17% |
| B2 | 1.020 | 27% | 44% | 15% | 14% |
| C1 | 1.020 | 8% | 36% | 19% | 37% |
| C2 | 560 | 14% | 8% | 8% | 71% |

- **Pre-A1, A1: tốt.** Lệch chủ yếu theo hướng chuẩn khó hơn (menu, passport, plate…) — từ người lớn, giữ được.
- **A2: lẫn hai chiều.** 165 từ chuẩn xếp A1 (price, spend, borrow, size…) và 208 từ chuẩn xếp B1+ (architect, journalist, charity, conference…).
- **B1–C2 (lấy nguyên theo game, chưa soát): kém.** B2 có nhiều từ chuẩn xếp A1–B1 (pollution, fever…); C1 có từ chuẩn xếp B1–B2 (acknowledge, sue…) và 37% không có trong chuẩn; C2 71% không có trong chuẩn.

## 2. Đủ từ (từ của chuẩn có trong kho trang, ở cấp bất kỳ)
| Cấp chuẩn | Số từ chuẩn | Có | Thiếu |
|---|---|---|---|
| A1 | 1.084 | 89% | 119 (nhiều mục là dạng ngữ pháp: am, are, 'm, did… hoặc chính tả Mỹ: color, mom) |
| A2 | 1.272 | 69% | 391 |
| B1 | 2.174 | 53% | 1.032 |
| B2 | 2.490 | 32% | 1.686 |
| C1 | 929 | 17% | 772 |
| C2 | 896 | 12% | 789 |

Danh sách đủ từng từ lệch / thiếu: `content/ref/doi-chieu.json`.

## 3. Sau khi xếp lại (bản 19, người sáng lập: "xếp lại toàn bộ")
| Cấp | Số từ | Đúng chuẩn | Chuẩn không có (giữ cấp game, chưa soát) |
|---|---|---|---|
| Pre-A1 | 378 | 98% | 2% |
| A1 | 599 | 98% | 2% |
| A2 | 932 | 94% | 6% |
| B1 | 1.295 | 88% | 12% |
| B2 | 936 | 85% | 15% |
| C1 | 527 | 29% | 71% |
| C2 | 503 | 21% | 79% |

Độ đủ không đổi (xếp lại không thêm từ): kho vẫn thiếu so với chuẩn, nhất là B1–C2. Muốn đủ cần soạn thêm từ (nghĩa, ví dụ, câu điền, câu thi).

## 4. Đổi sang Oxford làm chuẩn chính (bản 20, người sáng lập chọn)
- Hai chuẩn lệch nhau nhiều: trên 4.354 từ có ở cả CEFR-J và Oxford 3000/5000, chỉ **44% cùng cấp**, 43% lệch 1 cấp, 13% lệch ≥ 2 cấp; CEFR-J xếp thấp hơn Oxford ở 45% số từ. Ví dụ passport CEFR-J B1 / Oxford A1, exam A2 / A1, fever A1 / B2.
- Cấp mới = Oxford → CEFR-J / Octanove → cấp game. Kết quả: Pre-A1 365 · A1 554 · A2 788 · B1 799 · B2 1.132 · C1 1.057 · C2 475 (3.969 từ theo Oxford, 456 theo CEFR-J / Octanove, 745 giữ cấp game, chưa soát).
