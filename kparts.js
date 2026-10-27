// Khai báo 5 phần chạy trên kit.js. Mặt của từng phần (bản v30 người sáng lập đã xem; sửa theo dữ liệu có thật, quyết định kỹ thuật 25/10/2026):
//   🧱 Ngữ pháp: 🔎 Nhận ra (trắc nghiệm) · ✏️ Điền dạng (gõ) · 🛠 Sửa lỗi (gõ lại câu đúng).
//   📰 Đọc: 💡 Ý chính (chọn đúng chủ đề bài) · 🔍 Chi tiết (câu hỏi trong bài). 🧠 Suy luận bỏ: kho câu có sẵn gần như không có loại này.
//   🎧 Nghe: 💡 Ý chính · 🔍 Chi tiết · ✍️ Chép lại (nghe một câu, chép đúng ≥ 80% từ). Không hiện chữ bài trước khi trả lời; luyện / thi nghe tối đa 2 lần mỗi bài.
//     Soát 25/10/2026 (người sáng lập "thiết kế cho phù hợp", giữ ngưỡng thi): chép 90% → 80% (chính tả là việc của Từ vựng); thêm hội thoại 2 giọng (content/nghe-dlg.json).
//   🗣 Nói: ✅ Đủ ý (máy chép lời, tìm ý bằng từ khoá; đề ≥ 4 ý được thiếu 1) · 🗣 Nói rõ (đọc to câu, máy chép ra ≥ 80% từ) · 💬 Giao tiếp
//     (đóng vai: gọi món, mua bán, taxi, hỏi đường…; nói đúng việc ≥ 80% lượt; chỉ bài đóng vai có mặt này). Cần Safari.
//   ✍️ Viết: ✅ Đủ ý (từ khoá; đề ≥ 4 ý được thiếu 1) · 📝 Đúng dạng bài (đủ độ dài, có chào / kết khi là thư, tin nhắn). Không chấm ngữ pháp, chính tả (phần khác).
// Thi: Ngữ pháp / Đọc / Nghe / Nói đạt ≥ 80–85%; Viết (4 kết quả) đạt ≥ 75%. Đọc, Nghe có bài thi riêng; Nói có câu đọc to riêng;
// Nói / Viết dùng lại đề đã học cho phần "đủ ý" (kho chỉ có 8 đề mỗi cấp; bài nói / viết mới mỗi lần, không học thuộc được câu trả lời).
const kSay = t => `<button class="chip" data-sayt="${esc(t)}">🔊</button>`;
const kSents = t => String(t).split(/(?<=[.!?])\s+/).map(s => s.trim()).filter(Boolean);
const kOpts = (a, w) => shuf([a, ...w]);
// số ý cần có: đề ≥ 4 ý thì được thiếu 1 ý, đề ≤ 3 ý thì phải đủ (thay "≥ 80%" làm tròn lên, vốn bắt đủ cả 4 ý)
const kNeed = n => n >= 4 ? n - 1 : n;
const kModel = x => [].concat(x.m).join('\n\n');
// từ trong câu ngữ pháp mà người học chưa học (soát Pre-A1: ~150 từ ngoài 365 từ Pre-A1): hiện nghĩa ngay dưới câu, để câu chỉ đo ngữ pháp
function kGloss(s) { const seen = new Set(), out = [];
  for (const t of String(s).toLowerCase().match(/[a-z]+/g) || []) { const w = WBY[t] || WBY[t.replace(/(es|s)$/, '')] || WBY[t.replace(/ing$/, '')] || WBY[t.replace(/ed$/, '')];
    if (w && !S.cards[w.id] && !seen.has(w.id) && w.w.length > 2) { seen.add(w.id); out.push(`<b>${esc(w.w)}</b> = ${esc(w.vi)}`); } }
  return out.length ? `<p class="mute" style="margin:4px 0">Từ chưa học: ${out.slice(0, 4).join(' · ')}</p>` : ''; }
