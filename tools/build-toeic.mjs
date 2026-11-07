// Dựng toeic.json (🎓 Luyện thi → TOEIC, toeic.js) từ content/toeic/{p5,doc,nghe,vocab}.json và kiểm lỗi soạn. Chạy: node tools/build-toeic.mjs
// Không sửa tay toeic.json. Sau khi sửa câu nghe (Part 2–4) hoặc từ vựng: chạy lại tools/build-audio.py để dựng giọng (n/).
// Part 2: xáo thứ tự 3 lời đáp theo id (cố định, để tệp giọng khớp), mỗi lời đọc kèm chữ cái "A. …" như đề thật.
// v139 (7/11/2026, "TOEIC đủ dạng câu"): nhãn dạng câu cho 📘 bài học và 🏋️ bài tập theo dạng (baihoc.js xlTo, toeic.js TO_DR). Suy từ câu hỏi; nhãn ghi tay trong content/ thắng nhãn suy.
//   Part 1 k: people (tranh có người) | scene (đồ vật, cảnh) · Part 2 ty: wh | yn (cả phủ định, câu đuôi, câu hỏi gián tiếp) | or | req (đề nghị, nhờ vả, mời) | stmt (câu trần thuật)
//   Part 3–4 câu hỏi ty: gist (chủ đề, mục đích, nơi, người) | next (việc sắp làm, đề nghị, yêu cầu) | imp (hàm ý) | graphic | detail · Part 4 bài ty (GHI TAY): msg | ann | ad | news | intro | tour | meet
//   Part 6 chỗ trống t: insert (chèn câu) | conn (từ nối giữa câu) | tense (thì theo ngữ cảnh, GHI TAY) | word · Part 7 câu hỏi ty: purpose | not | true | infer | syn | insert | intent | detail
import fs from 'node:fs'; import crypto from 'node:crypto';
const root = new URL('..', import.meta.url).pathname, rd = f => JSON.parse(fs.readFileSync(root + f, 'utf8'));
const P1 = rd('content/toeic/p1.json').items, P5 = rd('content/toeic/p5.json').items, D = rd('content/toeic/doc.json'), N = rd('content/toeic/nghe.json'), V = rd('content/toeic/vocab.json').topics, err = [], ids = new Set();
const id = x => { if (ids.has(x.id)) err.push('trùng id ' + x.id); ids.add(x.id); };
const mcOk = (x, q) => { if (q.w.length !== 3 || q.w.includes(q.a) || new Set(q.w).size !== 3) err.push(x.id + ': trắc nghiệm hỏng: ' + q.q); };
const h = s => parseInt(crypto.createHash('md5').update(s).digest('hex').slice(0, 8), 16);
const cnt = (a, f) => a.reduce((m, x) => { const k = f(x); m[k] = (m[k] || 0) + 1; return m; }, {}), fmt = m => Object.entries(m).map(([k, n]) => `${k} ${n}`).join(' · ');

// ---------- nhãn dạng (v139) ----------
const P1_PPL = /\b(person|people|man|men|woman|women|worker|workers|cook|chef|waiter|waitress|shopper|shoppers|customer|customers|passenger|passengers|student|students|someone|they)\b/i;
function p2Ty(q) { const s = String(q).trim();
  if (/\?$/.test(s) && /\bor\b/i.test(s)) return 'or';
  if (/^(Do you know|Do you remember|Can you tell me|Could you tell me|Have you heard|Did you hear|Do you have any idea)\b/i.test(s)) return 'yn';
  if (/^(Could you|Would you|Can you|Will you|Why don't|Why not|Shall (I|we)|Let's|How about|What about|Do you want|Should we|Would you mind|Do you mind|Please|I was wondering if)\b/i.test(s)) return 'req';
  if (/^(Is|Are|Was|Were|Do|Does|Did|Have|Has|Had|Can|Could|Will|Would|Should|May|Must)\b/.test(s) || /^\w+n't\b/i.test(s) || /,\s*(\w+n't\s+\w+|right|is it|are you|do you|did you|will you)\?$/i.test(s)) return 'yn';
  if (/^(When|Where|Who|Whose|Whom|Why|How|What|Which)\b/i.test(s)) return 'wh';
  return /\?$/.test(s) ? null : 'stmt'; }
