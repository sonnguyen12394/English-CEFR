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
const TG_K = { ld: ['🧩', 'Chỗ trống cần gì?'], ev: ['🔎', 'Dò câu chứa đáp án'], dl: ['🔁', 'Câu nào diễn đạt lại?'], go: ['✍️', 'Tự gõ từ còn thiếu'], ng: ['🔗', 'Ghép phương án với nghĩa'] }, TG_KO = ['ld', 'ev', 'dl', 'go', 'ng'];   // v176 dl: Part 7, ghép nghĩa luôn cuối (lên 🌳 dùng tối đa 1)
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
        if (docs.some(dc => dc.ss.some(s => tgHit(s, q.ev)))) { m.docs = docs; m.ks.push('ev'); }
        if (q.opts.length === 4 && new Set(q.opts).size === 4) m.ks.push('dl'); }   // v176 🔁 diễn đạt lại: câu chứa đáp án ↔ phương án cùng ý
      if (q.sec !== 'p7' && q.gt !== 'insert' && /^[A-Za-z][A-Za-z' -]{0,24}$/.test(q.a) && q.a.trim().split(/\s+/).length <= 3) m.ks.push('go');
      if (all && new Set(q.opts.map(o => og[o])).size === q.opts.length) m.ks.push('ng'); } }
  return P; }
const tgDe = () => { const dc = typeof tgDcDe === 'function' && tgDcDe(), D = ((TO && TO.tron) || []).filter(d => TG_P && TG_P[d.id] && d.id !== dc), c = tgSt().de; return D.some(d => d.id === c) ? c : (D[0] || {}).id; };

// ---------- trạng thái từng câu ----------
let TG_J = null, TG_P = null;   // TG_J: đề đang thi lượt từ hành trình (màn kết quả có nút về) · TG_P: kho đã dựng
const tgJ = de => { const T = tgSt(); T.j = T.j || {}; const J = T.j[de] = T.j[de] || {}; J.c = J.c || {}; J.h = J.h || {}; J.f = J.f || {}; return J; };
function tgJState(de) { const B = trB(de); if (!B) return null; const Q = B.Q.filter(q => TG_SEC.test(q.sec)), E = {};
  const add = (n, at, ok, tm) => { const e = E[n] = E[n] || { at: -1, sai: -1 }; if (at >= e.at) { e.at = at; e.ok = ok; e.tm = !!tm; } if (!ok && at > e.sai) e.sai = at; };
  for (const k of Object.keys(toSt().tronA || {})) { if (k !== de && !k.startsWith(de + ':')) continue; const A = trAGet(de, k); if (!A) continue; const a = String(A.a || '');
    for (const q of Q) { const ch = a[q.n - 1]; if (ch && ch !== '-') add(q.n, A.at || 0, trSt3(q, ch) === 'ok'); } }
  const J = tgJ(de), t = tgDay(), M = (TG_P && TG_P[de]) || {};
  for (const [n, c] of Object.entries(J.c)) if (c && c.s) add(+n, c.at || 0, c.s === 'ok', c.tm);
  // v176 ⭐ tạm (tm): chữa đúng sau khi đọc lời giải; đúng lại ở NGÀY SAU mới là ⭐ thật (chinh phục chỉ tính ⭐ thật)
  return Q.map(q => { const e = E[q.n], h = J.h[q.n], st = !e ? 'chua' : e.ok ? 'ok' : 'sai', tam = st === 'ok' && e.tm, hi = !!(st === 'ok' && !tam && h && h.at >= e.sai);
    return { q, n: q.n, st, tam, xac: !!(tam && dayOf(e.at) < t), at: e ? e.at : 0, hi, h: hi ? h : null, ks: (M[q.n] || {}).ks || [], due: !!(hi && h.d && h.d <= t), f: J.f[q.n] === t }; }); }
const tgJCount = L => ({ n: L.length, ok: L.filter(c => c.st === 'ok' && !c.tam).length, tam: L.filter(c => c.tam).length, sai: L.filter(c => c.st === 'sai').length, chua: L.filter(c => c.st === 'chua').length,
  hi: L.filter(c => c.hi).length, nk: L.filter(c => c.ks.length).length, due: L.filter(c => c.due).length, chac: L.filter(c => c.hi && !c.h.d).length });
// việc kế tiếp: chữa câu sai → thi lượt chưa làm → ôn câu 🟦 đến hạn → làm cho hiểu câu ⭐ (câu trượt hôm nay xếp sau) → xong
// v176: chữa → ✅ xác nhận ⭐ tạm (ngày sau) → thi lượt → ⚔️ tái đấu lượt đã xanh ≥ TG_TD ngày → ôn → 🐉 Boss ẩn → vun cây → xong
const TG_TD = 7, TG_ANN = 3;
function tgTd(de, L) { const J = tgJ(de), td = J.td = J.td || {}, t = tgDay(), G = {};
  for (const c of L) { const g = G[c.q.ck] = G[c.q.ck] || { ck: c.q.ck, cs: [], all: true, last: 0 }; g.cs.push(c); if (c.st !== 'ok' || c.tam) g.all = false; g.last = Math.max(g.last, c.at || 0); }
  return Object.values(G).find(g => g.all && g.last && t - dayOf(Math.max(g.last, td[g.ck] || 0)) >= TG_TD) || null; }
function tgJNext(de, L) { const sai = L.filter(c => c.st === 'sai'), chua = L.filter(c => c.st === 'chua'), due = L.filter(c => c.due), xac = L.filter(c => c.xac);
  const moi = L.filter(c => c.st === 'ok' && !c.tam && !c.hi && c.ks.length).sort((a, b) => a.f - b.f);
  if (sai.length) return { k: 'fix', cs: sai.slice(0, TG_FIXN) };
  if (xac.length) return { k: 'xac', cs: xac.slice(0, TG_FIXN) };
  if (chua.length) { const B = trB(de), ck = chua[0].q.ck, K = trCks(B), c = K[ck], r0 = K.find(z => z.p === 'R'); return { k: 'thi', id: 'c' + c.p + ck, c, r0: r0 ? r0.k : 0, n: L.filter(x => x.q.ck === ck).length, cs: chua.filter(x => x.q.ck === ck) }; }
  const td = tgTd(de, L); if (td) return { k: 'tai', ck: td.ck, cs: td.cs };
  if (due.length) return { k: 'on', cs: due.slice(0, TG_HN) };
  const an = tgAnList(de); if (an.length) return { k: 'an', an };
  if (moi.length) return { k: 'hieu', cs: moi.slice(0, TG_HN) };
  const ds = L.filter(c => c.hi && c.h.d).map(c => c.h.d); return { k: 'win', d: ds.length ? Math.min(...ds) : 0, tam: L.filter(c => c.tam).length }; }
// 🐉 Boss ẩn: tối đa TG_ANN dạng đang chờ, mỗi dạng một câu mới (tgdo.js tgNewQ); dạng hết câu mới thì bỏ khỏi hàng chờ
function tgAnList(de) { if (typeof tgNewQ !== 'function') return []; const T = tgSt(), out = [];
  for (const d of (T.bq || []).slice()) { if (out.length >= TG_ANN) break; const c = tgNewQ(de, d); if (c) out.push(c); else { T.bq = T.bq.filter(x => x !== d); (T.bhet = T.bhet || {})[d] = 1; } }
  return out; }
