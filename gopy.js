// 💬 Góp ý: như thiết kế của game (docs/GOP-Y.md bên repo game, v167–v169).
// Nút 💬 nổi mọi màn → tấm góp ý đè lên màn đang học (đóng lại là về đúng câu đang làm).
// Loại 🐞 / 🤔 / 💡 / 📝, nội dung bắt buộc, ≤ 3 ảnh (nén ở máy), tự kèm bối cảnh (CUR trong app.js).
// Mất mạng: lưu trên máy, có mạng tự gửi. 🗂 Quản lý góp ý: lọc loại × trạng thái, đổi trạng thái, sửa, thêm tay, xoá (khôi phục được), xoá hẳn (bấm 2 lần).
// Máy chủ: bảng public.gopy + kho ảnh riêng tư 'gopy' (Supabase). Không khoá quản trị: ai mở trang cũng xem / sửa / xoá được.
const GY_LS = 'a1v:gopy', GY_SENT = 'a1v:gopy-sent', GY_IMG_N = 3, GY_PX = 1280;
const GY_KIND = [['sai', '⚑ Câu sai'], ['loi', '🐞 Lỗi'], ['kho', '🤔 Khó hiểu'], ['y', '💡 Ý tưởng'], ['khac', '📝 Khác']];   // v86: ⚑ câu hỏi / đáp án sai (nội dung AI soạn)
const GA_ST = [['moi', '🆕 Mới'], ['dang', '🔧 Đang xử lý'], ['xong', '✅ Xong'], ['bo', '🚫 Bỏ'], ['xoa', '🗑 Đã xoá']];
const GY = { open: false, kind: 'loi', txt: '', imgs: [], ctx: null, busy: false, msg: '' };
const GA = { rows: null, st: null, kd: null, err: '', busy: false, urls: {}, add: false, purge: null, nw: { kd: 'y', tx: '', nt: '' } };
const gyLS = (k, v) => { try { if (v === undefined) { const x = JSON.parse(localStorage.getItem(k) || '[]'); return Array.isArray(x) ? x : []; } v.length ? localStorage.setItem(k, JSON.stringify(v)) : localStorage.removeItem(k); return true; } catch (e) { return v === undefined ? [] : false; } };
const gaKind = k => (GY_KIND.find(x => x[0] === k) || [k, k])[1], gaStat = k => (GA_ST.find(x => x[0] === k) || [k, k])[1];

function toast(t) { let el = document.getElementById('toast'); if (!el) { el = document.createElement('div'); el.id = 'toast'; el.setAttribute('role', 'status'); document.body.appendChild(el); }
  el.textContent = t; el.className = 'show'; clearTimeout(toast.t); toast.t = setTimeout(() => { el.className = ''; }, 3200); }

function gyCtx() { const c = window.CUR || {}, h = document.querySelector('#app h1, #app .q');
  return { ...c, h1: h ? h.textContent.trim().slice(0, 120) : null, ua: String(navigator.userAgent || '').slice(0, 160), scr: innerWidth + 'x' + innerHeight }; }
