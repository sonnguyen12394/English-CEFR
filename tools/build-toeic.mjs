// Dựng toeic.json (🎓 Luyện thi → TOEIC, toeic.js) từ content/toeic/{p5,doc,nghe,vocab}.json và kiểm lỗi soạn. Chạy: node tools/build-toeic.mjs
// Không sửa tay toeic.json. Sau khi sửa câu nghe (Part 2–4) hoặc từ vựng: chạy lại tools/build-audio.py để dựng giọng (n/).
// Part 2: xáo thứ tự 3 lời đáp theo id (cố định, để tệp giọng khớp), mỗi lời đọc kèm chữ cái "A. …" như đề thật.
// v139 (7/11/2026, "TOEIC đủ dạng câu"): nhãn dạng câu cho 📘 bài học và 🏋️ bài tập theo dạng (baihoc.js xlTo, toeic.js TO_DR). Suy từ câu hỏi; nhãn ghi tay trong content/ thắng nhãn suy.
//   Part 1 k: people (tranh có người) | scene (đồ vật, cảnh) · Part 2 ty: wh | yn (cả phủ định, câu đuôi, câu hỏi gián tiếp) | or | req (đề nghị, nhờ vả, mời) | stmt (câu trần thuật)
//   Part 3–4 câu hỏi ty: gist (chủ đề, mục đích, nơi, người) | next (việc sắp làm, đề nghị, yêu cầu) | imp (hàm ý) | graphic | detail · Part 4 bài ty (GHI TAY): msg | ann | ad | news | intro | tour | meet
//   Part 6 chỗ trống t: insert (chèn câu) | conn (từ nối giữa câu) | tense (thì theo ngữ cảnh, GHI TAY) | word · Part 7 câu hỏi ty: purpose | not | true | infer | syn | insert | intent | detail
import fs from 'node:fs'; import crypto from 'node:crypto'; import vm from 'node:vm'; import { doKhuon, KH_MIEN } from './do-khuon.mjs';
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

// v156 (specs/013) lời giải chi tiết lg = { og: { "<chữ phương án>": "loại từ: nghĩa" }, ly: vì sao, ct?: cấu trúc, dich: dịch cả câu }; khoá og theo CHỮ phương án (thứ tự hiện ra do ord quyết)
//   câu chưa có lg thì màn xem lại dùng why như cũ; ly phải nhắc đáp án (chặn lời giải lệch đáp án); câu chèn Part 6 đáp án là cả câu nên ly không cần chép lại
const lgChk = (t, o, a, lg, ins) => { if (!lg) return; const ks = Object.keys(lg.og || {});
  if (ks.length !== o.length || o.some(w => !(w in lg.og)) || ks.some(k => !String(lg.og[k] || '').trim())) err.push(t + ': lời giải lg.og cần đủ nghĩa cho đúng ' + o.length + ' phương án');
  if (!String(lg.ly || '').trim() || !String(lg.dich || '').trim()) err.push(t + ': lời giải lg cần ly (vì sao) và dich (dịch câu)');
  else if (!ins && !lg.ly.toLowerCase().includes(String(a).toLowerCase())) err.push(t + ': lời giải lg.ly không nhắc đáp án "' + a + '"');
  for (const k of Object.keys(lg)) if (!['og', 'ly', 'ct', 'dich'].includes(k)) err.push(t + ': lời giải lg có trường lạ: ' + k); };
