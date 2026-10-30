// 📖 Từ điển bổ sung (v88, 30/10/2026, người sáng lập: "phần từ điển tôi cảm thấy chưa đủ… làm hết đi").
// Gốc rễ (Claude): từ điển cũ là danh sách từ của khoá học, chưa phải công cụ tra khi đang đọc / nghe. Thêm 4 việc, không tự soạn thêm từ (dễ sai, không thêm uy tín):
//   ① hiện đủ dữ liệu sẵn có của từ: nghĩa khác (s2), đồng / trái nghĩa (rel), họ từ (fam), dạng bất quy tắc (irr), mẫu câu (pat), văn phong (reg), thành ngữ (idi);
//   ② tìm thông minh: dạng biến đổi (went → go, children → child: libFind + bảng dạng bất quy tắc), họ từ, cụm từ / thành ngữ, gõ sai 1 chữ; kết quả khớp đúng lên đầu;
//   ③ không có từ → mở từ điển chính thức (Cambridge Anh–Việt, Oxford Learner's) + lưu từ tự nhập;
//   ④ 📌 Sổ từ của tôi: lưu 1 chạm, ôn cách quãng (dùng chung bộ thẻ S.ie.vw với 📥 từ đề thật, iethat.js); mở xem từ đã học = tra từ (mfLookup, luật v76); 🕘 tra gần đây (S.dh).
//   Phát âm: 🔊 Mỹ (giọng thu sẵn) + 🔊 Anh (giọng Anh–Anh của máy, như giọng thi).
// Không đổi luật đo: lưu vào sổ không tạo thẻ CEFR.

const TD_LINKS = [['Cambridge Anh–Việt', q => `https://dictionary.cambridge.org/dictionary/english-vietnamese/${encodeURIComponent(q.toLowerCase().trim().replace(/\s+/g, '-'))}`],
  ['Oxford Learner\'s', q => `https://www.oxfordlearnersdictionaries.com/search/english/?q=${encodeURIComponent(q.trim())}`],
  ['Google Dịch', q => `https://translate.google.com/?sl=en&tl=vi&text=${encodeURIComponent(q.trim())}`]];
const tdLinks = q => `<div class="chips" style="margin:6px 0 0">${TD_LINKS.map(([n, f]) => `<a class="chip" href="${esc(f(q))}" target="_blank" rel="noopener">↗ ${esc(n)}</a>`).join('')}</div>`;
const tdFold = x => String(x).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd');
// chỉ mục phụ: dạng bất quy tắc, họ từ, cụm từ (cụm hay dùng, thành ngữ) → từ gốc
let TD_IX = null;
function tdIndex() { if (TD_IX && TD_IX.n === WORDS.length) return TD_IX; const form = new Map(), phrase = [], head = new Set(WORDS.map(w => w.w.toLowerCase()));
  const put = (k, w) => { k = String(k || '').toLowerCase().trim(); if (k && !form.has(k)) form.set(k, w); };
  for (const w of WORDS) { if (w.irr) for (const [, fs] of w.irr.f) for (const f of fs) put(f, w);
    for (const f of w.fam || []) if (!head.has(String(f).toLowerCase())) put(f, w);
    if (w.col && w.col.ok) phrase.push([tdFold(w.col.ok), w]); if (w.idi && w.idi.p) phrase.push([tdFold(w.idi.p), w]); if (w.pat && w.pat.m) phrase.push([tdFold(w.pat.m), w]); }
  return (TD_IX = { n: WORDS.length, form, phrase }); }
