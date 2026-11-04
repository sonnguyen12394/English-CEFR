// 🗺 Bản đồ Cambridge (v121, người sáng lập: "Tôi muốn thấy bản đồ của các mục tiêu"). Cùng khuôn với IELTS / TOEIC (v120):
//   🎯 Việc cần chữa (MỘT nút) → lưới ô có tên + số đo → ghi chú. Ô = PHẦN của đề (khuôn 🎓 đề thử MOCK[cấp]), không phải bài:
//   đề Cambridge chấm theo phần; làm lại bài cũ là nhớ đáp án, nên chỗ yếu đo trên lần làm gần đây.
// Bằng chứng mỗi ô: 🎓 đề thử theo phần (mkResult lưu pp từ v121; đề thử cũ chỉ có điểm cả bài thi nên không dùng),
//   🧩 dạng đề thật (S.uoe, B1+), 🎧 nghe điền (S.ng.nf, A2+), 👥 nói cặp (S.cap, A2+), 🗣 Nói của đề thử (điểm 4 tiêu chí).
// Mỗi ô lấy tối đa CB_WIN câu gần nhất (bài điểm % như Viết / Nói: 3 lần gần nhất); đủ chắc = ≥ CB_N câu ở ≥ 2 lần (bài điểm %: ≥ 2 lần);
//   yếu = dưới ngưỡng đạt ước tính của kỳ thi (MOCK.pass: ~70% tới B1, ~60% từ B2; ngưỡng ước, không chính thức).
// Chỉ đọc dữ liệu: không đổi luật đo; không có nhóm đang chữa / tạm gác như IELTS / TOEIC (ô hết yếu khi các lần làm gần đây ổn).
const CB_N = 8, CB_WIN = 20, CB_ST = { yeu: 'yếu', on: 'chưa chắc', vung: 'ổn', chua: 'chưa làm' };
const CB_UK = ['mc', 'open', 'wf', 'kwt', 'long', 'pm', 'sum', 'xt'];
// v129 dạng đề còn thiếu (dangthi.js): khoá theo nhãn phần, đặt trước khoá chung ("nối người", "chọn tranh", "nhìn tranh", "điền từ")
const CB_DT = ['line', 'name', 'colour', 'yn', 'spell', 'box', 'story', 'match5', 'def', 'resp', 'mcc', 'pdesc', 'pmc', 'pstory', 'gpara'];   // v132: + khuyết đoạn C1 / C2
const CB_KEY = [[/nối người nói/, 'mm'], [/khuyết đoạn/, 'gpara'], [/nối tên/i, 'line'], [/viết tên/i, 'name'], [/tô màu/i, 'colour'], [/yes \/ no/i, 'yn'], [/xếp chữ/i, 'spell'], [/chọn từ điền/i, 'box'], [/truyện tranh/i, 'story'],
  [/nối ngày|nối người với vật/i, 'match5'], [/định nghĩa/i, 'def'], [/câu đáp/i, 'resp'], [/đọc, chọn từ đúng/i, 'mcc'], [/nhìn tranh, viết/i, 'pdesc'], [/hội thoại, chọn tranh/i, 'pmc'], [/truyện theo tranh/i, 'pstory'], [/chọn tranh/i, 'picl'], [/nhìn tranh/i, 'picr'], [/trắc nghiệm/, 'mc'], [/tạo dạng từ/, 'wf'], [/từ khoá/, 'kwt'], [/nối câu với (đoạn|người)|nối người/, 'pm'], [/so ý/, 'xt'], [/bài dài/, 'long'], [/tóm tắt/, 'sum'], [/nghe điền/, 'nf'], [/khuyết câu/, 'gap'], [/điền từ/, 'open']];
const CB_SCORE = /email|bài luận|tóm tắt|truyện theo tranh/;   // phần viết: máy chấm điểm 0–1 mỗi bài
const CB_SHORT = { 'đọc tin nhắn, bài báo': 'Đọc tin, bài báo', 'chọn từ (cụm từ)': 'Chọn từ', 'điền từ (ngữ pháp)': 'Điền từ', 'viết email / chuyện': 'Viết email, chuyện',
  'nghe hội thoại, thông báo': 'Nghe hội thoại', 'nghe điền thông tin': 'Nghe điền', 'nghe điền câu': 'Nghe điền câu', 'đọc tin ngắn': 'Đọc tin ngắn', 'đoạn văn khuyết câu': 'Khuyết câu', 'đoạn văn khuyết đoạn': 'Khuyết đoạn',
  'điền từ trắc nghiệm': 'Điền trắc nghiệm', 'điền từ': 'Điền một từ', 'viết lại câu dùng từ khoá': 'Câu từ khoá', 'nối câu với đoạn': 'Nối câu – đoạn', 'email, bài báo / truyện': 'Email, bài viết',
  'bài luận, thư, bài nhận xét': 'Bài luận, thư', 'bài luận, đề xuất, báo cáo': 'Bài luận, báo cáo', 'bài luận / bài báo / báo cáo': 'Bài luận, báo cáo', 'nghe': 'Nghe chọn đáp án',
  'tóm tắt và đánh giá 2 đoạn văn (bắt buộc)': 'Tóm tắt 2 đoạn', 'nối người nói (2 nhiệm vụ)': 'Nối người nói', 'Nghe, chọn tranh': 'Nghe chọn tranh', 'Nhìn tranh, đúng hay sai': 'Tranh đúng / sai', 'nối câu với người': 'Nối câu – người', 'nối người với văn bản': 'Nối người – văn bản', 'so ý giữa 4 văn bản': 'So ý 4 văn bản', 'Nghe bài, chọn đáp án': 'Nghe chọn đáp án', 'Đọc bài, trả lời': 'Đọc trả lời', 'Viết từ vào câu': 'Viết từ',
  'Hiểu nghĩa từ trong câu': 'Nghĩa từ', 'Chọn cụm đúng': 'Chọn cụm', 'Ngữ pháp: chọn từ đúng': 'Ngữ pháp', 'Nói': 'Nói' };
