// v146 (specs/009-sai-hoc-lai): luật suy nhãn dạng câu TOEIC, DÙNG CHUNG cho trang (toeic.js, deai.js: gắn nhãn câu đề AI / đề soạn sẵn,
// hoclai.js: câu sai → bài học của dạng) và bộ dựng tools/build-toeic.mjs (nạp tệp này bằng vm). Sửa luật ở đây, rồi chạy lại node tools/build-toeic.mjs.
//   Part 1 người / cảnh (TQ_P1PPL) · Part 2 tqP2: wh | yn | or | req | stmt (null = câu hỏi không nhận ra) · Part 3–4 tqQ34: gist | next | imp | graphic | detail
//   Part 6 tqP6 (chỗ trống { o: phương án, t?: nhãn ghi tay }): insert | conn | word · Part 7 tqQ7: syn | insert | intent | not | purpose | infer | true | detail
const TQ_P1PPL = /\b(person|people|man|men|woman|women|worker|workers|cook|chef|waiter|waitress|shopper|shoppers|customer|customers|passenger|passengers|student|students|someone|they)\b/i;
function tqP2(q) { const s = String(q).trim();
  if (/\?$/.test(s) && /\bor\b/i.test(s)) return 'or';
  if (/^(Do you know|Do you remember|Can you tell me|Could you tell me|Have you heard|Did you hear|Do you have any idea)\b/i.test(s)) return 'yn';
  if (/^(Could you|Would you|Can you|Will you|Why don't|Why not|Shall (I|we)|Let's|How about|What about|Do you want|Should we|Would you mind|Do you mind|Please|I was wondering if)\b/i.test(s)) return 'req';
  if (/^(Is|Are|Was|Were|Do|Does|Did|Have|Has|Had|Can|Could|Will|Would|Should|May|Must)\b/.test(s) || /^\w+n't\b/i.test(s) || /,\s*(\w+n't\s+\w+|right|is it|are you|do you|did you|will you)\?$/i.test(s)) return 'yn';
  if (/^(When|Where|Who|Whose|Whom|Why|How|What|Which)\b/i.test(s)) return 'wh';
  return /\?$/.test(s) ? null : 'stmt'; }
const TQ_GIST = /(discussing|discuss|talking about)\?$|^What is the (main )?(purpose|topic|subject)\b|^What is the (talk|announcement|report|message|webinar|workshop|conversation|broadcast|advertisement) (mainly )?about\?$|^Why is the (man|woman|speaker) calling\?$|^Who (most likely )?(is|are) the (speakers?|listeners?|man|woman|caller)\??$|^Who is the speaker (most likely )?talking to\?$|^Where (most likely )?(are|is) the (speakers?|speaker)\??$|^Where does the conversation (most likely )?take place\?$|^Where (most likely )?(does|do) the (man|woman|speakers?|speaker) work\?$|^Where is the (talk|announcement|conversation) (most likely )?(taking place|being made)\?$|^What (type|kind) of (business|company|event|store|product)\b|^What is being advertised\?$|^Who most likely is the speaker\?$/i;
const TQ_NEXT = /^What will (the )?(man|woman|speakers?|listeners?|first woman|second woman|manager|[A-Z][a-z]+) (probably |most likely |likely )?do\b|^What will happen next\b|^What does the (man|woman|speaker|manager|guest|caller|woman named \w+|man named \w+) (suggest|recommend|offer|propose|ask for|request)\b|^What does the (man|woman|speaker) (ask|want|tell|remind|encourage|invite) (the )?(listeners?|man|woman|caller) to\b|^What (is|are) (the )?(man|woman|listeners?|speakers?|caller|participants?) (asked|encouraged|invited|reminded|told) (not )?to\b|^What does the (man|woman|speaker) want to do\b|^What does the (man|woman|speaker) say (he|she) will\b|^What does the (man|woman|speaker) (plan|intend|agree|offer) to do\b|offer to do\?$|^What should (the )?(listeners?|participants?|callers?) do\b/i;
const tqQ34 = q => /^Look at the graphic/i.test(q) ? 'graphic' : /\bimply\b|mean when (he|she) says|Why does the (man|woman|speaker) say/i.test(q) ? 'imp' : TQ_GIST.test(q) ? 'gist' : TQ_NEXT.test(q) ? 'next' : 'detail';
const tqQ7 = q => /closest in meaning to/i.test(q) ? 'syn' : /^In which of the positions marked/i.test(q) ? 'insert' : /mean when (he|she) writes/i.test(q) ? 'intent' : /\bNOT\b/.test(q) ? 'not'
  : /\b(purpose|mainly about|main topic)\b|^Why (was|is) (the|this) (letter|e-mail|notice|memo|article|message|advertisement|announcement|review) (being )?(sent|written|posted)|^Who is the (notice|memo|letter|e-mail|advertisement|article|message) (intended|written|most likely) for|^For whom is the|^Why does .+ (contact|write to|e-mail|call) /i.test(q) ? 'purpose'
  : /\b(most likely|suggested|implied|inferred|probably)\b/i.test(q) ? 'infer' : /\b(indicated|stated|mentioned|true)\b/i.test(q) ? 'true' : 'detail';
