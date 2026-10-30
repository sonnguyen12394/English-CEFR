// 🎧 Bù 2 (28/10/2026): hai dạng Nghe đề thật đòi mà app còn thiếu.
// 📝 Nghe điền thông tin (A2 Key phần 2, B1 Preliminary phần 3, B2 First phần 2, C1 Advanced phần 2, C2 Proficiency phần 2): phiếu ghi chú tự sinh từ bài nghe có sẵn,
//    mỗi chỗ trống là số, giờ, giá, tên riêng hoặc từ nội dung dài trong một câu của bài; nghe tối đa 2 lần như đề thật. Đề thật diễn đạt lại câu; ở đây giữ nguyên câu (dễ hơn đề thật một bậc).
// 🗣 Nhại theo (shadowing): nghe một câu giọng tự nhiên (n/), nói lại ngay; máy đo khớp từ (chép lời) và nhịp so với giọng mẫu. Cần Safari trên iPhone để chép lời.
// Không tính vào 📘 Học / 🔁 Nhớ / Thi chuyển cấp (không đổi luật đo).
const NG_NUM = { zero: 0, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10, eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15, sixteen: 16, seventeen: 17, eighteen: 18, nineteen: 19,
  twenty: 20, thirty: 30, forty: 40, fifty: 50, sixty: 60, seventy: 70, eighty: 80, ninety: 90, hundred: 100, thousand: 1000 };
// "twenty-five" → 25, "two hundred" → 200, "a thousand" → 1000; không phải số → null
function ngNum(s) { const ws = String(s).toLowerCase().replace(/-/g, ' ').split(/\s+/).filter(w => w && w !== 'and'); if (!ws.length) return null; let tot = 0, cur = 0;
  for (const w of ws) { if (w === 'a' && cur === 0) { cur = 1; continue; } const v = NG_NUM[w]; if (v == null) return null; if (v === 100) cur = (cur || 1) * 100; else if (v === 1000) { tot += (cur || 1) * 1000; cur = 0; } else cur += v; } return tot + cur; }
const NG_STOP = new Set('about because before between through without another anything something everything nothing however although actually probably definitely really usually certainly especially important different interesting people because whether should would could things thought always already'.split(' '));
const NG_NUMRE = /\b(?:(?:a|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety)(?:[- ](?:one|two|three|four|five|six|seven|eight|nine))?(?: (?:hundred|thousand))?(?: and (?:one|two|three|four|five|six|seven|eight|nine|ten|twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety)(?:-(?:one|two|three|four|five|six|seven|eight|nine))?)?)\b/i;
// chọn một chỗ trống trong câu: số (chữ số / chữ) > giờ, giá > tên riêng giữa câu > từ nội dung dài nhất (≥ 7 chữ)
function ngTok(s) { let m = s.match(/(?:[£$€]\s?)?\b\d[\d,.:]*\b(?:\s?(?:am|pm|%))?/i); if (m) return m[0].trim();
  m = s.match(NG_NUMRE); if (m && m[0].toLowerCase() !== 'a' && m[0].toLowerCase() !== 'one' && ngNum(m[0]) != null) return m[0];
  // tên riêng: chữ hoa không đứng sau dấu câu, không phải lời chào (Dear Hoa, Hi Nam)
  const raw = s.split(/\s+/), cl = w => w.replace(/^[^A-Za-z]+|[^A-Za-z]+$/g, ''), cap = raw.map((w, i) => i && !/[,:;.!?]$/.test(raw[i - 1]) && !/^(dear|hi|hello)$/i.test(cl(raw[i - 1])) ? cl(w) : '')
    .find(w => /^[A-Z][a-z]{2,}$/.test(w) && !/^(This|That|The|There|They|These|Those|We|You|He|She|It|My|Our|Your|And|But|So|Mr|Mrs|Ms|Dr|Okay)$/.test(w));
  if (cap) return cap; const c = raw.slice(1).map(cl).filter(w => /^[a-z]{7,}$/.test(w) && !/ly$/.test(w) && !NG_STOP.has(w)).sort((a, b) => b.length - a.length)[0]; return c || null; }
const ngAcc = t => { const n = ngNum(t), d = t.replace(/[£$€,\s]/g, ''); return [...new Set([t, d, ...(n != null ? [String(n)] : [])])]; };
// thay đúng từ (không thay chuỗi con: "ten" trong "often")
const ngBlank = (s, t, h) => esc(s).replace(new RegExp('(^|[^A-Za-z0-9£$€])' + esc(t).replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '(?![A-Za-z0-9])'), (_, p) => p + h);
// phiếu ghi chú của một bài: tối đa 6 chỗ trống, mỗi câu một chỗ, giữ thứ tự bài; < 3 chỗ thì bỏ bài
function ngForm(x) { const ss = kSents(x.text).filter(s => kWords(s).length >= 5), out = [];
  for (const s of ss) { const t = ngTok(s); if (t && out.length < 6 && kWords(s).length <= 30) out.push({ s, t }); }
  if (out.length > 6) out.length = 6; return out.length >= 3 ? out : null; }
