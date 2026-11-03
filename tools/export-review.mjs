// 📋 Bảng kiểm nội dung cho giáo viên (v104): gom nội dung Claude soạn ở v101–v103 vào MỘT trang docs/kiem-noi-dung.html
// (tích ✅ / ❌, ghi chú, lưu trên máy người kiểm, nút chép kết quả để gửi lại). Chạy: node tools/export-review.mjs (chạy lại khi đổi nội dung).
import fs from 'node:fs'; import vm from 'node:vm';
const root = new URL('..', import.meta.url).pathname, J = f => JSON.parse(fs.readFileSync(root + f, 'utf8'));
const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const NP = J('np.json'), NPB = Object.fromEntries(NP.items.map(x => [x.id, x])), H = J('content/np-hieu.json').hieu, G = J('content/np-nhom.json').nhom;
const VN = J('content/viet-noi.json'), NOI = J('content/noi-pre.json'), PB = J('content/pa-b.json'), SL = J('content/suyluan.json');
const DOC = Object.fromEntries([...J('doc.json').items, ...J('nghe.json').items].map(x => [x.id, x]));
const tipSrc = fs.readFileSync(root + 'noi.js', 'utf8').match(/const VN_TIP = \{[\s\S]*?\};/)[0], ctx = {}; vm.runInNewContext(tipSrc.replace('const VN_TIP', 'this.VN_TIP'), ctx);
const sec = [], row = (id, html) => `<div class="r" data-id="${esc(id)}"><div class="c">${html}</div><div class="k"><label><input type="radio" name="${esc(id)}" value="1">✅ Đúng</label><label><input type="radio" name="${esc(id)}" value="0">❌ Sai</label><input class="n" placeholder="Ghi chú / sửa thành…"></div></div>`;
const add = (t, note, rows) => sec.push(`<section><h2>${t} <span class="mute">(${rows.length})</span></h2><p class="mute">${note}</p>${rows.join('')}</section>`);
add('🧱 Ngữ pháp · câu hỏi hiểu nghĩa', 'Pre-A1 → A2. Câu hỏi về NGHĨA của câu mẫu (không hỏi dạng). Kiểm: đáp án đúng duy nhất, phương án nhiễu sai rõ.', Object.entries(H).flatMap(([id, L]) => L.map((h, i) => row(`hieu:${id}:${i}`,
  `<b>${esc((NPB[id] || {}).title || id)}</b> <span class="mute">${esc((NPB[id] || {}).lv || '')}</span><br>${esc(h.s)}<br>❓ ${esc(h.q)}<br>✔ ${esc(h.a)} · ✗ ${h.w.map(esc).join(' · ✗ ')}`))));
add('🔀 Ngữ pháp · nhóm điểm dễ nhầm', 'Các điểm trong nhóm có thật sự hay bị nhầm với nhau không; nên thêm / bớt điểm nào.', G.map(g => row(`nhom:${g.id}`, `<b>${esc(g.t)}</b><br>${g.ids.map(id => esc((NPB[id] || {}).title || id)).join(' · ')}`)));
add('🔗 Viết · nối câu', 'Câu nối có tự nhiên không; danh sách đáp án được chấp nhận đã đủ chưa (thiếu cách viết đúng nào thì ghi vào ghi chú).', Object.entries(VN).filter(([k]) => k !== '_note').flatMap(([lv, L]) => L.map((it, i) => row(`noi:${lv}:${i}`,
  `<span class="mute">${lv.toUpperCase()}</span> ${esc(it[0])} ${esc(it[1])} · dùng <b>${esc(it[2])}</b><br>✔ ${it.slice(3).map(esc).join('<br>✔ ')}`))));
add('🗣 Nói Pre-A1', 'Đề có hợp trẻ / người mới (kiểu Starters) không; bài mẫu đúng và tự nhiên không.', [...NOI.items.map(x => row(`noipre:${x.id}`, `<b>${esc(x.en)}</b> · ${esc(x.vi)}<br>${esc(x.p)}<br><span class="mute">Ý: ${x.c.map(esc).join(' · ')}</span><br>Mẫu: ${esc(x.m)}`)),
  ...NOI.test.map((s, i) => row(`noipre:test:${i}`, `Câu đọc to (thi): ${esc(s)}`))]);
