// 📅 Hôm nay + 🧭 Kiểm tra xếp cấp (v74, 28/10/2026, người sáng lập: "phân tích điểm mạnh yếu … làm cho phần học CEFR trở nên giá trị").
// Dữ liệu thật (Supabase, 28/10): app được mở nhiều lần mỗi ngày nhưng không ghi tiến độ lần nào (0 câu trả lời); tài khoản học có 0 từ. Vấn đề chính không phải thiếu
// tính năng mà là chưa học đều. Tệp này thêm: ① đo phút học mỗi ngày (S.act, tính từ nhịp save()), mục tiêu phút, chuỗi ngày, 7 ngày gần nhất;
// ② ô Hôm nay ở đầu Tổng quan: 3 việc rõ ràng (ôn bài đến hạn → học bài mới → luyện 1 kỹ năng); ③ kiểm tra xếp cấp (chỉ gợi ý cấp bắt đầu, KHÔNG đổi luật đo:
// muốn bỏ qua cấp dưới vẫn dùng 🎚 Đặt tiến độ ở 💾 Sao lưu hoặc thi chuyển cấp như cũ). Không tính vào 📘 Học / 🔁 Nhớ / Thi chuyển cấp.

// ---------- ① phút học: mỗi lần save() (mỗi câu trả lời, mỗi bài) cộng khoảng cách tới lần trước nếu < 3 phút, không thì 15 giây ----------
const ACT_GAP = 180000, ACT_BASE = 15000, ACT_DAY_MIN = 5;
// v99: dùng kết quả 🧭 xếp cấp. Xếp cao hơn cấp đang học (và chưa chọn "học từ đầu") → gợi ý 🚀 thi vượt các phần bắt buộc chưa thử ở cấp đó.
const plTop = (stage = ovStage()) => { const P = S && S.place; return P && P.top && !P.no && LEVELS.indexOf(P.top) > LEVELS.indexOf(stage) ? P.top : null; };
const plLeft = lv => typeof vcLvOf !== 'function' ? [] : ovReq(lv).filter(([id]) => { const L = vcLvOf(id, lv); return L && !ovPassed(id, L) && !vcLast(id, L) && !vcBlock(id); });   // ngày có ≥ 5 phút mới tính vào chuỗi
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
// v107 (người sáng lập "làm hết đi" sau khi Claude rà lại: 4 chỗ cùng bảo "hôm nay làm gì"): ô Hôm nay là danh sách việc DUY NHẤT (todayPlan).
//   🔄 Lộ trình chỉ giữ mục tiêu, đợt, tổng kết và lối tắt về đây; nút ▶ Chữa tiếp của bản đồ và "Nên làm hôm nay" của IELTS / TOEIC là cùng việc, không phải danh sách khác.
//   Luật của Lộ trình áp ở đây cho mọi người: chữa lỗi tối đa LT_FIX số phút mục tiêu (đủ thì nhắc chuyển sang bài mới); ngày 10 của đợt có 📝 kiểm tra cuối đợt.
//   Đang ôn IELTS / TOEIC thì thêm 1 việc luyện thi (nhãn lấy từ ieToday / toToday). Trả về [{ done (true / false; null = nút phụ, không đếm), html }].
const TODAY_EXAM = () => S.exSel === 'toeic' && S.to ? 'toeic' : S.ie && S.ie.set && S.exSel !== 'cefr' && S.exSel !== 'toeic' ? 'ielts' : null;   // chưa đặt mục tiêu (cũ)
// v108: có 🎯 mục tiêu thì việc luyện đề và tỉ lệ nền / đề theo ltSplit (lotrinh.js): nền thiếu ≥ 2 cấp → chưa luyện đề (chỉ một dòng xem dạng đề);
//   nền chiếm ≤ 30 % → bỏ "luyện 1 bài kỹ năng" nền (luyện đề đã luyện kỹ năng); nền đủ (10 %) → bỏ cả "bài mới" nền, giữ ôn + chữa. Việc luyện đề xong khi đủ số phút đề.
function todayPlan(stage = ovStage(), o = {}) { const now = Date.now(), t = dayOf(now), due = todayDue(), nw = todayNew(), sk = todaySkill(), out = [];
  const sp = S.lt && S.lt.goal && typeof ltSplit === 'function' ? ltSplit() : null, exK = sp ? (sp.k === 'cefr' ? null : sp.k) : TODAY_EXAM();
  const has = Object.keys(S.cards || {}).length || Object.values(S.k || {}).some(k => Object.keys(k.cards || {}).length);
  const mf = typeof mapFocus === 'function' && has ? mapFocus() : null;
  const mapSk = mf && (mf.act.find(w => TODAY_SK.includes(w.id)) || mf.queue.find(w => TODAY_SK.includes(w.id)));
  const lowSk = mapSk ? [mapSk.id] : TODAY_SK.filter(id => KIT[id] && KIT[id].items && KIT[id].lvs.includes(kLv(KIT[id]))).map(id => [id, ovStat(id, kLv(KIT[id]))]).filter(([, s]) => s).sort((a, b) => a[1].lq - b[1].lq)[0];
  const low = o.low || (() => { const r = OV.filter(([id]) => ovIn(id, stage) && !ovPassed(id, stage)).map(x => [x, ovStat(x[0], stage)]).filter(([, s]) => s && s.lq < 100).sort((a, b) => a[1].lq - b[1].lq)[0]; return r ? [r[0][0], stage] : null; })();
  const step = (done, lab, attr, sub) => out.push({ done, html: `<button class="${done ? '' : 'pri'}" ${attr} style="margin:4px 0;${done ? 'opacity:.7' : ''}">${done ? '✅' : '⬜'} ${lab}${sub ? `<small style="display:block;font-weight:400;opacity:.85">${sub}</small>` : ''}</button>` });
  const extra = html => out.push({ done: null, html });
  // ① ôn: MỘT nút ôn chung (dieuhuong.js revRun: sổ lỗi → sổ từ → bài đến hạn)
  { const R = typeof revCount === 'function' ? revCount() : { n: due || 0, c: due, e: 0, v: 0 }, what = [R.e ? `${R.e} lỗi` : '', R.v ? `${R.v} từ sổ từ` : '', R.c ? `${R.c} bài` : ''].filter(Boolean).join(' · ');
    if (R.n || has) step(!R.n && due != null, R.n ? `Ôn ${R.n} mục đến hạn (${what}): làm trước, chống quên` : due == null ? 'Ôn bài đến hạn' : 'Không còn mục đến hạn', R.n && typeof revRun === 'function' ? 'data-rev' : 'data-today="due"'); }
  // 📝 ngày 10 của đợt (🔄 Lộ trình)
  { const c = S.lt && S.lt.goal && typeof ltCur === 'function' ? ltCur() : null; if (c && ltDay(c, now) >= LT_D) step(false, `📝 Kiểm tra cuối đợt ${c.n} (~10 phút) → tổng kết`, 'data-lt="chk"'); }
  // ② chữa: 🧭 chỗ hổng nền trước, rồi nhóm đang chữa; tối đa LT_FIX số phút mục tiêu
  { const gn = typeof plGaps === 'function' ? plGaps(now).filter(g => !g.cho).length : 0, act = mf ? mf.act.length : 0, did = mf && mf.act.some(w => w.td === t);
    const fx = typeof ltFixMin === 'function' ? ltFixMin(t) : 0, cap = typeof ltCap === 'function' ? ltCap() : 0, full = cap && fx >= cap, pct = typeof LT_FIX !== 'undefined' ? Math.round(LT_FIX * 100) : 40;
    if (gn || act) step(full || (did && !gn), full ? `Đủ phần chữa lỗi hôm nay (${fx}/${cap} phút): chuyển sang bài mới` : gn ? `Chữa ${gn} chỗ hổng nền (bài xếp cấp phát hiện)` : did ? 'Đã chữa chỗ yếu hôm nay' : `Chữa ${Math.min(MAP_TODAY, act)} chỗ yếu đang chữa (kèm việc ôn)`, 'data-today="fix"', cap ? `🩹 ${fx}/${cap} phút · tối đa ${pct}% thời gian, để còn học cái mới` : '');
    if (mf && mf.root.length) extra(`<button data-map-rl="${esc(mapKey(mf.root[0]))}" style="margin:4px 0">🧱 Học lại bài gốc: ${mf.root.length} chỗ kẹt lâu</button>`);
    if (mf) extra(`<button data-mapv${o.lt ? '="lt"' : ''} style="margin:4px 0">🗺 Bản đồ chỗ yếu${act ? `: đang chữa ${act}${mf.queue.length ? ` · ${mf.queue.length} chờ` : ''}` : ''} ›</button>`); }
  // ③ bài mới (v99: xếp cấp cao hơn → thi vượt thay cho bài mới cấp thấp)
  { const pl = plTop(stage), left = pl && !nw ? plLeft(pl) : [];
    if (left.length) { step(false, `🚀 Bạn xếp cấp ${LVN[pl]}: thi vượt ${left.length} phần (${left.map(x => x[1]).join(' ')}) để khỏi học lại cấp dưới`, `data-vcv="${pl}"`); extra(`<button class="link" data-plno style="margin:0 0 4px">Không, tôi muốn học từ ${LVN[stage]}</button>`); }
    else if (!sp || sp.nen > 10) step(nw > 0, nw ? `Đã học ${nw} mục mới hôm nay` : `Học 1 bài mới ở cấp ${LVN[stage]}${low ? `: ${OV.find(x => x[0] === low[0])[1]} ${OV.find(x => x[0] === low[0])[2]}` : ''}`, low && !nw ? `data-today="part" data-tp="${low[0]}" data-tpl="${low[1]}"` : 'data-today="new"'); }
  // ④ kỹ năng
  if (!sp || sp.nen >= 70) step(sk, sk ? 'Đã luyện kỹ năng hôm nay' : `Luyện 1 bài kỹ năng${lowSk ? `: ${OV.find(x => x[0] === lowSk[0])[1]} ${OV.find(x => x[0] === lowSk[0])[2]}${mapSk ? ' (chỗ yếu)' : ''}` : ''}`, `data-today="skill"${lowSk ? ` data-tsk="${lowSk[0]}"` : ''}`);
  // ⑤ luyện đề của mục tiêu (chi tiết ở màn kỳ thi): đủ số phút đề (ltSplit) là xong; chưa có mục tiêu thì như v107 (có luyện hôm nay là xong)
  if (exK) { const nm = { ielts: 'IELTS', toeic: 'TOEIC', cambridge: 'Cambridge' }[exK];
    if (sp && !sp.ex) extra(`<p class="mute" style="margin:6px 0 2px">🎓 Chưa luyện đề ${nm}: nền cần ${LVN[sp.need]}, học nền trước. <button class="link" data-today="exam">Xem dạng đề ›</button></p>`);
    else { let lab = ''; if (exK !== 'cambridge') try { lab = String((exK === 'ielts' ? ieToday() : toToday())[1] || '').replace(/<[^>]+>/g, ''); } catch (e) {}
      const o2 = exK === 'ielts' ? S.ie || {} : exK === 'toeic' ? S.to || {} : {}, at = r => r && r.at && dayOf(r.at) === t, exM = sp ? sp.exM : 0, done = sp ? ltExMin(t) >= exM : Object.values(o2.r || {}).some(at) || ['w', 's', 'mock', 'spd'].some(k => (o2[k] || []).some(at));
      step(done, done ? `Đã luyện ${nm} đủ hôm nay` : `🎓 Luyện ${nm}${sp ? ` ~${exM} phút` : ''}${lab ? ': ' + lab : exK === 'cambridge' ? ': đề thử, dạng đề thật' : ''}`, 'data-today="exam"', sp ? `⚖️ ${sp.ex}% thời gian cho đề · đã luyện ${ltExMin(t)}/${exM} phút` : ''); } }
  if (typeof relearnUnits === 'function') for (const [u, ws] of relearnUnits().slice(0, 2)) extra(`<button data-relearn="${u.id}" style="margin:4px 0">🔁 Học lại ${esc(uLabel(u))}: ${ws.length} từ hay quên</button>`);
  if (!Object.keys(S.cards || {}).length && !S.place) extra('<button data-place style="margin-top:6px">🧭 Mới bắt đầu? Kiểm tra xếp cấp (5–10 phút) để biết nên học từ cấp nào</button>');
  return out; }
