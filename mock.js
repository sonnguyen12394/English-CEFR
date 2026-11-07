// 🎓 Đề thử kiểu Cambridge (27/10/2026, người sáng lập: "làm khuôn đưa ra ngẫu nhiên các dạng đề thử").
// Khuôn theo cấu trúc đề thật (bài thi, thời gian, dạng phần); câu bốc ngẫu nhiên mỗi lần từ kho của app (câu thi Từ vựng, đề Ngữ pháp, bài Đọc / Nghe / Viết).
// KHÔNG chép đề Cambridge (có bản quyền). Nội dung AI soạn, chưa người thật kiểm; số câu ít hơn đề thật khi kho chưa đủ.
// Ngưỡng đạt ước tính (không chính thức): A2 Key, B1 Preliminary ~70% (thang Cambridge 120 / 140); B2 First trở lên ~60% (160 / 180 / 200). Mỗi bài thi tính ngang nhau.
// Bằng chứng cuối vẫn là đề mẫu chính thức ở ô 📝 Kiểm bằng đề thật.
const MOCK = {
  pre: { name: 'Pre A1 Starters (kiểu)', lo: 'pre', pass: 0.7, papers: [
    // v129: các phần theo đề thật Starters (dangthi.js)
    { t: '🎧 Nghe', min: 20, parts: [['Phần 1: nghe, nối tên với người', () => dtQ('line')], ['Phần 2: nghe, viết tên và số', () => dtQ('name')], ['Phần 3: nghe, chọn tranh', () => mkPicL(5)], ['Phần 4: nghe, tô màu', () => dtQ('colour')]] },
    { t: '📖 Đọc và Viết', min: 20, parts: [['Phần 1: nhìn tranh, đúng hay sai', () => mkPicR(5)], ['Phần 2: tranh lớn, viết yes / no', () => dtQ('yn')], ['Phần 3: xếp chữ thành từ', () => dtSpell(5)], ['Phần 4: chọn từ điền vào bài', () => dtQ('box')], ['Phần 5: truyện tranh, trả lời', () => dtQ('story')]] }] },
  a1: { name: 'A1 Movers (kiểu)', lo: 'a1', pass: 0.7, papers: [
    // v129: các phần theo đề thật Movers (dangthi.js)
    { t: '🎧 Nghe', min: 25, parts: [['Phần 1: nghe, nối tên với người', () => dtQ('line')], ['Phần 2: nghe, viết tên và số', () => dtQ('name')], ['Phần 3: nghe, nối ngày với tranh', () => dtQ('match5')], ['Phần 4: nghe, chọn tranh', () => mkPicL(5)], ['Phần 5: nghe, tô màu và viết', () => dtQ('colour')]] },
    { t: '📖 Đọc và Viết', min: 30, parts: [['Phần 1: đọc định nghĩa, viết từ', () => dtDef(5)], ['Phần 2: chọn câu đáp', () => dtQ('resp')], ['Phần 3: truyện, chọn từ điền và tên truyện', () => dtQ('box')], ['Phần 4: đọc, chọn từ đúng', () => dtQ('mcc')], ['Phần 5: truyện tranh, điền câu', () => dtQ('story')], ['Phần 6: nhìn tranh, viết', () => dtQ('pdesc')]] }] },
  a2: { name: 'A2 Key (kiểu)', lo: 'a2', pass: 0.7, papers: [
    { t: '📖 Đọc và Viết', min: 60, parts: [['Phần 1–3: đọc tin nhắn, bài báo', () => mkRead(4)], ['Phần 4: chọn từ (cụm từ)', () => mkVocab('xC', 6)], ['Phần 5: điền từ (ngữ pháp)', () => mkGram('dien', 6)], ['Phần 6: viết email', () => mkWrite(9).filter(q => /email|tin nhắn/.test(q.x.genre)).slice(0, 1)], ['Phần 7: viết truyện theo tranh', () => dtQ('pstory')]] },
    { t: '🎧 Nghe', min: 30, parts: [['Phần 1: nghe hội thoại, chọn tranh', () => dtQ('pmc')], ['Phần 3, 4: nghe hội thoại, thông báo', () => mkListen(3)], ['Phần 5: nghe, nối người với vật', () => dtQ('match5')]] }] },
  b1: { name: 'B1 Preliminary (kiểu)', lo: 'b1', pass: 0.7, papers: [
    { t: '📖 Đọc', min: 45, parts: [['Phần 1–4: đọc hiểu', () => mkRead(4)], ['Phần 5: điền từ trắc nghiệm (cụm từ)', () => mkVocab('xC', 6)], ['Phần 6: điền từ (ngữ pháp)', () => mkGram('dien', 6)]] },
    { t: '✍️ Viết', min: 45, parts: [['Phần 1–2: email, bài báo / truyện', () => mkWrite(2)]] },
    { t: '🎧 Nghe', min: 30, parts: [['Phần 1: nghe hội thoại, chọn tranh', () => dtQ('pmc')], ['Phần 2, 4: nghe', () => mkListen(4)]] }] },
  b2: { name: 'B2 First (kiểu)', lo: 'b2', pass: 0.6, papers: [
    { t: '📖 Đọc và Dùng tiếng Anh', min: 75, parts: [['Phần 1: điền từ trắc nghiệm (cụm từ)', () => mkVocab('xC', 8)], ['Phần 2: điền từ (ngữ pháp)', () => mkGram('dien', 8)], ['Phần 3: tạo dạng từ', () => mkVocab('xD', 8)],
      ['Phần 4: viết lại câu đúng', () => mkGram('sua', 6)], ['Phần 5–7: đọc hiểu', () => mkRead(3)]] },
    { t: '✍️ Viết', min: 80, parts: [['Phần 1–2: bài luận, thư, bài nhận xét', () => mkWrite(2)]] },
    { t: '🎧 Nghe', min: 40, parts: [['Phần 1, 4: nghe', () => mkListen(4)], ['Phần 3: nối người nói', () => mkMM(1)]] }] },
  c1: { name: 'C1 Advanced (kiểu)', lo: 'c1', pass: 0.6, papers: [
    { t: '📖 Đọc và Dùng tiếng Anh', min: 90, parts: [['Phần 1: điền từ trắc nghiệm (cụm từ)', () => mkVocab('xC', 8)], ['Phần 2: điền từ (ngữ pháp)', () => mkGram('dien', 8)], ['Phần 3: tạo dạng từ', () => mkVocab('xD', 8)],
      ['Phần 4: viết lại câu đúng', () => mkGram('sua', 6)], ['Thay từ cùng nghĩa', () => mkVocab('xY', 5)], ['Phần 5–8: đọc hiểu', () => mkRead(3)]] },
    { t: '✍️ Viết', min: 90, parts: [['Phần 1–2: bài luận, đề xuất, báo cáo', () => mkWrite(2)]] },
    { t: '🎧 Nghe', min: 40, parts: [['Phần 1, 3: nghe', () => mkListen(4)], ['Phần 4: nối người nói (2 nhiệm vụ)', () => mkMM(1)]] }] },
  c2: { name: 'C2 Proficiency (kiểu)', lo: 'c2', pass: 0.6, papers: [
    { t: '📖 Đọc và Dùng tiếng Anh', min: 90, parts: [['Phần 1: điền từ trắc nghiệm (cụm từ)', () => mkVocab('xC', 8)], ['Phần 2: điền từ (ngữ pháp)', () => mkGram('dien', 8)], ['Phần 3: tạo dạng từ', () => mkVocab('xD', 8)],
      ['Phần 4: viết lại câu đúng', () => mkGram('sua', 6)], ['Thành ngữ, nghĩa bóng', () => mkVocab('xId', 5)], ['Phần 5–7: đọc hiểu', () => mkRead(3)]] },
    { t: '✍️ Viết', min: 90, parts: [['Phần 1–2: bài luận, bài báo, báo cáo', () => mkWrite(2)]] },
    { t: '🎧 Nghe', min: 40, parts: [['Phần 1, 3: nghe', () => mkListen(4)], ['Phần 4: nối người nói (2 nhiệm vụ)', () => mkMM(1)]] }] },
};
MOCK.a2p = MOCK.a2; MOCK.b1p = MOCK.b1; MOCK.b2p = MOCK.b2;
// v132 "chọn HAI" (IELTS Choose TWO letters): q.any = 2 đáp án đúng, thứ tự nào cũng được, mỗi chữ đúng 1 điểm; câu thứ 2 của cặp (q.two === 2, cùng q.pid) không được trùng lựa chọn của câu 1
const mcOk = (q, v, res) => !q.any ? v === q.a : q.any.includes(v) && !(q.two === 2 && (res || []).some(r => r && r.q && r.q.pid === q.pid && r.q.two === 1 && r.ans === v));
const mcAns = q => q.any ? q.any.join(' + ') : q.a;
let MK = null;   // đề đang làm: { lv, C, papers: [{ t, min, qs: [{ part, q }] }] }
// cấp lấy câu: cấp của kỳ thi tới cấp người học đang chọn (vd. B1+ lấy B1 + B1+); kỹ năng không có cấp "+" nên lấy cấp gốc
const mkLvs = () => LEVELS.slice(LEVELS.indexOf(MK.C.lo), LEVELS.indexOf(MK.lv) + 1);
const mkKitLvs = P => mkLvs().filter(l => P.lvs.includes(l));
// kho cấp của kỳ thi thiếu từ có dữ liệu (vd. tạo dạng từ C2) thì lấy thêm từ các cấp thấp hơn
function mkVocab(type, n) { XLV = MK.lv; const ok = X_Q[type] ? X_Q[type][1] : () => true, L = new Set(mkLvs()), i = LEVELS.indexOf(MK.lv), has = w => EB[w.id] && ok(w);
  const pool = [...shuf(WORDS.filter(w => L.has(wLv(w)) && has(w))), ...shuf(WORDS.filter(w => !L.has(wLv(w)) && LEVELS.indexOf(wLv(w)) < i && has(w)))];
  return pool.slice(0, n * 3).map(w => { const q = examQ(w, type); return q && (q.type === type || type === 'xT') ? mkFromX(w, q) : null; }).filter(Boolean).slice(0, n); }
