// Từ B1–C2 để TRA và ĐO cấp (người sáng lập 23/10/2026: "làm đến C2 … để xác định cấp độ từ vựng"). Không phải khoá học: không tính 📘 Học / 🔁 Nhớ / Thi.
// Nguồn: cấp B1–C2 của game + 82 từ chuyển từ A2 sang B1 (content/b1-tu-a2.json). Bỏ từ đã có ở Pre-A1 / A1 / A2 của trang và từ trùng giữa các cấp (giữ cấp thấp hơn).
// Chạy: node tools/extract-ref.mjs ../sonnguyen12394.github.io → ref.json
import fs from 'node:fs';
const src = process.argv[2] || '../sonnguyen12394.github.io', root = new URL('..', import.meta.url).pathname;
const lines = fs.readFileSync(src + '/app.js', 'utf8').split('\n');
const CONTENT = new Function(lines.slice(5, 18).join('\n') + '\nreturn CONTENT;')();
const seen = new Set(['a1.json', 'a2.json'].flatMap(f => JSON.parse(fs.readFileSync(root + f, 'utf8')).units.flatMap(u => u.words.map(w => w.w.toLowerCase()))));
const out = [], pick = (w, d, lv) => { const k = w.w.toLowerCase(); if (seen.has(k) || !w.vi) return; seen.add(k);
  out.push({ id: 'r-' + lv + '-' + w.id, w: w.w, pos: w.pos, ipa: w.ipa, vi: w.vi, ex: d.ex, exVi: d.exVi, lv }); };
const b1extra = JSON.parse(fs.readFileSync(root + 'content/b1-tu-a2.json', 'utf8')).words;
for (const L of ['B1', 'B2', 'C1', 'C2']) {
  const lv = L.toLowerCase(), f = fs.readdirSync(src + '/data').find(x => x.startsWith('lv-' + L + '.')), det = JSON.parse(fs.readFileSync(src + '/data/' + f, 'utf8')).words;
  if (lv === 'b1') for (const w of b1extra) pick(w, w, lv);
  for (const u of CONTENT.levels.find(x => x.id === L).units) for (const w of u.words) pick({ id: w.id, w: w.word, pos: w.pos, ipa: w.ipa, vi: w.vi }, det[w.id] || {}, lv);
}
fs.writeFileSync(root + 'ref.json', JSON.stringify({ words: out }));
const c = l => out.filter(w => w.lv === l).length;
console.log(`ref.json: B1 ${c('b1')} · B2 ${c('b2')} · C1 ${c('c1')} · C2 ${c('c2')} · tổng ${out.length} · thiếu ví dụ ${out.filter(w => !w.ex).length}`);