function todayBox(stage, o = {}) { const t = dayOf(Date.now()), m = actMin(t), g = actGoal(), st = actStreak();
  const days = [...Array(7)].map((_, i) => t - 6 + i), mx = Math.max(g, ...days.map(actMin)), wd = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
  const c = !o.lt && S.lt && S.lt.goal && typeof ltCur === 'function' ? ltCur() : null;   // ở 🔄 Lộ trình (o.lt) đã có ô đợt riêng
  return `<div class="box" id="today"><div class="row"><b>📅 Hôm nay</b><span>${st ? `🔥 ${st} ngày liền` : '<span class="mute">chưa có chuỗi ngày</span>'}</span></div>
    ${c ? `<button class="link" data-ltgo style="margin:2px 0">🔄 Đợt ${c.n} · ngày ${Math.min(ltDay(c), LT_D)}/${LT_D} · mục tiêu ${esc(ltGoalName(S.lt.goal))} ›</button>` : ''}
    <div class="row" style="margin-top:6px"><span style="font-size:22px;font-weight:800">${m}<span class="mute" style="font-size:15px;font-weight:400"> / ${g} phút</span></span>
      <select data-goal aria-label="Mục tiêu phút mỗi ngày" style="width:auto;margin:0;padding:6px 10px">${[10, 15, 30, 45].map(x => `<option value="${x}"${x === g ? ' selected' : ''}>🎯 ${x} phút / ngày</option>`).join('')}</select></div>${bar(Math.round(Math.min(1, m / g) * 100), 100, 'var(--good)')}
    <div style="display:grid;grid-template-columns:repeat(7,1fr);gap:4px;align-items:end;height:46px;margin:8px 0 2px">${days.map(d => { const v = actMin(d); return `<div title="${v} phút" style="height:${Math.max(3, Math.round(v / mx * 40))}px;border-radius:3px;background:${v >= ACT_DAY_MIN ? 'var(--good)' : 'var(--line)'}"></div>`; }).join('')}</div>
    <div style="display:grid;grid-template-columns:repeat(7,1fr);gap:4px;font-size:11px;text-align:center" class="mute">${days.map(d => `<span>${d === t ? 'Nay' : wd[new Date(d * DAY + 12 * 3600000).getUTCDay()]}</span>`).join('')}</div>
    <p style="margin:10px 0 2px"><b>Việc hôm nay</b> <span class="mute">(~${g} phút)</span></p>
    ${todayPlan(stage, o).map(x => x.html).join('')}
    <p class="mute" style="margin:6px 0 0">Phút tính khi làm bài. Ngày ≥ ${ACT_DAY_MIN} phút vào chuỗi. Học đều mỗi ngày nhớ lâu hơn học dồn.</p></div>`; }