// dạng của động từ rất hay gặp (dữ liệu bất quy tắc của app không có be / have / do)
const TD_BASE = { am: 'be', is: 'be', are: 'be', was: 'be', were: 'be', been: 'be', being: 'be', has: 'have', had: 'have', having: 'have', does: 'do', did: 'do', done: 'do', doing: 'do', "isn't": 'be', "aren't": 'be', "wasn't": 'be', "weren't": 'be', "hasn't": 'have', "haven't": 'have', "doesn't": 'do', "didn't": 'do' };
// gõ sai đúng 1 chữ (thêm / bớt / đổi)
function td1(a, b) { if (a === b) return true; const m = a.length, n = b.length; if (Math.abs(m - n) > 1) return false; let i = 0, j = 0, e = 0;
  while (i < m && j < n) { if (a[i] === b[j]) { i++; j++; continue; } if (++e > 1) return false; if (m > n) i++; else if (n > m) j++; else { i++; j++; } } return e + (m - i) + (n - j) <= 1; }
// từ thêm vào kết quả ngoài phép khớp chuỗi cũ: { ids: Set, how: Map(id → lý do), exact: id }
function tdMatch(q) { const out = { ids: new Set(), how: new Map(), exact: null }, raw = String(q || '').toLowerCase().trim(); if (!raw) return out;
  const X = tdIndex(), add = (w, why) => { if (!w || out.ids.has(w.id)) return; out.ids.add(w.id); if (why) out.how.set(w.id, why); };
  const ex = WORDS.find(w => w.w.toLowerCase() === raw); if (ex) out.exact = ex.id;
  const heads = new Map(WORDS.map(w => [w.w.toLowerCase(), w])), stem = [raw.replace(/([bdgmnpt])\1(er|est|ed|ing)$/, '$1'), raw.replace(/ied$/, 'y'), raw.replace(/ier$/, 'y'), raw.replace(/iest$/, 'y'), raw.replace(/r$/, ''), raw.replace(/st$/, ''), raw.replace(/d$/, ''), raw.replace(/ers?$/, ''), raw.replace(/ings?$/, ''), raw.replace(/ly$/, ''), raw.replace(/ily$/, 'y'), raw.replace(/ly$/, 'le'), raw.replace(/s$/, '').replace(/([bdgmnpt])\1ers?$/, '$1'), raw.replace(/s$/, '').replace(/ers?$/, '')].find(x => x !== raw && x.length >= 2 && heads.has(x));
  const base = TD_BASE[raw] || stem || null, bw = base && heads.get(base);   // went → go: libFind; hotter → hot, tried → try, larger → large, simply → simple (le → ly: libFind)
  if (!ex && bw) { add(bw, `“${raw}” là dạng của “${bw.w}”`); out.exact = out.exact || bw.id; }
  if (!ex && raw.includes('-')) for (const part of raw.split('-')) { const pw = WORDS.find(w => w.w.toLowerCase() === part) || (typeof libFind === 'function' && part.length >= 3 ? libFind(part) : null); if (pw && WBY[pw.id]) add(pw, `phần “${part}” của từ ghép “${raw}”`); }
  const f = X.form.get(raw); if (f) { add(f, `“${raw}” là một dạng của “${f.w}”`); out.exact = out.exact || f.id; }
  if (!ex && typeof libFind === 'function') { const w = libFind(raw); if (w && WBY[w.id] && w.w.toLowerCase() !== raw) { add(w, `“${raw}” là dạng biến đổi của “${w.w}”`); out.exact = out.exact || w.id; } }
  const fq = tdFold(raw); if (fq.length >= 4) for (const [p, w] of X.phrase) if (p.includes(fq)) add(w, 'có trong cụm từ / thành ngữ');
  if (raw.length >= 4 && !ex && !f) for (const w of WORDS) { const k = w.w.toLowerCase(); if (Math.abs(k.length - raw.length) <= 1 && td1(k, raw)) add(w, `gần giống “${raw}” (gõ sai?)`); }
  return out; }
// thứ tự khi đang tìm: khớp đúng → bắt đầu bằng → còn lại theo ABC
const tdRank = (w, q, M) => { const k = w.w.toLowerCase(); q = String(q || '').toLowerCase().trim(); return w.id === M.exact || k === q ? 0 : k.startsWith(q) ? 1 : 2; };

