---
description: "Danh sách việc: 🎯 Luyện đề do AI soạn và chấm"
---

# Việc cần làm: 🎯 Luyện đề do AI soạn và chấm

**Đầu vào**: `specs/001-luyen-de-ai/` (spec, plan, research, data-model, contracts/de-ai.md, quickstart)

**Test**: BẮT BUỘC theo hiến pháp III (tính năng mới có test riêng: C53).

**Cách đọc**: `[P]` = làm song song được (khác tệp, không chờ việc chưa xong). `[USn]` = kịch bản n trong spec:
US1 Đề Đọc / câu lẻ AI (P1) · US2 Viết / Nói AI chấm (P2) · US3 Nghe AI (P2) · US4 Tab mới thay 🎓 Luyện thi trong 📚 Học (P1) · US5 Xem lại + bản đồ + đề dự trữ (P3).

Mọi việc chạm mã: chạy `graphify query` trước, báo "sửa X đụng tới …". Việc giao diện: chụp Chromium khổ iPhone SE + chấm màn (design-critique) trước khi sửa; dùng biến CSS chung; chữ theo ux-copy; kiểm khả năng tiếp cận sau.

---

## Phase 1: Chuẩn bị + đo thử (chặn mọi việc sau)

- [ ] T001 Hỏi người sáng lập đồng ý chi ~$0,30 cho lần đo thử và triển khai lên Supabase dự án `eojrfoormaqboxwvdqhr` (gói Free); ghi câu trả lời vào `specs/001-luyen-de-ai/quickstart.md` mục 2
- [ ] T002 Viết migration `supabase/migrations/20261107_v137_de_ai.sql`: bảng `de_ai` đúng data-model.md (`id uuid pk default gen_random_uuid()`, `uid uuid not null`, `at timestamptz default now()`, `ky`, `sk`, `dang`, `muc`, `st text` ∈ {`dang`,`xong`,`loi`}, `de jsonb`, `chk jsonb`, `err text`, `tin int`, `tout int`, `du bool default false`), chỉ mục `(uid, at desc)`, RLS bật, chính sách chỉ `select` khi `uid = auth.uid()`, không có chính sách insert / update / delete cho người dùng
- [ ] T003 Viết bản nháp `supabase/functions/de-ai/index.ts` chỉ cho `ky=ielts-ac, sk=doc, dang=R-tf` theo contracts/de-ai.md mục 1a + 3 (lấy người dùng từ JWT bằng `db.auth.getUser`, ghi dòng `dang`, `EdgeRuntime.waitUntil` soạn bằng `claude-opus-5-5` effort `medium` + `betaZodOutputFormat` + `fallbacks: "default"` như `supabase/functions/el-cham/index.ts`, máy kiểm mục 3.1–3.6, giải độc lập effort `low`, cập nhật `xong` / `loi`, ghi `el_cham` `kind='de'`); triển khai bằng Supabase MCP sau T001
- [ ] T004 Đo thử: gọi hàm 2 lần (curl với JWT tài khoản thử), ghi giây tới `xong`, `tin` / `tout`, tiền theo research.md R6, số câu bị lượt giải loại, đọc soát 2 đề bằng mắt; ghi kết quả vào `specs/001-luyen-de-ai/research.md` mục mới "R14. Kết quả đo thử"; **mốc dừng**: > 120 giây hoặc > 1 câu sai / đề → dừng, hỏi người sáng lập (Sonnet 5.5 / đề ngắn hơn) trước khi làm tiếp

---

## Phase 2: Nền chung (chặn mọi kịch bản)

