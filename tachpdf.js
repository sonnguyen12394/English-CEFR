// ✂️ Tách PDF theo trang trong 💬 Góp ý (v163, specs/016-gopy-tach-pdf). Kiểu iLovePDF: 3 chế độ Khoảng trang · Từng trang · Theo cỡ.
// Làm trên máy người dùng bằng pdf-lib 1.17.1 (MIT, vendor/pdf-lib.min.js, nạp lười khi mở công cụ). Tệp kết quả chỉ ở bộ nhớ trang:
// ⬇️ tải từng tệp / ⬇️ .zip (gói không nén, tpZip) hoặc 📤 gửi kèm góp ý (thành GY.pdf, đi đường gửi 📄 có sẵn).
// Tệp lớn có thể làm Safari iPhone tải lại trang: đặt dấu TP_RUN trước khi đọc / tách, xong thì xoá; lần mở sau còn dấu thì báo (FR-007).
const TP_BIG = 150 * 1048576, TP_RUN = 'a1v:tp-run', TP_LIB = 'vendor/pdf-lib.min.js?v=1.17.1';
const TP = { f: null, doc: null, n: 0, err: '', busy: false, prog: '', stop: false, okBig: false,
  mode: 'range', rsub: 'custom', ranges: [[1, 0]], merge: false, every: 10, psub: 'all', sel: '', pmerge: false, szv: 10, szu: 'MB', out: [], crash: null };
const tpRun = v => { try { if (v === undefined) return JSON.parse(localStorage.getItem(TP_RUN) || 'null'); v ? localStorage.setItem(TP_RUN, JSON.stringify(v)) : localStorage.removeItem(TP_RUN); } catch (e) { return null; } };
TP.crash = tpRun(); tpRun(null);   // trang bị tải lại giữa lúc tách lần trước
const tpTick = () => new Promise(r => setTimeout(r, 0));
let TP_LOAD = null;
function tpLib() { if (window.PDFLib) return Promise.resolve(window.PDFLib);
  if (!TP_LOAD) TP_LOAD = gdScript(TP_LIB).then(() => { if (!window.PDFLib) throw new Error('lib'); return window.PDFLib; }).catch(e => { TP_LOAD = null; throw e; });
  return TP_LOAD; }
const tpBase = n => String(n || 'tep').replace(/\.pdf$/i, '').slice(0, 120);
const tpSize = b => b < 1048576 ? Math.max(1, Math.round(b / 1024)) + ' KB' : gpMB(b);
const tpPages = idx => { const a = idx.map(i => i + 1), out = []; for (let i = 0; i < a.length; i++) { let j = i; while (j + 1 < a.length && a[j + 1] === a[j] + 1) j++; out.push(i === j ? '' + a[i] : a[i] + '-' + a[j]); i = j; } return out.join(','); };
// "1, 4, 7-9" → chỉ số trang 0..n-1 (giữ thứ tự gõ, bỏ trùng); sai thì trả { err }
function tpParse(s, n) { const idx = [], seen = new Set(); const parts = String(s || '').split(/[,;\s]+/).filter(Boolean);
  if (!parts.length) return { err: 'Gõ số trang, ví dụ 1, 4, 7-9.' };
  for (const p of parts) { const m = p.match(/^(\d+)(?:-(\d+))?$/); if (!m) return { err: `“${p}” không phải số trang.` };
    const a = +m[1], b = m[2] ? +m[2] : a; if (a < 1 || b > n || a > b) return { err: `Trang ${p} không có (tệp có ${n} trang).` };
    for (let i = a; i <= b; i++) if (!seen.has(i)) { seen.add(i); idx.push(i - 1); } }
  return { idx }; }
