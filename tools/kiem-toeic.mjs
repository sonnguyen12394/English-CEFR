// Máy kiểm nội dung đề thử trọn TOEIC (specs/011-kiem-noi-dung-de; tiêu chí: docs/TIEU-CHI-DE-TOEIC.md).
// Chạy: node tools/kiem-toeic.mjs [de3 …] [--tat-ca] [--html]
//   Đọc bản ĐÃ DỰNG (toeic.json + toeic-tron/deN.json), nên chạy sau tools/build-toeic.mjs.
//   Kết quả 2 mức: lỗi (chắc chắn sai: dừng dựng, mã thoát 1) · cảnh báo (có thể sai: sửa hoặc ghi "đã xem" ở content/toeic/kiem-ok.json).
//   "Đã xem" khớp theo (id, ma, dau); dau = md5 10 ký tự nội dung câu / bài, nên câu đổi thì cảnh báo hiện lại.
//   Giải mù (tools/giai-mu.mjs) lưu ở content/toeic/giai-mu/deN.json; máy kiểm đọc vào thành luật GM-*.
// Số câu 1–200 và chữ cái đáp án tính như app (totron.js trB): p1 → p7 theo thứ tự đề; Part 1 / 2 chữ theo chỉ số đáp án;
// câu chèn [1]–[4] giữ thứ tự; số / giờ / ngày / tầng… cùng khuôn xếp tăng dần (tqNat, toqt.js, v153); còn lại sắp [đáp án, ...sai] theo trH(mãĐề + sốCâu + chữ) (trH chép từ totron.js).
import fs from 'node:fs'; import crypto from 'node:crypto';
import vm from 'node:vm';
export const root = new URL('..', import.meta.url).pathname;
const rd = f => JSON.parse(fs.readFileSync(root + f, 'utf8')), has = f => fs.existsSync(root + f);
const md5 = s => crypto.createHash('md5').update(s).digest('hex').slice(0, 10);
const TQ = {}; vm.runInNewContext(fs.readFileSync(new URL('../toqt.js', import.meta.url), 'utf8') + '\n;Object.assign(OUT, { tqNat, tqQt: q => typeof tqQ34 === "function" ? tqQ34(q) : null });', { OUT: TQ });   // v153: thứ tự tự nhiên như app
const trH = s => { let h = 0x811c9dc5; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; } return h; };
const SECS = ['p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7'], PART = s => 'Part ' + s.slice(1);

// ---------- chữ ----------
const STOP = new Set(('a an the to of in on at for by with and or but is are was were be been being am it its this that these those he she they we you i his her hers their our your my me him them us ' +
  'from as about into over after before up down out not no do does did doing will would can could should may might must have has had having what which who whom whose when where why how than then ' +
  'so if there here some any all each every just also very more most much many such only own same too s t don isn aren wasn weren won wouldn couldn shouldn hasn haven hadn didn doesn ll re ve d m ' +
  'please let let\'s one two').split(/\s+/));
