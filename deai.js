// ---------- 🎯 Luyện đề do AI soạn và chấm (v141, 7/11/2026) ----------
// Người sáng lập: "thêm 1 mục luyện đề theo mục tiêu để kế bên mục học. Ở mục này thì AI sẽ tạo bài để làm rồi chấm điểm"; chọn "AI soạn mọi đề",
// tab thứ 5 cạnh 📚 Học, kỳ thi theo mục tiêu, không giới hạn lượt mỗi người (trần chung 200 lượt / ngày cả app ở máy chủ).
// Đặc tả: specs/003-luyen-de-ai/. Máy chủ: supabase/functions/de-ai (soạn nền, máy kiểm khuôn, chống trùng, AI khác giải kiểm chéo); bảng de_ai giữ đề lâu dài.
// Trang: gọi de-ai → nhận mã đề → hỏi trạng thái mỗi 3 giây (tối đa 160 giây) → làm đề bằng bộ chạy câu hỏi có sẵn (ieRun, ielts.js) / ieWrite / ieSpeak.
// Câu Đọc / Nghe / câu lẻ chấm bằng đáp án AI đưa; Viết / Nói chấm bằng AI (el-cham, thi.js aiBtn). Kết quả ghi S.dai (nhỏ) + bản đồ kỳ thi nguồn 'ai'.
// KHÔNG tính luật đo CEFR (không tạo thẻ, không đụng S.cards / S.units / S.exams). Mọi đề / lời chấm ghi "AI soạn, chưa giáo viên kiểm".
const DAI_POLL = 3000, DAI_WAIT = 160000, DAI_MAX_R = 100, DAI_DU_D = 7, DAI_MO_H = 24, DAI_DU_N = 2;   // DAI_DU_N (v142): số đề AI cùng dạng trong ngày để soạn sẵn đề kế tiếp
const DAI = { tk: {}, cur: null };   // tk: id → đang hỏi trạng thái; cur: id đề đang chờ ở màn chờ
const daiSt = () => { const o = (S.dai = S.dai || {}); o.r = o.r || []; o.du = o.du || {}; o.wait = o.wait || {}; if (!('mo' in o)) o.mo = null; return o; };
const DAI_EX = { ielts: 'IELTS', toeic: 'TOEIC', cefr: 'Cambridge' };
const DAI_SKN = { R: ['📰', 'Đọc'], L: ['🎧', 'Nghe'], W: ['✍️', 'Viết'], S: ['🗣', 'Nói'] };
// dạng đề AI soạn được, theo kỳ thi × kỹ năng: [dạng, khoá kỹ năng ở máy chủ, tên]
// v144 (specs/006-de-ai-bam-de-that, người sáng lập: "đề do AI tạo có bám sát cấu trúc đề thực tế chưa, nếu chưa thì chỉnh sửa"): khuôn từng dạng theo đề thật ở máy chủ
// (supabase/functions/de-ai/khuon.js); tên ghi phần của đề thật. Cambridge theo cấp (cấp "+" như cấp gốc); Pre-A1 / A1 chỉ dạng chữ có trong đề Starters / Movers, không có Viết AI.
const DAI_CB = {
  pre: { R: [['box', 'doc', 'Phần 4: điền từ trong khung']], L: [['name', 'nghe', 'Phần 2: nghe viết tên, số']], W: [], S: [['p1', 'noi', 'Câu hỏi về bạn']] },
  a1: { R: [['resp', 'doc', 'Phần 2: chọn câu đáp'], ['story', 'doc', 'Phần 3: điền truyện (khung từ)'], ['cloze', 'doc', 'Phần 4: điền trắc nghiệm'], ['comp', 'doc', 'Phần 5: đọc truyện, điền 1–3 từ']],
    L: [['name', 'nghe', 'Phần 2: nghe viết tên, số, từ']], W: [], S: [['p1', 'noi', 'Câu hỏi về bạn']] },
  a2: { R: [['sn', 'doc', 'Phần 1: tin ngắn'], ['mc', 'doc', 'Phần 3: bài đọc trắc nghiệm'], ['cloze', 'doc', 'Phần 4: điền trắc nghiệm'], ['open', 'doc', 'Phần 5: điền từ']],
    L: [['gap', 'nghe', 'Phần 2: nghe điền'], ['mc', 'nghe', 'Phần 3: hội thoại trắc nghiệm']], W: [['w', 'viet', 'Phần 6: viết email']], S: [['p1', 'noi', 'Phần 1: phỏng vấn']] },
  b1: { R: [['sn', 'doc', 'Phần 1: tin ngắn'], ['mc', 'doc', 'Phần 3: bài đọc trắc nghiệm'], ['cloze', 'doc', 'Phần 5: điền trắc nghiệm'], ['open', 'doc', 'Phần 6: điền từ']],
    L: [['gap', 'nghe', 'Phần 3: nghe điền'], ['mc', 'nghe', 'Phần 4: phỏng vấn trắc nghiệm']], W: [['w', 'viet', 'Phần 1, 2: email hoặc bài báo']], S: [['p1', 'noi', 'Phần 1: phỏng vấn']] } };
const daiCbHi = (w, l) => ({ R: [['cloze', 'doc', 'Phần 1: điền trắc nghiệm'], ['open', 'doc', 'Phần 2: điền từ'], ['wf', 'doc', 'Phần 3: tạo dạng từ'], ['kwt', 'doc', 'Phần 4: viết lại câu'], ['mc', 'doc', 'Phần 5: bài đọc trắc nghiệm']],
  L: [['gap', 'nghe', 'Phần 2: nghe điền câu'], ['mc', 'nghe', l]], W: [['w', 'viet', w]], S: [['p1', 'noi', 'Phần 1: phỏng vấn']] });
