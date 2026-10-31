// 📖 Tra cứu ngoài từ vựng (v90, 30/10/2026, người sáng lập: "nếu có từ điển từ vựng thì có thể bổ sung từ điển ở những mặt khác… làm hết đi").
// Một ô tìm của 📖 Từ điển, chọn loại: 📚 Từ · 🧱 Ngữ pháp · 🔗 Cụm từ · ❗ Lỗi hay gặp · 👄 Phát âm · ✍️ Cụm câu. Ở loại 📚 Từ, đang tìm thì hiện thêm
// "Cũng có" (ngữ pháp / lỗi / cụm câu khớp) để một lần gõ ra mọi mặt; mục từ có "🧱 Ngữ pháp liên quan".
//   🧱 106 điểm ngữ pháp (np.json, có sẵn) · 🔗 cụm động từ, thành ngữ, cụm hay dùng, mẫu câu, trang trọng / thân mật (dữ liệu từ có sẵn)
//   ❗ lỗi hay gặp, ✍️ cụm câu Viết / Nói, 👄 bảng 44 âm (tracuu.json, Claude soạn, chưa giáo viên kiểm) + 26 cặp âm dễ nhầm (pa.json).
// Chỉ để tra: không tính vào luật đo.
let TC = null;
const tcLoad = async () => TC || (TC = await (await fetch('tracuu.json?v=' + APP_V)).json());
// v93 (31/10/2026, giáo viên tiếng Anh + thiết kế di động; người sáng lập "từ điển nhiều chức năng quá… sắp xếp lại"): từ điển là công cụ TÌM.
// Màn đầu: ô tìm (Anh hoặc Việt) + 📌 Sổ từ + 🕘 tra gần đây + 3 mục: 📚 Từ & cụm từ · 🧱 Ngữ pháp & lỗi · 👄 Phát âm. Gõ thì ra MỘT danh sách chia nhóm
// (từ, ngữ pháp, lỗi, cụm từ…); gõ tiếng Việt thì ưu tiên "tiếng Anh nói thế nào" + phân biệt từ dễ nhầm. Mẹo thi theo kỹ năng chuyển sang 🎓 Luyện thi → 📘 Cẩm nang.
const TC_SECT = { tu: ['📚', 'Từ & cụm từ', [['tu', 'Danh sách từ'], ['pb', 'Từ dễ nhầm'], ['cum:pv', 'Cụm động từ'], ['cum:idi', 'Thành ngữ'], ['cum:col', 'Cụm hay dùng'], ['cum:pat', 'Mẫu câu'], ['cum:reg', 'Trang trọng / thân mật'], ['tn', 'Từ nối'], ['afx', 'Tiền tố / hậu tố'], ['dem', 'Đếm được / không'], ['uk', 'Anh–Anh / Anh–Mỹ'], ['cau', 'Cụm câu Viết / Nói']]],
  np: ['🧱', 'Ngữ pháp & lỗi', [['np', 'Ngữ pháp'], ['loi', 'Lỗi hay gặp']]], pa: ['👄', 'Phát âm', []] };
