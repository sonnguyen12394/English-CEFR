// Dựng pa.json cho phần 👄 Phát âm: 26 bộ cặp âm (SOUNDS) chép từ game English Ladder (app.js), thêm cấp.
// Chia cấp (đề xuất 25/10/2026, chưa chốt; vai giáo viên phát âm cho người Việt): Pre-A1 = 8 lỗi làm người nghe hiểu sai nhiều nhất
// (dài – ngắn /iː ɪ/, /æ e/, th, /ʃ s/, âm cuối t – d, s – z, nuốt âm cuối, l – n); A1, A2 = phần còn lại theo độ hay gặp ở từ của cấp.
// Mỗi bộ: các cặp đầu để học / luyện, 2 cặp cuối giữ cho Thi chuyển cấp (câu chưa gặp).
// Chạy: node tools/build-pa.mjs <đường dẫn app.js của game>
import fs from 'node:fs';
const src = fs.readFileSync(process.argv[2] || '../sonnguyen12394.github.io/app.js', 'utf8');
const i = src.indexOf('const SOUNDS = ['), j = src.indexOf('];', i);
const SOUNDS = Function('return ' + src.slice(i + 'const SOUNDS = '.length, j + 1))();
const LV = { pre: ['s-01', 's-02', 's-05', 's-07', 's-10', 's-11', 's-12', 's-13'],
  a1: ['s-04', 's-06', 's-09', 's-14', 's-15', 's-16', 's-19', 's-20', 's-21'],
  a2: ['s-03', 's-08', 's-17', 's-18', 's-22', 's-23', 's-24', 's-25', 's-26'] };
const lvOf = id => Object.keys(LV).find(l => LV[l].includes(id));
const out = SOUNDS.map(s => ({ id: s.id, lv: lvOf(s.id), a: s.a, b: s.b, title: s.title, vi: s.vi, tip: s.tip,
  pairs: s.pairs.slice(0, -2), test: s.pairs.slice(-2) }));
for (const s of out) { if (!s.lv) throw new Error('chưa có cấp: ' + s.id); if (s.pairs.length < 3) throw new Error('ít cặp: ' + s.id); }
out.sort((a, b) => Object.keys(LV).indexOf(a.lv) - Object.keys(LV).indexOf(b.lv) || LV[a.lv].indexOf(a.id) - LV[b.lv].indexOf(b.id));
fs.writeFileSync('pa.json', JSON.stringify({ sets: out }));
console.log(Object.keys(LV).map(l => `${l}: ${out.filter(s => s.lv === l).length} bộ`).join(' · '), '·', out.reduce((n, s) => n + s.pairs.length + s.test.length, 0), 'cặp');
