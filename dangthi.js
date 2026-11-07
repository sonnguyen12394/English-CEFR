// v129 🎓 Cambridge: các dạng đề thật còn thiếu (người sáng lập 3/11/2026 "mỗi mục tiêu rà soát xem đủ các dạng bài để học chưa; bài luyện chỉ đơn cử vài bài tượng trưng").
// Nội dung: nghe.json mục dt (content/bs/dangthi.json, mỗi dạng một bộ, Claude soạn, chưa giáo viên kiểm); tranh vẽ bằng toPic (toeic.js: nền + khối + emoji).
// Starters: nối tên với người · viết tên / số · tô màu · tranh lớn yes / no · xếp chữ thành từ (tự sinh từ từ có tranh) · chọn từ điền · truyện tranh trả lời.
// Movers: như Starters + nối ngày với tranh · đọc định nghĩa viết từ (tự sinh từ nghĩa tiếng Anh của từ A1) · chọn câu đáp · điền trắc nghiệm · truyện điền câu · nhìn tranh viết.
// A2 Key: nghe hội thoại chọn tranh · nối người với vật · viết truyện theo tranh. B1: nghe hội thoại chọn tranh. Luyện thi không tính luật đo.
const DT_COL = [['red', '🔴'], ['blue', '🔵'], ['green', '🟢'], ['yellow', '🟡'], ['orange', '🟠'], ['purple', '🟣']];
const DT_YES = '✓ Yes', DT_NO = '✗ No';
const dtAll = () => (KIT.nghe.raw && KIT.nghe.raw.dt) || [];
// v143: DT_PIN = id bộ cần làm (bài tập theo bộ ở màn bài thi Cambridge); không có thì bốc ngẫu nhiên như đề thử
let DT_PIN = null;
const dtSet = (k, lv = MK.C.lo) => { const xs = dtAll().filter(x => x.k === k && x.lv === lv), pin = DT_PIN && xs.find(x => x.id === DT_PIN); return pin || (xs.length ? xs[Math.floor(Math.random() * xs.length)] : null); };
const dtPlay = (x, i, lines) => ({ key: x.id + '|' + i, lines });
const dtTxt = (x, cur) => `<div class="box"><b>${esc(x.t)}</b><p style="font-size:16px;line-height:1.7;margin:6px 0 0">${esc(x.text).replace(/\{(\d)\}/g, (_, n) => +n - 1 === cur ? `<mark style="padding:1px 4px;border-radius:4px"><b>(${n})</b> ______</mark>` : `<b>(${n})</b> ______`)}</p></div>`;
const dtParaTxt = (x, cur) => `<div class="box"><b>${esc(x.t)}</b>${x.text.split('\n').map(p => { const m = p.match(/^\{(\d)\}$/); return m ? `<p style="margin:8px 0;padding:6px 8px;border:1px dashed var(--line);border-radius:8px${+m[1] - 1 === cur ? ';border-color:var(--accent);background:var(--accent2)' : ''}"><b>(${m[1]})</b> ______</p>` : `<p class="tdtap" style="font-size:16px;line-height:1.6;margin:8px 0 0">${esc(p)}</p>`; }).join('')}</div>`;
const dtParaOpts = x => `<div class="box"><b>Các đoạn A–${'ABCDEFGH'[x.opts.length - 1]}</b>${x.opts.map((o, j) => `<p class="tdtap" style="font-size:15px;line-height:1.55;margin:8px 0 0"><b>${'ABCDEFGH'[j]}</b> ${esc(o)}</p>`).join('')}</div>`;
const dtPanels = ps => `<div style="display:grid;grid-template-columns:1fr;gap:6px">${ps.map((p, i) => `<div><span class="mute">Tranh ${i + 1}</span>${toPic(p)}</div>`).join('')}</div>`;
// một bộ → câu hỏi theo khuôn đề thử (mkPaper: mc / type / write)
// v143 📩 đọc tin ngắn (A2 Key, B1 Preliminary phần 1): mỗi câu một văn bản ngắn (tin nhắn, thông báo, biển báo, email, nhãn), 3 phương án
const DT_SNK = { note: '📝 Tin nhắn', notice: '📌 Thông báo', sign: '🪧 Biển báo', email: '✉️ Email', label: '🏷 Nhãn', ad: '📢 Quảng cáo' };
const dtSnBox = it => `<div class="box" style="border-style:dashed"><p class="mute" style="margin:0 0 4px;font-size:13px">${DT_SNK[it.kind] || '📝 Văn bản'}</p><p class="tdtap" style="margin:0;font-size:17px;line-height:1.55;white-space:pre-line">${esc(it.txt)}</p></div>`;
const DT_Q = {
  sn: x => x.items.map(it => ({ x, k: 'sn', kind: 'mc', head: '<p class="mute">📖 Đọc văn bản, chọn câu đúng với ý văn bản.</p>' + dtSnBox(it), q: esc(it.q || 'Văn bản này nói gì?'), opts: shuf([it.a, ...it.w]), a: it.a, why: it.why })),
  line: x => x.qs.map((q, i) => ({ x, k: 'line', kind: 'mc', head: '<p class="mute">🎧 Nghe, chọn chữ cái của người có tên này (có 1 người thừa).</p>' + toPic(x.pic),
    q: `${esc(q.n)} là người nào?`, opts: [...new Set(x.qs.map(y => y.a).concat(x.pic.e.map(e => e[0]).filter(t => /^[A-H]$/.test(t))))].sort(), a: q.a, play: dtPlay(x, i, q.lines), why: q.lines.map(l => l[1]).join(' ') })),
  name: x => x.qs.map((q, i) => ({ x, k: 'name', kind: 'type', head: `<p class="mute">🎧 Nghe, viết tên hoặc số (tên được đánh vần).</p><div class="box"><b>${esc(x.t)}</b></div>`,
    q: esc(q.q), a: q.a[0], acc: q.a, play: dtPlay(x, i, q.lines), why: q.lines.map(l => l[1]).join(' ') })),
  colour: x => x.qs.map((q, i) => q.write
    ? { x, k: 'colour', kind: 'type', head: `<p class="mute">🎧 Nghe rồi viết từ lên vật này.</p><p style="font-size:64px;text-align:center;margin:6px 0;filter:grayscale(1)">${q.o}</p>`, q: `Viết gì lên ${esc(q.w)}?`, a: q.write[0], acc: q.write, play: dtPlay(x, i, q.lines), why: q.lines.map(l => l[1]).join(' ') }
    : { x, k: 'colour', kind: 'mc', head: `<p class="mute">🎧 Nghe, tô vật này màu gì?</p><p style="font-size:64px;text-align:center;margin:6px 0;filter:grayscale(1)">${q.o}</p>`, q: `Tô ${esc(q.w)} màu gì?`,
      opts: DT_COL.map(([c, e]) => e + ' ' + c), a: DT_COL.filter(([c]) => c === q.a).map(([c, e]) => e + ' ' + c)[0], play: dtPlay(x, i, q.lines), why: q.lines.map(l => l[1]).join(' ') }),
  yn: x => x.qs.map(q => ({ x, k: 'yn', kind: 'mc', head: '<p class="mute">📖 Nhìn tranh, đọc câu: đúng thì Yes, sai thì No.</p>' + toPic(x.pic), q: esc(q.s), opts: [DT_YES, DT_NO], a: q.a ? DT_YES : DT_NO, why: q.a ? 'Đúng với tranh.' : 'Tranh không như vậy.' })),
  box: x => [...x.a.map((a, i) => ({ x, k: 'box', kind: 'mc', head: `<p class="mute">📖 Chọn từ trong khung điền vào chỗ được tô (có 3 từ thừa).</p>` + dtTxt(x, i), q: `Chỗ (${i + 1})`, opts: x.bank.slice(), a, why: '' })),
    ...(x.title ? [{ x, k: 'box', kind: 'mc', head: dtTxt(x, -1), q: esc(x.title.q), opts: shuf([x.title.a, ...x.title.w]), a: x.title.a, why: '' }] : [])],
  story: x => x.qs.map(q => ({ x, k: 'story', kind: 'type', head: `<p class="mute">📖 ${x.text ? 'Đọc truyện, xem tranh, điền 1–3 từ.' : 'Xem tranh, trả lời bằng 1 từ.'}</p>` + (x.text ? `<div class="box"><b>${esc(x.t)}</b><p style="font-size:16px;line-height:1.6;margin:6px 0 0">${esc(x.text)}</p></div>` : '') + (q.p != null ? `<div><span class="mute">Tranh ${q.p + 1}</span>${toPic(x.panels[q.p])}</div>` : dtPanels(x.panels)),
    q: esc(q.q), a: q.a[0], acc: q.a, why: 'Đáp án: ' + q.a[0] })),
  match5: x => x.names.map((n, i) => ({ x, k: 'match5', kind: 'mc', head: `<p class="mute">🎧 ${esc(x.t)} Nghe cả bài, chọn cho từng người / ngày (mỗi lựa chọn dùng một lần, có 3 cái thừa).</p>`, q: esc(n),
    opts: x.o.map((o, j) => 'ABCDEFGH'[j] + '. ' + o), a: 'ABCDEFGH'[x.a[i]] + '. ' + x.o[x.a[i]], play: { key: x.id, lines: x.lines }, why: x.lines.map(l => l[1]).join(' ') })),
  resp: x => x.qs.map(q => ({ x, k: 'resp', kind: 'mc', head: `<p class="mute">📖 Chọn câu đáp hợp nhất.</p>`, q: '💬 ' + esc(q.q), opts: shuf([q.a, ...q.w]), a: q.a, why: '' })),
  mcc: x => x.gaps.map((g, i) => ({ x, k: 'mcc', kind: 'mc', head: '<p class="mute">📖 Chọn từ đúng cho chỗ được tô.</p>' + dtTxt(x, i), q: `Chỗ (${i + 1})`, opts: shuf([g.a, ...g.w]), a: g.a, why: '' })),
  pdesc: x => x.qs.map(q => ({ x, k: 'pdesc', kind: 'type', head: '<p class="mute">✍️ Nhìn tranh, hoàn thành câu hoặc trả lời câu hỏi.</p>' + toPic(x.pic), q: esc(q.q), a: q.a[0], acc: q.a, why: 'Ví dụ: ' + q.a[0] })),
  pmc: x => x.qs.map((q, i) => ({ x, k: 'pmc', kind: 'mc', head: '<p class="mute">🎧 Đọc câu hỏi, nhìn 3 tranh, nghe rồi chọn.</p>', q: esc(q.q), opts: q.o.slice(), a: q.o[q.a], play: dtPlay(x, i, q.lines), why: q.lines.map(l => l[1]).join(' ') })),
  // v132 khuyết ĐOẠN (C1 phần 7, C2 phần 6): chọn đoạn A–E cho chỗ trống được tô; 1 đoạn thừa; các đoạn in ở dưới như đề thật
  gpara: x => x.a.map((ai, i) => ({ x, k: 'gpara', kind: 'mc', head: '<p class="mute">📖 Chọn đoạn (A–E) cho chỗ trống được tô. Có 1 đoạn thừa; mỗi đoạn dùng một lần.</p>' + dtParaTxt(x, i), q: `Chỗ (${i + 1})`,
    opts: x.opts.map((o, j) => 'ABCDEFGH'[j]), a: 'ABCDEFGH'[ai], why: (x.why || [])[i] || '', foot: dtParaOpts(x) })),
  pstory: x => { const it = x.items[Math.floor(Math.random() * x.items.length)], w = { ...it, lv: x.lv, genre: 'truyện theo tranh', min: 35, max: 80 }, q = kWrite(w); q.head = dtPanels(it.panels) + q.head; return [q]; } };
