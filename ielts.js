// 🌏 Học IELTS (v68, 28/10/2026, người sáng lập: "để IELTS chạy riêng, làm thêm mục thứ 4 là học IELTS, còn mục học cũ là học CEFR … dùng phần học đó để học và thi IELTS được. Bạn tự tính mà làm").
// Mục riêng ở thanh dưới. KHÔNG đụng luật đo CEFR (📘 Học / 🔁 Nhớ / Thi chuyển cấp): luyện ở đây không tính vào phần nào bên 🎯 Học CEFR.
// Dữ liệu: ielts.json ← content/ielts/*.json (node tools/build-ielts.mjs; Claude soạn, chưa người thật kiểm; bài đọc 430–700 từ, đề thật ~700–900 từ).
// Dùng lại kho sẵn có: bài nghe B1 → C2 (giọng tự nhiên n/), nghe điền phiếu (nghe2.js ngQs), máy chép lời (kAsr), bắt lỗi Viết (thi.js wErrors), AI chấm (el-cham, thang band IELTS).
// Band máy là ƯỚC LƯỢNG, chưa đối chiếu điểm thi thật. Viết / Nói: máy chỉ báo tới 7.0 (trên mức đó máy không phân biệt được), nên nhờ AI chấm hoặc giáo viên.
// Không phải sản phẩm chính thức của IELTS (British Council, IDP, Cambridge); không chép đề thật.
let IE = null;
const ieLoad = async () => IE || (IE = await (await fetch('ielts.json?v=' + APP_V)).json());
const ieSt = () => { const o = (S.ie = S.ie || {}); o.type = o.type || 'ac'; o.target = o.target || 6.5; o.r = o.r || {}; for (const k of ['w', 's', 'mock', 'off', 'teach', 'tw']) o[k] = o[k] || []; return o; };
const IE_BANDS = [5, 5.5, 6, 6.5, 7, 7.5, 8];
const IE_TYPE = { ac: 'Academic', gt: 'General Training' };
// bảng đối chiếu IELTS ↔ CEFR do IELTS công bố: B1 4.0–5.0 · B2 5.5–6.5 · C1 7.0–8.0 · C2 8.5–9.0
const ieCefr = b => b >= 8.5 ? 'c2' : b >= 7 ? 'c1' : b >= 5.5 ? 'b2' : b >= 4 ? 'b1' : 'a2';
// nền CEFR nên đạt cho band mục tiêu (suy ra từ bảng trên; 6.5 ở mép trên B2 nên lấy B2+)
const ieBase = b => b >= 8.5 ? 'c2' : b >= 7 ? 'c1' : b >= 6.5 ? 'b2p' : b >= 5.5 ? 'b2' : 'b1';
// điểm thô / 40 → band, theo bảng quy đổi IELTS công bố (Listening; Reading Academic; Reading General Training). Đề app ít câu hơn 40 nên quy về thang 40.
const IE_L = [[39, 9], [37, 8.5], [35, 8], [32, 7.5], [30, 7], [26, 6.5], [23, 6], [18, 5.5], [16, 5], [13, 4.5], [10, 4], [8, 3.5], [6, 3], [4, 2.5]];
const IE_RA = [[39, 9], [37, 8.5], [35, 8], [33, 7.5], [30, 7], [27, 6.5], [23, 6], [19, 5.5], [15, 5], [13, 4.5], [10, 4], [8, 3.5], [6, 3], [4, 2.5]];
const IE_RG = [[40, 9], [39, 8.5], [37, 8], [36, 7.5], [34, 7], [32, 6.5], [30, 6], [27, 5.5], [23, 5], [19, 4.5], [15, 4], [12, 3.5], [9, 3], [6, 2.5]];
const ieRaw = (T, ok, n) => { const r = Math.round(ok / Math.max(1, n) * 40); return (T.find(([m]) => r >= m) || [0, 0])[1]; };
// điểm tổng: trung bình làm tròn tới 0,5 (quy ước IELTS: .25 lên .5, .75 lên band trên)
const ieRound = x => Math.round(x * 2) / 2;
const bandTxt = b => b == null ? '–' : (+b).toFixed(1);
const IE_MAXM = 7;   // Viết / Nói: máy không báo cao hơn 7.0
const ieB = v => Math.min(IE_MAXM, ieRound(3 + 4 * Math.max(0, Math.min(1, v))));   // 0–1 → band 3.0–7.0
const ieAvg = a => { a = a.filter(x => x != null); return a.length ? a.reduce((s, x) => s + x, 0) / a.length : null; };
const ieLvTag = () => 'ielts-' + ieSt().type;

// ---------- 📖 Reading ----------
const IE_AB = 'ABCDEFGH';
const iePass = x => `<details class="box" open style="margin-top:12px"><summary><b>${esc(x.title)}</b> <span class="mute">(${kWords(x.paras.join(' ')).length} từ)</span></summary>
  ${x.paras.map((p, i) => `<p class="tdtap" style="font-size:16px;line-height:1.7;margin:8px 0 0"><b>${IE_AB[i]}</b> ${esc(p)}</p>`).join('')}</details>`;
const IE_TFH = '<p class="mute">TRUE = bài nói đúng như vậy · FALSE = bài nói ngược lại · NOT GIVEN = bài không nói tới.</p>';
const IE_RK = { h: ['🧭', 'Chọn tiêu đề cho đoạn'], tf: ['⚖️', 'TRUE / FALSE / NOT GIVEN'], comp: ['✏️', 'Điền không quá 2 từ'], mc: ['🔘', 'Trắc nghiệm'] };
function ieRQs(x, kinds = ['h', 'tf', 'comp', 'mc']) { const foot = iePass(x), out = [];
  if (kinds.includes('h')) { const hs = shuf([...x.h, ...x.hx]); x.h.forEach((h, i) => out.push({ x, k: 'h', ty: 'R-h', kind: 'mc', head: '<p class="mute">Chọn tiêu đề đúng cho đoạn. Mỗi tiêu đề dùng một lần; có tiêu đề thừa.</p>', q: `Đoạn ${IE_AB[i]}`, opts: hs, a: h, foot })); }
  if (kinds.includes('tf')) for (const t of x.tf) out.push({ x, k: 'tf', ty: 'R-tf', kind: 'mc', head: IE_TFH, q: esc(t.s), opts: ['TRUE', 'FALSE', 'NOT GIVEN'], a: t.a, why: t.why, foot });
  if (kinds.includes('comp')) for (const c of x.comp) out.push({ x, k: 'comp', ty: 'R-comp', kind: 'type', head: '<p class="mute">Điền KHÔNG QUÁ HAI TỪ, lấy đúng từ trong bài.</p>', q: esc(c.s).replace('______', '<b>______</b>'), a: c.a[0], acc: c.a, why: c.why, foot });
  if (kinds.includes('mc')) for (const m of x.mc) out.push({ x, k: 'mc', ty: 'R-mc', kind: 'mc', q: esc(m.q), opts: shuf([m.a, ...m.w]), a: m.a, why: m.why, foot });
  return out; }
// v99 (nhật ký trải nghiệm): đề thật mỗi bài đọc 13–14 câu (cả đề 40). Bài của app có ~18–22 câu: lượt "cả bài" và đề thử cắt còn n câu,
// chia theo dạng (mỗi dạng ≥ 2 câu), giữ thứ tự dạng và thứ tự câu trong bài
function ieCap(qs, n) { if (qs.length <= n) return qs; const g = [...new Set(qs.map(q => q.k))].map(k => qs.filter(q => q.k === k));
  const al = g.map(a => Math.min(a.length, Math.max(2, Math.round(a.length * n / qs.length)))); let s = al.reduce((x, y) => x + y, 0);
  while (s > n) { const i = al.indexOf(Math.max(...al)); al[i]--; s--; }
  while (s < n) { const i = g.findIndex((a, j) => al[j] < a.length); if (i < 0) break; al[i]++; s++; }
  return g.flatMap((a, j) => shuf(a.map((q, i) => [q, i])).slice(0, al[j]).sort((x, y) => x[1] - y[1]).map(x => x[0])); }
// chọn bài: chưa làm / làm lâu nhất trước
const iePick = (its, n) => { const R = ieSt().r; return shuf(its).sort((a, b) => ((R[a.id] || {}).at || 0) - ((R[b.id] || {}).at || 0)).slice(0, n); };

// ---------- 🎧 Listening (bài nghe có sẵn của app: B1 → C2) ----------
// Part 1 hội thoại đời thường (điền phiếu) · Part 2 một người nói · Part 3 hội thoại học tập · Part 4 bài nói chuyên đề (điền phiếu)
const IE_LH = '<p class="mute">🎧 Đọc câu hỏi trước, rồi nghe. Đề thật: mỗi bài chỉ nghe 1 lần (đề thử của app cũng vậy); luyện thì được nghe 2 lần.</p>';
const IE_LP = [['Part 1: hội thoại, điền phiếu', ['b1', 'b2'], 'form', true], ['Part 2: một người nói, trắc nghiệm', ['b1', 'b2'], 'mc', false], ['Part 3: hội thoại, trắc nghiệm', ['b2', 'c1'], 'mc', true], ['Part 4: bài nói chuyên đề, điền phiếu', ['c1', 'c2'], 'form', false]];
// v87: bài nghe soạn đúng kiểu IELTS (IE.ln: điền phiếu, trắc nghiệm, bản đồ, ghép) dùng trước; hết thì lấy bài Nghe B1 → C2 của CEFR như cũ
const IE_LTY = { form: 'L-form', mc: 'L-mc', map: 'L-map', match: 'L-match' };
function ieLnQs(x) { const play = { key: x.id, ...(x.lines ? { lines: x.lines } : { text: x.text }) }, letters = x.map ? x.map.items.map(i => i.t).filter(t => /^[A-H]$/.test(t)).sort() : [];
  const head = q => `${IE_LH}<p style="margin:4px 0"><b>Part ${x.part}: ${esc(x.title)}</b></p>` + (q.k === 'form' ? `<p class="mute" style="margin:0">${esc(x.form || '')} · viết ${esc(x.lim || 'ONE WORD AND/OR A NUMBER')}</p>`
    : q.k === 'map' ? `<p class="mute" style="margin:0">Chọn chữ đúng trên bản đồ (A–${letters[letters.length - 1]}).</p>${ieMapSvg(x.map)}` : q.k === 'match' ? `<p class="mute" style="margin:0">Mỗi nguồn được nhận xét thế nào? Có phương án thừa.</p>` : '');
  return x.qs.map(q => ({ x, k: 'ln-' + q.k, ty: IE_LTY[q.k], play, head: head(q), why: q.why,
    ...(q.k === 'form' ? { kind: 'type', q: esc(q.s).replace('______', '<b>______</b>'), a: q.a[0], acc: q.a } : q.k === 'mc' ? { kind: 'mc', q: esc(q.q), opts: shuf([q.a, ...q.w]), a: q.a }
      : q.k === 'map' ? { kind: 'mc', q: esc(q.q), opts: letters, a: q.a } : { kind: 'mc', q: esc(q.q), opts: x.opts, a: q.a }) })); }
