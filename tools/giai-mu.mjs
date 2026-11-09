// Giải mù đề thử trọn TOEIC (specs/011-kiem-noi-dung-de R4; docs/TIEU-CHI-DE-TOEIC.md).
//   node tools/giai-mu.mjs xuat <de> <nghe|doc> <tệp.txt> [--cau 45,46]   → phiếu làm bài KHÔNG đáp án / giải thích / câu trích / nhãn
//   node tools/giai-mu.mjs so <de> <tệp.json>                            → đối chiếu, ghi content/toeic/giai-mu/<de>.json, in tỉ lệ khớp
// Phiếu đánh số câu 1–200 và chữ cái A–D đúng như app (tools/kiem-toeic.mjs units). Phiên giải mù là một phiên Claude phụ (ngữ cảnh mới).
import fs from 'node:fs'; import { spawnSync } from 'node:child_process';
import { root, loadTests, units, dau } from './kiem-toeic.mjs';

const BG = { in: 'trong nhà (tường be, sàn nâu nhạt)', out: 'ngoài trời (trời xanh, cỏ xanh)', sea: 'bờ biển (trời xanh, nước biển xanh)' };
const pos = (x, y) => (y < 70 ? 'trên' : y > 140 ? 'dưới' : 'giữa') + '-' + (x < 107 ? 'trái' : x > 213 ? 'phải' : 'giữa');
const size = n => n < 40 ? 'nhỏ' : n > 70 ? 'lớn' : 'vừa';
const colorName = hex => { const m = /^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(hex || ''); if (!m) return 'màu ' + hex; const [r, g, b] = m.slice(1).map(h => parseInt(h, 16)), mx = Math.max(r, g, b), mn = Math.min(r, g, b);
  if (mx - mn < 24) return mx > 220 ? 'trắng' : mx > 150 ? 'xám nhạt' : mx > 80 ? 'xám' : 'đen';
  if (r >= g && g >= b) return mn > 150 ? 'be / kem' : r > 150 && g > 100 ? 'nâu nhạt' : 'nâu';
  if (r > g && b > g) return 'hồng / tím';
  if (g >= r && g >= b) return mn > 150 ? 'xanh lá nhạt' : 'xanh lá';
  return mn > 150 ? 'xanh nhạt' : 'xanh dương'; };
const NAMES = {};
function emojiNames(list) { const need = [...new Set(list)].filter(e => !(e in NAMES)); if (!need.length) return;
  const r = spawnSync('python3', ['-c', 'import sys, unicodedata, json\nout = {}\nfor e in json.loads(sys.stdin.read()):\n  out[e] = " + ".join(unicodedata.name(c, "") .lower() for c in e if unicodedata.name(c, "") not in ("ZERO WIDTH JOINER", "VARIATION SELECTOR-16"))\nprint(json.dumps(out))'], { input: JSON.stringify(need), encoding: 'utf8' });
  try { Object.assign(NAMES, JSON.parse(r.stdout)); } catch (e) { for (const x of need) NAMES[x] = ''; } }
const picText = p => { emojiNames(p.e.map(e => e[0]));
  return 'Tranh ' + (BG[p.bg] || p.bg) + ': ' + [...(p.r || []).map(r => `khối ${colorName(r[4])} ${r[2]}×${r[3]} ở ${pos(r[0] + r[2] / 2, r[1] + r[3] / 2)}`), ...p.e.map(e => `${e[0]} (${NAMES[e[0]] || '?'}) ${size(e[3])} ở ${pos(e[1], e[2])}`)].join('; ') + '.'; };
const WHO = { A: 'Woman', B: 'Man', C: 'Woman 2' };
const opt = q => q.opts.map((o, i) => `(${'ABCD'[i]}) ${q.fixed ? q.o[i] : o}`).join('\n');
const tableText = g => `Bảng "${g.t}": ${g.h.join(' | ')}\n` + g.r.map(r => '  ' + r.join(' | ')).join('\n');

