# Áp sửa theo soát (Opus) cho bài 13–24
D = '/tmp/claude-0/-home-user-English-CEFR/48c67d5c-dc08-58ba-be65-4b058158838d/scratchpad/bai/'
F = [
 ('bai23.js', '"Please ___ to the conference by Friday."', '"Please ___ for the conference by Friday."'),
 ('bai23.js', 'ans: ["participants"]', 'ans: ["participants", "attendees"]'),
 ('bai15.js', 'ans: ["because"]', 'ans: ["because", "as", "since"]'),
 ('bai17.js', 'o: ["have", "has", "had", "are"]', 'o: ["have", "has", "does", "are"]'),
 ('bai13.js', 'o: ["are expecting", "expected", "were expecting", "have expected"]', 'o: ["are expecting", "expected", "expecting", "have expected"]'),
 ('bai18.js', 'o: ["Therefore", "However", "Meanwhile", "Otherwise"]', 'o: ["Therefore", "However", "For example", "Otherwise"]'),
 ('bai17.js', 'ans: ["cover"]', 'ans: ["cover", "include"]'),
 ('bai23.js', '"We left early ___ the road was closed."', '"The meeting ended early ___ the speaker felt ill."'),
 ('bai23.js', '"Gửi: Các người tham dự hội nghị"', '"Gửi: Những người tham dự hội nghị"'),
 ('bai22.js', 'hint: "không ai · 6 chữ cái"', 'hint: "không ai"'),
 ('bai13.js', '"phòng khiêu vũ của chúng tôi"', '"sảnh tiệc của chúng tôi"'),
 ('bai15.js', '"ở sảnh chính thay thế."', '"ở sảnh chính thay vào đó."'),
 ('bai19.js', '"Tôi chắc sẽ có mặt ở đó trước mười giờ."', '"Tôi chắc sẽ có mặt ở đó muộn nhất là mười giờ."'),
]
import re
for f, a, b in F:
    s = open(D + f).read(); c = s.count(a)
    if c != 1: print('KHÔNG ÁP', f, a[:50], c); continue
    open(D + f, 'w').write(s.replace(a, b))
# IPA họ Ng (bài 23): đọc /ɪŋ/
s = open(D + 'bai23.js').read(); s = s.replace('ˌenˈdʒiːz', 'ɪŋz').replace('ˌenˈdʒiː', 'ɪŋ'); open(D + 'bai23.js', 'w').write(s)
print('xong')
