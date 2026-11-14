// v177 🎉 Chinh phục đề hấp dẫn hơn (specs/020-game-hap-dan; người sáng lập 14/11/2026: "bao nhiêu tiêu chí để đánh giá 1 game hấp dẫn, dựa vào bộ tiêu chí ấy làm game cho hấp dẫn hơn đi",
//   rồi "tự tính làm"). Bộ 10 tiêu chí gộp từ GameFlow (Sweetser & Wyeth 2005) + PENS (Ryan, Rigby & Przybylski 2006): chỗ yếu là thấy mình giỏi lên, đắm chìm,
//   thưởng bất ngờ, lý do quay lại mỗi ngày. Hướng A (Claude chọn): ① 🏘 làng trên đảo lớn dần theo ⭐ thật / 🌳 (suy từ tiến độ, không lưu thêm) ·
//   ② 📜 3 nhiệm vụ mỗi ngày (chốt lúc mở game đầu ngày, theo việc có thể làm) → 🎁 rương 1 lần / ngày: đồ trang trí đảo, độ hiếm thường / hiếm / quý ·
//   ③ 🏅 huy hiệu dạng câu (🐉 Boss ẩn đúng ≥ 2 lần, lần cuối đúng) · ④ 3 câu hỏi nhanh sau 5 trận (đo E3, gửi về như góp ý).
// Luật: chỉ thưởng việc học (hạ quái, vun / cứu cây, xác nhận, Boss ẩn, thắng Boss); không thưởng chơi nhanh; không phạt khi bỏ ngày.
// Dữ liệu (S.to.tc): qd { d, q: [mã], n: { mã: cần }, c: { mã: đã làm }, r: đã mở rương } · kho [[emoji, độ hiếm, lúc]] · ks { at, a: [3 số] } · ksno (ngày hoãn).
const TG_LANG = [[10, '⛺', 'Lều'], [25, '🏠', 'Nhà'], [40, '🌾', 'Ruộng'], [55, '🌉', 'Cầu'], [70, '🏫', 'Trường'], [85, '🏰', 'Lâu đài'], [100, '🗼', 'Tháp canh']];
const TG_LANGH = [[20, '⛲', 'Đài phun nước'], [50, '🎡', 'Vòng quay'], [80, '🏟', 'Đấu trường']];
const TG_QK = { quai: ['👾', 'Hạ {n} quái', 2], xac: ['✅', 'Xác nhận {n} câu 🌿', 2], win: ['⚔️', 'Hạ {n} Boss', 1], cuu: ['🐛', 'Cứu {n} cây', 2], an: ['🐉', 'Hạ {n} Boss ẩn', 1], cay: ['🌱', 'Vun {n} cây lớn', 3] };
const TG_RUONG = { t: ['Thường', ['🌸', '🌻', '🍄', '🌴', '🪨', '🐚', '🦋', '🐞', '🌵', '🍀']], h: ['Hiếm', ['⛵', '🦜', '🐢', '🎏', '🏮', '🦩', '🐬', '🪁']], q: ['Quý', ['🌈', '🦄', '🐉', '💎', '🎆', '👑']] };
const tgDayHash = (d, s) => { let h = d * 31; for (const ch of String(s)) h = (h * 33 + ch.charCodeAt(0)) >>> 0; return h; };
// việc có thể làm hôm nay (đếm trên mọi đề trừ đề đối chứng; đề đang chơi trước)
function tgQAvail(L) { const T = tgSt(); return { quai: L.filter(c => c.st === 'sai').length, xac: L.filter(c => c.xac).length, win: L.some(c => c.st === 'chua') || (typeof tgTd === 'function' && tgTd(tgDe(), L)) ? 1 : 0,
  cuu: L.filter(c => c.due).length, an: (T.bq || []).length ? 1 : 0, cay: L.filter(c => c.st === 'ok' && !c.tam && !c.hi && c.ks.length).length }; }
// chốt nhiệm vụ lúc mở game đầu ngày: ưu tiên việc có thể làm, mỗi ngày đổi thứ tự (nhiệm vụ không ép làm việc không có)
function tgQuests(L) { const T = tgSt(), d = tgDay(); if (T.qd && T.qd.d === d) return T.qd;
  const av = tgQAvail(L), ks = Object.keys(TG_QK).filter(k => av[k] > 0).sort((a, b) => tgDayHash(d, a) % 97 - tgDayHash(d, b) % 97).slice(0, 3);
  T.qd = { d, q: ks, n: Object.fromEntries(ks.map(k => [k, Math.max(1, Math.min(TG_QK[k][2], av[k]))])), c: {}, r: 0 }; save(); return T.qd; }
