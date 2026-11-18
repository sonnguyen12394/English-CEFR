// 🏙 Khu phố + 🌙 Đêm ở Khu phố (specs/021-dem-khu-pho, v202). Người sáng lập 17/11/2026: "theo gameplay và cách thiết kế như trong goose duck mà làm lại",
//   "làm sao khiến game play cho tôi wow", rồi chọn: bản đồ THAY màn Thành phố, câu trong đêm GHI kết quả như phố.
// Chỉ mượn cơ chế chung của thể loại tìm kẻ giả mạo (vai bí mật, việc chung, tầm nhìn hẹp, báo / chuông, họp, bỏ phiếu, phá hoại);
//   tên, hình, bản đồ, tiếng tự làm. Ngày: chạm nhà → Mầm đi tới → thẻ phố → Vào phố. Đêm: 5 việc = câu thật của đề đang chọn ở nhà phố của câu.
// Ghi: câu đề đúng → ⭐ Chinh phục đề (tgJ) + lịch ôn phố (khoá de:<đề>:<n>, khuôn phMark); sai → hẹn ngày mai. Không đổi luật đo, không ghi đề thử / bản đồ / thẻ Nền.
const KP_VB = { w: 300, h: 400 };
const KP_POS = { loai: [50, 124], cau: [250, 124], dong: [42, 228], dai: [258, 228], cho: [52, 330], ben: [248, 330], ghep: [108, 374], ctr: [192, 374] };
const KP_SHORT = { loai: 'Loại Từ', cau: 'Cầu Nối', dong: 'Động Từ', dai: 'Đại Từ', cho: 'Chợ Từ Vựng', ben: 'Bến Dò Tin', ghep: 'Ghép Đoạn', ctr: 'Cấu Trúc' };
const KP_ROOF = { loai: '#c9604a', cau: '#4a78c4', dong: '#c99a30', dai: '#3f9a8c', cho: '#b8507c', ben: '#3b7fa6', ghep: '#7a9a3a', ctr: '#7c5cc0' };
const KP_TASK = { loai: 'Xếp lại ghế cho đúng người', cau: 'Nối lại cây cầu', dong: 'Chỉnh lại đồng hồ', dai: 'Gửi thư cho đúng người', cho: 'Dán đúng nhãn hàng', ben: 'Tìm hàng thất lạc trên tàu', ghep: 'Ghép lại trang thư rơi', ctr: 'Lắp lại tượng cho cân' };
const KP_CASTLE = [150, 52], KP_PLAZA = [150, 228];
const KP_JOBS = 5, KP_PLAYER = 60;   // 5 việc của người học = 60% thanh; cư dân máy làm 40% còn lại
const KP_CHAT = ['Chào Mầm!', 'Việc ở đây xong rồi.', 'Có ai thấy gì lạ không?', 'Đêm nay yên tĩnh quá…', 'Mình đi làm việc tiếp đây.', 'Ai vừa đi ngang qua vậy?'];
// luật dự phòng khi câu đề không sinh được luật (Claude soạn, chưa giáo viên kiểm): [sai, đúng]
const KP_LAW = [['Sau "your" là tính từ.', 'Sau tính từ sở hữu "your" là danh từ.'], ['Sau "despite" là cả một câu.', 'Sau "despite" là cụm danh từ; cả câu thì dùng "although".'],
  ['By the time + quá khứ → thì tiếp diễn.', 'By the time + quá khứ → quá khứ hoàn thành.'], ['"Each of the managers" đi với "have".', '"Each of …" đi với động từ số ít: has.'],
  ['Ta nói "reach a deadline".', 'Cụm cố định là "meet a deadline".'], ['Đuôi "-ful" là trạng từ.', 'Đuôi "-ful" là tính từ; "-ly" mới thường là trạng từ.']];
const kpSt = () => { const o = toSt(), k = o.kp = o.kp || {}; k.bay = k.bay || {}; if (k.snd === undefined) k.snd = 1; if (k.hoc === undefined) k.hoc = 1; return k; };
const kpPst = k => { const o = toSt(); let p; if (k === 'loai') p = o.pho = o.pho || {}; else { o.phos = o.phos || {}; p = o.phos[k] = o.phos[k] || {}; } p.cd = p.cd || {}; p.it = p.it || {}; p.st = p.st || {}; return p; };
const kpPct = ([x, y]) => [x / KP_VB.w * 100, y / KP_VB.h * 100];
const kpDist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
const kpRnd = a => a[Math.floor(Math.random() * a.length)];
const kpMix = a => a.map(v => [Math.random(), v]).sort((x, y) => x[0] - y[0]).map(x => x[1]);
const kpStand = k => { const p = KP_POS[k]; return [p[0], p[1] + 32]; };
const kpRed = () => typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
const kpPhoOf = q => { const p = CY_PHO.find(p => cyC(p) && cyC(p).canFix ? cyC(p).canFix(q) : p.need(q)); return p ? p.k : null; };
const kpName = t => { for (const k in PH_PHO) { const c = PH_PHO[k].CH && PH_PHO[k].CH[t]; if (c && c.name) return c.name; } return t; };

// ---------- âm thanh tự tổng hợp (Web Audio; acFix đánh thức khi quay lại app) ----------
const KA = { c: null };
function kpAc() { if (!kpSt().snd) return null; if (!KA.c || KA.c.state !== 'running') KA.c = acFix(KA.c); return KA.c; }
function kpTone(f, d, type, v, f2, dl) { const c = kpAc(); if (!c) return; try { const t = c.currentTime + (dl || 0), o = c.createOscillator(), g = c.createGain(); o.type = type || 'sine'; o.frequency.setValueAtTime(f, t); if (f2) o.frequency.exponentialRampToValueAtTime(f2, t + d);
  g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(v || .12, t + .012); g.gain.exponentialRampToValueAtTime(.0001, t + d); o.connect(g).connect(c.destination); o.start(t); o.stop(t + d + .05); } catch (e) {} }
function kpNoise(d, v, fq, dl, sw) { const c = kpAc(); if (!c) return; try { const t = c.currentTime + (dl || 0), b = c.createBuffer(1, Math.max(1, c.sampleRate * d | 0), c.sampleRate), a = b.getChannelData(0); for (let i = 0; i < a.length; i++) a[i] = Math.random() * 2 - 1;
  const s = c.createBufferSource(); s.buffer = b; const f = c.createBiquadFilter(); f.type = 'bandpass'; f.frequency.setValueAtTime(fq || 1000, t); if (sw) f.frequency.exponentialRampToValueAtTime(sw, t + d); const g = c.createGain(); g.gain.setValueAtTime(v || .15, t); g.gain.exponentialRampToValueAtTime(.0001, t + d); s.connect(f).connect(g).connect(c.destination); s.start(t); } catch (e) {} }
const KS = {
  step: () => kpNoise(.045, .05, 700), ok: () => [523, 659, 784, 1047].forEach((f, i) => kpTone(f, .2, 'triangle', .12, null, i * .07)),
  no: () => { kpTone(220, .22, 'sawtooth', .07); kpTone(180, .3, 'sawtooth', .07, null, .13); }, wire: () => kpTone(880, .09, 'square', .05, 1320),
  body: () => { kpTone(70, 1.3, 'sine', .4, 38); kpTone(740, .6, 'sawtooth', .07, 700); kpTone(784, .6, 'sawtooth', .05, 740, .06); kpNoise(.5, .18, 260); },
  gong: () => { kpTone(110, 2.4, 'sine', .32); kpTone(220, 1.8, 'sine', .12); kpTone(331, 1.1, 'sine', .06); },
  type: () => kpTone(1100 + Math.random() * 400, .03, 'square', .025), stamp: () => { kpNoise(.09, .28, 500); kpTone(150, .1, 'square', .07); },
  whoosh: () => kpNoise(1.6, .2, 250, 0, 3500), win: () => [523, 659, 784, 1047, 1319, 1568].forEach((f, i) => kpTone(f, .4, 'triangle', .12, null, i * .11)),
  lose: () => [392, 330, 262, 196].forEach((f, i) => kpTone(f, .5, 'sine', .14, null, i * .22)), rustle: () => { kpNoise(.3, .07, 2400); kpNoise(.2, .05, 900, .15); },
  dark: () => kpTone(320, .6, 'sine', .18, 70), siren: () => { kpTone(620, .55, 'sawtooth', .035, 920); kpTone(920, .55, 'sawtooth', .035, 620, .58); },
  light: () => [660, 880, 1320].forEach((f, i) => kpTone(f, .15, 'sine', .1, null, i * .06)), plus: () => kpTone(1320, .12, 'triangle', .08, 1760)
};
const kpBuzz = ms => { try { navigator.vibrate && navigator.vibrate(ms); } catch (e) {} };

