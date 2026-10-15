# 用法：tools/asr/bin/python tools/pod_resync.py <工作目录> 31 32 …
# 复核成品：把 assets/audio/realN.m4a 整段重新转写，与选段原文逐段对齐，重建 segs：
#   - 段落里一个词都对不上、且 ≥ 8 词 → 视为录音里没有（官方逐字稿常比播出版多几句），从原文删掉，并检查题目解析是否引用了它
#   - 短的附和（Yeah / OK）对不上 → 按字数插值时间
# 结果覆盖 realN.out.json（保留 from / match），打印删掉的段落和受影响的题目
import json, re, sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from pod_clip import asr, align, dur, ROOT, norm

def main(wd, n):
    base = f'{wd}/real{n}'
    meta, sel, out = (json.load(open(f'{base}{x}.json')) for x in ('', '.sel', '.out'))
    units = [(sp, p) for sp, txt in meta['turns'][sel['turn_start']:sel['turn_end'] + 1] for p in txt.split('\n') if p.strip()]
    clip = os.path.join(ROOT, f'assets/audio/real{n}.m4a')
    D = dur(clip)
    words = asr(clip, 0, D, base + '.chk')
    ref, hit, ratio = align(units, words)
    span, cnt = {}, {}
    for i in sorted(hit):
        ui = ref[i][1]; w = hit[i]
        s, e = span.get(ui, (w[1], w[2])); span[ui] = (min(s, w[1]), max(e, w[2])); cnt[ui] = cnt.get(ui, 0) + 1
    keep, dropped = [], []
    for ui, (sp, p) in enumerate(units):
        nw = len(p.split())
        if ui not in span and nw >= 8: dropped.append(p); continue
        keep.append([span[ui][0] if ui in span else None, sp, p])
    # 未命中的短段：起点取前后已知时间按字数插值
    for i, k in enumerate(keep):
        if k[0] is None:
            prev = next((keep[j][0] for j in range(i - 1, -1, -1) if keep[j][0] is not None), 0.0)
            nxt = next((keep[j][0] for j in range(i + 1, len(keep)) if keep[j][0] is not None), D)
            k[0] = (prev + nxt) / 2
    keep.sort(key=lambda k: k[0])
    segs = [[round(max(0, k[0] - 0.15), 1), round(keep[i + 1][0] - 0.15, 1) if i + 1 < len(keep) else round(D, 1), k[1], k[2]] for i, k in enumerate(keep)]
    segs[0][0] = 0.0
    out.update({'segs': segs, 'dur': round(D, 1), 'words': sum(len(s[3].split()) for s in segs), 'match2': round(ratio, 3), 'dropped': dropped})
    json.dump(out, open(base + '.out.json', 'w'), ensure_ascii=False, indent=1)
    hurt = []
    for qi, q in enumerate(sel['questions']):
        quotes = re.findall(r'"([^"]{12,})"', q['exp'])
        for qt in quotes:
            if any(norm(qt[:40]) and qt[:40] in d for d in dropped): hurt.append(qi + 1)
    first = ' '.join(w[3] for w in words[:8]); last = ' '.join(w[3] for w in words[-8:])
    print(f'real{n}: 对齐{ratio:.0%} 删段{len(dropped)}（{sum(len(d.split()) for d in dropped)}词） 受影响题{sorted(set(hurt))} | 开头「{first}」 结尾「{last}」', flush=True)

if __name__ == '__main__':
    for n in sys.argv[2:]: main(sys.argv[1], n)