DAI_CB.b2 = daiCbHi('Phần 1: bài luận', 'Phần 4: phỏng vấn trắc nghiệm'); DAI_CB.c1 = daiCbHi('Phần 1: bài luận', 'Phần 3: phỏng vấn trắc nghiệm'); DAI_CB.c2 = daiCbHi('Phần 2: bài báo, báo cáo, nhận xét', 'Phần 3: phỏng vấn trắc nghiệm');
const DAI_OLD = { 'L-sa': 'Trả lời ngắn', mc: 'Trắc nghiệm', w: 'Bài viết theo đề', '*': 'Mọi dạng' };   // dạng của đề cũ (trước v144) không còn cho chọn
function daiDangs(k, S0, lv) { const gt = k === 'ielts' && ieSt().type === 'gt';
  if (k === 'ielts') return ({ R: [['R-tf', 'doc', 'TRUE / FALSE / NOT GIVEN'], ['R-yn', 'doc', 'YES / NO / NOT GIVEN'], ['R-mc', 'doc', 'Trắc nghiệm'], ['R-comp', 'doc', 'Điền câu'], ['R-sa', 'doc', 'Trả lời ngắn'], ['R-h', 'doc', 'Nối tiêu đề'], ['R-mi', 'doc', 'Tìm đoạn chứa ý'],
      ['R-mf', 'doc', 'Nối đặc điểm'], ['R-se', 'doc', 'Nối nửa câu'], ['R-sum', 'doc', 'Tóm tắt có khung từ'], ['R-dia', 'doc', 'Điền ghi chú, bảng, lưu đồ'], ...(gt ? [['R-gt', 'doc', 'Section 1: văn bản đời thường']] : [])],
    L: [['L-form', 'nghe', 'Part 1: hội thoại, điền phiếu'], ['L-match', 'nghe', 'Part 2: độc thoại, nối + trắc nghiệm'], ['L-mc', 'nghe', 'Part 3: thảo luận, trắc nghiệm'], ['L-note', 'nghe', 'Part 4: bài giảng, ghi chú']],
    W: gt ? [['gt1', 'viet', 'Task 1: viết thư'], ['t2', 'viet', 'Task 2: bài luận']] : [['t1', 'viet', 'Task 1: biểu đồ, bảng số liệu'], ['t2', 'viet', 'Task 2: bài luận']],
    S: [['p1', 'noi', 'Part 1: 3 chủ đề'], ['p2', 'noi', 'Part 2 + 3: nói dài, bàn luận']] })[S0] || [];
  if (k === 'toeic') return ({ R: [['p5', 'np', 'Part 5: điền câu'], ['p6', 'np', 'Part 6: điền đoạn'], ['p7', 'doc', 'Part 7: đọc hiểu']], L: [['p2', 'nghe', 'Part 2: hỏi – đáp'], ['p3', 'nghe', 'Part 3: hội thoại'], ['p4', 'nghe', 'Part 4: bài nói ngắn']] })[S0] || [];
  return (DAI_CB[String(daiCbLv(lv)).replace(/p$/, '')] || DAI_CB.a2)[S0] || []; }
// v144: chỉ kỹ năng có dạng AI (Pre-A1 / A1 không có Viết)
const daiSks = (k, lv) => (k === 'toeic' ? ['R', 'L'] : ['R', 'L', 'W', 'S']).filter(s => daiDangs(k, s, lv).length);
// cấp Cambridge: mục tiêu Cambridge → cấp mục tiêu; 📈 Giỏi lên → cấp đang học; không có mục tiêu → cấp đang xem ở màn Cambridge
function daiCbLv(lv) { if (lv && OV_LV.includes(lv)) return lv; const g = S.lt && S.lt.goal, k = g && typeof ltKind === 'function' ? ltKind(g) : null;
  if (k === 'cambridge' && typeof ltGoalLv === 'function') return ltGoalLv(g); if (k === 'cefr') return ovStage();
  return (typeof CB_LV !== 'undefined' && CB_LV) || ovStage(); }
function daiKy(k, lv) { if (k === 'ielts') return { ky: 'ielts-' + (ieSt().type === 'gt' ? 'gt' : 'ac'), muc: String(ieSt().target) };
  if (k === 'toeic') return { ky: 'toeic', muc: String(toSt().target) }; lv = daiCbLv(lv); return { ky: 'cb-' + lv, muc: lv, lv }; }
const daiKOf = ky => ky.startsWith('ielts') ? 'ielts' : ky === 'toeic' ? 'toeic' : 'cefr';
const DAI_SKOF = { doc: 'R', np: 'R', nghe: 'L', viet: 'W', noi: 'S' };
const daiSOf = (k, dang, lv, sk) => daiSks(k, lv).find(s => daiDangs(k, s, lv).some(d => d[0] === dang)) || DAI_SKOF[sk] || 'R';
const daiName = (k, dang, lv, sk) => { for (const s of daiSks(k, lv)) { const d = daiDangs(k, s, lv).find(x => x[0] === dang); if (d) return `${DAI_SKN[s][1]} · ${d[2]}`; } const s = DAI_SKOF[sk]; return (s ? DAI_SKN[s][1] + ' · ' : '') + (DAI_OLD[dang] || dang); };
// tỉ lệ đúng gần đây của một dạng trên bản đồ kỳ thi (IELTS S.ie.ty, TOEIC S.to.ty) + số đề AI đã làm
function daiStat(k, ky, dang) { const T = k === 'ielts' ? (S.ie || {}).ty || {} : k === 'toeic' ? (S.to || {}).ty || {} : {}, a = (T[dang] || []).slice(-10), n = a.reduce((s, b) => s + b.n, 0);
  return { n, pct: n ? Math.round(a.reduce((s, b) => s + b.ok, 0) / n * 100) : null, ai: daiSt().r.filter(r => r.ky === ky && r.dang === dang).length }; }
// việc nên làm: đề dự trữ có sẵn → dạng yếu chắc (≥ 4 câu, < 75%) → dạng làm ít nhất (đọc, nghe trước viết, nói)
function daiPick(k, lv, only) { const { ky } = daiKy(k, lv), o = daiSt(), all = [];
  for (const s of only ? [only] : daiSks(k, lv)) for (const [dang, sk, t] of daiDangs(k, s, lv)) all.push({ s, dang, sk, t, ...daiStat(k, ky, dang), du: !!o.du[ky + '|' + dang] });
  if (!all.length) return null; const du = all.find(x => x.du); if (du) return { ...du, why: 'sẵn sàng' };
  const weak = all.filter(x => x.n >= 4 && x.pct < 75).sort((a, b) => a.pct - b.pct)[0]; if (weak) return { ...weak, why: `đang yếu · ${weak.pct}%` };
  return { ...all.slice().sort((a, b) => a.ai - b.ai)[0], why: '' }; }