// ---------- hình ----------
const KP_ME = `<svg viewBox="0 0 44 52" aria-hidden="true"><ellipse cx="22" cy="49" rx="13" ry="3" fill="rgba(0,0,0,.3)"/><path d="M22 14 C22 6 16 3 10 4 C12 10 16 13 22 14 Z" fill="#5cbf5c"/><path d="M22 14 C22 6 28 2 35 3 C33 10 28 13 22 14 Z" fill="#79d679"/><circle cx="22" cy="30" r="16" fill="#bfe9c6" stroke="#4f9a4a" stroke-width="2"/><circle cx="16.5" cy="29" r="2.5" fill="#1e2a22"/><circle cx="27.5" cy="29" r="2.5" fill="#1e2a22"/><circle cx="17.3" cy="28.2" r=".8" fill="#fff"/><circle cx="28.3" cy="28.2" r=".8" fill="#fff"/><path d="M17 35 Q22 39 27 35" stroke="#1e2a22" stroke-width="2" fill="none" stroke-linecap="round"/></svg>`;
const KP_MASK = `<svg viewBox="0 0 44 56" aria-hidden="true"><circle cx="22" cy="31" r="17" fill="#3b2a66" stroke="#1d1338" stroke-width="2"/><path d="M8 26 Q22 16 36 26 Q34 37 26 34 L22 31 L18 34 Q10 37 8 26 Z" fill="#c9b4ff"/><ellipse cx="15.5" cy="27" rx="3.5" ry="2.4" fill="#1d1338"/><ellipse cx="28.5" cy="27" rx="3.5" ry="2.4" fill="#1d1338"/><path d="M16 42 Q22 45 28 42" stroke="#c9b4ff" stroke-width="2" fill="none" stroke-linecap="round"/></svg>`;
const KP_ZZ = `<svg viewBox="0 0 44 30" aria-hidden="true"><ellipse cx="22" cy="20" rx="17" ry="9" fill="#a9b0bb" stroke="#5c6470" stroke-width="2"/><path d="M13 19 h6 M25 19 h6" stroke="#1e2a22" stroke-width="2.2" stroke-linecap="round"/></svg>`;
const kpHouse = (k, lit) => `<svg viewBox="0 0 80 64" aria-hidden="true"><rect x="10" y="26" width="60" height="34" rx="3" fill="var(--kp-wall)"/><path d="M4 28 L40 4 L76 28 Z" fill="${KP_ROOF[k]}"/>
  <rect x="17" y="34" width="13" height="11" rx="2" fill="${lit ? 'var(--kp-win)' : 'var(--kp-winoff)'}"/><rect x="50" y="34" width="13" height="11" rx="2" fill="${lit ? 'var(--kp-win)' : 'var(--kp-winoff)'}"/><rect x="33" y="40" width="14" height="20" rx="2" fill="#5a3a26"/>
  <text x="40" y="22" text-anchor="middle" font-size="12">${cyC(CY_PHO.find(p => p.k === k)) ? cyC(CY_PHO.find(p => p.k === k)).ic : ''}</text></svg>`;
const KP_CASTLE_SVG = `<svg viewBox="0 0 90 80" aria-hidden="true"><rect x="12" y="24" width="66" height="50" fill="var(--kp-castle)"/><rect x="6" y="14" width="18" height="60" fill="var(--kp-castle)"/><rect x="66" y="14" width="18" height="60" fill="var(--kp-castle)"/>
  <rect x="11" y="30" width="8" height="10" rx="4" fill="var(--kp-win)"/><rect x="71" y="30" width="8" height="10" rx="4" fill="var(--kp-win)"/><path d="M33 74 L33 52 Q45 40 57 52 L57 74 Z" fill="#2b1d14"/><path d="M45 24 L45 4" stroke="#5a4a6a" stroke-width="2"/><path d="M45 4 L58 8 L45 12 Z" fill="#ffcf33"/></svg>`;
const kpGround = () => `<svg class="kpground" viewBox="0 0 300 400" preserveAspectRatio="none" aria-hidden="true">
  <defs><radialGradient id="kplg"><stop offset="0" stop-color="#ffe08a" stop-opacity=".5"/><stop offset="1" stop-color="#ffe08a" stop-opacity="0"/></radialGradient></defs>
  <rect width="300" height="400" fill="var(--kp-grass)"/><g fill="var(--kp-grass2)"><circle cx="22" cy="40" r="24"/><circle cx="282" cy="40" r="22"/><circle cx="150" cy="300" r="18"/><circle cx="20" cy="390" r="26"/></g>
  <g stroke="var(--kp-path)" stroke-width="18" stroke-linecap="round" fill="none">${Object.values(KP_POS).map(p => `<path d="M${KP_PLAZA[0]} ${KP_PLAZA[1]} L${p[0]} ${p[1] + 18}"/>`).join('')}<path d="M150 228 L150 80"/></g>
  <circle cx="150" cy="228" r="34" fill="var(--kp-path)"/><g class="kplamp" fill="url(#kplg)"><circle cx="114" cy="196" r="32"/><circle cx="186" cy="196" r="32"/><circle cx="114" cy="262" r="32"/><circle cx="186" cy="262" r="32"/></g>
  <g fill="#2a2f3a"><rect x="113" y="188" width="2" height="10"/><rect x="185" y="188" width="2" height="10"/><rect x="113" y="254" width="2" height="10"/><rect x="185" y="254" width="2" height="10"/></g>
  <g fill="#ffe08a"><circle cx="114" cy="187" r="3"/><circle cx="186" cy="187" r="3"/><circle cx="114" cy="253" r="3"/><circle cx="186" cy="253" r="3"/></g>
  <g fill="var(--kp-tree)"><circle cx="105" cy="160" r="9"/><circle cx="196" cy="160" r="9"/><circle cx="18" cy="290" r="12"/><circle cx="284" cy="290" r="12"/><circle cx="150" cy="396" r="10"/></g></svg>`;

// ---------- trạng thái ----------
let KP = null;   // { mode, de, me, ents, raf, night: {...} }
const kpEsc = s => esc(String(s == null ? '' : s));
const kpAlive = () => KP && (window.CUR || {}).view === CY_VIEW && document.getElementById('kpmap');

// ---------- ngày: bản đồ là màn Thành phố ----------
async function cyView() { if (typeof phStop === 'function') phStop(); kpStop(); window.CUR = { view: CY_VIEW }; BACK = null; $app.onkeydown = null; scrollTo(0, 0);
  $app.innerHTML = '<div id="ie"></div><p class="mute">Đang mở Thành phố TOEIC…</p>'; await toLoad();
  if (typeof TG_P !== 'undefined' && !TG_P) { try { if (typeof trProbe9 === 'function') await trProbe9(); if (typeof trLkList === 'function') await trLkList(); } catch (e) {} TG_P = await tgPool(); }
  if (window.CUR.view !== CY_VIEW) return;
  kpDay(); }
