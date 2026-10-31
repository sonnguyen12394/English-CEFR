// 🧭 Điều hướng theo việc người học làm (v95, 31/10/2026; giáo viên tiếng Anh + thiết kế di động; người sáng lập "làm hết đi").
// 4 tab: 🎯 Học (Hôm nay + 7 phần + Thư viện) · 🎓 Luyện thi (🎓 Cambridge · 🌏 IELTS · 💼 TOEIC; mỗi kỳ thi có 📘 Cẩm nang) ·
// 📖 Tra cứu (từ, ngữ pháp, phát âm, 🎯 mẹo theo kỹ năng) · 👤 Của tôi (tiến độ, 🗺 chỗ yếu, 📌 sổ từ, 📒 sổ lỗi, kết quả thi thật, góp ý, dữ liệu).
// Mỗi thứ có MỘT chỗ ở chính; nơi khác chỉ đặt lối tắt. Không đổi luật đo (📘 Học / 🔁 Nhớ / Thi chuyển cấp).

// ---------- 🎓 Luyện thi → 🎓 Cambridge (CEFR): trước nằm trong mục 🧰 của Tổng quan ----------
let CB_LV = null;
// nút "về" của các công cụ luyện thi Cambridge (đề thử, dạng đề, nghe điền, nói cặp, đề mẫu, đọc nghe thêm)
const exHome = lv => cbView(lv);
async function cbView(lv) { BACK = null; window.CUR = { view: 'cambridge' }; EXAM_VOX = false;
  if (!(PA && Object.values(KIT).every(P => P.items))) { $app.innerHTML = '<div id="ie"></div><p class="mute">Đang tải…</p>'; try { await Promise.all([paLoad(), ...Object.values(KIT).map(kLoad)]); } catch (e) {} }
  const stage = ovStage(); if (lv && OV_LV.includes(lv)) CB_LV = lv; lv = CB_LV && OV_LV.includes(CB_LV) ? CB_LV : stage;
  const ids = OV.filter(([id]) => ovIn(id, lv)), done = ids.filter(([id]) => ovPassed(id, lv)).length, ready = done >= Math.min(3, ids.length);
  const chip = l => `<button class="chip ${l === lv ? 'on' : ''}" data-cbl="${l}">${l === stage ? '▶ ' : ''}${LVN[l]}</button>`;
  $app.innerHTML = `<div id="ie"></div>${typeof exSwitch === 'function' ? exSwitch('cefr') : ''}<h1>🎓 Thi Cambridge (CEFR)</h1>
    <p class="mute" style="margin:0 0 6px">Đề thử theo khuôn Pre A1 Starters → C2 Proficiency, dạng đề thật, sẵn sàng thi. Học các phần ở 🎯 Học là chính; ở đây để luyện thi.</p>
    <div class="chips">${OV_LV.map(chip).join('')}</div>
    <button data-cnv="cefr">📘 Cẩm nang thi: mẹo Nghe · Nói · Đọc · Viết, thể loại bài Viết</button>
    ${typeof MOCK !== 'undefined' && MOCK[lv] ? `<div class="box"><div class="row"><b>🎓 Đề thử ${esc(MOCK[lv].name)}</b><span class="mute">${(S.mock && S.mock[lv] || []).length ? `đã làm ${S.mock[lv].length} lần` : 'chưa làm'}</span></div><p class="mute" style="margin:6px 0">Khuôn, thời gian như đề thật; câu bốc ngẫu nhiên mỗi lần.</p><button class="pri" data-mock="${lv}">🎓 Làm đề thử</button></div>` : ''}
    ${typeof uoeBox === 'function' ? uoeBox(lv) : ''}${typeof ngBox === 'function' ? ngBox(lv) : ''}${typeof capBox === 'function' ? capBox(lv) : ''}
    ${ready && typeof realBox === 'function' ? realBox(lv) : `<p class="mute">📝 Đề mẫu chính thức và 🎯 Sẵn sàng thi mở khi ≥ 3 phần của ${LVN[lv]} qua 🚪 Thi chuyển cấp (đã qua ${done}/${ids.length}).</p>`}
    ${typeof readyBox === 'function' ? (ready ? readyBox(lv) : '') + extBox(lv) : ''}
    <p class="mute">Không phải đề Cambridge chính thức: câu do app soạn (🤖 chưa giáo viên kiểm). Đề mẫu chính thức ở ô 📝.</p>`;
  $app.onclick = e => { const c = e.target.closest('[data-cbl]'); if (c) { scrollTo(0, 0); return cbView(c.dataset.cbl); } const mk = e.target.closest('[data-mock]'); if (mk) return mockView(mk.dataset.mock); }; }

