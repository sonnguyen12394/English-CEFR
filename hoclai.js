// v146 🎯 Sai ở đâu · học lại gì (specs/009-sai-hoc-lai; người sáng lập 8/11/2026: "Khi làm đề xong nếu sai thì có cách nào phát hiện và đối chiếu
// với các bài học có sẵn để học và ôn lại"). Màn kết quả của mọi đề / bài trong 🎯 Luyện đề (đề thử IELTS / TOEIC / Cambridge, bài có sẵn, đề AI,
// đề soạn sẵn, dạng đề thật Cambridge): câu sai gom theo DẠNG câu (IELTS, TOEIC) / PHẦN đề (Cambridge) → mỗi dạng một dòng "sai a/b"
// + 📘 Học lại (bài học của dạng, baihoc.js xlView; nút ‹ Kết quả về lại màn này) + 🏋️ Luyện dạng này (nút `go` của bài học).
// Xem câu sai: câu, bạn chọn, đáp án, vì sao, 📍 câu chứa đáp án, 📌 từ chưa học trong câu đó (lưu Sổ từ, ôn trong 🔁 ôn chung).
// S.xs[id bài học] = { at, b, n, src }: dạng VỪA SAI (≥ HL_MIN câu sai và đúng < HL_BAD) → danh sách 📘 Bài học (xlBlock) đưa lên, ghi "vừa sai · xem lại".
//   Hết cờ khi học lại bài đó (S.exl[id].at mới hơn) hoặc một lượt sau đúng ≥ HL_OK dạng đó (≥ 3 câu). Ngưỡng là ý kiến của Claude, chưa có dữ liệu.
// S.xsc = { n: lượt có câu sai đã hiện ô, k: lượt có bấm 📘 / 🏋️ từ ô, l, p, w: số lần bấm 📘 / 🏋️ / 📌 }: để đo (🛠 Công cụ).
// Chỉ đọc kết quả: KHÔNG đổi luật đo (📘 Học / 🔁 Nhớ / Thi chuyển cấp), KHÔNG đổi bản đồ (ô, luật đủ chắc, nhóm đang chữa).
const HL_IE_R = { 'R-tf': 'tf', 'R-yn': 'yn', 'R-h': 'h', 'R-mi': 'mi', 'R-mf': 'mf', 'R-se': 'se', 'R-mc': 'mc', 'R-comp': 'comp', 'R-sum': 'sum', 'R-dia': 'dia', 'R-sa': 'sa', 'R-gt': 'gt', 'R-para': 'para' };
const HL_IE_L = { form: 'form', tab: 'form', flow: 'form', sent: 'sent', sa: 'sent', mc: 'mc', mc2: 'mc2', map: 'map', match: 'match' };   // k của câu Nghe (ln-…) → bài học
const HL_IE_LT = { 'L-form': 'form', 'L-note': 'form', 'L-sa': 'sent', 'L-mc': 'mc', 'L-map': 'map', 'L-match': 'match' };   // câu đề AI / soạn sẵn chỉ có ty; L-note (Part 4 ghi chú) học như điền phiếu / bảng / lưu đồ
const HL_P2 = { wh: 'p2', yn: 'p2-yn', or: 'p2-or', req: 'p2-req', stmt: 'p2-st' }, HL_Q34 = { gist: 'gist', next: 'next', imp: 'imp', graphic: 'g' };
const HL_MIN = 2, HL_BAD = 0.6, HL_OK = 0.75, HL_MAXN = 60, HL_ROWS = 3, HL_WN = 5;
let HL_LC = {}, HL_W = [], HL_SEEN = 0, HL_HIT = 0, HL_WQ = 0;
const HL_WQMAX = 30;   // v147: đề trọn 200 câu có thể sai rất nhiều câu: chỉ gợi ý từ chưa học cho 30 câu sai đầu (dạng sai nhiều trước)

// ---------- câu → bài học: [kỳ thi, kỹ năng, khoá bài học (d.k) hoặc số thứ tự phần] ----------
function hlIe(q) { const t = String(q.ty || ''), k = String(q.k || '').replace(/^ln-/, '');
  if (t === 'R-gt' || t === 'R-para') return ['ielts', 'R', HL_IE_R[t]];
  if (t.startsWith('R-')) return ['ielts', 'R', typeof IE_RQK !== 'undefined' && IE_RQK.includes(k) ? k : HL_IE_R[t]];
  if (t.startsWith('L-')) return ['ielts', 'L', HL_IE_L[k] || HL_IE_LT[t]];
  return null; }
