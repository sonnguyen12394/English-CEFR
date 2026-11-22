# Dựng bản mẫu nhiều bài: bài 1–2 nằm trong trang, bài 3+ là tệp riêng mau2/bai/baiN.js tải khi chọn; mau2/bai/index.js = danh sách bài.
# Chạy: python3 build.py  (đọc bai/base.html → ghi mau2/thuoc-doan.html, chép baiN.js đã OK sang mau2/bai/)
import os, re, json, subprocess, shutil
D = '/tmp/claude-0/-home-user-English-CEFR/48c67d5c-dc08-58ba-be65-4b058158838d/scratchpad'
B = D + '/bai'; OUT = D + '/mau2'; os.makedirs(OUT + '/bai', exist_ok=True)
s = open(B + '/base.html').read()
def R(a, b):
    global s; assert a in s, a[:70]; s = s.replace(a, b, 1)
# danh sách bài đã qua máy kiểm
idx = []
for n in range(1, 400):
    if n <= 2:
        continue
    f = f'{B}/bai{n}.js'
    if not os.path.exists(f): continue
    r = subprocess.run(['node', B + '/check.mjs', f], capture_output=True, text=True)
    if r.returncode: print('BỎ bài', n, r.stdout.strip().splitlines()[:3]); continue
    meta = json.loads(subprocess.run(['node', '-e', f"const fs=require('fs'),vm=require('vm');const c={{WHO:{{}}}};vm.createContext(c);vm.runInContext(fs.readFileSync('{f}','utf8')+';this.B=BAI{n}',c);console.log(JSON.stringify(c.B.meta))"], capture_output=True, text=True).stdout)
    shutil.copy(f, f'{OUT}/bai/bai{n}.js'); idx.append({ 'n': n, 'de': meta['de'], 'dang': meta['dang'], 't': meta['t'] })
open(OUT + '/bai/index.js', 'w').write('// Danh sách bài học thuộc (dựng bởi build.py)\nconst BAI_IDX = ' + json.dumps(idx, ensure_ascii=False) + ';\n')
R('<div class="app" id="app"></div>', '<div class="app" id="app"></div>\n<script src="bai/index.js"></script>')
R("const BAIS = [BAI1, BAI2], STS = {};", """const BAIS = [BAI1, BAI2], STS = {};
const BAI_ALL = [{ n: 1, de: BAI1.meta.de, dang: BAI1.meta.dang, t: BAI1.meta.t }, { n: 2, de: BAI2.meta.de, dang: BAI2.meta.dang, t: BAI2.meta.t }, ...(typeof BAI_IDX !== 'undefined' ? BAI_IDX : [])];
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
const baiBar = () => { const G = {}; BAI_ALL.forEach(x => (G[baiDe(x)] = G[baiDe(x)] || []).push(x)); const cur = BAI_ALL.find(x => x.n === BAI_I + 1) || BAI_ALL[0];
  return `<details class="card baipick"><summary><span><span class="tag">Bài ${BAI_I + 1} / ${BAI_ALL.length} · ${cur.dang}</span><br><b>Đổi bài ›</b></span></summary>
  ${Object.entries(G).sort((a, b) => parseInt(a[0].slice(3)) - parseInt(b[0].slice(3))).map(([d, xs]) => `<details class="baide"${xs.some(x => x.n === BAI_I + 1) ? ' open' : ''}><summary class="link">${d} · ${xs.length} bài</summary><div class="baibar">${xs.map(x => `<button class="lay${x.n === BAI_I + 1 ? ' on' : ''}" data-bai="${x.n - 1}" aria-pressed="${x.n === BAI_I + 1}"><b>Bài ${x.n}</b> · ${x.dang}<br><span class="sm">${esc(x.t)}</span></button>`).join('')}</div></details>`).join('')}</details>`; };""" + s[j:]
R("app.querySelectorAll('[data-bai]').forEach(x => x.onclick = () => { useBai(+x.dataset.bai); hub(); });", "app.querySelectorAll('[data-bai]').forEach(x => x.onclick = () => { const n = +x.dataset.bai; baiLoad(n + 1, () => { useBai(n); hub(); }); });")
R(".baipick summary {", ".baide > summary { min-height: 44px; display: flex; align-items: center; font-weight: 600 } .baipick summary {")
open(OUT + '/thuoc-doan.html', 'w').write(s); print('bài ngoài:', len(idx), '· trang', len(s))