const mkFromX = (w, q) => ({ x: w, kind: q.opts ? 'mc' : 'type', head: q.sub ? `<p class="mute">${q.sub}</p>` : '', q: q.top, opts: q.opts, a: q.a, acc: [q.a, ...(q.alt || [])], after: q.after });
function mkGram(k, n) { const P = KIT.np, ls = mkKitLvs(P); return shuf(P.items.filter(x => ls.includes(x.lv))).flatMap(x => P.q(x, k, 'test').slice(0, 1)).slice(0, n); }
// v101: bỏ bộ câu của Viết (x.kind), chỉ lấy đề
const mkPick = (P, n) => { const ls = mkKitLvs(P), its = P.items.filter(x => ls.includes(x.lv) && !x.kind); return [...shuf(its.filter(x => x.test)), ...shuf(its.filter(x => !x.test))].slice(0, n); };
const mkRead = n => mkPick(KIT.doc, n).flatMap(x => [...kRead(KIT.doc, x, 'y', false), ...kRead(KIT.doc, x, 'ct', false)]);
const mkListen = n => mkPick(KIT.nghe, n).flatMap((x, i) => ['y', 'ct', ...(i < 2 ? ['chep'] : [])].flatMap(k => kRead(KIT.nghe, x, k, true)));
// v126 🎧 nối người nói (B2 First Part 3, C1 / C2 Part 4; nghe.json mm, Claude soạn): 5 người nói, mỗi nhiệm vụ chọn 1 trong 8 ý A–H (3 ý thừa);
// C1 / C2 hai nhiệm vụ cùng một lần nghe nên lượt nghe của mỗi người dùng chung (khoá play theo người), tối đa 2 lần như đề thật
const MM_L = 'ABCDEFGH';
const mmQs = x => x.tasks.flatMap((t, ti) => x.sp.map((s, i) => ({ x, k: 'mm', kind: 'mc', q: 'Người nói ' + (i + 1),
  head: `<p class="mute" style="margin:0 0 4px">🎧 ${esc(x.t)} · ${x.tasks.length > 1 ? `Nhiệm vụ ${ti + 1}/${x.tasks.length} · ` : ''}5 người nói, mỗi chữ chỉ dùng một lần, có 3 ý thừa.</p><p style="margin:0 0 6px"><b>${esc(t.q.replace(/^Task \d: /, ''))}</b></p>`,
  opts: t.o.map((o, j) => MM_L[j] + '. ' + o), a: MM_L[t.a[i]] + '. ' + t.o[t.a[i]], play: { key: x.id + '|' + i, text: s, max: 2 }, why: `Người nói ${i + 1}: “${s}”` })));