// TOEIC: Part + nhãn dạng (bộ dựng tools/build-toeic.mjs; câu đề AI / soạn sẵn: deai.js daiQs gắn nhãn bằng luật chung toqt.js). Part 2 chọn trúng bẫy → bài "bẫy Part 2"
function hlTo(q, ans) { const s = q.sec, x = q.x || {};
  if (s === 'p1') return ['toeic', 'L', x.k === 'scene' ? 'p1o' : 'p1'];
  if (s === 'p2') { const i = ans ? 'ABC'.indexOf(String(ans)) : -1; return ['toeic', 'L', x.tr && i >= 0 && x.tr[i] ? 'p2t' : HL_P2[x.ty] || 'p2']; }   // 'ABC'.indexOf('') = 0: chưa chọn thì không tính bẫy
  if (s === 'p3' || s === 'p4') return ['toeic', 'L', HL_Q34[q.qt] || s];
  if (s === 'p5') return x.t ? ['toeic', 'R', 'p5-' + x.t] : null;
  if (s === 'p6') return ['toeic', 'R', q.gt === 'insert' ? 'p6-ins' : 'p6'];
  if (s === 'p7') { const t = q.qt; return ['toeic', 'R', t === 'syn' ? 'p7-syn' : t === 'insert' ? 'p7-ins' : t === 'intent' ? 'p7c' : ['not', 'true', 'infer'].includes(t) ? 'p7-inf' : x.docs && x.docs.length > 1 ? 'p7m' : 'p7']; }
  return null; }
// số phần trong nhãn ("Phần 2, 4: nghe" → [2, 4]; "Phần 1–2" → [1, 2])
const hlNums = s => { const m = String(s || '').match(/Phần\s+([\d,\s–-]+)/); if (!m) return []; const a = (m[1].match(/\d+/g) || []).map(Number);
  if (/[–-]/.test(m[1]) && a.length === 2) { const o = []; for (let i = a[0]; i <= a[1]; i++) o.push(i); return o; } return a; };
// Cambridge: phần của đề (MOCK[lv].papers[pi].parts[i]) = bài học thứ i của màn bài thi (xlCb: các phần đứng đầu danh sách)
//   r.pt + r.part: câu của đề thử / làm riêng phần (mkResult) · ctx.uk: dạng đề thật (uRun) · ctx.dang: đề AI / soạn sẵn (số phần trong tên dạng DAI_CB, không có thì khoá CB_AI)
function hlCb(r, ctx) { const lv = ctx.lv, C = typeof MOCK !== 'undefined' && MOCK[lv]; if (!C) return null; const at = (pi, i) => ['cambridge', lv + '~' + pi, i];
  if (r.pt) { const pi = C.papers.findIndex(p => p.t === r.pt), p = C.papers[pi], i = p ? p.parts.findIndex(([lab]) => lab === r.part) : -1; return i >= 0 ? at(pi, i) : null; }
  const ok = p => !p.speak && (ctx.sk === 'nghe' ? /Nghe/.test(p.t) : ctx.sk === 'doc' ? /Đọc/.test(p.t) : true);
  if (ctx.dang && typeof DAI_CB !== 'undefined') { const D = DAI_CB[lv] || DAI_CB[String(lv).replace(/p$/, '')] || {}, e = Object.values(D).flat().find(x => x[0] === ctx.dang && x[1] === ctx.sk), N = e ? hlNums(e[2]) : [];
    for (let pi = 0; pi < C.papers.length; pi++) { const p = C.papers[pi]; if (!ok(p)) continue; const i = p.parts.findIndex(([lab]) => hlNums(lab).some(n => N.includes(n))); if (N.length && i >= 0) return at(pi, i); } }
  const keys = ctx.uk ? [ctx.uk] : ctx.dang && typeof CB_AI !== 'undefined' ? ((CB_AI[ctx.sk] || {})[ctx.dang] || []) : [];
  for (const k of keys) for (let pi = 0; pi < C.papers.length; pi++) { const p = C.papers[pi]; if (!ok(p)) continue; const i = p.parts.findIndex(([lab]) => cbKey(lab, p) === k); if (i >= 0) return at(pi, i); }
  return null; }
function hlAt(q, r, ctx) { q = q || {}; try { if (ctx.ex === 'cambridge') return hlCb(r, ctx); if (q.sec) return hlTo(q, r.ans); if (q.ty) return hlIe(q); } catch (e) {} return null; }
function hlLes(at) { if (!at) return null; const [ex, sk, k] = at, c = ex + '|' + sk, L = HL_LC[c] || (HL_LC[c] = xlList(ex, sk)), i = typeof k === 'number' ? k : L.findIndex(d => d.k === k);
  return i >= 0 && L[i] ? { ex, sk, i, d: L[i] } : null; }
