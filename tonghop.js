// 🏋️ Luyện tập tổng hợp (người sáng lập 22/10/2026: "một bài đọc / nghe / viết dính tới nhiều từ thì làm đúng cũng chấm được ở các từ ấy").
// Chỉ chấm từ có bằng chứng thật, để không thành "nhớ suông":
//   📰 Đọc bài   → 📖 Nghĩa cho các từ đã học nằm trong CÂU BẰNG CHỨNG của câu hỏi (câu phải hiểu mới trả lời đúng); sai không trừ (không biết sai vì từ nào).
//   🎧 Nghe câu  → 🎧 Nghe cho mọi từ đã học trong câu (chọn đúng nghĩa cả câu); sai chỉ trừ từ đích của câu.
//   ✍️ Nghe chép → 🎧 Nghe + ✍️ Viết cho TỪNG từ đã học trong câu: chép đúng từ nào tính đúng từ đó, sai / thiếu tính sai.
// Luật nhớ của mặt vẫn như cũ (đúng ở một ngày sau ngày học, lần gần nhất đúng, khả năng nhớ ≥ 0,9): chấm qua grade() với dạng read / hear / dict.
const MIN_LEN = 3;   // từ quá ngắn (a, I, to, in…) có mặt ở mọi câu: không chấm kèm, tránh lên Nhớ dễ dãi

// dạng chữ của một từ trong câu: số nhiều, quá khứ, -ing (cả bỏ e, gấp đôi phụ âm, y → ies / ied)
function formsOf(w) {
  const x = w.toLowerCase(); if (/\s/.test(x)) { const [h, ...r] = x.split(' '); return formsOf(h).map(f => [f, ...r].join(' ')); }   // cụm: chia từ đầu (looking for)
  const f = new Set([x, x + 's', x + 'es', x + 'ed', x + 'd', x + 'ing', x + "'s"]);
  if (/[^aeiou]y$/.test(x)) { f.add(x.slice(0, -1) + 'ies'); f.add(x.slice(0, -1) + 'ied'); }
  if (/e$/.test(x)) f.add(x.slice(0, -1) + 'ing');
  if (/[^aeiou][aeiou][bdgmnprt]$/.test(x)) { f.add(x + x.slice(-1) + 'ing'); f.add(x + x.slice(-1) + 'ed'); }
  return [...f];
}
const reEsc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
let FORM_RE = null;
const formRe = w => (FORM_RE = FORM_RE || {})[w.id] || (FORM_RE[w.id] = new RegExp(`(?<![A-Za-z'])(${formsOf(w.w).map(reEsc).join('|')})(?![A-Za-z])`, 'i'));
const learned = w => !!S.cards[w.id];
// các từ đã học có trong đoạn chữ, kèm dạng chữ thật xuất hiện
function wordsIn(text) { const t = String(text).replace(/[‘’]/g, "'"); const out = [];
  for (const w of WORDS) { if (!learned(w) || w.w.replace(/\s/g, '').length < MIN_LEN) continue; const m = formRe(w).exec(t); if (m) out.push({ w, form: m[1] }); }
  return out; }
function credit(list, type, ok) { const now = Date.now(); for (const w of list) grade(S, w.id, ok, now, type); if (list.length) save(); }
const chipsOf = (ws, cls) => ws.map(w => `<span class="chip ${cls || ''}" style="cursor:default">${esc(w.w)}</span>`).join(' ');
const backRow = t => `<div class="row top"><button class="link" data-a="home">← Về</button><span class="uname">${esc(t)}</span></div>`;
const dimLack = (w, k) => !heldDim(S.cards[w.id], k, Date.now());

