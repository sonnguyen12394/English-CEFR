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
// v93 mục từ 3 tầng theo nhu cầu người học (giáo viên tiếng Anh, 31/10/2026): ① Hiểu (luôn hiện: nghĩa, phát âm, ví dụ, dạng bất quy tắc, 📌);
// ② Dùng thế nào (khi viết / nói: cụm hay dùng, mẫu, ngữ pháp liên quan, văn phong, từ dễ nhầm, lỗi hay gặp; mở sẵn từ cấp B1, dưới B1 gập);
// ③ Mở rộng (gập: nghĩa khác, đồng / trái nghĩa, họ từ, thành ngữ, gặp trong bài, từ điển ngoài).
function tdEntry(w, M) { const why = M && M.how.get(w.id), chip = t => `<button class="chip" data-tdq="${esc(t)}">${esc(t)}</button>`, inSo = typeof vwSt === 'function' && vwSt().some(x => x.k === w.w.toLowerCase());
  const lvOk = typeof curLevel === 'function' && LEVELS.indexOf(curLevel()) >= LEVELS.indexOf('b1'), k = w.w.toLowerCase();
  const loi = typeof TC !== 'undefined' && TC ? (TC.loi || []).filter(x => new RegExp(`(^|\\s)${k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(\\s|$)`, 'i').test(x.k)).slice(0, 2) : [];
  const pb = typeof TC !== 'undefined' && TC ? (TC.pb || []).filter(g => g.w.includes(k)) : [];
  const use = [
    w.col && w.col.ok && `<p style="margin:6px 0">🔗 <b>Cụm hay dùng:</b> ${esc(w.col.ok)}${(w.col.bad || []).length ? ` <span class="mute">(không nói: ${w.col.bad.map(esc).join(', ')})</span>` : ''}</p>`,
    w.pat && `<p style="margin:6px 0">🧩 <b>Mẫu:</b> ${esc(w.pat.m)} <span class="mute">· ${esc(w.pat.s.replace('___', w.pat.a))}</span></p>`,
    typeof tcGramFor === 'function' && tcGramFor(w),
    w.reg && `<p style="margin:6px 0">🎚 ${w.reg.f ? `<b>Trang trọng</b>; nói thường dùng: <b>${esc(w.reg.p)}</b>` : `<b>Thân mật</b>; viết trang trọng dùng: <b>${esc(w.reg.p)}</b>`}</p>`,
    ...pb.map(g => `<div style="margin:6px 0">⚖️ <b>Dễ nhầm: ${g.w.map(esc).join(' / ')}</b> <span class="mute">(“${esc(g.vi)}”)</span>${g.note.map(n => `<p style="margin:2px 0;font-size:15px">• ${esc(n)}</p>`).join('')}</div>`),
    ...loi.map(x => `<p style="margin:6px 0">❗ <s>${esc(x.wrong)}</s> → <b>${esc(x.right)}</b><br><span class="mute">${esc(x.why)}</span></p>`)].filter(Boolean).join('');
  const more = [
    w.s2 && `<p style="margin:6px 0">🔀 <b>Nghĩa khác:</b> ${esc(w.s2.vi)}${w.s2.ex ? `<br><span>${esc(w.s2.ex)}</span><br><span class="mute">${esc(w.s2.exVi || '')}</span>` : ''}</p>`,
    w.rel && (w.rel.syn || []).length && `<div style="margin:6px 0">🟰 <b>Gần nghĩa:</b> <span class="chips" style="display:inline">${w.rel.syn.map(chip).join('')}</span></div>`,
    w.rel && (w.rel.ant || []).length && `<div style="margin:6px 0">↔️ <b>Trái nghĩa:</b> <span class="chips" style="display:inline">${w.rel.ant.map(chip).join('')}</span></div>`,
    (w.fam || []).length && `<div style="margin:6px 0">👪 <b>Họ từ:</b> <span class="chips" style="display:inline">${w.fam.map(chip).join('')}</span></div>`,
    w.idi && `<p style="margin:6px 0">💬 <b>Thành ngữ:</b> ${esc(w.idi.p)} = ${esc(w.idi.vi)}${w.idi.s ? `<br><span class="mute">${esc(w.idi.s)}</span>` : ''}</p>`,
    tdInText(w)].filter(Boolean).join('');
  return `<div class="box" style="margin:8px 0 0">${why ? `<p class="mute" style="margin:0 0 4px">🔎 ${esc(why)}</p>` : ''}<div class="mute">${esc(w.pos || '')} · ${w.u ? uLabel(UBY[w.u]) : `${LVN[w.lv] || ''} · chỉ tra`}</div>${w.en ? `<p class="mute" style="margin:4px 0">${esc(w.en)}</p>` : ''}
    <p style="margin:6px 0">${esc(w.ex || '')}<br><span class="mute">${esc(w.exVi || '')}</span></p>
    ${w.irr ? `<p style="margin:6px 0">🔁 <b>Dạng bất quy tắc:</b> ${w.irr.f.map(([n, fs]) => `${esc(n)}: <b>${fs.map(esc).join(' / ')}</b>`).join(' · ')}</p>` : ''}
    ${typeof sayBtns === 'function' ? sayBtns(w).replace('</div>', `<button class="chip" data-tdgb="${w.id}">🔊 Giọng Anh</button></div>`) : ''}
    <div class="chips" style="margin:6px 0 0">${inSo ? '<span class="chip on">📌 Đã có trong sổ từ</span>' : `<button class="chip" data-tdsave="${w.id}">📌 Lưu vào sổ từ</button>`}</div>
    ${use ? `<details class="tdt" ${lvOk || pb.length || loi.length ? 'open' : ''} style="margin:8px 0 0"><summary><b>✍️ Dùng thế nào</b> <span class="mute">(khi viết / nói)</span></summary>${use}</details>` : ''}
    <details class="tdt" style="margin:8px 0 0"><summary><b>🔍 Mở rộng</b> <span class="mute">(nghĩa khác, họ từ, gặp trong bài…)</span></summary>${more}${tdLinks(w.w)}</details></div>`; }