function kpDay() {
  const de = tgDe(), C = cyCount(de), L = tgJState(de) || [], ok = L.filter(c => c.st === 'ok').length, sai = L.filter(c => c.st === 'sai').length;
  const D = ((TO && TO.tron) || []).filter(d => TG_P && TG_P[d.id]), nLk = ((typeof TR !== 'undefined' && TR.lk) || []).filter(r => !((TO && TO.tron) || []).some(d => d.id === r.id)).length;
  const bay = (kpSt().bay[de] || []).length;
  KP = { mode: 'day', de, C, me: { p: [...KP_PLAZA], to: null, act: null, left: false }, ents: {} };
  const houses = CY_PHO.filter(p => cyC(p)).map(p => { const k = p.k, [x, y] = kpPct(KP_POS[k]), r = C[k], off = de && !r;
    return `<button class="kph${off ? ' off' : ''}" data-kph="${k}" style="left:${x}%;top:${y}%" aria-label="${cyC(p).ten}${r ? `, ${r.n} câu của đề` : ''}${r && r.sai ? `, ${r.sai} câu đang sai` : ''}">${kpHouse(k, r && r.chac === r.n)}${r && r.sai ? `<span class="kpjob">${r.sai}</span>` : ''}<span class="kptag">${KP_SHORT[k]}</span></button>`; }).join('');
  const [cx, cy] = kpPct(KP_CASTLE), [bx, by] = kpPct(KP_PLAZA);
  $app.innerHTML = `<div id="ie"></div><div class="row top"><button class="link tap" data-cyb>‹ TOEIC</button></div>
    <h1 style="margin:4px 0 4px">🏙 Thành phố TOEIC</h1>
    <p class="mute" style="margin:0 0 8px">Chạm một nhà để vào phố luyện. Khi sẵn sàng, bắt đầu đêm để tìm 🎭 kẻ giả mạo.</p>
    <div class="chips tap">${D.map(d => `<button class="chip${d.id === de ? ' on' : ''}" data-cyde="${kpEsc(d.id)}" aria-pressed="${d.id === de}">${kpEsc(tgDeName(d.id))}</button>`).join('')}</div>
    ${nLk ? `<button data-cyopen>🔓 Mở thêm ${nLk} đề riêng (cần mã)</button>` : ''}
    <div class="kpmap kpday" id="kpmap" aria-label="Bản đồ khu phố. Chạm một nhà để đi tới.">${kpGround()}
      <div class="kphouses">${houses}<button class="kph kpcastle" data-kpc style="left:${cx}%;top:${cy}%" aria-label="Lâu đài: Chinh phục đề, ⭐ ${ok} trên ${L.length}">${KP_CASTLE_SVG}<span class="kptag">🏰 ⭐ ${ok}/${L.length}</span></button>
        <button class="kpbell" data-kpn style="left:${bx}%;top:${by}%" aria-label="Bắt đầu đêm">🌙</button></div>
      <div class="kplayer" id="kplayer"></div></div>
    <button class="pri kpgo" data-kpn>🌙 Bắt đầu đêm<small>${de ? `${KP_JOBS} việc từ ${sai ? 'câu bạn đang sai' : 'câu'} của ${kpEsc(tgDeName(de))} · tìm 🎭 kẻ giả mạo` : 'Chọn một đề trước'}</small></button>
    ${bay ? `<button class="hrow" data-kpbay><span class="ic">🗂</span><span class="t"><b>Hồ sơ bẫy · ${kpEsc(tgDeName(de))}</b><small>${bay} luật sai đã lật trong các đêm</small></span><span class="chev">›</span></button>` : ''}
    <details class="more"><summary>Danh sách phố</summary>${cyListHtml(de, C)}</details>
    <p class="mute" style="font-size:14px">Số trên nhà = câu của đề bạn đang sai ở phố đó. Không tính vào 📘 Học, 🔁 Nhớ hay điểm đề thử.</p>`;
  const lay = document.getElementById('kplayer');
  for (const p of CY_PHO.filter(p => cyC(p))) { const ch = Object.keys(cyC(p).CH || {}).filter(t => t !== '_'); if (!ch.length) continue; const t = ch[0], [x, y] = kpPct([KP_POS[p.k][0] + (KP_POS[p.k][0] < 150 ? 30 : -30), KP_POS[p.k][1] + 26]);
    const el = document.createElement('div'); el.className = 'kpe kpnpc'; el.style.left = x + '%'; el.style.top = y + '%'; el.innerHTML = `<div class="bd">${phFace(t, 30)}</div>`; lay.appendChild(el); }
  const me = document.createElement('div'); me.className = 'kpe kpme'; me.innerHTML = `<div class="bd">${KP_ME}</div>`; lay.appendChild(me); KP.ents.me = me; kpPaint();
  $app.onclick = e => { if (e.target.closest('[data-cyb]')) { kpStop(); EX_PART = 'san'; return toeicView(); }
    const c = e.target.closest('[data-cyde]'); if (c) { tgSt().de = c.dataset.cyde; save(); return kpDay(); }
    if (e.target.closest('[data-cyopen]')) return trLkAll(() => { TG_P = null; cyView(); });
    if (e.target.closest('[data-kpbay]')) return kpBay(de);
    if (e.target.closest('[data-kpn]')) return de ? kpNight() : toast('Chọn một đề trước.');
    const h = e.target.closest('[data-kph]'); if (h) return kpWalk(kpStand(h.dataset.kph), () => kpHouseSheet(h.dataset.kph));
    if (e.target.closest('[data-kpc]')) return kpWalk([KP_CASTLE[0], KP_CASTLE[1] + 38], kpCastleSheet);
    const m = e.target.closest('#kpmap'); if (m) { const r = m.getBoundingClientRect(); kpWalk([(e.clientX - r.left) / r.width * KP_VB.w, (e.clientY - r.top) / r.height * KP_VB.h]); } };
  kpLoop(); }
function kpHouseSheet(k) { const p = CY_PHO.find(p => p.k === k), c = cyC(p), r = KP.C[k], lv = cyLv(k), M = Object.keys(c.MUC).length, t = Object.keys(c.CH || {}).filter(x => x !== '_')[0];
  kpSheet(`<div class="kpsay"><span class="f">${phFace(t, 48, 'happy')}</span><div class="b"><b>${kpEsc(kpName(t))}</b>${r ? `Chào Mầm! ${kpEsc(tgDeName(KP.de))} có ${r.n} câu cần phố mình${r.sai ? `, bạn đang sai ${r.sai} câu` : ''}.` : `Chào Mầm! ${kpEsc(tgDeName(KP.de))} không có câu nào của phố mình, nhưng vẫn vào luyện được.`}</div></div>
    <div class="cycard" style="margin:0"><span class="ic">${c.ic}</span><span class="t"><b>${c.ten}</b><small>${kpEsc(c.sub)}</small><small>${lv ? `Bậc ${lv} / ${M} đã mở` : 'Chưa chơi'}${r ? ` · ${r.chac}/${r.n} câu chắc` : ''}</small></span></div>
    <div class="btns"><button class="pri" data-phv="${k}">▶ Vào ${kpEsc(c.ten)}</button><button class="sec" data-x>Ở lại bản đồ</button></div>`, el => { el.querySelector('[data-x]').onclick = kpClose; el.querySelector('[data-phv]').addEventListener('click', kpClose); }); }
function kpCastleSheet() { const L = tgJState(KP.de) || [], ok = L.filter(c => c.st === 'ok').length;
  kpSheet(`<h2>🏰 Lâu đài · ⚔️ Chinh phục đề</h2><p>Trận cuối: làm đúng hết Phần Đọc của ${kpEsc(tgDeName(KP.de))}. Hiện ⭐ ${ok} / ${L.length} câu.</p><p class="mute">Không khoá: vào lúc nào cũng được. Nên luyện phố và chơi vài đêm trước.</p>
    <div class="btns"><button class="pri" data-tgv>⚔️ Vào trận</button><button class="sec" data-x>Ở lại bản đồ</button></div>`, el => { el.querySelector('[data-x]').onclick = kpClose; el.querySelector('[data-tgv]').addEventListener('click', () => { kpClose(); kpStop(); }); }); }
function kpBay(de) { const L = kpSt().bay[de] || [];
  kpSheet(`<h2>🗂 Hồ sơ bẫy · ${kpEsc(tgDeName(de))}</h2><p class="mute">Luật sai kẻ giả mạo đã nói trong các đêm, và luật đúng.</p>
    <div class="kpbay">${L.map(b => `<div class="fb"><b>Câu ${b.n}</b><br>✗ ${kpEsc(b.f)}<br>✓ ${kpEsc(b.t)}${b.why ? `<br><span class="mute">${kpEsc(b.why)}</span>` : ''}</div>`).join('')}</div>
    <div class="btns"><button class="sec" data-x>Đóng</button></div>`, el => el.querySelector('[data-x]').onclick = kpClose); }

// ---------- vòng chạy chung (ngày + đêm) ----------
function kpStop() { if (KP && KP.raf) cancelAnimationFrame(KP.raf); if (KP) { KP.raf = 0; if (KP.n) KP.n.over = true; } kpClose(); document.querySelectorAll('.kpsplash,.kpspace').forEach(x => x.remove()); }
function kpLoop() { if (typeof requestAnimationFrame !== 'function') return; let last = 0; const f = ts => { if (!kpAlive()) { kpStop(); return; } const dt = last ? Math.min(.1, (ts - last) / 1000) : 0; last = ts; kpStep(dt); kpPaint(); KP.raf = requestAnimationFrame(f); }; KP.raf = requestAnimationFrame(f); }
function kpMove(o, sp, dt) { const d = kpDist(o.p, o.to), s = sp * dt; if (o.to[0] < o.p[0] - .5) o.left = true; else if (o.to[0] > o.p[0] + .5) o.left = false; if (d <= s) { o.p = [...o.to]; o.to = null; return true; } o.p = [o.p[0] + (o.to[0] - o.p[0]) / d * s, o.p[1] + (o.to[1] - o.p[1]) / d * s]; return false; }
function kpWalk(to, act) { if (!KP || (KP.n && (KP.n.paused || KP.n.over))) return; const me = KP.me; me.to = [Math.max(12, Math.min(288, to[0])), Math.max(20, Math.min(392, to[1]))]; me.act = act || null; if (kpRed()) { me.p = [...me.to]; me.to = null; const a = me.act; me.act = null; a && a(); } }
function kpStep(dt) { const me = KP.me, N = KP.n; if (N && (N.paused || N.over)) return;
  if (me.to) { KP.stT = (KP.stT || 0) - dt; if (KP.stT <= 0) { if (N) KS.step(); KP.stT = .27; } if (kpMove(me, 95, dt)) { const a = me.act; me.act = null; a && a(); } }
  if (N) kpNightStep(dt); }
