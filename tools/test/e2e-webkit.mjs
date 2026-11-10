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
check('mở app lần đầu: 3 bước chọn mục tiêu (v112)', (await pg.innerText('#app')).includes('Bạn học tiếng Anh để làm gì'));
const PREV = { pre: null, a1: 'pre', a2: 'a1', b1: 'a2p', b2: 'b1p', c1: 'b2p', c2: 'c1' };
for (const lv of (process.env.LVS ? process.env.LVS.split(',') : ['pre', 'a1', 'a2', 'b1', 'b2', 'c1', 'c2'])) {
  await pg.evaluate(async p => { S = blank(); if (p) await bkSet('all', p, 'dat'); }, PREV[lv]);
  // học 1 bài Từ vựng
  await pg.evaluate(lv => learn(UNITS.find(u => u.lv === lv)), lv); await pg.waitForTimeout(200); if (await pg.$('[data-pt="skip"]')) { await pg.click('[data-pt="skip"]'); await pg.waitForTimeout(200); } let n = 0; while (await pg.$('[data-a="next"]')) { await pg.click('[data-a="next"]'); await pg.waitForTimeout(20); if (++n > 20) break; }
  const q = await answerAll(); const done = (await pg.innerText('#app')).includes('✅ Xong'); check(`${lv} học bài Từ vựng (${q} câu)`, done);
  // mọi phần: màn chính, bài học đầu, mở thi
  for (const id of await pg.evaluate(lv => Object.values(KIT).filter(P => P.lvs.includes(lv)).map(P => P.id), lv)) {
    await pg.evaluate(id => kView(id), id); await pg.waitForTimeout(500); check(`${lv} ${id} màn chính`, /🏋️|Làm bài mới/.test(await pg.innerText('#app')) && /Bài thi/.test(await pg.innerText('#app')));   // v134: nút chính + ô bài thi lên cấp
    await pg.evaluate(([id, lv]) => kLearn(KIT[id], kItems(KIT[id], lv)[0]), [id, lv]); await pg.waitForTimeout(200); check(`${lv} ${id} bài học`, (await pg.innerText('#app')).length > 50);
    if (id !== 'noi') { await pg.evaluate(([id, lv]) => kExam(KIT[id], lv), [id, lv]); await pg.waitForTimeout(300); check(`${lv} ${id} mở thi`, !!(await pg.$('[data-k], #ti, textarea, [data-kdlg], button'))); } }
  await pg.evaluate(() => paView()); await pg.waitForTimeout(500); check(`${lv} phát âm màn chính`, (await pg.innerText('#app')).includes('Phát âm'));
  // thi Từ vựng: đặt Nhớ đủ rồi làm hết, phải qua
  await pg.evaluate(async ([lv, p]) => { await bkSet('tv', lv, 'nho'); if (p) xs().runs.push({ lv: p, at: Date.now(), n: 30, ok: 30, pass: true }); await exam(lv); }, [lv, PREV[lv]]);
  await pg.waitForTimeout(400); let t = await answerAll(120); let tx = await pg.innerText('#app');
  if (tx.includes('Làm vòng 2')) { await pg.click('[data-a="r2"]'); t += await answerAll(120); tx = await pg.innerText('#app'); }
  check(`${lv} thi Từ vựng (${t} câu)`, /Qua/.test(tx), tx.slice(0, 80).replace(/\n/g, ' '));
  await pg.evaluate(lv => overview(lv), lv); await pg.waitForTimeout(400); check(`${lv} tổng quan`, (await pg.innerText('#app')).includes('Tiếng Anh '));   // v134: 📚 Học một trang: "Tiếng Anh {cấp}"
}
// 🎓 đề thử B1: mở từ 🎓 Luyện thi → Cambridge (v95), làm trọn bài Đọc (chọn đáp án đầu / gõ chữ), phải ra màn kết quả
// v142: màn đầu kỳ thi = 2 nút 📚 Đề có sẵn · 🤖 Đề AI soạn (chưa gọi AI); bấm 📚 mới ra lưới bài thi + "Thêm"
await pg.evaluate(() => { EX_PART = null; cbView('b1'); }); await pg.waitForTimeout(600); check('Cambridge: màn 2 nút 📚 · 🤖 (v142)', (await pg.$$('#app .btnbig[data-expart]')).length === 2 && !(await pg.$('#app [data-daigo]')));
await pg.click('#app [data-expart="san"]'); await pg.waitForTimeout(600); check('Cambridge phần 📚 theo khuôn Nền, không nút gọi AI (v122, v142)', !!(await pg.$('[data-cbsk="b1|0"]')) && !(await pg.$('#app .btnbig')) && !(await pg.$('#app [data-daigo]')));
await pg.evaluate(() => document.querySelectorAll('#app details').forEach(d => { d.open = true; })); await pg.click('[data-mock="b1"]'); await pg.waitForTimeout(1500);
// v122: đề thử cả đề trong "Thêm"
check('đề thử mở', (await pg.innerText('#app')).includes('B1 Preliminary'));
await pg.click('[data-mk="0"]'); await pg.waitForTimeout(400);
for (let n = 0; n < 80; n++) { if (await pg.$('[data-ko]')) await pg.click('[data-ko="0"]'); else if (await pg.$('#kt')) { await pg.fill('#kt', 'test answer'); await pg.click('#kf button[type=submit]'); } else break; await pg.waitForTimeout(30); }
check('đề thử ra kết quả', (await pg.innerText('#app')).includes('Kết quả'));
await pg.evaluate(() => { EX_PART = 'san'; cbView('b1'); }); await pg.waitForTimeout(600); await pg.evaluate(() => document.querySelectorAll('#app details').forEach(d => { d.open = true; })); { const tx = await pg.innerText('#app'); check('ô Sẵn sàng thi + Đọc nghe thêm', tx.includes('Sẵn sàng thi') && tx.includes('Đọc nghe thêm')); }
// 🧩 dạng đề thật B2: mở từ 🎓 Luyện thi → Cambridge, làm trọn một lượt viết lại câu và một bài nối đoạn
await pg.evaluate(() => cbSkView('b2', 0)); await pg.waitForTimeout(600); await pg.evaluate(() => document.querySelectorAll('#app details').forEach(d => { d.open = true; })); await pg.click('[data-uoe="b2"]'); await pg.waitForTimeout(800);   // v122: dạng đề thật trong "Thêm" của bài thi Đọc
check('dạng đề thật mở', (await pg.innerText('#app')).includes('Luyện dạng đề thật'));
for (const k of ['kwt', 'pm']) { await pg.click(`[data-ut="${k}"]`); await pg.waitForTimeout(300);
  for (let n = 0; n < 20; n++) { if (await pg.$('#ut')) { await pg.fill('#ut', 'x'); await pg.click('#uf button[type=submit]'); }
    else if (await pg.$('[data-uo]:not([disabled])')) await pg.click('[data-uo="0"]'); else break; await pg.waitForTimeout(50); if (await pg.$('[data-a="next"]')) await pg.click('[data-a="next"]'); await pg.waitForTimeout(50); }
  const tx = await pg.innerText('#app'); check(`dạng đề ${k} ra kết quả`, /câu đúng/.test(tx), tx.slice(0, 80)); await pg.click('[data-a="back"]'); await pg.waitForTimeout(300); }
