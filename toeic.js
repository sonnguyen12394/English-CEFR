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
const TO_SEC = { p1: ['🖼', 'Part 1: Tả tranh', 'L'], p2: ['🗣', 'Part 2: Hỏi – đáp', 'L'], p3: ['👥', 'Part 3: Hội thoại', 'L'], p4: ['📢', 'Part 4: Bài nói ngắn', 'L'], p5: ['✏️', 'Part 5: Điền câu', 'R'], p6: ['📝', 'Part 6: Điền đoạn văn', 'R'], p7: ['📰', 'Part 7: Đọc hiểu', 'R'] };
const TO_HOW = {
  L: ['🎧 Nghe', ['Đề thật chỉ phát mỗi bài một lần. Dùng lúc đọc hướng dẫn để xem trước câu hỏi Part 3–4.', 'Part 2: nghe kỹ từ hỏi đầu câu (When, Where, Who, Why…). Bẫy hay gặp: lời đáp lặp lại từ trong câu hỏi hoặc từ phát âm gần giống ("copy" – "coffee").',
    'Part 1: nhìn tranh trước khi nghe (ai, đang làm gì, vật ở đâu). "Is being + V3" = đang có người làm việc đó; "has been + V3" = đã xong, tranh không cần có người. Câu nói về người khi tranh không có người là sai.', 'Part 2 có lời đáp gián tiếp đúng ("I\'m not sure, ask Tom"), không nhất thiết trả lời thẳng.', 'Part 3–4: câu hỏi theo thứ tự lời nói; trả lời ngay khi nghe được, không chờ hết bài.',
    'Câu "Look at the graphic": nhìn bảng trước khi nghe. Bài nói thường nhắc cột này (giờ, số người, tên phòng…), còn đáp án nằm ở cột kia; đừng chọn ngay ô được đọc lên.', 'Hội thoại 3 người: câu hỏi gọi tên ("What does Lisa say…?") hoặc "the man" khi chỉ có một nam; nhớ ai nói gì theo giọng.']],
  R: ['📖 Đọc', ['75 phút cho 100 câu: Part 5 khoảng 20 giây một câu, để dành thời gian cho Part 7.', 'Part 5: nhìn 4 phương án trước. Cùng gốc khác đuôi (-tion, -ive, -ly) → câu hỏi dạng từ: xem vị trí cần danh từ, tính từ hay trạng từ.',
    'Part 6: câu chèn phải nối ý câu trước và câu sau; đọc cả đoạn, không chỉ câu chứa chỗ trống.', 'Part 7 nhiều văn bản: câu hỏi "đối chiếu" cần thông tin từ 2 văn bản (vd. số người trong đơn + số bàn trong quảng cáo).']] };

// ---------- câu hỏi (khuôn chung với ieRun / mkPaper: { x, sec, kind, head, q, opts, a, why, play }) ----------
const TO_LH = '<p class="mute">🎧 Nghe rồi chọn. Đề thật chỉ nghe 1 lần (đề thử của app cũng vậy); luyện được nghe 2 lần.</p>';
// v73: Part 2 hiện lời bài kèm loại bẫy của từng lời đáp sai (content: tr)
const TO_TRAP = { rep: ['Lặp từ / từ gần âm', 'Lời đáp dùng lại từ (hoặc từ nghe giống) trong câu hỏi nhưng không trả lời.'], type: ['Sai loại thông tin', 'Câu hỏi hỏi một loại thông tin (khi nào, ở đâu, ai…) nhưng lời đáp nói loại khác.'],
  yn: ['Yes / No cho câu Wh-', 'Câu hỏi When, Where, Why… không trả lời bằng Yes / No.'], rel: ['Cùng chủ đề, không trả lời', 'Nghe có vẻ liên quan nhưng không trả lời điều được hỏi.'] };
// v127 Part 1: tranh vẽ đơn giản (SVG: nền + khối + emoji) thay ảnh chụp của đề thật; khung 320 × 200 (content/toeic/p1.json)
const TO_BG = { in: ['#efe9df', '#d8c6aa', 140], out: ['#dcefff', '#cfe5bf', 125], sea: ['#dcefff', '#8ec9ea', 120] };
const toPic = p => { const [sky, gr, h] = TO_BG[p.bg] || TO_BG.in;
  return `<svg class="topic" viewBox="0 0 320 200" role="img" aria-label="Tranh Part 1" style="width:100%;max-width:420px;display:block;margin:6px auto;border-radius:12px;background:${sky}"><rect x="0" y="${h}" width="320" height="${200 - h}" fill="${gr}"/>${(p.r || []).map(([x, y, w, hh, c]) => `<rect x="${x}" y="${y}" width="${w}" height="${hh}" rx="2" fill="${c}"/>`).join('')}${(p.e || []).map(([t, x, y, s]) => `<text x="${x}" y="${y}" font-size="${s}" text-anchor="middle" dominant-baseline="central">${t}</text>`).join('')}</svg>`; };
const toP1Q = x => ({ x, sec: 'p1', kind: 'mc', head: TO_LH + '<p class="mute">Part 1: nhìn tranh, nghe 4 câu (đề thật không in chữ), chọn câu tả đúng nhất.</p>' + toPic(x.pic), q: 'Câu nào tả đúng tranh?', opts: ['A', 'B', 'C', 'D'], a: 'ABCD'[x.a],
  play: { key: x.id, lines: x.lines }, why: x.o.map((t, i) => `${'ABCD'[i]}. ${t} ${i === x.a ? '✅' : '❌'}`).join(' · ') + ' · ' + x.why });
const toP2Q = x => ({ x, sec: 'p2', kind: 'mc', head: TO_LH + '<p class="mute">Part 2: nghe câu hỏi và 3 lời đáp (đề thật không in chữ). Chọn lời đáp hợp nhất.</p>', q: 'Lời đáp nào đúng?', opts: ['A', 'B', 'C'], a: 'ABC'[x.a],
  play: { key: x.id, lines: x.lines }, why: x.q + ' → ' + x.o.map((t, i) => `${'ABC'[i]}. ${t} ${i === x.a ? '✅' : '❌ ' + (x.tr ? TO_TRAP[x.tr[i]][0] : '')}`).join(' · ') });