const tgNs = cs => cs.slice(0, 6).map(c => c.n).join(', ') + (cs.length > 6 ? '…' : '');

// ---------- v172 ⚔️ màn chính: đảo 100 ô + MỘT nút (người sáng lập 14/11/2026: "các trò chơi thiếu sáng tạo và nhàm chán… nghĩ cách làm lại", "tự tính") ----------
// Ưu tiên 1 = đánh Boss từng lượt 10 câu (3 tim, combo, chí mạng khi đúng trong nhịp đề thật) · câu sai thành 👾 quái, hạ bằng bí kíp (lời giải) rồi đánh lại.
// Ưu tiên 2 = đảo: 🌱 đúng → vun bằng thử thách kiến thức thành 🌳 hiểu → qua 3 lần ôn thành 🏡 nhớ chắc; cây đến hạn ôn bị 🐛 sâu, cứu sai thì về 🌱.
const tgDeName = de => (String(trName(de)).match(/^Đề\s*\d+/) || [trName(de)])[0];
const tgFx = () => !tgSt().nofx;
const TG_TILE = { em: ['☁️', 'chưa làm'], no: ['👾', 'quái'], tam: ['🌿', 'đúng tạm, mai xác nhận'], ok: ['🌱', 'đúng'], su: ['🐛', 'cây bị sâu'], hi: ['🌳', 'hiểu'], ch: ['🏡', 'nhớ chắc'] };
const tgTile = c => c.hi ? (c.due ? 'su' : c.h.d ? 'hi' : 'ch') : c.tam ? 'tam' : c.st === 'ok' ? 'ok' : c.st === 'sai' ? 'no' : 'em';
async function tgView() { window.CUR = { view: TG_VIEW }; BACK = null; $app.onkeydown = null; scrollTo(0, 0);
  if (!TG_P) { $app.innerHTML = '<div id="ie"></div><p class="mute">Đang tải các đề…</p>'; await toLoad(); try { if (typeof trProbe9 === 'function') await trProbe9(); if (typeof trLkList === 'function') await trLkList(); } catch (e) {} TG_P = await tgPool(); if (window.CUR.view !== TG_VIEW) return; }   // v170: nạp cả đề riêng (Đề 9–16) đã mở mã trên máy
  if (typeof tgSnap === 'function') tgSnap(); const dcDe = typeof tgDcDe === 'function' && tgDcDe();
  const D = ((TO && TO.tron) || []).filter(d => TG_P[d.id] && d.id !== dcDe), de = tgDe(), L = tgJState(de) || [], C = tgJCount(L), nx = tgJNext(de, L);
  const p1 = C.n ? Math.round(C.ok / C.n * 100) : 0, p2 = C.nk ? Math.round(C.hi / C.nk * 100) : 0, K = {}; for (const c of L) { const t = tgTile(c); K[t] = (K[t] || 0) + 1; }
  const lo = tgSt().lo || {}, chip = d => { const l = tgJState(d.id) || [], w = l.length && l.every(c => c.st === 'ok' && !c.tam); return `<button class="chip${d.id === de ? ' on' : ''}" data-tgde="${esc(d.id)}" aria-pressed="${d.id === de}">${esc(tgDeName(d.id))}${w ? ' 🏆' : ''}${lo[d.id] ? ` · lộ ${lo[d.id]}` : ''}</button>`; };
  const nLk = ((typeof TR !== 'undefined' && TR.lk) || []).filter(r => !((TO && TO.tron) || []).some(d => d.id === r.id)).length;
  const tile = c => { const t = tgTile(c); return `<span class="tgt ${t}" role="img" aria-label="Câu ${c.n}: ${TG_TILE[t][1]}">${TG_TILE[t][0]}</span>`; };
  const big = { fix: [`⚔️ Hạ ${nx.cs ? nx.cs.length : 0} quái 👾`, `Câu ${nx.cs ? tgNs(nx.cs) : ''} · đọc bí kíp rồi đánh lại, phương án đổi chỗ`],
    thi: [`⚔️ Đánh Boss lượt ${nx.c ? nx.c.k - nx.r0 + 1 : ''} · câu ${nx.c ? nx.c.a + '–' + nx.c.b : ''}`, `${nx.n || 0} câu · 3 tim · đúng liền = combo · đúng trong nhịp đề thật = chí mạng`],
    xac: [`✅ Xác nhận ${nx.cs ? nx.cs.length : 0} câu 🌿`, `Câu ${nx.cs ? tgNs(nx.cs) : ''} · hôm qua chữa đúng, hôm nay đúng lại mới thành 🌱`],
    tai: [`⚔️ Boss tái đấu · lượt câu ${nx.cs ? nx.cs[0].n + '–' + nx.cs[nx.cs.length - 1].n : ''}`, `Lượt đã xanh ≥ ${TG_TD} ngày · kiểm còn đúng không · sai thì thành 👾`],
    an: [`🐉 Boss ẩn · ${nx.an ? nx.an.length : 0} câu mới`, 'Câu chưa gặp, cùng dạng câu vừa hiểu · đúng mới là hiểu dạng'],
    on: [`🐛 Cứu ${nx.cs ? nx.cs.length : 0} cây bị sâu`, 'Đến hạn ôn · mỗi cây một thử thách · sai thì cây về 🌱'],
    hieu: [`🌱 Vun ${nx.cs ? nx.cs.length : 0} cây: câu ${nx.cs ? tgNs(nx.cs) : ''}`, 'Mỗi cây 2 thử thách kiến thức để lớn thành 🌳'] }[nx.k];
  const later = nx.d ? nx.d - tgDay() : 0;
  const step = big ? (nx.k === 'thi' ? `<div class="tgarena tgprev">${tgMon(de, '', 84)}<div><b>Boss ${esc(tgDeName(de))}</b><br><span>Đang chờ ở lượt ${nx.c ? nx.c.k - nx.r0 + 1 : ''}</span></div></div>` : '') + `<button class="btnbig" data-tgj="${nx.k}">${big[0]}<small>${big[1]}</small></button>`
    : nx.tam ? `<div class="box"><b>🌿 Hôm nay xong</b><p style="margin:6px 0 0">Mai xác nhận ${nx.tam} câu đã chữa: đúng lại ở ngày sau mới là ⭐ thật.</p></div>`
    : `<div class="box tgyes"><b>🏡 ${esc(tgDeName(de))}: cả đảo đã xanh</b><p style="margin:6px 0 0">${C.chac === C.nk ? 'Mọi câu đã nhớ chắc.' : `Hôm nay xong. Sâu quay lại ${later <= 1 ? 'ngày mai' : 'sau ' + later + ' ngày'}.`} Điểm của đề đã chinh phục cao hơn thực lực; trình độ thật đo bằng đề chưa làm.</p></div><button class="pri" data-tgj="full">▶ Làm lại cả Phần Đọc · 75 phút</button>`;
  $app.innerHTML = `<div id="ie"></div><div class="row top"><button class="link tap" data-tgb>‹ TOEIC</button></div>
    <h1>⚔️ Chinh phục đề</h1><p class="mute" style="margin-top:0">Đánh Boss để làm đúng hết ${C.n} câu Phần Đọc, rồi trồng cây cho cả đảo xanh: mỗi cây là một câu đã hiểu.</p>
    <div class="chips tap">${D.map(chip).join('')}</div>
    ${nLk ? `<button data-tgopen>🔓 Mở thêm ${nLk} đề riêng (cần mã)</button>` : ''}
    ${step}
    ${typeof tgDcBox === 'function' ? tgDcBox(((TO && TO.tron) || []).filter(d => TG_P[d.id]).map(d => d.id)) : ''}
    <div class="box"><div class="row" style="justify-content:space-between;gap:8px"><b>🏝 Đảo ${esc(tgDeName(de))}</b><span class="mute">${C.n} câu</span></div>
      <div class="tgisle">${L.map(tile).join('')}</div>
      <p class="mute" style="margin:6px 0 0;font-size:14px">${Object.keys(TG_TILE).filter(t => K[t]).map(t => `${TG_TILE[t][0]} ${K[t]} ${TG_TILE[t][1]}`).join(' · ')}</p>
      <p style="margin:8px 0 0"><b>⭐ Đúng ${C.ok}/${C.n}</b>${C.tam ? ` <span class="mute">· 🌿 ${C.tam} tạm</span>` : ''}</p><div class="bar"><i style="width:${p1}%;background:var(--good)"></i></div>
      <p style="margin:6px 0 0"><b>🌳 Hiểu ${C.hi}/${C.nk}</b></p><div class="bar"><i style="width:${p2}%;background:var(--accent)"></i></div></div>
    <details class="more"><summary>Cách chơi</summary><p>⚔️ Mỗi lượt 10 câu là một trận, như đề thật. Đúng liền nhiều câu thì combo đánh mạnh hơn (tới ×3). Đúng trong nhịp đề thật (Part 5 ~22 giây, Part 6 ~34, Part 7 ~1 phút) là chí mạng. Chọn dưới 3 giây không tính combo: đọc kỹ rồi hãy chọn. Sai 3 câu là thua trận.</p>
      <p>👾 Câu sai thành quái. Hạ quái: đọc bí kíp (lời giải), rồi đánh lại với phương án đổi chỗ. Đúng thì mọc 🌿 (tạm); hôm sau đúng lại mới thành 🌱.</p>
      <p>⚔️ Lượt đã xanh ${TG_TD} ngày thì Boss tái đấu, kiểm bạn còn đúng không. 🐉 Câu vừa thành 🌳 gọi Boss ẩn: một câu chưa gặp cùng dạng, đúng mới là hiểu dạng đó.</p>
      <p>🌳 Vun cây: 2 thử thách hỏi khác câu đề (🧩 chỗ trống cần gì · ✍️ tự gõ từ · 🔎 chạm câu chứa đáp án · 🔗 ghép phương án với nghĩa). Qua thì cây lớn.</p>
      <p>🐛 Sau ${TG_H.join(', ')} ngày sâu quay lại: qua một thử thách là cứu được cây, qua cả ${TG_H.length} lần thành 🏡 nhớ chắc. Sai thì cây về 🌱. Làm sai câu đó trong đề thì cây chết.</p>
      <div class="row" style="gap:8px;flex-wrap:wrap"><button data-tgfx>${tgFx() ? '✨ Tắt hiệu ứng' : '✨ Bật hiệu ứng'}</button><button data-tgsnd>${tgSnd() ? '🔇 Tắt tiếng' : '🔊 Bật tiếng'}</button></div><p class="mute" style="font-size:14px">iPhone gạt sang im lặng thì không có tiếng.</p></details>
    <p class="mute" style="font-size:14px">Không tính vào điểm đề thử trọn, 📘 Học hay 🔁 Nhớ.</p>`;
  $app.onclick = e => { if (e.target.closest('[data-tgb]')) { EX_PART = 'san'; toeicView(); return; }
    if (typeof tgDcClick === 'function' && tgDcClick(e)) return;
    const c = e.target.closest('[data-tgde]'); if (c) { tgSt().de = c.dataset.tgde; save(); tgView(); return; }
    if (e.target.closest('[data-tgopen]')) return trLkAll(() => { TG_P = null; tgView(); });
    if (e.target.closest('[data-tgfx]')) { const T = tgSt(); T.nofx = T.nofx ? 0 : 1; save(); return tgView(); }
    if (e.target.closest('[data-tgsnd]')) { const T = tgSt(); T.nosnd = T.nosnd ? 0 : 1; save(); tgSfx('ok'); return tgView(); }
    const b = e.target.closest('[data-tgj]'); if (!b) return; const k = b.dataset.tgj;
    if (k === 'thi') return tgBattle(de, nx.cs);
    if (k === 'tai') return tgBattle(de, nx.cs, { td: nx.ck });
    if (k === 'xac') return tgSua(de, nx.cs, 1);
    if (k === 'an') return tgAn(de, nx.an);
    if (k === 'full') { TG_J = de; return trStart(de, 'R'); }
    if (k === 'fix') return tgSua(de, nx.cs);
    if (k === 'on' || k === 'hieu') return tgHieu(de, nx.cs, k); }; }

