// Dựng toeic.json (🎓 Luyện thi → TOEIC, toeic.js) từ content/toeic/{p5,doc,nghe,vocab}.json và kiểm lỗi soạn. Chạy: node tools/build-toeic.mjs
// Không sửa tay toeic.json. Sau khi sửa câu nghe (Part 2–4) hoặc từ vựng: chạy lại tools/build-audio.py để dựng giọng (n/).
// Part 2: xáo thứ tự 3 lời đáp theo id (cố định, để tệp giọng khớp), mỗi lời đọc kèm chữ cái "A. …" như đề thật.
import fs from 'node:fs'; import crypto from 'node:crypto';
const root = new URL('..', import.meta.url).pathname, rd = f => JSON.parse(fs.readFileSync(root + f, 'utf8'));
const P5 = rd('content/toeic/p5.json').items, D = rd('content/toeic/doc.json'), N = rd('content/toeic/nghe.json'), V = rd('content/toeic/vocab.json').topics, err = [], ids = new Set();
const id = x => { if (ids.has(x.id)) err.push('trùng id ' + x.id); ids.add(x.id); };
const mcOk = (x, q) => { if (q.w.length !== 3 || q.w.includes(q.a) || new Set(q.w).size !== 3) err.push(x.id + ': trắc nghiệm hỏng: ' + q.q); };
const h = s => parseInt(crypto.createHash('md5').update(s).digest('hex').slice(0, 8), 16);
for (const x of P5) { id(x); if (x.o.length !== 4 || new Set(x.o).size !== 4 || !x.o.includes(x.a)) err.push(x.id + ': phương án hỏng'); if ((x.s.match(/-------/g) || []).length !== 1) err.push(x.id + ': cần đúng một chỗ trống'); if (!x.why) err.push(x.id + ': thiếu giải thích'); }
for (const x of D.p6) { id(x); const n = (x.text.match(/\{\d\}/g) || []).length; if (n !== x.gaps.length) err.push(x.id + ': số chỗ trống ≠ số câu');
  for (const g of x.gaps) if (g.o.length !== 4 || new Set(g.o).size !== 4 || !g.o.includes(g.a)) err.push(x.id + ': phương án hỏng'); if (!x.gaps.some(g => g.a.split(' ').length > 5)) err.push(x.id + ': thiếu câu chèn'); }
for (const x of D.p7) { id(x); if (!x.docs.length || x.qs.length < 2) err.push(x.id + ': thiếu văn bản / câu hỏi'); for (const q of x.qs) mcOk(x, q); }
const p2 = N.p2.map(x => { id(x); if (x.o.length !== 3 || !(x.a >= 0 && x.a < 3)) err.push(x.id + ': Part 2 hỏng');
  const r = h(x.id) % 6, perm = [[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]][r], o = perm.map(i => x.o[i]), a = perm.indexOf(x.a);
  return { id: x.id, q: x.q, o, a, lines: [['A', x.q], ...o.map((t, i) => ['B', 'ABC'[i] + '. ' + t])] }; });
for (const x of [...N.p3, ...N.p4]) { id(x); if (x.qs.length !== 3) err.push(x.id + ': cần 3 câu hỏi'); for (const q of x.qs) mcOk(x, q); }
const seen = new Set(); for (const t of V) for (const [w, vi, ex] of t.w) { if (seen.has(w)) err.push('từ trùng: ' + w); seen.add(w); if (!vi || !ex || !ex.toLowerCase().includes(w.toLowerCase().split(' ')[0].slice(0, 4))) err.push('từ thiếu nghĩa / ví dụ: ' + w); }
if (err.length) { console.error(err.join('\n')); process.exit(1); }
const ans = p2.map(x => x.a); if (Math.max(...[0, 1, 2].map(i => ans.filter(a => a === i).length)) > ans.length * 0.5) { console.error('Part 2: đáp án dồn một chữ cái'); process.exit(1); }
fs.writeFileSync(root + 'toeic.json', JSON.stringify({ _note: 'Dựng bởi tools/build-toeic.mjs từ content/toeic/*.json. Không sửa tay.', p5: P5, p6: D.p6, p7: D.p7, p2, p3: N.p3, p4: N.p4, voc: V }));
console.log(`toeic.json: Part 2 ${p2.length} · Part 3 ${N.p3.length} bài · Part 4 ${N.p4.length} bài · Part 5 ${P5.length} · Part 6 ${D.p6.length} bài · Part 7 ${D.p7.length} bộ (${D.p7.reduce((s, x) => s + x.qs.length, 0)} câu) · từ vựng ${seen.size} từ / ${V.length} chủ đề · đáp án Part 2 A/B/C: ${[0, 1, 2].map(i => ans.filter(a => a === i).length).join('/')}`);
