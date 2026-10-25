// 8 mục ngang hàng (người sáng lập 25/10/2026): 📚 Từ vựng · 🧱 Ngữ pháp · 👄 Phát âm · 🎧 Nghe · 🗣 Nói · 📰 Đọc · ✍️ Viết · 📖 Từ điển.
// Mỗi phần có mục tiêu riêng, không lẫn: một câu chỉ chấm cho một phần; Thi chuyển cấp của phần nào chỉ hỏi phần đó.
// Luật chung (người sáng lập chọn "dùng Nhớ như Từ vựng" cho cả kỹ năng): 📘 Học = học hết đơn vị của cấp; 🔁 Nhớ = mỗi mặt ≥ 80%
// (làm đúng ở ngày sau ngày học, lần gần nhất đúng, khả năng nhớ ≥ 90%); Học 100% + Nhớ ≥ 80% mở Thi chuyển cấp của phần.
// Kỹ năng: làm lại bài cũ thì đổi câu hỏi để đo kỹ năng, không đo nhớ bài (quyết định kỹ thuật).
// Các phần ngoài Từ vựng đang xây: màn này ghi mục tiêu (bản nháp, chưa chốt) + bài luyện có sẵn (chưa tính mục tiêu).
let BACK = null;   // bài luyện mở từ một phần: ← Về / Kiểu luyện khác quay lại phần đó
const goBack = () => (BACK || home)();   // bài luyện từ vựng quay về 📚 Từ vựng
const PARTS = {
  np: { ic: '🧱', t: 'Ngữ pháp', unit: 'điểm ngữ pháp', step: 4,
    dims: [['🔎 Nhận ra', 'Chọn câu đúng, dạng đúng'], ['✏️ Điền dạng', 'Tự gõ dạng đúng vào chỗ trống'], ['🛠 Sửa lỗi', 'Tìm và sửa chỗ sai trong câu']],
    exam: 'Câu mới cho mọi điểm ngữ pháp của cấp. Không chấm từ vựng, chính tả.', tasks: [] },
  pa: { ic: '👄', t: 'Phát âm', unit: 'bộ cặp âm', step: 3,   // đã xây: pa.js (partView chuyển sang paView)
    dims: [['👂 Phân biệt', 'Nghe cặp âm (ship / sheep), chọn đúng'], ['👄 Đọc đúng', 'Đọc từ chứa âm; bộ chấm âm ≥ 80']],
    exam: 'Từ, cặp âm, câu ngắn chưa gặp; máy chấm từng âm.',
    tasks: [['am', '🎯 Đọc từ (10 từ đã học)', 'Nhìn từ, nghe mẫu, đọc theo; điểm từng âm. Cần tải bộ chấm âm (miễn phí, vài trăm MB)']] },
  nghe: { ic: '🎧', t: 'Nghe', unit: 'bài nghe', step: 5, skill: true,
    dims: [['💡 Ý chính', 'Nghe bài, hiểu ý chính'], ['🔍 Chi tiết', 'Nghe ra số, tên, thời gian, nơi chốn'], ['✍️ Chép lại', 'Nghe rồi chép đúng câu']],
    exam: 'Bài nghe mới theo dạng Cambridge của cấp.',
    tasks: [['hear', '🎧 Nghe câu (8 câu)', 'Nghe câu, chọn nghĩa cả câu'], ['dict', '✍️ Nghe chép (5 câu)', 'Nghe rồi chép lại cả câu']] },
  noi: { ic: '🗣', t: 'Nói', unit: 'tình huống nói', step: 6, skill: true,
    dims: [['✅ Làm được việc', 'Máy chép lời có đủ ý cần nói (gọi món, hỏi đường, giới thiệu…)'], ['🗣 Nói rõ', 'Máy chép ra đúng phần lớn số từ']],
    exam: 'Tình huống mới; máy chấm "làm được việc".', tasks: [] },
  doc: { ic: '📰', t: 'Đọc', unit: 'bài đọc', step: 5, skill: true,
    dims: [['💡 Ý chính', 'Hiểu bài nói về gì'], ['🔍 Chi tiết', 'Tìm thông tin trong bài'], ['🧠 Suy luận', 'Hiểu điều bài không nói thẳng']],
    exam: 'Bài đọc mới theo dạng Cambridge của cấp.',
    tasks: [['read', '📰 Đọc bài', 'Đọc bài ngắn, trả lời câu hỏi (mở khi đã học ≥ 70% từ của bài)']] },
  viet: { ic: '✍️', t: 'Viết', unit: 'đề viết', step: 7, skill: true,
    dims: [['✅ Đủ ý', 'Viết đủ các ý đề yêu cầu'], ['📝 Đúng dạng bài', 'Đúng kiểu tin nhắn / email / truyện, đủ độ dài']],
    exam: 'Đề mới; chấm ý và dạng bài (A2: email ≥ 25 từ, truyện ≥ 35 từ).', tasks: [] },
};
function partView(id) {
  if (id === 'pa') return paView();   // 👄 Phát âm đã xây (pa.js)
  if (KIT[id]) return kView(id);   // 🧱 📰 🎧 🗣 ✍️ đã xây (kit.js + kparts.js)
  const P = PARTS[id]; if (!P) return home();
  BACK = () => partView(id); window.CUR = { view: 'phan-' + id };
  $app.innerHTML = `<div id="part" data-p="${id}"></div><h1>${P.ic} ${P.t}</h1>
    <p class="mute">Cấp: Pre-A1 ≈ Starters · A1 ≈ Movers · A2 ≈ Flyers / A2 Key. Đơn vị học: ${P.unit}.</p>
    <div class="box"><b>🚧 Đang xây (bước ${P.step} / 7)</b><p class="mute" style="margin:4px 0 0">Chưa có lộ trình và Thi chuyển cấp. Mục tiêu dưới đây là bản nháp, chưa chốt. Bài luyện bên dưới chỉ để luyện, chưa tính mục tiêu, không tính cho 📚 Từ vựng.</p></div>
    <div class="box"><b>🎯 Mục tiêu của phần ${P.t}</b>
      <p style="margin:6px 0"><b>📘 Học</b> = học hết ${P.unit} của cấp.</p>
      <p style="margin:6px 0"><b>🔁 Nhớ</b> = mỗi mặt ≥ ${GATE_MEM}%: làm đúng ở một ngày sau ngày học, lần gần nhất đúng, khả năng nhớ ≥ 90%.${P.skill ? ' Làm lại bài cũ thì đổi câu hỏi, để đo kỹ năng chứ không đo nhớ bài.' : ''}</p>
      <div class="dims">${P.dims.map(([l, d]) => `<div><div class="row"><span>${l}</span><span class="mute">—</span></div>${bar(0, GATE_MEM, 'var(--good)')}<div class="mute" style="font-size:12px">${d}</div></div>`).join('')}</div>
      <p style="margin:10px 0 0"><b>🚪 Thi chuyển cấp</b>: mở khi 📘 Học ${GATE_LEARN}% và 🔁 Nhớ ≥ ${GATE_MEM}%. ${P.exam}</p></div>
    ${P.tasks.length ? `<h2>Bài luyện có sẵn</h2>${P.tasks.map(([m, t, sub]) => `<button class="opt" data-m="${m}"><b>${t}</b><br><span style="font-size:14px;opacity:.85">${sub}</span></button>`).join('')}` : ''}`;
  $app.onclick = e => { const b = e.target.closest('[data-m]'); if (!b) return;
    if (!Object.keys(S.cards).length) return toast('Học vài unit 📚 Từ vựng trước để có từ cho bài luyện.');
    ({ read: readTask, hear: hearTask, dict: dictTask, am: () => noiTask('am') })[b.dataset.m](); };
  window.scrollTo(0, 0);
}

