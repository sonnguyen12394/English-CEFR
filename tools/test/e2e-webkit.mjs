// Kiểm giao diện trên WebKit giả lập iPhone 13 (tiêu chí X6, docs/HOAN-THIEN.md). Không mạng, Supabase giả (fake-sb.js), không ghi dữ liệu thật.
// Chạy: node tools/test/e2e-webkit.mjs   (cần Playwright + WebKit: npx playwright install webkit && npx playwright install-deps webkit)
// Mỗi cấp Pre-A1, A1, A2, B1, B2, C1, C2: học 1 bài Từ vựng (trả lời đúng), mở bài học của mọi phần, mở Thi chuyển cấp mọi phần, làm trọn thi Từ vựng → phải qua.
import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path'; import { createRequire } from 'node:module';
const root = new URL('../..', import.meta.url).pathname, req = createRequire(import.meta.url);
let pw; for (const p of ['playwright', '/opt/node22/lib/node_modules/playwright', process.env.PW].filter(Boolean)) { try { pw = req(p); break; } catch (e) {} }
if (!pw) { console.log('Không có Playwright: chưa kiểm được WebKit.'); process.exit(2); }
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json', '.mp3': 'audio/mpeg', '.png': 'image/png' };
const srv = http.createServer((q, r) => { const f = path.join(root, decodeURIComponent(q.url.split('?')[0])); if (!f.startsWith(root) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { r.writeHead(404); return r.end(); } r.writeHead(200, { 'content-type': MIME[path.extname(f)] || 'application/octet-stream' }); fs.createReadStream(f).pipe(r); }).listen(0);
const port = srv.address().port, b = await pw.webkit.launch(), ctx = await b.newContext({ ...pw.devices['iPhone 13'] }), pg = await ctx.newPage();
const errs = []; pg.on('pageerror', e => errs.push(e.message)); pg.on('dialog', d => d.accept());
// Playwright ưu tiên route đăng ký sau: chặn mạng trước, rồi trả Supabase giả
await ctx.route(/supabase\.co|jsdelivr|huggingface/, r => r.abort());
await ctx.route(/supabase-js/, r => r.fulfill({ contentType: 'text/javascript', body: fs.readFileSync(new URL('fake-sb.js', import.meta.url), 'utf8') }));
const ok = [], bad = [], check = (n, c, m = '') => (c ? ok : bad).push(n + (m ? ': ' + m : ''));
const cur = () => pg.evaluate(() => { const m = (window.CUR.item || '').split(':'); const w = WBY[m[1]]; return w ? { t: m[2], w: w.w, vi: w.vi, cz: w.cloze && w.cloze.a, col: w.col && w.col.ok, irr: w.irr ? w.irr.f.map(f => f[1][0]) : [], rel: w.rel ? [...w.rel.syn, ...w.rel.ant] : [], s2: w.s2 && w.s2.vi, f: typeof EB !== 'undefined' && EB && EB[w.id] && EB[w.id].f } : null; });
// trả lời đúng mọi câu Từ vựng (bài học, luyện, thi) tới khi hết câu
async function answerAll(max = 200) { let n = 0;
  for (; n < max; n++) { const c = await cur(); if (!c || !(await pg.$('[data-k], #ti'))) break;
    const qa = await pg.evaluate(() => window.CUR_Q && window.CUR_Q.a);
    if (qa != null && await pg.$('#ti')) { await pg.fill('#ti', String(qa)); await pg.click('#tf button[type=submit]'); }
    else if (qa != null && await pg.$('[data-k]')) { const o = await pg.$$eval('[data-k]', bs => bs.map(b => b.innerText.trim())); let k = o.indexOf(String(qa).trim()); if (k < 0) k = 0; await pg.click(`[data-k="${k}"]`); }
    else if (await pg.$('#ti')) { const want = c.t === 'clozeT' ? c.cz : c.t === 'xT' ? c.f : c.t === 'irrT' || c.t === 'xI' ? await pg.evaluate(() => document.querySelector('.q').textContent) : c.w;
      let v = want; if (c.t === 'irrT' || c.t === 'xI') { const lab = v.match(/^(.*) của/)[1].toLowerCase(); v = await pg.evaluate(([w, lab]) => { const x = WORDS.find(y => y.w === w); const f = x.irr.f.find(f => f[0].toLowerCase() === lab); return f[1][0]; }, [c.w, lab]); }
      await pg.fill('#ti', v); await pg.click('#tf button[type=submit]'); }
    else { const o = await pg.$$eval('[data-k]', bs => bs.map(b => b.innerText)); let k = o.findIndex(x => [c.w, c.vi, c.col, c.s2, ...c.irr].includes(x)); if (k < 0) k = o.findIndex(x => c.rel.includes(x)); if (k < 0) k = 0; await pg.click(`[data-k="${k}"]`); }
    await pg.waitForTimeout(30); const go = await pg.$('[data-a="go"]'); if (go) await go.click(); await pg.waitForTimeout(30); }
  return n; }
await pg.goto(`http://localhost:${port}/index.html`); await pg.waitForTimeout(2500);
await pg.evaluate(() => { try { localStorage.setItem('ovTools', '1'); } catch (e) {} });   // mở sẵn mục 🧰 (v74) để bấm các nút bên trong
check('mở trang', await pg.$('#ov'));
const PREV = { pre: null, a1: 'pre', a2: 'a1', b1: 'a2p', b2: 'b1p', c1: 'b2p', c2: 'c1' };
for (const lv of (process.env.LVS ? process.env.LVS.split(',') : ['pre', 'a1', 'a2', 'b1', 'b2', 'c1', 'c2'])) {
  await pg.evaluate(async p => { S = blank(); if (p) await bkSet('all', p, 'dat'); }, PREV[lv]);
  // học 1 bài Từ vựng
  await pg.evaluate(lv => learn(UNITS.find(u => u.lv === lv)), lv); await pg.waitForTimeout(200); if (await pg.$('[data-pt="skip"]')) { await pg.click('[data-pt="skip"]'); await pg.waitForTimeout(200); } let n = 0; while (await pg.$('[data-a="next"]')) { await pg.click('[data-a="next"]'); await pg.waitForTimeout(20); if (++n > 20) break; }
  const q = await answerAll(); const done = (await pg.innerText('#app')).includes('✅ Xong'); check(`${lv} học bài Từ vựng (${q} câu)`, done);
  // mọi phần: màn chính, bài học đầu, mở thi
  for (const id of await pg.evaluate(lv => Object.values(KIT).filter(P => P.lvs.includes(lv)).map(P => P.id), lv)) {
    await pg.evaluate(id => kView(id), id); await pg.waitForTimeout(500); check(`${lv} ${id} màn chính`, (await pg.innerText('#app')).includes('📘 Học'));
    await pg.evaluate(([id, lv]) => kLearn(KIT[id], kItems(KIT[id], lv)[0]), [id, lv]); await pg.waitForTimeout(200); check(`${lv} ${id} bài học`, (await pg.innerText('#app')).length > 50);
    if (id !== 'noi') { await pg.evaluate(([id, lv]) => kExam(KIT[id], lv), [id, lv]); await pg.waitForTimeout(300); check(`${lv} ${id} mở thi`, !!(await pg.$('[data-k], #ti, textarea, [data-kdlg], button'))); } }
  await pg.evaluate(() => paView()); await pg.waitForTimeout(500); check(`${lv} phát âm màn chính`, (await pg.innerText('#app')).includes('Phát âm'));
  // thi Từ vựng: đặt Nhớ đủ rồi làm hết, phải qua
  await pg.evaluate(async ([lv, p]) => { await bkSet('tv', lv, 'nho'); if (p) xs().runs.push({ lv: p, at: Date.now(), n: 30, ok: 30, pass: true }); await exam(lv); }, [lv, PREV[lv]]);
  await pg.waitForTimeout(400); let t = await answerAll(120); let tx = await pg.innerText('#app');
  if (tx.includes('Làm vòng 2')) { await pg.click('[data-a="r2"]'); t += await answerAll(120); tx = await pg.innerText('#app'); }
  check(`${lv} thi Từ vựng (${t} câu)`, /Qua/.test(tx), tx.slice(0, 80).replace(/\n/g, ' '));
  await pg.evaluate(lv => overview(lv), lv); await pg.waitForTimeout(400); check(`${lv} tổng quan`, (await pg.innerText('#app')).includes('Tổng quan học'));
}
// 🎓 đề thử B1: mở từ Tổng quan, làm trọn bài Đọc (chọn đáp án đầu / gõ chữ), phải ra màn kết quả
await pg.evaluate(() => overview('b1')); await pg.waitForTimeout(400); await pg.click('[data-mock="b1"]'); await pg.waitForTimeout(1500);
check('đề thử mở', (await pg.innerText('#app')).includes('B1 Preliminary'));
await pg.click('[data-mk="0"]'); await pg.waitForTimeout(400);
for (let n = 0; n < 80; n++) { if (await pg.$('[data-ko]')) await pg.click('[data-ko="0"]'); else if (await pg.$('#kt')) { await pg.fill('#kt', 'test answer'); await pg.click('#kf button[type=submit]'); } else break; await pg.waitForTimeout(30); }
check('đề thử ra kết quả', (await pg.innerText('#app')).includes('Kết quả'));
await pg.evaluate(() => overview('b1')); await pg.waitForTimeout(400); { const tx = await pg.innerText('#app'); check('ô Sẵn sàng thi + Đọc nghe thêm', tx.includes('Sẵn sàng thi') && tx.includes('Đọc nghe thêm')); }
// 🧩 dạng đề thật B2: mở từ Tổng quan, làm trọn một lượt viết lại câu và một bài nối đoạn
await pg.evaluate(() => overview('b2')); await pg.waitForTimeout(600); await pg.click('[data-uoe="b2"]'); await pg.waitForTimeout(800);
check('dạng đề thật mở', (await pg.innerText('#app')).includes('Luyện dạng đề thật'));
for (const k of ['kwt', 'pm']) { await pg.click(`[data-ut="${k}"]`); await pg.waitForTimeout(300);
  for (let n = 0; n < 20; n++) { if (await pg.$('#ut')) { await pg.fill('#ut', 'x'); await pg.click('#uf button[type=submit]'); }
    else if (await pg.$('[data-uo]:not([disabled])')) await pg.click('[data-uo="0"]'); else break; await pg.waitForTimeout(50); if (await pg.$('[data-a="next"]')) await pg.click('[data-a="next"]'); await pg.waitForTimeout(50); }
  const tx = await pg.innerText('#app'); check(`dạng đề ${k} ra kết quả`, /câu đúng/.test(tx), tx.slice(0, 80)); await pg.click('[data-a="back"]'); await pg.waitForTimeout(300); }
// 🎧 nghe điền thông tin B1: mở từ Tổng quan, điền phiếu, nộp → ra kết quả; nhại theo mở được
await pg.evaluate(() => overview('b1')); await pg.waitForTimeout(600); await pg.click('[data-ng="nf|b1"]'); await pg.waitForTimeout(1200);
check('nghe điền mở', !!(await pg.$('[data-nf="0"]'))); await pg.fill('[data-nf="0"]', 'x'); await pg.click('#nf button[type=submit]'); await pg.waitForTimeout(300);
check('nghe điền ra kết quả', /chỗ đúng/.test(await pg.innerText('#app')));
await pg.evaluate(() => overview('b1')); await pg.waitForTimeout(600); await pg.click('[data-ng="sh|b1"]'); await pg.waitForTimeout(1200);
check('nhại theo mở', (await pg.innerText('#app')).includes('Nhại theo'));
// 👥 nói theo cặp B2: mở, chọn đề (WebKit giả lập không chép lời: gõ lượt), làm trọn 6 lượt → ra kết quả
await pg.evaluate(() => overview('b2')); await pg.waitForTimeout(600); await pg.click('[data-cap="b2"]'); await pg.waitForTimeout(1000);
check('nói cặp mở', (await pg.innerText('#app')).includes('Nói theo cặp')); await pg.click('[data-capt]'); 
for (let n = 0; n < 6; n++) { await pg.waitForSelector('#capt, [data-a="rec"]', { timeout: 30000 }).catch(() => {}); if (!(await pg.$('#capt'))) break; await pg.fill('#capt', 'I agree because it is cheap. What do you think?'); await pg.click('[data-a="typed"]'); }
await pg.waitForTimeout(800); check('nói cặp ra kết quả', /tương tác|luyện thêm/.test(await pg.innerText('#app')));
// 📚 thư viện: mở từ Tổng quan B2, mở truyện, chạm một từ → hiện ô tra từ, lật trang
await pg.evaluate(() => overview('b2')); await pg.waitForTimeout(600); await pg.click('[data-lib="b2"]'); await pg.waitForTimeout(800);
check('thư viện mở', (await pg.innerText('#app')).includes('Thư viện đọc')); await pg.click('[data-lb]'); await pg.waitForTimeout(800);
await pg.click('#libp [data-lw]:nth-child(3)'); await pg.waitForTimeout(200); check('thư viện tra từ', await pg.isVisible('#libw'));
await pg.click('[data-a="next"]'); await pg.waitForTimeout(400); check('thư viện lật trang', /· 2\//.test(await pg.innerText('.uname')));
// 📝 tóm tắt 2 đoạn C2: mở, nộp bài mẫu → báo đủ ý
await pg.evaluate(() => uoeView('c2')); await pg.waitForTimeout(600); await pg.click('[data-ut="sum"]'); await pg.waitForTimeout(400);
await pg.fill('#ut', await pg.evaluate(() => kModel(UOE.sum.find(x => document.body.innerText.includes(x.en))))); await pg.click('#uf button[type=submit]'); await pg.waitForTimeout(300);
check('tóm tắt C2 chấm bài mẫu', /Đúng/.test(await pg.innerText('#ufb')));
// 🌏 Học IELTS (v68): mở từ thanh dưới; luyện cả bài Đọc → ra kết quả; Viết Task 2 nộp bài mẫu → máy ước band; đề thử bài Đọc làm trọn → ra band
await pg.evaluate(() => overview()); await pg.waitForTimeout(400); await pg.click('#tabs [data-tab="ie"]'); await pg.waitForTimeout(1500);
check('IELTS mở từ thanh dưới', !!(await pg.$('#ie')) && await pg.isVisible('#tabs [data-tab="ie"].on'));
await pg.fill('#iedate', new Date(Date.now() + 60 * 864e5).toISOString().slice(0, 10)); await pg.dispatchEvent('#iedate', 'change'); await pg.waitForTimeout(800);
check('IELTS kế hoạch theo ngày thi', /Còn \d+ tuần/.test(await pg.innerText('#app')) && !!(await pg.$('button.pri[data-iel], button.pri[data-ier], button.pri[data-iew], button.pri[data-ies], button.pri[data-err], button.pri[data-iemk]')));
await pg.click('[data-ier="all"]'); await pg.waitForTimeout(400);
for (let n = 0; n < 30; n++) { if (await pg.$('#it:not([disabled])')) { await pg.fill('#it', 'x'); await pg.click('#if button[type=submit]'); } else if (await pg.$('[data-io]:not([disabled])')) await pg.click('[data-io="0"]'); else break;
  await pg.waitForTimeout(50); if (await pg.$('[data-a="next"]')) await pg.click('[data-a="next"]'); await pg.waitForTimeout(50); }
check('IELTS đọc ra kết quả', /câu đúng/.test(await pg.innerText('#app'))); await pg.click('[data-a="back"]'); await pg.waitForTimeout(500);
await pg.click('[data-iew="t2"]'); await pg.waitForTimeout(300); await pg.fill('#iwt', await pg.evaluate(() => IE.t2[0].m)); await pg.click('#iwf button[type=submit]'); await pg.waitForTimeout(300);
check('IELTS viết máy ước band', /Máy ước: band/.test(await pg.innerText('#app'))); await pg.click('[data-a="back"]'); await pg.waitForTimeout(500);
await pg.click('[data-iemk="1"]'); await pg.waitForTimeout(1500);
for (let n = 0; n < 80; n++) { if (await pg.$('#kt')) { await pg.fill('#kt', 'x'); await pg.click('#kf button[type=submit]'); } else if (await pg.$('[data-ko]')) await pg.click('[data-ko="0"]'); else break; await pg.waitForTimeout(40); }
check('IELTS đề thử Đọc ra band', /Kết quả IELTS/.test(await pg.innerText('#app')));
// 💼 TOEIC (v72): chuyển từ IELTS sang TOEIC trong 🎓 Luyện thi; luyện Part 5 trọn bài → ra kết quả; đề thử Đọc → ra điểm
await pg.evaluate(() => ieltsView()); await pg.waitForTimeout(800); await pg.click('[data-exsel="toeic"]'); await pg.waitForTimeout(1200);
check('TOEIC mở', (await pg.innerText('#app')).includes('Luyện TOEIC') && await pg.isVisible('#tabs [data-tab="ie"].on'));
await pg.click('[data-top="p5"]'); await pg.waitForTimeout(300);
for (let n = 0; n < 20; n++) { if (await pg.$('[data-io]:not([disabled])')) await pg.click('[data-io="0"]'); else break; await pg.waitForTimeout(40); if (await pg.$('[data-a="next"]')) await pg.click('[data-a="next"]'); await pg.waitForTimeout(40); }
check('TOEIC Part 5 ra kết quả', /câu đúng/.test(await pg.innerText('#app'))); await pg.click('[data-a="back"]'); await pg.waitForTimeout(600);
await pg.click('[data-tospd="p5"]'); await pg.waitForTimeout(300);
for (let n = 0; n < 20; n++) { if (await pg.$('[data-io]:not([disabled])')) await pg.click('[data-io="0"]'); else break; await pg.waitForTimeout(40); if (await pg.$('[data-a="next"]')) await pg.click('[data-a="next"]'); await pg.waitForTimeout(40); }
check('TOEIC luyện tốc độ ra kết quả', /giây \/ câu/.test(await pg.innerText('#app'))); await pg.click('[data-a="back"]'); await pg.waitForTimeout(600);
check('TOEIC phân tích điểm yếu', /Phân tích điểm yếu/.test(await pg.innerText('#app')));
await pg.click('[data-tomk="1"]'); await pg.waitForTimeout(800);
for (let n = 0; n < 60; n++) { if (await pg.$('[data-ko]')) await pg.click('[data-ko="0"]'); else break; await pg.waitForTimeout(40); }
check('TOEIC đề thử Đọc ra điểm', /Kết quả TOEIC/.test(await pg.innerText('#app')));
// 📅 Hôm nay + 🧭 xếp cấp (v74): ô Hôm nay ở Tổng quan; làm trọn bài xếp cấp (chọn "Chưa biết") → ra kết quả
await pg.evaluate(() => { S = blank(); overview(); }); await pg.waitForTimeout(600); check('ô Hôm nay', (await pg.innerText('#app')).includes('3 việc hôm nay'));
await pg.click('[data-place]'); await pg.waitForTimeout(800); for (let n = 0; n < 40; n++) { if (!(await pg.$('[data-po="-1"]'))) break; await pg.click('[data-po="-1"]'); await pg.waitForTimeout(30); }
check('xếp cấp ra kết quả', /Kết quả xếp cấp/.test(await pg.innerText('#app')));
// 🚀 thi vượt cấp (v75): từ Tổng quan cấp B1 (chưa học) → màn thi vượt → bấm thi Ngữ pháp B1 mở đề thi
await pg.evaluate(() => { S = blank(); overview('b1'); }); await pg.waitForTimeout(600); await pg.click('[data-vcv="b1"]'); await pg.waitForTimeout(800);
check('màn thi vượt', (await pg.innerText('#app')).includes('Thi vượt lên B1')); await pg.click('[data-vc="np|b1"]'); await pg.waitForTimeout(800);
check('thi vượt mở đề', !!(await pg.$('[data-ko], [data-k], #ti, #kt, input, textarea')));
// ⚡ kiểm tra đầu bài (v76): mở bài A1 mới, trả lời đúng hết (chọn nghĩa đúng, gõ đúng từ) → bỏ qua hết, hoàn thành bài
await pg.evaluate(() => { S = blank(); learn(UNITS.find(u => u.lv === 'a1')); }); await pg.waitForTimeout(300); await pg.click('[data-pt="go"]'); await pg.waitForTimeout(200);
for (let n = 0; n < 40; n++) { const it = await pg.evaluate(() => { const m = (window.CUR.item || '').split(':'), w = WBY[m[1]]; return w ? { w: w.w, vi: w.vi } : null; }); if (!it) break;
  if (await pg.$('#ptt')) { await pg.fill('#ptt', it.w); await pg.click('#ptf button[type=submit]'); } else if (await pg.$('[data-po]')) { const o = await pg.$$eval('[data-po]', bs => bs.map(b => b.innerText.trim())); const k = o.indexOf(it.vi); await pg.click(`[data-po="${k >= 0 ? k : -1}"]`); } else break; await pg.waitForTimeout(30); }
check('kiểm tra đầu bài ra kết quả', /Đã biết \d+\/\d+ từ/.test(await pg.innerText('#app')), (await pg.innerText('#app')).slice(0, 60));
// 🗺 Bản đồ chỗ yếu (v78): tab 💾 Dữ liệu có ô bản đồ, mở được, đủ 3 tầng
await pg.evaluate(() => overview()); await pg.waitForTimeout(400); await pg.click('#tabs [data-tab="bk"]'); await pg.waitForTimeout(600);
check('tab Dữ liệu có bản đồ', (await pg.innerText('#app')).includes('Bản đồ chỗ yếu')); await pg.click('[data-mapv]'); await pg.waitForTimeout(1200);
check('bản đồ đủ tầng', /Tầng phủ[\s\S]*Tầng chữa[\s\S]*Tầng gốc/.test(await pg.innerText('#app')) && await pg.isVisible('#tabs [data-tab="bk"].on'));
check('không lỗi trang', !errs.length, errs.slice(0, 3).join(' | '));
for (const x of ok) console.log('✅ ' + x); for (const x of bad) console.log('❌ ' + x);
console.log(bad.length ? `\n${bad.length} mục chưa đạt` : '\nĐạt hết (WebKit, iPhone 13 giả lập)');
await b.close(); srv.close(); process.exit(bad.length ? 1 : 0);
