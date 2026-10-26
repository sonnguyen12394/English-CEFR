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
// Người sáng lập 25/10/2026: "mỗi cấp học các mục không đều thì chia theo cấp cho rõ, để thế này lẫn lộn cấp độ".
// Màn tổng quan lấy CẤP làm khung: chọn cấp (Pre-A1 · A1 · A2 · A2+), mỗi cấp liệt kê các phần có bài ở cấp đó và số liệu của phần ở đúng cấp đó.
// Cấp đang học = cấp thấp nhất còn phần chưa qua Thi chuyển cấp. "Nên làm" chỉ gợi ý bài mới trong cấp đang học (ôn thì mọi cấp).
// Cấp sau xem trước và học trước được (không khoá cứng); luật đo của từng phần giữ nguyên.
const OV_LV = ['pre', 'a1', 'a2', 'a2p'];
let OV_SEL = null;
const ovLvs = id => id === 'tv' ? LEVELS : id === 'pa' ? PA_LV : KIT[id].lvs;
const ovIn = (id, lv) => ovLvs(id).includes(lv);
// số liệu một phần ở một cấp: { lq, mq, due, gate: 'pass' | 'open' | '' }; null khi chưa tải xong dữ liệu
function ovStat(id, lv) { const now = Date.now();
  if (id === 'tv') { const p = parts(S, now, lv); return { lq: p.lq, mq: p.mq, due: p.due, gate: passed(lv) ? 'pass' : lv === curLevel() && gateOpen(p) ? 'open' : '' }; }
  if (id === 'pa') { if (!PA) return null; const p = paParts(lv, now); return { lq: p.lq, mq: p.mq, due: p.due, gate: paPassed(lv) ? 'pass' : lv === paLevel() && p.lq >= GATE_LEARN && p.mq >= GATE_MEM ? 'open' : '' }; }
  const P = KIT[id]; if (!P.items) return null; const p = kParts(P, lv, now);
  return { lq: p.lq, mq: p.mq, due: p.due, gate: kPassed(P, lv) ? 'pass' : lv === kLv(P) && p.lq >= GATE_LEARN && p.mq >= GATE_MEM ? 'open' : '' }; }