// gom kết quả theo bài học: rows = dạng có câu sai (sai nhiều trước), all = mọi dạng (cả dạng đúng hết, để xoá cờ), other = câu sai không nối được bài học
function hlGroups(res, ctx = {}) { HL_LC = {}; const G = new Map(), other = [];
  for (const r of res || []) { const q = r && r.q; if (!q || q.kind === 'write' || q.kind === 'speak' || r.ok == null) continue;
    const a = hlLes(hlAt(q, r, ctx)); if (!a) { if (!r.ok) other.push(r); continue; }
    let g = G.get(a.d.id); if (!g) G.set(a.d.id, g = { ...a, n: 0, bad: 0, wrong: [] }); g.n++; if (!r.ok) { g.bad++; g.wrong.push(r); } }
  const all = [...G.values()], rows = all.filter(g => g.bad).sort((a, b) => b.bad - a.bad || b.bad / b.n - a.bad / a.n);
  return { rows, all, other }; }

// ---------- cờ "vừa sai" (S.xs) ----------
function hlMark(all, src) { const X = S.xs = S.xs || {}, now = Date.now(); let ch = 0;
  for (const g of all) { const ok = (g.n - g.bad) / g.n;
    if (g.bad >= HL_MIN && ok < HL_BAD) { X[g.d.id] = { at: now, b: g.bad, n: g.n, src: src || '' }; ch = 1; }
    else if (X[g.d.id] && g.n >= 3 && ok >= HL_OK) { delete X[g.d.id]; ch = 1; } }
  for (const k of Object.keys(X).sort((a, b) => X[b].at - X[a].at).slice(HL_MAXN)) { delete X[k]; ch = 1; }
  if (ch) { S.t = now; save(); } }
// cờ còn hiệu lực: đánh sau lần học bài gần nhất
const hlOn = id => { const f = S && S.xs && S.xs[id]; return !!f && f.at > ((((S.exl || {})[id]) || {}).at || 0); };
function hlHit(k) { const C = S.xsc = S.xsc || { n: 0, k: 0, l: 0, p: 0, w: 0 }; C[k] = (C[k] || 0) + 1; if (k !== 'w' && HL_SEEN && HL_HIT !== HL_SEEN) { C.k = (C.k || 0) + 1; HL_HIT = HL_SEEN; } S.t = Date.now(); save(); }