const TQ_CONN = new Set(['however', 'therefore', 'in addition', 'moreover', 'furthermore', 'as a result', 'consequently', 'nevertheless', 'nonetheless', 'instead', 'alternatively', 'similarly', 'likewise', 'otherwise', 'meanwhile', 'for example', 'for instance', 'in fact', 'thus', 'hence', 'accordingly', 'afterward', 'afterwards', 'finally', 'besides', 'even so', 'in contrast', 'by contrast', 'on the other hand', 'of course', 'indeed', 'after all', 'in the meantime', 'at the same time', 'additionally', 'subsequently', 'previously', 'in short', 'in other words', 'fortunately', 'unfortunately', 'then', 'still', 'rather', 'as a matter of fact', 'to this end', 'in particular', 'specifically', 'overall', 'once again', 'even though', 'regardless', 'in that case', 'if so', 'as such', 'until then', 'since then', 'by then', 'in the end', 'as expected', 'in the past', 'for this reason']);
const tqSent = o => /[.!?]$/.test(String(o).trim()) && String(o).trim().split(/\s+/).length >= 3;
const tqP6 = g => g.t || (g.o.every(tqSent) ? 'insert' : g.o.every(o => TQ_CONN.has(String(o).trim().replace(/,$/, '').toLowerCase())) ? 'conn' : 'word');

