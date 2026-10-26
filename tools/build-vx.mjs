// Dựng vx.json: dữ liệu thêm cho 12 yêu cầu Nhớ của Từ vựng (26/10/2026): irr = dạng bất quy tắc (#8, #12), rel = đồng / trái nghĩa (#10), s2 = nghĩa thứ hai (#11).
// Nguồn: content/irr.json, content/rel.json, content/sense2.json. Chạy: node tools/build-vx.mjs
import fs from 'node:fs';
const r = f => JSON.parse(fs.readFileSync('content/' + f, 'utf8')).w;
const o = { irr: r('irr.json'), rel: r('rel.json'), s2: r('sense2.json') };
fs.writeFileSync('vx.json', JSON.stringify(o));
console.log('vx.json', Object.entries(o).map(([k, v]) => `${k} ${Object.keys(v).length}`).join(' · '));
