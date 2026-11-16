// 👥 Phố Đại Từ & Lượng Từ (specs/020-thanh-pho-toeic, v190): phố thứ tư của 🏙 Thành phố TOEIC, chạy bằng động cơ phố của pho.js.
// Dạy câu Part 5 dạng đại từ (he / him / his / hers / himself, who / which / whose) và lượng từ (each, many, much, few, little, none of…).
// 5 cư dân; bậc 1 làn chỉ có 4 cư dân (động cơ lấy cư dân của đáp án + của phương án khác). Câu Part 5 "cấu trúc" (so sánh, đảo ngữ) chưa vào phố.
// Kho: dai.json (content/toeic/dai.json qua tools/build-dai.mjs) + câu thật Part 5 pron / det của đề.
PH_ACCX.D = (ink, sk) => `<circle cx="42" cy="20" r="8" style="fill:#fff;stroke:${ink};stroke-width:2.5"/><circle cx="60" cy="20" r="8" style="fill:#fff;stroke:${ink};stroke-width:2.5"/><path d="M38 32 Q42 26 46 32M56 32 Q60 26 64 32" style="fill:none;stroke:${ink};stroke-width:2"/>`;
PH_ACCX.S = (ink, sk) => `<rect x="38" y="14" width="24" height="18" rx="4" style="fill:#f0b429;stroke:${ink};stroke-width:2.5"/><path d="M44 14 V9 A6 6 0 0 1 56 9 V14" style="fill:none;stroke:${ink};stroke-width:2.5"/>`;
PH_ACCX.X = (ink, sk) => `<ellipse cx="50" cy="18" rx="12" ry="14" style="fill:#d6f0ff;stroke:${ink};stroke-width:2.5"/><path d="M45 12 L52 22" style="stroke:#fff;stroke-width:3;stroke-linecap:round"/>`;
PH_ACCX.W = (ink, sk) => `<path d="M30 22 h14 M56 22 h14" style="stroke:${ink};stroke-width:3;stroke-linecap:round"/><circle cx="50" cy="22" r="7" style="fill:#7c5cff;stroke:${ink};stroke-width:2"/>`;
PH_ACCX.U = (ink, sk) => `<rect x="34" y="20" width="8" height="12" style="fill:#5cc28a;stroke:${ink};stroke-width:2"/><rect x="46" y="12" width="8" height="20" style="fill:#5cc28a;stroke:${ink};stroke-width:2"/><rect x="58" y="6" width="8" height="26" style="fill:#5cc28a;stroke:${ink};stroke-width:2"/>`;
const DL_QH = {
  cn: { e: '👤', n: 'Chủ ngữ', w: 'đứng trước động từ: he, she, they, we', t: 'D' },
  tn: { e: '🎯', n: 'Tân ngữ', w: 'sau động từ / giới từ: him, her, them, us', t: 'D' },
  ss: { e: '🏷', n: 'Của ai + danh từ', w: 'his, her, its, their, our + danh từ', t: 'S' },
  ds: { e: '🎒', n: 'Của ai đứng một mình', w: 'hers, theirs, ours, mine (không có danh từ sau)', t: 'S' },
  pt: { e: '🪞', n: 'Tự mình', w: 'chủ ngữ = tân ngữ, by + -self: himself, themselves', t: 'X' },
  qn: { e: '🧑', n: 'who: người', w: 'who / whom thay cho người', t: 'W' },
  qv: { e: '📦', n: 'which: vật', w: 'which / that thay cho vật', t: 'W' },
  qs: { e: '🔑', n: 'whose + danh từ', w: 'whose + danh từ: của người / vật trước đó', t: 'W' },
  l1: { e: '☝️', n: '+ số ít', w: 'each, every, another, either + danh từ số ít', t: 'U' },
  ln: { e: '👥', n: '+ số nhiều', w: 'many, few, several, both + danh từ số nhiều', t: 'U' },
  lk: { e: '💧', n: '+ không đếm được', w: 'much, little, less + danh từ không đếm được', t: 'U' },
  lo: { e: '🍰', n: 'Đứng một mình / + of', w: 'none of, most of, each of, the others', t: 'U' } };