// bảng / biểu đồ in trong đề cho câu "Look at the graphic" (content: g, v124); hiện ở cả 3 câu như đề thật
const toGraph = g => `<div class="box" style="overflow-x:auto"><b style="font-size:15px">${esc(g.t)}</b><table class="tograph" style="width:100%;border-collapse:collapse;margin-top:6px;font-size:15px"><tr>${g.h.map(c => `<th style="text-align:left;padding:4px 6px">${esc(c)}</th>`).join('')}</tr>${g.r.map(r => `<tr style="border-top:1px solid var(--line)">${r.map(c => `<td style="padding:4px 6px">${esc(c)}</td>`).join('')}</tr>`).join('')}</table></div>`;
const toTalkQs = (x, sec) => x.qs.map((q, i) => ({ x, sec, kind: 'mc', head: TO_LH + (x.g ? toGraph(x.g) : '') + `<div class="box"><p class="mute" style="margin:0">Câu ${i + 1}/${x.qs.length} của bài này${x.lines && new Set(x.lines.map(l => l[0])).size > 2 ? ' · 3 người nói' : ''}</p></div>`, q: esc(q.q), opts: shuf([q.a, ...q.w]), a: q.a,
  play: x.lines ? { key: x.id, lines: x.lines } : { key: x.id, text: x.text }, why: 'Lời bài: ' + (x.lines ? x.lines.map(l => l[1]).join(' ') : x.text) }));
const toP5Q = x => ({ x, sec: 'p5', kind: 'mc', head: `<p class="mute">Part 5 · ${TO_T5[x.t] || ''}: chọn từ / cụm điền vào chỗ trống.</p>`, q: esc(x.s).replace('-------', '<b>-------</b>'), opts: shuf(x.o), a: x.a, why: x.why });
const toP6Text = (x, cur) => `<div class="box"><p class="mute" style="margin:0">${esc(x.kind)}</p><b style="font-size:15px">${esc(x.title)}</b><p class="tdtap" style="font-size:16px;line-height:1.7;margin:8px 0 0">${esc(x.text).replace(/\{(\d)\}/g, (_, n) => +n - 1 === cur ? `<mark style="padding:1px 4px;border-radius:4px"><b>(${n})</b> -------</mark>` : `<b>(${n})</b> -------`)}</p></div>`;
const toP6Qs = x => x.gaps.map((g, i) => ({ x, sec: 'p6', kind: 'mc', head: '<p class="mute">Part 6: chọn phương án cho chỗ trống được tô. Có một chỗ phải chèn cả câu.</p>' + toP6Text(x, i), q: `Chỗ (${i + 1})`, opts: shuf(g.o), a: g.a, why: g.why }));
const toDocs = x => x.docs.map(d => `<div class="box"><b style="font-size:15px">${esc(d.title)}</b><p class="tdtap" style="font-size:16px;line-height:1.6;margin:6px 0 0;white-space:pre-line">${esc(d.text)}</p></div>`).join('');
const toP7Qs = x => x.qs.map((q, i) => ({ x, sec: 'p7', kind: 'mc', head: `<p class="mute">Part 7 · ${esc(x.kind)} · câu ${i + 1}/${x.qs.length}${x.docs.length > 1 ? ' · có câu phải đối chiếu nhiều văn bản' : ''}</p>`, q: esc(q.q), opts: shuf([q.a, ...q.w]), a: q.a, why: q.why, foot: toDocs(x) }));
// chọn bài: chưa làm / làm lâu nhất / sai nhiều trước
const toPick = (its, n) => { const R = toSt().r; return shuf(its).sort((a, b) => ((R[a.id] || {}).at || 0) - ((R[b.id] || {}).at || 0)).slice(0, n); };
const toGen = { p1: n => toPick(TO.p1 || [], n).map(toP1Q), p2: n => toPick(TO.p2, n).map(toP2Q), p3: n => toPick(TO.p3, n).flatMap(x => toTalkQs(x, 'p3')), p4: n => toPick(TO.p4, n).flatMap(x => toTalkQs(x, 'p4')),
  p5: n => toPick(TO.p5, n).map(toP5Q), p6: n => toPick(TO.p6, n).flatMap(toP6Qs), p7: n => toPick(TO.p7.filter(x => x.docs.length === 1), n).flatMap(toP7Qs), p7m: n => toPick(TO.p7.filter(x => x.docs.length > 1), n).flatMap(toP7Qs) };
// dạng Part 5 (content: t)
const TO_T5 = { form: 'Dạng từ', verb: 'Động từ (thì, bị động, V-ing / to V)', prep: 'Giới từ', conj: 'Liên từ, từ nối', pron: 'Đại từ, mệnh đề quan hệ', struct: 'So sánh, đảo ngữ', voc: 'Từ vựng, cụm từ' };
const TO_PRAC = { p1: 6, p2: 10, p3: 2, p4: 2, p5: 15, p6: 1, p7: 2 };
// ôn câu Part 5 làm sai gần nhất
const toWrong5 = () => TO.p5.filter(x => { const r = toSt().r[x.id]; return r && r.ok < r.n; });

