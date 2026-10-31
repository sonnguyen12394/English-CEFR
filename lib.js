// 📚 Bù 4 (28/10/2026): thư viện đọc mở rộng ngay trong app. Đề B1 → C2 đòi đọc nhanh văn bản thật; bài trong app chỉ ≈ một đề mỗi cấp.
// 23 truyện công cộng (Project Gutenberg, hết bản quyền ở Mỹ; lib/ dựng bằng tools/build-lib.mjs), ~108.000 từ, chia trang ~300 từ.
// Chạm một từ để tra (từ điển của app; không có thì mở Cambridge Dictionary). Thời gian đọc thật (trang đang mở, có thao tác trong 2 phút) tự ghi vào 📚 Đọc nghe thêm (S.ext).
// Không tính vào 📘 Học / 🔁 Nhớ / Thi chuyển cấp.
let LIB = null; const LIBC = {}, LIBT = { id: null, lv: null, sec: 0, act: 0, tick: 0 };
const libLoad = async () => LIB || (LIB = await (await fetch('lib/index.json?v=' + APP_V)).json());
const libBook = async id => LIBC[id] || (LIBC[id] = await (await fetch(`lib/${id}.json?v=` + APP_V)).json());
const libRuns = () => (S.lib = S.lib || {});
const libBase = lv => ({ a2p: 'a2', b1p: 'b1', b2p: 'b2' }[lv] || lv);
const LIB_LV = ['b1', 'b2', 'c1', 'c2'];
function libBox(lv) { if (LEVELS.indexOf(lv) < LEVELS.indexOf('a2p')) return ''; const R = libRuns(), n = Object.values(R).filter(r => r.done).length, m = Math.round(extLog().filter(e => e.src === 'lib').reduce((s, e) => s + e.min, 0));
  return `<div class="box"><div class="row"><b>📚 Thư viện đọc</b><span class="mute">${n ? `đọc xong ${n} truyện · ` : ''}${m ? `${m} phút` : ''}</span></div><p class="mute" style="margin:6px 0">23 truyện tiếng Anh nguyên bản (Andersen, Wilde, O. Henry, Sherlock Holmes, Chekhov, Austen…). Chạm từ để tra. Giờ đọc tự ghi vào 📚 Đọc nghe thêm.</p><button data-lib="${lv}">📚 Mở thư viện</button></div>`; }
async function libView(lv) { libStop(); window.CUR = { view: 'thu-vien', item: lv }; $app.innerHTML = '<p class="mute">Đang tải…</p>';
  try { await libLoad(); } catch (e) { $app.innerHTML = `${backRow('📚 Thư viện')}<p>Không tải được. Thử lại sau.</p>`; $app.onclick = e => { if (e.target.closest('[data-a="home"]')) overview(lv); }; return; }
  const R = libRuns(), b = libBase(lv), me = LIB_LV.includes(b) ? b : 'b1', k = LIB_LV.indexOf(me), cov = x => x.cov[me] != null ? x.cov[me] : x.cov.c2;
  const card = x => { const r = R[x.id] || {}; return `<button class="box" data-lb="${x.id}" style="width:100%;text-align:left;display:block"><div class="row"><b>${esc(x.title)}</b><span class="lvtag ${x.lv}">${LVN[x.lv]}</span></div>
    <p class="mute" style="margin:4px 0 0">${esc(x.author)} · ${esc(x.vi)}</p><p class="mute" style="margin:4px 0 0">${x.words.toLocaleString('vi-VN')} từ · ${x.pages} trang · ~${Math.max(1, Math.round(x.words / 120))} phút · ${String(cov(x)).replace(".", ",")}% từ có trong app tới ${LVN[me]}${r.p ? ` · ${r.done ? '✅ đọc xong' : `đang ở trang ${r.p + 1}`}` : ''}</p></button>`; };
  const grp = (t, xs) => xs.length ? `<h2>${t}</h2>${xs.map(card).join('')}` : '';
  $app.innerHTML = `${backRow('📚 Thư viện')}<h1>📚 Thư viện đọc</h1>
    <p class="mute">Truyện nguyên bản (không rút gọn), tiếng Anh cổ hơn tiếng Anh ngày nay một chút. Cách đọc: đọc nhanh cho hiểu ý, chỉ chạm tra từ khi mất mạch. Đọc thấy dưới 2 từ lạ mỗi dòng là vừa sức.</p>
    ${grp('🌱 Đọc rộng: vừa sức (≥ 95% từ có trong app tới cấp của bạn)', LIB.books.filter(x => cov(x) >= 95 && x.lv !== me))}${grp(`Hợp cấp ${LVN[me]}`, LIB.books.filter(x => x.lv === me))}${grp('Dễ hơn (đọc nhanh, luyện tốc độ)', LIB.books.filter(x => LIB_LV.indexOf(x.lv) < k && cov(x) < 95))}${grp('Khó hơn (đọc thử)', LIB.books.filter(x => LIB_LV.indexOf(x.lv) > k && cov(x) < 95))}
    <p class="mute">Nguồn: Project Gutenberg (truyện hết bản quyền ở Mỹ). Cấp gợi ý theo thói quen chọn sách của giáo viên; % từ đo bằng danh sách từ của app.</p>`;
  $app.onclick = e => { if (e.target.closest('[data-a="home"]')) return overview(lv); const c = e.target.closest('[data-lb]'); if (c) libRead(lv, c.dataset.lb, (R[c.dataset.lb] || {}).done ? 0 : (R[c.dataset.lb] || {}).p || 0); }; }
