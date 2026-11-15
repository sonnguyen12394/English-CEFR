# Đặc tả: 🏘 Phố Loại Từ: trò chơi lý thuyết Part 5 có nhân vật điều khiển

**Thư mục**: `specs/019-pho-loai-tu` · **Ngày**: 15/11/2026 · **Trạng thái**: Đã chốt (Q1 = C, Q2 = C; người sáng lập 15/11/2026 "Ok làm đi")

**Yêu cầu của người sáng lập** (14–15/11/2026): trò 🗺 Chinh phục đề "chưa đủ hấp dẫn"; "lý thuyết mỗi câu rất nặng", "chưa gợi ý từ điển để tìm hiểu", "nhịp chơi chán, chỉ là học lý thuyết làm trắc nghiệm chứ đâu phải chơi"; "lý thuyết khô khan khó nhớ"; "thích được tương tác điều khiển nhân vật", "phong cách dễ thương cũng được", "bạn tự tính". Sau khi chơi bản mẫu "Phố Loại Từ" (Artifact https://claude.ai/artifact/AJCcu1KwYxwCa4PfsCSA9v): "thấy hấp dẫn hơn rồi đó".

## Gốc vấn đề

1. Lý thuyết đưa ra dạng đoạn chữ dài (Vì sao + Cấu trúc + Dịch + nghĩa 4 phương án) để ĐỌC, không phải để LÀM. Trí nhớ bám chắc khi người học tự đoán, so sánh, hình dung (hiệu ứng tự tạo, Slamecka & Graf 1978; mã hoá kép chữ + hình, Paivio 1971; hiệu ứng kiểm tra, Roediger & Karpicke 2006).
2. Màn trò chơi không bật chạm-từ-để-tra (`.tdtap`), lời giải không trỏ sang 🔍 Tra cứu.
3. Hành động duy nhất là chọn A–D, nên lớp Boss / tim chỉ là áo của bài trắc nghiệm.

## Dữ liệu thật (đo 15/11/2026)

- Câu Part 5 dạng từ (`t: form`) có lời giải nghĩa từng phương án (`lg.og`, có ghi loại từ) ở Đề 1–8 + kho luyện: **56 câu**. Kho luyện Part 5 dạng từ: 30 câu. Đề riêng 9–16 chỉ có trên máy đã mở mã.
- Chỉ **16 / 56 câu** có 4 phương án thuộc 4 loại từ khác nhau. 40 câu còn lại có 2 phương án cùng loại (vd. consumer / consumption đều là danh từ; tired / tireless đều là tính từ; consume / consumed đều là động từ). Bản mẫu giả định 4 làn = 4 nhân vật khác nhau, nên với câu thật cần thêm cách phân biệt "hai người cùng nhà".
- 56 câu chia 16 đề ≈ 3–4 câu / đề: không đủ cho một ván 10 câu nếu chỉ dùng câu thật.

## Câu chuyện người dùng

### Câu chuyện 1: Làm quen + thám tử (ưu tiên 1)

Lần đầu vào 🏘 Phố Loại Từ, người học gặp 4 cư dân (Ông Chủ Danh · Anh Động · Cô Thợ May Tính · Bé Chạy Việc Trạng; đồng phục = đuôi từ), chạm từng người để nghe giới thiệu 1 câu. Rồi làm 4 vụ thám tử: 3 câu ví dụ có từ được tô ở cùng một kiểu ghế, chọn cư dân hay ngồi ghế đó. Sai: cư dân bị chọn nói "Không phải ghế của tôi!" + gợi ý. Đúng: từ đổi màu, nhận câu thần chú 1 dòng vào 📜 Sổ thần chú.

**Kiểm**: 1) đủ 4 vụ mới vào màn chơi lần đầu; 2) lần sau vào thẳng màn chơi, nút xem lại phần làm quen ở "Thêm"; 3) sổ có đúng số câu thần chú đã mở.

### Câu chuyện 2: Điều khiển bé Mầm bắt từ (ưu tiên 1)

Câu có một ghế trống ở trên, 4 phương án rơi xuống 4 làn. Người học chạm làn / vuốt / bấm ◀ ▶ để bé Mầm tới làn có từ đúng. Bắt đúng: từ bay vào ghế, máy đọc từ, combo, sao. Bắt sai: mất 1 trong 3 tim, cư dân bị bắt nhầm nói 1 câu "vì sao không phải ghế tôi" + nghĩa từ + dịch câu + đáp án; bấm "Hiểu rồi ›" mới đi tiếp. Màn 1 từ mang màu + mặt cư dân; màn 2 áo xám (phải nhìn đuôi từ), rơi nhanh hơn. Tốc độ rơi tăng nhẹ theo combo. Hết tim hoặc hết câu: màn kết quả có danh sách "Cần nhớ lại".

