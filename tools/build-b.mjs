// Dựng khoá B1 → C2 (người sáng lập 27/10/2026: "làm hết tới C2"): b.json (bài học) + exam-b.json (câu thi) từ ref.json (3.463 từ đã có cấp Oxford / CEFR-J / Octanove).
// Mỗi cấp xếp từ thông dụng trước (content/ref/zipf.json), 8 từ / bài, 10 bài / chặng. Bỏ từ đã có trong khoá Pre-A1 → A2+.
// Câu điền (cloze) tự tách từ câu ví dụ; cụm từ, câu thi, dữ liệu yêu cầu B1 → C2 lấy ở content/b-*.json (Claude soạn, chưa người thật kiểm).
// Chạy: node tools/build-b.mjs
import fs from 'node:fs';
const root = new URL('..', import.meta.url).pathname, J = f => JSON.parse(fs.readFileSync(root + f, 'utf8')), opt = f => fs.existsSync(root + f) ? J(f) : {};
const REF = J('ref.json').words, Z = J('content/ref/zipf.json'), LVS = ['b1', 'b1p', 'b2', 'b2p', 'c1', 'c2'], LVN = { b1: 'B1', b1p: 'B1+', b2: 'B2', b2p: 'B2+', c1: 'C1', c2: 'C2' };
const have = new Set(['a1.json', 'a2.json'].flatMap(f => J(f).units.flatMap(u => u.words.map(w => w.w.toLowerCase()))));
// content/bx/*.txt: mỗi dòng id|câu thi|dạng từ trong câu|cụm đúng|cụm sai 1|cụm sai 2 (Claude soạn 27/10/2026, chưa người thật kiểm)
const COL = {}, EX = {}, DATA = opt('content/b-data.json');
for (const f of fs.readdirSync(root + 'content/bx').filter(f => f.endsWith('.txt')).sort((a, b) => a.startsWith('fix') - b.startsWith('fix') || a.localeCompare(b))) for (const l of fs.readFileSync(root + 'content/bx/' + f, 'utf8').split('\n').filter(Boolean)) {
  const [id, s, fm, ok, b1, b2] = l.split('|'); EX[id] = [s, fm]; if (ok && b1 && b2) COL[id] = { ok, bad: [b1, b2] }; }
// fix-*.txt (đọc sau, ghi đè câu thi): câu thi trùng câu ví dụ trên thẻ được viết lại (thi phải là câu chưa gặp)
const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
// câu điền từ câu ví dụ: tìm dạng của từ trong câu (đuôi -s, -ed, -ing, -er…); cụm nhiều chữ thì tìm nguyên cụm
function cloze(w) { const x = w.w, L = "(?<![A-Za-zÀ-ÿ'])", R = '(?![A-Za-zÀ-ÿ])', re = x.includes(' ') ? new RegExp(`${L}(${esc(x)}(?:s|es)?)${R}`, 'i') : new RegExp(`${L}(${esc(x.length > 4 && /e$/.test(x) ? x.slice(0, -1) : x)}[a-z]{0,4})${R}`, 'i');
  const m = w.ex.match(re); if (!m) return undefined; return { s: w.ex.replace(m[0], '___'), a: m[1], w: [] }; }
// content/bd/*.txt: dữ liệu yêu cầu Nhớ B1 → C2 theo từ (Claude soạn 27/10/2026, chưa người thật kiểm)
// S|từ|đồng nghĩa|trái nghĩa → rel · R|từ|cặp|F/I|nghĩa → reg · P|từ|câu ___|đáp án|sai|mẫu → pat
const BD = {}, bdUsed = new Set(), split = x => (x || '').split(',').map(y => y.trim()).filter(Boolean);
for (const f of fs.readdirSync(root + 'content/bd').filter(f => f.endsWith('.txt')).sort()) for (const l of fs.readFileSync(root + 'content/bd/' + f, 'utf8').split('\n')) {
  if (!l || l.startsWith('#')) continue; const [t, w, a, b, c, d] = l.split('|'), k = w.toLowerCase(), o = BD[k] ||= {};
  if (t === 'S') o.rel = { syn: split(a), ant: split(b) };
  else if (t === 'R') o.reg = { p: a, f: b === 'F', ...(c ? { vi: c } : {}) };
  else if (t === 'P') o.pat = { s: a, a: b, w: split(c), m: d }; }
