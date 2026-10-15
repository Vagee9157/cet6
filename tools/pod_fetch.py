# 用法：python3 tools/pod_fetch.py <工作目录> <清单.json>
# 清单项 {"id": "real31", "src": "hwhap"|"noaa", "page": 节目页 URL, "mp3": 可选，缺省从页面找}
# 产出：<工作目录>/<id>.mp3 + <id>.json（{title, date, page, mp3, turns: [[说话人, 段落], ...]}）
# 只收美国政府自产节目（NASA Houston We Have a Podcast / NOAA Ocean Podcast），属公有领域。
import re, html, json, subprocess, sys, os
UA = ['-A', 'Mozilla/5.0']
def get(u): return subprocess.run(['curl', '-sL', *UA, u], capture_output=True, text=True).stdout
def clean(x): return re.sub(r'\s+', ' ', html.unescape(re.sub(r'<[^>]+>', '', x)).replace('\xa0', ' ')).strip()

def hwhap(s):
    # 正文：<p><strong>说话人</strong></p> 后跟若干 <p>段落</p>
    t = re.sub(r'<script.*?</script>|<style.*?</style>', '', s, flags=re.S)
    turns, who = [], None
    for raw in re.findall(r'<p[^>]*>(.*?)</p>', t, re.S):
        m = re.fullmatch(r'\s*<strong>([^<]{2,40})</strong>\s*', raw.replace('\xa0', ' '))
        if m: who = clean(m.group(1)); continue
        p = clean(raw)
        if not p or not who or re.fullmatch(r'<.*>|\[.*\]', p): continue
        turns.append([who, p])
    return turns

def noaa(s):
    # 正文：<strong>HOST:</strong> 文本 … 或 段首 "NAME:"
    i = s.find('>Transcript<'); seg = s[i:]
    seg = re.sub(r'<script.*?</script>|<style.*?</style>', '', seg, flags=re.S)
    turns, who = [], None
    for raw in re.findall(r'<p[^>]*>(.*?)</p>', seg, re.S):
        p = clean(raw)
        m = re.match(r'^([A-Z][A-Za-z .\-’\']{1,40}):\s*(.*)$', p)
        if m and (m.group(1).isupper() or m.group(1) in ('Host',)): who, p = m.group(1).title(), m.group(2)
        if p and who: turns.append([who, p])
    return turns

if __name__ == '__main__':
    wd, lst = sys.argv[1], json.load(open(sys.argv[2]))
    os.makedirs(wd, exist_ok=True)
    for it in lst:
        s = get(it['page'])
        title = clean((re.search(r'<title>([^<]*)', s) or [None, ''])[1]).split(' - ')[0]
        date = (re.search(r'"datePublished":"(\d{4}-\d{2}-\d{2})', s) or re.search(r'datetime="(\d{4}-\d{2}-\d{2})', s) or [None, it.get('date', '')])[1]
        mp3 = it.get('mp3') or (re.search(r'"([^"]+\.mp3)"', s) or [None, ''])[1]
        if mp3.startswith('/'): mp3 = re.match(r'https?://[^/]+', it['page']).group(0) + mp3
        turns = (hwhap if it['src'] == 'hwhap' else noaa)(s)
        json.dump({'title': title, 'date': date, 'page': it['page'], 'mp3': mp3, 'turns': turns}, open(f"{wd}/{it['id']}.json", 'w'), ensure_ascii=False, indent=1)
        if not os.path.exists(f"{wd}/{it['id']}.mp3"): subprocess.run(['curl', '-sL', *UA, '-o', f"{wd}/{it['id']}.mp3", mp3])
        print(it['id'], len(turns), sum(len(p.split()) for _, p in turns), title, file=sys.stderr)
