// 📝 Đề thật (v87, 30/10/2026, người sáng lập: "làm hết đi khỏi hỏi" sau đánh giá phần IELTS). Ý: app không cố tự soạn cho đủ đề (đề AI không thêm uy tín);
// người học luyện bằng đề chính thức (sách Cambridge IELTS, đề luyện của IELTS / British Council / IDP), app là trợ lý bao quanh đề thật:
//   ① nhập kết quả theo TỪNG CÂU: chia khối câu × dạng (như "Questions 1–6" trong đề), chạm câu sai → band theo bảng quy đổi (o.off, hiệu chuẩn),
//      % đúng theo dạng (o.ty, src 'that') → 🗺 Bản đồ band chạy trên dữ liệu đề thật; câu sai ghi lại để xem lại (o.th).
//   ② 📥 lấy từ mới từ đề thật: dán đoạn văn / lời nghe → chọn từ chưa chắc → bộ thẻ riêng S.ie.vw (hộp Leitner 1 → 35 ngày, tự chấm nhớ / quên).
//      Từ đã học trong 🎯 Học CEFR thì đánh dấu "chưa nhớ" như tra từ (mfLookup, luật v76 đã duyệt). Không tạo thẻ CEFR mới: không đổi 📘 Học / 🔁 Nhớ.
// Không tính vào luật đo CEFR.

// dạng câu của đề thật mà kho app chưa có bài (chỉ luyện bằng đề thật rồi nhập kết quả); tỉ trọng ước theo đề thật thường gặp
Object.assign(IE_TY, { 'R-mi': 'Ghép thông tin với đoạn (Matching information)', 'R-mf': 'Ghép đặc điểm / tên (Matching features)', 'R-se': 'Nối nửa câu (Sentence endings)',
  'R-yn': 'Yes / No / Not Given (ý tác giả)', 'R-sum': 'Điền tóm tắt (Summary completion)', 'R-dia': 'Điền sơ đồ / bảng / quy trình', 'R-sa': 'Trả lời ngắn (Short answer)',
  'L-map': 'Nghe điền bản đồ / sơ đồ', 'L-match': 'Nghe ghép (Matching)', 'L-sa': 'Nghe trả lời ngắn', 'R-para': 'Diễn đạt lại (Paraphrase)' });
Object.assign(IM_W, { 'R-para': 0.25, 'R-mi': 0.15, 'R-mf': 0.1, 'R-se': 0.08, 'R-yn': 0.15, 'R-sum': 0.15, 'R-dia': 0.08, 'R-sa': 0.08, 'L-map': 0.15, 'L-match': 0.15, 'L-sa': 0.1 });
Object.assign(IE_HOW, {
  mi: ['🔎 Ghép thông tin với đoạn', ['Câu hỏi KHÔNG theo thứ tự bài; một đoạn có thể dùng nhiều lần.', 'Gạch loại thông tin câu hỏi tìm (một ví dụ, một lý do, một so sánh…), rồi lướt từng đoạn tìm đúng loại đó.', 'Làm sau cùng nếu cùng bài có dạng khác: đọc các dạng kia xong đã quen bài.']],
  mf: ['👤 Ghép đặc điểm / tên', ['Gạch tên người / mốc trong bài trước (tên hay in nghiêng, có năm).', 'Đọc câu quanh mỗi tên, so với các nhận định; nhận định được diễn đạt lại, ít khi trùng từ.']],
  se: ['🧩 Nối nửa câu', ['Câu theo thứ tự bài. Ghép phải đúng ngữ pháp VÀ đúng nghĩa trong bài.', 'Loại trước các vế không hợp ngữ pháp, rồi tìm chỗ bài nói về nửa đầu câu.']],
  yn: ['💭 YES / NO / NOT GIVEN', ['Hỏi ý kiến / nhận định của TÁC GIẢ, không phải sự kiện.', 'Tìm từ thể hiện thái độ (I believe, clearly, unfortunately, it is doubtful…). Tác giả không bày tỏ → NOT GIVEN.']],
  sum: ['📝 Điền tóm tắt', ['Tóm tắt thường chỉ lấy một phần bài: tìm câu đầu tóm tắt ở đâu trong bài.', 'Có bảng từ: đoán loại từ, nghĩa thường được diễn đạt lại. Không có bảng: chép đúng từ trong bài, đúng giới hạn số từ.']],
  dia: ['🗂 Điền sơ đồ / bảng / quy trình', ['Xem hướng đọc của sơ đồ (trên → dưới, trái → phải) và tiêu đề cột.', 'Thông tin thường nằm gọn một đoạn; chép đúng từ, đúng giới hạn số từ.']],
  sa: ['❓ Trả lời ngắn', ['Gạch từ hỏi (what, where, how many…) để biết loại câu trả lời.', 'Theo thứ tự bài; trả lời đúng giới hạn số từ, không viết lại cả câu.']],
  map: ['🗺 Nghe điền bản đồ', ['Trước khi nghe: tìm điểm xuất phát, lối vào, hướng (north, opposite, next to, at the end of).', 'Nghe theo đường đi của người nói; giới từ chỉ vị trí là chìa khoá.']],
  para: ['🔁 Diễn đạt lại (paraphrase)', ['Câu hỏi gần như không bao giờ chép nguyên câu trong bài: từ được thay bằng từ đồng nghĩa, đổi loại từ (rise → an increase), đổi chủ động / bị động.', 'Đừng chọn câu chỉ vì trùng nhiều từ với câu hỏi: đó thường là bẫy.', 'Soát 3 thứ: ai làm, làm gì, khi nào / bao nhiêu. Một chữ "only", "not yet", "first" đổi cả nghĩa.']],
  match: ['🔗 Nghe ghép', ['Đọc kỹ danh sách phương án trước: thường có phương án thừa và phương án được nhắc tới để đánh lạc hướng.', 'Đáp án theo thứ tự câu hỏi, nghe ý được diễn đạt lại, không chờ đúng từ.']] });
