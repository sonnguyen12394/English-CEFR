// Gộp câu i với i+1 (câu bị cắt sau Dr. / A.M. khi dựng giọng): node merge.mjs N i
import fs from 'node:fs'; import vm from 'node:vm';
const D = '/tmp/claude-0/-home-user-English-CEFR/48c67d5c-dc08-58ba-be65-4b058158838d/scratchpad/bai/';
const n = +process.argv[2], i = +process.argv[3];
const c = { WHO: {} }; vm.createContext(c); vm.runInContext(fs.readFileSync(D + `bai${n}.js`, 'utf8') + `;this.B=BAI${n}`, c); const B = c.B;
const a = B.L[i], b = B.L[i + 1], k = a[1].split(/\s+/).length;
B.L.splice(i, 2, [a[0], a[1] + ' ' + b[1], (a[2] + ' ' + b[2]).replace(/\s+/g, ' ').trim(), [a[3], b[3]].filter(Boolean).join('+')]);
const mg = (key, f) => { const x = B[key]; x.splice(i, 2, [...x[i], ...x[i + 1].map(f)]); };
mg('IPA', v => v); mg('STR', j => j + k); mg('PAU', j => j + k); for (const key of ['LK', 'EL', 'INT']) mg(key, e => [e[0] + k, ...e.slice(1)]);
B.INT[i] = B.INT[i].filter(e => e[0] >= k || !B.INT[i].some(f => f[0] >= k));   // bỏ ngữ điệu "cuối câu" giả ở chỗ bị cắt
mg('VNK', v => v); mg('VNY', v => v);
B.VNK[i] = B.VNK[i]; B.L[i][2] = B.VNK[i].join(' ');
for (const m of B.MU) if (m.line > i) m.line--;
fs.writeFileSync(D + `bai${n}.js`, `const BAI${n} = ` + JSON.stringify(B, null, 1) + ';\n');
const inp = JSON.parse(fs.readFileSync(D + `bai${n}.in.json`)); inp.L.splice(i, 2, [B.L[i][0], B.L[i][1], '', B.L[i][3]]); fs.writeFileSync(D + `bai${n}.in.json`, JSON.stringify(inp, null, 1));
console.log('gộp bài', n, 'câu', i, ':', B.L[i][1].slice(0, 90), '|', B.L[i][2].slice(0, 90));