- [ ] T005 Sửa `supabase/functions/el-cham/index.ts`: bỏ `PER_USER` và câu kiểm tương ứng; `PER_APP = 200` đếm mọi dòng `el_cham` 24 giờ qua có `kind ≠ 'ban'` (gồm `de`); sửa chú thích đầu tệp
- [ ] T006 Hoàn thiện `supabase/functions/de-ai/index.ts`: bảng khoá hợp lệ contracts/de-ai.md mục 2 (khoá lạ → 400), trần chung 200 (429 với chữ đúng hợp đồng), thiếu khoá → 503, dòng `dang` quá 10 phút đổi `loi`, soạn lại tối đa 1 lần, hạn chờ AI soạn 100 giây / giải 35 giây (giải quá hạn → `chk.bo='het-gio'`), lời nhắc hệ thống theo mục 5 (cấm chép đề chính thức, chủ đề nhạy cảm; nội dung yêu cầu là tham số)
- [ ] T007 [P] Thêm vào `tools/test/fake-sb.js`: `functions.invoke('de-ai')` trả `{ ok, id }` hoặc lỗi theo biến thử; `from('de_ai').select…eq('id')` trả đề mẫu cố định (IELTS Đọc R-tf 6 câu, TOEIC Part 5 10 câu, Cambridge B1 đọc 5 câu, IELTS Task 2, Nghe IELTS 6 câu) qua `maybeSingle`
- [ ] T008 Tạo `deai.js` phần lõi: `daiSt()` (`S.dai = { r: [], du: {}, mo: null, wait: {} }`, `r` giữ ≤ 100 dòng), `daiKy()` (kỳ thi + mức từ mục tiêu: `ltKind`, `ltGoalLv`, `S.ie` band / loại, `S.to` điểm; mục tiêu 📈 Giỏi lên → `cb-` + `ovStage()`), `daiAsk(ky, sk, dang)` (gọi `de-ai`, ghi `S.dai.wait`), `daiPoll(id)` (đọc `de_ai` mỗi 3 giây, tối đa 160 giây), `daiCheck(de)` (máy kiểm phía trang như hợp đồng 3.1–3.6, loại đề hỏng), báo lỗi lời thường (429 / 503 / mạng / quá giờ) không làm mất màn đang mở
- [ ] T009 Thêm `<script src="deai.js?v=136">` sau `baihoc.js` trong `index.html`; thêm `deai.js` vào `VUNG` khu "Luyện thi chung" trong `tools/graph-vung.py`

**Điểm kiểm**: hàm thật chạy được một dạng; trang gọi được hàm giả trong test.

---

## Phase 3: US4 — Tab 🎯 Luyện đề thay 🎓 Luyện thi trong 📚 Học (P1) 🎯 MVP

**Mục tiêu**: thanh dưới 5 mục; mọi màn kỳ thi thuộc tab 🎯; 📚 Học chỉ còn Nền.
**Kiểm độc lập**: mở 📚 Học không còn thẻ luyện thi; bấm 🎯 ra màn kỳ thi của mục tiêu, tab 🎯 sáng; việc luyện đề ở 📅 Hôm nay mở đúng màn.

- [ ] T010 [US4] Chụp Chromium khổ iPhone SE màn 📚 Học, màn IELTS, thanh dưới; chấm màn (design-critique) nêu 3 vấn đề, lưu ảnh + ghi chú ở `/tmp/claude-0/…/scratchpad/` và tóm tắt trong `specs/001-luyen-de-ai/research.md` mục "R15. Chấm màn trước khi sửa"
- [ ] T011 [US4] Sửa `index.html`: thêm `<button data-tab="ld"><i>🎯</i>Luyện đề</button>` sau nút `all`; CSS thanh dưới 5 nút đều nhau (mỗi nút ≥ 44 × 44 px ở khổ 320 px, chữ không xuống dòng), chỉ dùng biến CSS chung
- [ ] T012 [US4] Sửa `syncTabs` trong `app.js`: `#ie` (và `#dai` của deai.js) → `'ld'`; bấm tab `ld` → `exOpen()`; cập nhật chú thích lịch sử tab (v137)
- [ ] T013 [US4] Sửa `overview()` trong `parts.js`: bỏ `exCard` ("Luyện {kỳ thi}") và khối "Kỳ thi khác"; nếu mục tiêu là kỳ thi thì một dòng mờ "Luyện {kỳ thi} ở 🎯 Luyện đề ›" (`data-tabgo="ld"`); bỏ nạp `ieLoad` / `toLoad` không còn cần
- [ ] T014 [US4] Sửa `xHome` trong `parts.js`: thay nút "‹ Học" bằng hàng kỳ thi 🎓 Cambridge · 🌏 IELTS · 💼 TOEIC (🎯 = mục tiêu, dùng `EX_TABS`, `exGoalK` của `toeic.js`); thêm chỗ cắm `o.ai` (html ô 🤖) ngay dưới dòng tiến độ; sửa `toeic.js` (`exSwitch`, bộ bắt `data-exthi` / `data-exsel` / `data-hocnen`) cho khớp
- [ ] T015 [US4] Rà mọi lối tắt về màn kỳ thi trỏ đúng tab mới: `lotrinh.js` (`exGo`, `data-ltex`, `ltBanner`), `homnay.js` việc luyện đề, `dieuhuong.js` (`minhView`, `cbView` nút về), `bando.js` / `cbmap.js` (`data-mapk`), `baihoc.js` nút về; không còn "‹ Học" trên màn kỳ thi
- [ ] T016 [US4] Sửa `huongdan.js` mục 'bat-dau' / 4 tab → 5 tab, 'luyenthi' (chỗ mới, đề AI, nhãn chưa giáo viên kiểm, không tính luật đo)
- [ ] T017 [US4] Test trong `tools/test/run.mjs`: C53 phần tab (5 nút, thứ tự, 320 px không tràn, vùng bấm ≥ 44 px, 📚 Học không có "Luyện IELTS", màn kỳ thi sáng `ld`, việc Hôm nay mở màn kỳ thi trong tab `ld`); sửa C13, C27, C29, C37, C50 theo chỗ mới; chạy `node tools/test/run.mjs` xanh