Object.assign(IM_HOWK, { 'R-para': 'para', 'R-mi': 'mi', 'R-mf': 'mf', 'R-se': 'se', 'R-yn': 'yn', 'R-sum': 'sum', 'R-dia': 'dia', 'R-sa': 'sa', 'L-map': 'map', 'L-match': 'match', 'L-sa': 'listen' });
// dạng nào app có bài luyện riêng (còn lại: chữa bằng đề thật)
const TH_APP = new Set(['R-h', 'R-tf', 'R-comp', 'R-mc', 'R-gt', 'L-form', 'L-mc', 'L-map', 'L-match']);
const TH_SK = { L: ['🎧', 'Listening'], R: ['📖', 'Reading'] };
const TH_DEF = { L: [[1, 10, 'L-form'], [11, 20, 'L-mc'], [21, 30, 'L-match'], [31, 40, 'L-form']], R: [[1, 13, 'R-tf'], [14, 26, 'R-mi'], [27, 40, 'R-mc']] };
const thTys = sk => Object.keys(IE_TY).filter(k => k[0] === sk && k !== 'R-gt' && k !== 'R-para');
let TH = null;   // màn nhập đang làm: { sk, name, blocks: [[từ, đến, dạng]], wrong: Set }

// ---------- ① nhập kết quả đề thật theo từng câu ----------
function ieThat(sk) { if (!TH || (sk && TH.sk !== sk)) TH = { sk: sk || (TH && TH.sk) || 'L', name: TH ? TH.name : '', blocks: TH_DEF[sk || 'L'].map(b => [...b]), wrong: new Set() };
  window.CUR = { view: 'ielts-de-that' }; const T = TH, tys = thTys(T.sk), cov = thCover(T), ok = 40 - T.wrong.size;
  $app.innerHTML = `<div id="ie"></div><div class="row top"><button class="link" data-a="back">← Học IELTS</button><span class="uname">📝 Nhập đề thật</span></div><h1>📝 Kết quả đề thật</h1>
    <p class="mute">Làm đề chính thức (sách Cambridge IELTS, đề luyện của IELTS / British Council / IDP) đủ giờ, chấm theo đáp án của đề, rồi nhập ở đây. Mất ~3 phút.</p>
    <div class="chips">${Object.entries(TH_SK).map(([k, [ic, n]]) => `<button class="chip ${T.sk === k ? 'on' : ''}" data-ths="${k}">${ic} ${n}</button>`).join('')}</div>
    <label class="mute">Tên đề<input id="thn" value="${esc(T.name)}" placeholder="vd. Cambridge 18 · Test 2"></label>
    <div class="box"><b>1. Chia khối câu theo dạng</b><p class="mute" style="margin:4px 0">Xem dòng "Questions 1–6" trong đề: mỗi khối một dạng câu.</p>
      ${T.blocks.map(([a, b, ty], i) => `<div class="row" style="gap:6px;margin:6px 0;align-items:center"><span>Câu</span><input type="number" min="1" max="40" value="${a}" data-thb="${i}|0" style="width:62px;margin:0"><span>–</span><input type="number" min="1" max="40" value="${b}" data-thb="${i}|1" style="width:62px;margin:0">
        <select data-thb="${i}|2" style="flex:1;margin:0">${tys.map(k => `<option value="${k}" ${k === ty ? 'selected' : ''}>${esc(IE_TY[k])}</option>`).join('')}</select><button class="link" data-thx="${i}" aria-label="Bỏ khối">✕</button></div>`).join('')}
      <button data-tha>+ Thêm khối</button>${cov.gap.length ? `<p class="mute" style="margin:6px 0 0">⚠️ Chưa có dạng: câu ${thRange(cov.gap)}.</p>` : ''}${cov.dup.length ? `<p class="mute" style="margin:6px 0 0">⚠️ Trùng khối: câu ${thRange(cov.dup)}.</p>` : ''}</div>
    <div class="box"><div class="row"><b>2. Chạm vào câu SAI</b><span><b>${ok}</b>/40 · band ${bandTxt(ieRaw(T.sk === 'L' ? IE_L : ieSt().type === 'gt' ? IE_RG : IE_RA, ok, 40))}</span></div>
      <div style="display:grid;grid-template-columns:repeat(8,1fr);gap:4px;margin-top:8px">${[...Array(40)].map((_, i) => `<button class="chip ${T.wrong.has(i + 1) ? 'on' : ''}" data-thq="${i + 1}" style="margin:0;padding:8px 0;min-width:0${T.wrong.has(i + 1) ? ';background:var(--bad);color:#fff' : ''}">${i + 1}</button>`).join('')}</div>
      <p class="mute" style="margin:6px 0 0">Đỏ = sai hoặc bỏ trống. Chạm lại để bỏ.</p></div>
    <button class="pri" data-thsave>💾 Lưu kết quả</button>`;
  $app.onclick = e => { const g = s => e.target.closest(s); let b; const nm = document.getElementById('thn'); if (nm) T.name = nm.value;
    if (g('[data-a="back"]')) { TH = null; return ieltsView(); }
    if ((b = g('[data-ths]'))) { TH = null; return ieThat(b.dataset.ths); }
    if ((b = g('[data-thq]'))) { const n = +b.dataset.thq; T.wrong.has(n) ? T.wrong.delete(n) : T.wrong.add(n); return ieThat(); }
    if ((b = g('[data-thx]'))) { T.blocks.splice(+b.dataset.thx, 1); return ieThat(); }
    if (g('[data-tha]')) { const last = T.blocks[T.blocks.length - 1], a = last ? Math.min(40, last[1] + 1) : 1; T.blocks.push([a, 40, tys[0]]); return ieThat(); }
    if (g('[data-thsave]')) return thSave(); };
  $app.onchange = e => { const el = e.target.closest('[data-thb]'); if (!el) return; const [i, j] = el.dataset.thb.split('|').map(Number); T.blocks[i][j] = j === 2 ? el.value : Math.max(1, Math.min(40, +el.value || 1)); ieThat(); }; }
