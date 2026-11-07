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
  // ⭐ từ Oxford còn thiếu (content/b-add.json, v65): chặng riêng cuối cấp, không xáo các bài đã có
  const add = (opt('content/b-add.json').words || []).filter(r => r.lv === lv && !have.has(r.w.toLowerCase())), ch0 = Math.ceil(ws.length / 80);
  for (let i = 0; i * 8 < add.length; i++) units.push({ id: `${lv}-ox-b${i + 1}`, lv, ch: ch0, chIcon: '⭐', chName: `${LVN[lv]} bổ sung Oxford`, bi: i + 1, vi: `${LVN[lv]} bổ sung Oxford · bài ${i + 1}`,
    words: add.slice(i * 8, i * 8 + 8).map(r => { const w = { id: r.id, w: r.w, pos: r.pos, ipa: r.ipa, pic: '', vi: r.vi, en: '', ex: r.ex, exVi: r.exVi };
      const c = cloze(w); if (c) w.cloze = c; if (COL[r.id]) w.col = COL[r.id]; Object.assign(w, BD[r.w.toLowerCase()] || {}, DATA[r.id] || {}); if (BD[r.w.toLowerCase()]) bdUsed.add(r.w.toLowerCase());
      if (EX[r.id]) exam[r.id] = { s: EX[r.id][0], f: EX[r.id][1] }; return w; }) });
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
// 📰 Đọc, 🎧 Nghe, 🗣 Nói, ✍️ Viết B1 → C2 (content/bs/*.json, Claude soạn, chưa người thật kiểm): thay các mục cấp B1 → C2
const BL = ['b1', 'b2', 'c1', 'c2'], keep = x => !BL.includes(x.lv);
for (const [f, src] of [['doc.json', BL.map(l => `content/bs/doc-${l}.json`)], ['nghe.json', BL.map(l => `content/bs/nghe-${l}.json`)], ['noi.json', ['content/bs/noi.json']], ['viet.json', ['content/bs/viet.json']]]) {
  const D = J(f), add = src.flatMap(x => J(x).items).map(x => x.lines && !x.text ? { ...x, text: x.lines.map(l => l[1]).join(' '), vi: '' } : x);
  D.items = D.items.filter(keep).concat(add); if (f === 'noi.json') Object.assign(D.test, J('content/bs/noi.json').test);
  // v126 🎧 Cambridge nghe nối người nói (content/bs/nghe-mm.json → nghe.json mm): 5 người nói, mỗi nhiệm vụ 8 ý (3 ý thừa), đáp án 5 chỉ số khác nhau
  // v128 🖼 từ có tranh cho Starters / Movers (content/bs/tranh.json → nghe.json pic): emoji không trùng, câu nghe có từ đó
  if (f === 'nghe.json') { D.pic = J('content/bs/tranh.json').items; const es = new Set(); for (const x of D.pic) { if (!x.w || !x.e || !x.c || !['pre', 'a1'].includes(x.lv) || !x.s || es.has(x.e) || !x.s.toLowerCase().includes(x.w.toLowerCase().replace(/s$/, ''))) throw new Error('từ có tranh hỏng: ' + x.w); es.add(x.e); } }
  // v129 🎓 dạng đề Cambridge còn thiếu (content/bs/dangthi.json → nghe.json dt): mỗi bộ có câu hỏi; câu nghe có lời; chỗ trống khớp số đáp án
  if (f === 'nghe.json') { D.dt = J('content/bs/dangthi.json').sets; const ks = ['line', 'name', 'colour', 'yn', 'box', 'story', 'match5', 'resp', 'mcc', 'pdesc', 'pmc', 'pstory', 'spk', 'photo', 'gpara', 'sn'];   // v132: + khuyết đoạn C1 / C2 · v141: + đọc tin ngắn A2 / B1
    for (const x of D.dt) { const gaps = (x.text || '').match(/\{\d\}/g) || [], bad = !ks.includes(x.k) || !['pre', 'a1', 'a2', 'b1', 'b2', 'c1', 'c2'].includes(x.lv)
      || (['line', 'name', 'colour', 'pmc'].includes(x.k) && x.qs.some(q => !(q.lines || []).length)) || (x.k === 'box' && (gaps.length !== x.a.length || x.a.some(a => !x.bank.includes(a))))
      || (x.k === 'mcc' && gaps.length !== x.gaps.length) || (x.k === 'match5' && (x.names.length !== 5 || x.o.length !== 8 || new Set(x.a).size !== 5 || !x.lines.length)) || (x.k === 'pstory' && x.items.some(it => it.panels.length !== 3 || !it.k.length)) || (x.k === 'spk' && (!(x.pic || x.pics || x.panels || x.part === 'odd') || x.qs.some(q => !q.any.length || !q.t) || (x.part === 'odd' && x.qs.some(q => !q.e || q.e.length !== 4))))   // v132: Nói Movers (part diff / story / odd)
      || (x.k === 'sn' && (x.items.length !== (x.lv === 'a2' ? 6 : 5) || x.items.some(it => !it.txt || it.txt.split(/\s+/).length > 40 || (it.w || []).length !== 2 || new Set([it.a, ...it.w]).size !== 3 || !it.why)))   // v141 tin ngắn: A2 6 / B1 5 văn bản ≤ 40 từ, 3 phương án khác nhau
      || (x.k === 'gpara' && ((x.text.match(/^\{\d\}$/gm) || []).length !== x.a.length || x.opts.length !== x.a.length + 1 || new Set(x.a).size !== x.a.length || x.a.some(a => !(a >= 0 && a < x.opts.length)) || (x.why || []).length !== x.a.length)) || (x.k === 'photo' && (!x.m || !['b1', 'b2', 'c1'].includes(x.lv) || x.pics.length !== { b1: 1, b2: 2, c1: 3 }[x.lv] || !x.kw.length || x.c.length < 3));
      if (bad) throw new Error('dạng đề thiếu hỏng: ' + x.id); } }
  if (f === 'nghe.json') { D.mm = J('content/bs/nghe-mm.json').sets; for (const x of D.mm) if (x.sp.length !== 5 || !x.tasks.length || x.tasks.some(t => t.o.length !== 8 || t.a.length !== 5 || new Set(t.a).size !== 5 || t.a.some(a => !(a >= 0 && a < 8)))) throw new Error('bộ nối người nói hỏng: ' + x.id); }
  fs.writeFileSync(root + f, JSON.stringify(D)); console.log(`${f}: thêm ${add.length} mục B1 → C2`); }
console.log(`ngữ pháp B1 → C2: ${G.length} điểm`); const ws = units.flatMap(u => u.words); console.log(`dữ liệu Nhớ: đồng nghĩa ${ws.filter(w => w.rel).length} · trang trọng ${ws.filter(w => w.reg).length} · mẫu câu ${ws.filter(w => w.pat).length} · thành ngữ ${ws.filter(w => w.idi).length}${miss.length ? ` · không khớp từ nào: ${miss.join(', ')}` : ''}`);
for (const lv of LVS) console.log(' ', LVN[lv], units.filter(u => u.lv === lv).length, 'bài');
