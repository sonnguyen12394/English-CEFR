// 🗺 Bản đồ chỗ yếu (v78, 29/10/2026, người sáng lập: chiến lược "học nhanh" nhiều tầng — "kiểm tra đầu vào phủ nhanh chỗ mạnh yếu (cấp 1) → tập trung chỗ yếu trước
// để bù chỗ lủng, không để kỹ năng lệch → bài học và rèn luyện bóc tiếp chỗ lủng sâu hơn … như vạch lá tìm sâu nhưng theo nhiều tầng"; "xây chiến lược này, để ở mục dữ liệu").
// Đặt ở tab 💾 Dữ liệu (trước gọi 💾 Sao lưu). Chỉ đọc bằng chứng sẵn có (thẻ ôn của 7 phần), không đổi luật đo; buổi chữa dùng đúng bộ chấm + lịch ôn của từng phần.
//   Tầng 1 · Phủ: mỗi phần ở cấp đang học có bao nhiêu % bài / từ đã có bằng chứng; phần "chưa rõ" → 🔎 Quét lại (mỗi 21 ngày: kiểm tra từ chưa học + xác nhận từ đã nhớ).
//   Tầng 2 · Chữa: danh sách chỗ yếu = mặt đã làm sai (nặng) hoặc đã quên (nhẹ hơn); mức ưu tiên = mức yếu × mức tin cậy × mức quan trọng
//     (tin cậy: ≥ 2 lần làm mới chắc; quan trọng: mặt cốt lõi > mặt chiều sâu, cấp đang học > cấp dưới). Buổi chữa 70 / 30: 14 chỗ yếu + 6 từ đang nhớ cần giữ.
//   Tầng 3 · Truy gốc: bài Đọc / Nghe / Ngữ pháp còn yếu → từ trong bài chưa học hoặc đang quên (gốc từ vựng) → chữa gốc trước.
//   Cân bằng: nhóm Hiểu (Từ vựng, Ngữ pháp, Đọc, Nghe) và nhóm Tạo ra (Nói, Viết, Phát âm); phần nào ≥ 3 ngày chưa luyện thì nhắc (máy đo Nói / Viết yếu, nên không để "yếu nhất trước" bỏ quên chúng).
// 🎯 Giới hạn (v79, người sáng lập: "giới hạn lại số lỗi để học và số lỗi tương lai cần tập trung học tiếp sau khi hoàn thành những lỗi cũ"): chỉ chữa tối đa 15 chỗ
//   một lúc (S.focus), Từ vựng tối đa 9 nếu phần khác cũng có chỗ yếu; còn lại vào ⏳ hàng chờ theo ưu tiên. Chỗ nào hết yếu thì ra khỏi nhóm (đếm ✅ chữa xong),
//   chỗ đầu hàng chờ tự vào thay. Chỗ yếu mới phát hiện vào hàng chờ, không chen vào nhóm đang chữa. Chữa ≥ 14 ngày chưa xong → 🐢, gợi ý truy gốc / học lại.
// Quy tắc dừng: một chỗ yếu hết yếu khi lần gần nhất đúng và khả năng nhớ ≥ 80% (luật Nhớ); làm đúng ở ngày khác mới tính, nên tự cần ≥ 2 ngày.
const MAP_CORE = new Set(['nghia', 'nghe', 'chu', 'nhora', 'noi', 'viet']), MAP_SCAN_D = 21, MAP_IDLE_D = 3, MAP_FIX = [14, 6];
const MAP_GROUP = [['Hiểu', ['tv', 'np', 'doc', 'nghe']], ['Tạo ra', ['noi', 'viet', 'pa']]];
// cấp đang học của từng phần (như "Nên làm")
const mapLv = id => id === 'tv' ? curLevel() : id === 'pa' ? paLevel() : kLv(KIT[id]);
// một mặt của một thẻ: 'sai' (lần gần nhất sai), 'quen' (đúng nhưng khả năng nhớ < 80%), 'vung', 'chua' (chưa có bằng chứng)
function mapFace(c, k, now) { const d = c && c.dm && c.dm[k]; if (!d) return 'chua'; if (!d.ok) return 'sai'; return heldDim(c, k, now) ? 'vung' : recall(c, now) < MEM_R ? 'quen' : 'chua'; }
const MAP_SEV = { sai: 1, quen: 0.6 };
// mọi chỗ yếu: { id (phần), x (từ / bài), k (mặt), st, p (ưu tiên), lv }
function mapWeak(now = Date.now()) { const out = [], push = (id, x, k, c, lvItem, lvPart, core) => { const st = mapFace(c, k, now); if (!MAP_SEV[st]) return;
    const n = (c.dm[k].n || 0) + (c.lapse || 0), conf = n >= 2 ? 1 : 0.6, imp = (core ? 1 : 0.7) * (lvItem === lvPart ? 1 : 0.8);
    out.push({ id, x, k, st, lv: lvItem, p: Math.round(MAP_SEV[st] * conf * imp * 100) / 100 }); };
  { const lv = curLevel(); for (const w of memWords(lv, now)) { const c = S.cards[w.id]; if (!c) continue; for (const k of wDims(w, lv)) if (k !== 'noi' || SREC) push('tv', w, k, c, wLv(w), lv, MAP_CORE.has(k)); } }
  for (const P of Object.values(KIT)) { if (!P.items) continue; const lv = kLv(P), st = kSt(P.id).cards; for (const x of kMem(P, lv)) { const c = st[x.id]; if (c) for (const k of kDimsOf(P, x)) push(P.id, x, k, c, x.lv, lv, true); } }
  if (PA) { const lv = paLevel(); for (const x of PA.filter(x => PA_LV.indexOf(x.lv) <= PA_LV.indexOf(lv))) { const c = paSt()[x.id]; if (c) for (const [k] of PA_DIMS) push('pa', x, k, c, x.lv, lv, true); } }
  return out.sort((a, b) => b.p - a.p); }
