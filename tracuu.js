// 📖 Tra cứu ngoài từ vựng (v90, 30/10/2026, người sáng lập: "nếu có từ điển từ vựng thì có thể bổ sung từ điển ở những mặt khác… làm hết đi").
// Một ô tìm của 📖 Từ điển, chọn loại: 📚 Từ · 🧱 Ngữ pháp · 🔗 Cụm từ · ❗ Lỗi hay gặp · 👄 Phát âm · ✍️ Cụm câu. Ở loại 📚 Từ, đang tìm thì hiện thêm
// "Cũng có" (ngữ pháp / lỗi / cụm câu khớp) để một lần gõ ra mọi mặt; mục từ có "🧱 Ngữ pháp liên quan".
//   🧱 106 điểm ngữ pháp (np.json, có sẵn) · 🔗 cụm động từ, thành ngữ, cụm hay dùng, mẫu câu, trang trọng / thân mật (dữ liệu từ có sẵn)
//   ❗ lỗi hay gặp, ✍️ cụm câu Viết / Nói, 👄 bảng 44 âm (tracuu.json, Claude soạn, chưa giáo viên kiểm) + 26 cặp âm dễ nhầm (pa.json).
// Chỉ để tra: không tính vào luật đo.
let TC = null;
const tcLoad = async () => TC || (TC = await (await fetch('tracuu.json?v=' + APP_V)).json());
const TC_KIND = [['tu', '📚 Từ'], ['np', '🧱 Ngữ pháp'], ['cum', '🔗 Cụm từ'], ['loi', '❗ Lỗi hay gặp'], ['pa', '👄 Phát âm'], ['cau', '✍️ Cụm câu']];
const TC_SUB = [['pv', 'Cụm động từ'], ['idi', 'Thành ngữ'], ['col', 'Cụm hay dùng'], ['pat', 'Mẫu câu'], ['reg', 'Trang trọng / thân mật']];
const TC_PV = /^[a-z]+ (up|down|out|off|on|in|over|away|back|through|into|after|for|with|about|around|along|across|ahead|apart|by|forward)( [a-z]+)?$/;
const tcF = x => typeof tdFold === 'function' ? tdFold(x) : String(x).toLowerCase();
const tcHas = (q, ...xs) => { const f = tcF(q); return xs.some(x => tcF(Array.isArray(x) ? x.flat(2).join(' ') : x || '').includes(f)); };
const tcSay = t => `<button class="chip" data-tcsay="${esc(t)}" style="margin:0 4px 0 0">🔊</button>`;
const tcAi = '<p class="mute" style="margin:6px 0">🤖 Phần này Claude soạn, chưa giáo viên kiểm. Thấy sai: bấm 💬 → ⚑ Câu sai.</p>';

// ---------- 🧱 ngữ pháp ----------
const tcNp = () => (KIT.np && KIT.np.items) || [];
// tên gọi khác khi tìm (thuật ngữ Anh / Việt không có trong tên bài) và từ → bài ngữ pháp liên quan
const TC_ALIAS = { gerund: 'V-ing', 'danh động từ': 'V-ing', infinitive: 'to V', 'nguyên mẫu': 'to V', 'present simple': 'hiện tại đơn', 'past simple': 'quá khứ đơn', 'present continuous': 'hiện tại tiếp diễn',
  'future': 'will', 'tương lai': 'will', 'article': 'mạo từ', 'comparative': 'so sánh', 'superlative': 'so sánh nhất', 'preposition': 'giới từ', 'pronoun': 'đại từ', 'quantifier': 'some', 'countable': 'đếm được', 'phrasal verb': 'cụm động từ', 'inversion': 'đảo ngữ', 'wish': 'wish', 'tường thuật': 'tường thuật' };