// ---------- ô 🤖 ở màn kỳ thi, hàng 🤖 ở màn kỹ năng ----------
function daiBox(k, lv) { const o = daiSt(), p = daiPick(k, lv), { ky } = daiKy(k, lv), done = o.r.filter(r => daiKOf(r.ky) === k).length;
  const W = Object.entries(o.wait).filter(([, w]) => w.ky === ky), now = Date.now(); for (const [, w] of W) if (w.st === 'dang' && now - w.at < DAI_WAIT) daiWatch(w.id);
  if (!p) return '';
  return `<div class="box dai"><b>🤖 Đề mới do AI soạn</b>
    ${o.mo && o.mo.ky === ky && Date.now() - o.mo.at < DAI_MO_H * 3600e3 && !o.r.some(r => r.id === o.mo.id) ? `<button class="hrow" data-daiopen="${esc(o.mo.id)}"><span class="ic">↩️</span><span class="t"><b>Làm tiếp đề đang dở</b><small>${esc(daiName(k, o.mo.dang, lv))} · làm lại từ câu 1</small></span><span class="chev">›</span></button>` : ''}
    ${W.map(([key, w]) => w.st === 'xong' ? `<button class="hrow ok" data-daiopen="${esc(w.id)}"><span class="ic">✅</span><span class="t"><b>Đề đã soạn xong</b><small>${esc(daiName(k, key.split('|')[1], lv))} · làm ngay</small></span><span class="chev">›</span></button>`
      : w.st === 'loi' ? `<p class="mute" style="margin:6px 0">❌ ${esc(daiName(k, key.split('|')[1], lv))}: ${esc(w.err || 'chưa tạo được đề')} <button class="link" data-daidrop="${esc(key)}">Bỏ</button></p>`
      : `<button class="hrow" data-daiwait="${esc(w.id)}"><span class="ic">⏳</span><span class="t"><b>AI đang soạn đề</b><small>${esc(daiName(k, key.split('|')[1], lv))} · ${Math.round((now - w.at) / 1000)} giây</small></span><span class="chev">›</span></button>`).join('')}
    <button class="btnbig" data-daigo="${k}|${p.dang}|${lv || ''}">▶ Làm đề AI mới<small>${esc(DAI_SKN[p.s][1] + ' · ' + p.t)}${p.du ? ' · sẵn sàng' : p.why ? ' · ' + esc(p.why) : ''}</small></button>
    <div class="chipset ex3 daisk" style="grid-template-columns:repeat(${daiSks(k, lv).length}, minmax(0, 1fr))">${daiSks(k, lv).map(s => `<button data-daisk="${k}|${s}|${lv || ''}">${DAI_SKN[s][0]} ${DAI_SKN[s][1]}</button>`).join('')}</div>
    <p class="mute" style="margin:6px 0 0;font-size:13px">Mỗi lần một đề mới, khác đề cũ. ${p.du ? '' : 'Đề đầu mất khoảng 1–2 phút để soạn. '}Mỗi đề AI tốn phí gọi AI của app: làm bài có sẵn trước để tiết kiệm. 🤖 AI soạn và chấm, chưa giáo viên kiểm.</p>
    ${done ? `<button class="hrow" data-dailist="${k}"><span class="ic">🗂</span><span class="t"><b>${done} đề AI đã làm</b><small>Xem lại lời giải, làm lại</small></span><span class="chev">›</span></button>` : ''}</div>`; }
const daiSkRow = (k, s, lv) => daiDangs(k, s, lv).length ? `<button class="hrow" data-daisk="${k}|${s}|${lv || ''}"><span class="ic">🤖</span><span class="t"><b>Đề AI mới</b><small>Khi làm hết bài có sẵn hoặc muốn bài mới · tốn phí AI</small></span><span class="chev">›</span></button>` : '';

// ---------- v142: 📚 bài có sẵn chưa làm (nhắc ở phần 🤖, đếm ở nút 📚 của màn 2 nút) ----------
// cùng danh sách bài của màn kỹ năng (IELTS ieBai / ieRes, TOEIC toBai / toRes, Cambridge cbBai / cbRes theo bài thi)
const daiCbS = p => /Nghe/.test(p.t) ? 'L' : p.speak || /Nói/.test(p.t) ? 'S' : /Viết/.test(p.t) && !/Đọc/.test(p.t) ? 'W' : 'R';
function daiLeft(k, lv) { const out = [];
  try { if (k === 'ielts' && typeof IE !== 'undefined' && IE) for (const s of ['R', 'L', 'W', 'S']) { const L = ieBai(s); if (L.length) out.push({ s, n: L.filter(x => !ieRes(s, x)).length, tot: L.length }); }
    else if (k === 'toeic' && typeof TO !== 'undefined' && TO) for (const s of ['R', 'L']) { const L = toBai(s); if (L.length) out.push({ s, n: L.filter(x => !toRes(x)).length, tot: L.length }); }
    else if (k === 'cefr' && typeof MOCK !== 'undefined') { lv = daiCbLv(lv); const C = MOCK[lv]; if (C) { const rows = cbRows(lv); C.papers.forEach((p, pi) => { const L = cbBai(lv, pi), cells = (rows[pi] || {}).cells || [];
        if (L.length) out.push({ s: daiCbS(p), pi, t: p.t, lv, n: L.filter(b => !cbRes(lv, b, cells)).length, tot: L.length }); }); } } } catch (e) {}
  return out; }
function daiRemind(k, lv) { const L = daiLeft(k, lv); if (!L.length) return '';
  return `<div class="box"><b>📚 Bài có sẵn · miễn phí</b><p class="mute" style="margin:4px 0">Làm hết bài có sẵn trước để đỡ tốn phí AI.</p>
    ${L.map(x => { const m = x.t ? String(x.t).match(/^(\S+)\s+(.*)$/) : null, ic = m ? m[1] : DAI_SKN[x.s][0], nm = esc(m ? m[2] : DAI_SKN[x.s][1]);
      return x.n ? `<button class="hrow" data-daileft="${k}|${x.s}|${x.pi != null ? x.pi : ''}|${x.lv || ''}"><span class="ic">${ic}</span><span class="t"><b>${nm}</b><small>còn ${x.n}/${x.tot} bài chưa làm</small></span><span class="chev">›</span></button>`
        : `<p class="mute" style="margin:6px 0">✓ ${ic} ${nm}: đã làm hết ${x.tot} bài có sẵn, đề AI cho bài mới.</p>`; }).join('')}</div>`; }
// dòng nhỏ ở màn 2 nút và phần 📚: đề AI đã soạn xong / đang soạn (không tự chuyển phần)
function daiNotice(k, lv) { const o = daiSt(), { ky } = daiKy(k, lv), W = Object.values(o.wait).filter(w => w.ky === ky && w.st !== 'loi' && !w.du); if (!W.length) return '';
  const ok = W.find(w => w.st === 'xong'), w = ok || W[0];
  return `<button class="hrow${ok ? ' ok' : ''}" ${ok ? `data-daiopen="${esc(w.id)}"` : `data-daiwait="${esc(w.id)}"`}><span class="ic">${ok ? '✅' : '⏳'}</span><span class="t"><b>${ok ? 'Đề AI đã soạn xong' : 'AI đang soạn đề'}</b><small>${ok ? 'làm ngay' : 'bấm để xem'} · ${esc(DAI_EX[k])}</small></span><span class="chev">›</span></button>`; }
// bấm "còn N bài có sẵn": sang màn kỹ năng ở phần 📚 Đề có sẵn
function daiLeftGo(k, s, pi, lv) { if (typeof EX_PART !== 'undefined') EX_PART = 'san';
  return k === 'ielts' ? ieSkView(s) : k === 'toeic' ? toSkView(s) : cbSkView(lv || daiCbLv(), +pi); }
// gói cho xHome: ô đề AI, ô nhắc, số bài chưa làm, dòng đề AI
const daiX = (k, lv) => ({ ai: daiBox(k, lv), remind: daiRemind(k, lv), left: daiLeft(k, lv), notice: daiNotice(k, lv) });