function kpPaint() { const me = KP.me, el = KP.ents.me; if (!el) return; const [x, y] = kpPct(me.p); el.style.left = x + '%'; el.style.top = y + '%'; el.classList.toggle('walk', !!me.to); el.classList.toggle('left', me.left); if (KP.n) kpNightPaint(); }

// ---------- đêm: chọn việc, cư dân, luật ----------
function kpPick(de) { const B = trB(de), St = {}; for (const c of tgJState(de) || []) St[c.n] = c; const today = phDay();
  const cand = B.Q.filter(q => /^p[5-7]$/.test(q.sec)).map(q => { const k = kpPhoOf(q); if (!k) return null; const s = St[q.n] || {}, it = kpPst(k).it[`de:${de}:${q.n}`];
    const due = it && it.d <= today; return { q, k, w: s.st === 'sai' ? 0 : due || s.due ? 1 : s.st !== 'ok' ? 2 : 3, r: Math.random() }; }).filter(Boolean).sort((a, b) => a.w - b.w || a.r - b.r);
  const out = [], per = {}; let p7 = 0;
  for (const c of cand) { if (out.length >= KP_JOBS) break; if ((per[c.k] || 0) >= 2) continue; if (c.q.sec === 'p7' && p7 >= 1) continue; per[c.k] = (per[c.k] || 0) + 1; if (c.q.sec === 'p7') p7++; out.push(c); }
  const extra = cand.find(c => !out.includes(c) && c.q.sec !== 'p7') || null;
  return { jobs: out.map(c => ({ q: c.q, k: c.k, st: 'todo' })), extra: extra && { q: extra.q, k: extra.k } }; }
function kpBots(de, C) { const ks = Object.keys(PH_PHO).filter(k => (PH_PHO[k].CH && Object.keys(PH_PHO[k].CH).some(t => t !== '_'))).sort((a, b) => ((C[b] || {}).n || 0) - ((C[a] || {}).n || 0));
  return ks.slice(0, 6).map(k => kpRnd(Object.keys(PH_PHO[k].CH).filter(t => t !== '_'))); }
const kpLab = v => String(v || '').split(':')[0].trim();
// nhãn phương án nhiễu phải là một loại thật (không nhận "dạng sai", "cụm không chuẩn"…) để lời khai giả nghe hợp lý
const KP_BADLAB = /(sai|không chuẩn|không có|không dùng|không tồn tại|lỗi|thừa|thiếu|lạ|vô nghĩa)/i;
function kpLaws(de) { const out = [];
  for (const q of trB(de).Q) { if (!/^p[56]$/.test(q.sec) || !q.lg || !q.lg.og) continue; const og = q.lg.og, A = q.a, la = kpLab(og[A]); if (!la || KP_BADLAB.test(la)) continue;
    const ds = (q.opts || []).filter(o => o !== A && og[o] && kpLab(og[o]) && kpLab(og[o]).toLowerCase() !== la.toLowerCase() && !KP_BADLAB.test(kpLab(og[o])) && kpLab(og[o]).length <= 40); if (!ds.length) continue;
    const d = kpRnd(ds); out.push({ n: q.n, t: `Câu ${q.n}: chỗ trống cần ${la}, chọn “${A}”.`, f: `Câu ${q.n}: chỗ trống cần ${kpLab(og[d])}, chọn “${d}”.`, why: q.why || '' }); }
  return out; }

// ---------- đêm: bắt đầu ----------
function kpNight() {
  const de = KP.de, C = KP.C, P = kpPick(de); if (!P.jobs.length) { toast('Đề này chưa có câu Phần Đọc để làm việc.'); return; }
  const bots = kpBots(de, C), imp = kpRnd(bots), laws = kpLaws(de);
  const N = KP.n = { t: 0, paused: true, over: false, bar: 0, imp, cool: 16, saboAt: 30 + Math.random() * 12, lightsOut: false, saboDone: false, bellUsed: false, sirenT: 0, chatT: 4, histT: 0,
    jobs: P.jobs, extra: P.extra, laws, seen: {}, kills: [], lessons: [], right: 0, wrong: 0, toast: null, toastT: 0,
    bots: bots.map((t, i) => { const a = (i / bots.length) * Math.PI * 2; return { t, p: [KP_PLAZA[0] + Math.cos(a) * 28, KP_PLAZA[1] + Math.sin(a) * 22], to: null, wait: 1 + Math.random() * 2, at: null, sleep: false, out: false, left: false, say: null, sayT: 0, tgt: null }; }) };
  KP.me = { p: [...KP_PLAZA], to: null, act: null, left: false }; KP.ents = {};
  const houses = CY_PHO.filter(p => cyC(p)).map(p => { const [x, y] = kpPct(KP_POS[p.k]); return `<button class="kph" data-kph="${p.k}" style="left:${x}%;top:${y}%" aria-label="${cyC(p).ten}">${kpHouse(p.k, false)}<span class="kptag">${KP_SHORT[p.k]}</span></button>`; }).join('');
  const [bx, by] = kpPct(KP_PLAZA);
  $app.innerHTML = `<div class="trx kptop"><button class="link tap" data-kpq>✕ Rời đêm</button><b>🌙 Đêm · ${kpEsc(tgDeName(de))}</b><span class="kpic"><button class="iconbtn" data-kps aria-label="Bật / tắt tiếng"></button><button class="iconbtn" data-kpl aria-label="Chế độ học: dừng phố khi làm việc"></button></span></div>
    <div class="kphud" id="kphud"><div class="kpbar"><span>Việc chung</span><div class="bar" aria-hidden="true"><i id="kpbarf" style="width:0%"></i></div><span id="kpbarn">0%</span></div><div class="kpmt" id="kpmt"></div></div>
    <div class="kpmap kpnight" id="kpmap" aria-label="Bản đồ khu phố ban đêm. Chạm để đi.">${kpGround()}<div class="kphouses" id="kphs">${houses}<button class="kpbell" data-kpbell style="left:${bx}%;top:${by}%" aria-label="Chuông khẩn: gọi họp">🔔</button></div>
      <div class="kplayer" id="kplayer"></div><div class="kpfog" id="kpfog"></div><div id="kpui"></div><div id="kprep"></div></div>
    <p class="mute" style="font-size:14px;margin-top:8px">Việc = câu của ${kpEsc(tgDeName(de))}. Làm đúng không gợi ý thì câu được ⭐ ở Chinh phục đề và vào lịch ôn của phố.</p>`;
  const lay = document.getElementById('kplayer');
  if (!kpRed()) for (let i = 0; i < 10; i++) { const f = document.createElement('span'); f.className = 'kpff'; f.style.cssText = `left:${5 + Math.random() * 90}%;top:${5 + Math.random() * 90}%;--d:${3 + Math.random() * 4}s;--x:${Math.random() * 40 - 20}px;--y:${Math.random() * 40 - 20}px`; lay.appendChild(f); }
  for (const b of N.bots) { const el = document.createElement('div'); el.className = 'kpe kpnpc'; el.innerHTML = `<div class="bd">${phFace(b.t, 32)}</div><span class="nm">${kpEsc(kpName(b.t))}</span>`; lay.appendChild(el); KP.ents[b.t] = el; }
  const me = document.createElement('div'); me.className = 'kpe kpme'; me.innerHTML = `<div class="bd">${KP_ME}</div>`; lay.appendChild(me); KP.ents.me = me;
  $app.onclick = e => { const N = KP && KP.n; if (!N) return;
    if (e.target.closest('[data-kpq]')) return kpQuit();
    if (e.target.closest('[data-kps]')) { const s = kpSt(); s.snd = s.snd ? 0 : 1; save(); if (s.snd) { kpAc(); KS.plus(); } return kpNightPaint(true); }
    if (e.target.closest('[data-kpl]')) { const s = kpSt(); s.hoc = s.hoc ? 0 : 1; save(); toast(s.hoc ? '📘 Chế độ học bật: làm việc thì cả phố dừng.' : 'Chế độ học tắt: phố vẫn chạy khi bạn làm việc.'); return kpNightPaint(true); }
    if (N.paused || N.over) return; kpAc();
    const rep = e.target.closest('[data-kprep]'); if (rep) return kpFound(N.bots.find(b => b.t === rep.dataset.kprep));
    if (e.target.closest('[data-kpbell]')) { if (N.bellUsed) return; return kpWalk([KP_PLAZA[0], KP_PLAZA[1] + 26], () => { N.bellUsed = true; N.paused = true; KS.gong(); kpBuzz(120); kpSplash('🔔 HỌP KHẨN!', 'Mầm rung chuông. Cả phố tập trung ở quảng trường.', 'meet', 1500, () => kpMeet({ bell: 1 })); }); }
    const h = e.target.closest('[data-kph]'); if (h) return kpWalk(kpStand(h.dataset.kph), () => kpJob(h.dataset.kph));
    const m = e.target.closest('#kpmap'); if (m) { const r = m.getBoundingClientRect(); kpWalk([(e.clientX - r.left) / r.width * KP_VB.w, (e.clientY - r.top) / r.height * KP_VB.h]); } };
  scrollTo(0, 0); kpNightPaint(true); kpRole(); }
