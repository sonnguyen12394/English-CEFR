// 📅 Hôm nay + 🧭 Kiểm tra xếp cấp (v74, 28/10/2026, người sáng lập: "phân tích điểm mạnh yếu … làm cho phần học CEFR trở nên giá trị").
// Dữ liệu thật (Supabase, 28/10): app được mở nhiều lần mỗi ngày nhưng không ghi tiến độ lần nào (0 câu trả lời); tài khoản học có 0 từ. Vấn đề chính không phải thiếu
// tính năng mà là chưa học đều. Tệp này thêm: ① đo phút học mỗi ngày (S.act, tính từ nhịp save()), mục tiêu phút, chuỗi ngày, 7 ngày gần nhất;
// ② ô Hôm nay ở đầu Tổng quan: 3 việc rõ ràng (ôn bài đến hạn → học bài mới → luyện 1 kỹ năng); ③ kiểm tra xếp cấp (chỉ gợi ý cấp bắt đầu, KHÔNG đổi luật đo:
// muốn bỏ qua cấp dưới vẫn dùng 🎚 Đặt tiến độ ở 💾 Sao lưu hoặc thi chuyển cấp như cũ). Không tính vào 📘 Học / 🔁 Nhớ / Thi chuyển cấp.

// ---------- ① phút học: mỗi lần save() (mỗi câu trả lời, mỗi bài) cộng khoảng cách tới lần trước nếu < 3 phút, không thì 15 giây ----------
const ACT_GAP = 180000, ACT_BASE = 15000, ACT_DAY_MIN = 5;   // ngày có ≥ 5 phút mới tính vào chuỗi
const actSt = () => (S.act = S.act || {});
function actTick(now = Date.now()) { if (!S) return; const d = dayOf(now), A = actSt(), o = A[d] = A[d] || { ms: 0, n: 0, last: 0 };
  o.ms += o.last && now - o.last < ACT_GAP ? now - o.last : ACT_BASE; o.n++; o.last = now;
  const old = Object.keys(A).filter(k => +k < d - 400); for (const k of old) delete A[k]; }   // giữ ~13 tháng
const actMin = d => Math.round(((actSt()[d] || {}).ms || 0) / 60000);
function actStreak(now = Date.now()) { const t = dayOf(now); let d = actMin(t) >= ACT_DAY_MIN ? t : t - 1, n = 0; while (actMin(d) >= ACT_DAY_MIN) { n++; d--; } return n; }
const actGoal = () => (S.goal = S.goal || 15);

// ---------- ② ô Hôm nay ----------
// tổng bài cần ôn của mọi phần (cấp đang học của từng phần, như "Nên làm")
function todayDue() { if (!(PA && Object.values(KIT).every(P => P.items))) return null; let n = 0;
  for (const [id] of OV) { const l = id === 'tv' ? curLevel() : id === 'pa' ? paLevel() : kLv(KIT[id]), s = ovStat(id, l); if (s) n += s.due; } return n; }
