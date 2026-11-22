// 🎚 Cấp trong game + nhân vật lớn lên theo cấp (v208, 20/11/2026).
// Người sáng lập: "những nhân vật đó có cấp độ từ dễ tới khó chứ đâu phải kiến thức giống nhau", chọn "tự chọn trong game", "tự làm đi".
// Mỗi câu của phố có một cấp CEFR (cdLv):
//   phố ngữ pháp (Động Từ, Đại Từ & Lượng Từ, Cấu Trúc) theo luật của đáp án (CD_LAW);
//   phố từ (Loại Từ, Cầu Nối, Chợ) theo cấp của từ đáp án trong từ điển app, có mức sàn theo loại (CD_FLOOR);
//   Bến Dò Tin, Ghép Đoạn theo loại câu hỏi / loại chữ nối (CD_TY).
// Cấp do người học tự chọn ở 🏙 Thành phố hoặc màn phố (S.to.capg). Ván chỉ ra câu tới cấp đã chọn + 1; câu đề khó hơn để sau.
// Kho ở cấp đó ít hơn CD_MIN câu thì lấy thêm câu cấp thấp nhất còn lại để ván không rỗng.
// Nhân vật "lớn lên": đạt cấp L khi mọi cấp ≤ L có câu của nhân vật đều đã đúng ≥ min(CD_NEED, số câu) câu khác nhau.
// Ngưỡng và bảng cấp luật là ý kiến của Claude theo chương trình ngữ pháp Nền của app, chưa đối chiếu English Profile. Chỉ trò chơi, không tính luật đo.
const CD_LV = ['pre', 'a1', 'a2', 'b1', 'b2', 'c1', 'c2'], CD_MIN = 10, CD_NEED = 3;
const CD_N = { pre: 'Pre-A1', a1: 'A1', a2: 'A2', b1: 'B1', b2: 'B2', c1: 'C1', c2: 'C2' };
const CD_LAW = {
  dong: { qd: 'a1', hd: 'pre', td: 'pre', htht: 'a2', hth: 'b1', tl: 'a1', dk: 'b1', bd: 'a2', to: 'a2', goc: 'a1', ing: 'a2' },
  dai: { cn: 'pre', tn: 'a1', ss: 'pre', ds: 'a2', pt: 'a2', qn: 'a2', qv: 'a2', qs: 'b1', l1: 'a2', ln: 'a1', lk: 'a1', lo: 'b1' },
  ctr: { shon: 'a1', snhat: 'a1', sbang: 'a2', kep: 'c2', dao: 'c1', dk: 'c1', sothat: 'b1', cap: 'b1' } };
