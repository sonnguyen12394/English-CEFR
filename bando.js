// 🗺 Bản đồ chỗ yếu (v78, 29/10/2026, người sáng lập: chiến lược "học nhanh" nhiều tầng — "kiểm tra đầu vào phủ nhanh chỗ mạnh yếu (cấp 1) → tập trung chỗ yếu trước
// để bù chỗ lủng, không để kỹ năng lệch → bài học và rèn luyện bóc tiếp chỗ lủng sâu hơn … như vạch lá tìm sâu nhưng theo nhiều tầng"; "xây chiến lược này, để ở mục dữ liệu").
// Đặt ở tab 💾 Dữ liệu (v78); v86 chuyển lối vào về ô 📅 Hôm nay của 🎯 Học CEFR (màn #bdo, nút ← Học CEFR). Chỉ đọc bằng chứng sẵn có (thẻ ôn của 7 phần), không đổi luật đo; buổi chữa dùng đúng bộ chấm + lịch ôn của từng phần.
//   Tầng 1 · Phủ: mỗi phần ở cấp đang học có bao nhiêu % bài / từ đã có bằng chứng; phần "chưa rõ" → 🔎 Quét lại (mỗi 21 ngày: kiểm tra từ chưa học + xác nhận từ đã nhớ).
//   Tầng 2 · Chữa: danh sách chỗ yếu = mặt đã làm sai (nặng) hoặc đã quên (nhẹ hơn); mức ưu tiên = mức yếu × mức tin cậy × mức quan trọng
//     (tin cậy: ≥ 2 lần làm mới chắc; quan trọng: mặt cốt lõi > mặt chiều sâu, cấp đang học > cấp dưới). Buổi chữa 70 / 30: 14 chỗ yếu + 6 từ đang nhớ cần giữ.
//   Tầng 3 · Truy gốc: bài Đọc / Nghe / Ngữ pháp còn yếu → từ trong bài chưa học hoặc đang quên (gốc từ vựng) → chữa gốc trước.
//   Cân bằng: nhóm Hiểu (Từ vựng, Ngữ pháp, Đọc, Nghe) và nhóm Tạo ra (Nói, Viết, Phát âm); phần nào ≥ 3 ngày chưa luyện thì nhắc (máy đo Nói / Viết yếu, nên không để "yếu nhất trước" bỏ quên chúng).
// 🎯 Giới hạn (v79, người sáng lập: "giới hạn lại số lỗi để học và số lỗi tương lai cần tập trung học tiếp sau khi hoàn thành những lỗi cũ"): chỉ chữa tối đa 15 chỗ
//   một lúc (S.focus), Từ vựng tối đa 9 nếu phần khác cũng có chỗ yếu; còn lại vào ⏳ hàng chờ theo ưu tiên. Chỗ nào hết yếu thì ra khỏi nhóm (đếm ✅ chữa xong),
//   chỗ đầu hàng chờ tự vào thay. Chỗ yếu mới phát hiện vào hàng chờ, không chen vào nhóm đang chữa.
//   v80 (người sáng lập: "không phải kiến thức nào học cái là hiểu và qua được … cho thử số lần nhất định rồi cho qua … sau này kẹt ở đó thì thêm vào nhóm lỗi sửa lại"):
//   mỗi chỗ thử tối đa 3 ngày (nhiều buổi một ngày tính 1). Hết 3 lần còn yếu → ⏸ tạm gác 14 ngày, nhường chỗ. Hết hạn mà vẫn yếu → vào cuối hàng chờ, thử lại 3 lần.
// v81 (rủi ro người sáng lập yêu cầu phân tích, 29/10/2026): ① chữa xong = mặt vững + lần đúng gần nhất ở ngày SAU lần sai gần nhất (sai rồi đúng ngay trong buổi = ✔ chờ xác nhận);
//   ② rời danh sách mà không phải nhờ làm đúng (lên cấp, đổi mẫu từ, mất thẻ) = ra ngoài phạm vi, không tính chữa xong; ③ mọi lần chấm (grade) đếm lần thử qua mapHit;
//   ④ từ lần thử 2: 📘 xem lại ngắn trước khi thử; ⑤ gác lần 2 → 🧱 học lại bài gốc (không tự quay lại); ⑥ ô Hôm nay có việc "Chữa 5 chỗ yếu".
// Quy tắc dừng: một chỗ yếu hết yếu khi lần đúng gần nhất ở ngày sau lần sai gần nhất và khả năng nhớ ≥ 80% (luật Nhớ).
const MAP_CORE = new Set(['nghia', 'nghe', 'chu', 'nhora', 'noi', 'viet']), MAP_SCAN_D = 21, MAP_IDLE_D = 3, MAP_FIX = [14, 6];
const MAP_GROUP = [['Hiểu', ['tv', 'np', 'doc', 'nghe']], ['Tạo ra', ['noi', 'viet', 'pa']]];
// cấp đang học của từng phần (như "Nên làm")
const mapLv = id => id === 'tv' ? curLevel() : id === 'pa' ? paLevel() : kLv(KIT[id]);
// một mặt của một thẻ: 'sai' (lần gần nhất sai), 'quen' (đúng nhưng khả năng nhớ < 80%), 'vung', 'chua' (chưa có bằng chứng)
// v101: mặt đo trên bài mới (Đọc, Nghe: d.f) không giảm theo ngày: đúng là vững, sai là sai (chữa bằng tầng gốc: từ chưa học trong bài; làm lại sau 30 ngày mới tính)
function mapFace(c, k, now) { const d = c && c.dm && c.dm[k]; if (!d) return 'chua'; if (!d.ok) return 'sai'; if (d.f) return 'vung'; return heldDim(c, k, now) ? 'vung' : recall(c, now) < MEM_R ? 'quen' : 'chua'; }
const MAP_SEV = { sai: 1, quen: 0.6 };
// mọi chỗ yếu: { id (phần), x (từ / bài), k (mặt), st, p (ưu tiên), lv }
function mapWeak(now = Date.now()) { const out = [], push = (id, x, k, c, lvItem, lvPart, core) => { const st = mapFace(c, k, now); if (!MAP_SEV[st]) return;
    const n = (c.dm[k].n || 0) + (c.lapse || 0), conf = n >= (MAP_SLOW.has(id) ? 1 : 2) ? 1 : 0.6, imp = (core ? 1 : 0.7) * (lvItem === lvPart ? 1 : 0.8);
    out.push({ id, x, k, st, lv: lvItem, p: Math.round(MAP_SEV[st] * conf * imp * 100) / 100 }); };
  { const lv = curLevel(); for (const w of memWords(lv, now)) { const c = S.cards[w.id]; if (!c) continue; for (const k of wDims(w, lv)) if (k !== 'noi' || SREC) push('tv', w, k, c, wLv(w), lv, MAP_CORE.has(k)); } }
  for (const P of Object.values(KIT)) { if (!P.items) continue; const lv = kLv(P), st = kSt(P.id).cards; for (const x of kMem(P, lv)) { const c = st[x.id]; if (c) for (const k of kDimsOf(P, x)) push(P.id, x, k, c, x.lv, lv, true); } }
  if (PA) { const lv = paLevel(); for (const x of PA.filter(x => PA_LV.indexOf(x.lv) <= PA_LV.indexOf(lv))) { const c = paSt()[x.id]; if (c) for (const [k] of PA_DIMS) push('pa', x, k, c, x.lv, lv, true); } }
  mapSpread(out, now);
  return out.sort((a, b) => b.p - a.p); }
