// Từ vựng A1: 87 unit / 870 từ lấy từ game (tools/extract-a1.mjs).
// Luật mở Thi chuyển cấp như game (GATE_LEARN / GATE_MEM, v176): 📘 Học 100% · 🔁 Nhớ 80%.
// 📘 Học = số từ thuộc unit đã học xong / tổng từ.
// 🔁 Nhớ = số từ có lần đúng cách ngày học xong unit ≥ MEM_DAYS ngày, lần trả lời gần nhất đúng, và khả năng nhớ hiện ≥ 0,9.
const SB_URL = 'https://eojrfoormaqboxwvdqhr.supabase.co';
const SB_KEY = 'sb_publishable_WGUA_5AyhR8a_yQfty8JBA_EaJdkZA7';   // khoá công khai; quyền do RLS bảng vocab_state
const GATE_LEARN = 100, GATE_MEM = 80, MEM_DAYS = 3, HOLD_R = 0.9;
const ROUND = 20, EXAM_N = 40, EXAM_PASS = 0.8;
const DAY = 864e5;

const sb = window.supabase.createClient(SB_URL, SB_KEY);
const $app = document.getElementById('app');
let UNITS = [], WORDS = [], WBY = {}, UBY = {};
let S = null, user = null, sync = '';

// ---------- lịch ôn (đường quên kiểu FSRS: R = 1 / (1 + t / 9S); R = 0,9 khi t = S) ----------
const dayOf = ms => Math.floor((ms - new Date(ms).getTimezoneOffset() * 60000) / DAY);
const recall = (c, now) => c ? 1 / (1 + Math.max(0, now - c.last) / DAY / (9 * c.S)) : 0;
const isDue = (c, now) => !!c && (now - c.last) / DAY >= c.S;
const held = (c, now) => !!c && !!c.pv && !!c.ok && recall(c, now) >= HOLD_R;
function learnCards(st, u, now) {
  st.units[u.id] = { d: dayOf(now) };
  for (const w of u.words) if (!st.cards[w.id]) st.cards[w.id] = { S: 1, last: now, d0: dayOf(now), ok: 1, pv: 0, n: 0, lapse: 0 };
}
function grade(st, wid, ok, now) {
  const c = st.cards[wid]; if (!c) return;
  const t = (now - c.last) / DAY;
  if (ok) { c.S = Math.max(c.S, t) * 2.5; if (dayOf(now) - c.d0 >= MEM_DAYS) c.pv = 1; }
  else { c.S = 0.5; c.lapse++; }
  c.ok = ok ? 1 : 0; c.last = now; c.n++;
}
function parts(st, now) {
  let learn = 0, mem = 0, due = 0;
  for (const w of WORDS) { const c = st.cards[w.id]; if (st.units[w.u]) learn++; if (held(c, now)) mem++; if (isDue(c, now)) due++; }
  const T = WORDS.length || 1;
  return { learn, mem, due, T, lq: Math.floor(learn / T * 100), mq: Math.floor(mem / T * 100) };
}
const gateOpen = p => p.lq >= GATE_LEARN && p.mq >= GATE_MEM;

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
  if (type === 'col' && !w.col) type = 'cloze';
  if (type === 'vi2w') return { type, top: `${w.pic || ''} ${esc(w.vi)}`, sub: 'Từ tiếng Anh nào có nghĩa này?', a: w.w, opts: shuf([w.w, ...pick(w, 'w', 3)]) };
  if (type === 'w2vi') return { type, top: esc(w.w), sub: `${esc(w.ipa || '')} · nghĩa là gì?`, a: w.vi, opts: shuf([w.vi, ...pick(w, 'vi', 3)]), say: w.w };
  if (type === 'col') return { type, top: 'Cụm từ nào đúng?', sub: `${esc(w.w)}: ${esc(w.vi)}`, a: w.col.ok, opts: shuf([w.col.ok, ...w.col.bad]) };
  return { type: 'cloze', top: esc(w.cloze.s), sub: 'Chọn từ điền vào chỗ trống.', a: w.cloze.a, opts: shuf([w.cloze.a, ...w.cloze.w]) };
}
const TYPES = ['vi2w', 'w2vi', 'cloze', 'col'];
const rndType = () => TYPES[Math.floor(Math.random() * TYPES.length)];

