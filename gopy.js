// 💬 Góp ý: như thiết kế của game (docs/GOP-Y.md bên repo game, v167–v169).
// Nút 💬 nổi mọi màn → tấm góp ý đè lên màn đang học (đóng lại là về đúng câu đang làm).
// Loại 🐞 / 🤔 / 💡 / 📝, nội dung bắt buộc, ≤ 3 ảnh (nén ở máy), tự kèm bối cảnh (CUR trong app.js).
// Mất mạng: lưu trên máy, có mạng tự gửi. 🗂 Quản lý góp ý: lọc loại × trạng thái, đổi trạng thái, sửa, thêm tay, xoá (khôi phục được), xoá hẳn (bấm 2 lần).
// Máy chủ: bảng public.gopy + kho ảnh riêng tư 'gopy' (Supabase). Không khoá quản trị: ai mở trang cũng xem / sửa / xoá được.
const GY_LS = 'a1v:gopy', GY_SENT = 'a1v:gopy-sent', GY_IMG_N = 3, GY_PX = 1280;
const GY_KIND = [['sai', '⚑ Câu sai'], ['loi', '🐞 Lỗi'], ['kho', '🤔 Khó hiểu'], ['y', '💡 Ý tưởng'], ['khac', '📝 Khác']];   // v86: ⚑ câu hỏi / đáp án sai (nội dung AI soạn)
const GA_ST = [['moi', '🆕 Mới'], ['dang', '🔧 Đang xử lý'], ['xong', '✅ Xong'], ['bo', '🚫 Bỏ'], ['xoa', '🗑 Đã xoá']];
const GY = { open: false, kind: 'loi', txt: '', imgs: [], ctx: null, busy: false, msg: '', pdf: null, up: null };
const GA = { rows: null, st: null, kd: null, err: '', busy: false, urls: {}, add: false, purge: null, nw: { kd: 'y', tx: '', nt: '' } };
const gyLS = (k, v) => { try { if (v === undefined) { const x = JSON.parse(localStorage.getItem(k) || '[]'); return Array.isArray(x) ? x : []; } v.length ? localStorage.setItem(k, JSON.stringify(v)) : localStorage.removeItem(k); return true; } catch (e) { return v === undefined ? [] : false; } };
const gaKind = k => (GY_KIND.find(x => x[0] === k) || [k, k])[1], gaStat = k => (GA_ST.find(x => x[0] === k) || [k, k])[1];

function toast(t) { let el = document.getElementById('toast'); if (!el) { el = document.createElement('div'); el.id = 'toast'; el.setAttribute('role', 'status'); document.body.appendChild(el); }
  el.textContent = t; el.className = 'show'; clearTimeout(toast.t); toast.t = setTimeout(() => { el.className = ''; }, 3200); }

function gyCtx() { const c = window.CUR || {}, h = document.querySelector('#app h1, #app .q');
  return { ...c, h1: h ? h.textContent.trim().slice(0, 120) : null, ua: String(navigator.userAgent || '').slice(0, 160), scr: innerWidth + 'x' + innerHeight }; }