const cbKey = (lab, p) => p.speak ? 'speak' : (CB_KEY.find(([re]) => re.test(lab)) || [0, ''])[1];
const cbShort = lab => { const m = lab.match(/^Phần ([\d–, -]+): (.*)$/), b = m ? m[2] : lab, s = CB_SHORT[b] || b; return s.charAt(0).toUpperCase() + s.slice(1); };
const cbNum = lab => (lab.match(/^Phần ([\d–, -]+):/) || [])[1] || '';
// cấp của bản đồ: cấp người học chọn ở bản đồ → mục tiêu Cambridge → cấp đang xem ở màn 🎓 Cambridge → cấp 🧭 xếp được → cấp đang học
let CBM_LV = null;
const cbMapLv = () => { if (CBM_LV && MOCK[CBM_LV]) return CBM_LV; const g = S.lt && S.lt.goal; if (g && typeof ltKind === 'function' && ltKind(g) === 'cambridge' && MOCK[ltGoalLv(g)]) return ltGoalLv(g);
  const st = ovStage(), l = (typeof CB_LV !== 'undefined' && CB_LV) || (typeof plTop === 'function' && plTop(st)) || st; return MOCK[l] ? l : 'a2'; };
// nguồn luyện cùng dạng, đúng cấp như màn luyện (cấp đầu danh sách có bài)
const cbFirst = (ls, get) => { for (const l of ls) { const its = get([l]); if (its.length) return its; } return []; };
const cbUItems = (k, lv) => typeof uItems === 'function' && typeof UOE !== 'undefined' && UOE ? cbFirst(uLvs(lv), ls => uItems(k, ls)) : [];
const cbNfItems = lv => typeof ngItems === 'function' && LEVELS.indexOf(lv) >= LEVELS.indexOf('a2') && KIT.nghe.items ? cbFirst(ngLvs(lv), ngItems) : [];
// v126 bộ nghe nối người nói của các cấp trong khuôn đề (B2: b2; C1: c1; C2: c2)
const cbMmItems = lv => typeof mmSets === 'function' && LEVELS.indexOf(lv) >= LEVELS.indexOf('b2') ? mmSets().filter(x => LEVELS.slice(LEVELS.indexOf(MOCK[lv].lo), LEVELS.indexOf(lv) + 1).includes(x.lv)) : [];
const cbCapItems = lv => typeof capTasks === 'function' && typeof CAP !== 'undefined' && CAP && LEVELS.indexOf(lv) >= LEVELS.indexOf('a2') ? capTasks(lv) : [];
const cbRuns = lv => Object.entries(S.mock || {}).filter(([l]) => MOCK[l] === MOCK[lv]).flatMap(([, rs]) => rs);   // B1 và B1+ cùng một khuôn đề
function cbCell(o) { const at = o.at.slice().sort((a, b) => b.at - a.at); let ok = 0, n = 0, m = 0;
  for (const a of at) { if (o.score ? m >= 3 : n >= CB_WIN) break; ok += o.score ? a.ok / (a.n || 1) : a.ok; n += o.score ? 1 : a.n; m++; }
  const p = n ? ok / n : null, sure = o.score ? m >= 2 : n >= CB_N && m >= 2, s = !m ? 'chua' : !sure ? 'on' : p < o.pass ? 'yeu' : 'vung';
  return { ...o, p, n, m, sure, s, v: p == null ? '' : Math.round(p * 100) + '%' }; }
function cbRows(lv) { const C = MOCK[lv]; if (!C) return []; const runs = cbRuns(lv), R = S.uoe || {}, NF = (S.ng || {}).nf || {}, CP = S.cap || {};
  return C.papers.map((p, pi) => ({ pi, t: p.t, cells: p.parts.map(([lab], i) => { const k = cbKey(lab, p), score = !!p.speak || CB_SCORE.test(lab), at = [];
    for (const r of runs) { const pr = (r.papers || []).find(x => x.t === p.t); if (!pr) continue;
      if (p.speak && pr.crit) at.push({ at: r.at, ok: pr.ok / 100, n: 1 }); else if (pr.pp && pr.pp[lab]) { const [a, b] = pr.pp[lab]; at.push(score ? { at: r.at, ok: b ? a / b : 0, n: 1 } : { at: r.at, ok: a, n: b }); } }
    if (CB_UK.includes(k)) for (const x of cbUItems(k, lv)) { const r = R[x.id]; if (r && r.n) at.push(score ? { at: r.at, ok: r.ok / r.n, n: 1 } : { at: r.at, ok: r.ok, n: r.n }); }
    if (k === 'nf') for (const x of cbNfItems(lv)) { const r = NF[x.id]; if (r && r.n) at.push({ at: r.at, ok: r.ok, n: r.n }); }
    if (k === 'speak') for (const x of cbCapItems(lv)) { const r = CP[x.id]; if (r && r.pct != null) at.push({ at: r.at, ok: r.pct / 100, n: 1 }); }
    return cbCell({ pi, i, lab, k, score, at, pass: C.pass }); }) })); }
