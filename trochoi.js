// v167 🎮 Trò chơi Reading TOEIC (specs/018-toeic-tro-choi; người sáng lập 13/11/2026: "tạo trò chơi để nhớ từ vựng, ngữ nghĩa, cấu trúc để làm bài Reading tốt",
//   "đặt thành 1 mục trong Luyện đề", "lấy nội dung tất cả đề để làm trò chơi"). KHÔNG đổi luật đo, không ghi điểm đề thử, không ghi bản đồ điểm TOEIC.
// Nội dung: câu của mọi đề thử trọn (TO.tron: Đề 1–8 + đề riêng đã mở mã trên máy). Câu làm sai trong 📋 bài làm đề lên trước.
//   🔁 Săn cặp: Part 7, câu chứa đáp án (ev, chữ trong bài) ↔ đáp án đúng (chữ viết lại); bỏ câu NOT, câu chèn [1]–[4], ev > TG_EVW từ.
//   🧩 Họ từ: Part 5 dạng từ có lời giải nghĩa phương án (lg.og "loại từ: nghĩa"): ① "Từ nào là {loại từ}?" (chỉ khi loại từ của đáp án là duy nhất) ② điền câu; đã đúng ≥ 1 lần thì tự gõ.
// Lịch ôn riêng S.to.tc.it[mã] = { b: hộp 0–4, d: ngày gặp lại (dayOf), t: ngày chơi gần nhất, n, w }: sai → hộp 0, gặp lại ngày sau; đúng → hộp +1, gặp lại sau TG_I ngày.
// Đếm dùng S.to.tc.st[trò] = { r: số lượt, q: số mục, ok: đúng lần đầu, rv: số mục ôn lại, rvok: ôn lại đúng } (SC-003).
const TG_N = 5, TG_I = [1, 3, 7, 21], TG_EVW = 15, TG_VIEW = 'toeic-tro-choi';
const tgSt = () => { const o = toSt(); o.tc = o.tc || { it: {}, st: {} }; o.tc.it = o.tc.it || {}; o.tc.st = o.tc.st || {}; return o.tc; };
const tgDay = () => dayOf(Date.now());
// loại từ đọc từ lời giải ("trạng từ: trực tiếp"); không rõ thì null
function tgPos(v) { const k = String(v || '').split(':')[0].trim().toLowerCase();
  if (/\//.test(k.replace(/v3 \/ quá khứ/, 'v3')) || /so sánh/.test(k)) return null;
  if (/^danh từ/.test(k)) return 'danh từ'; if (/^tính từ/.test(k)) return 'tính từ'; if (/^trạng từ/.test(k)) return 'trạng từ';
  if (/^(v3|v-ing|phân từ)/.test(k)) return 'V3 / V-ing'; if (/^động từ/.test(k)) return 'động từ'; return null; }
const tgMean = v => { const s = String(v || ''), i = s.indexOf(':'); return i < 0 ? s : s.slice(i + 1).trim(); };
// câu đã làm sai trong mọi bài làm 📋 đã lưu của đề (cả đề, một phần, từng lượt)
function tgWrong(de, B) { const w = new Set(); for (const k of Object.keys(toSt().tronA || {})) { if (k !== de && !k.startsWith(de + ':')) continue;
  const A = trAGet(de, k); if (!A) continue; for (const q of B.Q) if (trSt3(q, String(A.a || '')[q.n - 1]) === 'no') w.add(q.n); } return w; }
async function tgPool() { const P = { pair: [], ho: [] }, seenL = new Set(), seenH = new Set(), D = (typeof TO !== 'undefined' && TO && TO.tron) || [];
  for (const d of D) if (d.f && !TR.D[d.id]) await trLoad(d.id);
  for (const d of D) { const B = trB(d.id); if (!B) continue; const wr = tgWrong(d.id, B);
    for (const q of B.Q) { const id = d.id + ':' + q.n, w = wr.has(q.n), lg = q.lg || {};
      if (q.sec === 'p7' && q.ev && q.qt !== 'not' && !/^\[\d\]$/.test(q.a) && q.ev.split(/\s+/).length <= TG_EVW && !seenL.has(q.ev)) { seenL.add(q.ev);
        P.pair.push({ id, de: d.id, q, w, L: q.ev, R: q.a, vL: lg.dich || '', vR: (lg.og || {})[q.a] || '' }); }
      if (q.sec === 'p5' && q.x && q.x.t === 'form' && lg.og && q.opts.every(o => lg.og[o]) && !seenH.has(q.x.s)) { seenH.add(q.x.s);
        const pos = Object.fromEntries(q.opts.map(o => [o, tgPos(lg.og[o])])), pa = pos[q.a], uniq = pa && q.opts.filter(o => pos[o] === pa).length === 1;
        P.ho.push({ id, de: d.id, q, w, pos, ask: uniq ? pa : null }); } } }
  return P; }
// chọn lượt: đến hạn → sai trong đề (chưa chơi) → chưa chơi → còn lại; bỏ mục đã chơi hôm nay; chữ không trùng trong một lượt
function tgPick(list, key) { const I = tgSt().it, t = tgDay(), r = x => I[x.id];
  const rank = x => { const z = r(x); if (z && z.t === t) return 9; if (z && z.d <= t) return 0; if (!z && x.w) return 1; if (!z) return 2; return 3; };
  const s = shuf(list).sort((a, b) => rank(a) - rank(b) || ((r(a) || {}).d || 0) - ((r(b) || {}).d || 0)), out = [], ks = new Set();
  for (const x of s) { const k = key(x); if (ks.has(k)) continue; ks.add(k); out.push(x); if (out.length >= TG_N) break; }
  return out; }
function tgMark(game, x, ok) { const T = tgSt(), t = tgDay(), z = T.it[x.id] || { b: 0, n: 0, w: 0 }, st = T.st[game] = T.st[game] || { r: 0, q: 0, ok: 0, rv: 0, rvok: 0 };
  if (z.n) { st.rv++; if (ok) st.rvok++; } else { st.q++; if (ok) st.ok++; }
  z.n++; if (ok) z.b = Math.min(z.b + 1, TG_I.length); else { z.w++; z.b = 0; } z.t = t; z.d = t + (ok ? TG_I[z.b - 1] : 1); T.it[x.id] = z; }
const tgDue = P => { const I = tgSt().it, t = tgDay(); return [...P.pair, ...P.ho].filter(x => I[x.id] && I[x.id].d <= t && I[x.id].t !== t).length; };
const tgHead = (t, n, i) => `<div id="ie"></div><div class="row top"><button class="link tap" data-tgv>‹ Trò chơi</button><span class="mute">${i}/${n}</span></div><h2 style="margin:4px 0 8px">${t}</h2>`;

// ---------- màn đầu ----------
let TG_P = null;
async function tgView() { window.CUR = { view: TG_VIEW }; BACK = null; scrollTo(0, 0);
  if (!TG_P) { $app.innerHTML = '<div id="ie"></div><p class="mute">Đang tải các đề…</p>'; await toLoad(); TG_P = await tgPool(); if (window.CUR.view !== TG_VIEW) return; }
  const P = TG_P, due = tgDue(P), st = tgSt().st, nd = ((TO && TO.tron) || []).filter(d => trB(d.id)).length, w = [...P.pair, ...P.ho].filter(x => x.w).length;
  const g = (k, ic, t, sub, n) => `<button class="hrow" data-tgg="${k}"${n ? '' : ' disabled'}><span class="ic">${ic}</span><span class="t"><b>${t}</b><small>${sub}</small></span><span class="chev">›</span></button>`;
  const rec = k => { const s = st[k]; return s && s.r ? ` · đã chơi ${s.r} lượt` : ''; };
  $app.innerHTML = `<div id="ie"></div><div class="row top"><button class="link tap" data-tgb>‹ TOEIC</button></div>
    <h1>🎮 Trò chơi Reading</h1><p class="mute" style="margin-top:0">Chơi bằng câu của ${nd} đề thử TOEIC. Mỗi lượt 5 mục, khoảng 1–2 phút.${w ? ` Câu bạn làm sai trong đề (${w}) lên trước.` : ''}</p>
    ${due ? `<div class="box" style="background:var(--accent2)"><b>🔁 ${due} mục cần chơi lại hôm nay</b><p class="mute" style="margin:2px 0 0">Mục chơi sai hôm trước sẽ quay lại ở lượt đầu.</p></div>` : ''}
    <div class="box hcard">${g('pair', '🔁', 'Săn cặp diễn đạt lại', `Part 7 · ghép chữ trong bài với chữ trong đáp án · ${P.pair.length} cặp${rec('pair')}`, P.pair.length >= TG_N)}
    ${g('ho', '🧩', 'Họ từ', `Part 5 · nhận ra loại từ rồi điền câu · ${P.ho.length} câu${rec('ho')}`, P.ho.length >= TG_N)}</div>
    <p class="mute" style="font-size:14px">⚠️ Trò chơi dùng câu thật của đề. Khi làm lại đề đã chơi, điểm sẽ cao hơn thực lực. Không tính vào điểm đề thử, 📘 Học hay 🔁 Nhớ.</p>`;
  $app.onclick = e => { if (e.target.closest('[data-tgb]')) { EX_PART = 'san'; toeicView(); return; }
    const b = e.target.closest('[data-tgg]'); if (b && !b.disabled) (b.dataset.tgg === 'pair' ? tgPair : tgHo)(); }; }

// ---------- 🔁 Săn cặp ----------
function tgPair() { const its = tgPick(TG_P.pair, x => x.R.toLowerCase()); if (its.length < 2) return tgView(); window.CUR = { view: TG_VIEW + '-cap' };
  const G = { its, R: shuf(its.map((_, i) => i)), sl: -1, sr: -1, done: new Set(), miss: new Set(), t0: Date.now(), msg: '' };
  const draw = () => { const n = its.length;
    $app.innerHTML = tgHead('🔁 Săn cặp diễn đạt lại', n, G.done.size) + `<p class="mute" style="margin-top:0">Chạm một dòng "Trong bài", rồi chạm dòng "Trong đáp án" cùng ý.</p>
      <div aria-live="polite">${G.msg}</div><p class="tcs">📖 Trong bài</p>${its.map((x, i) => `<button class="tcc${G.done.has(i) ? ' ok' : G.sl === i ? ' sel' : ''}" data-tgl="${i}"${G.done.has(i) ? ' disabled' : ''}>${esc(x.L)}</button>`).join('')}
      <p class="tcs">✅ Trong đáp án</p>${G.R.map(i => `<button class="tcc${G.done.has(i) ? ' ok' : G.sr === i ? ' sel' : ''}" data-tgr="${i}"${G.done.has(i) ? ' disabled' : ''}>${esc(its[i].R)}</button>`).join('')}`; };
  const check = () => { const i = G.sl, j = G.sr; if (i < 0 || j < 0) return; G.sl = G.sr = -1;
    if (i === j) { G.done.add(i); if (!G.miss.has(i)) tgMark('pair', its[i], true); G.msg = '';
      if (G.done.size === its.length) return tgPairEnd(G); }
    else { const a = its[i], b = its[j]; if (!G.miss.has(i)) { G.miss.add(i); tgMark('pair', a, false); }
      G.msg = `<div class="box tcno"><b>✗ Chưa khớp</b><p style="margin:6px 0 0">“${esc(a.L)}”${a.vL ? `<br><span class="mute">= ${esc(a.vL)}</span>` : ''}</p><p style="margin:6px 0 0">“${esc(b.R)}”${b.vR ? `<br><span class="mute">= ${esc(b.vR)}</span>` : ''}</p></div>`; }
    save(); draw(); };
  $app.onclick = e => { if (e.target.closest('[data-tgv]')) return tgView(); const l = e.target.closest('[data-tgl]'), r = e.target.closest('[data-tgr]');
    if (l && !l.disabled) { G.sl = +l.dataset.tgl; draw(); check(); } else if (r && !r.disabled) { G.sr = +r.dataset.tgr; draw(); check(); } };
  draw(); }
function tgPairEnd(G) { const its = G.its, ok = its.length - G.miss.size, st = tgSt().st.pair; st.r++; save();
  const sec = Math.round((Date.now() - G.t0) / 1000), M = its.filter((_, i) => G.miss.has(i));
  const row = x => `<div class="box"><p style="margin:0">📖 “${esc(x.L)}”</p>${x.vL ? `<p class="mute" style="margin:2px 0 0">${esc(x.vL)}</p>` : ''}<p style="margin:8px 0 0">✅ “${esc(x.R)}”</p>${x.vR ? `<p class="mute" style="margin:2px 0 0">${esc(x.vR)}</p>` : ''}
    <button class="link tap" data-tgsrc="${esc(x.id)}">📘 Xem bài gốc · ${esc(trName(x.de))} câu ${x.q.n}</button></div>`;
  tgEnd('🔁 Săn cặp diễn đạt lại', `${ok}/${its.length} cặp ghép đúng ngay · ${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')}`, M.length ? `<p class="tcs">Cặp ghép sai: chơi lại từ ngày mai</p>${M.map(row).join('')}` : '<p>🎉 Ghép đúng hết ngay lần đầu.</p>', tgPair, its); }

// ---------- 🧩 Họ từ ----------
function tgHo() { const its = tgPick(TG_P.ho, x => x.q.a.toLowerCase()); if (!its.length) return tgView(); window.CUR = { view: TG_VIEW + '-ho' };
  const G = { its, i: 0, step: 0, ok: [], res: null };
  const cur = () => its[G.i], typ = x => ((tgSt().it[x.id] || {}).b || 0) >= 1;
  const draw = () => { const x = cur(), q = x.q, lg = q.lg, head = tgHead('🧩 Họ từ', its.length, G.i + 1);
    if (G.step === 0 && x.ask) { $app.innerHTML = head + `<p class="mute" style="margin-top:0">Bước 1 · Nhận ra loại từ</p><p style="font-size:19px"><b>Từ nào là ${x.ask}?</b></p>${q.opts.map(o => `<button class="tcc" data-tga="${esc(o)}">${esc(o)}</button>`).join('')}`; return; }
    if (!G.res) { const t = typ(x); $app.innerHTML = head + `<p class="mute" style="margin-top:0">Bước 2 · ${t ? 'Tự gõ dạng đúng' : 'Chọn dạng đúng'} điền vào chỗ trống</p><p style="font-size:18px;line-height:1.6">${q.q}</p>`
      + (t ? `<p class="mute">Gợi ý: bắt đầu bằng “${esc(q.a[0])}”, ${q.a.length} chữ cái.</p><input class="tin" data-tgi autocomplete="off" autocapitalize="off" spellcheck="false" style="width:100%"><button class="pri" data-tgk>Kiểm</button>`
        : q.opts.map(o => `<button class="tcc" data-tgf="${esc(o)}">${esc(o)}</button>`).join('')); if (t) setTimeout(() => { const i = document.querySelector('[data-tgi]'); i && i.focus(); }, 50); return; }
    const r = G.res; $app.innerHTML = head + `<div class="box ${r.ok ? 'tcyes' : 'tcno'}"><b>${r.ok ? '✓ Đúng' : '✗ Chưa đúng'}</b>${r.note ? `<p style="margin:4px 0 0">${r.note}</p>` : ''}</div>
      <p style="font-size:17px;line-height:1.6">${q.q.replace('<b>-------</b>', `<b>${esc(q.a)}</b>`)}</p>
      <div class="box">${q.opts.map(o => `<p style="margin:4px 0"><b>${esc(o)}</b>${o === q.a ? ' ✓' : ''} · <span class="mute">${esc(lg.og[o])}</span></p>`).join('')}</div>
      <div class="box rvgt"><p style="margin:0"><b>Vì sao:</b> ${esc(lg.ly || q.why || '')}</p>${lg.ct ? `<p style="margin:6px 0 0"><b>Cấu trúc:</b> ${esc(lg.ct)}</p>` : ''}${lg.dich ? `<p style="margin:6px 0 0"><b>Dịch:</b> ${esc(lg.dich)}</p>` : ''}</div>
      <button class="pri" data-tgn>${G.i + 1 < its.length ? 'Câu tiếp ›' : 'Xem kết quả'}</button>`; };
  const fin = (ok, note) => { const x = cur(); ok = ok && G.s1 !== false; G.ok[G.i] = ok; tgMark('ho', x, ok); save(); G.res = { ok, note }; draw(); };
  $app.onclick = e => { if (e.target.closest('[data-tgv]')) return tgView(); const x = cur(), q = x.q;
    const a = e.target.closest('[data-tga]'); if (a) { G.s1 = a.dataset.tga === q.a; if (!G.s1) toast(`“${a.dataset.tga}” là ${q.lg.og[a.dataset.tga]}. Từ là ${x.ask}: “${q.a}”.`); G.step = 1; draw(); return; }
    const f = e.target.closest('[data-tgf]'); if (f) return fin(f.dataset.tgf === q.a, f.dataset.tgf === q.a ? '' : `Bạn chọn “${esc(f.dataset.tgf)}”.`);
    if (e.target.closest('[data-tgk]')) { const v = (document.querySelector('[data-tgi]') || {}).value || ''; const ok = v.trim().toLowerCase() === q.a.toLowerCase(); return fin(ok, ok ? '' : `Bạn gõ “${esc(v.trim())}”.`); }
    if (e.target.closest('[data-tgn]')) { if (G.i + 1 >= its.length) return tgHoEnd(G); G.i++; G.step = 0; G.res = null; G.s1 = undefined; draw(); } };
  $app.onkeydown = e => { if (e.key === 'Enter' && e.target.matches && e.target.matches('[data-tgi]')) { e.preventDefault(); const b = document.querySelector('[data-tgk]'); b && b.click(); } };
  draw(); }
function tgHoEnd(G) { const its = G.its, ok = G.ok.filter(Boolean).length; tgSt().st.ho.r++; save(); $app.onkeydown = null;
  const M = its.filter((_, i) => !G.ok[i]);
  const row = x => `<div class="box"><p style="margin:0"><b>${esc(x.q.a)}</b> · <span class="mute">${esc(x.q.lg.og[x.q.a])}</span></p><p style="margin:6px 0 0">${x.q.q.replace('<b>-------</b>', `<b>${esc(x.q.a)}</b>`)}</p></div>`;
  tgEnd('🧩 Họ từ', `${ok}/${its.length} câu đúng`, M.length ? `<p class="tcs">Câu sai: chơi lại từ ngày mai</p>${M.map(row).join('')}` : '<p>🎉 Đúng hết.</p>', tgHo, its); }

// ---------- kết quả + xem bài gốc ----------
function tgEnd(t, sum, body, again, its) { window.CUR = { view: TG_VIEW + '-kq' };
  $app.innerHTML = `<div id="ie"></div><div class="row top"><button class="link tap" data-tgv>‹ Trò chơi</button></div><h2>${t}</h2><div class="box"><b style="font-size:20px">${sum}</b></div>${body}
    <button class="pri" data-tgag>▶ Chơi lượt mới</button>`;
  const back = () => tgEnd(t, sum, body, again, its);
  $app.onclick = e => { if (e.target.closest('[data-tgv]')) return tgView(); if (e.target.closest('[data-tgag]')) return again();
    const s = e.target.closest('[data-tgsrc]'); if (s) { const x = its.find(y => y.id === s.dataset.tgsrc); if (x) tgSrc(x, back); } }; scrollTo(0, 0); }
function tgSrc(x, back) { const q = x.q; window.CUR = { view: TG_VIEW + '-bai' };
  $app.innerHTML = `<div id="ie"></div><div class="row top"><button class="link tap" data-tgbk>‹ Kết quả</button></div><p class="mute">${esc(trName(x.de))} · câu ${q.n}</p>
    <div class="box"><p style="margin:0"><b>${q.q}</b></p><p style="margin:6px 0 0">✓ ${esc(q.a)}</p></div><p class="mute">📍 Câu chứa đáp án được tô màu.</p>
    ${q.foot.replace(esc(x.L), `<mark>${esc(x.L)}</mark>`)}<button data-tgbk>‹ Kết quả</button>`;
  $app.onclick = e => { if (e.target.closest('[data-tgbk]')) back(); }; scrollTo(0, 0); }

// lối vào ở màn TOEIC (phần 📚 Đề có sẵn), cạnh đề thử trọn
function tgRow() { if (typeof TO === 'undefined' || !TO || !(TO.tron || []).length) return '';
  return `<div class="box hcard" style="margin:12px 0 0"><button class="hrow" data-tgv><span class="ic">🎮</span><span class="t"><b>Trò chơi Reading</b><small>Săn cặp diễn đạt lại · Họ từ · câu lấy từ các đề thử</small></span><span class="chev">›</span></button></div>`; }
document.addEventListener('click', e => { if (S && e.target.closest('[data-tgv]') && !String((window.CUR || {}).view).startsWith(TG_VIEW)) { TG_P = null; tgView(); } });