const kOther = (P, x, f, n) => shuf(P.items.filter(y => y.lv === x.lv && y.id !== x.id && f(y) !== f(x))).slice(0, n).map(f);

// ---------- 🧱 Ngữ pháp ----------
KIT.np = { id: 'np', ic: '🧱', t: 'Ngữ pháp', file: 'np.json?v=3', lvs: ['pre', 'a1', 'a2'], unit: 'điểm ngữ pháp', pass: 0.85,
  intro: 'Mỗi điểm: công thức, cách dùng, lỗi người Việt hay mắc.',
  dims: [['nhan', '🔎 Nhận ra', 'Chọn câu / dạng đúng'], ['dien', '✏️ Điền dạng', 'Tự gõ dạng đúng'], ['sua', '🛠 Sửa lỗi', 'Gõ lại câu cho đúng']],
  examTxt: 'Mỗi điểm 2 câu chưa gặp (nhận ra / điền / sửa).',
  name: x => x.title,
  lesson: x => `<h1>${esc(x.title)}</h1><p class="mute">${esc(x.en)}</p>
    <div class="box"><b>📐 Công thức</b>${x.form.map(f => `<p style="margin:4px 0">${esc(f)}</p>`).join('')}</div>
    <div class="box"><b>🎯 Dùng khi</b>${x.use.map(f => `<p style="margin:4px 0">• ${esc(f)}</p>`).join('')}${x.note ? `<p class="mute" style="margin:6px 0 0">⚠️ ${esc(x.note)}</p>` : ''}</div>
    <div class="box"><b>📝 Ví dụ</b>${x.ex.map(([e, v]) => `<p style="margin:6px 0">${kSay(e)} ${esc(e)}<br><span class="mute">${esc(v)}</span></p>`).join('')}</div>`,
  q: (x, k, pool) => {
    if (k === 'nhan') return shuf(x.mc[pool]).slice(0, pool === 'learn' ? 2 : 1).map(m => ({ x, k, kind: 'mc', head: kGloss(m.s), q: 'Chọn từ đúng: ' + esc(m.s), opts: kOpts(m.a, m.w), a: m.a, why: m.why }));
    if (k === 'dien') return shuf(x.ty[pool]).slice(0, 1).map(m => ({ x, k, kind: 'type', head: '<p class="mute">Gõ từ còn thiếu (chia đúng dạng).</p>' + kGloss(m.s), q: esc(m.s), acc: m.a, why: m.why ? Object.values(m.why)[0] : '' }));
    return shuf(x.fx[pool]).slice(0, 1).map(m => ({ x, k, kind: 'type', head: '<p class="mute">🛠 Câu dưới đây sai. Gõ lại cả câu cho đúng.</p>' + kGloss(m.good), q: '❌ ' + esc(m.bad), acc: [m.good, ...(m.alt || [])], why: m.why })); },
  tryQs: x => ['nhan', 'dien', 'sua'].flatMap(k => KIT.np.q(x, k, 'learn').slice(0, 1)),
  menu: [['nhan', '🔎 Luyện nhận ra (5 điểm)', 'Trắc nghiệm, 2 câu mỗi điểm', ['nhan'], 5], ['dien', '✏️ Luyện điền dạng (6 điểm)', 'Tự gõ dạng đúng', ['dien'], 6], ['sua', '🛠 Luyện sửa lỗi (6 điểm)', 'Gõ lại câu sai cho đúng', ['sua'], 6]],
  ask: (x, m) => KIT.np.q(x, m, 'learn'),
  exam: lv => kItems(KIT.np, lv).flatMap(x => shuf(['nhan', 'dien', 'sua']).slice(0, 2).flatMap(k => KIT.np.q(x, k, 'test'))) };

