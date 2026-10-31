// 📒 Sổ lỗi của tôi (v69, 28/10/2026, người sáng lập: "sáng tạo tìm cách làm cho nó có giá trị").
// Lỗi AI chỉ ra khi chấm Viết / Nói (thi.js, nút 🧑‍🏫, cả CEFR lẫn IELTS) tự vào sổ. Ôn bằng cách tự sửa lại câu sai, cách quãng theo hộp Leitner 1 → 3 → 7 → 16 → 35 ngày;
// sửa đúng ở hộp cuối = đã bỏ được lỗi. Bài sau AI lại bắt đúng câu sai cũ → đếm "lặp lại" và đưa lỗi về hộp đầu: số đo xem người học có thật sự bỏ được lỗi không.
// AI có thể sửa sai: người học bỏ được lỗi khỏi sổ. Không tính vào luật đo CEFR.
const ERR_DAYS = [1, 3, 7, 16, 35];
const errSt = () => (S.err = S.err || []);
function errAdd(es, src) { const L = errSt(), now = Date.now(); let n = 0, rep = 0;
  for (const e of es || []) { if (!e || !e.wrong || !e.correct || kNorm(e.wrong) === kNorm(e.correct)) continue; const k = kNorm(e.wrong), old = L.find(x => x.k === k);
    if (old) { old.rep = (old.rep || 0) + 1; old.box = 0; old.due = now; rep++; continue; }
    L.push({ id: 'e' + now.toString(36) + L.length, k, wrong: String(e.wrong).slice(0, 300), correct: String(e.correct).slice(0, 300), why: String(e.why_vi || '').slice(0, 300), src, at: now, box: 0, due: now, rep: 0 }); n++; }
  if (n || rep) { S.t = Date.now(); save(); } return { n, rep }; }
const errDue = (now = Date.now()) => errSt().filter(x => x.box < ERR_DAYS.length && x.due <= now);
const errDone = () => errSt().filter(x => x.box >= ERR_DAYS.length).length;
// sửa đúng: khớp nguyên câu, hoặc ≥ 90% từ hai chiều (cho phép khác dấu câu, viết hoa)
const errOk = (x, v) => kNorm(v) === kNorm(x.correct) || (kMatch(x.correct, v) >= 0.9 && kMatch(v, x.correct) >= 0.9);
function errBox(back) { const L = errSt();
  if (!L.length) return `<div class="box"><b>📒 Sổ lỗi của tôi</b><p class="mute" style="margin:6px 0 0">Còn trống. Bấm 🧑‍🏫 Nhờ AI chấm ở bài Viết / Nói: lỗi AI chỉ ra tự vào sổ, rồi ôn tới khi hết sai.</p>${errPasteBtn(back)}</div>`;
  const d = errDue().length, rep = L.reduce((s, x) => s + (x.rep || 0), 0);
  return `<div class="box"><div class="row"><b>📒 Sổ lỗi của tôi</b><span class="mute">${L.length} lỗi · ${errDone()} đã bỏ được</span></div>
    <p class="mute" style="margin:6px 0">Lỗi AI chỉ ra trong bài của bạn. Ôn bằng cách tự sửa câu sai, cách quãng 1 → 35 ngày. Lỗi cũ mắc lại trong bài sau: <b>${rep}</b> lần (số này giảm dần là học có hiệu quả).</p>
    <button class="${d ? 'pri' : ''}" data-err="${back}" ${d ? '' : 'disabled'}>${d ? `✏️ Sửa ${Math.min(d, 10)} lỗi đến hạn` : '✅ Chưa có lỗi đến hạn ôn'}</button>${errPasteBtn(back)}</div>`; }
