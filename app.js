// Từ vựng A1 (tools/extract-a1.mjs → a1.json). Hai cấp (người sáng lập 23/10/2026: "2 cấp, 2 cổng"): Pre-A1 (từ Cambridge Starters + số đếm) → A1.
// Mỗi cấp có Thi chuyển cấp riêng; qua Pre-A1 mới mở bài A1. Cổng A1 tính trên TẤT CẢ từ (Pre-A1 + A1).
// Luật mở Thi chuyển cấp như game (GATE_LEARN / GATE_MEM, v176): 📘 Học 100% · 🔁 Nhớ 80%, trên tập từ của cấp.
// 📘 Học = số từ đã học (có thẻ ôn) / tổng từ của cấp.
// 🔁 Nhớ chia 4 mặt (người sáng lập 22/10/2026: "nhớ từ phải chia nhiều mục để đánh giá, không nói nhớ suông"): 📖 Nghĩa · 🎧 Nghe · ✍️ Viết · 🧩 Dùng.
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
const APP_V = 17;   // tăng khi phát hành; nhớ đổi ?v= trong index.html
window.CUR = { view: 'tai' };   // bối cảnh cho 💬 Góp ý (gopy.js): màn, unit, câu đang làm

const sb = window.supabase.createClient(SB_URL, SB_KEY);
const $app = document.getElementById('app');
let UNITS = [], WORDS = [], WBY = {}, UBY = {}, READS = [];
const LVN = { pre: 'Pre-A1', a1: 'A1', a2: 'A2' };
const LEVELS = ['pre', 'a1', 'a2'];
let S = null, user = null, sync = '';

// ---------- lịch ôn (đường quên kiểu FSRS: R = 1 / (1 + t / 9S); R = 0,9 khi t = S) ----------
const dayOf = ms => Math.floor((ms - new Date(ms).getTimezoneOffset() * 60000) / DAY);
const recall = (c, now) => c ? 1 / (1 + Math.max(0, now - c.last) / DAY / (9 * c.S)) : 0;
const isDue = (c, now) => !!c && (now - c.last) / DAY >= c.S;
const held = (c, now) => DIMS.every(([k]) => heldDim(c, k, now));   // từ nhớ đủ cả 4 mặt
function learnCards(st, u, now) {
  st.units[u.id] = { d: dayOf(now) };
  for (const w of u.words) if (!st.cards[w.id]) st.cards[w.id] = { S: 1, last: now, d0: dayOf(now), ok: 1, pv: 0, n: 0, lapse: 0 };
}
// dạng câu → mặt đo
const DIMS = [['nghia', '📖 Nghĩa'], ['nghe', '🎧 Nghe'], ['viet', '✍️ Viết'], ['dung', '🧩 Dùng']];
const DIM_OF = { vi2w: ['nghia'], w2vi: ['nghia'], listen: ['nghe'], spell: ['viet'], cloze: ['dung'], col: ['dung'], clozeT: ['viet', 'dung'],
  read: ['nghia'], hear: ['nghe'], dict: ['nghe', 'viet'] };   // bài tổng hợp (tonghop.js)