// ---------- 👤 Của tôi: chỗ ở chính của tiến độ, chỗ yếu, sổ từ, sổ lỗi, kết quả thi thật, góp ý, dữ liệu ----------
async function minhView() { BACK = null; window.CUR = { view: 'cua-toi' };
  if (!(PA && Object.values(KIT).every(P => P.items))) { $app.innerHTML = '<div id="bk"></div><p class="mute">Đang tải…</p>'; try { await Promise.all([paLoad(), ...Object.values(KIT).map(kLoad)]); } catch (e) {} }
  const now = Date.now(), t = dayOf(now), stage = ovStage(), mins = [...Array(7)].reduce((s, _, i) => s + actMin(t - i), 0);
  const nW = Object.keys(S.cards || {}).length, nK = Object.values(S.k || {}).reduce((s, k) => s + Object.keys(k.cards || {}).length, 0);
  const passedLv = OV_LV.filter(l => { const has = OV.filter(([id]) => ovIn(id, l)); return has.length && has.every(([id]) => ovPassed(id, l)); });
  const f = typeof mapFocus === 'function' && (nW || nK) ? mapFocus(now) : null, vn = typeof vwSt === 'function' ? vwSt().length : 0, vd = typeof vwDue === 'function' ? vwDue(now).length : 0;
  // kết quả đề thật: IELTS (nhập theo từng câu / tổng), TOEIC, Cambridge (đề mẫu chính thức)
  const ie = S.ie || {}, th = (ie.th || []).slice(-3).reverse(), ioff = (ie.off || []).filter(r => !r.name).slice(-2).reverse(), toff = ((S.to || {}).off || []).slice(-2).reverse();
  const cb = Object.entries(S.real || {}).flatMap(([l, rs]) => rs.slice(-1).map(r => [l, r])), RN = typeof REAL !== 'undefined' ? REAL : {};
  const real = [...th.map(r => `🌏 IELTS ${r.sk === 'L' ? 'Listening' : 'Reading'} · ${esc(r.name)}: ${r.ok}/40 · band ${bandTxt(r.band)}`),
    ...ioff.map(r => `🌏 IELTS đề thật: ${r.L != null ? 'L ' + bandTxt(r.L) : ''} ${r.R != null ? 'R ' + bandTxt(r.R) : ''}`),
    ...toff.map(r => `💼 TOEIC đề thật: L ${r.L} · R ${r.R}`), ...cb.map(([l, r]) => `🎓 ${esc((RN[l] || {}).name || LVN[l])}: Nghe ${r.l}/${r.L} · Đọc / Viết ${r.rw}/${r.RW}`)];
  $app.innerHTML = `<div id="bk"></div><h1>👤 Của tôi</h1><p class="mute"><span id="sync">${esc(sync)}</span></p>
    ${typeof hdView === 'function' ? '<button data-hdv>📘 Luật và cách dùng: học thế nào, tính điểm ra sao</button>' : ''}
    <div class="box"><b>📈 Tiến độ</b><p style="margin:6px 0">Cấp đang học: <b>${LVN[stage]}</b>${passedLv.length ? ` · đã đạt: ${passedLv.map(l => LVN[l]).join(', ')}` : ''}</p>
      <p class="mute" style="margin:0">📚 ${nW} từ đã học · 🧩 ${nK} bài kỹ năng · ⏱ hôm nay ${actMin(t)} / ${actGoal()} phút · 7 ngày ${mins} phút · 🔥 ${actStreak(now)} ngày liền</p></div>
    <div class="box"><div class="row"><b>🗺 Bản đồ chỗ yếu</b><span class="mute">${f ? `🎯 ${f.act.length} · ⏳ ${f.queue.length} · ✅ ${f.done}` : 'chưa có dữ liệu'}</span></div>
      <p class="mute" style="margin:6px 0">Gom mọi lần làm sai / quên thành chỗ cần chữa, mỗi lần tối đa 15 chỗ.</p><button data-mapv="ct">🗺 Mở bản đồ</button></div>
    <div class="box"><div class="row"><b>📌 Sổ từ</b><span class="mute">${vn} từ${vd ? ` · ${vd} đến hạn` : ''}</span></div>
      <p class="mute" style="margin:6px 0">Từ bạn lưu khi tra, khi chạm trong bài và từ đề thật. Ôn cách quãng 1 → 35 ngày.</p>
      <div class="duo"><button data-ct="sotu">📌 Mở sổ từ</button>${vd ? `<button class="pri" data-ct="vwrun">🔁 Ôn ${Math.min(20, vd)} từ</button>` : ''}</div></div>
    ${typeof errBox === 'function' ? errBox('ct') : ''}
    <div class="box"><b>📊 Kết quả thi thật</b>${real.length ? real.map(x => `<p style="margin:4px 0;font-size:15px">${x}</p>`).join('') : '<p class="mute" style="margin:6px 0 0">Chưa ghi đề thật nào. Làm đề chính thức (sách Cambridge IELTS, đề mẫu Cambridge, đề ETS) rồi ghi ở 🎓 Luyện thi: kết quả thật là thước đo đáng tin nhất.</p>'}</div>
    <button data-ct="data">💾 Dữ liệu, tài khoản và sao lưu</button>
    ${typeof gyHomeHtml === 'function' ? gyHomeHtml() : ''}`;
  $app.onclick = e => { const b = e.target.closest('[data-ct]'); if (!b) return; scrollTo(0, 0); const a = b.dataset.ct;
    if (a === 'sotu') return sotuView(minhView); if (a === 'vwrun') return vwRun(Date.now(), minhView); if (a === 'data') return backup(); }; }