// ---------- 📰 Đọc / 🎧 Nghe (cùng kiểu bài, khác kho bài và cách đưa bài) ----------
const K_CHEP = 0.8;
const kScript = x => x.lines ? x.lines.map(([sp, t]) => `<b>${sp === 'A' ? '👩' : '👨'}</b> ${esc(t)}`).join('<br>') : esc(x.text);
function kRead(P, x, k, listen) {
  const head = listen ? `<p class="mute">🎧 ${x.lines ? 'Hội thoại' : 'Bài nghe'} (chưa hiện chữ): nghe rồi trả lời. Mỗi bài nghe tối đa ${K_PLAYS} lần.</p>`
    : `<div class="box"><b>${esc(x.title)}</b><p style="font-size:18px;line-height:1.6;margin:8px 0 0;white-space:pre-line">${esc(x.text)}</p></div>`;
  const after = listen ? `<details><summary>Xem bài nghe</summary><p style="white-space:pre-line">${kScript(x)}</p>${x.vi ? `<p class="mute">${esc(x.vi)}</p>` : ''}</details>` : '';
  const say = null, play = listen ? { key: x.id, lines: x.lines, text: x.text } : null;
  if (k === 'y') return [{ x, k, kind: 'mc', head, q: 'Bài này chủ yếu nói về gì?', opts: kOpts(x.tvi, kOther(P, x, y => y.tvi, 2)), a: x.tvi, say, play, after }];
  if (k === 'ct') return x.qs.filter(q => !/mainly|main idea|best title|mostly about/i.test(q.q)).map(q => ({ x, k, kind: 'mc', head, q: esc(q.q), opts: kOpts(q.a, q.w), a: q.a, why: q.why, say, play, after }));
  // ✍️ chép lại: một câu 5–12 từ của bài
  const ss = kSents(x.text).filter(s => { const n = kWords(s).length; return n >= 5 && n <= 12; }), s = ss[Math.floor(Math.random() * ss.length)] || kSents(x.text)[0];
  return [{ x, k, kind: 'type', head: `<p class="mute">Nghe một câu trong bài rồi chép lại (tối đa ${K_PLAYS} lần).</p>`, q: '✍️ Chép lại câu vừa nghe', play: { key: x.id + '|' + s, text: s },
    check: t => { const r = kMatch(s, t); return { ok: r >= K_CHEP, html: `Câu đúng: <b>${esc(s)}</b> · khớp ${Math.round(r * 100)}% từ (cần ${K_CHEP * 100}%).` }; } }];
}
const kReadLesson = (x, listen) => `<h1>${esc(listen ? x.tvi : x.title)}</h1>
  ${listen ? `<p class="mute">Nghe cả bài (chưa nhìn chữ). Nghe 2–3 lần rồi mới mở bài. Khi luyện / thi chỉ được nghe ${K_PLAYS} lần.</p><button class="pri" data-kdlg="nghe|${x.id}">🔊 Nghe cả bài</button>` : ''}
  <details ${listen ? '' : 'open'}><summary>${listen ? 'Mở chữ bài nghe' : 'Bài đọc'}</summary><div class="box"><p style="font-size:18px;line-height:1.6;margin:0;white-space:pre-line">${listen ? kScript(x) : esc(x.text)}</p></div></details>
  ${x.vi ? `<button class="link" data-kl="vi">Hiện / ẩn bản dịch</button><div id="kvi" hidden class="box"><p class="mute" style="margin:0;white-space:pre-line">${esc(x.vi)}</p></div>` : ''}`;
