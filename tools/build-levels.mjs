// Dựng lại toàn bộ kho từ theo chuẩn (người sáng lập 23/10/2026: "bỏ bài đo cấp và xếp lại toàn bộ").
// Nguồn: mọi cấp A1–C2 của game (CONTENT + data/lv-*.json) + A1 bổ sung (content/a1-bosung.json). Bỏ trùng theo chữ (giữ lần đầu).
// Cấp (người sáng lập 23/10/2026: "Oxford làm chính"): Oxford 3000/5000 (A1–C1; tải bằng tools/oxford-levels.py, không commit)
//   → không có thì CEFR-J Vocabulary Profile 1.5 / Octanove C1–C2 (content/ref/) → không có thì giữ cấp của nguồn.
// Khoá học: A1 (Pre-A1 = từ A1 có trong Cambridge Starters, content/cambridge-yle.json), A2 và A2+. B1–C2: chỉ tra (ref.json).
// Cấp "+" (người sáng lập 23/10/2026: "sắp xếp lại từ A2+ trở lên"; không chuẩn nào chia sẵn): trong A2, B1, B2, xếp từ theo độ khó
//   (CEFR-J xếp cao hơn cấp của từ → khó, thấp hơn hoặc có trong Cambridge Starters / Movers → dễ; cùng mức thì ít thông dụng hơn theo Zipf, content/ref/zipf.json từ tools/zipf.py); nửa khó hơn là cấp "+".
// Chủ đề: một bộ THEMES chung, xếp theo tên unit gốc của game (từ khoá). Mỗi cấp × chủ đề chia bài 6–10 từ. Bài đọc A1 / A2 giữ theo unit gốc.
// Chạy: node tools/build-levels.mjs ../sonnguyen12394.github.io → a1.json, a2.json, ref.json
import fs from 'node:fs';
const src = process.argv[2] || '../sonnguyen12394.github.io', root = new URL('..', import.meta.url).pathname;
const lines = fs.readFileSync(src + '/app.js', 'utf8').split('\n');
const CONTENT = new Function(lines.slice(5, 18).join('\n') + '\nreturn CONTENT;')();
// --- chuẩn CEFR-J / Octanove
const ORD = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'], REF = new Map();
const csv = f => fs.readFileSync(root + 'content/ref/' + f, 'utf8').split('\n').slice(1).filter(Boolean).map(l => { const m = l.match(/^("([^"]*)"|[^,]*),([^,]*),([^,]*)/); return m ? [m[2] ?? m[1], m[4]] : null; }).filter(Boolean);
for (const f of ['cefrj-vocabulary-profile-1.5.csv', 'octanove-vocabulary-profile-c1c2-1.0.csv']) for (const [hw, lv] of csv(f)) if (ORD.includes(lv))
  for (const h of hw.split('/')) { const k = h.trim().toLowerCase().replace(/\s+/g, ' '); if (k && (!REF.has(k) || ORD.indexOf(lv) < ORD.indexOf(REF.get(k)))) REF.set(k, lv); }
const OX = new Map(Object.entries(JSON.parse(fs.readFileSync(root + 'content/ref/oxford/levels.json', 'utf8'))));   // chạy tools/oxford-levels.py trước
const forms = w => { const x = w.toLowerCase().trim(); return [x, x.replace(/ies$/, 'y'), x.replace(/(es|s)$/, ''), x.replace(/-/g, ' ')]; };
const srcOf = w => { for (const [name, M] of [['oxford', OX], ['cefrj', REF]]) for (const c of forms(w)) if (M.has(c)) return [M.get(c), name]; return [null, null]; };
const refLv = w => srcOf(w)[0];
const ST = new Set(JSON.parse(fs.readFileSync(root + 'content/cambridge-yle.json', 'utf8')).starters);
const NUM = new Set('one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen nineteen twenty thirty forty fifty sixty seventy eighty ninety hundred'.split(' '));
const isPre = w => { const x = w.toLowerCase(); return ST.has(x) || (x.endsWith('s') && ST.has(x.slice(0, -1))) || NUM.has(x); };
// --- chủ đề chung (từ khoá trong tên unit tiếng Việt của game); thứ tự = thứ tự học
const THEMES = [
  ['🏠', 'Cuộc sống hằng ngày và nhà cửa', /sinh hoạt|hằng ngày|nhà|phòng|đồ (vật|dùng)|nội thất|thói quen/],
  ['🍳', 'Đồ ăn và thức uống', /ăn|uống|thực phẩm|món|bếp|trái cây|rau|hải sản|thịt|nấu|hương vị|nhà hàng/],
  ['👨‍👩‍👧', 'Con người, gia đình, cảm xúc', /gia đình|bạn bè|người|cảm xúc|tính cách|quan hệ|tình (yêu|cảm)|mối/],
  ['🩺', 'Cơ thể và sức khoẻ', /cơ thể|sức khoẻ|bệnh|y tế|thuốc|khuôn mặt|chấn thương/],
  ['🚌', 'Đi lại và du lịch', /đi lại|giao thông|du lịch|phương tiện|đường|nước ngoài|chuyến|khách sạn|nơi để đến|ngoài trời|sân bay|đi xa/],
  ['🛍️', 'Mua sắm, tiền bạc, công việc', /mua|tiền|công việc|nghề|kinh doanh|kinh tế|văn phòng|quản lý|tổ chức|tài chính|việc làm|chi tiêu|doanh nghiệp/],
  ['🎉', 'Giải trí, thể thao, lễ hội', /giải trí|thể thao|thi đấu|lễ hội|kỷ niệm|sở thích|âm nhạc|nhạc|phim|trò chơi|nghệ thuật|biểu diễn|quần áo|thời trang/],
  ['🌿', 'Thiên nhiên, thời tiết, động vật', /thiên nhiên|thời tiết|động vật|môi trường|bầu trời|biển|địa hình|vật nuôi|trang trại|khí hậu|cây/],
  ['🏙️', 'Thành phố, xã hội, thế giới', /thị trấn|thành phố|công trình|xã hội|pháp luật|luật|quốc gia|dân tộc|chính trị|thế giới|tội|nguy hiểm|an toàn|chiến tranh|tôn giáo|lịch sử|thảm hoạ|đất và nước/],
  ['📚', 'Học tập, công nghệ, truyền thông', /học|trường|giáo dục|nghiên cứu|công nghệ|internet|điện tử|máy tính|truyền thông|quảng cáo|sách|báo|khoa học|đọc|viết|từ và câu|bài tập|lớp/],
  ['💬', 'Giao tiếp và suy nghĩ', /giao tiếp|ý kiến|suy nghĩ|ghi nhớ|nói|ngôn ngữ|khám phá|phát minh|lời|chào|tranh luận/],
  ['🏃', 'Hành động và cụm động từ', /hành động|động từ|hoạt động|cụm|thay đổi|di chuyển|thích và muốn|làm và|bắt đầu|kết thúc/],
  ['⏰', 'Thời gian, con số, từ ngữ pháp', /thời gian|ngày|tháng|giờ|số|thứ tự|lượng|đại từ|từ nối|từ nhỏ|giới từ|câu hỏi|trạng từ|mức độ|so sánh|vị trí|nơi chốn|hạn định|sở hữu|nhiều, ít|để hỏi|ai đó|có, không|đúng hay sai|thế nào/],
  ['🎨', 'Màu sắc, hình dạng, miêu tả', /màu|hình|kích thước|miêu tả|tốt|xấu|cũ|mới|âm thanh|vẻ ngoài|chính xác|vật liệu|đo lường|trái nghĩa|tính từ|buồn cười|tuyệt vời|giống và khác|bất ngờ|bề mặt/],
  ['🧠', 'Ý tưởng và khái niệm', /./],
];
const themeOf = t => THEMES.findIndex(([, , re]) => re.test(String(t).toLowerCase()));
// --- gom nguồn
const toW = (w, d) => ({ id: w.id, w: w.word, pos: w.pos, ipa: w.ipa, pic: w.pic, vi: w.vi, en: d.en, ex: d.ex, exVi: d.exVi, cloze: d.cloze, col: d.col && d.col.ok ? d.col : undefined });
const pool = [], seen = new Set(), ids = new Set(), reads = [], unthemed = new Map();
const put = (w, srcLv, title) => { const k = w.w.toLowerCase(); if (seen.has(k) || !w.vi) return; seen.add(k);
  let id = w.id; while (ids.has(id)) id += '-2'; ids.add(id); w.id = id;
  const lv = refLv(w.w) || srcLv, th = themeOf(title); if (th === THEMES.length - 1) unthemed.set(title, (unthemed.get(title) || 0) + 1);
  pool.push({ w, lv, th, srcLv, inRef: !!refLv(w.w), by: srcOf(w.w)[1] }); };
const sup = JSON.parse(fs.readFileSync(root + 'content/a1-bosung.json', 'utf8')).units;
for (const L of CONTENT.levels) {
  const det = JSON.parse(fs.readFileSync(src + '/data/' + fs.readdirSync(src + '/data').find(x => x.startsWith('lv-' + L.id + '.')), 'utf8'));
  for (const u of L.units) { if (L.id === 'A2' && u.no === 40) continue;   // A2 "Hoạt động (đuôi -ing)": dạng -ing của động từ đã có
    const ws = u.words.map(w => toW(w, det.words[w.id] || {})); ws.forEach(w => put(w, L.id, u.vi));
    const r = (det.units[u.id] || {}).reading; if (r && ['A1', 'A2'].includes(L.id)) reads.push({ src: u.id, words: ws.map(w => w.id), title: r.title, tvi: r.tvi, text: r.text, vi: r.vi, qs: r.qs }); }
  if (L.id === 'A1') for (const u of sup) u.words.forEach(w => put({ ...w }, 'A1', u.vi));
}
// --- cấp "+"
const ZIPF = JSON.parse(fs.readFileSync(root + 'content/ref/zipf.json', 'utf8'));
for (const L of ['A2', 'B1', 'B2']) {
  const xs = pool.filter(x => x.lv === L), cj = x => { const c = forms(x.w.w).map(f => REF.get(f)).find(Boolean); return c ? ORD.indexOf(c) - ORD.indexOf(L) : 0; };   // CEFR-J cao hơn → khó; thấp hơn → dễ (đồ vật quen thuộc ít gặp trong văn bản)
  const YL = JSON.parse(fs.readFileSync(root + 'content/cambridge-yle.json', 'utf8')), easy = new Set([...YL.starters, ...YL.movers]);
  const d = x => cj(x) - (forms(x.w.w).some(f => easy.has(f)) ? 1 : 0) - (x.w.pic ? 0.5 : 0);   // Cambridge Starters / Movers → dễ hơn; có hình (emoji, đồ vật cụ thể, dễ hình dung) → dễ hơn
  xs.sort((a, b) => d(b) - d(a) || (ZIPF[a.w.w] ?? 0) - (ZIPF[b.w.w] ?? 0));   // khó nhất trước
  xs.slice(0, Math.floor(xs.length / 2)).forEach(x => { x.lv = L + '+'; });
}
// --- chia bài
const chunk = ws => { const k = Math.ceil(ws.length / 10), r = []; for (let i = 0; i < k; i++) r.push(ws.slice(Math.round(i * ws.length / k), Math.round((i + 1) * ws.length / k))); return r; };
const course = (lvName, filter) => { const out = []; let ch = 0;
  THEMES.forEach(([icon, name], ti) => { const ws = pool.filter(x => x.th === ti && filter(x)).map(x => x.w); if (!ws.length) return;
    chunk(ws).forEach((part, bi) => out.push({ id: `${lvName}-c${ch + 1}-b${bi + 1}`, lv: lvName, ch, chIcon: icon, chName: name, bi: bi + 1, vi: `${name} ${bi + 1}`, words: part })); ch++; });
  return out; };
const a1all = pool.filter(x => x.lv === 'A1'), pre = x => x.lv === 'A1' && isPre(x.w.w);
const units1 = [...course('pre', pre), ...course('a1', x => x.lv === 'A1' && !isPre(x.w.w))], units2 = [...course('a2', x => x.lv === 'A2'), ...course('a2p', x => x.lv === 'A2+')];
const inCourse = new Set([...units1, ...units2].flatMap(u => u.words.map(w => w.id)));
const readsFor = lvs => reads.filter(r => r.words.some(id => inCourse.has(id)));
fs.writeFileSync(root + 'a1.json', JSON.stringify({ units: units1, reads: readsFor() }));
fs.writeFileSync(root + 'a2.json', JSON.stringify({ units: units2, reads: [] }));
fs.writeFileSync(root + 'ref.json', JSON.stringify({ words: pool.filter(x => !['A1', 'A2', 'A2+'].includes(x.lv)).map(x => ({ id: x.w.id, w: x.w.w, pos: x.w.pos, ipa: x.w.ipa, vi: x.w.vi, ex: x.w.ex, exVi: x.w.exVi, lv: x.lv.toLowerCase().replace('+', 'p') })) }));
const c = l => pool.filter(x => x.lv === l).length, n = us => us.reduce((s, u) => s + u.words.length, 0);
console.log(`Pre-A1 ${n(units1.filter(u => u.lv === 'pre'))} từ / ${units1.filter(u => u.lv === 'pre').length} bài · A1 ${n(units1.filter(u => u.lv === 'a1'))} / ${units1.filter(u => u.lv === 'a1').length} · A2 ${n(units2.filter(u => u.lv === 'a2'))} / ${units2.filter(u => u.lv === 'a2').length} · A2+ ${n(units2.filter(u => u.lv === 'a2p'))} / ${units2.filter(u => u.lv === 'a2p').length} · B1 ${c('B1')} · B1+ ${c('B1+')} · B2 ${c('B2')} · B2+ ${c('B2+')} · C1 ${c('C1')} · C2 ${c('C2')} · tổng ${pool.length} · theo Oxford ${pool.filter(x => x.by === 'oxford').length} · theo CEFR-J/Octanove ${pool.filter(x => x.by === 'cefrj').length} · bài đọc ${reads.length}`);
console.log('từ A1/A2 ở chủ đề cuối "Ý tưởng":', pool.filter(x => ['A1', 'A2'].includes(x.lv) && x.th === THEMES.length - 1).length);
for (const l of ['pre', 'a1', 'a2', 'a2p']) { const us = [...units1, ...units2].filter(u => u.lv === l); console.log(l, [...new Set(us.map(u => u.ch))].map(c => { const x = us.filter(u => u.ch === c); return x[0].chIcon + x.length; }).join(' ')); }
