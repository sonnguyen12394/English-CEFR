// 🚪 Thi chuyển cấp A1 (bản 11, theo đánh giá "thiết kế đã đảm bảo đạt A1 chưa", người sáng lập 23/10/2026: "cứ theo ý bạn"):
// #1 Câu MỚI chưa gặp khi luyện: exam-a1.json (tools/build-exam.mjs, 870 câu soạn mới + 397 câu nghe thu sẵn của game; tự soát, chưa người thật kiểm).
// #2 Đạt bền: qua rồi thì sau 14 ngày thi lại (từ khác, câu mới); qua lần 2 mới ghi "Đạt bền".
// #3 Hai vòng, không gợi ý chữ: vòng 1 40 câu: ≥ 34 qua, ≤ 29 chưa qua, 30–33 làm thêm vòng 2 (40 câu khác), cả hai ≥ 64/80 (80%) là qua.
//    (mô phỏng: năng lực thật 70% → 4% qua; 85% → 91% qua; một vòng 40 câu là 11% / 86%)
// Mỗi vòng: 22 gõ từ vào câu có gợi ý nghĩa (✍️ + 🧩), 8 nghĩa từ trong câu (📖), 10 nghe (🎧).
// Bỏ "chọn từ điền câu" (xM): từ nhiễu tự chọn cùng loại từ có thể cũng đúng ("The ___ is sleeping.": cat / grandmother); xM giữ trong mã, không ra đề.
// Hai cấp (23/10/2026): Pre-A1 thi 2 vòng × 30 câu (vòng 1 ≥ 26 qua, ≤ 21 chưa qua, giữa thì vòng 2, cần ≥ 48/60; mô phỏng: năng lực 70% → 7% qua,
// 85% → 89%), chỉ từ Pre-A1, qua một lần là mở A1 (không thi lại bền). A1 như trên, rút từ TẤT CẢ từ (Pre-A1 + A1), có thi lại bền.
const XL = {
  pre: { N: 30, HI: 26, LO: 21, TOT: 48, MIX: [...Array(16).fill('xT'), ...Array(6).fill('xN'), ...Array(8).fill('xL')], retest: false },
  a1: { N: 40, HI: 34, LO: 29, TOT: 64, MIX: [...Array(22).fill('xT'), ...Array(8).fill('xN'), ...Array(10).fill('xL')], retest: true },
  // A2 (23/10/2026): như A1; mỗi vòng 3/4 câu từ A2, 1/4 câu từ Pre-A1 + A1 (kiểm nhớ lâu); mở khi qua Thi A1 lần 1, cổng cần thêm A1 "Đạt bền".
  a2: { N: 40, HI: 34, LO: 29, TOT: 64, MIX: [...Array(22).fill('xT'), ...Array(8).fill('xN'), ...Array(10).fill('xL')], retest: true, old: 10 },
};
const X = { RETEST_D: 14, RETRY_D: 7 };
const X_DIM = { xT: ['viet', 'dung'], xM: ['dung'], xN: ['nghia'], xL: ['nghe'] };
let EB = null;   // ngân hàng câu thi
// Gõ từ có gợi ý nghĩa: nhiều từ A1 chung nghĩa tiếng Việt (114 nhóm) nhưng phần lớn không thay nhau được trong câu (I / me "tôi").
// Chỉ chấp nhận từ đồng nghĩa THẬT, thay được trong hầu hết câu (chọn tay, chưa người thật kiểm); dạng chữ theo câu (films ↔ movies).
const SYN = [['bike', 'bicycle'], ['film', 'movie'], ['holiday', 'vacation'], ['start', 'begin'], ['apartment', 'flat'], ['ill', 'sick'], ['bye', 'goodbye'],
  ['dad', 'father'], ['mum', 'mother'], ['TV', 'television'], ['photo', 'photograph'], ['phone', 'telephone'], ['someone', 'somebody'],
  ['everyone', 'everybody'], ['nobody', 'no one'], ['amazing', 'fantastic', 'wonderful']];
const synOf = w => (SYN.find(g => g.some(x => x.toLowerCase() === w.w.toLowerCase())) || []).filter(x => x.toLowerCase() !== w.w.toLowerCase());
const loadEB = async () => EB || (EB = Object.assign({}, ...(await Promise.all(['exam-a1.json?v=6', 'exam-a2.json?v=3'].map(async f => (await fetch(f)).json())))));