// câu 1–40: câu chưa có khối (gap) và câu thuộc 2 khối (dup)
function thCover(T) { const c = Array(41).fill(0); for (const [a, b] of T.blocks) for (let n = Math.min(a, b); n <= Math.max(a, b); n++) c[n]++;
  const gap = [], dup = []; for (let n = 1; n <= 40; n++) { if (!c[n]) gap.push(n); if (c[n] > 1) dup.push(n); } return { gap, dup }; }
const thRange = ns => { const out = []; for (let i = 0; i < ns.length; i++) { let j = i; while (j + 1 < ns.length && ns[j + 1] === ns[j] + 1) j++; out.push(i === j ? ns[i] : ns[i] + '–' + ns[j]); i = j; } return out.join(', '); };
const thTyOf = (T, n) => { const b = T.blocks.find(([a, c]) => n >= Math.min(a, c) && n <= Math.max(a, c)); return b ? b[2] : null; };
function thSave(now = Date.now()) { const T = TH, o = ieSt(), cov = thCover(T); if (cov.dup.length) return toast('Có câu thuộc 2 khối: sửa khối trước khi lưu.');
  if (cov.gap.length && !confirm(`Câu ${thRange(cov.gap)} chưa có dạng: vẫn tính vào band, nhưng không vào bản đồ theo dạng. Lưu?`)) return;
  const ok = 40 - T.wrong.size, name = (T.name || '').trim() || 'Đề thật ' + new Date(now).toLocaleDateString('vi-VN'), id = 'that:' + name;
  const band = ieRaw(T.sk === 'L' ? IE_L : o.type === 'gt' ? IE_RG : IE_RA, ok, 40);
  o.off.push({ at: now, [T.sk === 'L' ? 'rl' : 'rr']: ok, [T.sk]: band, type: o.type, name, src: 'that' });   // hiệu chuẩn band (ieCal) + 🎯 Sẵn sàng thi
  // theo dạng: mỗi câu một kết quả; đề thật luôn là bài mới → mỗi dạng ≥ 4 câu là một lần thử của bản đồ band
  const res = []; for (let n = 1; n <= 40; n++) { const ty = thTyOf(T, n); if (ty) res.push({ q: { ty, x: { id } }, ok: !T.wrong.has(n) }); }
  const by = ieTyLog(res, 'that');
  o.th = [...(o.th || []), { at: now, sk: T.sk, name, ok, band, wrong: [...T.wrong].sort((a, b) => a - b), blocks: T.blocks.map(b => [...b]) }].slice(-30);
  S.t = now; save(); TH = null; thResult(o.th[o.th.length - 1], by); }