const tpRange = (a, b) => Array.from({ length: b - a + 1 }, (_, i) => a - 1 + i);
// Các nhóm trang cần tạo (trừ chế độ Theo cỡ): [{ idx, tag }] hoặc { err }
function tpGroups() { const n = TP.n;
  if (TP.mode === 'range' && TP.rsub === 'custom') {
    const gs = []; for (const [a, b0] of TP.ranges) { const b = b0 || n; if (!(a >= 1 && b <= n && a <= b)) return { err: `Khoảng ${a}–${b} không hợp lệ (tệp có ${n} trang).` }; gs.push({ idx: tpRange(a, b), tag: a === b ? 'trang-' + a : `trang-${a}-${b}` }); }
    if (!gs.length) return { err: 'Thêm ít nhất một khoảng.' };
    return TP.merge && gs.length > 1 ? [{ idx: gs.flatMap(g => g.idx), tag: 'trang-' + tpPages(gs.flatMap(g => g.idx)) }] : gs; }
  if (TP.mode === 'range') { const k = Math.floor(+TP.every); if (!(k >= 1)) return { err: 'Số trang mỗi tệp phải từ 1.' };
    const gs = []; for (let a = 1; a <= n; a += k) { const b = Math.min(n, a + k - 1); gs.push({ idx: tpRange(a, b), tag: a === b ? 'trang-' + a : `trang-${a}-${b}` }); } return gs; }
  if (TP.mode === 'pages' && TP.psub === 'all') return Array.from({ length: n }, (_, i) => ({ idx: [i], tag: 'trang-' + (i + 1) }));
  if (TP.mode === 'pages') { const r = tpParse(TP.sel, n); if (r.err) return r;
    return TP.pmerge ? [{ idx: r.idx, tag: 'trang-' + tpPages(r.idx) }] : r.idx.map(i => ({ idx: [i], tag: 'trang-' + (i + 1) })); }
  return null; }
const tpLimit = () => Math.round((+TP.szv || 0) * (TP.szu === 'KB' ? 1024 : 1048576));
function tpHint() { if (!TP.doc) return '';
  if (TP.mode === 'size') { const L = tpLimit(); return L >= 1024 ? `Mỗi tệp tối đa ${tpSize(L)}. Một trang lớn hơn mức này thì thành tệp riêng.` : 'Gõ cỡ tối đa mỗi tệp.'; }
  const g = tpGroups(); return g.err ? '⚠️ ' + g.err : `Sẽ tạo ${g.length} tệp PDF${g.length > 1 ? ' (tải về gộp được thành 1 tệp .zip)' : ''}.`; }
async function tpMake(idx) { const { PDFDocument } = window.PDFLib, d = await PDFDocument.create();
  const ps = await d.copyPages(TP.doc, Array.from(idx)); for (const p of ps) d.addPage(p);
  return d.save({ useObjectStreams: true }); }
function tpPush(bytes, idx, tag, big) { const name = `${tpBase(TP.f.name)}_${tag}.pdf`;
  TP.out.push({ name, pages: idx.length, size: bytes.length, blob: new Blob([bytes], { type: 'application/pdf' }), crc: tpCrc(bytes), big: !!big }); }
// Theo cỡ: mỗi tệp là các trang liền nhau, lưu thử để đo cỡ thật; nhảy đôi rồi tìm nhị phân số trang (≈ log2 lần lưu mỗi tệp)
async function tpBySize(L) { const n = TP.n; let s = 0;
  while (s < n) { if (TP.stop) return;
    TP.prog = `Đang tách: tới trang ${s + 1}/${n}…`; tpDraw(); await tpTick();
    let best = await tpMake([s]), ok = 1;
    if (best.length > L) { tpPush(best, [s], 'trang-' + (s + 1), true); s++; continue; }
    let bad = 0, k = 2;
    while (s + ok < n && !bad) { const kk = Math.min(k, n - s), b = await tpMake(tpRange(s + 1, s + kk)); await tpTick(); if (TP.stop) return;
      if (b.length <= L) { best = b; ok = kk; k *= 2; } else bad = kk; }
    while (bad && bad - ok > 1) { const m = (ok + bad) >> 1, b = await tpMake(tpRange(s + 1, s + m)); await tpTick(); if (TP.stop) return;
      if (b.length <= L) { best = b; ok = m; } else bad = m; }
    const idx = tpRange(s + 1, s + ok); tpPush(best, idx, ok === 1 ? 'trang-' + (s + 1) : `trang-${s + 1}-${s + ok}`); s += ok; } }
