// v155 🛡️ Kiểm đề (specs/012-so-loi-soan-de, contracts/ui.md): tab thứ 6, ai cũng thấy. Sổ lỗi đã tìm và sửa khi soạn / làm thử 8 đề thử TOEIC trọn,
//   mỗi loại có ví dụ thật trước → sau, bắt bằng gì, luật để không lặp lại. Dữ liệu tĩnh kiemde.json (dựng từ content/toeic/so-loi.json bằng tools/build-toeic.mjs).
//   Mỗi mục có ✓ Đúng ý / ✗ Chưa đúng + ghi chú: lưu S.kd (dấu trên máy) và xếp hàng một góp ý (bảng gopy, kind 'khac', ctx.view 'kiemde') để Claude đọc.
//   Không đổi luật đo, không gọi AI.
let KD = null, KD_F = '', KD_OPEN = new Set(), KD_NO = null;
const KD_TT = { chan: ['🔒', 'Máy chặn'], nhac: ['🔔', 'Máy nhắc'], nho: ['👁', 'Người soát'], mo: ['⏳', 'Còn mở'] };
const KD_KH = [['', 'Tất cả'], ['soan', 'Khi soạn'], ['lam', 'Khi làm đề'], ['hien', 'Hiển thị'], ['mo', 'Còn mở']];
const KD_BAT = { dung: 'bộ dựng', kiem: 'máy kiểm', giaimu: 'giải mù', tusoat: 'Claude tự soát', nguoi: 'người sáng lập' };
const KD_MUC = { loi: 'máy chặn', canh: 'máy nhắc', nguoi: 'người soát' };
const kdDe = d => /^de\d+$/.test(d) ? 'Đề ' + d.slice(2) : d === 'kho' ? 'Kho luyện' : d;
async function kdLoad() { if (KD) return KD; try { const r = await fetch('kiemde.json?v=' + APP_V); if (r.ok) KD = await r.json(); } catch (e) {} return KD; }
async function kdView() { window.CUR = { view: 'kiemde' }; BACK = null;
  if (!KD) { $app.innerHTML = '<div id="kd"></div><h1>🛡️ Kiểm đề</h1><p class="mute">Đang tải…</p>'; await kdLoad();
    if (!KD) { $app.innerHTML = '<div id="kd"></div><h1>🛡️ Kiểm đề</h1><div class="box"><p style="margin:0">Không tải được sổ lỗi. Kiểm tra mạng rồi thử lại.</p></div><button data-kdre>Thử lại</button>'; $app.onclick = e => { if (e.target.closest('[data-kdre]')) kdView(); }; return; } }
  const D = KD.de || [], ok = D.every(d => !d.loi && !d.canh), gm = D.every(d => d.gm && d.gm.tong && d.gm.khop === d.gm.tong), dm = KD.dem || {};
  $app.innerHTML = `<div id="kd"></div><h1>🛡️ Kiểm đề</h1>
    <p class="mute" style="margin:0 0 10px">Lỗi đã tìm và sửa khi soạn, khi làm thử ${D.length} đề thử TOEIC trọn, kèm luật để không lặp lại.</p>
    <div class="box kdsum"><div class="kdn"><b>${dm.tong || 0}</b><small>loại lỗi</small></div><div class="kdn"><b>${(dm.chan || 0) + (dm.nhac || 0)}</b><small>máy tự bắt</small></div><div class="kdn"><b>${dm.mo || 0}</b><small>còn mở</small></div>
      <p class="kdst">${D.length} đề: máy kiểm ${ok ? '0 lỗi' : 'còn lỗi'} · giải mù ${gm ? '200/200 câu mỗi đề' : 'chưa đủ'}</p>
      <details class="kdde"><summary>Từng đề</summary><table class="kdtab"><thead><tr><th>Đề</th><th>Lỗi</th><th>Nhắc</th><th>Giải mù vòng đầu</th><th>Giải lại</th></tr></thead><tbody>${D.map(d => `<tr><td>${esc(d.t)}</td><td>${d.loi}</td><td>${d.canh}${d.xem ? ` <small class="mute">(+${d.xem} đã xem)</small>` : ''}</td><td>${d.gm.dau[0]}/${d.gm.dau[1]}</td><td>${d.gm.lai[1] ? d.gm.lai[0] + '/' + d.gm.lai[1] + ' câu' : '–'}</td></tr>`).join('')}</tbody></table></details></div>
    <div class="chips tap" role="group" aria-label="Lọc theo khâu">${KD_KH.map(([k, l]) => `<button class="chip${KD_F === k ? ' on' : ''}" data-kdf="${k}" aria-pressed="${KD_F === k}">${l}</button>`).join('')}</div>
    <div id="kdl">${kdList()}</div>
    <p class="mute kdfoot">Nội dung đề do Claude soạn, chưa giáo viên kiểm. Giải mù cũng do một phiên Claude khác làm. Bộ tiêu chí đầy đủ: docs/TIEU-CHI-DE-TOEIC.md${KD.ngay ? ' · cập nhật ' + new Date(KD.ngay).toLocaleDateString('vi-VN') : ''}.</p>`;
  $app.onclick = kdClick; }
