// 🌉 Phố Cầu Nối (specs/020-thanh-pho-toeic, v181): phố thứ hai của 🏙 Thành phố TOEIC, chạy bằng động cơ phố của pho.js.
// Dạy giới từ / liên từ / trạng từ nối (Part 5 prep, conj; Part 6 từ nối). Cư dân = loại cầu nối, "dấu hiệu" = phần đứng SAU ô trống.
// Bậc: ① Nhìn phía sau (cụm danh từ / mệnh đề / câu mới) → ② Hai vế quan hệ gì (8 kiểu) → ③ ghép 3 từ → ④ đủ 4 từ như đề.
// Kho: cau.json (content/toeic/cau.json qua tools/build-cau.mjs) + câu thật Part 5 giới từ / liên từ người học từng sai. v194: thêm chỗ trống Part 6 từ nối (câu chứa ô trống + câu trước, cả đoạn gập).
PH_ACCX.G = (ink, sk) => `<rect x="34" y="18" width="32" height="14" rx="2" style="fill:#d9653b;${sk}"/><path d="M34 25h32M50 18v7M42 25v7M58 25v7" style="stroke:${ink};stroke-width:2"/>`;
PH_ACCX.L = (ink, sk) => `<path d="M22 32 Q50 2 78 32" style="fill:none;stroke:#8a5cf0;stroke-width:6;stroke-linecap:round"/><path d="M34 22v10M50 17v15M66 22v10" style="stroke:${ink};stroke-width:2.5"/>`;
PH_ACCX.T = (ink, sk) => `<ellipse cx="38" cy="22" rx="10" ry="6" style="fill:none;stroke:#2a9d8f;stroke-width:5"/><ellipse cx="62" cy="22" rx="10" ry="6" style="fill:none;stroke:#2a9d8f;stroke-width:5"/><path d="M45 22h10" style="stroke:${ink};stroke-width:2"/>`;
const CN_QH = {
  them: { e: '➕', n: 'Thêm ý', w: 'and, as well as, in addition, moreover, besides' },
  doi: { e: '↔️', n: 'Đối lập', w: 'although, despite, however, while, whereas, but' },
  vi: { e: '❓', n: 'Nguyên nhân', w: 'because, because of, due to, since, as' },
  kq: { e: '➡️', n: 'Kết quả', w: 'so, therefore, as a result, consequently' },
  tg: { e: '⏱', n: 'Thời gian', w: 'when, once, during, by, until, before, after' },
  dk: { e: '🔀', n: 'Điều kiện', w: 'if, unless, provided that, as long as, otherwise' },
  md: { e: '🎯', n: 'Mục đích', w: 'so that, in order that, for' },
  vt: { e: '📍', n: 'Vị trí, cách thức', w: 'in, on, at, by, with, through, according to' } };
// v194: phân loại một phương án (Part 5 + Part 6 từ nối): G / L / T, '_' = khác loại (cụm để, trạng từ thường…), null = không rõ
const CN_TADV = /^(meanwhile|instead|however|therefore|otherwise|moreover|furthermore|nevertheless|consequently|thus|besides|likewise|similarly|afterward|afterwards|in addition|as a result|for example|in fact|in contrast)$/;
function cnCls(w, lab, s) { const t = CN_TY(lab); if (t) return t; const k = String(lab || '').split(':')[0].trim().toLowerCase(), x = String(w || '').toLowerCase().trim().replace(/,$/, '');
  if (/giới từ\s*\/\s*liên từ|liên từ\s*\/\s*giới từ/.test(k)) { const b = (String(s || '').split('___')[1] || '').trim().toLowerCase().split(/[,.;:!?]/)[0];
    if (!b) return null; if (/^\w+ing\b/.test(b) || /^(the|a|an|his|her|their|its|our|my|your|this|that|these|those|each|every|all)\b/.test(b)) return 'G';
    return /^(i|you|he|she|it|we|they)\b/.test(b) || /\b(is|are|was|were|will|can|has|have|had|must|should|\w+ed)\b/.test(b) ? 'L' : 'G'; }
  if (/^(trạng từ|cụm)/.test(k) && CN_TADV.test(x)) return 'T';
  if (/^cụm/.test(k) && / of$/.test(x)) return 'G';
  if (/^(cụm|trạng từ|v-ing|v3|tính từ|danh từ|đại từ|động từ|từ hạn định|từ chỉ lượng)|không chuẩn|sai/.test(k)) return '_';   // v196: + loại khác hẳn = Khác loại
  return null; }
