// 🗺 Bản đồ điểm TOEIC (v84, 29/10/2026; người sáng lập: "làm hết đi khỏi hỏi" sau khi bàn chiến lược bắt chỗ yếu cho TOEIC). Cơ chế nhóm đang chữa dùng chung focus.js.
// TOEIC toàn trắc nghiệm, chấm tuyệt đối → bằng chứng tin được hơn IELTS; điểm gần như theo số câu đúng → tính được chỗ nào tăng điểm nhiều nhất.
// Chỗ yếu (đơn vị u): 'p5:<dạng>' Part 5 theo dạng · 'tr:<bẫy>' bẫy Part 2 (mỗi câu Part 2 có bẫy đó trong lời đáp sai = 1 lần gặp, chọn đúng lời bẫy = mắc)
//   · 'p2' 'p3' 'p4' 'p6' 'p7' theo Part · 'spd:p5' 'spd:p7' tốc độ (trung bình giây / câu vượt mục tiêu).
//   'p5' / 'p2' chung không tính khi đã có dạng / bẫy cụ thể yếu (cụ thể hơn thì chữa trúng hơn).
// Ngưỡng đạt theo điểm mục tiêu: tỉ lệ đúng cần ≈ (mục tiêu / 2 − 5) / 490 (thang ước của app, KHÔNG phải bảng ETS), trong khoảng 50–90%.
// Ưu tiên = số câu của chỗ đó trong đề thật × khoảng thiếu × ~4,9 điểm / câu × độ chắc (≥ 8 câu ở ≥ 2 bài = 1, ít hơn = 0,5).
// Nhóm đang chữa tối đa 3, Nghe tối đa 2, Đọc tối đa 2. Một lần thử = lượt có ≥ 5 câu (Part 3, 4, 6, 7: ≥ 3) trên bài chưa gặp 30 ngày; tốc độ: một lượt luyện tốc độ.
// Chữa xong / gác / 🧱 như focus.js. Truy gốc: dạng ngữ pháp → Ngữ pháp CEFR; từ vựng, đọc, nghe → 📚 từ vựng công sở + nền CEFR.
const TM_ACT = 3, TM_TRY = 3, TM_PARK_D = 14, TM_FRESH_D = 30;
const TM_SK = { L: '🎧 Nghe', R: '📖 Đọc' };
const tmSk = u => /^(p2|p3|p4|tr:)/.test(u) ? 'L' : 'R';
const tmMinQ = u => /^(p3|p4|p6|p7)$/.test(u) ? 3 : 5;
const toTh = () => Math.max(0.5, Math.min(0.9, Math.round((toSt().target / 2 - 5) / 490 * 20) / 20));
const tmName = u => u.startsWith('p5:') ? 'Part 5 · ' + TO_T5[u.slice(3)] : u.startsWith('tr:') ? 'Bẫy Part 2 · ' + TO_TRAP[u.slice(3)][0] : u.startsWith('spd:') ? '⏱ Tốc độ ' + TO_SEC[u.slice(4)][1].replace(/: .*/, '') : TO_SEC[u][1];
// số câu của chỗ đó trong đề thật (Part 5 theo tỉ lệ dạng trong kho; bẫy: ~40% câu Part 2 có bẫy đó)
function tmQ(u) { if (u.startsWith('p5:')) return 30 * TO.p5.filter(x => x.t === u.slice(3)).length / TO.p5.length; if (u.startsWith('tr:')) return 25 * 0.4; if (u.startsWith('spd:')) return TO_REAL[u.slice(4)]; return TO_REAL[u]; }
// ghi một lượt (luyện / đề thử): lịch sử S.to.ty[u] = [{ at, ok, n, ids, src }] + báo lần thử cho nhóm đang chữa
function toLog(res, src, fresh) { const o = toSt(), T = o.ty = o.ty || {}, R = o.r, now = Date.now(), by = {};
  fresh = fresh || new Set(res.map(r => r.q && r.q.x && r.q.x.id).filter(id => id && (!R[id] || now - R[id].at >= TM_FRESH_D * DAY)));
  const add = (u, ok, id) => { const b = by[u] = by[u] || { at: now, ok: 0, n: 0, ids: [], src }; b.n++; if (ok) b.ok++; if (id && !b.ids.includes(id)) b.ids.push(id); };
  for (const r of res) { const q = r.q || {}, x = q.x; if (!x || !TO_SEC[q.sec]) continue; add(q.sec, r.ok, x.id); if (q.sec === 'p5' && x.t) add('p5:' + x.t, r.ok, x.id);
    if (q.sec === 'p2' && x.tr) { const pick = x.tr['ABC'.indexOf(r.ans)]; for (const k of new Set(x.tr.filter(Boolean))) add('tr:' + k, pick !== k, x.id); } }
  for (const [u, b] of Object.entries(by)) { T[u] = [...(T[u] || []), b].slice(-40); if (b.n >= tmMinQ(u) && b.ids.some(id => fresh.has(id))) tmHit(u, b.ok / b.n >= toTh(), now); }
  toTrapLog(res); return by; }