const todayNew = () => { const t = dayOf(Date.now()); return Object.values(S.cards || {}).filter(c => c.d0 === t).length + Object.values(S.k || {}).reduce((s, k) => s + Object.values(k.cards || {}).filter(c => c.d0 === t).length, 0); };
const TODAY_SK = ['nghe', 'noi', 'doc', 'viet'];
const todaySkill = () => { const t = dayOf(Date.now()); return TODAY_SK.some(id => { const k = (S.k || {})[id]; return k && (Object.values(k.cards || {}).some(c => c.last && dayOf(c.last) === t) || (k.runs || []).some(r => dayOf(r.at) === t)); }); };
// v86: nơi duy nhất bảo "làm gì" (o = { due: [phần, cấp] nhiều bài ôn nhất, low: [phần, cấp] 📘 Học thấp nhất } từ overview); bài kỹ năng do 🗺 bản đồ chọn trước
function todayBox(stage, o = {}) { const t = dayOf(Date.now()), m = actMin(t), g = actGoal(), st = actStreak(), due = todayDue(), nw = todayNew(), sk = todaySkill();
  const days = [...Array(7)].map((_, i) => t - 6 + i), mx = Math.max(g, ...days.map(actMin)), wd = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
  const mf = typeof mapFocus === 'function' && (Object.keys(S.cards || {}).length || Object.values(S.k || {}).some(k => Object.keys(k.cards || {}).length)) ? mapFocus() : null;
  const mapSk = mf && (mf.act.find(w => TODAY_SK.includes(w.id)) || mf.queue.find(w => TODAY_SK.includes(w.id)));
  const lowSk = mapSk ? [mapSk.id] : TODAY_SK.filter(id => KIT[id] && KIT[id].items && KIT[id].lvs.includes(kLv(KIT[id]))).map(id => [id, ovStat(id, kLv(KIT[id]))]).filter(([, s]) => s).sort((a, b) => a[1].lq - b[1].lq)[0];
  const step = (ok, lab, attr) => `<button class="${ok ? '' : 'pri'}" ${attr} style="margin:4px 0;${ok ? 'opacity:.7' : ''}">${ok ? '✅' : '⬜'} ${lab}</button>`;
  return `<div class="box" id="today"><div class="row"><b>📅 Hôm nay</b><span>${st ? `🔥 ${st} ngày liền` : '<span class="mute">chưa có chuỗi ngày</span>'}</span></div>
    <div class="row" style="margin-top:6px"><span style="font-size:22px;font-weight:800">${m}<span class="mute" style="font-size:15px;font-weight:400"> / ${g} phút</span></span>
      <select data-goal aria-label="Mục tiêu phút mỗi ngày" style="width:auto;margin:0;padding:6px 10px">${[10, 15, 30, 45].map(x => `<option value="${x}"${x === g ? ' selected' : ''}>🎯 ${x} phút / ngày</option>`).join('')}</select></div>${bar(Math.round(Math.min(1, m / g) * 100), 100, 'var(--good)')}
    <div style="display:grid;grid-template-columns:repeat(7,1fr);gap:4px;align-items:end;height:46px;margin:8px 0 2px">${days.map(d => { const v = actMin(d); return `<div title="${v} phút" style="height:${Math.max(3, Math.round(v / mx * 40))}px;border-radius:3px;background:${v >= ACT_DAY_MIN ? 'var(--good)' : 'var(--line)'}"></div>`; }).join('')}</div>
    <div style="display:grid;grid-template-columns:repeat(7,1fr);gap:4px;font-size:11px;text-align:center" class="mute">${days.map(d => `<span>${d === t ? 'Nay' : wd[new Date(d * DAY + 12 * 3600000).getUTCDay()]}</span>`).join('')}</div>
    <p style="margin:10px 0 2px"><b>Việc hôm nay</b> <span class="mute">(~${g} phút)</span></p>
    ${(() => { const R = typeof revCount === 'function' ? revCount() : { n: due || 0, c: due, e: 0, v: 0 }, what = [R.e ? `${R.e} lỗi` : '', R.v ? `${R.v} từ sổ từ` : '', R.c ? `${R.c} bài` : ''].filter(Boolean).join(' · ');   // v95: MỘT nút ôn chung (dieuhuong.js revRun)
      if (!R.n && !Object.keys(S.cards || {}).length && !Object.values(S.k || {}).some(k => Object.keys(k.cards || {}).length)) return '';
      return step(!R.n && due != null, R.n ? `Ôn ${R.n} mục đến hạn (${what}): làm trước, chống quên` : due == null ? 'Ôn bài đến hạn' : 'Không còn mục đến hạn', R.n && typeof revRun === 'function' ? 'data-rev' : 'data-today="due"'); })()}
    ${mf ? (f => { const d = dayOf(Date.now()), did = f.act.some(w => w.td === d);
      return (f.act.length ? step(did, did ? 'Đã chữa chỗ yếu hôm nay' : `Chữa ${Math.min(MAP_TODAY, f.act.length)} chỗ yếu đang chữa (kèm việc ôn)`, 'data-today="fix"') : '')
        + (f.root.length ? `<button data-map-rl="${esc(mapKey(f.root[0]))}" style="margin:4px 0">🧱 Học lại bài gốc: ${f.root.length} chỗ kẹt lâu</button>` : '')
        + `<button data-mapv style="margin:4px 0">🗺 Bản đồ chỗ yếu${f.act.length ? `: đang chữa ${f.act.length}${f.queue.length ? ` · ${f.queue.length} chờ` : ''}` : ''} ›</button>`; })(mf) : ''}
    ${step(nw > 0, nw ? `Đã học ${nw} mục mới hôm nay` : `Học 1 bài mới ở cấp ${LVN[stage]}${o.low ? `: ${OV.find(x => x[0] === o.low[0])[1]} ${OV.find(x => x[0] === o.low[0])[2]}` : ''}`, o.low && !nw ? `data-ovp="${o.low[0]}" data-ovpl="${o.low[1]}"` : 'data-today="new"')}
    ${step(sk, sk ? 'Đã luyện kỹ năng hôm nay' : `Luyện 1 bài kỹ năng${lowSk ? `: ${OV.find(x => x[0] === lowSk[0])[1]} ${OV.find(x => x[0] === lowSk[0])[2]}${mapSk ? ' (chỗ yếu)' : ''}` : ''}`, `data-today="skill"${lowSk ? ` data-tsk="${lowSk[0]}"` : ''}`)}
    ${typeof relearnUnits === 'function' ? relearnUnits().slice(0, 2).map(([u, ws]) => `<button data-relearn="${u.id}" style="margin:4px 0">🔁 Học lại ${esc(uLabel(u))}: ${ws.length} từ hay quên</button>`).join('') : ''}
    ${!Object.keys(S.cards || {}).length && !S.place ? '<button data-place style="margin-top:6px">🧭 Mới bắt đầu? Kiểm tra xếp cấp (5–10 phút) để biết nên học từ cấp nào</button>' : ''}
    <p class="mute" style="margin:6px 0 0">Phút tính khi làm bài. Ngày ≥ ${ACT_DAY_MIN} phút vào chuỗi. Học đều mỗi ngày nhớ lâu hơn học dồn.</p></div>`; }