const heldDim = (c, k, now) => !!c && !!c.dm && !!c.dm[k] && !!c.dm[k].pv && !!c.dm[k].ok && recall(c, now) >= HOLD_R;
function grade(st, wid, ok, now, type) {
  const c = st.cards[wid]; if (!c) return;
  const t = (now - c.last) / DAY;
  // ôn sớm (t < S) chỉ tăng theo phần thời gian đã trôi: luyện dồn nhiều lần trong một ngày không đẩy lịch ôn đi xa
  if (ok) { const full = Math.max(c.S, t) * 2.5; c.S = t >= c.S ? full : c.S + (full - c.S) * t / c.S; if (dayOf(now) - c.d0 >= MEM_DAYS) c.pv = 1; }
  else { c.S = 0.5; c.lapse++; }
  c.ok = ok ? 1 : 0; c.last = now; c.n++;
  c.dm = c.dm || {};
  for (const k of DIM_OF[type] || []) { const d = c.dm[k] = c.dm[k] || {}; d.ok = ok ? 1 : 0; d.n = (d.n || 0) + 1; if (ok && dayOf(now) - c.d0 >= MEM_DAYS) d.pv = 1; }
}
function parts(st, now, WS = gateWords()) {
  let learn = 0, full = 0, due = 0; const dim = Object.fromEntries(DIMS.map(([k]) => [k, 0]));
  for (const w of WS) { const c = st.cards[w.id]; if (c) learn++; if (isDue(c, now)) due++;
    let all = !!c; for (const [k] of DIMS) { if (heldDim(c, k, now)) dim[k]++; else all = false; } if (all) full++; }
  const T = WS.length || 1, mem = Math.min(...Object.values(dim)), dq = Object.fromEntries(DIMS.map(([k]) => [k, Math.floor(dim[k] / T * 100)]));
  return { learn, mem, full, due, T, dim, dq, lq: Math.floor(learn / T * 100), mq: Math.floor(mem / T * 100) };
}
const gateOpen = p => p.lq >= GATE_LEARN && p.mq >= GATE_MEM;
// Góp ý #3 / #4: dấu của từng từ. chua = chưa học · hoc = đã học, chưa đủ bằng chứng nhớ · nho = tính vào 🔁 Nhớ · quen = lần gần nhất sai hoặc đã tới lúc sắp quên.
// hoc + nho + quen = 📘 Học; nho = 🔁 Nhớ.
// nho = đủ 4 mặt
function wstat(st, w, now) { const c = st.cards[w.id]; if (!c) return 'chua'; if (held(c, now)) return 'nho'; if (!c.ok || recall(c, now) < HOLD_R) return 'quen'; return 'hoc'; }
const WST = [['chua', '⚪ Chưa học'], ['hoc', '📘 Đã học'], ['nho', '✅ Nhớ đủ 4 mặt'], ['quen', '⚠️ Quên']];
const dimMarks = (c, now) => DIMS.map(([k, l]) => `<span class="dm ${heldDim(c, k, now) ? 'on' : ''}" title="${l}">${l.split(' ')[0]}</span>`).join('');
// mặt nào còn thiếu thì hỏi mặt đó (ngẫu nhiên trong các mặt thiếu); đủ cả thì trộn như thường
const TYPE_FOR = { nghia: () => one(['vi2w', 'w2vi']), nghe: () => 'listen', viet: () => 'spell', dung: () => one(['cloze', 'col', 'clozeT']) };
function typeFor(c, now) { const miss = DIMS.map(([k]) => k).filter(k => !heldDim(c, k, now)); return miss.length ? TYPE_FOR[one(miss)]() : rndType(); }

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
  if (type === 'col' && !w.col) type = 'cloze';
  if (type === 'vi2w') return { type, top: `${w.pic || ''} ${esc(w.vi)}`, sub: 'Từ tiếng Anh nào có nghĩa này?', a: w.w, opts: shuf([w.w, ...pick(w, 'w', 3)]) };
  if (type === 'w2vi') return { type, top: esc(w.w), sub: `${esc(w.ipa || '')} · nghĩa là gì?`, a: w.vi, opts: shuf([w.vi, ...pick(w, 'vi', 3)]), say: w.w };
  if (type === 'col') return { type, top: 'Cụm từ nào đúng?', sub: `${esc(w.w)}: ${esc(w.vi)}`, a: w.col.ok, opts: shuf([w.col.ok, ...w.col.bad]) };
  if (type === 'listen') return { type, top: '🎧 Nghe rồi chọn nghĩa', sub: `<button class="chip" data-say="${w.id}">🔊 Nghe lại</button>`, a: w.vi, opts: shuf([w.vi, ...pick(w, 'vi', 3)]), say: w.w };
  // gõ từ (tự nhớ ra để viết): gợi ý chữ đầu + số chữ
  const hint = a => `Gợi ý: ${esc(a[0])}${a.slice(1).replace(/[^ ]/g, ' _')} (${a.replace(/ /g, '').length} chữ cái)`;
  if (type === 'spell') return { type, top: `${w.pic || ''} ${esc(w.vi)}`, sub: `Gõ từ tiếng Anh. ${hint(w.w)}`, a: w.w, typed: true };
  if (type === 'clozeT') return { type, top: esc(w.cloze.s), sub: `Gõ từ còn thiếu (nghĩa: ${esc(w.vi)}). ${hint(w.cloze.a)}`, a: w.cloze.a, typed: true };
  return { type: 'cloze', top: esc(w.cloze.s), sub: 'Chọn từ điền vào chỗ trống.', a: w.cloze.a, opts: shuf([w.cloze.a, ...w.cloze.w]) };
}
// Góp ý #7 (người sáng lập 22/10/2026: áp vào cả 🔁 Nhớ và Thi chuyển cấp): trắc nghiệm chỉ đo NHẬN RA từ; thêm TỰ NHỚ RA để viết (gõ từ) và NGHE HIỂU.
// Mỗi lượt: khoảng 40% gõ từ (spell / clozeT), 20% nghe, 40% trắc nghiệm.
const MC = ['vi2w', 'w2vi', 'cloze', 'col'], TYPED = ['spell', 'clozeT'];
const one = a => a[Math.floor(Math.random() * a.length)];
const rndType = () => { const r = Math.random(); return r < 0.4 ? one(TYPED) : r < 0.6 ? 'listen' : one(MC); };
const mixTypes = n => shuf(Array.from({ length: n }, (_, i) => i < Math.round(n * 0.4) ? one(TYPED) : i < Math.round(n * 0.6) ? 'listen' : one(MC)));
const normAns = x => String(x).toLowerCase().replace(/[‘’`]/g, "'").replace(/\s+/g, ' ').trim().replace(/[.,!?;:]+$/g, '').trim();

// Góp ý #2 (iPhone đọc sai): phát tệp thu sẵn của game (a/<khoá>.mp3, tools/copy-clips.mjs); không có tệp mới dùng giọng máy, chọn hẳn giọng tiếng Anh
// (iPhone chỉ đặt lang thì có khi đọc bằng giọng tiếng Việt).
const clipNorm = t => String(t).replace(/[‘’]/g, "'").replace(/[“”]/g, '"').replace(/\s+/g, ' ').trim().replace(/[.,;:]+$/, '').toLowerCase();
const clipKey = t => { let h = 0x811c9dc5; const x = clipNorm(t); for (let i = 0; i < x.length; i++) { h ^= x.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; } return 'a' + h.toString(16).padStart(8, '0'); };
let CLIPS = new Set(), AUD = null, sayTok = 0;
function enVoice() { try { const vs = speechSynthesis.getVoices().filter(v => /^en[-_]/i.test(v.lang)); const rank = v => (/en[-_](US|GB)/i.test(v.lang) ? 10 : 0) + (v.localService ? 3 : 0) + (/natural|neural|premium|enhanced|samantha|daniel/i.test(v.name) ? 5 : 0); return vs.sort((a, b) => rank(b) - rank(a))[0] || null; } catch (e) { return null; } }
function tts(t) { return new Promise(res => { try { const u = new SpeechSynthesisUtterance(t), v = enVoice(); u.lang = v ? v.lang : 'en-US'; if (v) u.voice = v; u.rate = 0.9; u.onend = u.onerror = () => res(); speechSynthesis.speak(u); } catch (e) { res(); } }); }
function sayOne(t) { const k = clipKey(t); if (!CLIPS.has(k)) return tts(t);
  return new Promise(res => { AUD = AUD || new Audio(); let done = false; const end = () => { if (!done) { done = true; res(); } };
    AUD.onended = end; AUD.onerror = () => { if (!done) { done = true; tts(t).then(res); } }; AUD.src = 'a/' + k + '.mp3'; const pr = AUD.play(); if (pr) pr.catch(() => { if (!done) { done = true; tts(t).then(res); } }); }); }
async function speak(...ts) { const my = ++sayTok; try { AUD && AUD.pause(); } catch (e) {} try { speechSynthesis.cancel(); } catch (e) {}
  for (const t of ts) { if (my !== sayTok) return; await sayOne(t); } }
try { speechSynthesis.getVoices(); } catch (e) {}
// Góp ý #6: một kiểu nút nghe cho mọi màn (thẻ từ, phản hồi, từ điển): 🔊 Từ · 🔊 Câu ví dụ; vào thẻ / mở từ thì tự đọc từ.
const sayBtns = w => `<div class="chips say"><button class="chip" data-say="${w.id}">🔊 Từ</button><button class="chip" data-say="${w.id}" data-ex="1">🔊 Câu ví dụ</button></div>`;
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
const curLevel = () => !passed('pre') ? 'pre' : !passed('a1') ? 'a1' : 'a2';
const gateWords = (lv = curLevel()) => WORDS.filter(w => lv === 'a1' ? UBY[w.u].lv !== 'a2' : UBY[w.u].lv === lv);
const lockedLv = l => (l === 'a1' && !passed('pre')) || (l === 'a2' && !passed('a1'));
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
    const ws = us.flatMap(u => u.words), mem = ws.filter(w => held(S.cards[w.id], now)).length, f = us[0];
    return `<div class="ch ${i === cur ? 'cur' : ''}"><button class="chh" data-ch="${i}" aria-expanded="${i === open}">
      <span>${f.chIcon} <b>Chặng ${i + 1}</b> · ${esc(f.chName)}</span><span class="mute">${done === us.length ? '✅' : `${done}/${us.length} bài`}</span></button>
      ${bar(done / us.length * 100, 0, 'var(--accent)')}
      ${i === open ? `<p class="mute" style="margin:4px 0">${ws.length} từ · ${mem} từ nhớ đủ 4 mặt</p>${us.map(u => { const d = unitDone(u), m = d && u.words.filter(w => held(S.cards[w.id], now)).length / u.words.length >= 0.8;
        return `<button class="urow ${u === nu ? 'next' : ''}" data-un="${u.id}" ${lock ? 'disabled' : ''}><span>${m ? '🟢' : d ? '🔵' : u === nu ? '▶️' : lock ? '🔒' : '⚪'} Bài ${u.bi} · ${esc(u.vi)}</span><span class="mute">${u.words.length} từ</span></button>`; }).join('')}` : ''}</div>`; }).join(''); }

function home() {
  const now = Date.now(), lv = curLevel(), p = parts(S, now), nu = nextUnit();
  const ph2 = p.lq >= GATE_LEARN;
  $app.onclick = null; window.CUR = { view: 'home' };
  const tip = ph2 ? `Giai đoạn ôn: mỗi ngày 🏋️ Luyện tập tới khi hết từ cần ôn để cả 4 mặt lên ${GATE_MEM}%.`
    : `Giai đoạn học: mỗi ngày học unit mới, rồi 🏋️ Luyện tập những từ cần ôn. Mỗi mặt của từ tính 🔁 Nhớ khi trả lời đúng mặt đó ở một ngày sau ngày học; 🏋️ Luyện tập tự hỏi vào mặt còn thiếu.`;
  $app.innerHTML = `
    <h1>Từ vựng tiếng Anh</h1>
    <p class="mute">Cấp đang học: <b>${LVN[lv]}</b> (${p.T} từ${lv === 'a1' ? ', tính cả Pre-A1' : ''})</p>
    <p class="mute"><span id="sync">${esc(sync)}</span></p>
    <div class="box">
      <div class="row"><b>📘 Học ${p.lq}%</b><span class="mute">cần ${GATE_LEARN}% · ${p.learn}/${p.T} từ</span></div>${bar(p.lq, GATE_LEARN, 'var(--accent)')}
      <div class="row" style="margin-top:10px"><b>🔁 Nhớ ${p.mq}%</b><span class="mute">= mặt thấp nhất · mỗi mặt cần ${GATE_MEM}%</span></div>${bar(p.mq, GATE_MEM, 'var(--good)')}
      <div class="dims">${DIMS.map(([k, l]) => `<div><div class="row"><span>${l}</span><span class="${p.dq[k] >= GATE_MEM ? 'okc' : 'mute'}">${p.dq[k]}%</span></div>${bar(p.dq[k], GATE_MEM, 'var(--good)')}</div>`).join('')}</div>
      <p class="mute" style="margin:6px 0 0">${p.full} từ nhớ đủ cả 4 mặt.</p>
    </div>
    <div class="duo">
      <button class="big2 ${p.due ? '' : 'pri'}" data-a="learn" data-u="${nu ? nu.id : ''}" ${nu ? '' : 'disabled'}>📘 Học<small>${nu ? `${uLabel(nu)} · ${esc(nu.vi)}` : `Đã học hết bài ${LVN[lv]}`}</small></button>
      <button class="big2 ${p.due ? 'pri' : ''}" data-a="practice" ${p.learn ? '' : 'disabled'}>🏋️ Luyện tập<small>${!p.learn ? 'Học 1 unit trước' : p.due ? `${p.due} từ cần ôn` : 'Rèn 🔁 Nhớ'}</small></button>
    </div>
    <p class="mute">${tip}</p>
    ${examBox(p, lv)}
    ${lv === 'a2' && !xDurable() ? examBox(parts(S, now, gateWords('a1')), 'a1') : ''}
    <h2>Lộ trình</h2>
    <p class="mute">🔵 đã học · 🟢 ≥ 80% từ nhớ đủ 4 mặt · ▶️ bài kế tiếp. Bấm tên chặng để mở; bấm bài để học / xem lại.</p>
    <div id="grid">${roadmap(now, nu)}</div>
    ${gyHomeHtml()}`;
}

// học unit: xem 10 thẻ, rồi mỗi từ 2 câu (nghĩa + điền chỗ trống); sai thì hỏi lại tới khi đúng hết
function learn(u) {
  const again = unitDone(u);
  let i = 0;
  const card = () => {
    const w = u.words[i];
    window.CUR = { view: 'the', unit: u.id, item: 'w:' + w.id, prompt: w.w };
    $app.innerHTML = `<div class="row top"><button class="link" data-a="home">← Về</button><span class="uname">${uLabel(u)} · ${esc(u.vi)}</span></div>
      <div class="dots">${u.words.map((_, k) => `<i class="${k < i ? 'd' : k === i ? 'c' : ''}"></i>`).join('')}</div>
      <div class="wcard"><div class="pic">${w.pic || ''}</div><div class="big">${esc(w.w)}</div>
      <div class="mute">${esc(w.ipa || '')} · ${esc(w.pos)}</div><div class="vi">${esc(w.vi)}</div>
      <p class="ex">${esc(w.ex)}<br><span class="mute">${esc(w.exVi)}</span></p>${w.col ? `<p class="mute">Cụm hay dùng: <b>${esc(w.col.ok)}</b></p>` : ''}${sayBtns(w)}</div>
      <button class="pri" data-a="next">${i + 1 < u.words.length ? 'Tiếp →' : 'Luyện tập 10 từ →'}</button>`;
    speak(w.w);
    $app.onclick = e => { const a = e.target.closest('[data-a]')?.dataset.a; if (a === 'next') { if (++i < u.words.length) card(); else quiz(); } if (a === 'home') home(); };
  };
  const quiz = () => run({
    title: `${uLabel(u)}`, items: [...shuf(u.words.map(w => ({ w, type: one(['vi2w', 'listen']) }))), ...shuf(u.words.map(w => ({ w, type: one(TYPED) })))], retry: true,
    done: () => { if (!again) { learnCards(S, u, Date.now()); save(); }
      $app.innerHTML = `<div class="box"><b>✅ Xong ${uLabel(u)}: ${esc(u.vi)}</b><p class="mute">${again ? 'Xem lại không đổi lịch ôn.' : `${u.words.length} từ đã vào lịch ôn. Từ mai, 🏋️ Luyện tập mà đúng thì tính vào 🔁 Nhớ.`}</p></div><button class="pri" data-a="home">Về trang chính</button>`;
      $app.onclick = e => { if (e.target.closest('[data-a="home"]')) home(); }; },
  });
  card();
}


// 🏋️ Luyện tập (góp ý #3, #5: gộp "Ôn từ đến hạn" + "Luyện thêm" thành một nút), lúc nào cũng được.
// Ưu tiên từ ⚠️ Quên (đến hạn / sai lần gần nhất, sắp quên nhất trước), rồi từ học từ hôm trước mà chưa tính Nhớ (đúng là lên 🔁 Nhớ), rồi từ yếu nhất.
// Có chấm vào lịch ôn (grade), nhưng ôn sớm chỉ tăng ít.
function practice() {
  const now = Date.now(), today = dayOf(now), pri = w => { const c = S.cards[w.id], st = wstat(S, w, now);
    return st === 'quen' ? recall(c, now) : st === 'hoc' && today - c.d0 >= MEM_DAYS ? 1 : st === 'hoc' ? 3 : 2 + recall(c, now); };
  const list = shuf(WORDS.filter(w => S.cards[w.id])).sort((a, b) => pri(a) - pri(b)).slice(0, ROUND);
  let ok = 0;
  run({ title: '🏋️ Luyện tập', items: list.map(w => ({ w, type: typeFor(S.cards[w.id], now) })), retry: true,
    first: (it, good, type) => { grade(S, it.w.id, good, Date.now(), type); if (good) ok++; save(); },
    done: () => { const p = parts(S, Date.now());
      $app.innerHTML = `<div class="box"><b>Xong lượt luyện tập</b><p>Đúng ngay lần đầu ${ok}/${list.length} từ. 🔁 Nhớ giờ là ${p.mq}% (${DIMS.map(([k, l]) => `${l} ${p.dq[k]}%`).join(' · ')}).</p></div><button class="pri" data-a="again">🏋️ Luyện tiếp</button><button data-a="home">Về 📘 Học</button>`;
      $app.onclick = e => { if (e.target.closest('[data-a="home"]')) home(); if (e.target.closest('[data-a="again"]')) practice(); }; } });
}

// Góp ý #3 / #4: 📖 Từ điển: tra theo tiếng Anh hoặc tiếng Việt, lọc theo dấu, bấm từ để xem chi tiết và nghe.
const DICT = { q: '', f: null, lv: null, open: null };   // lv: lọc theo cấp (người sáng lập 23/10/2026)
function dict() {
  window.CUR = { view: 'tu-dien' };
  $app.innerHTML = `<h1>📖 Từ điển A1</h1>
    <input id="dq" type="search" placeholder="Tìm từ tiếng Anh hoặc nghĩa tiếng Việt" value="${esc(DICT.q)}" autocomplete="off"><div id="df"></div><div id="dl"></div>`;
  const q = document.getElementById('dq'); q.oninput = () => { DICT.q = q.value; dictList(); };
  $app.onclick = e => { const t = e.target;
    if (t.closest('[data-a="home"]')) return home();
    const f = t.closest('[data-f]'); if (f) { DICT.f = f.dataset.f || null; return dictList(); }
    const lvb = t.closest('[data-dl]'); if (lvb) { DICT.lv = lvb.dataset.dl || null; return dictList(); }
    if (t.closest('[data-say]')) return;
    const r = t.closest('[data-w]'); if (r) { DICT.open = DICT.open === r.dataset.w ? null : r.dataset.w; dictList(); if (DICT.open) speak(WBY[DICT.open].w); } };
  dictList();
}
function dictList() {
  const now = Date.now(), fold = x => String(x).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd'), q = fold(DICT.q.trim());
  const all = WORDS.map(w => ({ w, st: wstat(S, w, now) })), hit = q ? all.filter(x => fold(x.w.w).includes(q) || fold(x.w.vi).includes(q)) : all;
  const lvOf = x => UBY[x.w.u].lv, inLv = hit.filter(x => !DICT.lv || lvOf(x) === DICT.lv);
  const n = k => inLv.filter(x => !k || x.st === k).length, nl = l => hit.filter(x => (!DICT.f || x.st === DICT.f) && (!l || lvOf(x) === l)).length;
  document.getElementById('df').innerHTML = `<div class="chips" aria-label="Cấp">${[[null, 'Mọi cấp'], ['pre', '🌱 Pre-A1'], ['a1', '🌿 A1'], ['a2', '🌳 A2']].map(([k, l]) => `<button class="chip ${DICT.lv === k ? 'on' : ''}" data-dl="${k || ''}" aria-pressed="${DICT.lv === k}">${l} <b>${nl(k)}</b></button>`).join('')}</div>
    <div class="chips" aria-label="Trạng thái">${[[null, 'Tất cả'], ...WST].map(([k, l]) => `<button class="chip ${DICT.f === k ? 'on' : ''}" data-f="${k || ''}" aria-pressed="${DICT.f === k}">${l} <b>${n(k)}</b></button>`).join('')}</div>
    <p class="mute">Mỗi từ có 4 dấu mặt: 📖 Nghĩa · 🎧 Nghe · ✍️ Viết · 🧩 Dùng (sáng = đang nhớ). ✅ = đủ cả 4. ⚠️ Quên = lần gần nhất sai hoặc đã tới lúc sắp quên: luyện lại là lên.</p>`;
  const rows = inLv.filter(x => !DICT.f || x.st === DICT.f).sort((a, b) => a.w.w.localeCompare(b.w.w)), lab = k => WST.find(x => x[0] === k)[1];
  document.getElementById('dl').innerHTML = rows.length ? rows.map(({ w, st }) => `<div class="drow" data-w="${w.id}"><div class="row"><span><b>${esc(w.w)}</b> <span class="lvtag ${UBY[w.u].lv}">${LVN[UBY[w.u].lv]}</span> <span class="mute">${esc(w.ipa || '')}</span><br>${esc(w.vi)}</span><span class="mute" style="text-align:right">${lab(st)}${st !== 'chua' ? `<br>${dimMarks(S.cards[w.id], now)}` : ''}</span></div>
    ${DICT.open === w.id ? `<div class="box" style="margin:8px 0 0"><div class="mute">${esc(w.pos)} · ${uLabel(UBY[w.u])}</div>${w.en ? `<p class="mute">${esc(w.en)}</p>` : ''}
      <p>${esc(w.ex)}<br><span class="mute">${esc(w.exVi)}</span></p>${w.col ? `<p class="mute">Cụm hay dùng: <b>${esc(w.col.ok)}</b></p>` : ''}
      ${sayBtns(w)}</div>` : ''}</div>`).join('') : '<p class="mute">Không có từ nào.</p>';
}


// chạy một chuỗi câu hỏi. retry: sai thì đưa câu về cuối. first(it, đúng?) gọi một lần cho mỗi câu ở lần hỏi đầu. quiet: không báo đúng / sai (bài thi).
function run({ title, items, retry, quiet, first, done }) {
  const q = items.map(x => ({ ...x, tries: 0 })), total = items.length;
  let solved = 0;
  const show = () => {
    if (!q.length) return done();
    const it = q[0], Q = question(it.w, it.type);
    window.CUR = { view: title, unit: it.w.u, item: 'w:' + it.w.id + ':' + Q.type, prompt: String(Q.top).replace(/<[^>]*>|&[a-z#0-9]+;/g, '').slice(0, 200) };
    $app.innerHTML = `<div class="row top"><button class="link" data-a="home">← Về</button><span class="uname">${esc(title)} · ${solved}/${total}</span></div>
      ${bar(solved / total * 100, 0, 'var(--accent)')}
      <p class="q">${Q.top}</p><p class="mute">${Q.sub}</p>
      ${Q.typed ? `<form id="tf" autocomplete="off"><input id="ti" class="tin" type="text" autocapitalize="off" autocorrect="off" spellcheck="false" enterkeyhint="done" aria-label="Gõ câu trả lời">
        <button class="pri" type="submit">Kiểm tra</button><button type="button" data-a="skip">Không nhớ</button></form>`
        : Q.opts.map((o, k) => `<button class="opt" data-k="${k}">${esc(o)}</button>`).join('')}<div id="fb"></div>`;
    if (Q.say) speak(Q.say);   // dạng nghe: cả bài thi cũng phát
    const ti = document.getElementById('ti'); if (ti) ti.focus();
    let answered = false;
    const answer = (good, b, typed) => {
      if (answered) return; answered = true;
      if (it.tries++ === 0 && first) first(it, good, Q.type);
      q.shift();
      if (good || !retry) solved++; else q.push(it);
      if (quiet) return show();
      if (b) $app.querySelectorAll('[data-k]').forEach(x => { if (Q.opts[+x.dataset.k] === Q.a) x.classList.add('ok'); else if (x === b) x.classList.add('no'); });
      if (ti) { ti.disabled = true; ti.classList.add(good ? 'ok' : 'no'); document.getElementById('tf').querySelectorAll('button').forEach(x => x.remove()); }
      const w = it.w;
      document.getElementById('fb').innerHTML = `<div class="box">${good ? '✅ Đúng.' : `❌ Chưa đúng.${Q.typed ? ` Đáp án: <b>${esc(Q.a)}</b>${typed ? ` (bạn gõ: ${esc(typed)})` : ''}.` : ''}`} <b>${esc(w.w)}</b> = ${esc(w.vi)}<br>${esc(w.ex)}<br><span class="mute">${esc(w.exVi)}</span>${sayBtns(w)}</div><button class="pri" data-a="go">Tiếp →</button>`;
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
  await load(); home(); gyFlush();
}

document.addEventListener('click', e => {
  const t = e.target.closest('[data-a]'); if (!t || !S || !user) return;
  if (!document.getElementById('grid')) return;   // chỉ trang chính; màn học có onclick riêng
  const a = t.dataset.a;
  if (a === 'learn') learn(UBY[t.dataset.u]);
  if (a === 'exam') exam(t.dataset.lv || curLevel());
  if (a === 'practice') practiceMenu();
  if (a === 'dict') dict();
});
document.addEventListener('click', e => { if (!S) return; const g = e.target.closest('#grid [data-un]'); if (g) return learn(UBY[g.dataset.un]);
  const l = e.target.closest('#grid [data-lv]'); if (l) { HOME.lv = l.dataset.lv; HOME.open = null; document.getElementById('grid').innerHTML = roadmap(Date.now(), nextUnit()); return; }
  const c = e.target.closest('#grid [data-ch]'); if (c) { const nu = nextUnit(), lv = HOME.lv || curLevel(), i = +c.dataset.ch; HOME.open = (HOME.open ?? (nu && nu.lv === lv ? nu.ch : -1)) === i ? -1 : i; document.getElementById('grid').innerHTML = roadmap(Date.now(), nu); } });

// Góp ý #5: hai tab ngang hàng 📘 Học · 📖 Từ điển ở đáy màn; chỉ hiện ở hai màn chính (Học: #grid, Từ điển: #dq), ẩn khi đang làm bài.
const $tabs = document.getElementById('tabs');
function syncTabs() { const t = document.getElementById('grid') ? 'hoc' : document.getElementById('dq') ? 'dict' : null;
  document.body.classList.toggle('has-tabs', !!t); $tabs.hidden = !t;
  $tabs.querySelectorAll('[data-tab]').forEach(b => { const on = b.dataset.tab === t; b.classList.toggle('on', on); b.setAttribute('aria-current', on ? 'page' : 'false'); }); }
new MutationObserver(syncTabs).observe($app, { childList: true });
$tabs.addEventListener('click', e => { const b = e.target.closest('[data-tab]'); if (!b || !S) return; if (b.dataset.tab === 'dict') dict(); else home(); scrollTo(0, 0); });

(async () => {
  fetch('a/index.json?v=4').then(r => r.json()).then(k => { CLIPS = new Set(k); }).catch(() => {});
  try { for (const f of ['a1.json?v=5', 'a2.json?v=1']) { const d = await (await fetch(f)).json(); UNITS.push(...d.units); READS.push(...(d.reads || [])); } }
  catch (e) { $app.innerHTML = '<p>Không tải được dữ liệu từ (a1.json).</p>'; return; }
  for (const u of UNITS) { UBY[u.id] = u; for (const w of u.words) { w.u = u.id; WBY[w.id] = w; WORDS.push(w); } }
  let last;
  sb.auth.onAuthStateChange((ev, session) => { const id = session ? session.user.id : null; if (id === last) return; last = id; S = null; setTimeout(() => start(session), 0); });
})();