const ngNote = (G, cur) => `<div class="box"><b>📝 Phiếu ghi chú</b>${G.map((g, i) => `<p style="margin:8px 0 0;font-size:16px;line-height:1.5">${i + 1}. ${ngBlank(g.s, g.t, i === cur ? `<mark style="padding:1px 4px;border-radius:4px"><b>(${i + 1})</b> ______</mark>` : `<b>(${i + 1})</b> ______`)}</p>`).join('')}</div>`;
// câu hỏi theo khuôn đề thử / bài luyện: mỗi chỗ trống một câu gõ; cả bài dùng chung lượt nghe (khoá = id bài)
function ngQs(x) { const G = ngForm(x); if (!G) return []; const play = { key: x.id, lines: x.lines, text: x.text };
  return G.map((g, i) => ({ x, k: 'nf', kind: 'type', head: `<p class="mute">🎧 Nghe bài (tối đa ${K_PLAYS} lần), viết từ / số vào chỗ trống. Số viết bằng chữ số cũng được.</p>${ngNote(G, i)}`, q: `Chỗ (${i + 1}) là gì?`, play,
    a: g.t, acc: ngAcc(g.t), why: '“' + g.s + '”', check: v => { const ok = ngAcc(g.t).some(a => kNorm(a) === kNorm(v.replace(/[£$€,]/g, '')) || kNorm(a) === kNorm(v)); return { ok, html: `${ok ? '✅' : '❌'} Đáp án: <b>${esc(g.t)}</b>` }; } })); }
const ngLvs = lv => { const base = { a2p: 'a2', b1p: 'b1', b2p: 'b2' }[lv] || lv; return ['c2', 'c1', 'b2', 'b1', 'a2'].filter(l => LEVELS.indexOf(l) <= LEVELS.indexOf(base)); };
const ngItems = ls => (KIT.nghe.items || []).filter(x => ls.includes(x.lv) && ngForm(x));
const ngRuns = () => (S.ng = S.ng || { nf: {}, sh: [] });
const ngPick = (ls, n) => { const R = ngRuns().nf; for (const l of ls) { const its = ngItems([l]); if (its.length) return shuf(its).sort((a, b) => ((R[a.id] || {}).at || 0) - ((R[b.id] || {}).at || 0)).slice(0, n); } return []; };
// 🎓 đề thử: thêm phần nghe điền thông tin vào bài Nghe
{ const add = (lv, label) => { const C = MOCK[lv]; if (!C) return; const P = C.papers.find(p => /Nghe/.test(p.t)); if (P) P.parts.splice(1, 0, [label, () => { const ls = mkKitLvs(KIT.nghe).slice().reverse(); return ngPick(ls.length ? ls : ngLvs(MK.lv), 1).flatMap(ngQs); }]); };
  add('a2', 'Phần 2: nghe điền thông tin'); add('b1', 'Phần 3: nghe điền thông tin'); add('b2', 'Phần 2: nghe điền câu'); add('c1', 'Phần 2: nghe điền câu'); add('c2', 'Phần 2: nghe điền câu'); }

// ---------- màn luyện ----------
function ngBox(lv) { if (LEVELS.indexOf(lv) < LEVELS.indexOf('a2')) return ''; const R = ngRuns();
  return `<div class="box"><div class="row"><b>🎧 Nghe kiểu đề thật</b><span class="mute">${Object.keys(R.nf).length ? `điền ${Object.keys(R.nf).length} bài` : ''}${R.sh.length ? ` · nhại ${R.sh.length} câu` : ''}</span></div>
    <p class="mute" style="margin:6px 0">📝 Nghe điền thông tin (số, giờ, tên, từ khoá) như đề. 🗣 Nhại theo giọng tự nhiên: máy đo khớp từ và nhịp nói.</p>
    <div class="duo"><button class="big2" data-ng="nf|${lv}">📝 Nghe điền<small>phiếu ghi chú</small></button><button class="big2" data-ng="sh|${lv}">🗣 Nhại theo<small>5 câu, đo nhịp</small></button></div></div>`; }