**Điểm kiểm**: US4 dùng được riêng (chưa cần AI).

---

## Phase 4: US1 — Đề Đọc / câu lẻ do AI soạn (P1) 🎯 MVP

**Mục tiêu**: bấm một nút → đề mới đúng dạng → làm → điểm + đáp án + giải thích.
**Kiểm độc lập**: mục tiêu IELTS → 🎯 → ▶ Làm đề AI mới → đề mẫu (hàm giả) → làm hết → kết quả có nhãn "AI soạn, chưa giáo viên kiểm".

- [ ] T018 [P] [US1] Mở rộng `supabase/functions/de-ai/index.ts` họ đề Đọc / câu lẻ: IELTS `doc` mọi `dang` ở hợp đồng mục 2 (450–650 từ, 6–8 câu, 1–2 dạng), TOEIC `np` p5 (10 câu, có thể theo nhóm `TO_T5`), p6 (1 đoạn 4 câu), `doc` p7 (1–2 văn bản, 3–5 câu), Cambridge `doc` theo cấp (A1–A2 đọc ngắn trắc nghiệm; B1+ điền từ cả đoạn, tạo dạng từ, viết lại câu từ khoá); bảng độ dài / số câu từng dạng dùng cho cả máy kiểm
- [ ] T019 [US1] Trong `deai.js`: `daiQs(de)` chuyển `groups` → câu của `ieRun` (`kind:'mc'` khi có `o`; điền từ dùng `acc`; `head` = bài đọc có lớp `tdtap` + lời dặn; `ty` = `group.ty`; `x.id = 'ai:' + id`; `why` = `why_vi` + "📍" `ev`); `daiRun(row)` gọi `ieRun(title, qs, back, de.min, { R: kho riêng, src: 'ai', home, done })`
- [ ] T020 [US1] Thêm tuỳ chọn `o.src` cho `ieRun` trong `ielts.js` (mặc định `'luyen'`, truyền vào `ieTyLog`); TOEIC: trong `o.done` của deai.js gọi `toLog(res, 'ai', fresh)`; không ghi `S.ie.r` / `S.to.r` / `S.cbx`
- [ ] T021 [US1] Ô 🤖 trong `deai.js` `daiBox(k)`: MỘT nút chính "▶ Làm đề AI mới: {kỹ năng · dạng}" (dạng = chỗ yếu đầu bản đồ qua `imMap` / `tmMap` / bản đồ Cambridge, không có thì dạng ít làm nhất), hàng kỹ năng nhỏ, dòng "🤖 AI soạn, chưa giáo viên kiểm · khoảng 1–2 phút cho đề đầu"; truyền `o.ai = daiBox(k)` vào `xHome` ở `ieltsView` (`ielts.js`), `toeicView` (`toeic.js`), `cbView` (`dieuhuong.js`); nút "🤖 Đề AI mới" ở `xSkill` qua `ieSkView`, `toSkView`, `cbSkView`
- [ ] T022 [US1] Màn chờ `#dai` trong `deai.js`: "AI đang soạn đề…" + giây đã chờ + nút "Làm việc khác trong lúc chờ" (về màn kỳ thi; đề xong thì `toast` "Đề AI đã xong ›" mở đề); đề `loi` → lời thường + nút "Thử lại"
- [ ] T023 [US1] Màn kết quả (`o.endHtml`): điểm a / b, band IELTS ước (bảng `ieNeed` / thang /40 tỉ lệ, ghi "ước tính"), điểm TOEIC ước (`toNeed` tỉ lệ), mức đúng Cambridge so `MOCK.pass`; nút ⚑ Câu sai mỗi câu (góp ý loại `sai`, kèm id đề + chỉ số câu); ghi `S.dai.r`
- [ ] T024 [US1] Tính phút luyện đề cho màn chờ, đề AI, kết quả trong `lotrinh.js` (bọc như `ieSkView`, chỉ khi kỳ thi là mục tiêu, `LT_EX_ON`)
- [ ] T025 [US1] Test C53 phần Đọc trong `tools/test/run.mjs`: luồng hàm giả IELTS / TOEIC / Cambridge; câu `R-tf` vào `S.ie.ty` nguồn `ai`; `S.cards`, `S.units`, `S.exams` không đổi; đề hỏng bị `daiCheck` loại; lỗi 429 / 503 / quá giờ hiện chữ đúng hợp đồng; nhãn AI có mặt

