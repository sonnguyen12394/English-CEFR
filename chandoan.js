// 🔎 Xác nhận chỗ yếu sau bài kiểu xếp cấp (v106, 1/11/2026, người sáng lập hỏi "thi xếp lớp và kiểm tra phát hiện điểm yếu khác nhau chỗ nào, ảnh hưởng
// bản đồ ra sao; bản đồ 3 mục nên gộp không" rồi "tự tính làm đi").
// 🧭 Xếp cấp hỏi RỘNG, mỗi từ / điểm ngữ pháp chỉ 1 câu: đủ tin để chọn CẤP, không đủ tin để kết luận TỪNG MỤC (đoán trúng, bấm nhầm, nhiễu khó).
// 🔎 Kiểm tra tìm điểm yếu hỏi HẸP mà SÂU: nhiều câu, nhiều dạng cho cùng một mục. Nên câu sai ở bài kiểu xếp cấp chỉ là giả thuyết:
//   hỏi thêm PL_CF_N = 2 câu dạng khác (từ: điền vào câu / nghĩa → từ; ngữ pháp: hiểu nghĩa câu / nhận ra câu khác), tối đa PL_CF_MAX chỗ (~2–3 phút).
//   Sai thêm ≥ 1 câu (tổng ≥ 2 / 3 lần, như bản đồ cần ≥ 2 lần) = sai thật; đúng cả 2 = bấm nhầm / đoán, bỏ qua.
//   Mục đã học (có thẻ): câu xác nhận chấm như luyện tập (grade / kGrade) → 🗺 bản đồ tự thấy mặt sai.
//   🧭 Xếp cấp: mục sai thật ở cấp đã nắm vững (≤ cấp xếp được) → 🧭 chỗ hổng nền (S.place.gap; không tạo thẻ, không tính 📘 Học);
//     bản đồ đưa vào nhóm 🌱 Gốc (học trước). Hết hổng = làm đúng ở một ngày SAU lần sai gần nhất (như "chữa xong" của bản đồ; báo qua mapHit).
//   📝 Kiểm tra nhẹ cuối đợt (lotrinh.js): chỉ xác nhận mục đã học của cấp đang học; không thêm chỗ hổng.
// Câu xác nhận không đổi cấp xếp được. Không đổi luật đo.
const PL_CF_N = 2, PL_CF_MAX = 6;
const plKey = it => it.w ? 'tv|' + it.w.id : 'np|' + it.g.id;
const plHas = it => it.w ? !!S.cards[it.w.id] : !!kSt('np').cards[it.g.id];
// 2 câu dạng khác câu xếp cấp (xếp cấp hỏi từ → nghĩa; ngữ pháp hỏi "chọn từ đúng" ở 1 câu đề thi)
function plCfQs(it) { const ok = q => q && q.opts && q.opts.includes(q.a) && new Set(q.opts).size === q.opts.length;
  if (it.w) { const w = it.w; return [w.cloze ? 'cloze' : 'w2vi', 'vi2w'].map(t => question(w, t)).filter(ok).slice(0, PL_CF_N); }
  const P = KIT.np, x = it.g, used = it.q && it.q.q; let hi = [], nh = [];
  try { hi = shuf(P.q(x, 'hieu')).slice(0, 1); nh = shuf([...P.q(x, 'nhan', 'learn'), ...P.q(x, 'nhan', 'test')].filter(q => q.q !== used)); } catch (e) {}
  return [...hi, ...nh].filter(ok).slice(0, PL_CF_N); }
// cands: [{ w | g, q (câu đã sai), lv }]; o = { gap: true → mục sai thật vào 🧭 chỗ hổng nền, intro }; done({ n, sure, noise, keys }) hoặc done(null)
function plConfirm(cands, o, done) { const list = []; for (const it of cands) for (const q of plCfQs(it)) list.push({ it, q });
  if (!list.length) return done(null); window.CUR = { view: 'xep-cap-xac-nhan' };   // TD_NOTAP: không chạm-tra-từ (lộ đáp án)
  const ans = new Map(); let i = 0;
  const fin = () => { const now = Date.now(), d = dayOf(now), sure = [], noise = [];
    for (const it of cands) { const a = ans.get(it) || []; if (!a.length) continue;
      if (it.w && S.cards[it.w.id]) for (const x of a) grade(S, it.w.id, x.ok, now, x.q.type);   // đã học: chấm như luyện tập
      if (it.g && kSt('np').cards[it.g.id]) kGrade(KIT.np, a.map(x => ({ x: it.g, k: x.q.k, ok: x.ok })));
      (a.some(x => !x.ok) ? sure : noise).push(it); }
    if (o.gap && S.place) { const G = S.place.gap = S.place.gap || [];
      for (const it of sure) { const k = plKey(it); if (!G.some(g => g.k === k && !g.ok)) G.push({ k, lv: it.w ? wLv(it.w) : it.g.lv, d, wd: d }); } }
    S.t = Date.now(); save(); done({ n: cands.length, sure: sure.length, noise: noise.length, keys: sure.map(plKey) }); };
  const show = () => { if (i >= list.length) return fin(); const { it, q } = list[i];
    $app.innerHTML = `<div class="row top"><button class="link" data-a="skip">Bỏ qua bước này</button><span class="uname">🔎 Xác nhận · ${i + 1}/${list.length}</span></div>
      ${i === 0 ? `<div class="box"><p style="margin:0">${o.intro || ''}</p></div>` : ''}
      ${it.w ? `<p class="q">${q.top}</p><p class="mute">${q.sub}</p>` : `${q.head || ''}<p class="q">${q.q}</p>`}
      ${q.opts.map((x, k) => `<button class="opt" data-po="${k}">${esc(x)}</button>`).join('')}<button class="opt" data-po="-1" style="opacity:.75">🤷 Chưa biết</button>`;
    $app.onclick = e => { if (e.target.closest('[data-a="skip"]')) return fin(); const b = e.target.closest('[data-po]'); if (!b) return; const k = +b.dataset.po;
      if (!ans.has(it)) ans.set(it, []); ans.get(it).push({ q, ok: k >= 0 && q.opts[k] === q.a }); i++; show(); }; };
  scrollTo(0, 0); show(); }