const TC_WGRAM = { if: 'câu điều kiện', since: 'hiện tại hoàn thành', for: 'hiện tại hoàn thành', ever: 'hiện tại hoàn thành', yet: 'hiện tại hoàn thành', already: 'hiện tại hoàn thành', just: 'hiện tại hoàn thành', ago: 'quá khứ đơn', unless: 'điều kiện', despite: 'although', whose: 'mệnh đề quan hệ', whom: 'mệnh đề quan hệ' };
function tcNpHits(q, n = 99) { if (!q) return tcNp().slice(0, n); const al = TC_ALIAS[String(q).toLowerCase().trim()], qs = al ? [q, al] : [q];
  const a = tcNp().filter(x => qs.some(t => tcHas(t, x.title, x.en))), b = tcNp().filter(x => !a.includes(x) && qs.some(t => tcHas(t, x.form, x.use, x.note, x.ex))); return [...a, ...b].slice(0, n); }
const tcNpRow = (x, open) => `<div class="drow" data-tcnp="${x.id}"><b>${esc(x.title)}</b> <span class="lvtag ${x.lv}">${LVN[x.lv] || ''}</span><br><span class="mute">${esc(x.en || '')}</span>
  ${open ? `<div class="box" style="margin:8px 0 0">${(x.form || []).length ? `<p style="margin:4px 0"><b>Công thức</b></p>${x.form.map(f => `<p style="margin:2px 0">• ${esc(f)}</p>`).join('')}` : ''}
    ${(x.use || []).length ? `<p style="margin:8px 0 4px"><b>Cách dùng</b></p>${x.use.map(f => `<p style="margin:2px 0">• ${esc(f)}</p>`).join('')}` : ''}${x.note ? `<p style="margin:8px 0">⚠️ ${esc(x.note)}</p>` : ''}
    ${(x.ex || []).slice(0, 4).map(([en, vi]) => `<p style="margin:4px 0">${tcSay(en)}${esc(en)}<br><span class="mute">${esc(vi || '')}</span></p>`).join('')}
    <button class="pri" data-tcnpl="${x.id}">📘 Học / luyện bài này</button></div>` : ''}</div>`;
// điểm ngữ pháp có nhắc tới từ (tên bài, tên tiếng Anh, công thức): since → hiện tại hoàn thành
function tcGramFor(w) { const k = w.w.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); if (k.length < 2) return '';
  const re = new RegExp(`(^|[^a-z])${k}([^a-z]|$)`, 'i'), al = TC_WGRAM[w.w.toLowerCase()], hs = [...new Set([...(al ? tcNpHits(al, 3) : []), ...tcNp().filter(x => re.test([x.title, x.en].join(' ')))])].slice(0, 4);   // chỉ tên bài: "the" không khớp mọi công thức
  return hs.length ? `<div style="margin:6px 0">🧱 <b>Ngữ pháp liên quan:</b> <span class="chips" style="display:inline">${hs.map(x => `<button class="chip" data-tcgo="np|${x.id}">${esc(x.title)}</button>`).join('')}</span></div>` : ''; }

// ---------- 🔗 cụm từ (từ dữ liệu của từ) ----------
function tcCum(sub, q) { const out = [];
  for (const w of WORDS) {
    if (sub === 'pv' && TC_PV.test(w.w)) out.push([w.w, w.vi, w.ex, w]);
    if (sub === 'idi' && w.idi) out.push([w.idi.p, w.idi.vi, w.idi.s, w]);
    if (sub === 'col' && w.col && w.col.ok) out.push([w.col.ok, w.vi, w.ex, w]);
    if (sub === 'pat' && w.pat) out.push([w.pat.m, w.vi, w.pat.s.replace('___', w.pat.a), w]);
    if (sub === 'reg' && w.reg) out.push([w.reg.f ? `${w.w} (trang trọng) ↔ ${w.reg.p}` : `${w.w} (thân mật) ↔ ${w.reg.p} (trang trọng)`, w.reg.vi || w.vi, w.ex, w]); }
  return (q ? out.filter(r => tcHas(q, r[0], r[1], r[2])) : out).sort((a, b) => a[0].localeCompare(b[0])); }

