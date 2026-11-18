// 🏙 Thành phố TOEIC (specs/020-thanh-pho-toeic, v181). Người sáng lập 15/11/2026: "Phố loại từ khá ưng rồi, cứ phát huy thêm với mấy dạng khác.
//   Còn chinh phục đề nói đúng ra là trò cuối chơi để có thể làm được đủ 100 câu mới phải." Q1 ngữ pháp trước · Q2 không khoá, chỉ dẫn · Q3 khung + 1 phố.
// Mỗi phố dạy một nhóm dạng câu của Phần Đọc; ⚔️ Chinh phục đề là trận cuối (không khoá). Màn chỉ đọc tiến độ, không ghi gì mới.
// Đếm câu "cần phố" theo nhãn dạng câu của đề: Part 5 q.x.t · Part 6 q.gt · Part 7 q.qt.
const CY_VIEW = 'toeic-thanh-pho';
const CY_T = q => q.sec === 'p5' ? (q.x && q.x.t) : q.sec === 'p6' ? q.gt : q.qt;
const CY_PHO = [
  { k: 'loai', need: q => q.sec === 'p5' && CY_T(q) === 'form' },
  { k: 'cau', need: q => (q.sec === 'p5' && ['prep', 'conj'].includes(CY_T(q))) || (q.sec === 'p6' && CY_T(q) === 'conn') },
  { k: 'dong', ic: '⏰', ten: 'Phố Động Từ', sub: 'Thì, chủ động / bị động, to V / V-ing', need: q => (q.sec === 'p5' && CY_T(q) === 'verb') || (q.sec === 'p6' && CY_T(q) === 'tense') },
  { k: 'dai', ic: '👥', ten: 'Phố Đại Từ & Lượng Từ', sub: 'he / him / his, each / many / much', need: q => q.sec === 'p5' && ['pron', 'det'].includes(CY_T(q)) },
  { k: 'ctr', ic: '🏛', ten: 'Phố Cấu Trúc', sub: 'So sánh, đảo ngữ, so … that', need: q => q.sec === 'p5' && CY_T(q) === 'struct' },   // v196
  { k: 'ben', ic: '🔎', ten: 'Bến Dò Tin', sub: 'Tìm chi tiết, suy luận, mục đích · Part 7', need: q => q.sec === 'p7' && !['syn', 'insert'].includes(CY_T(q)) },
  { k: 'cho', ic: '🛒', ten: 'Chợ Từ Vựng', sub: 'Chọn từ theo nghĩa, cụm hay dùng, từ gần nghĩa', need: q => (q.sec === 'p5' && CY_T(q) === 'voc') || (q.sec === 'p6' && CY_T(q) === 'word') || (q.sec === 'p7' && CY_T(q) === 'syn') },
  { k: 'ghep', ic: '🧩', ten: 'Phố Ghép Đoạn', sub: 'Chèn câu vào đoạn văn · Part 6, Part 7', need: q => (q.sec === 'p6' || q.sec === 'p7') && CY_T(q) === 'insert' } ];
const cyC = p => (typeof PH_PHO !== 'undefined' && PH_PHO[p.k]) || null;   // phố đã có (cấu hình động cơ phố)
// v183: phố đã có đếm đúng câu phố dùng được (canFix = cùng điều kiện với câu thật của phố), để số ở Thành phố khớp màn phố
const cyInfo = p => { const c = cyC(p); return c ? { ic: c.ic, ten: c.ten, sub: c.sub } : p; };
// bậc đã mở của một phố, đọc thẳng dữ liệu (không đổi phố đang dùng)
function cyLv(k) { const c = PH_PHO[k]; if (!c) return 0; const o = toSt(), st = k === 'loai' ? o.pho : (o.phos || {})[k], u = (st && st.mu) || {}, M = Object.keys(c.MUC);
  let n = 1; for (let i = 1; i < M.length; i++) if ((u[M[i - 1]] || 0) >= PH_WIN) n = i + 1; else break; return st && st.in ? n : 0; }
// đếm câu của đề theo phố: { k → { n, sai } }
const cyPst = k => { const o = toSt(); return (k === 'loai' ? o.pho : (o.phos || {})[k]) || {}; };
function cyCount(de) { const B = de && trB(de), out = {}; if (!B) return out; const st = {}; for (const c of tgJState(de) || []) st[c.n] = c.st;
  for (const q of B.Q.filter(q => /^p[5-7]$/.test(q.sec))) { const p = CY_PHO.find(p => cyC(p) && cyC(p).canFix ? cyC(p).canFix(q) : p.need(q)); if (!p) continue; const r = out[p.k] = out[p.k] || { n: 0, sai: 0, chac: 0 }; r.n++; if (st[q.n] === 'sai') r.sai++;
    const c = (cyPst(p.k).it || {})[`de:${de}:${q.n}`]; if (c && c.s === 1 && c.lv >= 1) r.chac++; }
  return out; }
