// 8 mục ngang hàng (người sáng lập 25/10/2026): 📚 Từ vựng · 🧱 Ngữ pháp · 👄 Phát âm · 🎧 Nghe · 🗣 Nói · 📰 Đọc · ✍️ Viết · 📖 Từ điển.
// Mỗi phần có mục tiêu riêng; Thi chuyển cấp của phần nào chỉ hỏi phần đó. v76: câu luyện Đọc / Nghe / Ngữ pháp đúng cộng thêm ôn nghĩa cho từ đã học trong câu (nhanh.js).
// Luật chung (người sáng lập chọn "dùng Nhớ như Từ vựng" cho cả kỹ năng): 📘 Học = học hết đơn vị của cấp; 🔁 Nhớ = mỗi mặt ≥ 80%
// (làm đúng ở ngày sau ngày học, lần gần nhất đúng, khả năng nhớ ≥ 80%); Học 100% + Nhớ ≥ 80% mở Thi chuyển cấp của phần.
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
      <p style="margin:6px 0"><b>📘 Học</b> = học ≥ ${GATE_LEARN}% ${P.unit} của cấp.</p>
      <p style="margin:6px 0"><b>🔁 Nhớ</b> = mỗi mặt ≥ ${GATE_MEM}%: làm đúng ở một ngày sau ngày học, lần gần nhất đúng, khả năng nhớ ≥ 80%.${P.skill ? ' Làm lại bài cũ thì đổi câu hỏi, để đo kỹ năng chứ không đo nhớ bài.' : ''}</p>
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
const ovBack = '<div class="row top"><button class="link" data-ov="back">‹ Học</button><span></span></div>';
document.addEventListener('click', e => { if (e.target.closest('[data-ov="back"]')) { BACK = null; overview(); } });
// ---------- v118 khuôn màn phần 3 tầng (người sáng lập 2/11/2026: "sắp xếp lại phần học cho trực quan… nhiều chức năng rối mắt"; chọn "một khuôn 3 tầng") ----------
// Cả 7 màn (Từ vựng `home`, Phát âm `paView`, 5 phần `kView`) cùng một khuôn. Tầng 1: tên · cấp, đường 3 bước ① Học bài → ② Ôn cho nhớ → ③ Thi lên cấp
// (thay 2 thanh % và ô thi), 2 nút lớn 📘 Bài học · 🏋️ Bài tập. Tầng 2: danh sách bài của cấp đang xem, trạng thái ghi bằng chữ (không cần chú thích ký hiệu),
// cấp khác gập. Tầng 3: "Thêm" gập (luyện thêm, nhớ từng mặt, bài thi, cách học, cài đặt). KHÔNG đổi luật đo: ✓ theo đúng GATE_LEARN / GATE_MEM / kết quả thi.
// o = { t1: tên bước 1 (mặc định 'Học bài'; Đọc / Nghe 'Làm bài'), learn: [đã học, tổng], unit: 'bài' | 'từ' | 'bộ', lq, mq, need: số bài còn thiếu tới GATE_LEARN, ex: { k: 'lock' | 'open' | 're' | 'done' | 'wait' | 'cho', btn (html nút khi mở), v, sub } }
function steps3(o) { const s1 = o.lq >= GATE_LEARN, s2 = o.mq >= GATE_MEM, e = o.ex;
  const st = (ok, cur, n, t, v, sub, cls = '') => `<div class="st3 ${ok ? 'ok' : cur ? 'cur' : ''} ${cls}"><i>${ok ? '✓' : n}</i><b>${t}</b><span class="v">${v}</span><span class="s">${sub}</span></div>`;
  return `<div class="steps3">${st(s1, !s1, '1', o.t1 || 'Học bài', `${o.learn[0]}/${o.learn[1]}`, s1 ? 'đủ' : `còn ${o.need} ${o.unit}`)}${st(s2, s1 && !s2, '2', 'Ôn cho nhớ', `${o.mq}%`, s2 ? 'đủ' : `cần ${GATE_MEM}%`)}${e.k === 'open' || e.k === 're'
    ? `<div class="st3 open"><i>3</i><b>Thi lên cấp</b>${e.btn}</div>` : st(e.k === 'done', false, e.k === 'lock' ? '🔒' : '3', 'Thi lên cấp', e.v || '', e.sub || '', e.k === 'lock' ? 'lock' : '')}</div>`; }
// v134 (bản mẫu "Đề xuất · Từ vựng B1"; người sáng lập "nhìn vào là hiểu"): đầu màn kỹ năng của 🧱 Nền = MỘT câu cách học + ô tiến độ (đã học a / b + thanh + một dòng nhớ)
//   + MỘT nút chính ghi rõ sẽ mở gì ("▶ Học bài 4 · 8 từ") + một nút phụ (ôn / làm bài tập). Ô bài thi lên cấp ở cuối danh sách nói khi nào mở. Thay đường 3 bước + 2 nút của v118.
//   Luật đo không đổi: 📘 Học / 🔁 Nhớ / Thi chuyển cấp như cũ, chỉ cách hiện.
const P_INTRO = { tv: 'Mỗi bài 8 từ: học trước, làm bài tập sau. App nhắc ôn đúng lúc để bạn nhớ lâu.', pa: 'Mỗi bộ một cặp âm dễ nhầm: nghe phân biệt, rồi đọc to cho máy chấm.',
  np: 'Mỗi bài một điểm ngữ pháp: đọc giải thích và ví dụ, rồi làm bài tập. App nhắc ôn đúng lúc.', nghe: 'Mỗi bài một đoạn nghe: nghe và trả lời trước, xem lời và chỗ sai sau. App chỉ chấm lần đầu nghe bài.',
  doc: 'Mỗi bài một bài đọc: đọc và trả lời trước, xem lại sau. App chỉ chấm lần đầu đọc bài.', noi: 'Mỗi đề một tình huống: nghe câu hỏi rồi nói trả lời. Máy chép lời để chấm.', viet: 'Xếp từ thành câu, nối câu cho đúng, rồi viết đoạn theo đề.' };
// o = { intro, prog, pct, mem, pri: { attr, t, sub }, sec: { attr, t, sub } | null }
const pTop = o => `<p class="mute" style="margin:0 0 10px;font-size:15px">${o.intro}</p>
  <div class="box" style="margin:0 0 10px;padding:12px 14px"><div class="row"><b>${o.prog}</b><span class="mute">${Math.min(100, o.pct)}%</span></div>${bar(Math.min(100, o.pct), 100, 'var(--accent)')}${o.mem ? `<p class="mute" style="margin:6px 0 0;font-size:14px">${o.mem}</p>` : ''}</div>
  ${o.pri ? `<button class="btnbig" ${o.pri.attr}>${o.pri.t}${o.pri.sub ? `<small>${o.pri.sub}</small>` : ''}</button>` : ''}
  ${o.sec ? `<button class="btnbig ghost" ${o.sec.attr} style="font-size:17px">${o.sec.t}${o.sec.sub ? `<small>${o.sec.sub}</small>` : ''}</button>` : ''}`;