document.addEventListener('change', e => { const g = S && e.target.closest && e.target.closest('select[data-goal]'); if (g && +g.value) { S.goal = +g.value; S.t = Date.now(); save(); overview(); } });
document.addEventListener('click', e => { if (!S) return;
  if (e.target.closest('[data-plno]') && S.place) { S.place.no = 1; S.t = Date.now(); save(); scrollTo(0, 0); return overview(); }
  const b = e.target.closest('[data-today]'); if (!b) return; const k = b.dataset.today; scrollTo(0, 0);
  if (k === 'due' || k === 'new') { const nb = document.querySelector('#app [data-ovp].pri'); if (nb && k === 'due') return nb.click(); return k === 'new' ? (HOME.lv = curLevel(), HOME.open = null, home()) : overview(); }
  if (k === 'fix') { if (typeof MAP_BACK !== 'undefined') MAP_BACK = document.getElementById('lt') ? 'lt' : 'hoc'; return mapToday(); }
  if (k === 'part') return ovOpenPart(b.dataset.tp, b.dataset.tpl);
  if (k === 'skill') { const id = b.dataset.tsk || 'nghe'; KIT[id].view = kLv(KIT[id]); return kView(id); }
  if (k === 'exam') return exOpen(); });

// ---------- ③ 🧭 kiểm tra xếp cấp: bậc thang, mỗi cấp 5 câu (3 nghĩa từ + 2 ngữ pháp) ----------
// Đúng ≥ 4/5 → lên cấp; ≤ 2/5 → dừng; 3/5 → thêm 1 vòng ở cấp đó. Kết quả = cấp cao nhất đúng ≥ 4/5. Chỉ đo hiểu từ và ngữ pháp (thụ động), không đo nghe nói.
const PL_LV = ['pre', 'a1', 'a2', 'b1', 'b2', 'c1'];
// v99 (nhật ký trải nghiệm vai giáo viên: "plummet" có nhiễu "ban phước", "đi dạo ung dung": loại trừ là đúng, không cần biết từ):
// phương án nhiễu lấy từ cùng bài (cùng chủ đề) rồi cùng cấp, cùng loại từ; bỏ từ đồng / trái nghĩa và nghĩa trùng 2 tiếng liền nhau với đáp án
const plBi = s => { const t = String(s).toLowerCase().split(/[^\p{L}]+/u).filter(Boolean); return new Set(t.slice(1).map((x, i) => t[i] + ' ' + x)); };
function plDis(w, n = 3) { const rel = new Set([...(w.rel ? [...w.rel.syn, ...w.rel.ant] : [])].map(x => x.toLowerCase())), bw = plBi(w.vi), pos = String(w.pos || '').split(',')[0], out = [], seen = new Set([w.vi]);
  const rv = new Set(rel.size ? WORDS.filter(x => rel.has(x.w.toLowerCase())).map(x => x.vi) : []);   // nghĩa của từ đồng / trái nghĩa (từ khác cùng nghĩa cũng loại)
  const ok = x => x.id !== w.id && x.vi && !seen.has(x.vi) && !rv.has(x.vi) && String(x.pos || '').split(',')[0] === pos && !rel.has(x.w.toLowerCase()) && ![...plBi(x.vi)].some(b => bw.has(b));
  const unit = ((UBY[w.u] || {}).words || []), lvw = WORDS.filter(x => wLv(x) === wLv(w));
  for (const x of [...shuf(unit), ...shuf(lvw)]) { if (out.length >= n) break; if (ok(x)) { seen.add(x.vi); out.push(x.vi); } }
  return out; }
