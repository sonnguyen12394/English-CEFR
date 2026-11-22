# Dựng trang con của app hoc-thuoc/ từ bản mẫu đã dựng (mau2/thuoc-doan.html + mau2/bai/), v209.
# Khác bản mẫu: có <head> đầy đủ, tiếng lấy ở ../n/, bỏ màn "🧪 Tất cả màn", tiến độ đọc / ghi qua parent.htGet / htPut (S.ht của app, đồng bộ vocab_state).
# Chạy: python3 tools/hocthuoc/build-web.py <thư mục mau2>  (ở gốc repo)
import os, sys, shutil, re
SRC = sys.argv[1]; OUT = 'hoc-thuoc'; os.makedirs(OUT + '/bai', exist_ok=True)
s = open(SRC + '/thuoc-doan.html').read()
def R(a, b, n=1):
    global s; assert s.count(a) >= 1, a[:70]; s = s.replace(a, b, n)
R("AUD = new Audio('n/' +", "AUD = new Audio('../n/' +")
R('<button class="sec" id="gal">🧪 Xem tất cả màn bài tập</button>', '')
R("$('#gal').onclick = gallery;", "")
R("Bản mẫu bấm được, chưa nối với app. ", "")
R("location.hash === '#tat-ca' ? gallery() : hub();", r"""// ---------- lưu tiến độ (v209): S.ht của app qua parent.htGet / htPut; mở riêng thì localStorage ----------
const HT_KEEP = ['done', 'sc', 'mu', 'day', 'lay', 'w'];
let HT = null; try { HT = (window.parent !== window && window.parent.htGet && window.parent.htGet()) || null; } catch (e) {}
if (!HT) try { HT = JSON.parse(localStorage.getItem('htLocal') || 'null'); } catch (e) {}
HT = HT && typeof HT === 'object' ? HT : { sts: {}, best: {}, cur: 0 }; HT.sts = HT.sts || {}; HT.best = HT.best || {};
const htFresh = () => ({ ipa: true, lv: 0, i: 0, w: [], day: 0, done: {}, sc: {}, cur: null, hit: [0, 0], lay: { ipa: 1 }, mu: {} });
for (const k of Object.keys(HT.sts)) STS[k] = Object.assign(htFresh(), HT.sts[k]);
if (HT.sts[0]) st = STS[0];
function htSave() { STS[BAI_I] = st; HT.cur = BAI_I; HT.sts = {};
  for (const [k, v] of Object.entries(STS)) HT.sts[k] = Object.fromEntries(HT_KEEP.map(f => [f, v[f]]));
  try { if (window.parent !== window && window.parent.htPut) window.parent.htPut(JSON.parse(JSON.stringify(HT))); else localStorage.setItem('htLocal', JSON.stringify(HT)); } catch (e) {} }
const _fin = fin; fin = (k, sc) => { _fin(k, sc); htSave(); };
const _useBai = useBai; useBai = n => { _useBai(n); htSave(); };
dgBestGet = () => +HT.best['dg' + BAI_I] || 0; dgBestSet = v => { HT.best['dg' + BAI_I] = v; htSave(); };
dvBestGet = () => +HT.best['dv' + BAI_I] || 0; dvBestSet = v => { HT.best['dv' + BAI_I] = v; htSave(); };
if (HT.cur) baiLoad(HT.cur + 1, () => { _useBai(HT.cur); hub(); }); else hub();""")
# hàm khai báo bằng const / function: cho phép gán lại
for f in ['dgBestGet', 'dgBestSet', 'dvBestGet', 'dvBestSet']:
    s = s.replace(f'const {f} = ', f'let {f} = ', 1)
# fin, useBai là khai báo function: gán lại được, không cần đổi
head = '''<!doctype html><html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><title>Học thuộc bài đề TOEIC</title>
<style>body{margin:0}</style></head><body>
'''
open(OUT + '/index.html', 'w').write(head + s + '\n</body></html>\n')
for f in os.listdir(SRC + '/bai'):
    shutil.copy(f'{SRC}/bai/{f}', f'{OUT}/bai/{f}')
print('hoc-thuoc/index.html', len(s), '· bài', len([f for f in os.listdir(OUT + '/bai') if f.startswith('bai')]))
