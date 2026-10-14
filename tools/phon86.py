# Intel 进程：用 Homebrew 的 espeak-ng 把句子转成 Kokoro 需要的 IPA（与 kokoro_onnx.Tokenizer.phonemize 参数一致）
import sys, json
from phonemizer.backend.espeak.wrapper import EspeakWrapper
EspeakWrapper.set_library('/usr/local/lib/libespeak-ng.dylib')
from phonemizer.backend import EspeakBackend
items = json.load(sys.stdin)
out = []
backends = {}
for text, lang in items:
    b = backends.get(lang) or backends.setdefault(lang, EspeakBackend(lang, preserve_punctuation=True, with_stress=True))
    out.append(b.phonemize([text.strip()])[0].strip())
json.dump(out, sys.stdout, ensure_ascii=False)