const mmSets = () => (KIT.nghe.raw && KIT.nghe.raw.mm) || [];
// v128 🖼 Starters / Movers có tranh (nghe.json pic ← content/bs/tranh.json: danh từ cụ thể có emoji, chọn tay, Claude soạn): 🎧 nghe câu, chọn 1 trong 3 tranh (kiểu Listening Part 4);
// 📖 nhìn tranh, câu "This is …" đúng hay sai (kiểu Reading & Writing Part 1). Nhiễu cùng nhóm (con vật, đồ ăn…); Movers lấy thêm từ Starters (~1/3); câu sai của Starters chỉ dùng từ Starters
const picSet = () => (KIT.nghe.raw && KIT.nghe.raw.pic) || [];
const picPool = () => { const lo = MK.C.lo, P = picSet(), own = P.filter(x => x.lv === lo); return lo === 'pre' ? own : [...own, ...shuf(P.filter(x => x.lv === 'pre')).slice(0, Math.ceil(own.length / 2))]; };
const picDis = (x, n) => { const P = picSet().filter(y => y.w !== x.w && y.e !== x.e && (MK.C.lo !== 'pre' || y.lv === 'pre')); return [...shuf(P.filter(y => y.c === x.c)), ...shuf(P.filter(y => y.c !== x.c))].slice(0, n); };
const MK_YES = '✓ Đúng (Yes)', MK_NO = '✗ Sai (No)', picThis = y => y.a ? `This is ${y.a}.` : /s$/.test(y.w) ? `These are ${y.w}.` : `This is ${y.w}.`;
const mkPicL = n => shuf(picPool()).slice(0, n).map(x => ({ x, k: 'picl', kind: 'mc', emo: 1, head: '<p class="mute">🎧 Nghe, chọn tranh đúng.</p>', q: 'Tranh nào?', opts: shuf([x.e, ...picDis(x, 2).map(y => y.e)]), a: x.e,
  play: { key: 'pic|' + x.w, text: x.s, max: 2 }, why: `“${x.s}” → ${x.e} ${x.w}` }));
