// 🏛 Phố Cấu Trúc (specs/020-thanh-pho-toeic, v196): phố thứ tám của 🏙 Thành phố TOEIC, chạy bằng động cơ phố của pho.js.
// Câu Part 5 "cấu trúc" (x.t 'struct'): so sánh, đảo ngữ, cặp cố định; + chỗ trống Part 6 chọn dạng so sánh. Mỗi đề ~2–3 câu.
// 3 cư dân = 3 nhóm cấu trúc, 8 luật. Bậc: ① Nhìn dấu hiệu (3 cư dân) → ② Luật nào (8 luật, chỉ câu kho) → ③ 3 phương án → ④ 4 phương án như đề.
// Kho: ctr.json (content/toeic/ctr.json qua tools/build-ctr.mjs) + câu thật của đề.
PH_ACCX.SS = (ink, sk) => `<path d="M30 30 h40" style="stroke:${ink};stroke-width:3"/><rect x="33" y="18" width="9" height="12" style="fill:#7cc4ff;stroke:${ink};stroke-width:2"/><rect x="46" y="10" width="9" height="20" style="fill:#7cc4ff;stroke:${ink};stroke-width:2"/><rect x="59" y="4" width="9" height="26" style="fill:#ffcf3d;stroke:${ink};stroke-width:2"/>`;
PH_ACCX.DN = (ink, sk) => `<path d="M36 12 A14 14 0 1 1 36 30" style="fill:none;stroke:#c45ad8;stroke-width:5;stroke-linecap:round"/><path d="M30 8 L37 13 L31 19" style="fill:none;stroke:#c45ad8;stroke-width:4;stroke-linecap:round;stroke-linejoin:round"/>`;
PH_ACCX.CD = (ink, sk) => `<circle cx="40" cy="20" r="9" style="fill:none;stroke:#e0567a;stroke-width:5"/><circle cx="60" cy="20" r="9" style="fill:none;stroke:#e0567a;stroke-width:5"/>`;
// 8 luật (bậc 2 bắt luật; 🧠 luật vững đếm theo luật)
const CT_QH = {
  shon: { e: '⬆️', n: 'So sánh hơn', w: 'than, much / far + -er, more + tính từ dài', t: 'SS' },
  snhat: { e: '🏆', n: 'So sánh nhất', w: 'the -est / the most, of the three, of all, by far', t: 'SS' },
  sbang: { e: '🟰', n: 'So sánh bằng', w: 'as … as, not as … as, as many / much … as', t: 'SS' },
  kep: { e: '🔁', n: 'Càng … càng', w: 'The more …, the -er …', t: 'SS' },
  dao: { e: '🔄', n: 'Đảo ngữ', w: 'Rarely, Never, Seldom, Only when / after, Not only + trợ động từ + chủ ngữ', t: 'DN' },
  dk: { e: '🔀', n: 'Điều kiện đảo', w: 'Had / Should / Were + chủ ngữ đầu câu (bỏ if)', t: 'DN' },
  sothat: { e: '🎯', n: 'Quá … đến nỗi', w: 'so + tính từ + that, such + danh từ + that, too + tính từ + to V', t: 'CD' },
  cap: { e: '👫', n: 'Cặp liên từ', w: 'not only … but also, both … and, either … or, neither … nor', t: 'CD' } };