const samePos = (w, n) => shuf(WORDS.filter(x => x.id !== w.id && x.pos === w.pos)).slice(0, n);
const xBlank = (s, f) => s.replace(new RegExp(`(?<![A-Za-z'])${f.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?![A-Za-z])`, 'i'), '_____');
// dạng của từ đích trong câu: dùng cùng đuôi cho từ nhiễu (cats → dogs); không suy được thì dùng câu gõ
const inflect = (base, form, other) => { const b = base.toLowerCase(), f = form.toLowerCase(); if (f === b) return other; if (f.startsWith(b)) return other + f.slice(b.length); return null; };
function examQ(w, type) {
  const e = EB[w.id], s = e.s, f = e.f;
  window.XSAY = null;
  if (type === 'xM') { const ds = [...new Map(samePos(w, 8).map(x => inflect(w.w, f, x.w)).filter(Boolean).filter(x => x.toLowerCase() !== f.toLowerCase()).map(x => [x.toLowerCase(), x])).values()];
    if (ds.length >= 3) return { type, top: esc(xBlank(s, f)), sub: 'Chọn từ điền vào chỗ trống.', a: f, opts: shuf([f, ...ds.slice(0, 3)]) };
    type = 'xT'; }
  if (type === 'xN') return { type, top: esc(s).replace(new RegExp(`(?<![A-Za-z'])(${f.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})(?![A-Za-z])`, 'i'), '<u><b>$1</b></u>'), sub: 'Từ gạch chân nghĩa là gì?', a: w.vi, opts: shuf([w.vi, ...pick(w, 'vi', 3)]) };
  if (type === 'xL') { window.XSAY = e.l || w.w; if (e.l) return { type, top: '🎧 Nghe câu. Bạn nghe thấy từ nào?', sub: `<button class="chip" data-xsay="1">🔊 Nghe lại</button>`, a: w.w, opts: shuf([w.w, ...samePos(w, 3).map(x => x.w)]), say: e.l };
    return { type, top: '🎧 Nghe rồi gõ lại từ', sub: `<button class="chip" data-xsay="1">🔊 Nghe lại</button>`, a: w.w, typed: true, say: w.w }; }
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
  if (lv === 'a1' && !xPassed('pre')) return { k: 'khoa', h: `🚪 Thi chuyển cấp A1`, p: 'Mở sau khi qua Thi chuyển cấp Pre-A1 và học đủ bài A1.', btn: '🔒 Chưa mở', on: false };
  if (lv === 'a2' && !xPassed('a1')) return { k: 'khoa', h: `🚪 Thi chuyển cấp A2`, p: 'Mở sau khi qua Thi chuyển cấp A1 và học đủ bài A2.', btn: '🔒 Chưa mở', on: false };
  if (lv === 'pre' && xPassed('pre')) return { k: 'xong', h: '✅ Đã qua Thi chuyển cấp Pre-A1', p: 'Đã mở bài A1.', btn: 'Làm lại (không đổi kết quả)', on: true };
  if (C.retest && xDurable(lv)) return { k: 'ben', h: `✅ Đạt bền từ vựng ${name}`, p: 'Đã qua 2 lần cách nhau ≥ 14 ngày, câu mới mỗi lần.', btn: 'Làm lại (không đổi kết quả)', on: true };
  const at = C.retest ? xPassAt(lv) : null;
  if (at) { const lastRe = runsOf(lv).filter(x => x.re).slice(-1)[0], due = at + X.RETEST_D * DAY, wait = lastRe && !lastRe.pass ? lastRe.at + X.RETRY_D * DAY : 0, t = Math.max(due, wait);
    return now >= t ? { k: 're', h: `🔁 Thi lại để xác nhận đạt bền ${name}`, p: 'Bài mới, từ khác. Qua lần này mới ghi "Đạt bền".', btn: 'Vào thi lại', on: true, re: true }
      : { k: 'cho', h: `✅ Đã qua Thi chuyển cấp ${name} lần 1`, p: `Thi lại xác nhận mở từ ${fmtD(t)}. Cứ luyện tập đều.`, btn: `🔒 Mở ngày ${fmtD(t)}`, on: false }; }
  const needDur = lv === 'a2' && !xDurable('a1'), open = gateOpen(p) && !needDur;
  return { k: open ? 'mo' : 'khoa', h: `🚪 Thi chuyển cấp ${name}`, p: open ? `Đã mở. Tối đa 2 vòng × ${C.N} câu mới chưa gặp khi luyện; gõ không có gợi ý chữ.` : `Mở khi 📘 Học ${GATE_LEARN}% và mỗi mặt Nhớ ≥ ${GATE_MEM}% (trên ${p.T} từ ${lv === 'a1' ? 'Pre-A1 + A1' : name})${lv === 'a2' ? ', và A1 đã "Đạt bền"' : ''}.${needDur && gateOpen(p) ? ' Còn thiếu: A1 "Đạt bền".' : ''}`, btn: open ? 'Vào làm bài' : '🔒 Chưa mở', on: open };
}
function examBox(p, lv) { const s = examState(p, lv);
  return `<div class="box"><b>${s.h}</b><p class="mute">${s.p}</p><button class="${s.on ? 'pri' : ''}" data-a="exam" data-lv="${lv}" ${s.on ? '' : 'disabled'}>${s.btn}</button>
    ${runsOf(lv).slice(-4).reverse().map(x => `<div class="mute">${fmtD(x.at)}${x.re ? ' (thi lại)' : ''}: ${x.ok}/${x.n} ${x.pass ? '✅ qua' : '❌ chưa qua'}</div>`).join('')}</div>`; }

