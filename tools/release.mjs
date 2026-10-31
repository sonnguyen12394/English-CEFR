// Phát hành (v86, 29/10/2026): chỉ tăng số phiên bản khi bộ kiểm xanh. Chạy: node tools/release.mjs
// 1. chạy tools/test/run.mjs (đỏ → dừng, không đổi gì); 2. thử tools/test/e2e-webkit.mjs (máy không có WebKit → ghi "chưa kiểm trên iPhone");
// 3. tăng APP_V (app.js), ?v= (index.html), "v" (version.json) cùng một số; 4. in danh sách kiểm 5 phút trên iPhone thật cho người sáng lập.
// Chỉ đổi 3 tệp trên; commit / push tự làm sau.
import { spawnSync } from 'node:child_process'; import fs from 'node:fs';
const root = new URL('..', import.meta.url).pathname, rd = f => fs.readFileSync(root + f, 'utf8'), wr = (f, s) => fs.writeFileSync(root + f, s);
const run = f => spawnSync('node', [root + f], { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], timeout: 20 * 60 * 1000 });

console.log('① Chạy tools/test/run.mjs …');
const t = run('tools/test/run.mjs'), out = (t.stdout || '') + (t.stderr || ''), red = out.split('\n').filter(l => l.startsWith('❌'));
if (t.status !== 0 || red.length) { console.log(red.join('\n') || out.slice(-2000)); console.log('\n⛔ Bộ kiểm chưa xanh: KHÔNG phát hành.'); process.exit(1); }
console.log('   ✅ xanh hết');

console.log('② Chạy tools/test/e2e-webkit.mjs …');
const w = run('tools/test/e2e-webkit.mjs'), wo = (w.stdout || '') + (w.stderr || '');
const noWk = /Executable doesn't exist|playwright install|Cannot find module/i.test(wo);
if (!noWk && w.status !== 0) { console.log(wo.slice(-2000)); console.log('\n⛔ Kiểm WebKit (iPhone giả lập) đỏ: KHÔNG phát hành.'); process.exit(1); }
const iphone = noWk ? 'chưa kiểm trên iPhone (máy này không có WebKit)' : 'WebKit giả lập iPhone 13: xanh (vẫn nên thử máy thật)';
console.log('   ' + iphone);

const v0 = +rd('version.json').match(/"v":\s*(\d+)/)[1], app = rd('app.js'), va = +app.match(/const APP_V = (\d+);/)[1];
if (va !== v0) { console.log(`⛔ APP_V (${va}) khác version.json (${v0}): sửa cho khớp rồi chạy lại.`); process.exit(1); }
const v = v0 + 1;
wr('app.js', app.replace(/const APP_V = \d+;/, `const APP_V = ${v};`));
wr('index.html', rd('index.html').replace(/\?v=\d+/g, `?v=${v}`));
wr('version.json', `{"v": ${v}}\n`);
console.log(`③ Đã tăng phiên bản ${v0} → ${v} (app.js, index.html, version.json).`);
console.log(`\n📱 Kiểm trên iPhone thật (~5 phút, Safari) sau khi đẩy lên:
  1. Mở trang, đợi tự cập nhật; 👤 Của tôi → 💾 Dữ liệu thấy đúng bản ${v}? (góc dưới / dòng phiên bản)
  2. 🎯 Học: ô 📅 Hôm nay đổi được phút (ô chọn); nút ôn chung, bài mới, kỹ năng mở đúng màn.
  3. Làm 5 câu 📚 Từ vựng: "Đã lưu" hiện, tắt mở lại app vẫn còn.
  4. 🎓 Luyện thi → 🎓 Cambridge, 🌏 IELTS, 💼 TOEIC mở được; 📖 Tra cứu → 📘 Cẩm nang thi; 👤 Của tôi → bản đồ, sổ từ, dữ liệu, nút về đúng; 💬 Góp ý gửi được.
  5. Không có chữ tràn ngang, nút bấm được bằng ngón cái.
Ghi vào commit: "iPhone: ${noWk ? 'chưa kiểm' : 'WebKit giả lập xanh'}".`);
