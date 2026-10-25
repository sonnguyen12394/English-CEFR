// Dựng dữ liệu 5 phần (25/10/2026, người sáng lập: "tự làm hết"): np.json (🧱 Ngữ pháp), doc.json (📰 Đọc), nghe.json (🎧 Nghe), noi.json (🗣 Nói), viet.json (✍️ Viết).
// Nguồn: game English Ladder (app.js: GRAMMAR, STASKS, WTASKS, STK_K; data/rd-A1, rd-A2) + content/viet-k.json (từ khoá ý đề viết, AI soạn).
// Tách nội dung để các phần không lẫn: Đọc và Nghe dùng bài khác nhau; mỗi phần giữ riêng câu / bài cho Thi chuyển cấp (chưa gặp khi học).
// Chạy: node tools/build-skills.mjs ../sonnguyen12394.github.io
import fs from 'node:fs';
import { RP_A2 } from './rp-a2.mjs';
const G = process.argv[2] || '../sonnguyen12394.github.io', src = fs.readFileSync(G + '/app.js', 'utf8');
const objAt = (name) => { const i = src.indexOf(`const ${name} = `); let j = i + `const ${name} = `.length, d = 0; const open = src[j], close = open === '{' ? '}' : ']';
  for (let k = j; k < src.length; k++) { if (src[k] === open) d++; else if (src[k] === close && !--d) return Function('return ' + src.slice(j, k + 1))(); } };
const tagged = (tag) => { const a = src.indexOf(`/*<${tag}>*/const ${tag} = `), b = src.indexOf(`/*</${tag}>*/`, a); return JSON.parse(src.slice(a + `/*<${tag}>*/const ${tag} = `.length, b).trim().replace(/;$/, '')); };
const rdFile = lv => fs.readdirSync(G + '/data').find(f => f.startsWith('rd-' + lv + '.'));
const rd = lv => JSON.parse(fs.readFileSync(G + '/data/' + rdFile(lv), 'utf8'));
const out = (f, o) => { fs.writeFileSync(f, JSON.stringify(o)); console.log(f, Object.entries(o).map(([k, v]) => Array.isArray(v) ? `${k} ${v.length}` : '').join(' ')); };

// ---------- 🧱 Ngữ pháp: A1 tách Pre-A1 (15 điểm theo Cambridge Starters: to be, đại từ, a/an, số nhiều, this/that, have got, there is,
// hiện tại đơn khẳng định / phủ định / câu hỏi, Wh-, can, mệnh lệnh, giới từ nơi chốn, hiện tại tiếp diễn, like + V-ing; soát 25/10/2026) ----------
const GR = objAt('GRAMMAR'), PRE = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '11', '12', '13', '14', '20', '21'].map(n => 'g-a1-' + n);
const split = a => ({ learn: a.slice(0, -1), test: a.slice(-1) });
const np = [];
for (const L of GR.levels.filter(l => l.id === 'A1' || l.id === 'A2')) for (const p of L.points)
  np.push({ id: p.id, lv: L.id === 'A2' ? 'a2' : PRE.includes(p.id) ? 'pre' : 'a1', title: p.vi, en: p.title, form: p.form, use: p.use, note: p.note, ex: p.ex,
    mc: split(p.mc), ty: split(p.ty), fx: split(p.fx) });
np.sort((a, b) => ['pre', 'a1', 'a2'].indexOf(a.lv) - ['pre', 'a1', 'a2'].indexOf(b.lv));
out('np.json', { items: np });

// ---------- 📰 Đọc / 🎧 Nghe: mỗi cấp 24 bài học + 8 bài thi, lấy từ các unit khác nhau, bài khác nhau ----------
const pick = (R, lv, sel) => Object.entries(R).filter(([u]) => sel(+u.split('-u')[1])).map(([u, rs]) => ({ u, r: rs }));
function skill(kind) { const items = [];
  for (const L of ['A1', 'A2']) { const R = rd(L), lv = L.toLowerCase();
    const mk = (u, r, test) => ({ id: `${kind}-${u}`, lv, test: test || undefined, title: r.title, tvi: r.tvi, text: r.text, vi: r.vi, qs: r.qs.map(q => ({ q: q.q, a: q.a, w: q.w, why: q.why })) });
    const ri = kind === 'doc' ? 0 : 1;   // Đọc: bài thứ nhất của unit; Nghe: bài thứ hai (không trùng)
    pick(R, lv, n => n % 3 === (kind === 'doc' ? 1 : 0)).slice(0, 24).forEach(({ u, r }) => items.push(mk(u, r[ri])));
    pick(R, lv, n => n % 3 === 2).slice(kind === 'doc' ? 0 : 8, kind === 'doc' ? 8 : 16).forEach(({ u, r }) => items.push(mk(u, r[ri], 1))); }
  return items; }
