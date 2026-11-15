// 🏘 Phố Loại Từ (specs/019-pho-loai-tu, v178). Người sáng lập 14–15/11/2026: lý thuyết khô, khó nhớ; muốn điều khiển nhân vật dễ thương; chơi bản mẫu thấy "hấp dẫn hơn".
// Mỗi loại từ là một cư dân có "ghế" trong câu và "đồng phục" là đuôi từ. Người học tự đoán luật (thám tử) rồi điều khiển bé Mầm bắt từ rơi đúng ghế trống.
// Nguồn câu (Q2 = C): kho riêng pho.json (Claude soạn, tools/build-pho.mjs) + câu thật Part 5 dạng từ người học từng sai trong đề (bài làm 📋 / Chinh phục đề).
// Dữ liệu: S.to.pho = { in, cd: { khoá: { at, n } }, it: { id: { at, lv, d, s } }, st }. KHÔNG đổi luật đo, thẻ học, điểm đề thử, bản đồ.
// Câu thật bắt đúng / sai ghi vào hành trình Chinh phục đề S.to.tc.j[de].c[n] như hạ quái (phương án ở làn xáo thứ tự).
const PH_VIEW = 'toeic-pho-loai-tu', PH_N = 10, PH_REAL = 3, PH_HEN = [1, 3, 7, 21];
// v179 → v180 (người sáng lập 15/11/2026: "chưa phân biệt được rõ 4 dạng ở các từ và chưa rõ ô trống đó nên chọn dạng gì nên từ dễ tới khó phân ra từ từ
//   chứ không nên vừa bắt phân biệt dạng từ vừa biết cấu trúc đó thuộc dạng nào"): 4 bậc, mỗi bậc học riêng một việc rồi mới ghép.
//   md = kiểu ván: 'dp' nhận đồng phục (chỉ nhìn đuôi từ, không có câu) · 'gh' đoán ghế (chỉ nhìn câu, 4 cư dân rơi) · 'tu' bắt từ (cả hai).
//   k = số làn, dur = giây rơi (nửa đầu, nửa sau ván), tim, goi = số lần 💡 gợi ý mỗi ván (≥ 50 = không giới hạn), moc = tô sẵn chữ mốc, mau = từ mang màu cư dân.
//   Mở dần: thắng bậc trước (còn tim, đúng ≥ PH_WIN / PH_N) thì mở bậc sau. Đúng 3 câu liền hồi 1 tim. Câu dùng gợi ý hẹn ôn ngày mai.
//   Chỉ bậc bắt từ ('tu') ghi lịch ôn câu và hành trình Chinh phục đề; bậc 1–2 là luyện từng kỹ năng, chỉ đếm.
const PH_MUC = { b1: { ten: '🎽 Bậc 1 · Nhận đồng phục', sub: 'Chỉ nhìn đuôi từ: bắt đúng loại từ được gọi · 3 từ, rơi chậm, 5 tim', md: 'dp', k: 3, dur: [8.5, 8.5], tim: 5, goi: 99 },
  b2: { ten: '💺 Bậc 2 · Đoán ghế', sub: 'Chỉ nhìn câu: ghế trống cần cư dân nào · chữ mốc tô sẵn, 5 tim', md: 'gh', k: 4, dur: [8.5, 8.5], tim: 5, goi: 99, moc: 1 },
  b3: { ten: '🌿 Bậc 3 · Ghép cả hai', sub: 'Đoán ghế rồi nhìn đuôi từ · 3 từ, 4 tim, 3 gợi ý', md: 'tu', k: 3, dur: [8, 8], tim: 4, goi: 3 },
  b4: { ten: '🔥 Bậc 4 · Đủ 4 từ', sub: '4 từ, có cặp cùng loại, nhanh dần · 3 tim, 1 gợi ý', md: 'tu', k: 4, dur: [7, 6], tim: 3, goi: 1 } }, PH_MO = ['b1', 'b2', 'b3', 'b4'], PH_WIN = 7;