// lý do một dòng: "đúng 9/20 câu gần nhất · cần ~70%" / "điểm 55% (2 lần) · cần ~60%"
const cbWhy = c => `${c.score ? `điểm ${c.v} (${c.m} lần gần nhất)` : `đúng ${Math.round(c.p * c.n)}/${c.n} câu gần nhất`} · cần ~${Math.round(c.pass * 100)}%`;
const cbName = (c, t) => `${t.split(' ')[0]} ${cbNum(c.lab) ? 'Phần ' + cbNum(c.lab) + ': ' : ''}${cbShort(c.lab)}`;
function cbMap(goal, lv = cbMapLv()) { const C = MOCK[lv]; if (!C) return '<p class="mute">Cấp này chưa có khuôn đề Cambridge.</p>';
  const rows = cbRows(lv), all = rows.flatMap(r => r.cells.map(c => ({ ...c, t: r.t }))), cnt = { yeu: 0, on: 0, vung: 0, chua: 0 }; for (const c of all) cnt[c.s]++;
  const weak = all.filter(c => c.s === 'yeu').sort((a, b) => (a.p - a.pass) - (b.p - b.pass)), unsure = all.filter(c => c.s === 'on').sort((a, b) => a.p - b.p), has = all.some(c => c.m);
  const fix = c => `data-cbm="fix|${lv}|${c.pi}|${c.i}"`, top = weak[0];
  const main = top ? `<button class="pri" ${fix(top)} style="margin-top:8px">▶ Chữa phần mất điểm nhiều nhất<small style="display:block;font-weight:400;opacity:.9">${esc(cbName(top, top.t))}</small></button>`
    : unsure[0] ? `<button class="pri" ${fix(unsure[0])} style="margin-top:8px">▶ Làm thêm để biết chắc<small style="display:block;font-weight:400;opacity:.9">${esc(cbName(unsure[0], unsure[0].t))} · ${unsure[0].v}</small></button>`
    : `<button class="pri" data-cbm="mock|${lv}" style="margin-top:8px">▶ ${has ? 'Làm đề thử mới' : 'Làm 1 đề thử để tìm phần yếu'}<small style="display:block;font-weight:400;opacity:.9">${esc(C.name)} · ${C.papers.map(p => p.min).reduce((a, b) => a + b, 0)} phút</small></button>`;
  const row = c => `<button class="urow" ${fix(c)}><span>${esc(cbName(c, c.t))}<small class="why">${esc(cbWhy(c))}</small></span><span class="tag bad">chữa ›</span></button>`;
  const lvs = OV_LV.filter(l => MOCK[l] && (l === lv || !/p$/.test(l)));   // cấp "+" dùng chung khuôn với cấp gốc: chỉ hiện cấp gốc
  return `<h2>🎓 Cambridge ${LVN[lv]}${goal ? ' 🎯' : ''} <span class="mute" style="font-size:15px;font-weight:400">· theo phần của đề</span></h2>
    <p class="mute" style="margin:0 0 6px">${esc(C.name)} · khuôn đề thử của app</p>
    <div class="box"><div class="row"><b>🎯 Việc cần chữa</b><span class="mute">${weak.length} phần yếu</span></div>${main}
      ${top || unsure.length ? `<button class="link" data-cbm="mock|${lv}" style="margin:2px 0 6px">hoặc ▶ Làm cả đề thử (không cần đợi chữa xong)</button>` : `<p class="mute" style="margin:6px 0 0">${has ? `Chưa thấy phần yếu chắc chắn: các phần đã làm ≥ ~${Math.round(C.pass * 100)}%.` : 'Chưa có dữ liệu. 1 đề thử tô màu cả bản đồ; luyện dạng đề cũng tính.'}</p>`}
      ${weak.slice(0, 5).map(row).join('')}${weak.length > 5 ? `<details class="lvmore"><summary>Xem thêm ${weak.length - 5} phần yếu ›</summary>${weak.slice(5).map(row).join('')}</details>` : ''}
      ${unsure.length ? `<p class="mute" style="margin:8px 0 0;font-size:13px">🟨 ${unsure.length} phần đã làm nhưng chưa đủ dữ liệu (cần ≥ ${CB_N} câu ở ≥ 2 lần; Viết / Nói: ≥ 2 lần).</p>` : ''}</div>
    <p class="mleg mute">${Object.keys(CB_ST).map(k => `<span><i class="${k}"></i>${CB_ST[k]} ${cnt[k]}</span>`).join('')}</p>
    <div class="mgrid">${rows.map(r => `<div class="xrow"><span class="ml">${esc(r.t.replace(/ và Dùng tiếng Anh/, ' + Dùng TA'))}<small>${r.cells.length} phần</small></span><span class="xc">${r.cells.map(c => `<button class="xchip ${c.s}" ${fix(c)}>${esc(cbShort(c.lab))}${c.v ? `<b>${c.v}</b>` : ''}</button>`).join('')}</span></div>`).join('')}</div>
    <p class="mute" style="font-size:13px;margin:4px 0 10px">Bấm một ô để luyện đúng phần đó (dạng đề thật, nghe điền, nói cặp; phần khác: làm riêng phần đó như đề thử, có giờ).</p>
    <details class="lvmore"><summary>Xem cấp khác ›</summary><div class="chips">${lvs.map(l => `<button class="chip ${l === lv ? 'on' : ''}" data-cbm="lv|${l}">${LVN[l]}</button>`).join('')}</div></details>
    <details class="box more"><summary><b>Thêm</b> <span class="mute">· cách tính</span></summary>
      <p class="mute" style="margin:6px 0 0">Mỗi ô lấy ${CB_WIN} câu gần nhất của phần đó (Viết / Nói: ${3} lần gần nhất) từ 🎓 đề thử, 🧩 dạng đề thật, 🎧 nghe điền, 👥 nói cặp. Yếu = dưới ngưỡng đạt ước tính của kỳ thi (~${Math.round(C.pass * 100)}%, không chính thức) khi đủ chắc: ≥ ${CB_N} câu ở ≥ 2 lần.</p>
      <p class="mute" style="margin:6px 0 0">Bản đồ chỉ đọc dữ liệu, không đổi luật đo. Đề do app soạn (🤖 chưa giáo viên kiểm), không phải đề Cambridge; kiểm cuối bằng 📝 đề mẫu chính thức ở màn 🎓 Cambridge.</p></details>`; }
