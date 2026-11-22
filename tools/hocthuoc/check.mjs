// Máy kiểm khuôn bài học thuộc: node check.mjs baiN.js [baiN.in.json]
// In "OK" hoặc danh sách lỗi. Kiểm cấu trúc, không kiểm đúng sai kiến thức (việc của người soát).
import fs from 'node:fs'; import vm from 'node:vm';
const f = process.argv[2], n = f.match(/bai(\d+)\.js$/)[1], inp = JSON.parse(fs.readFileSync(f.replace(/\.js$/, '.in.json')));
const ctx = { WHO: { A: [], B: [], C: [], N: [], W: [] } }; vm.createContext(ctx);
vm.runInContext(fs.readFileSync(f, 'utf8') + `\n;this.B = BAI${n};`, ctx); const B = ctx.B, E = [];
const words = t => t.split(/\s+/), err = m => E.push(m);
if (!B.meta || !B.meta.t || !B.meta.de || !B.meta.dang || !B.meta.sub) err('meta thiếu t / de / dang / sub');
if (+n >= 13) { const who = (B.meta || {}).who || {}; for (const sp of new Set(B.L.map(l => l[0]))) if (!Array.isArray(who[sp]) || who[sp].length !== 2) err(`meta.who thiếu người nói ${sp}: [vai, nhãn ngắn]`); }
if (B.L.length !== inp.L.length) err(`L có ${B.L.length} câu, đầu vào ${inp.L.length}`);
B.L.forEach((l, i) => { const g = inp.L[i]; if (!g) return; if (l[0] !== g[0] || l[1] !== g[1] || l[3] !== g[3]) err(`L[${i}] phải giữ nguyên người nói, câu tiếng Anh, mã giọng của đầu vào`); if (!l[2]) err(`L[${i}] thiếu dịch`); });
const per = ['IPA', 'STR', 'LK', 'INT', 'PAU', 'EL', 'VNK', 'VNY'];
for (const k of per) if (!Array.isArray(B[k]) || B[k].length !== B.L.length) err(`${k} phải có đúng ${B.L.length} phần (mỗi câu một)`);
B.L.forEach((l, i) => { const W = words(l[1]).length;
  if (B.IPA[i] && B.IPA[i].length !== W) err(`IPA câu ${i}: ${B.IPA[i].length} từ, câu có ${W} từ`);
  (B.STR[i] || []).forEach(j => { if (j < 0 || j >= W) err(`STR câu ${i}: chỉ số ${j} ngoài câu`); });
  (B.LK[i] || []).forEach(x => { if (!(x[0] >= 0 && x[0] < W - 1) || x.length !== 3) err(`LK câu ${i}: ${JSON.stringify(x)}`); });
  (B.EL[i] || []).forEach(x => { if (!(x[0] >= 0 && x[0] < W) || x.length !== 3 || !/\(.+\)|ʔ/.test(x[1])) err(`EL câu ${i}: ${JSON.stringify(x)} (cần [từ thứ, phiên âm có ( ), giải thích])`); });
  (B.INT[i] || []).forEach(x => { if (!(x[0] >= 0 && x[0] < W) || !['↘', '↗'].includes(x[1])) err(`INT câu ${i}: ${JSON.stringify(x)}`); });
  (B.PAU[i] || []).forEach(j => { if (j < 0 || j >= W - 1) err(`PAU câu ${i}: ${j}`); });
  const vk = (B.VNK[i] || []).join(' ').replace(/\s+/g, ' ').trim(); if (vk !== l[2].replace(/\s+/g, ' ').trim()) err(`VNK câu ${i} ghép lại phải đúng bằng bản dịch L[${i}][2]`);
  if ((B.VNK[i] || []).length < (W > 4 ? 2 : 1)) err(`VNK câu ${i}: cần ≥ 2 cụm`);
  if (new Set(B.VNK[i]).size !== (B.VNK[i] || []).length) err(`VNK câu ${i}: cụm trùng nhau`);
  (B.VNY[i] || []).forEach(y => { if (!Array.isArray(y) || !y.length) err(`VNY câu ${i}: mỗi ý là mảng cách nói`); y.forEach(a => { if (a.length < 3 && !/^\d+$/.test(a)) err(`VNY câu ${i}: cách nói quá ngắn "${a}"`); }); }); });
