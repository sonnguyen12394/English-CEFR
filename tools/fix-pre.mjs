// Áp content/pre-fix.json (Pre-A1, so với Cambridge Starters) và content/a1-fix.json (A1, so với A1 Movers) vào a1.json + exam-a1.json:
// sửa hình, sửa / bỏ từ, thêm chặng "Bổ sung …" cuối cấp. Chạy lại được nhiều lần.
// Chạy: node tools/fix-pre.mjs (sau mỗi lần tools/build-levels.mjs hoặc tools/build-exam.mjs, vì hai công cụ đó ghi đè a1.json / exam-a1.json).
import fs from 'node:fs';
const root = new URL('..', import.meta.url).pathname;
const A = JSON.parse(fs.readFileSync(root + 'a1.json', 'utf8')), E = JSON.parse(fs.readFileSync(root + 'exam-a1.json', 'utf8'));
for (const f of ['pre-fix.json', 'a1-fix.json']) {
  const F = JSON.parse(fs.readFileSync(root + 'content/' + f, 'utf8')), lv = F.lv || 'pre', chName = F.chName || 'Bổ sung Starters';
  const newIds = new Set(F.units.map(u => u.id)), drop = new Set(F.drop || []);
  A.units = A.units.filter(u => !newIds.has(u.id));
  for (const u of A.units) if (u.lv === lv) u.words = u.words.filter(w => !drop.has(w.id));
  A.units = A.units.filter(u => u.words.length);
  const all = A.units.flatMap(u => u.words), has = new Set(all.map(w => w.w.toLowerCase()));
  let pic = 0, fix = 0;
  for (const w of all) { const k = w.w.toLowerCase();
    if (wLvOf(w) === lv && k in F.pic) { w.pic = F.pic[k]; pic++; }
    const o = (F.word || {})[w.id]; if (o) { const { exam, ...rest } = o; Object.assign(w, rest); if (exam) E[w.id] = exam; fix++; } }
  const L = A.units.filter(u => u.lv === lv), ch = Math.max(...L.map(u => u.ch)) + 1, at = A.units.indexOf(L[L.length - 1]) + 1;
  const add = F.units.map((u, i) => ({ id: u.id, lv, ch, chIcon: '⭐', chName, bi: i + 1, vi: u.vi,
    words: u.words.filter(w => !has.has(w.w.toLowerCase())).map(({ exam, ...w }) => { if (exam) E[w.id] = exam; return w; }) }));
  A.units.splice(at, 0, ...add);
  console.log(`${f}: hình ${pic} · sửa từ ${fix} · bỏ ${drop.size} · thêm ${add.reduce((n, u) => n + u.words.length, 0)} từ trong ${add.length} bài ${lv}`);
}
function wLvOf(w) { return (A.units.find(u => u.words.includes(w)) || {}).lv; }
fs.writeFileSync(root + 'a1.json', JSON.stringify(A)); fs.writeFileSync(root + 'exam-a1.json', JSON.stringify(E));
