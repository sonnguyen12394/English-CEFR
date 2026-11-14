// v176 📊 Đo game 🗺 Chinh phục đề theo bộ tiêu chí docs/TIEU-CHI-GAME-TOEIC.md (specs/019-game-do-tieu-chi; người sáng lập 14/11/2026:
//   "Tôi cần bộ tiêu chí để đánh giá chứ không phải phân tích bằng lời", "dựa vào bộ tiêu chí ấy xem xét lại game", "Ok").
// Ghi (trong S.to.tc, xem data-model.md): lg nhật ký câu [ngày, đề, câu, việc, ok, đổi chỗ, giây, mức ôn] (TG_LGN dòng) · ag số tổng hợp giữ mãi ·
//   tr trận [việc, đề, bắt đầu, xong | 0] (xong = 0 và quá TG_ABAN = bỏ dở) · dy ngày có chơi · dc đề đối chứng · bn / bq / dg / lo của 🐉 Boss ẩn.
// Việc trong nhật ký: b Boss · t tái đấu · x xác nhận ⭐ tạm · s chữa · h:<kiểu> vun cây · o:<kiểu> ôn · n Boss ẩn.
// Chỉ đo: không ghi điểm đề thử, không đổi bản đồ điểm, không tạo thẻ học, không đổi luật đo CEFR.
const TG_LGN = 2000, TG_TRN = 300, TG_DYN = 400, TG_ABAN = 30 * 60000, TG_REQ = ['G1', 'G2', 'H2', 'H3', 'H4', 'N1'];
const tgAg = (k, bad) => { const T = tgSt(), A = T.ag = T.ag || {}, z = A[k] = A[k] || [0, 0]; z[0]++; if (bad) z[1]++; };
// ok: đúng · sh: phương án đổi chỗ so với đề · lv: mức ôn trước lượt này (TG_H.length = mốc 21 ngày)
function tgLog(de, n, k, ok, sh, sec, lv) { const T = tgSt(), t = tgDay(); T.lg = T.lg || [];
  T.lg.push([t, de || '', n, k, ok ? 1 : 0, sh ? 1 : 0, Math.round(sec || 0), lv || 0]); if (T.lg.length > TG_LGN) T.lg.splice(0, T.lg.length - TG_LGN);
  const g = String(k).split(':')[0]; tgAg(g, !ok); if (g === 't') tgAg('t' + (sh ? 1 : 0), !ok); if (g === 'o' && lv >= TG_H.length) tgAg('o21', !ok);
  T.dy = T.dy || []; if (!T.dy.includes(t)) { T.dy.push(t); if (T.dy.length > TG_DYN) T.dy.shift(); }
  if (de) { const J = tgJ(de); if (!J.t0) J.t0 = t; if (J.ld !== t) { J.ld = t; J.nd = (J.nd || 0) + 1; } const h = typeof n === 'number' && J.h[n]; if (h && !h.d) tgAg('n2', !ok); } }
// trận: mã = lúc bắt đầu
function tgTran(k, de) { const T = tgSt(), at = Date.now(); T.tr = T.tr || []; T.tr.push([k, de || '', at, 0]); if (T.tr.length > TG_TRN) T.tr.shift(); save(); return at; }
function tgTranEnd(at) { const r = (tgSt().tr || []).find(x => x[2] === at); if (r && !r[3]) { r[3] = Date.now(); save(); } }

// ---------- kết quả Phần Đọc đã làm (bài làm 📋: cả đề hoặc chỉ phần Đọc) ----------
function tgRead(de) { const B = trB(de), o = toSt().tronA || {}; if (!B) return []; const Q = B.Q.filter(q => TG_SEC.test(q.sec)), out = [];
  for (const k of [de, de + ':R']) { if (!o[k]) continue; const A = trAGet(de, k); if (!A) continue; const a = String(A.a || ''); let ok = 0;
    for (const q of Q) { const ch = a[q.n - 1]; if (ch && ch !== '-' && trSt3(q, ch) === 'ok') ok++; } out.push({ at: A.at || 0, ok, n: Q.length }); }
  return out.sort((x, y) => x.at - y.at); }
