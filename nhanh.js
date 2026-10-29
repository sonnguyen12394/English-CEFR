// ⚡ Học nhanh mà vẫn chắc (v76, 28/10/2026, người sáng lập: "học dựa vào kiểm tra để nắm năng lực … rèn những bài yếu thôi"; "chấm theo nhiều yếu tố để các mục tiêu
// trong nhớ nâng lên đồng thời"; "tự tính làm cho mọi cấp, khỏi hỏi"). Mô phỏng trước khi làm: ngưỡng nhớ 90% biến 🔁 Nhớ thành máy chạy bộ (A1 ~313 ngày ở 11 phút / ngày).
//   ① Kiểm tra đầu bài Từ vựng (ptRun): mỗi từ 2 câu (thấy từ → chọn nghĩa, có "Chưa biết"; rồi nhìn nghĩa → tự gõ từ). Đúng cả 2 = đã biết: bỏ khỏi bài,
//      tính đã học; 3 mặt vừa chứng minh (📖 nghĩa, 💭 nhớ ra từ, ✍️ chính tả) tính 🔁 Nhớ (biết từ trước hôm nay), độ bền 4 ngày để sớm ôn xác nhận. Từ chưa biết → học như cũ.
//      Chấm theo TỪNG từ, không theo cả bài (đúng 8/10 không bỏ qua 2 từ chưa biết).
//   ② Ngưỡng tính nhớ 80% (MEM_R, app.js) cho mọi cấp, mọi phần; lịch ôn vẫn nhắc ở 90% (isDue).
//   ③ Chấm nhiều mục (mfCredit): câu đúng ở bài LUYỆN Đọc / Nghe / Ngữ pháp (không phải bài thi) cộng một lần ôn 📖 nghĩa cho từ đã học có trong câu hỏi + đáp án
//      (bằng chứng trực tiếp: phải hiểu câu hỏi và đáp án mới chọn đúng). Từ chỉ nằm trong đoạn văn: không cộng (hiểu ý chính không chứng minh biết từng từ).
//      Sai: không trừ (không biết sai vì từ nào). Mỗi từ cộng tối đa 1 lần / ngày, tối đa 8 từ / câu. Bỏ luật cũ "một câu chỉ chấm cho một phần" (25/10/2026).
//   ④ Tra từ = bằng chứng chưa nhớ (mfLookup): chạm từ để tra nghĩa trong bài đọc / thư viện → từ đã học đó về "cần ôn" (mặt 📖 nghĩa sai), tối đa 1 lần / ngày.
//   ⑤ Gợi ý học lại (relearnUnits): bài đã học có ≥ 3 từ đang quên và từng quên ≥ 2 lần → học lại riêng các từ đó, không bắt học lại cả bài.