// v85 gốc trước triệu chứng: từ yếu nằm trong bài Đọc / Nghe / Ngữ pháp đang yếu được cộng ưu tiên (+25% mỗi bài, tối đa ×2, w.rk = số bài);
//   bài yếu mà trong bài còn từ chưa học / đang quên / đang yếu thì giảm 20% (w.gr = số từ gốc): chữa từ trước, bài tự dễ lên.
function mapSpread(out, now) { if (typeof mfWords !== 'function') return; const tv = new Map(out.filter(w => w.id === 'tv').map(w => [w.x.id, w])), hit = new Map(), gr = new Map();
  for (const it of out) { if (!MAP_SYM.includes(it.id)) continue; const key = it.id + '|' + it.x.id;
    if (!gr.has(key)) { const ws = mfWords(mapText(it.x)).filter(w => LEVELS.indexOf(wLv(w)) <= LEVELS.indexOf(it.lv) + 1), rs = ws.filter(w => tv.has(w.id) || !S.cards[w.id] || wstat(S, w, now) === 'quen');
      for (const w of ws) if (tv.has(w.id)) hit.set(w.id, (hit.get(w.id) || 0) + 1); gr.set(key, rs.length); }
    const g = gr.get(key); if (g) { it.gr = g; it.p = Math.round(it.p * 0.8 * 100) / 100; } }
  for (const [id, k] of hit) for (const w of out) if (w.id === 'tv' && w.x.id === id) { w.rk = k; w.p = Math.round(w.p * (1 + 0.25 * Math.min(k, 4)) * 100) / 100; } }
// tầng 1: độ phủ bằng chứng ở cấp đang học của mỗi phần
function mapCover() { return OV.map(([id, ic, t]) => { const lv = mapLv(id);
  if (id === 'tv') { const ws = levelWords(lv), h = ws.filter(w => S.cards[w.id]).length; return { id, ic, t, lv, n: ws.length, has: h }; }
  if (id === 'pa') { const its = PA ? PA.filter(x => x.lv === lv) : [], h = its.filter(x => paSt()[x.id]).length; return { id, ic, t, lv, n: its.length, has: h }; }
  const P = KIT[id], its = P.items ? kItems(P, lv) : [], h = its.filter(x => kSt(id).cards[x.id]).length; return { id, ic, t, lv, n: its.length, has: h }; }); }
// lần luyện gần nhất của một phần (ngày)
function mapLast(id) { const cs = id === 'tv' ? Object.values(S.cards) : id === 'pa' ? Object.values(paSt()) : Object.values(kSt(id).cards); let m = 0; for (const c of cs) if (c.last > m) m = c.last; return m; }
// tầng 3: bài Đọc / Nghe / Ngữ pháp còn yếu → từ trong bài chưa học hoặc đang quên
const mapText = x => [x.text, x.title, ...(x.lines || []).map(l => l[1]), ...(x.ex || []).map(e => e[0]), ...((x.mc && x.mc.test) || []).map(m => m.s)].filter(Boolean).join(' ');
const mapGap = (it, now = Date.now()) => (typeof mfWords === 'function' ? mfWords(mapText(it.x)) : []).filter(w => LEVELS.indexOf(wLv(w)) <= LEVELS.indexOf(it.lv) + 1)
  .filter(w => { const c = S.cards[w.id]; return !c || wstat(S, w, now) === 'quen'; });