// phần đề thử: một bộ ngẫu nhiên của dạng ở cấp của đề
const dtQ = k => { const x = dtSet(k); return x ? DT_Q[k](x) : []; };
// 🔤 xếp chữ thành từ (Starters phần 3): từ có tranh của Starters, 3–7 chữ cái, xáo chữ (không trùng thứ tự gốc)
const dtSpell = n => shuf(picSet().filter(x => x.lv === 'pre' && /^[a-z]{3,7}$/.test(x.w))).slice(0, n).map(x => { let s = x.w.split(''); for (let t = 0; t < 9 && s.join('') === x.w; t++) s = shuf(s);
  return { x, k: 'spell', kind: 'type', head: `<p class="mute">📖 Nhìn tranh, xếp các chữ cái thành từ.</p><p style="font-size:64px;text-align:center;margin:6px 0">${x.e}</p><p style="text-align:center;font-size:22px;letter-spacing:6px"><b>${s.join(' ')}</b></p>`, q: 'Từ này là gì?', a: x.w, acc: [x.w], why: x.e + ' ' + x.w }; });
// 📖 định nghĩa → từ (Movers phần 1): từ có tranh chọn tay (picSet, emoji đúng nghĩa) + nghĩa tiếng Anh của kho từ; bỏ nghĩa nhiều nghĩa (;), nghĩa động từ (to …), nghĩa chứa chính từ đó.
// Khung 8 từ (5 cần + 3 thừa), cùng nhóm trước để phải đọc kỹ
const dtDef = n => { const by = {}; for (const w of WORDS) if (!by[w.w]) by[w.w] = w;
  const W = shuf(picSet().map(x => ({ x, d: (by[x.w] || {}).en })).filter(({ x, d }) => d && d.length >= 12 && d.length <= 95 && !/;/.test(d) && !/^to /.test(d) && !d.toLowerCase().includes(x.w.toLowerCase())));
  const take = W.filter(o => o.x.lv === 'a1').slice(0, n), more = take.length < n ? W.filter(o => !take.includes(o)).slice(0, n - take.length) : [], T = [...take, ...more];
  const bank = shuf([...T, ...W.filter(o => !T.includes(o) && T.some(t => t.x.c === o.x.c)).slice(0, 3)]), box = `<div class="box" style="font-size:15px">${bank.map(({ x }) => `${x.e} ${esc(x.w)}`).join(' · ')}</div>`;
  return T.map(({ x, d }) => ({ x, k: 'def', kind: 'type', head: '<p class="mute">📖 Đọc định nghĩa, chép từ đúng trong khung (có 3 từ thừa).</p>' + box, q: esc(d.charAt(0).toUpperCase() + d.slice(1)) + '.', a: x.w, acc: [x.w], why: x.e + ' ' + x.w })); };
