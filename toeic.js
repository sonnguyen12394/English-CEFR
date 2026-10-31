// 💼 Luyện TOEIC Listening & Reading (v72, 28/10/2026, người sáng lập: "hãy làm đi" sau góp ý làm phần học TOEIC).
// v73 (người sáng lập: "phân tích điểm mạnh yếu … làm cho phần học TOEIC trở nên giá trị"): kho gấp ~1,7 lần, Part 5 theo dạng, bẫy Part 2, luyện tốc độ, nơi tăng điểm nhanh nhất, ngày thi.
// Chung mục 🎓 Luyện thi với 🌏 IELTS (nút chuyển ở đầu màn). Chạy riêng, KHÔNG tính vào luật đo CEFR.
// Dữ liệu: toeic.json ← content/toeic/*.json (node tools/build-toeic.mjs; Claude soạn, chưa người thật kiểm; không chép đề ETS). Giọng Part 2–4, từ vựng: tools/build-audio.py (Kokoro, Mỹ + Anh).
// Đề thật: Nghe 100 câu / 45 phút (Part 1 tả ảnh 6 · Part 2 hỏi–đáp 25 · Part 3 hội thoại 39 · Part 4 bài nói 30), Đọc 100 câu / 75 phút (Part 5 điền câu 30 · Part 6 điền đoạn 16 · Part 7 đọc hiểu 54).
// App chưa có Part 1 (cần ảnh). Điểm: ETS quy đổi riêng từng đề (equating), không có bảng cố định → app chỉ ƯỚC theo tỉ lệ đúng (5–495 mỗi phần), rồi hiệu chỉnh bằng đề thật người học tự nhập.
// TOEIC là thương hiệu của ETS; app không phải sản phẩm chính thức.
let TO = null;
const toLoad = async () => TO || (TO = await (await fetch('toeic.json?v=' + APP_V)).json());
const toSt = () => { const o = (S.to = S.to || {}); o.target = o.target || 600; o.r = o.r || {}; o.voc = o.voc || {}; o.trap = o.trap || {}; for (const k of ['mock', 'off', 'spd']) o[k] = o[k] || []; return o; };
const TO_TG = [450, 550, 650, 750, 850];
// điểm ước một phần: 5 + 490 × tỉ lệ đúng, làm tròn 5 (thang 5–495); KHÔNG phải bảng quy đổi của ETS
const toScale = (ok, n) => Math.max(5, Math.min(495, 5 + Math.round(490 * ok / Math.max(1, n) / 5) * 5));
// mức tối thiểu cho từng cấp CEFR theo bảng ETS công bố (Nghe / Đọc); cần đối chiếu tài liệu ETS mới nhất
const TO_CEFR = { L: [['c1', 490], ['b2', 400], ['b1', 275], ['a2', 110]], R: [['c1', 455], ['b2', 385], ['b1', 275], ['a2', 115]] };
const toCefr = (k, sc) => (TO_CEFR[k].find(([, m]) => sc >= m) || ['a1'])[0];
const toBase = tg => toCefr('L', tg / 2);   // nền CEFR cần có cho tổng điểm mục tiêu (chia đều hai phần, suy ra)
const TO_SEC = { p2: ['🗣', 'Part 2: Hỏi – đáp', 'L'], p3: ['👥', 'Part 3: Hội thoại', 'L'], p4: ['📢', 'Part 4: Bài nói ngắn', 'L'], p5: ['✏️', 'Part 5: Điền câu', 'R'], p6: ['📝', 'Part 6: Điền đoạn văn', 'R'], p7: ['📰', 'Part 7: Đọc hiểu', 'R'] };
const TO_HOW = {
  L: ['🎧 Nghe', ['Đề thật chỉ phát mỗi bài một lần. Dùng lúc đọc hướng dẫn để xem trước câu hỏi Part 3–4.', 'Part 2: nghe kỹ từ hỏi đầu câu (When, Where, Who, Why…). Bẫy hay gặp: lời đáp lặp lại từ trong câu hỏi hoặc từ phát âm gần giống ("copy" – "coffee").',
    'Part 2 có lời đáp gián tiếp đúng ("I\'m not sure, ask Tom"), không nhất thiết trả lời thẳng.', 'Part 3–4: câu hỏi theo thứ tự lời nói; trả lời ngay khi nghe được, không chờ hết bài.']],
  R: ['📖 Đọc', ['75 phút cho 100 câu: Part 5 khoảng 20 giây một câu, để dành thời gian cho Part 7.', 'Part 5: nhìn 4 phương án trước. Cùng gốc khác đuôi (-tion, -ive, -ly) → câu hỏi dạng từ: xem vị trí cần danh từ, tính từ hay trạng từ.',
    'Part 6: câu chèn phải nối ý câu trước và câu sau; đọc cả đoạn, không chỉ câu chứa chỗ trống.', 'Part 7 nhiều văn bản: câu hỏi "đối chiếu" cần thông tin từ 2 văn bản (vd. số người trong đơn + số bàn trong quảng cáo).']] };