function mapRoots(weak, now = Date.now()) { const seen = new Set(), out = [];
  for (const it of weak.filter(w => ['doc', 'nghe', 'np'].includes(w.id))) { if (seen.has(it.x.id)) continue; seen.add(it.x.id);
    const gap = mapGap(it, now);
    if (gap.length) out.push({ it, gap: gap.slice(0, 12) }); if (out.length >= 5) break; }
  return out; }
// 🎯 nhóm đang chữa + ⏳ hàng chờ + ⏸ tạm gác + 🧱 cần học lại bài gốc. S.focus = { a: [{ q, at, t (số ngày đã thử), td, wd (ngày sai gần nhất), cd (ngày đúng gần nhất), r (lần quay lại) }],
//   p: [{ q, at, r, root }] (tạm gác), n: số chỗ chữa xong, out: số chỗ ra ngoài phạm vi (lên cấp, đổi mẫu từ… — không tính chữa xong) }
// v85 suất giữ chỗ: nhóm 15 chỗ dành tối thiểu 3 chỗ Hiểu (Đọc, Nghe) và 2 chỗ Tạo ra (Nói, Viết) nếu tầng đó có chỗ yếu; phần còn lại cho Nền theo ưu tiên.
//   Chỉ dùng khi lấp chỗ trống: không đẩy chỗ đang chữa ra. Nói / Viết mỗi bài làm lâu nên 1 lần có bằng chứng đã tính tin cậy (MAP_SLOW).
const MAP_TIER = { tv: 'nen', np: 'nen', pa: 'nen', doc: 'hieu', nghe: 'hieu', noi: 'tao', viet: 'tao' }, MAP_TIER_N = [['nen', '🧱 Nền'], ['hieu', '👂 Hiểu'], ['tao', '🗣 Tạo ra']];
const MAP_RES = [['tao', 2], ['hieu', 3]], MAP_SLOW = new Set(['noi', 'viet']), MAP_SYM = ['doc', 'nghe', 'np'], MAP_LOG_D = 28;
const MAP_ACT = 15, MAP_TV_MAX = 9, MAP_TRY = 3, MAP_PARK_D = 14, MAP_TODAY = 5, mapKey = w => `${w.id}|${w.x.id}|${w.k}`;
// khoá → { id, x, k, lv, c (thẻ) }; không còn bài / từ thì null
function mapItem(q) { const ps = q.split('|'), id = ps[0], k = ps[ps.length - 1], xid = ps.slice(1, -1).join('|'); let x, c;
  if (id === 'tv') { x = WBY[xid]; c = S.cards[xid]; } else if (id === 'pa') { x = (PA || []).find(p => p.id === xid); c = paSt()[xid]; }
  else { const P = KIT[id]; x = P && P.items && P.items.find(i => i.id === xid); c = P && kSt(id).cards[xid]; }
  return x ? { id, x, k, c, lv: id === 'tv' ? wLv(x) : x.lv } : null; }
// chữa xong thật: mặt vững + lần đúng gần nhất ở ngày SAU lần sai gần nhất (sai rồi đúng ngay trong ngày = ✔ chờ xác nhận hôm sau)
const mapVung = it => !!(it && it.c && mapFace(it.c, it.k, Date.now()) === 'vung');
const mapOk = (f, it) => mapVung(it) && (f.cd != null ? f.cd > (f.wd ?? -1) : (f.wd ?? -1) < 0);
function mapFocus(now = Date.now(), weak = mapWeak(now)) { const F = S.focus = S.focus || {}, by = new Map(weak.map(w => [mapKey(w), w])); F.a = F.a || []; F.p = F.p || []; F.n = F.n || 0; F.out = F.out || 0;
  const fixed = q => { F.n++; (F.h = F.h || []).push([dayOf(now), q.split('|')[0]]); if (F.h.length > 300) F.h.splice(0, F.h.length - 300); };   // nhật ký chữa xong (đo sau 4 tuần)
  const np = []; for (const p of F.p) { if (by.has(p.q)) np.push(p); else if (mapVung(mapItem(p.q))) fixed(p.q); else F.out++; } F.p = np;   // hết yếu lúc đang gác = chữa xong
  const keep = []; for (const f of F.a) { if (by.has(f.q)) { if ((f.t || 0) >= MAP_TRY) F.p.push({ q: f.q, at: now, r: f.r || 0, root: (f.r || 0) >= 1 }); else keep.push(f); continue; }
    const it = mapItem(f.q); if (mapOk(f, it)) fixed(f.q); else if (mapVung(it)) keep.push(f); else F.out++; }   // vững nhưng chưa xác nhận: giữ chỗ; còn lại = ra ngoài phạm vi
  const inAct = new Set(keep.map(f => f.q)), parked = new Map(F.p.map(p => [p.q, p])), back = p => !p.root && now - p.at >= MAP_PARK_D * DAY;
  const queue = [...weak.filter(w => !inAct.has(mapKey(w)) && !parked.has(mapKey(w))), ...weak.filter(w => parked.has(mapKey(w)) && back(parked.get(mapKey(w))))];   // chỗ gác hết hạn: cuối hàng
  let tv = keep.filter(f => f.q.startsWith('tv|')).length;
  const add = w => { const q = mapKey(w), pk = parked.get(q), c = (mapItem(q) || {}).c; keep.push({ q, at: now, t: 0, r: pk ? pk.r + 1 : 0, wd: w.st === 'sai' && c ? dayOf(c.last || now) : -1 }); inAct.add(q);
    if (pk) { parked.delete(q); F.p = F.p.filter(p => p.q !== q); } if (w.id === 'tv') tv++; };
  for (const [t, m] of MAP_RES) { let have = keep.filter(f => MAP_TIER[f.q.split('|')[0]] === t).length;
    for (const w of queue) { if (have >= m || keep.length >= MAP_ACT) break; if (MAP_TIER[w.id] === t && !inAct.has(mapKey(w))) { add(w); have++; } } }
  for (const pass of [1, 2]) for (const w of queue) { if (keep.length >= MAP_ACT) break; const q = mapKey(w); if (inAct.has(q) || (pass === 1 && w.id === 'tv' && tv >= MAP_TV_MAX)) continue; add(w); }
  F.a = keep;
  const one = f => { const w = by.get(f.q) || { ...mapItem(f.q), st: 'cho' }; return { ...w, t: f.t || 0, r: f.r || 0, cho: !by.has(f.q), td: f.td }; };
  return { act: keep.map(one), queue: queue.filter(w => !inAct.has(mapKey(w))), park: F.p.filter(p => !p.root && !back(p)).map(p => ({ ...by.get(p.q), at: p.at })),
    root: F.p.filter(p => p.root).map(p => ({ ...by.get(p.q), r: p.r })), done: F.n, out: F.out }; }
