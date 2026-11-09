// Dựng toeic.json (🎓 Luyện thi → TOEIC, toeic.js) từ content/toeic/{p5,doc,nghe,vocab}.json và kiểm lỗi soạn. Chạy: node tools/build-toeic.mjs
// Không sửa tay toeic.json. Sau khi sửa câu nghe (Part 2–4) hoặc từ vựng: chạy lại tools/build-audio.py để dựng giọng (n/).
// Part 2: xáo thứ tự 3 lời đáp theo id (cố định, để tệp giọng khớp), mỗi lời đọc kèm chữ cái "A. …" như đề thật.
// v139 (7/11/2026, "TOEIC đủ dạng câu"): nhãn dạng câu cho 📘 bài học và 🏋️ bài tập theo dạng (baihoc.js xlTo, toeic.js TO_DR). Suy từ câu hỏi; nhãn ghi tay trong content/ thắng nhãn suy.
//   Part 1 k: people (tranh có người) | scene (đồ vật, cảnh) · Part 2 ty: wh | yn (cả phủ định, câu đuôi, câu hỏi gián tiếp) | or | req (đề nghị, nhờ vả, mời) | stmt (câu trần thuật)
//   Part 3–4 câu hỏi ty: gist (chủ đề, mục đích, nơi, người) | next (việc sắp làm, đề nghị, yêu cầu) | imp (hàm ý) | graphic | detail · Part 4 bài ty (GHI TAY): msg | ann | ad | news | intro | tour | meet
//   Part 6 chỗ trống t: insert (chèn câu) | conn (từ nối giữa câu) | tense (thì theo ngữ cảnh, GHI TAY) | word · Part 7 câu hỏi ty: purpose | not | true | infer | syn | insert | intent | detail
import fs from 'node:fs'; import crypto from 'node:crypto'; import vm from 'node:vm';
const root = new URL('..', import.meta.url).pathname, rd = f => JSON.parse(fs.readFileSync(root + f, 'utf8'));
const P1 = rd('content/toeic/p1.json').items, P5 = rd('content/toeic/p5.json').items, D = rd('content/toeic/doc.json'), N = rd('content/toeic/nghe.json'), V = rd('content/toeic/vocab.json').topics, err = [], ids = new Set();
const id = x => { if (ids.has(x.id)) err.push('trùng id ' + x.id); ids.add(x.id); };
const mcOk = (x, q) => { if (q.w.length !== 3 || q.w.includes(q.a) || new Set(q.w).size !== 3) err.push(x.id + ': trắc nghiệm hỏng: ' + q.q); };
const h = s => parseInt(crypto.createHash('md5').update(s).digest('hex').slice(0, 8), 16);
const cnt = (a, f) => a.reduce((m, x) => { const k = f(x); m[k] = (m[k] || 0) + 1; return m; }, {}), fmt = m => Object.entries(m).map(([k, n]) => `${k} ${n}`).join(' · ');

// ---------- nhãn dạng (v139; v146: luật ở toqt.js, dùng chung với trang) ----------
const TQ = {}; vm.runInNewContext(fs.readFileSync(root + 'toqt.js', 'utf8') + '\n;Object.assign(OUT, { TQ_P1PPL, tqP2, tqQ34, tqQ7, tqP6 });', { OUT: TQ });
const { TQ_P1PPL: P1_PPL, tqP2: p2Ty, tqQ34: q34Ty, tqQ7: q7Ty, tqP6: p6T } = TQ;
const P4TY = ['msg', 'ann', 'ad', 'news', 'intro', 'tour', 'meet'], P6T = ['insert', 'conn', 'tense', 'word'];
const docText = x => x.docs.map(d => d.title + '\n' + d.text).join('\n');
const STOPW = new Set('about after again also because been before being both could does from have here into just like made make many more most much must only other over said same should since some such than that their them then there these they this those very were what when where which while will with would your yours ours'.split(' '));
const cw = s => String(s).toLowerCase().replace(/[^a-z\s-]/g, ' ').split(/\s+/).filter(w => w.length >= 4 && !STOPW.has(w)).map(w => w.replace(/(ies|es|s|ed|ing)$/, ''));   // từ nội dung (bỏ đuôi đơn giản)

