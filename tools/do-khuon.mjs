// v174: đo Phần Đọc (Part 5–7) của đề thử TOEIC trọn, so với khuôn đo từ 8 đề ETS (docs/TIEU-CHI-DE-TOEIC.md "Khuôn Phần Đọc theo đề ETS").
// Chỉ nhắc, không chặn. Chạy: node tools/do-khuon.mjs [de3 de9 …]  (không ghi tên = mọi đề trọn của app)
// Số ETS chỉ là số đo tổng hợp (không chứa câu ETS). Đề riêng ETS không có trong repo.
import fs from 'node:fs';
const root = new URL('..', import.meta.url).pathname;
const rd = f => JSON.parse(fs.readFileSync(root + f, 'utf8'));
const T = rd('toeic.json'), by = a => Object.fromEntries(a.map(x => [x.id, x]));
const K5 = by(T.p5), K6 = by(T.p6), K7 = by(T.p7);
const load = id => { const m = T.tron.find(d => d.id === id); if (!m) return null;
  if (m.f) { const d = rd(m.f); return { id, p5: d.p5, p6: d.p6, p7: d.p7 }; }
  return { id, p5: m.p5.map(i => K5[i]), p6: m.p6.map(i => K6[i]), p7: m.p7.map(i => K7[i]) }; };
const W = s => String(s || '').trim().split(/\s+/).filter(Boolean).length;
const tok = s => String(s || '').toLowerCase().match(/[a-z]{4,}/g) || [];
const STOP = new Set('that this with from have will been were they their there which what when where would could should about into than then them these those your more most such also only other some very just over after before during while being does each make made upon'.split(' '));
const FN = new Set('a an the in on at by for with of to from about into through during until since despite although because while if unless whether and but or so yet nor either neither both who whom whose which that what where when he she it they we you him her them us his its their our your hers theirs ours himself herself itself themselves ourselves yourself this these those each every all some any few little much many several another other others however therefore moreover also instead otherwise as than within throughout among between across toward towards beside besides along behind beyond without upon onto via per unlike except even once whereas after before'.split(' '));
const CONN = new Set(['however', 'therefore', 'moreover', 'furthermore', 'in addition', 'additionally', 'instead', 'otherwise', 'nevertheless', 'consequently', 'as a result', 'for example', 'for instance', 'in fact', 'meanwhile', 'similarly', 'likewise', 'in contrast', 'on the other hand', 'afterward', 'finally', 'thus', 'hence', 'indeed', 'nonetheless', 'subsequently', 'eventually', 'fortunately', 'unfortunately', 'alternatively', 'in particular', 'in the meantime', 'even so', 'accordingly', 'besides']);
const longest = (a, o) => { const L = o.map(x => x.length), m = Math.max(...L); return a.length === m && L.filter(x => x === m).length === 1; };
const avg = a => a.length ? a.reduce((x, y) => x + y, 0) / a.length : 0;
// [tên, hàm đo, kiểm đạt, khoảng ETS]
const M = [
  ['P5 số từ / câu', d => avg(d.p5.map(q => W(q.s))), v => v >= 13 && v <= 16, '14–15'],
  ['P5 câu từ vựng / 30', d => d.p5.filter(q => { const o = q.o.map(x => x.toLowerCase()); return new Set(o.map(x => x.slice(0, 4))).size === 4 && o.every(x => !/\s/.test(x)) && !o.every(x => FN.has(x)); }).length, v => v >= 11, '12–14'],
  ['P6 số từ / đoạn', d => avg(d.p6.map(x => W(x.text))), v => v >= 90 && v <= 110, '87–106'],
  ['P6 chỗ từ nối', d => d.p6.flatMap(x => x.gaps).filter(g => g.o.every(o => CONN.has(o.toLowerCase()))).length, v => v <= 1, '0–1'],
  ['P7 tổng số từ', d => d.p7.reduce((a, s) => a + W(s.docs.map(x => x.text).join(' ')), 0), v => v >= 2800, '3.080–3.590'],
  ['P7 từ / văn bản đơn', d => avg(d.p7.filter(s => s.docs.length === 1).map(s => W(s.docs[0].text))), v => v >= 130 && v <= 170, '137–169'],
  ['P7 từ / bộ nhiều văn bản', d => avg(d.p7.filter(s => s.docs.length > 1).map(s => W(s.docs.map(x => x.text).join(' ')))), v => v >= 300 && v <= 400, '330–400'],
  ['P7 từ đáp án − từ phương án sai', d => avg(d.p7.flatMap(s => s.qs).map(q => W(q.a) - avg(q.w.map(W)))), v => v >= -0.3 && v <= 0.5, '−0,2…+0,5'],
  ['P7 đáp án dài nhất / 54', d => d.p7.flatMap(s => s.qs).filter(q => longest(q.a, [q.a, ...q.w])).length, v => v <= 13, '6–16 (~10)'],
  ['P7 chép bài: đáp án − sai', d => { const r = []; for (const s of d.p7) { const tx = new Set(tok(s.docs.map(x => x.text + ' ' + (x.title || '')).join(' ')));
      const ov = x => { const t = tok(x).filter(w => !STOP.has(w)); return t.length ? t.filter(w => tx.has(w)).length / t.length : null; };
      for (const q of s.qs) { const a = ov(q.a), w = q.w.map(ov).filter(x => x != null); if (a != null && w.length) r.push(a - avg(w)); } } return avg(r); }, v => v <= 0.08, '−0,06…+0,08'],
  ['P7 câu indicated / stated / true', d => d.p7.flatMap(s => s.qs).filter(q => !/\bNOT\b/.test(q.q) && /indicat|stated|mention|true/i.test(q.q)).length, v => v >= 9, '10–13'],
];
const ids = process.argv.slice(2).length ? process.argv.slice(2) : T.tron.map(d => d.id);
const des = ids.map(load).filter(Boolean);
const f = v => Number.isInteger(v) ? String(v) : v.toFixed(v < 1 && v > -1 ? 2 : 0);
console.log(['Số đo'.padEnd(34), ...des.map(d => d.id.padStart(7)), '  ETS'].join(''));
for (const [t, fn, ok, ets] of M) console.log([t.padEnd(34), ...des.map(d => { const v = fn(d); return ((ok(v) ? '' : '⚠') + f(v)).padStart(7); }), '  ' + ets].join(''));
// thứ tự loại văn bản Part 7 trùng đề khác
const seq = d => d.p7.map(s => s.kind.toLowerCase().replace(/online chat( discussion)?/, 'chat')).join('|');
const all = T.tron.map(x => x.id).map(load).filter(Boolean);
for (const d of des) { const same = all.filter(o => o.id !== d.id && seq(o) === seq(d)).map(o => o.id); if (same.length) console.log(`⚠ ${d.id}: thứ tự loại văn bản Part 7 trùng ${same.join(', ')}`); }
console.log('⚠ = ngoài khuôn ETS (chỉ nhắc). Khuôn: docs/TIEU-CHI-DE-TOEIC.md "Khuôn Phần Đọc theo đề ETS".');
