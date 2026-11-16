// ⏰ Phố Động Từ (specs/020-thanh-pho-toeic, v189): phố thứ ba của 🏙 Thành phố TOEIC, chạy bằng động cơ phố của pho.js.
// Dạy câu Part 5 dạng động từ: chia thì theo mốc, chủ động / bị động, to V / V gốc / V-ing. Cư dân = loại dạng động từ, "dấu hiệu" = chữ mốc trong câu.
// Bậc: ① Ai ngồi ghế (4 cư dân) → ② Dấu hiệu nói gì (11 luật) → ③ ghép 3 dạng → ④ đủ 4 dạng như đề.
// Kho: dong.json (content/toeic/dong.json qua tools/build-dong.mjs) + câu thật Part 5 dạng động từ của đề. v194: thêm chỗ trống Part 6 chọn thì (câu chứa ô trống + câu trước, cả đoạn gập).
PH_ACCX.H = (ink, sk) => `<circle cx="50" cy="20" r="13" style="fill:#fff6d8;stroke:${ink};stroke-width:2.5"/><path d="M50 12v8l6 4" style="fill:none;stroke:${ink};stroke-width:2.5;stroke-linecap:round"/>`;
PH_ACCX.B = (ink, sk) => `<rect x="33" y="10" width="34" height="22" rx="3" style="fill:#c9935a;stroke:${ink};stroke-width:2"/><path d="M33 18h34M50 10v8" style="stroke:${ink};stroke-width:2"/>`;
PH_ACCX.O = (ink, sk) => `<path d="M30 30 L50 8 L70 30" style="fill:none;stroke:#e0567a;stroke-width:6;stroke-linejoin:round;stroke-linecap:round"/><circle cx="50" cy="8" r="4" style="fill:${ink}"/>`;
PH_ACCX.I = (ink, sk) => `<path d="M30 26 Q40 6 50 20 Q60 34 70 14" style="fill:none;stroke:#2f8fd8;stroke-width:5;stroke-linecap:round"/><circle cx="70" cy="14" r="4" style="fill:#2f8fd8;stroke:${ink};stroke-width:1.5"/>`;
// 11 luật (bậc 2 bắt luật; 🧠 luật vững đếm theo luật)
const DT_QH = {
  qd: { e: '⏪', n: 'Quá khứ đơn', w: 'yesterday, last week, ago, in 2019', t: 'H' },
  hd: { e: '🔁', n: 'Hiện tại đơn', w: 'every, usually, always, lịch cố định', t: 'H' },
  td: { e: '🎬', n: 'Đang diễn ra', w: 'now, currently, at the moment', t: 'H' },
  htht: { e: '✅', n: 'Từ trước tới nay', w: 'since, for, already, recently, so far', t: 'H' },
  hth: { e: '⏮', n: 'Xong trước một mốc', w: 'by the time, before + quá khứ → had V3; by + tương lai → will have V3', t: 'H' },
  tl: { e: '⏩', n: 'Tương lai', w: 'next, tomorrow, soon, upcoming', t: 'H' },
  dk: { e: '🔀', n: 'Câu điều kiện', w: 'if + hiện tại → will; if + quá khứ → would', t: 'H' },
  bd: { e: '📦', n: 'Được làm (bị động)', w: 'chủ ngữ là vật / người được làm: be + V3', t: 'B' },
  to: { e: '🎯', n: 'to V', w: 'plan, decide, expect, need, want, ask sb, in order to', t: 'O' },
  goc: { e: '🧱', n: 'V gốc', w: 'will, can, must, should, may, make / let / help sb', t: 'O' },
  ing: { e: '🔄', n: 'V-ing', w: 'sau giới từ, enjoy, avoid, consider, suggest, look forward to', t: 'I' } };
