// Dựng bảng "hay bị nghe nhầm thành" cho mọi từ trong các bài học thuộc: node tools/hocthuoc/nham.mjs <thư mục bài> <tệp ra nham.js>
// Ứng viên = từ trong từ điển app (a1 / a2 / b.json, có IPA) + từ trong các bài; khoảng cách = số âm vị khác nhau (sửa / thêm / bớt).
// Mỗi chỗ khác nhau sinh một câu sửa từ bảng cặp âm PAIR (Claude soạn theo lỗi người Việt hay gặp, chưa giáo viên kiểm).
import fs from 'node:fs'; import vm from 'node:vm';
const DIR = process.argv[2], OUT = process.argv[3];
const MULTI = ['tʃ', 'dʒ', 'aɪ', 'aʊ', 'ɔɪ', 'eɪ', 'oʊ', 'əʊ', 'ɪə', 'eə', 'ʊə', 'iː', 'uː', 'ɑː', 'ɔː', 'ɜː', 'ɝː'];
// chuẩn hoá Anh–Anh → Anh–Mỹ thô để so được hai nguồn
const normI = s => String(s || '').replace(/[\/ˈˌ.‿()]/g, '').replace(/əʊ/g, 'oʊ').replace(/ɒ/g, 'ɑː').replace(/ɜː/g, 'ɝː').replace(/ɚ/g, 'ər').replace(/eə/g, 'er').replace(/ɪə/g, 'ɪr').replace(/ʊə/g, 'ʊr').replace(/ɝ(?!ː)/g, 'ɝː').replace(/ɡ/g, 'g').replace(/r$/, 'r');
const tok = s => { s = normI(s).replace(/\s+/g, ''); const out = []; for (let i = 0; i < s.length;) { const m = MULTI.find(x => s.startsWith(x, i)); if (m) { out.push(m); i += m.length; } else { if (s[i] !== 'ː') out.push(s[i]); i++; } } return out; };
// cặp âm hay lẫn → mẹo (khoá sắp xếp a|b)
const P = {}; const pair = (a, b, t) => { P[[a, b].sort().join('|')] = t; };
pair('aʊ', 'ɔː', '/aʊ/ là "ao" có trượt: mở "a" rồi chu môi về "u"; /ɔː/ là "o" dài, môi tròn, không trượt.');
pair('aʊ', 'ʌ', '/aʊ/ là "ao" có trượt; /ʌ/ là "ă" ngắn, không trượt.');
pair('dʒ', 'tʃ', '/dʒ/ có rung cổ (đặt tay lên cổ thấy rung); /tʃ/ chỉ bật hơi, không rung.');
pair('iː', 'ɪ', '/iː/ "i" kéo dài, môi cười; /ɪ/ "i" ngắn, thả lỏng, gần "ê".');
pair('uː', 'ʊ', '/uː/ "u" kéo dài, môi tròn chặt; /ʊ/ "u" ngắn, môi lỏng.');
pair('æ', 'e', '/æ/ mở miệng rộng, hàm hạ thấp (giữa "a" và "e"); /e/ miệng hẹp hơn, như "e" tiếng Việt.');
pair('æ', 'ʌ', '/æ/ miệng mở rộng sang hai bên; /ʌ/ "ă" ngắn, miệng mở vừa.');
pair('ɑː', 'ʌ', '/ɑː/ "a" dài, há to; /ʌ/ "ă" ngắn.');
pair('eɪ', 'e', '/eɪ/ "ây" có trượt lên "i"; /e/ là "e" ngắn, không trượt.');
pair('oʊ', 'ɔː', '/oʊ/ "âu" trượt môi tròn dần; /ɔː/ "o" dài giữ nguyên.');
pair('oʊ', 'ɑː', '/oʊ/ "âu" môi tròn; /ɑː/ "a" há to, môi không tròn.');
pair('aɪ', 'eɪ', '/aɪ/ "ai" mở rộng hơn; /eɪ/ "ây".');
pair('θ', 't', '/θ/ đầu lưỡi giữa hai răng, thổi hơi; /t/ đầu lưỡi chạm lợi trên rồi bật.');
pair('θ', 's', '/θ/ đầu lưỡi giữa hai răng; /s/ lưỡi sau răng, rít "xì".');
pair('θ', 'f', '/θ/ dùng lưỡi và răng; /f/ dùng răng trên chạm môi dưới.');
pair('ð', 'd', '/ð/ đầu lưỡi giữa hai răng, có rung; /d/ đầu lưỡi chạm lợi trên.');
pair('ð', 'z', '/ð/ đầu lưỡi giữa hai răng; /z/ lưỡi sau răng, rít "zzz".');
pair('v', 'b', '/v/ răng trên chạm môi dưới, rung; /b/ hai môi chạm nhau rồi bật.');
pair('v', 'w', '/v/ răng chạm môi dưới; /w/ chu tròn môi, không chạm răng.');
pair('v', 'f', '/v/ có rung cổ; /f/ chỉ có hơi.');
pair('z', 's', '/z/ có rung, rít "zzz"; /s/ không rung, "xì". Đuôi -s sau âm hữu thanh thường đọc /z/.');
pair('ʃ', 's', '/ʃ/ môi chu, lưỡi lùi sau ("suỵt"); /s/ môi dẹt, lưỡi sau răng.');
pair('ʒ', 'dʒ', '/ʒ/ kéo dài, không bật; /dʒ/ bật ra một lần.');
pair('l', 'r', '/l/ đầu lưỡi chạm lợi trên; /r/ cong lưỡi lên, không chạm.');
pair('n', 'l', '/n/ hơi đi qua mũi; /l/ hơi đi hai bên lưỡi.');
pair('n', 'ŋ', '/n/ đầu lưỡi chạm lợi trên ("n"); /ŋ/ cuống lưỡi chạm vòm mềm ("ng").');
pair('m', 'n', '/m/ ngậm môi; /n/ môi mở, lưỡi chạm lợi trên.');
pair('p', 'b', '/p/ bật hơi mạnh, không rung; /b/ có rung.');
pair('t', 'd', '/t/ bật hơi, không rung; /d/ có rung.');
pair('k', 'g', '/k/ bật hơi, không rung; /g/ có rung.');
pair('k', 't', '/k/ cuống lưỡi chặn hơi; /t/ đầu lưỡi chặn hơi.');
pair('p', 't', '/p/ hai môi chặn hơi; /t/ đầu lưỡi chặn hơi.');
pair('ɝː', 'ɔː', '/ɝː/ "ơ" có cong lưỡi; /ɔː/ "o" dài môi tròn.');
pair('ɝː', 'ɑː', '/ɝː/ "ơ" cong lưỡi, miệng mở vừa; /ɑː/ "a" há to.');
pair('ə', 'ɪ', '/ə/ "ơ" rất nhẹ; /ɪ/ "i" ngắn.');
pair('h', '', 'Âm /h/ đầu từ là hơi thở ra nhẹ, đừng bỏ.');
const PH = x => `/${x}/`;
const diffTips = (a, b) => {   // a = từ đúng, b = từ nhầm (mảng âm vị) → các câu sửa
  const n = a.length, m = b.length, d = Array.from({ length: n + 1 }, (_, i) => Array.from({ length: m + 1 }, (_, j) => i ? (j ? 0 : i) : j));
  for (let i = 1; i <= n; i++) for (let j = 1; j <= m; j++) d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  const ops = []; let i = n, j = m;
  while (i || j) { if (i && j && d[i][j] === d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)) { if (a[i - 1] !== b[j - 1]) ops.push(['s', a[i - 1], b[j - 1], i - 1]); i--; j--; }
    else if (i && d[i][j] === d[i - 1][j] + 1) { ops.push(['d', a[i - 1], '', i - 1]); i--; } else { ops.push(['i', '', b[j - 1], i]); j--; } }
  return { dist: d[n][m], known: ops.filter(([o, x, y, pos]) => o === 's' ? !!P[[x, y].sort().join('|')] : o === 'd' && pos >= n - 1).length, tips: ops.reverse().map(([o, x, y, pos]) => {
    const fin = pos >= n - 1;
    if (o === 's') return P[[x, y].sort().join('|')] ? `${PH(x)} chứ không phải ${PH(y)}: ` + P[[x, y].sort().join('|')] : `Đọc ${PH(x)}, đừng đọc thành ${PH(y)}.`;
    if (o === 'd') return fin ? `Bật rõ âm cuối ${PH(x)} (người Việt hay nuốt âm cuối).` : `Đừng bỏ âm ${PH(x)} ở ${pos === 0 ? 'đầu' : 'giữa'} từ.` + (P[[x, ''].sort().join('|')] ? ' ' + P[[x, ''].sort().join('|')] : '');
    return `Đừng thêm âm ${PH(y)}${pos >= n ? ' ở cuối' : ''}.`; }) }; };
