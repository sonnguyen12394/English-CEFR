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
// v97 (người sáng lập duyệt 31/10/2026): ngưỡng qua thi 2 bậc: kiến thức từng mục (Từ vựng, Ngữ pháp, Phát âm) 85%; kỹ năng tổng hợp Đọc, Nghe 75%,
// Nói, Viết 70% (gần ngưỡng đạt của đề Cambridge; câu AI soạn chưa kiểm dễ làm trượt oan). ref = Nói, Viết máy chấm gián tiếp: tham khảo, không chặn hoàn thành cấp.
KIT.np = { id: 'np', ic: '🧱', t: 'Ngữ pháp', file: 'np.json?v=5', lvs: ['pre', 'a1', 'a2', 'b1', 'b2', 'c1', 'c2'], unit: 'điểm ngữ pháp', pass: 0.85,
  intro: 'Mỗi điểm: công thức, cách dùng, lỗi người Việt hay mắc.',
  how: '1 Hiểu (câu này nghĩa là gì) → 2 Nhận ra (chọn dạng đúng) → 3 Tạo dạng (gõ dạng đúng, chạm chỗ sai, sửa câu) → 4 Phân biệt (🔀 trộn điểm dễ nhầm) → 5 Dùng (viết lại câu, từ B1). ▶ Luyện theo bậc tự chọn bậc cho từng điểm.',
  dims: [['nhan', '🔎 Nhận ra', 'Chọn câu / dạng đúng'], ['dien', '✏️ Điền dạng', 'Tự gõ dạng đúng'], ['sua', '🛠 Sửa lỗi', 'Gõ lại câu cho đúng']],
  examTxt: 'Mỗi điểm 2 câu chưa gặp (nhận ra / điền / sửa).',
  name: x => x.title,
  lesson: x => `<h1>${esc(x.title)}</h1><p class="mute">${esc(x.en)}</p>
    <div class="box"><b>📐 Công thức</b>${x.form.map(f => `<p style="margin:4px 0">${esc(f)}</p>`).join('')}</div>
    <div class="box"><b>🎯 Dùng khi</b>${x.use.map(f => `<p style="margin:4px 0">• ${esc(f)}</p>`).join('')}${x.note ? `<p class="mute" style="margin:6px 0 0">⚠️ ${esc(x.note)}</p>` : ''}</div>
    <div class="box"><b>📝 Ví dụ</b>${x.ex.map(([e, v]) => `<p style="margin:6px 0">${kSay(e)} ${esc(e)}<br><span class="mute">${esc(v)}</span></p>`).join('')}</div>`,
  q: (x, k, pool) => {
    // v101 bậc 1 · Hiểu: đọc câu, trả lời câu hỏi về NGHĨA (content/np-hieu.json, Pre-A1 → A2)
    if (k === 'hieu') return (x.hieu || []).map(h => ({ x, k, kind: 'mc', head: `<div class="box"><p style="margin:0;font-size:18px">${kSay(h.s)} ${esc(h.s)}</p></div><p class="mute">🔎 Bậc 1 · Hiểu: câu này nghĩa là gì?</p>`, q: esc(h.q), opts: kOpts(h.a, h.w), a: h.a }));
    // v101 bậc 3 · làm quen trước khi sửa câu: chạm vào từ sai (tự sinh từ cặp câu sai / đúng; chỉ khi câu sai có đúng MỘT từ không có trong câu đúng)
    if (k === 'tap') { const tk = s => String(s).replace(/[.,!?]/g, '').split(/\s+/).filter(Boolean);
      return shuf(x.fx[pool]).map(m => { const g = new Set(tk(m.good).map(t => t.toLowerCase())), b = tk(m.bad), wr = b.filter(t => !g.has(t.toLowerCase()));
        return wr.length === 1 && b.length <= 12 ? { x, k, kind: 'mc', head: '<p class="mute">🛠 Làm quen: chạm vào từ SAI trong câu (sau đó mới gõ lại cả câu).</p>' + kGloss(m.good), q: '❌ ' + esc(m.bad), opts: [...new Set(b)], a: wr[0], why: m.why } : null; }).filter(Boolean).slice(0, 1); }
    if (k === 'nhan') return shuf(x.mc[pool]).slice(0, pool === 'learn' ? 2 : 1).map(m => ({ x, k, kind: 'mc', head: kGloss(m.s), q: 'Chọn từ đúng: ' + esc(m.s), opts: kOpts(m.a, m.w), a: m.a, why: m.why }));
    if (k === 'dien') return shuf(x.ty[pool]).slice(0, 1).map(m => ({ x, k, kind: 'type', head: '<p class="mute">Gõ từ còn thiếu (chia đúng dạng).</p>' + kGloss(m.s), q: esc(m.s), acc: m.a, why: m.why ? Object.values(m.why)[0] : '' }));
    return shuf(x.fx[pool]).slice(0, 1).map(m => ({ x, k, kind: 'type', head: '<p class="mute">🛠 Câu dưới đây sai. Gõ lại cả câu cho đúng.</p>' + kGloss(m.good), q: '❌ ' + esc(m.bad), acc: [m.good, ...(m.alt || [])], why: m.why })); },
  // v101: bài học ngày đầu = bậc 1 Hiểu + bậc 2 Nhận ra; Tạo dạng (điền, sửa) hỏi trong luyện theo bậc khi Nhận ra đã đúng
  tryQs: x => [...KIT.np.q(x, 'hieu', 'learn').slice(0, 2), ...KIT.np.q(x, 'nhan', 'learn').slice(0, x.hieu ? 1 : 2)],
  menu: [['bac', '▶ Luyện theo bậc (máy chọn, 6 điểm)', 'Mỗi điểm hỏi bậc thấp nhất chưa vững: nhận ra → gõ dạng đúng → chạm chỗ sai → sửa câu', ['nhan', 'dien', 'sua'], 6],
    ['tron', '🔀 Trộn điểm dễ nhầm (bậc 4 · Phân biệt)', 'Câu của 2–4 điểm hay nhầm trộn lẫn, không báo trước câu thuộc điểm nào', ['nhan'], 1],
    ['dung', '✍️ Dùng: viết lại câu giữ nghĩa (bậc 5, từ B1)', 'Dạng đề thật: viết lại câu với từ cho sẵn', [], 0], ['nhan', '🔎 Luyện nhận ra (5 điểm)', 'Trắc nghiệm, 2 câu mỗi điểm', ['nhan'], 5], ['dien', '✏️ Luyện điền dạng (6 điểm)', 'Tự gõ dạng đúng', ['dien'], 6], ['sua', '🛠 Luyện sửa lỗi (6 điểm)', 'Gõ lại câu sai cho đúng', ['sua'], 6]],
  ask: (x, m) => m === 'bac' ? npBac(x) : KIT.np.q(x, m, 'learn'),
  menuQs: m => m === 'tron' ? npTron() : m === 'dung' ? npDung() : null,
  exam: lv => kItems(KIT.np, lv).flatMap(x => shuf(['nhan', 'dien', 'sua']).slice(0, 2).flatMap(k => KIT.np.q(x, k, 'test'))) };