// ---------- câu hỏi (khuôn chung với ieRun / mkPaper: { x, sec, kind, head, q, opts, a, why, play }) ----------
const TO_LH = '<p class="mute">🎧 Nghe rồi chọn. Đề thật chỉ nghe 1 lần (đề thử của app cũng vậy); luyện được nghe 2 lần.</p>';
// v73: Part 2 hiện lời bài kèm loại bẫy của từng lời đáp sai (content: tr)
const TO_TRAP = { rep: ['Lặp từ / từ gần âm', 'Lời đáp dùng lại từ (hoặc từ nghe giống) trong câu hỏi nhưng không trả lời.'], type: ['Sai loại thông tin', 'Câu hỏi hỏi một loại thông tin (khi nào, ở đâu, ai…) nhưng lời đáp nói loại khác.'],
  yn: ['Yes / No cho câu Wh-', 'Câu hỏi When, Where, Why… không trả lời bằng Yes / No.'], rel: ['Cùng chủ đề, không trả lời', 'Nghe có vẻ liên quan nhưng không trả lời điều được hỏi.'] };
const toP2Q = x => ({ x, sec: 'p2', kind: 'mc', head: TO_LH + '<p class="mute">Part 2: nghe câu hỏi và 3 lời đáp (đề thật không in chữ). Chọn lời đáp hợp nhất.</p>', q: 'Lời đáp nào đúng?', opts: ['A', 'B', 'C'], a: 'ABC'[x.a],
  play: { key: x.id, lines: x.lines }, why: x.q + ' → ' + x.o.map((t, i) => `${'ABC'[i]}. ${t} ${i === x.a ? '✅' : '❌ ' + (x.tr ? TO_TRAP[x.tr[i]][0] : '')}`).join(' · ') });
const toTalkQs = (x, sec) => x.qs.map((q, i) => ({ x, sec, kind: 'mc', head: TO_LH + `<div class="box"><p class="mute" style="margin:0">Câu ${i + 1}/${x.qs.length} của bài này</p></div>`, q: esc(q.q), opts: shuf([q.a, ...q.w]), a: q.a,
  play: x.lines ? { key: x.id, lines: x.lines } : { key: x.id, text: x.text }, why: 'Lời bài: ' + (x.lines ? x.lines.map(l => l[1]).join(' ') : x.text) }));
const toP5Q = x => ({ x, sec: 'p5', kind: 'mc', head: `<p class="mute">Part 5 · ${TO_T5[x.t] || ''}: chọn từ / cụm điền vào chỗ trống.</p>`, q: esc(x.s).replace('-------', '<b>-------</b>'), opts: shuf(x.o), a: x.a, why: x.why });
const toP6Text = (x, cur) => `<div class="box"><p class="mute" style="margin:0">${esc(x.kind)}</p><b style="font-size:15px">${esc(x.title)}</b><p class="tdtap" style="font-size:16px;line-height:1.7;margin:8px 0 0">${esc(x.text).replace(/\{(\d)\}/g, (_, n) => +n - 1 === cur ? `<mark style="padding:1px 4px;border-radius:4px"><b>(${n})</b> -------</mark>` : `<b>(${n})</b> -------`)}</p></div>`;
const toP6Qs = x => x.gaps.map((g, i) => ({ x, sec: 'p6', kind: 'mc', head: '<p class="mute">Part 6: chọn phương án cho chỗ trống được tô. Có một chỗ phải chèn cả câu.</p>' + toP6Text(x, i), q: `Chỗ (${i + 1})`, opts: shuf(g.o), a: g.a, why: g.why }));
const toDocs = x => x.docs.map(d => `<div class="box"><b style="font-size:15px">${esc(d.title)}</b><p class="tdtap" style="font-size:16px;line-height:1.6;margin:6px 0 0;white-space:pre-line">${esc(d.text)}</p></div>`).join('');
const toP7Qs = x => x.qs.map((q, i) => ({ x, sec: 'p7', kind: 'mc', head: `<p class="mute">Part 7 · ${esc(x.kind)} · câu ${i + 1}/${x.qs.length}${x.docs.length > 1 ? ' · có câu phải đối chiếu nhiều văn bản' : ''}</p>`, q: esc(q.q), opts: shuf([q.a, ...q.w]), a: q.a, why: q.why, foot: toDocs(x) }));
// chọn bài: chưa làm / làm lâu nhất / sai nhiều trước
const toPick = (its, n) => { const R = toSt().r; return shuf(its).sort((a, b) => ((R[a.id] || {}).at || 0) - ((R[b.id] || {}).at || 0)).slice(0, n); };
const toGen = { p2: n => toPick(TO.p2, n).map(toP2Q), p3: n => toPick(TO.p3, n).flatMap(x => toTalkQs(x, 'p3')), p4: n => toPick(TO.p4, n).flatMap(x => toTalkQs(x, 'p4')),
  p5: n => toPick(TO.p5, n).map(toP5Q), p6: n => toPick(TO.p6, n).flatMap(toP6Qs), p7: n => toPick(TO.p7.filter(x => x.docs.length === 1), n).flatMap(toP7Qs), p7m: n => toPick(TO.p7.filter(x => x.docs.length > 1), n).flatMap(toP7Qs) };
// dạng Part 5 (content: t)
const TO_T5 = { form: 'Dạng từ', verb: 'Động từ (thì, bị động, V-ing / to V)', prep: 'Giới từ', conj: 'Liên từ, từ nối', pron: 'Đại từ, mệnh đề quan hệ', struct: 'So sánh, đảo ngữ', voc: 'Từ vựng, cụm từ' };
const TO_PRAC = { p2: 10, p3: 2, p4: 2, p5: 15, p6: 1, p7: 2 };
// ôn câu Part 5 làm sai gần nhất
const toWrong5 = () => TO.p5.filter(x => { const r = toSt().r[x.id]; return r && r.ok < r.n; });