// từ điển
const DICT = new Map(); const addD = (w, ipa, lv) => { const k = w.toLowerCase(); if (!/^[a-z]+(-[a-z]+)?$/.test(k) || !ipa) return; if (!DICT.has(k)) DICT.set(k, { ipa, lv, t: tok(ipa) }); };
const LV = { pre: 0, a1: 1, a2: 2, a2p: 2, b1: 3, b1p: 3, b2: 4, b2p: 4, c1: 5, c2: 6 };
for (const f of ['a1.json', 'a2.json', 'b.json']) for (const u of JSON.parse(fs.readFileSync(f)).units) for (const w of u.words || []) addD(w.w, w.ipa, LV[u.lv] ?? 4);
// từ trong các bài
const words = new Map(); const files = fs.readdirSync(DIR).filter(f => /^bai\d+\.js$/.test(f));
for (const f of files) { const n = f.match(/\d+/)[0], c = { WHO: {} }; vm.createContext(c); try { vm.runInContext(fs.readFileSync(`${DIR}/${f}`, 'utf8') + `;this.B=BAI${n}`, c); } catch (e) { continue; }
  const B = c.B; B.L.forEach((l, i) => l[1].split(/\s+/).forEach((w, j) => { const k = w.toLowerCase().replace(/[’‘]/g, "'").replace(/^[^a-z]+|[^a-z]+$/g, ''); const ipa = (B.IPA[i] || [])[j];
    if (/^[a-z]{2,}$/.test(k) && ipa && !words.has(k)) words.set(k, ipa); })); }