// ---------- làm bài ----------
async function exam(lv) {
  try { await loadEB(); } catch (e) { return alert('Chưa tải được bài thi. Thử lại khi có mạng.'); }
  const C = XL[lv], name = LVN[lv], pool = gateWords(lv).filter(w => EB[w.id]);
  const re = examState(parts(S, Date.now(), gateWords(lv)), lv).re || false, used = new Set(re ? runsOf(lv).flatMap(x => x.ids || []) : []);
  if (pool.length - pool.filter(w => used.has(w.id)).length < 2 * C.N) used.clear();
  const oldPool = C.old ? gateWords('a1').filter(w => EB[w.id]) : [];   // A2: thêm câu từ Pre-A1 + A1
  const draw = () => { const ws = [...shuf(pool.filter(w => !used.has(w.id))).slice(0, C.N - (C.old || 0)), ...shuf(oldPool.filter(w => !used.has(w.id))).slice(0, C.old || 0)];
    ws.forEach(w => used.add(w.id)); const ty = shuf(C.MIX); return shuf(ws).map((w, i) => ({ w, type: ty[i] })); };
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
    const st = examState(parts(S, Date.now(), gateWords(lv)), lv);
    const next = LVN[LEVELS[LEVELS.indexOf(lv) + 1]];
    const h = !pass ? '❌ Chưa qua' : lv === 'pre' ? (first ? '✅ Qua Thi chuyển cấp Pre-A1: đã mở bài A1' : '✅ Qua') : re ? `✅ Qua lần thi lại: Đạt bền từ vựng ${name}` : `✅ Qua Thi chuyển cấp ${name} (lần 1)${first && next ? `: đã mở bài ${next}` : ''}`;
    $app.innerHTML = `<div class="box"><b>${h}</b>
      <p>Đúng ${tally.ok}/${tally.n}.</p><p class="mute">${DIMS.map(([k, l]) => tally.dim[k] ? `${l} ${tally.dim[k][0]}/${tally.dim[k][1]}` : '').filter(Boolean).join(' · ')}</p>
 <p class="mute">${pass && C.retest && !re ? st.p : !pass ? 'Luyện tập thêm, nhất là mặt có điểm thấp ở trên, rồi thi lại.' : ''}</p></div>
      ${tally.wrong.length ? `<h2>Từ làm sai</h2>${tally.wrong.map(w => `<div>${esc(w.w)}: ${esc(w.vi)} <span class="mute">· ${esc(EB[w.id].s)}</span></div>`).join('')}` : ''}
      <button class="pri" data-a="home">Về trang chính</button>`;
    $app.onclick = e => { if (e.target.closest('[data-a="home"]')) { HOME.lv = null; home(); } };
  }
}
