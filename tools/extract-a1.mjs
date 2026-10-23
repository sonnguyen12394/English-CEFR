// Trích 87 unit / 870 từ A1 từ repo game (sonnguyen12394.github.io) ra a1.json.
// Chạy: node tools/extract-a1.mjs ../sonnguyen12394.github.io
import fs from 'node:fs';
const src = process.argv[2] || '../sonnguyen12394.github.io';
const lines = fs.readFileSync(src + '/app.js', 'utf8').split('\n');
const CONTENT = new Function(lines.slice(5, 18).join('\n') + '\nreturn CONTENT;')();
const lvFile = fs.readdirSync(src + '/data').find(f => /^lv-A1\./.test(f));
const lv = JSON.parse(fs.readFileSync(src + '/data/' + lvFile, 'utf8'));
const A1 = CONTENT.levels.find(L => L.id === 'A1');
const units = A1.units.map(u => ({
  id: u.id, no: u.no, title: u.title, vi: u.vi,
  reading: (r => r ? { title: r.title, tvi: r.tvi, text: r.text, vi: r.vi, qs: r.qs } : undefined)((lv.units[u.id] || {}).reading),
  words: u.words.map(w => { const d = lv.words[w.id] || {};
    return { id: w.id, w: w.word, pos: w.pos, ipa: w.ipa, pic: w.pic, vi: w.vi, en: d.en, ex: d.ex, exVi: d.exVi, cloze: d.cloze, col: d.col && d.col.ok ? d.col : undefined }; }),
}));
const n = units.reduce((s, u) => s + u.words.length, 0), miss = units.flatMap(u => u.words).filter(w => !w.ex || !w.cloze).map(w => w.id);
// A1 bổ sung (23/10/2026, docs/DOI-CHIEU-CAMBRIDGE.md): 93 từ thông dụng có trong Cambridge Starters / Movers mà 870 từ chưa có; 63 từ lấy từ cấp A2 / B1 của game, 30 từ tự soạn (content/a1-bosung-soan.json)
const sup = JSON.parse(fs.readFileSync(new URL('../content/a1-bosung.json', import.meta.url), 'utf8')).units;
units.push(...sup);
fs.writeFileSync(new URL('../a1.json', import.meta.url), JSON.stringify({ units }));
console.log(units.length, 'unit,', units.reduce((s, u) => s + u.words.length, 0), 'từ; thiếu câu ví dụ / chỗ trống:', miss.length, miss.slice(0, 10));
