// 🏋️ Luyện tập tổng hợp (người sáng lập 22/10/2026: "một bài đọc / nghe / viết dính tới nhiều từ thì làm đúng cũng chấm được ở các từ ấy").
// Chỉ chấm từ có bằng chứng thật, để không thành "nhớ suông":
//   📰 Đọc bài   → 📖 Nghĩa cho các từ đã học nằm trong CÂU BẰNG CHỨNG của câu hỏi (câu phải hiểu mới trả lời đúng); sai không trừ (không biết sai vì từ nào).
//   🎧 Nghe câu  → 🎧 Nghe cho mọi từ đã học trong câu (chọn đúng nghĩa cả câu); sai chỉ trừ từ đích của câu.
//   ✍️ Nghe chép → 🎧 Nghe + ✍️ Viết cho TỪNG từ đã học trong câu: chép đúng từ nào tính đúng từ đó, sai / thiếu tính sai.
// 25/10/2026 (người sáng lập: tách bạch mục tiêu từng phần): ba bài này là bài kỹ năng, chuyển sang phần 📰 Đọc / 🎧 Nghe (parts.js),
// THÔI tính cho 📚 Từ vựng (credit() không chấm). Chỉ còn hiện từ đã học gặp lại trong bài, để ôn.
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
function credit() {}   // không chấm cho từ vựng (xem đầu tệp)
const chipsOf = (ws, cls) => ws.map(w => `<span class="chip ${cls || ''}" style="cursor:default">${esc(w.w)}</span>`).join(' ');
const backRow = t => `<div class="row top"><button class="link" data-a="home">← Về</button><span class="uname">${esc(t)}</span></div>`;
const dimLack = (w, k) => !heldDim(S.cards[w.id], k, Date.now());

