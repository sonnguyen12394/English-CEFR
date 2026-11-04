// Dựng ielts.json (mục 🌏 Học IELTS, ielts.js) từ content/ielts/{doc,viet,noi}.json và kiểm lỗi soạn. Chạy: node tools/build-ielts.mjs
// Không sửa tay ielts.json. Kiểm: số tiêu đề = số đoạn, đáp án TRUE / FALSE / NOT GIVEN hợp lệ, đáp án điền ≤ 2 từ và có đúng trong bài,
// trắc nghiệm đủ 3 phương án nhiễu, số liệu biểu đồ khớp số nhãn, bài mẫu Task 1 có nhắc số liệu.
import fs from 'node:fs';
const root = new URL('..', import.meta.url).pathname, rd = f => JSON.parse(fs.readFileSync(root + f, 'utf8'));
const D = rd('content/ielts/doc.json'), V = rd('content/ielts/viet.json'), N = rd('content/ielts/noi.json'), P = rd('content/ielts/para.json'), L = rd('content/ielts/nghe.json'), err = [], ids = new Set();
const id = x => { if (ids.has(x.id)) err.push('trùng id ' + x.id); ids.add(x.id); };
const words = s => s.trim().split(/\s+/).length;
for (const x of D.items) { id(x); const txt = x.paras.join(' ').toLowerCase(), P = x.paras.length, inTxt = a => new RegExp(`\\b${a.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`).test(txt);
  if (P < 5 || P > 8) err.push(x.id + ': số đoạn ' + P);
  // v132: bảng Đọc (rtab, họ điền tóm tắt / ghi chú / bảng): số ô trống = số đáp án, đáp án ≤ 2 từ có trong bài · chọn HAI (mc2): 2 đáp án + 3 nhiễu, không trùng
  if (x.rtab) { const g = x.rtab.r.flat().join(' ').split('______').length - 1; if (g !== x.rtab.a.length) err.push(x.id + ': số ô trống bảng ≠ số đáp án');
    for (const a of x.rtab.a) { if (words(a[0]) > 2) err.push(x.id + ': đáp án bảng quá 2 từ: ' + a[0]); if (!inTxt(a[0])) err.push(x.id + ': đáp án bảng không có trong bài: ' + a[0]); } }
  for (const q of x.mc2 || []) if (q.a.length !== 2 || q.w.length !== 3 || new Set([...q.a, ...q.w]).size !== 5) err.push(x.id + ': chọn HAI cần 2 đáp án + 3 nhiễu khác nhau: ' + q.q);
  // v123: dạng nào cũng tuỳ chọn (bài mới có 3–5 dạng như đề thật); có tiêu đề thì đủ mỗi đoạn một tiêu đề
  if (x.h) { if (x.h.length !== P) err.push(x.id + ': số tiêu đề ≠ số đoạn'); if (new Set([...x.h, ...x.hx]).size !== x.h.length + x.hx.length) err.push(x.id + ': tiêu đề trùng'); }
  for (const q of x.tf || []) if (!['TRUE', 'FALSE', 'NOT GIVEN'].includes(q.a)) err.push(x.id + ': đáp án T/F/NG sai ' + q.s);
  for (const q of x.comp || []) { if ((q.s.match(/______/g) || []).length !== 1) err.push(x.id + ': câu điền phải có đúng một chỗ trống: ' + q.s);
    for (const a of q.a) { if (words(a) > 2) err.push(x.id + ': đáp án điền quá 2 từ: ' + a); if (!inTxt(a)) err.push(x.id + ': đáp án không có trong bài: ' + a); } }
  for (const q of x.mc || []) if (q.w.length !== 3 || q.w.includes(q.a) || new Set(q.w).size !== 3) err.push(x.id + ': trắc nghiệm hỏng: ' + q.q);
  // v123: 7 dạng còn lại (YES / NO / NOT GIVEN, tìm đoạn, nối đặc điểm, nối nửa câu, tóm tắt, sơ đồ, trả lời ngắn)
  for (const q of x.yn || []) if (!['YES', 'NO', 'NOT GIVEN'].includes(q.a)) err.push(x.id + ': đáp án Y/N/NG sai ' + q.s);
  for (const q of x.mi || []) if (!(q.p >= 0 && q.p < P)) err.push(x.id + ': đoạn sai ' + q.s);
  if (x.mf) { if (x.mf.f.length < 3) err.push(x.id + ': nối đặc điểm cần ≥ 3 tên'); for (const q of x.mf.qs) if (!(q.a >= 0 && q.a < x.mf.f.length)) err.push(x.id + ': tên sai ' + q.s);
    for (const f of x.mf.f) if (!txt.includes(f.toLowerCase().split(' ').pop())) err.push(x.id + ': tên không có trong bài: ' + f); }
  if (x.se) { if (x.se.e.length < x.se.qs.length + 2) err.push(x.id + ': nối nửa câu cần ≥ 2 vế thừa'); const as = x.se.qs.map(q => q.a);
    if (as.some(a => !(a >= 0 && a < x.se.e.length)) || new Set(as).size !== as.length) err.push(x.id + ': vế đáp án sai / trùng'); }
  if (x.sum) { const g = [...x.sum.s.matchAll(/\{(\d+)\}/g)].map(m => +m[1]); if (g.length !== x.sum.a.length || g.some((n, i) => n !== i + 1)) err.push(x.id + ': số chỗ trống tóm tắt ≠ số đáp án');
    for (const a of x.sum.a) { if (x.sum.bank) { if (!x.sum.bank.includes(a[0])) err.push(x.id + ': đáp án không có trong khung từ: ' + a[0]); } else { if (words(a[0]) > 2) err.push(x.id + ': đáp án tóm tắt quá 2 từ: ' + a[0]); if (!inTxt(a[0])) err.push(x.id + ': đáp án tóm tắt không có trong bài: ' + a[0]); } }
    if (x.sum.bank && x.sum.bank.length < x.sum.a.length + 3) err.push(x.id + ': khung từ cần ≥ 3 từ thừa'); }
  if (x.dia) { const gs = x.dia.n.filter(n => n.a); if (gs.length < 3) err.push(x.id + ': sơ đồ cần ≥ 3 ô trống');
    for (const n of gs) { if ((n.s.match(/______/g) || []).length !== 1) err.push(x.id + ': ô sơ đồ cần đúng một chỗ trống: ' + n.s); if (words(n.a[0]) > 2) err.push(x.id + ': đáp án sơ đồ quá 2 từ: ' + n.a[0]); if (!inTxt(n.a[0])) err.push(x.id + ': đáp án sơ đồ không có trong bài: ' + n.a[0]); } }
  for (const q of x.sa || []) { if (words(q.a[0]) > 3) err.push(x.id + ': trả lời ngắn quá 3 từ: ' + q.a[0]); if (!inTxt(q.a[0])) err.push(x.id + ': trả lời ngắn không có trong bài: ' + q.a[0]); }
  const nq = ['h', 'tf', 'comp', 'mc', 'yn', 'mi', 'sa'].reduce((t, k) => t + (x[k] || []).length, 0) + (x.mf ? x.mf.qs.length : 0) + (x.se ? x.se.qs.length : 0) + (x.sum ? x.sum.a.length : 0) + (x.dia ? x.dia.n.filter(n => n.a).length : 0) + (x.rtab ? x.rtab.a.length : 0) + (x.mc2 || []).length * 2;
  // v132 General Training (gt): Section 1 văn bản ngắn đời thường, Section 2 văn bản công việc: chữ ngắn hơn bài học thuật, vẫn 13 câu mỗi Section như đề thật
  if (nq < 13) err.push(x.id + ': cần ≥ 13 câu, có ' + nq); x._nq = nq;
  const n = words(x.paras.join(' ')); if (x.gt ? n < 250 || n > 700 : n < 400 || n > 900) err.push(x.id + ': độ dài ' + n + ' từ'); }