const p5Chk = x => { id(x); lgChk(x.id, x.o, x.a, x.lg); if (x.o.length !== 4 || new Set(x.o).size !== 4 || !x.o.includes(x.a)) err.push(x.id + ': phương án hỏng'); if ((x.s.match(/-------/g) || []).length !== 1) err.push(x.id + ': cần đúng một chỗ trống'); if (!x.why) err.push(x.id + ': thiếu giải thích'); if (!T5.includes(x.t)) err.push(x.id + ': thiếu / sai dạng t'); return x; };
const p6Mk = x => { id(x); const n = (x.text.match(/\{\d\}/g) || []).length; if (n !== x.gaps.length) err.push(x.id + ': số chỗ trống ≠ số câu');
  x.gaps.forEach((g, i) => lgChk(x.id + ' chỗ ' + (i + 1), g.o, g.a, g.lg, p6T(g) === 'insert'));
  for (const g of x.gaps) { if (g.o.length !== 4 || new Set(g.o).size !== 4 || !g.o.includes(g.a)) err.push(x.id + ': phương án hỏng'); if (g.t && !P6T.includes(g.t)) err.push(x.id + ': nhãn chỗ trống t sai: ' + g.t); }
  const gaps = x.gaps.map(g => ({ ...g, t: p6T(g) })); if (gaps.filter(g => g.t === 'insert').length !== 1) err.push(x.id + ': cần đúng một câu chèn');
  // v139: 3 phương án sai của câu chèn phải cùng chủ đề đoạn văn (có từ nội dung chung với đoạn); phương án lạc đề ("Water boils at 100 degrees") làm câu quá dễ
  const tw = new Set(cw(x.title + ' ' + x.text)); for (const g of gaps.filter(g => g.t === 'insert')) for (const s of g.o.filter(s => s !== g.a)) if (!cw(s).some(w => tw.has(w))) err.push(x.id + ': phương án câu chèn lạc đề: ' + s);
  return { ...x, gaps }; }, p6 = D.p6.map(p6Mk);