// ---------- 📚 từ vựng công sở (hộp Leitner như 📒 Sổ lỗi: 1 → 3 → 7 → 16 → 35 ngày) ----------
const TO_VD = [1, 3, 7, 16, 35];
const toVocDue = () => { const V = toSt().voc, now = Date.now(); return TO.voc.flatMap(t => t.w.map(w => ({ t, w }))).filter(({ w }) => V[w[0]] && V[w[0]].box < TO_VD.length && V[w[0]].due <= now); };
const toVocKnown = () => Object.values(toSt().voc).filter(v => v.box >= 3).length;
function toVocRun(tid) { const V = toSt().voc, due = toVocDue(), T = tid ? TO.voc.find(t => t.id === tid) : null;
  const pool = T ? [...T.w.filter(w => V[w[0]] && V[w[0]].due <= Date.now() && V[w[0]].box < TO_VD.length).map(w => ({ t: T, w })), ...T.w.filter(w => !V[w[0]]).map(w => ({ t: T, w }))] : due;
  const items = shuf(pool).slice(0, 10); if (!items.length) return toast(T ? 'Chủ đề này đã học hết; chờ tới hạn ôn.' : 'Chưa có từ đến hạn ôn.');
  const qs = items.map(({ t, w }) => { const rev = Math.random() < 0.5, oth = shuf(t.w.filter(y => y !== w)).slice(0, 3);
    return rev ? { x: { id: 'v:' + w[0] }, w, sec: 'voc', kind: 'mc', head: `<p class="mute">${t.t} · chọn từ tiếng Anh</p>`, q: esc(w[1]), opts: shuf([w[0], ...oth.map(y => y[0])]), a: w[0], why: w[2], play: { key: 'v' + w[0], text: w[0] } }
      : { x: { id: 'v:' + w[0] }, w, sec: 'voc', kind: 'mc', head: `<p class="mute">${t.t} · chọn nghĩa đúng · ví dụ: ${esc(w[2])}</p>`, q: esc(w[0]), opts: shuf([w[1], ...oth.map(y => y[1])]), a: w[1], why: w[2], play: { key: 'v' + w[0], text: w[0] + '. ' + w[2] } }; });
  ieRun('📚 Từ vựng công sở', qs, toeicView, 0, { R: {}, home: 'Luyện TOEIC', done: res => { for (const r of res) { const k = r.q.w[0], o = V[k] || { box: 0 };
    if (r.ok) { o.box = Math.min(TO_VD.length, o.box + 1); o.due = Date.now() + TO_VD[o.box - 1] * 864e5; } else { o.box = 0; o.due = Date.now() + 864e5; } V[k] = o; } S.t = Date.now(); save(); } }); }

// ---------- 🎓 đề thử (khuôn mock.js; tỉ lệ các Part như đề thật, số câu ít hơn) ----------
const TO_PAPERS = [
  { t: '🎧 Nghe (Listening)', k: 'L', min: 20, gen: () => [...toGen.p2(10).map(q => ({ part: TO_SEC.p2[1], q })), ...toGen.p3(3).map(q => ({ part: TO_SEC.p3[1], q })), ...toGen.p4(3).map(q => ({ part: TO_SEC.p4[1], q }))] },
  { t: '📖 Đọc (Reading)', k: 'R', min: 30, gen: () => [...toGen.p5(15).map(q => ({ part: TO_SEC.p5[1], q })), ...toGen.p6(2).map(q => ({ part: TO_SEC.p6[1], q })), ...toGen.p7(2).map(q => ({ part: TO_SEC.p7[1], q })), ...toGen.p7m(1).map(q => ({ part: TO_SEC.p7[1] + ' (nhiều văn bản)', q }))] }];
async function toMock(idx) { $app.innerHTML = '<p class="mute">Đang tải…</p>'; await toLoad(); if (!NCLIPS.size) try { NCLIPS = new Set(await (await fetch('n/index.json?v=' + APP_V)).json()); } catch (e) {}
  MK = { lv: 'toeic', C: { name: 'TOEIC Listening & Reading (kiểu)' }, papers: [], idx, plays: 1, done: toMockResult, quit: toeicView };
  for (const i of idx) { const p = TO_PAPERS[i]; MK.papers.push({ t: p.t, k: p.k, min: p.min, qs: p.gen(), res: [] }); }
  if (!confirm(`${MK.C.name}: ${MK.papers.map(p => `${p.t} ${p.qs.length} câu, ${p.min} phút`).join(' · ')}. Bài nghe chỉ phát 1 lần như đề thật. Bắt đầu?`)) return toeicView();
  mkPaper(0); }
