
// ---------- v35 mỗi dạng bài một cách hiện + một bài tập riêng (người sáng lập: "phân ra theo dạng bài, mỗi dạng cần thiết kế riêng") ----------
// 🗣 Hội thoại: bong bóng, 🎭 Nhập vai · 📢 Bài nói: khung loa phát, 🎧 Nghe – chép · ✉️ Văn bản: như thư thật, 🧩 Điền lại ô trống
// 📄 Đọc hiểu: tin nhắn / lịch / thẻ văn bản, 🔎 Tìm chỗ chứa đáp án · 💬 Hỏi – đáp: thẻ cặp câu, ⚡ Phản xạ
const KIND = () => { const d = (BAIS[BAI_I].meta || {}).dang || ''; return d.includes('Hội thoại') ? 'hoi' : d.includes('Bài nói') ? 'noi' : d.includes('Văn bản') ? 'vb' : d.includes('Đọc hiểu') ? 'dh' : d.includes('Hỏi') ? 'hd' : 'hoi'; };
const KINDS = [['hoi', '🗣', 'Hội thoại', 'Part 3'], ['noi', '📢', 'Bài nói', 'Part 4'], ['vb', '✉️', 'Văn bản', 'Part 6'], ['dh', '📄', 'Đọc hiểu', 'Part 7'], ['hd', '💬', 'Hỏi – đáp', 'Part 2']];
const kindOf = dang => (KINDS.find(k => dang.includes(k[2])) || KINDS[0])[0];
const EX_DANG = { hoi: ['nhapvai', '🎭 Nhập vai', 'Chọn vai, app đọc lời người kia, bạn nói lời của mình'], noi: ['ngheche', '🎧 Nghe – chép', 'Nghe từng câu, không nhìn chữ, nói hoặc gõ lại'],
  vb: ['dienvb', '🧩 Điền lại ô trống', 'Các chỗ trống như đề Part 6, đọc cả văn bản rồi chọn'], dh: ['timdap', '🔎 Tìm chỗ chứa đáp án', 'Đọc câu hỏi của đề, chạm vào câu chứa đáp án'],
  hd: ['phanxa', '⚡ Phản xạ', 'Nghe câu hỏi, chọn câu đáp đúng trong 3 giây'] };
const ORDERF = () => ['hoc', 'duago', 'duavn', EX_DANG[KIND()][0], 'hieu', 'de', 'dung'];
const KIND_NOTE = { noi: 'Một người nói', vb: 'Văn bản viết', dh: 'Văn bản đọc', hd: '10 cặp hỏi – đáp' };
// so câu nói / gõ với câu đúng: tỉ lệ từ đúng theo thứ tự (dãy con chung dài nhất), bỏ dấu câu, viết tắt = nói đủ
function simPct(want, got) { const A = words(want).map(dk).filter(Boolean), Bt = String(got).split(/\s+/).map(dk).filter(Boolean); if (!A.length) return 100;
  const d = Array.from({ length: A.length + 1 }, () => new Array(Bt.length + 1).fill(0));
  for (let i = 1; i <= A.length; i++) for (let j = 1; j <= Bt.length; j++) d[i][j] = (dkAlt(A[i - 1]).includes(Bt[j - 1]) || A[i - 1] === Bt[j - 1]) ? d[i - 1][j - 1] + 1 : Math.max(d[i - 1][j], d[i][j - 1]);
  return Math.round(d[A.length][Bt.length] / A.length * 100); }
