# Độ thông dụng (Zipf, thang 0–8; thư viện wordfreq, Apache-2.0) cho mọi từ trong nguồn → content/ref/zipf.json.
# Dùng ở tools/build-levels.mjs để chia cấp "+" (A2+, B1+, B2+; người sáng lập 23/10/2026). Cần: pip install wordfreq. Chạy sau khi đã có a1.json / a2.json / ref.json.
import json, os
from wordfreq import zipf_frequency
R = os.path.join(os.path.dirname(__file__), '..')
ws = {w['w'] for f in ('a1.json', 'a2.json') for u in json.load(open(os.path.join(R, f)))['units'] for w in u['words']} | {w['w'] for w in json.load(open(os.path.join(R, 'ref.json')))['words']}
json.dump({w: round(zipf_frequency(w, 'en'), 2) for w in sorted(ws)}, open(os.path.join(R, 'content/ref/zipf.json'), 'w'))
print(len(ws), 'từ')