function gyOpen() { gdPre(); GY.open = true; GY.ctx = gyCtx(); GY.msg = ''; if (!GY.txt && document.querySelector('#app .q, #app .opt')) GY.kind = 'sai'; gyDraw(); }   // đang làm câu hỏi: mặc định ⚑ Câu sai
function gyClose() { GY.open = false; const el = document.getElementById('gysheet'); if (el) el.remove(); }
function gyDraw() {
  let el = document.getElementById('gysheet'); if (!GY.open) { if (el) el.remove(); return; }
  const t = document.getElementById('gytxt'); if (t) GY.txt = t.value;
  if (!el) { el = document.createElement('div'); el.id = 'gysheet'; document.body.appendChild(el); }
  const c = GY.ctx || {}, q = gyLS(GY_LS).length;
  el.innerHTML = `<div class="gybox" role="dialog" aria-modal="true" aria-labelledby="gy-t"><div class="row"><h2 id="gy-t" style="margin:0">💬 Góp ý</h2><button class="link tap" data-g="close" aria-label="Đóng góp ý">✕ Đóng</button></div>
    <div class="chips" role="group" aria-label="Loại góp ý">${GY_KIND.map(([k, l]) => `<button class="chip ${GY.kind === k ? 'on' : ''}" data-g="kind" data-v="${k}" aria-pressed="${GY.kind === k}">${l}</button>`).join('')}</div>
    <label class="mute" for="gytxt">Bạn thấy gì? (không ghi tên, số điện thoại)</label>
    <textarea id="gytxt" rows="4" maxlength="4000">${esc(GY.txt)}</textarea>
    <div class="chips tap gyadd"><label class="chip" for="gyfile">📷 Ảnh ${GY.imgs.length}/${GY_IMG_N}</label><input id="gyfile" type="file" accept="image/*" multiple hidden></div>
    <p class="mute">Ảnh chụp màn hình rất có ích.</p>
    ${GY.pdf ? gpBox() : gpPickBox()}
    ${GY.imgs.length ? `<div class="thumbs">${GY.imgs.map((u, i) => `<span><img src="${u}" alt="Ảnh ${i + 1}"><button class="link" data-g="rm" data-v="${i}" aria-label="Bỏ ảnh ${i + 1}">✕</button></span>`).join('')}</div>` : ''}
    <p class="mute">Gửi kèm: màn “${esc(c.h1 || c.view || '')}”${c.item ? `, câu đang làm (${esc(c.item)})` : ''}, bản ${APP_V}, loại máy. Điểm này giúp sửa đúng chỗ.</p>
    ${GY.msg ? `<p class="mute" role="status">${esc(GY.msg)}</p>` : ''}
    <button class="pri" data-g="send" ${GY.busy ? 'disabled' : ''}>${GY.busy ? 'Đang gửi…' : 'Gửi góp ý'}</button>${q ? `<p class="mute">${q} góp ý chờ gửi (mất mạng)</p>` : ''}</div>`;
  const f = el.querySelector('#gyfile'); if (f) f.onchange = () => gyAddImgs(f.files);
  const fp = el.querySelector('#gypdf'); if (fp) fp.onchange = () => gpPick(fp.files[0]);
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
  if (!txt) { GY.msg = GY.pdf ? 'Gõ vài chữ: tệp này là gì, bạn muốn làm gì với nó.' : 'Gõ vài chữ mô tả trước nhé (ảnh thôi thì khó hiểu ý).'; return gyDraw(); }
  if (GY.busy) return;
  let pdf = null; if (GY.pdf) { pdf = await gpUpload(); if (!pdf) return; }
  const item = { id: Math.random().toString(36).slice(2, 12), kind: GY.kind, txt: (txt + (pdf ? `\n📄 ${pdf.name} · ${gpMB(pdf.size)}` : '')).slice(0, 4100), ctx: { ...(GY.ctx || gyCtx()), ...(pdf ? { pdf } : {}) }, imgs: GY.imgs.slice(0, GY_IMG_N), t: Date.now() };
  const q = gyLS(GY_LS); q.push(item); if (!gyLS(GY_LS, q)) { q[q.length - 1] = { ...item, imgs: [] }; gyLS(GY_LS, q); }   // đầy bộ nhớ: giữ chữ, bỏ ảnh
  GY.busy = true; gyDraw(); await gyFlush(); GY.busy = false;
  const left = gyLS(GY_LS).some(x => x.id === item.id);
  GY.txt = ''; GY.imgs = []; gyClose(); toast(left ? `Đã lưu góp ý trên máy. Có mạng sẽ tự gửi.${pdf ? ' Tệp PDF đã lên máy chủ.' : ''}` : `Đã gửi góp ý${pdf ? ' kèm PDF' : ''}. Cảm ơn bạn!`);
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
    const sent = gyLS(GY_SENT); sent.push({ id: data ? data.id : '', t: it.t, kind: it.kind, txt: it.txt.slice(0, 80), n: imgs.length, ...(it.ctx && it.ctx.pdf ? { pdf: it.ctx.pdf } : {}) }); gyLS(GY_SENT, sent.slice(-50));
  } catch (e) { break; } }
  gyBusy = false;
}
// Khối 💬 Góp ý ở trang chính: góp ý đã gửi + nút quản lý
function gyHomeInner() { const s = gyLS(GY_SENT), q = gyLS(GY_LS);
  return `<h2>💬 Góp ý</h2><p class="mute">Thấy lỗi, khó hiểu hay có ý tưởng: bấm nút 💬 ở góc dưới phải, ở màn nào cũng được.</p>
    ${q.length ? `<p class="mute">${q.length} góp ý chờ gửi (mất mạng). <button class="link" data-g="flush">Gửi lại</button></p>` : ''}
    ${s.length ? `<div class="mute">Đã gửi:</div>${s.slice(-5).reverse().map(x => x.pdf && x.pdf.id ? gpsCard(x) : `<div class="mute">${x.id ? '#' + x.id + ' · ' : ''}${esc(gaKind(x.kind))} · ${esc(x.txt)}${x.n ? ` · ${x.n} ảnh` : ''}</div>`).join('')}` : ''}${s.some(x => x.pdf && x.pdf.id) ? (setTimeout(() => gpsLoad(), 0), '') : ''}
    ${typeof isAnon === 'function' && !isAnon() ? '<button data-g="admin">🗂 Quản lý góp ý</button>' : ''}
`; }   // v162: 🗂 Quản lý góp ý hiện lại ở khối 💬 (v136 chỉ để ở 💾 Dữ liệu → 🛠, người sáng lập tưởng mất); người ẩn danh không thấy
const gyHomeHtml = () => `<div class="box" id="gyhome">${gyHomeInner()}</div>`;

// ---------- 🗂 Quản lý góp ý ----------
async function gaLoad() { GA.busy = true; GA.err = ''; gaRender();
  let qy = sb.from('gopy').select('*').order('id', { ascending: false }).limit(200);
  const all = await sb.from('gopy').select('kind,status');
  if (GA.st) qy = qy.eq('status', GA.st); else qy = qy.neq('status', 'xoa');
  if (GA.kd) qy = qy.eq('kind', GA.kd);
  const { data, error } = await qy;
  if (error || all.error) { GA.err = 'Chưa tải được danh sách: ' + (error || all.error).message; GA.rows = null; }
  else { GA.rows = data; GA.all = all.data; gaImgs(); gpStat(); }
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
  if (row && row.ctx && row.ctx.pdf) await gpFn({ act: 'xoa', id: row.ctx.pdf.id });
  const { error } = await sb.from('gopy').delete().eq('id', id).eq('status', 'xoa');
  toast(error ? 'Chưa xoá được: ' + error.message : `Đã xoá hẳn góp ý #${id} (kể cả ảnh, PDF).`); await gaLoad(); }
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
    ${c.pdf ? gpCard(x.id, c.pdf) : ''}
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

// ---------- 📄 PDF lớn (v157, specs/014-gopy-pdf-lon) ----------
// Gói Supabase Free: 50 MB / tệp, 1 GB tổng → cắt tệp theo byte thành mảnh 25 MB (Blob.slice: chỉ giữ 1 mảnh trong bộ nhớ), băm SHA-256 từng mảnh,
// hàm máy chủ gopy-pdf giữ chỗ (trần 800 MB, mỗi tài khoản 1 dở + 2 lưu) và cấp đường tải có ký tên. App KHÔNG đọc lại được mảnh nào (tài liệu riêng tư);
// Claude đọc / xoá bằng tools/gopy-pdf.mjs. Rớt mạng: gửi lại = tải tiếp mảnh còn thiếu (nhớ ở localStorage GP_LS, nhận tệp bằng tên + cỡ + ngày sửa).
const GP_CH = 25 * 1048576, GP_MAX = 450 * 1048576, GP_LS = 'a1v:gopy-pdf', GP_TRY = 3, GP_BPS = 2.5e6;   // ước Wi-Fi ~20 Mbit/s
const gpMB = b => (b < 10485760 ? (b / 1048576).toFixed(1).replace('.', ',') : Math.round(b / 1048576)) + ' MB';
const gpRec = v => { try { if (v === undefined) return JSON.parse(localStorage.getItem(GP_LS) || 'null'); v ? localStorage.setItem(GP_LS, JSON.stringify(v)) : localStorage.removeItem(GP_LS); } catch (e) { return null; } };
async function gpFn(body) {
  try { const { data, error } = await sb.functions.invoke('gopy-pdf', { body });
    if (error) { let d = null; try { d = await error.context.json(); } catch (e) {} return d && d.error ? d : { error: error.message, net: /fetch|network|Failed/i.test(error.message) }; }
    return data || { error: 'Không có trả lời.' }; }
  catch (e) { return { error: String(e.message || e), net: 1 }; } }