// mọi lần chấm (grade trong app.js: 🏋️ Luyện tập, bài kỹ năng, buổi chữa, chấm nhiều mục…) báo vào đây: đếm lần thử (mỗi ngày 1), ghi ngày sai / đúng
function mapHit(id, xid, ks, ok, now = Date.now()) { const F = S && S.focus; if (!F || !F.a || !F.a.length) return; const d = dayOf(now), pre = id + '|' + xid + '|';
  for (const f of F.a) if (f.q.startsWith(pre) && (!ks.length || ks.includes(f.q.slice(pre.length)))) { if (f.td !== d) { f.t = (f.t || 0) + 1; f.td = d; } if (ok) f.cd = d; else f.wd = d; } }
const mapScanDue = (now = Date.now()) => { const s = (S.scan || []).slice(-1)[0]; return !s || now - s.at >= MAP_SCAN_D * DAY; };

// ---------- màn 🗺 Bản đồ chỗ yếu ----------
async function mapView() { window.CUR = { view: 'ban-do' }; BACK = null; $app.innerHTML = '<div id="bdo"></div><p class="mute">Đang tải…</p>';
  try { await Promise.all([paLoad(), ...Object.values(KIT).map(kLoad)]); } catch (e) {}
  const now = Date.now(), weak = mapWeak(now), fo = mapFocus(now, weak), fby = {}, cov = mapCover(), roots = mapRoots(weak, now), by = {}; for (const w of weak) (by[w.id] = by[w.id] || []).push(w); for (const w of fo.act) (fby[w.id] = fby[w.id] || []).push(w); save();
  const nm = id => OV.find(o => o[0] === id), face = (id, k) => id === 'tv' ? (VREQ_BY[k] || [k, k])[1] : id === 'pa' ? (PA_DIMS.find(d => d[0] === k) || [k, k])[1] : (KIT[id].dims.find(d => d[0] === k) || [k, k])[1];
  const label = w => w.id === 'tv' ? esc(w.x.w) : w.id === 'pa' ? esc(w.x.title || w.x.id) : esc(KIT[w.id].name ? KIT[w.id].name(w.x) : w.x.id);
  const any = OV.some(([id]) => mapLast(id)), idle = OV.map(([id, ic, t]) => [id, ic, t, mapLast(id)]).filter(([, , , l]) => l ? (now - l) / DAY >= MAP_IDLE_D : any);   // đã học phần khác mà phần này chưa luyện lần nào cũng nhắc
  const noData = !Object.keys(S.cards).length && !Object.values(S.k || {}).some(k => Object.keys(k.cards || {}).length);
  $app.innerHTML = `<div id="bdo"></div>${MAP_BACK === 'ct' ? '<div id="bk"></div>' : ''}<div class="row top"><button class="link" data-a="bk">← ${MAP_BACK === 'ct' ? 'Của tôi' : 'Học'}</button><span class="uname">🗺 Bản đồ chỗ yếu</span></div><h1>🗺 Bản đồ chỗ yếu</h1>
    <p class="mute">Gom mọi bằng chứng (kiểm tra, luyện, thi, tra từ) thành chỗ cần chữa. Chữa chỗ yếu trước, giữ cân bằng các kỹ năng, rồi đào tiếp chỗ lủng sâu hơn.</p>
    ${noData ? '<div class="box"><b>Chưa có dữ liệu học.</b><p class="mute" style="margin:6px 0 0">Bản đồ lớn dần khi bạn học. Bắt đầu: 🎯 Học CEFR → ô 📅 Hôm nay → 🧭 Kiểm tra xếp cấp.</p></div>' : ''}
    <div class="box"><b>① Tầng phủ · đã có bằng chứng ở cấp đang học</b>
      ${cov.map(c => `<div class="row" style="margin-top:6px"><span>${c.ic} ${c.t} <span class="mute">${LVN[c.lv] || ''}</span></span><span class="mute">${c.has}/${c.n}</span></div>${bar(c.n ? Math.round(c.has / c.n * 100) : 0, 100, 'var(--accent)')}`).join('')}
      <p class="mute" style="margin:6px 0 0">Phần chưa có bằng chứng là "chưa rõ": có thể bạn đã biết. 🔎 Quét lại để tìm nhanh, khỏi học lại.</p>
      <button class="${mapScanDue(now) && !noData ? 'pri' : ''}" data-map="scan" style="margin-top:6px">🔎 Quét lại (~5 phút)${mapScanDue(now) ? '' : ` · lần trước ${new Date(S.scan.slice(-1)[0].at).toLocaleDateString('vi-VN')}`}</button></div>
    <div class="box"><div class="row"><b>② Tầng chữa · 🎯 đang chữa</b><span class="mute">${fo.act.length}/${MAP_ACT} chỗ</span></div>
      ${fo.act.length ? `<p class="mute" style="margin:4px 0">Chữa tối đa ${MAP_ACT} chỗ một lúc cho chắc. Chỗ nào xong, chỗ đầu hàng chờ tự vào. ❌ = làm sai lần gần nhất · ⚠️ = đã quên (khả năng nhớ &lt; 80%) · ✔ = đúng rồi, cần đúng thêm ở một ngày sau mới tính xong.</p>
        ${OV.filter(([id]) => fby[id]).map(([id, ic, t]) => `<details style="margin:6px 0"${id === fo.act[0].id ? ' open' : ''}><summary>${ic} ${t}: <b>${fby[id].length}</b> chỗ đang chữa</summary>
          ${fby[id].map(w => `<p style="margin:2px 0;font-size:15px">${w.cho ? '✔' : w.st === 'sai' ? '❌' : '⚠️'} ${label(w)} <span class="mute">· ${esc(face(id, w.k))}${w.lv ? ' · ' + LVN[w.lv] : ''}${w.rk ? ` · 🌱 gốc của ${w.rk} bài` : ''}${w.gr ? ` · còn ${w.gr} từ gốc` : ''} · ${w.cho ? 'đúng rồi, chờ xác nhận hôm sau' : `thử ${w.t}/${MAP_TRY}`}${w.r ? ` · quay lại lần ${w.r}` : ''}</span></p>`).join('')}
          <button class="pri" data-map="fix|${id}" style="margin-top:4px">▶ Chữa ${ic} ${t}</button></details>`).join('')}
        <p class="mute" style="margin:4px 0">Mỗi chỗ thử ${MAP_TRY} ngày (làm ở đâu cũng tính). Từ lần 2 app cho 📘 xem lại trước khi thử. Chưa qua thì ⏸ tạm gác ${MAP_PARK_D} ngày; khi đó còn kẹt thì quay lại hàng chờ. Kẹt lần nữa thì 🧱 học lại bài gốc.</p>`
        : '<p class="mute" style="margin:4px 0">Chưa có chỗ yếu đã xác định. Học và luyện thêm, bản đồ sẽ tự hiện chỗ cần chữa.</p>'}
      <p class="mute" style="margin:6px 0 0">Chia chỗ: ${MAP_TIER_N.map(([t, n]) => `${n} ${fo.act.filter(w => MAP_TIER[w.id] === t).length}`).join(' · ')}. Luôn giữ tối thiểu ${MAP_RES.map(([t, m]) => `${m} chỗ ${MAP_TIER_N.find(x => x[0] === t)[1]}`).join(', ')} nếu có chỗ yếu, để Nói / Viết không bị bỏ quên. Từ yếu nằm trong bài Đọc / Nghe / Ngữ pháp yếu được chữa trước (🌱 gốc).</p>
      ${(() => { const h = (S.focus.h || []).filter(([d]) => d > dayOf(now) - MAP_LOG_D); return h.length ? `<p class="mute" style="margin:4px 0 0">${MAP_LOG_D} ngày qua chữa xong: ${MAP_TIER_N.map(([t, n]) => `${n} ${h.filter(([, id]) => MAP_TIER[id] === t).length}`).join(' · ')}</p>` : ''; })()}
      <p style="margin:6px 0 0">✅ Đã chữa xong: <b>${fo.done}</b> chỗ${fo.out ? ` <span class="mute">· ${fo.out} chỗ ra ngoài phạm vi (lên cấp, đổi mẫu từ…), không tính</span>` : ''}</p>
      ${fo.root.length ? `<div style="margin:8px 0"><b>🧱 Cần học lại bài gốc: ${fo.root.length} chỗ</b><p class="mute" style="margin:2px 0">Đã gác, quay lại vẫn kẹt: hỏi thêm không giúp, cần học lại cả bài. Học xong thì vào lại hàng chờ.</p>
        ${[...new Map(fo.root.map(w => [w.id + '|' + w.x.id, w])).values()].slice(0, 6).map(w => `<button data-map="rl|${esc(mapKey(w))}" style="margin:3px 0">🧱 ${nm(w.id)[1]} ${label(w)} <span class="mute">· ${esc(face(w.id, w.k))}</span></button>`).join('')}</div>` : ''}
      ${fo.queue.length ? `<details style="margin:6px 0"><summary>⏳ Hàng chờ: <b>${fo.queue.length}</b> chỗ (học sau khi xong nhóm đang chữa)</summary>
        ${fo.queue.slice(0, 10).map(w => `<p style="margin:2px 0;font-size:15px">${nm(w.id)[1]} ${label(w)} <span class="mute">· ${esc(face(w.id, w.k))}</span></p>`).join('')}
        ${fo.queue.length > 10 ? `<p class="mute" style="margin:2px 0">… và ${fo.queue.length - 10} chỗ nữa</p>` : ''}</details>` : ''}
      ${fo.park.length ? `<details style="margin:6px 0"><summary>⏸ Tạm gác: <b>${fo.park.length}</b> chỗ (thử ${MAP_TRY} lần chưa qua)</summary>
        ${fo.park.slice(0, 10).map(w => `<p style="margin:2px 0;font-size:15px">${nm(w.id)[1]} ${label(w)} <span class="mute">· quay lại ${new Date(w.at + MAP_PARK_D * DAY).toLocaleDateString('vi-VN')}</span></p>`).join('')}
        <p class="mute" style="margin:2px 0">Học thêm bài khác nhiều khi tự gỡ được chỗ kẹt. Hết yếu trong lúc gác thì tính chữa xong.</p></details>` : ''}</div>
    <div class="box"><b>③ Tầng gốc · bài yếu do thiếu từ</b>
      ${roots.length ? roots.map(r => `<p style="margin:8px 0 2px">${nm(r.it.id)[1]} ${esc(KIT[r.it.id].name ? KIT[r.it.id].name(r.it.x) : r.it.x.id)}</p><p class="mute" style="margin:0">Từ chưa học / đang quên trong bài: ${r.gap.map(w => esc(w.w)).join(', ')}</p>`).join('')
        + `<button data-map="root" style="margin-top:6px">▶ Chữa gốc: ôn các từ đang quên${roots.some(r => r.gap.some(w => !S.cards[w.id])) ? ', mở bài có từ chưa học' : ''}</button>`
        : '<p class="mute" style="margin:4px 0">Chưa thấy bài Đọc / Nghe / Ngữ pháp nào yếu vì thiếu từ.</p>'}</div>
    <div class="box"><b>⚖️ Cân bằng kỹ năng</b>${MAP_GROUP.map(([g, ids]) => `<p style="margin:6px 0 2px"><b>${g}</b></p>${ids.map(id => { const [, ic, t] = nm(id), l = mapLast(id), d = l ? Math.floor((now - l) / DAY) : null, n = (by[id] || []).length;
        const warn = d == null ? any : d >= MAP_IDLE_D; return `<div class="row" style="margin:2px 0"><span>${ic} ${t}</span><span class="${warn ? '' : 'mute'}">${d == null ? 'chưa luyện' : d === 0 ? 'hôm nay' : `${d} ngày trước`}${warn ? ' ⚠️' : ''} · ${n} yếu</span></div>`; }).join('')}`).join('')}
      <p class="mute" style="margin:6px 0 0">${idle.length ? `Nên luyện: ${idle.map(([, ic, t, l]) => ic + ' ' + t + (l ? '' : ' (chưa luyện lần nào)')).join(', ')}. ` : ''}Máy đo Nói, Viết yếu hơn Từ vựng; đừng để chúng bị bỏ quên chỉ vì máy ít thấy lỗi.</p></div>
    <p class="mute">Bản đồ chỉ đọc dữ liệu, không đổi luật đo. Chỗ yếu hết yếu khi làm đúng ở một ngày sau lần sai gần nhất và khả năng nhớ ≥ 80%.</p>`;
  $app.onclick = e => { if (e.target.closest('[data-a="bk"]')) return MAP_BACK === 'ct' && typeof minhView === 'function' ? minhView() : overview(); const b = e.target.closest('[data-map]'); if (!b) return; const v = b.dataset.map, i = v.indexOf('|'), a = i < 0 ? v : v.slice(0, i), id = i < 0 ? '' : v.slice(i + 1); scrollTo(0, 0);
    if (a === 'scan') return mapScan(); if (a === 'root') return mapRoot(roots); if (a === 'fix') return mapFix(id); if (a === 'rl') return mapRelearn(id); }; }