add('👄 Phát âm B1 → C2 · cặp âm', 'Phiên âm (kiểu Anh) đúng không; cặp có thật sự chỉ khác âm đang luyện; mẹo đặt miệng đúng không.', PB.sets.map(x => row(`pa:${x.id}`,
  `<b>${esc(x.title)}</b> <span class="mute">${x.lv.toUpperCase()} · ${esc(x.a)} – ${esc(x.b)}</span><br>${[...x.pairs, ...x.test].map(p => `${esc(p[0])} /${esc(p[1])}/ – ${esc(p[2])} /${esc(p[3])}/`).join(' · ')}<br><span class="mute">Mẹo: ${esc(x.tip)}</span>`)));
add('👄 Mẹo đặt miệng (âm người Việt hay sai)', 'Mô tả cách phát âm có đúng, dễ hiểu với người Việt không.', Object.entries(ctx.VN_TIP).map(([k, v]) => row(`tip:${k}`, `<b>/${esc(k)}/</b> ${esc(v)}`)));
add('🧠 Câu suy luận Đọc / Nghe B1, B2', 'Đáp án có suy ra được từ bài không; phương án nhiễu có sai rõ không. Bấm "Bài" để xem bài.', Object.entries(SL).filter(([k]) => k !== '_note').map(([id, s]) => { const x = DOC[id] || {};
  return row(`sl:${id}`, `<b>${esc(x.title || x.tvi || id)}</b> <span class="mute">${esc(id)}</span><details><summary>Bài</summary><p class="t">${esc(x.lines ? x.lines.map(l => l[0] + ': ' + l[1]).join('\n') : x.text)}</p></details>❓ ${esc(s.q)}<br>✔ ${esc(s.a)} · ✗ ${s.w.map(esc).join(' · ✗ ')}`); }));