const GP_ICLOUD = 'Không đọc được tệp này. Nếu tệp đang ở iCloud: mở app Tệp, chạm giữ tệp → Tải về ngay, đợi hết biểu tượng đám mây rồi chọn lại.';
// v159: thử đọc đầu + cuối tệp; tệp iCloud chưa tải về / hỏng thì ném lỗi NotReadableError (iPhone) ngay khi chọn, không đợi tới lúc gửi.
async function gpReadable(f) { try { await f.slice(0, 16).arrayBuffer(); if (f.size > 16) await f.slice(f.size - 16).arrayBuffer(); return true; } catch (e) { return false; } }
const gpUnread = e => !!e && (e.name === 'NotReadableError' || e.name === 'NotFoundError' || e.name === 'SecurityError');
async function gpSha(b) { const h = await crypto.subtle.digest('SHA-256', await b.arrayBuffer()); return [...new Uint8Array(h)].map(x => x.toString(16).padStart(2, '0')).join(''); }
async function gpPick(f) {
  const t = document.getElementById('gytxt'); if (t) GY.txt = t.value; GY.msg = '';
  if (!f) return;
  if (!/\.pdf$/i.test(f.name) && f.type !== 'application/pdf') { GY.msg = 'Chỉ nhận tệp PDF.'; return gyDraw(); }
  if (f.size > GP_MAX) { GY.msg = `Tệp ${gpMB(f.size)} quá lớn. Tối đa ${gpMB(GP_MAX)}.`; return gyDraw(); }
  if (!f.size) { GY.msg = 'Tệp rỗng hoặc chưa tải về máy. ' + GP_ICLOUD; return gyDraw(); }
  if (!(await gpReadable(f))) { GY.msg = GP_ICLOUD; return gyDraw(); }
  const name = (/\.pdf$/i.test(f.name) ? f.name : f.name + '.pdf').slice(-200);
  GY.pdf = { f, name, size: f.size, n: Math.ceil(f.size / GP_CH), info: null }; gyDraw();
  const r = await gpFn({ act: 'info' }); if (GY.pdf && GY.pdf.f === f) { GY.pdf.info = r && r.cap ? r : null; GY.pdf.net = !!(r && r.net); gyDraw(); } }
function gpBox() { const P = GY.pdf; if (!P) return '';
  const I = P.info, left = I ? I.cap - I.used : null, full = I && P.size > left, min = Math.max(1, Math.round(P.size / GP_BPS / 60)), U = GY.up;
  return `<div class="box gypdf"><div class="row"><b>📄 ${esc(P.name)}</b>${GY.busy ? '' : `<button class="link tap" data-g="pdfrm" aria-label="Bỏ tệp PDF">✕ Bỏ</button>`}</div>
    <p class="mute">${gpMB(P.size)} · ${P.drive ? 'từ Google Drive' : 'chia ' + P.n + ' phần để tải'} · ${I ? `kho còn ${gpMB(Math.max(0, left))}` : P.net ? 'chưa có mạng' : 'đang xem chỗ trống…'}</p>
    ${full ? `<p class="warnt" role="alert">Kho tài liệu không đủ chỗ cho tệp này. Nhờ người sáng lập xoá tệp cũ rồi gửi lại.</p>` : ''}
    ${U ? `<progress max="${U.n}" value="${U.i}" aria-label="Tiến độ tải PDF"></progress><p class="mute" role="status">${esc(U.st)}</p>`
      : P.drive ? `<p class="mute">Máy chủ chép thẳng từ Google Drive, không qua iPhone. Vẫn để màn hình sáng tới khi thanh chạy hết. Gián đoạn thì bấm Gửi lại: chép tiếp phần còn thiếu.</p>`
      : `<p class="mute">Khoảng ${min} phút qua Wi-Fi. Nên dùng Wi-Fi và để màn hình sáng tới khi xong. Rớt mạng thì bấm Gửi lại: app tải tiếp phần còn thiếu.</p>`}</div>`; }
// v160: ô chọn PDF kiểu iLovePDF: nút to "Chọn tệp PDF" (máy) + nút tròn Google Drive bên dưới, bên phải.
const GD_SVG = '<svg viewBox="0 0 87.3 78" width="26" height="23" aria-hidden="true"><path d="m6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8h-27.5c0 1.55.4 3.1 1.2 4.5z" fill="#0066da"/><path d="m43.65 25-13.75-23.8c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44a9.06 9.06 0 0 0 -1.2 4.5h27.5z" fill="#00ac47"/><path d="m73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5h-27.502l5.852 11.5z" fill="#ea4335"/><path d="m43.65 25 13.75-23.8c-1.35-.8-2.9-1.2-4.5-1.2h-18.5c-1.6 0-3.15.45-4.5 1.2z" fill="#00832d"/><path d="m59.8 53h-32.3l-13.75 23.8c1.35.8 2.9 1.2 4.5 1.2h50.8c1.6 0 3.15-.45 4.5-1.2z" fill="#2684fc"/><path d="m73.4 26.5-12.7-22c-.8-1.4-1.95-2.5-3.3-3.3l-13.75 23.8 16.15 28h27.45c0-1.55-.4-3.1-1.2-4.5z" fill="#ffba00"/></svg>';
function gpPickBox() {
  return `<div class="gppick"><label class="gpbig" for="gypdf">📄 Chọn tệp PDF</label><input id="gypdf" type="file" accept=".pdf,application/pdf" hidden>
    <div class="gpsrc"><span class="mute">Tối đa ${gpMB(GP_MAX)} · hoặc lấy từ</span><button class="gpround" data-g="gd" aria-label="Chọn PDF từ Google Drive">${GD_SVG}</button></div></div>`; }
