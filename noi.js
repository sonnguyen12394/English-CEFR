// 🎤 Luyện nói (góp ý của người sáng lập 23/10/2026): (1) máy chép lời nói thành chữ (Web Speech của trình duyệt), (2) ghi âm rồi chấm từng âm
// bằng mô hình chạy trên máy, tải miễn phí một lần (phon-worker.js + gop.js, chép từ game). Chỉ để luyện: không tính 📘 Học / 🔁 Nhớ (người sáng lập chọn).
// Mở từ nút 🎤 Nói thử cạnh 🔊 (sayBtns). Điểm máy chấm là ước tính, chưa người thật kiểm.
const SREC = window.SpeechRecognition || window.webkitSpeechRecognition || null;
const NK = 'el-phon';   // '1' = đã tải bộ chấm ít nhất một lần (trình duyệt giữ trong Cache Storage), mở màn là tự nạp lại từ máy
const NO = { w: null, st: 'idle', rec: null, chunks: [], t: 0, url: '', asr: null, heard: '', alts: [], asrErr: '', res: null, err: '', loading: false, prog: 0, total: 0, vocab: null, wk: null };
const nHas = () => { try { return localStorage.getItem(NK) === '1'; } catch (e) { return false; } };

// Từ đồng âm hay gặp: máy chép ra từ cùng cách đọc vẫn tính là nói đúng.
const HOMO = [['two', 'to', 'too', '2'], ['four', 'for', '4'], ['eight', 'ate', '8'], ['one', 'won', '1'], ['right', 'write'], ['see', 'sea'], ['know', 'no'], ['hear', 'here'],
  ['buy', 'by', 'bye'], ['meet', 'meat'], ['son', 'sun'], ['hour', 'our'], ['flower', 'flour'], ['week', 'weak'], ['where', 'wear'], ['i', 'eye'], ['their', 'there'],
  ['red', 'read'], ['new', 'knew'], ['knight', 'night'], ['plane', 'plain'], ['tail', 'tale'], ['road', 'rode'], ['pair', 'pear'], ['blue', 'blew'], ['whole', 'hole']];
