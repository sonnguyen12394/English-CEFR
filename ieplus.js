// 🌏 Học IELTS, phần thêm (v70, 28/10/2026, người sáng lập: "sáng tạo hoặc tinh chỉnh thêm nhiều chức năng làm cho phần học IELTS trở nên giá trị").
//   📅 Ngày thi + kế hoạch tuần + ▶ Nên làm hôm nay (theo khoảng cách band từng kỹ năng, Sổ lỗi đến hạn, lịch đề thử / đề thật)
//   📘 Cách làm từng dạng bài (chiến lược, cấu trúc bài; theo đề thật và band descriptors công khai)
//   📤 Gửi bài cho giáo viên chấm (bảng chia sẻ của iPhone) · 📥 dán lỗi giáo viên sửa vào 📒 Sổ lỗi, ghi band giáo viên (hiệu chuẩn Viết)
// Không tính vào luật đo CEFR.

// ---------- 📘 Cách làm từng dạng ----------
const IE_HOW = {
  listen: ['🎧 Nghe', ['Dùng thời gian trước mỗi phần để đọc câu hỏi, gạch từ khoá, đoán loại thông tin cần điền (số, tên, ngày, danh từ…).', 'Câu hỏi theo đúng thứ tự bài nghe. Lỡ một câu thì bỏ qua, theo câu sau.',
    'Cẩn thận bẫy sửa lời: người nói hay nói một đáp án rồi đổi ("Tuesday… no, actually Wednesday").', 'Chính tả và số ít / số nhiều phải đúng mới được điểm. Mỗi bài chỉ nghe một lần.']],
  tf: ['⚖️ TRUE / FALSE / NOT GIVEN', ['Gạch từ khoá trong câu hỏi (tên riêng, số, từ khó bị thay bằng từ đồng nghĩa). Câu hỏi đi theo thứ tự bài.', 'Tìm chỗ bài nói về ý đó, đọc kỹ 2–3 câu quanh đó.',
    'FALSE = bài nói NGƯỢC lại. NOT GIVEN = bài không đủ thông tin để nói đúng hay sai.', 'Cảnh giác từ tuyệt đối (always, all, only, never, most) và so sánh: hay dẫn tới FALSE hoặc NOT GIVEN.', 'Chỉ dựa vào bài, không dùng hiểu biết riêng.']],
  h: ['🧭 Chọn tiêu đề đoạn', ['Đọc câu đầu và câu cuối của đoạn: ý chính thường ở đó.', 'Tiêu đề là ý của CẢ đoạn, không phải một chi tiết.', 'Bẫy: tiêu đề có từ trùng với đoạn nhưng nói ý khác.', 'Làm đoạn dễ trước, loại dần tiêu đề đã dùng.']],
  comp: ['✏️ Điền từ', ['Xem giới hạn số từ (NO MORE THAN TWO WORDS): viết thừa là sai.', 'Đoán loại từ cần điền: danh từ, số, tính từ…', 'Chép đúng từ trong bài, đúng chính tả.']],
  time: ['⏱ Quản lý giờ Đọc', ['60 phút cho 3 bài, khoảng 20 phút mỗi bài; bài 3 thường khó nhất.', 'Một câu quá 1,5 phút thì đoán, đánh dấu, quay lại sau.', 'Đọc thi trên giấy không có thêm giờ chép đáp án: ghi đáp án ngay khi làm.']],
  t1: ['📊 Writing Task 1 (Academic)', ['4 đoạn: câu mở viết lại đề bằng lời mình → tổng quan (2 nét chính, không số liệu) → 2 đoạn chi tiết có số liệu và so sánh.', 'Thiếu đoạn tổng quan thì khó qua band 5 ở tiêu chí Task Achievement (theo band descriptors).',
    'Không nêu ý kiến riêng, không giải thích nguyên nhân không có trong biểu đồ.', '~170 từ trong 20 phút. Chép nguyên câu đề không được tính vào số từ.']],
  gt1: ['✉️ Writing Task 1 (General Training)', ['Viết đủ cả 3 ý gạch đầu dòng, mỗi ý một đoạn.', 'Đúng giọng: người lạ → trang trọng (Dear Sir or Madam … Yours faithfully); người quen công việc → Yours sincerely; bạn bè → thân mật.', 'Câu đầu nói ngay lý do viết thư. ~160 từ trong 20 phút.']],
  t2: ['📝 Writing Task 2', ['40 phút: 5 phút lập dàn ý, 30 phút viết, 5 phút soát lỗi. Task 2 tính gấp đôi Task 1.', '4–5 đoạn: mở bài (viết lại đề + nêu quan điểm) → 2 đoạn thân (mỗi đoạn một ý chính + giải thích + ví dụ) → kết luận nhắc lại quan điểm.',
    'Trả lời ĐỦ mọi phần đề hỏi (vd. "discuss both views AND give your opinion").', 'Ít nhất 250 từ; chép nguyên câu đề không được tính.']],
  p2: ['🗣 Speaking Part 2', ['1 phút chuẩn bị: ghi từ khoá cho 4 ý gợi ý, không viết câu.', 'Nói đủ 2 phút: kể theo thời gian (quá khứ), thêm cảm xúc, lý do, chi tiết cụ thể.', 'Bí ý: kể thêm một ví dụ, hoặc so sánh với hiện tại.']],
  p13: ['🗣 Speaking Part 1 và 3', ['Part 1: trả lời 2–3 câu (trả lời + lý do + ví dụ), không trả lời một từ.', 'Part 3: nêu ý kiến → giải thích → ví dụ → nhìn mặt kia ("On the other hand…").', 'Không học thuộc bài mẫu: giám khảo nhận ra và trừ điểm.']] };