const GD_OFF = 'Nút Google Drive chưa bật (người sáng lập cần gửi 3 mã Google). Tạm thời: bấm 📄 Chọn tệp PDF → Duyệt → Google Drive (cần app Google Drive trên iPhone).';
function gpBar() { const el = document.querySelector('#gysheet .gypdf'); if (el) el.outerHTML = gpBox(); }
async function gpPut(t, blob) {
  for (let k = 0; k < GP_TRY; k++) {
    try { const r = await fetch(`${SB_URL}/storage/v1/object/upload/sign/gopy-pdf/${t.path}?token=${encodeURIComponent(t.token)}`, { method: 'PUT', headers: { apikey: SB_KEY, 'content-type': 'application/octet-stream' }, body: blob });
      if (r.ok) return true; const x = await r.text().catch(() => ''); if (/exist|duplicate/i.test(x)) return true; }
    catch (e) { if (gpUnread(e)) throw e; }
    await new Promise(r => setTimeout(r, 1500 * (k + 1))); }
  return false; }
// ---------- 📄 Từ Google Drive (v159, specs/015-gopy-pdf-drive) ----------
// Người dùng chọn tệp bằng Google Picker (quyền drive.file: chỉ thấy đúng tệp đã chọn); máy chủ `gopy-pdf` (`gstart` / `gcopy`) chép từng phần 25 MB từ Drive vào kho,
// iPhone không phải tải về rồi tải lên lại. Mã truy cập Google (tok) chỉ nằm trong bộ nhớ trang, gửi tới máy chủ cho đúng lần chép, không lưu localStorage.
// Cấu hình (mã công khai, tạo ở Google Cloud Console): Client ID loại Web, API key (giới hạn theo trang), mã dự án (số). Để trống thì ẩn nút.
const GD = { client: '', key: '', app: '' };
const GD_SCOPE = 'https://www.googleapis.com/auth/drive.file';
const gdOn = () => !!(GD.client && GD.key);
let GD_LOAD = null, GD_READY = false;
const gdScript = src => new Promise((res, rej) => { const el = document.createElement('script'); el.src = src; el.async = true; el.onload = res; el.onerror = () => rej(new Error('script')); document.head.appendChild(el); });
function gdLoad() { if (!gdOn()) return Promise.reject(new Error('cfg'));
  if (!GD_LOAD) GD_LOAD = Promise.all([gdScript('https://accounts.google.com/gsi/client'), gdScript('https://apis.google.com/js/api.js')]).then(() => new Promise(res => gapi.load('picker', res))).then(() => { GD_READY = true; }).catch(e => { GD_LOAD = null; throw e; });
  return GD_LOAD; }
const gdPre = () => { if (gdOn()) gdLoad().catch(() => {}); };   // tải sẵn khi mở ô góp ý: bấm nút phải gọi xin quyền NGAY trong lần bấm (Safari chặn cửa sổ nếu có await)
const gdErrMsg = s => (s && s.net) ? 'Mất mạng. Có mạng rồi thử lại.' : ({ tok: 'Phiên Google hết hạn. Bấm 📄 Từ Google Drive, chọn lại tệp rồi Gửi: app chép tiếp phần còn thiếu.',
  quyen: 'Google không cho đọc tệp này. Bấm 📄 Từ Google Drive và chọn lại tệp.', ngoai: 'Chỉ chép được tệp PDF (không phải Google Docs hay loại khác).', lon: `Tệp quá lớn. Tối đa ${gpMB(GP_MAX)}.`,
  ma: 'Mã Google không hợp lệ. Chọn lại tệp.', luu: 'Máy chủ chưa lưu được một phần. Bấm Gửi lại.', phan: 'Sai số phần. Chọn lại tệp.' })[s && s.error] || (s && s.error === 'drive' ? `Google Drive báo lỗi (${s.st || '?'}). Thử lại sau ít phút.` : null);
const gdStartErr = s => gdErrMsg(s) || (s.error === 'day' ? `Kho tài liệu chỉ còn ${gpMB(Math.max(0, s.cap - s.used))}. Xoá bớt tệp cũ rồi gửi lại.` : s.error === 'du' ? 'Đã có 2 tệp PDF đang lưu. Xoá bớt một tệp rồi gửi lại.'
  : s.error === 'dang' ? 'Chưa gửi: đang có tệp PDF khác tải dở.' : 'Chưa gửi được PDF: ' + s.error);
function gdStart(target) {   // target: null = tệp cho góp ý mới; id tệp = thay tệp ở danh sách "Đã gửi"
  if (!gdOn()) { const t = document.getElementById('gytxt'); if (t) GY.txt = t.value; return gdFail(target, GD_OFF); }
  if (!GD_READY || !window.google || !google.accounts) { toast('Đang tải Google, bấm lại sau vài giây.'); gdLoad().catch(() => toast('Không tải được Google. Kiểm tra mạng.')); return; }
  const t = document.getElementById('gytxt'); if (t) GY.txt = t.value; gpsKeep();
  try { google.accounts.oauth2.initTokenClient({ client_id: GD.client, scope: GD_SCOPE,
    callback: r => { if (r && r.access_token) gdPicker(r.access_token, target); else gdFail(target, r && r.error === 'access_denied' ? 'Bạn chưa cho phép truy cập tệp trên Google Drive.' : 'Không đăng nhập được Google.'); },
    error_callback: e => gdFail(target, e && e.type === 'popup_failed_to_open' ? 'Safari chặn cửa sổ Google. Cho phép cửa sổ bật lên cho trang này rồi bấm lại.' : (e && e.type === 'popup_closed' ? '' : 'Không đăng nhập được Google.')) }).requestAccessToken({ prompt: '' }); }
  catch (e) { gdFail(target, 'Không mở được Google. Thử lại.'); } }
function gdFail(target, m) { if (!m) return; if (target) { GPS.msg[target] = m; gpsDraw(); } else { GY.msg = m; gyDraw(); } }
function gdPicker(tok, target) {
  try { const v = new google.picker.DocsView(google.picker.ViewId.DOCS).setMimeTypes('application/pdf').setIncludeFolders(true).setSelectFolderEnabled(false);
    const b = new google.picker.PickerBuilder().addView(v).setOAuthToken(tok).setDeveloperKey(GD.key).setLocale('vi').setCallback(d => { if (d && d.action === google.picker.Action.PICKED && d.docs && d.docs[0]) gdPicked(d.docs[0].id, tok, target); });
    if (GD.app) b.setAppId(GD.app); b.build().setVisible(true); }
  catch (e) { gdFail(target, 'Không mở được hộp chọn tệp của Google.'); } }
