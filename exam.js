// 🚪 Thi chuyển cấp A1 (bản 11, theo đánh giá "thiết kế đã đảm bảo đạt A1 chưa", người sáng lập 23/10/2026: "cứ theo ý bạn"):
// #1 Câu MỚI chưa gặp khi luyện: exam-a1.json (tools/build-exam.mjs, 870 câu soạn mới + 397 câu nghe thu sẵn của game; tự soát, chưa người thật kiểm).
// #2 Đạt bền: qua rồi thì sau 14 ngày thi lại (từ khác, câu mới); qua lần 2 mới ghi "Đạt bền".
// #3 Hai vòng, không gợi ý chữ: vòng 1 40 câu: ≥ 34 qua, ≤ 29 chưa qua, 30–33 làm thêm vòng 2 (40 câu khác), cả hai ≥ 64/80 (80%) là qua.
//    (mô phỏng: năng lực thật 70% → 4% qua; 85% → 91% qua; một vòng 40 câu là 11% / 86%)
// Mỗi vòng: 22 gõ từ vào câu có gợi ý nghĩa (✍️ + 🧩), 8 nghĩa từ trong câu (📖), 10 nghe (🎧).
// Bỏ "chọn từ điền câu" (xM): từ nhiễu tự chọn cùng loại từ có thể cũng đúng ("The ___ is sleeping.": cat / grandmother); xM giữ trong mã, không ra đề.
const X = { N: 40, HI: 34, LO: 29, TOT: 64, RETEST_D: 14, RETRY_D: 7 };
const X_MIX = [...Array(22).fill('xT'), ...Array(8).fill('xN'), ...Array(10).fill('xL')];
const X_DIM = { xT: ['viet', 'dung'], xM: ['dung'], xN: ['nghia'], xL: ['nghe'] };
let EB = null;   // ngân hàng câu thi
// Gõ từ có gợi ý nghĩa: nhiều từ A1 chung nghĩa tiếng Việt (114 nhóm) nhưng phần lớn không thay nhau được trong câu (I / me "tôi").
// Chỉ chấp nhận từ đồng nghĩa THẬT, thay được trong hầu hết câu (chọn tay, chưa người thật kiểm); dạng chữ theo câu (films ↔ movies).
const SYN = [['bike', 'bicycle'], ['film', 'movie'], ['holiday', 'vacation'], ['start', 'begin'], ['apartment', 'flat'], ['ill', 'sick'], ['bye', 'goodbye'],
  ['dad', 'father'], ['mum', 'mother'], ['TV', 'television'], ['photo', 'photograph'], ['phone', 'telephone'], ['someone', 'somebody'],
  ['everyone', 'everybody'], ['nobody', 'no one'], ['amazing', 'fantastic', 'wonderful']];
const synOf = w => (SYN.find(g => g.some(x => x.toLowerCase() === w.w.toLowerCase())) || []).filter(x => x.toLowerCase() !== w.w.toLowerCase());
const loadEB = async () => EB || (EB = await (await fetch('exam-a1.json?v=1')).json());

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
const xPassAt = () => { const r = xs().runs.filter(x => x.pass && !x.re); return r.length ? r[0].at : null; };
const xDurable = () => xs().runs.some(x => x.pass && x.re);
function examState(p) {
  const at = xPassAt(), now = Date.now(), lastRe = xs().runs.filter(x => x.re).slice(-1)[0];
  if (xDurable()) return { k: 'ben', h: '✅ Đạt bền từ vựng A1', p: 'Đã qua 2 lần cách nhau ≥ 14 ngày, câu mới mỗi lần.', btn: 'Làm lại (không đổi kết quả)', on: true };
  if (at) { const due = at + X.RETEST_D * DAY, wait = lastRe && !lastRe.pass ? lastRe.at + X.RETRY_D * DAY : 0, t = Math.max(due, wait);
    return now >= t ? { k: 're', h: '🔁 Thi lại để xác nhận đạt bền', p: 'Bài mới, từ khác. Qua lần này mới ghi "Đạt bền".', btn: 'Vào thi lại', on: true, re: true }
      : { k: 'cho', h: '✅ Đã qua lần 1', p: `Thi lại xác nhận mở từ ${new Date(t).toLocaleDateString('vi-VN')}. Cứ luyện tập đều.`, btn: `🔒 Mở ngày ${new Date(t).toLocaleDateString('vi-VN')}`, on: false }; }
  const open = gateOpen(p);
  return { k: open ? 'mo' : 'khoa', h: '🚪 Thi chuyển cấp A1', p: open ? 'Đã mở. 2 vòng × 40 câu mới chưa gặp khi luyện; gõ không có gợi ý.' : `Mở khi 📘 Học ${GATE_LEARN}% và mỗi mặt Nhớ ≥ ${GATE_MEM}%.`, btn: open ? 'Vào làm bài' : '🔒 Chưa mở', on: open };
}
function examBox(p) { const s = examState(p);
  return `<div class="box"><b>${s.h}</b><p class="mute">${s.p}</p><button class="${s.on ? 'pri' : ''}" data-a="exam" ${s.on ? '' : 'disabled'}>${s.btn}</button>
    ${xs().runs.slice(-4).reverse().map(x => `<div class="mute">${new Date(x.at).toLocaleDateString('vi-VN')}${x.re ? ' (thi lại)' : ''}: ${x.ok}/${x.n} ${x.pass ? '✅ qua' : '❌ chưa qua'}</div>`).join('')}</div>`; }

