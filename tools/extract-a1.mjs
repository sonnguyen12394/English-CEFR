// Trích từ vựng A1 từ repo game (sonnguyen12394.github.io) + A1 bổ sung, phân cấp Pre-A1 / A1, ghi a1.json.
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
// Phân cấp lại (người sáng lập 23/10/2026: "2 cấp, 2 cổng"): Pre-A1 → A1. Từ có trong Cambridge Pre A1 Starters (content/cambridge-yle.json,
// tách từ PDF chính thức) hoặc là số đếm 1–100 → Pre-A1; còn lại → A1. Trong mỗi chủ đề (THEMES, giữ thứ tự cũ), từ mỗi cấp chia thành bài 5–10 từ.
// Bài đọc giữ theo unit gốc, kèm danh sách từ (reads), vì bài mới trộn từ nhiều unit gốc.
const YLE = JSON.parse(fs.readFileSync(new URL('../content/cambridge-yle.json', import.meta.url), 'utf8'));
const ST = new Set(YLE.starters), NUM = new Set('one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen nineteen twenty thirty forty fifty sixty seventy eighty ninety hundred'.split(' '));
const levelOf = w => { const x = w.w.toLowerCase(); return ST.has(x) || (x.endsWith('s') && ST.has(x.slice(0, -1))) || NUM.has(x) ? 'pre' : 'a1'; };
const R = (a, b) => Array.from({ length: b - a + 1 }, (_, i) => 'a1-u' + (a + i));
const THEMES = [
  ['🏠', 'Cuộc sống hằng ngày', [...R(1, 10), 'a1b-u3']], ['⏰', 'Thời gian và con số', R(11, 18)],
  ['🙋', 'Người, vật và câu hỏi', [...R(19, 25), 'a1b-u9']], ['👋', 'Vị trí, tần suất, chào hỏi', [...R(26, 32), 'a1b-u8']],
  ['👨‍👩‍👧', 'Con người, cơ thể, đồ ăn', [...R(33, 41), 'a1b-u5', 'a1b-u6']], ['🎨', 'Màu sắc, cảm xúc, miêu tả', [...R(42, 50), 'a1b-u1', 'a1b-u2']],
  ['🏃', 'Hành động hằng ngày', [...R(51, 58), 'a1b-u7']], ['🏙️', 'Nhà cửa, mua sắm, phố xá', [...R(59, 63), 'a1b-u10']],
  ['🌏', 'Thế giới, thiên nhiên, đi lại', [...R(64, 70), 'a1b-u4']], ['📚', 'Học tập và công việc', R(71, 78)],
  ['🎵', 'Giải trí và công nghệ', [...R(79, 86), 'a1b-u11']],
];
const UB = Object.fromEntries(units.map(u => [u.id, u])), placed = new Set(), out = [];
const reads = units.filter(u => u.reading).map(u => ({ src: u.id, words: u.words.map(w => w.id), ...u.reading }));
const chunk = ws => { const k = Math.ceil(ws.length / 10), out = []; for (let i = 0; i < k; i++) out.push(ws.slice(Math.round(i * ws.length / k), Math.round((i + 1) * ws.length / k))); return out; };
for (const lvl of ['pre', 'a1']) {
  let ch = 0;
  for (const [icon, name, ids] of THEMES) {
    const ws = ids.flatMap(id => (UB[id] ? UB[id].words.map(w => ({ w, from: UB[id] })) : [])).filter(x => levelOf(x.w) === lvl);
    if (!ws.length) continue;
    chunk(ws).forEach((part, bi) => { const names = [...new Set(part.map(x => x.from.vi))];
      out.push({ id: `${lvl}-c${ch + 1}-b${bi + 1}`, lv: lvl, ch, chIcon: icon, chName: name, bi: bi + 1, vi: names.slice(0, 2).join(' · ') + (names.length > 2 ? ' …' : ''), words: part.map(x => (placed.add(x.w.id), x.w)) }); });
    ch++;
  }
}
const lost = units.flatMap(u => u.words).filter(w => !placed.has(w.id)).map(w => w.id);
if (lost.length) throw new Error('Từ chưa xếp vào chủ đề nào: ' + lost.join(', '));
fs.writeFileSync(new URL('../a1.json', import.meta.url), JSON.stringify({ units: out, reads }));
const cnt = l => out.filter(u => u.lv === l);
console.log(`Pre-A1: ${cnt('pre').length} bài, ${cnt('pre').reduce((s, u) => s + u.words.length, 0)} từ, ${new Set(cnt('pre').map(u => u.ch)).size} chặng · A1: ${cnt('a1').length} bài, ${cnt('a1').reduce((s, u) => s + u.words.length, 0)} từ, ${new Set(cnt('a1').map(u => u.ch)).size} chặng · bài đọc ${reads.length} · thiếu ví dụ ${miss.length}`);
