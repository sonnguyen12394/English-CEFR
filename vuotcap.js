// 🚀 Thi vượt cấp (v75, 28/10/2026, người sáng lập: "làm thêm cái thi vượt cấp đi" — đồng ý đổi luật đo sau bài 🧭 Kiểm tra xếp cấp).
// Luật: được làm Thi chuyển cấp của một phần ở cấp cao hơn mà KHÔNG cần cổng thường (📘 Học 100%, 🔁 Nhớ ≥ 80%, đã qua cấp trước).
//   Đề = đúng đề Thi chuyển cấp hiện có của phần đó (cùng số câu, ngưỡng đạt, ~30% câu cấp trước) — không có đề riêng dễ hơn.
//   Qua → phần đó đạt mọi cấp ≤ cấp thi: ghi lần thi đạt (vc: true) cho các cấp dưới (kể cả "đạt bền" của cấp dưới để không khoá cấp sau);
//         bài / từ chưa học của các cấp ≤ cấp thi được đánh dấu đã học + đã nhớ, hạn ôn rải 30–150 ngày (không dồn một ngày) để vẫn quay lại ôn dần.
//   Trượt → không đổi gì; mỗi phần mỗi cấp thi vượt tối đa 1 lần / 7 ngày (chống đoán mò). Cấp vừa thi vượt: "đạt bền" (thi lại sau 14 ngày) vẫn theo luật cũ.
// Nói cần máy chép lời (Safari), Phát âm cần bộ chấm âm: thiếu thì nút báo rõ, không giả là đã thi.
const VC_WAIT = 7, VC_S = [30, 150];
const vcSt = () => (S.vc = S.vc || { pend: [], log: [] });
const vcLvs = id => id === 'tv' ? LEVELS : id === 'pa' ? PA_LV : KIT[id].lvs;
const vcRuns = id => id === 'tv' ? xs().runs : id === 'pa' ? paRuns() : kSt(id).runs;
// cấp thi của một phần khi muốn vượt lên lv: cấp cao nhất của phần ≤ lv (phần không có cấp "+" thì lấy cấp gốc)
const vcLvOf = (id, lv) => vcLvs(id).filter(l => LEVELS.indexOf(l) <= LEVELS.indexOf(lv)).pop() || null;
const vcLast = (id, lv) => vcSt().log.filter(x => x.id === id && x.lv === lv).slice(-1)[0];
const vcWait = (id, lv) => { const l = vcLast(id, lv); return l && !l.pass ? Math.max(0, VC_WAIT - (dayOf(Date.now()) - dayOf(l.at))) : 0; };
// lý do chưa thi được (thiếu thiết bị / bộ chấm), '' nếu thi được
const vcBlock = id => id === 'noi' && !SREC ? 'cần mở bằng Safari trên iPhone (máy chép lời)' : id === 'pa' && !(typeof NO !== 'undefined' && NO.vocab) ? 'cần tải bộ chấm âm ở 👄 Phát âm trước' : '';
// thẻ "đã học + đã nhớ" như 🎚 Đặt tiến độ (bkCard) nhưng hạn ôn rải 30–150 ngày
function vcCard(ks, now) { const c = { S: VC_S[0] + Math.floor(Math.random() * (VC_S[1] - VC_S[0] + 1)), last: now, d0: dayOf(now) - 1, ok: 1, pv: 1, n: 1, lapse: 0, dm: {}, vc: 1 };
  for (const k of ks) c.dm[k] = { ok: 1, pv: 1, n: 1 }; return c; }
function vcApply(id, lv, now = Date.now()) { const ls = vcLvs(id).filter(l => LEVELS.indexOf(l) <= LEVELS.indexOf(lv)), runs = vcRuns(id); let seeded = 0;
  for (const l of ls) {
    if (l !== lv && !runs.some(r => (r.lv || 'a1') === l && r.pass)) runs.push({ lv: l, at: now, n: 0, ok: 0, pass: true, vc: true });
    if (l !== lv && id === 'tv' && !runs.some(r => (r.lv || 'a1') === l && r.pass && r.re)) runs.push({ lv: l, at: now, n: 0, ok: 0, pass: true, re: true, vc: true });
    if (id === 'tv') { for (const u of UNITS.filter(u => u.lv === l)) if (!S.units[u.id]) S.units[u.id] = { d: dayOf(now) - 1, vc: 1 };
      for (const w of levelWords(l)) if (!S.cards[w.id]) { const c = S.cards[w.id] = vcCard(DIMS.map(d => d[0]), now); seeded++;
        for (const L of ['a1', 'a2', 'b1', 'b2', 'c1', 'c2']) if (lvIdx(L) > lvIdx(l) && lvIdx(L) <= lvIdx(lv)) (c.du = c.du || {})[L] = c.d0; } }
    else if (id === 'pa') { for (const x of PA.filter(x => x.lv === l)) if (!paSt()[x.id]) { paSt()[x.id] = vcCard(PA_DIMS.map(d => d[0]), now); seeded++; } }
    else { const P = KIT[id], st = kSt(id).cards; for (const x of kItems(P, l)) if (!st[x.id]) { st[x.id] = vcCard(kDimsOf(P, x), now); seeded++; } } }
  return seeded; }
