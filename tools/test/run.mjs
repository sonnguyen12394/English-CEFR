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
    for (const x of kItems(KIT.viet, lv).filter(x => !x.kind)) if (!kWrite(x).check(kModel(x)).ok) bad.push('viết mẫu:' + x.id);
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
    for (const x of kItems(KIT.viet, lv).filter(x => !x.kind)) { const m = kModel(x), r = kWrite(x).check(m); if (wErrors(m).length) bad.push('viết mẫu bị báo lỗi:' + x.id + ' ' + wErrors(m).map(e => e[0]).join('|')); if (r.sc < 0.8) bad.push('viết mẫu < 80%:' + x.id + ' ' + Math.round(r.sc * 100)); }
    if (lv === 'pre' && wErrors("i am agree. He don't like it. I can to swim since three years.").length < 4) bad.push('bộ bắt lỗi Viết không bắt được lỗi');
    add(lv, 'X5', !bad.length, bad.length ? bad.length + ' lỗi: ' + [...new Set(bad)].slice(0, 10).join(', ') : 'mọi câu hợp lệ');
  }
  // 🌏 Học IELTS (ielts.js): màn mở được; đề thử mọi bài sinh câu hợp lệ (Academic + General Training); bài mẫu Viết máy ước ≥ 6.0, bài rác ≤ 4.5;
  // bài nói mẫu ≥ 5.5, im lặng không chấm; bảng quy đổi điểm thô → band và cách làm tròn đúng quy ước IELTS
  { const bad = [], errs = [], tryv = (n, f) => { try { f(); } catch (e) { errs.push(n + ': ' + e.message); } }; await ieLoad(); delete S.ie;
    for (const ty of ['ac', 'gt']) { ieSt().type = ty; await ieltsView(); { const h0 = String($app.innerHTML); if (!h0.includes('🌏 IELTS ') || !['L', 'R', 'W', 'S'].every(k => h0.includes('data-iesk="' + k + '"')) || h0.includes('class="btnbig') || !h0.includes('class="grid2"') || !h0.includes('data-iemk="all"')) bad.push('màn IELTS ' + ty + ' (v122: như màn Nền: lưới 4 ô, không nút to, thi thử trong Thêm)'); }
      for (const k of ['L', 'R', 'W', 'S']) { try { ieSkView(k); const hk = String($app.innerHTML); if (!hk.includes('data-iehome') || !/data-ie[lrws]=/.test(hk) || !hk.includes('class="steps3"') || !hk.includes('data-iehow="' + k + '"') || !hk.includes('data-iebt="' + k + '"') || !hk.includes('data-iebai="' + k + '|')) bad.push('màn con IELTS ' + k + ' thiếu nút / khuôn 3 bước'); } catch (e) { bad.push('màn con IELTS ' + k + ': ' + e.message); } }
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
    await overview('a1'); const ov = String($app.innerHTML); if (ov.includes('📅 Hôm nay') || ov.includes('Việc hôm nay') || !ov.includes('data-exthi')) bad.push('📚 Học còn ô Hôm nay / kế hoạch (v111: chỉ nội dung)'); delete S.lt;
    // v86 hiện dần: người mới chưa thấy 🧰 luyện thi (chỉ một dòng báo), không còn ▶ Nên làm / 🗓 Gợi ý ~45 phút trái mục tiêu phút
    if (ov.includes('id="ovtools"') || ov.includes('data-mock') || !ov.includes('🧱 Nền tiếng Anh') || ov.includes('Gợi ý mỗi ngày') || ov.includes('▶ Nên làm')) bad.push('Tổng quan người mới chưa gọn');
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
    const u = UNITS.find(x => x.lv === 'a1'); await tryv('mở bài học', () => learn(u)); if (!String($app.innerHTML).includes('⚡ Bài tập nhanh trước bài học')) bad.push('bài học không mở kiểm tra đầu bài');
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
    if (/data-g="admin"/.test(gyHomeInner())) bad.push('người ẩn danh thấy Quản lý góp ý');
    user = { id: 'chung', email: AUTO.email }; tryv('dữ liệu chung', () => backup()); if (!String($app.innerHTML).includes('data-bk="split"')) bad.push('tài khoản chung thiếu nút tách máy');
    if (!/data-g="admin"/.test(gyHomeInner())) bad.push('tài khoản chung mất Quản lý góp ý'); user = u0;
    if (gaKind('sai') !== '⚑ Câu sai') bad.push('thiếu loại góp ý ⚑ Câu sai');
    const s0 = ovStat('tv', 'pre'); if (!s0 || s0.nl !== Math.ceil(levelWords('pre').length * GATE_LEARN / 100) || !(s0.nm > 0)) bad.push('còn thiếu sai: ' + JSON.stringify(s0 && [s0.nl, s0.nm]));
    if (!ovNeedLine(s0, true).includes('từ chưa học')) bad.push('thẻ phần thiếu dòng còn thiếu');
    await overview('pre'); const h = String($app.innerHTML), nb = (h.match(/<button/g) || []).length, nt = h.replace(/<[^>]+>/g, ' ').replace(/\\s+/g, ' ').length;
    if (nb > 20 || nt > 2000) bad.push('Tổng quan người mới còn nặng: ' + nb + ' nút, ' + nt + ' chữ');
    { const tb6 = todayBox('pre'); if (!tb6.includes('data-today="part" data-tp=') || !tb6.includes('data-tpl="pre"') || !tb6.includes('<b>Học bài mới</b>')) bad.push('Hôm nay: việc học mới chưa mở thẳng phần'); }
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
    { const tb7 = todayBox('pre'); if (!tb7.includes('data-rev') || !tb7.includes('<b>Ôn bài cũ</b>') || !tb7.includes('từ đã lưu')) bad.push('ô Hôm nay thiếu ôn sổ từ (nút ôn chung)'); } tryv('ôn sổ từ', () => vwRun(Date.now(), dict)); if (!String($app.innerHTML).includes('Ôn sổ từ')) bad.push('màn ôn sổ từ hỏng');
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
    if (tabs !== 'lt:Lộ trình all:Học dict:Tra cứu bk:Tôi') bad.push('thanh dưới (v108: 4 tab, Lộ trình đầu tiên, bỏ Luyện thi): ' + tabs);
    // 🎯 Học người mới: ≤ 14 nút (v101: Pre-A1 thêm thẻ ✍️ Viết, 🗣 Nói); công cụ luyện thi, sổ lỗi, góp ý ở tab khác; chưa học gì thì chưa có việc ôn
    await tryA('Học', () => overview('pre')); const ho = H(), nh = nbt(ho) - (ho.match(/data-exsel=|data-hocnen|data-exthi/g) || []).length;   // v109: hàng mục (Nền · Cambridge · IELTS · TOEIC) là điều hướng, không tính if (nh > 14) bad.push('🎯 Học người mới ' + nh + ' nút');
    if (/data-mock|id="ovtools"|id="gyhome"|Sổ lỗi của tôi|data-rev|data-sotu/.test(ho)) bad.push('🎯 Học người mới còn công cụ của tab khác / việc ôn khi chưa có gì để ôn');
    // 🎓 Luyện thi: chưa chọn kỳ thi → 🎓 Cambridge (đề thử, cẩm nang, chuyển IELTS / TOEIC); đã đặt IELTS → IELTS
    delete S.exSel; delete S.ie; CB_LV = null; await tryA('Luyện thi', () => exOpen()); const hc = H();
    if (!hc.includes('🎓 Cambridge ') || hc.includes('class="btnbig') || !/data-mock="/.test(hc) || !hc.includes('data-cbsk=') || !hc.includes('data-cnv="cefr"') || !hc.includes('data-exthi') || !hc.includes('id="ie"')) bad.push('màn Cambridge chưa đủ (v122: như màn Nền, ô theo bài thi, đề thử trong Thêm)');
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
    for (const k of ['id="bk"', '📈 Tiến độ', '🗺 Chỗ yếu', '📌 Sổ từ', '📒 Sổ lỗi', '📊 Kết quả thi thật', '30/40', 'data-ct="data"', 'id="gyhome"']) if (!hm.includes(k)) bad.push('Của tôi thiếu ' + k);
    MAP_BACK = 'ct'; await tryA('bản đồ từ Của tôi', () => mapView()); if (!H().includes('id="bk"') || !H().includes('← Của tôi')) bad.push('bản đồ từ Của tôi sai'); MAP_BACK = 'lt';
    tryv('sổ từ từ Của tôi', () => sotuView(minhView)); if (!H().includes('id="bk"') || !H().includes('← Của tôi')) bad.push('sổ từ từ Của tôi sai');
    tryv('dữ liệu', () => backup()); if (!H().includes('id="bk"') || !H().includes('data-bk="ct"')) bad.push('Dữ liệu thiếu nút về Của tôi');
    // 📅 Hôm nay: MỘT nút ôn gom sổ lỗi + sổ từ + bài CEFR; bấm thì đi lần lượt sổ lỗi → sổ từ → phần nhiều bài đến hạn
    const tb = todayBox('pre'), nr = (tb.match(/data-rev/g) || []).length; if (nr !== 1 || /data-sotu/.test(tb) || !tb.includes('<b>Ôn bài cũ</b>') || !tb.includes('1 từ đã lưu') || !tb.includes('1 lỗi viết / nói')) bad.push('Hôm nay chưa có đúng một nút ôn chung: ' + nr);
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
    // hoàn thành cấp (v101): Viết bắt buộc (phần câu); Nói bắt buộc khi máy chép được lời, không thì tham khảo
    if (ovRef('noi') !== !SREC || ovRef('viet') || ovRef('np') || ovReq('a1').some(([id]) => ovRef(id)) || !OV.some(([id]) => id === 'noi' && ovIn(id, 'a1'))) bad.push('phần bắt buộc sai');
    S = blank(); for (const lv of ['pre', 'a1']) for (const [id] of ovReq(lv)) { const r = { lv, at: now, ok: 10, n: 10, pass: true }; if (id === 'tv') xs().runs.push(r); else if (id === 'pa') paRuns().push(r); else kSt(id).runs.push(r); }
    if (!ovDone('a1') || ovStage() !== 'a2') bad.push('Nói / Viết chưa qua vẫn chặn hoàn thành A1: ' + ovStage());
    // ngưỡng 2 bậc
    if (KIT.np.pass !== 0.85 || PA_PASS !== 0.85 || KIT.doc.pass !== 0.75 || KIT.nghe.pass !== 0.75 || KIT.noi.pass !== 0.7 || KIT.viet.pass !== 0.8) bad.push('ngưỡng 2 bậc sai');
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
    const tb = todayBox('pre'); if (!tb.includes('data-vcv="c1"') || !tb.includes('Thi vượt lên C1') || !tb.includes('data-plno') || tb.includes('<b>Học bài mới</b>')) bad.push('Hôm nay chưa gợi ý thi vượt theo xếp cấp');
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
    tryv('ui', () => { localStorage.setItem(NK, '1'); NO.vocab = { '<pad>': 0 }; paView(); const h = String($app.innerHTML); if (!/data-pm="cal"/.test(h) || !/data-pm="val"/.test(h)) bad.push('thiếu nút hiệu chuẩn / đối chiếu');
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
    const c = ltCur(); c.d0 = t - 9; c.sel = ['tv|x|nghia', 'np|y|nhan']; await tryA('ngày 10', () => ltView()); if (!H().includes('data-lt="chk"')) bad.push('ngày 10 chưa mở kiểm tra cuối đợt');
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
    if (!todayBox('pre').includes('chỗ cần học lại')) bad.push('ô Hôm nay thiếu việc chữa chỗ hổng');
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
    tryv('bỏ qua', () => $app.onclick({ target: { closest: s => s === '[data-a="skip"]' ? {} : null } })); if (!H().includes('Kết quả xếp cấp')) bad.push('bỏ qua xác nhận chưa ra kết quả');
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
    if (!todayBox('pre').includes('1 chỗ cần học lại')) bad.push('chưa có việc chữa');
    ltSt().fx = { [t]: ltCap() * 60000 }; if (!/task done[^>]*data-today="fix"/.test(todayBox('pre')) || !todayBox('pre').includes('Đủ cho hôm nay')) bad.push('đủ phút chữa chưa nhắc chuyển bài mới');
    // v108: việc luyện đề theo mục tiêu (IELTS, xếp cấp B1 → nền thiếu 1,5 cấp so với B2+ → 70 / 30); mục tiêu không thi → không có việc đề
    const g0 = ltSt().goal; S.ie = { set: 1, target: 6.5 }; ltSt().goal = { kind: 'ielts', lv: 'b2p', date: '', at: now }; S.place.top = 'b1';
    { const tb26 = todayBox('pre'); if (!tb26.includes('data-today="exam"') || !tb26.includes('<b>Luyện IELTS</b>')) bad.push('mục tiêu IELTS chưa có việc luyện đề'); }
    ltSt().goal = { kind: 'cefr', lv: 'a2', date: '', at: now }; if (todayBox('pre').includes('data-today="exam"')) bad.push('mục tiêu không thi vẫn có việc luyện đề'); ltSt().goal = g0; S.place.top = null; delete S.exSel; delete S.ie;
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
    let tb = todayBox('pre'); if (tb.includes('<b>Học bài mới</b>') || tb.includes('<b>Luyện kỹ năng</b>') || !tb.includes('<b>Luyện IELTS</b>') || !tb.includes('27 phút')) bad.push('10 / 90: ô Hôm nay sai');
    ltSt().ex = { [t]: 27 * 60000 }; if (!todayBox('pre').includes('Đủ 27 phút hôm nay')) bad.push('đủ phút đề chưa xong'); ltSt().ex = {};
    S.place.top = 'a2'; tb = todayBox('pre'); if (tb.includes('<b>Luyện IELTS</b>') || !tb.includes('Chưa cần luyện đề IELTS') || !tb.includes('<b>Luyện kỹ năng</b>')) bad.push('100 / 0: ô Hôm nay sai');
    // ④ phút luyện đề: ở màn kỳ thi thì cộng vào S.lt.ex, về màn nền thì thôi
    await tryA('màn IELTS', () => ieltsView()); if (!LT_EX_ON) bad.push('màn IELTS chưa tính phút đề');
    S.act = {}; ltSt().ex = {}; actTick(now); actTick(now + 60000); if ((ltSt().ex[t] || 0) < 60000) bad.push('phút đề không cộng');
    await tryA('về Học', () => overview('pre')); if (LT_EX_ON) bad.push('về 📚 Học vẫn tính phút đề'); const e0 = ltSt().ex[t]; actTick(now + 90000); if (ltSt().ex[t] !== e0) bad.push('ngoài màn đề vẫn cộng');
    // ⑤ kỳ thi theo mục tiêu; màn kỳ thi có dòng mục tiêu thay hàng chọn kỳ thi; IELTS giờ / tuần lấy theo Lộ trình
    S.place.top = 'b2p'; await tryA('mở đề IELTS', () => exOpen()); if (CUR.view !== 'ielts' || !H().includes('🌏 IELTS 🎯') || !H().includes('data-exthi') || !H().includes('data-exsel="toeic"') || H().includes('Hôm nay & kế hoạch') || H().includes('id="iehpw"')) bad.push('màn IELTS sai (v111: hàng mục, 🎯, không có kế hoạch)');
    await tryA('việc luyện đề vào thẳng bài', () => exGo()); if (!/ielts|de-thu|luyen|ie/.test(String(CUR.view))) bad.push('exGo không mở bài IELTS: ' + CUR.view);
    await tryA('xem TOEIC khi mục tiêu IELTS', () => toeicView()); if (LT_EX_ON || CUR.view !== 'toeic') bad.push('v109: xem kỳ thi khác vẫn mở được nhưng không tính phút đề'); await tryA('về IELTS', () => ieltsView()); if (!LT_EX_ON) bad.push('kỳ thi của mục tiêu chưa tính phút đề');
    if (iePlan().hpw !== Math.max(0.5, Math.round(ltSplit().exM * 7 / 60 * 2) / 2)) bad.push('giờ IELTS / tuần chưa theo Lộ trình');
    S.to = { target: 650 }; ltSt().goal = { kind: 'toeic', lv: toBase(650), date: '', at: now }; await tryA('mở đề TOEIC', () => exOpen()); if (CUR.view !== 'toeic' || ltGoalLv() !== toBase(650)) bad.push('mục tiêu TOEIC chưa mở TOEIC');
    ltSt().goal = { kind: 'cambridge', lv: 'b1', date: '', at: now }; await tryA('mở Cambridge', () => exOpen()); if (CUR.view !== 'cambridge' || CB_LV !== 'b1') bad.push('mục tiêu Cambridge chưa mở đúng cấp');
    // ⑥ 📚 Học: ô mục tiêu + nút phần riêng + 🧱 Nền CEFR, không có ô Hôm nay; Lộ trình có ô Hôm nay + ⚖️
    ltSt().goal = { kind: 'ielts', lv: ieBase(7), date: '', at: now }; await tryA('Học', () => overview('pre'));
    if (!H().includes('id="ov"') || !H().includes('>Học</h1>') || !H().includes('class="tile') || H().includes('data-ltex') || H().includes('Việc hôm nay') || H().includes('id="today"') || !H().includes('data-exthi>🎓 Luyện thi 🎯') || !H().includes('data-hocnen>🧱 Nền tiếng Anh') || H().includes('data-exsel')) bad.push('📚 Học chưa đúng (v110: 2 mục Nền · Thi, ô mục tiêu, nền)');
    await tryA('mở mục Thi', () => exOpenK(exGoalK() || 'cefr')); if (CUR.view !== 'ielts' || !['data-exsel="cefr"', 'data-exsel="ielts"', 'data-exsel="toeic"'].every(x => H().includes(x))) bad.push('mục Thi chưa mở kỳ thi mục tiêu / thiếu hàng con'); await tryA('Học', () => overview('pre'));
    await tryA('Lộ trình', () => ltView()); if (!H().includes('id="today"') || !H().includes('data-ltplan')) bad.push('🧭 Lộ trình thiếu màn Hôm nay / ô mục tiêu');
    await tryA('Đường tới mục tiêu', () => ltPlanView()); if (!H().includes('chia thế nào') || !H().includes('IELTS')) bad.push('màn Đường tới mục tiêu thiếu ⚖️ chia nền / đề');
    S.ie.date = new Date(now + 70 * 864e5).toISOString().slice(0, 10); await tryA('Lộ trình kế hoạch IELTS', () => ltPlanView()); if (!/Còn <b>1[01] tuần/.test(H())) bad.push('Lộ trình thiếu số tuần còn lại của kỳ thi'); delete S.ie.date; delete S.lt;
    const hd = HD.map(x => x[2]()).join(' '); if (!hd.includes('4 tab') && !HD.some(x => /4 tab/.test(x[1]))) bad.push('Luật chưa ghi 4 tab'); if (!hd.includes('Chia thời gian nền / đề') || !hd.includes('mở đầu tiên')) bad.push('Luật thiếu ⚖️ / tab mới');
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
    if (!h.includes('>Hôm nay</h1>') || !h.includes('<svg') || !h.includes(' trên ' + actGoal() + ' phút') || !h.includes('Việc hôm nay') || !h.includes('data-ltplan')) bad.push('màn Hôm nay thiếu vòng phút / việc / ô mục tiêu');
    if (h.split('data-ltnext').length !== 2 || h.split('task next').length !== 2 || !h.includes('class="task next" data-place') || !h.includes('▶ Học tiếp<small>Kiểm tra trình độ')) bad.push('cần đúng 1 nút ▶ Học tiếp, trỏ vào việc kế tiếp');
    ltSt().self = 'new'; await tryA('mới bắt đầu', () => ltView()); h = H(); if (h.includes('data-place') || h.split('task next').length !== 2) bad.push('tự chọn mới bắt đầu vẫn nhắc kiểm tra trình độ');
    // 🛣 Đường tới mục tiêu: đường cấp có 🎯, thanh chia nền / đề, 10 chấm ngày, đo trình độ, đổi mục tiêu
    await tryA('Đường tới', () => ltPlanView()); h = H(); const d10 = (h.split('class="days10">')[1] || '').split('</div>')[0];
    if (!h.includes('Đường tới') || !h.includes('class="lvpath"') || !h.includes('🎯') || !h.includes('class="split"') || d10.split('<i ').length !== 11 || !h.includes('data-lt="place"') || !h.includes('data-lt="edit"') || !h.includes('data-lt="home"')) bad.push('màn Đường tới mục tiêu thiếu phần');
    // 📚 Học: ô phần (lưới), không có việc hôm nay; màn phần: 📘 Học / 🏋️ Luyện tập trước, giải thích gập
    await tryA('Học', () => overview('pre')); h = H(); const nT = h.split('class="tile').length - 1;
    if (nT < 5 || !h.includes('class="seg"') || !h.includes('class="grid2"') || h.includes('Việc hôm nay')) bad.push('📚 Học chưa thành ô phần: ' + nT);
    const first = (x, a, b) => { const i = x.indexOf(a), j = x.indexOf(b); return i >= 0 && j >= 0 && i < j; };
    // v118: khuôn 3 tầng: đường 3 bước → 2 nút → danh sách bài → "Thêm" gập ở cuối
    await tryA('màn Ngữ pháp', () => kView('np')); h = H(); if (!first(h, 'class="steps3"', 'data-k="menu"') || !first(h, 'data-k="menu"', 'id="klist"') || !first(h, 'id="klist"', '<details class="box more"')) bad.push('màn phần: thứ tự khuôn 3 tầng sai');
    tryv('màn Từ vựng', () => home()); h = H(); if (!first(h, 'class="steps3"', 'data-a="practice"') || !first(h, 'data-a="practice"', 'id="grid"') || !first(h, 'id="grid"', '<details class="box more"')) bad.push('màn Từ vựng: thứ tự khuôn 3 tầng sai');
    const bd = (HD.find(x => x[0] === 'batdau') || [, , () => ''])[2](); if (!bd.includes('Học tiếp') || !bd.includes('3 câu')) bad.push('Luật mục Bắt đầu chưa theo giao diện mới');
    S.place = null; delete S.lt; LT_SESS = false;
    add('cefr', 'C28', !bad.length && !errs.length, [...errs, ...bad].length ? [...errs, ...bad].slice(0, 8).join(' | ') : 'bắt đầu 3 bước, Hôm nay (vòng phút, 1 nút ▶ Học tiếp, việc ✓ / ▶, tự chọn mới bắt đầu), Đường tới mục tiêu, 📚 Học ô phần, màn phần nút chính lên đầu'); }
  // v113 màn kỳ thi cùng khung (IELTS / TOEIC / Cambridge); v122 theo khuôn Nền: lưới ô kỹ năng → màn con; nền thiếu xa thì ô nhắc 🧱 Học nền trước; thi thử, đề thật… trong "Thêm" gập
  { const bad = [], errs = [], tryv = (n, f) => { try { f(); } catch (e) { errs.push(n + ': ' + e.message); } }, tryA = async (n, f) => { try { await f(); } catch (e) { errs.push(n + ': ' + e.message); } };
    S = blank(); await Promise.all([ieLoad(), toLoad(), kLoad(KIT.np)]); const H = () => String($app.innerHTML), now = Date.now();
    S.ie = { target: 7, type: 'ac', set: 1 }; ltSt().goal = { kind: 'ielts', lv: ieBase(7), date: '', at: now }; S.place = { at: now, top: 'a2', st: 'pre' };
    await tryA('IELTS nền thiếu xa', () => ieltsView()); let h = H();
    // v122 (khuôn Nền): không còn nút to ▶ Luyện tiếp; nền thiếu ≥ 2 cấp thì ô nhắc ⚖️ có nút 🧱 Học nền trước
    if (!h.includes('<button data-hocnen style="margin:4px 0 0">🧱 Học nền trước') || h.includes('class="btnbig') || h.includes('▶ Luyện tiếp')) bad.push('nền thiếu ≥ 2 cấp: thiếu ô nhắc Học nền trước / còn nút to');
    if (!h.includes('chipset ex3') || !h.includes('class="grid2"') || !h.includes('<details class="box more">')) bad.push('thiếu hàng kỳ thi một dòng / lưới ô / mục Thêm gập');
    S.place.top = 'b2p'; await tryA('IELTS gần đủ nền', () => ieltsView()); h = H(); if (h.includes('Học nền trước') || h.includes('class="btnbig')) bad.push('đủ gần nền: không nhắc học nền, không nút to');
    // màn con kỹ năng: tính phút đề khi là kỳ thi của mục tiêu; nút ‹ IELTS về màn IELTS
    tryv('màn con Viết', () => ieSkView('W')); if (!LT_EX_ON || !H().includes('data-iew="t2"') || CUR.sk !== 'W') bad.push('màn con IELTS Viết sai / chưa tính phút đề');
    await tryA('về IELTS', () => ieClick({ target: { closest: x => x === '[data-iehome]' ? {} : null } })); if (!H().includes('data-iesk="W"') || CUR.sk) bad.push('‹ IELTS chưa về màn IELTS');
    await tryA('TOEIC khi mục tiêu IELTS', () => toeicView()); tryv('màn con tốc độ', () => toSkView('T')); if (LT_EX_ON || !H().includes('data-tospd="p5"')) bad.push('màn con TOEIC: kỳ thi không phải mục tiêu vẫn tính phút / thiếu nút');
    // ô Hôm nay: "Xem dạng đề" chỉ mở màn kỳ thi (không tự vào bài)
    S.place.top = 'a2'; { const tb = todayBox('pre'); if (!tb.includes('Chưa cần luyện đề IELTS') || !tb.includes('data-ltex>Xem dạng đề') || tb.includes('data-today="exam"')) bad.push('Xem dạng đề còn tự vào bài'); }
    // Cambridge: nút chính = đề thử; đề mẫu chính thức khoá tới khi ≥ 3 phần qua thi
    delete S.lt; CB_LV = null; await tryA('Cambridge A2', () => cbView('a2')); h = H(); if (!h.includes('data-mock="a2"') || !h.includes('🔒') || !h.includes('data-cbsk="a2|0"') || h.includes('class="btnbig')) bad.push('màn Cambridge (v122) sai'); CB_LV = null;
    S.place = null; delete S.ie;
    add('cefr', 'C29', !bad.length && !errs.length, [...errs, ...bad].length ? [...errs, ...bad].slice(0, 8).join(' | ') : 'màn kỳ thi cùng khung: điểm ước gọn, 1 nút chính (nền thiếu xa → Học nền trước), ô kỹ năng mở màn con, phút đề đúng kỳ thi mục tiêu, Xem dạng đề không tự vào bài, Cambridge đề thử + đề mẫu khoá'); }
  // v114 🧭 Lộ trình 2 phần: 📅 Hôm nay · 🗺 Chỗ yếu; mọi bản đồ (CEFR, band IELTS, điểm TOEIC) ở phần 🗺 Chỗ yếu; màn kỳ thi / 👤 Tôi chỉ lối tắt
  { const bad = [], errs = [], tryA = async (n, f) => { try { await f(); } catch (e) { errs.push(n + ': ' + e.message); } };
    S = blank(); await Promise.all([ieLoad(), toLoad(), paLoad(), ...Object.values(KIT).map(kLoad)]); const H = () => String($app.innerHTML), now = Date.now(), pos = (h, x) => h.indexOf(x);
    S.ie = { target: 7, type: 'ac', set: 1 }; ltSt().goal = { kind: 'ielts', lv: ieBase(7), date: '', at: now }; S.place = { at: now, top: 'b2p', st: 'pre' };
    await tryA('Hôm nay', () => ltView()); let h = H();
    if (!h.includes('id="lt"') || !h.includes('data-ltseg="today" role="tab" aria-selected="true" class="on"') || !h.includes('data-ltseg="map"')) bad.push('Hôm nay thiếu hàng 2 phần');
    MAP_BACK = 'lt'; await tryA('Chỗ yếu', () => mapView()); h = H();
    if (!h.includes('id="lt"') || !h.includes('data-ltseg="map" role="tab" aria-selected="true" class="on"') || h.includes('data-a="bk"')) bad.push('🗺 Chỗ yếu chưa là phần của Lộ trình');
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
    tryv('learn', () => learn(UNITS.find(u => u.lv === 'pre'))); if (!H().includes('⚡ Bài tập nhanh trước bài học') || !H().includes('tính 🔁 Nhớ')) bad.push('⚡ chưa ghi rõ là bài tập');
    tryv('paView', () => paView()); if (!H().includes('📘 Bài học') || !H().includes('📘 Luyện thêm') || !H().includes('data-pm="fin"')) bad.push('Phát âm: 📘 luyện thêm thiếu');
    tryv('paMenu', () => paMenu()); if (/data-pm="(fin|tra|cal|val)"/.test(H()) || !H().includes('🏋️ Bài tập · Phát âm')) bad.push('Phát âm: 🏋️ còn mục không tính');
    // ⑥ Hôm nay: bài mới của Đọc / Nghe ghi "Làm bài mới" (bài tập), phần khác vẫn "Học bài mới"
    S = blank(); const itD = todayItems('pre', { low: ['doc', 'pre'] }).find(x => x.k === 'new'), itN = todayItems('pre', { low: ['np', 'pre'] }).find(x => x.k === 'new');
    if (!itD || itD.title !== 'Làm bài mới' || !itD.attr.includes('data-tp="doc"') || !itN || itN.title !== 'Học bài mới') bad.push('Hôm nay: tên việc bài mới sai');
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
      if (!h.includes('class="steps3"') || !h.includes('Ôn cho nhớ') || !h.includes('Thi lên cấp')) bad.push(n + ': thiếu đường 3 bước');
      if (!h.includes('📘 Bài học') || !h.includes('🏋️ Bài tập')) bad.push(n + ': thiếu 2 nút');
      if (JARGON.test(tp)) bad.push(n + ': màn đầu còn chữ luật / ký hiệu: ' + (tp.match(JARGON) || [])[0]);
      if (!h.includes('<details class="box more"') || !/Nhớ từng/.test(h) || !h.includes('Bài thi lên cấp')) bad.push(n + ': thiếu "Thêm" gập');
      if (!lvAt(h, chip)) bad.push(n + ': chip cấp chưa gập vào "Xem bài cấp khác"');
      if (/data-(k|a|pa)="exam"/.test(tp)) bad.push(n + ': chưa đủ điều kiện mà có nút thi'); }
    // Đọc / Nghe: bước 1 là "Làm bài"; danh sách dài chỉ hiện 6 dòng quanh bài kế tiếp
    tryv('doc', () => kView('doc')); if (!H().includes('<b>Làm bài</b>')) bad.push('Đọc: bước 1 chưa ghi "Làm bài"');
    tryv('np', () => kView('np')); { const n = kItems(KIT.np, 'pre').length, sh = (H().split('<details class="lvmore"')[0].match(/data-kx="/g) || []).length; if (n > P_WIN + 2 && (sh !== P_WIN || !H().includes('Xem thêm ' + (n - P_WIN) + ' bài'))) bad.push('Ngữ pháp: danh sách chưa gọn: ' + sh); }
    // trạng thái bằng chữ: học tiếp / đã học / cần ôn / đã nhớ
    { const xs = kItems(KIT.np, 'pre'), st = kSt('np').cards; st[xs[0].id] = { S: 300, last: now - D, d0: t - 9, ok: 1, pv: 1, n: 5, lapse: 0, dm: { nhan: { ok: 1, pv: 1, n: 3 }, dien: { ok: 1, pv: 1, n: 3 }, sua: { ok: 1, pv: 1, n: 3 }, hieu: { ok: 1, pv: 1, n: 3 } } };
      st[xs[1].id] = { S: 0.5, last: now - 5 * D, d0: t - 9, ok: 0, pv: 1, n: 5, lapse: 1, dm: {} }; st[xs[2].id] = { S: 1, last: now, d0: t, ok: 1, pv: 0, n: 0, lapse: 0 };
      const L = kList(KIT.np, 'pre', xs[3], now); if (!L.includes('đã nhớ') || !L.includes('cần ôn') || !L.includes('đã học') || !L.includes('học tiếp')) bad.push('danh sách chưa ghi trạng thái bằng chữ'); }
    // đủ điều kiện: bước 3 thành nút thi; học hết thì 🏋️ là nút chính, 📘 không
    S = blank(); for (const x of kItems(KIT.np, 'pre')) kSt('np').cards[x.id] = { S: 300, last: now - D, d0: t - 9, ok: 1, pv: 1, n: 5, lapse: 0, dm: { nhan: { ok: 1, pv: 1, n: 3 }, dien: { ok: 1, pv: 1, n: 3 }, sua: { ok: 1, pv: 1, n: 3 }, hieu: { ok: 1, pv: 1, n: 3 } } };
    tryv('np mở thi', () => kView('np')); { const h = H(); if (!/<div class="st3 open">[^]*data-k="exam"/.test(h)) bad.push('đủ điều kiện mà bước 3 chưa thành nút thi'); if (/class="big2 pri" data-k="learn"/.test(h) || !/class="big2 pri" data-k="menu"/.test(h)) bad.push('học hết mà 📘 vẫn là nút chính'); }
    // Từ vựng: một chặng mở sẵn, chặng khác gập; bước 3 theo trạng thái thi (chờ thi lại / đã qua)
    S = blank(); tryv('home', () => home()); { const h = H(); if ((h.match(/class="ch cur"/g) || []).length !== 1 || !h.includes('Chặng khác')) bad.push('Từ vựng: chặng chưa gập'); }
    { const st = n => steps3({ learn: [1, 2], unit: 'bài', lq: 50, mq: 10, need: 1, ex: n }); if (!st({ k: 'cho', v: '✓', sub: 'thi lại từ 9/11' }).includes('thi lại từ 9/11') || !st({ k: 'wait', v: '⏳', sub: 'thi lại sau 3 ngày' }).includes('⏳') || !st({ k: 'done', v: '✓', sub: 'đã qua' }).includes('st3 ok')) bad.push('bước 3 hiện sai trạng thái'); }
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
    { const it = todayItems('pre'), fx = it.find(x => x.k === 'fix'); if (!fx || !/bài yếu/.test(fx.meta) || !it.some(x => x.k === 'new')) bad.push('ô Hôm nay: ' + (fx ? fx.meta : 'không có việc chữa')); }
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
    const homeOk = h => /<h1[^>]*>Học<\\/h1>/.test(h) && h.includes('class="grid2"') && (h.match(/class="tile /g) || []).length >= 3 && h.includes('<details class="box more">') && !h.includes('class="btnbig') && !h.includes('class="exscore"');
    const skOk = (h, open = true) => h.includes('class="steps3"') && (h.match(/class="st3/g) || []).length === 3 && (!open || h.includes('class="st3 open"')) && h.includes('📘 Bài học') && h.includes('🏋️ Bài tập') && h.includes('class="urow next"') && h.includes('Luyện thi không tính');
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
    if (kinds('b1', 0) !== 'kit,part,u' || !kinds('b2', 0).includes('kwt') || kinds('b1', 3) !== 'cap' || kinds('a1', 2) !== 'part' || !kinds('a2', 1).includes('nf')) bad.push('Cambridge: loại bài sai ' + [kinds('b1', 0), kinds('b2', 0), kinds('b1', 3), kinds('a1', 2), kinds('a2', 1)].join(' / '));
    const kb = cbBai('b1', 0).find(b => b.kind === 'kit'); S.cbx = { [kb.x.id]: { at: now, ok: 2, n: 8 } }; tryv('Cambridge Đọc', () => cbSkView('b1', 0)); if (!H().includes('2/8 câu · yếu')) bad.push('Cambridge: trạng thái bài làm như đề thi sai');
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
    add('cefr', 'C37', !bad.length && !errs.length, [...errs, ...bad].length ? [...errs, ...bad].slice(0, 8).join(' | ') : 'kỳ thi theo khuôn Nền: màn đầu lưới ô + Thêm (không nút to), màn kỹ năng 3 bước + 📘 cách làm / 🏋️ bài kế tiếp + danh sách bài có trạng thái (IELTS, TOEIC, Cambridge), làm một bài như đề thi lưu theo bài, nút về đúng màn'); }
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
  // 💼 TOEIC (toeic.js): màn mở được; mọi Part sinh câu hợp lệ; đề thử ra điểm; quy đổi ước, mốc CEFR, hiệu chỉnh đề thật; từ vựng Leitner; mọi câu nghe / từ có giọng (n/)
  { const bad = [], errs = [], tryv = (n, f) => { try { f(); } catch (e) { errs.push(n + ': ' + e.message); } }; await toLoad(); delete S.to;
    await toeicView(); if (!String($app.innerHTML).includes('💼 TOEIC ') || !['L', 'R', 'V'].every(k => String($app.innerHTML).includes('data-tosk="' + k + '"')) || !String($app.innerHTML).includes('data-exthi') || /data-totg|id="todate"|Nên làm hôm nay|class="btnbig/.test(String($app.innerHTML))) bad.push('màn TOEIC (v111: chỉ nội dung; v122: như màn Nền, 3 ô)');
    for (const k of ['L', 'R', 'V']) { try { toSkView(k); const h = String($app.innerHTML); if (!h.includes('data-tohome') || !h.includes('class="steps3"') || !h.includes('data-tohow="' + k + '"') || !h.includes('data-tobt="' + k + '"') || !h.includes('data-tobai="' + k + '|') || (k !== 'V' && !/data-to(p|spd)=/.test(h))) bad.push('màn con TOEIC ' + k + ' thiếu nút / khuôn 3 bước'); } catch (e) { bad.push('màn con TOEIC ' + k + ': ' + e.message); } }
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
    await toeicView(); if (!String($app.innerHTML).includes('data-mapv="lt" data-mapk="toeic"')) bad.push('màn TOEIC thiếu lối tắt bản đồ điểm'); await mapView('toeic'); MAP_TAB = null; if (!String($app.innerHTML).includes('Bản đồ điểm') || !String($app.innerHTML).includes('Phân tích điểm')) bad.push('🗺 Chỗ yếu thiếu bản đồ điểm');
    add('toeic', 'T2', !bad.length && !errs.length, [...errs, ...bad].length ? [...errs, ...bad].slice(0, 6).join(' | ') : 'bản đồ điểm: dạng / bẫy có mẫu số, ngưỡng theo mục tiêu, nhóm 3 (Nghe ≤ 2, Đọc ≤ 2), chỉ câu mới tính, đạt 2 ngày = xong, tốc độ, kho ≥ 20 bộ'); }
  return out; })()`);
let fail = 0; for (const r of R) { if (!r.ok) fail++; console.log(`${r.ok ? '✅' : '❌'} ${r.lv.padEnd(3)} ${r.id}  ${r.msg}`); }
console.log(fail ? `\n${fail} tiêu chí chưa đạt` : '\nĐạt hết'); process.exit(fail ? 1 : 0);
