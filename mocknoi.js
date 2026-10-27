// 🗣 Bài Nói của 🎓 Đề thử (27/10/2026, người sáng lập: "bạn tự sáng tạo cách để làm được").
// Đề thật: giám khảo chấm 4 tiêu chí. Máy không nghe ra lỗi ngữ pháp trong lời nói tự do (bộ chép lời tự "sửa" câu), nên đo GIÁN TIẾP bằng việc máy làm được:
//   ① Ngữ pháp & từ vựng: 🔁 nhắc lại câu (Elicited Imitation: nghe câu dài dần, nói lại không nhìn chữ; chỉ nhắc đúng được câu dài khi nắm được ngữ pháp của nó;
//      nghiên cứu cho thấy tương quan cao với năng lực nói) + dùng đúng cấu trúc đề đòi (if … would, have + V3…) + số từ đúng cấp trở lên trong lời nói.
//   ② Mạch lạc: độ dài câu trả lời so với yêu cầu + số từ nối khác nhau + tốc độ nói (từ / phút) + đủ ý bài nói dài.
//   ③ Phát âm (dễ hiểu): máy chép đúng bao nhiêu % từ khi nhắc lại câu; câu trả lời tự do máy có nghe ra không.
//   ④ Tương tác: đóng vai làm đúng việc từng lượt + bắt đầu nói trong ≤ 4 giây.
// Chưa đối chiếu với giám khảo thật: nên có 1 buổi nói thử với giáo viên mỗi cấp để hiệu chỉnh ngưỡng.
const SPK_RE = { past: /\b(was|were|went|did|had|saw|made|got|took|came|\w+ed)\b/, future: /\b(will|won't|going to|'ll|plan to|hope to)\b/, reason: /\b(because|since|so that|that's why|as a result)\b/,
  opinion: /\b(i think|i believe|in my opinion|personally|i feel|i'd say)\b/, compare: /\b(more|less|better|worse|\w+er than|the most|the best)\b/, perfect: /\b(have|has|'ve|'s) (been|\w+ed|\w+en|done|gone|seen|had|made)\b/,
  cond2: /\bif\b[^.?!]*\b(would|'d|could)\b|\b(would|'d|could)\b[^.?!]*\bif\b/, cond3: /\b(would|could|might|should)( not|n't)? have\b/, contrast: /\b(although|however|even though|on the other hand|whereas|while|but)\b/,
  spec: /\b(might|may|could|must|can't)\s+(be|have)\b/, passive: /\b(is|are|was|were|be|been|being)\s+\w+(ed|en|wn|lt|ght)\b/ };
const SPK_REVI = { past: 'quá khứ', future: 'tương lai', reason: 'lý do (because…)', opinion: 'nêu ý kiến', compare: 'so sánh', perfect: 'hiện tại hoàn thành', cond2: 'if … would', cond3: 'would / should have + V3',
  contrast: 'ý đối lập (although, however…)', spec: 'suy đoán (might be, must have…)', passive: 'bị động' };
// câu hỏi phỏng vấn (phần 1) và thảo luận (phần 4) theo kỳ thi: [câu hỏi, nghĩa, cấu trúc cần, số từ tối thiểu]
const SPK_Q = {
  a1: { p1: [['What do you do at the weekend?', 'Cuối tuần bạn làm gì?', [], 8], ['Tell me about your family.', 'Kể về gia đình bạn.', [], 10], ['What did you do yesterday?', 'Hôm qua bạn làm gì?', ['past'], 8], ['What is your favourite food? Why?', 'Món bạn thích nhất? Vì sao?', ['reason'], 8]],
    p4: [['Do you like living in a city or in the countryside? Why?', 'Bạn thích sống ở thành phố hay nông thôn? Vì sao?', ['reason'], 10], ['What will you do next summer?', 'Hè tới bạn sẽ làm gì?', ['future'], 8]] },
  a2: { p1: [['Where do you live, and what do you like about it?', 'Bạn sống ở đâu, thích gì ở đó?', [], 15], ['What did you do last weekend?', 'Cuối tuần trước bạn làm gì?', ['past'], 15], ['What are you going to do next weekend?', 'Cuối tuần tới bạn định làm gì?', ['future'], 12], ['Tell me about your best friend.', 'Kể về bạn thân của bạn.', [], 15]],
    p4: [['Which is better: shopping online or in a shop? Why?', 'Mua online hay ở cửa hàng tốt hơn? Vì sao?', ['compare', 'reason'], 20], ['Do you prefer holidays by the sea or in the mountains? Why?', 'Bạn thích nghỉ ở biển hay núi? Vì sao?', ['reason'], 20], ['Have you ever been to another country?', 'Bạn từng đi nước ngoài chưa?', ['perfect'], 12]] },
  b1: { p1: [['How long have you lived in your town?', 'Bạn sống ở thị trấn / thành phố của mình bao lâu rồi?', ['perfect'], 20], ['Tell me about something interesting you did recently.', 'Kể một việc thú vị bạn làm gần đây.', ['past'], 25], ['What are your plans for the next few years?', 'Kế hoạch vài năm tới của bạn?', ['future'], 20], ['What do you usually do to relax?', 'Bạn thường làm gì để thư giãn?', [], 20]],
    p4: [['If you could live anywhere in the world, where would you live? Why?', 'Nếu được sống ở bất cứ đâu, bạn sống ở đâu? Vì sao?', ['cond2', 'reason'], 30], ['Do you think people spend too much time on their phones?', 'Bạn có nghĩ người ta dùng điện thoại quá nhiều?', ['opinion', 'reason'], 30], ['Is it better to work for a big company or a small one?', 'Làm cho công ty lớn hay nhỏ tốt hơn?', ['compare', 'opinion'], 30]] },
  b2: { p1: [['What has been the most important change in your life so far?', 'Thay đổi quan trọng nhất trong đời bạn tới giờ?', ['perfect'], 35], ['If you had more free time, what would you do with it?', 'Nếu có thêm thời gian rảnh, bạn sẽ làm gì?', ['cond2'], 30], ['Tell me about a skill you would like to learn.', 'Kể về một kỹ năng bạn muốn học.', ['reason'], 30]],
    p4: [['Some people say that technology makes us less sociable. What do you think?', 'Có người nói công nghệ làm ta kém hoà đồng. Bạn nghĩ sao?', ['opinion', 'contrast'], 45], ['Is there anything you regret not doing when you were younger?', 'Có điều gì bạn tiếc vì đã không làm khi còn trẻ?', ['cond3'], 35], ['Should governments make public transport free?', 'Nhà nước có nên miễn phí giao thông công cộng?', ['opinion', 'reason', 'contrast'], 45]] },
  c1: { p1: [['How do you think your town will have changed in ten years?', 'Bạn nghĩ 10 năm nữa thị trấn của bạn sẽ thay đổi ra sao?', ['future', 'spec'], 40], ['What would you say is the most valuable thing you have learned from your job or studies?', 'Điều quý nhất bạn học được từ việc làm / việc học?', ['perfect'], 40], ["If you hadn't chosen your current path, what might you be doing now?", 'Nếu không chọn con đường hiện tại, giờ bạn có thể đang làm gì?', ['cond3', 'spec'], 35]],
    p4: [['To what extent should individuals be responsible for protecting the environment, rather than governments?', 'Cá nhân chịu trách nhiệm bảo vệ môi trường tới đâu, so với nhà nước?', ['opinion', 'contrast', 'reason'], 60], ['Why do you think some traditions disappear while others survive?', 'Vì sao có truyền thống mất đi, có truyền thống còn lại?', ['spec', 'reason'], 55], ['How is success measured in your society, and is that fair?', 'Xã hội bạn đo thành công thế nào, như vậy có công bằng?', ['passive', 'opinion', 'contrast'], 55]] },
  c2: { p1: [['What aspects of your culture do you think are most often misunderstood by outsiders?', 'Điều gì trong văn hoá bạn hay bị người ngoài hiểu sai?', ['opinion', 'passive'], 50], ['Looking back, what decision has shaped your life most, and why?', 'Nhìn lại, quyết định nào định hình đời bạn nhất, vì sao?', ['perfect', 'reason'], 50], ['What might have happened if the internet had never been invented?', 'Chuyện gì có thể đã xảy ra nếu chưa từng có internet?', ['cond3', 'spec'], 45]],
    p4: [['Is it ever right to break a rule? Give examples.', 'Có khi nào phá luật là đúng? Cho ví dụ.', ['opinion', 'contrast', 'cond2'], 70], ['"The more connected we are, the lonelier we become." Discuss.', '“Càng kết nối càng cô đơn.” Bàn luận.', ['opinion', 'contrast', 'spec'], 70], ["Should we judge historical figures by today's moral standards?", 'Có nên đánh giá nhân vật lịch sử bằng chuẩn đạo đức ngày nay?', ['opinion', 'contrast', 'reason'], 70]] } };
const SPK_EX = { a1: 'a1', a2: 'a2', a2p: 'a2', b1: 'b1', b1p: 'b1', b2: 'b2', b2p: 'b2', c1: 'c1', c2: 'c2' };
// mục tiêu theo kỳ thi: [từ nối khác nhau, từ / phút, số từ khác nhau đúng cấp trở lên trong cả bài nói]
const SPK_T = { a1: [2, 55, 3], a2: [3, 65, 5], b1: [4, 80, 8], b2: [6, 95, 12], c1: [7, 105, 15], c2: [8, 115, 18] };
const SPK_LINK = ['and', 'but', 'because', 'so', 'then', 'also', 'although', 'however', 'for example', 'for instance', 'on the other hand', 'whereas', 'while', 'moreover', 'furthermore', 'in addition', 'as a result', 'therefore',
  'in my opinion', 'first', 'firstly', 'finally', 'after that', 'even though', 'despite', 'in spite of', 'nevertheless', 'that said', 'having said that', 'overall', 'in conclusion', 'on balance', 'apart from', 'unless', 'otherwise', 'instead'];
// sinh bài Nói: phỏng vấn 2 câu · nhắc lại 6 câu (ngắn → dài) · nói dài 1 đề · đóng vai 1 tình huống · thảo luận 2 câu
function mkSpeak() { const ex = SPK_EX[MK.lv], B = SPK_Q[ex], P = KIT.noi, ls = mkKitLvs(P); if (!B || !ls.length) return [];
  const pick = (a, n) => shuf(a).slice(0, n), out = [];
  for (const [q, vi, need, minW] of pick(B.p1, 2)) out.push({ part: 'Phần 1: phỏng vấn', q: { kind: 'say', mode: 'q', q, vi, need, minW } });
  const ss = ls.flatMap(l => P.raw.test[l] || []).filter(s => kWords(s).length >= 5), es = pick(ss, 6).sort((a, b) => kWords(a).length - kWords(b).length);
  for (const s of es) out.push({ part: 'Nhắc lại câu (nghe, nói lại, không nhìn chữ)', q: { kind: 'say', mode: 'eit', q: 'Nghe câu rồi nói lại đúng như vậy.', s, a: s } });
  const talk = pick(P.items.filter(x => ls.includes(x.lv) && x.type !== 'rp'), 1)[0];
  if (talk) out.push({ part: 'Phần 2: nói dài', q: { kind: 'say', mode: 'talk', x: talk, q: talk.p, vi: talk.pv, minW: K_MINW[talk.lv] } });
  const rp = pick(P.items.filter(x => ls.includes(x.lv) && x.type === 'rp'), 1)[0];
  if (rp) { const v = (rp.tests || rp.learn)[0]; let prev = ''; for (const st of v) { if (st.s) { prev = st.t; continue; } out.push({ part: 'Phần 3: đóng vai, tương tác', q: { kind: 'say', mode: 'rp', x: rp, st, prev, q: st.vi, a: st.t } }); prev = ''; } }
  for (const [q, vi, need, minW] of pick(B.p4, 2)) out.push({ part: 'Phần 4: thảo luận', q: { kind: 'say', mode: 'q', q, vi, need, minW } });
  return out; }
// chạy bài Nói: mỗi câu bấm 🎤 nói, ⏹ dừng; ghi lời, lúc bắt đầu nói, thời lượng
function mkSpeakRun(pi, finish) { const P = MK.papers[pi]; let i = 0;
  const show = () => { if (i >= P.qs.length) return finish(); const { part, q } = P.qs[i]; window.CUR = { view: 'de-thu-noi', item: MK.lv + ':' + i, prompt: q.q };
    const head = q.mode === 'eit' ? '<p class="mute">Máy đọc một câu. Không có chữ. Nói lại y như vậy (được nghe tối đa 2 lần).</p><button class="chip" data-say>🔊 Nghe câu</button>'
      : q.mode === 'rp' ? `<div class="box"><b>${q.x.ic} ${esc(q.x.vi)}</b>${q.prev ? `<p style="margin:6px 0">👤 ${esc(q.prev)}</p>` : ''}<p style="margin:6px 0 0"><b>Bạn:</b> ${esc(q.st.vi)}</p></div>`
      : `<div class="box"><p style="margin:0;font-size:18px">${esc(q.q)}</p>${q.vi ? `<p class="mute" style="margin:4px 0 0">${esc(q.vi)}</p>` : ''}${q.mode === 'talk' ? `<p class="mute" style="margin:4px 0 0">Nói khoảng ${K_SECS[q.x.lv]}: ${q.x.c.map(esc).join(' · ')}.</p>` : ''}</div>`;
    $app.innerHTML = `<div class="row top"><button class="link" data-a="home">← Bỏ</button><span class="uname">${esc(P.t)} · ${i + 1}/${P.qs.length}</span><b id="mkt"></b></div>
      <p class="mute" style="margin:4px 0">${esc(part)}</p>${head}<button class="pri" data-rec>🎤 Bấm rồi nói</button><div class="box"><b>📝 Máy nghe ra:</b> <span id="kheard">…</span></div>`;
    let plays = 0, t0 = 0, tFirst = 0, done = false;
    const say = () => { if (plays >= 2) return; plays++; speak(q.s); const b = $app.querySelector('[data-say]'); if (b) { b.textContent = `🔊 Nghe lại (còn ${2 - plays} lần)`; b.disabled = plays >= 2; } };
    if (q.mode === 'eit') say(); else if (q.mode === 'rp') { if (q.prev) speak(q.prev); } else speak(q.q);
    $app.onclick = e => { if (e.target.closest('[data-a="home"]')) { if (!confirm('Bỏ đề thử? Lần này không lưu.')) return; kAsrStop(); clearInterval(MK.tick); return mockView(MK.lv); }
      if (e.target.closest('[data-say]')) return say();
      const b = e.target.closest('[data-rec]'); if (!b || done) return;
      if (K_ASR.on) { done = true; b.disabled = true; b.textContent = '⏳ Đang lưu…'; const t1 = Date.now();
        return kAsrStop(txt => { P.res.push({ part, q, ans: txt, secs: (t1 - t0) / 1000, lat: tFirst ? (tFirst - t0) / 1000 : 99 }); i++; show(); }); }
      try { speechSynthesis.cancel(); } catch (er) {} t0 = Date.now(); b.textContent = '⏹ Dừng';
      kAsrStart(txt => { if (!tFirst && txt) tFirst = Date.now(); const h = document.getElementById('kheard'); if (h) h.textContent = txt || '…'; }); }; };
  show(); }
// chấm bài Nói: 4 tiêu chí 0–100%; bài Nói = trung bình 4 tiêu chí
function mkSpeakScore(res, lv) { const ex = SPK_EX[lv], [tL, tW, tV] = SPK_T[ex], avg = a => a.length ? a.reduce((s, x) => s + x, 0) / a.length : null, cap = x => Math.max(0, Math.min(1, x));
  WBY_W = WBY_W || Object.fromEntries(WORDS.map(w => [w.w.toLowerCase(), w]));
  const low = r => String(r.ans || '').toLowerCase(), free = res.filter(r => r.q.mode === 'q' || r.q.mode === 'talk'), eit = res.filter(r => r.q.mode === 'eit'), rp = res.filter(r => r.q.mode === 'rp'), all = res.map(low).join(' ');
  const eitM = eit.map(r => kMatch(r.q.s, r.ans || '')), eitOk = avg(eitM.map(m => m >= 0.8 ? 1 : m >= 0.5 ? 0.5 : 0));
  const struct = avg(res.filter(r => r.q.mode === 'q' && r.q.need.length).map(r => avg(r.q.need.map(k => SPK_RE[k].test(low(r)) ? 1 : 0))));
  const lo = Math.max(0, LEVELS.indexOf(MOCK[lv].lo) - 2), voc = new Set(kWords(all).filter(t => { if (t.length < 4) return false; const L = xLvOf(t); return L && LEVELS.indexOf(L) >= lo; }));
  const len = avg(free.map(r => cap(kWords(r.ans || '').length / (r.q.minW || 20)))), links = SPK_LINK.filter(l => new RegExp(`\\b${l}\\b`).test(all)).length;
  const fw = free.reduce((s, r) => s + kWords(r.ans || '').length, 0), fs = free.reduce((s, r) => s + Math.max(1, r.secs || 0), 0), wpm = fs ? fw / (fs / 60) : 0;
  const ideas = avg(free.filter(r => r.q.mode === 'talk').map(r => { const k = r.q.x.k || []; return k.length ? k.filter(g => kHit(r.ans || '', g)).length / k.length : 0; }));
  const heard = avg(free.map(r => kWords(r.ans || '').length >= (r.q.minW || 10) * 0.5 ? 1 : 0)), rpOk = avg(rp.map(r => kNeedOk(r.q.st.need, r.ans || '') ? 1 : 0)), quick = avg([...rp, ...free].map(r => r.lat <= 4 ? 1 : 0));
  const C = [['① Ngữ pháp & từ vựng', [eitOk, struct, cap(voc.size / tV)]], ['② Mạch lạc', [len, cap(links / tL), cap(wpm / tW), ideas]], ['③ Phát âm (dễ hiểu)', [avg(eitM), heard]], ['④ Tương tác', [rpOk, quick]]]
    .map(([n, xs]) => [n, Math.round((avg(xs.filter(x => x != null)) || 0) * 100)]);
  return { pct: Math.round(avg(C.map(c => c[1]))), C, d: { eit: Math.round((avg(eitM) || 0) * 100), struct: struct == null ? null : Math.round(struct * 100), voc: voc.size, tV, links, tL, wpm: Math.round(wpm), tW, rp: rpOk == null ? null : Math.round(rpOk * 100) } }; }
// gắn bài Nói vào khuôn đề (Starters không có: phần Nói của app bắt đầu từ A1)
for (const [lv, min] of [['a1', 7], ['a2', 10], ['b1', 12], ['b2', 14], ['c1', 15], ['c2', 16]]) MOCK[lv].papers.push({ t: '🗣 Nói', min, speak: true, parts: [['Nói', () => mkSpeak()]] });