// ---------- làm bài ----------
async function exam() {
  try { await loadEB(); } catch (e) { return alert('Chưa tải được bài thi. Thử lại khi có mạng.'); }
  const re = examState(parts(S, Date.now())).re || false, used = new Set(re ? xs().runs.flatMap(x => x.ids || []) : []);
  if (WORDS.length - used.size < 2 * X.N) used.clear();
  const draw = () => { const ws = shuf(WORDS.filter(w => EB[w.id] && !used.has(w.id))).slice(0, X.N); ws.forEach(w => used.add(w.id)); const ty = shuf(X_MIX); return ws.map((w, i) => ({ w, type: ty[i] })); };
  const tally = { ok: 0, n: 0, dim: {}, wrong: [] };
  const round = (no, items, next) => run({ title: `🚪 Thi A1${re ? ' (thi lại)' : ''} · vòng ${no}`, items, retry: false, quiet: true,
    first: (it, good, type) => { tally.n++; if (good) tally.ok++; else tally.wrong.push(it.w); for (const k of X_DIM[type] || []) { const d = tally.dim[k] = tally.dim[k] || [0, 0]; d[1]++; if (good) d[0]++; } },
    done: next });
  const r1 = draw();
  round(1, r1, () => {
    const k = tally.ok;
    if (k >= X.HI || k <= X.LO) return finish(k >= X.HI);
    $app.innerHTML = `<div class="box"><b>Vòng 1: ${k}/${X.N}</b><p>Kết quả ở giữa (${X.LO + 1}–${X.HI - 1}). Làm thêm vòng 2 (40 câu khác) để kết luận chắc hơn: cả hai vòng cần ≥ ${X.TOT}/80.</p></div><button class="pri" data-a="r2">Làm vòng 2</button>`;
    $app.onclick = e => { if (e.target.closest('[data-a="r2"]')) round(2, draw(), () => finish(tally.ok >= X.TOT)); };
  });
  function finish(pass) {
    xs().runs.push({ at: Date.now(), n: tally.n, ok: tally.ok, pass, re, dim: tally.dim, ids: [...used] }); save();
    const st = examState(parts(S, Date.now()));
    $app.innerHTML = `<div class="box"><b>${pass ? (re ? '✅ Qua lần thi lại: Đạt bền từ vựng A1' : '✅ Qua Thi chuyển cấp A1 (lần 1)') : '❌ Chưa qua'}</b>
      <p>Đúng ${tally.ok}/${tally.n}.</p><p class="mute">${DIMS.map(([k, l]) => tally.dim[k] ? `${l} ${tally.dim[k][0]}/${tally.dim[k][1]}` : '').filter(Boolean).join(' · ')}</p>
      <p class="mute">${pass && !re ? st.p : !pass ? 'Luyện tập thêm, nhất là mặt có điểm thấp ở trên, rồi thi lại.' : ''}</p></div>
      ${tally.wrong.length ? `<h2>Từ làm sai</h2>${tally.wrong.map(w => `<div>${esc(w.w)}: ${esc(w.vi)} <span class="mute">· ${esc(EB[w.id].s)}</span></div>`).join('')}` : ''}
      <button class="pri" data-a="home">Về trang chính</button>`;
    $app.onclick = e => { if (e.target.closest('[data-a="home"]')) home(); };
  }
}