// ---------- 🎯 Tổng quan học (người sáng lập 25/10/2026: "gộp 7 mục trừ từ điển thành tổng quan học") ----------
// Thanh dưới còn 2 mục: 🎯 Học (màn này) · 📖 Từ điển. Mỗi phần mở từ đây, có "← Tổng quan" để quay lại. Chỉ hiển thị, không đổi luật đo của phần nào.
const OV = [['tv', '📚', 'Từ vựng'], ['pa', '👄', 'Phát âm'], ['np', '🧱', 'Ngữ pháp'], ['nghe', '🎧', 'Nghe'], ['noi', '🗣', 'Nói'], ['doc', '📰', 'Đọc'], ['viet', '✍️', 'Viết']];
const ovBack = '<div class="row top"><button class="link" data-ov="back">← Tổng quan</button><span></span></div>';
document.addEventListener('click', e => { if (e.target.closest('[data-ov="back"]')) { BACK = null; overview(); } });
// số liệu một phần: { lv, lq, mq, due, gate: 'pass' | 'open' | '' }; null khi chưa tải xong dữ liệu
function ovStat(id) { const now = Date.now();
  if (id === 'tv') { const lv = curLevel(), p = parts(S, now); return { lv, lq: p.lq, mq: p.mq, due: p.due, gate: passed(lv) ? 'pass' : gateOpen(p) ? 'open' : '' }; }
  if (id === 'pa') { if (!PA) return null; const lv = paLevel(), p = paParts(lv, now); return { lv, lq: p.lq, mq: p.mq, due: p.due, gate: paPassed(lv) ? 'pass' : p.lq >= GATE_LEARN && p.mq >= GATE_MEM ? 'open' : '' }; }
  const P = KIT[id]; if (!P.items) return null; const lv = kLv(P), p = kParts(P, lv, now);
  return { lv, lq: p.lq, mq: p.mq, due: p.due, gate: kPassed(P, lv) ? 'pass' : p.lq >= GATE_LEARN && p.mq >= GATE_MEM ? 'open' : '' }; }
