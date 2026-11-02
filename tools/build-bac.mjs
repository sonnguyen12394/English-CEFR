// v101 cách học theo bậc: đưa nội dung Claude soạn vào dữ liệu app (chạy lại được, không trùng). Chạy: node tools/build-bac.mjs
//   ✍️ Viết bậc 2 · Nối câu: content/viet-noi.json → viet.json (khoá "noi"; build-b.mjs giữ khoá này)
//   🗣 Nói Pre-A1: content/noi-pre.json → noi.json (mục lv "pre" + câu đọc to thi test.pre). Đổi câu thì chạy lại tools/build-audio.py để dựng giọng.
//   🧠 câu suy luận (v103): content/suyluan.json → qs của bài Đọc / Nghe (sl: 1). Chạy SAU build-b.mjs (build-b dựng lại bài B1+ từ content/bs).
//   👄 Phát âm B1 → C2 (v103): content/pa-b.json → pa.json (thay các bộ B1 → C2, đổi cấp bộ cũ theo "move"); rồi chạy tools/build-audio.py cho từ chưa có giọng thu.
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
const SL = J('content/suyluan.json'); let nsl = 0;
for (const f of ['doc.json', 'nghe.json']) { const D = J(f);
  for (const x of D.items) { x.qs = (x.qs || []).filter(q => !q.sl); const s = SL[x.id]; if (!s) continue;
    if (!s.q || !s.a || !Array.isArray(s.w) || s.w.length !== (x.qs[0] ? x.qs[0].w.length : 2) || s.w.includes(s.a)) throw new Error('câu suy luận hỏng: ' + x.id); x.qs.push({ ...s, sl: 1 }); nsl++; }
  W(f, D); }
console.log('câu suy luận:', nsl);
const PB = J('content/pa-b.json'), PJ = J('pa.json'), BLV = ['b1', 'b2', 'c1', 'c2'];
for (const x of PB.sets) { if (!BLV.includes(x.lv) || x.pairs.length < 4 || x.test.length < 2) throw new Error('bộ âm hỏng: ' + x.id);
  for (const p of [...x.pairs, ...x.test]) if (p.length !== 4 || p.some(z => !z || /[\/\s]/.test(z.trim()) && p.indexOf(z) % 2)) throw new Error('cặp âm hỏng: ' + x.id + ' ' + p); }
PJ.sets = [...PJ.sets.filter(x => !BLV.includes(x.lv)).map(x => PB.move[x.id] ? { ...x, lv: PB.move[x.id] } : x), ...PB.sets]; W('pa.json', PJ);
console.log('pa.json:', PJ.sets.length, 'bộ âm (B1 → C2:', PB.sets.length + ')');
console.log('viet.json: nối câu', Object.entries(noi).map(([l, L]) => l + ' ' + L.length).join(' · '), '| noi.json: Pre-A1', P.items.length, 'đề,', P.test.length, 'câu đọc to thi');
// Soát nội dung 2/11/2026: sửa mục lấy từ game (build-skills.mjs) qua content/skill-fix.json, áp sau cùng (đọc lại tệp vừa ghi). Đã sửa thì bỏ qua; lệch cả hai thì dừng.
const SF = J('content/skill-fix.json'), SD = {}; let nsf = 0;
for (const [f, id, a, b] of SF.fix) { const D = SD[f] ||= J(f), i = D.items.findIndex(x => x.id === id); if (i < 0) throw new Error('skill-fix: không thấy ' + f + ' ' + id);
  const s = JSON.stringify(D.items[i]); if (s.includes(a)) { D.items[i] = JSON.parse(s.replace(a, () => b)); nsf++; } else if (!s.includes(b)) throw new Error('skill-fix: lệch ' + id + ': ' + a); }
for (const [f, D] of Object.entries(SD)) W(f, D);
console.log('skill-fix:', nsf, 'chỗ mới áp /', SF.fix.length);