**Kiểm**: 1) làn của Mầm lúc từ chạm đất quyết định từ được bắt; 2) điều khiển được bằng chạm, vuốt, nút, phím mũi tên; 3) tạm dừng khi mở sổ, tra từ, rời màn; 4) giảm chuyển động: rơi chậm hơn, tắt nảy / rung.

### Câu chuyện 3: Hai người cùng nhà (ưu tiên 1, vì 40 / 56 câu thật cần)

Khi 2 phương án cùng loại từ, bước chọn loại từ chưa đủ. Bắt nhầm người cùng nhà thì cư dân giải thích phân biệt trong nhà, theo nhóm luật cố định: người ↔ vật (consumer / consumption), V gốc ↔ V3 / V-ing (sau will / to dùng gốc; bị động dùng V3), tính từ -ed ↔ -ing (cảm thấy ↔ gây ra), số ít ↔ số nhiều (a / an ↔ không mạo từ). Mỗi nhóm là một câu thần chú riêng, mở ở lần đầu gặp (một vụ thám tử ngắn).

**Kiểm**: 1) mọi câu thật có 2 phương án cùng loại đều được gắn một nhóm phân biệt; 2) giải thích khi bắt nhầm nêu đúng nhóm.

### Câu chuyện 4: Tra từ ngay trong trò (ưu tiên 1)

Chạm từ bất kỳ trong câu (không phải phương án đang rơi) thì trò tạm dừng, hiện nghĩa từ (dùng từ điển của app), 🔊, 📌 lưu Sổ từ, và "📘 Bài ngữ pháp liên quan" khi có. Sau khi bắt (đúng hoặc sai), 4 phương án hiện nghĩa.

**Kiểm**: 1) tra không làm mất tim / combo; 2) phương án đang rơi không tra được (tránh lộ loại từ qua nghĩa).

### Câu chuyện 5: Nhớ lâu (ưu tiên 2)

Câu bắt sai vào lịch ôn riêng của trò (ngày sau, rồi giãn 3 → 7 → 21 ngày). Đầu mỗi ván: "Nhớ nhanh" 3 câu thần chú (chạm cư dân đúng với đồng phục / ghế), không gợi ý. Câu thần chú lên cấp khi dùng đúng ở câu chưa gặp; sổ ghi câu chính người học từng sai.

### Câu chuyện 6: Nối với Chinh phục đề (ưu tiên 2)

Khi 🗺 Chinh phục đề chữa câu sai Part 5 dạng từ (👾 quái), có lối "🏘 Chữa ở Phố Loại Từ": chơi một ván ngắn có câu đó + 2–3 câu cùng luật; bắt đúng câu đó thì câu thành ⭐ như hạ quái thường.

## Yêu cầu chức năng

- **FR-001** 🏘 Phố Loại Từ là mục riêng ở màn TOEIC của tab 🎯 Luyện đề, phần 📚 Đề có sẵn, cạnh 🗺 Chinh phục đề; không gọi AI. Chinh phục đề có lối "🏘 Chữa ở Phố Loại Từ" cho câu sai Part 5 dạng từ (Q1 = C).
- **FR-002** 4 cư dân cố định theo bản mẫu (tên, màu, đồng phục, câu giới thiệu); nhân vật người chơi là bé Mầm. Hình vẽ bằng mã (SVG), không lấy hình game khác.
- **FR-003** Nguồn câu (Q2 = C): kho riêng ~120 câu Claude soạn theo khuôn (không chép câu đề / ETS, không gần trùng kho luyện) cho ván thường; câu thật Part 5 dạng từ của đề mà người học đã làm SAI (bài làm 📋 hoặc Chinh phục đề) chen vào ván (≤ 3 câu / ván) để ôn. Câu đề riêng 9–16 chỉ dùng khi máy đã mở mã.
- **FR-004** Mỗi câu cần: câu có 1 chỗ trống, 4 phương án, đáp án, loại từ từng phương án, câu "vì sao" ngắn theo ghế (≤ 1 dòng), nhóm phân biệt khi 2 phương án cùng loại, nghĩa từng phương án, dịch câu.
- **FR-005** Ván: màn 1 (có màu) 5 câu, màn 2 (áo xám) 5 câu; 3 tim; combo ≥ 3 nhân đôi sao; tốc độ tăng nhẹ theo combo, có trần.
- **FR-006** Câu thần chú: ≤ 1 dòng, ≤ 15 từ tiếng Việt; lý thuyết dài (lời giải `lg`) chỉ hiện khi bấm "Xem đầy đủ".
- **FR-007** Tra từ: chạm từ trong câu, trò tạm dừng; dùng từ điển app (`tdEntry` / nghĩa ngắn), 📌 lưu Sổ từ; không tra được phương án đang rơi.
- **FR-008** Lịch ôn và cấp thần chú lưu trong dữ liệu người học (cùng chỗ với trò TOEIC hiện có), không đổi thẻ học CEFR, không ghi điểm đề thử, không ghi bản đồ chỗ yếu.
- **FR-009** Tiếng tổng hợp (Web Audio) + đọc từ bằng giọng máy; nút tắt tiếng; tôn trọng giảm chuyển động; rung khi máy hỗ trợ.
- **FR-010** Giao diện theo khổ iPhone SE: không tràn ngang, vùng bấm ≥ 44 px, sáng / tối, chữ trong câu ≥ 17 px.
- **FR-011** Đo dùng thật: số ván, số câu, tỉ lệ đúng màn 2, số lần tra từ, ván bỏ dở; xem ở 💾 Dữ liệu → 🛠.