const toks = s => String(s).toLowerCase().match(/[a-z0-9']+(?:-[a-z0-9']+)*/g) || [];
const cw = s => toks(s).map(w => w.replace(/'s$/, '').replace(/'/g, '')).filter(w => w.length > 2 && !STOP.has(w));
const stem = w => w.length > 5 && w.endsWith('ing') ? w.slice(0, -3) : w.length > 4 && w.endsWith('ed') ? w.slice(0, -2) : w.length > 4 && w.endsWith('es') ? w.slice(0, -2) : w.length > 3 && w.endsWith('s') && !w.endsWith('ss') ? w.slice(0, -1) : w;
const sameW = (a, b) => { if (a === b) return true; const x = stem(a), y = stem(b); if (x === y) return true; const n = Math.min(x.length, y.length); return n >= 5 && x.slice(0, n) === y.slice(0, n); };
const norm = s => String(s).toLowerCase().replace(/[‘’]/g, "'").replace(/[^a-z0-9']+/g, ' ').trim();
const sents = t => String(t).split(/\n+/).flatMap(l => l.split(/(?<=[.!?])\s+(?=[A-Z"“(])/)).map(s => s.trim()).filter(Boolean);
// số đọc bằng chữ → số (R6): "seven twenty-five" → "7 25", "one hundred and twenty" → "120", "twelve hundred" → "1200"
const NU = { zero: 0, oh: 0, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10, eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15, sixteen: 16, seventeen: 17, eighteen: 18, nineteen: 19 };
const NT = { twenty: 20, thirty: 30, forty: 40, fifty: 50, sixty: 60, seventy: 70, eighty: 80, ninety: 90 };
export const numTok = s => { const w = String(s).toLowerCase().replace(/(\d),(\d{3})/g, '$1$2').replace(/[-–]/g, ' ').match(/[a-z]+|\d+/g) || [], out = [];
  for (let i = 0; i < w.length; i++) { const t = w[i];
    if (!(t in NU) && !(t in NT)) { out.push(t); continue; }
    let v = t in NT ? NT[t] : NU[t];
    if (t in NT && w[i + 1] in NU && NU[w[i + 1]] > 0 && NU[w[i + 1]] < 10) { v += NU[w[i + 1]]; i++; }
    if (w[i + 1] === 'hundred') { v *= 100; i++; if (w[i + 1] === 'and') i++; if (w[i + 1] in NT) { v += NT[w[++i]]; if (w[i + 1] in NU && NU[w[i + 1]] < 10) v += NU[w[++i]]; } else if (w[i + 1] in NU) v += NU[w[++i]]; }
    if (w[i + 1] === 'thousand') { v *= 1000; i++; }
    out.push(String(v)); }
  return out; };
const seqIn = (needle, hay) => { if (!needle.length) return false; for (let i = 0; i + needle.length <= hay.length; i++) if (needle.every((t, j) => hay[i + j] === t)) return true; return false; };

// tên người → giới (R7: chỉ dùng cho câu tự giới thiệu; tên nhập nhằng như Dana, Jordan, Jun, Alex không có ở đây)
const NAME_F = new Set('rachel julia denise maria linda grace karen susan laura ella nina priya hannah helen jessica carol emma sofia sophia teresa patricia rosa paula irene kara ellen sandra olivia sarah emily anna lisa amy jennifer mary elizabeth kate katherine nancy betty margaret diane joan ruth alice claire natalie rebecca michelle angela melissa stephanie nicole amanda megan lauren rose victoria monica sophie chloe lucy mia amara aisha mei ana elena marta clara vanessa tina gloria yuki keiko fatima carmen lena joanna joan anita tanya isabel isabella hailey haley wendy rita martha agnes emilia ava zoe holly jane june heather donna cynthia brenda pamela sharon deborah judy cheryl'.split(' '));
const NAME_M = new Set('peter daniel raj kevin tom marcus gordon victor derek carlos omar ahmed sam alan martin james john michael david robert william richard thomas charles mark paul steven andrew brian george edward ryan jason eric jacob gary frank scott henry jack adam ben kenji leo owen hiroshi raymond jonathan hugo lucas oscar simon tony greg fred neil patrick sean ian luis diego jorge miguel pedro tomas tomás matthew joseph christopher anthony kenneth joshua timothy larry jeffrey nicholas benjamin samuel gregory dennis jerry walter peter harry bob bill joe mike dave steve chris nick luke ethan noah liam mason logan hassan raymond philip stuart nathan colin dean keith carl bruce roger douglas'.split(' '));
const TITLE_G = { 'mr': 'm', 'mrs': 'f', 'ms': 'f', 'miss': 'f' };
const introGender = t => { const out = []; const re = /\b(?:[Tt]his is|[Mm]y name is|I'm|I am|[Ii]t's|[Ii]t is)\s+(?:(Mr|Mrs|Ms|Miss)\.?\s+)?([A-Z][a-z]+)(?!'s)\b/g; let m;
  while ((m = re.exec(t))) { const nm = m[2].toLowerCase(), g = m[1] ? TITLE_G[m[1].toLowerCase()] : NAME_F.has(nm) ? 'f' : NAME_M.has(nm) ? 'm' : null; if (g) out.push([m[0], g]); }
  return out; };

// emoji người (Part 1)
const PERSON = cp => (cp >= 0x1F464 && cp <= 0x1F469) || (cp >= 0x1F46E && cp <= 0x1F478) || cp === 0x1F481 || cp === 0x1F482 || cp === 0x1F483 || cp === 0x1F486 || cp === 0x1F487 ||
  cp === 0x1F574 || cp === 0x1F575 || cp === 0x1F57A || (cp >= 0x1F645 && cp <= 0x1F647) || (cp >= 0x1F64B && cp <= 0x1F64F) || (cp >= 0x1F6B4 && cp <= 0x1F6B6) || cp === 0x1F3C3 || cp === 0x1F3C4 ||
  cp === 0x1F3C7 || (cp >= 0x1F3CA && cp <= 0x1F3CC) || (cp >= 0x1F9CD && cp <= 0x1F9CF) || (cp >= 0x1F9D1 && cp <= 0x1F9DD) || cp === 0x1F926 || cp === 0x1F937 || cp === 0x26F9 || cp === 0x1F9D1;
export const isPerson = e => PERSON(e.codePointAt(0));
// vật cụ thể trong câu đúng Part 1 → emoji phải có (R2 P1-VAT); vật vẽ bằng khối màu (bàn, ghế dài, kệ, hồ bơi…) không xét
const VAT = { laptop: '💻🧑‍💻', bicycle: '🚲🚴', bike: '🚲🚴', boat: '🚤⛵🛥🚣', ladder: '🪜', cart: '🛒', chair: '🪑', car: '🚗🚙🚕', vehicle: '🚗🚙🚕🚚🚌🚜', microscope: '🔬', painting: '🖼🎨', computer: '🖥💻',
  book: '📚📖📕📗📘', dog: '🐕🐶🦮', umbrella: '⛱☂🌂', scissors: '✂', tractor: '🚜', airplane: '✈🛩', plane: '✈🛩', microphone: '🎤', camera: '📷📸', photograph: '📷📸', flower: '💐🌷🌸🌹🌻🌼', vase: '🏺',
  suitcase: '🧳', luggage: '🧳', box: '📦', bus: '🚌🚍', tree: '🌳🌲🌴', newspaper: '📰', cup: '☕🍵', coffee: '☕', phone: '📱☎📞', clock: '🕐🕑🕒🕓🕔🕕🕖🕗🕘🕙🕚🕛⏰', truck: '🚚🚛', mountain: '🏔⛰', broom: '🧹' };
const vatOf = w => { const s = w.replace(/es$/, '').replace(/s$/, ''); return VAT[w] ? w : VAT[s] ? s : VAT[w.replace(/es$/, '')] ? w.replace(/es$/, '') : null; };

// kho chữ tiếng Anh của app cho C-CHU (R5): mọi chữ trong nội dung không thuộc kho TOEIC / đề trọn
let CORPUS = null;
export function corpus() { if (CORPUS) return CORPUS; const S = new Set(), add = v => { if (typeof v === 'string') { for (const w of v.toLowerCase().match(/[a-z]+/g) || []) if (w.length >= 3) S.add(w); } else if (Array.isArray(v)) v.forEach(add); else if (v && typeof v === 'object') Object.values(v).forEach(add); };
  for (const f of ['a1.json', 'a2.json', 'b.json', 'cap.json', 'dekho.json', 'doc.json', 'exam-a1.json', 'exam-a2.json', 'exam-b.json', 'ielts.json', 'nghe.json', 'noi.json', 'np.json', 'ref.json', 'tracuu.json', 'uoe.json', 'viet.json', 'vx.json'])
    if (has(f)) add(rd(f));
  if (has('lib')) for (const f of fs.readdirSync(root + 'lib')) if (f.endsWith('.json')) add(rd('lib/' + f));
  if (has('toeic.json')) add(rd('toeic.json').voc);
  for (const w of TU_OK) S.add(w);
  return (CORPUS = S); }
// chữ đúng mà kho của app chưa có (đã soát tay; thêm vào đây thay vì ghi "đã xem" từng câu)
const TU_OK = new Set('beautify setup breakup pickup minivan webinar buffet freight frother modem diploma sedan booth trash diesel validate participatory refrain introductory fluency librarian permanency refrigerator refrigerators coworker coworkers tirelessly proximity proximate shortlisted espresso unavailability papercraft auditorium microscope unplugs unplug expansive repainted repaint refueling refuel appliance appliances gigabytes gigabyte salesperson salespeople blueberry blueberries muffin muffins durable readiness fertilizer reuses reuse riverfront distributor distributors promotional escalator escalators expo purifier purifiers rattling dock docks kiosk kiosks glossy conductor conductors biweekly playwright playwrights cholesterol continuation'.split(' '));
const SUF = [['ies', ['y']], ['ied', ['y']], ['ier', ['y']], ['iest', ['y']], ['ily', ['y']], ['ing', ['', 'e', '-']], ['ed', ['', 'e', '-']], ['es', ['', 'e']], ['s', ['']], ['er', ['', 'e', '-']], ['est', ['', 'e', '-']], ['ly', ['', 'le']], ['ness', ['']], ['ment', ['']], ['ful', ['']], ['less', ['']], ['able', ['', 'e']], ['ity', ['', 'e']], ['ism', ['']], ['ian', ['', 'y']], ['ee', ['']], ['ees', ['']], ['ory', ['e', '']], ['cy', ['t']]];
const known = w => { const C = corpus(); if (C.has(w)) return true;
  for (const [suf, adds] of SUF) if (w.length > suf.length + 2 && w.endsWith(suf)) { const b = w.slice(0, -suf.length);
    for (const a of adds) { const c = a === '-' ? (/(.)\1$/.test(b) ? b.slice(0, -1) : null) : b + a; if (c && c.length >= 3 && (C.has(c) || (c !== w && known(c)))) return true; } }
  for (const pre of ['re', 'un', 'pre', 'mis', 'over', 'out', 'under', 'sub', 'inter', 'co', 'non', 'mid', 'mini'])   // tiền tố: repaved, relocation, minivan
    if (w.length > pre.length + 3 && w.startsWith(pre) && known(w.slice(pre.length))) return true;
  for (let k = 3; k <= w.length - 3; k++) { const a = w.slice(0, k), b = w.slice(k); if (C.has(a) && (C.has(b) || known(b))) return true; }   // từ ghép: bookstore, ballroom, handheld
  return false; };

// ---------- đọc đề đã dựng ----------
export function loadTests() { const T = rd('toeic.json'), ix = Object.fromEntries(SECS.map(s => [s, Object.fromEntries((T[s] || []).map(x => [x.id, x]))]));
  return (T.tron || []).map(d => { if (d.f) { const F = rd(d.f); return { id: d.id, t: d.t, f: d.f, ord: F.ord || null, ...Object.fromEntries(SECS.map(s => [s, F[s] || []])) }; }
    return { id: d.id, t: d.t, kho: 1, ord: d.ord || null, ...Object.fromEntries(SECS.map(s => [s, (d[s] || []).map(i => ix[s][i]).filter(Boolean)])) }; }); }

// đơn vị (câu lẻ / bài) + câu hỏi, đánh số và chữ cái như app
const L4 = 'ABCD';
export function units(de) { const U = []; let n = 0;
  for (const s of SECS) for (const x of de[s] || []) {
    const raw = s === 'p1' ? [{ stem: 'Câu nào tả đúng tranh?', o: x.o, a: x.o[x.a], fixed: 1 }] : s === 'p2' ? [{ stem: x.q, o: x.o, a: x.o[x.a], fixed: 1 }]
      : s === 'p3' || s === 'p4' || s === 'p7' ? x.qs.map(q => ({ stem: q.q, o: [q.a, ...q.w], a: q.a, src: q })) : s === 'p5' ? [{ stem: x.s, o: x.o, a: x.a, src: x }] : x.gaps.map((g, i) => ({ stem: 'Chỗ (' + (i + 1) + ')', o: g.o, a: g.a, src: g, gi: i }));
    const qs = raw.map((q, k) => { n++; const fix = q.fixed || q.o.every(t => /^\[\d\]$/.test(t)), od = !q.fixed && de.ord && de.ord[n - 1], base = od ? [...q.o].sort() : null;
      const opts = q.fixed ? q.o : od ? od.split('').map(i => base[+i]) : fix ? [...q.o].sort() : TQ.tqNat(q.o) || [...q.o].sort((a, b) => trH(de.id + n + a) - trH(de.id + n + b));   // v155: ord = hoán vị đã cân bằng (bộ dựng ghi)
      return { ...q, n, k: k + 1, opts, L: L4[opts.indexOf(q.a)] }; });
    U.push({ sec: s, x, qs, a: qs[0].n, b: qs[qs.length - 1].n }); }
  return U; }
// v155 (specs/012-so-loi-soan-de R5): cân bằng vị trí đáp án mỗi Part, "sửa ít nhất": bắt đầu từ thứ tự hiện tại, chỉ đổi chữ đáp án của câu "tự do"
//   (không phải phương án số / giờ / ngày xếp tăng dần, không phải câu chèn [1]–[4], không phải Part 1) từ chữ thừa sang chữ thiếu, tới khi mỗi chữ
//   có ⌊N/k⌋ − 1 … ⌈N/k⌉ + 1 câu và không quá CAN_RUN câu liền cùng chữ. Bộ dựng ghi kết quả (ord, hoán vị Part 2); app, máy kiểm, phiếu giải mù chỉ đọc.
export const CAN_RUN = 3;
export const canRange = (N, k) => [Math.max(0, Math.floor(N / k) - 1), Math.ceil(N / k) + 1];
export const canRuns = L => { let m = 1, c = 1; for (let i = 1; i < L.length; i++) { c = L[i] === L[i - 1] ? c + 1 : 1; m = Math.max(m, c); } return L.length ? m : 0; };
export function canSeq(L, free, k, seed) { L = [...L]; const N = L.length, [lo, hi] = canRange(N, k), K = [...Array(k).keys()];
  const cnt = () => { const c = Array(k).fill(0); for (const x of L) c[x]++; return c; };
  const runAt = i => { let a = i, b = i; while (a > 0 && L[a - 1] === L[i]) a--; while (b < N - 1 && L[b + 1] === L[i]) b++; return b - a + 1; };
  const okRun = (i, y) => { const o = L[i]; L[i] = y; const r = runAt(i); L[i] = o; return r <= CAN_RUN; };
  const order = [...Array(N).keys()].sort((a, b) => trH(seed + '#' + a) - trH(seed + '#' + b));
  for (let it = 0; it < 6 * N; it++) { const c = cnt(); let done = false;
    for (const i of order) if (free[i] && runAt(i) > CAN_RUN) { const ys = K.filter(y => y !== L[i] && c[y] < hi && okRun(i, y)).sort((a, b) => c[a] - c[b]); if (ys.length) { L[i] = ys[0]; done = true; break; } }
    if (done) continue;
    const over = K.filter(x => c[x] > hi), under = K.filter(y => c[y] < lo); if (!over.length && !under.length) break;
    const from = over.length ? over : [K.slice().sort((a, b) => c[b] - c[a])[0]], to = under.length ? under : K.filter(y => c[y] < hi);
    for (const i of order) if (free[i] && from.includes(L[i])) { const ys = to.filter(y => y !== L[i] && okRun(i, y)).sort((a, b) => c[a] - c[b]); if (ys.length) { L[i] = ys[0]; done = true; break; } }
    if (!done) break; }
  return L; }
// Khoá câu bền (không theo số câu, không theo thứ tự câu trong bài): mã bài + dấu của (câu hỏi, tập phương án). Đổi chữ câu hỏi / phương án = câu mới.
export const qKey = (u, q) => u.x.id + '#' + md5(JSON.stringify([q.stem, [...q.o].sort()])).slice(0, 8);
// Thứ tự phương án của đề từ bảng vị trí đáp án đã chốt `vt` ({ khoá câu: chữ }; content/toeic/vi-tri-dap-an.json). can = true: cân bằng thêm ("sửa ít nhất")
//   rồi trả bảng mới để chốt. → { ord: [200 chuỗi hoặc null], p2: { [id câu Part 2]: chữ mới (0–2) }, doi: { [Part]: số câu khác thứ tự băm }, vt }
export function canDe(de, vt = {}, can = false) { const U = units({ ...de, ord: null }), ord = Array(200).fill(null), p2 = {}, doi = {}, out = {};
  for (const s of SECS) { const Q = U.filter(u => u.sec === s).flatMap(u => u.qs.map(q => ({ u, q }))); if (!Q.length) continue; const k = s === 'p2' ? 3 : 4;
    const L0 = Q.map(({ q }) => 'ABCD'.indexOf(q.L)), free = Q.map(({ q }) => s === 'p2' || (s !== 'p1' && !q.fixed && !q.o.every(t => /^\[\d\]$/.test(t)) && !TQ.tqNat(q.o))), keys = Q.map(({ u, q }) => qKey(u, q));
    const L = L0.map((x, i) => { const y = free[i] && vt[keys[i]] ? 'ABCD'.indexOf(vt[keys[i]]) : -1; return y >= 0 && y < k ? y : x; });
    const L2 = can ? canSeq(L, free, k, de.id + s) : L; doi[s] = L2.filter((y, i) => y !== L0[i]).length;
    Q.forEach(({ u, q }, i) => { if (s === 'p1') return; if (free[i]) out[keys[i]] = 'ABCD'[L2[i]];
      if (s === 'p2') { if (L2[i] !== L0[i]) p2[u.x.id] = L2[i]; return; }
      const o = [...q.opts]; if (L2[i] !== L0[i]) { const t = o[L2[i]]; o[L2[i]] = o[L0[i]]; o[L0[i]] = t; }
      const base = [...q.o].sort(); ord[q.n - 1] = o.map(t => base.indexOf(t)).join(''); }); }
  return { ord, p2, doi, vt: out }; }
// dấu nội dung (data-model.md): không gồm why / ev; dauGT có why (cho luật giải thích)
// v156 (specs/013): lời giải chi tiết lg không bao giờ vào dấu (thêm / sửa lời giải không đổi đề, không phải giải mù lại, "đã xem" giữ)
const strip = (x, keepWhy) => JSON.parse(JSON.stringify(x, (k, v) => k === 'lg' || (!keepWhy && (k === 'why' || k === 'ev')) ? undefined : v));
export const dau = (u, gt) => md5(JSON.stringify(strip(u.x, gt)));

// lời bài theo người nói: [{ who: 'A'|'B'|'C'|'S', g: 'f'|'m'|null, t }]
const talkLines = (u) => u.sec === 'p3' ? u.x.lines.map(l => ({ who: l[0], g: l[0] === 'B' ? 'm' : 'f', t: l[1] })) : [{ who: 'S', g: u.x.sx || null, t: u.x.text }];
const talkText = u => talkLines(u).map(l => l.t).join(' ');
const docsText = x => x.docs.map(d => d.title + '\n' + d.text).join('\n');
const subjOf = q => { const m = /\bthe (man|woman)\b/i.exec(q); return m ? (m[1].toLowerCase() === 'man' ? 'm' : 'f') : null; };
const SPEECH = /^(?:What|Why|How|When|Where|Who)\b.*?\b(?:does|did|will|is) the (man|woman) (?:suggest|offer|recommend|propose|request|ask|say|mention|explain|agree|want to know|imply|mean|remind|warn|promise|complain)/i;

// ---------- luật (research.md R2) ----------
const F = (n, ly_do, goi_y, extra) => ({ n, ly_do, goi_y, ...extra }), FU = (u, ly_do, goi_y) => ({ n: u.a, unit: 1, ly_do, goi_y });
const qid = (u, q) => u.qs.length > 1 ? u.x.id + '#' + q.k : u.x.id;
const opts3 = u => /^p[347]$/.test(u.sec);
const isNot = q => /\bNOT\b/.test(q.stem), isIns = q => q.o.every(t => /^\[\d\]$/.test(t));
const whyOf = (u, q) => u.sec === 'p1' ? u.x.why : u.sec === 'p5' ? u.x.why : u.sec === 'p6' ? q.src.why : u.sec === 'p7' ? q.src.why : null;
const engStrings = u => { const x = u.x, out = [];
  if (u.sec === 'p1') out.push(...x.o); if (u.sec === 'p2') out.push(x.q, ...x.o);
  if (u.sec === 'p3' || u.sec === 'p4') { out.push(...talkLines(u).map(l => l.t)); for (const q of x.qs) out.push(q.q, q.a, ...q.w); if (x.g) out.push(x.g.t, ...x.g.h, ...x.g.r.flat()); }
  if (u.sec === 'p5') out.push(x.s, ...x.o); if (u.sec === 'p6') { out.push(x.title || '', x.text); for (const g of x.gaps) out.push(...g.o); }
  if (u.sec === 'p7') { for (const d of x.docs) out.push(d.title, d.text); for (const q of x.qs) out.push(q.q, q.a, ...q.w); }
  return out.filter(Boolean); };

// v153: nhiễu "từ + giới từ" ghép giả (giải mù Đề 1–2: "handily to", "while to", "allowed of"…); trừ giới từ / liên từ nhiều chữ có thật
const GHEP = /^\S+ (to|of|on|for|with|at|in|from|by|about)$/i;
const GHEP_OK = new Set(['because of', 'due to', 'instead of', 'according to', 'prior to', 'owing to', 'apart from', 'aside from', 'as of', 'up to', 'next to', 'close to', 'ahead of', 'out of', 'regardless of', 'thanks to', 'along with', 'together with', 'except for', 'as for', 'away from', 'inside of', 'outside of', 'in to', 'each of', 'all of', 'some of', 'most of', 'none of', 'both of', 'either of', 'neither of', 'one of', 'any of', 'many of', 'much of', 'several of', 'few of', 'none of']);
export const RULES = [
  // ---- chung ----
  { ma: 'C-TRUNG-PA', muc: 'loi', ten: '2 phương án trùng nhau', goi_y: 'viết lại một phương án', f: u => u.qs.filter(q => new Set(q.o.map(norm)).size !== q.o.length).map(q => F(q.n, 'có 2 phương án giống nhau: ' + q.o.join(' · '))) },
  { ma: 'C-GT-LECH', muc: 'loi', gt: 1, ten: 'giải thích chỉ tới phương án sai', goi_y: 'sửa giải thích cho khớp đáp án', f: u => u.qs.flatMap(q => { const w = whyOf(u, q); if (!w || !w.includes('→')) return [];
    const hit = w.split('→').slice(1).map(s => s.trim().toLowerCase()).map(s => q.o.filter(o => o.length > 1 && s.startsWith(o.toLowerCase()) && !/^\s*[+\-−×*=]/.test(s.slice(o.length))).sort((a, b) => b.length - a.length)[0]).filter(Boolean);
    return hit.length && !hit.includes(q.a) && hit.some(o => o !== q.a) ? [F(q.n, `giải thích ghi "→ ${hit[0]}" nhưng đáp án là "${q.a}"`)] : []; }) },
  { ma: 'C-GT-THIEU', muc: 'canh', gt: 1, ten: 'giải thích không nhắc đáp án', goi_y: 'thêm đáp án vào giải thích, nói vì sao chọn nó', f: u => (u.sec === 'p5' || u.sec === 'p6') ? u.qs.filter(q => q.a.length <= 30 && !q.o.every(o => /[.!?]$/.test(o)) && whyOf(u, q) && !norm(whyOf(u, q)).includes(norm(q.a))).map(q => F(q.n, `giải thích "${whyOf(u, q).slice(0, 60)}" không nhắc "${q.a}"`)) : [] },
  { ma: 'C-DAI', muc: 'canh', ten: 'đáp án dài hơn hẳn phương án sai', goi_y: 'cân độ dài: rút gọn đáp án hoặc viết phương án sai dài tương đương', f: u => opts3(u) ? u.qs.filter(q => !isIns(q)).filter(q => { const m = Math.max(...q.o.filter(o => o !== q.a).map(o => o.length)); return q.a.length > 1.6 * m && q.a.length - m > 12; }).map(q => F(q.n, `đáp án ${q.a.length} ký tự, phương án sai dài nhất ${Math.max(...q.o.filter(o => o !== q.a).map(o => o.length))}: "${q.a}"`)) : [] },
  { ma: 'C-DANG', muc: 'canh', ten: 'chỉ riêng đáp án khác dạng', goi_y: 'viết 4 phương án cùng một dạng (cùng mở đầu To / By, cùng là câu hoặc cụm)', f: u => opts3(u) ? u.qs.filter(q => !isIns(q)).flatMap(q => { const w = q.o.filter(o => o !== q.a);
    const FS = [['mở đầu "To"', o => /^to\b/i.test(o)], ['mở đầu "By"', o => /^by\b/i.test(o)], ['là câu có dấu chấm', o => /[.!?]$/.test(o.trim())]];
    for (const [nm, f] of FS) if (w.every(o => f(o) === f(w[0])) && f(q.a) !== f(w[0])) return [F(q.n, `chỉ đáp án ${f(q.a) ? '' : 'không '}${nm}: "${q.a}"`)];
    return []; }) : [] },
  { ma: 'C-CHU', muc: 'canh', ten: 'từ lạ, có thể gõ sai', goi_y: 'sửa chính tả; từ đúng thì thêm vào TU_OK của máy kiểm', f: u => { const bad = new Set();
    for (const s of engStrings(u)) for (const m of String(s).replace(/\S+@\S+|\b(?:www\.)?[\w-]+\.(?:com|org|net|co|biz|info)\b\S*/gi, ' ').matchAll(/(?<![A-Za-z'])([a-z][a-z]{3,})(?![A-Za-z])/g)) if (!known(m[1])) bad.add(m[1]);
    return bad.size ? [FU(u, 'từ không có ở đâu khác trong app: ' + [...bad].join(', '))] : []; } },
  { ma: 'C-CACH', muc: 'loi', ten: 'khoảng trắng / dấu câu / ngoặc kép sai', goi_y: 'bỏ dấu cách thừa, đóng ngoặc kép', f: u => { const bad = [];
    for (const s of engStrings(u)) { if (/ {2,}/.test(s)) bad.push('2 dấu cách: ' + s.slice(0, 40)); if (/ [,.;:?!](?![.\d])/.test(s) && !/ \.\.\./.test(s)) bad.push('cách trước dấu câu: ' + s.slice(0, 40));
      if ((s.match(/"/g) || []).length % 2) bad.push('ngoặc kép lẻ: ' + s.slice(0, 40)); if ((s.match(/“/g) || []).length !== (s.match(/”/g) || []).length) bad.push('ngoặc kép cong lẻ: ' + s.slice(0, 40)); }
    return bad.length ? [FU(u, bad.slice(0, 3).join(' · '))] : []; } },
  // ---- Part 1 ----
  { ma: 'P1-EMOJI', muc: 'loi', ten: 'tranh không khớp loại (có người / cảnh)', goi_y: 'tranh "có người" phải có hình người; tranh cảnh không có người', f: u => { if (u.sec !== 'p1') return []; const p = u.x.pic.e.some(e => isPerson(e[0]));
    return u.x.k === 'people' && !p ? [F(u.a, 'tranh "có người" nhưng không có hình người')] : u.x.k === 'scene' && p ? [F(u.a, 'tranh cảnh nhưng có hình người: ' + u.x.pic.e.filter(e => isPerson(e[0])).map(e => e[0]).join(''))] : []; } },
  { ma: 'P1-CANH-NGUOI', muc: 'loi', ten: 'tranh cảnh mà câu đúng nói về người', goi_y: 'tranh cảnh: câu đúng tả vật (has / have been + V3, is / are + vị trí)', f: u => { if (u.sec !== 'p1' || u.x.k !== 'scene') return []; const a = u.x.o[u.x.a];
    return /^(a|an|the|some|two|three|several|many)?\s*(man|woman|men|women|person|people|worker|workers|customer|customers|passenger|passengers|someone|chef|cook|doctor|nurse|pilot|student|students|visitor|visitors|shopper|shoppers)\b/i.test(a) || /\b(is|are) being\b/i.test(a) ? [F(u.a, 'câu đúng: "' + a + '"')] : []; } },
  { ma: 'P1-VAT', muc: 'canh', ten: 'câu đúng nhắc vật mà tranh không vẽ', goi_y: 'thêm emoji của vật vào tranh hoặc đổi câu đúng', f: u => { if (u.sec !== 'p1') return []; const pic = u.x.pic.e.map(e => e[0]).join(''), miss = [];
    for (const w of toks(u.x.o[u.x.a])) { const v = vatOf(w); if (v && ![...VAT[v]].some(c => pic.includes(c))) miss.push(w); }
    return miss.length ? [F(u.a, `câu đúng nhắc ${miss.join(', ')} nhưng tranh không có (${pic})`)] : []; } },
  // ---- Part 2 ----
  { ma: 'P2-YESNO', muc: 'loi', ten: 'câu Wh- / lựa chọn mà đáp án mở đầu Yes / No', goi_y: 'đổi đáp án thành câu trả lời trực tiếp hoặc gián tiếp không có Yes / No', f: u => u.sec === 'p2' && ['wh', 'or'].includes(u.x.ty) && /^(yes|no)\s*[,.!]|^(yes|no)$/i.test(u.x.o[u.x.a].trim()) ? [F(u.a, `"${u.x.q}" → "${u.x.o[u.x.a]}"`)] : [] },
  // ---- Part 3–4 ----
  { ma: 'P34-HAMY', muc: 'loi', ten: 'câu trích của câu hàm ý sai người / không có trong lời', goi_y: 'trích đúng nguyên văn, đúng người nói', f: u => { if (u.sec !== 'p3' && u.sec !== 'p4') return []; const L = talkLines(u), out = [];
    for (const q of u.qs) { const m = /says?,?\s*["“]([^"”]+)["”]/i.exec(q.stem); if (!m) continue; const quote = norm(m[1]), ln = L.filter(l => norm(l.t).includes(quote));
      if (!ln.length) { out.push(F(q.n, `câu trích "${m[1]}" không có nguyên văn trong lời`)); continue; }
      const g = /\b(he|the man)\b/i.test(q.stem) ? 'm' : /\b(she|the woman)\b/i.test(q.stem) ? 'f' : null;
      if (g && !ln.some(l => l.g === g)) out.push(F(q.n, `câu hỏi về ${g === 'm' ? 'người nam' : 'người nữ'} nhưng "${m[1]}" do ${ln[0].g === 'm' ? 'người nam' : ln[0].g === 'f' ? 'người nữ' : 'người chưa ghi giới tính'} nói`)); }
    return out; } },
  { ma: 'P34-NGUOI', muc: 'loi', ten: 'hỏi "the man / the woman" mà bài không có người đó', goi_y: 'sửa câu hỏi hoặc người nói', f: u => { if (u.sec !== 'p3') return []; const who = new Set(u.x.lines.map(l => l[0]));
    return u.qs.filter(q => (/\bthe man\b/i.test(q.stem) && !who.has('B')) || (/\bthe woman\b/i.test(q.stem) && !who.has('A') && !who.has('C'))).map(q => F(q.n, `"${q.stem}" nhưng bài không có người này`)); } },
  { ma: 'P4-SX', muc: 'loi', ten: 'câu hỏi Part 4 dùng he / she mà giới tính người nói chưa ghi hoặc ngược', goi_y: 'ghi sx: "m" / "f" ở bài nói', f: u => { if (u.sec !== 'p4') return [];
    return u.qs.flatMap(q => { const m = /\bwhen (he|she) says\b|\bthe speaker\b[^?]*\b(his|her)\b/i.exec(q.stem); if (!m) return []; const g = /he|his/i.test(m[1] || m[2]) && !/she|her/i.test(m[1] || m[2]) ? 'm' : 'f';
      return u.x.sx === g ? [] : [F(q.n, `câu hỏi dùng "${m[1] || m[2]}" nhưng bài ${u.x.sx ? 'ghi sx: ' + u.x.sx : 'chưa ghi sx'}`)]; }); } },
  { ma: 'P34-TEN', muc: 'loi', ten: 'người nói tự giới thiệu tên khác giới với giọng', goi_y: 'đổi tên hoặc đổi người nói / sx', f: u => { if (u.sec !== 'p3' && u.sec !== 'p4') return []; const out = [];
    for (const l of talkLines(u)) for (const [txt, g] of introGender(l.t)) if (l.g ? l.g !== g : u.sec === 'p4') out.push(FU(u, `"${txt}" (${g === 'f' ? 'tên nữ' : 'tên nam'}) mà ${l.g ? 'giọng ' + (l.g === 'f' ? 'nữ' : 'nam') : 'bài chưa ghi sx'}`));
    return out; } },
  { ma: 'P34-BANG-COT', muc: 'loi', ten: '4 phương án câu bảng không cùng một cột', goi_y: 'lấy 4 phương án cùng một cột của bảng', f: u => { if (!u.x.g || (u.sec !== 'p3' && u.sec !== 'p4')) return []; const G = u.x.g;
    return u.qs.filter(q => /look at the graphic/i.test(q.stem)).flatMap(q => { const cols = q.o.map(o => new Set(G.r.flatMap(r => r.map((c, j) => seqIn(numTok(c), numTok(o)) ? j : -1)).filter(j => j >= 0)));
      return cols.every(c => c.size) && [...cols[0]].some(j => cols.every(c => c.has(j))) ? [] : [F(q.n, 'phương án: ' + q.o.join(' · '))]; }); } },
  { ma: 'P34-BANG-LO', muc: 'canh', ten: 'lời nghe nói thẳng đáp án của câu bảng', goi_y: 'lời nghe nhắc ô khác của cùng hàng, đáp án phải nhìn bảng mới ra', f: u => { if (!u.x.g || (u.sec !== 'p3' && u.sec !== 'p4')) return []; const hay = numTok(talkText(u));
    return u.qs.filter(q => /look at the graphic/i.test(q.stem) && seqIn(numTok(q.a), hay)).map(q => F(q.n, `lời nghe có "${q.a}"`)); } },
  { ma: 'P34-GIOI', muc: 'canh', ten: 'câu hỏi về lời của người này mà câu chứa đáp án do người kia nói', goi_y: 'kiểm lại câu hỏi hỏi đúng người; sửa câu trích ev', f: u => { if (u.sec !== 'p3') return []; const L = talkLines(u);
    return u.qs.flatMap(q => { const m = SPEECH.exec(q.stem), ev = q.src.ev; if (!m || !ev) return []; const g = m[1].toLowerCase() === 'man' ? 'm' : 'f', ln = L.filter(l => norm(l.t).includes(norm(ev)));
      return ln.length && !ln.some(l => l.g === g) ? [F(q.n, `"${q.stem}" nhưng câu "${ev}" do ${g === 'm' ? 'người nữ' : 'người nam'} nói`)] : []; }); } },
  { ma: 'P3-LUOT', muc: 'canh', ten: 'hội thoại 2 người có 2 lượt liền của một người', goi_y: 'gộp 2 lượt hoặc thêm lượt của người kia', f: u => { if (u.sec !== 'p3') return []; const w = u.x.lines.map(l => l[0]);
    return new Set(w).size === 2 && w.some((s, i) => i && s === w[i - 1]) ? [FU(u, 'thứ tự người nói: ' + w.join(' '))] : []; } },
  // ---- Part 5–6 ----
  { ma: 'P5-CHO', muc: 'loi', ten: 'câu Part 5 không có đúng một chỗ trống', goi_y: 'để đúng một "-------"', f: u => u.sec === 'p5' && (u.x.s.match(/-------/g) || []).length !== 1 ? [F(u.a, u.x.s)] : [] },
  { ma: 'P5-HOA', muc: 'loi', ten: 'chỗ trống đầu câu mà đáp án không viết hoa', goi_y: 'viết hoa chữ đầu cả 4 phương án', f: u => u.sec === 'p5' && /^\s*-------/.test(u.x.s) && !u.x.o.every(o => /^[A-Z]/.test(o)) ? [F(u.a, 'phương án: ' + u.x.o.join(' · '))] : [] },
  { ma: 'P5-AAN', muc: 'loi', ten: '"a / an" trước chỗ trống không hợp đáp án', goi_y: 'sửa a ↔ an hoặc đổi chỗ trống', f: u => { if (u.sec !== 'p5') return []; const m = /\b(a|an)\s+-------/i.exec(u.x.s); if (!m) return [];
    const w = u.x.a.toLowerCase(), v = /^(hour|honest|honor|honour|heir)/.test(w) || (/^[aeiou]/.test(w) && !/^(uni|use|usu|uti|eu|one|once|ewe|ubiq|ura)/.test(w));
    return (m[1].toLowerCase() === 'an') !== v ? [F(u.a, `"${m[1]} -------" với đáp án "${u.x.a}"`)] : []; } },
  { ma: 'P5-GHEP', muc: 'canh', ten: 'phương án nhiễu ghép "từ + giới từ" giả (đáp án là một từ)', goi_y: 'dùng một từ cùng loại nhưng sai nghĩa / sai kết hợp (vd. eligible thay cho "eligible for")', f: u => {
    if (u.sec !== 'p5' && u.sec !== 'p6') return [];
    return u.qs.filter(q => !/\s/.test(String(q.a).trim()) && !isIns(q)).flatMap(q => q.o.filter(o => o !== q.a && GHEP.test(o.trim()) && !GHEP_OK.has(o.trim().toLowerCase())).map(o => F(q.n, `phương án "${o}" ghép thêm giới từ, đáp án "${q.a}" là một từ: nhiễu sai lộ liễu, đề thật không dùng`))); } },
  { ma: 'P5-HO-TU', muc: 'canh', ten: 'câu từ loại mà phương án không cùng gốc từ', goi_y: 'dạng "từ loại" dùng 4 dạng của cùng một từ', f: u => { if (u.sec !== 'p5' || u.x.t !== 'form') return []; const o = u.x.o.map(s => s.toLowerCase().split(' ')[0]);
    const k = Math.min(...o.map(a => a.length)) <= 4 ? 3 : 4, best = Math.max(...o.map(a => o.filter(b => b.slice(0, k) === a.slice(0, k)).length)); return best >= 3 ? [] : [F(u.a, 'phương án: ' + u.x.o.join(' · '))]; } }, // v154: từ ngắn (easy · ease) so 3 chữ đầu
  { ma: 'P6-HOA', muc: 'loi', ten: 'chỗ trống đầu câu mà đáp án không viết hoa', goi_y: 'viết hoa chữ đầu phương án', f: u => { if (u.sec !== 'p6') return []; const t = u.x.text;
    return u.qs.flatMap(q => { const i = t.indexOf('{' + (q.gi + 1) + '}'); if (i < 0) return [F(q.n, 'đoạn thiếu chỗ {' + (q.gi + 1) + '}')]; const before = t.slice(0, i).trimEnd();
      const start = !before || /[.!?:]["”]?\s*["“]?$/.test(before) || /\n\s*["“]?$/.test(t.slice(0, i)); if (isIns({ o: q.o }) || q.o.every(o => /[.!?]$/.test(o))) return [];
      return start && !q.o.every(o => /^[A-Z]/.test(o)) ? [F(q.n, 'đầu câu, phương án: ' + q.o.join(' · '))] : !start && q.o.some(o => /^[A-Z]/.test(o) && !/^I\b/.test(o)) ? [F(q.n, 'giữa câu mà phương án viết hoa: ' + q.o.join(' · '))] : []; }); } },
  { ma: 'P6-CHEN-CO', muc: 'loi', ten: 'câu chèn đáp án đã có trong đoạn', goi_y: 'viết câu chèn mới', f: u => u.sec === 'p6' ? u.qs.filter(q => q.o.every(o => /[.!?]$/.test(o)) && norm(u.x.text).includes(norm(q.a))).map(q => F(q.n, q.a)) : [] },
  { ma: 'P6-THI-MOC', muc: 'canh', ten: 'chỗ chọn thì mà quanh đó không có mốc thời gian', goi_y: 'thêm mốc (next week, last month, since…) vào câu đó hoặc câu kề', f: u => { if (u.sec !== 'p6') return []; const S = sents(u.x.text);
    return u.qs.filter(q => q.src.t === 'tense').flatMap(q => { const i = S.findIndex(s => s.includes('{' + (q.gi + 1) + '}')), ctx = S.slice(Math.max(0, i - 1), i + 2).join(' ').replace(/\{\d\}/g, ' ');
      return /\b(next|last|ago|since|by|until|tomorrow|yesterday|today|tonight|currently|now|already|yet|recently|soon|this (week|month|year|morning|afternoon|evening|spring|summer|fall|autumn|winter)|will|would|starting|beginning|before|after|when|while|during|monday|tuesday|wednesday|thursday|friday|saturday|sunday|january|february|march|april|may|june|july|august|september|october|november|december|\d{4}|past|future|upcoming|later|earlier|previously|recent|has|have|had)\b/i.test(ctx) ? [] : [F(q.n, 'quanh chỗ (' + (q.gi + 1) + '): ' + ctx.slice(0, 80))]; }); } },
  // ---- Part 7 ----
  { ma: 'P7-GIO', muc: 'loi', ten: 'giờ trong chuỗi tin nhắn sai thứ tự / câu ý định trích sai dòng', goi_y: 'sắp giờ tăng dần; câu ý định trích đúng dòng có giờ đó', f: u => { if (u.sec !== 'p7') return []; const out = [];
    const tm = s => { const m = /(\d{1,2}):(\d{2})\s*([AP])\.?M\.?/i.exec(s); if (!m) return null; let h = +m[1] % 12; if (/p/i.test(m[3])) h += 12; return h * 60 + +m[2]; };
    for (const d of u.x.docs) { const L = d.text.split('\n').filter(l => /^[^:\[(]{1,40}[\[(]\s*\d{1,2}:\d{2}\s*[AP]\.?M\.?\s*[\])]/i.test(l)); let p = -1;
      for (const l of L) { const t = tm(l); if (t < p) out.push(FU(u, 'giờ đi lùi: ' + l.slice(0, 50))); p = t; } }
    for (const q of u.qs) { const m = /^At (\d{1,2}:\d{2} [AP]\.M\.),.*?\bwrites?,\s*["“]([^"”]+)["”]/i.exec(q.stem); if (!m) continue;
      const line = u.x.docs.flatMap(d => d.text.split('\n')).find(l => l.includes(m[1]));
      if (!line) out.push(F(q.n, 'không có dòng giờ ' + m[1])); else if (!norm(line).includes(norm(m[2]))) out.push(F(q.n, `"${m[2]}" không ở dòng ${m[1]}`)); }
    return out; } },
  { ma: 'P7-TINH', muc: 'loi', gt: 1, ten: 'phép tính trong giải thích sai', goi_y: 'tính lại', f: u => { if (u.sec !== 'p7') return []; const out = [], num = s => +String(s).replace(/[$,]/g, '').replace(/\.$/, '');
    for (const q of u.qs) { const w = q.src.why || '';
      // giờ đồng hồ (10:00 + 6 giờ = 16:00) tính riêng; phép tính số bỏ số nằm trong giờ (v154: trước đọc nhầm "00 + 6 giờ = 16")
      for (const m of w.matchAll(/(\d{1,2}):(\d{2})\s*\+\s*(\d+(?:[.,]\d+)?)\s*giờ\s*=\s*(\d{1,2}):(\d{2})/g)) { const r = (+m[1] * 60 + +m[2] + Math.round(+m[3].replace(',', '.') * 60)) % 1440, c = +m[4] * 60 + +m[5];
        if (r !== c) out.push(F(q.n, `"${m[0]}": đúng là ${Math.floor(r / 60)}:${String(r % 60).padStart(2, '0')}`)); }
      for (const m of w.matchAll(/(?<![\d:.])(\$?\d[\d,]*(?:\.\d+)?)(?!:\d)\s*(?:[^\d$=+×*−\-–\n]{0,12}?)\s*([+×*−\-–])\s*(\$?\d[\d,]*(?:\.\d+)?)\s*(?:[^\d$=\n]{0,12}?)\s*=\s*(\$?\d[\d,]*(?:\.\d+)?)(?![\d:])/g)) {
        const [a, op, b, c] = [num(m[1]), m[2], num(m[3]), num(m[4])], r = op === '+' ? a + b : /[×*]/.test(op) ? a * b : a - b; if (Math.abs(r - c) > 0.001) out.push(F(q.n, `"${m[0]}": đúng là ${r}`)); }
      for (const m of w.matchAll(/(\$?\d[\d,]*)\s*,?\s*trừ\s*(\$?\d[\d,]*)[^→\n]{0,40}→\s*(\$?\d[\d,]*)/g)) { const r = num(m[1]) - num(m[2]); if (r !== num(m[3])) out.push(F(q.n, `"${m[0]}": đúng là ${r}`)); } }
    return out; } },
  { ma: 'P7-THU-NGAY', muc: 'loi', ten: 'cùng một ngày mà ghi 2 thứ khác nhau', goi_y: 'thống nhất thứ của ngày đó', f: u => { if (u.sec !== 'p7') return []; const map = {}, out = [];
    for (const m of docsText(u.x).matchAll(/\b(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday),?\s+(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{1,2})\b/g)) {
      const k = m[2] + ' ' + m[3]; if (map[k] && map[k] !== m[1]) out.push(FU(u, `${k} vừa là ${map[k]} vừa là ${m[1]}`)); map[k] = m[1]; }
    return out; } },
  { ma: 'P7-CHEN-CO', muc: 'loi', ten: 'câu chèn [1]–[4] đã có trong bài', goi_y: 'viết câu chèn mới', f: u => u.sec === 'p7' ? u.qs.filter(isIns).flatMap(q => { const m = /["“]([^"”]+)["”]/.exec(q.stem); return m && norm(docsText(u.x)).includes(norm(m[1])) ? [F(q.n, m[1])] : []; }) : [] },
  { ma: 'P7-NOT', muc: 'canh', ten: 'câu NOT: đáp án có đủ trong bài, hoặc phương án "có nói" không thấy trong bài', goi_y: 'đáp án NOT phải không có trong bài; 3 phương án kia phải có', f: u => { if (u.sec !== 'p7') return []; const D = cw(docsText(u.x));
    const sup = o => { const c = cw(o); return c.length ? c.filter(x => D.some(y => sameW(x, y))).length / c.length : 1; };
    return u.qs.filter(isNot).flatMap(q => { const out = []; if (sup(q.a) >= 0.99 && cw(q.a).length >= 2) out.push(F(q.n, `đáp án "${q.a}" có đủ chữ trong bài`));
      for (const w of q.o.filter(o => o !== q.a)) if (sup(w) < 0.34) out.push(F(q.n, `"${w}" (phải là điều bài có nói) gần như không có chữ nào trong bài`)); return out; }); } },
  { ma: 'P7-SO', muc: 'canh', gt: 1, ten: 'số trong đáp án không có trong bài và không có phép tính', goi_y: 'ghi phép tính vào giải thích hoặc sửa số', f: u => { if (u.sec !== 'p7') return []; const D = numTok(docsText(u.x));
    return u.qs.flatMap(q => { const n = (q.a.replace(/(\d),(\d{3})/g, '$1$2').match(/\d+/g) || []); if (!n.length) return []; const miss = n.filter(t => !D.includes(t)); if (!miss.length) return [];
      return /[=+×→]|trừ|cộng|nhân/.test(q.src.why || '') ? [] : [F(q.n, `đáp án "${q.a}" có số ${miss.join(', ')} không có trong bài, giải thích không có phép tính`)]; }); } },
];
// luật cấp đề (so các bài trong cùng một đề; v153, loại lỗi giải mù Đề 1–2 chỉ ra: 2 bài trả áo "hết cỡ", 2 cuộc gọi nhắc lịch hẹn, tên người / tên hiệu lặp)
const LAP_WHO = s => norm(s).replace(/\bthe (man|woman|men|women|speaker|speakers|listener|listeners|caller|writer)\b/g, 'X');
const TEN_RE = /\b([A-Z][a-z]+)(?= ([A-Z][a-z]{2,}(?:-[A-Z][a-z]+)?)\b)/g;   // nhìn trước để không nuốt tên sau từ viết hoa đầu câu ("Contact Maria Lopez")
const TEN_NO = new Set('street avenue road hotel center centre tower room hall building park bank station airport library museum office department company inc ltd january february march april may june july august september october november december monday tuesday wednesday thursday friday saturday sunday'.split(' '));
const HIEU_RE = /\b([A-Z][a-z]+(?: [A-Z][a-z]+)?) (Hotel|Inn|Tower|Catering|Bank|Clinic|Supplies|Electronics|Fitness|Design|Logistics|Consulting|Market|Airlines|Motors|Foods|Bikes|Conference Center|Library|Museum|Gallery|Theater|Mall|Insurance|Industries|Pharmacy|Restaurant|Café|Cafe|Bakery|Studio|Travel|Tours|Realty|Properties|Furniture|Printing|Cleaning|Software|Systems|Solutions|Office Supplies)\b/g;
const HIEU_NO = new Set('the city central main national grand royal north south east west new old first our your their this that a an'.split(' '));
const HIEU_DAU = new Set('visit contact call welcome join dear please thank thanks at from to the our your their this that a an in on for with by about see try ask email write meet choose book stay shop dine'.split(' '));
const hieuOf = s => { const w = s.split(' '); return (w.length > 1 && HIEU_DAU.has(w[0].toLowerCase()) ? w[1] : w[0]); };
const unitText = u => { const x = u.x; return [u.sec === 'p3' ? x.lines.map(l => l[1]).join(' ') : x.text || '', ...(x.docs || []).map(d => d.title + ' ' + d.text), x.title || '', x.s || '', x.q || '', ...(x.o || []), ...(x.qs || []).flatMap(q => [q.q, q.a, ...q.w]), ...(x.gaps || []).flatMap(g => g.o)].join(' '); };
// v155 (specs/012-so-loi-soan-de R7): luật để không tái phạm lỗi giải mù chỉ ra ở Đề 1–8
const NUMW = /\d|\b(one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|fifteen|twenty|thirty|forty|fifty|sixty|hundred|noon|o'clock|half|monday|tuesday|wednesday|thursday|friday|saturday|sunday|january|february|march|april|may|june|july|august|september|october|november|december)\b/i;
const MAN_RE = /\b(man|men|boy|gentleman)\b/i, WOMAN_RE = /\b(woman|women|girl|lady)\b/i, EM_M = /\u{1F468}|\u{1F474}|\u{1F9D4}|\u{1F466}|\u2642/u, EM_F = /\u{1F469}|\u{1F475}|\u{1F467}|\u2640/u;
RULES.push(
  { ma: 'C-SO-KHUON', muc: 'canh', ten: 'phương án có số / giờ / ngày nhưng không cùng khuôn nên app không xếp tăng dần được', goi_y: 'viết cùng khuôn, số bằng chữ số (About 5 minutes · About 10 minutes; 2 business days · 3 business days)', f: u => {
    if (!/^p[347]$/.test(u.sec)) return []; return u.qs.filter(q => !q.o.every(t => /^\[\d\]$/.test(t)) && q.o.every(t => String(t).split(/\s+/).length <= 5) && q.o.filter(t => NUMW.test(t)).length >= 3 && !TQ.tqNat(q.o))
      .map(q => F(q.n, 'phương án: ' + q.opts.join(' · '))); } },
  { ma: 'P34-THUTU', muc: 'canh', ten: 'câu hỏi Part 3–4 không theo thứ tự lời nói (câu trích của câu sau nằm trước câu trước)', goi_y: 'đổi thứ tự câu hỏi theo thứ tự thông tin trong bài', f: u => {
    if (u.sec !== 'p3' && u.sec !== 'p4') return []; const tr = norm(talkText(u)), out = []; let last = -1, lastN = 0;
    for (const q of u.qs) { const ev = q.src && q.src.ev, p = ev && (q.src.ty || TQ.tqQt(q.stem)) !== 'gist' ? tr.indexOf(norm(ev)) : -1; if (p < 0) continue; if (p + 20 < last) out.push(F(q.n, `thông tin của câu ${q.n} đứng trước thông tin của câu ${lastN} trong bài`)); if (p > last) { last = p; lastN = q.n; } }   // câu hỏi chung (Vì sao gọi? Ở đâu?) đề thật hỏi trước: bỏ qua
    return out; } },
  { ma: 'P34-NGUYEN', muc: 'canh', ten: 'đáp án Part 3–4 (≥ 4 từ) chép nguyên văn lời nói', goi_y: 'diễn đạt lại như đề thật (vd. "an e-mail with the new date" → "Notification of a new date"); liệt kê đồ vật thì ghi "đã xem"', f: u => {
    if (u.sec !== 'p3' && u.sec !== 'p4') return []; const tr = ' ' + norm(talkText(u)) + ' ';
    return u.qs.filter(q => norm(q.a).split(' ').length >= 4 && tr.includes(' ' + norm(q.a) + ' ')).map(q => F(q.n, 'đáp án: ' + q.a)); } },
  { ma: 'P1-GIOI', muc: 'canh', ten: 'câu đúng Part 1 nói nam / nữ mà tranh không có hình người nam / nữ', goi_y: 'dùng emoji có giới tính (👨 👩 …) hoặc viết "A person"', f: u => {
    if (u.sec !== 'p1') return []; const q = u.qs[0], e = (u.x.pic && u.x.pic.e || []).map(x => x[0]).join(' ');
    return (MAN_RE.test(q.a) && !EM_M.test(e)) || (WOMAN_RE.test(q.a) && !EM_F.test(e)) ? [F(q.n, `"${q.a}" · tranh: ${e}`)] : []; } });
const NOI_LOAI = Object.fromEntries([['thêm ý', 'in addition|furthermore|moreover|additionally|also|besides|what is more'], ['trái ý', 'however|nevertheless|nonetheless|even so|in contrast|by contrast|on the other hand|still|yet'],
  ['kết quả', 'therefore|as a result|consequently|thus|hence|accordingly|for this reason'], ['ví dụ', 'for example|for instance|in particular|specifically'], ['thay thế', 'instead|alternatively|otherwise|rather']].flatMap(([c, w]) => w.split('|').map(x => [x, c])));
export const DE_RULES = [
  // v155 (specs/012-so-loi-soan-de): vị trí đáp án mỗi Part cân bằng, không quá CAN_RUN câu liền cùng chữ (người sáng lập 10/11/2026: "cân bằng cả 8 đề")
  { ma: 'C-CAN', muc: 'loi', ten: 'vị trí đáp án một Part lệch (chữ quá nhiều / quá ít) hoặc quá 3 câu liền cùng chữ', goi_y: 'dựng lại bằng tools/build-toeic.mjs (tự cân bằng); vẫn lệch thì đổi thứ tự phương án trong nguồn', f: U => { const out = [];
    for (const s of SECS) { const Q = U.filter(u => u.sec === s).flatMap(u => u.qs.map(q => ({ u, q }))); if (Q.length < 10) continue; const k = s === 'p2' ? 3 : 4, [lo, hi] = canRange(Q.length, k), L = Q.map(({ q }) => q.L);   // Part 1 (6 câu) do người soạn đặt
      const c = 'ABCD'.slice(0, k).split('').map(x => L.filter(y => y === x).length), r = canRuns(L);
      if (c.some(x => x < lo || x > hi) || r > CAN_RUN) out.push({ u: Q[0].u, ...F(Q[0].q.n, `Part ${s.slice(1)}: ${'ABCD'.slice(0, k).split('').map((x, i) => x + ' ' + c[i]).join(' · ')} (cần ${lo}–${hi} mỗi chữ), chuỗi dài nhất ${r} câu`) }); }
    return out; } },
  { ma: 'C-LAP-NOI', muc: 'canh', ten: 'Part 6 một đề có cùng một từ nối là đáp án 2 lần, hoặc ≥ 3 đáp án từ nối cùng loại', goi_y: 'đổi một chỗ sang từ nối loại khác (thêm ý / trái ý / kết quả / điều kiện)', f: U => { const out = [], seen = {}, cat = {};
    for (const u of U) { if (u.sec !== 'p6') continue; for (const q of u.qs) { const a = String(q.a).trim().replace(/,$/, '').toLowerCase(), c = NOI_LOAI[a]; if (!c) continue;
      if (seen[a]) out.push({ u, ...F(q.n, `"${q.a}" đã là đáp án câu ${seen[a]}`) }); else seen[a] = q.n;
      (cat[c] = cat[c] || []).push(q.n); if (cat[c].length === 3) out.push({ u, ...F(q.n, `3 đáp án từ nối cùng loại "${c}": câu ${cat[c].join(', ')}`) }); } }
    return out; } },
  { ma: 'C-LAP-CAU', muc: 'canh', ten: 'câu hỏi + đáp án lặp lại ở 2 bài trong cùng đề (tình huống trùng)', goi_y: 'thay một bài bằng tình huống khác (kho còn bài chưa dùng) hoặc viết lại', f: U => { const seen = {}, out = [];
    for (const u of U) { if (!/^p[347]$/.test(u.sec)) continue; for (const q of u.qs) { const k = LAP_WHO(q.stem) + '|' + norm(q.a); const p = seen[k];
      if (p && p.u !== u) out.push({ u, ...F(q.n, `trùng câu ${p.q.n} (${p.u.x.id}): "${q.stem}" → "${q.a}"`) }); else if (!p) seen[k] = { u, q }; } }
    return out; } },
  { ma: 'C-LAP-TEN', muc: 'canh', ten: 'cùng một tên người / tên hiệu ở 2 bài khác nhau trong cùng đề', goi_y: 'đổi tên ở một bài', f: U => { const seen = {}, out = [];
    for (const u of U) { const t = unitText(u), here = new Set();
      for (const m of t.matchAll(TEN_RE)) { const a = m[1].toLowerCase(), b = m[2].toLowerCase(); if ((NAME_F.has(a) || NAME_M.has(a)) && !TEN_NO.has(b)) here.add(m[1] + ' ' + m[2]); }
      for (const m of t.matchAll(HIEU_RE)) { const h = hieuOf(m[1]), b = h.toLowerCase(); if (!HIEU_NO.has(b) && !HIEU_DAU.has(b) && !NAME_F.has(b) && !NAME_M.has(b)) here.add(h + ' (tên hiệu)'); }
      for (const nm of here) { const p = seen[nm]; if (p && p !== u) out.push({ u, ...FU(u, `"${nm.replace(' (tên hiệu)', '')}" đã có ở bài ${p.a}–${p.b} (${p.x.id})`) }); else if (!p) seen[nm] = u; } }
    return out; } },
];
// luật giải mù (chạy riêng vì cần tệp kết quả)
export const GM_RULES = [
  { ma: 'GM-CHUA', muc: 'canh', khoa: 1, ten: 'đề / câu chưa giải mù', goi_y: 'node tools/giai-mu.mjs xuat … rồi giao phiên Claude phụ' },
  { ma: 'GM-CU', muc: 'canh', khoa: 1, ten: 'câu đã sửa sau lần giải mù', goi_y: 'giải lại câu đó (giai-mu.mjs xuat --cau)' },
  { ma: 'GM-LECH', muc: 'canh', ten: 'phiên giải mù chọn khác đáp án', goi_y: 'đọc lại: sửa cho chỉ còn một đáp án, hoặc ghi lý do đáp án gốc đúng' },
  { ma: 'GM-HAI', muc: 'canh', ten: 'phiên giải mù thấy 2 phương án đều được', goi_y: 'sửa phương án thứ hai cho rõ là sai, hoặc ghi lý do' },
];
export const ALL_RULES = [...RULES, ...DE_RULES, ...GM_RULES];
// v155 (specs/012): mã cho các kiểm nằm ở bộ dựng (tools/build-toeic.mjs) và test (tools/test/run.mjs), để sổ lỗi soạn đề trỏ tới
export const DUNG_RULES = [
  { ma: 'D-CO-CAU', muc: 'loi', noi: 'dung', ten: 'cơ cấu đề và dạng câu tối thiểu (số câu từng Part, bài có bảng, 3 người nói, chuỗi tin nhắn…)' },
  { ma: 'D-TRUNG', muc: 'loi', noi: 'dung', ten: 'câu / bài trùng nguyên văn với kho luyện hoặc đề khác' },
  { ma: 'D-GAN-TRUNG', muc: 'loi', noi: 'dung', ten: 'câu Part 2 / Part 5 gần trùng kho hoặc đề khác (chỉ đổi 1–2 chữ)' },
  { ma: 'D-KHUON', muc: 'loi', noi: 'dung', ten: 'bài Part 3 / 4 / 6 / 7 chép khuôn bài kho hoặc đề trước (đổi tên, giữ câu chữ)' },
  { ma: 'D-EV', muc: 'loi', noi: 'dung', ten: 'câu trích chứa đáp án phải có nguyên văn trong lời nghe / bài đọc' },
  { ma: 'D-DON', muc: 'loi', noi: 'dung', ten: 'đáp án Part 1 / Part 2 dồn một chữ cái' },
  { ma: 'D-P6-CHEN', muc: 'loi', noi: 'dung', ten: 'phương án sai của câu chèn Part 6 phải cùng chủ đề đoạn văn' },
  { ma: 'D-KHUON-ETS', muc: 'loi', noi: 'dung', ten: 'đề mới lệch khuôn Phần Đọc đo từ 8 đề ETS (độ dài, tỉ lệ dạng, đáp án lộ, mẫu câu hỏi, loại văn bản; tools/do-khuon.mjs)' },
  { ma: 'T-C80', muc: 'loi', noi: 'test', ten: 'test C80: đề mới giải không có bài (Part 7) đoán đúng ≤ KB_MAX, đề Đề 1–8 chỉ ghi số' },
  { ma: 'T-C64', muc: 'loi', noi: 'test', ten: 'test C64: màn đang thi ẩn thanh dưới, rời màn thì phần Nghe dừng' },
  { ma: 'T-C65', muc: 'loi', noi: 'test', ten: 'test C65: màn đề thử trọn ghi cấu trúc cả 200 câu, đầu màn câu a/200' },
  { ma: 'T-C70', muc: 'loi', noi: 'test', ten: 'test C70: app và máy kiểm cùng thứ tự phương án; bài làm cũ đổi chữ đúng' },
  { ma: 'T-TIEP-CAN', muc: 'nguoi', noi: 'quytrinh', ten: 'kiểm tiếp cận mỗi lần đổi giao diện: tương phản ≥ 4,5 : 1, vùng bấm ≥ 44 px (.claude/CLAUDE.md)' }];
// tiêu chí người soát `H-*` đọc từ bộ tiêu chí
export function hRules() { const t = fs.readFileSync(root + 'docs/TIEU-CHI-DE-TOEIC.md', 'utf8'), out = [];
  for (const m of t.matchAll(/^- `(H-[A-Z-]+)` · (.+)$/gm)) out.push({ ma: m[1], muc: 'nguoi', noi: 'tieuchi', ten: (t => t.length > 120 ? t.slice(0, 118).replace(/\s\S*$/, '') + '…' : t)(m[2].replace(/\*\*/g, '').split(/[.:]\s| \(vd/)[0]) });
  return out; }

// ---------- chạy ----------
export function loadAck() { return has('content/toeic/kiem-ok.json') ? rd('content/toeic/kiem-ok.json').ok || [] : []; }
export function loadGm(de) { const f = 'content/toeic/giai-mu/' + de + '.json'; return has(f) ? rd(f) : null; }
// kiểm một đơn vị (dùng cho bộ câu cài lỗi): sec + x như dữ liệu đã dựng
export function kiemUnit(sec, x, de = 'mau') { const d = { id: de }; for (const s of SECS) d[s] = s === sec ? [x] : []; const [u] = units(d); return RULES.flatMap(r => r.f(u).map(f => ({ ...f, ma: r.ma, muc: r.muc }))); }
// kiểm nhiều đơn vị như một đề (mẫu cho luật cấp đề): list = [{ sec, x }]
export function kiemUnits(list, de = 'mau') { const d = { id: de }; for (const s of SECS) d[s] = list.filter(c => c.sec === s).map(c => c.x); const U = units(d); return [...U.flatMap(u => RULES.flatMap(r => r.f(u).map(f => ({ ...f, ma: r.ma, muc: r.muc })))), ...DE_RULES.flatMap(r => r.f(U).map(f => ({ ...f, u: undefined, ma: r.ma, muc: r.muc })))]; }
export function kiemDe(de, opt = {}) { const ack = opt.ack || loadAck(), gm = opt.gm === undefined ? loadGm(de.id) : opt.gm, U = units(de), out = [];
  for (const u of U) { const d0 = dau(u), d1 = dau(u, 1);
    for (const r of RULES) for (const f of r.f(u)) { const q = u.qs.find(q => q.n === f.n) || u.qs[0], id = f.unit || u.qs.length === 1 ? u.x.id : u.x.id + '#' + q.k;
      const dd = r.gt ? d1 : d0, a = r.muc === 'canh' ? ack.find(k => k.id === id && k.ma === r.ma && k.dau === dd) : null;
      out.push({ de: de.id, n: f.n, id, sec: u.sec, ma: r.ma, muc: r.muc, ly_do: f.ly_do, goi_y: f.goi_y || r.goi_y, dau: dd, da_xem: a ? a.ly_do : null, L: q.L }); }
    for (const q of u.qs) { const id = u.qs.length > 1 ? u.x.id + '#' + q.k : u.x.id, g = gm && gm.cau && gm.cau[q.n];
      const push = (ma, ly_do) => { const r = GM_RULES.find(r => r.ma === ma), a = !r.khoa ? ack.find(k => k.id === id && k.ma === ma && k.dau === d0) : null; out.push({ de: de.id, n: q.n, id, sec: u.sec, ma, muc: r.muc, ly_do, goi_y: r.goi_y, dau: d0, da_xem: a ? a.ly_do : null, L: q.L }); };
      if (!g) { if (gm) push('GM-CHUA', 'câu chưa có trong kết quả giải mù'); continue; }
      if (g.id !== id || g.dau !== d0) { push('GM-CU', 'câu đã đổi sau lần giải mù ' + (g.ngay || '')); continue; }
      const LL = t => t == null ? null : 'ABCD'[q.opts.indexOf(t)] || '?', ch = g.chon_t != null ? LL(g.chon_t) : g.chon, h2 = g.hai_t != null ? LL(g.hai_t) : g.hai;   // v155: so theo chữ của phương án
      if (ch !== q.L) push('GM-LECH', `giải mù chọn ${ch} (chắc ${g.chac}/3), đáp án ${q.L}${g.ghi ? ' · ghi chú: ' + g.ghi : ''}`);
      else if (h2) push('GM-HAI', `giải mù chọn đúng ${q.L} nhưng thấy ${h2} cũng được${g.ghi ? ' · ghi chú: ' + g.ghi : ''}`); } }
  for (const r of DE_RULES) for (const f of r.f(U)) { const u = f.u, q = u.qs.find(q => q.n === f.n) || u.qs[0], id = f.unit || u.qs.length === 1 ? u.x.id : u.x.id + '#' + q.k, dd = dau(u);
    const a = ack.find(k => k.id === id && k.ma === r.ma && k.dau === dd); out.push({ de: de.id, n: f.n, id, sec: u.sec, ma: r.ma, muc: r.muc, ly_do: f.ly_do, goi_y: f.goi_y || r.goi_y, dau: dd, da_xem: a ? a.ly_do : null, L: q.L }); }
  if (!gm) out.push({ de: de.id, n: 1, id: de.id, sec: 'p1', ma: 'GM-CHUA', muc: 'canh', ly_do: 'đề chưa giải mù (chưa có content/toeic/giai-mu/' + de.id + '.json)', goi_y: GM_RULES[0].goi_y, dau: '', da_xem: null, L: '' });
  return out; }
export function kiemTatCa(only, opt = {}) { const T = loadTests().filter(d => !only || !only.length || only.includes(d.id)), ack = loadAck(), R = {};
  for (const d of T) R[d.id] = { t: d.t, f: kiemDe(d, { ack, ...opt }), gm: loadGm(d.id) };
  const all = Object.values(R).flatMap(r => r.f), used = new Set(all.filter(f => f.da_xem).map(f => f.id + '|' + f.ma + '|' + f.dau));
  return { R, loi: all.filter(f => f.muc === 'loi').length, canh: all.filter(f => f.muc === 'canh' && !f.da_xem).length, xem: all.filter(f => f.da_xem).length, cu: ack.filter(k => !used.has(k.id + '|' + k.ma + '|' + k.dau)) }; }

// báo cáo HTML cho người sáng lập (docs/kiem-de-toeic.html; dựng ra, không sửa tay)
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const gmLan = L => { const seen = new Set(), v1 = [0, 0], re = [0, 0]; for (const l of L) { const t = seen.has(l.phan) ? re : v1; seen.add(l.phan); t[0] += l.khop; t[1] += l.cau; }
  return 'vòng đầu ' + v1[0] + ' / ' + v1[1] + ' khớp' + (re[1] ? '; giải lại câu đã sửa ' + re[0] + ' / ' + re[1] : ''); };
export function html(K) { const row = f => `<tr class="${f.muc}${f.da_xem ? ' xem' : ''}"><td>${f.n}${f.L ? ' <small>(' + f.L + ')</small>' : ''}</td><td>${PART(f.sec)}</td><td><code>${esc(f.ma)}</code></td><td>${esc(f.ly_do)}${f.da_xem ? '<br><small>✓ đã xem: ' + esc(f.da_xem) + '</small>' : '<br><small>→ ' + esc(f.goi_y) + '</small>'}</td></tr>`;
  const sec = Object.entries(K.R).map(([id, r]) => { const loi = r.f.filter(f => f.muc === 'loi'), canh = r.f.filter(f => f.muc === 'canh' && !f.da_xem), xem = r.f.filter(f => f.da_xem), g = r.gm, gl = g ? g.lan || [] : [];
    const kh = g && g.cau ? Object.values(g.cau) : [], khop = kh.filter(c => c.chon === c.da).length;
    return `<section><h2>${esc(r.t)} <small>(${id})</small></h2><p class="sum">${loi.length} lỗi · ${canh.length} cảnh báo chưa xem · ${xem.length} đã xem · giải mù ${g ? khop + ' / ' + kh.length + ' câu khớp đáp án' : 'chưa làm'}${g && g.lan && g.lan.length ? ' <small>(' + gmLan(g.lan) + ')</small>' : ''}</p>
${[...loi, ...canh].length ? `<table><tr><th>Câu</th><th>Part</th><th>Luật</th><th>Vì sao</th></tr>${[...loi, ...canh].map(row).join('')}</table>` : '<p class="ok">✅ Không còn lỗi hay cảnh báo chưa xem.</p>'}
${xem.length ? `<details><summary>${xem.length} cảnh báo đã xem (ổn, có lý do)</summary><table>${xem.map(row).join('')}</table></details>` : ''}</section>`; }).join('\n');
  return `<!doctype html><html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Kiểm nội dung đề TOEIC</title>
<style>:root{--bg:#fff;--fg:#1d1d1f;--mute:#5f6368;--line:#dadce0;--bad:#b3261e;--warn:#8a5a00;--ok:#1e7d32;--link:#1a5fc8}@media (prefers-color-scheme:dark){:root{--bg:#121212;--fg:#ececec;--mute:#a0a4a8;--line:#3a3a3a;--bad:#ff8a80;--warn:#ffcc66;--ok:#81c995;--link:#8ab4f8}}a{color:var(--link)}
body{margin:0;padding:16px;background:var(--bg);color:var(--fg);font:16px/1.5 -apple-system,system-ui,sans-serif}h1{font-size:22px;margin:0 0 8px}h2{font-size:18px;margin:24px 0 4px}small,.sum{color:var(--mute)}
table{width:100%;border-collapse:collapse;font-size:14px}td,th{border-top:1px solid var(--line);padding:6px 4px;text-align:left;vertical-align:top}tr.loi td:nth-child(3){color:var(--bad)}tr.canh td:nth-child(3){color:var(--warn)}.ok{color:var(--ok)}code{font-size:12px}details{margin-top:8px}summary{min-height:44px;line-height:44px;cursor:pointer}</style></head>
<body><h1>Kiểm nội dung đề thử TOEIC</h1><p class="sum">Dựng bằng <code>node tools/kiem-toeic.mjs --html</code>. Tổng: ${K.loi} lỗi · ${K.canh} cảnh báo chưa xem · ${K.xem} đã xem. Luật: <a href="https://github.com/sonnguyen12394/English-CEFR/blob/main/docs/TIEU-CHI-DE-TOEIC.md">bộ tiêu chí</a>. Số câu và chữ cái đáp án như trong app. Nội dung Claude soạn, chưa giáo viên kiểm.</p>
${sec}</body></html>`; }

// ---------- lệnh ----------
if (import.meta.url === 'file://' + process.argv[1]) {
  const gi = process.argv.indexOf('--ghi');   // ghi "đã xem": --ghi <id> <ma> "<lý do vì sao câu đúng>"
  if (gi > 0) { const [id, ma, ly_do] = process.argv.slice(gi + 1, gi + 4), K = kiemTatCa(), f = Object.values(K.R).flatMap(r => r.f).find(f => f.id === id && f.ma === ma);
    if (!f) { console.error('không thấy cảnh báo ' + ma + ' ở ' + id); process.exit(1); }
    if (f.muc === 'loi' || (GM_RULES.find(r => r.ma === ma) || {}).khoa) { console.error(ma + ' không ghi "đã xem" được: phải sửa'); process.exit(1); }
    if (!ly_do || ly_do.length < 15) { console.error('lý do phải nói vì sao câu đúng (≥ 15 ký tự)'); process.exit(1); }
    const A = rd('content/toeic/kiem-ok.json'); A.ok = (A.ok || []).filter(k => !(k.id === id && k.ma === ma)); A.ok.push({ id, ma, dau: f.dau, ly_do, ngay: new Date().toISOString().slice(0, 10) });
    fs.writeFileSync(root + 'content/toeic/kiem-ok.json', JSON.stringify(A, null, 1) + '\n'); console.log('đã ghi: ' + id + ' ' + ma); process.exit(0); }
  const a = process.argv.slice(2), only = a.filter(x => /^de\d+$/.test(x)), all = a.includes('--tat-ca'), K = kiemTatCa(only);
  for (const [id, r] of Object.entries(K.R)) { const show = r.f.filter(f => all || !f.da_xem), g = r.gm, kh = g && g.cau ? Object.values(g.cau) : [];
    console.log(`\n== ${r.t} (${id}): ${r.f.filter(f => f.muc === 'loi').length} lỗi · ${r.f.filter(f => f.muc === 'canh' && !f.da_xem).length} cảnh báo chưa xem · ${r.f.filter(f => f.da_xem).length} đã xem · giải mù ${g ? kh.filter(c => c.chon === c.da).length + '/' + kh.length + ' khớp' : 'chưa làm'}`);
    for (const f of show.sort((x, y) => (x.muc === 'loi' ? 0 : 1) - (y.muc === 'loi' ? 0 : 1) || x.n - y.n)) console.log(`  câu ${f.n}${f.L ? ' (' + f.L + ')' : ''} · ${PART(f.sec)} · ${f.id} · ${f.ma} · ${f.muc === 'loi' ? 'LỖI' : f.da_xem ? 'đã xem' : 'cảnh báo'} · ${f.ly_do}${f.da_xem ? ' · ✓ ' + f.da_xem : ' → ' + f.goi_y}`); }
  if (K.cu.length) console.log(`\n${K.cu.length} mục "đã xem" không còn khớp câu nào (câu đã sửa) → dọn khỏi content/toeic/kiem-ok.json: ${K.cu.map(k => k.id + ' ' + k.ma).join(', ')}`);
  console.log(`\nTổng: ${K.loi} lỗi · ${K.canh} cảnh báo chưa xem · ${K.xem} đã xem`);
  if (a.includes('--html')) { fs.writeFileSync(root + 'docs/kiem-de-toeic.html', html(K)); console.log('đã viết docs/kiem-de-toeic.html'); }
  process.exit(K.loi ? 1 : 0); }
