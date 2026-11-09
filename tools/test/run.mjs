// Kiểm tự động tiêu chí "xong" X1–X5 của docs/HOAN-THIEN.md cho Pre-A1 → C2. Chạy: node tools/test/run.mjs   (thoát mã 1 nếu có tiêu chí chưa đạt)
import { load } from './load.mjs';
const { run, ctx } = await load(); ctx.ALLMISS = !!process.env.ALL; ctx.LVS_ = process.env.LVS;
ctx.IDX_ = (await import('node:fs')).readFileSync(new URL('../../index.html', import.meta.url), 'utf8');   // v95: kiểm nhãn thanh dưới
const R = await run(`(async () => {
  S = blank(); user = { id: 'test' }; EX_PART = 'san'; await Promise.all([paLoad(), ...Object.values(KIT).map(kLoad)]); await loadEB(); await uLoad(); await capLoad();
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
    for (const x of kItems(KIT.viet, lv).filter(x => !x.kind)) if (!kWrite(x).check(kModel(x)).ok) bad.push('viết mẫu:' + x.id);
    // 🎓 đề thử kiểu Cambridge: mọi phần sinh được câu, câu hợp lệ
    if (MOCK[lv]) { MK = { lv, C: MOCK[lv] }; for (const P of MOCK[lv].papers) for (const [t, g] of P.parts) { const qs = g(); if (!qs.length) bad.push('đề thử trống:' + t);
      for (const q of qs) if ((q.kind === 'mc' && !q.opts.includes(q.a)) || (q.kind === 'type' && !q.check && !(q.acc && q.acc[0]))) bad.push('đề thử:' + t);
      // 🗣 Nói: trả lời đúng câu mẫu (nhắc lại = câu gốc, đóng vai = câu mẫu, nói dài = bài mẫu) phải ≥ 60% ở ②③④; im lặng phải < 10%
      if (P.speak) { const r = qs.map(it => ({ ...it, ans: it.q.mode === 'eit' ? it.q.s : it.q.mode === 'cap' ? (it.q.last ? "I'd go for this one, because it's the most useful for everyone, so let's choose it." : "That's a good point, because it really helps people in their daily lives. What do you think about it?") : it.q.mode === 'rp' || it.q.mode === 'pq' ? it.q.st.t : it.q.mode === 'talk' ? it.q.x.m : '', secs: 30, lat: 1 })), z = mkSpeakScore(qs.map(it => ({ ...it, ans: '', secs: 5, lat: 99 })), lv);
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
    for (const x of kItems(KIT.viet, lv).filter(x => !x.kind)) { const m = kModel(x), r = kWrite(x).check(m); if (wErrors(m).length) bad.push('viết mẫu bị báo lỗi:' + x.id + ' ' + wErrors(m).map(e => e[0]).join('|')); if (r.sc < 0.8) bad.push('viết mẫu < 80%:' + x.id + ' ' + Math.round(r.sc * 100)); }
    if (lv === 'pre' && wErrors("i am agree. He don't like it. I can to swim since three years.").length < 4) bad.push('bộ bắt lỗi Viết không bắt được lỗi');
    add(lv, 'X5', !bad.length, bad.length ? bad.length + ' lỗi: ' + [...new Set(bad)].slice(0, 10).join(', ') : 'mọi câu hợp lệ');
  }
  // 🌏 Học IELTS (ielts.js): màn mở được; đề thử mọi bài sinh câu hợp lệ (Academic + General Training); bài mẫu Viết máy ước ≥ 6.0, bài rác ≤ 4.5;
  // bài nói mẫu ≥ 5.5, im lặng không chấm; bảng quy đổi điểm thô → band và cách làm tròn đúng quy ước IELTS
  { const bad = [], errs = [], tryv = (n, f) => { try { f(); } catch (e) { errs.push(n + ': ' + e.message); } }; await ieLoad(); delete S.ie;
    EX_PART = 'san'; for (const ty of ['ac', 'gt']) { ieSt().type = ty; await ieltsView(); { const h0 = String($app.innerHTML); if (!h0.includes('🌏 IELTS ') || !['L', 'R', 'W', 'S'].every(k => h0.includes('data-iesk="' + k + '"')) || ((x => (x.match(/class="btnbig/g) || []).length !== (/class="btnbig" data-daigo/.test(x) ? 1 : 0))(h0)) || !h0.includes('class="grid2"') || !h0.includes('data-iemk="all"')) bad.push('màn IELTS ' + ty + ' (v122: như màn Nền: lưới 4 ô, thi thử trong Thêm; v141: nút to duy nhất là 🤖 Đề AI)'); }
      for (const k of ['L', 'R', 'W', 'S']) { try { ieSkView(k); const hk = String($app.innerHTML); if (!hk.includes('data-iehome') || !/data-ie(?:[rws]|lk?)=/.test(hk) || !hk.includes('class="statc"') || !hk.includes('data-xl="ielts|' + k + '|') || !hk.includes('data-iebt="' + k + '"') || !hk.includes('data-iebai="' + k + '|')) bad.push('màn con IELTS ' + k + ' thiếu nút / khuôn 3 bước'); } catch (e) { bad.push('màn con IELTS ' + k + ': ' + e.message); } }
      for (const P of IE_PAPERS) { let qs = []; tryv('đề ' + ty + ' ' + P.k, () => { qs = P.gen(); }); if (!qs.length) bad.push('đề thử trống: ' + ty + ' ' + P.k);
        for (const it of qs) { const q = it.q; if (!it.part || !q) { bad.push('câu thiếu phần: ' + P.k); continue; }
          if (q.kind === 'mc' && (!q.opts.includes(q.a) || new Set(q.opts).size !== q.opts.length)) bad.push('mc hỏng: ' + P.k + ' ' + q.q);
          if (q.kind === 'type' && !q.check && !(q.acc && q.acc[0])) bad.push('type thiếu đáp án: ' + P.k);
          if (q.kind === 'write' && !q.check) bad.push('viết thiếu bộ chấm');
          if (P.k === 'L' && !q.play) bad.push('nghe thiếu bài phát'); } } }
    for (const x of IE.doc) { const qs = ieRQs(x); if (qs.length < 13) bad.push('bài đọc ít câu: ' + x.id);   // v123: bài mới 13–14 câu như đề thật
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
    EX_PART = 'san'; add('ielts', 'I1', !bad.length && !errs.length, [...errs, ...bad].length ? [...errs, ...new Set(bad)].slice(0, 10).join(' | ') : 'màn, đề thử Academic + General Training, chấm Viết / Nói, quy đổi band đều đúng'); }
  // 📊 IELTS bước 1 (v82): ghi theo dạng câu (Đọc / Nghe) + tiêu chí (Viết / Nói), máy và AI tách riêng; đề thử hiện bảng theo dạng
  { const bad = [], errs = [], tryv = (n, f) => { try { f(); } catch (e) { errs.push(n + ': ' + e.message); } }; S = blank(); await ieLoad(); await kLoad(KIT.nghe); await kLoad(KIT.doc);
    const qs = [...ieRQs(IE.doc[0]), ...ieRQs(IE.doc[1])], lq = ieListen(); if (qs.some(q => !IE_TY[q.ty])) bad.push('câu Đọc thiếu dạng'); if (!lq.length || lq.some(it => !IE_TY[it.q.ty])) bad.push('câu Nghe thiếu dạng');
    const by = ieTyLog(qs.map(q => ({ q, ok: q.ty === 'R-tf' })), 'luyen'), st = ieTyStats().ty, tf = st.find(t => t.k === 'R-tf'), h = st.find(t => t.k === 'R-h');
    if (!by['R-tf'] || tf.pct !== 100 || tf.items !== 2 || tf.sure !== (tf.n >= IE_TY_N) || h.pct !== 0) bad.push('thống kê theo dạng sai: ' + JSON.stringify([tf, h]));
    const x = IE.t2[0]; ieCrLog('W', 't2', ieWScore('t2', x, x.m).C, 'may'); ieCrLog('W', null, [6, 6, 7, 5], 'ai'); const cr = ieTyStats().cr;
    const ai = cr.find(c => c.k === 'W' && c.src === 'ai'), my = cr.find(c => c.k === 'W' && c.src === 'may'); if (!ai || ai.c.join() !== '6,6,7,5' || !my || !my.c || my.c.length !== 4) bad.push('tiêu chí Viết sai');
    MK = { idx: [1], C: { name: 'IELTS thử' }, papers: [{ t: 'R', k: 'R', res: qs.map((q, j) => ({ part: 'p', q, ok: j % 2 === 0, ans: 'x' })) }] }; tryv('đề thử theo dạng', () => ieMockResult());
    if (!String($app.innerHTML).includes('Theo dạng câu (đề này)')) bad.push('kết quả đề thử thiếu bảng theo dạng');
    await mapView('ielts'); MAP_TAB = null; if (!String($app.innerHTML).includes('📊 Theo dạng câu')) bad.push('🗺 Chỗ yếu thiếu ô theo dạng IELTS');   // v121: mục 🌏 IELTS của 🗺 Chỗ yếu
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
    await ieltsView(); if (!String($app.innerHTML).includes('data-mapv="lt" data-mapk="ielts"')) bad.push('màn IELTS thiếu lối tắt bản đồ band'); await mapView('ielts'); MAP_TAB = null; const h = String($app.innerHTML);   // v121: lối tắt mở mục 🌏 IELTS if (!h.includes('Bản đồ band') || !h.includes('Kẹt lâu')) bad.push('🗺 Chỗ yếu thiếu bản đồ band / 🧱');
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
    // v126: mỗi Part có ≥ 2 bài nên câu bản đồ (chỉ ở một bài Part 2) không có ở mọi đề; bốc 20 lần phải gặp
    const lq = ieListen([0, 1, 2, 3]); let seenMap = false; for (let i = 0; i < 20 && !seenMap; i++) seenMap = ieListen([0, 1, 2, 3]).some(it => it.q.ty === 'L-map');
    if (lq.length !== 40 || !lq.every(it => it.q.x && /^il-/.test(it.q.x.id)) || !lq.some(it => it.q.ty === 'L-match') || !seenMap) bad.push('đề Nghe 4 phần chưa dùng bài IELTS: ' + lq.length);
    await ieltsView(); const h = String($app.innerHTML); ieSkView('R'); if (!h.includes('Luyện bằng đề thật') || !h.includes('data-th="L"') || !String($app.innerHTML).includes('data-iepara')) bad.push('màn IELTS thiếu đề thật / diễn đạt lại (v113: diễn đạt lại ở màn con 📖 Đọc)');
    add('ielts', 'I4', !bad.length && !errs.length, [...errs, ...bad].length ? [...errs, ...bad].slice(0, 8).join(' | ') : 'đề thật theo từng câu, từ mới đề thật, diễn đạt lại, Task 1 bản đồ / quy trình, Nói mở rộng, Nghe kiểu IELTS có giọng đều đúng'); }
  // 📅 Hôm nay + 🧭 xếp cấp (homnay.js): phút học từ nhịp save(), chuỗi ngày, ô Hôm nay, câu xếp cấp hợp lệ mọi cấp, bậc thang lên / xuống / dừng
  { const bad = [], errs = [], tryv = (n, f) => { try { f(); } catch (e) { errs.push(n + ': ' + e.message); } }; S = blank(); const t0 = Date.now() - 3 * 864e5;
    for (const d of [0, 1, 2]) for (let k = 0; k < 40; k++) actTick(t0 + d * 864e5 + k * 15000);   // 3 ngày, mỗi ngày 40 lần cách 15 giây ≈ 10 phút
    actTick(Date.now() - 60000); actTick(Date.now());
    if (actMin(dayOf(t0)) !== 10 || actStreak() !== 3) bad.push('phút / chuỗi sai: ' + actMin(dayOf(t0)) + ' / ' + actStreak());
    actTick(Date.now() + 10 * 60000); if (actMin(dayOf(Date.now())) > 2) bad.push('khoảng nghỉ dài vẫn tính phút');
    // v108: ô 📅 Hôm nay ở 🔄 Lộ trình (cần mục tiêu); 📚 Học = ô 🎯 mục tiêu + 🧱 nền CEFR
    ltSt().goal = { kind: 'cefr', lv: 'a2', date: '', at: Date.now() }; await ltView(); const lt0 = String($app.innerHTML); if (!lt0.includes('id="today"') || !lt0.includes('Việc hôm nay') || !lt0.includes('data-ltnext')) bad.push('Lộ trình thiếu màn Hôm nay (v112: vòng phút, ▶ Học tiếp, việc hôm nay)');
    await overview('a1'); const ov = String($app.innerHTML); if (ov.includes('📅 Hôm nay') || ov.includes('Việc hôm nay') || ov.includes('data-exsel=')) bad.push('📚 Học còn ô Hôm nay / kế hoạch / hàng kỳ thi (v111: chỉ nội dung; v141: kỳ thi ở tab 🎯 Luyện đề)'); delete S.lt;
    // v86 hiện dần: người mới chưa thấy 🧰 luyện thi (chỉ một dòng báo), không còn ▶ Nên làm / 🗓 Gợi ý ~45 phút trái mục tiêu phút
    if (ov.includes('id="ovtools"') || ov.includes('data-mock') || !ov.includes('Tiếng Anh A1') || ov.includes('Gợi ý mỗi ngày') || ov.includes('▶ Nên làm')) bad.push('Tổng quan người mới chưa gọn');
    for (const lv of PL_LV) { const qs = plQs(lv); if (qs.length !== 5 || qs.some(it => !it.q.opts.includes(it.q.a))) bad.push('xếp cấp ' + lv + ': ' + qs.length + ' câu'); }
    if (plNext({ a2: [5, 5] }, 'a2') !== 'b1' || plNext({ a2: [1, 5] }, 'a2') !== 'a1' || plNext({ a2: [3, 5] }, 'a2') !== 'a2' || plNext({ a2: [6, 10] }, 'a2') !== 'a1' /* v107: lưng chừng sau 10 câu → đo xuống */ || plNext({ a1: [5, 5], a2: [6, 10] }, 'a2') !== null
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
    const u = UNITS.find(x => x.lv === 'a1'); await tryv('mở bài học', () => learn(u)); if (!String($app.innerHTML).includes('▶ Bắt đầu học') || !String($app.innerHTML).includes('data-pt="go"')) bad.push('bài học không mở trang 2 bước + lối bài tập nhanh (v134)');
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
    await tryv('màn bản đồ', () => mapView()); await mapView(); const h = String($app.innerHTML); if (!h.includes('Việc cần chữa') || !h.includes('Độ phủ') || !h.includes('🌱 Gốc') || !h.includes('bài yếu do thiếu từ') || !h.includes('Cân bằng')) bad.push('màn bản đồ thiếu phần (v106 gộp: việc cần chữa, gốc, độ phủ)');
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
    if (/data-g="admin"/.test(gyHomeInner() + bkTools())) bad.push('người ẩn danh thấy Quản lý góp ý');
    user = { id: 'chung', email: AUTO.email }; tryv('dữ liệu chung', () => backup()); if (!String($app.innerHTML).includes('data-bk="split"')) bad.push('tài khoản chung thiếu nút tách máy');
    if (/data-g="admin"/.test(gyHomeInner()) || !/data-g="admin"/.test(bkTools())) bad.push('v136: Quản lý góp ý phải ở 🛠 Công cụ người sáng lập, không ở khối Góp ý'); user = u0;
    if (gaKind('sai') !== '⚑ Câu sai') bad.push('thiếu loại góp ý ⚑ Câu sai');
    const s0 = ovStat('tv', 'pre'); if (!s0 || s0.nl !== Math.ceil(levelWords('pre').length * GATE_LEARN / 100) || !(s0.nm > 0)) bad.push('còn thiếu sai: ' + JSON.stringify(s0 && [s0.nl, s0.nm]));
    if (!ovNeedLine(s0, true).includes('từ chưa học')) bad.push('thẻ phần thiếu dòng còn thiếu');
    await overview('pre'); const h = String($app.innerHTML), nb = (h.match(/<button/g) || []).length, nt = h.replace(/<[^>]+>/g, ' ').replace(/\\s+/g, ' ').length;
    if (nb > 20 || nt > 2000) bad.push('Tổng quan người mới còn nặng: ' + nb + ' nút, ' + nt + ' chữ');
    { const tb6 = todayBox('pre'); if (!tb6.includes('data-today="part" data-tp=') || !tb6.includes('data-tpl="pre"') || !/<b>[^<]+ Pre-A1 · [^<]+<\\/b>/.test(tb6)) bad.push('Hôm nay: việc học mới chưa mở thẳng phần'); }
    // v111: màn IELTS chỉ nội dung (thiết lập loại thi / band / ngày thi / giờ học ở 🔄 Lộ trình)
    delete S.ie; await ieltsView(); const hi = String($app.innerHTML); if (hi.includes('Bắt đầu: 3 câu hỏi') || hi.includes('Hôm nay & kế hoạch') || hi.includes('data-ietg') || hi.includes('id="iedate"') || !hi.includes('data-iesk="L"')) bad.push('IELTS sau khi chọn chưa gọn');
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
    { const tb7 = todayBox('pre'); if (!tb7.includes('data-rev') || !/<b>Ôn \\d+ mục cũ<\\/b>/.test(tb7) || !tb7.includes('từ đã lưu')) bad.push('ô Hôm nay thiếu ôn sổ từ (nút ôn chung)'); } tryv('ôn sổ từ', () => vwRun(Date.now(), dict)); if (!String($app.innerHTML).includes('Ôn sổ từ')) bad.push('màn ôn sổ từ hỏng');
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
    if (tabs !== 'lt:Lộ trình all:Học ld:Luyện đề dict:Tra cứu bk:Tôi') bad.push('thanh dưới (v141: 5 tab, 🎯 Luyện đề sau 📚 Học): ' + tabs);
    // 🎯 Học người mới: ≤ 14 nút (v101: Pre-A1 thêm thẻ ✍️ Viết, 🗣 Nói); công cụ luyện thi, sổ lỗi, góp ý ở tab khác; chưa học gì thì chưa có việc ôn
    await tryA('Học', () => overview('pre')); const ho = H(), nh = nbt(ho) - (ho.match(/data-exsel=|data-hocnen|data-exthi/g) || []).length;   // v109: hàng mục (Nền · Cambridge · IELTS · TOEIC) là điều hướng, không tính if (nh > 14) bad.push('🎯 Học người mới ' + nh + ' nút');
    if (/data-mock|id="ovtools"|id="gyhome"|Sổ lỗi của tôi|data-rev|data-sotu/.test(ho)) bad.push('🎯 Học người mới còn công cụ của tab khác / việc ôn khi chưa có gì để ôn');
    // 🎓 Luyện thi: chưa chọn kỳ thi → 🎓 Cambridge (đề thử, cẩm nang, chuyển IELTS / TOEIC); đã đặt IELTS → IELTS
    delete S.exSel; delete S.ie; CB_LV = null; EX_PART = null; await tryA('Luyện thi', () => exOpen()); const h2 = H(); if (!h2.includes('exrow') || !h2.includes('data-expart="san"') || !h2.includes('data-expart="ai"')) bad.push('màn Luyện đề chưa có 2 nút 📚 · 🤖 (v142)'); EX_PART = 'san'; await tryA('Luyện thi 📚', () => cbView()); const hc = H();
    if (!hc.includes('🎓 Cambridge ') || ((x => (x.match(/class="btnbig/g) || []).length !== (/class="btnbig" data-daigo/.test(x) ? 1 : 0))(hc)) || !/data-mock="/.test(hc) || !hc.includes('data-cbsk=') || !hc.includes('data-cnv="cefr"') || !hc.includes('data-expart=""') || !hc.includes('id="ie"')) bad.push('màn Cambridge chưa đủ (v122: như màn Nền, ô theo bài thi, đề thử trong Thêm)');
    ieSt().set = 1; if (exSel() !== 'ielts') bad.push('đã đặt IELTS mà Luyện thi không mở IELTS'); S.exSel = 'cefr'; if (exSel() !== 'cefr') bad.push('chọn Cambridge không giữ');
    await tryA('về Cambridge', () => exHome('a2')); if (!/class="chip on" data-cbl="a2"/.test(H())) bad.push('nút về của công cụ Cambridge không giữ cấp');
    // 📘 Cẩm nang: chỗ ở chính 📖 Tra cứu (sáng 📖, về Tra cứu); từ Luyện thi là lối tắt (sáng 🎓, về Luyện thi)
    tryv('Tra cứu', () => dict()); if (String(document.getElementById('dl').innerHTML).includes('data-cnv')) bad.push('Tra cứu còn thẻ Cẩm nang (v136: bỏ, trùng bài học kỳ thi)');
    tryv('cẩm nang từ Tra cứu', () => camnangView('nghe', 'tc')); if (!H().includes('id="tcv"') || !H().includes('← Tra cứu')) bad.push('cẩm nang từ Tra cứu sai');
    tryv('cẩm nang từ Luyện thi', () => camnangView('doc', 'ex', 'cefr')); if (!H().includes('id="ie"') || !H().includes('← Luyện thi') || DICT.ex !== 'cefr') bad.push('cẩm nang từ Luyện thi sai');
    // 👤 Của tôi: tiến độ, bản đồ, sổ từ, sổ lỗi, đề thật, dữ liệu, góp ý; mở con nào cũng sáng 👤 và về Của tôi
    const go = WORDS.find(w => w.w === 'go'); tryv('lưu sổ', () => tdSave(go)); errAdd([{ wrong: 'He go to school.', correct: 'He goes to school.', why_vi: 'ngôi thứ ba số ít' }], 'test');
    S.ie.th = [{ at: Date.now(), sk: 'R', name: 'Cambridge 18 Test 1', ok: 30, band: 7, wrong: [], blocks: [] }];
    await tryA('Của tôi', () => minhView()); const hm = H();
    for (const k of ['id="bk"', '📈 Tiến độ', '🗺 Chỗ yếu', '📌 Sổ từ', '📒 Sổ lỗi', '📊 Kết quả thi thật', '30/40', 'data-ct="data"', 'id="gyhome"']) if (!hm.includes(k)) bad.push('Của tôi thiếu ' + k);
    MAP_BACK = 'ct'; await tryA('bản đồ từ Của tôi', () => mapView()); if (!H().includes('id="bk"') || !H().includes('← Của tôi')) bad.push('bản đồ từ Của tôi sai'); MAP_BACK = 'lt';
    tryv('sổ từ từ Của tôi', () => sotuView(minhView)); if (!H().includes('id="bk"') || !H().includes('← Của tôi')) bad.push('sổ từ từ Của tôi sai');
    tryv('dữ liệu', () => backup()); if (!H().includes('id="bk"') || !H().includes('data-bk="ct"')) bad.push('Dữ liệu thiếu nút về Của tôi');
    // 📅 Hôm nay: MỘT nút ôn gom sổ lỗi + sổ từ + bài CEFR; bấm thì đi lần lượt sổ lỗi → sổ từ → phần nhiều bài đến hạn
    const tb = todayBox('pre'), nr = (tb.match(/data-rev/g) || []).length; if (nr !== 1 || /data-sotu/.test(tb) || !/<b>Ôn \\d+ mục cũ<\\/b>/.test(tb) || !tb.includes('1 từ đã lưu') || !tb.includes('1 lỗi viết / nói')) bad.push('Hôm nay chưa có đúng một nút ôn chung: ' + nr);
    const calls = [], e0 = errRun, v0 = vwRun; errRun = (next, quit) => { calls.push('lỗi'); next(); }; vwRun = (now, next, quit) => { calls.push('từ'); next(); };
    tryv('ôn chung', () => revRun()); errRun = e0; vwRun = v0; if (calls.join(',') !== 'lỗi,từ') bad.push('thứ tự ôn chung sai: ' + calls.join(','));
    S.ie.vw = []; S.err = []; if (revCount().n !== (todayDue() || 0)) bad.push('đếm ôn chung sai');
    CB_LV = null; delete S.exSel;
    add('cefr', 'C13', !bad.length && !errs.length, [...errs, ...bad].length ? [...errs, ...bad].slice(0, 8).join(' | ') : '4 tab (Học · Luyện thi · Tra cứu · Của tôi), 🎯 Học người mới ' + nh + ' nút, Cambridge ở Luyện thi, Cẩm nang chỉ ở màn kỳ thi (v136), Của tôi đủ 7 ô, Hôm nay một nút ôn chung đều đúng'); }
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
    // hoàn thành cấp (v101): Viết bắt buộc (phần câu); Nói bắt buộc khi máy chép được lời, không thì tham khảo
    if (ovRef('noi') !== !SREC || ovRef('viet') || ovRef('np') || ovReq('a1').some(([id]) => ovRef(id)) || !OV.some(([id]) => id === 'noi' && ovIn(id, 'a1'))) bad.push('phần bắt buộc sai');
    S = blank(); for (const lv of ['pre', 'a1']) for (const [id] of ovReq(lv)) { const r = { lv, at: now, ok: 10, n: 10, pass: true }; if (id === 'tv') xs().runs.push(r); else if (id === 'pa') paRuns().push(r); else kSt(id).runs.push(r); }
    if (!ovDone('a1') || ovStage() !== 'a2') bad.push('Nói / Viết chưa qua vẫn chặn hoàn thành A1: ' + ovStage());
    // ngưỡng 2 bậc
    if (KIT.np.pass !== 0.85 || PA_PASS !== 0.85 || KIT.doc.pass !== 0.75 || KIT.nghe.pass !== 0.75 || KIT.noi.pass !== 0.7 || KIT.viet.pass !== 0.8) bad.push('ngưỡng 2 bậc sai');
    // tên: "hoàn thành trong app"; "đạt" chỉ cho đề mẫu chính thức
    await overview('a1'); if (!H().includes('Qua bài thi của') || /Đạt A1 khi|đã đạt \\d|✅ đã đạt/.test(H())) bad.push('Tổng quan còn chữ đạt cấp');
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
    const tb = todayBox('pre'); if (!tb.includes('data-plstart') || !tb.includes('Bắt đầu học ở C1') || /data-vcv/.test(tb) || /data-today="part"/.test(tb)) bad.push('Hôm nay chưa có việc bắt đầu học ở cấp xếp được (v133)');
    await overview(); if (!H().includes('Bài kiểm tra: bạn khoảng C1') || !H().includes('data-plstart')) bad.push('📚 Học thiếu ô chọn nơi bắt đầu theo kiểm tra');
    CB_LV = null; await cbView(); if (!/class="chip on" data-cbl="c1"/.test(H())) bad.push('Cambridge chưa mở ở cấp xếp được'); CB_LV = null;
    S.place.no = 1; if (plTop('pre') || plPend('pre') || /data-vcv|data-plstart/.test(todayBox('pre'))) bad.push('chọn học từ đầu vẫn gợi ý bỏ qua cấp dưới'); delete S.place;
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
    // 👄 Phát âm bắt buộc lại (v101, phương án a); Pre-A1 bắt buộc: Từ vựng, Phát âm, Ngữ pháp, Đọc, Nghe, Viết (+ Nói khi chép được lời)
    if (ovRef('pa') || !ovReq('pre').some(([id]) => id === 'pa') || ovReq('pre').length !== (SREC ? 7 : 6)) bad.push('Phát âm / phần bắt buộc Pre-A1 sai: ' + ovReq('pre').map(([id]) => id).join(','));
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
      // v137: chọn đúng nghĩa một lần là mở bậc trên (trước v137: phải vững cả 3 mặt bậc 1)
      const tb = new Set(); for (let i = 0; i < 60; i++) tb.add(typeFor(cb, now, wb)); if (![...tb].some(t => !['w2vi', 'listen', 'form'].includes(t))) bad.push('B1: đúng nghĩa rồi mà chưa mở bậc trên: ' + [...tb].join(','));
      cb.dm = {}; const tb0 = new Set(); for (let i = 0; i < 60; i++) tb0.add(typeFor(cb, now, wb)); if ([...tb0].some(t => !['w2vi', 'listen', 'form'].includes(t))) bad.push('B1: chưa học bài, chưa đúng nghĩa mà hỏi ' + [...tb0].join(',')); }
    const wc = WORDS.find(x => x.col && x.cloze); if (!wc || vEasy(wc, 'colT') !== 'col' || vEasy(wc, 'clozeT') !== 'cloze' || vEasy(wc, 'w2vi') !== null) bad.push('dạng dễ hơn khi làm lại sai');
    if (lessonTypes(w, reqsUpTo('a1')).join() !== 'w2vi,listen,spell') bad.push('bài học không phải chọn nghĩa · nghe · tự gõ: ' + lessonTypes(w, reqsUpTo('a1')).join());
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
  // v101 Viết bậc 1–2 bắt buộc (xếp câu, nối câu), bài viết tham khảo + viết lại; Nói bắt buộc khi chép được lời, Pre-A1 Nói; Phát âm bắt buộc theo bộ chấm âm; Luật có cách học từng phần
  { const bad = [], errs = [], tryv = (n, f) => { try { f(); } catch (e) { errs.push(n + ': ' + e.message); } }; S = blank(); const now = Date.now();
    tryv('viet', () => { const P = KIT.viet;
      for (const lv of P.lvs) { const C = P.items.filter(x => x.lv === lv && x.kind === 'cau'), N = P.items.filter(x => x.lv === lv && x.kind === 'noi');
        if (C.filter(x => !x.test).length < 8 || C.filter(x => x.test).length < 4) bad.push(lv + ': thiếu bộ xếp câu ' + C.length);
        if (lv !== 'pre' && (N.filter(x => !x.test).length < 2 || N.filter(x => x.test).length < 2)) bad.push(lv + ': thiếu bộ nối câu ' + N.length); }
      const ids = P.items.map(x => x.id); if (new Set(ids).size !== ids.length) bad.push('trùng id bài Viết');
      const xc = P.items.find(x => x.kind === 'cau'), q = vQs(xc)[0], s = xc.ss.find(z => vOrder(xc, z[0], z[1]).toks.length === q.toks.length && q.toks.slice().sort().join(' ') === z[0].split(/\\s+/).sort().join(' '));
      if (!s || !q.check(s[0]).ok || q.check(s[0].split(/\\s+/).reverse().join(' ')).ok) bad.push('chấm xếp câu sai');
      let nAcc = 0; for (const x of P.items.filter(x => x.kind === 'noi')) for (const it of x.qs) { const j = vJoin(x, it); for (const a of it.slice(3)) { nAcc++; if (!j.check(a).ok || !j.check(a.replace(/,/g, '').toLowerCase()).ok) bad.push('đáp án nối câu không qua: ' + a); } if (j.check(it[0] + ' ' + it[1]).ok) bad.push('ghép 2 câu nguyên mà vẫn đúng: ' + it[0]); }
      if (nAcc < 120) bad.push('ít đáp án nối câu: ' + nAcc);
      if (!vJoin({ id: 'z' }, ['a.', 'b.', 'but', "I don't like it, but I eat it."]).check('I do not like it but I eat it').ok) bad.push('chưa nhận do not = don\\'t');
      kSt('viet').runs = []; const p = kParts(P, 'a1'); if (p.gk.join() !== 'cau,noi') bad.push('mặt bắt buộc Viết sai: ' + p.gk);
      const E = P.exam('a1'); if (E.length < 12 || E.some(q => !['cau', 'noi'].includes(q.k))) bad.push('đề thi Viết A1 sai: ' + E.length);
      if (P.exam('pre').some(q => q.k !== 'cau') || !P.exam('pre').length) bad.push('đề thi Viết Pre-A1 sai');
      if (ovRef('viet')) bad.push('Viết vẫn là tham khảo'); { const m0 = MK; MK = { lv: 'b1', C: { lo: 'pre' } }; if (mkPick(P, 20).some(x => x.kind)) bad.push('đề thử lấy nhầm bộ câu'); MK = m0; }
      const xw = P.items.find(x => !x.kind && x.lv === 'a1'), w1 = kWrite(xw); w1.check('Hello. I am Lan. I live in Hanoi. I like music. Bye.'); const w2 = w1.again && w1.again();
      if (!w2 || w2.k !== 'lai' || !/Lần 2/.test(w2.check('Hello. I am Lan. I am ten. I live in Hanoi with my family. I like music and books. Bye, Lan').html)) bad.push('viết lại lần 2 hỏng');
      if (kGrade(P, [{ x: xw, k: 'lai', ok: true }]).length) bad.push('lần viết lại bị chấm'); });
    tryv('noi', () => { const P = KIT.noi; if (P.ref !== !SREC) bad.push('Nói bắt buộc chưa theo máy chép lời'); if (!P.refK('b1').includes('viec') || P.refK('a1').length) bad.push('bậc 4 nói một mạch chưa là tham khảo từ B1');
      const L = P.items.filter(x => x.lv === 'pre'); if (L.length < 12 || !(P.raw.test.pre || []).length) bad.push('thiếu Nói Pre-A1');
      const E = P.exam('pre'); if (!E.length || E.some(q => q.k === 'lai')) bad.push('đề thi Nói Pre-A1 hỏng');
      const t = kTalk(L[0]); t.check(L[0].m); if (!t.again || t.prep !== 30 || t.again().k !== 'lai') bad.push('nói lại lần 2 / giờ chuẩn bị hỏng');
      if (!t.check(L[0].m).ok) bad.push('bài mẫu Pre-A1 không qua máy chấm: ' + L[0].id); for (const x of L) if (!kTalk(x).check(x.m).ok) bad.push('bài mẫu không qua: ' + x.id); });
    tryv('pa', () => { if (PA_REF || ovRef('pa')) bad.push('Phát âm vẫn là tham khảo');
      localStorage.removeItem(NK); NO.vocab = null; if (paParts('pre').gk.join() !== 'pb') bad.push('chưa có bộ chấm mà vẫn tính phần đọc');
      localStorage.setItem(NK, '1'); if (paParts('pre').gk.join() !== 'pb,doc') bad.push('có bộ chấm mà không tính phần đọc'); localStorage.removeItem(NK); });
    tryv('luat', () => { const h = HD.find(x => x[0] === 'cachhoc'); const t = h ? h[2]() : ''; for (const k of ['Từ vựng', 'Ngữ pháp', 'Phát âm', 'Nghe', 'Nói', 'Đọc', 'Viết', '4 kỹ năng']) if (!t.includes(k)) bad.push('Luật thiếu cách học: ' + k); });
    add('cefr', 'C20', !bad.length && !errs.length, [...errs, ...bad].length ? [...errs, ...bad].slice(0, 8).join(' | ') : 'Viết bậc 1–2 bắt buộc (xếp câu, 120 câu nối), viết / nói lại lần 2, Nói theo máy chép lời + Pre-A1, Phát âm theo bộ chấm âm, Luật có cách học 7 phần'); }
  // v102 📖🗣 Đọc to 4 bậc (mặt mới của Đọc, đo theo lần đọc gần nhất, chỉ chặn cổng khi máy chép được lời), 👄 nghe đuôi từ / trọng âm, ✍️ đoạn có khung, 🗣 trả lời ngắn có khung
  { const bad = [], errs = [], tryv = (n, f) => { try { f(); } catch (e) { errs.push(n + ': ' + e.message); } }; S = blank(); const now = Date.now();
    tryv('docto', () => { const P = KIT.doc, x = kItems(P, 'a1').find(z => kWords(z.text).length > 50) || kItems(P, 'a1')[0];
      if (P.dims.find(d => d[0] === 'to') == null || !kDimsOf(P, x).includes('to')) bad.push('Đọc thiếu mặt Đọc to');
      if (kParts(P, 'pre').gk.includes('to') !== !!SREC) bad.push('Đọc to chặn cổng sai theo máy chép lời');
      kSt('doc').cards[x.id] = { S: 1, last: now - 2 * DAY, d0: dayOf(now) - 2, ok: 1, pv: 0, n: 0, lapse: 0 };
      const qs = docTo(x), ch = qs.filter(q => q.k === 'to'); if (!ch.length || ch.some(q => kWords(q.head.replace(/<[^>]*>/g, ' ')).length > 60)) bad.push('chia đoạn đọc to sai');
      if (!qs.some(q => q.k === 'toe')) bad.push('A1 lần đầu thiếu Đ1 nghe rồi nhắc lại');
      const t0 = ch[0].head.replace(/<[^>]*>|Đ[23] · đoạn \\d+\\/\\d+/g, ' ').replace(/&[a-z#0-9]+;/g, "'").trim(); ch[0].t0 = now; ch[0].t1 = now + 30000;
      const r = ch[0].check(t0); if (!r.ok || !/từ đúng \\/ phút/.test(r.html)) bad.push('chấm đọc to / tốc độ hỏng');
      if (ch[0].check('hello').ok) bad.push('đọc sai vẫn đạt');
      const by = kGrade(P, [...qs.map(q => ({ x, k: q.k, ok: true, q }))]); const c = kSt('doc').cards[x.id];
      if (!c.dm.to || !c.dm.to.fq || by.some(b => b[1] === 'to' && b[2] == null)) bad.push('đọc lại bài vừa gặp không tính Đọc to');
      if (c.dm.toe) bad.push('Đ1 bị chấm'); });
    tryv('pa', () => { const F = paFinQs(), T = paStressQs(); if (F.length < 6 || F.some(q => !q.opts.includes(q.a) || !q.play)) bad.push('nghe đuôi từ hỏng: ' + F.length);
      if (T.length < 5 || T.some(q => !q.opts.includes(q.a) || q.opts.length < 2)) bad.push('nghe trọng âm hỏng: ' + T.length);
      const w = WORDS.find(z => z.w === 'banana'); if (w && tdSyl(w.ipa).s !== 2) bad.push('trọng âm banana sai'); });
    tryv('khung', () => { const V = vKhung(); if (!V || V.qs[0].k !== 'khung' || !/Khung đoạn văn/.test(V.qs[0].head)) bad.push('đoạn có khung hỏng');
      const x = V.qs[0].x; if (!V.qs[0].check(kModel(x)).html) bad.push('chấm đoạn có khung hỏng');
      const N = noiKhung(); if (!N || !N.qs.length || N.qs.some(q => q.kind !== 'speak' || q.k !== 'khung')) bad.push('nói ngắn có khung hỏng');
      if (kGrade(KIT.viet, V.qs.map(q => ({ x: q.x, k: q.k, ok: true }))).length || kGrade(KIT.noi, N.qs.map(q => ({ x: q.x, k: q.k, ok: true }))).length) bad.push('câu khung bị chấm'); });
    add('cefr', 'C21', !bad.length && !errs.length, [...errs, ...bad].length ? [...errs, ...bad].slice(0, 8).join(' | ') : '📖🗣 Đọc to (Đ1 → Đ4, tốc độ, đọc lại vẫn tính, chặn cổng theo máy chép lời), 👂 nghe đuôi từ, 🎵 trọng âm, đoạn văn / trả lời ngắn có khung'); }
  // v103 Phát âm B1 → C2 (bộ âm mới, thin – tin lên A2), mẹo lỗi phát âm người Việt, lớp 2 chấm âm cả câu (tham khảo)
  { const bad = [], errs = [], tryv = (n, f) => { try { f(); } catch (e) { errs.push(n + ': ' + e.message); } }; S = blank();
    tryv('pa', () => { for (const lv of ['b1', 'b2', 'c1', 'c2']) { const L = PA.filter(x => x.lv === lv); if (L.length < 2 || L.some(x => x.pairs.length < 4 || x.test.length < 2)) bad.push('thiếu bộ âm ' + lv); }
      if (PA_LV.join() !== 'pre,a1,a2,b1,b2,c1,c2' || PABY['s-05'].lv !== 'a2' || !PA_OK.c2) bad.push('cấp Phát âm sai');
      const ids = PA.map(x => x.id); if (new Set(ids).size !== ids.length) bad.push('trùng id bộ âm');
      if (!ovLvs('pa').includes('b1') || ovRef('pa')) bad.push('Phát âm B1+ chưa bắt buộc'); });
    tryv('tip', () => { const R = { words: [{ phones: [{ ipa: 'θ', score: 30 }, { ipa: 'ɪ', score: 90 }, { ipa: 'ŋ', score: 90 }, { ipa: 'k', score: 85 }] }] }; if (!/giữa hai răng/.test(nTip(R))) bad.push('thiếu mẹo âm θ');
      const R2 = { words: [{ phones: [{ ipa: 'b', score: 90 }, { ipa: 'e', score: 90 }, { ipa: 'd', score: 20 }] }] }; if (!/Âm cuối/.test(nTip(R2))) bad.push('thiếu mẹo âm cuối'); });
    tryv('cau', () => { const i1 = nSentIpa('I like apples.'), i2 = nSentIpa('She walked to school.'), i3 = nSentIpa('Nguyen likes apples.');
      if (!i1 || i1.split(' ').length !== 3 || !/z$/.test(i1)) bad.push('phiên âm câu sai: ' + i1);
      if (!i2 || !/t$/.test(i2.split(' ')[1])) bad.push('đuôi -ed sai: ' + i2); if (i3) bad.push('tên riêng vẫn chấm');
      localStorage.setItem(NK, '1'); if (!nSentBtn('I like apples. You like bananas.').includes('data-pas')) bad.push('thiếu nút chấm âm câu'); localStorage.removeItem(NK);
      if (nSentBtn('I like apples.')) bad.push('chưa có bộ chấm âm mà vẫn hiện nút');
      nSent('I like apples.'); if (!NO.ses || NO.ses.mode !== 'am' || NO.ses.list[0].dur < 2000 || !NO.ses.list[0].long) bad.push('mở chấm âm câu sai');
      NO.ses.onGrade(NO.ses.list[0], true, 77); if (!S.paCal || S.paCal[0].sc !== 77) bad.push('chưa lưu điểm để hiệu chuẩn'); NO.ses = null; });
    tryv('suyluan', () => { for (const id of ['doc', 'nghe']) for (const x of KIT[id].items.filter(z => ['b1', 'b2'].includes(z.lv) && !z.test)) { const s = x.qs.filter(q => q.sl);
      if (s.length !== 1 || s[0].w.includes(s[0].a) || !kRead(KIT[id], x, 'ct', id === 'nghe').some(q => /Suy luận/.test(q.q))) bad.push('thiếu câu suy luận ' + x.id); } });
    add('cefr', 'C22', !bad.length && !errs.length, [...errs, ...bad].length ? [...errs, ...bad].slice(0, 8).join(' | ') : 'Phát âm B1 → C2 (13 bộ, thin – tin lên A2), mẹo lỗi phát âm người Việt, lớp 2 chấm âm cả câu (phiên âm ghép từ điển, -s / -ed, tham khảo, lưu điểm hiệu chuẩn), câu suy luận Đọc / Nghe B1, B2'); }
  // v104 hiệu chuẩn bộ chấm âm theo người, đọc lại khi sát ngưỡng (trung bình 2 lần), 🧑‍🏫 đối chiếu giáo viên (chấm oan / bỏ sót)
  { const bad = [], errs = [], tryv = (n, f) => { try { f(); } catch (e) { errs.push(n + ': ' + e.message); } }; S = blank();
    tryv('thr', () => { if (paThr(80) !== 80) bad.push('chưa hiệu chuẩn mà đổi ngưỡng'); S.paBase = { med: 68 }; if (paThr(80) !== 65 || paThr(60) !== 48) bad.push('hạ ngưỡng sai: ' + paThr(80) + '/' + paThr(60));
      S.paBase = { med: 40 }; if (paThr(80) !== 65) bad.push('hạ quá ' + PA_CAL_MAX + ' điểm'); S.paBase = { med: 95 }; if (paThr(80) !== 80) bad.push('mốc cao mà nâng ngưỡng'); S.paBase = null; });
    tryv('redo', () => { const g0 = [GOP.score, GOP.greedy, GOP.toModelPhones], seq = [77, 85]; GOP.score = () => ({ score: seq.shift(), words: [] }); GOP.greedy = () => ''; GOP.toModelPhones = () => [{ ipa: 'k' }];
      NO.vocab = { '<pad>': 0 }; NO.w = { w: 'cat', ipa: '/kæt/', set: 's-02' }; NO.ses = { mode: 'am', list: [NO.w], i: 0, got: [], sc: [], okFor: () => 80 }; NO.redo = null;
      nScore({ dims: [1, 1, 1], data: [] }); if (NO.res || NO.redo !== 77 || !/đọc lại/.test(NO.note)) bad.push('sát ngưỡng chưa bắt đọc lại');
      nScore({ dims: [1, 1, 1], data: [] }); if (!NO.res || NO.res.score !== 81 || NO.res.avg !== 77) bad.push('chưa lấy trung bình 2 lần: ' + (NO.res && NO.res.score));
      seq.push(60); NO.redo = null; nScore({ dims: [1, 1, 1], data: [] }); if (!NO.res || NO.res.score !== 60) bad.push('xa ngưỡng vẫn bắt đọc lại');
      [GOP.score, GOP.greedy, GOP.toModelPhones] = g0; NO.ses = null; NO.vocab = null; });
    tryv('val', () => { S.paVal = [...Array(40)].map((_, i) => ({ m: i % 10 !== 0, t: true, k: 'tu' })).concat([...Array(12)].map((_, i) => ({ m: i < 2, t: false, k: 'tu' })));
      const v = paValStat(); if (v.n !== 52 || Math.abs(v.fr - 0.1) > 1e-9 || Math.abs(v.miss - 2 / 12) > 1e-9 || !paValOk()) bad.push('thống kê đối chiếu sai: ' + JSON.stringify(v));
      S.paVal = S.paVal.slice(0, 30); if (paValOk()) bad.push('chưa đủ ' + PA_VAL_N + ' lần mà đã đạt'); });
    tryv('ui', () => { localStorage.setItem(NK, '1'); NO.vocab = { '<pad>': 0 }; paView(); const h = String($app.innerHTML); if (!/data-pm="cal"/.test(h) || /data-pm="val"/.test(h) || !/data-bk="paval"/.test(bkTools())) bad.push('v136: hiệu chuẩn ở Phát âm, đối chiếu giáo viên ở 🛠 Công cụ người sáng lập');
      paMenu(); if (/data-pm="(cal|val|fin|tra)"/.test(String($app.innerHTML))) bad.push('v116: 🏋️ Bài tập Phát âm còn mục không tính');
      paCal(); if (!NO.ses || NO.ses.okFor() !== 0 || NO.ses.list.length < 8) bad.push('lượt hiệu chuẩn sai'); NO.ses.onGrade(null, true, 70); NO.ses = null;
      paVal(); if (!NO.ses || !NO.ses.val || NO.ses.list.length !== 10) bad.push('lượt đối chiếu sai'); NO.ses = null; NO.vocab = null; localStorage.removeItem(NK); });
    add('cefr', 'C23', !bad.length && !errs.length, [...errs, ...bad].length ? [...errs, ...bad].slice(0, 8).join(' | ') : 'hiệu chuẩn bộ chấm âm (chỉ hạ, tối đa ' + PA_CAL_MAX + ' điểm), đọc lại khi sát ngưỡng lấy trung bình, đối chiếu giáo viên (chấm oan / bỏ sót, cần ≥ ' + PA_VAL_N + ' lần)'); }
  // v105 🔄 Lộ trình (lotrinh.js): mục tiêu → xếp cấp → đợt 10 ngày (ôn → chữa ≤ 40% phút → bài mới) → kiểm tra nhẹ cuối đợt → tổng kết; xếp cấp lại theo sự kiện
  { const bad = [], errs = [], tryv = (n, f) => { try { f(); } catch (e) { errs.push(n + ': ' + e.message); } }, tryA = async (n, f) => { try { await f(); } catch (e) { errs.push(n + ': ' + e.message); } };
    S = blank(); const H = () => String($app.innerHTML), now = Date.now(), t = dayOf(now);
    await tryA('mở lần đầu', () => ltView()); if (!H().includes('Bạn học tiếng Anh để làm gì') || (H().match(/data-ltk=/g) || []).length !== 4) bad.push('lần đầu chưa hỏi mục tiêu (v112: 3 bước)');
    // v107: có mục tiêu là có đợt 1 (không còn nút "Bắt đầu đợt 1"); việc hằng ngày chỉ ở ô Hôm nay, Lộ trình chỉ tóm tắt + lối tắt
    ltSt().goal = { lv: 'a2', date: '' }; await tryA('có mục tiêu', () => ltView());
    if (!ltCur() || ltSt().d.length !== 1 || ltRe().k !== 'first' || !H().includes('data-ltnext') || !H().includes('id="today"') || !H().includes('data-place')) bad.push('có mục tiêu: chưa tự bắt đầu đợt / thiếu màn Hôm nay (v112)');
    await tryA('đợt 1', () => ltPlanView()); if (ltSt().d.length !== 1 || !H().includes('Ngày 1 / 10') || !H().includes('Đường tới') || !H().includes('data-lt="place"') || H().includes('data-lt="chk"')) bad.push('màn đợt 1 sai (v112: ở màn Đường tới mục tiêu)');
    // ⏱ phút chữa lỗi: chỉ cộng khi đang ở buổi chữa (bản đồ, sổ lỗi); về màn khác thì thôi
    tryA('vào Học', () => overview('pre')); if (LT_FIX_ON) bad.push('Học vẫn tính phút chữa');
    S.err = []; tryv('sổ lỗi', () => errRun(() => {}, () => {})); if (!LT_FIX_ON) bad.push('sổ lỗi chưa tính phút chữa');
    S.act = {}; actTick(now); actTick(now + 60000); if (ltFixMin(t) !== Math.round((actSt()[t].ms) / 60000) || (S.lt.fx[t] || 0) < 60000) bad.push('phút chữa sai: ' + JSON.stringify(S.lt.fx));
    tryv('sổ từ', () => vwRun(now, () => {}, () => {})); if (LT_FIX_ON) bad.push('sổ từ vẫn tính phút chữa'); const fx0 = S.lt.fx[t]; actTick(now + 90000); if (S.lt.fx[t] !== fx0) bad.push('ngoài buổi chữa vẫn cộng');
    if (ltCap() !== Math.round(actGoal() * LT_FIX)) bad.push('trần phút chữa sai');
    // 🧭 xếp cấp lại: ≥ 60 ngày, hoàn thành cấp, trượt thi vượt; ≤ 30 ngày tới ngày thi → đề mẫu chính thức
    S.place = { at: now - (LT_RE_D + 1) * DAY, top: 'a1', st: 'pre' }; if ((ltRe(now) || {}).k !== 'age') bad.push('60 ngày chưa nhắc xếp lại');
    S.place.at = now; if (ltRe(now)) bad.push('mới xếp mà vẫn nhắc: ' + ltRe(now).k);
    S.vc = { pend: [], log: [{ id: 'tv', lv: 'a1', at: now + 1, pass: false }] }; if ((ltRe(now) || {}).k !== 'vc') bad.push('trượt thi vượt chưa nhắc'); S.vc = { pend: [], log: [] };
    ltSt().goal.date = new Date(now + 20 * DAY).toISOString().slice(0, 10); if ((ltRe(now) || {}).k !== 'real') bad.push('gần ngày thi chưa chỉ đề mẫu');
    ltSt().goal.lv = 'b2'; if ((ltRe(now) || {}).k === 'real') bad.push('còn xa mục tiêu mà vẫn chỉ đề mẫu'); ltSt().goal = { lv: 'a2', date: '' };
    // kiểm tra nhẹ: cấp đang học + cấp kế (cấp "+" về cấp gốc)
    if (ltBase('a2p') !== 'a2' || ltBase('pre') !== 'pre' || ltBase('c2') !== 'c1') bad.push('ltBase sai'); await loadEB(); if (plQs(ltBase('pre')).length < 3 || plQs('a1').length < 3) bad.push('kiểm tra nhẹ thiếu câu');
    // ngày 10: mở kiểm tra; đóng đợt → tổng kết (chỗ yếu đã chọn chữa xong / đã chọn), đợt sau tự bắt đầu
    const c = ltCur(); c.d0 = t - 9; c.sel = ['tv|x|nghia', 'np|y|nhan']; await tryA('ngày 10', () => ltView()); if (!H().includes('data-lt="chk"') || !H().includes('Xem tổng kết 10 ngày') || H().includes('kiểm tra 10 ngày')) bad.push('ngày 10 chưa có việc xem tổng kết (v136: bỏ bài kiểm tra cuối đợt)');
    S.focus = { h: [[t, 'tv', 'tv|x|nghia'], [t - 20, 'np', 'np|y|nhan']] }; c.chk = { R: { pre: [4, 5], a1: [2, 5] } };
    tryv('đóng đợt', () => ltClose(c, now)); const s = c.sum || {};
    if (s.sel !== 2 || s.selOk !== 1 || s.okFix !== true || s.n !== 10 || ltSt().d.length !== 2 || !ltCur() || ltCur().n !== 2) bad.push('tổng kết đợt sai: ' + JSON.stringify(s));
    tryv('màn tổng kết', () => ltSumView(c)); if (!H().includes('Tổng kết đợt 1') || !H().includes('1/2') || !H().includes('Pre-A1 4/5')) bad.push('màn tổng kết thiếu số');
    // nút về: xếp cấp, ôn chung, bản đồ mở từ Lộ trình thì về Lộ trình
    await tryA('xếp cấp từ Lộ trình', () => placeView(ltView)); tryv('thôi xếp cấp', () => $app.onclick({ target: { closest: q => q === '[data-a="back"]' ? {} : null } })); await new Promise(r => setTimeout(r, 0));
    if (CUR.view !== 'lo-trinh') bad.push('xếp cấp không về Lộ trình: ' + CUR.view);
    S.err = []; S.ie = S.ie || {}; S.ie.vw = []; tryv('ôn chung từ Lộ trình', () => revRun(ltView)); await new Promise(r => setTimeout(r, 0)); if (CUR.view !== 'lo-trinh' && !/part|hoc|tu-vung/.test(CUR.view || '')) bad.push('ôn chung không về Lộ trình: ' + CUR.view);
    MAP_BACK = 'lt'; await tryA('bản đồ từ Lộ trình', () => mapView()); if (!H().includes('id="lt"') || !(H().includes('← Lộ trình') || H().includes('data-ltseg="map"'))) bad.push('bản đồ từ Lộ trình sai'); MAP_BACK = 'lt';
    const hd = HD.map(x => x[2]()).join(' '); if (!HD.some(x => x[0] === 'lotrinh') || !hd.includes(Math.round(LT_FIX * 100) + '% số phút') || !hd.includes(LT_RE_D + ' ngày') || !hd.includes('🧭 Lộ trình')) bad.push('Luật thiếu mục Lộ trình');
    add('cefr', 'C24', !bad.length && !errs.length, [...errs, ...bad].length ? [...errs, ...bad].slice(0, 8).join(' | ') : 'Lộ trình: mục tiêu, xếp cấp lại theo sự kiện (' + LT_RE_D + ' ngày, hoàn thành cấp, trượt thi vượt, gần ngày thi → đề mẫu), đợt ' + LT_D + ' ngày, phút chữa ≤ ' + Math.round(LT_FIX * 100) + '%, kiểm tra nhẹ, tổng kết, nút về đều đúng'); }
  // v106 🔎 xác nhận chỗ yếu sau bài kiểu xếp cấp (chandoan.js): câu sai = giả thuyết; hỏi thêm 2 câu dạng khác; sai thật: chưa học → 🧭 chỗ hổng nền, đã học → chấm như luyện tập; bản đồ gộp một danh sách
  { const bad = [], errs = [], tryv = (n, f) => { try { f(); } catch (e) { errs.push(n + ': ' + e.message); } }, tryA = async (n, f) => { try { await f(); } catch (e) { errs.push(n + ': ' + e.message); } };
    S = blank(); await loadEB(); await kLoad(KIT.np); const H = () => String($app.innerHTML), now = Date.now(), D = 864e5, t = dayOf(now);
    const click = k => $app.onclick({ target: { closest: s => s === '[data-po]' ? { dataset: { po: String(k) } } : null } });
    const right = set => { const m = [...H().matchAll(/data-po="([0-9]+)">([^<]*)</g)].find(x => set.has(x[2])); return m ? +m[1] : -9; };
    const ws = WORDS.filter(x => wLv(x) === 'pre' && x.cloze && x.vi && !/[&<>"']/.test(x.w + x.cloze.a + x.vi)), [w1, w2, w3] = ws;
    const g = KIT.np.items.find(x => x.lv === 'pre' && x.hieu && x.hieu.length), q0 = KIT.np.q(g, 'nhan', 'test')[0];
    const vq = plCfQs({ w: w1 }), gq = plCfQs({ g, q: q0 });
    if (vq.length !== 2 || vq.some(q => q.type === 'w2vi')) bad.push('câu xác nhận từ phải khác dạng xếp cấp: ' + vq.map(q => q.type));
    if (gq.length !== 2 || gq.some(q => q.q === q0.q)) bad.push('câu xác nhận ngữ pháp trùng câu đã hỏi');
    // w1 sai rồi đúng (sai thật: 2 / 3), w2 đúng cả 2 (bấm nhầm), g sai cả 2 (sai thật); chưa học → chỗ hổng nền
    S.place = { at: now, top: 'a1', gap: [] }; let cf = null;
    const vset = w => new Set([w.w, w.cloze.a]), gset = new Set([...(g.hieu || []).map(h => h.a), ...g.mc.learn.map(m => m.a), ...g.mc.test.map(m => m.a)]);
    tryv('xác nhận', () => { plConfirm([{ w: w1, lv: 'pre' }, { w: w2, lv: 'pre' }, { g, q: q0, lv: 'pre' }], { gap: true, intro: 'x' }, r => { cf = r; });
      if (!H().includes('Bỏ qua bước này') || !/xac-nhan/.test(CUR.view) || !TD_NOTAP.test(CUR.view)) bad.push('màn xác nhận sai');
      click(-1); click(right(vset(w1))); click(right(vset(w2))); click(right(vset(w2))); click(-1); click(-1); });
    if (!cf || cf.n !== 3 || cf.sure !== 2 || cf.noise !== 1) bad.push('kết quả xác nhận sai: ' + JSON.stringify(cf));
    if (S.cards[w1.id] || kSt('np').cards[g.id]) bad.push('chỗ hổng chưa học mà đã tạo thẻ (tính 📘 Học)');
    if (plGaps().map(x => x.k).sort().join() !== ['tv|' + w1.id, 'np|' + g.id].sort().join()) bad.push('chỗ hổng nền sai: ' + plGaps().map(x => x.k));
    if (!todayBox('pre').includes('chỗ bài kiểm tra phát hiện')) bad.push('ô Hôm nay thiếu việc chữa chỗ hổng');
    await tryA('bản đồ', () => mapView()); if (!H().includes('Việc cần chữa') || !H().includes('🧭 2 chỗ hổng nền') || !H().includes('data-map="gap"') || !H().includes('Chữa tiếp: chỗ hổng nền trước')) bad.push('bản đồ chưa có chỗ hổng nền ở 🌱 Gốc');
    // hết hổng: đúng ở ngày SAU lần sai gần nhất; đúng cùng ngày = ✔ chờ; sai lại thì tính từ lần sai mới
    mapHit('tv', w1.id, [], true, now); if (plGaps().find(x => x.id === 'tv').cho !== true) bad.push('đúng cùng ngày chưa thành chờ');
    mapHit('tv', w1.id, [], true, now + D); if (plGaps().some(x => x.id === 'tv')) bad.push('đúng ngày sau chưa hết hổng');
    mapHit('np', g.id, [], false, now + D); mapHit('np', g.id, [], true, now + D); if (!plGaps().some(x => x.id === 'np')) bad.push('sai rồi đúng cùng ngày đã hết hổng');
    mapHit('np', g.id, [], true, now + 2 * D); if (plGaps().length) bad.push('chỗ hổng ngữ pháp chưa hết');
    // mục đã học: chấm như luyện tập, không vào chỗ hổng
    S.cards[w3.id] = { S: 3, last: now - 2 * D, d0: t - 2, ok: 1, pv: 0, n: 1, lapse: 0 }; cf = null;
    tryv('xác nhận đã học', () => { plConfirm([{ w: w3, lv: 'pre' }], { gap: false }, r => { cf = r; }); click(-1); click(-1); });
    if (!cf || cf.sure !== 1 || S.cards[w3.id].lapse < 1 || S.place.gap.some(x => x.k === 'tv|' + w3.id && !x.ok)) bad.push('mục đã học xác nhận sai: ' + JSON.stringify(S.cards[w3.id]));
    // xếp cấp: A2 đúng 4/5 → B1 không biết → xếp A2; câu sai ở A2 → bước xác nhận; bỏ qua → kết quả; chỗ hổng cũ chưa hết được giữ khi xếp lại
    S.place.gap.push({ k: 'tv|' + w2.id, lv: 'pre', d: t - 5, wd: t - 5 });
    const pq0 = plQs, fake = lv => WORDS.filter(x => wLv(x) === 'a2' && x.vi).slice(0, 5).map(w => ({ w, q: { top: esc(w.w), sub: 'nghĩa là gì?', a: 'A', opts: ['A', 'B', 'C', 'D'] } }));
    plQs = fake; await tryA('xếp cấp', () => placeView(ltView)); tryv('làm xếp cấp', () => { click(0); click(0); click(0); click(0); click(1); for (let k = 0; k < 5; k++) click(-1); }); plQs = pq0;
    if (!S.place || S.place.top !== 'a2' || !/xac-nhan/.test(CUR.view)) bad.push('xếp cấp chưa sang bước xác nhận: ' + (S.place && S.place.top) + ' ' + CUR.view);
    if (!S.place.gap.some(x => x.k === 'tv|' + w2.id)) bad.push('xếp lại làm mất chỗ hổng cũ');
    tryv('bỏ qua', () => $app.onclick({ target: { closest: s => s === '[data-a="skip"]' ? {} : null } })); if (!H().includes('Bạn đang ở khoảng A2') || !H().includes('data-pla="go"')) bad.push('bỏ qua xác nhận chưa ra kết quả');
    const hd = HD.map(x => x[2]()).join(' '); if (!hd.includes('Xếp cấp khác 🔎 kiểm tra tìm điểm yếu') || !hd.includes('Việc cần chữa')) bad.push('Luật thiếu xếp cấp ≠ kiểm tra / bản đồ gộp');
    add('cefr', 'C25', !bad.length && !errs.length, [...errs, ...bad].length ? [...errs, ...bad].slice(0, 8).join(' | ') : 'xếp cấp ≠ kiểm tra tìm điểm yếu: câu sai hỏi thêm ' + PL_CF_N + ' câu dạng khác, sai thật → chỗ hổng nền (không tạo thẻ) / chấm như luyện tập; hết hổng khi đúng ở ngày sau; bản đồ một danh sách, gốc trước'); }
  // v107 rà lại theo dữ liệu thật: xếp cấp đo xuống khi vẫn lưng chừng; ⏳ ước thời gian + "khó kịp"; đề mẫu chỉ khi gần mục tiêu; ô Hôm nay là danh sách việc DUY NHẤT; một luật "chữa xong"
  { const bad = [], errs = [], tryv = (n, f) => { try { f(); } catch (e) { errs.push(n + ': ' + e.message); } }, tryA = async (n, f) => { try { await f(); } catch (e) { errs.push(n + ': ' + e.message); } };
    S = blank(); await Promise.all([loadEB(), kLoad(KIT.np)]); const H = () => String($app.innerHTML), now = Date.now(), D = 864e5, t = dayOf(now), ymd = n => new Date(now + n * D).toISOString().slice(0, 10);
    // ① bậc thang xếp cấp: A2 6/10 → đo A1 (trước: dừng, "bắt đầu từ đầu")
    if (plNext({ a2: [6, 10] }, 'a2') !== 'a1') bad.push('A2 6/10 chưa đo xuống A1');
    if (plNext({ a2: [3, 5] }, 'a2') !== 'a2') bad.push('lưng chừng 5 câu chưa thêm vòng');
    if (plNext({ a2: [6, 10], a1: [5, 5] }, 'a1') !== null || plResult({ a2: [6, 10], a1: [5, 5] }) !== 'a1') bad.push('A1 vững sau A2 lưng chừng: kết quả sai');
    // ② ⏳ ước thời gian: giờ Cambridge / phút mỗi ngày; mốc theo xếp cấp; báo khó kịp + cấp vừa sức
    const g = { lv: 'b1', date: ymd(30) }, f = ltFeas(g, 45, now);
    if (f.h !== LT_GLH.b1 || f.days !== Math.ceil(LT_GLH.b1 * 60 / 45) || !f.late || !/khó kịp/.test(ltFeasTxt(g, 45, now))) bad.push('Pre-A1 → B1 trong 30 ngày chưa báo khó kịp: ' + JSON.stringify(f));
    if (/khó kịp/.test(ltFeasTxt({ lv: 'a1', date: ymd(400) }, 45, now))) bad.push('đủ thời gian vẫn báo khó kịp');
    if (ltFit(400, 45) !== 'a2p') bad.push('cấp vừa sức sai: ' + ltFit(400, 45));
    S.place = { at: now, top: 'a2', st: 'pre' }; if (ltNeed('b1', 45).h !== LT_GLH.b1 - LT_GLH.a2) bad.push('ước chưa tính mốc xếp cấp');
    // ③ đề mẫu chính thức chỉ khi còn cách mục tiêu ≤ 1 cấp
    S.place = { at: now, top: null, st: 'pre' }; ltSt().goal = g; if (ltRe(now)) bad.push('Pre-A1 thi B1 sau 30 ngày vẫn được khuyên: ' + ltRe(now).k);
    ltSt().goal = { lv: 'a1', date: ymd(20) }; if ((ltRe(now) || {}).k !== 'real') bad.push('gần mục tiêu chưa chỉ đề mẫu');
    // ④ ô Hôm nay là danh sách việc duy nhất; Lộ trình chỉ tóm tắt + lối tắt; dòng đợt; ngày 10 kiểm tra; đủ phút chữa → chuyển bài mới; đang ôn IELTS → 1 việc luyện thi
    ltSt().goal = { lv: 'a2', date: '' }; S.lt.d = []; await tryA('Lộ trình', () => ltView());
    if (!ltCur() || !H().includes('id="today"') || (H().match(/id="today"/g) || []).length !== 1) bad.push('Lộ trình phải có đúng một ô Hôm nay');
    await overview('pre'); if (H().includes('id="today"')) bad.push('📚 Học vẫn còn ô Hôm nay (phải chỉ ở Lộ trình)'); await ltView();
    let tb = todayBox('pre'); if (!tb.includes('data-ltgo') || !tb.includes('Đợt 1 · ngày 1/10') || tb.includes('data-lt="chk"')) bad.push('ô Hôm nay thiếu dòng đợt');
    ltCur().d0 = t - 9; if (!todayBox('pre').includes('data-lt="chk"')) bad.push('ngày 10 ô Hôm nay chưa có kiểm tra cuối đợt');
    const w = WORDS.find(x => wLv(x) === 'pre' && !S.cards[x.id]); S.place.gap = [{ k: 'tv|' + w.id, lv: 'pre', d: t, wd: t }];
    if (!todayBox('pre').includes('1 chỗ bài kiểm tra phát hiện')) bad.push('chưa có việc chữa');
    ltSt().fx = { [t]: ltCap() * 60000 }; if (!/task done[^>]*data-today="fix"/.test(todayBox('pre')) || !todayBox('pre').includes('Đủ cho hôm nay')) bad.push('đủ phút chữa chưa nhắc chuyển bài mới');
    // v108: việc luyện đề theo mục tiêu (IELTS, xếp cấp B1 → nền thiếu 1,5 cấp so với B2+ → 70 / 30); mục tiêu không thi → không có việc đề
    const g0 = ltSt().goal; S.ie = { set: 1, target: 6.5 }; ltSt().goal = { kind: 'ielts', lv: 'b2p', date: '', at: now }; S.place.top = 'b1';
    { const tb26 = todayBox('pre'); if (!(tb26.includes('data-today="exam"') || tb26.includes('data-xl="ielts|')) || !/<b>(Luyện IELTS|IELTS [^<]+)<\\/b>/.test(tb26)) bad.push('mục tiêu IELTS chưa có việc luyện đề'); }
    ltSt().goal = { kind: 'cefr', lv: 'a2', date: '', at: now }; if (/data-today="exam"|data-xl="/.test(todayBox('pre'))) bad.push('mục tiêu không thi vẫn có việc luyện đề'); ltSt().goal = g0; S.place.top = null; delete S.exSel; delete S.ie;
    // ⑤ một luật "chữa xong" cho mọi bản đồ: đạt ngay trong ngày vừa trượt không tính
    const F = { a: [{ u: 'x', tr: 0, pd: [] }] }; fcHit(F, 'x', false, now); fcHit(F, 'x', true, now); if (F.a[0].pd.length) bad.push('IELTS / TOEIC: đạt cùng ngày trượt vẫn tính');
    fcHit(F, 'x', true, now + D); fcHit(F, 'x', true, now + 2 * D); if (F.a[0].pd.length !== 2) bad.push('đạt 2 ngày sau ngày trượt chưa tính');
    const hd = HD.map(x => x[2]()).join(' '); if (!hd.includes('chỗ duy nhất') || !hd.includes('Ước thời gian') || !hd.includes('dùng chung nguyên tắc')) bad.push('Luật thiếu phần v107');
    add('cefr', 'C26', !bad.length && !errs.length, [...errs, ...bad].length ? [...errs, ...bad].slice(0, 8).join(' | ') : 'xếp cấp đo xuống khi lưng chừng, ước thời gian + khó kịp, đề mẫu chỉ khi gần mục tiêu, ô Hôm nay là danh sách việc duy nhất (đợt, kiểm tra ngày 10, trần chữa, luyện thi), luật chữa xong chung'); }
  // v108 CEFR là nền, mục tiêu thi là phần riêng; Lộ trình là động cơ: 4 tab, mục tiêu 4 loại (nền cần có theo kỳ thi), ⚖️ chia nền / đề, phút luyện đề, màn kỳ thi theo mục tiêu
  { const bad = [], errs = [], tryv = (n, f) => { try { f(); } catch (e) { errs.push(n + ': ' + e.message); } }, tryA = async (n, f) => { try { await f(); } catch (e) { errs.push(n + ': ' + e.message); } };
    S = blank(); await Promise.all([ieLoad(), toLoad(), kLoad(KIT.np)]); const H = () => String($app.innerHTML), now = Date.now(), t = dayOf(now), el = id => document.getElementById(id);
    // ① màn mục tiêu: 4 loại; IELTS hỏi loại thi + band; lưu → S.ie (band, ngày) + mục tiêu + đợt 1
    tryv('mục tiêu IELTS', () => ltGoalView('ielts')); if (!H().includes('id="ltband"') || !H().includes('id="ltiet"') || (H().match(/data-ltk=/g) || []).length !== 4) bad.push('màn mục tiêu IELTS thiếu ô');
    Object.assign(el('ltkind'), { value: 'ielts' }); Object.assign(el('ltband'), { value: '7' }); Object.assign(el('ltiet'), { value: 'gt' }); Object.assign(el('ltdate'), { value: '' }); Object.assign(el('ltmin'), { value: '30' });
    const f0 = ltFormGoal(); if (f0.kind !== 'ielts' || f0.lv !== ieBase(7)) bad.push('đọc màn mục tiêu sai: ' + JSON.stringify(f0));
    S.ie = { target: 7, type: 'gt', set: 1 }; ltSt().goal = { kind: 'ielts', lv: ieBase(7), date: '', at: now }; S.goal = 30; S.exSel = 'ielts';
    if (ltGoalLv() !== 'c1' || !/IELTS 7\.0 General Training/.test(ltGoalName())) bad.push('nền cần có / tên mục tiêu IELTS sai: ' + ltGoalLv() + ' ' + ltGoalName());
    // ② ⚖️ chia nền / đề: thiếu ≥ 2 cấp → 100 / 0; ≥ 1 → 70 / 30; < 1 → 30 / 70; đủ → 10 / 90; không thi → 100
    S.place = { at: now, top: 'a2', st: 'pre' }; let sp = ltSplit(); if (sp.nen !== 100 || sp.ex !== 0) bad.push('thiếu 3 cấp chưa 100% nền: ' + JSON.stringify(sp));
    S.place.top = 'b2'; sp = ltSplit(); if (sp.nen !== 70) bad.push('thiếu 1 cấp chưa 70 / 30: ' + JSON.stringify(sp));
    S.place.top = 'b2p'; sp = ltSplit(); if (sp.nen !== 30 || sp.exM !== 21) bad.push('thiếu nửa cấp chưa 30 / 70: ' + JSON.stringify(sp));
    S.place.top = 'c1'; sp = ltSplit(); if (sp.nen !== 10) bad.push('đủ nền chưa 10 / 90');
    if (ltSplitFor('cefr', 'c2').nen !== 100) bad.push('mục tiêu không thi phải 100% nền');
    // ③ ô Hôm nay theo tỉ lệ: 10 / 90 bỏ bài mới + kỹ năng nền; 100 / 0 chỉ một dòng xem dạng đề; luyện đề xong khi đủ phút
    let tb = todayBox('pre'); if (/data-today="part"/.test(tb) || /data-today="skill"/.test(tb) || !/<b>(Luyện IELTS|IELTS [^<]+)<\\/b>/.test(tb) || !tb.includes('27 phút')) bad.push('10 / 90: ô Hôm nay sai');
    ltSt().ex = { [t]: 27 * 60000 }; if (!todayBox('pre').includes('Đủ 27 phút hôm nay')) bad.push('đủ phút đề chưa xong'); ltSt().ex = {};
    S.place.top = 'a2'; tb = todayBox('pre'); if (/<b>(Luyện IELTS|IELTS [^<]+)<\\/b>/.test(tb) || !tb.includes('Chưa cần luyện đề IELTS') || !/data-today="skill"/.test(tb)) bad.push('100 / 0: ô Hôm nay sai');
    // ④ phút luyện đề: ở màn kỳ thi thì cộng vào S.lt.ex, về màn nền thì thôi
    await tryA('màn IELTS', () => ieltsView()); if (!LT_EX_ON) bad.push('màn IELTS chưa tính phút đề');
    S.act = {}; ltSt().ex = {}; actTick(now); actTick(now + 60000); if ((ltSt().ex[t] || 0) < 60000) bad.push('phút đề không cộng');
    await tryA('về Học', () => overview('pre')); if (LT_EX_ON) bad.push('về 📚 Học vẫn tính phút đề'); const e0 = ltSt().ex[t]; actTick(now + 90000); if (ltSt().ex[t] !== e0) bad.push('ngoài màn đề vẫn cộng');
    // ⑤ kỳ thi theo mục tiêu; màn kỳ thi có dòng mục tiêu thay hàng chọn kỳ thi; IELTS giờ / tuần lấy theo Lộ trình
    S.place.top = 'b2p'; EX_PART = null; await tryA('mở đề IELTS', () => exOpen()); if (CUR.view !== 'ielts' || !H().includes('exrow') || H().includes('Hôm nay & kế hoạch') || H().includes('id="iehpw"')) bad.push('màn IELTS sai (v111: không có kế hoạch; v141: hàng chọn kỳ thi)');
    await tryA('việc luyện đề vào thẳng bài', () => exGo()); if (!/ielts|de-thu|luyen|ie/.test(String(CUR.view))) bad.push('exGo không mở bài IELTS: ' + CUR.view);
    await tryA('xem TOEIC khi mục tiêu IELTS', () => toeicView()); if (LT_EX_ON || CUR.view !== 'toeic') bad.push('v109: xem kỳ thi khác vẫn mở được nhưng không tính phút đề'); await tryA('về IELTS', () => ieltsView()); if (!LT_EX_ON) bad.push('kỳ thi của mục tiêu chưa tính phút đề');
    if (iePlan().hpw !== Math.max(0.5, Math.round(ltSplit().exM * 7 / 60 * 2) / 2)) bad.push('giờ IELTS / tuần chưa theo Lộ trình');
    S.to = { target: 650 }; ltSt().goal = { kind: 'toeic', lv: toBase(650), date: '', at: now }; await tryA('mở đề TOEIC', () => exOpen()); if (CUR.view !== 'toeic' || ltGoalLv() !== toBase(650)) bad.push('mục tiêu TOEIC chưa mở TOEIC');
    ltSt().goal = { kind: 'cambridge', lv: 'b1', date: '', at: now }; await tryA('mở Cambridge', () => exOpen()); if (CUR.view !== 'cambridge' || CB_LV !== 'b1') bad.push('mục tiêu Cambridge chưa mở đúng cấp');
    // ⑥ 📚 Học: ô mục tiêu + nút phần riêng + 🧱 Nền CEFR, không có ô Hôm nay; Lộ trình có ô Hôm nay + ⚖️
    ltSt().goal = { kind: 'ielts', lv: ieBase(7), date: '', at: now }; await tryA('Học', () => overview('pre'));
    if (!H().includes('id="ov"') || !H().includes('>Học</h1>') || !H().includes('class="hrow') || H().includes('data-ltex') || H().includes('Việc hôm nay') || H().includes('id="today"') || !H().includes('🎯 Luyện IELTS') || !H().includes('data-exthi') || H().includes('data-ovx=') || H().includes('data-exsel=')) bad.push('📚 Học chưa đúng (v141: chỉ Tiếng Anh + một dòng chỉ sang tab 🎯 Luyện đề)');
    EX_PART = null; await tryA('mở mục Thi', () => exOpenK(exGoalK() || 'cefr')); if (CUR.view !== 'ielts' || !H().includes('exrow')) bad.push('mục Thi chưa mở kỳ thi mục tiêu / thiếu hàng chọn kỳ thi'); EX_PART = 'san'; await tryA('Học', () => overview('pre'));
    await tryA('Lộ trình', () => ltView()); if (!H().includes('id="today"') || !H().includes('data-ltplan')) bad.push('🧭 Lộ trình thiếu màn Hôm nay / ô mục tiêu');
    await tryA('Đường tới mục tiêu', () => ltPlanView()); if (!H().includes('chia thế nào') || !H().includes('IELTS')) bad.push('màn Đường tới mục tiêu thiếu ⚖️ chia nền / đề');
    S.ie.date = new Date(now + 70 * 864e5).toISOString().slice(0, 10); await tryA('Lộ trình kế hoạch IELTS', () => ltPlanView()); if (!/Còn <b>1[01] tuần/.test(H())) bad.push('Lộ trình thiếu số tuần còn lại của kỳ thi'); delete S.ie.date; delete S.lt;
    const hd = HD.map(x => x[2]()).join(' '); if (!hd.includes('5 tab') && !HD.some(x => /5 tab/.test(x[1]))) bad.push('Luật chưa ghi 5 tab (v141)'); if (!hd.includes('Chia thời gian nền / đề') || !hd.includes('mở đầu tiên')) bad.push('Luật thiếu ⚖️ / tab mới');
    S.place = null; S.exSel = null; delete S.ie; delete S.to;
    add('cefr', 'C27', !bad.length && !errs.length, [...errs, ...bad].length ? [...errs, ...bad].slice(0, 8).join(' | ') : '4 tab (Lộ trình đầu tiên), mục tiêu 4 loại + nền cần có, ⚖️ nền / đề 100–70–30–10, ô Hôm nay theo tỉ lệ, phút luyện đề, màn kỳ thi theo mục tiêu, giờ IELTS theo Lộ trình, 📚 Học = mục tiêu + nền'); }
  // v112 giao diện trực quan: bắt đầu 3 bước (mục đích → trình độ → phút / ngày), 🧭 Hôm nay (vòng phút, MỘT nút ▶ Học tiếp, việc ✓ / ▶, ô 🎯), 🛣 Đường tới mục tiêu, 📚 Học = ô phần, màn phần nút chính lên đầu
  { const bad = [], errs = [], tryv = (n, f) => { try { f(); } catch (e) { errs.push(n + ': ' + e.message); } }, tryA = async (n, f) => { try { await f(); } catch (e) { errs.push(n + ': ' + e.message); } };
    S = blank(); const H = () => String($app.innerHTML), now = Date.now();
    await tryA('bước 1', () => ltView());
    if (!H().includes('Bạn học tiếng Anh để làm gì') || H().split('data-ltk=').length !== 5 || !H().includes('class="wdots"') || !H().includes('data-ltw="2"') || H().includes('data-ltnext')) bad.push('bước 1 (mục đích) sai');
    tryv('bước 1 IELTS', () => { LT_W.kind = 'ielts'; ltWFix(LT_W); ltWizard(); }); if (!H().includes('data-ltwv="band|6.5"') || !H().includes('data-ltwv="type|ac"')) bad.push('bước 1 IELTS thiếu band / loại thi');
    tryv('bước 2', () => { LT_W.step = 2; ltWizard(); }); if (!H().includes('Bạn đang ở trình độ nào') || !H().includes('data-ltwp') || !H().includes('data-ltself="new"')) bad.push('bước 2 (trình độ) sai');
    tryv('bước 3', () => { LT_W.step = 3; ltWizard(); }); if (!H().includes('Mỗi ngày bạn học bao lâu') || H().split('data-ltwv="mins|').length !== 5 || !H().includes('type="date"') || !H().includes('data-lt="goal"')) bad.push('bước 3 (phút / ngày) sai');
    // 🧭 Hôm nay: chưa có dữ liệu → việc đầu là kiểm tra trình độ; tự chọn "mới bắt đầu" thì không nhắc
    LT_W = null; ltSt().goal = { kind: 'cefr', lv: 'a2', date: '', at: now }; await tryA('Hôm nay', () => ltView()); let h = H();
    if (!/>Chào buổi (sáng|trưa|chiều|tối)<\\/h1>/.test(h) || !h.includes('<svg') || !h.includes(' trên ' + actGoal() + ' phút') || !h.includes('Việc hôm nay') || !h.includes('data-ltplan')) bad.push('màn Hôm nay thiếu vòng phút / việc / ô mục tiêu');
    if (h.split('data-ltnext').length !== 2 || h.split('task next').length !== 2 || !h.includes('class="task next" data-place') || !h.includes('▶ Học tiếp<small>Kiểm tra trình độ')) bad.push('cần đúng 1 nút ▶ Học tiếp, trỏ vào việc kế tiếp');
    ltSt().self = 'new'; await tryA('mới bắt đầu', () => ltView()); h = H(); if (h.includes('data-place') || h.split('task next').length !== 2) bad.push('tự chọn mới bắt đầu vẫn nhắc kiểm tra trình độ');
    // 🛣 Đường tới mục tiêu: đường cấp có 🎯, thanh chia nền / đề, 10 chấm ngày, đo trình độ, đổi mục tiêu
    await tryA('Đường tới', () => ltPlanView()); h = H(); const d10 = (h.split('class="days10">')[1] || '').split('</div>')[0];
    if (!h.includes('Đường tới') || !h.includes('class="lvpath"') || !h.includes('🎯') || h.includes('class="split"') || d10.split('<i ').length !== 11 || !h.includes('data-lt="place"') || !h.includes('data-lt="edit"') || !h.includes('data-ltseg="today"') || !h.includes('Trình độ của bạn')) bad.push('màn Tiến độ thiếu phần');
    // 📚 Học: ô phần (lưới), không có việc hôm nay; màn phần: 📘 Học / 🏋️ Luyện tập trước, giải thích gập
    await tryA('Học', () => overview('pre')); h = H(); const nT = h.split('class="hrow').length - 1;
    if (nT < 5 || h.includes('class="seg"') || h.includes('Việc hôm nay')) bad.push('📚 Học chưa thành dòng kỹ năng (v134): ' + nT);
    const first = (x, a, b) => { const i = x.indexOf(a), j = x.indexOf(b); return i >= 0 && j >= 0 && i < j; };
    // v118: khuôn 3 tầng: đường 3 bước → 2 nút → danh sách bài → "Thêm" gập ở cuối
    await tryA('màn Ngữ pháp', () => kView('np')); h = H(); if (!first(h, 'class="btnbig" data-k="learn"', 'id="klist"') || !first(h, 'id="klist"', 'class="box examc') || !first(h, 'class="box examc', '<details class="box more"')) bad.push('màn phần: thứ tự (nút chính → danh sách → ô bài thi → Thêm) sai');
    tryv('màn Từ vựng', () => home()); h = H(); if (!first(h, 'class="btnbig" data-a="learn"', 'id="grid"') || !first(h, 'id="grid"', 'class="box examc') || !first(h, 'class="box examc', '<details class="box more"')) bad.push('màn Từ vựng: thứ tự (nút chính → danh sách → ô bài thi → Thêm) sai');
    const bd = (HD.find(x => x[0] === 'batdau') || [, , () => ''])[2](); if (!bd.includes('Học tiếp') || !bd.includes('3 câu')) bad.push('Luật mục Bắt đầu chưa theo giao diện mới');
    S.place = null; delete S.lt; LT_SESS = false;
    add('cefr', 'C28', !bad.length && !errs.length, [...errs, ...bad].length ? [...errs, ...bad].slice(0, 8).join(' | ') : 'bắt đầu 3 bước, Hôm nay (vòng phút, 1 nút ▶ Học tiếp, việc ✓ / ▶, tự chọn mới bắt đầu), Đường tới mục tiêu, 📚 Học ô phần, màn phần nút chính lên đầu'); }
  // v113 màn kỳ thi cùng khung (IELTS / TOEIC / Cambridge); v122 theo khuôn Nền: lưới ô kỹ năng → màn con; nền thiếu xa thì ô nhắc 🧱 Học nền trước; thi thử, đề thật… trong "Thêm" gập
  { const bad = [], errs = [], tryv = (n, f) => { try { f(); } catch (e) { errs.push(n + ': ' + e.message); } }, tryA = async (n, f) => { try { await f(); } catch (e) { errs.push(n + ': ' + e.message); } };
    S = blank(); await Promise.all([ieLoad(), toLoad(), kLoad(KIT.np)]); const H = () => String($app.innerHTML), now = Date.now();
    S.ie = { target: 7, type: 'ac', set: 1 }; ltSt().goal = { kind: 'ielts', lv: ieBase(7), date: '', at: now }; S.place = { at: now, top: 'a2', st: 'pre' };
    EX_PART = null; await tryA('IELTS nền thiếu xa', () => ieltsView()); let h = H();
    // v122 (khuôn Nền): không còn nút to ▶ Luyện tiếp; nền thiếu ≥ 2 cấp thì ô nhắc ⚖️ có nút 🧱 Học nền trước
    if (!h.includes('⚖️ Nền còn thiếu xa') || !h.includes('data-hocnen') || (h.match(/class="btnbig/g) || []).length !== 2 || /class="btnbig" data-daigo/.test(h) || h.includes('▶ Luyện tiếp')) bad.push('nền thiếu ≥ 2 cấp: thiếu dòng nhắc học nền / màn 2 nút sai (v142)');
    EX_PART = 'san'; await tryA('IELTS phần 📚', () => ieltsView()); h = H(); if (!h.includes('data-expart=""') || !h.includes('class="grid2"') || !h.includes('<details class="box more">')) bad.push('phần 📚 thiếu nút ‹ Luyện đề / lưới ô / mục Thêm gập');
    S.place.top = 'b2p'; await tryA('IELTS gần đủ nền', () => ieltsView()); h = H(); if (h.includes('⚖️ Nền còn thiếu xa') || ((x => (x.match(/class="btnbig/g) || []).length !== (/class="btnbig" data-daigo/.test(x) ? 1 : 0))(h))) bad.push('đủ gần nền: không nhắc học nền, không nút to ngoài 🤖');
    // màn con kỹ năng: tính phút đề khi là kỳ thi của mục tiêu; nút ‹ IELTS về màn IELTS
    tryv('màn con Viết', () => ieSkView('W')); if (!LT_EX_ON || !H().includes('data-iew="t2"') || CUR.sk !== 'W') bad.push('màn con IELTS Viết sai / chưa tính phút đề');
    await tryA('về IELTS', () => ieClick({ target: { closest: x => x === '[data-iehome]' ? {} : null } })); if (!H().includes('data-iesk="W"') || CUR.sk) bad.push('‹ IELTS chưa về màn IELTS');
    await tryA('TOEIC khi mục tiêu IELTS', () => toeicView()); tryv('màn con tốc độ', () => toSkView('T')); if (LT_EX_ON || !H().includes('data-tospd="p5"')) bad.push('màn con TOEIC: kỳ thi không phải mục tiêu vẫn tính phút / thiếu nút');
    // ô Hôm nay: "Xem dạng đề" chỉ mở màn kỳ thi (không tự vào bài)
    S.place.top = 'a2'; { const tb = todayBox('pre'); if (!tb.includes('Chưa cần luyện đề IELTS') || !tb.includes('data-ltex>Xem dạng đề') || tb.includes('data-today="exam"')) bad.push('Xem dạng đề còn tự vào bài'); }
    // Cambridge: nút chính = đề thử; đề mẫu chính thức khoá tới khi ≥ 3 phần qua thi
    delete S.lt; CB_LV = null; EX_PART = 'san'; await tryA('Cambridge A2', () => cbView('a2')); h = H(); if (!h.includes('data-mock="a2"') || !h.includes('🔒') || !h.includes('data-cbsk="a2|0"') || ((x => (x.match(/class="btnbig/g) || []).length !== (/class="btnbig" data-daigo/.test(x) ? 1 : 0))(h))) bad.push('màn Cambridge (v122) sai'); CB_LV = null;
    S.place = null; delete S.ie;
    add('cefr', 'C29', !bad.length && !errs.length, [...errs, ...bad].length ? [...errs, ...bad].slice(0, 8).join(' | ') : 'màn kỳ thi cùng khung: điểm ước gọn, 1 nút chính (nền thiếu xa → Học nền trước), ô kỹ năng mở màn con, phút đề đúng kỳ thi mục tiêu, Xem dạng đề không tự vào bài, Cambridge đề thử + đề mẫu khoá'); }
  // v114 🧭 Lộ trình 2 phần: 📅 Hôm nay · 🗺 Chỗ yếu; mọi bản đồ (CEFR, band IELTS, điểm TOEIC) ở phần 🗺 Chỗ yếu; màn kỳ thi / 👤 Tôi chỉ lối tắt
  { const bad = [], errs = [], tryA = async (n, f) => { try { await f(); } catch (e) { errs.push(n + ': ' + e.message); } };
    S = blank(); await Promise.all([ieLoad(), toLoad(), paLoad(), ...Object.values(KIT).map(kLoad)]); const H = () => String($app.innerHTML), now = Date.now(), pos = (h, x) => h.indexOf(x);
    S.ie = { target: 7, type: 'ac', set: 1 }; ltSt().goal = { kind: 'ielts', lv: ieBase(7), date: '', at: now }; S.place = { at: now, top: 'b2p', st: 'pre' };
    await tryA('Hôm nay', () => ltView()); let h = H();
    if (!h.includes('id="lt"') || !h.includes('data-ltseg="today" role="tab" aria-selected="true" class="on"') || !h.includes('data-ltseg="map"')) bad.push('Hôm nay thiếu hàng 2 phần');
    MAP_BACK = 'lt'; await tryA('Chỗ yếu', () => mapView()); h = H();
    if (!h.includes('id="lt"') || !h.includes('data-ltseg="map">‹ Tiến độ') || h.includes('data-a="bk"')) bad.push('🗺 bản đồ chưa là màn con của 📈 Tiến độ (Lộ trình)');
    await tryA('Tiến độ', () => ltPlanView()); if (!H().includes('data-ltseg="map" role="tab" aria-selected="true" class="on"') || !H().includes('data-mapv="lt"')) bad.push('📈 Tiến độ chưa là phần 2 của Lộ trình / thiếu lối vào bản đồ'); MAP_BACK = 'lt'; await tryA('Chỗ yếu', () => mapView()); h = H();
    // v121: mỗi mục một màn (hàng chọn 🧱 Nền · 🎓 Cambridge · 🌏 IELTS · 💼 TOEIC); mục tiêu kỳ thi mà Lộ trình dồn ≥ 50% cho luyện đề thì mở đầu ở mục đó
    MAP_TAB = null; if (!h.includes('Bản đồ band') || !h.includes('Việc cần chữa') || !h.includes('class="on" data-mtab="ielts"') || !h.includes('<i>🌏🎯</i>IELTS</button>')) bad.push('mục tiêu IELTS, đủ nền: phải mở đầu ở mục IELTS');
    S.place.top = 'a2'; await tryA('Chỗ yếu nền thiếu', () => mapView()); h = H(); if (!h.includes('class="on" data-mtab="nen"') || !h.includes('Bản đồ theo bài') || h.includes('Bản đồ band')) bad.push('nền thiếu xa: phải mở đầu ở mục Nền');
    ltSt().goal = { kind: 'cefr', lv: 'b1', date: '', at: now }; delete S.ie; await tryA('Chỗ yếu CEFR', () => mapView()); h = H(); if (h.includes('Bản đồ band') || h.includes('Bản đồ điểm') || !h.includes('<i>🧱🎯</i>Nền</button>') || !h.includes('data-mtab="ielts"')) bad.push('mục tiêu CEFR: mở đầu ở Nền, vẫn có hàng chọn kỳ thi');
    S.to = { target: 600, ty: { 'p5:verb': [{ at: now, ok: 3, n: 5, ids: ['x'], src: 'luyen' }] } }; await tryA('Chỗ yếu có TOEIC', () => mapView('toeic')); MAP_TAB = null; if (!H().includes('Bản đồ điểm') || !H().includes('để xem')) bad.push('mục TOEIC: thiếu bản đồ điểm / ghi chú chỉ để xem');
    await tryA('Tôi', () => minhView()); h = H(); if (h.includes('Mở bản đồ') || !h.includes('data-mapv="lt"')) bad.push('👤 Tôi còn ô bản đồ riêng');
    await tryA('IELTS', () => ieltsView()); h = H(); if (h.includes('Ngưỡng (75%') || !h.includes('data-mapv="lt"')) bad.push('màn IELTS còn bản đồ band');
    await tryA('TOEIC', () => toeicView()); h = H(); if (h.includes('Điểm cộng ước theo số câu') || !h.includes('data-mapv="lt"')) bad.push('màn TOEIC còn bản đồ điểm');
    if (todayBox('pre', { lt: 1 }).includes('data-mapv')) bad.push('Hôm nay còn lối tắt bản đồ thừa');
    S.place = null; delete S.lt; delete S.to;
    add('cefr', 'C30', !bad.length && !errs.length, [...errs, ...bad].length ? [...errs, ...bad].slice(0, 8).join(' | ') : 'Lộ trình 2 phần (📅 Hôm nay · 🗺 Chỗ yếu); Chỗ yếu có mục Nền / Cambridge / IELTS / TOEIC, mở đầu ở kỳ thi mục tiêu khi Lộ trình dồn ≥ 50% cho luyện đề; màn kỳ thi, 👤 Tôi chỉ lối tắt'); }
  // v116 📘 Bài học / 🏋️ Bài tập tách riêng (người sáng lập 2/11/2026): 🔁 Nhớ chỉ tính ở bài tập (và bài thi); bài học, luyện thêm không bao giờ tính, kể cả ôn chéo cho từ
  { const bad = [], errs = [], tryv = (n, f) => { try { f(); } catch (e) { errs.push(n + ': ' + e.message); } }, H = () => String($app.innerHTML), now = Date.now(), t = dayOf(now), D = 864e5;
    const blankC = d0 => ({ S: 10, last: now - 3 * D, d0, ok: 1, pv: 1, n: 2, lapse: 0, dm: {} });
    // ① 🏋️ chỉ có mục tính (có mặt); mục không có mặt nào nằm ở 📘 Luyện thêm của màn phần
    S = blank();
    for (const P of Object.values(KIT)) { tryv('menu ' + P.id, () => kMenu(P)); const h = H();
      P.menu.forEach((m, i) => { if (h.includes('data-km="' + i + '"') !== !!m[3].length) bad.push('🏋️ ' + P.id + ' mục ' + m[0] + (m[3].length ? ' bị mất' : ' không tính mà vẫn ở 🏋️')); });
      tryv('view ' + P.id, () => kView(P.id)); const v = H();
      if (!v.includes('📘 Bài học') || !v.includes('🏋️ Bài tập') || v.includes('🏋️ Luyện tập')) bad.push(P.id + ': 2 nút chưa đổi tên');
      for (const [m, i] of kExtra(P)) if (!v.includes('data-kex="' + i + '"')) bad.push(P.id + ': luyện thêm ' + m[0] + ' chưa ở màn phần'); }
    if (kExtra(KIT.np).some(([m]) => m[0] === 'dung') || kExtra(KIT.doc).some(([m]) => m[0] === 'doan')) bad.push('luyện thêm chưa theo cấp (Dùng từ B1, đoán nghĩa từ A2)');
    if (!kExtra(KIT.doc).length || !kExtra(KIT.nghe).length || !kExtra(KIT.noi).length || !kExtra(KIT.viet).length) bad.push('thiếu luyện thêm');
    // ② Đọc / Nghe: 📘 mở màn Bài học riêng; 🏋️ mở được khi chưa làm bài nào; 📘 không mở thẳng bài chưa gặp
    for (const id of ['doc', 'nghe']) { const P = KIT[id]; S = blank(); tryv('view ' + id, () => kView(id)); const h = H();
      if (!h.includes('data-k="hoc"') || h.includes('data-k="learn"') || /data-k="menu"[^>]*disabled/.test(h)) bad.push(id + ': nút 📘 / 🏋️ sai');
      const [x, x2] = kItems(P, 'pre');
      tryv('kLearn bài mới ' + id, () => kLearn(P, x)); if (!H().includes('data-kl="new"') || kSt(id).cards[x.id]) bad.push(id + ': 📘 vẫn mở thẳng bài mới');
      kSt(id).cards[x.id] = { S: 1, last: now, seen: now, d0: t, ok: 1, pv: 0, n: 0, lapse: 0 }; kSt(id).cards[x2.id] = { S: 1, last: now - 40 * D, seen: now - 40 * D, d0: t - 40, ok: 1, pv: 0, n: 0, lapse: 0 };
      tryv('kHoc ' + id, () => kHoc(P)); const hh = H(); if (!hh.includes('data-kr="' + x.id + '"') || hh.includes('data-kr="' + x2.id + '"')) bad.push(id + ': xem lại sai (bài vừa làm có, bài ≥ 30 ngày không)');
      for (const [, i] of kExtra(P)) if (!hh.includes('data-kex="' + i + '"')) bad.push(id + ': 📘 thiếu luyện thêm');
      let called = null; const kq0 = kQuiz; kQuiz = o => { called = o; };
      tryv('xem lại ' + id, () => kLearn(P, x, () => kHoc(P))); if (!H().includes('data-kl="try"')) bad.push(id + ': xem lại không mở bài');
      tryv('làm thử ' + id, () => $app.onclick({ target: { closest: s => s === '[data-kl="try"]' ? {} : null } })); if (!called || !called.nomf) bad.push(id + ': làm thử ở 📘 vẫn cộng ôn chéo');
      called = null; tryv('bài cũ ' + id, () => { kView(id); $app.onclick({ target: { closest: s => s === '[data-kx]' ? { dataset: { kx: x2.id } } : null } }); });
      if (!called || called.nomf || !/^🆕/.test(called.title)) bad.push(id + ': bài làm đã ≥ 30 ngày chưa làm như bài mới (🏋️)');
      kQuiz = kq0; }
    // ③ câu đúng ở 📘 (nomf) không cộng ôn chéo cho từ đã học; ở 🏋️ thì cộng (đối chứng)
    { S = blank(); const P = KIT.np, x = kItems(P, 'pre')[0], ws = ['cat', 'dog'].map(k => WORDS.find(w => w.w === k)); for (const w of ws) S.cards[w.id] = blankC(t - 5);
      const q0 = () => ({ x, k: 'nhan', kind: 'mc', q: 'I have a cat and a dog.', opts: ['cat', 'cow'], a: 'cat' }), ans = () => $app.onclick({ target: { closest: s => s === '[data-ko]' ? { dataset: { ko: '0' } } : null } });
      tryv('câu bài học', () => { kQuiz({ P, title: 't', qs: [q0()], nomf: true, done: () => {} }); ans(); }); if (S.mfn && Object.keys(S.mfn).length) bad.push('câu bài học vẫn cộng ôn chéo cho từ');
      tryv('câu bài tập', () => { kQuiz({ P, title: 't', qs: [q0()], done: () => {} }); ans(); }); if (!S.mfn || !S.mfn[t]) bad.push('câu bài tập không cộng ôn chéo (đối chứng)'); }
    // ④ kRun: mục luyện thêm chạy không cộng chéo và không chấm; mục bài tập chạy như cũ
    { let called = null; const kq0 = kQuiz; kQuiz = o => { called = o; }; S = blank();
      tryv('luyện thêm Đọc', () => kRun(KIT.doc, KIT.doc.menu.findIndex(m => m[0] === 'cau'))); if (!called || !called.nomf) bad.push('luyện thêm vẫn cộng ôn chéo');
      const xn = kItems(KIT.np, 'pre')[0]; kSt('np').cards[xn.id] = blankC(t - 5); called = null;
      tryv('bài tập Ngữ pháp', () => kRun(KIT.np, KIT.np.menu.findIndex(m => m[0] === 'nhan'))); if (!called || called.nomf) bad.push('bài tập Ngữ pháp bị tắt cộng chéo');
      kQuiz = kq0; }
    // ⑤ Từ vựng, Phát âm: tên 2 cửa; ⚡ ghi rõ là bài tập (tính) đặt trước phần dạy; 🏋️ Phát âm không còn mục không tính
    S = blank(); tryv('home', () => home()); if (!H().includes('📘 Bài học') || !H().includes('🏋️ Bài tập')) bad.push('Từ vựng: 2 nút chưa đổi tên');
    tryv('practiceMenu', () => practiceMenu()); if (!H().includes('🏋️ Bài tập · Từ vựng') || !H().includes('tính 🔁 Nhớ')) bad.push('Từ vựng: màn bài tập chưa ghi rõ');
    tryv('learn', () => learn(UNITS.find(u => u.lv === 'pre'))); if (!H().includes('Không chấm điểm') || !H().includes('Làm đúng ở ngày sau mới tính là nhớ') || !H().includes('data-pt="go"')) bad.push('trang mở đầu bài học chưa nói rõ bước nào tính nhớ (v134)');
    tryv('paView', () => paView()); if (!H().includes('📘 Bài học') || !H().includes('📘 Luyện thêm') || !H().includes('data-pm="fin"')) bad.push('Phát âm: 📘 luyện thêm thiếu');
    tryv('paMenu', () => paMenu()); if (/data-pm="(fin|tra|cal|val)"/.test(H()) || !H().includes('🏋️ Bài tập · Phát âm')) bad.push('Phát âm: 🏋️ còn mục không tính');
    // ⑥ Hôm nay: bài mới của Đọc / Nghe ghi "Làm bài mới" (bài tập), phần khác vẫn "Học bài mới"
    S = blank(); const itD = todayItems('pre', { low: ['doc', 'pre'] }).find(x => x.k === 'new'), itN = todayItems('pre', { low: ['np', 'pre'] }).find(x => x.k === 'new');
    if (!itD || itD.ic !== '🆕' || !/^Đọc Pre-A1 · /.test(itD.title) || !itD.attr.includes('data-tp="doc"') || !itN || itN.ic !== '📘' || !/^Ngữ pháp Pre-A1 · /.test(itN.title)) bad.push('Hôm nay: tên việc bài mới sai: ' + (itD && itD.title) + ' / ' + (itN && itN.title));
    // ⑦ Luật có mục riêng; chữ trong bài học nói rõ không tính
    const hd = HD.find(x => x[0] === 'baitap'); if (!hd || !hd[2]().includes('bài học không bao giờ tính') || !hd[2]().includes(K_FRESH_D + ' ngày')) bad.push('Luật chưa có mục Bài học / Bài tập');
    if (!kTeach(KIT.np, kItems(KIT.np, 'pre')[0]).includes('bài học, không tính') || !kTeach(KIT.doc, kItems(KIT.doc, 'pre')[0]).includes('🆕 bài mới (🏋️ Bài tập)')) bad.push('bài học chưa ghi không tính');
    S = blank();
    add('cefr', 'C31', !bad.length && !errs.length, [...errs, ...bad].length ? [...errs, ...bad].slice(0, 8).join(' | ') : '📘 Bài học / 🏋️ Bài tập tách riêng: 🏋️ chỉ có lượt tính 🔁 Nhớ, luyện thêm ở 📘 (không cộng ôn chéo), Đọc / Nghe bài mới là bài tập (📘 = luyện thêm + xem lại bài vừa làm), ⚡ Từ vựng ghi rõ là bài tập, Phát âm, Hôm nay, Luật đều đúng'); }
  // v117 mở khoá bài tập (người sáng lập 2/11/2026, chọn "tính như học"): 🏋️ mở khi chưa học; thiếu bài đã học thì lấy bài chưa học; làm = tính đã học, Nhớ từ ngày sau
  { const bad = [], errs = [], tryv = (n, f) => { try { f(); } catch (e) { errs.push(n + ': ' + e.message); } }, H = () => String($app.innerHTML), t = dayOf(Date.now());
    S = blank();
    for (const id of ['np', 'noi', 'viet']) { tryv('view ' + id, () => kView(id)); if (/data-k="menu"[^>]*disabled/.test(H())) bad.push(id + ': 🏋️ còn khoá'); }
    tryv('home', () => home()); if (/data-a="practice"[^>]*disabled/.test(H())) bad.push('Từ vựng: 🏋️ còn khoá');
    tryv('paView', () => paView()); if (/data-pa="menu"[^>]*disabled/.test(H())) bad.push('Phát âm: 🏋️ còn khoá');
    // kit: chưa học bài nào → lấy bài đầu của cấp; Đọc / Nghe không lấy (bài mới riêng)
    const T = kTargets(KIT.np, 'nhan', 5); if (T.length !== 5 || T[0].id !== kItems(KIT.np, 'pre')[0].id) bad.push('Ngữ pháp: chưa lấy bài chưa học theo thứ tự');
    if (kTargets(KIT.doc, 'y', 4).length) bad.push('Đọc: không được lấy bài chưa gặp cho một mặt');
    // làm đúng bài chưa học → có thẻ (📘 Học), chưa tính Nhớ hôm nay
    const x = T[0]; kGrade(KIT.np, KIT.np.q(x, 'nhan', 'learn').map(q => ({ x, k: 'nhan', ok: true, q })));
    const c = kSt('np').cards[x.id]; if (!c || c.d0 !== t || kParts(KIT.np, 'pre').learn !== 1 || (c.dm && c.dm.nhan && c.dm.nhan.pv)) bad.push('Ngữ pháp: làm bài chưa học chưa tính như học');
    // Phát âm: lấy bộ chưa học, chấm tạo thẻ
    S = blank(); const PT = paTargets('pb', 4); if (PT.length !== 4 || PT.some(y => y.lv !== paLevel())) bad.push('Phát âm: chưa lấy bộ chưa học');
    paGrade([{ x: PT[0], ok: true }], 'pa_pb'); if (!paSt()[PT[0].id] || paSt()[PT[0].id].d0 !== t) bad.push('Phát âm: làm bộ chưa học chưa tạo thẻ');
    // Từ vựng: lượt chung lấy từ chưa học (bậc 1), trả lời → thẻ mới, chưa tính Nhớ hôm nay
    S = blank(); let it0 = null; const r0 = run; run = o => { it0 = o; }; tryv('practice', () => practice()); run = r0;
    if (!it0 || it0.items.length !== ROUND || !it0.items.every(i => i.nw && i.type === 'w2vi')) bad.push('Từ vựng: lượt chung chưa lấy từ chưa học');
    else { const w = it0.items[0].w; it0.first(it0.items[0], true, 'w2vi'); const cw = S.cards[w.id]; if (!cw || cw.d0 !== t || (cw.dm && cw.dm.nghia && cw.dm.nghia.pv)) bad.push('Từ vựng: từ chưa học làm đúng chưa tính như học'); }
    const hb = HD.find(x => x[0] === 'baitap'); if (!hb || !hb[2]().includes('Không cần học trước')) bad.push('Luật chưa ghi mở khoá bài tập');
    S = blank();
    add('cefr', 'C32', !bad.length && !errs.length, [...errs, ...bad].length ? [...errs, ...bad].slice(0, 8).join(' | ') : 'mở khoá bài tập: 🏋️ mở khi chưa học (7 phần), lấy bài / bộ / từ chưa học theo thứ tự, làm = tính đã học, 🔁 Nhớ từ ngày sau; Đọc / Nghe giữ bài mới riêng đều đúng'); }
  // v118 khuôn màn phần 3 tầng (người sáng lập 2/11/2026 "sắp xếp lại phần học cho trực quan… nhiều chức năng rối mắt", chọn "một khuôn 3 tầng"; không đổi luật đo)
  { const bad = [], errs = [], tryv = (n, f) => { try { f(); } catch (e) { errs.push(n + ': ' + e.message); } }, H = () => String($app.innerHTML), now = Date.now(), t = dayOf(now), D = 864e5;
    const top = h => h.split('<details class="box more"')[0], lvAt = (h, a) => { const i = h.indexOf(a), j = h.indexOf('<details class="lvmore"'); return i < 0 || (j >= 0 && i > j); };
    const JARGON = /mặt thấp nhất|yêu cầu thấp nhất|≥|chưa có bài|tham khảo|🔵|⚪|🟢|Trình độ <b>/;
    const screens = [['Từ vựng', () => home(), 'data-lv="'], ['Phát âm', () => paView(), 'data-palv="'], ...Object.keys(KIT).map(id => [id, () => kView(id), 'data-klv="'])];
    S = blank();
    for (const [n, f, chip] of screens) { tryv(n, f); const h = H(), tp = top(h);
      if (!/class="btnbig" data-/.test(tp) || !tp.includes('class="box examc lock"') || !/Đã (học|làm) \\d+ \\/ \\d+/.test(tp) || !tp.includes('Mở khi học')) bad.push(n + ': thiếu nút chính / ô tiến độ / ô bài thi (v134)');
      if (!tp.includes('🏋️ ') && !tp.includes('data-k="new"')) bad.push(n + ': thiếu nút bài tập');   // Đọc / Nghe: bài mới chính là bài tập
      if (JARGON.test(tp)) bad.push(n + ': màn đầu còn chữ luật / ký hiệu: ' + (tp.match(JARGON) || [])[0]);
      if (!h.includes('<details class="box more"') || !/Nhớ từng/.test(h) || !h.includes('Bài thi lên cấp')) bad.push(n + ': thiếu "Thêm" gập');
      if (!lvAt(h, chip)) bad.push(n + ': chip cấp chưa gập vào "Xem bài cấp khác"');
      if (/data-(k|a|pa)="exam"/.test(tp)) bad.push(n + ': chưa đủ điều kiện mà có nút thi'); }
    // Đọc / Nghe: bước 1 là "Làm bài"; danh sách dài chỉ hiện 6 dòng quanh bài kế tiếp
    tryv('doc', () => kView('doc')); if (!H().includes('▶ Làm bài mới: ') || !H().includes('data-k="new"')) bad.push('Đọc: nút chính chưa mở thẳng bài mới');
    tryv('np', () => kView('np')); { const n = kItems(KIT.np, 'pre').length, sh = (H().split('<details class="lvmore"')[0].match(/data-kx="/g) || []).length; if (n > P_WIN + 2 && (sh !== P_WIN || !H().includes('Xem thêm ' + (n - P_WIN) + ' bài'))) bad.push('Ngữ pháp: danh sách chưa gọn: ' + sh); }
    // trạng thái bằng chữ: học tiếp / đã học / cần ôn / đã nhớ
    { const xs = kItems(KIT.np, 'pre'), st = kSt('np').cards; st[xs[0].id] = { S: 300, last: now - D, d0: t - 9, ok: 1, pv: 1, n: 5, lapse: 0, dm: { nhan: { ok: 1, pv: 1, n: 3 }, dien: { ok: 1, pv: 1, n: 3 }, sua: { ok: 1, pv: 1, n: 3 }, hieu: { ok: 1, pv: 1, n: 3 } } };
      st[xs[1].id] = { S: 0.5, last: now - 5 * D, d0: t - 9, ok: 0, pv: 1, n: 5, lapse: 1, dm: {} }; st[xs[2].id] = { S: 1, last: now, d0: t, ok: 1, pv: 0, n: 0, lapse: 0 };
      const L = kList(KIT.np, 'pre', xs[3], now); if (!L.includes('đã nhớ') || !L.includes('cần ôn') || !L.includes('đã học') || !L.includes('học tiếp')) bad.push('danh sách chưa ghi trạng thái bằng chữ'); }
    // đủ điều kiện: bước 3 thành nút thi; học hết thì 🏋️ là nút chính, 📘 không
    S = blank(); for (const x of kItems(KIT.np, 'pre')) kSt('np').cards[x.id] = { S: 300, last: now - D, d0: t - 9, ok: 1, pv: 1, n: 5, lapse: 0, dm: { nhan: { ok: 1, pv: 1, n: 3 }, dien: { ok: 1, pv: 1, n: 3 }, sua: { ok: 1, pv: 1, n: 3 }, hieu: { ok: 1, pv: 1, n: 3 } } };
    tryv('np mở thi', () => kView('np')); { const h = H(); if (!/class="box examc open"[^]*data-k="exam"/.test(h)) bad.push('đủ điều kiện mà ô bài thi chưa có nút thi'); if (/class="btnbig" data-k="learn"/.test(h) || !/class="btnbig" data-k="menu"/.test(h)) bad.push('học hết mà nút chính vẫn là học bài'); }
    // Từ vựng: một chặng mở sẵn, chặng khác gập; bước 3 theo trạng thái thi (chờ thi lại / đã qua)
    S = blank(); tryv('home', () => home()); { const h = H(); if ((h.match(/class="ch cur"/g) || []).length !== 1 || !h.includes('Chặng khác')) bad.push('Từ vựng: chặng chưa gập'); }
    { if (!pExam({ k: 'wait', t: 'x', sub: 'Thi lại sau 3 ngày.' }).includes('⏳') || !pExam({ k: 'done', t: 'x', sub: 'Đã qua.' }).includes('examc done') || !pExam({ k: 'open', t: 'x', sub: 'y', btn: '<button data-k="exam">z</button>' }).includes('data-k="exam"')) bad.push('ô bài thi hiện sai trạng thái'); }
    S = blank();
    add('cefr', 'C33', !bad.length && !errs.length, [...errs, ...bad].length ? [...errs, ...bad].slice(0, 8).join(' | ') : 'khuôn màn phần 3 tầng (7 phần): đường 3 bước, 2 nút, danh sách bài ghi bằng chữ (gọn 6 dòng), cấp khác + "Thêm" gập, màn đầu không chữ luật / ký hiệu, bước 3 thành nút thi khi đủ, học hết thì 🏋️ là nút chính'); }
  // v119 bản đồ chỗ yếu theo BÀI (người sáng lập 2/11/2026: lưới bài có màu, chữa trước không chặn; bộ máy chỗ yếu và luật đo không đổi)
  { const bad = [], errs = [], tryv = (n, f) => { try { f(); } catch (e) { errs.push(n + ': ' + e.message); } }, tryA = async (n, f) => { try { await f(); } catch (e) { errs.push(n + ': ' + e.message); } };
    const H = () => String($app.innerHTML), now = Date.now(), D = 864e5, t = dayOf(now);
    S = blank(); const us = UNITS.filter(u => u.lv === 'pre').slice(0, 3); for (const u of us) learnCards(S, u, now - 5 * D);
    const mk = (w, ok) => { const c = S.cards[w.id]; Object.assign(c, { S: 300, last: now - D, pv: 1, n: 4 }); c.dm = {}; for (const k of wDims(w, 'pre')) c.dm[k] = { ok: 1, pv: 1, n: 3 }; if (!ok) c.dm.nghia = { ok: 0, pv: 1, n: 3 }; };
    us[0].words.forEach((w, i) => mk(w, i >= 4)); us[1].words.forEach((w, i) => { mk(w, i >= 1); if (i >= 1 && i < 6) S.cards[w.id].dm = {}; }); us[2].words.forEach(w => mk(w, true));   // bài 2: 1 từ sai + 5 từ chưa có bằng chứng nhớ = đang ôn
    const xn = kItems(KIT.np, 'pre'); kSt('np').cards[xn[0].id] = { S: 1, last: now - D, d0: t - 4, ok: 0, pv: 1, n: 3, lapse: 1, dm: { nhan: { ok: 0, pv: 1, n: 3 } } };
    kSt('np').cards[xn[1].id] = { S: 1, last: now, d0: t, ok: 1, pv: 0, n: 0, lapse: 0 };
    // trạng thái bài: Từ vựng ≥ 3 từ sai = yếu, 1 từ sai = đang ôn, nhớ hết = vững; Ngữ pháp mặt sai = yếu
    if (lsState('tv', us[0], now) !== 'yeu' || lsState('tv', us[1], now) !== 'on' || lsState('tv', us[2], now) !== 'vung' || lsState('tv', UNITS.filter(u => u.lv === 'pre')[5], now) !== 'chua') bad.push('trạng thái bài Từ vựng sai: ' + us.map(u => lsState('tv', u, now)).join(','));
    if (lsState('np', xn[0], now) !== 'yeu' || lsState('np', xn[1], now) !== 'on' || lsState('np', xn[2], now) !== 'chua') bad.push('trạng thái bài Ngữ pháp sai');
    const red = mapRed(now); if (red.length !== 2 || red[0].x !== us[0] || red[1].x !== xn[0]) bad.push('danh sách bài yếu sai: ' + red.map(l => l.id + ':' + l.x.id).join(','));
    // màn bản đồ: Việc cần chữa (nút chữa bài yếu nhất + học bài mới không chặn) → lưới bài → "Thêm" chứa phần cũ
    MAP_BACK = 'lt'; await tryA('bản đồ', () => mapView()); { const h = H(), pos = x => h.indexOf(x);
      if (!(pos('Việc cần chữa') >= 0 && pos('Việc cần chữa') < pos('Bản đồ theo bài') && pos('Bản đồ theo bài') < pos('<details class="box more"'))) bad.push('bản đồ: thứ tự phần sai');
      if (!/class="pri" data-ml="0"/.test(h) || !h.includes('Chữa bài yếu nhất') || !h.includes('data-map="new"')) bad.push('bản đồ: thiếu nút chữa bài yếu nhất / học bài mới');
      const g = (h.split('class="mgrid"')[1] || '').split('</div>')[0]; if ((g.match(/<i class="yeu">/g) || []).length !== 2 || (g.match(/data-mrow="/g) || []).length < 6) bad.push('lưới bài sai: ' + (g.match(/<i class="yeu">/g) || []).length);
      if (!h.includes('6 từ hay sai') && !h.includes('4 từ hay sai')) bad.push('thiếu lý do bài yếu');
      if (!h.split('<details class="box more"')[1] || !h.split('<details class="box more"')[1].includes('Từng chỗ đang chữa')) bad.push('phần cũ chưa gập vào Thêm'); }
    // chữa một bài: chỉ hỏi chỗ sai của bài đó
    { let got = null; const r0 = run, q0 = kQuiz; run = o => { got = o; }; kQuiz = o => { got = o; };
      tryv('chữa Từ vựng', () => mapFixLesson(red[0], now)); const bw = new Set(us[0].words.slice(0, 4).map(w => w.id));
      if (!got || !got.items || got.items.length !== 4 || got.items.some(it => !bw.has(it.w.id))) bad.push('chữa bài Từ vựng hỏi sai từ');
      got = null; tryv('chữa Ngữ pháp', () => mapFixLesson(red[1], now)); if (!got || !got.qs || !got.qs.length || !got.qs.every(q => q.x === xn[0])) bad.push('chữa bài Ngữ pháp sai');
      got = null; tryv('Hôm nay chữa', () => mapToday()); if (!got || !got.items) bad.push('Sửa lỗi sai ở Hôm nay chưa chữa bài yếu nhất');
      // Đọc: ý chính / chi tiết sai thì chữa gốc / xem lại, không làm lại bài vừa gặp
      const xd = kItems(KIT.doc, 'pre')[0]; kSt('doc').cards[xd.id] = { S: 1, last: now - D, seen: now - D, d0: t - 2, ok: 0, pv: 1, n: 1, lapse: 0, dm: { y: { ok: 0, pv: 1, n: 1, f: now - D, fq: [0, 1] } } };
      got = null; tryv('chữa Đọc', () => mapFixLesson({ id: 'doc', x: xd, s: 'yeu' }, now)); if (got) bad.push('chữa Đọc lại làm lại bài vừa gặp');
      run = r0; kQuiz = q0; }
    // màn kỹ năng ghi "yếu"; ô Hôm nay ghi số bài yếu và vẫn có học bài mới (không chặn)
    tryv('np', () => kView('np')); if (!H().includes('>yếu<')) bad.push('màn Ngữ pháp chưa ghi bài yếu');
    tryv('tv', () => home()); if (!H().includes('>yếu<')) bad.push('màn Từ vựng chưa ghi bài yếu');
    { const it = todayItems('pre'), fx = it.find(x => x.k === 'fix'); if (!fx || !/bài làm sai nhiều/.test(fx.meta) || !it.some(x => x.k === 'new')) bad.push('ô Hôm nay: ' + (fx ? fx.meta : 'không có việc chữa')); }
    // chỗ hổng nền (xếp cấp, chưa học) tô đỏ bài chứa nó và có nút riêng
    { const u5 = UNITS.filter(u => u.lv === 'pre')[6], w5 = u5.words[0]; S.place = { at: now, top: 'pre', gap: [{ k: 'tv|' + w5.id, d: t - 1, wd: t - 1 }] };
      const r = mapLessons(now).find(x => x.id === 'tv').ls.find(l => l.x === u5); if (!r || r.s !== 'yeu' || !r.gap) bad.push('chỗ hổng nền chưa tô đỏ bài');
      await tryA('bản đồ có hổng', () => mapView()); if (!H().includes('Chữa tiếp: chỗ hổng nền trước') || !H().includes('1 chỗ hổng nền')) bad.push('bản đồ chưa đưa chỗ hổng nền lên trước'); }
    S = blank();
    add('cefr', 'C34', !bad.length && !errs.length, [...errs, ...bad].length ? [...errs, ...bad].slice(0, 8).join(' | ') : 'bản đồ chỗ yếu theo bài: trạng thái bài (yếu / đang ôn / vững / chưa học), lưới bài có màu, nút chữa bài yếu nhất chỉ hỏi chỗ sai, Đọc chữa gốc, Hôm nay chữa bài yếu nhất và không chặn bài mới, chỗ hổng nền lên trước, màn kỹ năng ghi "yếu" đều đúng'); }
  // v120 bản đồ IELTS / TOEIC cùng khuôn (người sáng lập 3/11/2026, chọn "mỗi phần một việc cần chữa"): ô = dạng câu / tiêu chí / Part; dữ liệu như imWeak / tmWeak (không đổi)
  { const bad = [], errs = [], tryv = (n, f) => { try { f(); } catch (e) { errs.push(n + ': ' + e.message); } }, tryA = async (n, f) => { try { await f(); } catch (e) { errs.push(n + ': ' + e.message); } };
    const H = () => String($app.innerHTML), now = Date.now(), D = 864e5; await ieLoad(); await toLoad();
    const b = (ok, n, ids) => [{ at: now - D, ok, n, ids, src: 'luyen' }];
    S = blank(); S.ie = { set: 1, type: 'ac', target: 6.5, r: {}, ty: { 'R-tf': b(4, 10, ['a', 'b']), 'R-h': b(7, 8, ['c', 'd']), 'L-form': b(3, 6, ['e']) }, cr: [{ k: 'W', c: [5.5, 6, 5, 5.5], src: 'may', at: now - 3 * D }, { k: 'W', c: [5, 6, 5.5, 5], src: 'may', at: now - D }] };
    const st = u => imCell(u).s; if (st('R-tf') !== 'yeu' || st('R-h') !== 'vung' || st('L-form') !== 'on' || st('R-mc') !== 'chua' || st('W:0') !== 'yeu' || st('S:0') !== 'chua') bad.push('ô IELTS sai: ' + ['R-tf', 'R-h', 'L-form', 'R-mc', 'W:0', 'S:0'].map(st).join(','));
    let h = ''; tryv('imMap', () => { h = imMap(true); });
    if (!h.includes('🎯 Việc cần chữa') || !/class="pri" data-im="fix\|/.test(h) || !h.includes('Chữa chỗ mất band nhiều nhất') || !h.includes('data-mapex="ielts"')) bad.push('IELTS: thiếu việc cần chữa / nút');
    const ny = (h.match(/class="xchip yeu"/g) || []).length, nc = imRows().flatMap(r => r[1]).filter(u => imCell(u).s === 'yeu').length; if (!ny || ny !== nc) bad.push('IELTS: lưới sai ' + ny + '/' + nc);
    if (h.includes('✍️ ✍️') || !h.split('<details class="box more"')[1] || !h.split('<details class="box more"')[1].includes('Bản đồ band')) bad.push('IELTS: lặp biểu tượng / thiếu phần chi tiết trong Thêm');
    S.ie = { set: 1, type: 'ac', target: 6.5, r: {}, ty: { 'L-form': b(3, 6, ['e']) }, cr: [] }; tryv('IELTS chưa chắc', () => { h = imMap(true); }); if (!h.includes('Làm thêm để biết chắc')) bad.push('IELTS: chỗ chưa chắc chưa gợi ý làm thêm');
    S.ie = { set: 1, type: 'ac', target: 6.5, r: {}, ty: {}, cr: [] }; tryv('IELTS trống', () => { h = imMap(true); }); if (!h.includes('Chưa có dữ liệu') || !h.includes('data-mapex="ielts"')) bad.push('IELTS: chưa có dữ liệu sai');
    // TOEIC
    S = blank(); S.to = { target: 600, r: {}, ty: { 'p5:verb': b(3, 10, ['a', 'b']), p3: b(5, 6, ['x']) }, spd: [] };
    const ts = u => tmCell(u).s; if (ts('p5:verb') !== 'yeu' || ts('p3') !== 'on' || ts('p2') !== 'chua') bad.push('ô TOEIC sai: ' + ['p5:verb', 'p3', 'p2'].map(ts).join(','));
    tryv('tmMap', () => { h = tmMap(true); }); if (!h.includes('Chữa chỗ mất điểm nhiều nhất') || !h.includes('data-tm="fix|p5:verb"') || !h.includes('Bản đồ điểm') || (h.match(/class="xchip /g) || []).length < 12) bad.push('TOEIC: khối bản đồ sai');
    // màn 🗺 Chỗ yếu: mục tiêu IELTS → khối IELTS mới, mỗi khối một việc cần chữa
    S = blank(); S.lt = { goal: { kind: 'ielts', lv: 'b2', at: now }, d: [], fx: {} }; S.ie = { set: 1, type: 'ac', target: 6.5, r: {}, ty: { 'R-tf': b(4, 10, ['a', 'b']) }, cr: [] };
    MAP_BACK = 'lt'; await tryA('Chỗ yếu IELTS', () => mapView('ielts')); MAP_TAB = null; h = H(); if ((h.match(/🎯 Việc cần chữa/g) || []).length !== 1 || !h.includes('data-im="fix|R-tf"') || !h.includes('class="xchip yeu"')) bad.push('màn Chỗ yếu chưa có khối IELTS mới');   // v121: mục IELTS một màn riêng
    S = blank();
    add('cefr', 'C35', !bad.length && !errs.length, [...errs, ...bad].length ? [...errs, ...bad].slice(0, 8).join(' | ') : 'bản đồ IELTS / TOEIC cùng khuôn: ô theo dạng câu / tiêu chí / Part (yếu / chưa chắc / đạt / chưa làm), việc cần chữa riêng với nút chữa chỗ mất điểm nhiều nhất, làm thêm khi chưa chắc, chi tiết cũ gập trong Thêm đều đúng'); }
  // v121 🗺 bản đồ mọi mục tiêu: hàng chọn 🧱 Nền · 🎓 Cambridge · 🌏 IELTS · 💼 TOEIC (mục nào cũng xem được, 🎯 = mục tiêu); bản đồ Cambridge theo phần của đề thử
  { const bad = [], errs = [], tryv = (n, f) => { try { f(); } catch (e) { errs.push(n + ': ' + e.message); } }, tryA = async (n, f) => { try { await f(); } catch (e) { errs.push(n + ': ' + e.message); } };
    const H = () => String($app.innerHTML), now = Date.now(), D = 864e5; await Promise.all([ieLoad(), toLoad(), cbMapLoad(), paLoad(), ...Object.values(KIT).map(kLoad)]);
    S = blank(); S.lt = { goal: { at: now, lv: 'b1', date: '2026-12-01' }, d: [], fx: {} }; MAP_BACK = 'lt'; MAP_TAB = null; CBM_LV = null;   // như dữ liệu thật 3/11: mục tiêu không ghi loại = 📈 Lên trình
    await tryA('Nền', () => mapView()); let h = H();
    if (['nen', 'cb', 'ielts', 'toeic'].some(k => !h.includes('data-mtab="' + k + '"')) || !h.includes('class="on" data-mtab="nen"') || !h.includes('<i>🧱🎯</i>Nền</button>')) bad.push('thiếu hàng chọn 4 mục / mục mở đầu sai');
    for (const [k, w] of [['ielts', 'Bản đồ band'], ['toeic', 'Bản đồ điểm'], ['cb', 'theo phần của đề']]) { await tryA('mục ' + k, () => mapView(k)); h = H();
      if (!h.includes('class="on" data-mtab="' + k + '"') || !h.includes(w) || !h.includes('để xem') || h.includes('Bản đồ theo bài')) bad.push('mục ' + k + ': chưa hiện bản đồ kỳ thi / thiếu ghi chú chỉ để xem'); }
    await tryA('nhớ mục đã chọn', () => mapView()); if (!H().includes('class="on" data-mtab="cb"')) bad.push('chưa nhớ mục đã chọn trong phiên');
    h = H(); if (!h.includes('data-cbm="mock|') || !h.includes('Làm 1 đề thử')) bad.push('Cambridge chưa có dữ liệu: nút chính phải là làm 1 đề thử');
    // ô Cambridge: đề thử lưu theo phần (pp) + dạng đề thật; yếu / ổn / chưa chắc / chưa làm theo ngưỡng của kỳ thi
    const C = MOCK.b1, all = C.papers[0].parts.map(p => p[0]), lab = [/tin ngắn/, /bài dài/, /khuyết/, /trắc nghiệm/, /Phần 6/].map(re => all.find(l => re.test(l))), wt = C.papers[1].parts[0][0], mc = cbUItems('mc', 'b1'), ix = re => all.findIndex(l => re.test(l));
    const r = (at, a, b, w) => ({ at, papers: [{ t: C.papers[0].t, ok: 0, n: 0, pp: { [lab[0]]: [a, 6], [lab[1]]: [b, 6] } }, { t: C.papers[1].t, ok: 0, n: 2, pp: { [wt]: [w, 2] } }], pct: null, pass: false });
    S.mock = { b1: [r(now - 3 * D, 2, 5, 0.8), r(now - D, 3, 6, 1.2)] }; S.uoe = {}; if (mc[0]) S.uoe[mc[0].id] = { at: now - D, ok: 2, n: 6 };
    const cells = cbRows('b1').flatMap(x => x.cells), st = l => (cells.find(c => c.lab === l) || {}).s;
    if (st(lab[0]) !== 'yeu' || st(lab[1]) !== 'vung' || st(lab[3]) !== 'on' || st(lab[4]) !== 'chua' || st(wt) !== 'yeu' || !mc.length) bad.push('ô Cambridge sai: ' + [lab[0], lab[1], lab[3], lab[4], wt].map(st).join(','));
    tryv('cbMap', () => { h = cbMap(false, 'b1'); }); if (!h.includes('Chữa phần mất điểm nhiều nhất') || !h.includes('data-cbm="fix|b1|0|' + ix(/tin ngắn/) + '" style') || (h.match(/class="xchip yeu"/g) || []).length !== 2 || !h.includes('cần ~70%')) bad.push('Cambridge: việc cần chữa / lưới sai');
    if (cbMap(false, 'b2').indexOf('Làm 1 đề thử') < 0) bad.push('Cambridge B2 chưa có dữ liệu sai');
    // bấm ô: dạng đề thật → luyện dạng đó; nghe điền; nói cặp; phần khác → làm riêng phần đó (có giờ), kết quả lưu theo phần, nút về bản đồ
    await tryA('ô điền trắc nghiệm', () => cbFix('b1', 0, ix(/trắc nghiệm/))); if (!H().includes('data-uo=')) bad.push('ô dạng đề thật chưa mở bài luyện dạng đó');
    await tryA('ô nghe điền', () => cbFix('b1', 2, 1)); if (!H().includes('Nghe')) bad.push('ô nghe điền chưa mở nghe điền');
    await tryA('ô Nói', () => cbFix('b1', 3, 0)); if (!H().includes('Nói theo cặp')) bad.push('ô Nói chưa mở nói cặp');
    S.mock = {}; await tryA('ô đọc tin ngắn', () => cbFix('b1', 0, ix(/tin ngắn/)));
    if (!MK || !MK.map || MK.papers.length !== 1 || MK.papers[0].qs.some(q => q.part !== lab[0])) bad.push('ô phần khác chưa làm riêng phần đó');
    else { clearInterval(MK.tick); const P = MK.papers[0]; P.res = P.qs.map((q, j) => Object.assign({}, q, { ok: j % 2 === 0, ans: 'x' })); tryv('kết quả phần', () => mkResult());
      const last = (S.mock.b1 || []).slice(-1)[0]; if (!last || last.pct !== null || !last.papers[0].pp || !last.papers[0].pp[lab[0]] || !H().includes('data-a="map"')) bad.push('làm riêng phần: chưa lưu theo phần / tính nhầm cả đề / thiếu nút về bản đồ'); }
    // xem cấp khác; lối tắt từ màn kỳ thi mở đúng mục
    CBM_LV = 'b2'; MAP_TAB = 'cb'; await tryA('Cambridge B2', () => mapView()); if (!H().includes('Cambridge B2')) bad.push('đổi cấp bản đồ Cambridge sai'); CBM_LV = null;
    await tryA('IELTS', () => ieltsView()); if (!H().includes('data-mapk="ielts"')) bad.push('màn IELTS: lối tắt chưa mở mục IELTS');
    await tryA('TOEIC', () => toeicView()); if (!H().includes('data-mapk="toeic"')) bad.push('màn TOEIC: lối tắt chưa mở mục TOEIC');
    CB_LV = null; await tryA('Cambridge', () => cbView('b1')); if (!H().includes('data-mapk="cb"') || !H().includes('data-cbmlv="b1"')) bad.push('màn Cambridge thiếu lối tắt bản đồ'); CB_LV = null;
    // mục tiêu Cambridge: 🎯 ở mục Cambridge; nền thiếu xa thì mở đầu ở Nền và ghi chưa xếp giờ luyện đề
    S = blank(); S.lt = { goal: { at: now, kind: 'cambridge', lv: 'b1' }, d: [], fx: {} }; MAP_TAB = null; await tryA('mục tiêu Cambridge', () => mapView()); h = H();
    if (!h.includes('class="on" data-mtab="nen"') || !h.includes('<i>🎓🎯</i>Cambridge</button>')) bad.push('mục tiêu Cambridge, nền thiếu xa: mở đầu ở Nền, 🎯 ở Cambridge');
    await tryA('mục tiêu Cambridge, mục Cambridge', () => mapView('cb')); if (!H().includes('chưa xếp giờ luyện đề') || !H().includes('Cambridge B1 🎯')) bad.push('mục tiêu Cambridge: thiếu ghi chú ⚖️ / cấp mục tiêu');
    if (!(HD.find(x => x[0] === 'bando') || [, , () => ''])[2]().includes('Cambridge')) bad.push('Luật mục bản đồ chưa nói Cambridge');
    MAP_TAB = null; CBM_LV = null; S = blank();
    add('cefr', 'C36', !bad.length && !errs.length, [...errs, ...bad].length ? [...errs, ...bad].slice(0, 8).join(' | ') : 'bản đồ mọi mục tiêu: hàng chọn Nền / Cambridge / IELTS / TOEIC xem được cả khi không phải mục tiêu (ghi chú chỉ để xem), nhớ mục trong phiên, bản đồ Cambridge theo phần (yếu / chưa chắc / ổn / chưa làm), bấm ô luyện đúng phần, làm riêng phần lưu theo phần, lối tắt mở đúng mục'); }
  // v122 kỳ thi theo khuôn Nền: màn đầu = "Học" + hàng chọn + dòng tiến độ + lưới ô có thanh + "Thêm"; màn kỹ năng = 3 bước + 📘 / 🏋️ + danh sách bài cụ thể + "Thêm"
  { const bad = [], errs = [], tryv = (n, f) => { try { f(); } catch (e) { errs.push(n + ': ' + e.message); } }, tryA = async (n, f) => { try { await f(); } catch (e) { errs.push(n + ': ' + e.message); } };
    const H = () => String($app.innerHTML), now = Date.now(), D = 864e5; await Promise.all([ieLoad(), toLoad(), cbMapLoad(), loadEB(), ...Object.values(KIT).map(kLoad)]);
    S = blank(); S.ie = { set: 1, type: 'ac', target: 6.5 }; MAP_TAB = null; CB_LV = null;
    EX_PART = 'san'; const homeOk = h => h.includes('data-expart=""') && h.includes('class="grid2"') && (h.match(/class="tile /g) || []).length >= 3 && h.includes('<details class="box more">') && !((x => (x.match(/class="btnbig/g) || []).length !== (/class="btnbig" data-daigo/.test(x) ? 1 : 0))(h)) && !h.includes('class="exscore"');   // v141: hàng chọn kỳ thi thay nút ‹ Học; nút to duy nhất là 🤖 Đề AI
    const skOk = (h, open = true) => (h.match(/class="statc"/g) || []).length === 2 && h.includes('class="btnbig') && h.includes('class="box mockr"') && (!open || /class="box mockr"[^]*<button/.test(h)) && h.includes('🏋️ ') && h.includes('class="urow next"') && h.includes('Luyện thi không tính');   // v134: 2 ô số đo, nút chính ghi rõ, dòng thi thử
    await tryA('IELTS', () => ieltsView()); if (!homeOk(H())) bad.push('màn IELTS chưa theo khuôn Nền');
    await tryA('TOEIC', () => toeicView()); if (!homeOk(H()) || H().includes('data-tosk="T"')) bad.push('màn TOEIC chưa theo khuôn Nền');
    await tryA('Cambridge', () => cbView('b1')); if (!homeOk(H()) || (H().match(/data-cbsk="b1\\|/g) || []).length !== MOCK.b1.papers.length) bad.push('màn Cambridge chưa theo khuôn Nền / thiếu ô bài thi');
    for (const k of ['L', 'R', 'W', 'S']) { tryv('IELTS ' + k, () => ieSkView(k)); if (!skOk(H())) bad.push('IELTS ' + k + ' chưa theo khuôn 3 bước'); }
    for (const k of ['L', 'R', 'V']) { tryv('TOEIC ' + k, () => toSkView(k)); if (!skOk(H(), k !== 'V')) bad.push('TOEIC ' + k + ' chưa theo khuôn 3 bước'); }   // Từ công sở: bước ③ chỉ thành nút khi có từ đến hạn
    for (const pi of MOCK.b1.papers.map((_, i) => i)) { tryv('Cambridge ' + pi, () => cbSkView('b1', pi)); if (!skOk(H())) bad.push('Cambridge B1 bài thi ' + pi + ' chưa theo khuôn 3 bước'); }
    // danh sách bài cụ thể + trạng thái: đúng a/b, yếu khi dưới mức cần; 🏋️ = bài chưa làm đầu tiên; Đọc đổi biểu tượng 📰 như Nền
    { const o = ieSt(), d = IE.doc; o.r[d[0].id] = { at: now - D, ok: 4, n: 13, k: 'r' }; o.r[d[1].id] = { at: now, ok: 12, n: 13, k: 'r' }; }
    tryv('IELTS Đọc có kết quả', () => ieSkView('R')); { const h = H(); if (!h.includes('4/13 câu · yếu') || !h.includes('12/13 câu') || ieNext('R').id !== IE.doc[2].id || !h.includes('📰 Đọc')) bad.push('IELTS Đọc: trạng thái bài / bài kế tiếp sai'); }
    ieSt().s.push({ at: now, parts: 'p1', band: 5, ids: [IE.p1[0].id] }); if (!(ieRes('S', ieBai('S').find(b => b.id === IE.p1[0].id)) || {}).bad) bad.push('IELTS Nói: chưa ghi theo chủ đề');
    { const o = toSt(); for (const x of TO.p5.slice(0, 10)) o.r[x.id] = { at: now, ok: 0, n: 1, k: 'p5' }; } tryv('TOEIC Đọc', () => toSkView('R')); if (!H().includes('0/10 câu · yếu') || toNext('R').id !== 'p5:2') bad.push('TOEIC Đọc: bộ 10 câu / bài kế tiếp sai');
    // Cambridge: các loại bài theo phần của khuôn đề
    const kinds = (lv, pi) => [...new Set(cbBai(lv, pi).map(b => b.kind))].sort().join(',');
    if (kinds('b1', 0) !== 'part,sn,u' || !kinds('b2', 0).includes('kwt') || kinds('b1', 3) !== 'cap' || kinds('a1', 2) !== 'part' || !kinds('a2', 1).includes('nf')) bad.push('Cambridge: loại bài sai ' + [kinds('b1', 0), kinds('b2', 0), kinds('b1', 3), kinds('a1', 2), kinds('a2', 1)].join(' / '));
    const kb = cbBai('a2', 0).find(b => b.kind === 'kit'); S.cbx = { [kb.x.id]: { at: now, ok: 2, n: 8 } }; tryv('Cambridge Đọc', () => cbSkView('a2', 0)); if (!H().includes('2/8 câu · yếu')) bad.push('Cambridge: trạng thái bài làm như đề thi sai');
    // làm một bài như đề thi: chỉ bài đó, có nút về màn bài thi, lưu theo bài (S.cbx) và đánh dấu một phần (one)
    S.mock = {}; S.cbx = {}; await tryA('làm một bài', () => cbDo('b1', 0, kb));
    if (!MK || !MK.back || !MK.one || MK.papers.length !== 1 || MK.papers[0].qs.some(q => !q.q.x || q.q.x.id !== kb.x.id)) bad.push('làm một bài Cambridge sai');
    else { clearInterval(MK.tick); const P = MK.papers[0]; P.res = P.qs.map((q, j) => Object.assign({}, q, { ok: j === 0, ans: 'x' })); tryv('kết quả một bài', () => mkResult());
      const last = (S.mock.b1 || []).slice(-1)[0]; if (!last || !last.one || last.pct !== null || !(S.cbx[kb.x.id] || {}).n || !H().includes('data-a="mkback"')) bad.push('kết quả một bài: chưa lưu theo bài / thiếu nút về'); }
    // ③ thi thử cả bài thi về màn bài thi; exGo bấm việc của ieToday qua nút ẩn (màn kỳ thi không còn nút ▶ Luyện tiếp)
    await tryA('thi thử bài thi', () => cbClick({ target: { closest: x => x === '[data-cbx]' ? { dataset: { cbx: 'paper|b1|0' } } : null } })); if (!MK || !MK.back || MK.one) bad.push('③ thi thử bài thi chưa về màn bài thi');
    if (MK) clearInterval(MK.tick);
    if (!(HD.find(x => x[0] === 'luyenthi') || [, , () => ''])[2]().includes('Bài học')) bad.push('Luật mục Luyện thi chưa ghi khuôn mới');
    S = blank(); MK = null;
    EX_PART = 'san'; add('cefr', 'C37', !bad.length && !errs.length, [...errs, ...bad].length ? [...errs, ...bad].slice(0, 8).join(' | ') : 'kỳ thi theo khuôn Nền: màn đầu lưới ô + Thêm (không nút to), màn kỹ năng 3 bước + 📘 cách làm / 🏋️ bài kế tiếp + danh sách bài có trạng thái (IELTS, TOEIC, Cambridge), làm một bài như đề thi lưu theo bài, nút về đúng màn'); }
  // v123 đủ nội dung theo mục tiêu (đợt 1, Đọc): IELTS đủ 11 dạng câu, mỗi dạng ≥ 3 bài; Cambridge mỗi cấp mỗi loại phần Đọc ≥ 3 bài; khuôn đề thử có đủ phần; đáp án hợp lệ
  { const bad = [], errs = [], tryv = (n, f) => { try { f(); } catch (e) { errs.push(n + ': ' + e.message); } };
    await Promise.all([ieLoad(), uLoad(), loadEB(), ...Object.values(KIT).map(kLoad)]); S = blank();
    for (const k of IE_RQK) { const n = IE.doc.filter(x => ieHasK(x, k)).length; if (n < 3) bad.push('IELTS dạng ' + k + ' chỉ ' + n + ' bài'); if (!IE_RK[k]) bad.push('IELTS thiếu nút luyện dạng ' + k); }
    for (const x of IE.doc) { const qs = ieRQs(x); if (qs.length < 13) bad.push(x.id + ' ít câu');
      for (const q of qs) if (q.kind === 'mc' ? !q.opts.includes(q.a) : !(q.acc || [q.a]).filter(Boolean).length) bad.push(x.id + ' ' + q.ty + ': đáp án hỏng'); }
    for (const u of ['R-yn', 'R-mi', 'R-mf', 'R-se', 'R-sum', 'R-dia', 'R-sa']) { if (!TH_APP.has(u)) bad.push(u + ' chưa có bài trong app'); if (imPool(u).some(x => !ieHasK(x, u.slice(2))) || imPool(u).length < 3) bad.push(u + ': kho bài chữa sai'); }
    const cnt = (k, l) => uItems(k, [l]).length;
    for (const l of ['b1', 'b2', 'c1', 'c2']) if (cnt('long', l) < 3) bad.push('bài dài ' + l + ' < 3');
    for (const l of ['a2', 'b1', 'b2', 'c1', 'c2']) if (cnt('pm', l) < 3) bad.push('nối ' + l + ' < 3');
    if (cnt('xt', 'c1') < 3) bad.push('so ý C1 < 3');
    const need = { a2: /nối câu với người/, b1: /nối người với văn bản/, c1: /so ý giữa 4 văn bản/ };
    for (const [l, re] of Object.entries(need)) { const P = MOCK[l].papers[0], part = P.parts.find(p => re.test(p[0])); if (!part) { bad.push(l + ': khuôn đề thiếu phần ' + re); continue; }
      tryv('sinh câu ' + l, () => { MK = { lv: l, C: MOCK[l], papers: [], idx: [0] }; const qs = part[1](); if (qs.length < 4 || qs.some(q => !q.opts || !q.opts.includes(q.a))) bad.push(l + ': câu phần mới hỏng'); }); }
    MK = null; if (cbKey('Phần 6: so ý giữa 4 văn bản', { parts: [] }) !== 'xt' || cbKey('Phần 2: nối người với văn bản', { parts: [] }) !== 'pm') bad.push('bản đồ Cambridge chưa nhận phần mới');
    if (!uoeBox('a2')) bad.push('A2 chưa có ô dạng đề thật');
    add('cefr', 'C38', !bad.length && !errs.length, [...errs, ...bad].length ? [...errs, ...bad].slice(0, 8).join(' | ') : 'đủ nội dung Đọc theo mục tiêu: IELTS 11 dạng câu (mỗi dạng ≥ 3 bài, đề thử dùng được), Cambridge A2 / B1 phần 2, C1 phần 6, bài dài / nối đoạn mỗi cấp ≥ 3, đáp án hợp lệ'); }
  // v124 đủ nội dung đợt 2: 12 điểm ngữ pháp Nền mới (mỗi mặt đủ câu luyện + thi); TOEIC câu có bảng Part 3 / 4, hội thoại 3 người, từ công sở ≥ 300
  { const bad = [], errs = [], tryv = (n, f) => { try { f(); } catch (e) { errs.push(n + ': ' + e.message); } }, P = KIT.np;
    const NEW = ['g-xa1-1', 'g-xa2-1', 'g-xa2-2', 'g-xa2-3', 'g-xa2-4', 'g-xa2-5', 'g-xa2-6', 'g-xb1-1', 'g-xb1-2', 'g-xb1-3', 'g-xb1-4', 'g-xb2-1'];
    for (const id of NEW) { const x = P.items.find(y => y.id === id); if (!x) { bad.push('thiếu điểm ' + id); continue; } if (x.lv !== id.slice(3, 5)) bad.push(id + ': sai cấp ' + x.lv);
      for (const ph of ['learn', 'test']) for (const k of ['nhan', 'dien', 'sua']) { let qs = []; tryv(id + ' ' + k, () => { qs = P.q(x, k, ph); }); if (!qs.length) bad.push(id + ': thiếu câu ' + k + ' ' + ph);
        for (const q of qs) if (q.kind === 'mc' ? !q.opts.includes(q.a) || new Set(q.opts).size !== q.opts.length : !(q.acc && q.acc.length)) bad.push(id + ': câu hỏng ' + k); }
      if (['a1', 'a2'].includes(x.lv)) { const hq = P.q(x, 'hieu', 'learn'); if (hq.length < 2 || hq.some(q => !q.opts.includes(q.a))) bad.push(id + ': câu hiểu hỏng'); }
      if (!kItems(P, x.lv).some(y => y.id === id)) bad.push(id + ': không có trong bài cấp ' + x.lv); }
    await toLoad(); delete S.to; const nv = TO.voc.reduce((t, x) => t + x.w.length, 0); if (nv < 300 || TO.voc.length < 25) bad.push('từ công sở chưa đủ 300: ' + nv);
    const g3 = TO.p3.filter(x => x.g), g4 = TO.p4.filter(x => x.g), t3 = TO.p3.filter(x => new Set(x.lines.map(l => l[0])).size > 2);
    if (g3.length < 3 || g4.length < 3 || t3.length < 2) bad.push('Part 3 / 4 thiếu bài có bảng / 3 người: ' + [g3.length, g4.length, t3.length].join('/'));
    for (const x of [...g3, ...g4]) { const qs = toTalkQs(x, x.lines ? 'p3' : 'p4'); if (qs.some(q => !String(q.head).includes('class="tograph"'))) bad.push(x.id + ': thiếu bảng ở câu hỏi');
      const gq = qs.filter(q => /^Look at the graphic/.test(q.q)); if (gq.length !== 1 || gq[0].opts.length !== 4) bad.push(x.id + ': câu bảng hỏng'); }
    for (const x of t3) if (!String(toTalkQs(x, 'p3')[0].head).includes('3 người nói')) bad.push(x.id + ': thiếu nhãn 3 người');
    tryv('phát 3 giọng', () => kPlayDlg(t3[0].lines)); if (!TO_HOW.L[1].some(t => t.includes('Look at the graphic'))) bad.push('📘 cách làm thiếu mẹo câu có bảng');
    const seen = new Set(); for (let i = 0; i < 30; i++) toGen.p3(3).forEach(q => { if (q.x.g) seen.add(q.x.id); }); if (!seen.size) bad.push('Part 3 không bốc bài có bảng');
    add('cefr', 'C39', !bad.length && !errs.length, [...errs, ...bad].length ? [...errs, ...bad].slice(0, 8).join(' | ') : 'đủ nội dung đợt 2: 12 điểm ngữ pháp Nền mới có câu luyện + thi mọi mặt; TOEIC Part 3 / 4 có bảng (≥ 3 bài mỗi Part), hội thoại 3 người, từ công sở ≥ 300'); }
  // v125 đủ nội dung đợt 3: Nền Đọc / Nghe B1 → C2 mỗi cấp ≥ 11 bài luyện (thêm 5); câu ý chính / chi tiết hợp lệ, tên Việt không trùng trong cấp, B1 / B2 mỗi bài 1 câu suy luận
  { const bad = [], errs = [], tryv = (n, f) => { try { f(); } catch (e) { errs.push(n + ': ' + e.message); } };
    for (const pid of ['doc', 'nghe']) { const P = KIT[pid]; await kLoad(P);
      for (const lv of ['b1', 'b2', 'c1', 'c2']) { const L = kItems(P, lv); if (L.length < 11) bad.push(pid + ' ' + lv + ': ' + L.length + ' bài luyện');
        if (new Set(L.map(x => x.tvi)).size !== L.length) bad.push(pid + ' ' + lv + ': trùng tên Việt');
        for (const n of [16, 17, 18, 19, 20]) { const id = (pid === 'doc' ? 'doc-' : 'ng-') + lv + '-' + n, x = L.find(y => y.id === id); if (!x) { bad.push('thiếu ' + id); continue; }
          let qs = []; tryv(id, () => { qs = [...kRead(P, x, 'y', pid === 'nghe'), ...kRead(P, x, 'ct', pid === 'nghe')]; });
          if (qs.length !== x.qs.length + 1) bad.push(id + ': ' + qs.length + ' câu');
          for (const q of qs) if (!q.opts.includes(q.a) || new Set(q.opts).size !== q.opts.length) bad.push(id + ': câu hỏng ' + q.q);
          if (pid === 'nghe' && !qs.every(q => q.play && (q.play.lines || q.play.text))) bad.push(id + ': thiếu bài phát'); } } }
    // câu suy luận B1 / B2 nằm ở content/suyluan.json (build-bac xoá câu sl ghi thẳng trong bài): mỗi bài mới đúng 1 câu
    for (const pid of ['doc', 'nghe']) for (const x of KIT[pid].items.filter(y => /-(b1|b2)-(1[6-9]|20)$/.test(y.id))) if (x.qs.filter(q => q.sl).length !== 1) bad.push(x.id + ': cần đúng 1 câu suy luận');
    add('cefr', 'C40', !bad.length && !errs.length, [...errs, ...bad].length ? [...errs, ...bad].slice(0, 8).join(' | ') : 'đủ nội dung đợt 3: Đọc / Nghe Nền B1 → C2 mỗi cấp ≥ 11 bài luyện, câu ý chính + chi tiết hợp lệ, tên không trùng, B1 / B2 mỗi bài 1 câu suy luận'); }
  // v126 đủ nội dung đợt 4: Nghe IELTS mỗi Part ≥ 2 phần (đề thử Nghe 40 câu); Cambridge nghe nối người nói B2 → C2 (≥ 3 bộ mỗi cấp, 1 / 2 nhiệm vụ, có trong đề thử, danh sách bài, bản đồ, giọng)
  { const bad = [], errs = [], tryv = (n, f) => { try { f(); } catch (e) { errs.push(n + ': ' + e.message); } }; await ieLoad(); await kLoad(KIT.nghe);
    if (!NCLIPS.size) try { NCLIPS = new Set(await (await fetch('n/index.json')).json()); } catch (e) {}
    for (const pt of [1, 2, 3, 4]) if (IE.ln.filter(x => x.part === pt).length < 2) bad.push('IELTS Nghe Part ' + pt + ' < 2 phần');
    for (const id of ['il-p2-festival', 'il-p3-sleep', 'il-p4-kelp']) { const x = IE.ln.find(y => y.id === id); if (!x) { bad.push('thiếu ' + id); continue; } const qs = ieLnQs(x); if (qs.length !== 10) bad.push(id + ': ' + qs.length + ' câu');
      for (const q of qs) if (q.kind === 'mc' && (!q.opts.includes(q.a) || new Set(q.opts).size !== q.opts.length)) bad.push(id + ': câu hỏng ' + q.q); }
    let lm = []; tryv('đề thử Nghe IELTS', () => { lm = IE_PAPERS.find(p => p.k === 'L').gen(); }); if (lm.length !== 40) bad.push('đề thử Nghe IELTS ' + lm.length + ' câu');
    const MM = mmSets(); for (const lv of ['b2', 'c1', 'c2']) { const xs = MM.filter(x => x.lv === lv); if (xs.length < 3) bad.push('nối người nói ' + lv + ': ' + xs.length + ' bộ');
      for (const x of xs) { const qs = mmQs(x), nt = lv === 'b2' ? 1 : 2; if (x.tasks.length !== nt || qs.length !== 5 * nt) bad.push(x.id + ': ' + qs.length + ' câu');
        for (const q of qs) if (q.opts.length !== 8 || !q.opts.includes(q.a) || !q.play || q.play.max !== 2) bad.push(x.id + ': câu hỏng ' + q.q);
        if (new Set(qs.map(q => q.play.key)).size !== 5) bad.push(x.id + ': khoá nghe phải theo người nói');
        const miss = x.sp.flatMap(t => kSents(t)).filter(t => !NCLIPS.has(clipKey(t))); if (miss.length) bad.push(x.id + ': thiếu giọng ' + miss.length + ' câu (chạy tools/build-audio.py)'); }
      const C = MOCK[lv], pi = C.papers.findIndex(p => /Nghe/.test(p.t)), pt = C.papers[pi].parts.findIndex(([lab]) => cbKey(lab, C.papers[pi]) === 'mm');
      if (pt < 0) { bad.push(lv + ': đề thử thiếu phần nối người nói'); continue; }
      MK = { lv, C, papers: [], idx: [pi] }; let g = []; tryv(lv + ' sinh phần', () => { g = C.papers[pi].parts[pt][1](); }); if (g.length !== (lv === 'b2' ? 5 : 10) || g.some(q => q.x.lv !== lv)) bad.push(lv + ': phần nối người nói sinh ' + g.length + ' câu');
      const L = cbBai(lv, pi).filter(b => b.kind === 'mm'); if (L.length < 3) bad.push(lv + ': danh sách bài thiếu bộ nối người nói');
      if (!CB_HOWT.mm || cbCat(C.papers[pi].parts[pt][0], C.papers[pi]) !== 'mm') bad.push(lv + ': thiếu cách làm phần nối người nói');
      // làm một bộ như đề thi: kết quả vào S.cbx (danh sách bài) và đề thử theo phần (ô bản đồ)
      const x0 = L[0].x, q0 = mmQs(x0), lab = C.papers[pi].parts[pt][0]; S.cbx = {}; S.mock = {};
      MK = { lv, C, papers: [{ t: C.papers[pi].t, min: 6, qs: q0.map(q => ({ part: lab, q })), res: q0.map((q, i) => ({ part: lab, q, ok: i % 2 === 0, ans: q.a })) }], idx: [pi], one: 1, back: () => {} };
      tryv(lv + ' kết quả', () => mkResult()); const r = S.cbx[x0.id], cell = cbRows(lv)[pi].cells[pt];
      if (!r || r.n !== q0.length || !cbRes(lv, L[0], cbRows(lv)[pi].cells) || !cell || cell.n !== q0.length) bad.push(lv + ': kết quả nối người nói không vào danh sách / bản đồ'); }
    // bài kế tiếp chia đều các phần của đề: đã làm 1 bài nghe thường thì lượt sau là bộ nối người nói (trước v126 phải làm hết ~20 bài nghe)
    { const pB = MOCK.b2.papers.findIndex(p => /Nghe/.test(p.t)), LB = cbBai('b2', pB), nb = cbNext(LB, LB.map((b, k) => k === 0 ? { at: 1, ok: 1, n: 1 } : null));
      const k2 = LB.findIndex(b => b.i !== LB[0].i && b.kind !== 'mm'), nc = cbNext(LB, LB.map((b, k) => k === 0 || k === k2 ? { at: 1, ok: 1, n: 1 } : null));
      if (LB[0].kind === 'mm' || !nb || nb.i === LB[0].i || !nc || nc.kind !== 'mm') bad.push('bài kế tiếp không chia đều các phần: ' + (nb && nb.kind) + ' → ' + (nc && nc.kind)); }
    MK = null; S.cbx = {}; S.mock = {};
    add('cefr', 'C41', !bad.length && !errs.length, [...errs, ...bad].length ? [...errs, ...bad].slice(0, 8).join(' | ') : 'đủ nội dung đợt 4: Nghe IELTS 2 phần mỗi Part (đề thử 40 câu); Cambridge nối người nói B2 → C2 ≥ 3 bộ mỗi cấp, trong đề thử, danh sách bài, bản đồ, giọng đủ'); }
  // v127 💼 TOEIC Part 1 tả tranh (tranh vẽ SVG thay ảnh chụp): ≥ 12 câu, 4 lời tả chỉ nghe, đúng một; trong đề thử Nghe, danh sách bài, bản đồ điểm, cách làm; giọng đủ
  { const bad = [], errs = []; await toLoad(); delete S.to; if (!NCLIPS.size) try { NCLIPS = new Set(await (await fetch('n/index.json')).json()); } catch (e) {}
    if (!TO.p1 || TO.p1.length < 12) bad.push('Part 1 < 12 câu');
    for (const x of TO.p1 || []) { const q = toP1Q(x); if (!/<svg class="topic"/.test(q.head) || q.opts.join('') !== 'ABCD' || q.a !== 'ABCD'[x.a] || q.play.lines.length !== 4 || !/✅/.test(q.why)) bad.push(x.id + ': câu Part 1 hỏng');
      const miss = x.lines.map(l => l[1]).filter(t => !NCLIPS.has(clipKey(t))); if (miss.length) bad.push(x.id + ': thiếu giọng ' + miss.length + ' câu (chạy tools/build-audio.py)'); }
    const tl = TO_PAPERS.find(p => p.k === 'L').gen(); if (tl.filter(it => it.part === TO_SEC.p1[1]).length !== 3) bad.push('đề thử Nghe TOEIC thiếu Part 1');
    if (!toBai('L').some(b => b.sec === 'p1') || !tmRows()[0][1].includes('p1') || tmSk('p1') !== 'L' || !TO_HOW.L[1].some(t => /Part 1/.test(t))) bad.push('Part 1 thiếu ở danh sách bài / bản đồ / cách làm');
    toLog(TO.p1.slice(0, 3).map(x => ({ q: toP1Q(x), ok: true, ans: 'ABCD'[x.a] })), 'luyen'); if (!S.to.ty || !S.to.ty.p1) bad.push('Part 1 không ghi vào bản đồ điểm');
    delete S.to;
    add('toeic', 'C42', !bad.length && !errs.length, [...errs, ...bad].length ? [...errs, ...bad].slice(0, 8).join(' | ') : 'TOEIC Part 1 tả tranh: 12 câu tranh vẽ, 4 lời tả chỉ nghe, trong đề thử Nghe, danh sách bài, bản đồ điểm, cách làm, giọng đủ'); }
  // v128 🖼 Starters / Movers có tranh: từ chọn tay (emoji không trùng), đề thử Pre-A1 / A1 có "Nghe, chọn tranh" (3 tranh, câu nghe có từ) và "Nhìn tranh, đúng hay sai" (đáp án khớp câu); danh sách bài, cách làm, giọng
  { const bad = [], errs = [], tryv = (n, f) => { try { f(); } catch (e) { errs.push(n + ': ' + e.message); } }; await kLoad(KIT.nghe); if (!NCLIPS.size) try { NCLIPS = new Set(await (await fetch('n/index.json')).json()); } catch (e) {}
    const PS = picSet(); if (PS.filter(x => x.lv === 'pre').length < 60 || PS.filter(x => x.lv === 'a1').length < 30 || new Set(PS.map(x => x.e)).size !== PS.length) bad.push('kho từ có tranh chưa đủ / trùng emoji');
    const miss = PS.filter(x => !NCLIPS.has(clipKey(x.s))); if (miss.length) bad.push('thiếu giọng ' + miss.length + ' câu (chạy tools/build-audio.py)');
    for (const lv of ['pre', 'a1']) { const C = MOCK[lv], fd = (re) => { for (const [pi, p] of C.papers.entries()) { const k = p.parts.findIndex(([lab]) => re.test(lab)); if (k >= 0) return [pi, k]; } return null; };
      // v129: Movers theo đề thật không có phần "đúng hay sai" của Starters (chỉ nghe chọn tranh)
      const L = fd(/nghe, chọn tranh/i), R = lv === 'pre' ? fd(/nhìn tranh, đúng hay sai/i) : null; if (!L || (lv === 'pre' && !R)) { bad.push(lv + ': đề thử thiếu phần có tranh'); continue; }
      MK = { lv, C, papers: [], idx: [0] }; let ql = [], qr = []; tryv(lv + ' sinh', () => { ql = C.papers[L[0]].parts[L[1]][1](); qr = R ? C.papers[R[0]].parts[R[1]][1]() : []; });
      if (ql.length !== 5 || (R && qr.length !== 5)) bad.push(lv + ': số câu ' + ql.length + '/' + qr.length);
      for (const q of ql) if (!q.emo || q.opts.length !== 3 || new Set(q.opts).size !== 3 || q.opts[0] === undefined || !q.opts.includes(q.a) || q.a !== q.x.e || !q.play || !q.play.text.toLowerCase().includes(q.x.w.toLowerCase().replace(/s$/, ''))) bad.push(lv + ': câu chọn tranh hỏng ' + (q.x && q.x.w));
      for (const q of qr) { const yes = q.a === MK_YES, th = picThis(q.x); if (yes !== (q.q === esc(th)) || !q.head.includes(q.x.e)) bad.push(lv + ': câu đúng / sai hỏng ' + q.x.w + ' · ' + q.q); }
      if (lv === 'pre' && qr.some(q => q.a === MK_NO && !PS.some(y => y.lv === 'pre' && q.q === esc(picThis(y))))) bad.push('pre: câu sai dùng từ ngoài Starters');
      for (const [pi, k] of [L, R].filter(Boolean)) { const p = C.papers[pi], lab = p.parts[k][0]; if (!cbBai(lv, pi).some(b => b.kind === 'part' && b.i === k && /tranh/i.test(b.name)) || cbCat(lab, p) !== 'pic' || !/^pic/.test(cbKey(lab, p)) || !CB_HOWT.pic) bad.push(lv + ': thiếu dòng bài / cách làm / khoá bản đồ phần ' + lab); } }
    MK = null;
    add('cefr', 'C43', !bad.length && !errs.length, [...errs, ...bad].length ? [...errs, ...bad].slice(0, 8).join(' | ') : 'Starters / Movers có tranh: 122 từ chọn tay, nghe chọn tranh + nhìn tranh đúng / sai trong đề thử, danh sách bài, cách làm, giọng đủ'); }
  // v129 🎓 dạng đề Cambridge còn thiếu (dangthi.js): mỗi dạng có bộ ở đúng cấp, phần đề thử theo đề thật Starters / Movers / A2 / B1, câu hợp lệ, lời nghe có giọng, khoá bản đồ, dòng bài, cách làm
  { const bad = [], errs = [], tryv = (n, f) => { try { f(); } catch (e) { errs.push(n + ': ' + e.message); } }; S = blank(); await Promise.all(Object.values(KIT).map(kLoad)); if (!NCLIPS.size) try { NCLIPS = new Set(await (await fetch('n/index.json')).json()); } catch (e) {}
    const WANT = { pre: ['line', 'name', 'colour', 'yn', 'spell', 'box', 'story', 'picl', 'picr'], a1: ['line', 'name', 'match5', 'picl', 'colour', 'def', 'resp', 'box', 'mcc', 'story', 'pdesc'], a2: ['pmc', 'match5', 'pstory'], b1: ['pmc'] };
    for (const [lv, ks] of Object.entries(WANT)) { const C = MOCK[lv], have = {};
      C.papers.forEach((p, pi) => p.parts.forEach(([lab], i) => { const k = cbKey(lab, p); if (k) have[k] = [pi, i, lab]; }));
      for (const k of ks) { if (!have[k]) { bad.push(lv + ': đề thử thiếu phần ' + k); continue; } const [pi, i, lab] = have[k], p = C.papers[pi];
        MK = { lv, C, papers: [], idx: [pi] }; let qs = []; tryv(lv + ' ' + k, () => { qs = p.parts[i][1](); }); if (!qs.length) { bad.push(lv + ' ' + k + ': không sinh câu'); continue; }
        for (const q of qs) { if (q.kind === 'mc' && (!q.opts.includes(q.a) || new Set(q.opts).size !== q.opts.length)) bad.push(lv + ' ' + k + ': câu trắc nghiệm hỏng ' + String(q.q).slice(0, 40));
          if (q.kind === 'type' && !(q.acc || [q.a]).filter(Boolean).length) bad.push(lv + ' ' + k + ': câu gõ thiếu đáp án');
          if (q.kind === 'write' && !(q.x && q.x.k && q.x.k.length && /<svg/.test(q.head))) bad.push(lv + ' ' + k + ': bài viết theo tranh thiếu tranh / ý');
          if (q.play && q.play.lines && q.play.lines.some(l => !NCLIPS.has(clipKey(l[1])))) bad.push(lv + ' ' + k + ': thiếu giọng (chạy tools/build-audio.py)'); }
        if (!cbBai(lv, pi).some(b => b.i === i)) bad.push(lv + ' ' + k + ': thiếu dòng bài ở màn bài thi');
        if (!(CB_HOWT[k] || CB_HOWT[cbCat(lab, p)])) bad.push(lv + ' ' + k + ': thiếu cách làm'); } }
    // xếp chữ không lộ đáp án; định nghĩa Movers không chứa chính từ đó
    MK = { lv: 'pre', C: MOCK.pre, papers: [], idx: [1] }; for (const q of dtSpell(5)) if (q.head.includes('<b>' + q.a.split('').join(' ') + '</b>')) bad.push('xếp chữ lộ đáp án ' + q.a);
    MK = { lv: 'a1', C: MOCK.a1, papers: [], idx: [1] }; const df = dtDef(5); if (df.length !== 5 || df.some(q => q.q.toLowerCase().includes(q.a))) bad.push('định nghĩa Movers hỏng');
    MK = null;
    add('cefr', 'C44', !bad.length && !errs.length, [...errs, ...bad].length ? [...errs, ...bad].slice(0, 8).join(' | ') : 'đủ dạng đề Cambridge: Starters 9 phần, Movers 11 phần, A2 nghe chọn tranh / nối người với vật / viết truyện theo tranh, B1 nghe chọn tranh; câu hợp lệ, giọng, dòng bài, cách làm'); }
  // v130 đủ dạng: Nói Starters (hỏi đáp về tranh), Nói phần 2 có ảnh (B1 1 ảnh, B2 2 ảnh, C1 3 ảnh), IELTS Nghe điền bảng / điền câu / trả lời ngắn, TOEIC Part 4 câu hàm ý; bản đồ band chọn đúng bài cho dạng chỉ IELTS có
  { const bad = [], errs = [], tryv = (n, f) => { try { f(); } catch (e) { errs.push(n + ': ' + e.message); } }; S = blank(); await Promise.all(Object.values(KIT).map(kLoad)); await ieLoad(); await toLoad(); if (!NCLIPS.size) try { NCLIPS = new Set(await (await fetch('n/index.json')).json()); } catch (e) {}
    const sp = MOCK.pre.papers.find(p => p.speak); if (!sp) bad.push('Starters thiếu bài Nói'); else { MK = { lv: 'pre', C: MOCK.pre, papers: [], idx: [0] }; let qs = []; tryv('Nói Starters', () => { qs = sp.parts[0][1](); });
      const pq = qs.filter(it => it.q.mode === 'pq'); if (pq.length < 4 || pq.some(it => !/<svg/.test(it.q.pic) || !it.q.st.need.any.length) || !qs.some(it => it.q.mode === 'q')) bad.push('Nói Starters thiếu hỏi đáp về tranh');
      let sc = null; tryv('chấm Nói Starters', () => { sc = mkSpeakScore(qs.map(it => ({ ...it, ans: it.q.mode === 'pq' ? it.q.st.need.any[0] : it.q.mode === 'eit' ? it.q.s : 'my name is Lan', secs: 3, lat: 1 })), 'pre'); }); if (!sc || !(sc.pct > 50)) bad.push('chấm Nói Starters sai: ' + (sc && sc.pct)); }
    for (const [lv, n] of [['b1', 1], ['b2', 2], ['c1', 3]]) { MK = { lv, C: MOCK[lv], papers: [], idx: [0] }; let qs = []; tryv('Nói ' + lv, () => { qs = mkSpeak(); }); const ph = qs.find(it => /ảnh/.test(it.part));
      if (!ph || (ph.q.pic.match(/<svg/g) || []).length !== n || !ph.q.x.k.length || ph.q.mode !== 'talk') bad.push(lv + ': phần 2 thiếu ảnh (' + n + ')'); }
    const hx = IE.ln.find(x => x.id === 'il-p4-heat'); if (!hx) bad.push('IELTS thiếu bài điền bảng'); else { const qs = ieLnQs(hx), ty = new Set(qs.map(q => q.k));
      if (qs.length !== 10 || !['ln-tab', 'ln-sent', 'ln-sa'].every(k => ty.has(k)) || qs.some(q => q.kind !== 'type' || !q.acc.length) || !/<mark/.test(qs[0].head) || !qs.some(q => q.ty === 'L-sa')) bad.push('IELTS điền bảng / câu / trả lời ngắn hỏng');
      const miss = kSents(hx.text).filter(t => !NCLIPS.has(clipKey(t))); if (miss.length) bad.push('IELTS bài mới thiếu giọng ' + miss.length + ' câu'); }
    if (!TH_APP.has('L-sa') || imPool('L-sa').some(x => !/^il-/.test(x.id)) || !imPool('L-sa').length || imPool('L-map').some(x => !x.map)) bad.push('bản đồ band chọn sai bài cho dạng chỉ IELTS có');
    const imp = TO.p4.filter(x => x.qs.some(q => /imply|mean when|Why does the speaker say/i.test(q.q))); if (imp.length < 2) bad.push('TOEIC Part 4 thiếu câu hàm ý');
    for (const x of TO.p4.filter(x => ['t4-24', 't4-25'].includes(x.id))) if (kSents(x.text).some(t => !NCLIPS.has(clipKey(t)))) bad.push(x.id + ': thiếu giọng');
    MK = null;
    add('cefr', 'C45', !bad.length && !errs.length, [...errs, ...bad].length ? [...errs, ...bad].slice(0, 8).join(' | ') : 'đủ dạng: Nói Starters hỏi đáp về tranh, Nói phần 2 có ảnh B1 / B2 / C1, IELTS Nghe điền bảng / điền câu / trả lời ngắn, TOEIC Part 4 câu hàm ý'); }
  // v131 📘 bài học của kỳ thi (baihoc.js): mỗi dạng câu (IELTS, TOEIC) / phần đề (Cambridge) một bài: dạng là gì, cách làm, ví dụ có lời giải, làm thử KHÔNG ghi kết quả;
  // màn kỹ năng: bước ① Học dạng, 2 danh sách 📘 Bài học · 🏋️ Bài tập, nút 📘 mở bài kế tiếp (dạng yếu lên trước), học hết thì gập
  { const bad = [], errs = [], tryA = async (n, f) => { try { await f(); } catch (e) { errs.push(n + ': ' + e.message); } }, H = () => String($app.innerHTML);
    await Promise.all([ieLoad(), toLoad(), loadEB(), uLoad(), ...Object.values(KIT).map(kLoad)]); S = blank(); S.ie = { set: 1, type: 'ac', target: 6.5 };
    const cases = [...['L', 'R', 'W', 'S'].map(k => ['ielts', k]), ...['L', 'R', 'V'].map(k => ['toeic', k])];
    for (const lv of ['pre', 'a1', 'a2', 'b1', 'b2', 'c1', 'c2']) MOCK[lv].papers.forEach((p, pi) => cases.push(['cambridge', lv + '~' + pi]));
    let nL = 0, nTry = 0;
    for (const [ex, sk] of cases) { const L = xlList(ex, sk); if (!L.length) { bad.push(ex + ' ' + sk + ': không có bài học'); continue; }
      if (new Set(L.map(d => d.id)).size !== L.length) bad.push(ex + ' ' + sk + ': trùng mã bài học');
      for (let i = 0; i < L.length; i++) { const d = L[i], nm = ex + ' ' + sk + ' ' + d.t; nL++; await tryA(nm, () => xlView(ex, sk, i)); const h = H(), tq = (XL_CUR || {}).tq || [];
        if (!d.what || !h.includes('🎯 Dạng này là gì') || !h.includes('data-xlb')) bad.push(nm + ': thiếu phần dạng này là gì');
        if (d.k !== 'time' && !h.includes('Ví dụ')) bad.push(nm + ': thiếu ví dụ');
        const w = d.gen && (XL_QC[d.id] || [])[0] && XL_QC[d.id][0].kind === 'write'; if ((d.qs || (d.gen && !w)) && !h.includes('class="xlsol"')) bad.push(nm + ': ví dụ thiếu lời giải');
        if (tq.length) { nTry++; if (tq.some(q => !q || !['mc', 'type'].includes(q.kind) || (q.kind === 'mc' && (!(q.opts || []).includes(q.a) || new Set(q.opts).size !== q.opts.length)) || (q.kind === 'type' && !(q.acc || [q.a]).filter(Boolean).length))) bad.push(nm + ': câu làm thử lỗi'); }
        else if (!h.includes('data-xlok')) bad.push(nm + ': không có làm thử, không có nút đã học'); } }
    if (nTry < nL * 0.75) bad.push('ít bài học có làm thử: ' + nTry + '/' + nL);
    S.ie.type = 'gt'; { const W = xlList('ielts', 'W').map(d => d.k).join(','); if (W !== 'w1-gt,w2-type,w2-op,w2-dis,w2-ad,w2-ps,w2-tq,w2-struct,wc-tr,wc-cc,wc-lr,wc-gr') bad.push('IELTS GT: bài học Viết sai ' + W); } S.ie.type = 'ac';
    // ví dụ Nghe IELTS: chỉ nghe đoạn quanh câu chứa đáp án (đề 3–5 phút)
    for (const d of xlList('ielts', 'L')) { const q = d.qs()[0]; if (!q || !q.seg || !q.play || (q.play.lines || kSents(q.play.text || '')).length > 4) bad.push('ví dụ Nghe IELTS ' + d.k + ' chưa cắt đoạn có đáp án'); }
    // làm thử: báo đúng / sai, không ghi kết quả bài / band / bản đồ; xong thì đánh dấu đã học
    S.exl = {}; const snap = () => JSON.stringify([ieSt().r, ieSt().ty || {}, toSt().r, toSt().ty || {}, S.uoe || {}, S.cbx || {}, S.mock || {}]), s0 = snap();
    for (const [ex, sk, i] of [['ielts', 'R', 1], ['ielts', 'S', 0], ['toeic', 'R', 0], ['toeic', 'L', 1], ['cambridge', 'b2~0', 0]]) { await tryA('mở ' + ex + sk, () => xlView(ex, sk, i)); const tq = XL_CUR.tq, id = XL_CUR.id;
      await tryA('làm thử ' + ex + sk, async () => { $app.onclick({ target: { closest: s => s === '[data-xlt]' ? {} : null } });
        for (const q of tq) { $app.onclick({ target: { closest: s => s === '[data-io]' ? { dataset: { io: String(q.opts.indexOf(q.a)) }, disabled: false } : null } }); $app.onclick({ target: { closest: s => s === '[data-a="next"]' ? {} : null } }); } });
      if (!H().includes('Xong bài học') || !H().includes('📘 Bài học: không ghi')) bad.push(ex + sk + ': màn xong bài học sai');
      if (!(S.exl[id] && S.exl[id].n === tq.length && S.exl[id].ok === tq.length)) bad.push(ex + sk + ': làm thử xong chưa đánh dấu đã học'); }
    if (snap() !== s0) bad.push('làm thử bài học ghi vào kết quả bài / bản đồ');
    // màn kỹ năng
    S.exl = {}; ieSkView('R'); let h = H(); const L = xlList('ielts', 'R');
    if (!h.includes('Học dạng câu: ') || !h.includes('📘 Dạng câu') || !h.includes('data-xl="ielts|R|0"') || !h.includes('🏋️ Bài đọc') || !h.includes('class="btnbig" data-xl=')) bad.push('màn IELTS Đọc: thiếu bài học / bài học chưa là nút chính');
    for (const d of L) S.exl[d.id] = { at: Date.now(), ok: 1, n: 1 }; ieSkView('R'); h = H();
    if (!h.includes('đã học hết ' + L.length + ' bài') || h.includes('class="btnbig" data-xl=') || !h.includes('class="btnbig" data-iebt=')) bad.push('IELTS Đọc: học hết chưa gập danh sách / bài tập chưa là nút chính');
    S.exl = {}; const ic0 = imCell; imCell = u => ({ s: u === 'R-mi' ? 'yeu' : 'chua' });
    let B = xlBlock('ielts', 'R'); if (!L[B.at] || L[B.at].k !== 'mi') bad.push('bài học của dạng yếu chưa lên trước');
    S.exl[L.find(d => d.k === 'mi').id] = { at: 1, ok: 0, n: 0 }; B = xlBlock('ielts', 'R'); if (!B.rows.some(r => r.includes('yếu · xem lại')) || L[B.at].k !== 'para') bad.push('bài đã học mà dạng còn yếu chưa ghi xem lại');
    imCell = ic0; S.exl = {};
    toSkView('L'); if (!H().includes('data-xl="toeic|L|') || !H().includes('Học dạng')) bad.push('TOEIC Nghe thiếu bài học');
    cbSkView('b1', 0); if (!H().includes('data-xl="cambridge|b1~0|') || !H().includes('Học phần thi: ')) bad.push('Cambridge B1 Đọc thiếu bài học');
    await tryA('nút về', () => xlView('toeic', 'R', 0)); $app.onclick({ target: { closest: s => s === '[data-xlb]' ? {} : null } }); if (!H().includes('data-tohome')) bad.push('bài học: nút về chưa về màn kỹ năng');
    if (!(HD.find(x => x[0] === 'luyenthi') || [, , () => ''])[2]().includes('ví dụ có lời giải')) bad.push('Luật mục Luyện thi chưa nói bài học');
    S = blank(); MK = null;
    add('cefr', 'C46', !bad.length && !errs.length, [...errs, ...bad].length ? [...errs, ...bad].slice(0, 8).join(' | ') : 'bài học kỳ thi (' + nL + ' bài, ' + nTry + ' có làm thử): mỗi dạng câu / phần một bài (dạng là gì, cách làm, ví dụ có lời giải, làm thử không ghi kết quả), màn kỹ năng 2 danh sách 📘 / 🏋️, dạng yếu lên trước, học hết thì gập'); }
  // v132 IELTS đủ dạng còn thiếu: Đọc General Training (Section 1, 2), chọn HAI (Đọc + Nghe), điền bảng Đọc, lưu đồ Nghe, Task 1 hai biểu đồ; bài học + TOEIC chuỗi tin nhắn
  { const bad = [], errs = [], tryA = async (n, f) => { try { await f(); } catch (e) { errs.push(n + ': ' + e.message); } }, H = () => String($app.innerHTML);
    await Promise.all([ieLoad(), toLoad(), loadEB(), ...Object.values(KIT).map(kLoad)]); S = blank(); S.ie = { set: 1, type: 'gt', target: 6.5 };
    const G = IE.doc.filter(x => x.gt); if (![1, 2].every(n => G.some(x => x.sec === n)) || G.some(x => ieRQs(x).length < 13 || ieRQs(x).some(q => q.ty !== 'R-gt'))) bad.push('Đọc GT: thiếu Section 1 / 2 hoặc câu chưa ghi R-gt');
    for (let i = 0; i < 10; i++) { const n = IE_PAPERS[1].gen().length; if (n !== 40) { bad.push('đề thử Đọc GT ' + n + ' câu (cần 40)'); break; } }   // 13 + 13 + 14 như đề thật
    const R = IE_PAPERS[1].gen(); if (![1, 2].every(n => R.some(it => it.part.startsWith('Section ' + n) && it.q.x && it.q.x.gt)) || !R.some(it => it.part.startsWith('Section 3') && !it.q.x.gt)) bad.push('đề thử Đọc GT chưa dùng bộ GT');
    if (!ieBai('R')[0].x.gt || imPool('R-gt').some(x => !x.gt)) bad.push('GT: danh sách bài / bản đồ chưa lấy bộ GT');
    S.ie.type = 'ac'; if (ieBai('R').some(b => b.x.gt) || IE_PAPERS[1].gen().length !== 40 || imPool('R-tf').some(x => x.gt)) bad.push('Academic thấy bộ GT hoặc đề thử Đọc ≠ 40 câu');
    // chọn HAI: 2 câu cùng danh sách A–E, mỗi chữ đúng 1 điểm, câu 2 không được trùng câu 1
    const M2 = IE.doc.filter(x => x.mc2).flatMap(x => ieRQs(x, ['mc2'])), L2 = IE.ln.flatMap(ieLnQs).filter(q => q.k === 'ln-mc2');
    if (M2.length < 4 || L2.length < 4 || [...M2, ...L2].some(q => q.any.length !== 2 || q.opts.length !== 5 || !q.any.every(a => q.opts.includes(a)) || !q.any.includes(q.a))) bad.push('chọn HAI: thiếu câu / sai cấu trúc');
    { const [a, b] = M2; if (a.opts !== b.opts || !mcOk(a, a.any[1], []) || mcOk(b, a.any[1], [{ q: a, ans: a.any[1] }]) || !mcOk(b, a.any[0], [{ q: a, ans: a.any[1] }]) || mcOk(a, a.opts.find(o => !a.any.includes(o)), [])) bad.push('chọn HAI: chấm sai'); }
    // bảng Đọc, lưu đồ Nghe
    const RT = IE.doc.filter(x => x.rtab).flatMap(x => ieRQs(x, ['rtab'])); if (RT.length < 4 || RT.some(q => q.ty !== 'R-sum' || !/<table/.test(q.head) || !/<mark/.test(q.head))) bad.push('bảng Đọc hỏng');
    const FL = IE.ln.flatMap(ieLnQs).filter(q => q.k === 'ln-flow'); if (FL.length < 4 || FL.some(q => q.ty !== 'L-form' || q.kind !== 'type' || !/______/.test(q.head))) bad.push('lưu đồ Nghe hỏng');
    if (IE.ln.some(x => ieLnQs(x).length !== 10)) bad.push('bài Nghe IELTS không còn đủ 10 câu');
    // Task 1 hai biểu đồ: vẽ đủ 2 hình, máy chấm nhận số của cả hai, AI nhận dữ liệu cả hai
    const MX = IE.t1.find(x => x.kind === 'mixed'); if (!MX || (ieChart(MX).match(/<svg/g) || []).length !== 2 || ieFeat('t1', MX, MX.m).some(f => !f[1]) || MX.parts.some(c => !ieT1Text(MX).includes(c.title))) bad.push('Task 1 hai biểu đồ hỏng');
    // bài học
    const need = { R: ['rtab', 'mc2'], L: ['mc2'], W: ['w1-mixed'] };
    for (const [sk, ks] of Object.entries(need)) { const L = xlList('ielts', sk); for (const k of ks) { const i = L.findIndex(d => d.k === k); if (i < 0) { bad.push('thiếu bài học IELTS ' + sk + ' ' + k); continue; } await tryA(k, () => xlView('ielts', sk, i)); if (!H().includes('Ví dụ') || !(XL_CUR.tq || []).length) bad.push('bài học ' + k + ' thiếu ví dụ / làm thử'); } }
    if (!xlList('ielts', 'L').find(d => d.k === 'form').ks.includes('flow')) bad.push('bài học điền phiếu chưa có lưu đồ');
    if (xlList('ielts', 'R').some(d => d.k === 'gt')) bad.push('Academic thấy bài học GT');
    S.ie.type = 'gt'; { const L = xlList('ielts', 'R'), i = L.findIndex(d => d.k === 'gt'); if (i < 0) bad.push('GT thiếu bài học văn bản GT'); else { await tryA('gt', () => xlView('ielts', 'R', i)); if (!(XL_CUR.tq || []).length || !H().includes('Ví dụ')) bad.push('bài học GT thiếu ví dụ / làm thử'); }
      if (xlList('ielts', 'W').some(d => d.k === 'w1-mixed')) bad.push('GT thấy bài học hai biểu đồ'); }
    S.ie.type = 'ac'; { const T = xlList('toeic', 'R'), i = T.findIndex(d => d.k === 'p7c'); if (i < 0) bad.push('TOEIC thiếu bài học chuỗi tin nhắn'); else { await tryA('p7c', () => xlView('toeic', 'R', i)); if (!/mean when|writes/.test(H()) || !(XL_CUR.tq || []).length) bad.push('bài học chuỗi tin nhắn thiếu câu ý định'); } }
    S = blank(); MK = null;
    add('cefr', 'C47', !bad.length && !errs.length, [...errs, ...bad].length ? [...errs, ...bad].slice(0, 8).join(' | ') : 'IELTS đủ dạng: Đọc General Training Section 1 / 2 (đề thử, danh sách, bản đồ), chọn HAI (Đọc + Nghe, chấm từng chữ), điền bảng Đọc, lưu đồ Nghe, Task 1 hai biểu đồ; bài học từng dạng + TOEIC chuỗi tin nhắn'); }
  // v132 Cambridge đủ dạng còn thiếu: A2 Key Đọc phần 4 / 5 điền từ cả đoạn, C1 phần 7 / C2 phần 6 khuyết ĐOẠN, Movers Nói 4 phần như đề thật; bài học, giọng
  { const bad = [], errs = [], tryA = async (n, f) => { try { await f(); } catch (e) { errs.push(n + ': ' + e.message); } }, H = () => String($app.innerHTML);
    await Promise.all([loadEB(), uLoad(), ...Object.values(KIT).map(kLoad)]); S = blank(); if (!NCLIPS.size) try { NCLIPS = new Set(await (await fetch('n/index.json')).json()); } catch (e) {}
    const gen = (lv, pi, re) => { const P = MOCK[lv].papers[pi], part = P.parts.find(([lab]) => re.test(lab)); if (!part) return null; MK = { lv, C: MOCK[lv], papers: [], idx: [pi] }; let qs = []; try { qs = part[1](); } catch (e) { errs.push(lv + ': ' + e.message); } MK = null; return { lab: part[0], k: cbKey(part[0], P), qs }; };
    const p4 = gen('a2', 0, /^Phần 4/), p5 = gen('a2', 0, /^Phần 5/);
    if (!p4 || p4.k !== 'mc' || p4.qs.length !== 6 || p4.qs.some(q => q.kind !== 'mc' || q.opts.length !== 3 || !q.opts.includes(q.a) || q.x.lv !== 'a2')) bad.push('A2 phần 4 chưa là trắc nghiệm 3 phương án cả đoạn');
    if (!p5 || p5.k !== 'open' || p5.qs.length !== 6 || p5.qs.some(q => q.kind !== 'type' || !q.acc.length || q.x.lv !== 'a2')) bad.push('A2 phần 5 chưa là điền một từ cả đoạn');
    if (uItems('mc', ['a2']).length < 2 || uItems('open', ['a2']).length < 2) bad.push('A2: cần ≥ 2 bộ mỗi dạng');
    for (const [lv, n] of [['c1', 7], ['c2', 6]]) { const g = gen(lv, 0, /khuyết/); if (!g || g.k !== 'gpara' || !g.lab.startsWith('Phần ' + n + ':') || g.qs.length < 4 || g.qs.some(q => q.opts.join('') !== 'ABCDE' || !q.opts.includes(q.a) || !/Các đoạn A–E/.test(q.foot) || !/<mark|dashed/.test(q.head))) bad.push(lv + ': phần khuyết đoạn hỏng'); }
    { const g = gen('b2', 0, /khuyết/); if (!g || g.k !== 'gap') bad.push('B2 phần 6 phải giữ khuyết câu'); }
    // Movers Nói: 4 phần như đề thật (+ nhắc lại câu của app)
    MK = { lv: 'a1', C: MOCK.a1, papers: [], idx: [2] }; let sp = []; try { sp = mkSpeak(); } catch (e) { errs.push('Nói Movers: ' + e.message); } MK = null;
    const parts = [...new Set(sp.map(x => x.part))]; if (!['Phần 1: tìm điểm khác nhau', 'Phần 2: kể chuyện theo tranh', 'Phần 3: chọn tranh khác loại', 'Phần 4: câu hỏi về bạn'].every(t => parts.includes(t))) bad.push('Nói Movers thiếu phần: ' + parts.join(' / '));
    if (sp.filter(x => x.q.mode === 'pq').some(x => !x.q.st.need.any.length || !(x.q.pic || '').length)) bad.push('Nói Movers: câu thiếu tranh / từ cần nói');
    const miss = dtAll().filter(x => x.k === 'spk' && x.lv === 'a1').flatMap(x => x.qs.map(q => q.q)).filter(t => !NCLIPS.has(clipKey(t))); if (miss.length) bad.push('Nói Movers thiếu giọng ' + miss.length + ' câu');
    // bài học
    const A1 = xlList('cambridge', 'a1~2'); if (A1.map(d => d.k).join(',') !== 'diff,story,odd,noi1,eit' || A1[3].t !== 'Phần 4: câu hỏi về bạn') bad.push('bài học Nói Movers sai: ' + A1.map(d => d.k).join(','));
    for (const [sk, ks] of [['a1~2', ['diff', 'story', 'odd']], ['a2~0', ['mc', 'open']], ['c1~0', ['gpara']], ['c2~0', ['gpara']]]) { const L = xlList('cambridge', sk);
      for (const k of ks) { const i = L.findIndex(d => d.k === k); if (i < 0) { bad.push('thiếu bài học ' + sk + ' ' + k); continue; } await tryA(sk + k, () => xlView('cambridge', sk, i)); if (!H().includes('Ví dụ') || !(XL_CUR.tq || []).length) bad.push('bài học ' + sk + ' ' + k + ' thiếu ví dụ / làm thử'); } }
    S = blank(); MK = null;
    add('cefr', 'C48', !bad.length && !errs.length, [...errs, ...bad].length ? [...errs, ...bad].slice(0, 8).join(' | ') : 'Cambridge đủ dạng: A2 Key phần 4 / 5 điền từ cả đoạn, C1 phần 7 / C2 phần 6 khuyết đoạn (B2 giữ khuyết câu), Movers Nói tìm điểm khác / kể chuyện theo tranh / chọn tranh khác loại / câu hỏi về bạn; bài học, giọng đủ'); }
  // v133 một trình độ: kết quả kiểm tra là nơi bắt đầu học (cấp dưới tính đã qua như thi vượt, trừ chỗ hổng nền); Hôm nay có số phút + vì sao; 📈 Tiến độ gộp đường tới mục tiêu + chỗ yếu
  { const bad = [], errs = [], tryv = (n, f) => { try { f(); } catch (e) { errs.push(n + ': ' + e.message); } }, tryA = async (n, f) => { try { await f(); } catch (e) { errs.push(n + ': ' + e.message); } };
    await Promise.all([ieLoad(), toLoad(), paLoad(), loadEB(), ...Object.values(KIT).map(kLoad)]); const H = () => String($app.innerHTML), now = Date.now();
    S = blank(); S.ie = { set: 1, type: 'ac', target: 6.5 }; ltSt().goal = { kind: 'ielts', lv: ieBase(6.5), date: '', at: now }; S.goal = 15;
    const gw = WORDS.find(w => wLv(w) === 'a2'), ow = WORDS.find(w => wLv(w) === 'a2' && w.id !== gw.id);
    S.place = { at: now, top: 'b1', start: 'b1', R: { a2: [5, 5], b1: [4, 5], b2: [1, 5] }, st: 'pre', gap: [{ k: 'tv|' + gw.id, lv: 'a2', d: dayOf(now), wd: dayOf(now) }] };
    const have0 = ltHave(), sp0 = ltSplit();
    if (plPend() !== 'b1' || ovStage() !== 'pre') bad.push('chưa chọn: phải chờ chọn nơi bắt đầu B1');
    let it = todayItems('pre', { lt: 1 }); if (!it.some(x => x.k === 'plstart' && x.attr === 'data-plstart') || it.some(x => x.k === 'vc' || x.k === 'new')) bad.push('Hôm nay: việc đầu phải là "Bắt đầu học ở B1", không thi vượt');
    tryv('màn kết quả', () => plResView({ fresh: true, back: () => {} })); { const h = H(); if (!h.includes('Bạn đang ở khoảng B1') || !h.includes('Bạn bắt đầu học ở B1') || !h.includes('data-pla="go"') || !h.includes('data-pla="no"') || !h.includes('class="lvchip on"') || !h.includes('IELTS 6.5')) bad.push('màn kết quả kiểm tra thiếu phần'); }
    // chọn "Tiếp": cấp dưới tính đã qua; chỗ hổng nền không tạo thẻ; thẻ cấp dưới ôn rải 30–150 ngày
    tryv('áp dụng', () => plApply('b1'));
    if (ovStage() !== 'b1' || curLevel() !== 'b1' || paLevel() !== 'b1' || kLv(KIT.np) !== 'b1' || plPend()) bad.push('sau khi chọn chưa học ở B1: ' + ovStage() + ' ' + curLevel() + ' ' + paLevel() + ' ' + kLv(KIT.np));
    if (!xs().runs.some(r => r.lv === 'a2p' && r.pass && r.pl) || !kSt('np').runs.some(r => r.lv === 'a2' && r.pass && r.pl)) bad.push('lần thi đạt của cấp dưới chưa ghi pl');
    if (S.cards[gw.id] || !S.cards[ow.id] || !S.cards[ow.id].vc || S.cards[ow.id].S < 30 || isDue(S.cards[ow.id], now)) bad.push('thẻ cấp dưới / chỗ hổng nền sai');
    if (xs().runs.some(r => r.lv === 'b1') || kSt('np').runs.some(r => r.lv === 'b1')) bad.push('cấp xếp được không được tính qua (vẫn phải học và thi)');
    if (ltHave() !== have0 || ltSplit().nen !== sp0.nen || S.place.st !== 'b1' || ltRe(now)) bad.push('chọn xong làm đổi trình độ đang có / chia giờ / nhắc đo lại: ' + ltHave() + ' ' + ltSplit().nen);
    if (todaySkill()) bad.push('thẻ tạo khi bỏ qua bị coi là đã luyện hôm nay');
    it = todayItems('b1', { lt: 1 }); { const nw = it.find(x => x.k === 'new'), ex = it.find(x => x.k === 'exam');
      if (!nw || !/ B1 · /.test(nw.title) || !nw.min || !nw.sub) bad.push('Hôm nay: bài mới B1 thiếu tên / số phút / vì sao: ' + (nw && nw.title));
      if (!ex || !/data-xl="ielts\\|/.test(ex.attr) || !/^IELTS (Đọc|Nghe|Viết|Nói) · /.test(ex.title) || !/Vì mục tiêu là IELTS/.test(ex.sub)) bad.push('Hôm nay: việc IELTS chưa mở thẳng bài học dạng câu: ' + (ex && ex.title)); }
    // học lại từ đầu: không đổi gì
    { const S0 = S; S = blank(); S.place = { at: now, top: 'b1', R: {}, st: 'pre', gap: [] }; tryv('học lại từ đầu', () => { plResView({ back: () => {} }); $app.onclick({ target: { closest: x => x === '[data-pla]' ? { dataset: { pla: 'no' } } : null } }); });
      if (!S.place.no || plPend() || ovStage() !== 'pre' || Object.keys(S.cards).length) bad.push('học lại từ đầu vẫn đổi tiến độ'); S = S0; }
    // 📅 Hôm nay: lời chào, MỘT nút ghi rõ việc + số phút, việc có số phút, ô mục tiêu một trình độ
    await tryA('Hôm nay', () => ltView()); { const h = H(); if (!/>Chào buổi/.test(h) || h.split('data-ltnext').length !== 2 || !/▶ Học tiếp<small>[^<]+ · khoảng \\d+ phút/.test(h) || !h.includes('class="min"') || !h.includes('Mục tiêu: IELTS 6.5') || !/Bạn đang <b[^>]*>B1<\\/b>/.test(h) || !h.includes('class="lvlabels"')) bad.push('màn Hôm nay chưa theo bản mẫu'); }
    // 📈 Tiến độ: trình độ, đường cấp (bỏ qua theo kiểm tra), bao lâu (15 / 45 phút), chia giờ vì sao, chỗ yếu cần sửa, lối vào bản đồ, thi vượt cấp đang học
    await tryA('Tiến độ', () => ltPlanView()); { const h = H(); for (const x of ['Trình độ của bạn', 'class="lvbig">B1', 'Bỏ qua theo bài kiểm tra', 'B1 · đang học', 'Bao lâu tới mục tiêu', '45 phút mỗi ngày', 'chia thế nào', 'Chỗ yếu cần sửa', 'data-mapv="lt"', 'data-vcv="b1"', 'data-ltseg="map" role="tab" aria-selected="true" class="on"']) if (!h.includes(x)) bad.push('Tiến độ thiếu: ' + x); }
    S.place.gap.push({ k: 'np|' + kItems(KIT.np, 'b1')[0].id, lv: 'b1', d: dayOf(now) - 1, wd: dayOf(now) - 1 }); await tryA('Tiến độ có chỗ hổng', () => ltPlanView()); if (!H().includes('data-ltfix="gap"')) bad.push('Tiến độ chưa đưa chỗ hổng nền vào chỗ cần sửa');
    const hd = HD.map(x => x[2]()).join(' '); if (!hd.includes('Kiểm tra trình độ là nơi bắt đầu học') || !hd.includes('📈 Tiến độ')) bad.push('Luật chưa ghi luật bắt đầu / Tiến độ');
    S = blank();
    add('cefr', 'C49', !bad.length && !errs.length, [...errs, ...bad].length ? [...errs, ...bad].slice(0, 8).join(' | ') : 'kết quả kiểm tra là nơi bắt đầu học (cấp dưới tính đã qua như thi vượt, trừ chỗ hổng nền; cấp xếp được vẫn học và thi; học lại từ đầu không đổi gì); Hôm nay có số phút + vì sao, việc IELTS mở thẳng bài học; 📈 Tiến độ một trình độ'); }
  // v134 📚 Học một trang + màn kỹ năng một kiểu (một câu cách học, ô tiến độ, MỘT nút chính ghi rõ, ô bài thi nói khi nào mở) + trang mở đầu bài 2 bước; không đổi luật đo
  { const bad = [], errs = [], tryv = (n, f) => { try { f(); } catch (e) { errs.push(n + ': ' + e.message); } }, tryA = async (n, f) => { try { await f(); } catch (e) { errs.push(n + ': ' + e.message); } };
    await Promise.all([ieLoad(), toLoad(), paLoad(), loadEB(), ...Object.values(KIT).map(kLoad)]); const H = () => String($app.innerHTML), now = Date.now();
    S = blank(); S.ie = { set: 1, type: 'ac', target: 6.5 }; ltSt().goal = { kind: 'ielts', lv: ieBase(6.5), date: '', at: now }; OV_SEL = null;
    await tryA('Học', () => overview()); { const h = H(), nR = (h.split('Luyện IELTS')[0].match(/class="hrow/g) || []).length;
      if (h.includes('class="seg"') || !h.includes('Tiếng Anh Pre-A1') || nR !== OV.filter(([id]) => ovIn(id, 'pre')).length || h.includes('data-ovx=') || !h.includes('data-exthi') || !h.includes('<details class="box more">') || h.includes('data-exsel="') || !h.includes('data-ovl="b1"')) bad.push('📚 Học chưa là một trang (Tiếng Anh + dòng chỉ sang 🎯 Luyện đề + Xem thêm; v141)'); }
    tryv('bấm kỹ năng IELTS', () => $app.onclick({ target: { closest: x => x === '[data-ovx]' ? { dataset: { ovx: 'ielts|R' } } : null } })); if (CUR.view !== 'ielts' || CUR.sk !== 'R') bad.push('dòng IELTS Đọc chưa mở màn kỹ năng');
    ltSt().goal = { kind: 'cefr', lv: 'b1', date: '', at: now }; await tryA('Học mục tiêu không thi', () => overview()); if (H().includes('Luyện ') || H().includes('data-ovx=')) bad.push('mục tiêu không thi vẫn có thẻ luyện đề');
    // màn kỹ năng Nền: câu cách học, ô tiến độ, nút chính ghi rõ, ô bài thi khoá nói khi nào mở; đủ điều kiện thì có nút thi
    tryv('Ngữ pháp', () => kView('np')); { const h = H(), nx = kItems(KIT.np, 'pre')[0];
      if (!h.includes(P_INTRO.np) || !h.includes('Đã học 0 / ') || !h.includes('▶ Học bài: ' + esc(KIT.np.name(nx))) || !h.includes('class="box examc lock"') || !h.includes('Mở khi học ' + GATE_LEARN + '%') || !h.includes('Nhớ: chưa có')) bad.push('màn Ngữ pháp chưa theo khuôn mới'); }
    tryv('Từ vựng', () => home()); { const h = H(); if (!h.includes('▶ Học bài 1') || !/\\d+ từ · khoảng 7 phút/.test(h) || !/Nhớ chắc 0 \\/ \\d+ từ/.test(h) || !h.includes('class="box examc lock"') || !h.includes('class="why"')) bad.push('màn Từ vựng chưa theo khuôn mới'); }
    tryv('Đọc', () => kView('doc')); if (!H().includes('▶ Làm bài mới: ') || !H().includes('data-k="hoc"')) bad.push('màn Đọc: nút chính chưa mở bài mới');
    tryv('Phát âm', () => paView()); if (!H().includes('▶ Học bộ âm: ') || !H().includes('class="box examc')) bad.push('màn Phát âm chưa theo khuôn mới');
    // trang mở đầu bài Từ vựng: 2 bước, một nút Bắt đầu học, lối bài tập nhanh
    tryv('mở bài', () => learn(UNITS.find(u => u.lv === 'pre'))); { const h = H(); if (!h.includes('class="box lsteps"') || !h.includes('▶ Bắt đầu học') || !h.includes('Từ ngày mai: ôn bằng bài tập') || !h.includes('data-pt="go"') || (h.match(/class="chip"/g) || []).length < 4) bad.push('trang mở đầu bài chưa 2 bước'); }
    // màn kỹ năng kỳ thi: 2 ô số đo, nút chính "Học dạng câu: …", nút bài tập ghi tên bài, danh sách tên cụ thể, dòng thi thử
    S.exl = {}; tryv('IELTS Đọc', () => ieSkView('R')); { const h = H(); if ((h.match(/class="statc"/g) || []).length !== 2 || !h.includes('▶ Học dạng câu: ') || !h.includes('Làm bài đọc · 20 phút') || !h.includes(esc(ieNext('R').name)) || !h.includes('📘 Dạng câu') || !h.includes('🏋️ Bài đọc') || !/class="box mockr"[^]*data-iemk=/.test(h)) bad.push('màn IELTS Đọc chưa theo khuôn mới'); }
    tryv('Cambridge B1 Đọc', () => cbSkView('b1', 0)); if (!H().includes('▶ Học phần thi: ') || !H().includes('📘 Phần thi')) bad.push('màn Cambridge chưa theo khuôn mới');
    EX_PART = null; await tryA('màn IELTS', () => ieltsView()); if (!H().includes('exrow') || H().includes('class="seg"')) bad.push('màn 2 nút chưa có hàng chọn kỳ thi / còn hàng chọn phần (v142)'); EX_PART = 'san';
    const hd = HD.map(x => x[2]()).join(' '); if (!hd.includes('🎯 Luyện đề') || !hd.includes('một nút chính ghi rõ') || !hd.includes('Đề mới do AI soạn')) bad.push('Luật chưa ghi màn mới (v141: tab 🎯 Luyện đề, ô 🤖)');
    S = blank(); OV_SEL = null;
    add('cefr', 'C50', !bad.length && !errs.length, [...errs, ...bad].length ? [...errs, ...bad].slice(0, 8).join(' | ') : '📚 Học một trang (Tiếng Anh + Luyện kỳ thi mục tiêu + Xem thêm), màn kỹ năng Nền và kỳ thi một kiểu (câu cách học, ô tiến độ / số đo, một nút chính ghi rõ, ô bài thi lên cấp, dòng thi thử), trang mở đầu bài 2 bước'); }
  // v135 gọt chữ: tên bài như danh sách, màn xong bài lời thường + nút học bài kế tiếp, thẻ đầu không chữ nội bộ, 👤 Tôi tách cấp bỏ qua theo kiểm tra, chỉ đếm thẻ học trong app; không đổi luật đo
  { const bad = [], errs = [], tryv = (n, f) => { try { f(); } catch (e) { errs.push(n + ': ' + e.message); } }, tryA = async (n, f) => { try { await f(); } catch (e) { errs.push(n + ': ' + e.message); } };
    await Promise.all([paLoad(), loadEB(), ...Object.values(KIT).map(kLoad)]); const H = () => String($app.innerHTML), now = Date.now();
    S = blank(); const u1 = UNITS.find(u => u.lv === 'pre'), u2 = UNITS.filter(u => u.lv === 'pre')[1], b1 = UNITS.find(u => u.lv === 'b1');
    if (uTitle(b1) !== 'Từ vựng B1 · Bài 1') bad.push('tên bài B1 chung chung phải là "Từ vựng B1 · Bài 1": ' + uTitle(b1));
    if (!uTitle(u1).startsWith('Từ vựng Pre-A1 · Bài 1') || uTitle(u1).includes('Chặng')) bad.push('tên bài Pre-A1: ' + uTitle(u1));
    tryv('mở bài', () => learn(u1)); if (!H().includes('‹ Từ vựng Pre-A1') || !H().includes('data-pt="skip"')) bad.push('trang mở đầu bài thiếu nút ‹ Từ vựng {cấp}');
    const LR = lessonRun; lessonRun = (u, ws, reqs, title, onDone) => { if (title !== uTitle(u)) bad.push('tên bài trong bài học: ' + title); onDone(); };
    try { tryv('bắt đầu học', () => $app.onclick({ target: { closest: x => x === '[data-pt="skip"]' ? {} : null } }));
      { const h = H(); if (!h.includes('✅ Xong ' + esc(uTitle(u1))) || /yêu cầu của 🔁 Nhớ/.test(h) || !h.includes('Bài này dạy những gì') || !h.includes('data-a="nxu"') || !h.includes('▶ Học bài 2') || h.includes('data-a="next"')) bad.push('màn xong bài chưa lời thường / thiếu nút học bài kế tiếp'); }
      if (!u1.words.every(w => S.cards[w.id])) bad.push('xong bài chưa tạo thẻ');
      tryv('học bài 2', () => $app.onclick({ target: { closest: x => x === '[data-a="nxu"]' ? {} : null } })); if (!H().includes('Bài 2') || !H().includes('data-pt="skip"') || CUR.view === 'the') bad.push('nút ▶ Học bài 2 chưa mở trang mở đầu bài 2'); }
    finally { lessonRun = LR; }
    tryv('thẻ đầu', () => lessonRun(u2, u2.words, reqsUpTo('pre'), uTitle(u2), () => {})); if (!H().includes('Không chấm điểm') || /dạy đủ yêu cầu|🔁 Nhớ/.test(H())) bad.push('thẻ đầu của bài học còn chữ nội bộ');
    // 👤 Tôi: kiểm tra ra B1, chọn bắt đầu ở B1 → cấp dưới "bỏ qua theo bài kiểm tra", không phải "hoàn thành trong app"; thẻ bỏ qua không tính là từ đã học
    S = blank(); S.place = { at: now, top: 'b1', start: 'b1', R: { a2: [5, 5], b1: [5, 5] }, st: 'pre', gap: [] }; ltSt().goal = { kind: 'ielts', lv: 'b2p', date: '', at: now };
    tryv('áp dụng', () => plApply('b1')); const vcN = Object.values(S.cards).filter(c => c.vc).length;
    await tryA('Tôi', () => minhView()); { const h = H();
      if (!vcN || !h.includes('Trình độ của bạn: <b>B1</b>') || !h.includes('bỏ qua theo bài kiểm tra: Pre-A1 → A2+') || h.includes('hoàn thành trong app') || !h.includes('📚 0 từ đã học trong app') || !h.includes('🧩 0 bài kỹ năng') || h.includes('Đạt bằng đề mẫu chính thức') || !h.includes('data-ltseg="map"') || !h.includes('data-mapv="lt"') || /\\(0 chỗ đang chữa\\)/.test(h)) bad.push('👤 Tôi chưa tách cấp bỏ qua / còn đếm thẻ bỏ qua'); }
    S.real = { a1: [{ at: now, l: 25, L: 25, rw: 40, RW: 40 }] }; await tryA('Tôi có đề mẫu', () => minhView()); if (typeof realOk === 'function' && !H().includes('Đạt bằng đề mẫu chính thức')) bad.push('có kết quả đề mẫu mà không hiện');
    S = blank();
    add('cefr', 'C51', !bad.length && !errs.length, [...errs, ...bad].length ? [...errs, ...bad].slice(0, 8).join(' | ') : 'tên bài như danh sách, màn xong bài lời thường + nút học bài kế tiếp, thẻ đầu không chữ nội bộ, 👤 Tôi tách cấp bỏ qua theo kiểm tra và chỉ đếm thẻ học trong app'); }
  // v136 gọt chỗ trùng (docs/KIEM-KE-CHUC-NANG.md): công cụ người sáng lập gom ở 💾 Dữ liệu → 🛠; Tra cứu bỏ thẻ Cẩm nang; ngày 10 chỉ xem tổng kết;
  //   ôn chung có từ công sở TOEIC khi mục tiêu TOEIC; bản đồ chỉ hiện Nền + kỳ thi mục tiêu / đã luyện; 👤 Tôi không có hộp rỗng; đọc thêm một chỗ ở Thư viện
  { const bad = [], errs = [], tryv = (n, f) => { try { f(); } catch (e) { errs.push(n + ': ' + e.message); } }, tryA = async (n, f) => { try { await f(); } catch (e) { errs.push(n + ': ' + e.message); } }, H = () => String($app.innerHTML), now = Date.now(), t = dayOf(now);
    await Promise.all([ieLoad(), toLoad(), cbMapLoad(), paLoad(), libLoad(), ...Object.values(KIT).map(kLoad)]);
    const u0 = user; user = { id: 'chung', email: AUTO.email }; S = blank();
    tryv('dữ liệu', () => backup()); let h = H(); const ti = h.indexOf('🛠 Công cụ người sáng lập');
    if (ti < 0 || ['data-g="admin"', 'data-bk="miss"', 'data-bk="paval"', 'data-bk="kiem"', 'data-bk="edit"', 'data-bk="set"'].some(k => h.indexOf(k) < ti)) bad.push('công cụ người sáng lập chưa gom vào 🛠 (gập, cuối màn Dữ liệu)');
    if (!h.includes('data-bk="down"') || !h.includes('data-bk="paste"') || h.indexOf('data-bk="down"') > ti) bad.push('sao lưu của người học phải ở trên, ngoài 🛠');
    if (/data-g="admin"/.test(gyHomeInner())) bad.push('khối Góp ý còn nút quản lý');
    await tryA('Tôi rỗng', () => minhView()); h = H(); if (/Sổ lỗi của tôi|Kết quả thi thật|data-errp/.test(h) || !h.includes('📌 Sổ từ') || !h.includes('data-mapv="lt"') || !h.includes('data-hdv') || !h.includes('data-ct="data"')) bad.push('👤 Tôi người mới: còn hộp rỗng (sổ lỗi / thi thật) hoặc thiếu lối chính');
    tryv('Tra cứu', () => dict()); if (String(document.getElementById('dl').innerHTML).includes('Cẩm nang')) bad.push('Tra cứu còn Cẩm nang');
    // ngày 10: xem tổng kết, không làm bài kiểm tra
    S.lt = { goal: { kind: 'cefr', lv: 'b1', at: now }, d: [{ n: 1, d0: t - 9, sel: [], pass: [] }], fx: {} }; let tb = todayBox(ovStage(), { lt: 1 });
    if (!tb.includes('Xem tổng kết 10 ngày') || /kiểm tra 10 ngày/i.test(tb) || typeof ltMini !== 'undefined') bad.push('ngày 10 còn bài kiểm tra cuối đợt');
    tryv('tổng kết', () => ltCheck()); if (!H().includes('Tổng kết đợt 1') || ltSt().d.length !== 2 || CUR.view === 'lt-kiem-tra') bad.push('ngày 10 phải vào thẳng tổng kết và mở đợt 2');
    if (HD.map(x => x[2]()).join(' ').includes('Kiểm tra cuối đợt</b> (ngày')) bad.push('Luật còn mô tả kiểm tra cuối đợt');
    // ôn chung: từ công sở TOEIC chỉ khi mục tiêu là TOEIC
    S.to = { voc: { [TO.voc[0].w[0][0]]: { box: 1, due: now - 1 } } }; if (revCount(now).to) bad.push('mục tiêu không phải TOEIC mà ôn chung có từ công sở');
    ltSt().goal = { kind: 'toeic', at: now }; S.to.goal = 700; const R = revCount(now); if (R.to !== 1 || R.n < 1) bad.push('mục tiêu TOEIC: ôn chung thiếu từ công sở: ' + JSON.stringify(R));
    if (!todayBox(ovStage(), { lt: 1 }).includes('1 từ công sở')) bad.push('ô Hôm nay chưa ghi từ công sở cần ôn');
    // bản đồ: Nền + mục tiêu ở hàng chọn; kỳ thi khác gập
    MAP_BACK = 'lt'; MAP_TAB = null; ltSt().goal = { kind: 'ielts', lv: 'b2p', at: now }; S.ie = { set: { t: 'ac', band: 6.5 } }; delete S.to;
    await tryA('bản đồ', () => mapView('nen')); h = H(); const dI = h.indexOf('Bản đồ kỳ thi khác');
    if (dI < 0 || h.indexOf('data-mtab="ielts"') > dI || h.indexOf('data-mtab="cb"') < dI || h.indexOf('data-mtab="toeic"') < dI || h.includes('Chưa có dữ liệu học.</b>')) bad.push('bản đồ: hàng chọn phải là Nền + IELTS, Cambridge / TOEIC gập; không còn ô "Chưa có dữ liệu" riêng');
    S.to = { ty: { 'p5:prep': [[now, 1, 4]] } }; await tryA('bản đồ có TOEIC', () => mapView('nen')); h = H(); if (h.indexOf('data-mtab="toeic"') > h.indexOf('Bản đồ kỳ thi khác')) bad.push('kỳ thi đã luyện phải ở hàng chọn');
    MAP_TAB = null;
    // đọc thêm một chỗ
    await tryA('thư viện', () => libView('a2')); if (!H().includes('data-ext="a2|doc"')) bad.push('Thư viện thiếu ghi giờ đọc / nghe ngoài app');
    await tryA('Cambridge', () => cbView('a2')); if (H().includes('data-ext=') || !H().includes('data-lib="a2"')) bad.push('Cambridge phải trỏ sang Thư viện, không ghi giờ riêng');
    user = u0; S = blank();
    add('cefr', 'C52', !bad.length && !errs.length, [...errs, ...bad].length ? [...errs, ...bad].slice(0, 8).join(' | ') : 'gọt chỗ trùng: công cụ người sáng lập gom ở 🛠, bỏ Cẩm nang ở Tra cứu, ngày 10 chỉ xem tổng kết, ôn chung có từ công sở TOEIC, bản đồ gọn hàng chọn, 👤 Tôi không hộp rỗng, đọc thêm ở Thư viện'); }
  // v137 (người sáng lập: "khi tôi học từ vựng thì phần bài tập thiếu dạng bài tự gõ"): làm thử của bài học có ✍️ tự gõ từ; học xong bài thì 🏋️ Bài tập
  //   có câu tự gõ ngay (trước: cần đúng cả 3 mặt bậc 1 ở bài tập); chỉ đổi thứ tự hỏi, bài học vẫn không chấm, vStage vẫn là bậc thật
  { const bad = [], errs = [], now = Date.now(); S = blank();
    try { const u = UNITS.find(x => x.lv === 'pre'), wb = levelWords('b1')[0];
      for (const [w, L] of [[u.words[0], 'pre'], [levelWords('a1').find(x => x.cloze), 'a1'], [wb, 'b1']]) { const t = lessonTypes(w, reqsUpTo(L)).join();
        if (t !== 'w2vi,listen,spell') bad.push('làm thử bài học ' + L + ' không phải chọn nghĩa · nghe · tự gõ: ' + t); }
      for (const w of u.words) S.cards[w.id] = { S: 1, last: now, d0: dayOf(now), ok: 1, pv: 0, n: 0, lapse: 0 };   // thẻ có, chưa học bài, chưa làm bài tập
      const draw = () => { let ty = 0, n = 0; const seen = new Set(); for (let i = 0; i < 30; i++) for (const w of u.words) { const t = typeFor(S.cards[w.id], now, w); seen.add(t); n++; if (question(w, t).typed) ty++; } return { r: ty / n, seen }; };
      let d = draw(); if (d.r > 0) bad.push('chưa học bài, chưa đúng nghĩa mà đã hỏi câu gõ: ' + [...d.seen].join(','));
      learnCards(S, u, now); if (!S.units[u.id]) bad.push('học xong bài không ghi bài');
      d = draw(); if (!d.seen.has('spell') || d.r < 0.15 || d.r > 0.6) bad.push('học xong bài: tỉ lệ câu tự gõ ' + Math.round(d.r * 100) + '% (' + [...d.seen].join(',') + ')');
      if (u.words.some(w => vStage(S.cards[w.id], w, 'pre') !== 0)) bad.push('bậc hiển thị đổi dù chưa vững bậc 1');
      delete S.units[u.id]; const c = S.cards[u.words[0].id]; c.dm = { nghia: { ok: 1, n: 1 } };
      const s1 = new Set(); for (let i = 0; i < 60; i++) s1.add(typeFor(c, now, u.words[0])); if (!s1.has('spell')) bad.push('đúng nghĩa ở bài tập mà chưa mở câu gõ');
      c.dm.nghia.ok = 0; const s0 = new Set(); for (let i = 0; i < 60; i++) s0.add(typeFor(c, now, u.words[0])); if ([...s0].some(t => !['w2vi', 'listen', 'form'].includes(t))) bad.push('sai nghĩa lần gần nhất mà vẫn hỏi bậc trên: ' + [...s0].join(','));
      if (!HD.map(x => x[2]()).join(' ').includes('tự gõ từ')) bad.push('📘 Luật chưa ghi làm thử có tự gõ từ');
    } catch (e) { errs.push(e.message); }
    S = blank();
    add('cefr', 'C53', !bad.length && !errs.length, [...errs, ...bad].length ? [...errs, ...bad].slice(0, 8).join(' | ') : 'làm thử bài học Từ vựng có tự gõ từ; học xong bài thì bài tập có câu tự gõ ngay; chưa học bài thì vẫn nhận ra trước; bậc hiển thị không đổi'); }
  // v138 (người sáng lập: "mở khoá tất cả bài học mới… để tôi xem nội dung"): bài cấp chưa mở bấm được, 👁 xem trước không tạo thẻ, không làm thử
  { const bad = [], errs = [], H = () => String($app.innerHTML), rowOf = (h, attr) => (h.match(new RegExp('<button class="urow[^"]*" ' + attr + '[^>]*>[\\\\s\\\\S]*?</button>')) || [''])[0]; S = blank();
    try { await Promise.all([paLoad(), ...Object.values(KIT).map(kLoad)]);
      const u = UNITS.find(x => x.lv === 'b1'); if (!locked(u)) bad.push('bài B1 không khoá với người mới');
      HOME.lv = 'b1'; home(); const r0 = rowOf(H(), 'data-un="' + u.id + '"'); if (!r0 || /disabled/.test(r0) || !r0.includes('👁 xem')) bad.push('dòng bài B1 khoá cứng / không ghi xem: ' + r0.slice(0, 120));
      uPreview(u); if (!H().includes('Xem trước') || H().includes('data-a="next"') || u.words.some(w => !H().includes(esc(w.w)))) bad.push('xem trước Từ vựng thiếu từ hoặc còn nút học');
      if (Object.keys(S.cards).length || S.units[u.id]) bad.push('xem trước Từ vựng tạo thẻ'); HOME.lv = null;
      for (const P of Object.values(KIT)) { const L = P.lvs.find(l => kLocked(P, l)); if (!L) continue; const x = kItems(P, L)[0]; if (!x) continue;
        P.view = L; kView(P.id); const r = rowOf(H(), 'data-kx="' + x.id + '"'); if (!r.includes('👁 xem')) bad.push(P.id + ': dòng bài cấp khoá không ghi xem');
        kPreview(P, x, () => {}); if (!H().includes('Xem trước') || H().includes('data-kl="try"') || kSt(P.id).cards[x.id]) bad.push(P.id + ': xem trước hỏng'); P.view = null; }
      const L = PA_LV.find(l => paLocked(l)), x = PA.find(y => y.lv === L); PA_VIEW = L; paView(); if (!rowOf(H(), 'data-paset="' + x.id + '"').includes('👁 xem')) bad.push('Phát âm: dòng bộ cấp khoá không ghi xem');
      paPreview(x); if (!H().includes('Xem trước') || H().includes('data-pl="quiz"') || H().includes('Bài này dạy gì') || !H().includes('data-a="home"') || paSt()[x.id]) bad.push('Phát âm: xem trước hỏng'); PA_VIEW = null;
    } catch (e) { errs.push(e.message); }
    S = blank();
    add('cefr', 'C54', !bad.length && !errs.length, [...errs, ...bad].length ? [...errs, ...bad].slice(0, 8).join(' | ') : 'bài cấp chưa mở bấm được để xem trước (Từ vựng, 5 phần kit, Phát âm); xem trước không làm thử, không tạo thẻ'); }
  // v139 TOEIC đủ dạng câu (specs/001-toeic-du-dang): 33 dạng của đề thật, mỗi dạng một 📘 bài học (ví dụ + 3 câu làm thử ĐÚNG dạng) và 🏋️ bài tập theo dạng (TO_DR);
  //   kho tối thiểu theo dạng (FR-010); câu chèn Part 6 có phương án cùng chủ đề; câu chèn [1]–[4] Part 7 giữ thứ tự; bài tập theo dạng ghi kết quả như luyện theo Part
  { const bad = [], errs = [], tryv = (n, f) => { try { f(); } catch (e) { errs.push(n + ': ' + e.message); } }, tryA = async (n, f) => { try { await f(); } catch (e) { errs.push(n + ': ' + e.message); } }, H = () => String($app.innerHTML);
    await toLoad(); S = blank(); S.to = { target: 650 };
    const LK = 'p1,p1o,p2,p2-yn,p2-or,p2-req,p2-st,p2t,p3,gist,next,imp,g,p4,p4-ty', RK = 'p5-form,p5-verb,p5-prep,p5-conj,p5-pron,p5-det,p5-struct,p5-voc,p6,p6-ins,p7,p7-inf,p7-syn,p7-ins,p7c,p7m,time';
    const L = xlList('toeic', 'L'), Rl = xlList('toeic', 'R'), V = xlList('toeic', 'V');
    if (L.map(d => d.k).join() !== LK || Rl.map(d => d.k).join() !== RK || V.length !== 1) bad.push('bài học TOEIC sai thứ tự / thiếu: ' + L.length + ' + ' + Rl.length + ' + ' + V.length);
    for (const id of ['to:L:p1', 'to:L:p2', 'to:L:p2t', 'to:L:p3', 'to:L:g', 'to:L:imp', 'to:L:p4', 'to:R:p5-form', 'to:R:p6', 'to:R:p7', 'to:R:p7c', 'to:R:p7m', 'to:R:time', 'to:V:voc']) if (![...L, ...Rl, ...V].some(d => d.id === id)) bad.push('mất mã bài học cũ ' + id);
    // ví dụ + làm thử đúng dạng
    const want = { p1: q => q.x.k === 'people', p1o: q => q.x.k === 'scene', p2: q => q.x.ty === 'wh', 'p2-yn': q => q.x.ty === 'yn', 'p2-or': q => q.x.ty === 'or', 'p2-req': q => q.x.ty === 'req', 'p2-st': q => q.x.ty === 'stmt',
      gist: q => q.qt === 'gist', next: q => q.qt === 'next', imp: q => q.qt === 'imp', g: q => q.qt === 'graphic', 'p4-ty': q => q.a === TO_P4TY[q.x.ty], 'p5-det': q => q.x.t === 'det', p6: q => ['tense', 'conn'].includes(q.gt), 'p6-ins': q => q.gt === 'insert',
      p7: q => ['purpose', 'detail'].includes(q.qt), 'p7-inf': q => ['not', 'true', 'infer'].includes(q.qt), 'p7-syn': q => q.qt === 'syn', 'p7-ins': q => q.qt === 'insert', p7c: q => q.qt === 'intent' };
    for (const d of [...L, ...Rl]) { if (d.k === 'time') continue; let qs = []; tryv('bài học ' + d.k, () => { qs = d.qs().filter(Boolean); }); const f = want[d.k];
      if (qs.length < 1 + XL_TRY) bad.push(d.k + ': ví dụ + làm thử chỉ ' + qs.length + ' câu'); if (f && qs.some(q => !f(q))) bad.push(d.k + ': có câu sai dạng'); }
    // mỗi dạng có bài tập riêng: mở từ bài học (go) và từ Thêm của màn kỹ năng
    const DRL = ['p1:people', 'p1:scene', 'p2:wh', 'p2:yn', 'p2:or', 'p2:req', 'p2:stmt', 'q:gist', 'q:next', 'q:imp', 'q:graphic', 't3'], DRR = ['p6:ctx', 'p6:ins', 'q7:infer', 'q7:syn', 'q7:insert', 'q7:intent'];
    if (Object.keys(TO_DR).sort().join() !== [...DRL, ...DRR].sort().join()) bad.push('TO_DR khác danh sách: ' + Object.keys(TO_DR).join());
    const GO = { p1: 'p1:people', p1o: 'p1:scene', p2: 'p2:wh', 'p2-yn': 'p2:yn', 'p2-or': 'p2:or', 'p2-req': 'p2:req', 'p2-st': 'p2:stmt', gist: 'q:gist', next: 'q:next', imp: 'q:imp', g: 'q:graphic', p6: 'p6:ctx', 'p6-ins': 'p6:ins', 'p7-inf': 'q7:infer', 'p7-syn': 'q7:syn', 'p7-ins': 'q7:insert', p7c: 'q7:intent' };
    for (const d of [...L, ...Rl]) { const k = GO[d.k]; if (k ? d.go !== 'data-todr="' + k + '"' : !/data-(top|tospd|tobt)=/.test(d.go || '')) bad.push(d.k + ': nút "Bài tập dạng này" sai ' + d.go); }
    tryv('màn Nghe', () => toSkView('L')); { const h = H(); for (const k of DRL) if (!h.includes('data-todr="' + k + '"')) bad.push('Thêm của Nghe thiếu ' + k); if (!h.includes('🎯 Luyện theo dạng câu') || !h.includes('class="chips tap"')) bad.push('Nghe: thiếu khối luyện theo dạng câu'); }
    tryv('màn Đọc', () => toSkView('R')); { const h = H(); for (const k of DRR) if (!h.includes('data-todr="' + k + '"')) bad.push('Thêm của Đọc thiếu ' + k); if (!h.includes('data-top="t:det"') || h.includes('✏️ Part 5 theo dạng ngữ pháp')) bad.push('Đọc: Part 5 theo dạng chưa gộp vào luyện theo dạng câu'); }
    // bài tập theo dạng: câu lẻ đúng dạng, bài nhiều câu có dạng đó và làm cả bài
    const has = (x, ...t) => x.qs.some(q => t.includes(q.ty)), DCHK = { 'p1:people': x => x.k === 'people', 'p1:scene': x => x.k === 'scene', 'p2:wh': x => x.ty === 'wh', 'p2:yn': x => x.ty === 'yn', 'p2:or': x => x.ty === 'or', 'p2:req': x => x.ty === 'req', 'p2:stmt': x => x.ty === 'stmt',
      'q:gist': x => has(x, 'gist'), 'q:next': x => has(x, 'next'), 'q:imp': x => has(x, 'imp'), 'q:graphic': x => has(x, 'graphic'), t3: x => new Set(x.lines.map(l => l[0])).size > 2, 'p6:ctx': x => x.gaps.some(g => ['tense', 'conn'].includes(g.t)), 'p6:ins': x => x.gaps.some(g => g.t === 'insert'),
      'q7:infer': x => has(x, 'not', 'true', 'infer'), 'q7:syn': x => has(x, 'syn'), 'q7:insert': x => has(x, 'insert'), 'q7:intent': x => has(x, 'intent') };
    const ir0 = ieRun; let cap = null; ieRun = (t, qs, back, min, o) => { cap = { t, qs, back, o }; return ir0(t, qs, back, min, o); };
    for (const k of Object.keys(TO_DR)) { cap = null; tryv('bài tập ' + k, () => toDrill(k)); if (!cap) { bad.push(k + ': không mở được'); continue; } const xs = [...new Set(cap.qs.map(q => q.x))];
      if (xs.some(x => !DCHK[k](x))) bad.push(k + ': có câu / bài sai dạng'); if (/^p[12]:/.test(k) ? cap.qs.length < 5 : xs.length !== 2) bad.push(k + ': số câu / bài sai ' + cap.qs.length);
      if (!/^p[12]:/.test(k) && xs.some(x => cap.qs.filter(q => q.x === x).length !== (x.qs || x.gaps).length)) bad.push(k + ': chưa làm cả bài'); }
    // làm trọn một lượt: ghi kết quả như luyện theo Part (S.to.r + toLog), về màn Nghe
    cap = null; await tryA('làm câu trần thuật', async () => { toDrill('p2:stmt'); const qs = cap.qs; for (const q of qs) { $app.onclick({ target: { closest: s => s === '[data-io]' ? { dataset: { io: String(q.opts.indexOf(q.a)) }, disabled: false } : null } }); $app.onclick({ target: { closest: s => s === '[data-a="next"]' ? {} : null } }); } });
    if (!cap || cap.qs.some(q => !(toSt().r[q.x.id] && toSt().r[q.x.id].ok === 1)) || !((toSt().ty || {}).p2 || []).length) bad.push('bài tập theo dạng chưa ghi kết quả như luyện theo Part');
    tryv('về', () => cap.back()); if (!H().includes('data-tohome') || (window.CUR || {}).sk !== 'L') bad.push('bài tập theo dạng: nút về chưa về màn Nghe');
    ieRun = ir0;
    // kho tối thiểu (FR-010)
    const n = (a, f) => a.filter(f).length, q34 = [...TO.p3, ...TO.p4].flatMap(x => x.qs), q7 = TO.p7.flatMap(x => x.qs.map(q => [x, q])), g6 = TO.p6.flatMap(x => x.gaps), sets7 = t => new Set(q7.filter(([, q]) => q.ty === t).map(([x]) => x.id)).size;
    const MIN = [['Part 1 tranh có người', n(TO.p1, x => x.k === 'people'), 5], ['Part 1 tranh đồ vật', n(TO.p1, x => x.k === 'scene'), 5], ...['wh', 'yn', 'or', 'req'].map(t => ['Part 2 ' + t, n(TO.p2, x => x.ty === t), 7]), ['Part 2 câu trần thuật', n(TO.p2, x => x.ty === 'stmt'), 8],
      ['câu hàm ý Part 3–4', n(q34, q => q.ty === 'imp'), 6], ['câu hàm ý Part 3', n(TO.p3.flatMap(x => x.qs), q => q.ty === 'imp'), 3], ['Part 4 quảng cáo', n(TO.p4, x => x.ty === 'ad'), 2], ['Part 5 lượng từ', n(TO.p5, x => x.t === 'det'), 8],
      ['Part 6 thì theo ngữ cảnh', n(g6, g => g.t === 'tense'), 4], ['Part 6 từ nối', n(g6, g => g.t === 'conn'), 4], ['Part 7 từ gần nghĩa', n(q7, ([, q]) => q.ty === 'syn'), 6], ['Part 7 chèn câu', n(q7, ([, q]) => q.ty === 'insert'), 4], ['Part 7 câu NOT', n(q7, ([, q]) => q.ty === 'not'), 4], ['Part 7 câu ý định', n(q7, ([, q]) => q.ty === 'intent'), 4],
      ...['syn', 'insert', 'not', 'intent'].map(t => ['Part 7 ' + t + ' ở ≥ 3 bộ', sets7(t), 3])];
    for (const [nm, v, m] of MIN) if (v < m) bad.push('kho ' + nm + ': ' + v + ' < ' + m);
    // Part 4: mọi bài có loại bài nói; câu chèn Part 6 cùng chủ đề; câu chèn [1]–[4] giữ thứ tự
    if (TO.p4.some(x => !TO_P4TY[x.ty])) bad.push('Part 4 thiếu nhãn loại bài nói');
    const STW = new Set('about after again also because been before being both could does from have here into just like made make many more most much must only other over said same should since some such than that their them then there these they this those very were what when where which while will with would your yours ours'.split(' ')), cw = s => String(s).toLowerCase().replace(/[^a-z\\s-]/g, ' ').split(/\\s+/).filter(w => w.length >= 4 && !STW.has(w)).map(w => w.replace(/(ies|es|s|ed|ing)$/, ''));
    for (const x of TO.p6) { const ins = x.gaps.filter(g => g.t === 'insert'), tw = new Set(cw(x.title + ' ' + x.text)); if (ins.length !== 1) bad.push(x.id + ': cần đúng 1 câu chèn');
      for (const g of ins) for (const s of g.o.filter(s => s !== g.a)) if (!cw(s).some(w => tw.has(w))) bad.push(x.id + ': phương án câu chèn lạc đề: ' + s); }
    if (/Water boils|wedding gifts|Swimming is a popular sport/.test(JSON.stringify(TO.p6))) bad.push('Part 6 còn phương án lạc đề cũ');
    for (const [x, q] of q7.filter(([, q]) => q.ty === 'insert')) { const qq = toP7Qs(x).find(z => z.qt === 'insert'); if (qq.opts.join() !== '[1],[2],[3],[4]') bad.push(x.id + ': phương án [1]–[4] bị xáo'); }
    // giọng: mọi câu nghe mới có tệp (n/)
    const NC = new Set(await (await fetch('n/index.json')).json()), miss = [...TO.p2.filter(x => +x.id.slice(3) > 50).flatMap(x => x.lines.map(l => l[1])), ...TO.p3.filter(x => +x.id.slice(3) > 25).flatMap(x => x.lines.map(l => l[1])), ...TO.p4.filter(x => +x.id.slice(3) > 25).flatMap(x => kSents(x.text))].filter(t => !NC.has(clipKey(t)));
    if (miss.length) bad.push('câu nghe mới thiếu giọng: ' + miss.length + ' (' + miss[0] + ')');
    // bản đồ, cẩm nang có dạng lượng từ
    if (!tmRows()[1][1].includes('p5:det') || tmShort('p5:det') !== 'P5 · Lượng từ') bad.push('bản đồ điểm thiếu ô Part 5 lượng từ'); tryv('mẹo lượng từ', () => { if (!tmTipHtml('p5:det').includes('each / every')) bad.push('thiếu mẹo chữa lượng từ'); });
    DICT.ex = 'toeic'; if (!tcSkill('doc', '').includes('Từ hạn định, lượng từ')) bad.push('cẩm nang thiếu Part 5 lượng từ');
    S = blank();
    add('toeic', 'C55', !bad.length && !errs.length, [...errs, ...bad].length ? [...errs, ...bad].slice(0, 8).join(' | ') : 'TOEIC đủ dạng câu: ' + (L.length + Rl.length + V.length) + ' bài học theo thứ tự đề (ví dụ + làm thử đúng dạng), ' + Object.keys(TO_DR).length + ' bài tập theo dạng (câu lẻ đúng dạng, bài nhiều câu làm cả bài, ghi kết quả như luyện), kho tối thiểu mọi dạng, câu chèn Part 6 cùng chủ đề, [1]–[4] giữ thứ tự, giọng câu nghe mới đủ'); }
  // v140 IELTS đủ dạng (specs/002-ielts-du-dang): 48 dạng (Đọc 16, Nghe 6, Viết 17, Nói 9) có 📘 bài học (ví dụ + 3 câu làm thử ĐÚNG dạng; Quản lý giờ Đọc chỉ có nội dung)
  //   và 🏋️ bài tập đúng dạng; nhãn vai trò bài mẫu Task 2; tiêu chí yếu thành bài học kế tiếp; nhóm thẻ Part 2 / kiểu câu hỏi Part 3 phủ hết kho; bản đồ band chữa Nghe đúng phần; kho tối thiểu
  { const bad = [], errs = [], tryv = (n, f) => { try { f(); } catch (e) { errs.push(n + ': ' + e.message); } }, tryA = async (n, f) => { try { await f(); } catch (e) { errs.push(n + ': ' + e.message); } }, H = () => String($app.innerHTML);
    await ieLoad(); await Promise.all([kLoad(KIT.nghe), kLoad(KIT.doc), kLoad(KIT.np)]);
    const WANT = { ac: { R: 'para,tf,yn,h,mi,mf,se,mc,mc2,comp,sum,rtab,dia,sa,time', L: 'form,sent,mc,mc2,map,match', W: 'w1-trend,w1-comp,w1-map,w1-proc,w1-mixed,w2-type,w2-op,w2-dis,w2-ad,w2-ps,w2-tq,w2-struct,wc-tr,wc-cc,wc-lr,wc-gr', S: 'p1,p2,p2-cat,p3,p3-q,sc-fc,sc-lr,sc-gr,sc-pr' },
      gt: { R: 'para,gt,tf,yn,h,mi,mf,se,mc,mc2,comp,sum,rtab,dia,sa,time', W: 'w1-gt,w2-type,w2-op,w2-dis,w2-ad,w2-ps,w2-tq,w2-struct,wc-tr,wc-cc,wc-lr,wc-gr' } };
    const all = new Set(), ids = new Set();
    for (const type of ['ac', 'gt']) { S = blank(); S.ie = { set: 1, type, target: 6.5 };
      for (const sk of ['R', 'L', 'W', 'S']) { const L = xlList('ielts', sk); if (L.map(d => d.k).join() !== (WANT[type][sk] || WANT.ac[sk])) bad.push(type + ' ' + sk + ': danh sách bài học ' + L.map(d => d.k).join());
        for (const d of L) { all.add(sk + ':' + d.k); ids.add(d.id); if (d.k === 'time') continue; let qs = [], tq = [], ex = null;
          tryv(type + ' ' + d.id, () => { if (d.qs) { qs = d.qs().filter(Boolean); ex = qs[0]; tq = qs.slice(1); } else { const r = d.w(); ex = r && r.html; tq = (r && r.tq) || []; } });
          if (!ex || tq.length !== XL_TRY) bad.push(type + ' ' + d.id + ': ví dụ / làm thử thiếu (' + tq.length + ')');
          if (sk === 'R' && qs.some(q => q.ty !== d.u)) bad.push(d.id + ': câu sai dạng');
          if (sk === 'L' && qs.some(q => !d.ks.includes(String(q.k).replace(/^ln-/, '')))) bad.push(d.id + ': câu sai dạng');
          if (!d.go) bad.push(d.id + ': thiếu bài tập dạng này'); } } }
    if (all.size !== 48) bad.push('số dạng có bài học ' + all.size + ' ≠ 48');
    for (const id of ['ie:R:para', 'ie:R:gt', 'ie:R:tf', 'ie:R:time', 'ie:L:form', 'ie:L:map', 'ie:W:w1-trend', 'ie:W:w1-gt', 'ie:W:w2-type', 'ie:W:w2-struct', 'ie:S:p1', 'ie:S:p2', 'ie:S:p3']) if (!ids.has(id)) bad.push('mất mã bài học cũ ' + id);
    S = blank(); S.ie = { set: 1, type: 'ac', target: 6.5 }; const W = xlList('ielts', 'W'), Sx = xlList('ielts', 'S'), L6 = xlList('ielts', 'L');
    // Nghe: bài tập dạng này = một phần có dạng đó; Viết Task 1 theo loại; Task 2 theo kiểu
    for (const d of L6) if (d.go !== 'data-ielk="' + d.k + '"') bad.push(d.id + ': bài tập dạng này ' + d.go);
    for (const d of W.filter(z => z.kinds)) if (d.go !== 'data-iew="t1:' + d.kinds.join(',') + '"') bad.push(d.id + ': bài tập dạng này ' + d.go);
    // Task 2 theo kiểu: ví dụ = bài mẫu cuối của kiểu, đoạn có nhãn vai trò; làm thử = vai trò đoạn của bài mẫu khác cùng kiểu
    for (const [k, ty] of [['w2-op', 'opinion'], ['w2-dis', 'discuss'], ['w2-ad', 'advdis'], ['w2-ps', 'probsol'], ['w2-tq', 'twopart']]) { const d = W.find(z => z.k === k); if (!d) continue; let r = null; tryv(k, () => { r = d.w(); });
      const ex = IE.t2.filter(x => x.type === ty).pop(); if (!r || !ex || !ex.roles.every(x => r.html.includes(esc(x))) || !r.html.includes('Kiểu đề: ' + esc(XL_TXT.t2[ty][0]))) bad.push(k + ': ví dụ chưa là bài mẫu đúng kiểu có nhãn vai trò');
      if (!r || r.tq.length !== XL_TRY || new Set(r.tq.map(q => q.a)).size !== XL_TRY || r.tq.some(q => q.x.type !== ty || q.x === ex || !IE.t2roles[ty].includes(q.a) || q.opts.length < 3 || new Set(q.opts).size !== q.opts.length || q.opts.some(o => !IE.t2roles[ty].includes(o)))) bad.push(k + ': làm thử nhận vai trò đoạn sai');
      if (d.go !== 'data-iew="t2:' + ty + '"') bad.push(k + ': bài tập dạng này ' + d.go); }
    for (const x of IE.t2) if (!x.roles || x.roles.length !== xlParas2(x.m).length || x.roles.some(r => !(IE.t2roles[x.type] || []).includes(r))) bad.push(x.id + ': nhãn vai trò sai');
    for (const ty of Object.keys(XL_TXT.t2)) if (IE.t2.filter(x => x.type === ty).length < 2) bad.push('kiểu ' + ty + ' cần ≥ 2 bài mẫu');
    // 8 bài tiêu chí: nối ô bản đồ, ví dụ band thấp / cao, 3 câu làm thử; tiêu chí yếu thành bài học kế tiếp
    const CR = { W: ['wc-tr', 'wc-cc', 'wc-lr', 'wc-gr'], S: ['sc-fc', 'sc-lr', 'sc-gr', 'sc-pr'] };
    for (const sk of ['W', 'S']) CR[sk].forEach((k, i) => { const d = (sk === 'W' ? W : Sx).find(z => z.k === k); if (!d) return; let r = null; tryv(k, () => { r = d.w(); });
      if (d.u !== sk + ':' + i || !r || !r.html.includes('Band thấp') || !r.html.includes('Band cao') || r.tq.length !== 3 || r.tq.some(q => !q.opts.includes(q.a) || q.opts.length < 2)) bad.push(k + ': bài tiêu chí hỏng');
      if (d.go !== (sk === 'W' ? 'data-iew="t2"' : 'data-ies="all"')) bad.push(k + ': bài tập dạng này ' + d.go); });
    { const o = ieSt(); o.cr = [{ at: Date.now() - 864e5, k: 'W', src: 'ai', c: [7, 4.5, 7, 7] }]; const b = xlBlock('ielts', 'W'), j = b.L.findIndex(d => d.k === 'wc-cc');
      if (imCell('W:1').s !== 'yeu' || b.at !== j || !b.learn.attr.includes('|' + j + '"') || !b.rows[j].includes('học tiếp')) bad.push('tiêu chí yếu chưa thành bài học kế tiếp'); o.cr = []; }
    // nhóm thẻ Part 2, kiểu câu hỏi Part 3: phủ hết kho, câu mẫu đúng, làm thử nhận đúng nhóm / kiểu
    const c2 = new Set(IE.p2.map(c => ieP2Cat(c.t))), c3 = new Set(IE.p2.flatMap(c => c.p3.map(q => ieP3Ty(q[0]))));
    if (c2.has(null) || c2.size !== Object.keys(IE_P2CAT).length) bad.push('nhóm thẻ Part 2 chưa phủ hết: ' + [...c2].join());
    if (c3.size !== Object.keys(IE_P3TY).length) bad.push('kiểu câu hỏi Part 3 chưa đủ: ' + [...c3].join());
    if (ieP3Ty('Should films be used to teach history?') !== 'yk' || ieP3Ty('Do people read less than they used to?') !== 'xn' || ieP3Ty('Will online learning replace schools?') !== 'tl' || ieP2Cat('Describe a time when someone gave you good advice.') !== 'su') bad.push('nhận nhóm / kiểu sai ở câu mẫu');
    for (const k of ['p2-cat', 'p3-q']) { const d = Sx.find(z => z.k === k), G = k === 'p2-cat' ? IE_P2CAT : IE_P3TY, lab = g => G[g][0] + ' ' + G[g][1], labs = Object.keys(G).map(lab); let r = null; tryv(k, () => { r = d.w(); });
      if (!r || r.tq.length !== XL_TRY || new Set(r.tq.map(q => q.a)).size !== XL_TRY || r.tq.some(q => !labs.includes(q.a) || q.opts.some(o => !labs.includes(o)))) bad.push(k + ': làm thử hỏng');
      if (k === 'p2-cat' && r && r.tq.some(q => lab(ieP2Cat((IE.p2.find(c => 'xl:' + c.id === q.x.id) || {}).t)) !== q.a)) bad.push('p2-cat: đáp án không khớp nhóm của thẻ');
      if (d.go !== (k === 'p2-cat' ? 'data-ies="p2"' : 'data-ies="p3"')) bad.push(k + ': bài tập dạng này ' + d.go); }
    // bài tập theo dạng: Nghe 6 nút mở một phần có dạng đó (làm cả phần); Viết theo loại / kiểu mở đúng đề; GT không có hàng Task 1 theo loại
    const ir0 = ieRun; let cap = null; ieRun = (t, qs, back, min, o) => { cap = { t, qs, back, o }; };
    tryv('màn Nghe', () => ieSkView('L')); { const h = H(); for (const g of Object.keys(IE_LK)) if (!h.includes('data-ielk="' + g + '"')) bad.push('Thêm của Nghe thiếu ' + g); }
    for (const g of Object.keys(IE_LK)) { cap = null; tryv('nghe ' + g, () => ieClick({ target: { closest: s => s === '[data-ielk]' ? { dataset: { ielk: g } } : null } }));
      const xs = cap ? [...new Set(cap.qs.map(q => q.x))] : []; if (xs.length !== 1 || !xs[0].qs.some(q => IE_LK[g].includes(q.k)) || cap.qs.length !== ieLnQs(xs[0]).length) bad.push('bài tập nghe ' + g + ' chưa mở đúng phần'); }
    tryv('màn Viết', () => ieSkView('W')); { const h = H(); for (const k of [...IE_T1K.map(z => 't1:' + z[0]), ...Object.keys(XL_TXT.t2).map(t => 't2:' + t)]) if (!h.includes('data-iew="' + k + '"')) bad.push('Thêm của Viết thiếu ' + k); if (!h.includes('class="chips tap"')) bad.push('Viết: nút theo loại / kiểu chưa đủ vùng bấm'); }
    for (const v of [...IE_T1K.map(z => 't1:' + z[0]), ...Object.keys(XL_TXT.t2).map(t => 't2:' + t)]) { window.CUR = { view: 'ielts', sk: 'W' }; tryv('viết ' + v, () => ieClick({ target: { closest: s => s === '[data-iew]' ? { dataset: { iew: v } } : null } }));
      const [task, f] = v.split(':'), x = (task === 't2' ? IE.t2 : IE.t1).find(z => z.id === (window.CUR || {}).item); if (!x || !f.split(',').includes(task === 't2' ? x.type : x.kind)) bad.push('bài tập viết ' + v + ' mở sai đề'); }
    S.ie.type = 'gt'; tryv('màn Viết GT', () => ieSkView('W')); if (H().includes('data-iew="t1:') || !H().includes('data-iew="t2:probsol"')) bad.push('Viết GT: hàng Task 1 theo loại chỉ dành cho Academic'); S.ie.type = 'ac';
    // bản đồ band: chữa Nghe bản đồ / ghép / trả lời ngắn bằng đúng phần có dạng đó, làm cả phần (trước: chọn theo Part, trả lời ngắn không bao giờ trúng)
    for (const u of ['L-map', 'L-match', 'L-sa']) { cap = null; await tryA('chữa ' + u, () => imFix(u)); const xs = cap ? [...new Set(cap.qs.map(q => q.x))] : [];
      if (xs.length !== 1 || !xs[0].qs.some(q => IE_LTY[q.k] === u) || cap.qs.length !== ieLnQs(xs[0]).length) bad.push('bản đồ chữa ' + u + ' chưa đúng phần'); }
    ieRun = ir0;
    // kho tối thiểu: ≥ 2 phần nghe có bản đồ / mặt bằng (phần mới: 5 câu mặt bằng, chữ A–H); ≥ 2 bài đọc 750–900 từ, ≥ 13 câu, ≥ 3 dạng; giọng phần nghe mới đủ
    const plan = IE.ln.find(x => x.id === 'il-p2-plan');
    if (IE.ln.filter(x => x.qs.some(q => q.k === 'map')).length < 2 || !plan || plan.part !== 2 || plan.qs.filter(q => q.k === 'map').length !== 5 || plan.map.items.filter(i => /^[A-H]$/.test(i.t)).length !== 8) bad.push('kho: phần nghe mặt bằng chưa đủ');
    const long = IE.doc.filter(x => !x.gt && (n => n >= 750 && n <= 900)(kWords(x.paras.join(' ')).length));
    if (long.length < 2 || long.some(x => ieRQs(x).length < 13 || new Set(ieRQs(x).map(q => q.ty)).size < 3)) bad.push('kho: cần ≥ 2 bài đọc 750–900 từ, ≥ 13 câu, ≥ 3 dạng (có ' + long.length + ')');
    if (plan) { const NC = new Set(await (await fetch('n/index.json')).json()), miss = kSents(plan.text).filter(t => !NC.has(clipKey(t))); if (miss.length) bad.push('phần nghe mặt bằng thiếu giọng: ' + miss.length + ' (' + miss[0] + ')'); }
    S = blank();
    add('ielts', 'C56', !bad.length && !errs.length, [...errs, ...bad].length ? [...errs, ...bad].slice(0, 8).join(' | ') : 'IELTS đủ dạng: 48 dạng có bài học (ví dụ + 3 câu làm thử đúng dạng) và bài tập đúng dạng (Nghe 6 dạng làm cả phần, Viết theo loại / kiểu đề), 5 kiểu Task 2 có nhãn vai trò, 8 tiêu chí nối bản đồ, nhóm thẻ Part 2 / kiểu câu hỏi Part 3 phủ hết kho, bản đồ chữa Nghe đúng phần, kho tối thiểu, giọng đủ'); }
  // v143 Cambridge đủ dạng (specs/005-cambridge-du-dang): Viết theo thể loại B1 → C2 (bài học + bài tập), tiêu chí Viết / Nói, thảo luận cặp đúng đề thật (bài học + đề thử, tên phần A2 / C2),
  //   đọc tin ngắn A2 / B1 (bài học, bài tập theo bộ, đề thử), đề thi truyện B1 không trùng đề học; mã bài cũ giữ
  { const bad = [], errs = [], tryv = (n, f) => { try { f(); } catch (e) { errs.push(n + ': ' + e.message); } }, H = () => String($app.innerHTML), T = XL_TXT.cb;
    await Promise.all([loadEB(), ...Object.values(KIT).map(kLoad), uLoad(), capLoad()]); S = blank();
    const pOf = (lv, re) => MOCK[lv].papers.findIndex(p => re.test(p.t)), V = KIT.viet.items;
    // 1. thể loại Viết: đúng danh sách theo cấp, ví dụ đúng thể loại + bố cục, 3 câu làm thử, nút bài tập đúng thể loại
    const dc0 = cbDo; let got = null; cbDo = (lv, pi, b) => { got = b; };
    for (const lv of ['b1', 'b2', 'c1', 'c2']) { const pi = pOf(lv, /Viết/), L = xlList('cambridge', lv + '~' + pi), G = L.filter(d => /^the-/.test(d.k));
      if (G.map(d => d.k.slice(4)).join() !== T.theLv[lv].join()) bad.push(lv + ': thể loại Viết ' + G.map(d => d.k).join());
      for (const d of G) { const g = d.k.slice(4), its = V.filter(x => x.lv === lv && cbGenre(x) === g), ex = its[its.length - 1]; let r = null; tryv(lv + ' ' + d.k, () => { r = d.w(); });
        if (!r || !ex || !r.html.includes(esc(ex.p)) || !r.html.includes('Bố cục thường gặp')) bad.push(lv + ' ' + d.k + ': ví dụ chưa đúng thể loại');
        if (!r || r.tq.length !== XL_TRY || r.tq.some(q => !q.opts.includes(q.a) || new Set(q.opts).size !== q.opts.length) || (r.tq[0].q === 'Đề này thuộc thể loại nào?' && r.tq[0].a !== T.the[cbGenre(r.tq[0].x)].n)) bad.push(lv + ' ' + d.k + ': làm thử hỏng');
        if (d.go !== 'data-cbx="genre|' + lv + '|' + pi + '|' + g + '"') bad.push(lv + ' ' + d.k + ': bài tập dạng này ' + d.go);
        got = null; tryv('genre ' + g, () => cbClick({ target: { closest: s => s === '[data-cbx]' ? { dataset: { cbx: 'genre|' + lv + '|' + pi + '|' + g } } : null } }));
        if (!got || got.kind !== 'kit' || cbGenre(got.x) !== g || got.x.lv !== lv) bad.push(lv + ' ' + g + ': nút bài tập không mở đúng thể loại'); }
      tryv('màn Viết ' + lv, () => cbSkView(lv, pi)); { const h = H(); for (const g of T.theLv[lv]) if (!h.includes('data-cbx="genre|' + lv + '|' + pi + '|' + g + '"')) bad.push(lv + ': Thêm thiếu nút ' + g); if (!h.includes('class="chips tap"')) bad.push(lv + ': nút thể loại chưa đủ vùng bấm'); } }
    cbDo = dc0;
    if (V.filter(x => /^b1-w[26]$/.test(x.id)).some(x => x.id === 'b1-w6' && /bus/i.test(x.p))) bad.push('đề thi truyện B1 vẫn trùng đề học');
    // 2. tiêu chí: Viết B1 → C2, Nói A2 → C2; ví dụ mức thấp / cao + 3 câu
    for (const [lvs, re, n] of [[['b1', 'b2', 'c1', 'c2'], /Viết/, 'Viết'], [['a2', 'b1', 'b2', 'c1', 'c2'], /Nói/, 'Nói']]) for (const lv of lvs) { const L = xlList('cambridge', lv + '~' + pOf(lv, re)), C4 = L.filter(d => /^tc\\d$/.test(d.k));
      if (C4.length !== 4) bad.push(lv + ' ' + n + ': ' + C4.length + ' bài tiêu chí'); for (const d of C4) { let r = null; tryv(lv + ' ' + d.k, () => { r = d.w(); }); if (!r || !r.html.includes('Mức thấp') || !r.html.includes('Mức cao') || r.tq.length !== 3) bad.push(lv + ' ' + n + ' ' + d.k + ': bài tiêu chí hỏng'); } }
    // 3. Nói: thứ tự / tên phần đúng đề thật; bài thảo luận cặp dùng nhiệm vụ 👥 nói cặp; không còn đóng vai
    const WANTS = { a2: 'noi1,talk,rp,noi4,eit', b1: 'noi1,eit,photo,rp,noi4', b2: 'noi1,eit,photo,rp,noi4', c1: 'noi1,eit,photo,rp,noi4', c2: 'noi1,eit,rp,talk,noi4' };
    for (const lv of Object.keys(WANTS)) { const L = xlList('cambridge', lv + '~' + pOf(lv, /Nói/)), sp = L.filter(d => d.sp), rp = sp.find(d => d.k === 'rp');
      if (sp.map(d => d.k).join() !== WANTS[lv]) bad.push(lv + ': thứ tự bài Nói ' + sp.map(d => d.k).join());
      if (!rp || rp.t !== (['a2', 'c2'].includes(lv) ? 'Phần 2: thảo luận cặp' : 'Phần 3: thảo luận cặp')) bad.push(lv + ': tên phần thảo luận cặp ' + (rp && rp.t));
      if (/đóng vai/.test(JSON.stringify(sp.map(d => [d.t, d.what, d.how, d.trap])))) bad.push(lv + ': bài học Nói còn đóng vai');
      let r = null; tryv(lv + ' rp', () => { r = xlCbSpk(rp); }); const t0 = CAP.tasks.find(t => t.lv === lv);
      if (!r || !t0 || !r.html.includes(esc(t0.q)) || r.tq.length !== 3 || r.tq.some(q => !q.opts.includes(q.a))) bad.push(lv + ': ví dụ / làm thử thảo luận cặp hỏng'); }
    if (xlList('cambridge', 'c2~' + pOf('c2', /Nói/)).find(d => d.k === 'talk').t !== 'Phần 3: nói dài' || xlList('cambridge', 'a2~' + pOf('a2', /Nói/)).find(d => d.k === 'noi4').t !== 'Phần 2 (tiếp): câu hỏi thêm') bad.push('tên phần Nói A2 / C2 chưa theo đề thật');
    // 4. đề thử Nói A2 → C2: phần thảo luận cặp (mode cap, 4 lượt, lượt cuối chốt), không còn đóng vai; chấm Tương tác bằng dấu hiệu đáp lời / lý do / hỏi lại / chốt
    for (const lv of ['a2', 'b1', 'b2', 'c1', 'c2']) { MK = { lv, C: MOCK[lv] }; let qs = []; tryv('mkSpeak ' + lv, () => { qs = mkSpeak(); }); const cq = qs.filter(q => q.q.mode === 'cap'), parts = [...new Set(qs.map(q => q.part))];
      if (cq.length !== 4 || !cq[3].q.last || qs.some(q => q.q.mode === 'rp') || !cq.every(q => /thảo luận cặp/.test(q.part))) bad.push(lv + ': đề thử Nói chưa có phần thảo luận cặp đúng');
      if (lv === 'c2' && parts.indexOf('Phần 2: thảo luận cặp') > parts.indexOf('Phần 3: nói dài')) bad.push('C2: thảo luận cặp phải trước nói dài');
      if (lv === 'a2' && (parts.indexOf('Phần 1 (tiếp): kể về bạn') < 0 || parts.indexOf('Phần 2 (tiếp): câu hỏi thêm') < 0)) bad.push('A2: tên phần Nói chưa theo đề thật');
      const good = qs.map(q => ({ ...q, ans: q.q.mode === 'cap' ? (q.q.last ? "I see what you mean, and I'd go for this one, because it is the most useful option for almost everyone in the community and it would not cost very much, so let's choose it together." : "That's a good point, because it really helps people in their daily lives, and I think most families in my city would agree with that idea as well. What do you think about it, though?") : '', secs: 20, lat: 1 })),
        poor = qs.map(q => ({ ...q, ans: q.q.mode === 'cap' ? 'Yes.' : '', secs: 20, lat: 1 })), sg = mkSpeakScore(good, lv), sp = mkSpeakScore(poor, lv);
      if (!(sg.d.rp >= 70) || !(sp.d.rp <= 30)) bad.push(lv + ': chấm Tương tác thảo luận cặp lệch (' + sg.d.rp + ' / ' + sp.d.rp + ')'); }
    // 5. đọc tin ngắn A2 / B1: đề thử phần 1, văn bản ≤ 40 từ, 3 phương án; ≥ 2 bộ mỗi cấp; bài tập theo bộ; bài học riêng
    const SN = dtAll().filter(x => x.k === 'sn');
    for (const [lv, n] of [['a2', 6], ['b1', 5]]) { const pi = pOf(lv, /Đọc/), P = MOCK[lv].papers[pi], sets = SN.filter(x => x.lv === lv);
      if (sets.length < 2 || sets.some(x => x.items.length !== n || x.items.some(it => it.txt.split(/\\s+/).length > 40 || new Set([it.a, ...it.w]).size !== 3))) bad.push(lv + ': kho tin ngắn chưa đủ');
      if (P.parts[0][0] !== 'Phần 1: đọc tin ngắn') bad.push(lv + ': phần 1 Đọc chưa là tin ngắn'); MK = { lv, C: MOCK[lv] }; let qs = []; tryv('sn ' + lv, () => { qs = P.parts[0][1](); });
      if (qs.length !== n || qs.some(q => q.k !== 'sn' || q.opts.length !== 3 || !q.opts.includes(q.a))) bad.push(lv + ': đề thử phần 1 sai dạng (' + qs.length + ')');
      const rows = cbBai(lv, pi).filter(b => b.kind === 'sn'); if (rows.length !== sets.length) bad.push(lv + ': danh sách bài tập thiếu bộ tin ngắn');
      const L = xlList('cambridge', lv + '~' + pi); if (L[0].k !== 'sn' || !L[0].what || L[0].id !== 'cb:' + MOCK[lv].lo + ':' + P.t + ':Phần 1: đọc tin ngắn') bad.push(lv + ': bài học tin ngắn hỏng');
      DT_PIN = sets[1].id; if (dtSet('sn').id !== sets[1].id) bad.push(lv + ': không chọn được đúng bộ tin ngắn'); DT_PIN = null; }
    if (MOCK.a2.papers[0].parts[2][0] !== 'Phần 3: bài đọc dài') bad.push('A2: phần 3 bài đọc chưa tách khỏi phần 1');
    // 6. mã bài cũ còn
    for (const id of ['cb:b1:📖 Đọc:Phần 1: đọc tin ngắn', 'cb:b2:🗣 Nói:rp', 'cb:b2:✍️ Viết:Phần 1–2: bài luận, thư, bài nhận xét']) { const [, lo] = id.split(':'); if (!Object.keys(MOCK).some(lv => MOCK[lv].lo === lo && MOCK[lv].papers.some((p, pi) => xlList('cambridge', lv + '~' + pi).some(d => d.id === id)))) bad.push('mất mã bài học cũ ' + id); }
    MK = null; S = blank();
    add('cambridge', 'C60', !bad.length && !errs.length, [...errs, ...bad].length ? [...errs, ...bad].slice(0, 8).join(' | ') : 'Cambridge đủ dạng: Viết theo thể loại B1 → C2 (17 bài, nút bài tập đúng thể loại), 8 bài tiêu chí, thảo luận cặp đúng đề thật (bài học + đề thử, tên phần A2 / C2, chấm Tương tác bằng dấu hiệu đáp lời / lý do / hỏi lại / chốt), đọc tin ngắn A2 / B1 (2 bộ mỗi cấp, đề thử, bài tập theo bộ), đề thi truyện B1 không trùng, mã bài cũ giữ'); }
  // 💼 TOEIC (toeic.js): màn mở được; mọi Part sinh câu hợp lệ; đề thử ra điểm; quy đổi ước, mốc CEFR, hiệu chỉnh đề thật; từ vựng Leitner; mọi câu nghe / từ có giọng (n/)
  { const bad = [], errs = [], tryv = (n, f) => { try { f(); } catch (e) { errs.push(n + ': ' + e.message); } }; await toLoad(); delete S.to;
    EX_PART = 'san'; await toeicView(); if (!String($app.innerHTML).includes('💼 TOEIC ') || !['L', 'R', 'V'].every(k => String($app.innerHTML).includes('data-tosk="' + k + '"')) || !String($app.innerHTML).includes('data-expart=""') || /data-totg|id="todate"|Nên làm hôm nay/.test(String($app.innerHTML)) || ((x => (x.match(/class="btnbig/g) || []).length !== (/class="btnbig" data-daigo/.test(x) ? 1 : 0))(String($app.innerHTML)))) bad.push('màn TOEIC (v111: chỉ nội dung; v122: như màn Nền, 3 ô; v141: hàng chọn kỳ thi, nút to duy nhất 🤖)');
    for (const k of ['L', 'R', 'V']) { try { toSkView(k); const h = String($app.innerHTML); if (!h.includes('data-tohome') || !h.includes('class="statc"') || !h.includes('data-xl="toeic|' + k + '|') || !h.includes('data-tobt="' + k + '"') || !h.includes('data-tobai="' + k + '|') || (k !== 'V' && !/data-to(p|spd)=/.test(h))) bad.push('màn con TOEIC ' + k + ' thiếu nút / khuôn 3 bước'); } catch (e) { bad.push('màn con TOEIC ' + k + ': ' + e.message); } }
    toSkView('T'); if (!String($app.innerHTML).includes('data-tospd="p5"')) bad.push('⏱ tốc độ (ô cũ) phải về màn Đọc');
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
    const tg = toTagAcc(); if (tg.length !== 8 || tg.reduce((t, x) => t + x.tot, 0) !== TO.p5.length) bad.push('dạng Part 5 sai');   // v139: 8 dạng (thêm det lượng từ)
    const p2 = TO.p2.find(x => x.a !== 0), q2 = toP2Q(p2); if (!/❌/.test(q2.why) || !p2.tr || p2.tr[p2.a] !== null) bad.push('bẫy Part 2 thiếu');
    S.to.trap = {}; toTrapLog([{ q: q2, ok: false, ans: 'A' }]); if (S.to.trap[p2.tr[0]] !== 1) bad.push('đếm bẫy sai: ' + JSON.stringify(S.to.trap));
    S.to.r = { a: { at: 1, ok: 1, n: 10, k: 'p7' }, b: { at: 1, ok: 9, n: 10, k: 'p5' } }; const gn = toGain(); if (gn[0].s !== 'p7' || gn[0].g !== 55 || gn[1].g !== 15) bad.push('tăng điểm sai: ' + JSON.stringify(gn));
    tryv('tốc độ', () => toSpeed('p5')); tryv('tốc độ p7', () => toSpeed('p7')); S.to.date = new Date(Date.now() + 21 * 864e5).toISOString().slice(0, 10); if (!/Còn <b>[34] tuần/.test(toInsights())) bad.push('ngày thi sai');
    S.to.r = {}; for (const x of TO.p5.filter(x => x.t === 'prep')) S.to.r[x.id] = { at: 1, ok: 0, n: 1, k: 'p5' }; for (const x of TO.p5.filter(x => x.t !== 'prep')) S.to.r[x.id] = { at: 1, ok: 1, n: 1, k: 'p5' };
    for (const k of ['p1', 'p2', 'p3', 'p4', 'p6', 'p7']) S.to.r['z' + k] = { at: 1, ok: 5, n: 5, k };   // v127: có Part 1
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
    await toeicView(); if (!String($app.innerHTML).includes('data-mapv="lt" data-mapk="toeic"')) bad.push('màn TOEIC thiếu lối tắt bản đồ điểm'); await mapView('toeic'); MAP_TAB = null; if (!String($app.innerHTML).includes('Bản đồ điểm') || !String($app.innerHTML).includes('Phân tích điểm')) bad.push('🗺 Chỗ yếu thiếu bản đồ điểm');
    add('toeic', 'T2', !bad.length && !errs.length, [...errs, ...bad].length ? [...errs, ...bad].slice(0, 6).join(' | ') : 'bản đồ điểm: dạng / bẫy có mẫu số, ngưỡng theo mục tiêu, nhóm 3 (Nghe ≤ 2, Đọc ≤ 2), chỉ câu mới tính, đạt 2 ngày = xong, tốc độ, kho ≥ 20 bộ'); }
  // v141 🎯 Luyện đề do AI soạn và chấm (deai.js; hàm máy chủ de-ai / el-cham giả ở fake-sb.js, không gọi AI thật)
  { const bad = [], errs = [], tryA = async (n, f) => { try { await f(); } catch (e) { errs.push(n + ': ' + e.message); } }, H = () => String($app.innerHTML), tick0 = () => new Promise(r => setTimeout(r, 0));
    const ans = qs => { for (const q of qs) { if (q.kind === 'mc') $app.onclick({ target: { closest: s => s === '[data-io]' ? { dataset: { io: String(q.opts.indexOf(q.a)) }, disabled: false } : null } }); $app.onclick({ target: { closest: s => s === '[data-a="next"]' ? {} : null } }); } };
    await Promise.all([ieLoad(), toLoad(), cbMapLoad(), ...Object.values(KIT).map(kLoad)]);
    S = blank(); S.lt = { goal: { kind: 'ielts', at: Date.now() }, self: 1 }; S.ie = { set: 1, type: 'ac', target: 6.5 }; FAKE_DAI = null; FAKE_DE_ST = null; FAKE_CALLS = []; DAI.tk = {}; DAI.cur = null; DAI.off = true; DAI.kho = { de: [] };   // v145: C57 thử luồng máy chủ, kho đề soạn sẵn để trống (kho thử ở C62)
    const law = () => JSON.stringify([S.cards, S.units, S.exams]), law0 = law();
    // ① tab thứ 5 ngay sau 📚 Học; 📚 Học không còn luyện thi; tab mở màn kỳ thi của mục tiêu; ô 🤖 một nút chính
    if (!IDX_.includes('<button data-tab="all"><i>📚</i>Học</button><button data-tab="ld"><i>🎯</i>Luyện đề</button>')) bad.push('tab 🎯 Luyện đề không đứng ngay sau 📚 Học');
    if (!String(syncTabs).includes("getElementById('dai') ? 'ld'")) bad.push('syncTabs chưa gắn màn kỳ thi / đề AI vào tab ld');
    await tryA('Học', () => overview()); if (H().includes('data-exsel=') || H().includes('data-ovx=') || !H().includes('data-exthi')) bad.push('📚 Học còn luyện thi');
    EX_PART = null; await tryA('tab Luyện đề', () => exOpen()); if (CUR.view !== 'ielts' || !H().includes('exrow') || (H().match(/class="btnbig/g) || []).length !== 2 || !H().includes('data-expart="san"') || !H().includes('data-expart="ai"') || H().includes('data-daigo=')) bad.push('màn Luyện đề phải có 2 nút 📚 · 🤖 và chưa gọi AI (v142)');
    EX_PART = 'ai'; await tryA('phần 🤖', () => ieltsView()); if ((H().match(/class="btnbig/g) || []).length !== 1 || !H().includes('data-daigo="ielts|') || !H().includes('chưa giáo viên kiểm') || !H().includes('Bài có sẵn · miễn phí') || !H().includes('bài chưa làm')) bad.push('phần 🤖: một nút chính + nhãn AI + nhắc bài có sẵn');
    EX_PART = 'san'; await tryA('phần 📚', () => ieltsView()); if (H().includes('data-daigo=') || !H().includes('data-iesk=')) bad.push('phần 📚 có nút gọi AI / thiếu ô kỹ năng'); EX_PART = null;
    // ② đề Đọc: gọi đúng tham số → màn chờ → soạn xong → làm → kết quả (đáp án, giải thích, band ước, nhãn AI) → S.dai + bản đồ nguồn ai; không đụng luật đo
    await tryA('đề AI Đọc', () => daiGo('ielts', 'R-tf')); const key = 'ielts-ac|R-tf', w = daiSt().wait[key];
    if (!w || !H().includes('AI đang soạn đề')) bad.push('không có màn chờ');
    if (!FAKE_CALLS.some(c => c.name === 'de-ai' && c.body.act === 'tao' && c.body.ky === 'ielts-ac' && c.body.sk === 'doc' && c.body.dang === 'R-tf' && c.body.muc === '6.5')) bad.push('gọi de-ai sai: ' + JSON.stringify(FAKE_CALLS));
    if (w) { await tryA('soạn xong', () => daiTick(w.id)); if (!H().includes('Saving coral reefs') || !H().includes('TRUE')) bad.push('đề không hiện sau khi soạn xong');
      await tryA('làm đề', async () => ans(daiQs(FAKE_DE_ROW(w.id)))); await tick0();
      if (!H().includes('6/6 câu đúng') || !H().includes('band') || !H().includes('AI soạn, chưa giáo viên kiểm')) bad.push('kết quả sai: ' + H().replace(/<[^>]+>/g, ' ').slice(0, 200));
      const r = daiSt().r.find(x => x.id === w.id); if (!r || r.ok !== 6 || r.n !== 6 || r.band == null) bad.push('S.dai.r sai: ' + JSON.stringify(r));
      if (!((ieSt().ty || {})['R-tf'] || []).some(b => b.src === 'ai' && b.n === 6)) bad.push('bản đồ IELTS chưa nhận nguồn ai');
      if (FAKE_CALLS.some(c => c.name === 'de-ai' && c.body.du)) bad.push('đề AI đầu tiên trong ngày không được soạn sẵn đề dự trữ (v142)'); }
    if (law() !== law0) bad.push('đề AI đụng luật đo (cards / units / exams)');
    // ③ v142: làm liền đề AI thứ 2 cùng dạng trong ngày mới soạn sẵn đề dự trữ; dự trữ soạn xong → bấm là mở ngay, không gọi máy chủ soạn đề mới
    FAKE_CALLS = []; await tryA('đề AI thứ 2', () => daiGo('ielts', 'R-tf')); const w2 = daiSt().wait[key];
    if (w2) { await tryA('đề 2 xong', () => daiTick(w2.id)); await tryA('làm đề 2', async () => ans(daiQs(FAKE_DE_ROW(w2.id)))); await tick0(); } else bad.push('đề AI thứ 2 không gọi de-ai');
    if (!FAKE_CALLS.some(c => c.name === 'de-ai' && c.body.du)) bad.push('làm liền 2 đề AI cùng dạng chưa soạn sẵn đề dự trữ');
    const wd = daiSt().wait[key]; if (wd) { await tryA('dự trữ xong', () => daiTick(wd.id)); if (!daiSt().du[key]) bad.push('đề dự trữ chưa vào S.dai.du'); } else bad.push('không có đề dự trữ đang soạn');
    FAKE_CALLS = []; await tryA('dùng đề dự trữ', () => daiGo('ielts', 'R-tf')); if (FAKE_CALLS.some(c => c.name === 'de-ai' && !c.body.du) || !H().includes('1/6')) bad.push('đề dự trữ không mở ngay');
    // ④ TOEIC Part 5 → điểm ước + bản đồ TOEIC; Cambridge B1 → mức đúng so ngưỡng
    S.lt.goal = { kind: 'toeic', at: Date.now() }; toSt().target = 650; await tryA('TOEIC', () => daiGo('toeic', 'p5')); const wt = daiSt().wait['toeic|p5'];
    if (wt) { await tryA('TOEIC xong', () => daiTick(wt.id)); await tryA('làm TOEIC', async () => ans(daiQs(FAKE_DE_ROW(wt.id)))); if (!H().includes('/ 495') || !((toSt().ty || {})['p5:form'] || []).some(b => b.src === 'ai')) bad.push('TOEIC: thiếu điểm ước / bản đồ'); } else bad.push('TOEIC không gọi de-ai');
    await tryA('Cambridge', () => daiGo('cefr', 'mc', 'b1')); const wc = daiSt().wait['cb-b1|mc'];
    if (wc) { await tryA('Cambridge xong', () => daiTick(wc.id)); await tryA('làm Cambridge', async () => ans(daiQs(FAKE_DE_ROW(wc.id)))); if (!H().includes('mức cần khoảng 70%')) bad.push('Cambridge: thiếu so ngưỡng'); } else bad.push('Cambridge không gọi de-ai');
    // ⑤ lỗi: 429 / 503 báo lời thường + thử lại; đề lỗi; máy kiểm phía trang loại đáp án ngoài lựa chọn
    S.lt.goal = { kind: 'ielts', at: Date.now() };
    FAKE_DAI = 'err429'; await tryA('429', () => daiGo('ielts', 'R-mc')); if (!H().includes('hết lượt AI hôm nay') || !H().includes('Thử lại')) bad.push('429 báo sai');
    FAKE_DAI = 'err503'; await tryA('503', () => daiGo('ielts', 'R-mc')); if (!H().includes('Đã làm hết đề soạn sẵn') || !H().includes('chưa cài')) bad.push('503 báo sai'); FAKE_DAI = null;   // v145: chưa có khoá AI + kho trống → báo hết đề soạn sẵn
    FAKE_DE_ST = 'loi'; await tryA('đề lỗi', () => daiGo('ielts', 'R-mc')); const wl = daiSt().wait['ielts-ac|R-mc'];
    if (wl) { await tryA('đề lỗi tick', () => daiTick(wl.id)); if (!H().includes('Chưa tạo được đề') || !H().includes('chưa đúng khuôn')) bad.push('đề lỗi báo sai'); } else bad.push('đề lỗi: không có lượt chờ'); FAKE_DE_ST = null;
    const hong = FAKE_DE_ROW('fake~ielts-ac~doc~R-tf~9').de; hong.groups[0].items[0].a = 'MAYBE'; if (!daiCheck(hong).length) bad.push('máy kiểm phía trang không loại đáp án ngoài lựa chọn');
    // ⑥ Viết: đề AI → màn viết (không nút đổi đề); Nói khi máy không chép lời → ô gõ; TOEIC không có Viết / Nói
    await tryA('Viết', () => daiGo('ielts', 't2')); const ww = daiSt().wait['ielts-ac|t2'];
    if (ww) { await tryA('Viết xong', () => daiTick(ww.id)); if (!H().includes('Task 2') || H().includes('data-a="other"') || !H().includes('ban cars')) bad.push('màn Viết đề AI sai'); } else bad.push('Viết không gọi de-ai');
    await tryA('Nói', () => daiGo('ielts', 'p1')); const wn = daiSt().wait['ielts-ac|p1'];
    if (wn) { await tryA('Nói xong', () => daiTick(wn.id)); if (!SREC && (!H().includes('gõ câu trả lời') || !H().includes('Where is your hometown'))) bad.push('Nói khi không chép lời: thiếu ô gõ'); } else bad.push('Nói không gọi de-ai');
    if (daiDangs('toeic', 'W').length || daiSks('toeic').includes('W')) bad.push('TOEIC không có Viết / Nói');
    // ⑦ danh sách đề đã làm; ô 🤖 ở màn kỹ năng
    await tryA('danh sách', () => daiList('ielts')); if (!H().includes('Đề AI đã làm') || !H().includes('data-daiopen=')) bad.push('danh sách đề AI sai');
    await tryA('màn kỹ năng', () => ieSkView('R')); if (!H().includes('data-daisk="ielts|R|')) bad.push('màn kỹ năng thiếu hàng 🤖 Đề AI mới');
    await tryA('chọn dạng', () => daiSkView('ielts', 'R')); if ((H().match(/data-daigo="ielts\\|R-/g) || []).length < 6) bad.push('màn chọn dạng thiếu dạng');
    // ⑧ Nghe: có nút nghe, lời nghe không lộ trước khi nộp, ghi rõ giọng máy; làm dở: ô 🤖 có "Làm tiếp đề đang dở"
    const ln = daiQs(FAKE_DE_ROW('fake~ielts-ac~nghe~L-form~7')); if (!ln.length || !ln[0].play || !ln[0].play.lines || ln.some(q => String(q.head + q.q + (q.foot || '')).includes('book a table')) || !ln[0].head.includes('Giọng máy')) bad.push('đề Nghe AI: thiếu nút nghe / lộ lời nghe / thiếu ghi chú giọng máy');
    daiSt().mo = { id: 'fake~ielts-ac~doc~R-mc~8', at: Date.now(), ky: 'ielts-ac', dang: 'R-mc' }; if (!daiBox('ielts').includes('Làm tiếp đề đang dở')) bad.push('thiếu lối làm tiếp đề dở'); daiSt().mo = null;
    DAI.off = false; DAI.cur = null; EX_PART = 'san'; DAI.kho = null;
    add('cefr', 'C57', !bad.length && !errs.length, [...errs, ...bad].length ? [...errs, ...bad].slice(0, 8).join(' | ') : '🎯 Luyện đề AI: tab thứ 5 sau 📚 Học, Học chỉ còn Nền, ô 🤖 một nút chính, gọi de-ai đúng tham số, màn chờ, làm đề, kết quả + band / điểm / mức ước, bản đồ nguồn ai, đề dự trữ, lỗi 429 / 503 / đề lỗi, máy kiểm phía trang, Viết / Nói, không đụng luật đo');
    S = blank(); }
  // v142 tách 📚 Đề có sẵn · 🤖 Đề AI (người sáng lập: "tách ra làm 2 phần… đỡ tốn chi phí gọi AI"; "hiện cả 2 nút chức năng để bấm"; đề dự trữ chỉ khi làm liền ≥ 2 đề AI cùng dạng)
  { const bad = [], errs = [], tryA = async (n, f) => { try { await f(); } catch (e) { errs.push(n + ': ' + e.message); } }, H = () => String($app.innerHTML), big = h => (h.match(/class="btnbig/g) || []).length;
    await Promise.all([ieLoad(), toLoad(), cbMapLoad(), ...Object.values(KIT).map(kLoad)]);
    S = blank(); S.lt = { goal: { kind: 'ielts', at: Date.now() }, self: 1 }; S.ie = { set: 1, type: 'ac', target: 6.5 }; DAI.off = true; FAKE_CALLS = [];
    for (const [k, view] of [['ielts', () => ieltsView()], ['toeic', () => toeicView()], ['cefr', () => cbView('b1')]]) {
      // ① màn 2 nút: đúng 2 nút to (📚 chính, 🤖 phụ), chưa có nút gọi AI, có hàng chọn kỳ thi, 📚 ghi số bài chưa làm
      EX_PART = null; await tryA(k + ' màn 2 nút', view); let h = H();
      if (big(h) !== 2 || !h.includes('<button class="btnbig" data-expart="san">') || !h.includes('<button class="btnbig ghost" data-expart="ai">') || h.includes('data-daigo=') || !h.includes('exrow') || !h.includes('bài chưa làm') || h.includes('class="tile')) bad.push(k + ': màn 2 nút sai');
      // ② phần 📚: hàng chọn 2 phần, nút về màn 2 nút, ô kỹ năng, không có nút gọi AI
      EX_PART = 'san'; await tryA(k + ' phần 📚', view); h = H();
      if (!h.includes('data-expart=""') || !h.includes('class="on" data-expart="san"') || !h.includes('class="tile') || h.includes('data-daigo=') || big(h)) bad.push(k + ': phần 📚 sai');
      // ③ phần 🤖: ô đề AI (một nút chính), nhắc chi phí, ô "bài có sẵn chưa làm" bấm được sang màn kỹ năng
      EX_PART = 'ai'; await tryA(k + ' phần 🤖', view); h = H();
      if (big(h) !== 1 || !h.includes('data-daigo=') || !h.includes('tốn phí AI') || !h.includes('Bài có sẵn · miễn phí') || !h.includes('data-daileft=') || h.includes('class="tile')) bad.push(k + ': phần 🤖 sai');
      const L = daiLeft(k, 'b1'); if (!L.length || L.some(x => !(x.tot > 0) || x.n > x.tot)) bad.push(k + ': đếm bài có sẵn sai ' + JSON.stringify(L)); }
    // ④ bấm "còn N bài": sang màn kỹ năng phần 📚
    EX_PART = 'ai'; await tryA('sang bài có sẵn', () => daiLeftGo('ielts', 'R')); if (EX_PART !== 'san' || CUR.view !== 'ielts' || CUR.sk !== 'R') bad.push('nhắc bài có sẵn không mở màn kỹ năng phần 📚');
    if (!H().includes('data-daisk="ielts|R|') || H().indexOf('data-daisk="ielts|R|') < H().indexOf('id="klist"')) bad.push('màn kỹ năng: hàng 🤖 phải nằm sau danh sách bài có sẵn');
    // ⑤ lối vào: việc luyện đề ở Hôm nay → phần 📚; về từ đề AI → phần 🤖; đổi phần vẽ lại đúng kỳ thi
    EX_PART = null; await tryA('Hôm nay luyện đề', () => exGo()); if (EX_PART !== 'san') bad.push('Hôm nay chưa mở phần 📚');
    EX_PART = 'san'; await tryA('về từ đề AI', () => daiBack('toeic')()); if (EX_PART !== 'ai' || CUR.view !== 'toeic') bad.push('về từ đề AI chưa mở phần 🤖');
    EX_PART = 'san'; window.CUR = { view: 'cambridge' }; await tryA('đổi phần', () => exRedraw()); if (CUR.view !== 'cambridge' || !H().includes('class="on" data-expart="san"')) bad.push('đổi phần vẽ lại sai kỳ thi');
    // ⑥ đề AI xong khi đang ở màn 2 nút: hiện dòng nhắc, không tự chuyển phần
    daiSt().wait['ielts-ac|R-mc'] = { id: 'fake~ielts-ac~doc~R-mc~55', at: Date.now(), ky: 'ielts-ac', st: 'xong', k: 'ielts', lv: '' };
    EX_PART = null; await tryA('nhắc đề AI xong', () => ieltsView()); if (!H().includes('Đề AI đã soạn xong') || !H().includes('data-daiopen="fake~ielts-ac~doc~R-mc~55"') || EX_PART !== null) bad.push('màn 2 nút thiếu dòng đề AI đã xong');
    delete daiSt().wait['ielts-ac|R-mc'];
    EX_PART = 'san'; DAI.off = false; S = blank();
    add('cefr', 'C59', !bad.length && !errs.length, [...errs, ...bad].length ? [...errs, ...bad].slice(0, 8).join(' | ') : 'tách 📚 Đề có sẵn · 🤖 Đề AI: màn 2 nút (📚 chính ghi số bài chưa làm, 🤖 phụ, chưa gọi AI) ở IELTS / TOEIC / Cambridge, phần 📚 không có nút gọi AI, phần 🤖 có ô AI + nhắc bài có sẵn bấm sang đúng màn kỹ năng, hàng 🤖 ở màn kỹ năng nằm sau bài có sẵn, Hôm nay mở 📚, về từ đề AI mở 🤖, đề AI xong hiện dòng nhắc');
    }
  // v144 C61 (phần trang): danh sách dạng AI theo kỳ thi × cấp (gửi ra ngoài để so với khuôn máy chủ); đề cũ v1 vẫn mở; câu hỏi ghi phần đề thật; Task 1 biểu đồ AI vẽ được
  { const bad = [], L = {}; const S1 = S; S = blank(); S.ie = { set: 1, type: 'ac', target: 6.5 };
    try { for (const s of ['R', 'L', 'W', 'S']) L['ielts-ac|' + s] = daiDangs('ielts', s).map(d => d.slice(0, 2));
      S.ie.type = 'gt'; for (const s of ['R', 'L', 'W', 'S']) L['ielts-gt|' + s] = daiDangs('ielts', s).map(d => d.slice(0, 2)); S.ie.type = 'ac';
      for (const s of ['R', 'L']) L['toeic|' + s] = daiDangs('toeic', s).map(d => d.slice(0, 2));
      for (const lv of OV_LV) for (const s of ['R', 'L', 'W', 'S']) L['cb-' + lv + '|' + s] = daiDangs('cefr', s, lv).map(d => d.slice(0, 2));
      if (daiSks('cefr', 'pre').includes('W') || daiSks('cefr', 'a1').includes('W') || !daiSks('cefr', 'a2').includes('W') || daiSks('toeic').join() !== 'R,L') bad.push('Pre-A1 / A1 còn ô Viết AI, hoặc A2 / TOEIC sai kỹ năng');
      const old = { id: 'fake~old~1', st: 'xong', de: { v: 1, ky: 'cb-pre', sk: 'nghe', dang: 'mc', title: 'Old', min: 6, lines: [['A', 'I like red apples.']], sex: {}, groups: [{ ty: 'mc', inst: '', items: [{ q: 'What does she like?', o: ['apples', 'pears', 'cakes'], a: 'apples', why_vi: 'vì', ev: 'I like red apples.' }] }] } };
      if (daiCheck(old.de).length || !daiQs(old).length) bad.push('đề cũ v1 bị chặn / không ra câu hỏi');
      if (!/Nghe/.test(daiName('cefr', 'mc', 'pre', 'nghe')) || daiSOf('cefr', 'mc', 'pre', 'nghe') !== 'L' || daiName('ielts', 'L-sa', '', 'nghe') !== 'Nghe · Trả lời ngắn') bad.push('tên / kỹ năng của dạng cũ sai: ' + daiName('cefr', 'mc', 'pre', 'nghe'));
      const v2 = { id: 'fake~v2~1', st: 'xong', de: { v: 2, ky: 'ielts-ac', sk: 'doc', dang: 'R-tf', part: 'IELTS Academic Reading · one passage', title: 'New', min: 20, text: 'A. Some text.', groups: [{ ty: 'R-tf', inst: 'Do the following statements agree with the information?', items: [{ q: 'S1', o: ['TRUE', 'FALSE', 'NOT GIVEN'], a: 'TRUE', why_vi: 'vì', ev: '' }] }] } };
      if (!daiQs(v2)[0].head.includes('📋 IELTS Academic Reading')) bad.push('câu hỏi không ghi phần đề thật');
      const t1 = daiIeX({ id: 'x', de: { dang: 't1', task: { p: 'The graph below shows…', pv: '', m: '', chart: { kind: 'line', title: 'T', unit: '%', cats: ['2000', '2010', '2020'], series: [{ name: 'A', v: [1, 2, 3] }] } } } });
      if (t1.kind !== 'line' || t1.series[0][0] !== 'A' || !/<svg/.test(ieChart(t1))) bad.push('Task 1 biểu đồ AI không vẽ được');
      const t0 = daiIeX({ id: 'y', de: { dang: 't1', task: { p: 'p', pv: '', m: '', table: { t: 'T', h: ['', 'a', 'b', 'c'], r: [['x', 1, 2, 3]] } } } }); if (t0.kind !== 'table' || t0.series[0][0] !== 'x') bad.push('Task 1 đề cũ (bảng) hỏng');
    } catch (e) { bad.push('lỗi: ' + e.message); }
    S = S1; out.push({ lv: 'cefr', id: 'C61-trang', ok: !bad.length, msg: bad.join(' | '), x: L }); }
  // v145 C62 kho đề soạn sẵn (specs/007-kho-de-soan-san): đề mở từ dekho.json, không gọi máy chủ; đề đã làm không chọn lại; GT / cấp "+" dùng đề phù hợp; hết kho + chưa có khoá → báo hết; nút chép lời nhắc chấm
  { const bad = [], S1 = S, H = () => String($app.innerHTML); let n = 0; S = blank(); S.lt = { goal: { kind: 'ielts', at: Date.now() }, self: 1 }; S.ie = { set: 1, type: 'ac', target: 6.5 }; DAI.kho = null; DAI.off = true; FAKE_CALLS = []; FAKE_DAI = null;
    try { const K = await daiKhoLoad(); n = (K.de || []).length; if (n < 20) bad.push('kho ít đề: ' + n);
      for (const e of K.de) { const b = daiCheck(e.de); if (b.length || !e.de.part || !e.de.kho) bad.push(e.id + ': ' + (b[0] || 'thiếu phần đề thật / dấu kho')); }
      for (const s of ['R', 'L']) for (const [d] of daiDangs('ielts', s)) if (!daiKhoList('ielts-ac', d).length) bad.push('IELTS thiếu đề kho dạng ' + d);
      const box = daiBox('ielts'); if (!/Còn <b>\\d+<\\/b> đề soạn sẵn/.test(box) || !box.includes('soạn sẵn, miễn phí')) bad.push('ô 🤖 chưa ghi đề soạn sẵn');
      await daiGo('ielts', 'R-tf'); if (FAKE_CALLS.length) bad.push('đề kho vẫn gọi máy chủ'); if (!H().includes('📋 IELTS Academic Reading')) bad.push('đề kho không mở');
      const first = daiKhoList('ielts-ac', 'R-tf')[0]; daiSave(daiKhoRow(first, 'ielts-ac'), { ok: 10, n: 13 });
      if (daiKhoList('ielts-ac', 'R-tf').some(e => e.id === first.id)) bad.push('đề đã làm vẫn được chọn lại');
      if (!daiKhoGet('kho:' + first.id)) bad.push('không mở lại được đề kho đã làm');
      S.ie.type = 'gt'; const g = daiKhoList('ielts-gt', 'R-mc')[0]; if (!g || !/General Training Reading · Section 3/.test(daiKhoRow(g, 'ielts-gt').de.part)) bad.push('GT không nhận bài đọc học thuật làm Section 3'); S.ie.type = 'ac';
      if (!daiKhoList('cb-b1p', 'cloze').length || !daiKhoList('cb-b2', 'kwt').length) bad.push('Cambridge thiếu đề kho / cấp + không dùng đề cấp gốc');
      for (const e of daiKhoList('toeic', 'p5')) daiSave(daiKhoRow(e, 'toeic'), { ok: 1, n: 10 });
      FAKE_DAI = 'err503'; FAKE_CALLS = []; await daiGo('toeic', 'p5');
      if (!FAKE_CALLS.some(c => c.name === 'de-ai')) bad.push('hết kho không gọi máy chủ'); if (!H().includes('Đã làm hết đề soạn sẵn') || !H().includes('data-daigo="toeic|p6')) bad.push('hết kho chưa báo / chưa chỉ dạng còn đề');
      FAKE_DAI = null;
      const ab = aiBtn('viet', 'b1', { prompt: 'Write an email to a friend.', min: 100 }, 'Hi Tom'); if (!ab.includes('data-aicp=')) bad.push('thiếu nút chép lời nhắc');
      const pr = aiPrompt({ kind: 'viet', lv: 'ielts-ac', task: { prompt: 'Some people think...', min: 250, part: 'Task 2', target: 6.5 }, text: 'In my opinion...' });
      if (!/IELTS Academic Writing Task 2 band descriptors/.test(pr) || !/Task Response/.test(pr) || !/Reply in Vietnamese/.test(pr) || !pr.includes('In my opinion...')) bad.push('lời nhắc chấm thiếu ý');
    } catch (e) { bad.push('lỗi: ' + e.message); }
    S = S1; DAI.kho = null; DAI.khoP = null; DAI.off = false; FAKE_DAI = null; FAKE_CALLS = [];
    out.push({ lv: 'cefr', id: 'C62', ok: !bad.length, msg: bad.length ? bad.slice(0, 8).join(' | ') : 'kho đề soạn sẵn: ' + n + ' đề qua máy kiểm phía trang, mở ngay không gọi máy chủ, đề đã làm không chọn lại, mọi dạng IELTS Đọc / Nghe có đề, GT dùng bài học thuật làm Section 3, Cambridge cấp + dùng đề cấp gốc, hết kho + chưa có khoá báo “đã làm hết” và chỉ dạng còn đề; nút 📋 chép lời nhắc chấm có thang chấm + bài làm' }); }
  // v146 C63 🎯 Sai ở đâu · học lại gì (specs/009-sai-hoc-lai): mọi câu của kho (IELTS / TOEIC / Cambridge, đề soạn sẵn, dạng đề AI) nối tới một bài học có thật;
  // câu TOEIC đề soạn sẵn có nhãn dạng (luật chung toqt.js); ô ở 5 màn kết quả, nút chính hạ xuống; 📘 Học lại về lại kết quả; 🏋️ mở bài tập dạng đó; cờ "vừa sai" + hết cờ; 📌 lưu từ; không đổi luật đo
  { const bad = [], S1 = S, H = () => String($app.innerHTML); let nq = 0; S = blank(); S.ie = { set: 1, type: 'ac', target: 6.5 }; DAI.kho = null; DAI.off = true;
    const ev = (sel, o) => ({ target: { closest: s => s === sel ? o : null } });
    try { await ieLoad(); await toLoad(); await uLoad(); for (const P of Object.values(KIT)) await kLoad(P);
      const miss = (tag, q, r, ctx) => { nq++; HL_LC = {}; const a = hlLes(hlAt(q, r || { ans: '' }, ctx || {})); if (!a) bad.push('chưa nối bài học: ' + tag); return a; };
      for (const x of IE.doc.filter(x => !x.gt)) for (const q of ieRQs(x)) miss('IELTS ' + x.id + ' ' + q.k, q);
      S.ie.type = 'gt'; for (const x of IE.doc.filter(x => x.gt)) for (const q of ieRQs(x)) miss('IELTS GT ' + x.id, q); S.ie.type = 'ac';
      for (const x of IE.ln) for (const q of ieLnQs(x)) miss('IELTS Nghe ' + x.id + ' ' + q.k, q);
      for (const s of ['R', 'L']) for (const [d] of daiDangs('ielts', s)) miss('IELTS AI ' + d, { ty: d });
      if ((miss('L-note', { ty: 'L-note' }) || { d: {} }).d.k !== 'form') bad.push('L-note chưa về bài điền phiếu');
      for (const x of TO.p1) miss('TOEIC ' + x.id, toP1Q(x)); for (const x of TO.p2) for (const a of ['A', 'B', 'C']) miss('TOEIC ' + x.id, toP2Q(x), { ans: a });
      for (const s of ['p3', 'p4']) for (const x of TO[s]) for (const q of toTalkQs(x, s)) miss('TOEIC ' + x.id, q);
      for (const x of TO.p5) miss('TOEIC ' + x.id, toP5Q(x)); for (const x of TO.p6) for (const q of toP6Qs(x)) miss('TOEIC ' + x.id, q); for (const x of TO.p7) for (const q of toP7Qs(x)) miss('TOEIC ' + x.id, q);
      const kOf = q => (miss('kiểm', q) || { d: {} }).d.k, tr = TO.p2.find(x => x.tr && x.tr.some(Boolean)), ti = tr.tr.findIndex(Boolean);
      if (kOf(toP2Q(tr)) === 'p2t' || hlLes(hlAt(toP2Q(tr), { ans: 'ABC'[ti] }, {})).d.k !== 'p2t') bad.push('Part 2: chọn trúng bẫy chưa về bài bẫy');
      const q7 = t => TO.p7.flatMap(x => toP7Qs(x)).find(q => q.qt === t), q34 = t => ['p3', 'p4'].flatMap(s => TO[s].flatMap(x => toTalkQs(x, s))).find(q => q.qt === t);
      if (kOf(q7('syn')) !== 'p7-syn' || kOf(q7('insert')) !== 'p7-ins' || kOf(q7('intent')) !== 'p7c' || kOf(q7('not')) !== 'p7-inf' || kOf(q34('imp')) !== 'imp' || kOf(q34('graphic')) !== 'g') bad.push('TOEIC: dạng câu chưa về đúng bài học');
      const K = await daiKhoLoad(), kh = new Set(); for (const d of ['p5', 'p6', 'p7']) for (const e of daiKhoList('toeic', d)) for (const q of daiQs(daiKhoRow(e, 'toeic'))) { const a = miss('đề soạn sẵn ' + e.id, q); if (a) kh.add(a.d.k); }
      for (const k of ['p6-ins', 'p7-ins', 'p7-syn', 'p7c', 'p7-inf']) if (!kh.has(k)) bad.push('đề soạn sẵn TOEIC chưa gắn nhãn dạng ' + k);
      for (const s of ['R', 'L']) for (const [d] of daiDangs('ielts', s)) for (const e of daiKhoList('ielts-ac', d)) for (const q of daiQs(daiKhoRow(e, 'ielts-ac'))) miss('đề soạn sẵn ' + e.id, q);
      for (const lv of Object.keys(MOCK)) { const C = MOCK[lv]; if (!C || !C.papers) continue; C.papers.forEach((p, pi) => { if (p.speak) return; p.parts.forEach(([lab], i) => { const a = miss('Cambridge ' + lv + ' ' + lab, { kind: 'mc' }, { pt: p.t, part: lab }, { ex: 'cambridge', lv }); if (a && (a.i !== i || a.sk !== lv + '~' + pi)) bad.push('Cambridge sai phần: ' + lv + ' ' + lab); }); }); }
      for (const lv of ['pre', 'a1', 'a2', 'b1', 'b2', 'c1', 'c2']) for (const e of Object.values(DAI_CB[lv] || {}).flat()) { if (e[1] !== 'doc' && e[1] !== 'nghe') continue; const a = miss('Cambridge AI ' + lv + ' ' + e[0], { kind: 'mc' }, {}, { ex: 'cambridge', lv, dang: e[0], sk: e[1] });
        if (a && !hlNums(MOCK[lv].papers[+a.sk.split('~')[1]].parts[a.i][0]).some(n => hlNums(e[2]).includes(n))) bad.push('Cambridge AI sai phần: ' + lv + ' ' + e[0]); }
      if ((miss('uRun', { kind: 'mc' }, {}, { ex: 'cambridge', lv: 'b2', uk: 'wf' }) || { i: -1 }).i !== MOCK.b2.papers[0].parts.findIndex(([l]) => /tạo dạng từ/.test(l))) bad.push('dạng đề thật chưa về đúng phần');
      // ô kết quả + cờ "vừa sai": bài đọc IELTS, T/F/NG sai 3/4, tiêu đề đúng hết
      const cards0 = JSON.stringify(S.cards), x = IE.doc.find(x => !x.gt && ieHasK(x, 'tf') && ieHasK(x, 'h')), tf = ieRQs(x, ['tf']).slice(0, 4), hh = ieRQs(x, ['h']).slice(0, 3);
      const wr = q => q.opts.find(o => o !== q.a), res = [...tf.map((q, i) => ({ q, part: 'Passage 1', ok: i === 0, ans: i === 0 ? q.a : wr(q) })), ...hh.map(q => ({ q, part: 'Passage 1', ok: true, ans: q.a }))];
      const L = xlList('ielts', 'R'), iTf = L.findIndex(d => d.k === 'tf'), idTf = L[iTf].id, hb = hlBox(res, { src: 'thi' });
      if (!hb.pri || !hb.html.includes('Sai ở đâu') || !hb.html.includes('data-hl="ielts|R|' + iTf + '"') || !hb.html.includes('data-ier="tf"') || !hb.html.includes('sai 3/4') || hb.html.includes('Nối tiêu đề')) bad.push('ô kết quả: thiếu dòng / nút hoặc có dạng đúng hết');
      if (!hlOn(idTf)) bad.push('chưa đánh cờ vừa sai');
      const blk = xlBlock('ielts', 'R'); if (!blk.rows[iTf].includes('vừa sai') || !/^vừa sai: /.test(blk.learn.sub) || !blk.learn.attr.includes('|' + iTf + '"')) bad.push('danh sách bài học chưa đưa dạng vừa sai lên');
      hlBox(tf.map(q => ({ q, ok: true, ans: q.a })), { src: 'luyen' }); if (hlOn(idTf)) bad.push('lượt sau đúng hết chưa xoá cờ');
      hlBox(res, { src: 'thi' }); xlSt()[idTf] = { at: Date.now() + 5, ok: 3, n: 3 }; if (hlOn(idTf)) bad.push('học lại bài chưa xoá cờ'); delete xlSt()[idTf]; hlBox(res, { src: 'thi' });
      // 5 màn kết quả
      MK = { lv: 'ielts', C: { name: 'IELTS Academic' }, idx: [0], papers: [{ k: 'R', t: '📖 Reading', res }] }; ieMockResult();
      if (!H().includes('id="hlbox"') || H().includes('class="pri" data-a="again"') || H().includes('Xem lại 3 câu sai')) bad.push('đề thử IELTS: chưa có ô / nút chính chưa hạ');
      await hlClick(ev('[data-hl]', { dataset: { hl: 'ielts|R|' + iTf } })); if (!H().includes('‹ Kết quả') || !H().includes('TRUE / FALSE')) bad.push('📘 Học lại chưa mở bài học có nút ‹ Kết quả');
      $app.onclick(ev('[data-xlb]', {})); if (!H().includes('id="hlbox"')) bad.push('‹ Kết quả chưa về lại màn kết quả');
      window.CUR = {}; hlClick({ target: { closest: s => s === '[data-hlgo]' || s === '[data-ier]' ? { dataset: { hlgo: 'ielts|R', ier: 'tf' }, matches: () => false } : null } }); if (!H().includes('TRUE') || H().includes('id="hlbox"')) bad.push('🏋️ chưa mở bài tập dạng đó');
      if (!S.xsc || S.xsc.l !== 1 || S.xsc.p !== 1 || S.xsc.k !== 1) bad.push('đếm lượt bấm sai: ' + JSON.stringify(S.xsc));
      const tq = [...TO.p2.slice(0, 3).map(toP2Q), ...TO.p7.slice(0, 2).flatMap(x => toP7Qs(x))], tres = tq.map((q, i) => ({ q, part: q.sec.toUpperCase(), ok: i % 2 === 1, ans: i % 2 ? q.a : q.opts.find(o => o !== q.a) }));
      MK = { lv: 'toeic', C: { name: 'TOEIC' }, idx: [0, 1], papers: [{ k: 'L', t: '🎧 Listening', res: tres.slice(0, 3) }, { k: 'R', t: '📖 Reading', res: tres.slice(3) }] }; toMockResult();
      if (!H().includes('id="hlbox"') || !/data-hlgo="toeic\\|[LR]"/.test(H()) || H().includes('chưa có Part 1') || H().includes('class="pri" data-a="again"')) bad.push('đề thử TOEIC: chưa có ô / chữ Part 1 cũ / nút chính chưa hạ');
      const C = MOCK.b1, p0 = C.papers[0], cres = p0.parts.slice(0, 3).map(([lab], i) => ({ q: { kind: 'mc', q: 'Câu ' + i, opts: ['a', 'b'], a: 'a', x: { id: 'z' + i } }, part: lab, ok: false, ans: 'b' }));
      MK = { lv: 'b1', C, idx: [0], papers: [{ t: p0.t, min: 45, res: cres }] }; mkResult();
      if (!H().includes('id="hlbox"') || !H().includes('data-hl="cambridge|b1~0|0"') || /class="pri" data-a="again"/.test(H())) bad.push('đề thử Cambridge: chưa có ô về đúng phần / nút chính chưa hạ');
      const xs = uPick('mc', uLvs('b2'), 1); let back = 0; uRun('b2', 'mc', xs, () => { back++; }); const uq = uQs('mc', xs[0]);
      for (let i = 0; i < uq.length; i++) { $app.onclick(ev('[data-uo]', { dataset: { uo: String(uq[i].opts.findIndex(o => o !== uq[i].a)) }, disabled: false })); $app.onclick(ev('[data-a="next"]', {})); }
      if (!H().includes('id="hlbox"') || !H().includes('data-hl="cambridge|b2~0|' + MOCK.b2.papers[0].parts.findIndex(([l]) => cbKey(l, MOCK.b2.papers[0]) === 'mc') + '"')) bad.push('dạng đề thật Cambridge: chưa có ô');
      ieRun('Luyện', tf, () => {}, 0, {}); for (const q of tf) { $app.onclick(ev('[data-io]', { dataset: { io: String(q.opts.indexOf(wr(q))) }, disabled: false })); $app.onclick(ev('[data-a="next"]', {})); }
      if (!H().includes('id="hlbox"') || H().includes('class="pri" data-a="back"')) bad.push('bài luyện: chưa có ô / nút về chưa hạ');
      ieRun('📘 Bài học', tf, () => {}, 0, { nolog: 1 }); for (const q of tf) { $app.onclick(ev('[data-io]', { dataset: { io: String(q.opts.indexOf(wr(q))) }, disabled: false })); $app.onclick(ev('[data-a="next"]', {})); }
      if (H().includes('id="hlbox"')) bad.push('làm thử của bài học không được có ô (không ghi gì)');
      // 📌 từ chưa học trong câu chứa đáp án
      HL_W = []; const wh = hlWords('The cartographer surveyed the remote archipelago with great patience.'); if (!wh.includes('data-hlw="0"')) bad.push('chưa gợi ý từ chưa học');
      const btn = { dataset: { hlw: '0' }, disabled: false, textContent: '' }; hlClick(ev('[data-hlw]', btn)); if (!vwSt().some(y => y.k === HL_W[0].w.toLowerCase()) || !btn.disabled) bad.push('📌 chưa lưu từ vào Sổ từ');
      if (JSON.stringify(S.cards) !== cards0) bad.push('đụng thẻ học (luật đo)');
    } catch (e) { bad.push('lỗi: ' + e.message); }
    S = S1; MK = null; DAI.kho = null; DAI.khoP = null; DAI.off = false;
    out.push({ lv: 'cefr', id: 'C63', ok: !bad.length, msg: bad.length ? bad.slice(0, 8).join(' | ') : '🎯 Sai ở đâu · học lại gì: ' + nq + ' câu (IELTS, TOEIC, Cambridge, đề soạn sẵn, dạng đề AI) đều nối tới bài học có thật; nhãn dạng TOEIC cho đề soạn sẵn; ô ở đề thử IELTS / TOEIC / Cambridge, bài luyện, dạng đề thật (nút chính hạ xuống); 📘 Học lại về lại kết quả; 🏋️ mở bài tập dạng đó; cờ vừa sai lên đầu danh sách, hết cờ khi học lại hoặc làm đúng; 📌 lưu từ; không đụng thẻ học' }); }
  // v147 C64 🎓 đề thử TOEIC trọn 200 câu (specs/008-toeic-de-tron): 2 đề đúng cơ cấu đề thật, không trùng câu, thứ tự phương án cố định; Nghe chỉ chọn được câu của bài đang phát;
  // Đọc có bảng câu / ⚑ / nhảy câu; làm tiếp + đếm gián đoạn; quá 3 giờ huỷ; hết giờ tự nộp; đúng hết = 990; kết quả có ô Sai ở đâu + so lần trước; màn thi ẩn thanh dưới; không đụng thẻ học
  { const bad = [], S1 = S, H = () => String($app.innerHTML), P0 = trPlayUnit, ev = (sel, o) => ({ target: { closest: s => s === sel ? o : null } }); let n0 = 0;
    S = blank(); S.to = { target: 600 }; globalThis.trPlayUnit = () => new Promise(() => {}); TR.B = {}; TR.k = 1;
    try { await toLoad(); const cards0 = JSON.stringify(S.cards), T = (TO.tron || []).filter(d => !d.f), NEED = { 'Part 1': 6, 'Part 2': 25, 'Part 3': 39, 'Part 4': 30, 'Part 5': 30, 'Part 6': 16, 'Part 7': 54 };
      if (T.length !== 2) bad.push("cần 2 đề lấy câu từ kho (Đề 1–2), có " + T.length);
      const ids = T.map(d => new Set(trB(d.id).U.map(u => u.x.id)));
      for (const d of T) { const B = trB(d.id), by = {}; for (const q of B.Q) by[TR_SECS[q.sec]] = (by[TR_SECS[q.sec]] || 0) + 1; n0 += B.Q.length;
        if (B.Q.length !== 200 || B.L.flatMap(u => u.qs).length !== 100 || Object.entries(NEED).some(([k, v]) => by[k] !== v)) bad.push(d.id + ': sai cơ cấu ' + JSON.stringify(by));
        if (B.Q.some((q, i) => q.n !== i + 1)) bad.push(d.id + ': đánh số câu sai'); }
      if ([...ids[0]].some(i => ids[1].has(i))) bad.push('hai đề trùng câu');
      const o1 = trB('de1').Q.map(q => q.opts.join('|')).join('/'); TR.B = {}; if (trB('de1').Q.map(q => q.opts.join('|')).join('/') !== o1) bad.push('thứ tự phương án đổi khi dựng lại (vào lại sai chữ A–D)');
      // màn chọn đề + bắt đầu
      await trView(); if (!H().includes('Đề 1') || !H().includes('Quy chế') || !H().includes('id="ie"')) bad.push('màn chọn đề thiếu');
      trStart('de1'); let st = trSt(); if (!st || st.ph !== 'L' || !H().includes('Part 1 · câu 1/200') || H().includes('id="ie"')) bad.push('bắt đầu Nghe sai / còn thanh dưới');
      trClick(ev('[data-tra]', { dataset: { tra: '1|0' } })); trClick(ev('[data-tra]', { dataset: { tra: '50|0' } }));
      if (st.ans['1'] !== 'A' || st.ans['50']) bad.push('Nghe: chọn câu chưa phát được / câu đang phát không ghi');
      for (let i = 0; i < 60 && trSt().ph === 'L'; i++) trLNext(TR.tok);
      if (trSt().ph !== 'R' || !H().includes('Xong phần Nghe') || trSt().rAt) bad.push('hết Nghe chưa sang màn chờ Đọc');
      trClick(ev('[data-trrs]', {})); st = trSt(); const B1 = trB('de1'), q101 = B1.Q[100];
      if (!st.rAt || !H().includes('101.') || H().includes('id="ie"')) bad.push('Đọc chưa bắt đầu');
      trClick(ev('[data-tra]', { dataset: { tra: '101|' + q101.opts.indexOf(q101.a) } })); trClick(ev('[data-trf]', { dataset: { trf: '102' }, classList: { toggle() {} }, setAttribute() {} }));
      if (st.ans['101'] !== q101.a || !st.fl['102']) bad.push('Đọc: chọn / đánh dấu không ghi');
      trClick(ev('[data-trn]', {})); if (trSt().ri !== 1 || !H().includes('102.')) bad.push('Sau › chưa sang câu 102');
      trClick(ev('[data-trg]', {})); if ((H().match(/class="trc/g) || []).length !== 100 || !H().includes('1 câu ⚑')) bad.push('bảng câu 101–200 sai');
      trClick(ev('[data-trj]', { dataset: { trj: '30' } })); if (!H().includes('131.') || !H().includes('Part 6')) bad.push('nhảy tới Part 6 sai');
      // vào lại: đếm gián đoạn; quá 3 giờ: huỷ
      st.up = Date.now() - 36e5; await trView(); if (!H().includes('Đề 1 đang dở') || !H().includes('Làm tiếp')) bad.push('chưa có ô làm tiếp');
      trResume(); if (trSt().gap !== 1 || !H().includes('131.')) bad.push('làm tiếp sai / chưa đếm gián đoạn: ' + trSt().gap);
      trSt().up = Date.now() - 4 * 36e5; await trView(); if (trSt() || !H().includes('đã huỷ')) bad.push('đề dở quá 3 giờ chưa huỷ');
      // hết giờ Đọc: tự nộp
      trStart('de1'); st = trSt(); st.ph = 'R'; st.lEnd = Date.now(); st.rAt = Date.now() - 76 * 60000; trR(); let m = toSt().mock.slice(-1)[0];
      if (!m || !m.full || m.de !== 'de1' || !m.auto || trSt() || !H().includes('hết giờ, máy tự nộp')) bad.push('hết giờ chưa tự nộp');
      // đúng hết = 990; lần sau sai hết: so lần trước + ô Sai ở đâu
      trStart('de2'); st = trSt(); for (const q of trB('de2').Q) st.ans[q.n] = q.a; st.ph = 'R'; st.lEnd = Date.now(); st.rAt = Date.now(); trSubmit(false); m = toSt().mock.slice(-1)[0];
      if (m.tot !== 990 || m.ok.L !== 100 || m.ok.R !== 100 || m.by['Part 7'][0] !== 54) bad.push('đúng hết chưa ra 990: ' + JSON.stringify(m.ok));
      trStart('de2'); st = trSt(); for (const q of trB('de2').Q) st.ans[q.n] = q.opts.find(o => o !== q.a); st.ph = 'R'; st.rAt = Date.now(); trSubmit(false); m = toSt().mock.slice(-1)[0];
      if (m.tot !== 10 || !H().includes('So lần trước') || !H().includes('-980') || !H().includes('Sai ở đâu') || !H().includes('data-hl=')) bad.push('kết quả thiếu so lần trước / ô Sai ở đâu');
      if (!toSt().ty || !Object.keys(toSt().ty).length || !toSt().r['t7-m-job']) bad.push('chưa ghi bản đồ / bài đã gặp');
      // lối vào ở màn TOEIC (phần 📚) + đề dở thì ghi làm tiếp; phút luyện đề (lotrinh bọc trView)
      EX_PART = 'san'; await toeicView(); if (!H().includes('data-trv') || !H().includes('Đề thử trọn 200 câu')) bad.push('màn TOEIC chưa có lối vào');
      trStart('de1'); await toeicView(); if (!H().includes('Làm tiếp đề thử trọn')) bad.push('màn TOEIC chưa ghi đề dở'); toSt().tron = null;
      if (!String(window.trView).includes('LT_EX_ON')) bad.push('chưa tính phút luyện đề');
      if (JSON.stringify(S.cards) !== cards0) bad.push('đụng thẻ học (luật đo)');
    } catch (e) { bad.push('lỗi: ' + e.message); }
    globalThis.trPlayUnit = P0; TR.tok++; TR.on = ''; TR.k = 1; S = S1; EX_PART = 'san';
    out.push({ lv: 'cefr', id: 'C64', ok: !bad.length, msg: bad.length ? bad.slice(0, 8).join(' | ') : '🎓 đề thử TOEIC trọn: 2 đề × 200 câu đúng cơ cấu 6 / 25 / 39 / 30 / 30 / 16 / 54, không trùng, phương án cố định; Nghe chỉ chọn câu đang phát; Đọc chọn / ⚑ / Sau › / bảng câu / nhảy câu; làm tiếp đếm gián đoạn, quá 3 giờ huỷ; hết giờ tự nộp; đúng hết 990; kết quả so lần trước + ô Sai ở đâu; màn thi ẩn thanh dưới; lối vào màn TOEIC; không đụng thẻ học' }); }
  // v148 C65 khung cấu trúc 200 câu (người sáng lập 8/11/2026 xem màn sẵn sàng: "Sao 200 câu mà ghi có 100 câu… nên trình bày từng phần trong tổng 200 câu"):
  // màn sẵn sàng / chờ Đọc / kết quả có Phần Nghe + Phần Đọc × 7 Part, số câu + khoảng câu đúng đề; đầu màn khi thi ghi câu a/200; màn sẵn sàng ẩn thanh dưới như các màn thi
  { const bad = [], S1 = S, H = () => String($app.innerHTML), P0 = trPlayUnit;
    S = blank(); S.to = { target: 600 }; globalThis.trPlayUnit = () => new Promise(() => {}); TR.B = {}; TR.k = 1;
    try { await toLoad(); const ROWS = [['p1', 6, '1–6'], ['p2', 25, '7–31'], ['p3', 39, '32–70'], ['p4', 30, '71–100'], ['p5', 30, '101–130'], ['p6', 16, '131–146'], ['p7', 54, '147–200']];
      const row = (s, n, r) => '<span>' + TR_SECS[s] + ' · ' + TR_PN[s] + '</span><span>' + n + '</span><span>' + r + '</span>';
      trReady('de1'); let h = H();
      if (!h.includes('Đề 1 · 200 câu') || !h.includes('Phần Nghe') || !h.includes('Phần Đọc') || !h.includes('câu 1–100') || !h.includes('câu 101–200') || ROWS.some(([s, n, r]) => !h.includes(row(s, n + ' câu', r)))) bad.push('màn sẵn sàng thiếu cấu trúc 200 câu');
      if (!h.includes('Bắt đầu phần Nghe<small>Câu 1–100') || h.includes('100 câu ·') || h.includes('id="ie"') || !h.includes('class="row top trx"') || !h.includes('data-trtest')) bad.push('nút bắt đầu / thanh dưới / thử âm thanh ở màn sẵn sàng sai');
      trStart('de1'); if (!H().includes('Part 1 · câu 1/200')) bad.push('đầu màn Nghe chưa ghi câu a/200');
      trLNext(TR.tok); trLNext(TR.tok); trLNext(TR.tok); trLNext(TR.tok); trLNext(TR.tok); trLNext(TR.tok); if (!H().includes('Part 2 · câu 7/200')) bad.push('đầu màn Part 2 chưa ghi câu 7/200');
      for (let i = 0; i < 60 && trSt().ph === 'L'; i++) trLNext(TR.tok); h = H();
      if (!h.includes('Xong phần Nghe') || !h.includes('Đã xong') || h.includes(row('p1', '6 câu', '1–6')) || !['p5', 'p6', 'p7'].every(s => h.includes('<span>' + TR_SECS[s] + ' · ' + TR_PN[s] + '</span>')) || !h.includes('Bắt đầu phần Đọc<small>Câu 101–200')) bad.push('màn chờ Đọc chưa có cấu trúc (Nghe gập, Đọc đủ Part)');
      trRStart(); if (!H().includes('Part 5 · câu 101/200')) bad.push('đầu màn Đọc chưa ghi câu 101/200');
      const st = trSt(); for (const q of trB('de1').Q) if (q.n % 3) st.ans[q.n] = q.a; trSubmit(false); h = H(); const m = toSt().mock.slice(-1)[0];
      if (!h.includes((m.ok.L + m.ok.R) + '/200 câu đúng') || !h.includes('≈ ' + m.b.L + ' điểm · ' + m.ok.L + '/100 câu đúng') || !h.includes('≈ ' + m.b.R + ' điểm · ' + m.ok.R + '/100 câu đúng')) bad.push('kết quả chưa ghi số câu đúng / điểm từng phần');
      if (ROWS.some(([s, n, r]) => !h.includes(row(s, m.by[TR_SECS[s]][0] + '/' + n, r)))) bad.push('kết quả chưa ghi số câu đúng từng Part');
    } catch (e) { bad.push('lỗi: ' + e.message); }
    globalThis.trPlayUnit = P0; TR.tok++; TR.on = ''; TR.k = 1; S = S1; EX_PART = 'san';
    out.push({ lv: 'cefr', id: 'C65', ok: !bad.length, msg: bad.length ? bad.slice(0, 8).join(' | ') : '🎓 đề thử trọn: khung cấu trúc 200 câu (Phần Nghe câu 1–100: Part 1–4, Phần Đọc câu 101–200: Part 5–7, số câu + khoảng câu) ở màn sẵn sàng / chờ Đọc / kết quả; đầu màn câu a/200; màn sẵn sàng ẩn thanh dưới' }); }
  // v149 C66 (specs/010-toeic-10-de-tron): đề mới ở tệp riêng toeic-tron/ (câu CHỈ trong đề trọn, không vào kho luyện), đủ cơ cấu + câu trích ev có trong bài; chạy nhanh tới kết quả;
  // 📋 bài làm và đáp án (người sáng lập: "Sau khi làm bài xong thì sẽ có 1 phần hiện bài làm và đáp án"): lưu chuỗi 200 chữ, bảng 200 ô, xem lại cả bài có lời nghe / bài đọc, mở lại từ danh sách đề
  { const bad = [], S1 = S, H = () => String($app.innerHTML), P0 = trPlayUnit, evt = (sel, o) => ({ target: { closest: s => s === sel ? o : null } }), nrm = s => String(s).toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
    S = blank(); S.to = { target: 600 }; globalThis.trPlayUnit = () => new Promise(() => {}); TR.B = {}; TR.D = {}; TR.k = 1;
    try { await toLoad(); const cards0 = JSON.stringify(S.cards), NEW = (TO.tron || []).filter(d => d.f), bank = new Set(['p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7'].flatMap(s => TO[s].map(x => x.id)));
      if (NEW.length < 2) bad.push('cần ≥ 2 đề mới ở tệp riêng, có ' + NEW.length);
      for (const d of NEW) { if (!(await trLoad(d.id))) { bad.push(d.id + ': không tải được ' + d.f); continue; } const B = trB(d.id), by = {};
        for (const q of B.Q) by[TR_SECS[q.sec]] = (by[TR_SECS[q.sec]] || 0) + 1;
        if (B.Q.length !== 200 || B.Q.some((q, i) => q.n !== i + 1) || Object.values(by).join() !== '6,25,39,30,30,16,54') bad.push(d.id + ': sai cơ cấu ' + JSON.stringify(by));
        if (B.U.some(u => bank.has(u.x.id))) bad.push(d.id + ': có câu của kho luyện');
        for (const u of B.U) for (const q of u.qs) { const need = u.sec === 'p3' || u.sec === 'p4' || (u.sec === 'p7' && q.qt !== 'not' && q.qt !== 'insert'); if (!need) continue;
          const T = u.x.lines ? u.x.lines.map(l => l[1]).join(' ') : u.x.text || u.x.docs.map(dd => dd.title + ' ' + dd.text).join(' '); if (!q.ev || !nrm(T).includes(nrm(q.ev))) bad.push(d.id + ' câu ' + q.n + ': câu trích ev không có trong bài'); }
        if (!NCLIPS.size) try { NCLIPS = new Set(await (await fetch('n/index.json')).json()); } catch (e) {}   // SC-004: mọi câu nghe mới có giọng Kokoro
        const lines = B.L.flatMap(u => u.x.lines ? u.x.lines.map(l => l[1]) : kSents(u.x.text)), miss = lines.filter(t => !NCLIPS.has(clipKey(t))); if (miss.length) bad.push(d.id + ': ' + miss.length + ' / ' + lines.length + ' câu nghe thiếu giọng Kokoro');
        trStart(d.id); for (let i = 0; i < 60 && trSt().ph === 'L'; i++) trLNext(TR.tok); trClick(evt('[data-trrs]', {})); const st = trSt(); for (const q of B.Q) st.ans[q.n] = q.a; trSubmit(false);
        const m = toSt().mock.slice(-1)[0]; if (!H().includes('Kết quả ' + d.t) || m.tot !== 990 || m.de !== d.id) bad.push(d.id + ': chạy nhanh chưa ra kết quả đúng hết 990'); }
      if (['p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7'].some(s => TO[s].some(x => /^d\d\d-/.test(x.id)))) bad.push('câu đề mới lọt vào kho luyện TO.p1…p7');
      // 📋 bài làm và đáp án (Đề 1): 67 đúng · 67 sai · 66 bỏ trống
      trStart('de1'); const st = trSt(), B1 = trB('de1'); for (const q of B1.Q) { if (q.n % 3 === 1) st.ans[q.n] = q.a; else if (q.n % 3 === 2) st.ans[q.n] = q.opts.find(o => o !== q.a); } st.ph = 'R'; st.rAt = Date.now(); trSubmit(false);
      const A = (toSt().tronA || {}).de1; if (!A || A.a.length !== 200 || A.a[2] !== '-' || A.a[0] !== 'ABCD'[B1.Q[0].opts.indexOf(B1.Q[0].a)]) bad.push('chưa lưu đúng chuỗi bài làm');
      if (!H().includes('data-trsh="de1"') || !H().includes('67 đúng')) bad.push('kết quả thiếu lối 📋 Bài làm và đáp án');
      await trSheet('de1', null); let h = H();
      if ((h.match(/class="trc /g) || []).length !== 200 || (h.match(/class="trc ok"/g) || []).length !== 67 || (h.match(/class="trc no"/g) || []).length !== 67 || (h.match(/class="trc em"/g) || []).length !== 66) bad.push('bảng 200 ô sai màu / số ô');
      await trSheet('de1', null, 'no'); if ((H().match(/class="trc /g) || []).length !== 67) bad.push('lọc câu sai chưa đúng');
      trRv('de1', 35); h = H(); if (!h.includes('Lời nghe') || !h.includes('✓ Đáp án') || !h.includes('35.') || !h.includes('data-trrvp')) bad.push('xem lại câu 35 thiếu lời nghe / đáp án / nghe lại');
      trRv('de1', 160); h = H(); if (!h.includes('class="rvop') || !/Part 7/.test(h)) bad.push('xem lại Part 7 sai');
      const n0 = toSt().mock.length; await trView(); if (!H().includes('data-trsh="de1"') || !H().includes('Xem bài làm lần gần nhất')) bad.push('danh sách đề chưa có lối xem bài làm');
      if (toSt().mock.length !== n0) bad.push('xem lại làm đổi kết quả');
      if (JSON.stringify(S.cards) !== cards0) bad.push('đụng thẻ học (luật đo)');
    } catch (e) { bad.push('lỗi: ' + e.message); }
    globalThis.trPlayUnit = P0; TR.tok++; TR.on = ''; TR.k = 1; S = S1; EX_PART = 'san';
    out.push({ lv: 'cefr', id: 'C66', ok: !bad.length, msg: bad.length ? bad.slice(0, 8).join(' | ') : '🎓 đề thử trọn: đề mới ở tệp riêng (' + ((TO.tron || []).filter(d => d.f).length) + ' đề × 200 câu, không câu nào vào kho luyện, câu trích ev có trong bài, chạy nhanh ra 990); 📋 bài làm và đáp án: lưu chuỗi 200 chữ, bảng 200 ô đúng màu, lọc câu sai, xem lại có lời nghe / bài đọc, mở lại từ danh sách đề, không đổi kết quả' }); }
  // v150 C67 chỉ làm một phần (người sáng lập 8/11/2026: "muốn có thể lựa chọn phần để làm bài chứ không nhất thiết phải làm hết từ đầu")
  { const bad = [], S1 = S, H = () => String($app.innerHTML), P0 = trPlayUnit, evt = (sel, o) => ({ target: { closest: s => s === sel ? o : null } });
    S = blank(); S.to = { target: 600 }; globalThis.trPlayUnit = () => new Promise(() => {}); TR.B = {}; TR.k = 1;
    try { await toLoad(); const cards0 = JSON.stringify(S.cards), B = trB('de1');
      await trReady('de1'); let h = H();
      if (!h.includes('Hoặc chỉ làm một phần') || !h.includes('data-trone="L"') || !h.includes('data-trone="R"') || ['p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7'].some(s => !h.includes('data-trone="' + s + '"'))) bad.push('màn sẵn sàng thiếu chọn phần');
      // Part 3 riêng: bắt đầu ở câu 32, chỉ 13 bài, xong thì nộp luôn (không sang Đọc)
      trStart('de1', 'p3'); let st = trSt(); if (st.only !== 'p3' || st.ph !== 'L' || !H().includes('câu 32–34/200')) bad.push('Part 3 chưa bắt đầu ở câu 32');
      const q32 = B.Q[31]; trClick(evt('[data-tra]', { dataset: { tra: '32|' + q32.opts.indexOf(q32.a) } })); if (st.ans['32'] !== q32.a) bad.push('Part 3: chọn câu đang phát không ghi');
      const nM = (toSt().mock || []).length; for (let i = 0; i < 20 && trSt(); i++) trLNext(TR.tok);
      let p = (toSt().tronP || []).slice(-1)[0]; if (trSt() || !p || p.o !== 'p3' || p.n !== 39 || p.ok !== 1 || !H().includes('Kết quả · Part 3') || !H().includes('1/39 câu đúng')) bad.push('Part 3 nộp sai: ' + JSON.stringify(p));
      if ((toSt().mock || []).length !== nM) bad.push('làm một phần lọt vào điểm đề thử trọn');
      // Part 6 riêng: vào thẳng Đọc, 9 phút, 4 đoạn, bảng câu 131–146
      trStart('de1', 'p6'); st = trSt(); if (st.ph !== 'R' || !st.rAt || !H().includes('câu 131–134/200') || !H().includes('Bảng câu 131–146 · đã chọn 0/16')) bad.push('Part 6 chưa vào thẳng Đọc');
      if (Math.abs(trLeft(st) - 9 * 60000) > 5000) bad.push('Part 6 sai giờ');
      for (const q of B.Q) if (q.sec === 'p6') st.ans[q.n] = q.a; trClick(evt('[data-trg]', {})); if ((H().match(/class="trc/g) || []).length !== 16) bad.push('bảng câu Part 6 không đủ 16 ô');
      trSubmit(false); p = toSt().tronP.slice(-1)[0]; if (p.ok !== 16 || p.n !== 16 || !H().includes('data-trre')) bad.push('Part 6 đúng hết chưa ra 16/16');
      const A = toSt().tronA['de1:p6']; if (!A || A.o !== 'p6' || (toSt().tronA || {}).de1) bad.push('📋 bài làm một phần chưa lưu riêng');
      await trSheet('de1', null, '', 'p6'); if ((H().match(/class="trc /g) || []).length !== 16 || !H().includes('chỉ Part 6')) bad.push('📋 bảng một phần không đủ 16 ô');
      // cả phần Đọc: 75 phút, có điểm ước Đọc; hết giờ tự nộp
      trStart('de1', 'R'); st = trSt(); st.rAt = Date.now() - 76 * 60000; trR(); p = toSt().tronP.slice(-1)[0]; if (!p || p.o !== 'R' || !p.auto || p.n !== 100 || p.sc == null || !H().includes('điểm Đọc')) bad.push('cả phần Đọc hết giờ chưa tự nộp / thiếu điểm ước');
      // đề dở một phần: ô làm tiếp ghi rõ phần
      trStart('de1', 'p5'); await trView(); if (!H().includes('Chỉ Part 5')) bad.push('đề dở một phần chưa ghi rõ phần'); toSt().tron = null;
      if (JSON.stringify(S.cards) !== cards0) bad.push('đụng thẻ học (luật đo)');
    } catch (e) { bad.push('lỗi: ' + e.message); }
    globalThis.trPlayUnit = P0; TR.tok++; TR.on = ''; TR.k = 1; S = S1; EX_PART = 'san';
    out.push({ lv: 'cefr', id: 'C67', ok: !bad.length, msg: bad.length ? bad.slice(0, 8).join(' | ') : '🎓 đề thử trọn: chỉ làm một phần (cả Nghe / cả Đọc / một Part): bắt đầu đúng câu, Part 5–7 vào thẳng Đọc có giờ riêng, xong Part Nghe nộp luôn, kết quả + 📋 bài làm lưu riêng, không vào điểm đề thử trọn, không đụng thẻ học' }); }
  // v151 C68 làm từng lượt ~10 câu (người sáng lập 8/11/2026: "tách lần 10 câu làm để chấm điểm chứ không muốn làm 1 mạch dài")
  { const bad = [], S1 = S, H = () => String($app.innerHTML), P0 = trPlayUnit;
    S = blank(); S.to = { target: 600 }; globalThis.trPlayUnit = () => new Promise(() => {}); TR.B = {}; TR.k = 1;
    try { await toLoad(); const cards0 = JSON.stringify(S.cards), B = trB('de1'), C = trCks(B);
      if (C.length < 15 || C.some(c => c.n < 5 || c.n > 12) || C.reduce((t, c) => t + c.n, 0) !== 200) bad.push('chia lượt sai: ' + C.map(c => c.n).join(','));
      if (B.U.some(u => u.qs.some(q => q.ck !== u.ck))) bad.push('lượt cắt ngang một bài');
      if (C.some(c => B.U.filter(u => u.ck === c.k).some(u => u.cp !== c.p))) bad.push('lượt vắt qua Nghe → Đọc');
      await trReady('de1'); let h = H(); if (!h.includes('Hoặc làm từng lượt 10 câu') || !h.includes('data-trone="cL0"') || !h.includes('Lượt 1 · câu 1–10') || (h.match(/data-trone="c[LR][0-9]+"/g) || []).length !== C.length + 1) bad.push('màn sẵn sàng thiếu lượt');
      // lượt 1 (Nghe): 10 câu, xong thì chấm ngay, có nút lượt 2
      trStart('de1', 'cL0'); let st = trSt(); if (st.ph !== 'L' || !H().includes('câu 1/200')) bad.push('lượt 1 chưa bắt đầu ở câu 1');
      st.ans['1'] = B.Q[0].a; for (let i = 0; i < 15 && trSt(); i++) trLNext(TR.tok);
      let p = (toSt().tronP || []).slice(-1)[0]; h = H();
      if (trSt() || !p || p.o !== 'cL0' || p.n !== 10 || p.ok !== 1 || !h.includes('Lượt 1 · câu 1–10') || !h.includes('1/10 câu đúng') || !h.includes('data-trnx="cL1"')) bad.push('lượt 1 chấm sai: ' + JSON.stringify(p));
      if ((toSt().mock || []).length) bad.push('lượt lọt vào điểm đề thử trọn');
      // lượt Đọc: vào thẳng, có giờ theo nhịp Part, bảng câu chỉ câu của lượt
      const cR = C.find(c => c.p === 'R'), id = 'cR' + cR.k; trStart('de1', id); st = trSt();
      if (st.ph !== 'R' || !st.rMin || st.rMin > 10 || !H().includes('Bảng câu ' + cR.a + '–' + cR.b + ' · đã chọn 0/' + cR.n)) bad.push('lượt Đọc sai: ' + st.rMin);
      for (const q of B.Q) if (q.ck === cR.k) st.ans[q.n] = q.a; trSubmit(false); p = toSt().tronP.slice(-1)[0];
      if (p.ok !== cR.n || !H().includes(cR.n + '/' + cR.n + ' câu đúng') || !H().includes('data-trnx="cR' + (cR.k + 1) + '"')) bad.push('lượt Đọc đúng hết chưa chấm đúng');
      await trSheet('de1', null, '', id); if ((H().match(/class="trc /g) || []).length !== cR.n || !H().includes('Lượt ' + (cR.k + 1))) bad.push('📋 bảng của lượt sai số ô');
      // màn sẵn sàng: lượt kế tiếp chưa làm là lượt 2, chip đã làm có ✓
      await trReady('de1'); h = H(); if (!h.includes('▶ Lượt 2 · câu 11–20') || !h.includes('✓ 1–10 · 1/10')) bad.push('màn sẵn sàng chưa đánh dấu lượt đã làm');
      // lượt cuối: không có nút lượt kế
      const cZ = C[C.length - 1]; trStart('de1', 'c' + cZ.p + cZ.k); trSubmit(false); if (H().includes('data-trnx')) bad.push('lượt cuối còn nút lượt kế');
      if (JSON.stringify(S.cards) !== cards0) bad.push('đụng thẻ học (luật đo)');
    } catch (e) { bad.push('lỗi: ' + e.message); }
    globalThis.trPlayUnit = P0; TR.tok++; TR.on = ''; TR.k = 1; S = S1; EX_PART = 'san';
    out.push({ lv: 'cefr', id: 'C68', ok: !bad.length, msg: bad.length ? bad.slice(0, 8).join(' | ') : '🎓 đề thử trọn: làm từng lượt ~10 câu (không cắt ngang bài, không vắt qua Nghe → Đọc), chấm ngay mỗi lượt, nút lượt kế tiếp, lượt Đọc có giờ theo nhịp Part, 📋 bài làm theo lượt, màn sẵn sàng đánh dấu lượt đã làm, không vào điểm đề trọn, không đụng thẻ học' }); }
  return out; })()`);
// v141 C58 chống đề trùng (hàm thuần của máy chủ de-ai, chạy thẳng bằng node)
{ const T = await import('../../supabase/functions/de-ai/trung.js'), C = await import('../../supabase/functions/de-ai/chude.js'), bad = [];
  const A = 'The Silk Road was not a single road but a network of routes that linked China with Central Asia, India, Persia and the Mediterranean. Merchants rarely travelled the whole length; instead goods passed from hand to hand across many markets. Silk, spices, paper and glass moved along these routes, and so did ideas and inventions. Historians now argue that the exchange of knowledge was at least as important as the exchange of goods.';
  const B = 'Coral reefs cover less than one percent of the ocean floor, yet they support about a quarter of all marine species. Rising sea temperatures cause corals to expel the algae that feed them, a process known as bleaching. Scientists are now growing fragments of heat-tolerant coral in underwater nurseries and transplanting them to damaged reefs. Early results suggest that restored areas can recover fish populations within a few years, although the work is slow.';
  const d1 = { title: 'Trade on the Silk Road', topic: 'Trade along the Silk Road', text: A, groups: [{ items: [{ q: 'Merchants usually travelled the entire route.' }] }] };
  const d2 = { title: 'Restoring coral reefs', topic: 'Restoring damaged coral reefs', text: B, groups: [{ items: [{ q: 'Corals expel algae when water gets warmer.' }] }] };
  if (T.isDup(d2, [{ chude: 'ac-silk', de: d1 }], { chude: 'ac-coral' })) bad.push('hai bài khác chủ đề bị coi là trùng');
  if (!T.isDup(d2, [{ chude: 'ac-coral', de: d1 }], { chude: 'ac-coral' })) bad.push('cùng chủ đề không bị bắt');
  if (T.isDup(d2, [{ chude: 'ac-coral', de: d1 }], { chude: 'ac-coral', goc: true })) bad.push('hết chủ đề, cố ý dùng lại (goc) vẫn bị chặn');
  const half = A.split('. ').slice(0, 2).join('. ') + '. ' + B; if (!T.isDup({ title: 'x y z', text: half, groups: [] }, [{ de: d1 }], {})) bad.push('bài chép lại ~30% không bị bắt');
  if (!T.isDup({ title: 'Other title here', text: B, groups: [{ items: [{ q: 'merchants usually travelled the ENTIRE route!' }] }] }, [{ de: d1 }], {})) bad.push('câu hỏi giống hệt không bị bắt');
  if (!T.isDup({ title: 'Trade on the Silk Road', text: B, groups: [] }, [{ de: d1 }], {})) bad.push('tên đề giống không bị bắt');
  const olds = [1, 2, 3].map(i => ({ chude: 'x' + i, de: { title: 'T' + i } })); if (!T.isDup({ title: 'T3' }, olds, {})) bad.push('không so tới đề thứ 3');
  const p = T.pickTopic(C.AC, new Map(C.AC.slice(1).map((x, i) => [x.k, i + 1]))); if (p.k !== C.AC[0].k || p.goc) bad.push('pickTopic không lấy chủ đề chưa gặp');
  const q = T.pickTopic(C.AC, new Map(C.AC.map((x, i) => [x.k, i === 5 ? 1 : 100 + i]))); if (q.k !== C.AC[5].k || !q.goc) bad.push('hết chủ đề: không lấy chủ đề cũ nhất + goc');
  const all = ['AC', 'GT', 'W1', 'W2', 'W3', 'S1', 'S2', 'TO', 'CL', 'CM', 'CH'].flatMap(k => C[k].map(x => x.k)); if (new Set(all).size !== all.length || all.some(k => k.length > 40)) bad.push('CHU_DE trùng khoá / khoá quá dài');
  if (C.AC.length < 40 || C.TO.length < 25 || C.CL.length < 20 || C.chuDe('ielts-gt', 'doc', 'R-gt') !== C.GT || C.chuDe('cb-c1', 'doc', 'mc') !== C.CH) bad.push('danh sách chủ đề thiếu / chọn sai');
  R.push({ lv: 'cefr', id: 'C58', ok: !bad.length, msg: bad.length ? bad.join(' | ') : 'chống đề trùng: so ≥ 3 đề gần nhất (tới 50), cùng chủ đề / tên / câu hỏi / ≥ 15% cụm 5 từ là trùng, bài khác chủ đề không trùng, chọn chủ đề chưa gặp, hết thì lấy chủ đề cũ nhất + đổi góc nhìn; ' + all.length + ' chủ đề không trùng khoá' }); }
// v144 C61 đề AI bám khuôn đề thật (specs/006-de-ai-bam-de-that): bảng khuôn của máy chủ (khuon.js) khớp danh sách dạng của trang và bảng đề thật; máy kiểm thứ tự / câu trích / câu chèn / biểu đồ / số từ / số người nói
{ const K = await import('../../supabase/functions/de-ai/khuon.js'), bad = [], i = R.findIndex(r => r.id === 'C61-trang'), T = i >= 0 ? R.splice(i, 1)[0] : { ok: false, msg: 'thiếu phần trang', x: {} };
  if (!T.ok) bad.push(T.msg);
  for (const [key, list] of Object.entries(T.x || {})) { const ky = key.split('|')[0]; for (const [dang, sk] of list) if (!K.spec(ky, sk, dang)) bad.push(`trang có ${ky} ${sk} ${dang} mà máy chủ không có`); }
  for (const [ky, sk, dang] of [['cb-pre', 'doc', 'mc'], ['cb-a1', 'doc', 'mc'], ['cb-pre', 'nghe', 'mc'], ['cb-a1', 'nghe', 'mc'], ['cb-pre', 'viet', 'w'], ['cb-a1', 'viet', 'w'], ['ielts-ac', 'nghe', 'L-sa']]) if (K.spec(ky, sk, dang)) bad.push(`còn dạng ngoài đề thật: ${ky} ${sk} ${dang}`);
  const E = (ky, sk, dang, f) => { const s = K.spec(ky, sk, dang); if (!s) return bad.push(`thiếu khuôn ${ky} ${sk} ${dang}`); const m = f(s, ty => K.rule(s, ty)); if (m) bad.push(`${ky} ${sk} ${dang}: ${m}`); };
  for (const d of ['R-tf', 'R-yn', 'R-mc', 'R-comp', 'R-sa', 'R-h', 'R-mi', 'R-mf', 'R-se', 'R-sum', 'R-dia']) E('ielts-ac', 'doc', d, s => s.ask === 13 && s.q[0] === 12 && s.w[0] === 700 && s.w[1] === 900 && s.min === 20 && s.main === d ? '' : 'IELTS Đọc không phải 1 bài 700–900 từ, 13 câu, 20 phút');
  for (const d of ['L-form', 'L-match', 'L-mc', 'L-note']) E('ielts-ac', 'nghe', d, s => s.ask === 10 && /Part [1-4]$/.test(s.part) ? '' : 'IELTS Nghe không phải 1 Part 10 câu');
  E('ielts-ac', 'nghe', 'L-note', (s, r) => s.sp[1] === 1 && r('L-form').lim === 1 ? '' : 'Part 4 cần 1 người nói, ONE WORD ONLY');
  E('ielts-ac', 'noi', 'p1', s => s.p1 && s.p1[0] === 9 ? '' : 'Nói Part 1 cần 9–12 câu');
  for (const lv of ['b2', 'b2p', 'c1', 'c2']) for (const d of ['cloze', 'open', 'wf']) E('cb-' + lv, 'doc', d, s => s.q[0] === 8 ? '' : 'cần 8 chỗ trống');
  E('cb-b2', 'doc', 'kwt', (s, r) => r('kwt').limMin === 2 && r('kwt').lim === 5 ? '' : 'viết lại câu B2 2–5 từ');
  E('cb-c1', 'doc', 'kwt', (s, r) => r('kwt').limMin === 3 && r('kwt').lim === 6 ? '' : 'viết lại câu C1 3–6 từ');
  E('cb-c2', 'doc', 'kwt', (s, r) => r('kwt').limMin === 3 && r('kwt').lim === 8 ? '' : 'viết lại câu C2 3–8 từ');
  for (const lv of ['c1', 'c2']) E('cb-' + lv, 'nghe', 'mc', (s, r) => r('mc').nopt === 4 ? '' : 'nghe phỏng vấn cần 4 lựa chọn');
  for (const lv of ['a2', 'b1', 'b2']) E('cb-' + lv, 'nghe', 'mc', (s, r) => r('mc').nopt === 3 ? '' : 'nghe trắc nghiệm cần 3 lựa chọn');
  for (const [lv, n] of [['a2', 5], ['b1', 6], ['b2', 10], ['c1', 8], ['c2', 9]]) E('cb-' + lv, 'nghe', 'gap', s => s.q[0] === n ? '' : `nghe điền cần ${n} câu`);
  E('cb-a2', 'doc', 'sn', s => s.q[0] === 6 ? '' : 'A2 tin ngắn 6 câu'); E('cb-b1', 'doc', 'sn', s => s.q[0] === 5 ? '' : 'B1 tin ngắn 5 câu');
  E('cb-a1', 'doc', 'cloze', (s, r) => s.q[0] === 5 && r('cloze').nopt === 3 ? '' : 'Movers điền trắc nghiệm 5 chỗ, 3 lựa chọn');
  E('cb-b2', 'doc', 'mc', s => s.w[0] >= 550 && /Part 5$/.test(s.part) ? '' : 'bài đọc B2 phần 5 quá ngắn / sai phần');
  const it = (q, a, ev, o) => ({ q, o: o || [], a, acc: [], why_vi: 'vì', ev: ev || '' }), P = (ky, sk, dang) => ({ ky, sk, dang, muc: '' });
  const base = { title: 'T', topic: 't', gist: 'g', vi: 'v', text: '', lines: [], voices: [], groups: [], task: { part: '', p: '', pv: '', min: 0, max: 0, genre: '', m: '', chart: { kind: '', title: '', unit: '', cats: [], series: [] } }, speak: { p1: [], p2: { t: '', b: [] }, p3: [] } };
  const txt = 'A. ' + 'filler words here. '.repeat(80) + 'The river flooded in 1990. ' + 'more filler words. '.repeat(60) + 'Farmers moved north later. ' + 'final filler text. '.repeat(70);
  const r1 = K.clean({ ...base, text: txt, groups: [{ ty: 'R-tf', inst: '', opts: [], lim: 0, items: [it('Farmers moved north.', 'TRUE', 'Farmers moved north later.'), it('The river flooded in 1990.', 'TRUE', 'The river flooded in 1990.'), it('S3', 'FALSE'), it('S4', 'NOT GIVEN'), it('S5', 'FALSE')] },
    { ty: 'R-comp', inst: '', opts: [], lim: 0, items: ['river', 'north', 'filler', 'words', 'here', 'more', 'final', 'text'].map((a, j) => it(`Sentence ${j} ______`, a)) }] }, K.spec('ielts-ac', 'doc', 'R-tf'), P('ielts-ac', 'doc', 'R-tf'));
  if (r1.hard.length || r1.de.groups[0].items[0].q !== 'The river flooded in 1990.' || r1.de.v !== 2 || !r1.de.part) bad.push('máy kiểm không xếp câu theo thứ tự bài / thiếu phần đề thật: ' + r1.hard.join('; '));
  const r1b = K.clean({ ...base, text: txt, groups: [{ ty: 'R-comp', inst: '', opts: [], lim: 0, items: ['river', 'north', 'filler', 'words', 'here', 'more', 'final', 'text', 'river flooded', 'moved north', 'more filler', 'final filler', 'words here'].map((a, j) => it(`Sentence ${j} ______`, a)) }] }, K.spec('ielts-ac', 'doc', 'R-tf'), P('ielts-ac', 'doc', 'R-tf'));
  if (!r1b.hard.some(h => /nhóm R-tf/.test(h))) bad.push('đề thiếu nhóm dạng đã chọn không bị bắt');
  const L3 = [{ who: 'A', s: 'The printer on the third floor is broken again, so I sent the slides to you by email this morning.' }, { who: 'B', s: 'I will see what I can do before the meeting starts at ten. We still need the report, the charts and the agenda for everyone in the room.' }, { who: 'A', s: 'Thanks. The client arrives early, so we should set up the projector first and test the sound system as well. Let me know if you need a hand.' }];
  const r3 = K.clean({ ...base, lines: L3, voices: [{ who: 'A', g: 'f' }, { who: 'B', g: 'm' }], groups: [{ ty: 'p3', inst: '', opts: [], lim: 0, items: [
      it('What does the man mean when he says, "I will see what I can do"?', 'He will try to help.', '', ['He will try to help.', 'He is busy.', 'He will leave.', 'He needs a printer.']),
      it('What does the woman mean when she says, "We are fully booked"?', 'She has no time.', '', ['She has no time.', 'She is hungry.', 'She is late.', 'She is happy.']),
      it('What is broken?', 'The printer', '', ['The printer', 'The phone', 'The door', 'The car'])] }] }, K.spec('toeic', 'nghe', 'p3'), P('toeic', 'nghe', 'p3'));
  if (r3.de.groups[0].items.length !== 2 || !r3.soft.includes('câu trích không có trong bài')) bad.push('câu hàm ý trích sai không bị bỏ');
  const d7 = '### Email\n' + 'Dear team, our office will move next month. '.repeat(12) + 'Please pack your desks by Friday.', sp7 = K.spec('toeic', 'doc', 'p7');
  const ins = it('In which of the positions marked [1], [2], [3], and [4] does the following sentence best belong? "Boxes are in room 2."', '[2]', '');
  const r7 = K.clean({ ...base, text: d7, groups: [{ ty: 'p7', inst: '', opts: [], lim: 0, items: [ins, it('Why was the email sent?', 'To announce a move', '', ['To announce a move', 'To hire staff', 'To sell desks', 'To close the office']), it('When must desks be packed?', 'By Friday', '', ['By Friday', 'Today', 'On Monday', 'Next year'])] }] }, sp7, P('toeic', 'doc', 'p7'));
  const r7b = K.clean({ ...base, text: d7.replace('move next month.', 'move next month. [1] [2] [3] [4]'), groups: [{ ty: 'p7', inst: '', opts: [], lim: 0, items: [ins] }] }, sp7, P('toeic', 'doc', 'p7'));
  if (r7.de.groups[0].items.some(x => /positions marked/.test(x.q)) || !r7b.de.groups.length || r7b.de.groups[0].items[0].a !== '[2]' || r7b.de.groups[0].items[0].o.join() !== '[1],[2],[3],[4]') bad.push('câu chèn câu [1]–[4] kiểm sai');
  const kw = ky => K.clean({ ...base, groups: [{ ty: 'kwt', inst: '', opts: [], lim: 0, items: [it('He started early.\nTIME\nHe ______ to start.', 'had plenty of time in order to', '')] }] }, K.spec(ky, 'doc', 'kwt'), P(ky, 'doc', 'kwt'));
  if (!kw('cb-c2').de.groups.length || kw('cb-b2').de.groups.length) bad.push('giới hạn từ viết lại câu theo cấp sai');
  const ch = c => K.clean({ ...base, task: { ...base.task, p: 'The charts below show…', min: 150, chart: c } }, K.spec('ielts-ac', 'viet', 't1'), P('ielts-ac', 'viet', 't1'));
  const okc = ch({ kind: 'line', title: 'T', unit: 'million', cats: ['2000', '2010', '2020'], series: [{ name: 'A', v: [1, 2, 3] }] }), badc = ch({ kind: 'pie', title: 'T', unit: '%', cats: ['a', 'b', 'c'], series: [{ name: '2020', v: [10, 20, 30] }] });
  if (okc.hard.length || !okc.de.task.chart || okc.de.task.chart.kind !== 'line' || !badc.hard.some(h => /biểu đồ/.test(h))) bad.push('kiểm biểu đồ Task 1 sai');
  const snq = K.clean({ ...base, groups: [{ ty: 'sn', inst: '', opts: [], lim: 0, items: [it('CLOSED ON MONDAY. Back on Tuesday at 9.\nWhat does the notice say?', 'The shop opens again on Tuesday.', '', ['The shop opens again on Tuesday.', 'The shop is closed every day.', 'The shop opens at 9 on Monday.']), it('word '.repeat(80) + '\nWhat?', 'x', '', ['x', 'y', 'z'])] }] }, K.spec('cb-a2', 'doc', 'sn'), P('cb-a2', 'doc', 'sn'));
  if (snq.de.groups[0].items.length !== 1) bad.push('tin ngắn quá dài không bị bỏ');
  const two = K.clean({ ...base, lines: [{ who: 'A', s: 'Hello.' }, { who: 'B', s: 'Hi.' }], groups: [] }, K.spec('ielts-ac', 'nghe', 'L-note'), P('ielts-ac', 'nghe', 'L-note'));
  if (!two.hard.some(h => /người nói/.test(h))) bad.push('Part 4 hai người nói không bị bắt');
  const nDang = Object.values(T.x || {}).reduce((a, l) => a + l.length, 0);
  R.push({ lv: 'cefr', id: 'C61', ok: !bad.length, msg: bad.length ? bad.slice(0, 8).join(' | ') : `đề AI bám khuôn đề thật: ${nDang} dạng ở trang (mọi kỳ thi × cấp) đều có khuôn ở máy chủ, Pre-A1 / A1 không còn dạng ngoài đề thật (không Viết AI), IELTS Đọc 1 bài 700–900 từ 13 câu 20 phút, IELTS Nghe 1 Part 10 câu, Nói Part 1 9–12 câu, Cambridge B2 → C2 điền 8 chỗ, viết lại câu B2 2–5 · C1 3–6 · C2 3–8 từ, nghe C1 / C2 4 lựa chọn, nghe điền theo cấp; máy kiểm xếp câu theo thứ tự bài, bắt thiếu nhóm dạng đã chọn, bỏ câu trích sai / câu chèn thiếu dấu / tin ngắn quá dài, kiểm biểu đồ Task 1, số người nói; đề cũ v1 vẫn mở, Task 1 biểu đồ AI vẽ được` }); }
// v153 C69 bộ kiểm nội dung đề TOEIC (specs/011-kiem-noi-dung-de): mọi luật bắt đúng câu cài lỗi của nó, câu sạch không bị báo, mã luật có trong bộ tiêu chí,
//   luật giải mù (chưa giải / lệch / 2 phương án / câu đã sửa / đã xem); cổng phát hành: mọi đề trọn 0 lỗi, 0 cảnh báo chưa xem, đã giải mù
{ const fs = await import('node:fs'), K = await import('../kiem-toeic.mjs'), M = JSON.parse(fs.readFileSync(new URL('kiem-mau.json', import.meta.url), 'utf8')), bad = [], CONG = false;
  for (const c of M.sai) { const f = K.kiemUnit(c.sec, c.x); if (!f.some(r => r.ma === c.ma)) bad.push('không bắt ' + c.ma + ' ở ' + c.x.id); }
  const cov = new Set(M.sai.map(c => c.ma)); for (const r of K.RULES) if (!cov.has(r.ma)) bad.push('luật ' + r.ma + ' chưa có câu cài lỗi');
  for (const c of M.sach) { const f = K.kiemUnit(c.sec, c.x); if (f.length) bad.push('câu sạch ' + c.x.id + ' bị báo ' + f.map(r => r.ma).join(',')); }
  const doc = fs.readFileSync(K.root + 'docs/TIEU-CHI-DE-TOEIC.md', 'utf8'); for (const r of K.ALL_RULES) if (!doc.includes('`' + r.ma + '`')) bad.push('bộ tiêu chí thiếu ' + r.ma);
  { const x = M.sach.find(c => c.sec === 'p5').x, d = { id: 'mau', p1: [], p2: [], p3: [], p4: [], p5: [x], p6: [], p7: [] }, [u] = K.units(d), dd = K.dau(u), L = u.qs[0].L, o2 = 'ABCD'.replace(L, '')[0];
    const ma = (cau, ack) => K.kiemDe(d, { ack: ack || [], gm: { cau } }).filter(f => !f.da_xem).map(f => f.ma);
    if (!ma({}).includes('GM-CHUA')) bad.push('không báo câu chưa giải mù');
    if (!K.kiemDe(d, { ack: [], gm: null }).some(f => f.ma === 'GM-CHUA')) bad.push('không báo đề chưa giải mù');
    if (!ma({ 1: { id: x.id, dau: dd, da: L, chon: o2, chac: 2 } }).includes('GM-LECH')) bad.push('không báo giải mù chọn khác đáp án');
    if (!ma({ 1: { id: x.id, dau: dd, da: L, chon: L, hai: o2, chac: 2 } }).includes('GM-HAI')) bad.push('không báo giải mù thấy 2 phương án');
    if (!ma({ 1: { id: x.id, dau: 'khac', da: L, chon: L, chac: 3 } }).includes('GM-CU')) bad.push('không báo câu đã sửa sau giải mù');
    if (ma({ 1: { id: x.id, dau: dd, da: L, chon: L, chac: 3 } }).length) bad.push('giải mù khớp mà vẫn báo');
    if (ma({ 1: { id: x.id, dau: dd, da: L, chon: o2, chac: 2 } }, [{ id: x.id, ma: 'GM-LECH', dau: dd, ly_do: 'x' }]).length) bad.push('ghi "đã xem" không tắt cảnh báo');
    if (!ma({ 1: { id: x.id, dau: 'khac', da: L, chon: L } }, [{ id: x.id, ma: 'GM-CU', dau: dd, ly_do: 'x' }]).includes('GM-CU')) bad.push('GM-CU ghi "đã xem" được (không được phép)'); }
  const T0 = Date.now(), A = K.kiemTatCa(), ms = Date.now() - T0, nde = Object.keys(A.R).length;
  if (ms > 60000) bad.push('máy kiểm chạy quá 1 phút (' + ms + ' ms)');
  if (A.loi) bad.push(A.loi + ' lỗi nội dung ở đề trọn (node tools/kiem-toeic.mjs)');
  if (CONG && A.canh) bad.push(A.canh + ' cảnh báo chưa xem (node tools/kiem-toeic.mjs)');
  R.push({ lv: 'cefr', id: 'C69', ok: !bad.length, msg: bad.length ? bad.slice(0, 8).join(' | ') : `bộ kiểm nội dung đề TOEIC: ${K.RULES.length} luật máy bắt đủ ${M.sai.length} câu cài lỗi, ${M.sach.length} câu sạch không bị báo, luật giải mù đúng; ${nde} đề trọn: 0 lỗi${CONG ? ', 0 cảnh báo chưa xem, đã giải mù' : ' (cổng cảnh báo chưa bật: ' + A.canh + ' chưa xem)'} · ${ms} ms` }); }
let fail = 0; for (const r of R) { if (!r.ok) fail++; console.log(`${r.ok ? '✅' : '❌'} ${r.lv.padEnd(3)} ${r.id}  ${r.msg}`); }
console.log(fail ? `\n${fail} tiêu chí chưa đạt` : '\nĐạt hết'); process.exit(fail ? 1 : 0);