// ---------- 📚 từ vựng công sở (hộp Leitner như 📒 Sổ lỗi: 1 → 3 → 7 → 16 → 35 ngày) ----------
const TO_VD = [1, 3, 7, 16, 35];
const toVocDue = () => { const V = toSt().voc, now = Date.now(); return TO.voc.flatMap(t => t.w.map(w => ({ t, w }))).filter(({ w }) => V[w[0]] && V[w[0]].box < TO_VD.length && V[w[0]].due <= now); };
const toVocKnown = () => Object.values(toSt().voc).filter(v => v.box >= 3).length;
function toVocRun(tid, back = toeicView) { const V = toSt().voc, due = toVocDue(), T = tid ? TO.voc.find(t => t.id === tid) : null;
  const pool = T ? [...T.w.filter(w => V[w[0]] && V[w[0]].due <= Date.now() && V[w[0]].box < TO_VD.length).map(w => ({ t: T, w })), ...T.w.filter(w => !V[w[0]]).map(w => ({ t: T, w }))] : due;
  const items = shuf(pool).slice(0, 10); if (!items.length) return toast(T ? 'Chủ đề này đã học hết; chờ tới hạn ôn.' : 'Chưa có từ đến hạn ôn.');
  const qs = items.map(({ t, w }) => { const rev = Math.random() < 0.5, oth = shuf(t.w.filter(y => y !== w)).slice(0, 3);
    return rev ? { x: { id: 'v:' + w[0] }, w, sec: 'voc', kind: 'mc', head: `<p class="mute">${t.t} · chọn từ tiếng Anh</p>`, q: esc(w[1]), opts: shuf([w[0], ...oth.map(y => y[0])]), a: w[0], why: w[2], play: { key: 'v' + w[0], text: w[0] } }
      : { x: { id: 'v:' + w[0] }, w, sec: 'voc', kind: 'mc', head: `<p class="mute">${t.t} · chọn nghĩa đúng · ví dụ: ${esc(w[2])}</p>`, q: esc(w[0]), opts: shuf([w[1], ...oth.map(y => y[1])]), a: w[1], why: w[2], play: { key: 'v' + w[0], text: w[0] + '. ' + w[2] } }; });
  ieRun('📚 Từ vựng công sở', qs, back, 0, { R: {}, home: 'TOEIC', done: res => { for (const r of res) { const k = r.q.w[0], o = V[k] || { box: 0 };
    if (r.ok) { o.box = Math.min(TO_VD.length, o.box + 1); o.due = Date.now() + TO_VD[o.box - 1] * 864e5; } else { o.box = 0; o.due = Date.now() + 864e5; } V[k] = o; } S.t = Date.now(); save(); } }); }

