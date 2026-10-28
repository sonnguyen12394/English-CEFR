// 📚 Dựng thư viện đọc mở rộng (lib/, Bù 4, 28/10/2026): truyện công cộng từ Project Gutenberg (hết bản quyền ở Mỹ), cắt thành trang ~300 từ,
// đo độ phủ từ bằng chính danh sách từ của app (tỉ lệ từ trong bài thuộc cấp ≤ L) + độ dài câu. Cấp gợi ý đặt tay (truyện cổ B1, Wilde / O. Henry ngắn B2,
// Holmes / Saki / Chekhov C1, Austen / Dickens C2: theo thói quen chọn sách đọc của giáo viên) vì danh sách từ của app còn thiếu từ thường gặp (smoke, crowd…) nên độ phủ chỉ để so sánh.
// Chạy: node tools/build-lib.mjs [thư mục tải]  (cần mạng tới gutenberg.org; tệp sách gốc không commit, chỉ commit lib/*.json)
import fs from 'node:fs'; import { load, root } from './test/load.mjs';
const DIR = process.argv[2] || '/tmp/gut'; fs.mkdirSync(DIR, { recursive: true });
// [id, cấp gợi ý, mã Gutenberg, tên, tác giả, tiêu đề mở đầu, tiêu đề kết thúc (hoặc giới hạn số từ), chú thích tiếng Việt]
const BOOKS = [
  ['aesop', 'b1', 21, "Aesop's Fables (40 fables)", 'Aesop (G. F. Townsend dịch)', "AESOP'S FABLES", 4500, 'Truyện ngụ ngôn rất ngắn, mỗi truyện một bài học.'],
  ['emperor', 'b1', 1597, "The Emperor's New Clothes", 'H. C. Andersen', "THE EMPEROR'S NEW CLOTHES", 'THE SWINEHERD', 'Bộ quần áo mới của hoàng đế.'],
  ['princess', 'b1', 1597, 'The Real Princess', 'H. C. Andersen', 'THE REAL PRINCESS', 'THE SHOES OF FORTUNE', 'Nàng công chúa và hạt đậu.'],
  ['matchgirl', 'b1', 1597, 'The Little Match Girl', 'H. C. Andersen', 'THE LITTLE MATCH GIRL', 'THE DREAM OF LITTLE TUK', 'Cô bé bán diêm.'],
  ['elves', 'b1', 2591, 'The Elves and the Shoemaker', 'Brothers Grimm', 'THE ELVES AND THE SHOEMAKER', 'THE JUNIPER-TREE', 'Người thợ giày và những chú lùn.'],
  ['hansel', 'b1', 2591, 'Hansel and Gretel', 'Brothers Grimm', 'HANSEL AND GRETEL', 'THE MOUSE, THE BIRD, AND THE SAUSAGE', 'Hansel và Gretel.'],
  ['rumpel', 'b1', 2591, 'Rumpelstiltskin', 'Brothers Grimm', 'RUMPELSTILTSKIN', 'CLEVER GRETEL', 'Chú lùn kéo sợi vàng.'],
  ['happyprince', 'b2', 902, 'The Happy Prince', 'Oscar Wilde', 'THE HAPPY PRINCE', 'THE NIGHTINGALE AND THE ROSE', 'Hoàng tử hạnh phúc.'],
  ['nightingale', 'b2', 902, 'The Nightingale and the Rose', 'Oscar Wilde', 'THE NIGHTINGALE AND THE ROSE', 'THE SELFISH GIANT', 'Chim sơn ca và bông hồng.'],
  ['giant', 'b1', 902, 'The Selfish Giant', 'Oscar Wilde', 'THE SELFISH GIANT', 'THE DEVOTED FRIEND', 'Người khổng lồ ích kỷ.'],
  ['magi', 'b2', 2776, 'The Gift of the Magi', 'O. Henry', 'THE GIFT OF THE MAGI', 'BETWEEN ROUNDS', 'Món quà giáng sinh.'],
  ['twenty', 'b2', 2776, 'After Twenty Years', 'O. Henry', 'AFTER TWENTY YEARS', 'LOST ON DRESS PARADE', 'Hai mươi năm sau.'],
  ['cop', 'c1', 2776, 'The Cop and the Anthem', 'O. Henry', 'THE COP AND THE ANTHEM', 'AN ADJUSTMENT OF NATURE', 'Viên cảnh sát và bài thánh ca.'],
  ['openwindow', 'b2', 269, 'The Open Window', 'Saki', 'THE OPEN WINDOW', 'THE TREASURE SHIP', 'Cửa sổ mở: truyện ngắn có cú lừa.'],
  ['storyteller', 'c1', 269, 'The Story-Teller', 'Saki', 'THE STORY-TELLER', 'A DEFENSIVE DIAMOND', 'Người kể chuyện trên tàu.'],
  ['lumber', 'c1', 269, 'The Lumber Room', 'Saki', 'THE LUMBER ROOM', 'THE PHILANTHROPIST AND THE HAPPY CAT', 'Căn phòng chứa đồ.'],
  ['bohemia', 'c1', 1661, 'A Scandal in Bohemia', 'Arthur Conan Doyle', 'I. A SCANDAL IN BOHEMIA', 'II. THE RED-HEADED LEAGUE', 'Sherlock Holmes: vụ bê bối ở Bohemia.'],
  ['redheaded', 'c1', 1661, 'The Red-Headed League', 'Arthur Conan Doyle', 'II. THE RED-HEADED LEAGUE', 'III. A CASE OF IDENTITY', 'Sherlock Holmes: hội tóc đỏ.'],
  ['speckled', 'c1', 1661, 'The Speckled Band', 'Arthur Conan Doyle', 'VIII. THE ADVENTURE OF THE SPECKLED BAND', "IX. THE ADVENTURE OF THE ENGINEER'S THUMB", 'Sherlock Holmes: dải băng lốm đốm.'],
  ['ladydog', 'c1', 13415, 'The Lady with the Dog', 'Anton Chekhov (C. Garnett dịch)', 'THE LADY WITH THE DOG', "A DOCTOR'S VISIT", 'Người đàn bà và con chó nhỏ.'],
  ['doctor', 'c1', 13415, "A Doctor's Visit", 'Anton Chekhov (C. Garnett dịch)', "A DOCTOR'S VISIT", 'AN UPHEAVAL', 'Một lần khám bệnh.'],
  ['carol', 'c2', 46, 'A Christmas Carol', 'Charles Dickens', "STAVE I: MARLEY'S GHOST", '*** END', 'Bài ca giáng sinh (cả truyện, 5 phần).'],
  ['pride', 'c2', 1342, 'Pride and Prejudice (chapters 1–6)', 'Jane Austen', 'CHAPTER I', 'CHAPTER VII', 'Kiêu hãnh và định kiến (6 chương đầu).'],
];
const norm = l => l.replace(/[‘’]/g, "'").replace(/[“”]/g, '"').replace(/\s+/g, ' ').trim().toUpperCase().replace(/[.\]]+$/, '');
async function get(g) { const f = `${DIR}/${g}.txt`; if (!fs.existsSync(f)) { const r = await fetch(`https://www.gutenberg.org/cache/epub/${g}/pg${g}.txt`); if (!r.ok) throw new Error('tải ' + g); fs.writeFileSync(f, await r.text()); }
  return fs.readFileSync(f, 'utf8').replace(/\r/g, ''); }
