// 📘 Bài học của kỳ thi (v131, 4/11/2026, người sáng lập: "luyện thi của các mục tiêu hình như không phải dạng bài học, toàn dạng bài làm. Tách ra 2 dạng học và bài tập như nền CEFR").
// Bài học = một DẠNG câu (IELTS, TOEIC) hoặc một PHẦN của bài thi (Cambridge), theo thứ tự như bài giảng luyện thi:
//   🎯 dạng này là gì → 🪜 cách làm → 🔍 ví dụ có lời giải (câu thật trong kho của app: tự nghĩ trước, rồi mở đáp án + vì sao + câu chứa đáp án)
//   → 🪤 bẫy hay gặp → ✍️ làm thử 3 câu (báo đúng / sai ngay; KHÔNG ghi vào kết quả bài, band / điểm ước, bản đồ) → ✓ đã học (S.exl[id] = { at, ok, n }).
//   Viết: ví dụ = đề + bài mẫu chia theo đoạn, làm thử = nhận ra bố cục (mở bài, tổng quan, câu chủ đề…). Nói: câu trả lời mẫu, làm thử = chọn câu trả lời tốt.
// 🏋️ Bài tập = các bài cụ thể như v122 (ghi kết quả, band ước, bản đồ). Luyện thi vẫn không tính 📘 Học / 🔁 Nhớ / Thi chuyển cấp của 🧱 Nền.
// Ví dụ cố định (bài cuối danh sách, ít trùng bài tập kế tiếp); câu làm thử lấy từ kho bài tập, ưu tiên bài đã làm, nên có thể gặp lại vài câu khi làm bài tập.
const XL_TRY = 3;
// ---------- nội dung (Claude soạn, chưa giáo viên kiểm; tools/export-review.mjs đọc khối XL_TXT này) ----------
// hw: thêm mẹo có sẵn của IE_HOW (ieplus.js) trước how; ks: dạng câu Nghe IELTS; kinds: loại Task 1; only: chỉ Academic (ac) / General Training (gt)
const XL_TXT = {
  ie: {
    R: [
      { k: 'para', ic: '🔁', t: 'Diễn đạt lại: kỹ năng gốc', what: 'Câu hỏi IELTS hầu như không chép nguyên câu trong bài. Người ra đề dùng từ đồng nghĩa, đổi loại từ, đổi cấu trúc câu. Nhận ra hai câu cùng ý là kỹ năng gốc của mọi dạng Đọc và Nghe.',
        how: ['Gạch các ý chính của câu: ai, làm gì, khi nào, bao nhiêu.', 'Nghĩ sẵn cách nói khác: từ đồng nghĩa (rise → increase), đổi loại từ (popular → popularity), chủ động ↔ bị động.', 'So từng ý: câu cùng ý phải khớp ĐỦ các ý, không thêm, không ngược.'],
        trap: ['Câu bẫy giữ nguyên vài từ của câu gốc nhưng đổi ý (đổi người làm, đổi chiều so sánh).', 'Từ giống nhau chưa chắc cùng nghĩa; từ khác nhau vẫn có thể cùng nghĩa.'] },
      // v132 (rà dạng còn thiếu): văn bản General Training, điền bảng, chọn HAI
      { k: 'gt', ic: '🏢', t: 'Văn bản General Training (Section 1, 2)', only: 'gt', u: 'R-gt', what: 'Đề General Training có 3 phần: Section 1 là vài văn bản ngắn đời thường (quảng cáo, thông báo, lịch), Section 2 là văn bản công việc (nội quy, hướng dẫn nhân viên), Section 3 là một bài dài. Dạng câu giống bài Academic; chữ dễ hơn nhưng phải đọc nhanh nhiều văn bản.',
        how: ['Section 1: đọc tiêu đề từng văn bản (A–E); câu hỏi "Which…?" thì dò tên, giá, giờ, điều kiện.', 'Section 2: đọc câu đầu mỗi đoạn để biết đoạn nói gì, tìm đúng đoạn rồi chép từ cho câu điền, trả lời ngắn.', 'Làm nhanh Section 1–2 (khoảng 30 phút) để dành thời gian cho Section 3.'],
        trap: ['Thông tin gần giống nằm ở văn bản bên cạnh (giờ, giá của khoá khác).', 'Câu hỏi hỏi điều kiện ("must", "only"): đọc kỹ chữ nhỏ.'] },
      { k: 'tf', ic: '⚖️', t: 'TRUE / FALSE / NOT GIVEN', what: 'Đề cho một số câu nói về bài. Câu khớp thông tin trong bài: TRUE. Bài nói ngược lại: FALSE. Bài không có thông tin để biết đúng hay sai: NOT GIVEN. Câu hỏi đi theo thứ tự của bài.', hw: 'tf',
        trap: ['FALSE cần một câu trong bài nói NGƯỢC lại. Không tìm được câu đó thì là NOT GIVEN.', 'Câu hỏi thêm một chi tiết bài không nói (lần đầu, duy nhất, một con số) thường là NOT GIVEN hoặc FALSE.'] },
      { k: 'yn', ic: '💭', t: 'YES / NO / NOT GIVEN', what: 'Giống TRUE / FALSE / NOT GIVEN nhưng hỏi về Ý KIẾN, nhận định của tác giả. YES: tác giả nghĩ vậy. NO: tác giả nghĩ ngược lại. NOT GIVEN: không biết tác giả nghĩ gì.',
        how: ['Tìm chỗ tác giả nêu ý kiến: I believe, it seems, surely, unfortunately, should, the evidence suggests…', 'Tách ý tác giả với ý người khác được nhắc trong bài ("Some argue that…" chưa phải ý tác giả).', 'So mức độ: "rất chắc chắn" khác "thấy có hi vọng".'],
        trap: ['Ý của người được trích dẫn trong bài không phải ý tác giả.', 'Từ chỉ mức độ (completely, always, some) có thể biến YES thành NO.'] },
      { k: 'h', ic: '🧭', t: 'Chọn tiêu đề cho đoạn', what: 'Mỗi đoạn (A, B, C…) chọn một tiêu đề trong danh sách. Danh sách có tiêu đề thừa. Tiêu đề phải nói ý chính của CẢ đoạn.', hw: 'h',
        trap: ['Tiêu đề lặp đúng một từ trong đoạn nhưng chỉ nói một chi tiết nhỏ.', 'Hai tiêu đề gần nghĩa: xem đoạn nói nguyên nhân, kết quả hay giải pháp.'] },
      { k: 'mi', ic: '🔎', t: 'Tìm đoạn chứa thông tin', what: 'Cho một thông tin (một ví dụ, một lý do, một so sánh…), tìm đoạn có thông tin đó. Câu hỏi KHÔNG theo thứ tự bài; một đoạn có thể dùng nhiều lần.',
        how: ['Xem câu hỏi cần LOẠI thông tin gì: a reason, an example, a comparison, a prediction…', 'Nên làm dạng này sau các dạng khác của cùng bài: đã đọc kỹ thì tìm đoạn nhanh hơn.', 'Thông tin thường là một chi tiết nhỏ giữa đoạn, không phải ý chính: đừng chỉ đọc câu đầu đoạn.'],
        trap: ['Đoạn có từ khoá giống câu hỏi chưa chắc có đúng loại thông tin (nhắc tới "cost" nhưng không có ví dụ về cost).'] },
      { k: 'mf', ic: '👤', t: 'Nối đặc điểm với tên', what: 'Có danh sách tên (nhà nghiên cứu, công ty, giai đoạn…) và các nhận định. Nối mỗi nhận định với đúng tên. Một tên có thể dùng nhiều lần hoặc không dùng.',
        how: ['Tìm và đánh dấu mọi chỗ có tên trong bài trước (tên riêng dễ thấy).', 'Nhận định là ý được diễn đạt lại: so ý, đừng so từ.', 'Nhận định không theo thứ tự bài.'],
        trap: ['Một câu nhắc hai người: xem ý thuộc về ai (he, she, the former, the latter).'] },
      { k: 'se', ic: '🧩', t: 'Nối nửa câu', what: 'Cho nửa đầu câu, chọn vế sau trong danh sách để câu đúng ý bài. Có vế thừa. Câu hỏi theo thứ tự bài.',
        how: ['Đọc nửa đầu, tìm chỗ trong bài, đoán ý vế sau trước khi xem danh sách.', 'Loại vế ghép vào không thành câu đúng ngữ pháp.', 'Vế đúng phải đúng ý BÀI, không chỉ nghe hợp lý.'],
        trap: ['Vế thừa thường đúng ngữ pháp, có từ trong bài, nhưng nói chuyện khác.'] },
      { k: 'mc', ic: '🔘', t: 'Trắc nghiệm', what: 'Chọn 1 trong 4 phương án (A–D); có đề chọn 2 trong 5. Câu hỏi theo thứ tự bài.',
        how: ['Đọc câu hỏi trước (chưa đọc phương án), tìm chỗ trong bài, hiểu ý chỗ đó.', 'So từng phương án: loại cái sai một phần, ngược ý, hoặc bài không nói.', 'Phương án đúng thường diễn đạt lại; phương án chép nguyên từ trong bài hay là bẫy.'],
        trap: ['Phương án đúng ngoài đời nhưng bài không nói.', 'Phương án đúng một nửa: đúng người, sai việc.'] },
      { k: 'mc2', ic: '✌️', t: 'Chọn HAI đáp án', u: 'R-mc', what: 'Câu hỏi có 5 phương án (A–E), đề ghi "Choose TWO letters". Mỗi chữ đúng được 1 điểm; thứ tự nào cũng được.',
        how: ['Gạch chữ TWO và từ khoá của câu hỏi; tìm đoạn nói về ý đó.', 'Xét cả 5 phương án: bài nói rõ / bài nói khác / bài không nói; chỉ giữ hai phương án bài nói rõ.', 'Hai đáp án thường nằm gần nhau trong bài, nhưng cũng có khi ở hai câu khác nhau.'],
        trap: ['Phương án lấy ý của đoạn khác hoặc của người khác trong bài.', 'Phương án đúng một phần ("tăng mạnh" khi bài nói "giữ ổn định").'] },
      { k: 'comp', ic: '✏️', t: 'Điền câu (không quá 2 từ)', what: 'Hoàn thành câu bằng từ lấy đúng trong bài, không quá số từ đề cho (vd. NO MORE THAN TWO WORDS).', hw: 'comp', how: ['Câu hỏi theo thứ tự bài.'],
        trap: ['Viết thừa từ (quá giới hạn) là sai cả câu.', 'Sai số ít / số nhiều hay sai chính tả đều mất điểm.'] },
      { k: 'sum', ic: '📝', t: 'Điền tóm tắt', what: 'Một đoạn tóm tắt một phần bài, có chỗ trống. Điền từ trong bài, hoặc chọn từ trong khung (có từ thừa).',
        how: ['Đọc cả đoạn tóm tắt trước để biết nó tóm phần nào của bài.', 'Đoán loại từ cần điền (danh từ, tính từ, số) nhờ từ đứng trước và sau chỗ trống.', 'Có khung từ: từ trong khung thường là từ đồng nghĩa, không phải từ chép từ bài.'],
        trap: ['Từ đúng nghĩa nhưng sai loại từ (cần danh từ mà điền tính từ).'] },
      { k: 'rtab', ic: '📋', t: 'Điền bảng, ghi chú', u: 'R-sum', what: 'Một bảng (hoặc ghi chú) tóm tắt thông tin của bài, có ô trống. Điền từ lấy đúng trong bài, không quá số từ đề cho. Cùng họ với điền tóm tắt và lưu đồ.',
        how: ['Đọc tên cột và hàng trước: biết mỗi ô cần loại thông tin gì (ưu điểm, nhược điểm, số, tên).', 'Thông tin trong bảng thường theo thứ tự bài; tìm đoạn nói về từng hàng.', 'Chép đúng từ trong bài, đúng số từ, đúng chính tả.'],
        trap: ['Từ đúng nghĩa nhưng thuộc hàng khác (ưu điểm của cách này, nhược điểm của cách kia).'] },
      { k: 'dia', ic: '🗂', t: 'Điền sơ đồ, quy trình', what: 'Sơ đồ hoặc các bước của một quy trình có ô trống. Điền từ lấy trong bài, đúng giới hạn số từ.',
        how: ['Xem mũi tên, thứ tự các bước trước: biết ô trống ở bước nào.', 'Phần bài tả quy trình thường gọn trong 1–2 đoạn: tìm đoạn đó, đọc theo thứ tự.', 'Đúng chính tả, đúng số từ.'] },
      { k: 'sa', ic: '❓', t: 'Trả lời ngắn', what: 'Trả lời câu hỏi (What, Which, How many…) bằng từ trong bài, không quá số từ đề cho (vd. NO MORE THAN THREE WORDS AND/OR A NUMBER).',
        how: ['Từ hỏi cho biết loại đáp án: How many → số, Where → nơi, Who → người.', 'Chép đúng từ trong bài, không viết cả câu.', 'Câu hỏi theo thứ tự bài.'] },
      { k: 'time', ic: '⏱', t: 'Quản lý giờ Đọc', what: 'Bài Đọc có 3 bài, 40 câu, 60 phút, không thêm giờ chép đáp án. Sai không bị trừ điểm: đừng bỏ trống câu nào.', hw: 'time' }],
    L: [
      { k: 'form', ic: '📝', t: 'Điền phiếu, ghi chú, bảng, lưu đồ', ks: ['form', 'tab', 'flow'], u: 'L-form', what: 'Nghe rồi điền phiếu đăng ký, ghi chú, bảng hoặc lưu đồ (các bước nối mũi tên). Mỗi chỗ viết đúng số từ đề cho (vd. ONE WORD AND/OR A NUMBER). Hay gặp ở Part 1 và Part 4.', hw: 'listen',
        how: ['Trước khi nghe: đoán mỗi chỗ cần số, tên, ngày hay danh từ.', 'Tên riêng hay được đánh vần: viết từng chữ khi nghe.'],
        trap: ['Người nói sửa lời: "It\'s 15… sorry, 50 pounds".', 'Nghe hai con số; chỉ một con số trả lời đúng câu hỏi.'] },
      { k: 'sent', ic: '💬', t: 'Điền câu, trả lời ngắn', ks: ['sent', 'sa'], u: 'L-sa', what: 'Hoàn thành câu, hoặc trả lời câu hỏi ngắn, bằng từ nghe được, đúng giới hạn số từ (vd. NO MORE THAN THREE WORDS).',
        how: ['Đọc câu trước khi nghe, đoán ý và loại từ còn thiếu.', 'Câu trong đề thường được nói khác đi trong bài nghe: nghe ý, đừng chờ đúng từ.', 'Từ điền vào phải làm câu đúng ngữ pháp.'] },
      { k: 'mc', ic: '🔘', t: 'Nghe trắc nghiệm', ks: ['mc'], u: 'L-mc', what: 'Chọn 1 trong 3 phương án (A–C); có đề chọn 2 trong 5. Hay gặp ở Part 2 và Part 3.',
        how: ['Đọc câu hỏi và phương án trước, gạch chỗ khác nhau giữa các phương án.', 'Người nói thường nhắc cả 3 phương án: nghe cái nào bị loại (but, actually, not any more).', 'Câu hỏi đi theo thứ tự lời nói.'],
        trap: ['Phương án nghe được đúng từ nhưng là ý bị gạt đi.'] },
      { k: 'mc2', ic: '✌️', t: 'Nghe chọn HAI đáp án', ks: ['mc2'], u: 'L-mc', what: 'Câu hỏi có 5 phương án (A–E), chọn HAI. Mỗi chữ đúng được 1 điểm; thứ tự nào cũng được. Hay gặp ở Part 2 và Part 3.',
        how: ['Trước khi nghe: đọc 5 phương án, gạch chỗ khác nhau.', 'Người nói thường nhắc gần hết 5 phương án: đánh dấu cái nào được xác nhận, cái nào bị gạt đi.', 'Hai đáp án có thể đến theo bất kỳ thứ tự nào.'],
        trap: ['Phương án được nhắc rồi bị phủ định ("you need to bring your own tent").'] },
      { k: 'map', ic: '🗺', t: 'Bản đồ, sơ đồ', ks: ['map'], u: 'L-map', what: 'Nhìn bản đồ hoặc sơ đồ có các chữ cái. Nghe người nói chỉ đường, tả vị trí, rồi chọn chữ cho mỗi địa điểm.',
        how: ['Trước khi nghe: tìm điểm bắt đầu (lối vào, "You are here"), hướng Bắc, các vật làm mốc.', 'Học từ chỉ vị trí: opposite, next to, behind, in the corner, at the end of, on your left.', 'Nghe tới đâu, lấy ngón tay đi theo tới đó trên bản đồ.'] },
      { k: 'match', ic: '🔗', t: 'Ghép (matching)', ks: ['match'], u: 'L-match', what: 'Nối mỗi mục (người, nơi, việc) với một lựa chọn trong danh sách. Có lựa chọn thừa.',
        how: ['Đọc danh sách lựa chọn trước, nhớ ý chính của từng cái.', 'Nghe theo thứ tự các mục; lời nói diễn đạt lại lựa chọn.'],
        trap: ['Lựa chọn được nhắc tới nhưng bị phủ định ("not the price, but…") là bẫy.'] }],
    W: [
      { k: 'w1-trend', ic: '📈', t: 'Task 1: biểu đồ đường, cột', only: 'ac', kinds: ['line', 'bar'], what: 'Biểu đồ cho số liệu thay đổi theo thời gian (đường) hoặc so sánh các nhóm (cột). Viết ít nhất 150 từ trong khoảng 20 phút. Chỉ tả số liệu, không nêu ý kiến.', hw: 't1',
        how: ['Từ chỉ xu hướng: rise, increase, fall, decline, remain stable, fluctuate, peak at, reach a low of.', 'Từ chỉ mức độ: slightly, gradually, steadily, sharply, dramatically.'] },
      { k: 'w1-comp', ic: '🥧', t: 'Task 1: bảng, biểu đồ tròn', only: 'ac', kinds: ['table', 'pie'], what: 'Bảng số liệu hoặc biểu đồ tròn (phần trăm). Chủ yếu SO SÁNH các nhóm, có khi so hai năm.', hw: 't1',
        how: ['Chọn số nổi bật (lớn nhất, nhỏ nhất, chênh nhiều); không chép hết mọi số.', 'Cách so sánh: the largest proportion, twice as many as, a quarter of, slightly higher than.', 'Gom các nhóm giống nhau vào cùng một đoạn.'] },
      { k: 'w1-map', ic: '🗺', t: 'Task 1: bản đồ', only: 'ac', kinds: ['map'], what: 'Hai bản đồ một nơi ở hai thời điểm (có đề là kế hoạch tương lai). Tả cái gì thay đổi, cái gì giữ nguyên.',
        how: ['Câu tổng quan: thay đổi lớn nhất (thêm nhà ở, mất cây xanh, đường mới).', 'Dùng bị động: was replaced by, was built, were demolished, was extended.', 'Chỉ vị trí: in the north, to the east of, next to, opposite.'] },
      { k: 'w1-proc', ic: '🔄', t: 'Task 1: quy trình', only: 'ac', kinds: ['process'], what: 'Sơ đồ các bước làm ra một thứ (quy trình nhân tạo) hoặc một chu trình tự nhiên. Tả lần lượt từng bước.',
        how: ['Câu tổng quan: có mấy bước, bắt đầu và kết thúc thế nào.', 'Quy trình nhân tạo dùng bị động (is heated, are packed); chu trình tự nhiên dùng chủ động (the tadpole grows).', 'Từ nối thứ tự: first, next, after that, once…, finally.'] },
      { k: 'w1-mixed', ic: '📊', t: 'Task 1: hai biểu đồ kết hợp', only: 'ac', kinds: ['mixed'], what: 'Đề cho hai hình cùng chủ đề (vd. biểu đồ tròn + biểu đồ cột, bảng + biểu đồ đường). Vẫn viết một bài ít nhất 150 từ trong khoảng 20 phút.', hw: 't1',
        how: ['Mở bài nêu cả hai hình; câu tổng quan nêu nét chính của CẢ HAI hình.', 'Mỗi hình một đoạn chi tiết; nối bằng câu chuyển ý (Turning to…, As for…).', 'Có liên hệ giữa hai hình (cùng năm, cùng nhóm) thì nêu ra.'] },
      { k: 'w1-gt', ic: '✉️', t: 'Task 1: viết thư', only: 'gt', what: 'Viết thư ít nhất 150 từ trong khoảng 20 phút, theo đủ 3 ý gạch đầu dòng của đề. Giọng thư theo người nhận: trang trọng, nửa trang trọng hay thân mật.', hw: 'gt1' },
      { k: 'w2-type', ic: '🧭', t: 'Task 2: nhận kiểu đề', what: 'Task 2 là bài luận ít nhất 250 từ trong khoảng 40 phút, điểm tính gấp đôi Task 1. Có 5 kiểu đề hay gặp; mỗi kiểu cần một cách trả lời.',
        how: ['Đồng ý hay không (To what extent do you agree?): nêu rõ mức đồng ý, giữ một quan điểm suốt bài.', 'Bàn hai quan điểm (Discuss both views and give your opinion): viết cả hai bên, rồi nêu ý mình.', 'Lợi và hại (advantages, disadvantages): viết cả hai; đề hỏi bên nào hơn thì phải nói rõ.', 'Vấn đề và giải pháp (causes, problems, solutions): giải pháp phải khớp vấn đề.', 'Hai câu hỏi: trả lời đủ CẢ HAI, mỗi câu một đoạn.'],
        trap: ['Trả lời thiếu một phần đề hỏi làm mất điểm Task Response nhiều nhất.', 'Viết về chủ đề chung chung thay vì đúng câu hỏi.'] },
      { k: 'w2-struct', ic: '🏗', t: 'Task 2: bố cục bài luận', what: 'Bài luận 4–5 đoạn: mở bài, 2–3 đoạn thân bài, kết luận. Giám khảo chấm 4 tiêu chí ngang nhau: trả lời đề, mạch lạc, từ vựng, ngữ pháp.', hw: 't2',
        how: ['Mỗi đoạn thân bài: câu chủ đề → giải thích → ví dụ.'] }],
    S: [
      { k: 'p1', ic: '🗣', t: 'Part 1: câu hỏi về bản thân', what: 'Khoảng 4–5 phút. Giám khảo hỏi về bạn và chủ đề quen thuộc (nhà, việc học, sở thích). Mỗi câu trả lời 2–3 câu.',
        how: ['Trả lời thẳng → thêm lý do → thêm một chi tiết hay ví dụ nhỏ.', 'Dùng đúng thì của câu hỏi: Do you…? hiện tại; Did you…? quá khứ; Will you…? tương lai.', 'Không nghe rõ: "Sorry, could you repeat the question?" không bị trừ điểm.'],
        ex: { q: 'Do you live in a house or a flat?', m: "I live in a flat on the eighth floor of a building in Hanoi. It's quite small, but it's really convenient, because my office is only ten minutes away.", note: 'Trả lời thẳng (a flat) → chi tiết (eighth floor, Hanoi) → lý do (convenient, because…).' } },
      { k: 'p2', ic: '🃏', t: 'Part 2: nói 2 phút theo thẻ', what: 'Nhận thẻ đề có 4 ý gợi ý. Có 1 phút chuẩn bị, được ghi chú, rồi nói 1–2 phút liền. Giám khảo có thể hỏi thêm 1–2 câu ngắn.', hw: 'p2',
        note: 'Bài mẫu đi theo đủ 4 ý gợi ý, kể theo thứ tự thời gian, có lý do và cảm xúc.' },
      { k: 'p3', ic: '💬', t: 'Part 3: bàn luận', what: 'Khoảng 4–5 phút. Câu hỏi khó hơn, liên quan chủ đề Part 2: xã hội, so sánh xưa và nay, dự đoán tương lai.',
        how: ['Nêu ý kiến → giải thích → ví dụ → nhìn mặt kia ("On the other hand…").', 'Nói về con người nói chung (people, society), không chỉ chuyện riêng của mình.', "Dùng câu nêu ý kiến, so sánh: I'd say…, compared with…, it depends on…"],
        ex: { q: 'What qualities make someone a good role model?', m: "I'd say the most important quality is consistency. A good role model doesn't just give advice; they actually live by it. For example, a teacher who tells students to read more should be a keen reader too. Honesty matters as well, because young people quickly notice when adults say one thing and do another.", note: 'Ý kiến (consistency) → giải thích → ví dụ (a teacher…) → thêm ý thứ hai (honesty) có lý do.' } }] },
  to: {
    // v137 (TOEIC đủ dạng câu): 33 bài theo thứ tự đề thật; mỗi dạng của bảng dạng câu (specs/001-toeic-du-dang) một bài, ví dụ + làm thử lấy theo nhãn dạng (tools/build-toeic.mjs)
    L: [
      { k: 'p1', ic: '🖼', t: 'Part 1: Tranh có người', u: 'p1', what: 'Đề thật 6 câu, mỗi câu một ảnh (app dùng tranh vẽ). Phần lớn là tranh có người: nghe 4 câu tả (đề không in chữ), chọn câu tả đúng việc người trong tranh đang làm.',
        how: ['Trước khi nghe: nhìn ai, đang làm gì, cầm gì, ở đâu; nghĩ sẵn động từ (typing, holding, reaching for, shaking hands).', 'Câu đúng thường ở hiện tại tiếp diễn: "A woman is standing…", "They are looking at…".', 'Nghe từng câu, loại ngay câu sai một chi tiết: sai người, sai việc, sai vị trí.'],
        trap: ['Câu có tên vật trong tranh nhưng sai hành động (cây có trong tranh, nhưng không ai đang tưới).', '"wearing" (đang mặc sẵn) khác "putting on" (đang mặc vào): tranh người đang đội mũ sẵn thì "is putting on a hat" là sai.'] },
      { k: 'p1o', ic: '🖼', t: 'Part 1: Tranh đồ vật, cảnh', what: 'Tranh không có người, hoặc người chỉ là phụ: hàng hoá, bàn ghế, xe cộ, cảnh ngoài trời. Câu đúng tả vị trí và trạng thái của vật.',
        how: ['Nhìn vật chính và vị trí: on the shelf, in a row, next to, along the path.', '"has been / have been + V3" (Some boxes have been stacked) = việc đã xong, giờ chỉ còn trạng thái: không cần có người.', '"There is / There are…", "be + V3" (The table is set) cũng tả trạng thái.'],
        trap: ['"is being + V3" (A table is being set) = đang có người làm việc đó: tranh không có người thì câu này sai.', 'Câu nói về người ("A man is riding…") khi tranh không có người.'] },
      { k: 'p2', ic: '🗣', t: 'Part 2: Câu hỏi Wh-', u: 'p2', what: 'Đề thật 25 câu: nghe một câu hỏi hoặc câu nói và 3 lời đáp (không in chữ), chọn lời đáp hợp nhất. Gần một nửa là câu hỏi Wh- (Who, When, Where, What, Which, How, Why).',
        how: ['Nghe kỹ 1–2 từ đầu câu: When → thời gian, Where → nơi, Who → người, Why → lý do, How long / How much / How many → số.', 'Câu Wh- không trả lời bằng Yes / No: lời đáp mở đầu bằng Yes, No là loại ngay.', 'Lời đáp gián tiếp vẫn đúng: "I\'m not sure, ask Tom." / "It hasn\'t been decided yet."'] },
      { k: 'p2-yn', ic: '🗣', t: 'Part 2: Câu hỏi Yes / No', what: 'Câu hỏi mở đầu bằng trợ động từ (Is, Do, Have, Can, Will…), câu hỏi phủ định (Isn\'t…? Didn\'t…?), câu hỏi đuôi (…, isn\'t it?) và câu hỏi gián tiếp (Do you know where…?).',
        how: ['Lời đáp có thể có Yes / No, hoặc bỏ Yes / No mà đáp thẳng ý: "Have you sent the invoice?" → "I\'ll do it this afternoon."', 'Câu hỏi phủ định, câu hỏi đuôi: đáp như câu hỏi thường (đúng là Yes, không là No); đừng để chữ "not" làm rối.', 'Câu hỏi gián tiếp "Do you know where…?": lời đáp tốt cho luôn thông tin (nơi, giờ), không chỉ "Yes, I do".'],
        trap: ['Lời đáp có Yes / No nhưng phần sau nói chuyện khác.', 'Lời đáp lặp lại từ trong câu hỏi (budget, finished) mà không trả lời.'] },
      { k: 'p2-or', ic: '🗣', t: 'Part 2: Câu hỏi lựa chọn', what: 'Câu hỏi có "A or B?" ("Should we order now or wait for Tom?"). Lời đáp chọn A, chọn B, cả hai, không cái nào, hoặc đưa cách thứ ba.',
        how: ['Nghe và nhớ cả hai lựa chọn A, B.', 'Lời đáp đúng ít khi lặp nguyên chữ: "Either day works for me." / "Neither, I have to stay here." / "The second one, please."', 'Lời đáp đưa cách thứ ba vẫn đúng: "It\'s been moved to the hotel next door."'],
        trap: ['Lời đáp mở đầu bằng Yes / No: câu hỏi lựa chọn không trả lời Yes / No.', 'Lời đáp lặp một từ trong câu hỏi (conference, meet) nhưng không chọn gì.'] },
      { k: 'p2-req', ic: '🗣', t: 'Part 2: Đề nghị, nhờ vả, mời', what: 'Câu nhờ (Could you…? Would you mind…?), câu gợi ý (Why don\'t we…? Let\'s… How about…?), câu mời, đề nghị giúp (Would you like…? Do you want me to…?).',
        how: ['Đây không phải câu hỏi lấy thông tin: lời đáp là đồng ý, từ chối, hoặc hỏi lại cho rõ.', 'Đồng ý: "Sure." / "No problem." / "That\'s a good idea." Từ chối lịch sự: "I\'m afraid I can\'t." / "Thanks, but I\'ve already…".', '"Why don\'t we…?" là gợi ý, không hỏi lý do: lời đáp "Because…" là bẫy.', '"Would you mind…?" muốn đồng ý thì nói "Not at all." / "No, go ahead."'],
        trap: ['Lời đáp hiểu nhầm "Why don\'t we…?" là câu hỏi lý do.', 'Lời đáp lặp từ trong câu (taxi, boxes) nhưng không đồng ý hay từ chối.'] },
      { k: 'p2-st', ic: '🗣', t: 'Part 2: Câu trần thuật', what: 'Người nói không hỏi mà nêu một việc: "The printer is out of toner again." Đề thật có khoảng 3–4 câu như vậy, thường là câu khó nhất của Part 2.',
        how: ['Nghĩ xem người nói đang báo tin, phàn nàn hay cần giúp. Lời đáp tự nhiên là đề nghị giúp, hỏi lại, hoặc cho thêm thông tin.', '"I can\'t find my badge." → "Have you checked your desk?"; "Ms. Patel will be away next week." → "Who should I contact while she\'s away?"', 'Lời đáp là một câu hỏi vẫn có thể đúng: kiểu này rất hay gặp.'],
        trap: ['Lời đáp lặp lại từ trong câu nói (third floor, office) nhưng không đáp lại ý.', 'Lời đáp cùng chủ đề nhưng không nối được ý ("This printer is easy to use.").'] },
      { k: 'p2t', ic: '🪤', t: 'Part 2: 4 kiểu bẫy', u: ['tr:rep', 'tr:type', 'tr:yn', 'tr:rel'], what: 'Mỗi câu Part 2 có 2 lời đáp sai, thường rơi vào 4 kiểu bẫy (ô 🪤 bên dưới). Nhận ra bẫy là loại được lời đáp sai rất nhanh.' },
      { k: 'p3', ic: '👥', t: 'Part 3: Hội thoại', u: 'p3', what: 'Đề thật 13 đoạn hội thoại (2 hoặc 3 người), mỗi đoạn 3 câu hỏi in sẵn, 4 phương án. Câu hỏi chi tiết (ai, khi nào, vì sao, vấn đề gì) chiếm nhiều nhất.',
        how: ['Lúc đề đọc hướng dẫn: đọc trước 3 câu hỏi, gạch từ hỏi (what problem, where, what will … do next).', 'Câu hỏi theo thứ tự lời nói: câu 1 ở đầu bài, câu 3 ở cuối (hay hỏi việc sắp làm).', 'Phương án đúng thường diễn đạt lại lời nói ("the printer keeps jamming" → A machine is not working).', 'Hội thoại 3 người: câu hỏi gọi tên ("What does Lisa say…?"); nhớ ai nói gì theo giọng.'] },
      { k: 'gist', ic: '🎯', t: 'Part 3–4: Câu hỏi chung', what: 'Câu hỏi về cả bài: nói về chuyện gì, gọi điện để làm gì, ở đâu, người nói / người nghe là ai. Thường là câu đầu tiên của mỗi bài.',
        how: ['Nghe kỹ 1–2 câu đầu: chủ đề, nơi chốn, mục đích hay được nói ngay.', 'Đáp án thường là từ khái quát: "the printer won\'t print at all" → "A machine is broken"; "Good afternoon, Riverside Hotel" → "At a hotel".', 'Nơi chốn, nghề nghiệp đoán qua từ khoá: reservation, check-in → khách sạn; return, receipt → cửa hàng; webinar, workshop → buổi học.'],
        trap: ['Phương án nhắc đúng một chi tiết trong bài nhưng không phải ý chính của cả bài.'] },
      { k: 'next', ic: '⏭', t: 'Part 3–4: Việc sắp làm, đề nghị', what: 'Câu hỏi về việc người nói sẽ làm, điều họ gợi ý hay đề nghị giúp, hoặc việc người nghe được yêu cầu làm: "What will the man do next?", "What does the woman suggest?", "What are listeners asked to do?". Thường là câu cuối của bài.',
        how: ['Nghe kỹ 1–2 câu cuối: việc sắp làm hay nằm ở đó (I\'ll…, Let me…, I\'m going to…).', 'Gợi ý, đề nghị có dấu hiệu: Why don\'t you…, You should…, I can…, Would you like me to…; yêu cầu: Please…, Make sure you…', 'Phân biệt AI làm: hỏi "What will the man do?" thì tìm câu người nam nói "I\'ll…", không lấy việc người nữ làm.'],
        trap: ['Phương án là việc NGƯỜI KIA sẽ làm.', 'Phương án là việc đã làm xong, không phải việc sắp làm.'] },
      { k: 'imp', ic: '💬', t: 'Câu hàm ý (Part 3, 4)', what: 'Câu hỏi trích một câu nói và hỏi người nói ngụ ý gì: "What does the woman imply when she says, \'…\'?" hoặc "Why does the speaker say, \'…\'?"',
        how: ['Đọc trước câu được trích; nghĩ vài nghĩa có thể có.', 'Nghe câu trước và sau câu được trích: nghĩa nằm ở ngữ cảnh, không ở nghĩa đen.', 'Phương án dịch đúng nghĩa đen của câu trích thường là bẫy.'] },
      { k: 'g', ic: '📊', t: 'Câu có bảng (Part 3, 4)', what: 'Một số bài Part 3, 4 đi kèm bảng, lịch hay sơ đồ nhỏ. Câu hỏi mở đầu bằng "Look at the graphic."',
        how: ['Nhìn bảng trước khi nghe: có những cột nào.', 'Phương án là các ô của MỘT cột; lời nói thường nhắc ô ở CỘT KHÁC cùng hàng (giờ, số chỗ, tên phòng).', 'Đừng chọn ngay ô vừa nghe đọc lên: dò sang cột của phương án.'] },
      { k: 'p4', ic: '📢', t: 'Part 4: Bài nói ngắn', u: 'p4', what: 'Đề thật 10 bài nói của một người (thông báo, tin nhắn thoại, quảng cáo, giới thiệu diễn giả), mỗi bài 3 câu hỏi.',
        how: ['Câu 1 hay hỏi mục đích hoặc người nói là ai: nghe kỹ 1–2 câu đầu.', 'Đọc câu hỏi trước để đoán loại bài (thông báo ở sân bay, tin nhắn công việc…).', 'Câu cuối hay hỏi người nghe nên làm gì tiếp (call back, visit the website).'] },
      { k: 'p4-ty', ic: '📻', t: 'Part 4: Các loại bài nói', what: 'Bài nói Part 4 lặp lại vài loại: tin nhắn thoại, thông báo nơi công cộng, quảng cáo, bản tin (giao thông, kinh doanh), giới thiệu / khai mạc / hội thảo, hướng dẫn tham quan, họp nội bộ. Nhận ra loại bài từ câu mở đầu thì đoán trước được câu hỏi.',
        how: ['Tin nhắn thoại ("Hi, this is… I\'m calling about…"): ai gọi → vì sao gọi → muốn người nghe làm gì (gọi lại, xác nhận).', 'Thông báo ("Attention, passengers / shoppers"): ở đâu → thay đổi gì (trễ, đóng cửa) → người nghe nên làm gì.', 'Quảng cáo ("Are you looking for…?"): bán gì → điểm hay → ưu đãi (giảm giá, miễn phí) → liên hệ thế nào.', 'Bản tin ("And now for the traffic report"): chủ đề → nguyên nhân → lời khuyên → tin tiếp sau quảng cáo.', 'Giới thiệu, hội thảo, tham quan ("Welcome to…"): người nghe là ai → lịch trình → lưu ý (mang gì, không được làm gì).'],
        trap: ['Nhận sai loại bài thì đoán sai người nghe ("Who most likely are the listeners?") và nơi chốn.'] }],
    R: [
      { k: 'p5-form', ic: '✏️', t: 'Part 5: Dạng từ', u: 'p5:form', what: 'Part 5 đề thật 30 câu: điền một từ hay cụm vào câu. Dạng từ: 4 phương án cùng gốc khác đuôi (-tion, -ive, -ly, -ed).',
        how: ['Không cần dịch cả câu: nhìn từ ngay trước và sau chỗ trống.', 'Trước danh từ → tính từ; sau mạo từ hay tính từ → danh từ; bổ nghĩa cho động từ, tính từ → trạng từ (-ly).', 'Sau "be", "become", "seem" → tính từ.'] },
      { k: 'p5-verb', ic: '✏️', t: 'Part 5: Động từ', u: 'p5:verb', what: '4 phương án là các dạng của một động từ: thì, chủ động / bị động, V-ing / to V.',
        how: ['Tìm chủ ngữ (số ít / số nhiều) và dấu hiệu thời gian (yesterday, since, by next week).', 'Chủ ngữ là vật chịu tác động → bị động (be + V3).', 'Sau một số động từ, giới từ dùng V-ing (consider doing, after doing); sau một số động từ khác dùng to V (plan to do).'] },
      { k: 'p5-prep', ic: '✏️', t: 'Part 5: Giới từ', u: 'p5:prep', what: 'Chọn giới từ đúng: thời gian (on Monday, in May, by Friday), nơi chốn, cụm cố định (responsible for, in charge of).',
        how: ['Học cụm theo cặp: depend on, interested in, according to, in addition to.', 'by + hạn chót; until + kéo dài tới lúc; during + danh từ; for + khoảng thời gian.'] },
      { k: 'p5-conj', ic: '✏️', t: 'Part 5: Liên từ, từ nối', u: 'p5:conj', what: 'Chọn từ nối hai vế: although, because, unless, so that…, hoặc từ nối câu: however, therefore.',
        how: ['Xem quan hệ hai vế: ngược ý → although / however; nguyên nhân → because / since; điều kiện → unless / if.', 'Sau chỗ trống là mệnh đề (có động từ) → liên từ (although, because); chỉ là danh từ → giới từ (despite, because of).'] },
      { k: 'p5-pron', ic: '✏️', t: 'Part 5: Đại từ, mệnh đề quan hệ', u: 'p5:pron', what: 'Chọn đại từ (he, him, his, himself) hoặc từ quan hệ (who, which, whose, that).',
        how: ['Chủ ngữ → he / they; tân ngữ → him / them; trước danh từ → his / their; tự làm cho mình → himself.', 'Người → who; vật → which; sở hữu → whose.'] },
      { k: 'p5-det', ic: '✏️', t: 'Part 5: Từ hạn định, lượng từ', u: 'p5:det', what: 'Chọn từ đứng trước danh từ để chỉ số lượng: each, every, all, most, some, another, other, the others, few, little, much, many, the number of.',
        how: ['Nhìn danh từ sau chỗ trống: số ít, số nhiều hay không đếm được.', 'each / every / another + số ít; all / most / many / few / other + số nhiều; much / little + không đếm được.', 'Có "of the" phía sau: most of the, all of the, each of the, some of the (không nói every of, almost of).', 'the others đứng một mình (= những cái còn lại); other cần danh từ theo sau.'],
        trap: ['almost là trạng từ: nói "almost all of", không nói "almost of".', 'the number of + danh từ số nhiều nhưng động từ chia số ít: "The number of customers has doubled."'] },
      { k: 'p5-struct', ic: '✏️', t: 'Part 5: So sánh, đảo ngữ', u: 'p5:struct', what: 'So sánh hơn và nhất (more efficient than, the most), cấu trúc đặc biệt (not only … but also, hardly had …).',
        how: ['Có "than" → so sánh hơn; có "the … of / in" → so sánh nhất.', 'Đầu câu là Not only / Rarely / Hardly / Only after → trợ động từ đứng trước chủ ngữ.'] },
      { k: 'p5-voc', ic: '✏️', t: 'Part 5: Từ vựng, cụm từ', u: 'p5:voc', what: '4 phương án cùng loại từ, khác nghĩa. Chọn từ hợp nghĩa và hợp cụm (meet a deadline, place an order).',
        how: ['Đọc cả câu, xem từ đi kèm chỗ trống.', 'Học từ theo cụm công sở, không học từng từ lẻ.'] },
      { k: 'p6', ic: '📝', t: 'Part 6: Chọn từ theo cả đoạn', u: 'p6', what: 'Đề thật 4 đoạn văn (email, thông báo), mỗi đoạn 4 chỗ trống: 3 chỗ chọn từ / cụm, 1 chỗ chọn cả câu. Nhiều chỗ chọn từ phải đọc câu trước, câu sau mới làm được: thì của động từ, từ nối giữa hai câu, đại từ chỉ ai.',
        how: ['Thì theo ngữ cảnh: câu chứa chỗ trống không có dấu hiệu thời gian thì tìm ở câu trước / sau (last Saturday → quá khứ; starting next month → tương lai).', 'Từ nối đầu câu (However, In addition, As a result, For example): xem câu trước và câu này quan hệ thế nào: đối lập, thêm ý, kết quả, ví dụ.', 'Đại từ (it, they, this): tìm danh từ được nhắc trước đó.'],
        trap: ['Chọn thì chỉ theo câu chứa chỗ trống: phương án đúng ngữ pháp trong câu nhưng sai thời gian của cả đoạn.'] },
      { k: 'p6-ins', ic: '🧩', t: 'Part 6: Chèn câu', what: 'Mỗi đoạn Part 6 có một chỗ phải chọn CẢ CÂU. Cả 4 câu đều nói về chủ đề của đoạn; chỉ một câu nối được câu trước và câu sau.',
        how: ['Đọc câu ngay trước và ngay sau chỗ trống; câu đúng phải nối được CẢ HAI.', 'Soát dấu hiệu nối: đại từ (it, this, these), từ nối (also, in addition, for example, however), thì của động từ.', 'Loại câu ngược ý đoạn văn: sai thời gian (đã xong / chưa làm), trái với câu trước hoặc câu sau, nhắc điều chưa được giới thiệu.'],
        trap: ['Câu cùng chủ đề, có từ giống trong đoạn, nhưng ngược với một chi tiết ở câu sau.', '"These / The…" nhắc tới thứ chỉ được giới thiệu ở câu SAU chỗ trống.'] },
      { k: 'p7', ic: '📰', t: 'Part 7: Mục đích, chi tiết', u: 'p7', what: 'Đọc email, quảng cáo, thông báo, bài báo…, mỗi văn bản 2–4 câu hỏi. Hay gặp nhất: hỏi mục đích văn bản và hỏi chi tiết (ai, khi nào, bao nhiêu).',
        how: ['Đọc câu hỏi trước, rồi tìm chỗ trả lời trong bài (dò tên, số, ngày).', 'Câu mục đích ("What is the purpose of…?", "Why was the e-mail sent?"): thường nằm ở 1–2 câu đầu.', 'Phương án đúng diễn đạt lại lời trong bài, ít khi chép nguyên văn.'] },
      { k: 'p7-inf', ic: '🔍', t: 'Part 7: Câu suy luận, câu NOT', what: 'Câu suy luận: "What is suggested / implied about…?", "Who most likely…?". Câu xác nhận: "What is indicated / stated about…?". Câu NOT: "What is NOT mentioned…?". Cả ba loại phải soát từng phương án với bài.',
        how: ['Câu NOT: tìm 3 phương án CÓ trong bài, phương án còn lại là đáp án.', 'Câu "indicated / stated": phương án đúng là điều bài nói rõ (được diễn đạt lại).', 'Câu suy luận: không câu nào nói thẳng; ghép 1–2 chi tiết (hoàn đủ tiền cọc khi huỷ trước hơn 7 ngày → huỷ trước 5 ngày thì không được hoàn đủ).', 'Làm các câu này sau câu chi tiết: lúc đó đã đọc phần lớn bài.'],
        trap: ['Câu suy luận: phương án đúng ngoài đời nhưng bài không cho biết.', 'Câu NOT: chọn nhầm một điều có trong bài vì không soát hết các phương án.'] },
      { k: 'p7-syn', ic: '🔤', t: 'Part 7: Từ gần nghĩa nhất', what: '"In the e-mail, the word "address" is closest in meaning to…". Từ được hỏi thường có nhiều nghĩa; phải chọn nghĩa đúng ở câu đó.',
        how: ['Tìm từ trong bài, đọc cả câu chứa nó.', 'Thay từng phương án vào câu: phương án đúng giữ nguyên ý câu.', 'Xem từ ở đây nói về việc gì: address a problem = giải quyết; address a letter = ghi địa chỉ.'],
        trap: ['Phương án là nghĩa quen nhất của từ nhưng không hợp câu này ("The change follows a survey": follow ≠ obey).'] },
      { k: 'p7-ins', ic: '🧩', t: 'Part 7: Chèn câu vào [1]–[4]', what: '"In which of the positions marked [1], [2], [3], and [4] does the following sentence best belong?" Bài có 4 vị trí đánh dấu; chọn chỗ câu cho sẵn nối được nhất.',
        how: ['Đọc câu cho sẵn trước: tìm đại từ (them, those, this), từ nối (also, however), chi tiết nối được với câu nào.', 'Thử câu ở từng vị trí: câu trước phải giới thiệu điều câu chèn nhắc tới; câu sau phải đi tiếp được.', 'Làm câu này sau cùng của bài: lúc đó đã hiểu ý từng đoạn.'],
        trap: ['Vị trí có từ giống câu chèn (study rooms – study quietly) nhưng đại từ không chỉ được về ai.'] },
      { k: 'p7c', ic: '💬', t: 'Part 7: Chuỗi tin nhắn, câu ý định', u: 'p7', what: 'Part 7 có chuỗi tin nhắn hoặc trò chuyện trực tuyến (2–4 người, có giờ gửi). Luôn có câu hỏi ý định: "At 10:15, what does Ms Lee most likely mean when she writes, \'…\'?"',
        how: ['Đọc tin trước và sau câu được trích: nghĩa nằm ở ngữ cảnh, không ở nghĩa đen.', 'Nhớ ai nói với ai: mỗi tin có tên và giờ.', 'Câu trích thường ngắn, thân mật ("Sure thing", "That works"): đoán ý định (đồng ý, từ chối, nhắc việc…).'],
        trap: ['Phương án dịch đúng nghĩa đen của câu trích nhưng sai ý trong cuộc trò chuyện.'] },
      { k: 'p7m', ic: '📑', t: 'Part 7: Nhiều văn bản', u: 'p7', what: '2–3 văn bản liên quan (email + lịch, quảng cáo + đơn hàng), 5 câu hỏi. Ít nhất một câu phải ĐỐI CHIẾU thông tin của hai văn bản.',
        how: ['Đọc tiêu đề từng văn bản: mỗi văn bản là gì, ai gửi ai.', 'Câu đối chiếu: tìm ý ở văn bản 1, rồi dò chi tiết khớp ở văn bản 2 (vd. số người trong đơn + số bàn trong quảng cáo).'] },
      { k: 'time', ic: '⏱', t: 'Quản lý giờ Đọc', u: ['spd:p5', 'spd:p7'], what: 'Phần Đọc 100 câu trong 75 phút. Sai không bị trừ điểm: đừng bỏ trống câu nào.',
        how: ['Part 5 khoảng 20 giây một câu (~10 phút), Part 6 ~8 phút, dành phần còn lại (~55 phút) cho Part 7.', 'Câu nào quá lâu thì đoán, đánh dấu, làm tiếp.'] }],
    V: [
      { k: 'voc', ic: '📚', t: 'Học từ công sở', what: 'Đề TOEIC dùng nhiều từ công sở: họp, hợp đồng, giao hàng, tuyển dụng… Thuộc khoảng 300 từ hay gặp giúp cả Nghe lẫn Đọc.',
        how: ['Học theo chủ đề, mỗi lần 10–12 từ; đọc to câu ví dụ.', 'Ôn đúng hạn (1 → 35 ngày); từ đến hạn hiện ở bước ③.', 'Nhớ cả cụm: submit a report, attend a meeting.'] }] },
  cb: {
    ic: { line: '👥', name: '✍️', picl: '🖼', colour: '🎨', picr: '🖼', yn: '✅', spell: '🔤', box: '📦', story: '📚', def: '📖', resp: '💬', mcc: '🔘', pdesc: '✍️', match5: '🔗', pmc: '🖼', nf: '📝', nghe: '🎧',
      pstory: '✍️', viet: '✍️', doc: '📰', tu: '🔤', pm: '🧭', open: '✏️', mc: '🔤', long: '📖', gap: '🧩', wf: '🧬', kwt: '🔁', xt: '🔀', mm: '🎧', sum: '📝', gpara: '🧩' },
    what: {
      line: 'Nhìn một tranh lớn có nhiều người, nghe hội thoại rồi nối mỗi tên với đúng người. Có 1 người thừa.',
      name: 'Nghe hội thoại, viết tên hoặc số vào chỗ trống. Tên được đánh vần từng chữ.',
      picl: 'Nghe một câu ngắn, chọn 1 trong 3 tranh đúng.',
      colour: 'Nhìn tranh có các vật chưa tô; nghe người nói bảo tô vật nào màu gì. Movers có thêm câu viết một từ lên vật.',
      picr: 'Nhìn tranh từng vật, đọc câu: câu đúng với tranh thì chọn Yes, sai thì No.',
      yn: 'Nhìn một tranh lớn, đọc từng câu tả tranh: đúng thì Yes, sai thì No.',
      spell: 'Nhìn tranh; các chữ cái của từ bị xáo trộn. Xếp lại thành từ đúng.',
      box: 'Đọc đoạn văn có chỗ trống, chọn từ trong khung để điền; có từ thừa. Movers còn chọn tên hay nhất cho truyện.',
      story: 'Đọc truyện theo tranh, trả lời câu hỏi: Starters viết 1 từ, Movers điền 1–3 từ lấy trong truyện.',
      def: 'Đọc định nghĩa (vd. "You can wear this on your head"), chép đúng từ trong khung. Có từ thừa.',
      resp: 'Đọc câu một người nói, chọn câu đáp hợp nhất của người kia.',
      mcc: 'Đọc một đoạn văn; mỗi chỗ trống chọn 1 trong 3 từ hợp ngữ pháp và hợp nghĩa.',
      pdesc: 'Nhìn tranh, hoàn thành câu và trả lời câu hỏi về tranh bằng câu ngắn.',
      match5: 'Nghe cả bài, nối 5 người (hoặc 5 ngày) với 8 lựa chọn; mỗi lựa chọn dùng một lần, có 3 cái thừa.',
      pmc: 'Mỗi câu có một câu hỏi và 3 tranh. Nghe đoạn hội thoại ngắn rồi chọn tranh đúng.',
      nf: 'Nghe một người nói hoặc hội thoại, điền từ, số vào phiếu hay câu ghi chú. Viết đúng chính tả.',
      nghe: 'Nghe các đoạn hội thoại, thông báo, phỏng vấn ngắn; mỗi đoạn trả lời câu hỏi trắc nghiệm. Đề thật nghe mỗi đoạn 2 lần.',
      pstory: 'Nhìn 3 tranh kể một câu chuyện, viết truyện từ 35 từ trở lên, đủ cả 3 tranh.',
      viet: 'Viết bài theo đề: email, thư, bài báo, truyện, bài luận, báo cáo… tuỳ cấp. Chấm theo nội dung (đủ ý đề hỏi), cách tổ chức bài và ngôn ngữ.',
      doc: 'Đọc tin nhắn, thông báo, bài báo; chọn đáp án đúng cho câu hỏi về ý chính và chi tiết.',
      tu: 'Chọn từ hoặc cụm từ đúng cho mỗi câu: kiểm tra nghĩa từ, từ hay đi kèm, cụm động từ.',
      pm: 'Đọc vài văn bản hoặc đoạn (A, B, C…), nối mỗi câu hỏi hay mỗi người với đúng văn bản.',
      open: 'Đoạn văn có chỗ trống, mỗi chỗ điền MỘT từ (không có phương án). Thường là từ ngữ pháp: giới từ, mạo từ, đại từ, trợ động từ, từ nối.',
      mc: 'Đoạn văn có chỗ trống, mỗi chỗ chọn 1 trong 3 từ (A2 Key) hoặc 4 từ (B1 trở lên). Kiểm tra từ vựng: nghĩa gần nhau, cụm từ cố định, giới từ đi kèm.',
      gpara: 'Một bài dài bị rút ra một số ĐOẠN (C1 Advanced 6 đoạn, C2 Proficiency 7 đoạn) và có thêm 1 đoạn thừa. Chọn đoạn đúng cho mỗi chỗ trống. Bộ của app rút 4 đoạn để luyện.',
      long: 'Một bài dài (bài báo, trích truyện…), câu hỏi trắc nghiệm 4 phương án về ý chính, chi tiết, thái độ người viết, nghĩa của từ trong bài.',
      gap: 'Một bài bị rút ra một số câu; chọn câu đúng cho mỗi chỗ trống, có câu thừa. Kiểm tra mạch văn.',
      wf: 'Đoạn văn có chỗ trống, cuối dòng có từ gốc in hoa. Đổi từ gốc thành dạng đúng (danh từ, tính từ, trạng từ, phủ định…) để điền.',
      kwt: 'Viết lại câu cho cùng nghĩa với câu đầu, dùng từ khoá cho sẵn (không đổi từ khoá). B2 viết 2–5 từ, C1 3–6 từ, C2 3–8 từ.',
      xt: 'Bốn người viết về cùng một chủ đề. Câu hỏi hỏi ai có ý giống hay khác ai về một khía cạnh.',
      mm: 'Năm người nói ngắn về cùng một chủ đề; chọn cho mỗi người một ý trong 8 ý (A–H), 3 ý thừa. C1, C2 có 2 nhiệm vụ cùng một lần nghe.',
      sum: 'Đọc 2 đoạn văn cùng chủ đề, viết bài 240–280 từ tóm tắt và đánh giá ý của cả hai, thêm ý của mình.' },
    how: {
      mc: ['Đọc cả câu, nhìn từ đứng ngay sau chỗ trống: nhiều câu hỏi cụm cố định (take part in, depend on).', 'Các phương án thường gần nghĩa nhau: chọn từ hợp cụm, hợp sắc thái.', 'Đọc lại cả đoạn với từ đã chọn.'],
      gpara: ['Đọc lướt cả bài trước để nắm mạch (thứ tự thời gian, lập luận).', 'Nhìn câu cuối đoạn trước và câu đầu đoạn sau chỗ trống: đại từ (this, that moment), từ nối (however, then), tên riêng phải khớp với đoạn chọn.', 'Làm chỗ chắc trước; đoạn thừa thường cùng chủ đề nhưng không nối được vào đâu.'],
      open: ['Đoán loại từ thiếu: giới từ, mạo từ, đại từ quan hệ, trợ động từ, từ nối.', 'Nhìn cả câu và câu sau: chỗ trống có thể là một phần của cụm (as well as, in spite of).', 'Chỉ một từ; không viết từ rút gọn.'],
      wf: ['Xác định loại từ cần: sau mạo từ, tính từ → danh từ; trước danh từ → tính từ; bổ nghĩa động từ → trạng từ.', 'Xem nghĩa câu có cần phủ định không (un-, in-, dis-, -less).', 'Xem có cần số nhiều không (many, several + danh từ -s).'],
      kwt: ['Tìm cấu trúc mà từ khoá kéo theo (unless, used to, regret, such…).', 'Giữ đúng nghĩa và thì của câu đầu; không đổi từ khoá.', 'Đếm số từ: từ rút gọn tính là 2 từ (trừ can\'t).'],
      long: ['Đọc câu hỏi, tìm đoạn tương ứng (câu hỏi theo thứ tự bài).', 'Câu hỏi thái độ, ý người viết: chú ý từ đánh giá (surprisingly, unfortunately, admittedly).', 'Câu hỏi nghĩa của từ, cụm: đọc câu trước và sau để đoán.'],
      pm: ['Đọc câu hỏi trước, gạch ý chính; rồi đọc từng văn bản, đánh dấu ý của văn bản đó.', 'Ý được diễn đạt lại; đừng chọn vì một từ trùng.'],
      xt: ['Đọc cả 4 văn bản, ghi ngắn ý của từng người về mỗi khía cạnh (đồng ý / phản đối).', 'Câu hỏi "ai có ý khác ba người kia": so ý từng người, đừng chọn vì giọng văn.'],
      sum: ['Đọc cả hai đoạn, gạch ý chính của mỗi đoạn (thường 2 ý mỗi đoạn).', 'Viết bằng lời của mình (diễn đạt lại), không chép câu.', 'Bố cục: mở bài nêu chủ đề → tóm và đánh giá ý đoạn 1 → ý đoạn 2 → ý của bạn.'] },
    trap: {
      mc: ['Bốn từ gần nghĩa nhưng chỉ một từ đi được với từ bên cạnh (make / do / take / have + danh từ).'],
      wf: ['Quên phủ định hoặc quên số nhiều: đúng loại từ vẫn mất điểm.'],
      kwt: ['Đổi dạng từ khoá (viết "suggested" khi từ khoá là SUGGESTION) là mất điểm.'],
      open: ['Điền từ đúng nghĩa nhưng thừa từ (2 từ trong một chỗ).'],
      gap: ['Câu thừa thường cùng chủ đề nhưng không nối được câu trước và câu sau.'],
      gpara: ['Đoạn có từ khoá trùng với đoạn bên cạnh nhưng "this / that" lại chỉ về điều chưa được nói tới trước đó.'],
      long: ['Phương án lặp đúng từ trong bài nhưng nói ý khác.'],
      nghe: ['Phương án có từ nghe được trong bài nhưng không trả lời đúng câu hỏi.'],
      pmc: ['Cả 3 tranh thường đều được nhắc tới; tranh đúng là cái được chốt cuối cùng.'],
      match5: ['Bài nghe nhắc cả lựa chọn sai ("I wanted to… but…").'] },
    // 🗣 Nói của đề thử: bài học theo từng phần (mkSpeak); sp = cấp có phần đó; m: câu trả lời mẫu theo kỳ thi (SPK_EX)
    spk: {
      // v132 Movers (A1) như đề thật: tìm điểm khác · kể chuyện theo tranh · chọn tranh khác loại · câu hỏi về bạn
      diff: { ic: '🔍', t: 'Phần 1: tìm điểm khác nhau', what: 'Movers: giám khảo cho xem hai tranh gần giống nhau, nói một điều ở tranh A rồi hỏi tranh B khác thế nào. Trả lời bằng câu ngắn.',
        how: ['Nhìn kỹ cả hai tranh: số lượng, vị trí (on, under, next to), con vật, đồ vật, thời tiết.', 'Trả lời theo mẫu câu của giám khảo: "In picture B, the cat is under the chair."', 'Nói rõ số và từ chỉ vị trí: two / three, on / under.'] },
      story: { ic: '📚', t: 'Phần 2: kể chuyện theo tranh', what: 'Movers: 4 tranh kể một câu chuyện. Giám khảo kể tranh 1, bạn kể tiếp tranh 2–4, mỗi tranh 1–2 câu.',
        how: ['Nhìn hết 4 tranh trước để hiểu câu chuyện.', 'Mỗi tranh nói ai, làm gì, cảm thấy thế nào: "The kite is in the tree. Sally is sad."', 'Dùng thì như giám khảo (hiện tại đơn / tiếp diễn); nối tranh bằng then, now.'] },
      odd: { ic: '🧺', t: 'Phần 3: chọn tranh khác loại', what: 'Movers: mỗi lần 4 tranh nhỏ, 3 tranh cùng loại. Nói tranh nào khác và vì sao.',
        how: ['Tìm điểm chung của 3 tranh: con vật, đồ ăn, quần áo, xe cộ, màu…', 'Trả lời: "The car, because the others are fruit."', 'Nhớ nói "because…": phần lý do cũng được tính.'] },
      noi1: { ic: '🗣', t: 'Phần 1: phỏng vấn', what: 'Giám khảo hỏi về bạn: tên, nơi sống, việc học, sở thích. Starters, Movers trả lời ngắn; từ A2 trả lời 2–3 câu.',
        how: ['Trả lời đủ ý câu hỏi, đúng thì của câu hỏi.', 'Từ A2: thêm lý do hoặc chi tiết (because…, for example…).', 'Không nghe rõ: "Sorry, can you say that again?" không bị trừ điểm.'] },
      eit: { ic: '🔁', t: 'Nhắc lại câu (cách app đo)', what: 'Phần này KHÔNG có trong đề thật. App dùng nó để đo ngữ pháp khi nói: nghe một câu, nói lại đúng như vậy, không nhìn chữ. Câu dài dần; chỉ nhắc lại đúng được câu dài khi nắm được ngữ pháp của nó.',
        how: ['Nghe ý của cả câu, đừng cố nhớ từng từ rời.', 'Nói lại liền một hơi, đủ các từ nhỏ (a, the, -s, -ed).'] },
      pic: { ic: '🖼', t: 'Phần 2: hỏi đáp về tranh', what: "Starters: giám khảo chỉ vào tranh và hỏi (What's this? How many…? What's the boy doing?). Trả lời bằng một từ hoặc một câu ngắn.",
        how: ['Nhìn tranh trước: gọi tên các vật, đếm số lượng, xem màu.', "Trả lời ngắn là được: \"Two.\" / \"It's red.\" / \"He's running.\""] },
      photo: { ic: '📷', t: 'Phần 2: nói về ảnh', what: 'B1: tả một bức ảnh khoảng 1 phút. B2: so sánh hai ảnh và trả lời câu hỏi in trên đề. C1: chọn 2 trong 3 ảnh để so sánh.',
        how: ['Mở đầu bằng ý chung (Both photos show…), rồi tả chi tiết: người, việc, nơi chốn.', 'B2, C1: so sánh (whereas, while, both) và trả lời ĐÚNG câu hỏi của đề, đừng chỉ tả.', 'Không chắc thì đoán: It looks like…, They might be…'] },
      talk: { ic: '🗣', t: 'Phần 2: nói dài', what: 'Nói liền khoảng 1–2 phút về một đề cho sẵn (kể việc đã làm, tả người hay nơi chốn, nêu ý kiến).',
        how: ['Chia ý: mở đầu → 2–3 ý có ví dụ → kết.', 'Dùng từ nối: first, then, because, so, however.', 'Nói đủ thời gian; hết ý thì thêm ví dụ hoặc cảm xúc.'] },
      rp: { ic: '👥', t: 'Phần 3: đóng vai, tương tác', what: 'Nói với bạn thi (hoặc giám khảo) để cùng làm một việc: gọi món, lên kế hoạch, chọn một phương án. Điểm tương tác tính khi bạn biết hỏi lại, đáp lời và cùng chốt.',
        how: ['Hỏi ý bạn: "What do you think?", "Shall we…?"', 'Đáp lời bạn trước khi nói ý mình: "That\'s a good idea, but…"', 'Cuối phần: cùng chốt lựa chọn ("So, we agree that…").'] },
      noi4: { ic: '💬', t: 'Phần 4: thảo luận', what: 'Giám khảo hỏi ý kiến về chủ đề rộng hơn của phần trước. Trả lời có lý do, ví dụ; từ B2 nên nhìn cả mặt kia.',
        how: ['Ý kiến → lý do → ví dụ.', 'Dùng câu nêu ý kiến: I think…, In my opinion…, It depends on…', 'Từ B2: nhìn mặt kia ("On the other hand…") rồi chốt.'] } },
    m1: {
      pre: ["What's your favourite animal?", 'My favourite animal is a monkey.'],
      a1: ['What do you do at the weekend?', 'At the weekend I play football with my friends in the park. On Sunday I visit my grandma.'],
      a2: ['What did you do last weekend?', 'Last weekend I went to the cinema with my cousin. We saw a funny film, and after that we had pizza. It was a really nice day.'],
      b1: ['What do you usually do to relax?', "I usually listen to music or go for a walk in the evening. Walking helps me forget about work, and it's good exercise too. At weekends I sometimes go fishing with my dad."],
      b2: ['If you had more free time, what would you do with it?', "I'd probably take up a sport again. I used to play badminton at school, but I stopped because of work. If I had a couple of free evenings a week, I'd join a club, partly to keep fit and partly to meet new people."],
      c1: ['What would you say is the most valuable thing you have learned from your job or studies?', "I'd say it's learning how to ask for help. At university I tried to solve everything on my own, which wasted a lot of time. In my first job, a manager pointed out that asking early is actually more efficient, and that has changed the way I work."],
      c2: ['What aspects of your culture do you think are most often misunderstood by outsiders?', "I think visitors often misread our indirectness. People here tend to avoid saying 'no' outright, which outsiders can interpret as vagueness or even dishonesty. In reality, it's a way of keeping harmony, and once you learn to read the cues, it's remarkably precise."] },
    m4: {
      a1: ['Do you like living in a city or in the countryside? Why?', 'I like the city because there are lots of shops and my school is near. But the countryside is quiet and beautiful.'],
      a2: ['Which is better: shopping online or in a shop? Why?', 'I think shopping in a shop is better for clothes, because you can try them on. But online shopping is cheaper and faster for things like books.'],
      b1: ['Do you think people spend too much time on their phones?', "Yes, I think so. Many people check their phones all the time, even during meals, so they don't really talk to each other. However, phones are also useful for work and learning, so the problem is how we use them, not the phones themselves."],
      b2: ['Should governments make public transport free?', 'I can see why people suggest it, because it would reduce traffic and pollution. On the other hand, someone has to pay, so taxes would probably go up. In my view, cheaper tickets for students and older people would be a fairer compromise.'],
      c1: ['Why do you think some traditions disappear while others survive?', "I suspect traditions survive when they still meet a need. Family gatherings at New Year, for instance, give people a reason to reconnect, so they adapt rather than disappear. Customs tied to a way of life that no longer exists tend to fade once nobody depends on them."],
      c2: ['Is it ever right to break a rule? Give examples.', "I'd argue that it can be, provided the rule causes clear harm and there's no legitimate way to change it quickly. Civil rights campaigners deliberately broke segregation laws, and history has largely vindicated them. That said, the justification has to be strong, otherwise anyone could excuse breaking rules they simply find inconvenient."] },
    // bài mẫu cho truyện theo tranh A2 (kho chưa có bài mẫu)
    ps: {
      'a2-ps-dog': "Last Saturday, Mai took her dog, Max, to the park. While she was talking to a friend, Max saw a cat and ran after it. Mai looked everywhere, but she couldn't find him, and she felt very sad. In the end, an old man found Max and brought him back. Mai was so happy!",
      'a2-ps-cake': "It was Mum's birthday, so Tom made a big chocolate cake. He put it on the table and went to get some candles. When he came back, the cat was on the table and the cake was on the floor! Tom was upset, but Mum laughed. In the end, the whole family went out for pizza." } },
  // ✍️ làm thử của bài Nói IELTS: chọn câu trả lời tốt
  mcq: {
    p1: [
      { q: 'Câu hỏi: "Do you work or are you a student?" Câu trả lời nào tốt nhất?', a: "I'm a student. I'm in my second year at a university in Hanoi, studying business, and I really enjoy it.", w: ['Student.', 'I am a student. I am a student of business. I am a student in Hanoi.'], why: 'Trả lời + thêm chi tiết, 2–3 câu. Một từ là quá ngắn; lặp một kiểu câu làm điểm từ vựng và ngữ pháp thấp.' },
      { q: 'Câu hỏi: "What did you do last weekend?" Câu trả lời nào tốt nhất?', a: "I went to my grandparents' house in the countryside. We cooked lunch together, and in the afternoon I went for a walk around the village.", w: ["I go to my grandparents' house and we cook lunch together.", 'Weekend is good. I like weekends very much.'], why: 'Câu hỏi dùng quá khứ (did) nên trả lời bằng quá khứ (went, cooked), và trả lời đúng điều được hỏi.' },
      { q: 'Câu hỏi: "Do you like reading?" Câu trả lời nào tốt nhất?', a: 'Yes, quite a lot, especially novels. I usually read for half an hour before bed because it helps me relax.', w: ['Yes.', 'Reading is an activity in which people look at written words to understand them, and there are many kinds of reading in the world.'], why: 'Câu hỏi về bản thân cần câu trả lời của chính bạn, có lý do; không định nghĩa, không nói chung chung như học thuộc.' }],
    p2: [
      { q: 'Thẻ đề: "Describe a place you like to visit." Câu mở đầu nào tốt nhất?', a: "I'd like to talk about a small café near my office, which I visit two or three times a week.", w: ['OK. A place. A café.', "I don't know what to say about this topic."], why: 'Câu đầu giới thiệu ngay chủ đề và trả lời luôn một ý gợi ý; đừng phí thời gian.' },
      { q: 'Có 1 phút chuẩn bị. Nên ghi gì?', a: 'Vài từ khoá cho mỗi ý gợi ý: "café gần cơ quan · 2–3 lần / tuần · đọc sách, gặp bạn · yên tĩnh".', w: ['Viết cả bài thật đầy đủ để đọc lại.', 'Không ghi gì, chỉ nghĩ trong đầu.'], why: 'Từ khoá giúp nói đủ 4 ý mà vẫn tự nhiên. Viết câu dài thì không kịp, đọc lại nghe như học thuộc.' },
      { q: 'Mới nói được 1 phút thì hết ý. Nên làm gì?', a: 'Kể thêm một kỷ niệm cụ thể ở đó, hoặc so sánh với trước đây ("When I first went there…").', w: ['Dừng lại và nói "That\'s all."', 'Nhắc lại y nguyên các câu vừa nói.'], why: 'Part 2 cần nói đủ khoảng 2 phút. Thêm kỷ niệm, ví dụ, so sánh là cách kéo dài tự nhiên.' }],
    p3: [
      { q: 'Câu hỏi: "Why do some people prefer to live in big cities?" Câu trả lời nào tốt nhất?', a: 'I think the main reason is opportunity. Big cities usually have better jobs and universities, so young people in particular move there to build a career. On the other hand, some families leave when they have children, because cities are expensive and crowded.', w: ['Because I like big cities.', 'Big cities are big and have many people.'], why: 'Câu hỏi bàn luận: ý kiến → giải thích → ví dụ → mặt kia; nói về người nói chung, không chỉ bản thân.' },
      { q: 'Câu hỏi: "Do you think people read less than in the past?" Câu trả lời nào tốt nhất?', a: 'In some ways, yes. People spend more time on their phones, so they probably read fewer books. But they read a lot online, like news and messages, so it depends on what we mean by reading.', w: ['Yes.', "I don't read books, so I don't know."], why: 'Trả lời có mức độ (in some ways, it depends) và có lý do; không dừng ở yes / no.' },
      { q: 'Câu hỏi: "How will transport change in the future?" Câu trả lời nào tốt nhất?', a: "I'd expect more electric cars and better public transport in big cities, because governments are trying to cut pollution. People might also work from home more, so there could be less traffic overall.", w: ['Transport changed a lot in the past.', "I don't know about the future."], why: 'Câu hỏi về tương lai: dùng will / might / could và nêu lý do; không biết chắc vẫn đoán, có lý do.' }] },
  // Task 2: 5 kiểu đề [tên, cách trả lời]
  t2: { opinion: ['Đồng ý hay không', 'Đề hỏi "To what extent do you agree or disagree?": nêu rõ mức đồng ý ngay ở mở bài, giữ một quan điểm suốt bài.'],
    discuss: ['Bàn hai quan điểm', 'Đề "Discuss both views and give your own opinion": viết cả hai quan điểm, mỗi bên một đoạn, rồi nêu ý mình.'],
    advdis: ['Lợi và hại', 'Đề hỏi lợi và hại (advantages, disadvantages): viết cả hai; đề hỏi "Do the advantages outweigh the disadvantages?" thì phải nói rõ bên nào nặng hơn.'],
    probsol: ['Vấn đề và giải pháp', 'Đề hỏi nguyên nhân hay vấn đề và giải pháp: một đoạn cho vấn đề, một đoạn cho giải pháp khớp với vấn đề đó.'],
    twopart: ['Hai câu hỏi', 'Đề có hai câu hỏi riêng: trả lời đủ CẢ HAI, mỗi câu một đoạn thân bài.'] } };
