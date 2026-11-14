// 🗺 Chinh phục đề (specs/018-toeic-tro-choi). Lịch sử: v167–v168 6 trò chơi rời · v169 gộp thành một hành trình · v170 thêm đề riêng Đề 9–16.
// v171 (người sáng lập 14/11/2026: "bỏ hết những luật cũ… cần có đủ kiến thức để giải các đề toeic hiện có mà không phải học vẹt…
//   Ưu tiên 1 vẫn là làm đúng được hết đề được chọn, ưu tiên 2 là nắm và nhớ được kiến thức từng câu hỏi"; "Làm đi" = theo đề xuất: chỉ Phần Đọc,
//   🟦 Hiểu đạt trong cùng buổi, bỏ luật "ngày sau mới xanh"). KHÔNG đổi luật đo, không ghi điểm đề thử / bản đồ điểm / thẻ học.
// Mỗi câu Phần Đọc (Part 5–7) có 2 mức:
//   ⭐ Đúng: làm đúng câu ở dạng đề thật (thi lượt 10 câu của đề thử trọn, hoặc làm lại sau khi đọc lời giải với phương án XÁO thứ tự: nhớ chữ cái không giúp được).
//   🟦 Hiểu: qua 2 thử thách kiến thức của câu, hỏi KHÁC câu đề (TG_K): 🧩 chỗ trống cần loại từ / quan hệ gì · 🔎 chạm câu chứa đáp án trong bài (Part 7) ·
//     ✍️ tự gõ từ còn thiếu, không có phương án · 🔗 ghép 4 phương án với nghĩa (lời giải lg.og). Câu chỉ có 1 thử thách thì qua 1 là đủ.
//   Nhớ lâu: câu 🟦 hỏi lại MỘT thử thách khác kiểu lần trước sau TG_H 3 → 7 → 21 ngày; qua cả 3 lần = nhớ chắc (hết lịch); sai = về ⭐, làm lại 2 thử thách.
// Trạng thái ⭐ = sự kiện mới nhất giữa bài làm 📋 đã lưu (S.to.tronA) và hành trình S.to.tc.j[de].c[n] = { s: 'ok'|'sai', at } ('fix' của v169 = sai).
//   🟦 = S.to.tc.j[de].h[n] = { at, lv, d, k } còn hiệu lực khi câu đang ⭐ và chưa làm sai sau lúc đạt. Câu trượt thử thách trong ngày ghi j.f[n] = ngày (xếp sau).
// MỘT nút ▶ theo thứ tự: chữa câu sai → thi lượt chưa làm → ôn câu 🟦 đến hạn → làm cho hiểu câu ⭐ → xong.
const TG_VIEW = 'toeic-tro-choi', TG_SEC = /^p[5-7]$/, TG_FIXN = 5, TG_HN = 5, TG_H = [3, 7, 21];
// quan hệ hai vế của từ nối / liên từ (từ không có ở đây thì không hỏi quan hệ)
const TG_CAT = { 'thêm ý': ['in addition', 'furthermore', 'moreover', 'also', 'and', 'besides', 'additionally'], 'đối lập': ['however', 'although', 'though', 'even though', 'despite', 'in spite of', 'nevertheless', 'but', 'yet', 'whereas'],
  'kết quả / mục đích': ['therefore', 'as a result', 'consequently', 'thus', 'so that', 'so', 'in order to'], 'nguyên nhân': ['because', 'because of', 'due to', 'since', 'as'],
  'điều kiện': ['if', 'unless', 'as long as', 'in case', 'provided that'], 'thời gian': ['once', 'as soon as', 'since then', 'when', 'until', 'before', 'after', 'meanwhile'],
  'lựa chọn': ['or', 'either', 'nor', 'neither', 'alternatively', 'otherwise'], 'nhấn mạnh': ['of course', 'in fact', 'indeed', 'actually'] };
