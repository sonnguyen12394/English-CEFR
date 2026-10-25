// 💾 Sao lưu (người sáng lập 26/10/2026): mục thứ ba ở thanh dưới, quản lý tệp JSON dữ liệu học (S, lưu ở máy + Supabase vocab_state):
// xem tóm tắt, tải tệp về, nhập tệp, sửa trực tiếp, xoá để học lại từ đầu (cả trang hoặc từng phần).
// An toàn: trước mỗi lần nhập / sửa / xoá, tự chụp một bản (localStorage, giữ 5 bản gần nhất, khôi phục được); xoá phải gõ XOA để xác nhận.
// Dữ liệu sau khi đổi được lưu như thường (save()), nên lên cả máy chủ.
const BK_LS = 'a1v:bk', BK_N = 5;
// các phần dữ liệu trong S: [khoá, tên, các trường của S]
const BK_PARTS = [['tv', '📚 Từ vựng', ['units', 'cards', 'x']], ['pa', '👄 Phát âm', ['pa', 'paX']], ['np', '🧱 Ngữ pháp', ['k.np']], ['nghe', '🎧 Nghe', ['k.nghe']],
  ['noi', '🗣 Nói', ['k.noi']], ['doc', '📰 Đọc', ['k.doc']], ['viet', '✍️ Viết', ['k.viet']]];
const bkSnaps = () => { try { return JSON.parse(localStorage.getItem(BK_LS) || '[]'); } catch (e) { return []; } };
function bkSnap(why) { const a = bkSnaps(); a.unshift({ at: Date.now(), why, data: JSON.stringify(S) });
  try { localStorage.setItem(BK_LS, JSON.stringify(a.slice(0, BK_N))); return true; } catch (e) { try { localStorage.setItem(BK_LS, JSON.stringify(a.slice(0, 1))); return true; } catch (x) { return false; } } }