export function sheet(de, phan, only) { const D = loadTests().find(d => d.id === de); if (!D) throw new Error('không có đề ' + de);
  const U = units(D).filter(u => (phan === 'nghe') === /^p[1-4]$/.test(u.sec)).filter(u => !only || u.qs.some(q => only.includes(q.n)));
  const want = q => !only || only.includes(q.n), out = [], head = { p1: 'PART 1 — chọn câu tả đúng nhất bức tranh', p2: 'PART 2 — chọn lời đáp hợp nhất', p3: 'PART 3 — hội thoại', p4: 'PART 4 — bài nói', p5: 'PART 5 — chọn từ / cụm điền vào chỗ trống', p6: 'PART 6 — điền đoạn văn', p7: 'PART 7 — đọc hiểu' };
  out.push(`ĐỀ THỬ TOEIC — ${D.t} (${de}) — PHẦN ${phan === 'nghe' ? 'NGHE' : 'ĐỌC'}${only ? ' — chỉ các câu ' + only.join(', ') : ''}`,
    'Bạn là thí sinh TOEIC rất giỏi và là người soát đề. Làm từng câu như thi thật; phiếu KHÔNG có đáp án.',
    'Với mỗi câu: chọn MỘT chữ cái ("chon"); mức chắc "chac" 1 = đoán, 2 = khá chắc, 3 = chắc chắn; nếu một phương án khác CŨNG có thể đúng theo bài thì ghi chữ đó vào "hai" (không thì null);',
    'nếu câu hoặc bài có vấn đề (2 đáp án đều được, không đáp án nào đúng, sai sự thật hoặc sai phép tính, tiếng Anh không tự nhiên, câu hỏi lệch người nói, tranh không rõ) thì ghi ngắn vào "ghi" (≤ 25 từ, tiếng Việt), không thì "".',
    phan === 'nghe' ? 'Part 1: bạn không thấy tranh, chỉ có mô tả các hình (emoji, vị trí) trong tranh — chọn câu tả đúng nhất theo mô tả. Part 2–4: lời nghe đã chép thành chữ; "Woman" / "Man" là giọng người nói (thí sinh nghe được giọng).' : 'Part 6: chỗ trống ghi (1)…(4) trong đoạn.',
    'Trả lời bằng MỘT tệp JSON đúng khuôn: {"de": "' + de + '", "phan": "' + phan + '", "cau": [{"n": 1, "chon": "A", "chac": 3, "hai": null, "ghi": ""}, …]} — đủ mọi câu có trong phiếu, theo số câu [n].', '');
  let last = '';
  for (const u of U) { const x = u.x; if (u.sec !== last) { out.push('', '=== ' + head[u.sec] + ' ==='); last = u.sec; }
    if (u.sec === 'p1') { for (const q of u.qs) if (want(q)) out.push('', `[${q.n}] ${picText(x.pic)}`, opt(q)); continue; }
    if (u.sec === 'p2') { for (const q of u.qs) if (want(q)) out.push('', `[${q.n}] ${x.q}`, opt(q)); continue; }
    if (u.sec === 'p3' || u.sec === 'p4') { out.push('', `[${u.a}–${u.b}] ` + (u.sec === 'p3' ? 'Hội thoại:' : `Bài nói (người nói: ${x.sx === 'f' ? 'Woman' : x.sx === 'm' ? 'Man' : 'không rõ'}):`));
      if (u.sec === 'p3') for (const l of x.lines) out.push(`${WHO[l[0]] || l[0]}: ${l[1]}`); else out.push(x.text);
      if (x.g) out.push(tableText(x.g));
      for (const q of u.qs) if (want(q)) out.push('', `[${q.n}] ${q.stem}`, opt(q)); continue; }
    if (u.sec === 'p5') { for (const q of u.qs) if (want(q)) out.push('', `[${q.n}] ${x.s}`, opt(q)); continue; }
    if (u.sec === 'p6') { out.push('', `[${u.a}–${u.b}] ${x.kind || ''}${x.title ? ' · ' + x.title : ''}`, x.text.replace(/\{(\d)\}/g, '($1) ______'));
      for (const q of u.qs) if (want(q)) out.push('', `[${q.n}] Chỗ (${q.gi + 1})`, opt(q)); continue; }
    if (u.sec === 'p7') { out.push('', `[${u.a}–${u.b}] ${x.kind}`); for (const d of x.docs) out.push(`--- ${d.title} ---`, d.text);
      for (const q of u.qs) if (want(q)) out.push('', `[${q.n}] ${q.stem}`, opt(q)); } }
  return out.join('\n') + '\n'; }

export function compare(de, ans) { const D = loadTests().find(d => d.id === de), U = units(D), f = 'content/toeic/giai-mu/' + de + '.json', today = new Date().toISOString().slice(0, 10);
  const G = fs.existsSync(root + f) ? JSON.parse(fs.readFileSync(root + f, 'utf8')) : { _note: 'Kết quả giải mù (tools/giai-mu.mjs): phiên Claude phụ làm đề không xem đáp án. da = đáp án lúc giải, chon = phiên giải mù chọn, hai = phương án thứ hai cũng được, dau = dấu nội dung câu lúc giải.', de, lan: [], cau: {} };
  const byN = {}; for (const u of U) for (const q of u.qs) byN[q.n] = { u, q };
  let n = 0, khop = 0; const lech = [];
  for (const a of ans.cau || []) { const t = byN[a.n]; if (!t) continue; const { u, q } = t, id = u.qs.length > 1 ? u.x.id + '#' + q.k : u.x.id, chon = String(a.chon || '').trim().toUpperCase().slice(0, 1);
    const hai = a.hai ? String(a.hai).trim().toUpperCase().slice(0, 1) : null;
    G.cau[a.n] = { id, dau: dau(u), da: q.L, chon, chac: +a.chac || 0, hai: hai && hai !== chon ? hai : null, ghi: String(a.ghi || '').slice(0, 200), ngay: today };
    n++; if (chon === q.L) khop++; if (chon !== q.L || G.cau[a.n].hai || G.cau[a.n].ghi) lech.push(`câu ${a.n} (${id}): đáp án ${q.L}, chọn ${chon}${G.cau[a.n].hai ? ', thấy ' + G.cau[a.n].hai + ' cũng được' : ''}${G.cau[a.n].ghi ? ' · ' + G.cau[a.n].ghi : ''}`); }
  G.lan.push({ ngay: today, phan: ans.phan || '?', cau: n, khop });
  fs.writeFileSync(root + f, JSON.stringify(G, null, 1) + '\n');
  return { n, khop, lech, f }; }

if (import.meta.url === 'file://' + process.argv[1]) {
  const [cmd, de, a3, a4] = process.argv.slice(2), ci = process.argv.indexOf('--cau'), only = ci > 0 ? process.argv[ci + 1].split(',').map(Number) : null;
  if (cmd === 'xuat') { const t = sheet(de, a3, only); fs.writeFileSync(a4, t); console.log(`đã viết ${a4}: ${(t.match(/^\[\d+\]/gm) || []).length} câu`); }
  else if (cmd === 'so') { const r = compare(de, JSON.parse(fs.readFileSync(a3, 'utf8'))); console.log(`${de}: khớp ${r.khop}/${r.n} → ${r.f}`); for (const l of r.lech) console.log('  ' + l); }
  else { console.log('Dùng: node tools/giai-mu.mjs xuat <de> <nghe|doc> <tệp.txt> [--cau 45,46] | so <de> <tệp.json>'); process.exit(1); } }