**Điểm kiểm**: MVP = US4 + US1 chạy được; có thể dừng ở đây để người sáng lập dùng thử.

---

## Phase 5: US2 — Viết / Nói do AI soạn đề và AI chấm (P2)

**Kiểm độc lập**: tạo đề Task 2 → viết → AI chấm (hàm giả `el-cham`) → band 4 tiêu chí; TOEIC không có ô Viết / Nói.

- [ ] T026 [P] [US2] `supabase/functions/de-ai/index.ts` họ Viết / Nói: IELTS `t1` (số liệu dạng bảng `task.table`, 1 kiểu bar / line / table), `t2` (5 kiểu đề), `gt1` (thư 3 giọng), Nói `p1` (chủ đề + 4 câu), `p2` (thẻ + 4 ý + 3 câu Part 3); Cambridge `viet` theo thể loại của cấp, `noi` câu hỏi phần 1 / đề nói dài; kèm bài mẫu `m` ngắn
- [ ] T027 [US2] `ieWrite` trong `ielts.js` nhận đề ngoài (đề AI có `task.table` thì vẽ bằng `ieChart` dạng bảng) và tuỳ chọn tự gọi AI chấm khi nộp; deai.js `daiWrite(row)`; Cambridge dùng luồng Viết của đề thử (`mock.js` / `thi.js`) với đề AI
- [ ] T028 [US2] Nói: deai.js `daiSpeak(row)` dựng câu cho `ieSpeakCore` (IELTS) / `mkSpeakRun` (Cambridge) từ `de.speak`; máy không chép lời (`!SREC`) → ô gõ câu trả lời thay, ghi rõ "chấm bằng chữ gõ, không chấm phát âm"; AI chấm `noi` qua `aiBtn`
- [ ] T029 [US2] Ghi Viết / Nói: `ieCrLog(k, task, C, 'ai')` (IELTS), `S.dai.r` với `ai`; lỗi AI chỉ ra vào 📒 Sổ lỗi như `thi.js` đang làm
- [ ] T030 [US2] Test C53 phần Viết / Nói trong `tools/test/run.mjs` (giả `el-cham` trả band; TOEIC không có Viết / Nói; không chép lời → ô gõ)

---

## Phase 6: US3 — Nghe do AI soạn (P2)

**Kiểm độc lập**: tạo đề Nghe → 🔊 phát (2 giọng) → trả lời → nộp → lời nghe hiện sau khi nộp.

- [ ] T031 [P] [US3] `supabase/functions/de-ai/index.ts` họ Nghe: IELTS `L-form` / `L-mc` / `L-sa` / `L-match` (lời 350–500 từ, 6–10 câu), TOEIC p2 (8 câu hỏi–đáp, 3 lựa chọn), p3 / p4 (hội thoại 2–3 người / bài nói, 3 câu), Cambridge nghe theo cấp; `lines` + `sex`; máy kiểm đáp án điền có trong lời nghe
- [ ] T032 [US3] deai.js: câu Nghe có `play = { key: id, lines }` (phát bằng `kPlay`, giọng theo `sex`), số lần nghe như kỳ thi (IELTS 1, TOEIC 1, Cambridge 2); lời nghe chỉ hiện ở màn kết quả; dòng "🔊 Giọng máy của điện thoại, không phải giọng thu sẵn"
- [ ] T033 [US3] Test C53 phần Nghe trong `tools/test/run.mjs` (lời không hiện trước khi nộp; 2 người nói 2 giọng khi có)