// tầng 1: độ phủ bằng chứng ở cấp đang học của mỗi phần
function mapCover() { return OV.map(([id, ic, t]) => { const lv = mapLv(id);
  if (id === 'tv') { const ws = levelWords(lv), h = ws.filter(w => S.cards[w.id]).length; return { id, ic, t, lv, n: ws.length, has: h }; }
  if (id === 'pa') { const its = PA ? PA.filter(x => x.lv === lv) : [], h = its.filter(x => paSt()[x.id]).length; return { id, ic, t, lv, n: its.length, has: h }; }
  const P = KIT[id], its = P.items ? kItems(P, lv) : [], h = its.filter(x => kSt(id).cards[x.id]).length; return { id, ic, t, lv, n: its.length, has: h }; }); }
// lần luyện gần nhất của một phần (ngày)
function mapLast(id) { const cs = id === 'tv' ? Object.values(S.cards) : id === 'pa' ? Object.values(paSt()) : Object.values(kSt(id).cards); let m = 0; for (const c of cs) if (c.last > m) m = c.last; return m; }
// tầng 3: bài Đọc / Nghe / Ngữ pháp còn yếu → từ trong bài chưa học hoặc đang quên
const mapText = x => [x.text, x.title, ...(x.lines || []).map(l => l[1]), ...(x.ex || []).map(e => e[0]), ...((x.mc && x.mc.test) || []).map(m => m.s)].filter(Boolean).join(' ');
function mapRoots(weak, now = Date.now()) { const seen = new Set(), out = [];
  for (const it of weak.filter(w => ['doc', 'nghe', 'np'].includes(w.id))) { if (seen.has(it.x.id)) continue; seen.add(it.x.id);
    const ws = (typeof mfWords === 'function' ? mfWords(mapText(it.x)) : []).filter(w => LEVELS.indexOf(wLv(w)) <= LEVELS.indexOf(it.lv) + 1);
    const gap = ws.filter(w => { const c = S.cards[w.id]; return !c || wstat(S, w, now) === 'quen'; });
    if (gap.length) out.push({ it, gap: gap.slice(0, 12) }); if (out.length >= 5) break; }
  return out; }
// 🎯 nhóm đang chữa + ⏳ hàng chờ: bỏ chỗ đã hết yếu, lấp chỗ trống theo ưu tiên. Lưu ở S.focus = { a: [{ q, at }], n: số chỗ đã chữa xong }
const MAP_ACT = 15, MAP_TV_MAX = 9, MAP_SLOW_D = 14, mapKey = w => `${w.id}|${w.x.id}|${w.k}`;
function mapFocus(now = Date.now(), weak = mapWeak(now)) { const F = S.focus = S.focus || { a: [], n: 0 }, by = new Map(weak.map(w => [mapKey(w), w]));
  const keep = F.a.filter(f => by.has(f.q)); F.n = (F.n || 0) + F.a.length - keep.length;
  const inAct = new Set(keep.map(f => f.q)); let tv = keep.filter(f => f.q.startsWith('tv|')).length;
  for (const pass of [1, 2]) for (const w of weak) { if (keep.length >= MAP_ACT) break; const q = mapKey(w); if (inAct.has(q) || (pass === 1 && w.id === 'tv' && tv >= MAP_TV_MAX)) continue;
    keep.push({ q, at: now }); inAct.add(q); if (w.id === 'tv') tv++; }
  F.a = keep;
  return { act: keep.map(f => ({ ...by.get(f.q), at: f.at, slow: now - f.at >= MAP_SLOW_D * DAY })), queue: weak.filter(w => !inAct.has(mapKey(w))), done: F.n }; }