// e = { k: 'lock' | 'open' | 'done' | 'wait', t: tên bài thi, sub, now: số hiện tại, btn }
const pExam = e => `<div class="box examc ${e.k}"><span class="ic" aria-hidden="true">${e.k === 'lock' ? '🔒' : e.k === 'done' ? '✅' : e.k === 'wait' ? '⏳' : '🚪'}</span><div style="flex:1;min-width:0"><b>${e.t}</b><p style="margin:2px 0 0;font-size:15px">${e.sub}</p>${e.now ? `<p class="mute" style="margin:2px 0 0;font-size:14px">${e.now}</p>` : ''}${e.btn || ''}</div></div>`;
const pExamT = (lvs, lv, t) => { const nx = lvs[lvs.indexOf(lv) + 1]; return nx ? `Bài thi lên ${LVN[nx]}` : `Bài thi ${t} ${LVN[lv]}`; };
const pLock = (p, u) => ({ k: 'lock', sub: `Mở khi học ${GATE_LEARN}% số ${u} và nhớ ${GATE_MEM}%.`, now: `Hiện: học ${p.lq}%${p.learn ? ` · nhớ ${p.mq}%` : ''}` });
// dòng nhớ ở ô tiến độ (Nhớ dồn cả cấp trước: chưa học bài nào của cấp thì chưa hiện %)
const pMem = p => p.learn ? `Nhớ: ${p.mq}% (tính cả bài cấp trước) · cần ${GATE_MEM}% để mở bài thi` : 'Nhớ: chưa có. Học vài bài rồi làm bài tập để app đo.';
// danh sách bài: một dòng = tên + trạng thái bằng chữ (cls: 'next' bài kế tiếp, 'warn' cần ôn, 'good' đã nhớ)
const pRow = (attr, name, tag, cls = '', dis = false) => `<button class="urow ${cls === 'next' ? 'next' : ''}" ${attr} ${dis ? 'disabled' : ''}><span>${cls === 'next' ? '▶ ' : ''}${name}</span><span class="tag ${cls}">${tag}</span></button>`;
// danh sách dài: hiện N dòng quanh bài kế tiếp (1 bài trước nó), các bài còn lại gập trong "Xem thêm" (vẫn bấm được như cũ)
const P_WIN = 6;
const pWin = (rows, at) => { if (rows.length <= P_WIN + 2) return rows.join(''); const a = Math.max(0, Math.min((at < 0 ? rows.length : at) - 1, rows.length - P_WIN)), b = a + P_WIN, rest = [...rows.slice(0, a), ...rows.slice(b)];
  return rows.slice(a, b).join('') + `<details class="lvmore"><summary>Xem thêm ${rest.length} bài ›</summary>${rest.join('')}</details>`; };
// tầng 3: "Thêm" gập; parts = [[tiêu đề, html]] (bỏ phần rỗng)
const pMore = (parts, foot = '📘 Bài học: dạy, không tính 🔁 Nhớ · 🏋️ Bài tập: tính 🔁 Nhớ.') => { const L = parts.filter(x => x[1]); return L.length ? `<details class="box more"><summary><b>Thêm</b> <span class="mute">· ${L.map(x => { const t = x[0].replace(/^\S+\s/, ''); return /^(Part|IELTS|TOEIC|Cambridge)\b/.test(t) ? t : t.charAt(0).toLowerCase() + t.slice(1); }).join(', ')}</span></summary>${L.map(([t, h]) => `<h3>${t}</h3>${h}`).join('')}
  <p class="mute" style="margin:12px 0 0;font-size:13px">${foot} Luật đầy đủ: 👤 Tôi → 📘 Luật và cách dùng.</p></details>` : ''; };
// ---------- v122 kỳ thi theo khuôn Nền (người sáng lập 3/11/2026: "thiết kế bài học ở nền và mục tiêu ko đồng nhất, nên quy về 1 kiểu"; chọn "kỳ thi theo khuôn Nền" + "bài cụ thể như Nền") ----------
// Màn đầu kỳ thi (xHome) giống màn 🧱 Nền: "Học" + hàng chọn + dòng tiến độ có thanh + lưới ô kỹ năng có thanh + "Thêm" gập (thi thử cả đề, đề thật, sẵn sàng thi…).
// Màn một kỹ năng (xSkill) giống màn phần của Nền: đường 3 bước (① Làm bài → ② Đạt band / điểm / mức → ③ Thi thử), 2 nút 📘 Bài học (cách làm) · 🏋️ Bài tập (bài kế tiếp),
// danh sách bài cụ thể ghi trạng thái bằng chữ, "Thêm" gập (luyện theo dạng câu…). Nút ▶ Luyện tiếp chỉ còn ở 🧭 Lộ trình. Luyện thi vẫn không tính luật đo.
const X_FOOT = 'Luyện thi không tính vào 📘 Học / 🔁 Nhớ / Thi chuyển cấp của 🧱 Nền.';
// v137: nhắc ⚖️ nền còn thiếu xa thành một dòng (chấm màn: ô cảnh báo cùng cỡ nội dung làm loãng việc chính)
const xNoteNen = sp => sp && !sp.ex ? `<p class="mute" style="margin:0 0 10px">⚖️ Nền còn thiếu xa (cần ${LVN[ltGoalLv()]}): 🧭 Lộ trình dồn giờ cho nền trước. <button class="link tap" data-hocnen>🧱 Học nền ›</button></p>` : '';
// a = 3 bước { t, v, sub, ok, cur, lock, btn (html nút: bước mở) }
const stepsX = a => `<div class="steps3">${a.map((s, i) => s.btn ? `<div class="st3 open"><i>${i + 1}</i><b>${s.t}</b>${s.btn}${s.sub ? `<span class="s">${s.sub}</span>` : ''}</div>`
  : `<div class="st3 ${s.ok ? 'ok' : s.cur ? 'cur' : ''} ${s.lock ? 'lock' : ''}"><i>${s.ok ? '✓' : s.lock ? '🔒' : i + 1}</i><b>${s.t}</b><span class="v">${s.v}</span><span class="s">${s.sub}</span></div>`).join('')}</div>`;
// o = { sw: hàng chọn, chips: chip cấp (Cambridge), t: tên kỳ thi, pv: số đo bên phải, pct, sub: dòng phụ, note: ô nhắc, tiles: [{ attr, ic, t, pct, meta, cls }], more: [[tiêu đề, html]], foot }
// v134: 📚 Học là một trang nên màn kỳ thi có nút "‹ Học" thay hàng chọn Nền / Luyện thi (kỳ thi khác ở 📚 Học → Xem thêm); o.sw không còn dùng
// v137: màn kỳ thi là màn đầu của tab 🎯 Luyện đề: hàng chọn kỳ thi (o.sw = exSwitch) thay nút "‹ Học"; o.ai = ô 🤖 Đề mới do AI soạn (deai.js daiBox) ngay dưới tiêu đề
// v138 (người sáng lập: tách đề AI và đề có sẵn để đỡ tốn phí AI; "hiện cả 2 nút chức năng để bấm"): 3 chế độ theo EX_PART (toeic.js)
//   null = màn 2 nút: 📚 Đề có sẵn (nút chính, miễn phí, còn N bài chưa làm) · 🤖 Đề AI soạn (nút phụ, tốn phí AI) + dòng đề AI đã xong / đang soạn + nhắc ⚖️
//   'san' = bài có sẵn: ô kỹ năng + "Thêm" (không có nút gọi AI) · 'ai' = ô đề AI (o.ai) + ô nhắc bài có sẵn chưa làm (o.remind)
//   o thêm: left = [{ n }] số bài có sẵn chưa làm theo kỹ năng (deai.js daiLeft), notice = dòng đề AI đã xong / đang soạn
const xFoot = o => o.foot ? `<p class="mute" style="margin:10px 0 0;font-size:13px">${o.foot}</p>` : '';
const xPartSeg = p => `<div class="seg exseg"><button class="${p === 'san' ? 'on' : ''}" data-expart="san" aria-pressed="${p === 'san'}">📚 Đề có sẵn</button><button class="${p === 'ai' ? 'on' : ''}" data-expart="ai" aria-pressed="${p === 'ai'}">🤖 Đề AI</button></div>`;
const xHome = o => { const p = o.part !== undefined ? o.part : (typeof EX_PART !== 'undefined' ? EX_PART : 'san'), n = (o.left || []).reduce((s, x) => s + x.n, 0);
  const sync0 = `<span class="mute" style="font-size:12px"><span id="sync">${esc(sync)}</span></span>`;
  const head = `<div class="row" style="margin:8px 0 6px"><h1 style="font-size:24px;margin:0">${o.t}</h1><span class="mute">${o.pv}</span></div>${bar(o.pct, 100, 'var(--good)')}
  <p class="mute" style="margin:6px 0 12px;font-size:14px">${o.sub}</p>`;
  // màn 2 nút: chip cấp (Cambridge, 10 cấp = 3 hàng ở 320 px) để dưới 2 nút để iPhone SE thấy cả 2 nút không cuộn
  if (!p) return `<div class="row top"><b style="font-size:17px">🎯 Luyện đề</b>${sync0}</div>${o.sw || ''}${head}
  <button class="btnbig" data-expart="san">📚 Đề có sẵn<small>Miễn phí · ${o.left && o.left.length ? (n ? `còn ${n} bài chưa làm` : 'đã làm hết, làm lại được') : 'bài học dạng đề, bài tập, thi thử'}</small></button>
  <button class="btnbig ghost" data-expart="ai">🤖 Đề AI soạn<small>Mỗi lần một đề mới · tốn phí AI</small></button>${o.notice || ''}${o.chips ? `<p class="mute" style="margin:12px 0 4px;font-size:14px">Đổi cấp</p>${o.chips}` : ''}${o.note || ''}${xFoot(o)}`;
  const top = `<div class="row top"><button class="link tap" data-expart="">‹ Luyện đề</button>${sync0}</div>${xPartSeg(p)}${o.chips || ''}${head}`;
  if (p === 'ai') return top + (o.ai || '') + (o.remind || '') + xFoot(o);
  return top + (o.notice || '') + `<div class="grid2">${o.tiles.map(t => `<button class="tile ${t.cls || ''}" ${t.attr}><span class="ic">${t.ic}</span><b>${t.t}</b>${bar(t.pct, 100, t.cls === 'ok' ? 'var(--good)' : 'var(--accent)')}<span class="meta">${t.meta}</span></button>`).join('')}</div>
  ${pMore(o.more, X_FOOT)}${xFoot(o)}`; };
