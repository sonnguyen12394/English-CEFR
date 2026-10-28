// Từ vựng A1 (tools/extract-a1.mjs → a1.json). Hai cấp (người sáng lập 23/10/2026: "2 cấp, 2 cổng"): Pre-A1 (từ Cambridge Starters + số đếm) → A1.
// Mỗi cấp có Thi chuyển cấp riêng; qua Pre-A1 mới mở bài A1. Cổng A1 tính trên TẤT CẢ từ (Pre-A1 + A1).
// Luật mở Thi chuyển cấp như game (GATE_LEARN / GATE_MEM, v176): 📘 Học 100% · 🔁 Nhớ 80%, trên tập từ của cấp.
// 📘 Học = số từ đã học (có thẻ ôn) / tổng từ của cấp.
// 📚 Từ vựng: 🔁 Nhớ chia 5 mặt (người sáng lập 22/10/2026: "nhớ từ phải chia nhiều mục để đánh giá, không nói nhớ suông"): 📖 Nghĩa · 🎧 Nghe · ✍️ Viết · 🧩 Dùng
// · 🗣 Nói ra từ (23/10/2026, chỉ máy kiểm: máy chép chữ ra đúng từ, trình duyệt phải chép được, như Safari).
// 25/10/2026 (người sáng lập: tách bạch mục tiêu từng phần): từ vựng chỉ đo "biết từ". Tên mặt tránh trùng tên kỹ năng (Nghe → 🔊 Nhận âm, Viết → ✍️ Chính tả).
// 🎯 chấm âm chuyển sang phần 👄 Phát âm (parts.js; bằng chứng dm.am vẫn ghi, không đổi lịch ôn của thẻ). Bài đọc / nghe câu / nghe chép chuyển sang phần kỹ năng, thôi tính cho từ.
//   Một mặt của một từ là nhớ khi: đúng mặt đó ở một ngày SAU ngày học xong unit (MEM_DAYS = 1, góp ý #3), lần gần nhất của mặt đó đúng,
//   và khả năng nhớ của từ hiện ≥ 0,9 (một lịch ôn chung cho từ). Thanh mỗi mặt = số từ nhớ mặt đó / 870.
//   🔁 Nhớ tổng = mặt thấp nhất; Thi chuyển cấp mở khi 📘 Học 100% và MỖI mặt ≥ 80% (mặt mạnh không bù được mặt yếu).
const SB_URL = 'https://eojrfoormaqboxwvdqhr.supabase.co';
const SB_KEY = 'sb_publishable_WGUA_5AyhR8a_yQfty8JBA_EaJdkZA7';   // khoá công khai; quyền do RLS bảng vocab_state
// Tự đăng nhập (người sáng lập 22/10/2026): tài khoản riêng chỉ để học. Mật khẩu lộ trong mã trang là chấp nhận được vì tài khoản
// này chỉ đọc / ghi dòng của chính nó trong vocab_state; bảng soxuong có luật restrictive chặn riêng tài khoản này.
const AUTO = { email: 'hoc-a1@english-cefr.app', password: 'FK86g0kICNxxSPM_-9-jDDY_eB99jOLL' };
const GATE_LEARN = 100, GATE_MEM = 80, MEM_DAYS = 1, HOLD_R = 0.9;
const ROUND = 20, EXAM_N = 40, EXAM_PASS = 0.8;
const DAY = 864e5;
const APP_V = 62;   // tăng khi phát hành; nhớ đổi ?v= trong index.html và "v" trong version.json
window.CUR = { view: 'tai' };   // bối cảnh cho 💬 Góp ý (gopy.js): màn, unit, câu đang làm

const sb = window.supabase.createClient(SB_URL, SB_KEY);
const $app = document.getElementById('app');
let UNITS = [], WORDS = [], WBY = {}, UBY = {}, READS = [];
const LVN = { pre: 'Pre-A1', a1: 'A1', a2: 'A2', a2p: 'A2+', b1: 'B1', b1p: 'B1+', b2: 'B2', b2p: 'B2+', c1: 'C1', c2: 'C2' };   // B1 → C2 có bài học, thi từ v52 (b.json)
// Cấp theo Oxford 3000/5000 (chuẩn chính) → CEFR-J / Octanove (tools/build-levels.mjs, 23/10/2026). Bài đo cấp (place.js) đã bỏ theo người sáng lập.
let REF = null;   // từ B1–C2 để tra, tải khi mở Từ điển
async function loadRef() { if (REF) return REF; REF = (await (await fetch('ref.json?v=4')).json()).words; REF = REF.filter(w => !(WBY[w.id] && WBY[w.id].u)); for (const w of REF) WBY[w.id] = w; return REF; }   // từ đã vào khoá (B1 → C2) không lặp
const LEVELS = ['pre', 'a1', 'a2', 'a2p', 'b1', 'b1p', 'b2', 'b2p', 'c1', 'c2'];   // 27/10/2026: thêm B1 → C2 (b.json, người sáng lập "làm hết tới C2")
// cấp có bài học, theo thứ tự (A2+ từ 23/10/2026: người sáng lập "mỗi cấp một cổng")
const DUR_PREV = { a2: 'a1', a2p: 'a2', b1: 'a2p', b1p: 'b1', b2: 'b1p', b2p: 'b2', c1: 'b2p', c2: 'c1' };   // cổng cần cấp trước "Đạt bền"
let S = null, user = null, sync = '';

// ---------- lịch ôn (đường quên kiểu FSRS: R = 1 / (1 + t / 9S); R = 0,9 khi t = S) ----------
const dayOf = ms => Math.floor((ms - new Date(ms).getTimezoneOffset() * 60000) / DAY);
const recall = (c, now) => c ? 1 / (1 + Math.max(0, now - c.last) / DAY / (9 * c.S)) : 0;
const isDue = (c, now) => !!c && (now - c.last) / DAY >= c.S;
const held = (c, now, w, lv = curLevel()) => !!c && wDims(w, lv).every(k => heldDim(c, k, now));   // từ nhớ đủ mọi yêu cầu của cấp
function learnCards(st, u, now) {
  st.units[u.id] = { d: dayOf(now) };
  for (const w of u.words) if (!st.cards[w.id]) st.cards[w.id] = { S: 1, last: now, d0: dayOf(now), ok: 1, pv: 0, n: 0, lapse: 0 };
}
// 🔁 Nhớ của Từ vựng = 12 yêu cầu theo cấp (người sáng lập 26/10/2026: "bản chất của mục tiêu Nhớ là phục vụ các yêu cầu hiểu một từ theo từng cấp;
// cấp trên bao gồm mọi yêu cầu của cấp dưới"; khung 18 tiêu chí của Nation, phần Pre-A1 → A2):
//   Pre-A1 (6): thấy từ → nghĩa · nghe → nghĩa · nhận đúng chữ · nghĩa → nhớ ra từ · nói ra từ · chính tả
//   A1 (+3):   cụm hay đi cùng · nhận ra dạng bất quy tắc · tự điền từ vào câu
//   A2 (+3):   đồng / trái nghĩa · nghĩa thứ hai · tự dùng dạng bất quy tắc
// Yêu cầu chỉ áp cho từ có dữ liệu (vx.json: irr, rel, s2; cụm col; câu cloze). Cấp của yêu cầu ≤ cấp đang học mới đòi (dồn cấp).
// Bằng chứng một yêu cầu chỉ tính (pv) khi đã được dạy: từ của cấp ≥ cấp yêu cầu → dạy ở bài học (c.d0); từ cấp thấp hơn → dạy ở bài ⬆️ Nâng cấp (c.du[cấp]).
const VREQ = [
  ['nghia', '📖 Thấy từ → nghĩa', 'pre', () => true], ['nghe', '🔊 Nghe → nghĩa', 'pre', () => true], ['chu', '🔤 Nhận đúng chữ', 'pre', () => true],
  ['nhora', '💭 Nghĩa → nhớ ra từ', 'pre', () => true], ['noi', '🗣 Nói ra từ', 'pre', () => true], ['viet', '✍️ Chính tả', 'pre', () => true],
  ['cum', '🔗 Cụm hay đi cùng', 'a1', w => !!w.col], ['bqt', '🔀 Nhận ra dạng bất quy tắc', 'a1', w => !!w.irr], ['dung', '🧩 Tự điền từ vào câu', 'a1', w => !!w.cloze],
  ['lienq', '↔️ Đồng / trái nghĩa', 'a2', w => !!w.rel], ['nghia2', '🎭 Nghĩa thứ hai', 'a2', w => !!w.s2], ['bqt2', '✏️ Tự dùng dạng bất quy tắc', 'a2', w => !!w.irr],
  // 27/10/2026 (B1 → C2: 6 mặt còn lại của khung 18 mặt của Nation + độ tự động, nghĩa bóng; chia theo cấp là đề xuất của Claude)
  ['cumtu', '🔗 Tự dùng cụm từ', 'b1', w => !!(w.col && colPart(w))], ['mau', '🧱 Mẫu câu của từ', 'b1', w => !!w.pat], ['ho', '🔧 Nhận ra họ từ', 'b1', w => !!(w.fam && w.fam.length)],
  ['taodang', '🛠 Tự tạo dạng từ', 'b2', w => !!w.famQ], ['sacthai', '🎚 Sắc thái, trang trọng', 'b2', w => !!w.reg], ['thay', '🔄 Tự thay từ đồng nghĩa', 'b2', w => !!(w.rel && w.rel.syn.length)],
  ['vanphong', '🎩 Chọn đúng văn phong', 'c1', w => !!w.reg], ['tucthi', '⚡ Nhận ra tức thì', 'c1', () => true], ['thanhngu', '🌫 Thành ngữ, nghĩa bóng', 'c2', w => !!w.idi]];