// ⏱ giờ đọc thật: mỗi 15 giây, nếu trang đang hiện và có thao tác (chạm, cuộn, lật trang) trong 2 phút qua thì cộng 15 giây
function libStart(lv, id) { if (LIBT.id !== id) libStop(); Object.assign(LIBT, { id, lv, act: Date.now() }); if (!LIBT.tick) LIBT.tick = setInterval(() => {
  if (!document.getElementById('libp')) return libStop(); if (document.visibilityState !== 'hidden' && Date.now() - LIBT.act < 120000) LIBT.sec += 15; if (LIBT.sec >= 300) libFlush(); }, 15000); }
function libFlush() { const min = Math.floor(LIBT.sec / 60); if (!min || !LIBT.id) return; LIBT.sec -= min * 60; extLog().push({ at: Date.now(), lv: LIBT.lv, kind: 'doc', min, src: 'lib', id: LIBT.id }); S.t = Date.now(); save(); }
function libStop() { clearInterval(LIBT.tick); LIBT.tick = 0; libFlush(); LIBT.sec = 0; LIBT.id = null; }
// tra từ: danh sách từ của app + từ chỉ tra; bỏ đuôi -s / -ed / -ing / -er / -est / -ly
let LIBW = null;
const libDict = () => { if (LIBW) return LIBW; LIBW = {}; for (const w of [...WORDS, ...(REF || [])]) { const k = w.w.toLowerCase(); if (!LIBW[k]) LIBW[k] = w; if (w.irr) for (const f of w.irr.f) for (const x of f[1]) if (!LIBW[x.toLowerCase()]) LIBW[x.toLowerCase()] = w; } return LIBW; };
const libFind = t => { const D = libDict(); t = t.toLowerCase().replace(/[’]/g, "'").replace(/'s$/, '');
  for (const x of [t, t.replace(/s$/, ''), t.replace(/es$/, ''), t.replace(/ies$/, 'y'), t.replace(/ed$/, ''), t.replace(/ed$/, 'e'), t.replace(/d$/, ''), t.replace(/ing$/, ''), t.replace(/ing$/, 'e'), t.replace(/(.)\1(ing|ed)$/, '$1'), t.replace(/ily$/, 'y'), t.replace(/ly$/, ''), t.replace(/ier$/, 'y'), t.replace(/iest$/, 'y'), t.replace(/er$/, ''), t.replace(/est$/, '')]) if (D[x]) return D[x]; return null; };
const libPara = p => esc(p).replace(/[A-Za-z][A-Za-z'’]*/g, m => `<span data-lw>${m}</span>`);
async function libRead(lv, id, p) { $app.innerHTML = '<p class="mute">Đang tải truyện…</p>'; let B; try { B = await libBook(id); if (!REF) await loadRef().catch(() => {}); } catch (e) { toast('Không tải được truyện.'); return libView(lv); }
  p = Math.max(0, Math.min(p, B.pages.length - 1)); const R = libRuns(), r = R[id] = R[id] || {}; r.p = p; r.at = Date.now(); if (p === B.pages.length - 1) r.done = true; S.t = Date.now(); save();
  window.CUR = { view: 'thu-vien-doc', item: id + ':' + p }; libStart(lv, id); LIBT.act = Date.now();
  $app.innerHTML = `<div class="row top"><button class="link" data-a="back">← Thư viện</button><span class="uname">${esc(B.title)} · ${p + 1}/${B.pages.length}</span></div>${bar(Math.round((p + 1) / B.pages.length * 100), 100, 'var(--accent)')}
    ${typeof kCoverTxt === 'function' ? kCoverTxt(B.pages[p].join(' ')).replace('của bài', 'của trang này') : ''}<div id="libp" style="font-size:18px;line-height:1.7">${B.pages[p].map(x => `<p>${libPara(x)}</p>`).join('')}</div>
    <div class="duo">${p ? '<button data-a="prev">‹ Trang trước</button>' : '<span></span>'}${p < B.pages.length - 1 ? '<button class="pri" data-a="next">Trang sau ›</button>' : '<button class="pri" data-a="back">✅ Hết truyện</button>'}</div>
    <p class="mute">${esc(B.author)} · Project Gutenberg. Chạm một từ để tra.</p><div id="libw" style="position:fixed;left:12px;right:12px;bottom:calc(84px + env(safe-area-inset-bottom));max-width:536px;margin:0 auto;z-index:25" hidden></div>`;
  scrollTo(0, 0);
  $app.onclick = e => { LIBT.act = Date.now(); const pop = document.getElementById('libw');
    if (e.target.closest('[data-a="back"]')) { libStop(); return libView(lv); } if (e.target.closest('[data-a="prev"]')) return libRead(lv, id, p - 1); if (e.target.closest('[data-a="next"]')) return libRead(lv, id, p + 1);
    if (e.target.closest('[data-lsay]')) return speak(e.target.closest('[data-lsay]').dataset.lsay); if (e.target.closest('[data-lx]')) { pop.hidden = true; return; }
    const s = e.target.closest('[data-lw]'); if (!s) { if (!e.target.closest('#libw')) pop.hidden = true; return; } const t = s.textContent, w = libFind(t); if (w && typeof mfLookup === 'function') mfLookup(w);   // v76: tra từ = chưa nhớ (nhanh.js)
    pop.innerHTML = `<div class="box" style="box-shadow:0 4px 16px rgba(0,0,0,.25);margin:0"><div class="row"><b style="font-size:20px">${esc(w ? w.w : t)}</b><button class="link" data-lx>✕</button></div>
      ${w ? `<p style="margin:4px 0"><span class="lvtag ${lvw(w)}">${LVN[lvw(w)]}</span> <span class="mute">${esc(w.ipa || '')} ${esc(w.pos || '')}</span><br>${esc(w.vi)}</p>` : '<p class="mute" style="margin:4px 0">Từ này chưa có trong từ điển app (từ cổ, tên riêng hoặc từ hiếm).</p>'}
      <div class="chips"><button class="chip" data-lsay="${esc(w ? w.w : t)}">🔊 Nghe</button><a class="chip" href="https://dictionary.cambridge.org/dictionary/english-vietnamese/${encodeURIComponent((w ? w.w : t).toLowerCase())}" target="_blank" rel="noopener">Cambridge Dictionary</a></div></div>`;
    pop.hidden = false; }; }
document.addEventListener('click', e => { const b = e.target.closest('[data-lib]'); if (b) libView(b.dataset.lib); });
addEventListener('scroll', () => { if (LIBT.id) LIBT.act = Date.now(); }, { passive: true });