// ---------- chọn kiểu luyện ----------
function practiceMenu() {
  window.CUR = { view: 'luyen-tap' };
  const p = parts(S, Date.now()), low = DIMS.map(([k]) => k).sort((a, b) => p.dim[a] - p.dim[b])[0];
  const rec = { nghia: 'read', nghe: 'hear', viet: 'dict', dung: 'word' }[low];
  const opt = (k, t, sub) => `<button class="opt ${rec === k ? 'pri' : ''}" data-m="${k}"><b>${t}</b>${rec === k ? ' · nên làm' : ''}<br><span style="font-size:14px;opacity:.85">${sub}</span></button>`;
  $app.innerHTML = `${backRow('🏋️ Luyện tập')}<h1>🏋️ Luyện tập</h1>
    <p class="mute">Mặt đang thấp nhất: <b>${DIMS.find(x => x[0] === low)[1]} ${p.dq[low]}%</b>. Bài tổng hợp chấm được nhiều từ một lúc.</p>
    ${opt('word', '⚡ Từng từ (20 câu)', 'Đủ 4 mặt; máy hỏi vào mặt còn thiếu của từng từ')}
    ${opt('read', '📰 Đọc bài', '📖 Nghĩa: các từ trong câu bằng chứng của câu bạn trả lời đúng')}
    ${opt('hear', '🎧 Nghe câu (8 câu)', '🎧 Nghe: mọi từ đã học trong câu bạn hiểu đúng')}
    ${opt('dict', '✍️ Nghe chép (5 câu)', '🎧 Nghe + ✍️ Viết: từng từ chép đúng')}`;
  $app.onclick = e => { if (e.target.closest('[data-a="home"]')) return home(); const b = e.target.closest('[data-m]'); if (!b) return;
    ({ word: practice, read: readTask, hear: hearTask, dict: dictTask })[b.dataset.m](); };
}
const doneBox = (h, body, again) => { $app.innerHTML = `<div class="box"><b>${h}</b>${body}</div><button class="pri" data-a="again">Làm tiếp</button><button data-a="menu">Kiểu luyện khác</button><button data-a="home">Về 📘 Học</button>`;
  $app.onclick = e => { if (e.target.closest('[data-a="home"]')) home(); if (e.target.closest('[data-a="menu"]')) practiceMenu(); if (e.target.closest('[data-a="again"]')) again(); }; };
const dimNow = () => { const p = parts(S, Date.now()); return DIMS.map(([k, l]) => `${l} ${p.dq[k]}%`).join(' · '); };

// ---------- 📰 Đọc bài ----------
function readTask() {
  // bài đọc theo unit gốc (READS, a1.json): mở khi đã học ≥ 70% từ của unit gốc (bài học đã xếp lại theo cấp, 23/10/2026)
  const now = Date.now(), cand = READS.filter(r => r.words.filter(id => S.cards[id]).length >= 0.7 * r.words.length);
  if (!cand.length) { toast('Chưa có bài đọc: học thêm vài bài để mở.'); return practiceMenu(); }
  const score = r => r.qs.reduce((n, q) => n + wordsIn(q.why).filter(x => !heldDim(S.cards[x.w.id], 'nghia', now)).length, 0);
  const R = shuf(cand).sort((a, b) => score(b) - score(a))[0], u = { id: R.src }, got = new Map();
  let i = 0, ok = 0;
  const show = () => {
    if (i >= R.qs.length) return doneBox(`Xong bài đọc: ${ok}/${R.qs.length} câu đúng`,
      `<p class="mute">Chấm 📖 Nghĩa ${got.size} từ: ${chipsOf([...got.values()], 'on') || '(không có)'}</p><p class="mute">Bài dịch: ${esc(R.vi)}</p><p class="mute">${dimNow()}</p>`, readTask);
    const q = R.qs[i], opts = shuf([q.a, ...q.w]);
    window.CUR = { view: 'doc-bai', unit: u.id, item: 'r:' + u.id + ':' + i, prompt: q.q };
    $app.innerHTML = `${backRow(`📰 Đọc · ${esc(R.tvi || R.title)} · câu ${i + 1}/${R.qs.length}`)}
      <div class="box"><b>${esc(R.title)}</b><p style="font-size:18px;line-height:1.6;margin:8px 0 0">${esc(R.text)}</p></div>
      <p class="q">${esc(q.q)}</p>${opts.map((o, k) => `<button class="opt" data-k="${k}">${esc(o)}</button>`).join('')}<div id="fb"></div>`;
    let done = false;
    $app.onclick = e => {
      if (e.target.closest('[data-a="home"]')) return home();
      if (e.target.closest('[data-a="go"]')) { i++; return show(); }
      const b = e.target.closest('[data-k]'); if (!b || done) return; done = true;
      const good = opts[+b.dataset.k] === q.a, ev = wordsIn(q.why).map(x => x.w);
      $app.querySelectorAll('[data-k]').forEach(x => { if (opts[+x.dataset.k] === q.a) x.classList.add('ok'); else if (x === b) x.classList.add('no'); });
      if (good) { ok++; credit(ev, 'read', true); ev.forEach(w => got.set(w.id, w)); }
      document.getElementById('fb').innerHTML = `<div class="box">${good ? '✅ Đúng.' : '❌ Chưa đúng.'} Bằng chứng: ${esc(q.why)}
        ${good && ev.length ? `<p class="mute">Chấm 📖 Nghĩa: ${chipsOf(ev, 'on')}</p>` : ''}</div><button class="pri" data-a="go">Tiếp →</button>`;
      document.getElementById('fb').scrollIntoView({ block: 'nearest' });
    };
  };
  show();
}

