// Dựng khoá B1 → C2 (người sáng lập 27/10/2026: "làm hết tới C2"): b.json (bài học) + exam-b.json (câu thi) từ ref.json (3.463 từ đã có cấp Oxford / CEFR-J / Octanove).
// Mỗi cấp xếp từ thông dụng trước (content/ref/zipf.json), 8 từ / bài, 10 bài / chặng. Bỏ từ đã có trong khoá Pre-A1 → A2+.
// Câu điền (cloze) tự tách từ câu ví dụ; cụm từ, câu thi, dữ liệu yêu cầu B1 → C2 lấy ở content/b-*.json (Claude soạn, chưa người thật kiểm).
// Chạy: node tools/build-b.mjs
import fs from 'node:fs';
const root = new URL('..', import.meta.url).pathname, J = f => JSON.parse(fs.readFileSync(root + f, 'utf8')), opt = f => fs.existsSync(root + f) ? J(f) : {};
const REF = J('ref.json').words, Z = J('content/ref/zipf.json'), LVS = ['b1', 'b1p', 'b2', 'b2p', 'c1', 'c2'], LVN = { b1: 'B1', b1p: 'B1+', b2: 'B2', b2p: 'B2+', c1: 'C1', c2: 'C2' };
const have = new Set(['a1.json', 'a2.json'].flatMap(f => J(f).units.flatMap(u => u.words.map(w => w.w.toLowerCase()))));
const COL = opt('content/b-col.json'), EX = opt('content/b-exam.json'), DATA = opt('content/b-data.json');
const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
// câu điền từ câu ví dụ: tìm dạng của từ trong câu (đuôi -s, -ed, -ing, -er…); cụm nhiều chữ thì tìm nguyên cụm
function cloze(w) { const x = w.w, re = x.includes(' ') ? new RegExp(`\\b(${esc(x)})\\b`, 'i') : new RegExp(`\\b(${esc(x.length > 4 && /e$/.test(x) ? x.slice(0, -1) : x)}[a-z]{0,4})\\b`, 'i');
  const m = w.ex.match(re); if (!m) return undefined; return { s: w.ex.replace(m[0], '___'), a: m[1], w: [] }; }
const units = [], exam = {};
for (const lv of LVS) {
  const ws = REF.filter(w => w.lv === lv && !have.has(w.w.toLowerCase())).sort((a, b) => (Z[b.w] ?? 0) - (Z[a.w] ?? 0) || a.w.localeCompare(b.w));
  for (let i = 0; i * 8 < ws.length; i++) { const ch = Math.floor(i / 10), bi = i % 10 + 1;
    units.push({ id: `${lv}-c${ch + 1}-b${bi}`, lv, ch, chIcon: '📘', chName: `${LVN[lv]} chặng ${ch + 1}`, bi, vi: `${LVN[lv]} chặng ${ch + 1} · bài ${bi}`,
      words: ws.slice(i * 8, i * 8 + 8).map(r => { const w = { id: r.id, w: r.w, pos: r.pos, ipa: r.ipa, pic: '', vi: r.vi, en: '', ex: r.ex, exVi: r.exVi };
        const c = cloze(w); if (c) w.cloze = c; if (COL[r.id]) w.col = COL[r.id]; Object.assign(w, DATA[r.id] || {});
        if (EX[r.id]) exam[r.id] = { s: EX[r.id][0], f: EX[r.id][1] }; return w; }) }); }
}
fs.writeFileSync(root + 'b.json', JSON.stringify({ units })); fs.writeFileSync(root + 'exam-b.json', JSON.stringify(exam));
const n = units.reduce((s, u) => s + u.words.length, 0);
console.log(`b.json: ${units.length} bài, ${n} từ · có câu điền ${units.reduce((s, u) => s + u.words.filter(w => w.cloze).length, 0)} · cụm ${Object.keys(COL).length} · câu thi ${Object.keys(exam).length}`);
for (const lv of LVS) console.log(' ', LVN[lv], units.filter(u => u.lv === lv).length, 'bài');