// Bấm một mặt của 🔁 Nhớ ở trang chính (người sáng lập 23/10/2026: "bấm vào mỗi mặt để xem bài cụ thể là gì"): mặt đo gì, bài nào tính vào,
// ví dụ câu bằng từ đã học, nút làm ngay, từ còn thiếu mặt đó.
const DIM_INFO = {
  nghia: { learn: 'thẻ từ và câu 📖 thấy từ chọn nghĩa khi học bài', what: 'Nhìn chữ tiếng Anh hiểu nghĩa.', ex: w => [`<b>${w.w}</b> → chọn nghĩa: ${w.vi} / …`],
    tasks: [['p', '⚡ Luyện riêng (20 câu)', 'Thấy từ, chọn nghĩa']] },
  nghe: { learn: 'thẻ từ (máy tự đọc, nút 🔊) và câu 🔊 nghe chọn nghĩa khi học bài', what: 'Nghe từ (không nhìn chữ) mà nhận ra nghĩa. Nghe hiểu câu, bài là phần 🎧 Nghe.', ex: w => [`🔊 (nghe "${w.w}") → chọn nghĩa: ${w.vi} / …`],
    tasks: [['p', '⚡ Luyện riêng (20 câu)', 'Nghe từ, chọn nghĩa']] },
  chu: { learn: 'câu 🔤 chọn đúng chữ khi học bài', what: 'Nhận ra đúng cách viết giữa các chữ gần giống (thiếu chữ, đảo chữ, từ na ná).', ex: w => [`${w.pic || ''} ${w.vi} → chọn: <b>${w.w}</b> / ${lookalike(w, 2).join(' / ')}`],
    tasks: [['p', '⚡ Luyện riêng (20 câu)', 'Nhìn nghĩa, chọn đúng cách viết']] },
  nhora: { learn: 'câu 🔤 chọn đúng chữ và ✍️ gõ từ khi học bài', what: 'Nhìn nghĩa tiếng Việt mà nhớ ra từ tiếng Anh (chọn hoặc gõ).', ex: w => [`${w.pic || ''} ${w.vi} → <b>${w.w}</b>`],
    tasks: [['p', '⚡ Luyện riêng (20 câu)', 'Nhìn nghĩa, chọn hoặc gõ từ']] },
  noi: { learn: 'nút 🎤 trên thẻ từ và bước 🗣 nói ra từ cuối bài học', what: 'Nhìn nghĩa, tự nói ra từ; máy chép lời ra đúng từ là đạt. Không chấm độ chuẩn của âm (phần 👄 Phát âm). Cần Safari trên iPhone.', ex: w => [`${w.pic || ''} ${w.vi} → 🎤 nói: <b>${w.w}</b> → máy chép: "${w.w}" ✅`],
    tasks: [['noi', '🗣 Nói ra từ (10 từ)', 'Không cần tải gì; mở bằng Safari']] },
  viet: { learn: 'câu ✍️ gõ từ (Pre-A1) hoặc 🧩 gõ từ vào câu (A1 trở lên) khi học bài', what: 'Tự gõ đúng chính tả, không có phương án chọn. Viết câu, đoạn là phần ✍️ Viết.', ex: w => [`${w.pic || ''} ${w.vi} → gõ: <b>${w.w}</b>`],
    tasks: [['p', '⚡ Luyện riêng (20 câu)', 'Nhìn nghĩa, gõ từ']] },
  cum: { learn: 'dòng 🔗 cụm hay dùng trên thẻ và câu chọn cụm đúng khi học bài', what: 'Biết từ hay đi với từ nào (make a cake, không phải do a cake).', ex: w => [w.col ? `Cụm nào đúng? <b>${w.col.ok}</b> / ${w.col.bad[0]}` : ''],
    tasks: [['p', '⚡ Luyện riêng (20 câu)', 'Chọn cụm từ đúng']] },
  bqt: { learn: 'dòng 🔀 dạng bất quy tắc trên thẻ và câu chọn dạng đúng khi học bài', what: 'Nhận ra dạng riêng của từ (went, children, better), không bị lừa bởi dạng theo quy tắc (goed, childs).', ex: w => [w.irr ? `${w.irr.f[0][0]} của "${w.w}"? <b>${w.irr.f[0][1][0]}</b> / …` : ''],
    tasks: [['p', '⚡ Luyện riêng (20 câu)', 'Chọn dạng bất quy tắc đúng']] },
  dung: { learn: 'câu ví dụ trên thẻ và câu 🧩 gõ từ vào câu khi học bài', what: 'Tự điền đúng từ vào chỗ trống trong câu (gõ, không chọn).', ex: w => [`${w.cloze ? w.cloze.s : ''} → gõ: <b>${w.cloze ? w.cloze.a : w.w}</b>`],
    tasks: [['p', '⚡ Luyện riêng (20 câu)', 'Gõ từ còn thiếu trong câu']] },
  lienq: { learn: 'dòng ↔️ cùng / trái nghĩa trên thẻ và câu chọn từ liên quan khi học bài', what: 'Biết từ cùng nghĩa hoặc trái nghĩa (big ↔ small, start = begin).', ex: w => [w.rel ? relLine(w).replace('<br>', '') : ''],
    tasks: [['p', '⚡ Luyện riêng (20 câu)', 'Chọn từ cùng / trái nghĩa']] },
  nghia2: { learn: 'dòng 🎭 nghĩa thứ hai trên thẻ và câu chọn nghĩa trong câu khi học bài', what: 'Hiểu nghĩa thứ hai hay gặp của từ qua câu (a cold = cảm lạnh, không phải lạnh).', ex: w => [w.s2 ? `${w.s2.ex} → <b>${w.s2.vi}</b>` : ''],
    tasks: [['p', '⚡ Luyện riêng (20 câu)', 'Đọc câu, chọn nghĩa của từ in đậm']] },
  cumtu: { learn: 'dòng 🔗 cụm hay dùng trên thẻ và câu 🔗 gõ từ trong cụm khi học bài', what: 'Tự nhớ ra từ đi kèm trong cụm (gõ, không chọn): ___ a decision → make.', ex: w => [w.col ? `${w.col.ok.replace(colPart(w) || '', '___')} → gõ: <b>${colPart(w)}</b>` : ''],
    tasks: [['p', '⚡ Luyện riêng (20 câu)', 'Gõ từ còn thiếu trong cụm']] },
  mau: { learn: 'dòng 🧱 mẫu câu trên thẻ và câu chọn mẫu đúng khi học bài', what: 'Biết từ đi với giới từ / dạng động từ nào: interested in, enjoy + V-ing, want + to V.', ex: w => [w.pat ? `${w.pat.s} → <b>${w.pat.a}</b>` : ''],
    tasks: [['p', '⚡ Luyện riêng (20 câu)', 'Chọn từ đúng mẫu câu']] },
  ho: { learn: 'dòng 🔧 họ từ trên thẻ và câu chọn từ cùng họ khi học bài', what: 'Nhận ra các từ cùng gốc: happy → happiness, unhappy, happily.', ex: w => [w.fam ? `${w.w} → <b>${w.fam.join(', ')}</b>` : ''],
    tasks: [['p', '⚡ Luyện riêng (20 câu)', 'Chọn từ cùng họ']] },
  taodang: { learn: 'câu 🛠 gõ dạng từ khi học bài', what: 'Tự gõ đúng từ cùng họ cho vừa câu (như FCE phần 3): She sang ___ (BEAUTY) → beautifully.', ex: w => [w.famQ ? `${w.famQ.s} (${w.w.toUpperCase()}) → <b>${w.famQ.a}</b>` : ''],
    tasks: [['p', '⚡ Luyện riêng (20 câu)', 'Gõ dạng từ đúng']] },
  sacthai: { learn: 'dòng 🎚 trên thẻ và câu chọn từ trang trọng khi học bài', what: 'Biết từ nào trang trọng, từ nào thân mật: buy / purchase, kids / children.', ex: w => [w.reg ? `${w.w} / ${w.reg.p} → trang trọng: <b>${w.reg.f ? w.w : w.reg.p}</b>` : ''],
    tasks: [['p', '⚡ Luyện riêng (20 câu)', 'Chọn từ trang trọng hơn']] },
  thay: { learn: 'dòng ↔️ cùng nghĩa trên thẻ và câu 🔄 gõ từ cùng nghĩa khi học bài', what: 'Tự thay từ bằng từ khác cùng nghĩa, hợp câu (không chọn).', ex: w => [w.rel && w.rel.syn.length ? `${w.ex} → thay “${w.w}” bằng <b>${w.rel.syn[0]}</b>` : ''],
    tasks: [['p', '⚡ Luyện riêng (20 câu)', 'Gõ từ cùng nghĩa']] },
  vanphong: { learn: 'câu 🎩 chọn văn phong khi học bài', what: 'Chọn từ hợp hoàn cảnh: thư gửi công ty khác tin nhắn bạn bè.', ex: w => [w.reg ? `📧 Thư công việc → <b>${w.reg.f ? w.w : w.reg.p}</b>; 💬 nhắn bạn → <b>${w.reg.f ? w.reg.p : w.w}</b>` : ''],
    tasks: [['p', '⚡ Luyện riêng (20 câu)', 'Chọn từ hợp hoàn cảnh']] },
  tucthi: { learn: 'câu ⚡ nhận ra nhanh khi học bài', what: 'Hiểu từ ngay, không dịch trong đầu: chọn đúng nghĩa dưới 3 giây.', ex: w => [`<b>${w.w}</b> → ${w.vi} (dưới 3 giây)`],
    tasks: [['p', '⚡ Luyện riêng (20 câu)', 'Chọn nghĩa thật nhanh']] },
  thanhngu: { learn: 'dòng 🌫 thành ngữ trên thẻ và câu chọn nghĩa thành ngữ khi học bài', what: 'Hiểu thành ngữ, nghĩa bóng của từ: a piece of cake = dễ ợt.', ex: w => [w.idi ? `<b>${w.idi.p}</b> = ${w.idi.vi}` : ''],
    tasks: [['p', '⚡ Luyện riêng (20 câu)', 'Chọn nghĩa thành ngữ']] },
  bqt2: { learn: 'câu ✏️ gõ dạng bất quy tắc khi học bài (A2)', what: 'Tự gõ ra dạng bất quy tắc (go → went, gone), không có phương án chọn.', ex: w => [w.irr ? `${w.irr.f[0][0]} của "${w.w}" → gõ: <b>${w.irr.f[0][1][0]}</b>` : ''],
    tasks: [['p', '⚡ Luyện riêng (20 câu)', 'Gõ dạng bất quy tắc']] },
};
function dimView(k) {
  window.CUR = { view: 'mat-' + k };
  const now = Date.now(), I = DIM_INFO[k], l = VREQ_BY[k][1], p = parts(S, now), WS = gateWords().filter(w => wDims(w).includes(k));
  const lack = WS.filter(w => S.cards[w.id] && !heldDim(S.cards[w.id], k, now)), notT = lack.filter(w => taughtDay(S.cards[w.id], w, k) == null).length,
    early = lack.filter(w => { const td = taughtDay(S.cards[w.id], w, k); return td != null && dayOf(now) - td < MEM_DAYS; }).length;
  const ew = shuf(WS.filter(w => S.cards[w.id]))[0] || WS[0], L = VREQ_BY[k][2];
  $app.innerHTML = `${backRow('🔁 Nhớ')}<h1>${l}: ${p.dq[k]}%</h1>${bar(p.dq[k], GATE_MEM, 'var(--good)')}
    <p class="mute">${p.dim[k]}/${p.Tk[k]} từ (cả cấp trước; chỉ từ có yêu cầu này) đã giữ · cần ${GATE_MEM}%. Yêu cầu từ cấp ${LVN[L]}. Còn thiếu: ${lack.length} từ${early ? ` (${early} từ mới học, từ mai mới tính)` : ''}${notT ? ` · ${notT} từ cấp trước chưa học ⬆️ Nâng cấp` : ''}.</p>
    <div class="box"><b>Yêu cầu này đo gì</b><p style="margin:4px 0">${I.what}</p>
      ${ew ? `<p class="mute" style="margin:4px 0">Ví dụ câu:</p>${I.ex(ew).filter(Boolean).map(x => `<p style="margin:2px 0">• ${x}</p>`).join('')}` : ''}
      ${I.learn ? `<p style="margin:8px 0 0"><b>Học ở đâu:</b> ${esc(I.learn)}</p>` : ''}
      <p class="mute" style="margin:6px 0 0">Tính khi làm đúng ở một ngày sau ngày học. Giữ khi lần gần nhất đúng và máy ước khả năng nhớ còn ≥ 80%; sai hoặc lâu không ôn thì mất, ôn lại để lấy lại.</p></div>
    <h2>Bài tính vào yêu cầu này</h2>
    ${I.tasks.map(([m, t, sub], i) => `<button class="opt ${i === 0 ? 'pri' : ''}" data-m="${m}"><b>${t}</b><br><span style="font-size:14px;opacity:.85">${sub}</span></button>`).join('')}
    ${lack.length ? `<h2>Từ còn thiếu (${lack.length})</h2><p>${lack.slice(0, 60).map(w => esc(w.w)).join(' · ')}${lack.length > 60 ? ' …' : ''}</p>` : ''}`;
  $app.onclick = e => { if (e.target.closest('[data-a="home"]')) return home(); const b = e.target.closest('[data-m]'); if (!b) return;
    const m = b.dataset.m; if (m === 'p') { if (!Object.keys(S.cards).length) return toast('Học 1 unit trước.'); return practice(k); }
    ({ read: readTask, hear: hearTask, dict: dictTask, noi: () => noiTask('noi') })[m](); };
  window.scrollTo(0, 0);
}