const plCfTxt = cf => cf && cf.n ? `🔎 Xác nhận ${cf.n} chỗ sai: <b>${cf.sure}</b> chỗ sai thật${cf.noise ? `, ${cf.noise} chỗ chỉ là bấm nhầm / đoán (bỏ qua)` : ''}.` : '';

// ---------- 🧭 chỗ hổng nền (S.place.gap: [{ k: 'tv|id' | 'np|id', lv, d (ngày phát hiện), wd (ngày sai gần nhất), cd (ngày đúng gần nhất), ok (ngày hết hổng) }]) ----------
function plGaps(now = Date.now()) { const t = dayOf(now);
  return ((S.place || {}).gap || []).filter(g => !g.ok).map(g => { const i = g.k.indexOf('|'), id = g.k.slice(0, i), xid = g.k.slice(i + 1);
    const x = id === 'tv' ? WBY[xid] : ((KIT.np || {}).items || []).find(y => y.id === xid); if (!x) return null;
    return { ...g, id, x, c: id === 'tv' ? S.cards[xid] : kSt('np').cards[xid], cho: g.cd === t }; }).filter(Boolean); }
// mọi lần chấm báo qua mapHit (grade): sai → ngày sai mới; đúng ở ngày sau lần sai gần nhất → hết hổng
function plGapHit(id, xid, ok, now = Date.now()) { const G = S && S.place && S.place.gap; if (!G || !G.length) return; const k = id + '|' + xid, d = dayOf(now);
  for (const g of G) if (g.k === k && !g.ok) { if (!ok) { g.wd = d; g.cd = null; } else if (d > (g.wd ?? g.d)) g.ok = d; else g.cd = d; } }
{ const h0 = mapHit; window.mapHit = function (id, xid, ks, ok, now = Date.now()) { h0(id, xid, ks, ok, now); plGapHit(id, xid, ok, now); }; }
// ▶ chữa chỗ hổng: mục đã có thẻ → hỏi lại (chấm như luyện tập); chưa học → mở bài học (ngữ pháp trước, rồi bài có từ)
function mapGapFix() { const G = plGaps(), now = Date.now(), act = G.filter(g => !g.cho);
  if (!act.length) { toast(G.length ? 'Đã làm đúng hôm nay: mai đúng lần nữa là hết hổng.' : 'Không còn chỗ hổng nền.'); return mapView(); }
  const fin = (ok, n) => { const L = plGaps(); $app.innerHTML = `<div class="box"><b>Xong buổi chữa chỗ hổng</b><p>Đúng ${ok}/${n}.</p><p class="mute">Còn ${L.length} chỗ hổng. Đúng ở một ngày sau lần sai gần nhất thì hết hổng.</p></div><button class="pri" data-a="map">🗺 Về bản đồ</button>`;
    $app.onclick = e => { if (e.target.closest('[data-a="map"]')) mapView(); }; };
  const tvC = act.filter(g => g.id === 'tv' && g.c), npC = act.filter(g => g.id === 'np' && g.c);
  if (tvC.length) { let ok = 0; const items = shuf(tvC).slice(0, ROUND).map(g => ({ w: g.x, type: typeFor(g.c, now, g.x) }));
    return run({ title: '🧭 Chữa chỗ hổng nền · Từ vựng', items, first: (it, good, type) => { grade(S, it.w.id, good, Date.now(), type); if (good) ok++; save(); }, done: () => fin(ok, items.length) }); }
  if (npC.length) { const P = KIT.np, qs = npC.slice(0, 6).flatMap(g => npBac(g.x)); if (qs.length) return kQuiz({ P, title: '🧭 Chữa chỗ hổng nền · Ngữ pháp', qs, done: res => { kGrade(P, res); fin(res.filter(r => r.ok).length, res.length); } }); }
  const npN = act.find(g => g.id === 'np' && !g.c); if (npN) return kLearn(KIT.np, npN.x);
  const tvN = act.find(g => g.id === 'tv' && !g.c); if (tvN) return learn(UBY[tvN.x.u]);
  mapView(); }