const bkCount = id => id === 'tv' ? Object.keys(S.cards || {}).length + ' từ' : id === 'pa' ? Object.keys(S.pa || {}).length + ' bộ âm' : Object.keys(((S.k || {})[id] || {}).cards || {}).length + ' bài';
const bkKB = s => (new Blob([s]).size / 1024).toFixed(0) + ' KB';
const bkDate = t => { const d = new Date(t); return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`; };
// tệp hợp lệ: đúng dạng dữ liệu học của trang (có v, units, cards); các trường khác nếu có phải là object / mảng đúng kiểu
function bkCheck(o) { if (!o || typeof o !== 'object' || Array.isArray(o)) return 'Tệp không phải dữ liệu học (không phải object).';
  if (!o.v || typeof o.cards !== 'object' || typeof o.units !== 'object') return 'Thiếu trường v / units / cards: không phải tệp sao lưu của trang này.';
  for (const [k, t] of [['pa', 'object'], ['k', 'object'], ['x', 'object'], ['paX', 'array']]) if (o[k] != null && (t === 'array' ? !Array.isArray(o[k]) : typeof o[k] !== 'object')) return `Trường ${k} sai kiểu.`;
  return ''; }
function bkApply(o, why) { bkSnap(why); o.t = Date.now(); S = o; save(); }

function backup(msg) { window.CUR = { view: 'sao-luu' }; BACK = null;
  const raw = JSON.stringify(S), sn = bkSnaps();
  $app.innerHTML = `<div id="bk"></div><h1>💾 Sao lưu</h1><p class="mute"><span id="sync">${esc(sync)}</span></p>
    ${msg ? `<div class="box">${msg}</div>` : ''}
    <div class="box"><b>Dữ liệu học hiện tại</b> <span class="mute">· ${bkKB(raw)} · sửa lần cuối ${S.t ? bkDate(S.t) : '—'}</span>
      ${BK_PARTS.map(([id, l]) => `<div class="row" style="margin-top:6px"><span>${l}</span><span class="mute">${bkCount(id)}</span></div>`).join('')}
      <p class="mute" style="margin:6px 0 0">Lưu ở máy này và trên máy chủ (tự đăng nhập). Tệp tải về là JSON, mở được bằng ứng dụng Tệp.</p></div>
    <h2>Tệp dữ liệu</h2>
    <button class="pri" data-bk="down">⬇️ Tải tệp JSON về máy</button>
    <label class="mute" style="display:block;margin-top:6px">⬆️ Nhập tệp JSON (thay toàn bộ dữ liệu hiện tại)<input type="file" id="bkfile" accept="application/json,.json"></label>
    <button data-bk="edit">✏️ Xem và sửa JSON</button>
    <h2>Học lại từ đầu</h2>
    <p class="mute">Xoá tiến độ để học lại. Trước khi xoá, máy tự chụp một bản (khôi phục được ở dưới).</p>
    ${BK_PARTS.map(([id, l]) => `<button class="urow" data-bkdel="${id}"><span>🗑 Xoá tiến độ ${l}</span><span class="mute">${bkCount(id)}</span></button>`).join('')}
    <button class="urow no" data-bkdel="all"><span>🗑 Xoá tất cả, học lại từ đầu</span><span></span></button>
    <h2>Bản chụp tự động (${sn.length}/${BK_N})</h2>
    ${sn.length ? sn.map((s, i) => `<div class="row urow"><span>${bkDate(s.at)} · ${esc(s.why)} <span class="mute">${bkKB(s.data)}</span></span><span><button class="link" data-bkres="${i}">Khôi phục</button> · <button class="link" data-bkdl="${i}">Tải</button></span></div>`).join('')
      : '<p class="mute">Chưa có. Mỗi lần nhập, sửa hay xoá sẽ tự chụp một bản.</p>'}`;
  const f = document.getElementById('bkfile');
  if (f) f.onchange = async () => { const file = f.files && f.files[0]; if (!file) return; let o;
    try { o = JSON.parse(await file.text()); } catch (e) { return backup('❌ Không đọc được tệp: không phải JSON.'); }
    const bad = bkCheck(o); if (bad) return backup('❌ ' + esc(bad));
    if (!confirm(`Nhập tệp "${file.name}" (${Object.keys(o.cards).length} từ đã học)? Dữ liệu hiện tại được chụp lại trước khi thay.`)) return backup();
    bkApply(o, 'trước khi nhập tệp'); backup('✅ Đã nhập tệp. Dữ liệu cũ có trong bản chụp tự động.'); };
  $app.onclick = e => { const b = e.target.closest('[data-bk]'), d = e.target.closest('[data-bkdel]'), r = e.target.closest('[data-bkres]'), dl = e.target.closest('[data-bkdl]');
    if (b && b.dataset.bk === 'down') return bkDown(JSON.stringify(S, null, 1), 'hoc-tieng-anh');
    if (b && b.dataset.bk === 'edit') return bkEdit();
    if (dl) return bkDown(bkSnaps()[+dl.dataset.bkdl].data, 'ban-chup');
    if (r) { const s = bkSnaps()[+r.dataset.bkres]; if (!s || !confirm(`Khôi phục bản chụp ${bkDate(s.at)}? Dữ liệu hiện tại được chụp lại trước.`)) return;
      bkApply(JSON.parse(s.data), 'trước khi khôi phục'); return backup('✅ Đã khôi phục bản chụp.'); }
    if (d) { const id = d.dataset.bkdel, P = BK_PARTS.find(p => p[0] === id), name = id === 'all' ? 'TẤT CẢ dữ liệu học' : 'tiến độ ' + P[1];
      if ((prompt(`Xoá ${name}? Gõ XOA để xác nhận (máy chụp lại trước khi xoá).`) || '').trim().toUpperCase() !== 'XOA') return;
      const o = JSON.parse(JSON.stringify(S));
      if (id === 'all') { const n = blank(); bkApply(n, 'trước khi xoá tất cả'); return backup('✅ Đã xoá tất cả. Học lại từ đầu ở 🎯 Học.'); }
      for (const f of P[2]) { if (f.startsWith('k.')) { if (o.k) delete o.k[f.slice(2)]; } else if (f === 'units' || f === 'cards') o[f] = {}; else delete o[f]; }
      bkApply(o, 'trước khi xoá ' + P[1]); return backup(`✅ Đã xoá tiến độ ${P[1]}.`); } };
  window.scrollTo(0, 0); }
// tải tệp: iPhone mở bảng chia sẻ / lưu vào Tệp
function bkDown(text, name) { const d = new Date(), stamp = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([text], { type: 'application/json' })); a.download = `${name}-${stamp}.json`;
  document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000); }
// sửa trực tiếp: JSON đẹp trong ô chữ; lưu chỉ khi đúng JSON và đúng dạng
function bkEdit() { window.CUR = { view: 'sao-luu-sua' };
  $app.innerHTML = `<div id="bk"></div><div class="row top"><button class="link" data-bke="back">← Sao lưu</button><span class="uname">✏️ Sửa JSON</span></div>
    <p class="mute">Sửa cẩn thận: sai dạng thì không lưu. Trước khi lưu, máy chụp lại dữ liệu cũ.</p>
    <textarea id="bkta" rows="18" spellcheck="false" autocapitalize="off" autocorrect="off" style="font-family:ui-monospace,monospace;font-size:13px">${esc(JSON.stringify(S, null, 1))}</textarea>
    <div id="bkerr"></div><button class="pri" data-bke="save">💾 Lưu thay đổi</button><button data-bke="back">Huỷ</button>`;
  $app.onclick = e => { const b = e.target.closest('[data-bke]'); if (!b) return; if (b.dataset.bke === 'back') return backup();
    let o; try { o = JSON.parse(document.getElementById('bkta').value); } catch (x) { document.getElementById('bkerr').innerHTML = `<p style="color:var(--bad)">❌ JSON sai: ${esc(x.message)}</p>`; return; }
    const bad = bkCheck(o); if (bad) { document.getElementById('bkerr').innerHTML = `<p style="color:var(--bad)">❌ ${esc(bad)}</p>`; return; }
    bkApply(o, 'trước khi sửa JSON'); backup('✅ Đã lưu thay đổi. Dữ liệu cũ có trong bản chụp tự động.'); };
  window.scrollTo(0, 0); }
