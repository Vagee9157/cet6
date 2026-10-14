"""用 Kokoro（Apache-2.0）为六级听力离线生成音频 + 逐句时间轴。
准备（模型和虚拟环境不入库，见 .gitignore）：
  python3 -m venv tools/tts && tools/tts/bin/pip install kokoro-onnx soundfile
  arch -x86_64 python3 -m venv tools/tts86 && arch -x86_64 tools/tts86/bin/pip install phonemizer   # 配 brew install espeak-ng
  下载 kokoro-v1.0.onnx、voices-v1.0.bin 到 tools/（github.com/thewh1teagle/kokoro-onnx releases）
用法：tts/bin/python gen_audio.py [id ...]   不带参数则全部生成（已存在的跳过，加 --force 重做）"""
import json, re, subprocess, sys, os
import numpy as np, soundfile as sf
from kokoro_onnx import Kokoro

ROOT = os.path.expanduser('~/Documents/GitHub/cet6')
OUT = os.path.join(ROOT, 'assets/audio'); os.makedirs(OUT, exist_ok=True)
SR = 24000
HERE = os.path.dirname(os.path.abspath(__file__))
k = Kokoro(os.path.join(HERE, 'kokoro-v1.0.onnx'), os.path.join(HERE, 'voices-v1.0.bin'))

# 从站点数据里取听力（用 node 读 JS 数据）
js = "const fs=require('fs');const s=['data-practice.js','data-listening-2.js','data-listening-3.js'].map(f=>fs.readFileSync('%s/assets/'+f,'utf8')).join('\\n')+';console.log(JSON.stringify(LISTENING))';eval(s)" % ROOT
L = json.loads(subprocess.check_output(['node', '-e', js]))

FEMALE = ['af_heart', 'af_bella', 'af_nicole']
MALE = ['am_michael', 'am_fenrir', 'am_puck']
NARR = 'bm_george'   # 指令和题目由英式男声播报，和真题一致
SPEED = 0.95

def silence(sec): return np.zeros(int(SR * sec), dtype=np.float32)
# 音标由 Intel 进程里的 Homebrew espeak-ng 转换（arm 版 espeakng-loader 的数据路径打包有问题）
PH = {}
def phonemize_all(pairs):
    todo = [p for p in dict.fromkeys(pairs) if p not in PH]
    if not todo: return
    out = subprocess.run(['arch', '-x86_64', os.path.join(HERE, 'tts86/bin/python'), os.path.join(HERE, 'phon86.py')], input=json.dumps(todo), capture_output=True, text=True, check=True).stdout
    for p, ph in zip(todo, json.loads(out)): PH[p] = ''.join(c for c in ph if c in k.tokenizer.vocab).strip()
lang_of = lambda v: 'en-us' if v[0] == 'a' else 'en-gb'
def say(text, voice):
    key = (text, lang_of(voice)); phonemize_all([key])
    a, sr = k.create(PH[key], voice=voice, speed=SPEED, is_phonemes=True); assert sr == SR
    return a.astype(np.float32)
def sentences(t):
    t = re.sub(r'\s+', ' ', t).strip()
    return [s for s in re.split(r'(?<=[.!?])\s+(?=[A-Z"\'])', t) if s]

force = '--force' in sys.argv
only = [a for a in sys.argv[1:] if not a.startswith('--')]
manifest_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), '.audio-manifest.json')
if os.path.exists(manifest_path): manifest = json.load(open(manifest_path))
else:
    src = open(os.path.join(ROOT, 'assets/data-audio.js')).read() if os.path.exists(os.path.join(ROOT, 'assets/data-audio.js')) else ''
    manifest = json.loads(src[src.index('{'):src.rindex('}') + 1]) if '{' in src else {}