// o = { back: dòng nút về, h1, note, steps, learn: { attr, sub, pri }, prac: { attr, sub }, les: { rows, at, done } (📘 bài học, v131), lt: tên danh sách bài tập, lsub, rows: [pRow], at: dòng kế tiếp, empty, more }
// v131 (người sáng lập: "tách ra 2 dạng học và bài tập như nền CEFR"): 2 danh sách: 📘 Bài học (mỗi dạng câu / phần một bài, baihoc.js) · 🏋️ Bài tập (bài cụ thể, ghi kết quả).
// Học hết bài học thì danh sách bài học gập lại; 📘 là nút chính khi còn bài học chưa học.
const xLes = (l, t = 'Dạng câu') => !l || !l.rows.length ? '' : l.done >= l.rows.length ? `<details class="lvmore" style="margin-top:14px"><summary>📘 ${t} · đã học hết ${l.rows.length} bài ›</summary>${l.rows.join('')}</details>`
  : `<h2 style="margin:16px 0 4px">📘 ${t} <span class="mute" style="font-size:15px;font-weight:400">· ${l.done}/${l.rows.length} đã học</span></h2><div id="xllist">${pWin(l.rows, l.at)}</div>`;
// v134 (bản mẫu "Đề xuất · IELTS Đọc"): màn kỹ năng của kỳ thi = một câu cách học + 2 ô số đo (dạng câu đã học · band / điểm / mức ước) + MỘT nút chính ghi rõ
//   (▶ Học dạng: … khi còn bài học; không thì ▶ Làm bài kế tiếp) + nút phụ + 📘 danh sách dạng câu + 🏋️ danh sách bài (tên cụ thể) + dòng 🎓 thi thử. Thay đường 3 bước + 2 nút của v122.
//   o thêm (tuỳ chọn): intro, lesT (tên danh sách bài học: 'Dạng câu' / 'Phần thi'…), pracT (tên nút bài tập), nxName (tên bài kế tiếp)
const xStat = s => `<div class="statc"><span class="mute">${s.t}</span><b>${s.v}</b><span class="mute" style="font-size:13px">${s.sub || ''}</span></div>`;
const xSkill = o => { const [s1, s2, s3] = o.steps, lesNext = !!(o.learn && o.learn.pri), hasLes = !!(o.les && o.les.rows && o.les.rows.length), lesT = o.lesT || 'Dạng câu';
  const lab = String(o.learn.sub || '').replace(/^học tiếp: /, `Học ${lesT.toLowerCase()}: `).replace(/^xem lại: /, 'Xem lại: ');
  const v2 = s2.v && s2.v !== '–' ? s2.v : 'chưa có', st1 = { t: hasLes ? `${lesT} đã học` : s1.t, v: s1.v, sub: s1.sub }, st2 = { t: s2.t, v: v2, sub: (v2 === 'chưa có' ? 'làm vài bài để có · ' : '') + (s2.sub || '') };
  const pri = lesNext ? `<button class="btnbig" ${o.learn.attr}>▶ ${lab}<small>khoảng 5 phút · có ví dụ và làm thử 3 câu</small></button>` : '';
  const prac = `<button class="btnbig${lesNext ? ' ghost' : ''}" ${o.prac.attr}${lesNext ? ' style="font-size:17px"' : ''}>${lesNext ? '🏋️ ' : '▶ '}${o.pracT || 'Làm bài kế tiếp'}<small>${o.nxName ? esc(o.nxName) : o.prac.sub}</small></button>`;
  const mock = s3 ? `<div class="box mockr"><div style="flex:1;min-width:0"><b>${s3.btn ? '🎓 ' : ''}${s3.t}</b><p class="mute" style="margin:2px 0 0;font-size:14px">${s3.sub || ''}</p></div>${s3.btn || `<b>${s3.v || ''}</b>`}</div>` : '';
  return `${o.back}<h1>${o.h1}</h1>${o.note || ''}<p class="mute" style="margin:0 0 10px;font-size:15px">${o.intro || 'Học từng dạng câu của đề, rồi làm bài như thi thật.'}</p>
  <div class="grid2" style="margin:0 0 10px">${xStat(st1)}${xStat(st2)}</div>${pri}${prac}
  ${xLes(o.les, lesT)}<h2 style="margin:16px 0 4px">🏋️ ${o.lt || 'Bài luyện'}${o.lsub ? ` <span class="mute" style="font-size:15px;font-weight:400">· ${o.lsub}</span>` : ''}</h2><div id="klist">${o.rows.length ? pWin(o.rows, o.at) : `<p class="mute">${o.empty || 'Chưa có bài.'}</p>`}</div>${o.ai || ''}${mock}${pMore(o.more, X_FOOT)}`; };   // v138: hàng 🤖 Đề AI sau danh sách bài có sẵn
// trạng thái một bài kỳ thi: chưa làm = để trống như danh sách bài của Nền / đúng a/b (yếu khi dưới mức cần) / band
const xTag = (r, need) => !r ? ['', ''] : r.n ? [`${r.ok}/${r.n} câu${need != null && r.ok / r.n < need ? ' · yếu' : ''}`, need != null && r.ok / r.n < need ? 'bad' : 'good'] : [r.t || 'đã làm', r.bad ? 'bad' : 'good'];
// chọn cấp khác (gập; mở sẵn khi đang xem cấp khác cấp đang học)
const pLvMore = (chips, other) => `<details class="lvmore"${other ? ' open' : ''}><summary>Xem bài cấp khác ›</summary><div class="chips">${chips}</div></details>`;
// Người sáng lập 25/10/2026: "mỗi cấp học các mục không đều thì chia theo cấp cho rõ, để thế này lẫn lộn cấp độ".
// Màn tổng quan lấy CẤP làm khung: chọn cấp (Pre-A1 · A1 · A2 · A2+), mỗi cấp liệt kê các phần có bài ở cấp đó và số liệu của phần ở đúng cấp đó.
// Cấp đang học = cấp thấp nhất còn phần chưa qua Thi chuyển cấp. "Nên làm" chỉ gợi ý bài mới trong cấp đang học (ôn thì mọi cấp).
// Cấp sau xem trước và học trước được (không khoá cứng); luật đo của từng phần giữ nguyên.
// v95: mục 🧰 luyện thi (v74) chuyển sang tab 🎓 Luyện thi → 🎓 Cambridge (dieuhuong.js cbView)
const OV_LV = ['pre', 'a1', 'a2', 'a2p', 'b1', 'b1p', 'b2', 'b2p', 'c1', 'c2'];
let OV_SEL = null, OV_ALL = false;
// v86: dòng "còn thiếu" của thẻ phần + lý do khi 🔁 Nhớ giảm so với lần xem trước (lưu theo máy, localStorage ovMq)
const ovMqLS = v => { try { if (v) localStorage.setItem('ovMq', JSON.stringify(v)); else return JSON.parse(localStorage.getItem('ovMq') || '{}'); } catch (e) { return {}; } };
function ovNeedLine(s, cur) { if (!s || s.gate === 'pass') return ''; if (s.gate === 'open') return '<p style="margin:4px 0 0">🚪 Đủ điều kiện: vào làm Thi chuyển cấp</p>'; if (!cur) return '';
  const a = []; if (s.nl) a.push(`${s.nl} ${s.u || 'bài'} chưa học`);   // v99: Từ vựng đếm từ, Phát âm đếm bộ âm if (s.nm) a.push(`${s.nm} mặt nhớ`);
  return a.length ? `<p class="mute" style="margin:4px 0 0">Còn ${a.join(' + ')} nữa là mở 🚪 Thi</p>` : ''; }
