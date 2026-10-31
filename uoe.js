// 🧩 Dạng đề thật B1 → C2 (28/10/2026, bù khuyết điểm "bài đọc quá ngắn, thiếu dạng bài trên cả đoạn"; người sáng lập: "sáng tạo các cách để bù đắp, khỏi hỏi tôi").
// Dữ liệu uoe.json (tools/build-uoe.mjs ← content/bs/uoe-*.json, Claude soạn, chưa người thật kiểm):
//   long: bài dài 330–770 từ, trắc nghiệm 4 phương án (B1 Đọc phần 3; B2 / C1 / C2 phần 5) hoặc nối câu với đoạn (B2 phần 7, C1 phần 8, C2 phần 7)
//   mc / open / wf: điền từ trắc nghiệm, điền một từ, tạo dạng từ trên cả đoạn văn (phần 1–3 của Dùng tiếng Anh; B1 phần 5–6)
//   kwt: viết lại câu dùng từ khoá (B2 2–5 từ, C1 3–6, C2 3–8; B1 luyện thêm)
//   sum: tóm tắt và đánh giá 2 đoạn văn (C2 Proficiency Viết phần 1)
// Luyện ở đây không tính vào 📘 Học / 🔁 Nhớ / Thi chuyển cấp (không đổi luật đo); đề thử 🎓 dùng kho này thay câu lẻ.
let UOE = null;
const uLoad = async () => UOE || (UOE = await (await fetch('uoe.json?v=' + APP_V)).json());
const U_LV = ['b1', 'b2', 'c1', 'c2'];
const U_T = { long: ['📖', 'Bài dài, trắc nghiệm', 'Đọc bài 330–770 từ như đề thật, chọn 1 trong 4.'], pm: ['🧭', 'Nối câu với đoạn', 'Tìm đoạn (người) nói ý của câu hỏi. Đọc lướt, rồi đọc kỹ chỗ nghi.'],
  mc: ['🔤', 'Điền từ trắc nghiệm cả đoạn', 'Chọn từ đúng cụm, đúng giới từ đi kèm. Đọc cả câu trước và sau chỗ trống.'], open: ['✏️', 'Điền một từ', 'Mỗi chỗ một từ: giới từ, mạo từ, đại từ, từ nối, trợ động từ.'],
  wf: ['🧬', 'Tạo dạng từ', 'Đổi từ gốc in hoa thành dạng đúng: danh từ, tính từ, trạng từ, phủ định, số nhiều.'], kwt: ['🔁', 'Viết lại câu dùng từ khoá', 'Viết vào chỗ trống, có từ khoá, không đổi từ khoá, giữ nghĩa câu đầu.'],
  sum: ['📝', 'Tóm tắt và đánh giá 2 đoạn văn', 'C2 Proficiency Viết phần 1 (bắt buộc): tóm ý hai đoạn bằng lời của mình, đánh giá, thêm ý riêng; 240–280 từ.'] };
const uRuns = () => (S.uoe = S.uoe || {});
// cấp có nội dung tới cấp đang chọn (B1+ → B1), cấp đang chọn trước
const uLvs = lv => U_LV.filter(l => LEVELS.indexOf(l) <= LEVELS.indexOf(lv)).reverse();
const uItems = (k, ls) => !UOE ? [] : k === 'pm' ? UOE.long.filter(x => x.pm && ls.includes(x.lv)) : k === 'long' ? UOE.long.filter(x => x.qs && ls.includes(x.lv)) : (UOE[k] || []).filter(x => ls.includes(x.lv));
// chọn bài: cấp đầu danh sách trước, bài chưa làm / làm lâu nhất trước
const uPick = (k, ls, n) => { const R = uRuns(); for (const l of ls) { const its = uItems(k, [l]); if (its.length) return shuf(its).sort((a, b) => ((R[a.id] || {}).at || 0) - ((R[b.id] || {}).at || 0)).slice(0, n); } return []; };
const uText = t => esc(t).replace(/\n/g, '<br><br>');
function uPassage(x, cur, k) { return `<div class="box"><b>${esc(x.title)}</b><p class="tdtap" style="font-size:16px;line-height:1.7;margin:8px 0 0">${uText(x.text).replace(/\{(\d+)\}/g, (_, n) => {
  const g = x.gaps[n - 1], s = `<b>(${n})</b> ______${k === 'wf' ? ` <span class="mute">(${esc(g.stem)})</span>` : ''}`; return +n - 1 === cur ? `<mark style="padding:1px 4px;border-radius:4px">${s}</mark>` : s; })}</p></div>`; }
