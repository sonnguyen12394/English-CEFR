// 🚪 Thi chuyển cấp A1 (bản 11, theo đánh giá "thiết kế đã đảm bảo đạt A1 chưa", người sáng lập 23/10/2026: "cứ theo ý bạn"):
// #1 Câu MỚI chưa gặp khi luyện: exam-a1.json (tools/build-exam.mjs, 870 câu soạn mới + 397 câu nghe thu sẵn của game; tự soát, chưa người thật kiểm).
// #2 Đạt bền: qua rồi thì sau 14 ngày thi lại (từ khác, câu mới); qua lần 2 mới ghi "Đạt bền".
// #3 Hai vòng, không gợi ý chữ: vòng 1 40 câu: ≥ 34 qua, ≤ 29 chưa qua, 30–33 làm thêm vòng 2 (40 câu khác), cả hai ≥ 64/80 (80%) là qua.
//    (mô phỏng: năng lực thật 70% → 4% qua; 85% → 91% qua; một vòng 40 câu là 11% / 86%)
// Mỗi vòng: 22 gõ từ vào câu có gợi ý nghĩa (✍️ + 🧩), 8 nghĩa từ trong câu (📖), 10 nghe (🎧).
// Bỏ "chọn từ điền câu" (xM): từ nhiễu tự chọn cùng loại từ có thể cũng đúng ("The ___ is sleeping.": cat / grandmother); xM giữ trong mã, không ra đề.
// Hai cấp (23/10/2026): Pre-A1 thi 2 vòng × 30 câu (vòng 1 ≥ 26 qua, ≤ 21 chưa qua, giữa thì vòng 2, cần ≥ 48/60; mô phỏng: năng lực 70% → 7% qua,
// 85% → 89%), chỉ từ Pre-A1, qua một lần là mở A1 (không thi lại bền). A1 như trên, có thi lại bền; từ 25/10/2026 mỗi vòng 28 câu A1 + 12 câu Pre-A1 (thi dồn cấp trước).
// 26/10/2026 (🔁 Nhớ = 12 yêu cầu theo cấp, dồn cấp): đề có câu cho yêu cầu mới của từng cấp, cấp trên giữ dạng của cấp dưới.
//   Pre-A1: + 🔤 nhận đúng chữ (xF). A1: + 🔗 cụm (xC), 🔀 nhận ra dạng bất quy tắc (xR). A2, A2+: + ↔️ đồng / trái nghĩa (xS), 🎭 nghĩa thứ hai (xG), ✏️ tự gõ dạng bất quy tắc (xI).
//   Câu dạng mới chỉ ra cho từ có dữ liệu; không đủ từ thì thành câu gõ từ vào câu (xT).
const mix = o => Object.entries(o).flatMap(([t, n]) => Array(n).fill(t));
const XL = {
  pre: { N: 30, HI: 26, LO: 21, TOT: 48, MIX: mix({ xT: 13, xF: 3, xN: 6, xL: 8 }), retest: false },
  // 25/10/2026 (người sáng lập: thi tính dồn cấp trước): A1, A2, A2+ mỗi vòng 28 câu từ cấp mới + 12 câu (30%) từ các cấp trước.
  a1: { N: 40, HI: 34, LO: 29, TOT: 64, MIX: mix({ xT: 18, xF: 2, xC: 3, xR: 3, xN: 6, xL: 8 }), retest: true, old: 12 },
  // A2 (23/10/2026): như A1; mở khi qua Thi A1 lần 1, cổng cần thêm A1 "Đạt bền".
  a2: { N: 40, HI: 34, LO: 29, TOT: 64, MIX: mix({ xT: 14, xF: 1, xC: 2, xR: 1, xS: 3, xG: 3, xI: 3, xN: 5, xL: 8 }), retest: true, old: 12 },
  // A2+ (23/10/2026): như A2; mở khi qua Thi A2 lần 1, cổng cần A2 "Đạt bền".
  a2p: { N: 40, HI: 34, LO: 29, TOT: 64, MIX: mix({ xT: 14, xF: 1, xC: 2, xR: 1, xS: 3, xG: 3, xI: 3, xN: 5, xL: 8 }), retest: true, old: 12 },
  // B1 → C2 (27/10/2026): như A2; thêm câu cho yêu cầu mới của cấp (B1 🔗🧱🔧 · B2 🛠🎚🔄 · C1 🎩 · C2 🌫), cấp trên giữ dạng của cấp dưới
  b1: { N: 40, HI: 34, LO: 29, TOT: 64, MIX: mix({ xT: 10, xF: 1, xC: 1, xR: 1, xS: 2, xG: 2, xI: 1, xN: 4, xL: 6, xCT: 4, xP: 4, xH: 4 }), retest: true, old: 12 },
  b1p: { N: 40, HI: 34, LO: 29, TOT: 64, MIX: mix({ xT: 10, xF: 1, xC: 1, xR: 1, xS: 2, xG: 2, xI: 1, xN: 4, xL: 6, xCT: 4, xP: 4, xH: 4 }), retest: true, old: 12 },
  b2: { N: 40, HI: 34, LO: 29, TOT: 64, MIX: mix({ xT: 7, xC: 1, xS: 1, xG: 2, xI: 1, xN: 3, xL: 6, xCT: 3, xP: 3, xH: 2, xD: 4, xRg: 3, xY: 4 }), retest: true, old: 12 },
  b2p: { N: 40, HI: 34, LO: 29, TOT: 64, MIX: mix({ xT: 7, xC: 1, xS: 1, xG: 2, xI: 1, xN: 3, xL: 6, xCT: 3, xP: 3, xH: 2, xD: 4, xRg: 3, xY: 4 }), retest: true, old: 12 },
  c1: { N: 40, HI: 34, LO: 29, TOT: 64, MIX: mix({ xT: 7, xG: 2, xN: 3, xL: 6, xCT: 3, xP: 3, xH: 1, xD: 4, xRg: 2, xY: 4, xV: 5 }), retest: true, old: 12 },
  c2: { N: 40, HI: 34, LO: 29, TOT: 64, MIX: mix({ xT: 6, xG: 2, xN: 2, xL: 6, xCT: 3, xP: 3, xD: 4, xRg: 1, xY: 4, xV: 4, xId: 5 }), retest: true, old: 12 },
};
const X = { RETEST_D: 14, RETRY_D: 7 };
const X_DIM = { xT: ['viet', 'dung', 'nhora'], xM: ['dung'], xN: ['nghia'], xL: ['nghe'], xF: ['chu'], xC: ['cum'], xR: ['bqt'], xS: ['lienq'], xG: ['nghia2'], xI: ['bqt2'],
  xCT: ['cumtu', 'cum'], xP: ['mau'], xH: ['ho'], xD: ['taodang', 'ho'], xRg: ['sacthai'], xY: ['thay', 'lienq'], xV: ['vanphong', 'sacthai'], xId: ['thanhngu'] };