const TC_OF = { tu: 'tu', pb: 'tu', cum: 'tu', tn: 'tu', afx: 'tu', dem: 'tu', uk: 'tu', cau: 'tu', np: 'np', loi: 'np', pa: 'pa' };
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
  const head = w ? `<div class="box"><b>${esc(w.w)}</b> <span style="font-size:20px">${esc(w.ipa || '')}</span> ${tcSay(w.w)}${typeof tdStress === 'function' ? tdStress(w) : ''}<p class="mute" style="margin:4px 0">Các âm trong từ: ${ipa.filter(p => String(w.ipa).includes(p.s)).map(p => `<button class="chip" data-tcipa="${esc(p.s)}">/${esc(p.s)}/</button>`).join('')}</p></div>` : '';
  const ps = f && !w ? ipa.filter(p => p.s === f.replace(/\//g, '') || p.ex === f) : ipa, ss = f && !w ? sets.filter(x => tcHas(f, x.title, x.vi, x.a, x.b, x.pairs)) : sets;
  return `${head}${tcAm(w ? '' : f)}<div class="box"><b>🔤 Bảng âm tiếng Anh</b> <span class="mute">(chạm để xem từ ví dụ)</span>${['nguyên âm ngắn', 'nguyên âm dài', 'nguyên âm đôi', 'phụ âm'].map(k => { const g = ps.filter(p => p.k.startsWith(k)); return g.length ? `<p style="margin:8px 0 2px" class="mute">${k}</p><div class="chips">${g.map(p => `<button class="chip ${TC_IPA === p.s ? 'on' : ''}" data-tcipa="${esc(p.s)}">/${esc(p.s)}/ ${esc(p.ex)}</button>`).join('')}</div>` : ''; }).join('')}
    ${TC_IPA ? `<div class="box" style="margin:8px 0 0"><b>/${esc(TC_IPA)}/</b> ${tcSay((ipa.find(p => p.s === TC_IPA) || {}).ex || '')}<p style="margin:4px 0">${tcIpaWords(TC_IPA).map(x => `<button class="chip" data-tcsay="${esc(x.w)}">${esc(x.w)} <span class="mute">${esc(x.ipa)}</span></button>`).join('')}</p></div>` : ''}</div>
    ${ss.length ? `<div class="box"><b>👂 Cặp âm người Việt hay nhầm</b>${ss.map(x => `<div style="margin:10px 0 0;border-top:1px solid var(--line);padding-top:8px"><b>${esc(x.a)} – ${esc(x.b)}</b> <span class="mute">${esc(x.title)} · ${esc(x.vi)}</span><p class="mute" style="margin:4px 0">${esc(x.tip)}</p>
      <div class="chips">${x.pairs.slice(0, 4).map(([a, ia, b, ib]) => `<button class="chip" data-tcsay="${esc(a)}">${esc(a)} /${esc(ia)}/</button><button class="chip" data-tcsay="${esc(b)}">${esc(b)} /${esc(ib)}/</button>`).join('')}</div></div>`).join('')}<button data-tcpa>👄 Luyện phân biệt âm</button></div>` : ''}`; }
let TC_IPA = null;

// ---------- ✍️ cụm câu Viết / Nói ----------
function tcCau(q) { const S0 = (TC && TC.cum || []).map(s => ({ t: s.t, items: s.items.filter(x => !q || tcHas(q, x.en, x.vi, x.ex, s.t)) })).filter(s => s.items.length);
  return S0.length ? S0.map(s => `<details class="box" ${q || S0.length === 1 ? 'open' : ''}><summary><b>${esc(s.t)}</b> <span class="mute">(${s.items.length})</span></summary>${s.items.map(x => `<div style="margin:8px 0;border-top:1px solid var(--line);padding-top:6px"><b>${esc(x.en)}</b><br><span class="mute">${esc(x.vi)}</span>
    <p style="margin:4px 0">${tcSay(x.ex)}${esc(x.ex)}</p><button class="chip" data-tcsave="${esc(x.en)}|${esc(x.vi)}|${esc(x.ex)}">📌 Lưu vào sổ từ</button></div>`).join('')}</details>`).join('') : '<p class="mute">Không có cụm câu khớp.</p>'; }

// ---------- vẽ theo loại (gọi từ dictList) ----------
const tcKind = () => TC_OF[DICT.kind] ? DICT.kind : 'home';
// đầu một mục: ← Tra cứu + tên mục + chip con của mục
function tcHead(k = tcKind()) { const sec = TC_SECT[TC_OF[k]]; if (!sec) return ''; const cur = k === 'cum' ? 'cum:' + (DICT.sub || 'pv') : k;
  return `<div class="row" style="margin:6px 0"><button class="link" data-tck="home" style="width:auto">← Tra cứu</button><b>${sec[0]} ${sec[1]}</b></div>${sec[2].length ? `<div class="chips" style="margin:4px 0">${sec[2].map(([c, n]) => `<button class="chip ${cur === c ? 'on' : ''}" data-tck="${c}">${esc(n)}</button>`).join('')}</div>` : ''}`; }
const tcChips = () => tcHead('tu');
// "Cũng có": ở loại 📚 Từ, đang tìm → ngữ pháp / lỗi / cụm câu khớp (gõ một lần, ra mọi mặt)
function tcAlso(q) { if (!q || q.trim().length < 3 || !TC) return ''; const np = tcNpHits(q, 3), lo = tcLoiHits(q).slice(0, 2), cau = (TC.cum || []).flatMap(s => s.items).filter(x => tcHas(q, x.en, x.vi)).slice(0, 2);
  if (!np.length && !lo.length && !cau.length) return '';
  return `<div class="box" style="margin:6px 0"><b>Cũng có</b>${np.map(x => `<p style="margin:4px 0">🧱 <button class="link" data-tcgo="np|${x.id}" style="width:auto;display:inline">${esc(x.title)}</button></p>`).join('')}
    ${lo.map(x => `<p style="margin:4px 0">❗ <button class="link" data-tcgo="loi|${esc(DICT.q)}" style="width:auto;display:inline">${esc(x.wrong)} → ${esc(x.right)}</button></p>`).join('')}
    ${cau.map(x => `<p style="margin:4px 0">✍️ <button class="link" data-tcgo="cau|${esc(DICT.q)}" style="width:auto;display:inline">${esc(x.en)}</button></p>`).join('')}</div>`; }
function tcList() { const k = tcKind(), q = (DICT.q || '').trim(), df = document.getElementById('df'), dl = document.getElementById('dl');
  if (!TC) { tcLoad().then(() => { tcRe(); }).catch(() => {}); }
  if (k === 'np' && !tcNp().length) kLoad(KIT.np).then(() => { tcRe(); }).catch(() => {});
  if (k === 'pa' && typeof PA !== 'undefined' && !PA) paLoad().then(() => { tcRe(); }).catch(() => {});
  df.innerHTML = tcHead(k);
  if (k === 'tn') { const rs = (TC && TC.noi || []).map(s => ({ ...s, items: s.items.filter(x => !q || tcHas(q, x.en, x.vi, x.ex)) })).filter(s => s.items.length); dl.innerHTML = tcAi + (rs.length ? rs.map(s => tcDet({ t: s.t, body: tcList2(s.items), open: !!q || rs.length < 3 })).join('') : '<p class="mute">Không có từ nối khớp.</p>'); return; }
  if (k === 'afx') { const rs = (TC && TC.afx || []).filter(x => !q || tcHas(q, x.a, x.vi, x.w)); dl.innerHTML = tcAi + (rs.length ? rs.map(x => `<div class="box" style="margin:8px 0;padding:10px 12px"><b>${esc(x.a)}</b> <span class="mute">${esc(x.k)} · ${esc(x.vi)}</span><br>${tcAfxWords(x).map(w => w.app ? `<button class="chip" data-tcgo="tu|${esc(w.app.w)}">${esc(w.w)}</button>` : `<span class="chip" style="opacity:.75">${esc(w.w)}</span>`).join('')}</div>`).join('') : '<p class="mute">Không có mục khớp.</p>'); return; }
  if (k === 'dem') { dl.innerHTML = tcAi + tcDem(q); return; }
  if (k === 'uk') { dl.innerHTML = tcAi + tcUkList(q); return; }
  if (k === 'pb') { const rs = tcPbHits(q); dl.innerHTML = tcAi + (rs.length ? rs.map(tcPbRow).join('') : '<p class="mute">Không có nhóm khớp.</p>'); return; }
  if (k === 'np') { const hs = tcNpHits(q); dl.innerHTML = hs.length ? hs.map(x => tcNpRow(x, DICT.open === x.id)).join('') : `<p class="mute">Không có điểm ngữ pháp khớp “${esc(q)}”. Thử tên tiếng Việt (hiện tại hoàn thành) hoặc tiếng Anh (present perfect).</p>`; return; }
  if (k === 'cum') { const rs = tcCum(DICT.sub || 'pv', q); dl.innerHTML = rs.length ? `<p class="mute">${rs.length} mục${rs.length > DICT_MAX ? `, hiện ${DICT_MAX}` : ''}. Chạm để mở từ.</p>` + rs.slice(0, DICT_MAX).map(([p, vi, ex, w]) => `<div class="drow" data-tcgo="tu|${esc(w.w)}"><b>${esc(p)}</b><br>${esc(vi || '')}${ex ? `<br><span class="mute">${esc(ex)}</span>` : ''}</div>`).join('') : '<p class="mute">Không có mục khớp.</p>'; return; }
  if (k === 'loi') { const rs = tcLoiHits(q); dl.innerHTML = tcAi + (rs.length ? rs.map(tcLoiRow).join('') : '<p class="mute">Không có lỗi khớp.</p>'); return; }
  if (k === 'pa') { dl.innerHTML = tcPa(q); return; }
  if (k === 'cau') { dl.innerHTML = tcAi + tcCau(q); return; }
}

// ---------- v91 🎧 🗣 📰 ✍️ tra theo kỹ năng: mỗi tab gom các nhóm (mẹo theo dạng câu, cụm câu, từ nối, tiền tố / hậu tố, nghe số…) ----------
const TC_SK = { nghe: ['listen', 'map', 'match'], noi: ['p13', 'p2'], doc: ['tf', 'yn', 'h', 'mi', 'mf', 'se', 'sum', 'dia', 'comp', 'sa', 'para', 'time'], viet: ['t1', 'gt1', 't2'] };
const tcSec = (t, body, txt, open) => ({ t, body, txt, open });
const tcDet = s => `<details class="box" ${s.open ? 'open' : ''}><summary><b>${s.t}</b></summary>${s.body}</details>`;
const tcList2 = (items, say = true) => items.map(x => `<div style="margin:8px 0;border-top:1px solid var(--line);padding-top:6px">${say ? tcSay(String(x.en).split(/ [→–] /)[0].replace(/\/[^/]*\//g, '')) : ''}<b>${esc(x.en)}</b><br><span class="mute">${esc(x.vi)}</span>${x.ex ? `<br>${esc(x.ex)}` : ''}</div>`).join('');
// từ ví dụ của tiền tố / hậu tố, tìm trong từ của app: ưu tiên từ có phần gốc cũng là một từ (unhappy → happy)
// v91: từ ví dụ chọn tay (x.w); từ có trong từ điển app thì bấm tra được, không có thì vẫn hiện làm ví dụ.
// (Thử tự tìm theo phần gốc thì sai nhiều: information → in-, anticipate → anti-, cousin → co-, nên không dùng.)
function tcAfxWords(x, n = 6) { const by = new Map(WORDS.map(w => [w.w.toLowerCase(), w])); return (x.w || []).slice(0, n).map(t => ({ w: t, app: by.get(t.toLowerCase()) || null })); }
// v92: chọn kỳ thi trong tab kỹ năng (🎓 CEFR dạng Cambridge · 🌏 IELTS · 💼 TOEIC); phần dùng chung (từ nối, tiền tố / hậu tố, nghe số, phát âm, lỗi) luôn hiện
const TC_EX = [['cefr', '🎓 CEFR'], ['ielts', '🌏 IELTS'], ['toeic', '💼 TOEIC']];
const tcEx = () => DICT.ex || (typeof exSel === 'function' ? exSel() : S.exSel === 'toeic' ? 'toeic' : S.ie && S.ie.set ? 'ielts' : 'cefr');
function tcExSecs(k, ex) { const out = [], li = a => a.map(t => `<p style="margin:4px 0">• ${esc(t)}</p>`).join(''), C = TC && TC.cefr;
  if (ex === 'cefr' && C) {
    if (k === 'nghe') out.push(tcSec('🎓 Nghe kiểu Cambridge (A2 Key → C2)', li(C.nghe), C.nghe.join(' '), true));
    if (k === 'noi') out.push(tcSec('🎓 Nói kiểu Cambridge', li(C.noi) + '<button data-tcgo="cau|">✍️ Cụm câu Nói</button>', C.noi.join(' '), true));
    if (k === 'doc' && typeof U_T !== 'undefined') out.push(tcSec('🎓 Dạng đề Đọc / dùng tiếng Anh (B1 → C2)', Object.values(U_T).map(([ic, t, d]) => `<p style="margin:6px 0">${ic} <b>${esc(t)}</b><br><span class="mute">${esc(d)}</span></p>`).join(''), JSON.stringify(U_T), true));
    if (k === 'viet') out.push(...C.viet.map(g => tcSec(`${g.t} <span class="mute">${esc(g.lv)}</span>`, `<p style="margin:4px 0"><b>Bố cục</b></p>${li(g.bo)}<p style="margin:8px 0 4px"><b>Giọng văn</b>: ${esc(g.giong)}</p>
      <p style="margin:8px 0 2px"><b>Mở</b></p>${g.mo.map(m => `<p style="margin:2px 0">${tcSay(m)}${esc(m)}</p>`).join('')}<p style="margin:8px 0 2px"><b>Kết</b></p>${g.ket.map(m => `<p style="margin:2px 0">${tcSay(m)}${esc(m)}</p>`).join('')}`, JSON.stringify(g)))); }
  if (ex === 'toeic') {
    if (k === 'nghe') { if (typeof TO_HOW !== 'undefined') out.push(tcSec('💼 Mẹo Nghe TOEIC', li(TO_HOW.L[1]), TO_HOW.L[1].join(' '), true));
      if (typeof TO_TRAP !== 'undefined') out.push(tcSec(`💼 Bẫy Part 2 (${Object.keys(TO_TRAP).length})`, Object.values(TO_TRAP).map(([t, d]) => `<p style="margin:6px 0"><b>${esc(t)}</b><br><span class="mute">${esc(d)}</span></p>`).join(''), JSON.stringify(TO_TRAP), true)); }
    if (k === 'doc') { if (typeof TO_HOW !== 'undefined') out.push(tcSec('💼 Mẹo Đọc TOEIC', li(TO_HOW.R[1]), TO_HOW.R[1].join(' '), true));
      if (typeof TO_T5 !== 'undefined') out.push(tcSec('💼 Part 5 theo nhóm câu', Object.entries(TO_T5).map(([t, n]) => `<p style="margin:6px 0"><b>${esc(n)}</b>${TC.t5tip && TC.t5tip[t] ? `<br><span class="mute">${esc(TC.t5tip[t])}</span>` : ''}</p>`).join(''), JSON.stringify(TO_T5) + JSON.stringify(TC.t5tip || {}), true));
      if (typeof TO !== 'undefined' && TO && TO.voc) out.push(tcSec(`💼 Từ vựng công sở (${TO.voc.reduce((n, t) => n + t.w.length, 0)} từ)`, TO.voc.map(t => `<p style="margin:10px 0 2px"><b>${esc(t.t)}</b></p>${t.w.map(([w, vi]) => `<p style="margin:2px 0">${tcSay(w)}<b>${esc(w)}</b> <span class="mute">${esc(vi)}</span></p>`).join('')}`).join(''), JSON.stringify(TO.voc))); }
    if (k === 'noi' || k === 'viet') out.push(tcSec('💼 TOEIC Listening & Reading không thi ' + (k === 'noi' ? 'Nói' : 'Viết'), `<p class="mute" style="margin:4px 0">Bài thi TOEIC phổ biến (Listening & Reading) chỉ thi Nghe và Đọc. Nói / Viết là bài thi riêng (TOEIC Speaking & Writing); app chưa có phần luyện bài này. Phần dùng chung bên dưới vẫn hữu ích.</p>`, '', true)); }
  return out; }
function tcSkill(k, q) { const ex = tcEx(); if (ex === 'toeic' && typeof toLoad === 'function' && (typeof TO === 'undefined' || !TO)) toLoad().then(() => { tcRe(); }).catch(() => {});
  if (ex === 'cefr' && typeof uLoad === 'function' && typeof UOE !== 'undefined' && !UOE) uLoad().catch(() => {});
  const how = ex !== 'ielts' ? [] : TC_SK[k].filter(h => typeof IE_HOW !== 'undefined' && IE_HOW[h]).map(h => tcSec('📘 ' + IE_HOW[h][0].replace(/^\S+\s/, ''), IE_HOW[h][1].map(s => `<p style="margin:4px 0">• ${esc(s)}</p>`).join(''), IE_HOW[h].flat(2).join(' ')));
  const noi = (TC && TC.noi || []), cum = (TC && TC.cum || []), out = [], go = (kind, t) => `<button data-tck="${kind}">${t}</button>`;
  if (k === 'nghe') { out.push(...(TC && TC.so || []).map(s => tcSec(s.t, tcList2(s.items), JSON.stringify(s)))); out.push(tcSec('🔢 Từ báo chuyển ý của bài giảng', tcList2(noi.filter(s => /Trình tự/.test(s.t)).flatMap(s => s.items)), JSON.stringify(noi)));
    out.push(...how); out.push(tcSec('👄 Âm dễ nghe nhầm', `<p class="mute" style="margin:4px 0">26 cặp âm người Việt hay nhầm (ship – sheep, thin – tin…).</p>${go('pa', '👄 Mở Phát âm')}`, 'phát âm âm')); }
  if (k === 'noi') { out.push(...(ex === 'toeic' ? [] : cum.filter(s => s.t.startsWith('🗣'))).map(s => tcSec(s.t, tcList2(s.items), JSON.stringify(s))));
    if (ex === 'ielts' && typeof IE !== 'undefined' && IE) { out.push(tcSec(`💬 Chủ đề hay gặp Part 1 (${IE.p1.length})`, IE.p1.map(p => `<p style="margin:8px 0 2px"><b>${esc(p.topic)}</b></p>${p.qs.map(([en, vi]) => `<p style="margin:2px 0">${tcSay(en)}${esc(en)} <span class="mute">${esc(vi)}</span></p>`).join('')}`).join(''), JSON.stringify(IE.p1)));
      out.push(tcSec(`🗂 Thẻ đề Part 2 + câu Part 3 (${IE.p2.length})`, IE.p2.map(p => `<details style="margin:6px 0"><summary>${esc(p.t)}</summary><p class="mute" style="margin:2px 0">${esc(p.vi)}</p>${p.b.map(b => `<p style="margin:2px 0">• ${esc(b)}</p>`).join('')}${p.p3.map(([en]) => `<p style="margin:2px 0">❓ ${esc(en)}</p>`).join('')}${p.m ? `<details><summary>Bài mẫu (Claude viết)</summary><p class="tdtap">${esc(p.m)}</p></details>` : ''}</details>`).join(''), JSON.stringify(IE.p2))); }
    out.push(...how); out.push(tcSec('👄 Phát âm, âm yếu', `${go('pa', '👄 Bảng âm + cặp âm dễ nhầm')}${tcList2(((TC && TC.so) || []).filter(s => /Âm yếu/.test(s.t)).flatMap(s => s.items))}`, 'phát âm âm yếu nối âm')); }
  if (k === 'doc') { out.push(tcSec('🔗 Từ nối: cho biết ý tiếp theo', noi.map(s => `<p style="margin:10px 0 2px"><b>${esc(s.t)}</b></p>${tcList2(s.items)}`).join(''), JSON.stringify(noi)));
    out.push(tcSec(`🧩 Tiền tố, hậu tố: đoán nghĩa từ mới (${(TC && TC.afx || []).length})`, (TC && TC.afx || []).map(x => `<div style="margin:8px 0;border-top:1px solid var(--line);padding-top:6px"><b>${esc(x.a)}</b> <span class="mute">${esc(x.k)} · ${esc(x.vi)}</span><br>${tcAfxWords(x).map(w => w.app ? `<button class="chip" data-tcgo="tu|${esc(w.app.w)}">${esc(w.w)}</button>` : `<span class="chip" style="opacity:.75">${esc(w.w)}</span>`).join('')}</div>`).join(''), JSON.stringify(TC && TC.afx)));
    if (typeof IE !== 'undefined' && IE && IE.para) out.push(tcSec(`🔁 Cặp diễn đạt lại (${IE.para.length})`, IE.para.map(x => `<p style="margin:8px 0 2px">❓ ${esc(x.s)}<br>📄 ${esc(x.a)}</p><p class="mute" style="margin:0">${x.p.map(([a, b]) => esc(a) + ' → ' + esc(b)).join(' · ')}</p>`).join('') + '<button data-iepara>🔁 Luyện diễn đạt lại</button>', JSON.stringify(IE.para)));
    out.push(...how); }
  if (k === 'viet') { out.push(...how.map(s => ({ ...s, t: s.t.replace('📘', '🏗 Bố cục:') })));
    out.push(...cum.filter(s => ex === 'ielts' ? /^(✍️|📝|✉️)/.test(s.t) : ex === 'cefr' && /^✉️/.test(s.t)).map(s => tcSec(s.t, tcList2(s.items), JSON.stringify(s))));
    out.push(tcSec('🔗 Từ nối theo chức năng', noi.map(s => `<p style="margin:10px 0 2px"><b>${esc(s.t)}</b></p>${tcList2(s.items)}`).join(''), JSON.stringify(noi)));
    out.push(tcSec('❗ Lỗi hay gặp, cụm từ hay đi với nhau', `${go('loi', '❗ 42 lỗi hay gặp của người Việt')}<button data-tcgo="cum|">🔗 Cụm hay dùng (collocation)</button>`, 'lỗi collocation cụm')); }
  out.unshift(...tcExSecs(k, ex));
  const shown = q ? out.filter(s => tcHas(q, s.t, s.txt)).map(s => ({ ...s, open: true })) : out, chips = `<div class="chips" style="margin:6px 0">${TC_EX.map(([e, n]) => `<button class="chip ${ex === e ? 'on' : ''}" data-tce="${e}">${n}</button>`).join('')}</div>`;
  return chips + tcAi + (shown.length ? shown.map(tcDet).join('') : `<p class="mute">Không có mục khớp “${esc(q)}” trong tab này.</p>`); }
document.addEventListener('click', e => { const cn = document.getElementById('cnv'); if (!S || (!document.getElementById('dq') && !cn)) return; const g = s => e.target.closest(s); let b;
  const stop = () => e.stopPropagation(), re = () => { if (cn) camnangView(); else dictList(); }, toDict = () => { if (cn) { scrollTo(0, 0); dict(); return true; } return false; };
  if (!cn && g('#dl summary')) { stop(); return; }   // mở / gập tầng của mục từ: không gập cả mục
  if ((b = g('[data-tck]'))) { stop(); const [k, sub] = b.dataset.tck.split(':'); DICT.kind = k; if (sub) DICT.sub = sub; DICT.open = null; if (k === 'home') { DICT.q = ''; const dq = document.getElementById('dq'); if (dq) dq.value = ''; } if (toDict()) return; scrollTo(0, 0); return re(); }
  if ((b = g('[data-tcs]'))) { stop(); DICT.sub = b.dataset.tcs; return re(); }
  if ((b = g('[data-tce]'))) { stop(); DICT.ex = b.dataset.tce; return re(); }
  if ((b = g('[data-tcsay]'))) { stop(); return speak(b.dataset.tcsay); }
  if ((b = g('[data-tcipa]'))) { stop(); TC_IPA = TC_IPA === b.dataset.tcipa ? null : b.dataset.tcipa; DICT.kind = 'pa'; return re(); }
  if (g('[data-tcpa]')) { stop(); return paView(); }
  if ((b = g('[data-tcsave]'))) { stop(); const [w, vi, ex] = b.dataset.tcsave.split('|'); const n = typeof vwPut === 'function' ? vwPut([{ w, vi, ex, app: null }], '✍️ Cụm câu') : 0; return toast(n ? '📌 Đã lưu vào sổ từ.' : 'Cụm này đã có trong sổ.'); }
  if ((b = g('[data-tcnpl]'))) { stop(); const x = tcNp().find(y => y.id === b.dataset.tcnpl); if (x) { KIT.np.view = x.lv; scrollTo(0, 0); return kLearn(KIT.np, x); } return; }
  if ((b = g('[data-tcgo]'))) { stop(); const v = b.dataset.tcgo, i = v.indexOf('|'), k = v.slice(0, i), [a, all] = v.slice(i + 1).split('|');
    if (k === 'np') { DICT.kind = 'np'; DICT.q = ''; DICT.open = a; } else if (k === 'tu') { const w = WORDS.find(x => x.w === a); DICT.kind = all || !w ? 'tu' : 'home'; DICT.q = a; DICT.open = w && !all ? w.id : null; if (w && !all) tdSeen(w); } else { DICT.kind = k; DICT.q = a; DICT.open = null; if (k === 'cum' && !a) DICT.sub = 'col'; }
    if (toDict()) return; const dq = document.getElementById('dq'); dq.value = DICT.q; re(); scrollTo(0, 0); return; }
  if ((b = g('[data-tcnp]')) && tcKind() === 'np') { stop(); DICT.open = DICT.open === b.dataset.tcnp ? null : b.dataset.tcnp; return re(); } }, true);

// ---------- v93 màn đầu, tìm gộp nhóm, từ dễ nhầm, 📘 Cẩm nang thi ----------
const tcRe = () => document.getElementById('cnv') ? camnangView() : document.getElementById('dq') ? dictList() : 0;
const TC_VN = /[àáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ]/i;
const tcPbHits = q => (TC && TC.pb || []).filter(g => !q || tcHas(q, g.vi, g.w, g.note));
const tcPbRow = g => `<div class="box" style="margin:8px 0"><b>“${esc(g.vi)}”: ${g.w.map(x => `<button class="chip" data-tcgo="tu|${esc(x)}">${esc(x)}</button>`).join('')}</b>${g.note.map(n => `<p style="margin:4px 0;font-size:15px">• ${esc(n)}</p>`).join('')}</div>`;
// từ khớp ô tìm (như danh sách từ: chữ / nghĩa / dạng biến đổi / gõ sai), khớp đúng lên đầu; tiếng Việt: nghĩa bắt đầu bằng chữ gõ lên trước
function tcWordHits(q, n = 8) { const f = tcF(q.trim()), M = typeof tdMatch === 'function' ? tdMatch(q) : { ids: new Set(), how: new Map() }, vn = TC_VN.test(q);
  // v99 (nhật ký trải nghiệm: gõ "tăng" ra cả "tầng lớp"): gõ có dấu thì nghĩa tiếng Việt khớp đủ dấu; gõ không dấu mới so bỏ dấu
  const qv = q.trim().toLowerCase().normalize('NFC'), hs = WORDS.filter(w => (!vn && tcF(w.w).includes(f)) || (vn ? String(w.vi || '').toLowerCase().normalize('NFC').includes(qv) : tcF(w.vi).includes(f)) || M.ids.has(w.id));
  const r = w => vn ? (tcF(w.vi).startsWith(f) ? 0 : new RegExp(`(^|[ ,;(])${f.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}([ ,;)]|$)`).test(tcF(w.vi)) ? 1 : 2) : tdRank(w, q, M);
  return { M, all: hs.sort((a, b) => r(a) - r(b) || a.w.length - b.w.length || a.w.localeCompare(b.w)), n }; }
function tcSearch(q) { const df = document.getElementById('df'), dl = document.getElementById('dl'), vn = TC_VN.test(q), W = tcWordHits(q), grp = [];
  const more = (k, n, t) => n ? `<button class="link" data-tcgo="${k}|${esc(q)}" style="width:auto">Xem thêm ${n} ${t} ›</button>` : '';
  const sec = (t, body) => body ? `<div style="margin:12px 0 4px"><b>${t}</b></div>${body}` : '';
  const pb = tcPbHits(q).filter(g => tcHas(q, g.vi, g.w)).slice(0, 2), np = tcNpHits(q, 3), lo = tcLoiHits(q).slice(0, 2), cumAll = q.trim().length >= 3 ? ['pv', 'idi', 'col'].flatMap(s => tcCum(s, q).map(r => [s, ...r])) : [], cum = cumAll.slice(0, 3);
  const tn = q.trim().length >= 3 ? (TC && TC.noi || []).flatMap(s => s.items).filter(x => tcHas(q, x.en, x.vi)).slice(0, 3) : [];
  const words = W.all.slice(0, W.n).map(w => dictRow(w, null, W.M)).join('');
  if (vn && pb.length) grp.push(sec(`⚖️ Tiếng Anh nói “${esc(q.trim())}” thế nào`, pb.map(tcPbRow).join('')));
  grp.push(sec(`📚 Từ${W.all.length ? ` (${W.all.length})` : ''}`, words ? words + (W.all.length > W.n ? `<button class="link" data-tcgo="tu|${esc(q)}|all" style="width:auto">Xem tất cả ${W.all.length} từ ›</button>` : '') : ''));
  if (!vn && pb.length) grp.push(sec('⚖️ Từ dễ nhầm', pb.map(tcPbRow).join('')));
  grp.push(sec('🧱 Ngữ pháp', np.map(x => `<div class="drow" data-tcgo="np|${x.id}"><b>${esc(x.title)}</b> <span class="lvtag ${x.lv}">${LVN[x.lv] || ''}</span><br><span class="mute">${esc(x.en || '')}</span></div>`).join('') + more('np', Math.max(0, tcNpHits(q).length - np.length), 'điểm ngữ pháp')));
  grp.push(sec('❗ Lỗi hay gặp', lo.map(tcLoiRow).join('')));
  grp.push(sec('🔗 Cụm từ, thành ngữ', cum.map(([s, p, vi, ex, w]) => `<div class="drow" data-tcgo="tu|${esc(w.w)}"><b>${esc(p)}</b><br>${esc(vi || '')}</div>`).join('')));
  grp.push(sec('🔀 Từ nối', tn.length ? tcList2(tn) : ''));
  const uk = (TC && TC.uk || []).filter(x => x.k !== 'spell' && q.trim().length >= 3 && tcHas(q, x.gb, x.us)).slice(0, 3);   // từ Anh–Mỹ khác (chính tả khác đã ra ở 📚 Từ)
  grp.push(sec('🇬🇧🇺🇸 Anh–Anh / Anh–Mỹ', uk.map(x => `<div class="row" style="margin:4px 0"><span>🇬🇧 ${tcWordChip(x.gb)}</span><span>🇺🇸 ${tcWordChip(x.us)}</span></div>`).join('')));
  const body = grp.filter(Boolean).join('');
  df.innerHTML = `<div class="row" style="margin:6px 0"><button class="link" data-tck="home" style="width:auto">← Tra cứu</button><span class="mute">${vn ? 'Tìm từ tiếng Anh cho nghĩa tiếng Việt' : 'Kết quả tìm'}</span></div>`;
  dl.innerHTML = body && W.all.length ? body : (body || '') + (typeof tdNone === 'function' ? tdNone(q.trim()) : ''); }
function tcHome() { const df = document.getElementById('df'), dl = document.getElementById('dl');
  const card = (k, ic, t, d) => `<button class="box" data-tck="${k}" style="margin:6px 0;text-align:left;display:block;width:100%"><b style="font-size:17px">${ic} ${t}</b><br><span class="mute" style="font-size:14px">${d}</span></button>`;
  df.innerHTML = typeof tdTop === 'function' ? tdTop() : '';
  dl.innerHTML = `<p class="mute" style="margin:10px 0 2px">Gõ tiếng Anh khi gặp từ lạ; gõ tiếng Việt khi muốn nói / viết một ý.</p>
    ${card('tu', '📚', 'Từ & cụm từ', `${WORDS.length.toLocaleString('vi-VN')} từ theo cấp, từ dễ nhầm, cụm động từ, thành ngữ, từ nối, tiền tố / hậu tố`)}
    ${card('np', '🧱', 'Ngữ pháp & lỗi hay gặp', `${tcNp().length || 106} điểm ngữ pháp, ${(TC && TC.loi || []).length || 42} lỗi người Việt hay mắc`)}
    ${card('pa', '👄', 'Phát âm', '44 âm, trọng âm, đuôi -s / -ed, âm cuối, ngữ điệu, cặp âm dễ nhầm')}
    <button class="box" data-cnv="tc" style="margin:6px 0;text-align:left;display:block;width:100%"><b style="font-size:17px">📘 Cẩm nang thi</b><br><span class="mute" style="font-size:14px">Mẹo Nghe · Nói · Đọc · Viết theo Cambridge / IELTS / TOEIC: dạng câu, bố cục bài, cụm câu, bẫy hay gặp</span></button>`; }
// điều hướng của dictList: true = đã vẽ (màn đầu / tìm gộp / mục khác); false = để app.js vẽ 📚 danh sách từ theo cấp
function tcRoute() { if (!TC) tcLoad().then(() => { tcRe(); }).catch(() => {}); const k = tcKind(), q = (DICT.q || '').trim();
  if (k === 'home') { q ? tcSearch(q) : tcHome(); return true; }
  if (k !== 'tu') { tcList(); return true; }
  return false; }

// 📘 Cẩm nang thi: mẹo theo kỹ năng × kỳ thi. v91–v92 ở Từ điển, v93 chuyển sang 🎓 Luyện thi, v95 chỗ ở chính là 📖 Tra cứu (thẻ thứ 4),
// 🎓 Luyện thi giữ lối tắt "📘 Cẩm nang thi" ở mỗi kỳ thi (chọn sẵn kỳ thi đó)
let CN_K = 'nghe', CN_FROM = 'tc';   // v95: from 'tc' = 📖 Tra cứu (chỗ ở chính) · 'ex' = 🎓 Luyện thi (lối tắt, chọn sẵn kỳ thi)
function camnangView(k, from, ex) { if (k) CN_K = k; if (from) CN_FROM = from; if (ex) DICT.ex = ex; window.CUR = { view: 'cam-nang' }; const mk = CN_FROM === 'ex' ? '<div id="ie"></div>' : '<div id="tcv"></div>'; const need = [typeof ieLoad === 'function' && (typeof IE === 'undefined' || !IE) ? ieLoad() : 0, !TC ? tcLoad() : 0].filter(Boolean);
  if (need.length) { $app.innerHTML = mk + '<p class="mute">Đang tải…</p>'; Promise.all(need).then(() => camnangView()).catch(() => {}); return; }
  $app.innerHTML = `${mk}<div id="cnv"></div><div class="row top"><button class="link" data-a="back">← ${CN_FROM === 'ex' ? 'Luyện thi' : 'Tra cứu'}</button><span class="uname">📘 Cẩm nang thi</span></div><h1>📘 Cẩm nang thi</h1>
    <p class="mute">Mẹo theo dạng câu, bố cục, cụm câu, bẫy hay gặp. Chọn kỹ năng và kỳ thi.</p>
    <div class="chips">${[['nghe', '🎧 Nghe'], ['noi', '🗣 Nói'], ['doc', '📰 Đọc'], ['viet', '✍️ Viết']].map(([c, n]) => `<button class="chip ${CN_K === c ? 'on' : ''}" data-cnk="${c}">${n}</button>`).join('')}</div>
    <div id="cnb">${tcSkill(CN_K, '')}</div>`;
  $app.onclick = e => { if (e.target.closest('[data-a="back"]')) { scrollTo(0, 0); return CN_FROM === 'ex' ? (typeof exOpen === 'function' ? exOpen() : ieltsView()) : dict(); } const b = e.target.closest('[data-cnk]'); if (b) { scrollTo(0, 0); camnangView(b.dataset.cnk); } }; }
document.addEventListener('click', e => { const b = S && e.target.closest('[data-cnv]'); if (!b) return; scrollTo(0, 0); const v = b.dataset.cnv || 'tc'; camnangView(null, v === 'tc' ? 'tc' : 'ex', v === 'tc' ? null : v); });

// ---------- v94 🔢 đếm được / không đếm được, 🇬🇧🇺🇸 Anh–Anh / Anh–Mỹ, 👄 quy tắc phát âm ----------
const tcWordChip = t => { const w = WORDS.find(x => x.w.toLowerCase() === String(t).toLowerCase()); return w ? `<button class="chip" data-tcgo="tu|${esc(w.w)}">${esc(t)}</button>` : `<span class="chip" style="opacity:.75">${esc(t)}</span>`; };
function tcDem(q) { const U = (TC && TC.unc || []).filter(x => !q || tcHas(q, x.w, x.note)), C = (TC && TC.cu || []).filter(x => !q || tcHas(q, x.w, x.c, x.u));
  return `<div class="box"><b>Quy tắc chung</b><p style="margin:4px 0">• Danh từ <b>đếm được [C]</b>: có số nhiều (-s), dùng a / an, many, a few.</p><p style="margin:4px 0">• Danh từ <b>không đếm được [U]</b>: không có -s, không dùng a / an; dùng much, a little, some; muốn đếm thì dùng "a piece of / a glass of…".</p><p style="margin:4px 0">• Động từ đi sau danh từ không đếm được chia số ít: <i>The information is useful.</i></p></div>
    ${U.length ? `<details class="box" open><summary><b>[U] Không đếm được (${U.length})</b></summary>${U.map(x => `<p style="margin:6px 0">${tcWordChip(x.w)} <span class="mute">${esc(x.note)}</span></p>`).join('')}</details>` : ''}
    ${C.length ? `<details class="box" ${q ? 'open' : ''}><summary><b>[C / U] Vừa đếm được vừa không, đổi nghĩa (${C.length})</b></summary>${C.map(x => `<p style="margin:8px 0">${tcWordChip(x.w)}<br><span class="mute">• ${esc(x.c)}<br>• ${esc(x.u)}</span></p>`).join('')}</details>` : ''}
    ${!U.length && !C.length ? '<p class="mute">Không có mục khớp.</p>' : ''}`; }
function tcUkList(q) { const L = (TC && TC.uk || []).filter(x => !q || tcHas(q, x.gb, x.us)), grp = [['spell', '✍️ Chính tả khác'], ['word', '🗣 Dùng từ khác'], ['use', '🧩 Cách dùng khác']];
  return `<p class="mute" style="margin:6px 0">IELTS, Cambridge dùng Anh–Anh; TOEIC dùng cả hai, nhiều Anh–Mỹ. Viết bài nên giữ một kiểu cho cả bài. App dùng chính tả Anh–Anh (colour, centre) nhưng đuôi -ize (organize).</p>
    ${grp.map(([k, t]) => { const g = L.filter(x => x.k === k); return g.length ? `<details class="box" ${q || k === 'spell' ? 'open' : ''}><summary><b>${t} (${g.length})</b></summary>${g.map(x => `<div class="row" style="margin:4px 0;align-items:center"><span>🇬🇧 ${tcWordChip(x.gb)}</span><span>🇺🇸 ${tcWordChip(x.us)}</span></div>`).join('')}</details>` : ''; }).join('') || '<p class="mute">Không có mục khớp.</p>'}`; }
// 👄 quy tắc: trọng âm, đuôi -s / -ed, âm cuối, ngữ điệu (ví dụ có 🔊; chữ IN HOA = âm tiết nhấn)
const tcAm = q => (TC && TC.am || []).map(sec => ({ ...sec, items: sec.items.filter(it => !q || tcHas(q, sec.t, it.r, it.ex, it.x || '')) })).filter(sec => sec.items.length)
  .map(sec => `<details class="box" ${q ? 'open' : ''}><summary><b>${sec.t}</b></summary>${sec.note ? `<p class="mute" style="margin:4px 0">${esc(sec.note)}</p>` : ''}${sec.items.map(it => `<div style="margin:8px 0;border-top:1px solid var(--line);padding-top:6px"><b>${esc(it.r)}</b><div class="chips" style="margin:4px 0">${it.ex.map(([say, show]) => `<button class="chip" data-tcsay="${esc(say)}">🔊 ${esc(show)}</button>`).join('')}</div>${it.x ? `<p class="mute" style="margin:2px 0">${esc(it.x)}</p>` : ''}</div>`).join('')}</details>`).join('');