const mapScanDue = (now = Date.now()) => { const s = (S.scan || []).slice(-1)[0]; return !s || now - s.at >= MAP_SCAN_D * DAY; };

// ---------- màn 🗺 Bản đồ chỗ yếu ----------
async function mapView() { window.CUR = { view: 'ban-do' }; BACK = null; $app.innerHTML = '<div id="dl"></div><p class="mute">Đang tải…</p>';
  try { await Promise.all([paLoad(), ...Object.values(KIT).map(kLoad)]); } catch (e) {}
  const now = Date.now(), weak = mapWeak(now), fo = mapFocus(now, weak), fby = {}, cov = mapCover(), roots = mapRoots(weak, now), by = {}; for (const w of weak) (by[w.id] = by[w.id] || []).push(w); for (const w of fo.act) (fby[w.id] = fby[w.id] || []).push(w); save();
  const nm = id => OV.find(o => o[0] === id), face = (id, k) => id === 'tv' ? (VREQ_BY[k] || [k, k])[1] : id === 'pa' ? (PA_DIMS.find(d => d[0] === k) || [k, k])[1] : (KIT[id].dims.find(d => d[0] === k) || [k, k])[1];
  const label = w => w.id === 'tv' ? esc(w.x.w) : w.id === 'pa' ? esc(w.x.title || w.x.id) : esc(KIT[w.id].name ? KIT[w.id].name(w.x) : w.x.id);
  const any = OV.some(([id]) => mapLast(id)), idle = OV.map(([id, ic, t]) => [id, ic, t, mapLast(id)]).filter(([, , , l]) => l ? (now - l) / DAY >= MAP_IDLE_D : any);   // đã học phần khác mà phần này chưa luyện lần nào cũng nhắc
  const noData = !Object.keys(S.cards).length && !Object.values(S.k || {}).some(k => Object.keys(k.cards || {}).length);
  $app.innerHTML = `<div id="dl"></div><div class="row top"><button class="link" data-a="bk">← Dữ liệu</button><span class="uname">🗺 Bản đồ chỗ yếu</span></div><h1>🗺 Bản đồ chỗ yếu</h1>
    <p class="mute">Gom mọi bằng chứng (kiểm tra, luyện, thi, tra từ) thành chỗ cần chữa. Chữa chỗ yếu trước, giữ cân bằng các kỹ năng, rồi đào tiếp chỗ lủng sâu hơn.</p>
    ${noData ? '<div class="box"><b>Chưa có dữ liệu học.</b><p class="mute" style="margin:6px 0 0">Bản đồ lớn dần khi bạn học. Bắt đầu: 🎯 Học CEFR → ô 📅 Hôm nay → 🧭 Kiểm tra xếp cấp.</p></div>' : ''}
    <div class="box"><b>① Tầng phủ · đã có bằng chứng ở cấp đang học</b>
      ${cov.map(c => `<div class="row" style="margin-top:6px"><span>${c.ic} ${c.t} <span class="mute">${LVN[c.lv] || ''}</span></span><span class="mute">${c.has}/${c.n}</span></div>${bar(c.n ? Math.round(c.has / c.n * 100) : 0, 100, 'var(--accent)')}`).join('')}
      <p class="mute" style="margin:6px 0 0">Phần chưa có bằng chứng là "chưa rõ": có thể bạn đã biết. 🔎 Quét lại để tìm nhanh, khỏi học lại.</p>
      <button class="${mapScanDue(now) && !noData ? 'pri' : ''}" data-map="scan" style="margin-top:6px">🔎 Quét lại (~5 phút)${mapScanDue(now) ? '' : ` · lần trước ${new Date(S.scan.slice(-1)[0].at).toLocaleDateString('vi-VN')}`}</button></div>
    <div class="box"><div class="row"><b>② Tầng chữa · 🎯 đang chữa</b><span class="mute">${fo.act.length}/${MAP_ACT} chỗ</span></div>
      ${fo.act.length ? `<p class="mute" style="margin:4px 0">Chữa tối đa ${MAP_ACT} chỗ một lúc cho chắc. Chỗ nào xong, chỗ đầu hàng chờ tự vào. ❌ = làm sai lần gần nhất · ⚠️ = đã quên (khả năng nhớ &lt; 80%).</p>
        ${OV.filter(([id]) => fby[id]).map(([id, ic, t]) => `<details style="margin:6px 0"${id === fo.act[0].id ? ' open' : ''}><summary>${ic} ${t}: <b>${fby[id].length}</b> chỗ đang chữa</summary>
          ${fby[id].map(w => `<p style="margin:2px 0;font-size:15px">${w.st === 'sai' ? '❌' : '⚠️'} ${label(w)} <span class="mute">· ${esc(face(id, w.k))}${w.lv ? ' · ' + LVN[w.lv] : ''}</span>${w.slow ? ' 🐢' : ''}</p>`).join('')}
          <button class="pri" data-map="fix|${id}" style="margin-top:4px">▶ Chữa ${ic} ${t}</button></details>`).join('')}
        ${fo.act.some(w => w.slow) ? `<p class="mute" style="margin:4px 0">🐢 = đã chữa ≥ ${MAP_SLOW_D} ngày chưa xong: xem ③ tầng gốc hoặc học lại bài chứa nó.</p>` : ''}`
        : '<p class="mute" style="margin:4px 0">Chưa có chỗ yếu đã xác định. Học và luyện thêm, bản đồ sẽ tự hiện chỗ cần chữa.</p>'}
      <p style="margin:6px 0 0">✅ Đã chữa xong: <b>${fo.done}</b> chỗ</p>
      ${fo.queue.length ? `<details style="margin:6px 0"><summary>⏳ Hàng chờ: <b>${fo.queue.length}</b> chỗ (học sau khi xong nhóm đang chữa)</summary>
        ${fo.queue.slice(0, 10).map(w => `<p style="margin:2px 0;font-size:15px">${nm(w.id)[1]} ${label(w)} <span class="mute">· ${esc(face(w.id, w.k))}</span></p>`).join('')}
        ${fo.queue.length > 10 ? `<p class="mute" style="margin:2px 0">… và ${fo.queue.length - 10} chỗ nữa</p>` : ''}</details>` : ''}</div>
    <div class="box"><b>③ Tầng gốc · bài yếu do thiếu từ</b>
      ${roots.length ? roots.map(r => `<p style="margin:8px 0 2px">${nm(r.it.id)[1]} ${esc(KIT[r.it.id].name ? KIT[r.it.id].name(r.it.x) : r.it.x.id)}</p><p class="mute" style="margin:0">Từ chưa học / đang quên trong bài: ${r.gap.map(w => esc(w.w)).join(', ')}</p>`).join('')
        + `<button data-map="root" style="margin-top:6px">▶ Chữa gốc: ôn các từ đang quên${roots.some(r => r.gap.some(w => !S.cards[w.id])) ? ', mở bài có từ chưa học' : ''}</button>`
        : '<p class="mute" style="margin:4px 0">Chưa thấy bài Đọc / Nghe / Ngữ pháp nào yếu vì thiếu từ.</p>'}</div>
    <div class="box"><b>⚖️ Cân bằng kỹ năng</b>${MAP_GROUP.map(([g, ids]) => `<p style="margin:6px 0 2px"><b>${g}</b></p>${ids.map(id => { const [, ic, t] = nm(id), l = mapLast(id), d = l ? Math.floor((now - l) / DAY) : null, n = (by[id] || []).length;
        const warn = d == null ? any : d >= MAP_IDLE_D; return `<div class="row" style="margin:2px 0"><span>${ic} ${t}</span><span class="${warn ? '' : 'mute'}">${d == null ? 'chưa luyện' : d === 0 ? 'hôm nay' : `${d} ngày trước`}${warn ? ' ⚠️' : ''} · ${n} yếu</span></div>`; }).join('')}`).join('')}
      <p class="mute" style="margin:6px 0 0">${idle.length ? `Nên luyện: ${idle.map(([, ic, t, l]) => ic + ' ' + t + (l ? '' : ' (chưa luyện lần nào)')).join(', ')}. ` : ''}Máy đo Nói, Viết yếu hơn Từ vựng; đừng để chúng bị bỏ quên chỉ vì máy ít thấy lỗi.</p></div>
    <p class="mute">Bản đồ chỉ đọc dữ liệu, không đổi luật đo. Chỗ yếu hết yếu khi làm đúng ở ngày sau và khả năng nhớ ≥ 80%.</p>`;
  $app.onclick = e => { if (e.target.closest('[data-a="bk"]')) return backup(); const b = e.target.closest('[data-map]'); if (!b) return; const [a, id] = b.dataset.map.split('|'); scrollTo(0, 0);
    if (a === 'scan') return mapScan(); if (a === 'root') return mapRoot(roots); if (a === 'fix') return mapFix(id); }; }

