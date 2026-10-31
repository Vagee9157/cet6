// 构建：node tools/build.js
// 把 index.html 首屏的 33 个脚本合并压缩成 dist/data.js（题库数据）和 dist/app.js（逻辑），CSS 压成 dist/style.css，
// 空闲时才加载的单词扩展数据逐个压成 dist/<名字>.js。源码仍在 assets/，改完源码要重新跑一遍再提交 dist/。
// 压缩用 esbuild（官方包 evanw/esbuild，固定版本，npx 现拉不装进仓库）。脚本按旧 index.html 的顺序拼接，行为和原来逐个加载一致。
const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');
const ROOT = path.join(__dirname, '..'), A = (f) => path.join(ROOT, 'assets', f);
const ESBUILD = 'esbuild@0.28.2';
const DATA = ["data-outline.js", "data-vocab.js", "data-practice.js", "data-listening-2.js", "data-listening-3.js", "data-reading-2.js", "data-reading-3.js", "data-reading-4.js", "data-writing-2.js", "data-writing-3.js", "data-writing-4.js", "data-vocab-2.js", "data-vocab-3.js", "data-vocab-4.js", "data-vocab-5.js", "data-pastpapers.js", "data-audio.js", "data-real.js", "data-paraphrase.js", "data-cloze-pos.js"];
const CODE = ["chart.js", "draw.js", "grade.js", "sound.js", "exam.js", "vgame.js", "recall.js", "learn.js", "drills.js", "readtools.js", "review.js", "app.js", "ipad.js"];
const EXTRAS = ["data-vocab-ex.js", "data-vocab-ex-4.js", "data-vocab-senses.js", "data-vocab-gloss.js", "data-vocab-morph.js", "data-vocab-audio.js"];

const min = (text, loader) => execFileSync('npx', ['--yes', ESBUILD, '--minify', '--target=es2019', '--legal-comments=none', '--charset=utf8', `--loader=${loader}`], { input: text, maxBuffer: 256 << 20 }).toString();
const cat = (files) => files.map((f) => fs.readFileSync(A(f), 'utf8')).join('\n;\n');
fs.mkdirSync(path.join(ROOT, 'dist'), { recursive: true });
const out = (name, text) => { fs.writeFileSync(path.join(ROOT, 'dist', name), text); console.log(name.padEnd(28), (text.length / 1024).toFixed(0).padStart(6), 'KB'); };
out('data.js', min(cat(DATA), 'js'));
out('app.js', min(cat(CODE), 'js'));
out('style.css', min(fs.readFileSync(A('style.css'), 'utf8'), 'css'));
EXTRAS.forEach((f) => out(f, min(fs.readFileSync(A(f), 'utf8'), 'js')));