// sự kiện học (trochoi.js gọi): đếm nhiệm vụ ngày
function tgEv(k, n) { const T = tgSt(), Q = T.qd; if (!Q || Q.d !== tgDay() || !Q.q.includes(k)) return; const was = (Q.c[k] || 0) >= Q.n[k]; Q.c[k] = (Q.c[k] || 0) + (n || 1);
  if (!was && Q.c[k] >= Q.n[k]) { try { toast(`📜 Xong nhiệm vụ: ${TG_QK[k][1].replace('{n}', Q.n[k])}`); } catch (e) {} } }
const tgQDone = Q => Q && Q.q.length && Q.q.every(k => (Q.c[k] || 0) >= Q.n[k]);
// làng: công trình mở theo ⭐ thật (C.ok) và 🌳 (C.hi) của đề đang chơi
function tgLang(C) { const A = TG_LANG.map(([n, e, t]) => ({ e, t, ok: C.ok >= n, need: n - C.ok, u: '⭐' })), B = TG_LANGH.map(([n, e, t]) => ({ e, t, ok: C.hi >= n, need: n - C.hi, u: '🌳' }));
  const all = [...A, ...B], nx = [...A.filter(x => !x.ok)][0] || B.filter(x => !x.ok)[0];
  return `<div class="tglang" aria-label="Làng trên đảo">${all.map(x => `<span class="${x.ok ? 'on' : 'off'}" title="${esc(x.t)}">${x.e}</span>`).join('')}</div>
    <p class="mute" style="margin:2px 0 0;font-size:14px">🏘 Làng: ${all.filter(x => x.ok).length}/${all.length} công trình${nx ? ` · ${nx.e} ${esc(nx.t)} còn ${nx.need} ${nx.u}` : ' · làng đã xây xong 🎉'}</p>`; }
const tgDeco = () => { const K = tgSt().kho || []; return K.length ? `<p style="margin:6px 0 0;font-size:22px;letter-spacing:2px" aria-label="Đồ trang trí">${K.slice(-24).map(x => x[0]).join('')}</p>` : ''; };
// huy hiệu dạng câu: Boss ẩn đúng ≥ 2 lần, lần cuối đúng
const tgBadges = () => Object.entries(tgSt().dg || {}).filter(([, g]) => g[1] >= 2 && g[3]).map(([d]) => d);
function tgVuiBox(L) { const T = tgSt(), Q = tgQuests(L), done = tgQDone(Q), out = [];
  if (Q.q.length) out.push(`<div class="box"><div class="row" style="justify-content:space-between;gap:8px"><b>📜 Nhiệm vụ hôm nay</b><span class="mute">${Q.q.filter(k => (Q.c[k] || 0) >= Q.n[k]).length}/${Q.q.length}</span></div>
    ${Q.q.map(k => { const c = Math.min(Q.c[k] || 0, Q.n[k]), ok = c >= Q.n[k]; return `<p style="margin:6px 0 0">${ok ? '✓' : TG_QK[k][0]} ${TG_QK[k][1].replace('{n}', Q.n[k])} <span class="mute">· ${c}/${Q.n[k]}</span></p>`; }).join('')}
    ${done && !Q.r ? `<button class="pri" data-tgru style="margin-top:8px">🎁 Mở rương</button>` : done ? '<p class="mute" style="margin:6px 0 0">🎁 Đã mở rương hôm nay. Mai có nhiệm vụ mới.</p>' : '<p class="mute" style="margin:6px 0 0;font-size:14px">Xong 3 việc thì mở 🎁 rương: đồ trang trí cho đảo.</p>'}</div>`);
  return out.join(''); }
// ô 3 câu hỏi: sau 5 trận xong, một lần (hoãn được trong ngày); đặt dưới đảo
const tgKsSlot = () => { const T = tgSt(), nn = (T.tr || []).filter(r => r[3]).length; return !T.ks && nn >= 5 && T.ksno !== tgDay() ? tgKsBox() : ''; };
// 3 câu hỏi nhanh (rút từ PENS: thấy mình giỏi lên · được tự chọn · muốn chơi tiếp); gửi về như góp ý
const TG_KSQ = ['Chơi xong, bạn thấy mình làm đề giỏi lên?', 'Bạn thấy được tự chọn cách chơi?', 'Mai bạn muốn chơi tiếp?'];
let TG_KSA = [0, 0, 0];
const tgKsBox = () => `<div class="box"><b>💬 3 câu hỏi nhanh · 30 giây</b><p class="mute" style="margin:4px 0">1 = không hề · 5 = rất đúng. Giúp Claude biết game có hay không.</p>
  ${TG_KSQ.map((q, i) => `<p style="margin:8px 0 4px">${q}</p><div class="chips tap">${[1, 2, 3, 4, 5].map(v => `<button class="chip${TG_KSA[i] === v ? ' on' : ''}" data-tgks="${i}:${v}" aria-pressed="${TG_KSA[i] === v}">${v}</button>`).join('')}</div>`).join('')}
  <div class="row" style="gap:8px;margin-top:8px"><button class="pri" data-tgks="gui"${TG_KSA.every(Boolean) ? '' : ' disabled'}>Gửi</button><button class="link tap" data-tgks="sau" style="white-space:nowrap">Để sau</button></div></div>`;