// mọi chỗ yếu, xếp ưu tiên (chỉ xét lượt làm sau lúc chữa xong fx)
function tmWeak() { const o = toSt(), T = o.ty || {}, fx = (o.fo || {}).fx || {}, th = toTh(), out = [];
  for (const u of Object.keys(T)) { const a = T[u].filter(b => b.at > (fx[u] || 0)).slice(-10), n = a.reduce((s, b) => s + b.n, 0); if (!n) continue;
    const p = a.reduce((s, b) => s + b.ok, 0) / n, sure = n >= 8 && new Set(a.flatMap(b => b.ids)).size >= 2; if (p >= th) continue;
    out.push({ u, sk: tmSk(u), t: tmName(u), v: `${Math.round(p * 100)}% · ${n} câu${u.startsWith('tr:') ? ' gặp bẫy' : ''}`, p: Math.round(tmQ(u) * (th - p) * 4.9 * (sure ? 1 : 0.5) * 10) / 10, sure }); }
  for (const s of Object.keys(TO_SPD)) { const u = 'spd:' + s, a = (o.spd || []).filter(r => r.s === s && r.at > (fx[u] || 0)).slice(-3); if (!a.length) continue;
    const avg = a.reduce((t, r) => t + r.avg, 0) / a.length, lim = TO_SPD[s][0]; if (avg <= lim) continue;
    out.push({ u, sk: 'R', t: tmName(u), v: `${avg.toFixed(1)} giây / câu (mục tiêu ${lim})`, p: Math.round(tmQ(u) * Math.min(0.2, avg / lim - 1) * 4.9 * (a.length >= 2 ? 1 : 0.5) * 10) / 10, sure: a.length >= 2 }); }
  const has = pre => out.some(w => w.u.startsWith(pre));
  return out.filter(w => !(w.u === 'p5' && has('p5:')) && !(w.u === 'p2' && has('tr:'))).sort((a, b) => b.p - a.p); }
// v99: như IELTS: chỉ chỗ yếu đủ chắc (≥ 8 câu ở ≥ 2 bài; tốc độ ≥ 2 lượt) mới vào nhóm đang chữa
const tmSure = () => tmWeak().filter(w => w.sure);
const tmFocus = (now = Date.now()) => { const o = toSt(); return fcFocus(o.fo = o.fo || {}, tmSure, { act: TM_ACT, cap: () => 2, try: TM_TRY, parkD: TM_PARK_D, info: u => ({ u, sk: tmSk(u), t: tmName(u), v: 'đã đạt ngưỡng, chờ đủ 2 lượt', p: 0 }) }, now); };
const tmHit = (u, pass, now = Date.now()) => fcHit(toSt().fo, u, pass, now);

// ---------- ▶ chữa một chỗ ----------
const TM_TIP = { form: ['Xem chỗ trống đứng đâu: sau mạo từ / tính từ sở hữu → danh từ; trước danh từ → tính từ; bổ nghĩa động từ / tính từ → trạng từ (-ly).', 'Học đuôi từ: -tion / -ment / -ness (danh từ), -ive / -ful / -able (tính từ), -ly (trạng từ), -ize / -en (động từ).'],
  verb: ['Tìm dấu hiệu thời gian (since, by next month, yesterday) để chọn thì.', 'Chủ ngữ là vật chịu hành động → bị động (be + V3). Sau giới từ dùng V-ing; sau modal dùng nguyên mẫu.'],
  prep: ['Học giới từ theo cụm cố định: responsible for, in charge of, on behalf of, according to.', 'Thời gian: at + giờ, on + ngày, in + tháng / năm; by = hạn chót, until = kéo dài tới.'],
  conj: ['Sau chỗ trống là mệnh đề (S + V) → liên từ (because, although); cụm danh từ → giới từ (because of, despite).', 'Xem quan hệ ý: nguyên nhân, nhượng bộ, điều kiện, thời gian.'],
  pron: ['Chủ ngữ → he / they; tân ngữ → him / them; trước danh từ → his / their; tự làm → himself.', 'Mệnh đề quan hệ: người → who, vật → which / that, sở hữu → whose.'],
  struct: ['Có than → so sánh hơn; the + most / -est → so sánh nhất; as … as → nguyên dạng.', 'Never, Rarely, Only after, Not only đứng đầu câu → đảo trợ động từ lên trước chủ ngữ.'],
  voc: ['Đọc cả câu để hiểu nghĩa; các phương án cùng loại từ nên phải chọn theo nghĩa và cụm hay đi kèm.', 'Học từ theo cụm công sở (meet a deadline, place an order, submit a report) ở 📚 Từ vựng công sở.'] };