function ieListen(parts = [0, 1, 2, 3]) { const used = new Set(), out = [];
  for (const i of parts) { const ln = IE && IE.ln ? iePick(IE.ln.filter(x => x.part === i + 1 && !used.has(x.id)), 1)[0] : null; if (ln) { used.add(ln.id); out.push(...ieLnQs(ln).map(q => ({ part: IE_LP[i][0], q }))); continue; } const [part, lvs, k, dlg] = IE_LP[i], its = KIT.nghe.items.filter(x => lvs.includes(x.lv) && !used.has(x.id) && !!x.lines === dlg && (k !== 'form' || ngForm(x)));
    const x = iePick(its.length ? its : KIT.nghe.items.filter(x => lvs.includes(x.lv) && !used.has(x.id)), 1)[0]; if (!x) continue; used.add(x.id);
    const qs = k === 'form' && ngForm(x) ? ngQs(x) : kRead(KIT.nghe, x, 'ct', true); for (const q of qs) { q.head = String(q.head || '').replace(/<p class="mute">.*?<\/p>/, IE_LH); q.ty = k === 'form' && ngForm(x) ? 'L-form' : 'L-mc'; } out.push(...qs.map(q => ({ part, q }))); }
  return out; }

// ---------- ✍️ Writing ----------
const IE_COL = ['#2f6fde', '#e67e22', '#1a8f3c', '#8e44ad', '#c62828', '#7f8c8d'];
// v87: Task 1 dạng bản đồ (2 bản đồ trước / sau, lưới 10 × 10) và quy trình (các bước có mũi tên)
const IE_MC = { b: '#90a4ae', g: '#81c784', w: '#64b5f6', r: '#d7ccc8' };
function ieMapSvg(m) { const u = 15, pad = 4, S = 10 * u + pad * 2;
  return `<div style="flex:1;min-width:150px"><b style="font-size:14px">${esc(m.t)}</b><svg viewBox="0 0 ${S} ${S + 12}" width="100%" role="img" aria-label="${esc(m.t)}: ${esc(m.items.map(i => i.t).join(', '))}" style="display:block;margin-top:4px">
    <rect x="${pad}" y="${pad}" width="${10 * u}" height="${10 * u}" fill="none" stroke="currentColor" stroke-opacity=".3"/>
    ${m.items.map(i => `<rect x="${pad + i.x * u}" y="${pad + i.y * u}" width="${i.w * u}" height="${i.h * u}" fill="${IE_MC[i.c] || IE_MC.b}" stroke="#fff" stroke-width="1"/><text x="${pad + (i.x + i.w / 2) * u}" y="${pad + (i.y + i.h / 2) * u + 3}" font-size="${i.w * u < 50 ? 7 : 8.5}" text-anchor="middle" fill="#111">${esc(i.t)}</text>`).join('')}
    <text x="${S - 10}" y="${S + 10}" font-size="9" text-anchor="middle" fill="currentColor">N ↑</text></svg></div>`; }
const ieT1Text = x => x.kind === 'map' ? 'Maps: ' + x.maps.map(m => m.t + ': ' + m.items.map(i => `${i.t} (x${i.x}–${i.x + i.w}, y${i.y}–${i.y + i.h}; north = top)`).join(', ')).join(' | ')
  : x.kind === 'process' ? 'Process stages: ' + x.steps.map((s, i) => `${i + 1}. ${s}`).join(' ') : 'Chart data (' + x.unit + '): ' + x.series.map(s => s[0] + ': ' + x.cats.map((c, i) => c + ' ' + s[1][i]).join(', ')).join(' | ');
function ieChart(x) { if (x.kind === 'map') return `<div class="box" style="margin:8px 0"><b style="font-size:15px">${esc(x.title)}</b><div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:6px">${x.maps.map(ieMapSvg).join('')}</div><p class="mute" style="margin:6px 0 0">Phía trên = hướng bắc. Bản đồ minh hoạ, không phải nơi thật.</p></div>`;
  if (x.kind === 'process') return `<div class="box" style="margin:8px 0"><b style="font-size:15px">${esc(x.title)}</b>${x.steps.map((s, i) => `${i ? '<div style="text-align:center;line-height:1.1" class="mute">↓</div>' : ''}<div style="border:1px solid var(--line);border-radius:8px;padding:6px 10px;margin:2px 0"><b>${i + 1}</b> · ${esc(s)}</div>`).join('')}</div>`;
  const W = 340, H = 200, L = 34, B = 26, T = 8, all = x.series.flatMap(s => s[1]), max = Math.max(...all) * 1.1, y = v => T + (H - T - B) * (1 - v / max);
  const leg = (names, cols) => `<div class="chips" style="margin:4px 0 0">${names.map((n, i) => `<span style="font-size:13px"><i style="display:inline-block;width:10px;height:10px;border-radius:2px;background:${cols[i]};margin-right:4px"></i>${esc(n)}</span>`).join(' ')}</div>`;
  const grid = [0, 0.25, 0.5, 0.75, 1].map(f => { const v = max * f, yy = y(v); return `<line x1="${L}" x2="${W}" y1="${yy}" y2="${yy}" stroke="currentColor" stroke-opacity=".15"/><text x="${L - 4}" y="${yy + 4}" font-size="10" text-anchor="end" fill="currentColor">${Math.round(v * 10) / 10}</text>`; }).join('');
  const box = svg => `<div class="box" style="margin:8px 0"><b style="font-size:15px">${esc(x.title)}</b><svg viewBox="0 0 ${W} ${H}" width="100%" role="img" aria-label="${esc(x.title)}" style="display:block;margin-top:6px">${svg}</svg>`;
  if (x.kind === 'table') return `<div class="box" style="margin:8px 0;overflow-x:auto"><b style="font-size:15px">${esc(x.title)}</b><table style="width:100%;border-collapse:collapse;margin-top:6px;font-size:14px">
    <tr><th></th>${x.series.map(s => `<th style="text-align:right;padding:4px">${esc(s[0])}</th>`).join('')}</tr>
    ${x.cats.map((c, i) => `<tr style="border-top:1px solid var(--line)"><td style="padding:4px">${esc(c)}</td>${x.series.map(s => `<td style="text-align:right;padding:4px">${s[1][i]}</td>`).join('')}</tr>`).join('')}</table>
    <p class="mute" style="margin:6px 0 0">Đơn vị: ${esc(x.unit)}. Số minh hoạ, không phải số thật.</p></div>`;
  if (x.kind === 'pie') { const pie = (vals, cx) => { let a = -Math.PI / 2; const tot = vals.reduce((s, v) => s + v, 0), r = 62;
      return vals.map((v, i) => { const a2 = a + v / tot * 2 * Math.PI, p = `M${cx},95 L${cx + r * Math.cos(a)},${95 + r * Math.sin(a)} A${r},${r} 0 ${a2 - a > Math.PI ? 1 : 0} 1 ${cx + r * Math.cos(a2)},${95 + r * Math.sin(a2)} Z`, m = (a + a2) / 2;
        a = a2; return `<path d="${p}" fill="${IE_COL[i]}"/><text x="${cx + r * 0.68 * Math.cos(m)}" y="${95 + r * 0.68 * Math.sin(m) + 4}" font-size="10" text-anchor="middle" fill="#fff">${v}</text>`; }).join(''); };
    return box(x.series.map((s, i) => `${pie(s[1], 85 + i * 170)}<text x="${85 + i * 170}" y="190" font-size="12" text-anchor="middle" fill="currentColor">${esc(s[0])}</text>`).join('')) + leg(x.cats, IE_COL) + `<p class="mute" style="margin:6px 0 0">Đơn vị: ${esc(x.unit)}. Số minh hoạ, không phải số thật.</p></div>`; }
  const n = x.cats.length, step = (W - L) / n;
  const xl = x.cats.map((c, i) => `<text x="${L + step * (i + 0.5)}" y="${H - 8}" font-size="10" text-anchor="middle" fill="currentColor">${esc(c)}</text>`).join('');
  const body = x.kind === 'line' ? x.series.map(([, v], k) => `<polyline fill="none" stroke="${IE_COL[k]}" stroke-width="2.5" points="${v.map((d, i) => `${L + step * (i + 0.5)},${y(d)}`).join(' ')}"/>${v.map((d, i) => `<circle cx="${L + step * (i + 0.5)}" cy="${y(d)}" r="3" fill="${IE_COL[k]}"/>`).join('')}`).join('')
    : x.series.map(([, v], k) => { const bw = step * 0.8 / x.series.length; return v.map((d, i) => `<rect x="${L + step * i + step * 0.1 + bw * k}" y="${y(d)}" width="${bw - 1}" height="${H - B - y(d)}" fill="${IE_COL[k]}"/>`).join(''); }).join('');
  return box(grid + xl + body) + leg(x.series.map(s => s[0]), IE_COL) + `<p class="mute" style="margin:6px 0 0">Đơn vị: ${esc(x.unit)}. Số minh hoạ, không phải số thật.</p></div>`; }
const IE_TASK = { t1: ['Task 1 (Academic): tả biểu đồ', 150, 20], gt1: ['Task 1 (General Training): viết thư', 150, 20], t2: ['Task 2: bài luận', 250, 40] };
const IE_T2T = { opinion: 'nêu mức đồng ý', discuss: 'bàn hai quan điểm + ý kiến riêng', advdis: 'lợi và hại', probsol: 'nguyên nhân / vấn đề và giải pháp', twopart: 'trả lời đủ hai câu hỏi' };
const IE_REG = { formal: 'thư trang trọng (người lạ): Dear Sir or Madam … Yours faithfully', semi: 'thư nửa trang trọng (người quen công việc): Dear Mr / Ms … Yours sincerely', informal: 'thư thân mật (bạn bè): Dear + tên … Best wishes / Love' };
function ieWHead(task, x) { const [t, min, m] = IE_TASK[task];
  return `<div class="box"><b>✍️ ${t}</b> <span class="mute">· ít nhất ${min} từ · nên viết ~${m} phút</span><p style="margin:6px 0">${esc(x.p)}</p><p class="mute" style="margin:0">${esc(x.pv)}</p>
    ${task === 'gt1' ? `<p class="mute" style="margin:6px 0 0">Kiểu thư: ${IE_REG[x.reg]}.</p>` : task === 't2' ? `<p class="mute" style="margin:6px 0 0">Dạng đề: ${IE_T2T[x.type]}.</p>` : ''}</div>${task === 't1' ? ieChart(x) : ''}`; }
