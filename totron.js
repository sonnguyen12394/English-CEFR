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
const TR_LMIN = 20, TR_RMIN = 75, TR_KEEP = 3,   // TR_LMIN: phần Nghe của app ~19–20 phút (âm thanh ~7 phút + giờ chọn ~12 phút; đề thật ~45 phút)
  TR_P12 = 5, TR_P34 = 8, TR_SECS = { p1: 'Part 1', p2: 'Part 2', p3: 'Part 3', p4: 'Part 4', p5: 'Part 5', p6: 'Part 6', p7: 'Part 7' };
const TR = { k: 1, tok: 0, tm: 0, on: '', B: {}, D: {} };   // k: hệ số giờ (test đặt nhỏ) · tok: lượt phát / đếm giờ đang chạy · tm: đồng hồ · on: 'L' | 'R' | '' · B: đề đã dựng · D: tệp đề mới đã tải (v149)
const TR_VIEW = 'toeic-de-thu-tron';   // CUR.view có "de-thu": tắt chạm từ để tra (tudien.js TD_NOTAP)
const trSt = () => toSt().tron || null;
const trH = s => { let h = 0x811c9dc5; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; } return h; };
const trMMSS = ms => { const s = Math.max(0, Math.round(ms / 1000)); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`; };
const trMeta = de => ((typeof TO !== 'undefined' && TO && TO.tron) || []).find(d => d.id === de);
const trName = de => (trMeta(de) || { t: de }).t;
// v149 (specs/010-toeic-10-de-tron): Đề 3 → 12 ở tệp riêng toeic-tron/deN.json (câu chỉ dùng trong đề trọn, không vào kho luyện); tải khi vào đề. Đề 1–2 dựng từ kho như v147
async function trLoad(de) { const d = trMeta(de); if (!d || !d.f || TR.D[de]) return !!d;
  try { const r = await Promise.race([fetch(d.f + '?v=' + APP_V), new Promise((_, no) => setTimeout(() => no(new Error('quá giờ')), 20000))]); if (!r.ok) throw new Error(String(r.status)); TR.D[de] = await r.json(); return true; } catch (e) { return false; } }
const trLeft = st => st.rAt + (st.rMin || trRMin(st.only)) * 60000 * TR.k - Date.now();
// v150 chỉ làm một phần (người sáng lập 8/11/2026: "muốn có thể lựa chọn phần để làm bài chứ không nhất thiết phải làm hết từ đầu"): st.only = 'L' | 'R' | 'p1'…'p7'.
//   Giữ quy chế của phần đó (Nghe tự chạy, Đọc có giờ); Part 5 / 6 / 7 riêng lẻ có giờ theo nhịp hay khuyên (ý kiến của Claude, cộng = 75 phút). Kết quả KHÔNG vào điểm đề thử trọn (S.to.mock), lưu S.to.tronP; 📋 bài làm lưu riêng tronA['deN:phần'].
const TR_PMIN = { p5: 11, p6: 9, p7: 55 };
const trIsL = o => o === 'L' || /^p[1-4]$/.test(o || '') || /^cL/.test(o || '');
const trIn = (sec, o) => !o || o === sec || (o === 'L' && /^p[1-4]$/.test(sec)) || (o === 'R' && /^p[5-7]$/.test(sec));
const trRMin = o => !o || o === 'R' ? TR_RMIN : TR_PMIN[o] || TR_RMIN;
const trOnlyName = (o, de) => { if (trIsCk(o)) { const B = de && trB(de), c = B && trCks(B)[trCkN(o)]; return `Lượt ${trCkN(o) + 1}${c ? ` · câu ${c.a}–${c.b}` : ''}`; } return o === 'L' ? 'Phần Nghe' : o === 'R' ? 'Phần Đọc' : `${TR_SECS[o]} · ${TR_PN[o]}`; };
const trLU = st => trB(st.de).L.filter(u => trUIn(u, st.only));
const trRU = st => trB(st.de).R.filter(u => trUIn(u, st.only));
const trAK = (de, o) => o ? de + ':' + o : de;

// ---------- dựng đề: đơn vị (bài / câu) và 200 câu đánh số 1–200 ----------
function trB(de) { if (TR.B[de]) return TR.B[de]; const d = trMeta(de); if (!d || (d.f && !TR.D[de])) return null; const F = d.f ? TR.D[de] : null, O = (F ? F.ord : d.ord) || null;
  const mk = { p1: x => [toP1Q(x)], p2: x => [toP2Q(x)], p3: x => toTalkQs(x, 'p3'), p4: x => toTalkQs(x, 'p4'), p5: x => [toP5Q(x)], p6: toP6Qs, p7: toP7Qs }, U = []; let n = (F && F.off) || 0;   // off = 100: đề chỉ có phần Đọc (Đề 9 bản riêng), câu đánh số 101–200
  for (const s of Object.keys(mk)) { const ix = F ? null : Object.fromEntries(TO[s].map(x => [x.id, x]));
    for (const it of (F ? F[s] : d[s]) || []) { const x = F ? it : ix[it]; if (!x) continue;
      const qs = mk[s](x).map((q, qi) => { n++; const fix = q.opts.every(t => /^[A-D]$/.test(t) || /^\[\d\]$/.test(t)), od = O && O[n - 1], base = od ? [...q.opts].sort() : null;
        if (F && F.keep) { const og = s === 'p5' ? x.o : s === 'p6' ? x.gaps[qi].o : x.qs[qi].o; return { ...q, n, opts: [...og] }; }   // Đề 9 (ETS): giữ thứ tự A–D gốc để khớp lời giải
        return { ...q, n, opts: od ? od.split('').map(i => base[+i]) : fix ? [...q.opts].sort() : (typeof tqNat === 'function' && tqNat(q.opts)) || [...q.opts].sort((a, b) => trH(de + n + a) - trH(de + n + b)) }; });   // v155: ord = hoán vị đã cân bằng (bộ dựng ghi)   // v153: số / giờ / ngày / tầng… xếp tăng dần (tqNat, toqt.js)
      U.push({ sec: s, x, qs, a: qs[0].n, b: qs[qs.length - 1].n }); } }
  trCk(U);
  return (TR.B[de] = { d, U, Q: U.flatMap(u => u.qs), L: U.filter(u => /^p[1-4]$/.test(u.sec)), R: U.filter(u => /^p[5-7]$/.test(u.sec)) }); }
// v148 khung cấu trúc đề (người sáng lập 8/11/2026 xem màn sẵn sàng trên iPhone: "Sao 200 câu mà ghi có 100 câu… nên trình bày từng phần trong tổng 200 câu"):
//   2 phần × các Part, số câu + khoảng câu tính từ đề đã dựng (không ghi cứng). cur 'L' | 'R' = phần sắp làm (phần Nghe đã xong thì gập); rec = kết quả (mỗi Part ghi số câu đúng)
const TR_PH = { L: ['🎧', 'Phần Nghe', /^p[1-4]$/], R: ['📖', 'Phần Đọc', /^p[5-7]$/] },   // không đánh số "Phần 1 / 2": dễ lẫn với Part 1 / 2 của đề
  TR_PN = { p1: 'Tả tranh', p2: 'Hỏi – đáp', p3: 'Hội thoại', p4: 'Bài nói', p5: 'Điền câu', p6: 'Điền đoạn', p7: 'Đọc hiểu' };   // tên ngắn cho vừa 3 cột ở khổ 320 px (tên đủ ở TO_SEC)
// v151 lượt ~10 câu (người sáng lập 8/11/2026: "tách lần 10 câu làm để chấm điểm chứ không muốn làm 1 mạch dài"): gom bài liền nhau tới khi đủ ≥ TR_CK câu,
//   không cắt ngang một bài (Part 3 / 4 / 6 / 7) và không vắt qua Nghe → Đọc; mã lượt 'cL3' / 'cR12' (L / R = phần, số = thứ tự lượt trong đề). u.ck, q.ck = số lượt
const TR_CK = 10, TR_SPQ = { p5: TR_PMIN.p5 / 30, p6: TR_PMIN.p6 / 16, p7: TR_PMIN.p7 / 54 };   // phút mỗi câu Đọc khi làm theo lượt = nhịp của Part (cộng = 75 phút / 100 câu)
function trCk(U) { const G = []; let g = null;
  for (const u of U) { const p = /^p[1-4]$/.test(u.sec) ? 'L' : 'R'; if (!g || g.n >= TR_CK || g.p !== p) G.push(g = { p, us: [], n: 0 }); g.us.push(u); g.n += u.qs.length; }
  G.forEach((g, k) => { for (const u of g.us) { u.ck = k; u.cp = g.p; for (const q of u.qs) q.ck = k; } }); }
const trIsCk = o => /^c[LR]\d+$/.test(o || '');
const trCkN = o => +String(o).slice(2);
const trCks = B => { const m = []; for (const u of B.U) { const c = m[u.ck] = m[u.ck] || { k: u.ck, p: u.cp, a: u.a, b: u.b, n: 0 }; c.b = u.b; c.n += u.qs.length; } return m; };
const trCkId = c => 'c' + c.p + c.k;
const trUIn = (u, o) => trIsCk(o) ? u.ck === trCkN(o) : trIn(u.sec, o);
const trQIn = (q, o) => trIsCk(o) ? q.ck === trCkN(o) : trIn(q.sec, o);
const trCkMin = (B, o) => Math.max(1, Math.round(B.Q.filter(q => q.ck === trCkN(o)).reduce((t, q) => t + (TR_SPQ[q.sec] || 0), 0)));
const trTot = () => { const t = TR_LMIN + TR_RMIN; return `${Math.floor(t / 60)} giờ ${t % 60} phút`; };
function trPlan(B, cur, rec) {
  const ph = k => { const us = B.U.filter(u => TR_PH[k][2].test(u.sec)), a = us[0].a, b = us[us.length - 1].b, done = !rec && k === 'L' && cur === 'R';
    const rows = [...new Set(us.map(u => u.sec))].map(s => { const ss = us.filter(u => u.sec === s), x = ss[0].a, y = ss[ss.length - 1].b, r = rec && (rec.by || {})[TR_SECS[s]];
      return `<span>${TR_SECS[s]} · ${TR_PN[s]}</span><span>${r ? `${r[0]}/${r[1]}` : `${y - x + 1} câu`}</span><span>${x}–${y}</span>`; }).join('');
    const sub = done ? 'Đã xong' : rec ? `≈ ${rec.b[k]} điểm · ${rec.ok[k]}/${b - a + 1} câu đúng` : k === 'L' ? `~${TR_LMIN} phút · máy tự chạy, không dừng` : `${TR_RMIN} phút · làm câu nào trước cũng được`;
    return `<div class="ph${!rec && k === cur ? ' cur' : ''}"><p class="pt"><b>${done ? '✓' : TR_PH[k][0]} ${TR_PH[k][1]}</b><span>câu ${a}–${b}</span></p><p class="mute">${sub}</p>${done ? '' : `<div class="pr"${rec ? ' aria-label="Số câu đúng / số câu từng Part"' : ''}>${rows}</div>`}</div>`; };
  return `<div class="box trplan">${ph('L')}${ph('R')}</div>`; }

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
const TR_RULE = () => ['Đeo tai nghe, ngồi chỗ yên tĩnh, để trống khoảng 1 giờ 40 phút liền.',
  `Nghe (câu 1–100, Part 1–4): máy phát liên tục, mỗi bài một lần. Part 1–2 có ${TR_P12} giây chọn sau mỗi câu; Part 3–4 có ${TR_P34} giây mỗi câu sau mỗi bài (câu hỏi in sẵn trên màn, đọc trước khi nghe). Không dừng, không nghe lại, không quay lại.`,
  `Đọc (câu 101–200, Part 5–7): ${TR_RMIN} phút. Làm câu nào trước cũng được, ⚑ đánh dấu câu muốn xem lại, 📋 bảng câu để nhảy tới câu bất kỳ. Hết giờ máy tự nộp.`,
  `Lỡ thoát app: vào lại trong ${TR_KEEP} giờ để làm tiếp. Nghe phát lại bài đang dở, đáp án đã chọn vẫn giữ; Đọc vẫn tính giờ thật. Số lần gián đoạn ghi ở kết quả.`,
  'Muốn luyện riêng: sau khi chọn đề, kéo xuống "Hoặc chỉ làm một phần" để làm cả phần Nghe, cả phần Đọc hoặc một Part; hoặc "làm từng lượt 10 câu": xong mỗi lượt chấm ngay, xem đáp án rồi sang lượt sau. Hai cách này không tính vào điểm đề thử trọn.',
  'Điểm là ước lượng theo tỉ lệ đúng, không phải bảng quy đổi của ETS. Không tính vào 📘 Học / 🔁 Nhớ.'];
// dòng ở màn TOEIC (phần 📚 Đề có sẵn): đề đang dở hoặc lối vào
function trRow() { if (typeof TO === 'undefined' || !TO || !(TO.tron || []).length) return ''; const st = trSt(), fresh = st && Date.now() - st.up <= TR_KEEP * 36e5;
  const M = (toSt().mock || []).filter(r => r.full && r.de), last = M[M.length - 1];
  return `<div class="box hcard" style="margin:12px 0 0"><button class="hrow" data-trv><span class="ic">${fresh ? '⏸' : '🎓'}</span><span class="t"><b>${fresh ? 'Làm tiếp đề thử trọn · ' + esc(trName(st.de)) : 'Đề thử trọn 200 câu'}</b>
    <small>${fresh ? esc(trWhere(st)) : `Nghe ~${TR_LMIN} phút tự chạy + Đọc ${TR_RMIN} phút · ${TO.tron.length} đề${last ? ` · lần gần nhất ≈ ${last.tot}` : ''}`}</small></span><span class="chev">›</span></button></div>`; }
const trWhere = st => (st.only ? `${trIsCk(st.only) ? '' : 'Chỉ '}${trOnlyName(st.only, st.de)} · ` : '') + (st.ph === 'L' ? `Đang ở phần Nghe, câu ${st.qa || ((trB(st.de) ? trLU(st) : [])[st.li] || { a: 1 }).a}/200` : st.rAt ? `${st.only && st.only !== 'R' ? 'Còn' : 'Phần Đọc còn'} ${trMMSS(trLeft(st))}` : 'Xong phần Nghe, chưa bắt đầu Đọc');
// Đề 9 · ETS bản riêng (chỉ phần Đọc): tệp toeic-tron/de9.json nằm trong .gitignore nên chỉ có trên máy người sáng lập; không có tệp (web công khai) thì không hiện
async function trProbe9() { if (TR.p9 !== undefined || typeof TO === 'undefined' || !TO) return; if (navigator.userAgent === 'test') return;   // bộ test Node (tools/test) không thấy đề riêng, để các test đề trọn đếm đúng 8 đề TR.p9 = false;
  try { const r = await Promise.race([fetch('toeic-tron/de9.json?v=' + APP_V), new Promise((_, no) => setTimeout(() => no(0), 4000))]); if (!r.ok) return; const j = await r.json(); if (!j || j.id !== 'de9' || !Array.isArray(j.p5)) return;
    TR.D.de9 = j; if (!(TO.tron || []).some(d => d.id === 'de9')) { (TO.tron = TO.tron || []).push({ id: 'de9', t: j.t || 'Đề 9', f: 'toeic-tron/de9.json', only: 'R' }); } TR.p9 = true; } catch (e) {} }
async function trReady0() { if (!TO) await toLoad(); if (!NCLIPS.size) try { NCLIPS = new Set(await (await fetch('n/index.json?v=' + APP_V)).json()); } catch (e) {} }
async function trView() { BACK = null; window.CUR = { view: TR_VIEW }; EXAM_VOX = false; TR.on = ''; TR.tok++; clearInterval(TR.tm);
  if (!TO || !NCLIPS.size) { $app.innerHTML = '<div id="ie"></div><p class="mute">Đang tải…</p>'; try { await trReady0(); } catch (e) { $app.innerHTML = '<div id="ie"></div><p>Không tải được dữ liệu TOEIC. Thử lại sau.</p>'; return; } }
  await trProbe9();
  let st = trSt(), gone = false; if (st && Date.now() - st.up > TR_KEEP * 36e5) { toSt().tron = null; S.t = Date.now(); save(); st = null; gone = true; }
  if (st) await trLoad(st.de);
  const M = (toSt().mock || []).filter(r => r.full && r.de), last = de => M.filter(r => r.de === de).slice(-1)[0];
  $app.innerHTML = `<div id="ie"></div><div class="row top"><button class="link tap" data-trb>‹ TOEIC</button></div>
    <h1>🎓 Đề thử trọn 200 câu</h1><p class="mute" style="margin:0 0 10px">2 phần làm liền nhau như thi thật: 🎧 Nghe câu 1–100 (máy tự chạy, khoảng ${TR_LMIN} phút) rồi 📖 Đọc câu 101–200 (${TR_RMIN} phút). Đề thật phần Nghe ~45 phút vì bài nghe dài hơn, có đọc hướng dẫn và đọc to câu hỏi; nhịp chọn từng câu ở app như đề thật.</p>
    ${gone ? `<div class="box"><p style="margin:0">Đề thử dở quá ${TR_KEEP} giờ nên đã huỷ. Làm lại từ đầu nhé.</p></div>` : ''}
    ${st ? `<div class="box"><b>⏸ ${esc(trName(st.de))} đang dở</b><p class="mute" style="margin:4px 0 8px">${esc(trWhere(st))} · giữ tới ${new Date(st.up + TR_KEEP * 36e5).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</p>
      <button class="pri" data-trgo="resume">▶ Làm tiếp</button><button class="link tap" data-trdrop>Bỏ đề này, làm lại từ đầu</button></div>` : ''}
    <div class="box hcard">${(TO.tron || []).map(d => { const r = last(d.id); return `<button class="hrow" data-trgo="${d.id}"${st ? ' disabled' : ''}><span class="ic">📝</span><span class="t"><b>${esc(d.t)}</b>
      <small>${d.only === 'R' ? 'Chỉ phần Đọc · bản riêng trên máy' : r ? `Lần trước ≈ ${r.tot} điểm (Nghe ${r.b.L} · Đọc ${r.b.R}) · ${new Date(r.at).toLocaleDateString('vi-VN')}${(toSt().tronA || {})[d.id] ? '' : ' · chưa lưu bài làm từng câu'}` : 'Chưa làm'}</small></span><span class="chev">›</span></button>${trShRow(d.id, 1)}`; }).join('')}</div>
    ${st ? '<p class="mute" style="font-size:14px">Đang có đề dở: làm tiếp hoặc bỏ đề đó trước khi bắt đầu đề khác.</p>' : ''}
    <details class="box trrule"${st ? '' : ' open'}><summary><b>📋 Quy chế như thi thật</b></summary><ol style="margin:6px 0 0;padding-left:22px">${TR_RULE().map(t => `<li style="margin:4px 0">${esc(t)}</li>`).join('')}</ol></details>
    <p class="mute" style="font-size:13px">TOEIC là thương hiệu của ETS; đề do app soạn theo cơ cấu đề thật, không chép đề ETS. 🤖 Claude soạn, chưa giáo viên kiểm.</p>`;
  $app.onclick = e => { const g = s => e.target.closest(s); let b;
    if (g('[data-trb]')) return toeicView();
    if ((b = g('[data-trgo]'))) { if (b.disabled) return; scrollTo(0, 0); return b.dataset.trgo === 'resume' ? trResume() : trReady(b.dataset.trgo); }
    if ((b = g('[data-trsh]'))) return trSheet(b.dataset.trsh, null);
    if (g('[data-trdrop]')) { if (!confirm('Bỏ đề đang dở? Đáp án đã chọn sẽ mất.')) return; toSt().tron = null; S.t = Date.now(); save(); return trView(); } };
  scrollTo(0, 0); }
// màn sẵn sàng: cú bấm "Bắt đầu" là thao tác của người dùng nên điện thoại cho phát âm thanh liên tục sau đó
async function trReady(de) { const d = trMeta(de); if (!d) return trView(); window.CUR = { view: TR_VIEW };
  if (!trB(de)) { $app.innerHTML = '<div class="row top trx"><button class="link tap" data-trv>‹ Đề thử trọn</button></div><p class="mute">Đang tải đề…</p>'; const ok = await trLoad(de); if (window.CUR.view !== TR_VIEW) return;
    if (!ok || !trB(de)) { $app.innerHTML = `<div class="row top trx"><button class="link tap" data-trv>‹ Đề thử trọn</button></div><div class="box"><p style="margin:0">Không tải được ${esc(d.t)}. Kiểm tra mạng rồi thử lại.</p></div><button class="pri" data-trgo="${esc(de)}">Thử lại</button>`; $app.onclick = e => { if (e.target.closest('[data-trgo]')) trReady(de); }; return; } }
  const B = trB(de);
  if (!B.L.length) { const rows = ['p5', 'p6', 'p7'].map(s => { const us = B.U.filter(u => u.sec === s); return us.length ? `<span>${TR_SECS[s]} · ${TR_PN[s]}</span><span>${us.reduce((t, u) => t + u.qs.length, 0)} câu</span><span>${us[0].a}–${us[us.length - 1].b}</span>` : ''; }).join('');
    $app.innerHTML = `<div class="row top trx"><button class="link tap" data-trv>‹ Đề thử trọn</button></div><h1>📖 ${esc(d.t)} · ${B.Q.length} câu</h1>
      <p class="mute" style="margin:0">Chỉ có phần Đọc (câu ${B.Q[0].n}–${B.Q[B.Q.length - 1].n}, Part 5–7), ${TR_RMIN} phút. Tài liệu ETS riêng của bạn, chỉ có trên máy này, không đưa lên web.</p>
      <div class="box trplan"><div class="ph"><div class="pr" aria-label="Cấu trúc đề">${rows}</div></div></div>
      <button class="btnbig" data-trone="R">▶ Bắt đầu phần Đọc<small>Câu ${B.Q[0].n}–${B.Q[B.Q.length - 1].n} · ${TR_RMIN} phút</small></button>
      ${trCkBox(B, de)}${trOneBox(B)}`;
    $app.onclick = e => { const o = e.target.closest('[data-trone]'); if (o) { scrollTo(0, 0); return trStart(de, o.dataset.trone); } }; scrollTo(0, 0); return; }
  $app.innerHTML = `<div class="row top trx"><button class="link tap" data-trv>‹ Đề thử trọn</button></div><h1>📝 ${esc(d.t)} · ${B.Q.length} câu</h1>
    <p class="mute" style="margin:0">2 phần làm liền nhau: Nghe rồi Đọc, khoảng ${trTot()}. Đeo tai nghe trước khi bắt đầu.</p>${trPlan(B, 'L')}
    <button data-trtest>🔊 Thử âm thanh</button>
    <button class="btnbig" data-trstart="${esc(de)}">▶ Bắt đầu phần Nghe<small>Câu 1–${B.L.slice(-1)[0].b} · ~${TR_LMIN} phút · không dừng</small></button>
    ${trCkBox(B, de)}${trOneBox(B)}`;
  $app.onclick = e => { const b = e.target.closest('[data-trstart]'); if (b) return trStart(b.dataset.trstart); const o = e.target.closest('[data-trone]'); if (o) { scrollTo(0, 0); return trStart(de, o.dataset.trone); } if (e.target.closest('[data-trtest]')) { EXAM_VOX = true; speak('This is a sound check. If you can hear this clearly, you are ready.'); } }; scrollTo(0, 0); }
// v151 ô "làm từng lượt ~10 câu": nút chính = lượt kế tiếp chưa làm; mọi lượt gập trong "Chọn lượt khác" (✓ = đã làm, ghi số câu đúng lần gần nhất)
function trCkBox(B, de) { const C = trCks(B), P = (toSt().tronP || []).filter(r => r.de === de), last = o => P.filter(r => r.o === o).slice(-1)[0];
  const nx = C.find(c => !last(trCkId(c))) || C[0], done = C.filter(c => last(trCkId(c))).length, mn = c => c.p === 'L' ? 'máy tự chạy' : `${trCkMin(B, trCkId(c))} phút`;
  const chips = C.map(c => { const r = last(trCkId(c)); return `<button class="chip${r ? ' on' : ''}" data-trone="${trCkId(c)}" aria-pressed="${!!r}" aria-label="Lượt ${c.k + 1}, câu ${c.a} đến ${c.b}${r ? `, đã làm, đúng ${r.ok} trên ${r.n}` : ''}">${r ? '✓ ' : ''}${c.a}–${c.b}${r ? ` · ${r.ok}/${r.n}` : ''}</button>`; }).join('');
  return `<h2 style="margin:22px 0 4px">Hoặc làm từng lượt 10 câu</h2><p class="mute" style="margin:0 0 8px">Làm xong mỗi lượt là chấm ngay, xem đáp án rồi mới sang lượt sau. ${C.length} lượt${done ? ` · đã làm ${done}` : ''}. Không tính vào điểm đề thử trọn.</p>
    <div class="box hcard"><button class="hrow" data-trone="${trCkId(nx)}"><span class="ic">${nx.p === 'L' ? '🎧' : '📖'}</span><span class="t"><b>▶ Lượt ${nx.k + 1} · câu ${nx.a}–${nx.b}</b><small>${nx.n} câu · ${mn(nx)} · chấm ngay khi xong</small></span><span class="chev">›</span></button></div>
    <details class="box" style="margin-top:8px"><summary><b>Chọn lượt khác</b></summary><div class="chips tap" role="group" aria-label="Chọn lượt" style="margin-top:8px">${chips}</div></details>`; }
// v150 ô "Hoặc chỉ làm một phần" ở màn sẵn sàng: cả phần Nghe / Đọc, hoặc một Part
function trOneBox(B) { const rg = s => { const us = B.U.filter(u => trIn(u.sec, s)); return us.length ? [us[0].a, us[us.length - 1].b] : null; }, L = rg('L'), Rr = rg('R');
  const parts = Object.keys(TR_PN).filter(s => B.U.some(u => u.sec === s)).map(s => { const [a, b] = rg(s); return `<button class="chip" data-trone="${s}" aria-label="Chỉ làm ${TR_SECS[s]}, ${TR_PN[s]}, câu ${a} đến ${b}">${TR_SECS[s]} · ${b - a + 1} câu</button>`; }).join('');
  return `<h2 style="margin:22px 0 4px">Hoặc chỉ làm một phần</h2><p class="mute" style="margin:0 0 8px">Giữ quy chế của phần đó. Không tính vào điểm đề thử trọn.</p>
    <div class="box hcard">${L ? `<button class="hrow" data-trone="L"><span class="ic">🎧</span><span class="t"><b>Chỉ phần Nghe</b><small>Câu ${L[0]}–${L[1]} · ~${TR_LMIN} phút · máy tự chạy</small></span><span class="chev">›</span></button>` : ''}
      <button class="hrow" data-trone="R"><span class="ic">📖</span><span class="t"><b>Chỉ phần Đọc</b><small>Câu ${Rr[0]}–${Rr[1]} · ${TR_RMIN} phút</small></span><span class="chev">›</span></button></div>
    <p class="mute" style="margin:12px 0 6px">Hoặc một Part. Part 5 / 6 / 7 có giờ ${TR_PMIN.p5} / ${TR_PMIN.p6} / ${TR_PMIN.p7} phút (nhịp nên dùng khi thi).</p>
    <div class="chips tap" role="group" aria-label="Chọn một Part">${parts}</div>`; }
function trStart(de, only) { if (!trB(de)) return trView(); const now = Date.now(), o = only && only !== '' ? only : undefined;
  toSt().tron = o && !trIsL(o) ? { de, only: o, ph: 'R', lAt: now, lEnd: now, rAt: now, ri: 0, ...(trIsCk(o) ? { rMin: trCkMin(trB(de), o) } : {}), ans: {}, fl: {}, gap: 0, ps: 0, up: now } : { de, ...(o ? { only: o } : {}), ph: 'L', lAt: now, li: 0, ans: {}, fl: {}, gap: 0, ps: 0, up: now };
  S.t = now; save(); return o && !trIsL(o) ? trR() : trL(); }
async function trResume() { const st = trSt(); if (!st) return trView(); if (!trB(st.de) && !(await trLoad(st.de) && trB(st.de))) { toast('Không tải được đề. Kiểm tra mạng rồi thử lại.'); return; } if (!st.ps) st.gap = (st.gap || 0) + 1; st.ps = 0; st.up = Date.now(); S.t = st.up; save();
  if (st.ph === 'L') return trL(false); return st.rAt ? trR() : trRReady(); }

// ---------- phần Nghe ----------
const trOpts = (q, st, plain) => `<div class="trop${plain ? ' abcd' : ''}">${q.opts.map((o, j) => { const on = st.ans[q.n] === o; return `<button class="opt${on ? ' sel' : ''}" data-tra="${q.n}|${j}" aria-pressed="${on}">${plain ? `(${esc(o)})` : `(${'ABCD'[j]}) ${esc(o)}`}</button>`; }).join('')}</div>`;
const trQHead = (q, st, fl) => `<p style="margin:12px 0 6px"><b>${q.n}.</b> ${q.q}${fl ? ` <button class="chip trfl${st.fl[q.n] ? ' on' : ''}" data-trf="${q.n}" aria-pressed="${!!st.fl[q.n]}" aria-label="Đánh dấu câu ${q.n}">⚑</button>` : ''}</p>`;
function trLBody(u, st) { const q0 = u.qs[0];
  if (u.sec === 'p1') return `${toPic(u.x.pic)}<p style="margin:10px 0 6px"><b>${q0.n}.</b> Nghe 4 câu, chọn câu tả đúng tranh.</p>${trOpts(q0, st, 1)}`;
  if (u.sec === 'p2') return `<p style="margin:10px 0 6px"><b>${q0.n}.</b> Nghe câu hỏi và 3 lời đáp (đề không in chữ).</p>${trOpts(q0, st, 1)}`;
  return `${u.x.g ? toGraph(u.x.g) : ''}<p class="mute" style="margin:6px 0 0">Câu ${u.a}–${u.b}: đọc trước câu hỏi, nghe bài, rồi chọn.</p>${u.qs.map(q => trQHead(q, st) + trOpts(q, st)).join('')}`; }
// play = false: vào lại sau gián đoạn → chờ người dùng bấm (điện thoại cần một lần bấm mới cho phát), bài phát lại từ đầu
function trL(play = true) { const st = trSt(); if (!st) return trView(); const B = trB(st.de), u = trLU(st)[st.li]; if (!u) return trLEnd();
  TR.on = 'L'; const tok = ++TR.tok; window.CUR = { view: TR_VIEW, item: 'L' + u.a }; trHush(); st.qa = u.a;
  $app.innerHTML = `<div class="row top trx"><button class="link tap" data-trx>✕ Thoát</button><span class="uname">🎧 ${TR_SECS[u.sec]} · câu ${u.a}${u.b > u.a ? '–' + u.b : ''}/${B.Q[B.Q.length - 1].n}</span><b id="trT"></b></div>
    <div id="trS" class="box trstat">${play ? '<b>🔊 Đang phát…</b>' : `<p style="margin:0 0 8px">⏸ Bị gián đoạn. Bài này sẽ phát lại từ đầu; đáp án đã chọn vẫn giữ.</p><button class="pri" data-trplay>▶ Nghe tiếp từ câu ${u.a}</button>`}</div>${trLBody(u, st)}`;
  $app.onclick = trClick; trTick(); scrollTo(0, 0); if (!play) return;
  trPlayUnit(u, tok).then(r => { if (tok !== TR.tok) return; if (!document.getElementById('trS')) return trAway(); if (r === 'blocked') { const el = document.getElementById('trS'); if (el) el.innerHTML = '<p style="margin:0 0 8px">Điện thoại chặn tự phát âm thanh. Giờ chọn chưa tính.</p><button class="pri" data-trplay>▶ Bấm để nghe tiếp</button>'; return; } trWin(u, tok); }); }
// giờ chọn sau mỗi bài; hết giờ thì sang bài sau (đáp án của bài này khoá lại)
function trWin(u, tok) { const s0 = u.sec === 'p1' || u.sec === 'p2' ? TR_P12 : TR_P34 * u.qs.length + (u.x.g ? 4 : 0), t1 = Date.now() + s0 * 1000 * TR.k;
  const step = () => { if (tok !== TR.tok) return; const ms = t1 - Date.now(), el = document.getElementById('trS'); if (!el) return trAway(); if (ms <= 0) return trLNext(tok);
    if (el) el.innerHTML = `<b>⏱ Còn ${Math.ceil(ms / 1000)} giây</b> · chọn đáp án${bar(ms / 10 / s0 / TR.k, 100, 'var(--accent)')}`; setTimeout(step, Math.min(250, ms)); };
  step(); }
function trAway() { const st = trSt(); TR.on = ''; TR.tok++; clearInterval(TR.tm); trHush(); EXAM_VOX = false; if (st && !st.ps) { st.ps = 1; st.gap = (st.gap || 0) + 1; st.up = Date.now(); S.t = st.up; save(); } }
function trLNext(tok) { if (tok !== undefined && tok !== TR.tok) return; const st = trSt(); if (!st) return; st.li++; st.up = Date.now(); S.t = st.up; save(); trL(); }
function trLEnd() { const st = trSt(); TR.on = ''; TR.tok++; clearInterval(TR.tm); trHush(); EXAM_VOX = false; if (st.only) { st.lEnd = Date.now(); return trSubmit(false); } if (st.ph === 'L') { st.ph = 'R'; st.lEnd = Date.now(); st.up = st.lEnd; S.t = st.up; save(); } trRReady(); }

// ---------- phần Đọc ----------
function trRReady() { const st = trSt(); if (!st) return trView(); TR.on = ''; window.CUR = { view: TR_VIEW }; const B = trB(st.de), a = B.R[0].a, b = B.R.slice(-1)[0].b;
  $app.innerHTML = `<div class="row top trx"><button class="link tap" data-trx>✕ Thoát</button></div><h1>✅ Xong phần Nghe</h1>
    <p class="mute" style="margin:0">Tiếp theo: phần Đọc, câu ${a}–${b}. Đề thật chuyển ngay sang Đọc, không nghỉ.</p>${trPlan(B, 'R')}
    <p class="mute" style="margin:0">⚑ đánh dấu câu cần xem lại · 📋 bảng câu để nhảy câu · hết giờ máy tự nộp.</p>
    <button class="btnbig" data-trrs>▶ Bắt đầu phần Đọc<small>Câu ${a}–${b} · ${TR_RMIN} phút tính từ lúc bấm</small></button>`;
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
  const B = trB(st.de), RU = trRU(st); st.ri = Math.max(0, Math.min(RU.length - 1, st.ri || 0)); const u = RU[st.ri]; TR.on = 'R'; TR.tok++; window.CUR = { view: TR_VIEW, item: 'R' + u.a };
  $app.innerHTML = `<div class="row top trx"><button class="link tap" data-trx>✕ Thoát</button><span class="uname">📖 ${TR_SECS[u.sec]} · câu ${u.a}${u.b > u.a ? '–' + u.b : ''}/${B.Q[B.Q.length - 1].n}</span><b id="trT"></b></div>
    ${trRBody(u, st)}<div class="row trnav">${st.ri > 0 ? '<button data-trp>‹ Trước</button>' : '<span></span>'}${st.ri < RU.length - 1 ? '<button class="pri" data-trn>Sau ›</button>' : '<button class="pri" data-trsub>Nộp bài</button>'}</div>
    <button data-trg id="trgc" style="margin-top:8px">${trGcTxt(st)}</button>`;
  $app.onclick = trClick; trTick(); scrollTo(0, 0); }
function trGrid() { const st = trSt(); if (!st) return trView(); const RU = trRU(st), Rq = RU.flatMap(u => u.qs), uOf = q => RU.findIndex(u => u.qs.includes(q)), un = Rq.filter(q => !st.ans[q.n]).length; TR.on = 'R';
  $app.innerHTML = `<div class="row top trx"><button class="link tap" data-trj="${st.ri}">‹ Về câu đang làm</button><b id="trT"></b></div><h1>📋 Bảng câu ${Rq[0].n}–${Rq[Rq.length - 1].n}</h1>
    <p class="mute" style="margin:0 0 8px">${Rq.length - un}/${Rq.length} câu đã chọn · ${Object.keys(st.fl).length} câu ⚑. Chạm số câu để tới câu đó.</p>
    <div class="trgrid">${Rq.map(q => `<button class="trc${st.ans[q.n] ? ' done' : ''}${st.fl[q.n] ? ' fl' : ''}${uOf(q) === st.ri ? ' cur' : ''}" data-trj="${uOf(q)}" aria-label="Câu ${q.n}${st.ans[q.n] ? ', đã chọn' : ', chưa chọn'}${st.fl[q.n] ? ', có đánh dấu' : ''}">${q.n}${st.fl[q.n] ? '⚑' : st.ans[q.n] ? '✓' : ''}</button>`).join('')}</div>
    <button class="pri" data-trsub style="margin-top:12px">Nộp bài</button>`;
  $app.onclick = trClick; trTick(); scrollTo(0, 0); }
// đồng hồ: Nghe = đã nghe bao lâu; Đọc = còn bao lâu (đồng hồ thật), nhắc khi còn 10 và 5 phút, hết thì tự nộp
function trTick() { clearInterval(TR.tm); const f = () => { const st = trSt(), el = document.getElementById('trT'); if (!st || !TR.on) return clearInterval(TR.tm);
    if (TR.on === 'R') { const ms = trLeft(st); if (ms <= 0) { clearInterval(TR.tm); return trSubmit(true); } if (el) { el.textContent = '⏱ ' + trMMSS(ms); el.style.color = ms < 5 * 60000 * TR.k ? 'var(--bad)' : ''; }
      for (const m of [10, 5]) if ((st.rMin || trRMin(st.only)) > m && ms <= m * 60000 * TR.k && !(st.wn || {})[m]) { st.wn = Object.assign({}, st.wn, { [m]: 1 }); toast(`Còn ${m} phút${st.only && st.only !== 'R' ? '' : ' phần Đọc'}.`); } }
    else if (el) el.textContent = '⏱ ' + trMMSS(Date.now() - st.lAt); };
  f(); TR.tm = setInterval(f, 1000); }
const trDoneR = st => trRU(st).flatMap(u => u.qs).filter(q => st.ans[q.n]).length;
const trGcTxt = st => { const Rq = trRU(st).flatMap(u => u.qs); if (!Rq.length) return ''; return `📋 Bảng câu ${Rq[0].n}–${Rq[Rq.length - 1].n} · đã chọn ${trDoneR(st)}/${Rq.length}`; };
function trMark(q, st) { const gc = document.getElementById('trgc'); if (gc) gc.textContent = trGcTxt(st); document.querySelectorAll(`[data-tra^="${q.n}|"]`).forEach(b => { const on = q.opts[+b.dataset.tra.split('|')[1]] === st.ans[q.n]; b.classList.toggle('sel', on); b.setAttribute('aria-pressed', String(on)); }); }
function trClick(e) { const g = s => e.target.closest(s), st = trSt(); let b; if (!st) return;
  if ((b = g('[data-tra]'))) { const [n, j] = b.dataset.tra.split('|'), B = trB(st.de), q = B.Q[+n - 1]; if (!q) return;
    if (TR.on === 'L' && !(trLU(st)[st.li] || { qs: [] }).qs.includes(q)) return;   // Nghe: chỉ chọn được câu của bài đang phát
    if (TR.on !== 'L' && TR.on !== 'R') return; st.ans[n] = q.opts[+j]; st.up = Date.now(); S.t = st.up; save(); return trMark(q, st); }
  if ((b = g('[data-trf]'))) { const n = b.dataset.trf; if (st.fl[n]) delete st.fl[n]; else st.fl[n] = 1; save(); b.classList.toggle('on', !!st.fl[n]); b.setAttribute('aria-pressed', String(!!st.fl[n])); return; }
  if (g('[data-trn]')) { st.ri++; save(); return trR(); }
  if (g('[data-trp]')) { st.ri = Math.max(0, st.ri - 1); save(); return trR(); }
  if (g('[data-trg]')) return trGrid();
  if ((b = g('[data-trj]'))) { st.ri = +b.dataset.trj || 0; save(); return trR(); }
  if (g('[data-trsub]')) { const un = trRU(st).flatMap(u => u.qs).filter(q => !st.ans[q.n]).length, fl = Object.keys(st.fl).length;
    if (!confirm(`Nộp bài?${un ? ` Còn ${un} câu chưa chọn.` : ''}${fl ? ` Có ${fl} câu ⚑ đánh dấu.` : ''}`)) return; return trSubmit(false); }
  if (g('[data-trplay]')) return trL(true);
  if (g('[data-trrs]')) return trRStart();
  if (g('[data-trx]')) { if (!confirm(`Thoát đề thử? Đề được giữ ${TR_KEEP} giờ để làm tiếp${st.ph === 'R' && st.rAt ? '; giờ Đọc vẫn chạy' : ''}.`)) return; const live = TR.on;
    TR.on = ''; TR.tok++; clearInterval(TR.tm); trHush(); EXAM_VOX = false; if (live && !st.ps) { st.ps = 1; st.gap = (st.gap || 0) + 1; } st.up = Date.now(); S.t = st.up; save(); return toeicView(); } }   // thoát lúc đang làm = một lần gián đoạn
// gián đoạn (khoá màn, chuyển app): Nghe dừng ngay, khi quay lại phát lại bài đang dở; Đọc vẫn tính giờ thật. Mỗi lần gián đoạn đếm một lần (ps: đã đếm)
document.addEventListener('visibilitychange', () => { if (!S || !TR.on) return; const st = trSt(); if (!st) return;
  if (document.hidden) { if (TR.on === 'L') { TR.tok++; trHush(); } if (!st.ps) { st.ps = 1; st.gap = (st.gap || 0) + 1; } st.up = Date.now(); S.t = st.up; save(); return; }
  st.ps = 0; save(); if (TR.on === 'L') trL(false); else if (TR.on === 'R') trR(); });

// ---------- 📋 bài làm và đáp án (v149, specs/010 US4; người sáng lập 8/11/2026: "Sau khi làm bài xong thì sẽ có 1 phần hiện bài làm và đáp án") ----------
// S.to.tronA[de] = { at, a }: a = 200 ký tự, ký tự n-1 = chữ đã chọn ở câu n theo thứ tự phương án cố định của đề (trH), '-' = bỏ trống. Chỉ để xem: không sửa đáp án, không đổi điểm, không ghi bản đồ.
const trAnsStr = (B, ans) => { const s = Array(B.Q.length ? B.Q[B.Q.length - 1].n : 0).fill('-'); for (const q of B.Q) { const v = ans[q.n], j = v == null ? -1 : q.opts.indexOf(v); if (j >= 0) s[q.n - 1] = 'ABCD'[j]; } return s.join(''); };   // đệm '-' ở đầu khi đề bắt đầu từ câu 101
const trPick = (q, ch) => ch && ch !== '-' ? q.opts['ABCD'.indexOf(ch)] : null;
const trSt3 = (q, ch) => { const v = trPick(q, ch); return v == null ? 'em' : v === q.a ? 'ok' : 'no'; };
const TR_SPK = { A: 'Nữ', B: 'Nam', C: 'Nữ 2' };   // giọng Part 3 (tools/build-audio.py): A nữ, B nam, C nữ thứ hai
const trShCount = (B, A) => { const n = { ok: 0, no: 0, em: 0 }; for (const q of B.Q) if (trQIn(q, A.o)) n[trSt3(q, A.a[q.n - 1])]++; return n; };
// v155 (specs/012-so-loi-soan-de R6): bài làm 📋 lưu trước khi cân bằng vị trí đáp án (thiếu ov) → đổi chữ theo bảng dc của đề (cùng phương án);
//   câu đã đổi nội dung → '-'. Đề tệp riêng chưa tải thì để nguyên, lần sau mở đổi.
function trAGet(de, key) { const o = toSt(), A = (o.tronA || {})[key], d = trMeta(de); if (!A || A.ov === 2 || !d || (d.f && !TR.D[de])) return A;
  const dc = (d.f ? TR.D[de].dc : d.dc) || {}, a = String(A.a || '').split('').map((L, i) => { const m = dc[i + 1]; return L === '-' || m === undefined ? L : m === null ? '-' : (m['ABCD'.indexOf(L)] || L); }).join('');
  const B = Object.assign({}, A, { a, ov: 2 }); o.tronA = Object.assign({}, o.tronA, { [key]: B }); try { save(); } catch (e) {} return B; }
function trShRow(de, sub, only) { const A = trAGet(de, trAK(de, only)); if (!A) return ''; const B = trB(de), n = B ? trShCount(B, A) : null;
  const t = `<span class="ic">📋</span><span class="t"><b>${sub ? 'Xem bài làm lần gần nhất' : 'Bài làm và đáp án'}</b><small>${n ? `✓ ${n.ok} đúng · ✗ ${n.no} sai · – ${n.em} bỏ trống` : new Date(A.at).toLocaleDateString('vi-VN')}${sub ? '' : ' · xem từng câu'}</small></span><span class="chev">›</span>`;
  return sub ? `<button class="hrow sub" data-trsh="${esc(de)}">${t}</button>` : `<div class="box hcard"><button class="hrow" data-trsh="${esc(de)}"${only ? ` data-tro="${only}"` : ''}>${t}</button></div>`; }
// bảng 200 ô theo Part; lọc tất cả / câu sai / bỏ trống
async function trSheet(de, back, f = '', only) { let A = trAGet(de, trAK(de, only)); if (!A) return back ? back() : trView();
  if (!trB(de)) { $app.innerHTML = '<div id="ie"></div><p class="mute">Đang tải đề…</p>'; if (!(await trLoad(de)) || !trB(de)) { $app.innerHTML = '<div id="ie"></div><div class="box"><p style="margin:0">Không tải được đề. Kiểm tra mạng rồi thử lại.</p></div><button data-trshb>‹ Quay lại</button>'; $app.onclick = e => { if (e.target.closest('[data-trshb]')) (back || trView)(); }; return; } A = trAGet(de, trAK(de, only)); }
  const B = trB(de), sts = [], n = trShCount(B, A); for (const q of B.Q) sts[q.n - 1] = trSt3(q, A.a[q.n - 1]); window.CUR = { view: 'toeic-tron-xem' }; TR.sh = { de, back, f, only }; TR.tok++; trHush();
  const secs = Object.keys(TR_SECS).filter(s => B.Q.some(q => q.sec === s && trQIn(q, A.o))).map(s => { const qs = B.Q.filter(q => q.sec === s && trQIn(q, A.o)), on = qs.filter(q => !f || sts[q.n - 1] === f); if (!on.length) return '';
    return `<h2 class="trshh">${TR_SECS[s]} · ${TR_PN[s]} <span class="mute">· ${qs.filter(q => sts[q.n - 1] === 'ok').length}/${qs.length} đúng</span></h2><div class="trgrid trsh">${on.map(q => { const k = sts[q.n - 1], ch = A.a[q.n - 1], key = 'ABCD'[q.opts.indexOf(q.a)];
      return `<button class="trc ${k}" data-trrv="${q.n}" aria-label="Câu ${q.n}: ${k === 'em' ? 'bỏ trống' : 'bạn chọn ' + ch}, đáp án ${key}, ${k === 'ok' ? 'đúng' : k === 'no' ? 'sai' : 'bỏ trống'}"><b>${q.n}</b><small>${k === 'ok' ? '✓ ' + ch : (k === 'em' ? '–' : ch) + '→' + key}</small></button>`; }).join('')}</div>`; }).join('');
  $app.innerHTML = `<div id="ie"></div><div class="row top"><button class="link tap" data-trshb>${back ? '‹ Kết quả' : '‹ Đề thử trọn'}</button></div>
    <h1>📋 Bài làm và đáp án</h1><p class="mute" style="margin:0">${esc(trName(de))}${A.o ? ' · ' + (trIsCk(A.o) ? '' : 'chỉ ') + trOnlyName(A.o, de) : ''} · ${new Date(A.at).toLocaleDateString('vi-VN')} · ✓ ${n.ok} đúng · ✗ ${n.no} sai · – ${n.em} bỏ trống</p>
    <p class="mute" style="margin:4px 0 0">Mỗi ô: số câu, chữ bạn chọn → đáp án. Chạm một ô để xem lại cả bài, có lời nghe hoặc bài đọc.</p>
    <div class="chips tap" style="margin:10px 0 0" role="group" aria-label="Lọc câu">${[['', 'Tất cả'], ['no', `Sai (${n.no})`], ['em', `Bỏ trống (${n.em})`]].map(([k, l]) => `<button class="chip${f === k ? ' on' : ''}" data-trshf="${k}" aria-pressed="${f === k}">${l}</button>`).join('')}</div>
    ${secs || '<p class="mute" style="margin:12px 0">Không có câu nào ở mục này.</p>'}`;
  $app.onclick = e => { const g = s => e.target.closest(s); let b;
    if (g('[data-trshb]')) return back ? back() : trView();
    if ((b = g('[data-trshf]'))) return trSheet(de, back, b.dataset.trshf, only);
    if ((b = g('[data-trrv]'))) { TR.shY = window.scrollY || 0; return trRv(de, +b.dataset.trrv); } };
  scrollTo(0, 0); }
// một câu khi xem lại: phương án đã chọn / đáp án đánh dấu bằng chữ (không chỉ bằng màu), giải thích, 📍 câu chứa đáp án
// v156 (specs/013, người sáng lập 10/11/2026 "đáp án thiết kế giống ảnh để dễ hiểu"): câu có lời giải lg → thẻ dọc: dưới mỗi phương án một dòng loại từ + nghĩa (lg.og, khoá = chữ phương án),
//   rồi ô 💡 Chọn (X) · dạng câu · Vì sao · Cấu trúc hay dùng · Dịch. Câu chưa có lg dùng why như cũ
function trRvQ(q, A) { const ch = A.a[q.n - 1], pick = trPick(q, ch), lt = q.sec === 'p1' || q.sec === 'p2', lg = q.lg, og = lg && lg.og || {};
  const ops = q.opts.map((o, j) => { const isA = o === q.a, isP = o === pick, tag = isA && isP ? '✓ Bạn chọn · đúng' : isA ? '✓ Đáp án' : isP ? '✗ Bạn chọn' : '';
    return `<div class="rvop${isA ? ' ok' : isP ? ' no' : ''}"><b>(${'ABCD'[j]})</b> ${esc(lt ? q.x.o[j] : o)}${og[o] ? `<span class="rvog">${esc(og[o])}</span>` : ''}${tag ? `<span class="optag">${tag}</span>` : ''}</div>`; }).join('');
  const ev = typeof hlEv === 'function' ? hlEv(q) : q.ev, why = q.why && !/^Lời bài: /.test(q.why) ? q.why : '', ai = q.opts.indexOf(q.a), ins = q.sec === 'p6' && q.gt === 'insert';
  const dang = q.sec === 'p5' ? TO_T5[q.x.t] : q.sec === 'p6' ? (ins ? 'Chèn câu' : '') : '';
  const gt = lg ? `<div class="rvgt"><p class="rvgh">💡 Chọn (${'ABCD'[ai]})${ins || q.sec === 'p7' ? '' : ` ${esc(q.a)}`}${dang ? ` <span class="rvdang">· ${esc(dang)}</span>` : ''}</p>
    <p><b>Vì sao:</b> ${esc(lg.ly)}</p>${lg.ct ? `<p><b>Cấu trúc hay dùng:</b> ${esc(lg.ct)}</p>` : ''}<p><b>Dịch:</b> ${esc(lg.dich)}</p></div>`
    : why ? `<p class="mute" style="margin:4px 0 0">${esc(why)}</p>` : '';
  return `<div class="rvq"><p style="margin:12px 0 4px"><b>${q.n}.</b> ${q.sec === 'p6' ? '' : q.q}${pick == null ? ' <span class="mute">· bỏ trống</span>' : ''}</p>${ops}${gt}${ev ? `<p style="margin:4px 0 0">📍 Câu chứa đáp án: “${esc(ev)}”</p>` : ''}</div>`; }
function trRvBody(u, A) { const x = u.x, qs = u.qs.map(q => trRvQ(q, A)).join(''), nghe = '<div class="chips tap" style="margin:8px 0 0"><button class="chip" data-trrvp>🔊 Nghe lại</button></div>';
  if (u.sec === 'p1') return toPic(x.pic) + nghe + qs;
  if (u.sec === 'p2') return `${nghe}<div class="box"><p class="mute" style="margin:0">Câu hỏi</p><p class="tdtap" style="margin:4px 0 0">${esc(x.q)}</p></div>${qs}`;
  if (u.sec === 'p3' || u.sec === 'p4') return `${x.g ? toGraph(x.g) : ''}${nghe}<div class="box"><p class="mute" style="margin:0">Lời nghe</p>${x.lines ? x.lines.map(([sp, t]) => `<p class="tdtap" style="margin:6px 0 0"><b>${TR_SPK[sp] || sp}:</b> ${esc(t)}</p>`).join('') : `<p class="tdtap" style="margin:6px 0 0">${esc(x.text)}</p>`}</div>${qs}`;
  if (u.sec === 'p5') return qs;
  if (u.sec === 'p6') return `<div class="box"><p class="mute" style="margin:0">${esc(x.kind)}</p><b style="font-size:15px">${esc(x.title)}</b><p class="tdtap" style="font-size:16px;line-height:1.7;margin:8px 0 0">${esc(x.text).replace(/\{(\d)\}/g, (_, k) => `<b>(${u.a + +k - 1})</b> -------`)}</p></div>${qs}`;
  return trDocs(x).replace(/<p style="font-size:16px/g, '<p class="tdtap" style="font-size:16px') + qs; }
// xem lại một bài (đơn vị của đề); ‹ Trước · Sau › theo bộ lọc của bảng
function trRv(de, n) { const B = trB(de), sh = TR.sh || { de, f: '' }, A = trAGet(de, trAK(de, sh.only)); if (!B || !A) return trView();
  const ui = Math.max(0, B.U.findIndex(u => n >= u.a && n <= u.b)), u = B.U[ui], f = sh.f || '', bad = j => trUIn(B.U[j], A.o) && (!f || B.U[j].qs.some(q => trSt3(q, A.a[q.n - 1]) === f));
  let pi = ui - 1; while (pi >= 0 && !bad(pi)) pi--; let ni = ui + 1; while (ni < B.U.length && !bad(ni)) ni++;
  TR.tok++; trHush(); window.CUR = { view: 'toeic-tron-xem', item: 'rv' + u.a };
  $app.innerHTML = `<div id="ie"></div><div class="row top"><button class="link tap" data-trrvb>‹ Bài làm</button><span class="uname">${/^p[1-4]$/.test(u.sec) ? '🎧' : '📖'} ${TR_SECS[u.sec]} · câu ${u.a}${u.b > u.a ? '–' + u.b : ''}</span></div>
    <div class="trrv">${trRvBody(u, A)}</div>
    <div class="row trnav trrvnav">${pi >= 0 ? `<button data-trrvj="${B.U[pi].a}">‹ Trước</button>` : '<span></span>'}${ni < B.U.length ? `<button class="pri" data-trrvj="${B.U[ni].a}">Sau ›</button>` : '<span></span>'}</div>`;
  $app.onclick = e => { const g = s => e.target.closest(s); let b;
    if (g('[data-trrvb]')) { const y = TR.shY || 0; return trSheet(de, sh.back, f, sh.only).then(() => scrollTo(0, y)); }
    if ((b = g('[data-trrvj]'))) return trRv(de, +b.dataset.trrvj);
    if (g('[data-trrvp]')) { const tok = ++TR.tok; trHush(); TR.tok = tok; EXAM_VOX = true; trPlayUnit(u, tok).then(() => { if (tok === TR.tok) EXAM_VOX = false; }); } };
  scrollTo(0, 0); }

// ---------- nộp bài + kết quả ----------
function trSubmit(auto) { const st = trSt(); if (!st) return trView(); TR.on = ''; TR.tok++; clearInterval(TR.tm); trHush(); EXAM_VOX = false;
  const B = trB(st.de), now = Date.now(), o = toSt();
  if (st.only) return trSubmitOne(st, B, now, o, auto);
  const res = B.Q.map(q => { const a = st.ans[q.n]; return { q, n: q.n, part: TR_SECS[q.sec], ok: a != null && a === q.a, ans: a == null ? '' : a }; });
  const okL = res.filter(r => r.n <= 100 && r.ok).length, okR = res.filter(r => r.n > 100 && r.ok).length, b = { L: toScale(okL, 100), R: toScale(okR, 100) }, by = {};
  for (const r of res) { const p = by[r.part] = by[r.part] || [0, 0]; p[1]++; if (r.ok) p[0]++; }
  const prev = (o.mock || []).filter(m => m.full && m.de === st.de).slice(-1)[0];
  try { toLog(res.filter(r => r.ans !== ''), 'thi'); } catch (e) {}   // bản đồ điểm: chỉ câu đã chọn (câu bỏ trống không nói gì về dạng câu)
  for (const u of B.U) { const rs = res.filter(r => r.q.x === u.x); o.r[u.x.id] = { at: now, ok: rs.filter(r => r.ok).length, n: rs.length, k: u.sec }; }
  const rec = { at: now, b, tot: b.L + b.R, full: 1, de: st.de, ok: { L: okL, R: okR }, by, min: { L: Math.round(((st.lEnd || now) - st.lAt) / 60000), R: st.rAt ? Math.round(Math.min(now - st.rAt, TR_RMIN * 60000) / 60000) : 0 }, gap: st.gap || 0, ...(auto ? { auto: 1 } : {}) };
  o.tronA = Object.assign({}, o.tronA, { [st.de]: { at: now, a: trAnsStr(B, st.ans), ov: 2 } });   // v149 📋 bài làm lần gần nhất (làm lại thì thay)
  o.mock.push(rec); o.tron = null; S.t = now; save(); trRes(rec, res, prev); }
function trRes(rec, res, prev) { window.CUR = { view: 'toeic-tron-kq' }; const tg = toSt().target, hb = typeof hlBox === 'function' ? hlBox(res, { src: 'thi' }) : { html: '', pri: false }, d = rec.tot - (prev ? prev.tot : 0), B = trB(rec.de);
  $app.innerHTML = `<div id="ie"></div><h1>🎓 Kết quả ${esc(trName(rec.de))}</h1>
    <div class="box"><p style="margin:0;font-size:20px"><b>Tổng ≈ ${rec.tot}</b> ${rec.tot >= tg ? '✅' : '⬜'} <span class="mute" style="font-size:14px">(mục tiêu ${tg})</span></p>
      <p style="margin:6px 0 0">${rec.ok.L + rec.ok.R}/${res.length} câu đúng</p>
      ${prev ? `<p style="margin:6px 0 0">So lần trước (${new Date(prev.at).toLocaleDateString('vi-VN')}): <b>${d >= 0 ? '+' : ''}${d}</b> điểm</p>` : ''}
      <p class="mute" style="margin:6px 0 0">⏱ Nghe ${rec.min.L} phút · Đọc ${rec.min.R}/${TR_RMIN} phút${rec.auto ? ' (hết giờ, máy tự nộp)' : ''}${rec.gap ? ` · ⚠️ gián đoạn ${rec.gap} lần: điểm Nghe có thể cao hơn thi thật` : ''}</p>
      <p class="mute" style="margin:6px 0 0">Điểm ước theo tỉ lệ đúng, KHÔNG phải bảng quy đổi của ETS (ETS quy đổi riêng từng đề). Tranh Part 1 là tranh vẽ; đề ít bài có bảng hơn đề thật.</p></div>
    ${trShRow(rec.de)}${B ? trPlan(B, '', rec) : ''}${hb.html}<button class="${hb.pri ? '' : 'pri'}" data-trv>🎓 Về danh sách đề thử trọn</button><button data-trb>← TOEIC</button>`;
  $app.onclick = e => { if (e.target.closest('[data-trb]')) return toeicView();
    if (e.target.closest('[data-trsh]')) { const snap = { html: $app.innerHTML, oc: $app.onclick, cur: window.CUR, y: window.scrollY || 0 }; return trSheet(rec.de, () => { TR.tok++; trHush(); $app.innerHTML = snap.html; $app.onclick = snap.oc; window.CUR = snap.cur; scrollTo(0, snap.y); }); } }; scrollTo(0, 0); }
// v150 nộp khi chỉ làm một phần: chỉ chấm câu của phần đó; không vào S.to.mock (điểm đề thử trọn), lưu S.to.tronP (≤ 60); bản đồ + bài đã gặp như đề trọn
function trSubmitOne(st, B, now, o, auto) { const only = st.only, res = B.Q.filter(q => trQIn(q, only)).map(q => { const a = st.ans[q.n]; return { q, n: q.n, part: TR_SECS[q.sec], ok: a != null && a === q.a, ans: a == null ? '' : a }; }), by = {};
  for (const r of res) { const p = by[r.part] = by[r.part] || [0, 0]; p[1]++; if (r.ok) p[0]++; }
  try { toLog(res.filter(r => r.ans !== ''), 'thi'); } catch (e) {}
  for (const u of B.U) { if (!trUIn(u, only)) continue; const rs = res.filter(r => r.q.x === u.x); o.r[u.x.id] = { at: now, ok: rs.filter(r => r.ok).length, n: rs.length, k: u.sec }; }
  const ok = res.filter(r => r.ok).length, sc = only === 'L' || only === 'R' ? toScale(ok, res.length) : null, prev = (o.tronP || []).filter(m => m.de === st.de && m.o === only).slice(-1)[0];
  const rec = { at: now, de: st.de, o: only, ok, n: res.length, by, ...(sc != null ? { sc } : {}), min: Math.round((trIsL(only) ? (st.lEnd || now) - st.lAt : Math.min(now - st.rAt, (st.rMin || trRMin(only)) * 60000)) / 60000), ...(st.rMin ? { rm: st.rMin } : {}), gap: st.gap || 0, ...(auto ? { auto: 1 } : {}) };
  o.tronP = [...(o.tronP || []), rec].slice(-60);
  o.tronA = Object.assign({}, o.tronA, { [trAK(st.de, only)]: { at: now, o: only, a: trAnsStr(B, st.ans), ov: 2 } });
  o.tron = null; S.t = now; save(); trResOne(rec, res, prev); }
function trResOne(rec, res, prev) { window.CUR = { view: 'toeic-tron-kq' }; const B = trB(rec.de), C = B ? trCks(B) : [], nC = C.length, nx = trIsCk(rec.o) ? C[trCkN(rec.o) + 1] : null; const hb = typeof hlBox === 'function' ? hlBox(res, { src: 'thi' }) : { html: '', pri: false }, pct = Math.round(rec.ok * 100 / rec.n);
  const rows = Object.entries(rec.by).map(([p, [a, n]]) => `<span>${p} · ${TR_PN[Object.keys(TR_SECS).find(s => TR_SECS[s] === p)] || ''}</span><span>${a}/${n}</span><span>${Math.round(a * 100 / n)}%</span>`).join('');
  $app.innerHTML = `<div id="ie"></div><h1>🎓 Kết quả · ${esc(trOnlyName(rec.o, rec.de))}</h1><p class="mute" style="margin:0">${esc(trName(rec.de))} · ${trIsCk(rec.o) ? `làm từng lượt 10 câu (${trCkN(rec.o) + 1}/${nC} lượt)` : 'chỉ làm một phần'}</p>
    <div class="box"><p style="margin:0;font-size:20px"><b>${rec.ok}/${rec.n} câu đúng</b> <span class="mute" style="font-size:14px">(${pct}%)</span></p>
      ${rec.sc != null ? `<p style="margin:6px 0 0">≈ ${rec.sc} điểm ${rec.o === 'L' ? 'Nghe' : 'Đọc'} <span class="mute">(thang 5–495)</span></p>` : ''}
      ${prev ? `<p style="margin:6px 0 0">So lần trước (${new Date(prev.at).toLocaleDateString('vi-VN')}): <b>${rec.ok - prev.ok >= 0 ? '+' : ''}${rec.ok - prev.ok}</b> câu đúng</p>` : ''}
      <p class="mute" style="margin:6px 0 0">⏱ ${rec.min} phút${trIsL(rec.o) ? '' : `/${rec.rm || trRMin(rec.o)} phút`}${rec.auto ? ' (hết giờ, máy tự nộp)' : ''}${rec.gap ? ` · ⚠️ gián đoạn ${rec.gap} lần` : ''}</p>
      <p class="mute" style="margin:6px 0 0">${trIsCk(rec.o) ? 'Làm theo lượt' : 'Làm một phần'} nên không tính vào điểm đề thử trọn. Điểm ước theo tỉ lệ đúng, không phải bảng quy đổi của ETS.</p></div>
    ${trShRow(rec.de, 0, rec.o)}<div class="box trplan"><div class="ph"><div class="pr" aria-label="Số câu đúng từng Part">${rows}</div></div></div>${hb.html}
    ${nx ? `<button class="btnbig${hb.pri ? ' ghost' : ''}" data-trnx="${trCkId(nx)}">▶ Lượt ${nx.k + 1} · câu ${nx.a}–${nx.b}<small>${nx.n} câu · ${nx.p === 'L' ? 'máy tự chạy' : trCkMin(B, trCkId(nx)) + ' phút'}</small></button>` : ''}
    <button class="${hb.pri || nx ? '' : 'pri'}" data-trre="${esc(rec.de)}">${trIsCk(rec.o) ? 'Chọn lượt khác' : 'Làm phần khác của đề này'}</button><button data-trv>🎓 Về danh sách đề thử trọn</button>`;
  $app.onclick = e => { const b = e.target.closest('[data-trre]'); if (b) { scrollTo(0, 0); return trReady(b.dataset.trre); }
    const n = e.target.closest('[data-trnx]'); if (n) { scrollTo(0, 0); return trStart(rec.de, n.dataset.trnx); }
    if (e.target.closest('[data-trsh]')) { const snap = { html: $app.innerHTML, oc: $app.onclick, cur: window.CUR, y: window.scrollY || 0 }; return trSheet(rec.de, () => { TR.tok++; trHush(); $app.innerHTML = snap.html; $app.onclick = snap.oc; window.CUR = snap.cur; scrollTo(0, snap.y); }, '', rec.o); } }; scrollTo(0, 0); }
document.addEventListener('click', e => { if (S && e.target.closest('[data-trv]')) { scrollTo(0, 0); trView(); } });