// chụp kết quả vào hành trình (bài làm 📋 chỉ giữ lần gần nhất mỗi đề nên phải chụp khi thấy): chinh phục (w), làm lại sau 7 ngày (g2), đề đối chứng trước / sau
function tgSnap() { if (!S || !TG_P) return; const T = tgSt(), dc = T.dc, now = Date.now(); let ch = 0;
  for (const de of Object.keys(TG_P)) { if (dc && de === dc.de) continue; const J = tgJ(de), L = tgJState(de) || [];
    if (!J.w && L.length && L.every(c => c.st === 'ok' && !c.tam)) { J.w = now; J.wn = J.nd || 1; ch = 1; }
    if (J.w && !J.g2) { const r = tgRead(de).find(x => x.at >= J.w + 7 * DAY); if (r) { J.g2 = { at: r.at, ok: r.ok, n: r.n }; ch = 1; } } }
  if (dc) { const R = tgRead(dc.de);
    if (!dc.pre) { const r = dc.cu ? R.filter(x => x.at < dc.at).pop() || R.find(x => x.at >= dc.at) : R.find(x => x.at >= dc.at); if (r) { dc.pre = { at: r.at, ok: r.ok }; ch = 1; } }
    const ws = Object.keys(TG_P).filter(d => d !== dc.de).map(d => tgJ(d).w).filter(Boolean).sort((a, b) => a - b);
    if (ws.length >= 2 && !dc.p2) { dc.p2 = ws[1]; ch = 1; }
    if (dc.p2 && dc.pre && !dc.post) { const r = R.find(x => x.at >= dc.p2 && x.at > dc.pre.at); if (r) { dc.post = { at: r.at, ok: r.ok }; ch = 1; } } }
  if (ch) save(); }

// ---------- ⚖️ đề đối chứng (Q2: người học tự chọn; đề đã làm thì cảnh báo, không chặn) ----------
let TG_DCO = false;   // ô chọn đề đối chứng đang mở (trong phiên)
const tgDcDe = () => { const dc = S && tgSt().dc; return dc ? dc.de : null; };
function tgDcBox(D) { const T = tgSt(), dc = T.dc, nm = d => esc(tgDeName(d));
  if (!dc) { if (!TG_DCO) return `<button class="link tap" data-tgdc="show">⚖️ Chọn đề đối chứng để đo game có giúp bạn không ›</button>`;
    return `<div class="box"><b>⚖️ Chọn đề đối chứng</b><p style="margin:6px 0">Một đề KHÔNG chơi trong game. Bạn làm Phần Đọc đề này trước khi chơi, rồi làm lại sau khi chinh phục 2 đề, để biết game có giúp bạn làm đề mới không.</p>
      <div class="chips tap">${D.map(d => `<button class="chip" data-tgdc="${esc(d)}">${nm(d)}${tgRead(d).length ? ' · đã làm' : ''}</button>`).join('')}</div>
      <p class="mute" style="font-size:14px;margin:6px 0 0">Nên chọn đề bạn chưa làm. Đề đã làm thì kết quả đo kém tin cậy.</p><button class="link tap" data-tgdc="no">Đóng</button></div>`; }
  const ws = Object.keys(TG_P || {}).filter(d => d !== dc.de && tgJ(d).w).length;
  if (!dc.pre) return `<div class="box"><b>⚖️ Đề đối chứng: ${nm(dc.de)}</b>${dc.cu ? '<p class="mute" style="margin:4px 0">⚠️ Bạn đã làm đề này trước: kết quả đo kém tin cậy.</p>' : ''}
    <p style="margin:6px 0">Làm Phần Đọc đề này trước khi chơi để có mốc so sánh.</p><button data-tgdc="run">▶ Làm Phần Đọc · 75 phút</button><button class="link tap" data-tgdc="doi">Đổi đề đối chứng</button></div>`;
  const line = `trước ${dc.pre.ok}/100${dc.post ? ` · sau ${dc.post.ok}/100 (${dc.post.ok - dc.pre.ok >= 0 ? '+' : ''}${dc.post.ok - dc.pre.ok} câu)` : ''}`;
  if (dc.p2 && !dc.post) return `<div class="box"><b>⚖️ Đề đối chứng ${nm(dc.de)}: ${line}</b><p style="margin:6px 0">Bạn đã chinh phục ${ws} đề. Làm lại Phần Đọc đề đối chứng để biết game có giúp bạn làm đề mới không.</p><button data-tgdc="run">▶ Làm lại Phần Đọc · 75 phút</button></div>`;
  return `<p class="mute" style="font-size:14px">⚖️ Đề đối chứng ${nm(dc.de)}: ${line}${dc.p2 ? '' : ` · làm lại khi chinh phục 2 đề (hiện ${ws})`}</p>`; }