const Q34_GIST = /(discussing|discuss|talking about)\?$|^What is the (main )?(purpose|topic|subject)\b|^What is the (talk|announcement|report|message|webinar|workshop|conversation|broadcast|advertisement) (mainly )?about\?$|^Why is the (man|woman|speaker) calling\?$|^Who (most likely )?(is|are) the (speakers?|listeners?|man|woman|caller)\??$|^Who is the speaker (most likely )?talking to\?$|^Where (most likely )?(are|is) the (speakers?|speaker)\??$|^Where does the conversation (most likely )?take place\?$|^Where (most likely )?(does|do) the (man|woman|speakers?|speaker) work\?$|^Where is the (talk|announcement|conversation) (most likely )?(taking place|being made)\?$|^What (type|kind) of (business|company|event|store|product)\b|^What is being advertised\?$|^Who most likely is the speaker\?$/i;
const Q34_NEXT = /^What will (the )?(man|woman|speakers?|listeners?|first woman|second woman|manager|[A-Z][a-z]+) (probably |most likely |likely )?do\b|^What will happen next\b|^What does the (man|woman|speaker|manager|guest|caller|woman named \w+|man named \w+) (suggest|recommend|offer|propose|ask for|request)\b|^What does the (man|woman|speaker) (ask|want|tell|remind|encourage|invite) (the )?(listeners?|man|woman|caller) to\b|^What (is|are) (the )?(man|woman|listeners?|speakers?|caller|participants?) (asked|encouraged|invited|reminded|told) (not )?to\b|^What does the (man|woman|speaker) want to do\b|^What does the (man|woman|speaker) say (he|she) will\b|^What does the (man|woman|speaker) (plan|intend|agree|offer) to do\b|offer to do\?$|^What should (the )?(listeners?|participants?|callers?) do\b/i;
const q34Ty = q => /^Look at the graphic/i.test(q) ? 'graphic' : /\bimply\b|mean when (he|she) says|Why does the (man|woman|speaker) say/i.test(q) ? 'imp' : Q34_GIST.test(q) ? 'gist' : Q34_NEXT.test(q) ? 'next' : 'detail';
const q7Ty = q => /closest in meaning to/i.test(q) ? 'syn' : /^In which of the positions marked/i.test(q) ? 'insert' : /mean when (he|she) writes/i.test(q) ? 'intent' : /\bNOT\b/.test(q) ? 'not'
  : /\b(purpose|mainly about|main topic)\b|^Why (was|is) (the|this) (letter|e-mail|notice|memo|article|message|advertisement|announcement|review) (being )?(sent|written|posted)|^Who is the (notice|memo|letter|e-mail|advertisement|article|message) (intended|written|most likely) for|^For whom is the|^Why does .+ (contact|write to|e-mail|call) /i.test(q) ? 'purpose'
  : /\b(most likely|suggested|implied|inferred|probably)\b/i.test(q) ? 'infer' : /\b(indicated|stated|mentioned|true)\b/i.test(q) ? 'true' : 'detail';
const CONN = new Set(['however', 'therefore', 'in addition', 'moreover', 'furthermore', 'as a result', 'consequently', 'nevertheless', 'nonetheless', 'instead', 'alternatively', 'similarly', 'likewise', 'otherwise', 'meanwhile', 'for example', 'for instance', 'in fact', 'thus', 'hence', 'accordingly', 'afterward', 'afterwards', 'finally', 'besides', 'even so', 'in contrast', 'by contrast', 'on the other hand', 'of course', 'indeed', 'after all', 'in the meantime', 'at the same time', 'additionally', 'subsequently', 'previously', 'in short', 'in other words', 'fortunately', 'unfortunately', 'then', 'still', 'rather', 'as a matter of fact', 'to this end', 'in particular', 'specifically', 'overall', 'once again', 'even though', 'regardless', 'in that case', 'if so', 'as such', 'until then', 'since then', 'by then', 'in the end', 'as expected', 'in the past', 'for this reason']);
const isSent = o => /[.!?]$/.test(String(o).trim()) && String(o).trim().split(/\s+/).length >= 3;
const p6T = g => g.t || (g.o.every(isSent) ? 'insert' : g.o.every(o => CONN.has(String(o).trim().replace(/,$/, '').toLowerCase())) ? 'conn' : 'word');
const P4TY = ['msg', 'ann', 'ad', 'news', 'intro', 'tour', 'meet'], P6T = ['insert', 'conn', 'tense', 'word'];
const docText = x => x.docs.map(d => d.title + '\n' + d.text).join('\n');
const STOPW = new Set('about after again also because been before being both could does from have here into just like made make many more most much must only other over said same should since some such than that their them then there these they this those very were what when where which while will with would your yours ours'.split(' '));
const cw = s => String(s).toLowerCase().replace(/[^a-z\s-]/g, ' ').split(/\s+/).filter(w => w.length >= 4 && !STOPW.has(w)).map(w => w.replace(/(ies|es|s|ed|ing)$/, ''));   // từ nội dung (bỏ đuôi đơn giản)

