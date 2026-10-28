// Kiểm tự động tiêu chí "xong" X1–X5 của docs/HOAN-THIEN.md cho Pre-A1 → C2. Chạy: node tools/test/run.mjs   (thoát mã 1 nếu có tiêu chí chưa đạt)
import { load } from './load.mjs';
const { run, ctx } = await load(); ctx.ALLMISS = !!process.env.ALL; ctx.LVS_ = process.env.LVS;
const R = await run(`(async () => {
  S = blank(); user = { id: 'test' }; await Promise.all([paLoad(), ...Object.values(KIT).map(kLoad)]); await loadEB(); await uLoad(); await capLoad();
  const out = [], add = (lv, id, ok, msg) => out.push({ lv, id, ok, msg });
  const Y = await (await fetch('content/cambridge-yle.json')).json(), low = s => s.toLowerCase();
  // từ không tính khi so với danh sách Cambridge: tên riêng, từ chỉ dành cho trẻ em / truyện tranh (người lớn học không cần)
  const KID = new Set('alien monster robot hippo jellyfish lizard crocodile giraffe zebra tiger polar bear donkey goat bee doll teddy hooray kiwi lime coconut mango pea meatballs lemonade candy fries chips board game skateboard skateboarding baseball cap badminton table tennis tennis racket rubber mat rug sand shell tick ugly silly oh dear bounce clap jungle kangaroo kitten puppy panda parrot penguin pirate circus clown funfair dolphin whale snail treasure tractor naughty hop skip roller skates roller skating ice skates ice skating comic comic book daisy crayon balloon helicopter hockey soccer gray store lorry wow astronaut beetle camel castle cave creature crown dinosaur eagle extinct fur furry nest octopus planet pyramid rocket sledge snowball snowboard snowboarding snowman spaceship swan tortoise x-ray flashlight pajamas pyjamas cookie costume fire engine fire fighter fire station pop music rock music cage bat net rock e-book film star pop star rainbow waterfall milkshake pancake grown-up dress up get undressed elevator player'.split(' ').concat(['polar bear','board game','baseball cap','table tennis','tennis racket','oh dear','comic book','film star','pop star','roller skates','roller skating','ice skates','ice skating','dress up','get undressed','fire engine','fire fighter','fire station','pop music','rock music']));
  const name = x => /^[a-z]+$/.test(x) && ['alex','alice','ann','anna','ben','bill','dan','eva','grace','hugo','jill','kim','lucy','mark','matt','may','nick','pat','sam','sue','tom','tony','charlie','clare','daisy','fred','jack','jane','jim','julia','lily','mary','paul','peter','sally','vicky','zoe','betty','david','emma','frank','george','harry','helen','holly','katy','michael','oliver','richard','robert','sarah','sophia','william','london'].includes(x);
  const lvw = {}; for (const w of WORDS) lvw[low(w.w)] = wLv(w);
  // biến thể coi như có: số nhiều, 'a lot' ~ 'a lot of', blond ~ blonde, café ~ cafe
  const has = (x, L) => { x = x.replace(/\\s+/g, ' ').normalize('NFD').replace(/[\\u0300-\\u036f]/g, ''); for (const f of [x, x.replace(/s$/, ''), x.replace(/es$/, ''), x + 's', x + ' of', x + 'e', x.replace(/^lots( of)?$/, 'a lot of')]) if (lvw[f] && LEVELS.indexOf(lvw[f]) <= LEVELS.indexOf(L)) return true; return false; };
  for (const [lv, list, nm] of [['pre', Y.starters, 'Starters'], ['a1', [...Y.starters, ...Y.movers], 'Starters + Movers'], ['a2p', [...Y.starters, ...Y.movers, ...Y.flyers], 'Starters + Movers + Flyers (A2 + A2+)']]) {
    const xs = [...new Set(list)].filter(x => !name(x) && !KID.has(x) && !/[()]/.test(x)), miss = xs.filter(x => !has(x, lv));
    add(lv, 'X3', 1 - miss.length / xs.length >= 0.85, \`phủ \${nm}: \${xs.length - miss.length}/\${xs.length} (\${Math.round((1 - miss.length / xs.length) * 100)}%)\${miss.length ? '; thiếu ' + miss.slice(0, ALLMISS ? 999 : 25).join(', ') + (miss.length > 25 && !ALLMISS ? '…' : '') : ''}\`); }
  for (const lv of (LVS_ ? LVS_.split(',') : ['pre', 'a1', 'a2', 'a2p', 'b1', 'b1p', 'b2', 'b2p', 'c1', 'c2'])) {
    // X1: các màn của mọi phần mở được
    const errs = []; const tryv = (n, f) => { try { f(); } catch (e) { errs.push(n + ': ' + e.message); } };
    tryv('home', () => home()); tryv('practiceMenu', () => practiceMenu()); for (const [k] of dimsAt(lv)) tryv('dimView ' + k, () => dimView(k));
    tryv('learn', () => learn(UNITS.find(u => u.lv === lv))); tryv('paView', () => paView());
    for (const P of Object.values(KIT)) if (P.lvs.includes(lv)) { tryv(P.id + ' view', () => kView(P.id)); tryv(P.id + ' learn', () => kLearn(P, kItems(P, lv)[0])); tryv(P.id + ' menu', () => kMenu(P)); tryv(P.id + ' exam', () => { const q = P.exam(lv); if (!q.length) throw new Error('đề rỗng'); }); }
    tryv('overview', () => overview(lv)); tryv('uoeView', () => uoeView(lv));
    add(lv, 'X1', !errs.length, errs.length ? errs.slice(0, 5).join(' | ') : 'mọi màn mở được, mọi phần có đề thi');
    // X2: mỗi yêu cầu Nhớ của Từ vựng có dạng câu trong bài học
    const taught = new Set(UNITS.filter(u => u.lv === lv).flatMap(u => u.words.flatMap(w => lessonTypes(w, reqsUpTo(lv)).flatMap(t => DIM_OF[t] || [])))); taught.add('noi');
    const untaught = dimsAt(lv).map(d => d[0]).filter(k => !taught.has(k) && WORDS.some(w => wLv(w) === lv && VREQ_BY[k][3](w)));
    add(lv, 'X2', !untaught.length, untaught.length ? 'yêu cầu chưa được dạy trong bài học: ' + untaught.join(', ') : \`\${dimsAt(lv).length} yêu cầu Từ vựng đều được dạy\`);
    // X4: câu thi đúng cấp
    XLV = lv; const ws = levelWords(lv).filter(w => EB[w.id]); let over = 0, tot = 0; const ex = new Set();
    for (const w of ws) for (const t of (EB[w.id].s.toLowerCase().match(/[a-z']+/g) || [])) { tot++; const l = lvw[t]; if (l && LEVELS.indexOf(l) > LEVELS.indexOf(lv) + (['pre', 'a1'].includes(lv) ? 0 : 1)) { over++; ex.add(t); } }
    const clip = ws.filter(w => xClipOk(EB[w.id].l)).length, noEB = levelWords(lv).length - ws.length;
    add(lv, 'X4', over / tot <= 0.05 && !noEB && (!['pre', 'a1'].includes(lv) || !clip), \`từ vượt cấp trong câu thi \${(over / tot * 100).toFixed(1)}% (\${[...ex].slice(0, 12).join(', ')}); từ thiếu câu thi \${noEB}; câu nghe thu sẵn \${clip}\`);
    // X5: câu hỏi hợp lệ (Từ vựng mọi dạng; Ngữ pháp, Đọc, Nghe: trắc nghiệm của đề thi)
    const bad = [];
    for (const w of levelWords(lv)) for (const t of ['w2vi', 'listen', 'form', 'spell', 'clozeT', 'col', 'irrR', 'irrT', 'rel', 's2', 'colT', 'pat', 'fam', 'famQ', 'reg', 'style', 'synT', 'fast', 'idi']) { const q = questionX(w, t) || question(w, t);
      if (q.opts && (!q.opts.includes(q.a) || new Set(q.opts.map(low)).size !== q.opts.length || q.opts.length < 3)) bad.push(t + ':' + w.w); }
    for (const w of ws) for (const t of ['xT', 'xN', 'xL', 'xF', 'xC', 'xR', 'xS', 'xG', 'xI', 'xCT', 'xP', 'xH', 'xD', 'xRg', 'xY', 'xV', 'xId']) { if (X_Q[t] && !X_Q[t][1](w)) continue; const q = examQ(w, t); if (q.opts && !q.opts.includes(q.a)) bad.push(t + ':' + w.w); if (q.type === 'xT' && !q.top.includes('_____')) bad.push('xT trống:' + w.w); }
    for (const P of Object.values(KIT)) if (P.lvs.includes(lv)) for (let r = 0; r < 3; r++) for (const q of P.exam(lv)) if (q.opts && q.a != null && !q.opts.includes(q.a)) bad.push(P.id + ':' + (q.x && q.x.id));
    // bài mẫu tự qua luật chấm của chính nó: 🗣 đề nói (đủ ý, đủ từ), 💬 câu mẫu đóng vai, ✍️ bài mẫu viết
    for (const x of kItems(KIT.noi, lv)) { if (x.type === 'rp') { for (const v of [...x.learn, ...x.tests]) for (const st of v) if (!st.s && !kNeedOk(st.need, st.t)) bad.push('rp:' + x.id + ':' + st.t.slice(0, 30)); }
      else if (!kTalk(x).check(x.m).ok) bad.push('nói mẫu:' + x.id); }
    for (const x of kItems(KIT.viet, lv)) if (!kWrite(x).check(kModel(x)).ok) bad.push('viết mẫu:' + x.id);
    // 🎓 đề thử kiểu Cambridge: mọi phần sinh được câu, câu hợp lệ
    if (MOCK[lv]) { MK = { lv, C: MOCK[lv] }; for (const P of MOCK[lv].papers) for (const [t, g] of P.parts) { const qs = g(); if (!qs.length) bad.push('đề thử trống:' + t);
      for (const q of qs) if ((q.kind === 'mc' && !q.opts.includes(q.a)) || (q.kind === 'type' && !q.check && !(q.acc && q.acc[0]))) bad.push('đề thử:' + t);
      // 🗣 Nói: trả lời đúng câu mẫu (nhắc lại = câu gốc, đóng vai = câu mẫu, nói dài = bài mẫu) phải ≥ 60% ở ②③④; im lặng phải < 10%
      if (P.speak) { const r = qs.map(it => ({ ...it, ans: it.q.mode === 'eit' ? it.q.s : it.q.mode === 'rp' ? it.q.st.t : it.q.mode === 'talk' ? it.q.x.m : '', secs: 30, lat: 1 })), z = mkSpeakScore(qs.map(it => ({ ...it, ans: '', secs: 5, lat: 99 })), lv);
        const s = mkSpeakScore(r, lv); if (s.C[2][1] < 60 || s.C[3][1] < 60 || z.pct >= 10) bad.push('chấm Nói lệch:' + JSON.stringify(s.C) + ' im lặng ' + z.pct); } } }
    // 🧩 dạng đề thật (uoe.js): mọi bài sinh câu hợp lệ; đáp án viết lại câu qua bộ chấm (cả khi gõ nguyên câu)
    if (LEVELS.indexOf(lv) >= LEVELS.indexOf('b1')) { const ls = uLvs(lv); for (const k of Object.keys(U_T)) for (const x of uItems(k, ls)) { const qs = k === 'kwt' ? [uKwtQ(x)] : uQs(k, x); if (!qs.length) bad.push('uoe trống:' + x.id);
      for (const q of qs) { if (q.kind === 'mc' && (!q.opts.includes(q.a) || new Set(q.opts).size !== q.opts.length)) bad.push('uoe mc:' + x.id); if (q.kind === 'type' && !(q.acc && q.acc[0])) bad.push('uoe type:' + x.id); if (q.kind === 'write' && !q.check) bad.push('uoe write:' + x.id); }
      if (x.gaps) x.gaps.forEach((g, i) => { if (!uSent(x, i + 1, k).includes('<mark')) bad.push('uoe không tách được câu:' + x.id + ' (' + (i + 1) + ')'); });
      if (k === 'sum') { const q = uSumQ(x), m = kModel(x), r = q.check(m); if (!r.ok || r.sc < 0.8 || wErrors(m).length) bad.push('uoe tóm tắt mẫu chưa qua:' + x.id + ' ' + Math.round((r.sc || 0) * 100) + '% ' + wErrors(m).map(e => e[0]).join('|')); }
      if (k === 'kwt') for (const a of x.a) if (!uKwtQ(x).check(a).ok || !uKwtQ(x).check(x.s2.replace('____', a)).ok || uKwtQ(x).check('x').ok) bad.push('uoe kwt chấm sai:' + x.id); } }
    // 🎧 nghe điền thông tin (nghe2.js): đủ bài, chỗ trống tìm thấy trong câu, đáp án qua bộ chấm (cả dạng số)
    if (LEVELS.indexOf(lv) >= LEVELS.indexOf('a2')) { const its = ngItems(ngLvs(lv).slice(0, 1)); if (its.length < 3) bad.push('nghe điền: ít bài ' + its.length);
      for (const x of its) for (const q of ngQs(x)) { const g = ngForm(x).find(g => g.t === q.a); if (!ngBlank(g.s, g.t, '§').includes('§') || !q.check(q.a).ok || q.check('zzz').ok) bad.push('nghe điền:' + x.id + ':' + q.a); }
      if (!ngQs({ id: 't', text: 'The tour costs twenty-five dollars per person today. The bus leaves at 9:30 from the station. Our guide today is called Marta and she is lovely.' }).every(q => q.check(q.a).ok) || ngNum('twenty-five') !== 25 || ngNum('two hundred') !== 200) bad.push('nghe điền: đọc số sai'); }
    // 👥 nói theo cặp (cap.js): đủ đề; câu trả lời mẫu tốt phải đạt, câu cụt phải trượt; lời bạn thi có giọng tự nhiên
    if (LEVELS.indexOf(lv) >= LEVELS.indexOf('a2')) { const ts = capTasks(lv); if (ts.length < 3) bad.push('nói cặp: ít đề ' + ts.length); tryv('capView', () => capView(lv));
      const good = "I agree with you, because it is cheap and everybody can enjoy it together with friends at the weekend. What do you think about the other one?", fin = "Yes, I see what you mean, but I think we should choose the first one, because it is the most useful for everyone in our class and not expensive.";
      const g = capScore([good, good, fin], lv), z = capScore(['yes', 'no'], lv); if (['a2', 'b1'].includes(lv) && g.pct < 90) bad.push('nói cặp: câu mẫu chỉ ' + g.pct + '%'); if (z.pct >= 50) bad.push('nói cặp: câu cụt ' + z.pct + '%');
      for (const x of ts) for (const t of [x.open, ...x.turns, x.decide, ...CAP.react[x.lv]]) if (!NCLIPS.has(clipKey(t))) bad.push('nói cặp thiếu giọng: ' + x.id); }
    // 📚 thư viện (lib.js): mở được; mỗi truyện có trang; tra được từ thường gặp (kể cả dạng bất quy tắc)
    if (lv === 'b2') { await libLoad(); await loadRef(); tryv('libView', () => libView(lv)); if (LIB.books.length < 20) bad.push('thư viện: ít truyện');
      for (const x of LIB.books) { const B = await libBook(x.id); if (!B.pages.length || B.pages.some(p => !p.length)) bad.push('thư viện trang rỗng: ' + x.id); }
      for (const t of ['walked', 'children', 'went', 'happier', 'stories']) if (!libFind(t)) bad.push('thư viện không tra được: ' + t); }
    // 🎧 giọng tự nhiên (n/, tools/build-audio.py): mọi dòng hội thoại và mọi câu bài nghe của cấp phải có tệp; thiếu thì chạy lại build-audio.py
    { if (!NCLIPS.size) try { NCLIPS = new Set(await (await fetch('n/index.json')).json()); } catch (e) {} const miss = []; for (const x of KIT.nghe.items.filter(x => x.lv === lv)) for (const t of (x.lines ? x.lines.flatMap(l => [l[1], ...kSents(l[1])]) : kSents(x.text))) if (!NCLIPS.has(clipKey(t))) miss.push(x.id);
      if (miss.length) bad.push('thiếu giọng tự nhiên: ' + [...new Set(miss)].slice(0, 5).join(', ') + ' (' + miss.length + ' câu)'); }
    // ✍️ chấm Viết 4 tiêu chí (thi.js): bài mẫu không bị báo lỗi, ≥ 80%; bài cố tình sai phải bị bắt
    for (const x of kItems(KIT.viet, lv)) { const m = kModel(x), r = kWrite(x).check(m); if (wErrors(m).length) bad.push('viết mẫu bị báo lỗi:' + x.id + ' ' + wErrors(m).map(e => e[0]).join('|')); if (r.sc < 0.8) bad.push('viết mẫu < 80%:' + x.id + ' ' + Math.round(r.sc * 100)); }
    if (lv === 'pre' && wErrors("i am agree. He don't like it. I can to swim since three years.").length < 4) bad.push('bộ bắt lỗi Viết không bắt được lỗi');
    add(lv, 'X5', !bad.length, bad.length ? bad.length + ' lỗi: ' + [...new Set(bad)].slice(0, 10).join(', ') : 'mọi câu hợp lệ');
  }
  // 🌏 Học IELTS (ielts.js): màn mở được; đề thử mọi bài sinh câu hợp lệ (Academic + General Training); bài mẫu Viết máy ước ≥ 6.0, bài rác ≤ 4.5;
  // bài nói mẫu ≥ 5.5, im lặng không chấm; bảng quy đổi điểm thô → band và cách làm tròn đúng quy ước IELTS
  { const bad = [], errs = [], tryv = (n, f) => { try { f(); } catch (e) { errs.push(n + ': ' + e.message); } }; await ieLoad(); delete S.ie;
    for (const ty of ['ac', 'gt']) { ieSt().type = ty; await ieltsView(); if (!String($app.innerHTML).includes('Học IELTS')) bad.push('màn IELTS ' + ty);
      for (const P of IE_PAPERS) { let qs = []; tryv('đề ' + ty + ' ' + P.k, () => { qs = P.gen(); }); if (!qs.length) bad.push('đề thử trống: ' + ty + ' ' + P.k);
        for (const it of qs) { const q = it.q; if (!it.part || !q) { bad.push('câu thiếu phần: ' + P.k); continue; }
          if (q.kind === 'mc' && (!q.opts.includes(q.a) || new Set(q.opts).size !== q.opts.length)) bad.push('mc hỏng: ' + P.k + ' ' + q.q);
          if (q.kind === 'type' && !q.check && !(q.acc && q.acc[0])) bad.push('type thiếu đáp án: ' + P.k);
          if (q.kind === 'write' && !q.check) bad.push('viết thiếu bộ chấm');
          if (P.k === 'L' && !q.play) bad.push('nghe thiếu bài phát'); } } }
    for (const x of IE.doc) { const qs = ieRQs(x); if (qs.length < 14) bad.push('bài đọc ít câu: ' + x.id);
      for (const q of qs.filter(q => q.k === 'comp')) if (!q.acc.every(a => x.paras.join(' ').toLowerCase().includes(a.toLowerCase()))) bad.push('đáp án điền không có trong bài: ' + x.id); }
    for (const [task, its] of [['t1', IE.t1], ['gt1', IE.gt1], ['t2', IE.t2]]) for (const x of its) { tryv('đầu đề ' + x.id, () => ieWHead(task, x));
      if (x.m) { const r = ieWScore(task, x, x.m); if (r.band < 6) bad.push('viết mẫu máy ước thấp: ' + x.id + ' ' + r.band + ' ' + JSON.stringify(r.C) + ' thiếu: ' + r.f.filter(f => !f[1]).map(f => f[0]).join('; '));
        if (wErrors(x.m).length) bad.push('viết mẫu bị báo lỗi: ' + x.id + ' ' + wErrors(x.m).map(e => e[0]).join('|')); } }
    const junk = Array(30).fill('I like it. It is good. People like it too.').join(' '), jr = ieWScore('t2', IE.t2[0], junk); if (jr.band > 4.5) bad.push('bài rác máy ước quá cao: ' + jr.band);
    if (ieWScore('t2', IE.t2[0], 'Too short.').band !== 0) bad.push('bài quá ngắn vẫn chấm');
    const card = IE.p2.find(x => x.m), p1 = 'Well, I live in a small flat in the city centre with my sister, and I really like it because it is close to my office and there are lots of cafes nearby.';
    const p3 = 'In my opinion, people who are famous should behave well, because many young people see them as role models. However, I think they also deserve some privacy, so the media should not follow them everywhere.';
    const good = ieSScore([...[1, 2, 3, 4].map(() => ({ q: { mode: 'p1' }, ans: p1, secs: 14, lat: 1 })), { q: { mode: 'p2' }, ans: card.m, secs: 110, lat: 2 }, ...[1, 2, 3].map(() => ({ q: { mode: 'p3' }, ans: p3, secs: 22, lat: 2 }))]);
    if (good.band < 5.5) bad.push('nói mẫu máy ước thấp: ' + good.band + ' ' + JSON.stringify(good.C)); if (ieSScore([{ q: { mode: 'p1' }, ans: '', secs: 5, lat: 99 }]).band !== 0) bad.push('im lặng vẫn chấm');
    if (ieRaw(IE_L, 30, 40) !== 7 || ieRaw(IE_L, 23, 40) !== 6 || ieRaw(IE_RA, 27, 40) !== 6.5 || ieRaw(IE_RG, 34, 40) !== 7 || ieRaw(IE_RG, 30, 40) !== 6 || ieRound(6.25) !== 6.5 || ieRound(6.125) !== 6 || ieRound(6.75) !== 7) bad.push('quy đổi band sai');
    // kết quả đề thử: 4 bài, mỗi bài đúng một nửa → Overall ra số
    MK = { idx: [0, 1, 2, 3], C: { name: 'IELTS thử' }, papers: [{ t: 'L', k: 'L', res: [...Array(20)].map((_, i) => ({ part: 'p', q: { q: 'q', a: 'a' }, ok: i % 2 === 0, ans: 'x' })) },
      { t: 'R', k: 'R', res: [...Array(20)].map((_, i) => ({ part: 'p', q: { q: 'q', a: 'a' }, ok: i % 2 === 0, ans: 'x' })) }, { t: 'W', k: 'W', res: [{ part: 'T1', q: ieWQ('t1', IE.t1[0]), sc: 6 / 9, ans: IE.t1[0].m }, { part: 'T2', q: ieWQ('t2', IE.t2[0]), sc: 6 / 9, ans: IE.t2[0].m }] },
      { t: 'S', k: 'S', res: [{ part: 'p2', q: { mode: 'p2', q: card.t }, ans: card.m, secs: 110, lat: 2 }] }] };
    tryv('kết quả đề thử', () => ieMockResult()); const last = S.ie.mock[S.ie.mock.length - 1]; if (!last || last.all == null || last.b.W !== 6) bad.push('kết quả đề thử IELTS sai: ' + JSON.stringify(last));
    tryv('sẵn sàng thi', () => ieReady()); tryv('band hiện tại', () => ieNow());
    // 📒 Sổ lỗi (soloi.js): thêm, không trùng, đếm lỗi lặp lại; sửa đúng / sai; hộp Leitner giãn ngày; màn ôn mở được
    delete S.err; const e1 = errAdd([{ wrong: 'I am agree with this', correct: 'I agree with this', why_vi: 'agree là động từ' }, { wrong: 'x', correct: 'x' }], 't');
    const e2 = errAdd([{ wrong: 'I am agree with this.', correct: 'I agree with this', why_vi: '' }], 't'), x0 = S.err[0];
    if (e1.n !== 1 || e2.rep !== 1 || S.err.length !== 1 || x0.rep !== 1) bad.push('sổ lỗi thêm / đếm lặp sai: ' + JSON.stringify([e1, e2, S.err.length]));
    if (!errOk(x0, 'I agree with this.') || errOk(x0, 'I am agree with this') || errDue().length !== 1) bad.push('sổ lỗi chấm sửa sai');
    tryv('ôn sổ lỗi', () => errRun('ie')); tryv('ô sổ lỗi', () => errBox('ov'));
    // 📏 hiệu chuẩn: đề thật cao hơn đề thử app 1 band → band ước Nghe tăng 1; AI chấm Viết thấp hơn máy 0,5 → Viết giảm 0,5
    S.ie.mock = [{ at: Date.now() - 864e5, type: 'ac', b: { L: 6, R: 6, W: 6, S: 6 }, all: 6 }]; S.ie.off = [{ at: Date.now(), rl: 30, rr: 23, L: 7, R: 6 }];
    S.ai = [{ at: Date.now(), kind: 'viet', lv: 'ielts-ac', band: 5.5, mb: 6 }]; const nw = ieNow();
    if (nw.b.L !== 7 || nw.b.R !== 6 || nw.b.W !== 5.5 || nw.b.S !== 6 || !nw.cal.L || nw.cal.S) bad.push('hiệu chuẩn sai: ' + JSON.stringify(nw));
    S.ie.off.push({ at: Date.now() - 40 * 864e5, L: 9, R: 9 }); if (ieNow().b.L !== 7) bad.push('hiệu chuẩn lấy cả đề thật quá 14 ngày');
    tryv('viết lại', () => ieWrite('t2', IE.t2[0], IE.t2[0].m)); await ieltsView(); if (!String($app.innerHTML).includes('đã chỉnh')) bad.push('màn IELTS không hiện hiệu chuẩn');
    // v70: chép đề không tính từ; kế hoạch + nên làm hôm nay; dán lỗi giáo viên; gửi giáo viên; cách làm từng dạng
    const cp = ieWScore('t2', IE.t2[0], IE.t2[0].p + ' ' + IE.t2[0].p + ' ' + IE.t2[0].m); if (cp.cp < 30 || cp.f.find(f => /chép/.test(f[0]))[1]) bad.push('không phát hiện chép đề: ' + cp.cp);
    S.ie.date = new Date(Date.now() + 70 * 864e5).toISOString().slice(0, 10); const pl = iePlan(); if (pl.wk !== 10 || Object.values(pl.hrs).some(h => !(h > 0))) bad.push('kế hoạch sai: ' + JSON.stringify(pl));
    const td = ieToday(); if (!/^data-/.test(td[0]) || !td[1]) bad.push('nên làm hôm nay sai'); tryv('ô kế hoạch', () => iePlanBox());
    const ps = errParse('1. I am agree => I agree | agree là động từ\\nHe go → He goes\\nkhông phải dòng lỗi'); if (ps.length !== 2 || ps[0].wrong !== 'I am agree' || ps[0].why_vi !== 'agree là động từ' || ps[1].correct !== 'He goes') bad.push('đọc lỗi giáo viên sai: ' + JSON.stringify(ps));
    tryv('dán lỗi', () => errPaste('ie')); if (!/data-ieshare/.test(ieShareBtn('t', 'p', 'x'))) bad.push('nút gửi giáo viên'); tryv('cách làm', () => ieHow(Object.keys(IE_HOW)));
    S.ie.tw = [{ at: Date.now(), band: 5 }]; S.ie.w = [{ at: Date.now() - 864e5, id: 'x', task: 't2', band: 6 }]; if (!ieCal().W || ieReady()[2][2].indexOf('5.0') < 0) bad.push('band giáo viên không vào hiệu chuẩn / sẵn sàng thi');
    add('ielts', 'I1', !bad.length && !errs.length, [...errs, ...bad].length ? [...errs, ...new Set(bad)].slice(0, 10).join(' | ') : 'màn, đề thử Academic + General Training, chấm Viết / Nói, quy đổi band đều đúng'); }
  // 💼 TOEIC (toeic.js): màn mở được; mọi Part sinh câu hợp lệ; đề thử ra điểm; quy đổi ước, mốc CEFR, hiệu chỉnh đề thật; từ vựng Leitner; mọi câu nghe / từ có giọng (n/)
  { const bad = [], errs = [], tryv = (n, f) => { try { f(); } catch (e) { errs.push(n + ': ' + e.message); } }; await toLoad(); delete S.to;
    await toeicView(); if (!String($app.innerHTML).includes('Luyện TOEIC') || !String($app.innerHTML).includes('data-exsel')) bad.push('màn TOEIC');
    for (const k of Object.keys(toGen)) { let qs = []; tryv('sinh ' + k, () => { qs = toGen[k](99); }); if (!qs.length) bad.push('Part trống: ' + k);
      for (const q of qs) { if (q.kind !== 'mc' || !q.opts.includes(q.a) || new Set(q.opts).size !== q.opts.length) bad.push('câu hỏng: ' + k + ' ' + (q.x && q.x.id)); if (['p2', 'p3', 'p4'].includes(k) && !q.play) bad.push('nghe thiếu bài phát: ' + q.x.id); } }
    for (const P of TO_PAPERS) { const qs = P.gen(); if (qs.length < 20 || qs.some(it => !it.part || !it.q)) bad.push('đề thử ' + P.k + ': ' + qs.length + ' câu'); }
    MK = { idx: [0, 1], C: { name: 'TOEIC thử' }, papers: [{ t: 'L', k: 'L', res: [...Array(20)].map((_, i) => ({ part: 'p', q: { q: 'q', a: 'a' }, ok: i < 15, ans: 'x' })) }, { t: 'R', k: 'R', res: [...Array(20)].map((_, i) => ({ part: 'p', q: { q: 'q', a: 'a' }, ok: i < 10, ans: 'x' })) }] };
    tryv('kết quả đề thử', () => toMockResult()); const lm = S.to.mock[S.to.mock.length - 1]; if (!lm || lm.b.L !== 375 || lm.b.R !== 250 || lm.tot !== 625) bad.push('điểm đề thử sai: ' + JSON.stringify(lm));
    if (toScale(0, 10) !== 5 || toScale(10, 10) !== 495 || toCefr('L', 400) !== 'b2' || toCefr('R', 454) !== 'b2' || toCefr('R', 455) !== 'c1' || toBase(800) !== 'b2' || toBase(550) !== 'b1') bad.push('quy đổi / mốc CEFR sai');
    S.to.off = [{ at: Date.now(), L: 420, R: 300 }]; const nw = toNow(); if (nw.b.L !== 420 || nw.b.R !== 300 || nw.tot !== 720 || !nw.cal.L) bad.push('hiệu chỉnh TOEIC sai: ' + JSON.stringify(nw));
    tryv('sẵn sàng', () => toReady()); tryv('hôm nay', () => toToday()); tryv('từ vựng', () => toVocRun('office')); if (toToday()[0].indexOf('data-') !== 0) bad.push('nên làm hôm nay sai');
    S.to.voc = { deadline: { box: 2, due: 0 } }; if (toVocDue().length !== 1) bad.push('từ đến hạn sai');
    if (!NCLIPS.size) try { NCLIPS = new Set(await (await fetch('n/index.json')).json()); } catch (e) {}
    const miss = [...TO.p2.flatMap(x => x.lines.map(l => l[1])), ...TO.p3.flatMap(x => x.lines.map(l => l[1])), ...TO.p4.flatMap(x => kSents(x.text)), ...TO.voc.flatMap(t => t.w.flatMap(w => [w[0], w[2]]))].filter(t => !NCLIPS.has(clipKey(t)));
    if (miss.length) bad.push('thiếu giọng (chạy tools/build-audio.py): ' + miss.length + ' câu, vd. ' + miss.slice(0, 2).join(' | '));
    S.exSel = 'ielts'; tryv('chuyển IELTS', () => exOpen()); S.exSel = 'toeic';
    // v73: Part 5 theo dạng, bẫy Part 2, nơi tăng điểm, tốc độ, ngày thi
    const tg = toTagAcc(); if (tg.length !== 7 || tg.reduce((t, x) => t + x.tot, 0) !== TO.p5.length) bad.push('dạng Part 5 sai');
    const p2 = TO.p2.find(x => x.a !== 0), q2 = toP2Q(p2); if (!/❌/.test(q2.why) || !p2.tr || p2.tr[p2.a] !== null) bad.push('bẫy Part 2 thiếu');
    S.to.trap = {}; toTrapLog([{ q: q2, ok: false, ans: 'A' }]); if (S.to.trap[p2.tr[0]] !== 1) bad.push('đếm bẫy sai: ' + JSON.stringify(S.to.trap));
    S.to.r = { a: { at: 1, ok: 1, n: 10, k: 'p7' }, b: { at: 1, ok: 9, n: 10, k: 'p5' } }; const gn = toGain(); if (gn[0].s !== 'p7' || gn[0].g !== 55 || gn[1].g !== 15) bad.push('tăng điểm sai: ' + JSON.stringify(gn));
    tryv('tốc độ', () => toSpeed('p5')); tryv('tốc độ p7', () => toSpeed('p7')); S.to.date = new Date(Date.now() + 21 * 864e5).toISOString().slice(0, 10); if (!/Còn <b>3 tuần/.test(toInsights())) bad.push('ngày thi sai');
    S.to.r = {}; for (const x of TO.p5.filter(x => x.t === 'prep')) S.to.r[x.id] = { at: 1, ok: 0, n: 1, k: 'p5' }; for (const x of TO.p5.filter(x => x.t !== 'prep')) S.to.r[x.id] = { at: 1, ok: 1, n: 1, k: 'p5' };
    for (const k of ['p2', 'p3', 'p4', 'p6', 'p7']) S.to.r['z' + k] = { at: 1, ok: 5, n: 5, k };
    S.to.voc = {}; const td = toToday(); if (td[0] !== 'data-top="t:prep"') bad.push('nên làm hôm nay không chỉ dạng yếu: ' + td[0]);
    add('toeic', 'T1', !bad.length && !errs.length, [...errs, ...bad].length ? [...errs, ...new Set(bad)].slice(0, 8).join(' | ') : 'màn, 6 Part, đề thử, quy đổi ước, mốc CEFR, hiệu chỉnh, từ vựng, giọng đọc đều đúng'); }
  return out; })()`);
let fail = 0; for (const r of R) { if (!r.ok) fail++; console.log(`${r.ok ? '✅' : '❌'} ${r.lv.padEnd(3)} ${r.id}  ${r.msg}`); }
console.log(fail ? `\n${fail} tiêu chí chưa đạt` : '\nĐạt hết'); process.exit(fail ? 1 : 0);