// màn chọn dạng của một kỹ năng
// v144: một câu nói đề AI theo khuôn đề thật
const DAI_SKNOTE = { 'ielts|R': 'Mỗi đề là 1 bài đọc như đề thật: 13 câu, 20 phút; dạng bạn chọn là một nhóm 5–7 câu, còn lại 1–2 dạng khác.', 'ielts|L': 'Mỗi đề là 1 Part như đề thật: 10 câu, nghe 1 lần, câu theo thứ tự lời nghe.', cefr: 'Mỗi đề là một phần của đề thật, đúng số câu và số lựa chọn của cấp.', toeic: 'Mỗi đề theo đúng khuôn Part của đề thật.' };
function daiSkView(k, s, lv) { window.CUR = { view: 'dai-sk', sk: s }; const { ky } = daiKy(k, lv), o = daiSt(), p = daiPick(k, lv, s);
  const rows = daiDangs(k, s, lv).map(([dang, , t]) => { const st = daiStat(k, ky, dang), du = o.du[ky + '|' + dang];
    return `<button class="hrow${p && p.dang === dang ? ' ok' : ''}" data-daigo="${k}|${dang}|${lv || ''}"><span class="ic">${du ? '⚡' : '▶'}</span><span class="t"><b>${esc(t)}</b><small>${du ? 'sẵn sàng · ' : ''}${st.ai ? `${st.ai} đề AI` : 'chưa làm đề AI'}${st.pct != null ? ` · gần đây ${st.pct}% đúng` : ''}</small></span><span class="chev">›</span></button>`; }).join('');
  const done = o.r.filter(r => r.ky === ky && daiSOf(k, r.dang, lv, r.sk) === s).slice(-5).reverse(), note = DAI_SKNOTE[k + '|' + s] || DAI_SKNOTE[k] || '';
  $app.innerHTML = `<div id="dai"></div><div class="row top"><button class="link" data-daihome="${k}|${lv || ''}">‹ ${DAI_EX[k]}</button><span></span></div>
    <h1>🤖 ${DAI_SKN[s][0]} ${DAI_SKN[s][1]} · đề AI</h1><p class="mute" style="margin:0 0 8px">Chọn dạng. Mỗi lần AI soạn một đề mới, khác các đề bạn đã làm.${note ? ' ' + note : ''}</p>
    <div class="box" style="padding:4px 14px">${rows}</div>
    ${done.length ? `<h2 style="margin:16px 0 4px">Đề AI gần đây</h2>${done.map(r => daiRow(r)).join('')}<button class="link" data-dailist="${k}">Xem tất cả đề AI ›</button>` : ''}
    <p class="mute" style="font-size:13px">🤖 AI soạn và chấm, chưa giáo viên kiểm. Thấy câu sai: bấm 💬 → ⚑ Câu sai. Luyện đề không tính vào 📘 Học / 🔁 Nhớ / Thi chuyển cấp của 🧱 Nền.</p>`;
  scrollTo(0, 0); }
const daiScore = r => r.band != null ? `≈ band ${bandTxt(r.band)}` : r.pt != null ? `≈ ${r.pt} điểm` : r.n ? `${r.ok}/${r.n} câu` : r.ai ? `AI chấm ${r.ai}` : 'đã làm';
const daiRow = r => pRow(`data-daiopen="${esc(r.id)}"`, `${esc(r.t || daiName(daiKOf(r.ky), r.dang, r.ky.slice(3)))} <small class="mute">${new Date(r.at).toLocaleDateString('vi-VN')}</small>`, daiScore(r), r.n && r.ok / r.n < 0.6 ? 'bad' : 'good');

// ---------- gọi máy chủ ----------
async function daiAsk(ky, sk, dang, muc, du) {
  try { const { data, error } = await sb.functions.invoke('de-ai', { body: { act: 'tao', ky, sk, dang, muc, du: !!du } });
    let msg = data && data.error; if (error && !msg) { try { msg = (await error.context.json()).error; } catch (er) { msg = 'Không gọi được máy soạn đề.'; } }
    if (msg || !data || !data.id) return { err: msg || 'Không gọi được máy soạn đề.' };
    return { id: data.id }; } catch (e) { return { err: 'Không gọi được máy soạn đề (mạng?).' }; } }
async function daiFetch(id) { try { const { data, error } = await sb.from('de_ai').select('id, ky, sk, dang, st, de, chk, err, at, du').eq('id', id).maybeSingle(); return error ? null : data; } catch (e) { return null; } }
// một lần hỏi trạng thái (test gọi thẳng); xong / lỗi thì cập nhật S.dai.wait và màn đang mở
async function daiTick(id) { const o = daiSt(), key = Object.keys(o.wait).find(k => o.wait[k].id === id), w = key && o.wait[key]; if (!w) return null;
  const row = await daiFetch(id), late = Date.now() - w.at > DAI_WAIT;
  if (row && row.st === 'xong') { const bad = daiCheck(row.de); if (bad.length) { w.st = 'loi'; w.err = 'Đề hỏng (' + bad[0] + '), tạo đề khác.'; } else { w.st = 'xong'; if (w.du) { o.du[key] = { id, at: Date.now() }; delete o.wait[key]; } } }
  else if (row && row.st === 'loi') { w.st = 'loi'; w.err = row.err || 'Chưa tạo được đề.'; }
  else if (late) { w.st = 'loi'; w.err = 'AI soạn quá lâu, thử lại.'; }
  else return 'dang';
  delete DAI.tk[id]; S.t = Date.now(); save();
  if (DAI.cur === id && document.getElementById('dai')) { if (w.st === 'xong') { delete o.wait[key]; save(); return daiRun(row); } return daiWaitView(w, key); }
  if (w.st === 'xong' && !w.du && typeof toast === 'function') toast('🤖 Đề AI đã soạn xong: mở 🎯 Luyện đề để làm.');
  return w.st; }
function daiWatch(id) { if (DAI.tk[id] || DAI.off) return;   // DAI.off: test tắt hỏi nền (tools/test/run.mjs C57)
   DAI.tk[id] = 1; const go = async () => { if (!DAI.tk[id]) return; const st = await daiTick(id); if (st === 'dang') setTimeout(go, DAI_POLL); }; setTimeout(go, DAI_POLL); }

// máy kiểm phía trang (lớp cuối; máy chủ đã kiểm kỹ): đề phải có câu, đáp án nằm trong lựa chọn
function daiCheck(de) { const bad = []; if (!de || !de.sk) return ['không có đề'];
  if (de.groups) { let n = 0; for (const g of de.groups) for (const it of g.items || []) { n++; if (!it.q || !it.a) bad.push('câu thiếu đáp án'); else if (it.o && it.o.length && !it.o.includes(it.a)) bad.push('đáp án không có trong lựa chọn'); } if (!n) bad.push('không có câu hỏi'); }
  else if (de.sk === 'viet' && !(de.task && de.task.p)) bad.push('thiếu đề viết');
  else if (de.sk === 'noi' && !(de.speak && (de.speak.p1.length || de.speak.p2.t))) bad.push('thiếu câu hỏi nói');
  return bad; }

