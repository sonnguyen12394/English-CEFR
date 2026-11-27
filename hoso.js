// v224 📋 Hồ sơ năng lực TOEIC (người sáng lập 26/11/2026: "sau mỗi 30 câu cập nhật chi tiết năng lực … lưu vào hồ sơ trên app").
// Claude chấm trên chat Claude Code rồi ghi bảng ho_so (chỉ máy chủ ghi; người học chỉ đọc dòng của mình, RLS).
// Chỉ để xem, KHÔNG đổi luật đo. Nguồn chữ: docs/hoc-toeic/HO-SO-NANG-LUC.md.
let HS = null;   // { data, at } của lần tải gần nhất trong phiên
async function hsLoad() {
  if (!user || typeof sb === 'undefined') return null;
  try { const { data, error } = await sb.from('ho_so').select('data,at').eq('user_id', user.id).maybeSingle();
    if (error || !data || !data.data || !Array.isArray(data.data.dang)) return null; HS = data; return HS; } catch (e) { return null; } }
const hsPct = (a, n) => n ? Math.round(a / n * 100) : 0;
const hsCol = p => p >= 85 ? 'var(--good)' : p >= 60 ? 'var(--warn)' : 'var(--bad)';
const hsDate = at => { try { return new Date(at).toLocaleDateString('vi-VN'); } catch (e) { return ''; } };
function hsBar(p) { return `<div class="bar"><i style="width:${p}%;background:${hsCol(p)}"></i></div>`; }
// ô ở 👤 Tôi: tổng + 2 dạng yếu nhất + nút xem chi tiết
function hsBoxHtml(h) { const d = h.data, p = hsPct(d.tong[0], d.tong[1]);
  const weak = d.dang.map(x => [x, hsPct(x[1], x[2])]).sort((a, b) => a[1] - b[1]).slice(0, 2);
  return `<div class="box"><div class="row"><b>📋 Hồ sơ TOEIC</b><span class="mute">lần ${d.lan || 1} · ${hsDate(h.at)}</span></div>
    <p style="margin:6px 0">Mục tiêu <b>${esc(d.muc)}</b> · đã chữa ${d.tong[1]} câu · đúng <b>${p}%</b></p>${hsBar(p)}
    <p class="mute" style="margin:6px 0 0">Cần tập trung: ${weak.map(([x, q]) => `${esc(x[0])} (${q}%)`).join(' · ')}</p>
    <button data-hs="1" style="min-height:44px;margin-top:8px">Xem hồ sơ chi tiết ›</button></div>`; }
async function hsFill() { const el = document.getElementById('hsbox'); if (!el) return; const h = await hsLoad(); const e2 = document.getElementById('hsbox'); if (e2 && h) e2.innerHTML = hsBoxHtml(h); }
function hsView() { if (!HS) return minhView(); BACK = null; window.CUR = { view: 'ho-so' }; scrollTo(0, 0);
  const d = HS.data, p = hsPct(d.tong[0], d.tong[1]);
  $app.innerHTML = `<div id="bk"></div><button class="link tap" data-hsb>‹ Của tôi</button><h1>📋 Hồ sơ TOEIC</h1>
    <p class="mute">Claude chấm khi bạn học trên chat · cập nhật sau mỗi 30 câu · lần ${d.lan || 1}, ${hsDate(HS.at)}</p>
    <div class="box"><b>Tổng</b><p style="margin:6px 0">Mục tiêu <b>${esc(d.muc)}</b> · đúng <b>${d.tong[0]}/${d.tong[1]}</b> câu (${p}%)</p>${hsBar(p)}
      ${(d.chuoi || []).length ? `<p class="mute" style="margin:6px 0 0">Tiến bộ: ${d.chuoi.map(x => `${esc(x[0])} ${x[1]}%`).join(' → ')}</p>` : ''}
      ${d.dk ? `<p class="mute" style="margin:6px 0 0">⚠️ ${esc(d.dk)}</p>` : ''}</div>
    <div class="box"><b>Theo dạng câu</b>${d.dang.map(x => { const q = hsPct(x[1], x[2]);
      return `<div style="margin:10px 0 0"><div class="row"><span>${esc(x[0])}</span><b>${x[1]}/${x[2]}</b></div>${hsBar(q)}
        <p class="mute" style="margin:2px 0 0;font-size:14px">${esc(x[3] || '')}${x[4] ? ` · <b>${esc(x[4])}</b>` : ''}</p></div>`; }).join('')}</div>
    ${(d.tu || []).length ? `<div class="box"><b>Từ / cụm cần nhớ</b>${d.tu.map(x => `<p style="margin:6px 0;font-size:15px"><b>${esc(x[0])}</b> = ${esc(x[1])}</p>`).join('')}</div>` : ''}
    ${(d.huong || []).length ? `<div class="box"><b>Hướng học tiếp</b>${d.huong.map((x, i) => `<p style="margin:6px 0;font-size:15px">${i + 1}. ${esc(x)}</p>`).join('')}</div>` : ''}`;
  $app.onclick = e => { if (e.target.closest('[data-hsb]')) minhView(); }; }
document.addEventListener('click', e => { if (S && e.target.closest('[data-hs]')) hsView(); });