// ---------- dữ liệu người học ----------
const xlSt = () => (S.exl = S.exl || {});
let XL_CUR = null;
const XL_QC = {};   // ví dụ của bài học Cambridge (câu bốc ngẫu nhiên): giữ trong phiên để bài học không đổi khi mở lại
const XL_EXN = { ielts: '🌏 IELTS', toeic: '💼 TOEIC', cambridge: '🎓 Cambridge' };
const xlShort = t => t.length > 28 ? t.slice(0, 27) + '…' : t;
const xlLast = a => a[a.length - 1];
const xlPrefer = (its, R) => { const d = its.filter(x => R && R[x.id]); return shuf(d.length ? d : its); };   // câu làm thử: bài đã làm trước (không làm mất "bài mới")
const xlParas2 = m => (Array.isArray(m) ? m : String(m || '').split(/\n\s*\n/)).map(s => String(s).trim()).filter(Boolean);
const xlBox = (b, h) => `<div class="box"><p style="margin:0">${b}</p>${h ? `<p class="mute" style="margin:6px 0 0">${h}</p>` : ''}</div>`;
const xlTag = t => `<span style="display:inline-block;font-size:13px;font-weight:700;color:var(--accent)">${esc(t)}</span>`;

// ---------- danh sách bài học của một màn kỹ năng ----------
// sk: IELTS 'L' | 'R' | 'W' | 'S' · TOEIC 'L' | 'R' | 'V' · Cambridge 'cấp~bài thi' (vd. 'b1~0')
function xlList(ex, sk) { try { return ex === 'ielts' ? xlIe(sk) : ex === 'toeic' ? xlTo(sk) : ex === 'cambridge' ? xlCb(sk) : []; } catch (e) { return []; } }
function xlIe(sk) { if (typeof IE === 'undefined' || !IE) return []; const gt = ieSt().type === 'gt', R = ieSt().r;
  return (XL_TXT.ie[sk] || []).filter(d => !d.only || d.only === (gt ? 'gt' : 'ac')).map(d => { const o = { ...d, id: 'ie:' + sk + ':' + d.k, ex: 'ielts', sk, how: [...(d.hw && IE_HOW[d.hw] ? IE_HOW[d.hw][1] : []), ...(d.how || [])] };
    if (sk === 'R') { o.u = d.u || (d.k === 'time' ? null : 'R-' + d.k); o.go = d.k === 'para' ? 'data-iepara' : d.k === 'time' ? 'data-ier="all"' : d.k === 'gt' ? `data-iebai="R|${((IE.doc.filter(x => x.gt).find(x => !R[x.id])) || IE.doc.find(x => x.gt) || {}).id}"` : `data-ier="${d.k}"`;
      if (d.k === 'para') o.qs = xlIePara; else if (d.k === 'gt') o.qs = xlIeGT; else if (d.k !== 'time') o.qs = () => xlIeR(d.k); }
    if (sk === 'L') { o.qs = () => xlIeL(d.ks); const it = (IE.ln || []).filter(x => x.qs.some(q => d.ks.includes(q.k))); o.go = d.k === 'form' ? 'data-iel="form"' : d.k === 'mc' ? 'data-iel="mc"' : it.length ? `data-iebai="L|${(it.find(x => !R[x.id]) || it[0]).id}"` : ''; }
    if (sk === 'W') { o.w = () => xlIeW(d); o.go = `data-iew="${d.k === 'w1-gt' ? 'gt1' : /^w1/.test(d.k) ? 't1' : 't2'}"`; }
    if (sk === 'S') { o.w = () => xlIeS(d); o.go = `data-ies="${d.k}"`; }
    return o; }); }