// ---------- ❗ lỗi hay gặp ----------
const tcLoiHits = q => (TC && TC.loi || []).filter(x => !q || tcHas(q, x.wrong, x.right, x.why, x.k));
const tcLoiRow = x => `<div class="box" style="margin:8px 0"><p style="margin:0">❌ <s>${esc(x.wrong)}</s></p><p style="margin:4px 0">✅ ${tcSay(x.right.split(' / ')[0])}<b>${esc(x.right)}</b></p><p class="mute" style="margin:0">${esc(x.why)} <span class="lvtag ${x.lv}">${LVN[x.lv] || ''}</span></p></div>`;

// ---------- 👄 phát âm: 44 âm + cặp âm dễ nhầm ----------
// từ ví dụ có âm s: bỏ trước các âm dài hơn chứa s (eɪ chứa e, tʃ chứa t…) để /e/ không khớp nhầm /eɪ/
function tcIpaWords(s, n = 8) { const longer = (TC && TC.ipa || []).map(p => p.s).filter(x => x !== s && x.includes(s)).sort((a, b) => b.length - a.length), out = [];
  for (const w of WORDS) { let t = String(w.ipa || ''); if (!t || w.w.includes(' ')) continue; for (const l of longer) t = t.split(l).join('·'); if (t.includes(s)) out.push(w); if (out.length >= n) break; } return out; }