function overview() { BACK = null; window.CUR = { view: 'tong-quan' };
  const st = OV.map(([id]) => ovStat(id)), wait = st.some(x => !x);
  if (wait) Promise.all([paLoad(), ...Object.values(KIT).map(kLoad)]).then(() => { if (document.getElementById('ov')) overview(); }).catch(() => {});
  // việc nên làm trước: phần có bài cần ôn nhiều nhất; không có thì phần 📘 Học thấp nhất
  const ok = OV.map((o, i) => [o, st[i]]).filter(([, s]) => s), due = ok.filter(([, s]) => s.due).sort((a, b) => b[1].due - a[1].due)[0], low = ok.filter(([, s]) => s.lq < 100).sort((a, b) => a[1].lq - b[1].lq)[0];
  const tip = due ? [due[0], `${due[1].due} bài cần ôn hôm nay`] : low ? [low[0], `📘 Học mới ${low[1].lq}%: học bài tiếp theo`] : null;
  $app.innerHTML = `<div id="ov"></div><h1>🎯 Tổng quan học</h1><p class="mute"><span id="sync">${esc(sync)}</span></p>
    ${tip ? `<button class="pri" data-ovp="${tip[0][0]}">▶ Nên làm: ${tip[0][1]} ${tip[0][2]} · ${tip[1]}</button>` : ''}
    ${OV.map(([id, ic, t], i) => { const s = st[i];
      return `<button class="box ovc" data-ovp="${id}" style="width:100%;text-align:left;display:block">
        <div class="row"><b style="font-size:18px">${ic} ${t}</b><span class="mute">${s ? `${LVN[s.lv]}${s.gate === 'pass' ? ' ✅' : s.gate === 'open' ? ' · 🚪 thi được' : ''}` : '…'} ›</span></div>
        ${s ? `<div class="dims" style="margin-top:4px"><div><div class="row"><span>📘 Học</span><span class="mute">${s.lq}%</span></div>${bar(s.lq, GATE_LEARN, 'var(--accent)')}</div>
          <div><div class="row"><span>🔁 Nhớ</span><span class="mute">${s.mq}%</span></div>${bar(s.mq, GATE_MEM, 'var(--good)')}</div></div>
          ${s.due ? `<p class="mute" style="margin:4px 0 0">${s.due} bài cần ôn</p>` : ''}` : '<p class="mute" style="margin:4px 0 0">Đang tải…</p>'}</button>`; }).join('')}
    <p class="mute">Mỗi phần có mục tiêu riêng: 📘 Học 100% và 🔁 Nhớ ≥ ${GATE_MEM}% mở 🚪 Thi chuyển cấp của phần đó. Một câu chỉ chấm cho một phần.</p>
    ${gyHomeHtml()}`;
  $app.onclick = e => { const b = e.target.closest('[data-ovp]'); if (!b) return; const id = b.dataset.ovp; scrollTo(0, 0); if (id === 'tv') home(); else partView(id); };
  setTimeout(maybeReload, 0); }
