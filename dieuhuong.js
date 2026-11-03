// 🧭 Điều hướng theo việc người học làm (v95, 31/10/2026; giáo viên tiếng Anh + thiết kế di động; người sáng lập "làm hết đi").
// 4 tab (v105 thêm 🔄 Lộ trình, lotrinh.js): 🎯 Học (Hôm nay + 7 phần + Thư viện) · 🎓 Luyện thi (🎓 Cambridge · 🌏 IELTS · 💼 TOEIC; mỗi kỳ thi có 📘 Cẩm nang) ·
// 📖 Tra cứu (từ, ngữ pháp, phát âm, 🎯 mẹo theo kỹ năng) · 👤 Của tôi (tiến độ, 🗺 chỗ yếu, 📌 sổ từ, 📒 sổ lỗi, kết quả thi thật, góp ý, dữ liệu).
// Mỗi thứ có MỘT chỗ ở chính; nơi khác chỉ đặt lối tắt. Không đổi luật đo (📘 Học / 🔁 Nhớ / Thi chuyển cấp).

// ---------- 🎓 Luyện thi → 🎓 Cambridge (CEFR): trước nằm trong mục 🧰 của Tổng quan ----------
let CB_LV = null;
// nút "về" của các công cụ luyện thi Cambridge (đề thử, dạng đề, nghe điền, nói cặp, đề mẫu, đọc nghe thêm)
const exHome = lv => cbView(lv);
// v122 (người sáng lập: "thiết kế bài học ở nền và mục tiêu ko đồng nhất"): màn Cambridge theo khuôn Nền (parts.js xHome): chip cấp → dòng đề thử có thanh →
// ô theo bài thi của khuôn đề thử (MOCK[cấp]: Đọc / Viết / Nghe / Nói) → "Thêm" gập (thi thử cả đề, đề mẫu chính thức, sẵn sàng thi, đọc nghe thêm, bản đồ, cẩm nang).
// Mỗi ô mở màn bài thi cbSkView (cbmap.js). Bỏ nút to ▶ Làm đề thử (v113): việc nên làm ở 🧭 Lộ trình.
async function cbView(lv) { BACK = null; window.CUR = { view: 'cambridge' }; EXAM_VOX = false;
  if (!(PA && Object.values(KIT).every(P => P.items))) { $app.innerHTML = '<div id="ie"></div><p class="mute">Đang tải…</p>'; try { await Promise.all([paLoad(), ...Object.values(KIT).map(kLoad)]); } catch (e) {} }
  try { await cbMapLoad(); } catch (e) {}
  const stage = ovStage(); if (lv && OV_LV.includes(lv)) CB_LV = lv; lv = CB_LV && OV_LV.includes(CB_LV) ? CB_LV : (typeof plTop === 'function' && plTop(stage)) || stage;   // v99: chưa chọn cấp thì mở ở cấp 🧭 xếp được
  const ids = OV.filter(([id]) => ovIn(id, lv)), done = ids.filter(([id]) => ovPassed(id, lv)).length, ready = done >= Math.min(3, ids.length);
  const chip = l => `<button class="chip ${l === lv ? 'on' : ''}" data-cbl="${l}">${l === stage ? '▶ ' : ''}${LVN[l]}</button>`, M = typeof MOCK !== 'undefined' && MOCK[lv];
  const runs = M ? cbRuns(lv) : [], last = runs.filter(r => r.pct != null).pop(), tiles = M ? M.papers.map((p, pi) => cbTile(lv, pi)) : [];
  let sp = null; try { sp = exGoalK() === 'cefr' && typeof ltSplit === 'function' ? ltSplit() : null; } catch (e) {}
  $app.innerHTML = '<div id="ie"></div>' + xHome({ sw: exSwitch('cefr'), chips: `<div class="chips">${OV_LV.map(chip).join('')}</div>`, t: `🎓 Cambridge ${LVN[lv]}`,
    pv: last ? `đề thử ${last.pct}% · cần ~${Math.round(M.pass * 100)}%` : 'chưa làm đề thử', pct: last ? Math.min(100, Math.round(last.pct / (M.pass * 100) * 100)) : tiles.length ? Math.round(tiles.reduce((t, x) => t + x.pct, 0) / tiles.length) : 0,
    sub: `${M ? esc(M.name) + ' · ' : ''}đề kiểu Cambridge do app soạn`,
    note: sp && !sp.ex ? `<div class="box" style="margin:0 0 12px"><b>⚖️ Nền còn thiếu xa (cần ${LVN[ltGoalLv()]})</b><p class="mute" style="margin:4px 0">🧭 Lộ trình chưa xếp giờ luyện đề: học nền trước. Vẫn xem và thử được.</p><button data-hocnen style="margin:4px 0 0">🧱 Học nền trước</button></div>` : M ? '' : '<p class="mute">Cấp này chưa có khuôn đề thử.</p>',
    tiles, more: [['🎓 Thi thử cả đề', M ? `<p class="mute" style="margin:0 0 6px">Khuôn, giờ như đề thật: ${M.papers.map(p => `${p.t} ${p.min} phút`).join(' · ')}. Câu bốc ngẫu nhiên từ kho app.${runs.length ? ` Đã làm ${runs.length} lần.` : ''} Làm từng bài thi: bước ③ ở màn mỗi bài thi.</p><button class="pri" data-mock="${lv}">▶ Làm đề thử</button>` : ''],
      ['📝 Đề mẫu chính thức', ready && typeof realBox === 'function' ? realBox(lv) : `<p class="mute" style="margin:0">🔒 ${done}/${Math.min(3, ids.length)} · Đề mẫu chính thức và 🎯 Sẵn sàng thi mở khi ≥ 3 phần của ${LVN[lv]} qua 🚪 Thi chuyển cấp ở 🧱 Nền (đã qua ${done}/${ids.length}).</p>`],
      ['🎯 Sẵn sàng thi', ready && typeof readyBox === 'function' ? readyBox(lv) : ''],
      ['📚 Đọc nghe thêm ngoài app', typeof extBox === 'function' ? extBox(lv) : ''],
      ['🗺 Bản đồ phần yếu', typeof cbMap === 'function' ? `<button class="link" data-mapv="lt" data-mapk="cb" data-cbmlv="${lv}" style="margin:0">🗺 Bản đồ phần yếu: ở 🧭 Lộ trình → 🗺 Chỗ yếu ›</button>` : ''],
      ['📘 Cẩm nang thi', '<button data-cnv="cefr">📘 Cẩm nang thi: mẹo Nghe · Nói · Đọc · Viết, thể loại bài Viết</button>']],
    foot: 'Không phải đề Cambridge chính thức: câu do app soạn (🤖 chưa giáo viên kiểm). Đề mẫu chính thức ở mục 📝 (trong Thêm).' });
  $app.onclick = cbClick; }