async function gdPicked(fid, tok, target) {
  if (target) { GPS.msg[target] = 'Đang xem tệp trên Google Drive…'; gpsDraw(); } else { GY.msg = 'Đang xem tệp trên Google Drive…'; gyDraw(); }
  const r = await gpFn({ act: 'ginfo', fid, tok });
  if (!r || r.error) return gdFail(target, gdErrMsg(r || {}) || 'Chưa xem được tệp: ' + ((r && r.error) || ''));
  const P = { drive: { fid, tok }, name: r.name, size: r.size, n: r.n, info: null };
  if (target) { GPS.nf[target] = P; GPS.msg[target] = ''; return gpsDraw(); }
  GY.pdf = P; GY.msg = ''; gyDraw();
  const i = await gpFn({ act: 'info' }); if (GY.pdf === P) { P.info = i && i.cap ? i : null; P.net = !!(i && i.net); gyDraw(); } }
async function gdCore(P, ui, extra = {}) {
  const D = P.drive; let lock = null;
  const fail = m => { if (lock) lock.release().catch(() => {}); ui.fail(m); return null; };
  try {
    if (navigator.onLine === false) return fail('Gửi PDF cần mạng. Có mạng rồi bấm Gửi lại.');
    ui.up({ i: 0, n: P.n, st: 'Đang chuẩn bị…' });
    try { if (navigator.wakeLock) lock = await navigator.wakeLock.request('screen'); } catch (e) {}
    let id = null, miss = null, name = P.name; const rec = gpRec();
    if (rec && rec.fid === D.fid && rec.size === P.size && (rec.doi || null) === (extra.doi || null) && Date.now() - rec.t < 2 * 864e5) {   // chép tiếp
      const d = await gpFn({ act: 'done', id: rec.id });
      if (d.ok) miss = []; else if (d.miss) miss = d.miss;
      if (miss) id = rec.id; }
    if (!id) {
      let s = await gpFn({ act: 'gstart', fid: D.fid, tok: D.tok, ...extra });
      if (s.error === 'dang' && confirm('Đang có một tệp PDF tải dở (của máy này hoặc máy khác dùng chung tài khoản). Bỏ tệp đó để gửi tệp này?')) s = await gpFn({ act: 'gstart', fid: D.fid, tok: D.tok, ...extra, thay: 1 });
      if (s.error) return fail(gdStartErr(s));
      id = s.id; name = s.name; miss = Array.from({ length: s.n }, (_, i) => i); gpRec({ id, fid: D.fid, size: P.size, doi: extra.doi || null, t: Date.now() }); }
    for (let round = 0; round < 2; round++) {
      for (let q = 0; q < miss.length; q++) { const i = miss[q];
        ui.up({ i: P.n - miss.length + q, n: P.n, st: `Đang chép phần ${i + 1}/${P.n} từ Google Drive…` });
        let r = null, ok = false;
        for (let k = 0; k < GP_TRY && !ok; k++) { r = await gpFn({ act: 'gcopy', id, i, tok: D.tok }); if (r.ok) ok = true; else if (['tok', 'quyen', 'ngoai', 'ma', 'phan'].includes(r.error)) break; else if (k < GP_TRY - 1) await new Promise(x => setTimeout(x, 1500 * (k + 1))); }
        if (!ok) return fail(gdErrMsg(r) || `Chưa chép được phần ${i + 1}. Bấm Gửi lại để chép tiếp.`); }
      ui.up({ i: P.n, n: P.n, st: 'Đang kiểm đủ phần…' });
      const d = await gpFn({ act: 'done', id });
      if (d.ok) { gpRec(null); if (lock) lock.release().catch(() => {}); return { id, name, size: P.size, n: P.n }; }
      if (!d.miss) return fail(d.net ? 'Mất mạng. Có mạng rồi bấm Gửi lại.' : 'Chưa gửi được PDF: ' + d.error);
      miss = d.miss; }
    return fail('Máy chủ chưa chép đủ phần. Bấm Gửi lại.'); }
  catch (e) { return fail('Chưa gửi được PDF: ' + String((e && e.message) || e).slice(0, 120)); } }
const gpRun = (P, ui, extra) => P.drive ? gdCore(P, ui, extra) : gpCore(P, ui, extra);

// Lõi tải PDF (dùng chung: gửi góp ý mới, 🔄 thay tệp ở danh sách "Đã gửi"); ui.up(tiến độ), ui.fail(chữ báo lỗi); extra gửi kèm lệnh start (vd. { doi: id tệp cũ }).
async function gpCore(P, ui, extra = {}) {
  try { return await gpCoreRun(P, ui, extra); }
  catch (e) { ui.fail(gpUnread(e) ? GP_ICLOUD : 'Chưa gửi được PDF: ' + String((e && e.message) || e).slice(0, 120)); return null; } }
