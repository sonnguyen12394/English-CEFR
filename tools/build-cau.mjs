// 🌉 Phố Cầu Nối (specs/020-thanh-pho-toeic): kiểm + dựng content/toeic/cau.json → cau.json (gốc). Không sửa tay cau.json.
// Chạy: node tools/build-cau.mjs   (lỗi thì dừng, in danh sách)
import fs from 'fs';
const SRC = JSON.parse(fs.readFileSync('content/toeic/cau.json', 'utf8')), L = SRC.items || [], err = [];
const TY = ['G', 'L', 'T'], QH = ['them', 'doi', 'vi', 'kq', 'tg', 'dk', 'md', 'vt'];
// loại chắc chắn của từ nối hay gặp (từ hai loại như since / before / after / until / as / by / for thì không kiểm)
const LEX = { G: ['because of', 'due to', 'owing to', 'despite', 'in spite of', 'during', 'as well as', 'according to', 'instead of', 'prior to', 'in addition to', 'regardless of', 'thanks to', 'without', 'except for', 'among', 'throughout', 'in case of', 'on account of', 'along with', 'apart from', 'in terms of'],
  L: ['because', 'although', 'even though', 'though', 'whereas', 'unless', 'so that', 'while', 'once', 'as soon as', 'if', 'provided that', 'as long as', 'even if', 'in case', 'now that', 'whether', 'whenever', 'wherever'],
  T: ['however', 'therefore', 'moreover', 'furthermore', 'consequently', 'nevertheless', 'nonetheless', 'in addition', 'as a result', 'otherwise', 'meanwhile', 'for example', 'for instance', 'instead', 'likewise', 'similarly', 'thus', 'in contrast', 'on the other hand', 'accordingly', 'hence', 'in fact', 'afterward', 'afterwards'] };
const LT = {}; for (const t of TY) for (const w of LEX[t]) LT[w] = t;
const words = s => new Set(String(s).toLowerCase().replace(/<[^>]+>/g, ' ').replace(/-{3,}|_{3,}/g, ' ').match(/[a-z']+/g) || []);
const jac = (a, b) => { let n = 0; for (const x of a) if (b.has(x)) n++; return n / (a.size + b.size - n || 1); };
const REF = [], T0 = JSON.parse(fs.readFileSync('toeic.json', 'utf8'));
for (const q of T0.p5 || []) REF.push(['kho ' + q.id, q.s]);
const walk = (v, tag) => { if (!v) return; if (typeof v === 'string') { if (/-{5,}/.test(v) && v.length < 260) REF.push([tag, v]); return; } if (typeof v === 'object') for (const k in v) walk(v[k], tag); };
for (const f of fs.existsSync('toeic-tron') ? fs.readdirSync('toeic-tron') : []) walk(JSON.parse(fs.readFileSync('toeic-tron/' + f, 'utf8')), f);
for (const f of ['content/ref/ets/out'].filter(d => fs.existsSync(d)).flatMap(d => fs.readdirSync(d).map(x => d + '/' + x))) { try { walk(JSON.parse(fs.readFileSync(f, 'utf8')), 'ETS ' + f); } catch (e) {} }
if (fs.existsSync('pho.json')) for (const x of JSON.parse(fs.readFileSync('pho.json', 'utf8')).items || []) REF.push(['phố loại từ ' + x.id, x.s]);
const RW = REF.map(([t, s]) => [t, words(s)]);
const ids = new Set(), seen = []; let twin = 0;
for (const it of L) {
  const bad = m => err.push(`${it.id || '?'}: ${m}`);
  if (!/^cn-\d{3}$/.test(it.id || '')) bad('id phải dạng cn-001'); if (ids.has(it.id)) bad('trùng id'); ids.add(it.id);
  const s = String(it.s || ''); if ((s.match(/___/g) || []).length !== 1) bad('câu phải có đúng một ___');
  const n = s.split(/\s+/).length; if (n > 28) bad(`câu dài ${n} từ (> 28)`);
  if (!Array.isArray(it.o) || it.o.length !== 4) { bad('cần 4 phương án'); continue; }
  if (new Set(it.o.map(o => String(o[0]).toLowerCase())).size !== 4) bad('phương án trùng');
  for (const o of it.o) { if (o.length !== 4 || !o[0] || !TY.includes(o[1]) || !o[2] || !QH.includes(o[3])) { bad(`phương án sai khuôn: ${JSON.stringify(o)}`); continue; }
    const lt = LT[String(o[0]).toLowerCase()]; if (lt && lt !== o[1]) bad(`"${o[0]}" phải là ${lt}, đang ghi ${o[1]}`); }
  const A = it.o.find(o => o[0] === it.a); if (!A) { bad('đáp án không có trong phương án'); continue; }
  const after = s.split('___')[1] || '';
  if (A[1] === 'T' && !/(^|[.;]\s+)___,/.test(s)) bad('đáp án trạng từ nối: ô trống phải đầu câu (hoặc sau ; / .) và có dấu phẩy theo sau');
  if (A[1] !== 'T' && /^,/.test(after)) bad('giới từ / liên từ không có dấu phẩy ngay sau ô trống');
  const wy = String(it.why || '').split(/\s+/).length; if (!it.why || wy > 30) bad(`why trống hoặc dài ${wy} từ (> 30)`);
  if (!new RegExp(`["“]${it.a.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}["”]`, 'i').test(it.why || '')) bad('why phải nhắc đáp án trong ngoặc kép');
  if (!it.vi) bad('thiếu vi');
  if (it.o.some(o => o !== A && o[3] === A[3] && o[1] !== A[1])) twin++;
  const W = words(s);
  for (const [t, R] of RW) { const j = jac(W, R); if (j >= 0.6) { bad(`gần trùng ${t} (${j.toFixed(2)})`); break; } }
  for (const [id, R] of seen) { const j = jac(W, R); if (j >= 0.6) { bad(`gần trùng ${id} (${j.toFixed(2)})`); break; } }
  seen.push([it.id, W]);
}
if (err.length) { console.error('✗ cau.json: ' + err.length + ' lỗi\n' + err.join('\n')); process.exit(1); }
fs.writeFileSync('cau.json', JSON.stringify({ v: 1, items: L.map(({ id, s, a, o, why, vi }) => ({ id, s, a, o, why, vi })) }));
const cnt = f => L.reduce((m, x) => { const k = f(x); m[k] = (m[k] || 0) + 1; return m; }, {});
console.log(`✓ cau.json: ${L.length} câu · loại đáp án ${JSON.stringify(cnt(x => x.o.find(o => o[0] === x.a)[1]))} · quan hệ ${JSON.stringify(cnt(x => x.o.find(o => o[0] === x.a)[3]))} · có cặp "cùng nghĩa khác loại" ${twin}/${L.length} · so với ${REF.length} câu đề`);