function toMockResult() { const b = {}, rows = []; toLog(MK.papers.flatMap(p => p.res), 'thi');   // 🗺 tomap.js: lịch sử theo dạng + lần thử (gồm đếm bẫy cũ)
  for (const p of MK.papers) { const ok = p.res.filter(r => r.ok).length; b[p.k] = toScale(ok, p.res.length);
    const by = {}; for (const r of p.res) { const o = by[r.part] = by[r.part] || [0, 0]; o[1]++; if (r.ok) o[0]++; } rows.push([p, ok, by]); }
  const full = b.L != null && b.R != null, tot = full ? b.L + b.R : null, tg = toSt().target; toSt().mock.push({ at: Date.now(), b, tot }); S.t = Date.now(); save();
  const wrong = MK.papers.flatMap(p => p.res.filter(r => !r.ok));
  $app.innerHTML = `<h1>🎓 Kết quả ${esc(MK.C.name)}</h1>
    <div class="box">${rows.map(([p, ok, by]) => `<p style="margin:4px 0"><b>${p.t}</b>: ≈ ${b[p.k]} <span class="mute">· ${ok}/${p.res.length} câu</span></p><p class="mute" style="margin:0 0 6px">${Object.entries(by).map(([k, [a, n]]) => `${esc(k)}: ${a}/${n}`).join(' · ')}</p>`).join('')}
      ${full ? `<p style="margin:8px 0 0;font-size:20px"><b>Tổng ≈ ${tot}</b> ${tot >= tg ? '✅' : '⬜'} <span class="mute" style="font-size:14px">(mục tiêu ${tg})</span></p>` : '<p class="mute">Chỉ làm một phần: chưa tính tổng.</p>'}
      <p class="mute" style="margin:6px 0 0">Điểm ước theo tỉ lệ đúng, KHÔNG phải bảng quy đổi của ETS (ETS quy đổi riêng từng đề). Đề app ít câu, chưa có Part 1. Ghi điểm đề thật ở ô 🎯 để app hiệu chỉnh.</p></div>
    ${wrong.length ? `<details class="box"><summary>Xem lại ${wrong.length} câu sai</summary>${wrong.map(r => `<div style="margin:8px 0;border-top:1px solid var(--line);padding-top:6px"><p class="mute" style="margin:0">${esc(r.part)}</p><p style="margin:2px 0">${r.q.q}</p>
      <p style="margin:2px 0">Bạn: ${esc(String(r.ans))} · Đáp án: <b>${esc(r.q.a)}</b></p>${r.q.why ? `<p class="mute" style="margin:0">${esc(r.q.why)}</p>` : ''}</div>`).join('')}</details>` : ''}
    <button class="pri" data-a="again">🎓 Làm đề mới</button><button data-a="home">← Luyện TOEIC</button>`; scrollTo(0, 0);
  $app.onclick = e => { if (e.target.closest('[data-a="again"]')) toMock(MK.idx); if (e.target.closest('[data-a="home"]')) toeicView(); }; }

// ---------- 📏 điểm ước + hiệu chỉnh bằng đề thật ----------
const toNear = (list, at, k) => list.filter(r => r.b && r.b[k] != null && Math.abs(r.at - at) <= 14 * 864e5).sort((a, b) => Math.abs(a.at - at) - Math.abs(b.at - at))[0];
function toNow() { const o = toSt(), last = o.mock[o.mock.length - 1], R = Object.values(o.r), pct = k => { const a = R.filter(r => TO_SEC[r.k] && TO_SEC[r.k][2] === k).sort((x, y) => y.at - x.at).slice(0, 8), n = a.reduce((s, r) => s + r.n, 0); return n >= 15 ? toScale(a.reduce((s, r) => s + r.ok, 0), n) : null; };
  const b = { L: last && last.b.L != null ? last.b.L : pct('L'), R: last && last.b.R != null ? last.b.R : pct('R') }, cal = {};
  for (const k of ['L', 'R']) { const ds = o.off.map(r => { const m = toNear(o.mock, r.at, k); return m ? r[k] - m.b[k] : null; }).filter(d => d != null).slice(-3);
    if (ds.length) { cal[k] = { d: ds.reduce((s, x) => s + x, 0) / ds.length, n: ds.length }; if (b[k] != null) b[k] = Math.max(5, Math.min(495, Math.round((b[k] + cal[k].d) / 5) * 5)); } }
  return { b, cal, tot: b.L != null && b.R != null ? b.L + b.R : null }; }
function toReady() { const o = toSt(), tg = o.target, base = toBase(tg), lvOf = id => ovIn(id, base) ? base : base.replace(/p$/, ''), found = ['tv', 'np'].map(id => [id, ovPassed(id, lvOf(id))]);
  const mk = o.mock.filter(r => r.tot != null).slice(-2), mOk = mk.length === 2 && mk.every(r => r.tot >= tg) && new Date(mk[0].at).toDateString() !== new Date(mk[1].at).toDateString();
  const off = o.off[o.off.length - 1], offOk = !!off && off.L + off.R >= tg, nv = TO.voc.reduce((s, t) => s + t.w.length, 0), kv = toVocKnown();
  return [[found.every(f => f[1]), `🧱 Nền CEFR ${LVN[base]}: Từ vựng và Ngữ pháp qua Thi chuyển cấp`, found.map(([id, ok]) => (ok ? '✅ ' : '⬜ ') + (id === 'tv' ? 'Từ vựng' : 'Ngữ pháp') + ' ' + LVN[lvOf(id)]).join(' · ')],
    [kv >= nv * 0.8, '📚 Từ vựng công sở: ≥ 80% từ nhớ vững (hộp 3 trở lên)', `${kv}/${nv} từ`],
    [mOk, `🎓 Đề thử app ≥ ${tg} hai lần liền, hai ngày khác nhau`, mk.length ? mk.map(r => r.tot).join(', ') : 'chưa làm'],
    [offOk, `📝 Đề luyện thật (sách ETS / đề mẫu chính thức) ≥ ${tg}`, off ? `L ${off.L} · R ${off.R} = ${off.L + off.R}` : 'chưa ghi']]; }