function kdList() { const M = (KD.muc || []).filter(m => !KD_F || (KD_F === 'mo' ? m.tt === 'mo' : m.khau === KD_F && m.tt !== 'mo'));
  if (!M.length) return '<p class="mute">Không có mục nào ở đây.</p>';
  return (KD.nhom || []).map(g => { const L = M.filter(m => m.nhom === g.id); return L.length ? `<h2 class="kdh">${esc(g.t)} <span class="mute">· ${L.length}</span></h2>${L.map(kdItem).join('')}` : ''; }).join(''); }
function kdItem(m) { const [ic, tl] = KD_TT[m.tt] || ['', ''], n = (m.gap || []).reduce((a, g) => a + g.n, 0), fb = (S && S.kd || {})[m.ma], open = KD_OPEN.has(m.ma);
  const luat = (m.luat || []).map(l => { const r = (KD.luat || {})[l] || {}; return `<li><code>${esc(l)}</code> ${esc(r.ten || '')} <span class="mute">· ${KD_MUC[r.muc] || ''}</span></li>`; }).join('');
  return `<details class="kdi" data-kdi="${esc(m.ma)}"${open ? ' open' : ''}><summary><span class="kdt"><b>${esc(m.ten)}</b><small><span class="kdtt ${m.tt}">${ic} ${tl}</span> · gặp ${n} lần${fb ? ` · <span class="${fb.v ? 'kdok' : 'kdno'}">${fb.v ? '✓ đúng ý' : '✗ chưa đúng'}</span>` : ''}</small></span></summary>
    <div class="kdb"><p>${esc(m.mo)}</p>
      <h3>Ví dụ</h3>${(m.vd || []).map(v => `<div class="kdvd"><small class="mute">${esc(kdDe(v.de))}${v.id ? ' · ' + esc(v.id) : ''} · ${esc(KD_BAT[v.ai] || v.ai)} tìm ra</small><p class="kdtr"><b aria-hidden="true">✗</b> Trước: ${esc(v.truoc)}</p><p class="kdsa"><b aria-hidden="true">✓</b> Sau: ${esc(v.sau)}</p></div>`).join('')}
      <p><b>Bắt bằng:</b> ${(m.bat || []).map(b => esc(KD_BAT[b] || b)).join(', ')}</p>
      <p><b>Đã gặp:</b> ${(m.gap || []).map(g => esc(kdDe(g.de)) + ' (' + g.n + ')').join(', ')}</p>
      <p style="margin-bottom:2px"><b>Luật để không lặp lại:</b></p><ul class="kdlu">${luat}</ul>
      ${m.tt === 'mo' ? `<p style="margin-bottom:2px"><b>Cần người sáng lập chọn:</b></p><ul class="kdlu">${(m.pa || []).map(p => `<li>${esc(p.t)} <span class="mute">· ${esc(p.gia)}</span></li>`).join('')}</ul>` : ''}
      <div class="kdfb" role="group" aria-label="Bạn thấy mục này đúng ý chưa?"><button class="${fb && fb.v === 1 ? 'on ' : ''}kdbt" data-kdv="${esc(m.ma)}|1" aria-pressed="${!!(fb && fb.v === 1)}">✓ Đúng ý</button><button class="${fb && fb.v === 0 ? 'on ' : ''}kdbt" data-kdv="${esc(m.ma)}|0" aria-pressed="${!!(fb && fb.v === 0)}">✗ Chưa đúng</button></div>
      ${KD_NO === m.ma ? `<label class="kdnl" for="kdn-${esc(m.ma)}">Chỗ nào chưa đúng ý?</label><textarea id="kdn-${esc(m.ma)}" rows="3" placeholder="Viết vài chữ cho Claude">${esc(fb && fb.v === 0 ? fb.n || '' : '')}</textarea><button class="primary" data-kds="${esc(m.ma)}">Gửi</button>` : ''}
      ${fb ? `<p class="mute kdmsg">${fb.v ? 'Đã ghi ✓' : 'Đã ghi ✗' + (fb.n ? ': ' + esc(fb.n) : '')}${fb.q ? ' · sẽ gửi khi có mạng' : ' · đã gửi cho Claude'}</p>` : ''}</div></details>`; }