// v101 🧱 luyện theo bậc: chưa vững Nhận ra thì hỏi nhận ra; rồi điền dạng / sửa câu (lần đầu sửa câu: chạm chỗ sai trước)
function npBac(x) { const P = KIT.np, c = kSt('np').cards[x.id], now = Date.now();
  if (!vSure(c, 'nhan')) return P.q(x, 'nhan', 'learn');
  const need = ['dien', 'sua'].filter(k => !heldDim(c, k, now)), k = need.length ? one(need) : one(['nhan', 'dien', 'sua']);
  return k === 'sua' && !(c && c.tp) ? [...P.q(x, 'tap', 'learn'), ...P.q(x, 'sua', 'learn')] : P.q(x, k, 'learn'); }
// bậc 4 · Phân biệt: nhóm điểm dễ nhầm đã học đủ, nhóm lâu chưa trộn trước; mỗi điểm 2 câu nhận ra + 1 câu điền, trộn lẫn
function npTron() { const P = KIT.np, st = kSt('np').cards, T = (S.npTron = S.npTron || {});
  const G = ((P.raw && P.raw.nhom) || []).filter(n => n.ids.every(id => st[id] && P.by[id])).sort((a, b) => (T[a.id] || 0) - (T[b.id] || 0));
  if (!G.length) { toast('Học đủ các điểm của một nhóm dễ nhầm trước (ví dụ quá khứ đơn và hiện tại hoàn thành).'); return false; }
  const g = G[0]; T[g.id] = Date.now();
  return { title: '🔀 ' + g.t, qs: shuf(g.ids.map(id => P.by[id]).flatMap(x => [...P.q(x, 'nhan', 'learn').slice(0, 2), ...P.q(x, 'dien', 'learn').slice(0, 1)])) }; }
// bậc 5 · Dùng: từ B1 mở dạng đề thật viết lại câu (uoe.js); chưa tới B1 thì báo
function npDung() { const lv = kLv(KIT.np); if (lvIdx(lv) < lvIdx('b1') || typeof uoeView !== 'function') { toast('Bậc Dùng (viết lại câu giữ nghĩa) mở từ B1. Trước đó: luyện theo bậc và trộn điểm dễ nhầm.'); return false; }
  scrollTo(0, 0); uoeView(lv); return false; }