// v123 (người sáng lập 3/11/2026 "bổ sung nội dung đủ theo mục tiêu"): 6 bài đọc IELTS mới (7 dạng câu còn thiếu) + bài Đọc Cambridge mới (A2 phần 2, B1 phần 2, C1 phần 6, bài dài / nối đoạn B2–C2)
{ const IEJ = J('ielts.json'), AB = 'ABCDEFGH', li = (q, a, w) => `<br>• ${esc(q)} → <b>${esc(a)}</b>${w ? ` <span class="mute">(${esc(w)})</span>` : ''}`;
  const ieQ = x => [...(x.yn || []).map(q => li(q.s, q.a, q.why)), ...(x.mi || []).map(q => li(q.s, 'đoạn ' + AB[q.p], q.why)), ...(x.mf ? x.mf.qs.map(q => li(q.s, x.mf.f[q.a], q.why)) : []),
    ...(x.se ? x.se.qs.map(q => li(q.s + ' …', x.se.e[q.a], q.why)) : []), ...(x.sum ? x.sum.a.map((a, i) => li(`Tóm tắt (${i + 1})`, a.join(' / '), (x.sum.why || [])[i])) : []),
    ...(x.dia ? x.dia.n.filter(n => n.a).map(n => li(n.s, n.a.join(' / '), n.why)) : []), ...(x.sa || []).map(q => li(q.q, q.a.join(' / '), q.why))].join('');
  add('🌏 IELTS Đọc · 6 bài mới (v123)', 'Bài học thuật Claude soạn cho 7 dạng câu còn thiếu (Y/N/NG, tìm đoạn, nối đặc điểm, nối nửa câu, tóm tắt, sơ đồ, trả lời ngắn). Kiểm: đáp án đúng và duy nhất, YES / NO / NOT GIVEN đúng ý tác giả, người / số liệu trong bài là hư cấu nhưng hợp lý.',
    IEJ.doc.filter(x => !x.h).map(x => row(`ie:${x.id}`, `<b>${esc(x.title)}</b> <span class="mute">${x.lv.toUpperCase()}</span><details><summary>Bài</summary><p class="t">${x.paras.map((p, i) => AB[i] + '. ' + esc(p)).join('\n\n')}</p></details>${ieQ(x)}`)));
  const UO = J('uoe.json'), NEW = /^(pm-a2-|pm-b1-|lg-b1-3|lg-b2-[34]|pm-b2-[34]|lg-c1-[34]|pm-c1-[34]|xt-c1-|lg-c2-[34]|pm-c2-[34])/;
  add('🎓 Cambridge Đọc · bài mới (v123)', 'A2 Key phần 2, B1 Preliminary phần 2, C1 Advanced phần 6 (so ý 4 văn bản), bài dài và nối đoạn B2 → C2. Kiểm: mỗi câu chỉ một đáp án đúng, phương án nhiễu sai rõ, độ khó hợp cấp.',
    UO.long.filter(x => NEW.test(x.id)).map(x => row(`uoe:${x.id}`, `<b>${esc(x.title)}</b> <span class="mute">${x.lv.toUpperCase()} · ${x.qs ? 'bài dài' : x.xt ? 'so ý' : 'nối'}</span><details><summary>Bài</summary><p class="t">${esc(x.text)}</p></details>`
      + (x.qs ? x.qs.map(q => li(q.q, q.a, q.why)).join('') : (x.pm || x.xt).map(q => li(q.q, x.secs[q.p], q.why)).join('')))));
}
// v124 (đợt 2): 12 điểm ngữ pháp Nền mới (content/np-add.json) + TOEIC Part 3 / 4 có bảng, hội thoại 3 người, 180 từ công sở mới
{ const NA = J('content/np-add.json'), li = (q, a, w) => `<br>• ${esc(q)} → <b>${esc(a)}</b>${w ? ` <span class="mute">(${esc(w)})</span>` : ''}`;
  add('🧱 Ngữ pháp Nền · 12 điểm mới (v124)', 'Điểm còn thiếu so với khung A1 → B2 (gợi ý, đại từ phản thân, -ed / -ing, tính từ + giới từ, for / since, câu hỏi chủ ngữ, can / could / be able to, mệnh đề thời gian tương lai, make / let / allow, both / either / neither, may / might / could, quá khứ hoàn thành tiếp diễn). Kiểm: công thức, cách dùng đúng; mỗi câu chỉ một đáp án; câu "sai" thật sự sai.',
    (NA.items || NA).map(x => row(`npx:${x.id}`, `<b>${esc(x.title)}</b> <span class="mute">${x.lv.toUpperCase()}</span><br>${x.form.map(esc).join('<br>')}<br><span class="mute">${x.use.map(esc).join(' · ')}${x.note ? ' · ' + esc(x.note) : ''}</span>`
      + [...x.mc.learn, ...x.mc.test].map(m => li(m.s, m.a, '✗ ' + m.w.join(' · ✗ '))).join('') + [...x.ty.learn, ...x.ty.test].map(m => li(m.s, m.a.join(' / '))).join('')
      + [...x.fx.learn, ...x.fx.test].map(m => li('❌ ' + m.bad, m.good, m.why)).join('') + (x.hieu || []).map(h => li(h.s + ' ❓ ' + h.q, h.a, '✗ ' + h.w.join(' · ✗ '))).join(''))));
  const TN = J('content/toeic/nghe.json'), TV = J('content/toeic/vocab.json'), tg = g => `<br><span class="mute">Bảng: ${esc(g.t)} · ${esc(g.h.join(' | '))} · ${g.r.map(r => esc(r.join(' | '))).join(' · ')}</span>`;
  add('💼 TOEIC Nghe · Part 3 / 4 có bảng và hội thoại 3 người (v124)', 'Câu "Look at the graphic" (đề thật từ 2016) và hội thoại 3 người. Kiểm: đáp án câu bảng phải cần CẢ bảng và lời nghe; tên người / giới tính khớp câu hỏi (A nữ, B nam, C nữ thứ hai); lời tự nhiên.',
    [...TN.p3, ...TN.p4].filter(x => x.g || (x.lines && new Set(x.lines.map(l => l[0])).size > 2)).map(x => row(`to:${x.id}`, `<b>${esc(x.id)}</b> <span class="mute">${x.lines ? 'Part 3' : 'Part 4'}</span>${x.g ? tg(x.g) : ''}<details><summary>Lời</summary><p class="t">${esc(x.lines ? x.lines.map(l => l[0] + ': ' + l[1]).join('\n') : x.text)}</p></details>`
      + x.qs.map(q => li(q.q, q.a, '✗ ' + q.w.join(' · ✗ '))).join(''))));
  add('💼 TOEIC · 180 từ công sở mới (v124)', '15 chủ đề mới (khách sạn, công nghệ, sản xuất, báo cáo, giao tiếp, đào tạo, an toàn, ngân hàng, bất động sản, bán lẻ, mua hàng, quản lý, môi trường, phúc lợi, truyền thông). Kiểm: nghĩa Việt đúng trong ngữ cảnh công sở, câu ví dụ tự nhiên.',
    TV.topics.slice(10).map(t => row(`tov:${t.id}`, `<b>${esc(t.t)}</b>` + t.w.map(w => `<br>• <b>${esc(w[0])}</b>: ${esc(w[1])} <span class="mute">· ${esc(w[2])}</span>`).join(''))));
}
// v125 (đợt 3): Nền Đọc / Nghe B1 → C2, mỗi cấp +5 bài luyện (id …-16 → …-20)
{ const NEW = /^(doc|ng)-(b1|b2|c1|c2)-(1[6-9]|20)$/, li = (q, a, w) => `<br>• ${esc(q)} → <b>${esc(a)}</b> <span class="mute">(✗ ${w.map(esc).join(' · ✗ ')})</span>`;
  for (const [f, t] of [['doc.json', '📰 Đọc Nền B1 → C2 · 20 bài luyện mới (v125)'], ['nghe.json', '🎧 Nghe Nền B1 → C2 · 20 bài luyện mới (v125)']])
    add(t, 'Mỗi cấp 5 bài. Kiểm: độ khó hợp cấp, đáp án đúng và duy nhất, phương án nhiễu sai rõ, số liệu / sự kiện thật đúng (vd. Mercator, phán quyết 2014 của EU, nghiên cứu ví tiền thất lạc), câu suy luận (🧠) suy ra được từ bài.',
      J(f).items.filter(x => NEW.test(x.id)).map(x => row(`v125:${x.id}`, `<b>${esc(x.title)}</b> <span class="mute">${x.lv.toUpperCase()} · ${esc(x.tvi)}</span><details><summary>Bài</summary><p class="t">${esc(x.lines ? x.lines.map(l => l[0] + ': ' + l[1]).join('\n') : x.text)}</p></details>`
        + x.qs.map(q => li((q.sl ? '🧠 ' : '') + q.q, q.a, q.w)).join(''))));
}
// v126 (đợt 4): Nghe IELTS +3 phần (Part 2, 3, 4) + Cambridge nghe nối người nói B2 → C2 (9 bộ)
{ const IL = J('ielts.json').ln.filter(x => ['il-p2-festival', 'il-p3-sleep', 'il-p4-kelp'].includes(x.id)), MM = J('nghe.json').mm || [], L8 = 'ABCDEFGH';
  const qa = (x, q) => q.k === 'form' ? `${esc(q.s)} → <b>${esc(q.a.join(' / '))}</b>` : `${esc(q.q)} → <b>${esc(q.a)}</b>${q.w ? ` <span class="mute">(✗ ${q.w.map(esc).join(' · ✗ ')})</span>` : ''}`;
  add('🌏 IELTS Nghe · 3 phần mới (v126)', 'Part 2 lễ hội âm nhạc (trắc nghiệm + ghép), Part 3 khảo sát giấc ngủ (3 người: A gia sư nữ, B Tom, C Hana), Part 4 bài giảng rừng tảo bẹ (điền ghi chú, ONE WORD ONLY). Kiểm: đáp án đúng và duy nhất, đáp án điền có nguyên văn trong lời nghe, số liệu thật đúng (rái cá ăn ~1/4 cân nặng mỗi ngày, sóng nhiệt biển Bắc California).',
    IL.map(x => row(`v126:${x.id}`, `<b>Part ${x.part}: ${esc(x.title)}</b><details><summary>Lời</summary><p class="t">${esc(x.lines ? x.lines.map(l => l[0] + ': ' + l[1]).join('\n') : x.text)}</p></details>${x.opts ? `<span class="mute">Lựa chọn ghép: ${x.opts.map(esc).join(' · ')}</span>` : ''}` + x.qs.map(q => '<br>• ' + qa(x, q)).join(''))));
  add('🎓 Cambridge Nghe · nối người nói (v126)', 'Kiểu B2 First Part 3 (1 nhiệm vụ) và C1 Advanced / C2 Proficiency Part 4 (2 nhiệm vụ). Mỗi bộ 5 người nói, 8 ý, 3 ý thừa. Kiểm: mỗi người khớp đúng một ý, ý thừa không khớp ai, bẫy từ ngữ hợp lý, độ khó hợp cấp.',
    MM.map(x => row(`v126:${x.id}`, `<b>${esc(x.t)}</b> <span class="mute">${x.lv.toUpperCase()} · ${esc(x.tvi)}</span>${x.sp.map((t, i) => `<br>🗣 ${i + 1}. ${esc(t)}<br>&nbsp;&nbsp;→ ${x.tasks.map((k, j) => `<b>${x.tasks.length > 1 ? 'NV' + (j + 1) + ': ' : ''}${L8[k.a[i]]}. ${esc(k.o[k.a[i]])}</b>`).join(' · ')}`).join('')}`
      + x.tasks.map((k, j) => `<br><span class="mute">${x.tasks.length > 1 ? 'Nhiệm vụ ' + (j + 1) + ' · ' : ''}${esc(k.q)}: ${k.o.map((o, m) => L8[m] + '. ' + esc(o)).join(' · ')}</span>`).join(''))));
}
// v127 💼 TOEIC Part 1 tả tranh: tranh vẽ (toPic của toeic.js) + 4 câu tả + giải thích
{ const src = fs.readFileSync(root + 'toeic.js', 'utf8'), cx = {}; vm.runInNewContext(src.match(/const TO_BG = [^\n]*/)[0].replace('const TO_BG', 'this.TO_BG') + '\n' + src.match(/const toPic = p => \{[\s\S]*?<\/svg>`; \};/)[0].replace('const toPic', 'this.toPic'), cx);
  add('💼 TOEIC Part 1 · tả tranh (v127)', 'Đề thật dùng ảnh chụp; app dùng tranh vẽ đơn giản (emoji trên iPhone trông khác một chút). Kiểm: tranh có cho thấy rõ câu đúng không, 3 câu sai có sai rõ với tranh không (nhất là bẫy is being / has been), tiếng Anh tự nhiên.',
    J('toeic.json').p1.map(x => row(`v127:${x.id}`, `<b>${esc(x.id)}</b><div style="max-width:320px">${cx.toPic(x.pic)}</div>` + x.o.map((t, i) => `<br>${'ABCD'[i]}. ${esc(t)} ${i === x.a ? '✅' : ''}`).join('') + `<br><span class="mute">${esc(x.why)}</span>`))); }
// v128 🖼 từ có tranh Starters / Movers: emoji có đúng là vật đó không, câu nghe tự nhiên không, cụm a / an đúng không
{ const PIC = J('nghe.json').pic || [];
  for (const lv of ['pre', 'a1']) add(`🖼 ${lv === 'pre' ? 'Starters (Pre-A1)' : 'Movers (A1)'} · từ có tranh (v128)`, 'Mỗi dòng: tranh (emoji, trên iPhone là emoji Apple), từ, cụm dùng trong câu "This is …" (trống = không đếm được), câu nghe. Kiểm: tranh đúng là vật đó, không lẫn với từ khác trong nhóm, câu nghe tự nhiên với trẻ.',
    PIC.filter(x => x.lv === lv).map(x => row(`v128:${x.w}`, `<span style="font-size:32px">${x.e}</span> <b>${esc(x.w)}</b> <span class="mute">· ${esc(x.c)} · ${esc(x.a || '(không đếm được)')}</span><br>🎧 ${esc(x.s)}`))); }
const n = sec.reduce((a, s) => a + (s.match(/class="r"/g) || []).length, 0);
const html = `<!doctype html><html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Bảng kiểm nội dung</title>
<style>:root{--bg:#fff;--fg:#1d1d1f;--mute:#6e6e73;--line:#e5e5ea;--card:#f7f7f9;--ok:#1f8a3b;--bad:#c62828}
@media (prefers-color-scheme:dark){:root{--bg:#111;--fg:#f2f2f2;--mute:#a0a0a5;--line:#2c2c2e;--card:#1c1c1e;--ok:#4cc36b;--bad:#ff6b6b}}
body{margin:0;background:var(--bg);color:var(--fg);font:16px/1.5 -apple-system,system-ui,sans-serif}main{max-width:820px;margin:0 auto;padding:16px}
h1{font-size:22px;margin:8px 0}h2{font-size:18px;margin:24px 0 4px}.mute{color:var(--mute);font-size:14px}.r{border:1px solid var(--line);background:var(--card);border-radius:12px;padding:10px 12px;margin:8px 0}
.k{display:flex;flex-wrap:wrap;gap:8px 14px;align-items:center;margin-top:8px}.k label{white-space:nowrap}.n{flex:1;min-width:180px;padding:8px;border:1px solid var(--line);border-radius:8px;background:var(--bg);color:var(--fg);font:inherit}
.t{white-space:pre-line;font-size:15px}.r.ok{border-color:var(--ok)}.r.no{border-color:var(--bad)}#bar{position:sticky;bottom:0;background:var(--bg);border-top:1px solid var(--line);padding:10px 0;display:flex;gap:10px;align-items:center;flex-wrap:wrap}
button{font:inherit;padding:10px 14px;border-radius:10px;border:1px solid var(--line);background:var(--card);color:var(--fg)}textarea{width:100%;min-height:120px;font:14px monospace;background:var(--card);color:var(--fg);border:1px solid var(--line);border-radius:8px}</style></head>
<body><main><h1>📋 Bảng kiểm nội dung cho giáo viên</h1>
<p>Đây là nội dung Claude (AI) soạn cho app học tiếng Anh, <b>chưa người thật kiểm</b> (${n} mục). Mỗi mục chọn ✅ Đúng hoặc ❌ Sai, ghi chú cách sửa nếu cần. Lựa chọn lưu trên máy của bạn. Xong bấm <b>📋 Chép kết quả</b> rồi gửi lại cho người làm app.</p>
${sec.join('\n')}
<div id="bar"><button id="cp">📋 Chép kết quả</button><span class="mute" id="st"></span></div><textarea id="out" hidden></textarea></main>
<script>
const K='kiem-noi-dung',load=()=>{try{return JSON.parse(localStorage.getItem(K)||'{}')}catch(e){return {}}},S=load(),save=()=>{try{localStorage.setItem(K,JSON.stringify(S))}catch(e){}};
const paint=()=>{let d=0;document.querySelectorAll('.r').forEach(r=>{const v=S[r.dataset.id]||{};r.classList.toggle('ok',v.v==='1');r.classList.toggle('no',v.v==='0');if(v.v)d++;});document.getElementById('st').textContent='Đã kiểm '+d+' / ${n}';};
document.querySelectorAll('.r').forEach(r=>{const id=r.dataset.id,v=S[id]||{};r.querySelectorAll('input[type=radio]').forEach(x=>{x.checked=x.value===v.v;x.onchange=()=>{S[id]={...S[id],v:x.value};save();paint();};});const n=r.querySelector('.n');n.value=v.n||'';n.oninput=()=>{S[id]={...S[id],n:n.value};save();};});
document.getElementById('cp').onclick=async()=>{const L=[];document.querySelectorAll('.r').forEach(r=>{const v=S[r.dataset.id]||{};if(v.v==='0'||v.n)L.push((v.v==='0'?'❌ ':v.v==='1'?'✅ ':'· ')+r.dataset.id+(v.n?' — '+v.n:''));});
const ok=Object.values(S).filter(v=>v.v==='1').length,t='Bảng kiểm nội dung: '+ok+' đúng, '+L.filter(x=>x.startsWith('❌')).length+' sai / ${n} mục\\n'+L.join('\\n');const o=document.getElementById('out');o.value=t;o.hidden=false;
try{await navigator.clipboard.writeText(t);document.getElementById('st').textContent='Đã chép. Dán vào tin nhắn / email gửi lại.';}catch(e){o.select();document.getElementById('st').textContent='Chọn hết ô dưới rồi chép.';}};
paint();
</script></body></html>`;
fs.writeFileSync(root + 'docs/kiem-noi-dung.html', html); console.log('docs/kiem-noi-dung.html:', n, 'mục');