// bài 1 nằm thẳng trong trang mẫu (base.html): lấy L + IPA của nó
{ const h = fs.existsSync(DIR + '/base.html') ? fs.readFileSync(DIR + '/base.html', 'utf8') : ''; const i = h.indexOf('let L = ['), j = h.indexOf('const WHO', i);
  if (i >= 0 && j > i) { const c = {}; vm.createContext(c); vm.runInContext(h.slice(i, j).replace(/\blet /g, 'var ') + ';this.B={L,IPA}', c);
    c.B.L.forEach((l, k) => l[1].split(/\s+/).forEach((w, m) => { const x = w.toLowerCase().replace(/[’‘]/g, "'").replace(/^[^a-z]+|[^a-z]+$/g, ''); const ipa = (c.B.IPA[k] || [])[m]; if (/^[a-z]{2,}$/.test(x) && ipa && !words.has(x)) words.set(x, ipa); })); } }
const POOL = [...DICT.entries()];
const out = {};
for (const [w, ipaBai] of words) { const me = DICT.get(w), T = me ? me.t : tok(ipaBai); if (T.length < 2) continue;
  const max = T.length <= 4 ? 1 : 2, cands = [];
  for (const [k, v] of POOL) { if (k === w || Math.abs(v.t.length - T.length) > max + 1) continue;
    if (k.startsWith(w) || w.startsWith(k) && w.length - k.length <= 3 && /^(s|es|ed|d|ing|er|ly)$/.test(w.slice(k.length))) continue;   // cùng gốc (ask / asked)
    const r = diffTips(T, v.t); if (r.dist >= 1 && (r.dist <= max || (r.dist === max + 1 && r.known === r.dist))) cands.push([r.dist, v.lv, k, v.ipa, r.tips, r.known]); }
  cands.sort((a, b) => (a[0] - a[5] * 0.6) - (b[0] - b[5] * 0.6) || a[1] - b[1]);
  const pick = cands.slice(0, 3).map(c => [c[2], c[3].replace(/^\/|\/$/g, ''), c[4]]);
  if (pick.length) out[w] = pick; }
fs.writeFileSync(OUT, '// Từ hay bị nghe nhầm (dựng bởi tools/hocthuoc/nham.mjs): từ → [[từ nhầm, IPA, [cách sửa]]]\nconst NHAM = ' + JSON.stringify(out) + ';\n');
console.log('từ trong bài', words.size, '· có từ nhầm', Object.keys(out).length, '·', (fs.statSync(OUT).size / 1024).toFixed(0), 'KB');
for (const w of ['lounge', 'luggage', 'extend', 'booked', 'checkout', 'flight', 'leave', 'store', 'bridge', 'think', 'three']) if (out[w]) console.log(w, '→', out[w].map(x => x[0] + ' (' + x[2].join(' | ') + ')').join(' ;; '));