// ---------- buổi chữa ----------
// Từ vựng: các chỗ đang chữa (mỗi từ một mặt) + vài từ đang nhớ sắp quên (giữ, chống lủng mới); phần khác: bài luyện của phần. lim: số chỗ (ô Hôm nay: 5).
// Chỗ đã thử ≥ 1 ngày mà chưa qua: 📘 xem lại ngắn trước khi thử (hỏi lại mà không dạy lại thì dễ sai lại). Mọi lần chấm tự báo mapHit qua grade().
function mapFix(id, lim, now = Date.now()) { const d = dayOf(now), act = mapFocus(now).act.filter(w => w.id === id).sort((a, b) => (a.cho - b.cho) || ((b.p || 0) - (a.p || 0)));
  if (!act.length) return toast('Phần này không có chỗ đang chữa.');
  const fin = (head, extra) => { const f = mapFocus(); $app.innerHTML = `<div class="box"><b>${head}</b>${extra}<p>🎯 Đang chữa ${f.act.length} chỗ · ✅ đã chữa xong ${f.done} · ⏳ hàng chờ ${f.queue.length}${f.park.length ? ` · ⏸ tạm gác ${f.park.length}` : ''}.</p>
      <p class="mute">Sai rồi đúng ngay trong buổi chưa tính xong: cần đúng thêm ở một ngày sau.</p></div><button class="pri" data-a="map">🗺 Về bản đồ</button><button data-a="ov">Về 🎯 Học CEFR</button>`;
    $app.onclick = e => { if (e.target.closest('[data-a="map"]')) mapView(); if (e.target.closest('[data-a="ov"]')) overview(); }; };
  const teach = sel => sel.filter(w => !w.cho && w.t >= 1 && w.td !== d);
  if (id === 'tv') { const seen = new Set(), items = [], sel = [];
    for (const w of act) { if (seen.has(w.x.id) || items.length >= (lim || MAP_FIX[0])) continue; seen.add(w.x.id); if (w.k === 'noi') continue; sel.push(w); items.push({ w: w.x, type: TYPE_FOR[w.k] ? TYPE_FOR[w.k]() : 'w2vi' }); }
    if (!items.length) return toast('Chỗ đang chữa của Từ vựng cần nói: luyện ở 🏋️ Luyện tập (Safari).');
    const keep = memWords(curLevel(), now).filter(w => S.cards[w.id] && !seen.has(w.id) && wstat(S, w, now) === 'nho').sort((a, b) => recall(S.cards[a.id], now) - recall(S.cards[b.id], now)).slice(0, lim ? 2 : MAP_FIX[1]);
    for (const w of keep) items.push({ w, type: typeFor(S.cards[w.id], now, w) }); let ok = 0;
    return mapTeach(teach(sel), () => run({ title: '🗺 Chữa chỗ yếu · Từ vựng', items: shuf(items), first: (it, good, type) => { grade(S, it.w.id, good, Date.now(), type); if (good) ok++; save(); },
      done: () => fin('Xong buổi chữa', `<p>Đúng ngay lần đầu ${ok}/${items.length}.</p>`) })); }
  if (id === 'pa') { toast('Phát âm: luyện ở 👄 Phát âm (cần bộ chấm âm).'); return paView(); }
  const P = KIT[id], picks = [], seen = new Set(), sel = [];
  for (const w of act) { if (seen.has(w.x.id) || picks.length >= (lim || 6)) continue; const mi = P.menu.findIndex(m => m[3].includes(w.k)); if (mi < 0) continue; seen.add(w.x.id); sel.push(w); picks.push([w.x, P.menu[mi][0]]); }
  if (P.needAsr && !SREC) return toast('Phần này cần máy chép lời: mở bằng Safari.');
  const qs = picks.flatMap(([x, m]) => P.ask(x, m)); if (!qs.length) return toast('Chưa tạo được câu chữa cho phần này.');
  mapTeach(teach(sel), () => kQuiz({ P, title: `🗺 Chữa ${P.t}`, qs, done: res => { const g = kGrade(P, res), ok = res.filter(r => r.ok).length;
    fin(`Xong buổi chữa ${P.t}`, `<p>Đúng ${ok}/${res.length}.</p><p class="mute">${g.map(([x, k, gg]) => `${gg ? '✅' : '❌'} ${esc(P.name(x))}`).join(' · ')}</p>`); } })); }