async function tpSplit() {
  if (TP.busy || !TP.doc) return; tpKeep();
  const gs = TP.mode === 'size' ? null : tpGroups(); if (gs && gs.err) { TP.err = gs.err; return tpDraw(); }
  const L = tpLimit(); if (TP.mode === 'size' && L < 1024) { TP.err = 'Cỡ tối đa mỗi tệp phải từ 1 KB.'; return tpDraw(); }
  TP.out = []; TP.err = ''; TP.busy = true; TP.stop = false; tpRun({ name: TP.f.name, size: TP.f.size, at: Date.now() });
  try {
    if (gs) for (let i = 0; i < gs.length && !TP.stop; i++) { TP.prog = `Đang tạo tệp ${i + 1}/${gs.length}…`; tpDraw(); await tpTick(); tpPush(await tpMake(gs[i].idx), gs[i].idx, gs[i].tag); }
    else await tpBySize(L);
    if (TP.stop) { TP.out = []; TP.err = 'Đã huỷ.'; } }
  catch (e) { TP.out = []; TP.err = 'Chưa tách được: ' + (/memory|allocation/i.test(String(e && e.message)) ? 'máy hết bộ nhớ. Thử tệp nhỏ hơn hoặc tách bằng máy tính.' : String((e && e.message) || e).slice(0, 120)); }
  tpRun(null); TP.busy = false; TP.prog = ''; tpDraw(); }

// ---------- ZIP không nén (PDF đã nén sẵn) ----------
const TP_CRC = (() => { const t = new Uint32Array(256); for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; } return t; })();
function tpCrc(u8) { let c = 0xFFFFFFFF; for (let i = 0; i < u8.length; i++) c = TP_CRC[(c ^ u8[i]) & 255] ^ (c >>> 8); return (c ^ 0xFFFFFFFF) >>> 0; }
function tpZip(files) {   // files: [{ name, blob, size, crc }] → Blob .zip
  const enc = new TextEncoder(), parts = [], cen = []; let off = 0;
  const d = new Date(), tm = (d.getHours() << 11) | (d.getMinutes() << 5) | (d.getSeconds() >> 1), dt = ((d.getFullYear() - 1980) << 9) | ((d.getMonth() + 1) << 5) | d.getDate();
  for (const f of files) { const nm = enc.encode(f.name), h = new DataView(new ArrayBuffer(30));
    [[0, 0x04034b50, 4], [4, 20, 2], [6, 0x0800, 2], [8, 0, 2], [10, tm, 2], [12, dt, 2], [14, f.crc, 4], [18, f.size, 4], [22, f.size, 4], [26, nm.length, 2], [28, 0, 2]].forEach(([o, v, s]) => s === 4 ? h.setUint32(o, v, true) : h.setUint16(o, v, true));
    const c = new DataView(new ArrayBuffer(46));
    [[0, 0x02014b50, 4], [4, 20, 2], [6, 20, 2], [8, 0x0800, 2], [10, 0, 2], [12, tm, 2], [14, dt, 2], [16, f.crc, 4], [20, f.size, 4], [24, f.size, 4], [28, nm.length, 2], [30, 0, 2], [32, 0, 2], [34, 0, 2], [36, 0, 2], [38, 0, 4], [42, off, 4]].forEach(([o, v, s]) => s === 4 ? c.setUint32(o, v, true) : c.setUint16(o, v, true));
    parts.push(h.buffer, nm, f.blob); cen.push(c.buffer, nm); off += 30 + nm.length + f.size; }
  const cs = cen.reduce((s, x) => s + (x.byteLength || x.length), 0), e = new DataView(new ArrayBuffer(22));
  [[0, 0x06054b50, 4], [4, 0, 2], [6, 0, 2], [8, files.length, 2], [10, files.length, 2], [12, cs, 4], [16, off, 4], [20, 0, 2]].forEach(([o, v, s]) => s === 4 ? e.setUint32(o, v, true) : e.setUint16(o, v, true));
  return new Blob([...parts, ...cen, e.buffer], { type: 'application/zip' }); }