// ---------- chọn kiểu luyện ----------
function practiceMenu() {
  window.CUR = { view: 'luyen-tap' };
  const p = parts(S, Date.now()), ds = dimsAt(), low = ds.map(([k]) => k).sort((a, b) => p.dq[a] - p.dq[b])[0];
  const rec = low === 'noi' ? 'noi' : 'word';
  const opt = (k, t, sub) => `<button class="opt ${rec === k ? 'pri' : ''}" data-m="${k}"><b>${t}</b>${rec === k ? ' · nên làm' : ''}<br><span style="font-size:14px;opacity:.85">${sub}</span></button>`;
  $app.innerHTML = `${backRow('🏋️ Luyện tập')}<h1>🏋️ Luyện tập</h1>
    <p class="mute">Yêu cầu đang thấp nhất: <b>${VREQ_BY[low][1]} ${p.dq[low]}%</b>. Bấm một yêu cầu ở trang 📚 Từ vựng để luyện riêng.</p>
    ${opt('word', '⚡ Từng từ (20 câu)', `${ds.filter(d => d[0] !== 'noi').length} yêu cầu của ${LVN[curLevel()]}: máy hỏi vào yêu cầu còn thiếu của từng từ`)}
    ${opt('noi', '🗣 Nói ra từ (10 từ)', 'Nhìn nghĩa, nói từ tiếng Anh; máy chép ra đúng từ. Cần Safari')}
    <p class="mute">Đọc bài, nghe câu, nghe chép, chấm phát âm: ở các phần 📰 Đọc · 🎧 Nghe · 👄 Phát âm.</p>`;
  $app.onclick = e => { if (e.target.closest('[data-a="home"]')) return home(); const b = e.target.closest('[data-m]'); if (!b) return;
    ({ word: () => practice(), noi: () => noiTask('noi') })[b.dataset.m](); };
}
const doneBox = (h, body, again) => { $app.innerHTML = `<div class="box"><b>${h}</b>${body}</div><button class="pri" data-a="again">Làm tiếp</button><button data-a="home">← Về</button>`;
  $app.onclick = e => { if (e.target.closest('[data-a="home"]')) goBack(); if (e.target.closest('[data-a="again"]')) again(); }; };