// ván chữa câu sai từ Chinh phục đề: đủ 4 phương án của đề, từ mang màu cư dân (tập trung chọn đúng từ trong nhà), dễ thắng
const PH_FIX = { ten: '🛠 Chữa câu', sub: '', md: 'tu', k: 4, dur: [8.5, 8.5], tim: 5, goi: 99, moc: 1, mau: 1 };
const PH_SHORT = { N: 'Ông Chủ', V: 'Anh Động', A: 'Cô Thợ May', R: 'Bé Chạy Việc' };
const phOpen = m => { const u = phSt().mu || {}, i = PH_MO.indexOf(m); return i <= 0 || (u[PH_MO[i - 1]] || 0) >= PH_WIN; };
const phMuc = () => { const c = phSt().mc; return c && PH_MUC[c] && phOpen(c) ? c : [...PH_MO].reverse().find(phOpen); };
// chữ mốc của ghế: chữ đầu tiên trong ngoặc kép của câu "vì sao" có mặt trong câu (vd. "the", "will", "her")
function phMoc(it) { const ws = [...String(it.why || '').matchAll(/["“]([^"”]{1,30})["”]/g)].map(m => m[1].trim()).filter(Boolean);
  for (const w of ws) { const re = new RegExp('(^|[^A-Za-z])(' + w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')(?=$|[^A-Za-z])', 'i'); if (re.test(it.s.replace('___', ' '))) return w; } return null; }
const PH_CH = {
  N: { name: 'Ông Chủ Danh', pos: 'Danh từ', suf: '-tion · -ment · -ness · -al', line: 'Tôi là người, vật, việc được nói tới. Ghế của tôi: sau a / the / your và sau Cô Thợ May.' },
  V: { name: 'Anh Động', pos: 'Động từ', suf: 'dạng gốc · -ize · -ate · -fy', line: 'Tôi là hành động. Sau will / can / to tôi luôn ở dạng gốc.' },
  A: { name: 'Cô Thợ May Tính', pos: 'Tính từ', suf: '-ive · -ful · -ous · -able', line: 'Tôi may áo cho Ông Chủ: đứng ngay trước Ông Chủ, hoặc sau is / are.' },
  R: { name: 'Bé Chạy Việc Trạng', pos: 'Trạng từ', suf: '-ly', line: 'Tôi chạy theo phục vụ Anh Động và Cô Thợ May, không bao giờ phục vụ Ông Chủ.' } };
// vụ thám tử: 4 cư dân + 4 nhóm "hai người cùng nhà" (mở khi lần đầu gặp câu có nhóm đó). Câu ví dụ Claude soạn, chưa giáo viên kiểm.
const PH_G = {
  N: { q: 'Ai hay ngồi giữa "the … of"?', ex: [['The', 'approval', 'of the plan was quick.'], ['We waited for the', 'delivery', 'of the boxes.'], ['They planned the', 'expansion', 'of the store.']], hint: 'Nhìn đuôi: -al, -ery, -sion là đồng phục của ai?', chant: 'Sau the, a, your… là ghế của tôi.' },
  V: { q: 'Ai đứng ngay sau "will / can / to"?', ex: [['The company will', 'expand', 'next year.'], ['Can you', 'inform', 'the team?'], ['We need to', 'create', 'a new plan.']], hint: 'Ba từ này đều là hành động, ở dạng gốc.', chant: 'Sau will, can, to là tôi, dạng gốc.' },
  A: { q: 'Ai đứng trước danh từ, hoặc sau "is / are"?', ex: [['It is a', 'reliable', 'car.'], ['The new plan is', 'successful', '.'], ['She has very', 'creative', 'ideas.']], hint: 'Họ mô tả Ông Chủ: đáng tin, thành công, sáng tạo…', chant: 'Tôi đứng trước Ông Chủ, hoặc sau is / are.' },
  R: { q: 'Ai bám theo động từ hoặc tính từ?', ex: [['The report was', 'carefully', 'written.'], ['The office is', 'extremely', 'busy.'], ['Prices rose', 'quickly', 'in May.']], hint: 'Cả ba đều mặc đồng phục -ly.', chant: 'Tôi phục vụ Anh Động và Cô Thợ May.' } };
const PH_NHA = {
  nguoi: { who: 'N', name: 'Hai Ông Chủ cùng nhà: người hay việc?', q: 'Từ được tô chỉ NGƯỜI hay VIỆC?', ex: [['The', 'applicants', 'will be interviewed on Friday.'], ['Our', 'supervisor', 'approved the request.'], ['Two new', 'employees', 'joined the team.']], ans: ['Người', 'Việc'], ok: 0, hint: 'Ai được phỏng vấn, ai duyệt yêu cầu? Đuôi -ant, -or, -ee.', chant: '-er, -or, -ant, -ee, -ist là NGƯỜI; -tion, -ment, -ance là VIỆC. Câu cần ai làm thì chọn người.' },
  vdang: { who: 'V', name: 'Ba anh em Động: gốc, V3, V-ing', q: 'Sau "has been" và "was", Anh Động mặc dạng nào?', ex: [['The order has been', 'shipped', 'today.'], ['The room was', 'cleaned', 'last night.'], ['All forms must be', 'signed', 'by Friday.']], ans: ['V3 (được / bị)', 'Dạng gốc'], ok: 0, hint: 'Đơn hàng không tự gửi: nó ĐƯỢC gửi.', chant: 'Sau will / can / to: gốc. Sau be / have (được, đã): V3. Sau giới từ hoặc be (đang): V-ing.' },
  edng: { who: 'A', name: 'Hai chị em Thợ May: -ed và -ing', q: 'Từ được tô nói người CẢM THẤY hay vật GÂY RA cảm giác?', ex: [['The staff were', 'excited', 'about the trip.'], ['I was', 'impressed', 'by her work.'], ['Visitors felt', 'satisfied', 'with the tour.']], ans: ['Người cảm thấy', 'Vật gây ra'], ok: 0, hint: 'Ai thấy hào hứng, ấn tượng, hài lòng? Đều là người.', chant: '-ed: người CẢM THẤY (I am bored). -ing: vật, việc GÂY RA cảm giác (the film is boring).' },
  so: { who: 'N', name: 'Ông Chủ một người hay nhiều người?', q: 'Sau "each / every / a", Ông Chủ đi một mình hay đi đông?', ex: [['Each', 'employee', 'has a locker.'], ['Every', 'guest', 'gets a map.'], ['A', 'customer', 'called this morning.']], ans: ['Một mình (số ít)', 'Đi đông (số nhiều)'], ok: 0, hint: 'Each, every, a đều đếm từng người một.', chant: 'Sau a, an, each, every: số ít. Sau many, several, these, all: số nhiều.' } };
const PH_ORD = ['N', 'V', 'A', 'R'];
const phSt = () => { const o = toSt(); const p = o.pho = o.pho || {}; p.cd = p.cd || {}; p.it = p.it || {}; p.st = p.st || {}; return p; };
const phStat = (k, n) => { const s = phSt().st; s[k] = (s[k] || 0) + (n || 1); };
const phDay = () => dayOf(Date.now());
// 🎵 tiếng riêng của phố (Web Audio tổng hợp, không tệp): tiếng đúng / sai to rõ + nhạc nền vui lặp lại (I–vi–IV–V). Bật / tắt riêng: S.to.pho.am, S.to.pho.nhac.
const phSnd = () => phSt().am !== 0;
const phMusicOn = () => phSt().nhac !== 0;
let PH_AC = null, PH_BGM = null;
function phAc() { try { const C = window.AudioContext || window.webkitAudioContext; if (!C) return null; PH_AC = PH_AC || new C(); if (PH_AC.state === 'suspended') PH_AC.resume(); return PH_AC; } catch (e) { return null; } }
function phTone(f, t0, dur, type, vol, f2) { const ac = PH_AC; if (!ac) return; const o = ac.createOscillator(), g = ac.createGain(), t = ac.currentTime + t0;
  o.type = type || 'triangle'; o.frequency.setValueAtTime(f, t); if (f2) o.frequency.exponentialRampToValueAtTime(f2, t + dur);
  g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + 0.015); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g).connect(ac.destination); o.start(t); o.stop(t + dur + 0.05); }
const PH_SFX = {
  ok: () => [523, 659, 784, 1047].forEach((f, i) => phTone(f, i * 0.07, 0.22, 'triangle', 0.22)),
  hit: () => [659, 988].forEach((f, i) => phTone(f, i * 0.08, 0.2, 'triangle', 0.22)),
  combo: () => [784, 988, 1175, 1568].forEach((f, i) => phTone(f, i * 0.06, 0.2, 'square', 0.12)),
  no: () => { phTone(330, 0, 0.22, 'sawtooth', 0.14, 220); phTone(220, 0.22, 0.38, 'sawtooth', 0.14, 140); },
  grow: () => [523, 659, 784, 1047].forEach((f, i) => phTone(f, i * 0.07, 0.18, 'sine', 0.14)),
  heal: () => [880, 1175].forEach((f, i) => phTone(f, i * 0.1, 0.25, 'sine', 0.18)),
  win: () => [523, 659, 784, 1047, 784, 1047].forEach((f, i) => phTone(f, i * 0.12, 0.3, 'triangle', 0.2)),
  lose: () => [392, 330, 262, 196].forEach((f, i) => phTone(f, i * 0.2, 0.3, 'sawtooth', 0.08)) };
const phSfx = k => { if (!phSnd() || !PH_SFX[k] || !phAc()) return; try { PH_SFX[k](); } catch (e) {} };
// nhạc nền: 4 hợp âm × 8 nốt, ~104 nhịp / phút, nhẹ (âm lượng thấp hơn tiếng đúng / sai)
const PH_CHORD = [[262, 330, 392, 523], [220, 262, 330, 440], [175, 220, 262, 349], [196, 247, 294, 392]], PH_PAT = [0, 1, 2, 3, 2, 1, 2, 3];
function phMusic(on) { if (PH_BGM) { clearInterval(PH_BGM.iv); PH_BGM = null; } if (!on || !phMusicOn() || !phAc()) return;
  try { if (navigator.audioSession) navigator.audioSession.type = 'playback'; } catch (e) {}
  const ac = PH_AC, step = 60 / 104 / 2; let n = 0, next = ac.currentTime + 0.1;
  const tick = () => { while (next < ac.currentTime + 0.3) { const ch = PH_CHORD[Math.floor(n / 8) % 4], i = n % 8, t0 = next - ac.currentTime;
      phTone(ch[PH_PAT[i]] * 2, t0, step * 0.9, 'triangle', 0.035); if (i === 0 || i === 4) phTone(ch[0] / 2, t0, step * 3.5, 'sine', 0.06); n++; next += step; } };
  tick(); PH_BGM = { iv: setInterval(tick, 100) }; }