// ---------- 📰 Đọc / 🎧 Nghe (cùng kiểu bài, khác kho bài và cách đưa bài) ----------
const K_CHEP = 0.8;
const kScript = x => x.lines ? x.lines.map(([sp, t]) => `<b>${sp === 'A' ? '👩' : '👨'}</b> ${esc(t)}`).join('<br>') : esc(x.text);
// v101 núm Nghe theo cấp khi luyện: số lần nghe (Pre-A1, A1 3 · A2, B1 2 như Cambridge · B2+ 1 như IELTS), tốc độ chậm 0,85 ở Pre-A1, A1. Thi luôn 2 lần, tốc độ thường.
const K_PLAYN = { pre: 3, a1: 3, a2: 2, b1: 2, b2: 1, c1: 1, c2: 1 }, K_SLOW = new Set(['pre', 'a1']);
function kRead(P, x, k, listen) {
  const head = listen ? `<p class="mute">🎧 ${x.lines ? 'Hội thoại' : 'Bài nghe'} (chưa hiện chữ): nghe rồi trả lời. Số lần còn nghe ghi ở nút 🔊.</p>`
    : `<div class="box"><b>${esc(x.title)}</b><p class="tdtap" style="font-size:18px;line-height:1.6;margin:8px 0 0;white-space:pre-line">${esc(x.text)}</p></div>`;
  const after = listen ? `<details><summary>Xem bài nghe</summary><p class="tdtap" style="white-space:pre-line">${kScript(x)}</p>${x.vi ? `<p class="mute">${esc(x.vi)}</p>` : ''}</details>` : '';
  const say = null, play = listen ? { key: x.id, lines: x.lines, text: x.text, max: K_PLAYN[x.lv] } : null, rate = listen && K_SLOW.has(x.lv) ? 0.85 : 0;
  if (k === 'y') return [{ x, k, kind: 'mc', head, q: 'Bài này chủ yếu nói về gì?', opts: kOpts(x.tvi, kOther(P, x, y => y.tvi, 2)), a: x.tvi, say, play, after, rate }];
  if (k === 'ct') return x.qs.filter(q => !/mainly|main idea|best title|mostly about/i.test(q.q)).map(q => ({ x, k, kind: 'mc', head, q: esc(q.q), opts: kOpts(q.a, q.w), a: q.a, why: q.why, say, play, after, rate }));
  // ✍️ chép lại: một câu 5–12 từ của bài
  const ss = kSents(x.text).filter(s => { const n = kWords(s).length; return n >= 5 && n <= 12; }), s = ss[Math.floor(Math.random() * ss.length)] || kSents(x.text)[0];
  return [{ x, k, kind: 'type', rate, head: '<p class="mute">Nghe một câu trong bài rồi chép lại.</p>', q: '✍️ Chép lại câu vừa nghe', play: { key: x.id + '|' + s, text: s, max: Math.max(2, K_PLAYN[x.lv]) },
    check: t => { const r = kMatch(s, t); return { ok: r >= K_CHEP, html: `Câu đúng: <b>${esc(s)}</b> · khớp ${Math.round(r * 100)}% từ (cần ${K_CHEP * 100}%).` }; } }];
}
const kReadLesson = (x, listen) => `<h1>${esc(listen ? x.tvi : x.title)}</h1>
  ${listen ? `<p class="mute">Nghe cả bài (chưa nhìn chữ). Nghe 2–3 lần rồi mới mở bài. Khi luyện / thi chỉ được nghe ${K_PLAYS} lần.</p><button class="pri" data-kdlg="nghe|${x.id}">🔊 Nghe cả bài</button>` : ''}
  ${listen ? '' : kCoverTxt(x.text)}<details ${listen ? '' : 'open'}><summary>${listen ? 'Mở chữ bài nghe' : 'Bài đọc'}</summary><div class="box"><p class="tdtap" style="font-size:18px;line-height:1.6;margin:0;white-space:pre-line">${listen ? kScript(x) : esc(x.text)}</p></div></details>
  ${x.vi ? `<button class="link" data-kl="vi">Hiện / ẩn bản dịch</button><div id="kvi" hidden class="box"><p class="mute" style="margin:0;white-space:pre-line">${esc(x.vi)}</p></div>` : ''}`;