// ---------- ⚔️ trận Boss: câu theo thứ tự và phương án như đề thật; 3 tim; combo; chí mạng ----------
const TG_FAST = 3;   // chọn dưới 3 giây: không tính combo, không chí mạng (chặn đoán bừa giữ combo)
// ---------- v173 🎨 hình + 🔊 tiếng tự làm (người sáng lập 14/11/2026: "tạo hình ảnh và âm thanh cho hay hơn theo game phổ biến trên thị trường") ----------
// Không lấy hình / tiếng của game khác (bản quyền): Boss là SVG vẽ bằng mã (16 con, mỗi đề một con theo số đề), tiếng tổng hợp bằng Web Audio (không tệp).
// iPhone: gạt chuông sang im lặng thì Web Audio cũng im. Tắt tiếng / hiệu ứng ở "Cách chơi".
const tgSnd = () => !tgSt().nosnd;
let TG_AC = null;
function tgTone(f0, f1, dur, type, vol, at) { const ac = TG_AC, t = ac.currentTime + (at || 0), o = ac.createOscillator(), g = ac.createGain(); o.type = type || 'square';
  o.frequency.setValueAtTime(f0, t); if (f1) o.frequency.exponentialRampToValueAtTime(f1, t + dur); g.gain.setValueAtTime(vol || 0.12, t); g.gain.exponentialRampToValueAtTime(0.001, t + dur);
  o.connect(g); g.connect(ac.destination); o.start(t); o.stop(t + dur + 0.03); }
function tgNoise(dur, vol, at) { const ac = TG_AC, t = ac.currentTime + (at || 0), n = Math.floor(ac.sampleRate * dur), b = ac.createBuffer(1, n, ac.sampleRate), d = b.getChannelData(0);
  for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / n); const src = ac.createBufferSource(), g = ac.createGain(), f = ac.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = 1400;
  src.buffer = b; g.gain.value = vol; src.connect(f); f.connect(g); g.connect(ac.destination); src.start(t); }