const mkPicR = n => shuf(picPool()).slice(0, n).map((x, i) => { const yes = Math.random() < (i % 2 ? 0.4 : 0.6), y = yes ? x : picDis(x, 1)[0] || x, ok = y === x;
  return { x, k: 'picr', kind: 'mc', head: `<p class="mute">📖 Nhìn tranh, đọc câu: đúng hay sai?</p><p style="font-size:76px;line-height:1.1;text-align:center;margin:6px 0">${x.e}</p>`, q: esc(picThis(y)), opts: [MK_YES, MK_NO], a: ok ? MK_YES : MK_NO,
    why: `Tranh: ${x.e} ${x.w}${ok ? '' : ' · câu nói: ' + y.w}` }; });
const mkMM = n => { const ls = mkLvs(), X = S.cbx || {}; return shuf(mmSets().filter(x => ls.includes(x.lv))).sort((a, b) => (b.lv === MK.C.lo) - (a.lv === MK.C.lo) || ((X[a.id] || {}).at || 0) - ((X[b.id] || {}).at || 0)).slice(0, n).flatMap(mmQs); };
const mkWrite = n => KIT.viet.lvs.some(l => mkLvs().includes(l)) ? mkPick(KIT.viet, n).map(x => kWrite(x)) : [];

const mkRuns = lv => ((S.mock = S.mock || {})[lv] = S.mock[lv] || []);
async function mockView(lv) { window.CUR = { view: 'de-thu', item: lv }; const C = MOCK[lv]; if (!C) return toast('Cấp này chưa có khuôn đề thử.');
  $app.innerHTML = '<p class="mute">Đang tải kho câu…</p>'; await Promise.all([loadEB(), ...Object.values(KIT).map(kLoad), typeof uLoad === 'function' ? uLoad() : 0]);
  const rs = mkRuns(lv), last = rs[rs.length - 1];
  $app.innerHTML = `${backRow('🎓 Đề thử')}<h1>🎓 ${esc(C.name)}</h1>
    <div class="box"><p style="margin:0">Khuôn theo đề Cambridge thật: ${C.papers.map(p => `<b>${p.t}</b> ${p.min} phút`).join(' · ')}. Mỗi lần bấm, máy bốc câu mới ngẫu nhiên. Không báo đúng / sai giữa chừng. Hết giờ thì bài thi tự nộp.</p>
      <p class="mute" style="margin:6px 0 0">Đạt (ước, không chính thức): mỗi bài thi tính ngang nhau, trung bình ≥ ${C.pass * 100}%. Nội dung AI soạn, không phải đề Cambridge; số câu ít hơn đề thật. 🗣 Nói (từ A1, cần Safari trên iPhone): máy đo gián tiếp 4 tiêu chí giám khảo, chưa đối chiếu người chấm thật. Kiểm cuối bằng đề mẫu chính thức ở 📝 Kiểm bằng đề thật.</p></div>
    ${C.papers.map((p, i) => `<button class="pri" data-mk="${i}" style="margin-top:8px">${p.t} (${p.min} phút)</button>`).join('')}
    <button data-mk="all" style="margin-top:8px">▶ Làm cả đề (${C.papers.length} bài thi liền nhau)</button>
    ${last ? `<div class="box"><b>Lần gần nhất</b> (${new Date(last.at).toLocaleDateString('vi-VN')}): ${last.papers.map(p => `${p.t} ${p.ok}/${p.n}`).join(' · ')}${last.pct != null ? ` → <b>${last.pct}%</b> ${last.pass ? '✅' : '❌'}` : ''}<p class="mute" style="margin:4px 0 0">Đã làm ${rs.length} lần.</p></div>` : ''}`;
  $app.onclick = async e => { if (e.target.closest('[data-a="home"]')) return exHome(lv); const b = e.target.closest('[data-mk]'); if (!b) return;
    const idx = b.dataset.mk === 'all' ? C.papers.map((_, i) => i) : [+b.dataset.mk]; try { if (typeof capLoad === 'function') await capLoad(); } catch (er) {} mkStart(lv, idx); }; }   // v141: phần Nói thảo luận cặp cần cap.json