async function ngStart(k, lv) { $app.innerHTML = '<p class="mute">Đang tải…</p>'; await kLoad(KIT.nghe); if (!NCLIPS.size) try { NCLIPS = new Set(await (await fetch('n/index.json?v=' + APP_V)).json()); } catch (e) {}
  return k === 'nf' ? ngFill(lv) : ngShadow(lv); }
function ngFill(lv) { const x = ngPick(ngLvs(lv), 1)[0]; if (!x) return toast('Chưa có bài nghe hợp dạng này.'), overview(lv);
  const qs = ngQs(x), ans = []; let plays = 0; EXAM_VOX = true; window.CUR = { view: 'nghe-dien', item: x.id };
  const left = () => K_PLAYS - plays, play = () => { if (left() <= 0) return; plays++; kPlay(qs[0].play); draw(); };
  const draw = () => { const G = ngForm(x); $app.innerHTML = `<div class="row top"><button class="link" data-a="back">← Thôi</button><span class="uname">📝 ${esc(LVN[x.lv])} · ${esc(x.tvi)}</span></div>
    <p class="mute">Nghe tối đa ${K_PLAYS} lần như đề thật. Đọc phiếu trước khi nghe. Số viết bằng chữ số cũng được.</p><button class="pri" data-a="play" ${left() <= 0 ? 'disabled' : ''}>🔊 ${plays ? 'Nghe lại' : 'Nghe'} (còn ${left()} lần)</button>
    <form id="nf" autocomplete="off">${G.map((g, i) => `<p style="margin:10px 0 2px;font-size:16px;line-height:1.5">${i + 1}. ${ngBlank(g.s, g.t, `<b>(${i + 1})</b> ______`)}</p><input data-nf="${i}" autocapitalize="off" autocorrect="off" spellcheck="false" aria-label="Chỗ ${i + 1}" value="${esc(ans[i] || '')}">`).join('')}
    <button class="pri" type="submit" style="margin-top:10px">Nộp phiếu</button></form>`;
    $app.querySelectorAll('[data-nf]').forEach(el => el.oninput = () => { ans[+el.dataset.nf] = el.value; });
    document.getElementById('nf').onsubmit = e => { e.preventDefault(); done(); }; };
  const done = () => { EXAM_VOX = false; const r = qs.map((q, i) => ({ q, v: ans[i] || '', ok: !!(ans[i] || '').trim() && q.check(ans[i]).ok })), ok = r.filter(y => y.ok).length;
    ngRuns().nf[x.id] = { at: Date.now(), ok, n: r.length }; S.t = Date.now(); save();
    $app.innerHTML = `<h1>📝 ${ok}/${r.length} chỗ đúng</h1><div class="box">${r.map((y, i) => `<p style="margin:6px 0">${y.ok ? '✅' : '❌'} (${i + 1}) bạn: ${esc(y.v || '…')} · đáp án: <b>${esc(y.q.a)}</b></p>`).join('')}</div>
      <details class="box"><summary>Xem bài nghe</summary><p class="tdtap" style="white-space:pre-line">${kScript(x)}</p></details>
      <p class="mute">Sai chính tả cũng mất điểm trong đề thật. Nghe lại bài, dò từng chỗ sai.</p><button class="pri" data-a="again">▶ Bài khác</button><button data-a="back">← Tổng quan</button>`; scrollTo(0, 0); };
  $app.onclick = e => { if (e.target.closest('[data-a="back"]')) { EXAM_VOX = false; return overview(lv); } if (e.target.closest('[data-a="play"]')) return play(); if (e.target.closest('[data-a="again"]')) return ngFill(lv); };
  draw(); }