function plQs(lv) { const ws = shuf(WORDS.filter(w => wLv(w) === lv && w.vi)).slice(0, 12), out = [];
  for (const w of ws) { if (out.length >= 3) break; const q = question(w, 'w2vi'), d = plDis(w); if (q && d.length === 3) q.opts = shuf([w.vi, ...d]); if (q && q.opts && q.opts.includes(q.a)) out.push({ w, q }); }
  const P = KIT.np, gl = P.lvs.includes(lv) ? lv : P.lvs.filter(l => LEVELS.indexOf(l) <= LEVELS.indexOf(lv)).pop(), gi = shuf(P.items.filter(x => x.lv === gl));
  for (const x of gi) { if (out.length >= 5) break; const q = (P.q(x, 'nhan', 'test') || [])[0]; if (q && q.opts && q.opts.includes(q.a)) out.push({ g: x, q }); }
  return out; }
// bậc thang: cấp vừa làm (lv) đúng ≥ 80% → lên; ≤ 40% → xuống (nếu chưa làm); ở giữa → thêm 1 vòng ở cấp đó (tối đa 10 câu), vẫn ở giữa → xuống (v107); không còn bước → dừng (null)
function plNext(R, lv) { const [a, n] = R[lv], p = a / n, i = PL_LV.indexOf(lv), up = PL_LV[i + 1], dn = PL_LV[i - 1];
  if (p >= 0.8) return up && !R[up] ? up : null;
  if (p <= 0.4) return dn && !R[dn] ? dn : null;
  return n < 10 ? lv : dn && !R[dn] ? dn : null; }   // v107: 10 câu vẫn ở vùng giữa → đo xuống 1 cấp (dữ liệu thật: A2 6/10 rồi dừng → "bắt đầu từ đầu" dù có thể đã nắm A1)
