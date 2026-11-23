# Dựng bản mẫu nhiều bài: bài 1–2 nằm trong trang, bài 3+ là tệp riêng mau2/bai/baiN.js tải khi chọn; mau2/bai/index.js = danh sách bài.
# Chạy ở gốc repo: python3 tools/hocthuoc/build.py <thư mục ra>  (đọc tools/hocthuoc/base.html + content/hocthuoc/baiN.js → <ra>/thuoc-doan.html + <ra>/bai/)
# Rồi: python3 tools/hocthuoc/build-web.py <thư mục ra>  → hoc-thuoc/ (trang con của app). Bài 1–2 nằm sẵn trong base.html.
import os, re, json, subprocess, shutil, sys
T = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(os.path.dirname(T))
B = os.path.join(ROOT, 'content/hocthuoc'); OUT = os.path.abspath(sys.argv[1]); os.makedirs(OUT + '/bai', exist_ok=True)
s = open(T + '/base.html').read()
def R(a, b):
    global s; assert a in s, a[:70]; s = s.replace(a, b, 1)
# danh sách bài đã qua máy kiểm
idx = []
CHU = json.load(open(T + '/chu.json'))
HOAN = set(json.load(open(T + '/hoan.json'))['bai'])
for n in list(range(1, 400)) + list(range(1001, 1200)):  # 1001+: bài 💬 Giao tiếp (đặc tả 022)
    if n <= 2:
        continue
    f = f'{B}/bai{n}.js'
    if not os.path.exists(f): continue
    if n in HOAN: print('HOÃN bài', n); continue
    r = subprocess.run(['node', T + '/check.mjs', f], capture_output=True, text=True)
    if r.returncode: print('BỎ bài', n, r.stdout.strip().splitlines()[:3]); continue
    meta = json.loads(subprocess.run(['node', '-e', f"const fs=require('fs'),vm=require('vm');const c={{WHO:{{}}}};vm.createContext(c);vm.runInContext(fs.readFileSync('{f}','utf8')+';this.B=BAI{n}',c);console.log(JSON.stringify(c.B.meta))"], capture_output=True, text=True).stdout)
    extra = subprocess.run(['node', T + '/meta.mjs', B, str(n)], capture_output=True, text=True, cwd=ROOT).stdout.strip() or '{}'
    open(f'{OUT}/bai/bai{n}.js', 'w').write(open(f).read() + f'\nObject.assign(BAI{n}.meta, {extra});\n'); ex = json.loads(extra); idx.append({ 'n': n, 'de': meta['de'], 'dang': meta['dang'], 't': meta['t'], 'muc': ex.get('muc', 'toeic'), 'chu': ex.get('chu', '') })
open(OUT + '/bai/index.js', 'w').write('// Danh sách bài học thuộc (dựng bởi build.py)\nconst BAI_IDX = ' + json.dumps(idx, ensure_ascii=False) + ';\n')
R('<div class="app" id="app"></div>', '<div class="app" id="app"></div>\n<script src="bai/index.js"></script>\n<script src="bai/nham.js"></script>')
subprocess.run(['node', T + '/nham.mjs', B, OUT + '/bai/nham.js'], cwd=ROOT)
R("const BAIS = [BAI1, BAI2], STS = {};", """const BAIS = [BAI1, BAI2], STS = {};
const BAI_ALL = [{ n: 1, de: BAI1.meta.de, dang: BAI1.meta.dang, t: BAI1.meta.t, muc: 'toeic', chu: '""" + CHU['1'] + """' }, { n: 2, de: BAI2.meta.de, dang: BAI2.meta.dang, t: BAI2.meta.t, muc: 'toeic', chu: '""" + CHU['2'] + """' }, ...(typeof BAI_IDX !== 'undefined' ? BAI_IDX : [])];
// tải bài khi chọn: <script src="bai/baiN.js"> rồi lấy hằng BAIN (hằng toàn cục của script cổ điển, không nằm trên window)
function baiLoad(n, done) { if (BAIS[n - 1]) return done();
  const sc = document.createElement('script'); sc.src = `bai/bai${n}.js`; sc.onload = () => { try { BAIS[n - 1] = Function('return BAI' + n)(); done(); } catch (e) { alert('Chưa tải được bài ' + n); } };
  sc.onerror = () => alert('Chưa tải được bài ' + n + '. Kiểm tra mạng rồi thử lại.'); document.head.appendChild(sc); }""")