// true = đã xử lý
function tgDcClick(e) { const b = e.target.closest('[data-tgdc]'); if (!b) return false; const T = tgSt(), v = b.dataset.tgdc;
  if (v === 'no' || v === 'show') { TG_DCO = v === 'show'; tgView(); return true; }
  if (v === 'doi') { if (T.dc && !T.dc.pre) delete T.dc; save(); tgView(); return true; }
  if (v === 'run') { TG_J = T.dc.de; trStart(T.dc.de, 'R'); return true; }
  T.dc = { de: v, at: Date.now(), cu: tgRead(v).length ? 1 : 0 }; if (tgSt().de === v) delete tgSt().de; tgSnap(); save(); tgView(); return true; }

// ---------- 🐉 Boss ẩn: nguồn câu mới cùng dạng (Q1: kho tự do → đề chưa làm → đề chơi ít; trừ đề đang chơi, đề đối chứng, câu đã gặp) ----------
const tgDang = q => q.sec === 'p5' ? (q.x && q.x.t ? 'p5:' + q.x.t : null) : q.sec === 'p6' ? (q.gt ? 'p6:' + q.gt : null) : q.sec === 'p7' ? (q.qt ? 'p7:' + q.qt : null) : null;
function tgKhoFree() { if (typeof TO === 'undefined' || !TO || !TO.p5) return []; const used = new Set(), seen = toSt().r || {}, out = [];
  for (const d of TO.tron || []) if (!d.f) for (const s of ['p5', 'p6', 'p7']) for (const id of d[s] || []) used.add(id);
  for (const x of TO.p5) if (!used.has(x.id) && !seen[x.id]) out.push({ id: 'k:' + x.id, q: toP5Q(x) });
  for (const x of TO.p6 || []) if (!used.has(x.id) && !seen[x.id]) toP6Qs(x).forEach((q, i) => out.push({ id: `k:${x.id}:${i}`, q }));
  for (const x of TO.p7 || []) if (!used.has(x.id) && !seen[x.id]) toP7Qs(x).forEach((q, i) => out.push({ id: `k:${x.id}:${i}`, q }));
  return out; }
// đề khác: câu chưa trả lời lần nào (bài làm 📋 hoặc game)
function tgDeFree(de) { const B = trB(de); if (!B) return []; const J = tgJ(de).c, o = toSt().tronA || {}, done = new Set(Object.keys(J).map(Number));
  for (const k of Object.keys(o)) { if (k !== de && !k.startsWith(de + ':')) continue; const A = trAGet(de, k), a = String((A && A.a) || ''); for (let i = 0; i < a.length; i++) if (a[i] && a[i] !== '-') done.add(i + 1); }
  return B.Q.filter(q => TG_SEC.test(q.sec) && !done.has(q.n)).map(q => ({ id: `d:${de}:${q.n}`, q, de })); }
function tgNewQ(cur, dang) { const T = tgSt(), bn = T.bn = T.bn || {}, dc = tgDcDe(), ok = c => !bn[c.id] && tgDang(c.q) === dang;
  const k = tgKhoFree().filter(ok); if (k.length) return k[0];
  const D = Object.keys(TG_P || {}).filter(d => d !== cur && d !== dc).map(d => ({ d, n: Object.keys(tgJ(d).c).length + tgRead(d).length * 100 })).sort((a, b) => a.n - b.n);
  for (const { d } of D) { const c = tgDeFree(d).find(ok); if (c) return c; }
  return null; }
// câu vừa đạt 🌳: xếp dạng chờ Boss ẩn (dạng đã đúng 2 lần, lần cuối đúng thì thôi)
function tgBq(q) { const d = tgDang(q); if (!d) return; const T = tgSt(), Q = T.bq = T.bq || [], g = (T.dg || {})[d]; if (Q.includes(d) || (g && g[1] >= 2 && g[3])) return; Q.push(d); if (Q.length > 20) Q.shift(); }
function tgBnDone(c, ok) { const T = tgSt(), d = tgDang(c.q), g = (T.dg = T.dg || {})[d] = (T.dg[d] || [0, 0, 0, 0]); g[0]++; if (ok) g[1]++; g[2] = tgDay(); g[3] = ok ? 1 : 0;
  (T.bn = T.bn || {})[c.id] = [tgDay(), ok ? 1 : 0, d]; if (c.de) { T.lo = T.lo || {}; T.lo[c.de] = (T.lo[c.de] || 0) + 1; } T.bq = (T.bq || []).filter(x => x !== d); }
