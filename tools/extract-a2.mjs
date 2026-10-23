// Trích từ vựng A2 từ repo game → a2.json (người sáng lập 23/10/2026: "làm kỹ A2 trước").
// - Bỏ từ trùng với A1 của trang (đã lấy làm A1 bổ sung) và dạng -ing trùng động từ đã có (unit "Hoạt động (đuôi -ing)").
// - Chuyển từ trừu tượng / học thuật sang B1 (content/b1-chuyen-tu-a2.txt, lưu ở content/b1-tu-a2.json).
// - Nhận 45 từ chuyển lên từ A1 (content/a2-tu-a1.json).
// - Chia chặng theo chủ đề (THEMES = số unit của game), mỗi chủ đề chia bài 6–10 từ; bài đọc giữ theo unit gốc (reads).
// Chạy: node tools/extract-a2.mjs ../sonnguyen12394.github.io
import fs from 'node:fs';
const src = process.argv[2] || '../sonnguyen12394.github.io', root = new URL('..', import.meta.url).pathname;
const lines = fs.readFileSync(src + '/app.js', 'utf8').split('\n');
const CONTENT = new Function(lines.slice(5, 18).join('\n') + '\nreturn CONTENT;')();
const lv = JSON.parse(fs.readFileSync(src + '/data/' + fs.readdirSync(src + '/data').find(f => /^lv-A2\./.test(f)), 'utf8'));
const A2 = CONTENT.levels.find(L => L.id === 'A2');
const a1 = JSON.parse(fs.readFileSync(root + 'a1.json', 'utf8')).units.flatMap(u => u.words);
const a1w = new Set(a1.map(w => w.w.toLowerCase())), a1id = new Set(a1.map(w => w.id));
const B1 = new Set(fs.readFileSync(root + 'content/b1-chuyen-tu-a2.txt', 'utf8').replace(/#.*$/gm, '').split(/[\s|]+/).filter(Boolean).concat(['according to']));
const toW = (w, d) => ({ id: w.id, w: w.word, pos: w.pos, ipa: w.ipa, pic: w.pic, vi: w.vi, en: d.en, ex: d.ex, exVi: d.exVi, cloze: d.cloze, col: d.col && d.col.ok ? d.col : undefined });
const drop = { trungA1: [], ing: [], b1: [] }, toB1 = [], src2 = {};
const units = A2.units.map(u => ({ no: u.no, vi: u.vi, id: u.id, reading: (lv.units[u.id] || {}).reading,
  words: u.words.map(w => toW(w, lv.words[w.id] || {})).filter(w => { const k = w.w.toLowerCase();
    if (a1w.has(k) || a1id.has(w.id)) { drop.trungA1.push(w.w); return false; }
    if (u.no === 40 && /ing$/.test(k)) { drop.ing.push(w.w); return false; }
    if (B1.has(k)) { drop.b1.push(w.w); toB1.push(w); return false; }
    return true; }) }));
const fromA1 = JSON.parse(fs.readFileSync(root + 'content/a2-tu-a1.json', 'utf8')).words.map(({ fromUnit, ...w }) => w);
units.push({ no: 100, vi: 'Từ chuyển lên từ A1', id: 'a2-tu-a1', words: fromA1 });
const THEMES = [
  ['🛍️', 'Mua sắm, tiền bạc, công việc', [1, 29, 30, 31, 32, 68]], ['🚌', 'Đi lại và du lịch', [2, 18, 19, 20, 74]],
  ['😊', 'Cảm xúc, tính cách, con người', [3, 8, 9, 41, 70, 71, 84]], ['🩺', 'Cơ thể và sức khoẻ', [6, 7, 23, 85]],
  ['🍳', 'Nhà, bếp và đồ ăn', [10, 11, 12, 66, 75, 76, 77, 78, 79, 80]], ['🎉', 'Quần áo, lễ hội, thể thao', [5, 13, 21, 22, 86, 40]],
  ['🌿', 'Thiên nhiên và động vật', [14, 15, 16, 81, 82, 83]], ['🏙️', 'Thị trấn, xã hội, thế giới', [17, 42, 43, 44]],
  ['💬', 'Giao tiếp và suy nghĩ', [25, 26, 27, 28, 47]], ['💻', 'Công nghệ, học tập, truyền thông', [4, 34, 35, 36, 37, 38, 39, 87]],
  ['🏃', 'Hành động và cụm động từ', [24, 33, 64, 65, 67, 73]], ['📏', 'Miêu tả, số lượng, từ nối', [45, 46, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 63, 72]],
  ['🧠', 'Ý tưởng và khái niệm', [59, 60, 61, 62, 69, 100]],
];
const UN = Object.fromEntries(units.map(u => [u.no, u])), used = new Set(), out = [];
const chunk = ws => { const k = Math.ceil(ws.length / 10), r = []; for (let i = 0; i < k; i++) r.push(ws.slice(Math.round(i * ws.length / k), Math.round((i + 1) * ws.length / k))); return r; };
THEMES.forEach(([icon, name, nos], ch) => { nos.forEach(n => used.add(n));
  const ws = nos.flatMap(n => UN[n].words.map(w => ({ w, from: UN[n] })));
  chunk(ws).forEach((part, bi) => { const names = [...new Set(part.map(x => x.from.vi))];
    out.push({ id: `a2-c${ch + 1}-b${bi + 1}`, lv: 'a2', ch, chIcon: icon, chName: name, bi: bi + 1, vi: names.slice(0, 2).join(' · ') + (names.length > 2 ? ' …' : ''), words: part.map(x => x.w) }); }); });
const miss = units.filter(u => !used.has(u.no)).map(u => u.no); if (miss.length) throw new Error('unit chưa xếp chủ đề: ' + miss);
const ids = out.flatMap(u => u.words.map(w => w.id)); if (ids.length !== new Set(ids).size) throw new Error('trùng id');
const reads = units.filter(u => u.reading).map(u => ({ src: u.id, words: u.words.map(w => w.id), title: u.reading.title, tvi: u.reading.tvi, text: u.reading.text, vi: u.reading.vi, qs: u.reading.qs }));
fs.writeFileSync(root + 'a2.json', JSON.stringify({ units: out, reads }));
fs.writeFileSync(root + 'content/b1-tu-a2.json', JSON.stringify({ note: 'Từ A2 của game chuyển sang B1, 23/10/2026', words: toB1 }));
const bad = out.flatMap(u => u.words).filter(w => !w.ex || !w.cloze).map(w => w.id);
console.log(`A2: ${out.length} bài, ${ids.length} từ, ${THEMES.length} chặng · bỏ trùng A1 ${drop.trungA1.length} · bỏ -ing ${drop.ing.length} · sang B1 ${drop.b1.length} · thiếu ví dụ ${bad.length} · bài đọc ${reads.length}`);
