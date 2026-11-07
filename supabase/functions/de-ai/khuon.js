// 🎯 Đề AI: bảng khuôn theo ĐỀ THẬT + máy kiểm khuôn (v144, 7/11/2026; đặc tả specs/006-de-ai-bam-de-that).
// Người sáng lập: "Dò lại đề do AI tạo có bám sát cấu trúc đề thực tế chưa. Nếu chưa thì chỉnh sửa"; chọn: IELTS Đọc chỉ còn bài dài như đề thật,
// Starters / Movers chỉ dạng chữ của đề thật, thêm hết dạng làm được bằng chữ. Bảng số câu / lựa chọn / giới hạn từ: specs/006-de-ai-bam-de-that/data-model.md.
// JS thuần: máy chủ (Deno, index.ts nhập) và test (node, tools/test/run.mjs C61) dùng chung.
import { norm } from "./trung.js";

export const KY = { "ielts-ac": "IELTS Academic", "ielts-gt": "IELTS General Training", toeic: "TOEIC Listening and Reading",
  "cb-pre": "Cambridge Pre A1 Starters", "cb-a1": "Cambridge A1 Movers", "cb-a2": "Cambridge A2 Key", "cb-a2p": "Cambridge A2 Key", "cb-b1": "Cambridge B1 Preliminary",
  "cb-b1p": "Cambridge B1 Preliminary", "cb-b2": "Cambridge B2 First", "cb-b2p": "Cambridge B2 First", "cb-c1": "Cambridge C1 Advanced", "cb-c2": "Cambridge C2 Proficiency" };