function speak(t) { try { const u = new SpeechSynthesisUtterance(t); u.lang = 'en-US'; u.rate = 0.9; speechSynthesis.cancel(); speechSynthesis.speak(u); } catch (e) {} }

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
function nextUnit() { return UNITS.find(u => !S.units[u.id]); }

function home() {
  const now = Date.now(), p = parts(S, now), nu = nextUnit(), open = gateOpen(p), passed = S.exams.some(x => x.pass);
  const ph2 = p.lq >= GATE_LEARN;
  $app.onclick = null;
  const tip = ph2 ? `Giai đoạn ôn: ôn hết từ đến hạn mỗi ngày để 🔁 Nhớ lên ${GATE_MEM}%.`
    : `Giai đoạn học: mỗi ngày học unit mới, ôn những từ đến hạn. Từ chỉ tính 🔁 Nhớ khi còn đúng sau ít nhất ${MEM_DAYS} ngày kể từ ngày học.`;
  const grid = UNITS.map(u => { const d = S.units[u.id], m = d && u.words.filter(w => held(S.cards[w.id], now)).length / u.words.length >= 0.8;
    return `<span class="${m ? 'm' : d ? 'd' : ''}" title="${esc(u.title)}">${u.no}</span>`; }).join('');
  $app.innerHTML = `
    <div class="row"><h1>Từ vựng A1</h1><button class="link" data-a="out">Đăng xuất</button></div>
    <p class="mute">${esc(user.email)} · <span id="sync">${esc(sync)}</span></p>
    <div class="box">
      <div class="row"><b>📘 Học ${p.lq}%</b><span class="mute">cần ${GATE_LEARN}% · ${p.learn}/${p.T} từ</span></div>${bar(p.lq, GATE_LEARN, 'var(--accent)')}
      <div class="row" style="margin-top:10px"><b>🔁 Nhớ ${p.mq}%</b><span class="mute">cần ${GATE_MEM}% · ${p.mem}/${p.T} từ</span></div>${bar(p.mq, GATE_MEM, 'var(--good)')}
    </div>
    ${p.due ? `<button class="pri" data-a="review">🔁 Ôn ${Math.min(p.due, ROUND)} từ đến hạn${p.due > ROUND ? ` (còn ${p.due})` : ''}</button>` : `<p class="mute">Chưa có từ đến hạn ôn.</p>`}
    ${nu ? `<button class="${p.due ? '' : 'pri'}" data-a="learn" data-u="${nu.id}">📘 Học Unit ${nu.no} · ${esc(nu.title)} (${esc(nu.vi)})</button>` : ''}
    <p class="mute">${tip}</p>
    <div class="box">
      <b>🚪 Thi chuyển cấp A1</b>
      <p class="mute">${passed ? '✅ Đã qua. Làm lại được bất cứ lúc nào.' : open ? 'Đã mở. ' : `Mở khi 📘 Học ${GATE_LEARN}% và 🔁 Nhớ ${GATE_MEM}%. `}${EXAM_N} câu từ vựng, đúng từ ${Math.round(EXAM_PASS * 100)}% là qua.</p>
      <button class="${open ? 'pri' : ''}" data-a="exam" ${open ? '' : 'disabled'}>${open ? 'Vào làm bài' : '🔒 Chưa mở'}</button>
      ${S.exams.slice(-3).reverse().map(x => `<div class="mute">${new Date(x.at).toLocaleDateString('vi-VN')}: ${x.ok}/${x.n} ${x.pass ? '✅ qua' : '❌ chưa qua'}</div>`).join('')}
    </div>
    <h2>87 unit</h2>
    <p class="mute">Xanh dương: đã học · Xanh lá: ≥ 80% từ đang nhớ. Bấm để học / xem lại.</p>
    <div class="units" id="grid">${grid}</div>`;
}