// ----- cách hiện bài theo dạng (Nghe + đọc) -----
const nsOpen = i => `data-p="${i}"`;
function bodyHtml() { const k = KIND(), M = BAIS[BAI_I].meta || {};
  const vi = (l, i) => `<span class="vi" hidden id="vi${i}">${esc(l[2])}</span>`;
  if (k === 'hoi') return `<div class="card">${L.map((l, i) => lnHtml(i, `${lineTxt(i)}${vi(l, i)}`, 1)).join('')}</div>`;
  if (k === 'noi') return `<div class="card noibox"><div class="row noihd"><span class="noiic">📢</span><span><b>${esc(WHO.N ? WHO.N[0] : 'Người nói')}</b><br><span class="sm mute">${esc(M.de || '')}</span></span></div>
    <div class="noitext">${L.map((l, i) => `<span class="ns" role="button" tabindex="0" ${nsOpen(i)}>${lineTxt(i)}${vi(l, i)}</span>`).join(' ')}</div></div>`;
  if (k === 'hd') return `<div class="opts">${L.map((l, i) => i % 2 ? '' : `<div class="card qa"><button class="say qaq" ${nsOpen(i)}><span class="sm mute">❓ Câu ${i / 2 + 1}</span>${lineTxt(i)}${vi(l, i)}</button>
    ${L[i + 1] ? `<button class="say qaa" ${nsOpen(i + 1)}><span class="sm mute">↪ Đáp</span>${lineTxt(i + 1)}${vi(L[i + 1], i + 1)}</button>` : ''}</div>`).join('')}</div>`;
  const gaps = k === 'vb' ? EXQ.filter(q => /chỗ trống/i.test(q.q)).map(q => q.o[0]) : [];
  const mark = (t, i) => { if (anyLay()) return lineTxt(i); let h = esc(t); for (const g of gaps) { const e = esc(g); if (h.includes(e)) { h = h.replace(e, `<mark title="chỗ trống của đề">${e}</mark>`); } } return `<span>${h}</span>`; };
  if (k === 'vb') { const hd = String(M.title || '').split(' · ').filter(Boolean);
    return `<div class="card doc">${hd.length ? `<div class="dochd">${hd.map(x => `<div>${esc(x)}</div>`).join('')}</div>` : ''}<div class="docbody">${L.map((l, i) => `<p class="dl" role="button" tabindex="0" ${nsOpen(i)}>${mark(l[1], i)}${vi(l, i)}</p>`).join('')}</div>
      ${gaps.length ? '<p class="sm mute">Chữ tô màu là chỗ trống của đề Part 6.</p>' : ''}</div>`; }
  // 📄 đọc hiểu: tách văn bản (1) (2) …; tin nhắn có tên + giờ; dòng lịch "giờ — việc" thành bảng
  const docs = []; let cur = null;
  L.forEach((l, i) => { const t = l[1], h = t.match(/^\((\d)\)\s*(.*)$/); if (h || !cur) { cur = { t: h ? h[2] : (String(M.title || '').split(' · ')[0] || ''), items: [] }; docs.push(cur); if (h) return; } cur.items.push(i); });
  const item = i => { const t = L[i][1], c = t.match(/^([A-Z][\w.'’ -]{1,30}) \((\d{1,2}:\d{2} [AP]\.M\.)\):\s*(.*)$/), s = t.match(/^(\d{1,2}:\d{2}(?: [AP]\.M\.)?)\s+—\s+(.*)$/);
    if (c) return `<div class="msg" role="button" tabindex="0" ${nsOpen(i)}><span class="sm"><b>${esc(c[1])}</b> <span class="mute">${esc(c[2])}</span></span><span>${anyLay() ? lineTxt(i) : esc(c[3])}</span>${vi(L[i], i)}</div>`;
    if (s) return `<div class="sch" role="button" tabindex="0" ${nsOpen(i)}><b>${esc(s[1])}</b><span>${anyLay() ? lineTxt(i) : esc(s[2])}${vi(L[i], i)}</span></div>`;
    return `<p class="dl" role="button" tabindex="0" ${nsOpen(i)}>${lineTxt(i)}${vi(L[i], i)}</p>`; };
  return docs.map((d, n) => `<div class="card doc">${d.t ? `<div class="dochd"><span class="tag">${docs.length > 1 ? `(${n + 1}) ` : ''}</span>${esc(d.t)}</div>` : ''}<div class="docbody">${d.items.map(item).join('')}</div></div>`).join(''); }
// ----- 🎭 Nhập vai (hội thoại) -----
function nhapvai() { const roles = [...new Set(L.map(l => l[0]))]; let me = null, i = 0, miss = 0, fails = 0;
  const pick = () => { app.innerHTML = `${head('Chọn vai của bạn. App đọc lời người kia, tới lượt bạn thì nói (bàn phím 🎤) hoặc gõ lời của mình.')}
    <div class="opts">${roles.map(r => `<button class="opt" data-r="${r}"><b>${esc(WHO[r] ? WHO[r][0] : r)}</b> <span class="sm mute">· ${L.filter(l => l[0] === r).length} câu</span></button>`).join('')}</div>`;
    app.querySelectorAll('[data-r]').forEach(b => b.onclick = () => { me = b.dataset.r; step(); }); };
  const step = () => { if (i >= L.length) return finish(); const l = L[i];
    const past = L.slice(0, i).map((x, j) => `<p class="sm ${x[0] === me ? 'okt' : 'mute'}"><b>${esc(WHO[x[0]] ? WHO[x[0]][0] : x[0])}:</b> ${esc(x[1])}</p>`).join('');
    if (l[0] !== me) { app.innerHTML = `${head()}<div class="card nvlog">${past}<p><b>${esc(WHO[l[0]][0])}:</b> ${esc(l[1])}</p></div><p class="sm mute">🔊 Đang đọc lời ${esc(WHO[l[0]][0])}…</p><button class="sec" id="nx">Tiếp ›</button>`;
      let gone = false; const go = () => { if (gone) return; gone = true; i++; step(); }; $('#nx').onclick = go; play(i, () => setTimeout(go, 300)); return; }
    const hint = words(l[1]).map(w => { const c = w.replace(/[^A-Za-z0-9'’]/g, ''); return c ? c[0] + '…' : w; }).join(' ');
    app.innerHTML = `${head()}<div class="card nvlog">${past}</div><div class="card"><p class="tag">Lượt bạn · ${esc(WHO[me][0])}</p><p>${esc(l[2])}</p><p class="sm mute" id="nvh" hidden>Gợi ý: ${esc(hint)}</p>
      <div class="inrow"><textarea id="nvi" autocomplete="off" autocorrect="off" spellcheck="false" placeholder="Nói (🎤) hoặc gõ lời tiếng Anh"></textarea><button class="pri" id="ck">Kiểm tra</button></div>
      <div class="row"><button class="link" id="hn">💡 Gợi ý chữ đầu</button><button class="link" id="sk">Bỏ qua, xem lời</button></div><div id="fb"></div></div>`;
    const t = $('#nvi'); t.focus(); $('#hn').onclick = () => { $('#nvh').hidden = false; };
    const ok = () => { $('#fb').innerHTML = `<div class="fb ok">✓ ${esc(l[1])}</div>`; play(i, () => { i++; fails = 0; step(); }); };
    $('#ck').onclick = () => { const p = simPct(l[1], t.value); if (p >= 80) ok(); else { fails++; miss++; $('#fb').innerHTML = `<div class="fb no">Đúng ${p}% số từ, cần 80%. Thử lại${fails >= 2 ? ', hoặc bấm Gợi ý' : ''}.</div><p class="diff">${diff(l[1], t.value).html}</p>`; } };
    $('#sk').onclick = () => { miss++; $('#fb').innerHTML = `<div class="fb no">${esc(l[1])}</div><button class="pri" id="nx2">Tiếp ›</button>`; play(i); $('#nx2').onclick = () => { i++; step(); }; }; };
  const finish = () => { const n = L.filter(l => l[0] === me).length; app.innerHTML = `${head()}<div class="card" style="text-align:center;align-items:center"><p class="tag">Xong vai ${esc(WHO[me][0])}</p><p class="big">${Math.max(0, n - miss)}/${n}</p><p class="sm mute">câu nói đúng ngay</p></div>
    <div class="opts">${roles.filter(r => r !== me).map(r => `<button class="sec" data-r2="${r}">🎭 Đổi sang vai ${esc(WHO[r][0])}</button>`).join('')}</div><button class="pri" id="nx">Xong ›</button>`;
    app.querySelectorAll('[data-r2]').forEach(b => b.onclick = () => { me = b.dataset.r2; i = 0; miss = 0; step(); }); $('#nx').onclick = () => fin('nhapvai', [Math.max(0, n - miss), n]); };
  pick(); }
// ----- 🎧 Nghe – chép (bài nói) -----
function ngheche() { let i = 0, first = 0, tries = 0;
  const step = () => { if (i >= L.length) return app.innerHTML = `${head()}<div class="card" style="text-align:center;align-items:center"><p class="tag">Xong cả bài</p><p class="big">${first}/${L.length}</p><p class="sm mute">câu chép đúng ngay lần đầu</p></div><button class="pri" id="nx">Xong ›</button>`, $('#nx').onclick = () => fin('ngheche', [first, L.length]);
    app.innerHTML = `${head('Nghe câu, không nhìn chữ. Nói (🎤) hoặc gõ lại đúng câu vừa nghe. Đúng từ 80% số từ là qua.')}<p class="tag">Câu ${i + 1}/${L.length}</p><div class="bar"><i style="width:${i / L.length * 100}%"></i></div>
      <div class="row"><button class="sec" id="pl">🔊 Nghe</button><button class="sec" id="sl">🐢 Nghe chậm</button><span class="sm mute" id="nc">chưa nghe</span></div>
      <div class="inrow"><textarea id="ci" autocomplete="off" autocorrect="off" spellcheck="false" placeholder="Câu vừa nghe"></textarea><button class="pri" id="ck">Kiểm tra</button></div><div id="fb"></div>`;
    let n = 0; const t = $('#ci'); const hear = r => { n++; $('#nc').textContent = `đã nghe ${n} lần`; if (r) { try { const u = new SpeechSynthesisUtterance(L[i][1]); u.lang = 'en-US'; u.rate = 0.6; speechSynthesis.cancel(); speechSynthesis.speak(u); } catch (e) {} } else play(i); };
    $('#pl').onclick = () => hear(0); $('#sl').onclick = () => hear(1); hear(0);
    $('#ck').onclick = () => { const p = simPct(L[i][1], t.value); tries++;
      if (p >= 80) { if (tries === 1) first++; $('#fb').innerHTML = `<div class="fb ok">✓ ${p}% · ${esc(L[i][1])}<br><span class="sm">${esc(L[i][2])}</span></div><button class="pri" id="nx">Câu tiếp ›</button>`; $('#nx').onclick = () => { i++; tries = 0; step(); }; }
      else $('#fb').innerHTML = `<div class="fb no">Đúng ${p}% số từ. Nghe lại rồi sửa.</div><p class="diff">${diff(L[i][1], t.value).html}</p><button class="link" id="rv">Xem đáp án</button>`, $('#rv').onclick = () => { $('#fb').innerHTML += `<div class="fb">${esc(L[i][1])}</div><button class="pri" id="nx">Câu tiếp ›</button>`; $('#nx').onclick = () => { i++; tries = 0; step(); }; }; }; };
  step(); }
// ----- 🧩 Điền lại ô trống (văn bản Part 6) -----
function dienvb() { const G = EXQ.filter(q => /chỗ trống/i.test(q.q)); let k = 0, first = 0;
  const body = (gi, show) => L.map((l, i) => { let h = esc(l[1]); G.forEach((q, n) => { const e = esc(q.o[0]); if (h.includes(e)) h = h.replace(e, n === gi && !show ? `<span class="gap">(${n + 1}) ?</span>` : n < gi || show ? `<mark>${e}</mark>` : e); }); return `<p class="dl">${h}</p>`; }).join('');
  const step = () => { if (k >= G.length) return app.innerHTML = `${head()}<div class="card" style="text-align:center;align-items:center"><p class="tag">Xong</p><p class="big">${first}/${G.length}</p><p class="sm mute">chỗ trống đúng ngay</p></div><button class="pri" id="nx">Xong ›</button>`, $('#nx').onclick = () => fin('dienvb', [first, G.length]);
    const q = G[k], ord = shuf(q.o.map((_, j) => j)); let tried = 0;
    app.innerHTML = `${head('Đọc cả văn bản, chọn từ / câu điền vào chỗ trống đang hỏi, như Part 6.')}<p class="tag">Chỗ trống ${k + 1}/${G.length}</p><div class="card doc"><div class="docbody docsm">${body(k)}</div></div>
      <div class="opts">${ord.map(j => `<button class="opt" data-j="${j}">${esc(q.o[j])}</button>`).join('')}</div><div id="fb"></div>`;
    const g = app.querySelector('.gap'); if (g) g.scrollIntoView({ block: 'center' });
    app.querySelectorAll('[data-j]').forEach(b => b.onclick = () => { const ok = +b.dataset.j === 0; tried++; b.classList.add(ok ? 'ok' : 'no');
      if (!ok) { b.disabled = true; $('#fb').innerHTML = `<div class="fb no">Chưa đúng. Đọc câu trước và sau chỗ trống rồi chọn lại.</div>`; return; }
      if (tried === 1) first++; app.querySelectorAll('[data-j]').forEach(x => x.disabled = true);
      $('#fb').innerHTML = `<div class="fb ok">✓ ${esc(q.vi || '')}</div><button class="pri" id="nx">${k + 1 < G.length ? 'Chỗ tiếp ›' : 'Xong ›'}</button>`; $('#nx').onclick = () => { k++; step(); }; }); };
  if (!G.length) { app.innerHTML = `${head()}<p>Bài này không có chỗ trống.</p>`; return; } step(); }
// ----- 🔎 Tìm chỗ chứa đáp án (đọc hiểu Part 7) -----
function timdap() { const M = BAIS[BAI_I].meta || {}, ev = M.evl || [], Q = EXQ.map((q, n) => ({ q, l: ev[n] })).filter(x => x.l >= 0); let k = 0, first = 0;
  const step = () => { if (k >= Q.length) return app.innerHTML = `${head()}<div class="card" style="text-align:center;align-items:center"><p class="tag">Xong</p><p class="big">${first}/${Q.length}</p><p class="sm mute">câu tìm đúng ngay</p></div><button class="pri" id="nx">Xong ›</button>`, $('#nx').onclick = () => fin('timdap', [first, Q.length]);
    const { q, l } = Q[k]; let tried = 0;
    app.innerHTML = `${head('Đọc câu hỏi, chạm vào câu trong bài chứa đáp án. Chưa cần chọn đáp án.')}<p class="tag">Câu ${k + 1}/${Q.length}</p><div class="card"><b>${esc(q.q)}</b></div>
      <div class="card doc"><div class="docbody docsm">${L.map((x, i) => /^\(\d\)/.test(x[1]) ? `<p class="tag">${esc(x[1])}</p>` : `<button class="tline" data-l="${i}">${esc(x[1])}</button>`).join('')}</div></div><div id="fb"></div>`;
    app.querySelectorAll('[data-l]').forEach(b => b.onclick = () => { const i = +b.dataset.l; tried++;
      if (i !== l) { b.classList.add('no'); $('#fb').innerHTML = `<div class="fb no">Câu này chưa chứa đáp án. Tìm chữ khoá của câu hỏi trong bài.</div>`; if (tried >= 3) show(); return; }
      if (tried === 1) first++; show(); });
    const show = () => { const b = app.querySelector(`[data-l="${l}"]`); b.classList.add('ok'); app.querySelectorAll('[data-l]').forEach(x => x.disabled = true);
      $('#fb').innerHTML = `<div class="fb ok">📍 Câu chứa đáp án: “${esc(L[l][1])}”<br>Đáp án: <b>${esc(q.o[0])}</b><br><span class="sm">${esc(q.vi || '')}</span></div><p class="sm mute">Vị trí câu chứa đáp án do app đoán theo chữ trùng, có thể lệch.</p><button class="pri" id="nx">${k + 1 < Q.length ? 'Câu tiếp ›' : 'Xong ›'}</button>`;
      $('#nx').onclick = () => { k++; step(); }; b.scrollIntoView({ block: 'center' }); }; };
  if (!Q.length) { app.innerHTML = `${head()}<p>Bài này chưa có câu hỏi để tìm.</p>`; return; } step(); }
// ----- ⚡ Phản xạ (hỏi – đáp Part 2) -----
const PX_SEC = 3;
function phanxa() { const P2 = (BAIS[BAI_I].meta || {}).p2 || []; let k = 0, first = 0, T = 0;
  const step = () => { clearTimeout(T); if (k >= P2.length) return app.innerHTML = `${head()}<div class="card" style="text-align:center;align-items:center"><p class="tag">Xong</p><p class="big">${first}/${P2.length}</p><p class="sm mute">câu đáp đúng trong ${PX_SEC} giây</p></div><button class="sec" id="ag">↻ Chơi lại</button><button class="pri" id="nx">Xong ›</button>`, $('#ag').onclick = () => { k = 0; first = 0; step(); }, $('#nx').onclick = () => fin('phanxa', [first, P2.length]);
    const p = P2[k], ord = shuf(p.o.map((_, j) => j)); let done = false;
    app.innerHTML = `${head('Nghe câu hỏi (không hiện chữ), chọn câu đáp đúng trước khi hết giờ. Như Part 2: câu đáp đúng nhiều khi trả lời gián tiếp.')}<p class="tag">Câu ${k + 1}/${P2.length}</p>
      <div class="card"><button class="sec" id="pl">🔊 Nghe lại câu hỏi</button><div class="tbar"><i id="tb" style="width:100%"></i></div><p class="sm mute" id="ts">Đang đọc câu hỏi…</p></div>
      <div class="opts">${ord.map(j => `<button class="opt" data-j="${j}">${esc(p.o[j])}</button>`).join('')}</div><div id="fb"></div>`;
    const end = (j, late) => { if (done) return; done = true; clearTimeout(T); const ok = j === p.a; if (ok && !late) first++;
      app.querySelectorAll('[data-j]').forEach(x => { x.disabled = true; if (+x.dataset.j === p.a) x.classList.add('ok'); else if (+x.dataset.j === j) x.classList.add('no'); });
      $('#fb').innerHTML = `<div class="fb ${ok && !late ? 'ok' : 'no'}">${late ? '⏱ Hết giờ. ' : ok ? '✓ ' : '✗ '}❓ ${esc(p.q)}<br>↪ ${esc(p.o[p.a])}</div><button class="pri" id="nx">${k + 1 < P2.length ? 'Câu tiếp ›' : 'Xong ›'}</button>`; $('#nx').onclick = () => { k++; step(); }; };
    const timer = () => { $('#ts').textContent = `Chọn trong ${PX_SEC} giây`; const b = $('#tb'); b.style.transition = 'none'; b.style.width = '100%'; void b.offsetWidth; b.style.transition = `width ${PX_SEC}s linear`; b.style.width = '0%'; T = setTimeout(() => end(-1, true), PX_SEC * 1000); };
    const ask = () => { const i = 2 * k; let st = false; const go = () => { if (!st && !done) { st = true; timer(); } }; L[i] && L[i][1] === p.q ? play(i, go) : (() => { try { const u = new SpeechSynthesisUtterance(p.q); u.lang = 'en-US'; u.onend = go; speechSynthesis.cancel(); speechSynthesis.speak(u); } catch (e) { go(); } })(); setTimeout(go, 6000); };
    $('#pl').onclick = ask; ask();
    app.querySelectorAll('[data-j]').forEach(b => b.onclick = () => end(+b.dataset.j, false)); };
  if (!P2.length) { app.innerHTML = `${head()}<p>Bài này chưa có bộ câu hỏi.</p>`; return; } step(); }
