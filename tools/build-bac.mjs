// v101 cách học theo bậc: đưa nội dung Claude soạn vào dữ liệu app (chạy lại được, không trùng). Chạy: node tools/build-bac.mjs
//   ✍️ Viết bậc 2 · Nối câu: content/viet-noi.json → viet.json (khoá "noi"; build-b.mjs giữ khoá này)
//   🗣 Nói Pre-A1: content/noi-pre.json → noi.json (mục lv "pre" + câu đọc to thi test.pre). Đổi câu thì chạy lại tools/build-audio.py để dựng giọng.
import fs from 'node:fs';
const root = new URL('..', import.meta.url).pathname, J = f => JSON.parse(fs.readFileSync(root + f, 'utf8')), W = (f, d) => fs.writeFileSync(root + f, JSON.stringify(d));
const src = J('content/viet-noi.json'), V = J('viet.json'), noi = {};
for (const [lv, L] of Object.entries(src)) { if (lv === '_note') continue;
  for (const it of L) if (it.length < 4 || !it.every(a => typeof a === 'string' && a.trim())) throw new Error('câu nối hỏng: ' + JSON.stringify(it));
  noi[lv] = L; }
V.noi = noi; W('viet.json', V);
const P = J('content/noi-pre.json'), N = J('noi.json');
for (const x of P.items) for (const f of ['id', 'en', 'vi', 'p', 'pv', 'c', 'u', 'm', 'k']) if (!x[f]) throw new Error('đề nói thiếu ' + f + ': ' + x.id);
N.items = [...P.items.map(x => ({ ...x, lv: 'pre' })), ...N.items.filter(x => x.lv !== 'pre')]; N.test.pre = P.test; W('noi.json', N);
console.log('viet.json: nối câu', Object.entries(noi).map(([l, L]) => l + ' ' + L.length).join(' · '), '| noi.json: Pre-A1', P.items.length, 'đề,', P.test.length, 'câu đọc to thi');
