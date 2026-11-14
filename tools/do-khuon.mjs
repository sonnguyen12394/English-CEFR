// v174–v175: đo Phần Đọc (Part 5–7) của đề thử TOEIC trọn, so với khuôn đo từ 8 đề ETS (docs/KHUON-DE-TOEIC.md).
//   node tools/do-khuon.mjs [de3 de9 …]   in bảng số (không ghi tên = mọi đề trọn của app); chỉ nhắc
//   tools/build-toeic.mjs nhập doKhuon(): đề MỚI (ngoài KH_MIEN) lệch khuôn thì dừng dựng (luật D-KHUON-ETS)
// Số ETS chỉ là số đo tổng hợp (không chứa câu ETS). Đề riêng ETS không có trong repo.
import fs from 'node:fs';
const root = new URL('..', import.meta.url).pathname;
const rd = f => JSON.parse(fs.readFileSync(root + f, 'utf8'));
export const KH_MIEN = ['de1', 'de2', 'de3', 'de4', 'de5', 'de6', 'de7', 'de8'];   // soạn trước khuôn v175: chỉ nhắc
const W = s => String(s || '').trim().split(/\s+/).filter(Boolean).length;
const tok = s => String(s || '').toLowerCase().match(/[a-z]{4,}/g) || [];
const STOP = new Set('that this with from have will been were they their there which what when where would could should about into than then them these those your more most such also only other some very just over after before during while being does each make made upon'.split(' '));
const FN = new Set('a an the in on at by for with of to from about into through during until since despite although because while if unless whether and but or so yet nor either neither both who whom whose which that what where when he she it they we you him her them us his its their our your hers theirs ours himself herself itself themselves ourselves yourself this these those each every all some any few little much many several another other others however therefore moreover also instead otherwise as than within throughout among between across toward towards beside besides along behind beyond without upon onto via per unlike except even once whereas after before'.split(' '));
const CONN = new Set(['however', 'therefore', 'moreover', 'furthermore', 'in addition', 'additionally', 'instead', 'otherwise', 'nevertheless', 'consequently', 'as a result', 'for example', 'for instance', 'in fact', 'meanwhile', 'similarly', 'likewise', 'in contrast', 'on the other hand', 'afterward', 'finally', 'thus', 'hence', 'indeed', 'nonetheless', 'subsequently', 'eventually', 'fortunately', 'unfortunately', 'alternatively', 'in particular', 'in the meantime', 'even so', 'accordingly', 'besides']);
const longest = (a, o) => { const L = o.map(x => x.length), m = Math.max(...L); return a.length === m && L.filter(x => x === m).length === 1; };
const avg = a => a.length ? a.reduce((x, y) => x + y, 0) / a.length : 0;
const qs7 = d => d.p7.flatMap(s => s.qs);
// [tên, hàm đo, kiểm đạt, khoảng ETS] — ngưỡng: docs/KHUON-DE-TOEIC.md
export const KHUON = [
  ['P5 số từ / câu', d => avg(d.p5.map(q => W(q.s))), v => v >= 13 && v <= 16, '14–15'],
  ['P5 câu từ vựng / 30', d => d.p5.filter(q => { const o = q.o.map(x => x.toLowerCase()); return new Set(o.map(x => x.slice(0, 4))).size === 4 && o.every(x => !/\s/.test(x)) && !o.every(x => FN.has(x)); }).length, v => v >= 11, '12–14'],
  ['P6 số từ / đoạn', d => avg(d.p6.map(x => W(x.text))), v => v >= 90 && v <= 110, '87–106'],
  ['P6 chỗ từ nối', d => d.p6.flatMap(x => x.gaps).filter(g => g.o.every(o => CONN.has(o.toLowerCase()))).length, v => v <= 1, '0–1'],
  ['P7 tổng số từ', d => d.p7.reduce((a, s) => a + W(s.docs.map(x => x.text).join(' ')), 0), v => v >= 2800, '3.080–3.590'],
  ['P7 từ / văn bản đơn', d => avg(d.p7.filter(s => s.docs.length === 1).map(s => W(s.docs[0].text))), v => v >= 130 && v <= 170, '137–169'],
  ['P7 từ / bộ nhiều văn bản', d => avg(d.p7.filter(s => s.docs.length > 1).map(s => W(s.docs.map(x => x.text).join(' ')))), v => v >= 300 && v <= 400, '330–400'],
  ['P7 từ đáp án − từ phương án sai', d => avg(qs7(d).map(q => W(q.a) - avg(q.w.map(W)))), v => v >= -0.3 && v <= 0.5, '−0,2…+0,5'],
  ['P7 đáp án dài nhất / 54', d => qs7(d).filter(q => longest(q.a, [q.a, ...q.w])).length, v => v <= 13, '6–16 (~10)'],
  ['P7 chép bài: đáp án − sai', d => { const r = []; for (const s of d.p7) { const tx = new Set(tok(s.docs.map(x => x.text + ' ' + (x.title || '')).join(' ')));
      const ov = x => { const t = tok(x).filter(w => !STOP.has(w)); return t.length ? t.filter(w => tx.has(w)).length / t.length : null; };
      for (const q of s.qs) { const a = ov(q.a), w = q.w.map(ov).filter(x => x != null); if (a != null && w.length) r.push(a - avg(w)); } } return avg(r); }, v => v <= 0.08, '−0,06…+0,08'],
  ['P7 câu indicated / stated / true', d => qs7(d).filter(q => !/\bNOT\b/.test(q.q) && /indicat|stated|mention|true/i.test(q.q)).length, v => v >= 9, '10–13'],
  ['P7 câu suggested / concluded / most likely', d => qs7(d).filter(q => /suggested|be concluded|implied|be inferred|most likely|probably/i.test(q.q)).length, v => v >= 10, '~12'],
  ['P7 câu hỏi thẳng số / giờ / nơi', d => qs7(d).filter(q => /^(how much|how many|when|what time|what day|where)\b/i.test(q.q)).length, v => v <= 4, '~2'],
];
export const kindSeq = d => d.p7.map(s => String(s.kind).toLowerCase().replace(/online chat( discussion)?/, 'chat')).join('|');
// d = { p5, p6, p7 } đã dựng; others = các đề khác để so chuỗi loại văn bản. Trả [{ ten, v, ok, ets }] (+ dòng chuỗi loại văn bản nếu trùng)
export function doKhuon(d, others = []) { const out = KHUON.map(([ten, fn, ok, ets]) => { const v = fn(d); return { ten, v, ok: ok(v), ets }; });
  const same = others.filter(o => o.id !== d.id && kindSeq(o) === kindSeq(d)).map(o => o.id);
  out.push({ ten: 'P7 thứ tự loại văn bản khác đề trước', v: same.join(', ') || '—', ok: !same.length, ets: 'đổi mỗi đề' }); return out; }