// ---------- 📅 Hôm nay: MỘT hàng ôn chung (sổ lỗi → sổ từ → bài CEFR đến hạn) ----------
// Mỗi loại vẫn chấm và xếp lịch theo cách riêng; chỉ gom lối vào. Dừng giữa chừng ("← Thôi") thì về Tổng quan.
function revCount(now = Date.now()) { const e = typeof errDue === 'function' ? errDue(now).length : 0, v = typeof vwDue === 'function' ? vwDue(now).length : 0, c = typeof todayDue === 'function' ? todayDue() : null;
  return { e, v, c, n: e + v + (c || 0) }; }
// phần có nhiều bài CEFR đến hạn nhất (cấp đang học của phần), như "Nên làm" cũ
function revPart() { if (!(PA && Object.values(KIT).every(P => P.items))) return null;
  const r = OV.map(([id]) => { const l = id === 'tv' ? curLevel() : id === 'pa' ? paLevel() : kLv(KIT[id]), s = ovStat(id, l); return [id, l, s ? s.due : 0]; }).filter(x => x[2]).sort((a, b) => b[2] - a[2])[0];
  return r ? [r[0], r[1]] : null; }
function ovOpenPart(id, l) { scrollTo(0, 0); if (id === 'tv') { HOME.lv = l; HOME.open = null; return home(); } if (id === 'pa') PA_VIEW = l; else if (KIT[id]) KIT[id].view = l; partView(id); }
function revRun() { const R = revCount(), steps = [], quit = () => overview();
  if (R.e) steps.push(next => errRun(next, quit)); if (R.v) steps.push(next => vwRun(Date.now(), next, quit));
  const last = () => { const p = revPart(); if (p) return ovOpenPart(p[0], p[1]); toast('✅ Đã ôn hết mục đến hạn hôm nay.'); overview(); };
  const go = i => i < steps.length ? steps[i](() => go(i + 1)) : last(); scrollTo(0, 0); go(0); }
document.addEventListener('click', e => { if (S && e.target.closest('[data-rev]')) revRun(); });
