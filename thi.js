// 🎯 Học để thi thật (27/10/2026, người sáng lập: "tự kiểm tra lại app đã giúp tôi đạt năng lực thi ngoài đời thật chưa, sáng tạo những thứ cần thiết").
// Kết quả tự kiểm (docs/HOAN-THIEN.md, mục "Tự kiểm: thi thật"): lỗ hổng lớn nhất là lượng đọc / nghe (mỗi cấp B1 → C2 trong app chỉ ~1.800–2.700 từ đọc, ≈ một đề thi);
// Viết chỉ chấm ý + độ dài; đề thử thiếu dạng "đoạn văn khuyết câu"; chưa có chỗ gom các bằng chứng "sẵn sàng thi". Tệp này thêm 4 thứ:
//   📚 Đọc nghe thêm ngoài app (nguồn miễn phí theo cấp + ghi giờ) · 🎯 Sẵn sàng thi (danh sách điều kiện trước khi đăng ký thi thật)
//   ✍️ Chấm Viết 4 tiêu chí Cambridge (bắt lỗi hay gặp của người Việt) · 🧩 đoạn văn khuyết câu trong đề thử.

// ---------- 📚 Đọc nghe thêm ngoài app ----------
// Mục tiêu giờ đọc + nghe ngoài app mỗi cấp (đề xuất của Claude, không phải số Cambridge): app chủ yếu luyện từ vựng / ngữ pháp, còn đề thật đòi đọc, nghe nhanh văn bản thật.
// Cambridge ước giờ học có hướng dẫn tính từ đầu: A2 ~180–200, B1 350–400, B2 500–600, C1 700–800, C2 1.000–1.200 (support.cambridgeenglish.org, bài 202838506).
const EXT_H = { pre: 3, a1: 10, a2: 25, a2p: 15, b1: 50, b1p: 30, b2: 80, b2p: 50, c1: 120, c2: 150 };
const EXT_SRC = {
  pre: [['Breaking News English (mức 0–1)', 'https://breakingnewsenglish.com/', 'tin ngắn rất dễ, có đọc to'], ['BBC Learning English', 'https://www.bbc.co.uk/learningenglish/', 'bài cho người mới']],
  a1: [['News in Levels (level 1)', 'https://www.newsinlevels.com/', 'tin 3 mức, có file nghe'], ['Breaking News English (mức 1–2)', 'https://breakingnewsenglish.com/', 'đọc + nghe cùng bài'], ['BBC Learning English', 'https://www.bbc.co.uk/learningenglish/', '']],
  a2: [['News in Levels (level 2)', 'https://www.newsinlevels.com/', 'đọc rồi nghe lại'], ['Breaking News English (mức 2–3)', 'https://breakingnewsenglish.com/', ''], ['Cambridge English: học miễn phí', 'https://www.cambridgeenglish.org/learning-english/', 'bài luyện của Cambridge']],
  b1: [['News in Levels (level 3)', 'https://www.newsinlevels.com/', ''], ['BBC 6 Minute English', 'https://www.bbc.co.uk/learningenglish/english/features/6-minute-english', 'podcast 6 phút, có bản chép'], ['Breaking News English (mức 3–4)', 'https://breakingnewsenglish.com/', '']],
  b2: [['BBC 6 Minute English', 'https://www.bbc.co.uk/learningenglish/english/features/6-minute-english', 'nghe không nhìn chữ trước'], ['Breaking News English (mức 5–6)', 'https://breakingnewsenglish.com/', ''], ['TED Talks', 'https://www.ted.com/talks', 'bật phụ đề tiếng Anh']],
  c1: [['BBC News', 'https://www.bbc.com/news', 'tin thật, giọng Anh'], ['The Guardian: The Long Read', 'https://www.theguardian.com/news/series/the-long-read', 'bài dài như đề C1'], ['TED Talks', 'https://www.ted.com/talks', 'tắt phụ đề']],
  c2: [['The Guardian: The Long Read', 'https://www.theguardian.com/news/series/the-long-read', ''], ['BBC Sounds: Factual', 'https://www.bbc.co.uk/sounds/category/factual', 'podcast, phóng sự Anh–Anh'], ['Project Gutenberg', 'https://www.gutenberg.org/', 'văn học kinh điển']] };