const TG_SFX = {
  hit: () => { tgNoise(0.09, 0.35); tgTone(520, 150, 0.14, 'square', 0.1); },
  crit: () => { tgNoise(0.12, 0.45); tgTone(620, 120, 0.16, 'square', 0.12); tgTone(1320, 2640, 0.18, 'triangle', 0.1, 0.08); tgTone(1760, 0, 0.25, 'sine', 0.08, 0.2); },
  combo: lv => [0, 1, 2].slice(0, Math.min(lv, 3)).forEach(i => tgTone([660, 880, 1175][i], 0, 0.12, 'triangle', 0.09, 0.12 + i * 0.07)),
  miss: () => { tgTone(240, 70, 0.38, 'sawtooth', 0.1); tgNoise(0.15, 0.2, 0.02); },
  ok: () => { tgTone(880, 0, 0.1, 'sine', 0.12); tgTone(1320, 0, 0.16, 'sine', 0.1, 0.08); },
  no: () => tgTone(170, 120, 0.2, 'square', 0.08),
  grow: () => [523, 659, 784, 1047].forEach((f, i) => tgTone(f, 0, 0.16, 'sine', 0.1, i * 0.07)),
  win: () => { [523, 659, 784].forEach((f, i) => tgTone(f, 0, 0.16, 'triangle', 0.14, i * 0.13)); tgTone(1047, 0, 0.5, 'triangle', 0.14, 0.39); tgTone(1568, 0, 0.5, 'sine', 0.06, 0.39); },
  lose: () => [392, 330, 262, 196].forEach((f, i) => tgTone(f, f * 0.97, 0.26, 'sawtooth', 0.08, i * 0.2)) };
function tgSfx(k, a) { if (!tgSnd()) return; try { const AC = window.AudioContext || window.webkitAudioContext; if (!AC || !TG_SFX[k]) return; TG_AC = TG_AC || new AC(); if (TG_AC.state === 'suspended') TG_AC.resume(); TG_SFX[k](a); } catch (e) {} }
// Boss SVG: dáng (4) × số mắt (1–3) × sừng × màu theo số đề; mắt chớp, lắc nhẹ khi đứng (CSS)
const TG_BODY = ['M60 18C92 18 104 44 104 70C104 96 86 106 60 106C34 106 16 96 16 70C16 44 28 18 60 18Z', 'M22 62C22 34 40 18 60 18C80 18 98 34 98 62L98 106L86 96L73 106L60 96L47 106L34 96L22 106Z',
  'M40 24H80Q102 24 102 46V84Q102 106 80 106H40Q18 106 18 84V46Q18 24 40 24Z', 'M60 12L72 30L94 24L90 46L108 60L90 74L94 96L72 90L60 108L48 90L26 96L30 74L12 60L30 46L26 24L48 30Z'];
function tgMon(de, cls, sz) { const n = +String(de).replace(/[^0-9]/g, '') || 0, h = (n * 67 + 20) % 360, b = TG_BODY[n % 4], e = 1 + (n % 3), c1 = `hsl(${h} 70% 56%)`, c2 = `hsl(${h} 60% 34%)`, c3 = `hsl(${h} 85% 78%)`;
  const ex = e === 1 ? [[60, 56, 15]] : e === 2 ? [[46, 56, 10], [74, 56, 10]] : [[40, 58, 8], [60, 48, 9], [80, 58, 8]];
  const eye = ([x, y, r]) => `<g class="tgeye"><circle cx="${x}" cy="${y}" r="${r}" fill="#fff" stroke="${c2}" stroke-width="2"/><circle cx="${x + r * 0.2}" cy="${y + r * 0.15}" r="${r * 0.5}" fill="#1b1430"/><circle cx="${x + r * 0.35}" cy="${y - r * 0.15}" r="${r * 0.18}" fill="#fff"/></g>`;
  const horn = n % 2 ? `<path d="M34 34L28 8L48 26Z M86 34L92 8L72 26Z" fill="${c2}"/>` : '';
  return `<span class="tgmon ${cls || ''}" aria-hidden="true"><svg viewBox="0 0 120 120" width="${sz || 110}" height="${sz || 110}"><ellipse cx="60" cy="112" rx="34" ry="6" fill="#000" opacity=".25"/>${horn}
    <path d="${b}" fill="${c1}" stroke="${c2}" stroke-width="3"/><ellipse cx="60" cy="86" rx="26" ry="16" fill="${c3}" opacity=".7"/>${ex.map(eye).join('')}
    <circle cx="30" cy="74" r="6" fill="#ff7aa8" opacity=".55"/><circle cx="90" cy="74" r="6" fill="#ff7aa8" opacity=".55"/>
    <path d="M44 80Q60 94 76 80" fill="#1b1430" stroke="${c2}" stroke-width="2"/><path d="M50 82L54 88L57 83Z M70 82L66 88L63 83Z" fill="#fff"/></svg></span>`; }
const TG_CFC = ['#ff5d73', '#ffc145', '#3ddc97', '#4cc3ff', '#b28dff', '#ff9f43'];
const tgConf = () => tgFx() ? `<div class="tgcf" aria-hidden="true">${Array.from({ length: 30 }, (_, i) => `<i style="left:${(i * 37) % 100}%;background:${TG_CFC[i % 6]};animation-delay:${(i % 10) * 0.08}s;--r:${(i * 53) % 360}deg"></i>`).join('')}</div>` : '';