for i, s in enumerate(L):
    sid = s['id']
    if only and sid not in only: continue
    if sid in manifest and not force and os.path.exists(os.path.join(OUT, sid + '.m4a')): continue
    pairs = []
    if s['type'] == 'conv':
        fv0, mv0 = FEMALE[i % len(FEMALE)], MALE[i % len(MALE)]
        for line in s['script'].split('\n'):
            m = re.match(r'\s*([MW]):\s*(.+)', line)
            if m: pairs += [(x, lang_of(mv0 if m.group(1) == 'M' else fv0)) for x in sentences(m.group(2))]
    else:
        v0 = (FEMALE if i % 2 else MALE)[i % 3]
        pairs += [(x, lang_of(v0)) for p in s['script'].split('\n') if p.strip() for x in sentences(p)]
    n0 = len(s['questions']); kind0 = {'conv': 'conversation', 'passage': 'passage'}.get(s['type'], 'recording')
    pairs += [(f'Questions 1 to {n0} are based on the {kind0} you have just heard.', 'en-gb')] + [(f'Question {qi + 1}. {q["q"]}', 'en-gb') for qi, q in enumerate(s['questions'])]
    phonemize_all(pairs)
    chunks, segs, t = [], [], 0.0
    def add(audio, spk, text, gap):
        global t
        chunks.append(audio); segs.append([round(t, 2), round(t + len(audio) / SR, 2), spk, text]); t += len(audio) / SR
        if gap: chunks.append(silence(gap)); t += gap
    if s['type'] == 'conv':
        fv, mv = FEMALE[i % len(FEMALE)], MALE[i % len(MALE)]
        for line in s['script'].split('\n'):
            m = re.match(r'\s*([MW]):\s*(.+)', line)
            if not m: continue
            spk, text = m.group(1), m.group(2).strip()
            v = mv if spk == 'M' else fv
            for j, sen in enumerate(sentences(text)):
                add(say(sen, v), spk, sen, 0.12)
            chunks.append(silence(0.35)); t += 0.35
    else:
        v = (FEMALE if i % 2 else MALE)[i % 3]
        paras = [p for p in s['script'].split('\n') if p.strip()]
        for p in paras:
            for sen in sentences(p):
                add(say(sen, v), '', sen, 0.22)
            chunks.append(silence(0.3)); t += 0.3
    q_start = round(t + 1.0, 2); chunks.append(silence(1.0)); t += 1.0
    n = len(s['questions']); kind = {'conv': 'conversation', 'passage': 'passage'}.get(s['type'], 'recording')
    add(say(f'Questions 1 to {n} are based on the {kind} you have just heard.', NARR), 'Q', f'Questions 1 to {n} are based on the {kind} you have just heard.', 1.2)
    for qi, q in enumerate(s['questions']):
        add(say(f'Question {qi + 1}. {q["q"]}', NARR), 'Q', f'Question {qi + 1}. {q["q"]}', 12.0)
    wav = os.path.join(OUT, sid + '.wav'); m4a = os.path.join(OUT, sid + '.m4a')
    audio = np.concatenate(chunks); audio = audio / max(1e-6, np.abs(audio).max()) * 0.92   # 归一化，避免爆音
    sf.write(wav, audio, SR)
    subprocess.check_call(['afconvert', '-f', 'm4af', '-d', 'aac', '-b', '56000', wav, m4a]); os.remove(wav)
    manifest[sid] = {'src': f'assets/audio/{sid}.m4a', 'dur': round(t, 1), 'q': q_start, 'segs': segs}
    json.dump(manifest, open(manifest_path, 'w'), ensure_ascii=False)
    print(sid, s['type'], f'{t:.0f}s', f'{os.path.getsize(m4a) / 1e6:.2f}MB', flush=True)

# 页面直接 <script> 引入的版本
open(os.path.join(ROOT, 'assets/data-audio.js'), 'w').write('/* 由 gen_audio.py 生成：每篇听力的音频与逐句时间轴 */\nconst AUDIO = ' + json.dumps(manifest, ensure_ascii=False) + ';\n')
print('done', len(manifest))