document.addEventListener('click', e => { const b = e.target.closest('[data-toadd]'); if (!b || !S) return; const ask = m => { const v = prompt(m, ''); if (v == null || v === '') return null; const n = parseInt(v, 10); if (!(n >= 5 && n <= 495)) { alert('Điểm mỗi phần 5–495 (theo bảng quy đổi trong sách đề).'); return null; } return Math.round(n / 5) * 5; };
  const L = ask('Đề luyện thật (sách ETS / đề mẫu chính thức), làm đủ giờ, quy đổi theo bảng của sách.\nĐiểm Listening (5–495)?'); if (L == null) return; const R = ask('Điểm Reading (5–495)?'); if (R == null) return;
  toSt().off.push({ at: Date.now(), L, R }); S.t = Date.now(); save(); toast(`Đã ghi ${L + R} điểm. App dùng để hiệu chỉnh điểm ước.`); toeicView(); });

// ---------- ▶ nên làm hôm nay ----------
function toToday() { const o = toSt(), acc = s => { const a = Object.values(o.r).filter(r => r.k === s), n = a.reduce((t, r) => t + r.n, 0); return n ? a.reduce((t, r) => t + r.ok, 0) / n : -1; }, last = (o.mock[o.mock.length - 1] || {}).at || 0;
  if (toVocDue().length) return ['data-tovoc=""', `📚 Ôn ${Math.min(10, toVocDue().length)} từ công sở đến hạn`];
  if (typeof tmFocus === 'function') { const d = dayOf(Date.now()), w = tmFocus().act.find(w => w.td !== d); if (w) return [`data-tm="fix|${w.u}"`, `🗺 Chữa chỗ yếu: ${TM_SK[w.sk].split(' ')[0]} ${w.t}`]; }   // v86: bản đồ điểm cấp việc cho ô Hôm nay
  if (Object.keys(o.r).length >= 8 && Date.now() - last > 14 * 864e5) return ['data-tomk="all"', '🎓 Làm một đề thử (2 tuần chưa làm)'];
  const s = Object.keys(TO_PRAC).sort((a, b) => acc(a) - acc(b))[0], tg5 = toTagAcc().filter(t => t.n >= 4).sort((a, b) => a.p - b.p)[0];
  if (s === 'p5' && tg5) return [`data-top="t:${tg5.t}"`, `✏️ Part 5 · ${TO_T5[tg5.t]} (đúng ${Math.round(tg5.p * 100)}%, dạng yếu nhất)`];
  return [`data-top="${s}"`, `${TO_SEC[s][0]} Luyện ${TO_SEC[s][1]}${acc(s) < 0 ? ' (chưa làm)' : ` (đúng ${Math.round(acc(s) * 100)}%)`}`]; }

// ---------- v73: phân tích điểm yếu, tốc độ, nơi tăng điểm nhanh nhất, ngày thi ----------
// Part 5 theo dạng: % đúng lần làm gần nhất của các câu mỗi dạng
const toTagAcc = () => Object.keys(TO_T5).map(t => { const its = TO.p5.filter(x => x.t === t), R = toSt().r; let ok = 0, n = 0; for (const x of its) { const r = R[x.id]; if (r) { ok += r.ok; n += r.n; } } return { t, ok, n, p: n ? ok / n : 0, tot: its.length }; });
// bẫy Part 2 đã mắc (đếm từ luyện và đề thử)
function toTrapLog(res) { const T = toSt().trap; for (const r of res) { const x = r.q && r.q.x; if (!x || r.q.sec !== 'p2' || r.ok || !x.tr) continue; const t = x.tr['ABC'.indexOf(r.ans)]; if (t) T[t] = (T[t] || 0) + 1; } }
// nơi tăng điểm nhanh nhất: số câu mỗi Part trong đề thật × phần còn có thể đúng thêm (tối đa +20 điểm %) × ~4,9 điểm / câu (thang 495 / 100 câu)
const TO_REAL = { p2: 25, p3: 39, p4: 30, p5: 30, p6: 16, p7: 54 };
function toGain() { const R = Object.values(toSt().r); return Object.keys(TO_REAL).map(s => { const a = R.filter(r => r.k === s), n = a.reduce((t, r) => t + r.n, 0), p = n ? a.reduce((t, r) => t + r.ok, 0) / n : null;
  return { s, n, p, g: p == null ? null : Math.round(Math.min(0.2, 1 - p) * TO_REAL[s] * 4.9 / 5) * 5 }; }).filter(x => x.n >= 5).sort((a, b) => b.g - a.g); }
