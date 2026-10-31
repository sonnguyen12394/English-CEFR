// Ước số ngày tới đủ cổng mỗi cấp (tiêu chí X7, docs/HOAN-THIEN.md). Mô phỏng, không phải người thật: tỉ lệ đúng giả định theo dạng câu × khả năng nhớ.
// Từ vựng mô phỏng đủ luật (lịch ôn, 12 yêu cầu, dạy yêu cầu mới trong luyện tập); 6 phần kia ước theo số bài × phút. Chạy: node tools/test/sim.mjs
import { load } from './load.mjs';
const { run, ctx } = await load(); ctx.CFG = process.env.CFG; ctx.LVS = process.env.LVS;   // CFG=bài/ngày,lượt luyện 20 câu,câu nói  LVS=pre,a1
console.log(await run(`(async () => { user = { id: 'sim' }; await Promise.all([paLoad(), ...Object.values(KIT).map(kLoad)]);
  const BASE = { vi2w: .9, tiles: .92, cloze: .85, w2vi: .95, listen: .85, form: .92, spell: .75, noi: .8, clozeT: .7, col: .85, irrR: .85, irrT: .7, rel: .85, s2: .85, colT: .7, pat: .8, fam: .8, famQ: .7, reg: .8, style: .8, synT: .65, fast: .8, idi: .8 };
  const SEC = 12, out = [];
  async function vocab(lv, prev, perDay, rounds, noiN) { S = blank(); const T0 = Date.now() + 2 * DAY;
    if (prev) { await bkSet('tv', prev, 'dat'); for (const w of WORDS) { const c = S.cards[w.id]; if (c) { delete c.du; for (const k in c.dm) if (VREQ_BY[k] && lvIdx(VREQ_BY[k][2]) > lvIdx(prev)) delete c.dm[k]; c.d0 = dayOf(T0) - 30; c.last = T0 - 5 * DAY; c.S = 30; } } }
    const us = UNITS.filter(u => u.lv === lv); let ui = 0, q = 0;
    for (let d = 0; d < 800; d++) { const now = T0 + d * DAY;
      for (let k = 0; k < perDay && ui < us.length; k++) { learnCards(S, us[ui], now); q += us[ui].words.reduce((s, w) => s + lessonTypes(w, reqsUpTo(lv)).length + 2, 0); ui++; }
      for (let r = 0; r < rounds; r++) { const t = now + (r + 1) * 36e5, today = dayOf(t);
        const pri = w => { const c = S.cards[w.id], st = wstat(S, w, t); return st === 'quen' ? recall(c, t) : st === 'hoc' && today - c.d0 >= MEM_DAYS ? 1 : st === 'hoc' ? 3 : 2 + recall(c, t); };
        for (const w of memWords(lv, t).filter(w => S.cards[w.id]).sort((a, b) => pri(a) - pri(b)).slice(0, ROUND)) { const c = S.cards[w.id], ty = typeFor(c, t, w); grade(S, w.id, Math.random() < (BASE[ty] || .8) * (0.55 + 0.45 * recall(c, t)), t, ty); q++; } }
      { const t = now + 5 * 36e5; for (const w of memWords(lv, t).filter(w => S.cards[w.id]).sort((a, b) => (heldDim(S.cards[a.id], 'noi', t) - heldDim(S.cards[b.id], 'noi', t)) || recall(S.cards[a.id], t) - recall(S.cards[b.id], t)).slice(0, noiN)) { grade(S, w.id, Math.random() < .8 * (0.55 + 0.45 * recall(S.cards[w.id], t)), t, 'noi'); q++; } }
      const p = parts(S, now + 20 * 36e5, lv); if (p.lq >= GATE_LEARN && p.mq >= GATE_MEM) return { days: d + 1, min: Math.round(q / (d + 1) * SEC / 60) }; }
    return { days: '>800', min: 0 }; }
  const [U, R, N] = (CFG || '1,2,15').split(',').map(Number);
  for (const [lv, prev] of [['pre', null], ['a1', 'pre'], ['a2', 'a1'], ['a2p', 'a2'], ['b1', 'a2p'], ['b1p', 'b1'], ['b2', 'b1p'], ['b2p', 'b2'], ['c1', 'b2p'], ['c2', 'c1']].filter(x => !LVS || LVS.includes(x[0]))) {
    const v = await vocab(lv, prev, U, R, N);
    // 6 phần kia: mỗi bài học ~6 phút (viết, nói ~10), ôn tới Nhớ ~2 lượt × 3 phút mỗi bài; Phát âm ~8 phút / bộ
    const other = Object.values(KIT).filter(P => P.lvs.includes(lv)).map(P => [P.t, kItems(P, lv).length, kItems(P, lv).length * ((['noi', 'viet'].includes(P.id) ? 10 : 6) + 6)]);
    other.push(['Phát âm', PA.filter(x => x.lv === lv).length, PA.filter(x => x.lv === lv).length * 14]);
    const om = other.reduce((s, o) => s + o[2], 0);
    out.push(\`\${LVN[lv]}: Từ vựng \${v.days} ngày (~\${v.min} phút/ngày) · 6 phần kia ~\${om} phút (\${other.map(o => o[0] + ' ' + o[1] + ' bài').join(', ')}) ≈ \${Math.ceil(om / 15)} ngày nếu 15 phút/ngày song song → cả cấp ≈ \${Math.max(v.days, Math.ceil(om / 15))} ngày với ~\${v.min + 15} phút/ngày\`); }
  return out.join('\\n'); })()`));
