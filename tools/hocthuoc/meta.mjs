// Dữ liệu thêm cho từng bài theo dạng (gắn vào meta khi dựng bản mẫu): node tools/hocthuoc/meta.mjs <thư mục bài> N  (chạy ở gốc repo)
// - title: dòng đầu văn bản (Gửi / Từ / Tiêu đề) cho ✉️ / 📄
// - evl: với mỗi câu EXQ, chỉ số câu (L) chứa đáp án, cho 🔎 Tìm chỗ chứa đáp án (📄 Part 7): lấy `ev` của đề nếu có, không thì chọn câu trùng chữ nhiều nhất với `why` / đáp án
// - p2: các cặp Part 2 kèm 3 phương án của đề, cho ⚡ Phản xạ (💬)
import fs from 'node:fs'; import vm from 'node:vm';
const [DIR, N] = [process.argv[2], +process.argv[3]];
const c = { WHO: {} }; vm.createContext(c); vm.runInContext(fs.readFileSync(`${DIR}/bai${N}.js`, 'utf8') + `;this.B=BAI${N}`, c); const B = c.B;
const inp = JSON.parse(fs.readFileSync(`${DIR}/bai${N}.in.json`));
const out = {}; if (inp.title) out.title = inp.title;
// mục tiêu + mã chủ đề (docs/KE-HOACH-HOC-THUOC.md mục 2): baiN.in.json, không có thì tools/hocthuoc/chu.json
const CHU = JSON.parse(fs.readFileSync('tools/hocthuoc/chu.json')); out.muc = inp.muc || 'toeic'; if (inp.chu || CHU[N]) out.chu = inp.chu || CHU[N];
const toks = t => String(t || '').toLowerCase().replace(/[’‘]/g, "'").split(/[^a-z0-9']+/).filter(w => w.length > 2);
if (B.meta.dang.includes('Đọc hiểu')) {
  out.evl = B.EXQ.map(q => { const src = (inp.exq || []).find(x => x.q === q.q) || {};
    if (src.ev) { const K = new Set(toks(src.ev)); let best = -1, bs = 0; B.L.forEach((l, i) => { const t = toks(l[1]), sc = t.filter(w => K.has(w)).length / (K.size || 1); if (sc > bs) { bs = sc; best = i; } }); if (bs > 0.5) return best; }
    const STOP = new Set(['the', 'and', 'for', 'with', 'that', 'this', 'are', 'was', 'will', 'what', 'who', 'why', 'how', 'when', 'where', 'which', 'does', 'did', 'about', 'most', 'likely', 'according', 'from', 'have', 'has', 'not', 'you', 'your']);
    const W1 = new Set(toks(/[a-z]{4}/i.test(src.why || '') ? src.why : '').filter(w => !STOP.has(w))), W2 = new Set(toks(q.o[0]).filter(w => !STOP.has(w))), W3 = new Set(toks(q.q).filter(w => !STOP.has(w)));
    let best = -1, bs = 0; B.L.forEach((l, i) => { if (/^\(\d\)/.test(l[1])) return; const t = toks(l[1]); const sc = (t.filter(w => W1.has(w)).length + 2 * t.filter(w => W2.has(w)).length + t.filter(w => W3.has(w)).length) / Math.sqrt(t.length + 1); if (sc > bs) { bs = sc; best = i; } });
    return bs > 0.25 ? best : -1; }); }
if (B.meta.dang.includes('Hỏi') && inp.p2) out.p2 = inp.p2;   // 💬 Giao tiếp: bộ 3 lời đáp tự soạn trong in.json (đặc tả 022)
else if (B.meta.dang.includes('Hỏi')) {
  const T = JSON.parse(fs.readFileSync('toeic.json')), kho = Object.fromEntries(T.p2.map(x => [x.id, x]));
  const m = String(inp.id).match(/^de(\d+)-p2-bo(\d+)$/); const de = +m[1], bo = +m[2] - 1;
  const D = de <= 2 ? T.tron[de - 1] : JSON.parse(fs.readFileSync(`toeic-tron/de${de}.json`));
  out.p2 = D.p2.slice(bo * 10, bo * 10 + 10).map(y => typeof y === 'string' ? kho[y] : y).map(y => ({ q: y.q, o: y.o, a: y.a })); }
console.log(JSON.stringify(out));
