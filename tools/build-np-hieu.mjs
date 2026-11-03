// v101 🧱 Ngữ pháp 5 bậc: gộp câu kiểm tra hiểu (bậc 1 · Hiểu, content/np-hieu.json) và nhóm điểm dễ nhầm (bậc 4 · Phân biệt, content/np-nhom.json) vào np.json.
// Chạy lại được nhiều lần (ghi đè trường hieu / nhom). build-b.mjs giữ nguyên các trường này khi dựng lại điểm B1 → C2. Chạy: node tools/build-np-hieu.mjs
import fs from 'node:fs';
const root = new URL('..', import.meta.url).pathname, J = f => JSON.parse(fs.readFileSync(root + f, 'utf8'));
const NP = J('np.json'), H = J('content/np-hieu.json').hieu, N = J('content/np-nhom.json').nhom;
// v124: điểm ngữ pháp bổ sung (content/np-add.json, id g-x… để build-b.mjs không xoá): gộp lại mỗi lần chạy, đặt sau điểm cuối của cùng cấp
const ADD = J('content/np-add.json').items, ADDID = new Set(ADD.map(x => x.id)); NP.items = NP.items.filter(x => !ADDID.has(x.id));
for (const x of ADD) { if (!x.mc || !x.ty || !x.fx || x.mc.learn.some(m => m.w.length !== 2 || m.w.includes(m.a)) || x.ex.length < 2) throw new Error('điểm bổ sung hỏng: ' + x.id); NP.items.splice(NP.items.map(y => y.lv).lastIndexOf(x.lv) + 1, 0, x); }
const ids = new Set(NP.items.map(x => x.id));
for (const id of [...Object.keys(H), ...N.flatMap(n => n.ids)]) if (!ids.has(id)) throw new Error('không có điểm ngữ pháp: ' + id);
for (const [id, qs] of Object.entries(H)) for (const q of qs) if (!q.s || !q.q || !q.a || q.w.length !== 2 || q.w.includes(q.a)) throw new Error('câu hiểu hỏng: ' + id);
for (const x of NP.items) { if (H[x.id]) x.hieu = H[x.id]; else if (!ADDID.has(x.id)) delete x.hieu; }
NP.nhom = N;
fs.writeFileSync(root + 'np.json', JSON.stringify(NP));
console.log(`np.json: + ${ADD.length} điểm bổ sung · câu kiểm tra hiểu ${Object.values(H).flat().length} câu / ${Object.keys(H).length} điểm · ${N.length} nhóm dễ nhầm`);
