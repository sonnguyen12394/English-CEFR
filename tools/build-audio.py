# Dựng giọng đọc tự nhiên cho bài 🎧 Nghe, câu đọc to / nhắc lại và lời người kia trong đóng vai (27/10/2026, người sáng lập: "làm sao để tôi học đạt thành tựu thi ngoài lấy bằng").
# Đề Cambridge dùng người thật, chủ yếu giọng Anh–Anh; giọng máy của điện thoại đọc đều, chậm. Kokoro (bộ đọc đã làm giọng af_bella của game) có giọng Anh–Anh tự nhiên.
# Ra n/<khoá>.mp3 (24 kHz, mono, 32 kbps như a/) + n/index.json. Khoá = clipKey (app.js) của từng dòng hội thoại và từng câu (kSents), nên speak() / kPlayDlg tự dùng.
# Giọng: hội thoại A nữ / B nam, mỗi bài một cặp (80% Anh–Anh, 20% Mỹ cho quen nhiều giọng như đề thật); bài kể một giọng.
# Cần: python -m venv v && . v/bin/activate && pip install kokoro-onnx soundfile; tải kokoro-v1.0.onnx + voices-v1.0.bin
#   (github.com/thewh1teagle/kokoro-onnx/releases/tag/model-files-v1.0) vào thư mục KM; ffmpeg. Chạy: python tools/build-audio.py KM [số tiến trình]
import json, os, re, sys, subprocess, tempfile, hashlib
from concurrent.futures import ProcessPoolExecutor
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
KM = sys.argv[1] if len(sys.argv) > 1 else 'km'
NP = int(sys.argv[2]) if len(sys.argv) > 2 else 4
F = ['bf_emma', 'bf_isabella', 'bf_alice', 'bf_lily'] + ['af_heart']
M = ['bm_george', 'bm_lewis', 'bm_daniel', 'bm_fable'] + ['am_michael']

def norm(t):   # = clipNorm (app.js)
    t = re.sub(r'[‘’]', "'", str(t)); t = re.sub(r'[“”]', '"', t); t = re.sub(r'\s+', ' ', t).strip(); t = re.sub(r'[.,;:]+$', '', t); return t.lower()
def key(t):    # = clipKey (app.js): FNV-1a trên mã UTF-16
    h = 0x811c9dc5
    for ch in norm(t).encode('utf-16-le').decode('utf-16-le'):
        for u in ([ord(ch)] if ord(ch) < 0x10000 else [0xD800 + ((ord(ch) - 0x10000) >> 10), 0xDC00 + ((ord(ch) - 0x10000) & 0x3FF)]):
            h ^= u; h = (h * 0x01000193) & 0xffffffff
    return 'a' + format(h, '08x')
def sents(t): return [s.strip() for s in re.split(r'(?<=[.!?])\s+', str(t)) if s.strip()]   # = kSents
def pick(seq, sid, salt=''):   # chọn giọng ổn định theo id bài: 4/5 lần Anh–Anh
    h = int(hashlib.md5((sid + salt).encode()).hexdigest(), 16); return seq[h % 4] if h % 5 else seq[4]

jobs = {}   # khoá → (câu, giọng)
def add(t, v):
    k = key(t)
    if k not in jobs: jobs[k] = (t, v)
J = lambda f: json.load(open(os.path.join(ROOT, f), encoding='utf-8'))
for x in J('nghe.json')['items']:
    if x.get('lines'):
        fv, mv = pick(F, x['id'], 'f'), pick(M, x['id'], 'm')
        for sp, t in x['lines']:
            v = fv if sp == 'A' else mv; add(t, v)
            for s in sents(t): add(s, v)
    else:
        v = (F[:4] + M[:4])[int(hashlib.md5(x['id'].encode()).hexdigest(), 16) % 8]
        for s in sents(x['text']): add(s, v)
N = J('noi.json')
for lv, arr in N['test'].items():
    for i, s in enumerate(arr): add(s, (F[:4] + M[:4])[i % 8])
for x in N['items']:
    for var in (x.get('learn') or []) + (x.get('tests') or []):
        for st in var:
            if st.get('s'): add(st['t'], pick(M, x['id'], 'rp'))

