// Áp sửa theo soát bài 32–35, 42–46, 54–56, 64–66
import fs from 'node:fs'; import vm from 'node:vm';
const D = '/tmp/claude-0/-home-user-English-CEFR/48c67d5c-dc08-58ba-be65-4b058158838d/scratchpad/bai/';
const bad = [];
const rep = (f, a, b) => { let s = fs.readFileSync(D + f, 'utf8'); const c = s.split(a).length - 1; if (c !== 1) { bad.push(`${f}: ${c} · ${a.slice(0, 50)}`); return; } fs.writeFileSync(D + f, s.replace(a, b)); };
const load = n => { const c = { WHO: {} }; vm.createContext(c); vm.runInContext(fs.readFileSync(D + `bai${n}.js`, 'utf8') + `;this.B=BAI${n}`, c); return c.B; };
const save = (n, B) => fs.writeFileSync(D + `bai${n}.js`, `const BAI${n} = ` + JSON.stringify(B, null, 1) + ';\n');
// A1: tên bài Nền nằm nhầm ở t (64–66)
const TNEW = { 64: ["Câu hỏi đuôi: isn't it?", 'Hiện tại hoàn thành: have worked … before', 'had better + V', 'So sánh hơn: much easier than', 'Who should I …? (hỏi nên làm gì)'],
  65: ["Why don't we + V? (gợi ý)", 'Bị động quá khứ: was postponed', 'How often …? (tần suất)', 'Have you … yet?', 'be going to + V'],
  66: ['Bị động tiếp diễn: is being inspected', "Hasn't … arrived? (ngạc nhiên vì chưa xảy ra)", 'Neither (không cái nào)', 'have to + V (bắt buộc)', 'Where can I …?'] };
for (const n of [64, 65, 66]) { const B = load(n); B.MU.filter(m => m.g === 'g').forEach((m, i) => { if (/Bài Nền liên quan:\s*$/.test(m.b1.vi)) { m.b1.vi = m.b1.vi.replace(/\s*$/, ' ') + m.t; m.t = TNEW[n][i]; } else bad.push(`bai${n} ${m.id} vi không trống`); }); save(n, B); }
// A2: tên bài Nền theo np.json (32–35)
const NEN = [['bai32.js', 'So sánh hơn · A2', 'So sánh hơn của tính từ · A1'], ['bai32.js', 'Câu bị động · B1', 'Câu bị động: hiện tại đơn và quá khứ đơn · A2'], ['bai32.js', 'Trạng từ chỉ khả năng · B1', 'Will và be going to · A2'], ['bai32.js', 'Rút gọn mệnh đề quan hệ · B2', 'Mệnh đề phân từ (-ing, V3) · B2'],
  ['bai33.js', 'Câu bị động · B1', 'Câu bị động: hiện tại đơn và quá khứ đơn · A2'], ['bai33.js', 'Some và any · A1', 'Danh từ đếm được, không đếm được; some / any · A1'], ['bai33.js', 'Make / let / have · B1', 'Have / get something done · B2'], ['bai33.js', 'Cách nói lịch sự · B1', 'Câu hỏi gián tiếp lịch sự · B2'],
  ['bai34.js', 'Hiện tại hoàn thành bị động · B1', 'Bị động các thì khác · B1'], ['bai34.js', 'Can / Could: xin và nhờ · A2', 'Could / can: nhờ, xin phép, khả năng trong quá khứ · A2'], ['bai34.js', 'Giới từ + V-ing · A2', 'V-ing làm chủ ngữ và sau giới từ · B1'], ['bai34.js', 'Động từ hai tân ngữ · B1', 'Đại từ tân ngữ · A1'],
  ['bai35.js', 'Will be: tương lai · A2', 'Will: dự đoán, đề nghị, quyết định tức thì · A2'], ['bai35.js', 'All và whole · B1', 'each / every / all / whole / both … and · B2'], ['bai35.js', 'Động từ + tân ngữ + to V · B1', 'Tường thuật lời yêu cầu, mệnh lệnh: tell / ask sb (not) to V · B1'],
  ['bai35.js', 'By: phương tiện và cách thức · A1', 'Giới từ chỉ chuyển động · A2'], ['bai35.js', 'It takes + thời gian · A2', 'Câu hỏi với từ để hỏi (Wh-) · Pre-A1']];
for (const [f, a, b] of NEN) rep(f, 'Bài Nền liên quan: ' + a, 'Bài Nền liên quan: ' + b);
// B: nội dung
rep('bai65.js', '"o":["later","late","lately","latest"]', '"o":["later","lately","latest","lateness"]');
rep('bai43.js', 'Friday is the ___ busy day of the week.', 'Friday is the ___ stressful day of the week.');
rep('bai42.js', 'o: ["at", "for", "to", "since"]', 'o: ["at", "of", "to", "since"]');
rep('bai66.js', '"o":["has","have","having","had"]', '"o":["has","have","having","does"]');
{ const B = load(55); let ok = 0; for (const m of B.MU) for (const q of m.b3 || []) if (/This elevator ___ up to ten people/.test(q.q)) { q.o = q.o.map(o => o === 'held' ? 'to hold' : o); ok++; } if (!ok) bad.push('bai55 elevator'); save(55, B); }
const add = (n, id, xs) => { const B = load(n), m = B.MU.find(x => x.id === id); if (!m) return bad.push(`bai${n} ${id}`); for (const x of xs) if (!m.b4.ans.includes(x)) m.b4.ans.push(x); save(n, B); };
add(34, 'v4', ['left', 'free', 'vacant', 'open']); add(35, 'v2', ['reschedule', 'postpone', 'push']); add(44, 'v5', ['postponed', 'delayed', 'rescheduled']); add(44, 'v6', ['programmers', 'programmer']);
add(45, 'v2', ['now']); add(55, 'v3', ['seats']); add(42, 'g4', ['could']); add(43, 'v4', ['instantly']); add(65, 'v1', ['put off']); add(54, 'v6', ['apologised']);
add(56, 'v1', ['present']); add(46, 'v7', ['guest']); add(66, 'g4', ['need']); add(46, 'g4', ['don’t']); add(46, 'g1', ['’ll']); add(64, 'g1', ['doesn’t']);
// C: dịch (L + VNK)
const tr = (n, a, b) => { const B = load(n); let c = 0; B.L.forEach(l => { if (l[2].includes(a)) { l[2] = l[2].replace(a, b); c++; } }); B.VNK.forEach(k => k.forEach((x, j) => { if (x.includes(a)) { k[j] = x.replace(a, b); c++; } })); if (c !== 2) bad.push(`bai${n} dịch ${c} · ${a}`); save(n, B); };
tr(32, 'được ghi nhận vào tháng Bảy thay vào đó.', 'được ghi nhận sang tháng Bảy.'); tr(34, 'bắt đầu vào thứ Bảy thay vào đó được không?', 'bắt đầu từ thứ Bảy được không?'); tr(55, 'hôm thứ Sáu chưa?', 'vào thứ Sáu chưa?');
rep('bai65.js', '"hint":"tính từ · 10 chữ cái"', '"hint":"danh từ · 10 chữ cái"');
console.log(bad.length ? 'KHÔNG ÁP:\n' + bad.join('\n') : 'áp hết');