// ---------- màn ✂️ (vẽ trong tấm 💬 Góp ý thay nội dung thường) ----------
async function tpOpen() {
  const P = GY.pdf; if (!P || !P.f) return;
  const t = document.getElementById('gytxt'); if (t) GY.txt = t.value;
  GY.tach = true;
  if (TP.f !== P.f) Object.assign(TP, { f: P.f, doc: null, n: 0, out: [], err: '', okBig: false, ranges: [[1, 0]], sel: '' });
  if (!TP.doc && P.f.size > TP_BIG && !TP.okBig) return gyDraw();
  if (!TP.doc) await tpRead(); else gyDraw(); }
async function tpRead() {
  TP.busy = true; TP.err = ''; TP.prog = 'Đang tải công cụ tách…'; gyDraw();
  try { await tpLib(); }
  catch (e) { TP.busy = false; TP.prog = ''; TP.err = 'Chưa tải được công cụ tách PDF. Kiểm tra mạng rồi thử lại.'; return gyDraw(); }
  TP.prog = `Đang đọc tệp ${gpMB(TP.f.size)}…`; gyDraw(); await tpTick();
  tpRun({ name: TP.f.name, size: TP.f.size, at: Date.now() });
  try { const buf = new Uint8Array(await TP.f.arrayBuffer()); TP.doc = await window.PDFLib.PDFDocument.load(buf, { updateMetadata: false }); TP.n = TP.doc.getPageCount();
    TP.ranges = [[1, TP.n]]; TP.every = Math.min(TP.every, TP.n) || 1; }
  catch (e) { const m = String((e && e.message) || e);
    TP.err = gpUnread(e) ? GP_ICLOUD : /encrypt/i.test(m) ? 'Tệp có mật khẩu. Bỏ mật khẩu rồi chọn lại.' : /memory|allocation/i.test(m) ? 'Máy hết bộ nhớ khi đọc tệp. Thử tệp nhỏ hơn hoặc tách bằng máy tính.' : 'Không đọc được tệp PDF này (có thể tệp hỏng).'; }
  tpRun(null); TP.busy = false; TP.prog = ''; gyDraw(); }
function tpKeep() { const v = id => { const el = document.getElementById(id); return el ? el.value : null; };
  TP.ranges = TP.ranges.map((r, i) => [+(v('tpa' + i) ?? r[0]) || 0, +(v('tpb' + i) ?? r[1]) || 0]);
  const e = v('tpev'); if (e != null) TP.every = +e || 0; const s = v('tpsel'); if (s != null) TP.sel = s; const z = v('tpsz'); if (z != null) TP.szv = +String(z).replace(',', '.') || 0; }
