// ⏰ Phố Động Từ (Thành phố TOEIC, v189): kiểm + dựng content/toeic/dong.json → dong.json (gốc). Không sửa tay dong.json.
// Chạy: node tools/build-dong.mjs   (lỗi thì dừng, in danh sách)
import fs from 'fs';
const SRC = JSON.parse(fs.readFileSync('content/toeic/dong.json', 'utf8')), L = SRC.items || [], err = [];
const TY = ['H', 'B', 'O', 'I'];
// luật → cư dân của luật đó
const LU = { qd: 'H', hd: 'H', td: 'H', htht: 'H', hth: 'H', tl: 'H', dk: 'H', bd: 'B', to: 'O', goc: 'O', ing: 'I' };
const words = s => new Set(String(s).toLowerCase().replace(/<[^>]+>/g, ' ').replace(/-{3,}|_{3,}/g, ' ').match(/[a-z']+/g) || []);
const jac = (a, b) => { let n = 0; for (const x of a) if (b.has(x)) n++; return n / (a.size + b.size - n || 1); };
const REF = [], T0 = JSON.parse(fs.readFileSync('toeic.json', 'utf8'));
for (const q of T0.p5 || []) REF.push(['kho ' + q.id, q.s]);
const walk = (v, tag) => { if (!v) return; if (typeof v === 'string') { if (/-{5,}/.test(v) && v.length < 260) REF.push([tag, v]); return; } if (typeof v === 'object') for (const k in v) walk(v[k], tag); };
for (const f of fs.existsSync('toeic-tron') ? fs.readdirSync('toeic-tron') : []) walk(JSON.parse(fs.readFileSync('toeic-tron/' + f, 'utf8')), f);
for (const f of ['content/ref/ets/out'].filter(d => fs.existsSync(d)).flatMap(d => fs.readdirSync(d).map(x => d + '/' + x))) { try { walk(JSON.parse(fs.readFileSync(f, 'utf8')), 'ETS ' + f); } catch (e) {} }
for (const [f, tag] of [['pho.json', 'phố loại từ'], ['cau.json', 'phố cầu nối']]) if (fs.existsSync(f)) for (const x of JSON.parse(fs.readFileSync(f, 'utf8')).items || []) REF.push([tag + ' ' + x.id, x.s]);
const RW = REF.map(([t, s]) => [t, words(s)]);
const esc = s => String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const ids = new Set(), seen = [];
for (const it of L) {
  const bad = m => err.push(`${it.id || '?'}: ${m}`);
  if (!/^dt-\d{3}$/.test(it.id || '')) bad('id phải dạng dt-001'); if (ids.has(it.id)) bad('trùng id'); ids.add(it.id);
  const s = String(it.s || ''); if ((s.match(/___/g) || []).length !== 1) bad('câu phải có đúng một ___');
  const n = s.split(/\s+/).length; if (n > 24) bad(`câu dài ${n} từ (> 24)`);
  if (!Array.isArray(it.o) || it.o.length !== 4) { bad('cần 4 phương án'); continue; }
  if (new Set(it.o.map(o => String(o[0]).toLowerCase())).size !== 4) bad('phương án trùng');
  for (const o of it.o) { if (o.length !== 4 || !o[0] || !TY.includes(o[1]) || !o[2] || !LU[o[3]]) { bad(`phương án sai khuôn: ${JSON.stringify(o)}`); continue; }
    if (LU[o[3]] !== o[1]) bad(`"${o[0]}": luật ${o[3]} thuộc cư dân ${LU[o[3]]}, đang ghi ${o[1]}`);
    const w = String(o[0]).toLowerCase();
    if (/^to /.test(w) && !/^to be /.test(w) && o[3] !== 'to') bad(`"${o[0]}" có "to" đầu: phải là luật to`);
    if (/^\w+ing$/.test(w) && o[1] !== 'I' && !/^(being)$/.test(w)) bad(`"${o[0]}" là V-ing đứng một mình: phải là cư dân I`);
    if (/\b(be|been|being|is|are|was|were)\s+\w+(ed|en|wn|t)\b/.test(w) && !/\b(is|are|was|were|been|be)\s+\w+ing\b/.test(w) && o[1] !== 'B' && !/^(has|have|had) been \w+ing/.test(w)) bad(`"${o[0]}" có be + V3: phải là bị động B`); }
  const A = it.o.find(o => o[0] === it.a); if (!A) { bad('đáp án không có trong phương án'); continue; }
  const wy = String(it.why || '').split(/\s+/).length; if (!it.why || wy > 30) bad(`why trống hoặc dài ${wy} từ (> 30)`);
  if (!new RegExp(`["“]${esc(it.a)}["”]`, 'i').test(it.why || '')) bad('why phải nhắc đáp án trong ngoặc kép');
  const q1 = (String(it.why || '').match(/["“]([^"”]{1,40})["”]/) || [])[1];
  if (!q1 || q1.toLowerCase() === String(it.a).toLowerCase() || !new RegExp(`(^|[^A-Za-z])${esc(q1)}($|[^A-Za-z])`, 'i').test(s.replace('___', ' '))) bad('ngoặc kép đầu tiên của why phải là chữ mốc có nguyên văn trong câu (không phải đáp án)');
  if (!it.vi) bad('thiếu vi');
  const W = words(s);
  for (const [t, R] of RW) { const j = jac(W, R); if (j >= 0.6) { bad(`gần trùng ${t} (${j.toFixed(2)})`); break; } }
  for (const [id, R] of seen) { const j = jac(W, R); if (j >= 0.6) { bad(`gần trùng ${id} (${j.toFixed(2)})`); break; } }
  seen.push([it.id, W]);
}
if (err.length) { console.error('✗ dong.json: ' + err.length + ' lỗi\n' + err.join('\n')); process.exit(1); }
fs.writeFileSync('dong.json', JSON.stringify({ v: 1, items: L.map(({ id, s, a, o, why, vi }) => ({ id, s, a, o, why, vi })) }));
const cnt = f => L.reduce((m, x) => { const k = f(x); m[k] = (m[k] || 0) + 1; return m; }, {});
console.log(`✓ dong.json: ${L.length} câu · cư dân đáp án ${JSON.stringify(cnt(x => x.o.find(o => o[0] === x.a)[1]))} · luật ${JSON.stringify(cnt(x => x.o.find(o => o[0] === x.a)[3]))} · so với ${REF.length} câu đề`);
