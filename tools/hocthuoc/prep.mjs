// Dựng đầu vào cho bài 3–12 (docs/BAI-HOC-THUOC.md): câu tiếng Anh + mã giọng + câu hỏi đề thật
import fs from 'node:fs';
const OUT = process.argv[2], T = JSON.parse(fs.readFileSync('toeic.json')); const kho = {}; for (const p of ['p3', 'p4', 'p6']) for (const x of T[p]) kho[x.id] = x;
const norm = t => String(t).replace(/[‘’]/g, "'").replace(/[“”]/g, '"').replace(/\s+/g, ' ').trim().replace(/[.,;:]+$/, '').toLowerCase();
const key = t => { let h = 0x811c9dc5; for (const ch of norm(t)) { for (let i = 0; i < ch.length; i++) { h ^= ch.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; } } return 'a' + h.toString(16).padStart(8, '0'); };
const sents = t => String(t).split(/(?<=[.!?])\s+/).map(s => s.trim()).filter(Boolean);
const B = [[3, 7, 'p6', 2, 'Khách sạn & đi lại', '✉️ Văn bản'], [4, 3, 'p3', 4, 'Mua hàng & giao hàng', '🗣 Hội thoại'], [5, 5, 'p4', 2, 'Mua hàng & giao hàng', '📢 Bài nói'], [6, 1, 'p6', 1, 'Mua hàng & giao hàng', '✉️ Văn bản'],
  [7, 7, 'p3', 4, 'Công sở & cuộc họp', '🗣 Hội thoại'], [8, 3, 'p4', 7, 'Công sở & cuộc họp', '📢 Bài nói'], [9, 1, 'p6', 3, 'Công sở & cuộc họp', '✉️ Văn bản'],
  [10, 5, 'p3', 4, 'Dịch vụ & sửa chữa', '🗣 Hội thoại'], [11, 3, 'p4', 1, 'Dịch vụ & sửa chữa', '📢 Bài nói'], [12, 7, 'p6', 4, 'Dịch vụ & sửa chữa', '✉️ Văn bản']];
for (const [n, de, p, i, chu, dang] of B) {
  const D = de <= 2 ? T.tron[de - 1] : JSON.parse(fs.readFileSync(`toeic-tron/de${de}.json`)); let x = D[p][i - 1]; if (typeof x === 'string') x = kho[x];
  let lines, exq;
  if (p === 'p3') { lines = x.lines.map(([s, t]) => [s, t]); exq = x.qs; }
  else if (p === 'p4') { lines = sents(x.text).map(t => ['N', t]); exq = x.qs; }
  else { const txt = x.text.replace(/\{(\d)\}/g, (m, k) => x.gaps[k - 1].a); lines = txt.split(/(?<=[.!?])\s+(?=[A-Z])/).reduce((a, t) => { if (a.length && /\b(Mr|Ms|Mrs|Dr)\.$/.test(a[a.length - 1])) a[a.length - 1] += ' ' + t; else a.push(t); return a; }, []).map(t => ['W', t.trim()]);
    exq = x.gaps.map((g, k) => ({ q: `Part 6 · chỗ trống ${k + 1}`, a: g.a, w: g.o.filter(o => o !== g.a), why: g.why, ty: g.t })); }
  const L = lines.map(([s, t]) => [s, t, '', fs.existsSync(`n/${key(t)}.mp3`) ? key(t) : '']);
  fs.writeFileSync(`${OUT}/bai${n}.in.json`, JSON.stringify({ n, nguon: `Đề ${de} · ${p.replace('p', 'Part ')} · ${p === 'p6' ? 'đoạn' : 'bài'} ${i}`, id: x.id, chu, dang, kind: x.kind || x.ty || '', title: x.title || '', L, exq }, null, 1));
  console.log(n, x.id, L.length, 'câu', L.filter(l => l[3]).length, 'có giọng'); }