KIT.doc = { id: 'doc', ic: '📰', t: 'Đọc', file: 'doc.json?v=3', lvs: ['pre', 'a1', 'a2'], unit: 'bài đọc', pass: 0.8,
  intro: 'Bài kiểu Cambridge: Pre-A1 bài ngắn 40–50 từ như Starters (chỉ dùng từ Pre-A1); A1 tin nhắn, thông báo, câu chuyện; A2 có bài dài 150–250 từ như A2 Key.',
  dims: [['y', '💡 Ý chính', 'Bài nói về gì'], ['ct', '🔍 Chi tiết', 'Tìm thông tin trong bài']],
  examTxt: '6 bài đọc chưa gặp: ý chính + chi tiết.',
  name: x => x.title, lesson: x => kReadLesson(x, false),
  q: (x, k) => kRead(KIT.doc, x, k, false), tryQs: x => [...kRead(KIT.doc, x, 'y'), ...kRead(KIT.doc, x, 'ct')],
  menu: [['y', '💡 Luyện ý chính (4 bài)', 'Đọc bài, chọn đúng chủ đề', ['y'], 4], ['ct', '🔍 Luyện chi tiết (2 bài)', 'Đọc bài, trả lời câu hỏi', ['ct'], 2]],
  ask: (x, m) => kRead(KIT.doc, x, m, false),
  exam: lv => shuf(KIT.doc.items.filter(x => x.lv === lv && x.test)).slice(0, 6).flatMap(x => [...kRead(KIT.doc, x, 'y', false), ...kRead(KIT.doc, x, 'ct', false)]) };
KIT.nghe = { id: 'nghe', ic: '🎧', t: 'Nghe', file: 'nghe.json?v=3', lvs: ['pre', 'a1', 'a2'], unit: 'bài nghe', pass: 0.8,
  intro: 'Bài kể và hội thoại 2 giọng (số, giờ, giá, đánh vần như đề Cambridge); Pre-A1 câu ngắn kiểu Starters. Khi luyện / thi mỗi bài nghe tối đa 2 lần.',
  dims: [['y', '💡 Ý chính', 'Bài nói về gì'], ['ct', '🔍 Chi tiết', 'Nghe ra thông tin'], ['chep', '✍️ Chép lại', 'Nghe một câu, chép đúng ≥ 80% từ']],
  examTxt: '6 bài nghe chưa gặp: ý chính + chi tiết + chép 1 câu.',
  name: x => x.tvi, lesson: x => kReadLesson(x, true),
  tryQs: x => [...kRead(KIT.nghe, x, 'y', true), ...kRead(KIT.nghe, x, 'ct', true).slice(0, 1), ...kRead(KIT.nghe, x, 'chep', true)],
  menu: [['y', '💡 Luyện ý chính (4 bài)', 'Nghe bài, chọn đúng chủ đề', ['y'], 4], ['ct', '🔍 Luyện chi tiết (2 bài)', 'Nghe bài, trả lời câu hỏi', ['ct'], 2], ['chep', '✍️ Luyện chép lại (5 bài)', 'Nghe một câu, chép lại', ['chep'], 5]],
  ask: (x, m) => kRead(KIT.nghe, x, m, true),
  exam: lv => shuf(KIT.nghe.items.filter(x => x.lv === lv && x.test)).slice(0, 6).flatMap(x => ['y', 'ct', 'chep'].flatMap(k => kRead(KIT.nghe, x, k, true))) };

// ---------- 🗣 Nói ----------
const K_MINW = { a1: 15, a2: 25 };
function kTalk(x) { const ideas = x.k || [];
  return { x, k: 'viec', kind: 'speak', head: `<div class="box"><b>${esc(x.en)}</b> <span class="mute">· ${esc(x.vi)}</span><p style="margin:6px 0">${esc(x.p)}</p><p class="mute" style="margin:0">${esc(x.pv)}</p>
      <p class="mute" style="margin:6px 0 0">Cần nói đủ: ${x.c.map(esc).join(' · ')}. Ít nhất ${K_MINW[x.lv]} từ.</p></div>`, q: '🎤 Nói khoảng 30 giây rồi bấm Dừng.',
    check: t => { const hit = ideas.map(g => kHit(t, g)), n = hit.filter(Boolean).length, need = kNeed(ideas.length), wc = kWords(t).length;
      return { ok: n >= need && wc >= K_MINW[x.lv], html: `Máy nghe ra ${wc} từ (cần ${K_MINW[x.lv]}). Ý tìm thấy ${n}/${ideas.length} (cần ${need}):<br>${x.c.map((c, i) => `${hit[i] ? '✅' : '⬜'} ${esc(c)}`).join('<br>')}
        <details><summary>Bài mẫu</summary><p>${kSay(x.m)} ${esc(x.m)}</p></details>` }; } }; }