function thResult(r, by) { window.CUR = { view: 'ielts-de-that-kq' };
  const rows = Object.entries(by || {}).sort((a, b) => a[1].ok / a[1].n - b[1].ok / b[1].n);
  $app.innerHTML = `<div id="ie"></div><h1>📝 ${esc(r.name)}</h1><div class="box"><b>${TH_SK[r.sk][0]} ${TH_SK[r.sk][1]}: ${r.ok}/40 · band ${bandTxt(r.band)}</b>
      <p class="mute" style="margin:6px 0 0">Theo bảng quy đổi điểm thô thường dùng của IELTS (mỗi đề chênh ±0,5 band). App dùng kết quả này để chỉnh band ước của bạn.</p></div>
    ${rows.length ? `<div class="box"><b>Theo dạng câu</b>${rows.map(([ty, b]) => { const p = Math.round(b.ok / b.n * 100); return `<div class="row" style="margin-top:6px"><span>${p < IE_TY_OK ? '⚠️' : '✅'} ${esc(IE_TY[ty])}</span><span class="mute">${b.ok}/${b.n} · ${p}%</span></div>`; }).join('')}
      <p class="mute" style="margin:6px 0 0">Dạng dưới ${IE_TY_OK}% vào 🗺 Bản đồ band (cần ≥ ${IE_TY_N} câu ở ≥ 2 đề mới chắc).</p></div>` : ''}
    ${r.wrong.length ? `<div class="box"><b>Câu sai: xem lại vì sao sai</b><p style="margin:6px 0">${r.wrong.join(', ')}</p><p class="mute" style="margin:0">Mở lại đề, đọc lời giải / bản ghi lời nghe: tìm chỗ bài diễn đạt lại ý của câu hỏi. Từ chưa biết thì 📥 lấy vào bộ thẻ.</p></div>` : ''}
    <button class="pri" data-thv>📥 Lấy từ mới từ đề này</button><button data-a="back">← Học IELTS</button>`; scrollTo(0, 0);
  $app.onclick = e => { if (e.target.closest('[data-thv]')) return vwAdd(r.name); if (e.target.closest('[data-a="back"]')) ieltsView(); }; }

