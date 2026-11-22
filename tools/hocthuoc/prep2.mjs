// Đầu vào cho các bài mới (từ bài 13): node prep2.mjs <thư mục ra> <tệp danh sách JSON [[n, đề, part, thứ tự], ...]>
// Part 2: [n, đề, 'p2', 0] = bộ 10 câu hỏi – đáp đầu của đề (A hỏi, B đáp đúng).
import fs from 'node:fs';
const OUT = process.argv[2], LIST = JSON.parse(fs.readFileSync(process.argv[3])), T = JSON.parse(fs.readFileSync('toeic.json'));
const kho = {}; for (const p of ['p2', 'p3', 'p4', 'p6', 'p7']) for (const x of T[p]) kho[x.id] = x;
const norm = t => String(t).replace(/[‘’]/g, "'").replace(/[“”]/g, '"').replace(/\s+/g, ' ').trim().replace(/[.,;:]+$/, '').toLowerCase();
const key = t => { let h = 0x811c9dc5; for (const ch of norm(t)) for (let i = 0; i < ch.length; i++) { h ^= ch.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; } return 'a' + h.toString(16).padStart(8, '0'); };
const clip = t => fs.existsSync(`n/${key(t)}.mp3`) ? key(t) : '';
const sentsNaive = t => String(t).split(/(?<=[.!?])\s+/).map(s => s.trim()).filter(Boolean);   // = build-audio.py (giữ để khớp tệp giọng Part 4)
const sentsGood = t => String(t).split(/(?<=[.!?])\s+(?=[A-Z0-9"“])/).reduce((a, s) => { if (a.length && /\b(Mr|Ms|Mrs|Dr|St)\.$/.test(a[a.length - 1])) a[a.length - 1] += ' ' + s; else a.push(s); return a; }, []).map(s => s.trim()).filter(Boolean);
const DANG = { p2: '💬 Hỏi – đáp', p3: '🗣 Hội thoại', p4: '📢 Bài nói', p6: '✉️ Văn bản', p7: '📄 Đọc hiểu' };
for (const [n, de, p, i] of LIST) {
  const D = de <= 2 ? T.tron[de - 1] : JSON.parse(fs.readFileSync(`toeic-tron/de${de}.json`));
  let L, exq, x, kind = '', g = null;
  if (p === 'p2') { const xs = D.p2.slice(0, 10).map(y => typeof y === 'string' ? kho[y] : y); x = { id: `de${de}-p2-bo1` };
    L = xs.flatMap(y => [['A', y.q, '', clip(y.q)], ['B', y.o[y.a], '', '']]);
    exq = xs.slice(0, 4).map(y => ({ q: y.q, a: y.o[y.a], w: y.o.filter((_, j) => j !== y.a), ty: y.ty })); kind = 'Part 2 · 10 câu hỏi – đáp'; }
  else { x = D[p][i - 1]; if (typeof x === 'string') x = kho[x]; kind = x.kind || x.ty || '';
    if (p === 'p3') { L = x.lines.map(([s, t]) => [s, t, '', clip(t)]); exq = x.qs; g = x.g || null; }
    else if (p === 'p4') { L = sentsNaive(x.text).map(t => ['N', t, '', clip(t)]); exq = x.qs; g = x.g || null; }
    else if (p === 'p6') { const txt = x.text.replace(/\{(\d)\}/g, (m, k) => x.gaps[k - 1].a); L = sentsGood(txt).map(t => ['W', t, '', '']);
      exq = x.gaps.map((gg, k) => ({ q: `Part 6 · chỗ trống ${k + 1}`, a: gg.a, w: gg.o.filter(o => o !== gg.a), why: gg.why, ty: gg.t })); }
    else { L = x.docs.flatMap((d, k) => [...(x.docs.length > 1 ? [['W', `(${k + 1}) ${d.title || ''}`.trim(), '', '']] : []),
        ...d.text.split(/\n+/).flatMap(par => sentsGood(par)).reduce((a, t) => { if (a.length && a[a.length - 1].split(/\s+/).length <= 2) a[a.length - 1] += ' — ' + t; else a.push(t); return a; }, []).map(t => ['W', t, '', ''])]); exq = x.qs; } }
  fs.writeFileSync(`${OUT}/bai${n}.in.json`, JSON.stringify({ n, nguon: `Đề ${de} · Part ${p.slice(1)}${p === 'p2' ? '' : ' · ' + i}`, id: x.id, dang: DANG[p], kind, title: x.title || (x.docs ? x.docs.map(d => d.title).join(' · ') : ''), g, L, exq }, null, 1));
  console.log(n, x.id, kind, L.length, 'câu', L.filter(l => l[3]).length, 'có giọng', L.reduce((a, l) => a + l[1].split(/\s+/).length, 0), 'từ'); }
