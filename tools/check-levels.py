# Đối chiếu cấp từ vựng của trang với danh sách chuẩn bên ngoài (23/10/2026):
#   CEFR-J Vocabulary Profile 1.5 (A1–B2, Tono Lab, TUFS) + Octanove Vocabulary Profile C1/C2 1.0 (CC BY-SA 4.0),
#   https://github.com/openlanguageprofiles/olp-en-cefrj — tệp ở content/ref/.
# Chạy: python3 tools/check-levels.py → in bảng + ghi content/ref/doi-chieu.json
import csv, json, re, collections, os
R = os.path.join(os.path.dirname(__file__), '..')
ORD = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']
ref = {}
def add(hw, lv):
    for h in hw.split('/'):
        k = re.sub(r'\s+', ' ', h.strip().lower())
        if k and (k not in ref or ORD.index(lv) < ORD.index(ref[k])): ref[k] = lv
for f in ['cefrj-vocabulary-profile-1.5.csv', 'octanove-vocabulary-profile-c1c2-1.0.csv']:
    for r in csv.DictReader(open(os.path.join(R, 'content/ref', f), encoding='utf-8')):
        if r['CEFR'] in ORD: add(r['headword'], r['CEFR'])
def lookup(w):
    x = w.lower().strip()
    for c in [x, re.sub(r'(ies)$', 'y', x), re.sub(r'(es|s)$', '', x), x.replace('-', ' ')]:
        if c in ref: return ref[c]
    return None
ours = []
for f, key in [('a1.json', 'units'), ('a2.json', 'units')]:
    for u in json.load(open(os.path.join(R, f)))[key]:
        for w in u['words']: ours.append((w['w'], {'pre': 'A1', 'a1': 'A1', 'a2': 'A2'}[u['lv']], u['lv']))
for w in json.load(open(os.path.join(R, 'ref.json')))['words']: ours.append((w['w'], w['lv'].upper(), w['lv']))
res = collections.defaultdict(lambda: collections.Counter()); rows = []
for w, lv, raw in ours:
    r = lookup(w)
    k = 'không có' if not r else 'đúng' if r == lv else 'trang cao hơn' if ORD.index(lv) > ORD.index(r) else 'trang thấp hơn'
    res[raw][k] += 1; rows.append({'w': w, 'trang': raw, 'chuan': r, 'kq': k, 'lech': (ORD.index(lv) - ORD.index(r)) if r else None})
print('ĐÚNG CẤP (so với CEFR-J / Octanove; Pre-A1 + A1 của trang tính là A1)')
print(f"{'cấp':6}{'số từ':>7}{'đúng':>7}{'±1 cấp':>8}{'lệch ≥2':>9}{'không có':>10}")
for raw in ['pre', 'a1', 'a2', 'b1', 'b2', 'c1', 'c2']:
    rs = [x for x in rows if x['trang'] == raw]; n = len(rs)
    ok = sum(x['kq'] == 'đúng' for x in rs); one = sum(x['lech'] in (1, -1) for x in rs); two = sum(x['lech'] is not None and abs(x['lech']) >= 2 for x in rs); no = sum(x['chuan'] is None for x in rs)
    print(f"{raw:6}{n:>7}{ok:>6} {ok/n:>4.0%}{one:>5} {one/n:>3.0%}{two:>5} {two/n:>3.0%}{no:>6} {no/n:>3.0%}")
# độ phủ: từ chuẩn mỗi cấp có trong kho của trang không
have = {}
for w, lv, raw in ours:
    for c in [w.lower(), w.lower().replace('-', ' ')]: have.setdefault(c, raw)
cnt = collections.Counter(ref.values())
print('\nĐỦ TỪ (bao nhiêu từ của danh sách chuẩn có trong kho của trang, ở bất kỳ cấp nào)')
miss = {}
for lv in ORD:
    ws = [k for k, v in ref.items() if v == lv]
    hit = [k for k in ws if k in have or re.sub(r'(es|s)$', '', k) in have]
    miss[lv] = sorted(set(ws) - set(hit))
    print(f"{lv}: chuẩn {len(ws):>5} · có {len(hit):>5} ({len(hit)/len(ws):.0%}) · thiếu {len(ws)-len(hit)}")
json.dump({'rows': rows, 'miss': miss}, open(os.path.join(R, 'content/ref/doi-chieu.json'), 'w'), ensure_ascii=False)
