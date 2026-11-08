// v145 📚 Kho đề soạn sẵn (specs/007-kho-de-soan-san): content/dekho/*.json → dekho.json. Không sửa tay dekho.json.
// Người sáng lập 8/11/2026: dùng gói Pro, không tốn tiền API → Claude soạn đề trong phiên Claude Code, app phát đề từ kho (không gọi máy chủ).
// Mỗi đề là đầu ra thô giống AI (g) + mã kỳ thi / kỹ năng / dạng; kiểm bằng ĐÚNG máy kiểm của máy chủ (khuon.js spec + clean):
// lỗi cứng hoặc câu bị máy kiểm bỏ (lỗi mềm) = dừng; hai đề cùng nhóm trùng nhau (trung.js isDup) = dừng.
// Chạy: node tools/build-dekho.mjs
import fs from 'node:fs';
import path from 'node:path';
import { spec, clean } from '../supabase/functions/de-ai/khuon.js';
import { isDup } from '../supabase/functions/de-ai/trung.js';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const DIR = path.join(ROOT, 'content/dekho');
// mã kỳ thi dùng được: IELTS Nghe / Đọc học thuật dùng cho cả Academic và General Training (Section 3); Cambridge cấp "+" dùng đề cấp gốc
const FOR = (ky, sk, dang) => ky.startsWith('ielts') ? (dang === 'R-gt' ? ['ielts-gt'] : sk === 'doc' || sk === 'nghe' ? ['ielts-ac', 'ielts-gt'] : [ky])
  : /^cb-(a2|b1|b2)$/.test(ky) ? [ky, ky + 'p'] : [ky];
const bad = [], out = [], ids = new Set();
for (const f of fs.readdirSync(DIR).filter(x => x.endsWith('.json')).sort()) {
  let arr; try { arr = JSON.parse(fs.readFileSync(path.join(DIR, f), 'utf8')); } catch (e) { bad.push(`${f}: JSON hỏng (${e.message})`); continue; }
  for (const x of arr) { const at = `${f} › ${x.id || '?'}`;
    if (!x.id || ids.has(x.id)) { bad.push(`${at}: thiếu mã hoặc trùng mã`); continue; } ids.add(x.id);
    const sp = spec(x.ky, x.sk, x.dang); if (!sp) { bad.push(`${at}: dạng ${x.ky} / ${x.sk} / ${x.dang} không có khuôn`); continue; }
    const P = { ky: x.ky, sk: x.sk, dang: x.dang, muc: x.muc || '' }, r = clean(x.g, sp, P);
    if (r.hard.length) { bad.push(`${at}: ${r.hard.join('; ')}`); continue; }
    if (r.soft.length) { bad.push(`${at}: máy kiểm bỏ câu: ${r.soft.join('; ')}`); continue; }
    const n = (x.g.groups || []).reduce((s, g) => s + (g.items || []).length, 0), kept = (r.de.groups || []).reduce((s, g) => s + g.items.length, 0);
    if (sp.q && kept !== n) { bad.push(`${at}: còn ${kept}/${n} câu sau máy kiểm`); continue; }
    const de = { ...r.de, kho: 1 }; delete de.muc;
    const olds = out.filter(o => o.de.ky === de.ky && o.de.sk === de.sk).map(o => ({ chude: o.id, de: o.de }));
    const dup = isDup(de, olds, {}); if (dup) { bad.push(`${at}: trùng ${olds[dup.i].chude} (${dup.why})`); continue; }
    out.push({ id: x.id, for: FOR(x.ky, x.sk, x.dang), de }); } }
if (bad.length) { console.log('⛔ Kho đề có lỗi, không ghi dekho.json:\n- ' + bad.join('\n- ')); process.exit(1); }
const by = {}; for (const o of out) { const k = `${o.de.ky} ${o.de.sk}:${o.de.dang}`; by[k] = (by[k] || 0) + 1; }
fs.writeFileSync(path.join(ROOT, 'dekho.json'), JSON.stringify({ v: 1, n: out.length, de: out }) + '\n');
console.log(`✅ dekho.json: ${out.length} đề · ` + Object.entries(by).map(([k, n]) => `${k} ×${n}`).join(' · '));