function gyOpen() { GY.open = true; GY.ctx = gyCtx(); GY.msg = ''; if (!GY.txt && document.querySelector('#app .q, #app .opt')) GY.kind = 'sai'; gyDraw(); }   // đang làm câu hỏi: mặc định ⚑ Câu sai
function gyClose() { GY.open = false; const el = document.getElementById('gysheet'); if (el) el.remove(); }
function gyDraw() {
  let el = document.getElementById('gysheet'); if (!GY.open) { if (el) el.remove(); return; }
  const t = document.getElementById('gytxt'); if (t) GY.txt = t.value;
  if (!el) { el = document.createElement('div'); el.id = 'gysheet'; document.body.appendChild(el); }
  const c = GY.ctx || {}, q = gyLS(GY_LS).length;
  el.innerHTML = `<div class="gybox" role="dialog" aria-modal="true" aria-labelledby="gy-t"><div class="row"><h2 id="gy-t" style="margin:0">💬 Góp ý</h2><button class="link" data-g="close" aria-label="Đóng góp ý">✕ Đóng</button></div>
    <div class="chips" role="group" aria-label="Loại góp ý">${GY_KIND.map(([k, l]) => `<button class="chip ${GY.kind === k ? 'on' : ''}" data-g="kind" data-v="${k}" aria-pressed="${GY.kind === k}">${l}</button>`).join('')}</div>
    <label class="mute" for="gytxt">Bạn thấy gì? (không ghi tên, số điện thoại)</label>
    <textarea id="gytxt" rows="4" maxlength="4000">${esc(GY.txt)}</textarea>
    <div class="row" style="justify-content:flex-start;gap:10px"><label class="chip" for="gyfile">📷 Thêm ảnh</label><input id="gyfile" type="file" accept="image/*" multiple hidden><span class="mute">${GY.imgs.length}/${GY_IMG_N} ảnh · ảnh chụp màn hình rất có ích</span></div>
    ${GY.imgs.length ? `<div class="thumbs">${GY.imgs.map((u, i) => `<span><img src="${u}" alt="Ảnh ${i + 1}"><button class="link" data-g="rm" data-v="${i}" aria-label="Bỏ ảnh ${i + 1}">✕</button></span>`).join('')}</div>` : ''}
    <p class="mute">Gửi kèm: màn “${esc(c.h1 || c.view || '')}”${c.item ? `, câu đang làm (${esc(c.item)})` : ''}, bản ${APP_V}, loại máy. Điểm này giúp sửa đúng chỗ.</p>
    ${GY.msg ? `<p class="mute" role="status">${esc(GY.msg)}</p>` : ''}
    <button class="pri" data-g="send" ${GY.busy ? 'disabled' : ''}>${GY.busy ? 'Đang gửi…' : 'Gửi góp ý'}</button>${q ? `<p class="mute">${q} góp ý chờ gửi (mất mạng)</p>` : ''}</div>`;
  const f = el.querySelector('#gyfile'); if (f) f.onchange = () => gyAddImgs(f.files);
}
// Nén ảnh ở máy: cạnh dài ≤ 1280 px, JPEG 0,72.
function gyShrink(file) { return new Promise(res => { const r = new FileReader(); r.onerror = () => res(null);
  r.onload = () => { const im = new Image(); im.onerror = () => res(null); im.onload = () => { const k = Math.min(1, GY_PX / Math.max(im.width, im.height)), cv = document.createElement('canvas');
    cv.width = Math.max(1, Math.round(im.width * k)); cv.height = Math.max(1, Math.round(im.height * k)); cv.getContext('2d').drawImage(im, 0, 0, cv.width, cv.height); res(cv.toDataURL('image/jpeg', 0.72)); }; im.src = r.result; };
  r.readAsDataURL(file); }); }