for (const x of V.t1) { id(x); if (!['bar', 'line', 'table', 'pie', 'map', 'process', 'mixed'].includes(x.kind)) err.push(x.id + ': kind ' + x.kind);
  // v132 hai biểu đồ kết hợp (mixed): mỗi phần là biểu đồ cột / đường / bảng / tròn đủ số liệu; bài mẫu dẫn ≥ 4 số của cả hai
  if (x.kind === 'mixed') { if (!x.parts || x.parts.length !== 2 || x.parts.some(c => !['bar', 'line', 'table', 'pie'].includes(c.kind) || c.series.some(([, v]) => v.length !== c.cats.length))) err.push(x.id + ': hai biểu đồ hỏng');
    if (x.m) { const nums = new Set(x.parts.flatMap(c => c.series.flatMap(([, v]) => v)).map(String)), hit = (x.m.match(/\d+(\.\d+)?/g) || []).filter(d => nums.has(d)).length; if (hit < 4) err.push(x.id + ': bài mẫu ít số liệu'); if (words(x.m) < 150) err.push(x.id + ': bài mẫu < 150 từ'); }
    continue; }
  // v87 bản đồ / quy trình: 2 bản đồ, mọi ô nằm trong lưới 10 × 10; quy trình ≥ 5 bước; bài mẫu nhắc ≥ 70% từ khoá
  if (x.kind === 'map' || x.kind === 'process') { if (x.kind === 'map' && (x.maps.length !== 2 || x.maps.some(m => m.items.some(i => i.x < 0 || i.y < 0 || i.x + i.w > 10 || i.y + i.h > 10)))) err.push(x.id + ': bản đồ hỏng');
    if (x.kind === 'process' && x.steps.length < 5) err.push(x.id + ': quy trình ít bước');
    if (x.m) { const low = x.m.toLowerCase(), hit = x.k.filter(k => low.includes(k.toLowerCase())).length; if (hit < Math.ceil(x.k.length * 0.7)) err.push(x.id + ': bài mẫu thiếu từ khoá ' + hit + '/' + x.k.length); if (words(x.m) < 150) err.push(x.id + ': bài mẫu < 150 từ'); }
    continue; }
  for (const [, v] of x.series) if (v.length !== x.cats.length) err.push(x.id + ': số liệu không khớp nhãn');
  if (x.m) { const nums = new Set(x.series.flatMap(([, v]) => v).map(String)), hit = (x.m.match(/\d+(\.\d+)?/g) || []).filter(d => nums.has(d)).length; if (hit < 4) err.push(x.id + ': bài mẫu ít số liệu'); if (words(x.m) < 150) err.push(x.id + ': bài mẫu < 150 từ'); } }
