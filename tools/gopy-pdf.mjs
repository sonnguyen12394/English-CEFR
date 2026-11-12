// 📄 Claude đọc / xoá PDF người học gửi kèm góp ý (v157, specs/014-gopy-pdf-lon).
// Khoá (biến môi trường PDF_KEY → header x-pdf-key): Claude tạo khoá tạm 24 giờ bằng Supabase MCP execute_sql:
//   insert into public.gopy_pdf_key (k) values (encode(gen_random_bytes(24), 'hex')) returning k;
// rồi chạy PDF_KEY=<k> node tools/gopy-pdf.mjs …  (bảng chỉ máy chủ đọc; không cần secret, người sáng lập không phải làm gì).
// Dùng: node tools/gopy-pdf.mjs list
//       node tools/gopy-pdf.mjs get <id> [thư mục ra]   → tải từng phần, kiểm SHA-256, ghép thành <tên>.pdf
//       node tools/gopy-pdf.mjs del <id>
import fs from 'node:fs'; import path from 'node:path'; import crypto from 'node:crypto';
const U = 'https://eojrfoormaqboxwvdqhr.supabase.co/functions/v1/gopy-pdf', K = 'sb_publishable_WGUA_5AyhR8a_yQfty8JBA_EaJdkZA7';
const MB = b => (b / 1048576).toFixed(1) + ' MB';
const fn = async body => { const h = { apikey: K, 'content-type': 'application/json' }; if (process.env.PDF_KEY) h['x-pdf-key'] = process.env.PDF_KEY;
  const r = await fetch(U, { method: 'POST', headers: h, body: JSON.stringify(body) }); const d = await r.json().catch(() => ({ error: 'HTTP ' + r.status }));
  if (d.error) { console.error('Lỗi:', d.error, r.status === 403 ? '(thiếu hoặc sai khoá x-pdf-key)' : ''); process.exit(1); } return d; };
const [act, id, outDir] = process.argv.slice(2);
if (act === 'list') { const d = await fn({ act: 'list' });
  console.log(`Kho: ${MB(d.used)} / ${MB(d.cap)}`);
  for (const r of d.rows) console.log(`${r.st.padEnd(4)} ${r.id}  ${MB(r.size).padStart(9)}  ${r.n} phần  ${r.at.slice(0, 16)}  ${r.name}`); }
else if (act === 'get' && id) { const d = await fn({ act: 'get', id }), r = d.row;
  if (r.st !== 'du') console.log(`⚠️ Tệp chưa đủ (trạng thái ${r.st}).`);
  const dir = outDir || process.env.TMPDIR || '/tmp'; fs.mkdirSync(dir, { recursive: true });
  const dst = path.join(dir, r.id.slice(0, 8) + '-' + r.name.replace(/[^\w.\-]+/g, '_')), fd = fs.openSync(dst + '.tmp', 'w'); const miss = [];
  for (let i = 0; i < r.n; i++) { const p = r.parts[i], u = d.urls[i]; if (!u) { miss.push(i); continue; }
    let buf = null; for (let k = 0; k < 3 && !buf; k++) { try { const x = await fetch(u); if (x.ok) buf = Buffer.from(await x.arrayBuffer()); } catch (e) {} }
    if (!buf || buf.length !== p.size || crypto.createHash('sha256').update(buf).digest('hex') !== p.sha) { miss.push(i); continue; }
    fs.writeSync(fd, buf); process.stdout.write(`\rphần ${i + 1}/${r.n}`); }
  fs.closeSync(fd); console.log();
  if (miss.length) { fs.rmSync(dst + '.tmp'); console.error(`Thiếu / hỏng phần: ${miss.join(', ')}. Không ghép tệp.`); process.exit(1); }
  fs.renameSync(dst + '.tmp', dst); console.log(`✓ ${dst} (${MB(r.size)}, ${r.n} phần khớp SHA-256)`); }
else if (act === 'del' && id) { await fn({ act: 'del', id }); console.log('✓ Đã xoá tệp', id); }
else { console.log('Dùng: node tools/gopy-pdf.mjs list | get <id> [thư mục] | del <id>'); process.exit(2); }