// phân loại một phương án câu đề từ nhãn lời giải + chữ: [cư dân, luật] hoặc null
function dlCls(w, lab, s) { const l = String(lab || '').toLowerCase(), x = String(w || '').toLowerCase().trim(), h0 = l.split(':')[0];
  if (/ or /.test(x)) return dlCls(x.split(' or ')[0], lab, s);   // v194: his or her, him or her…
  if (/^(the one|one|ones)$/.test(x) && /^(đại từ|từ chỉ lượng)/.test(h0)) return ['U', 'lo'];   // v196: one / the one thay cho danh từ đã nhắc = đứng một mình
  if (/sai|viết tắt|không chuẩn/.test(h0) || /^trạng từ/.test(h0) || /^(the one|one|ones|this one)$/.test(x)) return ['_', ''];   // v194: khác loại
  const c = dlCls0(x, l) || (/^(tính từ|giới từ|liên từ|danh từ|động từ|v-ing|v3|cụm|trạng từ quan hệ|từ hạn định|đại từ chỉ định)/.test(h0) || /^(this|these|those|such|where|when|why)$/.test(x) ? ['_', ''] : null), nx = (String(s || '').split('___')[1] || '').trim().toLowerCase().split(/\s+/)[0];
  if (c && c[0] === 'U' && nx === 'of') return ['U', 'lo'];   // v194: lượng từ + of
  return c; }
function dlCls0(x, l) {
  if (/sel(f|ves)$/.test(x)) return ['X', 'pt'];
  if (x === 'whose') return ['W', 'qs']; if (/^(who|whom|whoever)$/.test(x)) return ['W', 'qn']; if (/^(which|whichever|what)$/.test(x) || (x === 'that' && /quan hệ/.test(l))) return ['W', 'qv'];
  if (/^(he|she|they|we|i)$/.test(x)) return ['D', 'cn']; if (/^(him|them|us|me)$/.test(x)) return ['D', 'tn'];
  if (/^(hers|theirs|ours|mine|yours)$/.test(x)) return ['S', 'ds'];
  if (/^(his|their|its|our|my|your|her|it|you)$/.test(x)) { const h = l.split(':')[0]; const i = k => { const j = h.indexOf(k); return j < 0 ? 99 : j; };
    const a = [[i('tân ngữ'), ['D', 'tn']], [i('chủ ngữ'), ['D', 'cn']], [i('tính từ sở hữu'), ['S', 'ss']], [i('đại từ sở hữu'), ['S', 'ds']]].sort((p, q) => p[0] - q[0])[0];
    return a[0] < 99 ? a[1] : x === 'it' ? ['D', 'tn'] : x === 'you' ? ['D', 'cn'] : ['S', 'ss']; }
  if (/^(nobody|no one|someone|everyone|anyone|anybody|everybody|somebody|nothing|something|anything|everything)$/.test(x)) return ['D', 'cn'];
  if (x === 'it') return ['D', 'tn'];
  if (/đứng một mình|\+ of|\bof\b/.test(l) || /^(none|others|the others|the rest|one another|each other)$|\bof$/.test(x)) return ['U', 'lo'];
  if (/không đếm được/.test(l) || /^(much|little|a little|less|a great deal of|an amount of)$/.test(x)) return ['U', 'lk'];
  if (/số ít/.test(l) || /^(each|every|another|either|neither|a single)$/.test(x)) return ['U', 'l1'];
  if (/số nhiều|đếm được/.test(l) || /^(many|few|a few|several|both|fewer|a number of|various|numerous|other|no)$/.test(x)) return ['U', 'ln'];
  if (/^(all|most|some|any|enough|more|plenty of|a lot of|lots of)$/.test(x)) return ['U', 'lk'];   // + of → lo ở dlCls; còn lại xét danh từ sau ở dlReal
  return null; }
