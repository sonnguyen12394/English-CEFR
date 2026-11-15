// 🏘 Phố Loại Từ (specs/019-pho-loai-tu): kiểm + dựng content/toeic/pho.json → pho.json (gốc). Không sửa tay pho.json.
// Chạy: node tools/build-pho.mjs   (lỗi thì dừng, in danh sách)
import fs from 'fs';
const SRC = JSON.parse(fs.readFileSync('content/toeic/pho.json', 'utf8')), L = SRC.items || [], err = [];
const GHE = ['mao', 'chu', 'gioi', 'truocN', 'sauBe', 'sauV', 'truocA', 'modal', 'thi'], NHA = ['nguoi', 'vdang', 'edng', 'so'], POS = ['N', 'V', 'A', 'R'];
const words = s => new Set(String(s).toLowerCase().replace(/<[^>]+>/g, ' ').replace(/-{3,}|_{3,}/g, ' ').match(/[a-z']+/g) || []);
const jac = (a, b) => { let n = 0; for (const x of a) if (b.has(x)) n++; return n / (a.size + b.size - n || 1); };
// câu Part 5 của kho luyện + mọi đề trọn có trên máy (đề riêng 9–16 chỉ có ở content/ref, bỏ qua nếu không có)
const REF = [];
const T = JSON.parse(fs.readFileSync('toeic.json', 'utf8'));
for (const q of T.p5 || []) REF.push(['kho ' + q.id, q.s]);
const walk = (v, tag) => { if (!v) return; if (typeof v === 'string') { if (/-{5,}/.test(v) && v.length < 260) REF.push([tag, v]); return; } if (typeof v === 'object') for (const k in v) walk(v[k], tag); };
for (const f of fs.existsSync('toeic-tron') ? fs.readdirSync('toeic-tron') : []) walk(JSON.parse(fs.readFileSync('toeic-tron/' + f, 'utf8')), f);
for (const f of ['content/ref/ets/out'].filter(d => fs.existsSync(d)).flatMap(d => fs.readdirSync(d).map(x => d + '/' + x))) { try { walk(JSON.parse(fs.readFileSync(f, 'utf8')), 'ETS ' + f); } catch (e) {} }
const RW = REF.map(([t, s]) => [t, words(s)]);
const ids = new Set(), seen = [];
for (const it of L) {
  const bad = m => err.push(`${it.id || '?'}: ${m}`);
  if (!/^pl-\d{3}$/.test(it.id || '')) bad('id phải dạng pl-001'); if (ids.has(it.id)) bad('trùng id'); ids.add(it.id);
  if ((String(it.s).match(/___/g) || []).length !== 1) bad('câu phải có đúng một ___');
  const n = String(it.s).split(/\s+/).length; if (n > 22) bad(`câu dài ${n} từ (> 22)`);
  if (!Array.isArray(it.o) || it.o.length !== 4) { bad('cần 4 phương án'); continue; }
  const ws = it.o.map(o => o[0]); if (new Set(ws.map(w => w.toLowerCase())).size !== 4) bad('phương án trùng');
  for (const o of it.o) { if (o.length !== 3 || !o[0] || !POS.includes(o[1]) || !o[2]) bad(`phương án sai khuôn: ${JSON.stringify(o)}`); }
  const A = it.o.find(o => o[0] === it.a); if (!A) { bad('đáp án không có trong phương án'); continue; }
  if (!GHE.includes(it.ghe)) bad('ghe lạ: ' + it.ghe);
  const same = it.o.filter(o => o !== A && o[1] === A[1]).length;
  if (same && !NHA.includes(it.nha)) bad('có phương án cùng loại với đáp án nên cần nha');
  if (!same && it.nha) bad('nha chỉ dùng khi có phương án cùng loại với đáp án');
  const wy = String(it.why || '').split(/\s+/).length; if (!it.why || wy > 25) bad(`why trống hoặc dài ${wy} từ (> 25)`);
  if (!it.vi) bad('thiếu vi');
  const W = words(it.s);
  for (const [t, R] of RW) { const j = jac(W, R); if (j >= 0.6) { bad(`gần trùng ${t} (${j.toFixed(2)})`); break; } }
  for (const [id, R] of seen) { const j = jac(W, R); if (j >= 0.6) { bad(`gần trùng ${id} (${j.toFixed(2)})`); break; } }
  seen.push([it.id, W]);
}
if (err.length) { console.error('✗ pho.json: ' + err.length + ' lỗi\n' + err.join('\n')); process.exit(1); }
const out = { v: 1, items: L.map(({ id, s, a, o, ghe, nha, why, vi }) => ({ id, s, a, o, ghe, nha, why, vi })) };
fs.writeFileSync('pho.json', JSON.stringify(out));
const by = k => L.reduce((m, x) => (m[x[k] || '-'] = (m[x[k] || '-'] || 0) + 1, m), {});
console.log(`✓ pho.json: ${L.length} câu · đáp án ${JSON.stringify(L.reduce((m, x) => { const p = x.o.find(o => o[0] === x.a)[1]; m[p] = (m[p] || 0) + 1; return m; }, {}))} · ghế ${JSON.stringify(by('ghe'))} · cùng nhà ${JSON.stringify(by('nha'))} · so với ${REF.length} câu đề`);