function mkStart(lv, idx) { const C = MOCK[lv]; MK = { lv, C, papers: [], idx };
  for (const i of idx) { const p = C.papers[i]; if (p.speak && !SREC) { toast('Bài Nói cần máy chép lời: mở trang bằng Safari trên iPhone.'); continue; }
    MK.papers.push({ t: p.t, min: p.min, speak: p.speak, qs: p.parts.flatMap(([part, gen]) => gen().map(q => q.part && q.q ? q : { part, q })), res: [] }); }
  const empty = MK.papers.filter(p => !p.qs.length); if (empty.length) toast('Kho chưa đủ câu cho: ' + empty.map(p => p.t).join(', '));
  MK.papers = MK.papers.filter(p => p.qs.length); if (!MK.papers.length) return mockView(lv);
  if (!confirm(`${C.name}: ${MK.papers.map(p => `${p.t} ${p.qs.length} câu, ${p.min} phút`).join(' · ')}. Bắt đầu?`)) return mockView(lv);
  mkPaper(0); }
// chạy một bài thi: đếm giờ, không báo đúng / sai; nghe tối đa 2 lần mỗi bài như đề thật
function mkPaper(pi) { const P = MK.papers[pi], end = Date.now() + P.min * 60000, plays = {}; let i = 0; EXAM_VOX = /Nghe/.test(P.t);
  clearInterval(MK.tick); MK.tick = setInterval(() => { const el = document.getElementById('mkt'); if (!el) return; const s = Math.max(0, Math.round((end - Date.now()) / 1000));
    el.textContent = `⏱ ${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`; if (s <= 0) { toast('Hết giờ: bài thi tự nộp.'); finish(); } }, 1000);
  const finish = () => { clearInterval(MK.tick); EXAM_VOX = false; try { speechSynthesis.cancel(); } catch (e) {} if (P.speak) kAsrStop();
    for (let j = P.res.length; j < P.qs.length; j++) P.res.push({ ...P.qs[j], ok: false, ans: '', secs: 1, lat: 99 }); i = P.qs.length;
    return pi + 1 < MK.papers.length ? mkBreak(pi) : MK.done ? MK.done() : mkResult(); };
  if (P.speak) return (MK.speakRun || mkSpeakRun)(pi, finish);
  const show = () => { if (i >= P.qs.length) return finish(); const { part, q } = P.qs[i]; window.CUR = { view: 'de-thu-cau', item: MK.lv + ':' + P.t + ':' + i, prompt: String(q.q).replace(/<[^>]*>/g, '').slice(0, 200) };
    const body = q.kind === 'mc' ? (q.emo ? '<div class="emo3">' : '') + q.opts.map((o, k) => `<button class="opt${q.emo ? ' emo' : ''}" data-ko="${k}">${esc(o)}</button>`).join('') + (q.emo ? '</div>' : '')
      : q.kind === 'write' ? `<form id="kf" autocomplete="off"><textarea id="kt" rows="9" autocapitalize="sentences" spellcheck="false" aria-label="Bài viết"></textarea><p class="mute" id="kwc">0 từ</p><button class="pri" type="submit">Nộp bài viết</button></form>`
      : `<form id="kf" autocomplete="off"><input id="kt" autocapitalize="off" autocorrect="off" spellcheck="false" aria-label="Câu trả lời"><button class="pri" type="submit">Trả lời</button></form>`;
    const pk = q.play && q.play.key, left = () => (MK.plays || K_PLAYS) - (plays[pk] || 0);   // MK.plays: đề IELTS chỉ nghe 1 lần (ielts.js)
    $app.innerHTML = `<div class="row top"><button class="link" data-a="home">← Bỏ</button><span class="uname">${esc(P.t)} · ${i + 1}/${P.qs.length}</span><b id="mkt"></b></div>
      <p class="mute" style="margin:4px 0">${esc(part)}</p>${q.head || ''}${q.play ? `<button class="chip" data-kplay>🔊 Nghe (còn ${left()} lần)</button>` : ''}<p class="q">${q.q}</p>${body}${q.foot || ''}`;
    if (q.play && !plays[pk]) { plays[pk] = 1; kPlay(q.play); const b = $app.querySelector('[data-kplay]'); if (b) { b.textContent = `🔊 Nghe lại (còn ${left()} lần)`; b.disabled = left() <= 0; } }
    const rec = (ok, ans, sc) => { P.res.push({ part, q, ok, ans, sc }); i++; show(); };
    const f = document.getElementById('kf'), t = document.getElementById('kt');
    if (f) { if (q.kind === 'write') t.oninput = () => { document.getElementById('kwc').textContent = kWords(t.value).length + ' từ'; };
      f.onsubmit = e => { e.preventDefault(); if (!t.value.trim()) return t.focus(); const v = t.value;
        if (q.check) { const r = q.check(v); return rec(r.ok, v, r.sc); } rec((q.acc || [q.a]).some(a => kNorm(a) === kNorm(v)), v); }; }
    $app.onclick = e => { if (e.target.closest('[data-a="home"]')) { if (!confirm('Bỏ đề thử? Lần này không lưu.')) return; clearInterval(MK.tick); EXAM_VOX = false; return MK.quit ? MK.quit() : MK.back ? MK.back() : mockView(MK.lv); }
      const pb = e.target.closest('[data-kplay]'); if (pb) { if (left() > 0) { plays[pk]++; kPlay(q.play); } pb.textContent = `🔊 Nghe lại (còn ${left()} lần)`; pb.disabled = left() <= 0; return; }
      const o = e.target.closest('[data-ko]'); if (o && q.kind === 'mc') rec(mcOk(q, q.opts[+o.dataset.ko], P.res), q.opts[+o.dataset.ko]); }; };
  show(); }