// 📰 Đọc A2 thêm 8 bài dài 150–250 từ (content/doc-a2long.json, gần độ dài A2 Key); 🎧 Nghe thêm 20 hội thoại 2 giọng (content/nghe-dlg.json:
// số, giờ, giá, đánh vần như đề Cambridge). Soát 25/10/2026: bài đọc A2 cũ chỉ ~82 từ; bài nghe cũ là bài đọc một giọng.
const ext = f => JSON.parse(fs.readFileSync(f, 'utf8')).items;
out('doc.json', { items: [...skill('doc'), ...ext('content/doc-a2long.json')] });
out('nghe.json', { items: [...skill('nghe'), ...ext('content/nghe-dlg.json').map(x => ({ ...x, text: x.lines.map(l => l[1]).join(' '), vi: '' }))] });

// ---------- 🗣 Nói: 8 đề / cấp (STASKS + từ khoá ý STK_K); câu đọc to cho Thi: câu từ bài thứ tư của unit (không dùng ở phần khác) ----------
const kStart = src.indexOf('const KWA = {'), kEnd = src.indexOf('};', src.indexOf('const STK_K = {')) + 2;
const STK = Function(src.slice(kStart, kEnd) + '; return STK_K')();
const sents = L => { const R = rd(L), o = []; for (const rs of Object.values(R)) for (const t of (rs[3] ? rs[3].text : '').split(/(?<=[.!?])\s+/)) { const n = t.split(/\s+/).length; if (n >= 5 && n <= 11 && !/["“”:\n]/.test(t)) o.push(t.trim()); } return o.slice(0, 60); };
// 💬 Đóng vai giao tiếp (soát 25/10/2026: Can-do A1 / A2 cốt lõi là gọi món, mua bán, taxi, hỏi lại, hỏi đường…): A1 = 6 khuôn RPG của game,
// A2 = 6 khuôn tools/rp-a2.mjs. Mỗi khuôn sinh sẵn 6 biến thể (hạt cố định): 4 để học / luyện, 2 giữ cho Thi chuyển cấp.
const rpgSrc = src.slice(src.indexOf('const RPG_W = {'), src.indexOf('const RPG = {'));
const RPG = Function(rpgSrc + '; return ' + src.slice(src.indexOf('const RPG = {') + 'const RPG = '.length, (() => { let i = src.indexOf('const RPG = {') + 'const RPG = '.length, d = 0; for (let k = i; ; k++) { if (src[k] === '{') d++; else if (src[k] === '}' && !--d) return k + 1; } })()))();
const rng = seed => { let a = seed >>> 0; const f = () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  return { pick: a => a[Math.floor(f() * a.length)], int: (x, y) => x + Math.floor(f() * (y - x + 1)) }; };
const rpItems = (T, lv) => Object.entries(T).map(([k, v]) => { const vs = []; const seen = new Set();
  for (let s = 1; vs.length < 6 && s < 200; s++) { const st = v.make(rng(s * 7919 + k.length)), key = JSON.stringify(st); if (!seen.has(key)) { seen.add(key); vs.push(st.map(x => x.s ? { s: x.s, t: x.t } : { vi: x.vi, t: x.t, need: x.need })); } }
  return { id: `rp-${lv}-${k}`, lv, type: 'rp', vi: v.vi, ic: v.ic, en: 'Role play', learn: vs.slice(0, 4), tests: vs.slice(4) }; });
const RP = [...rpItems(RPG, 'a1'), ...rpItems(RP_A2, 'a2')];
out('noi.json', { items: [...RP, ...tagged('STASKS').filter(x => x.lv === 'A1' || x.lv === 'A2').map(x => ({ id: x.id, lv: x.lv.toLowerCase(), en: x.en, vi: x.vi, p: x.p, pv: x.pv, c: x.c, u: x.u, m: x.m, k: STK[x.id] }))],
  test: { a1: sents('A1'), a2: sents('A2') } });

// ---------- ✍️ Viết: 8 đề / cấp (WTASKS) + từ khoá ý content/viet-k.json ----------
const VK = JSON.parse(fs.readFileSync('content/viet-k.json', 'utf8'));
// Độ dài A2 theo A2 Key (soát 25/10/2026): email / tin nhắn ≥ 25 từ, bài còn lại (truyện, đoạn văn, nhật ký) ≥ 35 từ; game để 50.
const minOf = x => x.lv !== 'A2' ? x.min : /email|tin nhắn/.test(x.genre) ? 25 : 35;
const vt = tagged('WTASKS').filter(x => x.lv === 'A1' || x.lv === 'A2').map(x => ({ id: x.id, lv: x.lv.toLowerCase(), en: x.en, vi: x.vi, genre: x.genre, min: minOf(x), max: x.max, p: x.p, pv: x.pv, c: x.c, u: x.u, m: x.m, k: VK[x.id] }));
for (const x of vt) if (!x.k || x.k.length !== x.c.length) throw new Error('thiếu / lệch từ khoá: ' + x.id);
out('viet.json', { items: vt });