let TG_TOK = null;
const tgSec = q => Math.max(15, Math.round(((typeof TR_SPQ !== 'undefined' && TR_SPQ[q.sec]) || 0.75) * 60));
// v176 o.td = số lượt: Boss tái đấu, phương án đổi chỗ ngẫu nhiên ở ~50% câu (đo G3: nhớ chữ cái hay hiểu)
const tgShufDiff = a => { if (a.every(o => /^\[\d\]$/.test(o))) return null; for (let k = 0; k < 8; k++) { const b = shuf([...a]); if (b.some((x, i) => x !== a[i])) return b; } return null; };
function tgBattle(de, cs, bo) { bo = bo || {}; window.CUR = { view: TG_VIEW + '-boss' }; $app.onkeydown = null; const J = tgJ(de).c, n = cs.length, max = 20 * n, tok = TG_TOK = {};
  const G = { i: 0, hp: max, tim: 3, cb: 0, best: 0, cr: 0, ok: 0, res: null, tq: Date.now(), quai: [], tr: typeof tgTran === 'function' ? tgTran(bo.td != null ? 't' : 'b', de) : 0,
    op: cs.map(c => { const b = bo.td != null && Math.random() < 0.5 ? tgShufDiff(c.q.opts) : null; return b ? { o: b, sh: 1 } : { o: c.q.opts, sh: 0 }; }) };
  const card = r => `<div class="tgarena${r && tgFx() ? (r.ok ? ' hit' : ' hurt') : ''}"><div class="tgarow"><b>Boss ${esc(tgDeName(de))}</b><span aria-label="${G.tim} tim">${'❤️'.repeat(G.tim)}${'🖤'.repeat(3 - G.tim)}</span></div>
    <div class="tgmonw">${tgMon(de, r && r.ok && tgFx() ? 'hit' : '')}${r && r.ok ? `<span class="tgdmg${r.cr ? ' cr' : ''}" aria-hidden="true">−${r.dmg}${r.cr ? '!' : ''}</span>` : ''}</div>
    <div class="tghpb" role="img" aria-label="Máu Boss ${Math.max(0, G.hp)}/${max}"><i style="width:${Math.max(0, G.hp) / max * 100}%"></i><span>${Math.max(0, G.hp)}/${max}</span></div>
    <div class="tgarow"><span class="tgcombo${G.cb >= 2 ? ' on' : ''}">🔥 combo ×${Math.min(Math.max(G.cb, 1), 3)}</span><span>Câu ${Math.min(G.i + 1, n)}/${n}</span></div></div>`;
  const draw = () => { const q = cs[G.i].q, r = G.res, top = `<div id="ie"></div><div class="row top"><button class="link tap" data-tgv>‹ Đảo</button><span class="mute">${esc(tgDeName(de))} · câu ${q.n}</span></div>`;
    if (r) { $app.innerHTML = top + card(r) + (r.ok ? `<div class="box tgyes${tgFx() ? ' tgpop' : ''}" aria-live="polite"><b style="font-size:22px">💥 −${r.dmg}${r.cr ? ' · ⚡ Chí mạng!' : ''}</b>${r.fast ? '<p style="margin:4px 0 0">Nhanh quá: chưa tính combo. Đọc kỹ rồi hãy chọn.</p>' : ''}</div>`
        : `<div class="box tcno${tgFx() ? ' tgpop' : ''}" aria-live="polite"><b style="font-size:20px">💔 Mất 1 tim</b><p style="margin:4px 0 0">Bạn chọn “${esc(r.o)}”. Đáp án: <b>${esc(q.a)}</b>.</p><p style="margin:4px 0 0">Câu ${q.n} thành 👾 quái: hạ sau trận bằng bí kíp.</p></div>`)
        + `<button class="pri" data-tgn>${G.tim && G.i + 1 < n ? 'Đòn tiếp ›' : 'Kết thúc trận'}</button>`; return; }
    const T = tgSec(q), OP = G.op[G.i].o; G.tq = Date.now();
    $app.innerHTML = top + card(null) + `<div class="tgtime" aria-hidden="true"><i style="animation-duration:${T}s"></i></div><p class="mute" style="margin:2px 0 8px;font-size:14px">⚡ Đúng trong ${T} giây = chí mạng</p>`
      + (q.sec === 'p7' ? q.foot : '') + tgCtx(q) + OP.map((o, k) => `<button class="tcc" data-tgf="${k}">${'ABCD'[k]}. ${esc(o)}</button>`).join(''); };
  const end = () => { TG_TOK = null; if (typeof tgTranEnd === 'function') tgTranEnd(G.tr); if (bo.td != null) { const T0 = tgJ(de); (T0.td = T0.td || {})[bo.td] = Date.now(); } const win = G.hp <= 0, lost = !G.tim, st = tgSt().st, z = st.boss = st.boss || { r: 0, win: 0 }; z.r++; if (win && !lost) z.win++; save(); tgSfx(win && !lost ? 'win' : 'lose');
    tgEndView(lost ? '💀 Thua trận' : win ? '🏆 Hạ Boss!' : '💨 Boss chạy thoát', `${win && !lost ? tgConf() : ''}<div class="tgarena tgend">${tgMon(de, win && !lost ? 'ko' : 'laugh')}</div><div class="box ${win && !lost ? 'tgyes' : ''}">
      <b style="font-size:20px">${G.ok}/${G.i} câu đúng</b><p style="margin:6px 0 0">🔥 Combo cao nhất ×${Math.min(G.best, 3)} · ⚡ ${G.cr} chí mạng${G.quai.length ? ` · 👾 ${G.quai.length} quái mới` : ''}</p>
      <p style="margin:6px 0 0">${lost ? `Hết tim. ${n - G.i ? `${n - G.i} câu còn lại của lượt sẽ đánh lại sau khi hạ quái.` : ''}` : win ? 'Câu đúng đã mọc 🌱 trên đảo.' : `Boss còn ${Math.max(0, G.hp)} máu. Đúng liền nhiều câu, đúng trong nhịp đề thật để đánh mạnh hơn.`}</p></div>`); };
  const next = () => { G.res = null; if (!G.tim || G.i + 1 >= n) return end(); G.i++; draw(); scrollTo(0, 0); };
  $app.onclick = e => { if (e.target.closest('[data-tgv]')) { TG_TOK = null; return tgView(); }
    if (e.target.closest('[data-tgn]')) return next();
    const f = e.target.closest('[data-tgf]'); if (!f || G.res) return; const q = cs[G.i].q, P = G.op[G.i], o = P.o[+f.dataset.tgf], ok = o === q.a, dt = (Date.now() - G.tq) / 1000, fast = dt < TG_FAST;
    J[q.n] = { s: ok ? 'ok' : 'sai', at: Date.now() }; tgStat('boss', ok); if (typeof tgLog === 'function') tgLog(de, q.n, bo.td != null ? 't' : 'b', ok, P.sh, dt, 0);
    if (ok) { G.ok++; if (!fast) G.cb++; G.best = Math.max(G.best, G.cb); const cr = !fast && dt <= tgSec(q), dmg = 10 * Math.min(Math.max(G.cb, 1), 3) * (cr ? 2 : 1); if (cr) G.cr++; G.hp -= dmg; G.res = { ok, dmg, cr, fast }; }
    else { G.tim--; G.cb = 0; G.quai.push(q.n); G.res = { ok, o }; }
    save(); tgSfx(ok ? (G.res.cr ? 'crit' : 'hit') : 'miss'); if (ok && G.cb >= 2) tgSfx('combo', G.cb); draw(); scrollTo(0, 0); const r = G.res;
    if (ok && tgFx() && G.tim && G.i + 1 < n) setTimeout(() => { if (TG_TOK === tok && G.res === r) next(); }, 1200); };   // đúng: tự sang câu sau cho có nhịp
  draw(); scrollTo(0, 0); }

// ---------- phần dùng chung: ngữ cảnh câu, lời giải ----------
const tgCtx = q => q.sec === 'p6' ? q.head.replace(/<p class="mute">[^<]*<\/p>/, '') + `<p><b>${q.q}</b></p>` : q.sec === 'p7' ? `<p style="font-size:17px"><b>${q.q}</b></p>` : `<p style="font-size:18px;line-height:1.6">${q.q}</p>`;
const tgDocs = q => q.sec === 'p7' ? `<details class="more"><summary>Văn bản</summary>${q.foot}</details>` : '';
// lời giải: câu có đáp án (Part 5) / câu hỏi + đáp án (Part 7), nghĩa 4 phương án, vì sao, cấu trúc, dịch
function tgSol(q) { const lg = q.lg || {}, og = lg.og || {};
  const sent = q.sec === 'p6' ? '' : q.sec === 'p7' ? `<p style="font-size:17px"><b>${q.q}</b> <span class="mute">· ✓ ${esc(q.a)}</span></p>` : `<p style="font-size:17px;line-height:1.6">${q.q.replace('<b>-------</b>', `<b>${esc(q.a)}</b>`)}</p>`;
  return `${sent}<div class="box">${q.opts.map(o => `<p style="margin:4px 0"><b>${esc(o)}</b>${o === q.a ? ' ✓' : ''}${og[o] ? ` · <span class="mute">${esc(og[o])}</span>` : ''}</p>`).join('')}</div>
    <div class="box rvgt"><p style="margin:0"><b>Vì sao:</b> ${esc(lg.ly || q.why || '')}</p>${lg.ct ? `<p style="margin:6px 0 0"><b>Cấu trúc:</b> ${esc(lg.ct)}</p>` : ''}${lg.dich ? `<p style="margin:6px 0 0"><b>Dịch:</b> ${esc(lg.dich)}</p>` : ''}</div>`; }