for (const x of V.gt1) { id(x); if (x.c.length !== 3 || x.k.length !== 3) err.push(x.id + ': cần đúng 3 ý'); if (x.m && words(x.m) < 150) err.push(x.id + ': bài mẫu < 150 từ'); }
for (const x of V.t2) { id(x); if (!['opinion', 'discuss', 'advdis', 'probsol', 'twopart'].includes(x.type)) err.push(x.id + ': type ' + x.type); if (x.m && words(x.m) < 250) err.push(x.id + ': bài mẫu < 250 từ'); }
for (const x of N.p1) { id(x); if (x.qs.length < 3) err.push(x.id + ': ít câu'); }
for (const x of N.p2) { id(x); if (x.b.length !== 4 || x.p3.length < 3) err.push(x.id + ': thẻ Part 2 thiếu gợi ý / câu Part 3'); }
// v87 luyện diễn đạt lại: đúng 3 câu bẫy, không trùng đáp án, có cặp từ thay thế
for (const x of P.items) { id(x); if (x.w.length !== 3 || x.w.includes(x.a) || new Set(x.w).size !== 3) err.push(x.id + ': cần 3 câu bẫy khác đáp án'); if (!x.p.length || !x.why) err.push(x.id + ': thiếu cặp từ / giải thích'); }
// v87 nghe kiểu IELTS: đúng 10 câu; đáp án điền có nguyên văn trong lời nghe; trắc nghiệm 3 bẫy; bản đồ: chữ có trên bản đồ; ghép: đáp án nằm trong danh sách
// v132: chọn HAI (mc2) tính 2 câu; lưu đồ (flow): ô có đúng một chỗ trống, đáp án có trong lời nghe
for (const x of L.items) { id(x); const tr = (x.text || x.lines.map(l => l[1]).join(' ')).toLowerCase(), nq = x.qs.reduce((t, q) => t + (q.k === 'mc2' ? 2 : 1), 0); if (nq !== 10) err.push(x.id + ': cần 10 câu, có ' + nq);
  for (const q of x.qs) { if (['form', 'tab', 'sent', 'sa'].includes(q.k) && !q.a.some(a => tr.includes(a.toLowerCase()))) err.push(x.id + ': đáp án không có trong lời nghe: ' + q.a[0]);
    if (q.k === 'tab' && (!x.tab || !(q.i >= 0) || q.i >= x.tab.r.flat().join(' ').split('______').length - 1)) err.push(x.id + ': ô trống bảng hỏng');
    if (q.k === 'sent' && (q.s.match(/______/g) || []).length !== 1) err.push(x.id + ': câu điền cần đúng một chỗ trống: ' + q.s);
    if (q.k === 'form' && (q.s.match(/______/g) || []).length !== 1) err.push(x.id + ': câu điền cần đúng một chỗ trống: ' + q.s);
    if (q.k === 'mc' && (q.w.length !== 3 || q.w.includes(q.a))) err.push(x.id + ': trắc nghiệm hỏng: ' + q.q);
    if (q.k === 'map' && !x.map.items.some(i => i.t === q.a)) err.push(x.id + ': chữ bản đồ không có: ' + q.a);
    if (q.k === 'match' && !x.opts.includes(q.a)) err.push(x.id + ': đáp án ghép không có trong danh sách: ' + q.a);
    if (q.k === 'mc2' && (q.a.length !== 2 || q.w.length !== 3 || new Set([...q.a, ...q.w]).size !== 5)) err.push(x.id + ': chọn HAI hỏng: ' + q.q);
    if (q.k === 'flow') { const nd = x.flow && x.flow.n[q.i]; if (!nd || (nd.s.match(/______/g) || []).length !== 1 || JSON.stringify(nd.a) !== JSON.stringify(q.a)) err.push(x.id + ': ô lưu đồ hỏng ' + q.i);
      if (!q.a.some(a => tr.includes(a.toLowerCase()))) err.push(x.id + ': đáp án lưu đồ không có trong lời nghe: ' + q.a[0]); } } }
if (err.length) { console.error(err.join('\n')); process.exit(1); }
const NQ = D.items.reduce((t, x) => t + x._nq, 0), NL = L.items.reduce((t, x) => t + x.qs.reduce((u, q) => u + (q.k === 'mc2' ? 2 : 1), 0), 0);
for (const x of D.items) delete x._nq;
const out = { _note: 'Dựng bởi tools/build-ielts.mjs từ content/ielts/*.json. Không sửa tay.', doc: D.items, t1: V.t1, gt1: V.gt1, t2: V.t2, p1: N.p1, p2: N.p2, para: P.items, ln: L.items };
fs.writeFileSync(root + 'ielts.json', JSON.stringify(out));
console.log(`ielts.json: ${D.items.length} bài đọc (${NQ} câu), Task 1 ${V.t1.length} + ${V.gt1.length} thư, Task 2 ${V.t2.length}, Nói ${N.p1.length} chủ đề Part 1 + ${N.p2.length} thẻ Part 2, diễn đạt lại ${P.items.length} câu, nghe ${L.items.length} phần (${NL} câu)`);