const phRM = () => { try { return matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { return false; } };
const phVib = n => { try { navigator.vibrate && navigator.vibrate(n); } catch (e) {} };

function phFace(t, s, mood) { s = s || 64; mood = mood || 'idle';
  const col = t === 'M' ? 'var(--phm)' : `var(--ph${t.toLowerCase()})`, ink = 'var(--phink)';
  const mouth = mood === 'happy' ? `<path d="M39 63 Q50 78 61 63 Z" style="fill:${ink}"/>` : mood === 'sad' ? `<path d="M40 71 Q50 63 60 71" style="fill:none;stroke:${ink};stroke-width:3;stroke-linecap:round"/>` : `<path d="M41 65 Q50 72 59 65" style="fill:none;stroke:${ink};stroke-width:3;stroke-linecap:round"/>`;
  const sk = `stroke:${ink};stroke-width:2.5;stroke-linejoin:round`;
  const acc = { N: `<polygon points="33,30 38,14 46,24 50,10 54,24 62,14 67,30" style="fill:#ffcf3d;${sk}"/><polygon points="50,79 45,86 50,95 55,86" style="fill:${ink}"/>`,
    V: `<polygon points="54,3 41,27 50,27 44,42 63,18 53,18 60,3" style="fill:#ffcf3d;${sk}"/>`,
    A: `<polygon points="50,28 34,19 35,37" style="fill:#ff6fa5;${sk}"/><polygon points="50,28 66,19 65,37" style="fill:#ff6fa5;${sk}"/><circle cx="50" cy="28" r="4" style="fill:#ff6fa5;${sk}"/>`,
    R: `<rect x="17" y="38" width="66" height="7" rx="3" style="fill:#ff6fa5;stroke:${ink};stroke-width:2"/><path d="M4 52h9M2 62h10M5 72h8" style="stroke:${ink};stroke-width:3;stroke-linecap:round"/>`,
    M: `<path d="M50 30 Q50 18 50 12" style="stroke:#2e9b5c;stroke-width:4;stroke-linecap:round;fill:none"/><ellipse cx="41" cy="13" rx="10" ry="5.5" transform="rotate(-25 41 13)" style="fill:#3fae6a;stroke:${ink};stroke-width:2"/><ellipse cx="59" cy="11" rx="10" ry="5.5" transform="rotate(25 59 11)" style="fill:#3fae6a;stroke:${ink};stroke-width:2"/>` }[t];
  const eyes = mood === 'sad' ? `<path d="M33 52 l8 4 M67 52 l-8 4" style="stroke:${ink};stroke-width:3;stroke-linecap:round"/>`
    : `<g class="pheye"><circle cx="40" cy="54" r="5" style="fill:${ink}"/><circle cx="41.6" cy="52.4" r="1.6" style="fill:#fff"/></g><g class="pheye"><circle cx="60" cy="54" r="5" style="fill:${ink}"/><circle cx="61.6" cy="52.4" r="1.6" style="fill:#fff"/></g>`;
  return `<svg width="${s}" height="${s}" viewBox="0 0 100 100" aria-hidden="true"><ellipse cx="50" cy="96" rx="26" ry="3.5" style="fill:rgba(0,0,0,.15)"/><ellipse cx="50" cy="61" rx="35" ry="32" style="fill:${col};stroke:${ink};stroke-width:3"/>${acc}${eyes}<ellipse cx="31" cy="66" rx="5" ry="3" style="fill:#ff7aa8;opacity:.45"/><ellipse cx="69" cy="66" rx="5" ry="3" style="fill:#ff7aa8;opacity:.45"/>${mouth}</svg>`; }

// ---------- kho câu ----------
let PH_K = null, PH_RL = null;   // PH_K: kho riêng · PH_RL: câu thật dạng từ { id 'de:<đề>:<n>' → câu }
const phPosOf = v => { const k = String(v || '').split(':')[0].toLowerCase(); if (/^danh từ/.test(k)) return 'N'; if (/^tính từ/.test(k)) return 'A'; if (/^trạng từ/.test(k)) return 'R'; if (/^(động từ|v3|v-ing|phân từ|quá khứ)/.test(k)) return 'V'; return null; };
function phNhaOf(it) { const A = it.o.find(o => o[0] === it.a), same = it.o.filter(o => o !== A && o[1] === A[1]); if (!same.length) return null;
  const ws = [A, ...same].map(o => o[0].toLowerCase());
  if (A[1] === 'A' && ws.some(w => /ed$/.test(w)) && ws.some(w => /ing$/.test(w))) return 'edng';
  if (A[1] === 'V') return 'vdang';
  if (A[1] === 'N' && ws.some(w => /(er|or|ant|ent|ee|ist|ian)s?$/.test(w))) return 'nguoi';
  if (A[1] === 'N' && ws.some((w, i) => ws.some((x, j) => i !== j && (x === w + 's' || x === w + 'es')))) return 'so';
  return 'khac'; }
async function phLoad() { if (!PH_K) { try { PH_K = (await (await fetch('pho.json?v=' + APP_V)).json()).items || []; } catch (e) { PH_K = []; } }
  if (!PH_RL) { PH_RL = {}; const D = (typeof TO !== 'undefined' && TO && TO.tron) || [];
    for (const d of D) { if (d.f && !TR.D[d.id]) { try { await trLoad(d.id); } catch (e) {} } const B = trB(d.id); if (!B) continue;
      for (const q of B.Q) { if (q.sec !== 'p5' || !q.x || q.x.t !== 'form') continue; const og = (q.lg || {}).og || {}; if (!q.opts.every(o => og[o])) continue;
        const o = q.opts.map(w => [w, phPosOf(og[w]), String(og[w]).split(':').slice(1).join(':').trim()]); if (o.some(x => !x[1])) continue;
        const s = String(q.q).replace(/<[^>]+>/g, '').replace(/-{5,}/, '___'); if (!/___/.test(s)) continue;
        const ly = String(q.lg.ly || q.why || ''), why = (ly.match(/^[^.!?]*[.!?]/) || [ly])[0].slice(0, 180);
        const it = { id: `de:${d.id}:${q.n}`, de: d.id, n: q.n, s, a: q.a, o, why, vi: q.lg.dich || '', real: 1 }; it.nha = phNhaOf(it); PH_RL[it.id] = it; } } }
  return PH_K; }
// câu thật người học từng SAI (bài làm 📋 hoặc hành trình), chưa bắt đúng lại ở Phố
function phWrong() { const out = []; if (typeof tgJState !== 'function') return out; const by = {};
  for (const it of Object.values(PH_RL || {})) (by[it.de] = by[it.de] || []).push(it);
  for (const [de, its] of Object.entries(by)) { const L = tgJState(de) || [], st = {}; for (const c of L) st[c.n] = c.st; for (const it of its) if (st[it.n] === 'sai') out.push(it); }
  return out; }
const phItem = id => (PH_RL && PH_RL[id]) || (PH_K || []).find(x => x.id === id);
const phDue = () => { const I = phSt().it, t = phDay(); return Object.keys(I).filter(id => I[id].d && I[id].d <= t && phItem(id)); };
function phPick(fix) { const I = phSt().it, t = phDay(), used = new Set(), L = [], add = it => { if (it && !used.has(it.id)) { used.add(it.id); L.push(it); } };
  if (fix) { add(fix); const same = shuf((PH_K || []).filter(x => x.o.find(o => o[0] === x.a)[1] === fix.o.find(o => o[0] === fix.a)[1])); same.slice(0, 3).forEach(add); return L; }
  shuf(phDue()).slice(0, 4).forEach(id => add(phItem(id)));
  shuf(phWrong()).filter(it => !(I[it.id] && I[it.id].s === 1)).slice(0, PH_REAL).forEach(add);
  const fresh = (PH_K || []).filter(x => !I[x.id]), cd = phSt().cd;
  const ok = shuf(fresh.filter(x => !x.nha || cd[x.nha])), nw = shuf(fresh.filter(x => x.nha && !cd[x.nha]));
  // mỗi ván mở tối đa 1 nhóm cùng nhà mới: lấy 1–2 câu của một nhóm chưa mở
  const g = nw.length ? nw[0].nha : null; ok.slice(0, PH_N - L.length - (g ? 2 : 0)).forEach(add); if (g) nw.filter(x => x.nha === g).slice(0, 2).forEach(add);
  if (L.length < PH_N) ok.concat(nw).forEach(x => L.length < PH_N && add(x));
  if (L.length < PH_N) shuf((PH_K || []).filter(x => I[x.id])).sort((a, b) => (I[a.id].d || 0) - (I[b.id].d || 0)).forEach(x => L.length < PH_N && add(x));
  return shuf(L).slice(0, PH_N); }

// ---------- lối vào ----------
function phRow() { if (typeof TO === 'undefined' || !TO) return '';
  return `<div class="box hcard" style="margin:12px 0 0"><button class="hrow" data-phv><span class="ic">🏘</span><span class="t"><b>Phố Loại Từ</b><small>Điều khiển bé Mầm bắt đúng loại từ · Part 5</small></span><span class="chev">›</span></button></div>`; }
let PH_R = null, PH_BACK = null;
const phTop = (lab, right) => `<div id="ie"></div><div class="row top"><button class="link tap" data-phback>‹ ${lab}</button><span class="mute">${right || ''}</span></div>`;
function phBackGo() { const b = PH_BACK; PH_BACK = null; if (b) return b(); EX_PART = 'san'; return toeicView(); }

async function phView() { phStop(); window.CUR = { view: PH_VIEW }; BACK = null; scrollTo(0, 0); $app.onkeydown = null;
  $app.innerHTML = '<div id="ie"></div><p class="mute">Đang mở Phố Loại Từ…</p>'; await toLoad(); await phLoad(); if (window.CUR.view !== PH_VIEW) return;
  const P = phSt(); if (!P.in) return phIntro();
  const due = phDue().length, wr = phWrong().filter(it => !(P.it[it.id] && P.it[it.id].s === 1)).length, nc = Object.keys(P.cd).length, seen = (PH_K || []).filter(x => P.it[x.id]).length;
  $app.innerHTML = phTop('TOEIC') + `<h1 style="margin:4px 0 6px">🏘 Phố Loại Từ</h1>
    <div class="phhero">${phFace('N', 50)}${phFace('V', 50)}${phFace('M', 76, 'happy')}${phFace('A', 50)}${phFace('R', 50)}</div>
    <p class="mute" style="margin:0 0 10px">Điều khiển bé Mầm bắt đúng từ cho ghế trống. Mỗi loại từ là một cư dân có ghế riêng.</p>
    <h3 style="margin:6px 0">Chọn bậc · học từng việc rồi mới ghép</h3><div class="phmuc">${PH_MO.map(m => { const o = PH_MUC[m], op = phOpen(m), b = (P.mu || {})[m];
      return `<button class="phmc${m === phMuc() ? ' on' : ''}" data-phmuc="${m}" aria-pressed="${m === phMuc()}"${op ? '' : ' disabled'}><b>${op ? o.ten : '🔒 ' + o.ten.replace(/^\S+\s/, '')}</b><small>${op ? o.sub : `Mở khi thắng ${PH_MUC[PH_MO[PH_MO.indexOf(m) - 1]].ten.replace(/^\S+\s/, '')} (đúng ≥ ${PH_WIN} / ${PH_N})`}</small>${b ? `<small class="phbest">Tốt nhất ${b} / ${PH_N}</small>` : ''}</button>`; }).join('')}</div>
    <button class="pri" data-phplay style="min-height:56px;font-size:18px">▶ Chơi · ${PH_MUC[phMuc()].ten}</button>${phSndRow()}
    <div class="box" style="margin-top:10px"><p style="margin:2px 0">${due ? `🔁 <b>${due}</b> câu đến hạn ôn, có trong ván này` : '🔁 Chưa có câu đến hạn ôn'}</p>
      <p style="margin:2px 0">${wr ? `👾 <b>${wr}</b> câu loại từ bạn từng sai trong đề, sẽ chen vào ván` : '👾 Chưa có câu loại từ nào bạn sai trong đề'}</p>
      <p style="margin:2px 0">🗺 Đã gặp ${seen} / ${(PH_K || []).length} câu của phố</p></div>
    <button class="hrow phbook" data-phbook><span class="ic">📜</span><span class="t"><b>Sổ thần chú</b><small>${nc} / ${PH_ORD.length + Object.keys(PH_NHA).length} câu thần chú đã mở</small></span><span class="chev">›</span></button>
    <details class="more"><summary>Thêm</summary><button class="link tap" data-phintro>👋 Làm quen lại 4 cư dân</button>
      <p class="mute" style="font-size:14px">Không tính vào 📘 Học / 🔁 Nhớ, không đổi điểm đề thử. Câu của phố do Claude soạn, chưa giáo viên kiểm. Câu bạn bắt đúng ở ván sau 1 → 3 → 7 → 21 ngày thì nhớ chắc.</p></details>`;
  $app.onclick = e => { if (e.target.closest('[data-phback]')) return phBackGo(); if (phSndClick(e)) return phView(); const mb = e.target.closest('[data-phmuc]'); if (mb && phOpen(mb.dataset.phmuc)) { P.mc = mb.dataset.phmuc; save(); return phView(); } if (e.target.closest('[data-phplay]')) return phStart(); if (e.target.closest('[data-phbook]')) return phBook(); if (e.target.closest('[data-phintro]')) return phIntro(); }; }

// ---------- làm quen + thám tử ----------
function phIntro() { phStop(); window.CUR = { view: PH_VIEW + '-intro' }; scrollTo(0, 0);
  $app.innerHTML = phTop('Phố', 'Bước 1 / 2') + `<h2>Cư dân Phố Loại Từ</h2><p class="mute">Chạm vào từng người để nghe họ giới thiệu. Nhớ đồng phục (đuôi từ) của họ.</p>
    ${PH_ORD.map(t => `<button class="phwho" data-phtalk="${t}">${phFace(t, 58)}<span class="t"><b>${PH_CH[t].name}</b><span><span class="phtag ph-${t}">${PH_CH[t].pos}</span> <small class="mute">Đồng phục: ${PH_CH[t].suf}</small></span><small>${PH_CH[t].line}</small></span></button>`).join('')}
    <button class="pri" data-phg>Đi làm thám tử ›</button>`;
  $app.onclick = e => { if (e.target.closest('[data-phback]')) return phView(); const b = e.target.closest('[data-phtalk]'); if (b) { b.classList.remove('talk'); void b.offsetWidth; b.classList.add('talk'); phSfx('grow'); return; }
    if (e.target.closest('[data-phg]')) phGuess(PH_ORD.slice(), () => { phSt().in = 1; save(); phStart(); }); }; }
const phEx = (g, cls) => g.ex.map(([a, w, b]) => `<p>${esc(a)} <span class="phhl${cls ? ' ' + cls : ''}">${esc(w)}</span>${b.startsWith('.') ? '' : ' '}${esc(b)}</p>`).join('');
// keys: danh sách khoá cần đoán (cư dân hoặc nhóm cùng nhà); xong gọi done
function phGuess(keys, done) { const k = keys.shift(); if (!k) return done(); window.CUR = { view: PH_VIEW + '-tham-tu' }; scrollTo(0, 0);
  const nha = PH_NHA[k], g = nha || PH_G[k], total = keys.length + 1;
  $app.innerHTML = phTop('Phố', nha ? 'Vụ mới · hai người cùng nhà' : `Thám tử · còn ${total} vụ`) + `<h2>🔍 ${esc(g.q)}</h2>${nha ? `<p class="mute" style="margin:0 0 6px">${esc(nha.name)}</p>` : ''}
    <div class="box phex" id="phexs">${phEx(g)}</div><p class="mute">Ba câu có cùng một kiểu ghế. Bạn đoán xem.</p>
    <div class="phpick" id="phpick">${nha ? nha.ans.map((a, i) => `<button data-pha="${i}">${phFace(nha.who, 44)}<span>${esc(a)}</span></button>`).join('') : PH_ORD.map(t => `<button data-pha="${t}">${phFace(t, 48)}<span>${PH_CH[t].name}</span></button>`).join('')}</div><div id="phgres"></div>`;
  $app.onclick = e => { if (e.target.closest('[data-phback]')) return phView(); if (e.target.closest('[data-phgn]')) return phGuess(keys, done);
    const b = e.target.closest('[data-pha]'); if (!b) return; const v = b.dataset.pha, ok = nha ? +v === nha.ok : v === k, who = nha ? nha.who : (ok ? k : v);
    if (!ok) { b.classList.remove('no'); void b.offsetWidth; b.classList.add('no'); phSfx('no'); phVib(40);
      document.getElementById('phgres').innerHTML = `<div class="phsay">${phFace(who, 44, 'sad')}<div class="b"><b>${PH_CH[who].name}</b><p>“${nha ? 'Chưa đúng đâu!' : 'Không phải ghế của tôi!'}” ${esc(g.hint)}</p></div></div>`; return; }
    const P = phSt(); P.cd[k] = P.cd[k] || { at: Date.now(), n: 0 }; save(); phSfx('grow'); phVib(20);
    document.getElementById('phexs').innerHTML = phEx(g, 'ph-' + who); document.getElementById('phpick').hidden = true;
    document.getElementById('phgres').innerHTML = `<div class="phsay">${phFace(who, 56, 'happy')}<div class="b"><b>${PH_CH[who].name}</b><p>“${esc(g.chant)}”</p>${nha ? '' : `<small class="mute">Đồng phục: ${PH_CH[who].suf}</small>`}</div></div>
      <p class="mute">📜 Đã thêm câu thần chú vào sổ (${Object.keys(P.cd).length} / ${PH_ORD.length + Object.keys(PH_NHA).length}).</p><button class="pri" data-phgn>${keys.length ? 'Vụ tiếp theo ›' : 'Ra phố bắt từ ›'}</button>`; }; }

// ---------- sổ thần chú ----------
function phBook(back) { const P = phSt(); window.CUR = { view: PH_VIEW + '-so' }; scrollTo(0, 0);
  const row = (k, who, name, chant) => { const c = P.cd[k]; return c ? `<div class="phsay">${phFace(who, 44)}<div class="b"><b>${esc(name)}</b><p>“${esc(chant)}”</p><small class="mute">Dùng đúng ở câu mới: ${c.n || 0} lần${(c.n || 0) >= 5 ? ' · ⭐ thành thạo' : ''}</small></div></div>`
    : `<div class="phsay phlock"><span class="phlk">🔒</span><div class="b"><b>${esc(name)}</b><p class="mute">Mở khi gặp câu cần luật này.</p></div></div>`; };
  $app.innerHTML = phTop(back ? 'Ván đang chơi' : 'Phố') + `<h2>📜 Sổ thần chú</h2>${PH_ORD.map(t => row(t, t, PH_CH[t].name, PH_G[t].chant)).join('')}<h3 style="margin:14px 0 6px">Hai người cùng nhà</h3>${Object.entries(PH_NHA).map(([k, g]) => row(k, g.who, g.name, g.chant)).join('')}`;
  $app.onclick = e => { if (e.target.closest('[data-phback]')) return back ? back() : phView(); }; }

// ---------- ván chơi ----------
function phStop() { phMusic(false); if (PH_R) { cancelAnimationFrame(PH_R.raf); clearTimeout(PH_R.to); if (!PH_R.end && PH_R.i > 0) phStat('bo'); PH_R = null; } }
function phStart(fix, back) { phStop(); phAc(); let L = phPick(fix); if (!fix && PH_MUC[phMuc()].md === 'dp') L = L.filter(it => phCall(it).length); if (!L.length) { toast('Chưa tải được câu của phố.'); return phView(); }
  const P = phSt(), M = fix ? PH_FIX : PH_MUC[phMuc()];
  // nhóm "hai người cùng nhà" chỉ cần ở bậc bắt đủ 4 từ (bậc 1–3 không có cặp cùng loại)
  const need = M.md === 'tu' && M.k >= 4 ? [...new Set(L.map(x => x.nha).filter(n => n && PH_NHA[n] && !P.cd[n]))] : [];
  const go = () => phQuick(() => phRun(L, fix, back));
  if (need.length) return phGuess(need, go); go(); }
// ⚡ Nhớ nhanh: 3 câu, chỉ đồng phục hoặc ghế → chạm cư dân (nhớ lại không gợi ý)
function phQuick(done) { const P = phSt(), ks = PH_ORD.filter(t => P.cd[t]); if (ks.length < 3) return done();
  const Q = shuf(ks).slice(0, 3).map(t => Math.random() < .5 ? { t, p: `Đồng phục ${PH_CH[t].suf.split(' · ').slice(0, 2).join(', ')} là của ai?` } : { t, p: `“${PH_G[t].chant.replace(/của tôi|là tôi|Tôi /g, '…')}” Ai đây?` });
  let i = 0, ok = 0; window.CUR = { view: PH_VIEW + '-nho-nhanh' };
  const draw = r => { const q = Q[i]; $app.innerHTML = phTop('Phố', `⚡ Nhớ nhanh ${i + 1} / 3`) + `<h2>${esc(q.p)}</h2><div class="phpick">${PH_ORD.map(t => `<button data-phq="${t}"${r ? ' disabled' : ''} class="${r && t === q.t ? 'yes' : r && t === r ? 'no' : ''}">${phFace(t, 48, r && t === q.t ? 'happy' : 'idle')}<span>${PH_CH[t].name}</span></button>`).join('')}</div>${r ? `<button class="pri" data-phqn>${i < 2 ? 'Tiếp ›' : `▶ Vào ván · nhớ đúng ${ok} / 3`}</button>` : '<p class="mute">Nhớ lại thôi, không có gợi ý.</p>'}`; };
  $app.onclick = e => { if (e.target.closest('[data-phback]')) return phView(); const b = e.target.closest('[data-phq]'); if (b) { const g = b.dataset.phq === Q[i].t; if (g) ok++; phSfx(g ? 'ok' : 'no'); return draw(b.dataset.phq); }
    if (e.target.closest('[data-phqn]')) { i++; if (i >= 3) return done(); draw(); } };
  draw(); scrollTo(0, 0); }
const phSndRow = () => `<div class="phsnd"><button data-phmus aria-pressed="${phMusicOn()}">${phMusicOn() ? '🎵 Nhạc nền: bật' : '🎵 Nhạc nền: tắt'}</button><button data-phsfx aria-pressed="${phSnd()}">${phSnd() ? '🔊 Tiếng đúng / sai: bật' : '🔇 Tiếng đúng / sai: tắt'}</button></div>`;
function phSndClick(e) { const P = phSt();
  if (e.target.closest('[data-phmus]')) { P.nhac = phMusicOn() ? 0 : 1; save(); phAc(); phMusic(!!(PH_R && P.nhac)); return true; }
  if (e.target.closest('[data-phsfx]')) { P.am = phSnd() ? 0 : 1; save(); phSfx('ok'); return true; } return false; }
function phRun(L, fix, back) { window.CUR = { view: PH_VIEW + '-van' }; scrollTo(0, 0); phStat('van');
  const mu = fix ? 'fix' : phMuc(), M = fix ? PH_FIX : PH_MUC[mu], half = M.dur[0] !== M.dur[1] ? Math.ceil(L.length / 2) : L.length;
  PH_R = { L, fix, back, mu, M, i: 0, lane: 1, hearts: M.tim, stars: 0, combo: 0, ok: 0, miss: [], half, goi: M.goi, end: 0, paused: false, sheet: false };
  const help = { dp: 'Chạm làn, vuốt hoặc bấm ◀ ▶ để Mầm bắt đúng loại từ được gọi.', gh: 'Đọc câu, bắt cư dân hợp với ghế trống. Chạm từ trong câu để tra nghĩa.', tu: 'Chạm làn, vuốt hoặc bấm ◀ ▶. Chạm từ trong câu để tra nghĩa.' }[M.md];
  $app.innerHTML = `<div class="phhud trx"><button class="iconbtn" data-phpause aria-label="Tạm dừng, nhạc và tiếng">⏸</button><span class="chip" id="phh"></span><span class="chip" id="phs"></span><span class="chip" id="phc" hidden></span><button class="iconbtn" data-phbk aria-label="Sổ thần chú">📜</button></div>
    <div class="phbar"><i id="phprog"></i></div><div class="phlvr"><span class="phlv mute" id="phlv"></span><button class="phhint" data-phhint id="phhint"></button></div><div id="phgoi" class="phgoi" hidden></div><div class="phsent tdtap" id="phsent"></div>
    <div class="pharena" id="pharena">${Array.from({ length: M.k }, (_, i) => `<div class="phlane" style="left:${i * 100 / M.k}%;width:${100 / M.k}%"></div>`).join('')}<div class="phground"></div><div id="phrow"></div><div id="phmam" style="width:${100 / M.k}%">${phFace('M', 64)}</div><div id="phfx" class="phfx" aria-live="assertive"></div></div>
    <div id="phfb"></div><div class="phctrl"><button data-phmv="-1" aria-label="Sang trái">◀</button><button data-phmv="1" aria-label="Sang phải">▶</button></div>
    <p class="mute" style="font-size:14px;text-align:center;margin:6px 0 0">${help}</p>`;
  const A = document.getElementById('pharena'); let x0 = null;
  A.addEventListener('pointerdown', e => { x0 = e.clientX; });
  A.addEventListener('pointerup', e => { if (x0 === null || !PH_R) return; const dx = e.clientX - x0; x0 = null; if (Math.abs(dx) > 28) phMove(PH_R.lane + Math.sign(dx)); else { const r = A.getBoundingClientRect(); phMove(Math.floor((e.clientX - r.left) / r.width * PH_R.M.k)); } });
  document.getElementById('phsent').addEventListener('click', () => phStat('tra'));
  $app.onclick = e => { if (!PH_R) return; const m = e.target.closest('[data-phmv]'); if (m) return phMove(PH_R.lane + +m.dataset.phmv);
    if (e.target.closest('[data-phnext]')) return phNext();
    if (e.target.closest('[data-phhint]')) return phHint();
    if (e.target.closest('[data-phpause]')) return phSheet('<h3>⏸ Tạm dừng</h3><p class="mute">Từ đang rơi đứng yên tới khi bạn chơi tiếp.</p>' + phSndRow() + '<button class="link tap" data-phquit>Thoát ván, về Phố</button>');
    if (e.target.closest('[data-phbk]')) return phSheet(`<h3>📜 Sổ thần chú</h3>${Object.keys(phSt().cd).map(k => { const n = PH_NHA[k], w = n ? n.who : k; return `<div class="phsay">${phFace(w, 40)}<div class="b"><b>${esc(n ? n.name : PH_CH[k].name)}</b><p>“${esc(n ? n.chant : PH_G[k].chant)}”</p></div></div>`; }).join('')}`); };
  phMusic(true); phHud(); phMove(1, 1); phQ(); }
function phSheet(html) { if (!PH_R) return; PH_R.sheet = true; let el = document.getElementById('phsheet'); if (!el) { el = document.createElement('div'); el.id = 'phsheet'; el.className = 'phsheet'; document.body.appendChild(el); }
  el.innerHTML = `<div class="in">${html}<button class="pri" data-phclose>Đóng, chơi tiếp</button></div>`; el.hidden = false;
  el.onclick = e => { if (phSndClick(e)) { const b = e.target.closest('button'); const r = document.createElement('div'); r.innerHTML = phSndRow(); b.closest('.phsnd').replaceWith(r.firstElementChild); return; }
    if (e.target.closest('[data-phquit]')) { el.hidden = true; return phView(); } if (e.target.closest('[data-phclose]')) { el.hidden = true; if (PH_R) { PH_R.sheet = false; PH_R.last = performance.now(); } } }; }
function phHud() { const R = PH_R; if (!R) return; const s = (id, v) => { const e = document.getElementById(id); if (e) e.textContent = v; };
  s('phh', R.M.tim > 3 ? `❤️ ${R.hearts} / ${R.M.tim}` : '❤️'.repeat(R.hearts) + '🤍'.repeat(R.M.tim - R.hearts)); s('phs', '⭐ ' + R.stars); s('phc', R.combo >= 2 ? '🔥 ×' + R.combo : ''); const c = document.getElementById('phc'); if (c) c.hidden = R.combo < 2;
  const p = document.getElementById('phprog'); if (p) p.style.width = (R.i / R.L.length * 100) + '%';
  s('phlv', `${R.M.ten} · Câu ${Math.min(R.i + 1, R.L.length)} / ${R.L.length}`);
  const h = document.getElementById('phhint'); if (h) { h.textContent = R.goi > 50 ? '💡 Gợi ý' : `💡 Gợi ý · còn ${R.goi}`; h.disabled = !R.goi || R.done || R.hint >= 2; } }
const phCall = it => it.o.filter(o => it.o.filter(x => x[1] === o[1]).length === 1 && !(o[1] === 'V' && /(ed|ing)$/i.test(o[0])));
const phSuf = t => PH_CH[t].suf.split(' · ').slice(0, 3).join(', ');
// 💡 gợi ý: bậc 1 = đồng phục của cư dân được gọi · bậc 2–4 = ① tô chữ mốc ② nói ghế của cư dân nào
function phHint() { const R = PH_R; if (!R || R.done || !R.goi || R.hint >= 2) return; const it = R.it, A = it.o.find(o => o[0] === it.a), moc = phMoc(it), md = R.M.md;
  if (md === 'dp') R.hint = 2; else if (!R.hint && moc && !R.M.moc) R.hint = 1; else R.hint = 2;
  if (R.M.goi < 50) R.goi--; R.used = 1; phStat('goi');
  if (md !== 'dp') document.getElementById('phsent').innerHTML = phSent(it, null, moc);
  const g = document.getElementById('phgoi'); g.hidden = false;
  g.innerHTML = md === 'dp' ? `${phFace(R.T, 30, 'happy')}<span>💡 ${PH_CH[R.T].name} mặc đồng phục <b>${esc(phSuf(R.T))}</b>. Nhìn đuôi từ.</span>`
    : R.hint === 1 ? `💡 Nhìn chữ được tô: <b>${esc(moc)}</b>. Ai hay ngồi cạnh chữ này?` : `${phFace(A[1], 30, 'happy')}<span>💡 Ghế này của <b>${PH_CH[A[1]].name}</b> (${PH_CH[A[1]].pos.toLowerCase()} · đồng phục ${esc(phSuf(A[1]))}).</span>`;
  phSfx('grow'); phHud(); }
function phSent(it, fill, moc) { let [a, b] = it.s.split('___').map(esc);
  if (moc) { const re = new RegExp('(^|[^A-Za-z])(' + esc(moc).replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')(?=$|[^A-Za-z])', 'i'), mk = (m0, p1, p2) => `${p1}<mark class="phmoc">${p2}</mark>`;
    const ia = [...a.matchAll(new RegExp(re.source, 'gi'))]; if (ia.length) { const m = ia[ia.length - 1]; a = a.slice(0, m.index) + mk(...m) + a.slice(m.index + m[0].length); } else b = (b || '').replace(re, mk); }
  return a + (fill ? `<span class="phgap fill ph-${fill.t}">${esc(fill.w)}</span>` : '<span class="phgap" aria-label="ghế trống">?</span>') + (b || ''); }
// dựng các làn của câu: mỗi làn { w, p, m, ok } (w = chữ hiện, p = loại từ / cư dân, m = nghĩa)
function phLanes(it, M) { const A = it.o.find(o => o[0] === it.a), as = o => ({ w: o[0], p: o[1], m: o[2] });
  if (M.md === 'gh') return { order: shuf(PH_ORD).map(t => ({ w: PH_SHORT[t], p: t, ok: t === A[1] })) };
  if (M.md === 'dp') { // bậc 1 chỉ gọi từ có đồng phục rõ: không gọi động từ đuôi -ed / -ing (dễ lẫn với tính từ)
    const uniq = phCall(it), tg = shuf(uniq)[0] || A, others = shuf(it.o.filter(o => o !== tg && o[1] !== tg[1]));
    return { T: tg[1], order: shuf([tg, ...others.slice(0, M.k - 1)]).map(o => ({ ...as(o), ok: o === tg })) }; }
  let os = it.o; if (M.k < os.length) { const w = os.filter(o => o !== A), drop = w.find(o => o[1] === A[1]) || shuf(w)[0]; os = os.filter(o => o !== drop); }
  return { order: shuf(os).map(o => ({ ...as(o), ok: o[0] === it.a })) }; }
function phQ() { const R = PH_R, it = R.L[R.i], lv = R.i < R.half ? 1 : 2, M = R.M; R.it = it; R.lv = lv; R.done = false; R.hint = 0; R.used = 0;
  const ln = phLanes(it, M); R.order = ln.order; R.T = ln.T; R.lane = Math.min(R.lane, M.k - 1);
  document.getElementById('phfb').innerHTML = ''; document.getElementById('phfx').innerHTML = ''; document.getElementById('pharena').classList.remove('okfl', 'nofl');
  const g = document.getElementById('phgoi'); g.hidden = true; g.innerHTML = '';
  document.getElementById('phsent').innerHTML = M.md === 'dp' ? `<div class="phcall">${phFace(R.T, 44)}<span>Bắt <b>${PH_CH[R.T].name}</b><small>${PH_CH[R.T].pos}</small></span></div>` : phSent(it, null, M.moc ? phMoc(it) : null);
  const row = document.getElementById('phrow'); row.style.transform = '';
  row.innerHTML = R.order.map((o, k) => `<div class="phbub" style="left:${k * 100 / M.k}%;width:${100 / M.k}%"><div class="phpill ${M.md === 'gh' || M.mau ? 'ph-' + o.p : 'grey'}">${M.md === 'gh' || M.mau ? phFace(o.p, M.md === 'gh' ? 28 : 24) : ''}<span>${esc(o.w)}</span></div></div>`).join('');
  const H = document.getElementById('pharena').clientHeight, rh = row.firstElementChild.offsetHeight;
  R.y = -rh - 8; R.catchY = H - 12 - 64 - rh * 0.55;
  R.speed = (R.catchY - R.y) / (M.dur[lv - 1] * (phRM() ? 1.5 : 1) / Math.min(1.3, 1 + R.combo * 0.04));
  row.style.transform = `translateY(${R.y}px)`; R.last = performance.now(); cancelAnimationFrame(R.raf); R.raf = requestAnimationFrame(phTick); phHud(); }
const phPop = () => { const p = document.getElementById('tdpop'); return !!(p && !p.hidden); };
function phTick(t) { const R = PH_R, row = document.getElementById('phrow'); if (!R || !row || !String(window.CUR.view).startsWith(PH_VIEW)) return phStop();
  const dt = Math.min(.05, (t - R.last) / 1000); R.last = t;
  if (!R.done && !R.sheet && !phPop() && !document.hidden) { R.y += R.speed * dt; row.style.transform = `translateY(${R.y}px)`; if (R.y >= R.catchY) return phCatch(); }
  R.raf = requestAnimationFrame(phTick); }
function phMove(l, quiet) { const R = PH_R; if (!R || (R.done && !quiet)) return; R.lane = Math.max(0, Math.min(R.M.k - 1, l)); const m = document.getElementById('phmam'); if (m) m.style.transform = `translateX(${R.lane * 100}%)`; }
function phMood(m) { const el = document.getElementById('phmam'); if (!el) return; el.innerHTML = phFace('M', 64, m); el.classList.remove('jump', 'ouch'); void el.offsetWidth; el.classList.add(m === 'happy' ? 'jump' : 'ouch'); }
function phMark(it, ok, hint) { const P = phSt(), I = P.it, old = I[it.id], t = phDay(), lv = ok && !hint ? Math.min(4, ((old && old.lv) || 0) + 1) : ok ? ((old && old.lv) || 0) : 0;
  I[it.id] = { at: Date.now(), lv, d: t + (ok && !hint ? PH_HEN[lv - 1] : 1), s: ok ? 1 : 0 };
  const A = it.o.find(o => o[0] === it.a); if (ok && !hint && !old) { for (const k of [A[1], it.nha]) if (k && P.cd[k]) P.cd[k].n = (P.cd[k].n || 0) + 1; }
  if (it.real && typeof tgJ === 'function') tgJ(it.de).c[it.n] = { s: ok ? 'ok' : 'sai', at: Date.now() }; }
function phCatch() { const R = PH_R; R.done = true; const it = R.it, M = R.M, got = R.order[R.lane], A = it.o.find(o => o[0] === it.a), ok = !!got.ok, bub = document.getElementById('phrow').children[R.lane];
  if (M.md === 'tu') phMark(it, ok, R.used); phStat('cau'); if (ok) phStat('ok'); if (ok && M.md === 'tu' && M.k >= 4) phStat('ok2'); save();
  const fx = document.getElementById('phfx'), ar = document.getElementById('pharena'), ai = R.order.findIndex(o => o.ok);
  const opts = M.md === 'gh' ? '' : `<details class="more"><summary>Nghĩa các từ</summary>${(M.md === 'dp' ? R.order : it.o.map(o => ({ w: o[0], p: o[1], m: o[2] }))).map(o => `<p style="margin:3px 0"><span class="phtag ph-${o.p}">${esc(o.w)}</span> ${PH_CH[o.p].pos.toLowerCase()}: ${esc(o.m)}</p>`).join('')}</details>`;
  const real = it.real && M.md === 'tu' ? `<p class="mute" style="margin:0;font-size:14px">👾 Câu ${it.n} của ${esc(typeof tgDeName === 'function' ? tgDeName(it.de) : it.de)}${ok ? ': đã chữa, câu mọc 🌱 ở Chinh phục đề' : ''}</p>` : '';
  ar.classList.remove('okfl', 'nofl'); void ar.offsetWidth; const hb = document.getElementById('phhint'); if (hb) hb.disabled = true;
  const fill = () => { if (M.md !== 'dp') document.getElementById('phsent').innerHTML = phSent(it, { t: A[1], w: it.a }); };
  if (ok) { R.combo++; R.ok++; R.stars += R.combo >= 3 ? 2 : 1; bub.classList.add('caught'); phMood('happy'); phSfx(R.combo >= 3 ? 'combo' : 'ok'); phVib(15);
    if (phSnd() && M.md !== 'gh') { try { setTimeout(() => speak(got.w), 350); } catch (e) {} }
    const heal = R.combo % 3 === 0 && R.hearts < R.M.tim; if (heal) { R.hearts++; setTimeout(() => phSfx('heal'), 450); }
    ar.classList.add('okfl'); fx.innerHTML = `<div class="phbig ok">✓ Đúng rồi!</div>${R.combo >= 2 ? `<div class="phsub">🔥 ${R.combo} câu liền${heal ? ' · ❤️ +1 tim' : ''}</div>` : ''}${phRM() ? '' : '<i class="phst">⭐</i><i class="phst">⭐</i><i class="phst">✨</i><i class="phst">⭐</i><i class="phst">✨</i>'}`;
    fill();
    const head = M.md === 'dp' ? `✓ <b>${esc(got.w)}</b> là ${PH_CH[got.p].pos.toLowerCase()} · đồng phục ${esc(phSuf(got.p))}` : M.md === 'gh' ? `✓ Ghế này của ${PH_CH[A[1]].name}: <b>${esc(it.a)}</b>` : `✓ ${esc(it.a)} · ${PH_CH[A[1]].name}`;
    document.getElementById('phfb').innerHTML = `<div class="phfb good"><p class="ok">${head}${R.combo >= 3 ? ` · combo ×${R.combo} (⭐ ×2)` : ''}</p>${M.md === 'gh' ? `<p style="margin:0">${esc(it.why)}</p>` : ''}${real}${M.md === 'dp' ? '' : `<p class="mute" style="margin:0">${esc(it.vi)}</p>`}${opts}<button class="pri" data-phnext>${R.i + 1 < R.L.length ? 'Câu tiếp ›' : 'Xem kết quả'}</button></div>`;
    phHud(); clearTimeout(R.to); R.to = setTimeout(() => { if (PH_R === R && R.done && !R.sheet && !phPop()) phNext(); }, phRM() ? 2800 : 2200); return; }
  R.combo = 0; R.hearts--; R.miss.push({ it, got, md: M.md, T: R.T }); bub.classList.add('wrong'); phMood('sad'); phSfx('no'); phVib([40, 40, 40]);
  ar.classList.add('nofl'); fx.innerHTML = `<div class="phbig no">✗ Sai rồi</div><div class="phsub">${R.hearts > 0 ? `💔 còn ${R.hearts} tim · đáp án sáng xanh` : '💔 hết tim'}</div>`;
  const ab = document.getElementById('phrow').children[ai]; if (ab) ab.classList.add('ans');
  fill(); let body;
  if (M.md === 'dp') { const T = R.T, rt = R.order[ai];
    body = `<div class="phsay">${phFace(got.p, 44, 'sad')}<div class="b"><b>${PH_CH[got.p].name}</b><p>“Tôi không phải ${PH_CH[T].name}! ${esc(got.w)} là ${PH_CH[got.p].pos.toLowerCase()}, đồng phục ${esc(phSuf(got.p))}.”</p></div></div>
      <p><span class="ko">Cần:</span> <span class="phtag ph-${T}">${esc(rt.w)}</span> (${PH_CH[T].pos.toLowerCase()} · đồng phục ${esc(phSuf(T))}).</p>`; }
  else if (M.md === 'gh') body = `<div class="phsay">${phFace(got.p, 44, 'sad')}<div class="b"><b>${PH_CH[got.p].name}</b><p>“Ghế này không phải của tôi!”</p></div></div>
      <p><span class="ko">Ghế của:</span> <span class="phtag ph-${A[1]}">${PH_CH[A[1]].name}</span> (${PH_CH[A[1]].pos.toLowerCase()}). ${esc(it.why)}</p><p class="mute" style="margin:0">${esc(it.vi)}</p>`;
  else { const same = got.p === A[1], who = got.p, line = same ? `Tôi với ${esc(it.a)} cùng nhà ${PH_CH[who].pos.toLowerCase()}, nhưng ghế này không phải của tôi. ${esc(got.w)} = ${esc(got.m)}.` : `Không phải ghế của tôi! Tôi là ${PH_CH[who].pos.toLowerCase()}, ${esc(got.w)} = ${esc(got.m)}.`;
    const nha = it.nha && PH_NHA[it.nha] && phSt().cd[it.nha] ? `<p class="phch">📜 ${esc(PH_NHA[it.nha].chant)}</p>` : '';
    body = `<div class="phsay">${phFace(who, 44, 'sad')}<div class="b"><b>${PH_CH[who].name}</b><p>“${line}”</p></div></div>
      <p><span class="ko">Cần:</span> <span class="phtag ph-${A[1]}">${esc(it.a)}</span> (${PH_CH[A[1]].name}). ${esc(it.why)}</p>${nha}${real}<p class="mute" style="margin:0">${esc(it.vi)}</p>`; }
  document.getElementById('phfb').innerHTML = `<div class="phfb bad">${body}${opts}<button class="pri" data-phnext>${R.hearts <= 0 ? 'Xem kết quả' : 'Hiểu rồi ›'}</button></div>`;
  phHud(); setTimeout(() => { const f = document.getElementById('phfb'); if (f && f.scrollIntoView) f.scrollIntoView({ block: 'nearest', behavior: phRM() ? 'auto' : 'smooth' }); }, 700); }
function phNext() { const R = PH_R; if (!R) return; clearTimeout(R.to); if (R.hearts <= 0) return phEnd(); R.i++; if (R.i >= R.L.length) return phEnd(); phQ(); scrollTo(0, 0); }
const phMissLine = ({ it, got, md, T }) => md === 'dp' ? `<p style="margin:0">Cần <b>${PH_CH[T].pos.toLowerCase()}</b> (${esc(phSuf(T))}), bạn bắt <b>${esc(got.w)}</b> là ${PH_CH[got.p].pos.toLowerCase()} (${esc(phSuf(got.p))}).</p>`
  : `<p style="margin:0 0 4px">${esc(it.s).replace('___', `<b>${esc(it.a)}</b>`)}</p><p class="mute" style="margin:0;font-size:14px">Bạn bắt ${esc(got.w)} (${PH_CH[got.p].name}). ${esc(it.why)}</p>`;
function phEnd() { const R = PH_R; R.end = 1; cancelAnimationFrame(R.raf); phMusic(false); const win = R.hearts > 0, n = R.ok + R.miss.length, P = phSt(); P.mu = P.mu || {};
  const nx = R.fix ? null : PH_MO[PH_MO.indexOf(R.mu) + 1], was = nx && phOpen(nx); if (win && !R.fix) P.mu[R.mu] = Math.max(P.mu[R.mu] || 0, R.ok); const unl = nx && !was && phOpen(nx);
  if (unl) P.mc = nx; phSfx(win ? 'win' : 'lose'); save();
  window.CUR = { view: PH_VIEW + '-ket-qua' }; scrollTo(0, 0); const fix = R.fix, back = R.back; PH_R = null;
  $app.innerHTML = `<div id="ie"></div><div class="phhero">${phFace('M', 90, win ? 'happy' : 'sad')}</div><h2>${win ? 'Phố đã đủ người ngồi đúng ghế!' : 'Mầm hết tim rồi'}</h2>${unl ? `<div class="box phunl">🔓 Mở <b>${PH_MUC[nx].ten}</b>! Ván sau chơi bậc này.</div>` : ''}
    ${!win && R.mu !== 'b1' && !fix ? `<p class="mute">Khó quá? Chơi lại bậc trước ở màn Phố cho chắc rồi quay lại.</p>` : ''}${win && !unl && nx && !phOpen(nx) ? `<p class="mute">Đúng ≥ ${PH_WIN} / ${PH_N} câu để mở ${PH_MUC[nx].ten}.</p>` : ''}
    <div class="box"><div class="row"><span>Bắt đúng</span><b style="font-size:28px">${R.ok} / ${win ? R.L.length : n}</b></div><div class="row"><span>Sao</span><b>⭐ ${R.stars}</b></div></div>
    ${R.miss.length ? `<h3>Cần nhớ lại</h3>${R.miss.map(x => `<div class="box">${phMissLine(x)}</div>`).join('')}` : '<p class="mute">Không sai câu nào.</p>'}
    ${fix ? `<button class="pri" data-phtg>⚔️ Về đảo Chinh phục đề</button><button data-phagain>▶ Chơi ván thường</button>` : `<button class="pri" data-phagain>▶ Ván nữa</button>`}<button data-phhome>‹ Về Phố</button>`;
  $app.onclick = e => { if (e.target.closest('[data-phtg]')) return back ? back() : (typeof tgView === 'function' && tgView()); if (e.target.closest('[data-phagain]')) return phStart(); if (e.target.closest('[data-phhome]')) return phView(); }; }

// ---------- lối chữa từ Chinh phục đề (trochoi.js tgSua: câu Part 5 dạng từ) ----------
async function phFix(de, n) { await toLoad(); await phLoad(); const it = PH_RL[`de:${de}:${n}`]; if (!it) { toast('Câu này chưa có lời giải loại từ, chữa ở đảo nhé.'); return; }
  const P = phSt(); if (!P.in) { P.in = 1; save(); return phGuess(PH_ORD.slice(), () => phStart(it, () => tgView())); }
  phStart(it, () => tgView()); }
const phCanFix = q => !!(q && q.sec === 'p5' && q.x && q.x.t === 'form' && q.opts.every(o => ((q.lg || {}).og || {})[o]));

document.addEventListener('click', e => { if (!S) return; const v = e.target.closest('[data-phv]'); if (v && !String((window.CUR || {}).view).startsWith(PH_VIEW)) { PH_BACK = null; return phView(); }
  const f = e.target.closest('[data-phfix]'); if (f) { const [de, n] = f.dataset.phfix.split('|'); return phFix(de, +n); } });
document.addEventListener('keydown', e => { if (!PH_R || !String((window.CUR || {}).view).startsWith(PH_VIEW + '-van') || PH_R.sheet) return;
  if (e.key === 'ArrowLeft') { phMove(PH_R.lane - 1); e.preventDefault(); } if (e.key === 'ArrowRight') { phMove(PH_R.lane + 1); e.preventDefault(); } });