const tgTop = (de, q, h2) => `<div id="ie"></div><div class="row top"><button class="link tap" data-tgv>‹ Đảo</button><span class="mute">${esc(tgDeName(de))} · câu ${q.n}</span></div><h2 style="margin:4px 0 8px">${h2}</h2>`;
const tgEndView = (h2, body) => { window.CUR = { view: 'tg-xong' }; $app.onkeydown = null; $app.onclick = null; scrollTo(0, 0);
  $app.innerHTML = `<div id="ie"></div><h2>${h2}</h2>${body}<button class="pri" data-tgv>▶ Về đảo</button>`; };
const tgStat = (k, ok) => { const s = tgSt().st, z = s[k] = s[k] || { n: 0, ok: 0 }; z.n++; if (ok) z.ok++; };

// ---------- ① chữa câu sai: đọc lời giải từng câu → làm lại cả nhóm, phương án xáo thứ tự ----------
// v176 xac = ✅ xác nhận câu ⭐ tạm (bỏ bước bí kíp; đúng = ⭐ thật). Chữa thường: đúng = ⭐ tạm (tm), mai xác nhận
function tgSua(de, cs, xac) { window.CUR = { view: TG_VIEW + '-sua' }; $app.onkeydown = null; const J = tgJ(de).c, G = { ph: xac ? 1 : 0, i: 0, res: null, ok: 0, op: null, t0: Date.now(), tr: typeof tgTran === 'function' ? tgTran(xac ? 'x' : 's', de) : 0 };
  const H = xac ? '✅ Xác nhận' : '⚔️ Đánh lại quái';
  const draw = () => { const q = cs[G.i].q, n = cs.length;
    if (G.ph === 0) { $app.innerHTML = tgTop(de, q, `📜 Bí kíp hạ quái ${G.i + 1}/${n}`) + `<p class="mute" style="margin-top:0">Đọc kỹ vì sao. Đọc xong ${n} bí kíp thì đánh lại, phương án đổi chỗ.</p>`
        + (q.sec === 'p6' ? tgCtx(q) : '') + tgSol(q) + tgDocs(q) + `<button class="pri" data-tgn>${G.i + 1 < n ? 'Câu tiếp ›' : `⚔️ Đánh lại ${n} quái`}</button>`; return; }
    G.op = G.op || (q.sec === 'p7' && q.opts.every(o => /^\[\d\]$/.test(o)) ? [...q.opts] : shuf([...q.opts])); if (!G.res && !G.shown) { G.shown = 1; G.t0 = Date.now(); }
    if (G.res) { $app.innerHTML = tgTop(de, q, `${H} ${G.i + 1}/${n}`) + `<div class="box ${G.res.ok ? 'tgyes' : 'tcno'}"><b>${G.res.ok ? (xac ? `✅ Câu ${q.n} thành 🌱` : `💥 Hạ quái · câu ${q.n} mọc 🌿 · mai đúng lại thành 🌱`) : '👾 Quái còn sống · đánh lại sau'}</b>${G.res.note ? `<p style="margin:4px 0 0">${G.res.note}</p>` : ''}</div>`
        + (G.res.ok ? '' : (q.sec === 'p6' ? tgCtx(q) : '') + tgSol(q) + tgDocs(q)) + `<button class="pri" data-tgn>${G.i + 1 < n ? 'Câu tiếp ›' : 'Xem kết quả'}</button>`; return; }
    $app.innerHTML = tgTop(de, q, `${H} ${G.i + 1}/${n}`) + tgCtx(q) + G.op.map((o, k) => `<button class="tcc" data-tgf="${k}">${'ABCD'[k]}. ${esc(o)}</button>`).join('') + (q.sec === 'p7' ? q.foot : ''); };
  $app.onclick = e => { if (e.target.closest('[data-tgv]')) return tgView(); const q = cs[G.i].q;
    const f = e.target.closest('[data-tgf]'); if (f && G.ph === 1 && !G.res) { const o = G.op[+f.dataset.tgf], ok = o === q.a; if (ok) G.ok++; J[q.n] = ok && !xac ? { s: 'ok', at: Date.now(), tm: 1 } : { s: ok ? 'ok' : 'sai', at: Date.now() }; tgStat('lam', ok);
      if (typeof tgLog === 'function') tgLog(de, q.n, xac ? 'x' : 's', ok, G.op.some((v, i) => v !== q.opts[i]), (Date.now() - G.t0) / 1000, 0); G.shown = 0; save(); tgSfx(ok ? 'hit' : 'no');
      G.res = { ok, note: ok ? '' : `Bạn chọn “${esc(o)}”.` }; draw(); scrollTo(0, 0); return; }
    if (!e.target.closest('[data-tgn]')) return;
    if (G.ph === 0) { if (G.i + 1 < cs.length) G.i++; else { G.ph = 1; G.i = 0; } draw(); return scrollTo(0, 0); }
    if (G.i + 1 >= cs.length) { tgSfx(G.ok === cs.length ? 'win' : 'no'); if (typeof tgTranEnd === 'function') tgTranEnd(G.tr); return tgEndView(xac ? `✅ Xác nhận ${G.ok}/${cs.length} câu` : G.ok === cs.length ? '💥 Hạ hết quái' : '⚔️ Hết lượt đánh', `${G.ok === cs.length ? tgConf() : ''}<div class="box ${G.ok === cs.length ? 'tgyes' : ''}"><b style="font-size:20px">${G.ok}/${cs.length} quái bị hạ</b><p style="margin:6px 0 0">${G.ok ? (xac ? 'Câu đúng thành 🌱 (⭐ thật).' : 'Câu đúng mọc 🌿. Mai đúng lại mới thành 🌱.') : ''}${G.ok < cs.length ? ' Quái còn sống sẽ đánh lại.' : ''}</p></div>`); }
    G.i++; G.res = null; G.op = null; draw(); scrollTo(0, 0); };
  draw(); scrollTo(0, 0); }

