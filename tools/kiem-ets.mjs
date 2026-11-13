// v166 (specs/017-toeic-bo-sung-tu-ets): kiểm nội dung TOEIC của app KHÔNG chép câu chữ đề ETS (Đề 9–16, tài liệu riêng của người sáng lập, chỉ có trên máy soạn).
// Đề ETS nằm ở content/ref/ets/out/de9–16.json (cả hai trong .gitignore); máy không có thì bỏ qua (in "bỏ qua").
// So từng câu của kho luyện (content/toeic/p5.json, doc.json, vocab.json) với từng câu ETS: trùng cụm 10 từ liền nhau, hoặc Jaccard theo từ ≥ 0,6 (câu ≥ 10 từ) = lỗi. Câu hỏi Part 7 (khuôn chung của TOEIC: "What is the purpose of…") và câu xã giao ngắn không so.
// Chạy: node tools/kiem-ets.mjs   (thoát mã 1 khi có lỗi)
import fs from 'fs';
const R = new URL('..', import.meta.url).pathname, rd = f => JSON.parse(fs.readFileSync(R + f, 'utf8'));
const src = [...[9, 10, 11, 12, 13, 14, 15, 16].map(n => `content/ref/ets/out/de${n}.json`)].filter(f => fs.existsSync(R + f));
if (!src.length) { console.log('kiem-ets: không có đề ETS trên máy này, bỏ qua'); process.exit(0); }
const words = s => String(s).toLowerCase().replace(/[’']/g, "'").match(/[a-z0-9']+/g) || [];
const sents = t => String(t).split(/(?<=[.!?])\s+|\n+/).map(s => s.trim()).filter(s => words(s).length >= 6);
const ets = [];
for (const f of src) { const d = rd(f);
  for (const q of d.p5 || []) ets.push(q.s.replace(/-+/, q.a));
  for (const p of d.p6 || []) ets.push(...sents(p.text.replace(/\{\d\}/g, ' ')));
  for (const s of d.p7 || []) { for (const dc of s.docs) ets.push(...sents(dc.text)); for (const q of s.qs) ets.push(q.q, q.a); } }
const E = ets.filter(s => words(s).length >= 6).map(s => { const w = words(s); return { s, set: new Set(w), g: new Set(w.slice(0, -9).map((_, i) => w.slice(i, i + 10).join(' '))) }; });
const G8 = new Set(E.flatMap(e => [...e.g]));
const app = [];
for (const q of rd('content/toeic/p5.json').items) app.push([q.id, q.s.replace(/-+/, q.a)]);
const D = rd('content/toeic/doc.json');
for (const p of D.p6) for (const s of sents(p.text.replace(/\{\d\}/g, ' '))) app.push([p.id, s]);
for (const x of D.p7) { for (const dc of x.docs) for (const s of sents(dc.text)) app.push([x.id, s]); }
for (const t of rd('content/toeic/vocab.json').topics) for (const [w, , ex] of t.w) app.push(['từ ' + w, ex]);
const err = [];
for (const [id, s] of app) { const w = words(s); if (w.length < 10) continue; const set = new Set(w);
  const g = w.slice(0, -9).map((_, i) => w.slice(i, i + 10).join(' ')).find(x => G8.has(x));
  if (g) { err.push(`${id}: trùng cụm 10 từ với đề ETS: "${g}"`); continue; }
  for (const e of E) { let n = 0; for (const x of set) if (e.set.has(x)) n++; const j = n / (set.size + e.set.size - n); if (j >= 0.6) { err.push(`${id}: gần giống câu ETS (${j.toFixed(2)}): "${s}" ≈ "${e.s}"`); break; } } }
console.log(`kiem-ets: ${app.length} câu của app so với ${E.length} câu ETS (${src.length} đề): ${err.length} lỗi`);
for (const e of err) console.log('  ✗ ' + e);
process.exit(err.length ? 1 : 0);