function mkBreak(pi) { $app.innerHTML = `<div class="box"><b>Xong ${esc(MK.papers[pi].t)}</b><p>Bài tiếp: ${esc(MK.papers[pi + 1].t)} (${MK.papers[pi + 1].min} phút). Nghỉ một chút nếu cần.</p></div><button class="pri" data-a="next">▶ Bắt đầu</button>`;
  $app.onclick = e => { if (e.target.closest('[data-a="next"]')) mkPaper(pi + 1); }; }
function mkResult() { const { lv, C } = MK; for (const p of MK.papers) if (p.speak) p.sc = mkSpeakScore(p.res, lv);
  // bài viết tính theo điểm 4 tiêu chí (0–1) thay vì đạt / chưa (thi.js); câu khác 0 / 1
  // v121: lưu thêm kết quả từng phần (pp: { tên phần: [đúng, số câu] }, bài viết tính điểm 0–1) cho 🗺 bản đồ Cambridge (cbmap.js)
  const pp = p => { const by = {}; for (const r of p.res) { const o = by[r.part] = by[r.part] || [0, 0]; o[1]++; o[0] += r.sc != null ? r.sc : r.ok ? 1 : 0; } for (const k in by) by[k][0] = Math.round(by[k][0] * 100) / 100; return by; };
  const ps = MK.papers.map(p => p.sc ? { t: p.t, ok: p.sc.pct, n: 100, crit: p.sc.C } : { t: p.t, ok: Math.round(p.res.reduce((s, r) => s + (r.sc != null ? r.sc : r.ok ? 1 : 0), 0) * 10) / 10, n: p.res.length, pp: pp(p) }), full = MK.idx.length === C.papers.length;
  const pct = Math.round(ps.reduce((s, p) => s + p.ok / p.n, 0) / ps.length * 100), pass = pct >= C.pass * 100;
  // v122: kết quả từng bài (bài đọc / nghe, đề viết, bài dạng đề thật) cho danh sách bài ở màn Cambridge: S.cbx[id] = { at, ok, n } (bài viết: điểm máy 0–1)
  { const X = S.cbx = S.cbx || {}, by = {}; for (const p of MK.papers) if (!p.speak) for (const r of p.res) { const x = r.q && r.q.x; if (!x || !x.id || !x.lv || !(x.text || x.lines || x.p || x.paras || x.gaps || x.s1 || x.sp || x.items)) continue;   // v141: + bộ tin ngắn (items)
      const o = by[x.id] = by[x.id] || { at: Date.now(), ok: 0, n: 0 }; o.n++; o.ok += r.sc != null ? r.sc : r.ok ? 1 : 0; } for (const [id, o] of Object.entries(by)) X[id] = { ...o, ok: Math.round(o.ok * 100) / 100 }; }
  mkRuns(lv).push({ at: Date.now(), papers: ps, pct: full ? pct : null, pass: full && pass, ...(MK.one ? { one: 1 } : {}) }); S.t = Date.now(); save(); const back = MK.back;   // one: chỉ làm một phần / một bài (không phải cả bài thi)
  const parts = p => { const by = {}; for (const r of p.res) { const o = by[r.part] = by[r.part] || [0, 0]; o[1]++; if (r.ok) o[0]++; } return Object.entries(by).map(([k, [a, b]]) => `${esc(k)}: ${a}/${b}`).join('<br>'); };
  const wrong = MK.papers.filter(p => !p.speak).flatMap(p => p.res.filter(r => !r.ok && r.q.kind !== 'write').map(r => ({ p, r })));
  // ✍️ bài viết: điểm 4 tiêu chí của máy + nút nhờ AI chấm như giám khảo (thi.js)
  const wr = MK.papers.flatMap(p => p.res.filter(r => r.q.kind === 'write' && r.ans)), wHtml = wr.map(r => `<details class="box"><summary>✍️ ${esc(r.q.x.vi)}: máy chấm ${r.sc != null ? Math.round(r.sc * 100) + '%' : '–'}</summary>
    <p class="tdtap" style="white-space:pre-line;font-size:14px">${esc(r.ans)}</p>${typeof aiBtn === 'function' ? aiBtn('viet', lv, { prompt: r.q.x.p, genre: r.q.x.genre, min: r.q.x.min, max: r.q.x.max }, r.ans) : ''}</details>`).join('');
  const spk = MK.papers.filter(p => p.sc).map(p => { const d = p.sc.d; return `<details class="box" open><summary>🗣 Nói: ${p.sc.pct}% theo 4 tiêu chí giám khảo (máy đo gián tiếp)</summary>
    ${p.sc.C.map(([n, v]) => `<p style="margin:4px 0">${n}: <b>${v}%</b></p>${bar(v, C.pass * 100, 'var(--good)')}`).join('')}
    <p class="mute" style="margin:6px 0 0">🔁 Nhắc lại câu đúng ${d.eit}% từ · cấu trúc đề đòi ${d.struct == null ? '–' : d.struct + '%'} · từ đúng cấp trở lên ${d.voc}/${d.tV} · từ nối khác nhau ${d.links}/${d.tL} · tốc độ ${d.wpm}/${d.tW} từ/phút · lượt tương tác đạt ${d.rp == null ? '–' : d.rp + '%'}.</p>
    ${p.res.map(r => `<p style="margin:6px 0 0;font-size:14px"><span class="mute">${esc(r.part)}:</span> ${r.q.mode === 'eit' ? `câu gốc “${esc(r.q.s)}” · ` : ''}bạn nói “${esc(r.ans || '…')}”${r.q.mode === 'q' && r.q.need.length ? ` <span class="mute">(cần: ${r.q.need.map(k => (SPK_RE[k].test(String(r.ans || '').toLowerCase()) ? '✅ ' : '⬜ ') + SPK_REVI[k]).join(', ')})</span>` : ''}</p>`).join('')}
    <p class="mute" style="margin:6px 0 0">Máy không chấm được lỗi ngữ pháp trong lời nói tự do, nên đo qua nhắc lại câu, cấu trúc, độ dài, tốc độ. Chưa đối chiếu giám khảo thật: nên nói thử với giáo viên 1 buổi mỗi cấp.</p>
    ${typeof aiBtn === 'function' ? aiBtn('noi', lv, { prompt: 'Cambridge-style speaking test: interview, long turn, role play, discussion. Each answer below follows its question.' },
      p.res.filter(r => r.q.mode !== 'eit').map(r => `[${r.part}] ${r.q.mode === 'rp' ? (r.q.prev ? 'Examiner: ' + r.q.prev + ' / Task: ' + r.q.st.t : 'Task: ' + r.q.st.t) : 'Question: ' + r.q.q}\nCandidate: ${r.ans || '(no answer)'}`).join('\n\n')) : ''}</details>`; }).join('');
  $app.innerHTML = `<h1>🎓 Kết quả ${esc(C.name)}</h1>
    <div class="box">${ps.map(p => `<p style="margin:4px 0"><b>${p.t}</b> ${p.crit ? `${p.ok}% (4 tiêu chí)` : `${p.ok}/${p.n} (${Math.round(p.ok / p.n * 100)}%)`}</p>`).join('')}
      ${full ? `<p style="margin:6px 0 0"><b>Trung bình ${pct}% · ${pass ? '✅ ước đạt' : '❌ ước chưa đạt'}</b> (cần ${C.pass * 100}%, ngưỡng ước tính)</p>` : '<p class="mute">Chỉ làm một phần đề: chưa tính đạt.</p>'}</div>
    ${spk}${wHtml}${MK.papers.filter(p => !p.speak).map(p => `<details class="box"><summary>${p.t}: theo phần</summary><p class="mute">${parts(p)}</p></details>`).join('')}
    ${wrong.length ? `<details class="box"><summary>Xem lại ${wrong.length} câu sai</summary>${wrong.map(({ r }) => `<div style="margin:8px 0;border-top:1px solid var(--line, #ddd);padding-top:6px"><p class="mute" style="margin:0">${esc(r.part)}</p><p style="margin:2px 0">${r.q.q}</p>
      <p style="margin:2px 0">Bạn: ${esc(String(r.ans).slice(0, 300))}${r.q.kind === 'write' ? '' : ` · Đáp án: <b>${esc(r.q.a != null ? mcAns(r.q) : (r.q.acc || [])[0] || '')}</b>`}</p>${r.q.why && typeof r.q.why === 'string' ? `<p class="mute" style="margin:0">${esc(r.q.why)}</p>` : ''}</div>`).join('')}</details>` : ''}
    <p class="mute">Máy chấm; bài viết chấm đủ ý và dạng bài bằng từ khoá, không chấm ngữ pháp. Ôn phần thấp nhất rồi bấm làm đề mới (câu đổi mỗi lần).</p>
    ${back ? '<button class="pri" data-a="mkback">‹ Về bài thi</button><button data-a="again">🎓 Làm cả đề thử</button>' : MK.map ? '<button class="pri" data-a="map">🗺 Về bản đồ</button><button data-a="again">🎓 Làm cả đề thử</button>' : '<button class="pri" data-a="again">🎓 Làm đề mới</button>'}<button data-a="home">‹ Luyện thi</button>`;
  $app.onclick = e => { if (e.target.closest('[data-a="mkback"]')) { scrollTo(0, 0); return back(); } if (e.target.closest('[data-a="map"]')) { scrollTo(0, 0); return mapView('cb'); } if (e.target.closest('[data-a="again"]')) mockView(lv); if (e.target.closest('[data-a="home"]')) exHome(lv); }; }