// 📰 Đọc: ví dụ = câu đầu của dạng đó trong bài cuối danh sách có dạng đó; làm thử = 3 câu cùng dạng của một bài khác (ưu tiên bài đã làm)
function xlIeR(k) { const its = IE.doc.filter(x => !x.gt && ieHasK(x, k)); if (!its.length) return [];   // v132: dạng câu lấy ví dụ ở bài học thuật; bộ GT có bài học riêng
  const ex = xlLast(its), rest = its.filter(x => x !== ex), tx = rest.length ? xlPrefer(rest, ieSt().r)[0] : ex, qe = ieRQs(ex, [k]);
  return [qe[0], ...(tx === ex ? qe.slice(1) : ieRQs(tx, [k])).slice(0, XL_TRY)]; }
// v132 văn bản GT: ví dụ = câu đầu của bộ GT cuối danh sách; làm thử = 3 câu của bộ GT còn lại
function xlIeGT() { const its = IE.doc.filter(x => x.gt); if (!its.length) return []; const ex = xlLast(its), tx = its.length > 1 ? xlPrefer(its.slice(0, -1), ieSt().r)[0] : ex, qe = ieRQs(ex);
  return [qe[0], ...(tx === ex ? qe.slice(1) : shuf(ieRQs(tx))).slice(0, XL_TRY)]; }
