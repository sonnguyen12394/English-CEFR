// Ngân hàng câu cho Thi chuyển cấp A1: mỗi từ một câu MỚI (không trùng câu luyện), soạn trong content/exam-s*.txt (dòng "id|câu").
// Kiểm: câu có từ đích (kể cả dạng -s / -ed / -ing), không trùng câu ví dụ / câu điền đã luyện, ≥ 85% chữ trong câu là từ A1 (hoặc từ A1 của game).
// Thêm câu nghe có âm thanh thu sẵn của game (clips.json, câu ≤ 14 chữ, dễ, không trùng câu luyện) cho dạng nghe; chép tệp mp3 sang a/.
// Chạy: node tools/build-exam.mjs ../sonnguyen12394.github.io [a1|a2]  → exam-a1.json / exam-a2.json (câu soạn ở content/exam*-s*.txt, dùng chung mọi cấp theo id từ; tệp sau ghi đè tệp trước)
import fs from 'node:fs';
const src = process.argv[2] || '../sonnguyen12394.github.io', root = new URL('..', import.meta.url).pathname, LV = process.argv[3] || 'a1';
const d = JSON.parse(fs.readFileSync(root + LV + '.json', 'utf8')), W = d.units.flatMap(u => u.words);
const WA1 = LV === 'a1' ? [] : JSON.parse(fs.readFileSync(root + 'a1.json', 'utf8')).units.flatMap(u => u.words);   // A2: từ A1 cũng tính là đã biết
const lvl = JSON.parse(fs.readFileSync(src + '/content/wordlist.json', 'utf8'));
const a1 = new Set([...W, ...WA1].map(w => w.w.toLowerCase()).concat(Object.keys(lvl).filter(k => lvl[k] === 'A1' || (LV === 'a2' && lvl[k] === 'A2'))));
const tok = s => s.toLowerCase().replace(/[‘’]/g, "'").match(/[a-z][a-z']*/g) || [];
const base = t => [t, t.replace(/'s$/, ''), t.replace(/ies$/, 'y'), t.replace(/ied$/, 'y'), ...['es', 's', 'ed', 'd', 'ing'].map(x => t.endsWith(x) ? t.slice(0, -x.length) : t), t.replace(/ing$/, 'e'), t.replace(/(.)\1(ing|ed)$/, '$1'), t.replace(/n't$/, '')];
// tên riêng và vài từ A1 thông dụng mà danh sách của game chưa gắn A1 (người soạn thêm, chưa người thật kiểm)
const NAMES = 'hanoi vietnam vietnamese english hue da nang lat ho chi minh hoi an lan nam anna tom grandma japan french chinese australia london paris ha long bay nguyen'.split(' ');
const EXTRA = 'near kind turn party birthday careful heavy sky message price board pizza'.split(' ');
const IRR = 'went gone was were been did done had made took saw came got gave told said ate drank wrote broke won lost met bought sang sat stood ran swam flew fell rode drove left felt thought knew found brought kept heard understood forgot began became chose grew built cut put let read children people men women teeth feet mice sheep fish i\'m i\'d i\'ll you\'re it\'s that\'s what\'s let\'s don\'t can\'t won\'t isn\'t aren\'t didn\'t doesn\'t'.split(' ');
const known = t => IRR.includes(t) || NAMES.includes(t) || EXTRA.includes(t) || base(t).some(x => a1.has(x)) || /^\d/.test(t);
function formsOf(x) { x = x.toLowerCase(); if (/\s/.test(x)) { const [h, ...r] = x.split(' '); return formsOf(h).map(f => [f, ...r].join(' ')); }   // cụm: chia từ đầu (looking for)
  const f = new Set([x, x + 's', x + 'es', x + 'ed', x + 'd', x + 'ing', x + "'s"]);
  if (/[^aeiou]y$/.test(x)) { f.add(x.slice(0, -1) + 'ies'); f.add(x.slice(0, -1) + 'ied'); }
  if (/e$/.test(x)) f.add(x.slice(0, -1) + 'ing');
  if (/[^aeiou][aeiou][bdgmnprt]$/.test(x)) { f.add(x + x.slice(-1) + 'ing'); f.add(x + x.slice(-1) + 'ed'); }
  return [...f]; }
const reEsc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const findForm = (w, s) => { const m = new RegExp(`(?<![A-Za-z'])(${formsOf(w.w).map(reEsc).join('|')})(?![A-Za-z])`, 'i').exec(s.replace(/[‘’]/g, "'")); return m ? m[1] : null; };
const seen = new Set(W.flatMap(w => [w.ex, w.cloze.s.replace('___', w.cloze.a)]).map(s => s.toLowerCase()));
const lines = fs.readdirSync(root + 'content').filter(f => /^exam\d?-s\d+\.txt$/.test(f)).sort().flatMap(f => fs.readFileSync(root + 'content/' + f, 'utf8').split('\n').filter(Boolean));
const S = {}; for (const l of lines) { const i = l.indexOf('|'); S[l.slice(0, i)] = l.slice(i + 1).trim(); }
const errs = [], out = {}, hard = [];
for (const w of W) { const s = S[w.id];
  if (!s) { errs.push(`${w.id}: thiếu câu`); continue; }
  const f = findForm(w, s); if (!f) { errs.push(`${w.id}: câu không có từ đích: ${s}`); continue; }
  if (seen.has(s.toLowerCase())) { errs.push(`${w.id}: trùng câu luyện: ${s}`); continue; }
  const T = tok(s), unk = T.filter(t => !known(t)); if (unk.length / T.length > 0.15) hard.push(`${w.id}: ${s} [lạ: ${unk.join(', ')}]`);
  out[w.id] = { s, f }; }
// câu nghe có âm thanh thu sẵn
const clipNorm = t => String(t).replace(/[‘’]/g, "'").replace(/[“”]/g, '"').replace(/\s+/g, ' ').trim().replace(/[.,;:]+$/, '').toLowerCase();
const clipKey = t => { let h = 0x811c9dc5; const x = clipNorm(t); for (let i = 0; i < x.length; i++) { h ^= x.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; } return 'a' + h.toString(16).padStart(8, '0'); };
const clips = JSON.parse(fs.readFileSync(src + '/content/clips.json', 'utf8')).filter(c => c.src !== 'word' && !c.v);
const easy = [...new Map(clips.map(c => [c.t, c])).values()].filter(c => { const T = tok(c.t); return T.length >= 4 && T.length <= 14 && T.filter(known).length / T.length >= 0.9 && !seen.has(c.t.toLowerCase()); });
let nL = 0; fs.mkdirSync(root + 'a', { recursive: true });
const idx = new Set(JSON.parse(fs.readFileSync(root + 'a/index.json', 'utf8')));
for (const w of W) { if (!out[w.id] || w.w.replace(/\s/g, '').length < 3) continue;
  const c = easy.find(c => findForm(w, c.t) && c.t !== out[w.id].s); if (!c) continue;
  const k = clipKey(c.t); if (!fs.existsSync(`${src}/a/c/${k}.mp3`)) continue;
  fs.copyFileSync(`${src}/a/c/${k}.mp3`, `${root}a/${k}.mp3`); idx.add(k); out[w.id].l = c.t; nL++; }
fs.writeFileSync(root + 'a/index.json', JSON.stringify([...idx].sort()));
fs.writeFileSync(root + `exam-${LV}.json`, JSON.stringify(out));
console.log(`câu thi: ${Object.keys(out).length}/${W.length} · lỗi ${errs.length} · nhiều từ lạ ${hard.length} · có câu nghe thu sẵn ${nL}`);
errs.forEach(e => console.log('LỖI', e)); hard.forEach(e => console.log('KHÓ', e));