// đặc điểm bắt buộc của từng dạng bài (máy dò bằng từ khoá): [nhãn, có / không]
const IE_OVER = /\b(overall|in general|it is clear|it can be seen|in summary|to sum up|generally speaking|the most (noticeable|striking|significant))\b/;
const IE_CMP = /\b(higher|lower|more than|less than|compared|whereas|while|in contrast|by contrast|the most|the least|twice|double|half|larger|smaller|biggest|smallest)\b/;
const IE_TREND = /\b(rose|rise|rising|fell|fall|falling|increase[sd]?|decrease[sd]?|grew|growth|declin\w+|dropped|drop|peak\w*|steadily|remained|stable|doubled|halved)\b/;
const IE_POS = /\b(i (strongly |completely |partly |firmly )?(agree|disagree|believe|think|feel|would argue)|in my (opinion|view)|from my (perspective|point of view)|my view is|i am convinced)\b/;
const IE_END = /\b(in conclusion|to conclude|to sum up|in summary|overall|all in all|on balance)\b/;
// v99 (nhật ký trải nghiệm: "as the United Kingdom did in 2018" bị báo thiếu ví dụ): nhận cả ví dụ cụ thể không có từ báo hiệu: năm, phần trăm,
// "as … did", nêu tên nước, "a case in point", "according to"
const IE_EG = /\b(for example|for instance|such as|e\.g\.|a good example|to illustrate|a case in point|take [a-z]+ as an example|according to|namely)\b|\bas [a-z ]{2,40}? (did|does|has done|have done)\b|\b(in|of|like) (19|20)\d\d\b|\b\d+(\.\d+)? ?(%|percent|per cent)|\b(in|like|of) (vietnam|the uk|the united kingdom|britain|the united states|the us|america|japan|china|singapore|korea|south korea|australia|germany|france|india|finland|sweden|norway|canada)\b/;
function ieFeat(task, x, t) { const low = t.toLowerCase();
  if (task === 't1' && (x.kind === 'map' || x.kind === 'process')) { const hit = (x.k || []).filter(k => low.includes(k.toLowerCase())).length, need = Math.ceil((x.k || []).length * 0.7);
    const seq = (low.match(/\b(first(ly)?|then|next|after (that|this)|once|finally|following this|subsequently|at the (start|end)|in the (next|final) stage)\b/g) || []).length;
    const pas = (low.match(/\b(is|are|was|were|has been|have been|had been|will be|being)\s+\w+(ed|en|t)\b/g) || []).length;
    const chg = /\b(replaced|demolished|built|constructed|converted|extended|removed|added|relocated|reduced|expanded|knocked down|turned into|developed)\b/.test(low), loc = /\b(north|south|east|west|next to|opposite|beside|between|in the (centre|center|corner)|to the (left|right))\w*\b/.test(low);
    return [['Câu mở: nói hình cho thấy gì', /\b(shows?|illustrates?|compares?|depicts?|presents?)\b/.test(low)], ['Có câu tổng quan (overall…)', IE_OVER.test(low)],
      [`Nhắc đủ ${x.kind === 'map' ? 'địa điểm' : 'bước'} chính (${hit}/${(x.k || []).length})`, hit >= need],
      ...(x.kind === 'process' ? [['Từ chỉ thứ tự bước (first, then, finally…)', seq >= 3], ...(x.nat ? [] : [[`Câu bị động (${pas})`, pas >= 3]])] : [['Động từ chỉ thay đổi (replaced, built…)', chg], ['Từ chỉ vị trí (north, next to…)', loc]]),   // quy trình tự nhiên (nat: vòng đời…) viết chủ động, không bắt bị động
      ['Không nêu ý kiến riêng (I think…)', !IE_POS.test(low)]]; }
  if (task === 't1') { const nums = new Set(x.series.flatMap(s => s[1]).map(String)), hit = (t.match(/\d+(\.\d+)?/g) || []).filter(d => nums.has(d)).length;
    return [['Câu mở: nói biểu đồ cho thấy gì', /\b(shows?|illustrates?|compares?|gives information|presents?|depicts?)\b/.test(low)], ['Có câu tổng quan (overall…)', IE_OVER.test(low)],
      [`Dẫn số liệu (${hit}/4 số)`, hit >= 4], ['Có so sánh (higher, whereas…)', IE_CMP.test(low)], ['Tả xu hướng / thay đổi', IE_TREND.test(low) || x.kind === 'table'], ['Không nêu ý kiến riêng (I think…)', !IE_POS.test(low)]]; }
  if (task === 'gt1') { const close = { formal: /yours faithfully|yours sincerely/, semi: /yours sincerely|kind regards|best regards/, informal: /\b(love|best wishes|take care|see you|cheers|all the best|speak soon|write soon)\b/ }[x.reg];
    const contr = (t.match(/\b\w+'(s|re|ve|ll|d|t|m)\b/gi) || []).length;
    return [...x.c.map((c, i) => [c, kHit(t, x.k[i])]), ['Mở thư: Dear …', /^\s*dear\b/i.test(t)], ['Kết thư đúng kiểu', close.test(low)],
      ['Giọng văn hợp kiểu thư', x.reg === 'informal' ? contr > 0 || /\b(can't wait|hope you|how are you|great to)\b/.test(low) : contr <= 2 && !/\b(gonna|wanna|hey|guys|stuff|yeah)\b/.test(low)]]; }
  const two = { discuss: [/\b(some people|others|on the one hand|on the other hand|supporters|opponents|critics)\b/g, 2], advdis: [/\b(advantage|benefit|drawback|disadvantage|downside)s?\b/g, 2], probsol: [/\b(cause|reason|because|due to|solution|solve|measure|tackle|address)\w*\b/g, 2], twopart: [/\b(why|reason|because|positive|negative|problem|solution|should|could)\b/g, 3], opinion: [/\b(agree|disagree|believe)\b/g, 1] }[x.type];
  return [['Đúng chủ đề đề bài', (x.k || []).every(g => kHit(t, g))], ['Nêu rõ quan điểm', IE_POS.test(low) || x.type === 'probsol'], [`Đủ phần của dạng đề (${IE_T2T[x.type]})`, (low.match(two[0]) || []).length >= two[1]],
    ['Có ví dụ / dẫn chứng', IE_EG.test(low)], ['Có kết luận', IE_END.test(low)]]; }
// 4 tiêu chí IELTS (máy đo gián tiếp): Task Achievement / Response · Coherence & Cohesion · Lexical Resource · Grammatical Range & Accuracy
// từ chép nguyên văn từ đề (chuỗi ≥ 4 từ liền trùng đề): đề thật không tính vào số từ (v70)
function ieCopied(t, p) { const a = kWords(t), b = kWords(p), g = new Set(); for (let i = 0; i + 4 <= b.length; i++) g.add(b.slice(i, i + 4).join(' '));
  const hit = new Set(); for (let i = 0; i + 4 <= a.length; i++) if (g.has(a.slice(i, i + 4).join(' '))) for (let j = i; j < i + 4; j++) hit.add(j); return hit.size; }
function ieWScore(task, x, t) { const ws = kWords(t), cp = ieCopied(t, x.p), wc = ws.length - cp, min = IE_TASK[task][1], cap = v => Math.max(0, Math.min(1, v)), low = t.toLowerCase();
  if (wc < 30) return { band: 0, C: [], f: [], errs: [], wc, min, d: {} };
  const f = [...ieFeat(task, x, t), [`Không chép nguyên văn đề (${cp} từ chép, không tính)`, cp <= 12]], lenF = wc >= min ? 1 : wc >= min * 0.8 ? 0.5 : 0;
  const paras = t.split(/\n\s*\n|\n(?=\s*[A-Z])/).filter(p => kWords(p).length >= (task === 'gt1' ? 3 : 8)).length, tP = 4, tL = task === 't2' ? 8 : 6;
  const lk = W_LINK.map(l => [l, (low.match(new RegExp(`\\b${l}\\b`, 'g')) || []).length]).filter(([, n]) => n), links = lk.length, over = lk.some(([l, n]) => !['and', 'but', 'so', 'also'].includes(l) && n > 3);
  WBY_W = WBY_W || Object.fromEntries(WORDS.map(w => [w.w.toLowerCase(), w]));
  const hi = new Set(ws.filter(w => { if (w.length < 4) return false; const L = xLvOf(w); return L && LEVELS.indexOf(L) >= LEVELS.indexOf('b2'); })).size, tV = task === 't2' ? 15 : 8;
  const cont = ws.filter(w => w.length >= 4), ttr = cont.length ? new Set(cont).size / cont.length : 0;
  const errs = wErrors(t), per100 = errs.length / Math.max(1, wc) * 100, ss = kSents(t), sents = Math.max(1, ss.length), uniq = new Set(ss.map(kNorm)).size / sents;   // uniq: câu lặp lại = vốn câu nghèo
  const sub = (low.match(/\b(because|although|which|who|whom|whose|that|when|if|while|whereas|unless|since|so that|even though|provided that)\b/g) || []).length;
  const C = [[task === 't2' ? 'Task Response (trả lời đề)' : 'Task Achievement (hoàn thành đề)', 0.35 * lenF + 0.65 * f.filter(a => a[1]).length / f.length],
    ['Coherence & Cohesion (mạch lạc, liên kết)', 0.5 * cap(paras / tP) + 0.5 * cap(links / tL) - (over ? 0.15 : 0)],
    ['Lexical Resource (vốn từ)', 0.6 * cap(hi / tV) + 0.4 * cap(ttr / 0.6)],
    ['Grammatical Range & Accuracy (ngữ pháp)', 0.4 * cap(1 - per100 / 3) + 0.4 * cap(sub / sents / 0.6) + 0.2 * uniq]].map(([n, v]) => [n, ieB(v)]);
  // viết thiếu nhiều bị chặn điểm (giám khảo trừ nặng ở tiêu chí 1 và bài thiếu ý): < 50% độ dài → tối đa 4.0, < 80% → tối đa 5.0
  const capB = wc < min * 0.5 ? 4 : wc < min * 0.8 ? 5 : 9;
  return { band: Math.min(capB, ieRound(ieAvg(C.map(c => c[1])))), C, f, errs, wc, min, cp, d: { paras, links, hi, tV, over } }; }
function ieWHtml(task, x, t, r) { const lv = ieLvTag();
  if (!r.band) return `<div class="box"><b>Bài quá ngắn (${r.wc} từ): chưa chấm.</b><p class="mute" style="margin:4px 0 0">Đề cần ít nhất ${r.min} từ; viết thiếu bị trừ điểm.</p></div>`;
  return `<div class="box"><b>🧐 Máy ước: band ${bandTxt(r.band)}</b> <span class="mute">· ${r.wc} từ tính điểm${r.cp ? ` (bỏ ${r.cp} từ chép đề)` : ''} (cần ≥ ${r.min})</span>
    ${r.C.map(([n, b]) => `<p style="margin:4px 0">${n}: <b>${bandTxt(b)}</b></p>`).join('')}
    <p style="margin:6px 0 2px"><b>Đủ yêu cầu dạng bài:</b></p>${r.f.map(([l, ok]) => `<p style="margin:2px 0">${ok ? '✅' : '⬜'} ${esc(l)}</p>`).join('')}
    <p class="mute" style="margin:6px 0 0">${r.d.paras} đoạn · ${r.d.links} từ nối khác nhau${r.d.over ? ' (có từ nối dùng quá 3 lần)' : ''} · ${r.d.hi}/${r.d.tV} từ B2 trở lên.</p>
    ${r.errs.length ? `<p style="margin:6px 0 0"><b>Lỗi hay gặp (${r.errs.length}):</b></p>${r.errs.map(([s, m]) => `<p style="margin:2px 0">❌ “${esc(s)}” · ${esc(m)}</p>`).join('')}` : ''}
    <p class="mute" style="margin:6px 0 0">Máy đo gián tiếp (độ dài, từ khoá, từ nối, từ vựng theo cấp, lỗi hay gặp), chỉ báo tới band ${IE_MAXM}.0, chưa đối chiếu giám khảo. Nhờ AI chấm theo thang band IELTS để biết lỗi cụ thể.</p>
    ${aiBtn('viet', lv, { prompt: x.p + (task === 't1' ? '\n\n' + ieT1Text(x) : ''), genre: IE_TASK[task][0], min: r.min, max: r.min + 150, part: task === 't2' ? 'Task 2' : 'Task 1', target: ieSt().target, mb: r.band }, t)}${typeof ieShareBtn === 'function' ? ieShareBtn('IELTS Writing ' + (task === 't2' ? 'Task 2' : 'Task 1'), x.p + (task === 't1' ? '\n(' + x.title + ' · ' + ieT1Text(x) + ')' : ''), t) : ''}</div>
    ${x.m ? `<details class="box"><summary>Bài mẫu (Claude viết, tham khảo)</summary><p class="tdtap" style="white-space:pre-line">${esc(x.m)}</p></details>` : ''}`; }
const ieWQ = (task, x) => ({ x, task, k: 'w-' + task, kind: 'write', head: ieWHead(task, x), q: '✍️ Viết bài vào ô dưới.',
  check: t => { const r = ieWScore(task, x, t); return { ok: r.band >= ieSt().target, sc: r.band / 9, band: r.band, html: ieWHtml(task, x, t, r) }; } });
const ieT1 = () => ieSt().type === 'gt' ? ['gt1', IE.gt1] : ['t1', IE.t1];
const ieWPick = task => { const its = task === 't2' ? IE.t2 : task === 'gt1' ? IE.gt1 : IE.t1, done = new Map(ieSt().w.map(r => [r.id, r.at])); return shuf(its).sort((a, b) => (done.get(a.id) || 0) - (done.get(b.id) || 0))[0]; };

// ---------- 🗣 Speaking ----------
// Part 1: hỏi đáp ngắn · Part 2: thẻ đề, 1 phút chuẩn bị, nói tới 2 phút · Part 3: bàn luận sâu hơn cùng chủ đề Part 2
const IE_SMIN = { p1: 25, p2: 140, p3: 45 };
function ieSpeakQs(parts = ['p1', 'p2', 'p3']) { const out = [], card = iePick(IE.p2, 1)[0];
  if (parts.includes('p1')) { const t = iePick(IE.p1, 1)[0]; for (const [q, vi] of t.qs) out.push({ part: 'Part 1: ' + t.topic, q: { kind: 'say', mode: 'p1', q, vi, id: t.id } }); }
  if (parts.includes('p2')) out.push({ part: 'Part 2: nói dài', q: { kind: 'say', mode: 'p2', q: card.t, vi: card.vi, card, id: card.id } });
  if (parts.includes('p3')) for (const [q, vi] of card.p3) out.push({ part: 'Part 3: bàn luận', q: { kind: 'say', mode: 'p3', q, vi, id: card.id } });
  return out; }
// chạy bài nói: res nhận { part, q, ans, secs, lat }; Part 2 có 1 phút chuẩn bị (bấm để nói sớm), tự dừng sau 2 phút
function ieSpeakCore(qs, res, done, quit) { let i = 0;
  const show = () => { if (i >= qs.length) return done(); const { part, q } = qs[i]; window.CUR = { view: 'ielts-noi', item: q.id + ':' + i, prompt: q.q };
    const card = q.card ? `<div class="box"><p style="margin:0;font-size:18px"><b>${esc(q.card.t)}</b></p><p style="margin:6px 0 0">You should say:</p>${q.card.b.map(b => `<p style="margin:2px 0">• ${esc(b)}</p>`).join('')}<p class="mute" style="margin:6px 0 0">${esc(q.card.vi)}</p></div>` : '';
    $app.innerHTML = `<div class="row top"><button class="link" data-a="quit">← Bỏ</button><span class="uname">🗣 ${i + 1}/${qs.length}</span><b id="iet"></b></div><p class="mute" style="margin:4px 0">${esc(part)}</p>
      ${card || `<div class="box"><p style="margin:0;font-size:18px">${esc(q.q)}</p><p class="mute" style="margin:4px 0 0">${esc(q.vi)}</p></div>`}
      ${q.mode === 'p2' ? '<p class="mute">Có 1 phút chuẩn bị (ghi chú ra giấy). Nói 1–2 phút, đủ 4 ý gợi ý. Máy tự dừng ở 2 phút.</p>' : `<p class="mute">Trả lời đầy đủ, có lý do / ví dụ (~${q.mode === 'p1' ? '2–3 câu' : '4–6 câu'}).</p>`}
      <button class="pri" data-rec>${q.mode === 'p2' ? '🎤 Nói ngay (bỏ thời gian chuẩn bị)' : '🎤 Bấm rồi nói'}</button><div class="box"><b>📝 Máy nghe ra:</b> <span id="kheard">…</span></div>`;
    let t0 = 0, tFirst = 0, fin = false, tick = null, prep = q.mode === 'p2' ? Date.now() + 60000 : 0;
    const clock = () => { const el = document.getElementById('iet'); if (!el) return clearInterval(tick);
      if (prep && !t0) { const s = Math.max(0, Math.round((prep - Date.now()) / 1000)); el.textContent = `⏳ ${s}s`; if (s <= 0) start(); return; }
      if (t0) { const s = Math.round((Date.now() - t0) / 1000); el.textContent = `🎤 ${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`; if (q.mode === 'p2' && s >= 120) stop(); } };
    const start = () => { if (t0) return; try { speechSynthesis.cancel(); } catch (er) {} t0 = Date.now(); const b = $app.querySelector('[data-rec]'); if (b) b.textContent = '⏹ Dừng';
      kAsrStart(txt => { if (!tFirst && txt) tFirst = Date.now(); const h = document.getElementById('kheard'); if (h) h.textContent = txt || '…'; }); };
    const stop = () => { if (fin) return; fin = true; clearInterval(tick); const b = $app.querySelector('[data-rec]'); if (b) { b.disabled = true; b.textContent = '⏳ Đang lưu…'; } const t1 = Date.now();
      kAsrStop(txt => { res.push({ part, q, ans: txt, secs: (t1 - t0) / 1000, lat: tFirst ? (tFirst - t0) / 1000 : 99 }); i++; show(); }); };
    tick = setInterval(clock, 500); if (q.mode !== 'p2') speak(q.q);
    $app.onclick = e => { if (e.target.closest('[data-a="quit"]')) { if (!confirm('Bỏ bài nói? Lần này không lưu.')) return; clearInterval(tick); kAsrStop(); return quit(); }
      const b = e.target.closest('[data-rec]'); if (!b || fin) return; if (!t0) return start(); stop(); }; };
  show(); }
// 4 tiêu chí Nói (máy đo gián tiếp): Fluency & Coherence · Lexical Resource · Grammatical Range & Accuracy · Pronunciation (chỉ qua việc máy chép ra được bao nhiêu)
function ieSScore(res) { const cap = v => Math.max(0, Math.min(1, v)), said = res.filter(r => kWords(r.ans || '').length), all = res.map(r => String(r.ans || '').toLowerCase()).join(' '), ws = kWords(all);
  if (ws.length < 15) return { band: 0, C: [], d: { words: ws.length } };
  const len = ieAvg(res.map(r => cap(kWords(r.ans || '').length / IE_SMIN[r.q.mode]))), secs = said.reduce((s, r) => s + Math.max(1, r.secs || 0), 0), wpm = secs ? ws.length / (secs / 60) : 0;
  const links = SPK_LINK.filter(l => new RegExp(`\\b${l}\\b`).test(all)).length, quick = ieAvg(res.map(r => r.lat <= 4 ? 1 : 0));
  WBY_W = WBY_W || Object.fromEntries(WORDS.map(w => [w.w.toLowerCase(), w]));
  const hi = new Set(ws.filter(w => { if (w.length < 4) return false; const L = xLvOf(w); return L && LEVELS.indexOf(L) >= LEVELS.indexOf('b2'); })).size, cont = ws.filter(w => w.length >= 4), ttr = cont.length ? new Set(cont).size / cont.length : 0;
  const feats = Object.keys(SPK_RE).filter(k => SPK_RE[k].test(all)), heard = ieAvg(res.map(r => kWords(r.ans || '').length >= IE_SMIN[r.q.mode] * 0.5 ? 1 : 0));
  const C = [['Fluency & Coherence (trôi chảy, mạch lạc)', 0.4 * len + 0.25 * cap(wpm / 110) + 0.2 * cap(links / 6) + 0.15 * quick], ['Lexical Resource (vốn từ)', 0.6 * cap(hi / 12) + 0.4 * cap(ttr / 0.55)],
    ['Grammatical Range & Accuracy (ngữ pháp)', cap(feats.length / 6)], ['Pronunciation (dễ hiểu, rất sơ bộ)', heard]].map(([n, v]) => [n, ieB(v)]);
  return { band: ieRound(ieAvg(C.map(c => c[1]))), C, d: { words: ws.length, wpm: Math.round(wpm), links, hi, feats: feats.map(k => SPK_REVI[k]) } }; }
function ieSHtml(res, sc) { if (!sc.band) return `<div class="box"><b>Máy nghe được quá ít (${sc.d.words} từ): chưa chấm.</b><p class="mute" style="margin:4px 0 0">Cần Safari trên iPhone để chép lời. Nói to, rõ, gần máy.</p></div>`;
  return `<div class="box"><b>🧐 Máy ước: band ${bandTxt(sc.band)}</b>${sc.C.map(([n, b]) => `<p style="margin:4px 0">${n}: <b>${bandTxt(b)}</b></p>`).join('')}
    <p class="mute" style="margin:6px 0 0">${sc.d.words} từ · ${sc.d.wpm} từ/phút (người nói tự nhiên ~110–150) · ${sc.d.links} từ nối khác nhau · ${sc.d.hi} từ B2 trở lên · cấu trúc đã dùng: ${sc.d.feats.join(', ') || 'chưa thấy'}.</p>
    ${res.map(r => `<p style="margin:6px 0 0;font-size:14px"><span class="mute">${esc(r.part)}: ${esc(r.q.q)}</span><br>Bạn: “${esc(r.ans || '…')}”</p>`).join('')}
    ${[...new Set(res.map(r => r.q.card).filter(c => c && c.m))].map(c => `<details style="margin-top:6px"><summary>Bài nói mẫu Part 2 (tham khảo cách triển khai, đừng học thuộc)</summary><p style="font-size:15px">${esc(c.m)}</p></details>`).join('')}
    <p class="mute" style="margin:6px 0 0">Máy chỉ thấy lời đã chép (máy chép tự sửa một số lỗi, không nghe được ngữ điệu), nên chấm phát âm và ngữ pháp rất sơ bộ, chỉ báo tới band ${IE_MAXM}.0. Nên nói thử với giáo viên.</p>
    ${aiBtn('noi', ieLvTag(), { prompt: 'IELTS Speaking test (Part 1 interview, Part 2 long turn, Part 3 discussion). Each answer follows its question.', target: ieSt().target, mb: sc.band },
      res.map(r => `[${r.part}] Examiner: ${r.q.q}\nCandidate: ${r.ans || '(no answer)'}`).join('\n\n'))}</div>`; }

// ---------- màn luyện (báo đúng / sai ngay, không tính giờ) ----------
// min: tính giờ như đề thật (Đọc cả bài ~20 phút), báo thời gian ở cuối
// o (v72, TOEIC dùng chung): { R: nơi ghi kết quả (mặc định S.ie.r), home: nhãn nút về, done: gọi sau khi lưu, spd: giây mục tiêu mỗi câu (v73, đồng hồ từng câu), endHtml: thêm vào màn kết quả }
// ---------- 📊 Ghi theo dạng câu + tiêu chí (v82, bước 1 của "Bản đồ band"; người sáng lập 29/10/2026) ----------
// Chỉ ghi dữ liệu, chưa đổi cách học. Chỗ yếu IELTS là dạng câu (Đọc / Nghe) và tiêu chí chấm (Viết / Nói), không phải từng bài.
// o.ty[dạng] = [{ at, ok, n, ids (bài), src: 'luyen' | 'thi' }] (40 lượt gần nhất); o.cr = [{ at, k: 'W' | 'S', task, c: [band 4 tiêu chí], src: 'may' | 'ai' }] (80 lần).
// Đủ chắc để gọi là chỗ yếu: ≥ 8 câu ở ≥ 2 bài khác nhau; Viết / Nói: chỉ AI / giáo viên chấm mới đủ tin (máy đo gián tiếp).
const IE_TY = { 'R-h': 'Nối tiêu đề (Matching headings)', 'R-tf': 'True / False / Not Given', 'R-comp': 'Điền từ (Completion)', 'R-mc': 'Trắc nghiệm Đọc', 'R-gt': 'Đọc văn bản đời thường (GT)', 'L-form': 'Nghe điền phiếu', 'L-mc': 'Nghe trắc nghiệm' };
const IE_CR = { W: ['Hoàn thành đề', 'Mạch lạc', 'Vốn từ', 'Ngữ pháp'], S: ['Trôi chảy', 'Vốn từ', 'Ngữ pháp', 'Phát âm'] }, IE_TY_N = 8, IE_TY_OK = 75;
function ieTyLog(res, src, fresh) { const o = ieSt(), T = o.ty = o.ty || {}, by = {};
  for (const r of res) { const q = r.q || {}, ty = q.ty; if (!ty) continue; const b = by[ty] = by[ty] || { at: Date.now(), ok: 0, n: 0, ids: [], src }; b.n++; if (r.ok) b.ok++; const id = q.x && q.x.id; if (id && !b.ids.includes(id)) b.ids.push(id); }
  for (const [ty, b] of Object.entries(by)) { T[ty] = [...(T[ty] || []), b].slice(-40);
    // 🗺 bản đồ band (iemap.js): một lần thử khi lượt có ≥ 4 câu của dạng trên bài chưa gặp 30 ngày (fresh: id các bài mới; đề thử: luôn tính)
    if (typeof imHit === 'function' && b.n >= IM_MIN_Q && (!fresh || b.ids.some(id => fresh.has(id)))) imHit(ty, b.ok / b.n * 100 >= IE_TY_OK); }
  return by; }
function ieCrLog(k, task, C, src) { if (!C || C.length !== 4) return; const o = ieSt(), c = C.map(c => Array.isArray(c) ? c[1] : +c); o.cr = [...(o.cr || []), { at: Date.now(), k, task: task || null, c, src }].slice(-80);
  if (typeof imHit === 'function') c.forEach((b, i) => imHit(k + ':' + i, b >= o.target)); }
// mỗi dạng: % đúng 10 lượt gần nhất, số câu, số bài khác nhau; mỗi tiêu chí: band trung bình 5 lần gần nhất, máy và AI tách riêng
function ieTyStats() { const o = ieSt(), T = o.ty || {};
  const ty = Object.keys(IE_TY).map(k => { const a = (T[k] || []).slice(-10), n = a.reduce((s, b) => s + b.n, 0), ok = a.reduce((s, b) => s + b.ok, 0), items = new Set(a.flatMap(b => b.ids)).size;
    return { k, t: IE_TY[k], n, items, pct: n ? Math.round(ok / n * 100) : null, sure: n >= IE_TY_N && items >= 2 }; });
  const cr = ['W', 'S'].flatMap(k => ['ai', 'may'].map(src => { const a = (o.cr || []).filter(r => r.k === k && r.src === src).slice(-5);
    return { k, src, n: a.length, c: a.length ? IE_CR[k].map((_, i) => ieRound(a.reduce((s, r) => s + (r.c[i] || 0), 0) / a.length)) : null }; }));
  return { ty, cr }; }
function ieTyBox() { const { ty, cr } = ieTyStats(), has = ty.filter(t => t.n), hc = cr.filter(c => c.n); if (!has.length && !hc.length) return '';
  return `<details class="box"><summary><b>📊 Theo dạng câu &amp; tiêu chí</b> <span class="mute">· ${has.length} dạng có dữ liệu</span></summary>
    ${has.map(t => `<div class="row" style="margin:4px 0"><span>${esc(t.t)}</span><span class="${t.pct >= IE_TY_OK ? 'okc' : ''}">${t.pct}% <span class="mute">· ${t.n} câu, ${t.items} bài${t.sure ? '' : ' · chưa đủ chắc'}</span></span></div>`).join('')}
    ${hc.map(c => `<p style="margin:6px 0 2px"><b>${c.k === 'W' ? '✍️ Viết' : '🗣 Nói'} · ${c.src === 'ai' ? '🧑‍🏫 AI chấm' : 'máy ước (gián tiếp)'}</b> <span class="mute">· ${c.n} lần gần nhất</span></p>
      <p class="mute" style="margin:0">${IE_CR[c.k].map((n, i) => `${n} ${bandTxt(c.c[i])}`).join(' · ')}</p>`).join('')}
    <p class="mute" style="margin:6px 0 0">Bước 1: app mới ghi dữ liệu. Dạng dưới ${IE_TY_OK}% với ≥ ${IE_TY_N} câu ở ≥ 2 bài là chỗ yếu đủ chắc. Viết / Nói nên tin 🧑‍🏫 AI chấm hơn máy ước.</p></details>`; }
function ieRun(title, qs, back, min, o = {}) { const res = []; let i = 0, tq = 0; const plays = {}, t0 = Date.now(), clk = () => { const s = Math.round((Date.now() - t0) / 1000); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`; };
  const show = () => { if (i >= qs.length) return end(); const q = qs[i]; tq = Date.now(); window.CUR = { view: 'ielts-cau', item: (q.x && q.x.id || '') + ':' + i, prompt: String(q.q).replace(/<[^>]*>/g, '').slice(0, 200) };
    const pk = q.play && q.play.key, left = () => K_PLAYS - (plays[pk] || 0);
    const body = q.kind === 'mc' ? q.opts.map((o, j) => `<button class="opt" data-io="${j}">${esc(o)}</button>`).join('')
      : `<form id="if" autocomplete="off"><input id="it" autocapitalize="off" autocorrect="off" spellcheck="false" aria-label="Câu trả lời"><button class="pri" type="submit">Trả lời</button></form>`;
    $app.innerHTML = `<div class="row top"><button class="link" data-a="back">← Thôi</button><span class="uname">${esc(title)} · ${i + 1}/${qs.length}</span>${o.spd ? `<b id="irt">⏱ 0 / ${o.spd}s</b>` : min ? `<b id="irt">⏱ ${clk()}</b>` : ''}</div>${q.head || ''}
      ${q.play ? `<button class="chip" data-iplay>🔊 Nghe (còn ${left()} lần)</button>` : ''}<p class="q" style="font-size:20px">${q.q}</p>${body}<div id="ifb"></div>${q.foot || ''}`;
    const f = document.getElementById('if'); if (f) { const t = document.getElementById('it'); f.onsubmit = e => { e.preventDefault(); if (!t.value.trim()) return t.focus();
      const r = q.check ? q.check(t.value) : { ok: (q.acc || [q.a]).some(a => kNorm(a) === kNorm(t.value)) }; t.disabled = true; f.querySelector('button').remove(); fb(r.ok, t.value, r.html); }; }
    $app.onclick = e => { if (e.target.closest('[data-a="back"]')) { EXAM_VOX = false; clearInterval(tk); return back(); } if (e.target.closest('[data-a="next"]')) { i++; scrollTo(0, 0); return show(); }
      const pb = e.target.closest('[data-iplay]'); if (pb) { if (left() > 0) { plays[pk] = (plays[pk] || 0) + 1; EXAM_VOX = true; kPlay(q.play); } pb.textContent = `🔊 Nghe lại (còn ${left()} lần)`; pb.disabled = left() <= 0; return; }
      const o = e.target.closest('[data-io]'); if (o && !o.disabled && res.length === i) { const v = q.opts[+o.dataset.io]; fb(v === q.a, v); } }; };
  const fb = (ok, ans, html) => { const q = qs[i]; res.push({ q, ok, ans, secs: (Date.now() - tq) / 1000 });
    if (q.kind === 'mc') $app.querySelectorAll('[data-io]').forEach(b => { b.disabled = true; const o = q.opts[+b.dataset.io]; if (o === q.a) b.classList.add('ok'); else if (o === ans) b.classList.add('no'); });
    document.getElementById('ifb').innerHTML = `<div class="box"><b>${ok ? '✅ Đúng' : '❌ Chưa đúng'}</b>${html ? `<p style="margin:4px 0">${html}</p>` : q.kind === 'mc' ? '' : `<p style="margin:4px 0">Đáp án: <b>${esc((q.acc || [q.a]).join(' / '))}</b></p>`}${q.why ? `<p class="mute" style="margin:4px 0 0">${esc(q.why)}</p>` : ''}</div><button class="pri" data-a="next">Tiếp ›</button>`;
    const n = $app.querySelector('[data-a="next"]'); if (n && n.scrollIntoView) n.scrollIntoView({ block: 'nearest' }); };
  const end = () => { EXAM_VOX = false; const R = o.R || ieSt().r, by = {}, fresh = new Set(res.map(r => r.q.x && r.q.x.id).filter(id => id && (!R[id] || Date.now() - R[id].at >= 30 * DAY))); for (const r of res) { const id = r.q.x && r.q.x.id; if (!id) continue; const o = by[id] = by[id] || { at: Date.now(), ok: 0, n: 0, k: r.q.sec || (r.q.x.paras ? 'r' : 'l'), ...(min ? { secs: Math.round((Date.now() - t0) / 1000) } : {}) }; o.n++; if (r.ok) o.ok++; }
    Object.assign(R, by); ieTyLog(res, 'luyen', fresh); S.t = Date.now(); save(); const ok = res.filter(r => r.ok).length, wrong = res.filter(r => !r.ok);
    const mins = (Date.now() - t0) / 60000; clearInterval(tk);
    $app.innerHTML = `<h1>${ok}/${res.length} câu đúng</h1>${min ? `<p>⏱ ${mins.toFixed(1)} phút ${mins <= min ? '✅' : '⚠️'} <span class="mute">(đề thật ~${min} phút mỗi bài${mins > min ? '; luyện đọc lướt tìm từ khoá, đừng đọc kỹ từng câu' : ''})</span></p>` : ''}${o.endHtml ? o.endHtml(res) : ''}${wrong.length ? `<div class="box"><b>Câu sai</b>${wrong.map(r => `<p style="margin:8px 0 0">${r.q.q}<br>Bạn: ${esc(r.ans)} · Đáp án: <b>${esc(r.q.a)}</b>${r.q.why ? `<br><span class="mute">${esc(r.q.why)}</span>` : ''}</p>`).join('')}</div>` : '<p>Đúng hết.</p>'}
      <p class="mute">Luyện ở đây không tính vào 🎯 Học CEFR.</p><button class="pri" data-a="back">← ${o.home || 'Học IELTS'}</button>`; scrollTo(0, 0); if (o.done) o.done(res, fresh); $app.onclick = e => { if (e.target.closest('[data-a="back"]')) back(); }; };
  const tk = min || o.spd ? setInterval(() => { const el = document.getElementById('irt'); if (!el) return; if (!o.spd) { el.textContent = '⏱ ' + clk(); return; }
    const s = res.length > i ? Math.round(res[i].secs) : Math.round((Date.now() - tq) / 1000); el.textContent = `⏱ ${s} / ${o.spd}s`; el.style.color = s > o.spd ? 'var(--bad)' : ''; }, 500) : 0;
  show(); }
// ✍️ luyện Viết: một đề, đếm giờ, đếm từ; nộp thì chấm 4 tiêu chí + nút AI chấm + bài mẫu
// pre: bài cũ để viết lại sau khi đọc góp ý (vòng viết → sửa → viết lại)
function ieWrite(task, x, pre) { x = x || ieWPick(task); const q = ieWQ(task, x), t0 = Date.now(); window.CUR = { view: 'ielts-viet', item: x.id };
  $app.innerHTML = `<div class="row top"><button class="link" data-a="back">← Thôi</button><span class="uname">✍️ ${esc(IE_TASK[task][0])}</span><b id="iet"></b></div>${q.head}
    <form id="iwf" autocomplete="off"><textarea id="iwt" rows="14" autocapitalize="sentences" spellcheck="false" aria-label="Bài viết">${esc(pre || '')}</textarea><p class="mute" id="iwc">${kWords(pre || '').length} từ</p><button class="pri" type="submit">Nộp bài</button></form>
    ${pre ? '<p class="mute">✍️ Viết lại: sửa theo góp ý của máy / AI rồi nộp lại để so band.</p>' : '<button data-a="other">🔀 Đổi đề khác</button>'}<div id="iwr"></div>`;
  const tick = setInterval(() => { const el = document.getElementById('iet'); if (!el) return clearInterval(tick); const s = Math.round((Date.now() - t0) / 1000); el.textContent = `⏱ ${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`; }, 1000);
  const t = document.getElementById('iwt'); t.oninput = () => { document.getElementById('iwc').textContent = kWords(t.value).length + ' từ'; };
  document.getElementById('iwf').onsubmit = e => { e.preventDefault(); if (kWords(t.value).length < 30) return toast('Viết ít nhất 30 từ để máy chấm.'); clearInterval(tick);
    const r = q.check(t.value); const prev = pre ? ieSt().w.filter(w => w.id === x.id).pop() : null; ieCrLog('W', task, ieWScore(task, x, t.value).C, 'may'); ieSt().w.push({ at: Date.now(), id: x.id, task, band: r.band, min: Math.round((Date.now() - t0) / 60000), ...(pre ? { redo: 1 } : {}) }); S.t = Date.now(); save();
    t.disabled = true; e.target.querySelector('button').remove(); document.getElementById('iwr').innerHTML = (prev ? `<p class="mute">Lần trước máy ước ${bandTxt(prev.band)} → lần này ${bandTxt(r.band)}.</p>` : '') + r.html + '<button class="pri" data-a="redo">✍️ Viết lại bài này (sửa theo góp ý)</button>'; const b = $app.querySelector('[data-a="other"]'); if (b) b.remove(); };
  $app.onclick = e => { if (e.target.closest('[data-a="back"]')) { clearInterval(tick); return ieltsView(); } if (e.target.closest('[data-a="redo"]')) { scrollTo(0, 0); return ieWrite(task, x, t.value); } if (e.target.closest('[data-a="other"]')) { clearInterval(tick); return ieWrite(task, shuf((task === 't2' ? IE.t2 : task === 'gt1' ? IE.gt1 : IE.t1).filter(y => y !== x))[0]); } }; }
function ieSpeak(parts) { if (!SREC) return toast('Phần Nói cần máy chép lời: mở trang bằng Safari trên iPhone.'); const qs = ieSpeakQs(parts), res = [];
  ieSpeakCore(qs, res, () => { const sc = ieSScore(res); ieCrLog('S', parts.join('+'), sc.C, 'may'); ieSt().s.push({ at: Date.now(), parts: parts.join('+'), band: sc.band }); S.t = Date.now(); save();
    $app.innerHTML = `<h1>🗣 Kết quả bài nói</h1>${ieSHtml(res, sc)}<button class="pri" data-a="again">▶ Nói đề khác</button><button data-a="back">← Học IELTS</button>`; scrollTo(0, 0);
    $app.onclick = e => { if (e.target.closest('[data-a="again"]')) ieSpeak(parts); if (e.target.closest('[data-a="back"]')) ieltsView(); }; }, ieltsView); }

// ---------- 🎓 Đề thử IELTS (khuôn mock.js: đếm giờ, không báo đúng / sai giữa chừng, bài nghe chỉ được nghe 1 lần như đề thật) ----------
const IE_PAPERS = [
  { t: '🎧 Nghe (Listening)', k: 'L', min: 30, gen: () => ieListen() },
  { t: '📖 Đọc (Reading)', k: 'R', min: 60, gen: () => ieSt().type === 'gt'
    ? [...KIT.doc.items.filter(x => ['b1', 'b2'].includes(x.lv)).sort(() => Math.random() - 0.5).slice(0, 2).flatMap(x => kRead(KIT.doc, x, 'ct', false).map(q => ({ part: 'Section 1–2: văn bản đời thường, công việc', q: Object.assign(q, { ty: 'R-gt' }) }))),
      ...iePick(IE.doc, 1).flatMap(x => ieCap(ieRQs(x), 14).map(q => ({ part: 'Section 3: bài dài', q })))]
    : iePick(IE.doc, 3).flatMap((x, i) => ieCap(ieRQs(x), i === 2 ? 14 : 13).map(q => ({ part: `Passage ${i + 1}: ${x.title}`, q }))) },
  { t: '✍️ Viết (Writing)', k: 'W', min: 60, gen: () => { const [t1, its] = ieT1(); return [{ part: IE_TASK[t1][0], q: ieWQ(t1, iePick(its, 1)[0]) }, { part: IE_TASK.t2[0], q: ieWQ('t2', ieWPick('t2')) }]; } },
  { t: '🗣 Nói (Speaking)', k: 'S', min: 14, speak: true, gen: () => ieSpeakQs() }];
async function ieMock(idx) { $app.innerHTML = '<p class="mute">Đang tải kho câu…</p>'; await Promise.all([ieLoad(), kLoad(KIT.nghe), kLoad(KIT.doc)]);
  if (!NCLIPS.size) try { NCLIPS = new Set(await (await fetch('n/index.json?v=' + APP_V)).json()); } catch (e) {}
  const T = ieSt().type; MK = { lv: 'ielts', C: { name: 'IELTS ' + IE_TYPE[T] + ' (kiểu)' }, papers: [], idx, plays: 1, done: ieMockResult, quit: ieltsView,
    speakRun: (pi, finish) => { const P = MK.papers[pi]; ieSpeakCore(P.qs, P.res, finish, () => { clearInterval(MK.tick); ieltsView(); }); } };
  for (const i of idx) { const p = IE_PAPERS[i]; if (p.speak && !SREC) { toast('Bài Nói cần máy chép lời: mở trang bằng Safari trên iPhone.'); continue; }
    MK.papers.push({ t: p.t, k: p.k, min: p.min, speak: p.speak, qs: p.gen().map(it => it.part && it.q ? it : { part: p.t, q: it }), res: [] }); }
  MK.papers = MK.papers.filter(p => p.qs.length); if (!MK.papers.length) return ieltsView();
  if (!confirm(`${MK.C.name}: ${MK.papers.map(p => `${p.t} ${p.speak ? '' : p.qs.length + ' câu, '}${p.min} phút`).join(' · ')}. Bài nghe chỉ phát 1 lần như đề thật. Bắt đầu?`)) return ieltsView();
  mkPaper(0); }
function ieMockResult() { const T = ieSt().type, b = {}, out = [];
  for (const p of MK.papers) {
    if (p.k === 'L' || p.k === 'R') { const ok = p.res.filter(r => r.ok).length; b[p.k] = ieRaw(p.k === 'L' ? IE_L : T === 'gt' ? IE_RG : IE_RA, ok, p.res.length); out.push([p, `${ok}/${p.res.length} câu đúng (quy ra ${Math.round(ok / Math.max(1, p.res.length) * 40)}/40)`]); }
    if (p.k === 'W') { const bs = p.res.map(r => r.ans ? Math.round((r.sc || 0) * 9 * 2) / 2 : 0); b.W = bs.length === 2 ? ieRound((bs[0] + 2 * bs[1]) / 3) : bs[0] || 0; out.push([p, `Task 1: ${bandTxt(bs[0])} · Task 2: ${bandTxt(bs[1])} (Task 2 tính gấp đôi)`]); }
    if (p.k === 'S') { p.sc = ieSScore(p.res); b.S = p.sc.band; out.push([p, '']); } }
  const full = ['L', 'R', 'W', 'S'].every(k => b[k] != null), all = full ? ieRound((b.L + b.R + b.W + b.S) / 4) : null, tg = ieSt().target;
  const tyBy = ieTyLog(MK.papers.filter(p => p.k === 'L' || p.k === 'R').flatMap(p => p.res), 'thi');
  for (const p of MK.papers) { if (p.k === 'W') for (const r of p.res) if (r.ans) ieCrLog('W', r.q.task, ieWScore(r.q.task, r.q.x, r.ans).C, 'may'); if (p.k === 'S' && p.sc) ieCrLog('S', 'mock', p.sc.C, 'may'); }
  ieSt().mock.push({ at: Date.now(), type: T, b, all }); S.t = Date.now(); save();
  const wrong = MK.papers.filter(p => p.k === 'L' || p.k === 'R').flatMap(p => p.res.filter(r => !r.ok));
  const wr = MK.papers.filter(p => p.k === 'W').flatMap(p => p.res.filter(r => r.ans).map(r => `<details class="box"><summary>✍️ ${esc(r.part)}: máy ước ${bandTxt(Math.round(r.sc * 18) / 2)}</summary><p class="tdtap" style="white-space:pre-line;font-size:14px">${esc(r.ans)}</p>${ieWHtml(r.q.task, r.q.x, r.ans, ieWScore(r.q.task, r.q.x, r.ans))}</details>`)).join('');
  const sp = MK.papers.filter(p => p.k === 'S').map(p => `<details class="box"><summary>🗣 Nói: máy ước ${bandTxt(p.sc.band)}</summary>${ieSHtml(p.res, p.sc)}</details>`).join('');
  $app.innerHTML = `<h1>🎓 Kết quả ${esc(MK.C.name)}</h1>
    <div class="box">${out.map(([p, d]) => `<p style="margin:4px 0"><b>${p.t}</b>: band ${bandTxt(b[p.k])}${d ? ` <span class="mute">· ${d}</span>` : ''}</p>`).join('')}
      ${full ? `<p style="margin:8px 0 0;font-size:20px"><b>Overall ≈ ${bandTxt(all)}</b> ${all >= tg ? '✅' : '⬜'} <span class="mute" style="font-size:14px">(mục tiêu ${bandTxt(tg)})</span></p>` : '<p class="mute">Chỉ làm một phần đề: chưa tính Overall.</p>'}
      <p class="mute" style="margin:6px 0 0">Band là ước lượng: Nghe / Đọc quy theo bảng điểm IELTS công bố nhưng đề app ít câu và dễ hơn đề thật; Viết / Nói máy đo gián tiếp, tối đa ${IE_MAXM}.0. Chưa đối chiếu điểm thi thật: đối chiếu bằng đề luyện chính thức (ô 📝 bên Học IELTS).</p></div>
    ${Object.keys(tyBy).length ? `<div class="box"><b>📊 Theo dạng câu (đề này)</b>${Object.entries(tyBy).map(([k, v]) => `<div class="row" style="margin:4px 0"><span>${esc(IE_TY[k] || k)}</span><span class="${v.ok / v.n >= 0.75 ? 'okc' : ''}">${v.ok}/${v.n} · ${Math.round(v.ok / v.n * 100)}%</span></div>`).join('')}
      <p class="mute" style="margin:4px 0 0">Dạng dưới 75% là ứng viên chỗ yếu. Cần ≥ 8 câu ở ≥ 2 bài mới đủ chắc (xem ô 📊 ở Học IELTS).</p></div>` : ''}
    ${wr}${sp}
    ${wrong.length ? `<details class="box"><summary>Xem lại ${wrong.length} câu sai (Nghe / Đọc)</summary>${wrong.map(r => `<div style="margin:8px 0;border-top:1px solid var(--line);padding-top:6px"><p class="mute" style="margin:0">${esc(r.part)}</p><p style="margin:2px 0">${r.q.q}</p>
      <p style="margin:2px 0">Bạn: ${esc(String(r.ans).slice(0, 200))} · Đáp án: <b>${esc(r.q.a != null ? r.q.a : (r.q.acc || [])[0] || '')}</b></p>${r.q.why && typeof r.q.why === 'string' ? `<p class="mute" style="margin:0">${esc(r.q.why)}</p>` : ''}</div>`).join('')}</details>` : ''}
    <button class="pri" data-a="again">🎓 Làm đề mới</button><button data-a="home">← Học IELTS</button>`; scrollTo(0, 0);
  $app.onclick = e => { if (e.target.closest('[data-a="again"]')) ieMock(MK.idx); if (e.target.closest('[data-a="home"]')) ieltsView(); }; }

// ---------- 🎯 Sẵn sàng thi IELTS ----------
const ieDay = t => new Date(t).toDateString();
function ieReady() { const o = ieSt(), tg = o.target, base = ieBase(tg), lvOf = id => ovIn(id, base) ? base : base.replace(/p$/, '');
  const found = ['tv', 'np'].map(id => [id, ovPassed(id, lvOf(id))]), mk = o.mock.filter(r => r.all != null).slice(-2), mOk = mk.length === 2 && mk.every(r => r.all >= tg) && ieDay(mk[0].at) !== ieDay(mk[1].at);
  const ai = [...(S.ai || []).filter(r => r.kind === 'viet' && String(r.lv).startsWith('ielts') && r.band != null), ...o.tw].sort((a, b) => a.at - b.at).slice(-2), wOk = ai.length === 2 && ai.every(r => r.band >= tg - 0.5);
  const lastOf = k => [...o.off].reverse().find(r => r[k] != null), oL = lastOf('L'), oR = lastOf('R'), off = oL || oR ? { L: oL ? oL.L : null, R: oR ? oR.R : null } : null;   // v87: đề thật nhập riêng Nghe / Đọc
  const offOk = !!(oL && oR) && ieRound((off.L + off.R) / 2) >= tg, te = o.teach[o.teach.length - 1], tOk = !!te && te.band >= tg - 0.5;
  return [[found.every(f => f[1]), `🧱 Nền CEFR ${LVN[base]}: Từ vựng và Ngữ pháp qua Thi chuyển cấp`, found.map(([id, ok]) => (ok ? '✅ ' : '⬜ ') + (id === 'tv' ? 'Từ vựng' : 'Ngữ pháp') + ' ' + LVN[lvOf(id)]).join(' · ')],
    [mOk, `🎓 Đề thử IELTS cả đề ≥ ${bandTxt(tg)} hai lần liền, hai ngày khác nhau`, mk.length ? mk.map(r => bandTxt(r.all)).join(', ') : 'chưa làm'],
    [wOk, `✍️ Hai bài Viết gần nhất AI / giáo viên chấm ≥ ${bandTxt(tg - 0.5)}`, ai.length ? ai.map(r => bandTxt(r.band)).join(', ') : 'chưa nhờ AI / giáo viên chấm'],
    [offOk, `📝 Đề luyện chính thức (Nghe + Đọc) ≥ ${bandTxt(tg)}`, off ? `L ${bandTxt(off.L)} · R ${bandTxt(off.R)}` : 'chưa ghi'],
    [tOk, `🗣 Nói thử với giáo viên / người chấm ≥ ${bandTxt(tg - 0.5)}`, te ? bandTxt(te.band) : 'chưa ghi']]; }
const IE_SRC = [['British Council: Take IELTS (đề luyện miễn phí)', 'https://takeielts.britishcouncil.org/'], ['IDP IELTS: chuẩn bị thi', 'https://ielts.idp.com/'], ['IELTS.org: trang chính thức', 'https://ielts.org/']];
const ieAskRaw = msg => { const v = prompt(msg, ''); if (v == null || v === '') return null; const n = parseInt(v, 10); if (!(n >= 0 && n <= 40)) { alert('Số câu 0–40.'); return null; } return n; };
const ieAskBand = (msg, def) => { const v = prompt(msg, def); if (v == null) return null; const b = parseFloat(String(v).replace(',', '.')); if (!(b >= 0 && b <= 9) || b * 2 !== Math.round(b * 2)) { alert('Band 0–9, bước 0,5 (vd. 6.5).'); return null; } return b; };
document.addEventListener('click', e => { const b = e.target.closest('[data-ieadd]'); if (!b || !S) return; const o = ieSt();
  if (b.dataset.ieadd === 'off') { const rl = ieAskRaw('Đề thật (sách Cambridge IELTS / đề luyện chính thức), làm đủ giờ, chấm theo đáp án.\nListening: đúng bao nhiêu câu / 40?'); if (rl == null) return;
    const rr = ieAskRaw(`Reading (${IE_TYPE[o.type]}): đúng bao nhiêu câu / 40?`); if (rr == null) return;
    const L = ieRaw(IE_L, rl, 40), R = ieRaw(o.type === 'gt' ? IE_RG : IE_RA, rr, 40); o.off.push({ at: Date.now(), rl, rr, L, R, type: o.type }); S.t = Date.now(); save();
    alert(`Band theo bảng quy đổi IELTS: Listening ${bandTxt(L)} · Reading ${bandTxt(R)}. App dùng kết quả này để hiệu chỉnh band ước của bạn.`); return ieltsView(); }
  else { const s = ieAskBand('Giáo viên chấm phần Nói band mấy (0–9)?', '6'); if (s == null) return; o.teach.push({ at: Date.now(), band: s }); }
  S.t = Date.now(); save(); toast('Đã ghi.'); ieltsView(); });

// ---------- 📏 Hiệu chuẩn (v69): so band app với nguồn tin được hơn, chỉnh lệch riêng cho từng người ----------
// Nghe / Đọc: đề thật (người học nhập số câu đúng, quy đổi theo bảng IELTS) so với đề thử app gần nhất trong 14 ngày.
// Viết: band AI chấm so với band máy ước của cùng bài. Nói: AI chấm hoặc giáo viên so với band máy ước gần nhất. Lấy trung bình 3 lần so gần nhất.
const IE_CALW = 14 * 864e5;
const ieNear = (list, at, f) => list.filter(r => f(r) != null && Math.abs(r.at - at) <= IE_CALW).sort((a, b) => Math.abs(a.at - at) - Math.abs(b.at - at))[0];
function ieCal() { const o = ieSt(), ai = (S.ai || []).filter(r => String(r.lv).startsWith('ielts') && r.band != null && r.mb != null), out = {};
  const put = (k, ds) => { const d = ds.slice(-3); out[k] = d.length ? { d: d.reduce((s, x) => s + x, 0) / d.length, n: ds.length } : null; };
  for (const k of ['L', 'R']) put(k, o.off.filter(r => r[k] != null).map(r => { const m = ieNear(o.mock, r.at, x => x.b[k]); return m ? r[k] - m.b[k] : null; }).filter(d => d != null));
  put('W', [...ai.filter(r => r.kind === 'viet' && r.mb > 0).map(r => ({ at: r.at, d: r.band - r.mb })), ...o.tw.map(r => { const w = ieNear(o.w.filter(x => x.band > 0), r.at, x => x.band); return w ? { at: r.at, d: r.band - w.band } : null; }).filter(Boolean)]
    .sort((a, b) => a.at - b.at).map(x => x.d));
  put('S', [...ai.filter(r => r.kind === 'noi' && r.mb > 0).map(r => ({ at: r.at, d: r.band - r.mb })), ...o.teach.map(r => { const s = ieNear(o.s.filter(x => x.band > 0), r.at, x => x.band); return s ? { at: r.at, d: r.band - s.band } : null; }).filter(Boolean)]
    .sort((a, b) => a.at - b.at).map(x => x.d));
  return out; }

// ---------- màn chính 🌏 Học IELTS ----------
// band ước hiện tại: đề thử gần nhất; chưa có thì từ luyện (Nghe / Đọc: % đúng các bài gần nhất; Viết / Nói: lần chấm gần nhất)
function ieNow() { const o = ieSt(), last = o.mock[o.mock.length - 1] || { b: {} }, rs = Object.values(o.r).sort((a, b) => b.at - a.at), pct = k => { const a = rs.filter(r => r.k === k).slice(0, 5), n = a.reduce((s, r) => s + r.n, 0); return n >= 10 ? a.reduce((s, r) => s + r.ok, 0) / n : null; };
  const wl = o.w.filter(r => r.task === 't2').pop() || o.w[o.w.length - 1], sl = o.s[o.s.length - 1], pl = pct('l'), pr = pct('r');
  const b = { L: last.b.L ?? (pl != null ? ieRaw(IE_L, pl, 1) : null), R: last.b.R ?? (pr != null ? ieRaw(o.type === 'gt' ? IE_RG : IE_RA, pr, 1) : null), W: last.b.W ?? (wl ? wl.band : null), S: last.b.S ?? (sl ? sl.band : null) };
  // hiệu chỉnh theo độ lệch riêng của người học (ieCal); chưa có lần so nào thì giữ band máy ước
  const cal = ieCal(), raw = { ...b }; for (const k of ['L', 'R', 'W', 'S']) if (b[k] != null && cal[k]) b[k] = Math.max(0, Math.min(9, ieRound(b[k] + cal[k].d)));
  return { b, raw, cal, all: ['L', 'R', 'W', 'S'].every(k => b[k] != null) ? ieRound((b.L + b.R + b.W + b.S) / 4) : null }; }
async function ieltsView() { BACK = null; window.CUR = { view: 'ielts' }; EXAM_VOX = false;
  if (!IE || !KIT.nghe.items || !KIT.doc.items || !KIT.np.items) { $app.innerHTML = '<div id="ie"></div><p class="mute">Đang tải…</p>';
    try { await Promise.all([ieLoad(), kLoad(KIT.nghe), kLoad(KIT.doc), kLoad(KIT.np)]); } catch (e) { $app.innerHTML = '<div id="ie"></div><p>Không tải được dữ liệu IELTS. Thử lại sau.</p>'; return; } }
  const o = ieSt(), tg = o.target, base = ieBase(tg), now = ieNow(), cs = ieReady(), nOk = cs.filter(c => c[0]).length, [t1] = ieT1();
  const sk = (k, ic, n) => `<div class="box" style="margin:0;text-align:center"><div class="mute" style="font-size:13px">${ic} ${n}</div><div style="font-size:22px;font-weight:800">${bandTxt(now.b[k])}</div><div class="mute" style="font-size:11px">${now.cal[k] ? `📏 đã chỉnh (${now.cal[k].n})` : 'chưa chỉnh'}</div></div>`;
  const setup = `<div class="chips">${Object.entries(IE_TYPE).map(([k, n]) => `<button class="chip ${o.type === k ? 'on' : ''}" data-iety="${k}">${n}</button>`).join('')}</div>
    <p style="margin:8px 0 2px">Band mục tiêu:</p><div class="chips">${IE_BANDS.map(b => `<button class="chip ${b === tg ? 'on' : ''}" data-ietg="${b}">${bandTxt(b)}</button>`).join('')}</div>`;
  // v86 hiện dần: lần đầu chỉ hỏi loại thi, band mục tiêu, ngày thi; có dữ liệu luyện rồi thì coi như đã chọn
  if (!o.set && !o.mock.length && !o.w.length && !o.s.length && !Object.keys(o.r).length && !Object.keys(o.ty || {}).length && !(o.cr || []).length) {
    $app.innerHTML = `<div id="ie"></div>${typeof exSwitch === 'function' ? exSwitch('ielts') : ''}<h1>🌏 Học IELTS</h1><div class="box"><b>Bắt đầu: 3 câu hỏi</b>
      <p style="margin:8px 0 2px">1. Bạn thi loại nào?</p>${setup.replace('<p style="margin:8px 0 2px">Band mục tiêu:</p>', '<p style="margin:8px 0 2px">2. Band mục tiêu?</p>')}
      <p style="margin:8px 0 2px">3. Ngày thi (chưa biết thì bỏ trống):</p><input type="date" id="iedate" value="${esc(o.date || '')}">
      <button class="pri" data-ieset style="margin-top:10px">▶ Bắt đầu</button></div>
      <p class="mute">App không phải sản phẩm chính thức của IELTS. 🤖 Nội dung AI soạn, chưa giáo viên kiểm.</p>`;
    $app.onclick = e => { const g = s => e.target.closest(s); let b;
      if ((b = g('[data-iety]'))) { o.type = b.dataset.iety; S.t = Date.now(); save(); return ieltsView(); }
      if ((b = g('[data-ietg]'))) { o.target = +b.dataset.ietg; S.t = Date.now(); save(); return ieltsView(); }
      if (g('[data-ieset]')) { o.set = 1; S.t = Date.now(); save(); scrollTo(0, 0); return ieltsView(); } };
    return; }
  $app.innerHTML = `<div id="ie"></div>${typeof exSwitch === 'function' ? exSwitch('ielts') : ''}<h1>🌏 Học IELTS</h1><p class="mute"><span id="sync">${esc(sync)}</span></p>
    ${typeof iePlanBox === 'function' ? iePlanBox() : ''}
    <details class="box"><summary><b>⚙️ ${IE_TYPE[o.type]} · band mục tiêu ${bandTxt(tg)}</b></summary>${setup}</details>
    ${typeof thBox === 'function' ? thBox() : ''}
    <button data-cnv="ielts">📘 Cẩm nang thi: mẹo Nghe · Nói · Đọc · Viết</button>
    <div class="box"><div class="row"><b>📊 Band ước hiện tại</b><span class="${now.all != null && now.all >= tg ? 'okc' : 'mute'}">${now.all != null ? 'Overall ≈ ' + bandTxt(now.all) : 'chưa đủ 4 kỹ năng'}</span></div>
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:6px;margin-top:8px">${sk('L', '🎧', 'Nghe')}${sk('R', '📖', 'Đọc')}${sk('W', '✍️', 'Viết')}${sk('S', '🗣', 'Nói')}</div>
      <p class="mute" style="margin:6px 0 0">Lấy từ đề thử gần nhất; chưa có thì từ bài luyện. 📏 = đã chỉnh theo độ lệch riêng của bạn (Nghe / Đọc: so đề thật với đề thử app trong 14 ngày; Viết / Nói: so AI chấm, giáo viên với máy). Chưa chỉnh thì chỉ là máy ước. Mỗi tháng làm 1 đề thật (📝 ô Sẵn sàng thi) để band ước sát hơn. Band ${bandTxt(tg)} ≈ CEFR ${LVN[ieCefr(tg)]} (bảng đối chiếu IELTS công bố).</p></div>
    ${typeof imBox === 'function' ? `<details class="box"><summary><b>🗺 Bản đồ band</b> <span class="mute">· chỗ làm mất điểm, theo dạng câu</span></summary>${imBox()}${ieTyBox()}</details>` : ''}
    <div class="box"><b>🧱 Nền cần có: CEFR ${LVN[base]}</b><p class="mute" style="margin:6px 0">Từ vựng và ngữ pháp là gốc của cả 4 kỹ năng. Học ở mục 🎯 Học CEFR; phần này không tính lại ở đây.</p>
      <p style="margin:4px 0">${cs[0][2]}</p><button data-iecefr="${base}">🎯 Mở Học CEFR cấp ${LVN[base]}</button></div>
    <div class="box"><div class="row"><b>🎓 Đề thử IELTS ${IE_TYPE[o.type]}</b><span class="mute">${o.mock.length ? `đã làm ${o.mock.length} lần` : 'chưa làm'}</span></div>
      <p class="mute" style="margin:6px 0">Khuôn như đề thật: Nghe 30 phút (nghe 1 lần) · Đọc 60 phút · Viết 60 phút · Nói 11–14 phút. Câu bốc ngẫu nhiên mỗi lần, không báo đúng / sai giữa chừng.</p>
      ${IE_PAPERS.map((p, i) => `<button data-iemk="${i}">${p.t} · ${p.min} phút</button>`).join('')}<button class="pri" data-iemk="all">▶ Làm cả đề (4 bài liền)</button></div>
    <h2>Luyện từng kỹ năng</h2><p class="mute" style="margin:0 0 6px">Báo đúng / sai ngay, có giải thích. Không tính giờ (trừ Viết, Nói).</p>
    <details class="box"><summary><b>🎧 Nghe (Listening)</b></summary><p class="mute" style="margin:4px 0">${IE.ln ? IE.ln.length + ' phần soạn đúng kiểu IELTS (phiếu, bản đồ, ghép, bài giảng) + ' : ''}bài nghe B1 → C2 của app, giọng tự nhiên. Đề thật có nhiều giọng (Anh, Úc, Mỹ…); app chủ yếu giọng Anh. Luyện chính bằng đề Cambridge rồi 📝 nhập kết quả.</p>
      <div class="duo"><button class="big2" data-iel="form">📝 Điền phiếu<small>Part 1, 4</small></button><button class="big2" data-iel="mc">🔘 Trắc nghiệm<small>Part 2, 3</small></button></div>${typeof ieHow === 'function' ? ieHow(['listen']) : ''}</details>
    <details class="box"><summary><b>📖 Đọc (Reading)</b></summary><p class="mute" style="margin:4px 0">${IE.doc.length} bài đọc học thuật kiểu IELTS (${(() => { const n = IE.doc.map(x => kWords(x.paras.join(' ')).length); return Math.min(...n) + '–' + Math.max(...n); })()} từ; đề thật ~700–900 từ).</p>
      <button data-ier="all">📄 Cả bài: 13–14 câu như đề thật, mọi dạng, tính giờ 20 phút</button><button data-iepara>🔁 Diễn đạt lại: kỹ năng gốc của Đọc / Nghe</button><div class="duo">${Object.entries(IE_RK).map(([k, [ic, n]]) => `<button class="big2" data-ier="${k}">${ic} ${n}</button>`).join('')}</div>${typeof ieHow === 'function' ? ieHow(['tf', 'h', 'comp', 'time']) : ''}</details>
    <details class="box"><summary><b>✍️ Viết (Writing)</b></summary><p class="mute" style="margin:4px 0">Máy chấm 4 tiêu chí IELTS (gián tiếp, tối đa ${IE_MAXM}.0) + nút 🧑‍🏫 AI chấm theo thang band.</p>
      <div class="duo"><button class="big2" data-iew="${t1}">${t1 === 't1' ? '📊 Task 1<small>tả biểu đồ, 150 từ</small>' : '✉️ Task 1<small>viết thư, 150 từ</small>'}</button><button class="big2" data-iew="t2">📝 Task 2<small>bài luận, 250 từ</small></button></div>
      ${o.w.length ? `<p class="mute" style="margin:4px 0 0">Đã viết ${o.w.length} bài · gần nhất máy ước ${bandTxt(o.w[o.w.length - 1].band)}.</p>` : ''}${typeof ieHow === 'function' ? ieHow([t1, 't2']) : ''}</details>
    <details class="box"><summary><b>🗣 Nói (Speaking)</b></summary><p class="mute" style="margin:4px 0">Cần Safari trên iPhone (máy chép lời). Thi thật là nói 1–1 với giám khảo.</p>
      <div class="duo"><button class="big2" data-ies="p1">Part 1<small>4 câu ngắn</small></button><button class="big2" data-ies="p2">Part 2<small>thẻ đề, 2 phút</small></button><button class="big2" data-ies="p3">Part 3<small>bàn luận</small></button><button class="big2" data-ies="all">Cả bài<small>Part 1–3</small></button></div>${typeof ieHow === 'function' ? ieHow(['p13', 'p2']) : ''}</details>
    <details class="box"><summary><b>🎯 Sẵn sàng thi IELTS ${bandTxt(tg)}</b> <span class="${nOk === cs.length ? 'okc' : 'mute'}">${nOk}/${cs.length}</span></summary>
      ${cs.map(([ok, t, d]) => `<p style="margin:4px 0">${ok ? '✅' : '⬜'} ${t} <span class="mute">· ${esc(d)}</span></p>`).join('')}
      <p class="mute" style="margin:6px 0 0">${nOk === cs.length ? 'Đủ bằng chứng: có thể đăng ký thi.' : 'Đủ cả 5 mới nên đăng ký thi. Đề thử của app do AI soạn nên chưa đủ một mình; đề luyện chính thức và giáo viên là hai bằng chứng độc lập.'}</p>
      <div class="chips"><button class="chip" data-ieadd="off">📝 Ghi số câu đúng đề thật (Nghe, Đọc)</button><button class="chip" data-ieadd="teach">🗣 Ghi band Nói với giáo viên</button></div></details>
    <details class="box"><summary><b>📚 Đề luyện chính thức (miễn phí)</b></summary>${IE_SRC.map(([n, u]) => `<p style="margin:4px 0"><a href="${u}" target="_blank" rel="noopener">${esc(n)}</a></p>`).join('')}
      <p class="mute" style="margin:6px 0 0">Làm đề luyện chính thức có giờ, chấm theo đáp án, rồi ghi band vào ô 🎯 ở trên. Sách Cambridge IELTS (bộ đề cũ) cũng dùng tốt.</p></details>
    <p class="mute">App không phải sản phẩm chính thức của IELTS (British Council, IDP, Cambridge). 🤖 Nội dung AI soạn, chưa giáo viên kiểm (thấy câu sai: 💬 → ⚑ Câu sai). Luyện ở đây không tính vào 📘 Học / 🔁 Nhớ / Thi chuyển cấp của 🎯 Học CEFR.</p>
`;
  $app.onclick = e => { const g = s => e.target.closest(s); let b;
    if ((b = g('[data-iety]'))) { o.type = b.dataset.iety; S.t = Date.now(); save(); return ieltsView(); }
    if ((b = g('[data-ietg]'))) { o.target = +b.dataset.ietg; S.t = Date.now(); save(); return ieltsView(); }
    if ((b = g('[data-iecefr]'))) { scrollTo(0, 0); return overview(b.dataset.iecefr); }
    if ((b = g('[data-iemk]'))) return ieMock(b.dataset.iemk === 'all' ? [0, 1, 2, 3] : [+b.dataset.iemk]);
    if ((b = g('[data-iel]'))) { const qs = ieListen(b.dataset.iel === 'form' ? [shuf([0, 3])[0]] : [shuf([1, 2])[0]]).map(it => it.q); scrollTo(0, 0); return qs.length ? ieRun('🎧 Nghe', qs, ieltsView) : toast('Chưa có bài nghe hợp dạng này.'); }
    if ((b = g('[data-ier]'))) { const k = b.dataset.ier, x = iePick(IE.doc, 1)[0]; scrollTo(0, 0); return ieRun('📖 ' + (k === 'all' ? x.title : IE_RK[k][1]), k === 'all' ? ieCap(ieRQs(x), 14) : ieRQs(x, [k]), ieltsView, k === 'all' ? 20 : 0); }
    if ((b = g('[data-iew]'))) { scrollTo(0, 0); return ieWrite(b.dataset.iew); }
    if ((b = g('[data-ies]'))) { scrollTo(0, 0); return ieSpeak(b.dataset.ies === 'all' ? ['p1', 'p2', 'p3'] : b.dataset.ies === 'p3' ? ['p3'] : [b.dataset.ies]); } }; }
ieLoad().catch(() => {});