const DL_OK = q => !!(q && phIn(q, 'dai', t => ['pron', 'det'].includes(t)) && q.opts && q.opts.every(o => ((q.lg || {}).og || {})[o]));
function dlReal(q, d) { if (!DL_OK(q)) return null; const og = q.lg.og, src = phSrc(q); if (!src) return null; const s = src.s;   // v196: + chỗ trống Part 6 (câu trước, cả đoạn)
  const nx = (s.split('___')[1] || '').trim().toLowerCase().split(/\s+/)[0] || '';
  const o = q.opts.map(w => { let c = dlCls(w, og[w], s); if (c && c[1] === 'lk' && /^(all|most|some|any|enough|more)$/i.test(w) && /[a-z]{3,}s$/.test(nx) && !/ss$/.test(nx)) c = ['U', 'ln'];
    return c ? [w, c[0], c[0] === '_' ? String(og[w]).trim() : String(og[w]).split(':').slice(1).join(':').trim() || String(og[w]).split(':')[0].trim(), c[1]] : null; });
  if (o.some(x => !x) || o.find(x => x[0] === q.a)[1] === '_') return null;
  const ly = String(q.lg.ly || q.why || ''), why = (ly.match(/^[^.!?]*[.!?]/) || [ly])[0].slice(0, 180);
  return Object.assign({ id: `de:${d.id}:${q.n}`, de: d.id, n: q.n, a: q.a, o, why, vi: q.lg.dich || '', real: 1, nha: null }, src); }