// dữ liệu cần cho bản đồ: kho dạng đề, bài nghe (nghe điền), đề nói cặp
const cbMapLoad = () => Promise.all([typeof uLoad === 'function' ? uLoad().catch(() => 0) : 0, kLoad(KIT.nghe).catch(() => 0), typeof capLoad === 'function' ? capLoad().catch(() => 0) : 0]);
// bấm một ô: dạng đề thật / nghe điền / nói cặp có bài luyện riêng (báo đúng sai, giải thích); phần khác làm riêng phần đó như đề thử (có giờ, lưu theo phần)
async function cbFix(lv, pi, i) { const C = MOCK[lv], p = C && C.papers[pi], part = p && p.parts[i]; if (!part) return mapView('cb'); const k = cbKey(part[0], p);
  if (CB_UK.includes(k) && cbUItems(k, lv).length) { const ls = uLvs(lv), xs = k === 'kwt' ? uPick(k, ls, 6) : uPick(k, ls, 1); if (xs.length) return uRun(lv, k, xs); }
  if (k === 'nf' && cbNfItems(lv).length) return ngStart('nf', lv);
  if (k === 'mm') { try { await kLoad(KIT.nghe); } catch (e) {} const X = S.cbx || {}, x = cbMmItems(lv).slice().sort((a, b) => ((X[a.id] || {}).at || 0) - ((X[b.id] || {}).at || 0))[0]; if (x) return cbMM(lv, pi, { x, i, name: '🎧 Nối người nói: ' + x.tvi }); }
  if (k === 'speak' && cbCapItems(lv).length) return capView(lv);
  return cbPart(lv, pi, i); }
async function cbPart(lv, pi, i, back) { const C = MOCK[lv], p = C.papers[pi], [lab, gen] = p.parts[i];   // back: về màn bài thi (v122); không có thì về bản đồ
  $app.innerHTML = '<p class="mute">Đang tải kho câu…</p>'; try { await Promise.all([loadEB(), ...Object.values(KIT).map(kLoad), typeof uLoad === 'function' ? uLoad() : 0]); } catch (e) {}
  if (p.speak) { mkStart(lv, [pi]); if (MK) { MK.map = !back; MK.back = back; } return; }
  MK = { lv, C, papers: [], idx: [pi], map: !back, back, one: 1 };   // bộ sinh câu của đề thử đọc MK (cấp, khuôn) nên đặt trước
  const qs = gen().map(q => q.part && q.q ? q : { part: lab, q }), min = Math.max(3, Math.round(p.min / p.parts.length)), home = back || (() => mapView('cb')); if (!qs.length) { toast('Kho chưa đủ câu cho phần này.'); return home(); }
  if (!confirm(`${C.name} · ${p.t} · ${lab}: ${qs.length} câu, ${min} phút. Không báo đúng / sai giữa chừng. Bắt đầu?`)) return home();
  MK.papers.push({ t: p.t, min, qs, res: [] }); mkPaper(0); }