// 📘 xem lại ngắn: Từ vựng = thẻ từ; Đọc / Nghe = từ gốc còn thiếu trong bài (không có thì cả bài); phần khác = phần giảng của bài
function mapTeachHtml(w) { if (w.id === 'tv') return wordCard(w.x, reqsUpTo(curLevel()));
  if (w.id === 'pa') return `<div class="box"><b>${esc(w.x.title)}</b><p style="margin:6px 0 0">${esc(w.x.tip || '')}</p></div>`;
  const P = KIT[w.id];
  if (w.id === 'doc' || w.id === 'nghe') { const gap = mapGap(w); if (gap.length) return `<div class="box"><b>${P.ic} ${esc(P.name(w.x))}</b><p class="mute" style="margin:4px 0">Từ trong bài bạn chưa học / đang quên:</p>${gap.slice(0, 10).map(g => `<p style="margin:2px 0"><b>${esc(g.w)}</b> · ${esc(g.vi)}</p>`).join('')}</div>`; }
  return `<div class="box">${P.lesson(w.x)}</div>`; }
function mapTeach(ws, go) { if (!ws.length) return go();
  $app.innerHTML = `${backRow('📘 Xem lại trước khi thử')}<h1>📘 Xem lại trước khi thử</h1><p class="mute">${ws.length} chỗ đã thử mà chưa qua. Đọc lại ngắn rồi mới thử: hỏi lại mà không xem lại thì dễ sai lại.</p>
    ${ws.slice(0, 6).map(mapTeachHtml).join('')}<button class="pri" data-mt="go">Thử lại →</button>`;
  $app.onclick = e => { if (e.target.closest('[data-a="home"]')) return mapView(); if (e.target.closest('[data-mt="go"]')) { scrollTo(0, 0); go(); } }; }