function tmTipHtml(u) { const k = u.split(':')[1];
  const ls = u.startsWith('p5:') ? TM_TIP[k] : u.startsWith('tr:') ? [TO_TRAP[k][1], 'Nghe kỹ từ hỏi đầu câu; lời đáp lặp lại từ trong câu hỏi thường là bẫy. Lời đáp gián tiếp vẫn có thể đúng.']
    : u.startsWith('spd:') ? (k === 'p5' ? ['Nhìn 4 phương án trước: cùng gốc khác đuôi → chỉ cần xem vị trí chỗ trống, không đọc hết câu.', 'Câu nào quá 30 giây thì đoán và đi tiếp; đánh dấu để xem lại nếu còn giờ.'] : ['Đọc câu hỏi trước, gạch từ khoá, rồi tìm trong bài (đọc lướt).', 'Không dịch từng chữ. Câu suy luận để sau, làm câu tìm chi tiết trước.'])
    : TO_HOW[tmSk(u)][1];
  return `<div class="box"><b>${esc(tmName(u))}</b>${ls.map(s => `<p style="margin:4px 0">• ${esc(s)}</p>`).join('')}</div>`; }
function tmTeach(u, go) { $app.innerHTML = `<div class="row top"><button class="link" data-a="back">← Luyện TOEIC</button><span class="uname">📘 Trước khi thử</span></div><h1>📘 ${esc(tmName(u))}</h1>
    <p class="mute">Đọc lại cách làm rồi mới thử: làm thêm mà không đổi cách làm thì dễ sai như cũ.</p>${tmTipHtml(u)}<button class="pri" data-tm="go">Thử →</button>`;
  $app.onclick = e => { if (e.target.closest('[data-a="back"]')) return toeicView(); if (e.target.closest('[data-tm="go"]')) { scrollTo(0, 0); go(); } }; }
// câu chưa gặp 30 ngày trước; hết thì lấy câu cũ nhất (lượt đó không tính lần thử, app báo)
const tmFresh = x => { const r = toSt().r[x.id]; return !r || Date.now() - r.at >= TM_FRESH_D * DAY; };
function tmPool(u) { const k = u.split(':')[1]; return u.startsWith('p5:') ? TO.p5.filter(x => x.t === k) : u.startsWith('tr:') ? TO.p2.filter(x => (x.tr || []).includes(k)) : u === 'p7' ? TO.p7 : TO[u] || []; }
const tmFreshN = u => u.startsWith('spd:') ? null : tmPool(u).filter(tmFresh).length;
async function tmFix(u) { await toLoad(); if (!NCLIPS.size) try { NCLIPS = new Set(await (await fetch('n/index.json?v=' + APP_V)).json()); } catch (e) {}
  const f = tmFocus().act.find(w => w.u === u), d = dayOf(Date.now());
  const run = () => { if (u.startsWith('spd:')) return toSpeed(u.slice(4));
    const pool = tmPool(u), fr = shuf(pool.filter(tmFresh)), R = toSt().r, old = [...pool].sort((a, b) => ((R[a.id] || {}).at || 0) - ((R[b.id] || {}).at || 0));
    const n = /^(p3|p4|p6|p7)$/.test(u) ? 2 : 10, xs = (fr.length >= (n === 2 ? 1 : 5) ? fr : [...fr, ...old.filter(x => !fr.includes(x))]).slice(0, n);
    if (!fr.length) toast('Hết bài mới cho chỗ này: lượt này không tính lần thử (đã gặp trong 30 ngày).');
    const mk = x => u.startsWith('p5:') ? [toP5Q(x)] : u === 'p2' || u.startsWith('tr:') ? [toP2Q(x)] : u === 'p3' || u === 'p4' ? toTalkQs(x, u) : u === 'p6' ? toP6Qs(x) : toP7Qs(x);
    ieRun('🗺 ' + tmName(u), xs.flatMap(mk), toeicView, 0, { R: toSt().r, home: 'Luyện TOEIC', done: (res, fresh) => toLog(res, 'luyen', fresh) }); };
  if (u.startsWith('spd:') || (f && f.tr >= 1 && f.td !== d)) return tmTeach(u, run);   // tốc độ: luôn xem cách làm nhanh; chỗ khác: từ lần thử 2
  run(); }