function cyRow() { return `<div class="box hcard" style="margin:12px 0 0"><button class="hrow" data-cyv><span class="ic">🏙</span><span class="t"><b>Thành phố TOEIC</b><small>Học từng phố ngữ pháp, rồi vào trận cuối ⚔️ Chinh phục đề</small></span><span class="chev">›</span></button></div>`; }
// ô "Đề này cần" ở Chinh phục đề: phố đã có + số câu + bậc; phố đang xây gộp một dòng
function cyNeedBox(de) { const C = cyCount(de), have = CY_PHO.filter(p => cyC(p) && C[p.k]), soon = CY_PHO.filter(p => !cyC(p) && C[p.k]);
  if (!have.length) return ''; const ns = soon.reduce((a, p) => a + C[p.k].n, 0), L = tgJState(de) || [];
  const hu = k => { const l = L.filter(c => c.lu && c.lu.k === k); return l.length ? ` · 🌳 ${l.filter(c => c.hi).length}/${l.length} câu đã hiểu luật` : ''; };
  return `<div class="box cyneed"><b>🏙 Đề này cần</b>${have.map(p => { const c = cyC(p), r = C[p.k], lv = cyLv(p.k), M = Object.keys(c.MUC).length;
      return `<button class="hrow" data-phv="${p.k}"><span class="ic">${c.ic}</span><span class="t"><b>${c.ten} · ${r.n} câu</b><small>${r.chac}/${r.n} chắc · ${lv ? `bậc ${lv} / ${M}` : 'chưa chơi'}${hu(p.k)}${r.sai ? ` · ${r.sai} câu bạn đang sai` : ''}${lv < 3 && r.sai ? ' · nên luyện phố trước' : ''}</small></span><span class="chev">›</span></button>`; }).join('')}
    ${ns ? `<p class="mute" style="margin:6px 0 0;font-size:14px">${ns} câu còn lại (động từ, từ vựng, đọc hiểu…): phố đang xây, chữa bằng bí kíp ở đảo.</p>` : ''}</div>`; }

// v202 (specs/021-dem-khu-pho): màn Thành phố là bản đồ khu phố (khupho.js `cyView`); danh sách thẻ phố cũ còn trong "Thêm" gập (cyListHtml)
function cyCardHtml(p, de, C) { const c = cyC(p), I = cyInfo(p), r = C[p.k], lv = c ? cyLv(p.k) : 0, M = c ? Object.keys(c.MUC).length : 4;
  const cnt = r ? `${esc(tgDeName(de))}: ${r.n} câu${c ? ` · ${r.chac} chắc` : ''}${r.sai ? ` · ${r.sai} đang sai` : ''}` : '';
  const off = de && !r ? ' off' : '';   // v197: đề không có câu cho phố này → làm mờ (vẫn bấm được để luyện kho chung)
  return c ? `<button class="cycard${off}" data-phv="${p.k}"><span class="ic">${I.ic}</span><span class="t"><b>${I.ten}</b><small>${esc(I.sub)}</small><small>${lv ? `Bậc ${lv} / ${M} đã mở` : 'Chưa chơi'}${cnt ? ' · ' + cnt : ''}</small></span><span class="chev">›</span></button>`
    : `<div class="cycard soon" aria-disabled="true"><span class="ic">${I.ic}</span><span class="t"><b>${I.ten} <span class="cysoon">Sắp có</span></b><small>${esc(I.sub)}</small>${cnt ? `<small>${cnt}</small>` : ''}</span></div>`; }
function cyListHtml(de, C) { const L = tgJState(de) || [], ok = L.filter(c => c.st === 'ok').length;
  return CY_PHO.map(p => cyCardHtml(p, de, C)).join('') + `<button class="cycard final" data-tgv><span class="ic">🏰</span><span class="t"><b>⚔️ Chinh phục đề</b><small>Dùng kiến thức các phố để đúng hết Phần Đọc</small><small>${de ? `${esc(tgDeName(de))} · ⭐ Đúng ${ok} / ${L.length}` : ''}</small></span><span class="chev">›</span></button>`; }
document.addEventListener('click', e => { if (S && e.target.closest('[data-cyv]') && (window.CUR || {}).view !== CY_VIEW) cyView(); });
