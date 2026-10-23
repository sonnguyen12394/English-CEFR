// Chép âm thanh thu sẵn (giọng Kokoro của game, a/c/<khoá>.mp3) cho từ + câu ví dụ của a1.json, a2.json, ghi danh mục a/index.json.
// Chạy: node tools/copy-clips.mjs ../sonnguyen12394.github.io   (khoá tính như clipKey của game: FNV-1a trên câu đã chuẩn hoá)
import fs from 'node:fs';
const src = process.argv[2] || '../sonnguyen12394.github.io', root = new URL('..', import.meta.url).pathname;
const clipNorm = t => String(t).replace(/[‘’]/g, "'").replace(/[“”]/g, '"').replace(/\s+/g, ' ').trim().replace(/[.,;:]+$/, '').toLowerCase();
const clipKey = t => { let h = 0x811c9dc5; const x = clipNorm(t); for (let i = 0; i < x.length; i++) { h ^= x.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; } return 'a' + h.toString(16).padStart(8, '0'); };
const keys = new Set(), W = ['a1.json', 'a2.json'].filter(f => fs.existsSync(root + f)).flatMap(f => JSON.parse(fs.readFileSync(root + f, 'utf8')).units.flatMap(u => u.words));
for (const w of W) for (const t of [w.w, w.ex]) { const k = clipKey(t); if (fs.existsSync(`${src}/a/c/${k}.mp3`)) keys.add(k); }
fs.mkdirSync(root + 'a', { recursive: true });
for (const k of keys) fs.copyFileSync(`${src}/a/c/${k}.mp3`, `${root}a/${k}.mp3`);
fs.writeFileSync(root + 'a/index.json', JSON.stringify([...keys].sort()));
console.log(keys.size, 'tệp');