// ---------- buổi chữa ----------
// Từ vựng: 14 mặt yếu (ưu tiên cao trước, mỗi từ một mặt) + 6 từ đang nhớ khả năng nhớ thấp nhất (giữ, chống lủng mới) — bộ chấm, lịch ôn như 🏋️ Luyện tập
function mapFix(id, now = Date.now()) { const weak = mapFocus(now).act.filter(w => w.id === id); if (!weak.length) return toast('Phần này chưa có chỗ yếu.');
  if (id === 'tv') { const seen = new Set(), items = [];
    for (const w of weak) { if (seen.has(w.x.id) || items.length >= MAP_FIX[0]) continue; seen.add(w.x.id); if (w.k === 'noi') continue; const type = TYPE_FOR[w.k] ? TYPE_FOR[w.k]() : 'w2vi'; items.push({ w: w.x, type }); }
    const keep = memWords(curLevel(), now).filter(w => S.cards[w.id] && !seen.has(w.id) && wstat(S, w, now) === 'nho').sort((a, b) => recall(S.cards[a.id], now) - recall(S.cards[b.id], now)).slice(0, MAP_FIX[1]);
    for (const w of keep) items.push({ w, type: typeFor(S.cards[w.id], now, w) }); let ok = 0;
    return run({ title: '🗺 Chữa chỗ yếu · Từ vựng', items: shuf(items), first: (it, good, type) => { grade(S, it.w.id, good, Date.now(), type); if (good) ok++; save(); },
      done: () => { $app.innerHTML = `<div class="box"><b>Xong buổi chữa</b><p>Đúng ngay lần đầu ${ok}/${items.length}. ${(f => `🎯 Đang chữa ${f.act.length} chỗ · ✅ đã chữa xong ${f.done} · ⏳ hàng chờ ${f.queue.length}.`)(mapFocus())}</p><p class="mute">Chỗ vừa làm đúng sẽ hết yếu khi đúng thêm ở một ngày sau.</p></div><button class="pri" data-a="map">🗺 Về bản đồ</button>`;
        $app.onclick = e => { if (e.target.closest('[data-a="map"]')) mapView(); }; } }); }
  if (id === 'pa') { toast('Phát âm: luyện ở 👄 Phát âm (cần bộ chấm âm).'); return paView(); }
  const P = KIT[id], picks = [], seen = new Set();
  for (const w of weak) { if (seen.has(w.x.id) || picks.length >= 6) continue; const mi = P.menu.findIndex(m => m[3].includes(w.k)); if (mi < 0) continue; seen.add(w.x.id); picks.push([w.x, P.menu[mi][0]]); }
  if (P.needAsr && !SREC) return toast('Phần này cần máy chép lời: mở bằng Safari.');
  const qs = picks.flatMap(([x, m]) => P.ask(x, m)); if (!qs.length) return toast('Chưa tạo được câu chữa cho phần này.');
  kQuiz({ P, title: `🗺 Chữa ${P.t}`, qs, done: res => { const g = kGrade(P, res), ok = res.filter(r => r.ok).length;
    $app.innerHTML = `<div class="box"><b>Xong buổi chữa ${P.t}</b><p>Đúng ${ok}/${res.length}.</p><p class="mute">${g.map(([x, k, gg]) => `${gg ? '✅' : '❌'} ${esc(P.name(x))}`).join(' · ')}</p></div><button class="pri" data-a="map">🗺 Về bản đồ</button>`;
    $app.onclick = e => { if (e.target.closest('[data-a="map"]')) mapView(); }; } }); }
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
document.addEventListener('click', e => { if (e.target.closest('[data-mapv]') && S) { scrollTo(0, 0); mapView(); } });
// ô tóm tắt (đầu tab 💾 Dữ liệu, ô 📅 Hôm nay)
function mapCard() { const f = mapFocus(), scan = mapScanDue() && Object.keys(S.cards || {}).length;
  return `<div class="box"><div class="row"><b>🗺 Bản đồ chỗ yếu</b><span class="mute">🎯 ${f.act.length}/${MAP_ACT} · ⏳ ${f.queue.length}</span></div><p class="mute" style="margin:6px 0">Kiểm tra → chữa tối đa ${MAP_ACT} chỗ yếu một lúc → đào tiếp chỗ lủng sâu hơn, giữ cân bằng kỹ năng.${scan ? ' 🔎 Đã tới lúc quét lại.' : ''}</p><button class="pri" data-mapv>🗺 Mở bản đồ</button></div>`; }