const kAloud = (x, s, k = 'ro') => ({ x, k, kind: 'speak', head: `<div class="box"><p style="font-size:20px;margin:0">${esc(s)}</p></div>`, q: '🗣 Đọc to câu trên rồi bấm Dừng.',
  check: t => { const r = kMatch(s, t); return { ok: r >= 0.8, html: `Máy nghe ra: "${esc(t || '…')}" · khớp ${Math.round(r * 100)}% từ (cần 80%). ${kSay(s)} nghe mẫu` }; } });
const kModelSent = x => { const ss = kSents(x.m).filter(s => { const n = kWords(s).length; return n >= 5 && n <= 14; }); return ss[Math.floor(Math.random() * ss.length)] || kSents(x.m)[0]; };
// 💬 đóng vai: mỗi lượt của người học là một câu nói; nghe câu của người kia (giọng máy), đọc việc cần nói, nói; chấm theo luật need của lượt.
function kRp(x, steps) { const out = []; let prev = ''; const hist = [];
  for (const st of steps) { if (st.s) { prev = st.t; hist.push(`👤 ${esc(st.t)}`); continue; }
    const said = prev, h = hist.slice(-2).join('<br>');
    out.push({ x, k: 'gt', kind: 'speak', head: `<div class="box"><b>${x.ic} ${esc(x.vi)}</b>${h ? `<p style="margin:6px 0">${h}</p>` : ''}${said ? kSay(said) : ''}<p style="margin:6px 0 0"><b>Bạn:</b> ${esc(st.vi)}</p></div>`,
      q: '🎤 Nói câu của bạn rồi bấm Dừng.', say: said ? [said] : null,
      check: t => { const ok = kNeedOk(st.need, t); return { ok, html: `Máy nghe ra: "${esc(t || '…')}". ${ok ? '' : 'Chưa đủ ý của lượt này. '}Câu mẫu: ${kSay(st.t)} <b>${esc(st.t)}</b>` }; } });
    hist.push(`🙋 ${esc(st.t)}`); prev = ''; }
  return out; }
const kRpLesson = x => { const v = x.learn[0]; return `<h1>${x.ic} ${esc(x.vi)}</h1><p class="mute">Đóng vai: máy là người kia, bạn nói phần của mình. Mỗi lần luyện là một biến thể khác (món, giá, nơi chốn đổi).</p>
  <div class="box"><b>Hội thoại mẫu</b>${v.map(s => `<p style="margin:6px 0">${s.s ? '👤' : '🙋'} ${kSay(s.t)} ${esc(s.t)}${s.vi ? `<br><span class="mute">Việc của bạn: ${esc(s.vi)}</span>` : ''}</p>`).join('')}</div>`; };
