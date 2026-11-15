// 🔎 Bến Dò Tin (Thành phố TOEIC, v191): kiểm + dựng content/toeic/ben.json → ben.json (gốc). Không sửa tay ben.json.
// Chạy: node tools/build-ben.mjs   (lỗi thì dừng, in danh sách)
import fs from 'fs';
const SRC = JSON.parse(fs.readFileSync('content/toeic/ben.json', 'utf8')), L = SRC.items || [], err = [];
const TY = ['P', 'C', 'K', 'Y'];
const words = s => new Set(String(s).toLowerCase().match(/[a-z']+/g) || []);
const jac = (a, b) => { let n = 0; for (const x of a) if (b.has(x)) n++; return n / (a.size + b.size - n || 1); };
// cắt câu giống trang (tgSents ở trochoi.js)
const ABBR = /(\b(Mr|Ms|Mrs|Dr|St|No|Inc|Co|Ltd|etc|Jr|Sr|Ave|Rd|vs|a\.m|p\.m|e\.g|i\.e)|\b[A-Z])\.$/;
function sents(text) { const out = []; for (const line of String(text || '').split('\n')) { const re = /[.!?]+(?=\s+["“(A-Z0-9])/g; let st = 0, m;
  while ((m = re.exec(line))) { const end = m.index + m[0].length, s = line.slice(st, end).trim(); if (ABBR.test(s)) continue; if (s) out.push(s); st = end; }
  const rest = line.slice(st).trim(); if (rest) out.push(rest); } return out; }
const norm = s => String(s || '').toLowerCase().replace(/[“”"’']/g, "'").replace(/\s+/g, ' ').trim();
const hit = (sent, ev) => { const a = norm(sent), e = norm(ev); return a.includes(e.slice(0, 25)) || (a.length >= 12 && e.includes(a.replace(/[.!?]+$/, ''))); };
// văn bản Part 7 của đề (so gần trùng)
const REF = [];
const walk = (v, tag) => { if (!v || typeof v !== 'object') return; if (Array.isArray(v)) return v.forEach(x => walk(x, tag)); if (typeof v.text === 'string' && v.text.length > 120) REF.push([tag, v.text]); for (const k in v) walk(v[k], tag); };
walk(JSON.parse(fs.readFileSync('toeic.json', 'utf8')).p7, 'kho p7');
for (const f of fs.existsSync('toeic-tron') ? fs.readdirSync('toeic-tron') : []) walk(JSON.parse(fs.readFileSync('toeic-tron/' + f, 'utf8')), f);
for (const f of ['content/ref/ets/out'].filter(d => fs.existsSync(d)).flatMap(d => fs.readdirSync(d).map(x => d + '/' + x))) { try { walk(JSON.parse(fs.readFileSync(f, 'utf8')), 'ETS ' + f); } catch (e) {} }
const RW = REF.map(([t, s]) => [t, words(s)]);
const ids = new Set(), seen = []; let nq = 0;
for (const it of L) {
  const bad = m => err.push(`${it.id || '?'}: ${m}`);
  if (!/^bt-\d{2,3}$/.test(it.id || '')) bad('id phải dạng bt-01'); if (ids.has(it.id)) bad('trùng id'); ids.add(it.id);
  if (!it.kind) bad('thiếu kind');
  const t = String(it.t || ''), n = t.split(/\s+/).length, S = sents(t); if (n < 50 || n > 140) bad(`văn bản ${n} từ (cần 50–140)`); if (S.length < 4) bad(`văn bản chỉ ${S.length} câu`);
  if (!Array.isArray(it.qs) || it.qs.length < 2 || it.qs.length > 4) { bad('cần 2–4 câu hỏi'); continue; }
  for (const [i, q] of it.qs.entries()) { const b2 = m => bad(`câu ${i + 1}: ${m}`); nq++;
    if (!TY.includes(q.ty)) b2('ty phải P|C|K|Y'); if (!q.q || !q.a || !q.why || !q.vi) b2('thiếu q / a / why / vi');
    if (!Array.isArray(q.w) || q.w.length !== 3) b2('cần 3 phương án sai'); else if (new Set([q.a, ...q.w].map(x => norm(x))).size !== 4) b2('phương án trùng');
    if (String(q.why || '').split(/\s+/).length > 45) b2('why quá dài');
    if (!q.ev || String(q.ev).length < 20) b2('ev ≥ 20 ký tự'); else { const k = S.filter(s => hit(s, q.ev)).length; if (k !== 1) b2(`ev phải khớp đúng MỘT câu của văn bản (đang ${k})`); }
    if (q.ty === 'K' && !/indicated|stated|true|NOT|mentioned/.test(q.q)) b2('câu K phải hỏi indicated / stated / true / NOT');
    if (q.ty === 'Y' && !/suggested|most likely|probably|imply|implied|mean when|infer/.test(q.q)) b2('câu Y phải hỏi suggested / most likely / mean when…');
    if (q.ty === 'P' && !/[Ww]hy|purpose/.test(q.q)) b2('câu P phải hỏi Why / purpose');
    if (norm(t).includes(norm(q.a).replace(/[.!?]+$/, '')) && String(q.a).split(/\s+/).length >= 3) b2('đáp án chép nguyên văn bài'); }
  const W = words(t);
  for (const [tg, R] of RW) { const j = jac(W, R); if (j >= 0.5) { bad(`văn bản gần trùng ${tg} (${j.toFixed(2)})`); break; } }
  for (const [id, R] of seen) { const j = jac(W, R); if (j >= 0.5) { bad(`văn bản gần trùng ${id} (${j.toFixed(2)})`); break; } }
  seen.push([it.id, W]);
}
if (err.length) { console.error('✗ ben.json: ' + err.length + ' lỗi\n' + err.join('\n')); process.exit(1); }
fs.writeFileSync('ben.json', JSON.stringify({ v: 1, items: L.map(({ id, kind, t, qs }) => ({ id, kind, t, qs: qs.map(({ ty, q, a, w, ev, why, vi }) => ({ ty, q, a, w, ev, why, vi })) })) }));
const cnt = {}; for (const it of L) for (const q of it.qs) cnt[q.ty] = (cnt[q.ty] || 0) + 1;
console.log(`✓ ben.json: ${L.length} văn bản · ${nq} câu hỏi · loại ${JSON.stringify(cnt)} · so với ${REF.length} văn bản đề`);