// ---------- v176 🐉 Boss ẩn: câu CHƯA gặp cùng dạng với câu vừa thành 🌳 (đo H2: hiểu dạng hay chỉ nhớ câu). Sai → 📘 bài học của dạng ----------
function tgAn(de, cs) { window.CUR = { view: TG_VIEW + '-an' }; $app.onkeydown = null; const G = { i: 0, res: null, ok: 0, op: null, t0: 0, tr: typeof tgTran === 'function' ? tgTran('n', de) : 0 };
  const les = q => { try { return typeof hlLes === 'function' && typeof hlTo === 'function' ? hlLes(hlTo(q)) : null; } catch (e) { return null; } };
  const draw = () => { const c = cs[G.i], q = c.q, n = cs.length, nm = tgDangName(tgDang(q));
    const top = `<div id="ie"></div><div class="row top"><button class="link tap" data-tgv>‹ Đảo</button><span class="mute">🐉 ${G.i + 1}/${n}</span></div><h2 style="margin:4px 0 4px">🐉 Boss ẩn · ${esc(nm)}</h2>
      <p class="mute" style="margin:0 0 8px">Câu bạn chưa gặp, cùng dạng câu vừa hiểu.</p>`;
    if (G.res) { const L = !G.res.ok && les(q);
      $app.innerHTML = top + `<div class="box ${G.res.ok ? 'tgyes' : 'tcno'}${tgFx() ? ' tgpop' : ''}" aria-live="polite"><b>${G.res.ok ? `🐉 Hạ Boss ẩn · bạn làm được dạng này ở câu mới` : '🐉 Boss ẩn còn sống · dạng này chưa chắc'}</b>${G.res.ok ? '' : `<p style="margin:4px 0 0">Bạn chọn “${esc(G.res.v)}”.</p>`}</div>`
        + (G.res.ok ? '' : (q.sec === 'p6' ? tgCtx(q) : '') + tgSol(q) + tgDocs(q) + (L ? `<button data-tgal>📘 Học lại dạng: ${esc(L.d.t || nm)}</button>` : ''))
        + `<button class="pri" data-tgn>${G.i + 1 < n ? 'Câu tiếp ›' : 'Xem kết quả'}</button>`; return; }
    G.op = G.op || (q.opts.every(o => /^\[\d\]$/.test(o)) ? [...q.opts] : shuf([...q.opts])); G.t0 = Date.now();
    $app.innerHTML = top + (q.sec === 'p7' ? q.foot + `<p style="font-size:17px"><b>${q.q}</b></p>` : tgCtx(q)) + G.op.map((o, k) => `<button class="tcc" data-tgf="${k}">${'ABCD'[k]}. ${esc(o)}</button>`).join(''); };
  $app.onclick = e => { if (e.target.closest('[data-tgv]')) return tgView(); const c = cs[G.i], q = c.q;
    if (e.target.closest('[data-tgal]')) { const L = les(q); if (L) return xlView(L.ex, L.sk, L.i, () => tgView()); }
    const f = e.target.closest('[data-tgf]'); if (f && !G.res) { const v = G.op[+f.dataset.tgf], ok = v === q.a; if (ok) G.ok++;
      tgBnDone(c, ok); tgLog(de, c.id, 'n', ok, 1, (Date.now() - G.t0) / 1000, 0); tgStat('an', ok); save(); tgSfx(ok ? 'crit' : 'no'); G.res = { ok, v }; draw(); return scrollTo(0, 0); }
    if (!e.target.closest('[data-tgn]')) return;
    if (G.i + 1 >= cs.length) { if (typeof tgTranEnd === 'function') tgTranEnd(G.tr); tgSfx(G.ok === cs.length ? 'win' : 'no');
      return tgEndView(`🐉 ${G.ok}/${cs.length} Boss ẩn bị hạ`, `${G.ok === cs.length ? tgConf() : ''}<div class="box ${G.ok === cs.length ? 'tgyes' : ''}"><p style="margin:0">${G.ok === cs.length ? 'Bạn làm được các dạng này ở câu chưa gặp.' : 'Dạng sai: học lại bài học của dạng, rồi Boss ẩn sẽ quay lại với câu mới khác.'}</p></div>`); }
    G.i++; G.res = null; G.op = null; draw(); scrollTo(0, 0); };
  draw(); scrollTo(0, 0); }