function tcPa(q) { const ipa = (TC && TC.ipa || []), sets = typeof PA !== 'undefined' && PA || [], f = String(q || '').toLowerCase().trim(), w = f && WORDS.find(x => x.w.toLowerCase() === f);
  const head = w ? `<div class="box"><b>${esc(w.w)}</b> <span style="font-size:20px">${esc(w.ipa || '')}</span> ${tcSay(w.w)}<p class="mute" style="margin:4px 0">Các âm trong từ: ${ipa.filter(p => String(w.ipa).includes(p.s)).map(p => `<button class="chip" data-tcipa="${esc(p.s)}">/${esc(p.s)}/</button>`).join('')}</p></div>` : '';
  const ps = f && !w ? ipa.filter(p => p.s === f.replace(/\//g, '') || p.ex === f) : ipa, ss = f && !w ? sets.filter(x => tcHas(f, x.title, x.vi, x.a, x.b, x.pairs)) : sets;
  return `${head}<div class="box"><b>🔤 Bảng âm tiếng Anh</b> <span class="mute">(chạm để xem từ ví dụ)</span>${['nguyên âm ngắn', 'nguyên âm dài', 'nguyên âm đôi', 'phụ âm'].map(k => { const g = ps.filter(p => p.k.startsWith(k)); return g.length ? `<p style="margin:8px 0 2px" class="mute">${k}</p><div class="chips">${g.map(p => `<button class="chip ${TC_IPA === p.s ? 'on' : ''}" data-tcipa="${esc(p.s)}">/${esc(p.s)}/ ${esc(p.ex)}</button>`).join('')}</div>` : ''; }).join('')}
    ${TC_IPA ? `<div class="box" style="margin:8px 0 0"><b>/${esc(TC_IPA)}/</b> ${tcSay((ipa.find(p => p.s === TC_IPA) || {}).ex || '')}<p style="margin:4px 0">${tcIpaWords(TC_IPA).map(x => `<button class="chip" data-tcsay="${esc(x.w)}">${esc(x.w)} <span class="mute">${esc(x.ipa)}</span></button>`).join('')}</p></div>` : ''}</div>
    ${ss.length ? `<div class="box"><b>👂 Cặp âm người Việt hay nhầm</b>${ss.map(x => `<div style="margin:10px 0 0;border-top:1px solid var(--line);padding-top:8px"><b>${esc(x.a)} – ${esc(x.b)}</b> <span class="mute">${esc(x.title)} · ${esc(x.vi)}</span><p class="mute" style="margin:4px 0">${esc(x.tip)}</p>
      <div class="chips">${x.pairs.slice(0, 4).map(([a, ia, b, ib]) => `<button class="chip" data-tcsay="${esc(a)}">${esc(a)} /${esc(ia)}/</button><button class="chip" data-tcsay="${esc(b)}">${esc(b)} /${esc(ib)}/</button>`).join('')}</div></div>`).join('')}<button data-tcpa>👄 Luyện phân biệt âm</button></div>` : ''}`; }
let TC_IPA = null;

// ---------- ✍️ cụm câu Viết / Nói ----------
function tcCau(q) { const S0 = (TC && TC.cum || []).map(s => ({ t: s.t, items: s.items.filter(x => !q || tcHas(q, x.en, x.vi, x.ex, s.t)) })).filter(s => s.items.length);
  return S0.length ? S0.map(s => `<details class="box" ${q || S0.length === 1 ? 'open' : ''}><summary><b>${esc(s.t)}</b> <span class="mute">(${s.items.length})</span></summary>${s.items.map(x => `<div style="margin:8px 0;border-top:1px solid var(--line);padding-top:6px"><b>${esc(x.en)}</b><br><span class="mute">${esc(x.vi)}</span>
    <p style="margin:4px 0">${tcSay(x.ex)}${esc(x.ex)}</p><button class="chip" data-tcsave="${esc(x.en)}|${esc(x.vi)}|${esc(x.ex)}">📌 Lưu vào sổ từ</button></div>`).join('')}</details>`).join('') : '<p class="mute">Không có cụm câu khớp.</p>'; }

// ---------- vẽ theo loại (gọi từ dictList) ----------
const tcKind = () => DICT.kind || 'tu';
const tcChips = () => `<div class="chips" style="margin:6px 0">${TC_KIND.map(([k, n]) => `<button class="chip ${tcKind() === k ? 'on' : ''}" data-tck="${k}">${n}</button>`).join('')}</div>`;
// "Cũng có": ở loại 📚 Từ, đang tìm → ngữ pháp / lỗi / cụm câu khớp (gõ một lần, ra mọi mặt)
function tcAlso(q) { if (!q || q.trim().length < 3 || !TC) return ''; const np = tcNpHits(q, 3), lo = tcLoiHits(q).slice(0, 2), cau = (TC.cum || []).flatMap(s => s.items).filter(x => tcHas(q, x.en, x.vi)).slice(0, 2);
  if (!np.length && !lo.length && !cau.length) return '';
  return `<div class="box" style="margin:6px 0"><b>Cũng có</b>${np.map(x => `<p style="margin:4px 0">🧱 <button class="link" data-tcgo="np|${x.id}" style="width:auto;display:inline">${esc(x.title)}</button></p>`).join('')}
    ${lo.map(x => `<p style="margin:4px 0">❗ <button class="link" data-tcgo="loi|${esc(DICT.q)}" style="width:auto;display:inline">${esc(x.wrong)} → ${esc(x.right)}</button></p>`).join('')}
    ${cau.map(x => `<p style="margin:4px 0">✍️ <button class="link" data-tcgo="cau|${esc(DICT.q)}" style="width:auto;display:inline">${esc(x.en)}</button></p>`).join('')}</div>`; }
function tcList() { const k = tcKind(), q = (DICT.q || '').trim(), df = document.getElementById('df'), dl = document.getElementById('dl');
  if (!TC) { tcLoad().then(() => { if (document.getElementById('dq')) dictList(); }).catch(() => {}); }
  if (k === 'np' && !tcNp().length) kLoad(KIT.np).then(() => { if (document.getElementById('dq')) dictList(); }).catch(() => {});
  if (k === 'pa' && typeof PA !== 'undefined' && !PA) paLoad().then(() => { if (document.getElementById('dq')) dictList(); }).catch(() => {});
  df.innerHTML = tcChips() + (k === 'cum' ? `<div class="chips">${TC_SUB.map(([s, n]) => `<button class="chip ${(DICT.sub || 'pv') === s ? 'on' : ''}" data-tcs="${s}">${n}</button>`).join('')}</div>` : '');
  if (k === 'np') { const hs = tcNpHits(q); dl.innerHTML = hs.length ? hs.map(x => tcNpRow(x, DICT.open === x.id)).join('') : `<p class="mute">Không có điểm ngữ pháp khớp “${esc(q)}”. Thử tên tiếng Việt (hiện tại hoàn thành) hoặc tiếng Anh (present perfect).</p>`; return; }
  if (k === 'cum') { const rs = tcCum(DICT.sub || 'pv', q); dl.innerHTML = rs.length ? `<p class="mute">${rs.length} mục${rs.length > DICT_MAX ? `, hiện ${DICT_MAX}` : ''}. Chạm để mở từ.</p>` + rs.slice(0, DICT_MAX).map(([p, vi, ex, w]) => `<div class="drow" data-tcgo="tu|${esc(w.w)}"><b>${esc(p)}</b><br>${esc(vi || '')}${ex ? `<br><span class="mute">${esc(ex)}</span>` : ''}</div>`).join('') : '<p class="mute">Không có mục khớp.</p>'; return; }
  if (k === 'loi') { const rs = tcLoiHits(q); dl.innerHTML = tcAi + (rs.length ? rs.map(tcLoiRow).join('') : '<p class="mute">Không có lỗi khớp.</p>'); return; }
  if (k === 'pa') { dl.innerHTML = tcPa(q); return; }
  if (k === 'cau') { dl.innerHTML = tcAi + tcCau(q); return; } }
document.addEventListener('click', e => { if (!S || !document.getElementById('dq')) return; const g = s => e.target.closest(s); let b;
  const stop = () => e.stopPropagation(), re = () => { dictList(); };
  if ((b = g('[data-tck]'))) { stop(); DICT.kind = b.dataset.tck; DICT.open = null; return re(); }
  if ((b = g('[data-tcs]'))) { stop(); DICT.sub = b.dataset.tcs; return re(); }
  if ((b = g('[data-tcsay]'))) { stop(); return speak(b.dataset.tcsay); }
  if ((b = g('[data-tcipa]'))) { stop(); TC_IPA = TC_IPA === b.dataset.tcipa ? null : b.dataset.tcipa; DICT.kind = 'pa'; return re(); }
  if (g('[data-tcpa]')) { stop(); return paView(); }
  if ((b = g('[data-tcsave]'))) { stop(); const [w, vi, ex] = b.dataset.tcsave.split('|'); const n = typeof vwPut === 'function' ? vwPut([{ w, vi, ex, app: null }], '✍️ Cụm câu') : 0; return toast(n ? '📌 Đã lưu vào sổ từ.' : 'Cụm này đã có trong sổ.'); }
  if ((b = g('[data-tcnpl]'))) { stop(); const x = tcNp().find(y => y.id === b.dataset.tcnpl); if (x) { KIT.np.view = x.lv; scrollTo(0, 0); return kLearn(KIT.np, x); } return; }
  if ((b = g('[data-tcgo]'))) { stop(); const v = b.dataset.tcgo, i = v.indexOf('|'), k = v.slice(0, i), a = v.slice(i + 1);
    if (k === 'np') { DICT.kind = 'np'; DICT.q = ''; DICT.open = a; } else if (k === 'tu') { DICT.kind = 'tu'; DICT.q = a; const w = WORDS.find(x => x.w === a); DICT.open = w ? w.id : null; } else { DICT.kind = k; DICT.q = a; DICT.open = null; }
    const dq = document.getElementById('dq'); dq.value = DICT.q; re(); scrollTo(0, 0); return; }
  if ((b = g('[data-tcnp]')) && tcKind() === 'np') { stop(); DICT.open = DICT.open === b.dataset.tcnp ? null : b.dataset.tcnp; return re(); } }, true);
