// 🗣 Bù 3 (28/10/2026): nói theo cặp. Đề thật A2 Key → C2 Proficiency đều có phần hai thí sinh thảo luận với nhau (một câu hỏi chính + 5 gợi ý, rồi chốt chọn một).
// App chỉ có nói một mình nên thiếu tiêu chí "Tương tác". Ở đây có bạn thi ảo (cap.json, giọng Kokoro): bạn nêu ý, hỏi lại; người học đáp.
// Máy đo mỗi lượt: ① đáp lời bạn (đồng ý / phản đối), ② nêu lý do, ③ hỏi lại bạn (lượt chốt: ③ là đề xuất / chốt chọn), ④ đủ dài. Đạt ≥ 60%.
// 🤖 Bạn AI (tuỳ chọn, cần khoá ANTHROPIC_API_KEY, tốn ít tiền mỗi lượt): bạn thi trả lời đúng theo lời người học (edge function el-ban). Lỗi / chưa có khoá thì dùng lời soạn sẵn.
// Không tính vào 📘 Học / 🔁 Nhớ / Thi chuyển cấp (không đổi luật đo).
let CAP = null;
const capLoad = async () => CAP || (CAP = await (await fetch('cap.json?v=' + APP_V)).json());
const capBase = lv => ({ a2p: 'a2', b1p: 'b1', b2p: 'b2' }[lv] || lv);
const CAP_LVS = ['a2', 'b1', 'b2', 'c1', 'c2'], CAP_MIN = { a2: 12, b1: 18, b2: 25, c1: 30, c2: 35 }, CAP_PASS = 0.6;
const CAP_RE = {
  react: /\b(i (completely |totally |really |partly )?(agree|disagree)|i see what you mean|i take your point|(that's|that is) (true|right|a (good|fair|valid|great) point|interesting|an interesting point)|good point|fair (enough|point)|i'm not (so |that |entirely |completely )?(sure|convinced)|exactly|absolutely|you're right|you are right|maybe|perhaps|me too|me neither|yes|yeah|no,? i|not really|i suppose|i guess|on the other hand|i'd (go along|agree)|definitely|of course)\b/,
  why: /\b(because|since|as a result|so that|that's why|for example|for instance|the reason|due to|which means|otherwise|so)\b/,
  ask: /\b(what do you think|what about you|how about you|and you|do you agree|don't you think|wouldn't you (say|agree)|would you agree|what's your (view|opinion|take)|how do you feel|do you (like|think)|have you ever|is it|isn't it|are you|right\?)|\?/,
  dec: /\b(let's|let us|shall we|we should|we could (go for|choose|pick)|i('d| would) (go for|choose|pick|say)|i('ll| will) (go for|choose|pick)|so we (agree|decided)|agreed|we agree|the (best|most important|biggest)|i think (we|it's|it is|the)|i choose|my choice)\b/ };
const capChecks = (t, last) => { const s = String(t || '').toLowerCase(); return [CAP_RE.react.test(s), CAP_RE.why.test(s), last ? CAP_RE.dec.test(s) : CAP_RE.ask.test(s)]; };
const CAP_CN = ['Đáp lời bạn', 'Nêu lý do', 'Hỏi lại bạn', 'Đủ dài'], CAP_CND = ['Đáp lời bạn', 'Nêu lý do', 'Chốt / đề xuất', 'Đủ dài'];
function capScore(turns, lv) { const n = CAP_MIN[capBase(lv)] || 20, rows = turns.map((t, i) => { const last = i === turns.length - 1, c = [...capChecks(t, last), kWords(t).length >= n]; return { c, sc: c.filter(Boolean).length / 4 }; });
  return { rows, pct: Math.round(rows.reduce((s, r) => s + r.sc, 0) / (rows.length || 1) * 100) }; }
const capRuns = () => (S.cap = S.cap || {});
const capTasks = lv => { const b = capBase(lv), ls = CAP_LVS.filter(l => LEVELS.indexOf(l) <= LEVELS.indexOf(b)).reverse(); for (const l of ls) { const t = (CAP ? CAP.tasks : []).filter(x => x.lv === l); if (t.length) return t; } return []; };
function capBox(lv) { if (LEVELS.indexOf(lv) < LEVELS.indexOf('a2')) return ''; const R = capRuns(), n = Object.keys(R).length;
  return `<div class="box"><div class="row"><b>👥 Nói theo cặp</b><span class="mute">${n ? `đã làm ${n} đề` : ''}</span></div><p class="mute" style="margin:6px 0">Thảo luận với bạn thi ảo như phần nói cặp của đề thật: đáp lời, nêu lý do, hỏi lại, rồi cùng chốt. Cần Safari trên iPhone.</p><button data-cap="${lv}">👥 Luyện nói theo cặp</button></div>`; }
async function capView(lv) { window.CUR = { view: 'noi-cap', item: lv }; $app.innerHTML = '<p class="mute">Đang tải…</p>';
  try { await capLoad(); } catch (e) { $app.innerHTML = `${backRow('👥 Nói theo cặp')}<p>Không tải được. Thử lại sau.</p>`; $app.onclick = e => { if (e.target.closest('[data-a="home"]')) overview(lv); }; return; }
  if (!NCLIPS.size) try { NCLIPS = new Set(await (await fetch('n/index.json?v=' + APP_V)).json()); } catch (e) {}
  const R = capRuns(), ts = capTasks(lv);
  $app.innerHTML = `${backRow('👥 Nói theo cặp')}<h1>👥 Nói theo cặp · ${LVN[ts[0] ? ts[0].lv : lv]}</h1>
    <p class="mute">Bạn thi nói trước, rồi tới lượt bạn. Mỗi lượt nói ${CAP_MIN[capBase(lv)] || 20}+ từ, gồm: ① đáp lời bạn (I agree / I'm not sure…), ② lý do (because…), ③ hỏi lại (What do you think?). Lượt cuối: cùng chốt một lựa chọn.</p>
    ${!SREC ? '<div class="box"><b>Trình duyệt này không chép được lời.</b><p class="mute" style="margin:4px 0 0">Mở bằng Safari trên iPhone để máy nghe và đo. Vẫn xem đề được.</p></div>' : ''}
    <label class="box" style="display:flex;gap:10px;align-items:flex-start"><input type="checkbox" id="capai" style="width:auto;margin:4px 0" ${S.capAi ? 'checked' : ''}><span>🤖 Bạn AI trả lời theo lời bạn nói<br><span class="mute">Cần khoá AI trên Supabase; tốn ít tiền mỗi lượt. Lỗi hoặc chưa có khoá thì bạn thi dùng lời soạn sẵn.</span></span></label>
    ${ts.map(x => `<button class="box" data-capt="${x.id}" style="width:100%;text-align:left;display:block"><div class="row"><b>${esc(x.title)}</b><span class="mute">${R[x.id] ? R[x.id].pct + '%' : ''} ›</span></div><p class="mute" style="margin:4px 0 0">${esc(x.q)}</p></button>`).join('')}`;
  $app.onclick = e => { if (e.target.closest('[data-a="home"]')) return overview(lv); const c = e.target.closest('#capai'); if (c) { S.capAi = c.checked; S.t = Date.now(); save(); return; }
    const b = e.target.closest('[data-capt]'); if (b) capRun(lv, CAP.tasks.find(x => x.id === b.dataset.capt)); }; }
// bạn thi nói (giọng Kokoro n/ nếu có, không thì giọng máy Anh–Anh)
const capSay = async ts => { EXAM_VOX = true; try { await speak(...ts); } finally { EXAM_VOX = false; } };
async function capAi(lv, x, hist, step, total) { if (!S.capAi || typeof sb === 'undefined' || !sb.functions) return null;
  try { const { data, error } = await sb.functions.invoke('el-ban', { body: { lv: capBase(lv), uid: (user && user.id) || 'khach', task: { q: x.q, prompts: x.prompts }, hist, step, total } });
    if (error || !data || !data.reply) { let m = data && data.error; if (error && !m) try { m = (await error.context.json()).error; } catch (er) {} toast('🤖 ' + (m || 'Bạn AI không trả lời được') + ': dùng lời soạn sẵn.'); S.capAi = false; return null; }
    return String(data.reply).slice(0, 600); } catch (e) { toast('🤖 Không gọi được bạn AI: dùng lời soạn sẵn.'); S.capAi = false; return null; } }
function capRun(lv, x) { if (!x) return; const steps = [x.open, ...x.turns, x.decide], hist = [], turns = [], react = (CAP.react[x.lv] || CAP.react.b1); let i = 0;
  window.CUR = { view: 'noi-cap-lam', item: x.id };
  const head = () => `<div class="row top"><button class="link" data-a="back">← Thôi</button><span class="uname">👥 Lượt ${Math.min(i + 1, steps.length)}/${steps.length}</span></div>
    <div class="box"><b>${esc(x.q)}</b><div class="chips" style="margin-top:6px">${x.prompts.map(p => `<span class="chip" style="cursor:default">${esc(p)}</span>`).join('')}</div></div>`;
  const turn = async line => { hist.push({ who: 'partner', text: line }); let tFirst = 0;
    $app.innerHTML = `${head()}<p class="mute">🎧 Bạn thi đang nói…</p><details><summary>Xem lời bạn thi</summary><p>${esc(line)}</p></details><div id="capu"></div>`;
    await capSay([line]);
    const box = document.getElementById('capu'); if (!box) return;
    box.innerHTML = `<p class="mute" style="margin-top:8px">Tới lượt bạn${i === steps.length - 1 ? ': cùng chốt một lựa chọn, nói lý do' : ': đáp lời, nêu lý do, hỏi lại'}. Nói ${CAP_MIN[capBase(lv)] || 20}+ từ.</p>
      <button data-a="again">🔊 Nghe lại bạn thi</button>${SREC ? `<button class="pri" data-a="rec">🎙 Nói</button><p class="mute" id="kheard"></p>` : `<textarea id="capt" rows="4" placeholder="Không chép được lời: gõ điều bạn sẽ nói"></textarea><button class="pri" data-a="typed">Xong lượt ›</button>`}`;
    box.onclick = e => { if (e.target.closest('[data-a="again"]')) return capSay([line]);
      if (e.target.closest('[data-a="typed"]')) return next(document.getElementById('capt').value || '');
      const b = e.target.closest('[data-a="rec"]'); if (!b) return;
      if (K_ASR.on) { b.disabled = true; b.textContent = '⏳ …'; return kAsrStop(txt => next(txt)); }
      b.textContent = '⏹ Xong lượt'; kAsrStart(txt => { if (txt && !tFirst) tFirst = Date.now(); const h = document.getElementById('kheard'); if (h) h.textContent = txt || '…'; }); }; };
  const next = async said => { turns.push(said); hist.push({ who: 'candidate', text: said }); i++; if (i >= steps.length) return end();
    $app.innerHTML = `${head()}<p class="mute">🎧 …</p>`;
    const ai = await capAi(lv, x, hist, i, steps.length); if (ai) return turn(ai);
    await capSay([react[Math.floor(Math.random() * react.length)]]); turn(steps[i]); };
  const end = () => { kAsrStop(); const sc = capScore(turns, lv), R = capRuns(); R[x.id] = { at: Date.now(), pct: sc.pct }; S.t = Date.now(); save();
    const tr = hist.map(h => (h.who === 'partner' ? 'Partner: ' : 'Candidate: ') + h.text).join('\n');
    $app.innerHTML = `<h1>👥 ${sc.pct}% · ${sc.pct >= CAP_PASS * 100 ? '✅ tương tác tốt' : '🔁 cần luyện thêm'}</h1>
      <div class="box"><b>${esc(x.title)}</b>${sc.rows.map((r, k) => `<p style="margin:8px 0 0"><span class="mute">Lượt ${k + 1}:</span> “${esc(turns[k] || '…')}”<br>${(k === turns.length - 1 ? CAP_CND : CAP_CN).map((n, j) => (r.c[j] ? '✅ ' : '⬜ ') + n).join(' · ')}</p>`).join('')}</div>
      <details class="box"><summary>Cụm hay dùng khi nói cặp</summary><p style="margin:6px 0 0">Đáp lời: I agree, because… · I see what you mean, but… · I'm not so sure about that.<br>Hỏi lại: What do you think? · Would you agree? · How do you feel about…?<br>Chốt: So, shall we go for…? · I think we should choose… · Let's agree on…</p></details>
      <p class="mute">Máy đo cách tương tác qua lời chép, không chấm ngữ pháp, phát âm. Muốn chấm như giám khảo: nút dưới (cần khoá AI).</p>
      ${typeof aiBtn === 'function' ? aiBtn('noi', capBase(lv), { prompt: `Collaborative discussion task with a partner (two candidates). Central question: ${x.q} Prompts: ${x.prompts.join(', ')}. Then the candidates decide together. Focus especially on Interactive Communication.` }, tr) : ''}
      <button class="pri" data-a="list">👥 Đề khác</button><button data-a="home2">← Tổng quan</button>`; scrollTo(0, 0);
    $app.onclick = e => { if (e.target.closest('[data-a="list"]')) return capView(lv); if (e.target.closest('[data-a="home2"]')) return overview(lv); }; };
  $app.onclick = e => { if (e.target.closest('[data-a="back"]')) { kAsrStop(); try { speechSynthesis.cancel(); AUD && AUD.pause(); } catch (er) {} return capView(lv); } };
  turn(steps[0]); }
document.addEventListener('click', e => { const b = e.target.closest('[data-cap]'); if (b) capView(b.dataset.cap); });