KIT.noi = { id: 'noi', ic: '🗣', t: 'Nói', file: 'noi.json?v=2', lvs: ['a1', 'a2'], unit: 'đề nói và tình huống', pass: 0.8, needAsr: true,
  intro: 'Đề nói về bản thân và đóng vai giao tiếp (gọi món, mua bán, taxi, hỏi đường…). Máy chép lời, tìm ý bằng từ khoá; không chấm ngữ pháp, phát âm (phần khác).',
  dims: [['viec', '✅ Đủ ý', 'Đề nói: nói đủ ý'], ['ro', '🗣 Nói rõ', 'Đọc to câu, máy chép ra ≥ 80% từ'], ['gt', '💬 Giao tiếp', 'Đóng vai: nói đúng việc ≥ 80% lượt']],
  dimsOf: x => x.type === 'rp' ? ['gt'] : ['viec', 'ro'],
  examTxt: '4 đề nói (nói mới, máy tìm ý) + 4 câu đọc to chưa gặp + 2 tình huống đóng vai chưa gặp.',
  name: x => x.vi,
  lesson: x => x.type === 'rp' ? kRpLesson(x) : `<h1>${esc(x.vi)}</h1><p class="mute">${esc(x.en)}</p>
    <div class="box"><b>Đề</b><p style="margin:6px 0">${esc(x.p)}</p><p class="mute" style="margin:0">${esc(x.pv)}</p></div>
    <div class="box"><b>Cần nói đủ</b>${x.c.map(c => `<p style="margin:4px 0">• ${esc(c)}</p>`).join('')}</div>
    <div class="box"><b>Cụm hữu ích</b>${x.u.map(([e, v]) => `<p style="margin:4px 0">${kSay(e)} ${esc(e)} <span class="mute">· ${esc(v)}</span></p>`).join('')}</div>
    <div class="box"><b>Bài mẫu</b><p style="margin:6px 0">${kSay(x.m)} ${esc(x.m)}</p></div>`,
  tryQs: x => x.type === 'rp' ? kRp(x, x.learn[0]) : [kTalk(x), kAloud(x, kModelSent(x))],
  menu: [['viec', '✅ Luyện nói đủ ý (1 đề)', 'Nói theo đề khoảng 30 giây', ['viec'], 1], ['ro', '🗣 Luyện nói rõ (4 câu)', 'Đọc to câu trong bài mẫu', ['ro'], 4],
    ['gt', '💬 Luyện đóng vai (1 tình huống)', 'Nói phần của bạn trong hội thoại', ['gt'], 1]],
  ask: (x, m) => m === 'gt' ? kRp(x, x.learn[Math.floor(Math.random() * x.learn.length)]) : m === 'viec' ? [kTalk(x)] : [kAloud(x, kModelSent(x))],
  exam: lv => { const P = KIT.noi, L = shuf(kItems(P, lv).filter(x => x.type !== 'rp')), R = shuf(kItems(P, lv).filter(x => x.type === 'rp')).slice(0, 2), ss = shuf(P.raw.test[lv]).slice(0, 4);
    return [...L.slice(0, 4).map(kTalk), ...ss.map((s, i) => kAloud(L[i % L.length], s)), ...R.flatMap(x => kRp(x, x.tests[Math.floor(Math.random() * x.tests.length)]))]; } };

// ---------- ✍️ Viết ----------
const K_LETTER = /tin nhắn|thư|email|thiệp|bưu thiếp|ghi chú|hồ sơ/;
function kWrite(x) { const ideas = (x.k || []).map((g, i) => [g, x.c[i]]).filter(([g]) => g);
  return { x, k: 'y', kind: 'write', head: `<div class="box"><b>${esc(x.en)}</b> <span class="mute">· ${esc(x.genre)}</span><p style="margin:6px 0">${esc(x.p)}</p><p class="mute" style="margin:0">${esc(x.pv)}</p>
      <p class="mute" style="margin:6px 0 0">Cần viết đủ: ${x.c.map(esc).join(' · ')}. Độ dài ${x.min}–${x.max} từ.</p></div>`, q: '✍️ Viết bài vào ô dưới.',
    check: t => { const hit = ideas.map(([g]) => kHit(t, g)), n = hit.filter(Boolean).length, need = kNeed(ideas.length), wc = kWords(t).length;
      const lenOk = wc >= x.min && wc <= x.max + 30, letter = K_LETTER.test(x.genre), open = /^\s*(hi|hello|dear|hey|good (morning|afternoon|evening))\b/i.test(t),
        close = /(bye|love|regards|best wishes|see you|take care|thanks|thank you|sincerely|write soon|cheers|from)\W*(\n.*)?\s*$/i.test(t.trim()) || /\n\s*[A-Z][a-z]+\s*$/.test(t);
      const dang = lenOk && kSents(t).length >= 2 && (!letter || open || close);
      return { ks: { y: n >= need, dang }, ok: n >= need && dang, html: `✅ Đủ ý ${n}/${ideas.length} (cần ${need}): <br>${ideas.map(([, c], i) => `${hit[i] ? '✅' : '⬜'} ${esc(c)}`).join('<br>')}
        <br>📝 Đúng dạng bài: ${dang ? '✅' : '❌'} ${wc} từ (cần ${x.min}–${x.max})${letter ? `, ${open || close ? 'có' : 'thiếu'} lời chào / lời kết` : ''}.
        <details><summary>Bài mẫu</summary><p style="white-space:pre-line">${esc(kModel(x))}</p></details>` }; } }; }