KIT.doc = { id: 'doc', ic: '📰', t: 'Đọc', file: 'doc.json?v=4', lvs: ['pre', 'a1', 'a2', 'b1', 'b2', 'c1', 'c2'], unit: 'bài đọc', pass: 0.75,
  intro: 'Bài kiểu Cambridge: Pre-A1 bài ngắn 40–50 từ như Starters (chỉ dùng từ Pre-A1); A1 tin nhắn, thông báo, câu chuyện; A2 có bài dài 150–250 từ như A2 Key; B1 → C2 bài báo, thư, bình luận 180–290 từ như B1 Preliminary → C2 Proficiency, có câu hỏi ý kiến, suy luận.',
  dims: [['y', '💡 Ý chính', 'Bài nói về gì'], ['ct', '🔍 Chi tiết', 'Tìm thông tin trong bài']],
  examTxt: '6 bài đọc chưa gặp: ý chính + chi tiết.',
  how: '1 Hiểu câu (Pre-A1, A1) → 2 Dò chi tiết, có giờ → 3 Đọc lướt tìm ý → 4 Đoán nghĩa từ, suy luận (từ A2) → 5 Cấu trúc bài (từ B1: 🎓 Luyện thi → dạng đề thật). 💡 Ý chính và 🔍 chi tiết chỉ tính trên 🆕 bài mới (chưa gặp hoặc ≥ 30 ngày). Đọc rộng: 📚 Thư viện, chọn truyện bạn biết ≥ 95% từ.',
  fresh: ['y', 'ct'], newQs: x => [...kRead(KIT.doc, x, 'y'), ...kRead(KIT.doc, x, 'ct')].map((q, i) => i ? q : { ...q, head: kCoverTxt(x.text) + q.head }),
  name: x => x.title, lesson: x => kReadLesson(x, false),
  q: (x, k) => kRead(KIT.doc, x, k, false), tryQs: x => [...kRead(KIT.doc, x, 'y'), ...kRead(KIT.doc, x, 'ct')],
  menu: [['moi', '🆕 Bài mới (tính 🔁 Nhớ)', 'Bài chưa làm, hoặc làm đã ≥ 30 ngày: đọc, trả lời, rồi xem lại câu sai', ['y', 'ct'], 0],
    ['cau', '🔤 Hiểu câu (bậc 1)', 'Đọc một câu, chọn nghĩa đúng · luyện, không tính', [], 0], ['do', '⏱ Dò nhanh có giờ (bậc 2)', 'Tìm chi tiết trong bài đã làm, mỗi câu có giờ · luyện', [], 0],
    ['doan', '📖 Đoán nghĩa từ trong bài (bậc 4, từ A2)', 'Từ bạn chưa học trong bài đã làm: đoán nghĩa theo câu · luyện', [], 0],
    ['y', '💡 Ôn ý chính bài đã làm (4 bài)', 'Bài gặp chưa đủ 30 ngày thì không tính', ['y'], 4], ['ct', '🔍 Ôn chi tiết bài đã làm (2 bài)', 'Bài gặp chưa đủ 30 ngày thì không tính', ['ct'], 2]],
  menuQs: m => m === 'moi' ? kMoi(KIT.doc) : m === 'cau' ? docCau() : m === 'do' ? docDo() : m === 'doan' ? docDoan() : null,
  ask: (x, m) => kRead(KIT.doc, x, m, false),
  // v100: bài thi ít dùng nhất trước; B1+ (bài dài 6 câu) lấy tới đủ 15 câu, cấp dưới 6 bài như cũ
  exam: lv => kTake(kExamPick(KIT.doc, KIT.doc.items.filter(x => x.lv === lv && x.test)), x => [...kRead(KIT.doc, x, 'y', false), ...kRead(KIT.doc, x, 'ct', false)], lvIdx(lv) >= lvIdx('b1') ? 15 : 999, 6) };