// ---------- 🎧 Nghe câu ----------
// câu đích: câu ví dụ của từ đã học còn thiếu 🎧 Nghe (ưu tiên); chọn nghĩa tiếng Việt của cả câu trong 3
function pickTargets(dim, n) { const now = Date.now(), L = WORDS.filter(learned);
  return shuf(L).sort((a, b) => (heldDim(S.cards[a.id], dim, now) ? 1 : 0) - (heldDim(S.cards[b.id], dim, now) ? 1 : 0) || recall(S.cards[a.id], now) - recall(S.cards[b.id], now)).slice(0, n); }
function hearTask() {
  const T = pickTargets('nghe', 8); if (!T.length) return practiceMenu();
  const got = new Map(); let i = 0, ok = 0;
  const show = () => {
    if (i >= T.length) return doneBox(`Xong nghe câu: ${ok}/${T.length} câu đúng`, `<p class="mute">Chấm 🎧 Nghe ${got.size} từ: ${chipsOf([...got.values()], 'on') || '(không có)'}</p><p class="mute">${dimNow()}</p>`, hearTask);
    const w = T[i], others = shuf(WORDS.filter(x => x.id !== w.id && x.exVi !== w.exVi)).slice(0, 2), opts = shuf([w.exVi, ...others.map(x => x.exVi)]);
    window.CUR = { view: 'nghe-cau', item: 'h:' + w.id, prompt: w.ex };
    $app.innerHTML = `${backRow(`🎧 Nghe câu ${i + 1}/${T.length}`)}<p class="q">🎧 Nghe rồi chọn nghĩa của cả câu</p>
      <button class="chip" data-say="${w.id}" data-ex="1">🔊 Nghe lại</button>
      ${opts.map((o, k) => `<button class="opt" data-k="${k}">${esc(o)}</button>`).join('')}<div id="fb"></div>`;
    speak(w.ex);
    let done = false;
    $app.onclick = e => {
      if (e.target.closest('[data-a="home"]')) return home();
      if (e.target.closest('[data-a="go"]')) { i++; return show(); }
      const b = e.target.closest('[data-k]'); if (!b || done) return; done = true;
      const good = opts[+b.dataset.k] === w.exVi, ev = [...new Map([w, ...wordsIn(w.ex).map(x => x.w)].map(x => [x.id, x])).values()];
      $app.querySelectorAll('[data-k]').forEach(x => { if (opts[+x.dataset.k] === w.exVi) x.classList.add('ok'); else if (x === b) x.classList.add('no'); });
      if (good) { ok++; credit(ev, 'hear', true); ev.forEach(x => got.set(x.id, x)); } else credit([w], 'hear', false);
      document.getElementById('fb').innerHTML = `<div class="box">${good ? '✅ Đúng.' : '❌ Chưa đúng.'} Câu nghe: <b>${esc(w.ex)}</b>
        ${good ? `<p class="mute">Chấm 🎧 Nghe: ${chipsOf(ev, 'on')}</p>` : `<p class="mute">Từ cần ôn: ${esc(w.w)} = ${esc(w.vi)}</p>`}</div><button class="pri" data-a="go">Tiếp →</button>`;
    };
  };
  show();
}

