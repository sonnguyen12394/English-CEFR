// v167–v168 🎮 Trò chơi Reading TOEIC (specs/018-toeic-tro-choi; người sáng lập 13/11/2026: "tạo trò chơi để nhớ từ vựng, ngữ nghĩa, cấu trúc để làm bài Reading tốt",
//   "đặt thành 1 mục trong Luyện đề", "lấy nội dung tất cả đề"; v168: "chọn đề được để làm nội dung chơi, chơi hết 1 đề đã chọn, làm hết tất cả trò chơi còn lại").
//   KHÔNG đổi luật đo, không ghi điểm đề thử, không ghi bản đồ điểm TOEIC, không tạo thẻ học.
// Nội dung: câu của MỘT đề thử trọn người học chọn (TO.tron: Đề 1–8 + đề riêng đã mở mã trên máy; S.to.tc.de). Mỗi trò chơi hết đề theo lượt TG_N mục:
//   mục chưa chơi theo thứ tự đề (câu làm sai trong 📋 bài làm đề lên trước) → hết thì mục đến hạn ôn → hết thì "đã chơi hết đề", chơi lại mục sai / cả đề.
// 6 trò: 🔁 Săn cặp (Part 7 ev ↔ đáp án) · 🏃 Đua dò tin (Part 7: chạm câu chứa đáp án trong văn bản) · 🧩 Họ từ (Part 5 dạng từ) ·
//   🔗 Cụm hay dùng (cụm "tiếng Anh = nghĩa" trong lời giải lg.ct, ghép như Săn cặp) · 🔀 Từ nối (Part 6 từ nối + Part 5 liên từ: quan hệ hai vế → chọn từ) ·
//   🎯 Bắn nhiễu (Part 5: loại 3 phương án sai, chạm trúng đáp án là thua).
// Lịch ôn riêng S.to.tc.it[mã] = { b: hộp 0–4, d: ngày gặp lại, t: ngày chơi gần nhất, n, w }: sai → hộp 0, gặp lại ngày sau; đúng → hộp +1, gặp lại sau TG_I ngày.
// Đếm dùng S.to.tc.st[trò] = { r: số lượt, q: số mục, ok: đúng lần đầu, rv: số mục ôn lại, rvok: ôn lại đúng } (SC-003).
const TG_N = 5, TG_I = [1, 3, 7, 21], TG_EVW = 15, TG_VIEW = 'toeic-tro-choi';
const TG_G = [   // [mã, biểu tượng, tên, mô tả, đơn vị]
  ['pair', '🔁', 'Săn cặp diễn đạt lại', 'Part 7 · ghép chữ trong bài với chữ trong đáp án', 'cặp'],
  ['dt', '🏃', 'Đua dò tin', 'Part 7 · chạm câu chứa đáp án trong văn bản', 'câu'],
  ['ho', '🧩', 'Họ từ', 'Part 5 · nhận ra loại từ rồi điền câu', 'câu'],
  ['cum', '🔗', 'Cụm hay dùng', 'Part 5–7 · ghép cụm tiếng Anh với nghĩa', 'cụm'],
  ['noi', '🔀', 'Từ nối', 'Part 5–6 · nhận ra quan hệ hai vế rồi chọn từ', 'câu'],
  ['ban', '🎯', 'Bắn nhiễu', 'Part 5 · loại 3 phương án sai, giữ đáp án', 'câu']];
const TG_GN = Object.fromEntries(TG_G.map(g => [g[0], g]));
// quan hệ hai vế của từ nối / liên từ (từ không có ở đây thì bỏ bước 1)
const TG_CAT = { 'thêm ý': ['in addition', 'furthermore', 'moreover', 'also', 'and', 'besides', 'additionally'], 'đối lập': ['however', 'although', 'though', 'even though', 'despite', 'in spite of', 'nevertheless', 'but', 'yet', 'whereas'],
  'kết quả / mục đích': ['therefore', 'as a result', 'consequently', 'thus', 'so that', 'so', 'in order to'], 'nguyên nhân': ['because', 'because of', 'due to', 'since', 'as'],
  'điều kiện': ['if', 'unless', 'as long as', 'in case', 'provided that'], 'thời gian': ['once', 'as soon as', 'since then', 'when', 'until', 'before', 'after', 'meanwhile'],
  'lựa chọn': ['or', 'either', 'nor', 'neither', 'alternatively', 'otherwise'], 'nhấn mạnh': ['of course', 'in fact', 'indeed', 'actually'] };