EXT_SRC.a2p = EXT_SRC.a2; EXT_SRC.b1p = EXT_SRC.b1; EXT_SRC.b2p = EXT_SRC.b2;
const extLog = () => (S.ext = S.ext || []);
const extMin = lv => extLog().filter(e => e.lv === lv).reduce((s, e) => s + e.min, 0);
function extBox(lv) { const src = EXT_SRC[lv]; if (!src) return ''; const m = extMin(lv), H = EXT_H[lv], pct = Math.min(100, Math.round(m / 60 / H * 100));
  return `<details class="box"><summary><b>📚 Đọc nghe thêm ngoài app</b> · ${(m / 60).toFixed(1)}/${H} giờ</summary>${bar(pct, 100, 'var(--accent)')}
    <p class="mute" style="margin:6px 0">Đề thi thật đòi đọc, nghe nhanh văn bản thật. Bài trong app chỉ đủ khoảng một đề mỗi cấp, nên cần đọc nghe thêm. Mục tiêu ${H} giờ ở cấp ${LVN[lv]} (đề xuất, không phải số Cambridge). Chọn bài hiểu được khoảng 90–95% từ.</p>
    ${src.map(([n, u, d]) => `<p style="margin:4px 0"><a href="${u}" target="_blank" rel="noopener">${esc(n)}</a>${d ? ` <span class="mute">· ${esc(d)}</span>` : ''}</p>`).join('')}
    <div class="chips" style="margin-top:6px"><button class="chip" data-ext="${lv}|doc">➕ Ghi giờ đọc</button><button class="chip" data-ext="${lv}|nghe">➕ Ghi giờ nghe</button></div></details>`; }
document.addEventListener('click', e => { const b = e.target.closest('[data-ext]'); if (!b) return; const [lv, kind] = b.dataset.ext.split('|');
  const v = prompt(`${kind === 'doc' ? 'Đọc' : 'Nghe'} bao nhiêu phút?`, '15'); if (v == null) return; const min = parseInt(v, 10); if (!(min > 0 && min <= 300)) return alert('Số phút 1–300.');
  extLog().push({ at: Date.now(), lv, kind, min }); S.t = Date.now(); save(); toast(`Đã ghi ${min} phút.`); overview(lv); });

// ---------- 🎯 Sẵn sàng thi ----------
// Chỉ nên đăng ký thi thật khi đủ cả 5 bằng chứng (đề thử của app do AI soạn nên không đủ một mình).
const RD_EXAM = { pre: 'Pre A1 Starters', a1: 'A1 Movers', a2: 'A2 Key', a2p: 'A2 Key', b1: 'B1 Preliminary', b1p: 'B1 Preliminary', b2: 'B2 First', b2p: 'B2 First', c1: 'C1 Advanced', c2: 'C2 Proficiency' };
const RD_REAL = { a2p: 'a2', b1p: 'b1', b2p: 'b2' };
const teachRuns = lv => ((S.teach = S.teach || {})[lv] = S.teach[lv] || []);
function readyChecks(lv) { const C = typeof MOCK !== 'undefined' && MOCK[lv], pass = C ? C.pass : 0.7, rl = RD_REAL[lv] || lv;
  const gate = OV.filter(([id]) => ovIn(id, lv)), gOk = gate.filter(([id]) => ovPassed(id, lv)).length;
  const mk = ((S.mock || {})[lv] || []).filter(r => r.pct != null), last2 = mk.slice(-2), mOk = last2.length === 2 && last2.every(r => r.pass) && dayOf(last2[1].at) !== dayOf(last2[0].at);
  const ext = extMin(lv) / 60, real = ((S.real || {})[rl] || []).some(realOk), te = teachRuns(rl), tOk = te.some(r => r.pct >= pass * 100);
  return [[gOk === gate.length && gate.length > 0, `🚪 Mọi phần qua Thi chuyển cấp ${LVN[lv]}`, `${gOk}/${gate.length} phần`],
    [mOk, '🎓 Đề thử cả đề đạt 2 lần liền, 2 ngày khác nhau', last2.length ? last2.map(r => r.pct + '%').join(', ') : 'chưa làm'],
    [ext >= EXT_H[lv], '📚 Đủ giờ đọc nghe thêm ngoài app', `${ext.toFixed(1)}/${EXT_H[lv]} giờ`],
    [real, `📝 Đề mẫu chính thức ${RD_EXAM[lv]} đạt`, real ? 'đạt' : 'chưa'],
    [tOk, '🗣 Nói thử với giáo viên thật, đạt', te.length ? te[te.length - 1].pct + '%' : 'chưa']]; }