// ---------- ① một mục từ đầy đủ ----------
function tdEntry(w, M) { const why = M && M.how.get(w.id), chip = t => `<button class="chip" data-tdq="${esc(t)}">${esc(t)}</button>`, inSo = typeof vwSt === 'function' && vwSt().some(x => x.k === w.w.toLowerCase());
  const rows = [
    w.s2 && `<p style="margin:6px 0">🔀 <b>Nghĩa khác:</b> ${esc(w.s2.vi)}${w.s2.ex ? `<br><span>${esc(w.s2.ex)}</span><br><span class="mute">${esc(w.s2.exVi || '')}</span>` : ''}</p>`,
    w.irr && `<p style="margin:6px 0">🔁 <b>Dạng bất quy tắc:</b> ${w.irr.f.map(([n, fs]) => `${esc(n)}: <b>${fs.map(esc).join(' / ')}</b>`).join(' · ')}</p>`,
    w.pat && `<p style="margin:6px 0">🧩 <b>Mẫu:</b> ${esc(w.pat.m)} <span class="mute">· ${esc(w.pat.s.replace('___', w.pat.a))}</span></p>`,
    w.rel && (w.rel.syn || []).length && `<div style="margin:6px 0">🟰 <b>Gần nghĩa:</b> <span class="chips" style="display:inline">${w.rel.syn.map(chip).join('')}</span></div>`,
    w.rel && (w.rel.ant || []).length && `<div style="margin:6px 0">↔️ <b>Trái nghĩa:</b> <span class="chips" style="display:inline">${w.rel.ant.map(chip).join('')}</span></div>`,
    (w.fam || []).length && `<div style="margin:6px 0">👪 <b>Họ từ:</b> <span class="chips" style="display:inline">${w.fam.map(chip).join('')}</span></div>`,
    w.reg && `<p style="margin:6px 0">🎚 ${w.reg.f ? `<b>Trang trọng</b>; nói thường dùng: <b>${esc(w.reg.p)}</b>` : `<b>Thân mật</b>; viết trang trọng dùng: <b>${esc(w.reg.p)}</b>`}</p>`,
    w.idi && `<p style="margin:6px 0">💬 <b>Thành ngữ:</b> ${esc(w.idi.p)} = ${esc(w.idi.vi)}${w.idi.s ? `<br><span class="mute">${esc(w.idi.s)}</span>` : ''}</p>`].filter(Boolean).join('');
  return `<div class="box" style="margin:8px 0 0">${why ? `<p class="mute" style="margin:0 0 4px">🔎 ${esc(why)}</p>` : ''}<div class="mute">${esc(w.pos || '')} · ${w.u ? uLabel(UBY[w.u]) : `${LVN[w.lv] || ''} · chỉ tra`}</div>${w.en ? `<p class="mute" style="margin:4px 0">${esc(w.en)}</p>` : ''}
    <p style="margin:6px 0">${esc(w.ex || '')}<br><span class="mute">${esc(w.exVi || '')}</span></p>${w.col && w.col.ok ? `<p class="mute" style="margin:6px 0">Cụm hay dùng: <b>${esc(w.col.ok)}</b></p>` : ''}${rows}
    ${typeof sayBtns === 'function' ? sayBtns(w).replace('</div>', `<button class="chip" data-tdgb="${w.id}">🔊 Giọng Anh</button></div>`) : ''}
    <div class="chips" style="margin:6px 0 0">${inSo ? '<span class="chip on">📌 Đã có trong sổ từ</span>' : `<button class="chip" data-tdsave="${w.id}">📌 Lưu vào sổ từ</button>`}</div>${tdLinks(w.w)}</div>`; }
// 🔊 giọng Anh–Anh của máy (như giọng thi); máy không có giọng Anh thì dùng giọng sẵn có
async function tdSayGB(t) { const was = EXAM_VOX; EXAM_VOX = true; try { await speak(t); } finally { EXAM_VOX = was; } }

document.addEventListener('click', e => { if (S && e.target.closest('[data-sotu]')) { scrollTo(0, 0); vwRun(Date.now(), overview); } });   // ô 📅 Hôm nay