function tpDraw() { if (GY.open && GY.tach) gyDraw(); }
const TP_MODES = [['range', '▭–▭', 'Khoảng trang'], ['pages', '▯▯▯', 'Từng trang'], ['size', '⇲', 'Theo cỡ']];
function tpHtml() {
  const P = GY.pdf, f = TP.f, dis = TP.busy ? 'disabled' : '';
  const head = `<div class="row"><button class="link tap" data-tp="back" ${dis}>‹ Góp ý</button><button class="link tap" data-g="close" aria-label="Đóng góp ý">✕ Đóng</button></div>
    <h2 id="gy-t" style="margin:4px 0">✂️ Tách PDF</h2>
    <p class="mute" style="margin:0 0 8px"><b>${esc(f ? f.name : '')}</b><br>Cỡ gốc ${f ? gpMB(f.size) : ''}${TP.n ? ` · ${TP.n} trang` : ''}</p>`;
  if (!f || !P) return head;
  if (!TP.doc && f.size > TP_BIG && !TP.okBig && !TP.busy) return head + `<div class="box"><p class="warnt">Tệp lớn (${gpMB(f.size)}). iPhone có thể tải lại trang giữa chừng vì hết bộ nhớ.</p>
    <p class="mute">Nếu bị, hãy tách bằng iLovePDF hoặc máy tính rồi gửi từng phần.</p><button class="pri" data-tp="big">Vẫn thử tách</button></div>`;
  if (!TP.doc) return head + (TP.prog ? `<p class="mute" role="status">${esc(TP.prog)}</p>` : '') + (TP.err ? `<p class="warnt" role="alert">${esc(TP.err)}</p><button data-tp="read">Thử lại</button>` : '');
  const tabs = `<div class="tptabs" role="group" aria-label="Cách tách">${TP_MODES.map(([k, ic, l]) => `<button class="tptab ${TP.mode === k ? 'on' : ''}" data-tp="mode" data-v="${k}" aria-pressed="${TP.mode === k}" ${dis}><span class="tpic" aria-hidden="true">${ic}</span>${l}${TP.mode === k ? '<span class="tpok" aria-hidden="true">✓</span>' : ''}</button>`).join('')}</div>`;
  const seg = (k, cur, opts) => `<div class="seg" role="group">${opts.map(([v, l]) => `<button class="${cur === v ? 'on' : ''}" data-tp="${k}" data-v="${v}" aria-pressed="${cur === v}" ${dis}>${l}</button>`).join('')}</div>`;
  const chk = (k, on, l) => `<label class="tpchk"><input type="checkbox" data-tp="${k}" ${on ? 'checked' : ''} ${dis}> ${l}</label>`;
  let body = '';
  if (TP.mode === 'range') body = seg('rsub', TP.rsub, [['custom', 'Tự chọn khoảng'], ['fixed', 'Mỗi N trang']]) + (TP.rsub === 'custom'
    ? TP.ranges.map((r, i) => `<div class="tprg"><b>Khoảng ${i + 1}</b>${TP.ranges.length > 1 ? `<button class="link tap" data-tp="rdel" data-v="${i}" aria-label="Bỏ khoảng ${i + 1}" ${dis}>✕</button>` : ''}
        <div class="tprow"><label for="tpa${i}">Từ trang</label><input id="tpa${i}" type="number" inputmode="numeric" min="1" max="${TP.n}" value="${r[0] || ''}" ${dis}></div>
        <div class="tprow"><label for="tpb${i}">Đến trang</label><input id="tpb${i}" type="number" inputmode="numeric" min="1" max="${TP.n}" value="${r[1] || ''}" ${dis}></div></div>`).join('')
      + `<button class="tpadd" data-tp="radd" ${dis}>＋ Thêm khoảng</button>${chk('merge', TP.merge, 'Gộp các khoảng thành 1 tệp PDF')}`
    : `<div class="tprow"><label for="tpev">Mỗi tệp</label><input id="tpev" type="number" inputmode="numeric" min="1" max="${TP.n}" value="${TP.every || ''}" ${dis}><span>trang</span></div>`);
  else if (TP.mode === 'pages') body = seg('psub', TP.psub, [['all', 'Tách mọi trang'], ['sel', 'Chọn trang']]) + (TP.psub === 'sel'
    ? `<label class="mute" for="tpsel">Số trang (ví dụ 1, 4, 7-9)</label><input id="tpsel" class="tpwide" inputmode="numeric" value="${esc(TP.sel)}" ${dis}>${chk('pmerge', TP.pmerge, 'Gộp các trang đã chọn thành 1 tệp PDF')}` : '');
  else body = `<p style="margin:8px 0 4px"><b>Tối đa mỗi tệp</b></p><div class="tprow"><input id="tpsz" type="number" inputmode="decimal" min="0" step="any" value="${TP.szv || ''}" aria-label="Cỡ tối đa mỗi tệp" ${dis}>
      ${seg('szu', TP.szu, [['KB', 'KB'], ['MB', 'MB']])}</div><p class="mute">Chậm hơn 2 cách kia: app lưu thử nhiều lần để đo cỡ thật.</p>`;
  const out = TP.out.length ? `<div class="box tpout"><div class="row"><b>✅ ${TP.out.length} tệp</b>${TP.out.length > 1 ? `<button class="chip on" data-tp="zip">⬇️ Tải tất cả (.zip)</button>` : ''}</div>
    ${TP.out.map((o, i) => `<div class="tpfile"><div><b>📄 ${esc(o.name)}</b><br><span class="mute">${o.pages} trang · ${tpSize(o.size)}${o.big ? ` · <span class="warnt">⚠️ vượt ${tpSize(tpLimit())}</span>` : ''}</span></div>
      <div class="chips tap"><button class="chip" data-tp="dl" data-v="${i}">⬇️ Tải về</button><button class="chip" data-tp="send" data-v="${i}" ${o.size > GP_MAX ? 'disabled' : ''}>📤 Gửi kèm góp ý</button></div></div>`).slice(0, 60).join('')}
    ${TP.out.length > 60 ? `<p class="mute">Còn ${TP.out.length - 60} tệp: dùng ⬇️ Tải tất cả (.zip).</p>` : ''}
    <p class="mute">Tệp đã tách chỉ nằm trong trang này. Đóng app hoặc tải lại trang thì mất: tải về trước.</p></div>` : '';
  return head + tabs + `<div class="tpbody">${body}</div>
    <p class="tpinfo" role="status">ⓘ ${esc(TP.busy ? TP.prog : tpHint())}</p>
    ${TP.err ? `<p class="warnt" role="alert">${esc(TP.err)}</p>` : ''}
    ${TP.busy ? `<button data-tp="stop">Huỷ</button>` : `<button class="pri" data-tp="go">✂️ Tách PDF</button>`}${out}`; }
