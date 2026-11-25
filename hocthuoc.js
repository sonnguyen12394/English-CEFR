// v209 📖 Học thuộc bài đề TOEIC (người sáng lập 22/11/2026: "đẩy lên web trong phần luyện thi chức năng vừa mới tạo"; chọn: trang riêng có lối vào, tiến độ đồng bộ theo tài khoản)
// Trang con hoc-thuoc/index.html (dựng từ bản mẫu Artifact "Học thuộc rồi nói lại" bằng tools/hocthuoc/build.py), mở toàn màn hình trong khung iframe cùng nguồn.
// Tiến độ (bài đã làm, điểm Hiểu / Dùng được, kỷ lục đua giờ) nằm ở S.ht và lưu như mọi tiến độ khác (save() → bảng vocab_state). Không đổi luật đo.
function htRow() { return `<div class="box hcard" style="margin:12px 0 0"><button class="hrow" data-htv><span class="ic">📖</span><span class="t"><b>Học thuộc bài đề</b><small>Hội thoại, bài nói, văn bản của đề: thuộc, hiểu, dùng được, đua giờ nói lại</small></span><span class="chev">›</span></button></div>`; }
window.htGet = () => (typeof S !== 'undefined' && S && S.ht) || null;
// v218: cấp đang học của app → số 0 Pre-A1 … 6 C2 cho ⚡ Đua giờ (cấp "+" về cấp gốc)
window.htLv = () => { try { const c = typeof ltCurLv === 'function' ? ltCurLv() : null, m = { pre: 0, a1: 1, a2: 2, a2p: 2, b1: 3, b1p: 3, b2: 4, b2p: 4, c1: 5, c2: 6 }; return c in m ? m[c] : null; } catch (e) { return null; } };
window.htPut = d => { if (typeof S === 'undefined' || !S) return; S.ht = d; save(); };
window.htClose = () => { const o = document.getElementById('htbox'); if (o) o.remove(); document.body.style.overflow = ''; };
function htOpen() {
  if (document.getElementById('htbox')) return; window.CUR = { view: 'hoc-thuoc' };
  const o = document.createElement('div'); o.id = 'htbox';
  o.innerHTML = `<div class="htbar"><button class="link" data-htx>‹ Luyện đề</button><b>📖 Học thuộc bài đề</b><span></span></div><iframe src="hoc-thuoc/index.html?v=${APP_V}" title="Học thuộc bài đề" allow="autoplay"></iframe>`;
  document.body.appendChild(o); document.body.style.overflow = 'hidden'; }
document.addEventListener('click', e => { if (e.target.closest('[data-htv]')) htOpen(); else if (e.target.closest('[data-htx]')) htClose(); });