function xlIePara() { const P = IE.para || []; if (!P.length) return []; return [iePQ(xlLast(P)), ...iePick(P.slice(0, -1), XL_TRY).map(iePQ)]; }
// 🎧 Nghe: câu của các dạng ks; nghe đoạn quanh câu chứa đáp án (bài IELTS dài 3–5 phút, bài học chỉ cần đoạn đó)
function xlIeL(ks) { const its = (IE.ln || []).filter(x => x.qs.some(q => ks.includes(q.k))); if (!its.length) return [];
  const qk = x => ieLnQs(x).filter(q => ks.includes(String(q.k).replace(/^ln-/, ''))), ex = xlLast(its), rest = its.filter(x => x !== ex), tx = rest.length ? xlPrefer(rest, ieSt().r)[0] : ex, qe = qk(ex);
  return [qe[0], ...(tx === ex ? qe.slice(1) : qk(tx)).slice(0, XL_TRY)].map(xlSeg); }
// ✍️ Viết: ví dụ = đề + bài mẫu chia đoạn có nhãn; làm thử = câu hỏi về bố cục bài mẫu của một đề khác
const XL_T1R = ['Mở bài: viết lại đề', 'Tổng quan: nét chính, không số liệu', 'Chi tiết: số liệu và so sánh', 'Kết luận: ý kiến riêng'];
const XL_OPEN = { formal: 'Dear Sir or Madam,', semi: 'Dear Mr Brown,', informal: 'Dear Tom,' }, XL_CLOSE = { formal: 'Yours faithfully,', semi: 'Yours sincerely,', informal: 'Best wishes,' };
function xlIeW(d) { const task = d.k === 'w1-gt' ? 'gt1' : /^w1/.test(d.k) ? 't1' : 't2', pool = task === 'gt1' ? IE.gt1 : task === 't2' ? IE.t2 : IE.t1.filter(x => d.kinds.includes(x.kind)); if (!pool.length) return null;
  const x = xlLast(pool), rest = pool.length > 1 ? pool.slice(0, -1) : task === 't1' ? IE.t1.filter(z => z !== x && !['map', 'process', 'mixed'].includes(z.kind)) : pool, y = shuf(rest)[0] || x, P = xlParas2(x.m), n = P.length;   // v132: chỉ một đề thì làm thử bằng đề biểu đồ khác
  const role = i => task === 't1' ? XL_T1R[Math.min(i, 2)] : task === 't2' ? (i === 0 ? 'Mở bài: viết lại đề + quan điểm' : i === n - 1 ? 'Kết luận: nhắc lại quan điểm' : `Thân bài ${i}: ý chính + giải thích + ví dụ`)
    : (i === 0 ? 'Lời mở thư (đúng giọng)' : i === n - 1 ? 'Lời chào cuối thư' : i === n - 2 ? 'Câu kết' : i === 1 ? 'Lý do viết thư' : 'Ý trong đề');
  const T = XL_TXT.t2[x.type], card = d.k === 'w2-type' && T ? `<div class="box"><b>🧭 Kiểu đề: ${esc(T[0])}</b><p style="margin:6px 0 0">${esc(T[1])}</p></div>` : '';
  const html = `${ieWHead(task, x)}${card}<details class="box" open><summary><b>📄 Bài mẫu (${kWords(x.m).length} từ), chia theo đoạn</b></summary>${P.map((p, i) => `<p style="margin:10px 0 0">${xlTag(role(i))}<br>${esc(p).replace(/\n/g, '<br>')}</p>`).join('')}</details>`;
  const tq = task === 't1' ? xlT1Q(y) : task === 'gt1' ? xlGtQ(y) : d.k === 'w2-type' ? xlT2TypeQ(x) : xlStructQ(y.m, xlBox(esc(y.p), esc(y.pv)));
  return { html, tq }; }
