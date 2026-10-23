# Tải Oxford 3000 / 5000 by CEFR level (PDF, oxfordlearnersdictionaries.com) và tách thành content/ref/oxford/levels.json (KHÔNG commit: danh sách có bản quyền;
# .gitignore). Cần pdftotext. Dùng làm chuẩn chính cho tools/build-levels.mjs (người sáng lập 23/10/2026: "Oxford làm chính").
# Chạy: python3 tools/oxford-levels.py
import os, re, json, subprocess, urllib.request
R = os.path.join(os.path.dirname(__file__), '..'); D = os.path.join(R, 'content/ref/oxford'); os.makedirs(D, exist_ok=True)
BASE = 'https://www.oxfordlearnersdictionaries.com/external/pdf/wordlists/oxford-3000-5000/'
ox = {}
for name in ['The_Oxford_3000_by_CEFR_level', 'The_Oxford_5000_by_CEFR_level']:
    pdf = os.path.join(D, name + '.pdf')
    if not os.path.exists(pdf): subprocess.run(['curl', '-sSL', '--max-time', '60', '-o', pdf, BASE + name + '.pdf'], check=True)
    txt = subprocess.run(['pdftotext', pdf, '-'], capture_output=True, text=True).stdout
    lv = None
    for t in map(str.strip, txt.split('\n')):
        if re.fullmatch(r'(A1|A2|B1|B2|C1)', t): lv = t; continue
        m = re.match(r"^([a-zA-Z][a-zA-Z' .\-]*?)(\d)?\s+(?:n\.|v\.|adj\.|adv\.|prep\.|conj\.|pron\.|det\.|exclam\.|number|modal|auxiliary|indefinite|definite|infinitive|ordinal|linking)", t)
        if m and lv:
            for w in m.group(1).split(','):
                k = w.strip().lower()
                if k and k not in ox: ox[k] = lv
json.dump(ox, open(os.path.join(D, 'levels.json'), 'w'))
print('Oxford:', len(ox), 'mục')