export const CEFR = { pre: "Pre-A1", a1: "A1", a2: "A2", a2p: "A2 (upper)", b1: "B1", b1p: "B1 (upper)", b2: "B2", b2p: "B2 (upper)", c1: "C1", c2: "C2" };
const CBN = { pre: "Pre A1 Starters", a1: "A1 Movers", a2: "A2 Key", b1: "B1 Preliminary", b2: "B2 First", c1: "C1 Advanced", c2: "C2 Proficiency" };
export const TFNG = ["TRUE", "FALSE", "NOT GIVEN"], YNNG = ["YES", "NO", "NOT GIVEN"];
const LETTERED = 'the passage has 6–8 paragraphs and each paragraph starts with its letter and a full stop ("A. …", "B. …")';
export const wc = s => (String(s || "").match(/[A-Za-z0-9][A-Za-z0-9'’-]*/g) || []).length;

// ---------- luật theo DẠNG CÂU (mỗi nhóm câu của đề) ----------
// lab: nhãn cố định · nopt: số lựa chọn riêng của từng câu · shared: dùng danh sách chung của nhóm (opts) · extra: số lựa chọn dư tối thiểu
// lim / limMin: số từ của đáp án gõ · inText: đáp án phải có nguyên văn trong bài / lời nghe · ord: câu theo thứ tự bài / lời nghe · maxQ: số từ tối đa của câu (tin ngắn kèm câu hỏi)
export const TY = {
  "R-tf": { lab: TFNG, ord: 1 }, "R-yn": { lab: YNNG, ord: 1 }, "R-mc": { nopt: 4, ord: 1 },
  "R-comp": { lim: 2, inText: 1, ord: 1 }, "R-sa": { lim: 3, inText: 1, ord: 1 }, "R-dia": { lim: 2, inText: 1, ord: 1 },
  "R-h": { shared: 1, extra: 2 }, "R-mi": { shared: 1 }, "R-mf": { shared: 1 }, "R-se": { shared: 1, extra: 2, ord: 1 }, "R-sum": { shared: 1, extra: 3, ord: 1 }, "R-gt": { shared: 1 },
  "L-form": { lim: 2, inText: 1, ord: 1 }, "L-mc": { nopt: 3, ord: 1 }, "L-match": { shared: 1, extra: 1, ord: 1 }, "L-sa": { lim: 3, inText: 1, ord: 1 },
  p2: { nopt: 3 }, p3: { nopt: 4, ord: 1 }, p4: { nopt: 4, ord: 1 }, p6: { nopt: 4, ord: 1 }, p7: { nopt: 4 },
  mc: { nopt: 4, ord: 1 }, cloze: { nopt: 4, ord: 1 }, open: { lim: 1, ord: 1 }, wf: { lim: 1, ord: 1 }, kwt: { lim: 5, limMin: 2 },
  gap: { lim: 3, inText: 1, ord: 1 }, box: { shared: 1, extra: 2, ord: 1 }, story: { shared: 1, extra: 2, ord: 1 }, resp: { nopt: 3, ord: 1 },
  comp: { lim: 3, inText: 1, ord: 1 }, name: { lim: 1, inText: 1, ord: 1 }, sn: { nopt: 3, maxQ: 70 },
};
export const rule = (sp, ty) => ({ ...(TY[ty] || (String(ty).startsWith("p5") ? { nopt: 4 } : {})), ...((sp.ty || {})[ty] || {}) });

// ---------- IELTS ----------
const IE_RD = {
  "R-tf": "TRUE / FALSE / NOT GIVEN: statements about factual information in the passage; o = exactly TRUE, FALSE, NOT GIVEN; use each answer at least once.",
  "R-yn": "YES / NO / NOT GIVEN: statements about the writer's views or claims (the passage must state clear opinions); o = exactly YES, NO, NOT GIVEN; use each answer at least once.",
  "R-mc": "Multiple choice: 4 options (A–D); exactly one is supported by the passage.",
  "R-comp": "Sentence completion: each q is a sentence with ______; the answer is NO MORE THAN TWO WORDS copied exactly from the passage; o = [].",
  "R-sa": "Short-answer questions: the answer is NO MORE THAN THREE WORDS AND/OR A NUMBER copied exactly from the passage; o = [].",
  "R-dia": "Note, table or flow-chart completion: each q is the next note line, table cell or flow-chart step with ______; the answer is NO MORE THAN TWO WORDS copied exactly from the passage; o = [].",
  "R-h": `Matching headings: group opts = a list of headings with 2–3 more headings than questions; each q = "Paragraph B" (etc.); a = the right heading; ${LETTERED}.`,
  "R-mi": `Matching information: each q describes a piece of information ("a reference to…", "an example of…"); group opts = the paragraph letters; a = the letter of the paragraph that contains it; a letter may be used more than once; ${LETTERED}.`,
  "R-mf": 'Matching features: group opts = 3–5 people, places, theories or dates from the passage, each written "A. …"; each q is a statement or finding; a = the matching option; an option may be used more than once.',
  "R-se": "Matching sentence endings: each q is the first half of a sentence about the passage; group opts = the possible endings, 2–3 more than the questions; a = the ending that completes the sentence correctly.",
  "R-sum": "Summary completion with a box: group inst names the summary; each q is the next sentence of the summary with ______; group opts = a box of single words or short phrases, 3–5 more than the gaps; a = the word from the box (the meaning must be in the passage).",
};
const IE_LP = {
  "L-form": { part: "IELTS Listening Part 1", w: [450, 700], sp: [2, 2], tys: ["L-form", "L-mc"], main: "L-form", mainN: [6, 10],
    d: "Part 1: a conversation between TWO speakers in an everyday social context (a booking, an enquiry or a registration: one person asks, the other gives information). Group L-form = form, note or table completion: each q is the next line of the form or notes with ______; the answer is ONE WORD AND/OR A NUMBER said exactly by a speaker (a speaker spells names letter by letter); o = []. You may end with a group L-mc of 3–4 multiple-choice questions with 3 options (A–C)." },
  "L-match": { part: "IELTS Listening Part 2", w: [500, 750], sp: [1, 2], tys: ["L-match", "L-mc"], main: "L-match", mainN: [4, 6],
    d: 'Part 2: a monologue in an everyday social context (a guide, a talk about local facilities or an event); a short introduction by a second speaker is allowed. Two groups: L-match = matching: group opts = 5–8 options written "A. …" (at least 2 more than the questions); each q is a place, person or thing; a = the matching option. L-mc = multiple choice with 3 options (A–C).' },
  "L-mc": { part: "IELTS Listening Part 3", w: [500, 750], sp: [2, 3], tys: ["L-mc", "L-match"], main: "L-mc", mainN: [5, 6],
    d: 'Part 3: a discussion between 2 or 3 speakers in an educational or training context (students and a tutor). Groups: L-mc = multiple choice with 3 options (A–C), 5–6 questions; then L-match = matching opinions or features: group opts = 5–7 options written "A. …"; 4–5 questions.' },
  "L-note": { part: "IELTS Listening Part 4", w: [550, 800], sp: [1, 1], tys: ["L-form"], main: "L-form", mainN: [9, 10], ty: { "L-form": { lim: 1 } },
    d: "Part 4: a lecture or talk on an academic subject by ONE speaker (who = A). One group L-form = note completion: 10 note lines with ______ in the order of the lecture (short headings inside the notes are fine); the answer is ONE WORD ONLY said exactly in the lecture; o = []." },
};

// ---------- Cambridge (cấp "+" dùng khuôn của cấp gốc) ----------
const cbBase = lv => String(lv).replace(/p$/, "");   // a2p → a2, b1p → b1, b2p → b2
const GAPS = n => `Items in order, q = "Gap 1" … "Gap ${n}".`;
function cbDoc(b, dang) { const N = CBN[b], R = (p, o) => ({ fam: "read", part: `${N} · Reading and Writing Part ${p}`, ...o }), U = (p, o) => ({ fam: "read", part: `${N} · ${["b2", "c1", "c2"].includes(b) ? "Reading and Use of English" : "Reading"} Part ${p}`, ...o });
  if (b === "pre") return dang === "box" ? R(4, { d: `A short text (a simple description of an animal, a thing or a place) with 5 gaps written [1] … [5]. Group opts = a box of 8 words (the 5 answers + 3 extra), simple nouns from the Starters word list. ${GAPS(5)} a = the word from the box.`, q: [5, 5], w: [50, 90], tys: ["box"], min: 5 }) : null;
  if (b === "a1") return ({
    resp: { fam: "single", part: `${N} · Reading and Writing Part 2`, d: 'Read the conversation and choose the best answer: a short conversation between two named people (for example a girl and her grandmother). Each q is what the first person says, starting with the name ("Grandma: Where are you going?"); o = 3 short replies for the second person; exactly one is the natural reply.', q: [5, 6], tys: ["resp"], min: 5 },
    story: R(3, { d: `A short story (80–130 words) with 5 gaps written [1] … [5]. Group opts = a box of 8 words (the 5 answers + 3 extra) from the Movers word list. ${GAPS(5)} a = the word from the box.`, q: [5, 5], w: [80, 130], tys: ["story"], min: 6 }),
    cloze: R(4, { d: `A short factual text (80–130 words) with 5 gaps written [1] … [5]; 3 options each (words that differ in grammar or meaning). ${GAPS(5)}`, q: [5, 5], w: [80, 130], tys: ["cloze"], ty: { cloze: { nopt: 3 } }, min: 5 }),
    comp: R(5, { d: "A story of 150–250 words in 3 short paragraphs. Each q is a sentence about the story with ______, in the order of the story; the answer is 1, 2 or 3 words copied exactly from the story; o = [].", q: [6, 7], w: [150, 250], tys: ["comp"], min: 8 }),
  })[dang] || null;
  const SN = n => ({ fam: "single", part: `${N} · Reading Part 1`, d: `${n} short real-world texts (a notice, a sign, a text message, an email, a note or a label), each 10–35 words. Each q = the whole short text, then a new line, then one question about it (for example "What does the notice say?"); o = 3 options (A–C) that paraphrase; exactly one is right.`, q: [n, n], tys: ["sn"], min: n });
  if (b === "a2") return ({
    sn: SN(6),
    mc: U(3, { d: "One longer text (an article or a story) of 230–300 words; 5 multiple-choice questions with 3 options (A–C) in the order of the text.", q: [5, 5], w: [230, 300], tys: ["mc"], ty: { mc: { nopt: 3 } }, min: 8 }),
    cloze: U(4, { d: `Multiple-choice cloze: a factual text (90–150 words) with 6 gaps written [1] … [6]; 3 options each. ${GAPS(6)}`, q: [6, 6], w: [90, 150], tys: ["cloze"], ty: { cloze: { nopt: 3 } }, min: 6 }),
    open: U(5, { d: `Open cloze: an email or a short text (80–130 words) with 6 gaps written [1] … [6]; each gap needs ONE word (grammar words: articles, prepositions, pronouns, auxiliaries, linking words). ${GAPS(6)} o = []; a = the word; acc = other correct words if any.`, q: [6, 6], w: [80, 130], tys: ["open"], min: 6 }),
  })[dang] || null;
  if (b === "b1") return ({
    sn: SN(5),
    mc: U(3, { d: "One longer text of 300–400 words (an article or a personal story); 5 multiple-choice questions with 4 options (A–D) in the order of the text (the last may ask about the whole text).", q: [5, 5], w: [300, 400], tys: ["mc"], min: 10 }),
    cloze: U(5, { d: `Multiple-choice cloze: a text of 120–170 words with 6 gaps written [1] … [6]; 4 options each (meaning, collocation, phrasal verbs). ${GAPS(6)}`, q: [6, 6], w: [120, 170], tys: ["cloze"], min: 6 }),
    open: U(6, { d: `Open cloze: a text of 120–170 words with 6 gaps written [1] … [6]; each gap needs ONE word (mostly grammar words). ${GAPS(6)} o = []; a = the word; acc = other correct words if any.`, q: [6, 6], w: [120, 170], tys: ["open"], min: 6 }),
  })[dang] || null;
  const W = { b2: [150, 220], c1: [180, 260], c2: [180, 280] }[b], L = { b2: [550, 650], c1: [650, 800], c2: [700, 850] }[b], K = { b2: [2, 5], c1: [3, 6], c2: [3, 8] }[b];
  if (!W) return null;
  return ({
    cloze: U(1, { d: `Multiple-choice cloze: a text of ${W[0]}–${W[1]} words with 8 gaps written [1] … [8]; 4 options each (meaning, collocation, fixed phrases, phrasal verbs, linking words). ${GAPS(8)}`, q: [8, 8], w: W, tys: ["cloze"], min: 8 }),
    open: U(2, { d: `Open cloze: a text of ${W[0]}–${W[1]} words with 8 gaps written [1] … [8]; each gap needs ONE word (mostly grammar words: articles, prepositions, auxiliaries, pronouns, linking words, parts of fixed phrases). ${GAPS(8)} o = []; a = the word; acc = other correct words if any.`, q: [8, 8], w: W, tys: ["open"], min: 8 }),
    wf: U(3, { d: `Word formation: a text of ${W[0]}–${W[1]} words with 8 gaps written [1] … [8]; each gap has a stem word in capitals at the end of its line. ${GAPS(8)} q = "Gap 1 (STEM)"; o = []; a = the ONE word formed from the stem (prefixes, suffixes, plural, negative, compounds).`, q: [8, 8], w: W, tys: ["wf"], min: 8 }),
    kwt: U(4, { fam: "single", d: `Key word transformation: each q = the first sentence, a new line with the KEY WORD in capitals, and a second sentence with ______; the answer is ${K[0]}–${K[1]} words including the key word (the key word must not change), so that the second sentence means the same as the first. o = []; acc = other correct answers.`, q: [6, 6], tys: ["kwt"], ty: { kwt: { lim: K[1], limMin: K[0] } }, min: 8 }),
    mc: U(5, { d: `One long text of ${L[0]}–${L[1]} words (an article, a report of an experience or an extract from a novel); 6 multiple-choice questions with 4 options (A–D) in the order of the text: detail, opinion, attitude, the meaning of a phrase, reference, purpose.`, q: [6, 6], w: L, tys: ["mc"], min: b === "b2" ? 15 : 18 }),
  })[dang] || null; }
function cbNghe(b, dang) { const N = CBN[b], P = (p, o) => ({ fam: "listen", part: `${N} · Listening Part ${p}`, ...o });
  if (b === "pre" || b === "a1") return dang === "name" ? P(2, { d: `A conversation between a child and an adult (who = A, B). 5 questions about ${b === "pre" ? "the names of people (the speaker spells each name letter by letter, for example \"It's Kim. K-I-M.\") and numbers from 1 to 20" : "names (spelled letter by letter), numbers from 1 to 100 and simple words (days, places, things)"}. Each q = a short question or form line with ______; a = ONE word (a name or a word) or a number; write numbers as digits in both the transcript and the answer; o = [].`, q: [5, 5], w: b === "pre" ? [100, 200] : [120, 220], sp: [2, 2], tys: ["name"], min: 6 }) : null;
  const G = { a2: [2, 5, [150, 250], 2, "A monologue (an announcement, a phone message or a short talk) by one speaker. 5 gaps in notes or a form; the answer is ONE word, a number, a date or a time said exactly; o = [].", 6],
    b1: [3, 6, [250, 350], 2, "A monologue (a radio talk or an announcement) by one speaker; 6 gaps in notes; the answer is one or two words, or a number, a date or a time, said exactly; o = [].", 8],
    b2: [2, 10, [500, 700], 3, "A monologue by one speaker (a talk about a job, a hobby or an experience); 10 sentences with ______ in the order of the talk; the answer is 1–3 words said exactly; o = [].", 10],
    c1: [2, 8, [500, 700], 3, "A monologue by one speaker (a talk or presentation); 8 sentences with ______ in the order of the talk; the answer is 1–3 words said exactly; o = [].", 10],
    c2: [2, 9, [550, 750], 3, "A monologue by one speaker (a talk or lecture); 9 sentences with ______ in the order of the talk; the answer is 1–3 words said exactly; o = [].", 10] }[b];
  const M = { a2: [3, 5, [250, 350], 3, "A conversation between two people (who = A, B)", 6], b1: [4, 6, [400, 550], 3, "An interview (who = A interviewer, B guest)", 8], b2: [4, 7, [550, 750], 3, "An interview or a conversation (who = A, B)", 10],
    c1: [3, 6, [550, 750], 4, "An interview or a discussion (who = A, B, and C if needed)", 10], c2: [3, 5, [550, 750], 4, "An interview or a discussion (who = A, B, and C if needed)", 10] }[b];
  if (dang === "gap" && G) return P(G[0], { d: G[4], q: [G[1], G[1]], w: G[2], sp: [1, 1], tys: ["gap"], ty: { gap: { lim: G[3] } }, min: G[5] });
  if (dang === "mc" && M) return P(M[0], { d: `${M[4]}; ${M[1]} multiple-choice questions with ${M[3]} options (${M[3] === 4 ? "A–D" : "A–C"}) in the order of the recording.`, q: [M[1], M[1]], w: M[2], sp: [2, M[3] === 4 ? 3 : 2], tys: ["mc"], ty: { mc: { nopt: M[3] } }, min: M[5] });
  return null; }
const CB_W = { a2: ["Writing Part 6", "an email or note answering three points (25–45 words), task.min = 25"], a2p: ["Writing Part 6", "an email answering three points (35–50 words), task.min = 35"],
  b1: ["Writing Part 1", "an email reply answering four points, or an article, about 100 words, task.min = 100"], b1p: ["Writing Part 1", "an email or an article of about 100–120 words, task.min = 100"],
  b2: ["Writing Part 1", "an essay of 140–190 words that discusses two given ideas plus the writer's own idea, task.min = 140, task.max = 190"], b2p: ["Writing Part 1", "an essay of 140–190 words with two given ideas plus one of your own, task.min = 140, task.max = 190"],
  c1: ["Writing Part 1", "an essay of 220–260 words comparing two of three given options, task.min = 220, task.max = 260"], c2: ["Writing Part 2", "an article, report or review of 280–320 words, task.min = 280, task.max = 320"] };

// ---------- bảng dạng đề ----------
// trả về khuôn của một dạng, hoặc null nếu dạng không có ở kỳ thi / cấp đó (máy chủ báo "Dạng đề này chưa có.")
export function spec(ky, sk, dang) {
  const ie = String(ky).startsWith("ielts"), gt = ky === "ielts-gt", cb = String(ky).startsWith("cb-"), lv = cb ? ky.slice(3) : "", b = cbBase(lv), low = ["pre", "a1", "a2"].includes(b);
  if (ie && sk === "doc") {
    if (dang === "R-gt") return gt ? { fam: "read", part: "IELTS General Training Reading · Section 1", q: [12, 14], ask: 13, w: [350, 600], tys: ["R-gt", "R-tf"], main: "R-gt", mainN: [6, 8], min: 20,
      d: 'General Training Section 1: 4–7 short everyday texts (adverts, notices, timetables, instructions) one after another, each starting with its letter on its own line ("A. …"). Two groups: R-gt = 6–8 statements, group opts = the text letters, a = the letter of the one text each statement is true for; R-tf = 5–7 TRUE / FALSE / NOT GIVEN statements about one or two of the texts (o = exactly TRUE, FALSE, NOT GIVEN).' } : null;
    if (dang !== "*" && !IE_RD[dang]) return null;
    const others = Object.keys(IE_RD).filter(k => k !== dang);
    return { fam: "read", part: gt ? "IELTS General Training Reading · Section 3" : "IELTS Academic Reading · one passage", q: [12, 14], ask: 13, w: [700, 900], tys: Object.keys(IE_RD), main: dang === "*" ? "" : dang, mainN: [5, 7], min: 20,
      d: `One reading passage as in the real test (about 20 minutes) with 13 questions in 2 or 3 groups, each group one question type. ${dang === "*" ? "Choose 2 or 3 question types from the list below." : `One group MUST be ${dang} with 5–7 questions; choose the other 1 or 2 group types from: ${others.join(", ")}.`} Number the work like the real test: the questions of one group come one after another.\nQuestion types:\n${Object.entries(IE_RD).map(([k, v]) => `- ${k}: ${v}`).join("\n")}` }; }
  if (ie && sk === "nghe") { const s = IE_LP[dang === "*" ? "L-form" : dang]; return s ? { fam: "listen", ...s, q: [9, 10], ask: 10, min: 10 } : null; }
  if (ie && sk === "viet") {
    if (dang === "t1" && !gt) return { fam: "write", part: "IELTS Academic Writing Task 1", tys: [], min: 20, chart: 1,
      d: 'Academic Writing Task 1. Choose the kind that suits the topic: a line graph (changes over time), a bar chart (comparison), one or two pie charts (proportions) or a table. task.chart: kind = "line", "bar", "pie" or "table"; title; unit (for example "%", "million", "tonnes"); cats = 3–8 labels (the time points, the categories, or for pie charts the segments); series = 1–4 data series { name, v } with one number for each label (pie: 1 or 2 series, each adding up to 100 when the unit is %). task.p = the task you write yourself: "The [graph / chart / charts / table] below shows … Summarise the information by selecting and reporting the main features, and make comparisons where relevant." task.genre = the kind. task.pv = the task in Vietnamese. task.min = 150. task.m = a band-7 model answer of 160–190 words.' };
    if (dang === "t2") return { fam: "write", part: "IELTS Writing Task 2", tys: [], min: 40, d: "Writing Task 2. task.p = one essay question on the topic (choose one kind: opinion, discussion of two views, advantages and disadvantages, problem and solution, or a two-part question) followed by the usual instruction you write yourself, e.g. \"Give reasons for your answer and include any relevant examples from your own knowledge or experience.\" task.genre = the kind as one key: opinion, discuss, advdis, probsol or twopart. task.pv = the question in Vietnamese. task.min = 250. task.m = a band-7 model essay of 260–300 words." };
    if (dang === "gt1" && gt) return { fam: "write", part: "IELTS General Training Writing Task 1", tys: [], min: 20, d: 'General Training Writing Task 1 letter. task.p = the situation, then "In your letter" and three bullet points, then "Begin your letter as follows: Dear …,". Choose a tone that fits and give it in task.genre as one key: formal, semi or informal. task.pv = the situation in Vietnamese. task.min = 150. task.m = a model letter of 160–190 words.' };
    return null; }
  if (ie && sk === "noi") {
    if (dang === "p1") return { fam: "speak", part: "IELTS Speaking Part 1", tys: [], min: 5, p1: [9, 12], d: 'Speaking Part 1 (4–5 minutes). speak.p1 = 9–12 questions in 3 frames, in order: frame 1 = 3–4 questions about where the candidate lives OR their work or studies; frames 2 and 3 = 3–4 questions each about two everyday topics (the given topic is one of them). Start each frame with a lead-in question ("Let\'s talk about …. Do you …?"). speak.p2 = { t: "", b: [] }, speak.p3 = [].' };
    if (dang === "p2") return { fam: "speak", part: "IELTS Speaking Part 2 and 3", tys: [], min: 8, d: 'Speaking Part 2 and 3. speak.p2 = a cue card: t = "Describe …", b = 4 prompts: "who / what / when…" and the last starts with "and explain". speak.p3 = 4–6 discussion questions linked to the card, more abstract. speak.p1 = [].' };
    return null; }
  if (ky === "toeic") {
    if (sk === "np" && /^p5(:(form|verb|prep|conj|pron|struct|voc))?$/.test(dang)) { const one = dang.includes(":") ? dang : "";
      return { fam: "single", part: "TOEIC Reading Part 5", d: `TOEIC Part 5 incomplete sentences. Each q is one business sentence with ------- for the gap; 4 options; exactly one is grammatically and logically right. ${one ? `All items test the category ${one.slice(3)}; one group with ty "${one}".` : 'Mix categories and make one group per category, ty = "p5:form" (word forms), "p5:verb" (tense, voice, -ing / to-infinitive), "p5:prep", "p5:conj" (conjunctions, linking words), "p5:pron" (pronouns, relative clauses), "p5:struct" (comparison, inversion), "p5:voc" (vocabulary, collocations).'}`,
        q: [10, 10], tys: one ? [one] : ["p5:form", "p5:verb", "p5:prep", "p5:conj", "p5:pron", "p5:struct", "p5:voc"], min: 5 }; }
    if (sk === "np" && dang === "p6") return { fam: "read", part: "TOEIC Reading Part 6", d: "TOEIC Part 6 text completion. One business text (email, notice, memo or article) with 4 gaps written [1] [2] [3] [4] in the text. Items in order, q = \"Gap 1\" … \"Gap 4\"; 4 options each; three gaps are words or phrases, one gap is a whole sentence to insert.", q: [4, 4], w: [110, 200], tys: ["p6"], min: 4 };
    if (sk === "doc" && dang === "p7") return { fam: "read", part: "TOEIC Reading Part 7", d: 'TOEIC Part 7 reading. One or two business documents (email, advertisement, article, form, or a text-message chain where each message is "Name (10:42 A.M.): …"). Start each document with a line "### <document type>". 3–5 questions with 4 options: purpose, detail, inference, "What is NOT …", "closest in meaning to" a word in the text. You may add ONE sentence-insertion question: put the markers [1], [2], [3] and [4] in the document; q = "In which of the positions marked [1], [2], [3], and [4] does the following sentence best belong? \\"<the sentence>\\""; o = ["[1]", "[2]", "[3]", "[4]"]. For a text-message chain you may add ONE intent question: "At 10:42 A.M., what does Ms. X most likely mean when she writes, \\"<words>\\"?" — the quoted words appear exactly in the chain.', q: [3, 5], w: [150, 350], tys: ["p7"], min: 6 };
    if (sk === "nghe" && dang === "p2") return { fam: "qr", part: "TOEIC Listening Part 2", d: "TOEIC Part 2 question–response. 8 items. Each q is one spoken question or statement at work; o = exactly 3 spoken responses; exactly one is a natural reply. Use the real traps: similar-sounding or repeated words, an answer to a different question type (a yes/no answer to a Wh- question). text = \"\", lines = [] (the app reads q and o aloud).", q: [8, 8], tys: ["p2"], min: 4 };
    if (sk === "nghe" && (dang === "p3" || dang === "p4")) return { fam: "listen", part: `TOEIC Listening Part ${dang.slice(1)}`, q: [3, 3], w: [100, 200], tys: [dang], min: 3, sp: dang === "p3" ? [2, 3] : [1, 1],
      d: dang === "p3" ? "TOEIC Part 3 conversation at work between 2 or 3 speakers (lines with who = A, B, C), 120–180 words, then 3 questions with 4 options in the order of the conversation (who the speakers are or the problem, a detail, what happens next). One of the 3 may ask about implied meaning: \"What does the man / woman mean when he / she says, \\\"<words>\\\"?\" — the quoted words appear exactly in the conversation."
        : "TOEIC Part 4 short talk by ONE speaker (who = A): an announcement, a voicemail, a tour, an advertisement or a meeting excerpt, 110–170 words, then 3 questions with 4 options in the order of the talk. One of the 3 may be \"Why does the speaker say, \\\"<words>\\\"?\" — the quoted words appear exactly in the talk." };
    return null; }
  if (cb && CEFR[lv]) {
    if (sk === "doc") return cbDoc(b, dang);
    if (sk === "nghe") return cbNghe(b, dang);
    if (sk === "viet" && dang === "w" && CB_W[lv]) return { fam: "write", part: `${CBN[b]} · ${CB_W[lv][0]}`, tys: [], min: low ? 10 : 35, d: `Writing task for ${KY[ky]}: ${CB_W[lv][1]}. task.p = the full task the candidate reads (you write it). task.pv = the task in Vietnamese. task.genre = the text type in English. task.m = a model answer that clearly meets the level.` };
    if (sk === "noi" && dang === "p1") return { fam: "speak", part: `${CBN[b]} · Speaking${["pre", "a1"].includes(b) ? " (questions about you)" : " Part 1"}`, tys: [], min: 5, d: `Speaking Part 1 interview for ${KY[ky]}: speak.p1 = 5 questions about the topic that suit the level (${low ? "very short, simple questions" : "from simple to more open"}). speak.p2 = { t: "", b: [] }, speak.p3 = [].` };
    return null; }
  return null; }

// ---------- máy kiểm khuôn ----------
const QUOTE_Q = /\b(mean|meant|imply|implies|say|says|said|write|writes|wrote)\b[^"“”]*["“]([^"”]{3,})["”]/i;   // câu hàm ý / ý định: phần trích phải có trong bài
const INS_Q = /positions? marked \[1\]/i;
const MARK = ["[1]", "[2]", "[3]", "[4]"];
// xếp câu theo thứ tự bài: "Gap N" theo số; còn lại theo vị trí câu chứa đáp án; câu không định vị được giữ chỗ
export function byOrder(items, body) {
  const gapN = it => { const m = String(it.q).match(/^Gap (\d+)/i); return m ? +m[1] : -1; };
  const pos = items.every(it => gapN(it) >= 0) ? items.map(gapN) : items.map(it => it.ev ? body.indexOf(norm(it.ev)) : -1);
  const known = items.map((it, i) => [pos[i], i, it]).filter(x => x[0] >= 0).sort((a, b) => a[0] - b[0] || a[1] - b[1]).map(x => x[2]);
  let k = 0; return items.map((it, i) => pos[i] >= 0 ? known[k++] : it); }
function okChart(c) { const kinds = ["line", "bar", "pie", "table"];
  if (!c || !kinds.includes(c.kind)) return "loại biểu đồ";
  const cats = (c.cats || []).map(s => String(s).trim()).filter(Boolean), ser = c.series || [];
  if (cats.length < 3 || cats.length > 8) return "số nhãn";
  if (ser.length < 1 || ser.length > (c.kind === "pie" ? 2 : 4)) return "số dãy số";
  for (const s of ser) { if (!String(s.name || "").trim() || !Array.isArray(s.v) || s.v.length !== cats.length || s.v.some(x => typeof x !== "number" || !isFinite(x) || x < 0)) return "dãy số";
    if (c.kind === "pie" && /%/.test(c.unit || "")) { const t = s.v.reduce((a, x) => a + x, 0); if (t < 98 || t > 102) return "biểu đồ tròn không cộng 100%"; } }
  return ""; }
export function clean(g, sp, P) {
  const hard = [], soft = [];
  const de = { v: 2, ...P, part: sp.part || "", title: String(g.title || "").trim().slice(0, 120), topic: String(g.topic || "").trim().slice(0, 120), gist: String(g.gist || "").trim().slice(0, 300), vi: String(g.vi || "").trim().slice(0, 200), min: sp.min };
  if (!de.title) hard.push("thiếu tên đề");
  if (sp.fam === "read") de.text = String(g.text || "").trim();
  if (sp.fam === "listen") { de.lines = (g.lines || []).map(l => [String(l.who || "A").trim().toUpperCase().slice(0, 1) || "A", String(l.s || "").trim()]).filter(l => l[1]);
    de.sex = Object.fromEntries((g.voices || []).map(v => [String(v.who || "").trim().toUpperCase().slice(0, 1), v.g]).filter(v => v[0]));
    if (!de.lines.length) hard.push("thiếu lời nghe");
    if (sp.sp) { const n = new Set(de.lines.map(l => l[0])).size; if (n < sp.sp[0] || n > sp.sp[1]) hard.push(`số người nói ${n} (cần ${sp.sp[0] === sp.sp[1] ? sp.sp[0] : sp.sp.join("–")})`); } }
  const raw = [de.text || "", ...(de.lines || []).map(l => l[1])].join(" "), body = norm(raw), inBody = s => !!norm(s) && (" " + body + " ").includes(" " + norm(s) + " ");
  if (sp.w) { const n = wc(raw); if (n < sp.w[0] * 0.85 || n > sp.w[1] * 1.25) hard.push(`độ dài ${n} từ (cần ${sp.w[0]}–${sp.w[1]})`); }
  if (sp.q) { const seen = new Set(); de.groups = [];
    if (sp.fam === "read" && (g.groups || []).some(gr => gr.ty === "R-h" || gr.ty === "R-mi") && (de.text.match(/(^|\n)\s*[A-H]\.\s/g) || []).length < 4) hard.push("bài chưa đánh chữ đoạn A. B. …");
    for (const gr of g.groups || []) { const ty = sp.tys.includes(gr.ty) ? gr.ty : sp.tys.length === 1 ? sp.tys[0] : ""; if (!ty) { soft.push("nhóm sai dạng " + gr.ty); continue; }
      const R = rule(sp, ty); let opts = (gr.opts || []).map(s => String(s).trim()).filter(Boolean); opts = opts.filter((x, i) => opts.findIndex(y => norm(y) === norm(x)) === i);
      if (R.shared && opts.length < 2) { soft.push("nhóm thiếu danh sách lựa chọn"); continue; }
      let items = [];
      for (const it of gr.items || []) { const q = String(it.q || "").trim(), k = norm(q); if (!q || seen.has(k)) { soft.push("câu trùng / rỗng"); continue; }
        let o = R.lab ? R.lab.slice() : R.shared ? opts.slice() : ((it.o || []).length ? it.o : opts).map(s => String(s).trim()).filter(Boolean);
        o = o.filter((x, i) => o.findIndex(y => norm(y) === norm(x)) === i);
        let a = String(it.a || "").trim(), acc = (it.acc || []).map(s => String(s).trim()).filter(Boolean); const why = String(it.why_vi || "").trim(); let ev = String(it.ev || "").trim();
        if (!a || !why) { soft.push("thiếu đáp án / giải thích"); continue; }
        if (R.maxQ && wc(q) > R.maxQ) { soft.push("tin ngắn quá dài"); continue; }
        const ins = INS_Q.test(q);
        if (ins) { if (!MARK.every(m => (de.text || "").includes(m))) { soft.push("bài thiếu dấu [1]–[4]"); continue; } o = MARK.slice(); }
        else { const m = q.match(QUOTE_Q); if (m && !inBody(m[2])) { soft.push("câu trích không có trong bài"); continue; } }
        if (o.length) { const hit = o.find(x => norm(x) === norm(a)) || (/^[A-Ha-h]$/.test(a) ? o[a.toUpperCase().charCodeAt(0) - 65] : undefined) || (ins ? o.find(x => x === `[${a.replace(/\D/g, "")}]`) : undefined);
          if (!hit) { soft.push("đáp án không có trong lựa chọn"); continue; } a = hit; acc = [];
          if (R.nopt && !R.shared && !R.lab && !ins && o.length !== R.nopt) { soft.push("số lựa chọn sai"); continue; } }
        else { const lim = R.lim || 3, lo = R.limMin || 1, n = wc(a); if (n > lim || n < lo) { soft.push("đáp án sai số từ"); continue; }
          if (R.inText && !inBody(a)) { soft.push("đáp án không có trong bài"); continue; }
          acc = acc.filter(x => wc(x) <= lim && wc(x) >= lo && norm(x) !== norm(a) && (!R.inText || inBody(x))); }
        if (ev && !body.includes(norm(ev))) ev = "";
        seen.add(k); items.push({ q, o, a, ...(acc.length ? { acc } : {}), why_vi: why, ev }); }
      if (R.ord) items = byOrder(items, body);
      if (R.shared && R.extra && items.length && opts.length < items.length + 1) soft.push("danh sách lựa chọn ít");
      if (items.length) de.groups.push({ ty, inst: String(gr.inst || "").trim(), ...(opts.length ? { opts } : {}), ...(!opts.length && !R.lab && R.lim ? { lim: R.lim } : {}), items }); }
    let n = de.groups.reduce((s, x) => s + x.items.length, 0);
    while (n > sp.q[1]) { const big = de.groups.reduce((m, x) => x.items.length > m.items.length ? x : m, de.groups[0]); big.items.pop(); n--; }
    de.groups = de.groups.filter(x => x.items.length);
    if (n < sp.q[0]) hard.push(`chỉ còn ${n} câu dùng được (cần ${sp.q[0]})`);
    if (sp.main) { const mn = de.groups.filter(x => x.ty === sp.main).reduce((s, x) => s + x.items.length, 0); if (mn < Math.min(4, sp.mainN[0])) hard.push(`nhóm ${sp.main} chỉ có ${mn} câu (cần ${sp.mainN[0]}–${sp.mainN[1]})`); }
    for (const gr of de.groups) { const R = rule(sp, gr.ty); if (R.lab && gr.items.length >= 5 && new Set(gr.items.map(x => x.a)).size < 3) soft.push("đáp án lệch về một nhãn"); } }
  if (sp.fam === "write") { const t = g.task || {}; de.task = { part: P.dang, p: String(t.p || "").trim(), pv: String(t.pv || "").trim(), min: Math.max(0, Math.round(t.min || 0)) || 0, ...(t.max > 0 ? { max: Math.round(t.max) } : {}), genre: String(t.genre || "").trim(), m: String(t.m || "").trim() };
    if (!de.task.p || !de.task.min) hard.push("thiếu đề viết / số từ");
    if (sp.chart) { const c = t.chart, bad = okChart(c); if (bad) hard.push("biểu đồ sai khuôn: " + bad);
      else de.task.chart = { kind: c.kind, title: String(c.title || "").trim(), unit: String(c.unit || "").trim(), cats: c.cats.map(s => String(s).trim()), series: c.series.map(s => ({ name: String(s.name).trim(), v: s.v.slice() })) }; } }
  if (sp.fam === "speak") { const s = g.speak || { p1: [], p2: { t: "", b: [] }, p3: [] }; de.speak = { p1: (s.p1 || []).map(x => String(x).trim()).filter(Boolean), p2: { t: String((s.p2 || {}).t || "").trim(), b: ((s.p2 || {}).b || []).map(x => String(x).trim()).filter(Boolean) }, p3: (s.p3 || []).map(x => String(x).trim()).filter(Boolean) };
    if (P.dang === "p2" ? !de.speak.p2.t || de.speak.p2.b.length < 3 || de.speak.p3.length < 2 : de.speak.p1.length < (sp.p1 ? sp.p1[0] - 1 : 3)) hard.push("thiếu câu hỏi Nói"); }
  return { de, hard, soft }; }
