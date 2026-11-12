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
function gyOpen() { GY.open = true; GY.ctx = gyCtx(); GY.msg = ''; if (!GY.txt && document.querySelector('#app .q, #app .opt')) GY.kind = 'sai'; gyDraw(); }   // đang làm câu hỏi: mặc định ⚑ Câu sai
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
    <div class="chips tap gyadd"><label class="chip" for="gyfile">📷 Ảnh ${GY.imgs.length}/${GY_IMG_N}</label><input id="gyfile" type="file" accept="image/*" multiple hidden>${GY.pdf ? '' : `<label class="chip" for="gypdf">📄 PDF</label><input id="gypdf" type="file" accept=".pdf,application/pdf" hidden>`}</div>
    <p class="mute">Ảnh chụp màn hình rất có ích. Tài liệu PDF tới ${gpMB(GP_MAX)}.</p>
    ${gpBox()}
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
    const sent = gyLS(GY_SENT); sent.push({ id: data ? data.id : '', t: it.t, kind: it.kind, txt: it.txt.slice(0, 80), n: imgs.length }); gyLS(GY_SENT, sent.slice(-50));
  } catch (e) { break; } }
  gyBusy = false;
}
// Khối 💬 Góp ý ở trang chính: góp ý đã gửi + nút quản lý
function gyHomeInner() { const s = gyLS(GY_SENT), q = gyLS(GY_LS);
  return `<h2>💬 Góp ý</h2><p class="mute">Thấy lỗi, khó hiểu hay có ý tưởng: bấm nút 💬 ở góc dưới phải, ở màn nào cũng được.</p>
    ${q.length ? `<p class="mute">${q.length} góp ý chờ gửi (mất mạng). <button class="link" data-g="flush">Gửi lại</button></p>` : ''}
    ${s.length ? `<div class="mute">Đã gửi:</div>${s.slice(-5).reverse().map(x => `<div class="mute">${x.id ? '#' + x.id + ' · ' : ''}${esc(gaKind(x.kind))} · ${esc(x.txt)}${x.n ? ` · ${x.n} ảnh` : ''}</div>`).join('')}` : ''}
`; }   // v136: 🗂 Quản lý góp ý chuyển vào 💾 Dữ liệu → 🛠 Công cụ người sáng lập (bkTools)
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

// ---------- 📄 PDF lớn (v156, specs/013-gopy-pdf-lon) ----------
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
async function gpSha(b) { const h = await crypto.subtle.digest('SHA-256', await b.arrayBuffer()); return [...new Uint8Array(h)].map(x => x.toString(16).padStart(2, '0')).join(''); }
async function gpPick(f) {
  const t = document.getElementById('gytxt'); if (t) GY.txt = t.value; GY.msg = '';
  if (!f) return;
  if (!/\.pdf$/i.test(f.name) && f.type !== 'application/pdf') { GY.msg = 'Chỉ nhận tệp PDF.'; return gyDraw(); }
  if (f.size > GP_MAX) { GY.msg = `Tệp ${gpMB(f.size)} quá lớn. Tối đa ${gpMB(GP_MAX)}.`; return gyDraw(); }
  if (!f.size) { GY.msg = 'Tệp rỗng.'; return gyDraw(); }
  const name = (/\.pdf$/i.test(f.name) ? f.name : f.name + '.pdf').slice(-200);
  GY.pdf = { f, name, size: f.size, n: Math.ceil(f.size / GP_CH), info: null }; gyDraw();
  const r = await gpFn({ act: 'info' }); if (GY.pdf && GY.pdf.f === f) { GY.pdf.info = r && r.cap ? r : null; GY.pdf.net = !!(r && r.net); gyDraw(); } }
function gpBox() { const P = GY.pdf; if (!P) return '';
  const I = P.info, left = I ? I.cap - I.used : null, full = I && P.size > left, min = Math.max(1, Math.round(P.size / GP_BPS / 60)), U = GY.up;
  return `<div class="box gypdf"><div class="row"><b>📄 ${esc(P.name)}</b>${GY.busy ? '' : `<button class="link tap" data-g="pdfrm" aria-label="Bỏ tệp PDF">✕ Bỏ</button>`}</div>
    <p class="mute">${gpMB(P.size)} · chia ${P.n} phần để tải · ${I ? `kho còn ${gpMB(Math.max(0, left))}` : P.net ? 'chưa có mạng' : 'đang xem chỗ trống…'}</p>
    ${full ? `<p class="warnt" role="alert">Kho tài liệu không đủ chỗ cho tệp này. Nhờ người sáng lập xoá tệp cũ rồi gửi lại.</p>` : ''}
    ${U ? `<progress max="${U.n}" value="${U.i}" aria-label="Tiến độ tải PDF"></progress><p class="mute" role="status">${esc(U.st)}</p>`
      : `<p class="mute">Khoảng ${min} phút qua Wi-Fi. Nên dùng Wi-Fi và để màn hình sáng tới khi xong. Rớt mạng thì bấm Gửi lại: app tải tiếp phần còn thiếu.</p>`}</div>`; }
