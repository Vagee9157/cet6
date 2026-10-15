# 用法：python3 tools/pod_merge.py <工作目录> 31 32 …
# 把 pod_clip.py 的成品（realN.out.json）+ 选段题目（realN.sel.json）+ 节目信息（realN.json）追加/覆盖进 assets/data-real.js 的 REAL
import json, sys, os, re
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
F = os.path.join(ROOT, 'assets/data-real.js')
SHOW = {'nasa.gov': ('NASA', 'NASA · Houston We Have a Podcast'), 'noaa.gov': ('NOAA', 'NOAA Ocean Podcast')}
src = open(F).read()
head, body = src[:src.index('[')], src[src.index('['):src.rindex(']') + 1]
REAL = json.loads(body)
byid = {r['id']: r for r in REAL}
wd = sys.argv[1]
for n in sys.argv[2:]:
    meta, sel, out = (json.load(open(f'{wd}/real{n}{x}.json')) for x in ('', '.sel', '.out'))
    org, show = next(v for k, v in SHOW.items() if k in meta['page'])
    segs = out['segs']
    item = {
        'id': f'real{n}', 'title': sel['title'], 'episode': meta['title'], 'org': org, 'show': show, 'type': sel['type'],
        'date': meta['date'], 'src': f'assets/audio/real{n}.m4a', 'dur': out['dur'], 'url': meta['page'], 'words': out['words'],
        'script': '\n'.join(f'{sg[2]}: {sg[3]}' if i == 0 or segs[i - 1][2] != sg[2] else sg[3] for i, sg in enumerate(segs)),
        'segs': segs, 'questions': sel['questions'],
    }
    if item['id'] in byid: REAL[REAL.index(byid[item['id']])] = item
    else: REAL.append(item)
    print(item['id'], item['dur'], item['words'], item['title'])
REAL.sort(key=lambda r: int(re.sub(r'\D', '', r['id'])))
head = ('/* 真人听力（公有领域，美国政府作品）。\n'
        ' * 慢速：VOA Learning English 录音与逐字稿（无 org 字段，real1–30）。\n'
        ' * 常速：NASA「Houston We Have a Podcast」/ NOAA「Ocean Podcast」节目片段（org 字段），按官方逐字稿截取，segs 为逐段时间（秒，已与录音对齐）。\n'
        ' * questions 为本站按六级题型自编。 */\nconst REAL = ')
open(F, 'w').write(head + json.dumps(REAL, ensure_ascii=False, indent=1) + ';\n')