const TG_DGN = { p5: 'Part 5', p6: 'Part 6', p7: 'Part 7' };
const tgDangName = d => { const [s, t] = String(d).split(':'); const n = s === 'p5' && typeof TO_T5 !== 'undefined' && TO_T5[t] ? TO_T5[t] : t; return `${TG_DGN[s] || s} · ${n}`; };

// ---------- tính bộ tiêu chí ----------
// mỗi đề: H1 = % câu có ≥ 2 thử thách (tối đa 1 ghép nghĩa: ng luôn đứng cuối thứ tự nên 2 thử thách đầu có nhiều nhất 1 ng) · V2 = % ghép nghĩa trong thử thách lên 🌳
function tgShape(de) { const M = (TG_P || {})[de] || {}, v = Object.values(M); let two = 0, pk = 0, ng = 0;
  for (const m of v) { const p = m.ks.slice(0, 2); if (p.length >= 2) two++; pk += p.length; ng += p.filter(k => k === 'ng').length; }
  return { n: v.length, h1: v.length ? Math.round(two / v.length * 100) : 0, v2: pk ? Math.round(ng / pk * 100) : 0 }; }
function tgCrit() { const T = tgSt(), A = T.ag || {}, dc = T.dc, R = [], pct = (a, b) => b ? Math.round(a / b * 100) : 0, t = tgDay();
  const add = (m, ten, so, ng, kq, thieu) => R.push({ m, req: TG_REQ.includes(m), ten, so, ng, kq, thieu });
  const D = Object.keys(TG_P || {}).filter(d => !dc || d !== dc.de), W = D.filter(d => tgJ(d).w);
  if (W.length) { const b = Math.min(...W.map(d => tgJ(d).wn || 1)); add('G1', 'Chinh phục được đề', `${b} ngày chơi`, '≤ 14 ngày chơi', b <= 14 ? 'ok' : 'no'); }
  else { const top = Math.max(0, ...D.map(d => (tgJState(d) || []).filter(c => c.st === 'ok' && !c.tam).length)); add('G1', 'Chinh phục được đề', '—', '≤ 14 ngày chơi', 'na', `cần 1 đề 100/100 ⭐ thật · tốt nhất hiện ${top}/100`); }
  const G2 = W.map(d => tgJ(d).g2).filter(Boolean).sort((a, b) => a.at - b.at).pop();
  add('G2', 'Giữ được kết quả', G2 ? `${G2.ok}/${G2.n}` : '—', '≥ 95/100 khi làm lại sau 7 ngày', G2 ? (G2.ok / G2.n >= 0.95 ? 'ok' : 'no') : 'na', G2 ? '' : W.length ? 'làm lại cả Phần Đọc 75 phút, cách lúc chinh phục ≥ 7 ngày' : 'cần 1 đề chinh phục trước');
  const a0 = A.t0 || [0, 0], a1 = A.t1 || [0, 0], g3 = pct(a0[0] - a0[1], a0[0]) - pct(a1[0] - a1[1], a1[0]);
  add('G3', 'Không nhớ chữ cái đáp án', a0[0] >= 20 && a1[0] >= 20 ? `${g3} điểm %` : '—', '≤ 5 điểm %', a0[0] >= 20 && a1[0] >= 20 ? (g3 <= 5 ? 'ok' : 'no') : 'na', `cần ≥ 20 câu tái đấu mỗi nhóm · hiện giữ thứ tự ${a0[0]}, đổi chỗ ${a1[0]}`);
  const SH = Object.keys(TG_P || {}).map(d => ({ d, ...tgShape(d) })), w1 = SH.reduce((a, b) => (b.h1 < a.h1 ? b : a), SH[0] || { h1: 0, d: '' }), w2 = SH.reduce((a, b) => (b.v2 > a.v2 ? b : a), SH[0] || { v2: 0, d: '' });
  add('H1', 'Đủ thử thách 🌳', SH.length ? `thấp nhất ${w1.h1}% (${tgDeName(w1.d)})` : '—', '≥ 90% câu mỗi đề', SH.length ? (w1.h1 >= 90 ? 'ok' : 'no') : 'na', 'chưa tải đề');
  const dg = Object.values(T.dg || {}), hn = dg.reduce((a, g) => a + g[0], 0), hk = dg.reduce((a, g) => a + g[1], 0);
  add('H2', 'Làm được câu mới cùng dạng', hn ? `${pct(hk, hn)}% (${hk}/${hn})` : '—', '≥ 80%, ≥ 10 câu', hn >= 10 ? (pct(hk, hn) >= 80 ? 'ok' : 'no') : 'na', `cần ≥ 10 câu 🐉 Boss ẩn · hiện ${hn}`);
  const rel = dc && dc.cu ? ' · kém tin cậy: đề đã làm trước' : '';
  add('H3', 'Lên điểm ở đề mới', dc && dc.pre && dc.post ? `${dc.post.ok - dc.pre.ok >= 0 ? '+' : ''}${dc.post.ok - dc.pre.ok} câu${rel}` : '—', 'tăng ≥ 6 câu', dc && dc.pre && dc.post ? (dc.post.ok - dc.pre.ok >= 6 ? 'ok' : 'no') : 'na',
    !dc ? 'chưa chọn đề đối chứng' : !dc.pre ? 'chưa làm đề đối chứng lần "trước"' : `chưa làm lần "sau" (cần chinh phục 2 đề, hiện ${W.length})`);
  const h4 = G2 && dc && dc.post ? G2.ok - dc.post.ok : null;
  add('H4', 'Không học vẹt', h4 != null ? `chênh ${h4} câu${rel}` : '—', '≤ 15 câu', h4 != null ? (h4 <= 15 ? 'ok' : 'no') : 'na', `cần G2 và lần "sau" của đề đối chứng`);
  const o = A.o21 || [0, 0]; add('N1', 'Còn nhớ sau 21 ngày', o[0] ? `${pct(o[0] - o[1], o[0])}% (${o[0]} lượt)` : '—', '≥ 80%, ≥ 20 lượt', o[0] >= 20 ? (pct(o[0] - o[1], o[0]) >= 80 ? 'ok' : 'no') : 'na', `cần ≥ 20 lượt ôn mốc 21 ngày · hiện ${o[0]}`);
  const n2 = A.n2 || [0, 0]; add('N2', '🏡 không bị sai lại', n2[0] ? `sai ${pct(n2[1], n2[0])}% (${n2[0]} lượt)` : '—', '≤ 10%, ≥ 20 lượt', n2[0] >= 20 ? (pct(n2[1], n2[0]) <= 10 ? 'ok' : 'no') : 'na', `cần ≥ 20 lượt trên câu 🏡 · hiện ${n2[0]}`);
  add('V1', 'Thử thách không lộ đáp án', 'kiểm bằng test C81', '0 lộ', 'test');
  add('V2', 'Không dồn vào ghép nghĩa', SH.length ? `cao nhất ${w2.v2}% (${tgDeName(w2.d)})` : '—', '≤ 30% mỗi đề', SH.length ? (w2.v2 <= 30 ? 'ok' : 'no') : 'na', 'chưa tải đề');
  const dy = (T.dy || []).slice().sort((a, b) => a - b), d0 = dy[0];
  if (d0 != null && t >= d0 + 14) { const k1 = dy.filter(x => x < d0 + 7).length, k2 = dy.filter(x => x >= d0 + 7 && x < d0 + 14).length; add('E1', 'Chơi đều', `tuần 1: ${k1} · tuần 2: ${k2} ngày`, '≥ 3 ngày mỗi tuần', k1 >= 3 && k2 >= 3 ? 'ok' : 'no'); }
  else add('E1', 'Chơi đều', '—', '≥ 3 ngày mỗi tuần, 2 tuần đầu', 'na', d0 == null ? 'chưa chơi' : `cần đủ 14 ngày từ ngày chơi đầu · hiện ${t - d0 + 1}`);
  const now = Date.now(), tr = (T.tr || []).filter(r => r[3] || now - r[2] > TG_ABAN), ab = tr.filter(r => !r[3]).length;
  add('E2', 'Không bỏ giữa chừng', tr.length ? `bỏ ${pct(ab, tr.length)}% (${ab}/${tr.length} trận)` : '—', '≤ 20%, ≥ 10 trận', tr.length >= 10 ? (pct(ab, tr.length) <= 20 ? 'ok' : 'no') : 'na', `cần ≥ 10 trận · hiện ${tr.length}`);
  const ks = T.ks && T.ks.a, km = ks ? Math.round(ks.reduce((a, b) => a + b, 0) / ks.length * 10) / 10 : 0;   // v177: 3 câu hỏi nhanh trong game (tgvui.js)
  add('E3', 'Thấy hay', ks ? `trung bình ${km} / 5 (giỏi lên ${ks[0]} · tự chọn ${ks[1]} · chơi tiếp ${ks[2]})` : '—', 'trung bình ≥ 4 / 5', ks ? (km >= 4 ? 'ok' : 'no') : 'na', 'chơi 5 trận thì game hỏi 3 câu nhanh');
  add('K1', 'Chạy trên iPhone thật', 'người sáng lập xác nhận', 'hình, tiếng chạy', 'tay');
  add('K2', 'Không lỗi trang, vùng bấm ≥ 44 px', 'test tự động', 'đạt', 'test');
  const rq = R.filter(r => r.req), ok = rq.filter(r => r.kq === 'ok').length;
  return { R, ok, need: rq.length, dat: ok === rq.length, SH }; }