// 🗣 nhại theo: câu 6–16 từ có giọng tự nhiên; khớp từ ≥ 80% và nhịp ≤ 1,3 lần giọng mẫu thì đạt
const NG_SH = { n: 5, match: 0.8, pace: 1.3 };
function ngShadow(lv) { const ls = ngLvs(lv), pool = (KIT.nghe.items || []).filter(x => ls.slice(0, 2).includes(x.lv)).flatMap(x => kSents(x.text).filter(s => { const n = kWords(s).length; return n >= 6 && n <= 16 && NCLIPS.has(clipKey(s)); }).map(s => ({ x, s })));
  const its = shuf(pool).slice(0, NG_SH.n), res = []; let i = 0; if (!its.length) return toast('Chưa có câu có giọng tự nhiên cho cấp này.'), overview(lv);
  const show = () => { if (i >= its.length) return end(); const { x, s } = its[i]; let clip = 0, tFirst = 0, tLast = 0; window.CUR = { view: 'nhai-theo', item: x.id + ':' + i, prompt: s };
    $app.innerHTML = `<div class="row top"><button class="link" data-a="back">← Thôi</button><span class="uname">🗣 Nhại theo ${i + 1}/${its.length}</span></div>
      <p class="mute">1) Nghe câu mẫu. 2) Bấm 🎙 và nói lại ngay, cùng nhịp, cùng chỗ nhấn. Nghe bao nhiêu lần cũng được.</p>
      <div class="box"><p class="q" style="margin:0">${esc(s)}</p></div><button data-a="hear">🔊 Nghe câu mẫu</button>
      ${SREC ? `<button class="pri" data-a="rec">🎙 Nói lại</button><p class="mute" id="kheard"></p>` : `<p class="mute">Trình duyệt này không chép được lời: mở bằng Safari trên iPhone để máy đo. Vẫn nghe và nói theo được.</p><button class="pri" data-a="skip">Tiếp ›</button>`}<div id="shr"></div>`;
    const hear = async () => { const t0 = Date.now(); EXAM_VOX = true; await sayOne(s); EXAM_VOX = false; const d = (AUD && isFinite(AUD.duration) && AUD.duration > 0) ? AUD.duration * 1000 : Date.now() - t0; if (d > 300) clip = d; };
    $app.onclick = e => { if (e.target.closest('[data-a="back"]')) { kAsrStop(); return overview(lv); } if (e.target.closest('[data-a="hear"]')) return hear(); if (e.target.closest('[data-a="skip"], [data-a="next"]')) { i++; return show(); } if (e.target.closest('[data-a="redo"]')) { res.pop(); return show(); }
      const b = e.target.closest('[data-a="rec"]'); if (!b) return;
      if (K_ASR.on) { b.disabled = true; b.textContent = '⏳ Đang chấm…'; return kAsrStop(txt => { const m = kMatch(s, txt), dur = tFirst ? tLast - tFirst + 400 : 0, ref = clip || kWords(s).length * 380, pace = dur ? dur / ref : null;
        const ok = m >= NG_SH.match && pace != null && pace <= NG_SH.pace; res.push({ s, txt, m, pace, ok });
        document.getElementById('shr').innerHTML = `<div class="box"><b>${ok ? '✅ Đạt' : '🔁 Thử lại được'}</b><p style="margin:4px 0">Khớp ${Math.round(m * 100)}% từ (cần ${NG_SH.match * 100}%) · nhịp ${pace == null ? '–' : pace.toFixed(1).replace('.', ',') + ' lần'} thời gian giọng mẫu (cần ≤ ${String(NG_SH.pace).replace('.', ',')})</p>
          <p class="mute" style="margin:0">Máy nghe: “${esc(txt || '…')}”. Nhịp đo từ lúc máy nghe được chữ đầu tới chữ cuối: ước lượng.</p></div><button class="pri" data-a="next">Tiếp ›</button><button data-a="redo">🔁 Nói lại câu này</button>`;
        b.remove(); }); }
      b.textContent = '⏹ Dừng'; kAsrStart(txt => { const now = Date.now(); if (txt && !tFirst) tFirst = now; if (txt) tLast = now; const h = document.getElementById('kheard'); if (h) h.textContent = txt || '…'; }); };
    hear(); };
  const end = () => { const R = ngRuns(); for (const r of res) R.sh.push({ at: Date.now(), lv, m: Math.round(r.m * 100), p: r.pace == null ? null : Math.round(r.pace * 100) / 100 }); if (R.sh.length > 500) R.sh.splice(0, R.sh.length - 500); S.t = Date.now(); save();
    const ok = res.filter(r => r.ok).length;
    $app.innerHTML = `<h1>🗣 ${ok}/${res.length || its.length} câu đạt</h1>${res.length ? `<div class="box">${res.map(r => `<p style="margin:6px 0">${r.ok ? '✅' : '🔁'} ${esc(r.s)}<br><span class="mute">khớp ${Math.round(r.m * 100)}% · nhịp ${r.pace == null ? '–' : r.pace.toFixed(1).replace('.', ',')}</span></p>`).join('')}</div>` : ''}
      <p class="mute">Nhại theo mỗi ngày 5–10 phút giúp nghe nhanh hơn và nói trôi hơn. Nhịp càng gần 1,0 càng giống người bản xứ.</p><button class="pri" data-a="again">▶ 5 câu khác</button><button data-a="back">← Tổng quan</button>`;
    $app.onclick = e => { if (e.target.closest('[data-a="again"]')) return ngShadow(lv); if (e.target.closest('[data-a="back"]')) return overview(lv); }; scrollTo(0, 0); };
  show(); }
document.addEventListener('click', e => { const b = e.target.closest('[data-ng]'); if (!b) return; const [k, lv] = b.dataset.ng.split('|'); ngStart(k, lv); });
