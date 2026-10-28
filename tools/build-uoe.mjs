// 🧩 Dựng uoe.json (dạng đề thật B1 → C2: bài dài, điền từ cả đoạn, tạo dạng từ, viết lại câu từ khoá, tóm tắt 2 đoạn C2) từ content/bs/uoe-*.json, kiểm tính hợp lệ.
// Chạy: node tools/build-uoe.mjs   (thoát mã 1 nếu dữ liệu sai)
import fs from 'node:fs';
const root = new URL('../', import.meta.url).pathname, out = { long: [], mc: [], open: [], wf: [], kwt: [], sum: [] }, bad = [];
const LIM = { b1: [2, 5, 300], b2: [2, 5, 500], c1: [3, 6, 600], c2: [3, 8, 700] };   // KWT ít / nhiều từ nhất; bài dài tối thiểu số từ
const words = s => (s.match(/[A-Za-z][A-Za-z'-]*/g) || []).length;
for (const lv of ['b1', 'b2', 'c1', 'c2']) { const D = JSON.parse(fs.readFileSync(root + `content/bs/uoe-${lv}.json`, 'utf8'));
  for (const k of Object.keys(out)) for (const x of D[k] || []) { if (x.lv !== lv) bad.push(x.id + ': sai cấp'); out[k].push(x);
    if (k === 'long') { if (words(x.text) < LIM[lv][2] * (x.pm ? 0.8 : 1)) bad.push(x.id + ': bài ngắn ' + words(x.text) + ' từ');
      for (const q of x.qs || []) if (new Set([q.a, ...q.w]).size !== 4) bad.push(x.id + ': cần 4 phương án khác nhau: ' + q.q);
      if (x.pm) { const n = x.text.split('\n').filter(l => /^[A-F]  /.test(l)).length; if (n !== x.secs.length) bad.push(x.id + ': số đoạn ' + n + ' ≠ ' + x.secs.length);
        for (const q of x.pm) if (!(q.p >= 0 && q.p < x.secs.length)) bad.push(x.id + ': p sai'); } }
    if (['mc', 'open', 'wf'].includes(k)) { const g = [...x.text.matchAll(/\{(\d+)\}/g)].map(m => +m[1]);
      if (g.length !== x.gaps.length || g.some((n, i) => n !== i + 1)) bad.push(x.id + ': số chỗ trống ' + g.length + ' ≠ ' + x.gaps.length);
      for (const y of x.gaps) { if (k === 'mc' && new Set([y.a, ...y.w]).size !== 4) bad.push(x.id + ': cần 4 phương án: ' + y.a);
        if (k !== 'mc' && (!Array.isArray(y.a) || !y.a.length || y.a.some(a => /\s/.test(a)))) bad.push(x.id + ': đáp án phải là 1 từ: ' + y.a);
        if (k === 'wf' && !y.stem) bad.push(x.id + ': thiếu từ gốc'); } }
    if (k === 'sum') { const n = words(x.m.join(' ')); if (n < x.min || n > x.max) bad.push(x.id + ': bài mẫu ' + n + ' từ'); if (x.texts.length !== 2 || x.k.length !== x.c.length) bad.push(x.id + ': cần 2 đoạn, ý = từ khoá'); }
    if (k === 'kwt') { if (!x.s2.includes('____')) bad.push(x.id + ': thiếu ____');
      for (const a of x.a) { const n = a.split(/\s+/).length, key = x.key.toLowerCase();
        if (!a.toLowerCase().split(/\s+/).includes(key) && !a.toLowerCase().includes(key)) bad.push(x.id + ': đáp án thiếu từ khoá: ' + a);
        if (n < LIM[lv][0] || n > LIM[lv][1]) bad.push(x.id + `: đáp án ${n} từ (cần ${LIM[lv][0]}–${LIM[lv][1]}): ` + a); } } } }
const ids = Object.values(out).flat().map(x => x.id), dup = ids.filter((x, i) => ids.indexOf(x) !== i); if (dup.length) bad.push('trùng id: ' + dup);
if (bad.length) { console.log(bad.join('\n')); process.exit(1); }
fs.writeFileSync(root + 'uoe.json', JSON.stringify({ _note: 'Dựng từ content/bs/uoe-*.json bằng tools/build-uoe.mjs. Claude soạn, chưa người thật kiểm.', ...out }));
console.log(Object.entries(out).map(([k, v]) => k + ' ' + v.length).join(' · '), '· bài dài:', out.long.map(x => x.id + ' ' + words(x.text)).join(', '));