function kpRole() { const N = KP.n;
  kpSheet(`<div class="kprole"><span class="f">${KP_ME}</span><div><span class="kptag2">VAI CỦA BẠN</span><h2 style="margin:4px 0 2px;color:#fff">Cư dân</h2><span>Trong 6 cư dân có <b>1 🎭 kẻ giả mạo</b>.</span></div></div>
    <p><b>Thắng:</b> làm xong ${N.jobs.length} việc ở các nhà có <b>!</b> cho đầy thanh việc chung, hoặc bỏ phiếu đuổi được kẻ giả mạo.</p>
    <p><b>Thua:</b> kẻ giả mạo ru ngủ gần hết phố. Thua không mất gì.</p>
    <p class="mute">Đêm tối: bạn chỉ thấy quanh mình. Thấy người ngủ 💤 thì bấm Báo. Cư dân thật luôn nói luật đúng khi họp. ${kpSt().hoc ? '📘 Chế độ học bật: khi bạn làm việc, cả phố dừng lại.' : ''}</p>
    <div class="btns"><button class="pri" data-go>▶ Vào đêm</button></div>`, el => el.querySelector('[data-go]').onclick = () => { kpClose(); kpAc(); KS.gong(); N.paused = false; kpToast('🌙 Đêm xuống. Đi làm việc và để ý mọi người.', false, 3.5); }); }
function kpQuit() { const N = KP.n, was = N.paused; N.paused = true;
  kpSheet(`<h2>Rời đêm?</h2><p>Câu bạn đã làm vẫn được ghi. Đêm này không lưu.</p><div class="btns"><button class="pri" data-y>Rời đêm, về bản đồ</button><button class="sec" data-x>Ở lại</button></div>`,
    el => { el.querySelector('[data-y]').onclick = () => { kpStop(); KP.n = null; cyView(); }; el.querySelector('[data-x]').onclick = () => { kpClose(); N.paused = was && N.over; if (!N.over) N.paused = false; }; }); }
function kpToast(msg, al, sec) { const N = KP.n; N.toast = { msg, al }; N.toastT = sec || 3.5; }
const kpVis = () => KP.n.lightsOut ? 46 : 90;
const kpNear = p => Object.keys(KP_POS).reduce((b, k) => kpDist(p, kpStand(k)) < kpDist(p, kpStand(b)) ? k : b, 'loai');

function kpNightStep(dt) { const N = KP.n, me = KP.me, R = kpVis();
  N.t += dt; N.cool -= dt; N.chatT -= dt; if (N.toastT > 0) { N.toastT -= dt; if (N.toastT <= 0) N.toast = null; }
  N.histT -= dt; const logH = N.histT <= 0; if (logH) N.histT = 1;
  for (const b of N.bots) { if (b.sleep || b.out) continue;
    if (kpDist(b.p, me.p) <= R) N.seen[b.t] = { h: kpNear(b.p), t: N.t };
    if (b.sayT > 0) { b.sayT -= dt; if (b.sayT <= 0) b.say = null; }
    const isImp = b.t === N.imp;
    if (isImp && N.cool <= 4 && b.tgt) { const t = N.bots.find(x => x.t === b.tgt && !x.sleep && !x.out); if (t) b.to = [...t.p]; else b.tgt = null; }
    if (b.to) { if (kpMove(b, isImp && b.tgt ? 44 : 38, dt)) b.wait = 2.5 + Math.random() * 2; }
    else if (b.wait > 0) { b.wait -= dt; if (b.wait <= 0) { if (b.at && !isImp) N.bar = Math.min(100, N.bar + 1.2); const h = kpRnd(Object.keys(KP_POS).filter(x => x !== b.at)); b.at = h; const s = kpStand(h); b.to = [s[0] + (Math.random() * 20 - 10), s[1] + (Math.random() * 8 - 4)];
      if (isImp && N.cool <= 6 && !b.tgt) { const c = N.bots.filter(x => !x.sleep && !x.out && x.t !== N.imp); if (c.length) b.tgt = kpRnd(c).t; } } } }
  if (N.chatT <= 0) { N.chatT = 4 + Math.random() * 3; const v = N.bots.filter(b => !b.sleep && !b.out && kpDist(b.p, me.p) <= R); if (v.length) { const b = kpRnd(v); b.say = N.lightsOut ? (b.t === N.imp ? 'Để mình đi sửa đèn!' : 'Tối quá! Ai ra Chợ sửa đèn đi!') : kpRnd(KP_CHAT); b.sayT = 2.4; } }
  const im = N.bots.find(b => b.t === N.imp);
  if (im && !im.out && N.cool <= 0 && kpDist(im.p, me.p) > R + 8) { const aw = N.bots.filter(b => !b.sleep && !b.out && b.t !== N.imp);
    const tg = aw.find(b => kpDist(b.p, im.p) < 16 && aw.every(o => o === b || kpDist(o.p, im.p) > 64) && kpDist(b.p, me.p) > R + 8);
    if (tg) { tg.sleep = true; tg.to = null; tg.say = null; im.tgt = null; N.cool = 24 + Math.random() * 8; const at = kpNear(tg.p);
      N.kills.push({ t: N.t, v: tg.t, at, wit: N.bots.filter(b => !b.sleep && !b.out && b.t !== N.imp && kpDist(b.p, tg.p) < 95).map(b => b.t) });
      if (kpDist(tg.p, me.p) < R + 85) { KS.rustle(); kpToast(`👂 Có tiếng động lạ phía ${KP_SHORT[at]}…`, false, 3.5); }
      const el = KP.ents[tg.t]; if (el) { el.className = 'kpe kpzz'; el.innerHTML = KP_ZZ; } } }
  if (!N.saboDone && !N.lightsOut && N.t >= N.saboAt) { N.lightsOut = true; KS.dark(); kpBuzz(200); kpSplash('🔦 MẤT ĐIỆN!', 'Kẻ giả mạo tắt đèn cả phố. Ra Chợ Từ Vựng sửa bảng điện.', 'light', 1400); kpToast('🔦 Đèn tắt! Sửa ở Chợ Từ Vựng.', true, 5); }
  if (N.lightsOut) { N.sirenT -= dt; if (N.sirenT <= 0) { KS.siren(); N.sirenT = 1.25; } }
  kpEnd(); }
const kpSet = (el, h) => { if (el && el._h !== h) { el._h = h; el.innerHTML = h; } };
function kpNightPaint(force) { const N = KP.n, me = KP.me, R = kpVis(), map = document.getElementById('kpmap'); if (!map) return; const sc = map.getBoundingClientRect().width / KP_VB.w;
  const hs = document.getElementById('kphs'); if (hs) for (const b of hs.querySelectorAll('[data-kph]')) { const k = b.dataset.kph, j = N.jobs.find(j => j.k === k && j.st === 'todo'), dn = N.jobs.some(j => j.k === k) && !j, sab = k === 'cho' && N.lightsOut, mk = j ? 'job' : sab ? 'al' : dn ? 'dn' : '';
    if (b._mk !== mk) { b._mk = mk; b.querySelector('.kpjob') && b.querySelector('.kpjob').remove(); if (j || sab) b.insertAdjacentHTML('beforeend', `<span class="kpjob${sab ? ' al' : ''}">${sab ? '🔦' : '!'}</span>`); b.classList.toggle('lit', dn); } }
  const bell = document.querySelector('[data-kpbell]'); if (bell) bell.disabled = N.bellUsed;
  for (const b of N.bots) { const el = KP.ents[b.t]; if (!el) continue; if (b.out) { el.style.display = 'none'; continue; } const [x, y] = kpPct(b.p), seen = kpDist(b.p, me.p) <= R; el.style.left = x + '%'; el.style.top = y + '%';
    if (b.sleep) { el.style.opacity = seen ? 1 : 0; continue; } el.classList.toggle('hide', !seen); el.classList.toggle('walk', !!b.to); el.classList.toggle('left', b.left);
    let sp = el.querySelector('.say'); if (b.say && seen) { if (!sp) { sp = document.createElement('span'); sp.className = 'say'; el.appendChild(sp); } if (sp.textContent !== b.say) sp.textContent = b.say; } else if (sp) sp.remove(); }
  const fog = document.getElementById('kpfog'); if (fog) fog.style.background = `radial-gradient(circle at ${me.p[0] * sc}px ${me.p[1] * sc}px, transparent ${R * sc}px, var(--kp-fog) ${R * sc + 26}px)`;
  const body = N.bots.find(b => b.sleep && !b.out && kpDist(b.p, me.p) <= R);
  kpSet(document.getElementById('kpui'), (N.lightsOut ? '<div class="kpred"></div>' : '') + (N.toast ? `<div class="kptoast${N.toast.al ? ' al' : ''}" role="status">${kpEsc(N.toast.msg)}</div>` : ''));
  kpSet(document.getElementById('kprep'), body && !N.over && !N.paused ? `<button class="kpreport" data-kprep="${body.t}">🔔 Báo: ${kpEsc(kpName(body.t))} ngủ say!</button>` : '');
  const f = document.getElementById('kpbarf'); if (f) f.style.width = N.bar + '%'; const n = document.getElementById('kpbarn'); if (n) n.textContent = Math.round(N.bar) + '%';
  kpSet(document.getElementById('kpmt'), N.jobs.map(j => `<span class="kpm${j.st === 'done' ? ' done' : ''}">${cyC(CY_PHO.find(p => p.k === j.k)).ic} ${KP_SHORT[j.k]}</span>`).join('') + (N.lightsOut ? '<span class="kpm al">🔦 Sửa đèn ở Chợ</span>' : ''));
  if (force || !N._ic) { N._ic = 1; const s = kpSt(), a = document.querySelector('[data-kps]'), l = document.querySelector('[data-kpl]'); if (a) a.textContent = s.snd ? '🔊' : '🔇'; if (l) { l.textContent = s.hoc ? '📘' : '⏩'; l.setAttribute('aria-pressed', s.hoc ? 'true' : 'false'); } } }

