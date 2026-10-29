// 🎯 Cơ chế "nhóm đang chữa" dùng chung cho 🗺 Bản đồ band IELTS (iemap.js) và 🗺 Bản đồ điểm TOEIC (tomap.js) (v84, 29/10/2026).
// (Bản đồ chỗ yếu CEFR, bando.js, có luật riêng theo thẻ ôn: không dùng chung.)
// F = { a: [{ u, at, tr (số ngày đã thử), td, pd (ngày đạt liền nhau), r (lần quay lại) }], p: [{ u, at, r, root }] (gác), n: số chỗ chữa xong, fx: { u: lúc chữa xong } }
// weakFn() → chỗ yếu đã xếp ưu tiên [{ u, sk, … }] (weakFn tự bỏ lượt làm trước F.fx[u]: chỗ vừa chữa xong không bị lượt cũ kéo vào lại).
// cfg = { act: số chỗ tối đa, cap: sk → số chỗ tối đa của nhóm kỹ năng đó, try: số ngày thử, parkD: số ngày gác, info: u → chỗ khi không còn trong danh sách yếu }
// Luật: đạt 2 lượt liền ở 2 ngày khác nhau = xong · thử đủ `try` ngày còn yếu → ⏸ gác `parkD` ngày → quay lại cuối hàng chờ · kẹt lần 2 → 🧱 root (không tự quay lại).
function fcFocus(F, weakFn, cfg, now = Date.now()) { F.a = F.a || []; F.p = F.p || []; F.n = F.n || 0; F.fx = F.fx || {};
  const fixed = u => { F.n++; F.fx[u] = now; };
  let weak = weakFn(), by = new Map(weak.map(w => [w.u, w]));
  const np = []; for (const p of F.p) { if (by.has(p.u)) np.push(p); else fixed(p.u); } F.p = np;   // hết yếu trong lúc gác = chữa xong
  const keep = []; for (const f of F.a) { if ((f.pd || []).length >= 2) { fixed(f.u); continue; }
    if ((f.tr || 0) >= cfg.try) { if (by.has(f.u)) F.p.push({ u: f.u, at: now, r: f.r || 0, root: (f.r || 0) >= 1 }); else fixed(f.u); continue; } keep.push(f); }
  weak = weakFn(); by = new Map(weak.map(w => [w.u, w]));   // chỗ vừa chữa xong: bỏ lượt cũ
  const cnt = {}, inA = new Set(keep.map(f => f.u)), parked = new Map(F.p.map(p => [p.u, p])), back = p => !p.root && now - p.at >= cfg.parkD * DAY;
  const skOf = u => (by.get(u) || cfg.info(u)).sk; for (const f of keep) cnt[skOf(f.u)] = (cnt[skOf(f.u)] || 0) + 1;
  const queue = [...weak.filter(w => !inA.has(w.u) && !parked.has(w.u)), ...weak.filter(w => parked.has(w.u) && back(parked.get(w.u)))];   // chỗ gác hết hạn: cuối hàng
  for (const w of queue) { if (keep.length >= cfg.act) break; if (inA.has(w.u) || (cnt[w.sk] || 0) >= cfg.cap(w.sk)) continue; const pk = parked.get(w.u);
    keep.push({ u: w.u, at: now, tr: 0, r: pk ? pk.r + 1 : 0, pd: [] }); inA.add(w.u); cnt[w.sk] = (cnt[w.sk] || 0) + 1; if (pk) F.p = F.p.filter(p => p.u !== w.u); }
  F.a = keep;
  const info = u => by.get(u) || cfg.info(u);
  return { act: keep.map(f => ({ ...info(f.u), tr: f.tr || 0, r: f.r || 0, pd: (f.pd || []).length, td: f.td })), queue: queue.filter(w => !inA.has(w.u)),
    park: F.p.filter(p => !p.root && !back(p)).map(p => ({ ...info(p.u), at: p.at })), root: F.p.filter(p => p.root).map(p => info(p.u)), done: F.n }; }
// một lượt của chỗ đang chữa: mỗi ngày tính 1 lần thử; đạt thì thêm ngày vào chuỗi đạt, trượt xoá chuỗi
function fcHit(F, u, pass, now = Date.now()) { if (!F || !F.a) return; const f = F.a.find(x => x.u === u); if (!f) return; const d = dayOf(now);
  if (f.td !== d) { f.tr = (f.tr || 0) + 1; f.td = d; } f.pd = pass ? [...new Set([...(f.pd || []), d])] : []; }
// "Đã học nền" ở chỗ 🧱: vào lại hàng chờ ngay
function fcRelease(F, u) { const p = (F.p || []).find(x => x.u === u); if (p) { p.root = false; p.at = Date.now() - 365 * DAY; } }