// ---------- ② thử thách kiến thức: mode 'hieu' = 2 thử thách để thành 🟦 · 'on' = 1 thử thách khác kiểu lần trước để giữ 🟦 ----------
function tgPick1(c) { const ks = c.ks, last = c.h && c.h.k, i = ks.indexOf(last); return ks.length < 2 || i < 0 ? ks[0] : ks[(i + 1) % ks.length]; }
function tgHieu(de, cs, mode) { window.CUR = { view: TG_VIEW + '-hieu' }; const J = tgJ(de), M = TG_P[de], t = tgDay();
  const plan = cs.map(c => ({ c, m: M[c.n], ks: mode === 'on' ? [tgPick1(c)] : c.ks.slice(0, 2), r: [] }));
  const G = { i: 0, j: 0, fb: null, s: null, pass: 0, t0: Date.now(), tr: typeof tgTran === 'function' ? tgTran(mode === 'on' ? 'o' : 'h', de) : 0 };
  const cur = () => plan[G.i], title = () => { const p = cur(); return `${mode === 'on' ? '🐛 Cứu cây' : '🌱 Vun cây'} ${G.i + 1}/${plan.length} · thử thách ${G.j + 1}/${p.ks.length}`; };
  const fin = (ok, note) => { const p = cur(), k = p.ks[G.j]; p.r.push({ k, ok, note }); tgStat(k, ok);
    if (typeof tgLog === 'function') tgLog(de, p.c.n, (mode === 'on' ? 'o:' : 'h:') + k, ok, 0, (Date.now() - G.t0) / 1000, mode === 'on' ? ((J.h[p.c.n] || {}).lv || 1) : 0); save(); G.fb = { ok, note }; tgSfx(!ok ? 'no' : G.j + 1 >= p.ks.length && p.r.every(x => x.ok) ? 'grow' : 'ok'); draw(); scrollTo(0, 0); };
  // xong mọi thử thách của một câu: ghi 🟦 / lịch ôn
  const close = () => { const p = cur(), n = p.c.n, all = p.r.every(r => r.ok), last = p.ks[p.ks.length - 1];
    if (mode === 'hieu') { if (all) { J.h[n] = { at: Date.now(), lv: 1, d: t + TG_H[0], k: last }; delete J.f[n]; G.pass++; if (typeof tgBq === 'function') tgBq(p.c.q); } else J.f[n] = t; }
    else { const h = J.h[n]; if (all && h) { h.lv++; h.d = h.lv <= TG_H.length ? t + TG_H[h.lv - 1] : 0; h.k = last; G.pass++; } else { delete J.h[n]; J.f[n] = t; } }
    save(); p.done = all; };
  const draw = () => { const p = cur(), q = p.c.q, m = p.m, k = p.ks[G.j], og = (q.lg || {}).og || {};
    if (G.fb) { const lastK = G.j + 1 >= p.ks.length; if (lastK && p.done == null) close();
      const h = J.h[p.c.n], res = !lastK ? '' : mode === 'hieu' ? (p.done ? `🌳 Cây câu ${q.n} đã lớn · sâu quay lại sau ${TG_H[0]} ngày` : `Cây câu ${q.n} vẫn là 🌱 · vun lại sau`)
        : (p.done ? (h && h.d ? `🌳 Cứu được cây · sâu quay lại sau ${h.d - t} ngày` : '🏡 Cây thành nhà: nhớ chắc câu này') : `Cây câu ${q.n} về 🌱 · vun lại 2 thử thách`);
      $app.innerHTML = tgTop(de, q, title()) + `<div class="box ${G.fb.ok ? 'tgyes' : 'tcno'}${tgFx() ? ' tgpop' : ''}" aria-live="polite"><b>${G.fb.ok ? '✓ Đúng' : '✗ Chưa đúng'}</b>${G.fb.note ? `<p style="margin:4px 0 0">${G.fb.note}</p>` : ''}${res ? `<p style="margin:6px 0 0"><b>${res}</b></p>` : ''}</div>`
        + (lastK ? (q.sec === 'p6' ? tgCtx(q) : '') + tgSol(q) + tgDocs(q) : '') + `<button class="pri" data-tgn>${!lastK ? 'Thử thách tiếp ›' : G.i + 1 < plan.length ? 'Câu tiếp ›' : 'Xem kết quả'}</button>`; return; }
    const head = tgTop(de, q, title()) + `<p class="tgs" style="margin-top:0">${TG_K[k][0]} ${TG_K[k][1]}</p>`; G.t0 = Date.now();
    if (k === 'dl') { G.s = G.s || { op: shuf([...q.opts]) };   // v176 🔁 chỉ hiện câu chứa đáp án (không hiện câu hỏi): nhận ra cách nói khác cùng ý
      $app.innerHTML = head + `<p class="mute" style="margin-top:0">Câu này trong bài:</p><p style="font-size:18px;line-height:1.6;margin:4px 0"><b>“${esc(q.ev)}”</b></p><p style="margin:8px 0 4px"><b>Câu nào nói cùng ý?</b></p>`
        + G.s.op.map((o, i) => `<button class="tcc" data-tgdl="${i}">${esc(o)}</button>`).join(''); return; }
    if (k === 'ld') { G.s = G.s || { co: m.pos ? shuf([m.pos, ...shuf(TG_POS.filter(x => x !== m.pos)).slice(0, 3)]) : shuf([m.cat, ...shuf(Object.keys(TG_CAT).filter(x => x !== m.cat)).slice(0, 3)]) };
      $app.innerHTML = head + `<p style="font-size:18px;margin:4px 0"><b>${m.pos ? 'Chỗ trống cần loại từ nào?' : 'Hai vế quanh chỗ trống có quan hệ gì?'}</b></p>${tgCtx(q)}`
        + G.s.co.map((c, i) => `<button class="tcc" data-tgc="${i}">${esc(c[0].toUpperCase() + c.slice(1))}</button>`).join(''); return; }
    if (k === 'go') { const lv = mode === 'on' ? ((J.h[p.c.n] || {}).lv || 1) : 0, dich = lv ? '' : (q.lg || {}).dich;   // v176 gợi ý giảm dần: vun cây đủ · ôn lần 1 bỏ nghĩa câu · ôn lần 2+ chỉ số ký tự
      $app.innerHTML = head + `<p class="mute" style="margin-top:0">Không có phương án. Gõ từ / cụm điền vào chỗ trống.</p>${tgCtx(q)}${dich ? `<p class="mute">Nghĩa: ${esc(dich)}</p>` : ''}
        <p class="mute">Gợi ý: ${lv >= 2 ? '' : `bắt đầu bằng “${esc(q.a[0])}”, `}${q.a.length} ký tự.</p><input class="tin" data-tgi autocomplete="off" autocapitalize="off" spellcheck="false" style="width:100%" aria-label="Từ còn thiếu"><button class="pri" data-tgk>Kiểm</button>`;
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
    $app.onkeydown = null; const n = plan.length; if (typeof tgTranEnd === 'function') tgTranEnd(G.tr);
    if (G.pass === n) tgSfx('win'); tgEndView(mode === 'on' ? '🐛 Cứu cây xong' : '🌳 Vun cây xong', `${G.pass === n ? tgConf() : ''}<div class="box ${G.pass === n ? 'tgyes' : ''}"><b style="font-size:20px">${G.pass}/${n} cây ${mode === 'on' ? 'được cứu' : 'đã lớn thành 🌳'}</b>
      <p style="margin:6px 0 0">${mode === 'on' ? 'Cây chưa cứu được về 🌱, sẽ vun lại.' : `Sâu quay lại sau ${TG_H[0]} ngày, mỗi lần một kiểu thử thách khác.`}</p></div>`); };
  $app.onclick = e => { if (e.target.closest('[data-tgv]')) { $app.onkeydown = null; return tgView(); } const p = cur(), q = p.c.q, m = p.m;
    if (e.target.closest('[data-tgn]')) { next(); return scrollTo(0, 0); }
    if (G.fb) return;
    const c = e.target.closest('[data-tgc]'); if (c) { const v = G.s.co[+c.dataset.tgc], a = m.pos || m.cat, ok = v === a;
      return fin(ok, ok ? '' : m.pos ? `Chỗ trống cần ${a}, không phải ${v}.` : `Hai vế có quan hệ ${a}.`); }   // không lộ từ đáp án: thử thách sau có thể là tự gõ
    if (e.target.closest('[data-tgk]')) { const v = ((document.querySelector('[data-tgi]') || {}).value || '').trim(), ok = tgNorm(v) === tgNorm(q.a);
      return fin(ok, ok ? `“${esc(q.a)}”` : `Bạn gõ “${esc(v)}”. Đáp án: “${esc(q.a)}”.`); }
    const dl = e.target.closest('[data-tgdl]'); if (dl) { const v = G.s.op[+dl.dataset.tgdl], ok = v === q.a; return fin(ok, ok ? `“${esc(q.a)}”` : `Bạn chọn “${esc(v)}”. Cùng ý: “${esc(q.a)}”.`); }
    const s = e.target.closest('[data-tgs]'); if (s) { const ss = m.docs.flatMap(d => d.ss), ok = tgHit(ss[+s.dataset.tgs], q.ev);
      return fin(ok, `Câu chứa đáp án: “${esc(q.ev)}”`); }
    const l = e.target.closest('[data-tgl]'), r = e.target.closest('[data-tgr]'); if (!l && !r) return; const S2 = G.s;
    if (l && !l.disabled) S2.sl = +l.dataset.tgl; if (r && !r.disabled) S2.sr = +r.dataset.tgr;
    if (S2.sl >= 0 && S2.sr >= 0) { const i = S2.sl, j = S2.sr; S2.sl = S2.sr = -1; const og = q.lg.og;
      if (i === j) { S2.done.add(i); S2.msg = ''; if (S2.done.size < q.opts.length) tgSfx('ok'); if (S2.done.size === q.opts.length) return fin(!S2.miss, S2.miss ? `Ghép nhầm ${S2.miss} lần.` : ''); }
      else { S2.miss++; tgSfx('no'); S2.msg = `<div class="box tcno"><b>✗ Chưa khớp</b><p style="margin:6px 0 0">“${esc(q.opts[i])}” = ${esc(og[q.opts[i]])}</p></div>`; } }
    draw(); };
  $app.onkeydown = e => { if (e.key === 'Enter' && e.target.matches && e.target.matches('[data-tgi]')) { e.preventDefault(); const b = document.querySelector('[data-tgk]'); b && b.click(); } };
  draw(); scrollTo(0, 0); }

// lối vào ở màn TOEIC (phần 📚 Đề có sẵn), cạnh đề thử trọn
function tgRow() { if (typeof TO === 'undefined' || !TO || !(TO.tron || []).length) return '';
  return `<div class="box hcard" style="margin:12px 0 0"><button class="hrow" data-tgv><span class="ic">⚔️</span><span class="t"><b>Chinh phục đề</b><small>Đánh Boss từng lượt 10 câu, trồng cây cho cả đảo xanh</small></span><span class="chev">›</span></button></div>`; }
document.addEventListener('click', e => { if (S && e.target.closest('[data-tgv]') && !String((window.CUR || {}).view).startsWith(TG_VIEW)) { TG_P = null; tgView(); } });
// thi lượt mở từ hành trình: màn kết quả có nút về hành trình
if (typeof trResOne === 'function') { const _trResOne = trResOne; trResOne = function (rec) { const r = _trResOne.apply(this, arguments); try { if (TG_P && typeof tgSnap === 'function') tgSnap(); } catch (e) {}
  if (TG_J && rec && rec.de === TG_J) { const h = $app.querySelector && $app.querySelector('h1'); if (h) h.insertAdjacentHTML('afterend', '<button class="pri" data-tgv style="margin:8px 0">⚔️ Về đảo</button>'); } return r; }; }