// ---------- đêm: việc = câu đề ----------
function kpJob(k) { const N = KP.n, sab = k === 'cho' && N.lightsOut, j = N.jobs.find(j => j.k === k && j.st === 'todo');
  if (!j && !sab) return kpToast(N.jobs.some(j => j.k === k) ? `${KP_SHORT[k]}: việc của bạn đã xong.` : `${KP_SHORT[k]}: đêm nay không có việc của bạn.`);
  const job = j || N.extra || N.jobs[0]; if (kpSt().hoc) N.paused = true;
  const og = job.q.lg && job.q.lg.og, P = og && job.q.sec === 'p5' && (job.q.opts || []).map(o => phPosOf(og[o]));
  if (!sab && P && P.length === 4 && new Set(P).size === 4 && P.every(t => 'NVAR'.includes(t))) return kpWires(job, P);
  kpAsk(job, sab); }
const kpHead = (k, sab, title) => `<div class="kpthead"><span class="e">${sab ? '🔦' : cyC(CY_PHO.find(p => p.k === k)).ic}</span><div><b>${title}</b><small>${KP_SHORT[k]} · ${kpSt().hoc ? 'phố đang dừng' : '⚠️ phố vẫn chạy'}</small></div></div>`;
function kpQHtml(q) { if (q.sec === 'p6' && typeof phSrc === 'function') { const s = phSrc(q); if (s) return `${s.pre ? `<p class="mute" style="margin:0">${kpEsc(s.pre)}</p>` : ''}<p class="kpq">${kpEsc(s.s).replace('___', '<span class="kpgap">?</span>')}</p>${s.para ? `<details class="more"><summary>📄 Xem cả đoạn</summary><p style="font-size:15px">${kpEsc(s.para).replace('___', '<b>____</b>')}</p></details>` : ''}`; }
  if (q.sec === 'p7') return `<p class="kpq">${q.q}</p>${q.foot ? `<details class="more" open><summary>📄 Xem cả bài</summary>${q.foot}</details>` : ''}`;
  return `<p class="kpq">${q.q}</p>`; }
function kpAsk(job, sab) { const q = job.q, k = sab ? 'cho' : job.k, opts = kpMix([...(q.opts || [])]);
  kpSheet(`${kpHead(k, sab, sab ? 'Sửa bảng điện: chọn đúng để bật lại đèn' : KP_TASK[job.k])}<p class="mute" style="margin:0;font-size:13px">Câu ${q.n} · ${kpEsc(tgDeName(KP.de))}</p>${kpQHtml(q)}
    <div class="opts">${opts.map((o, i) => `<button class="opt" data-ko="${i}">${kpEsc(o)}</button>`).join('')}</div><div id="kpfb"></div>`, el => {
    el.querySelectorAll('[data-ko]').forEach(b => b.onclick = () => { const o = opts[+b.dataset.ko], ok = o === q.a; el.querySelectorAll('[data-ko]').forEach(x => x.disabled = true);
      b.classList.add(ok ? 'kpok' : 'kpno'); el.querySelectorAll('[data-ko]').forEach(x => { if (opts[+x.dataset.ko] === q.a) x.classList.add('kpok'); });
      if (ok) { KS.ok(); KP.n.right++; } else { KS.no(); kpBuzz(120); KP.n.wrong++; } kpMark(job, ok);
      const lg = q.lg || {}; el.querySelector('#kpfb').innerHTML = `<div class="fb"><b>${ok ? '✓ Đúng' : '✗ Chưa đúng'}</b>${ok ? (sab ? ' · đèn sẽ sáng lại' : ` · thanh việc chung +${Math.round(KP_PLAYER / KP.n.jobs.length)}`) : ' · việc vẫn còn, câu hẹn ôn ngày mai'}<br>Đáp án: <b>${kpEsc(q.a)}</b>${lg.og && lg.og[q.a] ? ` (${kpEsc(lg.og[q.a])})` : ''}<br>${kpEsc(lg.ly || q.why || '')}${lg.dich ? `<br><span class="mute">${kpEsc(lg.dich)}</span>` : ''}</div>
        <div class="btns" style="margin-top:10px"><button class="pri" data-c>Tiếp tục</button></div>`;
      const c = el.querySelector('[data-c]'); c.focus({ preventScroll: true }); c.onclick = () => { kpClose(); KP.n.paused = false; if (ok) kpDone(job, sab); }; }); }); }
function kpWires(job, P) { const q = job.q, og = q.lg.og, W = kpMix(q.opts.map((o, i) => [o, P[i]])), SOC = kpMix([['N', 'Danh từ', '#5aa0ff'], ['V', 'Động từ', '#ff7a5c'], ['A', 'Tính từ', '#ff6fb0'], ['R', 'Trạng từ', '#7be07b']]); let sel = null, got = 0, miss = 0;
  kpSheet(`${kpHead(job.k, 0, 'Nối dây: mỗi từ về đúng ổ loại từ')}<p class="mute" style="margin:0">Câu ${q.n} có 4 từ cùng họ. Nối từng từ về ổ loại từ của nó (nhìn đuôi từ), rồi chọn từ cho chỗ trống.</p>
    <div class="kpwires" id="kpwr"><svg id="kpws"></svg>${W.map((w, i) => `<button class="kpwb wl" data-w="${w[1]}" style="grid-column:1;grid-row:${i + 1}">${kpEsc(w[0])}<span class="dot"></span></button>`).join('')}${SOC.map((s, i) => `<button class="kpwb wr" data-p="${s[0]}" style="grid-column:2;grid-row:${i + 1};--c:${s[2]}"><span class="dot"></span>${s[1]}</button>`).join('')}</div><div id="kpfb"></div>`, el => {
    const box = el.querySelector('#kpwr'), svg = el.querySelector('#kpws');
    const line = (a, b, c) => { const R0 = box.getBoundingClientRect(), A = a.getBoundingClientRect(), B = b.getBoundingClientRect(), ay = A.top + A.height / 2 - R0.top, by = B.top + B.height / 2 - R0.top;
      svg.insertAdjacentHTML('beforeend', `<path d="M${A.right - R0.left} ${ay} C${A.right - R0.left + 30} ${ay} ${B.left - R0.left - 30} ${by} ${B.left - R0.left} ${by}" stroke="${c}" stroke-width="5" fill="none" stroke-linecap="round"/>`); };
    el.querySelectorAll('.wl').forEach(b => b.onclick = () => { if (b.disabled) return; el.querySelectorAll('.wl').forEach(x => x.classList.toggle('sel', x === b)); sel = b; KS.type(); });
    el.querySelectorAll('.wr').forEach(b => b.onclick = () => { if (!sel || b.disabled) return;
      if (sel.dataset.w === b.dataset.p) { const c = SOC.find(s => s[0] === b.dataset.p)[2]; line(sel, b, c); sel.querySelector('.dot').style.background = c; sel.classList.remove('sel'); sel.classList.add('ok'); b.classList.add('ok'); sel.disabled = b.disabled = true; sel = null; got++; KS.wire();
        if (got === 4) { KS.ok(); el.querySelector('#kpfb').innerHTML = `<div class="fb"><b>⚡ Có điện rồi!</b> ${miss ? `(nối nhầm ${miss} lần)` : 'Không nhầm lần nào.'}<br>${W.map(w => `${kpEsc(w[0])}: ${kpEsc(og[w[0]] || '')}`).join('<br>')}</div><div class="btns" style="margin-top:10px"><button class="pri" data-c>▶ Giờ chọn từ cho chỗ trống</button></div>`;
          const c2 = el.querySelector('[data-c]'); c2.focus({ preventScroll: true }); c2.onclick = () => kpAsk(job, 0); } }
      else { miss++; KS.no(); kpBuzz(100); b.classList.remove('no'); void b.offsetWidth; b.classList.add('no'); } }); }); }