const p7Mk = x => { id(x); if (!x.docs.length || x.qs.length < 2) err.push(x.id + ': thiếu văn bản / câu hỏi'); const T = docText(x);
  const qs = x.qs.map((q, qi) => { mcOk(x, q); const ty = q.ty || q7Ty(q.q); lgChk(x.id + ' câu ' + (qi + 1), [q.a, ...q.w], q.a, q.lg, true);   // v156: Part 7 — og = nghĩa 4 phương án; đáp án là cả câu nên ly không cần chép lại
    if (ty === 'syn') { const w = (q.q.match(/the word "([^"]+)"/i) || [])[1]; if (!w || !new RegExp('\\b' + w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b', 'i').test(T)) err.push(x.id + ': từ gần nghĩa không có trong văn bản: ' + w); }
    if (ty === 'insert') { const m = ['[1]', '[2]', '[3]', '[4]']; if (!/"[^"]{10,}"/.test(q.q) || m.some(k => T.split(k).length !== 2) || ![q.a, ...q.w].every(o => m.includes(o)) || !m.includes(q.a)) err.push(x.id + ': câu chèn [1]–[4] hỏng'); }
    if (ty === 'intent') { const p = (q.q.match(/writes, "([^"]+)"/) || [])[1]; if (!p || !T.includes(p)) err.push(x.id + ': câu ý định: câu được trích không có trong tin nhắn'); }
    if (q.ev) { const nm = v => String(v).toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim(); if (nm(q.ev).length <= 8 || !nm(T).includes(nm(q.ev))) err.push(x.id + ' câu ' + (qi + 1) + ': câu trích ev không có trong văn bản: ' + q.ev); }   // v176: kho cũng kiểm ev (specs/019)
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
// v152: câu gần trùng (chỉ đổi 1–2 chữ) với kho / đề khác cũng chặn: người từng luyện kho nhận ra câu → điểm đề thử cao giả. Jaccard theo từ ≥ 0,6 (Part 2) / 0,55 (Part 5)
const tk = s => new Set(String(s).toLowerCase().match(/[a-z0-9']+/g) || []), jac = (a, b) => { let n = 0; for (const w of a) if (b.has(w)) n++; return n / Math.max(1, a.size + b.size - n); };
const NEAR = { p2: [0.6, x => x.q], p5: [0.55, x => x.s] }, NS = { p2: [], p5: [] }; for (const s in NEAR) for (const x of BY[s]) NS[s].push(['kho ' + x.id, tk(NEAR[s][1](x))]);
// v153 (specs/011, giải mù Đề 1–6): bài Part 3 / 4 / 6 / 7 chép khuôn bài kho / đề trước (đổi tên, giữ câu chữ) cũng chặn: người từng luyện kho nhận ra bài.
//   Cụm 5 từ trùng ≥ 10% (so với bài ngắn hơn) hoặc từ nội dung trùng (Jaccard, bỏ từ chức năng) ≥ 0,25. Đo 9/11/2026: bài chép khuôn 0,10–0,14 / 0,26–0,39; bài khác chủ đề cao nhất 0,09 / 0,22.
const PTX = { p3: x => x.lines.map(l => l[1]).join(' '), p4: x => x.text, p6: x => x.text.replace(/\{\d\}/g, ' '), p7: x => x.docs.map(d => d.text).join(' ') };
const PSTOP = new Set('the and for you your our are was were will with that this have has had from they their there been would could should about into than then them what when which while also each more most some such only other over under after before because very just can may must not all any its his her she him who how why where here use used using please thank thanks dear best regards'.split(' '));
const g5 = s => { const w = String(s).toLowerCase().replace(/[^a-z0-9' ]+/g, ' ').split(/\s+/).filter(Boolean), S = new Set(); for (let i = 0; i + 5 <= w.length; i++) S.add(w.slice(i, i + 5).join(' ')); return S; };
const cwS = s => new Set((String(s).toLowerCase().match(/[a-z']{3,}/g) || []).filter(w => !PSTOP.has(w)));
const PS = {}; for (const s in PTX) PS[s] = (BY[s] || []).map(x => ['kho ' + x.id, g5(PTX[s](x)), cwS(PTX[s](x))]);
for (const f of NEWD) { const R = rd('content/toeic/tron/' + f), t = (R.id || f) + ' ', nn = String(+(R.id || '').slice(2)).padStart(2, '0');
  if (!/^de\d+$/.test(R.id || '') || !R.t || TRON.some(d => d.id === R.id) || ND.some(d => d.id === R.id)) err.push(f + ': id / tên đề sai hoặc trùng');
  const X = { p1: (R.p1 || []).map(p1Mk), p2: (R.p2 || []).map(p2Mk), p3: (R.p3 || []).map(talk), p4: (R.p4 || []).map(p4Mk), p5: (R.p5 || []).map(p5Chk), p6: (R.p6 || []).map(p6Mk), p7: (R.p7 || []).map(p7Mk) };
  for (const s in X) for (const x of X[s]) { if (!new RegExp('^d' + nn + '-' + s + '-\\d{2}$').test(x.id)) err.push(t + x.id + ': mã cần dạng d' + nn + '-' + s + '-01');
    const k = s + ':' + norm(dupKey(s, x)); if (SEEN.has(k)) err.push(t + x.id + ': trùng nguyên văn với ' + SEEN.get(k)); else SEEN.set(k, R.id + ' ' + x.id); }
  for (const s in NEAR) for (const x of X[s]) { const t1 = tk(NEAR[s][1](x)); for (const [w, t2] of NS[s]) { const j = jac(t1, t2); if (j >= NEAR[s][0]) err.push(t + x.id + ': gần trùng (' + j.toFixed(2) + ') với ' + w); } NS[s].push([R.id + ' ' + x.id, t1]); }
  for (const s in PTX) for (const x of X[s]) { const a5 = g5(PTX[s](x)), aw = cwS(PTX[s](x));
    for (const [w, b5, bw] of PS[s]) { let n = 0; for (const c of a5) if (b5.has(c)) n++; const c5 = n / Math.max(1, Math.min(a5.size, b5.size)), jw = jac(aw, bw);
      if (c5 >= 0.10 || jw >= 0.25) err.push(t + x.id + ': chép khuôn bài ' + w + ' (cụm 5 từ trùng ' + Math.round(c5 * 100) + '%, từ nội dung ' + jw.toFixed(2) + '): viết tình huống khác'); }
    PS[s].push([R.id + ' ' + x.id, a5, aw]); }
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
// v175 khuôn Phần Đọc theo 8 đề ETS (docs/KHUON-DE-TOEIC.md, tools/do-khuon.mjs; luật D-KHUON-ETS): đề mới (ngoài KH_MIEN = Đề 1–8 soạn trước khuôn) lệch khuôn thì dừng
{ const AL = [...TRON.map(d => ({ id: d.id, p7: (d.p7 || []).map(i => IDX.p7[i]).filter(Boolean) })), ...ND];
  const MIEN = process.env.KHUON_THU ? KH_MIEN.filter(x => x !== process.env.KHUON_THU) : KH_MIEN;   // KHUON_THU=de8: test C80 thử bỏ miễn một đề
  for (const d of ND.filter(d => !MIEN.includes(d.id))) for (const r of doKhuon(d, AL)) if (!r.ok) err.push(d.id + ' khuôn ETS: ' + r.ten + ' = ' + (typeof r.v === 'number' ? +r.v.toFixed(2) : r.v) + ' (ETS ' + r.ets + ', docs/KHUON-DE-TOEIC.md)'); }
if (TRON.length !== 2) err.push('tron.json: cần đúng 2 đề');
if (err.length) { console.error(err.join('\n')); process.exit(1); }
const ans = p2.map(x => x.a); if (Math.max(...[0, 1, 2].map(i => ans.filter(a => a === i).length)) > ans.length * 0.5) { console.error('Part 2: đáp án dồn một chữ cái'); process.exit(1); }
const OD = root + 'toeic-tron/'; fs.mkdirSync(OD, { recursive: true }); for (const f of fs.readdirSync(OD)) if (!ND.some(d => f === d.id + '.json')) fs.unlinkSync(OD + f);
const DC = fs.existsSync(root + 'content/toeic/doi-chu-v155.json') ? JSON.parse(fs.readFileSync(root + 'content/toeic/doi-chu-v155.json', 'utf8')) : {}, dcOf = id => DC[id] && Object.keys(DC[id]).length ? { dc: DC[id] } : {};   // v155: bảng đổi chữ cho bài làm cũ (specs/012 R6)
const writeOut = () => { for (const d of ND) fs.writeFileSync(OD + d.id + '.json', JSON.stringify({ _note: 'Dựng bởi tools/build-toeic.mjs từ content/toeic/tron/. Không sửa tay. Câu chỉ dùng trong đề thử trọn.', ...d, ...dcOf(d.id) }));
  fs.writeFileSync(root + 'toeic.json', JSON.stringify({ _note: 'Dựng bởi tools/build-toeic.mjs từ content/toeic/*.json. Không sửa tay.', p1, p5: P5, p6, p7, p2, p3, p4, voc: V, tron: [...TRON.map(d => ({ id: d.id, t: d.t, ...Object.fromEntries(Object.keys(TRN).map(s => [s, d[s]])), ...(d.ord ? { ord: d.ord } : {}), ...dcOf(d.id) })), ...ND.map(d => ({ id: d.id, t: d.t, f: 'toeic-tron/' + d.id + '.json' }))] })); };
writeOut();
// v155 (specs/012-so-loi-soan-de R5): cân bằng vị trí đáp án mỗi Part của mọi đề trọn, "sửa ít nhất" (kiem-toeic.mjs canDe): Part 3–7 ghi hoán vị `ord`
//   (app, máy kiểm, phiếu giải mù chỉ đọc); Part 2 đổi chỗ đáp án trong câu (câu kho của Đề 1–2 đổi luôn ở kho) → lời đọc "A. … B. …" đổi, phải dựng lại giọng.
const p2Set = (x, y) => { const a = x.a; if (a === y) return; [x.o[a], x.o[y]] = [x.o[y], x.o[a]]; [x.tr[a], x.tr[y]] = [x.tr[y], x.tr[a]]; x.a = y; x.lines = [['A', x.q], ...x.o.map((t, i) => ['B', 'ABC'[i] + '. ' + t])]; };
//   Vị trí đáp án CHỐT ở content/toeic/vi-tri-dap-an.json (khoá câu bền → chữ): sửa một câu không làm xê dịch câu khác. `node tools/build-toeic.mjs --can`
//   cân bằng lại (sửa ít nhất, cho câu mới / câu đổi) rồi chốt bảng mới; dựng thường chỉ áp bảng, Part lệch thì máy kiểm báo lỗi C-CAN.
{ const K = await import('./kiem-toeic.mjs'), p2i = Object.fromEntries(p2.map(x => [x.id, x])), VTF = root + 'content/toeic/vi-tri-dap-an.json', CAN = process.argv.includes('--can');
  const VT = fs.existsSync(VTF) ? JSON.parse(fs.readFileSync(VTF, 'utf8')) : {}; let nd = 0, n2 = 0;
  for (const D of K.loadTests()) { const r = K.canDe(D, VT[D.id] || {}, CAN), N = ND.find(d => d.id === D.id), tgt = N || TRON.find(d => d.id === D.id); tgt.ord = r.ord; if (CAN) VT[D.id] = r.vt;
    for (const s in r.doi) if (s !== 'p2') nd += r.doi[s];
    for (const [id, y] of Object.entries(r.p2)) { p2Set(N ? N.p2.find(z => z.id === id) : p2i[id], y); n2++; } }
  if (CAN) fs.writeFileSync(VTF, JSON.stringify({ _note: 'Vị trí đáp án đã cân bằng của đề thử trọn (specs/012-so-loi-soan-de). Khoá = mã bài + dấu (câu hỏi, tập phương án); giá trị = chữ của đáp án. Dựng bởi node tools/build-toeic.mjs --can; không sửa tay.', ...Object.fromEntries(Object.entries(VT).filter(([k]) => k !== '_note')) }, null, 1));
  writeOut(); console.log(`vị trí đáp án${CAN ? ' (đã cân bằng lại, chốt bảng)' : ''}: ${nd} câu Part 3–7, ${n2} câu Part 2 khác thứ tự mặc định (specs/012)`); }
const t34 = [...p3, ...p4].flatMap(x => x.qs), g6 = p6.flatMap(x => x.gaps), q7 = p7.flatMap(x => x.qs);
console.log(`toeic.json: Part 1 ${p1.length} · Part 2 ${p2.length} · Part 3 ${p3.length} bài (có bảng ${p3.filter(x => x.g).length}, 3 người ${p3.filter(x => new Set(x.lines.map(l => l[0])).size > 2).length}) · Part 4 ${p4.length} bài (có bảng ${p4.filter(x => x.g).length}) · Part 5 ${P5.length} · Part 6 ${p6.length} bài · Part 7 ${p7.length} bộ (${q7.length} câu) · từ vựng ${seen.size} từ / ${V.length} chủ đề · 🎓 ${TRON.length + ND.length} đề trọn 200 câu (${ND.length} đề tệp riêng) · đáp án Part 2 A/B/C: ${[0, 1, 2].map(i => ans.filter(a => a === i).length).join('/')}`);
console.log(`theo dạng: Part 1 ${fmt(cnt(p1, x => x.k))} | Part 2 ${fmt(cnt(p2, x => x.ty))} | Part 3–4 câu hỏi ${fmt(cnt(t34, q => q.ty))} | Part 4 bài ${fmt(cnt(p4, x => x.ty))} | Part 5 ${fmt(cnt(P5, x => x.t))} | Part 6 chỗ ${fmt(cnt(g6, g => g.t))} | Part 7 câu ${fmt(cnt(q7, q => q.ty))}`);
for (const d of ND) { const q34 = [...d.p3, ...d.p4].flatMap(x => x.qs), q7 = d.p7.flatMap(x => x.qs); console.log(`${d.t}: Part 1 ${fmt(cnt(d.p1, x => x.k))} | Part 2 ${fmt(cnt(d.p2, x => x.ty))} | Part 3–4 ${fmt(cnt(q34, q => q.ty))} | Part 4 bài ${fmt(cnt(d.p4, x => x.ty))} | Part 5 ${fmt(cnt(d.p5, x => x.t))} | Part 6 ${fmt(cnt(d.p6.flatMap(x => x.gaps), g => g.t))} | Part 7 ${fmt(cnt(q7, q => q.ty))}`); }
// v153 kiểm nội dung đề trọn (specs/011-kiem-noi-dung-de, docs/TIEU-CHI-DE-TOEIC.md): lỗi dừng dựng; cảnh báo chỉ đếm ở đây (cổng phát hành: test C69)
{ const K = await import('./kiem-toeic.mjs'), A = K.kiemTatCa();
  console.log(`kiểm nội dung: ${A.loi} lỗi · ${A.canh} cảnh báo chưa xem · ${A.xem} đã xem (chi tiết: node tools/kiem-toeic.mjs)`);
  if (A.loi) { for (const r of Object.values(A.R)) for (const f of r.f.filter(f => f.muc === 'loi')) console.error(`  ${r.t} câu ${f.n} · ${f.id} · ${f.ma} · ${f.ly_do}`); process.exit(1); }
// v155 sổ lỗi soạn đề (specs/012-so-loi-soan-de data-model §1–2): kiểm content/toeic/so-loi.json → dựng kiemde.json (tab 🛡️ Kiểm đề)
  const SL = rd('content/toeic/so-loi.json'), LU = {}, e2 = [];
  for (const r of [...K.ALL_RULES.map(r => ({ ...r, noi: r.ma.startsWith('GM-') ? 'giaimu' : 'kiem' })), ...K.DUNG_RULES, ...K.hRules()]) if (!LU[r.ma]) LU[r.ma] = { ten: r.ten, muc: r.muc, noi: r.noi };
  const NH = new Set((SL.nhom || []).map(n => n.id)), KH = ['soan', 'lam', 'hien'], BT = ['dung', 'kiem', 'giaimu', 'tusoat', 'nguoi'], TT = ['chan', 'nhac', 'nho', 'mo'], MA = new Set();
  for (const m of SL.muc || []) { const t = 'so-loi ' + (m.ma || '?') + ': ';
    if (!/^L-[A-Z0-9-]+$/.test(m.ma || '') || MA.has(m.ma) || LU[m.ma]) e2.push(t + 'mã cần dạng L-…, duy nhất, không trùng mã luật'); MA.add(m.ma);
    if (!m.ten || m.ten.length > 80 || !m.mo) e2.push(t + 'thiếu tên (≤ 80 ký tự) hoặc mô tả');
    if (!KH.includes(m.khau) || !NH.has(m.nhom) || !TT.includes(m.tt)) e2.push(t + 'khâu / nhóm / trạng thái sai');
    if (!(m.bat || []).length || m.bat.some(b => !BT.includes(b))) e2.push(t + 'bat phải là ' + BT.join(' / '));
    if (!(m.vd || []).length || m.vd.some(v => !v.de || !v.truoc || !v.sau || !(m.bat || []).includes(v.ai))) e2.push(t + 'mỗi ví dụ cần de, truoc, sau, ai (một trong bat)');
    if (!(m.gap || []).length || m.gap.some(g => !g.de || !(g.n > 0))) e2.push(t + 'gap cần [{ de, n > 0 }]');
    if (!(m.luat || []).length || m.luat.some(l => !LU[l])) e2.push(t + 'luật không có thật: ' + (m.luat || []).filter(l => !LU[l]).join(', '));
    if (m.tt === 'chan' && !m.luat.some(l => LU[l] && LU[l].muc === 'loi')) e2.push(t + 'chặn (chan) cần ít nhất một luật mức lỗi');
    if (m.tt === 'nhac' && !m.luat.some(l => LU[l] && LU[l].muc === 'canh')) e2.push(t + 'nhắc (nhac) cần ít nhất một luật mức cảnh báo');
    if (m.tt === 'mo' && !(m.pa || []).length) e2.push(t + 'còn mở (mo) cần phương án pa'); }
  if (e2.length) { console.error(e2.join('\n')); process.exit(1); }
  const used = {}; for (const m of SL.muc) for (const l of m.luat) used[l] = LU[l];
  const gmOf = g => { const L = (g && g.lan) || [], seen = new Set(), v1 = [0, 0], re = [0, 0]; for (const l of L) { const x = seen.has(l.phan) ? re : v1; seen.add(l.phan); x[0] += l.khop; x[1] += l.cau; }
    const C = g && g.cau ? Object.values(g.cau) : []; return { khop: C.filter(c => c.chon === c.da).length, tong: C.length, dau: v1, lai: re }; };
  const DE = Object.entries(A.R).map(([id, r]) => ({ id, t: r.t, loi: r.f.filter(f => f.muc === 'loi').length, canh: r.f.filter(f => f.muc === 'canh' && !f.da_xem).length, xem: r.f.filter(f => f.da_xem).length, gm: gmOf(r.gm) }));
  const dem = { tong: SL.muc.length }; for (const k of [...TT, ...KH]) dem[k] = SL.muc.filter(m => m.tt === k || m.khau === k).length;
  fs.writeFileSync(root + 'kiemde.json', JSON.stringify({ _note: 'Dựng bởi tools/build-toeic.mjs từ content/toeic/so-loi.json + máy kiểm. Không sửa tay.', v: SL.v, ngay: [...K.loadAck().map(k => k.ngay), ...Object.values(A.R).flatMap(r => ((r.gm || {}).lan || []).map(l => l.ngay))].filter(Boolean).sort().pop() || '', nhom: SL.nhom, muc: SL.muc, luat: used, de: DE, dem }) + '\n');
  console.log(`sổ lỗi soạn đề: ${dem.tong} mục (chặn ${dem.chan} · nhắc ${dem.nhac} · người nhớ ${dem.nho} · còn mở ${dem.mo}) → kiemde.json`); }