function xlT1Q(y) { const P = xlParas2(y.m), f = s => kSents(s)[0] || s, head = ieWHead('t1', y), noun = y.kind === 'map' ? 'maps' : y.kind === 'process' ? 'diagram' : 'chart';
  return [{ x: y, kind: 'mc', head, q: 'Câu mở bài nào tốt nhất?', opts: shuf([f(P[0]), f(y.p), `In my opinion, the ${noun} is very interesting and shows a lot of useful information.`]), a: f(P[0]), why: 'Mở bài viết lại đề bằng lời của mình. Câu chép nguyên đề không được tính vào số từ; Task 1 không nêu ý kiến riêng.' },
    { x: y, kind: 'mc', head, q: 'Câu nào là câu TỔNG QUAN (overview)?', opts: shuf([...new Set([f(P[1]), f(P[2]), f(P[3] || P[0])])]), a: f(P[1]), why: 'Tổng quan nêu 2 nét chính, không có số liệu, thường mở đầu bằng "Overall". Thiếu đoạn này thì khó qua band 5 ở tiêu chí Task Achievement.' },
    { x: y, kind: 'mc', head: xlBox(esc(P[2] || '')), q: 'Đoạn trên là phần nào của bài Task 1?', opts: XL_T1R.slice(), a: XL_T1R[2], why: 'Đoạn chi tiết có số liệu cụ thể và so sánh. Task 1 không có đoạn nêu ý kiến riêng.' }]; }