---

## Phase 7: US5 — Xem lại, bản đồ, đề dự trữ, làm dở (P3)

- [ ] T034 [US5] deai.js `daiList()`: "🗂 Đề AI đã làm" (ngày, kỹ năng, dạng, điểm; mới nhất trên), mở lại xem lời giải (đọc `de_ai`); lối vào ở "Thêm" của màn kỳ thi
- [ ] T035 [US5] Bản đồ: IELTS / TOEIC đã nhận nguồn `ai` từ T020 / T029 (kiểm hiển thị đúng ô); `cbmap.js` đọc `S.dai.r` có `ky = cb-<cấp>` theo khoá phần (`cbKey`), cùng `CB_WIN`
- [ ] T036 [US5] Đề dự trữ: làm xong 1 đề AI của một kỹ năng → `daiAsk(…, du=true)` soạn sẵn 1 đề (≤ 1 mỗi kỹ năng, hết hạn 7 ngày, không soạn khi đã 429); bấm ▶ dùng đề dự trữ ngay
- [ ] T037 [US5] Làm dở: lưu `S.dai.mo = { id, at, i, ans }` sau mỗi câu; mở lại trong 24 giờ hỏi "Làm tiếp đề dở?"
- [ ] T038 [US5] 🛠 công cụ người sáng lập trong `backup.js`: số đề AI / lượt chấm / token / tiền ước 7 ngày (bảng giá research.md R6), đọc `el_cham` qua `de-ai` `act: 'tk'` (chỉ trả số tổng, không trả dữ liệu người dùng)
- [ ] T039 [US5] Test C53 phần xem lại / dự trữ / làm dở trong `tools/test/run.mjs`

---

## Phase 8: Hoàn thiện, phát hành

- [ ] T040 Kiểm khả năng tiếp cận (accessibility-review) màn kỳ thi + ô 🤖 + màn chờ + thanh dưới 5 mục: tương phản, vùng bấm ≥ 44 px, cỡ chữ; báo trước / sau
- [ ] T041 [P] Sửa `tools/test/e2e-webkit.mjs` theo tab mới; chạy trên Chromium khổ iPhone 13 (tắt máy chép lời); ghi "chưa kiểm trên iPhone"
- [ ] T042 [P] Viết đoạn v137 trong `CLAUDE.md` (dòng tóm tắt đầu + đoạn chi tiết), cập nhật `README.md`, `.specify/memory/constitution.md` nếu luật đổi (không đổi)
- [ ] T043 Chạy `graphify update . && python3 tools/graph-vung.py`
- [ ] T044 Áp migration `supabase/migrations/20261107_v137_de_ai.sql` + triển khai `de-ai` và `el-cham` bản mới lên Supabase (Supabase MCP); kiểm `get_advisors` bảo mật cho bảng `de_ai`
- [ ] T045 `node tools/release.mjs` (test xanh, tăng `APP_V` / `?v=` / `version.json` lên 137); commit; `git push -u origin claude/ecstatic-curie-q9g1ja`
- [ ] T046 Thử thật theo `specs/001-luyen-de-ai/quickstart.md` mục 2 (cần người sáng lập đồng ý chi tiền); báo kết quả + danh sách kiểm iPhone cho người sáng lập

---

## Phụ thuộc

- Phase 1 → Phase 2 → (Phase 3 US4 ‖ Phase 4 US1) → Phase 5 US2 ‖ Phase 6 US3 → Phase 7 US5 → Phase 8.
- US4 không cần AI (làm được ngay sau Phase 2). US1 cần T008 + T018. US2, US3 độc lập nhau. US5 cần US1.
- Mốc dừng T004 chặn mọi việc sau nếu đo thử không đạt.

## Làm song song

- T007 (fake-sb) ‖ T005 / T006 (máy chủ).
- T018, T026, T031 (họ đề trên máy chủ, cùng tệp nên làm nối tiếp nhau nhưng song song với việc trang của từng kịch bản).
- T041 ‖ T042.

## Chiến lược

1. **MVP** = Phase 1–4 (tab mới + đề Đọc / câu lẻ AI cho 3 kỳ thi). Dừng, người sáng lập thử 20 đề, đo SC-002 / SC-003.
2. Thêm US2, US3 (Viết / Nói / Nghe), rồi US5.
3. Mỗi bước: test xanh, chụp Chromium, ghi "chưa kiểm trên iPhone".