function cut(txt, start, end) { const L = txt.split('\n'), body0 = L.findIndex(l => l.startsWith('*** START')), body1 = L.findIndex(l => l.startsWith('*** END'));
  const hits = L.map((l, i) => i > body0 && i < body1 && norm(l) === norm(start) ? i : -1).filter(i => i >= 0); if (!hits.length) throw new Error('không thấy ' + start);
  const s = hits[hits.length - 1] + 1; let e;
  if (typeof end === 'number') e = body1; else if (end === '*** END') e = body1; else { e = L.findIndex((l, i) => i > s && norm(l) === norm(end)); if (e < 0) throw new Error('không thấy ' + end); }
  let paras = L.slice(s, e).join('\n').split(/\n\s*\n/).map(p => p.replace(/\s*\n\s*/g, ' ').replace(/\[(Picture|Illustration)[^\]]*\]/gi, '').replace(/_([^_]+)_/g, '$1').replace(/\[\d+\]/g, '').replace(/\s+/g, ' ').trim())
    .filter(p => p && !/^(\d+|[IVXLC]+\.?|\* \* \*.*|\*+)$/.test(p) && !/^\[.*\]$/.test(p) && !/^CHAPTER [IVXLC]+/i.test(p));
  if (typeof end === 'number') { const out = []; let n = 0; for (const p of paras) { if (n >= end) break; out.push(p); n += p.split(/\s+/).length; } paras = out; }
  return paras; }
// trang ~250–450 từ, không cắt giữa đoạn
function pages(paras) { const out = []; let cur = [], n = 0; for (const p of paras) { const w = p.split(/\s+/).length; if (n && n + w > 450) { out.push(cur); cur = []; n = 0; } cur.push(p); n += w; if (n >= 250) { out.push(cur); cur = []; n = 0; } }
  if (cur.length) { if (out.length && n < 120) out[out.length - 1].push(...cur); else out.push(cur); } return out; }