function xlGtQ(y) { const head = xlBox(esc(y.p), esc(y.pv));
  return [{ x: y, kind: 'mc', head, q: 'Mở thư thế nào cho đúng giọng?', opts: shuf(Object.values(XL_OPEN)), a: XL_OPEN[y.reg], why: 'Kiểu thư: ' + IE_REG[y.reg] + '.' },
    { x: y, kind: 'mc', head, q: 'Kết thư thế nào?', opts: shuf(Object.values(XL_CLOSE)), a: XL_CLOSE[y.reg], why: 'Dear Sir or Madam → Yours faithfully; Dear + họ (Mr Brown) → Yours sincerely; bạn bè → Best wishes / Love.' },
    { x: y, kind: 'mc', head, q: 'Câu đầu tiên sau lời chào nên làm gì?', opts: shuf(['Nói ngay lý do viết thư', 'Kể chuyện thời tiết, hỏi thăm thật dài', 'Giới thiệu tên, tuổi, quê quán']), a: 'Nói ngay lý do viết thư', why: 'Thư IELTS đi thẳng vào việc: câu đầu nói lý do viết (I am writing to…). Thư bạn bè có thể hỏi thăm một câu ngắn rồi vào việc.' }]; }
function xlT2TypeQ(x) { const T = XL_TXT.t2, names = Object.values(T).map(t => t[0]), pick = [];
  for (const y of shuf(IE.t2.filter(z => z !== x))) if (pick.length < XL_TRY && T[y.type] && !pick.some(z => z.type === y.type)) pick.push(y);
  return pick.map(y => ({ x: y, kind: 'mc', head: xlBox(esc(y.p), esc(y.pv)), q: 'Đề này thuộc kiểu nào?', opts: names, a: T[y.type][0], why: T[y.type][1] })); }
// bố cục một bài mẫu: ≥ 3 đoạn nội dung → đoạn mở, đoạn kết, câu chủ đề; ít đoạn hơn → câu nào đứng ngay sau (mạch ý)
function xlStructQ(m, head) { const P = xlParas2(m), C = P.filter(p => kWords(p).length >= 8), f = p => kSents(p)[0] || p, out = [];
  if (C.length >= 3) { const mid = C[Math.floor(C.length / 2)];
    out.push({ kind: 'mc', head, q: 'Đoạn nào MỞ ĐẦU bài? (câu đầu của đoạn)', opts: shuf([...new Set([f(C[0]), f(C[1]), f(xlLast(C))])]), a: f(C[0]), why: 'Đoạn mở đầu giới thiệu chủ đề hoặc lý do viết, trả lời thẳng vào đề.' });
    out.push({ kind: 'mc', head, q: 'Đoạn nào KẾT bài? (câu đầu của đoạn)', opts: shuf([...new Set([f(C[0]), f(mid), f(xlLast(C))])]), a: f(xlLast(C)), why: 'Đoạn kết tóm lại ý chính hoặc nói lời mong đợi; không thêm ý mới.' });
    const ss = kSents(C[1]); if (ss.length >= 3) out.push({ kind: 'mc', head: xlBox(esc(C[1])), q: 'Câu nào nêu Ý CHÍNH của đoạn này?', opts: shuf([ss[0], ...shuf(ss.slice(1)).slice(0, 2)]), a: ss[0], why: 'Câu đầu đoạn (câu chủ đề) nêu ý chính; các câu sau giải thích và cho ví dụ.' });
    return out; }
  const ss = kSents(P.join(' ')), step = Math.max(1, Math.floor((ss.length - 1) / XL_TRY));
  for (let i = 0; i + 1 < ss.length && out.length < XL_TRY; i += step) { const o = shuf(ss.filter((s, j) => j !== i && j !== i + 1)).slice(0, 2); if (o.length < 2) break;
    out.push({ kind: 'mc', head: `${head || ''}<div class="box"><p class="mute" style="margin:0">Câu ${i + 1} của bài mẫu</p><p style="margin:4px 0 0">${esc(ss[i])}</p></div>`, q: 'Câu nào đứng NGAY SAU câu này?', opts: shuf([ss[i + 1], ...o]), a: ss[i + 1], why: 'Câu sau nối ý câu trước: theo thứ tự việc, có từ nối hoặc đại từ chỉ về ý trước.' }); }
  return out; }
const xlMcq = L => (L || []).map(m => ({ kind: 'mc', q: esc(m.q), opts: shuf([m.a, ...m.w]), a: m.a, why: m.why }));
function xlIeS(d) { let html = '';
  if (d.k === 'p2') { const c = (IE.p2 || []).find(x => x.m); if (c) html = `<div class="box"><b>🃏 ${esc(c.t)}</b><p class="mute" style="margin:4px 0">${esc(c.vi)}</p><p style="margin:4px 0 0">You should say:</p>${c.b.map(b => `<p style="margin:2px 0 0">• ${esc(b)}</p>`).join('')}</div>
    <details class="box" open><summary><b>🗣 Bài nói mẫu</b> ${kSay(c.m)}</summary><p style="margin:6px 0 0">${esc(c.m)}</p><p class="mute" style="margin:6px 0 0">${esc(d.note || '')}</p></details>`; }
  else if (d.ex) html = `<div class="box"><b>❓ ${esc(d.ex.q)}</b></div><details class="box" open><summary><b>🗣 Câu trả lời mẫu</b> ${kSay(d.ex.m)}</summary><p style="margin:6px 0 0">${esc(d.ex.m)}</p><p class="mute" style="margin:6px 0 0">${esc(d.ex.note)}</p></details>`;
  return { html, tq: xlMcq(XL_TXT.mcq[d.k]) }; }

// TOEIC (v137, đủ dạng câu): ví dụ + làm thử lấy theo nhãn dạng (tools/build-toeic.mjs). Câu lẻ (Part 1, 2, 5) = câu cuối của dạng + 3 câu khác cùng dạng (ưu tiên câu đã làm);
// dạng nằm trong bài nhiều câu (Part 3, 4, 6, 7) = câu dạng đó của bài cuối có dạng đó + câu dạng đó của 3 bài khác. "🏋️ Bài tập dạng này" mở bài tập theo dạng (toeic.js TO_DR) khi có.
function xlTo(sk) { if (typeof TO === 'undefined' || !TO) return []; const R = toSt().r;
  const one = (L, mk) => L.length ? [xlLast(L), ...xlPrefer(L.slice(0, -1), R).slice(0, XL_TRY)].map(mk) : [];
  const pick = (its, mkQs, f, fe = f) => { const qOf = (x, g) => mkQs(x).filter(g), ok = its.filter(x => qOf(x, f).length), es = ok.filter(x => qOf(x, fe).length); if (!es.length) return [];
    const e = xlLast(es); return [qOf(e, fe)[0], ...xlPrefer(ok.filter(x => x !== e), R).slice(0, XL_TRY).map(x => qOf(x, f)[0])]; };
  const set = (its, mk, pickQ) => { if (!its.length) return []; const ex = xlLast(its), rest = its.filter(x => x !== ex), tx = rest.length ? xlPrefer(rest, R)[0] : ex, eq = mk(ex), e = pickQ ? pickQ(eq) || eq[0] : eq[0];
    return [e, ...(tx === ex ? eq.filter(q => q !== e) : mk(tx)).slice(0, XL_TRY)]; };
  const P2 = { p2: 'wh', 'p2-yn': 'yn', 'p2-or': 'or', 'p2-req': 'req', 'p2-st': 'stmt' }, Q34 = { gist: 'gist', next: 'next', imp: 'imp', g: 'graphic' }, chat = x => /message|chat/i.test(x.kind);
  return (XL_TXT.to[sk] || []).map(d => { const o = { ...d, id: 'to:' + sk + ':' + d.k, ex: 'toeic', sk, how: d.how || [] }, k = d.k;
    if (k === 'p1' || k === 'p1o') { const kk = k === 'p1' ? 'people' : 'scene'; o.qs = () => one((TO.p1 || []).filter(x => x.k === kk), toP1Q); o.go = `data-todr="p1:${kk}"`; }
    if (P2[k]) { o.qs = () => one(TO.p2.filter(x => x.ty === P2[k]), toP2Q); o.go = `data-todr="p2:${P2[k]}"`; }
    if (k === 'p2t') { o.qs = () => { const L = TO.p2.filter(x => (x.tr || []).filter(Boolean).length >= 2), e = xlLast(L.length ? L : TO.p2); return [e, ...xlPrefer(TO.p2.filter(x => x !== e), R).slice(0, XL_TRY)].map(toP2Q); }; o.go = 'data-top="p2"';
      o.how = ['Nghe câu hỏi trước, đoán loại thông tin cần (thời gian, nơi, người, lý do).', 'Với mỗi lời đáp, hỏi: "nó có trả lời đúng điều được hỏi không?" Rơi vào một kiểu bẫy thì loại ngay.']; o.trap = Object.values(TO_TRAP).map(([t, s]) => t + ': ' + s); }
    if (k === 'p3' || k === 'p4') { const its = () => TO[k].filter(x => !x.g && !x.qs.some(q => q.ty === 'imp') && (k === 'p4' || new Set((x.lines || []).map(l => l[0])).size <= 2)); o.qs = () => set(its(), x => toTalkQs(x, k)); o.go = `data-top="${k}"`; }
    if (Q34[k]) { o.qs = () => pick(toTalks(), toTalkMk, q => q.qt === Q34[k]); o.go = `data-todr="q:${Q34[k]}"`; }
    if (k === 'p4-ty') { o.qs = () => { const N = TO_P4TY, its = TO.p4.filter(x => N[x.ty]); if (!its.length) return [];   // làm thử: nghe 2 câu mở đầu, chọn loại bài nói
        const mk = x => { const ss = kSents(x.text).slice(0, 2).join(' '), oth = shuf(Object.keys(N).filter(t => t !== x.ty)).slice(0, 3);
          return { x, sec: 'p4', kind: 'mc', head: TO_LH + '<p class="mute">Nghe 2 câu mở đầu của một bài nói Part 4.</p>', q: 'Đây là loại bài nói nào?', opts: shuf([N[x.ty], ...oth.map(t => N[t])]), a: N[x.ty], play: { key: x.id + '|mo', text: ss }, why: `Câu mở đầu: “${ss}” → ${N[x.ty]}.` }; };
        const e = xlLast(its.filter(x => x.ty === 'ad')) || xlLast(its), seen = new Set([e.ty]), rest = [];
        for (const x of xlPrefer(its.filter(x => x !== e), R)) if (!seen.has(x.ty) && rest.length < XL_TRY) { seen.add(x.ty); rest.push(x); }
        return [e, ...rest].map(mk); }; o.go = 'data-top="p4"'; }
    if (/^p5-/.test(k)) { const t = k.slice(3); o.qs = () => one(TO.p5.filter(x => x.t === t), toP5Q); o.go = `data-top="t:${t}"`; }
    if (k === 'p6') { o.qs = () => pick(TO.p6, toP6Qs, q => q.gt === 'tense' || q.gt === 'conn', q => q.gt === 'tense'); o.go = 'data-todr="p6:ctx"'; }
    if (k === 'p6-ins') { o.qs = () => pick(TO.p6, toP6Qs, q => q.gt === 'insert'); o.go = 'data-todr="p6:ins"'; }
    if (k === 'p7') { o.qs = () => pick(TO.p7.filter(x => x.docs.length === 1 && !chat(x)), toP7Qs, q => q.qt === 'purpose' || q.qt === 'detail', q => q.qt === 'purpose'); o.go = 'data-top="p7"'; }
    if (k === 'p7-inf') { o.qs = () => pick(TO.p7, toP7Qs, q => ['not', 'true', 'infer'].includes(q.qt), q => q.qt === 'not'); o.go = 'data-todr="q7:infer"'; }
    if (k === 'p7-syn') { o.qs = () => pick(TO.p7, toP7Qs, q => q.qt === 'syn'); o.go = 'data-todr="q7:syn"'; }
    if (k === 'p7-ins') { o.qs = () => pick(TO.p7, toP7Qs, q => q.qt === 'insert'); o.go = 'data-todr="q7:insert"'; }
    if (k === 'p7c') { o.qs = () => pick(TO.p7.filter(chat), toP7Qs, q => q.qt === 'intent'); o.go = 'data-todr="q7:intent"'; }
    if (k === 'p7m') { o.qs = () => set(TO.p7.filter(x => x.docs.length > 1), toP7Qs, qs => qs.find(q => /Đối chiếu|both/i.test(q.why || ''))); o.go = 'data-top="p7m"'; }
    if (k === 'time') o.go = 'data-tospd="p5"';
    if (k === 'voc') { o.qs = () => { const V = toSt().voc, T = TO.voc.find(t => t.w.some(w => !V[w[0]])) || TO.voc[0], ws = T.w, mk = w => ({ x: { id: 'voc:' + w[0] }, kind: 'mc', head: `<p class="mute" style="margin:0">${esc(T.t)}</p><p style="margin:6px 0 0">${esc(w[2] || '')}</p>`, q: `“${esc(w[0])}” nghĩa là gì?`, opts: shuf([w[1], ...shuf(ws.filter(z => z !== w)).slice(0, 2).map(z => z[1])]), a: w[1], why: w[2] || '' });
      return [mk(ws[0]), ...shuf(ws.slice(1)).slice(0, XL_TRY).map(mk)]; }; o.go = 'data-tobt="V"'; }
    return o; }); }