const ovLvs = id => id === 'tv' ? LEVELS : id === 'pa' ? PA_LV : KIT[id].lvs;
const ovIn = (id, lv) => ovLvs(id).includes(lv);
// số liệu một phần ở một cấp: { lq, mq, due, gate: 'pass' | 'open' | '' }; null khi chưa tải xong dữ liệu
// v86: còn thiếu gì để mở 🚪 Thi (nói rõ thay cho %): bài chưa học + số mặt nhớ còn thiếu (mỗi mặt cần ≥ GATE_MEM%). Không đổi luật đo.
// v97: bài còn thiếu tới 📘 Học GATE_LEARN% (learnNeed); chỉ đếm mặt tính cổng (p.gk; Từ vựng bỏ 🗣 Nói ra từ: tham khảo)
const ovNeed = p => ({ nl: learnNeed(p), nm: Object.keys(p.Tk || {}).filter(k => !p.gk || p.gk.includes(k)).reduce((s, k) => s + Math.max(0, Math.ceil(p.Tk[k] * GATE_MEM / 100 - 1e-9) - (p.dim[k] || 0)), 0) });
function ovStat(id, lv) { const now = Date.now();
  if (id === 'tv') { const p = parts(S, now, lv); return { ...ovNeed(p), u: 'từ', lq: p.lq, mq: p.mq, due: p.due, gate: passed(lv) ? 'pass' : lv === curLevel() && gateOpen(p, 'tv|' + lv, now) ? 'open' : '' }; }
  if (id === 'pa') { if (!PA) return null; const p = paParts(lv, now); return { ...ovNeed(p), u: 'bộ âm', lq: p.lq, mq: p.mq, due: p.due, gate: paPassed(lv) ? 'pass' : lv === paLevel() && gateOpen(p, 'pa|' + lv, now) ? 'open' : '' }; }
  const P = KIT[id]; if (!P.items) return null; const p = kParts(P, lv, now);
  return { ...ovNeed(p), lq: p.lq, mq: p.mq, due: p.due, gate: kPassed(P, lv) ? 'pass' : lv === kLv(P) && gateOpen(p, id + '|' + lv, now) ? 'open' : '' }; }
const ovPassed = (id, lv) => id === 'tv' ? passed(lv) : id === 'pa' ? (PA ? paPassed(lv) : false) : (KIT[id].items ? kPassed(KIT[id], lv) : false);
// v97 (người sáng lập duyệt): 🗣 Nói, ✍️ Viết máy chấm gián tiếp (KIT.ref) = tham khảo: không chặn hoàn thành cấp. "Hoàn thành cấp trong app" ≠ đạt CEFR thật:
// chữ "đạt" dành cho đề mẫu chính thức (realBox, 🎓 Luyện thi → Cambridge).
const ovRef = id => id === 'pa' ? typeof PA_REF !== 'undefined' && PA_REF : !!(KIT[id] && KIT[id].ref);   // v99: + 👄 Phát âm
const ovReq = lv => OV.filter(([id]) => ovIn(id, lv) && !ovRef(id));   // phần bắt buộc để hoàn thành cấp
const ovDone = lv => { const r = ovReq(lv); return r.length > 0 && r.every(([id]) => ovPassed(id, lv)); };
const ovStage = () => OV_LV.find(lv => !ovDone(lv)) || OV_LV[OV_LV.length - 1];
// v134 (bản mẫu "Đề xuất · Học"; người sáng lập 4/11/2026 "nhìn vào là hiểu" → "bạn tự tính cho hợp lý đi"): 📚 Học là MỘT trang, không còn 2 mục Nền / Luyện thi.
//   ① "Tiếng Anh {cấp}": 7 kỹ năng thành dòng (tên + đã học a / b + cần ôn / bài thi đã mở / đã qua) và một câu nói cách lên cấp;
//   ② "Luyện {kỳ thi mục tiêu}" (khi mục tiêu là kỳ thi): các kỹ năng của kỳ thi (dạng câu đã học + số bài) + dòng thi thử cả đề, đề thật;
//   ③ "Xem thêm" gập: cấp khác, kỳ thi khác, thư viện. Kết quả kiểm tra chưa chọn nơi bắt đầu thì có ô "Chọn". Không đổi luật đo.
const OV_UNIT = { tv: 'bài', pa: 'bộ âm', np: 'điểm ngữ pháp', nghe: 'bài nghe', noi: 'đề nói', doc: 'bài đọc', viet: 'bài viết' };
function ovCount(id, lv) { if (id === 'tv') { const us = UNITS.filter(u => u.lv === lv); return [us.filter(unitDone).length, us.length]; }
  if (id === 'pa') { const xs = (PA || []).filter(x => x.lv === lv), st = paSt(); return [xs.filter(x => st[x.id]).length, xs.length]; }
  const P = KIT[id]; if (!P.items) return [0, 0]; const xs = kItems(P, lv), st = kSt(id).cards; return [xs.filter(x => st[x.id]).length, xs.length]; }
const ovNextLv = (id, lv) => { const L = ovLvs(id); return L[L.indexOf(lv) + 1] || null; };
function ovRow(id, ic, t, lv, s) { const [a, b] = ovCount(id, lv), nx = ovNextLv(id, lv), pass = s && s.gate === 'pass', open = s && s.gate === 'open';
  const ws = id === 'tv' ? (() => { const p = parts(S, Date.now(), lv); return ` · ${p.learn} / ${p.T} từ`; })() : '';
  const sub = !s ? '…' : pass ? `✓ Đã qua bài thi${nx ? ' lên ' + LVN[nx] : ''}` : open ? '🚪 Bài thi lên cấp đã mở' : `Đã ${KIT[id] && KIT[id].newQs ? 'làm' : 'học'} ${a} / ${b} ${OV_UNIT[id]}${ws}${s.due ? ` · ${s.due} cần ôn` : ''}`;
  return `<button class="hrow${pass ? ' ok' : ''}" data-ovp="${id}" data-ovpl="${lv}"><span class="ic">${ic}</span><span class="t"><b>${t}</b><small>${sub}${id === 'noi' && ovRef(id) ? ' · không bắt buộc trên máy này' : ''}</small></span><span class="chev">›</span></button>`; }
// các kỹ năng của kỳ thi: [{ attr, ic, t, sub }]; null khi chưa tải dữ liệu
function ovExRows(k, lv) { const n = (L, St = xlSt()) => [L.filter(d => St[d.id]).length, L.length];
  try { if (k === 'ielts') { if (typeof IE === 'undefined' || !IE) return null; const N = { L: 'bài nghe', R: 'bài đọc', W: 'đề viết', S: 'chủ đề nói' };
      const D = { L: 'dạng câu', R: 'dạng câu', W: 'dạng bài', S: 'phần thi' };
      return Object.keys(IE_SKV).map(x => { const [a, b] = n(xlList('ielts', x)); return { attr: `data-ovx="ielts|${x}"`, ic: IE_SKV[x][0], t: IE_SKV[x][1], sub: `${a} / ${b} ${D[x]} đã học · ${ieBai(x).length} ${N[x]}` }; }); }
    if (k === 'toeic') { if (typeof TO === 'undefined' || !TO) return null; const N = { L: 'bộ bài nghe', R: 'bộ bài đọc', V: 'chủ đề' };
      return Object.keys(TO_SKV).map(x => { const [a, b] = n(xlList('toeic', x)); return { attr: `data-ovx="toeic|${x}"`, ic: TO_SKV[x][0], t: TO_SKV[x][1], sub: `${b ? `${a} / ${b} dạng câu đã học · ` : ''}${toBai(x).length} ${N[x]}` }; }); }
    if (k === 'cambridge' && typeof MOCK !== 'undefined' && MOCK[lv]) return MOCK[lv].papers.map((p, i) => { const [a, b] = n(xlList('cambridge', lv + '~' + i));
      return { attr: `data-ovx="cambridge|${lv}|${i}"`, ic: typeof cbIc === 'function' ? cbIc(p.t) : '📄', t: typeof cbPn === 'function' ? cbPn(p.t) : p.t, sub: `${a} / ${b} phần thi đã học · ${p.min} phút` }; });
  } catch (e) {} return null; }