## Tiêu chí thành công

| Mã | Tiêu chí | Cách đo | Ngưỡng | Bắt buộc? |
|---|---|---|---|---|
| SC-001 | Người sáng lập thấy hấp dẫn hơn Chinh phục đề | Chơi 10 phút trên iPhone, trả lời có / không | Có | Có |
| SC-002 | Mỗi câu có đủ dữ liệu FR-004 | Máy kiểm khi dựng | 100% | Có |
| SC-003 | Câu thần chú ngắn | Máy đếm | ≤ 15 từ / câu | Có |
| SC-004 | Nhớ luật | Câu chưa gặp cùng luật, sau ≥ 1 ngày | ≥ 75% đúng màn 2 | Không (cần người thật) |
| SC-005 | Ván không quá dài | Thời gian 1 ván 10 câu | 2–5 phút | Có |
| SC-006 | Tiếp cận | Kiểm Chromium khổ iPhone SE sáng + tối | 0 lỗi tương phản, vùng bấm ≥ 44 px | Có |
| SC-007 | Không đụng luật đo | Test: thẻ CEFR, `S.to.mock`, bản đồ không đổi sau 1 ván | Không đổi | Có |
| SC-008 | Người học thật dùng | ≥ 2 người chơi ≥ 5 ván trong 1 quý (2/2027) | Đạt thì làm loại trò kế tiếp | Không |

Ngưỡng SC-004, SC-005, SC-008 là ý kiến của Claude.

## Phạm vi

- **Trong**: luật loại từ Part 5 (vị trí ghế + nhóm phân biệt cùng nhà).
- **Ngoài (đợt sau, chỉ khi SC-008 đạt)**: giới từ / liên từ, từ vựng, Part 6–7 (cần nhân vật / cơ chế khác).

## Giả định

- Nhân vật xưng hô "Ông / Anh / Cô / Bé" là cách nhân hoá, không gắn giới tính người học.
- Câu thần chú và câu "vì sao" do Claude soạn, chưa giáo viên kiểm (ghi nhãn như nội dung khác).
- Chưa kiểm trên iPhone cho tới khi người sáng lập thử máy thật (emoji / phông / rung trên iPhone khác Chromium; iPhone không hỗ trợ rung web).

## Rủi ro

- Học vẹt nhãn ("thấy her thì bấm Ông Chủ"): thần chú chỉ lên cấp ở câu chưa gặp.
- Dùng câu thật của đề → nhớ đáp án → điểm đề thử cao giả (rủi ro cũ của 018). Q2 quyết.
- Luật vị trí chỉ phủ ~1/3 câu Part 5 (dạng từ 30 / 198 kho); không cứu được câu từ vựng.

## Làm rõ (15/11/2026)

- Q1 Đặt ở đâu → C: mục riêng + lối chữa từ Chinh phục đề.
- Q2 Nguồn câu → C: kho riêng ~120 câu + câu thật người học từng sai.

## Bổ sung v179 (15/11/2026)

Người sáng lập chơi v178: "Khi làm đúng thì cần hoạt cảnh báo đúng sai để dễ nhận biết. Nên phân ra dễ thường khó tăng dần với những gợi ý để dễ thắng hơn chứ mau thua quá."

- **FR-012** 3 mức mở dần: Dễ (3 từ, chậm, 5 tim, chữ mốc tô sẵn, gợi ý không giới hạn) → Thường (4 từ có màu, 4 tim, 3 gợi ý) → Khó (áo xám nửa sau, nhanh, 3 tim, 1 gợi ý); thắng mức trước (còn tim, đúng ≥ 7 / 10) mới mở mức sau.
- **FR-013** 💡 Gợi ý 2 nấc (chữ mốc → cư dân của ghế); câu đúng nhờ gợi ý hẹn ôn ngày mai, không tăng cấp.
- **FR-014** Đúng 3 câu liền hồi 1 tim.
- **FR-015** Hoạt cảnh đúng / sai rõ trong sân chơi (chữ to, màu, sao bay / rung, từ đáp án sáng xanh); giảm chuyển động chỉ đổi màu.
- **SC-009** Người sáng lập thắng được mức Dễ ở ván đầu (chưa đo được, cần chơi trên iPhone).
