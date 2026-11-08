# Plan: Kho đề soạn sẵn

1. `content/dekho/<nhóm>.json`: mảng `{ id, ky, sk, dang, g }` với `g` = đầu ra thô giống AI (title, topic, gist, vi, text, lines [{who,s}], voices, groups [{ty, inst, opts, lim, items [{q, o, a, acc, why_vi, ev}]}], task, speak).
2. `tools/build-dekho.mjs`: nhập `khuon.js` (spec, clean) + `trung.js` (isDup); mỗi đề: spec(ky, sk, dang) → clean(g, sp, P) → lỗi cứng hoặc lỗi mềm (câu bị bỏ) = dừng; trùng đề khác cùng nhóm = dừng; ghi `dekho.json` { v, n, de: [{ id, for, de }] }.
3. `deai.js`: `daiKho()` nạp `dekho.json` (một lần), `daiKhoLeft(ky, dang)`, `daiKhoPick`; `daiGo` lấy kho trước; `daiRun` / `daiopen` nhận mã `kho:`; `daiBox` / `daiSkView` ghi số đề soạn sẵn còn lại; `daiPick` ưu tiên dạng còn đề kho; `daiPrefetch` chỉ khi hết kho; lỗi "chưa có khoá" → màn "đã làm hết đề soạn sẵn".
4. `thi.js` `aiBtn`: thêm 📋 Chép lời nhắc (`aiPrompt`).
5. Test C62 (bộ dựng + luồng kho trong VM, không gọi máy chủ), e2e Chromium, tài liệu v145, bản 143.
