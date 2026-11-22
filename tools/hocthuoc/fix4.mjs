// Áp sửa theo soát đợt 2 (bài 25–63). Chuỗi không tìm thấy thì báo, không dừng.
import fs from 'node:fs'; import vm from 'node:vm';
const D = '/tmp/claude-0/-home-user-English-CEFR/48c67d5c-dc08-58ba-be65-4b058158838d/scratchpad/bai/';
const F = [
 ['bai40.js', 'It will rain tomorrow, so we ___ the picnic.', 'It will rain tomorrow, so we ___ the picnic next week instead.'],
 ['bai40.js', '["will cancel", "canceled", "have canceled", "canceling"]', '["will hold", "held", "have held", "holding"]'],
 ['bai37.js', 'Tôi sẽ đi chuyến tàu sớm nhất,', 'Tôi muốn đi chuyến tàu sớm nhất,', 2],
 ['bai39.js', "Don't worry, we ___ you a new ticket.", "Don't worry, we ___ you a new ticket in a moment."],
 ['bai47.js', 'The store was closed, ___ we came back tomorrow.', 'The store was closed, ___ we will come back tomorrow.'],
 ['bai62.js', '"q":"Guests ___ before May 1 get a free upgrade.","o":["registered","registering","register","registers"],"a":0,"vi":"Guests registered = những khách đã đăng ký."', '"q":"Orders ___ before May 1 get free shipping.","o":["placed","placing","place","places"],"a":0,"vi":"Orders placed = những đơn được đặt (phân từ V3)."'],
 ['bai61.js', '"vi":"Ông đặt lúc 4:30 chiều thứ Hai, mà đơn sau 3:00 chiều được xử lý vào ngày làm việc kế tiếp (thứ Ba)."', '"vi":"Ông gửi e-mail lúc 4:30 và đặt đơn một giờ trước đó (khoảng 3:30 chiều thứ Hai), mà đơn đặt sau 3:00 chiều được xử lý vào ngày làm việc kế tiếp (thứ Ba)."'],
 ['bai50.js', 'và gửi cho anh mã theo dõi.', 'và gửi cho chị mã theo dõi.'], ['bai50.js', '"và gửi cho anh",', '"và gửi cho chị",'],
 ['bai49.js', 'và nên hoàn thành trong vòng 18 tháng.', 'và dự kiến hoàn thành trong vòng 18 tháng.'], ['bai49.js', '"và nên hoàn thành",', '"và dự kiến hoàn thành",'],
 ['bai61.js', 'ˈprɑːsesd', 'ˈprɑːsest', 9], ['bai48.js', 'meɪ|twelf|', 'meɪ|twelfθ|'],
 ['bai25.js', 'will wait', 'will check the car'],
];
const bad = [];
for (const [f, a, b, many] of F) { let s = fs.readFileSync(D + f, 'utf8'); const c = s.split(a).length - 1;
  if (!c || (c > 1 && !many)) { bad.push(`${f}: ${c} lần · ${a.slice(0, 40)}`); continue; } s = s.split(a).join(b); fs.writeFileSync(D + f, s); }
// đổi phương án "so" ở câu "The train is fast, ___ the ticket is expensive." (bài 37)
{ let s = fs.readFileSync(D + 'bai37.js', 'utf8'); const i = s.indexOf('The train is fast, ___ the ticket is expensive.'); if (i < 0) bad.push('bai37 câu train'); else { const j = s.indexOf(']', i); const seg = s.slice(i, j + 1).replace(/(["'])so\1/, '$1if$1'); s = s.slice(0, i) + seg + s.slice(j + 1); fs.writeFileSync(D + 'bai37.js', s); } }
// thêm đáp án b4 / bỏ "not"; khuôn bài 57–63 (tên bài Nền nằm nhầm ở t)
const load = n => { const c = { WHO: {} }; vm.createContext(c); vm.runInContext(fs.readFileSync(D + `bai${n}.js`, 'utf8') + `;this.B=BAI${n}`, c); return c.B; };
const save = (n, B) => fs.writeFileSync(D + `bai${n}.js`, `const BAI${n} = ` + JSON.stringify(B, null, 1) + ';\n');
const addAns = (n, id, xs) => { const B = load(n), m = B.MU.find(x => x.id === id); for (const x of xs) if (!m.b4.ans.includes(x)) m.b4.ans.push(x); save(n, B); };
addAns(28, 'g4', ['will']); addAns(28, 'g5', ['will']); addAns(26, 'g3', ['should']); addAns(36, 'g4', ['’m meeting']); addAns(37, 'g4', ['’ll take']);
{ const B = load(40), m = B.MU.find(x => x.id === 'v2'); m.b4.ans = m.b4.ans.filter(x => x !== 'not'); save(40, B); }
for (let n = 57; n <= 63; n++) { const B = load(n); for (const m of B.MU.filter(x => x.g === 'g')) if (/Bài Nền liên quan:\s*$/.test(m.b1.vi)) { m.b1.vi = m.b1.vi.replace(/\s*$/, ' ') + m.t; m.t = m.t.replace(/\s*·\s*(Pre-A1|A1|A2|B1|B2|C1|C2)$/, ''); } save(n, B); }
console.log(bad.length ? 'KHÔNG ÁP:\n' + bad.join('\n') : 'áp hết');
