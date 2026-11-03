// 🗺 Bản đồ Cambridge (v121, người sáng lập: "Tôi muốn thấy bản đồ của các mục tiêu"). Cùng khuôn với IELTS / TOEIC (v120):
//   🎯 Việc cần chữa (MỘT nút) → lưới ô có tên + số đo → ghi chú. Ô = PHẦN của đề (khuôn 🎓 đề thử MOCK[cấp]), không phải bài:
//   đề Cambridge chấm theo phần; làm lại bài cũ là nhớ đáp án, nên chỗ yếu đo trên lần làm gần đây.
// Bằng chứng mỗi ô: 🎓 đề thử theo phần (mkResult lưu pp từ v121; đề thử cũ chỉ có điểm cả bài thi nên không dùng),
//   🧩 dạng đề thật (S.uoe, B1+), 🎧 nghe điền (S.ng.nf, A2+), 👥 nói cặp (S.cap, A2+), 🗣 Nói của đề thử (điểm 4 tiêu chí).
// Mỗi ô lấy tối đa CB_WIN câu gần nhất (bài điểm % như Viết / Nói: 3 lần gần nhất); đủ chắc = ≥ CB_N câu ở ≥ 2 lần (bài điểm %: ≥ 2 lần);
//   yếu = dưới ngưỡng đạt ước tính của kỳ thi (MOCK.pass: ~70% tới B1, ~60% từ B2; ngưỡng ước, không chính thức).
// Chỉ đọc dữ liệu: không đổi luật đo; không có nhóm đang chữa / tạm gác như IELTS / TOEIC (ô hết yếu khi các lần làm gần đây ổn).
const CB_N = 8, CB_WIN = 20, CB_ST = { yeu: 'yếu', on: 'chưa chắc', vung: 'ổn', chua: 'chưa làm' };
const CB_UK = ['mc', 'open', 'wf', 'kwt', 'long', 'pm', 'sum'];
const CB_KEY = [[/trắc nghiệm/, 'mc'], [/tạo dạng từ/, 'wf'], [/từ khoá/, 'kwt'], [/nối câu với đoạn/, 'pm'], [/bài dài/, 'long'], [/tóm tắt/, 'sum'], [/nghe điền/, 'nf'], [/khuyết câu/, 'gap'], [/điền từ/, 'open']];
const CB_SCORE = /email|bài luận|tóm tắt/;   // phần viết: máy chấm điểm 0–1 mỗi bài
const CB_SHORT = { 'đọc tin nhắn, bài báo': 'Đọc tin, bài báo', 'chọn từ (cụm từ)': 'Chọn từ', 'điền từ (ngữ pháp)': 'Điền từ', 'viết email / chuyện': 'Viết email, chuyện',
  'nghe hội thoại, thông báo': 'Nghe hội thoại', 'nghe điền thông tin': 'Nghe điền', 'nghe điền câu': 'Nghe điền câu', 'đọc tin ngắn': 'Đọc tin ngắn', 'đoạn văn khuyết câu': 'Khuyết câu',
  'điền từ trắc nghiệm': 'Điền trắc nghiệm', 'điền từ': 'Điền một từ', 'viết lại câu dùng từ khoá': 'Câu từ khoá', 'nối câu với đoạn': 'Nối câu – đoạn', 'email, bài báo / truyện': 'Email, bài viết',
  'bài luận, thư, bài nhận xét': 'Bài luận, thư', 'bài luận, đề xuất, báo cáo': 'Bài luận, báo cáo', 'bài luận / bài báo / báo cáo': 'Bài luận, báo cáo', 'nghe': 'Nghe chọn đáp án',
  'tóm tắt và đánh giá 2 đoạn văn (bắt buộc)': 'Tóm tắt 2 đoạn', 'Nghe bài, chọn đáp án': 'Nghe chọn đáp án', 'Đọc bài, trả lời': 'Đọc trả lời', 'Viết từ vào câu': 'Viết từ',
  'Hiểu nghĩa từ trong câu': 'Nghĩa từ', 'Chọn cụm đúng': 'Chọn cụm', 'Ngữ pháp: chọn từ đúng': 'Ngữ pháp', 'Nói': 'Nói' };