C = J('cap.json')   # 🗣 bạn thi ảo nói theo cặp (cap.js): một giọng nữ mỗi đề, lời phản hồi chung giọng nữ đầu
for lv, arr in C['react'].items():
    for s in arr: add(s, F[0])
for x in C['tasks']:
    v = pick(F, x['id'], 'cap')
    for t in [x['open'], *x['turns'], x['decide']]: add(t, v)
A = set(J('a/index.json'))   # 📚 từ và câu ví dụ chưa có tệp thu sẵn của game (a/): giọng nữ Mỹ như a/ (từ bổ sung Oxford, 28/10/2026)
for f in ('a1.json', 'a2.json'):
    for u in J(f)['units']:
        for w in u['words']:
            for t in (w['w'], w.get('ex')):
                if t and key(t) not in A: add(t, 'af_heart')
T = J('toeic.json') if os.path.exists(os.path.join(ROOT, 'toeic.json')) else None   # 🎓 TOEIC (toeic.js, 28/10/2026): giọng Mỹ + Anh như đề thật
if T:
    TF, TM = ['af_heart', 'af_bella', 'af_sarah', 'bf_emma', 'bf_isabella'], ['am_michael', 'am_adam', 'am_eric', 'bm_george', 'bm_lewis']
    tp = lambda seq, sid, salt: seq[int(hashlib.md5((sid + salt).encode()).hexdigest(), 16) % len(seq)]
    for x in T['p2']:   # câu hỏi một giọng, 3 lời đáp giọng khác giới
        q, a = (TF, TM) if int(hashlib.md5(x['id'].encode()).hexdigest(), 16) % 2 else (TM, TF)
        add(x['lines'][0][1], tp(q, x['id'], 'q'))
        for _, t in x['lines'][1:]: add(t, tp(a, x['id'], 'a'))
    for x in T['p3']:
        fv, mv = tp(TF, x['id'], 'f'), tp(TM, x['id'], 'm')
        cv = tp(TF if len(set(sp for sp, _ in x['lines'])) > 2 else TM, x['id'], 'c')   # người nói thứ ba (C): giọng khác
        for sp, t in x['lines']: add(t, fv if sp == 'A' else mv if sp == 'B' else cv)
    for x in T['p4']:
        v = tp(TF + TM, x['id'], 'v')
        for s in sents(x['text']): add(s, v)
    for tpc in T['voc']:
        for w, vi, ex in tpc['w']: add(w, 'af_heart'); add(ex, 'af_heart')
OUT = os.path.join(ROOT, 'n'); os.makedirs(OUT, exist_ok=True)
todo = [(k, t, v) for k, (t, v) in jobs.items() if not os.path.exists(os.path.join(OUT, k + '.mp3'))]
print(len(jobs), 'câu,', len(todo), 'cần dựng', flush=True)

K = None
def work(batch):
    global K
    if K is None:
        from kokoro_onnx import Kokoro
        K = Kokoro(os.path.join(KM, 'kokoro-v1.0.onnx'), os.path.join(KM, 'voices-v1.0.bin'))
    import soundfile as sf
    for k, t, v in batch:
        s, sr = K.create(t, voice=v, speed=1.0, lang='en-gb' if v.startswith('b') else 'en-us')
        with tempfile.NamedTemporaryFile(suffix='.wav', delete=False) as f: sf.write(f.name, s, sr); w = f.name
        subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-i', w, '-ac', '1', '-ar', '24000', '-b:a', '32k', os.path.join(OUT, k + '.mp3')], check=True); os.unlink(w)
    return len(batch)
if todo:
    B = [todo[i:i + 25] for i in range(0, len(todo), 25)]; done = 0
    with ProcessPoolExecutor(NP) as ex:
        for n in ex.map(work, B): done += n; print(done, '/', len(todo), flush=True)
for f in os.listdir(OUT):   # bỏ tệp của câu đã sửa / đã xoá
    if f.endswith('.mp3') and f[:-4] not in jobs: os.unlink(os.path.join(OUT, f))
json.dump(sorted(jobs), open(os.path.join(OUT, 'index.json'), 'w'))
print('xong', len(jobs))