async function gpCoreRun(P, ui, extra = {}) {
  const f = P.f; let lock = null;
  const fail = m => { if (lock) lock.release().catch(() => {}); ui.fail(m); return null; };
  if (navigator.onLine === false) return fail('Gửi PDF cần mạng. Có mạng rồi bấm Gửi lại.');
  ui.up({ i: 0, n: P.n, st: 'Đang chuẩn bị…' });
  try { if (navigator.wakeLock) lock = await navigator.wakeLock.request('screen'); } catch (e) {}
  let id = null, toks = null; const rec = gpRec();
  if (rec && rec.name === f.name && rec.size === f.size && rec.lm === f.lastModified && (rec.doi || null) === (extra.doi || null) && Date.now() - rec.t < 2 * 864e5) {   // tải tiếp
    const d = await gpFn({ act: 'done', id: rec.id });
    if (d.ok) toks = [];
    else if (d.miss) { const s = await gpFn({ act: 'sign', id: rec.id, need: d.miss }); if (s.toks) toks = s.toks; }
    if (toks) id = rec.id; }
  if (!id) {
    const parts = [];
    for (let i = 0; i < P.n; i++) { ui.up({ i: 0, n: P.n, st: `Đang đọc tệp: phần ${i + 1}/${P.n}…` }); const b = f.slice(i * GP_CH, (i + 1) * GP_CH); parts.push({ size: b.size, sha: await gpSha(b) }); }
    let s = await gpFn({ act: 'start', name: P.name, size: P.size, parts, ...extra });
    if (s.error === 'dang' && confirm('Đang có một tệp PDF tải dở (của máy này hoặc máy khác dùng chung tài khoản). Bỏ tệp đó để gửi tệp này?')) s = await gpFn({ act: 'start', name: P.name, size: P.size, parts, ...extra, thay: 1 });
    if (s.error) return fail(s.error === 'day' ? `Kho tài liệu chỉ còn ${gpMB(Math.max(0, s.cap - s.used))}. Nhờ người sáng lập xoá tệp cũ rồi gửi lại.`
      : s.error === 'du' ? 'Đã có 2 tệp PDF đang lưu. Xoá bớt một tệp rồi gửi lại.' : s.error === 'dang' ? 'Chưa gửi: đang có tệp PDF khác tải dở.'
      : s.net ? 'Mất mạng. Có mạng rồi bấm Gửi lại.' : 'Chưa gửi được PDF: ' + s.error);
    id = s.id; toks = s.toks; gpRec({ id, name: f.name, size: f.size, lm: f.lastModified, doi: extra.doi || null, t: Date.now() }); }
  for (let round = 0; round < 2; round++) {
    let ok = P.n - toks.length;
    for (const t of toks) { ui.up({ i: ok, n: P.n, st: `Đang tải phần ${ok + 1}/${P.n}…` });
      if (!(await gpPut(t, f.slice(t.i * GP_CH, (t.i + 1) * GP_CH)))) return fail(`Mạng chập chờn: đã tải ${ok}/${P.n} phần. Bấm lại để tải tiếp.`);
      ok++; }
    ui.up({ i: P.n, n: P.n, st: 'Đang kiểm đủ phần…' });
    const d = await gpFn({ act: 'done', id });
    if (d.ok) { gpRec(null); if (lock) lock.release().catch(() => {}); return { id, name: P.name, size: P.size, n: P.n }; }
    if (!d.miss) return fail(d.net ? 'Mất mạng. Có mạng rồi bấm lại.' : 'Chưa gửi được PDF: ' + d.error);
    const s = await gpFn({ act: 'sign', id, need: d.miss }); if (!s.toks) return fail('Chưa gửi được PDF: ' + (s.error || 'thiếu phần'));
    toks = s.toks; }
  return fail('Máy chủ chưa nhận đủ phần. Bấm lại.'); }
async function gpUpload() {
  const P = GY.pdf; GY.busy = true; GY.msg = ''; GY.up = { i: 0, n: P.n, st: 'Đang chuẩn bị…' }; gyDraw();
  const r = await gpRun(P, { up: o => { GY.up = o; gpBar(); }, fail: m => { GY.msg = m; GY.up = null; GY.busy = false; gyDraw(); } });
  if (r) { GY.up = null; GY.pdf = null; GY.busy = false; } return r; }

// ---------- 📄 PDF trong danh sách "Đã gửi" (v158): 👁 Xem (≤ 50 MB) · ✏️ Sửa (tên tệp, chữ góp ý, 🔄 thay tệp) · 🗑 Xoá tệp ----------
// Danh sách "Đã gửi" lưu trên máy (GY_SENT) nên chỉ máy đã gửi thấy thẻ; máy chủ chỉ cho tài khoản đã gửi xem / sửa / thay.
const GP_VIEW = 50 * 1048576;
const GPS = { rows: {}, at: 0, loading: false, ed: null, del: null, busy: null, msg: {}, up: {}, view: {}, nf: {}, fv: {} };
const gpsSent = () => gyLS(GY_SENT).filter(x => x.pdf && x.pdf.id);
async function gpsLoad(force) {
  const ids = gpsSent().map(x => x.pdf.id); if (!ids.length || GPS.loading || (!force && Date.now() - GPS.at < 60000)) return;
  GPS.loading = true; const r = await gpFn({ act: 'st', ids }); GPS.loading = false; GPS.at = Date.now();
  if (r && r.rows) { for (const x of r.rows) GPS.rows[x.id] = x; gpsDraw(); } }