function overview(sel) { BACK = null; window.CUR = { view: 'tong-quan' };
  const g = S.lt && S.lt.goal, k = g && typeof ltKind === 'function' ? ltKind(g) : 'cefr';
  const loaded = PA && Object.values(KIT).every(P => P.items);
  if (!loaded) Promise.all([paLoad(), ...Object.values(KIT).map(kLoad)])
    .then(() => { if (document.getElementById('ov')) overview(sel); }).catch(() => {});
  const stage = ovStage(); if (sel) OV_SEL = sel; const lv = OV_SEL && OV_LV.includes(OV_SEL) ? OV_SEL : stage, other = lv !== stage;
  const ids = OV.filter(([id]) => ovIn(id, lv)), st = ids.map(([id]) => ovStat(id, lv)), req = ovReq(lv), nx = OV_LV[OV_LV.indexOf(lv) + 1];
  const pend = typeof plPend === 'function' ? plPend(stage) : null, need = g && typeof ltGoalLv === 'function' ? ltGoalLv(g) : null;
  const pct = typeof ltLvPct === 'function' ? ltLvPct(lv) : 0, en = { ielts: 'IELTS', toeic: 'TOEIC', cambridge: 'Cambridge' }[k];
  // v137: 📚 Học chỉ còn 🧱 Nền; luyện thi chuyển sang tab 🎯 Luyện đề (bỏ thẻ "Luyện {kỳ thi}" và hàng "Kỳ thi khác"), ở đây chỉ còn một dòng chỉ đường
  const exCard = k === 'cefr' ? '' : `<p class="mute" style="margin:8px 0">🎯 Luyện ${esc(ltGoalName(g))}: ở tab <button class="link tap" data-exthi>🎯 Luyện đề ›</button></p>`;
  const ai = LEVELS.indexOf(lv) >= LEVELS.indexOf('b1');
  $app.innerHTML = `<div id="ov"></div><div class="row"><h1 style="font-size:28px;margin:6px 0">Học</h1><span class="mute" style="font-size:12px"><span id="sync">${esc(sync)}</span></span></div>
    <p class="mute" style="margin:0 0 10px">Trình độ ${LVN[stage]}${g ? ` · mục tiêu ${esc(ltGoalName(g))}` : ''}</p>
    ${S.fake ? '<p class="mute" style="margin:4px 0">🧪 Đang dùng dữ liệu thử (💾 Dữ liệu để quay lại dữ liệu thật).</p>' : ''}
    ${pend ? `<div class="box"><b>Bài kiểm tra: bạn khoảng ${LVN[pend]}</b><p class="mute" style="margin:4px 0">Chọn nơi bắt đầu để không phải học lại cấp dưới.</p><button class="pri" data-plstart>Chọn nơi bắt đầu ›</button></div>` : ''}
    ${other ? `<div class="row" style="margin:0 0 8px"><span class="mute">Đang xem cấp ${LVN[lv]}</span><button class="link" data-ovl="${stage}">‹ Về ${LVN[stage]}</button></div>` : ''}
    <div class="box hcard"><div class="row"><b style="font-size:19px">Tiếng Anh ${LVN[lv]}</b><span class="mute" style="font-size:14px">${pct}%</span></div>
      <p class="mute" style="margin:2px 0 4px;font-size:15px">${nx ? `Học đủ các kỹ năng. Qua bài thi của ${req.length} kỹ năng để lên ${LVN[nx]}.` : `Qua bài thi của ${req.length} kỹ năng là xong cấp cuối.`}</p>
      ${ids.map((o, i) => ovRow(o[0], o[1], o[2], lv, st[i])).join('')}</div>
    ${other ? '' : exCard}
    <details class="box more"><summary><b>Xem thêm</b> <span class="mute">· cấp khác, thư viện</span></summary>
      <p style="margin:10px 0 4px"><b>Cấp khác</b></p><div class="chips">${OV_LV.map(l => `<button class="chip ${l === lv ? 'on' : ''}" data-ovl="${l}">${ovDone(l) ? '✓ ' : l === stage ? '● ' : ''}${LVN[l]}</button>`).join('')}</div>
      ${typeof libBox === 'function' ? libBox(lv) : ''}</details>
    ${ai ? '<p class="mute" style="margin:10px 0 0;font-size:13px">🤖 Nội dung cấp này do AI soạn, chưa giáo viên kiểm. Thấy câu sai: bấm 💬 → ⚑ Câu sai.</p>' : ''}`;
  $app.onclick = e => { const c = e.target.closest('[data-ovl]'); if (c) { scrollTo(0, 0); return overview(c.dataset.ovl); }
    const x = e.target.closest('[data-ovx]'); if (x) { const [ek, a, b2] = x.dataset.ovx.split('|'); scrollTo(0, 0); return ek === 'ielts' ? ieSkView(a) : ek === 'toeic' ? toSkView(a) : cbSkView(a, +b2); }
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
  nghe: { pre: [['💡 Ý chính', 'y'], ['🔍 Chi tiết', 'ct'], ['✍️ Chép lại', 'chep'], ['🔊 Nghe từ, chọn hình'], ['📍 Nghe vị trí (in, on, under)'], ['✅ Nghe câu, đúng / sai với tranh']],
    a1: [['🔢 Nghe số, tên đánh vần, màu'], ['📻 Bài dài hơn, nhiều thông tin hơn']],
    a2: [['💬 Hội thoại: ai nói gì'], ['📝 Nghe điền phiếu ghi chú'], ['🔄 Nhận ra cách nói khác']],
    b1: [['📻 Bài dài (thông báo, radio): ý chính'], ['🎯 Nhận ra ý kiến, thái độ']],
    b2: [['🌍 Nhiều giọng, tốc độ thường'], ['🧭 Suy ra ý không nói thẳng']], c1: [['🎬 Phim, bài giảng tự nhiên']], c2: [['⚡ Mọi lời nói ở tốc độ bản xứ']] },
  doc: { pre: [['💡 Ý chính', 'y'], ['🔍 Chi tiết', 'ct'], ['🔤 Nối từ với hình'], ['✅ Câu đúng / sai với tranh'], ['🧩 Điền từ có hình gợi ý']],
    a1: [['📋 Biển báo, tin nhắn ngắn'], ['🙋 Đọc câu hỏi, trả lời yes / no']],
    a2: [['🔄 Nhận ra cách viết khác'], ['🧭 Đoán nghĩa từ lạ qua ngữ cảnh'], ['🔗 Hiểu it, they, this chỉ cái gì']],
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
// nội dung từng yêu cầu dự kiến (bấm dòng để mở): đo gì · ví dụ câu
const RQ_D = {
  // 📚 Từ vựng B1 → C2
  '🔗 Tự dùng cụm từ': 'Tự gõ cụm từ đúng, không có phương án chọn. Ví dụ: "Tôi đưa ra quyết định" → gõ: <b>make</b> a decision (không phải do).',
  '🧱 Mẫu câu của từ': 'Biết từ đi với giới từ / dạng động từ nào. Ví dụ: interested <b>in</b> · enjoy <b>swimming</b> · want <b>to go</b>.',
  '🔧 Nhận ra họ từ': 'Nhận ra các từ cùng gốc và tiền tố, hậu tố. Ví dụ: happy → happiness, unhappy, happily.',
  '🛠 Tự tạo dạng từ': 'Tự gõ đúng từ cùng họ cho vừa câu (như FCE phần 3). Ví dụ: She sang ___ (BEAUTY) → <b>beautifully</b>.',
  '🎚 Sắc thái, trang trọng': 'Biết từ nào trang trọng, từ nào thân mật. Ví dụ: kids / children · buy / purchase · get / receive.',
  '🔄 Tự thay từ đồng nghĩa': 'Tự thay một từ bằng từ khác cùng nghĩa, hợp câu, để không lặp. Ví dụ: very big → <b>huge</b>; good → <b>excellent</b>.',
  '🎩 Chọn đúng văn phong': 'Tự chọn từ hợp hoàn cảnh: thư xin việc khác tin nhắn bạn bè. Ví dụ: "I want" → "I would like" / "I wish to".',
  '⚡ Nhận ra tức thì': 'Hiểu từ ngay, không cần dịch trong đầu. Đo bằng thời gian trả lời (dưới khoảng 1–2 giây).',
  '🌫 Thành ngữ, nghĩa bóng': 'Hiểu và dùng thành ngữ, nghĩa bóng. Ví dụ: break the ice (phá vỡ không khí ngại ngùng) · a piece of cake (dễ ợt).',
  // 👄 Phát âm
  '🔤 Nhìn chữ đoán cách đọc': 'Nhìn chữ viết đoán được âm. Ví dụ: chữ a trong c<b>a</b>t /æ/ khác c<b>a</b>ke /eɪ/; "ee" trong see đọc /iː/.',
  '🔚 Đọc ra âm cuối': 'Đọc rõ phụ âm cuối, lỗi hay gặp của người Việt. Ví dụ: ca<b>t</b>, boo<b>k</b>, fi<b>ve</b>, ni<b>ce</b> (không nuốt âm).',
  '🎵 Nhận ra trọng âm': 'Nghe từ 2 âm tiết, chọn âm tiết được nhấn. Ví dụ: TAble · hoTEL · PREsent (danh từ) / preSENT (động từ).',
  '🔁 Đọc đúng đuôi -s / -ed': 'Ba cách đọc mỗi đuôi. Ví dụ: cats /s/ · dogs /z/ · buses /ɪz/; worked /t/ · played /d/ · wanted /ɪd/.',
  '🧩 Đọc cụm phụ âm (street, desk)': 'Đọc liền nhiều phụ âm, không chèn nguyên âm. Ví dụ: <b>str</b>eet (không phải "sơ-trít"), de<b>sk</b>, <b>pl</b>ay.',
  '🌊 Nghe ra nối âm, dạng đọc nhẹ': 'Nghe hiểu khi từ dính nhau hoặc đọc nhẹ. Ví dụ: an apple → "a-napple"; going to → "gonna"; can /kən/.',
  '❓ Nhận ra ngữ điệu lên / xuống': 'Nghe câu, biết là câu hỏi hay câu kể. Ví dụ: "You\'re coming?" ↗ (hỏi) · "Where do you live?" ↘.',
  '📏 Đọc rõ cả câu ngắn': 'Đọc to một câu 5–8 từ, bộ chấm âm chấm cả câu. Ví dụ: "I live in a small house."',
  '🎵 Tự nói đúng trọng âm từ': 'Tự nói đúng chỗ nhấn của từ nhiều âm tiết. Ví dụ: phoTOgraphy · comPUter · inforMAtion.',
  '💬 Nhấn từ quan trọng trong câu': 'Nhấn từ mang ý, đọc nhẹ từ chức năng. Ví dụ: "I WANT a CUP of TEA."',
  '🔗 Tự nối âm khi nói': 'Tự nói liền các từ như người bản xứ. Ví dụ: turn_off · pick_it_up · not_at_all.',
  '🎭 Ngữ điệu thể hiện thái độ': 'Dùng giọng lên xuống để tỏ ngạc nhiên, lịch sự, khó chịu. Ví dụ: "Really?" ↗ (ngạc nhiên) / ↘ (chán).',
  '🌍 Nghe hiểu nhiều giọng (Anh, Mỹ, Úc)': 'Nghe hiểu cùng một từ ở nhiều giọng. Ví dụ: water, can\'t, tomato đọc kiểu Anh / Mỹ / Úc.',
  '🗣 Nói dễ hiểu với người bản xứ, ít lỗi âm': 'Người bản xứ nghe hiểu ngay, không phải hỏi lại; lỗi âm hiếm, không làm đổi nghĩa.',
  '🎨 Dùng nhấn và ngữ điệu để đổi sắc thái': 'Đổi chỗ nhấn để đổi ý. Ví dụ: "I didn\'t say HE stole it" khác "I didn\'t SAY he stole it".',
  // 🧱 Ngữ pháp
  '🔀 Xếp từ thành câu': 'Xếp các từ cho đúng trật tự câu. Ví dụ: [cat / a / have / I / black] → I have a black cat.',
  '❓ Đổi sang câu hỏi / phủ định': 'Đổi câu kể thành câu hỏi hoặc phủ định. Ví dụ: It is a dog. → Is it a dog? / It isn\'t a dog.',
  '⏱ Chọn thì theo dấu hiệu': 'Nhìn từ chỉ thời gian để chọn thì. Ví dụ: every day → plays · now → is playing · yesterday → played.',
  '🔗 Nối câu bằng and, but, because': 'Nối hai câu đơn thành một. Ví dụ: I like tea. I don\'t like coffee. → I like tea <b>but</b> I don\'t like coffee.',
  '🧩 Điền từ chức năng vào đoạn': 'Tự điền giới từ, mạo từ, đại từ vào đoạn văn (như A2 Key Đọc phần 5). Ví dụ: I went ___ the park ___ my friends. → to, with.',
  '🔄 Viết lại câu cùng nghĩa': 'Viết lại câu bằng cấu trúc khác mà giữ nghĩa. Ví dụ: Tom is taller than Ann. → Ann is <b>shorter than</b> Tom.',
  '✍️ Tự đặt câu dùng điểm ngữ pháp': 'Tự viết câu theo gợi ý, dùng đúng điểm ngữ pháp. Ví dụ: (yesterday / go) → I went to school yesterday.',
  '🔀 Câu phức (quan hệ, điều kiện)': 'Dùng mệnh đề quan hệ và câu điều kiện. Ví dụ: The man <b>who</b> lives here… · <b>If</b> it rains, I will stay home.',
  '💬 Câu tường thuật': 'Kể lại lời người khác. Ví dụ: "I am tired." → She said (that) she <b>was</b> tired.',
  '🔁 Câu bị động': 'Đổi câu sang bị động. Ví dụ: They built this house in 1990. → This house <b>was built</b> in 1990.',
  '🧠 Chọn thì theo ý nghĩa': 'Chọn thì theo ý muốn nói, không theo dấu hiệu. Ví dụ: I have lived here for 5 years (vẫn đang sống) / I lived there for 5 years (đã thôi).',
  '🔗 Liên kết đoạn văn': 'Dùng từ nối nâng cao giữa các câu, đoạn. Ví dụ: however, moreover, as a result, on the other hand.',
  '🎚 Cấu trúc nhấn mạnh, đảo ngữ': 'Ví dụ: <b>It was</b> Tom <b>who</b> called. · <b>Never have I</b> seen such a thing. · <b>What I need is</b> rest.',
  '🎨 Dùng ngữ pháp linh hoạt, gần như không lỗi': 'Viết, nói câu phức tạp mà gần như không sai, chọn cấu trúc hợp ý và văn phong.',
  // 🎧 Nghe
  '🔊 Nghe từ, chọn hình': 'Nghe một từ, chọn hình đúng (như Starters). Ví dụ: 🔊 "banana" → chọn 🍌.',
  '🔢 Nghe số, tên đánh vần, màu': 'Nghe rồi ghi lại số, tên được đánh vần. Ví dụ: 🔊 "My name is Ann, A-N-N. I\'m seven." → Ann, 7.',
  '📍 Nghe vị trí (in, on, under)': 'Nghe câu tả vị trí, chọn đúng tranh. Ví dụ: 🔊 "The cat is under the table." → tranh mèo dưới bàn.',
  '✅ Nghe câu, đúng / sai với tranh': 'Nghe câu, nhìn tranh, chọn đúng hay sai. Ví dụ: tranh 2 con chó, 🔊 "There are three dogs." → sai.',
  '💬 Hội thoại: ai nói gì': 'Nghe hai người nói, nối người với ý của họ (như A2 Key Nghe phần 5). Ví dụ: Ai muốn đi xem phim? Ai bận?',
  '📝 Nghe điền phiếu ghi chú': 'Nghe thông báo, điền vào phiếu (như A2 Key Nghe phần 2). Ví dụ: Giờ mở cửa: ___ · Giá vé: ___.',
  '🔄 Nhận ra cách nói khác': 'Câu hỏi và bài nghe dùng chữ khác nhau mà cùng ý. Ví dụ: hỏi "Why is she late?", bài nói "the bus didn\'t come".',
  '📻 Bài dài hơn, nhiều thông tin hơn': 'Bài nghe dài 80–120 từ (thư, thông báo, hội thoại), nhiều số, giờ, giá, tên hơn Pre-A1. Bài A1 hiện có đo bằng 💡 Ý chính, 🔍 Chi tiết, ✍️ Chép lại.',
  '📻 Bài dài (thông báo, radio): ý chính': 'Nghe bài 2–3 phút (radio, thông báo ở ga), nắm các ý chính.',
  '🎯 Nhận ra ý kiến, thái độ': 'Nghe ra người nói thích, không thích, đồng ý hay không. Ví dụ: "It was OK, I suppose…" → không hào hứng.',
  '🌍 Nhiều giọng, tốc độ thường': 'Nghe người bản xứ nhiều vùng nói ở tốc độ bình thường, không chậm cho người học.',
  '🧭 Suy ra ý không nói thẳng': 'Hiểu ý ngầm. Ví dụ: "Is it cold in here?" = muốn đóng cửa sổ.',
  '🎬 Phim, bài giảng tự nhiên': 'Nghe hiểu phim, bài giảng, tranh luận không soạn trước, có tiếng ồn, nói chen.',
  '⚡ Mọi lời nói ở tốc độ bản xứ': 'Nghe hiểu gần như mọi thứ: nói nhanh, tiếng lóng, giọng lạ, chỉ cần chút thời gian làm quen giọng.',
  // 📰 Đọc
  '🔤 Nối từ với hình': 'Đọc một từ, chọn hình đúng. Ví dụ: "a red ball" → chọn 🔴⚽.',
  '✅ Câu đúng / sai với tranh': 'Đọc câu, nhìn tranh, chọn đúng hay sai (như Starters Đọc phần 1). Ví dụ: "The boy is eating an apple."',
  '🙋 Đọc câu hỏi, trả lời yes / no': 'Đọc câu hỏi ngắn về tranh, trả lời yes / no. Ví dụ: "Is the cat on the bed?" → yes.',
  '🧩 Điền từ có hình gợi ý': 'Điền từ vào câu, có hình gợi ý (như Starters Đọc phần 5). Ví dụ: "She has a ___ (🐶)." → dog.',
  '📋 Biển báo, tin nhắn ngắn': 'Đọc biển báo, ghi chú, tin nhắn, chọn ý đúng (như A2 Key Đọc phần 1). Ví dụ: "CLOSED ON SUNDAYS" → Chủ nhật không mở.',
  '🔄 Nhận ra cách viết khác': 'Câu hỏi dùng chữ khác bài đọc mà cùng ý. Ví dụ: bài "she didn\'t pass", hỏi "Did she fail?" → có.',
  '🧭 Đoán nghĩa từ lạ qua ngữ cảnh': 'Gặp từ chưa học, đoán nghĩa nhờ câu xung quanh. Ví dụ: "He was <b>exhausted</b> after running 20 km." → rất mệt.',
  '🔗 Hiểu it, they, this chỉ cái gì': 'Biết đại từ chỉ ai, cái gì trong bài. Ví dụ: "Tom bought a car. <b>It</b> is red." → it = the car.',
  '📖 Bài dài 300–500 từ': 'Đọc hiểu bài dài cỡ bài báo ngắn, trả lời câu hỏi ý chính và chi tiết.',
  '🎯 Nhận ra ý kiến người viết': 'Phân biệt sự thật và ý kiến; người viết khen hay chê.',
  '🧠 Suy luận, giọng văn': 'Hiểu điều bài không viết thẳng, nhận ra giọng mỉa, hài hước, nghiêm túc.',
  '⏱ Đọc lướt tìm ý nhanh': 'Lướt bài dài để tìm nhanh một thông tin hoặc ý chính, không đọc từng chữ.',
  '📚 Văn bản dài, chuyên môn': 'Đọc hiểu báo cáo, hợp đồng, bài chuyên ngành dài, phức tạp.',
  '🎨 Văn chương, ẩn ý, chơi chữ': 'Đọc hiểu văn học, thơ, châm biếm, chơi chữ, ẩn ý văn hoá.',
  // 🗣 Nói
  '🗣 Nói rõ từ, cụm từ': 'Nói một từ, cụm từ; máy chép ra đúng. Ví dụ: nhìn 🍎 → nói "an apple".',
  '🙋 Trả lời về bản thân 1–3 từ': 'Trả lời câu hỏi ngắn về mình (như Starters Nói). Ví dụ: "How old are you?" → "Seven." / "I\'m seven."',
  '🖼 Nói câu ngắn về tranh': 'Nhìn tranh, nói một câu ngắn. Ví dụ: "It\'s a red car." · "The dog is big."',
  '👋 Chào hỏi xã giao': 'Chào, cảm ơn, xin lỗi, tạm biệt đúng lúc. Ví dụ: "Hello, how are you?" → "Fine, thank you."',
  '🔗 Nối ý bằng and, but, because': 'Nói câu có từ nối. Ví dụ: "I like football <b>because</b> it\'s fun."',
  '📖 Kể việc đã xảy ra': 'Kể 3–4 câu về việc đã qua, đúng thì quá khứ. Ví dụ: "Last weekend I went to the beach. I swam…"',
  '💭 Nêu ý kiến kèm lý do': 'Nói ý mình và vì sao (như A2 Key Nói phần 2). Ví dụ: "I think the park is better <b>because</b> it\'s quiet."',
  '🙋 Tự đặt câu hỏi': 'Tự hỏi để lấy thông tin. Ví dụ: "What time does the film start?" · "How much is it?"',
  '🗺 Kể chuyện mạch lạc': 'Kể một chuyện có đầu, giữa, cuối, dùng first, then, after that, finally.',
  '🧩 Xử lý tình huống bất ngờ': 'Xoay xở khi đi du lịch: mất đồ, nhầm phòng, đổi vé. Ví dụ: "I\'m afraid there\'s a problem with my room."',
  '🗣 Nói trôi chảy 1–2 phút': 'Nói liền 1–2 phút về một chủ đề, ít ngập ngừng.',
  '⚖️ Tranh luận ưu / nhược': 'Nêu ưu, nhược và bảo vệ ý mình. Ví dụ: "On the one hand… on the other hand…"',
  '🎤 Trình bày chủ đề phức tạp': 'Thuyết trình rõ ràng, có cấu trúc về chủ đề khó, trả lời câu hỏi bất ngờ.',
  '🎨 Diễn đạt sắc thái tinh tế': 'Nói tự nhiên, chính xác, đổi giọng theo người nghe, dùng thành ngữ đúng chỗ.',
  // ✍️ Viết
  '✍️ Chép đúng từ, câu': 'Chép lại từ, câu không sai chữ. Ví dụ: nhìn "I have a dog." → chép đúng.',
  '📝 Điền phiếu thông tin cá nhân': 'Điền tên, tuổi, địa chỉ, sở thích vào phiếu. Ví dụ: Name: ___ · Age: ___.',
  '🖼 Viết 1 từ cho tranh': 'Nhìn tranh, viết một từ (như Starters Viết). Ví dụ: 🐱 → cat.',
  '🔠 Câu đúng cơ bản (hoa, chấm, động từ)': 'Câu có chữ hoa đầu câu, dấu chấm cuối câu, có động từ. Ví dụ: "my name tom" → "My name is Tom."',
  '🔗 Dùng từ nối': 'Nối ý bằng and, but, because, so, then. Ví dụ: "It rained, <b>so</b> we stayed at home."',
  '📖 Viết chuyện theo 3 tranh': 'Nhìn 3 tranh, viết chuyện ≥ 35 từ, thì quá khứ (như A2 Key Viết phần 7).',
  '🎯 Đúng việc: mời, xin lỗi, cảm ơn': 'Thư, tin nhắn làm đúng việc đề yêu cầu. Ví dụ: "Would you like to come…?" · "Sorry, I can\'t…"',
  '✉️ Thư kể và giải thích': 'Viết thư 100–120 từ kể chuyện, giải thích lý do, hỏi lại người nhận.',
  '📄 Đoạn văn có ý chính, ý phụ': 'Đoạn văn có câu chủ đề, các câu giải thích, ví dụ.',
  '⚖️ Bài luận nêu ý kiến': 'Bài 140–190 từ nêu ý kiến, lý do, ví dụ, kết luận (như FCE).',
  '🎚 Đúng văn phong trang trọng / thân mật': 'Thư gửi bạn khác thư gửi công ty. Ví dụ: "Hi Tom!" / "Dear Sir or Madam,".',
  '📚 Bài dài, lập luận chặt': 'Bài dài, bố cục rõ, lập luận chặt, nhiều cấu trúc.',
  '🎨 Văn phong tự nhiên như người bản xứ': 'Viết trôi chảy, chính xác, đúng phong cách, người đọc không thấy "giọng người học".',
};
// cell(k) = ô của mặt đang đo (có %, bấm được)
function rqList(id, lv, cell) {
  const i0 = RQ_LV.findIndex(x => x[0] === lv), Q = RQ[id];
  return `<div class="dlist">${RQ_LV.map(([L, name], i) => { const rs = Q[L] || [], on = i <= i0, has = LEVELS.includes(L);
    return rs.length ? `<div class="dlv ${on ? '' : 'lock'}">${on ? '' : '🔒 '}${i ? `${name}: thêm ${rs.length}` : name}${on ? '' : has ? ` · mở khi lên ${name}` : ' · chưa có bài'}</div>${rs.map(([l, k]) => on && k ? cell(k)
      : rqRow(l, RQ_D[l], on ? 'chưa có bài' : '')).join('')}` : ''; }).join('')}</div>
    <p class="mute" style="margin:4px 0 0;font-size:12px">Bấm một dòng mờ để xem nội dung. Dòng mờ là yêu cầu dự kiến: chưa có bài, chưa tính 🔁 Nhớ.</p>`; }
// v118: "Nhớ từng mặt" ở "Thêm" chỉ hiện mặt đang đo tới cấp đang học; yêu cầu dự kiến và các cấp sau gập riêng
function rqNow(id, lv, cell) { const i0 = RQ_LV.findIndex(x => x[0] === lv), ks = [];
  RQ_LV.forEach(([L], i) => { if (i <= i0) for (const [, k] of RQ[id][L] || []) if (k && !ks.includes(k)) ks.push(k); });
  return ks.map(cell).join('') + `<details class="lvmore"><summary>Yêu cầu dự kiến, các cấp sau ›</summary>${rqList(id, lv, cell)}</details>`; }
// dòng yêu cầu chưa đo: bấm mở ra nội dung (người sáng lập 26/10/2026: "mở ra để xem nội dung mỗi tiêu chí")
const rqRow = (l, d, tag) => `<details class="dimx"><summary><span>${l}</span><span style="font-size:12px">${tag} ▾</span></summary><div class="dxd">${d || 'Chưa có mô tả.'}</div></details>`;

// ---------- 📝 Kiểm bằng đề thật (người sáng lập 26/10/2026 duyệt sau buổi kiểm thử Pre-A1) ----------
// Đề mẫu Cambridge chính thức (miễn phí), tự làm, tự đếm câu đúng theo đáp án; ghi điểm vào S.real[cấp]. Chỉ ghi nhận, không khoá cấp sau.
// Ngưỡng 70% mỗi phần là đề xuất (Cambridge chấm bằng khiên 1–5, không có điểm đỗ).
const REAL = {
  pre: { name: 'Pre A1 Starters', L: 20, RW: 25 }, a1: { name: 'A1 Movers', L: 25, RW: 35 }, a2: { name: 'A2 Key', L: 25, RW: 30, rwName: 'Đọc (phần 1–5)', url: 'https://www.cambridgeenglish.org/exams-and-tests/qualifications/key/preparation/' },   // 28/10/2026: trước trỏ đề Flyers (trẻ em); bằng thật cho người lớn là A2 Key
  // B1 → C2 (v52): trang luyện thi chính thức có đề mẫu + đáp án; phần Viết, Nói cần người chấm nên chỉ đếm Nghe + Đọc (B2 trở lên: Đọc và Dùng tiếng Anh)
  b1: { name: 'B1 Preliminary', L: 25, RW: 32, rwName: 'Đọc', url: 'https://www.cambridgeenglish.org/exams-and-tests/qualifications/preliminary/preparation/' },
  b2: { name: 'B2 First', L: 30, RW: 52, rwName: 'Đọc và Dùng tiếng Anh', url: 'https://www.cambridgeenglish.org/exams-and-tests/qualifications/first/preparation/' },
  c1: { name: 'C1 Advanced', L: 30, RW: 56, rwName: 'Đọc và Dùng tiếng Anh', url: 'https://www.cambridgeenglish.org/exams-and-tests/qualifications/advanced/preparation/' },
  c2: { name: 'C2 Proficiency', L: 30, RW: 53, rwName: 'Đọc và Dùng tiếng Anh', url: 'https://www.cambridgeenglish.org/exams-and-tests/qualifications/proficiency/preparation/' } };
const REAL_PDF = 'https://www.cambridgeenglish.org/Images/423014-cambridge-english-young-learners-sample-papers-2018-volume-2.pdf';
const REAL_PASS = 0.7;
const realRuns = lv => ((S.real = S.real || {})[lv] = S.real[lv] || []);
const realOk = r => r.l / r.L >= REAL_PASS && r.rw / r.RW >= REAL_PASS;
function realBox(lv) { const R = REAL[lv]; if (!R) return ''; const rs = realRuns(lv), last = rs[rs.length - 1], ok = rs.some(realOk);
  return `<div class="box"><div class="row"><b>📝 Đạt thật: đề mẫu chính thức</b><span class="mute">${ok ? '✅ đạt' : last ? '❌ chưa đạt' : 'chưa làm'}</span></div>
    <p class="mute" style="margin:6px 0">Sau khi các phần qua 🚪 Thi chuyển cấp, làm một đề mẫu chính thức của Cambridge (${R.name}): in ra hoặc làm trên giấy, nghe file nghe, rồi đếm số câu đúng theo đáp án cuối đề. Không cần chuyên môn. Đúng ≥ ${REAL_PASS * 100}% mỗi phần là đạt (ngưỡng đề xuất). Đây là bằng chứng "đạt ${LVN[lv]}" đáng tin hơn "hoàn thành trong app".</p>
    ${last ? `<p style="margin:4px 0">Lần gần nhất (${new Date(last.at).toLocaleDateString('vi-VN')}): 🎧 Nghe ${last.l}/${last.L} · 📖 ${R.rwName || 'Đọc và Viết'} ${last.rw}/${last.RW}</p>` : ''}
    <a class="chip" href="${R.url || REAL_PDF}" target="_blank" rel="noopener">📄 Đề mẫu ${R.url ? '(trang Cambridge, có đáp án)' : '(PDF, có đáp án)'}</a>
    <button class="pri" data-real="${lv}" style="margin-top:8px">✍️ Ghi điểm đề thật</button>
    <p class="mute" style="margin:6px 0 0;font-size:12px">File nghe: trang Cambridge "${R.name} preparation" (cambridgeenglish.org). ${R.url ? 'Phần Viết, Nói' : 'Phần Nói'} của đề cần giám khảo, chưa tính.</p></div>`; }
document.addEventListener('click', e => { const b = e.target.closest('[data-real]'); if (!b) return; const lv = b.dataset.real, R = REAL[lv];
  const ask = (t, max) => { const v = prompt(`${t}: số câu đúng (0–${max})`); if (v == null) return null; const n = parseInt(v, 10); return n >= 0 && n <= max ? n : (alert('Số không hợp lệ.'), null); };
  const l = ask('🎧 Nghe', R.L); if (l == null) return; const rw = ask('📖 ' + (R.rwName || 'Đọc và Viết'), R.RW); if (rw == null) return;
  const r = { at: Date.now(), l, L: R.L, rw, RW: R.RW }; realRuns(lv).push(r); S.t = Date.now(); save();
  toast(realOk(r) ? '✅ Đạt bằng đề thật.' : '❌ Chưa đạt: ôn phần thấp rồi làm đề khác.'); exHome(lv); });