// ---------- ô 🗺 Bản đồ điểm ở màn Luyện TOEIC ----------
function tmBox() { const f = tmFocus(), o = toSt(), has = Object.keys(o.ty || {}).length || (o.spd || []).length, base = toBase(o.target);
  const row = w => { const fn = tmFreshN(w.u); return `<div style="margin:8px 0;border-top:1px solid var(--line);padding-top:6px"><div class="row"><b>${TM_SK[w.sk].split(' ')[0]} ${esc(w.t)}</b><span class="mute">${esc(w.v)}</span></div>
    <p class="mute" style="margin:2px 0">${w.p ? `≈ +${w.p} điểm nếu đạt ngưỡng · ` : ''}thử ${w.tr}/${TM_TRY} · đạt liền ${w.pd}/2${w.r ? ` · quay lại lần ${w.r}` : ''}${fn != null ? ` · còn ${fn} bài mới` : ''}${w.sure ? '' : ' · bằng chứng chưa chắc'}</p>
    <button class="pri" data-tm="fix|${w.u}" style="margin-top:4px">▶ Chữa</button></div>`; };
  return `<div class="box"><div class="row"><b>🗺 Bản đồ điểm</b><span class="mute">🎯 ${f.act.length}/${TM_ACT} · ⏳ ${f.queue.length} · ✅ ${f.done}</span></div>
    <p class="mute" style="margin:6px 0 0">Ngưỡng đạt theo mục tiêu ${o.target}: đúng ≥ ${Math.round(toTh() * 100)}% mỗi dạng / Part.</p>
    ${!has ? '<p class="mute" style="margin:6px 0 0">Chưa có dữ liệu. Làm 1 đề thử hoặc vài lượt luyện: app tự tìm chỗ làm mất điểm nhiều nhất.</p>'
      : f.act.length ? `<p class="mute" style="margin:6px 0 0">Chữa tối đa ${TM_ACT} chỗ (Nghe ≤ 2, Đọc ≤ 2). Mỗi lần thử phải là câu / bài mới. Đạt 2 lượt liền ở 2 ngày khác nhau là xong.</p>${f.act.map(row).join('')}`
      : (n => n ? `<p class="mute" style="margin:6px 0 0">Có ${n} chỗ có thể yếu nhưng chưa đủ dữ liệu (≥ 8 câu ở ≥ 2 bài). Làm thêm rồi app mới đưa vào chữa.</p>`
        : '<p class="mute" style="margin:6px 0 0">Chưa thấy chỗ yếu so với ngưỡng mục tiêu. Làm thêm đề thử để chắc, hoặc nâng điểm mục tiêu.</p>')(tmWeak().filter(w => !w.sure).length)}
    ${f.queue.length ? `<details style="margin:6px 0"><summary>⏳ Hàng chờ: <b>${f.queue.length}</b> chỗ</summary>${f.queue.slice(0, 8).map(w => `<p style="margin:2px 0;font-size:15px">${TM_SK[w.sk].split(' ')[0]} ${esc(w.t)} <span class="mute">· ${esc(w.v)} · ≈ +${w.p} điểm</span></p>`).join('')}</details>` : ''}
    ${f.park.length ? `<details style="margin:6px 0"><summary>⏸ Tạm gác: <b>${f.park.length}</b> chỗ</summary>${f.park.map(w => `<p style="margin:2px 0;font-size:15px">${esc(w.t)} <span class="mute">· quay lại ${new Date(w.at + TM_PARK_D * DAY).toLocaleDateString('vi-VN')}</span></p>`).join('')}</details>` : ''}
    ${f.root.length ? `<div style="margin:8px 0"><b>🧱 Kẹt lâu, cần học nền: ${f.root.length} chỗ</b><p class="mute" style="margin:2px 0">Đã gác, quay lại vẫn kẹt: luyện thêm dạng câu không giúp. Ngữ pháp → học Ngữ pháp CEFR; từ vựng, đọc, nghe → 📚 Từ vựng công sở và nền CEFR. Xong bấm "Đã học nền".</p>
      <button data-iecefr="${base}">🎯 Học nền CEFR ${LVN[base]}</button><button data-tovoc="">📚 Ôn từ vựng công sở</button>${f.root.map(w => `<button data-tm="rl|${w.u}" style="margin:3px 0">✅ Đã học nền: ${esc(w.t)}</button>`).join('')}</div>` : ''}
    <p class="mute" style="margin:6px 0 0">Điểm cộng ước theo số câu đề thật (~4,9 điểm / câu), không phải bảng ETS. Ngưỡng 3 chỗ, 3 lần thử, 14 ngày gác là ước đoán, sẽ chỉnh theo dữ liệu thật.</p></div>`; }
document.addEventListener('click', e => { const b = e.target.closest('[data-tm]'); if (!b || !S) return; const v = b.dataset.tm, i = v.indexOf('|'), a = i < 0 ? v : v.slice(0, i), u = v.slice(i + 1);
  if (a === 'fix') { scrollTo(0, 0); return tmFix(u); }
  if (a === 'rl') { fcRelease(toSt().fo, u); S.t = Date.now(); save(); return toeicView(); } });