async function gyAddImgs(files) { const t = document.getElementById('gytxt'); if (t) GY.txt = t.value;
  for (const f of [...(files || [])]) { if (GY.imgs.length >= GY_IMG_N) { GY.msg = `Tối đa ${GY_IMG_N} ảnh.`; break; } if (!/^image\//.test(f.type || '')) continue; const u = await gyShrink(f); if (u) GY.imgs.push(u); }
  gyDraw(); }
async function gySend() {
  const t = document.getElementById('gytxt'), txt = String(t ? t.value : GY.txt).trim(); GY.txt = txt;
  if (!txt) { GY.msg = 'Gõ vài chữ mô tả trước nhé (ảnh thôi thì khó hiểu ý).'; return gyDraw(); }
  const item = { id: Math.random().toString(36).slice(2, 12), kind: GY.kind, txt: txt.slice(0, 4000), ctx: GY.ctx || gyCtx(), imgs: GY.imgs.slice(0, GY_IMG_N), t: Date.now() };
  const q = gyLS(GY_LS); q.push(item); if (!gyLS(GY_LS, q)) { q[q.length - 1] = { ...item, imgs: [] }; gyLS(GY_LS, q); }   // đầy bộ nhớ: giữ chữ, bỏ ảnh
  GY.busy = true; gyDraw(); await gyFlush(); GY.busy = false;
  const left = gyLS(GY_LS).some(x => x.id === item.id);
  GY.txt = ''; GY.imgs = []; gyClose(); toast(left ? 'Đã lưu góp ý trên máy. Có mạng sẽ tự gửi.' : 'Đã gửi góp ý. Cảm ơn bạn!');
  if (document.getElementById('gyhome')) document.getElementById('gyhome').innerHTML = gyHomeInner();
}
async function gyUpload(u) { const d = new Date(), path = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}/${(Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2)).slice(0, 20)}.jpg`;
  const b = await (await fetch(u)).blob();
  const { error } = await sb.storage.from('gopy').upload(path, b, { contentType: 'image/jpeg' });
  return error ? null : path; }
let gyBusy = false;
async function gyFlush() {
  if (gyBusy || !user) return; const q = gyLS(GY_LS); if (!q.length) return; gyBusy = true;
  for (const it of q) { try {
    const imgs = []; for (const u of it.imgs || []) { const p = await gyUpload(u); if (p) imgs.push(p); }
    const lost = (it.imgs || []).length - imgs.length;
    const row = { kind: it.kind, txt: it.txt + (lost ? ` [${lost} ảnh không gửi được]` : ''), ctx: it.ctx || {}, imgs, app_v: String(APP_V) };   // v86: người ẩn danh chỉ được thêm, không đọc lại (RLS) → không lấy id
    const { data, error } = isAnon() ? await sb.from('gopy').insert(row) : await sb.from('gopy').insert(row).select('id').single();
    if (error) { if (/fetch|network/i.test(error.message)) break; gyLS(GY_LS, gyLS(GY_LS).filter(x => x.id !== it.id)); continue; }   // máy chủ từ chối: bỏ, không thử mãi
    gyLS(GY_LS, gyLS(GY_LS).filter(x => x.id !== it.id));
    const sent = gyLS(GY_SENT); sent.push({ id: data ? data.id : '', t: it.t, kind: it.kind, txt: it.txt.slice(0, 80), n: imgs.length }); gyLS(GY_SENT, sent.slice(-50));
  } catch (e) { break; } }
  gyBusy = false;
}
// Khối 💬 Góp ý ở trang chính: góp ý đã gửi + nút quản lý
function gyHomeInner() { const s = gyLS(GY_SENT), q = gyLS(GY_LS);
  return `<h2>💬 Góp ý</h2><p class="mute">Thấy lỗi, khó hiểu hay có ý tưởng: bấm nút 💬 ở góc dưới phải, ở màn nào cũng được.</p>
    ${q.length ? `<p class="mute">${q.length} góp ý chờ gửi (mất mạng). <button class="link" data-g="flush">Gửi lại</button></p>` : ''}
    ${s.length ? `<div class="mute">Đã gửi:</div>${s.slice(-5).reverse().map(x => `<div class="mute">${x.id ? '#' + x.id + ' · ' : ''}${esc(gaKind(x.kind))} · ${esc(x.txt)}${x.n ? ` · ${x.n} ảnh` : ''}</div>`).join('')}` : ''}
    ${typeof isAnon === 'function' && isAnon() ? '' : '<button data-g="admin">🗂 Quản lý góp ý</button>'}`; }
const gyHomeHtml = () => `<div class="box" id="gyhome">${gyHomeInner()}</div>`;

// ---------- 🗂 Quản lý góp ý ----------
async function gaLoad() { GA.busy = true; GA.err = ''; gaRender();
  let qy = sb.from('gopy').select('*').order('id', { ascending: false }).limit(200);
  const all = await sb.from('gopy').select('kind,status');
  if (GA.st) qy = qy.eq('status', GA.st); else qy = qy.neq('status', 'xoa');
  if (GA.kd) qy = qy.eq('kind', GA.kd);
  const { data, error } = await qy;
  if (error || all.error) { GA.err = 'Chưa tải được danh sách: ' + (error || all.error).message; GA.rows = null; }
  else { GA.rows = data; GA.all = all.data; gaImgs(); }
  GA.busy = false; gaRender(); }
async function gaImgs() { const paths = [...new Set((GA.rows || []).flatMap(x => x.imgs || []))].filter(p => !GA.urls[p]); if (!paths.length) return;
  const { data } = await sb.storage.from('gopy').createSignedUrls(paths, 3600);
  for (const x of data || []) if (x.signedUrl) GA.urls[x.path] = x.signedUrl;
  gaRender(); }
async function gaSet(id, o, msg) { const { error } = await sb.from('gopy').update(o).eq('id', id);
  toast(error ? 'Chưa lưu được: ' + error.message : msg || 'Đã lưu.'); await gaLoad(); }
async function gaPurge(id) { if (GA.purge !== id) { GA.purge = id; return gaRender(); } GA.purge = null;
  const row = (GA.rows || []).find(x => x.id === id), imgs = row ? row.imgs || [] : [];
  if (imgs.length) await sb.storage.from('gopy').remove(imgs);
  const { error } = await sb.from('gopy').delete().eq('id', id).eq('status', 'xoa');
  toast(error ? 'Chưa xoá được: ' + error.message : `Đã xoá hẳn góp ý #${id} (kể cả ảnh).`); await gaLoad(); }
async function gaAdd() { const v = id => String((document.getElementById(id) || {}).value || '').trim(), kd = v('ganew-kd') || 'y', tx = v('ganew-tx'), nt = v('ganew-nt');
  if (!tx) return toast('Gõ nội dung góp ý trước nhé.');
  const { data, error } = await sb.from('gopy').insert({ kind: kd, txt: tx, note: nt || null, ctx: { src: 'admin' }, app_v: String(APP_V) }).select('id').single();
  toast(error ? 'Chưa thêm được: ' + error.message : `Đã thêm góp ý #${data.id}.`); if (!error) { GA.add = false; GA.nw = { kd: 'y', tx: '', nt: '' }; } await gaLoad(); }
const gaDate = x => { const d = new Date(x), p = n => String(n).padStart(2, '0'); return `${p(d.getDate())}/${p(d.getMonth() + 1)} ${p(d.getHours())}:${p(d.getMinutes())}`; };
function gaCard(x) { const c = x.ctx || {}, opt = (L, v) => L.map(([k, l]) => `<option value="${k}" ${k === v ? 'selected' : ''}>${esc(l)}</option>`).join('');
  const quick = x.status === 'xoa' ? [['moi', '↩ Khôi phục']] : [['dang', '🔧 Đang xử lý'], ['xong', '✅ Xong'], ['bo', '🚫 Bỏ'], ['xoa', '🗑 Xoá']].filter(q => q[0] !== x.status);
  return `<article class="box"><div class="row"><b>#${x.id} · ${esc(gaKind(x.kind))}</b><span class="mute">${esc(gaStat(x.status))}</span></div>
    <p style="white-space:pre-wrap;margin:6px 0">${esc(x.txt)}</p>
    <p class="mute">${esc(gaDate(x.at))}${x.app_v ? ` · bản ${esc(x.app_v)}` : ''}${c.h1 || c.view ? ` · màn “${esc(c.h1 || c.view)}”` : ''}${c.item ? ` · câu ${esc(c.item)}` : ''}${c.src === 'admin' ? ' · thêm tay' : ''}${c.scr ? ` · ${esc(c.scr)}` : ''}</p>
    ${(x.imgs || []).length ? `<div class="thumbs">${x.imgs.map((p, i) => GA.urls[p] ? `<a href="${esc(GA.urls[p])}" target="_blank" rel="noopener"><img src="${esc(GA.urls[p])}" alt="Ảnh ${i + 1} của góp ý #${x.id}"></a>` : `<span class="mute">ảnh ${i + 1}: đang lấy link…</span>`).join('')}</div>` : ''}
    ${x.note ? `<p>📝 ${esc(x.note)}</p>` : ''}
    <div class="chips">${quick.map(([k, l]) => `<button class="chip" data-g="quick" data-id="${x.id}" data-v="${k}">${l}</button>`).join('')}${x.status === 'xoa' ? `<button class="chip ${GA.purge === x.id ? 'on' : ''}" data-g="purge" data-id="${x.id}">${GA.purge === x.id ? 'Bấm lần nữa để xoá hẳn' : '💥 Xoá hẳn'}</button>` : ''}</div>
    <details><summary>✏️ Sửa chi tiết</summary>
      <label class="mute" for="gast-${x.id}">Trạng thái</label><select id="gast-${x.id}">${opt(GA_ST, x.status)}</select>
      <label class="mute" for="gakd-${x.id}">Loại</label><select id="gakd-${x.id}">${opt(GY_KIND, x.kind)}</select>
      <label class="mute" for="gatx-${x.id}">Nội dung</label><textarea id="gatx-${x.id}" rows="3" maxlength="4000">${esc(x.txt)}</textarea>
      <label class="mute" for="gant-${x.id}">Ghi chú xử lý</label><textarea id="gant-${x.id}" rows="2" maxlength="2000">${esc(x.note || '')}</textarea>
      <button class="pri" data-g="save" data-id="${x.id}">Lưu</button></details></article>`; }
function gaRender() {
  if (!document.getElementById('gaview')) return;
  const keep = id => { const el = document.getElementById(id); return el ? el.value : null; };
  if (GA.add) GA.nw = { kd: keep('ganew-kd') ?? GA.nw.kd, tx: keep('ganew-tx') ?? GA.nw.tx, nt: keep('ganew-nt') ?? GA.nw.nt };   // giữ chữ đang gõ khi danh sách vẽ lại
  const A = GA.all || [], n = (kd, st) => A.filter(r => (!kd || r.kind === kd) && (st ? r.status === st : r.status !== 'xoa')).length;
  const chip = (g, v, cur, l, cnt) => `<button class="chip ${cur === v ? 'on' : ''}" data-g="${g}" data-v="${v || ''}" aria-pressed="${cur === v}">${l} <b>${cnt}</b></button>`;
  const nw = GA.nw;
  document.getElementById('gaview').innerHTML = `
    <div class="box"><div class="chips" role="group" aria-label="Loại">${chip('fkd', null, GA.kd, 'Tất cả', n(null, GA.st))}${GY_KIND.map(([k, l]) => chip('fkd', k, GA.kd, l, n(k, GA.st))).join('')}</div>
      <div class="chips" role="group" aria-label="Trạng thái">${chip('fst', null, GA.st, 'Chưa xoá', n(GA.kd, null))}${GA_ST.map(([k, l]) => chip('fst', k, GA.st, l, n(GA.kd, k))).join('')}</div>
      <div class="chips"><button class="chip" data-g="new">➕ Thêm góp ý</button><button class="chip" data-g="ref" ${GA.busy ? 'disabled' : ''}>${GA.busy ? 'Đang tải…' : '↻ Làm mới'}</button></div></div>
    ${GA.add ? `<div class="box"><h2 style="margin-top:0">➕ Thêm góp ý</h2><label class="mute" for="ganew-kd">Loại</label><select id="ganew-kd">${GY_KIND.map(([k, l]) => `<option value="${k}"${nw.kd === k ? ' selected' : ''}>${esc(l)}</option>`).join('')}</select>
      <label class="mute" for="ganew-tx">Nội dung</label><textarea id="ganew-tx" rows="3" maxlength="4000">${esc(nw.tx)}</textarea>
      <label class="mute" for="ganew-nt">Ghi chú (không bắt buộc)</label><textarea id="ganew-nt" rows="2" maxlength="2000">${esc(nw.nt)}</textarea>
      <button class="pri" data-g="addok">Thêm</button><button data-g="new">Huỷ</button></div>` : ''}
    ${GA.err ? `<p class="mute" role="status">${esc(GA.err)}</p>` : ''}
    ${GA.rows ? (GA.rows.length ? GA.rows.map(gaCard).join('') : '<p class="mute">Không có góp ý nào ở mục này.</p>') : GA.busy ? '<p class="mute">Đang tải…</p>' : ''}`; }
function gyAdmin() {
  window.CUR = { view: 'gyadmin' }; $app.onclick = null;
  $app.innerHTML = `<div class="row"><button class="link" data-a="home">← Về</button></div><h1>🗂 Quản lý góp ý</h1>
    <p class="mute">Ai mở trang cũng xem / sửa / xoá được (không khoá, như bên game).</p><div id="gaview"></div>`;
  $app.onclick = e => { if (e.target.closest('[data-a="home"]')) home(); };
  gaRender(); gaLoad(); }

// ---------- nút nổi + sự kiện ----------
(() => { const b = document.createElement('button'); b.id = 'gybtn'; b.setAttribute('aria-label', 'Góp ý'); b.textContent = '💬'; b.onclick = gyOpen; document.body.appendChild(b); })();
document.addEventListener('click', e => {
  const t = e.target.closest('[data-g]'); if (!t) return;
  const g = t.dataset.g, v = t.dataset.v, id = +t.dataset.id;
  if (g === 'close') gyClose();
  else if (g === 'kind') { GY.kind = v; gyDraw(); }
  else if (g === 'rm') { const tt = document.getElementById('gytxt'); if (tt) GY.txt = tt.value; GY.imgs.splice(+v, 1); gyDraw(); }
  else if (g === 'send') gySend();
  else if (g === 'flush') gyFlush().then(() => { const el = document.getElementById('gyhome'); if (el) el.innerHTML = gyHomeInner(); });
  else if (g === 'admin') gyAdmin();
  else if (g === 'fkd') { GA.kd = v || null; gaLoad(); }
  else if (g === 'fst') { GA.st = v || null; gaLoad(); }
  else if (g === 'ref') gaLoad();
  else if (g === 'new') { GA.add = !GA.add; gaRender(); }
  else if (g === 'addok') gaAdd();
  else if (g === 'quick') gaSet(id, { status: v }, v === 'xoa' ? 'Đã chuyển vào 🗑 Đã xoá (khôi phục được).' : 'Đã lưu.');
  else if (g === 'purge') gaPurge(id);
  else if (g === 'save') { const val = x => (document.getElementById(x + '-' + id) || {}).value, tx = String(val('gatx') || '').trim();
    if (!tx) return toast('Nội dung không được để trống.');
    gaSet(id, { status: val('gast'), kind: val('gakd'), txt: tx, note: String(val('gant') || '').trim() || null }); }
});
document.addEventListener('keydown', e => { if (e.key === 'Escape' && GY.open) gyClose(); });
window.addEventListener('online', () => gyFlush());