// 🧱 gác lần 2 (đã quay lại mà vẫn kẹt): thôi hỏi tiếp, học lại cả bài gốc; xong thì vào lại cuối hàng chờ với 3 lần thử mới
function mapRelearn(q) { const it = mapItem(q), pre = q.slice(0, q.lastIndexOf('|') + 1), ps = (S.focus.p || []).filter(x => x.root && x.q.startsWith(pre)); if (!it || !ps.length) return mapView();
  const ok = () => { for (const p of ps) { p.root = false; p.at = Date.now() - MAP_PARK_D * DAY; } S.t = Date.now(); save(); };   // học lại cả bài: gỡ mọi mặt kẹt của bài đó
  if (it.id === 'tv') return lessonRun(UBY[it.x.u], [it.x], reqsUpTo(curLevel()), `🧱 Học lại: ${it.x.w}`, () => { ok(); mapView(); });
  if (it.id === 'pa') { ok(); return paLearn(it.x); }
  const P = KIT[it.id]; $app.innerHTML = `${backRow('🧱 Học lại bài gốc')}${P.lesson(it.x)}${kTeach(P, it.x)}<button class="pri" data-mr="ok">✅ Đã học lại xong</button>`;
  $app.onclick = e => { if (e.target.closest('[data-a="home"]')) return mapView(); if (e.target.closest('[data-kl="vi"]')) { const v = document.getElementById('kvi'); if (v) v.hidden = !v.hidden; return; }
    if (e.target.closest('[data-mr="ok"]')) { ok(); scrollTo(0, 0); mapView(); } }; }
