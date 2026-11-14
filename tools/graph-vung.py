#!/usr/bin/env python3
"""Gom bản đồ mã (graphify-out/) theo KHU VỰC của app, chạy sau `graphify update .`.

Vì sao: app là các tệp script dùng hàm toàn cục, graphify không thấy tệp này gọi
hàm của tệp kia (1.540 cạnh gọi hàm, chỉ 2 cạnh giữa hai tệp), nên mỗi tệp thành
một nhóm riêng (~77 nhóm). Script này:
  1. thêm cạnh `calls` giữa các tệp (tên hàm định nghĩa ở đúng một tệp, gọi ở tệp
     khác; nơi gọi = hàm bắt đầu gần nhất phía trên dòng gọi), độ tin INFERRED 0.8;
  2. xếp nhóm theo khu vực cố định `VUNG` (tệp → khu vực), không theo Leiden,
     để tên nhóm ổn định và có nghĩa; nút không có tệp theo khu vực của hàng xóm;
  3. ghi lại graph.json, graph.html và mục "Khu vực" ở đầu GRAPH_REPORT.md.
Tệp mới chưa có trong `VUNG` vào "Khác" và được in ra để thêm tay.

Chạy: graphify update . && python3 tools/graph-vung.py
"""
import collections
import json
import re
import sys
from pathlib import Path

import networkx as nx
from graphify.export import to_json
from graphify.exporters.html import to_html

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / 'graphify-out'

# Khu vực: (tên, [tiền tố / tên tệp]). Thứ tự = thứ tự kiểm, khớp đầu tiên thắng.
VUNG = [
    ('Khung app: khởi động, tài khoản, dữ liệu, góp ý',
     ['app.js', 'index.html', 'dieuhuong.js', 'backup.js', 'gop.js', 'gopy.js', 'tachpdf.js',
      'huongdan.js', 'phon-worker.js']),
    ('Nền: 7 kỹ năng, bài học, thi lên cấp',
     ['kit.js', 'kparts.js', 'parts.js', 'pa.js', 'noi.js', 'nhanh.js',
      'tonghop.js', 'exam.js', 'vuotcap.js']),
    ('Lộ trình, Hôm nay, kiểm tra trình độ',
     ['lotrinh.js', 'homnay.js', 'chandoan.js']),
    ('Bản đồ chỗ yếu (Nền, Cambridge, IELTS, TOEIC) + sổ lỗi',
     ['bando.js', 'cbmap.js', 'iemap.js', 'tomap.js', 'focus.js', 'soloi.js']),
    ('IELTS', ['ielts.js', 'ieplus.js', 'iethat.js']),
    ('TOEIC', ['toeic.js', 'toqt.js', 'totron.js', 'trochoi.js', 'tgdo.js']),
    ('Cambridge: đề thử, dạng đề, nghe / nói',
     ['mock.js', 'mocknoi.js', 'uoe.js', 'dangthi.js', 'nghe2.js', 'cap.js']),
    ('Luyện thi chung: bài học kỳ thi, chấm Viết / Nói',
     ['baihoc.js', 'thi.js', 'deai.js', 'hoclai.js']),
    ('Tra cứu: từ điển, thư viện đọc', ['tracuu.js', 'tudien.js', 'lib.js']),
    ('Máy chủ AI chấm bài (Supabase)', ['supabase/']),
    ('Test và phát hành', ['tools/test/', 'tools/release.mjs']),
    ('Công cụ dựng dữ liệu (tools/)', ['tools/']),
    ('Tài liệu và luật dự án', ['README.md', 'CLAUDE.md', 'docs/', '.claude/', '.specify/', 'specs/']),   # v139: Spec Kit + đặc tả từng tính năng
]
KHAC = 'Khác (chưa xếp khu vực)'


def vung_of(f):
    for i, (_, pre) in enumerate(VUNG):
        for p in pre:
            if f == p or (p.endswith('/') and f.startswith(p)):
                return i
    return None


def line_of(n):
    m = re.match(r'L(\d+)', str(n.get('source_location') or ''))
    return int(m.group(1)) if m else 0