// từ còn thiếu trong cụm (🔗 Tự dùng cụm từ): từ đi kèm đầu tiên không phải mạo từ, không phải chính từ đó (make a decision → make)
const colPart = w => { if (!w.col) return null; const stem = w.w.toLowerCase().split(' ')[0].slice(0, Math.max(3, w.w.length - 2));
  return w.col.ok.split(' ').find(t => !/^(a|an|the|someone|something|sb|sth|your|my|his|her)$/i.test(t) && !t.toLowerCase().startsWith(stem) && /^[a-z'-]+$/i.test(t)) || null; };
const VREQ_BY = Object.fromEntries(VREQ.map(r => [r[0], r]));
const DIMS = VREQ.map(r => [r[0], r[1]]);
const lvIdx = l => LEVELS.indexOf(l);
const MEM_SAMPLE = 100, MEM_FULL_FROM = 'b1';   // 🔁 Nhớ từ B1: xem memWords
const dimsAt = (lv = curLevel()) => VREQ.filter(r => lvIdx(r[2]) <= lvIdx(lv)).map(r => [r[0], r[1]]);
// yêu cầu chiều sâu từ B1 (cụm, mẫu câu, họ từ, sắc thái, đồng nghĩa, văn phong, tức thì, thành ngữ) chỉ áp cho từ cấp đó trở lên (đề thật hỏi các mặt này trên mẫu câu, không trên mọi từ đã học)
const wDims = (w, lv = curLevel()) => w ? VREQ.filter(r => lvIdx(r[2]) <= lvIdx(lv) && r[3](w) && (lvIdx(r[2]) < lvIdx(MEM_FULL_FROM) || lvIdx(wLv(w)) >= lvIdx(r[2]))).map(r => r[0]) : [];
const wLv = w => (UBY[w.u] || {}).lv || 'pre';
// ngày yêu cầu k được dạy cho từ w (null = chưa dạy: cần bài ⬆️ Nâng cấp)
const taughtDay = (c, w, k) => { const L = VREQ_BY[k] ? VREQ_BY[k][2] : 'pre'; return lvIdx(wLv(w)) >= lvIdx(L) ? c.d0 : (c.du && c.du[L] != null ? c.du[L] : null); };
const DIM_OF = { colT: ['cumtu', 'cum'], pat: ['mau'], fam: ['ho'], famQ: ['taodang', 'ho'], reg: ['sacthai'], synT: ['thay', 'lienq'], style: ['vanphong', 'sacthai'], fast: ['tucthi', 'nghia'], idi: ['thanhngu'],
  w2vi: ['nghia'], listen: ['nghe'], form: ['chu', 'nhora'], vi2w: ['nhora'], spell: ['viet', 'nhora'], noi: ['noi'], col: ['cum'], irrR: ['bqt'],
  clozeT: ['dung', 'viet', 'nhora'], rel: ['lienq'], s2: ['nghia2'], irrT: ['bqt2', 'bqt'], cloze: [], am: ['am'] };
const heldDim = (c, k, now) => !!c && !!c.dm && !!c.dm[k] && !!c.dm[k].pv && !!c.dm[k].ok && recall(c, now) >= HOLD_R;
function grade(st, wid, ok, now, type) {
  const c = st.cards[wid]; if (!c) return;
  const t = (now - c.last) / DAY;
  if (type !== 'am') {
  // ôn sớm (t < S) chỉ tăng theo phần thời gian đã trôi: luyện dồn nhiều lần trong một ngày không đẩy lịch ôn đi xa
  if (ok) { const full = Math.max(c.S, t) * 2.5; c.S = t >= c.S ? full : c.S + (full - c.S) * t / c.S; if (dayOf(now) - c.d0 >= MEM_DAYS) c.pv = 1; }
  else { c.S = 0.5; c.lapse++; }
  c.ok = ok ? 1 : 0; c.last = now; c.n++; }
  c.dm = c.dm || {}; const w = WBY[wid];
  for (const k of DIM_OF[type] || []) { const d = c.dm[k] = c.dm[k] || {}; d.ok = ok ? 1 : 0; d.n = (d.n || 0) + 1;
    let td = w ? taughtDay(c, w, k) : c.d0;
    // 27/10/2026 (Claude, người sáng lập giao "tự tính"): bỏ bài ⬆️ Nâng cấp riêng. Từ cấp trước gặp yêu cầu mới lần đầu trong 🏋️ Luyện tập
    // = được dạy hôm đó (giải thích hiện sau câu); từ ngày sau làm đúng mới tính 🔁 Nhớ.
    if (td == null && w && VREQ_BY[k]) { c.du = c.du || {}; td = c.du[VREQ_BY[k][2]] = dayOf(now); }
    if (ok && td != null && dayOf(now) - td >= MEM_DAYS) d.pv = 1; }
}
// ⬆️ Nâng cấp: các cấp yêu cầu (A1, A2) mà từ w (cấp thấp hơn) cần được dạy thêm khi đang học cấp lv
const upNeed = (w, lv = curLevel(), c = S.cards[w.id]) => [...new Set(VREQ.map(r => r[2]))].filter(L => L !== 'pre').filter(L => lvIdx(L) > lvIdx(wLv(w)) && lvIdx(L) <= lvIdx(lv) && VREQ.some(r => r[2] === L && r[3](w)) && !(c && c.du && c.du[L] != null));
// Người sáng lập 25/10/2026: 📘 Học chỉ tính từ của cấp đang học; 🔁 Nhớ và Thi chuyển cấp tính dồn cả các cấp trước. 26/10/2026: 📘 Học tính thêm
// bài ⬆️ Nâng cấp của từ cấp trước (dạy yêu cầu mới trước khi Nhớ đòi). Mỗi yêu cầu tính trên các từ có dữ liệu cho yêu cầu đó.
function parts(st, now, lv = curLevel()) { const WL = levelWords(lv), WM = memWords(lv, now), WU = [];   // 27/10/2026: không còn bài ⬆️ Nâng cấp tính vào 📘 Học (dạy trong luyện tập)
  let learn = 0, full = 0, due = 0; const ks = dimsAt(lv).map(d => d[0]), dim = Object.fromEntries(ks.map(k => [k, 0])), Tk = Object.fromEntries(ks.map(k => [k, 0]));
  for (const w of WL) if (st.cards[w.id]) learn++;
  for (const w of WU) if (st.cards[w.id] && !upNeed(w, lv, st.cards[w.id]).length) learn++;
  for (const w of WM) { const c = st.cards[w.id]; if (isDue(c, now)) due++; let all = !!c;
    for (const k of wDims(w, lv)) { Tk[k]++; if (heldDim(c, k, now)) dim[k]++; else all = false; } if (all) full++; }
  const T = WL.length + WU.length, dq = Object.fromEntries(ks.map(k => [k, Tk[k] ? Math.floor(dim[k] / Tk[k] * 100) : 100]));
  return { learn, full, due, T, Tn: WL.length, Tu: WU.length, Tm: WM.length, dim, Tk, dq, lq: Math.floor(learn / (T || 1) * 100), mq: Math.min(...Object.values(dq)) };
}
const gateOpen = p => p.lq >= GATE_LEARN && p.mq >= GATE_MEM;
// Góp ý #3 / #4: dấu của từng từ. chua = chưa học · hoc = đã học, chưa đủ bằng chứng nhớ · nho = tính vào 🔁 Nhớ · quen = lần gần nhất sai hoặc đã tới lúc sắp quên.
// hoc + nho + quen = 📘 Học; nho = 🔁 Nhớ.
// nho = đủ 5 mặt
function wstat(st, w, now) { const c = st.cards[w.id]; if (!c) return 'chua'; if (held(c, now, w)) return 'nho'; if (!c.ok || recall(c, now) < HOLD_R) return 'quen'; return 'hoc'; }
const WST = [['chua', '⚪ Chưa học'], ['hoc', '📘 Đã học'], ['nho', '✅ Nhớ đủ'], ['quen', '⚠️ Quên']];
const dimMarks = (c, now, w) => DIMS.filter(([k]) => wDims(w).includes(k)).map(([k, l]) => `<span class="dm ${heldDim(c, k, now) ? 'on' : ''}" title="${l}">${l.split(' ')[0]}</span>`).join('');
// mặt nào còn thiếu thì hỏi mặt đó (ngẫu nhiên trong các yêu cầu thiếu của từ ở cấp đang học); đủ cả thì hỏi ngẫu nhiên một yêu cầu của từ.
// 🗣 Nói ra từ chỉ luyện ở noi.js (bộ nói), không hỏi ở đây.
const TYPE_FOR = { nghia: () => 'w2vi', nghe: () => 'listen', chu: () => 'form', nhora: () => one(['form', 'spell']), viet: () => 'spell', cum: () => 'col',
  bqt: () => 'irrR', dung: () => 'clozeT', lienq: () => 'rel', nghia2: () => 's2', bqt2: () => 'irrT',
  cumtu: () => 'colT', mau: () => 'pat', ho: () => 'fam', taodang: () => 'famQ', sacthai: () => 'reg', thay: () => 'synT', vanphong: () => 'style', tucthi: () => 'fast', thanhngu: () => 'idi' };
// 27/10/2026: yêu cầu hiếm (ít từ có, vd. 🧱 mẫu câu ~25 từ / cấp) chọn ngẫu nhiên đều thì gần như không được hỏi (mô phỏng B1: ~50 lần / 720 ngày).
// Từ B1: chọn có trọng số 1 / √(số từ có yêu cầu đó): yêu cầu hiếm được hỏi đủ. Pre-A1 → A2+ giữ chọn đều (mô phỏng: trọng số làm A1 chậm từ 147 lên 303 ngày).
const DIM_N = {}; const dimN = (k, lv = curLevel()) => { const key = lv + '|' + k; if (DIM_N[key] == null) DIM_N[key] = WORDS.filter(w => wDims(w, lv).includes(k)).length || 1; return DIM_N[key]; };
function typeFor(c, now, w) { const ks = wDims(w).filter(k => k !== 'noi'), miss = ks.filter(k => !heldDim(c, k, now)), L = miss.length ? miss : ks;
  const wt = L.map(k => lvIdx(curLevel()) >= lvIdx(MEM_FULL_FROM) ? 1 / Math.sqrt(dimN(k)) : 1), sum = wt.reduce((a, b) => a + b, 0); let r = Math.random() * sum, i = 0; while (i < L.length - 1 && (r -= wt[i]) > 0) i++;
  return TYPE_FOR[L[i]](); }
// 🔤 chữ gần giống để nhận đúng chữ: từ thật gần giống (khác 1–2 chữ) + chữ viết sai kiểu hay gặp (đảo, thiếu, thừa chữ, đổi nguyên âm)
function lev(a, b) { const m = a.length, n = b.length, d = Array.from({ length: m + 1 }, (_, i) => [i, ...Array(n).fill(0)]); for (let j = 1; j <= n; j++) d[0][j] = j;
  for (let i = 1; i <= m; i++) for (let j = 1; j <= n; j++) d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)); return d[m][n]; }
function lookalike(w, n) { const x = w.w, low = x.toLowerCase(), out = new Set();
  const real = shuf(WORDS.filter(y => y.id !== w.id && y.vi !== w.vi && Math.abs(y.w.length - x.length) <= 1 && y.w[0].toLowerCase() === low[0] && lev(y.w.toLowerCase(), low) <= 2)).map(y => y.w);
  if (real.length) out.add(real[0]);
  const V = 'aeiou', fake = [];
  for (let i = 1; i < x.length - 1; i++) if (x[i] !== ' ' && x[i + 1] !== ' ' && x[i] !== x[i + 1]) fake.push(x.slice(0, i) + x[i + 1] + x[i] + x.slice(i + 2));   // đảo 2 chữ
  for (let i = 1; i < x.length; i++) if (x[i] !== ' ' && x.length > 3) fake.push(x.slice(0, i) + x.slice(i + 1));   // thiếu 1 chữ
  for (let i = 1; i < x.length; i++) if (/[bcdfglmnprst]/.test(x[i])) fake.push(x.slice(0, i + 1) + x[i] + x.slice(i + 1));   // gấp đôi phụ âm
  for (let i = 0; i < x.length; i++) if (V.includes(x[i])) for (const v of V) if (v !== x[i]) fake.push(x.slice(0, i) + v + x.slice(i + 1));   // đổi nguyên âm
  const all = new Set(WORDS.map(y => y.w.toLowerCase()));
  for (const f of shuf(fake)) { if (out.size >= n) break; if (f.toLowerCase() !== low && !all.has(f.toLowerCase())) out.add(f); }
  for (const r of real.slice(1)) { if (out.size >= n) break; out.add(r); }
  return [...out].slice(0, n); }
// 🔀 dạng bất quy tắc: phương án sai = dạng "theo quy tắc" sai (goed, childs, gooder…) + dạng khác của chính từ đó (gone khi hỏi quá khứ) + chính từ gốc
function irrWrong(w, f) { const b = w.w.toLowerCase(), ok = new Set(f[1].map(x => x.toLowerCase())), k = w.irr.k, c = [];
  if (k === 'v') c.push(b.endsWith('e') ? b + 'd' : b + 'ed', b + 's', b.endsWith('e') && !b.endsWith('ee') ? b.slice(0, -1) + 'ing' : b + 'ing'); else if (k === 'n') c.push(b + 's', b + 'es', f[1][0] + 's'); else c.push(b + 'er', 'more ' + b, b + 'est');
  for (const g of w.irr.f) if (g !== f) c.push(...g[1]); c.push(b);
  const r = [...new Set(c.filter(x => !ok.has(x.toLowerCase())))];
  // ít hơn 3 phương án thì thêm dạng sai kiểu khác (fish → fishs, fishen)
  for (const x of [b + 'es', b + 'en', b + 'ed']) if (r.length < 3 && !ok.has(x) && !r.includes(x)) r.push(x);
  return r; }
// câu dạng mới (#3, #8, #10, #11, #12); trả về null nếu từ không có dữ liệu cho dạng đó
function questionX(w, type) {
  if (type === 'form') return { type, top: `${w.pic || ''} ${esc(w.vi)}`, sub: 'Chọn đúng cách viết của từ này.', a: w.w, opts: shuf([w.w, ...lookalike(w, 3)]) };
  if ((type === 'irrR' || type === 'irrT') && w.irr) { const f = one(w.irr.f);
    if (type === 'irrT') return { type, top: `${esc(f[0][0].toUpperCase() + f[0].slice(1))} của “${esc(w.w)}” là gì?`, sub: `${esc(w.w)} = ${esc(w.vi)}. Gõ dạng đúng.`, a: f[1][0], alt: f[1].slice(1), typed: true, after: irrLine(w) };
    return { type, top: `${esc(f[0][0].toUpperCase() + f[0].slice(1))} của “${esc(w.w)}” là gì?`, sub: `${esc(w.w)} = ${esc(w.vi)}`, a: f[1][0], opts: shuf([f[1][0], ...shuf(irrWrong(w, f)).slice(0, 3)]), after: irrLine(w) }; }
  if (type === 'rel' && w.rel) { const syn = w.rel.syn.length && (!w.rel.ant.length || Math.random() < 0.5), L = syn ? w.rel.syn : w.rel.ant, a = one(L);
    const bad = new Set([w.w, ...w.rel.syn, ...w.rel.ant].map(x => x.toLowerCase())), pos = w.pos.split(',')[0];
    const wr = shuf(WORDS.filter(y => !bad.has(y.w.toLowerCase()) && y.pos.split(',')[0] === pos && !(y.rel && (y.rel.syn.includes(a) || y.rel.ant.includes(a))))).slice(0, 3).map(y => y.w);
    if (wr.length < 3) wr.push(...shuf(WORDS.filter(y => !bad.has(y.w.toLowerCase()) && !wr.includes(y.w) && !(y.rel && (y.rel.syn.includes(a) || y.rel.ant.includes(a))))).slice(0, 3 - wr.length).map(y => y.w));
    return { type, top: `Từ nào ${syn ? '<b>cùng nghĩa</b>' : '<b>trái nghĩa</b>'} với “${esc(w.w)}”?`, sub: `${esc(w.w)} = ${esc(w.vi)}`, a, opts: shuf([a, ...wr]), after: relLine(w) }; }
  if (type === 'colT' && colPart(w)) { const p = colPart(w), re = new RegExp(`\\b${p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`);
    return { type, top: esc(w.col.ok.replace(re, '___')), sub: `${esc(w.w)} = ${esc(w.vi)}. Gõ từ còn thiếu trong cụm hay dùng.`, a: p, typed: true, after: `<br>🔗 Cụm: <b>${esc(w.col.ok)}</b>` }; }
  if (type === 'pat' && w.pat) return { type, top: esc(w.pat.s), sub: `${esc(w.w)} = ${esc(w.vi)}. Chọn từ đúng mẫu câu.`, a: w.pat.a, opts: shuf([w.pat.a, ...w.pat.w]), after: `<br>🧱 Mẫu: <b>${esc(w.pat.m || w.pat.s.replace('___', w.pat.a))}</b>` };
  if (type === 'fam' && w.fam && w.fam.length) { const a = one(w.fam), st = x => x.toLowerCase().slice(0, 4), bad = new Set([w.w, ...w.fam].map(st));
    const wr = shuf(WORDS.filter(y => !bad.has(st(y.w)) && !y.w.includes(' ') && Math.abs(y.w.length - a.length) <= 3)).slice(0, 3).map(y => y.w);
    return { type, top: `Từ nào cùng họ (cùng gốc) với “${esc(w.w)}”?`, sub: `${esc(w.w)} = ${esc(w.vi)}`, a, opts: shuf([a, ...wr]), after: `<br>🔧 Họ từ: <b>${esc([w.w, ...w.fam].join(', '))}</b>` }; }
  if (type === 'famQ' && w.famQ) return { type, top: esc(w.famQ.s), sub: `Gõ dạng đúng của <b>${esc(w.w.toUpperCase())}</b> cho vừa câu.`, a: w.famQ.a, typed: true, after: `<br>🛠 ${esc(w.w)} → <b>${esc(w.famQ.a)}</b>` };
  if ((type === 'reg' || type === 'style') && w.reg) { const [f, i] = w.reg.f ? [w.w, w.reg.p] : [w.reg.p, w.w];
    if (type === 'reg') return { type, top: `“${esc(w.w)}” và “${esc(w.reg.p)}” cùng nghĩa (${esc(w.reg.vi || w.vi)}). Từ nào <b>trang trọng</b> hơn?`, sub: 'Trang trọng: dùng trong thư công việc, văn bản, thông báo.', a: f, opts: shuf([f, i]).concat('Như nhau'), after: `<br>🎚 Trang trọng: <b>${esc(f)}</b> · thân mật: <b>${esc(i)}</b>` };
    const formal = Math.random() < 0.5;
    return { type, top: formal ? '📧 Bạn viết thư xin việc / gửi công ty. Dùng từ nào?' : '💬 Bạn nhắn tin cho bạn thân. Dùng từ nào tự nhiên hơn?', sub: `Nghĩa: ${esc(w.reg.vi || w.vi)}`, a: formal ? f : i, opts: shuf([f, i]).concat('Dùng từ nào cũng như nhau'), after: `<br>🎩 Thư trang trọng: <b>${esc(f)}</b> · nói chuyện thân mật: <b>${esc(i)}</b>` }; }
  if (type === 'synT' && w.rel && w.rel.syn.length) { const re = new RegExp(`\\b(${w.w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\w*)`, 'i');
    return { type, top: esc(w.ex).replace(re, '<b>$1</b>'), sub: 'Gõ một từ cùng nghĩa có thể thay từ in đậm.', a: w.rel.syn[0], alt: w.rel.syn.slice(1), typed: true, after: relLine(w) }; }
  if (type === 'fast') return { type, top: esc(w.w), sub: '⚡ Chọn nghĩa thật nhanh (dưới 3 giây mới tính).', a: w.vi, opts: shuf([w.vi, ...pick(w, 'vi', 3)]), timed: 3000 };
  if (type === 'idi' && w.idi) { const re = new RegExp(w.idi.p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    return { type, top: esc(w.idi.s).replace(re, m => `<b>${m}</b>`), sub: 'Cụm in đậm nghĩa là gì?', a: w.idi.vi, opts: shuf([w.idi.vi, ...w.idi.w]), after: `<br>🌫 <b>${esc(w.idi.p)}</b> = ${esc(w.idi.vi)}` }; }
  if (type === 's2' && w.s2) { const re = new RegExp(`\\b(${w.w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\w*)`, 'i');
    return { type, top: esc(w.s2.ex).replace(re, '<b>$1</b>'), sub: `Từ in đậm trong câu này nghĩa là gì?`, a: w.s2.vi, opts: shuf([w.s2.vi, ...w.s2.w]), after: `<br>🎭 Nghĩa thứ hai: <b>${esc(w.s2.vi)}</b> · ${esc(w.s2.exVi)}` }; }
  return null; }
const irrLine = w => `<br>🔀 ${esc(w.w)}: ${w.irr.f.map(([l, f]) => `${esc(l)} <b>${esc(f.join(' / '))}</b>`).join(' · ')}`;
const relLine = w => `<br>↔️ ${w.rel.syn.length ? `cùng nghĩa: <b>${esc(w.rel.syn.join(', '))}</b>` : ''}${w.rel.syn.length && w.rel.ant.length ? ' · ' : ''}${w.rel.ant.length ? `trái nghĩa: <b>${esc(w.rel.ant.join(', '))}</b>` : ''}`;

// ---------- câu hỏi ----------
const shuf = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
function pick(w, key, n) {
  const same = shuf(WORDS.filter(x => x.id !== w.id && x.pos === w.pos)), rest = shuf(WORDS.filter(x => x.id !== w.id));
  const out = [], seen = new Set([w[key]]);
  for (const x of same.concat(rest)) { if (out.length >= n) break; if (!seen.has(x[key])) { seen.add(x[key]); out.push(x[key]); } }
  return out;
}
function question(w, type) {
  if (type && type[0] === 'x') return examQ(w, type);   // câu thi mới (exam.js)
  const X = questionX(w, type); if (X) return X; if (['irrR', 'irrT', 'rel', 's2', 'colT', 'pat', 'fam', 'famQ', 'reg', 'style', 'synT', 'idi'].includes(type)) type = 'w2vi';   // từ thiếu dữ liệu: hỏi nghĩa
  if (type === 'col' && !w.col) type = 'cloze';
  if (type === 'vi2w') return { type, top: `${w.pic || ''} ${esc(w.vi)}`, sub: 'Từ tiếng Anh nào có nghĩa này?', a: w.w, opts: shuf([w.w, ...pick(w, 'w', 3)]) };
  if (type === 'w2vi') return { type, top: esc(w.w), sub: `${esc(w.ipa || '')} · nghĩa là gì?`, a: w.vi, opts: shuf([w.vi, ...pick(w, 'vi', 3)]), say: w.w };
  if (type === 'col') return { type, top: 'Cụm từ nào đúng?', sub: `${esc(w.w)}: ${esc(w.vi)}`, a: w.col.ok, opts: shuf([w.col.ok, ...w.col.bad]), after: `<br>🔗 Cụm đúng: <b>${esc(w.col.ok)}</b>` };
  if (type === 'listen') return { type, top: '🎧 Nghe rồi chọn nghĩa', sub: `<button class="chip" data-say="${w.id}">🔊 Nghe lại</button>`, a: w.vi, opts: shuf([w.vi, ...pick(w, 'vi', 3)]), say: w.w };
  // gõ từ (tự nhớ ra để viết): gợi ý chữ đầu + số chữ
  const hint = a => `Gợi ý: ${esc(a[0])}${a.slice(1).replace(/[^ ]/g, ' _')} (${a.replace(/ /g, '').length} chữ cái)`;
  if (type === 'spell') return { type, top: `${w.pic || ''} ${esc(w.vi)}`, sub: `Gõ từ tiếng Anh. ${hint(w.w)}`, a: w.w, typed: true };
  if (type === 'clozeT' && w.cloze) return { type, top: esc(w.cloze.s), sub: `Gõ từ còn thiếu (nghĩa: ${esc(w.vi)}). ${hint(w.cloze.a)}`, a: w.cloze.a, typed: true };
  return { type: 'cloze', top: esc(w.cloze.s), sub: 'Chọn từ điền vào chỗ trống.', a: w.cloze.a, opts: shuf([w.cloze.a, ...w.cloze.w]) };
}
// Góp ý #7 (người sáng lập 22/10/2026: áp vào cả 🔁 Nhớ và Thi chuyển cấp): trắc nghiệm chỉ đo NHẬN RA từ; thêm TỰ NHỚ RA để viết (gõ từ) và NGHE HIỂU.
// Mỗi lượt: khoảng 40% gõ từ (spell / clozeT), 20% nghe, 40% trắc nghiệm.
const MC = ['vi2w', 'w2vi', 'cloze', 'col'], TYPED = ['spell', 'clozeT'];
const one = a => a[Math.floor(Math.random() * a.length)];
const mixTypes = n => shuf(Array.from({ length: n }, (_, i) => i < Math.round(n * 0.4) ? one(TYPED) : i < Math.round(n * 0.6) ? 'listen' : one(MC)));
const normAns = x => String(x).toLowerCase().replace(/[‘’`]/g, "'").replace(/\s+/g, ' ').trim().replace(/[.,!?;:]+$/g, '').trim();

// Góp ý #2 (iPhone đọc sai): phát tệp thu sẵn của game (a/<khoá>.mp3, tools/copy-clips.mjs); không có tệp mới dùng giọng máy, chọn hẳn giọng tiếng Anh
// (iPhone chỉ đặt lang thì có khi đọc bằng giọng tiếng Việt).
const clipNorm = t => String(t).replace(/[‘’]/g, "'").replace(/[“”]/g, '"').replace(/\s+/g, ' ').trim().replace(/[.,;:]+$/, '').toLowerCase();
const clipKey = t => { let h = 0x811c9dc5; const x = clipNorm(t); for (let i = 0; i < x.length; i++) { h ^= x.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; } return 'a' + h.toString(16).padStart(8, '0'); };
let CLIPS = new Set(), AUD = null, sayTok = 0;
// Góp ý "đồng bộ giọng nam / nữ, tuỳ chọn giọng": giọng thu sẵn chỉ có af_bella (nữ Mỹ). Chọn 'clip' = giọng thu sẵn, thiếu tệp thì giọng máy nữ cho khớp;
// chọn một giọng máy = cả trang chỉ đọc bằng giọng đó (bỏ tệp thu sẵn), nên không lẫn nam / nữ. Lưu theo máy (localStorage), vì mỗi máy có bộ giọng khác.
// Web Speech không cho biết giới tính: đoán theo tên giọng.
const VK = 'el-voice', VOX = (() => { try { return Object.assign({ src: 'clip', rate: 0.9 }, JSON.parse(localStorage.getItem(VK) || '{}')); } catch (e) { return { src: 'clip', rate: 0.9 }; } })();
const voxSave = () => { try { localStorage.setItem(VK, JSON.stringify(VOX)); } catch (e) {} };
const V_F = /samantha|karen|moira|tessa|victoria|allison|ava|susan|zoe|fiona|kate|serena|veena|nicky|joelle|catherine|martha|zira|hazel|aria|jenny|libby|sonia|female|woman/i;
const V_M = /daniel|alex\b|fred|rishi|tom\b|aaron|arthur|gordon|oliver|evan|nathan|david|mark\b|guy|ryan|george|thomas|lee\b|male|man\b/i;
const vSex = v => V_F.test(v.name) ? 'f' : V_M.test(v.name) ? 'm' : '';
const enVoices = () => { try { return speechSynthesis.getVoices().filter(v => /^en[-_]/i.test(v.lang)); } catch (e) { return []; } };
const vRank = v => (/en[-_](US|GB)/i.test(v.lang) ? 10 : 0) + (v.localService ? 3 : 0) + (/natural|neural|premium|enhanced/i.test(v.name) ? 5 : 0);
// 🎓 giọng thi (27/10/2026): đề Cambridge dùng giọng Anh–Anh, tốc độ thường; đề thử bật EXAM_VOX khi làm bài Nghe (máy không có giọng Anh thì dùng giọng sẵn có)
let EXAM_VOX = false;
const vGB = vs => vs.filter(v => /en[-_](GB|IE|AU)/i.test(v.lang)).sort((a, b) => (/GB/i.test(b.lang) ? 5 : 0) + vRank(b) - (/GB/i.test(a.lang) ? 5 : 0) - vRank(a));
function enVoice() { const vs = enVoices(); if (EXAM_VOX && vGB(vs).length) return vGB(vs)[0]; if (VOX.src !== 'clip') { const v = vs.find(x => x.voiceURI === VOX.src); if (v) return v; }
  return vs.sort((a, b) => (vSex(b) === 'f' ? 20 : 0) + (/en[-_]US/i.test(b.lang) ? 2 : 0) + vRank(b) - (vSex(a) === 'f' ? 20 : 0) - (/en[-_]US/i.test(a.lang) ? 2 : 0) - vRank(a))[0] || null; }
function tts(t) { return new Promise(res => { try { const u = new SpeechSynthesisUtterance(t), v = enVoice(); u.lang = v ? v.lang : 'en-US'; if (v) u.voice = v; u.rate = EXAM_VOX ? 1 : VOX.rate; u.onend = u.onerror = () => res(); speechSynthesis.speak(u); } catch (e) { res(); } }); }
const vLang = l => /US/i.test(l) ? 'Mỹ' : /GB/i.test(l) ? 'Anh' : /AU/i.test(l) ? 'Úc' : /IN/i.test(l) ? 'Ấn' : l;
const vOpts = () => [`<option value="clip"${VOX.src === 'clip' ? ' selected' : ''}>⭐ Giọng thu sẵn (nữ Mỹ, tự nhiên nhất)</option>`]
  .concat(enVoices().sort((a, b) => vRank(b) - vRank(a)).map(v => `<option value="${esc(v.voiceURI)}"${VOX.src === v.voiceURI ? ' selected' : ''}>${esc(v.name)} · ${vLang(v.lang)}${vSex(v) ? ' · ' + (vSex(v) === 'f' ? 'nữ' : 'nam') : ''}</option>`)).join('');
const voxHtml = () => `<details class="box" id="vox"><summary>🔊 Giọng đọc: ${VOX.src === 'clip' ? 'thu sẵn (nữ Mỹ)' : esc((enVoices().find(v => v.voiceURI === VOX.src) || { name: 'giọng máy' }).name)}</summary>
  <label class="mute">Giọng (cả trang đọc bằng một giọng)<select data-vox="src">${vOpts()}</select></label>
  <label class="mute">Tốc độ<select data-vox="rate">${[[0.7, 'Chậm'], [0.9, 'Vừa'], [1, 'Thường']].map(([r, l]) => `<option value="${r}"${VOX.rate === r ? ' selected' : ''}>${l}</option>`).join('')}</select></label>
  <button class="chip" data-vox="test">🔊 Nghe thử</button>
  <p class="mute" style="margin:6px 0 0">Giọng thu sẵn chỉ có giọng nữ. Muốn giọng nam: chọn giọng máy có chữ "nam". Danh sách giọng máy tuỳ theo điện thoại.</p></details>`;
document.addEventListener('change', e => { const s = e.target.closest('[data-vox]'); if (!s) return;
  if (s.dataset.vox === 'src') VOX.src = s.value; if (s.dataset.vox === 'rate') VOX.rate = +s.value; voxSave();
  const sm = document.querySelector('#vox summary'); if (sm) sm.textContent = '🔊 Giọng đọc: ' + (VOX.src === 'clip' ? 'thu sẵn (nữ Mỹ)' : (enVoices().find(v => v.voiceURI === VOX.src) || { name: 'giọng máy' }).name);
  speak('Hello! This is my voice.'); });
document.addEventListener('click', e => { if (e.target.closest('[data-vox="test"]')) speak('Hello! This is my voice.'); });
try { speechSynthesis.addEventListener('voiceschanged', () => { const s = document.querySelector('#vox [data-vox="src"]'); if (s) s.innerHTML = vOpts(); }); } catch (e) {}
// n/: giọng đọc tự nhiên (Kokoro, chủ yếu Anh–Anh) cho bài Nghe, câu đọc to, lời người kia khi đóng vai (tools/build-audio.py, 27/10/2026); ưu tiên hơn tệp game và giọng máy
let NCLIPS = new Set();
const playFile = (src, t) => new Promise(res => { AUD = AUD || new Audio(); let done = false; const end = () => { if (!done) { done = true; res(); } };
  AUD.onended = end; AUD.onerror = () => { if (!done) { done = true; tts(t).then(res); } }; AUD.src = src; const pr = AUD.play(); if (pr) pr.catch(() => { if (!done) { done = true; tts(t).then(res); } }); });
function sayOne(t) { const k = clipKey(t); if ((VOX.src === 'clip' || EXAM_VOX) && NCLIPS.has(k)) return playFile('n/' + k + '.mp3', t);
  if (EXAM_VOX || VOX.src !== 'clip' || !CLIPS.has(k)) return tts(t);
  return new Promise(res => { AUD = AUD || new Audio(); let done = false; const end = () => { if (!done) { done = true; res(); } };
    AUD.onended = end; AUD.onerror = () => { if (!done) { done = true; tts(t).then(res); } }; AUD.src = 'a/' + k + '.mp3'; const pr = AUD.play(); if (pr) pr.catch(() => { if (!done) { done = true; tts(t).then(res); } }); }); }
async function speak(...ts) { const my = ++sayTok; try { AUD && AUD.pause(); } catch (e) {} try { speechSynthesis.cancel(); } catch (e) {}
  for (const t of ts) { if (my !== sayTok) return; await sayOne(t); } }
try { speechSynthesis.getVoices(); } catch (e) {}
// Góp ý #6: một kiểu nút nghe cho mọi màn (thẻ từ, phản hồi, từ điển): 🔊 Từ · 🔊 Câu ví dụ; vào thẻ / mở từ thì tự đọc từ.
const sayBtns = w => `<div class="chips say"><button class="chip" data-say="${w.id}">🔊 Từ</button><button class="chip" data-say="${w.id}" data-ex="1">🔊 Câu ví dụ</button><button class="chip" data-noi="${w.id}">🎤 Nói thử</button></div>`;
document.addEventListener('click', e => { const b = e.target.closest('[data-say]'); if (!b) return; const w = WBY[b.dataset.say]; if (w) speak(b.dataset.ex ? w.ex : w.w); });

// ---------- lưu: máy + Supabase ----------
const blank = () => ({ v: 1, units: {}, cards: {}, exams: [], t: 0 });
const lkey = () => 'a1v:' + (user ? user.id : '');
let saveTimer = null;
function save() {
  S.t = Date.now();
  try { localStorage.setItem(lkey(), JSON.stringify(S)); } catch (e) {}
  clearTimeout(saveTimer); setSync('Đang lưu…');
  saveTimer = setTimeout(async () => {
    const { error } = await sb.from('vocab_state').upsert({ user_id: user.id, data: S, updated_at: new Date().toISOString() });
    setSync(error ? 'Chưa lưu lên mạng: ' + error.message : 'Đã lưu');
  }, 800);
}
function setSync(t) { sync = t; const el = document.getElementById('sync'); if (el) el.textContent = t; }
async function load() {
  let local = null; try { local = JSON.parse(localStorage.getItem(lkey()) || 'null'); } catch (e) {}
  const { data, error } = await sb.from('vocab_state').select('data').eq('user_id', user.id).maybeSingle();
  if (error) { setSync('Không tải được từ mạng: ' + error.message); S = local || blank(); return; }
  const remote = data && data.data && data.data.v ? data.data : null;
  S = (local && (!remote || local.t > remote.t)) ? local : (remote || blank());
  if (S !== remote) save(); else setSync('Đã lưu');
}

// ---------- màn ----------
function bar(v, need, color) { return `<div class="bar"><i style="width:${Math.min(100, v)}%;background:${color}"></i><b style="left:${need}%"></b></div>`; }
// Cấp hiện tại: Pre-A1 → (qua Thi Pre-A1) A1 → (qua Thi A1 lần 1) A2. Bài của cấp chưa mở thì khoá.
// Tập từ của cổng (người sáng lập 23/10/2026): Pre-A1 = từ Pre-A1; A1 = Pre-A1 + A1 (918 từ); A2 = chỉ từ A2, kèm điều kiện A1 "Đạt bền" (exam.js).
const passed = lv => typeof xPassed === 'function' && xPassed(lv);
const curLevel = () => LEVELS.find(l => !passed(l)) || LEVELS[LEVELS.length - 1];
const levelWords = (lv = curLevel()) => WORDS.filter(w => UBY[w.u].lv === lv);   // 📘 Học: từ của cấp
const cumWords = (lv = curLevel()) => { const i = LEVELS.indexOf(lv); return WORDS.filter(w => LEVELS.indexOf(UBY[w.u].lv) <= i); };   // cấp này + mọi cấp trước (đề thi lấy câu cũ ở đây)
// 🔁 Nhớ (27/10/2026, người sáng lập: "mục tiêu là học xong thi thật được, cứ cân nhắc làm"; đối chiếu đề Cambridge: đề chỉ hỏi một mẫu từ, không bắt nhớ từng từ):
// Pre-A1 → A2+: như cũ, cấp này + mọi cấp trước. Từ B1: cấp này + 1 cấp liền trước đo đủ từng từ; các cấp cũ hơn (đã qua thi) đo trên mẫu MEM_SAMPLE từ, đổi mẫu mỗi tuần.
// Mô phỏng trước khi đổi: B1 dồn đủ 2.213 từ không tới cổng sau 720 ngày × 6 lượt ôn (docs/HOAN-THIEN.md).
const memHash = s => { let h = 2166136261; for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619); return h >>> 0; };
const memWords = (lv = curLevel(), now = Date.now()) => { const i = LEVELS.indexOf(lv); if (i < LEVELS.indexOf(MEM_FULL_FROM)) return cumWords(lv);
  const wk = Math.floor(dayOf(now) / 7), near = WORDS.filter(w => LEVELS.indexOf(UBY[w.u].lv) >= i - 1 && LEVELS.indexOf(UBY[w.u].lv) <= i);
  const old = WORDS.filter(w => LEVELS.indexOf(UBY[w.u].lv) < i - 1).sort((a, b) => memHash(a.id + '|' + wk) - memHash(b.id + '|' + wk)).slice(0, MEM_SAMPLE);
  return [...old, ...near]; };
const gateWords = (lv, now) => memWords(lv, now);
const lockedLv = l => { const i = LEVELS.indexOf(l); return i > 0 && !passed(LEVELS[i - 1]); };
const locked = u => lockedLv(u.lv);
const unitDone = u => u.words.every(w => S.cards[w.id]);
function nextUnit() { return UNITS.find(u => !unitDone(u) && !locked(u)); }
// Lộ trình: mỗi cấp chia chặng theo chủ đề (tools/extract-a1.mjs), bài đánh số trong chặng; chỉ mở chặng đang học.
const uLabel = u => `${LVN[u.lv]} · Chặng ${u.ch + 1} · Bài ${u.bi}`;
const HOME = { open: null, lv: null };   // chặng đang mở, cấp đang xem trên trang chính
function roadmap(now, nu) {
  const lv = HOME.lv || curLevel(), us0 = UNITS.filter(u => u.lv === lv), chs = [...new Set(us0.map(u => u.ch))];
  const cur = nu && nu.lv === lv ? nu.ch : -1, open = HOME.open ?? cur, lock = lockedLv(lv);
  const tabs = `<div class="chips">${LEVELS.map(l => { const n = WORDS.filter(w => UBY[w.u].lv === l).length;
    return `<button class="chip ${lv === l ? 'on' : ''}" data-lv="${l}">${lockedLv(l) ? '🔒 ' : passed(l) ? '✅ ' : ''}${LVN[l]} · ${n} từ</button>`; }).join('')}</div>`;
  return tabs + (lock ? `<p class="mute">🔒 Bài ${LVN[lv]} mở khi qua Thi chuyển cấp ${LVN[LEVELS[LEVELS.indexOf(lv) - 1]]}. Xem trước được, chưa học được.</p>` : '') + chs.map(i => { const us = us0.filter(u => u.ch === i), done = us.filter(unitDone).length;
    const ws = us.flatMap(u => u.words), mem = ws.filter(w => held(S.cards[w.id], now, w)).length, f = us[0];
    return `<div class="ch ${i === cur ? 'cur' : ''}"><button class="chh" data-ch="${i}" aria-expanded="${i === open}">
      <span>${f.chIcon} <b>Chặng ${i + 1}</b> · ${esc(f.chName)}</span><span class="mute">${done === us.length ? '✅' : `${done}/${us.length} bài`}</span></button>
      ${bar(done / us.length * 100, 0, 'var(--accent)')}
      ${i === open ? `<p class="mute" style="margin:4px 0">${ws.length} từ · ${mem} từ nhớ đủ</p>${us.map(u => { const d = unitDone(u), m = d && u.words.filter(w => held(S.cards[w.id], now, w)).length / u.words.length >= 0.8;
        return `<button class="urow ${u === nu ? 'next' : ''}" data-un="${u.id}" ${lock ? 'disabled' : ''}><span>${m ? '🟢' : d ? '🔵' : u === nu ? '▶️' : lock ? '🔒' : '⚪'} Bài ${u.bi} · ${esc(u.vi)}</span><span class="mute">${u.words.length} từ</span></button>`; }).join('')}` : ''}</div>`; }).join(''); }

// 🔁 Nhớ dạng danh sách đủ 12 yêu cầu Pre-A1 → A2 (người sáng lập 26/10/2026): yêu cầu của cấp chưa tới hiện mờ, 🔒, không bấm được.
const VREQ_LV = [['pre', 'Pre-A1'], ['a1', 'A1'], ['a2', 'A2'], ['b1', 'B1'], ['b2', 'B2'], ['c1', 'C1'], ['c2', 'C2']];
// B1 → C2 (người sáng lập 26/10/2026: "cho vô list trước đã"): chỉ hiện trong danh sách, chưa có bài, không tính 🔁 Nhớ / Thi.
// B1, B2 = 6 mặt còn lại của khung 18 mặt (Nation); C1, C2 ngoài khung (độ tự động, nghĩa bóng). Chia theo cấp là đề xuất, không có nguồn chính thức.
function vreqList(p, lv) {
  return `<div class="dlist">${VREQ_LV.map(([L, name]) => { const on = lvIdx(L) <= lvIdx(lv), rs = VREQ.filter(r => r[2] === L);
    return `<div class="dlv ${on ? '' : 'lock'}">${on ? '' : '🔒 '}${L === 'pre' ? name : `${name}: thêm ${rs.length}`}${on ? '' : ` · mở khi lên ${name}`}</div>${rs.map(([k, l]) => on
      ? `<div class="dimc" data-dim="${k}" role="button" tabindex="0"><div class="row"><span>${l}</span><span class="${p.dq[k] >= GATE_MEM ? 'okc' : 'mute'}">${p.dq[k]}%${p.Tk[k] !== p.Tm ? ` <small>· ${p.Tk[k]} từ</small>` : ''}</span></div>${bar(p.dq[k], GATE_MEM, 'var(--good)')}</div>`
      : rqRow(l, vreqDesc(k), '')).join('')}`; }).join('')}</div>`; }
// nội dung yêu cầu đã có bài nhưng cấp chưa mở: lấy từ DIM_INFO (tonghop.js) + ví dụ bằng một từ có dữ liệu
const vreqDesc = k => { const I = DIM_INFO[k], w = shuf(WORDS.filter(VREQ_BY[k][3]))[0]; return I ? `${I.what}${w ? `<br>Ví dụ: ${I.ex(w).filter(Boolean)[0] || ''}` : ''}<br><span class="mute">Học ở: ${esc(I.learn)}.</span>` : ''; };
function home() {
  const now = Date.now(), lv = curLevel(), p = parts(S, now), nu = nextUnit();
  const ph2 = p.lq >= GATE_LEARN;
  $app.onclick = null; window.CUR = { view: 'home' };
  const tip = ph2 ? `Giai đoạn ôn: mỗi ngày 🏋️ Luyện tập tới khi hết từ cần ôn để mọi yêu cầu lên ${GATE_MEM}%; 🗣 Nói ra từ luyện ở 🏋️ Luyện tập.`
    : `Giai đoạn học: mỗi ngày học unit mới, rồi 🏋️ Luyện tập những từ cần ôn. Mỗi yêu cầu tính 🔁 Nhớ khi làm đúng ở một ngày sau ngày học; 🏋️ Luyện tập tự hỏi vào yêu cầu còn thiếu.`;
  $app.innerHTML = `
    ${ovBack}<h1>📚 Từ vựng</h1>
    <p class="mute">Cấp đang học: <b>${LVN[lv]}</b> (${p.T} từ mới${p.Tm > p.T ? `; 🔁 Nhớ và thi tính cả cấp trước: ${p.Tm} từ${lvIdx(lv) >= lvIdx(MEM_FULL_FROM) ? `, gồm ${MEM_SAMPLE} từ mẫu của các cấp cũ, đổi mỗi tuần` : ''}` : ''})</p>
    <p class="mute"><span id="sync">${esc(sync)}</span></p>
    <div class="box">
      <div class="row"><b>📘 Học ${p.lq}%</b><span class="mute">cần ${GATE_LEARN}% · ${p.learn}/${p.T} từ${p.Tu ? ` (gồm ${p.Tu} từ cấp trước cần ⬆️ nâng cấp)` : ''}</span></div>${bar(p.lq, GATE_LEARN, 'var(--accent)')}
      <div class="row" style="margin-top:10px"><b>🔁 Nhớ ${p.mq}%</b><span class="mute">= yêu cầu thấp nhất · mỗi yêu cầu cần ${GATE_MEM}%</span></div>${bar(p.mq, GATE_MEM, 'var(--good)')}
      ${vreqList(p, lv)}
      <p class="mute" style="margin:6px 0 0">${p.full} từ nhớ đủ cả ${dimsAt(lv).length} yêu cầu của ${LVN[lv]} (mỗi yêu cầu chỉ tính trên từ có yêu cầu đó). Bấm vào một yêu cầu để xem bài của nó.</p>
    </div>
    <div class="duo">
      <button class="big2 ${p.due ? '' : 'pri'}" data-a="learn" data-u="${nu ? nu.id : ''}" ${nu ? '' : 'disabled'}>📘 Học<small>${nu ? `${uLabel(nu)} · ${esc(nu.vi)}` : `Đã học hết bài ${LVN[lv]}`}</small></button>
      <button class="big2 ${p.due ? 'pri' : ''}" data-a="practice" ${p.learn ? '' : 'disabled'}>🏋️ Luyện tập<small>${!p.learn ? 'Học 1 unit trước' : p.due ? `${p.due} từ cần ôn` : 'Rèn 🔁 Nhớ'}</small></button>
    </div>
    <p class="mute">${tip}</p>
    ${examBox(p, lv)}
    ${DUR_PREV[lv] && !xDurable(DUR_PREV[lv]) ? examBox(parts(S, now, DUR_PREV[lv]), DUR_PREV[lv]) : ''}
    <h2>Lộ trình</h2>
    <p class="mute">🔵 đã học · 🟢 ≥ 80% từ nhớ đủ yêu cầu · ▶️ bài kế tiếp. Bấm tên chặng để mở; bấm bài để học / xem lại.</p>
    <div id="grid">${roadmap(now, nu)}</div>
    ${voxHtml()}
    `;   // 🗂 góp ý ở màn 🎯 Tổng quan học
  setTimeout(maybeReload, 0);
}

// học unit: xem 10 thẻ, rồi mỗi từ 2 câu (nghĩa + điền chỗ trống); sai thì hỏi lại tới khi đúng hết
// 📘 Bài học (người sáng lập 26/10/2026: bài học dạy đủ mọi yêu cầu mà 🔁 Nhớ sẽ đòi; chấp nhận ~12–17 phút / unit):
// mỗi từ một câu cho mỗi nhóm yêu cầu, đi từ dễ tới khó; một câu có thể dạy nhiều yêu cầu (gõ từ vào câu = chính tả + điền từ + nhớ ra từ).
//   Pre-A1: thấy từ → nghĩa · nghe → nghĩa · nhận đúng chữ (+ nhớ ra từ) · gõ từ (chính tả + nhớ ra từ) · nói ra từ
//   A1:    thay "gõ từ" bằng "gõ từ vào câu" (+ điền từ), thêm cụm hay đi cùng, nhận ra dạng bất quy tắc (từ có dạng riêng)
//   A2:    thêm đồng / trái nghĩa, nghĩa thứ hai (từ có dữ liệu); dạng bất quy tắc thành tự gõ (dạy cả nhận ra)
// Câu trong bài học không tính 🔁 Nhớ (tính từ ngày sau). Bài ⬆️ Nâng cấp: từ cấp trước, chỉ dạy các yêu cầu mới của cấp đang học (tính vào 📘 Học).
// 🔧 Họ từ (B1) / 🛠 Tạo dạng từ (B2): tự tìm họ từ trong kho (happy → happiness, unhappy, happily) bằng tiền tố / hậu tố,
// kiểm loại từ của gốc để tránh nhầm (early ≠ ear + ly vì ear không phải tính từ). Câu 🛠: câu ví dụ của một từ cùng họ, đục chỗ từ đó.
// [hậu tố, loại từ của gốc, loại từ của từ mới]
const FAM_SUF = [['ness', 'adjective', 'noun'], ['ity', 'adjective', 'noun'], ['ly', 'adjective', 'adverb'], ['ment', 'verb', 'noun'], ['ation', 'verb', 'noun'], ['tion', 'verb', 'noun'], ['sion', 'verb', 'noun'],
  ['er', 'verb', 'noun'], ['or', 'verb', 'noun'], ['ive', 'verb', 'adjective'], ['able', 'verb', 'adjective'], ['ible', 'verb', 'adjective'], ['ful', 'noun', 'adjective'], ['less', 'noun', 'adjective'],
  ['ence', 'adjective', 'noun'], ['ance', 'verb', 'noun'], ['en', 'adjective', 'verb'], ['ize', 'adjective', 'verb'], ['ise', 'adjective', 'verb'], ['y', 'noun', 'adjective'], ['al', 'verb', 'noun']];
// [tiền tố, loại từ (cả gốc và từ mới)]
const FAM_PRE = [['un', 'adjective'], ['dis', 'verb'], ['dis', 'adjective'], ['in', 'adjective'], ['im', 'adjective'], ['ir', 'adjective'], ['il', 'adjective'], ['re', 'verb'], ['mis', 'verb']];
// cặp trông như cùng họ nhưng không phải (Claude soát tay 27/10/2026)
const FAM_BAD = new Set('busy|bus live|liver show|shower flow|flower let|letter can|canal come|comment display|play close|disclose count|counter post|poster scar|scary return|turn list|listless should|shoulder dismiss|miss different|indifferent fast|fasten posit|positive cover|discover cover|recover pass|passive hole|holy tide|tidy sex|sexy retreat|treat lay|layer tin|tiny ban|banner grave|gravity dispose|pose revel|revelation draw|drawer charge|discharge play|display turn|return miss|dismiss bus|business'.split(' '));
function buildFam() { const by = {}; for (const w of WORDS) if (/^[a-z]+$/.test(w.w)) by[w.w] = w;
  const isP = (w, p) => new RegExp(`(^|[^a-z])${p}`).test((w.pos || '').toLowerCase());   // "adverb" không tính là "verb"
  const bases = x => { const out = new Set(), X = by[x];
    for (const [suf, p, q] of FAM_SUF) if (x.endsWith(suf) && x.length - suf.length >= 3 && isP(X, q)) { const r = x.slice(0, -suf.length);
      for (const c of [r, r + 'e', r.replace(/i$/, 'y'), r.replace(/(.)\1$/, '$1')]) if (c.length >= 3 && by[c] && by[c] !== X && isP(by[c], p) && !FAM_BAD.has(c + '|' + x) && !FAM_BAD.has(x + '|' + c)) out.add(c); }
    for (const [pre, p] of FAM_PRE) { const c = x.slice(pre.length); if (x.startsWith(pre) && c.length >= 4 && by[c] && isP(X, p) && isP(by[c], p) && !FAM_BAD.has(c + '|' + x) && !FAM_BAD.has(x + '|' + c)) out.add(c); }
    return [...out]; };
  const root = {}; const find = x => { const b = bases(x); if (!b.length) return x; return b[0] === x ? x : find(b[0]); };
  for (const x in by) (root[find(x)] = root[find(x)] || []).push(x);
  for (const [r, xs] of Object.entries(root)) if (xs.length >= 2) for (const x of xs) { const w = by[x]; w.fam = xs.filter(y => y !== x).slice(0, 5);
    const m = shuf(w.fam.map(y => by[y]).filter(y => y.ex && new RegExp(`\\b${y.w}\\b`, 'i').test(y.ex)))[0];
    if (m) w.famQ = { s: m.ex.replace(new RegExp(`\\b${m.w}\\b`, 'i'), '___'), a: m.w }; } }
const LESSON_ORDER = ['w2vi', 'listen', 'form', 'spell', 'clozeT', 'col', 'irrR', 'irrT', 'rel', 's2', 'fam', 'pat', 'colT', 'famQ', 'reg', 'synT', 'style', 'idi', 'fast'];
function lessonTypes(w, reqs) { const r = new Set(reqs.filter(k => VREQ_BY[k] && VREQ_BY[k][3](w))), t = new Set();
  if (r.has('nghia')) t.add('w2vi'); if (r.has('nghe')) t.add('listen'); if (r.has('chu') || r.has('nhora')) t.add('form');
  if (r.has('dung')) t.add('clozeT'); else if (r.has('viet')) t.add('spell');
  if (r.has('cum')) t.add('col'); if (r.has('bqt2')) t.add('irrT'); else if (r.has('bqt')) t.add('irrR');
  if (r.has('lienq') && !r.has('thay')) t.add('rel'); if (r.has('nghia2')) t.add('s2');
  // B1 → C2: yêu cầu nào dạy bằng dạng câu đó; câu sau dạy kèm yêu cầu trước (🛠 tạo dạng dạy cả 🔧 họ từ; 🔄 thay từ dạy cả ↔️; 🎩 văn phong dạy cả 🎚)
  if (r.has('ho') && !r.has('taodang')) t.add('fam'); if (r.has('mau')) t.add('pat'); if (r.has('cumtu')) t.add('colT'); if (r.has('taodang')) t.add('famQ');
  if (r.has('sacthai') && !r.has('vanphong')) t.add('reg'); if (r.has('thay')) t.add('synT'); if (r.has('vanphong')) t.add('style'); if (r.has('thanhngu')) t.add('idi'); if (r.has('tucthi')) t.add('fast');
  return LESSON_ORDER.filter(x => t.has(x)); }
const reqsUpTo = L => VREQ.filter(r => lvIdx(r[2]) <= lvIdx(L)).map(r => r[0]);
const reqsOf = Ls => VREQ.filter(r => Ls.includes(r[2])).map(r => r[0]);
// thẻ từ: phần chung + phần dạy cho yêu cầu mới (dạng bất quy tắc, cặp từ, nghĩa thứ hai) khi bài có yêu cầu đó
function wordCard(w, reqs) { const has = k => reqs.includes(k) && VREQ_BY[k][3](w);
  return `<div class="wcard"><div class="pic">${w.pic || ''}</div><div class="big">${esc(w.w)}</div>
      <div class="mute">${esc(w.ipa || '')} · ${esc(w.pos)}</div><div class="vi">${esc(w.vi)}</div>
      <p class="ex">${esc(w.ex)}<br><span class="mute">${esc(w.exVi)}</span></p>${w.col ? `<p class="mute">🔗 Cụm hay dùng: <b>${esc(w.col.ok)}</b></p>` : ''}
      ${has('bqt') || has('bqt2') ? `<p>${irrLine(w).replace('<br>', '')}</p>` : ''}${has('lienq') ? `<p>${relLine(w).replace('<br>', '')}</p>` : ''}
      ${has('nghia2') ? `<p>🎭 Nghĩa thứ hai: <b>${esc(w.s2.vi)}</b><br><span class="mute">${esc(w.s2.ex)} · ${esc(w.s2.exVi)}</span></p>` : ''}
      ${has('mau') ? `<p>🧱 Mẫu câu: <b>${esc(w.pat.m || w.pat.s.replace('___', w.pat.a))}</b></p>` : ''}${has('ho') || has('taodang') ? `<p>🔧 Họ từ: <b>${esc([w.w, ...w.fam].join(', '))}</b></p>` : ''}
      ${has('sacthai') || has('vanphong') ? `<p>🎚 ${w.reg.f ? `Trang trọng; thân mật hơn: <b>${esc(w.reg.p)}</b>` : `Thân mật; trang trọng hơn: <b>${esc(w.reg.p)}</b>`}</p>` : ''}
      ${has('thay') && !has('lienq') ? `<p>${relLine(w).replace('<br>', '')}</p>` : ''}${has('thanhngu') ? `<p>🌫 Thành ngữ: <b>${esc(w.idi.p)}</b> = ${esc(w.idi.vi)}<br><span class="mute">${esc(w.idi.s)}</span></p>` : ''}${sayBtns(w)}</div>`; }
const TYPE_VI = { w2vi: '📖 thấy từ chọn nghĩa', listen: '🔊 nghe chọn nghĩa', form: '🔤 chọn đúng chữ', spell: '✍️ gõ từ', clozeT: '🧩 gõ từ vào câu', col: '🔗 chọn cụm đúng',
  irrR: '🔀 chọn dạng bất quy tắc', irrT: '✏️ gõ dạng bất quy tắc', rel: '↔️ đồng / trái nghĩa', s2: '🎭 nghĩa thứ hai',
  fam: '🔧 họ từ', pat: '🧱 mẫu câu', colT: '🔗 gõ từ trong cụm', famQ: '🛠 gõ dạng từ', reg: '🎚 trang trọng / thân mật', synT: '🔄 gõ từ cùng nghĩa', style: '🎩 chọn văn phong', idi: '🌫 thành ngữ', fast: '⚡ nhận ra nhanh' };
function lessonRun(u, words, reqs, title, onDone) {
  let i = 0; const items = LESSON_ORDER.flatMap(type => shuf(words.filter(w => lessonTypes(w, reqs).includes(type)).map(w => ({ w, type }))));
  const kinds = LESSON_ORDER.filter(t => items.some(x => x.type === t)), speakStep = reqs.includes('noi') && !!SREC;
  const card = () => { const w = words[i];
    window.CUR = { view: 'the', unit: u.id, item: 'w:' + w.id, prompt: w.w };
    $app.innerHTML = `<div class="row top"><button class="link" data-a="home">← Về</button><span class="uname">${esc(title)}</span></div>
      <div class="dots">${words.map((_, k) => `<i class="${k < i ? 'd' : k === i ? 'c' : ''}"></i>`).join('')}</div>${wordCard(w, reqs)}
      ${i === 0 ? `<p class="mute">🎯 Xem hết thẻ rồi luyện ${items.length}${speakStep ? ` + ${words.length} câu nói` : ''} câu, dạy đủ yêu cầu của 🔁 Nhớ: ${kinds.map(t => TYPE_VI[t]).join(' · ')}${speakStep ? ' · 🗣 nói ra từ' : ''}.</p>` : ''}
      <button class="pri" data-a="next">${i + 1 < words.length ? 'Tiếp →' : `Luyện ${items.length} câu →`}</button>`;
    speak(w.w);
    $app.onclick = e => { const a = e.target.closest('[data-a]')?.dataset.a; if (a === 'next') { if (++i < words.length) card(); else quiz(); } if (a === 'home') home(); }; };
  const quiz = () => run({ title, items, retry: true, done: () => { onDone();
      if (!speakStep) return;
      NO.ses = { mode: 'noi', list: shuf(words), i: 0, got: [], sc: [], show: false, title: '🗣 Bước cuối: nói ra từ', onGrade: () => {},
        sub: 'Nhìn nghĩa, nói từ tiếng Anh. Máy chép ra đúng từ là đạt. Chưa tính 🔁 Nhớ.', foot: 'Bước cuối của bài học (chưa tính). Đóng ✕ thì bỏ qua bước này.', onEnd: () => {} };
      noiOpen(NO.ses.list[0], true); } });
  card(); }
function learn(u) { const again = unitDone(u), reqs = reqsUpTo(u.lv);
  lessonRun(u, u.words, reqs, `${uLabel(u)} · ${u.vi}`, () => { if (!again) { learnCards(S, u, Date.now()); save(); }
    $app.innerHTML = `<div class="box"><b>✅ Xong ${uLabel(u)}: ${esc(u.vi)}</b><p class="mute">${again ? 'Xem lại không đổi lịch ôn.' : `${u.words.length} từ đã vào lịch ôn. Từ mai, 🏋️ Luyện tập mà đúng thì tính vào 🔁 Nhớ.`}</p></div>
      <div class="box"><b>🎯 Bài vừa học đã dạy ${dimsAt(u.lv).length} yêu cầu của 🔁 Nhớ ${LVN[u.lv]}</b><p style="margin:6px 0">${dimsAt(u.lv).map(d => d[1]).join(' · ')}</p>${SREC ? '' : '<p class="mute" style="margin:0">Trình duyệt này không chép được lời nên bước 🗣 đã bỏ qua: mở bằng Safari để luyện nói.</p>'}</div>
      <button class="pri" data-a="home">Về 📚 Từ vựng</button>`;
    $app.onclick = e => { if (e.target.closest('[data-a="home"]')) home(); }; }); }
// ⬆️ Nâng cấp một unit cấp trước lên cấp đang học: chỉ các từ cần, chỉ yêu cầu mới; xong ghi c.du[cấp yêu cầu] = hôm nay
const upUnits = (lv = curLevel()) => UNITS.filter(u => lvIdx(u.lv) < lvIdx(lv) && unitDone(u) && u.words.some(w => upNeed(w, lv).length));
function upgradeUnit(u) { const lv = curLevel(), words = u.words.filter(w => upNeed(w, lv).length), Ls = [...new Set(words.flatMap(w => upNeed(w, lv)))];
  if (!words.length) return home();
  lessonRun(u, words, reqsOf(Ls), `⬆️ Nâng cấp · ${uLabel(u)}`, () => { const d = dayOf(Date.now());
    for (const w of words) { const c = S.cards[w.id]; if (!c) continue; c.du = c.du || {}; for (const L of upNeed(w, lv)) c.du[L] = d; } save();
    $app.innerHTML = `<div class="box"><b>✅ Đã nâng cấp ${uLabel(u)}</b><p class="mute">${words.length} từ đã học thêm: ${reqsOf(Ls).map(k => VREQ_BY[k][1]).join(' · ')}. Từ mai, 🏋️ Luyện tập mà đúng thì tính vào 🔁 Nhớ.</p></div>
      <button class="pri" data-a="home">Về 📚 Từ vựng</button>`;
    $app.onclick = e => { if (e.target.closest('[data-a="home"]')) home(); }; }); }


// 🏋️ Luyện tập (góp ý #3, #5: gộp "Ôn từ đến hạn" + "Luyện thêm" thành một nút), lúc nào cũng được.
// Ưu tiên từ ⚠️ Quên (đến hạn / sai lần gần nhất, sắp quên nhất trước), rồi từ học từ hôm trước mà chưa tính Nhớ (đúng là lên 🔁 Nhớ), rồi từ yếu nhất.
// Có chấm vào lịch ôn (grade), nhưng ôn sớm chỉ tăng ít.
// k = luyện riêng một mặt (bấm mặt ở trang chính, dimView): chỉ hỏi dạng câu của mặt đó, từ thiếu mặt đó trước.
function practice(k) {
  const now = Date.now(), today = dayOf(now), pri = w => { const c = S.cards[w.id], st = wstat(S, w, now);
    if (k) { const td = taughtDay(c, w, k); return (heldDim(c, k, now) ? 4 : td != null && today - td >= MEM_DAYS ? 0 : 2) + recall(c, now); }
    return st === 'quen' ? recall(c, now) : st === 'hoc' && today - c.d0 >= MEM_DAYS ? 1 : st === 'hoc' ? 3 : 2 + recall(c, now); };
  // luyện riêng một yêu cầu: chỉ từ có yêu cầu đó ở cấp đang học và đã được dạy (bài học hoặc ⬆️ Nâng cấp)
  const mem = new Set(memWords(curLevel(), now).map(w => w.id)), list = shuf(WORDS.filter(w => S.cards[w.id] && mem.has(w.id) && (!k || wDims(w).includes(k)))).sort((a, b) => pri(a) - pri(b)).slice(0, ROUND);   // chỉ từ đang tính 🔁 Nhớ
  if (k === 'noi') return noiTask('noi');
  if (!list.length) { toast('Chưa có từ đã học cho yêu cầu này.'); return home(); }
  let ok = 0;
  run({ title: k ? `🏋️ ${DIMS.find(x => x[0] === k)[1]}` : '🏋️ Luyện tập', items: list.map(w => { const type = k ? TYPE_FOR[k]() : typeFor(S.cards[w.id], now, w); return { w, type, teach: (DIM_OF[type] || []).some(d => wDims(w).includes(d) && taughtDay(S.cards[w.id], w, d) == null) }; }), retry: true,
    first: (it, good, type) => { grade(S, it.w.id, good, Date.now(), type); if (good) ok++; save(); },
    done: () => { const p = parts(S, Date.now());
      $app.innerHTML = `<div class="box"><b>Xong lượt luyện tập</b><p>Đúng ngay lần đầu ${ok}/${list.length} từ. 🔁 Nhớ giờ là ${p.mq}% (${dimsAt().map(([k, l]) => `${l} ${p.dq[k]}%`).join(' · ')}).</p></div><button class="pri" data-a="again">🏋️ Luyện tiếp</button><button data-a="home">Về 📘 Học</button>`;
      $app.onclick = e => { if (e.target.closest('[data-a="home"]')) home(); if (e.target.closest('[data-a="again"]')) practice(k); }; } });
}

// Góp ý #3 / #4: 📖 Từ điển: tra theo tiếng Anh hoặc tiếng Việt, lọc theo dấu, bấm từ để xem chi tiết và nghe.
const DICT = { q: '', f: null, lv: null, list: 'cefr', open: null };   // lv: nhóm đang chọn trong danh sách (cấp / chủ đề)
// Góp ý #8 (23/10/2026): bộ lọc gọn bằng ô chọn. "Danh sách" để mở rộng sau (từ thông dụng hằng ngày, từ theo lĩnh vực…): thêm một mục vào DLISTS.
const DLISTS = [
  { id: 'cefr', name: '📊 CEFR (Oxford)', label: 'Cấp', groups: () => [['pre', '🌱 Pre-A1'], ['a1', '🌿 A1'], ['a2', '🌳 A2'], ['a2p', '🌳 A2+'], ['b1', '📗 B1'], ['b1p', '📗 B1+'], ['b2', '📘 B2'], ['b2p', '📘 B2+'], ['c1', '📙 C1'], ['c2', '📕 C2']].map(([k, l]) => ({ k, l, has: x => lvw(x.w) === k })) },
  { id: 'topic', name: '🗂 Theo chủ đề (Pre-A1 → A2+)', label: 'Chủ đề', only: x => !!x.w.u,
    groups: () => [...new Map(UNITS.map(u => [u.chName, u.chIcon]))].map(([k, ic]) => ({ k, l: `${ic} ${k}`, has: x => UBY[x.w.u].chName === k })) },
];
const DICT_MAX = 300;   // vẽ tối đa 300 dòng (kho có hơn 5.000 từ): gõ để tìm hoặc lọc cấp
const lvw = w => w.lv || UBY[w.u].lv;   // lv: lọc theo cấp (người sáng lập 23/10/2026)
function dict() {
  window.CUR = { view: 'tu-dien' };
  $app.innerHTML = `<h1>📖 Từ điển</h1>
    <input id="dq" type="search" placeholder="Tìm từ tiếng Anh hoặc nghĩa tiếng Việt" value="${esc(DICT.q)}" autocomplete="off"><div id="df"></div><div id="dl"></div>`;
  const q = document.getElementById('dq'); q.oninput = () => { DICT.q = q.value; dictList(); };
  document.getElementById('df').onchange = e => { const k = e.target.dataset.sel, v = e.target.value || null; if (!k) return;
    if (k === 'list') { DICT.list = v; DICT.lv = null; } else if (k === 'g') DICT.lv = v; else DICT.f = v; dictList(); };
  $app.onclick = e => { const t = e.target;
    if (t.closest('[data-a="home"]')) return home();
    if (t.closest('[data-say]')) return;
    const r = t.closest('[data-w]'); if (r) { DICT.open = DICT.open === r.dataset.w ? null : r.dataset.w; dictList(); if (DICT.open) speak(WBY[DICT.open].w); } };
  dictList(); if (!REF) loadRef().then(() => { if (document.getElementById('dl')) dictList(); }).catch(() => {});
  setTimeout(maybeReload, 0);
}
function dictList() {
  const now = Date.now(), fold = x => String(x).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd'), q = fold(DICT.q.trim());
  const all = [...WORDS, ...(REF || [])].map(w => ({ w, st: w.u ? wstat(S, w, now) : 'ref' })), hit = q ? all.filter(x => fold(x.w.w).includes(q) || fold(x.w.vi).includes(q)) : all;
  const L = DLISTS.find(l => l.id === DICT.list) || DLISTS[0], G = L.groups(), base = L.only ? hit.filter(L.only) : hit;
  if (DICT.lv && !G.some(g => g.k === DICT.lv)) DICT.lv = null;
  const g = G.find(x => x.k === DICT.lv), inLv = base.filter(x => !g || g.has(x)), learnable = inLv.some(x => x.st !== 'ref');
  const fOK = x => !learnable || !DICT.f || x.st === DICT.f, n = k => inLv.filter(x => !k || x.st === k).length, ng = gr => base.filter(x => fOK(x) && (!gr || gr.has(x))).length;
  const opt = (v, l, on) => `<option value="${esc(v)}"${on ? ' selected' : ''}>${esc(l)}</option>`;
  document.getElementById('df').innerHTML = `<div class="sels">
    <label>Danh sách<select data-sel="list">${DLISTS.map(l => opt(l.id, l.name, l === L)).join('')}</select></label>
    <label>${L.label}<select data-sel="g">${opt('', `Tất cả (${ng(null)})`, !g)}${G.map(x => opt(x.k, `${x.l} (${ng(x)})`, x === g)).join('')}</select></label>
    ${learnable ? `<label>Trạng thái<select data-sel="f">${opt('', `Tất cả (${n(null)})`, !DICT.f)}${WST.map(([k, l]) => opt(k, `${l} (${n(k)})`, DICT.f === k)).join('')}</select></label>` : '<label class="mute">Trạng thái<br>📚 chỉ tra</label>'}</div>
    <details class="mute"><summary>ⓘ Dấu trên mỗi từ</summary>Mỗi từ có 4 dấu mặt: 📖 Nghĩa · 🎧 Nghe · ✍️ Viết · 🧩 Dùng (sáng = đang nhớ). ✅ = đủ cả 4. ⚠️ Quên = lần gần nhất sai hoặc đã tới lúc sắp quên: luyện lại là lên. 📚 chỉ tra = cấp chưa có bài học.</details>`;
  const rows0 = inLv.filter(fOK).sort((a, b) => a.w.w.localeCompare(b.w.w)), rows = rows0.slice(0, DICT_MAX), lab = k => k === 'ref' ? '📚 chỉ tra' : WST.find(x => x[0] === k)[1];
  document.getElementById('dl').innerHTML = rows.length ? rows.map(({ w, st }) => `<div class="drow" data-w="${w.id}"><div class="row"><span><b>${esc(w.w)}</b> <span class="lvtag ${lvw(w)}">${LVN[lvw(w)]}</span> <span class="mute">${esc(w.ipa || '')}</span><br>${esc(w.vi)}</span><span class="mute" style="text-align:right">${lab(st)}${st !== 'chua' && st !== 'ref' ? `<br>${dimMarks(S.cards[w.id], now, w)}` : ''}</span></div>
    ${DICT.open === w.id ? `<div class="box" style="margin:8px 0 0"><div class="mute">${esc(w.pos)} · ${w.u ? uLabel(UBY[w.u]) : `${LVN[w.lv]} · chỉ tra, chưa có bài học`}</div>${w.en ? `<p class="mute">${esc(w.en)}</p>` : ''}
      <p>${esc(w.ex)}<br><span class="mute">${esc(w.exVi)}</span></p>${w.col ? `<p class="mute">Cụm hay dùng: <b>${esc(w.col.ok)}</b></p>` : ''}
      ${sayBtns(w)}</div>` : ''}</div>`).join('') : '<p class="mute">Không có từ nào.</p>';
  if (rows0.length > rows.length) document.getElementById('dl').innerHTML += `<p class="mute">Đang hiện ${rows.length} / ${rows0.length} từ. Gõ để tìm hoặc chọn nhóm.</p>`;
}


// chạy một chuỗi câu hỏi. retry: sai thì đưa câu về cuối. first(it, đúng?) gọi một lần cho mỗi câu ở lần hỏi đầu. quiet: không báo đúng / sai (bài thi).
function run({ title, items, retry, quiet, first, done }) {
  const q = items.map(x => ({ ...x, tries: 0 })), total = items.length;
  let solved = 0;
  const show = () => {
    if (!q.length) return done();
    const it = q[0], Q = question(it.w, it.type);
    window.CUR = { view: title, unit: it.w.u, item: 'w:' + it.w.id + ':' + Q.type, prompt: String(Q.top).replace(/<[^>]*>|&[a-z#0-9]+;/g, '').slice(0, 200) }; window.CUR_Q = Q;   // bộ test e2e đọc đáp án
    $app.innerHTML = `<div class="row top"><button class="link" data-a="home">← Về</button><span class="uname">${esc(title)} · ${solved}/${total}</span></div>
      ${bar(solved / total * 100, 0, 'var(--accent)')}
      <p class="q">${Q.top}</p><p class="mute">${Q.sub}</p>${it.teach ? `<p class="mute">🆕 Yêu cầu mới của ${LVN[curLevel()]} cho từ này: làm thử rồi đọc giải thích sau câu. Hôm nay là ngày học, từ mai làm đúng mới tính 🔁 Nhớ.</p>` : ''}
      ${Q.typed ? `<form id="tf" autocomplete="off"><input id="ti" class="tin" type="text" autocapitalize="off" autocorrect="off" spellcheck="false" enterkeyhint="done" aria-label="Gõ câu trả lời">
        <button class="pri" type="submit">Kiểm tra</button><button type="button" data-a="skip">Không nhớ</button></form>`
        : Q.opts.map((o, k) => `<button class="opt" data-k="${k}">${esc(o)}</button>`).join('')}<div id="fb"></div>`;
    if (Q.say) speak(Q.say);   // dạng nghe: cả bài thi cũng phát
    const ti = document.getElementById('ti'); if (ti) ti.focus();
    let answered = false;
    const t0 = Date.now();
    const answer = (good, b, typed) => {
      if (answered) return; answered = true;
      const slow = Q.timed && good && Date.now() - t0 > Q.timed; if (slow) good = false;   // ⚡ nhận ra tức thì: đúng mà chậm thì chưa tính
      if (it.tries++ === 0 && first) first(it, good, Q.type);
      q.shift();
      if (good || !retry) solved++; else q.push(it);
      if (quiet) return show();
      if (b) $app.querySelectorAll('[data-k]').forEach(x => { if (Q.opts[+x.dataset.k] === Q.a) x.classList.add('ok'); else if (x === b) x.classList.add('no'); });
      if (ti) { ti.disabled = true; ti.classList.add(good ? 'ok' : 'no'); document.getElementById('tf').querySelectorAll('button').forEach(x => x.remove()); }
      const w = it.w;
      document.getElementById('fb').innerHTML = `<div class="box">${slow ? `⏱ Đúng nhưng chậm (${((Date.now() - t0) / 1000).toFixed(1)} giây, cần dưới ${Q.timed / 1000} giây).` : good ? '✅ Đúng.' : `❌ Chưa đúng.${Q.typed ? ` Đáp án: <b>${esc(Q.a)}</b>${typed ? ` (bạn gõ: ${esc(typed)})` : ''}.` : ''}`} <b>${esc(w.w)}</b> = ${esc(w.vi)}<br>${esc(w.ex)}<br><span class="mute">${esc(w.exVi)}</span>${Q.after || ''}${sayBtns(w)}</div><button class="pri" data-a="go">Tiếp →</button>`;
      speak(w.w);
    };
    const tf = document.getElementById('tf');
    if (tf) tf.onsubmit = e => { e.preventDefault(); const v = ti.value; if (!v.trim()) return ti.focus(); answer([Q.a, ...(Q.alt || [])].some(x => normAns(v) === normAns(x)), null, v.trim()); };
    $app.onclick = e => {
      if (e.target.closest('[data-a="home"]')) { if (quiet && !confirm('Bỏ bài thi? Lần này không tính.')) return; return home(); }
      if (e.target.closest('[data-a="go"]')) return show();
      if (e.target.closest('[data-a="skip"]')) return answer(false, null, '');
      const b = e.target.closest('[data-k]'); if (b) answer(Q.opts[+b.dataset.k] === Q.a, b);
    };
  };
  show();
}

// ---------- đăng nhập ----------
function login(msg) {
  $app.innerHTML = `<h1>Từ vựng A1</h1><p class="mute">${WORDS.length} từ A1 · ${UNITS.length} unit. Đăng nhập để lưu tiến độ trên mọi máy.</p>
    <form id="f"><input id="em" type="email" placeholder="Email" autocomplete="email" required>
    <input id="pw" type="password" placeholder="Mật khẩu" autocomplete="current-password" required>
    <button class="pri" type="submit">Đăng nhập</button></form><p class="mute" id="msg">${esc(msg || '')}</p>`;
  document.getElementById('f').onsubmit = async e => {
    e.preventDefault(); document.getElementById('msg').textContent = 'Đang đăng nhập…';
    const { error } = await sb.auth.signInWithPassword({ email: document.getElementById('em').value.trim(), password: document.getElementById('pw').value });
    if (error) document.getElementById('msg').textContent = 'Không đăng nhập được: ' + error.message;
  };
}

async function start(session) {
  user = session ? session.user : null;
  if (!user) { const { error } = await sb.auth.signInWithPassword(AUTO); return error ? login('Không tự đăng nhập được: ' + error.message) : undefined; }   // thành công thì onAuthStateChange gọi lại start
  $app.innerHTML = '<p class="mute">Đang tải tiến độ…</p>';
  await load(); overview(); gyFlush();
}

document.addEventListener('click', e => {
  const t = e.target.closest('[data-a]'); if (!t || !S || !user) return;
  if (!document.getElementById('grid')) return;   // chỉ trang chính; màn học có onclick riêng
  const a = t.dataset.a;
  if (a === 'learn') learn(UBY[t.dataset.u]);
  if (a === 'up') upgradeUnit(UBY[t.dataset.u]);
  if (a === 'exam') exam(t.dataset.lv || curLevel());
  if (a === 'practice') practiceMenu();
  if (a === 'dict') dict();
});
document.addEventListener('click', e => { if (!S || !document.getElementById('grid')) return; const d = e.target.closest('[data-dim]'); if (d) dimView(d.dataset.dim); });
document.addEventListener('click', e => { if (!S) return; const g = e.target.closest('#grid [data-un]'); if (g) return learn(UBY[g.dataset.un]);
  const l = e.target.closest('#grid [data-lv]'); if (l) { HOME.lv = l.dataset.lv; HOME.open = null; document.getElementById('grid').innerHTML = roadmap(Date.now(), nextUnit()); return; }
  const c = e.target.closest('#grid [data-ch]'); if (c) { const nu = nextUnit(), lv = HOME.lv || curLevel(), i = +c.dataset.ch; HOME.open = (HOME.open ?? (nu && nu.lv === lv ? nu.ch : -1)) === i ? -1 : i; document.getElementById('grid').innerHTML = roadmap(Date.now(), nu); } });

// Góp ý #5: hai tab ngang hàng 📘 Học · 📖 Từ điển ở đáy màn; chỉ hiện ở hai màn chính (Học: #grid, Từ điển: #dq), ẩn khi đang làm bài.
const $tabs = document.getElementById('tabs');
// 25/10/2026: thanh dưới 2 mục 🎯 Học · 📖 Từ điển (parts.js overview). 🎯 sáng ở màn tổng quan (#ov) và màn chính của từng phần (#grid, #part).
function syncTabs() { const t = document.getElementById('bk') ? 'bk' : document.getElementById('dq') ? 'dict' : (document.getElementById('ov') || document.getElementById('grid') || document.getElementById('part')) ? 'all' : null;
  document.body.classList.toggle('has-tabs', !!t); $tabs.hidden = !t;
  $tabs.querySelectorAll('[data-tab]').forEach(b => { const on = b.dataset.tab === t; b.classList.toggle('on', on); b.setAttribute('aria-current', on ? 'page' : 'false'); if (on) try { b.scrollIntoView({ inline: 'nearest', block: 'nearest' }); } catch (e) {} }); }
new MutationObserver(syncTabs).observe($app, { childList: true });
$tabs.addEventListener('click', e => { const b = e.target.closest('[data-tab]'); if (!b || !S) return; BACK = null; if (b.dataset.tab === 'dict') dict(); else if (b.dataset.tab === 'bk') backup(); else overview(); scrollTo(0, 0); });

// Tự cập nhật (người sáng lập 23/10/2026: "web tự cập nhật nếu có thay đổi, không phải bấm tải lại"). iPhone giữ trang cũ trong bộ nhớ khi mở lại tab
// và GitHub Pages cho giữ trang ~10 phút, nên hỏi version.json (không qua bộ nhớ đệm) khi mở / quay lại tab và mỗi 5 phút.
// Có bản mới: đang ở trang chính / từ điển thì tải lại ngay (địa chỉ có ?v= mới để khỏi lấy trang cũ); đang học / thi thì chỉ báo, về trang chính mới tải lại.
// Tiến độ không mất: save() ghi máy ngay, lần mở sau load() lấy bản mới hơn rồi đẩy lên mạng.
let NEWV = 0;
async function checkVer() { try { const r = await fetch('version.json?t=' + Date.now(), { cache: 'no-store' }); const v = +(await r.json()).v; if (v > APP_V) { NEWV = v; maybeReload(); } } catch (e) {} }
function maybeReload() {
  if (!NEWV) return;
  const k = 'upd-' + NEWV; let tried = false; try { tried = !!sessionStorage.getItem(k); } catch (e) {}
  if (tried) return;   // đã thử tải lại cho bản này mà vẫn cũ: không lặp vô hạn
  if (!S || document.getElementById('grid') || document.getElementById('dq') || document.getElementById('ov') || document.getElementById('part')) {
    try { sessionStorage.setItem(k, '1'); } catch (e) {}
    location.replace(location.pathname + '?v=' + NEWV + location.hash);
  } else if (typeof toast === 'function') toast('Có bản mới. Trang sẽ tự cập nhật khi bạn về trang chính.');
}
document.addEventListener('visibilitychange', () => { if (!document.hidden) checkVer(); });
window.addEventListener('pageshow', e => { if (e.persisted) checkVer(); });
setInterval(checkVer, 5 * 60 * 1000);
checkVer();

(async () => {
  fetch('a/index.json?v=7').then(r => r.json()).then(k => { CLIPS = new Set(k); }).catch(() => {});
  fetch('n/index.json?v=' + APP_V).then(r => r.json()).then(k => { NCLIPS = new Set(k); }).catch(() => {});
  try { for (const f of ['a1.json?v=12', 'a2.json?v=6', 'b.json?v=1']) { const d = await (await fetch(f)).json(); UNITS.push(...d.units); READS.push(...(d.reads || [])); } }
  catch (e) { $app.innerHTML = '<p>Không tải được dữ liệu từ (a1.json).</p>'; return; }
  for (const u of UNITS) { UBY[u.id] = u; for (const w of u.words) { w.u = u.id; WBY[w.id] = w; WORDS.push(w); } }
  // dữ liệu cho 12 yêu cầu Nhớ (tools/build-vx.mjs): dạng bất quy tắc, đồng / trái nghĩa, nghĩa thứ hai
  try { const vx = await (await fetch('vx.json?v=1')).json(); for (const w of WORDS) { const k = w.w.toLowerCase(); if (vx.irr[k]) w.irr = vx.irr[k]; if (vx.rel[k]) w.rel = vx.rel[k]; if (vx.s2[k]) w.s2 = vx.s2[k]; } } catch (e) {}
  buildFam();
  let last;
  sb.auth.onAuthStateChange((ev, session) => { const id = session ? session.user.id : null; if (id === last) return; last = id; S = null; setTimeout(() => start(session), 0); });
})();