// ghi như câu đề làm ở phố bậc 3–4 (phMark): ⭐ Chinh phục đề + lịch ôn phố
function kpMark(job, ok) { const de = KP.de, q = job.q, k = job.k; if (typeof tgJ === 'function') tgJ(de).c[q.n] = { s: ok ? 'ok' : 'sai', at: Date.now() };
  const P = kpPst(k), id = `de:${de}:${q.n}`, old = P.it[id], lv = ok ? Math.min(4, ((old && old.lv) || 0) + 1) : 0;
  P.it[id] = { at: Date.now(), lv, d: phDay() + (ok ? PH_HEN[lv - 1] : 1), s: ok ? 1 : 0 }; P.st.kp = (P.st.kp || 0) + 1; save(); }
function kpDone(job, sab) { const N = KP.n;
  if (sab) { N.lightsOut = false; N.saboDone = true; KS.light(); kpToast('💡 Đèn sáng lại!'); if (job === N.extra) N.extra = null; return; }
  job.st = 'done'; N.bar = Math.min(100, N.bar + KP_PLAYER / N.jobs.length); KS.plus();
  const hud = document.getElementById('kphud'); if (hud) { const p = document.createElement('span'); p.className = 'kpplus'; p.textContent = `+${Math.round(KP_PLAYER / N.jobs.length)}`; hud.appendChild(p); setTimeout(() => p.remove(), 1200); }
  const h = document.querySelector(`#kphs [data-kph="${job.k}"]`); if (h) { h.classList.add('burst'); setTimeout(() => h.classList.remove('burst'), 950); } kpEnd(); }

// ---------- màn kịch tính ----------
function kpSplash(big, small, cls, ms, cb) { const el = document.createElement('div'); el.className = 'kpsplash ' + cls; const t = kpRed() ? 900 : ms; el.style.setProperty('--ms', t + 'ms'); el.innerHTML = `<div><b>${big}</b><span>${kpEsc(small)}</span></div>`; document.body.appendChild(el); setTimeout(() => { el.remove(); cb && cb(); }, t); }
function kpType(el, txt, cb) { if (kpRed()) { el.textContent = txt; return cb && setTimeout(cb, 600); } let i = 0; const iv = setInterval(() => { el.textContent = txt.slice(0, ++i); if (i % 2) KS.type(); if (i >= txt.length) { clearInterval(iv); cb && setTimeout(cb, 900); } }, 45); }
function kpEject(t, isImp, cb) { KS.whoosh(); const el = document.createElement('div'); el.className = 'kpspace'; el.innerHTML = `<div class="fly">${phFace(t, 84)}</div><p id="kpej"></p><small id="kpej2"></small>`; document.body.appendChild(el);
  setTimeout(() => kpType(el.querySelector('#kpej'), isImp ? `${kpName(t)} là 🎭 kẻ giả mạo.` : `${kpName(t)} không phải kẻ giả mạo.`, () => { if (isImp) el.querySelector('.fly').innerHTML = KP_MASK;
    el.querySelector('#kpej2').textContent = isImp ? 'Còn 0 kẻ giả mạo.' : 'Còn 1 kẻ giả mạo trong phố.'; isImp ? KS.win() : KS.lose(); setTimeout(() => { el.remove(); cb(); }, 1500); }), kpRed() ? 0 : 900); }
function kpConf() { if (kpRed()) return; const cs = ['#ffd36b', '#ff6fb0', '#5aa0ff', '#7be07b', '#c9b4ff']; for (let i = 0; i < 60; i++) { const c = document.createElement('span'); c.className = 'kpconf'; c.style.cssText = `left:${Math.random() * 100}vw;background:${kpRnd(cs)};--d:${1.8 + Math.random() * 1.8}s;--x:${Math.random() * 120 - 60}px;animation-delay:${Math.random() * .6}s`; document.body.appendChild(c); setTimeout(() => c.remove(), 4200); } }
function kpFound(v) { const N = KP.n; N.paused = true; KS.body(); kpBuzz([80, 60, 160]); const m = document.getElementById('kpmap'); if (m) { m.classList.remove('shake'); void m.offsetWidth; m.classList.add('shake'); }
  kpSplash('💤 CÓ NGƯỜI NGỦ SAY!', `${kpName(v.t)} nằm bất động gần ${KP_SHORT[kpNear(v.p)]}.`, 'body', 1600, () => { KS.gong(); kpMeet({ body: v.t }); }); }

// ---------- họp ----------
function kpMeet(why) { const N = KP.n; N.paused = true;
  const alive = N.bots.filter(b => !b.sleep && !b.out), K = N.kills[N.kills.length - 1], imA = alive.find(b => b.t === N.imp);
  const jn = new Set(N.jobs.map(j => j.q.n)), pool = N.laws.filter(l => !N.lessons.some(x => x.n === l.n));
  const fake = pool.find(l => jn.has(l.n)) || kpRnd(pool.length ? pool : N.laws) || (() => { const f = kpRnd(KP_LAW); return { n: 0, f: f[0], t: f[1], why: '' }; })();
  const truths = kpMix(N.laws.filter(l => l.n !== fake.n)), msgs = [], acc = {};
  msgs.push({ sys: 1, t: why.body ? `Mầm thấy ${kpName(why.body)} ngủ say gần ${KP_SHORT[K && K.v === why.body ? K.at : kpNear(N.bots.find(b => b.t === why.body).p)]}.` : 'Mầm rung chuông khẩn.' });
  if (K && imA) for (const w of K.wit) if (alive.some(b => b.t === w) && Math.random() < .7) { msgs.push({ t: w, acc: 1, x: `Tôi thấy ${kpName(N.imp)} đi về phía ${KP_SHORT[K.at]} ngay trước đó!` }); acc[N.imp] = 1; }
  let framed = null; if (imA) { const c = alive.filter(b => b.t !== N.imp); if (c.length) { framed = kpRnd(c).t; msgs.push({ t: N.imp, acc: 1, x: K ? `Tôi thấy ${kpName(framed)} lảng vảng gần ${KP_SHORT[K.at]}. Đáng nghi lắm!` : `Tôi thấy ${kpName(framed)} cứ đi một mình. Đáng nghi!` }); acc[framed] = 1; } }
  kpMix(alive).forEach((b, i) => { const isImp = b.t === N.imp, real = b.at ? KP_SHORT[b.at] : 'quảng trường', loc = isImp && Math.random() < .5 ? KP_SHORT[kpRnd(Object.keys(KP_POS).filter(x => x !== b.at))] : real;
    const law = isImp ? fake.f : (truths.length ? truths[i % truths.length].t : kpRnd(KP_LAW)[1]);
    msgs.push({ t: b.t, x: `${acc[b.t] ? 'Không phải tôi! ' : ''}Tôi vừa ở ${loc}. Mà nhớ nhé: ${law}` }); });
  kpSheet(`<h2>🔔 Họp phố</h2><p class="mute" style="margin:0">Cư dân thật luôn nói luật đúng. Ai nói luật sai, khai sai chỗ, hay bị nhân chứng tố?</p><div class="kpchat" id="kpchat" aria-live="polite"></div><button class="sec" id="kpskip">Xem hết lời khai</button><div id="kpvz"></div>`, el => {
    const chat = el.querySelector('#kpchat'); let i = 0, tm = null;
    const add = m => { const d = document.createElement('div'); d.className = 'kpmsg' + (m.sys ? ' sys' : '') + (m.acc ? ' acc' : ''); d.innerHTML = m.sys ? `<div class="b">📢 ${kpEsc(m.t)}</div>` : `<span class="f">${phFace(m.t, 34)}</span><div class="b"><b>${kpEsc(kpName(m.t))}</b>${kpEsc(m.x)}</div>`; chat.appendChild(d); KS.type(); };
    const next = () => { if (i >= msgs.length) return vote(); const ty = document.createElement('div'); ty.className = 'kpmsg ty'; ty.innerHTML = '<div class="b"><span class="kptyping"><i></i><i></i><i></i></span></div>'; chat.appendChild(ty);
      tm = setTimeout(() => { ty.remove(); add(msgs[i++]); chat.lastChild.scrollIntoView({ block: 'nearest', behavior: kpRed() ? 'auto' : 'smooth' }); next(); }, kpRed() ? 50 : 650 + Math.random() * 450); };
    el.querySelector('#kpskip').onclick = () => { clearTimeout(tm); chat.querySelectorAll('.ty').forEach(x => x.remove()); while (i < msgs.length) add(msgs[i++]); vote(); };
    const vote = () => { const s = el.querySelector('#kpskip'); if (s) s.remove(); if (el.querySelector('.kpvote')) return; let pick = null;
      el.querySelector('#kpvz').innerHTML = `<h3 style="margin:4px 0 8px">🗳 Bỏ phiếu</h3><div class="kpvote">${alive.map(b => { const s = N.seen[b.t];
        return `<button class="kpvb" data-kv="${b.t}" aria-pressed="false"><span class="f">${phFace(b.t, 40)}</span>${kpEsc(kpName(b.t))}<small>${s ? `👀 thấy ở ${KP_SHORT[s.h]}, ${Math.round(N.t - s.t)} giây trước` : '👀 chưa thấy'}</small><span class="stamps"></span></button>`; }).join('')}</div>
        <div class="btns" style="margin-top:10px"><button class="pri kpmask" data-kvote disabled>Chọn một người</button><button class="sec" data-kskip>Bỏ qua, không đuổi ai</button></div>`;
      el.querySelectorAll('.kpvb').forEach(b => b.onclick = () => { pick = b.dataset.kv; el.querySelectorAll('.kpvb').forEach(x => { x.classList.toggle('on', x === b); x.setAttribute('aria-pressed', x === b); }); const v = el.querySelector('[data-kvote]'); v.disabled = false; v.textContent = `🗳 Đuổi ${kpName(pick)}`; KS.type(); });
      el.querySelector('[data-kvote]').onclick = () => kpTally(el, pick, alive, fake, framed); el.querySelector('[data-kskip]').onclick = () => kpTally(el, null, alive, fake, framed);
      el.querySelector('#kpvz').scrollIntoView({ block: 'start', behavior: kpRed() ? 'auto' : 'smooth' }); };
    next(); }); }