// ---------- bấm "Làm đề AI mới" ----------
async function daiGo(k, dang, lv) { const { ky, muc } = daiKy(k, lv), o = daiSt(), key = ky + '|' + dang, sk = daiDangs(k, daiSOf(k, dang, lv), lv).find(d => d[0] === dang)?.[1] || 'doc';
  const du = o.du[key]; if (du) { delete o.du[key]; save(); const row = await daiFetch(du.id); if (row && row.st === 'xong' && !daiCheck(row.de).length && Date.now() - du.at < DAI_DU_D * DAY) return daiRun(row); }
  const w = o.wait[key]; if (w && w.st === 'dang' && Date.now() - w.at < DAI_WAIT) { DAI.cur = w.id; daiWatch(w.id); return daiWaitView(w, key); }
  if (w && w.st === 'xong') { delete o.wait[key]; save(); const row = await daiFetch(w.id); if (row && row.st === 'xong') return daiRun(row); }
  $app.innerHTML = '<div id="dai"></div><p class="mute">⏳ Đang gửi yêu cầu…</p>';
  const r = await daiAsk(ky, sk, dang, muc);
  if (r.err) { $app.innerHTML = `<div id="dai"></div><div class="row top"><button class="link" data-daihome="${k}|${lv || ''}">‹ ${DAI_EX[k]}</button><span></span></div><h1>🤖 Chưa tạo được đề</h1><div class="box"><p style="margin:0">${esc(r.err)}</p></div>
      <button class="pri" data-daigo="${k}|${dang}|${lv || ''}">Thử lại</button><p class="mute">Bài có sẵn của ${DAI_EX[k]} vẫn làm được bình thường.</p>`; return; }
  o.wait[key] = { id: r.id, at: Date.now(), ky, st: 'dang', k, lv: lv || '' }; S.t = Date.now(); save(); DAI.cur = r.id; daiWatch(r.id); daiWaitView(o.wait[key], key); }
// soạn sẵn một đề dự trữ (sau khi làm xong một đề AI của kỹ năng đó); tối đa 1 mỗi dạng
async function daiPrefetch(k, dang, lv) { const { ky, muc } = daiKy(k, lv), o = daiSt(), key = ky + '|' + dang; if (o.du[key] || o.wait[key]) return;
  const sk = daiDangs(k, daiSOf(k, dang, lv), lv).find(d => d[0] === dang)?.[1]; if (!sk) return; const r = await daiAsk(ky, sk, dang, muc, true); if (r.err) return;
  o.wait[key] = { id: r.id, at: Date.now(), ky, st: 'dang', k, lv: lv || '', du: 1 }; save(); daiWatch(r.id); }

function daiWaitView(w, key) { const k = w.k || daiKOf(w.ky), lv = w.lv, s = Math.round((Date.now() - w.at) / 1000), name = daiName(k, key.split('|')[1], lv);
  if (w.st === 'loi') { $app.innerHTML = `<div id="dai"></div><div class="row top"><button class="link" data-daihome="${k}|${lv}">‹ ${DAI_EX[k]}</button><span></span></div><h1>🤖 Chưa tạo được đề</h1>
      <div class="box"><b>${esc(name)}</b><p style="margin:6px 0 0">${esc(w.err || 'Chưa tạo được đề.')}</p></div><button class="pri" data-daidrop="${esc(key)}" data-daigo="${k}|${key.split('|')[1]}|${lv}">Thử lại</button>`; return; }
  $app.innerHTML = `<div id="dai"></div><div class="row top"><button class="link" data-daihome="${k}|${lv}">‹ ${DAI_EX[k]}</button><span></span></div>
    <h1>🤖 AI đang soạn đề</h1><p style="margin:0 0 6px"><b>${esc(name)}</b> · ${DAI_EX[k]}</p>${bar(Math.min(95, Math.round(s / 90 * 100)), 0, 'var(--accent)')}
    <p class="mute" id="daiT">Đã chờ ${s} giây. Đề đầu tiên mất khoảng 1–2 phút: AI soạn, máy kiểm đáp án, rồi một lượt AI khác giải lại để bỏ câu sai.</p>
    <button class="btnbig ghost" data-daihome="${k}|${lv}">Làm việc khác trong lúc chờ<small>Đề xong sẽ hiện ở ô 🤖 của ${DAI_EX[k]}</small></button>`;
  const t = setTimeout(function upd() { const el = document.getElementById('daiT'); if (!el || DAI.cur !== w.id) return; const s2 = Math.round((Date.now() - w.at) / 1000); el.textContent = `Đã chờ ${s2} giây. Đề đầu tiên mất khoảng 1–2 phút: AI soạn, máy kiểm đáp án, rồi một lượt AI khác giải lại để bỏ câu sai.`; const b = $app.querySelector('.bar i'); if (b) b.style.width = Math.min(95, Math.round(s2 / 90 * 100)) + '%'; setTimeout(upd, 1000); }, 1000); scrollTo(0, 0); return t; }

// ---------- làm đề ----------
// v142: về màn kỳ thi ở phần 🤖 Đề AI (EX_PART, toeic.js)
const daiBack = (k, lv) => () => { if (typeof EX_PART !== 'undefined') EX_PART = 'ai'; return k === 'toeic' ? toeicView() : k === 'ielts' ? ieltsView() : cbView(lv || undefined); };
// giọng: người nói nữ → A / C, nam → B (kPlayDlg: A nữ, B nam, C nữ thứ hai)
function daiLines(de) { const sex = de.sex || {}, map = {}; let f = 0; for (const [w] of de.lines || []) if (!(w in map)) map[w] = (sex[w] || (w === 'B' ? 'm' : 'f')) === 'm' ? 'B' : (f++ ? 'C' : 'A');
  return (de.lines || []).map(([w, s]) => [map[w] || 'A', s]); }