// câu chứa chỗ trống (hiện ngay ở câu hỏi, cả bài nằm dưới để đọc thêm ngữ cảnh; trên iPhone khỏi cuộn tìm chỗ trống)
const uSent = (x, n, k) => { const ss = x.text.replace(/\n/g, ' ').match(/[^.!?]+[.!?]+['’"]?\s*/g) || [x.text], s = ss.find(t => t.includes(`{${n}}`)) || '';
  return esc(s.trim()).replace(/\{(\d+)\}/g, (_, m) => +m === n ? `<mark style="padding:1px 4px;border-radius:4px"><b>(${m})</b> ______</mark>${k === 'wf' ? ` <b>(${esc(x.gaps[m - 1].stem)})</b>` : ''}` : `(${m}) ___`); };
// câu hỏi theo khuôn đề thử (mock.js): { x, kind, head, foot, q, opts, a, acc, why, check }
function uGapQs(k, x) { return x.gaps.map((g, i) => { const head = `<p class="mute" style="margin:4px 0">${esc(x.title)} · ${k === 'mc' ? 'chọn từ đúng' : k === 'wf' ? `đổi dạng từ ${esc(g.stem)}` : 'điền một từ'}</p>`,
    q = `<span style="font-weight:400;font-size:19px;line-height:1.5">${uSent(x, i + 1, k)}</span>`, foot = `<div style="margin-top:12px">${uPassage(x, i, k)}</div>`;
  return k === 'mc' ? { x, k, kind: 'mc', head, q, foot, opts: shuf([g.a, ...g.w]), a: g.a, why: g.why } : { x, k, kind: 'type', head, q, foot, a: g.a[0], acc: g.a, why: g.why }; }); }
const uKwtCheck = x => v => { const n = kNorm(v), ok = x.a.some(a => kNorm(a) === n || kNorm(x.s2.replace('____', a)) === n); return { ok, html: `${ok ? '✅' : '❌'} Đáp án: <b>${esc(x.a[0])}</b>${x.a.length > 1 ? ` <span class="mute">(cũng đúng: ${x.a.slice(1).map(esc).join(' / ')})</span>` : ''}` }; };
const uKwtQ = x => ({ x, k: 'kwt', kind: 'type', head: `<div class="box"><p style="margin:0">${esc(x.s1)}</p><p style="margin:8px 0;font-weight:800;letter-spacing:1px">${esc(x.key)}</p><p style="margin:0">${esc(x.s2).replace('____', '<b>__________</b>')}</p></div>`,
  q: 'Viết phần còn thiếu (có từ khoá in hoa)', a: x.a[0], acc: x.a, why: x.why, check: uKwtCheck(x) });
const uLongBox = x => `<details class="box" open style="margin-top:12px"><summary><b>${esc(x.title)}</b> <span class="mute">(${kWords(x.text).length} từ)</span></summary><p class="tdtap" style="font-size:16px;line-height:1.7;margin:8px 0 0">${uText(x.text)}</p></details>`;
const uLongQs = x => x.qs.map(q => ({ x, k: 'long', kind: 'mc', foot: uLongBox(x), q: esc(q.q), opts: shuf([q.a, ...q.w]), a: q.a, why: q.why }));
const uPmQs = x => x.pm.map(q => ({ x, k: 'pm', kind: 'mc', foot: uLongBox(x), q: esc(q.q), opts: x.secs, a: x.secs[q.p], why: q.why }));
// 📝 tóm tắt 2 đoạn (C2): chấm như bài Viết (đủ ý bằng từ khoá, độ dài, 4 tiêu chí); AI chấm nhận cả hai đoạn trong đề
function uSumQ(x) { const y = { ...x, p: x.p + '\n\nText 1: ' + x.texts[0] + '\n\nText 2: ' + x.texts[1] }, q = kWrite(y);
  q.head = `<div class="box"><b>${esc(x.en)}</b><p style="margin:6px 0">${esc(x.p)}</p><p class="mute" style="margin:0">${esc(x.pv)}</p></div>${x.texts.map((t, i) => `<div class="box"><b>Text ${i + 1}</b><p class="tdtap" style="margin:6px 0 0;font-size:16px;line-height:1.6">${esc(t)}</p></div>`).join('')}
    <p class="mute">Cần viết đủ: ${x.c.map(esc).join(' · ')}.</p>`; q.k2 = 'sum'; return q; }
const uQs = (k, x) => k === 'long' ? uLongQs(x) : k === 'pm' ? uPmQs(x) : k === 'kwt' ? uKwtQ(x) : k === 'sum' ? [uSumQ(x)] : uGapQs(k, x);

// ---------- 🎓 đề thử: thay câu lẻ bằng dạng đề thật trên cả đoạn ----------
const uMk = (k, n) => () => { const ls = mkLvs().filter(l => U_LV.includes(l)).reverse(); return k === 'sum' ? uPick(k, ['c2'], n).map(uSumQ) : k === 'kwt' ? uPick(k, ls.length ? ls : uLvs(MK.lv), n).map(uKwtQ) : uPick(k, ls.length ? ls : uLvs(MK.lv), n).flatMap(x => uQs(k, x)); };
{ const R = (lv, parts) => { if (MOCK[lv]) MOCK[lv].papers[0].parts = parts; };
  R('b1', [['Phần 1–2: đọc tin ngắn', () => mkRead(2)], ['Phần 3: bài dài', uMk('long', 1)], ['Phần 4: đoạn văn khuyết câu', () => mkGap(1)], ['Phần 5: điền từ trắc nghiệm', uMk('mc', 1)], ['Phần 6: điền từ', uMk('open', 1)]]);
  const UE = (p7, gapN) => [['Phần 1: điền từ trắc nghiệm', uMk('mc', 1)], ['Phần 2: điền từ', uMk('open', 1)], ['Phần 3: tạo dạng từ', uMk('wf', 1)], ['Phần 4: viết lại câu dùng từ khoá', uMk('kwt', 6)],
    ['Phần 5: bài dài', uMk('long', 1)], [gapN, () => mkGap(1)], [p7, uMk('pm', 1)]];
  R('b2', UE('Phần 7: nối câu với đoạn', 'Phần 6: đoạn văn khuyết câu')); R('c1', UE('Phần 8: nối câu với đoạn', 'Phần 7: đoạn văn khuyết câu')); R('c2', UE('Phần 7: nối câu với đoạn', 'Phần 6: đoạn văn khuyết câu'));
  if (MOCK.c2) MOCK.c2.papers[1].parts = [['Phần 1: tóm tắt và đánh giá 2 đoạn văn (bắt buộc)', uMk('sum', 1)], ['Phần 2: bài luận / bài báo / báo cáo', () => mkWrite(1)]]; }

// ---------- 🧩 luyện từng dạng (có báo đúng / sai, giải thích; không tính giờ) ----------
function uoeBox(lv) { if (LEVELS.indexOf(lv) < LEVELS.indexOf('b1')) return ''; const R = uRuns(), ls = uLvs(lv), all = UOE ? Object.keys(U_T).flatMap(k => uItems(k, ls)) : [], done = all.filter(x => R[x.id]).length;
  return `<div class="box"><div class="row"><b>🧩 Luyện dạng đề thật</b><span class="mute">${UOE ? `đã làm ${done}/${all.length}` : ''}</span></div><p class="mute" style="margin:6px 0">Bài đọc dài như đề, điền từ cả đoạn, tạo dạng từ, viết lại câu từ khoá. Báo đúng / sai từng câu, có giải thích.</p><button data-uoe="${lv}">🧩 Luyện</button></div>`; }
async function uoeView(lv) { window.CUR = { view: 'dang-de', item: lv }; $app.innerHTML = '<p class="mute">Đang tải…</p>';
  try { await uLoad(); } catch (e) { $app.innerHTML = `${backRow('🧩 Dạng đề thật')}<p>Không tải được. Thử lại sau.</p>`; $app.onclick = e => { if (e.target.closest('[data-a="home"]')) exHome(lv); }; return; }
  const R = uRuns(), ls = uLvs(lv), row = k => { const its = uItems(k, ls); if (!its.length) return ''; const d = its.filter(x => R[x.id]), avg = d.length ? Math.round(d.reduce((s, x) => s + R[x.id].ok / R[x.id].n, 0) / d.length * 100) : null;
    return `<button class="box" data-ut="${k}" style="width:100%;text-align:left;display:block"><div class="row"><b>${U_T[k][0]} ${U_T[k][1]}</b><span class="mute">${d.length}/${its.length}${avg != null ? ` · ${avg}%` : ''} ›</span></div><p class="mute" style="margin:4px 0 0">${U_T[k][2]}</p></button>`; };
  $app.innerHTML = `${backRow('🧩 Dạng đề thật')}<h1>🧩 Luyện dạng đề thật · ${LVN[lv]}</h1>
    <p class="mute">Dạng bài như đề Cambridge: làm trên cả bài, không phải câu lẻ. Lấy bài cấp ${LVN[lv]} trước, rồi các cấp B dưới. Không tính giờ, báo đúng / sai ngay. Nội dung AI soạn, chưa người thật kiểm; mỗi dạng 2–12 bài nên sẽ gặp lại.</p>
    ${Object.keys(U_T).map(row).join('')}<p class="mute">Không tính vào 📘 Học / 🔁 Nhớ. Muốn làm có giờ như thi thật: 🎓 Đề thử.</p>`;
  $app.onclick = e => { if (e.target.closest('[data-a="home"]')) return exHome(lv); const b = e.target.closest('[data-ut]'); if (!b) return; const k = b.dataset.ut;
    const xs = k === 'kwt' ? uPick(k, ls, 6) : uPick(k, ls, 1); if (xs.length) uRun(lv, k, xs); }; }
function uRun(lv, k, xs) { const qs = k === 'kwt' ? xs.map(uKwtQ) : uQs(k, xs[0]), res = []; let i = 0;
  const show = () => { if (i >= qs.length) return end(); const q = qs[i]; window.CUR = { view: 'dang-de-cau', item: (q.x.id || '') + ':' + i, prompt: String(q.q).replace(/<[^>]*>/g, '').slice(0, 200) };
    const body = q.kind === 'mc' ? q.opts.map((o, j) => `<button class="opt" data-uo="${j}">${esc(o)}</button>`).join('')
      : q.kind === 'write' ? `<form id="uf" autocomplete="off"><textarea id="ut" rows="12" autocapitalize="sentences" spellcheck="false" aria-label="Bài viết"></textarea><p class="mute" id="uwc">0 từ</p><button class="pri" type="submit">Nộp bài</button></form>`
      : `<form id="uf" autocomplete="off"><input id="ut" autocapitalize="off" autocorrect="off" spellcheck="false" aria-label="Câu trả lời"><button class="pri" type="submit">Trả lời</button></form>`;
    $app.innerHTML = `<div class="row top"><button class="link" data-a="back">← Thôi</button><span class="uname">${U_T[k][0]} ${i + 1}/${qs.length}</span></div>${q.head || ''}<p class="q" style="font-size:20px">${q.q}</p>${body}<div id="ufb"></div>${q.foot || ''}`;
    const f = document.getElementById('uf'); if (f) { const t = document.getElementById('ut'); if (q.kind === 'write') t.oninput = () => { document.getElementById('uwc').textContent = kWords(t.value).length + ' từ'; }; f.onsubmit = e => { e.preventDefault(); if (!t.value.trim()) return t.focus();
      const r = q.check ? q.check(t.value) : { ok: q.acc.some(a => kNorm(a) === kNorm(t.value)) }; t.disabled = true; f.querySelector('button').remove(); fb(r.ok, t.value, r.html); }; } };
  const fb = (ok, ans, html) => { res.push({ q: qs[i], ok, ans }); const q = qs[i];
    if (q.kind === 'mc') $app.querySelectorAll('[data-uo]').forEach(b => { b.disabled = true; const o = q.opts[+b.dataset.uo]; if (o === q.a) b.classList.add('ok'); else if (o === ans) b.classList.add('no'); });
    document.getElementById('ufb').innerHTML = `<div class="box"><b>${ok ? '✅ Đúng' : '❌ Chưa đúng'}</b>${html ? `<p style="margin:4px 0">${html}</p>` : q.kind === 'mc' ? '' : `<p style="margin:4px 0">Đáp án: <b>${esc(q.acc.join(' / '))}</b></p>`}${q.why ? `<p class="mute" style="margin:4px 0 0">${esc(q.why)}</p>` : ''}</div><button class="pri" data-a="next">Tiếp ›</button>`;
    const n = $app.querySelector('[data-a="next"]'); if (n && n.scrollIntoView) n.scrollIntoView({ block: 'nearest' }); };
  const end = () => { const R = uRuns(), by = {}; for (const r of res) { const o = by[r.q.x.id] = by[r.q.x.id] || { at: Date.now(), ok: 0, n: 0 }; o.n++; if (r.ok) o.ok++; } Object.assign(R, by); S.t = Date.now(); save();
    const ok = res.filter(r => r.ok).length, wrong = res.filter(r => !r.ok);
    $app.innerHTML = `<h1>${U_T[k][0]} ${ok}/${res.length} câu đúng</h1>${wrong.length ? `<div class="box"><b>Câu sai</b>${wrong.map(r => `<p style="margin:8px 0 0">${r.q.q}<br>Bạn: ${esc(r.ans)} · Đáp án: <b>${esc(r.q.a)}</b>${r.q.why ? `<br><span class="mute">${esc(r.q.why)}</span>` : ''}</p>`).join('')}</div>` : '<p>Đúng hết. Thử dạng khó hơn hoặc 🎓 Đề thử.</p>'}
      <button class="pri" data-a="again">▶ Bài khác cùng dạng</button><button data-a="back">← Các dạng đề</button>`; scrollTo(0, 0); };
  $app.onclick = e => { if (e.target.closest('[data-a="back"]')) return uoeView(lv); if (e.target.closest('[data-a="next"]')) { i++; scrollTo(0, 0); return show(); }
    if (e.target.closest('[data-a="again"]')) { const ys = k === 'kwt' ? uPick(k, uLvs(lv), 6) : uPick(k, uLvs(lv), 1); return uRun(lv, k, ys); }
    const o = e.target.closest('[data-uo]'); if (o && !o.disabled && res.length === i) { const q = qs[i], v = q.opts[+o.dataset.uo]; fb(v === q.a, v); } };
  show(); }
document.addEventListener('click', e => { const b = e.target.closest('[data-uoe]'); if (b) uoeView(b.dataset.uoe); });
uLoad().catch(() => {});