// ---------- ✍️ Nghe chép ----------
function dictTask() {
  const T = pickTargets('viet', 5); if (!T.length) return practiceMenu();
  const got = new Map(), miss = new Map(); let i = 0;
  const show = () => {
    if (i >= T.length) return doneBox(`Xong nghe chép ${T.length} câu`,
      `<p class="mute">Chấm đúng 🎧 Nghe + ✍️ Viết ${got.size} từ: ${chipsOf([...got.values()], 'on') || '(không có)'}</p>${miss.size ? `<p class="mute">Chép sai / thiếu: ${chipsOf([...miss.values()])}</p>` : ''}<p class="mute">${dimNow()}</p>`, dictTask);
    const w = T[i];
    window.CUR = { view: 'nghe-chep', item: 'd:' + w.id, prompt: w.ex };
    $app.innerHTML = `${backRow(`✍️ Nghe chép ${i + 1}/${T.length}`)}<p class="q">✍️ Nghe rồi chép lại cả câu</p>
      <p class="mute">Nghĩa: ${esc(w.exVi)}</p><button class="chip" data-say="${w.id}" data-ex="1">🔊 Nghe lại</button>
      <form id="df2" autocomplete="off"><textarea id="dt" rows="3" autocapitalize="off" autocorrect="off" spellcheck="false" aria-label="Chép câu vừa nghe"></textarea>
      <button class="pri" type="submit">Kiểm tra</button></form><div id="fb"></div>`;
    speak(w.ex);
    const f = document.getElementById('df2'), ta = document.getElementById('dt');
    f.onsubmit = e => { e.preventDefault(); if (!ta.value.trim()) return ta.focus();
      const typed = ' ' + ta.value.toLowerCase().replace(/[‘’]/g, "'").replace(/[^a-z' ]+/g, ' ') + ' ', inS = wordsIn(w.ex);
      if (!inS.some(x => x.w.id === w.id)) inS.push({ w, form: w.w });
      const good = [], bad = [];
      for (const x of inS) (typed.includes(' ' + x.form.toLowerCase() + ' ') ? good : bad).push(x.w);
      credit(good, 'dict', true); credit(bad, 'dict', false);
      good.forEach(x => { got.set(x.id, x); miss.delete(x.id); }); bad.forEach(x => { if (!got.has(x.id)) miss.set(x.id, x); });
      ta.disabled = true; f.querySelector('button').remove();
      document.getElementById('fb').innerHTML = `<div class="box">Câu đúng: <b>${esc(w.ex)}</b>
        ${good.length ? `<p class="mute">Chép đúng (chấm 🎧 + ✍️): ${chipsOf(good, 'on')}</p>` : ''}${bad.length ? `<p class="mute">Sai / thiếu: ${chipsOf(bad)}</p>` : ''}</div><button class="pri" data-a="go">Tiếp →</button>`; };
    $app.onclick = e => { if (e.target.closest('[data-a="home"]')) return home(); if (e.target.closest('[data-a="go"]')) { i++; show(); } };
  };
  show();
}
