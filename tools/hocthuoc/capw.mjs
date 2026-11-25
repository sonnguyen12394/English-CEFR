// v218: cấp CEFR của từng từ trong các bài học thuộc → bai/capw.js (CAPW = { từ: 0 Pre-A1 · 1 A1 · 2 A2 · 3 B1 · 4 B2 · 5 C1 · 6 C2 }).
// Chạy: node tools/hocthuoc/capw.mjs <thư mục bài> <tệp ra>. Cấp lấy từ từ điển app (a1 / a2 / b.json, cấp "+" về cấp gốc);
// dạng biến đổi tìm về gốc: bất quy tắc (content/irr.json), -s / -es / -ies, -ed / -ied, -ing, -er / -est, -ly, -'s, từ viết tắt (we're → we).
// Từ không có trong từ điển (tên riêng, từ lạ) không ghi: trang coi là phải nói (không tự bỏ qua). Số luôn phải nói.
import fs from 'node:fs'; import vm from 'node:vm';
const DIR = process.argv[2], OUT = process.argv[3];
const LV = { pre: 0, a1: 1, a2: 2, a2p: 2, b1: 3, b1p: 3, b2: 4, b2p: 4, c1: 5, c2: 6 };
const D = {}; const add = (w, l) => { w = String(w).toLowerCase(); if (!/^[a-z][a-z'-]*$/.test(w)) return; if (D[w] == null || l < D[w]) D[w] = l; };
for (const f of ['a1.json', 'a2.json', 'b.json']) for (const u of JSON.parse(fs.readFileSync(f)).units) for (const w of u.words || []) add(w.w, LV[u.lv] ?? 4);
const IRR = {}; for (const [k, v] of Object.entries(JSON.parse(fs.readFileSync('content/irr.json')).w)) for (const [, fs2] of v.f) for (const x of fs2) IRR[x] = IRR[x] || k;
const BE = { am: 'be', is: 'be', are: 'be', was: 'be', were: 'be', been: 'be', being: 'be', has: 'have', had: 'have', does: 'do', did: 'do', i: 'i', me: 'i', my: 'i', us: 'we', our: 'we', him: 'he', his: 'he', them: 'they', their: 'they' };
const C = s => D[s] != null ? D[s] : null;
function lv(w) { w = w.toLowerCase().replace(/[’‘]/g, "'").replace(/^[^a-z]+|[^a-z]+$/g, ''); if (!w) return null;
  if (C(w) != null) return C(w);
  const b = w.replace(/'(s|re|m|ll|ve|d)$/, '').replace(/n't$/, ''); if (b !== w) { if (b === 'ca' || b === 'wo') return 0; const r = lv(b); if (r != null) return r; }
  for (const k of [BE[w], IRR[w]]) if (k && C(k) != null) return C(k);
  const tries = [];
  if (w.endsWith('ies')) tries.push(w.slice(0, -3) + 'y'); if (w.endsWith('es')) tries.push(w.slice(0, -2)); if (w.endsWith('s')) tries.push(w.slice(0, -1));
  if (w.endsWith('ied')) tries.push(w.slice(0, -3) + 'y'); if (w.endsWith('ed')) tries.push(w.slice(0, -2), w.slice(0, -1), w.slice(0, -3));
  if (w.endsWith('ing')) tries.push(w.slice(0, -3), w.slice(0, -3) + 'e', w.slice(0, -4));
  if (w.endsWith('ier')) tries.push(w.slice(0, -3) + 'y'); if (w.endsWith('er')) tries.push(w.slice(0, -2), w.slice(0, -1), w.slice(0, -3));
  if (w.endsWith('iest')) tries.push(w.slice(0, -4) + 'y'); if (w.endsWith('est')) tries.push(w.slice(0, -3), w.slice(0, -2), w.slice(0, -4));
  if (w.endsWith('ily')) tries.push(w.slice(0, -3) + 'y'); if (w.endsWith('ply') || w.endsWith('bly')) tries.push(w.slice(0, -1) + 'e'); if (w.endsWith('ly')) tries.push(w.slice(0, -2));
  if (w.endsWith('ves')) tries.push(w.slice(0, -3) + 'f', w.slice(0, -3) + 'fe');
  for (const t of tries) { const r = C(t) ?? (IRR[t] && C(IRR[t])); if (r != null) return r; }
  if (w.includes('-')) { const ps = w.split('-').map(lv); if (ps.every(x => x != null)) return Math.max(...ps); }
  // chính tả Mỹ → Anh của từ điển (color → colour, neighbor → neighbour, center → centre, traveler → traveller…)
  for (const u of [w.replace(/or(s?)$/, 'our$1').replace(/or(ed|ing|ite|hood)/, 'our$1'), w.replace(/er(s?)$/, 're$1'), w.replace(/eler/, 'eller'), w.replace(/eled$/, 'elled')]) if (u !== w && C(u) != null) return C(u);
  if (US[w] != null) return US[w];
  // từ ghép không gạch: homemade = home + made, sunset = sun + set
  let best = null; for (let i = 3; i <= w.length - 3; i++) { const a = lv(w.slice(0, i)), b = a != null ? lv(w.slice(i)) : null; if (a != null && b != null) { const m = Math.max(a, b); if (best == null || m < best) best = m; } }
  return best; }
// từ Mỹ / khẩu ngữ không có trong từ điển: cấp tay (ý kiến của Claude)
const US = { mom: 0, moms: 0, math: 1, trash: 2, elevator: 2, okay: 0, ok: 0, gonna: 1, wanna: 1, gotta: 1, kinda: 2, yep: 0, nope: 0, yeah: 0, nah: 1, haha: 0, oops: 1, congrats: 2,
  'a.m': 1, 'p.m': 1, am: 0, pm: 1, 'e-mail': 1, 'e-mails': 1, 'wi-fi': 2, sis: 1, mr: 0, mrs: 0, ms: 0, dr: 1, fc: 3, hr: 3 };
const out = {}, LOW = new Set(), NAME = new Set(); let n = 0, miss = {};
for (const f of fs.readdirSync(DIR).filter(f => /^bai\d+\.js$/.test(f))) { const m = f.match(/\d+/)[0], c = { WHO: {} }; vm.createContext(c);
  try { vm.runInContext(fs.readFileSync(`${DIR}/${f}`, 'utf8') + `;this.B=BAI${m}`, c); } catch (e) { continue; }
  for (const l of c.B?.L || []) { let st0 = true; for (const w of String(l[1]).split(/\s+/)) { const atStart = st0; st0 = /[.!?:"”]$/.test(w); const raw = w.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[’‘]/g, "'").replace(/^[^A-Za-z0-9]+|[^A-Za-z0-9]+$/g, ''), k = raw.toLowerCase(); if (!k || /\d/.test(k)) continue;
    if (/[a-z]/.test(raw[0])) LOW.add(k); else if (!atStart) NAME.add(k); if (k in out || k in miss) continue;
    const r = lv(k); n++; if (r != null) out[k] = r; else miss[k] = 1; } } }
// Không có trong từ điển: tên riêng (viết hoa ở giữa câu) thì không ghi = phải nói; còn lại (từ hiếm, địa chỉ e-mail / web) coi như C1.
for (const k of Object.keys(miss)) if (LOW.has(k) || /[@.]/.test(k) || !NAME.has(k)) { out[k] = 5; delete miss[k]; }
fs.writeFileSync(OUT, 'const CAPW = ' + JSON.stringify(out) + ';\n');
console.log('capw:', Object.keys(out).length, 'từ có cấp ·', Object.keys(miss).length, 'từ không có trong từ điển');
if (process.env.CAPW_MISS) console.log(Object.keys(miss).join(' '));