const p5Chk = x => { id(x); if (x.o.length !== 4 || new Set(x.o).size !== 4 || !x.o.includes(x.a)) err.push(x.id + ': phương án hỏng'); if ((x.s.match(/-------/g) || []).length !== 1) err.push(x.id + ': cần đúng một chỗ trống'); if (!x.why) err.push(x.id + ': thiếu giải thích'); if (!T5.includes(x.t)) err.push(x.id + ': thiếu / sai dạng t'); return x; };
const p6Mk = x => { id(x); const n = (x.text.match(/\{\d\}/g) || []).length; if (n !== x.gaps.length) err.push(x.id + ': số chỗ trống ≠ số câu');
  for (const g of x.gaps) { if (g.o.length !== 4 || new Set(g.o).size !== 4 || !g.o.includes(g.a)) err.push(x.id + ': phương án hỏng'); if (g.t && !P6T.includes(g.t)) err.push(x.id + ': nhãn chỗ trống t sai: ' + g.t); }
  const gaps = x.gaps.map(g => ({ ...g, t: p6T(g) })); if (gaps.filter(g => g.t === 'insert').length !== 1) err.push(x.id + ': cần đúng một câu chèn');
  // v139: 3 phương án sai của câu chèn phải cùng chủ đề đoạn văn (có từ nội dung chung với đoạn); phương án lạc đề ("Water boils at 100 degrees") làm câu quá dễ
  const tw = new Set(cw(x.title + ' ' + x.text)); for (const g of gaps.filter(g => g.t === 'insert')) for (const s of g.o.filter(s => s !== g.a)) if (!cw(s).some(w => tw.has(w))) err.push(x.id + ': phương án câu chèn lạc đề: ' + s);
  return { ...x, gaps }; }, p6 = D.p6.map(p6Mk);