function kpTally(el, my, alive, fake, framed) { const N = KP.n; el.querySelectorAll('.kpvb, [data-kvote], [data-kskip]').forEach(x => x.disabled = true);
  const ballots = [['me', my]]; for (const b of alive) { let v; if (b.t === N.imp) v = framed || kpRnd(alive.filter(x => x.t !== N.imp)).t; else { const r = Math.random(); v = r < .35 ? N.imp : r < .6 ? my : r < .78 ? null : kpRnd(alive.filter(x => x.t !== b.t)).t; } ballots.push([b.t, v]); }
  const cnt = {}; ballots.forEach(([, v]) => cnt[v || '_'] = (cnt[v || '_'] || 0) + 1); let i = 0; const sk = el.querySelector('[data-kskip]');
  const tick = () => { if (i >= ballots.length) return setTimeout(fin, 700); const [w, v] = ballots[i++]; KS.stamp(); const col = w === 'me' ? '#5cbf5c' : `var(--ph${w.toLowerCase()})`, dot = `<span style="background:${col}"></span>`;
    if (v) el.querySelector(`.kpvb[data-kv="${v}"] .stamps`).insertAdjacentHTML('beforeend', dot); else sk.insertAdjacentHTML('beforeend', `<span class="kpsdot" style="background:${col}"></span>`); setTimeout(tick, kpRed() ? 60 : 320); };
  const fin = () => { const arr = Object.entries(cnt).sort((a, b) => b[1] - a[1]), top = arr[0], tie = arr[1] && arr[1][1] === top[1], out = !tie && top[0] !== '_' ? top[0] : null;
    N.lessons.push(fake); kpBayAdd(fake); kpClose(); const after = () => kpLesson(out, fake);
    if (out) { N.bots.find(b => b.t === out).out = true; kpEject(out, out === N.imp, after); } else kpSplash('KHÔNG AI BỊ ĐUỔI', tie ? 'Hoà phiếu.' : 'Nhiều người bỏ qua.', 'meet', 1500, after); };
  tick(); }
function kpBayAdd(l) { if (!l || !l.n) return; const s = kpSt(), L = s.bay[KP.de] = s.bay[KP.de] || []; if (L.some(x => x.n === l.n)) return; L.unshift({ n: l.n, f: l.f, t: l.t, why: l.why }); if (L.length > 40) L.length = 40; save(); }
function kpLesson(out, fake) { const N = KP.n, caught = out === N.imp;
  kpSheet(`<div class="fb kpfbm"><b>📘 Luật sai trong buổi họp</b><br>✗ ${kpEsc(fake.f)}<br>✓ ${kpEsc(fake.t)}${fake.why ? `<br><span class="mute">${kpEsc(fake.why)}</span>` : ''}</div>
    <p class="mute" style="margin:0">Kẻ giả mạo đã nói câu sai này${caught ? '' : '. Bạn có nhận ra không?'} Bẫy vào 🗂 Hồ sơ bẫy của đề.</p>
    <div class="btns"><button class="pri" data-c>${caught ? '🏆 Xem kết quả' : '🌙 Trở lại đêm'}</button></div>`, el => el.querySelector('[data-c]').onclick = () => { kpClose();
    for (const b of N.bots) { if (b.sleep) b.out = true; if (!b.out) { b.p = [KP_PLAZA[0] + (Math.random() * 56 - 28), KP_PLAZA[1] + (Math.random() * 30 - 15)]; b.to = null; b.wait = 1 + Math.random() * 2; b.tgt = null; } }
    KP.me.p = [...KP_PLAZA]; KP.me.to = null; N.cool = Math.max(N.cool, 12); N.paused = false; if (caught) kpOver(true, 'Bạn đuổi được 🎭 kẻ giả mạo.'); else kpEnd(); }); }
function kpEnd() { const N = KP && KP.n; if (!N || N.over) return; if (N.bar >= 100) return kpOver(true, 'Thanh việc chung đã đầy.');
  const crew = N.bots.filter(b => !b.sleep && !b.out && b.t !== N.imp).length + 1, imp = N.bots.some(b => b.t === N.imp && !b.out) ? 1 : 0; if (imp && crew <= imp + 1) return kpOver(false, 'Kẻ giả mạo đã ru ngủ gần hết phố.'); }
function kpOver(win, why) { const N = KP.n; N.over = true; N.paused = true; if (win) { KS.win(); kpConf(); } else KS.lose(); const st = kpSt(); st.n = (st.n || 0) + 1; if (win) st.w = (st.w || 0) + 1; save();
  kpSheet(`<div class="kpbig">${win ? '🏆' : '🌑'}</div><h2 style="text-align:center">${win ? 'Cư dân thắng!' : 'Kẻ giả mạo thắng'}</h2><p style="text-align:center">${kpEsc(why)}</p>
    <div class="kprole" style="justify-content:center"><span class="f">${phFace(N.imp, 56)}</span><div>🎭 Kẻ giả mạo là<br><b style="font-size:18px">${kpEsc(kpName(N.imp))}</b></div></div>
    <div class="fb"><b>Đêm nay bạn học</b><br>Câu làm đúng: ${N.right} · sai: ${N.wrong}${N.lessons.length ? `<br>🗂 Bẫy đã gặp:<br>${N.lessons.map(l => `✗ ${kpEsc(l.f)} → ✓ ${kpEsc(l.t)}`).join('<br>')}` : ''}</div>
    <p class="mute" style="margin:0">Câu đúng đã được ⭐ ở ⚔️ Chinh phục đề; câu sai hẹn ôn ngày mai ở phố của nó.</p>
    <div class="btns"><button class="pri" data-n>🌙 Chơi đêm mới</button><button class="sec" data-x>Về bản đồ</button></div>`, el => { el.querySelector('[data-n]').onclick = () => { kpClose(); kpStop(); KP.n = null; cyView().then(() => kpNight()); }; el.querySelector('[data-x]').onclick = () => { kpClose(); kpStop(); KP.n = null; cyView(); }; }); }

// ---------- tấm trượt ----------
function kpSheet(html, bind) { kpClose(); const el = document.createElement('div'); el.className = 'kpsheet'; el.id = 'kpsheet'; el.innerHTML = `<div class="in" role="dialog" aria-modal="true">${html}</div>`; document.body.appendChild(el); bind && bind(el.querySelector('.in')); const f = el.querySelector('button:not(:disabled)'); f && f.focus({ preventScroll: true }); }
function kpClose() { const el = document.getElementById('kpsheet'); if (el) { el.remove(); if (KP && KP.n && !KP.n.over) scrollTo(0, 0); } }
document.addEventListener('visibilitychange', () => { if (!document.hidden && KA.c && kpSt && S) KA.c = acFix(KA.c); });