// ---------- ② 📥 từ mới từ đề thật: bộ thẻ riêng, hộp Leitner ----------
const VW_DAYS = [1, 3, 7, 16, 35], VW_MAX = 60;
const vwSt = () => { const o = ieSt(); return (o.vw = o.vw || []); };
const vwDue = (now = Date.now()) => vwSt().filter(x => x.box < VW_DAYS.length && x.due <= now);
// từ phổ biến bỏ qua khi tìm: từ app cấp ≤ A2 mà đã học
const VW_STOP = new Set('the a an and or but of to in on at for with by from as is are was were be been being have has had do does did this that these those it its they them their there here which who whom whose what when where why how not no yes can could will would shall should may might must about into than then also very more most such only other some any each every all both few many much own same so too just over under again further once'.split(' '));
// tách ứng viên từ một đoạn: từ ≥ 3 chữ, bỏ từ phổ biến; mỗi từ: { t (dạng gặp), w (từ app / từ điển nếu có), lv, ex (câu chứa từ), learned }
function vwCands(text, now = Date.now()) { const sents = kSents(String(text || '')), seen = new Map();
  for (const s of sents) for (const t of s.match(/[A-Za-z][A-Za-z'-]{2,}/g) || []) { const low = t.toLowerCase(); if (VW_STOP.has(low)) continue;
    const w = typeof libFind === 'function' ? libFind(low) : null, key = w ? w.w.toLowerCase() : low; if (seen.has(key)) continue;
    const lv = w ? (w.lv || (typeof wLv === 'function' && WBY[w.id] ? wLv(w) : null)) : null, c = w && S.cards[w.id], learned = !!c;
    if (learned && lv && LEVELS.indexOf(lv) <= LEVELS.indexOf('a2') && wstat(S, w, now) !== 'quen') continue;   // từ dễ đã nhớ: bỏ
    seen.set(key, { t: low, key, w, lv, ex: s.trim().slice(0, 240), learned }); }
  const rank = c => c.lv ? LEVELS.indexOf(c.lv) : 99;   // từ app không có (thường khó, học thuật) lên đầu
  return [...seen.values()].sort((a, b) => rank(b) - rank(a)).slice(0, VW_MAX); }
async function vwAdd(src) { window.CUR = { view: 'ielts-tu-de-that' }; if (typeof loadRef === 'function' && !REF) { try { await loadRef(); LIBW = null; } catch (e) {} }
  $app.innerHTML = `<div id="ie"></div><div class="row top"><button class="link" data-a="back">← Học IELTS</button><span class="uname">📥 Từ mới từ đề thật</span></div><h1>📥 Lấy từ mới</h1>
    <p class="mute">Dán đoạn đọc hoặc lời nghe (bản ghi cuối sách) của đề vừa làm. App tách từ, bạn chọn từ chưa chắc để ôn cách quãng.</p>
    <label class="mute">Nguồn<input id="vws" value="${esc(src || '')}" placeholder="vd. Cambridge 18 · Test 2 · Reading 1"></label>
    <textarea id="vwt" rows="8" placeholder="Dán đoạn văn tiếng Anh vào đây…"></textarea><button class="pri" data-vwf>🔎 Tìm từ</button><div id="vwc"></div>
    <details class="box"><summary>➕ Thêm một từ bằng tay</summary><input id="vwm" placeholder="từ / cụm từ"><input id="vwmv" placeholder="nghĩa tiếng Việt (tuỳ chọn)"><input id="vwme" placeholder="câu ví dụ trong đề (tuỳ chọn)"><button data-vwm>➕ Thêm</button></details>`;
  let C = [];
  $app.onclick = e => { const g = s => e.target.closest(s);
    if (g('[data-a="back"]')) return ieltsView();
    if (g('[data-vwf]')) { C = vwCands(document.getElementById('vwt').value); const el = document.getElementById('vwc');
      el.innerHTML = C.length ? `<div class="box"><b>${C.length} từ</b> <span class="mute">· chọn từ bạn chưa chắc nghĩa</span>${C.map((c, i) => `<label style="display:flex;gap:8px;align-items:flex-start;margin:8px 0"><input type="checkbox" data-vwi="${i}" style="width:auto;margin:4px 0 0">
        <span><b>${esc(c.w ? c.w.w : c.t)}</b> <span class="mute">${c.lv && LVN[c.lv] ? LVN[c.lv] : 'ngoài từ điển app'}${c.learned ? ' · đã học ở CEFR' : ''}</span>${c.w && c.w.vi ? `<br><span class="mute">${esc(c.w.vi)}</span>` : ''}</span></label>`).join('')}
        <button class="pri" data-vws>➕ Thêm từ đã chọn vào bộ thẻ</button></div>` : '<p class="mute">Chưa thấy từ nào (đoạn quá ngắn hoặc toàn từ dễ đã nhớ).</p>'; return; }
    if (g('[data-vws]')) { const pick = [...$app.querySelectorAll('[data-vwi]')].filter(x => x.checked).map(x => C[+x.dataset.vwi]); if (!pick.length) return toast('Chưa chọn từ nào.');
      const n = vwPut(pick.map(c => ({ w: c.w ? c.w.w : c.t, vi: c.w && c.w.vi || '', ex: c.ex, app: c.learned ? c.w : null })), document.getElementById('vws').value);
      toast(`Đã thêm ${n} từ. Ôn lần đầu ngay hôm nay.`); return ieltsView(); }
    if (g('[data-vwm]')) { const w = document.getElementById('vwm').value.trim(); if (!w) return toast('Nhập từ trước.');
      const n = vwPut([{ w, vi: document.getElementById('vwmv').value.trim(), ex: document.getElementById('vwme').value.trim(), app: null }], document.getElementById('vws').value);
      toast(n ? 'Đã thêm.' : 'Từ này đã có trong bộ thẻ.'); document.getElementById('vwm').value = ''; } }; }
// thêm vào bộ thẻ (bỏ trùng); từ đã học ở CEFR → đánh dấu chưa nhớ (như tra từ)
function vwPut(list, src, now = Date.now()) { const L = vwSt(); let n = 0;
  for (const x of list) { const k = x.w.toLowerCase(); if (L.some(y => y.k === k)) continue;
    L.push({ id: 'v' + now.toString(36) + L.length, k, w: x.w, vi: x.vi || '', ex: x.ex || '', src: String(src || '').slice(0, 80), at: now, box: 0, due: now, n: 0, lapse: 0 }); n++;
    if (x.app && typeof mfLookup === 'function') mfLookup(x.app, now); }
  if (n) { S.t = now; save(); } return n; }
function vwRun(now = Date.now()) { const due = shuf(vwDue(now)).slice(0, 20); if (!due.length) return toast('Chưa có từ đến hạn ôn.'); let i = 0, ok = 0;
  const show = () => { if (i >= due.length) return end(); const x = due[i]; window.CUR = { view: 'ielts-on-tu', item: x.id };
    const ex = x.ex ? esc(x.ex).replace(new RegExp(`\\b(${x.w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\w*)`, 'i'), '<b>$1</b>') : '';
    $app.innerHTML = `<div class="row top"><button class="link" data-a="back">← Thôi</button><span class="uname">📥 Ôn từ đề thật · ${i + 1}/${due.length}</span></div>
      <p class="q" style="font-size:28px">${esc(x.w)}</p>${ex ? `<p style="margin:4px 0">${ex}</p>` : ''}<p class="mute">${esc(x.src || '')}</p>
      <div id="vwa"><button class="pri" data-vw="show">👀 Nghĩa là gì? (nghĩ trước rồi xem)</button></div>`;
    $app.onclick = e => { const b = e.target.closest('[data-vw]'); if (e.target.closest('[data-a="back"]')) return ieltsView(); if (!b) return; const a = b.dataset.vw;
      if (a === 'show') { document.getElementById('vwa').innerHTML = `<div class="box">${x.vi ? `<b>${esc(x.vi)}</b>` : '<span class="mute">Chưa có nghĩa: tra từ điển rồi ghi vào đây.</span>'}<input id="vwv" value="${esc(x.vi)}" placeholder="sửa / ghi nghĩa tiếng Việt"></div>
          <div class="duo"><button data-vw="no">❌ Chưa nhớ</button><button class="pri" data-vw="ok">✅ Nhớ</button></div>`; return; }
      const v = document.getElementById('vwv'); if (v) x.vi = v.value.trim();
      x.n++; if (a === 'ok') { x.box++; ok++; x.due = now + VW_DAYS[Math.min(x.box, VW_DAYS.length) - 1] * DAY; } else { x.box = 0; x.lapse++; x.due = now; }
      S.t = Date.now(); save(); i++; show(); }; };
  const end = () => { $app.innerHTML = `<div class="box"><b>✅ Xong ${due.length} từ</b><p>Nhớ ${ok}/${due.length}. Từ chưa nhớ sẽ hỏi lại lần ôn sau.</p><p class="mute">Thuộc ${vwSt().filter(x => x.box >= VW_DAYS.length).length}/${vwSt().length} từ (qua hộp ${VW_DAYS[VW_DAYS.length - 1]} ngày).</p></div><button class="pri" data-a="back">← Học IELTS</button>`;
    scrollTo(0, 0); $app.onclick = e => { if (e.target.closest('[data-a="back"]')) ieltsView(); }; };
  show(); }

// ---------- ③ 🔁 luyện diễn đạt lại: câu hỏi ↔ câu trong bài cùng ý (kho IE.para, Claude soạn) ----------
const ieParaQs = (n = 10) => iePick(IE.para || [], n).map(x => ({ x, k: 'para', ty: 'R-para', kind: 'mc', head: `<p class="mute">Câu hỏi trong đề hay DIỄN ĐẠT LẠI ý của bài bằng từ khác. Chọn câu trong bài nói <b>CÙNG Ý</b> với câu hỏi.</p>`,
  q: `Câu hỏi: «${esc(x.s)}»`, opts: shuf([x.a, ...x.w]), a: x.a, why: `${x.why} Cặp từ: ${x.p.map(([a, b]) => a + ' → ' + b).join(' · ')}.` }));
const ieParaRun = () => { const qs = ieParaQs(10); scrollTo(0, 0); return qs.length ? ieRun('🔁 Diễn đạt lại', qs, ieltsView) : toast('Chưa có bài.'); };
document.addEventListener('click', e => { if (S && e.target.closest('[data-iepara]')) ieParaRun(); });

// ---------- ô 📝 Đề thật ở màn Học IELTS ----------
function thBox() { const o = ieSt(), th = (o.th || []).slice(-3).reverse(), vd = vwDue().length, vn = vwSt().length;
  return `<div class="box"><b>📝 Luyện bằng đề thật</b><p class="mute" style="margin:6px 0">Đề chính thức đáng tin hơn đề app tự soạn. Làm đề trong sách Cambridge IELTS hoặc đề luyện miễn phí, rồi nhập kết quả từng câu: app tìm dạng câu làm mất điểm và chỉnh band ước.</p>
    ${th.map(r => `<p style="margin:2px 0;font-size:15px">${TH_SK[r.sk][0]} ${esc(r.name)} <span class="mute">· ${r.ok}/40 · band ${bandTxt(r.band)} · ${new Date(r.at).toLocaleDateString('vi-VN')}</span></p>`).join('')}
    <div class="duo"><button class="big2" data-th="L">🎧 Nhập Listening<small>40 câu</small></button><button class="big2" data-th="R">📖 Nhập Reading<small>40 câu</small></button></div>
    <button data-vwadd>📥 Lấy từ mới từ đề thật</button>${vn ? `<button ${vd ? 'class="pri"' : ''} data-vwrun>🔁 Ôn từ đề thật${vd ? `: ${vd} từ đến hạn` : ''} <span class="mute">· ${vn} từ</span></button>` : ''}</div>`; }
document.addEventListener('click', e => { if (!S) return; const b = e.target.closest('[data-th], [data-vwadd], [data-vwrun]'); if (!b) return; scrollTo(0, 0);
  if (b.dataset.th) { TH = null; return ieThat(b.dataset.th); } if (b.hasAttribute('data-vwadd')) return vwAdd(''); if (b.hasAttribute('data-vwrun')) return vwRun(); });