// ---------- v122 màn một bài thi Cambridge theo khuôn Nền (parts.js xSkill; người sáng lập 3/11/2026 "quy về 1 kiểu", danh sách = bài cụ thể) ----------
// ① Làm bài (bài đã làm / tổng) → ② Mức đúng (trung bình các phần của bài thi, như ô bản đồ; cần ~ ngưỡng đạt ước MOCK.pass) → ③ Thi thử cả bài thi (có giờ).
// 📘 Bài học = cách làm từng phần (U_T của dạng đề thật, mẹo theo loại phần; Claude soạn, chưa giáo viên kiểm) · 🏋️ Bài tập = bài kế tiếp.
// Danh sách bài theo từng phần của khuôn đề: dạng đề thật (mỗi bài; viết lại câu từ khoá: bộ 6 câu) · nghe điền (mỗi bài nghe) · Nói: mỗi đề nói cặp ·
// phần đọc hiểu / nghe / viết: bài Đọc / Nghe / đề Viết của các cấp trong đề, làm như đề thi (không báo đúng sai giữa chừng, có giờ, lưu S.cbx) ·
// phần câu lẻ (từ, ngữ pháp) và đoạn văn khuyết câu: một dòng "câu ngẫu nhiên" làm riêng phần đó. Không tính luật đo của 🧱 Nền.
const CB_HOWT = {
  doc: ['Đọc câu hỏi trước, gạch từ khoá (tên, số, từ phủ định), rồi tìm chỗ đó trong bài.', 'Đáp án đúng thường diễn đạt lại ý trong bài, ít khi chép nguyên từ; phương án chép nguyên từ hay là bẫy.', 'Câu nào quá lâu thì đoán, đánh dấu, quay lại sau.'],
  nghe: ['Dùng thời gian trước khi nghe để đọc câu hỏi, đoán loại thông tin cần nghe (số, tên, nơi, lý do).', 'Đề thật nghe 2 lần: lần 1 chọn tạm, lần 2 kiểm lại.', 'Cẩn thận bẫy sửa lời ("Tuesday… no, Wednesday") và phương án có từ nghe giống trong bài.'],
  viet: ['Viết đủ mọi ý đề yêu cầu: thiếu ý mất điểm nhiều nhất.', 'Đúng thể loại và giọng văn: thư bạn bè thân mật, thư công việc trang trọng, bài luận có mở bài, thân bài, kết bài.', 'Chừa 5 phút soát lỗi: thì, mạo từ, số ít / số nhiều, chính tả.'],
  noi: ['Trả lời đủ ý, thêm lý do và ví dụ; đừng trả lời một từ.', 'Phần nói cặp: đáp lời bạn, hỏi lại ý bạn ("What do you think?"), cùng chốt lựa chọn.', 'Không nghe rõ thì hỏi lại: "Could you repeat that, please?" không bị trừ điểm.'],
  tu: ['Đọc cả câu trước khi chọn: từ đúng phải hợp nghĩa và hợp cụm (giới từ, từ hay đi kèm).', 'Câu điền một từ thường hỏi từ ngữ pháp: giới từ, mạo từ, đại từ, trợ động từ.'],
  gap: ['Đọc câu trước và sau chỗ trống: câu chèn phải nối được cả hai.', 'Để ý từ nối và đại từ (this, they, such) chỉ về ý ngay trước chỗ trống.'],
  nf: ['Đọc phiếu trước khi nghe, đoán loại thông tin mỗi chỗ trống (số, tên, ngày, giờ).', 'Viết đúng chính tả và số ít / số nhiều: sai chính tả là mất điểm.'],
  line: ['Trước khi nghe, nhìn tranh: mỗi người đang làm gì, ở đâu.', 'Tên được đọc rõ; nghe việc người đó làm để chọn đúng người. Luôn có 1 người thừa.'],
  name: ['Câu trả lời là tên hoặc số; tên thường được đánh vần từng chữ, viết đúng chính tả.', 'Số viết bằng chữ hay bằng số đều được (7 / seven). Cẩn thận người nói đổi ý ("not fifty, fifteen").'],
  colour: ['Nghe tên vật và màu. Vật có thể được nhắc 2 màu ("Can I colour it red? No, yellow"): chọn màu cuối cùng.', 'Ôn tên màu: red, blue, green, yellow, orange, purple, brown, pink, black, white, grey.'],
  yn: ['Nhìn kỹ tranh lớn: vật ở đâu (on, under, next to), có mấy cái.', 'Chỉ chọn Yes khi tranh đúng hệt câu; sai một chi tiết là No.'],
  spell: ['Nhìn tranh, nói tên vật trong đầu, rồi xếp các chữ cái cho đúng.', 'Dùng đủ mọi chữ cái đã cho, không thêm, không bớt.'],
  box: ['Đọc cả đoạn trước khi chọn; từ điền phải hợp nghĩa và hợp ngữ pháp (số ít / số nhiều).', 'Có 3 từ thừa; mỗi từ chỉ dùng một lần. Movers: chọn thêm tên truyện hợp với cả bài.'],
  story: ['Xem tranh theo thứ tự; câu hỏi đi theo từng tranh.', 'Trả lời ngắn: Starters 1 từ, Movers 1–3 từ chép từ truyện, đúng chính tả.'],
  match5: ['Đọc trước 8 lựa chọn; bài nghe thường nhắc cả lựa chọn sai ("I wanted to… but…", "Not this time").', 'Nghe theo thứ tự người / ngày; mỗi lựa chọn dùng một lần.'],
  def: ['Đọc định nghĩa, tìm từ trong khung có nghĩa đó; chép đúng chính tả.', 'Có từ thừa trong khung.'],
  resp: ['Đọc câu người kia nói, chọn câu đáp hợp: Where → nơi chốn, When → thời gian, câu hỏi Yes / No → Yes / No.'],
  mcc: ['Đọc cả câu; chọn từ hợp ngữ pháp (live / lives, their / they, in / on / at).'],
  pdesc: ['Hoàn thành câu và trả lời câu hỏi về tranh: viết ngắn, đúng chính tả.', 'Đếm kỹ số lượng; dùng từ chỉ vị trí (under, on, next to).'],
  pmc: ['Đọc câu hỏi và nhìn 3 tranh trước khi nghe.', 'Cả 3 tranh thường đều được nhắc tới; nghe kỹ chỗ đổi ý (but, instead, not any more).'],
  pstory: ['Viết đủ 3 tranh, mỗi tranh ít nhất một câu; dùng thì quá khứ.', 'Dùng từ nối: first, then, after that, in the end. Viết từ 35 từ trở lên.'],
  pic: ['Nhìn hết các tranh trước khi nghe / đọc: mỗi tranh là cái gì, gọi tên bằng tiếng Anh trong đầu.', 'Nghe từ chính trong câu (con vật, đồ ăn, đồ vật); các từ khác trong câu chỉ là phần phụ.', 'Câu "This is a …" chỉ đúng khi tranh đúng là vật đó; tranh giống nhóm (cùng là con vật) vẫn có thể sai.'],
  mm: ['Đọc kỹ 8 ý trước khi nghe, gạch từ khoá của mỗi ý; 3 ý không dùng.', 'Người nói hay nhắc đúng từ của một ý sai (bẫy): nghe ý chính người đó muốn nói, đừng bắt từ.', 'C1 / C2 có 2 nhiệm vụ cùng một lần nghe: lượt 1 làm nhiệm vụ 1, lượt 2 làm nhiệm vụ 2 và soát lại.'] };