KIT.viet = { id: 'viet', ic: '✍️', t: 'Viết', file: 'viet.json?v=2', lvs: ['a1', 'a2'], unit: 'đề viết', pass: 0.75,
  intro: 'Máy tìm ý bằng từ khoá và xem dạng bài (độ dài, lời chào / kết). Không chấm ngữ pháp, chính tả: đó là phần khác.',
  dims: [['y', '✅ Đủ ý', 'Viết đủ các ý đề yêu cầu'], ['dang', '📝 Đúng dạng bài', 'Độ dài, chào / kết khi là thư']],
  examTxt: '2 đề viết (viết mới), chấm ý và dạng bài.',
  name: x => x.vi,
  lesson: x => `<h1>${esc(x.vi)}</h1><p class="mute">${esc(x.en)} · ${esc(x.genre)} · ${x.min}–${x.max} từ</p>
    <div class="box"><b>Đề</b><p style="margin:6px 0">${esc(x.p)}</p><p class="mute" style="margin:0">${esc(x.pv)}</p></div>
    <div class="box"><b>Cần viết đủ</b>${x.c.map(c => `<p style="margin:4px 0">• ${esc(c)}</p>`).join('')}</div>
    <div class="box"><b>Cụm hữu ích</b>${x.u.map(([e, v]) => `<p style="margin:4px 0">${esc(e)} <span class="mute">· ${esc(v)}</span></p>`).join('')}</div>
    <div class="box"><b>Bài mẫu</b><p style="margin:6px 0;white-space:pre-line">${esc(kModel(x))}</p></div>`,
  tryQs: x => [kWrite(x)],
  menu: [['y', '✍️ Viết 1 đề', 'Chấm cả ✅ Đủ ý và 📝 Đúng dạng bài', ['y', 'dang'], 1]],
  ask: x => [kWrite(x)],
  exam: lv => shuf(kItems(KIT.viet, lv)).slice(0, 2).map(kWrite) };

// ---------- góp ý #12 (25/10/2026): mỗi mặt nói rõ đo gì, học ở đâu trong bài (kTeach / kDimView, kit.js); bài học dạy đủ trước khi Nhớ luyện lại ----------
KIT.np.info = {
  nhan: { what: 'Nhìn câu có chỗ trống, chọn dạng đúng.', learn: 'ô 📐 Công thức và 📝 Ví dụ', ex: 'They ___ from Vietnam. → <b>are</b> / is / am' },
  dien: { what: 'Tự gõ dạng đúng vào chỗ trống, không có phương án chọn.', learn: 'ô 📐 Công thức (khẳng định, phủ định, câu hỏi)', ex: 'We ___ (be) very happy today. → gõ <b>are</b>' },
  sua: { what: 'Thấy câu sai, gõ lại cả câu cho đúng.', learn: 'ô ⚠️ Lỗi hay gặp (câu sai → câu đúng, vì sao)', ex: '❌ She beautiful. → gõ <b>She is beautiful.</b>' } };
{ const base = KIT.np.lesson; KIT.np.lesson = x => base(x) + `<div class="box"><b>⚠️ Lỗi hay gặp</b>${x.fx.learn.slice(0, 2).map(f => `<p style="margin:6px 0">❌ ${esc(f.bad)}<br>✅ <b>${esc(f.good)}</b><br><span class="mute">${esc(f.why)}</span></p>`).join('')}</div>`; }
KIT.doc.info = {
  y: { what: 'Đọc cả bài, chọn đúng chủ đề của bài.', learn: 'đọc cả bài. Mẹo: tiêu đề, câu đầu và câu cuối thường nói ý chính', ex: 'Bài này chủ yếu nói về gì? → <b>Bữa sáng ở nhà</b> / …' },
  ct: { what: 'Tìm thông tin cụ thể trong bài: ai, cái gì, khi nào, ở đâu, bao nhiêu.', learn: 'đọc bài và bản dịch. Mẹo: lấy từ khoá của câu hỏi, tìm câu có từ đó trong bài', ex: 'What does Lan cook for breakfast? → tìm câu "I usually make rice…"' } };