// 🔊 giọng Anh–Anh của máy (như giọng thi); máy không có giọng Anh thì dùng giọng sẵn có
async function tdSayGB(t) { const was = EXAM_VOX; EXAM_VOX = true; try { await speak(t); } finally { EXAM_VOX = was; } }

document.addEventListener('click', e => { if (S && e.target.closest('[data-sotu]')) { scrollTo(0, 0); vwRun(Date.now(), overview); } });   // ô 📅 Hôm nay

// ---------- ③ không có trong từ điển app ----------
const tdNone = q => `<div class="box tdnone"><b>“${esc(q)}” chưa có trong từ điển của app</b><p class="mute" style="margin:6px 0">Từ điển app có ${WORDS.length.toLocaleString('vi-VN')} từ của khoá học. Tra ở từ điển chính thức:</p>${tdLinks(q)}
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
  if (g('#dl a[href]')) { e.stopPropagation(); if (g('#dl .tdnone')) tdMiss(DICT.q, 'tra'); return; }   // mở từ điển ngoài: không gập mục từ; từ app chưa có → ghi td_miss
  if ((b = g('[data-tdq]'))) { e.stopPropagation(); DICT.q = b.dataset.tdq; DICT.open = null; const q = document.getElementById('dq'); q.value = DICT.q; dictList(); scrollTo(0, 0); return; }
  if ((b = g('[data-tdgb]'))) { e.stopPropagation(); const w = WBY[b.dataset.tdgb]; if (w) tdSayGB(w.w); return; }
  if ((b = g('[data-tdsave]'))) { e.stopPropagation(); const w = WBY[b.dataset.tdsave]; if (w) { tdSave(w); dictList(); } return; }
  if ((b = g('[data-tdnew]'))) { e.stopPropagation(); tdMiss(b.dataset.tdnew, 'luu'); tdSave(b.dataset.tdnew, document.getElementById('tdvi').value.trim(), document.getElementById('tdex').value.trim()); dictList(); return; }
  if (g('[data-tdrun]')) { e.stopPropagation(); scrollTo(0, 0); return sotuView(dict); } }, true);

// ---------- v89 ② "Gặp trong bài": câu thật trong kho bài của app có chứa từ (Đọc, Nghe, bài đọc / nghe IELTS, TOEIC) ----------
let TD_SENT = null;
function tdSents() { const ok = KIT.doc.items && KIT.nghe.items; if (TD_SENT && TD_SENT.ok === ok) return TD_SENT.a; const a = [], put = (t, src) => { for (const x of kSents(String(t || ''))) if (x.length >= 20 && x.length <= 220) a.push([x, src]); };
  for (const x of KIT.doc.items || []) put(x.text, '📰 ' + x.title); for (const x of KIT.nghe.items || []) x.lines ? x.lines.forEach(l => put(l[1], '🎧 ' + (x.tvi || x.title))) : put(x.text, '🎧 ' + (x.tvi || x.title));
  if (typeof IE !== 'undefined' && IE) { for (const x of IE.doc || []) x.paras.forEach(p => put(p, '🌏 ' + x.title)); for (const x of IE.ln || []) x.lines ? x.lines.forEach(l => put(l[1], '🌏 ' + x.title)) : put(x.text, '🌏 ' + x.title); }
  if (typeof TO !== 'undefined' && TO) for (const x of [...(TO.p6 || []), ...(TO.p7 || [])]) for (const d of x.docs || [{ text: x.text }]) put(d.text, '💼 TOEIC');
  if (typeof UOE !== 'undefined' && UOE) for (const k of ['long', 'mc', 'open', 'wf']) for (const x of UOE[k] || []) put(String(x.text || '').replace(/\s*\{\d+\}\s*/g, ' … '), '🧩 ' + x.title);
  if (typeof LIBC !== 'undefined') for (const B of Object.values(LIBC)) for (const pg of B.pages || []) for (const p of pg) put(p, '📚 ' + B.title);
  for (const w of WORDS) { put(w.ex, '📘 câu ví dụ của “' + w.w + '”'); if (w.s2 && w.s2.ex) put(w.s2.ex, '📘 câu ví dụ của “' + w.w + '”'); if (w.idi && w.idi.s) put(w.idi.s, '📘 thành ngữ “' + w.idi.p + '”'); }
  TD_SENT = { ok, a }; return a; }
function tdHits(w, n = 3) { const k = w.w.toLowerCase(); if (k.length < 2) return [];
  const forms = [k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), ...(w.irr ? w.irr.f.flatMap(([, fs]) => fs).map(f => f.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')) : [])];
  const re = new RegExp(`\\b(${forms.join('|')})(s|es|d|ed|ing)?\\b`, 'i'), out = [], seen = new Set();
  for (const [t, src] of tdSents()) { if (!re.test(t) || seen.has(t) || t === w.ex) continue; seen.add(t); out.push([t, src]); if (out.length >= n) break; } return out; }
const tdInText = w => { const h = tdHits(w); if (!h.length) return ''; const k = w.w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return `<details style="margin:6px 0"><summary>📚 Gặp trong bài (${h.length})</summary>${h.map(([t, src]) => `<p style="margin:4px 0">${esc(t).replace(new RegExp(`\\b(${k}\\w*)`, 'i'), '<b>$1</b>')}<br><span class="mute" style="font-size:13px">${esc(src)}</span></p>`).join('')}</details>`; };

// ---------- v89 ① chạm vào từ trong bài để tra (đoạn văn có lớp .tdtap): thẻ nhỏ nghĩa + 🔊 + 📌; không bật trong đề thi / đề thử / xếp cấp ----------
const TD_NOTAP = /thi|đề thử|de-thu|xep-cap|xếp cấp|kiem-tra|kiểm tra/i;
function tdWordAt(e) { let node, off; try { if (document.caretRangeFromPoint) { const r = document.caretRangeFromPoint(e.clientX, e.clientY); if (r) { node = r.startContainer; off = r.startOffset; } }
    else if (document.caretPositionFromPoint) { const p = document.caretPositionFromPoint(e.clientX, e.clientY); if (p) { node = p.offsetNode; off = p.offset; } } } catch (er) {}
  if (!node || node.nodeType !== 3) return null; const t = node.textContent, isW = c => /[A-Za-z'’-]/.test(c || ''); let a = off, b = off;
  while (a > 0 && isW(t[a - 1])) a--; while (b < t.length && isW(t[b])) b++; const word = t.slice(a, b).replace(/^['’-]+|['’-]+$/g, ''); if (!/^[A-Za-z][A-Za-z'’-]{1,}$/.test(word)) return null;
  const s = (node.parentElement && node.parentElement.closest('.tdtap') || node.parentElement).textContent, i = s.indexOf(word), st = Math.max(s.lastIndexOf('.', i), s.lastIndexOf('!', i), s.lastIndexOf('?', i)) + 1, en = s.slice(i).search(/[.!?]/);
  return { word, ctx: s.slice(st, en < 0 ? undefined : i + en + 1).trim().slice(0, 240) }; }
function tdFind(t) { const raw = t.toLowerCase().replace(/[’]/g, "'"), ex = WORDS.find(w => w.w.toLowerCase() === raw); if (ex) return ex; const m = tdMatch(raw); if (m.exact) return WBY[m.exact];
  const w = typeof libFind === 'function' ? libFind(raw) : null; return w && WBY[w.id] ? w : null; }
function tdPop(word, ctx) { let el = document.getElementById('tdpop'); if (!el) { el = document.createElement('div'); el.id = 'tdpop'; el.style.cssText = 'position:fixed;left:12px;right:12px;bottom:calc(84px + env(safe-area-inset-bottom));max-width:536px;margin:0 auto;z-index:40'; document.body.appendChild(el); }
  const w = tdFind(word), inSo = typeof vwSt === 'function' && vwSt().some(x => x.k === (w ? w.w : word).toLowerCase()); if (w && S.cards[w.id] && typeof mfLookup === 'function') mfLookup(w); if (!w) tdMiss(word, 'cham');
  TD_POP = { w, word, ctx };
  el.innerHTML = `<div class="box" style="box-shadow:0 4px 16px rgba(0,0,0,.25);margin:0"><div class="row"><b style="font-size:20px">${esc(w ? w.w : word)}</b><button class="link" data-tdp="x" style="width:auto">✕</button></div>
    ${w ? `<p style="margin:4px 0"><span class="lvtag ${lvw(w)}">${LVN[lvw(w)] || ''}</span> <span class="mute">${esc(w.ipa || '')} ${esc(w.pos || '')}</span><br>${esc(w.vi)}</p>${w.w.toLowerCase() !== word.toLowerCase() ? `<p class="mute" style="margin:0;font-size:13px">“${esc(word)}” là dạng của “${esc(w.w)}”</p>` : ''}`
      : '<p class="mute" style="margin:4px 0">Chưa có trong từ điển app: tra ở từ điển chính thức rồi lưu.</p>'}
    <div class="chips" style="margin-top:6px"><button class="chip" data-tdp="say">🔊 Nghe</button>${inSo ? '<span class="chip on">📌 Đã có trong sổ</span>' : '<button class="chip" data-tdp="save">📌 Lưu vào sổ từ</button>'}</div>${tdLinks(w ? w.w : word)}</div>`;
  el.hidden = false; }
let TD_POP = null;
document.addEventListener('click', e => { if (!S) return; const pop = document.getElementById('tdpop'), pb = e.target.closest('[data-tdp]');
  if (pb) { const a = pb.dataset.tdp, P = TD_POP || {}; if (a === 'x') pop.hidden = true; if (a === 'say') speak(P.w ? P.w.w : P.word);
    if (a === 'save') { const n = vwPut([{ w: P.w ? P.w.w : P.word, vi: P.w ? P.w.vi : '', ex: P.ctx || (P.w && P.w.ex) || '', app: null }], '👆 ' + ((window.CUR && window.CUR.view) || 'bài')); if (!P.w) tdMiss(P.word, 'luu'); toast(n ? '📌 Đã lưu vào sổ từ.' : 'Từ này đã có trong sổ.'); pop.hidden = true; } return; }
  if (pop && !pop.hidden && !e.target.closest('#tdpop')) pop.hidden = true;
  const box = e.target.closest('.tdtap'); if (!box || e.target.closest('button, a, input, select, textarea, summary, label') || TD_NOTAP.test((window.CUR && window.CUR.view) || '')) return;
  const hit = tdWordAt(e); if (hit) tdPop(hit.word, hit.ctx); });

// ---------- v89 ④ từ người học tra mà app chưa có: gom ẩn danh (bảng td_miss: chỉ từ, không gắn tài khoản) → biết nên thêm từ nào vào khoá ----------
function tdMiss(word, src) { const w = String(word || '').toLowerCase().replace(/[’]/g, "'").trim(); if (!/^[a-z][a-z'-]{2,29}$/.test(w) || !user) return;
  const k = 'tdm:' + dayOf(Date.now()) + ':' + w; try { if (localStorage.getItem(k)) return; localStorage.setItem(k, '1'); } catch (e) {}
  try { sb.from('td_miss').insert({ w, src, app_v: String(APP_V) }).then(() => {}, () => {}); } catch (e) {} }
async function tdMissView() { window.CUR = { view: 'tu-thieu' }; $app.innerHTML = '<p class="mute">Đang tải…</p>';
  const { data, error } = await sb.from('td_miss').select('w,src,at').order('at', { ascending: false }).limit(3000); const by = new Map();
  for (const r of data || []) { const o = by.get(r.w) || { w: r.w, n: 0, src: new Set(), at: r.at }; o.n++; o.src.add(r.src); by.set(r.w, o); }
  const top = [...by.values()].sort((a, b) => b.n - a.n).slice(0, 60);
  $app.innerHTML = `<div class="row top"><button class="link" data-a="bk">← Dữ liệu</button><span class="uname">📊 Từ app chưa có</span></div><h1>📊 Từ người học tra mà app chưa có</h1>
    <p class="mute">Gom ẩn danh từ mọi máy (chỉ từ, không gắn tài khoản), ${(data || []).length} lượt gần nhất. Từ hay tra là ứng viên thêm vào khoá học (cần giáo viên duyệt nghĩa, cấp).</p>
    ${error ? `<p>Chưa đọc được: ${esc(error.message)}</p>` : top.length ? `<div class="box">${top.map(o => `<div class="row" style="margin:4px 0"><span><b>${esc(o.w)}</b> <span class="mute">${[...o.src].map(x => ({ cham: '👆 chạm trong bài', tra: '📖 tìm', luu: '📌 lưu' }[x] || x)).join(' · ')}</span></span><span>${o.n}</span></div>`).join('')}</div>` : '<p class="mute">Chưa có lượt nào.</p>'}`;
  $app.onclick = e => { if (e.target.closest('[data-a="bk"]')) backup(); }; }

// ---------- v89 ③ 📌 quản lý sổ từ: tìm, sửa nghĩa, xoá, xuất CSV (Anki / Excel) ----------
let SOTU_Q = '';
function sotuView(back = dict) { window.CUR = { view: 'so-tu' }; const L = vwSt(), d = vwDue().length, q = SOTU_Q.toLowerCase(), rows = L.filter(x => !q || x.k.includes(q) || tdFold(x.vi).includes(tdFold(q))).sort((a, b) => b.at - a.at);
  const box = x => x.box >= VW_DAYS.length ? '✅ thuộc' : `hộp ${x.box + 1}/${VW_DAYS.length}${x.due <= Date.now() ? ' · đến hạn' : ' · ôn ' + new Date(x.due).toLocaleDateString('vi-VN')}`;
  $app.innerHTML = `<div class="row top"><button class="link" data-a="back">← Về</button><span class="uname">📌 Sổ từ</span></div><h1>📌 Sổ từ của tôi</h1>
    <p class="mute">${L.length} từ · thuộc ${L.filter(x => x.box >= VW_DAYS.length).length}. Gồm từ lưu ở 📖 Từ điển, chạm trong bài và 📥 đề thật.</p>
    ${d ? `<button class="pri" data-st="run">🔁 Ôn ${Math.min(20, d)} từ đến hạn</button>` : ''}
    <input id="stq" type="search" placeholder="Tìm trong sổ" value="${esc(SOTU_Q)}">
    ${rows.length ? rows.map(x => `<div class="box" style="margin:8px 0;padding:10px 12px"><div class="row"><b>${esc(x.w)}</b><span class="mute" style="font-size:13px">${box(x)}</span></div>
      <input data-stv="${x.id}" value="${esc(x.vi)}" placeholder="nghĩa tiếng Việt" style="margin:4px 0">${x.ex ? `<p class="mute" style="margin:2px 0;font-size:14px">${esc(x.ex)}</p>` : ''}
      <div class="row"><span class="mute" style="font-size:13px">${esc(x.src || '')}</span><button class="link" data-st="del|${x.id}" style="width:auto">🗑 Xoá</button></div></div>`).join('') : '<p class="mute">Chưa có từ nào.</p>'}
    ${L.length ? '<button data-st="csv">⬇️ Xuất CSV (mở bằng Anki, Excel, Google Sheets)</button>' : ''}`;
  $app.onclick = e => { const b = e.target.closest('[data-st]'); if (e.target.closest('[data-a="back"]')) return back(); if (!b) return; const [a, id] = b.dataset.st.split('|');
    if (a === 'run') { scrollTo(0, 0); return vwRun(Date.now(), () => sotuView(back)); }
    if (a === 'del') { const x = L.find(y => y.id === id); if (x && confirm(`Xoá “${x.w}” khỏi sổ từ?`)) { L.splice(L.indexOf(x), 1); S.t = Date.now(); save(); } return sotuView(back); }
    if (a === 'csv') return tdCsv(L); };
  $app.onchange = e => { const v = e.target.closest('[data-stv]'); if (v) { const x = L.find(y => y.id === v.dataset.stv); if (x) { x.vi = v.value.trim(); S.t = Date.now(); save(); toast('Đã lưu nghĩa.'); } } };
  const sq = document.getElementById('stq'); sq.oninput = () => { SOTU_Q = sq.value; const pos = sq.selectionStart; sotuView(back); const n = document.getElementById('stq'); n.focus(); try { n.setSelectionRange(pos, pos); } catch (er) {} }; }
// CSV: từ, nghĩa, câu ví dụ, nguồn; có BOM để Excel đọc đúng tiếng Việt; Anki nhập được (trường 1 = mặt trước, 2 = mặt sau)
function tdCsv(L) { const c = v => `"${String(v == null ? '' : v).replace(/"/g, '""')}"`, txt = '﻿' + [['word', 'meaning', 'example', 'source'], ...L.map(x => [x.w, x.vi, x.ex, x.src])].map(r => r.map(c).join(',')).join('\r\n');
  const d = new Date(), a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([txt], { type: 'text/csv;charset=utf-8' })); a.download = `so-tu-${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}.csv`;
  try { document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000); } catch (e) {} return txt; }