// loại phần (chọn bài luyện và mẹo): Nói · khuyết câu · nghe · viết · đọc · câu lẻ từ / ngữ pháp
const cbCat = (lab, p) => p.speak ? 'noi' : cbKey(lab, p) === 'gap' ? 'gap' : cbKey(lab, p) === 'mm' ? 'mm' : /^pic/.test(cbKey(lab, p)) ? 'pic' : /Nghe/.test(p.t) && !/điền/.test(lab) ? 'nghe' : CB_SCORE.test(lab) ? 'viet' : /đọc|bài dài|nối câu/i.test(lab) ? 'doc' : 'tu';
const cbKitLvs = (P, lv) => LEVELS.slice(LEVELS.indexOf(MOCK[lv].lo), LEVELS.indexOf(lv) + 1).filter(l => P.lvs.includes(l));
const cbIc = t => { const i = t.split(' ')[0]; return i === '📖' ? '📰' : i; }, cbPn = t => t.split(' ').slice(1).join(' ').replace('Dùng tiếng Anh', 'Dùng TA');
function cbBai(lv, pi) { const C = MOCK[lv], p = C && C.papers[pi]; if (!p) return []; const out = [], seen = new Set(), add = b => { if (!seen.has(b.id)) { seen.add(b.id); out.push(b); } };
  p.parts.forEach(([lab], i) => { const k = cbKey(lab, p), c = cbCat(lab, p), its = CB_UK.includes(k) ? cbUItems(k, lv) : [];
    if (k === 'speak') { const ts = cbCapItems(lv); return ts.length ? ts.forEach(x => add({ id: 'cap:' + x.id, kind: 'cap', x, i, name: '👥 Nói cặp: ' + x.title })) : add({ id: 'part:' + i, kind: 'part', i, name: '🗣 Nói như đề thi' }); }
    if (k === 'kwt' && its.length) { for (let j = 0; j < its.length; j += 6) add({ id: 'kwt:' + its[j].id, kind: 'kwt', xs: its.slice(j, j + 6), i, name: `${U_T.kwt[0]} Viết lại câu · bộ ${j / 6 + 1}` }); return; }
    if (its.length) return its.forEach(x => add({ id: 'u:' + x.id, kind: 'u', k, x, i, name: `${U_T[k][0]} ${x.title || U_T[k][1]}` }));
    if (k === 'nf') { const ns = cbNfItems(lv); if (ns.length) return ns.forEach(x => add({ id: 'nf:' + x.id, kind: 'nf', x, i, name: '📝 Nghe điền: ' + (x.tvi || x.title || x.id) })); }
    if (CB_DT.includes(k)) return add({ id: 'part:' + i, kind: 'part', i, name: `${/Nghe/.test(p.t) ? '🎧' : k === 'pstory' || k === 'pdesc' ? '✍️' : '📖'} ${cbShort(lab)}` });
    if (k === 'picl' || k === 'picr') return add({ id: 'part:' + i, kind: 'part', i, name: `🖼 ${cbShort(lab)} · câu ngẫu nhiên` });
    if (k === 'mm') { const ms = cbMmItems(lv); if (ms.length) return ms.forEach(x => add({ id: 'mm:' + x.id, kind: 'mm', x, i, name: '🎧 Nối người nói: ' + x.tvi })); }
    const P = c === 'doc' ? KIT.doc : c === 'nghe' ? KIT.nghe : c === 'viet' ? KIT.viet : null, xs = P && P.items ? P.items.filter(x => cbKitLvs(P, lv).includes(x.lv) && !x.kind) : [];
    if (xs.length) return xs.forEach(x => add({ id: 'kit:' + x.id, kind: 'kit', P, x, i, name: `${P.ic} ${P.name ? P.name(x) : x.title || x.id}` }));
    add({ id: 'part:' + i, kind: 'part', i, name: `${cbNum(lab) ? 'Phần ' + cbNum(lab) + ': ' : ''}${cbShort(lab)} · câu ngẫu nhiên` }); });
  return out; }
// kết quả gần nhất của một bài (luyện có báo đúng sai và làm như đề thi đều tính); phần câu ngẫu nhiên: lấy ô bản đồ của phần
function cbRes(lv, b, cells) { const X = S.cbx || {}, U = S.uoe || {}, pass = MOCK[lv].pass, last = (...rs) => rs.filter(r => r && r.n).sort((a, c) => c.at - a.at)[0] || null;
  const sc = r => r ? { at: r.at, t: `${Math.round(r.ok / Math.max(1, r.n) * 100)}%`, bad: r.ok / Math.max(1, r.n) < pass } : null;
  if (b.kind === 'u') { const r = last(U[b.x.id], X[b.x.id]); return b.k === 'sum' ? sc(r) : r; }
  if (b.kind === 'kwt') { const rs = b.xs.map(x => last(U[x.id], X[x.id])).filter(Boolean); return rs.length ? { at: Math.max(...rs.map(r => r.at)), ok: Math.round(rs.reduce((t, r) => t + r.ok, 0) * 10) / 10, n: rs.reduce((t, r) => t + r.n, 0) } : null; }
  if (b.kind === 'nf') return last(((S.ng || {}).nf || {})[b.x.id], X[b.x.id]);
  if (b.kind === 'mm') { const r = X[b.x.id]; return r && r.n ? r : null; }
  if (b.kind === 'cap') { const r = (S.cap || {})[b.x.id]; return r ? { at: r.at, t: `${r.pct}%`, bad: r.pct < pass * 100 } : null; }
  if (b.kind === 'kit') { const r = X[b.x.id]; return r && r.n ? (b.P === KIT.viet ? sc(r) : r) : null; }
  const c = cells[b.i]; if (!c || !c.m) return null; const at = Math.max(...c.at.map(a => a.at)); return c.score ? { at, t: c.v, bad: c.s === 'yeu' } : { at, ok: Math.round(c.p * c.n), n: c.n }; }