const ieHow = ks => `<details style="margin-top:6px"><summary>📘 Cách làm</summary>${ks.map(k => `<p style="margin:8px 0 2px"><b>${IE_HOW[k][0]}</b></p>${IE_HOW[k][1].map(s => `<p style="margin:2px 0;font-size:15px">• ${esc(s)}</p>`).join('')}`).join('')}</details>`;

// ---------- 📅 Ngày thi, kế hoạch tuần, nên làm hôm nay ----------
// Kinh nghiệm thường gặp (KHÔNG phải số chính thức của IELTS): tăng 0,5 band cần khoảng 6–12 tuần học đều.
const IE_WK = [6, 12];
const IE_SK = { L: ['🎧', 'Nghe'], R: ['📖', 'Đọc'], W: ['✍️', 'Viết'], S: ['🗣', 'Nói'] };
function iePlan() { const o = ieSt(), tg = o.target, now = ieNow(), hpw = o.hpw || 6, gap = k => now.b[k] == null ? null : tg - now.b[k];
  // giờ mỗi tuần chia theo khoảng cách band; chưa có số đo thì coi như cách 1 band; Viết, Nói (kỹ năng sản sinh) nặng hơn một chút
  const w = Object.fromEntries(Object.keys(IE_SK).map(k => { const g = gap(k); return [k, Math.max(0.5, (g == null ? 1 : g) + 0.5) * (k === 'W' || k === 'S' ? 1.2 : 1)]; })), sw = Object.values(w).reduce((s, x) => s + x, 0);
  const hrs = Object.fromEntries(Object.keys(w).map(k => [k, Math.max(0.5, Math.round(hpw * w[k] / sw * 2) / 2)]));
  const wk = o.date ? Math.max(0, Math.ceil((new Date(o.date + 'T12:00:00') - Date.now()) / (7 * 864e5))) : null, g = now.all != null ? tg - now.all : null;
  const need = g != null && g > 0 ? [Math.ceil(g / 0.5) * IE_WK[0], Math.ceil(g / 0.5) * IE_WK[1]] : null;
  return { hrs, hpw, wk, g, need, gap }; }
