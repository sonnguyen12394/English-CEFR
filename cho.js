// 🛒 Chợ Từ Vựng (specs/020-thanh-pho-toeic, v192): phố thứ sáu của 🏙 Thành phố TOEIC, chạy bằng động cơ phố của pho.js. Câu Part 5 từ vựng (x.t 'voc').
// 4 phương án cùng loại từ, khác nghĩa: dấu hiệu là cụm đi cặp, giới từ sau ô trống, hoặc ý cả câu. 3 cư dân (quầy) = 3 loại dấu hiệu.
// Bậc: ① Dấu hiệu ở đâu (3 cư dân, chữ mốc tô) → ② Bắt theo nghĩa (kiểu ván 'vi': cho nghĩa tiếng Việt, bắt từ tiếng Anh) → ③ 3 từ → ④ 4 từ như đề.
// Kho: cho.json (content/toeic/cho.json qua tools/build-cho.mjs) + câu thật Part 5 từ vựng, Part 6 chọn từ cùng loại (v194) và Part 7 từ gần nghĩa (v196:
//   câu trong bài chứa từ được hỏi thành ô trống, phSrcSyn ở pho.js; quầy Cô Nghĩa) của đề.
PH_ACCX.E = (ink, sk) => `<path d="M34 24 Q34 12 44 14 L50 20 L56 14 Q66 12 66 24" style="fill:none;stroke:#f08c3a;stroke-width:5;stroke-linecap:round"/><circle cx="50" cy="22" r="4" style="fill:#f08c3a;stroke:${ink};stroke-width:1.5"/>`;
PH_ACCX.F = (ink, sk) => `<path d="M30 26 h28" style="stroke:${ink};stroke-width:3;stroke-linecap:round"/><path d="M54 18 L66 26 L54 34" style="fill:none;stroke:#3a8ff0;stroke-width:4;stroke-linecap:round;stroke-linejoin:round"/>`;
PH_ACCX.J = (ink, sk) => `<path d="M50 6 C42 6 36 12 36 20 C36 26 40 28 42 32 L58 32 C60 28 64 26 64 20 C64 12 58 6 50 6 Z" style="fill:#ffe066;stroke:${ink};stroke-width:2.5"/><path d="M44 36 h12" style="stroke:${ink};stroke-width:2.5"/>`;
const CH_PREP = new Set(['for', 'with', 'of', 'to', 'in', 'on', 'about', 'from', 'at', 'by', 'into', 'as']);
// loại dấu hiệu của câu đề: giới từ ngay sau ô trống → F; cấu trúc lời giải có đáp án → E (cụm); còn lại → J (nghĩa cả câu)
function chTy(q, s) { if (q.sec === 'p7') return 'J'; const nx = (String(s).split('___')[1] || '').trim().toLowerCase().match(/^[a-z]+/); if (nx && CH_PREP.has(nx[0])) return 'F';
  const ct = String((q.lg || {}).ct || '').toLowerCase(), a = String(q.a).toLowerCase(); return ct && ct.includes(a.slice(0, Math.max(4, a.length - 2))) ? 'E' : 'J'; }
