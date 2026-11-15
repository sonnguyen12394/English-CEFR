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
  { k: 'dai', ic: '👥', ten: 'Phố Đại Từ & Lượng Từ', sub: 'he / him / his, each / many / much, cấu trúc', need: q => q.sec === 'p5' && ['pron', 'det', 'struct'].includes(CY_T(q)) },
  { k: 'cho', ic: '🛒', ten: 'Chợ Từ Vựng', sub: 'Chọn từ theo nghĩa, cụm hay dùng, từ gần nghĩa', need: q => (q.sec === 'p5' && CY_T(q) === 'voc') || (q.sec === 'p6' && CY_T(q) === 'word') || (q.sec === 'p7' && CY_T(q) === 'syn') },
  { k: 'ghep', ic: '🧩', ten: 'Phố Ghép Đoạn', sub: 'Chèn câu vào đoạn văn · Part 6, Part 7', need: q => (q.sec === 'p6' || q.sec === 'p7') && CY_T(q) === 'insert' },
  { k: 'ben', ic: '🔎', ten: 'Bến Dò Tin', sub: 'Tìm chi tiết, suy luận, mục đích · Part 7', need: q => q.sec === 'p7' && !['syn', 'insert'].includes(CY_T(q)) } ];
const cyC = p => (typeof PH_PHO !== 'undefined' && PH_PHO[p.k]) || null;   // phố đã có (cấu hình động cơ phố)
const cyInfo = p => { const c = cyC(p); return c ? { ic: c.ic, ten: c.ten, sub: c.sub } : p; };
// bậc đã mở của một phố, đọc thẳng dữ liệu (không đổi phố đang dùng)
function cyLv(k) { const c = PH_PHO[k]; if (!c) return 0; const o = toSt(), st = k === 'loai' ? o.pho : (o.phos || {})[k], u = (st && st.mu) || {}, M = Object.keys(c.MUC);
  let n = 1; for (let i = 1; i < M.length; i++) if ((u[M[i - 1]] || 0) >= PH_WIN) n = i + 1; else break; return st && st.in ? n : 0; }
// đếm câu của đề theo phố: { k → { n, sai } }
function cyCount(de) { const B = de && trB(de), out = {}; if (!B) return out; const st = {}; for (const c of tgJState(de) || []) st[c.n] = c.st;
  for (const q of B.Q.filter(q => /^p[5-7]$/.test(q.sec))) { const p = CY_PHO.find(p => p.need(q)); if (!p) continue; const r = out[p.k] = out[p.k] || { n: 0, sai: 0 }; r.n++; if (st[q.n] === 'sai') r.sai++; }
  return out; }
function cyRow() { return `<div class="box hcard" style="margin:12px 0 0"><button class="hrow" data-cyv><span class="ic">🏙</span><span class="t"><b>Thành phố TOEIC</b><small>Học từng phố ngữ pháp, rồi vào trận cuối ⚔️ Chinh phục đề</small></span><span class="chev">›</span></button></div>`; }
// ô "Đề này cần" ở Chinh phục đề: phố đã có + số câu + bậc; phố đang xây gộp một dòng
function cyNeedBox(de) { const C = cyCount(de), have = CY_PHO.filter(p => cyC(p) && C[p.k]), soon = CY_PHO.filter(p => !cyC(p) && C[p.k]);
  if (!have.length) return ''; const ns = soon.reduce((a, p) => a + C[p.k].n, 0);
  return `<div class="box cyneed"><b>🏙 Đề này cần</b>${have.map(p => { const c = cyC(p), r = C[p.k], lv = cyLv(p.k), M = Object.keys(c.MUC).length;
      return `<button class="hrow" data-phv="${p.k}"><span class="ic">${c.ic}</span><span class="t"><b>${c.ten} · ${r.n} câu</b><small>${lv ? `Bậc ${lv} / ${M} đã mở` : 'Chưa chơi'}${r.sai ? ` · ${r.sai} câu bạn đang sai` : ''}${lv < 3 && r.sai ? ' · nên luyện phố trước' : ''}</small></span><span class="chev">›</span></button>`; }).join('')}
    ${ns ? `<p class="mute" style="margin:6px 0 0;font-size:14px">${ns} câu còn lại (động từ, từ vựng, đọc hiểu…): phố đang xây, chữa bằng bí kíp ở đảo.</p>` : ''}</div>`; }

async function cyView() { if (typeof phStop === 'function') phStop(); window.CUR = { view: CY_VIEW }; BACK = null; $app.onkeydown = null; scrollTo(0, 0);
  $app.innerHTML = '<div id="ie"></div><p class="mute">Đang mở Thành phố TOEIC…</p>'; await toLoad();
  if (typeof TG_P !== 'undefined' && !TG_P) { try { if (typeof trProbe9 === 'function') await trProbe9(); if (typeof trLkList === 'function') await trLkList(); } catch (e) {} TG_P = await tgPool(); }
  if (window.CUR.view !== CY_VIEW) return;
  const de = tgDe(), C = cyCount(de), L = tgJState(de) || [], ok = L.filter(c => c.st === 'ok').length;
  const card = p => { const c = cyC(p), I = cyInfo(p), r = C[p.k], lv = c ? cyLv(p.k) : 0, M = c ? Object.keys(c.MUC).length : 4;
    const cnt = r ? `${esc(tgDeName(de))}: ${r.n} câu${r.sai ? ` · ${r.sai} đang sai` : ''}` : '';
    return c ? `<button class="cycard" data-phv="${p.k}"><span class="ic">${I.ic}</span><span class="t"><b>${I.ten}</b><small>${esc(I.sub)}</small><small>${lv ? `Bậc ${lv} / ${M} đã mở` : 'Chưa chơi'}${cnt ? ' · ' + cnt : ''}</small></span><span class="chev">›</span></button>`
      : `<div class="cycard soon" aria-disabled="true"><span class="ic">${I.ic}</span><span class="t"><b>${I.ten} <span class="cysoon">Sắp có</span></b><small>${esc(I.sub)}</small>${cnt ? `<small>${cnt}</small>` : ''}</span></div>`; };
  $app.innerHTML = `<div id="ie"></div><div class="row top"><button class="link tap" data-cyb>‹ TOEIC</button></div>
    <h1 style="margin:4px 0 6px">🏙 Thành phố TOEIC</h1>
    <p class="mute" style="margin:0 0 10px">Mỗi phố dạy một nhóm câu của Phần Đọc. Học từng phố, rồi vào trận cuối để làm đúng hết 100 câu của đề. Không khoá: vào trận lúc nào cũng được.</p>
    <h3 style="margin:10px 0 6px">Các phố</h3>${CY_PHO.map(card).join('')}
    <h3 style="margin:16px 0 6px">Trận cuối</h3>
    <button class="cycard final" data-tgv><span class="ic">🏰</span><span class="t"><b>⚔️ Chinh phục đề</b><small>Dùng kiến thức các phố để đúng hết Phần Đọc</small><small>${de ? `${esc(tgDeName(de))} · ⭐ Đúng ${ok} / ${L.length}` : ''}</small></span><span class="chev">›</span></button>
    <p class="mute" style="font-size:14px">Số câu đếm theo dạng câu của đề đang chọn ở Chinh phục đề. Không tính vào 📘 Học, 🔁 Nhớ hay điểm đề thử.</p>`;
  $app.onclick = e => { if (e.target.closest('[data-cyb]')) { EX_PART = 'san'; return toeicView(); } }; }
document.addEventListener('click', e => { if (S && e.target.closest('[data-cyv]') && (window.CUR || {}).view !== CY_VIEW) cyView(); });