// phân loại một phương án của câu đề từ nhãn lời giải (lg.og) + chữ: [cư dân, luật] hoặc null
function dtCls(w, lab, s) { const L = String(lab || '').toLowerCase(), l = L.split(':')[0], x = String(w || '').toLowerCase().trim();
  if (/dạng sai|cụm sai|không chuẩn/.test(l)) return ['_', ''];   // v194: phương án sai dạng = "Khác loại"
  if (/bị động/.test(L) || /\b(be|been|being|is|are|was|were)\s+\w+(ed|en|wn)\b/.test(x)) return ['B', 'bd'];
  if (/^to /.test(x) || /^to v/.test(l)) return ['O', 'to'];
  if (/v-ing/.test(l) || /^\w+ing$/.test(x)) return ['I', 'ing'];
  if (/điều kiện/.test(l) || /^would /.test(x)) return ['H', 'dk'];
  if (/quá khứ hoàn thành|tương lai hoàn thành/.test(l) || /^(had|will have) \w+/.test(x)) return ['H', 'hth'];
  if (/hiện tại hoàn thành/.test(l) || /^(has|have)( not|n't)? \w+/.test(x) || /\b(has|have) \+ v3/.test(L)) return ['H', 'htht'];
  if (/tiếp diễn/.test(l)) return ['H', 'td'];
  if (/tương lai/.test(l) || /^will /.test(x)) return ['H', 'tl'];
  if (/nguyên mẫu/.test(l) || /^(must|can|should|may|might|could) /.test(x)) return ['O', 'goc'];
  if (/quá khứ|v3/.test(l) || /^(was|were)$/.test(x)) return ['H', 'qd'];
  if (/hiện tại đơn|hiện tại|ngôi thứ ba/.test(l) || /^(is|are|am)$/.test(x)) return ['H', /\bif\b[^,]*___/i.test(s || '') ? 'dk' : 'hd'];
  return null; }
// v194: câu Part 5 dạng động từ + chỗ trống Part 6 chọn thì / chọn dạng động từ
const DT_OK = q => !!(q && phIn(q, 'dong', t => t === 'verb') && q.opts && q.opts.every(o => ((q.lg || {}).og || {})[o]));
function dtReal(q, d) { if (!DT_OK(q)) return null; const og = q.lg.og, src = phSrc(q); if (!src) return null; const s = src.s;
  const o = q.opts.map(w => { const c = dtCls(w, og[w], s); return c ? [w, c[0], c[0] === '_' ? String(og[w]).trim() : String(og[w]).split(':').slice(1).join(':').trim() || String(og[w]).split(':')[0].trim(), c[1]] : null; });
  if (o.some(x => !x) || o.find(x => x[0] === q.a)[1] === '_') return null;
  const ly = String(q.lg.ly || q.why || ''), why = (ly.match(/^[^.!?]*[.!?]/) || [ly])[0].slice(0, 180);
  return Object.assign({ id: `de:${d.id}:${q.n}`, de: d.id, n: q.n, a: q.a, o, why, vi: q.lg.dich || '', real: 1, nha: null }, src); }
PH_PHO.dong = { key: 'dong', view: 'toeic-pho-dong-tu', ic: '⏰', ten: 'Phố Động Từ', file: 'dong.json', sub: 'Thì, chủ động / bị động, to V / V-ing · Part 5, Part 6',
  desc: 'Điều khiển bé Mầm bắt đúng dạng động từ. Tìm chữ mốc trong câu trước (yesterday, since, must, for…), rồi mới chọn dạng.',
  lo: 'động từ', dau: 'Dấu hiệu', introSub: 'Chạm vào từng người để nghe họ giới thiệu. Nhớ dấu hiệu gọi mỗi người.',
  qhW: 'Luật', qhT: '11 luật dạng động từ', ORD: ['H', 'B', 'O', 'I'], SHORT: { H: 'Bác Chia thì', B: 'Cô Bị động', O: 'Anh Nguyên mẫu', I: 'Bé V-ing' }, NHA: {}, QH: DT_QH,
  CH: { H: { name: 'Bác Chia thì', pos: 'Động từ chia thì', suf: 'mốc thời gian · yesterday, since, next, by the time', line: 'Tôi là động từ chính của câu, chia theo mốc thời gian: đã làm, đang làm, sẽ làm, đã làm xong. Tìm yesterday, since, next… là biết tôi phải mặc thì nào.' },
    B: { name: 'Cô Bị động', pos: 'Bị động', suf: 'chủ ngữ được làm · be + V3', line: 'Chủ ngữ không tự làm, nó ĐƯỢC làm: the report was sent, hard hats must be worn. Tôi luôn có be (is, was, been, be) + V3.' },
    O: { name: 'Anh Nguyên mẫu', pos: 'to V / V gốc', suf: 'plan to, need to · will, must, can, let', line: 'Sau plan, need, decide, want tôi mặc "to": to open. Sau will, must, can, should, let, make tôi bỏ "to", chỉ còn V gốc: must complete.' },
    I: { name: 'Bé V-ing', pos: 'V-ing', suf: 'sau giới từ · enjoy, avoid, suggest', line: 'Sau giới từ (for, by, before, after, without) và sau enjoy, avoid, consider, suggest, look forward to thì là tôi: thank you for coming.' } },
  G: { H: { q: 'Ai chia theo mốc thời gian như yesterday, since, next week?', ex: [['The team', 'sent', 'the files yesterday.'], ['Sales', 'have risen', 'since May.'], ['The store', 'will open', 'next week.']], hint: 'Cả ba câu có mốc thời gian, động từ chính đổi theo mốc.', chant: 'Thấy mốc thời gian thì chia thì theo mốc.' },
    B: { q: 'Chủ ngữ không tự làm mà được làm: ai đây?', ex: [['The report', 'was sent', 'to all staff.'], ['Hard hats', 'must be worn', 'on site.'], ['The room', 'is cleaned', 'every day.']], hint: 'Báo cáo không tự gửi, mũ không tự đội: chúng được làm. Có be + V3.', chant: 'Chủ ngữ được làm: be + V3.' },
    O: { q: 'Ai đứng sau plan, need, must, will?', ex: [['We plan', 'to open', 'two stores.'], ['Staff must', 'complete', 'the course.'], ['Please let me', 'know', 'by Friday.']], hint: 'Sau plan, need: to V. Sau must, will, let: V gốc, không "to".', chant: 'Sau plan / need: to V. Sau will / must / let: V gốc.' },
    I: { q: 'Ai đứng sau giới từ và sau enjoy, avoid, suggest?', ex: [['Thank you for', 'coming', 'today.'], ['She suggested', 'moving', 'the meeting.'], ['Avoid', 'parking', 'near the gate.']], hint: 'For là giới từ; suggest, avoid luôn đi với V-ing.', chant: 'Sau giới từ và enjoy / avoid / suggest: V-ing.' } },
  MUC: { b1: { ten: '🔍 Bậc 1 · Ai ngồi ghế', sub: 'Tìm chữ mốc, bắt đúng cư dân · 4 cư dân, 5 tim', md: 'gh', k: 4, dur: [9, 9], tim: 5, goi: 99, moc: 1 },
    b2: { ten: '🧭 Bậc 2 · Dấu hiệu nói gì', sub: 'Chữ mốc gọi luật nào: quá khứ, từ trước tới nay, bị động… · 4 lựa chọn, 5 tim', md: 'qh', k: 4, dur: [10, 10], tim: 5, goi: 99, moc: 1 },
    b3: { ten: '🌿 Bậc 3 · Ghép cả hai', sub: 'Tìm mốc rồi chọn dạng · 3 dạng, 4 tim, 3 gợi ý', md: 'tu', k: 3, dur: [9, 9], tim: 4, goi: 3 },
    b4: { ten: '🔥 Bậc 4 · Đủ 4 dạng', sub: '4 dạng như đề thật · 3 tim, 1 gợi ý', md: 'tu', k: 4, dur: [8, 7], tim: 3, goi: 1 } },
  FIX: { ten: '🛠 Chữa câu', sub: '', md: 'tu', k: 4, dur: [9, 9], tim: 5, goi: 99, moc: 1, mau: 1 },
  help: { gh: 'Tìm chữ mốc được tô, bắt đúng cư dân. Chạm làn, vuốt hoặc bấm ◀ ▶.', qh: 'Chữ mốc được tô gọi luật nào? Bắt đúng luật. Chạm từ để tra nghĩa.' },
  mocHint: m => `💡 Nhìn chữ mốc được tô: <b>${esc(m)}</b>. Nó nói thời gian nào, hay đứng sau từ gì?`,
  real: dtReal,
  // v183: nhóm kiến thức để tìm câu kho anh em = luật của đáp án
  sk: it => { const A = it.o.find(o => o[0] === it.a) || []; return A[3] || ''; },
  canFix: q => !!(DT_OK(q) && dtReal(q, { id: 0 })),
  fixLab: '⏰ Chữa ở Phố Động Từ · điều khiển bé Mầm',
  // v187: 🧠 luật vững đếm theo 11 luật (không theo cư dân)
  rk: it => { const A = it.o.find(o => o[0] === it.a); return A && A[3]; },
  gl: Object.keys(DT_QH), glT: r => DT_QH[r] && DT_QH[r].t, rn: r => DT_QH[r] ? DT_QH[r].e + ' ' + DT_QH[r].n : r,
  ruleQ: q => { const it = dtReal(q, { id: 0 }); if (!it) return null; const A = it.o.find(o => o[0] === it.a); return A ? A[3] : null; } };