document.addEventListener('change', e => { const g = S && e.target.closest && e.target.closest('select[data-goal]'); if (g && +g.value) { S.goal = +g.value; S.t = Date.now(); save(); overview(); } });
document.addEventListener('click', e => { if (!S) return;
  const b = e.target.closest('[data-today]'); if (!b) return; const k = b.dataset.today; scrollTo(0, 0);
  if (k === 'due' || k === 'new') { const nb = document.querySelector('#app [data-ovp].pri'); if (nb && k === 'due') return nb.click(); return k === 'new' ? (HOME.lv = curLevel(), HOME.open = null, home()) : overview(); }
  if (k === 'fix') return mapToday();
  if (k === 'skill') { const id = b.dataset.tsk || 'nghe'; KIT[id].view = kLv(KIT[id]); return kView(id); } });

// ---------- ③ 🧭 kiểm tra xếp cấp: bậc thang, mỗi cấp 5 câu (3 nghĩa từ + 2 ngữ pháp) ----------
// Đúng ≥ 4/5 → lên cấp; ≤ 2/5 → dừng; 3/5 → thêm 1 vòng ở cấp đó. Kết quả = cấp cao nhất đúng ≥ 4/5. Chỉ đo hiểu từ và ngữ pháp (thụ động), không đo nghe nói.
const PL_LV = ['pre', 'a1', 'a2', 'b1', 'b2', 'c1'];
function plQs(lv) { const ws = shuf(WORDS.filter(w => wLv(w) === lv && w.vi)).slice(0, 12), out = [];
  for (const w of ws) { if (out.length >= 3) break; const q = question(w, 'w2vi'); if (q && q.opts && q.opts.includes(q.a)) out.push({ w, q }); }
  const P = KIT.np, gl = P.lvs.includes(lv) ? lv : P.lvs.filter(l => LEVELS.indexOf(l) <= LEVELS.indexOf(lv)).pop(), gi = shuf(P.items.filter(x => x.lv === gl));
  for (const x of gi) { if (out.length >= 5) break; const q = (P.q(x, 'nhan', 'test') || [])[0]; if (q && q.opts && q.opts.includes(q.a)) out.push({ g: x, q }); }
  return out; }