function readyBox(lv) { if (!RD_EXAM[lv]) return ''; const cs = readyChecks(lv), n = cs.filter(c => c[0]).length, all = n === cs.length;
  return `<div class="box"><div class="row"><b>🎯 Sẵn sàng thi ${RD_EXAM[lv]}</b><span class="${all ? 'okc' : 'mute'}">${n}/${cs.length}</span></div>
    ${cs.map(([ok, t, d]) => `<p style="margin:4px 0">${ok ? '✅' : '⬜'} ${t} <span class="mute">· ${esc(d)}</span></p>`).join('')}
    <p class="mute" style="margin:6px 0 0">${all ? 'Đủ bằng chứng: có thể đăng ký thi thật.' : 'Đủ cả 5 mới nên đăng ký thi thật. Đề thử của app do AI soạn nên chưa đủ một mình; đề mẫu chính thức và giáo viên là hai bằng chứng độc lập.'}</p>
    <button class="chip" data-teach="${RD_REAL[lv] || lv}">✍️ Ghi điểm buổi nói với giáo viên</button></div>`; }
document.addEventListener('click', e => { const b = e.target.closest('[data-teach]'); if (!b) return; const lv = b.dataset.teach;
  const v = prompt('Giáo viên chấm phần Nói được bao nhiêu % (0–100)? Gợi ý: nhờ giáo viên chấm theo 4 tiêu chí Cambridge, mỗi tiêu chí 0–5, rồi đổi ra %.'); if (v == null) return;
  const pct = parseInt(v, 10); if (!(pct >= 0 && pct <= 100)) return alert('Số 0–100.'); teachRuns(lv).push({ at: Date.now(), pct }); S.t = Date.now(); save(); toast('Đã ghi.'); overview(curOvLv()); });
const curOvLv = () => (typeof OV_SEL !== 'undefined' && OV_SEL) || curLevel();

