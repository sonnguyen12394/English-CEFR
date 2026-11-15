// 🧩 Phố Ghép Đoạn (Thành phố TOEIC, v193): kiểm + dựng content/toeic/ghep.json → ghep.json (gốc). Không sửa tay ghep.json.
// Chạy: node tools/build-ghep.mjs   (lỗi thì dừng, in danh sách)
import fs from 'fs';
const SRC = JSON.parse(fs.readFileSync('content/toeic/ghep.json', 'utf8')), L = SRC.items || [], err = [];
const words = s => new Set(String(s).toLowerCase().match(/[a-z']+/g) || []);
const jac = (a, b) => { let n = 0; for (const x of a) if (b.has(x)) n++; return n / (a.size + b.size - n || 1); };
const norm = s => String(s || '').toLowerCase().replace(/[“”"’']/g, "'").replace(/\s+/g, ' ').trim();
const REF = [];
const walk = (v, tag) => { if (!v || typeof v !== 'object') return; if (Array.isArray(v)) return v.forEach(x => walk(x, tag)); if (typeof v.text === 'string' && v.text.length > 120) REF.push([tag, v.text]); for (const k in v) walk(v[k], tag); };
const T0 = JSON.parse(fs.readFileSync('toeic.json', 'utf8')); walk(T0.p6, 'kho p6'); walk(T0.p7, 'kho p7');
for (const f of fs.existsSync('toeic-tron') ? fs.readdirSync('toeic-tron') : []) walk(JSON.parse(fs.readFileSync('toeic-tron/' + f, 'utf8')), f);
for (const f of ['content/ref/ets/out'].filter(d => fs.existsSync(d)).flatMap(d => fs.readdirSync(d).map(x => d + '/' + x))) { try { walk(JSON.parse(fs.readFileSync(f, 'utf8')), 'ETS ' + f); } catch (e) {} }
if (fs.existsSync('ben.json')) for (const x of JSON.parse(fs.readFileSync('ben.json', 'utf8')).items || []) REF.push(['bến ' + x.id, x.t]);
const RW = REF.map(([t, s]) => [t, words(s)]);
const ids = new Set(), seen = [];
for (const it of L) {
  const bad = m => err.push(`${it.id || '?'}: ${m}`);
  if (!/^gd-\d{3}$/.test(it.id || '')) bad('id phải dạng gd-001'); if (ids.has(it.id)) bad('trùng id'); ids.add(it.id);
  if (!it.kind) bad('thiếu kind');
  if (!Array.isArray(it.s) || it.s.length < 5 || it.s.length > 7) { bad('s cần 5–7 câu'); continue; }
  if (it.s.some(x => !/[.!?]["”]?$/.test(String(x).trim()))) bad('mỗi câu phải kết thúc bằng . ! ?');
  const n = it.s.join(' ').split(/\s+/).length; if (n < 45 || n > 110) bad(`đoạn ${n} từ (cần 45–110)`);
  if (!Number.isInteger(it.k) || it.k < 1 || it.k >= it.s.length) bad('k phải từ 1 tới n-1');
  const S = String(it.s[it.k] || ''); if (!it.lk || !S.includes(it.lk)) bad('lk phải có nguyên văn trong s[k]');
  if (!it.why || String(it.why).split(/\s+/).length > 45) bad('why trống hoặc quá dài'); if (!it.vi) bad('thiếu vi');
  if (!Array.isArray(it.w) || it.w.length !== 3 || it.w.some(x => !/[.!?]$/.test(String(x).trim()))) bad('w cần 3 câu sai, kết thúc bằng dấu câu');
  else if (new Set([S, ...it.w].map(norm)).size !== 4 || it.w.some(x => it.s.map(norm).includes(norm(x)))) bad('câu sai trùng câu đúng / câu trong đoạn');
  const W = words(it.s.join(' '));
  for (const [tg, R] of RW) { const j = jac(W, R); if (j >= 0.5) { bad(`đoạn gần trùng ${tg} (${j.toFixed(2)})`); break; } }
  for (const [id, R] of seen) { const j = jac(W, R); if (j >= 0.5) { bad(`đoạn gần trùng ${id} (${j.toFixed(2)})`); break; } }
  seen.push([it.id, W]);
}
if (err.length) { console.error('✗ ghep.json: ' + err.length + ' lỗi\n' + err.join('\n')); process.exit(1); }
fs.writeFileSync('ghep.json', JSON.stringify({ v: 1, items: L.map(({ id, kind, s, k, lk, why, w, vi }) => ({ id, kind, s, k, lk, why, w, vi })) }));
console.log(`✓ ghep.json: ${L.length} đoạn · vị trí câu chèn ${JSON.stringify(L.reduce((m, x) => (m[x.k] = (m[x.k] || 0) + 1, m), {}))} · so với ${REF.length} văn bản`);
