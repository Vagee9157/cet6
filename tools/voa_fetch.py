# 用法：python3 tools/voa_fetch.py /z/1579 /z/955 …（栏目 id）→ 当前目录生成 voa_articles.json（标题/日期/MP3/逐字稿）。
# 加入真人听力的步骤：挑篇目 → 下载 MP3 → afconvert 转 48k AAC 到 assets/audio/realN.m4a → 追加到 assets/data-real.js 的 REAL（questions 先空）→ 出题后填 questions。
# 抓 VOA Learning English（公有领域）文章：标题、日期、MP3、正文逐字稿
import re, html, json, subprocess, sys
UA = ['-A', 'Mozilla/5.0']
def get(u): return subprocess.run(['curl', '-sL', *UA, u], capture_output=True, text=True).stdout
def article(u):
    s = get(u)
    title = html.unescape(re.search(r'<title>([^<]*)', s).group(1)).split(' - ')[0].strip()
    date = (re.search(r'datetime="(\d{4}-\d{2}-\d{2})', s) or [None, ''])[1]
    mp3 = sorted(set(re.findall(r'https://voa-audio\.voanews\.eu/[^"&?]*_hq\.mp3', s)))
    i = s.find('id="article-content"'); seg = s[i:]
    j = min([k for k in [seg.find('Words in This Story'), seg.find('class="wsw__h2"'), seg.find('Related</')] if k > 0] or [len(seg)])
    seg = re.sub(r'<script.*?</script>|<style.*?</style>', '', seg[:j], flags=re.S)
    ps = re.findall(r'<p[^>]*>(.*?)</p>', seg, re.S)
    ps = [html.unescape(re.sub(r'<[^>]+>', '', p)).strip() for p in ps]
    ps = [re.sub(r'\s+', ' ', p) for p in ps if p and 'media source' not in p and 'copied to your clipboard' not in p]
    # 去掉结尾署名和"Words in this story"之后的内容
    out = []
    for p in ps:
        if re.match(r"^(I'm|I’m) [A-Z]", p) or re.search(r'(wrote|reported) (this story|this report)|for Learning English|for VOA Learning English|^_+$', p): break
        out.append(p)
    return {'url': u, 'title': title, 'date': date, 'mp3': mp3[0] if mp3 else '', 'paras': out, 'words': sum(len(p.split()) for p in out)}
if __name__ == '__main__':
    lists = sys.argv[1:] or ['/z/1579', '/z/955', '/z/986']
    seen, res = set(), []
    for z in lists:
        s = get('https://learningenglish.voanews.com' + z)
        for h in re.findall(r'href="(/a/[^"]+\.html)"', s):
            if h in seen: continue
            seen.add(h)
            try: a = article('https://learningenglish.voanews.com' + h)
            except Exception as e: continue
            if a['mp3'] and 380 <= a['words'] <= 750: res.append(a); print(a['words'], a['date'], a['title'], file=sys.stderr)
    json.dump(res, open('voa_articles.json', 'w'), ensure_ascii=False, indent=1)
    print(len(res), file=sys.stderr)