const dimNow = () => { const p = parts(S, Date.now()); return dimsAt().map(([k, l]) => `${l} ${p.dq[k]}%`).join(' · '); };

// ---------- 📰 Đọc bài ----------
function readTask() {
  // bài đọc theo unit gốc (READS, a1.json): mở khi đã học ≥ 70% từ của unit gốc (bài học đã xếp lại theo cấp, 23/10/2026)
  const now = Date.now(), cand = READS.filter(r => r.words.filter(id => S.cards[id]).length >= 0.7 * r.words.length);
  if (!cand.length) { toast('Chưa có bài đọc: học thêm vài bài 📚 Từ vựng để mở.'); return goBack(); }
  const score = r => r.qs.reduce((n, q) => n + wordsIn(q.why).filter(x => !heldDim(S.cards[x.w.id], 'nghia', now)).length, 0);
  const R = shuf(cand).sort((a, b) => score(b) - score(a))[0], u = { id: R.src }, got = new Map();
  let i = 0, ok = 0;
  const show = () => {
    if (i >= R.qs.length) return doneBox(`Xong bài đọc: ${ok}/${R.qs.length} câu đúng`,
      `<p class="mute">Từ đã học gặp lại (${got.size}): ${chipsOf([...got.values()], 'on') || '(không có)'}</p><p class="mute">Bài dịch: ${esc(R.vi)}</p>`, readTask);
    const q = R.qs[i], opts = shuf([q.a, ...q.w]);
    window.CUR = { view: 'doc-bai', unit: u.id, item: 'r:' + u.id + ':' + i, prompt: q.q };
    $app.innerHTML = `${backRow(`📰 Đọc · ${esc(R.tvi || R.title)} · câu ${i + 1}/${R.qs.length}`)}
      <div class="box"><b>${esc(R.title)}</b><p class="tdtap" style="font-size:18px;line-height:1.6;margin:8px 0 0">${esc(R.text)}</p></div>
      <p class="q">${esc(q.q)}</p>${opts.map((o, k) => `<button class="opt" data-k="${k}">${esc(o)}</button>`).join('')}<div id="fb"></div>`;
    let done = false;
    $app.onclick = e => {
      if (e.target.closest('[data-a="home"]')) return goBack();
      if (e.target.closest('[data-a="go"]')) { i++; return show(); }
      const b = e.target.closest('[data-k]'); if (!b || done) return; done = true;
      const good = opts[+b.dataset.k] === q.a, ev = wordsIn(q.why).map(x => x.w);
      $app.querySelectorAll('[data-k]').forEach(x => { if (opts[+x.dataset.k] === q.a) x.classList.add('ok'); else if (x === b) x.classList.add('no'); });
      if (good) { ok++; credit(ev, 'read', true); ev.forEach(w => got.set(w.id, w)); }
      document.getElementById('fb').innerHTML = `<div class="box">${good ? '✅ Đúng.' : '❌ Chưa đúng.'} Bằng chứng: ${esc(q.why)}
        ${good && ev.length ? `<p class="mute">Từ đã học trong câu: ${chipsOf(ev, 'on')}</p>` : ''}</div><button class="pri" data-a="go">Tiếp →</button>`;
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
  const T = pickTargets('nghe', 8); if (!T.length) return goBack();
  const got = new Map(); let i = 0, ok = 0;
  const show = () => {
    if (i >= T.length) return doneBox(`Xong nghe câu: ${ok}/${T.length} câu đúng`, `<p class="mute">Từ đã học gặp lại (${got.size}): ${chipsOf([...got.values()], 'on') || '(không có)'}</p>`, hearTask);
    const w = T[i], others = shuf(WORDS.filter(x => x.id !== w.id && x.exVi !== w.exVi)).slice(0, 2), opts = shuf([w.exVi, ...others.map(x => x.exVi)]);
    window.CUR = { view: 'nghe-cau', item: 'h:' + w.id, prompt: w.ex };
    $app.innerHTML = `${backRow(`🎧 Nghe câu ${i + 1}/${T.length}`)}<p class="q">🎧 Nghe rồi chọn nghĩa của cả câu</p>
      <button class="chip" data-say="${w.id}" data-ex="1">🔊 Nghe lại</button>
      ${opts.map((o, k) => `<button class="opt" data-k="${k}">${esc(o)}</button>`).join('')}<div id="fb"></div>`;
    speak(w.ex);
    let done = false;
    $app.onclick = e => {
      if (e.target.closest('[data-a="home"]')) return goBack();
      if (e.target.closest('[data-a="go"]')) { i++; return show(); }
      const b = e.target.closest('[data-k]'); if (!b || done) return; done = true;
      const good = opts[+b.dataset.k] === w.exVi, ev = [...new Map([w, ...wordsIn(w.ex).map(x => x.w)].map(x => [x.id, x])).values()];
      $app.querySelectorAll('[data-k]').forEach(x => { if (opts[+x.dataset.k] === w.exVi) x.classList.add('ok'); else if (x === b) x.classList.add('no'); });
      if (good) { ok++; credit(ev, 'hear', true); ev.forEach(x => got.set(x.id, x)); } else credit([w], 'hear', false);
      document.getElementById('fb').innerHTML = `<div class="box">${good ? '✅ Đúng.' : '❌ Chưa đúng.'} Câu nghe: <b>${esc(w.ex)}</b>
        ${good ? `<p class="mute">Từ đã học trong câu: ${chipsOf(ev, 'on')}</p>` : `<p class="mute">Từ cần ôn: ${esc(w.w)} = ${esc(w.vi)}</p>`}</div><button class="pri" data-a="go">Tiếp →</button>`;
    };
  };
  show();
}

// ---------- ✍️ Nghe chép ----------
function dictTask() {
  const T = pickTargets('viet', 5); if (!T.length) return goBack();
  const got = new Map(), miss = new Map(); let i = 0;
  const show = () => {
    if (i >= T.length) return doneBox(`Xong nghe chép ${T.length} câu`,
      `<p class="mute">Chép đúng (${got.size} từ): ${chipsOf([...got.values()], 'on') || '(không có)'}</p>${miss.size ? `<p class="mute">Chép sai / thiếu: ${chipsOf([...miss.values()])}</p>` : ''}`, dictTask);
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
        ${good.length ? `<p class="mute">Chép đúng: ${chipsOf(good, 'on')}</p>` : ''}${bad.length ? `<p class="mute">Sai / thiếu: ${chipsOf(bad)}</p>` : ''}</div><button class="pri" data-a="go">Tiếp →</button>`; };
    $app.onclick = e => { if (e.target.closest('[data-a="home"]')) return goBack(); if (e.target.closest('[data-a="go"]')) { i++; show(); } };
  };
  show();
}