def main():
    gp = OUT / 'graph.json'
    if not gp.exists():
        sys.exit('Chưa có graphify-out/graph.json: chạy `graphify update .` trước.')
    g = json.loads(gp.read_text(encoding='utf-8'))
    nodes = {n['id']: n for n in g['nodes']}

    # 1. Cạnh gọi hàm giữa các tệp
    defs = collections.defaultdict(set)      # tên hàm → {id nút}
    by_file = collections.defaultdict(list)  # tệp → [(dòng, id)] hàm của tệp
    file_node = {}
    for n in g['nodes']:
        f = n.get('source_file') or ''
        if n.get('label') == Path(f).name:
            file_node[f] = n['id']
        if n.get('_callable') and f.endswith(('.js', '.mjs', '.ts')):
            name = n['label'].rstrip('()').lstrip('.')
            if re.fullmatch(r'[A-Za-z_$][\w$]*', name):
                defs[name].add(n['id'])
                by_file[f].append((line_of(n), n['id']))
    uniq = {k: next(iter(v)) for k, v in defs.items() if len(v) == 1 and len(k) > 2}
    have = {(l['source'], l['target']) for l in g['links']}
    call_re = re.compile(r'(?<![\w$.])([A-Za-z_$][\w$]*)\s*\(')
    added = 0
    for f in sorted({n.get('source_file') for n in g['nodes']}):
        if not f or not f.endswith(('.js', '.mjs')) or not (ROOT / f).exists():
            continue
        fns = sorted(by_file.get(f, []))
        for i, line in enumerate((ROOT / f).read_text(encoding='utf-8', errors='ignore').splitlines(), 1):
            for name in call_re.findall(line):
                tgt = uniq.get(name)
                if not tgt or nodes[tgt].get('source_file') == f:
                    continue
                src = None
                for ln, nid in fns:
                    if ln > i:
                        break
                    src = nid
                src = src or file_node.get(f)
                if not src or (src, tgt) in have:
                    continue
                have.add((src, tgt))
                g['links'].append({
                    'source': src, 'target': tgt, '_src': src, '_tgt': tgt,
                    'relation': 'calls',
                    '_origin': 'graph-vung', 'confidence': 'INFERRED',
                    'confidence_score': 0.8, 'source_file': f,
                    'source_location': f'L{i}', 'weight': 1.0})
                added += 1

    # 2. Nhóm theo khu vực
    for l in g['links']:  # graph vô hướng: giữ hướng gọi khi ghi lại (#563)
        l.setdefault('_src', l['source'])
        l.setdefault('_tgt', l['target'])
    G = nx.node_link_graph(g, edges='links')
    comm = {}
    for nid, n in nodes.items():
        v = vung_of(n.get('source_file') or '')
        if v is not None:
            comm[nid] = v
    U = G.to_undirected()
    for _ in range(3):  # nút không có tệp (thư viện ngoài…): theo đa số hàng xóm
        for nid in nodes:
            if nid in comm:
                continue
            votes = collections.Counter(comm[m] for m in U.neighbors(nid) if m in comm)
            if votes:
                comm[nid] = votes.most_common(1)[0][0]
    khac = len(VUNG)
    lost = sorted({nodes[n].get('source_file') or n for n in nodes if n not in comm})
    communities = collections.defaultdict(list)
    for nid in nodes:
        communities[comm.get(nid, khac)].append(nid)
    labels = {i: VUNG[i][0] if i < khac else KHAC for i in communities}

    if not to_json(G, dict(communities), str(gp), force=True, community_labels=labels):
        sys.exit('Không ghi được graph.json')
    to_html(G, dict(communities), str(OUT / 'graph.html'), community_labels=labels)

    # 3. Mục khu vực ở đầu báo cáo
    cross = collections.Counter()
    for a, b in U.edges():
        ca, cb = comm.get(a, khac), comm.get(b, khac)
        if ca != cb:
            cross[tuple(sorted((ca, cb)))] += 1
    lines = ['## Khu vực (tools/graph-vung.py)',
             f'- {len(communities)} khu vực · thêm {added} cạnh gọi hàm giữa các tệp.',
             '- Nhóm theo khu vực cố định của app, KHÔNG theo thuật toán; các mục '
             '"Communities" phía dưới là bản cũ của graphify.', '']
    for i in sorted(communities):
        files = sorted({nodes[n].get('source_file') for n in communities[i]} - {''})
        lines.append(f'- **{labels[i]}** ({len(communities[i])} nút): ' + ', '.join(files))
    lines += ['', 'Nối nhiều nhất giữa các khu vực:']
    for (a, b), c in cross.most_common(8):
        lines.append(f'- {labels[a]} ↔ {labels[b]}: {c} cạnh')
    rp = OUT / 'GRAPH_REPORT.md'
    old = rp.read_text(encoding='utf-8') if rp.exists() else ''
    old = re.sub(r'## Khu vực \(tools/graph-vung\.py\).*?(?=\n## )', '', old, flags=re.S)
    head, sep, rest = old.partition('\n## ')
    rp.write_text(head + '\n' + '\n'.join(lines) + '\n' + (sep + rest if sep else ''), encoding='utf-8')

    print(f'Bản đồ mã: {len(communities)} khu vực, thêm {added} cạnh giữa các tệp.')
    if lost:
        print('Chưa xếp khu vực (thêm vào VUNG):', ', '.join(lost[:20]))


if __name__ == '__main__':
    main()