// bậc thang: cấp vừa làm (lv) đúng ≥ 80% → lên; ≤ 40% → xuống (nếu chưa làm); ở giữa → thêm 1 vòng ở cấp đó (tối đa 10 câu); không còn bước → dừng (null)
function plNext(R, lv) { const [a, n] = R[lv], p = a / n, i = PL_LV.indexOf(lv), up = PL_LV[i + 1], dn = PL_LV[i - 1];
  if (p >= 0.8) return up && !R[up] ? up : null;
  if (p <= 0.4) return dn && !R[dn] ? dn : null;
  return n < 10 ? lv : null; }
const plResult = R => PL_LV.filter(l => R[l] && R[l][0] / R[l][1] >= 0.8).pop() || null;
async function placeView() { $app.innerHTML = '<p class="mute">Đang tải…</p>'; await Promise.all([loadEB(), kLoad(KIT.np)]); window.CUR = { view: 'xep-cap' };
  const R = {}, res = []; let lv = 'a2', qs = plQs(lv), i = 0;
  const show = () => { if (i >= qs.length) { R[lv] = R[lv] || [0, 0]; const nx = R[lv][1] ? plNext(R, lv) : null; if (!nx) return end(); lv = nx; qs = plQs(lv); i = 0; if (!qs.length) return end(); }
    const it = qs[i], q = it.q;
    $app.innerHTML = `<div class="row top"><button class="link" data-a="back">← Thôi</button><span class="uname">🧭 Xếp cấp · câu ${res.length + 1}</span></div>
      <p class="mute">Không đoán bừa: không biết thì chọn "Chưa biết". Làm 15–30 câu, khoảng 5–10 phút.</p>${it.w ? `<p class="q">${q.top}</p><p class="mute">${q.sub}</p>` : `${q.head || ''}<p class="q">${q.q}</p>`}
      ${q.opts.map((o, k) => `<button class="opt" data-po="${k}">${esc(o)}</button>`).join('')}<button class="opt" data-po="-1" style="opacity:.75">🤷 Chưa biết</button>`;
    $app.onclick = e => { if (e.target.closest('[data-a="back"]')) return overview(); const b = e.target.closest('[data-po]'); if (!b) return; const k = +b.dataset.po, ok = k >= 0 && q.opts[k] === q.a;
      const r = R[lv] = R[lv] || [0, 0]; r[1]++; if (ok) r[0]++; res.push({ lv, ok }); i++; show(); }; };
  const end = () => { const top = plResult(R), start = top ? (LEVELS[LEVELS.indexOf(top) + 1] || top) : 'pre'; S.place = { at: Date.now(), top, start, R }; S.t = Date.now(); save();
    $app.innerHTML = `<h1>🧭 Kết quả xếp cấp</h1><div class="box"><p style="margin:0;font-size:19px">${top ? `Bạn nắm khá vững <b>${LVN[top]}</b>.` : 'Nên bắt đầu từ đầu.'} Nên bắt đầu học ở <b>${LVN[start]}</b>.</p>
      <p class="mute" style="margin:6px 0 0">${PL_LV.filter(l => R[l]).map(l => `${LVN[l]}: ${R[l][0]}/${R[l][1]}`).join(' · ')}</p>
      <p class="mute" style="margin:6px 0 0">Bài này chỉ đo hiểu nghĩa từ và ngữ pháp, không đo nghe, nói, viết; là gợi ý, không phải thi chuyển cấp. Các cấp dưới vẫn còn đó để ôn khi cần.</p></div>
      ${top ? `<div class="box"><b>Muốn bỏ qua các cấp dưới ${LVN[start]}?</b><p class="mute" style="margin:6px 0">🚀 Thi vượt cấp: làm thẳng Thi chuyển cấp ${LVN[top]} của từng phần (đề như thi thường). Qua phần nào thì phần đó đạt mọi cấp ≤ ${LVN[top]}.</p><button class="pri" data-vcv="${top}">🚀 Thi vượt lên ${LVN[top]}</button></div>` : ''}
      <button class="pri" data-a="go">▶ Mở cấp ${LVN[start]}</button><button data-a="back">← Tổng quan</button>`; scrollTo(0, 0);
    $app.onclick = e => { if (e.target.closest('[data-a="go"]')) return overview(start); if (e.target.closest('[data-a="back"]')) overview(); }; };
  if (!qs.length) return end(); show(); }
document.addEventListener('click', e => { if (e.target.closest('[data-place]') && S) { scrollTo(0, 0); placeView(); } });
