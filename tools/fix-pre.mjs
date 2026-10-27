// Áp content/pre-fix.json (Pre-A1, so với Cambridge Starters) và content/a1-fix.json (A1, so với A1 Movers) vào a1.json + exam-a1.json:
// sửa hình, sửa / bỏ từ, thêm chặng "Bổ sung …" cuối cấp. Chạy lại được nhiều lần.
// Chạy: node tools/fix-pre.mjs (sau mỗi lần tools/build-levels.mjs hoặc tools/build-exam.mjs, vì hai công cụ đó ghi đè a1.json / exam-a1.json).
import fs from 'node:fs';
const root = new URL('..', import.meta.url).pathname;
const A = JSON.parse(fs.readFileSync(root + 'a1.json', 'utf8')), A2 = JSON.parse(fs.readFileSync(root + 'a2.json', 'utf8')), E = JSON.parse(fs.readFileSync(root + 'exam-a1.json', 'utf8'));
// từ chuyển từ A2 xuống (Cambridge Starters / Movers thắng Oxford ở Pre-A1, A1: docs/HOAN-THIEN.md, quyết định Q1); chạy lại: lấy từ các bài đã chuyển trước đó
const moved = new Map();
for (const f of ['pre-fix.json', 'a1-fix.json']) {
  const F = JSON.parse(fs.readFileSync(root + 'content/' + f, 'utf8')), lv = F.lv || 'pre', chName = F.chName || 'Bổ sung Starters';
  const newIds = new Set(F.units.map(u => u.id)), drop = new Set(F.drop || []);
  const mvIds = u => u.id.startsWith(lv + '-mv');
  for (const u of A.units) if (newIds.has(u.id) || mvIds(u)) for (const w of u.words) moved.set(w.w.toLowerCase(), w);
  A.units = A.units.filter(u => !newIds.has(u.id) && !mvIds(u));
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
  // chuyển từ A2 xuống: bỏ khỏi a2.json, gom thành bài 10 từ cuối cấp
  const mv = []; for (const x of F.move || []) { let w = moved.get(x); if (!w || F.units.some(u => u.words.some(y => y.id === w.id))) { w = null;
      for (const u of A2.units) { const i = u.words.findIndex(y => y.w.toLowerCase() === x); if (i >= 0) { w = u.words.splice(i, 1)[0]; break; } } }
    if (w && !has.has(x)) mv.push(w); }
  A2.units = A2.units.filter(u => u.words.length);
  for (let i = 0; i * 10 < mv.length; i++) add.push({ id: `${lv}-mv${i + 1}`, lv, ch, chIcon: '⭐', chName, bi: add.length + 1, vi: `${chName} ${add.length + 1}: từ cơ bản (chuyển từ A2)`, words: mv.slice(i * 10, i * 10 + 10) });
  A.units.splice(at, 0, ...add);
  console.log(`${f}: hình ${pic} · sửa từ ${fix} · bỏ ${drop.size} · chuyển xuống ${mv.length} · thêm tổng ${add.reduce((n, u) => n + u.words.length, 0)} từ trong ${add.length} bài ${lv}`);
}
// câu thi Pre-A1 viết lại đúng cấp (X4)
for (const [id, v] of Object.entries(JSON.parse(fs.readFileSync(root + 'content/exam-pre-fix.json', 'utf8')))) if (id[0] !== '_') E[id] = { s: v[0], f: v[1] };
function wLvOf(w) { return (A.units.find(u => u.words.includes(w)) || {}).lv; }
// Ngữ pháp: chuyển so sánh hơn / nhất, have to, must từ A2 lên A1 (có trong đề A1 Movers; quyết định Q3, docs/HOAN-THIEN.md)
const NP = JSON.parse(fs.readFileSync(root + 'np.json', 'utf8')), NP_A1 = ['So sánh hơn của tính từ', 'So sánh nhất của tính từ', 'Have to / don\'t have to', 'Must / mustn\'t'];
const mvNp = NP.items.filter(x => NP_A1.includes(x.title) && x.lv !== 'a1'); for (const x of mvNp) { x.lv = 'a1'; NP.items.splice(NP.items.indexOf(x), 1); }
NP.items.splice(NP.items.map(x => x.lv).lastIndexOf('a1') + 1, 0, ...mvNp); fs.writeFileSync(root + 'np.json', JSON.stringify(NP));
console.log('ngữ pháp chuyển lên A1:', mvNp.length);
fs.writeFileSync(root + 'a1.json', JSON.stringify(A)); fs.writeFileSync(root + 'a2.json', JSON.stringify(A2)); fs.writeFileSync(root + 'exam-a1.json', JSON.stringify(E));