// ô 📅 Hôm nay: chữa 5 chỗ của phần có nhiều chỗ đang chữa nhất (chưa xác nhận trước)
function mapToday() { const f = mapFocus(), c = {}; for (const w of f.act) if (w.id !== 'pa' && !(w.id === 'tv' && w.k === 'noi')) c[w.id] = (c[w.id] || 0) + (w.cho ? 0.5 : 1);
  const id = Object.keys(c).sort((a, b) => c[b] - c[a])[0]; if (!id) return mapView(); mapFix(id, MAP_TODAY); }
// gốc từ vựng: ôn từ đang quên trong các bài yếu; từ chưa học → mở bài chứa từ đó
function mapRoot(roots, now = Date.now()) { const ws = [...new Map(roots.flatMap(r => r.gap).map(w => [w.id, w])).values()], have = ws.filter(w => S.cards[w.id]), none = ws.filter(w => !S.cards[w.id]);
  if (have.length) { let ok = 0; return run({ title: '🗺 Chữa gốc · từ trong bài yếu', items: shuf(have).slice(0, ROUND).map(w => ({ w, type: 'w2vi' })), first: (it, good, type) => { grade(S, it.w.id, good, Date.now(), type); if (good) ok++; save(); },
    done: () => { $app.innerHTML = `<div class="box"><b>Xong chữa gốc</b><p>Đúng ${ok}/${Math.min(ROUND, have.length)}.</p>${none.length ? `<p class="mute">Còn ${none.length} từ chưa học (${none.slice(0, 6).map(w => esc(w.w)).join(', ')}…): học bài chứa chúng.</p><button data-a="unit">📘 Học bài có ${esc(none[0].w)}</button>` : ''}</div><button class="pri" data-a="map">🗺 Về bản đồ</button>`;
      $app.onclick = e => { if (e.target.closest('[data-a="map"]')) mapView(); if (e.target.closest('[data-a="unit"]')) learn(UBY[none[0].u]); }; } }); }
  if (none.length) return learn(UBY[none[0].u]); toast('Không còn từ gốc cần chữa.'); }
// 🔎 quét lại: 8 từ đang nhớ (xác nhận, sai thì mở lại) + 12 từ chưa học của các cấp ≤ cấp đang học (biết rồi thì tính đã học, như ⚡ kiểm tra đầu bài)
function mapScan(now = Date.now()) { const lv = curLevel(), held = shuf(memWords(lv, now).filter(w => S.cards[w.id] && wstat(S, w, now) === 'nho')).slice(0, 8);
  const unl = shuf(WORDS.filter(w => !S.cards[w.id] && LEVELS.indexOf(wLv(w)) <= LEVELS.indexOf(lv) && w.vi)).slice(0, 12); let okH = 0;
  const after = () => { if (!unl.length || typeof ptRun !== 'function') return fin(0, 0); ptRun({ id: 'quet', words: unl, vi: 'Quét lại', lv }, known => fin(known.size, unl.length), '🔎 Quét lại · từ chưa học'); };
  const fin = (k, n) => { (S.scan = S.scan || []).push({ at: Date.now(), held: held.length, heldOk: okH, unl: n, known: k }); S.t = Date.now(); save();
    $app.innerHTML = `<div class="box"><b>🔎 Xong quét lại</b><p>Từ đang nhớ: đúng ${okH}/${held.length}${held.length - okH ? ` (${held.length - okH} từ đã quên, đã đưa về ôn)` : ''}.${n ? ` Từ chưa học: đã biết ${k}/${n} (tính đã học).` : ''}</p>
      <p class="mute">Quét lại mỗi ${MAP_SCAN_D} ngày để tìm chỗ lủng mới và chỗ đã biết mà app chưa thấy.</p></div><button class="pri" data-a="map">🗺 Về bản đồ</button>`;
    $app.onclick = e => { if (e.target.closest('[data-a="map"]')) mapView(); }; };
  if (!held.length) return after();
  run({ title: '🔎 Quét lại · từ đang nhớ', items: held.map(w => ({ w, type: 'spell' })), first: (it, good, type) => { grade(S, it.w.id, good, Date.now(), type); if (good) okH++; save(); }, done: after }); }
let MAP_BACK = 'hoc';   // v95: mở từ 👤 Của tôi (data-mapv="ct") thì nút về và tab sáng là Của tôi; từ ô Hôm nay thì về 🎯 Học
document.addEventListener('click', e => { if (!S) return; const mv = e.target.closest('[data-mapv]'); if (mv) { MAP_BACK = mv.dataset.mapv || 'hoc'; scrollTo(0, 0); mapView(); } const r = e.target.closest('[data-map-rl]'); if (r) { scrollTo(0, 0); mapRelearn(r.dataset.mapRl); } });