function kdRedraw(ma) { const el = document.querySelector(`[data-kdi="${CSS.escape(ma)}"]`), m = (KD.muc || []).find(x => x.ma === ma); if (!el || !m) return kdView();
  const t = document.createElement('div'); t.innerHTML = kdItem(m); el.replaceWith(t.firstElementChild); }
// ghi dấu + xếp hàng góp ý (gopy.js); đổi ý thì gửi dòng mới, Claude lấy dòng mới nhất của mỗi mã
async function kdMark(ma, v, n) { S.kd = Object.assign({}, S.kd, { [ma]: { v, n: n || '', at: Date.now(), q: 1 } }); try { save(); } catch (e) {}
  const it = { id: Math.random().toString(36).slice(2, 12), kind: 'khac', txt: `🛡️ Kiểm đề · ${ma} · ${v ? '✓ Đúng ý' : '✗ Chưa đúng' + (n ? ': ' + n : '')}`.slice(0, 4000), ctx: { view: 'kiemde', ma, v, kd: KD && KD.ngay }, imgs: [], t: Date.now() };
  if (typeof gyLS === 'function') { const q = gyLS(GY_LS); q.push(it); gyLS(GY_LS, q); try { await gyFlush(); } catch (e) {}
    if (!gyLS(GY_LS).some(x => x.id === it.id)) { S.kd = Object.assign({}, S.kd, { [ma]: Object.assign({}, S.kd[ma], { q: 0 }) }); try { save(); } catch (e) {} } } }
function kdClick(e) { const g = s => e.target.closest(s); let b;
  if (g('[data-kdre]')) return kdView();
  if ((b = g('[data-kdf]'))) { KD_F = b.dataset.kdf; document.querySelectorAll('[data-kdf]').forEach(x => { const on = x === b; x.classList.toggle('on', on); x.setAttribute('aria-pressed', on); }); document.getElementById('kdl').innerHTML = kdList(); return; }
  if ((b = g('summary')) && b.parentElement.dataset.kdi) { const ma = b.parentElement.dataset.kdi; setTimeout(() => { const d = document.querySelector(`[data-kdi="${CSS.escape(ma)}"]`); if (d) d.open ? KD_OPEN.add(ma) : KD_OPEN.delete(ma); }, 0); return; }
  if ((b = g('[data-kdv]'))) { const [ma, v] = b.dataset.kdv.split('|'); KD_OPEN.add(ma);
    if (v === '1') { KD_NO = null; const p = kdMark(ma, 1); kdRedraw(ma); p.then(() => kdRedraw(ma)); } else { KD_NO = ma; kdRedraw(ma); const t = document.getElementById('kdn-' + ma); if (t) t.focus(); } return; }
  if ((b = g('[data-kds]'))) { const ma = b.dataset.kds, t = document.getElementById('kdn-' + ma), n = String(t ? t.value : '').trim().slice(0, 1000);
    if (!n) { if (typeof toast === 'function') toast('Viết vài chữ chỗ chưa đúng ý nhé.'); if (t) t.focus(); return; }
    KD_NO = null; const p = kdMark(ma, 0, n); kdRedraw(ma); p.then(() => kdRedraw(ma)); return; } }