// ---------- ① kiểm tra đầu bài ----------
const PT_DIMS = ['nghia', 'nhora', 'viet'];
function ptCard(now) { const c = { S: 4, last: now, d0: dayOf(now) - 1, ok: 1, pv: 1, n: 2, lapse: 0, pt: 1, dm: {} }; for (const k of PT_DIMS) c.dm[k] = { ok: 1, pv: 1, n: 1 }; return c; }
const ptNorm = s => String(s || '').toLowerCase().replace(/[‘’]/g, "'").replace(/\s+/g, ' ').trim();
// chạy kiểm tra cho bài u; xong gọi done(known: Set id từ đã biết)
function ptRun(u, done, title) { const T = title || `${uLabel(u)} · ${u.vi}`; const ws = u.words.filter(w => !S.cards[w.id]); let i = 0, step = 0; const known = new Set(), res = [];
  if (!ws.length) return done(known);
  $app.innerHTML = `${backRow(T)}<h1>⚡ Biết rồi thì bỏ qua</h1><div class="box"><p style="margin:0">Bài có ${ws.length} từ. Kiểm tra nhanh (~${Math.max(1, Math.round(ws.length * 12 / 60))} phút): mỗi từ 2 câu, chọn nghĩa rồi tự gõ từ. Từ nào đúng cả 2 thì bỏ khỏi bài, chỉ học từ chưa biết.</p>
    <p class="mute" style="margin:6px 0 0">Không đoán bừa: không biết thì bấm "Chưa biết". Đoán trúng chỉ làm sau này quên và phải học lại.</p></div>
    <button class="pri" data-pt="go">⚡ Kiểm tra trước</button><button data-pt="skip">📘 Học hết bài</button>`;
  $app.onclick = e => { if (e.target.closest('[data-a="home"]')) return home(); if (e.target.closest('[data-pt="skip"]')) return done(known); if (e.target.closest('[data-pt="go"]')) show(); };
  const next = ok => { res.push(ok); if (step === 0 && ok) { step = 1; return show(); } if (step === 1 && ok) known.add(ws[i].id); step = 0; i++; show(); };
  const show = () => { if (i >= ws.length) return end(); const w = ws[i]; window.CUR = { view: 'kiem-tra-dau-bai', item: u.id + ':' + w.id };
    const q = step === 0 ? question(w, 'w2vi') : question(w, 'spell');
    $app.innerHTML = `<div class="row top"><button class="link" data-a="home">← Thôi</button><span class="uname">⚡ ${i + 1}/${ws.length} · ${step ? 'tự gõ từ' : 'chọn nghĩa'}</span></div>
      <p class="q">${q.top}</p><p class="mute">${q.sub || ''}</p>
      ${q.typed ? `<form id="ptf" autocomplete="off"><input id="ptt" autocapitalize="off" autocorrect="off" spellcheck="false" aria-label="Gõ từ"><button class="pri" type="submit">Kiểm tra</button></form>`
        : q.opts.map((o, k) => `<button class="opt" data-po="${k}">${esc(o)}</button>`).join('')}<button class="opt" data-po="-1" style="opacity:.75">🤷 Chưa biết</button>`;
    const f = document.getElementById('ptf'); if (f) { const t = document.getElementById('ptt'); try { t.focus(); } catch (er) {} f.onsubmit = ev => { ev.preventDefault(); if (!t.value.trim()) return t.focus(); next(ptNorm(t.value) === ptNorm(q.a)); }; }
    $app.onclick = e => { if (e.target.closest('[data-a="home"]')) return home(); const b = e.target.closest('[data-po]'); if (!b) return; const k = +b.dataset.po; next(k >= 0 && q.opts && q.opts[k] === q.a); }; };
  const end = () => { const now = Date.now(); for (const id of known) S.cards[id] = ptCard(now); (S.pt = S.pt || []).push({ at: now, u: u.id, n: ws.length, known: known.size }); S.t = now; save();
    const left = ws.filter(w => !known.has(w.id));
    $app.innerHTML = `${backRow(T)}<h1>⚡ Đã biết ${known.size}/${ws.length} từ</h1>
      <div class="box">${known.size ? `<p style="margin:0">✅ Bỏ qua: ${ws.filter(w => known.has(w.id)).map(w => esc(w.w)).join(', ')}</p><p class="mute" style="margin:6px 0 0">Đã tính học. 📖 nghĩa, 💭 nhớ ra từ, ✍️ chính tả tính vào 🔁 Nhớ; vài ngày nữa app hỏi lại để xác nhận. Các mặt khác (nghe, nói, cụm…) luyện dần trong 🏋️ Luyện tập.</p>` : '<p style="margin:0">Chưa bỏ qua từ nào: học cả bài.</p>'}</div>
      ${left.length ? `<button class="pri" data-pt="learn">📘 Học ${left.length} từ chưa biết</button>` : '<button class="pri" data-pt="fin">✅ Hoàn thành bài</button>'}`;
    $app.onclick = e => { if (e.target.closest('[data-a="home"]')) return home(); if (e.target.closest('[data-pt="learn"], [data-pt="fin"]')) done(known); }; };
}