// việc nên làm hôm nay: Sổ lỗi đến hạn → đề thử (14 ngày chưa làm) → kỹ năng cách mục tiêu xa nhất (chưa đo thì đo trước)
function ieToday() { const o = ieSt(), P = iePlan(), lastMk = (o.mock[o.mock.length - 1] || {}).at || 0, prac = Object.keys(o.r).length + o.w.length + o.s.length;
  if (typeof errDue === 'function' && errDue().length) return [`data-err="ie"`, `📒 Sửa ${Math.min(10, errDue().length)} lỗi đến hạn trong Sổ lỗi`];
  if (typeof imFocus === 'function') { const d = dayOf(Date.now()), w = imFocus().act.find(w => w.td !== d); if (w) return [`data-im="fix|${w.u}"`, `🗺 Chữa chỗ yếu: ${IM_SK[w.sk].split(' ')[0]} ${w.t}`]; }   // v86: bản đồ band cấp việc cho ô Hôm nay
  if (prac >= 5 && Date.now() - lastMk > 14 * 864e5) return [`data-iemk="all"`, '🎓 Làm một đề thử đủ 4 kỹ năng (2 tuần chưa làm)'];
  const ks = Object.keys(IE_SK).sort((a, b) => (P.gap(b) == null ? 99 : P.gap(b)) - (P.gap(a) == null ? 99 : P.gap(a))), k = ks[0], [t1] = ieT1(), lastW = o.w[o.w.length - 1];
  const act = { L: `data-iel="${Math.random() < 0.5 ? 'form' : 'mc'}"`, R: 'data-ier="all"', W: `data-iew="${lastW && lastW.task === 't2' ? t1 : 't2'}"`, S: `data-ies="${SREC ? 'all' : 'p1'}"` }[k];
  return [act, `${IE_SK[k][0]} Luyện ${IE_SK[k][1]}${P.gap(k) == null ? ' (chưa có số đo)' : P.gap(k) > 0 ? ` (cách mục tiêu ${bandTxt(P.gap(k))} band)` : ''}`]; }
function iePlanBox() { const o = ieSt(), P = iePlan(), [act, lab] = ieToday();
  const warn = P.wk != null && P.need && P.wk < P.need[0] ? `<p style="margin:6px 0 0">⚠️ Còn ${P.wk} tuần, cần tăng ${bandTxt(P.g)} band. Kinh nghiệm thường gặp (không phải số chính thức): mỗi 0,5 band cần khoảng ${IE_WK[0]}–${IE_WK[1]} tuần học đều, tức ${P.need[0]}–${P.need[1]} tuần. Cân nhắc lùi ngày thi, tăng giờ học, hoặc hạ mục tiêu.</p>` : '';
  return `<div class="box"><b>📅 Hôm nay & kế hoạch</b>
    <div class="row" style="margin-top:6px;gap:8px"><label class="mute" style="font-size:14px">Ngày thi<input type="date" id="iedate" value="${esc(o.date || '')}" style="margin:2px 0"></label>
      <label class="mute" style="font-size:14px">Giờ học / tuần<input type="number" id="iehpw" min="1" max="40" value="${P.hpw}" style="margin:2px 0"></label></div>
    ${P.wk != null ? `<p style="margin:6px 0 0">Còn <b>${P.wk} tuần</b>${P.g != null ? ` · cách mục tiêu <b>${bandTxt(Math.max(0, P.g))}</b> band (Overall)` : ''}.</p>` : '<p class="mute" style="margin:6px 0 0">Chọn ngày thi để app tính số tuần còn lại.</p>'}${warn}
    <p style="margin:8px 0 2px"><b>Mỗi tuần (${P.hpw} giờ):</b> ${Object.entries(P.hrs).map(([k, h]) => `${IE_SK[k][0]} ${h} giờ`).join(' · ')}</p>
    <p class="mute" style="margin:2px 0 0">Chia theo khoảng cách band từng kỹ năng; Viết / Nói nặng hơn. Mỗi ngày: Sổ lỗi đến hạn. Mỗi 2 tuần: 1 đề thử app. Mỗi 4 tuần: 1 đề thật (sách Cambridge IELTS) để hiệu chỉnh band.</p>
    <button class="pri" ${act} style="margin-top:8px">▶ Nên làm hôm nay: ${esc(lab)}</button></div>`; }
document.addEventListener('change', e => { if (!S || !e.target.closest('#iedate, #iehpw')) return; const o = ieSt();
  if (e.target.id === 'iedate') o.date = e.target.value || null; else { const h = parseInt(e.target.value, 10); if (h >= 1 && h <= 40) o.hpw = h; }
  S.t = Date.now(); save(); ieltsView(); });

