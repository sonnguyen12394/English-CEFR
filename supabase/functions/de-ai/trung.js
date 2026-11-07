// 🎯 Luyện đề AI (v137): chống đề trùng — hàm thuần, chạy được cả trên máy chủ (Deno) lẫn máy soạn (node, test C53).
// Người sáng lập 7/11/2026: "lưu lại đề đã tạo ít nhất 3 phiên bản để AI không tạo trùng đề".
// Đề mới bị coi là trùng một đề cũ cùng người + kỳ thi + kỹ năng khi: cùng chủ đề máy chọn (trừ khi đã hết chủ đề và cố ý dùng lại, `goc`),
// cùng tên / chủ đề AI ghi, một câu hỏi giống hệt (sau chuẩn hoá), hoặc bài đọc / lời nghe chung ≥ DUP_R cụm 5 từ liên tiếp.
// So với MỌI đề được đưa vào (máy chủ đưa tới 50 đề gần nhất), tức luôn ≥ 3 đề gần nhất như người sáng lập yêu cầu.
// DUP_R = 15% là ý kiến của Claude: hai bài khác chủ đề thường chung < 2% cụm 5 từ, bài chép lại > 30%.

export const DUP_R = 0.15, DUP_MIN_W = 60, DUP_MIN_N = 3;

// chữ thường, bỏ dấu, bỏ dấu câu, gộp khoảng trắng
export const norm = s => String(s == null ? '' : s).toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '')
  .replace(/[’'`]/g, '').replace(/[^a-z0-9]+/g, ' ').trim();
const words = s => norm(s).split(' ').filter(Boolean);

export function shingles5(text) { const w = words(text), out = new Set(); for (let i = 0; i + 5 <= w.length; i++) out.add(w.slice(i, i + 5).join(' ')); return out; }

// tỉ lệ cụm 5 từ của a có trong b (a, b: chữ hoặc Set đã tính)
export function overlap(a, b) { const A = a instanceof Set ? a : shingles5(a), B = b instanceof Set ? b : shingles5(b); if (!A.size) return 0;
  let n = 0; for (const x of A) if (B.has(x)) n++; return n / A.size; }

// phần chữ dài của đề: bài đọc, lời nghe, tình huống thư / đề viết (dùng để so cụm 5 từ)
export const deText = de => !de ? '' : [de.text || '', ...(de.lines || []).map(l => (Array.isArray(l) ? l[1] : l) || '')].join(' \n ');
// câu hỏi đủ dài để so nguyên văn (bỏ câu ≤ 3 từ như "Question 1", câu hỏi Nói phổ biến không so vì đề thật cũng lặp)
export const deQs = de => !de ? [] : (de.groups || []).flatMap(g => (g.items || []).map(it => norm(it.q))).filter(q => q.split(' ').length > 3);

const near = (a, b) => { const A = new Set(words(a)), B = new Set(words(b)); if (A.size < 2 || B.size < 2) return norm(a) === norm(b) && !!norm(a);
  let n = 0; for (const x of A) if (B.has(x)) n++; return n / Math.max(A.size, B.size) >= 0.8; };

// olds: [{ chude, de }] mới nhất trước. o = { chude, goc }. Trả null (không trùng) hoặc { why, i } (lý do + chỉ số đề cũ bị trùng)
export function isDup(de, olds, o = {}) {
  const T = deText(de), long = words(T).length >= DUP_MIN_W, S = long ? shingles5(T) : null, Q = new Set(deQs(de));
  for (let i = 0; i < (olds || []).length; i++) { const x = olds[i] || {}, od = x.de || {};
    if (o.chude && !o.goc && x.chude === o.chude) return { why: 'cùng chủ đề', i };
    if (de.title && od.title && near(de.title, od.title)) return { why: 'tên đề gần giống', i };
    if (de.topic && od.topic && norm(de.topic) === norm(od.topic) && !o.goc) return { why: 'cùng chủ đề AI ghi', i };
    for (const q of deQs(od)) if (Q.has(q)) return { why: 'câu hỏi giống hệt', i };
    if (S && S.size) { const ot = deText(od); if (ot && overlap(S, ot) >= DUP_R) return { why: `bài giống ≥ ${Math.round(DUP_R * 100)}%`, i }; } }
  return null; }

// list: [{ k, t }]; used: Map(khoá → lần dùng cuối, ms) hoặc object. Chủ đề chưa dùng thì chọn ngẫu nhiên; hết thì chủ đề dùng lâu nhất + goc (đổi góc nhìn)
export function pickTopic(list, used, rnd = Math.random) { const U = used instanceof Map ? used : new Map(Object.entries(used || {}));
  const free = (list || []).filter(x => !U.has(x.k)); if (free.length) return { ...free[Math.floor(rnd() * free.length) % free.length], goc: false };
  const old = [...(list || [])].sort((a, b) => (U.get(a.k) || 0) - (U.get(b.k) || 0))[0]; return old ? { ...old, goc: true } : null; }