R("function useBai(n) {", """const WHOS = [{ A: ['Khách', 'Nữ'], B: ['Lễ tân', 'Nam'] }, { N: ['Phát thanh viên', 'PTV'] }, { W: ['E-mail', '✉️'] }, { A: ['Nhân viên', 'Nữ'], B: ['Khách', 'Nam'] }, { N: ['Loa siêu thị', '📢'] }, { W: ['E-mail', '✉️'] },
  { A: ['Quản lý', 'Nữ'], B: ['Liam', 'Nam'], C: ['Nora', 'Nữ'] }, { N: ['Người chủ trì', '📢'] }, { W: ['Memo', '✉️'] }, { A: ['Tổng đài', 'Nữ'], B: ['Khách', 'Nam'] }, { N: ['Thợ sửa xe', '📢'] }, { W: ['Memo', '✉️'] }];
function useBai(n) { for (const k of Object.keys(WHO)) delete WHO[k]; Object.assign(WHO, (BAIS[n].meta && BAIS[n].meta.who) || WHOS[n] || {});""")
R(".who.N { background: var(--acc); font-size: 11px }", ".who.N, .who.W { background: var(--acc); font-size: 11px } .who.C { background: var(--b); filter: hue-rotate(60deg) }")
R(".baibar { display: grid; grid-template-columns: 1fr 1fr;", ".baipick summary { min-height: 44px; display: flex; align-items: center; cursor: pointer; color: var(--acc) } .baipick summary .tag { color: var(--mute) }\n.baibar { display: grid; grid-template-columns: 1fr;")
R("Bài và giọng đọc lấy từ đề của app (Đề 3, Đề 5);", "Bài và giọng đọc lấy từ đề của app (văn bản Part 6–7 đọc bằng giọng máy);")
i = s.index("const baiBar = () =>"); j = s.index("\n", i)
s = s[:i] + """const baiDe = x => (x.de.match(/^Đề \\d+/) || ['Khác'])[0];
// v211 (đặc tả 022): chọn bài 3 tầng: mục tiêu → chủ đề → dạng; bảng mục tiêu / chủ đề MUC, CHU nằm trong base.html
let PICK = null;   // { m: mục tiêu, c: chủ đề, k: dạng | 'all' } đang xem trong ô Đổi bài
const baiTag = x => mucOf(x) === 'gt' ? '' : (x.de.match(/^Đề \\d+ · Part \\d/) || [''])[0];
const baiBar = () => { const cur = BAI_ALL.find(x => x.n === BAI_I + 1) || BAI_ALL[0], P = PICK || { m: mucOf(cur), c: cur.chu, k: kindOf(cur.dang) };
  const inM = BAI_ALL.filter(x => mucOf(x) === P.m), cs = MUC_CHU[P.m], c = cs.includes(P.c) && inM.some(x => x.chu === P.c) ? P.c : (cs.find(k => inM.some(x => x.chu === k)) || cs[0]);
  const inC = inM.filter(x => x.chu === c), ks = KINDS.filter(k => inC.some(x => kindOf(x.dang) === k[0])), k = P.k !== 'all' && ks.some(x => x[0] === P.k) ? P.k : 'all';
  const xs = inC.filter(x => k === 'all' || kindOf(x.dang) === k).sort((a, b) => a.n - b.n), on = (a, b) => `${a === b ? ' on' : ''}" aria-pressed="${a === b}`;
  return `<details class="card baipick"${PICK ? ' open' : ''}><summary><span><span class="tag">Bài ${BAI_I + 1} · ${CHU[cur.chu] ? CHU[cur.chu].slice(0, 2).join(' ') + ' · ' : ''}${cur.dang}</span><br><b>Đổi bài ›</b></span></summary>
  <div class="mucbar" role="group" aria-label="Mục tiêu">${MUC.map(m => `<button class="lay${on(m[0], P.m)}" data-pm="${m[0]}">${m[1]} ${m[2]}<br><span class="sm">${BAI_ALL.filter(x => mucOf(x) === m[0]).length} bài</span></button>`).join('')}</div>
  <p class="tag" style="margin:10px 0 4px">Chủ đề</p><div class="chubar" role="group" aria-label="Chủ đề">${cs.map(ch => { const n = inM.filter(x => x.chu === ch).length;
    return `<button class="lay${on(ch, c)}" data-pc="${ch}"${n ? '' : ' disabled'}>${CHU[ch][0]} ${CHU[ch][2] || CHU[ch][1]}<span class="sm"> · ${n}</span></button>`; }).join('')}</div>${cs.some(ch => !inM.some(x => x.chu === ch)) ? '<p class="sm mute" style="margin:4px 0 0">Viền đứt: chủ đề sắp có bài.</p>' : ''}
  ${inC.length ? `<p class="tag" style="margin:10px 0 4px">Dạng bài</p><div class="dangbar" role="group" aria-label="Dạng bài"><button class="lay${on('all', k)}" data-pk="all">Tất cả · ${inC.length}</button>${ks.map(x => `<button class="lay${on(x[0], k)}" data-pk="${x[0]}">${x[1]} ${x[2]} · ${inC.filter(y => kindOf(y.dang) === x[0]).length}</button>`).join('')}</div>
  <div class="baibar" style="margin-top:10px">${xs.map(x => `<button class="lay${x.n === BAI_I + 1 ? ' on' : ''}" data-bai="${x.n - 1}" aria-pressed="${x.n === BAI_I + 1}"><b>Bài ${x.n}</b>${k === 'all' ? ' · ' + KINDS.find(y => y[0] === kindOf(x.dang)).slice(1, 3).join(' ') : ''}<span class="sm mute">${baiTag(x) ? ' · ' + baiTag(x) : ''}</span><br><span class="sm">${esc(x.t)}</span></button>`).join('')}</div>` : '<p class="sm mute">Chủ đề này sắp có bài.</p>'}</details>`; };""" + s[j:]