// gọi trong save(): lần thi vượt đang chờ có kết quả (lần thi mới của đúng phần, đúng cấp) → ghi nhật ký, qua thì áp dụng; chờ > 1 ngày không thi thì bỏ
function vcCheck(now = Date.now()) { if (!S || !S.vc || !S.vc.pend.length) return; const V = S.vc;
  V.pend = V.pend.filter(p => { if (p.id === 'pa' ? !PA : p.id !== 'tv' && !KIT[p.id].items) return true;   // chưa tải dữ liệu: để lần sau
    const r = vcRuns(p.id).slice(p.n).filter(r => (r.lv || 'a1') === p.lv && r.at >= p.at && !r.vc);
    if (!r.length) return now - p.at < DAY; const pass = r.some(x => x.pass);
    V.log.push({ id: p.id, lv: p.lv, at: now, pass, ...(pass ? { seeded: vcApply(p.id, p.lv, now) } : {}) }); return false; }); }
function vcStart(id, lv) { if (vcBlock(id)) return toast('Chưa thi được: ' + vcBlock(id)); const w = vcWait(id, lv); if (w) return toast(`Thi vượt lại sau ${w} ngày.`);
  vcSt().pend = vcSt().pend.filter(p => !(p.id === id && p.lv === lv)); vcSt().pend.push({ id, lv, at: Date.now(), n: vcRuns(id).length }); S.t = Date.now(); save();
  if (id === 'tv') return exam(lv); if (id === 'pa') return paExam(lv); return kExam(KIT[id], lv); }
async function vcView(lv) { window.CUR = { view: 'thi-vuot', item: lv }; $app.innerHTML = '<p class="mute">Đang tải…</p>'; await Promise.all([paLoad(), ...Object.values(KIT).map(kLoad)]);
  const rows = OV.map(([id, ic, t]) => { const L = vcLvOf(id, lv); if (!L) return ''; const done = ovPassed(id, L), w = vcWait(id, L), bl = vcBlock(id), last = vcLast(id, L);
    return `<div class="box"><div class="row"><b>${ic} ${t} · ${LVN[L]}</b><span class="${done ? 'okc' : 'mute'}">${done ? '✅ đã đạt' : last ? (last.pass ? '✅ qua' : '❌ lần trước chưa qua') : ''}</span></div>
      ${done ? '' : bl ? `<p class="mute" style="margin:6px 0 0">Chưa thi được: ${bl}.</p>` : w ? `<p class="mute" style="margin:6px 0 0">Thi vượt lại sau ${w} ngày (chống đoán mò). Trong lúc chờ: học bài ${LVN[L]} như thường.</p>`
        : `<button class="pri" data-vc="${id}|${L}" style="margin-top:6px">🚀 Thi ${t} ${LVN[L]}</button>`}</div>`; }).join('');
  $app.innerHTML = `${backRow('🚀 Thi vượt cấp')}<h1>🚀 Thi vượt lên ${LVN[lv]}</h1>
    <div class="box"><p style="margin:0">Thi thẳng Thi chuyển cấp ${LVN[lv]} của từng phần, không cần học hết các cấp dưới. <b>Đề như thi thường</b> (có ~30% câu cấp trước), cần đạt như thi thường.</p>
      <p class="mute" style="margin:6px 0 0">Qua phần nào → phần đó đạt mọi cấp ≤ ${LVN[lv]}; bài chưa học của các cấp đó được tính đã học, sẽ quay lại ôn dần trong 1–5 tháng. Trượt → không đổi gì, thi vượt lại sau ${VC_WAIT} ngày. Mỗi phần thi riêng; phần nào chưa vượt thì học như thường.</p></div>
    ${rows}<p class="mute">Gợi ý: làm 🧭 Kiểm tra xếp cấp trước để chọn cấp vượt hợp lý. Vượt quá sức sẽ trượt và phải chờ ${VC_WAIT} ngày.</p>`;
  $app.onclick = e => { if (e.target.closest('[data-a="home"]')) return overview(lv); const b = e.target.closest('[data-vc]'); if (!b) return; const [id, L] = b.dataset.vc.split('|'); scrollTo(0, 0); vcStart(id, L); }; }
document.addEventListener('click', e => { const b = e.target.closest('[data-vcv]'); if (b && S) { scrollTo(0, 0); vcView(b.dataset.vcv); } });