// Lưu Blob thành tệp trên máy (iPhone: Safari hỏi Tải về / mở trong app Tệp)
function tpSave(blob, name) { const u = URL.createObjectURL(blob), a = document.createElement('a'); a.href = u; a.download = name; a.rel = 'noopener';
  document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(u), 60000); }
function tpSend(i) { const o = TP.out[i]; if (!o) return;
  const f = new File([o.blob], o.name, { type: 'application/pdf', lastModified: Date.now() });
  GY.tach = false; gpPick(f); }
const tpCrashLine = () => TP.crash ? `<p class="warnt" role="alert">Lần trước app bị tải lại khi tách “${esc(TP.crash.name)}” (${gpMB(TP.crash.size)}): iPhone không đủ bộ nhớ cho tệp cỡ này. Hãy tách bằng iLovePDF hoặc máy tính rồi gửi từng phần.</p>` : '';
document.addEventListener('click', e => {
  const t = e.target.closest && e.target.closest('[data-tp]'); if (!t || t.tagName === 'INPUT') return;
  const k = t.dataset.tp, v = t.dataset.v;
  if (k === 'open') return tpOpen();
  if (k === 'back') { tpKeep(); GY.tach = false; return gyDraw(); }
  if (k === 'big') { TP.okBig = true; return tpRead(); }
  if (k === 'read') return tpRead();
  if (k === 'go') return tpSplit();
  if (k === 'stop') { TP.stop = true; TP.prog = 'Đang dừng…'; return tpDraw(); }
  if (k === 'dl') { const o = TP.out[+v]; if (o) tpSave(o.blob, o.name); return; }
  if (k === 'zip') return tpSave(tpZip(TP.out), `${tpBase(TP.f.name)}_tach.zip`);
  if (k === 'send') return tpSend(+v);
  if (TP.busy) return;
  tpKeep(); TP.err = '';
  if (k === 'mode') TP.mode = v; else if (k === 'rsub') TP.rsub = v; else if (k === 'psub') TP.psub = v; else if (k === 'szu') TP.szu = v;
  else if (k === 'radd') { const last = TP.ranges[TP.ranges.length - 1] || [0, 0], a = Math.min(TP.n, (last[1] || 0) + 1) || 1; TP.ranges.push([a, TP.n]); }
  else if (k === 'rdel') TP.ranges.splice(+v, 1);
  tpDraw(); });
document.addEventListener('change', e => { const t = e.target; if (!t || !t.dataset || !t.dataset.tp || t.type !== 'checkbox') return;
  tpKeep(); if (t.dataset.tp === 'merge') TP.merge = t.checked; else if (t.dataset.tp === 'pmerge') TP.pmerge = t.checked; tpDraw(); });
document.addEventListener('input', e => { const t = e.target; if (!t || !/^tp(a|b|ev|sel|sz)\d*$/.test(t.id || '') || !GY.tach) return;
  tpKeep(); const el = document.querySelector('#gysheet .tpinfo'); if (el && !TP.busy) el.textContent = 'ⓘ ' + tpHint(); });