// Cambridge: một bài học cho mỗi PHẦN của bài thi (khuôn MOCK); bài Nói chia theo các phần của mkSpeak
const XL_CBS = { pre: ['noi1', 'eit', 'pic'], a1: ['diff', 'story', 'odd', 'noi1', 'eit'], a2: ['noi1', 'eit', 'talk', 'rp', 'noi4'], b1: ['noi1', 'eit', 'photo', 'rp', 'noi4'], b2: ['noi1', 'eit', 'photo', 'rp', 'noi4'], c1: ['noi1', 'eit', 'photo', 'rp', 'noi4'], c2: ['noi1', 'eit', 'talk', 'rp', 'noi4'] };
function xlCb(sk) { const [lv, ps] = String(sk).split('~'), pi = +ps, C = MOCK[lv], p = C && C.papers[pi]; if (!p) return []; const T = XL_TXT.cb;
  if (p.speak) return (XL_CBS[SPK_EX[lv]] || []).map(k => { const s = T.spk[k]; return { ...s, t: SPK_EX[lv] === 'a1' && k === 'noi1' ? 'Phần 4: câu hỏi về bạn' : s.t, k, id: `cb:${C.lo}:${p.t}:${k}`, ex: 'cambridge', sk, i: 0, lv, pi, trap: [], go: `data-cbx="try|${lv}|${pi}|0"`, sp: 1 }; });
  return p.parts.map(([lab, gen], i) => { const k = cbKey(lab, p), c = cbCat(lab, p), kk = T.what[k] ? k : c;
    const how = T.how[k] || CB_HOWT[k] || (CB_UK.includes(k) && U_T[k] ? [U_T[k][2]] : null) || CB_HOWT[c] || [];
    return { id: `cb:${C.lo}:${p.t}:${lab}`, ex: 'cambridge', sk, i, lv, pi, k: kk, ic: T.ic[kk] || cbIc(p.t), t: (cbNum(lab) ? 'Phần ' + cbNum(lab) + ': ' : '') + cbShort(lab), what: T.what[kk] || '', how, trap: T.trap[kk] || [],
      go: `data-cbx="try|${lv}|${pi}|${i}"`, gen: () => xlGen(lv, pi, gen) }; }); }
// sinh câu của một phần như đề thử (cần MK của cấp); giữ MK đang có
function xlGen(lv, pi, gen) { const old = MK; MK = { lv, C: MOCK[lv], papers: [], idx: [pi] };
  try { return (gen() || []).map(q => q && q.part && q.q ? q.q : q).filter(q => q && ['mc', 'type', 'write'].includes(q.kind)); } catch (e) { return []; } finally { MK = old; } }
// bài Nói Cambridge: ví dụ + làm thử theo phần
function xlCbSpk(d) { const ex = SPK_EX[d.lv], T = XL_TXT.cb, P = KIT.noi, ls = LEVELS.slice(LEVELS.indexOf(MOCK[d.lv].lo), LEVELS.indexOf(d.lv) + 1).filter(l => P.lvs.includes(l)), say = m => `<details class="box" open><summary><b>🗣 Câu trả lời mẫu</b> ${kSay(m)}</summary><p style="margin:6px 0 0">${esc(m)}</p></details>`;
  // phỏng vấn / thảo luận: từ A2 làm thử chọn câu trả lời tốt (cùng bộ câu với IELTS Part 1 / Part 3); Starters, Movers chỉ xem mẫu
  if (d.k === 'noi1' || d.k === 'noi4') { const m = (d.k === 'noi1' ? T.m1 : T.m4)[ex], tq = LEVELS.indexOf(d.lv) >= LEVELS.indexOf('a2') ? xlMcq(XL_TXT.mcq[d.k === 'noi1' ? 'p1' : 'p3']) : [];
    return { html: m ? `<div class="box"><b>❓ ${esc(m[0])}</b></div>${say(m[1])}` : '', tq }; }
  if (d.k === 'eit') { const s = (ls.flatMap(l => (P.raw && P.raw.test && P.raw.test[l]) || []).filter(t => kWords(t).length >= 5)[0]) || ''; return { html: s ? `<div class="box"><p class="mute" style="margin:0">Câu ví dụ: nghe rồi nói lại đúng như vậy</p><p style="margin:6px 0 0">${kSay(s)} <b>${esc(s)}</b></p></div>` : '', tq: [] }; }
  if (d.k === 'pic') { const sp = dtAll().filter(x => x.k === 'spk' && x.lv === 'pre')[0]; if (!sp) return { html: '', tq: [] }; const qs = sp.qs, pic = toPic(sp.pic);
    return { html: `<div class="box">${pic}<p style="margin:6px 0 0"><b>${esc(qs[0].q)}</b> <span class="mute">${esc(qs[0].vi || '')}</span></p><p style="margin:4px 0 0">🗣 ${esc(qs[0].t)}</p></div>`,
      tq: qs.slice(1, 1 + XL_TRY).map(t => ({ kind: 'mc', head: pic, q: esc(t.q), opts: shuf([t.t, ...shuf([...new Set(qs.map(z => z.t))].filter(a => a !== t.t)).slice(0, 2)]), a: t.t, why: 'Câu trả lời đúng với câu hỏi và với tranh.' })) }; }
  if (['diff', 'story', 'odd'].includes(d.k)) { const st = dtAll().filter(x => x.k === 'spk' && x.lv === 'a1' && x.part === d.k)[0]; if (!st) return { html: '', tq: [] };
    const grid = h => `<div style="display:grid;grid-template-columns:1fr 1fr;gap:6px">${h}</div>`, pic = d.k === 'diff' ? `<div style="display:grid;grid-template-columns:1fr;gap:6px">${st.pics.map((p, i) => `<div><span class="mute">Tranh ${'AB'[i]}</span>${toPic(p)}</div>`).join('')}</div>`
      : d.k === 'story' ? `<p class="mute" style="margin:0 0 4px">${esc(st.intro)}</p>` + grid(st.panels.map((p, i) => `<div><span class="mute">Tranh ${i + 1}</span>${toPic(p)}</div>`).join('')) : '';
    const pq = t => d.k === 'odd' ? `<p style="font-size:40px;text-align:center;letter-spacing:10px;margin:6px 0">${t.e.join(' ')}</p>` : pic, t0 = st.qs[0];
    return { html: `<div class="box">${pq(t0)}<p style="margin:6px 0 0"><b>${esc(t0.q)}</b> <span class="mute">${esc(t0.vi || '')}</span></p><p style="margin:4px 0 0">🗣 ${esc(t0.t)} ${kSay(t0.t)}</p></div>`,
      tq: st.qs.slice(1).map(t => ({ kind: 'mc', head: pq(t), q: esc(t.q), opts: shuf([t.t, ...shuf(st.qs.filter(z => z !== t).map(z => z.t)).slice(0, 2)]), a: t.t, why: 'Câu đúng trả lời đúng câu hỏi và khớp với tranh.' })) }; }
  if (d.k === 'photo') { const ph = dtAll().filter(x => x.k === 'photo' && x.lv === ex)[0]; if (!ph) return { html: '', tq: [] };
    return { html: `<div class="box"><b>${esc(ph.p)}</b><p class="mute" style="margin:4px 0">${esc(ph.pv || '')}</p>${ph.pics.map((p, i) => `<div><span class="mute">Ảnh ${'ABC'[i]}</span>${toPic(p)}</div>`).join('')}</div>${say(ph.m)}`, tq: xlStructQ(ph.m) }; }
  if (d.k === 'talk') { const x = P.items.filter(y => ls.includes(y.lv) && y.type !== 'rp' && y.m)[0]; if (!x) return { html: '', tq: [] };
    return { html: `<div class="box"><b>${esc(x.p)}</b><p class="mute" style="margin:4px 0 0">${esc(x.pv || '')}</p></div>${say(x.m)}`, tq: xlStructQ(x.m) }; }
  if (d.k === 'rp') { const x = P.items.filter(y => ls.includes(y.lv) && y.type === 'rp')[0]; if (!x) return { html: '', tq: [] }; const v = (x.learn || x.tests || [])[0] || [], me = v.filter(s => !s.s);
    const html = `<div class="box"><b>${esc(x.ic || '')} ${esc(x.vi)}</b>${v.map(s => s.s ? `<p style="margin:6px 0 0">👤 ${esc(s.t)}</p>` : `<p style="margin:6px 0 0"><span class="mute">Bạn (${esc(s.vi)}):</span><br>🗣 <b>${esc(s.t)}</b></p>`).join('')}</div>`;
    const tq = me.slice(0, XL_TRY).map(s => { const j = v.indexOf(s), prev = j > 0 && v[j - 1].s ? v[j - 1].t : ''; return { kind: 'mc', head: `<div class="box">${prev ? `<p style="margin:0">👤 ${esc(prev)}</p>` : ''}<p class="mute" style="margin:6px 0 0">Việc của bạn: ${esc(s.vi)}</p></div>`, q: 'Bạn nói gì?', opts: shuf([s.t, ...shuf(me.filter(z => z !== s)).slice(0, 2).map(z => z.t)]), a: s.t, why: 'Câu đúng làm đúng việc của lượt này: ' + s.vi + '.' }; });
    return { html, tq: tq.filter(q => q.opts.length >= 2) }; }
  return { html: '', tq: [] }; }