// 🎧 nghe điền thông tin B1: mở từ Tổng quan, điền phiếu, nộp → ra kết quả; nhại theo mở được
await pg.evaluate(() => cbSkView('b1', 2)); await pg.waitForTimeout(600); await pg.evaluate(() => document.querySelectorAll('#app details').forEach(d => { d.open = true; })); await pg.click('[data-ng="nf|b1"]'); await pg.waitForTimeout(1200);
check('nghe điền mở', !!(await pg.$('[data-nf="0"]'))); await pg.fill('[data-nf="0"]', 'x'); await pg.click('#nf button[type=submit]'); await pg.waitForTimeout(300);
check('nghe điền ra kết quả', /chỗ đúng/.test(await pg.innerText('#app')));
await pg.evaluate(() => cbSkView('b1', 2)); await pg.waitForTimeout(600); await pg.evaluate(() => document.querySelectorAll('#app details').forEach(d => { d.open = true; })); await pg.click('[data-ng="sh|b1"]'); await pg.waitForTimeout(1200);
check('nhại theo mở', (await pg.innerText('#app')).includes('Nhại theo'));
// 👥 nói theo cặp B2: mở, chọn đề (WebKit giả lập không chép lời: gõ lượt), làm trọn 6 lượt → ra kết quả
await pg.evaluate(() => cbSkView('b2', 3)); await pg.waitForTimeout(600); await pg.evaluate(() => document.querySelectorAll('#app details').forEach(d => { d.open = true; })); await pg.click('[data-cap="b2"]'); await pg.waitForTimeout(1000);
check('nói cặp mở', (await pg.innerText('#app')).includes('Nói theo cặp')); await pg.click('[data-capt]'); 
for (let n = 0; n < 6; n++) { await pg.waitForSelector('#capt, [data-a="rec"]', { timeout: 30000 }).catch(() => {}); if (!(await pg.$('#capt'))) break; await pg.fill('#capt', 'I agree because it is cheap. What do you think?'); await pg.click('[data-a="typed"]'); }
await pg.waitForTimeout(800); check('nói cặp ra kết quả', /tương tác|luyện thêm/.test(await pg.innerText('#app')));
// 📚 thư viện: mở từ Tổng quan B2, mở truyện, chạm một từ → hiện ô tra từ, lật trang
await pg.evaluate(() => overview('b2')); await pg.waitForTimeout(600); await pg.evaluate(() => document.querySelectorAll('#app details').forEach(d => { d.open = true; })); await pg.click('[data-lib="b2"]'); await pg.waitForTimeout(800);
check('thư viện mở', (await pg.innerText('#app')).includes('Thư viện đọc')); await pg.click('[data-lb]'); await pg.waitForTimeout(800);
await pg.click('#libp [data-lw]:nth-child(3)'); await pg.waitForTimeout(200); check('thư viện tra từ', await pg.isVisible('#libw'));
await pg.click('[data-a="next"]'); await pg.waitForTimeout(400); check('thư viện lật trang', /· 2\//.test(await pg.innerText('.uname')));
// 📝 tóm tắt 2 đoạn C2: mở, nộp bài mẫu → báo đủ ý
await pg.evaluate(() => uoeView('c2')); await pg.waitForTimeout(600); await pg.click('[data-ut="sum"]'); await pg.waitForTimeout(400);
await pg.fill('#ut', await pg.evaluate(() => kModel(UOE.sum.find(x => document.body.innerText.includes(x.en))))); await pg.click('#uf button[type=submit]'); await pg.waitForTimeout(300);
check('tóm tắt C2 chấm bài mẫu', /Đúng/.test(await pg.innerText('#ufb')));
// 🌏 Học IELTS (v68): mở từ thanh dưới; luyện cả bài Đọc → ra kết quả; Viết Task 2 nộp bài mẫu → máy ước band; đề thử bài Đọc làm trọn → ra band
// v108: không còn tab Luyện thi; mục tiêu IELTS → 📚 Học có nút "Phần riêng" mở màn IELTS (thanh dưới sáng 📚)
await pg.evaluate(() => { S.lt = { d: [], fx: {}, goal: { kind: 'ielts', lv: 'b2p', date: '', at: Date.now() } }; delete S.ie; overview(ovStage()); }); await pg.waitForTimeout(1500);
check('📚 Học chỉ còn Nền + dòng chỉ sang 🎯 Luyện đề (v141)', /Tiếng Anh[\s\S]*Luyện IELTS[\s\S]*Luyện đề/.test(await pg.innerText('#app')) && !(await pg.$('#app [data-exsel]')) && await pg.isVisible('#tabs [data-tab="all"].on')); await pg.click('#tabs [data-tab="ld"]'); await pg.waitForTimeout(1500);
// v86: lần đầu IELTS hỏi 3 câu (loại thi, band, ngày thi); các mục kỹ năng gập lại → mở hết để bấm
const openAll = () => pg.evaluate(() => document.querySelectorAll('#app details').forEach(d => { d.open = true; }));
check('IELTS chỉ nội dung (v111)', !(await pg.innerText('#app')).includes('Hôm nay & kế hoạch')); await openAll();
check('IELTS mở từ tab 🎯 Luyện đề (v141)', !!(await pg.$('#ie')) && await pg.isVisible('#tabs [data-tab="ld"].on') && !!(await pg.$('#app .exrow')));
// v142: màn đầu có 2 nút 📚 Đề có sẵn · 🤖 Đề AI soạn, chưa có nút gọi AI
check('Luyện đề: màn 2 nút 📚 · 🤖 (v142)', (await pg.$$('#app .btnbig[data-expart]')).length === 2 && !(await pg.$('#app [data-daigo]')));
// v141 🤖 đề AI (máy chủ giả fake-sb.js): bấm 🤖 → ▶ Làm đề AI mới → màn chờ → soạn xong → làm hết → kết quả có nhãn AI
await pg.click('#app [data-expart="ai"]'); await pg.waitForTimeout(600); check('phần 🤖 có nhắc bài có sẵn', (await pg.innerText('#app')).includes('Bài có sẵn · miễn phí'));
await pg.evaluate(() => { DAI.off = true; DAI.kho = { de: [] }; }); await pg.click('#app [data-daigo]'); await pg.waitForTimeout(600); check('đề AI: màn chờ', (await pg.innerText('#app')).includes('AI đang soạn đề') && await pg.isVisible('#tabs [data-tab="ld"].on'));
await pg.evaluate(async () => { const w = Object.values(daiSt().wait).find(x => x.st === 'dang'); if (w) await daiTick(w.id); }); await pg.waitForTimeout(400);
for (let i = 0; i < 12 && await pg.$('[data-io], #it'); i++) { if (await pg.$('[data-io]')) await pg.click('[data-io]'); else { await pg.fill('#it', 'x'); await pg.click('#if button[type=submit]'); } await pg.waitForTimeout(60); const nx = await pg.$('[data-a="next"]'); if (nx) await nx.click(); await pg.waitForTimeout(60); }
check('đề AI: làm xong ra kết quả có nhãn AI', /câu đúng[\s\S]*AI soạn, chưa giáo viên kiểm/.test(await pg.innerText('#app'))); await pg.evaluate(() => { DAI.off = false; EX_PART = 'san'; ieltsView(); }); await pg.waitForTimeout(800); await openAll(); check('IELTS có bản đồ band', (await pg.innerText('#app')).includes('Bản đồ band'));
// v145 📚 kho đề soạn sẵn: phần 🤖 ghi số đề soạn sẵn; ▶ mở ngay đề trong kho (không màn chờ, không gọi máy chủ)
await pg.evaluate(() => { DAI.kho = null; DAI.khoP = null; FAKE_CALLS = []; EX_PART = 'ai'; ieltsView(); }); await pg.waitForTimeout(900); check('phần 🤖 ghi đề soạn sẵn (v145)', (await pg.innerText('#app')).includes('đề soạn sẵn'));
await pg.click('#app [data-daigo]'); await pg.waitForTimeout(700); check('đề soạn sẵn mở ngay, không gọi máy chủ (v145)', !(await pg.innerText('#app')).includes('AI đang soạn đề') && !!(await pg.$('[data-io], #it')) && await pg.evaluate(() => !FAKE_CALLS.length));
await pg.evaluate(() => { EX_PART = 'san'; ieltsView(); }); await pg.waitForTimeout(800);
await pg.click('[data-iesk="R"]'); await pg.waitForTimeout(400); check('IELTS Đọc theo khuôn Nền (v134: ô số đo + một nút chính)', !!(await pg.$('.statc')) && /Bài đọc/.test(await pg.innerText('#app'))); await pg.click('[data-iebt="R"]'); await pg.waitForTimeout(400);   // v122: 🏋️ Bài tập = bài kế tiếp
for (let n = 0; n < 30; n++) { if (await pg.$('#it:not([disabled])')) { await pg.fill('#it', 'x'); await pg.click('#if button[type=submit]'); } else if (await pg.$('[data-io]:not([disabled])')) await pg.click('[data-io="0"]'); else break;
  await pg.waitForTimeout(50); if (await pg.$('[data-a="next"]')) await pg.click('[data-a="next"]'); await pg.waitForTimeout(50); }
check('IELTS đọc ra kết quả', /câu đúng/.test(await pg.innerText('#app')));
// v146 🎯 Sai ở đâu · học lại gì: ô gom câu sai theo dạng; 📘 Học lại mở bài học có nút ‹ Kết quả, bấm thì về đúng màn kết quả
check('kết quả có ô 🎯 Sai ở đâu (v146)', !!(await pg.$('#hlbox [data-hl]')) && !!(await pg.$('#hlbox [data-hlgo]')));
await pg.click('#hlbox [data-hl]'); await pg.waitForTimeout(700); check('📘 Học lại mở bài học, nút ‹ Kết quả (v146)', /‹ Kết quả/.test(await pg.innerText('#app')) && !!(await pg.$('[data-xlb]')));
await pg.click('[data-xlb]'); await pg.waitForTimeout(400); check('‹ Kết quả về lại màn kết quả (v146)', !!(await pg.$('#hlbox')) && /câu đúng/.test(await pg.innerText('#app')));
await pg.click('[data-a="back"]'); await pg.waitForTimeout(500);
check('IELTS luyện xong về màn con Đọc', !!(await pg.$('[data-iehome]')) && await pg.isVisible('#tabs [data-tab="ld"].on'));
await pg.click('[data-iehome]'); await pg.waitForTimeout(500); await pg.click('[data-iesk="W"]'); await pg.waitForTimeout(400); await openAll(); await pg.click('[data-iew="t2"]'); await pg.waitForTimeout(300); await pg.fill('#iwt', await pg.evaluate(() => IE.t2[0].m)); await pg.click('#iwf button[type=submit]'); await pg.waitForTimeout(300);
check('IELTS viết máy ước band', /Máy ước: band/.test(await pg.innerText('#app'))); await pg.click('[data-a="back"]'); await pg.waitForTimeout(500);
await pg.evaluate(() => ieSkView('R')); await pg.waitForTimeout(600); await pg.click('[data-iemk="1"]'); await pg.waitForTimeout(1500);   // v122: ③ Thi thử ở màn kỹ năng
for (let n = 0; n < 80; n++) { if (await pg.$('#kt')) { await pg.fill('#kt', 'x'); await pg.click('#kf button[type=submit]'); } else if (await pg.$('[data-ko]')) await pg.click('[data-ko="0"]'); else break; await pg.waitForTimeout(40); }
check('IELTS đề thử Đọc ra band', /Kết quả IELTS/.test(await pg.innerText('#app')));
// 💼 TOEIC (v72): chuyển từ IELTS sang TOEIC trong 🎓 Luyện thi; luyện Part 5 trọn bài → ra kết quả; đề thử Đọc → ra điểm
await pg.evaluate(() => { S.lt.goal = { kind: 'toeic', lv: 'b1', date: '', at: Date.now() }; exOpenK('toeic'); }); await pg.waitForTimeout(800); await pg.waitForTimeout(1200);
check('TOEIC mở', (await pg.innerText('#app')).includes('💼 TOEIC') && await pg.isVisible('#tabs [data-tab="ld"].on'));
await pg.click('[data-tosk="R"]'); await pg.waitForTimeout(400); await openAll(); await pg.click('[data-top="p5"]'); await pg.waitForTimeout(300);   // v122: luyện theo Part trong "Thêm" 
for (let n = 0; n < 20; n++) { if (await pg.$('[data-io]:not([disabled])')) await pg.click('[data-io="0"]'); else break; await pg.waitForTimeout(40); if (await pg.$('[data-a="next"]')) await pg.click('[data-a="next"]'); await pg.waitForTimeout(40); }
check('TOEIC Part 5 ra kết quả', /câu đúng/.test(await pg.innerText('#app'))); await pg.click('[data-a="back"]'); await pg.waitForTimeout(600); await pg.click('[data-tohome]'); await pg.waitForTimeout(600); await openAll(); check('TOEIC có bản đồ điểm', (await pg.innerText('#app')).includes('Bản đồ điểm'));
await pg.evaluate(() => toSkView('R')); await pg.waitForTimeout(500); await openAll(); await pg.click('[data-tospd="p5"]'); await pg.waitForTimeout(300);
for (let n = 0; n < 20; n++) { if (await pg.$('[data-io]:not([disabled])')) await pg.click('[data-io="0"]'); else break; await pg.waitForTimeout(40); if (await pg.$('[data-a="next"]')) await pg.click('[data-a="next"]'); await pg.waitForTimeout(40); }
check('TOEIC luyện tốc độ ra kết quả', /giây \/ câu/.test(await pg.innerText('#app'))); await pg.click('[data-a="back"]'); await pg.waitForTimeout(600);
await pg.evaluate(() => mapView('toeic')); await pg.waitForTimeout(1200); await openAll(); check('TOEIC phân tích điểm yếu (🗺 Chỗ yếu)', /Phân tích điểm yếu/.test(await pg.innerText('#app')));
await pg.evaluate(() => { MAP_TAB = null; toSkView('R'); }); await pg.waitForTimeout(500); await pg.click('[data-tomk="1"]'); await pg.waitForTimeout(800);
for (let n = 0; n < 60; n++) { if (await pg.$('[data-ko]')) await pg.click('[data-ko="0"]'); else break; await pg.waitForTimeout(40); }
check('TOEIC đề thử Đọc ra điểm', /Kết quả TOEIC/.test(await pg.innerText('#app')));
// v147 🎓 đề thử TOEIC trọn 200 câu: lối vào ở màn TOEIC; bắt đầu Nghe (thanh dưới ẩn); hệ số giờ nhỏ cho Nghe tự chạy hết; Đọc chọn câu, bảng câu, nộp → kết quả có ô Sai ở đâu
await pg.evaluate(() => { EX_PART = 'san'; toeicView(); }); await pg.waitForTimeout(900); check('màn TOEIC có đề thử trọn 200 câu (v147)', !!(await pg.$('#app [data-trv]')));
await pg.click('#app [data-trv]'); await pg.waitForTimeout(900); await pg.click('[data-trgo="de1"]'); await pg.waitForTimeout(400);
{ const t = await pg.innerText('#app'); check('đề trọn: màn sẵn sàng có cấu trúc 200 câu (Phần Nghe câu 1–100 + Phần Đọc câu 101–200, đủ 7 Part), thanh dưới ẩn (v148)', /200 câu/.test(t) && /Phần Nghe/.test(t) && /Phần Đọc/.test(t) && /Part 7 · Đọc hiểu/.test(t) && /147–200/.test(t) && !(await pg.isVisible('#tabs'))); }
await pg.evaluate(() => { TR.k = 0.0005; }); await pg.click('[data-trstart]'); await pg.waitForTimeout(300);
{ const t = await pg.innerText('#app'); check('đề trọn: Nghe tự chạy, thanh dưới ẩn (v147)', (/🎧 Part \d · câu \d+/.test(t) || /Xong phần Nghe/.test(t)) && !(await pg.isVisible('#tabs'))); }   // hệ số giờ nhỏ: có thể đã qua câu 1
for (let n = 0; n < 80 && !(await pg.$('[data-trrs]')); n++) await pg.waitForTimeout(250);
check('đề trọn: hết Nghe sang màn chờ Đọc (v147)', !!(await pg.$('[data-trrs]'))); await pg.evaluate(() => { TR.k = 1; }); await pg.click('[data-trrs]'); await pg.waitForTimeout(300);
await pg.click('[data-tra^="101|"]'); await pg.click('[data-trg]'); await pg.waitForTimeout(300);
check('đề trọn: bảng câu 101–200, câu 101 đã chọn (v147)', (await pg.$$('.trc')).length === 100 && !!(await pg.$('.trc.done')));
await pg.click('#app [data-trsub]'); await pg.waitForTimeout(900);
check('đề trọn: nộp ra kết quả + ô Sai ở đâu (v147)', /Kết quả Đề 1/.test(await pg.innerText('#app')) && !!(await pg.$('#hlbox')));
// v149 📋 bài làm và đáp án: từ kết quả mở bảng 200 ô, chạm câu 35 xem lại có lời nghe; danh sách có Đề 3 (đề mới ở tệp riêng), màn sẵn sàng tải được
await pg.click('#app [data-trsh]'); await pg.waitForTimeout(500);
check('📋 bài làm và đáp án: bảng 200 ô (v149)', (await pg.$$('.trsh .trc')).length === 200);
await pg.click('[data-trrv="35"]'); await pg.waitForTimeout(400);
{ const t = await pg.innerText('#app'); check('📋 xem lại câu 35: lời nghe + đáp án (v149)', /Lời nghe/.test(t) && /✓ (Đáp án|Bạn chọn · đúng)/.test(t)); }
await pg.evaluate(() => trView()); await pg.waitForTimeout(800); await pg.click('[data-trgo="de3"]'); await pg.waitForTimeout(1200);
check('đề trọn mới: Đề 3 tải từ tệp riêng, màn sẵn sàng 200 câu (v149)', /Đề 3 · 200 câu/.test(await pg.innerText('#app')));
// v152 đợt 2: Đề 6 (đề cuối của đợt) có trong danh sách và tải được
await pg.evaluate(() => trView()); await pg.waitForTimeout(800); await pg.click('[data-trgo="de6"]'); await pg.waitForTimeout(1200);
check('đề trọn đợt 2: Đề 6 tải từ tệp riêng, màn sẵn sàng 200 câu (v152)', /Đề 6 · 200 câu/.test(await pg.innerText('#app')));
// v154 đợt 3: Đề 8 (đề cuối, sau đó dừng soạn đề) có trong danh sách và tải được
await pg.evaluate(() => trView()); await pg.waitForTimeout(800); await pg.click('[data-trgo="de8"]'); await pg.waitForTimeout(1200);
check('đề trọn đợt 3: Đề 8 tải từ tệp riêng, màn sẵn sàng 200 câu (v154)', /Đề 8 · 200 câu/.test(await pg.innerText('#app')));
// 📅 Hôm nay + 🧭 xếp cấp (v74): ô Hôm nay ở Tổng quan; làm trọn bài xếp cấp (chọn "Chưa biết") → ra kết quả
await pg.evaluate(() => { S = blank(); S.lt = { d: [], fx: {}, goal: { kind: 'cefr', lv: 'a2', date: '', at: Date.now() } }; ltView(); }); await pg.waitForTimeout(800); check('ô Hôm nay ở Lộ trình', (await pg.innerText('#app')).includes('Việc hôm nay'));
await pg.click('[data-place]'); await pg.waitForTimeout(800); for (let n = 0; n < 40; n++) { if (!(await pg.$('[data-po="-1"]'))) break; await pg.click('[data-po="-1"]'); await pg.waitForTimeout(30); }
check('xếp cấp ra kết quả (v133: nơi bắt đầu học)', /Bạn (đang ở khoảng|học từ đầu)/.test(await pg.innerText('#app')) && !!(await pg.$('[data-pla="go"]')));
// 🚀 thi vượt cấp (v75): từ Tổng quan cấp B1 (chưa học) → màn thi vượt → bấm thi Ngữ pháp B1 mở đề thi
await pg.evaluate(() => { S = blank(); vcView('b1'); }); await pg.waitForTimeout(600); await pg.waitForTimeout(800);
check('màn thi vượt', (await pg.innerText('#app')).includes('Thi vượt lên B1')); await pg.click('[data-vc="np|b1"]'); await pg.waitForTimeout(800);
check('thi vượt mở đề', !!(await pg.$('[data-ko], [data-k], #ti, #kt, input, textarea')));
// ⚡ kiểm tra đầu bài (v76): mở bài A1 mới, trả lời đúng hết (chọn nghĩa đúng, gõ đúng từ) → bỏ qua hết, hoàn thành bài
await pg.evaluate(() => { S = blank(); learn(UNITS.find(u => u.lv === 'a1')); }); await pg.waitForTimeout(300); await pg.click('[data-pt="go"]'); await pg.waitForTimeout(200);
for (let n = 0; n < 40; n++) { const it = await pg.evaluate(() => { const m = (window.CUR.item || '').split(':'), w = WBY[m[1]]; return w ? { w: w.w, vi: w.vi } : null; }); if (!it) break;
  if (await pg.$('#ptt')) { await pg.fill('#ptt', it.w); await pg.click('#ptf button[type=submit]'); } else if (await pg.$('[data-po]')) { const o = await pg.$$eval('[data-po]', bs => bs.map(b => b.innerText.trim())); const k = o.indexOf(it.vi); await pg.click(`[data-po="${k >= 0 ? k : -1}"]`); } else break; await pg.waitForTimeout(30); }
check('kiểm tra đầu bài ra kết quả', /Đã biết \d+\/\d+ từ/.test(await pg.innerText('#app')), (await pg.innerText('#app')).slice(0, 60));
// 🗺 Bản đồ chỗ yếu (v78; v86 lối vào ở ô 📅 Hôm nay của Học CEFR): mở được, đủ 3 tầng, thanh dưới sáng 🎯
await pg.evaluate(() => { S.lt = { d: [], fx: {}, goal: { kind: 'cefr', lv: 'a2', date: '', at: Date.now() } }; ltView(); }); await pg.waitForTimeout(800);
// v114: Lộ trình 2 phần; v133: 📅 Hôm nay · 📈 Tiến độ, bản đồ chỗ yếu đầy đủ là màn con của Tiến độ
check('Lộ trình có 2 phần', await pg.isVisible('[data-ltseg="today"].on') && await pg.isVisible('[data-ltseg="map"]')); await pg.click('[data-ltseg="map"]'); await pg.waitForTimeout(1200);
check('📈 Tiến độ (v133)', /Trình độ của bạn[\s\S]*Chỗ yếu cần sửa/.test(await pg.innerText('#app')) && await pg.isVisible('[data-ltseg="map"].on') && await pg.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
await pg.click('[data-mapv="lt"]'); await pg.waitForTimeout(1200);
check('bản đồ theo bài (v119)', /Việc cần chữa[\s\S]*Bản đồ theo bài/.test(await pg.innerText('#app')) && await pg.isVisible('#tabs [data-tab="lt"].on') && await pg.isVisible('[data-ltseg="map"]'));
check('Chỗ yếu không tràn ngang', await pg.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
// v121: hàng chọn mục 🧱 Nền · 🎓 Cambridge · 🌏 IELTS · 💼 TOEIC, mục nào cũng xem được
await pg.evaluate(() => document.querySelectorAll('#app details.lvmore').forEach(d => { d.open = true; })); await pg.click('[data-mtab="cb"]'); await pg.waitForTimeout(1500); check('mục 🎓 Cambridge của Chỗ yếu (v121)', (await pg.innerText('#app')).includes('theo phần của đề') && await pg.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
await pg.evaluate(() => document.querySelectorAll('#app details.lvmore').forEach(d => { d.open = true; })); await pg.click('[data-mtab="ielts"]'); await pg.waitForTimeout(1500); check('mục 🌏 IELTS của Chỗ yếu (v121)', (await pg.innerText('#app')).includes('theo dạng câu') && await pg.isVisible('[data-mtab="ielts"].on'));
await pg.evaluate(() => document.querySelectorAll('#app details.lvmore').forEach(d => { d.open = true; })); await pg.click('[data-mtab="nen"]'); await pg.waitForTimeout(1200);
await pg.click('[data-ltseg="map"]'); await pg.waitForTimeout(800); await pg.click('[data-ltseg="today"]'); await pg.waitForTimeout(800); check('về 📅 Hôm nay', (await pg.innerText('#app')).includes('Việc hôm nay') && await pg.isVisible('[data-ltseg="today"].on'));
await pg.click('#tabs [data-tab="dict"]'); await pg.waitForTimeout(600); check('Từ điển sáng đúng nút', await pg.isVisible('#tabs [data-tab="dict"].on') && !(await pg.$('#tabs [data-tab="bk"].on')));
// v95: 📖 Tra cứu → 📘 Cẩm nang thi (thanh dưới vẫn sáng 📖); 👤 Của tôi → 🗺 bản đồ (sáng 👤, nút về Của tôi) → 💾 Dữ liệu
check('Tra cứu không còn thẻ Cẩm nang (v136)', !(await pg.$('[data-cnv]')));
await pg.click('#tabs [data-tab="bk"]'); await pg.waitForTimeout(800); check('Của tôi mở', /Tiến độ[\s\S]*Chỗ yếu[\s\S]*Sổ từ/.test(await pg.innerText('#app')) && await pg.isVisible('#tabs [data-tab="bk"].on'));
await pg.click('[data-mapv="lt"]'); await pg.waitForTimeout(1200); check('lối tắt Tôi → 🗺 bản đồ ở Lộ trình', /Bản đồ chỗ yếu/.test(await pg.innerText('#app')) && await pg.isVisible('#tabs [data-tab="lt"].on'));
await pg.click('#tabs [data-tab="bk"]'); await pg.waitForTimeout(800); await pg.click('[data-ct="data"]'); await pg.waitForTimeout(800); check('Dữ liệu từ Của tôi', (await pg.innerText('#app')).includes('Dữ liệu và tài khoản') && await pg.isVisible('#tabs [data-tab="bk"].on'));
// v105 🔄 Lộ trình: tab thứ 2; lần đầu hỏi mục tiêu → bắt đầu đợt 1; không tràn ngang
await pg.evaluate(() => { delete S.lt; }); await pg.click('#tabs [data-tab="lt"]'); await pg.waitForTimeout(1200); check('Lộ trình hỏi mục tiêu (3 bước)', (await pg.innerText('#app')).includes('Bạn học tiếng Anh để làm gì'));
await pg.click('[data-ltk="cefr"]'); await pg.waitForTimeout(300); await pg.click('[data-ltw="2"]'); await pg.waitForTimeout(300); await pg.click('[data-ltw="3"]'); await pg.waitForTimeout(400);
await pg.click('[data-lt="goal"]'); await pg.waitForTimeout(800); const ls = await pg.$('[data-lt="start"]'); if (ls) { await ls.click(); await pg.waitForTimeout(800); }
check('Lộ trình: màn Hôm nay', /Hôm nay[\s\S]*Học tiếp|Xong việc hôm nay/.test(await pg.innerText('#app')) && await pg.isVisible('#tabs [data-tab="lt"].on'));
await pg.click('[data-ltplan]'); await pg.waitForTimeout(800); check('Lộ trình: đường tới mục tiêu, đợt 1', /Đường tới[\s\S]*Ngày 1 \/ 10/.test(await pg.innerText('#app')));
check('Lộ trình không tràn ngang', await pg.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
// v112 ▶ Học tiếp: mở việc kế tiếp; ở màn phần có dải "🧭 Hôm nay còn N việc" để quay về
await pg.evaluate(() => { S = blank(); S.lt = { d: [], fx: {}, self: 'new', goal: { kind: 'cefr', lv: 'a2', date: '', at: Date.now() } }; ltView(); }); await pg.waitForTimeout(800);
await pg.click('[data-ltnext]'); await pg.waitForTimeout(1200); check('▶ Học tiếp mở bài + dải về Hôm nay', !!(await pg.$('#ltbanner')) && !!(await pg.$('#grid, #part')), (await pg.innerText('#app')).slice(0, 80));
{ const bn = await pg.$('#ltbanner [data-ltgo]'); if (bn) { await bn.click(); await pg.waitForTimeout(800); } } check('dải nhắc về Hôm nay', !!(await pg.$('#lt')) && (await pg.innerText('#app')).includes('Việc hôm nay'));
check('không lỗi trang', !errs.length, errs.slice(0, 3).join(' | '));
for (const x of ok) console.log('✅ ' + x); for (const x of bad) console.log('❌ ' + x);
console.log(bad.length ? `\n${bad.length} mục chưa đạt` : '\nĐạt hết (WebKit, iPhone 13 giả lập)');
await b.close(); srv.close(); process.exit(bad.length ? 1 : 0);