const { run } = await load();
const LV = await run(`(async () => { await loadRef(); const m = {}; const put = (k, l) => { k = k.toLowerCase(); if (!m[k] || LEVELS.indexOf(l) < LEVELS.indexOf(m[k])) m[k] = l; };
  for (const w of [...WORDS, ...REF]) { const l = lvw(w); put(w.w, l); if (w.irr) for (const f of w.irr.f) for (const x of f[1]) put(x, l); }
  // dạng bất quy tắc của động từ rất thường gặp mà danh sách từ chỉ ghi gốc; mảnh viết tắt; danh xưng
  for (const x of 'am is are was were been being has had did does done said went gone came made took taken saw seen knew known thought told got gave given found felt left kept held stood sat ran brought bought caught taught began begun became spoke spoken wrote written drove driven rose risen fell fallen grew grown threw thrown tore torn wore worn won lost sent spent built lit laid lay hung shook shaken sprang drew drawn hid hidden rode ridden woke struck dealt fled sought meant heard paid sold slept swept wept led fed read let put cut set shut hit hurt cost s t ve ll d m re don didn doesn isn wasn weren hasn haven hadn couldn wouldn shouldn won mr mrs ms dr st oh'.split(' ')) put(x, 'pre');
  return { m, LEVELS }; })()`);
const lemmas = t => [t, t.replace(/'s$/, ''), t.replace(/s$/, ''), t.replace(/es$/, ''), t.replace(/ies$/, 'y'), t.replace(/ied$/, 'y'), t.replace(/ed$/, ''), t.replace(/ed$/, 'e'), t.replace(/d$/, ''), t.replace(/ing$/, ''), t.replace(/ing$/, 'e'),
  t.replace(/(.)\1ing$/, '$1'), t.replace(/(.)\1ed$/, '$1'), t.replace(/ly$/, ''), t.replace(/ily$/, 'y'), t.replace(/er$/, ''), t.replace(/est$/, ''), t.replace(/ier$/, 'y'), t.replace(/iest$/, 'y'), t.replace(/n't$/, '')];
const lvOf = t => { let best = null; for (const x of lemmas(t)) { const l = LV.m[x]; if (l && (!best || LV.LEVELS.indexOf(l) < LV.LEVELS.indexOf(best))) best = l; } return best; };
const MAIN = ['pre', 'a1', 'a2', 'b1', 'b2', 'c1', 'c2'];
function grade(paras) { const toks = []; for (const p of paras) { const ws = p.match(/[A-Za-z][A-Za-z']*/g) || []; ws.forEach(w => { if (/^[A-Z]/.test(w) && !lvOf(w.toLowerCase())) return; toks.push(w.toLowerCase().replace(/'$/, '')); }); }
  const cov = {}; for (const l of MAIN) { const k = LV.LEVELS.indexOf(l); cov[l] = toks.filter(t => { const x = lvOf(t); return x && LV.LEVELS.indexOf(x) <= k; }).length / toks.length; }
  const lv = MAIN.find(l => cov[l] >= 0.95) || 'c2', ss = paras.join(' ').split(/(?<=[.!?])\s+/); return { lv, sent: Math.round(toks.length / ss.length), cov: Object.fromEntries(Object.entries(cov).map(([k, v]) => [k, Math.round(v * 1000) / 10])), words: toks.length }; }

fs.mkdirSync(root + 'lib', { recursive: true }); const idx = [];
for (const [id, lv, g, title, author, start, end, vi] of BOOKS) { const paras = cut(await get(g), start, end), pg = pages(paras), gr = grade(paras);
  fs.writeFileSync(root + `lib/${id}.json`, JSON.stringify({ id, title, author, src: `https://www.gutenberg.org/ebooks/${g}`, pages: pg }));
  idx.push({ id, title, author, vi, lv, auto: gr.lv, sent: gr.sent, cov: gr.cov, words: gr.words, pages: pg.length }); console.log(id.padEnd(12), lv, gr.sent, String(gr.words).padStart(6), 'từ', pg.length, 'trang', JSON.stringify(gr.cov)); }
idx.sort((a, b) => MAIN.indexOf(a.lv) - MAIN.indexOf(b.lv) || a.words - b.words);
fs.writeFileSync(root + 'lib/index.json', JSON.stringify({ _note: 'Truyện công cộng (Project Gutenberg), dựng bằng tools/build-lib.mjs. lv = cấp gợi ý (đặt tay); cov = % từ trong bài có trong danh sách từ của app tới từng cấp; sent = số từ trung bình mỗi câu.', books: idx }));
console.log('xong', idx.length, 'truyện,', idx.reduce((s, x) => s + x.words, 0), 'từ');
