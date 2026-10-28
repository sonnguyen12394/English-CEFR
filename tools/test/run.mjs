// Kiểm tự động tiêu chí "xong" X1–X5 của docs/HOAN-THIEN.md cho Pre-A1 → C2. Chạy: node tools/test/run.mjs   (thoát mã 1 nếu có tiêu chí chưa đạt)
import { load } from './load.mjs';
const { run, ctx } = await load(); ctx.ALLMISS = !!process.env.ALL; ctx.LVS_ = process.env.LVS;
const R = await run(`(async () => {
  S = blank(); user = { id: 'test' }; await Promise.all([paLoad(), ...Object.values(KIT).map(kLoad)]); await loadEB(); await uLoad();
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
  for (const lv of (LVS_ ? LVS_.split(',') : ['pre', 'a1', 'a2', 'b1', 'b1p', 'b2', 'b2p', 'c1', 'c2'])) {
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
      for (const q of qs) { if (q.kind === 'mc' && (!q.opts.includes(q.a) || new Set(q.opts).size !== q.opts.length)) bad.push('uoe mc:' + x.id); if (q.kind === 'type' && !(q.acc && q.acc[0])) bad.push('uoe type:' + x.id); }
      if (x.gaps) x.gaps.forEach((g, i) => { if (!uSent(x, i + 1, k).includes('<mark')) bad.push('uoe không tách được câu:' + x.id + ' (' + (i + 1) + ')'); });
      if (k === 'kwt') for (const a of x.a) if (!uKwtQ(x).check(a).ok || !uKwtQ(x).check(x.s2.replace('____', a)).ok || uKwtQ(x).check('x').ok) bad.push('uoe kwt chấm sai:' + x.id); } }
    // 🎧 giọng tự nhiên (n/, tools/build-audio.py): mọi dòng hội thoại và mọi câu bài nghe của cấp phải có tệp; thiếu thì chạy lại build-audio.py
    { if (!NCLIPS.size) try { NCLIPS = new Set(await (await fetch('n/index.json')).json()); } catch (e) {} const miss = []; for (const x of KIT.nghe.items.filter(x => x.lv === lv)) for (const t of (x.lines ? x.lines.flatMap(l => [l[1], ...kSents(l[1])]) : kSents(x.text))) if (!NCLIPS.has(clipKey(t))) miss.push(x.id);
      if (miss.length) bad.push('thiếu giọng tự nhiên: ' + [...new Set(miss)].slice(0, 5).join(', ') + ' (' + miss.length + ' câu)'); }
    // ✍️ chấm Viết 4 tiêu chí (thi.js): bài mẫu không bị báo lỗi, ≥ 80%; bài cố tình sai phải bị bắt
    for (const x of kItems(KIT.viet, lv)) { const m = kModel(x), r = kWrite(x).check(m); if (wErrors(m).length) bad.push('viết mẫu bị báo lỗi:' + x.id + ' ' + wErrors(m).map(e => e[0]).join('|')); if (r.sc < 0.8) bad.push('viết mẫu < 80%:' + x.id + ' ' + Math.round(r.sc * 100)); }
    if (lv === 'pre' && wErrors("i am agree. He don't like it. I can to swim since three years.").length < 4) bad.push('bộ bắt lỗi Viết không bắt được lỗi');
    add(lv, 'X5', !bad.length, bad.length ? bad.length + ' lỗi: ' + [...new Set(bad)].slice(0, 10).join(', ') : 'mọi câu hợp lệ');
  }
  return out; })()`);
let fail = 0; for (const r of R) { if (!r.ok) fail++; console.log(`${r.ok ? '✅' : '❌'} ${r.lv.padEnd(3)} ${r.id}  ${r.msg}`); }
console.log(fail ? `\n${fail} tiêu chí chưa đạt` : '\nĐạt hết'); process.exit(fail ? 1 : 0);