// ---------- 🎧 nghe đoạn quanh câu chứa đáp án · 📍 câu chứa đáp án ----------
const xlStrip = s => String(s || '').replace(/<[^>]*>/g, ' ').replace(/^[A-H][.\s]\s*/, '').replace(/&[a-z#0-9]+;/g, ' ');
const xlStop = new Set(typeof K_STOP !== 'undefined' ? K_STOP : []);
function xlBest(ss, q, min) { const yn = /^(TRUE|FALSE|YES|NO|NOT GIVEN)$/.test(q.a), aw = new Set(kWords(xlStrip(q.a) + ' ' + (q.acc || []).join(' ')).filter(w => w.length > 2 && !xlStop.has(w))), qw = new Set(kWords(xlStrip(q.q)).filter(w => w.length > 2 && !xlStop.has(w)));
  const ac = (q.acc || [q.a]).map(a => kNorm(xlStrip(a))).filter(a => a.length > 1), flat = t => kNorm(t).replace(/[^a-z0-9]/g, '');
  const lab = q.kind === 'mc' && kWords(xlStrip(q.a)).length <= 2, wa = lab ? 1 : 2, wq = lab ? 2 : 1;   // đáp án là nhãn ngắn (tên người, chữ cái): từ của câu hỏi đáng tin hơn
  let bi = -1, sc = 0; ss.forEach((s, i) => { let v = 0; for (const w of new Set(kWords(s))) { if (!yn && aw.has(w)) v += wa; if (qw.has(w)) v += wq; }
    if (q.kind === 'type' && ac.some(a => kNorm(s).includes(a) || (a.length > 3 && flat(s).includes(a.replace(/[^a-z0-9]/g, ''))))) v += 4; if (v > sc) { sc = v; bi = i; } });
  return sc >= (min || (yn ? 2 : 3)) ? bi : -1; }   // đoạn nghe (xlSeg) nhận ngưỡng 2: cửa sổ 4 câu quanh đó vẫn chứa đáp án
function xlSeg(q) { const x = q && q.x; if (!x || !q.play) return q;
  const L = x.lines ? x.lines : x.text ? kSents(x.text).map(t => ['', t]) : null; if (!L || L.length <= 8) return q; const j = xlBest(L.map(l => l[1]), q, 2); if (j < 0) return q;
  const a = Math.max(0, j - 2), lines = L.slice(a, Math.min(L.length, j + 2));   // bài một người nói (x.text): cắt theo câu, mỗi câu có giọng riêng ở n/
  return { ...q, play: x.lines ? { key: x.id + '|xl' + a, lines } : { key: x.id + '|xl' + a, text: lines.map(l => l[1]).join(' ') }, seg: { lines, at: j - a } }; }
const xlParas = q => { const x = q.x || {}; if (!x.paras) return []; const s = new Set(), add = c => { const i = IE_AB.indexOf(c); if (i >= 0 && i < x.paras.length) s.add(i); };
  if (q.k === 'h') add(xlStrip(q.q).trim().slice(-1)); if (q.k === 'mi') add(q.a);
  for (const m of String(q.why || '').matchAll(/Đoạn\s+([A-H])((?:\s*(?:,|và|–|-)\s*[A-H]\b)*)/g)) { add(m[1]); for (const c of (m[2] || '').match(/[A-H]/g) || []) add(c); }
  return [...s].sort((a, b) => a - b); };
function xlEvid(q) { const x = q.x || {}; if (q.a === 'NOT GIVEN') return 'NOT GIVEN: bài không có câu nào cho biết điều này đúng hay sai.';
  if (x.text && q.kind === 'mc' && typeof q.a === 'string' && kSents(x.text).includes(q.a)) { const ss = kSents(x.text), j = ss.indexOf(q.a); return `Câu trước chỗ trống: “${esc(ss[j - 1] || '')}” · câu sau: “${esc(ss[j + 1] || '')}”. Câu chèn phải nối được cả hai.`; }
  if (q.seg) return ''; const ps = xlParas(q), pool = x.paras ? (ps.length ? ps.map(i => x.paras[i]) : x.paras) : x.lines ? x.lines.map(l => l[1]) : x.docs ? x.docs.map(d => d.text) : x.texts || (x.text ? [x.text] : []);
  const ss = pool.flatMap(t => kSents(String(t))), j = ss.length ? xlBest(ss, q) : -1; return j >= 0 ? `Câu chứa đáp án: “${esc(ss[j])}”` : ''; }

// ---------- màn bài học ----------
const xlSkName = (ex, sk) => ex === 'ielts' ? IE_SKV[sk][1] : ex === 'toeic' ? TO_SKV[sk][1] : (([lv, pi]) => cbPn(MOCK[lv].papers[+pi].t))(String(sk).split('~'));
const xlBack = (ex, sk) => () => { scrollTo(0, 0); EXAM_VOX = false; if (ex === 'ielts') return ieSkView(sk); if (ex === 'toeic') return toSkView(sk); const [lv, pi] = String(sk).split('~'); return cbSkView(lv, +pi); };
const xlClickOf = ex => ex === 'ielts' ? ieClick : ex === 'toeic' ? toClick : cbClick;
// ví dụ có lời giải (câu hỏi thường): đề + ngữ cảnh + phương án; lời giải gập: đáp án, vì sao, câu chứa đáp án, lời nghe
function xlExQ(q, d) { const x = q.x || {}, ps = xlParas(q), lettered = (q.opts || []).some(o => /^[A-H][.\s]/.test(o));
  const ctx = x.paras ? (ps.length ? `<div class="box">${ps.map(i => `<p class="tdtap" style="margin:4px 0;font-size:16px;line-height:1.6"><b>${IE_AB[i]}</b> ${esc(x.paras[i])}</p>`).join('')}</div>` : (q.foot || '').replace('<details class="box" open', '<details class="box"')) : (q.foot || '');
  const bare = q.kind === 'mc' && !!q.play && q.opts.every(o => /^[A-H]$/.test(o)) && !x.paras;   // TOEIC Part 1, 2: phương án chỉ nghe, đề không in chữ
  const opts = q.kind !== 'mc' ? '<p class="mute" style="margin:4px 0">✍️ Câu này phải gõ câu trả lời.</p>' : q.emo ? `<p style="font-size:44px;text-align:center;margin:6px 0;letter-spacing:12px">${q.opts.map(esc).join(' ')}</p>`
    : bare ? `<p class="mute" style="margin:4px 0">Phương án ${q.opts.join(' · ')}: chỉ nghe, đề không in chữ.</p>` : `<div style="margin:6px 0">${q.opts.map((o, j) => `<p style="margin:4px 0;font-size:15px">${lettered ? '' : 'ABCDEFGH'[j] + '. '}${esc(o)}</p>`).join('')}</div>`;
  const ans = q.kind === 'mc' ? mcAns(q) : (q.acc || [q.a]).join(' / '), ev = xlEvid(q), seg = q.seg ? `<div class="box" style="margin:8px 0 0"><b>🗒 Lời nghe đoạn này</b>${q.seg.lines.map((l, i) => `<p style="margin:4px 0 0;${i === q.seg.at ? 'font-weight:700' : ''}">${l[0] ? esc(l[0]) + ': ' : ''}${esc(l[1])}</p>`).join('')}</div>` : '';
  const why = d.k === 'p2t' && x.tr ? x.o.map((t, i) => `<p style="margin:4px 0">${'ABC'[i]}. ${esc(t)} ${i === x.a ? '✅' : `❌ <b>${esc((TO_TRAP[x.tr[i]] || [''])[0])}</b>${TO_TRAP[x.tr[i]] ? ': ' + esc(TO_TRAP[x.tr[i]][1]) : ''}`}</p>`).join('') : q.why ? `<p style="margin:4px 0">💡 ${esc(q.why)}</p>` : '';
  return `<div class="box"><b>🔍 Ví dụ có lời giải</b> <span class="mute">· câu thật trong kho của app</span>
    <div style="margin-top:6px">${q.head || ''}${ctx}${q.play ? `<button class="chip" data-xlplay>🔊 Nghe${q.seg ? ' đoạn có đáp án' : ''}</button>` : ''}<p class="q" style="font-size:18px;margin:8px 0 4px">${q.q}</p>${opts}</div>
    <p class="mute" style="margin:8px 0 4px">Tự nghĩ đáp án trước, rồi mở lời giải.</p>
    <details class="xlsol"><summary><b>👀 Xem đáp án và lời giải</b></summary><p style="margin:8px 0 4px">✅ Đáp án: <b>${esc(ans)}</b></p>${why}${ev ? `<p style="margin:4px 0">📍 ${ev}</p>` : ''}${seg}${q.after || ''}</details></div>`; }
// bài Viết Cambridge: đề + bài mẫu (kho hoặc XL_TXT.cb.ps)
function xlExW(q) { const x = q.x || {}, m = x.m || XL_TXT.cb.ps[x.id] || ''; const P = xlParas2(m);
  return { html: `${q.head || ''}${P.length ? `<details class="box" open><summary><b>📄 Bài mẫu (${kWords(P.join(' ')).length} từ)</b></summary>${P.map(p => `<p style="margin:8px 0 0">${esc(p).replace(/\n/g, '<br>')}</p>`).join('')}</details>` : '<p class="mute">Chưa có bài mẫu cho đề này.</p>'}`, tq: P.length ? xlStructQ(m) : [] }; }
async function xlView(ex, sk, i) { BACK = null; EXAM_VOX = false;
  try { if (ex === 'ielts' && (typeof IE === 'undefined' || !IE)) await ieLoad(); if (ex === 'toeic' && (typeof TO === 'undefined' || !TO)) await toLoad();
    if (ex === 'cambridge') { if (!KIT.noi.items || !KIT.nghe.items) $app.innerHTML = '<div id="ie"></div><p class="mute">Đang tải…</p>'; await Promise.all([loadEB(), ...Object.values(KIT).map(kLoad), typeof uLoad === 'function' ? uLoad() : 0]); } } catch (e) {}
  if (!NCLIPS.size) fetch('n/index.json?v=' + APP_V).then(r => r.json()).then(x => { NCLIPS = new Set(x); }).catch(() => {});
  const L = xlList(ex, sk), n = +i, d = L[n]; if (!d) return xlBack(ex, sk)();
  window.CUR = { view: ex === 'cambridge' ? 'cambridge' : ex, sk: ex === 'cambridge' ? String(sk).replace('~', '|') : sk, xl: d.id };
  // ví dụ + làm thử
  let exHtml = '', tq = [], eq = null;
  if (d.qs) { const qs = d.qs().filter(Boolean); eq = qs[0] || null; if (eq) exHtml = xlExQ(eq, d); tq = qs.slice(1, 1 + XL_TRY); }
  else if (d.w) { const w = d.w(); if (w) { exHtml = `<div class="box"><b>🔍 Ví dụ: đề và bài mẫu</b></div>${w.html}`; tq = w.tq || []; } }
  else if (d.sp) { const w = xlCbSpk(d); if (w.html) exHtml = `<div class="box"><b>🔍 Ví dụ</b></div>${w.html}`; tq = w.tq || []; }
  else if (d.gen) { const qs = XL_QC[d.id] || (XL_QC[d.id] = d.gen()), e = qs[0];
    if (e && e.kind === 'write') { const w = xlExW(e); exHtml = `<div class="box"><b>🔍 Ví dụ: đề và bài mẫu</b></div>${w.html}`; tq = w.tq; }
    else if (e) { eq = e; exHtml = xlExQ(e, d); tq = d.gen().filter(q => q.kind !== 'write' && !(q.q === e.q && q.a === e.a)).slice(0, XL_TRY); } }
  const St = xlSt(), ld = St[d.id], nx = L[n + 1];
  XL_CUR = { ex, sk, i: n, id: d.id, tq, eq };
  $app.innerHTML = `<div id="ie"></div><div class="row top"><button class="link" data-xlb>‹ ${esc(xlSkName(ex, sk))}</button><span class="mute" style="font-size:13px">Bài học ${n + 1}/${L.length}</span></div>
    <h1>📘 ${d.ic} ${esc(d.t)}</h1><p class="mute" style="margin:0 0 8px">${XL_EXN[ex]} · bài học${ld ? ' · ✓ đã học' : ''}. Không tính band / điểm ước, không vào bản đồ. 🤖 Claude soạn, chưa giáo viên kiểm.</p>
    <div class="box"><b>🎯 Dạng này là gì</b><p style="margin:6px 0 0">${esc(d.what)}</p></div>
    ${d.how && d.how.length ? `<div class="box"><b>🪜 Cách làm</b><ol style="margin:6px 0 0;padding-left:22px">${d.how.map(x => `<li style="margin:4px 0">${esc(x)}</li>`).join('')}</ol></div>` : ''}
    ${exHtml}
    ${d.trap && d.trap.length ? `<div class="box"><b>🪤 Bẫy hay gặp</b>${d.trap.map(x => `<p style="margin:6px 0 0">• ${esc(x)}</p>`).join('')}</div>` : ''}
    ${tq.length ? `<button class="pri" data-xlt>✍️ Làm thử ${tq.length} câu<small style="display:block;font-weight:400;opacity:.9">bài học: báo đúng / sai ngay, không ghi kết quả</small></button>` : `<button class="pri" data-xlok>✓ ${ld ? 'Đã học' : 'Đã học xong bài này'}</button>`}
    ${d.go ? `<button ${d.go}>🏋️ Bài tập dạng này ›</button>` : ''}
    <div class="row" style="gap:8px;margin-top:8px">${n > 0 ? '<button data-xlp>‹ Bài trước</button>' : '<span></span>'}${nx ? '<button data-xln>Bài sau ›</button>' : '<span></span>'}</div>`;
  const done = (ok, m) => { St[d.id] = { at: Date.now(), ok, n: m }; S.t = Date.now(); save(); };
  $app.onclick = e => { const g = s => e.target.closest(s);
    if (g('[data-xlb]')) return xlBack(ex, sk)();
    if (g('[data-xlp]')) { scrollTo(0, 0); return xlView(ex, sk, n - 1); }
    if (g('[data-xln]')) { scrollTo(0, 0); return xlView(ex, sk, n + 1); }
    if (g('[data-xlok]')) { if (!ld) { done(0, 0); toast('✓ Đã học: ' + d.t); } return nx ? xlView(ex, sk, n + 1) : xlBack(ex, sk)(); }
    if (g('[data-xlplay]')) { if (eq && eq.play) { EXAM_VOX = true; kPlay(eq.play); } return; }
    if (g('[data-xlt]')) { scrollTo(0, 0);
      return ieRun('📘 ' + d.t, tq, () => xlView(ex, sk, n), 0, { nolog: 1, plays: 3, home: 'Về bài học', done: res => done(res.filter(r => r.ok).length, res.length),
        endHtml: () => `<div class="box"><b>✅ Xong bài học: ${esc(d.t)}</b><p class="mute" style="margin:4px 0 0">Bài học không ghi vào kết quả bài, band / điểm ước, bản đồ.</p></div>${d.go ? `<button ${d.go}>🏋️ Bài tập dạng này ›</button>` : ''}${nx ? `<button data-xln>📘 Bài học sau: ${esc(nx.t)} ›</button>` : ''}`,
        endClick: e2 => { if (e2.target.closest('[data-xln]')) { scrollTo(0, 0); xlView(ex, sk, n + 1); return true; } window.CUR = { view: ex === 'cambridge' ? 'cambridge' : ex, sk: ex === 'cambridge' ? String(sk).replace('~', '|') : sk }; xlClickOf(ex)(e2); return false; } }); }
    return xlClickOf(ex)(e); };   // 🏋️ bài tập dạng này: nút của màn kỳ thi (về màn kỹ năng)
  scrollTo(0, 0); }
// mở bài học từ màn kỹ năng (dòng danh sách, nút 📘): data-xl="kỳ thi|kỹ năng|số thứ tự"
document.addEventListener('click', e => { if (!S) return; const b = e.target.closest('[data-xl]'); if (!b) return; const [ex, sk, i] = b.dataset.xl.split('|'); scrollTo(0, 0); xlView(ex, sk, +i || 0); });

// ---------- phần bài học trên màn kỹ năng (parts.js xSkill: les, bước ①, nút 📘) ----------
// chỗ yếu của dạng / phần theo bản đồ (chỉ đọc): IELTS imCell, TOEIC tmCell, Cambridge ô của phần
function xlWeak(d) { try { if (d.ex === 'ielts') return !!d.u && typeof imCell === 'function' && imCell(d.u).s === 'yeu';
  if (d.ex === 'toeic') return !!d.u && typeof tmCell === 'function' && [].concat(d.u).some(u => tmCell(u).s === 'yeu');
  if (d.ex === 'cambridge' && !d.sp) { const c = (cbRows(d.lv)[d.pi] || { cells: [] }).cells[d.i]; return !!c && c.s === 'yeu'; } } catch (e) {} return false; }
// v133: việc luyện đề ở 📅 Hôm nay = bài học kế tiếp của kỳ thi (một dạng câu / một phần đề), lấy ở kỹ năng có ít bài đã học nhất; học hết thì null (Hôm nay dùng ieToday / toToday)
const XL_SKS = { ielts: ['R', 'L', 'W', 'S'], toeic: ['L', 'R'] };
function exNextLesson(ex, lv) { try { const sks = ex === 'cambridge' ? (typeof MOCK !== 'undefined' && MOCK[lv] ? MOCK[lv].papers.map((_, i) => lv + '~' + i) : []) : XL_SKS[ex] || [], St = xlSt(); let best = null;
  for (const sk of sks) { const L = xlList(ex, sk); if (!L.length) continue; const done = L.filter(d => St[d.id]).length, i = L.findIndex(d => !St[d.id]); if (i < 0) continue;
    if (!best || done < best.done) best = { ex, sk, i, d: L[i], done }; }
  if (best) best.skn = ex === 'ielts' ? IE_SKV[best.sk][1] : ex === 'toeic' ? TO_SKV[best.sk][1] : String((MOCK[lv].papers[+best.sk.split('~')[1]] || {}).t || '').replace(/^\S+\s/, '');
  return best; } catch (e) { return null; } }
function xlBlock(ex, sk) { const L = xlList(ex, sk), St = xlSt(), done = L.filter(d => St[d.id]).length;
  let cells = null; if (ex === 'cambridge' && L[0] && !L[0].sp) try { cells = (cbRows(L[0].lv)[L[0].pi] || {}).cells || []; } catch (e) { cells = []; }   // ô bản đồ của bài thi: tính một lần
  const W = L.map(d => cells ? !!(cells[d.i] && cells[d.i].s === 'yeu') : xlWeak(d));
  const ni = (() => { const a = L.findIndex((d, j) => !St[d.id] && W[j]); return a >= 0 ? a : L.findIndex(d => !St[d.id]); })(), wi = L.findIndex((d, j) => St[d.id] && W[j]);
  const rows = L.map((d, j) => { const isN = j === ni, tag = isN ? 'học tiếp' : W[j] ? (St[d.id] ? 'yếu · xem lại' : 'yếu · nên học') : St[d.id] ? 'đã học' : ''; return pRow(`data-xl="${ex}|${esc(sk)}|${j}"`, `${d.ic} ${esc(d.t)}`, tag, isN ? 'next' : W[j] ? 'bad' : St[d.id] ? 'good' : ''); });
  const open = ni >= 0 ? ni : wi >= 0 ? wi : 0;
  return { L, done, rows, at: ni,
    step: { t: 'Học dạng', v: `${done}/${L.length}`, sub: L.length && done >= L.length ? 'đủ' : `còn ${L.length - done} bài`, ok: L.length > 0 && done >= L.length, cur: done < L.length },
    learn: { attr: `data-xl="${ex}|${esc(sk)}|${open}"`, sub: ni >= 0 ? 'học tiếp: ' + esc(xlShort(L[ni].t)) : wi >= 0 ? 'xem lại: ' + esc(xlShort(L[wi].t)) : L.length ? 'đã học hết · xem lại' : 'chưa có bài', pri: ni >= 0 } }; }