const fmt = v => typeof v !== 'number' ? String(v) : Number.isInteger(v) ? String(v) : v.toFixed(v < 1 && v > -1 ? 2 : 0);
if (import.meta.url === 'file://' + process.argv[1]) {
  const T = rd('toeic.json'), by = a => Object.fromEntries(a.map(x => [x.id, x])), K5 = by(T.p5), K6 = by(T.p6), K7 = by(T.p7);
  const load = id => { const m = T.tron.find(d => d.id === id); if (!m) return null;
    if (m.f) { const d = rd(m.f); return { id, p5: d.p5, p6: d.p6, p7: d.p7 }; }
    return { id, p5: m.p5.map(i => K5[i]), p6: m.p6.map(i => K6[i]), p7: m.p7.map(i => K7[i]) }; };
  const all = T.tron.map(x => load(x.id)).filter(Boolean), ids = process.argv.slice(2).length ? process.argv.slice(2) : T.tron.map(d => d.id), des = ids.map(load).filter(Boolean);
  const R = des.map(d => doKhuon(d, all));
  console.log(['Số đo'.padEnd(42), ...des.map(d => d.id.padStart(7)), '  ETS'].join(''));
  for (let i = 0; i < KHUON.length; i++) console.log([KHUON[i][0].padEnd(42), ...R.map(r => ((r[i].ok ? '' : '⚠') + fmt(r[i].v)).padStart(7)), '  ' + KHUON[i][3]].join(''));
  des.forEach((d, j) => { const x = R[j][KHUON.length]; if (!x.ok) console.log(`⚠ ${d.id}: thứ tự loại văn bản Part 7 trùng ${x.v}`); });
  console.log('⚠ = ngoài khuôn ETS. Đề 1–8 (' + KH_MIEN.length + ' đề soạn trước khuôn) chỉ nhắc; đề mới lệch khuôn thì bộ dựng dừng. Khuôn: docs/KHUON-DE-TOEIC.md'); }
