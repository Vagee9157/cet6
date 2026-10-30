"""用 Kokoro（Apache-2.0）给单词库每个词生成真人感朗读：单词 + 3 个例句合成一个文件，记录各段起止时间。
环境同 gen_audio.py（tools/tts、tools/tts86、kokoro-v1.0.onnx、voices-v1.0.bin）。
用法：tools/tts/bin/python tools/gen_vocab_audio.py [--force] [--part=i/n] [单词 ...]
  --was-male 只重做之前用男声（am_michael）的那一半
  --merge 不生成，只把各分份结果合并进 data-vocab-audio.js
  --part=i/n 只做第 i 份（并行跑多个进程），各份进度写 tools/.vocab-audio-i.json；不带 --part 时合并所有分份结果写 data-vocab-audio.js
产出：assets/wa/<slug>.m4a，assets/data-vocab-audio.js（VOCAB_AUDIO[单词] = [文件, [[起, 止] × 段]]）"""
import json, re, subprocess, sys, os
import numpy as np, soundfile as sf
from kokoro_onnx import Kokoro

HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(HERE)
OUT = os.path.join(ROOT, 'assets/wa'); os.makedirs(OUT, exist_ok=True)
SR = 24000
k = Kokoro(os.path.join(HERE, 'kokoro-v1.0.onnx'), os.path.join(HERE, 'voices-v1.0.bin'))
files = ['data-vocab.js', 'data-vocab-2.js', 'data-vocab-3.js', 'data-vocab-ex.js', 'data-vocab-4.js', 'data-vocab-5.js', 'data-vocab-ex-4.js']
js = "const fs=require('fs');eval(%s.map(f=>fs.readFileSync('%s/assets/'+f,'utf8')).join('\\n')+';console.log(JSON.stringify({V:VOCAB,E:VOCAB_EX}))')" % (json.dumps(files), ROOT)
D = json.loads(subprocess.check_output(['node', '-e', js]))
VOICES = ['af_heart']   # 统一用 Kokoro 最自然的美音女声（托福式美音）
GAP = 0.7                              # 段间静音，播放时停表有余量

def spoken(w):   # 词条 → 朗读文本
    w = re.sub(r'\bsb\b', 'somebody', w); w = re.sub(r'\bsth\b', 'something', w)
    return ', '.join(p.strip() for p in w.split('/') if p.strip())
def slug(w): return re.sub(r'[^a-z0-9]+', '-', w.lower()).strip('-')

man_path = os.path.join(ROOT, 'assets/data-vocab-audio.js')
man = {}
if os.path.exists(man_path):
    s = open(man_path).read(); man = json.loads(s[s.index('{'):s.rindex('}') + 1])
for f in os.listdir(HERE):
    if f.startswith('.vocab-audio-'): man.update(json.load(open(os.path.join(HERE, f))))
part = next((a[7:] for a in sys.argv if a.startswith('--part=')), None)
force = '--force' in sys.argv; only = set(a for a in sys.argv[1:] if not a.startswith('--'))
words, seen = [], set()
for g in D['V']:
    for w in g['words']:
        if w[0] in seen: continue
        seen.add(w[0]); words.append(w[0])
todo = [] if '--merge' in sys.argv else [w for w in words if (not only or w in only) and (force or w not in man or not os.path.exists(os.path.join(OUT, man[w][0].split('/')[-1])))]
if '--was-male' in sys.argv: todo = [w for i, w in enumerate(words) if i % 2 == 1]   # 之前按词交替时用男声的那一半
if part: pi, pn = map(int, part.split('/')); todo = [w for i, w in enumerate(todo) if i % pn == pi - 1]
mine = {}
print('待生成', len(todo), '/', len(words), flush=True)

def phonemize(texts):
    out = subprocess.run(['arch', '-x86_64', os.path.join(HERE, 'tts86/bin/python'), os.path.join(HERE, 'phon86.py')], input=json.dumps([[t, 'en-us'] for t in texts]), capture_output=True, text=True, check=True).stdout
    return [''.join(c for c in ph if c in k.tokenizer.vocab).strip() for ph in json.loads(out)]

B = 100
for bi in range(0, len(todo), B):
    batch = todo[bi:bi + B]
    texts = []
    for w in batch: texts += [spoken(w) + '.'] + [en for en, _ in D['E'].get(w, [])]
    ph = dict(zip(texts, phonemize(texts)))
    for w in batch:
        v = VOICES[words.index(w) % len(VOICES)]
        parts = [(spoken(w) + '.', 0.82)] + [(en, 0.95) for en, _ in D['E'].get(w, [])]
        chunks, segs, t = [np.zeros(int(SR * 0.15), dtype=np.float32)], [], 0.15
        for text, sp in parts:
            a, sr = k.create(ph[text], voice=v, speed=sp, is_phonemes=True); a = a.astype(np.float32)
            segs.append([round(t, 2), round(t + len(a) / SR, 2)]); chunks.append(a); t += len(a) / SR
            chunks.append(np.zeros(int(SR * GAP), dtype=np.float32)); t += GAP
        audio = np.concatenate(chunks); audio = audio / max(1e-6, np.abs(audio).max()) * 0.9
        name = slug(w) + '.m4a'; wav = os.path.join(OUT, slug(w) + '.wav')
        sf.write(wav, audio, SR)
        subprocess.check_call(['afconvert', '-f', 'm4af', '-d', 'aach', '-b', '24000', wav, os.path.join(OUT, name)]); os.remove(wav)
        man[w] = mine[w] = ['assets/wa/' + name, segs]
    if part: json.dump(mine, open(os.path.join(HERE, f'.vocab-audio-{pi}.json'), 'w')); print(f'{min(bi + B, len(todo))}/{len(todo)}', flush=True); continue
    open(man_path, 'w').write('/* 由 tools/gen_vocab_audio.py 生成（Kokoro 神经网络语音）：单词 + 例句朗读，每词一个文件，[文件, [[起, 止] × (单词 + 例句)]] */\nconst VOCAB_AUDIO = ' + json.dumps(man, ensure_ascii=False, separators=(',', ':')) + ';\n')
    print(f'{min(bi + B, len(todo))}/{len(todo)}', flush=True)
if not part:
    man = {w: man[w] for w in words if w in man}
    open(man_path, 'w').write('/* 由 tools/gen_vocab_audio.py 生成（Kokoro 神经网络语音）：单词 + 例句朗读，每词一个文件，[文件, [[起, 止] × (单词 + 例句)]] */\nconst VOCAB_AUDIO = ' + json.dumps(man, ensure_ascii=False, separators=(',', ':')) + ';\n')
print('done', len(man))