PH_PHO.dai = { key: 'dai', view: 'toeic-pho-dai-tu', ic: '👥', ten: 'Phố Đại Từ & Lượng Từ', file: 'dai.json', sub: 'he / him / his / himself, who / which / whose, each / many / much · Part 5',
  desc: 'Điều khiển bé Mầm bắt đúng đại từ hoặc từ chỉ lượng. Nhìn chữ đứng ngay sau ô trống trước: động từ, danh từ số ít, số nhiều hay "of".',
  lo: 'đại từ, lượng từ', dau: 'Dấu hiệu', introSub: 'Chạm vào từng người để nghe họ giới thiệu. Nhớ dấu hiệu gọi mỗi người.',
  qhW: 'Luật', qhT: '12 luật đại từ và lượng từ', ORD: ['D', 'S', 'X', 'W', 'U'], SHORT: { D: 'Bác Đại từ', S: 'Cô Sở hữu', X: 'Anh Tự mình', W: 'Chú Quan hệ', U: 'Chị Lượng' }, NHA: {}, QH: DL_QH,
  CH: { D: { name: 'Bác Đại từ', pos: 'Đại từ nhân xưng', suf: 'trước động từ: he · sau động từ: him', line: 'Đứng trước động từ thì tôi là chủ ngữ: he, they. Đứng sau động từ hoặc giới từ thì tôi đổi áo: him, them.' },
    S: { name: 'Cô Sở hữu', pos: 'Sở hữu', suf: 'his + danh từ · hers đứng một mình', line: 'Có danh từ theo sau thì tôi là his, their: their order. Không có danh từ thì tôi đứng một mình: hers, theirs.' },
    X: { name: 'Anh Tự mình', pos: 'Phản thân', suf: '-self · chủ ngữ = tân ngữ', line: 'Người làm và người nhận là một thì gọi tôi: she introduced herself. By + tôi là "một mình": by himself.' },
    W: { name: 'Chú Quan hệ', pos: 'Đại từ quan hệ', suf: 'who người · which vật · whose + danh từ', line: 'Tôi nối thêm một mệnh đề vào danh từ phía trước: người thì who, vật thì which, "của ai" thì whose + danh từ.' },
    U: { name: 'Chị Lượng', pos: 'Từ chỉ lượng', suf: 'each + số ít · many + số nhiều · much + không đếm được', line: 'Nhìn danh từ sau tôi: số ít thì each, every; số nhiều thì many, few; không đếm được thì much, little; có "of" thì none of, most of.' } },
  G: { D: { q: 'Ai đứng trước động từ (he) hoặc sau động từ (him)?', ex: [['Ms. Lin called, and', 'she', 'left a message.'], ['Please call', 'them', 'tomorrow.'], ['The guests said', 'they', 'enjoyed the tour.']], hint: 'Trước động từ là chủ ngữ she, they; sau call là tân ngữ them.', chant: 'Trước động từ: he, they. Sau động từ / giới từ: him, them.' },
    S: { q: 'Ai nói "của ai"?', ex: [['Mr. Ortiz forgot', 'his', 'badge.'], ['The clients paid', 'their', 'invoices.'], ['This desk is mine; that one is', 'hers', '.']], hint: 'his badge, their invoices: của ai + danh từ. hers: đứng một mình.', chant: 'His + danh từ. Hers đứng một mình.' },
    X: { q: 'Ai xuất hiện khi người làm và người nhận là một?', ex: [['The staff introduced', 'themselves', 'to the guests.'], ['He fixed the printer', 'himself', '.'], ['She traveled by', 'herself', '.']], hint: 'Người giới thiệu = người được giới thiệu; by herself = một mình.', chant: 'Tự làm cho mình: -self.' },
    W: { q: 'Ai nối thêm một mệnh đề vào danh từ phía trước?', ex: [['Applicants', 'who', 'speak Korean are welcome.'], ['The printer', 'which', 'broke is new.'], ['Customers', 'whose', 'orders were late will get a refund.']], hint: 'Người: who. Vật: which. Của ai + danh từ: whose.', chant: 'Người: who. Vật: which. Của ai: whose + danh từ.' },
    U: { q: 'Ai nói "bao nhiêu" trước danh từ?', ex: [['', 'Each', 'visitor gets a map.'], ['', 'Several', 'suppliers raised prices.'], ['Don\'t spend too', 'much', 'time.']], hint: 'visitor số ít: each. suppliers số nhiều: several. time không đếm được: much.', chant: 'Số ít: each. Số nhiều: many. Không đếm được: much. Có of: none of.' } },
  MUC: { b1: { ten: '🔍 Bậc 1 · Ai ngồi ghế', sub: 'Nhìn chữ ngay sau ô trống, bắt đúng cư dân · 4 cư dân, 5 tim', md: 'gh', k: 4, dur: [9, 9], tim: 5, goi: 99, moc: 1 },
    b2: { ten: '🧭 Bậc 2 · Dấu hiệu nói gì', sub: 'Chủ ngữ hay tân ngữ, số ít hay số nhiều, người hay vật… · 4 lựa chọn, 5 tim', md: 'qh', k: 4, dur: [10, 10], tim: 5, goi: 99, moc: 1 },
    b3: { ten: '🌿 Bậc 3 · Ghép cả hai', sub: 'Tìm dấu hiệu rồi chọn từ · 3 từ, 4 tim, 3 gợi ý', md: 'tu', k: 3, dur: [9, 9], tim: 4, goi: 3 },
    b4: { ten: '🔥 Bậc 4 · Đủ 4 từ', sub: '4 từ cùng họ như đề thật · 3 tim, 1 gợi ý', md: 'tu', k: 4, dur: [8, 7], tim: 3, goi: 1 } },
  FIX: { ten: '🛠 Chữa câu', sub: '', md: 'tu', k: 4, dur: [9, 9], tim: 5, goi: 99, moc: 1, mau: 1 },
  help: { gh: 'Tìm chữ dấu hiệu được tô, bắt đúng cư dân. Chạm làn, vuốt hoặc bấm ◀ ▶.', qh: 'Chữ dấu hiệu được tô gọi luật nào? Bắt đúng luật. Chạm từ để tra nghĩa.' },
  mocHint: m => `💡 Nhìn chữ được tô: <b>${esc(m)}</b>. Đó là động từ, danh từ số ít / số nhiều / không đếm được, hay "of"?`,
  real: dlReal,
  sk: it => { const A = it.o.find(o => o[0] === it.a) || []; return A[3] || ''; },
  canFix: q => !!(DL_OK(q) && dlReal(q, { id: 0 })),
  fixLab: '👥 Chữa ở Phố Đại Từ · điều khiển bé Mầm',
  rk: it => { const A = it.o.find(o => o[0] === it.a); return A && A[3]; },
  gl: Object.keys(DL_QH), glT: r => DL_QH[r] && DL_QH[r].t, rn: r => DL_QH[r] ? DL_QH[r].e + ' ' + DL_QH[r].n : r,
  ruleQ: q => { const it = dlReal(q, { id: 0 }); if (!it) return null; const A = it.o.find(o => o[0] === it.a); return A ? A[3] : null; } };
