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
// Chuyển 45 từ trừu tượng / học thuật sang A2 (người sáng lập 23/10/2026; danh sách content/a2-chuyen-ids.txt), lưu đủ dữ liệu ở content/a2-tu-a1.json.
// Unit còn quá ít từ thì gộp với unit cùng chặng (giữ id unit đầu).
const A2IDS = new Set(fs.readFileSync(new URL('../content/a2-chuyen-ids.txt', import.meta.url), 'utf8').replace(/#.*$/gm, '').split(/\s+/).filter(Boolean));
const moved = [];
for (const u of units) { moved.push(...u.words.filter(w => A2IDS.has(w.id)).map(w => ({ ...w, fromUnit: u.id }))); u.words = u.words.filter(w => !A2IDS.has(w.id)); }
const MERGE = [['a1-u73', 'a1-u76', 'Texts and Subjects', 'Bài đọc và môn học'], ['a1-u86', 'a1-u87', 'Big Ideas and Useful Nouns', 'Ý lớn và danh từ hay dùng']];
for (const [a, b, title, vi] of MERGE) { const ua = units.find(u => u.id === a), ub = units.find(u => u.id === b); if (!ua || !ub) continue;
  ua.words.push(...ub.words); ua.title = title; ua.vi = vi; if (!ua.reading && ub.reading) ua.reading = ub.reading; units.splice(units.indexOf(ub), 1); }
fs.writeFileSync(new URL('../content/a2-tu-a1.json', import.meta.url), JSON.stringify({ note: 'Chuyển từ A1 sang A2, 23/10/2026', words: moved }, null, 0));
fs.writeFileSync(new URL('../a1.json', import.meta.url), JSON.stringify({ units }));
console.log(units.length, 'unit,', units.reduce((s, u) => s + u.words.length, 0), 'từ; thiếu câu ví dụ / chỗ trống:', miss.length, miss.slice(0, 10));