const CD_FLOOR = { loai: { N: 'a1', V: 'a1', A: 'a1', R: 'a2' }, cau: { G: 'a1', L: 'a1', T: 'a2' }, cho: { E: 'a2', F: 'a2', J: 'a2', NN: 'b2' } };
const CD_NHA = { nguoi: 'a2', vdang: 'a2', edng: 'a2', so: 'a1', ss: 'a1' };
const CD_TY = { ben: { C: 'a2', P: 'b1', K: 'b1', Y: 'b2' }, ghep: { GT: 'a2', GQ: 'a2', GC: 'b1', GN: 'b1' } };
const cdI = l => Math.max(0, CD_LV.indexOf(String(l || 'b1').replace(/p$/, '')));
const cdMax = (...ls) => CD_LV[Math.max(...ls.filter(Boolean).map(cdI))];
// cấp của một từ / cụm trong từ điển app (cấp "+" tính về cấp gốc); cụm nhiều chữ lấy chữ khó nhất tìm được
let CD_WL = null;
function cdWord(w) { if (typeof WORDS === 'undefined' || !WORDS.length) return null;
  if (!CD_WL) { CD_WL = new Map(); for (const x of WORDS) { const k = x.w.toLowerCase(), u = (typeof UBY !== 'undefined' && UBY[x.u]) || {}; if (u.lv && !CD_WL.has(k)) CD_WL.set(k, String(u.lv).replace(/p$/, '')); } }
  const f = s => { s = s.toLowerCase().replace(/[^a-z' -]/g, '').trim(); if (!s) return null; if (CD_WL.has(s)) return CD_WL.get(s);
    for (const [re, to] of [[/ies$/, 'y'], [/ied$/, 'y'], [/ing$/, ''], [/ing$/, 'e'], [/ed$/, ''], [/ed$/, 'e'], [/es$/, ''], [/s$/, ''], [/ly$/, ''], [/ily$/, 'y']]) { const b = s.replace(re, to); if (b !== s && CD_WL.has(b)) return CD_WL.get(b); }
    return null; };
  const s = String(w || ''); const all = f(s); if (all) return all;
  const ps = s.split(/[\s…]+/).filter(t => t.length > 2).map(f).filter(Boolean); return ps.length ? cdMax(...ps) : null; }
// cấp của một câu (k = khoá phố). Câu thật của đề cùng cách tính.
function cdLv(k, it) { if (!it) return 'b1'; if (it.cl) return it.cl;
  const A = (it.o || []).find(o => o[0] === it.a) || [], t = A[1];
  let l;
  if (CD_LAW[k]) l = CD_LAW[k][A[3]] || 'b1';
  else if (CD_TY[k]) l = CD_TY[k][it.ty] || 'b1';
  else { const fl = (CD_FLOOR[k] || {})[t] || 'a1', wl = cdWord(it.a);
    l = cdMax(fl, wl || 'b1', k === 'loai' && it.nha ? CD_NHA[it.nha] : null); }
  return (it.cl = l); }
// cấp người học tự chọn (null = chưa chọn: không lọc)
const cdCap = () => { const o = typeof toSt === 'function' ? toSt() : null; return o && CD_LV.includes(o.capg) ? o.capg : null; };
const cdOk = (k, it) => { const c = cdCap(); return !c || cdI(cdLv(k, it)) <= cdI(c) + 1; };
// lọc một kho: câu tới cấp + 1; ít hơn CD_MIN thì thêm câu cấp thấp nhất còn lại
function cdPool(k, xs) { const c = cdCap(); if (!c) return xs; const ok = xs.filter(x => cdOk(k, x)); if (ok.length >= CD_MIN) return ok;
  const rest = xs.filter(x => !ok.includes(x)).sort((a, b) => cdI(cdLv(k, a)) - cdI(cdLv(k, b))); return ok.concat(rest.slice(0, CD_MIN - ok.length)); }

// ---------- lọc ván: bọc hàm ra câu của các phố ----------
// phố rơi chữ: tạm thay PH_K / PH_RL bằng bản đã lọc trong lúc ra câu (ván chữa từ ⚔️ Chinh phục đề không lọc: người học đã chọn câu đó)
if (typeof phPick === 'function') { const _pk = phPick;
  phPick = function (fix, md) { const k = PHC && PHC.key; if (fix || !cdCap() || !k) return _pk(fix, md);
    const K = PH_K, RL = PH_RL; try { PH_K = cdPool(k, K || []); PH_RL = {}; for (const [id, it] of Object.entries(RL || {})) if (cdOk(k, it)) PH_RL[id] = it; return _pk(fix, md); }
    finally { PH_K = K; PH_RL = RL; } }; }
// Bến Dò Tin, Ghép Đoạn: bỏ câu quá cấp khỏi ván; bỏ hết thì giữ ván gốc
for (const [k, fn] of [['ben', 'benPick'], ['ghep', 'ghPick']]) { const g = window[fn]; if (typeof g !== 'function') continue;
  window[fn] = function (mu, only) { const L = g(mu, only); if (only || !cdCap()) return L; const f = L.filter(x => cdOk(k, x)); return f.length >= 3 ? f : L; }; }

// ---------- 🌱 nhân vật lớn lên ----------
// trả về [{ t, name, lv: cấp đã đạt | null, next: { lv, ok, need } | null, span: [cấp thấp, cấp cao] }]
function cdGrow(k) { const P = PH_PHO[k]; if (!P) return [];
  const K = k === 'ben' ? (typeof benKItems === 'function' ? benKItems() : []) : k === 'ghep' ? (typeof ghKItems === 'function' ? ghKItems() : []) : (PHC && PHC.key === k ? PH_K || [] : []);
  const I = (k === 'ben' ? benSt() : k === 'ghep' ? ghSt() : phSt()).it, tOf = x => x.ty || ((x.o || []).find(o => o[0] === x.a) || [])[1];
  return (P.ORD || []).map(t => { const xs = K.filter(x => tOf(x) === t); if (!xs.length) return null;
    const by = {}; for (const x of xs) { const l = cdLv(k, x); (by[l] = by[l] || { n: 0, ok: 0 }); by[l].n++; if (I[x.id] && I[x.id].s === 1) by[l].ok++; }
    const ls = CD_LV.filter(l => by[l]); let lv = null, next = null;
    for (const l of ls) { const need = Math.min(CD_NEED, by[l].n); if (by[l].ok >= need) lv = l; else { next = { lv: l, ok: by[l].ok, need }; break; } }
    return { t, name: P.CH[t].name, lv, next, span: [ls[0], ls[ls.length - 1]] }; }).filter(Boolean); }
const cdChips = () => { const c = cdCap(); return `<div class="chips tap" style="margin:6px 0">${CD_LV.map(l => `<button class="chip${c === l ? ' on' : ''}" data-cdlv="${l}" aria-pressed="${c === l}">${CD_N[l]}</button>`).join('')}</div>`; };
// đếm câu đề đang chọn quá cấp (để sau)
function cdLater(k) { const c = cdCap(), de = typeof tgDe === 'function' ? tgDe() : null; if (!c || !de) return 0;
  const D = k === 'ben' ? (typeof benDeItems === 'function' ? benDeItems(de) : []) : k === 'ghep' ? (typeof ghDeItems === 'function' ? ghDeItems(de) : []) : Object.values(PH_RL || {}).filter(it => it.de === de);
  return D.filter(it => !cdOk(k, it)).length; }
function cdBox(k) { const c = cdCap(), G = cdGrow(k), later = cdLater(k);
  const row = g => `<div class="row" style="margin:6px 0;align-items:center;gap:8px">${typeof phFace === 'function' ? phFace(g.t, 32, g.lv ? 'happy' : '') : ''}<span style="flex:1"><b>${esc(g.name)}</b> <span class="mute" style="font-size:14px">${CD_N[g.span[0]]}${g.span[1] !== g.span[0] ? ' → ' + CD_N[g.span[1]] : ''}</span><br>
    <span style="font-size:14px">${g.lv ? `🌱 Đã lớn tới <b>${CD_N[g.lv]}</b>` : 'Chưa lớn'}${g.next ? ` · ${CD_N[g.next.lv]}: ${g.next.ok}/${g.next.need} câu đúng` : ' · ✓ lớn hết'}</span></span></div>`;
  return `<div class="box" id="cdbox" style="margin:10px 0"><b>🎚 Cấp của bạn: ${c ? CD_N[c] : 'chưa chọn'}</b>${cdChips()}
    <p class="mute" style="margin:2px 0 0;font-size:14px">${c ? `Ván ra câu tới ${CD_N[CD_LV[Math.min(cdI(c) + 1, CD_LV.length - 1)]]}.${later ? ` ${later} câu của đề đang chọn khó hơn, để sau.` : ''}` : 'Chọn cấp để ván chỉ ra câu vừa sức. Chưa chọn thì ra mọi cấp.'}</p>
    ${G.length ? `<details style="margin:6px 0 0"><summary>🌱 Nhân vật lớn lên theo cấp</summary><p class="mute" style="margin:4px 0;font-size:14px">Mỗi nhân vật có luật từ dễ tới khó. Đúng ${CD_NEED} câu mỗi cấp thì nhân vật lớn lên cấp đó.</p>${G.map(row).join('')}</details>` : ''}</div>`; }
// chèn ô vào màn phố (sau ô đề, không có thì sau hàng nút về)
function cdInject(k) { if (!$app || document.getElementById('cdbox')) return; const a = $app.querySelector('.phde') || $app.querySelector('.row.top'); if (!a) return; a.insertAdjacentHTML('afterend', cdBox(k)); }
let CD_RE = null;
for (const [fn, k] of [['phView', null], ['benView', 'ben'], ['ghView', 'ghep']]) { const g = window[fn]; if (typeof g !== 'function') continue;
  window[fn] = async function (...a) { const r = await g.apply(this, a); const key = k || (PHC && PHC.key); const want = k === 'ben' ? 'toeic-ben' : k === 'ghep' ? 'toeic-ghep' : PHC && PHC.view; if (key && (window.CUR || {}).view === want) { CD_RE = () => window[fn](); cdInject(key); } return r; }; }
// 🏙 Thành phố: hàng chọn cấp dưới hàng chọn đề
if (typeof kpDay === 'function') { const _kd = kpDay;
  kpDay = function (...a) { const r = _kd.apply(this, a); const c = cdCap(), ch = $app && $app.querySelector('.chips.tap');
    if (ch && !document.getElementById('cdbox')) ch.insertAdjacentHTML('afterend', `<div id="cdbox" style="margin:4px 0 8px"><b style="font-size:15px">🎚 Cấp của bạn: ${c ? CD_N[c] : 'chưa chọn'}</b>${cdChips()}</div>`);
    CD_RE = () => kpDay(); return r; }; }
document.addEventListener('click', e => { const b = S && e.target.closest('[data-cdlv]'); if (!b) return; e.stopPropagation();
  const o = toSt(); o.capg = o.capg === b.dataset.cdlv ? null : b.dataset.cdlv; save(); if (CD_RE) CD_RE(); }, true);