KIT.nghe.info = {
  y: { what: 'Nghe cả bài (không nhìn chữ), chọn đúng chủ đề.', learn: 'nghe cả bài 2–3 lần rồi mới mở chữ. Mẹo: vài câu đầu thường nói bài về gì', ex: '🔊 … → Bài này chủ yếu nói về gì?' },
  ct: { what: 'Nghe ra thông tin: số, giờ, giá, tên đánh vần, nơi chốn.', learn: 'nghe lại, mở chữ đối chiếu. Mẹo: đọc câu hỏi trước, chú ý số và tên', ex: '🔊 "That\'s six dollars fifty." → <b>$6.50</b> / $5.60' },
  chep: { what: 'Nghe một câu trong bài, chép lại đúng ≥ 80% từ.', learn: 'mở chữ bài nghe, nghe từng câu và đọc theo', ex: '🔊 một câu → gõ lại câu đó' } };
KIT.noi.info = {
  viec: { what: 'Nói theo đề khoảng 30 giây, đủ các ý đề yêu cầu. Máy chép lời rồi tìm ý bằng từ khoá.', learn: 'ô Cần nói đủ, Cụm hữu ích và Bài mẫu', ex: 'Giới thiệu bản thân → nói tên, tuổi, quê, việc làm, sở thích' },
  ro: { what: 'Đọc to một câu, máy chép ra đúng ≥ 80% số từ.', learn: 'Bài mẫu: bấm 🔊 nghe rồi đọc theo', ex: '"I\'m from Da Nang, but now I live in Hanoi." → đọc to' },
  gt: { what: 'Đóng vai: mỗi lượt nói đúng việc (gọi món, hỏi giá, nói nơi đến…); đạt khi ≥ 80% lượt đúng.', learn: 'Hội thoại mẫu: nghe từng câu, đọc phần "Việc của bạn"', ex: '👤 What can I get for you? → 🙋 Can I have two teas, please?' } };
KIT.viet.info = {
  y: { what: 'Viết đủ các ý đề yêu cầu. Máy tìm ý bằng từ khoá.', learn: 'ô Cần viết đủ, Cụm hữu ích và Bài mẫu', ex: 'Thiệp mời sinh nhật → lời mời, ngày giờ, địa điểm, một chi tiết thêm' },
  dang: { what: 'Đúng dạng bài: đủ độ dài; thư, tin nhắn, thiệp có lời chào và lời kết.', learn: 'ô 📝 Dạng bài', ex: 'Hi Mai, … See you soon! Lan (25–50 từ)' } };
{ const base = KIT.viet.lesson; KIT.viet.lesson = x => base(x) + `<div class="box"><b>📝 Dạng bài</b><p style="margin:6px 0">Độ dài ${x.min}–${x.max} từ, ít nhất 2–3 câu.</p>
  ${K_LETTER.test(x.genre) ? `<p style="margin:6px 0">Đây là ${esc(x.genre)}: mở đầu bằng lời chào (<i>Hi …, / Dear …,</i>), kết bằng lời chào cuối (<i>See you! / Best wishes,</i>) và tên.</p>` : '<p style="margin:6px 0">Viết thành đoạn liền mạch, kể theo thứ tự (first, then, after that…).</p>'}</div>`; }
