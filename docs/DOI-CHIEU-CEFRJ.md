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