// dạng câu thi dùng câu của 🏋️ Luyện tập (questionX / question) và dữ liệu từ cần có
const X_Q = { xF: ['form', () => true], xC: ['col', w => !!w.col], xR: ['irrR', w => !!w.irr], xS: ['rel', w => !!w.rel], xG: ['s2', w => !!w.s2], xI: ['irrT', w => !!w.irr],
  xCT: ['colT', w => !!(w.col && colPart(w))], xP: ['pat', w => !!w.pat], xH: ['fam', w => !!(w.fam && w.fam.length)], xD: ['famQ', w => !!w.famQ], xRg: ['reg', w => !!w.reg], xY: ['synT', w => !!(w.rel && w.rel.syn.length)], xV: ['style', w => !!w.reg], xId: ['idi', w => !!w.idi] };
let EB = null;   // ngân hàng câu thi
// Gõ từ có gợi ý nghĩa: nhiều từ A1 chung nghĩa tiếng Việt (114 nhóm) nhưng phần lớn không thay nhau được trong câu (I / me "tôi").
// Chỉ chấp nhận từ đồng nghĩa THẬT, thay được trong hầu hết câu (chọn tay, chưa người thật kiểm); dạng chữ theo câu (films ↔ movies).
const SYN = [['bike', 'bicycle'], ['film', 'movie'], ['holiday', 'vacation'], ['start', 'begin'], ['apartment', 'flat'], ['ill', 'sick'], ['bye', 'goodbye'],
  ['dad', 'father'], ['mum', 'mother'], ['TV', 'television'], ['photo', 'photograph'], ['phone', 'telephone'], ['someone', 'somebody'],
  ['everyone', 'everybody'], ['nobody', 'no one'], ['amazing', 'fantastic', 'wonderful']];
const synOf = w => (SYN.find(g => g.some(x => x.toLowerCase() === w.w.toLowerCase())) || []).filter(x => x.toLowerCase() !== w.w.toLowerCase());
const loadEB = async () => EB || (EB = Object.assign({}, ...(await Promise.all(['exam-a1.json?v=12', 'exam-a2.json?v=5', 'exam-b.json?v=1'].map(async f => (await fetch(f)).json())))));