const ovPassed = (id, lv) => id === 'tv' ? passed(lv) : id === 'pa' ? (PA ? paPassed(lv) : false) : (KIT[id].items ? kPassed(KIT[id], lv) : false);
const ovStage = () => OV_LV.find(lv => OV.some(([id]) => ovIn(id, lv) && !ovPassed(id, lv))) || OV_LV[OV_LV.length - 1];
function overview(sel) { BACK = null; window.CUR = { view: 'tong-quan' };
  const loaded = PA && Object.values(KIT).every(P => P.items);
  if (!loaded) Promise.all([paLoad(), ...Object.values(KIT).map(kLoad)]).then(() => { if (document.getElementById('ov')) overview(sel); }).catch(() => {});
  const stage = ovStage(); if (sel) OV_SEL = sel; const lv = OV_SEL && OV_LV.includes(OV_SEL) ? OV_SEL : stage;
  const ids = OV.filter(([id]) => ovIn(id, lv)), st = ids.map(([id]) => ovStat(id, lv)), done = ids.filter(([id]) => ovPassed(id, lv)).length;
  const absent = OV.filter(([id]) => !ovIn(id, lv)).map(([, ic, t]) => ic + ' ' + t);
  // Nên làm: bài cần ôn (mọi phần, cấp đang học của phần); không có thì bài mới của phần có 📘 Học thấp nhất trong cấp đang học
  const dueAll = loaded ? OV.map(([id, ic, t]) => { const l = id === 'tv' ? curLevel() : id === 'pa' ? paLevel() : kLv(KIT[id]); return [[id, ic, t], ovStat(id, l), l]; }).filter(([, s]) => s && s.due).sort((a, b) => b[1].due - a[1].due)[0] : null;
  const lowS = OV.filter(([id]) => ovIn(id, stage) && !ovPassed(id, stage)).map(o => [o, ovStat(o[0], stage)]).filter(([, s]) => s && s.lq < 100).sort((a, b) => a[1].lq - b[1].lq)[0];
  const tip = dueAll ? [dueAll[0], dueAll[2], `${dueAll[1].due} bài cần ôn hôm nay`] : lowS ? [lowS[0], stage, `📘 Học mới ${LVN[stage]} ${lowS[1].lq}%: học bài tiếp theo`] : null;
  const chip = l => { const has = OV.filter(([id]) => ovIn(id, l)), ok = has.length && has.every(([id]) => ovPassed(id, l)), cur = l === stage;
    return `<button class="chip ${l === lv ? 'on' : ''}" data-ovl="${l}">${ok ? '✅ ' : cur ? '▶ ' : OV_LV.indexOf(l) > OV_LV.indexOf(stage) ? '🔒 ' : ''}${LVN[l]}</button>`; };
  $app.innerHTML = `<div id="ov"></div><h1>🎯 Tổng quan học</h1><p class="mute"><span id="sync">${esc(sync)}</span></p>
    ${S.fake ? '<p class="mute" style="margin:4px 0">🧪 Đang dùng dữ liệu thử (💾 Sao lưu để quay lại dữ liệu thật).</p>' : ''}
    <p style="margin:6px 0">Cấp đang học: <b>${LVN[stage]}</b></p>
    ${tip ? `<button class="pri" data-ovp="${tip[0][0]}" data-ovpl="${tip[1]}">▶ Nên làm: ${tip[0][1]} ${tip[0][2]} · ${tip[2]}</button>` : ''}
    <div class="chips">${OV_LV.map(chip).join('')}</div>
    <div class="box"><div class="row"><b>Cấp ${LVN[lv]}: ${ids.length} phần</b><span class="mute">đã đạt ${done}/${ids.length}</span></div>${bar(Math.round(done / (ids.length || 1) * 100), 100, 'var(--good)')}
      <p class="mute" style="margin:6px 0 0">Đạt ${LVN[lv]} khi cả ${ids.length} phần dưới đây qua 🚪 Thi chuyển cấp ${LVN[lv]}. Mỗi phần: 📘 Học bài mới của cấp; 🔁 Nhớ và thi tính cả các cấp trước.${absent.length ? ` Cấp này chưa có: ${absent.join(', ')}.` : ''}</p>
      ${OV_LV.indexOf(lv) > OV_LV.indexOf(stage) ? `<p class="mute" style="margin:6px 0 0">🔒 Xem trước: nên học khi đã đạt ${LVN[stage]}. Vẫn mở để học trước nếu muốn.</p>` : ''}</div>
    ${ids.map(([id, ic, t], i) => { const s = st[i];
      return `<button class="box ovc" data-ovp="${id}" data-ovpl="${lv}" style="width:100%;text-align:left;display:block">
        <div class="row"><b style="font-size:18px">${ic} ${t}</b><span class="mute">${s ? (s.gate === 'pass' ? '✅ đã đạt' : s.gate === 'open' ? '🚪 thi được' : '') : '…'} ›</span></div>
        ${s ? `<div class="dims" style="margin-top:4px"><div><div class="row"><span>📘 Học</span><span class="mute">${s.lq}%</span></div>${bar(s.lq, GATE_LEARN, 'var(--accent)')}</div>
          <div><div class="row"><span>🔁 Nhớ</span><span class="mute">${s.mq}%</span></div>${bar(s.mq, GATE_MEM, 'var(--good)')}</div></div>
          ${s.due ? `<p class="mute" style="margin:4px 0 0">${s.due} bài cần ôn</p>` : ''}` : '<p class="mute" style="margin:4px 0 0">Đang tải…</p>'}</button>`; }).join('')}
    <p class="mute">Một câu chỉ chấm cho một phần. 📘 Học 100% và 🔁 Nhớ ≥ ${GATE_MEM}% mở 🚪 Thi chuyển cấp của phần đó.</p>
    ${gyHomeHtml()}`;
  $app.onclick = e => { const c = e.target.closest('[data-ovl]'); if (c) return overview(c.dataset.ovl);
    const b = e.target.closest('[data-ovp]'); if (!b) return; const id = b.dataset.ovp, l = b.dataset.ovpl; scrollTo(0, 0);
    if (id === 'tv') { HOME.lv = l; HOME.open = null; return home(); }
    if (id === 'pa') PA_VIEW = l; else if (KIT[id]) KIT[id].view = l;
    partView(id); };
  setTimeout(maybeReload, 0); }