async function tgKsSend() { const T = tgSt(); T.ks = { at: Date.now(), a: [...TG_KSA] }; save();
  const it = { id: Math.random().toString(36).slice(2, 12), kind: 'khac', txt: `🗺 Chinh phục đề · 3 câu hỏi: giỏi lên ${TG_KSA[0]} · tự chọn ${TG_KSA[1]} · chơi tiếp ${TG_KSA[2]} (1–5)`, ctx: { view: 'tgks', a: [...TG_KSA] }, imgs: [], t: Date.now() };
  if (typeof gyLS === 'function' && typeof GY_LS !== 'undefined') { const q = gyLS(GY_LS); q.push(it); gyLS(GY_LS, q); try { await gyFlush(); } catch (e) {} } }
function tgOpenChest() { const T = tgSt(), Q = T.qd; if (!tgQDone(Q) || Q.r) return null; const x = Math.random(), r = x < 0.05 ? 'q' : x < 0.3 ? 'h' : 't', K = T.kho = T.kho || [], have = new Set(K.map(k => k[0]));
  const pool = TG_RUONG[r][1], fresh = pool.filter(e => !have.has(e)), e = (fresh.length ? fresh : pool)[Math.floor(Math.random() * (fresh.length || pool.length))];
  K.push([e, r, Date.now()]); Q.r = 1; save(); return { e, r }; }
// true = đã xử lý
function tgVuiClick(e) { const g = s => e.target.closest(s);
  if (g('[data-tgru]')) { const w = tgOpenChest(); if (!w) return true; tgSfx(w.r === 'q' ? 'win' : 'grow');
    tgEndView(`🎁 Rương ${TG_RUONG[w.r][0].toLowerCase()}!`, `${w.r !== 't' && tgFx() ? tgConf() : ''}<div class="box tgyes" style="text-align:center"><p style="font-size:64px;margin:6px 0">${w.e}</p><p style="margin:0"><b>${TG_RUONG[w.r][0]}</b> · đã đặt lên đảo của bạn.</p></div>`); return true; }
  const k = g('[data-tgks]'); if (!k) return false; const v = k.dataset.tgks, T = tgSt();
  if (v === 'sau') { T.ksno = tgDay(); save(); tgView(); return true; }
  if (v === 'gui') { if (TG_KSA.every(Boolean)) { tgKsSend(); try { toast('Cảm ơn bạn ✓'); } catch (er) {} tgView(); } return true; }
  const [i, n] = v.split(':').map(Number); TG_KSA[i] = n;   // đổi tại chỗ, không vẽ lại cả màn (giữ chỗ cuộn)
  for (const x of document.querySelectorAll('[data-tgks^="' + i + ':"]')) { const on = x.dataset.tgks === v; x.classList.toggle('on', on); x.setAttribute('aria-pressed', on); }
  const gb = document.querySelector('[data-tgks="gui"]'); if (gb) gb.disabled = !TG_KSA.every(Boolean); return true; }
// bộ sưu tập (gập): huy hiệu dạng câu + đồ trang trí + Boss đã hạ
function tgSuuTap() { const T = tgSt(), B = tgBadges(), K = T.kho || [], w = ((T.st || {}).boss || {}).win || 0;
  return `<details class="more"><summary>🏅 Bộ sưu tập · ${B.length} huy hiệu · ${K.length} đồ trang trí</summary>
    <p style="margin:6px 0">⚔️ Boss đã hạ: ${w}</p>
    <p style="margin:6px 0 2px"><b>🏅 Huy hiệu dạng câu</b> <span class="mute">(🐉 Boss ẩn đúng 2 lần)</span></p>${B.length ? B.map(d => `<p style="margin:2px 0">🏅 Bậc thầy ${esc(tgDangName(d))}</p>`).join('') : '<p class="mute" style="margin:2px 0">Chưa có. Vun cây thành 🌳 để gặp Boss ẩn.</p>'}
    <p style="margin:8px 0 2px"><b>🎁 Đồ trang trí</b></p>${K.length ? `<p style="margin:2px 0;font-size:22px">${K.map(x => x[0]).join(' ')}</p>` : '<p class="mute" style="margin:2px 0">Chưa có. Xong 3 nhiệm vụ ngày để mở rương.</p>'}</details>`; }