// từ nhiễu cùng loại từ, chỉ lấy từ thuộc cấp ≤ cấp đang thi (kiểm thử Pre-A1: đề Pre-A1 từng có từ nhiễu "injury", "poster")
const samePos = (w, n) => { const ok = x => LEVELS.indexOf(wLv(x)) <= LEVELS.indexOf(XLV); let c = WORDS.filter(x => x.id !== w.id && x.pos === w.pos && ok(x)); if (c.length < n) c = WORDS.filter(x => x.id !== w.id && x.pos === w.pos); return shuf(c).slice(0, n); };
const xBlank = (s, f) => s.replace(new RegExp(`(?<![A-Za-z'])${f.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?![A-Za-z])`, 'i'), '_____');
// dạng của từ đích trong câu: dùng cùng đuôi cho từ nhiễu (cats → dogs); không suy được thì dùng câu gõ
const inflect = (base, form, other) => { const b = base.toLowerCase(), f = form.toLowerCase(); if (f === b) return other; if (f.startsWith(b)) return other + f.slice(b.length); return null; };
// Câu nghe thu sẵn (e.l, lấy từ game) nhiều câu vượt cấp (kiểm thử Pre-A1 26/10/2026: "once in a blue moon", "fall behind"…).
// Chỉ dùng khi mọi từ trong câu thuộc cấp ≤ cấp đang thi; không thì máy đọc câu thi (e.s, đã soạn đúng cấp).
let XLV = 'a1';
const xLvOf = t => { const ed = t.endsWith('ed'); for (const f of [t, t.replace(/'s$/, ''), t.replace(/s$/, ''), t.replace(/es$/, ''), ed ? t.slice(0, -2) : t, ed ? t.slice(0, -1) : t, t.replace(/ing$/, ''), t.replace(/ing$/, 'e')]) { const w = WBY_W[f]; if (w) return wLv(w); } return null; };
let WBY_W = null;
// Pre-A1, A1: luôn máy đọc câu thi (kiểm thử A1 26/10/2026: câu thu sẵn "đúng từ" vẫn có thành ngữ, cụm động từ: break the ice, set up, go over).
function xClipOk(l) { if (!l || ['pre', 'a1'].includes(XLV)) return false; WBY_W = WBY_W || Object.fromEntries(WORDS.map(w => [w.w.toLowerCase(), w]));
  return l.toLowerCase().match(/[a-z']+/g).every(t => { const L = xLvOf(t); return L != null && LEVELS.indexOf(L) <= LEVELS.indexOf(XLV); }); }
function examQ(w, type) {
  window.XSAY = null;
  if (X_Q[type]) { const q = X_Q[type][1](w) && (questionX(w, X_Q[type][0]) || question(w, X_Q[type][0]));
    // 🔄 thay từ, 🌫 thành ngữ: câu thi mới (câu luyện là câu ví dụ trên thẻ); dạng từ trong câu thi in đậm
    const e = EB && EB[w.id]; if (q && (type === 'xY' || type === 'xId') && e && e.f && xBlank(e.s, e.f) !== e.s) q.top = esc(xBlank(e.s, e.f)).replace('_____', `<b>${esc(e.s.match(new RegExp(`(?<![A-Za-z'])${e.f.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?![A-Za-z])`, 'i'))[0])}</b>`);
    if (q && q.type === X_Q[type][0]) return { ...q, type }; type = 'xT'; }
  const e = EB[w.id], s = e.s, f = e.f;
  if (type === 'xM') { const ds = [...new Map(samePos(w, 8).map(x => inflect(w.w, f, x.w)).filter(Boolean).filter(x => x.toLowerCase() !== f.toLowerCase()).map(x => [x.toLowerCase(), x])).values()];
    if (ds.length >= 3) return { type, top: esc(xBlank(s, f)), sub: 'Chọn từ điền vào chỗ trống.', a: f, opts: shuf([f, ...ds.slice(0, 3)]) };
    type = 'xT'; }
  if (type === 'xN') return { type, top: esc(s).replace(new RegExp(`(?<![A-Za-z'])(${f.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})(?![A-Za-z])`, 'i'), '<u><b>$1</b></u>'), sub: 'Từ gạch chân nghĩa là gì?', a: w.vi, opts: shuf([w.vi, ...pick(w, 'vi', 3)]) };
  if (type === 'xL') { const l = xClipOk(e.l) ? e.l : e.s; window.XSAY = l; return { type, top: '🎧 Nghe câu. Bạn nghe thấy từ nào?', sub: `<button class="chip" data-xsay="1">🔊 Nghe lại</button>`, a: w.w, opts: shuf([w.w, ...samePos(w, 3).map(x => x.w)]), say: l }; }
  const alt = synOf(w).map(x => inflect(w.w, f, x)).filter(Boolean);
  return { type: 'xT', top: esc(xBlank(s, f)), sub: `Gõ từ còn thiếu (đúng dạng trong câu). Nghĩa: ${esc(w.vi)}`, a: f, alt, typed: true };
}
document.addEventListener('click', e => { if (e.target.closest('[data-xsay]') && window.XSAY) speak(window.XSAY); });

// ---------- trạng thái ----------
const xs = () => (S.x = S.x || { runs: [] });
const runsOf = lv => xs().runs.filter(x => (x.lv || 'a1') === lv);   // lần thi cũ chưa ghi cấp = A1
const xPassed = lv => runsOf(lv).some(x => x.pass);
const xPassAt = lv => { const r = runsOf(lv).filter(x => x.pass && !x.re); return r.length ? r[0].at : null; };
const xDurable = (lv = 'a1') => runsOf(lv).some(x => x.pass && x.re);
const fmtD = t => new Date(t).toLocaleDateString('vi-VN');
function examState(p, lv) {
  const C = XL[lv], name = LVN[lv], now = Date.now();
  const prev = LEVELS[LEVELS.indexOf(lv) - 1];
  if (prev && !xPassed(prev)) return { k: 'khoa', h: `🚪 Thi chuyển cấp ${name}`, p: `Mở sau khi qua Thi chuyển cấp ${LVN[prev]} và học đủ bài ${name}.`, btn: '🔒 Chưa mở', on: false };
  if (lv === 'pre' && xPassed('pre')) return { k: 'xong', h: '✅ Đã qua Thi chuyển cấp Pre-A1', p: 'Đã mở bài A1.', btn: 'Làm lại (không đổi kết quả)', on: true };
  if (C.retest && xDurable(lv)) return { k: 'ben', h: `✅ Đạt bền từ vựng ${name}`, p: 'Đã qua 2 lần cách nhau ≥ 14 ngày, câu mới mỗi lần.', btn: 'Làm lại (không đổi kết quả)', on: true };
  const at = C.retest ? xPassAt(lv) : null;
  if (at) { const lastRe = runsOf(lv).filter(x => x.re).slice(-1)[0], due = at + X.RETEST_D * DAY, wait = lastRe && !lastRe.pass ? lastRe.at + X.RETRY_D * DAY : 0, t = Math.max(due, wait);
    return now >= t ? { k: 're', h: `🔁 Thi lại để xác nhận đạt bền ${name}`, p: 'Bài mới, từ khác. Qua lần này mới ghi "Đạt bền".', btn: 'Vào thi lại', on: true, re: true }
      : { k: 'cho', h: `✅ Đã qua Thi chuyển cấp ${name} lần 1`, p: `Thi lại xác nhận mở từ ${fmtD(t)}. Cứ luyện tập đều.`, btn: `🔒 Mở ngày ${fmtD(t)}`, on: false }; }
  const dp = DUR_PREV[lv], needDur = !!dp && !xDurable(dp), open = gateOpen(p) && !needDur;
  return { k: open ? 'mo' : 'khoa', h: `🚪 Thi chuyển cấp ${name}`, p: open ? `Đã mở. Tối đa 2 vòng × ${C.N} câu mới chưa gặp khi luyện; gõ không có gợi ý chữ.` : `Mở khi 📘 Học ${GATE_LEARN}% và mỗi mặt Nhớ ≥ ${GATE_MEM}% (Học: ${p.T} từ ${name}; Nhớ: ${p.Tm} từ, tính cả cấp trước)${dp ? `, và ${LVN[dp]} đã "Đạt bền"` : ''}.${needDur && gateOpen(p) ? ` Còn thiếu: ${LVN[dp]} "Đạt bền".` : ''}`, btn: open ? 'Vào làm bài' : '🔒 Chưa mở', on: open };
}
function examBox(p, lv) { const s = examState(p, lv);
  return `<div class="box"><b>${s.h}</b><p class="mute">${s.p}</p><button class="${s.on ? 'pri' : ''}" data-a="exam" data-lv="${lv}" ${s.on ? '' : 'disabled'}>${s.btn}</button>
    ${runsOf(lv).slice(-4).reverse().map(x => `<div class="mute">${fmtD(x.at)}${x.re ? ' (thi lại)' : ''}: ${x.ok}/${x.n} ${x.pass ? '✅ qua' : '❌ chưa qua'}</div>`).join('')}</div>`; }

// ---------- làm bài ----------
async function exam(lv) {
  try { await loadEB(); } catch (e) { return alert('Chưa tải được bài thi. Thử lại khi có mạng.'); }
  XLV = lv;
  const C = XL[lv], name = LVN[lv], pool = levelWords(lv).filter(w => EB[w.id]);
  const re = examState(parts(S, Date.now(), lv), lv).re || false, used = new Set(re ? runsOf(lv).flatMap(x => x.ids || []) : []);
  if (pool.length - pool.filter(w => used.has(w.id)).length < 2 * C.N) used.clear();
  const oldPool = C.old ? memWords(LEVELS[LEVELS.indexOf(lv) - 1]).filter(w => EB[w.id]) : [];   // câu từ mọi cấp trước
  const draw = () => { const ws = [...shuf(pool.filter(w => !used.has(w.id))).slice(0, C.N - (C.old || 0)), ...shuf(oldPool.filter(w => !used.has(w.id))).slice(0, C.old || 0)];
    ws.forEach(w => used.add(w.id));
    // dạng cần dữ liệu riêng xếp trước, mỗi dạng lấy từ có dữ liệu đó; hết từ phù hợp thì thành câu gõ (xT)
    const ty = shuf(C.MIX).sort((a, b) => !!X_Q[b] - !!X_Q[a]), rest = shuf(ws);
    return shuf(ty.map(t => { let i = X_Q[t] ? rest.findIndex(X_Q[t][1]) : 0; if (i < 0) { t = 'xT'; i = 0; } return { w: rest.splice(i, 1)[0], type: t }; })); };
  const tally = { ok: 0, n: 0, dim: {}, wrong: [] };
  const round = (no, items, next) => run({ title: `🚪 Thi ${name}${re ? ' (thi lại)' : ''} · vòng ${no}`, items, retry: false, quiet: true,
    first: (it, good, type) => { tally.n++; if (good) tally.ok++; else tally.wrong.push(it.w); for (const k of X_DIM[type] || []) { const d = tally.dim[k] = tally.dim[k] || [0, 0]; d[1]++; if (good) d[0]++; } },
    done: next });
  round(1, draw(), () => {
    const k = tally.ok;
    if (k >= C.HI || k <= C.LO) return finish(k >= C.HI);
    $app.innerHTML = `<div class="box"><b>Vòng 1: ${k}/${C.N}</b><p>Kết quả ở giữa (${C.LO + 1}–${C.HI - 1}). Làm thêm vòng 2 (${C.N} câu khác) để kết luận chắc hơn: cả hai vòng cần ≥ ${C.TOT}/${2 * C.N}.</p></div><button class="pri" data-a="r2">Làm vòng 2</button>`;
    $app.onclick = e => { if (e.target.closest('[data-a="r2"]')) round(2, draw(), () => finish(tally.ok >= C.TOT)); };
  });
  function finish(pass) {
    const first = !xPassed(lv);
    xs().runs.push({ at: Date.now(), lv, n: tally.n, ok: tally.ok, pass, re, dim: tally.dim, ids: [...used] }); save();
    const st = examState(parts(S, Date.now(), lv), lv);
    const next = LVN[LEVELS[LEVELS.indexOf(lv) + 1]];
    const h = !pass ? '❌ Chưa qua' : lv === 'pre' ? (first ? '✅ Qua Thi chuyển cấp Pre-A1: đã mở bài A1' : '✅ Qua') : re ? `✅ Qua lần thi lại: Đạt bền từ vựng ${name}` : `✅ Qua Thi chuyển cấp ${name} (lần 1)${first && next ? `: đã mở bài ${next}` : ''}`;
    $app.innerHTML = `<div class="box"><b>${h}</b>
      <p>Đúng ${tally.ok}/${tally.n}.</p><p class="mute">${dimsAt(lv).map(([k, l]) => tally.dim[k] ? `${l} ${tally.dim[k][0]}/${tally.dim[k][1]}` : '').filter(Boolean).join(' · ')}</p>
 <p class="mute">${pass && C.retest && !re ? st.p : !pass ? 'Luyện tập thêm, nhất là mặt có điểm thấp ở trên, rồi thi lại.' : ''}</p></div>
      ${tally.wrong.length ? `<h2>Từ làm sai</h2>${tally.wrong.map(w => `<div>${esc(w.w)}: ${esc(w.vi)} <span class="mute">· ${esc(EB[w.id].s)}</span></div>`).join('')}` : ''}
      <button class="pri" data-a="home">Về trang chính</button>`;
    $app.onclick = e => { if (e.target.closest('[data-a="home"]')) { HOME.lv = null; home(); } };
  }
}