// luật của câu đề: đọc câu + đáp án + nhãn lời giải
function ctLaw(s, a, lab) { const S = String(s || ''), x = String(a || '').toLowerCase().trim(), l = String(lab || '').toLowerCase(), pre = S.split('___')[0], post = S.split('___')[1] || '';
  if (/^\s*(had|should|were)\b/i.test(S) && /điều kiện|would|have/.test(l + ' ' + x)) return 'dk';
  if (/^(so|such|too)$/.test(x) || /so \+|such \+|too \+/.test(l)) return 'sothat';
  if (/^(but|and|or|nor)( also)?$/.test(x) && /\b(not only|both|either|neither)\b/i.test(pre)) return 'cap';
  if (/\b(rarely|never|seldom|hardly|scarcely|little|not only|only (after|when|if|by|then|once|in)|under no|at no|nowhere)\b/i.test(pre)) return 'dao';
  if (/^\s*the\b/i.test(S) && /,\s*(the\b|___)/i.test(S) || /^\s*the ___/i.test(S)) return 'kep';
  if (/so sánh bằng/.test(l) || /\bas ___ as\b|\b(as|so) ___\b.*\bas\b|___ as\b/i.test(S)) return 'sbang';
  if (/so sánh nhất/.test(l) || /^(the )?(most|least|best|worst)\b|est$/.test(x)) return 'snhat';
  if (/so sánh hơn/.test(l) || /\bthan\b/i.test(post)) return 'shon';
  if (/(tính từ|nguyên dạng)/.test(l) && /\bas\b/i.test(post)) return 'sbang';
  return null; }
const CT_OK = q => !!(q && phIn(q, 'ctr', () => false) && q.opts && q.opts.every(o => ((q.lg || {}).og || {})[o]));
function ctReal(q, d) { if (!CT_OK(q)) return null; const og = q.lg.og, src = phSrc(q); if (!src) return null;
  const r = ctLaw(src.s, q.a, og[q.a]); if (!r) return null; const T = CT_QH[r].t;
  const o = q.opts.map(w => { const L = String(og[w]); const bad = /sai|không chuẩn/.test(L.split(':')[0].toLowerCase()); return [w, bad ? '_' : T, bad ? L.trim() : L.split(':').slice(1).join(':').trim() || L.trim(), bad ? '' : w === q.a ? r : (ctLaw(src.s, w, L) || r)]; });
  for (const x of o) if (x[1] !== '_' && CT_QH[x[3]] && CT_QH[x[3]].t !== T) x[3] = r;   // phương án sai mang luật của nhóm đáp án
  const ly = String(q.lg.ly || q.why || ''), why = (ly.match(/^[^.!?]*[.!?]/) || [ly])[0].slice(0, 180);
  return Object.assign({ id: `de:${d.id}:${q.n}`, de: d.id, n: q.n, a: q.a, o, why, vi: q.lg.dich || '', real: 1, nha: null }, src); }