for (const x of P5) { id(x); if (x.o.length !== 4 || new Set(x.o).size !== 4 || !x.o.includes(x.a)) err.push(x.id + ': phương án hỏng'); if ((x.s.match(/-------/g) || []).length !== 1) err.push(x.id + ': cần đúng một chỗ trống'); if (!x.why) err.push(x.id + ': thiếu giải thích'); }
const p6 = D.p6.map(x => { id(x); const n = (x.text.match(/\{\d\}/g) || []).length; if (n !== x.gaps.length) err.push(x.id + ': số chỗ trống ≠ số câu');
  for (const g of x.gaps) { if (g.o.length !== 4 || new Set(g.o).size !== 4 || !g.o.includes(g.a)) err.push(x.id + ': phương án hỏng'); if (g.t && !P6T.includes(g.t)) err.push(x.id + ': nhãn chỗ trống t sai: ' + g.t); }
  const gaps = x.gaps.map(g => ({ ...g, t: p6T(g) })); if (gaps.filter(g => g.t === 'insert').length !== 1) err.push(x.id + ': cần đúng một câu chèn');
  // v139: 3 phương án sai của câu chèn phải cùng chủ đề đoạn văn (có từ nội dung chung với đoạn); phương án lạc đề ("Water boils at 100 degrees") làm câu quá dễ
  const tw = new Set(cw(x.title + ' ' + x.text)); for (const g of gaps.filter(g => g.t === 'insert')) for (const s of g.o.filter(s => s !== g.a)) if (!cw(s).some(w => tw.has(w))) err.push(x.id + ': phương án câu chèn lạc đề: ' + s);
  return { ...x, gaps }; });
