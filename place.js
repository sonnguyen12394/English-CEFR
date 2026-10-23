// 🧭 Xác định cấp độ từ vựng (người sáng lập 23/10/2026: "làm đến C2 … để xác định cấp độ từ vựng").
// Kiểu bài đo cấp từ vựng (vocabulary levels test): mỗi cấp Pre-A1 → C2 lấy ngẫu nhiên PL.N từ, thấy từ tiếng Anh → chọn nghĩa (4 lựa chọn) hoặc "Không biết".
// Trừ đoán: biết = (đúng − sai / 3) / số câu (4 lựa chọn, đoán bừa trúng 1/4). Cấp nào biết < PL.STOP thì dừng, các cấp trên tính 0.
// Cấp đạt = cấp cao nhất mà nó và mọi cấp dưới đều biết ≥ PL.PASS. Chỉ đo NHẬN RA nghĩa (không đo nghe, viết, dùng); 15 từ / cấp nên sai số khoảng ±15%.
// Không chấm vào lịch ôn, không tính 📘 Học / 🔁 Nhớ / Thi chuyển cấp. Lưu kết quả ở S.place.
const PL = { N: 15, STOP: 0.35, PASS: 0.8, LV: ['pre', 'a1', 'a2', 'b1', 'b2', 'c1', 'c2'] };
let REF = null;   // từ B1–C2 (ref.json), tải khi cần
async function loadRef() { if (REF) return REF;
  REF = (await (await fetch('ref.json?v=1')).json()).words; for (const w of REF) WBY[w.id] = w; return REF; }
const wordsOfLv = l => ['pre', 'a1', 'a2'].includes(l) ? WORDS.filter(w => UBY[w.u].lv === l) : (REF || []).filter(w => w.lv === l);
const fmtPct = x => Math.round(x * 100) + '%';
function placeLevel(res) { let best = null; for (const l of PL.LV) { if ((res[l] ?? 0) >= PL.PASS) best = l; else break; } return best; }
function placeBox() { const last = (S.place || []).slice(-1)[0];
  return `<div class="box"><b>🧭 Xác định cấp độ từ vựng</b><p class="mute">Pre-A1 → C2, mỗi cấp ${PL.N} từ, khoảng 10 phút. Không tính vào học và thi.</p>
    ${last ? `<p>Lần gần nhất (${new Date(last.at).toLocaleDateString('vi-VN')}): <b>${last.lv ? LVN[last.lv] : 'chưa tới Pre-A1'}</b> · khoảng ${last.est.toLocaleString('vi-VN')} từ</p>` : ''}
    <button data-a="place">${last ? 'Đo lại' : 'Bắt đầu đo'}</button></div>`; }

async function placeTest() {
  try { await loadRef(); } catch (e) { return alert('Chưa tải được dữ liệu B1–C2. Thử lại khi có mạng.'); }
  window.CUR = { view: 'do-cap' };
  const res = {}, tal = {}; let li = 0;
  const startLevel = () => {
    const l = PL.LV[li], pool = wordsOfLv(l).filter(w => !/\s/.test(w.w) || w.w.length < 16), items = shuf(pool).slice(0, PL.N);
    tal[l] = { ok: 0, bad: 0, idk: 0, n: items.length }; let i = 0;
    const show = () => {
      if (i >= items.length) { const t = tal[l]; res[l] = Math.max(0, (t.ok - t.bad / 3) / t.n);
        if (res[l] < PL.STOP || li === PL.LV.length - 1) return finish(); li++; return startLevel(); }
      const w = items[i], ds = shuf(pool.filter(x => x.id !== w.id && x.vi !== w.vi && x.pos === w.pos)).concat(shuf(pool.filter(x => x.id !== w.id && x.vi !== w.vi))), opts = [w.vi];
      for (const x of ds) { if (opts.length >= 4) break; if (!opts.includes(x.vi)) opts.push(x.vi); }
      const o = shuf(opts), done = PL.LV.indexOf(l) * PL.N + i;
      window.CUR = { view: 'do-cap', item: 'pl:' + l + ':' + w.id, prompt: w.w };
      $app.innerHTML = `<div class="row top"><button class="link" data-a="home">← Về</button><span class="uname">🧭 Đo cấp · ${LVN[l]} · ${i + 1}/${items.length}</span></div>
        ${bar(done / (PL.LV.length * PL.N) * 100, 0, 'var(--accent)')}
        <p class="q" style="text-align:center;font-size:32px">${esc(w.w)}</p><p class="mute" style="text-align:center">${esc(w.pos || '')} · nghĩa là gì?</p>
        ${o.map((x, k) => `<button class="opt" data-k="${k}">${esc(x)}</button>`).join('')}
        <button data-k="-1" style="text-align:center">❓ Không biết</button>
        <p class="mute">Không chắc thì bấm "Không biết": đoán bừa bị trừ điểm.</p>`;
      $app.onclick = e => {
        if (e.target.closest('[data-a="home"]')) { if (confirm('Dừng đo? Kết quả lần này không lưu.')) home(); return; }
        const b = e.target.closest('[data-k]'); if (!b) return;
        const k = +b.dataset.k, t = tal[l];
        if (k < 0) t.idk++; else if (o[k] === w.vi) t.ok++; else t.bad++;
        i++; show();
      };
    };
    show();
  };
  const finish = () => {
    for (const l of PL.LV) if (res[l] === undefined) res[l] = 0;
    const lv = placeLevel(res), est = Math.round(PL.LV.reduce((s, l) => s + res[l] * wordsOfLv(l).length, 0)), total = PL.LV.reduce((s, l) => s + wordsOfLv(l).length, 0);
    (S.place = S.place || []).push({ at: Date.now(), res, lv, est, tal }); save();
    const next = PL.LV.find(l => res[l] < PL.PASS);
    $app.innerHTML = `<div class="box"><b>🧭 Cấp từ vựng (nhận ra nghĩa): ${lv ? LVN[lv] : 'chưa tới Pre-A1'}</b>
      <p>Ước tính bạn nhận ra khoảng <b>${est.toLocaleString('vi-VN')}</b> / ${total.toLocaleString('vi-VN')} từ trong kho.</p>
      ${PL.LV.map(l => `<div class="row"><span>${LVN[l]}</span><span class="${res[l] >= PL.PASS ? 'okc' : 'mute'}">${tal[l] ? fmtPct(res[l]) : 'không đo (đã dừng)'}</span></div>${bar(res[l] * 100, PL.PASS * 100, res[l] >= PL.PASS ? 'var(--good)' : 'var(--accent)')}`).join('')}
      <p class="mute">Cấp đạt = cấp cao nhất mà nó và mọi cấp dưới đều biết ≥ ${fmtPct(PL.PASS)}.${next ? ` Nên học tiếp từ cấp <b>${LVN[next]}</b>.` : ''}</p>
      <p class="mute">Giới hạn: chỉ đo nhận ra nghĩa khi đọc (chưa đo nghe, viết, dùng); ${PL.N} từ mỗi cấp nên sai số khoảng ±15%. Làm 2–3 lần vào các ngày khác nhau rồi lấy trung bình sẽ chắc hơn.</p></div>
      <button class="pri" data-a="home">Về trang chính</button>`;
    $app.onclick = e => { if (e.target.closest('[data-a="home"]')) home(); };
  };
  startLevel();
}
