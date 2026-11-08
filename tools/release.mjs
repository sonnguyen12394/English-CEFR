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
  1. Mở trang, đợi tự cập nhật; 👤 Tôi → 💾 Dữ liệu thấy đúng bản ${v}? (góc dưới / dòng phiên bản)
  2. 🧭 Lộ trình → 📅 Hôm nay: vòng phút, bấm ▶ Học tiếp mở đúng việc; ở màn bài có dải "🧭 Hôm nay còn N việc" bấm về được; 📈 Tiến độ ra trình độ, đường cấp, chỗ yếu, "Xem bản đồ chỗ yếu đầy đủ".
  3. Làm 5 câu 📚 Từ vựng: "Đã lưu" hiện, tắt mở lại app vẫn còn.
  4. 📚 Học: thẻ "Tiếng Anh {cấp}" mở được 7 kỹ năng, Xem thêm → cấp khác; 🔍 Tra cứu tìm được một từ; 👤 Tôi → sổ từ, 💾 dữ liệu (🛠 công cụ người sáng lập gập ở cuối), nút về đúng; 🗺 bản đồ: hàng chọn chỉ Nền + kỳ thi mục tiêu; 💬 Góp ý gửi được.
  5. Không có chữ tràn ngang, nút bấm được bằng ngón cái.
  6. (v141) Thanh dưới 5 mục đọc rõ, bấm trúng; 📚 Học chỉ còn Nền + dòng "Luyện … ở tab 🎯 Luyện đề ›"; tab 🎯 Luyện đề mở kỳ thi của mục tiêu, hàng chọn Cambridge · IELTS · TOEIC không cắt chữ;
     ô 🤖 bấm ▶ Làm đề AI mới (cần khoá AI đã cài): màn chờ, khoá máy rồi mở lại vẫn thấy đề; làm 1 đề Nghe (2 giọng khác nhau).
  7. (v142) Tab 🎯 Luyện đề mở màn 2 nút 📚 Đề có sẵn · 🤖 Đề AI soạn, thấy cả 2 nút không cuộn (Cambridge: chip cấp ở dưới); bấm 📚 ra ô kỹ năng, không có nút gọi AI;
     "‹ Luyện đề" về màn 2 nút; bấm 🤖 ra ô AI + ô "Bài có sẵn · miễn phí" bấm sang đúng kỹ năng; bật giao diện tối: chữ trắng trên nút xanh đọc rõ, link không còn xanh đậm khó đọc.
  8. (v143) 🎯 Luyện đề → Cambridge B1 → 📚 Đề có sẵn → ✍️ Viết: bài học theo thể loại (email, bài báo, truyện) + tiêu chí chấm; 🗣 Nói A2 trở lên: thảo luận cặp 4 lượt với bạn thi máy.
  9. (v144) 🎯 Luyện đề → IELTS → 🤖 Đề AI soạn → 📰 Đọc: có câu "1 bài đọc như đề thật: 13 câu, 20 phút"; Cambridge Starters / Movers: không có ô ✍️ Viết AI;
     (cần khoá AI) làm 1 đề Đọc IELTS: đầu đề ghi "📋 IELTS Academic Reading · one passage", câu theo thứ tự bài, cuộn bài dài không giật.
  10. (v145) 🎯 Luyện đề → IELTS → 🤖: ghi "Còn N đề soạn sẵn"; bấm ▶ Làm đề mới mở ngay bài đọc dài (không màn chờ); làm xong bấm lại ra bài khác;
     ở chỗ chấm Viết bấm 📋 Chép lời nhắc chấm → dán được vào Claude / ChatGPT.
Ghi vào commit: "iPhone: ${noWk ? 'chưa kiểm' : 'WebKit giả lập xanh'}".`);
