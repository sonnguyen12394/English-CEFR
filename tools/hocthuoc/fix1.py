# Áp sửa theo báo cáo soát (Opus) cho bài 3–12
D = '/tmp/claude-0/-home-user-English-CEFR/48c67d5c-dc08-58ba-be65-4b058158838d/scratchpad/bai/'
F = [
 ('bai4.js', "o: ['collects', 'collect', 'collecting', 'collected']", "o: ['collects', 'collect', 'collecting', 'to collect']"),
 ('bai5.js', "o: ['stops', 'stop', 'is stopping', 'stopped']", "o: ['stops', 'stop', 'is stopping', 'stopping']"),
 ('bai5.js', "o: ['have', 'has', 'are having', 'had']", "o: ['have', 'has', 'are having', 'having']"),
 ('bai8.js', '"The train ___ at platform 4 at 6:15 P.M."', '"The train ___ at platform 4 at 6:15 P.M. tomorrow."'),
 ('bai10.js', 'o: ["changing", "to change", "change", "changed"]', 'o: ["changing", "to changing", "change", "changed"]'),
 ('bai12.js', 'o: ["forget", "will forget", "forgot", "forgetting"]', 'o: ["forget", "will forget", "to forget", "forgetting"]'),
 ('bai4.js', "q: 'Delivery is ___ no charge for orders over $50.'", "q: 'We deliver orders over $50 ___ no charge.'"),
 ('bai4.js', "o: ['arrived', 'arrives', 'will arrive', 'has arriving']", "o: ['arrived', 'arrives', 'will arrive', 'is arriving']"),
 ('bai4.js', "ans: ['will call', \"'ll call\"]", "ans: ['will call', \"'ll call\", '’ll call']"),
 ('bai4.js', "q: 'If you ___ the manager, she will approve the budget.'", "q: 'If you ___ the manager today, she will explain the new policy.'"),
 ('bai4.js', "q: 'If you ___ any problem, call our hotline.'", "q: 'If you ___ any problems, call our hotline.'"),
 ('bai9.js', "θɝːzdeɪ|ət|sɪks‿əˈklɑːk|piː‿em", "θɝːzdeɪ|ət|sɪks|ˌpiːˈem"),
 ('bai9.js', '[[0, "θæŋ(k)", "thank you: /k/ đọc nhẹ, nối nhanh sang /j/"]]', '[]'),
 ('bai9.js', '{ q: "Please use the forms ___ at the reception desk.", o: ["provided", "providing", "provides", "provide"]', '{ q: "Please use the envelopes ___ for your receipts.", o: ["provided", "providing", "provides", "provide"]'),
 ('bai9.js', '"động từ (to patient)"', '"giới từ (with patience)"'),
 ('bai3.js', "ɑːn|dʒuˈlaɪ|tuː'", "ɑːn|dʒuˈlaɪ|ˈsekənd'"),
 ('bai6.js', "dʒuːn|ˈθɝːti'", "dʒuːn|ˈθɝːtiəθ'"),
 ('bai12.js', 'ɑːkˈtoʊbər|ten"', 'ɑːkˈtoʊbər|tenθ"'),
 ('bai5.js', "o: ['half', 'part', 'semi', 'low']", "o: ['half', 'halve', 'halves', 'halved']"),
 ('bai5.js', "o: ['to', 'for', 'of', 'that to']", "o: ['to', 'for', 'of', 'with']"),
 ('bai5.js', "ans: ['while', 'as']", "ans: ['while', 'as', 'when']"),
 ('bai6.js', "q: '___ promised, the report is ready on Monday.'", "q: '___ promised, the report will be ready on Monday.'"),
 ('bai7.js', "o: ['recount', 'recall', 'recycle', 'record']", "o: ['recount', 'recall', 'recycle', 'remind']"),
 ('bai8.js', 'o: ["finish", "will finish", "finished", "finishing"]', 'o: ["finish", "will finish", "to finish", "finishing"]'),
 ('bai8.js', 'ans: ["pack", "put"]', 'ans: ["pack", "put", "place"]'),
 ('bai10.js', 'o: ["by", "for", "during", "since"]', 'o: ["by", "at", "during", "since"]'),
 ('bai11.js', 'ans: ["inspect", "check"]', 'ans: ["inspect", "check", "examine"]'),
 ('bai11.js', 'o: ["would take", "would taking", "would took", "would to take"]', 'o: ["would take", "takes", "took", "has taken"]'),
 ('bai12.js', 'o: ["freezes", "will freeze", "froze", "freezing"]', 'o: ["freezes", "will freeze", "to freeze", "freezing"]'),
]
import collections
for f, a, b in F:
    s = open(D + f).read(); assert s.count(a) == 1, (f, a[:50], s.count(a)); s = s.replace(a, b); open(D + f, 'w').write(s)
print('đã sửa', len(F))
