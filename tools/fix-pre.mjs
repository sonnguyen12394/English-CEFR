// Áp content/pre-fix.json vào a1.json + exam-a1.json (sửa hình, sửa nghĩa từ, thêm bài "Bổ sung Starters" cho Pre-A1). Chạy lại được nhiều lần.
// Chạy: node tools/fix-pre.mjs (sau mỗi lần tools/build-levels.mjs hoặc tools/build-exam.mjs, vì hai công cụ đó ghi đè a1.json / exam-a1.json).
import fs from 'node:fs';
const root = new URL('..', import.meta.url).pathname, F = JSON.parse(fs.readFileSync(root + 'content/pre-fix.json', 'utf8'));
const A = JSON.parse(fs.readFileSync(root + 'a1.json', 'utf8')), E = JSON.parse(fs.readFileSync(root + 'exam-a1.json', 'utf8'));
const newIds = new Set(F.units.map(u => u.id));
A.units = A.units.filter(u => !newIds.has(u.id));
const all = A.units.flatMap(u => u.words), has = new Set(all.map(w => w.w.toLowerCase()));
let pic = 0, fix = 0;
for (const w of all) { const k = w.w.toLowerCase();
  if (k in F.pic) { w.pic = F.pic[k]; pic++; }
  const o = F.word[w.id]; if (o) { const { exam, ...rest } = o; Object.assign(w, rest); if (exam) E[w.id] = exam; fix++; } }
const pre = A.units.filter(u => u.lv === 'pre'), ch = Math.max(...pre.map(u => u.ch)) + 1, at = A.units.indexOf(pre[pre.length - 1]) + 1;
const add = F.units.map((u, i) => ({ id: u.id, lv: 'pre', ch, chIcon: '⭐', chName: 'Bổ sung Starters', bi: i + 1, vi: u.vi,
  words: u.words.filter(w => !has.has(w.w.toLowerCase())).map(({ exam, ...w }) => { if (exam) E[w.id] = exam; return w; }) }));
A.units.splice(at, 0, ...add);
fs.writeFileSync(root + 'a1.json', JSON.stringify(A)); fs.writeFileSync(root + 'exam-a1.json', JSON.stringify(E));
console.log(`hình ${pic} · sửa từ ${fix} · thêm ${add.reduce((n, u) => n + u.words.length, 0)} từ trong ${add.length} bài Pre-A1`);