// tốc độ: luyện có đồng hồ từng câu (Part 5: 20 giây; Part 7: 60 giây, tính cả thời gian đọc)
const TO_SPD = { p5: [20, 15], p7: [60, 2] };
function toSpeed(s) { const [sec, n] = TO_SPD[s], qs = s === 'p5' ? toGen.p5(n) : toGen.p7(n);
  ieRun(`⏱ ${TO_SEC[s][1]} · ${sec} giây / câu`, qs, toeicView, 0, { R: toSt().r, home: 'Luyện TOEIC', spd: sec,
    endHtml: res => { const avg = res.reduce((t, r) => t + r.secs, 0) / Math.max(1, res.length), over = res.filter(r => r.secs > sec).length;
      return `<div class="box"><b>⏱ Trung bình ${avg.toFixed(1)} giây / câu</b> ${avg <= sec ? '✅' : '⚠️'} <span class="mute">(mục tiêu ≤ ${sec})</span><p class="mute" style="margin:4px 0 0">${over} câu quá giờ. ${avg > sec ? (s === 'p5' ? 'Nhìn 4 phương án trước: cùng gốc khác đuôi thì chỉ cần xem vị trí từ, không cần đọc hết câu.' : 'Đọc câu hỏi trước, rồi tìm từ khoá trong bài; đừng đọc kỹ cả bài.') : 'Giữ nhịp này, thi thật còn dư giờ cho Part 7.'}</p></div>`; },
    done: (res, fr) => { const avg = Math.round(res.reduce((t, r) => t + r.secs, 0) / Math.max(1, res.length) * 10) / 10, ok = res.filter(r => r.ok).length; toSt().spd.push({ at: Date.now(), s, avg, ok, n: res.length });
      toLog(res, 'luyen', fr); tmHit('spd:' + s, avg <= sec && ok / Math.max(1, res.length) >= toTh()); S.t = Date.now(); save(); } }); }
function toInsights() { const o = toSt(), tags = toTagAcc().filter(t => t.n), gain = toGain().slice(0, 3), traps = Object.entries(o.trap).sort((a, b) => b[1] - a[1]), sp = s => o.spd.filter(r => r.s === s).slice(-1)[0];
  const wk = o.date ? Math.max(0, Math.ceil((new Date(o.date + 'T12:00:00') - Date.now()) / (7 * 864e5))) : null, now = toNow();
  return `<div class="box"><b>🔍 Phân tích điểm yếu</b>
    <div class="row" style="margin-top:6px;gap:8px"><label class="mute" style="font-size:14px">Ngày thi<input type="date" id="todate" value="${esc(o.date || '')}" style="margin:2px 0"></label>
      <span>${wk != null ? `Còn <b>${wk} tuần</b>${now.tot != null ? ` · cách mục tiêu <b>${Math.max(0, o.target - now.tot)}</b> điểm` : ''}` : '<span class="mute">Chọn ngày thi để đếm tuần còn lại.</span>'}</span></div>
    <p style="margin:10px 0 2px"><b>🚀 Tăng điểm nhanh nhất ở đâu</b></p>${gain.length ? gain.map(x => `<p style="margin:2px 0">${TO_SEC[x.s][0]} ${TO_SEC[x.s][1]}: đúng ${Math.round(x.p * 100)}% → nếu thêm ${Math.round(Math.min(0.2, 1 - x.p) * 100)}% ≈ <b>+${x.g} điểm</b> <span class="mute">(đề thật ${TO_REAL[x.s]} câu)</span></p>`).join('')
      : '<p class="mute" style="margin:2px 0">Luyện ít nhất 5 câu mỗi Part để app tính.</p>'}<p class="mute" style="margin:2px 0 0">Ước theo số câu mỗi Part trong đề thật, ~4,9 điểm / câu; không phải bảng ETS.${wk != null && gain.length ? ` Gợi ý mỗi tuần: 3 buổi ${TO_SEC[gain[0].s][1]}${gain[1] ? `, 2 buổi ${TO_SEC[gain[1].s][1]}` : ''}, 1 đề thử, từ vựng mỗi ngày; mỗi 4 tuần 1 đề thật.` : ''}</p>
    ${tags.length ? `<p style="margin:10px 0 2px"><b>✏️ Part 5 theo dạng</b> <span class="mute">(lần làm gần nhất mỗi câu)</span></p>${tags.sort((a, b) => a.p - b.p).map(t => `<div class="row" style="margin:2px 0"><button class="link" data-top="t:${t.t}" style="text-align:left">${TO_T5[t.t]}</button><span class="${t.p >= 0.8 ? 'okc' : 'mute'}">${Math.round(t.p * 100)}% · ${t.n} câu</span></div>${bar(Math.round(t.p * 100), 80, t.p >= 0.8 ? 'var(--good)' : 'var(--accent)')}`).join('')}<p class="mute" style="margin:2px 0 0">Bấm tên dạng để luyện riêng dạng đó.</p>` : ''}
    ${traps.length ? `<p style="margin:10px 0 2px"><b>🪤 Bẫy Part 2 bạn hay mắc</b></p>${traps.map(([t, n]) => `<p style="margin:2px 0">${TO_TRAP[t][0]}: <b>${n}</b> lần <span class="mute">· ${TO_TRAP[t][1]}</span></p>`).join('')}` : ''}
    <p style="margin:10px 0 2px"><b>⏱ Tốc độ</b></p><div class="duo">${Object.entries(TO_SPD).map(([s, [sec]]) => { const r = sp(s); return `<button class="big2" data-tospd="${s}">${TO_SEC[s][1].replace(/: .*/, '')} · ${sec}s/câu<small>${r ? `lần trước ${r.avg}s, đúng ${r.ok}/${r.n}` : 'chưa làm'}</small></button>`; }).join('')}</div></div>`; }