function gpBar() { const el = document.querySelector('#gysheet .gypdf'); if (el) el.outerHTML = gpBox(); }
async function gpPut(t, blob) {
  for (let k = 0; k < GP_TRY; k++) {
    try { const r = await fetch(`${SB_URL}/storage/v1/object/upload/sign/gopy-pdf/${t.path}?token=${encodeURIComponent(t.token)}`, { method: 'PUT', headers: { apikey: SB_KEY, 'content-type': 'application/octet-stream' }, body: blob });
      if (r.ok) return true; const x = await r.text().catch(() => ''); if (/exist|duplicate/i.test(x)) return true; }
    catch (e) {}
    await new Promise(r => setTimeout(r, 1500 * (k + 1))); }
  return false; }
async function gpUpload() {
  const P = GY.pdf, f = P.f; let lock = null;
  const fail = m => { GY.msg = m; GY.up = null; GY.busy = false; if (lock) lock.release().catch(() => {}); gyDraw(); return null; };
  if (navigator.onLine === false) return fail('Gửi PDF cần mạng. Có mạng rồi bấm Gửi lại.');
  GY.busy = true; GY.msg = ''; GY.up = { i: 0, n: P.n, st: 'Đang chuẩn bị…' }; gyDraw();
  try { if (navigator.wakeLock) lock = await navigator.wakeLock.request('screen'); } catch (e) {}
  let id = null, toks = null; const rec = gpRec();
  if (rec && rec.name === f.name && rec.size === f.size && rec.lm === f.lastModified && Date.now() - rec.t < 2 * 864e5) {   // tải tiếp
    const d = await gpFn({ act: 'done', id: rec.id });
    if (d.ok) toks = [];
    else if (d.miss) { const s = await gpFn({ act: 'sign', id: rec.id, need: d.miss }); if (s.toks) toks = s.toks; }
    if (toks) id = rec.id; }
  if (!id) {
    const parts = [];
    for (let i = 0; i < P.n; i++) { GY.up.st = `Đang đọc tệp: phần ${i + 1}/${P.n}…`; gpBar(); const b = f.slice(i * GP_CH, (i + 1) * GP_CH); parts.push({ size: b.size, sha: await gpSha(b) }); }
    let s = await gpFn({ act: 'start', name: P.name, size: P.size, parts });
    if (s.error === 'dang' && confirm('Đang có một tệp PDF tải dở (của máy này hoặc máy khác dùng chung tài khoản). Bỏ tệp đó để gửi tệp này?')) s = await gpFn({ act: 'start', name: P.name, size: P.size, parts, thay: 1 });
    if (s.error) return fail(s.error === 'day' ? `Kho tài liệu chỉ còn ${gpMB(Math.max(0, s.cap - s.used))}. Nhờ người sáng lập xoá tệp cũ rồi gửi lại.`
      : s.error === 'du' ? 'Đã có 2 tệp PDF đang lưu. Nhờ người sáng lập xoá bớt rồi gửi lại.' : s.error === 'dang' ? 'Chưa gửi: đang có tệp PDF khác tải dở.'
      : s.net ? 'Mất mạng. Có mạng rồi bấm Gửi lại.' : 'Chưa gửi được PDF: ' + s.error);
    id = s.id; toks = s.toks; gpRec({ id, name: f.name, size: f.size, lm: f.lastModified, t: Date.now() }); }
  for (let round = 0; round < 2; round++) {
    let ok = P.n - toks.length;
    for (const t of toks) { GY.up = { i: ok, n: P.n, st: `Đang tải phần ${ok + 1}/${P.n}…` }; gpBar();
      if (!(await gpPut(t, f.slice(t.i * GP_CH, (t.i + 1) * GP_CH)))) return fail(`Mạng chập chờn: đã tải ${ok}/${P.n} phần. Bấm Gửi lại để tải tiếp.`);
      ok++; }
    GY.up = { i: P.n, n: P.n, st: 'Đang kiểm đủ phần…' }; gpBar();
    const d = await gpFn({ act: 'done', id });
    if (d.ok) { gpRec(null); if (lock) lock.release().catch(() => {}); GY.up = null; GY.pdf = null; GY.busy = false; return { id, name: P.name, size: P.size, n: P.n }; }
    if (!d.miss) return fail(d.net ? 'Mất mạng. Có mạng rồi bấm Gửi lại.' : 'Chưa gửi được PDF: ' + d.error);
    const s = await gpFn({ act: 'sign', id, need: d.miss }); if (!s.toks) return fail('Chưa gửi được PDF: ' + (s.error || 'thiếu phần'));
    toks = s.toks; }
  return fail('Máy chủ chưa nhận đủ phần. Bấm Gửi lại.'); }
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