// v153 (specs/011-kiem-noi-dung-de): phương án là số / tiền / giờ / ngày tháng / thứ / tầng / nhãn cùng một khuôn ("The 7:15 train",
//   "Floor 3", "$75.00", "On May 12", "Package A"…) → xếp tăng dần như đề thật (nguyên tắc viết câu trắc nghiệm: place options in logical
//   or numerical order). Không cùng khuôn → null (giữ cách xếp cũ). Dùng ở totron.js (đề trọn), toeic.js toOpts (luyện), tools/kiem-toeic.mjs.
const TQ_MON = 'january february march april may june july august september october november december'.split(' ');
const TQ_DAY = 'monday tuesday wednesday thursday friday saturday sunday'.split(' ');
const TQ_ORD = 'first second third fourth fifth sixth seventh eighth ninth tenth'.split(' ');
// v155 (specs/012-so-loi-soan-de R5): thêm số viết bằng chữ (two, twelve, fifty), giờ chữ (noon, five o'clock), thời lượng khác đơn vị
//   (40 minutes · one hour · two hours → đổi ra phút), nhãn chữ + số (B4, C2). Giải mù chê phương án "Noon · Five o'clock · Eleven o'clock"
//   và "About two hours · About 40 minutes · …" không xếp thứ tự (Đề 3 câu 90, Đề 4 câu 161, 178).
const TQ_NUMW = { zero: 0, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10, eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15, sixteen: 16, seventeen: 17, eighteen: 18, nineteen: 19, twenty: 20, thirty: 30, forty: 40, fifty: 50, sixty: 60, seventy: 70, eighty: 80, ninety: 90 };
const TQ_UNIT = { minute: 1, hour: 60, day: 1440, week: 10080, month: 43200, year: 525600 };
const TQ_NW = '(?:(?:a|one) hundred|hundred|(?:twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety)(?:-(?:one|two|three|four|five|six|seven|eight|nine))?|zero|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen)';
const tqNumW = w => { w = w.toLowerCase(); if (/hundred/.test(w)) return 100; const [a, b] = w.split('-'); return (TQ_NUMW[a] || 0) + (b ? TQ_NUMW[b] : 0); };
function tqNatKey(s) {   // → [khuôn, giá trị, giờ không ghi sáng / chiều?] hoặc null
  const t = String(s).trim().replace(/[‘’]/g, "'"), lw = t.toLowerCase(), ap = '\\s*([AaPp])\\.?\\s?[Mm]\\b\\.?';
  let m = t.match(new RegExp('^(.*?)\\b(\\d{1,2}):(\\d{2})(?:' + ap + ')?(.*)$'));
  if (m) { let h = +m[2] % 12; if (m[4]) h += /p/i.test(m[4]) ? 12 : 0; else h = +m[2]; return [m[1].toLowerCase() + '#t' + m[5].toLowerCase().replace(/\.$/, ''), h * 60 + +m[3], !m[4]]; }
  m = t.match(new RegExp('^(.*?)\\b(\\d{1,2})' + ap + '(.*)$'));
  if (m) return [m[1].toLowerCase() + '#t' + m[4].toLowerCase().replace(/\.$/, ''), (+m[2] % 12 + (/p/i.test(m[3]) ? 12 : 0)) * 60, false];
  m = lw.match(/^(.*?)\b(noon|midday)\b(.*)$/);   // v155: giờ viết bằng chữ (noon = 12 giờ, chưa rõ sáng / chiều như "Five o'clock")
  if (m) return [m[1] + '#t' + m[3].replace(/\.$/, ''), 720, true];
  m = lw.match(new RegExp("^(.*?)\\b(\\d{1,2}|" + TQ_NW + ") o'clock\\b(.*)$"));
  if (m) return [m[1] + '#t' + m[3].replace(/\.$/, ''), (/\d/.test(m[2]) ? +m[2] : tqNumW(m[2])) * 60, true];
  m = lw.match(/^(.*?)\b(january|february|march|april|may|june|july|august|september|october|november|december)\b(?:\s+(\d{1,2})(?:st|nd|rd|th)?)?(.*)$/);
  if (m) return [m[1] + '#m' + m[4].replace(/\.$/, ''), TQ_MON.indexOf(m[2]) * 100 + (+m[3] || 0)];
  m = lw.match(/^(.*?)\b(monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b(.*)$/);
  if (m) return [m[1] + '#d' + m[3].replace(/\.$/, ''), TQ_DAY.indexOf(m[2])];
  m = lw.match(/^(.*?)\b(first|second|third|fourth|fifth|sixth|seventh|eighth|ninth|tenth)\b(.*)$/);
  if (m) return [m[1] + '#o' + m[3].replace(/\.$/, ''), TQ_ORD.indexOf(m[2])];
  m = lw.match(new RegExp('^(.*?)\\b(half an?|an?|\\d+(?:\\.\\d+)?|' + TQ_NW + ')\\s+(minute|hour|day|week|month|year)s?\\b(.*)$'));   // v155: thời lượng → phút
  if (m) return [m[1] + '#u' + m[4].replace(/\.$/, ''), (m[2].startsWith('half') ? 0.5 : /^an?$/.test(m[2]) ? 1 : /\d/.test(m[2]) ? parseFloat(m[2]) : tqNumW(m[2])) * TQ_UNIT[m[3]]];
  m = t.match(/^(.*?)\b([A-Z])(\d{1,3})\b(.*)$/);   // v155: nhãn chữ + số (B4, C2)
  if (m) return [m[1].toLowerCase() + '#lab' + m[4].toLowerCase().replace(/\.$/, ''), m[2].charCodeAt(0) * 1000 + +m[3]];
  m = t.match(/^(.*?)(\$|€|£)?(\d[\d,]*(?:\.\d+)?)(.*)$/);
  if (m) return [m[1].toLowerCase() + '#n' + (m[2] || '') + m[4].toLowerCase().replace(/\.$/, ''), parseFloat(m[3].replace(/,/g, ''))];
  m = lw.match(new RegExp('^(.*?)\\b(' + TQ_NW + ')\\b(.*)$'));   // v155: số viết bằng chữ (Two · Twelve · Six · Five)
  if (m) return [m[1] + '#n' + m[3].replace(/\.$/, ''), tqNumW(m[2])];
  m = t.match(/^(.*\S)\s+([A-Z])\.?$/);
  if (m) return [m[1].toLowerCase() + '#l', m[2].charCodeAt(0)];
  return null; }
function tqNat(opts) { if (!opts || opts.length < 2) return null;
  const k = opts.map(tqNatKey); if (k.some(x => !x)) return null;
  const ty = x => (x[0].match(/#(lab|[tmdoun]|l)/) || [])[1];   // v155: khác chữ đi kèm nhưng cùng loại số (2 × 3 m · 6 × 8 m; Monday afternoon · Tuesday evening) vẫn xếp theo số
  if (new Set(k.map(x => x[0])).size !== 1 && new Set(k.map(ty)).size !== 1) return null;
  if (k.every(x => x[2])) { const hs = k.map(x => Math.floor(x[1] / 60) % 12 || 12);   // giờ không ghi sáng / chiều: qua trưa (có giờ ≥ 8 và giờ 1–6) thì 1–6 là chiều
    const noon = hs.some(h => h >= 8) && hs.some(h => h <= 6); k.forEach((x, i) => { const h = hs[i]; x[1] = (h === 12 ? 12 : noon && h <= 6 ? h + 12 : h) * 60 + x[1] % 60; }); }
  if (new Set(k.map(x => x[1])).size !== k.length) return null;
  return opts.map((o, i) => [o, k[i][1]]).sort((a, b) => a[1] - b[1]).map(x => x[0]); }