const CH_OK = q => !!(q && (phIn(q, 'cho', t => t === 'voc') || (q.sec === 'p7' && q.qt === 'syn')) && q.opts && q.opts.every(o => ((q.lg || {}).og || {})[o]));   // v194: + Part 6 chọn từ cùng loại
function chReal(q, d) { if (!CH_OK(q)) return null; const og = q.lg.og, src = phSrc(q); if (!src) return null; const s = src.s;
  const t = chTy(q, s), o = q.opts.map(w => [w, t, String(og[w]).split(':').slice(1).join(':').trim() || String(og[w]).trim()]);
  const ly = String(q.lg.ly || q.why || ''), why = (ly.replace(/^Đáp án "[^"]*"\s*[—–-]\s*/, '').match(/^[^.!?]*[.!?]/) || [ly])[0].slice(0, 200);
  return Object.assign({ id: `de:${d.id}:${q.n}`, de: d.id, n: q.n, a: q.a, o, why, vi: q.lg.dich || '', real: 1, nha: null }, src); }
PH_PHO.cho = { key: 'cho', view: 'toeic-pho-cho', ic: '🛒', ten: 'Chợ Từ Vựng', file: 'cho.json', sub: 'Cụm cố định, từ + giới từ, chọn theo nghĩa · Part 5, Part 6',
  desc: 'Bốn từ cùng loại, khác nghĩa. Tìm dấu hiệu trước: từ đi cặp, giới từ sau ô trống, hay ý cả câu, rồi điều khiển bé Mầm bắt đúng từ.',
  lo: 'từ vựng', dau: 'Dấu hiệu', introSub: 'Mỗi quầy bán một loại dấu hiệu. Chạm vào từng người để nghe họ giới thiệu.', noPos: 1,
  ORD: ['E', 'F', 'J'], SHORT: { E: 'Bà Cụm', F: 'Chú Giới', J: 'Cô Nghĩa' }, NHA: {},
  CH: { E: { name: 'Bà Cụm', pos: 'Cụm cố định', suf: 'từ đi cặp ngay cạnh ô trống', line: 'Có những từ luôn đi cặp: meet a deadline, place an order, highly recommended. Nhìn từ đứng sát ô trống rồi chọn bạn đi cặp với nó.' },
    F: { name: 'Chú Giới', pos: 'Từ + giới từ', suf: 'giới từ ngay sau ô trống', line: 'Thấy giới từ ngay sau ô trống thì gọi tôi: responsible FOR, comply WITH, consist OF. Từ gần nghĩa mà không đi với giới từ đó là sai.' },
    J: { name: 'Cô Nghĩa', pos: 'Nghĩa cả câu', suf: 'vì … nên …, để …', line: 'Khi không có cụm hay giới từ, đọc cả câu: lý do, mục đích, kết quả cho biết cần từ nghĩa gì.' } },
  G: { E: { q: 'Ai lo những từ luôn đi cặp với nhau?', ex: [['We worked late to', 'meet', 'the deadline.'], ['Call us to', 'place', 'an order.'], ['The hotel is', 'highly', 'recommended.']], hint: 'meet + deadline, place + order, highly + recommended: cụm cố định.', chant: 'Nhìn từ sát ô trống, chọn bạn đi cặp với nó.' },
    F: { q: 'Ai đứng ngay trước một giới từ cố định?', ex: [['Mr. Owens is', 'responsible', 'for training.'], ['Visitors must', 'comply', 'with the rules.'], ['The tour', 'consists', 'of three parts.']], hint: 'Sau ô trống là for, with, of: từ phải đi được với giới từ đó.', chant: 'Giới từ sau ô trống chọn giúp tôi.' },
    J: { q: 'Ai chọn theo ý cả câu?', ex: [['Sales were low, so the concert was', 'postponed', '.'], ['We hired more staff to', 'increase', 'production.'], ['Keep the receipt for a', 'refund', '.']], hint: 'Không có cụm hay giới từ: lý do và mục đích trong câu quyết định.', chant: 'Đọc cả câu: vì gì, để làm gì.' } },
  MUC: { b1: { ten: '🔍 Bậc 1 · Dấu hiệu ở đâu', sub: 'Cụm đi cặp, giới từ hay ý cả câu · 3 quầy, 5 tim', md: 'gh', k: 3, dur: [9, 9], tim: 5, goi: 99, moc: 1 },
    b2: { ten: '🇻🇳 Bậc 2 · Bắt theo nghĩa', sub: 'Cho nghĩa tiếng Việt, bắt đúng từ tiếng Anh · 4 từ, 5 tim', md: 'vi', k: 4, dur: [10, 10], tim: 5, goi: 99, moc: 1 },
    b3: { ten: '🌿 Bậc 3 · Ghép cả hai', sub: 'Tìm dấu hiệu rồi chọn từ · 3 từ, 4 tim, 3 gợi ý', md: 'tu', k: 3, dur: [9, 9], tim: 4, goi: 3 },
    b4: { ten: '🔥 Bậc 4 · Đủ 4 từ', sub: '4 từ cùng loại như đề thật · 3 tim, 1 gợi ý', md: 'tu', k: 4, dur: [8, 7], tim: 3, goi: 1 } },
  FIX: { ten: '🛠 Chữa câu', sub: '', md: 'tu', k: 4, dur: [9, 9], tim: 5, goi: 99, moc: 1 },
  help: { gh: 'Nhìn chữ được tô: dấu hiệu là cụm đi cặp, giới từ hay ý cả câu? Chạm làn, vuốt hoặc bấm ◀ ▶.', vi: 'Đọc nghĩa tiếng Việt, bắt đúng từ tiếng Anh hợp với câu. Chạm từ trong câu để tra.' },
  mocHint: m => `💡 Nhìn chữ được tô: <b>${esc(m)}</b>. Từ nào đi được với nó?`,
  missSay: (it, got) => `${esc(got.w)} = ${esc(got.m)}: không hợp ở đây.`,
  real: chReal,
  sk: it => { const A = it.o.find(o => o[0] === it.a) || []; return A[1] || ''; },
  canFix: q => !!(CH_OK(q) && chReal(q, { id: 0 })),
  fixLab: '🛒 Chữa ở Chợ Từ Vựng · điều khiển bé Mầm' };