if (!Array.isArray(B.CUM) || B.CUM.length !== 7) err('CUM cần 7 cụm');
const qok = (q, w) => { if (!q || !q.q || !Array.isArray(q.o) || q.o.length !== 4 || q.a !== 0 || !q.vi) err(`${w}: cần { q, o: 4 phương án, a: 0 (đáp án đứng đầu), vi }`); else if (new Set(q.o).size !== 4) err(`${w}: phương án trùng`); };
if (!Array.isArray(B.EXQ) || B.EXQ.length < 3) err('EXQ cần ≥ 3 câu'); (B.EXQ || []).forEach((q, j) => qok(q, 'EXQ ' + j));
if (!Array.isArray(B.NEWQ2) || B.NEWQ2.length !== 7) err('NEWQ2 cần 7 câu'); (B.NEWQ2 || []).forEach((q, j) => { qok(q, 'NEWQ2 ' + j); if (q.q && !q.q.includes('___')) err(`NEWQ2 ${j}: thiếu ___`); });
const M = B.MU || []; if (M.length !== 12 || M.filter(m => m.g === 'v').length !== 7 || M.filter(m => m.g === 'g').length !== 5) err('MU cần 12 mục: 7 g:"v" rồi 5 g:"g"');
const ids = new Set(); M.forEach(m => { const w = 'MU ' + m.id; if (ids.has(m.id)) err(w + ': id trùng'); ids.add(m.id);
  if (!m.t || !(m.line >= 0 && m.line < B.L.length) || !m.hl) return err(w + ': thiếu t / line / hl');
  if (!B.L[m.line][1].includes(m.hl)) err(`${w}: hl "${m.hl}" không có nguyên văn trong câu ${m.line}`);
  qok(m.b1, w + '.b1'); qok(m.b2, w + '.b2'); if (m.b1 && m.b1.s) { const t = m.b1.s.replace(/\[\[|\]\]/g, ''); if (!B.L.some(l => l[1].includes(t))) err(`${w}.b1.s phải chép nguyên văn từ bài: "${t}"`); if (!/\[\[.+\]\]/.test(m.b1.s)) err(`${w}.b1.s thiếu [[ ]]`); } else err(w + '.b1 thiếu s');
  if (!/^Câu mới: /.test(m.b2 && m.b2.q || '')) err(`${w}.b2.q phải bắt đầu "Câu mới: "`);
  const n3 = m.g === 'v' ? 1 : 2; if (!Array.isArray(m.b3) || m.b3.length !== n3) err(`${w}.b3 cần ${n3} câu`); (m.b3 || []).forEach((q, j) => { qok(q, `${w}.b3[${j}]`); if (q.q && !q.q.includes('___') && !/^Câu nào/.test(q.q)) err(`${w}.b3[${j}] thiếu ___`); });
  const b4 = m.b4; if (!b4 || !b4.q || !b4.q.includes('___') || !b4.hint || !Array.isArray(b4.ans) || !b4.ans.length || !b4.vi) err(`${w}.b4 cần { q có ___, hint, ans: [..], vi }`);
  // câu mới không được là câu của bài
  for (const q of [m.b2, ...(m.b3 || []), b4]) if (q && q.q && B.L.some(l => q.q.includes(l[1].slice(0, 40)))) err(`${w}: câu luyện chép câu của bài, phải là câu mới`); });
console.log(E.length ? E.map(e => '✗ ' + e).join('\n') : 'OK bài ' + n);
process.exit(E.length ? 1 : 0);