// học unit: xem 10 thẻ, rồi mỗi từ 2 câu (nghĩa + điền chỗ trống); sai thì hỏi lại tới khi đúng hết
function learn(u) {
  const again = !!S.units[u.id];
  let i = 0;
  const card = () => {
    const w = u.words[i];
    $app.innerHTML = `<div class="row"><button class="link" data-a="home">← Về</button><span class="mute">Unit ${u.no} · thẻ ${i + 1}/${u.words.length}</span></div>
      <div class="box" style="text-align:center"><div class="pic">${w.pic || ''}</div><div class="big">${esc(w.w)}</div>
      <div class="mute">${esc(w.ipa || '')} · ${esc(w.pos)}</div><p><b>${esc(w.vi)}</b></p>
      <p>${esc(w.ex)}<br><span class="mute">${esc(w.exVi)}</span></p>${w.col ? `<p class="mute">Cụm hay dùng: <b>${esc(w.col.ok)}</b></p>` : ''}</div>
      <button data-a="say">🔊 Nghe</button><button class="pri" data-a="next">${i + 1 < u.words.length ? 'Tiếp' : 'Luyện tập'}</button>`;
    speak(w.w);
    $app.onclick = e => { const a = e.target.closest('[data-a]')?.dataset.a; if (a === 'say') speak(w.w + '. ' + w.ex); if (a === 'next') { if (++i < u.words.length) card(); else quiz(); } if (a === 'home') home(); };
  };
  const quiz = () => run({
    title: `Unit ${u.no} · luyện tập`, items: shuf(u.words.flatMap(w => [{ w, type: 'vi2w' }, { w, type: 'cloze' }])), retry: true,
    done: () => { if (!again) { learnCards(S, u, Date.now()); save(); }
      $app.innerHTML = `<div class="box"><b>✅ Xong Unit ${u.no}: ${esc(u.title)}</b><p class="mute">${again ? 'Xem lại không đổi lịch ôn.' : `10 từ đã vào lịch ôn. Ôn đúng lúc sắp quên, sau ${MEM_DAYS} ngày vẫn đúng thì tính vào 🔁 Nhớ.`}</p></div><button class="pri" data-a="home">Về trang chính</button>`;
      $app.onclick = e => { if (e.target.closest('[data-a="home"]')) home(); }; },
  });
  card();
}

function review() {
  const now = Date.now(), due = WORDS.filter(w => isDue(S.cards[w.id], now)).sort((a, b) => recall(S.cards[a.id], now) - recall(S.cards[b.id], now)).slice(0, ROUND);
  let ok = 0;
  run({ title: '🔁 Ôn từ đến hạn', items: due.map(w => ({ w, type: rndType() })), retry: true,
    first: (it, good) => { grade(S, it.w.id, good, Date.now()); if (good) ok++; save(); },
    done: () => { $app.innerHTML = `<div class="box"><b>Xong lượt ôn</b><p>Đúng ngay lần đầu ${ok}/${due.length} từ.</p></div><button class="pri" data-a="home">Về trang chính</button>`;
      $app.onclick = e => { if (e.target.closest('[data-a="home"]')) home(); }; } });
}

function exam() {
  const items = shuf(WORDS).slice(0, EXAM_N).map(w => ({ w, type: rndType() })), wrong = [];
  let ok = 0;
  run({ title: '🚪 Thi chuyển cấp A1', items, retry: false, quiet: true,
    first: (it, good) => { if (good) ok++; else wrong.push(it.w); },
    done: () => { const pass = ok / EXAM_N >= EXAM_PASS; S.exams.push({ at: Date.now(), n: EXAM_N, ok, pass }); save();
      $app.innerHTML = `<div class="box"><b>${pass ? '✅ Qua Thi chuyển cấp A1' : '❌ Chưa qua'}</b><p>Đúng ${ok}/${EXAM_N} (cần ${Math.ceil(EXAM_N * EXAM_PASS)}).</p></div>
        ${wrong.length ? `<h2>Từ làm sai</h2>${wrong.map(w => `<div>${esc(w.w)}: ${esc(w.vi)}</div>`).join('')}` : ''}<button class="pri" data-a="home">Về trang chính</button>`;
      $app.onclick = e => { if (e.target.closest('[data-a="home"]')) home(); }; } });
}