const daiText = de => String(de.text || '').split(/\n\s*\n|\n(?=### )/).map(p => p.trim()).filter(Boolean)
  .map(p => p.startsWith('### ') ? `<p style="margin:12px 0 0"><b>${esc(p.slice(4))}</b></p>` : `<p class="tdtap" style="font-size:16px;line-height:1.7;margin:8px 0 0">${esc(p).replace(/\n/g, '<br>')}</p>`).join('');
const daiPass = de => de.text ? `<details class="box" open style="margin-top:12px"><summary><b>${esc(de.title)}</b> <span class="mute">(${kWords(de.text).length} từ)</span></summary>${daiText(de)}</details>` : '';
const DAI_LBL = { 'R-tf': IE_TFH, 'R-yn': typeof IE_YNH !== 'undefined' ? IE_YNH : '' };
function daiQs(row) { const de = row.de, id = 'ai:' + row.id, ie = de.ky.startsWith('ielts'), to = de.ky === 'toeic', foot = daiPass(de), out = [];
  const lines = de.lines && de.lines.length ? daiLines(de) : null; let n = 0;
  for (const g of de.groups || []) for (const it of g.items || []) { const q = { x: { id, ...(to && g.ty.startsWith('p5:') ? { t: g.ty.slice(3) } : {}) }, why: it.why_vi + (it.ev ? ` 📍 “${it.ev}”` : ''), foot,
      head: `${de.part ? `<p class="mute" style="margin:0 0 2px;font-size:13px">📋 ${esc(de.part)}</p>` : ''}<p class="mute">${esc(g.inst || '')}</p>${DAI_LBL[g.ty] || ''}${lines || (to && g.ty === 'p2') ? '<p class="mute" style="font-size:13px">🔊 Giọng máy của điện thoại đọc lời AI soạn, không phải giọng thu sẵn.</p>' : ''}`, q: esc(it.q).replace(/\n/g, '<br>').replace(/_{3,}|-{5,}/, m => `<b>${m}</b>`) };
    if (ie) q.ty = g.ty; if (to) q.sec = g.ty.split(':')[0]; if (lines) q.play = { key: id, lines };
    if (it.o && it.o.length) { q.kind = 'mc'; q.opts = it.o; q.a = it.a; } else { q.kind = 'type'; q.a = it.a; q.acc = [it.a, ...(it.acc || [])]; }
    if (to && g.ty === 'p2') { const L = 'ABC'; q.play = { key: id + ':' + n, lines: [['A', it.q], ...it.o.map((o, j) => ['B', `${L[j]}. ${o}`])] }; q.q = '🔊 Nghe câu hỏi và 3 câu đáp. Câu đáp nào hợp nhất?'; q.opts = it.o.map((_, j) => L[j]); q.a = L[it.o.indexOf(it.a)];
      q.why = `Câu hỏi: “${it.q}” · Đáp án: ${q.a}. ${it.a} · ${it.why_vi}`; }
    out.push(q); n++; }
  return out; }
const daiBand = (k, ok, n) => { const T = k === 'L' ? IE_L : ieSt().type === 'gt' ? IE_RG : IE_RA, raw = Math.round(ok / Math.max(1, n) * 40); return (T.find(([r]) => raw >= r) || [0, 2])[1]; };
function daiRun(row) { const de = row.de, k = daiKOf(de.ky), lv = de.ky.startsWith('cb-') ? de.ky.slice(3) : '', back = daiBack(k, lv); DAI.cur = null;
  const S0 = daiSOf(k, de.dang, lv, de.sk), t0 = Date.now(), name = daiName(k, de.dang, lv, de.sk);
  daiSt().mo = { id: row.id, at: t0, ky: de.ky, dang: de.dang }; save();   // làm dở: giữ DAI_MO_H giờ, mở lại cùng đề từ câu 1
  if (de.sk === 'viet') return daiWrite(row, k, lv, back);
  if (de.sk === 'noi') return daiSpeak(row, k, lv, back);
  const qs = daiQs(row), plays = k === 'cefr' ? 2 : 1;
  ieRun(`🤖 ${name}`, qs, back, de.min, { R: {}, src: 'ai', plays, home: DAI_EX[k],
    endHtml: res => daiEnd(row, res, k, S0), done: res => { const ok = res.filter(r => r.ok).length, n = res.length;
      if (k === 'toeic' && typeof toLog === 'function') toLog(res, 'ai', new Set(['ai:' + row.id]));
      const band = k === 'ielts' && (S0 === 'R' || S0 === 'L') ? daiBand(S0, ok, n) : null, pt = k === 'toeic' ? toScale(ok, n) : null;
      daiSave(row, { ok, n, ...(band != null ? { band } : {}), ...(pt != null ? { pt } : {}), min: Math.round((Date.now() - t0) / 60000) }); } }); }
function daiEnd(row, res, k, S0) { const de = row.de, ok = res.filter(r => r.ok).length, n = res.length, lv = de.ky.slice(3);
  const est = k === 'ielts' ? `<p>≈ band <b>${bandTxt(daiBand(S0, ok, n))}</b> <span class="mute">(ước theo tỉ lệ đúng; một bài ngắn nên dao động nhiều)</span></p>`
    : k === 'toeic' ? `<p>≈ <b>${toScale(ok, n)}</b> / 495 điểm phần ${S0 === 'L' ? 'Nghe' : 'Đọc'} <span class="mute">(ước theo tỉ lệ đúng, không phải bảng của ETS)</span></p>`
    : `<p>${Math.round(ok / Math.max(1, n) * 100)}% đúng · mức cần khoảng ${Math.round(((MOCK[lv] || {}).pass || 0.7) * 100)}% <span class="mute">(ước)</span></p>`;
  const tr = de.lines && de.lines.length ? `<details class="box"><summary><b>📜 Lời bài nghe</b></summary>${de.lines.map(([w, s]) => `<p class="tdtap" style="margin:6px 0">${esc(w)}: ${esc(s)}</p>`).join('')}</details>` : '';
  const chk = row.chk || {}, ck = chk.bo === 'het-gio' ? '⚠️ Đề này chưa kịp kiểm chéo.' : chk.n ? `Đã kiểm chéo: ${chk.khop}/${chk.n} câu khớp, bỏ ${chk.n - chk.khop} câu lệch.` : '';
  return `${est}${tr}<p class="mute" style="font-size:13px">🤖 AI soạn, chưa giáo viên kiểm. ${ck} Thấy câu sai: bấm 💬 → ⚑ Câu sai.</p><button class="pri" data-daigo="${k}|${de.dang}|${de.ky.startsWith('cb-') ? lv : ''}">▶ Làm đề AI mới cùng dạng</button>`; }
function daiSave(row, r) { const o = daiSt(), de = row.de; o.r = [...o.r.filter(x => x.id !== row.id), { id: row.id, ky: de.ky, sk: de.sk, dang: de.dang, at: Date.now(), t: de.title, ...r }].slice(-DAI_MAX_R); o.mo = null; S.t = Date.now(); save();
  // v142 (người sáng lập chọn): chỉ soạn sẵn đề AI kế tiếp khi đã làm xong ≥ DAI_DU_N đề AI cùng kỳ thi + dạng trong hôm nay (đang luyện thật), đỡ tốn phí cho đề không ai làm
  const k = daiKOf(de.ky), today = dayOf(Date.now()), nToday = o.r.filter(x => x.ky === de.ky && x.dang === de.dang && dayOf(x.at) === today).length;
  if (nToday >= DAI_DU_N) daiPrefetch(k, de.dang, de.ky.startsWith('cb-') ? de.ky.slice(3) : ''); }

// ✍️ Viết: IELTS dùng ieWrite (máy ước band + nút AI chấm, tự bấm); Cambridge: màn viết gọn + AI chấm thang Cambridge
function daiIeX(row) { const de = row.de, t = de.task, id = 'ai:' + row.id;
  if (de.dang === 't1' && t.chart) { const c = t.chart; return { id, kind: c.kind, title: c.title, unit: c.unit, p: t.p, pv: t.pv, cats: c.cats, series: c.series.map(x => [x.name, x.v]), m: t.m }; }   // v144: biểu đồ đường / cột / tròn / bảng
  if (de.dang === 't1') { const tb = t.table || { t: '', h: [], r: [] }; return { id, kind: 'table', title: tb.t, unit: '', p: t.p, pv: t.pv, cats: tb.h.slice(1), series: tb.r.map(r => [r[0], r.slice(1)]), m: t.m }; }
  if (de.dang === 'gt1') return { id, reg: IE_REG[t.genre] ? t.genre : 'formal', p: t.p, pv: t.pv, m: t.m };
  return { id, type: IE_T2T[t.genre] ? t.genre : 'opinion', p: t.p, pv: t.pv, k: [], m: t.m }; }
function daiWrite(row, k, lv, back) { const de = row.de, t = de.task;
  if (k === 'ielts') return ieWrite(de.dang, daiIeX(row), null, back, null, { ai: 1, auto: 1, done: r => daiSave(row, { band: r.band, n: 0 }) });
  const lvA = lv === 'pre' ? 'a1' : lv, t0 = Date.now();
  $app.innerHTML = `<div id="dai"></div><div class="row top"><button class="link" data-a="back">← Thôi</button><span class="uname">✍️ ${esc(t.genre || 'Bài viết')}</span></div>
    <div class="box"><b>✍️ ${esc(de.title)}</b> <span class="mute">· ${t.min}${t.max ? '–' + t.max : '+'} từ</span><p style="margin:6px 0;white-space:pre-line">${esc(t.p)}</p>${t.pv ? `<p class="mute" style="margin:0">${esc(t.pv)}</p>` : ''}</div>
    <form id="daiwf" autocomplete="off"><textarea id="daiwt" rows="12" autocapitalize="sentences" spellcheck="false" aria-label="Bài viết"></textarea><p class="mute" id="daiwc">0 từ</p><button class="pri" type="submit">Nộp bài, nhờ AI chấm</button></form><div id="daiwr"></div>`;
  const ta = document.getElementById('daiwt'); ta.oninput = () => { document.getElementById('daiwc').textContent = kWords(ta.value).length + ' từ'; };
  document.getElementById('daiwf').onsubmit = e => { e.preventDefault(); if (kWords(ta.value).length < Math.min(15, t.min)) return toast(`Viết ít nhất ${Math.min(15, t.min)} từ.`); ta.disabled = true; e.target.querySelector('button').remove();
    const er = typeof wErrors === 'function' ? wErrors(ta.value) : [];
    document.getElementById('daiwr').innerHTML = `${er.length ? `<div class="box"><b>Lỗi hay gặp máy bắt được (${er.length})</b>${er.map(([s, m]) => `<p style="margin:2px 0">❌ “${esc(s)}” · ${esc(m)}</p>`).join('')}</div>` : ''}
      ${aiBtn('viet', lvA, { prompt: t.p, genre: t.genre || 'text', min: t.min, max: t.max || t.min + 60 }, ta.value)}${t.m ? `<details class="box"><summary><b>📄 Bài mẫu</b></summary><p class="tdtap" style="white-space:pre-line">${esc(t.m)}</p></details>` : ''}
      <button class="pri" data-daigo="${k}|${de.dang}|${lv}">▶ Đề viết AI mới</button>`;
    daiSave(row, { n: 0, min: Math.round((Date.now() - t0) / 60000) }); const ab = document.querySelector('#daiwr [data-ai]'); if (ab && ab.click) ab.click(); };
  $app.onclick = e => { if (e.target.closest('[data-a="back"]')) back(); }; scrollTo(0, 0); }

// 🗣 Nói: IELTS + máy chép lời → ieSpeak (đúng giờ Part 2, máy ước band, nút AI chấm); còn lại: từng câu, nói (chép lời) hoặc gõ, rồi AI chấm
function daiSpeak(row, k, lv, back) { const de = row.de, sp = de.speak, id = 'ai:' + row.id;
  if (k === 'ielts' && SREC) { const pick = de.dang === 'p2' ? { p2: { id, t: sp.p2.t, vi: '', b: sp.p2.b, p3: sp.p3.map(q => [q, '']) } } : { p1: { id, topic: de.title, qs: sp.p1.map(q => [q, '']) } };
    return ieSpeak(de.dang === 'p2' ? ['p2', 'p3'] : ['p1'], pick, back, sc => daiSave(row, { band: sc.band, n: 0 })); }
  const qs = de.dang === 'p2' ? [`${sp.p2.t}\n${sp.p2.b.map(b => '• ' + b).join('\n')}`, ...sp.p3] : sp.p1, t0 = Date.now();
  const lvA = k === 'ielts' ? daiKy('ielts').ky : lv === 'pre' ? 'a1' : lv;
  $app.innerHTML = `<div id="dai"></div><div class="row top"><button class="link" data-a="back">← Thôi</button><span class="uname">🗣 ${esc(de.title)}</span></div>
    <p class="mute" style="margin:0 0 6px">${SREC ? 'Bấm 🎤 rồi nói; máy chép lời vào ô. Sửa được trước khi nộp.' : 'Máy này không chép được lời nói: gõ câu trả lời như khi nói. AI chấm bằng chữ gõ, không chấm phát âm.'}</p>
    <form id="daisf" autocomplete="off">${qs.map((q, i) => `<div class="box"><p style="margin:0 0 6px;white-space:pre-line"><b>${i + 1}.</b> ${esc(q)}</p>${SREC ? `<button type="button" class="chip" data-daimic="${i}">🎤 Nói</button>` : ''}<textarea id="dais${i}" rows="3" aria-label="Câu trả lời ${i + 1}"></textarea></div>`).join('')}
    <button class="pri" type="submit">Nộp, nhờ AI chấm</button></form><div id="daisr"></div>`;
  let rec = null;
  $app.onclick = e => { if (e.target.closest('[data-a="back"]')) { if (rec != null && typeof kAsrStop === 'function') kAsrStop(); return back(); }
    const m = e.target.closest('[data-daimic]'); if (!m) return; const i = +m.dataset.daimic, ta = document.getElementById('dais' + i);
    if (rec === i) { kAsrStop(t => { ta.value = t; }); rec = null; m.textContent = '🎤 Nói'; return; }
    if (rec != null) kAsrStop(); rec = i; m.textContent = '⏹ Dừng'; kAsrStart(t => { ta.value = t; }); };
  document.getElementById('daisf').onsubmit = e => { e.preventDefault(); const ans = qs.map((_, i) => document.getElementById('dais' + i).value.trim()); if (!ans.some(Boolean)) return toast('Trả lời ít nhất một câu.');
    if (rec != null && typeof kAsrStop === 'function') kAsrStop(); e.target.querySelectorAll('textarea, button').forEach(x => { x.disabled = true; });
    const text = qs.map((q, i) => `Q${i + 1}: ${q}\nA: ${ans[i] || '(no answer)'}`).join('\n\n');
    document.getElementById('daisr').innerHTML = aiBtn('noi', lvA, { prompt: `Speaking${k === 'ielts' ? ' ' + (de.dang === 'p2' ? 'Part 2 and 3' : 'Part 1') : ''} questions:\n${qs.join('\n')}${SREC ? '' : '\n(The learner TYPED the answers; do not grade pronunciation.)'}`, ...(k === 'ielts' ? { part: de.dang === 'p2' ? 'Part 2–3' : 'Part 1', target: ieSt().target } : {}) }, text)
      + `<button class="pri" data-daigo="${k}|${de.dang}|${lv}">▶ Đề nói AI mới</button>`;
    daiSave(row, { n: 0, min: Math.round((Date.now() - t0) / 60000) }); const ab = document.querySelector('#daisr [data-ai]'); if (ab && ab.click) ab.click(); };
  scrollTo(0, 0); }

// 🗂 mọi đề AI đã làm (xem lại lời giải: mở lại đề từ bảng de_ai)
function daiList(k) { const o = daiSt(), rs = o.r.filter(r => !k || daiKOf(r.ky) === k).slice().reverse();
  $app.innerHTML = `<div id="dai"></div><div class="row top"><button class="link" data-daihome="${k || exSel()}|">‹ ${DAI_EX[k || exSel()]}</button><span></span></div><h1>🗂 Đề AI đã làm</h1>
    ${rs.length ? rs.map(daiRow).join('') : '<p class="mute">Chưa làm đề AI nào.</p>'}<p class="mute" style="font-size:13px">Đề được lưu lâu dài để AI không soạn trùng. Mở lại một đề để làm lại hoặc xem lời giải.</p>`; scrollTo(0, 0); }

document.addEventListener('click', async e => { if (!S) return; const g = s => e.target.closest(s); let b;
  if ((b = g('[data-daidrop]'))) { const o = daiSt(); delete o.wait[b.dataset.daidrop]; save(); if (!b.dataset.daigo) { const [k, lv] = [(b.dataset.daidrop.startsWith('ielts') ? 'ielts' : b.dataset.daidrop.startsWith('toeic') ? 'toeic' : 'cefr'), '']; return daiBack(k, lv)(); } }
  if ((b = g('[data-daigo]'))) { const [k, dang, lv] = b.dataset.daigo.split('|'); scrollTo(0, 0); return daiGo(k, dang, lv || undefined); }
  if ((b = g('[data-daisk]'))) { const [k, s, lv] = b.dataset.daisk.split('|'); return daiSkView(k, s, lv || undefined); }
  if ((b = g('[data-daihome]'))) { const [k, lv] = b.dataset.daihome.split('|'); DAI.cur = null; scrollTo(0, 0); return daiBack(k, lv)(); }
  if ((b = g('[data-daiwait]'))) { const o = daiSt(), key = Object.keys(o.wait).find(x => o.wait[x].id === b.dataset.daiwait); if (!key) return; DAI.cur = o.wait[key].id; daiWatch(DAI.cur); return daiWaitView(o.wait[key], key); }
  if ((b = g('[data-daiopen]'))) { const id = b.dataset.daiopen, o = daiSt(), key = Object.keys(o.wait).find(x => o.wait[x].id === id); if (key) { delete o.wait[key]; save(); }
    $app.innerHTML = '<div id="dai"></div><p class="mute">⏳ Đang mở đề…</p>'; const row = await daiFetch(id); if (!row || row.st !== 'xong') { toast('Không mở được đề này.'); return daiList(); } scrollTo(0, 0); return daiRun(row); }
  if ((b = g('[data-dailist]'))) return daiList(b.dataset.dailist || undefined);
  if ((b = g('[data-daileft]'))) { scrollTo(0, 0); return daiLeftGo(...b.dataset.daileft.split('|')); }
  if (g('[data-daitk]')) return daiStats(); });
// 🛠 công cụ người sáng lập (💾 Dữ liệu): số lượt AI, token, tiền ước 7 ngày. Giá Opus 5.5: $4 / $20 mỗi triệu token vào / ra.
// Bạn nói AI (el-ban) dùng mô hình rẻ hơn nên không tính tiền ở đây.
const DAI_KIND = { de: '🤖 Soạn đề', viet: '✍️ AI chấm Viết', noi: '🗣 AI chấm Nói', ban: '👥 Bạn nói AI' };
const daiUsd = x => (x.tin * 4 + x.tout * 20) / 1e6;
async function daiStats() { const el = document.getElementById('daitk'); if (el) el.innerHTML = '<p class="mute">⏳ Đang lấy số…</p>';
  try { const { data, error } = await sb.functions.invoke('de-ai', { body: { act: 'tk' } }); let msg = data && data.error;
    if (error && !msg) { try { msg = (await error.context.json()).error; } catch (er) { msg = 'Không lấy được số.'; } }
    if (!el) return; if (msg || !data || !data.ok) { el.innerHTML = '<p class="mute">❌ ' + esc(msg || 'Lỗi.') + '</p>'; return; }
    const rows = Object.entries(data.by || {}), tot = rows.filter(([k]) => k !== 'ban').reduce((s, [, x]) => s + daiUsd(x), 0), d = data.de || { n: 0, loi: 0, lai: 0 };
    const line = ([k, x]) => '<p style="margin:4px 0">' + (DAI_KIND[k] || esc(k)) + ': <b>' + x.n + '</b> lượt · ' + Math.round(x.tin / 1000) + 'k / ' + Math.round(x.tout / 1000) + 'k token vào / ra' + (k === 'ban' ? '' : ' · ≈ ' + daiUsd(x).toFixed(2) + ' USD') + '</p>';
    el.innerHTML = '<div class="box"><b>7 ngày qua</b>' + (rows.length ? rows.map(line).join('') : '<p class="mute">Chưa có lượt AI nào.</p>')
      + '<p style="margin:6px 0 0">Đề AI: <b>' + d.n + '</b> đề · ' + d.loi + ' đề lỗi · ' + d.lai + ' đề phải soạn lại vì trùng / hỏng' + (d.n ? ' (' + Math.round(d.lai / d.n * 100) + '%; mốc xét lại: trên 20%)' : '') + '</p>'
      + '<p style="margin:6px 0 0"><b>Tổng ≈ ' + tot.toFixed(2) + ' USD</b> <span class="mute">(ước theo giá Opus 5.5, chưa gồm thuế; số thật ở Anthropic Console)</span></p></div>';
  } catch (e) { if (el) el.innerHTML = '<p class="mute">❌ Không lấy được số (mạng?).</p>'; } }