// ---------- 👤 Của tôi: chỗ ở chính của tiến độ, chỗ yếu, sổ từ, sổ lỗi, kết quả thi thật, góp ý, dữ liệu ----------
async function minhView() { BACK = null; window.CUR = { view: 'cua-toi' };
  if (!(PA && Object.values(KIT).every(P => P.items))) { $app.innerHTML = '<div id="bk"></div><p class="mute">Đang tải…</p>'; try { await Promise.all([paLoad(), ...Object.values(KIT).map(kLoad)]); } catch (e) {} }
  const now = Date.now(), t = dayOf(now), stage = ovStage(), mins = [...Array(7)].reduce((s, _, i) => s + actMin(t - i), 0);
  const nW = Object.keys(S.cards || {}).length, nK = Object.values(S.k || {}).reduce((s, k) => s + Object.keys(k.cards || {}).length, 0);
  // v97: "hoàn thành trong app" (phần bắt buộc qua thi) tách khỏi "đạt" (đề mẫu chính thức của Cambridge, realOk)
  const passedLv = OV_LV.filter(ovDone), realLv = typeof realOk === 'function' ? OV_LV.filter(l => (S.real && S.real[l] || []).some(realOk)) : [];
  const f = typeof mapFocus === 'function' && (nW || nK) ? mapFocus(now) : null, vn = typeof vwSt === 'function' ? vwSt().length : 0, vd = typeof vwDue === 'function' ? vwDue(now).length : 0;
  // kết quả đề thật: IELTS (nhập theo từng câu / tổng), TOEIC, Cambridge (đề mẫu chính thức)
  const ie = S.ie || {}, th = (ie.th || []).slice(-3).reverse(), ioff = (ie.off || []).filter(r => !r.name).slice(-2).reverse(), toff = ((S.to || {}).off || []).slice(-2).reverse();
  const cb = Object.entries(S.real || {}).flatMap(([l, rs]) => rs.slice(-1).map(r => [l, r])), RN = typeof REAL !== 'undefined' ? REAL : {};
  const real = [...th.map(r => `🌏 IELTS ${r.sk === 'L' ? 'Listening' : 'Reading'} · ${esc(r.name)}: ${r.ok}/40 · band ${bandTxt(r.band)}`),
    ...ioff.map(r => `🌏 IELTS đề thật: ${r.L != null ? 'L ' + bandTxt(r.L) : ''} ${r.R != null ? 'R ' + bandTxt(r.R) : ''}`),
    ...toff.map(r => `💼 TOEIC đề thật: L ${r.L} · R ${r.R}`), ...cb.map(([l, r]) => `🎓 ${esc((RN[l] || {}).name || LVN[l])}: Nghe ${r.l}/${r.L} · Đọc / Viết ${r.rw}/${r.RW}`)];
  $app.innerHTML = `<div id="bk"></div><h1>👤 Của tôi</h1><p class="mute"><span id="sync">${esc(sync)}</span></p>
    ${typeof hdView === 'function' ? '<button data-hdv>📘 Luật và cách dùng: học thế nào, tính điểm ra sao</button>' : ''}
    <div class="box"><b>📈 Tiến độ</b><p style="margin:6px 0">Cấp đang học: <b>${LVN[stage]}</b>${typeof plTop === 'function' && plTop(stage) ? ` · 🧭 xếp cấp: ${LVN[plTop(stage)]}` : ''}${passedLv.length ? ` · hoàn thành trong app: ${passedLv.map(l => LVN[l]).join(', ')}` : ''}</p>
      <p style="margin:0 0 6px">🎓 Đạt bằng đề mẫu chính thức: ${realLv.length ? `<b>${realLv.map(l => LVN[l]).join(', ')}</b>` : '<span class="mute">chưa có (làm ở màn 🎓 Cambridge)</span>'}</p>
      <p class="mute" style="margin:0">📚 ${nW} từ đã học · 🧩 ${nK} bài kỹ năng · ⏱ hôm nay ${actMin(t)} / ${actGoal()} phút · 7 ngày ${mins} phút · 🔥 ${actStreak(now)} ngày liền</p></div>
    <p class="mute" style="margin:4px 0 10px">🗺 Chỗ yếu${f ? ` (${f.act.length} chỗ đang chữa)` : ''} nằm ở <button class="link" data-mapv="lt">🧭 Lộ trình → 🗺 Chỗ yếu ›</button></p>
    <div class="box"><div class="row"><b>📌 Sổ từ</b><span class="mute">${vn} từ${vd ? ` · ${vd} đến hạn` : ''}</span></div>
      <p class="mute" style="margin:6px 0">Từ bạn lưu khi tra, khi chạm trong bài và từ đề thật. Ôn cách quãng 1 → 35 ngày.</p>
      <div class="duo"><button data-ct="sotu">📌 Mở sổ từ</button>${vd ? `<button class="pri" data-ct="vwrun">🔁 Ôn ${Math.min(20, vd)} từ</button>` : ''}</div></div>
    ${typeof errBox === 'function' ? errBox('ct') : ''}
    <div class="box"><b>📊 Kết quả thi thật</b>${real.length ? real.map(x => `<p style="margin:4px 0;font-size:15px">${x}</p>`).join('') : '<p class="mute" style="margin:6px 0 0">Chưa ghi đề thật nào. Làm đề chính thức (sách Cambridge IELTS, đề mẫu Cambridge, đề ETS) rồi ghi ở màn kỳ thi của mục tiêu (📚 Học → ô 🎯): kết quả thật là thước đo đáng tin nhất.</p>'}</div>
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
function revRun(back) { const R = revCount(), steps = [], quit = () => (typeof back === 'function' ? back : overview)();
  if (R.e) steps.push(next => errRun(next, quit)); if (R.v) steps.push(next => vwRun(Date.now(), next, quit));
  const last = () => { const p = revPart(); if (p) return ovOpenPart(p[0], p[1]); toast('✅ Đã ôn hết mục đến hạn hôm nay.'); quit(); };
  const go = i => i < steps.length ? steps[i](() => go(i + 1)) : last(); scrollTo(0, 0); go(0); }
document.addEventListener('click', e => { const b = S && e.target.closest('[data-cbgo]'); if (b) { scrollTo(0, 0); cbView(b.dataset.cbgo); } });   // 📝 đề mẫu chính thức từ thẻ cấp ở 📚 Học
document.addEventListener('click', e => { if (S && e.target.closest('[data-rev]')) revRun(document.getElementById('lt') && typeof ltView === 'function' ? ltView : undefined); });   // v108: ô Hôm nay ở 🔄 Lộ trình thì về Lộ trình