function gpsKeep() { for (const pid of [GPS.ed].filter(Boolean)) { const n = document.getElementById('gpn-' + pid), t = document.getElementById('gpt-' + pid); if (n || t) GPS.fv[pid] = { n: n ? n.value : '', t: t ? t.value : '' }; } }
function gpsDraw() { const el = document.getElementById('gyhome'); if (!el) return; gpsKeep(); el.innerHTML = gyHomeInner(); }
const gpsBody = t => String(t || '').split('\n').filter(l => !l.startsWith('📄 ')).join('\n').trim();
function gpsCard(x) {
  const p = x.pdf, pid = p.id, r = GPS.rows[pid], st = r ? r.st : (p.del ? 'xoa' : null), name = (r && r.name) || p.name, size = (r && r.size) || p.size;
  const busy = GPS.busy === pid, U = GPS.up[pid], msg = GPS.msg[pid], ed = GPS.ed === pid, fv = GPS.fv[pid] || {};
  const stTxt = (r && r.src === 'drive' ? 'từ Google Drive · ' : '') + (st === 'du' ? `đủ ${(r && r.n) || p.n} phần` : st === 'dang' ? 'tải dở' : st === 'xoa' ? 'đã xoá tệp' : 'đang xem trạng thái…');
  const canView = st === 'du' && size <= GP_VIEW, nf = GPS.nf[pid];
  return `<div class="box gypdf gps" id="gps-${esc(pid)}"><div class="mute">${x.id ? '#' + x.id + ' · ' : ''}${esc(gaKind(x.kind))}</div>
    <p style="margin:4px 0"><b>📄 ${esc(name)}</b><br><span class="mute">${gpMB(size)} · ${stTxt}</span></p>
    ${st === 'du' && size > GP_VIEW ? `<p class="mute">Tệp lớn hơn ${gpMB(GP_VIEW)}: mở bằng tệp gốc trên máy bạn.</p>` : ''}
    ${GPS.view[pid] ? `<div class="chips tap"><a class="chip on gpsopen" href="${GPS.view[pid]}" target="_blank" rel="noopener">📄 Mở PDF</a></div>` : ''}
    ${U ? `<progress max="${U.n}" value="${U.i}" aria-label="Tiến độ"></progress><p class="mute" role="status">${esc(U.st)}</p>` : ''}
    ${msg ? `<p class="mute" role="status">${esc(msg)}</p>` : ''}
    ${ed ? `<label class="mute" for="gpn-${esc(pid)}">Tên tệp</label><input id="gpn-${esc(pid)}" value="${esc(fv.n != null ? fv.n : name)}" maxlength="200" ${busy ? 'disabled' : ''}>
      <label class="mute" for="gpt-${esc(pid)}">Nội dung góp ý</label><textarea id="gpt-${esc(pid)}" rows="3" maxlength="4000" ${busy ? 'disabled' : ''}>${esc(fv.t != null ? fv.t : gpsBody(r && r.txt != null ? r.txt : x.txt))}</textarea>
      <div class="chips tap gyadd"><label class="chip" for="gpf-${esc(pid)}">🔄 ${nf ? 'Đổi tệp khác' : 'Thay bằng tệp khác'}</label><input id="gpf-${esc(pid)}" data-gpf="${esc(pid)}" type="file" accept=".pdf,application/pdf" hidden>${gdOn() ? `<button class="chip" data-g="gdr" data-p="${esc(pid)}">☁️ Thay từ Google Drive</button>` : ''}</div>
      ${nf ? `<p class="mute">Tệp mới: ${esc(nf.name)} · ${gpMB(nf.size)}. Lưu thì tệp cũ bị xoá.</p>` : ''}
      <div class="chips tap"><button class="chip on" data-g="pss" data-p="${esc(pid)}" ${busy ? 'disabled' : ''}>${busy ? 'Đang lưu…' : '💾 Lưu'}</button><button class="chip" data-g="psc" data-p="${esc(pid)}" ${busy ? 'disabled' : ''}>Huỷ</button></div>`
    : `<div class="chips tap">${canView ? `<button class="chip" data-g="psv" data-p="${esc(pid)}" ${busy ? 'disabled' : ''}>👁 Xem</button>` : ''}${r && r.mine ? `<button class="chip" data-g="pse" data-p="${esc(pid)}" ${busy ? 'disabled' : ''}>✏️ Sửa</button>` : ''}${st && st !== 'xoa' ? `<button class="chip ${GPS.del === pid ? 'on' : ''}" data-g="psd" data-p="${esc(pid)}" ${busy ? 'disabled' : ''}>${GPS.del === pid ? 'Bấm lần nữa để xoá' : '🗑 Xoá tệp'}</button>` : ''}</div>`}
  </div>`; }
function gpsSet(pid, o) { const L = gyLS(GY_SENT); for (const x of L) if (x.pdf && x.pdf.id === pid) Object.assign(x, o); gyLS(GY_SENT, L); }
async function gpsView(pid) {
  GPS.busy = pid; GPS.msg[pid] = 'Đang tải tệp về…'; gpsDraw();
  const r = await gpFn({ act: 'mo', id: pid }); const end = m => { GPS.busy = null; GPS.up[pid] = null; GPS.msg[pid] = m; gpsDraw(); };
  if (!r || !r.urls) return end(r && r.error === 'lon' ? `Tệp lớn hơn ${gpMB(GP_VIEW)}: mở bằng tệp gốc trên máy bạn.` : 'Chưa mở được: ' + ((r && r.error) || ''));
  const bs = [];
  for (let i = 0; i < r.urls.length; i++) { GPS.up[pid] = { i, n: r.urls.length, st: `Đang tải phần ${i + 1}/${r.urls.length}…` }; gpsDraw();
    let b = null; try { const x = await fetch(r.urls[i]); if (x.ok) b = await x.blob(); } catch (e) {}
    if (!b || (r.parts[i] && (b.size !== r.parts[i].size || (r.parts[i].sha && (await gpSha(b)) !== r.parts[i].sha)))) return end('Tải về hỏng một phần. Thử lại.');
    bs.push(b); }
  if (GPS.view[pid]) URL.revokeObjectURL(GPS.view[pid]);
  GPS.view[pid] = URL.createObjectURL(new Blob(bs, { type: 'application/pdf' })); end('Đã tải xong. Bấm 📄 Mở PDF.'); }
async function gpsDel(pid) {
  if (GPS.del !== pid) { GPS.del = pid; return gpsDraw(); } GPS.del = null; GPS.busy = pid; gpsDraw();
  const r = await gpFn({ act: 'xoa', id: pid }); GPS.busy = null;
  if (r && r.ok) { gpsSet(pid, { pdf: { ...(gpsSent().find(x => x.pdf.id === pid) || {}).pdf, del: 1 } }); if (GPS.rows[pid]) GPS.rows[pid].st = 'xoa'; GPS.msg[pid] = 'Đã xoá tệp. Góp ý vẫn giữ.'; }
  else GPS.msg[pid] = 'Chưa xoá được: ' + ((r && r.error) || ''); gpsDraw(); }