const units = [], exam = {};
for (const lv of LVS) {
  const ws = REF.filter(w => w.lv === lv && !have.has(w.w.toLowerCase())).sort((a, b) => (Z[b.w] ?? 0) - (Z[a.w] ?? 0) || a.w.localeCompare(b.w));
  for (let i = 0; i * 8 < ws.length; i++) { const ch = Math.floor(i / 10), bi = i % 10 + 1;
    units.push({ id: `${lv}-c${ch + 1}-b${bi}`, lv, ch, chIcon: '📘', chName: `${LVN[lv]} chặng ${ch + 1}`, bi, vi: `${LVN[lv]} chặng ${ch + 1} · bài ${bi}`,
      words: ws.slice(i * 8, i * 8 + 8).map(r => { const w = { id: r.id, w: r.w, pos: r.pos, ipa: r.ipa, pic: '', vi: r.vi, en: '', ex: r.ex, exVi: r.exVi };
        const c = cloze(w); if (c) w.cloze = c; if (COL[r.id]) w.col = COL[r.id]; Object.assign(w, BD[r.w.toLowerCase()] || {}, DATA[r.id] || {}); if (BD[r.w.toLowerCase()]) bdUsed.add(r.w.toLowerCase());
        if (EX[r.id]) exam[r.id] = { s: EX[r.id][0], f: EX[r.id][1] }; return w; }) }); }
}
// 🌫 thành ngữ: từ loại idiom, câu ví dụ trên thẻ, nghĩa sai lấy từ thành ngữ khác
const IDI = units.flatMap(u => u.words).filter(w => /idiom/.test(w.pos) && w.cloze);
for (const w of IDI) { const o = IDI.filter(y => y !== w && y.vi !== w.vi), pick = []; for (let i = 0; pick.length < 3 && i < o.length; i++) { const y = o[(w.w.length * 7 + i * 13) % o.length]; if (!pick.includes(y.vi)) pick.push(y.vi); }
  w.idi = { p: w.cloze.a, vi: w.vi, s: w.ex, w: pick }; }
const miss = Object.keys(BD).filter(k => !bdUsed.has(k));
fs.writeFileSync(root + 'b.json', JSON.stringify({ units }));
// 🧱 ngữ pháp B1 → C2 (content/bg/*.json, Claude soạn, chưa người thật kiểm): thay các điểm g-b*, g-c* trong np.json
const NP = J('np.json'), G = ['b1', 'b2', 'c1', 'c2'].flatMap(l => J(`content/bg/${l}.json`).items);
NP.items = NP.items.filter(x => !/^g-[bc]\d/.test(x.id)).concat(G); fs.writeFileSync(root + 'np.json', JSON.stringify(NP)); fs.writeFileSync(root + 'exam-b.json', JSON.stringify(exam));
const n = units.reduce((s, u) => s + u.words.length, 0);
console.log(`b.json: ${units.length} bài, ${n} từ · có câu điền ${units.reduce((s, u) => s + u.words.filter(w => w.cloze).length, 0)} · cụm ${Object.keys(COL).length} · câu thi ${Object.keys(exam).length}`);
console.log(`ngữ pháp B1 → C2: ${G.length} điểm`); const ws = units.flatMap(u => u.words); console.log(`dữ liệu Nhớ: đồng nghĩa ${ws.filter(w => w.rel).length} · trang trọng ${ws.filter(w => w.reg).length} · mẫu câu ${ws.filter(w => w.pat).length} · thành ngữ ${ws.filter(w => w.idi).length}${miss.length ? ` · không khớp từ nào: ${miss.join(', ')}` : ''}`);
for (const lv of LVS) console.log(' ', LVN[lv], units.filter(u => u.lv === lv).length, 'bài');