const TG_KQ = { ok: '🟢', no: '🔴', na: '⚪', test: '🧪', tay: '✍️' };
async function tgCritView(back) { window.CUR = { view: 'tg-tieuchi' }; $app.onkeydown = null; scrollTo(0, 0);
  if (!TG_P) { $app.innerHTML = '<p class="mute">Đang tải các đề…</p>'; await toLoad(); try { if (typeof trProbe9 === 'function') await trProbe9(); if (typeof trLkList === 'function') await trLkList(); } catch (e) {} TG_P = await tgPool(); }
  tgSnap(); const C = tgCrit(), T = tgSt(), lo = Object.entries(T.lo || {}), dg = Object.entries(T.dg || {});
  const row = r => `<div class="box" style="margin:6px 0"><div class="row" style="justify-content:space-between;gap:8px"><b>${TG_KQ[r.kq]} ${r.m} · ${esc(r.ten)}${r.req ? ' ✔' : ''}</b></div>
    <p style="margin:4px 0 0">${esc(r.so)} <span class="mute">· cần ${esc(r.ng)}</span></p>${r.kq === 'na' && r.thieu ? `<p class="mute" style="margin:2px 0 0;font-size:14px">${esc(r.thieu)}</p>` : ''}</div>`;
  $app.innerHTML = `<div class="row top"><button class="link tap" data-tgcb>‹ Dữ liệu</button></div><h1>🗺 Bộ tiêu chí game</h1>
    <div class="box ${C.dat ? 'tgyes' : ''}"><b style="font-size:20px">Game: ${C.dat ? 'ĐẠT' : 'CHƯA ĐẠT'} · ${C.ok}/${C.need} tiêu chí bắt buộc</b>
      <p class="mute" style="margin:6px 0 0;font-size:14px">✔ = bắt buộc · 🟢 đạt · 🔴 trượt · ⚪ chưa đủ dữ liệu · 🧪 kiểm bằng test · ✍️ ghi tay. Số đo của máy này. Ngưỡng là ý kiến của Claude, xét lại 2/2027.</p></div>
    ${C.R.map(row).join('')}
    <details class="more"><summary>Từng đề: thử thách 🌳</summary>${C.SH.map(s => `<p style="margin:4px 0">${esc(tgDeName(s.d))}: ${s.h1}% câu có 2 thử thách · ghép nghĩa ${s.v2}%</p>`).join('')}</details>
    <details class="more"><summary>🐉 Boss ẩn theo dạng${lo.length ? ' · đề đã lộ câu' : ''}</summary>${dg.length ? dg.map(([d, g]) => `<p style="margin:4px 0">${esc(tgDangName(d))}: đúng ${g[1]}/${g[0]}</p>`).join('') : '<p class="mute">Chưa có.</p>'}
      ${lo.length ? `<p style="margin:8px 0 4px"><b>Đề đã lộ câu</b> (không còn là đề mới để đo):</p>${lo.map(([d, n]) => `<p style="margin:2px 0">${esc(tgDeName(d))}: ${n} câu</p>`).join('')}` : ''}</details>
    <p class="mute" style="font-size:14px">Bộ tiêu chí: docs/TIEU-CHI-GAME-TOEIC.md. Không tính vào điểm đề thử, 📘 Học hay 🔁 Nhớ.</p>`;
  $app.onclick = e => { if (e.target.closest('[data-tgcb]')) return back ? back() : (typeof backup === 'function' ? backup() : null); }; }
// kết quả cả đề / chỉ phần Đọc: chụp ngay (bài làm 📋 chỉ giữ lần gần nhất)
for (const fn of ['trRes'])   // trResOne: trochoi.js gọi tgSnap trong lớp bọc của nó
   if (typeof window[fn] === 'function') { const f0 = window[fn]; window[fn] = function () { const r = f0.apply(this, arguments); try { if (TG_P) tgSnap(); } catch (e) {} return r; }; }