// ---------- ③ không có trong từ điển app ----------
const tdNone = q => `<div class="box"><b>“${esc(q)}” chưa có trong từ điển của app</b><p class="mute" style="margin:6px 0">Từ điển app có ${WORDS.length.toLocaleString('vi-VN')} từ của khoá học. Tra ở từ điển chính thức:</p>${tdLinks(q)}
  <details style="margin-top:8px"><summary>📌 Lưu “${esc(q)}” vào sổ từ (tự ghi nghĩa)</summary><input id="tdvi" placeholder="nghĩa tiếng Việt (tra ở trên rồi ghi)"><input id="tdex" placeholder="câu bạn gặp từ này (tuỳ chọn)"><button class="pri" data-tdnew="${esc(q)}">📌 Lưu</button></details></div>`;

// ---------- ④ 📌 sổ từ + 🕘 tra gần đây ----------
const tdHist = () => (S.dh = S.dh || []);
function tdSeen(w) { const H = tdHist(), i = H.indexOf(w.id); if (i >= 0) H.splice(i, 1); H.unshift(w.id); H.length = Math.min(H.length, 20);
  if (S.cards[w.id] && typeof mfLookup === 'function') mfLookup(w); else { S.t = Date.now(); save(); } }   // từ đã học: tra = chưa nhớ (ôn lại sớm)
function tdTop() { const n = typeof vwSt === 'function' ? vwSt().length : 0, d = typeof vwDue === 'function' ? vwDue().length : 0, H = tdHist().map(id => WBY[id]).filter(Boolean).slice(0, 10);
  return `<div class="row" style="gap:6px;margin:6px 0">${n ? `<button class="${d ? 'pri' : ''}" data-tdrun style="margin:0">📌 Sổ từ: ${n} từ${d ? ` · ôn ${d} từ đến hạn` : ''}</button>` : '<span class="mute">📌 Chưa có từ trong sổ: mở một từ rồi bấm "Lưu vào sổ từ".</span>'}</div>
    ${H.length && !DICT.q ? `<div class="chips"><span class="mute" style="font-size:14px">🕘 Tra gần đây:</span>${H.map(w => `<button class="chip" data-tdq="${esc(w.w)}">${esc(w.w)}</button>`).join('')}</div>` : ''}`; }
function tdSave(w, vi, ex) { if (typeof vwPut !== 'function') return toast('Chưa tải được sổ từ.');
  const n = vwPut([{ w: w.w || w, vi: vi != null ? vi : w.vi || '', ex: ex != null ? ex : w.ex || '', app: null }], '📖 Từ điển'); toast(n ? '📌 Đã lưu vào sổ từ. Ôn lần đầu ngay hôm nay.' : 'Từ này đã có trong sổ.'); }
document.addEventListener('click', e => { if (!S || !document.getElementById('dq')) return; const g = s => e.target.closest(s); let b;
  if (g('#dl a[href]')) { e.stopPropagation(); return; }   // mở từ điển ngoài: không gập mục từ
  if ((b = g('[data-tdq]'))) { e.stopPropagation(); DICT.q = b.dataset.tdq; DICT.open = null; const q = document.getElementById('dq'); q.value = DICT.q; dictList(); scrollTo(0, 0); return; }
  if ((b = g('[data-tdgb]'))) { e.stopPropagation(); const w = WBY[b.dataset.tdgb]; if (w) tdSayGB(w.w); return; }
  if ((b = g('[data-tdsave]'))) { e.stopPropagation(); const w = WBY[b.dataset.tdsave]; if (w) { tdSave(w); dictList(); } return; }
  if ((b = g('[data-tdnew]'))) { e.stopPropagation(); tdSave(b.dataset.tdnew, document.getElementById('tdvi').value.trim(), document.getElementById('tdex').value.trim()); dictList(); return; }
  if (g('[data-tdrun]')) { e.stopPropagation(); scrollTo(0, 0); return vwRun(Date.now(), dict); } }, true);
