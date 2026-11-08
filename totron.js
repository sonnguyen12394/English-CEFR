// v147 🎓 Đề thử TOEIC trọn 200 câu, đúng giờ thật (specs/008-toeic-de-tron; người sáng lập 8/11/2026 "Làm đề thử trọn 200 câu đúng giờ thật đi", chọn: Nghe tự chạy
// như thi thật, Đọc 75 phút được nhảy câu / quay lại, không dừng nhưng vào lại làm tiếp, 2 đề cố định). KHÔNG đổi luật đo (luyện thi không tính 📘 Học / 🔁 Nhớ).
// Đề: toeic.json `tron` (content/toeic/tron.json, kiểm ở tools/build-toeic.mjs) = mã câu / bài của kho theo Part, đúng cơ cấu đề thật (6 · 25 · 39 · 30 · 30 · 16 · 54).
// Nghe: máy phát liên tục từng bài (giọng Kokoro n/, thiếu thì giọng máy), sau mỗi bài có giờ chọn (Part 1–2: TR_P12 giây; Part 3–4: TR_P34 giây mỗi câu, bài có bảng +4);
//   không dừng / nghe lại / quay lại; điện thoại chặn tự phát → nút "▶ Bấm để nghe tiếp", chưa tính giờ chọn. Câu hỏi Part 3–4 in sẵn trên màn (đề thật đọc to từng câu).
// Đọc: TR_RMIN phút theo đồng hồ thật (thoát app vẫn tính), một màn = câu Part 5 / đoạn Part 6 / bộ Part 7, ‹ Trước · Sau ›, 📋 bảng câu 101–200, ⚑ đánh dấu; hết giờ tự nộp.
// S.to.tron (đề đang dở) = { de, ph: 'L' | 'R', lAt, li, lEnd, rAt, ri, ans: { số câu: đáp án }, fl: { số câu: 1 }, gap: số lần gián đoạn, ps: đang gián đoạn (đã đếm), wn, up };
//   giữ TR_KEEP giờ kể từ lần lưu cuối. Thứ tự phương án cố định theo đề (trH), nên vào lại vẫn đúng chữ A–D.
// Kết quả: điểm ước toScale theo tỉ lệ đúng (KHÔNG phải bảng quy đổi ETS), đúng từng Part, thời gian, gián đoạn, so lần trước cùng đề, ô 🎯 Sai ở đâu (hoclai.js);
//   S.to.mock (full: 1, de) cho điểm ước ở màn TOEIC; bản đồ toLog 'thi' (câu đã chọn); S.to.r (bài đã gặp: luyện sau ưu tiên bài chưa gặp).
const TR_RMIN = 75, TR_KEEP = 3, TR_P12 = 5, TR_P34 = 8, TR_SECS = { p1: 'Part 1', p2: 'Part 2', p3: 'Part 3', p4: 'Part 4', p5: 'Part 5', p6: 'Part 6', p7: 'Part 7' };
const TR = { k: 1, tok: 0, tm: 0, on: '', B: {} };   // k: hệ số giờ (test đặt nhỏ) · tok: lượt phát / đếm giờ đang chạy · tm: đồng hồ · on: 'L' | 'R' | '' · B: đề đã dựng
const TR_VIEW = 'toeic-de-thu-tron';   // CUR.view có "de-thu": tắt chạm từ để tra (tudien.js TD_NOTAP)
const trSt = () => toSt().tron || null;
const trH = s => { let h = 0x811c9dc5; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; } return h; };
const trMMSS = ms => { const s = Math.max(0, Math.round(ms / 1000)); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`; };
const trName = de => ((TO && TO.tron || []).find(d => d.id === de) || { t: de }).t;
const trLeft = st => st.rAt + TR_RMIN * 60000 * TR.k - Date.now();

// ---------- dựng đề: đơn vị (bài / câu) và 200 câu đánh số 1–200 ----------
function trB(de) { if (TR.B[de]) return TR.B[de]; const d = (TO.tron || []).find(x => x.id === de); if (!d) return null;
  const mk = { p1: x => [toP1Q(x)], p2: x => [toP2Q(x)], p3: x => toTalkQs(x, 'p3'), p4: x => toTalkQs(x, 'p4'), p5: x => [toP5Q(x)], p6: toP6Qs, p7: toP7Qs }, U = []; let n = 0;
  for (const s of Object.keys(mk)) { const ix = Object.fromEntries(TO[s].map(x => [x.id, x]));
    for (const id of d[s] || []) { const x = ix[id]; if (!x) continue;
      const qs = mk[s](x).map(q => { n++; const fix = q.opts.every(t => /^[A-D]$/.test(t) || /^\[\d\]$/.test(t)); return { ...q, n, opts: fix ? [...q.opts].sort() : [...q.opts].sort((a, b) => trH(de + n + a) - trH(de + n + b)) }; });
      U.push({ sec: s, x, qs, a: qs[0].n, b: qs[qs.length - 1].n }); } }
  return (TR.B[de] = { d, U, Q: U.flatMap(u => u.qs), L: U.filter(u => /^p[1-4]$/.test(u.sec)), R: U.filter(u => /^p[5-7]$/.test(u.sec)) }); }

// ---------- âm thanh: phát từng câu, biết khi xong, biết khi bị chặn ----------
function trHush() { try { AUD && AUD.pause(); } catch (e) {} try { speechSynthesis.cancel(); } catch (e) {} sayTok++; }
function trTts(t, sp, est) { return new Promise(res => { let done = false; const end = () => { if (!done) { done = true; clearTimeout(w); res('ok'); } }, w = setTimeout(end, (est + 2000) * Math.min(1, TR.k));
  try { const vs = vGB(enVoices()).length ? vGB(enVoices()) : enVoices(), f = vs.find(v => vSex(v) === 'f') || vs[0], m = vs.find(v => vSex(v) === 'm') || vs.find(v => v !== f) || f, f2 = vs.find(v => vSex(v) === 'f' && v !== f) || f;
    const u = new SpeechSynthesisUtterance(t), v = sp === 'B' ? m : sp === 'C' ? f2 : f; u.lang = v ? v.lang : 'en-GB'; if (v) u.voice = v; u.rate = 1; if (sp === 'B' && m === f) u.pitch = 0.7; if (sp === 'C' && f2 === f) u.pitch = 1.3;
    u.onend = u.onerror = end; speechSynthesis.speak(u); } catch (e) { end(); } }); }
function trSay(t, sp) { const k = clipKey(t), est = 1500 + kWords(t).length * 450; if (!NCLIPS.has(k)) return trTts(t, sp, est);
  return new Promise(res => { AUD = AUD || new Audio(); let done = false; const end = r => { if (!done) { done = true; clearTimeout(w); res(r); } }, w = setTimeout(() => end('ok'), (est * 3 + 5000) * Math.min(1, TR.k));   // tệp không báo xong: không kẹt (TR.k < 1: test chạy nhanh)
    AUD.onended = () => end('ok'); AUD.onerror = () => { if (!done) { done = true; clearTimeout(w); trTts(t, sp, est).then(res); } };
    AUD.src = 'n/' + k + '.mp3'; try { AUD.defaultPlaybackRate = AUD.playbackRate = 1; } catch (e) {}
    const pr = AUD.play(); if (pr && pr.catch) pr.catch(e => end(e && e.name === 'NotAllowedError' ? 'blocked' : 'ok')); }); }
async function trPlayUnit(u, tok) { EXAM_VOX = true; const L = u.x.lines || kSents(u.x.text || '').map(t => ['A', t]);
  for (const [sp, t] of L) { if (tok !== TR.tok) return 'stop'; const r = await trSay(t, sp); if (r === 'blocked') return r; }
  return tok === TR.tok ? 'ok' : 'stop'; }

// ---------- màn chọn đề + quy chế ----------
const TR_RULE = () => ['Đeo tai nghe, ngồi chỗ yên tĩnh, để trống khoảng 2 giờ liền.',
  `Nghe (Part 1–4): máy phát liên tục, mỗi bài một lần. Part 1–2 có ${TR_P12} giây chọn sau mỗi câu; Part 3–4 có ${TR_P34} giây mỗi câu sau mỗi bài (câu hỏi in sẵn trên màn, đọc trước khi nghe). Không dừng, không nghe lại, không quay lại.`,
  `Đọc (Part 5–7): ${TR_RMIN} phút. Làm câu nào trước cũng được, ⚑ đánh dấu câu muốn xem lại, 📋 bảng câu để nhảy tới câu bất kỳ. Hết giờ máy tự nộp.`,
  `Lỡ thoát app: vào lại trong ${TR_KEEP} giờ để làm tiếp. Nghe phát lại bài đang dở, đáp án đã chọn vẫn giữ; Đọc vẫn tính giờ thật. Số lần gián đoạn ghi ở kết quả.`,
  'Điểm là ước lượng theo tỉ lệ đúng, không phải bảng quy đổi của ETS. Không tính vào 📘 Học / 🔁 Nhớ.'];
// dòng ở màn TOEIC (phần 📚 Đề có sẵn): đề đang dở hoặc lối vào
function trRow() { if (typeof TO === 'undefined' || !TO || !(TO.tron || []).length) return ''; const st = trSt(), fresh = st && Date.now() - st.up <= TR_KEEP * 36e5;
  const M = (toSt().mock || []).filter(r => r.full && r.de), last = M[M.length - 1];
  return `<div class="box hcard" style="margin:12px 0 0"><button class="hrow" data-trv><span class="ic">${fresh ? '⏸' : '🎓'}</span><span class="t"><b>${fresh ? 'Làm tiếp đề thử trọn · ' + esc(trName(st.de)) : 'Đề thử trọn 200 câu'}</b>
    <small>${fresh ? esc(trWhere(st)) : `2 giờ như thi thật · ${TO.tron.length} đề${last ? ` · lần gần nhất ≈ ${last.tot}` : ''}`}</small></span><span class="chev">›</span></button></div>`; }
const trWhere = st => st.ph === 'L' ? `Đang ở phần Nghe, câu ${((trB(st.de) || { L: [] }).L[st.li] || { a: 1 }).a} / 100` : st.rAt ? `Phần Đọc còn ${trMMSS(trLeft(st))}` : 'Xong phần Nghe, chưa bắt đầu Đọc';
async function trReady0() { if (!TO) await toLoad(); if (!NCLIPS.size) try { NCLIPS = new Set(await (await fetch('n/index.json?v=' + APP_V)).json()); } catch (e) {} }
async function trView() { BACK = null; window.CUR = { view: TR_VIEW }; EXAM_VOX = false; TR.on = ''; TR.tok++; clearInterval(TR.tm);
  if (!TO || !NCLIPS.size) { $app.innerHTML = '<div id="ie"></div><p class="mute">Đang tải…</p>'; try { await trReady0(); } catch (e) { $app.innerHTML = '<div id="ie"></div><p>Không tải được dữ liệu TOEIC. Thử lại sau.</p>'; return; } }
  let st = trSt(), gone = false; if (st && Date.now() - st.up > TR_KEEP * 36e5) { toSt().tron = null; S.t = Date.now(); save(); st = null; gone = true; }
  const M = (toSt().mock || []).filter(r => r.full && r.de), last = de => M.filter(r => r.de === de).slice(-1)[0];
  $app.innerHTML = `<div id="ie"></div><div class="row top"><button class="link tap" data-trb>‹ TOEIC</button></div>
    <h1>🎓 Đề thử trọn 200 câu</h1><p class="mute" style="margin:0 0 10px">Như thi thật: Nghe 100 câu khoảng 45 phút, máy tự chạy · Đọc 100 câu trong ${TR_RMIN} phút.</p>
    ${gone ? `<div class="box"><p style="margin:0">Đề thử dở quá ${TR_KEEP} giờ nên đã huỷ. Làm lại từ đầu nhé.</p></div>` : ''}
    ${st ? `<div class="box"><b>⏸ ${esc(trName(st.de))} đang dở</b><p class="mute" style="margin:4px 0 8px">${esc(trWhere(st))} · giữ tới ${new Date(st.up + TR_KEEP * 36e5).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</p>
      <button class="pri" data-trgo="resume">▶ Làm tiếp</button><button class="link tap" data-trdrop>Bỏ đề này, làm lại từ đầu</button></div>` : ''}
    <div class="box hcard">${(TO.tron || []).map(d => { const r = last(d.id); return `<button class="hrow" data-trgo="${d.id}"${st ? ' disabled' : ''}><span class="ic">📝</span><span class="t"><b>${esc(d.t)}</b>
      <small>${r ? `Lần trước ≈ ${r.tot} điểm (Nghe ${r.b.L} · Đọc ${r.b.R}) · ${new Date(r.at).toLocaleDateString('vi-VN')}` : 'Chưa làm'}</small></span><span class="chev">›</span></button>`; }).join('')}</div>
    ${st ? '<p class="mute" style="font-size:14px">Đang có đề dở: làm tiếp hoặc bỏ đề đó trước khi bắt đầu đề khác.</p>' : ''}
    <details class="box"${st ? '' : ' open'}><summary><b>📋 Quy chế như thi thật</b></summary><ol style="margin:6px 0 0;padding-left:22px">${TR_RULE().map(t => `<li style="margin:4px 0">${esc(t)}</li>`).join('')}</ol></details>
    <p class="mute" style="font-size:13px">TOEIC là thương hiệu của ETS; đề do app soạn theo cơ cấu đề thật, không chép đề ETS. 🤖 Claude soạn, chưa giáo viên kiểm.</p>`;
  $app.onclick = e => { const g = s => e.target.closest(s); let b;
    if (g('[data-trb]')) return toeicView();
    if ((b = g('[data-trgo]'))) { if (b.disabled) return; scrollTo(0, 0); return b.dataset.trgo === 'resume' ? trResume() : trReady(b.dataset.trgo); }
    if (g('[data-trdrop]')) { if (!confirm('Bỏ đề đang dở? Đáp án đã chọn sẽ mất.')) return; toSt().tron = null; S.t = Date.now(); save(); return trView(); } };
  scrollTo(0, 0); }
// màn sẵn sàng: cú bấm "Bắt đầu" là thao tác của người dùng nên điện thoại cho phát âm thanh liên tục sau đó
function trReady(de) { const d = (TO.tron || []).find(x => x.id === de); if (!d) return trView(); window.CUR = { view: TR_VIEW };
  $app.innerHTML = `<div id="ie"></div><div class="row top"><button class="link tap" data-trv>‹ Đề thử trọn</button></div><h1>📝 ${esc(d.t)}</h1>
    <div class="box"><p style="margin:0">Phần Nghe bắt đầu ngay khi bấm nút. Đeo tai nghe và chỉnh âm lượng trước.</p><div class="chips tap" style="margin:8px 0 0"><button class="chip" data-trtest>🔊 Thử âm thanh</button></div></div>
    <button class="btnbig" data-trstart="${esc(de)}">▶ Bắt đầu phần Nghe<small>100 câu · khoảng 45 phút · không dừng</small></button>`;
  $app.onclick = e => { const b = e.target.closest('[data-trstart]'); if (b) return trStart(b.dataset.trstart); if (e.target.closest('[data-trtest]')) { EXAM_VOX = true; speak('This is a sound check. If you can hear this clearly, you are ready.'); } }; scrollTo(0, 0); }
function trStart(de) { if (!trB(de)) return trView(); const now = Date.now(); toSt().tron = { de, ph: 'L', lAt: now, li: 0, ans: {}, fl: {}, gap: 0, ps: 0, up: now }; S.t = now; save(); trL(); }
function trResume() { const st = trSt(); if (!st) return trView(); if (!st.ps) st.gap = (st.gap || 0) + 1; st.ps = 0; st.up = Date.now(); S.t = st.up; save();
  if (st.ph === 'L') return trL(false); return st.rAt ? trR() : trRReady(); }

// ---------- phần Nghe ----------
const trOpts = (q, st, plain) => `<div class="trop${plain ? ' abcd' : ''}">${q.opts.map((o, j) => { const on = st.ans[q.n] === o; return `<button class="opt${on ? ' sel' : ''}" data-tra="${q.n}|${j}" aria-pressed="${on}">${plain ? `(${esc(o)})` : `(${'ABCD'[j]}) ${esc(o)}`}</button>`; }).join('')}</div>`;
const trQHead = (q, st, fl) => `<p style="margin:12px 0 6px"><b>${q.n}.</b> ${q.q}${fl ? ` <button class="chip trfl${st.fl[q.n] ? ' on' : ''}" data-trf="${q.n}" aria-pressed="${!!st.fl[q.n]}" aria-label="Đánh dấu câu ${q.n}">⚑</button>` : ''}</p>`;
function trLBody(u, st) { const q0 = u.qs[0];
  if (u.sec === 'p1') return `${toPic(u.x.pic)}<p style="margin:10px 0 6px"><b>${q0.n}.</b> Nghe 4 câu, chọn câu tả đúng tranh.</p>${trOpts(q0, st, 1)}`;
  if (u.sec === 'p2') return `<p style="margin:10px 0 6px"><b>${q0.n}.</b> Nghe câu hỏi và 3 lời đáp (đề không in chữ).</p>${trOpts(q0, st, 1)}`;
  return `${u.x.g ? toGraph(u.x.g) : ''}<p class="mute" style="margin:6px 0 0">Câu ${u.a}–${u.b}: đọc trước câu hỏi, nghe bài, rồi chọn.</p>${u.qs.map(q => trQHead(q, st) + trOpts(q, st)).join('')}`; }
// play = false: vào lại sau gián đoạn → chờ người dùng bấm (điện thoại cần một lần bấm mới cho phát), bài phát lại từ đầu
function trL(play = true) { const st = trSt(); if (!st) return trView(); const B = trB(st.de), u = B.L[st.li]; if (!u) return trLEnd();
  TR.on = 'L'; const tok = ++TR.tok; window.CUR = { view: TR_VIEW, item: 'L' + u.a }; trHush();
  $app.innerHTML = `<div id="ie"></div><div class="row top"><button class="link tap" data-trx>✕ Thoát</button><span class="uname">🎧 ${TR_SECS[u.sec]} · câu ${u.a}${u.b > u.a ? '–' + u.b : ''}/100</span><b id="trT"></b></div>
    <div id="trS" class="box trstat">${play ? '<b>🔊 Đang phát…</b>' : `<p style="margin:0 0 8px">⏸ Bị gián đoạn. Bài này sẽ phát lại từ đầu; đáp án đã chọn vẫn giữ.</p><button class="pri" data-trplay>▶ Nghe tiếp từ câu ${u.a}</button>`}</div>${trLBody(u, st)}`;
  $app.onclick = trClick; trTick(); scrollTo(0, 0); if (!play) return;
  trPlayUnit(u, tok).then(r => { if (tok !== TR.tok) return; if (r === 'blocked') { const el = document.getElementById('trS'); if (el) el.innerHTML = '<p style="margin:0 0 8px">Điện thoại chặn tự phát âm thanh. Giờ chọn chưa tính.</p><button class="pri" data-trplay>▶ Bấm để nghe tiếp</button>'; return; } trWin(u, tok); }); }
// giờ chọn sau mỗi bài; hết giờ thì sang bài sau (đáp án của bài này khoá lại)
function trWin(u, tok) { const s0 = u.sec === 'p1' || u.sec === 'p2' ? TR_P12 : TR_P34 * u.qs.length + (u.x.g ? 4 : 0), t1 = Date.now() + s0 * 1000 * TR.k;
  const step = () => { if (tok !== TR.tok) return; const ms = t1 - Date.now(), el = document.getElementById('trS'); if (ms <= 0) return trLNext(tok);
    if (el) el.innerHTML = `<b>⏱ Còn ${Math.ceil(ms / 1000)} giây</b> · chọn đáp án${bar(ms / 10 / s0 / TR.k, 100, 'var(--accent)')}`; setTimeout(step, Math.min(250, ms)); };
  step(); }
function trLNext(tok) { if (tok !== undefined && tok !== TR.tok) return; const st = trSt(); if (!st) return; st.li++; st.up = Date.now(); S.t = st.up; save(); trL(); }
function trLEnd() { const st = trSt(); TR.on = ''; TR.tok++; clearInterval(TR.tm); trHush(); EXAM_VOX = false; if (st.ph === 'L') { st.ph = 'R'; st.lEnd = Date.now(); st.up = st.lEnd; S.t = st.up; save(); } trRReady(); }

// ---------- phần Đọc ----------
function trRReady() { const st = trSt(); if (!st) return trView(); TR.on = ''; window.CUR = { view: TR_VIEW };
  $app.innerHTML = `<div id="ie"></div><div class="row top"><button class="link tap" data-trx>✕ Thoát</button></div><h1>✅ Xong phần Nghe</h1>
    <div class="box"><p style="margin:0">Phần Đọc: 100 câu (Part 5–7), ${TR_RMIN} phút. Làm câu nào trước cũng được; ⚑ đánh dấu câu muốn xem lại; hết giờ máy tự nộp.</p><p class="mute" style="margin:6px 0 0">Đề thật chuyển ngay sang Đọc, không nghỉ.</p></div>
    <button class="btnbig" data-trrs>▶ Bắt đầu phần Đọc<small>${TR_RMIN} phút tính từ lúc bấm</small></button>`;
  $app.onclick = trClick; scrollTo(0, 0); }
function trRStart() { const st = trSt(); if (!st) return trView(); if (!st.rAt) { st.rAt = Date.now(); st.ri = 0; st.up = st.rAt; S.t = st.up; save(); } trR(); }
const trDocs = x => x.docs.map(d => `<div class="box"><b style="font-size:15px">${esc(d.title)}</b><p style="font-size:16px;line-height:1.6;margin:6px 0 0;white-space:pre-line">${esc(d.text)}</p></div>`).join('');
function trRBody(u, st) {
  if (u.sec === 'p5') { const q = u.qs[0]; return `<p class="mute" style="margin:6px 0 0">Part 5: chọn từ / cụm điền vào chỗ trống.</p>${trQHead(q, st, 1)}${trOpts(q, st)}`; }
  const head = u.sec === 'p6' ? `<p class="mute" style="margin:6px 0 4px">Câu ${u.a}–${u.b}: chọn phương án cho mỗi chỗ trống (có một chỗ phải chèn cả câu).</p><div class="box"><p class="mute" style="margin:0">${esc(u.x.kind)}</p><b style="font-size:15px">${esc(u.x.title)}</b>
      <p style="font-size:16px;line-height:1.7;margin:8px 0 0">${esc(u.x.text).replace(/\{(\d)\}/g, (_, n) => `<b>(${u.a + +n - 1})</b> -------`)}</p></div>`
    : `<p class="mute" style="margin:6px 0 4px">Câu ${u.a}–${u.b}: ${esc(u.x.kind)}${u.x.docs.length > 1 ? ' · có câu phải đối chiếu nhiều văn bản' : ''}.</p>${trDocs(u.x)}`;
  return head + u.qs.map(q => (u.sec === 'p6' ? `<p style="margin:12px 0 6px"><b>${q.n}.</b> <button class="chip trfl${st.fl[q.n] ? ' on' : ''}" data-trf="${q.n}" aria-pressed="${!!st.fl[q.n]}" aria-label="Đánh dấu câu ${q.n}">⚑</button></p>` : trQHead(q, st, 1)) + trOpts(q, st)).join(''); }
function trR() { const st = trSt(); if (!st) return trView(); if (!st.rAt) return trRReady(); if (trLeft(st) <= 0) return trSubmit(true);
  const B = trB(st.de); st.ri = Math.max(0, Math.min(B.R.length - 1, st.ri || 0)); const u = B.R[st.ri]; TR.on = 'R'; TR.tok++; window.CUR = { view: TR_VIEW, item: 'R' + u.a };
  $app.innerHTML = `<div id="ie"></div><div class="row top"><button class="link tap" data-trx>✕ Thoát</button><span class="uname">📖 ${TR_SECS[u.sec]} · câu ${u.a}${u.b > u.a ? '–' + u.b : ''}</span><b id="trT"></b></div>
    ${trRBody(u, st)}<div class="row trnav">${st.ri > 0 ? '<button data-trp>‹ Trước</button>' : '<span></span>'}<button data-trg>📋 Bảng câu</button>${st.ri < B.R.length - 1 ? '<button class="pri" data-trn>Sau ›</button>' : '<button class="pri" data-trsub>Nộp bài</button>'}</div>`;
  $app.onclick = trClick; trTick(); scrollTo(0, 0); }
function trGrid() { const st = trSt(); if (!st) return trView(); const B = trB(st.de), Rq = B.R.flatMap(u => u.qs), uOf = q => B.R.findIndex(u => u.qs.includes(q)), un = Rq.filter(q => !st.ans[q.n]).length; TR.on = 'R';
  $app.innerHTML = `<div id="ie"></div><div class="row top"><button class="link tap" data-trj="${st.ri}">‹ Về câu đang làm</button><b id="trT"></b></div><h1>📋 Bảng câu 101–200</h1>
    <p class="mute" style="margin:0 0 8px">${100 - un}/100 câu đã chọn · ${Object.keys(st.fl).length} câu ⚑. Chạm số câu để tới câu đó.</p>
    <div class="trgrid">${Rq.map(q => `<button class="trc${st.ans[q.n] ? ' done' : ''}${st.fl[q.n] ? ' fl' : ''}${uOf(q) === st.ri ? ' cur' : ''}" data-trj="${uOf(q)}" aria-label="Câu ${q.n}${st.ans[q.n] ? ', đã chọn' : ', chưa chọn'}${st.fl[q.n] ? ', có đánh dấu' : ''}">${q.n}${st.fl[q.n] ? '⚑' : st.ans[q.n] ? '✓' : ''}</button>`).join('')}</div>
    <button class="pri" data-trsub style="margin-top:12px">Nộp bài</button>`;
  $app.onclick = trClick; trTick(); scrollTo(0, 0); }
// đồng hồ: Nghe = đã nghe bao lâu; Đọc = còn bao lâu (đồng hồ thật), nhắc khi còn 10 và 5 phút, hết thì tự nộp
function trTick() { clearInterval(TR.tm); const f = () => { const st = trSt(), el = document.getElementById('trT'); if (!st || !TR.on) return clearInterval(TR.tm);
    if (TR.on === 'R') { const ms = trLeft(st); if (ms <= 0) { clearInterval(TR.tm); return trSubmit(true); } if (el) { el.textContent = '⏱ ' + trMMSS(ms); el.style.color = ms < 5 * 60000 * TR.k ? 'var(--bad)' : ''; }
      for (const m of [10, 5]) if (ms <= m * 60000 * TR.k && !(st.wn || {})[m]) { st.wn = Object.assign({}, st.wn, { [m]: 1 }); toast(`Còn ${m} phút phần Đọc.`); } }
    else if (el) el.textContent = '⏱ ' + trMMSS(Date.now() - st.lAt); };
  f(); TR.tm = setInterval(f, 1000); }
function trMark(q, st) { document.querySelectorAll(`[data-tra^="${q.n}|"]`).forEach(b => { const on = q.opts[+b.dataset.tra.split('|')[1]] === st.ans[q.n]; b.classList.toggle('sel', on); b.setAttribute('aria-pressed', String(on)); }); }
function trClick(e) { const g = s => e.target.closest(s), st = trSt(); let b; if (!st) return;
  if ((b = g('[data-tra]'))) { const [n, j] = b.dataset.tra.split('|'), B = trB(st.de), q = B.Q[+n - 1]; if (!q) return;
    if (TR.on === 'L' && !(B.L[st.li] || { qs: [] }).qs.includes(q)) return;   // Nghe: chỉ chọn được câu của bài đang phát
    if (TR.on !== 'L' && TR.on !== 'R') return; st.ans[n] = q.opts[+j]; st.up = Date.now(); S.t = st.up; save(); return trMark(q, st); }
  if ((b = g('[data-trf]'))) { const n = b.dataset.trf; if (st.fl[n]) delete st.fl[n]; else st.fl[n] = 1; save(); b.classList.toggle('on', !!st.fl[n]); b.setAttribute('aria-pressed', String(!!st.fl[n])); return; }
  if (g('[data-trn]')) { st.ri++; save(); return trR(); }
  if (g('[data-trp]')) { st.ri = Math.max(0, st.ri - 1); save(); return trR(); }
  if (g('[data-trg]')) return trGrid();
  if ((b = g('[data-trj]'))) { st.ri = +b.dataset.trj || 0; save(); return trR(); }
  if (g('[data-trsub]')) { const B = trB(st.de), un = B.R.flatMap(u => u.qs).filter(q => !st.ans[q.n]).length, fl = Object.keys(st.fl).length;
    if (!confirm(`Nộp bài?${un ? ` Còn ${un} câu chưa chọn.` : ''}${fl ? ` Có ${fl} câu ⚑ đánh dấu.` : ''}`)) return; return trSubmit(false); }
  if (g('[data-trplay]')) return trL(true);
  if (g('[data-trrs]')) return trRStart();
  if (g('[data-trx]')) { if (!confirm(`Thoát đề thử? Đề được giữ ${TR_KEEP} giờ để làm tiếp${st.ph === 'R' && st.rAt ? '; giờ Đọc vẫn chạy' : ''}.`)) return; const live = TR.on;
    TR.on = ''; TR.tok++; clearInterval(TR.tm); trHush(); EXAM_VOX = false; if (live && !st.ps) { st.ps = 1; st.gap = (st.gap || 0) + 1; } st.up = Date.now(); S.t = st.up; save(); return toeicView(); } }   // thoát lúc đang làm = một lần gián đoạn
// gián đoạn (khoá màn, chuyển app): Nghe dừng ngay, khi quay lại phát lại bài đang dở; Đọc vẫn tính giờ thật. Mỗi lần gián đoạn đếm một lần (ps: đã đếm)
document.addEventListener('visibilitychange', () => { if (!S || !TR.on) return; const st = trSt(); if (!st) return;
  if (document.hidden) { if (TR.on === 'L') { TR.tok++; trHush(); } if (!st.ps) { st.ps = 1; st.gap = (st.gap || 0) + 1; } st.up = Date.now(); S.t = st.up; save(); return; }
  st.ps = 0; save(); if (TR.on === 'L') trL(false); else if (TR.on === 'R') trR(); });

// ---------- nộp bài + kết quả ----------
function trSubmit(auto) { const st = trSt(); if (!st) return trView(); TR.on = ''; TR.tok++; clearInterval(TR.tm); trHush(); EXAM_VOX = false;
  const B = trB(st.de), now = Date.now(), o = toSt();
  const res = B.Q.map(q => { const a = st.ans[q.n]; return { q, n: q.n, part: TR_SECS[q.sec], ok: a != null && a === q.a, ans: a == null ? '' : a }; });
  const okL = res.filter(r => r.n <= 100 && r.ok).length, okR = res.filter(r => r.n > 100 && r.ok).length, b = { L: toScale(okL, 100), R: toScale(okR, 100) }, by = {};
  for (const r of res) { const p = by[r.part] = by[r.part] || [0, 0]; p[1]++; if (r.ok) p[0]++; }
  const prev = (o.mock || []).filter(m => m.full && m.de === st.de).slice(-1)[0];
  try { toLog(res.filter(r => r.ans !== ''), 'thi'); } catch (e) {}   // bản đồ điểm: chỉ câu đã chọn (câu bỏ trống không nói gì về dạng câu)
  for (const u of B.U) { const rs = res.filter(r => r.q.x === u.x); o.r[u.x.id] = { at: now, ok: rs.filter(r => r.ok).length, n: rs.length, k: u.sec }; }
  const rec = { at: now, b, tot: b.L + b.R, full: 1, de: st.de, ok: { L: okL, R: okR }, by, min: { L: Math.round(((st.lEnd || now) - st.lAt) / 60000), R: st.rAt ? Math.round(Math.min(now - st.rAt, TR_RMIN * 60000) / 60000) : 0 }, gap: st.gap || 0, ...(auto ? { auto: 1 } : {}) };
  o.mock.push(rec); o.tron = null; S.t = now; save(); trRes(rec, res, prev); }
function trRes(rec, res, prev) { window.CUR = { view: 'toeic-tron-kq' }; const tg = toSt().target, hb = typeof hlBox === 'function' ? hlBox(res, { src: 'thi' }) : { html: '', pri: false }, d = rec.tot - (prev ? prev.tot : 0);
  $app.innerHTML = `<div id="ie"></div><h1>🎓 Kết quả ${esc(trName(rec.de))}</h1>
    <div class="box"><p style="margin:0;font-size:20px"><b>Tổng ≈ ${rec.tot}</b> ${rec.tot >= tg ? '✅' : '⬜'} <span class="mute" style="font-size:14px">(mục tiêu ${tg})</span></p>
      <p style="margin:6px 0 0">🎧 Nghe ≈ <b>${rec.b.L}</b> · ${rec.ok.L}/100 câu đúng</p><p style="margin:4px 0 0">📖 Đọc ≈ <b>${rec.b.R}</b> · ${rec.ok.R}/100 câu đúng</p>
      ${prev ? `<p style="margin:6px 0 0">So lần trước (${new Date(prev.at).toLocaleDateString('vi-VN')}): <b>${d >= 0 ? '+' : ''}${d}</b> điểm</p>` : ''}
      <p class="mute" style="margin:6px 0 0">${Object.entries(rec.by).map(([k, [a, n]]) => `${k}: ${a}/${n}`).join(' · ')}</p>
      <p class="mute" style="margin:6px 0 0">⏱ Nghe ${rec.min.L} phút · Đọc ${rec.min.R}/${TR_RMIN} phút${rec.auto ? ' (hết giờ, máy tự nộp)' : ''}${rec.gap ? ` · ⚠️ gián đoạn ${rec.gap} lần: điểm Nghe có thể cao hơn thi thật` : ''}</p>
      <p class="mute" style="margin:6px 0 0">Điểm ước theo tỉ lệ đúng, KHÔNG phải bảng quy đổi của ETS (ETS quy đổi riêng từng đề). Tranh Part 1 là tranh vẽ; đề ít bài có bảng hơn đề thật.</p></div>
    ${hb.html}<button class="${hb.pri ? '' : 'pri'}" data-trv>🎓 Về danh sách đề thử trọn</button><button data-trb>← TOEIC</button>`;
  $app.onclick = e => { if (e.target.closest('[data-trb]')) toeicView(); }; scrollTo(0, 0); }
document.addEventListener('click', e => { if (S && e.target.closest('[data-trv]')) { scrollTo(0, 0); trView(); } });