// ---------- ✍️ Chấm Viết 4 tiêu chí Cambridge ----------
// Đề thật chấm: Nội dung · Hoàn thành mục đích giao tiếp · Bố cục · Ngôn ngữ (mỗi tiêu chí 0–5). Máy đo gián tiếp:
//   Nội dung = đủ ý (từ khoá) · Mục đích = đúng độ dài + đúng văn phong (thư trang trọng không viết tắt, không từ suồng sã)
//   Bố cục = số đoạn + từ nối khác nhau · Ngôn ngữ = lỗi hay gặp của người Việt / 100 từ + câu phức + từ đúng cấp trở lên.
// Bộ bắt lỗi chỉ bắt lỗi chắc chắn sai (ít báo nhầm), không thay giáo viên.
const W_AUX = /^(does|did|do|will|would|can|could|should|must|may|might|to|let|make|makes|made|help|helps|helped|shall)$/i;
const W_ERR = [
  [/\b(you|we|they) am\b|\bi (is|are)\b/i, 'Chia sai “be”: I am, you / we / they are.'],
  [/\bi am agree\b|\b(am|is|are) agree\b/i, '“agree” là động từ: I agree (không có am).'],
  [/\b(can|could|must|should|will|would|may|might) to \w+/i, 'Sau can / must / should / will… không có “to”.'],
  [/\b(he|she|it) don't\b/i, 'Ngôi 3 số ít: doesn’t.'],
  [/\b(didn't|did not|doesn't|does not|don't|do not) (went|saw|came|ate|had|did|got|made|took|bought|was|were|gone|liked|wanted|played|goes|likes|wants|has)\b/i, 'Sau didn’t / doesn’t / don’t dùng động từ nguyên mẫu.'],
  [/\b(more|most) (better|worse|bigger|smaller|easier|harder|cheaper|best|worst|biggest|easiest)\b/i, 'So sánh kép sai: “more better” → “better”.'],
  [/\bsince (\d+|one|two|three|four|five|six|seven|eight|nine|ten|many|several|a few) (years|months|weeks|days|hours)\b/i, 'Khoảng thời gian dùng “for”: for three years.'],
  [/\b(make|makes|made|let|lets) (me|him|her|us|them|you) to \w+/i, 'make / let + người + động từ nguyên mẫu (không có “to”).'],
  [/\b(enjoy|enjoys|enjoyed|finish|finished|avoid|avoided|mind) to \w+/i, 'enjoy / finish / avoid / mind + V-ing.'],
  [/\b(discuss|discussed) about\b|\b(return|returned) back\b|\b(explain|explained) (me|him|her|us|them)\b/i, 'Thừa từ: discuss (không about), return (không back), explain sth to sb.'],
  [/\bin the other hand\b/i, 'Cụm đúng: “on the other hand”.'],
  [/\bdespite of\b/i, '“despite” không có “of” (hoặc dùng “in spite of”).'],
  [/\balthough\b[^.!?]*,\s*but\b/i, 'Không dùng although … but trong cùng một câu.'],
  [/\b(am|is|are) (go|eat|play|work|study|live|want|need|watch|visit|buy)\b/i, 'Thiếu -ing hoặc thừa “be”: I am going / I go.'],
  [/\b(very|so) (like|love|enjoy)\b/i, '“very like” sai: really like / like … very much.'],
  [/\b(a) (apple|orange|egg|hour|honest|idea|interesting|important|old|umbrella|elephant|English|exam|email|example|office|island|answer|accident)\b/i, 'Trước nguyên âm dùng “an”: an apple, an hour.'],
  [/\b(an) (book|car|house|dog|cat|university|uniform|european|one|year|day|man|woman|good|big|new|small|useful)\b/i, 'Trước phụ âm (hoặc âm /j/, /w/) dùng “a”: a book, a university.'],
  [/\bthe most \w+est\b/i, 'So sánh nhất kép: “the most biggest” → “the biggest”.'],
  [/\b(people|children|police) (is|was|has)\b/i, 'people / children / police là số nhiều: are, were, have.'],
  [/\b(every|each) (students|people|days|things|persons)\b/i, 'every / each + danh từ số ít.'],
  [/\b(informations|advices|furnitures|equipments|homeworks|knowledges|luggages)\b/i, 'Danh từ không đếm được không có -s: information, advice…'],
  [/(^|[.!?]\s+)i\b/, 'Chữ “I” luôn viết hoa.'],
];
// he / she / it + động từ nguyên mẫu (không có trợ động từ đứng trước) → thiếu -s
const W_3S = /\b(he|she|it)\s+(have|do|go|like|want|need|live|work|study|play|watch|make|take|get|know|think|say|come|look|feel)\b/gi;
function wErrors(t) { const out = []; for (const [re, m] of W_ERR) { const mm = t.match(re); if (mm) out.push([mm[0], m]); }
  for (const m of t.matchAll(W_3S)) { const before = t.slice(0, m.index).trim().split(/\s+/).pop() || ''; if (!W_AUX.test(before)) { out.push([m[0], 'Ngôi 3 số ít thêm -s / -es: he has, she goes.']); break; } }
  return out; }
const W_FORMAL = /trang trọng|báo cáo|đề xuất|khiếu nại|toà soạn/;
const W_LINK = ['and', 'but', 'because', 'so', 'then', 'also', 'although', 'however', 'for example', 'for instance', 'on the other hand', 'whereas', 'while', 'moreover', 'furthermore', 'in addition', 'as a result', 'therefore', 'firstly', 'secondly', 'finally', 'in conclusion', 'overall', 'nevertheless', 'despite', 'even though', 'unless', 'instead', 'meanwhile', 'consequently', 'on balance'];
const W_T = { a1: [1, 2, 2], a2: [1, 3, 4], b1: [3, 4, 8], b2: [3, 6, 12], c1: [4, 7, 16], c2: [4, 8, 20] };   // [đoạn, từ nối khác nhau, từ đúng cấp trở lên]
function wCrit(x, t, ideaRatio, lenOk) { const lv = x.lv, [tP, tL, tV] = W_T[lv] || W_T.b1, low = t.toLowerCase(), ws = kWords(t), cap = v => Math.max(0, Math.min(1, v));
  const errs = wErrors(t), per100 = errs.length / Math.max(1, ws.length) * 100;
  const formal = W_FORMAL.test(x.genre), contr = (t.match(/\b\w+'(s|re|ve|ll|d|t|m)\b/gi) || []).length, slang = /\b(gonna|wanna|gotta|guys|cheers|hey|stuff|kinda|yeah|ok|okay)\b/i.test(t);
  const reg = formal ? cap(1 - contr * 0.15 - (slang ? 0.4 : 0)) : 1;
  const paras = t.split(/\n\s*\n|\n(?=\s*[A-Z])/).filter(p => kWords(p).length >= 5).length, links = W_LINK.filter(l => new RegExp(`\\b${l}\\b`).test(low)).length;
  const sub = (low.match(/\b(because|although|which|who|that|when|if|while|whereas|unless|since|so that|even though)\b/g) || []).length, sents = Math.max(1, kSents(t).length);
  const lo = Math.max(0, LEVELS.indexOf(lv) - 2); WBY_W = WBY_W || Object.fromEntries(WORDS.map(w => [w.w.toLowerCase(), w]));
  const voc = new Set(ws.filter(w => { if (w.length < 4) return false; const L = xLvOf(w); return L && LEVELS.indexOf(L) >= lo; })).size;
  const C = [['Nội dung', ideaRatio], ['Mục đích giao tiếp', (lenOk ? 0.6 : 0.2) + 0.4 * reg], ['Bố cục', 0.5 * cap(paras / tP) + 0.5 * cap(links / tL)],
    ['Ngôn ngữ', 0.5 * cap(1 - per100 / 5) + 0.25 * cap(sub / sents / 0.5) + 0.25 * cap(voc / tV)]].map(([n, v]) => [n, Math.round(v * 100)]);
  return { C, pct: Math.round(C.reduce((s, c) => s + c[1], 0) / C.length), errs, d: { paras, tP, links, tL, voc, tV, contr: formal ? contr : null } }; }
// gắn vào bài Viết (luyện, thi chuyển cấp, đề thử): giữ cách tính đạt cũ (đủ ý + đúng dạng), thêm 4 tiêu chí và lỗi hay gặp
{ const base = kWrite; kWrite = x => { const q = base(x), chk = q.check;
  q.check = t => { const r = chk(t), ideas = (x.k || []).filter(Boolean), hit = ideas.filter(g => kHit(t, g)).length, wc = kWords(t).length;
    const w = wCrit(x, t, ideas.length ? hit / ideas.length : 1, wc >= x.min && wc <= x.max + 30); r.sc = w.pct / 100; r.crit = w.C;
    r.html += `<div class="box" style="margin-top:8px"><b>🧐 Chấm theo 4 tiêu chí Cambridge (máy đo gián tiếp): ${w.pct}%</b>${w.C.map(([n, v]) => `<p style="margin:2px 0">${n}: ${v}%</p>`).join('')}
      <p class="mute" style="margin:4px 0 0">${w.d.paras}/${w.d.tP} đoạn · ${w.d.links}/${w.d.tL} từ nối khác nhau · ${w.d.voc}/${w.d.tV} từ đúng cấp trở lên${w.d.contr ? ` · ${w.d.contr} chữ viết tắt (bài trang trọng nên viết đủ: do not, I am)` : ''}</p>
      ${w.errs.length ? `<p style="margin:6px 0 0"><b>Lỗi hay gặp (${w.errs.length}):</b></p>${w.errs.map(([s, m]) => `<p style="margin:2px 0">❌ “${esc(s)}” · ${esc(m)}</p>`).join('')}` : '<p class="mute" style="margin:6px 0 0">Không thấy lỗi hay gặp nào (máy chỉ bắt một số lỗi chắc chắn; không thay giáo viên).</p>'}</div>`;
    return r; }; return q; }; }

// ---------- 🧩 Đoạn văn khuyết câu (đề thật: B1 Đọc phần 4, B2 First phần 6, C1 Advanced phần 7, C2 Proficiency phần 6) ----------
// Lấy bài đọc của cấp, bỏ 3 câu (không lấy câu đầu / cuối, không liền nhau), thêm 1 câu nhiễu từ bài khác; mỗi chỗ trống chọn câu đúng. Đáp án duy nhất vì là câu gốc.
function mkGap(nTexts) { const P = KIT.doc, ls = mkKitLvs(P), its = shuf(P.items.filter(x => ls.includes(x.lv) && kSents(x.text).length >= 8)).slice(0, nTexts), out = [];
  for (const x of its) { const ss = kSents(x.text), idx = []; for (const i of shuf([...Array(ss.length - 2).keys()].map(i => i + 1))) if (idx.length < 3 && !idx.some(j => Math.abs(j - i) < 2)) idx.push(i);
    idx.sort((a, b) => a - b); const other = shuf(P.items.filter(y => y !== x && ls.includes(y.lv)))[0], extra = other ? shuf(kSents(other.text))[0] : null;
    const opts = shuf([...idx.map(i => ss[i]), ...(extra ? [extra] : [])]), shown = ss.map((s, i) => idx.includes(i) ? ` <b>[${idx.indexOf(i) + 1}]</b> ______ ` : s).join(' ');
    const head = `<div class="box"><b>${esc(x.title)}</b><p style="font-size:16px;line-height:1.6;margin:8px 0 0">${esc(shown).replace(/&lt;b&gt;\[(\d)\]&lt;\/b&gt;/g, '<b>[$1]</b>')}</p></div>`;
    idx.forEach((i, k) => out.push({ x, k: 'ct', kind: 'mc', head, q: `Câu nào điền vào chỗ trống [${k + 1}]?`, opts, a: ss[i] })); }
  return out; }
{ const ins = (lv, paper, label, n) => { const C = MOCK[lv]; if (C) C.papers[paper].parts.push([label, () => mkGap(n)]); };
  ins('b1', 0, 'Phần 4: đoạn văn khuyết câu', 1); ins('b2', 0, 'Phần 6: đoạn văn khuyết câu', 2); ins('c1', 0, 'Phần 7: đoạn văn khuyết câu', 2); ins('c2', 0, 'Phần 6: đoạn văn khuyết câu', 2); }