const CN_TY = v => { const k = String(v || '').split(':')[0].trim().toLowerCase().replace(/\s*\([^)]*\)$/, '');   // v196: "liên từ (cụm)" = liên từ
  return k === 'giới từ' ? 'G' : k === 'liên từ' ? 'L' : /^(trạng từ nối|từ nối|cụm nối)$/.test(k) ? 'T' : null; };
PH_PHO.cau = { key: 'cau', view: 'toeic-pho-cau-noi', ic: '🌉', ten: 'Phố Cầu Nối', file: 'cau.json', sub: 'Giới từ, liên từ, từ nối · Part 5, Part 6',
  desc: 'Điều khiển bé Mầm bắt đúng cây cầu nối hai vế câu. Nhìn phía sau ô trống trước, rồi mới xét nghĩa.',
  lo: 'giới từ, liên từ', dau: 'Phía sau là', introSub: 'Chạm vào từng người để nghe họ giới thiệu. Nhớ phía sau mỗi người là gì.',
  ORD: ['G', 'L', 'T'], SHORT: { G: 'Chú Gạch', L: 'Cô Cầu', T: 'Bác Xích' }, NHA: {}, QH: CN_QH,
  CH: { G: { name: 'Chú Gạch Giới', pos: 'Giới từ', suf: 'cụm danh từ · V-ing', line: 'Tôi nối với một CỤM DANH TỪ hoặc V-ing. Phía sau tôi không có động từ chia thì: because of the rain, despite the delay.' },
    L: { name: 'Cô Cầu Liên', pos: 'Liên từ', suf: 'cả mệnh đề · chủ ngữ + động từ', line: 'Sau tôi là cả một mệnh đề có chủ ngữ và động từ: because it rained, although the train was late.' },
    T: { name: 'Bác Xích Nối', pos: 'Trạng từ nối', suf: 'câu mới · có dấu phẩy', line: 'Tôi mở đầu câu mới, sau dấu chấm hoặc chấm phẩy, và luôn có dấu phẩy theo sau: However, … Therefore, …' } },
  G: { G: { q: 'Ai đứng trước một cụm danh từ, không có động từ chia thì?', ex: [['The event was canceled', 'because of', 'the storm.'], ['We stayed calm', 'despite', 'the long delay.'], ['No one may leave', 'during', 'the safety drill.']], hint: 'Nhìn phía sau: "the storm", "the long delay" là cụm danh từ, không có động từ.', chant: 'Sau tôi là cụm danh từ hoặc V-ing.' },
    L: { q: 'Ai đứng trước cả một mệnh đề (chủ ngữ + động từ)?', ex: [['The event was canceled', 'because', 'it rained heavily.'], ['We stayed calm', 'although', 'the flight was late.'], ['Please call me', 'when', 'you arrive.']], hint: 'Phía sau có "it rained", "the flight was": chủ ngữ + động từ.', chant: 'Sau tôi là cả mệnh đề: chủ ngữ + động từ.' },
    T: { q: 'Ai đứng đầu câu mới, có dấu phẩy theo sau?', ex: [['Sales fell in May.', 'However,', 'profits rose.'], ['The road was closed.', 'Therefore,', 'we took the bus.'], ['The hotel is new.', 'In addition,', 'it is cheap.']], hint: 'Cả ba đứng sau dấu chấm và có dấu phẩy ngay sau.', chant: 'Tôi mở đầu câu mới, sau tôi là dấu phẩy.' } },
  MUC: { b1: { ten: '🔍 Bậc 1 · Nhìn phía sau', sub: 'Phía sau ô trống là cụm, mệnh đề hay câu mới · 3 cư dân, 5 tim', md: 'gh', k: 3, dur: [9, 9], tim: 5, goi: 99, moc: 1 },
    b2: { ten: '🧭 Bậc 2 · Hai vế quan hệ gì', sub: 'Đọc hai vế, bắt đúng kiểu quan hệ · 4 lựa chọn, 5 tim', md: 'qh', k: 4, dur: [10, 10], tim: 5, goi: 99 },
    b3: { ten: '🌿 Bậc 3 · Ghép cả hai', sub: 'Nhìn phía sau rồi xét nghĩa · 3 từ, 4 tim, 3 gợi ý', md: 'tu', k: 3, dur: [9, 9], tim: 4, goi: 3 },
    b4: { ten: '🔥 Bậc 4 · Đủ 4 từ', sub: '4 từ như đề thật, có cặp cùng nghĩa khác loại · 3 tim, 1 gợi ý', md: 'tu', k: 4, dur: [8, 7], tim: 3, goi: 1 } },
  FIX: { ten: '🛠 Chữa câu', sub: '', md: 'tu', k: 4, dur: [9, 9], tim: 5, goi: 99, moc: 1, mau: 1 },
  help: { gh: 'Nhìn phần tô sau ô trống, bắt đúng cư dân. Chạm làn, vuốt hoặc bấm ◀ ▶.', qh: 'Đọc hai vế quanh ô trống, bắt đúng kiểu quan hệ. Chạm từ để tra nghĩa.' },
  // cụm tô = phần ngay sau ô trống tới dấu câu (tối đa 7 từ); câu bắt đầu bằng "___," thì lấy vế sau dấu phẩy
  moc: it => { const b = String(it.s.split('___')[1] || '').replace(/^\s*,\s*/, ''), m = b.match(/^[^,.;:!?]+/); const w = m ? m[0].trim().split(/\s+/).slice(0, 7).join(' ') : ''; return w || null; },
  mocHint: m => `💡 Nhìn phần tô sau ô trống: <b>${esc(m)}</b>. Đó là cụm danh từ, cả mệnh đề (có động từ chia thì), hay câu mới sau dấu chấm?`,
  real: (q, d) => { if (!phIn(q, 'cau', t => ['prep', 'conj'].includes(t))) return null; const og = (q.lg || {}).og || {}; if (!q.opts.every(o => og[o])) return null;   // v194: + Part 6 từ nối
    const src = phSrc(q); if (!src) return null; const s = src.s;
    const o = q.opts.map(w => { const t = cnCls(w, og[w], s); return [w, t, t === '_' ? String(og[w]).trim() : String(og[w]).split(':').slice(1).join(':').trim() || String(og[w]).trim()]; });
    if (o.some(x => !x[1]) || o.find(x => x[0] === q.a)[1] === '_') return null;
    const ly = String(q.lg.ly || q.why || ''), why = (ly.match(/^[^.!?]*[.!?]/) || [ly])[0].slice(0, 180);
    return Object.assign({ id: `de:${d.id}:${q.n}`, de: d.id, n: q.n, a: q.a, o, why, vi: q.lg.dich || '', real: 1, nha: null }, src); },
  // v183: nhóm kiến thức để tìm câu kho anh em = loại + kiểu quan hệ của đáp án (câu đề không ghi quan hệ: tra theo chữ ở kho)
  sk: it => { const A = it.o.find(o => o[0] === it.a) || []; if (A[3]) return A[3]; const w = String(A[0] || '').toLowerCase();
    for (const x of PH_K || []) for (const o of x.o) if (String(o[0]).toLowerCase() === w && o[3]) return o[3]; return ''; },
  canFix: q => !!PH_PHO.cau.real(q, { id: 0 }),
  fixLab: '🌉 Chữa ở Phố Cầu Nối · điều khiển bé Mầm' };
