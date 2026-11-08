# Plan: Sai ở đâu · học lại gì (009)
- Tệp mới `hoclai.js` (nạp sau baihoc.js; thêm vào `index.html`, `tools/graph-vung.py` VUNG): `hlFor(ex, q, ctx)` câu → bài học; `hlBox(ex, res, ctx)` ô kết quả; `hlMark(ex, res)` ghi `S.xs`; `hlWords(q)` từ chưa học trong câu chứa đáp án; xử lý bấm `data-hl` / `data-hlgo` / `data-hlw`.
- Gắn ô vào: `ieMockResult`, `ieRun` (bỏ qua làm thử của bài học `o.nolog`) — ielts.js; `toMockResult` + sửa chữ "chưa có Part 1" — toeic.js; `mkResult` — mock.js; `uRun` — uoe.js; màn kết quả của 008 khi làm.
- TOEIC nhãn dạng: `toQtOf(sec, q)` trong toeic.js chép luật `q34Ty` / `q7Ty` / `p2Ty` của tools/build-toeic.mjs; `daiQs` gắn nhãn cho câu đề AI / soạn sẵn.
- `xlBlock` (baihoc.js): thứ tự yếu (bản đồ) → vừa sai → chưa học; nhãn "vừa sai · xem lại"; học lại xong (`S.exl`) thì xoá cờ.
- 🛠 (backup.js): một dòng đếm lượt bấm. 📘 Luật (huongdan.js): đoạn "Sai ở đâu · học lại gì".
- Test C63 (duyệt toàn kho, luật nhãn TOEIC khớp bộ dựng, ô ở 5 màn, cờ vừa sai, không đổi luật đo); e2e thêm bước; tài liệu v146; phát hành bản 144.