// ---------- 📤 gửi giáo viên · 📥 dán lỗi giáo viên sửa ----------
const IE_SH = {}; let IE_SHN = 0;
function ieShareBtn(title, prompt, text) { const k = 's' + (++IE_SHN); IE_SH[k] = `Nhờ thầy / cô chấm giúp em bài ${title}.\n\nĐỀ:\n${prompt}\n\nBÀI CỦA EM:\n${text}\n\n` +
  'Xin thầy / cô cho band 4 tiêu chí và ghi mỗi lỗi một dòng theo dạng:\ncâu sai => câu đúng | lý do\n(để em dán vào Sổ lỗi ôn lại). Em cảm ơn ạ.';
  return `<button class="chip" data-ieshare="${k}">📤 Gửi giáo viên chấm</button>`; }
document.addEventListener('click', async e => { const b = e.target.closest('[data-ieshare]'); if (!b) return; const t = IE_SH[b.dataset.ieshare]; if (!t) return;
  try { if (navigator.share) { await navigator.share({ text: t }); return; } } catch (er) { if (er && er.name === 'AbortError') return; }
  try { await navigator.clipboard.writeText(t); toast('Đã chép bài. Dán vào Zalo / Messenger / email gửi giáo viên.'); } catch (er) { prompt('Chép đoạn này gửi giáo viên:', t); } });
// dòng "câu sai => câu đúng | lý do" (cũng nhận →, ->)
const errParse = s => String(s).split(/\n+/).map(l => l.trim()).filter(Boolean).map(l => { const m = l.split(/\s*(?:=>|→|->)\s*/); if (m.length < 2) return null; const [c, ...why] = m.slice(1).join(' ').split('|');
  return { wrong: m[0].replace(/^[-•*\d.)\s]+/, '').replace(/^["“]|["”]$/g, ''), correct: c.trim().replace(/^["“]|["”]$/g, ''), why_vi: why.join('|').trim() }; }).filter(x => x && x.wrong && x.correct);
function errPaste(back) { const home = () => back === 'ie' ? ieltsView() : overview(); window.CUR = { view: 'so-loi-dan' };
  $app.innerHTML = `<div class="row top"><button class="link" data-a="back">← Thôi</button><span class="uname">📥 Lỗi giáo viên sửa</span></div>
    <p class="mute">Dán phần giáo viên sửa, mỗi lỗi một dòng: <b>câu sai =&gt; câu đúng | lý do</b> (lý do không bắt buộc; nhận cả → hoặc -&gt;).</p>
    <textarea id="ept" rows="10" spellcheck="false" aria-label="Lỗi giáo viên sửa" placeholder="I am agree => I agree | agree là động từ"></textarea>
    <label class="mute" style="font-size:14px">Band Viết giáo viên chấm (nếu có, vd. 6.5)<input id="epb" inputmode="decimal" autocomplete="off"></label>
    <button class="pri" data-a="ok">📒 Thêm vào Sổ lỗi</button>`;
  $app.onclick = e => { if (e.target.closest('[data-a="back"]')) return home(); if (!e.target.closest('[data-a="ok"]')) return;
    const es = errParse(document.getElementById('ept').value), bv = String(document.getElementById('epb').value).replace(',', '.').trim(), band = bv ? parseFloat(bv) : null;
    if (band != null && !(band >= 0 && band <= 9 && band * 2 === Math.round(band * 2))) return toast('Band 0–9, bước 0,5.');
    if (!es.length && band == null) return toast('Chưa đọc được dòng nào dạng "câu sai => câu đúng".');
    const r = errAdd(es, 'gv'); if (band != null) { ieSt().tw.push({ at: Date.now(), band }); S.t = Date.now(); save(); }
    toast(`Đã thêm ${r.n} lỗi${r.rep ? `, ${r.rep} lỗi lặp lại` : ''}${band != null ? ', ghi band ' + bandTxt(band) : ''}.`); home(); }; }
document.addEventListener('click', e => { const b = e.target.closest('[data-errp]'); if (b && S) { scrollTo(0, 0); errPaste(b.dataset.errp); } });