// ---------- ③ chấm nhiều mục: từ đã học trong câu hỏi + đáp án ----------
let MF_MAP = null;
const mfMap = () => MF_MAP || (MF_MAP = (() => { const m = new Map(); for (const w of WORDS) { const k = w.w.toLowerCase(); if (/^[a-z][a-z'-]+$/.test(k) && k.length >= 3 && !m.has(k)) m.set(k, w); } return m; })());
// từ trong chữ (bỏ thẻ html) → từ vựng của app; thử dạng gốc đơn giản (-s, -es, -ies, -ed, -d, -ing)
function mfWords(text) { const M = mfMap(), out = new Map();
  for (const t of String(text || '').replace(/<[^>]*>/g, ' ').toLowerCase().match(/[a-z][a-z'-]+/g) || []) {
    for (const f of [t, t.replace(/'s$/, ''), t.replace(/ies$/, 'y'), t.replace(/es$/, ''), t.replace(/s$/, ''), t.replace(/ied$/, 'y'), t.replace(/ed$/, ''), t.replace(/d$/, ''), t.replace(/ing$/, ''), t.replace(/ing$/, 'e')]) {
      const w = M.get(f); if (w) { out.set(w.id, w); break; } } }
  return [...out.values()]; }
const MF_MAX = 8, MF_PARTS = ['doc', 'nghe', 'np'];
// gọi từ kQuiz (kit.js) khi trả lời câu luyện (không phải thi). Trả về số từ được cộng.
function mfCredit(P, q, ok, now = Date.now()) { if (!ok || !P || !MF_PARTS.includes(P.id) || q.kind === 'write' || q.kind === 'say') return 0; const today = dayOf(now); let n = 0;
  for (const w of mfWords([q.q, q.a, ...(q.acc || []).slice(0, 1)].join(' '))) { if (n >= MF_MAX) break; const c = S.cards[w.id];
    if (!c || c.d0 >= today || c.mf === today) continue; grade(S, w.id, true, now, 'w2vi'); c.mf = today; n++; }
  if (n) { (S.mfn = S.mfn || {})[today] = (S.mfn[today] || 0) + n; } return n; }
// ④ tra từ trong bài đọc / thư viện → từ đã học đó cần ôn lại
function mfLookup(w, now = Date.now()) { const c = w && S.cards[w.id], today = dayOf(now); if (!c || c.d0 >= today || c.lk === today) return false; grade(S, w.id, false, now, 'w2vi'); c.lk = today; save(); return true; }

// ---------- ⑤ gợi ý học lại ----------
function relearnUnits(now = Date.now()) { return UNITS.filter(u => unitDone(u)).map(u => [u, u.words.filter(w => { const c = S.cards[w.id]; return c && c.lapse >= 2 && wstat(S, w, now) === 'quen'; })]).filter(([, ws]) => ws.length >= 3).sort((a, b) => b[1].length - a[1].length); }
function relearn(u) { const ws = (relearnUnits().find(([x]) => x === u) || [u, []])[1]; if (!ws.length) return home();
  lessonRun(u, ws, reqsUpTo(u.lv), `🔁 Học lại ${uLabel(u)}`, () => { $app.innerHTML = `<div class="box"><b>✅ Đã học lại ${ws.length} từ hay quên</b><p class="mute">Các từ này vẫn ở lịch ôn; 🏋️ Luyện tập sẽ hỏi lại sớm.</p></div><button class="pri" data-a="home">Về 📚 Từ vựng</button>`;
    $app.onclick = e => { if (e.target.closest('[data-a="home"]')) home(); }; }); }
document.addEventListener('click', e => { const b = e.target.closest('[data-relearn]'); if (b && S) { scrollTo(0, 0); relearn(UBY[b.dataset.relearn]); } });