async function gpsSave(pid) {
  gpsKeep(); const fv = GPS.fv[pid] || {}, r = GPS.rows[pid] || {}, x = gpsSent().find(y => y.pdf.id === pid); if (!x) return;
  const txt = String(fv.t || '').trim(); if (!txt) { GPS.msg[pid] = 'Nội dung góp ý không được trống.'; return gpsDraw(); }
  GPS.busy = pid; GPS.msg[pid] = ''; gpsDraw(); let cur = pid, name = r.name || x.pdf.name;
  const nf = GPS.nf[pid];
  if (nf) {   // 🔄 thay tệp: tải tệp mới (tệp cũ không tính vào trần), góp ý trỏ sang tệp mới, xoá tệp cũ
    const fname = (/\.pdf$/i.test(nf.name) ? nf.name : nf.name + '.pdf').slice(-200);
    const up = await gpRun(nf.drive ? nf : { f: nf, name: fname, size: nf.size, n: Math.ceil(nf.size / GP_CH) }, { up: o => { GPS.up[pid] = o; gpsDraw(); }, fail: m => { GPS.msg[pid] = m; } }, { doi: pid });
    GPS.up[pid] = null; if (!up) { GPS.busy = null; return gpsDraw(); }
    const d = await gpFn({ act: 'doi', old: pid, id: up.id });
    if (!d || !d.ok) { GPS.busy = null; GPS.msg[pid] = 'Tệp mới đã lên nhưng chưa gắn vào góp ý: ' + ((d && d.error) || ''); return gpsDraw(); }
    gpsSet(pid, { pdf: { id: up.id, name: up.name, size: up.size, n: up.n } }); GPS.rows[up.id] = { id: up.id, name: up.name, size: up.size, n: up.n, st: 'du', mine: true, txt: d.txt };
    delete GPS.nf[pid]; cur = up.id; name = (fv.n || '').trim() && fv.n.trim() !== (r.name || x.pdf.name) ? fv.n.trim() : up.name; }
  else name = (fv.n || '').trim() || name;
  const s = await gpFn({ act: 'sua', id: cur, name, txt });
  GPS.busy = null; GPS.ed = null; delete GPS.fv[pid];
  if (s && s.ok) { gpsSet(cur, { txt: s.txt.slice(0, 80), pdf: { ...(gpsSent().find(y => y.pdf.id === cur) || {}).pdf, name: s.name } }); GPS.rows[cur] = { ...(GPS.rows[cur] || {}), name: s.name, txt: s.txt }; GPS.msg[cur] = nf ? 'Đã thay tệp và lưu.' : 'Đã lưu.'; }
  else GPS.msg[cur] = 'Chưa lưu được: ' + ((s && s.error) || '');
  gpsDraw(); }
document.addEventListener('change', async e => { const t = e.target.closest && e.target.closest('[data-gpf]'); if (!t) return; const f = t.files && t.files[0], pid = t.dataset.gpf; gpsKeep();
  if (!f) return; if (!(await gpReadable(f))) GPS.msg[pid] = GP_ICLOUD; else if (!/\.pdf$/i.test(f.name) && f.type !== 'application/pdf') GPS.msg[pid] = 'Chỉ nhận tệp PDF.'; else if (f.size > GP_MAX) GPS.msg[pid] = `Tệp ${gpMB(f.size)} quá lớn. Tối đa ${gpMB(GP_MAX)}.`; else { GPS.nf[pid] = f; GPS.msg[pid] = ''; }
  gpsDraw(); });

// 🗂 Quản lý góp ý: dòng 📄 + Xoá tệp (bấm 2 lần). Trạng thái lấy từ máy chủ (app không đọc được nội dung).
async function gpStat() { const ids = [...new Set((GA.rows || []).map(x => x.ctx && x.ctx.pdf && x.ctx.pdf.id).filter(Boolean))]; if (!ids.length) return;
  const r = await gpFn({ act: 'st', ids }); GA.pdf = {}; for (const x of (r && r.rows) || []) GA.pdf[x.id] = x; gaRender(); }
function gpCard(gid, p) { const r = (GA.pdf || {})[p.id], st = r ? r.st : null;
  return `<div class="gypdf"><p>📄 ${esc(p.name)} · ${gpMB(p.size)} · ${st === 'du' ? `đủ ${r.n} phần` : st === 'dang' ? 'tải dở' : st === 'xoa' ? 'đã xoá tệp' : 'đang xem…'}</p>
    ${st && st !== 'xoa' ? `<p class="mute">Claude đọc được tệp này khi bạn bảo “đọc PDF góp ý #${gid}”. Đọc xong nên xoá để trả chỗ (kho 800 MB).</p>
    <div class="chips tap"><button class="chip ${GA.pdel === p.id ? 'on' : ''}" data-g="pdfdel" data-p="${esc(p.id)}">${GA.pdel === p.id ? 'Bấm lần nữa để xoá tệp' : '🗑 Xoá tệp PDF'}</button></div>` : ''}</div>`; }
async function gpDel(pid) { if (GA.pdel !== pid) { GA.pdel = pid; return gaRender(); } GA.pdel = null;
  const r = await gpFn({ act: 'xoa', id: pid }); toast(r && r.ok ? 'Đã xoá tệp PDF. Góp ý vẫn giữ.' : 'Chưa xoá được: ' + ((r && r.error) || '')); gpStat(); }

// ---------- nút nổi + sự kiện ----------
(() => { const b = document.createElement('button'); b.id = 'gybtn'; b.setAttribute('aria-label', 'Góp ý'); b.textContent = '💬'; b.onclick = gyOpen; document.body.appendChild(b); })();
document.addEventListener('click', e => {
  const t = e.target.closest('[data-g]'); if (!t) return;
  const g = t.dataset.g, v = t.dataset.v, id = +t.dataset.id;
  if (g === 'close') gyClose();
  else if (g === 'kind') { GY.kind = v; gyDraw(); }
  else if (g === 'rm') { const tt = document.getElementById('gytxt'); if (tt) GY.txt = tt.value; GY.imgs.splice(+v, 1); gyDraw(); }
  else if (g === 'send') gySend();
  else if (g === 'pdfrm') { const tt = document.getElementById('gytxt'); if (tt) GY.txt = tt.value; GY.pdf = null; GY.msg = ''; gyDraw(); }
  else if (g === 'pdfdel') gpDel(t.dataset.p);
  else if (g === 'gd') gdStart(null);
  else if (g === 'gdr') gdStart(t.dataset.p);
  else if (g === 'psv') gpsView(t.dataset.p);
  else if (g === 'psd') gpsDel(t.dataset.p);
  else if (g === 'pse') { gdPre(); gpsKeep(); GPS.ed = t.dataset.p; GPS.del = null; GPS.msg[t.dataset.p] = ''; gpsLoad(true); gpsDraw(); }
  else if (g === 'psc') { GPS.ed = null; delete GPS.fv[t.dataset.p]; delete GPS.nf[t.dataset.p]; gpsDraw(); }
  else if (g === 'pss') gpsSave(t.dataset.p);
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