const p7 = D.p7.map(x => { id(x); if (!x.docs.length || x.qs.length < 2) err.push(x.id + ': thiếu văn bản / câu hỏi'); const T = docText(x);
  const qs = x.qs.map(q => { mcOk(x, q); const ty = q.ty || q7Ty(q.q);
    if (ty === 'syn') { const w = (q.q.match(/the word "([^"]+)"/i) || [])[1]; if (!w || !new RegExp('\\b' + w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b', 'i').test(T)) err.push(x.id + ': từ gần nghĩa không có trong văn bản: ' + w); }
    if (ty === 'insert') { const m = ['[1]', '[2]', '[3]', '[4]']; if (!/"[^"]{10,}"/.test(q.q) || m.some(k => T.split(k).length !== 2) || ![q.a, ...q.w].every(o => m.includes(o)) || !m.includes(q.a)) err.push(x.id + ': câu chèn [1]–[4] hỏng'); }
    if (ty === 'intent') { const p = (q.q.match(/writes, "([^"]+)"/) || [])[1]; if (!p || !T.includes(p)) err.push(x.id + ': câu ý định: câu được trích không có trong tin nhắn'); }
    return { ...q, ty }; });
  return { ...x, qs }; });
const TR = ['rep', 'type', 'yn', 'rel'], T5 = ['form', 'verb', 'prep', 'conj', 'pron', 'det', 'struct', 'voc'];
for (const x of P5) if (!T5.includes(x.t)) err.push(x.id + ': thiếu / sai dạng t');
const p2 = N.p2.map(x => { id(x); if (x.o.length !== 3 || !(x.a >= 0 && x.a < 3)) err.push(x.id + ': Part 2 hỏng');
  if (!x.tr || x.tr.length !== 3 || x.tr[x.a] !== null || x.tr.some((t, i) => i !== x.a && !TR.includes(t))) err.push(x.id + ': nhãn bẫy tr hỏng');
  const ty = x.ty || p2Ty(x.q); if (!['wh', 'yn', 'or', 'req', 'stmt'].includes(ty)) err.push(x.id + ': không nhận được loại câu Part 2: ' + x.q);
  if (!['wh', 'or'].includes(ty) && (x.tr || []).includes('yn')) err.push(x.id + ': bẫy "Yes / No" chỉ dùng cho câu Wh- và câu lựa chọn');
  const r = h(x.id) % 6, perm = [[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]][r], o = perm.map(i => x.o[i]), a = perm.indexOf(x.a);
  return { id: x.id, q: x.q, o, a, tr: perm.map(i => x.tr[i]), ty, lines: [['A', x.q], ...o.map((t, i) => ['B', 'ABC'[i] + '. ' + t])] }; });
// v127 Part 1 (tranh vẽ thay ảnh chụp): 4 câu tả khác nhau, đúng một câu, tranh có khối / emoji; lời đọc kèm chữ cái "A. …" như Part 2
const p1 = P1.map(x => { id(x); if (x.o.length !== 4 || new Set(x.o).size !== 4 || !(x.a >= 0 && x.a < 4) || !x.why) err.push(x.id + ': Part 1 hỏng');
  if (!x.pic || !['in', 'out', 'sea'].includes(x.pic.bg) || !(x.pic.e || []).length || x.pic.e.some(e => e.length !== 4 || e[1] < 0 || e[1] > 320 || e[2] < 0 || e[2] > 200)) err.push(x.id + ': tranh hỏng');
  return { ...x, k: x.k || (P1_PPL.test(x.o[x.a]) ? 'people' : 'scene'), lines: x.o.map((t, i) => ['A', 'ABCD'[i] + '. ' + t]) }; });
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
const p3 = N.p3.map(talk), p4 = N.p4.map(x => { if (!P4TY.includes(x.ty)) err.push(x.id + ': Part 4 cần nhãn loại bài nói ty (' + P4TY.join(' / ') + ')'); return talk(x); });
const seen = new Set(); for (const t of V) for (const [w, vi, ex] of t.w) { if (seen.has(w)) err.push('từ trùng: ' + w); seen.add(w); if (!vi || !ex || !ex.toLowerCase().includes(w.toLowerCase().split(' ')[0].slice(0, 4))) err.push('từ thiếu nghĩa / ví dụ: ' + w); }
if (err.length) { console.error(err.join('\n')); process.exit(1); }
const ans = p2.map(x => x.a); if (Math.max(...[0, 1, 2].map(i => ans.filter(a => a === i).length)) > ans.length * 0.5) { console.error('Part 2: đáp án dồn một chữ cái'); process.exit(1); }
fs.writeFileSync(root + 'toeic.json', JSON.stringify({ _note: 'Dựng bởi tools/build-toeic.mjs từ content/toeic/*.json. Không sửa tay.', p1, p5: P5, p6, p7, p2, p3, p4, voc: V }));
const t34 = [...p3, ...p4].flatMap(x => x.qs), g6 = p6.flatMap(x => x.gaps), q7 = p7.flatMap(x => x.qs);
console.log(`toeic.json: Part 1 ${p1.length} · Part 2 ${p2.length} · Part 3 ${p3.length} bài (có bảng ${p3.filter(x => x.g).length}, 3 người ${p3.filter(x => new Set(x.lines.map(l => l[0])).size > 2).length}) · Part 4 ${p4.length} bài (có bảng ${p4.filter(x => x.g).length}) · Part 5 ${P5.length} · Part 6 ${p6.length} bài · Part 7 ${p7.length} bộ (${q7.length} câu) · từ vựng ${seen.size} từ / ${V.length} chủ đề · đáp án Part 2 A/B/C: ${[0, 1, 2].map(i => ans.filter(a => a === i).length).join('/')}`);
console.log(`theo dạng: Part 1 ${fmt(cnt(p1, x => x.k))} | Part 2 ${fmt(cnt(p2, x => x.ty))} | Part 3–4 câu hỏi ${fmt(cnt(t34, q => q.ty))} | Part 4 bài ${fmt(cnt(p4, x => x.ty))} | Part 5 ${fmt(cnt(P5, x => x.t))} | Part 6 chỗ ${fmt(cnt(g6, g => g.t))} | Part 7 câu ${fmt(cnt(q7, q => q.ty))}`);