// ---------- câu chứa đáp án + từ chưa học ----------
const hlTxt = h => String(h || '').replace(/<[^>]*>/g, ' ').replace(/&(amp|lt|gt|quot|#39);/g, (m, k) => ({ amp: '&', lt: '<', gt: '>', quot: '"', '#39': "'" }[k])).replace(/&[a-z#0-9]+;/g, ' ').replace(/\s+/g, ' ').trim();
// câu đề AI / soạn sẵn có ev (AI trích); Part 1, 2 TOEIC chỉ có lời nghe ngắn (vì sao đã có lời nghe)
function hlEv(q) { if (q.ev) return String(q.ev); if (q.sec === 'p1' || q.sec === 'p2') return ''; try { return typeof xlEvidS === 'function' ? xlEvidS(q) : ''; } catch (e) { return ''; } }
function hlWords(s) { if (!s || typeof vwCands !== 'function') return ''; let C = []; try { C = vwCands(s); } catch (e) { return ''; }
  const have = new Set((typeof vwSt === 'function' ? vwSt() : []).map(y => y.k)), now = Date.now(), nm = c => c.w ? c.w.w : c.t;
  const W = C.filter(c => !have.has(nm(c).toLowerCase()) && (!c.learned || (typeof wstat === 'function' && wstat(S, c.w, now) === 'quen'))).slice(0, HL_WN); if (!W.length) return '';
  return `<p class="mute" style="margin:8px 0 0;font-size:14px">Từ bạn chưa học trong câu này (chạm để lưu vào Sổ từ):</p><div class="chips tap" style="margin:4px 0 0">${W.map(c => {
    HL_W.push({ w: nm(c), vi: (c.w && c.w.vi) || '', ex: String(s).slice(0, 240), app: c.learned ? c.w : null }); return `<button class="chip" data-hlw="${HL_W.length - 1}">📌 ${esc(nm(c))}</button>`; }).join('')}</div>`; }
function hlItem(r) { const q = r.q, ans = q.kind === 'mc' ? mcAns(q) : (q.acc || [q.a])[0], ev = hlEv(q), src = ev || (q.sec === 'p5' ? hlTxt(q.q) : '');
  return `<div class="hlq">${r.part ? `<p class="mute" style="margin:0;font-size:14px">${esc(r.part)}</p>` : ''}<p style="margin:2px 0">${q.q}</p>
    <p style="margin:2px 0">Bạn: ${esc(String(r.ans == null ? '' : r.ans).slice(0, 200))} · Đáp án: <b>${esc(String(ans == null ? '' : ans))}</b></p>${q.why && typeof q.why === 'string' ? `<p class="mute" style="margin:2px 0 0">${esc(q.why)}</p>` : ''}
    ${ev && !String(q.why || '').includes('📍') ? `<p style="margin:4px 0 0">📍 Câu chứa đáp án: “${esc(ev)}”</p>` : ''}${HL_WQ++ < HL_WQMAX ? hlWords(src) : ''}</div>`; }

// ---------- ô kết quả ----------
// ctx: { ex: 'cambridge' + lv (+ uk | dang, sk) khi là Cambridge; src: 'thi' | 'luyen' | 'ai'; nolog: không đánh cờ }. Trả { html, pri: có dạng để học lại (màn gọi hạ nút chính của nó) }
function hlBox(res, ctx = {}) { const { rows, all, other } = hlGroups(res, ctx); if (!ctx.nolog) hlMark(all, ctx.src);   // đánh / xoá cờ cả khi đúng hết
  const wrong = (res || []).filter(r => r && r.ok === false && r.q && r.q.kind !== 'write' && r.q.kind !== 'speak'); if (!wrong.length) return { html: '', pri: false }; HL_W = []; HL_WQ = 0;
  if (rows.length) { const C = S.xsc = S.xsc || { n: 0, k: 0, l: 0, p: 0, w: 0 }; C.n++; HL_SEEN = C.n; HL_HIT = 0; S.t = Date.now(); save(); }
  const row = (g, j) => `<div class="hlr"><p style="margin:0"><b>${g.d.ic || ''} ${esc(g.d.t)}</b> <span class="mute">· sai ${g.bad}/${g.n}</span></p>
    <div class="chips tap" style="margin:6px 0 0"><button class="chip${j === 0 ? ' on' : ''}" data-hl="${g.ex}|${esc(g.sk)}|${g.i}">📘 Học lại</button>${g.d.go ? `<button class="chip" data-hlgo="${g.ex}|${esc(g.sk)}" ${g.d.go}>🏋️ Luyện dạng này</button>` : ''}</div></div>`;
  const top = rows.slice(0, HL_ROWS), more = rows.slice(HL_ROWS), items = [...rows.flatMap(g => g.wrong), ...other];
  const head = rows.length ? `Sai ${wrong.length} câu ở ${rows.length} dạng. Dạng sai nhiều nhất ở trên.` : `Sai ${wrong.length} câu.`;
  const list = `<details class="hlw"${rows.length ? '' : ' open'}><summary>👀 Xem ${wrong.length} câu sai</summary>${items.map(hlItem).join('')}</details>`;
  return { html: `<div class="box" id="hlbox"><b>🎯 Sai ở đâu · học lại gì</b><p class="mute" style="margin:4px 0 0">${head}</p>${top.map(row).join('')}
    ${more.length ? `<details><summary>Thêm ${more.length} dạng sai</summary>${more.map((g, j) => row(g, j + HL_ROWS)).join('')}</details>` : ''}${list}</div>`, pri: rows.length > 0 }; }

// 📘 Học lại: mở bài học, nút ‹ Kết quả dựng lại đúng màn kết quả (chụp nội dung + bộ bắt bấm) · 🏋️ Luyện dạng này: bộ bắt bấm của màn kỳ thi (như nút ở bài học)
// 📌 lưu từ vào Sổ từ (bộ thẻ chung với từ đề thật / tra cứu: iethat.js vwPut)
function hlClick(e) { if (!S) return; const g = s => e.target.closest(s); let b;
  if ((b = g('[data-hl]'))) { const [ex, sk, i] = b.dataset.hl.split('|'), snap = { html: $app.innerHTML, oc: $app.onclick, cur: window.CUR, y: window.scrollY || 0 }; hlHit('l'); scrollTo(0, 0);
    return xlView(ex, sk, +i || 0, () => { EXAM_VOX = false; $app.innerHTML = snap.html; $app.onclick = snap.oc; window.CUR = snap.cur; scrollTo(0, snap.y); }); }
  if ((b = g('[data-hlgo]'))) { hlHit('p'); if (b.matches('[data-iepara]')) return;   // Diễn đạt lại: iethat.js có bộ bắt chung
    const [ex, sk] = b.dataset.hlgo.split('|'); window.CUR = { view: ex === 'cambridge' ? 'cambridge' : ex, sk: ex === 'cambridge' ? String(sk).replace('~', '|') : sk }; scrollTo(0, 0); return xlClickOf(ex)(e); }
  if ((b = g('[data-hlw]'))) { const c = HL_W[+b.dataset.hlw]; if (!c || b.disabled || typeof vwPut !== 'function') return; const n = vwPut([c], '🎯 Câu sai trong đề'); hlHit('w');
    b.disabled = true; b.textContent = '✓ ' + c.w; toast(n ? '📌 Đã lưu vào Sổ từ. Ôn trong 🔁 ôn chung.' : 'Từ này đã có trong Sổ từ.'); } }
document.addEventListener('click', hlClick);