// ---------- 🎓 đề thử (khuôn mock.js; tỉ lệ các Part như đề thật, số câu ít hơn) ----------
const TO_PAPERS = [
  { t: '🎧 Nghe (Listening)', k: 'L', min: 20, gen: () => [...toGen.p1(3).map(q => ({ part: TO_SEC.p1[1], q })), ...toGen.p2(10).map(q => ({ part: TO_SEC.p2[1], q })), ...toGen.p3(3).map(q => ({ part: TO_SEC.p3[1], q })), ...toGen.p4(3).map(q => ({ part: TO_SEC.p4[1], q }))] },
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
  return [[found.every(f => f[1]), `🧱 Nền tiếng Anh ${LVN[base]}: Từ vựng và Ngữ pháp qua Thi chuyển cấp`, found.map(([id, ok]) => (ok ? '✅ ' : '⬜ ') + (id === 'tv' ? 'Từ vựng' : 'Ngữ pháp') + ' ' + LVN[lvOf(id)]).join(' · ')],
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
const TO_REAL = { p1: 6, p2: 25, p3: 39, p4: 30, p5: 30, p6: 16, p7: 54 };
function toGain() { const R = Object.values(toSt().r); return Object.keys(TO_REAL).map(s => { const a = R.filter(r => r.k === s), n = a.reduce((t, r) => t + r.n, 0), p = n ? a.reduce((t, r) => t + r.ok, 0) / n : null;
  return { s, n, p, g: p == null ? null : Math.round(Math.min(0.2, 1 - p) * TO_REAL[s] * 4.9 / 5) * 5 }; }).filter(x => x.n >= 5).sort((a, b) => b.g - a.g); }
// tốc độ: luyện có đồng hồ từng câu (Part 5: 20 giây; Part 7: 60 giây, tính cả thời gian đọc)
const TO_SPD = { p5: [20, 15], p7: [60, 2] };
function toSpeed(s, back = toeicView) { const [sec, n] = TO_SPD[s], qs = s === 'p5' ? toGen.p5(n) : toGen.p7(n);
  ieRun(`⏱ ${TO_SEC[s][1]} · ${sec} giây / câu`, qs, back, 0, { R: toSt().r, home: 'TOEIC', spd: sec,
    endHtml: res => { const avg = res.reduce((t, r) => t + r.secs, 0) / Math.max(1, res.length), over = res.filter(r => r.secs > sec).length;
      return `<div class="box"><b>⏱ Trung bình ${avg.toFixed(1)} giây / câu</b> ${avg <= sec ? '✅' : '⚠️'} <span class="mute">(mục tiêu ≤ ${sec})</span><p class="mute" style="margin:4px 0 0">${over} câu quá giờ. ${avg > sec ? (s === 'p5' ? 'Nhìn 4 phương án trước: cùng gốc khác đuôi thì chỉ cần xem vị trí từ, không cần đọc hết câu.' : 'Đọc câu hỏi trước, rồi tìm từ khoá trong bài; đừng đọc kỹ cả bài.') : 'Giữ nhịp này, thi thật còn dư giờ cho Part 7.'}</p></div>`; },
    done: (res, fr) => { const avg = Math.round(res.reduce((t, r) => t + r.secs, 0) / Math.max(1, res.length) * 10) / 10, ok = res.filter(r => r.ok).length; toSt().spd.push({ at: Date.now(), s, avg, ok, n: res.length });
      toLog(res, 'luyen', fr); tmHit('spd:' + s, avg <= sec && ok / Math.max(1, res.length) >= toTh()); S.t = Date.now(); save(); } }); }
function toInsights() { const o = toSt(), tags = toTagAcc().filter(t => t.n), gain = toGain().slice(0, 3), traps = Object.entries(o.trap).sort((a, b) => b[1] - a[1]), sp = s => o.spd.filter(r => r.s === s).slice(-1)[0];
  const wk = o.date ? Math.max(0, Math.ceil((new Date(o.date + 'T12:00:00') - Date.now()) / (7 * 864e5))) : null, now = toNow();
  return `<div class="box"><b>🔍 Phân tích điểm yếu</b>
    <div style="margin-top:6px"><span>${wk != null ? `Còn <b>${wk} tuần</b>${now.tot != null ? ` · cách mục tiêu <b>${Math.max(0, o.target - now.tot)}</b> điểm` : ''}` : '<span class="mute">Đặt ngày thi ở 🧭 Lộ trình (mục tiêu TOEIC) để đếm tuần còn lại.</span>'}</span></div>
    <p style="margin:10px 0 2px"><b>🚀 Tăng điểm nhanh nhất ở đâu</b></p>${gain.length ? gain.map(x => `<p style="margin:2px 0">${TO_SEC[x.s][0]} ${TO_SEC[x.s][1]}: đúng ${Math.round(x.p * 100)}% → nếu thêm ${Math.round(Math.min(0.2, 1 - x.p) * 100)}% ≈ <b>+${x.g} điểm</b> <span class="mute">(đề thật ${TO_REAL[x.s]} câu)</span></p>`).join('')
      : '<p class="mute" style="margin:2px 0">Luyện ít nhất 5 câu mỗi Part để app tính.</p>'}<p class="mute" style="margin:2px 0 0">Ước theo số câu mỗi Part trong đề thật, ~4,9 điểm / câu; không phải bảng ETS.${wk != null && gain.length ? ` Gợi ý mỗi tuần: 3 buổi ${TO_SEC[gain[0].s][1]}${gain[1] ? `, 2 buổi ${TO_SEC[gain[1].s][1]}` : ''}, 1 đề thử, từ vựng mỗi ngày; mỗi 4 tuần 1 đề thật.` : ''}</p>
    ${tags.length ? `<p style="margin:10px 0 2px"><b>✏️ Part 5 theo dạng</b> <span class="mute">(lần làm gần nhất mỗi câu)</span></p>${tags.sort((a, b) => a.p - b.p).map(t => `<div class="row" style="margin:2px 0"><button class="link" data-top="t:${t.t}" style="text-align:left">${TO_T5[t.t]}</button><span class="${t.p >= 0.8 ? 'okc' : 'mute'}">${Math.round(t.p * 100)}% · ${t.n} câu</span></div>${bar(Math.round(t.p * 100), 80, t.p >= 0.8 ? 'var(--good)' : 'var(--accent)')}`).join('')}<p class="mute" style="margin:2px 0 0">Bấm tên dạng để luyện riêng dạng đó.</p>` : ''}
    ${traps.length ? `<p style="margin:10px 0 2px"><b>🪤 Bẫy Part 2 bạn hay mắc</b></p>${traps.map(([t, n]) => `<p style="margin:2px 0">${TO_TRAP[t][0]}: <b>${n}</b> lần <span class="mute">· ${TO_TRAP[t][1]}</span></p>`).join('')}` : ''}
    <p style="margin:10px 0 2px"><b>⏱ Tốc độ</b></p><div class="duo">${Object.entries(TO_SPD).map(([s, [sec]]) => { const r = sp(s); return `<button class="big2" data-tospd="${s}">${TO_SEC[s][1].replace(/: .*/, '')} · ${sec}s/câu<small>${r ? `lần trước ${r.avg}s, đúng ${r.ok}/${r.n}` : 'chưa làm'}</small></button>`; }).join('')}</div></div>`; }
document.addEventListener('change', e => { if (!S || !e.target.closest('#todate')) return; toSt().date = e.target.value || null; S.t = Date.now(); save(); toeicView(); });

// ---------- màn chính ----------
// v108: bỏ tab 🎓 Luyện thi; màn kỳ thi thuộc 📚 Học. v109 (người sáng lập: "phần học chia ra nền CEFR, mục tiêu IELTS, TOEIC… chứ không giấu nội dung phần mục tiêu"):
// 📚 Học có hàng mục ngang hàng 🧱 Nền CEFR · 🎓 Cambridge · 🌏 IELTS · 💼 TOEIC, mở được mọi mục; mục tiêu đang chọn chỉ được đánh dấu 🎯 (mục tiêu vẫn quyết ⚖️ và việc luyện đề ở Lộ trình).
// v110 (người sáng lập: "chia 2 mục: nền CEFR và thi: IELTS, TOEIC…"): hàng trên 2 mục 🧱 Nền CEFR · 🎓 Thi; trong 🎓 Thi có hàng con 🎓 Cambridge · 🌏 IELTS · 💼 TOEIC (🎯 = mục tiêu).
const EX_TABS = [['cefr', '🎓 Cambridge'], ['ielts', '🌏 IELTS'], ['toeic', '💼 TOEIC']];
const exGoalK = () => { const g = S && S.lt && S.lt.goal; return g ? ({ ielts: 'ielts', toeic: 'toeic', cambridge: 'cefr' })[g.kind] || null : null; };
const exSwitch = cur => { const gk = exGoalK(), nen = cur === 'nen';   // v112: nút chuyển 2 mục (🧱 Nền tiếng Anh · 🎓 Luyện thi); trong Luyện thi có hàng kỳ thi, 🎯 = mục tiêu
  return `<div class="seg"><button class="${nen ? 'on' : ''}" data-hocnen>🧱 Nền tiếng Anh</button><button class="${nen ? '' : 'on'}" data-exthi>🎓 Luyện thi${gk ? ' 🎯' : ''}</button></div>
    ${nen ? '' : `<div class="chipset ex3" style="margin:0 0 10px">${EX_TABS.map(([k, n]) => `<button class="${k === cur ? 'on' : ''}" data-exsel="${k}">${n}${k === gk ? ' 🎯' : ''}</button>`).join('')}</div>`}`; };
// v113: nút chính của màn kỳ thi (▶ Luyện tiếp = việc nên làm của kỳ thi). Mục tiêu là kỳ thi này mà ⚖️ Lộ trình chưa xếp giờ luyện đề (nền thiếu ≥ 2 cấp)
// thì nút chính là 🧱 Học nền trước, vẫn cho thử bằng nút phụ.
function exHero(k, act, lab, title = '▶ Luyện tiếp') { let sp = null; try { sp = exGoalK() === k && typeof ltSplit === 'function' ? ltSplit() : null; } catch (e) {}
  if (sp && !sp.ex) return `<button class="btnbig" data-hocnen>🧱 Học nền trước<small>Còn xa trình độ cần (${LVN[ltGoalLv()]}): Lộ trình chưa xếp giờ luyện đề</small></button><button class="btnbig ghost" ${act} style="font-size:16px">Vẫn thử: ${esc(lab)}</button>`;
  return `<button class="btnbig" ${act}>${title}<small>${esc(lab)}</small></button>`; }
// việc 🎓 luyện đề ở ô Hôm nay (Lộ trình): mở màn kỳ thi của mục tiêu rồi vào thẳng bài nên làm (ieToday / toToday); không tìm thấy nút thì ở lại màn kỳ thi
async function exGo() { const k = exSel(); await exOpen(); let a = null; try { a = k === 'ielts' ? ieToday()[0] : k === 'toeic' ? toToday()[0] : null; } catch (e) {}
  const m = a && String(a).match(/^(data-[\w-]+)(?:="([^"]*)")?$/); if (!m) return; let el = document.querySelector(`#app [${m[1]}${m[2] != null ? `="${m[2].replace(/"/g, '\\"')}"` : ''}]`);
  if (!el && document.createElement) { el = document.createElement('button'); el.hidden = true; el.setAttribute(m[1], m[2] != null ? m[2] : ''); $app.appendChild(el); }   // v122: màn kỳ thi không còn nút ▶ Luyện tiếp: bấm việc qua nút ẩn
  if (el && el.click) el.click(); }
const exOpenK = k => k === 'toeic' ? toeicView() : k === 'ielts' || typeof cbView !== 'function' ? ieltsView() : cbView();
const exSel = () => { if (!S) return null; const g = S.lt && S.lt.goal; if (g) return g.kind === 'ielts' || g.kind === 'toeic' ? g.kind : 'cefr'; return S.exSel || (S.ie && S.ie.set ? 'ielts' : 'cefr'); };
const exOpen = () => { const k = exSel(), g = S.lt && S.lt.goal; return k === 'toeic' ? toeicView() : k === 'ielts' || typeof cbView !== 'function' ? ieltsView() : cbView(g && typeof ltGoalLv === 'function' ? ltGoalLv(g) : undefined); };
document.addEventListener('click', e => { if (!S) return; if (e.target.closest('[data-hocnen]')) { scrollTo(0, 0); return overview(); } if (e.target.closest('[data-exthi]')) { scrollTo(0, 0); return exOpenK(exGoalK() || S.exSel || 'cefr'); } const b = e.target.closest('[data-exsel]'); if (!b) return; S.exSel = b.dataset.exsel; S.t = Date.now(); save(); scrollTo(0, 0); exOpenK(b.dataset.exsel); });   // v109: mở đúng mục đã chọn (mục tiêu không đổi)
// v122 kỳ thi theo khuôn Nền (parts.js xHome / xSkill; người sáng lập 3/11/2026): màn TOEIC = dòng điểm ước có thanh + 3 ô (🎧 Nghe · 📰 Đọc · 📚 Từ công sở) + "Thêm" gập;
// màn một kỹ năng = ① Làm bài → ② Điểm ước (so mục tiêu mỗi phần = tổng / 2) → ③ Thi thử phần đó, 📘 Bài học = cách làm, 🏋️ Bài tập = bài kế tiếp, danh sách bài cụ thể
// (Nghe: bộ 10 câu Part 2, từng hội thoại Part 3, bài nói Part 4 · Đọc: bộ 10 câu Part 5, từng đoạn Part 6, bộ văn bản Part 7 · Từ công sở: chủ đề); luyện theo Part,
// Part 5 theo dạng, câu từng sai, ⏱ tốc độ trong "Thêm". Bỏ nút ▶ Luyện tiếp (việc nên làm ở 🧭 Lộ trình). Không đổi cách chấm, cách ghi.
const TO_SKV = { L: ['🎧', 'Nghe', 'Listening'], R: ['📰', 'Đọc', 'Reading'], V: ['📚', 'Từ công sở', ''] };
const toSets = (its, n, sec, lab) => { const out = []; for (let i = 0; i < its.length; i += n) out.push({ id: `${sec}:${i / n + 1}`, ids: its.slice(i, i + n).map(x => x.id), sec, name: `${lab} · bộ ${i / n + 1} (${Math.min(n, its.length - i)} câu)` }); return out; };
const toP6Name = x => (String(x.title).match(/Subject: (.*)$/) || [])[1] || (/^(To|Dear)\b/.test(x.title) ? x.kind : x.title);
function toBai(k) { if (!TO) return [];
  if (k === 'L') return [...toSets(TO.p1 || [], 6, 'p1', 'Part 1'), ...toSets(TO.p2, 10, 'p2', 'Part 2'), ...TO.p3.map((x, i) => ({ id: x.id, x, sec: 'p3', name: `Part 3 · Hội thoại ${i + 1}` })), ...TO.p4.map((x, i) => ({ id: x.id, x, sec: 'p4', name: `Part 4 · Bài nói ${i + 1}` }))];
  if (k === 'R') return [...toSets(TO.p5, 10, 'p5', 'Part 5'), ...TO.p6.map(x => ({ id: x.id, x, sec: 'p6', name: `Part 6 · ${x.kind}: ${toP6Name(x)}` })), ...TO.p7.map(x => ({ id: x.id, x, sec: x.docs.length > 1 ? 'p7m' : 'p7', name: `Part 7 · ${x.kind}${x.docs.length > 1 ? ' (nhiều văn bản)' : ''}` }))];
  return TO.voc.map(t => ({ id: t.id, x: t, sec: 'voc', name: t.t })); }
// kết quả của một bài: bộ câu = cộng các câu đã làm; Từ công sở = số từ nhớ vững của chủ đề
function toRes(b) { const o = toSt();
  if (b.sec === 'voc') { const seen = b.x.w.filter(w => o.voc[w[0]]), kn = b.x.w.filter(w => (o.voc[w[0]] || {}).box >= 3).length; return seen.length ? { at: Math.max(...seen.map(w => o.voc[w[0]].due || 0)), t: `${kn}/${b.x.w.length} từ nhớ vững`, bad: false } : null; }
  if (!b.ids) return o.r[b.id] || null; const rs = b.ids.map(id => o.r[id]).filter(Boolean); return rs.length ? { at: Math.max(...rs.map(r => r.at)), ok: rs.reduce((t, r) => t + r.ok, 0), n: rs.reduce((t, r) => t + r.n, 0) } : null; }
const toNeed = () => Math.max(0.3, Math.min(0.95, (toSt().target / 2 - 5) / 490));   // tỉ lệ đúng cho điểm mục tiêu mỗi phần (thang ước 5–495)
const toNext = k => { const L = toBai(k); return L.find(b => !toRes(b)) || L.slice().sort((a, c) => ((toRes(a) || {}).at || 0) - ((toRes(c) || {}).at || 0))[0] || null; };
function toDo(k, b) { const o = toSt(), back = () => toSkView(k); scrollTo(0, 0); if (!b) return toast('Chưa có bài.'); if (b.sec === 'voc') return toVocRun(b.id, back);
  if (!NCLIPS.size) fetch('n/index.json?v=' + APP_V).then(r => r.json()).then(x => { NCLIPS = new Set(x); }).catch(() => {});
  const qs = b.ids ? b.ids.map(id => TO[b.sec].find(x => x.id === id)).filter(Boolean).map({ p1: toP1Q, p2: toP2Q, p5: toP5Q }[b.sec])
    : b.sec === 'p3' || b.sec === 'p4' ? toTalkQs(b.x, b.sec) : b.sec === 'p6' ? toP6Qs(b.x) : toP7Qs(b.x);
  return ieRun(`${(TO_SEC[b.sec] || TO_SEC.p7)[0]} ${b.name}`, qs, back, 0, { R: o.r, home: 'TOEIC', done: (res, fr) => toLog(res, 'luyen', fr) }); }
async function toeicView() { BACK = null; window.CUR = { view: 'toeic' }; EXAM_VOX = false;
  if (!TO || !KIT.np.items) { $app.innerHTML = '<div id="ie"></div><p class="mute">Đang tải…</p>'; try { await Promise.all([toLoad(), kLoad(KIT.np)]); } catch (e) { $app.innerHTML = '<div id="ie"></div><p>Không tải được dữ liệu TOEIC. Thử lại sau.</p>'; return; } }
  const o = toSt(), tg = o.target, now = toNow(), cs = toReady(), nOk = cs.filter(c => c[0]).length, base = toBase(tg), nv = TO.voc.reduce((t, x) => t + x.w.length, 0), due = toVocDue().length;
  const wk = o.date ? Math.max(0, Math.ceil((new Date(o.date + 'T12:00:00') - Date.now()) / (7 * 864e5))) : null, half = tg / 2;
  const tile = k => { if (k === 'V') { const kn = toVocKnown(); return { attr: 'data-tosk="V"', ic: '📚', t: 'Từ công sở', pct: Math.round(kn / Math.max(1, nv) * 100), cls: kn >= nv * 0.8 ? 'ok' : '', meta: due ? `🔁 ${due} từ cần ôn` : kn ? `${kn}/${nv} nhớ vững` : Object.keys(o.voc).length ? 'đang học' : 'Chưa học' }; }
    const L = toBai(k), done = L.filter(b => toRes(b)).length, b = now.b[k], ok = b != null && b >= half;
    return { attr: `data-tosk="${k}"`, ic: TO_SKV[k][0], t: TO_SKV[k][1], cls: ok ? 'ok' : '', pct: Math.round(((L.length ? done / L.length : 0) + (b != null ? Math.min(1, b / half) : 0)) / 2 * 100), meta: b != null ? `${ok ? '✓ ' : ''}≈ ${b} điểm${now.cal[k] ? ' 📏' : ''}` : done ? `${done}/${L.length} bài` : 'Chưa làm' }; };
  const tiles = ['L', 'R', 'V'].map(tile); let sp = null; try { sp = exGoalK() === 'toeic' && typeof ltSplit === 'function' ? ltSplit() : null; } catch (e) {}
  $app.innerHTML = '<div id="ie"></div>' + xHome({ sw: exSwitch('toeic'), t: `💼 TOEIC ${tg}`, pv: now.tot != null ? `Tổng ≈ ${now.tot}` : 'điểm ước: chưa đủ số đo',
    pct: now.tot != null ? Math.min(100, Math.round(now.tot / tg * 100)) : Math.round(tiles.reduce((t, x) => t + x.pct, 0) / 3), sub: `Listening + Reading · cần nền ${LVN[base]}${wk != null ? ` · còn ${wk} tuần` : ''}`,
    note: sp && !sp.ex ? `<div class="box" style="margin:0 0 12px"><b>⚖️ Nền còn thiếu xa (cần ${LVN[ltGoalLv()]})</b><p class="mute" style="margin:4px 0">🧭 Lộ trình chưa xếp giờ luyện đề: học nền trước. Vẫn xem và thử được.</p><button data-hocnen style="margin:4px 0 0">🧱 Học nền trước</button></div>` : '',
    tiles, more: [['🎓 Thi thử cả đề', `<p class="mute" style="margin:0 0 6px">Tỉ lệ các Part như đề thật, ít câu hơn (đề thật 200 câu / 120 phút). Nghe 1 lần, không báo đúng / sai giữa chừng.${o.mock.length ? ` Đã làm ${o.mock.length} lần.` : ''} Làm từng phần: bước ③ ở màn Nghe / Đọc.</p><button class="pri" data-tomk="all">▶ Làm cả đề</button>`],
      ['🎯 Sẵn sàng thi', `<p style="margin:0 0 4px"><b>${tg} điểm: ${nOk}/${cs.length}</b></p>${cs.map(([ok, t, d]) => `<p style="margin:4px 0">${ok ? '✅' : '⬜'} ${t} <span class="mute">· ${esc(d)}</span></p>`).join('')}
        <p class="mute" style="margin:6px 0 0">Đủ cả 4 mới nên đăng ký thi. Đề của app do AI soạn; đề luyện thật (sách ETS) là bằng chứng độc lập.</p><button class="chip" data-toadd>📝 Ghi điểm đề luyện thật (Listening, Reading)</button>`],
      ['🧱 Nền cần có', `<p class="mute" style="margin:0 0 4px">CEFR ${LVN[base]}${cs[0][0] ? ' ✅' : ''}. Suy từ bảng ETS (Nghe B1 ≥ 275, B2 ≥ 400, C1 ≥ 490; Đọc B1 ≥ 275, B2 ≥ 385, C1 ≥ 455; nên đối chiếu tài liệu ETS). ${tg} điểm ≈ mỗi phần ${half}.</p><p style="margin:4px 0">${cs[0][2]}</p><button data-iecefr="${base}">🧱 Mở Nền tiếng Anh cấp ${LVN[base]}</button>`],
      ['🗺 Bản đồ điểm', '<button class="link" data-mapv="lt" data-mapk="toeic" style="margin:0">🗺 Bản đồ điểm: ở 🧭 Lộ trình → 🗺 Chỗ yếu ›</button>'],
      ['📘 Cẩm nang thi', '<button data-cnv="toeic">📘 Cẩm nang thi: mẹo Nghe · Đọc, bẫy Part 2, từ công sở</button>'],
      ['📊 Cách tính điểm ước', `<p class="mute" style="margin:0">Nghe ${now.b.L != null ? now.b.L : '–'}${now.cal.L ? ' 📏' : ''} · Đọc ${now.b.R != null ? now.b.R : '–'}${now.cal.R ? ' 📏' : ''}. Lấy từ đề thử gần nhất; chưa có thì từ bài luyện. Ước theo tỉ lệ đúng, không phải bảng ETS. 📏 = đã chỉnh theo đề thật bạn nhập (so đề thử app trong 14 ngày).</p>`]],
    foot: 'TOEIC là thương hiệu của ETS; app không phải sản phẩm chính thức, không chép đề ETS. 🤖 Nội dung AI soạn, chưa giáo viên kiểm (thấy câu sai: 💬 → ⚑ Câu sai). Đăng ký thi tại Việt Nam: IIG Việt Nam (đại diện ETS).' });
  $app.onclick = toClick; }
// màn một kỹ năng (khuôn xSkill như màn phần của Nền)
function toSkView(k) { BACK = null; if (k === 'T') k = 'R'; window.CUR = { view: 'toeic', sk: k }; EXAM_VOX = false; if (!TO_SKV[k] || !TO) return toeicView();   // ⏱ tốc độ (v113 ô riêng) nằm trong "Thêm" của Đọc
  const o = toSt(), tg = o.target, half = tg / 2, [ic, vi] = TO_SKV[k], L = toBai(k), done = L.filter(b => toRes(b)).length, nx = toNext(k), need = k === 'V' ? null : toNeed(), xl = xlBlock('toeic', k);   // v131: 📘 bài học (baihoc.js)
  const at = nx ? L.findIndex(x => x.id === nx.id) : -1, rows = L.map((x, i) => { const r = toRes(x), nxt = i === at && !r, [tag, cls] = xTag(r, need); return pRow(`data-tobai="${k}|${x.id}"`, esc(x.name), nxt ? 'làm tiếp' : tag, nxt ? 'next' : cls); });
  const sec = s => { const a = Object.values(o.r).filter(r => r.k === s), n = a.reduce((t, r) => t + r.n, 0); return `<button class="big2" data-top="${s}">${TO_SEC[s][0]} ${TO_SEC[s][1].replace(/^Part \d: /, '')}<small>${TO_SEC[s][1].match(/^Part \d/)[0]}${n ? ` · đúng ${Math.round(a.reduce((t, r) => t + r.ok, 0) / n * 100)}%` : ''}</small></button>`; };
  let steps, more;
  if (k === 'V') { const nv = L.reduce((t, b) => t + b.x.w.length, 0), seen = Object.keys(o.voc).length, kn = toVocKnown(), due = toVocDue().length, pk = Math.round(kn / Math.max(1, nv) * 100);
    steps = [{ t: 'Học từ', v: `${seen}/${nv}`, sub: seen >= nv ? 'đủ' : `còn ${nv - seen} từ`, ok: seen >= nv, cur: seen < nv }, { t: 'Nhớ vững', v: `${pk}%`, sub: 'cần 80%', ok: pk >= 80, cur: seen > 0 && pk < 80 },
      due ? { t: 'Ôn đến hạn', btn: `<button class="pri" data-tovoc="">🔁 ${Math.min(10, due)} từ</button>`, sub: `${due} từ đến hạn` } : { t: 'Ôn đến hạn', v: seen ? '✓' : '–', sub: seen ? 'chưa có từ đến hạn' : 'học từ trước', ok: seen > 0 }];
    more = [['📚 Về từ công sở', `<p class="mute" style="margin:0">${TO.voc.length} chủ đề, ${nv} từ hay gặp trong đề (văn phòng, họp, đi công tác…). Ôn cách quãng 1 → 35 ngày; nhớ vững = nhớ đúng ≥ 3 lần cách ngày.</p>`]]; }
  else { const b = toNow().b[k], P = TO_PAPERS[k === 'L' ? 0 : 1], lm = o.mock.filter(m => m.b && m.b[k] != null).pop(), w5 = toWrong5().length;
    steps = [xl.step,
      { t: 'Điểm ước', v: b != null ? String(b) : '–', sub: `cần ${half}`, ok: b != null && b >= half, cur: b != null && b < half },
      { t: 'Thi thử', btn: `<button class="pri" data-tomk="${k === 'L' ? 0 : 1}">▶ ${P.min} phút</button>`, sub: lm ? `lần trước ≈ ${lm.b[k]}` : 'chưa làm' }];
    more = k === 'L' ? [['📝 Luyện theo Part', `<div class="duo">${['p1', 'p2', 'p3', 'p4'].map(sec).join('')}</div>`], ['🎧 Về bài nghe', '<p class="mute" style="margin:0">Giọng Mỹ và Anh tự nhiên. Part 1 dùng tranh vẽ đơn giản thay ảnh chụp của đề thật. Luyện được nghe 2 lần; đề thật chỉ 1 lần.</p>']]
      : [['📝 Luyện theo Part', `<div class="duo">${['p5', 'p6', 'p7'].map(sec).join('')}<button class="big2" data-top="p7m">📑 Nhiều văn bản<small>Part 7, đối chiếu</small></button></div>`],
        ['✏️ Part 5 theo dạng ngữ pháp', `<div class="chips">${Object.entries(TO_T5).map(([t, n]) => `<button class="chip" data-top="t:${t}">${n}</button>`).join('')}</div>${w5 ? `<button data-top="w5">🔁 Làm lại ${Math.min(15, w5)} câu Part 5 từng sai</button>` : ''}`],
        ['⏱ Luyện tốc độ', `<p class="mute" style="margin:0 0 6px">Đề thật 200 câu / 120 phút nên thiếu giờ là chuyện thường. Part 5 ~${TO_SPD.p5[0]} giây / câu, Part 7 ~${TO_SPD.p7[0]} giây / câu.</p><div class="duo">${Object.entries(TO_SPD).map(([s, [secs]]) => { const r = o.spd.filter(x => x.s === s).slice(-1)[0]; return `<button class="big2" data-tospd="${s}">${TO_SEC[s][1].replace(/: .*/, '')} · ${secs}s/câu<small>${r ? `lần trước ${r.avg}s, đúng ${r.ok}/${r.n}` : 'chưa làm'}</small></button>`; }).join('')}</div>`]]; }
  $app.innerHTML = '<div id="ie"></div>' + xSkill({ back: '<div class="row top"><button class="link" data-tohome>‹ TOEIC</button><span></span></div>', h1: `${ic} ${vi} <span class="mute" style="font-size:18px">· TOEIC ${tg}</span>`,
    steps, learn: xl.learn, prac: { attr: `data-tobt="${k}"`, sub: !nx ? 'chưa có bài' : toRes(nx) ? 'làm lại bài cũ nhất' : 'bài kế tiếp' }, les: xl,
    intro: { L: 'Học từng dạng câu (Part 1–4), rồi nghe bộ bài như thi thật. Điểm ước tính từ các bài bạn làm.', R: 'Học từng dạng câu (Part 5–7), rồi làm bộ bài đọc như thi thật. Điểm ước tính từ các bài bạn làm.', V: 'Học từ công sở theo chủ đề; app nhắc ôn đúng lúc để nhớ lâu.' }[k],
    pracT: { L: 'Làm bộ bài nghe', R: 'Làm bộ bài đọc', V: 'Học từ công sở' }[k], nxName: nx ? nx.name : '',
    lt: { L: 'Bài nghe', R: 'Bài đọc', V: 'Chủ đề' }[k], lsub: `${done}/${L.length} đã làm`, rows, at, more });
  $app.onclick = toClick; scrollTo(0, 0); }
// v131: màn "cách làm" (v122 toHowView) thay bằng 📘 bài học từng Part / dạng (baihoc.js xlView)
// bấm ở màn TOEIC và màn con; luyện xong về màn đã mở (màn con thì về màn con)
function toClick(e) { const g = s => e.target.closest(s), o = toSt(), sk = (window.CUR || {}).sk, back = sk ? () => toSkView(sk) : toeicView; let b;
  if (g('[data-tohome]')) { scrollTo(0, 0); return toeicView(); }
  if ((b = g('[data-tosk]'))) return toSkView(b.dataset.tosk);
  if ((b = g('[data-tobt]'))) return toDo(b.dataset.tobt, toNext(b.dataset.tobt));
  if ((b = g('[data-tobai]'))) { const [k, id] = b.dataset.tobai.split('|'); return toDo(k, toBai(k).find(x => x.id === id)); }
  if ((b = g('[data-iecefr]'))) { scrollTo(0, 0); return overview(b.dataset.iecefr); }
  if ((b = g('[data-tomk]'))) return toMock(b.dataset.tomk === 'all' ? [0, 1] : [+b.dataset.tomk]);
  if ((b = g('[data-tovoc]'))) { scrollTo(0, 0); return toVocRun(b.dataset.tovoc, back); }
  if ((b = g('[data-tospd]'))) { scrollTo(0, 0); return toSpeed(b.dataset.tospd, back); }
  if ((b = g('[data-top]'))) { const s = b.dataset.top; scrollTo(0, 0); if (!NCLIPS.size) fetch('n/index.json?v=' + APP_V).then(r => r.json()).then(k => { NCLIPS = new Set(k); }).catch(() => {});
    if (s.startsWith('t:')) { const t = s.slice(2), qs = toPick(TO.p5.filter(x => x.t === t), 15).map(toP5Q); return ieRun('✏️ Part 5 · ' + TO_T5[t], qs, back, 0, { R: o.r, home: 'TOEIC', done: (res, fr) => toLog(res, 'luyen', fr) }); }
    const qs = s === 'w5' ? shuf(toWrong5()).slice(0, 15).map(toP5Q) : toGen[s](s === 'p7m' ? 1 : TO_PRAC[s]); if (!qs.length) return toast('Chưa có bài.');
    return ieRun((TO_SEC[s] || ['📑', s === 'w5' ? 'Làm lại câu sai' : 'Part 7: nhiều văn bản'])[0] + ' ' + (TO_SEC[s] ? TO_SEC[s][1] : s === 'w5' ? 'Làm lại câu sai' : 'Part 7: nhiều văn bản'), qs, back, 0, { R: o.r, home: 'TOEIC', done: (res, fr) => toLog(res, 'luyen', fr) }); } }
const toHow = k => `<details style="margin-top:6px"><summary>📘 Cách làm</summary>${TO_HOW[k][1].map(s => `<p style="margin:2px 0;font-size:15px">• ${esc(s)}</p>`).join('')}</details>`;
toLoad().catch(() => {});