// v126: bài chưa làm của PHẦN có ít bài đã làm nhất (chia đều các phần của đề; cùng mức thì theo thứ tự danh sách), hết bài mới thì bài làm lâu nhất
const cbNext = (L, R) => { const done = {}; L.forEach((b, k) => { if (R[k]) done[b.i] = (done[b.i] || 0) + 1; });
  const und = L.filter((b, k) => !R[k]); if (und.length) return und.slice().sort((a, b) => (done[a.i] || 0) - (done[b.i] || 0))[0];
  let j = 0; R.forEach((r, k) => { if ((r.at || 0) < (R[j].at || 0)) j = k; }); return L[j] || null; };
// số đo của một bài thi: mức đúng trung bình các phần đã có số đo (như ô bản đồ); đủ = mọi phần ổn
const cbPaperQ = cells => { const ms = cells.filter(c => c.m); return { q: ms.length ? ms.reduce((t, c) => t + c.p, 0) / ms.length : null, ok: cells.length > 0 && cells.every(c => c.s === 'vung') }; };
function cbTile(lv, pi) { const C = MOCK[lv], p = C.papers[pi], cells = cbRows(lv)[pi].cells, L = cbBai(lv, pi), d = L.filter(b => cbRes(lv, b, cells)).length, { q, ok } = cbPaperQ(cells);
  return { attr: `data-cbsk="${lv}|${pi}"`, ic: cbIc(p.t), t: cbPn(p.t), cls: ok ? 'ok' : '', pct: Math.round(((L.length ? d / L.length : 0) + (q != null ? Math.min(1, q / C.pass) : 0)) / 2 * 100),
    meta: q != null ? `${ok ? '✓ ' : ''}đúng ${Math.round(q * 100)}%` : d ? `${d}/${L.length} bài` : p.speak && !SREC ? 'Cần Safari' : 'Chưa làm' }; }
async function cbDo(lv, pi, b) { const back = () => cbSkView(lv, pi); scrollTo(0, 0); if (!b) return toast('Chưa có bài.');
  if (b.kind === 'u') return uRun(lv, b.k, [b.x], back);
  if (b.kind === 'kwt') return uRun(lv, 'kwt', b.xs, back);
  if (b.kind === 'nf') return ngStart('nf', lv, b.x, back);
  if (b.kind === 'cap') { $app.innerHTML = '<p class="mute">Đang tải…</p>'; try { await capLoad(); if (!NCLIPS.size) NCLIPS = new Set(await (await fetch('n/index.json?v=' + APP_V)).json()); } catch (e) {} return capRun(lv, b.x, back); }
  if (b.kind === 'kit') return cbOne(lv, pi, b, back);
  if (b.kind === 'mm') return cbMM(lv, pi, b, back);
  return cbPart(lv, pi, b.i, back); }
// một bài Đọc / Nghe / đề Viết làm như đề thi: không báo đúng sai giữa chừng, có giờ; kết quả vào đề thử (theo phần) và S.cbx (theo bài)
async function cbOne(lv, pi, b, back) { const C = MOCK[lv], p = C.papers[pi], lab = p.parts[b.i][0];
  $app.innerHTML = '<p class="mute">Đang tải…</p>'; try { await Promise.all([loadEB(), kLoad(b.P)]); if (b.P === KIT.nghe && !NCLIPS.size) NCLIPS = new Set(await (await fetch('n/index.json?v=' + APP_V)).json()); } catch (e) {}
  MK = { lv, C, papers: [], idx: [pi], back, one: 1 };
  const qs = b.P === KIT.viet ? [kWrite(b.x)] : ['y', 'ct'].flatMap(k => kRead(b.P, b.x, k, b.P === KIT.nghe)), min = b.P === KIT.viet ? Math.max(15, Math.round(p.min / 2)) : b.P === KIT.nghe ? 6 : 10;
  if (!qs.length) { toast('Bài này chưa có câu hỏi.'); return back(); }
  if (!confirm(`${C.name} · ${b.name}: ${qs.length} câu, ${min} phút. Không báo đúng / sai giữa chừng. Bắt đầu?`)) return back();
  MK.papers.push({ t: p.t, min, qs: qs.map(q => ({ part: lab, q })), res: [] }); mkPaper(0); }