const NUMS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty'];
const nNorm = s => String(s).toLowerCase().replace(/[‘’]/g, "'").replace(/[^a-z0-9' ]+/g, ' ').replace(/\s+/g, ' ').trim();
const nSame = (a, b) => a === b || HOMO.some(g => g.includes(a) && g.includes(b)) || NUMS[+b] === a || NUMS[+a] === b;
// Mọi từ của từ / cụm mẫu đều có trong lời máy nghe (bỏ qua mạo từ "a / an / the" đứng đầu, đuôi -s).
function nMatch(target, alts) { const tw = nNorm(target).split(' ').filter((x, i, a) => !(a.length > 1 && i === 0 && /^(a|an|the|to)$/.test(x)));
  for (const h of alts) { const hw = nNorm(h).split(' '); if (tw.every(t => hw.some(x => nSame(t, x) || nSame(t, x.replace(/s$/, ''))))) return h; }
  return null; }

// ---------- (1) nhận chữ ----------
function nAsr() { if (!SREC) { NO.asrErr = 'Trình duyệt này chưa chép được lời nói (trên iPhone hãy mở bằng Safari).'; return; }
  let r; try { r = new SREC(); } catch (e) { NO.asrErr = 'Chưa bật được nhận diện giọng nói.'; return; }
  r.lang = 'en-US'; r.interimResults = true; r.maxAlternatives = 5; r.continuous = false; NO.asr = r; NO.heard = ''; NO.alts = []; NO.asrErr = '';
  r.onresult = e => { const alts = []; for (let i = e.resultIndex; i < e.results.length; i++) for (let k = 0; k < e.results[i].length; k++) alts.push(e.results[i][k].transcript);
    // iPhone hay không trả kết quả cuối: giữ chữ tạm mới nhất.
    if (alts.length) { NO.alts = alts; NO.heard = alts[0]; const el = document.getElementById('nheard'); if (el) el.textContent = NO.heard; } };
  r.onerror = e => { NO.asrErr = { 'not-allowed': 'Chưa cho phép micro / nhận diện giọng nói: vào Cài đặt → Safari → Micro, chọn Cho phép.', 'no-speech': 'Máy chưa nghe thấy gì.', network: 'Chép lời cần mạng.' }[e.error] || ''; };
  r.onend = () => { NO.asr = null; if (NO.st !== 'rec') nPaint(); };
  try { r.start(); } catch (e) { NO.asr = null; } }

// ---------- (2) bộ chấm âm trên máy ----------
function nWorker() { if (NO.wk) return NO.wk;
  const w = new Worker('phon-worker.js?v=1', { type: 'module' });
  w.onmessage = e => { const m = e.data || {};
    if (m.type === 'progress') { NO.prog = m.loaded; NO.total = m.total; const el = document.getElementById('nprog'); if (el) el.textContent = nProg(); return; }
    if (m.type === 'ready') { NO.vocab = m.vocab; NO.loading = false; try { localStorage.setItem(NK, '1'); } catch (x) {} }
    else if (m.type === 'logits') { NO.st = 'idle'; nScore(m); }
    else if (m.type === 'error') { NO.err = 'Bộ chấm: ' + m.msg; NO.st = 'idle'; NO.loading = false; }
    nPaint(); };
  w.onerror = e => { NO.err = 'Bộ chấm gặp lỗi: ' + (e.message || 'có thể máy thiếu bộ nhớ'); NO.st = 'idle'; NO.loading = false; nPaint(); };
  return NO.wk = w; }
const nProg = () => NO.total ? `${Math.round(NO.prog / 1048576)} / ${Math.round(NO.total / 1048576)} MB` : 'Đang chuẩn bị…';
function nLoad() { NO.err = ''; NO.loading = true; NO.prog = NO.total = 0; nWorker().postMessage({ type: 'load', dtype: 'q8' }); nPaint(); }
async function nDel() { try { NO.wk && NO.wk.terminate(); } catch (e) {} Object.assign(NO, { wk: null, vocab: null, res: null });
  try { localStorage.removeItem(NK); } catch (e) {} try { await caches.delete('transformers-cache'); } catch (e) {} toast('Đã xoá bộ chấm khỏi máy.'); nPaint(); }
// Âm mong đợi: phiên âm của từ (cụm từ: mỗi chữ một nhóm) → bộ âm của mô hình.
function nTarget(w) { const words = [], phones = [], parts = String(w.ipa || '').replace(/\//g, '').trim().split(/\s+/), txt = w.w.split(/\s+/);
  parts.forEach((ip, i) => { const k = words.length; words.push(txt.length === parts.length ? txt[i] : ip); for (const p of GOP.toModelPhones(ip, NO.vocab)) phones.push({ ...p, w: k }); });
  return { words, phones }; }
function nScore(m) { const T = m.dims[1], V = m.dims[2], idTo = [], blank = (NO.vocab || {})['<pad>'] ?? 0; for (const [k, v] of Object.entries(NO.vocab || {})) idTo[v] = k;
  const tg = nTarget(NO.w); NO.res = tg.phones.length ? GOP.score(m.data, T, V, tg.phones, tg.words, idTo, blank) : null;
  NO.ph = GOP.greedy(m.data, T, V, idTo, blank);
  if (!NO.res) NO.err = 'Âm thanh quá ngắn hoặc chưa rõ: nói rõ cả từ rồi thử lại.'; }

// ---------- ghi âm: một nút 🎤 làm cả hai việc ----------
async function nRec() { if (NO.st === 'rec') return nStop();
  Object.assign(NO, { res: null, err: '', heard: '', alts: [], asrErr: '', ph: '' });
  let s; try { s = await navigator.mediaDevices.getUserMedia({ audio: { channelCount: 1, echoCancellation: true, noiseSuppression: true } }); }
  catch (e) { NO.err = 'Không mở được micro. Cho phép micro cho trình duyệt rồi thử lại.'; return nPaint(); }
  let mr; try { mr = new MediaRecorder(s); } catch (e) { s.getTracks().forEach(t => t.stop()); NO.err = 'Máy này chưa ghi âm được.'; return nPaint(); }
  NO.chunks = []; mr.ondataavailable = e => { if (e.data && e.data.size) NO.chunks.push(e.data); };
  mr.onstop = () => { s.getTracks().forEach(t => t.stop()); const b = new Blob(NO.chunks, { type: mr.mimeType || 'audio/mp4' });
    try { NO.url && URL.revokeObjectURL(NO.url); NO.url = URL.createObjectURL(b); } catch (e) {} nDecode(b); };
  mr.start(); NO.rec = mr; NO.st = 'rec'; NO.t = setTimeout(nStop, 4000); nPaint();
  // Bật chép lời sau khi micro đã mở (iPhone có thể không cho hai bên dùng micro: lỗi thì vẫn chấm âm).
  nAsr(); }
function nStop() { clearTimeout(NO.t); const r = NO.rec; NO.rec = null; NO.st = 'busy'; try { r && r.state !== 'inactive' && r.stop(); } catch (e) {}
  try { NO.asr && NO.asr.stop(); } catch (e) {} nPaint(); }
async function nDecode(blob) {
  try { const AC = window.AudioContext || window.webkitAudioContext, ac = new AC(), buf = await ac.decodeAudioData(await blob.arrayBuffer()); try { ac.close(); } catch (e) {}
    const n = Math.max(1, Math.ceil(buf.duration * 16000)), oc = new OfflineAudioContext(1, n, 16000), src = oc.createBufferSource(); src.buffer = buf; src.connect(oc.destination); src.start();
    const x = (await oc.startRendering()).getChannelData(0), L = GOP.loudness(x);
    if (L.voiced < 0.05) { NO.st = 'idle'; NO.err = 'Máy chưa nghe thấy tiếng bạn. Bấm ▶ Nghe lại để kiểm, rồi nói to, gần micro hơn.'; return setTimeout(nPaint, 600); }
    if (!NO.vocab || NO.loading) { NO.st = 'idle'; return setTimeout(nPaint, 600); }   // chưa có bộ chấm: chỉ chép chữ (chờ chép lời xong)
    nWorker().postMessage({ type: 'run', audio: x });
  } catch (e) { NO.st = 'idle'; NO.err = 'Không đọc được âm thanh vừa ghi.'; nPaint(); } }

// ---------- màn ----------
const nCls = s => s >= 80 ? 'var(--good)' : s >= 60 ? '#b8860b' : 'var(--bad)';
function nTip(R) { const bad = []; for (const w of R.words) w.phones.forEach((p, k) => { if (p.score < 60) bad.push({ ...p, fin: k === w.phones.length - 1 }); });
  if (!bad.length) return '';
  const b = bad.sort((x, y) => x.score - y.score)[0];
  const t = b.fin && /^[tdkgɡsz]$/.test(b.ipa) ? `Âm cuối /${b.ipa}/ bị nhẹ hoặc nuốt mất: đọc rõ âm cuối, đừng ngắt cụt như tiếng Việt.`
    : b.missing ? `Máy chưa nghe thấy âm /${b.ipa}/: đọc chậm, rõ âm đó.`
    : b.heard ? `Âm /${b.ipa}/ máy nghe giống /${b.heard}/: nghe lại mẫu 🔊 rồi đọc theo.` : `Âm /${b.ipa}/ chưa rõ: nghe lại mẫu 🔊 rồi đọc theo.`;
  return `<p class="mute" style="margin:6px 0 0">💡 ${esc(t)}</p>`; }
function nBody() { const w = NO.w, rec = NO.st === 'rec', busy = NO.st === 'busy';
  const ok = NO.alts.length ? nMatch(w.w, NO.alts) : null;
  const heard = NO.heard || NO.asrErr ? `<div class="box"><b>📝 Máy nghe ra:</b> <span id="nheard">${esc(NO.heard || '…')}</span>
    ${NO.st === 'idle' && NO.heard ? `<br>${ok ? `✅ Máy nghe ra đúng từ <b>${esc(w.w)}</b>${nNorm(ok) !== nNorm(w.w) ? ` (chữ "${esc(ok)}" đọc giống)` : ''}.` : `❌ Chưa ra từ <b>${esc(w.w)}</b>. Nghe mẫu rồi thử lại.`}` : ''}
    ${NO.asrErr ? `<br><span class="mute">${esc(NO.asrErr)}</span>` : ''}</div>` : rec ? `<div class="box"><b>📝 Máy nghe ra:</b> <span id="nheard">…</span></div>` : '';
  const R = NO.res, score = R ? `<div class="box"><div class="row"><b>🎯 Điểm phát âm</b><b style="color:${nCls(R.score)}">${R.score}/100</b></div>
    <div style="font-size:24px;margin:8px 0;letter-spacing:1px">/${R.words.map(x => x.phones.map(p => `<span style="color:${nCls(p.score)}">${esc(p.ipa)}</span>`).join('')).join(' ')}/</div>
    <p class="mute" style="margin:0">Xanh ≥ 80 · vàng 60–79 · đỏ dưới 60.${NO.ph ? ` Máy nghe âm: /${esc(NO.ph)}/` : ''}</p>${nTip(R)}</div>` : '';
  const model = NO.vocab ? `<p class="mute">🧪 Bộ chấm từng âm đã sẵn sàng. <button class="link" data-n="del">Xoá khỏi máy</button></p>`
    : NO.loading ? `<div class="box">⏳ Đang tải bộ chấm từng âm: <span id="nprog">${nProg()}</span><br><span class="mute">Lần đầu tải vài trăm MB, nên dùng Wi-Fi. Lần sau mở từ máy, không tải lại.</span></div>`
    : `<div class="box"><b>🧪 Chấm điểm từng âm</b><p class="mute" style="margin:4px 0">Tải bộ chấm miễn phí về máy một lần (vài trăm MB, nên dùng Wi-Fi). Âm thanh không rời máy. Chưa tải thì chỉ có máy chép chữ.</p><button data-n="load">⬇️ Tải bộ chấm</button></div>`;
  return `<div class="row"><b style="font-size:18px">🎤 Luyện nói</b><button class="link" data-n="x">Đóng ✕</button></div>
    <div style="text-align:center"><div class="big">${esc(w.w)}</div><div class="mute">${esc(w.ipa || '')} · ${esc(w.vi)}</div>
    <div class="chips say"><button class="chip" data-say="${w.id}">🔊 Nghe mẫu</button>${NO.url ? '<button class="chip" data-n="play">▶ Nghe lại mình</button>' : ''}</div></div>
    <button class="pri" data-n="rec" ${busy ? 'disabled' : ''}>${rec ? '⏹ Dừng' : busy ? '⏳ Đang chấm…' : '🎤 Bấm rồi nói'}</button>
    ${NO.err ? `<p style="color:var(--bad)">${esc(NO.err)}</p>` : ''}${heard}${score}${model}
    <p class="mute">Chỉ để luyện, không tính vào 📘 Học / 🔁 Nhớ. Điểm do máy ước tính, chưa người thật kiểm.</p>`; }
function nPaint() { const b = document.getElementById('nbox'); if (b) b.innerHTML = nBody(); }
function noiOpen(w) { if (!w) return; try { speechSynthesis.cancel(); } catch (e) {}
  Object.assign(NO, { w, st: 'idle', res: null, err: '', heard: '', alts: [], asrErr: '', ph: '', url: '' });
  let sh = document.getElementById('nsheet');
  if (!sh) { sh = document.createElement('div'); sh.id = 'nsheet'; sh.innerHTML = '<div class="gybox" id="nbox"></div>'; document.body.appendChild(sh);
    sh.addEventListener('click', e => { if (e.target === sh) return noiClose(); const a = e.target.closest('[data-n]')?.dataset.n;
      if (a === 'x') noiClose(); if (a === 'rec') nRec(); if (a === 'load') nLoad(); if (a === 'del') nDel();
      if (a === 'play') { try { AUD && AUD.pause(); } catch (x) {} AUD = AUD || new Audio(); AUD.src = NO.url; AUD.play().catch(() => {}); } }); }
  sh.hidden = false; nPaint();
  if (!NO.vocab && !NO.loading && nHas()) nLoad(); }   // đã tải lần trước: nạp lại từ bộ nhớ máy
function noiClose() { if (NO.st === 'rec') nStop(); const sh = document.getElementById('nsheet'); if (sh) sh.hidden = true; }
document.addEventListener('click', e => { const b = e.target.closest('[data-noi]'); if (b) noiOpen(WBY[b.dataset.noi]); });