// ---------- 🔁 Nhớ dạng danh sách yêu cầu Pre-A1 → C2 cho 6 phần (người sáng lập 26/10/2026: "làm tương tự với 6 phần kia") ----------
// Chỉ hiển thị. Dòng có khoá [l, k] = mặt đang đo (giữ nguyên luật đo, bấm xem được); dòng [l] = yêu cầu dự kiến, chưa có bài, không tính.
// Mặt đang đo đặt ở cấp nó bắt đầu được đo; yêu cầu dự kiến chia theo khung CEFR / Cambridge (Starters, Movers, A2 Key…) là đề xuất, chưa có nguồn chính thức theo từng dòng.
const RQ_LV = [['pre', 'Pre-A1'], ['a1', 'A1'], ['a2', 'A2'], ['b1', 'B1'], ['b2', 'B2'], ['c1', 'C1'], ['c2', 'C2']];
const RQ = {
  pa: { pre: [['👂 Phân biệt cặp âm', 'pb'], ['👄 Đọc đúng âm', 'doc'], ['🔤 Nhìn chữ đoán cách đọc'], ['🔚 Đọc ra âm cuối']],
    a1: [['🎵 Nhận ra trọng âm'], ['🔁 Đọc đúng đuôi -s / -ed'], ['🧩 Đọc cụm phụ âm (street, desk)']],
    a2: [['🌊 Nghe ra nối âm, dạng đọc nhẹ'], ['❓ Nhận ra ngữ điệu lên / xuống'], ['📏 Đọc rõ cả câu ngắn']],
    b1: [['🎵 Tự nói đúng trọng âm từ'], ['💬 Nhấn từ quan trọng trong câu'], ['🔗 Tự nối âm khi nói']],
    b2: [['🎭 Ngữ điệu thể hiện thái độ'], ['🌍 Nghe hiểu nhiều giọng (Anh, Mỹ, Úc)']], c1: [['🗣 Nói dễ hiểu với người bản xứ, ít lỗi âm']], c2: [['🎨 Dùng nhấn và ngữ điệu để đổi sắc thái']] },
  np: { pre: [['🔎 Nhận ra', 'nhan'], ['✏️ Điền dạng', 'dien'], ['🛠 Sửa lỗi', 'sua'], ['🔀 Xếp từ thành câu'], ['❓ Đổi sang câu hỏi / phủ định']],
    a1: [['⏱ Chọn thì theo dấu hiệu'], ['🔗 Nối câu bằng and, but, because']],
    a2: [['🧩 Điền từ chức năng vào đoạn'], ['🔄 Viết lại câu cùng nghĩa'], ['✍️ Tự đặt câu dùng điểm ngữ pháp']],
    b1: [['🔀 Câu phức (quan hệ, điều kiện)'], ['💬 Câu tường thuật'], ['🔁 Câu bị động']],
    b2: [['🧠 Chọn thì theo ý nghĩa'], ['🔗 Liên kết đoạn văn']], c1: [['🎚 Cấu trúc nhấn mạnh, đảo ngữ']], c2: [['🎨 Dùng ngữ pháp linh hoạt, gần như không lỗi']] },
  nghe: { pre: [['🔊 Nghe từ, chọn hình'], ['🔢 Nghe số, tên đánh vần, màu'], ['📍 Nghe vị trí (in, on, under)'], ['✅ Nghe câu, đúng / sai với tranh']],
    a1: [['💡 Ý chính', 'y'], ['🔍 Chi tiết', 'ct'], ['✍️ Chép lại', 'chep']],
    a2: [['💬 Hội thoại: ai nói gì'], ['📝 Nghe điền phiếu ghi chú'], ['🔄 Nhận ra cách nói khác']],
    b1: [['📻 Bài dài (thông báo, radio): ý chính'], ['🎯 Nhận ra ý kiến, thái độ']],
    b2: [['🌍 Nhiều giọng, tốc độ thường'], ['🧭 Suy ra ý không nói thẳng']], c1: [['🎬 Phim, bài giảng tự nhiên']], c2: [['⚡ Mọi lời nói ở tốc độ bản xứ']] },
  doc: { pre: [['🔤 Nối từ với hình'], ['✅ Câu đúng / sai với tranh'], ['🙋 Đọc câu hỏi, trả lời yes / no'], ['🧩 Điền từ có hình gợi ý']],
    a1: [['💡 Ý chính', 'y'], ['🔍 Chi tiết', 'ct'], ['📋 Biển báo, tin nhắn ngắn']],
    a2: [['🔄 Nhận ra cách nói khác'], ['🧭 Đoán nghĩa từ lạ qua ngữ cảnh'], ['🔗 Hiểu it, they, this chỉ cái gì']],
    b1: [['📖 Bài dài 300–500 từ'], ['🎯 Nhận ra ý kiến người viết']],
    b2: [['🧠 Suy luận, giọng văn'], ['⏱ Đọc lướt tìm ý nhanh']], c1: [['📚 Văn bản dài, chuyên môn']], c2: [['🎨 Văn chương, ẩn ý, chơi chữ']] },
  noi: { pre: [['🗣 Nói rõ từ, cụm từ'], ['🙋 Trả lời về bản thân 1–3 từ'], ['🖼 Nói câu ngắn về tranh'], ['👋 Chào hỏi xã giao']],
    a1: [['✅ Đủ ý', 'viec'], ['🗣 Nói rõ', 'ro'], ['💬 Giao tiếp', 'gt'], ['🔗 Nối ý bằng and, but, because']],
    a2: [['📖 Kể việc đã xảy ra'], ['💭 Nêu ý kiến kèm lý do'], ['🙋 Tự đặt câu hỏi']],
    b1: [['🗺 Kể chuyện mạch lạc'], ['🧩 Xử lý tình huống bất ngờ']],
    b2: [['🗣 Nói trôi chảy 1–2 phút'], ['⚖️ Tranh luận ưu / nhược']], c1: [['🎤 Trình bày chủ đề phức tạp']], c2: [['🎨 Diễn đạt sắc thái tinh tế']] },
  viet: { pre: [['✍️ Chép đúng từ, câu'], ['📝 Điền phiếu thông tin cá nhân'], ['🖼 Viết 1 từ cho tranh']],
    a1: [['✅ Đủ ý', 'y'], ['📝 Đúng dạng bài', 'dang'], ['🔠 Câu đúng cơ bản (hoa, chấm, động từ)']],
    a2: [['🔗 Dùng từ nối'], ['📖 Viết chuyện theo 3 tranh'], ['🎯 Đúng việc: mời, xin lỗi, cảm ơn']],
    b1: [['✉️ Thư kể và giải thích'], ['📄 Đoạn văn có ý chính, ý phụ']],
    b2: [['⚖️ Bài luận nêu ý kiến'], ['🎚 Đúng văn phong trang trọng / thân mật']], c1: [['📚 Bài dài, lập luận chặt']], c2: [['🎨 Văn phong tự nhiên như người bản xứ']] },
};
// cell(k) = ô của mặt đang đo (có %, bấm được)
function rqList(id, lv, cell) {
  const i0 = RQ_LV.findIndex(x => x[0] === lv), Q = RQ[id];
  return `<div class="dlist">${RQ_LV.map(([L, name], i) => { const rs = Q[L] || [], on = i <= i0, has = LEVELS.includes(L);
    return rs.length ? `<div class="dlv ${on ? '' : 'lock'}">${on ? '' : '🔒 '}${i ? `${name}: thêm ${rs.length}` : name}${on ? '' : has ? ` · mở khi lên ${name}` : ' · chưa có bài'}</div>${rs.map(([l, k]) => on && k ? cell(k)
      : `<div class="dimx"><span>${l}</span>${on ? '<span style="font-size:12px">chưa có bài</span>' : ''}</div>`).join('')}` : ''; }).join('')}</div>
    <p class="mute" style="margin:4px 0 0;font-size:12px">Dòng mờ "chưa có bài" là yêu cầu dự kiến: chưa có bài, chưa tính 🔁 Nhớ.</p>`; }