KIT.nghe = { id: 'nghe', ic: '🎧', t: 'Nghe', file: 'nghe.json?v=4', lvs: ['pre', 'a1', 'a2', 'b1', 'b2', 'c1', 'c2'], unit: 'bài nghe', pass: 0.75,
  intro: 'Bài kể và hội thoại 2 giọng (số, giờ, giá, đánh vần như đề Cambridge); Pre-A1 câu ngắn kiểu Starters; B1 → C2 phỏng vấn, bài giảng, tranh luận. Khi luyện / thi mỗi bài nghe tối đa 2 lần.',
  dims: [['y', '💡 Ý chính', 'Bài nói về gì'], ['ct', '🔍 Chi tiết', 'Nghe ra thông tin'], ['chep', '✍️ Chép lại', 'Nghe một câu, chép đúng ≥ 80% từ']],
  examTxt: '6 bài nghe chưa gặp: ý chính + chi tiết + chép 1 câu.',
  how: '1 Tách âm, từ (🔤 nghe câu, chọn đúng từ: số, can / can\'t, đuôi -s / -ed) → 2 Chi tiết → 3 Ý chính → 4 Suy luận (từ B1) → 5 Nghe dài (từ B2). Bài mới nghe 3 lượt: ý chính → chi tiết → xem lời, nghe lại câu sai. Pre-A1, A1 nghe chậm, 3 lần; A2, B1 2 lần; B2+ 1 lần. 💡 / 🔍 chỉ tính trên 🆕 bài mới (chưa gặp hoặc ≥ 30 ngày); ✍️ chép lại tính cả bài cũ.',
  fresh: ['y', 'ct'],
  // bài mới nghe 3 lượt: lượt 1 ý chính (chưa xem lời), lượt 2 chi tiết (phát lại), lượt 3 xem lời + nghe lại câu sai (kNew). B2+ nghe 1 lần cho cả hai lượt.
  newQs: x => { const one = lvIdx(x.lv) >= lvIdx('b2'), y = kRead(KIT.nghe, x, 'y', true).map(q => ({ ...q, after: '', play: { ...q.play, max: K_SLOW.has(x.lv) ? 2 : 1 },
      head: `<p class="mute">🎧 Lượt 1: nghe cả bài (chưa xem lời), nắm ý chính.${one ? ' Từ B2 nghe 1 lần như IELTS: nhớ luôn chi tiết.' : ''}</p>` }));
    const c = kRead(KIT.nghe, x, 'ct', true).map((q, i) => ({ ...q, play: one ? { ...q.play, max: 1 } : { ...q.play, key: x.id + '|2', max: 1 }, head: i ? q.head : '<p class="mute">🎧 Lượt 2: nghe lại, lấy chi tiết.</p>' }));
    return [...y, ...c, ...kRead(KIT.nghe, x, 'chep', true)]; },
  name: x => x.tvi, lesson: x => kReadLesson(x, true),
  tryQs: x => [...kRead(KIT.nghe, x, 'y', true), ...kRead(KIT.nghe, x, 'ct', true).slice(0, 1), ...kRead(KIT.nghe, x, 'chep', true)],
  menu: [['moi', '🆕 Bài mới (tính 🔁 Nhớ)', 'Nghe 3 lượt: ý chính → chi tiết → xem lời, nghe lại câu sai', ['y', 'ct'], 0], ['tach', '🔤 Tách âm, từ (bậc 1)', 'Nghe một câu, chọn đúng từ nghe được · luyện, không tính', [], 0],
    ['chep', '✍️ Luyện chép lại (5 bài)', 'Nghe một câu, chép lại', ['chep'], 5], ['y', '💡 Ôn ý chính bài đã nghe (4 bài)', 'Bài gặp chưa đủ 30 ngày thì không tính', ['y'], 4], ['ct', '🔍 Ôn chi tiết bài đã nghe (2 bài)', 'Bài gặp chưa đủ 30 ngày thì không tính', ['ct'], 2]],
  menuQs: m => m === 'moi' ? kMoi(KIT.nghe) : m === 'tach' ? ngTach() : null,
  ask: (x, m) => kRead(KIT.nghe, x, m, true),
  exam: lv => kTake(kExamPick(KIT.nghe, KIT.nghe.items.filter(x => x.lv === lv && x.test)), x => ['y', 'ct', 'chep'].flatMap(k => kRead(KIT.nghe, x, k, true)), lvIdx(lv) >= lvIdx('b1') ? 15 : 999, 6) };