// 📥 dán lỗi giáo viên sửa (ieplus.js errPaste)
const errPasteBtn = back => typeof errPaste === 'function' ? `<button class="chip" data-errp="${back}">📥 Dán lỗi giáo viên sửa</button>` : '';
// back: 'ct' (👤 Của tôi) · 'ie' (IELTS) · hàm (hàng ôn chung của Hôm nay: sang loại tiếp theo); quit: khi bấm "← Thôi" (mặc định = back)
const errHome = back => typeof back === 'function' ? back() : back === 'ie' ? ieltsView() : back === 'ct' && typeof minhView === 'function' ? minhView() : overview();
function errRun(back, quit) { const qs = shuf(errDue()).slice(0, 10); let i = 0, ok = 0; const home = () => errHome(back), stop = () => errHome(quit || back);
  if (!qs.length) return home();
  const show = () => { if (i >= qs.length) return end(); const x = qs[i]; window.CUR = { view: 'so-loi', item: x.id, prompt: x.wrong };
    $app.innerHTML = `<div class="row top"><button class="link" data-a="back">← Thôi</button><span class="uname">📒 ${i + 1}/${qs.length}</span></div>
      <p class="mute">Bạn từng viết / nói sai chỗ này. Sửa lại cho đúng (ô dưới đã chép sẵn câu sai).</p><div class="box"><p style="margin:0;font-size:18px">❌ ${esc(x.wrong)}</p></div>
      <form id="ef" autocomplete="off"><textarea id="et" rows="3" autocapitalize="sentences" spellcheck="false" aria-label="Câu đã sửa">${esc(x.wrong)}</textarea><button class="pri" type="submit">Kiểm</button></form>
      ${x.why ? `<details><summary>Gợi ý</summary><p class="mute">${esc(x.why)}</p></details>` : ''}<div id="efb"></div>`;
    document.getElementById('ef').onsubmit = e => { e.preventDefault(); const t = document.getElementById('et'), good = errOk(x, t.value);
      if (good) { ok++; x.box++; x.due = Date.now() + (ERR_DAYS[x.box - 1] || 0) * 864e5; } else { x.box = 0; x.due = Date.now() + 864e5; }
      S.t = Date.now(); save(); t.disabled = true; e.target.querySelector('button').remove();
      document.getElementById('efb').innerHTML = `<div class="box"><b>${good ? '✅ Đúng' : '❌ Chưa đúng'}</b><p style="margin:4px 0">Câu đúng: <b>${esc(x.correct)}</b></p>${x.why ? `<p class="mute" style="margin:0">${esc(x.why)}</p>` : ''}
        <p class="mute" style="margin:6px 0 0">${good ? (x.box >= ERR_DAYS.length ? 'Đã bỏ được lỗi này 🎉' : `Ôn lại sau ${ERR_DAYS[x.box - 1]} ngày.`) : 'Ôn lại ngày mai.'}</p></div>
        <button class="pri" data-a="next">Tiếp ›</button><button class="link" data-a="del">🗑 Bỏ lỗi này khỏi sổ (AI sửa sai)</button>`; };
    $app.onclick = e => { if (e.target.closest('[data-a="back"]')) return stop(); if (e.target.closest('[data-a="next"]')) { i++; scrollTo(0, 0); return show(); }
      if (e.target.closest('[data-a="del"]')) { S.err = errSt().filter(y => y !== x); S.t = Date.now(); save(); toast('Đã bỏ khỏi sổ.'); i++; return show(); } }; };
  const end = () => { $app.innerHTML = `<h1>📒 Sửa đúng ${ok}/${qs.length}</h1><p class="mute">Lỗi sai sẽ quay lại ngày mai. Lỗi đúng giãn dần 1 → 3 → 7 → 16 → 35 ngày.</p>${typeof back === 'function' ? '' : errBox(back)}<button class="pri" data-a="back">${typeof back === 'function' ? 'Tiếp ›' : '← Về'}</button>`;
    $app.onclick = e => { if (e.target.closest('[data-a="back"]')) home(); }; scrollTo(0, 0); };
  show(); }
document.addEventListener('click', e => { const b = e.target.closest('[data-err]'); if (b && !b.disabled && S) { scrollTo(0, 0); errRun(b.dataset.err); } });