const p7Mk = x => { id(x); if (!x.docs.length || x.qs.length < 2) err.push(x.id + ': thiếu văn bản / câu hỏi'); const T = docText(x);
  const qs = x.qs.map(q => { mcOk(x, q); const ty = q.ty || q7Ty(q.q);
    if (ty === 'syn') { const w = (q.q.match(/the word "([^"]+)"/i) || [])[1]; if (!w || !new RegExp('\\b' + w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b', 'i').test(T)) err.push(x.id + ': từ gần nghĩa không có trong văn bản: ' + w); }
    if (ty === 'insert') { const m = ['[1]', '[2]', '[3]', '[4]']; if (!/"[^"]{10,}"/.test(q.q) || m.some(k => T.split(k).length !== 2) || ![q.a, ...q.w].every(o => m.includes(o)) || !m.includes(q.a)) err.push(x.id + ': câu chèn [1]–[4] hỏng'); }
    if (ty === 'intent') { const p = (q.q.match(/writes, "([^"]+)"/) || [])[1]; if (!p || !T.includes(p)) err.push(x.id + ': câu ý định: câu được trích không có trong tin nhắn'); }
    return { ...q, ty }; });
  return { ...x, qs }; }, p7 = D.p7.map(p7Mk);
const TR = ['rep', 'type', 'yn', 'rel'], T5 = ['form', 'verb', 'prep', 'conj', 'pron', 'det', 'struct', 'voc'];
P5.forEach(p5Chk);
const p2Mk = x => { id(x); if (x.o.length !== 3 || !(x.a >= 0 && x.a < 3)) err.push(x.id + ': Part 2 hỏng');
  if (!x.tr || x.tr.length !== 3 || x.tr[x.a] !== null || x.tr.some((t, i) => i !== x.a && !TR.includes(t))) err.push(x.id + ': nhãn bẫy tr hỏng');
  const ty = x.ty || p2Ty(x.q); if (!['wh', 'yn', 'or', 'req', 'stmt'].includes(ty)) err.push(x.id + ': không nhận được loại câu Part 2: ' + x.q);
  if (!['wh', 'or'].includes(ty) && (x.tr || []).includes('yn')) err.push(x.id + ': bẫy "Yes / No" chỉ dùng cho câu Wh- và câu lựa chọn');
  const r = h(x.id) % 6, perm = [[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]][r], o = perm.map(i => x.o[i]), a = perm.indexOf(x.a);
  return { id: x.id, q: x.q, o, a, tr: perm.map(i => x.tr[i]), ty, lines: [['A', x.q], ...o.map((t, i) => ['B', 'ABC'[i] + '. ' + t])] }; }, p2 = N.p2.map(p2Mk);
// v127 Part 1 (tranh vẽ thay ảnh chụp): 4 câu tả khác nhau, đúng một câu, tranh có khối / emoji; lời đọc kèm chữ cái "A. …" như Part 2
const p1Mk = x => { id(x); if (x.o.length !== 4 || new Set(x.o).size !== 4 || !(x.a >= 0 && x.a < 4) || !x.why) err.push(x.id + ': Part 1 hỏng');
  if (!x.pic || !['in', 'out', 'sea'].includes(x.pic.bg) || !(x.pic.e || []).length || x.pic.e.some(e => e.length !== 4 || e[1] < 0 || e[1] > 320 || e[2] < 0 || e[2] > 200)) err.push(x.id + ': tranh hỏng');
  return { ...x, k: x.k || (P1_PPL.test(x.o[x.a]) ? 'people' : 'scene'), lines: x.o.map((t, i) => ['A', 'ABCD'[i] + '. ' + t]) }; }, p1 = P1.map(p1Mk);
if (Math.max(...[0, 1, 2, 3].map(i => p1.filter(x => x.a === i).length)) > p1.length * 0.4) err.push('Part 1: đáp án dồn một chữ cái');
const talk = x => { id(x); if (x.qs.length !== 3) err.push(x.id + ': cần 3 câu hỏi'); for (const q of x.qs) mcOk(x, q);
  // v124: câu "Look at the graphic" cần bảng g { t, h, r }; mọi phương án phải có trong bảng (đáp án suy từ bảng + lời nghe)
  const gq = x.qs.filter(q => /^Look at the graphic\./.test(q.q)), cells = x.g ? x.g.r.flat() : [];
  if (x.g && (!x.g.t || x.g.h.length < 2 || x.g.r.length < 3 || x.g.r.some(r => r.length !== x.g.h.length))) err.push(x.id + ': bảng g hỏng');
  if (!!x.g !== (gq.length === 1)) err.push(x.id + ': bảng g cần đúng một câu "Look at the graphic"');
  for (const q of gq) for (const o of [q.a, ...q.w]) if (!cells.some(c => o === c || o.includes(c))) err.push(x.id + ': phương án không có trong bảng: ' + o);
  if (x.lines && x.lines.some(l => !['A', 'B', 'C'].includes(l[0]))) err.push(x.id + ': người nói chỉ A / B / C');
  const qs = x.qs.map(q => ({ ...q, ty: q.ty || q34Ty(q.q) })); for (const q of qs) if (q.ty === 'imp' && !/"[^"]{3,}"/.test(q.q)) err.push(x.id + ': câu hàm ý cần trích câu nói');
  return { ...x, qs }; };
const p4Mk = x => { if (!P4TY.includes(x.ty)) err.push(x.id + ': Part 4 cần nhãn loại bài nói ty (' + P4TY.join(' / ') + ')'); return talk(x); }, p3 = N.p3.map(talk), p4 = N.p4.map(p4Mk);
const seen = new Set(); for (const t of V) for (const [w, vi, ex] of t.w) { if (seen.has(w)) err.push('từ trùng: ' + w); seen.add(w); if (!vi || !ex || !ex.toLowerCase().includes(w.toLowerCase().split(' ')[0].slice(0, 4))) err.push('từ thiếu nghĩa / ví dụ: ' + w); }
// v147 🎓 đề thử trọn 200 câu (totron.js): content/toeic/tron.json = Đề 1–2, mỗi đề danh sách mã câu kho theo Part; kiểm đúng cơ cấu đề thật, không trùng giữa các đề, đủ loại câu
// v149 (specs/010-toeic-10-de-tron): Đề 3 → 12, mỗi đề một tệp nguồn content/toeic/tron/deNN.json (đủ câu, đúng thứ tự đề) → toeic-tron/deN.json; câu CHỈ dùng trong đề trọn (không vào kho luyện TO.p1…p7)
const TRON = rd('content/toeic/tron.json').de, TRN = { p1: 6, p2: 25, p3: 39, p4: 30, p5: 30, p6: 16, p7: 54 }, BY = { p1, p2, p3, p4, p5: P5, p6, p7 }, IDX = {}, used = new Map();
for (const s in BY) IDX[s] = Object.fromEntries(BY[s].map(x => [x.id, x]));
const nQ = (s, x) => s === 'p6' ? x.gaps.length : x.qs ? x.qs.length : 1;
// cơ cấu một đề: X = { p1: [mục đã dựng]… } theo thứ tự đề
function chkDe(t, X) {
  for (const s in TRN) { const xs = X[s] || [], n = xs.reduce((a, x) => a + nQ(s, x), 0); if (n !== TRN[s]) err.push(t + s + ': ' + n + ' câu, đề thật ' + TRN[s]);
    if (s === 'p3' || s === 'p4') { if (xs.some(x => x.qs.length !== 3)) err.push(t + s + ': mỗi bài phải 3 câu'); const gi = xs.findIndex(x => x.g); if (gi >= 0 && xs.slice(gi).some(x => !x.g)) err.push(t + s + ': bài có bảng phải ở cuối Part như đề thật'); }
    if (s === 'p6' && xs.some(x => x.gaps.length !== 4)) err.push(t + 'p6: mỗi đoạn phải 4 chỗ trống');
    if (s === 'p7') { const one = xs.filter(x => x.docs.length === 1), two = xs.filter(x => x.docs.length === 2), three = xs.filter(x => x.docs.length === 3);
      if (one.reduce((a, x) => a + x.qs.length, 0) !== 29 || two.length !== 2 || three.length !== 3 || [...two, ...three].some(x => x.qs.length !== 5)) err.push(t + 'p7: cần văn bản đơn 29 câu + 2 bộ 2 văn bản + 3 bộ 3 văn bản, mỗi bộ nhiều văn bản 5 câu');
      if (xs.findIndex(x => x.docs.length > 1) < one.length || [...two, ...three].some((x, i, a) => i && a[i - 1].docs.length > x.docs.length)) err.push(t + 'p7: văn bản đơn trước, rồi bộ 2 văn bản, rồi bộ 3 văn bản'); } }
  const ty2 = new Set((X.p2 || []).map(x => x.ty)), t5 = new Set((X.p5 || []).map(x => x.t)), k1 = new Set((X.p1 || []).map(x => x.k));
  if (['wh', 'yn', 'or', 'req', 'stmt'].some(x => !ty2.has(x))) err.push(t + 'p2: thiếu loại câu hỏi');
  if (T5.some(x => !t5.has(x))) err.push(t + 'p5: thiếu dạng câu');
  if (!k1.has('people') || !k1.has('scene')) err.push(t + 'p1: cần cả tranh có người và tranh cảnh');
  const a2 = (X.p2 || []).map(x => x.a); if (Math.max(...[0, 1, 2].map(i => a2.filter(a => a === i).length)) > 11) err.push(t + 'p2: đáp án dồn một chữ cái'); }
for (const d of TRON) { const t = d.id + ' ', X = {};
  for (const s in TRN) { const ids = d[s] || [], xs = ids.map(i => IDX[s][i]); if (xs.some(x => !x)) { err.push(t + s + ': mã không có trong kho: ' + ids.filter(i => !IDX[s][i]).join(', ')); X[s] = []; continue; }
    for (const i of ids) { if (used.has(i)) err.push(t + s + ': ' + i + ' trùng với ' + used.get(i)); used.set(i, d.id); } X[s] = xs; }
  chkDe(t, X); }
// đề mới: kiểm như kho + cơ cấu + dạng tối thiểu (research.md R4) + câu trích ev có trong lời nghe / bài đọc + không trùng nguyên văn với kho / đề khác
const TD = root + 'content/toeic/tron/', NEWD = fs.existsSync(TD) ? fs.readdirSync(TD).filter(f => /^de\d+\.json$/.test(f)).sort() : [], ND = [];
const norm = s => String(s).toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim(), lineT = x => x.lines ? x.lines.map(l => l[1]).join(' ') : x.text;
const dupKey = (s, x) => s === 'p1' ? x.o.join('|') : s === 'p2' ? x.q : s === 'p3' || s === 'p4' ? lineT(x) : s === 'p5' ? x.s : s === 'p6' ? x.text : x.docs.map(d => d.text).join(' ');
const SEEN = new Map(); for (const s in BY) for (const x of BY[s]) SEEN.set(s + ':' + norm(dupKey(s, x)), 'kho ' + x.id);
const evIn = (ev, T) => !!ev && norm(ev).length > 8 && norm(T).includes(norm(ev));
// v150: câu gần trùng (chỉ đổi 1–2 chữ) với kho / đề khác cũng chặn: người từng luyện kho nhận ra câu → điểm đề thử cao giả. Jaccard theo từ ≥ 0,6 (Part 2) / 0,55 (Part 5)
const tk = s => new Set(String(s).toLowerCase().match(/[a-z0-9']+/g) || []), jac = (a, b) => { let n = 0; for (const w of a) if (b.has(w)) n++; return n / Math.max(1, a.size + b.size - n); };
const NEAR = { p2: [0.6, x => x.q], p5: [0.55, x => x.s] }, NS = { p2: [], p5: [] }; for (const s in NEAR) for (const x of BY[s]) NS[s].push(['kho ' + x.id, tk(NEAR[s][1](x))]);
for (const f of NEWD) { const R = rd('content/toeic/tron/' + f), t = (R.id || f) + ' ', nn = String(+(R.id || '').slice(2)).padStart(2, '0');
  if (!/^de\d+$/.test(R.id || '') || !R.t || TRON.some(d => d.id === R.id) || ND.some(d => d.id === R.id)) err.push(f + ': id / tên đề sai hoặc trùng');
  const X = { p1: (R.p1 || []).map(p1Mk), p2: (R.p2 || []).map(p2Mk), p3: (R.p3 || []).map(talk), p4: (R.p4 || []).map(p4Mk), p5: (R.p5 || []).map(p5Chk), p6: (R.p6 || []).map(p6Mk), p7: (R.p7 || []).map(p7Mk) };
  for (const s in X) for (const x of X[s]) { if (!new RegExp('^d' + nn + '-' + s + '-\\d{2}$').test(x.id)) err.push(t + x.id + ': mã cần dạng d' + nn + '-' + s + '-01');
    const k = s + ':' + norm(dupKey(s, x)); if (SEEN.has(k)) err.push(t + x.id + ': trùng nguyên văn với ' + SEEN.get(k)); else SEEN.set(k, R.id + ' ' + x.id); }
  for (const s in NEAR) for (const x of X[s]) { const t1 = tk(NEAR[s][1](x)); for (const [w, t2] of NS[s]) { const j = jac(t1, t2); if (j >= NEAR[s][0]) err.push(t + x.id + ': gần trùng (' + j.toFixed(2) + ') với ' + w); } NS[s].push([R.id + ' ' + x.id, t1]); }
  chkDe(t, X);
  const c = (a, fn) => a.filter(fn).length, p2c = cnt(X.p2, x => x.ty), q3 = X.p3.flatMap(x => x.qs), q4 = X.p4.flatMap(x => x.qs), q7 = X.p7.flatMap(x => x.qs), one = X.p7.filter(x => x.docs.length === 1);
  const want = [['Part 1: 4 tranh có người, 2 tranh cảnh', c(X.p1, x => x.k === 'people') === 4 && c(X.p1, x => x.k === 'scene') === 2],
    ['Part 1: đáp án không chữ nào quá 3', Math.max(...[0, 1, 2, 3].map(i => c(X.p1, x => x.a === i))) <= 3],
    ['Part 2: Wh- 12 · Yes / No 5 · lựa chọn 2 · đề nghị 3 · trần thuật 3 (có ' + fmt(p2c) + ')', p2c.wh === 12 && p2c.yn === 5 && p2c.or === 2 && p2c.req === 3 && p2c.stmt === 3],
    ['Part 3: 2 hội thoại 3 người', c(X.p3, x => new Set(x.lines.map(l => l[0])).size > 2) === 2], ['Part 3: 3 hội thoại có bảng', c(X.p3, x => x.g) === 3], ['Part 3: ≥ 2 câu hàm ý', c(q3, q => q.ty === 'imp') >= 2],
    ['Part 4: 2 bài nói có bảng', c(X.p4, x => x.g) === 2], ['Part 4: ≥ 2 câu hàm ý', c(q4, q => q.ty === 'imp') >= 2], ['Part 4: ≥ 4 loại bài nói', new Set(X.p4.map(x => x.ty)).size >= 4],
    ['Part 6: ≥ 1 từ nối, ≥ 1 thì theo ngữ cảnh', X.p6.some(x => x.gaps.some(g => g.t === 'conn')) && X.p6.some(x => x.gaps.some(g => g.t === 'tense'))],
    ['Part 7: văn bản đơn 2 · 2 · 2 · 2 · 3 · 3 · 3 · 4 · 4 · 4 câu', one.map(x => x.qs.length).join() === '2,2,2,2,3,3,3,4,4,4'],
    ['Part 7: 2 chuỗi tin nhắn có câu ý định', c(one, x => /text|chat/i.test(x.kind) && x.qs.some(q => q.ty === 'intent')) === 2], ['Part 7: 2 câu chèn [1]–[4]', c(q7, q => q.ty === 'insert') === 2],
    ['Part 7: ≥ 2 câu từ gần nghĩa', c(q7, q => q.ty === 'syn') >= 2], ['Part 7: ≥ 1 câu NOT', c(q7, q => q.ty === 'not') >= 1],
    ['Part 7: mỗi bộ nhiều văn bản ≥ 1 câu đối chiếu (x: 1)', X.p7.filter(x => x.docs.length > 1).every(x => x.qs.some(q => q.x === 1))]];
  for (const [k, ok] of want) if (!ok) err.push(t + 'thiếu dạng: ' + k);
  for (const x of [...X.p3, ...X.p4]) for (const q of x.qs) if (!evIn(q.ev, lineT(x))) err.push(t + x.id + ': câu trích ev không có trong lời nghe: ' + (q.ev || '(trống)'));
  for (const x of X.p7) for (const q of x.qs) if (!['not', 'insert'].includes(q.ty) && !evIn(q.ev, docText(x))) err.push(t + x.id + ': câu trích ev không có trong văn bản: ' + (q.ev || '(trống)'));
  ND.push({ id: R.id, t: R.t, ...X }); }
if (TRON.length !== 2) err.push('tron.json: cần đúng 2 đề');
if (err.length) { console.error(err.join('\n')); process.exit(1); }
const ans = p2.map(x => x.a); if (Math.max(...[0, 1, 2].map(i => ans.filter(a => a === i).length)) > ans.length * 0.5) { console.error('Part 2: đáp án dồn một chữ cái'); process.exit(1); }
const OD = root + 'toeic-tron/'; fs.mkdirSync(OD, { recursive: true }); for (const f of fs.readdirSync(OD)) if (!ND.some(d => f === d.id + '.json')) fs.unlinkSync(OD + f);
for (const d of ND) fs.writeFileSync(OD + d.id + '.json', JSON.stringify({ _note: 'Dựng bởi tools/build-toeic.mjs từ content/toeic/tron/. Không sửa tay. Câu chỉ dùng trong đề thử trọn.', ...d }));
fs.writeFileSync(root + 'toeic.json', JSON.stringify({ _note: 'Dựng bởi tools/build-toeic.mjs từ content/toeic/*.json. Không sửa tay.', p1, p5: P5, p6, p7, p2, p3, p4, voc: V, tron: [...TRON.map(d => ({ id: d.id, t: d.t, ...Object.fromEntries(Object.keys(TRN).map(s => [s, d[s]])) })), ...ND.map(d => ({ id: d.id, t: d.t, f: 'toeic-tron/' + d.id + '.json' }))] }));
const t34 = [...p3, ...p4].flatMap(x => x.qs), g6 = p6.flatMap(x => x.gaps), q7 = p7.flatMap(x => x.qs);
console.log(`toeic.json: Part 1 ${p1.length} · Part 2 ${p2.length} · Part 3 ${p3.length} bài (có bảng ${p3.filter(x => x.g).length}, 3 người ${p3.filter(x => new Set(x.lines.map(l => l[0])).size > 2).length}) · Part 4 ${p4.length} bài (có bảng ${p4.filter(x => x.g).length}) · Part 5 ${P5.length} · Part 6 ${p6.length} bài · Part 7 ${p7.length} bộ (${q7.length} câu) · từ vựng ${seen.size} từ / ${V.length} chủ đề · 🎓 ${TRON.length + ND.length} đề trọn 200 câu (${ND.length} đề tệp riêng) · đáp án Part 2 A/B/C: ${[0, 1, 2].map(i => ans.filter(a => a === i).length).join('/')}`);
console.log(`theo dạng: Part 1 ${fmt(cnt(p1, x => x.k))} | Part 2 ${fmt(cnt(p2, x => x.ty))} | Part 3–4 câu hỏi ${fmt(cnt(t34, q => q.ty))} | Part 4 bài ${fmt(cnt(p4, x => x.ty))} | Part 5 ${fmt(cnt(P5, x => x.t))} | Part 6 chỗ ${fmt(cnt(g6, g => g.t))} | Part 7 câu ${fmt(cnt(q7, q => q.ty))}`);
for (const d of ND) { const q34 = [...d.p3, ...d.p4].flatMap(x => x.qs), q7 = d.p7.flatMap(x => x.qs); console.log(`${d.t}: Part 1 ${fmt(cnt(d.p1, x => x.k))} | Part 2 ${fmt(cnt(d.p2, x => x.ty))} | Part 3–4 ${fmt(cnt(q34, q => q.ty))} | Part 4 bài ${fmt(cnt(d.p4, x => x.ty))} | Part 5 ${fmt(cnt(d.p5, x => x.t))} | Part 6 ${fmt(cnt(d.p6.flatMap(x => x.gaps), g => g.t))} | Part 7 ${fmt(cnt(q7, q => q.ty))}`); }
