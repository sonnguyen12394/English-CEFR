// Kiểm tự động tiêu chí "xong" X1–X5 của docs/HOAN-THIEN.md cho Pre-A1 → C2. Chạy: node tools/test/run.mjs   (thoát mã 1 nếu có tiêu chí chưa đạt)
import { load } from './load.mjs';
const { run, ctx } = await load(); ctx.ALLMISS = !!process.env.ALL; ctx.LVS_ = process.env.LVS;
ctx.IDX_ = (await import('node:fs')).readFileSync(new URL('../../index.html', import.meta.url), 'utf8');   // v95: kiểm nhãn thanh dưới
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
    // v101: bài học dạy bậc 1 (nhận ra), bậc 2–4 hỏi dần trong luyện tập: mỗi yêu cầu cần có dạng câu ở bài học HOẶC ở luyện tập (TYPE_FOR)
    for (const k of Object.keys(TYPE_FOR)) if ((DIM_OF[TYPE_FOR[k](null, null)] || []).includes(k)) taught.add(k);
    const untaught = dimsAt(lv).map(d => d[0]).filter(k => !taught.has(k) && WORDS.some(w => wLv(w) === lv && VREQ_BY[k][3](w)));
    add(lv, 'X2', !untaught.length, untaught.length ? 'yêu cầu chưa có dạng câu (bài học / luyện tập): ' + untaught.join(', ') : \`\${dimsAt(lv).length} yêu cầu Từ vựng đều có dạng câu (bài học bậc 1, luyện tập bậc 2–4)\`);
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
    S.ie.date = new Date(Date.now() + 70 * 864e5).toISOString().slice(0, 10); const pl = iePlan(); if (![10, 11].includes(pl.wk) || Object.values(pl.hrs).some(h => !(h > 0))) bad.push('kế hoạch sai: ' + JSON.stringify(pl));
    const td = ieToday(); if (!/^data-/.test(td[0]) || !td[1]) bad.push('nên làm hôm nay sai'); tryv('ô kế hoạch', () => iePlanBox());
    const ps = errParse('1. I am agree => I agree | agree là động từ\\nHe go → He goes\\nkhông phải dòng lỗi'); if (ps.length !== 2 || ps[0].wrong !== 'I am agree' || ps[0].why_vi !== 'agree là động từ' || ps[1].correct !== 'He goes') bad.push('đọc lỗi giáo viên sai: ' + JSON.stringify(ps));
    tryv('dán lỗi', () => errPaste('ie')); if (!/data-ieshare/.test(ieShareBtn('t', 'p', 'x'))) bad.push('nút gửi giáo viên'); tryv('cách làm', () => ieHow(Object.keys(IE_HOW)));
    S.ie.tw = [{ at: Date.now(), band: 5 }]; S.ie.w = [{ at: Date.now() - 864e5, id: 'x', task: 't2', band: 6 }]; if (!ieCal().W || ieReady()[2][2].indexOf('5.0') < 0) bad.push('band giáo viên không vào hiệu chuẩn / sẵn sàng thi');
    add('ielts', 'I1', !bad.length && !errs.length, [...errs, ...bad].length ? [...errs, ...new Set(bad)].slice(0, 10).join(' | ') : 'màn, đề thử Academic + General Training, chấm Viết / Nói, quy đổi band đều đúng'); }
  // 📊 IELTS bước 1 (v82): ghi theo dạng câu (Đọc / Nghe) + tiêu chí (Viết / Nói), máy và AI tách riêng; đề thử hiện bảng theo dạng
  { const bad = [], errs = [], tryv = (n, f) => { try { f(); } catch (e) { errs.push(n + ': ' + e.message); } }; S = blank(); await ieLoad(); await kLoad(KIT.nghe); await kLoad(KIT.doc);
    const qs = [...ieRQs(IE.doc[0]), ...ieRQs(IE.doc[1])], lq = ieListen(); if (qs.some(q => !IE_TY[q.ty])) bad.push('câu Đọc thiếu dạng'); if (!lq.length || lq.some(it => !IE_TY[it.q.ty])) bad.push('câu Nghe thiếu dạng');
    const by = ieTyLog(qs.map(q => ({ q, ok: q.ty === 'R-tf' })), 'luyen'), st = ieTyStats().ty, tf = st.find(t => t.k === 'R-tf'), h = st.find(t => t.k === 'R-h');
    if (!by['R-tf'] || tf.pct !== 100 || tf.items !== 2 || tf.sure !== (tf.n >= IE_TY_N) || h.pct !== 0) bad.push('thống kê theo dạng sai: ' + JSON.stringify([tf, h]));
    const x = IE.t2[0]; ieCrLog('W', 't2', ieWScore('t2', x, x.m).C, 'may'); ieCrLog('W', null, [6, 6, 7, 5], 'ai'); const cr = ieTyStats().cr;
    const ai = cr.find(c => c.k === 'W' && c.src === 'ai'), my = cr.find(c => c.k === 'W' && c.src === 'may'); if (!ai || ai.c.join() !== '6,6,7,5' || !my || !my.c || my.c.length !== 4) bad.push('tiêu chí Viết sai');
    MK = { idx: [1], C: { name: 'IELTS thử' }, papers: [{ t: 'R', k: 'R', res: qs.map((q, j) => ({ part: 'p', q, ok: j % 2 === 0, ans: 'x' })) }] }; tryv('đề thử theo dạng', () => ieMockResult());
    if (!String($app.innerHTML).includes('Theo dạng câu (đề này)')) bad.push('kết quả đề thử thiếu bảng theo dạng');
    await ieltsView(); if (!String($app.innerHTML).includes('📊 Theo dạng câu')) bad.push('Học IELTS thiếu ô theo dạng');
    add('ielts', 'I2', !bad.length && !errs.length, [...errs, ...bad].length ? [...errs, ...bad].slice(0, 6).join(' | ') : 'ghi theo dạng câu + tiêu chí (máy / AI riêng), đề thử có bảng theo dạng, ô 📊 ở Học IELTS'); }
  // 🗺 Bản đồ band IELTS (iemap.js, v83): chỗ yếu theo dạng / tiêu chí, ưu tiên, nhóm 3 (mỗi kỹ năng 1), thử bằng bài mới, đạt 2 ngày = xong, gác, 🧱 nền CEFR
  { const bad = [], errs = [], tryv = (n, f) => { try { f(); } catch (e) { errs.push(n + ': ' + e.message); } }; S = blank(); await ieLoad(); await kLoad(KIT.nghe); await kLoad(KIT.doc);
    const now = Date.now(), D = 864e5, o = ieSt(); o.target = 6.5; const ses = (ok, n, ids) => ({ at: now, ok, n, ids, src: 'thi' });
    // v99: chỉ chỗ yếu đủ chắc (≥ 8 câu ở ≥ 2 bài) vào nhóm đang chữa; R-mc 1 / 2 câu sai chỉ hiện ở bảng, không vào nhóm
    o.ty = { 'R-tf': [ses(2, 6, ['a']), ses(2, 6, ['b'])], 'R-h': [ses(5, 8, ['a']), ses(1, 2, ['b'])], 'R-comp': [ses(9, 10, ['a', 'b'])], 'L-form': [ses(3, 10, ['n1', 'n2'])], 'R-mc': [ses(1, 2, ['c'])] };
    ieCrLog('W', 't2', [5, 6, 6.5, 6], 'ai'); ieCrLog('S', null, [7, 7, 7, 7], 'may');
    const W = imWeak(), u = W.map(w => w.u);
    if (u.includes('R-comp') || !u.includes('R-tf') || !u.includes('R-h') || !u.includes('W:0') || u.includes('W:2') || u.includes('S:0')) bad.push('chỗ yếu sai: ' + u.join(','));
    if (!(W.find(w => w.u === 'R-tf').p > W.find(w => w.u === 'R-h').p) || !W.find(w => w.u === 'W:0').sure || !W.some(w => w.u === 'R-mc' && !w.sure)) bad.push('ưu tiên / độ chắc sai');
    const f = imFocus(now), sk = f.act.map(w => w.sk);
    if (f.act.length !== 3 || new Set(sk).size !== 3 || !f.act.some(w => w.u === 'R-tf') || f.act.some(w => w.u === 'R-h') || !f.queue.some(w => w.u === 'R-h') || [...f.act, ...f.queue].some(w => w.u === 'R-mc')) bad.push('nhóm đang chữa sai: ' + f.act.map(w => w.u).join(','));
    // lượt luyện trên bài đã gặp không tính; bài mới tính
    const x = IE.doc[0], tfq = ieRQs(x, ['tf']); if (tfq.length < IM_MIN_Q) bad.push('bài đọc ít câu TF: ' + tfq.length);
    ieTyLog(tfq.map(q => ({ q, ok: false })), 'luyen', new Set()); if ((o.fo.a.find(a => a.u === 'R-tf').tr || 0) !== 0) bad.push('bài đã gặp vẫn tính lần thử');
    // đạt hôm nay + đạt hôm sau → xong; chỗ đầu hàng chờ (R-h) vào thay
    imHit('R-tf', true, now); imHit('R-tf', true, now + 1000); if (o.fo.a.find(a => a.u === 'R-tf').pd.length !== 1) bad.push('đạt 2 lần cùng ngày tính 2');
    imHit('R-tf', true, now + D); const g = imFocus(now + D); if (g.done !== 1 || g.act.some(w => w.u === 'R-tf') || !g.act.some(w => w.u === 'R-h')) bad.push('đạt 2 ngày chưa xong: ' + [g.done, g.act.map(w => w.u)].join('/'));
    // lượt trượt xoá chuỗi đạt; 3 ngày chưa xong → gác; 15 ngày sau quay lại (r = 1); kẹt tiếp → 🧱, không tự quay lại; bấm "Đã học nền" → vào lại
    imHit('L-form', true, now + D); imHit('L-form', false, now + D + 1000); if (o.fo.a.find(a => a.u === 'L-form').pd.length) bad.push('trượt chưa xoá chuỗi đạt');
    imHit('L-form', false, now + 2 * D); imHit('L-form', false, now + 3 * D); const pk = imFocus(now + 3 * D); if (!pk.park.some(w => w.u === 'L-form') || pk.act.some(w => w.u === 'L-form')) bad.push('không gác sau 3 lần');
    const bk = imFocus(now + 18 * D), r1 = bk.act.find(w => w.u === 'L-form'); if (!r1 || r1.r !== 1) bad.push('chỗ gác không quay lại');
    for (let k = 0; k < 3; k++) imHit('L-form', false, now + (18 + k) * D); const rt = imFocus(now + 21 * D); if (!rt.root.some(w => w.u === 'L-form') || imFocus(now + 99 * D).act.some(w => w.u === 'L-form')) bad.push('kẹt lần 2 chưa sang nền CEFR');
    // tiêu chí: bài Viết AI chấm đạt → một lượt đạt
    const w0 = o.fo.a.find(a => a.u[0] === 'W'); if (w0) { const t0 = w0.tr || 0; ieCrLog('W', 't2', [7, 7, 7, 7], 'ai'); if (w0.tr !== t0 + 1 || !w0.pd.length) bad.push('bài Viết chưa ghi lượt'); } else bad.push('thiếu chỗ Viết trong nhóm');
    await ieltsView(); const h = String($app.innerHTML); if (!h.includes('Bản đồ band') || !h.includes('Kẹt lâu')) bad.push('màn Học IELTS thiếu bản đồ band / 🧱');
    await imFix('R-h'); if (!(h2 => h2.includes('Trước khi thử') || h2.includes(' · 1/'))(String($app.innerHTML))) bad.push('chữa dạng câu không mở bài');
    if (!o.fo.a.find(a => a.u === 'R-h')) bad.push('R-h mất'); else {o.fo.a.find(a => a.u === 'R-h').tr = 1; o.fo.a.find(a => a.u === 'R-h').td = dayOf(now) - 1; await imFix('R-h'); if (!String($app.innerHTML).includes('Trước khi thử')) bad.push('thiếu xem cách làm trước lần thử 2'); }
    add('ielts', 'I3', !bad.length && !errs.length, [...errs, ...bad].length ? [...errs, ...bad].slice(0, 6).join(' | ') : 'bản đồ band: chỗ yếu theo dạng / tiêu chí, nhóm 3 mỗi kỹ năng 1, chỉ bài mới tính, đạt 2 ngày = xong, gác 14 ngày, 🧱 nền CEFR, xem cách làm trước khi thử'); }
  // v87 IELTS: nhập đề thật theo từng câu → band + bản đồ theo dạng; từ mới từ đề thật (Leitner); diễn đạt lại; Task 1 bản đồ / quy trình; Nói mở rộng; Nghe kiểu IELTS có giọng
  { const bad = [], errs = [], tryv = (n, f) => { try { f(); } catch (e) { errs.push(n + ': ' + e.message); } }; await ieLoad(); delete S.ie; const o = ieSt(); o.set = 1; o.target = 6.5;
    TH = { sk: 'R', name: 'Cambridge 18 · Test 2', blocks: [[1, 13, 'R-tf'], [14, 26, 'R-mi'], [27, 40, 'R-mc']], wrong: new Set([2, 14, 15, 16, 17, 18, 19, 20]) };
    tryv('lưu đề thật', () => thSave()); const off = o.off[o.off.length - 1];
    if (!off || off.rr !== 32 || off.R !== ieRaw(IE_RA, 32, 40) || off.L != null) bad.push('đề thật: band sai ' + JSON.stringify(off));
    const mi = (o.ty['R-mi'] || []).slice(-1)[0]; if (!mi || mi.n !== 13 || mi.ok !== 6 || mi.src !== 'that') bad.push('đề thật: theo dạng sai ' + JSON.stringify(mi));
    if (!imWeak().some(w => w.u === 'R-mi')) bad.push('dạng yếu của đề thật chưa vào bản đồ band'); if (!String($app.innerHTML).includes('Ghép thông tin')) bad.push('màn kết quả đề thật thiếu bảng theo dạng');
    tryv('ô Sẵn sàng thi', () => ieReady()); tryv('màn nhập đề thật', () => ieThat('L')); if (!String($app.innerHTML).includes('Chạm vào câu SAI')) bad.push('màn nhập đề thật hỏng');
    if (thRange([1, 2, 3, 5, 7, 8]) !== '1–3, 5, 7–8') bad.push('gộp dải câu sai');
    // từ mới từ đề thật
    await loadRef(); LIBW = null; const C = vwCands('The researchers concluded that urbanisation had a detrimental impact on biodiversity. The cat sat on the mat.');
    if (!C.some(c => /detrimental/.test(c.t)) || C.some(c => c.t === 'the')) bad.push('tách từ đề thật sai: ' + C.map(c => c.t).join(','));
    const n = vwPut(C.slice(0, 3).map(c => ({ w: c.w ? c.w.w : c.t, vi: c.w && c.w.vi || '', ex: c.ex, app: null })), 'C18'); if (n !== 3 || vwDue().length !== 3 || vwPut([{ w: C[0].w ? C[0].w.w : C[0].t }], 'x') !== 0) bad.push('bộ thẻ từ đề thật sai');
    tryv('ôn từ đề thật', () => vwRun()); if (!String($app.innerHTML).includes('Nghĩa là gì')) bad.push('màn ôn từ hỏng');
    // diễn đạt lại
    const pq = ieParaQs(5); if (pq.length !== 5 || pq.some(q => !q.opts.includes(q.a) || q.opts.length !== 4 || q.ty !== 'R-para')) bad.push('diễn đạt lại sai');
    // Task 1 bản đồ / quy trình: hình vẽ được, bài mẫu đạt mọi yêu cầu dạng bài
    for (const x of IE.t1.filter(x => x.kind === 'map' || x.kind === 'process')) { const h = ieChart(x); if (x.kind === 'map' ? (h.match(/<svg/g) || []).length !== 2 : (h.match(/↓/g) || []).length !== x.steps.length - 1) bad.push('vẽ Task 1 hỏng: ' + x.id);
      const r = ieWScore('t1', x, x.m), miss = r.f.filter(f => !f[1]).map(f => f[0]); if (miss.length || r.band < 6) bad.push('bài mẫu ' + x.id + ' chưa đạt: ' + miss.join(', ') + ' band ' + r.band); }
    if (IE.t1.filter(x => x.kind === 'map').length < 3 || IE.t1.filter(x => x.kind === 'process').length < 3) bad.push('thiếu đề bản đồ / quy trình');
    if (IE.p1.length < 20 || IE.p2.length < 18) bad.push('đề Nói chưa mở rộng');
    // Nghe kiểu IELTS: đủ 4 phần, câu hợp lệ, mọi câu có giọng tự nhiên
    if (!NCLIPS.size) try { NCLIPS = new Set(await (await fetch('n/index.json')).json()); } catch (e) {}
    for (const p of [1, 2, 3, 4]) if (!IE.ln.some(x => x.part === p)) bad.push('Nghe IELTS thiếu Part ' + p);
    for (const x of IE.ln) { const qs = ieLnQs(x); if (qs.length !== 10 || qs.some(q => q.kind === 'mc' ? !q.opts.includes(q.a) : !(q.acc || []).length)) bad.push('Nghe IELTS câu hỏng: ' + x.id);
      const ts = x.lines ? x.lines.map(l => l[1]) : kSents(x.text), miss = ts.filter(t => !NCLIPS.has(clipKey(t))); if (miss.length) bad.push('Nghe IELTS thiếu giọng ' + x.id + ': ' + miss.length + ' câu (chạy tools/build-audio.py)'); }
    const lq = ieListen([0, 1, 2, 3]); if (lq.length !== 40 || !lq.some(it => it.q.ty === 'L-map') || !lq.some(it => it.q.ty === 'L-match')) bad.push('đề Nghe 4 phần chưa dùng bài IELTS: ' + lq.length);
    await ieltsView(); const h = String($app.innerHTML); if (!h.includes('Luyện bằng đề thật') || !h.includes('data-iepara')) bad.push('màn Học IELTS thiếu đề thật / diễn đạt lại');
    add('ielts', 'I4', !bad.length && !errs.length, [...errs, ...bad].length ? [...errs, ...bad].slice(0, 8).join(' | ') : 'đề thật theo từng câu, từ mới đề thật, diễn đạt lại, Task 1 bản đồ / quy trình, Nói mở rộng, Nghe kiểu IELTS có giọng đều đúng'); }
  // 📅 Hôm nay + 🧭 xếp cấp (homnay.js): phút học từ nhịp save(), chuỗi ngày, ô Hôm nay, câu xếp cấp hợp lệ mọi cấp, bậc thang lên / xuống / dừng
  { const bad = [], errs = [], tryv = (n, f) => { try { f(); } catch (e) { errs.push(n + ': ' + e.message); } }; S = blank(); const t0 = Date.now() - 3 * 864e5;
    for (const d of [0, 1, 2]) for (let k = 0; k < 40; k++) actTick(t0 + d * 864e5 + k * 15000);   // 3 ngày, mỗi ngày 40 lần cách 15 giây ≈ 10 phút
    actTick(Date.now() - 60000); actTick(Date.now());
    if (actMin(dayOf(t0)) !== 10 || actStreak() !== 3) bad.push('phút / chuỗi sai: ' + actMin(dayOf(t0)) + ' / ' + actStreak());
    actTick(Date.now() + 10 * 60000); if (actMin(dayOf(Date.now())) > 2) bad.push('khoảng nghỉ dài vẫn tính phút');
    await overview('a1'); const ov = String($app.innerHTML); if (!ov.includes('📅 Hôm nay') || !ov.includes('Việc hôm nay')) bad.push('Tổng quan thiếu ô Hôm nay');
    // v86 hiện dần: người mới chưa thấy 🧰 luyện thi (chỉ một dòng báo), không còn ▶ Nên làm / 🗓 Gợi ý ~45 phút trái mục tiêu phút
    if (ov.includes('id="ovtools"') || ov.includes('data-mock') || !ov.includes('tab 🎓 Luyện thi') || ov.includes('Gợi ý mỗi ngày') || ov.includes('▶ Nên làm')) bad.push('Tổng quan người mới chưa gọn');
    for (const lv of PL_LV) { const qs = plQs(lv); if (qs.length !== 5 || qs.some(it => !it.q.opts.includes(it.q.a))) bad.push('xếp cấp ' + lv + ': ' + qs.length + ' câu'); }
    if (plNext({ a2: [5, 5] }, 'a2') !== 'b1' || plNext({ a2: [1, 5] }, 'a2') !== 'a1' || plNext({ a2: [3, 5] }, 'a2') !== 'a2' || plNext({ a2: [6, 10] }, 'a2') !== null
      || plNext({ a2: [5, 5], b1: [1, 5] }, 'b1') !== null || plNext({ pre: [0, 5], a1: [0, 5], a2: [0, 5] }, 'pre') !== null || plResult({ a2: [5, 5], b1: [2, 5] }) !== 'a2') bad.push('bậc thang xếp cấp sai');
    await tryv('màn xếp cấp', () => placeView());
    add('cefr', 'C1', !bad.length && !errs.length, [...errs, ...bad].length ? [...errs, ...bad].slice(0, 6).join(' | ') : 'phút học, chuỗi ngày, ô Hôm nay, Học không còn công cụ luyện thi, xếp cấp mọi cấp đều đúng'); }
  // 🚀 Thi vượt cấp (vuotcap.js): qua → đạt mọi cấp ≤ cấp thi, bài cấp dưới thành đã học + nhớ, hạn ôn rải (không bài nào đến hạn ngay, không dồn một ngày); trượt → không đổi, chờ 7 ngày
  { const bad = [], errs = [], tryv = (n, f) => { try { f(); } catch (e) { errs.push(n + ': ' + e.message); } }; S = blank(); const now = Date.now();
    S.vc = { pend: [{ id: 'np', lv: 'b1', at: now - 1000, n: 0 }, { id: 'tv', lv: 'a2p', at: now - 1000, n: 0 }, { id: 'nghe', lv: 'a2', at: now - 1000, n: 0 }], log: [] };
    kSt('np').runs.push({ lv: 'b1', at: now, ok: 30, n: 34, pass: true }); xs().runs.push({ lv: 'a2p', at: now, ok: 36, n: 40, pass: true }); kSt('nghe').runs.push({ lv: 'a2', at: now, ok: 5, n: 20, pass: false });
    vcCheck(now);
    for (const l of ['pre', 'a1', 'a2']) if (!kPassed(KIT.np, l)) bad.push('ngữ pháp chưa đạt cấp dưới ' + l);
    for (const l of ['pre', 'a1', 'a2']) if (!passed(l) || !xDurable(l)) bad.push('từ vựng chưa đạt / đạt bền cấp dưới ' + l);
    if (KIT.nghe.lvs.some(l => kPassed(KIT.nghe, l))) bad.push('trượt mà vẫn đạt nghe');
    if (vcWait('nghe', 'a2') !== 7 || S.vc.pend.length) bad.push('chờ thi lại / hàng chờ sai');
    const cs = [...Object.values(S.cards), ...Object.values(kSt('np').cards)], due = cs.filter(c => isDue(c, now)).length, days = new Set(cs.map(c => c.S));
    if (!cs.length || due || days.size < 50) bad.push('hạn ôn không rải: ' + cs.length + ' thẻ, ' + due + ' đến hạn, ' + days.size + ' mức');
    if (Object.keys(S.cards).length !== ['pre', 'a1', 'a2', 'a2p'].reduce((t, l) => t + levelWords(l).length, 0)) bad.push('số từ đánh dấu sai');
    const p = parts(S, now, 'a2'); if (p.lq !== 100 || p.mq < 80) bad.push('📘 / 🔁 cấp A2 sau thi vượt: ' + p.lq + ' / ' + p.mq);
    if (ovStage() !== 'pre') bad.push('mới vượt 2 phần mà cấp đang học đã đổi');
    for (const [id] of OV) if (id !== 'tv') { const L = vcLvOf(id, 'a2'); vcRuns(id).push({ lv: L, at: now, ok: 9, n: 10, pass: true }); vcApply(id, L, now); } if (ovStage() !== 'b1') bad.push('vượt đủ 7 phần tới A2 / A2+ mà cấp đang học là ' + ovStage());
    S.vc.pend = [{ id: 'doc', lv: 'a2', at: now - 2 * 864e5, n: 0 }]; vcCheck(now); if (S.vc.pend.length) bad.push('hàng chờ quá hạn không bỏ');
    await tryv('màn thi vượt', () => vcView('b1')); await vcView('b1'); if (!String($app.innerHTML).includes('Thi vượt lên B1')) bad.push('màn thi vượt');
    add('cefr', 'C2', !bad.length && !errs.length, [...errs, ...bad].length ? [...errs, ...bad].slice(0, 6).join(' | ') : 'thi vượt: qua → đạt cấp dưới, hạn ôn rải; trượt → không đổi, chờ 7 ngày'); }
  // ⚡ v76 (nhanh.js): ngưỡng nhớ 80%, kiểm tra đầu bài, chấm nhiều mục (chỉ từ đã học trong câu hỏi + đáp án, 1 lần / ngày), tra từ = chưa nhớ, gợi ý học lại
  { const bad = [], errs = [], tryv = (n, f) => { try { f(); } catch (e) { errs.push(n + ': ' + e.message); } }; S = blank(); const now = Date.now(), DAYMS = 864e5;
    const c0 = { S: 1, last: now - 1.3 * DAYMS, d0: dayOf(now) - 3, ok: 1, pv: 1, dm: { nghia: { ok: 1, pv: 1 } } }; const r = recall(c0, now);
    if (!(r < 0.9 && r >= 0.8) || !heldDim(c0, 'nghia', now) || isDue(c0, now) === false) bad.push('ngưỡng 80% / lịch ôn 90% sai: R=' + r.toFixed(3));
    const u = UNITS.find(x => x.lv === 'a1'); await tryv('mở bài học', () => learn(u)); if (!String($app.innerHTML).includes('Biết rồi thì bỏ qua')) bad.push('bài học không mở kiểm tra đầu bài');
    const pc = ptCard(now), w0 = u.words[0]; S.cards[w0.id] = pc; if (!['nghia', 'nhora', 'viet'].every(k => heldDim(pc, k, now)) || heldDim(pc, 'nghe', now)) bad.push('từ qua kiểm tra: mặt nhớ sai');
    if (!parts(S, now, 'a1').learn) bad.push('từ qua kiểm tra không tính đã học');
    // chấm nhiều mục: câu đọc có từ đã học (học từ hôm trước) → cộng; từ học hôm nay, từ chỉ trong đoạn văn, câu sai, bài viết: không cộng
    S = blank(); const ws = WORDS.filter(w => /^[a-z]{4,}$/.test(w.w) && wLv(w) === 'a1').slice(0, 12); for (const w of ws.slice(0, 10)) S.cards[w.id] = { S: 2, last: now - 3 * DAYMS, d0: dayOf(now) - 5, ok: 1, pv: 1, n: 2, lapse: 0, dm: {} };
    S.cards[ws[10].id] = { S: 1, last: now, d0: dayOf(now), ok: 1, pv: 0, n: 0, lapse: 0, dm: {} };
    const q = { kind: 'mc', q: 'Why did ' + ws[0].w + ' and ' + ws[1].w + 's matter?', a: 'Because of ' + ws[2].w + ' and ' + ws[10].w, x: { text: ws[5].w } };
    const n1 = mfCredit(KIT.doc, q, true, now), n2 = mfCredit(KIT.doc, q, true, now), n3 = mfCredit(KIT.doc, { ...q, q: ws[3].w }, false, now), n4 = mfCredit(KIT.viet, { ...q, q: ws[4].w }, true, now);
    if (n1 !== 3 || n2 !== 0 || n3 || n4) bad.push('chấm nhiều mục sai: ' + [n1, n2, n3, n4].join('/'));
    if (!S.cards[ws[0].id].dm.nghia || !S.cards[ws[0].id].dm.nghia.ok || S.cards[ws[5].id].mf) bad.push('cộng sai từ');
    if (!mfLookup(ws[6], now) || S.cards[ws[6].id].ok || mfLookup(ws[6], now) || mfLookup(ws[11], now)) bad.push('tra từ = chưa nhớ sai');
    // gợi ý học lại: bài có ≥ 3 từ quên nhiều lần
    S = blank(); learnCards(S, u, now - 20 * DAYMS); for (const w of u.words.slice(0, 3)) Object.assign(S.cards[w.id], { lapse: 2, ok: 0, last: now - 10 * DAYMS, S: 0.5 });
    const rl = relearnUnits(now); if (!rl.length || rl[0][0] !== u || rl[0][1].length !== 3) bad.push('gợi ý học lại sai'); tryv('học lại', () => relearn(u));
    if (!/data-relearn=/.test(todayBox('a1'))) bad.push('ô Hôm nay thiếu nút học lại');
    add('cefr', 'C3', !bad.length && !errs.length, [...errs, ...bad].length ? [...errs, ...bad].slice(0, 6).join(' | ') : 'ngưỡng nhớ 80%, kiểm tra đầu bài, chấm nhiều mục, tra từ, học lại đều đúng'); }
  // 🗺 Bản đồ chỗ yếu (bando.js): mặt sai > mặt quên > vững; ưu tiên theo tin cậy + quan trọng; độ phủ; truy gốc bài yếu → từ; cân bằng; buổi chữa 70 / 30; quét lại
  { const bad = [], errs = [], tryv = (n, f) => { try { f(); } catch (e) { errs.push(n + ': ' + e.message); } }; S = blank(); const now = Date.now(), D = 864e5;
    const u = UNITS.find(x => x.lv === 'pre'); learnCards(S, u, now - 5 * D); const [w1, w2, w3] = u.words;
    for (const w of u.words) { const c = S.cards[w.id]; c.S = 30; c.last = now - D; c.pv = 1; c.dm = {}; for (const k of wDims(w, 'pre')) c.dm[k] = { ok: 1, pv: 1, n: 3 }; }
    S.cards[w1.id].dm.nghia = { ok: 0, pv: 1, n: 3 }; S.cards[w2.id].dm.viet = { ok: 0, pv: 1, n: 1 }; Object.assign(S.cards[w3.id], { S: 0.5, last: now - 5 * D });
    const W = mapWeak(now), f1 = W.find(x => x.x === w1 && x.k === 'nghia'), f2 = W.find(x => x.x === w2 && x.k === 'viet'), f3 = W.find(x => x.x === w3);
    if (!f1 || !f2 || !f3 || f1.st !== 'sai' || f3.st !== 'quen' || !(f1.p > f2.p) || !(f2.p > 0) || W.some(x => x.x === u.words[4] )) bad.push('xếp chỗ yếu sai: ' + JSON.stringify(W.slice(0, 4).map(x => [x.x.w, x.k, x.st, x.p])));
    const cv = mapCover().find(c => c.id === 'tv'); if (cv.has !== u.words.length) bad.push('độ phủ sai');
    // truy gốc: bài đọc yếu chứa từ chưa học
    const P = KIT.doc, x = kItems(P, kLv(P))[0]; kSt('doc').cards[x.id] = { S: 1, last: now - 3 * D, d0: dayOf(now) - 4, ok: 0, pv: 1, n: 2, lapse: 1, dm: Object.fromEntries(kDimsOf(P, x).map(k => [k, { ok: 0, pv: 1, n: 2 }])) };
    const R = mapRoots(mapWeak(now), now); if (!R.length || !R[0].gap.length) bad.push('truy gốc không ra từ');
    await tryv('màn bản đồ', () => mapView()); await mapView(); const h = String($app.innerHTML); if (!h.includes('Tầng phủ') || !h.includes('Tầng chữa') || !h.includes('Tầng gốc') || !h.includes('Cân bằng')) bad.push('màn bản đồ thiếu tầng');
    tryv('chữa từ vựng', () => mapFix('tv')); tryv('chữa đọc', () => mapFix('doc')); tryv('chữa gốc', () => mapRoot(R)); tryv('quét lại', () => mapScan());
    if (!/data-mapv/.test(todayBox('pre'))) bad.push('ô Hôm nay thiếu nút bản đồ'); tryv('tab dữ liệu', () => backup()); if (String($app.innerHTML).includes('Mở bản đồ')) bad.push('v86: bản đồ còn ở tab Dữ liệu (đã chuyển về ô Hôm nay)');
    if (!mapScanDue(now)) bad.push('quét lại chưa đến hạn khi chưa quét lần nào'); S.scan = [{ at: now }]; if (mapScanDue(now)) bad.push('quét lại đến hạn ngay sau khi quét');
    add('cefr', 'C4', !bad.length && !errs.length, [...errs, ...bad].length ? [...errs, ...bad].slice(0, 6).join(' | ') : 'bản đồ chỗ yếu: xếp ưu tiên, độ phủ, truy gốc, cân bằng, buổi chữa, quét lại đều đúng'); }
  // 🎯 nhóm đang chữa (bando.js mapFocus, v79–v81): tối đa 15, Từ vựng ≤ 9, hàng chờ; chữa xong = đúng ở ngày sau lần sai; ra ngoài phạm vi không tính;
  // mọi lần chấm đếm lần thử; thử 3 ngày → gác 14 ngày → quay lại; kẹt lần 2 → 🧱 học lại bài gốc; xem lại trước khi thử; ô Hôm nay
  { const bad = [], errs = [], tryv = (n, f) => { try { f(); } catch (e) { errs.push(n + ': ' + e.message); } }; S = blank(); const now = Date.now(), D = 864e5;
    const us = UNITS.filter(x => x.lv === 'pre').slice(0, 3); for (const u of us) learnCards(S, u, now - 5 * D); const ws = us.flatMap(u => u.words);
    for (const w of ws) { const c = S.cards[w.id]; c.S = 30; c.last = now - D; c.pv = 1; c.dm = {}; for (const k of wDims(w, 'pre')) c.dm[k] = { ok: 1, pv: 1, n: 3 }; c.dm.nghia = { ok: 0, pv: 1, n: 3 }; }
    const P = KIT.doc, xs = kItems(P, kLv(P)).slice(0, 3), bad0 = x => ({ S: 30, last: now - D, d0: dayOf(now) - 4, ok: 0, pv: 1, n: 2, lapse: 1, dm: Object.fromEntries(kDimsOf(P, x).map(k => [k, { ok: 0, pv: 1, n: 2 }])) });
    for (const x of xs) kSt('doc').cards[x.id] = bad0(x);
    const W = mapWeak(now), f = mapFocus(now), tv = f.act.filter(w => w.id === 'tv').length;
    if (W.length <= MAP_ACT) bad.push('dữ liệu thử ít chỗ yếu: ' + W.length);
    if (f.act.length !== MAP_ACT || tv > MAP_TV_MAX || !f.act.some(w => w.id === 'doc') || f.queue.length !== W.length - MAP_ACT || f.done) bad.push('nhóm đang chữa sai: ' + [f.act.length, tv, f.queue.length, f.done].join('/'));
    const [a0, a1, a2, a3] = f.act.filter(w => w.id === 'tv'), q0 = f.queue[0], ok1 = w => { S.cards[w.x.id].dm.nghia = { ok: 1, pv: 1, n: 4 }; };
    // sai hôm qua, đúng hôm nay → chữa xong; chỗ đầu hàng chờ vào thay
    ok1(a0); mapHit('tv', a0.x.id, ['nghia'], true, now);
    const g = mapFocus(now); if (g.act.length !== MAP_ACT || g.done !== 1 || g.act.some(w => mapKey(w) === mapKey(a0)) || !g.act.some(w => mapKey(w) === mapKey(q0))) bad.push('hàng chờ không tiến: ' + [g.act.length, g.done].join('/'));
    // sai rồi đúng ngay trong ngày → ✔ chờ xác nhận, giữ chỗ; đúng thêm hôm sau → xong
    mapHit('tv', a1.x.id, ['nghia'], false, now); ok1(a1); mapHit('tv', a1.x.id, ['nghia'], true, now);
    const g2 = mapFocus(now), p1 = g2.act.find(w => mapKey(w) === mapKey(a1)); if (!p1 || !p1.cho || g2.done !== 1) bad.push('sai rồi đúng trong ngày đã tính xong');
    mapHit('tv', a1.x.id, ['nghia'], true, now + D); if (mapFocus(now + D).done !== 2) bad.push('đúng hôm sau chưa tính xong');
    // ra ngoài phạm vi (thẻ mất / lên cấp) → bỏ, không tính chữa xong
    delete S.cards[a2.x.id]; const g3 = mapFocus(now + D); if (g3.done !== 2 || g3.out !== 1) bad.push('ra ngoài phạm vi tính nhầm: ' + [g3.done, g3.out].join('/'));
    // chấm ở bất kỳ đâu (grade) = một lần thử, mỗi ngày 1
    const t0 = S.focus.a.find(x => x.q === mapKey(a3)).t || 0; grade(S, a3.x.id, false, now + 2 * D, 'w2vi'); grade(S, a3.x.id, false, now + 2 * D + 1000, 'w2vi');
    const fa3 = S.focus.a.find(x => x.q === mapKey(a3)); if (fa3.t !== t0 + 1 || fa3.wd !== dayOf(now + 2 * D)) bad.push('grade chưa báo lần thử: ' + [t0, fa3.t].join('/'));
    // từ lần thử 2: xem lại trước khi thử
    tryv('chữa có xem lại', () => mapFix('tv', undefined, now)); if (!String($app.innerHTML).includes('Xem lại trước khi thử')) bad.push('thiếu bước xem lại');
    await mapView(); const ht = String($app.innerHTML); if (!ht.includes('đang chữa') || !ht.includes('Hàng chờ') || !ht.includes('ra ngoài phạm vi')) bad.push('màn bản đồ thiếu nhóm / hàng chờ');
    if (!/data-today="fix"/.test(todayBox('pre'))) bad.push('ô Hôm nay thiếu việc chữa'); tryv('chữa hôm nay', () => mapToday());
    // một bài Đọc kẹt: thử 3 ngày → gác; 14 ngày sau → quay lại (r = 1); kẹt tiếp → 🧱 học lại bài gốc, không tự quay lại; học lại xong → vào lại nhóm
    S = blank(); const x0 = xs[0]; kSt('doc').cards[x0.id] = bad0(x0); learnCards(S, us[0], now - 5 * D);
    const k0 = mapKey(mapFocus(now).act.find(w => w.id === 'doc')), hit3 = t => { for (let i = 0; i < 3; i++) { mapHit('doc', x0.id, [], false, t + i * D); mapHit('doc', x0.id, [], false, t + i * D + 1000); } };
    hit3(now); if (S.focus.a.find(x => x.q === k0).t !== 3) bad.push('đếm lần thử sai (mỗi ngày 1)');
    const pk = mapFocus(now + 3 * D); if (pk.act.some(w => mapKey(w) === k0) || !pk.park.some(w => mapKey(w) === k0) || pk.queue.some(w => mapKey(w) === k0)) bad.push('không tạm gác sau 3 lần');
    const bk = mapFocus(now + 18 * D), r1 = bk.act.find(w => mapKey(w) === k0); if (!r1 || r1.r !== 1) bad.push('chỗ gác không quay lại');
    hit3(now + 18 * D); const rt = mapFocus(now + 21 * D); if (!rt.root.some(w => mapKey(w) === k0) || rt.act.some(w => mapKey(w) === k0) || mapFocus(now + 99 * D).act.some(w => mapKey(w) === k0)) bad.push('kẹt lần 2 chưa sang học lại bài gốc');
    await mapView(); if (!String($app.innerHTML).includes('Cần học lại bài gốc')) bad.push('màn bản đồ thiếu 🧱');
    tryv('học lại bài gốc', () => { mapRelearn(k0); $app.onclick({ target: { closest: q => q === '[data-mr="ok"]' ? {} : null } }); });
    const rl = mapFocus(); if (rl.root.length || !rl.act.some(w => mapKey(w) === k0 && w.r === 2) || rl.act.filter(w => w.id === 'doc').length !== kDimsOf(P, x0).length) bad.push('học lại xong chưa vào lại nhóm (mọi mặt của bài)');
    add('cefr', 'C5', !bad.length && !errs.length, [...errs, ...bad].length ? [...errs, ...bad].slice(0, 6).join(' | ') : 'nhóm 15 / Từ vựng ≤ 9, chữa xong cần đúng ở ngày sau, ra ngoài phạm vi không tính, chấm ở đâu cũng đếm, xem lại trước khi thử, gác 14 ngày, kẹt lần 2 → học lại bài gốc, ô Hôm nay'); }
  // v85 ưu tiên theo tầng (bando.js): suất giữ chỗ Hiểu / Tạo ra, gốc trước triệu chứng (từ yếu trong bài yếu lên trước, bài giảm), Nói / Viết 1 lần đã tin cậy, nhật ký chữa xong
  { const bad = [], errs = [], tryv = (n, f) => { try { f(); } catch (e) { errs.push(n + ': ' + e.message); } }; S = blank(); const now = Date.now(), D = 864e5;
    const us = UNITS.filter(x => x.lv === 'pre').slice(0, 3); for (const u of us) learnCards(S, u, now - 5 * D); const ws = us.flatMap(u => u.words);
    for (const w of ws) { const c = S.cards[w.id]; c.S = 30; c.last = now - D; c.pv = 1; c.dm = {}; for (const k of wDims(w, 'pre')) c.dm[k] = { ok: 1, pv: 1, n: 3 }; c.dm.nghia = { ok: 0, pv: 1, n: 3 }; }
    const bad0 = (P, x, n) => ({ S: 30, last: now - D, d0: dayOf(now) - 4, ok: 0, pv: 1, n, lapse: 0, dm: Object.fromEntries(kDimsOf(P, x).map(k => [k, { ok: 0, pv: 1, n }])) });
    const Pd = KIT.doc, xd = kItems(Pd, kLv(Pd)).slice(0, 4), Pv = KIT.viet, xv = kItems(Pv, kLv(Pv))[0];
    for (const x of xd) kSt('doc').cards[x.id] = bad0(Pd, x, 2); kSt('viet').cards[xv.id] = bad0(Pv, xv, 1);
    // một từ trong bài đọc đầu tiên: học rồi nhưng nghĩa sai → gốc
    const gw = mfWords(mapText(xd[0])).find(w => LEVELS.indexOf(wLv(w)) <= LEVELS.indexOf(xd[0].lv) + 1 && !S.cards[w.id]);
    if (gw) { S.cards[gw.id] = { S: 30, last: now - D, pv: 1, ok: 0, n: 3, dm: { nghia: { ok: 0, pv: 1, n: 3 } } }; }
    const W = mapWeak(now), wv = W.find(w => w.id === 'viet'), wg = gw && W.find(w => w.id === 'tv' && w.x === gw && w.k === 'nghia'), w0 = W.find(w => w.id === 'tv' && !w.rk && w.k === 'nghia');
    if (!wv || wv.p < 0.99) bad.push('Viết 1 lần chưa tính tin cậy: ' + (wv && wv.p));
    if (!gw) bad.push('bài đọc không có từ để thử gốc'); else if (!wg || !wg.rk || !(wg.p > w0.p)) bad.push('từ gốc không lên trước: ' + JSON.stringify([wg && wg.p, wg && wg.rk, w0 && w0.p]));
    if (!W.some(w => w.id === 'doc' && w.x === xd[0] && w.gr)) bad.push('bài yếu còn gốc chưa giảm ưu tiên');
    const f = mapFocus(now), n = t => f.act.filter(w => MAP_TIER[w.id] === t).length;
    if (f.act.length !== MAP_ACT || n('tao') < 1 || n('hieu') < 3) bad.push('suất giữ chỗ sai: ' + MAP_TIER_N.map(([t]) => n(t)).join('/'));
    const a = f.act.find(w => w.id === 'tv'); S.cards[a.x.id].dm.nghia = { ok: 1, pv: 1, n: 4 }; mapHit('tv', a.x.id, ['nghia'], true, now); mapFocus(now);
    if (!(S.focus.h || []).some(([d, id]) => id === 'tv' && d === dayOf(now))) bad.push('nhật ký chữa xong không ghi');
    await tryv('màn bản đồ', () => mapView()); await mapView(); if (!String($app.innerHTML).includes('Chia chỗ')) bad.push('màn bản đồ thiếu chia chỗ');
    add('cefr', 'C5b', !bad.length && !errs.length, [...errs, ...bad].length ? [...errs, ...bad].slice(0, 6).join(' | ') : 'ưu tiên theo tầng: giữ chỗ Hiểu / Tạo ra, gốc trước triệu chứng, tin cậy Nói / Viết, nhật ký đều đúng'); }
  // v86: tài khoản riêng mỗi máy (ẩn danh) / tài khoản chung; góp ý ⚑ Câu sai, người ẩn danh không quản lý góp ý; Tổng quan gọn + "còn thiếu"; IELTS hỏi 3 câu lần đầu
  { const bad = [], errs = [], tryv = (n, f) => { try { f(); } catch (e) { errs.push(n + ': ' + e.message); } }; S = blank(); const u0 = user;
    user = { id: 'anon-1234567890', is_anonymous: true }; tryv('dữ liệu ẩn danh', () => backup()); if (!String($app.innerHTML).includes('Tài khoản riêng của máy này')) bad.push('thiếu ô tài khoản riêng');
    if (/data-g="admin"/.test(gyHomeInner())) bad.push('người ẩn danh thấy Quản lý góp ý');
    user = { id: 'chung', email: AUTO.email }; tryv('dữ liệu chung', () => backup()); if (!String($app.innerHTML).includes('data-bk="split"')) bad.push('tài khoản chung thiếu nút tách máy');
    if (!/data-g="admin"/.test(gyHomeInner())) bad.push('tài khoản chung mất Quản lý góp ý'); user = u0;
    if (gaKind('sai') !== '⚑ Câu sai') bad.push('thiếu loại góp ý ⚑ Câu sai');
    const s0 = ovStat('tv', 'pre'); if (!s0 || s0.nl !== Math.ceil(levelWords('pre').length * GATE_LEARN / 100) || !(s0.nm > 0)) bad.push('còn thiếu sai: ' + JSON.stringify(s0 && [s0.nl, s0.nm]));
    if (!ovNeedLine(s0, true).includes('từ chưa học')) bad.push('thẻ phần thiếu dòng còn thiếu');
    await overview('pre'); const h = String($app.innerHTML), nb = (h.match(/<button/g) || []).length, nt = h.replace(/<[^>]+>/g, ' ').replace(/\\s+/g, ' ').length;
    if (nb > 20 || nt > 2000) bad.push('Tổng quan người mới còn nặng: ' + nb + ' nút, ' + nt + ' chữ');
    if (!/data-ovp="[a-z]+" data-ovpl="pre"[^>]*>⬜ Học 1 bài mới/.test(h)) bad.push('Hôm nay: việc học mới chưa mở thẳng phần');
    delete S.ie; await ieltsView(); if (!String($app.innerHTML).includes('Bắt đầu: 3 câu hỏi')) bad.push('IELTS lần đầu chưa hỏi 3 câu');
    ieSt().set = 1; await ieltsView(); const hi = String($app.innerHTML); if (!hi.includes('Hôm nay & kế hoạch') || !hi.includes('<summary><b>🎧 Nghe')) bad.push('IELTS sau khi chọn chưa gọn');
    add('cefr', 'C6', !bad.length && !errs.length, [...errs, ...bad].length ? [...errs, ...bad].slice(0, 6).join(' | ') : 'tài khoản riêng / chung, góp ý ⚑, Tổng quan gọn (' + nb + ' nút, ' + nt + ' chữ), còn thiếu, IELTS 3 câu đều đúng'); }
  // v88 📖 Từ điển: hiện đủ dữ liệu (đồng / trái nghĩa, họ từ, bất quy tắc, nghĩa khác, văn phong, thành ngữ, mẫu); tìm dạng biến đổi / gõ sai / cụm từ; không có từ → từ điển ngoài; 📌 sổ từ; tra gần đây
  { const bad = [], errs = [], tryv = (n, f) => { try { f(); } catch (e) { errs.push(n + ': ' + e.message); } }; S = blank(); DICT.q = ''; DICT.open = null; DICT.list = null; DICT.lv = null; DICT.f = null; DICT.kind = null;
    const m1 = tdMatch('went'), go = WORDS.find(w => w.w === 'go'); if (!go || m1.exact !== go.id) bad.push('went không ra go');
    const hw = new Set(WORDS.map(w => w.w.toLowerCase())), iw = WORDS.find(w => w.irr && w.irr.f.some(([, fs]) => fs.some(f => !hw.has(f.toLowerCase())))), ifm = iw && iw.irr.f.flatMap(([, fs]) => fs).find(f => !hw.has(f.toLowerCase()));
    if (!iw || tdMatch(ifm).exact !== iw.id) bad.push('dạng bất quy tắc không ra từ gốc: ' + ifm);
    const bea = WORDS.find(w => w.w === 'beautiful'); if (bea && !tdMatch('beautifull').ids.has(bea.id)) bad.push('gõ sai 1 chữ không ra');
    const idw = WORDS.find(w => w.idi); if (!tdMatch(idw.idi.p).ids.has(idw.id)) bad.push('không tìm được thành ngữ');
    if (!td1('house', 'horse') || td1('house', 'mouse!') || !td1('cat', 'cats')) bad.push('so gõ sai 1 chữ sai');
    const full = WORDS.find(w => w.rel && w.fam && w.irr) || WORDS.find(w => w.rel && w.irr), h = tdEntry(full, tdMatch(full.w));
    if (!h.includes('Gần nghĩa') && !h.includes('Trái nghĩa')) bad.push('mục từ thiếu đồng / trái nghĩa'); if (!h.includes('bất quy tắc')) bad.push('mục từ thiếu dạng bất quy tắc');
    if (!tdEntry(WORDS.find(w => w.s2), null).includes('Nghĩa khác') || !tdEntry(WORDS.find(w => w.reg), null).includes('🎚') || !tdEntry(WORDS.find(w => w.fam && w.fam.length), null).includes('Họ từ')) bad.push('mục từ thiếu nghĩa khác / văn phong / họ từ');
    if (!h.includes('dictionary.cambridge.org') || !h.includes('data-tdsave')) bad.push('mục từ thiếu từ điển ngoài / nút lưu');
    tryv('màn từ điển', () => dict()); DICT.q = 'went'; tryv('tìm went', () => dictList()); const hl = String(document.getElementById('dl').innerHTML); if (hl.indexOf('data-w="' + go.id + '"') !== hl.indexOf('data-w=')) bad.push('went: go chưa lên đầu');
    DICT.q = 'zxqvbnm'; tryv('tìm từ lạ', () => dictList()); if (!String(document.getElementById('dl').innerHTML).includes('chưa có trong từ điển')) bad.push('từ lạ chưa gợi ý từ điển ngoài');
    tryv('tra = gần đây', () => tdSeen(go)); if (S.dh[0] !== go.id) bad.push('tra gần đây không ghi'); tryv('lưu sổ', () => tdSave(go)); if (!vwSt().some(x => x.k === 'go')) bad.push('lưu sổ từ không ghi');
    DICT.q = ''; tryv('đầu từ điển', () => dictList()); if (!String(document.getElementById('df').innerHTML).includes('Sổ từ: 1 từ')) bad.push('đầu từ điển thiếu sổ từ');
    if (!/data-rev[^>]*>⬜ Ôn \\d+ mục đến hạn \\([^)]*từ sổ từ/.test(todayBox('pre'))) bad.push('ô Hôm nay thiếu ôn sổ từ (nút ôn chung)'); tryv('ôn sổ từ', () => vwRun(Date.now(), dict)); if (!String($app.innerHTML).includes('Ôn sổ từ')) bad.push('màn ôn sổ từ hỏng');
    add('cefr', 'C7', !bad.length && !errs.length, [...errs, ...bad].length ? [...errs, ...bad].slice(0, 8).join(' | ') : 'từ điển: đủ dữ liệu, tìm dạng biến đổi / gõ sai / thành ngữ, từ điển ngoài, sổ từ, tra gần đây đều đúng'); }
  // v89 📖 chạm vào từ trong bài, "Gặp trong bài", quản lý sổ từ + CSV, ghi từ app chưa có (td_miss)
  { const bad = [], errs = [], tryv = (n, f) => { try { f(); } catch (e) { errs.push(n + ': ' + e.message); } }; S = blank(); await Promise.all([kLoad(KIT.doc), kLoad(KIT.nghe), ieLoad(), uLoad()]); TD_SENT = null;
    const go = WORDS.find(w => w.w === 'go'), h = tdHits(go); if (!h.length || h.some(([t]) => !/\\bgo(es|ing)?\\b|\\bwent\\b|\\bgone\\b/i.test(t))) bad.push('Gặp trong bài sai: ' + JSON.stringify(h.slice(0, 1)));
    if (!tdEntry(go, null).includes('Gặp trong bài')) bad.push('mục từ thiếu Gặp trong bài');
    const nTap = ['kparts.js', 'ielts.js', 'toeic.js', 'uoe.js'].length; if (!String(iePass(IE.doc[0])).includes('tdtap') || !String(kRead(KIT.doc, kItems(KIT.doc, 'a1')[0], 'ct', false)[0].head || '').includes('tdtap')) bad.push('đoạn văn chưa bật chạm để tra');
    if (!TD_NOTAP.test('🚪 Thi chuyển cấp A1') || !TD_NOTAP.test('de-thu-cau') || TD_NOTAP.test('doc-bai')) bad.push('chặn tra trong đề thi sai');
    tryv('thẻ tra nhanh', () => tdPop('went', 'Yesterday we went home.')); const pop = document.getElementById('tdpop'); if (!String(pop.innerHTML).includes('dạng của “go”') || !String(pop.innerHTML).includes('data-tdp="save"')) bad.push('thẻ tra nhanh sai');
    tryv('thẻ tra từ lạ', () => tdPop('zorblax', '')); if (!String(document.getElementById('tdpop').innerHTML).includes('Chưa có trong từ điển app')) bad.push('thẻ từ lạ sai');
    // sổ từ: sửa nghĩa, xoá, CSV
    vwPut([{ w: 'resilient', vi: '', ex: 'Corals are resilient.' }, { w: 'go', vi: 'đi', ex: '' }], 'test'); tryv('màn sổ từ', () => sotuView(dict)); if (!String($app.innerHTML).includes('Sổ từ của tôi')) bad.push('màn sổ từ hỏng');
    const x0 = vwSt().find(x => x.k === 'resilient'); tryv('sửa nghĩa', () => $app.onchange({ target: { closest: s => s === '[data-stv]' ? { dataset: { stv: x0.id }, value: 'kiên cường' } : null } })); if (x0.vi !== 'kiên cường') bad.push('sửa nghĩa không lưu');
    const csv = tdCsv(vwSt()); if (!csv.startsWith('﻿"word","meaning"') || !csv.includes('"resilient","kiên cường","Corals are resilient."')) bad.push('CSV sai');
    tryv('xoá', () => $app.onclick({ target: { closest: s => s === '[data-st]' ? { dataset: { st: 'del|' + x0.id } } : null } })); if (vwSt().some(x => x.k === 'resilient')) bad.push('xoá không được');
    if (tdMiss('Hello world', 'tra') !== undefined) bad.push('ghi từ thiếu nhận cả cụm');
    const u0 = user; user = { id: 'chung', email: AUTO.email }; tryv('dữ liệu', () => backup()); if (!String($app.innerHTML).includes('data-bk="miss"')) bad.push('Dữ liệu thiếu xem từ app chưa có'); await tdMissView(); if (!String($app.innerHTML).includes('Từ người học tra')) bad.push('màn từ app chưa có hỏng'); user = u0;
    add('cefr', 'C8', !bad.length && !errs.length, [...errs, ...bad].length ? [...errs, ...bad].slice(0, 8).join(' | ') : 'chạm để tra, Gặp trong bài, sổ từ (sửa, xoá, CSV), từ app chưa có đều đúng'); }
  // v90 📖 tra cứu nhiều mặt: 🧱 ngữ pháp (tên Việt / Anh / tên gọi khác), 🔗 cụm từ, ❗ lỗi hay gặp, 👄 phát âm, ✍️ cụm câu; "Cũng có"; từ → ngữ pháp liên quan
  { const bad = [], errs = [], tryv = (n, f) => { try { f(); } catch (e) { errs.push(n + ': ' + e.message); } }; S = blank(); await Promise.all([kLoad(KIT.np), tcLoad(), paLoad()]); DICT.q = ''; DICT.open = null; DICT.kind = 'tu';
    const qs = ['present perfect', 'hiện tại hoàn thành', 'quá khứ đơn', 'bị động', 'câu điều kiện', 'mệnh đề quan hệ', 'so sánh', 'mạo từ', 'used to', 'gerund'], miss = qs.filter(q => !tcNpHits(q, 1).length);
    if (miss.length > 1) bad.push('tìm ngữ pháp trượt: ' + miss.join(', '));
    const w = n => WORDS.find(x => x.w === n); if (!/hoàn thành/i.test(tcGramFor(w('since'))) || !/điều kiện/i.test(tcGramFor(w('if'))) || !/although/i.test(tcGramFor(w('although')))) bad.push('từ → ngữ pháp liên quan sai');
    if (!tdEntry(w('although'), null).includes('Ngữ pháp liên quan')) bad.push('mục từ thiếu ngữ pháp liên quan');
    if (tcCum('pv', '').length < 100 || tcCum('idi', '').length < 100 || !tcCum('pv', 'give up').some(r => r[0] === 'give up')) bad.push('cụm từ thiếu: ' + tcCum('pv', '').length);
    if (TC.loi.length < 40 || TC.loi.some(x => !x.wrong || !x.right || x.wrong === x.right || !x.why)) bad.push('lỗi hay gặp hỏng'); if (!tcLoiHits('since').length) bad.push('tìm lỗi since trượt');
    for (const x of TC.loi) { const r = wErrors(x.right.split(' / ')[0]); if (r.length) bad.push('câu đúng bị máy bắt lỗi: ' + x.right + ' · ' + r[0][1]); }
    if (TC.ipa.length !== 44 || TC.ipa.some(p => !tcIpaWords(p.s, 1).length)) bad.push('bảng âm thiếu từ ví dụ: ' + TC.ipa.filter(p => !tcIpaWords(p.s, 1).length).map(p => p.s).join(' '));
    if (tcIpaWords('e', 20).some(x => !String(x.ipa).replace(/eɪ|eə/g, '').includes('e'))) bad.push('/e/ khớp nhầm /eɪ/');
    if ((TC.cum || []).reduce((s, x) => s + x.items.length, 0) < 50 || TC.cum.some(s => s.items.some(x => !x.en || !x.vi || !x.ex))) bad.push('cụm câu hỏng');
    tryv('màn từ điển', () => dict()); for (const k of ['np', 'cum', 'loi', 'pa', 'cau']) { DICT.kind = k; tryv('loại ' + k, () => dictList()); if (!String(document.getElementById('dl').innerHTML).length) bad.push('loại ' + k + ' trống'); }
    DICT.kind = null; DICT.q = 'although'; tryv('tìm gộp', () => dictList()); const ga = String(document.getElementById('dl').innerHTML); if (!ga.includes('🧱 Ngữ pháp') || !ga.includes('❗ Lỗi hay gặp') || !ga.includes('📚 Từ')) bad.push('tìm although chưa gộp đủ nhóm');
    DICT.q = ''; DICT.kind = 'tu';
    add('cefr', 'C9', !bad.length && !errs.length, [...errs, ...bad].length ? [...errs, ...bad].slice(0, 8).join(' | ') : 'tra cứu ngữ pháp, cụm từ, lỗi hay gặp, phát âm, cụm câu, "Cũng có", từ → ngữ pháp đều đúng'); }
  // v91 tra theo 4 kỹ năng: mỗi tab ≥ 4 nhóm; từ nối theo chức năng; tiền tố / hậu tố có từ ví dụ trong app; nghe số / ngày / âm yếu
  { const bad = [], errs = [], tryv = (n, f) => { try { f(); } catch (e) { errs.push(n + ': ' + e.message); } }; S = blank(); await Promise.all([tcLoad(), ieLoad()]);
    await Promise.all([toLoad(), uLoad()]);
    for (const ex of ['cefr', 'ielts', 'toeic']) { DICT.ex = ex; for (const k of ['nghe', 'noi', 'doc', 'viet']) { const h = tcSkill(k, ''), n = (h.match(/<details class="box"/g) || []).length, min = ex === 'toeic' && (k === 'noi' || k === 'viet') ? 2 : 4; if (n < min) bad.push(ex + ' / ' + k + ' chỉ ' + n + ' nhóm'); } }
    // v92: phần riêng từng kỳ thi
    DICT.ex = 'toeic'; if (!/Bẫy Part 2 \\(4\\)/.test(tcSkill('nghe', '')) || !/Từ vựng công sở/.test(tcSkill('doc', '')) || !/không thi Nói/.test(tcSkill('noi', ''))) bad.push('TOEIC trong tab kỹ năng thiếu');
    DICT.ex = 'cefr'; const cv = tcSkill('viet', ''); if ((cv.match(/Bố cục<\\/b>/g) || []).length < 8 || !/Dạng đề Đọc/.test(tcSkill('doc', '')) || /IELTS Task/.test(cv)) bad.push('CEFR trong tab kỹ năng thiếu / lẫn IELTS');
    DICT.ex = 'ielts'; if (!/Part 1/.test(tcSkill('noi', '')) || /Bẫy Part 2/.test(tcSkill('nghe', ''))) bad.push('IELTS trong tab kỹ năng sai');
    DICT.ex = 'ielts'; if (!/Đối lập/.test(tcSkill('doc', 'however'))) bad.push('however không ra nhóm đối lập');
    const un = TC.afx.find(x => x.a === 'un-'), uw = tcAfxWords(un); if (uw.filter(w => w.app).length < 5 || uw.some(w => !w.w.toLowerCase().startsWith('un'))) bad.push('un- thiếu từ ví dụ trong app: ' + uw.map(w => w.w).join(','));
    const poor = TC.afx.filter(x => tcAfxWords(x).length < 3).map(x => x.a); if (poor.length) bad.push('tiền tố / hậu tố ít ví dụ: ' + poor.join(', '));
    // ví dụ chọn tay phải đúng tiền tố / hậu tố (bỏ dấu gạch nối, so đầu / cuối từ)
    for (const x of TC.afx) { const fs = x.a.split(' / ').map(f => f.replace(/-/g, '')); for (const w of x.w) { const k = w.toLowerCase().replace(/-/g, ''); if (!fs.some(f => x.k === 'tiền tố' ? k.startsWith(f) : k.endsWith(f) || k.endsWith(f + 'e'))) bad.push('ví dụ sai ' + x.a + ': ' + w); } }
    if (TC.noi.reduce((s, x) => s + x.items.length, 0) < 40 || TC.so.reduce((s, x) => s + x.items.length, 0) < 30) bad.push('thiếu từ nối / nghe số');
    for (const k of ['nghe', 'noi', 'doc', 'viet']) { tryv('cẩm nang ' + k, () => camnangView(k)); if (!String($app.innerHTML).includes('<details') || !String($app.innerHTML).includes('📘 Cẩm nang thi')) bad.push('cẩm nang ' + k + ' trống'); }
    DICT.kind = 'tu'; DICT.ex = null;
    add('cefr', 'C10', !bad.length && !errs.length, [...errs, ...bad].length ? [...errs, ...bad].slice(0, 8).join(' | ') : 'tra theo 4 kỹ năng (Nghe, Nói, Đọc, Viết), từ nối, tiền tố / hậu tố, nghe số / âm yếu đều đúng'); }
  // v93 từ điển sắp xếp lại: màn đầu ≤ 7 nút; tìm gộp nhóm; gõ tiếng Việt → tiếng Anh nói thế nào + từ dễ nhầm; mục từ 3 tầng; mẹo thi chuyển sang 🎓 Luyện thi → 📘 Cẩm nang
  { const bad = [], errs = [], tryv = (n, f) => { try { f(); } catch (e) { errs.push(n + ': ' + e.message); } }; S = blank(); await Promise.all([tcLoad(), kLoad(KIT.np), ieLoad()]); DICT.kind = null; DICT.q = ''; DICT.open = null;
    tryv('màn đầu', () => dict()); const hh = String(document.getElementById('df').innerHTML) + String(document.getElementById('dl').innerHTML), nb = (hh.match(/<button/g) || []).length;
    if (nb > 7 || !hh.includes('Từ & cụm từ') || !hh.includes('Ngữ pháp & lỗi') || !hh.includes('Phát âm') || hh.includes('data-tck="nghe"')) bad.push('màn đầu chưa gọn: ' + nb + ' nút');
    DICT.q = 'since'; tryv('tìm since', () => dictList()); const hs = String(document.getElementById('dl').innerHTML); if (!hs.includes('📚 Từ') || !hs.includes('🧱 Ngữ pháp') || !hs.includes('❗ Lỗi hay gặp')) bad.push('since chưa ra từ + ngữ pháp + lỗi');
    DICT.q = 'tăng'; tryv('tìm tăng', () => dictList()); const hv = String(document.getElementById('dl').innerHTML); if (!/Tiếng Anh nói “tăng”/.test(hv) || !['increase', 'rise', 'raise'].every(x => hv.includes('>' + x + '<'))) bad.push('tăng chưa ra increase / rise / raise');
    if (TC.pb.length < 30 || TC.pb.some(g => g.w.length < 2 || g.note.length < 2)) bad.push('nhóm từ dễ nhầm hỏng');
    const bus = WORDS.find(w => w.w === 'bus'), eb = tdEntry(bus, null); if (!eb.includes('Dùng thế nào') || /<details class="tdt" open/.test(eb.split('Mở rộng')[0])) bad.push('A1: tầng Dùng thế nào chưa gập');
    const inc = WORDS.find(w => w.w === 'increase'); if (inc && !/<details class="tdt" open[^>]*><summary><b>✍️ Dùng thế nào/.test(tdEntry(inc, null))) bad.push('từ dễ nhầm: tầng Dùng thế nào chưa mở');
    if (/<details class="tdt" open[^>]*><summary><b>🔍 Mở rộng/.test(eb)) bad.push('tầng Mở rộng phải gập');
    for (const k of ['tu', 'cum', 'tn', 'afx', 'pb', 'np', 'loi', 'pa', 'cau']) { DICT.kind = k; DICT.q = ''; tryv('mục ' + k, () => dictList()); if (!String(document.getElementById('df').innerHTML).includes('← Tra cứu')) bad.push('mục ' + k + ' thiếu nút về'); }
    ieSt().set = 1; await ieltsView(); if (!String($app.innerHTML).includes('data-cnv')) bad.push('IELTS thiếu nút Cẩm nang');
    DICT.kind = null; DICT.q = '';
    add('cefr', 'C11', !bad.length && !errs.length, [...errs, ...bad].length ? [...errs, ...bad].slice(0, 8).join(' | ') : 'từ điển sắp xếp lại: màn đầu ' + nb + ' nút, tìm gộp nhóm, Việt → Anh + từ dễ nhầm, mục từ 3 tầng, cẩm nang thi đều đúng'); }
  // v94 từ điển bổ sung cho đủ: trọng âm từ IPA, [U] / [C/U], Anh–Anh / Anh–Mỹ (cả khi tìm), giải nghĩa tiếng Anh B1+, quy tắc phát âm, IPA sai đã sửa, cụm cố định "nói đúng cả cụm"
  { const bad = [], errs = [], tryv = (n, f) => { try { f(); } catch (e) { errs.push(n + ': ' + e.message); } }; S = blank(); await tcLoad(); const W = k => WORDS.find(w => w.w === k);
    const st = k => { const r = tdSyl(W(k).ipa); return r ? [...Array(r.n)].map((_, i) => i + 1 === r.s ? 'O' : 'o').join('') : '-'; };
    const exp = { remember: 'oOo', information: 'ooOo', photograph: 'Ooo', photographer: 'oOoo', hotel: 'oO', police: 'oO', beautiful: 'Ooo', important: 'oOo', computer: 'oOo', banana: 'oOo', education: 'ooOo', economy: 'oOoo', economic: 'ooOo', engineer: 'ooO', decide: 'oO', happy: 'Oo', table: 'Oo', bottle: 'Oo', listen: 'Oo', final: 'Oo', animal: 'Ooo', film: '-', world: '-' };
    const wrong = Object.entries(exp).filter(([k, v]) => W(k) && st(k) !== v).map(([k, v]) => k + ' ' + st(k) + '≠' + v); if (wrong.length) bad.push('trọng âm sai: ' + wrong.join(', '));
    const multi = WORDS.filter(w => !/\\s/.test(w.w) && /ˈ/.test(w.ipa || '')), shown = multi.filter(w => tdSyl(w.ipa)).length; if (shown < multi.length * 0.99) bad.push('trọng âm hiện ít: ' + shown + '/' + multi.length);
    if (!tdEntry(W('remember'), null).includes('Trọng âm') || tdEntry(W('film'), null).includes('Trọng âm')) bad.push('dòng trọng âm trong mục từ sai');
    if (W('mission').ipa !== '/ˈmɪʃn/' || W('would').ipa !== '/wʊd/') bad.push('IPA mission / would chưa sửa');
    if (!tdEntry(W('information'), null).includes('[U] Không đếm được') || !tdEntry(W('time'), null).includes('[C / U]') || tdEntry(W('book'), null).includes('đếm được')) bad.push('nhãn đếm được sai');
    if (TC.unc.length < 60 || TC.cu.length < 20) bad.push('thiếu danh sách đếm được');
    if (!tdEntry(W('colour'), null).includes('Anh–Mỹ:</b> color') || !tdEntry(W('organize'), null).includes('-ise và -ize')) bad.push('Anh–Anh / Anh–Mỹ trong mục từ sai');
    if (tdMatch('color').exact !== W('colour').id || tdMatch('elevator').exact !== W('lift').id) bad.push('tìm color / elevator không ra colour / lift');
    const b1 = WORDS.find(w => !w.en && wLv(w) === 'b1'), a1w = WORDS.find(w => w.en && wLv(w) === 'a1'); if (!tdEntry(b1, null).includes('oxfordlearnersdictionaries') || tdEntry(a1w, null).includes('Giải nghĩa tiếng Anh')) bad.push('link giải nghĩa tiếng Anh sai');
    const tp = WORDS.find(w => w.w === 'take a photo'); if (tp && !tdEntry(tp, null).includes('Nói đúng cả cụm')) bad.push('cụm cố định chưa đổi nhãn');
    if (TC.am.length < 5 || !TC.am.some(s => /-ed/.test(s.t)) || TC.am.flatMap(s => s.items).length < 25) bad.push('thiếu quy tắc phát âm');
    if (TC.pb.flatMap(g => g.w).some(x => !W(x))) bad.push('từ dễ nhầm có từ không có trong app');
    tryv('màn từ điển', () => dict()); for (const k of ['dem', 'uk']) { DICT.kind = k; DICT.q = ''; tryv('mục ' + k, () => dictList()); if (!String(document.getElementById('dl').innerHTML).includes('<details')) bad.push('mục ' + k + ' trống'); }
    DICT.kind = 'pa'; DICT.q = ''; tryv('phát âm', () => dictList()); const hp = String(document.getElementById('dl').innerHTML); if (!hp.includes('Trọng âm: quy tắc') || !hp.includes('Đuôi -ed') || !hp.includes('Âm cuối')) bad.push('👄 thiếu nhóm quy tắc');
    DICT.kind = null; DICT.q = 'elevator'; tryv('tìm elevator', () => dictList()); if (!String(document.getElementById('dl').innerHTML).includes('Anh–Anh / Anh–Mỹ')) bad.push('tìm gộp thiếu nhóm Anh–Mỹ');
    DICT.kind = null; DICT.q = '';
    add('cefr', 'C12', !bad.length && !errs.length, [...errs, ...bad].length ? [...errs, ...bad].slice(0, 8).join(' | ') : 'từ điển đủ: trọng âm ' + shown + '/' + multi.length + ' từ, [U] / [C/U], Anh–Anh / Anh–Mỹ, giải nghĩa tiếng Anh B1+, quy tắc phát âm, IPA đã sửa đều đúng'); }
  // v95 điều hướng theo việc người học làm (dieuhuong.js): 4 tab 🎯 Học · 🎓 Luyện thi · 📖 Tra cứu · 👤 Của tôi; mỗi thứ MỘT chỗ ở chính, nơi khác chỉ lối tắt; Hôm nay MỘT nút ôn chung
  { const bad = [], errs = [], tryv = (n, f) => { try { f(); } catch (e) { errs.push(n + ': ' + e.message); } }, tryA = async (n, f) => { try { await f(); } catch (e) { errs.push(n + ': ' + e.message); } };
    S = blank(); await Promise.all([tcLoad(), ieLoad()]); const H = () => String($app.innerHTML), nbt = h => (h.match(/<button/g) || []).length;
    const tabs = [...IDX_.matchAll(/data-tab="(\\w+)"><i>[^<]*<\\/i>([^<]+)</g)].map(m => m[1] + ':' + m[2]).join(' ');
    if (tabs !== 'all:Học ie:Luyện thi dict:Tra cứu bk:Của tôi') bad.push('thanh dưới: ' + tabs);
    // 🎯 Học người mới: ≤ 12 nút; công cụ luyện thi, sổ lỗi, góp ý ở tab khác; chưa học gì thì chưa có việc ôn
    await tryA('Học', () => overview('pre')); const ho = H(), nh = nbt(ho); if (nh > 12) bad.push('🎯 Học người mới ' + nh + ' nút');
    if (/data-mock|id="ovtools"|id="gyhome"|Sổ lỗi của tôi|data-rev|data-sotu/.test(ho)) bad.push('🎯 Học người mới còn công cụ của tab khác / việc ôn khi chưa có gì để ôn');
    // 🎓 Luyện thi: chưa chọn kỳ thi → 🎓 Cambridge (đề thử, cẩm nang, chuyển IELTS / TOEIC); đã đặt IELTS → IELTS
    delete S.exSel; delete S.ie; CB_LV = null; await tryA('Luyện thi', () => exOpen()); const hc = H();
    if (!hc.includes('Thi Cambridge') || !/data-mock="/.test(hc) || !hc.includes('data-cnv="cefr"') || !hc.includes('data-exsel="ielts"') || !hc.includes('id="ie"')) bad.push('Luyện thi chưa mở Cambridge đủ');
    ieSt().set = 1; if (exSel() !== 'ielts') bad.push('đã đặt IELTS mà Luyện thi không mở IELTS'); S.exSel = 'cefr'; if (exSel() !== 'cefr') bad.push('chọn Cambridge không giữ');
    await tryA('về Cambridge', () => exHome('a2')); if (!/class="chip on" data-cbl="a2"/.test(H())) bad.push('nút về của công cụ Cambridge không giữ cấp');
    // 📘 Cẩm nang: chỗ ở chính 📖 Tra cứu (sáng 📖, về Tra cứu); từ Luyện thi là lối tắt (sáng 🎓, về Luyện thi)
    tryv('Tra cứu', () => dict()); if (!String(document.getElementById('dl').innerHTML).includes('data-cnv="tc"')) bad.push('Tra cứu thiếu thẻ Cẩm nang');
    tryv('cẩm nang từ Tra cứu', () => camnangView('nghe', 'tc')); if (!H().includes('id="tcv"') || !H().includes('← Tra cứu')) bad.push('cẩm nang từ Tra cứu sai');
    tryv('cẩm nang từ Luyện thi', () => camnangView('doc', 'ex', 'cefr')); if (!H().includes('id="ie"') || !H().includes('← Luyện thi') || DICT.ex !== 'cefr') bad.push('cẩm nang từ Luyện thi sai');
    // 👤 Của tôi: tiến độ, bản đồ, sổ từ, sổ lỗi, đề thật, dữ liệu, góp ý; mở con nào cũng sáng 👤 và về Của tôi
    const go = WORDS.find(w => w.w === 'go'); tryv('lưu sổ', () => tdSave(go)); errAdd([{ wrong: 'He go to school.', correct: 'He goes to school.', why_vi: 'ngôi thứ ba số ít' }], 'test');
    S.ie.th = [{ at: Date.now(), sk: 'R', name: 'Cambridge 18 Test 1', ok: 30, band: 7, wrong: [], blocks: [] }];
    await tryA('Của tôi', () => minhView()); const hm = H();
    for (const k of ['id="bk"', '📈 Tiến độ', '🗺 Bản đồ chỗ yếu', '📌 Sổ từ', '📒 Sổ lỗi', '📊 Kết quả thi thật', '30/40', 'data-ct="data"', 'id="gyhome"']) if (!hm.includes(k)) bad.push('Của tôi thiếu ' + k);
    MAP_BACK = 'ct'; await tryA('bản đồ từ Của tôi', () => mapView()); if (!H().includes('id="bk"') || !H().includes('← Của tôi')) bad.push('bản đồ từ Của tôi sai'); MAP_BACK = 'hoc';
    tryv('sổ từ từ Của tôi', () => sotuView(minhView)); if (!H().includes('id="bk"') || !H().includes('← Của tôi')) bad.push('sổ từ từ Của tôi sai');
    tryv('dữ liệu', () => backup()); if (!H().includes('id="bk"') || !H().includes('data-bk="ct"')) bad.push('Dữ liệu thiếu nút về Của tôi');
    // 📅 Hôm nay: MỘT nút ôn gom sổ lỗi + sổ từ + bài CEFR; bấm thì đi lần lượt sổ lỗi → sổ từ → phần nhiều bài đến hạn
    const tb = todayBox('pre'), nr = (tb.match(/data-rev/g) || []).length; if (nr !== 1 || /data-sotu/.test(tb) || !/Ôn 2 mục đến hạn \\(1 lỗi · 1 từ sổ từ\\)/.test(tb)) bad.push('Hôm nay chưa có đúng một nút ôn chung: ' + nr);
    const calls = [], e0 = errRun, v0 = vwRun; errRun = (next, quit) => { calls.push('lỗi'); next(); }; vwRun = (now, next, quit) => { calls.push('từ'); next(); };
    tryv('ôn chung', () => revRun()); errRun = e0; vwRun = v0; if (calls.join(',') !== 'lỗi,từ') bad.push('thứ tự ôn chung sai: ' + calls.join(','));
    S.ie.vw = []; S.err = []; if (revCount().n !== (todayDue() || 0)) bad.push('đếm ôn chung sai');
    CB_LV = null; delete S.exSel;
    add('cefr', 'C13', !bad.length && !errs.length, [...errs, ...bad].length ? [...errs, ...bad].slice(0, 8).join(' | ') : '4 tab (Học · Luyện thi · Tra cứu · Của tôi), 🎯 Học người mới ' + nh + ' nút, Cambridge ở Luyện thi, Cẩm nang 2 lối vào, Của tôi đủ 7 ô, Hôm nay một nút ôn chung đều đúng'); }
  // v96 📘 Luật và cách dùng (huongdan.js): một chỗ ở 👤 Của tôi; số trong chữ lấy từ hằng số của mã; tìm được
  { const bad = [], errs = [], tryv = (n, f) => { try { f(); } catch (e) { errs.push(n + ': ' + e.message); } }; S = blank(); const H = () => String($app.innerHTML);
    await minhView(); if (!H().includes('data-hdv')) bad.push('Của tôi thiếu nút Luật và cách dùng');
    HD_Q = ''; tryv('mở', () => hdView()); const h = String(document.getElementById('hdl').innerHTML), nsec = (h.match(/data-hd="/g) || []).length;
    if (!H().includes('id="bk"') || !H().includes('← Của tôi') || nsec !== HD.length || nsec < 12) bad.push('màn luật sai: ' + nsec + ' mục');
    const all = HD.map(x => x[2]()).join(' ');
    for (const [n, v] of [['GATE_MEM', GATE_MEM + '%'], ['MEM_R', Math.round(MEM_R * 100) + '%'], ['MAP_ACT', MAP_ACT + ' chỗ'], ['MAP_PARK_D', MAP_PARK_D + ' ngày'], ['VC_WAIT', 'sau ' + VC_WAIT + ' ngày'], ['K_RETRY', K_RETRY + ' ngày sau thi lại'], ['ACT_DAY_MIN', ACT_DAY_MIN + ' phút'], ['VW_DAYS', VW_DAYS.join(' → ')], ['viết', Math.round(KIT.viet.pass * 100) + '%'], ['GATE_LEARN', 'Học ' + GATE_LEARN + '%'], ['GATE_HOLD_D', 'Giữ mở ' + GATE_HOLD_D + ' ngày'], ['đọc', 'Đọc ' + Math.round(KIT.doc.pass * 100) + '%']]) if (!all.includes(v)) bad.push('chữ thiếu số ' + n + ' = ' + v);
    if (/undefined|NaN/.test(all)) bad.push('chữ có undefined / NaN');
    HD_Q = 'nhớ giảm'; tryv('tìm', () => hdList()); const hq = String(document.getElementById('hdl').innerHTML); if (!hq.includes('Vì sao 🔁 Nhớ giảm') || (hq.match(/data-hd="/g) || []).length >= HD.length) bad.push('tìm "nhớ giảm" sai');
    HD_Q = 'nho giam'; tryv('tìm không dấu', () => hdList()); if (!String(document.getElementById('hdl').innerHTML).includes('Vì sao 🔁 Nhớ giảm')) bad.push('tìm không dấu sai');
    HD_Q = '';
    add('cefr', 'C14', !bad.length && !errs.length, [...errs, ...bad].length ? [...errs, ...bad].slice(0, 8).join(' | ') : 'Luật và cách dùng: ' + nsec + ' mục ở Của tôi, số khớp hằng số trong mã, tìm có / không dấu đều đúng'); }
  // v97 luật đo mới (người sáng lập duyệt 31/10/2026): 📘 Học 90%; 🔁 Nhớ Từ vựng: mặt tự tạo ra chỉ ở từ ≤ A2+, 🗣 Nói ra từ tham khảo; cổng giữ mở 7 ngày;
  // đề Từ vựng B1+: câu gõ chỉ hỏi từ ≤ A2+; Nói / Viết không chặn hoàn thành cấp; ngưỡng 2 bậc; "hoàn thành trong app" tách khỏi "đạt" (đề mẫu chính thức)
  { const bad = [], errs = [], tryv = (n, f) => { try { f(); } catch (e) { errs.push(n + ': ' + e.message); } }; S = blank(); const now = Date.now(), D = 864e5, H = () => String($app.innerHTML);
    if (GATE_LEARN !== 90 || GATE_MEM !== 80 || GATE_HOLD_D !== 7) bad.push('hằng số cổng');
    const g = (lq, mq, t) => gateOpen({ lq, mq }, 'x|a1', t);
    if (!g(90, 80, now) || g(89, 95, now)) bad.push('cổng Học 90% sai');
    if (!g(95, 60, now + 6 * D) || g(95, 60, now + 8 * D) || g(50, 60, now + D)) bad.push('giữ mở 7 ngày sai');
    // Từ vựng: mặt tự tạo ra theo cấp của từ; 🗣 Nói ra từ không tính cổng
    const wa = WORDS.find(w => wLv(w) === 'a1' && w.cloze), wb = WORDS.find(w => wLv(w) === 'b1' && w.cloze), PR = ['nhora', 'viet', 'dung'];
    if (!PR.every(k => wDims(wa, 'b1').includes(k)) || PR.some(k => wDims(wb, 'b1').includes(k)) || !wDims(wb, 'b1').includes('nghia')) bad.push('mặt tự tạo ra theo cấp từ sai');
    S = blank(); for (const w of levelWords('pre')) S.cards[w.id] = { S: 200, last: now, d0: dayOf(now) - 5, ok: 1, pv: 1, n: 3, lapse: 0, dm: Object.fromEntries(wDims(w, 'pre').filter(k => k !== 'noi').map(k => [k, { ok: 1, pv: 1, n: 2 }])) };
    const p = parts(S, now, 'pre'); if (p.gk.includes('noi') || p.dq.noi !== 0 || p.mq < GATE_MEM || !gateOpen(p, 'tv|pre', now) || !held(S.cards[levelWords('pre')[0].id], now, levelWords('pre')[0], 'pre')) bad.push('🗣 Nói ra từ vẫn chặn cổng: mq ' + p.mq);
    // đề Từ vựng: B2 câu gõ chỉ hỏi từ ≤ A2+; A1 giữ đủ câu gõ
    let bT = 0; for (let r = 0; r < 20; r++) for (const it of xAssign(XL.b2.MIX, [...shuf(levelWords('b2')).slice(0, 28), ...shuf(cumWords('b1p')).slice(0, 12)])) if (it.type === 'xT' && lvIdx(wLv(it.w)) > lvIdx(VPROD_MAX)) bT++;
    if (bT) bad.push('câu gõ hỏi từ B1+: ' + bT);
    const a1q = xAssign(XL.a1.MIX, shuf(levelWords('a1')).slice(0, 40)); if (a1q.length !== 40 || a1q.filter(x => x.type === 'xT').length < 18) bad.push('đề A1 đổi số câu gõ');
    // hoàn thành cấp: Nói / Viết tham khảo
    if (!ovRef('noi') || !ovRef('viet') || ovRef('np') || ovReq('a1').some(([id]) => ovRef(id)) || !OV.some(([id]) => id === 'noi' && ovIn(id, 'a1'))) bad.push('phần bắt buộc sai');
    S = blank(); for (const lv of ['pre', 'a1']) for (const [id] of ovReq(lv)) { const r = { lv, at: now, ok: 10, n: 10, pass: true }; if (id === 'tv') xs().runs.push(r); else if (id === 'pa') paRuns().push(r); else kSt(id).runs.push(r); }
    if (!ovDone('a1') || ovStage() !== 'a2') bad.push('Nói / Viết chưa qua vẫn chặn hoàn thành A1: ' + ovStage());
    // ngưỡng 2 bậc
    if (KIT.np.pass !== 0.85 || PA_PASS !== 0.85 || KIT.doc.pass !== 0.75 || KIT.nghe.pass !== 0.75 || KIT.noi.pass !== 0.7 || KIT.viet.pass !== 0.7) bad.push('ngưỡng 2 bậc sai');
    // tên: "hoàn thành trong app"; "đạt" chỉ cho đề mẫu chính thức
    await overview('a1'); if (!H().includes('Hoàn thành A1 trong app') || /Đạt A1 khi|đã đạt \\d|✅ đã đạt/.test(H())) bad.push('Tổng quan còn chữ đạt cấp');
    await minhView(); if (!H().includes('hoàn thành trong app: Pre-A1, A1') || !H().includes('Đạt bằng đề mẫu chính thức') || /Đạt bằng đề mẫu chính thức: <b>/.test(H())) bad.push('Của tôi chưa tách hoàn thành / đạt');
    realRuns('a1').push({ at: now, l: 25, L: 25, rw: 40, RW: 40 }); await minhView(); if (!/Đạt bằng đề mẫu chính thức: <b>A1/.test(H())) bad.push('đạt bằng đề mẫu chính thức chưa hiện');
    const P = KIT.np; tryv('màn Ngữ pháp', () => kView('np')); if (/Đã đạt|Chưa đạt/.test(H())) bad.push('màn phần còn chữ đạt');
    add('cefr', 'C15', !bad.length && !errs.length, [...errs, ...bad].length ? [...errs, ...bad].slice(0, 8).join(' | ') : 'luật mới: Học 90%, giữ mở 7 ngày, mặt tự tạo ra chỉ từ ≤ A2+, 🗣 tham khảo, câu gõ B1+ hỏi từ thông dụng, Nói / Viết không chặn, ngưỡng 2 bậc, hoàn thành ≠ đạt đều đúng'); }
  // v99 (nhật ký trải nghiệm vai giáo viên ôn IELTS): dùng kết quả xếp cấp; câu xếp cấp khó đoán hơn; Đọc 13–14 câu / bài, đề thử 40 câu;
  // nhập đề thật phải chọn dạng; tìm tiếng Việt đủ dấu; máy chấm Viết nhận ví dụ cụ thể; 👄 Phát âm tham khảo
  { const bad = [], errs = [], tryv = (n, f) => { try { f(); } catch (e) { errs.push(n + ': ' + e.message); } }; S = blank(); await Promise.all([ieLoad(), tcLoad()]); const H = () => String($app.innerHTML);
    // câu xếp cấp: nhiễu cùng loại từ, không trùng nghĩa, không đồng / trái nghĩa
    let nd = 0, badD = [];
    for (const w of shuf(WORDS.filter(w => ['b2', 'c1'].includes(wLv(w)) && w.vi)).slice(0, 60)) { const d = plDis(w); if (d.length < 3) continue; nd++;
      const dw = d.map(v => WORDS.find(x => x.vi === v && x.pos.split(',')[0] === w.pos.split(',')[0])); if (dw.some(x => !x)) badD.push(w.w + ': khác loại từ');
      const rel = w.rel ? [...w.rel.syn, ...w.rel.ant] : []; if (dw.some(x => x && rel.includes(x.w))) badD.push(w.w + ': nhiễu là từ đồng / trái nghĩa'); }
    if (nd < 40 || badD.length) bad.push('nhiễu xếp cấp: ' + nd + ' từ đủ nhiễu; ' + badD.slice(0, 3).join(', '));
    for (const lv of PL_LV) { const qs = plQs(lv); if (qs.length !== 5 || qs.some(it => !it.q.opts.includes(it.q.a) || new Set(it.q.opts).size !== it.q.opts.length)) bad.push('xếp cấp ' + lv + ' hỏng'); }
    // dùng kết quả xếp cấp
    S.place = { at: Date.now(), top: 'c1', start: 'c2' }; if (plTop('pre') !== 'c1' || plLeft('c1').length < 3) bad.push('plTop / plLeft sai');
    const tb = todayBox('pre'); if (!/data-vcv="c1"[^>]*>⬜ 🚀 Bạn xếp cấp C1/.test(tb) || !tb.includes('data-plno') || /⬜ Học 1 bài mới/.test(tb)) bad.push('Hôm nay chưa gợi ý thi vượt theo xếp cấp');
    await overview(); if (!H().includes('xếp cấp: C1')) bad.push('Tổng quan thiếu dòng xếp cấp');
    CB_LV = null; await cbView(); if (!/class="chip on" data-cbl="c1"/.test(H())) bad.push('Cambridge chưa mở ở cấp xếp được'); CB_LV = null;
    S.place.no = 1; if (plTop('pre') || /data-vcv/.test(todayBox('pre'))) bad.push('chọn học từ đầu vẫn gợi ý thi vượt'); delete S.place;
    // Đọc: 13–14 câu / bài, đề thử Academic 40 câu, mỗi dạng ≥ 2 câu
    for (const x of IE.doc) { const q = ieCap(ieRQs(x), 14), ks = [...new Set(ieRQs(x).map(z => z.k))]; if (q.length !== Math.min(14, ieRQs(x).length) || ks.some(k => q.filter(z => z.k === k).length < Math.min(2, ieRQs(x).filter(z => z.k === k).length))) bad.push('cắt câu bài ' + x.id + ' sai'); }
    ieSt().type = 'ac'; const rp = IE_PAPERS.find(p => p.k === 'R').gen(); if (rp.length !== 40) bad.push('đề thử Đọc ' + rp.length + ' câu (cần 40)');
    // nhập đề thật: dạng để trống, phải chọn; chưa chọn thì không vào bản đồ theo dạng
    TH = null; tryv('nhập đề thật', () => ieThat('R')); if (!H().includes('— chọn dạng —') || TH.blocks.some(b => b[2])) bad.push('nhập đề thật còn điền sẵn dạng');
    const ty0 = JSON.stringify(ieSt().ty || {}); TH.wrong.add(3); tryv('lưu đề thật', () => thSave()); if (JSON.stringify(ieSt().ty || {}) !== ty0 || !(ieSt().th || []).length) bad.push('đề thật chưa chọn dạng mà vẫn ghi theo dạng');
    // tìm tiếng Việt đủ dấu
    const tg = tcWordHits('tăng').all; if (!tg.length || tg.some(w => !w.vi.toLowerCase().includes('tăng') && !tdMatch('tăng').ids.has(w.id))) bad.push('tìm "tăng" lẫn từ khác: ' + tg.filter(w => !w.vi.toLowerCase().includes('tăng')).slice(0, 3).map(w => w.w).join(','));
    if (!tcWordHits('tang').all.length) bad.push('gõ không dấu không ra gì');
    // máy chấm Viết: ví dụ cụ thể không có từ báo hiệu
    if (!IE_EG.test('governments could tax sugary drinks, as the united kingdom did in 2018.') || !IE_EG.test('about 30% of children') || IE_EG.test('children like sweets.')) bad.push('nhận ví dụ sai');
    // 👄 Phát âm tham khảo
    if (!ovRef('pa') || ovReq('pre').some(([id]) => id === 'pa') || ovReq('pre').length !== 4) bad.push('Phát âm chưa thành tham khảo');
    add('cefr', 'C16', !bad.length && !errs.length, [...errs, ...bad].length ? [...errs, ...bad].slice(0, 8).join(' | ') : 'xếp cấp dùng được + nhiễu khó đoán (' + nd + ' từ), Đọc 13–14 câu / đề thử 40, đề thật phải chọn dạng, tìm đủ dấu, nhận ví dụ, Phát âm tham khảo đều đúng'); }
  // v100 đề thi không lặp bài: bài thi ít dùng nhất trước (id ghi vào lần thi); B1+ có thêm bài thi dài (Đọc 6 câu, 4 phương án; Nghe có câu suy luận), đề Viết / Nói dành cho thi
  { const bad = [], errs = [], tryv = (n, f) => { try { f(); } catch (e) { errs.push(n + ': ' + e.message); } }; S = blank();
    const BL = ['b1', 'b2', 'c1', 'c2'];
    for (const lv of BL) { const nd = KIT.doc.items.filter(x => x.lv === lv && x.test), nn = KIT.nghe.items.filter(x => x.lv === lv && x.test), nv = KIT.viet.items.filter(x => x.lv === lv && x.test), ns = KIT.noi.items.filter(x => x.lv === lv && x.test);
      if (nd.length < 9 || nn.length < 9 || nv.length < 6 || ns.length < 6) bad.push(lv + ' thiếu bài thi: ' + [nd.length, nn.length, nv.length, ns.length].join('/'));
      for (const x of nd.filter(x => x.qs.length >= 6)) if (x.qs.some(q => q.w.length !== 3 || q.w.includes(q.a))) bad.push('câu đọc 4 phương án hỏng ' + x.id); }
    // thi liên tiếp không gặp lại bài: Đọc / Viết 2 lần, Nghe 3 lần
    const ids = qs => new Set(qs.map(q => q.x && q.x.id).filter(Boolean)), take = (P, lv) => { const q = P.exam(lv), s = ids(q); kSt(P.id).runs.push({ lv, at: Date.now() + kSt(P.id).runs.length * 1000, ok: 0, n: q.length, pass: false, ids: [...s] }); return [s, q.length]; };
    for (const [id, k] of [['doc', 2], ['nghe', 3], ['viet', 2]]) for (const lv of BL) { const P = KIT[id]; kSt(id).runs = []; const sets = []; let nq = 0;
      for (let i = 0; i < k; i++) { const [s, n] = take(P, lv); sets.push(s); nq = n; }
      for (let i = 1; i < k; i++) if ([...sets[i]].some(x => sets.slice(0, i).some(p => p.has(x)))) bad.push(id + ' ' + lv + ': lần thi ' + (i + 1) + ' gặp lại bài cũ');
      if (id !== 'viet' && nq < 15) bad.push(id + ' ' + lv + ': đề chỉ ' + nq + ' câu'); }
    for (const lv of BL) { KIT.noi.raw = KIT.noi.raw || {}; const q = KIT.noi.exam(lv), talks = q.filter(x => x.k === 'viec'); if (talks.length !== 2 || talks.some(t => !t.x.test)) bad.push('Nói ' + lv + ': đề thi không phải 2 đề dành cho thi'); }
    for (const id of ['doc', 'nghe', 'viet', 'noi']) kSt(id).runs = [];
    add('cefr', 'C17', !bad.length && !errs.length, [...errs, ...bad].length ? [...errs, ...bad].slice(0, 8).join(' | ') : 'đề thi B1+ không lặp bài (Đọc, Viết 2 lần · Nghe 3 lần liên tiếp), đủ bài thi mỗi cấp, Nói 2 đề dành cho thi'); }
  // v101 cách học Từ vựng 4 bậc + Ngữ pháp 5 bậc (người sáng lập chốt 31/10/2026): bậc quyết định thứ tự giới thiệu mặt mới; bài học ngày đầu chỉ bậc 1 (Từ vựng) / bậc 1–2 (Ngữ pháp)
  { const bad = [], errs = [], tryv = (n, f) => { try { f(); } catch (e) { errs.push(n + ': ' + e.message); } }; S = blank(); const now = Date.now();
    // Từ vựng: bậc mở dần; bước đệm xếp chữ / chọn từ điền câu
    await bkSet('tv', 'pre', 'dat');   // đang học A1 (typeFor dùng cấp đang học)
    const w = levelWords('a1').find(x => x.cloze), c = S.cards[w.id] = { S: 2, last: now - 864e5, d0: dayOf(now) - 1, ok: 1, pv: 0, n: 1, lapse: 0, dm: {} };
    if (vStage(c, w, 'a1') !== 0) bad.push('từ mới không ở bậc 1');
    for (let i = 0; i < 30; i++) { const t = typeFor(c, now, w); if (!['w2vi', 'listen', 'form'].includes(t)) { bad.push('bậc 1 hỏi dạng ' + t); break; } }
    for (const k of ['nghia', 'nghe', 'chu']) c.dm[k] = { ok: 1, pv: 1, n: 1 };
    if (vStage(c, w, 'a1') !== 1) bad.push('đúng bậc 1 chưa mở bậc 2');
    const t2 = new Set(); for (let i = 0; i < 80; i++) t2.add(typeFor(c, now, w)); if (!t2.has('spell') || !t2.has('clozeT') || t2.has('tiles') || t2.has('cloze')) bad.push('tầng 2 (bậc 2 + 3) hỏi sai dạng: ' + [...t2].join(','));
    const Q = question(w, 'tiles'); if (!Q.typed || !Q.tiles || Q.tiles.slice().sort().join('') !== [...w.w].map(ch => ch === ' ' ? '␣' : ch).sort().join('')) bad.push('câu xếp chữ cái hỏng');
    const S0 = c.S, n0 = c.n; grade(S, w.id, true, now, 'tiles'); if (c.S !== S0 || c.n !== n0) bad.push('bước xếp chữ đổi lịch ôn');
    if (VEASY.spell !== 'tiles' || VEASY.clozeT !== 'cloze' || VEASY.form !== 'vi2w') bad.push('thiếu dạng dễ hơn cho lượt làm lại');
    await bkSet('tv', 'a2p', 'dat');   // đang học B1: chưa vững bậc 1 thì chỉ hỏi bậc 1; sai câu bậc trên thì làm lại bằng dạng dễ hơn
    const wb = levelWords('b1').find(x => wDims(x, 'b1').some(k => VSTAGE[3][1].includes(k)));
    if (wb) { const cb = { S: 2, last: now - 864e5, d0: dayOf(now) - 1, ok: 1, pv: 0, n: 1, lapse: 0, dm: { nghia: { ok: 1 } } };
      const tb = new Set(); for (let i = 0; i < 60; i++) tb.add(typeFor(cb, now, wb)); if ([...tb].some(t => !['w2vi', 'listen', 'form'].includes(t))) bad.push('B1: chưa vững bậc 1 mà hỏi ' + [...tb].join(',')); }
    const wc = WORDS.find(x => x.col && x.cloze); if (!wc || vEasy(wc, 'colT') !== 'col' || vEasy(wc, 'clozeT') !== 'cloze' || vEasy(wc, 'w2vi') !== null) bad.push('dạng dễ hơn khi làm lại sai');
    if (lessonTypes(w, reqsUpTo('a1')).some(t => !['w2vi', 'listen', 'form'].includes(t))) bad.push('bài học còn hỏi bậc 2+');
    // Ngữ pháp
    const P = KIT.np, A = P.items.filter(x => ['pre', 'a1', 'a2'].includes(x.lv));
    if (A.some(x => !x.hieu || x.hieu.length < 2)) bad.push('thiếu câu kiểm tra hiểu: ' + A.filter(x => !x.hieu).map(x => x.id).join(','));
    for (const x of A) for (const q of P.q(x, 'hieu', 'learn')) if (!q.opts.includes(q.a) || new Set(q.opts).size !== 3) bad.push('câu hiểu hỏng ' + x.id);
    let nt = 0; for (const x of P.items) for (const q of P.q(x, 'tap', 'learn')) { nt++; if (!q.opts.includes(q.a)) bad.push('chạm chỗ sai hỏng ' + x.id); }
    if (nt < 30) bad.push('ít điểm có câu chạm chỗ sai: ' + nt);
    const x0 = A[0], tq = P.tryQs(x0); if (tq[0].k !== 'hieu' || tq.some(q => ['dien', 'sua'].includes(q.k))) bad.push('bài học ngữ pháp không theo bậc 1–2');
    const st = kSt('np').cards; st[x0.id] = { S: 2, last: now, d0: dayOf(now) - 1, ok: 1, pv: 0, n: 1, lapse: 0, dm: {} };
    if (npBac(x0).some(q => q.k !== 'nhan')) bad.push('chưa vững nhận ra mà hỏi bậc 3');
    st[x0.id].dm.nhan = { ok: 1, pv: 1, n: 1 }; const kb = new Set(); for (let i = 0; i < 30; i++) npBac(x0).forEach(q => kb.add(q.k)); if (!kb.has('dien') || kb.has('hieu')) bad.push('bậc 3 hỏi sai: ' + [...kb].join(','));
    if (npTron() !== false) bad.push('chưa học đủ nhóm mà vẫn trộn');
    const g = P.raw.nhom.find(n => n.id === 'n-ht'); for (const id of g.ids) st[id] = st[id] || { S: 2, last: now, d0: dayOf(now) - 1, ok: 1, pv: 0, n: 1, lapse: 0, dm: {} };
    const tr = npTron(); if (!tr || new Set(tr.qs.map(q => q.x.id)).size < 2 || tr.qs.some(q => !['nhan', 'dien'].includes(q.k))) bad.push('trộn điểm dễ nhầm hỏng');
    const by = kGrade(P, [{ x: x0, k: 'tap', ok: true }, { x: x0, k: 'hieu', ok: true }]); if (by.length || !st[x0.id].tp) bad.push('câu bước đệm vẫn bị chấm mặt');
    if (!['bac', 'tron', 'dung'].every(m => P.menu.some(e => e[0] === m))) bad.push('thiếu mục luyện theo bậc / trộn / dùng');
    add('cefr', 'C18', !bad.length && !errs.length, [...errs, ...bad].length ? [...errs, ...bad].slice(0, 8).join(' | ') : 'Từ vựng 4 bậc (mở dần, xếp chữ cái, bài học bậc 1) và Ngữ pháp 5 bậc (hiểu, chạm chỗ sai, luyện theo bậc, trộn điểm dễ nhầm) đều đúng'); }
  // v101 Nghe / Đọc: 💡 / 🔍 đo trên bài mới (chưa gặp hoặc ≥ K_FRESH_D ngày), nghe 3 lượt, núm theo cấp, bậc luyện thêm (tách âm, hiểu câu, dò có giờ, đoán nghĩa)
  { const bad = [], errs = [], tryv = (n, f) => { try { f(); } catch (e) { errs.push(n + ': ' + e.message); } }; S = blank(); const now = Date.now();
    tryv('fresh', () => { const P = KIT.doc, x = kItems(P, 'pre')[0];
      if (!kIsFresh(P, x)) bad.push('bài chưa làm mà không phải bài mới');
      const qs = P.newQs(x), res = qs.map((q, i) => ({ x, k: q.k, ok: i !== 1, q })); const by = kGrade(P, res), c = kSt('doc').cards[x.id];
      if (!c || !c.seen || !c.dm.y || !c.dm.y.fq || c.dm.y.pv !== 1) bad.push('làm bài mới không ghi bằng chứng');
      const by2 = kGrade(P, res.map(r => ({ ...r, ok: true }))); if (by2.some(b => b[2] != null)) bad.push('làm lại bài vừa gặp vẫn tính');
      if (c.dm.ct.fq[0] !== res.filter(r => r.k === 'ct' && r.ok).length) bad.push('làm lại bài vừa gặp ghi đè kết quả bài mới');
      c.seen = now - (K_FRESH_D + 1) * DAY; if (!kIsFresh(P, x)) bad.push('quá 30 ngày chưa thành bài mới');
      const p = kParts(P, 'pre'); if (!(p.dq.y > 0 && p.dq.y <= 100 / 0.9 * 1 / kItems(P, 'pre').length * 100)) bad.push('Nhớ ý chính tính sai: ' + p.dq.y);
      if (!kHeld(P, c, 'y', now + 400 * DAY)) bad.push('mặt bài mới bị giảm theo ngày'); });
    tryv('nghe', () => { const P = KIT.nghe, xa = P.items.find(x => x.lv === 'a2' && !x.test), xb = P.items.find(x => x.lv === 'b2' && !x.test), xp = P.items.find(x => x.lv === 'pre' && !x.test);
      const qa = P.newQs(xa), y = qa.find(q => q.k === 'y'), c = qa.filter(q => q.k === 'ct');
      if (y.after || y.play.max !== 1 || !c.length || c[0].play.key !== xa.id + '|2' || c[0].play.max !== 1) bad.push('nghe 3 lượt A2 sai');
      const qb = P.newQs(xb); if (qb.filter(q => q.k !== 'chep').some(q => q.play.key !== xb.id || q.play.max !== 1)) bad.push('B2+ chưa nghe 1 lần');
      const qp = P.newQs(xp); if (qp.find(q => q.k === 'y').play.max !== 2 || !qp.every(q => q.rate === 0.85)) bad.push('Pre-A1 chưa chậm / 3 lần');
      if (kRead(P, xp, 'y', true)[0].play.max !== 3 || kRead(P, xa, 'y', true)[0].play.max !== 2) bad.push('núm số lần nghe khi luyện sai');
      const T = ngTach(); if (!T || T.qs.length < 3 || T.qs.some(q => !q.q.includes('____') || !q.opts.includes(q.a) || q.opts.length < 2)) bad.push('tách âm hỏng: ' + (T ? T.qs.length : 0));
      if (!ngVar('fifteen').includes('fifty') || !ngVar('walked').includes('walk')) bad.push('từ nghe gần giống sai: ' + ngVar('walked')); });
    tryv('doc', () => { const C = docCau(); if (!C || C.qs.length < 4 || C.qs.some(q => !q.opts.includes(q.a) || new Set(q.opts).size !== q.opts.length)) bad.push('hiểu câu hỏng');
      const D = docDo(); if (!D || D.qs.some(q => !(q.secs >= 15 && q.secs <= 60) || q.k !== 'do')) bad.push('dò có giờ hỏng');
      const x = KIT.doc.items.find(z => z.lv === 'b1' && !z.test); kSt('doc').cards[x.id] = { S: 1, last: now, d0: dayOf(now), ok: 1, pv: 0, n: 0, lapse: 0, seen: now };
      const A = (() => { const st = kSt('doc'); st.runs.push({ lv: 'pre', pass: true, at: now }, { lv: 'a1', pass: true, at: now }); return docDoan(); })();
      if (!A || A.qs.some(q => !q.q.includes('<b>') || !q.opts.includes(q.a))) bad.push('đoán nghĩa từ hỏng');
      if (kGrade(KIT.doc, [...C.qs, ...D.qs, ...(A ? A.qs : [])].map(q => ({ x: q.x, k: q.k, ok: true, q }))).length) bad.push('câu luyện thêm bị chấm mặt');
      const t = KIT.doc.items[0].text, c0 = kCover(t); for (const w of WORDS) S.cards[w.id] = S.cards[w.id] || { S: 1, last: now, d0: dayOf(now), ok: 1, pv: 0, n: 0, lapse: 0 };
      const c1 = kCover(t); if (!(c0 < c1 && c1 >= 90)) bad.push('độ phủ từ sai: ' + c0 + ' → ' + c1); });
    tryv('bando', () => { const x = kItems(KIT.doc, 'pre')[0], c = kSt('doc').cards[x.id]; if (c && c.dm.y.ok && mapFace(c, 'y', now + 400 * DAY) !== 'vung') bad.push('mặt bài mới bị coi là quên'); });
    add('cefr', 'C19', !bad.length && !errs.length, [...errs, ...bad].length ? [...errs, ...bad].slice(0, 8).join(' | ') : 'Nghe / Đọc đo trên bài mới (30 ngày), nghe 3 lượt, núm số lần / tốc độ theo cấp, tách âm, hiểu câu, dò có giờ, đoán nghĩa, độ phủ từ'); }
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
    tryv('tốc độ', () => toSpeed('p5')); tryv('tốc độ p7', () => toSpeed('p7')); S.to.date = new Date(Date.now() + 21 * 864e5).toISOString().slice(0, 10); if (!/Còn <b>[34] tuần/.test(toInsights())) bad.push('ngày thi sai');
    S.to.r = {}; for (const x of TO.p5.filter(x => x.t === 'prep')) S.to.r[x.id] = { at: 1, ok: 0, n: 1, k: 'p5' }; for (const x of TO.p5.filter(x => x.t !== 'prep')) S.to.r[x.id] = { at: 1, ok: 1, n: 1, k: 'p5' };
    for (const k of ['p2', 'p3', 'p4', 'p6', 'p7']) S.to.r['z' + k] = { at: 1, ok: 5, n: 5, k };
    S.to.voc = {}; const td = toToday(); if (td[0] !== 'data-top="t:prep"') bad.push('nên làm hôm nay không chỉ dạng yếu: ' + td[0]);
    add('toeic', 'T1', !bad.length && !errs.length, [...errs, ...bad].length ? [...errs, ...new Set(bad)].slice(0, 8).join(' | ') : 'màn, 6 Part, đề thử, quy đổi ước, mốc CEFR, hiệu chỉnh, từ vựng, giọng đọc đều đúng'); }
  // 🗺 Bản đồ điểm TOEIC (tomap.js + focus.js, v84): lịch sử theo dạng / bẫy (có mẫu số), ngưỡng theo mục tiêu, nhóm 3 (Nghe ≤ 2, Đọc ≤ 2), chỉ bài mới tính, tốc độ, kho ≥ 20 bộ
  { const bad = [], errs = [], tryv = (n, f) => { try { f(); } catch (e) { errs.push(n + ': ' + e.message); } }; await toLoad(); delete S.to; const o = toSt(), now = Date.now(), D = 864e5;
    if (TO.p3.length < 20 || TO.p4.length < 20 || TO.p6.length < 20 || TO.p7.length < 20 || TO.p5.filter(x => x.t === 'struct').length < 16) bad.push('kho chưa đủ 20 bộ mỗi Part');
    if (toTh() !== 0.6) bad.push('ngưỡng mục tiêu 600 sai: ' + toTh()); o.target = 850; if (toTh() !== 0.85) bad.push('ngưỡng 850 sai'); o.target = 600;
    // v99: chỉ chỗ yếu đủ chắc (≥ 8 câu ở ≥ 2 bài) vào nhóm đang chữa: 3 câu sai chưa đủ
    toLog(TO.p5.filter(x => x.t === 'prep').slice(-3).map(x => ({ q: toP5Q(x), ok: false, ans: 'x' })), 'thi'); if (tmFocus(now).act.length || !tmWeak().some(w => w.u === 'p5:prep' && !w.sure)) bad.push('3 câu sai đã vào nhóm đang chữa'); o.ty = {}; o.fo = {};
    const prep = TO.p5.filter(x => x.t === 'prep').slice(0, 8), voc = TO.p5.filter(x => x.t === 'voc').slice(0, 8), p2 = TO.p2.filter(x => x.tr.includes('rep')).slice(0, 8);
    const res = [...prep.map(x => ({ q: toP5Q(x), ok: false, ans: 'x' })), ...voc.map(x => ({ q: toP5Q(x), ok: true, ans: x.a })), ...p2.map(x => ({ q: toP2Q(x), ok: false, ans: 'ABC'[x.tr.indexOf('rep')] }))];
    const by = toLog(res, 'thi'); if (p2.length < 8 || !by['tr:rep'] || by['tr:rep'].ok !== 0 || by['tr:rep'].n !== p2.length || by['p5:voc'].ok !== voc.length) bad.push('ghi theo dạng / bẫy sai: ' + JSON.stringify(by['tr:rep']));
    const W = tmWeak(), u = W.map(w => w.u); if (!u.includes('p5:prep') || !u.includes('tr:rep') || u.includes('p5:voc') || u.includes('p5') || u.includes('p2')) bad.push('chỗ yếu sai: ' + u.join(','));
    const f = tmFocus(now), L = f.act.filter(w => w.sk === 'L').length, R = f.act.filter(w => w.sk === 'R').length;
    if (!f.act.length || f.act.length > 3 || L > 2 || R > 2 || !f.act.some(w => w.u === 'p5:prep') || !f.act.some(w => w.u === 'tr:rep')) bad.push('nhóm đang chữa sai: ' + f.act.map(w => w.u).join(','));
    // câu đã gặp không tính; câu mới tính; đạt 2 ngày = xong
    toLog(prep.map(x => ({ q: toP5Q(x), ok: true, ans: x.a })), 'luyen', new Set()); if ((o.fo.a.find(a => a.u === 'p5:prep').tr || 0) !== 0) bad.push('câu đã gặp vẫn tính lần thử');
    tmHit('p5:prep', true, now); tmHit('p5:prep', true, now + D); const g = tmFocus(now + D); if (g.done !== 1 || g.act.some(w => w.u === 'p5:prep')) bad.push('đạt 2 ngày chưa xong');
    // tốc độ Part 7 chậm → chỗ yếu; mở chữa có màn xem cách làm
    o.spd.push({ at: now + D, s: 'p7', avg: 80, ok: 4, n: 6 }, { at: now + D, s: 'p7', avg: 75, ok: 4, n: 6 }); if (!tmWeak().some(w => w.u === 'spd:p7')) bad.push('thiếu chỗ yếu tốc độ');
    // đếm lần gọi tmTeach thay vì đọc $app: trong DOM giả, overview() tải chậm của khối kiểm trước có thể vẽ đè $app giữa chừng (test chập chờn v84)
    const tt0 = tmTeach; let taught = []; tmTeach = (u, go) => { taught.push(u); return tt0(u, go); };
    await tmFix('spd:p7'); if (!taught.includes('spd:p7')) bad.push('tốc độ thiếu màn cách làm');
    const ra = o.fo.a.find(a => a.u === 'tr:rep'); if (ra) { ra.tr = 1; ra.td = dayOf(now) - 1; await tmFix('tr:rep'); if (!taught.includes('tr:rep')) bad.push('thiếu cách làm trước lần thử 2'); }
    tmTeach = tt0;
    try { await tmFix('p6'); await tmFix('p7'); await tmFix('p3'); } catch (e) { errs.push('chữa Part: ' + e.message); }
    await toeicView(); if (!String($app.innerHTML).includes('Bản đồ điểm')) bad.push('màn TOEIC thiếu bản đồ điểm');
    add('toeic', 'T2', !bad.length && !errs.length, [...errs, ...bad].length ? [...errs, ...bad].slice(0, 6).join(' | ') : 'bản đồ điểm: dạng / bẫy có mẫu số, ngưỡng theo mục tiêu, nhóm 3 (Nghe ≤ 2, Đọc ≤ 2), chỉ câu mới tính, đạt 2 ngày = xong, tốc độ, kho ≥ 20 bộ'); }
  return out; })()`);
let fail = 0; for (const r of R) { if (!r.ok) fail++; console.log(`${r.ok ? '✅' : '❌'} ${r.lv.padEnd(3)} ${r.id}  ${r.msg}`); }
console.log(fail ? `\n${fail} tiêu chí chưa đạt` : '\nĐạt hết'); process.exit(fail ? 1 : 0);