R("app.querySelectorAll('[data-bai]').forEach(x => x.onclick = () => { useBai(+x.dataset.bai); hub(); });", "app.querySelectorAll('[data-bai]').forEach(x => x.onclick = () => { const n = +x.dataset.bai; PICK = null; baiLoad(n + 1, () => { useBai(n); hub(); }); }); const pk = () => PICK || (() => { const c = BAI_ALL.find(x => x.n === BAI_I + 1) || BAI_ALL[0]; return { m: mucOf(c), c: c.chu, k: kindOf(c.dang) }; })(); app.querySelectorAll('[data-pm]').forEach(x => x.onclick = () => { PICK = { m: x.dataset.pm, c: '', k: 'all' }; hub(); }); app.querySelectorAll('[data-pc]').forEach(x => x.onclick = () => { PICK = Object.assign(pk(), { c: x.dataset.pc }); hub(); }); app.querySelectorAll('[data-pk]').forEach(x => x.onclick = () => { PICK = Object.assign(pk(), { k: x.dataset.pk }); hub(); });")
R(".baipick summary {", ".baide > summary { min-height: 44px; display: flex; align-items: center; font-weight: 600 } .baipick summary {")
open(OUT + '/thuoc-doan.html', 'w').write(s); print('bài ngoài:', len(idx), '· trang', len(s))