const cbKey = (lab, p) => p.speak ? 'speak' : (CB_KEY.find(([re]) => re.test(lab)) || [0, ''])[1];
const cbShort = lab => { const m = lab.match(/^Phần ([\d–-]+): (.*)$/), b = m ? m[2] : lab, s = CB_SHORT[b] || b; return s.charAt(0).toUpperCase() + s.slice(1); };
const cbNum = lab => (lab.match(/^Phần ([\d–-]+):/) || [])[1] || '';
// cấp của bản đồ: cấp người học chọn ở bản đồ → mục tiêu Cambridge → cấp đang xem ở màn 🎓 Cambridge → cấp 🧭 xếp được → cấp đang học
let CBM_LV = null;
const cbMapLv = () => { if (CBM_LV && MOCK[CBM_LV]) return CBM_LV; const g = S.lt && S.lt.goal; if (g && typeof ltKind === 'function' && ltKind(g) === 'cambridge' && MOCK[ltGoalLv(g)]) return ltGoalLv(g);
  const st = ovStage(), l = (typeof CB_LV !== 'undefined' && CB_LV) || (typeof plTop === 'function' && plTop(st)) || st; return MOCK[l] ? l : 'a2'; };
// nguồn luyện cùng dạng, đúng cấp như màn luyện (cấp đầu danh sách có bài)
const cbFirst = (ls, get) => { for (const l of ls) { const its = get([l]); if (its.length) return its; } return []; };
const cbUItems = (k, lv) => typeof uItems === 'function' && typeof UOE !== 'undefined' && UOE ? cbFirst(uLvs(lv), ls => uItems(k, ls)) : [];
const cbNfItems = lv => typeof ngItems === 'function' && LEVELS.indexOf(lv) >= LEVELS.indexOf('a2') && KIT.nghe.items ? cbFirst(ngLvs(lv), ngItems) : [];
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
  if (k === 'speak' && cbCapItems(lv).length) return capView(lv);
  return cbPart(lv, pi, i); }
async function cbPart(lv, pi, i) { const C = MOCK[lv], p = C.papers[pi], [lab, gen] = p.parts[i];
  $app.innerHTML = '<p class="mute">Đang tải kho câu…</p>'; try { await Promise.all([loadEB(), ...Object.values(KIT).map(kLoad), typeof uLoad === 'function' ? uLoad() : 0]); } catch (e) {}
  if (p.speak) { mkStart(lv, [pi]); if (MK) MK.map = true; return; }
  MK = { lv, C, papers: [], idx: [pi], map: true };   // bộ sinh câu của đề thử đọc MK (cấp, khuôn) nên đặt trước
  const qs = gen().map(q => q.part && q.q ? q : { part: lab, q }), min = Math.max(3, Math.round(p.min / p.parts.length)); if (!qs.length) { toast('Kho chưa đủ câu cho phần này.'); return mapView('cb'); }
  if (!confirm(`${C.name} · ${p.t} · ${lab}: ${qs.length} câu, ${min} phút. Không báo đúng / sai giữa chừng. Bắt đầu?`)) return mapView('cb');
  MK.papers.push({ t: p.t, min, qs, res: [] }); mkPaper(0); }
document.addEventListener('click', e => { if (!S) return; const b = e.target.closest('[data-cbm]'); if (!b) return; const [a, lv, pi, i] = b.dataset.cbm.split('|'); scrollTo(0, 0);
  if (a === 'lv') { CBM_LV = lv; return mapView('cb'); } if (a === 'mock') return mockView(lv); if (a === 'fix') return cbFix(lv, +pi, +i); });
