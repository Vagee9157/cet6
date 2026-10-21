// 同义替换库：从题库解析里抽「X 同义替换 Y」「X 对应 Y」「X 即 Y」「X 指 Y」「Y 改写为 X」之类的英文短语对，
// 生成 assets/data-paraphrase.js（PARA = [{a: 题干 / 选项短语, b: 原文短语, src: 题目 id, exp: 原解析}]）。
// 可重复运行：node tools/build_paraphrase.js（结果只取决于题库，顺序按题库顺序，已去重）。
const fs = require('fs'), vm = require('vm'), path = require('path');
const root = path.join(__dirname, '..');
const files = ['data-practice.js', 'data-listening-2.js', 'data-listening-3.js', 'data-reading-2.js', 'data-reading-3.js', 'data-reading-4.js', 'data-real.js'].map((f) => path.join(root, 'assets', f));
const src = files.map((f) => fs.readFileSync(f, 'utf8')).join('\n') + '\n;({LISTENING,READING,REAL})';
const R = vm.runInContext(src, vm.createContext({ window: {}, console }));

// 解析来源：仔细阅读 / 段落匹配 / 六级题型听力 / 真人听力
const exps = [];
R.READING.mc.forEach((s) => s.questions.forEach((q) => exps.push([s.id, q.exp])));
R.READING.match.forEach((s) => s.items.forEach((it) => exps.push([s.id, it.exp || ''])));
R.LISTENING.forEach((s) => s.questions.forEach((q) => exps.push([s.id, q.exp])));
R.REAL.forEach((s) => (s.questions || []).forEach((q) => exps.push([s.id, q.exp])));

// 关键词两边要有空格（避免「立即 / 随即」里的「即」）；fwd = 左边是题干、右边是原文；rev = 左边是原文（「改写为 / 替换为」）
const KW = /\s(同义替换|对应|即|指|替换为|改写为|替换)\s/;
const REV = new Set(['替换为', '改写为']);
const EN = "[A-Za-z0-9][A-Za-z0-9 ,'’\\-\\/%.]*";
const tailEn = new RegExp('(' + EN + ')$'), headEn = new RegExp('^(' + EN + ')');
const FUNC = new Set('a an the of to in on at by for with from and or as it is are was be its their his her this that these those not no'.split(' '));
const clean = (t) => t.replace(/^[\s,.'’-]+|[\s,'’-]+$/g, '').replace(/\.$/, '').replace(/\s+/g, ' ').trim();
const ok = (t) => {
  if (!t || t.length < 3 || t.length > 70) return false;
  const ws = t.split(' '); if (ws.length > 9) return false;
  if (/^[A-D]$/.test(t)) return false;                                   // 选项字母
  if (!ws.some((w) => /[a-z]{3,}/i.test(w) && !FUNC.has(w.toLowerCase()))) return false;  // 全是虚词 / 数字
  return true;
};

const out = [], seen = new Set();
for (const [id, exp] of exps) {
  // 按中文标点和引号切成小句，每句最多找一个关键词
  for (const cl of String(exp).split(/[，。；：！？、（）“”"《》]/)) {
    const m = cl.match(KW); if (!m) continue;
    const L = cl.slice(0, m.index), Rt = cl.slice(m.index + m[0].length);
    const lm = L.match(tailEn), rm = Rt.match(headEn); if (!lm || !rm) continue;
    let left = clean(lm[1]), right = clean(rm[1]);
    if (!ok(left) || !ok(right)) continue;
    const [a, b] = REV.has(m[1]) ? [right, left] : [left, right];
    if (a.toLowerCase() === b.toLowerCase()) continue;
    const k = a.toLowerCase() + '|' + b.toLowerCase(); if (seen.has(k)) continue; seen.add(k);
    out.push({ a, b, src: id, exp: String(exp) });
  }
}

const head = `/* 同义替换库（由 tools/build_paraphrase.js 从题库解析自动抽取，勿手改；改了题库重跑：node tools/build_paraphrase.js）
 * PARA[i] = {a: 题干 / 选项短语, b: 原文短语, src: 题目 id, exp: 原解析}，共 ${out.length} 条 */\n`;
fs.writeFileSync(path.join(root, 'assets', 'data-paraphrase.js'), head + 'const PARA = [\n' + out.map((x) => '  ' + JSON.stringify(x)).join(',\n') + '\n];\n');
const bySrc = {}; out.forEach((x) => { bySrc[x.src] = (bySrc[x.src] || 0) + 1; });
console.log(`同义替换 ${out.length} 条，来自 ${Object.keys(bySrc).length} 篇（解析 ${exps.length} 条）`);
