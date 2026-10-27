// Kiểm tự động tiêu chí "xong" X1–X5 của docs/HOAN-THIEN.md cho Pre-A1, A1, A2. Chạy: node tools/test/run.mjs   (thoát mã 1 nếu có tiêu chí chưa đạt)
import { load } from './load.mjs';
const { run, ctx } = await load(); ctx.ALLMISS = !!process.env.ALL;
const R = await run(`(async () => {
  S = blank(); user = { id: 'test' }; await Promise.all([paLoad(), ...Object.values(KIT).map(kLoad)]); await loadEB();
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
  for (const lv of ['pre', 'a1', 'a2']) {
    // X1: các màn của mọi phần mở được
    const errs = []; const tryv = (n, f) => { try { f(); } catch (e) { errs.push(n + ': ' + e.message); } };
    tryv('home', () => home()); tryv('practiceMenu', () => practiceMenu()); for (const [k] of dimsAt(lv)) tryv('dimView ' + k, () => dimView(k));
    tryv('learn', () => learn(UNITS.find(u => u.lv === lv))); tryv('paView', () => paView());
    for (const P of Object.values(KIT)) if (P.lvs.includes(lv)) { tryv(P.id + ' view', () => kView(P.id)); tryv(P.id + ' learn', () => kLearn(P, kItems(P, lv)[0])); tryv(P.id + ' menu', () => kMenu(P)); tryv(P.id + ' exam', () => { const q = P.exam(lv); if (!q.length) throw new Error('đề rỗng'); }); }
    tryv('overview', () => overview(lv));
    add(lv, 'X1', !errs.length, errs.length ? errs.slice(0, 5).join(' | ') : 'mọi màn mở được, mọi phần có đề thi');
    // X2: mỗi yêu cầu Nhớ của Từ vựng có dạng câu trong bài học
    const taught = new Set(UNITS.filter(u => u.lv === lv).flatMap(u => u.words.flatMap(w => lessonTypes(w, reqsUpTo(lv)).flatMap(t => DIM_OF[t] || [])))); taught.add('noi');
    const untaught = dimsAt(lv).map(d => d[0]).filter(k => !taught.has(k) && WORDS.some(w => wLv(w) === lv && VREQ_BY[k][3](w)));
    add(lv, 'X2', !untaught.length, untaught.length ? 'yêu cầu chưa được dạy trong bài học: ' + untaught.join(', ') : \`\${dimsAt(lv).length} yêu cầu Từ vựng đều được dạy\`);
    // X4: câu thi đúng cấp
    XLV = lv; const ws = levelWords(lv).filter(w => EB[w.id]); let over = 0, tot = 0; const ex = new Set();
    for (const w of ws) for (const t of (EB[w.id].s.toLowerCase().match(/[a-z']+/g) || [])) { tot++; const l = lvw[t]; if (l && LEVELS.indexOf(l) > LEVELS.indexOf(lv) + (lv === 'a2' ? 1 : 0)) { over++; ex.add(t); } }
    const clip = ws.filter(w => xClipOk(EB[w.id].l)).length, noEB = levelWords(lv).length - ws.length;
    add(lv, 'X4', over / tot <= 0.05 && !noEB && (lv === 'a2' || !clip), \`từ vượt cấp trong câu thi \${(over / tot * 100).toFixed(1)}% (\${[...ex].slice(0, 12).join(', ')}); từ thiếu câu thi \${noEB}; câu nghe thu sẵn \${clip}\`);
    // X5: câu hỏi hợp lệ (Từ vựng mọi dạng; Ngữ pháp, Đọc, Nghe: trắc nghiệm của đề thi)
    const bad = [];
    for (const w of levelWords(lv)) for (const t of ['w2vi', 'listen', 'form', 'spell', 'clozeT', 'col', 'irrR', 'irrT', 'rel', 's2']) { const q = questionX(w, t) || question(w, t);
      if (q.opts && (!q.opts.includes(q.a) || new Set(q.opts.map(low)).size !== q.opts.length || q.opts.length < 3)) bad.push(t + ':' + w.w); }
    for (const w of ws) for (const t of ['xT', 'xN', 'xL', 'xF', 'xC', 'xR', 'xS', 'xG', 'xI']) { if (X_Q[t] && !X_Q[t][1](w)) continue; const q = examQ(w, t); if (q.opts && !q.opts.includes(q.a)) bad.push(t + ':' + w.w); if (q.type === 'xT' && !q.top.includes('_____')) bad.push('xT trống:' + w.w); }
    for (const P of Object.values(KIT)) if (P.lvs.includes(lv)) for (let r = 0; r < 3; r++) for (const q of P.exam(lv)) if (q.opts && q.a != null && !q.opts.includes(q.a)) bad.push(P.id + ':' + (q.x && q.x.id));
    add(lv, 'X5', !bad.length, bad.length ? bad.length + ' lỗi: ' + [...new Set(bad)].slice(0, 10).join(', ') : 'mọi câu hợp lệ');
  }
  return out; })()`);
let fail = 0; for (const r of R) { if (!r.ok) fail++; console.log(`${r.ok ? '✅' : '❌'} ${r.lv.padEnd(3)} ${r.id}  ${r.msg}`); }
console.log(fail ? `\n${fail} tiêu chí chưa đạt` : '\nĐạt hết'); process.exit(fail ? 1 : 0);