// ---------- v101 bậc luyện thêm của Đọc / Nghe (luyện, không tính 🔁 Nhớ: kGrade chỉ chấm mặt có trong P.dims) ----------
function kMoi(P) { const x = kNextNew(P); if (!x) { toast(`Chưa có bài mới: học hết bài của cấp; bài đã làm thành bài mới sau ${K_FRESH_D} ngày.`); return false; } kNew(P, x, () => kMenu(P)); return false; }
// 📊 độ phủ từ: phần trăm từ của bài bạn đã học trong app (từ chức năng như the, is coi như đã biết; tên riêng bỏ qua). Đọc thoải mái cần khoảng 95% (Hu & Nation).
function kCover(text) { let n = 0, k = 0; for (const t of String(text).match(/[A-Za-z][A-Za-z'’]*/g) || []) { const l = t.toLowerCase(), w = libFind(t);
    if (!w && /^[A-Z]/.test(t)) continue; n++; if (K_STOP.includes(l) || (w && S.cards[w.id])) k++; } return n ? Math.round(k / n * 100) : 100; }
const kCoverTxt = t => { const p = kCover(t); return `<p class="mute" style="margin:4px 0">📊 Bạn đã học ${p}% từ của bài${p >= 95 ? ' · vừa sức đọc thoải mái' : p >= 85 ? ' · đọc được, sẽ gặp vài từ lạ (chạm để tra)' : ' · nhiều từ lạ: học thêm từ vựng trước sẽ dễ hơn'}.</p>`; };
const kLearned = P => P.items.filter(x => !x.test && kSt(P.id).cards[x.id]);
// 📰 bậc 1 · hiểu câu: câu ví dụ của từ đã học → chọn nghĩa đúng
function docCau() { const L = WORDS.filter(w => S.cards[w.id] && w.ex && w.exVi), P = L.length >= 6 ? L : levelWords(curLevel()).filter(w => w.ex && w.exVi);
  const qs = shuf(P).slice(0, 6).map(w => ({ x: { id: 'cau:' + w.id }, k: 'cau', kind: 'mc', head: '<p class="mute">🔤 Bậc 1 · Hiểu câu: đọc câu, chọn nghĩa đúng.</p>', q: `${kSay(w.ex)} <b>${esc(w.ex)}</b>`,
    opts: kOpts(w.exVi, shuf(P.filter(z => z !== w && z.exVi !== w.exVi)).slice(0, 2).map(z => z.exVi)), a: w.exVi }));
  return qs.length ? { title: '🔤 Hiểu câu', qs } : (toast('Chưa có câu để luyện.'), false); }
// 📰 bậc 2 · dò chi tiết có giờ: bài đã làm, mỗi câu 15–60 giây theo độ dài bài
function docDo() { const L = shuf(kLearned(KIT.doc)).slice(0, 2); if (!L.length) { toast('Làm 🆕 bài mới trước.'); return false; }
  return { title: '⏱ Dò nhanh có giờ', qs: L.flatMap(x => kRead(KIT.doc, x, 'ct', false).map(q => ({ ...q, k: 'do', secs: Math.min(60, Math.max(15, Math.round(kWords(x.text).length / 6))) }))) }; }
// 📰 bậc 4 · đoán nghĩa từ trong ngữ cảnh (từ A2): từ trong bài đã làm mà bạn chưa học → chọn nghĩa theo câu
function docDoan() { if (lvIdx(kLv(KIT.doc)) < lvIdx('a2')) { toast('Đoán nghĩa từ trong bài mở từ A2. Trước đó: hiểu câu, dò chi tiết.'); return false; }
  const qs = [], seen = new Set();
  for (const x of shuf(kLearned(KIT.doc))) for (const s of kSents(x.text)) for (const t of s.match(/[A-Za-z][A-Za-z'’]*/g) || []) { const w = libFind(t);
    if (qs.length >= 5 || !w || !w.vi || S.cards[w.id] || seen.has(w.id) || t.length < 4 || K_STOP.includes(t.toLowerCase()) || !WBY[w.id]) continue; seen.add(w.id);
    const o = shuf(WORDS.filter(z => z.pos === w.pos && z.vi && z.vi !== w.vi)).slice(0, 2).map(z => z.vi); if (o.length < 2) continue;
    qs.push({ x: { id: 'doan:' + w.id }, k: 'doan', kind: 'mc', head: `<p class="mute">📖 Bậc 4 · đoán nghĩa từ in đậm theo câu (bài: ${esc(x.title)}).</p>`, q: (m => m ? esc(s.slice(0, m.index)) + '<b>' + esc(m[0]) + '</b>' + esc(s.slice(m.index + m[0].length)) : esc(s))(s.match(new RegExp(`\\b${t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`))),
      opts: kOpts(w.vi, o), a: w.vi, why: `${w.w} = ${w.vi}` }); }
  return qs.length ? { title: '📖 Đoán nghĩa từ trong bài', qs } : (toast('Bài đã làm không còn từ lạ để đoán: làm thêm 🆕 bài mới.'), false); }
// 🎧 bậc 1 · tách âm, từ: nghe một câu, chọn đúng từ ở chỗ trống giữa các từ nghe gần giống (số -teen / -ty, can / can't, đuôi -s / -ed, cặp âm của 👄 Phát âm)
const NG_PAIRS = [['can', "can't"], ['thirteen', 'thirty'], ['fourteen', 'forty'], ['fifteen', 'fifty'], ['sixteen', 'sixty'], ['seventeen', 'seventy'], ['eighteen', 'eighty'], ['nineteen', 'ninety'],
  ['he', 'she'], ['this', 'these'], ['that', 'those'], ['is', 'was'], ['are', 'were'], ['live', 'leave'], ['want', 'went'], ['walk', 'work'], ['three', 'free'], ['think', 'sink'], ['won', 'want'], ['law', 'low']];
function ngVar(t) { const l = t.toLowerCase(), out = new Set();
  for (const p of NG_PAIRS) if (p.includes(l)) p.forEach(z => z !== l && out.add(z));
  if (/^1[3-9]$/.test(l)) out.add(String((+l - 10) * 10)); if (/^[2-9]0$/.test(l)) out.add(String(+l / 10 + 10));
  if (typeof PA !== 'undefined' && PA) for (const s of PA) for (const p of s.pairs) { if (p[0] === l) out.add(p[2]); if (p[2] === l) out.add(p[0]); }
  const w = libFind(l); if (w && /verb|noun/.test(w.pos || '') && !w.irr) { const b = w.w.toLowerCase(), es = /(s|sh|ch|x|z)$/.test(b) ? 'es' : 's';
    if (l !== b) out.add(b); if (l !== b + es) out.add(b + es); if (/verb/.test(w.pos) && l !== b + 'ed' && !/e$/.test(b)) out.add(b + 'ed'); }
  out.delete(l); return [...out].slice(0, 2); }
function ngTach() { const P = KIT.nghe, L = kLearned(P), X = L.length ? L : kItems(P, kLv(P)), qs = [];
  for (const x of shuf(X)) { if (qs.length >= 6) break; const ss = shuf((x.lines ? x.lines.map(l => l[1]) : kSents(x.text)).filter(s => { const n = kWords(s).length; return n >= 4 && n <= 14; }));
    for (const s of ss) { const ts = (s.match(/[A-Za-z0-9][A-Za-z'’0-9]*/g) || []).map(t => [t, ngVar(t)]).filter(([, v]) => v.length), pick = ts.find(([t]) => NG_PAIRS.some(p => p.includes(t.toLowerCase())) || /^\d+$/.test(t)) || ts[0];
      if (!pick) continue; const [t, v] = pick, qq = s.replace(new RegExp(`(^|[^A-Za-z0-9'’])${t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?=$|[^A-Za-z0-9'’])`), '$1____'); if (qq === s) continue;
      qs.push({ x: { id: 'tach:' + x.id }, k: 'tach', kind: 'mc', rate: K_SLOW.has(x.lv) ? 0.85 : 0, head: '<p class="mute">🔤 Bậc 1 · Tách âm, từ: nghe câu, chọn đúng từ ở chỗ trống.</p>',
        q: esc(qq), opts: kOpts(t, v), a: t, play: { key: 'tach|' + qs.length, text: s, max: 3 }, after: `<p class="mute">Câu: ${esc(s)}</p>` }); break; } }
  return qs.length ? { title: '🔤 Tách âm, từ', qs } : (toast('Chưa có câu để luyện tách âm.'), false); }

// ---------- 🗣 Nói ----------
const K_MINW = { a1: 15, a2: 25, b1: 50, b2: 80, c1: 110, c2: 130 }, K_SECS = { a1: '30 giây', a2: '30 giây', b1: '1 phút', b2: '1–2 phút', c1: '2 phút', c2: '2 phút' };
function kTalk(x) { const ideas = x.k || [];
  return { x, k: 'viec', kind: 'speak', head: `<div class="box"><b>${esc(x.en)}</b> <span class="mute">· ${esc(x.vi)}</span><p style="margin:6px 0">${esc(x.p)}</p><p class="mute" style="margin:0">${esc(x.pv)}</p>
      <p class="mute" style="margin:6px 0 0">Cần nói đủ: ${x.c.map(esc).join(' · ')}. Ít nhất ${K_MINW[x.lv]} từ.</p></div>`, q: `🎤 Nói khoảng ${K_SECS[x.lv]} rồi bấm Dừng.`,
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
KIT.noi = { id: 'noi', ic: '🗣', t: 'Nói', file: 'noi.json?v=3', lvs: ['a1', 'a2', 'b1', 'b2', 'c1', 'c2'], unit: 'đề nói và tình huống', pass: 0.7, ref: true, needAsr: true,
  intro: 'Đề nói về bản thân và đóng vai giao tiếp (gọi món, mua bán, taxi, hỏi đường…); B1 → C2 kể chuyện, nêu và bảo vệ ý kiến, họp, thương lượng, phỏng vấn. Máy chép lời, tìm ý bằng từ khoá; không chấm ngữ pháp, phát âm (phần khác).',
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
  menu: [['viec', '✅ Luyện nói đủ ý (1 đề)', 'Nói theo đề (30 giây – 2 phút tuỳ cấp)', ['viec'], 1], ['ro', '🗣 Luyện nói rõ (4 câu)', 'Đọc to câu trong bài mẫu', ['ro'], 4],
    ['gt', '💬 Luyện đóng vai (1 tình huống)', 'Nói phần của bạn trong hội thoại', ['gt'], 1]],
  ask: (x, m) => m === 'gt' ? kRp(x, x.learn[Math.floor(Math.random() * x.learn.length)]) : m === 'viec' ? [kTalk(x)] : [kAloud(x, kModelSent(x))],
  // v100: đề nói dành cho thi (test) trước, ít dùng nhất trước; thiếu thì lấy đề đã luyện
  exam: lv => { const P = KIT.noi, T = P.items.filter(x => x.lv === lv && x.test && x.type !== 'rp'), L = [...kExamPick(P, T), ...shuf(kItems(P, lv).filter(x => x.type !== 'rp'))], R = shuf(kItems(P, lv).filter(x => x.type === 'rp')).slice(0, 2), ss = shuf(P.raw.test[lv]).slice(0, 4);
    // v100: B1+ đề nói dài 1–2 phút: 2 đề mỗi lần thi (6 đề thi mỗi cấp → 3 lần thi không lặp); cấp dưới 4 đề như cũ
    return [...L.slice(0, lvIdx(lv) >= lvIdx('b1') ? 2 : 4).map(kTalk), ...ss.map((s, i) => kAloud(L[i % L.length], s)), ...R.flatMap(x => kRp(x, x.tests[Math.floor(Math.random() * x.tests.length)]))]; } };

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
        <details><summary>Bài mẫu</summary><p class="tdtap" style="white-space:pre-line">${esc(kModel(x))}</p></details>` }; } }; }
KIT.viet = { id: 'viet', ic: '✍️', t: 'Viết', file: 'viet.json?v=3', lvs: ['a1', 'a2', 'b1', 'b2', 'c1', 'c2'], unit: 'đề viết', pass: 0.7, ref: true,
  intro: 'A1, A2 tin nhắn, email ngắn; B1 → C2 email, truyện, bài luận, báo cáo, đề xuất, thư trang trọng theo độ dài đề Cambridge. Máy tìm ý bằng từ khoá và xem dạng bài (độ dài, lời chào / kết). Không chấm ngữ pháp, chính tả: đó là phần khác.',
  dims: [['y', '✅ Đủ ý', 'Viết đủ các ý đề yêu cầu'], ['dang', '📝 Đúng dạng bài', 'Độ dài, chào / kết khi là thư']],
  examTxt: '2 đề viết (viết mới), chấm ý và dạng bài.',
  name: x => x.vi,
  lesson: x => `<h1>${esc(x.vi)}</h1><p class="mute">${esc(x.en)} · ${esc(x.genre)} · ${x.min}–${x.max} từ</p>
    <div class="box"><b>Đề</b><p style="margin:6px 0">${esc(x.p)}</p><p class="mute" style="margin:0">${esc(x.pv)}</p></div>
    <div class="box"><b>Cần viết đủ</b>${x.c.map(c => `<p style="margin:4px 0">• ${esc(c)}</p>`).join('')}</div>
    <div class="box"><b>Cụm hữu ích</b>${x.u.map(([e, v]) => `<p style="margin:4px 0">${esc(e)} <span class="mute">· ${esc(v)}</span></p>`).join('')}</div>
    <div class="box"><b>Bài mẫu</b><p class="tdtap" style="margin:6px 0;white-space:pre-line">${esc(kModel(x))}</p></div>`,
  tryQs: x => [kWrite(x)],
  menu: [['y', '✍️ Viết 1 đề', 'Chấm cả ✅ Đủ ý và 📝 Đúng dạng bài', ['y', 'dang'], 1]],
  ask: x => [kWrite(x)],
  exam: lv => { const T = KIT.viet.items.filter(x => x.lv === lv && x.test); return [...kExamPick(KIT.viet, T), ...shuf(kItems(KIT.viet, lv))].slice(0, 2).map(kWrite); } };

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
  viec: { what: 'Nói theo đề (30 giây – 2 phút tuỳ cấp), đủ các ý đề yêu cầu. Máy chép lời rồi tìm ý bằng từ khoá.', learn: 'ô Cần nói đủ, Cụm hữu ích và Bài mẫu', ex: 'Giới thiệu bản thân → nói tên, tuổi, quê, việc làm, sở thích' },
  ro: { what: 'Đọc to một câu, máy chép ra đúng ≥ 80% số từ.', learn: 'Bài mẫu: bấm 🔊 nghe rồi đọc theo', ex: '"I\'m from Da Nang, but now I live in Hanoi." → đọc to' },
  gt: { what: 'Đóng vai: mỗi lượt nói đúng việc (gọi món, hỏi giá, nói nơi đến…); đạt khi ≥ 80% lượt đúng.', learn: 'Hội thoại mẫu: nghe từng câu, đọc phần "Việc của bạn"', ex: '👤 What can I get for you? → 🙋 Can I have two teas, please?' } };
KIT.viet.info = {
  y: { what: 'Viết đủ các ý đề yêu cầu. Máy tìm ý bằng từ khoá.', learn: 'ô Cần viết đủ, Cụm hữu ích và Bài mẫu', ex: 'Thiệp mời sinh nhật → lời mời, ngày giờ, địa điểm, một chi tiết thêm' },
  dang: { what: 'Đúng dạng bài: đủ độ dài; thư, tin nhắn, thiệp có lời chào và lời kết.', learn: 'ô 📝 Dạng bài', ex: 'Hi Mai, … See you soon! Lan (25–50 từ)' } };
{ const base = KIT.viet.lesson; KIT.viet.lesson = x => base(x) + `<div class="box"><b>📝 Dạng bài</b><p style="margin:6px 0">Độ dài ${x.min}–${x.max} từ, ít nhất 2–3 câu.</p>
  ${K_LETTER.test(x.genre) ? `<p style="margin:6px 0">Đây là ${esc(x.genre)}: mở đầu bằng lời chào (<i>Hi …, / Dear …,</i>), kết bằng lời chào cuối (<i>See you! / Best wishes,</i>) và tên.</p>` : '<p style="margin:6px 0">Viết thành đoạn liền mạch, kể theo thứ tự (first, then, after that…).</p>'}</div>`; }
