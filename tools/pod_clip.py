# 用法：python3 tools/pod_clip.py <工作目录> 31 32 …
# 输入 <工作目录>/realN.mp3 + realN.json（pod_fetch.py 产出）+ realN.sel.json（选段与题目）
# 做法：按词数比例估出选段在整期里的大致位置 → 前后各放 3 分钟切出来 → whisper 逐词时间戳 → 跟官方逐字稿做序列对齐，
#       拿到每段话的精确起止 → 从原始音频切出成品（淡入淡出 + 响度归一）→ assets/audio/realN.m4a（AAC 96k 单声道）
# 产出 <工作目录>/realN.out.json：{dur, segs: [[起, 止, 说话人, 段落], ...], match}，供写入 data-real.js
# 依赖：python3 -m venv tools/asr && tools/asr/bin/pip install faster-whisper imageio-ffmpeg（tools/asr 不入库）
# 运行：tools/asr/bin/python tools/pod_clip.py …
import json, re, subprocess, sys, os, difflib
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
import imageio_ffmpeg
FF = imageio_ffmpeg.get_ffmpeg_exe()
_model = None
norm = lambda w: re.sub(r"[^a-z0-9]", '', w.lower().replace('’', "'"))
def run(*a): return subprocess.run(a, capture_output=True, text=True, check=True).stdout
def dur(f): return float(re.search(r'estimated duration: ([\d.]+)', run('afinfo', f)).group(1))

def asr(src, a, b, tmp):
    global _model
    run(FF, '-y', '-v', 'error', '-ss', str(a), '-to', str(b), '-i', src, '-ac', '1', '-ar', '16000', tmp + '.wav')
    if _model is None:
        from faster_whisper import WhisperModel
        _model = WhisperModel('small.en', device='cpu', compute_type='int8', cpu_threads=3)
    segs, _ = _model.transcribe(tmp + '.wav', language='en', word_timestamps=True, beam_size=1, vad_filter=False)
    return [(norm(w.word), a + w.start, a + w.end, w.word.strip()) for s in segs for w in s.words]

def align(units, words):
    ref = [(norm(w), ui) for ui, (_, p) in enumerate(units) for w in p.split()]
    ref = [r for r in ref if r[0]]
    hyp = [w for w in words if w[0]]
    sm = difflib.SequenceMatcher(None, [r[0] for r in ref], [h[0] for h in hyp], autojunk=False)
    hit = {}
    for blk in sm.get_matching_blocks():
        if blk.size < 2: continue   # 单个词的偶然命中不算
        for k in range(blk.size): hit[blk.a + k] = hyp[blk.b + k]
    return ref, hit, len(hit) / max(1, len(ref))

def main(wd, n):
    base = f'{wd}/real{n}'
    meta, sel = json.load(open(base + '.json')), json.load(open(base + '.sel.json'))
    turns = meta['turns']
    units = [(sp, p) for sp, txt in turns[sel['turn_start']:sel['turn_end'] + 1] for p in txt.split('\n') if p.strip()]
    total = sum(len(t[1].split()) for t in turns)
    before = sum(len(t[1].split()) for t in turns[:sel['turn_start']])
    inside = sum(len(p.split()) for _, p in units)
    D = dur(base + '.mp3')
    for pad in (120, 420, None):
        a = 0 if pad is None else max(0, before / total * D - pad)
        b = D if pad is None else min(D, (before + inside) / total * D + pad)
        words = asr(base + '.mp3', a, b, base + '.asr')
        ref, hit, ratio = align(units, words)
        idx = sorted(hit)
        if ratio > 0.75 and idx[0] < 8 and idx[-1] > len(ref) - 8: break
    else:
        raise SystemExit(f'real{n}: 对齐失败 ratio={ratio:.2f}')
    # 每个段落的起止：段内第一个/最后一个命中词
    span = {}
    for i in idx:
        ui = ref[i][1]; w = hit[i]
        s, e = span.get(ui, (w[1], w[2])); span[ui] = (min(s, w[1]), max(e, w[2]))
    t0 = hit[idx[0]][1] - 0.35
    t1 = hit[idx[-1]][2] + 0.8
    # 选段内出现的音乐/掌声等标记，提示人工复听
    noise = [w[3] for w in words if t0 <= w[1] <= t1 and re.search(r'\[|\(|♪', w[3])]
    segs, prev = [], 0.0
    for ui, (sp, p) in enumerate(units):
        s, e = span.get(ui, (None, None))
        s = prev if s is None else s - t0
        segs.append([round(max(0, s), 1), None, sp, p]); prev = s
    for i in range(len(segs)): segs[i][1] = segs[i + 1][0] if i + 1 < len(segs) else round(t1 - t0, 1)
    out = os.path.join(ROOT, f'assets/audio/real{n}.m4a')
    L = t1 - t0
    run(FF, '-y', '-v', 'error', '-ss', f'{t0:.2f}', '-to', f'{t1:.2f}', '-i', base + '.mp3',
        '-af', f'afade=t=in:d=0.15,afade=t=out:st={L - 0.5:.2f}:d=0.5,loudnorm=I=-16:TP=-1.5:LRA=11',
        '-ac', '1', '-ar', '44100', base + '.cut.wav')
    run('afconvert', base + '.cut.wav', out, '-f', 'm4af', '-d', 'aac', '-b', '96000', '-q', '127')
    res = {'dur': round(dur(out), 1), 'segs': segs, 'match': round(ratio, 3), 'from': round(t0, 1), 'noise': noise, 'words': inside}
    json.dump(res, open(base + '.out.json', 'w'), ensure_ascii=False, indent=1)
    print(f'real{n}: {res["dur"]}s {inside}词 {inside / res["dur"] * 60:.0f}wpm 对齐{ratio:.0%} 起点{t0:.0f}s 噪声{noise[:5]}')

if __name__ == '__main__':
    for n in sys.argv[2:]: main(sys.argv[1], n)