// chạy một chuỗi câu hỏi. retry: sai thì đưa câu về cuối. first(it, đúng?) gọi một lần cho mỗi câu ở lần hỏi đầu. quiet: không báo đúng / sai (bài thi).
function run({ title, items, retry, quiet, first, done }) {
  const q = items.map(x => ({ ...x, tries: 0 })), total = items.length;
  let solved = 0;
  const show = () => {
    if (!q.length) return done();
    const it = q[0], Q = question(it.w, it.type);
    $app.innerHTML = `<div class="row"><button class="link" data-a="home">← Về</button><span class="mute">${title} · ${solved}/${total}</span></div>
      ${bar(solved / total * 100, 0, 'var(--accent)')}
      <p class="q">${Q.top}</p><p class="mute">${Q.sub}</p>
      ${Q.opts.map((o, k) => `<button data-k="${k}">${esc(o)}</button>`).join('')}<div id="fb"></div>`;
    if (Q.say && !quiet) speak(Q.say);
    let answered = false;
    $app.onclick = e => {
      if (e.target.closest('[data-a="home"]')) { if (quiet && !confirm('Bỏ bài thi? Lần này không tính.')) return; return home(); }
      if (e.target.closest('[data-a="go"]')) return show();
      const b = e.target.closest('[data-k]'); if (!b || answered) return;
      answered = true;
      const good = Q.opts[+b.dataset.k] === Q.a;
      if (it.tries++ === 0 && first) first(it, good);
      q.shift();
      if (good || !retry) solved++; else q.push(it);
      if (quiet) return show();
      $app.querySelectorAll('[data-k]').forEach(x => { if (Q.opts[+x.dataset.k] === Q.a) x.classList.add('ok'); else if (x === b) x.classList.add('no'); });
      const w = it.w;
      document.getElementById('fb').innerHTML = `<div class="box">${good ? '✅ Đúng.' : '❌ Chưa đúng.'} <b>${esc(w.w)}</b> = ${esc(w.vi)}<br>${esc(w.ex)}<br><span class="mute">${esc(w.exVi)}</span></div><button class="pri" data-a="go">Tiếp</button>`;
      speak(w.w);
    };
  };
  show();
}

// ---------- đăng nhập ----------
function login(msg) {
  $app.innerHTML = `<h1>Từ vựng A1</h1><p class="mute">870 từ A1 · 87 unit. Đăng nhập để lưu tiến độ trên mọi máy.</p>
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
  if (!user) return login();
  $app.innerHTML = '<p class="mute">Đang tải tiến độ…</p>';
  await load(); home();
}

document.addEventListener('click', e => {
  const t = e.target.closest('[data-a]'); if (!t || !S || !user) return;
  if (!document.getElementById('grid') && t.dataset.a !== 'out') return;   // chỉ trang chính; màn học có onclick riêng
  const a = t.dataset.a;
  if (a === 'out') { sb.auth.signOut(); return; }
  if (a === 'review') review();
  if (a === 'learn') learn(UBY[t.dataset.u]);
  if (a === 'exam') exam();
});
document.addEventListener('click', e => { const s = e.target.closest('#grid span'); if (s && S) learn(UNITS[+s.textContent - 1]); });

(async () => {
  try { const d = await (await fetch('a1.json')).json(); UNITS = d.units; }
  catch (e) { $app.innerHTML = '<p>Không tải được dữ liệu từ (a1.json).</p>'; return; }
  for (const u of UNITS) { UBY[u.id] = u; for (const w of u.words) { w.u = u.id; WBY[w.id] = w; WORDS.push(w); } }
  let last;
  sb.auth.onAuthStateChange((ev, session) => { const id = session ? session.user.id : null; if (id === last) return; last = id; S = null; setTimeout(() => start(session), 0); });
})();
