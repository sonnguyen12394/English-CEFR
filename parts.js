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
const ovBack = '<div class="row top"><button class="link" data-ov="back">← Tổng quan</button><span></span></div>';
document.addEventListener('click', e => { if (e.target.closest('[data-ov="back"]')) { BACK = null; overview(); } });
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
function overview(sel) { BACK = null; window.CUR = { view: 'tong-quan' };
  const loaded = PA && Object.values(KIT).every(P => P.items);
  if (!loaded) Promise.all([paLoad(), ...Object.values(KIT).map(kLoad)]).then(() => { if (document.getElementById('ov')) overview(sel); }).catch(() => {});
  const stage = ovStage(); if (sel) OV_SEL = sel; const lv = OV_SEL && OV_LV.includes(OV_SEL) ? OV_SEL : stage;
  const ids = OV.filter(([id]) => ovIn(id, lv)), st = ids.map(([id]) => ovStat(id, lv)), req = ovReq(lv), done = req.filter(([id]) => ovPassed(id, lv)).length, refs = ids.filter(([id]) => ovRef(id));
  const absent = OV.filter(([id]) => !ovIn(id, lv)).map(([, ic, t]) => ic + ' ' + t);
  // Nên làm: bài cần ôn (mọi phần, cấp đang học của phần); không có thì bài mới của phần có 📘 Học thấp nhất trong cấp đang học
  const dueAll = loaded ? OV.map(([id, ic, t]) => { const l = id === 'tv' ? curLevel() : id === 'pa' ? paLevel() : kLv(KIT[id]); return [[id, ic, t], ovStat(id, l), l]; }).filter(([, s]) => s && s.due).sort((a, b) => b[1].due - a[1].due)[0] : null;
  const lowS = OV.filter(([id]) => ovIn(id, stage) && !ovPassed(id, stage)).map(o => [o, ovStat(o[0], stage)]).filter(([, s]) => s && s.lq < 100).sort((a, b) => a[1].lq - b[1].lq)[0];
  // v86: một chỗ bảo "làm gì" = ô 📅 Hôm nay (bỏ ▶ Nên làm, 🗓 Gợi ý mỗi ngày ~45 phút: trái với mục tiêu phút); việc ôn / bài mới mở thẳng phần cần làm
  const chip = l => { const ok = ovDone(l), cur = l === stage;
    return `<button class="chip ${l === lv ? 'on' : ''}" data-ovl="${l}">${ok ? '✅ ' : cur ? '▶ ' : OV_LV.indexOf(l) > OV_LV.indexOf(stage) ? '🔒 ' : ''}${LVN[l]}</button>`; };
  const tips = { due: dueAll ? [dueAll[0][0], dueAll[2]] : null, low: lowS ? [lowS[0][0], stage] : null };
  // hiện dần: người mới chỉ thấy Hôm nay + xếp cấp + các phần; 🧰 luyện thi mở khi có phần đầu tiên qua thi hoặc từ A2; sẵn sàng thi khi ≥ 3 phần của cấp qua thi
  const showLv = OV_ALL ? OV_LV : OV_LV.filter(l => OV_LV.indexOf(l) <= Math.max(OV_LV.indexOf(stage) + 1, OV_LV.indexOf(lv)));
  const prevMq = ovMqLS(), nextMq = { ...prevMq }, drop = (id, s) => { const k = id + '|' + lv, o = prevMq[k]; if (loaded && s) nextMq[k] = s.mq; return o != null && s && s.mq < o ? o - s.mq : 0; };
  const ai = LEVELS.indexOf(lv) >= LEVELS.indexOf('b1');
  $app.innerHTML = `<div id="ov"></div><h1>🎯 Học CEFR</h1><p class="mute"><span id="sync">${esc(sync)}</span></p>
    ${S.fake ? '<p class="mute" style="margin:4px 0">🧪 Đang dùng dữ liệu thử (💾 Dữ liệu để quay lại dữ liệu thật).</p>' : ''}
    <p style="margin:6px 0">Cấp đang học: <b>${LVN[stage]}</b>${typeof plTop === 'function' && plTop(stage) ? ` · 🧭 xếp cấp: ${LVN[plTop(stage)]}` : ''}</p>
    ${typeof todayBox === 'function' ? todayBox(stage, tips) : ''}
    <div class="chips">${showLv.map(chip).join('')}${OV_ALL ? '' : '<button class="chip" data-ovall>⋯ Mọi cấp</button>'}</div>
    <div class="box"><div class="row"><b>Cấp ${LVN[lv]}: ${ids.length} phần</b><span class="mute">qua thi ${done}/${req.length} phần bắt buộc</span></div>${bar(Math.round(done / (req.length || 1) * 100), 100, 'var(--good)')}
      <p class="mute" style="margin:6px 0 0">Hoàn thành ${LVN[lv]} trong app khi ${req.length} phần bắt buộc qua 🚪 Thi chuyển cấp.${refs.length ? ` ${refs.map(([, ic, t]) => ic + ' ' + t).join(', ')}: máy chấm gián tiếp nên chỉ để tham khảo, vẫn nên luyện.` : ''}${absent.length ? ` Cấp này chưa có: ${absent.join(', ')}.` : ''}
        Hoàn thành trong app chưa phải bằng CEFR: muốn biết đã đạt ${LVN[lv]} thật chưa, làm 📝 đề mẫu chính thức ở 🎓 Luyện thi.</p>
      ${ai ? '<p class="mute" style="margin:6px 0 0">🤖 Nội dung cấp này do AI soạn, chưa giáo viên kiểm. Thấy câu sai: bấm 💬 → ⚑ Câu sai.</p>' : ''}
      ${OV_LV.indexOf(lv) > OV_LV.indexOf(stage) ? `<p class="mute" style="margin:6px 0 0">🔒 Xem trước: nên học khi đã hoàn thành ${LVN[stage]}. Vẫn mở để học trước nếu muốn.</p>${typeof vcView === 'function' ? `<button data-vcv="${lv}" style="margin-top:6px">🚀 Đã biết cấp này? Thi vượt lên ${LVN[lv]}</button>` : ''}` : ''}</div>
    ${ids.map(([id, ic, t], i) => { const s = st[i], dr = drop(id, s);
      return `<button class="box ovc" data-ovp="${id}" data-ovpl="${lv}" style="width:100%;text-align:left;display:block">
        <div class="row"><b style="font-size:18px">${ic} ${t}</b><span class="mute">${ovRef(id) ? 'tham khảo · ' : ''}${s ? (s.gate === 'pass' ? '✅ qua thi' : s.gate === 'open' ? '🚪 thi được' : '') : '…'} ›</span></div>
        ${s ? `<div class="dims" style="margin-top:4px"><div><div class="row"><span>📘 Học</span><span class="mute">${s.lq}%</span></div>${bar(s.lq, GATE_LEARN, 'var(--accent)')}</div>
          <div><div class="row"><span>🔁 Nhớ</span><span class="mute">${s.mq}%</span></div>${bar(s.mq, GATE_MEM, 'var(--good)')}</div></div>
          ${ovNeedLine(s, lv === stage)}${dr ? `<p class="mute" style="margin:4px 0 0">🔻 Nhớ giảm ${dr}% từ lần trước: có mục quá hạn ôn, khả năng nhớ xuống dưới ${GATE_MEM}%.${s.due ? ` Ôn ${s.due} bài để lấy lại.` : ''}</p>` : s.due ? `<p class="mute" style="margin:4px 0 0">${s.due} bài cần ôn</p>` : ''}` : '<p class="mute" style="margin:4px 0 0">Đang tải…</p>'}</button>`; }).join('')}
    ${typeof libBox === 'function' ? libBox(lv) : ''}
    <p class="mute" style="margin:10px 0 0">🎓 Đề thử Cambridge, dạng đề, sẵn sàng thi: tab 🎓 Luyện thi. 📌 Sổ từ, 📒 Sổ lỗi, 🗺 chỗ yếu, tiến độ, 📘 luật và cách dùng: tab 👤 Của tôi.</p>`;
  if (loaded) ovMqLS(nextMq);
  $app.onclick = e => { if (e.target.closest('[data-ovall]')) { OV_ALL = true; return overview(); } const c = e.target.closest('[data-ovl]'); if (c) return overview(c.dataset.ovl);
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