document.addEventListener('change', e => { if (!S || !e.target.closest('#todate')) return; toSt().date = e.target.value || null; S.t = Date.now(); save(); toeicView(); });

// ---------- màn chính ----------
// chuyển giữa 🌏 IELTS và 💼 TOEIC trong mục 🎓 Luyện thi (nhớ lựa chọn: S.exSel)
const exSwitch = cur => `<div class="chips" style="margin:4px 0 8px"><button class="chip ${cur === 'ielts' ? 'on' : ''}" data-exsel="ielts">🌏 IELTS</button><button class="chip ${cur === 'toeic' ? 'on' : ''}" data-exsel="toeic">💼 TOEIC</button></div>`;
const exOpen = () => S && S.exSel === 'toeic' ? toeicView() : ieltsView();
document.addEventListener('click', e => { const b = e.target.closest('[data-exsel]'); if (!b || !S) return; S.exSel = b.dataset.exsel; S.t = Date.now(); save(); scrollTo(0, 0); exOpen(); });
async function toeicView() { BACK = null; window.CUR = { view: 'toeic' }; EXAM_VOX = false;
  if (!TO || !KIT.np.items) { $app.innerHTML = '<div id="ie"></div><p class="mute">Đang tải…</p>'; try { await Promise.all([toLoad(), kLoad(KIT.np)]); } catch (e) { $app.innerHTML = '<div id="ie"></div><p>Không tải được dữ liệu TOEIC. Thử lại sau.</p>'; return; } }
  const o = toSt(), tg = o.target, now = toNow(), cs = toReady(), nOk = cs.filter(c => c[0]).length, [act, lab] = toToday(), base = toBase(tg), w5 = toWrong5().length, nv = TO.voc.reduce((s, t) => s + t.w.length, 0);
  const cell = (k, n) => `<div class="box" style="margin:0;text-align:center"><div class="mute" style="font-size:13px">${n}</div><div style="font-size:22px;font-weight:800">${now.b[k] != null ? '≈ ' + now.b[k] : '–'}</div><div class="mute" style="font-size:11px">${now.cal[k] ? `📏 đã chỉnh (${now.cal[k].n})` : 'chưa chỉnh'}</div></div>`;
  const sec = s => { const a = Object.values(o.r).filter(r => r.k === s), n = a.reduce((t, r) => t + r.n, 0); return `<button class="big2" data-top="${s}">${TO_SEC[s][0]} ${TO_SEC[s][1].replace(/^Part \d: /, '')}<small>${TO_SEC[s][1].match(/^Part \d/)[0]}${n ? ` · đúng ${Math.round(a.reduce((t, r) => t + r.ok, 0) / n * 100)}%` : ''}</small></button>`; };
  $app.innerHTML = `<div id="ie"></div>${exSwitch('toeic')}<h1>💼 Luyện TOEIC</h1><p class="mute"><span id="sync">${esc(sync)}</span></p>
    <details class="box"><summary><b>⚙️ Điểm mục tiêu: ${tg}</b> <span class="mute">(tổng 10–990)</span></summary><div class="chips">${TO_TG.map(t => `<button class="chip ${t === tg ? 'on' : ''}" data-totg="${t}">${t}</button>`).join('')}</div></details>
    <div class="box"><div class="row"><b>📊 Điểm ước hiện tại</b><span class="${now.tot != null && now.tot >= tg ? 'okc' : 'mute'}">${now.tot != null ? 'Tổng ≈ ' + now.tot : 'chưa đủ số đo'}</span></div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-top:8px">${cell('L', '🎧 Listening')}${cell('R', '📖 Reading')}</div>
      <p class="mute" style="margin:6px 0 0">Lấy từ đề thử gần nhất; chưa có thì từ bài luyện. Ước theo tỉ lệ đúng, không phải bảng ETS. 📏 = đã chỉnh theo đề thật bạn nhập (so đề thử app trong 14 ngày).</p>
      <button class="pri" ${act} style="margin-top:8px">▶ Nên làm hôm nay: ${esc(lab)}</button></div>
    <button data-cnv>📘 Cẩm nang thi: mẹo Nghe · Đọc, bẫy Part 2, từ công sở</button>
    <details class="box"><summary><b>🗺 Bản đồ điểm & phân tích</b> <span class="mute">· chỗ làm mất điểm</span></summary>${tmBox()}${toInsights()}</details>
    <div class="box"><b>🧱 Nền cần có: CEFR ${LVN[base]}</b><p class="mute" style="margin:6px 0">Suy từ bảng ETS (Nghe B1 ≥ 275, B2 ≥ 400, C1 ≥ 490; Đọc B1 ≥ 275, B2 ≥ 385, C1 ≥ 455; nên đối chiếu tài liệu ETS). ${tg} điểm ≈ mỗi phần ${tg / 2}.</p>
      <p style="margin:4px 0">${cs[0][2]}</p><button data-iecefr="${base}">🎯 Mở Học CEFR cấp ${LVN[base]}</button></div>
    <div class="box"><div class="row"><b>🎓 Đề thử TOEIC</b><span class="mute">${o.mock.length ? `đã làm ${o.mock.length} lần` : 'chưa làm'}</span></div>
      <p class="mute" style="margin:6px 0">Tỉ lệ các Part như đề thật, ít câu hơn (đề thật 200 câu / 120 phút). Nghe 1 lần, không báo đúng / sai giữa chừng.</p>
      ${TO_PAPERS.map((p, i) => `<button data-tomk="${i}">${p.t} · ${p.min} phút</button>`).join('')}<button class="pri" data-tomk="all">▶ Làm cả đề</button></div>
    <details class="box"><summary><b>🎧 Nghe (Listening)</b></summary><p class="mute" style="margin:4px 0">Giọng Mỹ và Anh tự nhiên. Chưa có Part 1 (tả ảnh).</p><div class="duo">${['p2', 'p3', 'p4'].map(sec).join('')}</div>${toHow('L')}</details>
    <details class="box"><summary><b>📖 Đọc (Reading)</b></summary><div class="duo">${['p5', 'p6', 'p7'].map(sec).join('')}<button class="big2" data-top="p7m">📑 Nhiều văn bản<small>Part 7, đối chiếu</small></button></div>
      ${w5 ? `<button data-top="w5">🔁 Làm lại ${Math.min(15, w5)} câu Part 5 từng sai</button>` : ''}${toHow('R')}</details>
    <div class="box"><div class="row"><b>📚 Từ vựng công sở</b><span class="mute">${toVocKnown()}/${nv} nhớ vững</span></div><p class="mute" style="margin:4px 0">${TO.voc.length} chủ đề, ôn cách quãng 1 → 35 ngày.${toVocDue().length ? ` <b>${toVocDue().length} từ đến hạn.</b>` : ''}</p>
      <div class="chips">${TO.voc.map(t => { const n = t.w.filter(w => o.voc[w[0]]).length; return `<button class="chip" data-tovoc="${t.id}">${t.t} ${n}/${t.w.length}</button>`; }).join('')}</div></div>
    <details class="box"><summary><b>🎯 Sẵn sàng thi ${tg}</b> <span class="${nOk === cs.length ? 'okc' : 'mute'}">${nOk}/${cs.length}</span></summary>
      ${cs.map(([ok, t, d]) => `<p style="margin:4px 0">${ok ? '✅' : '⬜'} ${t} <span class="mute">· ${esc(d)}</span></p>`).join('')}
      <p class="mute" style="margin:6px 0 0">Đủ cả 4 mới nên đăng ký thi. Đề của app do AI soạn; đề luyện thật (sách ETS) là bằng chứng độc lập.</p>
      <button class="chip" data-toadd>📝 Ghi điểm đề luyện thật (Listening, Reading)</button></details>
    <p class="mute">TOEIC là thương hiệu của ETS; app không phải sản phẩm chính thức, không chép đề ETS. 🤖 Nội dung AI soạn, chưa giáo viên kiểm (thấy câu sai: 💬 → ⚑ Câu sai). Không tính vào 🎯 Học CEFR. Đăng ký thi tại Việt Nam: IIG Việt Nam (đại diện ETS).</p>`;
  $app.onclick = e => { const g = s => e.target.closest(s); let b;
    if ((b = g('[data-totg]'))) { o.target = +b.dataset.totg; S.t = Date.now(); save(); return toeicView(); }
    if ((b = g('[data-iecefr]'))) { scrollTo(0, 0); return overview(b.dataset.iecefr); }
    if ((b = g('[data-tomk]'))) return toMock(b.dataset.tomk === 'all' ? [0, 1] : [+b.dataset.tomk]);
    if ((b = g('[data-tovoc]'))) { scrollTo(0, 0); return toVocRun(b.dataset.tovoc); }
    if ((b = g('[data-tospd]'))) { scrollTo(0, 0); return toSpeed(b.dataset.tospd); }
    if ((b = g('[data-top]'))) { const s = b.dataset.top; scrollTo(0, 0); if (!NCLIPS.size) fetch('n/index.json?v=' + APP_V).then(r => r.json()).then(k => { NCLIPS = new Set(k); }).catch(() => {});
      if (s.startsWith('t:')) { const t = s.slice(2), qs = toPick(TO.p5.filter(x => x.t === t), 15).map(toP5Q); return ieRun('✏️ Part 5 · ' + TO_T5[t], qs, toeicView, 0, { R: o.r, home: 'Luyện TOEIC', done: (res, fr) => toLog(res, 'luyen', fr) }); }
      const qs = s === 'w5' ? shuf(toWrong5()).slice(0, 15).map(toP5Q) : toGen[s](s === 'p7m' ? 1 : TO_PRAC[s]); if (!qs.length) return toast('Chưa có bài.');
      return ieRun((TO_SEC[s] || ['📑', s === 'w5' ? 'Làm lại câu sai' : 'Part 7: nhiều văn bản'])[0] + ' ' + (TO_SEC[s] ? TO_SEC[s][1] : s === 'w5' ? 'Làm lại câu sai' : 'Part 7: nhiều văn bản'), qs, toeicView, 0, { R: o.r, home: 'Luyện TOEIC', done: (res, fr) => toLog(res, 'luyen', fr) }); } }; }
const toHow = k => `<details style="margin-top:6px"><summary>📘 Cách làm</summary>${TO_HOW[k][1].map(s => `<p style="margin:2px 0;font-size:15px">• ${esc(s)}</p>`).join('')}</details>`;
toLoad().catch(() => {});