const tgCat = w => { const k = String(w || '').toLowerCase().trim(); for (const [c, ws] of Object.entries(TG_CAT)) if (ws.includes(k)) return c; return null; };
const TG_POS = ['danh từ', 'động từ', 'tính từ', 'trạng từ', 'V3 / V-ing'];
// thử thách kiến thức, thứ tự ưu tiên khi chọn 2 cho một câu
const TG_K = { ld: ['🧩', 'Chỗ trống cần gì?'], ev: ['🔎', 'Dò câu chứa đáp án'], go: ['✍️', 'Tự gõ từ còn thiếu'], ng: ['🔗', 'Ghép phương án với nghĩa'] }, TG_KO = ['ld', 'ev', 'go', 'ng'];
const tgSt = () => { const o = toSt(); o.tc = o.tc || {}; o.tc.st = o.tc.st || {}; return o.tc; };
const tgDay = () => dayOf(Date.now());
// loại từ đọc từ lời giải ("trạng từ: trực tiếp"); không rõ thì null
function tgPos(v) { const k = String(v || '').split(':')[0].trim().toLowerCase();
  if (/\//.test(k.replace(/v3 \/ quá khứ/, 'v3')) || /so sánh/.test(k)) return null;
  if (/^danh từ/.test(k)) return 'danh từ'; if (/^tính từ/.test(k)) return 'tính từ'; if (/^trạng từ/.test(k)) return 'trạng từ';
  if (/^(v3|v-ing|phân từ)/.test(k)) return 'V3 / V-ing'; if (/^động từ/.test(k)) return 'động từ'; return null; }
// tách văn bản thành câu theo vị trí gốc (không dùng lookbehind: Safari cũ lỗi cú pháp): chỉ cắt sau . ! ? khi theo sau là dấu cách + chữ hoa / số / ngoặc,
//   không cắt sau Mr. Ms. a.m. A.M. chữ viết tắt một chữ hoa
const TG_ABBR = /(\b(Mr|Ms|Mrs|Dr|St|No|Inc|Co|Ltd|etc|Jr|Sr|Ave|Rd|vs|a\.m|p\.m|e\.g|i\.e)|\b[A-Z])\.$/;
function tgSents(text) { const out = [];
  for (const line of String(text || '').split('\n')) { const re = /[.!?]+(?=\s+["“(A-Z0-9])/g; let st = 0, m;
    while ((m = re.exec(line))) { const end = m.index + m[0].length, s = line.slice(st, end).trim(); if (TG_ABBR.test(s)) continue; if (s) out.push(s); st = end; }
    const rest = line.slice(st).trim(); if (rest) out.push(rest); }
  return out; }
const tgNorm = s => String(s || '').toLowerCase().replace(/[“”"’']/g, "'").replace(/\s+/g, ' ').trim();
const tgHit = (sent, ev) => { const a = tgNorm(sent), e = tgNorm(ev); return a.includes(e.slice(0, 25)) || (a.length >= 12 && e.includes(a.replace(/[.!?]+$/, ''))); };
// kho của mọi đề: P[de][số câu] = { q, ks: [thử thách có được], pos?, cat?, docs? }
async function tgPool() { const P = {}, D = (typeof TO !== 'undefined' && TO && TO.tron) || [];
  for (const d of D) if (d.f && !TR.D[d.id]) await trLoad(d.id);
  for (const d of D) { const B = trB(d.id); if (!B) continue; const G = P[d.id] = {};
    for (const q of B.Q) { if (!TG_SEC.test(q.sec)) continue; const og = (q.lg || {}).og || {}, m = G[q.n] = { q, ks: [] }, all = q.opts.every(o => og[o]);
      if (q.sec === 'p5' && q.x && q.x.t === 'form' && all) { const pos = tgPos(og[q.a]); if (pos && q.opts.filter(o => tgPos(og[o]) === pos).length === 1) { m.pos = pos; m.ks.push('ld'); } }
      else if ((q.sec === 'p6' && q.gt === 'conn') || (q.sec === 'p5' && q.x && q.x.t === 'conj')) { const c = tgCat(q.a); if (c) { m.cat = c; m.ks.push('ld'); } }
      if (q.sec === 'p7' && q.ev && q.qt !== 'not' && !/^\[\d\]$/.test(q.a)) { const docs = q.x.docs.map(dc => ({ title: dc.title, ss: tgSents(dc.text) }));
        if (docs.some(dc => dc.ss.some(s => tgHit(s, q.ev)))) { m.docs = docs; m.ks.push('ev'); } }
      if (q.sec !== 'p7' && q.gt !== 'insert' && /^[A-Za-z][A-Za-z' -]{0,24}$/.test(q.a) && q.a.trim().split(/\s+/).length <= 3) m.ks.push('go');
      if (all && new Set(q.opts.map(o => og[o])).size === q.opts.length) m.ks.push('ng'); } }
  return P; }
const tgDe = () => { const D = ((TO && TO.tron) || []).filter(d => TG_P && TG_P[d.id]), c = tgSt().de; return D.some(d => d.id === c) ? c : (D[0] || {}).id; };

// ---------- trạng thái từng câu ----------
let TG_J = null, TG_P = null;   // TG_J: đề đang thi lượt từ hành trình (màn kết quả có nút về) · TG_P: kho đã dựng
const tgJ = de => { const T = tgSt(); T.j = T.j || {}; const J = T.j[de] = T.j[de] || {}; J.c = J.c || {}; J.h = J.h || {}; J.f = J.f || {}; return J; };
function tgJState(de) { const B = trB(de); if (!B) return null; const Q = B.Q.filter(q => TG_SEC.test(q.sec)), E = {};
  const add = (n, at, ok) => { const e = E[n] = E[n] || { at: -1, sai: -1 }; if (at >= e.at) { e.at = at; e.ok = ok; } if (!ok && at > e.sai) e.sai = at; };
  for (const k of Object.keys(toSt().tronA || {})) { if (k !== de && !k.startsWith(de + ':')) continue; const A = trAGet(de, k); if (!A) continue; const a = String(A.a || '');
    for (const q of Q) { const ch = a[q.n - 1]; if (ch && ch !== '-') add(q.n, A.at || 0, trSt3(q, ch) === 'ok'); } }
  const J = tgJ(de), t = tgDay(), M = (TG_P && TG_P[de]) || {};
  for (const [n, c] of Object.entries(J.c)) if (c && c.s) add(+n, c.at || 0, c.s === 'ok');
  return Q.map(q => { const e = E[q.n], h = J.h[q.n], st = !e ? 'chua' : e.ok ? 'ok' : 'sai', hi = !!(st === 'ok' && h && h.at >= e.sai);
    return { q, n: q.n, st, hi, h: hi ? h : null, ks: (M[q.n] || {}).ks || [], due: !!(hi && h.d && h.d <= t), f: J.f[q.n] === t }; }); }
const tgJCount = L => ({ n: L.length, ok: L.filter(c => c.st === 'ok').length, sai: L.filter(c => c.st === 'sai').length, chua: L.filter(c => c.st === 'chua').length,
  hi: L.filter(c => c.hi).length, nk: L.filter(c => c.ks.length).length, due: L.filter(c => c.due).length, chac: L.filter(c => c.hi && !c.h.d).length });
// việc kế tiếp: chữa câu sai → thi lượt chưa làm → ôn câu 🟦 đến hạn → làm cho hiểu câu ⭐ (câu trượt hôm nay xếp sau) → xong
function tgJNext(de, L) { const sai = L.filter(c => c.st === 'sai'), chua = L.filter(c => c.st === 'chua'), due = L.filter(c => c.due);
  const moi = L.filter(c => c.st === 'ok' && !c.hi && c.ks.length).sort((a, b) => a.f - b.f);
  if (sai.length) return { k: 'fix', cs: sai.slice(0, TG_FIXN) };
  if (chua.length) { const B = trB(de), ck = chua[0].q.ck, K = trCks(B), c = K[ck], r0 = K.find(z => z.p === 'R'); return { k: 'thi', id: 'c' + c.p + ck, c, r0: r0 ? r0.k : 0, n: L.filter(x => x.q.ck === ck).length }; }
  if (due.length) return { k: 'on', cs: due.slice(0, TG_HN) };
  if (moi.length) return { k: 'hieu', cs: moi.slice(0, TG_HN) };
  const ds = L.filter(c => c.hi && c.h.d).map(c => c.h.d); return { k: 'win', d: ds.length ? Math.min(...ds) : 0 }; }
const tgNs = cs => cs.slice(0, 6).map(c => c.n).join(', ') + (cs.length > 6 ? '…' : '');

// ---------- màn hành trình ----------
async function tgView() { window.CUR = { view: TG_VIEW }; BACK = null; $app.onkeydown = null; scrollTo(0, 0);
  if (!TG_P) { $app.innerHTML = '<div id="ie"></div><p class="mute">Đang tải các đề…</p>'; await toLoad(); try { if (typeof trProbe9 === 'function') await trProbe9(); if (typeof trLkList === 'function') await trLkList(); } catch (e) {} TG_P = await tgPool(); if (window.CUR.view !== TG_VIEW) return; }   // v170: nạp cả đề riêng (Đề 9–16) đã mở mã trên máy
  const D = ((TO && TO.tron) || []).filter(d => TG_P[d.id]), de = tgDe(), L = tgJState(de) || [], C = tgJCount(L), nx = tgJNext(de, L);
  const p1 = C.n ? Math.round(C.ok / C.n * 100) : 0, p2 = C.nk ? Math.round(C.hi / C.nk * 100) : 0;
  const chip = d => { const l = tgJState(d.id) || [], w = l.length && l.every(c => c.st === 'ok'); return `<button class="chip${d.id === de ? ' on' : ''}" data-tgde="${esc(d.id)}" aria-pressed="${d.id === de}">${esc((String(d.t).match(/^Đề\s*\d+/) || [d.t])[0])}${w ? ' 🏆' : ''}</button>`; };
  const nLk = ((typeof TR !== 'undefined' && TR.lk) || []).filter(r => !((TO && TO.tron) || []).some(d => d.id === r.id)).length;
  const cell = c => { const cl = c.hi ? 'hi' : c.st === 'ok' ? 'ok' : c.st === 'sai' ? 'no' : 'em', lab = { hi: 'hiểu', ok: 'đúng', no: 'cần chữa', em: 'chưa làm' }[cl];
    return `<span class="trc ${cl}" role="img" aria-label="Câu ${c.n}: ${lab}">${c.n}</span>`; };
  const big = { fix: [`▶ Chữa ${nx.cs ? nx.cs.length : 0} câu sai: câu ${nx.cs ? tgNs(nx.cs) : ''}`, 'Đọc lời giải rồi làm lại · phương án xáo thứ tự'],
    thi: [`▶ Thi lượt ${nx.c ? nx.c.k - nx.r0 + 1 : ''} · câu ${nx.c ? nx.c.a + '–' + nx.c.b : ''}`, `${nx.n || 0} câu · như đề thật, có giờ · câu sai sẽ được chữa`],
    on: [`▶ Ôn kiến thức ${nx.cs ? nx.cs.length : 0} câu`, 'Đến hạn ôn · mỗi câu một thử thách · sai thì câu về ⭐'],
    hieu: [`▶ Hiểu ${nx.cs ? nx.cs.length : 0} câu đã đúng: câu ${nx.cs ? tgNs(nx.cs) : ''}`, 'Mỗi câu 2 thử thách hỏi khác câu đề: loại từ, tự gõ, dò câu, ghép nghĩa'] }[nx.k];
  const later = nx.d ? nx.d - tgDay() : 0;
  const step = big ? `<button class="btnbig" data-tgj="${nx.k}">${big[0]}<small>${big[1]}</small></button>`
    : `<div class="box tgyes"><b>🏆 ${esc(trName(de))}: đúng hết và hiểu hết ${C.n} câu Phần Đọc</b><p style="margin:6px 0 0">${C.chac === C.nk ? 'Mọi câu đã nhớ chắc.' : `Hôm nay xong. Lần ôn tới: ${later <= 1 ? 'ngày mai' : 'sau ' + later + ' ngày'}.`} Điểm của đề đã chinh phục cao hơn thực lực; trình độ thật đo bằng đề chưa làm.</p></div><button class="pri" data-tgj="full">▶ Làm lại cả Phần Đọc · 75 phút</button>`;
  $app.innerHTML = `<div id="ie"></div><div class="row top"><button class="link tap" data-tgb>‹ TOEIC</button></div>
    <h1>🗺 Chinh phục đề</h1><p class="mute" style="margin-top:0">① Làm <b>${esc(trName(de))}</b> đúng hết ${C.n} câu Phần Đọc. ② Hiểu từng câu: thử thách hỏi khác câu đề, nên nhớ đáp án không giúp được.</p>
    <p class="tgs" style="margin-top:4px">Chọn đề</p><div class="chips tap">${D.map(chip).join('')}</div>
    ${nLk ? `<button data-tgopen>🔓 Mở thêm ${nLk} đề riêng (cần mã)</button>` : ''}
    <div class="box"><b style="font-size:18px">⭐ Đúng ${C.ok}/${C.n}</b><div class="bar"><i style="width:${p1}%;background:var(--good)"></i></div>
      <b style="font-size:18px;display:block;margin-top:10px">🟦 Hiểu ${C.hi}/${C.nk}</b><div class="bar"><i style="width:${p2}%;background:var(--accent)"></i></div>
      <p class="mute" style="margin:6px 0 0">🟦 ${C.hi} hiểu · 🟩 ${C.ok - C.hi} đúng · 🟥 ${C.sai} cần chữa · ⬜ ${C.chua} chưa làm${C.due ? ` · ${C.due} câu đến hạn ôn` : ''}</p>
      ${C.ok === C.n && C.hi < C.nk ? `<p style="margin:6px 0 0"><b>🏆 Đã đúng hết ${C.n} câu.</b> Giờ làm cho hiểu từng câu.</p>` : ''}</div>
    ${step}
    <details class="more"><summary>Bản đồ ${C.n} câu</summary><div class="trgrid tgmap">${L.map(cell).join('')}</div></details>
    <details class="more"><summary>Cách tính</summary><p>⭐ Đúng: câu làm đúng ở lần gần nhất (thi lượt, làm lại sau lời giải, hoặc bài làm đề thử trọn). Làm lại sau lời giải thì phương án đổi thứ tự.</p>
      <p>🟦 Hiểu: qua ${'2'} thử thách kiến thức của câu (🧩 chỗ trống cần loại từ / quan hệ gì · 🔎 chạm câu chứa đáp án · ✍️ tự gõ từ, không có phương án · 🔗 ghép phương án với nghĩa). Câu chỉ có 1 thử thách thì qua 1 là đủ.</p>
      <p>Nhớ lâu: câu 🟦 được hỏi lại một thử thách khác sau ${TG_H.join(', ')} ngày. Qua cả ${TG_H.length} lần là nhớ chắc. Sai thì câu về ⭐, làm lại thử thách. Làm sai câu đó trong đề thì mất cả 🟦.</p></details>
    <p class="mute" style="font-size:14px">Không tính vào điểm đề thử trọn, 📘 Học hay 🔁 Nhớ.</p>`;
  $app.onclick = e => { if (e.target.closest('[data-tgb]')) { EX_PART = 'san'; toeicView(); return; }
    const c = e.target.closest('[data-tgde]'); if (c) { tgSt().de = c.dataset.tgde; save(); tgView(); return; }
    if (e.target.closest('[data-tgopen]')) return trLkAll(() => { TG_P = null; tgView(); });
    const b = e.target.closest('[data-tgj]'); if (!b) return; const k = b.dataset.tgj;
    if (k === 'thi') { TG_J = de; return trStart(de, nx.id); }
    if (k === 'full') { TG_J = de; return trStart(de, 'R'); }
    if (k === 'fix') return tgSua(de, nx.cs);
    if (k === 'on' || k === 'hieu') return tgHieu(de, nx.cs, k); }; }

// ---------- phần dùng chung: ngữ cảnh câu, lời giải ----------
const tgCtx = q => q.sec === 'p6' ? q.head.replace(/<p class="mute">[^<]*<\/p>/, '') + `<p><b>${q.q}</b></p>` : q.sec === 'p7' ? `<p style="font-size:17px"><b>${q.q}</b></p>` : `<p style="font-size:18px;line-height:1.6">${q.q}</p>`;
const tgDocs = q => q.sec === 'p7' ? `<details class="more"><summary>Văn bản</summary>${q.foot}</details>` : '';
// lời giải: câu có đáp án (Part 5) / câu hỏi + đáp án (Part 7), nghĩa 4 phương án, vì sao, cấu trúc, dịch
function tgSol(q) { const lg = q.lg || {}, og = lg.og || {};
  const sent = q.sec === 'p6' ? '' : q.sec === 'p7' ? `<p style="font-size:17px"><b>${q.q}</b> <span class="mute">· ✓ ${esc(q.a)}</span></p>` : `<p style="font-size:17px;line-height:1.6">${q.q.replace('<b>-------</b>', `<b>${esc(q.a)}</b>`)}</p>`;
  return `${sent}<div class="box">${q.opts.map(o => `<p style="margin:4px 0"><b>${esc(o)}</b>${o === q.a ? ' ✓' : ''}${og[o] ? ` · <span class="mute">${esc(og[o])}</span>` : ''}</p>`).join('')}</div>
    <div class="box rvgt"><p style="margin:0"><b>Vì sao:</b> ${esc(lg.ly || q.why || '')}</p>${lg.ct ? `<p style="margin:6px 0 0"><b>Cấu trúc:</b> ${esc(lg.ct)}</p>` : ''}${lg.dich ? `<p style="margin:6px 0 0"><b>Dịch:</b> ${esc(lg.dich)}</p>` : ''}</div>`; }
const tgTop = (de, q, h2) => `<div id="ie"></div><div class="row top"><button class="link tap" data-tgv>‹ Hành trình</button><span class="mute">${esc(trName(de))} · câu ${q.n}</span></div><h2 style="margin:4px 0 8px">${h2}</h2>`;
const tgEndView = (h2, body) => { window.CUR = { view: 'tg-xong' }; $app.onkeydown = null; $app.onclick = null; scrollTo(0, 0);
  $app.innerHTML = `<div id="ie"></div><h2>${h2}</h2>${body}<button class="pri" data-tgv>▶ Về hành trình</button>`; };
const tgStat = (k, ok) => { const s = tgSt().st, z = s[k] = s[k] || { n: 0, ok: 0 }; z.n++; if (ok) z.ok++; };

// ---------- ① chữa câu sai: đọc lời giải từng câu → làm lại cả nhóm, phương án xáo thứ tự ----------
function tgSua(de, cs) { window.CUR = { view: TG_VIEW + '-sua' }; $app.onkeydown = null; const J = tgJ(de).c, G = { ph: 0, i: 0, res: null, ok: 0, op: null };
  const draw = () => { const q = cs[G.i].q, n = cs.length;
    if (G.ph === 0) { $app.innerHTML = tgTop(de, q, `📖 Lời giải ${G.i + 1}/${n}`) + `<p class="mute" style="margin-top:0">Đọc kỹ vì sao. Đọc xong ${n} câu thì làm lại, phương án đổi thứ tự.</p>`
        + (q.sec === 'p6' ? tgCtx(q) : '') + tgSol(q) + tgDocs(q) + `<button class="pri" data-tgn>${G.i + 1 < n ? 'Câu tiếp ›' : `▶ Làm lại ${n} câu`}</button>`; return; }
    G.op = G.op || (q.sec === 'p7' && q.opts.every(o => /^\[\d\]$/.test(o)) ? [...q.opts] : shuf([...q.opts]));
    if (G.res) { $app.innerHTML = tgTop(de, q, `🔁 Làm lại ${G.i + 1}/${n}`) + `<div class="box ${G.res.ok ? 'tgyes' : 'tcno'}"><b>${G.res.ok ? `✓ Đúng · câu ${q.n} thành ⭐` : '✗ Chưa đúng · câu vẫn cần chữa'}</b>${G.res.note ? `<p style="margin:4px 0 0">${G.res.note}</p>` : ''}</div>`
        + (G.res.ok ? '' : (q.sec === 'p6' ? tgCtx(q) : '') + tgSol(q) + tgDocs(q)) + `<button class="pri" data-tgn>${G.i + 1 < n ? 'Câu tiếp ›' : 'Xem kết quả'}</button>`; return; }
    $app.innerHTML = tgTop(de, q, `🔁 Làm lại ${G.i + 1}/${n}`) + tgCtx(q) + G.op.map((o, k) => `<button class="tcc" data-tgf="${k}">${'ABCD'[k]}. ${esc(o)}</button>`).join('') + (q.sec === 'p7' ? q.foot : ''); };
  $app.onclick = e => { if (e.target.closest('[data-tgv]')) return tgView(); const q = cs[G.i].q;
    const f = e.target.closest('[data-tgf]'); if (f && G.ph === 1 && !G.res) { const o = G.op[+f.dataset.tgf], ok = o === q.a; if (ok) G.ok++; J[q.n] = { s: ok ? 'ok' : 'sai', at: Date.now() }; tgStat('lam', ok); save();
      G.res = { ok, note: ok ? '' : `Bạn chọn “${esc(o)}”.` }; draw(); scrollTo(0, 0); return; }
    if (!e.target.closest('[data-tgn]')) return;
    if (G.ph === 0) { if (G.i + 1 < cs.length) G.i++; else { G.ph = 1; G.i = 0; } draw(); return scrollTo(0, 0); }
    if (G.i + 1 >= cs.length) return tgEndView('🔁 Làm lại xong', `<div class="box ${G.ok === cs.length ? 'tgyes' : ''}"><b style="font-size:20px">${G.ok}/${cs.length} câu đúng</b><p style="margin:6px 0 0">${G.ok ? 'Câu đúng thành ⭐. Sau khi làm hết đề, app hỏi kiến thức của từng câu để biết bạn hiểu thật.' : ''}${G.ok < cs.length ? ' Câu chưa đúng sẽ chữa lại.' : ''}</p></div>`);
    G.i++; G.res = null; G.op = null; draw(); scrollTo(0, 0); };
  draw(); scrollTo(0, 0); }

// ---------- ② thử thách kiến thức: mode 'hieu' = 2 thử thách để thành 🟦 · 'on' = 1 thử thách khác kiểu lần trước để giữ 🟦 ----------
function tgPick1(c) { const ks = c.ks, last = c.h && c.h.k, i = ks.indexOf(last); return ks.length < 2 || i < 0 ? ks[0] : ks[(i + 1) % ks.length]; }
function tgHieu(de, cs, mode) { window.CUR = { view: TG_VIEW + '-hieu' }; const J = tgJ(de), M = TG_P[de], t = tgDay();
  const plan = cs.map(c => ({ c, m: M[c.n], ks: mode === 'on' ? [tgPick1(c)] : c.ks.slice(0, 2), r: [] }));
  const G = { i: 0, j: 0, fb: null, s: null, pass: 0 };
  const cur = () => plan[G.i], title = () => { const p = cur(); return `${mode === 'on' ? '🔁 Ôn' : '🟦 Hiểu'} câu ${G.i + 1}/${plan.length} · thử thách ${G.j + 1}/${p.ks.length}`; };
  const fin = (ok, note) => { const p = cur(), k = p.ks[G.j]; p.r.push({ k, ok, note }); tgStat(k, ok); save(); G.fb = { ok, note }; draw(); scrollTo(0, 0); };
  // xong mọi thử thách của một câu: ghi 🟦 / lịch ôn
  const close = () => { const p = cur(), n = p.c.n, all = p.r.every(r => r.ok), last = p.ks[p.ks.length - 1];
    if (mode === 'hieu') { if (all) { J.h[n] = { at: Date.now(), lv: 1, d: t + TG_H[0], k: last }; delete J.f[n]; G.pass++; } else J.f[n] = t; }
    else { const h = J.h[n]; if (all && h) { h.lv++; h.d = h.lv <= TG_H.length ? t + TG_H[h.lv - 1] : 0; h.k = last; G.pass++; } else { delete J.h[n]; J.f[n] = t; } }
    save(); p.done = all; };
  const draw = () => { const p = cur(), q = p.c.q, m = p.m, k = p.ks[G.j], og = (q.lg || {}).og || {};
    if (G.fb) { const lastK = G.j + 1 >= p.ks.length; if (lastK && p.done == null) close();
      const h = J.h[p.c.n], res = !lastK ? '' : mode === 'hieu' ? (p.done ? `✓ Câu ${q.n} thành 🟦 Hiểu · ôn lại sau ${TG_H[0]} ngày` : `Câu ${q.n} vẫn ⭐ · làm lại thử thách sau`)
        : (p.done ? (h && h.d ? `✓ Giữ 🟦 · lần ôn tới sau ${h.d - t} ngày` : '✓ Nhớ chắc câu này') : `Câu ${q.n} về ⭐ · làm lại 2 thử thách`);
      $app.innerHTML = tgTop(de, q, title()) + `<div class="box ${G.fb.ok ? 'tgyes' : 'tcno'}"><b>${G.fb.ok ? '✓ Đúng' : '✗ Chưa đúng'}</b>${G.fb.note ? `<p style="margin:4px 0 0">${G.fb.note}</p>` : ''}${res ? `<p style="margin:6px 0 0"><b>${res}</b></p>` : ''}</div>`
        + (lastK ? (q.sec === 'p6' ? tgCtx(q) : '') + tgSol(q) + tgDocs(q) : '') + `<button class="pri" data-tgn>${!lastK ? 'Thử thách tiếp ›' : G.i + 1 < plan.length ? 'Câu tiếp ›' : 'Xem kết quả'}</button>`; return; }
    const head = tgTop(de, q, title()) + `<p class="tgs" style="margin-top:0">${TG_K[k][0]} ${TG_K[k][1]}</p>`;
    if (k === 'ld') { G.s = G.s || { co: m.pos ? shuf([m.pos, ...shuf(TG_POS.filter(x => x !== m.pos)).slice(0, 3)]) : shuf([m.cat, ...shuf(Object.keys(TG_CAT).filter(x => x !== m.cat)).slice(0, 3)]) };
      $app.innerHTML = head + `<p style="font-size:18px;margin:4px 0"><b>${m.pos ? 'Chỗ trống cần loại từ nào?' : 'Hai vế quanh chỗ trống có quan hệ gì?'}</b></p>${tgCtx(q)}`
        + G.s.co.map((c, i) => `<button class="tcc" data-tgc="${i}">${esc(c[0].toUpperCase() + c.slice(1))}</button>`).join(''); return; }
    if (k === 'go') { const dich = (q.lg || {}).dich;
      $app.innerHTML = head + `<p class="mute" style="margin-top:0">Không có phương án. Gõ từ / cụm điền vào chỗ trống.</p>${tgCtx(q)}${dich ? `<p class="mute">Nghĩa: ${esc(dich)}</p>` : ''}
        <p class="mute">Gợi ý: bắt đầu bằng “${esc(q.a[0])}”, ${q.a.length} ký tự.</p><input class="tin" data-tgi autocomplete="off" autocapitalize="off" spellcheck="false" style="width:100%" aria-label="Từ còn thiếu"><button class="pri" data-tgk>Kiểm</button>`;
      setTimeout(() => { const i = document.querySelector('[data-tgi]'); i && i.focus(); }, 50); return; }
    if (k === 'ev') { let i = 0; $app.innerHTML = head + `<p style="font-size:17px;margin:4px 0"><b>${q.q}</b></p><p class="mute" style="margin-top:0">Chạm câu trong bài chứa thông tin trả lời câu hỏi.</p>`
        + m.docs.map(dc => `<p class="tgs">${esc(dc.title || 'Văn bản')}</p>${dc.ss.map(s => `<button class="tcc" data-tgs="${i++}">${esc(s)}</button>`).join('')}`).join(''); return; }
    // ng: ghép 4 phương án với 4 nghĩa
    G.s = G.s || { R: shuf(q.opts.map((_, i) => i)), L: shuf(q.opts.map((_, i) => i)), sl: -1, sr: -1, done: new Set(), miss: 0, msg: '' };
    const S2 = G.s; $app.innerHTML = head + `<p class="mute" style="margin-top:0">Chạm một phương án, rồi chạm nghĩa của nó.</p>${q.sec === 'p6' ? '' : `<p style="margin:4px 0">${q.sec === 'p7' ? `<b>${q.q}</b>` : q.q}</p>`}<div aria-live="polite">${S2.msg}</div>
      <p class="tgs">🇬🇧 Phương án</p>${S2.L.map(i => `<button class="tcc${S2.done.has(i) ? ' ok' : S2.sl === i ? ' sel' : ''}" data-tgl="${i}"${S2.done.has(i) ? ' disabled' : ''}>${esc(q.opts[i])}</button>`).join('')}
      <p class="tgs">🇻🇳 Nghĩa</p>${S2.R.map(i => `<button class="tcc${S2.done.has(i) ? ' ok' : S2.sr === i ? ' sel' : ''}" data-tgr="${i}"${S2.done.has(i) ? ' disabled' : ''}>${esc(og[q.opts[i]])}</button>`).join('')}`; };
  const next = () => { const p = cur(); G.fb = null; G.s = null; if (G.j + 1 < p.ks.length) { G.j++; return draw(); }
    if (G.i + 1 < plan.length) { G.i++; G.j = 0; return draw(); }
    $app.onkeydown = null; const n = plan.length;
    tgEndView(mode === 'on' ? '🔁 Ôn xong' : '🟦 Thử thách xong', `<div class="box ${G.pass === n ? 'tgyes' : ''}"><b style="font-size:20px">${G.pass}/${n} câu ${mode === 'on' ? 'giữ được 🟦' : 'thành 🟦 Hiểu'}</b>
      <p style="margin:6px 0 0">${mode === 'on' ? 'Câu chưa qua về ⭐, sẽ làm lại thử thách.' : `Câu 🟦 được hỏi lại sau ${TG_H[0]} ngày, mỗi lần một kiểu thử thách khác.`}</p></div>`); };
  $app.onclick = e => { if (e.target.closest('[data-tgv]')) { $app.onkeydown = null; return tgView(); } const p = cur(), q = p.c.q, m = p.m;
    if (e.target.closest('[data-tgn]')) { next(); return scrollTo(0, 0); }
    if (G.fb) return;
    const c = e.target.closest('[data-tgc]'); if (c) { const v = G.s.co[+c.dataset.tgc], a = m.pos || m.cat, ok = v === a;
      return fin(ok, ok ? '' : m.pos ? `Chỗ trống cần ${a}, không phải ${v}.` : `Hai vế có quan hệ ${a}.`); }   // không lộ từ đáp án: thử thách sau có thể là tự gõ
    if (e.target.closest('[data-tgk]')) { const v = ((document.querySelector('[data-tgi]') || {}).value || '').trim(), ok = tgNorm(v) === tgNorm(q.a);
      return fin(ok, ok ? `“${esc(q.a)}”` : `Bạn gõ “${esc(v)}”. Đáp án: “${esc(q.a)}”.`); }
    const s = e.target.closest('[data-tgs]'); if (s) { const ss = m.docs.flatMap(d => d.ss), ok = tgHit(ss[+s.dataset.tgs], q.ev);
      return fin(ok, `Câu chứa đáp án: “${esc(q.ev)}”`); }
    const l = e.target.closest('[data-tgl]'), r = e.target.closest('[data-tgr]'); if (!l && !r) return; const S2 = G.s;
    if (l && !l.disabled) S2.sl = +l.dataset.tgl; if (r && !r.disabled) S2.sr = +r.dataset.tgr;
    if (S2.sl >= 0 && S2.sr >= 0) { const i = S2.sl, j = S2.sr; S2.sl = S2.sr = -1; const og = q.lg.og;
      if (i === j) { S2.done.add(i); S2.msg = ''; if (S2.done.size === q.opts.length) return fin(!S2.miss, S2.miss ? `Ghép nhầm ${S2.miss} lần.` : ''); }
      else { S2.miss++; S2.msg = `<div class="box tcno"><b>✗ Chưa khớp</b><p style="margin:6px 0 0">“${esc(q.opts[i])}” = ${esc(og[q.opts[i]])}</p></div>`; } }
    draw(); };
  $app.onkeydown = e => { if (e.key === 'Enter' && e.target.matches && e.target.matches('[data-tgi]')) { e.preventDefault(); const b = document.querySelector('[data-tgk]'); b && b.click(); } };
  draw(); scrollTo(0, 0); }

// lối vào ở màn TOEIC (phần 📚 Đề có sẵn), cạnh đề thử trọn
function tgRow() { if (typeof TO === 'undefined' || !TO || !(TO.tron || []).length) return '';
  return `<div class="box hcard" style="margin:12px 0 0"><button class="hrow" data-tgv><span class="ic">🗺</span><span class="t"><b>Chinh phục đề</b><small>Làm đúng hết Phần Đọc của một đề, rồi hiểu từng câu</small></span><span class="chev">›</span></button></div>`; }
document.addEventListener('click', e => { if (S && e.target.closest('[data-tgv]') && !String((window.CUR || {}).view).startsWith(TG_VIEW)) { TG_P = null; tgView(); } });
// thi lượt mở từ hành trình: màn kết quả có nút về hành trình
if (typeof trResOne === 'function') { const _trResOne = trResOne; trResOne = function (rec) { const r = _trResOne.apply(this, arguments);
  if (TG_J && rec && rec.de === TG_J) { const h = $app.querySelector && $app.querySelector('h1'); if (h) h.insertAdjacentHTML('afterend', '<button class="pri" data-tgv style="margin:8px 0">🗺 Về hành trình</button>'); } return r; }; }
