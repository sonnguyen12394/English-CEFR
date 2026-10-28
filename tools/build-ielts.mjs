// Dựng ielts.json (mục 🌏 Học IELTS, ielts.js) từ content/ielts/{doc,viet,noi}.json và kiểm lỗi soạn. Chạy: node tools/build-ielts.mjs
// Không sửa tay ielts.json. Kiểm: số tiêu đề = số đoạn, đáp án TRUE / FALSE / NOT GIVEN hợp lệ, đáp án điền ≤ 2 từ và có đúng trong bài,
// trắc nghiệm đủ 3 phương án nhiễu, số liệu biểu đồ khớp số nhãn, bài mẫu Task 1 có nhắc số liệu.
import fs from 'node:fs';
const root = new URL('..', import.meta.url).pathname, rd = f => JSON.parse(fs.readFileSync(root + f, 'utf8'));
const D = rd('content/ielts/doc.json'), V = rd('content/ielts/viet.json'), N = rd('content/ielts/noi.json'), err = [], ids = new Set();
const id = x => { if (ids.has(x.id)) err.push('trùng id ' + x.id); ids.add(x.id); };
const words = s => s.trim().split(/\s+/).length;
for (const x of D.items) { id(x); const txt = x.paras.join(' ').toLowerCase();
  if (x.paras.length < 5 || x.paras.length > 8) err.push(x.id + ': số đoạn ' + x.paras.length);
  if (x.h.length !== x.paras.length) err.push(x.id + ': số tiêu đề ≠ số đoạn');
  if (new Set([...x.h, ...x.hx]).size !== x.h.length + x.hx.length) err.push(x.id + ': tiêu đề trùng');
  for (const q of x.tf) if (!['TRUE', 'FALSE', 'NOT GIVEN'].includes(q.a)) err.push(x.id + ': đáp án T/F/NG sai ' + q.s);
  for (const q of x.comp) { if ((q.s.match(/______/g) || []).length !== 1) err.push(x.id + ': câu điền phải có đúng một chỗ trống: ' + q.s);
    for (const a of q.a) { if (words(a) > 2) err.push(x.id + ': đáp án điền quá 2 từ: ' + a); if (!new RegExp(`\\b${a.toLowerCase()}\\b`).test(txt)) err.push(x.id + ': đáp án không có trong bài: ' + a); } }
  for (const q of x.mc) if (q.w.length !== 3 || q.w.includes(q.a) || new Set(q.w).size !== 3) err.push(x.id + ': trắc nghiệm hỏng: ' + q.q);
  const n = words(x.paras.join(' ')); if (n < 400 || n > 900) err.push(x.id + ': độ dài ' + n + ' từ'); }
for (const x of V.t1) { id(x); if (!['bar', 'line', 'table', 'pie'].includes(x.kind)) err.push(x.id + ': kind ' + x.kind);
  for (const [, v] of x.series) if (v.length !== x.cats.length) err.push(x.id + ': số liệu không khớp nhãn');
  if (x.m) { const nums = new Set(x.series.flatMap(([, v]) => v).map(String)), hit = (x.m.match(/\d+(\.\d+)?/g) || []).filter(d => nums.has(d)).length; if (hit < 4) err.push(x.id + ': bài mẫu ít số liệu'); if (words(x.m) < 150) err.push(x.id + ': bài mẫu < 150 từ'); } }
for (const x of V.gt1) { id(x); if (x.c.length !== 3 || x.k.length !== 3) err.push(x.id + ': cần đúng 3 ý'); if (x.m && words(x.m) < 150) err.push(x.id + ': bài mẫu < 150 từ'); }
for (const x of V.t2) { id(x); if (!['opinion', 'discuss', 'advdis', 'probsol', 'twopart'].includes(x.type)) err.push(x.id + ': type ' + x.type); if (x.m && words(x.m) < 250) err.push(x.id + ': bài mẫu < 250 từ'); }
for (const x of N.p1) { id(x); if (x.qs.length < 3) err.push(x.id + ': ít câu'); }
for (const x of N.p2) { id(x); if (x.b.length !== 4 || x.p3.length < 3) err.push(x.id + ': thẻ Part 2 thiếu gợi ý / câu Part 3'); }
if (err.length) { console.error(err.join('\n')); process.exit(1); }
const out = { _note: 'Dựng bởi tools/build-ielts.mjs từ content/ielts/*.json. Không sửa tay.', doc: D.items, t1: V.t1, gt1: V.gt1, t2: V.t2, p1: N.p1, p2: N.p2 };
fs.writeFileSync(root + 'ielts.json', JSON.stringify(out));
console.log(`ielts.json: ${D.items.length} bài đọc (${D.items.reduce((s, x) => s + x.h.length + x.tf.length + x.comp.length + x.mc.length, 0)} câu), Task 1 ${V.t1.length} + ${V.gt1.length} thư, Task 2 ${V.t2.length}, Nói ${N.p1.length} chủ đề Part 1 + ${N.p2.length} thẻ Part 2`);