const plResult = R => PL_LV.filter(l => R[l] && R[l][0] / R[l][1] >= 0.8).pop() || null;
async function placeView(back) { const out = typeof back === 'function' ? back : overview; $app.innerHTML = '<p class="mute">Đang tải…</p>'; await Promise.all([loadEB(), kLoad(KIT.np)]); window.CUR = { view: 'xep-cap' };
  const R = {}, res = []; let lv = 'a2', qs = plQs(lv), i = 0;
  const show = () => { if (i >= qs.length) { R[lv] = R[lv] || [0, 0]; const nx = R[lv][1] ? plNext(R, lv) : null; if (!nx) return end(); lv = nx; qs = plQs(lv); i = 0; if (!qs.length) return end(); }
    const it = qs[i], q = it.q;
    $app.innerHTML = `<div class="row top"><button class="link" data-a="back">← Thôi</button><span class="uname">🧭 Xếp cấp · câu ${res.length + 1}</span></div>
      <p class="mute">Không đoán bừa: không biết thì chọn "Chưa biết". Làm 15–30 câu, khoảng 5–10 phút.</p>${it.w ? `<p class="q">${q.top}</p><p class="mute">${q.sub}</p>` : `${q.head || ''}<p class="q">${q.q}</p>`}
      ${q.opts.map((o, k) => `<button class="opt" data-po="${k}">${esc(o)}</button>`).join('')}<button class="opt" data-po="-1" style="opacity:.75">🤷 Chưa biết</button>`;
    $app.onclick = e => { if (e.target.closest('[data-a="back"]')) return out(); const b = e.target.closest('[data-po]'); if (!b) return; const k = +b.dataset.po, ok = k >= 0 && q.opts[k] === q.a;
      const r = R[lv] = R[lv] || [0, 0]; r[1]++; if (ok) r[0]++; res.push({ lv, ok, it }); i++; show(); }; };
  // v106: câu sai ở cấp đã nắm vững (≤ cấp xếp được) chỉ là giả thuyết → 🔎 hỏi thêm 2 câu mỗi chỗ (chandoan.js); sai thật mới vào 🗺 bản đồ (🧭 chỗ hổng nền)
  const end = () => { const top = plResult(R), start = top ? (LEVELS[LEVELS.indexOf(top) + 1] || top) : 'pre', old = ((S.place || {}).gap || []).filter(g => !g.ok);
    S.place = { at: Date.now(), top, start, R, st: ovStage(), gap: old }; S.t = Date.now(); save();
    const cands = top && typeof plConfirm === 'function' ? res.filter(r => !r.ok && LEVELS.indexOf(r.lv) <= LEVELS.indexOf(top)).slice(0, PL_CF_MAX).map(r => ({ ...r.it, lv: r.lv })) : [];
    if (!cands.length) return result(null);
    plConfirm(cands, { gap: true, intro: `Bạn sai ${cands.length} câu ở cấp bạn nắm khá vững. Một câu sai có thể chỉ là bấm nhầm hay đoán. Hỏi thêm ${PL_CF_N} câu mỗi chỗ (~${Math.max(1, Math.round(cands.length * PL_CF_N * 12 / 60))} phút): sai thật mới đưa vào 🗺 bản đồ.` },
      cf => { S.place.cf = cf; S.t = Date.now(); save(); result(cf); }); };
  const result = cf => { const top = S.place.top, start = S.place.start;
    $app.innerHTML = `<h1>🧭 Kết quả xếp cấp</h1><div class="box"><p style="margin:0;font-size:19px">${top ? `Phần hiểu từ và ngữ pháp: bạn nắm khá vững <b>${LVN[top]}</b>${top === PL_LV[PL_LV.length - 1] ? ' (bài đo tới đây là hết)' : ''}. Gợi ý: 🚀 thi vượt các phần lên ${LVN[top]}, rồi học tiếp <b>${LVN[start]}</b>.` : 'Nên bắt đầu từ đầu.'}</p>
      <p class="mute" style="margin:6px 0 0">${PL_LV.filter(l => R[l]).map(l => `${LVN[l]}: ${R[l][0]}/${R[l][1]}`).join(' · ')}</p>
      ${cf && cf.n ? `<p style="margin:6px 0 0">${plCfTxt(cf)}${cf.sure ? ' Đã đưa vào 🗺 bản đồ, nhóm 🌱 Gốc: chữa trước khi học tiếp.' : ''}</p>` : ''}
      <p class="mute" style="margin:6px 0 0">Bài này chỉ đo hiểu nghĩa từ và ngữ pháp, không đo nghe, nói, viết; là gợi ý, không phải thi chuyển cấp. Các cấp dưới vẫn còn đó để ôn khi cần.</p></div>
      ${top ? `<div class="box"><b>Muốn bỏ qua các cấp dưới ${LVN[start]}?</b><p class="mute" style="margin:6px 0">🚀 Thi vượt cấp: làm thẳng Thi chuyển cấp ${LVN[top]} của từng phần (đề như thi thường). Qua phần nào thì phần đó hoàn thành mọi cấp ≤ ${LVN[top]}.</p><button class="pri" data-vcv="${top}">🚀 Thi vượt lên ${LVN[top]}</button></div>` : ''}
      <button class="pri" data-a="go">▶ Mở cấp ${LVN[start]}</button><button data-a="back">${out === overview ? '← Tổng quan' : '← Lộ trình'}</button>`; scrollTo(0, 0);
    $app.onclick = e => { if (e.target.closest('[data-a="go"]')) return overview(start); if (e.target.closest('[data-a="back"]')) out(); }; };
  if (!qs.length) return end(); show(); }
document.addEventListener('click', e => { if (e.target.closest('[data-place]') && S) { scrollTo(0, 0); placeView(); } });