PH_PHO.ctr = { key: 'ctr', view: 'toeic-pho-cau-truc', ic: '🏛', ten: 'Phố Cấu Trúc', file: 'ctr.json', sub: 'So sánh, đảo ngữ, so … that, not only … but also · Part 5, Part 6',
  desc: 'Điều khiển bé Mầm bắt đúng cấu trúc. Tìm dấu hiệu trước: than, as … as, the … of, Rarely / Only when đầu câu, so … that, not only…',
  lo: 'cấu trúc câu', dau: 'Dấu hiệu', introSub: 'Chạm vào từng người để nghe họ giới thiệu. Nhớ dấu hiệu gọi mỗi người.',
  qhW: 'Luật', qhT: '8 luật cấu trúc', ORD: ['SS', 'DN', 'CD'], SHORT: { SS: 'Cô So Sánh', DN: 'Bác Đảo Ngữ', CD: 'Anh Cặp Đôi' }, NHA: {}, QH: CT_QH,
  CH: { SS: { name: 'Cô So Sánh', pos: 'So sánh', suf: 'than · the … of · as … as · the more …, the …', line: 'Thấy than thì dùng dạng hơn (bigger, more reliable). Thấy the … of the three hay by far thì dạng nhất. Thấy as … as thì giữ tính từ nguyên dạng.' },
    DN: { name: 'Bác Đảo Ngữ', pos: 'Đảo ngữ', suf: 'Rarely, Only when, Not only, Had … đầu câu', line: 'Câu mở đầu bằng Rarely, Never, Only when, Not only thì trợ động từ đứng TRƯỚC chủ ngữ: Rarely do we… Had đầu câu là câu điều kiện bỏ if.' },
    CD: { name: 'Anh Cặp Đôi', pos: 'Cặp cố định', suf: 'so … that · too … to · not only … but also · both … and', line: 'Tôi luôn đi thành cặp: thấy that ở vế sau thì so / such; thấy to V thì too; thấy not only thì vế sau là but also.' } },
  G: { SS: { q: 'Ai lo câu có than, as … as, the … of all?', ex: [['This model is', 'lighter', 'than the old one.'], ['Ours is the', 'cheapest', 'of the three offers.'], ['The new office is not as', 'large', 'as the old one.']], hint: 'than → dạng hơn; the … of the three → dạng nhất; as … as → nguyên dạng.', chant: 'Thấy than, as … as, the … of: gọi Cô So Sánh.' },
    DN: { q: 'Câu mở đầu bằng Rarely, Only when, Not only: ai đây?', ex: [['Rarely', 'do', 'we receive such large orders.'], ['Only after the meeting', 'did', 'the manager reply.'], ['', 'Had', 'we known, we would have called.']], hint: 'Từ phủ định / Only đầu câu: trợ động từ đứng trước chủ ngữ. Had đầu câu = If we had.', chant: 'Phủ định đầu câu: trợ động từ lên trước chủ ngữ.' },
    CD: { q: 'Ai luôn đi thành cặp với một chữ ở vế sau?', ex: [['The box was', 'so', 'heavy that two people carried it.'], ['Not only did prices fall,', 'but', 'sales also rose.'], ['The room is', 'too', 'small to hold forty guests.']], hint: 'so … that, not only … but also, too … to: nhìn vế sau để chọn chữ đầu cặp.', chant: 'Nhìn vế sau: that, to, but also.' } },
  MUC: { b1: { ten: '🔍 Bậc 1 · Nhìn dấu hiệu', sub: 'Tìm chữ mốc, bắt đúng cư dân · 3 cư dân, 5 tim', md: 'gh', k: 3, dur: [9, 9], tim: 5, goi: 99, moc: 1 },
    b2: { ten: '🧭 Bậc 2 · Luật nào', sub: 'Chữ mốc gọi luật nào: so sánh hơn, đảo ngữ, so … that… · 4 lựa chọn, 5 tim', md: 'qh', k: 4, dur: [10, 10], tim: 5, goi: 99, moc: 1 },
    b3: { ten: '🌿 Bậc 3 · Ghép cả hai', sub: 'Tìm mốc rồi chọn dạng · 3 phương án, 4 tim, 3 gợi ý', md: 'tu', k: 3, dur: [9, 9], tim: 4, goi: 3 },
    b4: { ten: '🔥 Bậc 4 · Đủ 4 phương án', sub: '4 phương án như đề thật · 3 tim, 1 gợi ý', md: 'tu', k: 4, dur: [8, 7], tim: 3, goi: 1 } },
  FIX: { ten: '🛠 Chữa câu', sub: '', md: 'tu', k: 4, dur: [9, 9], tim: 5, goi: 99, moc: 1, mau: 1 },
  help: { gh: 'Tìm chữ mốc được tô, bắt đúng cư dân. Chạm làn, vuốt hoặc bấm ◀ ▶.', qh: 'Chữ mốc được tô gọi luật nào? Bắt đúng luật. Chạm từ để tra nghĩa.' },
  mocHint: m => `💡 Nhìn chữ mốc được tô: <b>${esc(m)}</b>. Nó gọi so sánh, đảo ngữ hay một cặp?`,
  real: ctReal,
  sk: it => { const A = it.o.find(o => o[0] === it.a) || []; return A[3] || ''; },
  canFix: q => !!ctReal(q, { id: 0 }),
  fixLab: '🏛 Chữa ở Phố Cấu Trúc · điều khiển bé Mầm',
  rk: it => { const A = it.o.find(o => o[0] === it.a); return A && A[3]; },
  gl: Object.keys(CT_QH), glT: r => CT_QH[r] && CT_QH[r].t, rn: r => CT_QH[r] ? CT_QH[r].e + ' ' + CT_QH[r].n : r,
  ruleQ: q => { const it = ctReal(q, { id: 0 }); if (!it) return null; const A = it.o.find(o => o[0] === it.a); return A ? A[3] : null; } };