function cbSkView(lv, pi) { const C = MOCK[lv], p = C && C.papers[pi]; if (!p) return cbView(lv); BACK = null; window.CUR = { view: 'cambridge', sk: lv + '|' + pi }; EXAM_VOX = false;
  const cells = cbRows(lv)[pi].cells, L = cbBai(lv, pi), R = L.map(b => cbRes(lv, b, cells)), done = R.filter(Boolean).length, nx = cbNext(L, R), { q, ok } = cbPaperQ(cells), xl = xlBlock('cambridge', lv + '~' + pi);   // v131: 📘 bài học từng phần (baihoc.js)
  const lr = cbRuns(lv).filter(r => !r.one && (r.papers || []).some(x => x.t === p.t)).pop(), lp = lr ? (x => x.crit ? x.ok : Math.round(x.ok / Math.max(1, x.n) * 100))(lr.papers.find(x => x.t === p.t)) : null;
  const rows = L.map((b, i) => { const r = R[i], nxt = b === nx && !r, [tag, cls] = xTag(r, C.pass); return pRow(`data-cbx="bai|${lv}|${pi}|${b.id}"`, esc(b.name), nxt ? 'làm tiếp' : tag, nxt ? 'next' : cls); });
  const cat = new Set(p.parts.map(([lab]) => cbCat(lab, p))), tools = `${cat.has('doc') || cat.has('tu') || cat.has('viet') ? (typeof uoeBox === 'function' ? uoeBox(lv) : '') : ''}${cat.has('nghe') && typeof ngBox === 'function' ? ngBox(lv) : ''}${cat.has('noi') && typeof capBox === 'function' ? capBox(lv) : ''}`;
  $app.innerHTML = '<div id="ie"></div>' + xSkill({ back: `<div class="row top"><button class="link" data-cbl="${lv}">‹ Cambridge ${LVN[lv]}</button><span></span></div>`, h1: `${cbIc(p.t)} ${cbPn(p.t)} <span class="mute" style="font-size:18px">· Cambridge ${LVN[lv]}</span>`,
    note: p.speak && !SREC ? '<div class="box">⚠️ Trình duyệt này không chép được lời nói: mở bằng Safari trên iPhone để nói và được chấm.</div>' : '',
    steps: [xl.step,
      { t: 'Mức đúng', v: q != null ? Math.round(q * 100) + '%' : '–', sub: `cần ~${Math.round(C.pass * 100)}%`, ok, cur: q != null && !ok },
      { t: 'Thi thử', btn: `<button class="pri" data-cbx="paper|${lv}|${pi}">▶ ${p.min} phút</button>`, sub: lp != null ? `lần trước ${lp}%` : 'chưa làm' }],
    learn: xl.learn, prac: { attr: `data-cbx="next|${lv}|${pi}"`, sub: !nx ? 'chưa có bài' : R[L.indexOf(nx)] ? 'làm lại bài cũ nhất' : 'bài kế tiếp' }, les: xl,
    intro: 'Học từng phần của bài thi, rồi làm từng phần như thi thật. Mức đúng tính từ các bài bạn làm.', lesT: 'Phần thi', pracT: 'Làm bài kế tiếp', nxName: nx ? nx.name : '',
    lt: 'Bài luyện', lsub: `${done}/${L.length} đã làm`, rows, at: L.indexOf(nx), more: [['🧩 Luyện theo dạng đề', tools],
      ['🗺 Bản đồ phần yếu', `<button class="link" data-mapv="lt" data-mapk="cb" data-cbmlv="${lv}" style="margin:0">🗺 Bản đồ phần yếu: ở 🧭 Lộ trình → 🗺 Chỗ yếu ›</button>`],
      ['📋 Các phần của bài thi', `<p class="mute" style="margin:0">${p.parts.map(([lab]) => esc(lab)).join(' · ')}. ${p.min} phút như đề thật.</p>`]] });
  $app.onclick = cbClick; scrollTo(0, 0); }
// v131: màn "cách làm" (v122 cbHowView) thay bằng 📘 bài học từng phần (baihoc.js xlView); mẹo CB_HOWT dùng ở bài học
// v126 một bộ nghe nối người nói làm như đề thi (không báo đúng sai giữa chừng; mỗi người nói nghe tối đa 2 lần); kết quả vào đề thử theo phần + S.cbx. back trống = mở từ bản đồ
async function cbMM(lv, pi, b, back) { const C = MOCK[lv], p = C.papers[pi], lab = p.parts[b.i][0], home = back || (() => mapView('cb'));
  $app.innerHTML = '<p class="mute">Đang tải…</p>'; try { await kLoad(KIT.nghe); if (!NCLIPS.size) NCLIPS = new Set(await (await fetch('n/index.json?v=' + APP_V)).json()); } catch (e) {}
  MK = { lv, C, papers: [], idx: [pi], back, map: !back, one: 1 }; const qs = mmQs(b.x), min = b.x.tasks.length > 1 ? 10 : 6;
  if (!confirm(`${C.name} · ${b.name}: ${qs.length} câu, ${min} phút. Mỗi người nói nghe tối đa 2 lần, không báo đúng / sai giữa chừng. Bắt đầu?`)) { MK = null; return home(); }
  MK.papers.push({ t: p.t, min, qs: qs.map(q => ({ part: lab, q })), res: [] }); mkPaper(0); }
async function cbClick(e) { const g = s => e.target.closest(s); let b;
  if ((b = g('[data-cbl]'))) { scrollTo(0, 0); return cbView(b.dataset.cbl); }
  if ((b = g('[data-mock]'))) return mockView(b.dataset.mock);
  if ((b = g('[data-cbsk]'))) { const [lv, pi] = b.dataset.cbsk.split('|'); return cbSkView(lv, +pi); }
  if (!(b = g('[data-cbx]'))) return; const [a, lv, pi, x] = b.dataset.cbx.split('|'), L = () => cbBai(lv, +pi), back = () => cbSkView(lv, +pi);
  if (a === 'bai') return cbDo(lv, +pi, L().find(y => y.id === x));
  if (a === 'next' || a === 'try') { const cells = cbRows(lv)[+pi].cells, M = a === 'try' ? L().filter(y => y.i === +x) : L(), R = M.map(y => cbRes(lv, y, cells)); return cbDo(lv, +pi, cbNext(M, R)); }
  if (a === 'paper') { $app.innerHTML = '<p class="mute">Đang tải kho câu…</p>'; try { await Promise.all([loadEB(), ...Object.values(KIT).map(kLoad), typeof uLoad === 'function' ? uLoad() : 0]); } catch (er) {} mkStart(lv, [+pi]); if (MK) MK.back = back; } }
document.addEventListener('click', e => { if (!S) return; const b = e.target.closest('[data-cbm]'); if (!b) return; const [a, lv, pi, i] = b.dataset.cbm.split('|'); scrollTo(0, 0);
  if (a === 'lv') { CBM_LV = lv; return mapView('cb'); } if (a === 'mock') return mockView(lv); if (a === 'fix') return cbFix(lv, +pi, +i); });