const tgCat = w => { const k = String(w || '').toLowerCase().trim(); for (const [c, ws] of Object.entries(TG_CAT)) if (ws.includes(k)) return c; return null; };
const tgSt = () => { const o = toSt(); o.tc = o.tc || { it: {}, st: {} }; o.tc.it = o.tc.it || {}; o.tc.st = o.tc.st || {}; return o.tc; };
const tgDay = () => dayOf(Date.now());
const TG_VN = /[àáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ]/i;
// loại từ đọc từ lời giải ("trạng từ: trực tiếp"); không rõ thì null
function tgPos(v) { const k = String(v || '').split(':')[0].trim().toLowerCase();
  if (/\//.test(k.replace(/v3 \/ quá khứ/, 'v3')) || /so sánh/.test(k)) return null;
  if (/^danh từ/.test(k)) return 'danh từ'; if (/^tính từ/.test(k)) return 'tính từ'; if (/^trạng từ/.test(k)) return 'trạng từ';
  if (/^(v3|v-ing|phân từ)/.test(k)) return 'V3 / V-ing'; if (/^động từ/.test(k)) return 'động từ'; return null; }
// cụm "tiếng Anh = nghĩa" trong lời giải ("request a refund = ask for a refund = yêu cầu hoàn tiền · within 30 days = trong vòng 30 ngày")
function tgCums(ct) { const out = [];
  for (const seg of String(ct || '').split(' · ')) { const p = seg.split(' = ').map(s => s.trim()); if (p.length < 2) continue; const L = p[0], R = p[p.length - 1];
    if (!L || !R || TG_VN.test(L) || !TG_VN.test(R) || /[+…→]/.test(L) || L.length > 40 || R.length > 50) continue; out.push([L, R]); }
  return out; }
// tách văn bản thành câu theo vị trí gốc (không ghép lại bằng dấu cách; không dùng lookbehind: Safari cũ lỗi cú pháp):
//   chỉ cắt sau . ! ? khi theo sau là dấu cách + chữ hoa / số / ngoặc, không cắt sau Mr. Ms. a.m. A.M. chữ viết tắt một chữ hoa
const TG_ABBR = /(\b(Mr|Ms|Mrs|Dr|St|No|Inc|Co|Ltd|etc|Jr|Sr|Ave|Rd|vs|a\.m|p\.m|e\.g|i\.e)|\b[A-Z])\.$/;
function tgSents(text) { const out = [];
  for (const line of String(text || '').split('\n')) { const re = /[.!?]+(?=\s+["“(A-Z0-9])/g; let st = 0, m;
    while ((m = re.exec(line))) { const end = m.index + m[0].length, s = line.slice(st, end).trim(); if (TG_ABBR.test(s)) continue; if (s) out.push(s); st = end; }
    const rest = line.slice(st).trim(); if (rest) out.push(rest); }
  return out; }
const tgNorm = s => String(s || '').toLowerCase().replace(/[“”"’']/g, "'").replace(/\s+/g, ' ').trim();
const tgHit = (sent, ev) => { const a = tgNorm(sent), e = tgNorm(ev); return a.includes(e.slice(0, 25)) || (a.length >= 12 && e.includes(a.replace(/[.!?]+$/, ''))); };
// câu đã làm sai trong mọi bài làm 📋 đã lưu của đề (cả đề, một phần, từng lượt)
function tgWrong(de, B) { const w = new Set(); for (const k of Object.keys(toSt().tronA || {})) { if (k !== de && !k.startsWith(de + ':')) continue;
  const A = trAGet(de, k); if (!A) continue; for (const q of B.Q) if (trSt3(q, String(A.a || '')[q.n - 1]) === 'no') w.add(q.n); } return w; }
// kho mục của mọi đề: P[de][trò] = [mục]; mục theo thứ tự câu trong đề, câu làm sai lên trước khi chơi
async function tgPool() { const P = {}, D = (typeof TO !== 'undefined' && TO && TO.tron) || [];
  for (const d of D) if (d.f && !TR.D[d.id]) await trLoad(d.id);
  for (const d of D) { const B = trB(d.id); if (!B) continue; const wr = tgWrong(d.id, B), G = P[d.id] = { pair: [], dt: [], ho: [], cum: [], noi: [], ban: [] }, seen = new Set();
    for (const q of B.Q) { const id = d.id + ':' + q.n, w = wr.has(q.n), lg = q.lg || {}, base = { de: d.id, q, w };
      if (q.sec === 'p7' && q.ev && q.qt !== 'not' && !/^\[\d\]$/.test(q.a)) {
        if (q.ev.split(/\s+/).length <= TG_EVW && !seen.has('L' + q.ev) && !seen.has('R' + q.a)) { seen.add('L' + q.ev); seen.add('R' + q.a); G.pair.push({ ...base, id: 'pair:' + id, L: q.ev, R: q.a, vL: lg.dich || '', vR: (lg.og || {})[q.a] || '' }); }
        const docs = q.x.docs.map(dc => ({ title: dc.title, ss: tgSents(dc.text) })); if (docs.some(dc => dc.ss.some(s => tgHit(s, q.ev)))) G.dt.push({ ...base, id: 'dt:' + id, set: q.x.id, docs }); }
      if (q.sec === 'p5' && q.x && q.x.t === 'form' && lg.og && q.opts.every(o => lg.og[o])) { const pos = Object.fromEntries(q.opts.map(o => [o, tgPos(lg.og[o])])), pa = pos[q.a];
        G.ho.push({ ...base, id: id, pos, ask: pa && q.opts.filter(o => pos[o] === pa).length === 1 ? pa : null }); }   // mã cũ (v167) giữ cho Họ từ
      if (lg.ct) tgCums(lg.ct).forEach(([L, R], k) => { const key = 'C' + L.toLowerCase(); if (seen.has(key) || seen.has('V' + R)) return; seen.add(key); seen.add('V' + R); G.cum.push({ ...base, id: 'cum:' + id + ':' + k, L, R, vL: '', vR: '' }); });
      if ((q.sec === 'p6' && q.gt === 'conn') || (q.sec === 'p5' && q.x && q.x.t === 'conj')) G.noi.push({ ...base, id: 'noi:' + id, cat: tgCat(q.a) });
      if (TG_SEC.test(q.sec) && lg.og && q.opts.every(o => lg.og[o])) G.ban.push({ ...base, id: 'ban:' + id }); } }
  return P; }
// lượt kế tiếp trong một đề: chưa chơi (sai trong đề trước, rồi theo thứ tự đề) → đến hạn ôn; mode 'sai' = mục đang sai, 'all' = cả đề xáo
function tgNext(list, mode, n = TG_N) { const I = tgSt().it, t = tgDay();
  if (mode === 'sai') return shuf(list.filter(x => I[x.id] && I[x.id].b === 0)).slice(0, n);
  if (mode === 'all') return shuf(list).slice(0, n);
  const fresh = list.filter(x => !I[x.id]); if (fresh.length) return [...fresh.filter(x => x.w), ...fresh.filter(x => !x.w)].slice(0, n);
  return list.filter(x => I[x.id].d <= t && I[x.id].t !== t).sort((a, b) => I[a.id].d - I[b.id].d).slice(0, n); }
function tgProg(list) { const I = tgSt().it, t = tgDay(); let pl = 0, sai = 0, due = 0;
  for (const x of list) { const z = I[x.id]; if (!z) continue; pl++; if (z.b === 0) sai++; if (z.d <= t && z.t !== t) due++; }
  return { n: list.length, pl, sai, due, left: list.length - pl }; }
function tgMark(game, x, ok) { const T = tgSt(), t = tgDay(), z = T.it[x.id] || { b: 0, n: 0, w: 0 }, st = T.st[game] = T.st[game] || { r: 0, q: 0, ok: 0, rv: 0, rvok: 0 };
  if (z.n) { st.rv++; if (ok) st.rvok++; } else { st.q++; if (ok) st.ok++; }
  z.n++; if (ok) z.b = Math.min(z.b + 1, TG_I.length); else { z.w++; z.b = 0; } z.t = t; z.d = t + (ok ? TG_I[z.b - 1] : 1); T.it[x.id] = z; }
const tgDe = () => { const D = ((TO && TO.tron) || []).filter(d => TG_P && TG_P[d.id]), c = tgSt().de; return D.some(d => d.id === c) ? c : (D[0] || {}).id; };
const tgHead = (g, i, n) => `<div id="ie"></div><div class="row top"><button class="link tap" data-tgv>‹ Hành trình</button><span class="mute">${TG_HDR ? '' : esc(trName(tgDe())) + ' · ' + i + '/' + n}</span></div><h2 style="margin:4px 0 ${TG_HDR ? 0 : 8}px">${TG_GN[g][1]} ${TG_GN[g][2]}</h2>${TG_HDR ? `<p class="mute" style="margin:2px 0 8px">${esc(TG_HDR)}</p>` : ''}`;
const tgBack = e => { if (e.target.closest('[data-tgv]')) { $app.onkeydown = null; TG_CB = null; TG_HDR = ''; tgView(); return true; } return false; };

// ---------- v169 🗺 Chinh phục đề: MỘT hành trình, đích = đúng hết 100 câu Phần Đọc (Part 5–7) của đề đã chọn ----------
// (người sáng lập 13/11/2026: "gộp tất cả trò chơi lại làm 1… mục tiêu cuối cùng của trò chơi là làm đề thật đã chọn đúng hết", "bạn tự tính làm")
// Vòng: ① Thi lượt 10 câu như đề thật (đề thử trọn, totron.js) → ② câu sai: Chữa bằng các trò của chính câu đó (họ từ, từ nối, dò tin, săn cặp, cụm, bắn nhiễu)
//   → ③ NGÀY SAU thi lại đúng câu đó (như luật "chữa xong" của app: đúng ở ngày sau lần sai) → đúng thì câu 🟩, sai thì 🟥 chữa lại.
// Trạng thái câu = sự kiện mới nhất giữa bài làm 📋 đã lưu (S.to.tronA, mọi lần làm cả đề / một phần / từng lượt) và hành trình S.to.tc.j[de].c[n] = { s: 'fix'|'ok'|'sai', at, fd }.
const TG_SEC = /^p[5-7]$/, TG_FIXN = 3;
let TG_CB = null, TG_HDR = '', TG_J = null;   // TG_CB: trò đang chạy trong buổi chữa (tgEnd gọi lại) · TG_HDR: dòng đầu màn trò · TG_J: đề đang thi lượt từ hành trình
const tgJ = de => { const T = tgSt(); T.j = T.j || {}; return (T.j[de] = T.j[de] || { c: {} }); };
function tgJState(de) { const B = trB(de); if (!B) return null; const Q = B.Q.filter(q => TG_SEC.test(q.sec)), last = {};
  for (const k of Object.keys(toSt().tronA || {})) { if (k !== de && !k.startsWith(de + ':')) continue; const A = trAGet(de, k); if (!A) continue; const a = String(A.a || '');
    for (const q of Q) { const ch = a[q.n - 1]; if (!ch || ch === '-') continue; if (!last[q.n] || last[q.n].at <= (A.at || 0)) last[q.n] = { at: A.at || 0, k: trSt3(q, ch) === 'ok' ? 'ok' : 'sai' }; } }
  const J = tgJ(de).c, t = tgDay();
  return Q.map(q => { const ev = [last[q.n], J[q.n] && { at: J[q.n].at, k: J[q.n].s, fd: J[q.n].fd }].filter(Boolean).sort((a, b) => a.at - b.at).pop();
    const st = ev ? ev.k : 'chua'; return { q, n: q.n, st, due: st === 'fix' && (ev.fd || 0) < t }; }); }
const tgJCount = L => ({ ok: L.filter(c => c.st === 'ok').length, fix: L.filter(c => c.st === 'fix').length, sai: L.filter(c => c.st === 'sai').length, chua: L.filter(c => c.st === 'chua').length, due: L.filter(c => c.due).length, n: L.length });
// việc kế tiếp: thi lại câu đã chữa tới hạn → chữa câu sai → thi lượt mới → chờ ngày mai → chinh phục xong
function tgJNext(de, L) { const due = L.filter(c => c.due), sai = L.filter(c => c.st === 'sai'), chua = L.filter(c => c.st === 'chua');
  if (due.length) return { k: 're', cs: due };
  if (sai.length) return { k: 'fix', cs: sai.slice(0, TG_FIXN) };
  if (chua.length) { const B = trB(de), ck = chua[0].q.ck, c = trCks(B)[ck]; const r0 = trCks(B).find(z => z.p === 'R'); return { k: 'thi', id: 'c' + c.p + ck, c, r0: r0 ? r0.k : 0, n: L.filter(x => x.q.ck === ck).length }; }
  if (L.some(c => c.st === 'fix')) return { k: 'wait', cs: L.filter(c => c.st === 'fix') };
  return { k: 'win' }; }
const tgNs = cs => cs.slice(0, 6).map(c => c.n).join(', ') + (cs.length > 6 ? '…' : '');
let TG_P = null;
async function tgView() { window.CUR = { view: TG_VIEW }; BACK = null; TG_CB = null; TG_HDR = ''; $app.onkeydown = null; scrollTo(0, 0);
  if (!TG_P) { $app.innerHTML = '<div id="ie"></div><p class="mute">Đang tải các đề…</p>'; await toLoad(); try { if (typeof trProbe9 === 'function') await trProbe9(); if (typeof trLkList === 'function') await trLkList(); } catch (e) {} TG_P = await tgPool(); if (window.CUR.view !== TG_VIEW) return; }   // v170: nạp cả đề riêng (Đề 9–16) đã mở mã trên máy
  const D = ((TO && TO.tron) || []).filter(d => TG_P[d.id]), de = tgDe(), L = tgJState(de) || [], C = tgJCount(L), nx = tgJNext(de, L), pct = C.n ? Math.round(C.ok / C.n * 100) : 0;
  const chip = d => { const l = tgJState(d.id) || [], w = l.length && l.every(c => c.st === 'ok'); return `<button class="chip${d.id === de ? ' on' : ''}" data-tgde="${esc(d.id)}" aria-pressed="${d.id === de}">${esc((String(d.t).match(/^Đề\s*\d+/) || [d.t])[0])}${w ? ' 🏆' : ''}</button>`; };
  const nLk = ((typeof TR !== 'undefined' && TR.lk) || []).filter(r => !((TO && TO.tron) || []).some(d => d.id === r.id)).length;
  const cell = c => { const cl = c.st === 'ok' ? 'ok' : c.st === 'sai' ? 'no' : c.st === 'fix' ? 'fx' : 'em', lab = { ok: 'đúng', no: 'cần chữa', fx: c.due ? 'thi lại được' : 'chờ ngày mai', em: 'chưa làm' }[cl];
    return `<span class="trc ${cl}" role="img" aria-label="Câu ${c.n}: ${lab}">${c.n}</span>`; };
  const big = { re: [`▶ Thi lại ${nx.cs ? nx.cs.length : 0} câu đã chữa`, `Câu ${nx.cs ? tgNs(nx.cs) : ''} · đúng thì câu thành 🟩`],
    fix: [`▶ Chữa ${nx.cs ? nx.cs.length : 0} câu sai: câu ${nx.cs ? tgNs(nx.cs) : ''}`, 'Chơi các trò của từng câu rồi xem lời giải · ngày mai thi lại'],
    thi: [`▶ Thi lượt ${nx.c ? nx.c.k - nx.r0 + 1 : ''} · câu ${nx.c ? nx.c.a + '–' + nx.c.b : ''}`, `${nx.n || 0} câu · như đề thật, có giờ · câu sai sẽ được chữa`] }[nx.k];
  const step = big ? `<button class="btnbig" data-tgj="${nx.k}">${big[0]}<small>${big[1]}</small></button>`
    : nx.k === 'wait' ? `<div class="box"><b>✓ Hôm nay xong</b><p style="margin:6px 0 0">Ngày mai thi lại ${nx.cs.length} câu đã chữa (câu ${tgNs(nx.cs)}). Đúng ở ngày sau mới tính là nhớ, không phải nhớ tạm.</p></div>`
    : `<div class="box tgyes"><b>🏆 Đã chinh phục ${esc(trName(de))}: đúng hết ${C.n} câu Phần Đọc</b><p style="margin:6px 0 0">Làm lại cả Phần Đọc 75 phút để xác nhận, rồi chọn đề khác. Lưu ý: điểm của đề đã chinh phục cao hơn thực lực; trình độ thật đo bằng đề chưa làm.</p></div><button class="pri" data-tgj="full">▶ Làm lại cả Phần Đọc · 75 phút</button>`;
  $app.innerHTML = `<div id="ie"></div><div class="row top"><button class="link tap" data-tgb>‹ TOEIC</button></div>
    <h1>🗺 Chinh phục đề</h1><p class="mute" style="margin-top:0">Đích: làm <b>${esc(trName(de))}</b> đúng hết ${C.n} câu Phần Đọc. Thi từng lượt 10 câu, chữa câu sai bằng trò chơi, ngày sau thi lại.</p>
    <p class="tgs" style="margin-top:4px">Chọn đề</p><div class="chips tap">${D.map(chip).join('')}</div>
    ${nLk ? `<button data-tgopen>🔓 Mở thêm ${nLk} đề riêng (cần mã)</button>` : ''}
    <div class="box"><b style="font-size:18px">🏆 ${C.ok}/${C.n} câu đã chinh phục</b><div class="bar"><i style="width:${pct}%;background:var(--good)"></i></div>
      <p class="mute" style="margin:4px 0 0">🟩 ${C.ok} đúng · 🟨 ${C.fix} chờ thi lại · 🟥 ${C.sai} cần chữa · ⬜ ${C.chua} chưa làm</p></div>
    ${step}
    <details class="more"><summary>Bản đồ 100 câu</summary><div class="trgrid tgmap">${L.map(cell).join('')}</div></details>
    <p class="mute" style="font-size:14px">Không tính vào điểm đề thử trọn, 📘 Học hay 🔁 Nhớ.</p>`;
  $app.onclick = e => { if (e.target.closest('[data-tgb]')) { EX_PART = 'san'; toeicView(); return; }
    const c = e.target.closest('[data-tgde]'); if (c) { tgSt().de = c.dataset.tgde; save(); tgView(); return; }
    if (e.target.closest('[data-tgopen]')) return trLkAll(() => { TG_P = null; tgView(); });
    const b = e.target.closest('[data-tgj]'); if (!b) return; const k = b.dataset.tgj;
    if (k === 'thi') { TG_J = de; return trStart(de, nx.id); }
    if (k === 'full') { TG_J = de; return trStart(de, 'R'); }
    if (k === 'fix') return tgFix(de, nx.cs);
    if (k === 're') return tgRe(de, nx.cs); }; }
// ② chữa: mỗi câu sai chơi các trò làm từ chính câu đó, trò kiến thức trước, Bắn nhiễu (có lời giải đầy đủ) sau cùng
function tgFix(de, cs) { const G = TG_P[de], ns = new Set(cs.map(c => c.n)), of = g => (G[g] || []).filter(x => ns.has(x.q.n)), steps = [];
  if (of('ho').length) steps.push(['ho', of('ho')]); if (of('noi').length) steps.push(['noi', of('noi')]);
  for (const set of [...new Set(of('dt').map(x => x.set))]) steps.push(['dt', of('dt').filter(x => x.set === set)]);
  if (of('pair').length >= 2) steps.push(['pair', of('pair')]); if (of('cum').length >= 2) steps.push(['cum', shuf(of('cum')).slice(0, TG_N)]);
  if (of('ban').length) steps.push(['ban', of('ban')]);
  TG_HDR = `🔧 Chữa câu ${tgNs(cs)} · bước `; const J = tgJ(de).c, fin = () => { const t = tgDay(), now = Date.now(); for (const c of cs) J[c.n] = { s: 'fix', at: now, fd: t }; save(); TG_HDR = ''; window.CUR = { view: 'tg-xong' };
    $app.innerHTML = `<div id="ie"></div><h2>🔧 Đã chữa ${cs.length} câu</h2><div class="box tgyes"><p style="margin:0">Câu ${tgNs(cs)} chuyển 🟨. <b>Ngày mai</b> thi lại đúng các câu này: đúng thì thành 🟩.</p></div><button class="pri" data-tgv>▶ Về hành trình</button>`;
    $app.onclick = null; scrollTo(0, 0); };
  if (!steps.length) return fin();
  const go = i => { if (i >= steps.length) { TG_CB = null; return fin(); } const [g, its] = steps[i]; TG_HDR = `🔧 Chữa câu ${tgNs(cs)} · bước ${i + 1}/${steps.length}`; TG_CB = () => go(i + 1);
    g === 'dt' ? tgDt(its, 'j') : ({ pair: tgMatch, cum: tgMatch, ho: tgHo, noi: tgNoi, ban: tgBan })[g](g, its, 'j'); };
  go(0); }
// ③ thi lại: đúng câu của đề, như đề thật (phương án theo thứ tự của đề), không gợi ý; xong mỗi câu hiện lời giải
function tgRe(de, cs) { window.CUR = { view: TG_VIEW + '-re' }; const J = tgJ(de).c, G = { i: 0, res: null, ok: 0 };
  const ctx = q => q.sec === 'p6' ? q.head.replace(/<p class="mute">[^<]*<\/p>/, '') + `<p><b>${q.q}</b></p>` : q.sec === 'p7' ? `<p style="font-size:17px"><b>${q.q}</b></p>` : `<p style="font-size:18px;line-height:1.6">${q.q}</p>`;
  const draw = () => { const q = cs[G.i].q, head = `<div id="ie"></div><div class="row top"><button class="link tap" data-tgv>‹ Hành trình</button><span class="mute">${esc(trName(de))} · câu ${q.n}</span></div><h2 style="margin:4px 0 8px">🔁 Thi lại ${G.i + 1}/${cs.length}</h2>`;
    if (G.res) { $app.innerHTML = head + (q.sec === 'p6' ? ctx(q) : '') + tgReveal(q, G.res) + (q.sec === 'p7' ? q.foot : ''); return; }
    $app.innerHTML = head + ctx(q) + q.opts.map((o, k) => `<button class="tcc" data-tgf="${k}">${'ABCD'[k]}. ${esc(o)}</button>`).join('') + (q.sec === 'p7' ? q.foot : ''); };
  $app.onclick = e => { if (e.target.closest('[data-tgv]')) return tgView(); const q = cs[G.i].q;
    const f = e.target.closest('[data-tgf]'); if (f && !G.res) { const o = q.opts[+f.dataset.tgf], ok = o === q.a; if (ok) G.ok++; J[q.n] = { s: ok ? 'ok' : 'sai', at: Date.now() }; save();
      G.res = { ok, note: ok ? `Câu ${q.n} thành 🟩.` : `Bạn chọn “${esc(o)}”. Câu ${q.n} quay lại 🟥 để chữa lại.`, last: G.i + 1 >= cs.length }; draw(); scrollTo(0, 0); return; }
    if (e.target.closest('[data-tgn]')) { if (G.i + 1 >= cs.length) { window.CUR = { view: 'tg-xong' }; $app.innerHTML = `<div id="ie"></div><h2>🔁 Thi lại xong</h2><div class="box ${G.ok === cs.length ? 'tgyes' : ''}"><b style="font-size:20px">${G.ok}/${cs.length} câu đúng</b></div><button class="pri" data-tgv>▶ Về hành trình</button>`; $app.onclick = null; return scrollTo(0, 0); }
      G.i++; G.res = null; draw(); scrollTo(0, 0); } };
  draw(); }

// ---------- 🔁 Săn cặp / 🔗 Cụm hay dùng: ghép L ↔ R ----------
const TG_LR = { pair: ['📖 Trong bài', '✅ Trong đáp án', 'Chạm một dòng "Trong bài", rồi chạm dòng "Trong đáp án" cùng ý.'], cum: ['🇬🇧 Cụm tiếng Anh', '🇻🇳 Nghĩa', 'Chạm một cụm tiếng Anh, rồi chạm nghĩa của nó.'] };
function tgMatch(g, its, mode) { window.CUR = { view: TG_VIEW + '-' + g }; const lab = TG_LR[g], P = tgProg(TG_P[tgDe()][g]);
  const G = { R: shuf(its.map((_, i) => i)), sl: -1, sr: -1, done: new Set(), miss: new Set(), t0: Date.now(), msg: '' };
  const draw = () => { $app.innerHTML = tgHead(g, Math.min(P.pl + G.done.size, P.n), P.n) + `<p class="mute" style="margin-top:0">${lab[2]}</p><div aria-live="polite">${G.msg}</div>
      <p class="tgs">${lab[0]}</p>${its.map((x, i) => `<button class="tcc${G.done.has(i) ? ' ok' : G.sl === i ? ' sel' : ''}" data-tgl="${i}"${G.done.has(i) ? ' disabled' : ''}>${esc(x.L)}</button>`).join('')}
      <p class="tgs">${lab[1]}</p>${G.R.map(i => `<button class="tcc${G.done.has(i) ? ' ok' : G.sr === i ? ' sel' : ''}" data-tgr="${i}"${G.done.has(i) ? ' disabled' : ''}>${esc(its[i].R)}</button>`).join('')}`; };
  const check = () => { const i = G.sl, j = G.sr; if (i < 0 || j < 0) return; G.sl = G.sr = -1;
    if (i === j) { G.done.add(i); if (!G.miss.has(i)) tgMark(g, its[i], true); G.msg = '';
      if (G.done.size === its.length) { save(); return tgEnd(g, its.map((x, k) => ({ x, ok: !G.miss.has(k) })), mode, Date.now() - G.t0); } }
    else { const a = its[i], b = its[j]; if (!G.miss.has(i)) { G.miss.add(i); tgMark(g, a, false); }
      G.msg = g === 'cum' ? `<div class="box tcno"><b>✗ Chưa khớp</b><p style="margin:6px 0 0">“${esc(b.L)}” = ${esc(b.R)}</p></div>`
        : `<div class="box tcno"><b>✗ Chưa khớp</b><p style="margin:6px 0 0">“${esc(a.L)}”${a.vL ? `<br><span class="mute">= ${esc(a.vL)}</span>` : ''}</p><p style="margin:6px 0 0">“${esc(b.R)}”${b.vR ? `<br><span class="mute">= ${esc(b.vR)}</span>` : ''}</p></div>`; }
    save(); draw(); };
  $app.onclick = e => { if (tgBack(e)) return; const l = e.target.closest('[data-tgl]'), r = e.target.closest('[data-tgr]');
    if (l && !l.disabled) { G.sl = +l.dataset.tgl; draw(); check(); } else if (r && !r.disabled) { G.sr = +r.dataset.tgr; draw(); check(); } };
  draw(); }

// ---------- 🏃 Đua dò tin: một bộ văn bản Part 7, chạm câu chứa đáp án của từng câu hỏi ----------
function tgDt(its, mode) { window.CUR = { view: TG_VIEW + '-dt' }; const P = tgProg(TG_P[tgDe()].dt), G = { i: 0, res: [], t0: Date.now(), tq: Date.now(), pick: null };
  const draw = () => { const x = its[G.i], q = x.q, done = G.pick != null, ok = G.res[G.i] && G.res[G.i].ok;
    const sent = (s, k) => { const hit = tgHit(s, q.ev), me = G.pick === k; return `<button class="tcc tgsn${done && hit ? ' ok' : me && !hit ? ' no' : ''}" data-tgs="${k}"${done ? ' disabled' : ''}>${esc(s)}</button>`; };
    let k = 0; const docs = x.docs.map(dc => `<p class="tgs">${esc(dc.title || 'Văn bản')}</p>${dc.ss.map(s => sent(s, k++)).join('')}`).join('');
    $app.innerHTML = tgHead('dt', Math.min(P.pl + G.i + (done ? 1 : 0), P.n), P.n) + `<div class="box tgq"><p class="mute" style="margin:0">Câu ${G.i + 1}/${its.length} của bộ này · ⏱ chạm câu chứa đáp án</p><p style="margin:4px 0 0;font-size:17px"><b>${q.q}</b></p>
      ${done ? `<p style="margin:8px 0 0">${ok ? '✓ Đúng' : '✗ Chưa đúng'} · đáp án: <b>${esc(q.a)}</b> · ${G.res[G.i].s} giây</p><button class="pri" data-tgn>${G.i + 1 < its.length ? 'Câu tiếp ›' : 'Xem kết quả'}</button>` : ''}</div>${docs}`;
    if (done) scrollTo(0, 0); };
  $app.onclick = e => { if (tgBack(e)) return; const s = e.target.closest('[data-tgs]'), x = its[G.i];
    if (s && G.pick == null) { G.pick = +s.dataset.tgs; const ss = x.docs.flatMap(d => d.ss), ok = tgHit(ss[G.pick], x.q.ev); G.res[G.i] = { x, ok, s: Math.round((Date.now() - G.tq) / 1000) }; tgMark('dt', x, ok); save(); draw(); return; }
    if (e.target.closest('[data-tgn]')) { if (G.i + 1 >= its.length) return tgEnd('dt', G.res, mode, Date.now() - G.t0); G.i++; G.pick = null; G.tq = Date.now(); draw(); scrollTo(0, 0); } };
  draw(); }

// ---------- 🧩 Họ từ ----------
function tgHo(g, its, mode) { window.CUR = { view: TG_VIEW + '-ho' }; const P = tgProg(TG_P[tgDe()].ho), G = { i: 0, step: 0, ok: [], res: null, t0: Date.now() };
  const cur = () => its[G.i], typ = x => ((tgSt().it[x.id] || {}).b || 0) >= 1;
  const draw = () => { const x = cur(), q = x.q, lg = q.lg, head = tgHead('ho', Math.min(P.pl + G.i + 1, P.n), P.n);
    if (G.step === 0 && x.ask) { $app.innerHTML = head + `<p class="mute" style="margin-top:0">Bước 1 · Nhận ra loại từ</p><p style="font-size:19px"><b>Từ nào là ${x.ask}?</b></p>${q.opts.map(o => `<button class="tcc" data-tga="${esc(o)}">${esc(o)}</button>`).join('')}`; return; }
    if (!G.res) { const t = typ(x); $app.innerHTML = head + `<p class="mute" style="margin-top:0">Bước 2 · ${t ? 'Tự gõ dạng đúng' : 'Chọn dạng đúng'} điền vào chỗ trống</p><p style="font-size:18px;line-height:1.6">${q.q}</p>`
      + (t ? `<p class="mute">Gợi ý: bắt đầu bằng “${esc(q.a[0])}”, ${q.a.length} chữ cái.</p><input class="tin" data-tgi autocomplete="off" autocapitalize="off" spellcheck="false" style="width:100%"><button class="pri" data-tgk>Kiểm</button>`
        : q.opts.map(o => `<button class="tcc" data-tgf="${esc(o)}">${esc(o)}</button>`).join('')); if (t) setTimeout(() => { const i = document.querySelector('[data-tgi]'); i && i.focus(); }, 50); return; }
    $app.innerHTML = head + tgReveal(q, G.res);
  };
  const fin = (ok, note) => { const x = cur(); ok = ok && G.s1 !== false; note = [G.n1, note].filter(Boolean).join('<br>'); G.ok[G.i] = ok; tgMark('ho', x, ok); save(); G.res = { ok, note, last: G.i + 1 >= its.length }; draw(); };
  $app.onclick = e => { if (tgBack(e)) return; const x = cur(), q = x.q;
    const a = e.target.closest('[data-tga]'); if (a) { G.s1 = a.dataset.tga === q.a; G.n1 = G.s1 ? '' : `Bước 1: “${esc(a.dataset.tga)}” là ${esc(q.lg.og[a.dataset.tga])}; ${x.ask} là “${esc(q.a)}”.`; G.step = 1; draw(); return; }
    const f = e.target.closest('[data-tgf]'); if (f) return fin(f.dataset.tgf === q.a, f.dataset.tgf === q.a ? '' : `Bạn chọn “${esc(f.dataset.tgf)}”.`);
    if (e.target.closest('[data-tgk]')) { const v = (document.querySelector('[data-tgi]') || {}).value || ''; const ok = v.trim().toLowerCase() === q.a.toLowerCase(); return fin(ok, ok ? '' : `Bạn gõ “${esc(v.trim())}”.`); }
    if (e.target.closest('[data-tgn]')) { if (G.i + 1 >= its.length) { $app.onkeydown = null; return tgEnd('ho', its.map((x, i) => ({ x, ok: G.ok[i] })), mode, Date.now() - G.t0); } G.i++; G.step = 0; G.res = null; G.s1 = undefined; G.n1 = ''; draw(); } };
  $app.onkeydown = e => { if (e.key === 'Enter' && e.target.matches && e.target.matches('[data-tgi]')) { e.preventDefault(); const b = document.querySelector('[data-tgk]'); b && b.click(); } };
  draw(); }
// ô kết quả một câu Part 5 / 6: đúng / sai, câu có đáp án, nghĩa 4 phương án, vì sao, cấu trúc, dịch
function tgReveal(q, r) { const lg = q.lg || {}, og = lg.og || {}, sent = q.sec === 'p6' ? '' : q.sec === 'p7' ? `<p style="font-size:17px"><b>${q.q}</b> <span class="mute">· ✓ ${esc(q.a)}</span></p>` : `<p style="font-size:17px;line-height:1.6">${q.q.replace('<b>-------</b>', `<b>${esc(q.a)}</b>`)}</p>`;
  return `<div class="box ${r.ok ? 'tgyes' : 'tcno'}"><b>${r.ok ? '✓ Đúng' : '✗ Chưa đúng'}</b>${r.note ? `<p style="margin:4px 0 0">${r.note}</p>` : ''}</div>${sent}
    <div class="box">${q.opts.map(o => `<p style="margin:4px 0"><b>${esc(o)}</b>${o === q.a ? ' ✓' : ''}${og[o] ? ` · <span class="mute">${esc(og[o])}</span>` : ''}</p>`).join('')}</div>
    <div class="box rvgt"><p style="margin:0"><b>Vì sao:</b> ${esc(lg.ly || q.why || '')}</p>${lg.ct ? `<p style="margin:6px 0 0"><b>Cấu trúc:</b> ${esc(lg.ct)}</p>` : ''}${lg.dich ? `<p style="margin:6px 0 0"><b>Dịch:</b> ${esc(lg.dich)}</p>` : ''}</div>
    <button class="pri" data-tgn>${r.last ? 'Xem kết quả' : 'Câu tiếp ›'}</button>`; }

// ---------- 🔀 Từ nối: ① quan hệ hai vế (khi biết loại của đáp án) ② chọn từ ----------
function tgNoi(g, its, mode) { window.CUR = { view: TG_VIEW + '-noi' }; const P = tgProg(TG_P[tgDe()].noi), G = { i: 0, step: 0, ok: [], res: null, t0: Date.now() }, cats = Object.keys(TG_CAT);
  const ctx = q => q.sec === 'p6' ? q.head.replace(/<p class="mute">[^<]*<\/p>/, '') : `<p style="font-size:18px;line-height:1.6">${q.q}</p>`;
  const draw = () => { const x = its[G.i], q = x.q, head = tgHead('noi', Math.min(P.pl + G.i + 1, P.n), P.n);
    if (G.res) { $app.innerHTML = head + (q.sec === 'p6' ? ctx(q) : '') + tgReveal(q, G.res) + (x.cat ? `<p class="mute">Quan hệ: ${x.cat}</p>` : ''); return; }
    if (G.step === 0 && x.cat) { G.co = G.co || shuf([x.cat, ...shuf(cats.filter(c => c !== x.cat)).slice(0, 3)]);
      $app.innerHTML = head + `<p class="mute" style="margin-top:0">Bước 1 · Hai vế quanh chỗ trống có quan hệ gì?</p>${ctx(q)}${G.co.map(c => `<button class="tcc" data-tgc="${esc(c)}">${esc(c[0].toUpperCase() + c.slice(1))}</button>`).join('')}`; return; }
    $app.innerHTML = head + `<p class="mute" style="margin-top:0">${x.cat ? 'Bước 2 · ' : ''}Chọn từ điền vào chỗ trống</p>${ctx(q)}${q.opts.map(o => `<button class="tcc" data-tgf="${esc(o)}">${esc(o)}</button>`).join('')}`; };
  $app.onclick = e => { if (tgBack(e)) return; const x = its[G.i], q = x.q;
    const c = e.target.closest('[data-tgc]'); if (c) { G.s1 = c.dataset.tgc === x.cat; G.step = 1; draw(); return; }
    const f = e.target.closest('[data-tgf]'); if (f) { const ok = f.dataset.tgf === q.a && G.s1 !== false; G.ok[G.i] = ok; tgMark('noi', x, ok); save();
      G.res = { ok, note: f.dataset.tgf === q.a ? (G.s1 === false ? `Chọn đúng từ, nhưng nhận sai quan hệ: hai vế có quan hệ ${x.cat}.` : '') : `Bạn chọn “${esc(f.dataset.tgf)}”.`, last: G.i + 1 >= its.length }; draw(); scrollTo(0, 0); return; }
    if (e.target.closest('[data-tgn]')) { if (G.i + 1 >= its.length) return tgEnd('noi', its.map((x, i) => ({ x, ok: G.ok[i] })), mode, Date.now() - G.t0); G.i++; G.step = 0; G.res = null; G.s1 = undefined; G.co = null; draw(); scrollTo(0, 0); } };
  draw(); }

// ---------- 🎯 Bắn nhiễu: chạm 3 phương án sai, chạm trúng đáp án là thua ----------
function tgBan(g, its, mode) { window.CUR = { view: TG_VIEW + '-ban' }; const P = tgProg(TG_P[tgDe()].ban), G = { i: 0, shot: [], ok: [], res: null, t0: Date.now() };
  const draw = () => { const x = its[G.i], q = x.q, og = q.lg.og, head = tgHead('ban', Math.min(P.pl + G.i + 1, P.n), P.n);
    if (G.res) { $app.innerHTML = head + tgReveal(q, G.res); return; }
    $app.innerHTML = head + `<p class="mute" style="margin-top:0">Chạm từng phương án SAI để loại. Còn ${3 - G.shot.length} phương án sai.</p>${q.sec === 'p6' ? q.head.replace(/<p class="mute">[^<]*<\/p>/, '') + `<p><b>${q.q}</b></p>` : q.sec === 'p7' ? `<p style="font-size:17px"><b>${q.q}</b></p>` : `<p style="font-size:18px;line-height:1.6">${q.q}</p>`}
      ${q.opts.map(o => G.shot.includes(o) ? `<div class="tcc tgout"><s>${esc(o)}</s><br><small class="mute">${esc(og[o])}</small></div>` : `<button class="tcc" data-tgf="${esc(o)}">🎯 ${esc(o)}</button>`).join('')}${q.sec === 'p7' ? q.foot : ''}`; };
  $app.onclick = e => { if (tgBack(e)) return; const x = its[G.i], q = x.q;
    const f = e.target.closest('[data-tgf]'); if (f) { const o = f.dataset.tgf;
      if (o === q.a) { G.ok[G.i] = false; tgMark('ban', x, false); save(); G.res = { ok: false, note: `“${esc(o)}” là đáp án đúng, không được loại.`, last: G.i + 1 >= its.length }; draw(); return; }
      G.shot.push(o); if (G.shot.length === 3) { G.ok[G.i] = true; tgMark('ban', x, true); save(); G.res = { ok: true, note: `Còn lại “${esc(q.a)}” là đáp án.`, last: G.i + 1 >= its.length }; } draw(); return; }
    if (e.target.closest('[data-tgn]')) { if (G.i + 1 >= its.length) return tgEnd('ban', its.map((x, i) => ({ x, ok: G.ok[i] })), mode, Date.now() - G.t0); G.i++; G.shot = []; G.res = null; draw(); scrollTo(0, 0); } };
  draw(); }

// hết một trò: trong buổi chữa thì sang trò kế tiếp; ngoài buổi chữa (không còn lối vào riêng từ v169) thì về hành trình
function tgEnd(g, res) { const st = tgSt().st; (st[g] = st[g] || { r: 0, q: 0, ok: 0, rv: 0, rvok: 0 }).r++; save(); scrollTo(0, 0);
  if (TG_CB) { const cb = TG_CB; TG_CB = null; return cb(res); } tgView(); }

// lối vào ở màn TOEIC (phần 📚 Đề có sẵn), cạnh đề thử trọn
function tgRow() { if (typeof TO === 'undefined' || !TO || !(TO.tron || []).length) return '';
  return `<div class="box hcard" style="margin:12px 0 0"><button class="hrow" data-tgv><span class="ic">🗺</span><span class="t"><b>Chinh phục đề</b><small>Trò chơi đưa bạn tới làm đúng hết Phần Đọc của một đề</small></span><span class="chev">›</span></button></div>`; }
document.addEventListener('click', e => { if (S && e.target.closest('[data-tgv]') && !String((window.CUR || {}).view).startsWith(TG_VIEW)) { TG_P = null; tgView(); } });
// thi lượt mở từ hành trình: màn kết quả có nút về hành trình
if (typeof trResOne === 'function') { const _trResOne = trResOne; trResOne = function (rec) { const r = _trResOne.apply(this, arguments);
  if (TG_J && rec && rec.de === TG_J) { const h = $app.querySelector && $app.querySelector('h1'); if (h) h.insertAdjacentHTML('afterend', '<button class="pri" data-tgv style="margin:8px 0">🗺 Về hành trình · chữa câu sai</button>'); } return r; }; }
