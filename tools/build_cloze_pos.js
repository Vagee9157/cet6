// 选词填空词库词性：node tools/build_cloze_pos.js → assets/data-cloze-pos.js（CLOZE_POS = {setId: {字母: 'n.' / 'v.' / 'adj.' / 'adv.'}}）
// 可重复运行，结果只取决于题库 + 单词库 + 下面的 MANUAL：
//   1. 是答案的词：解析里「填 X 词」优先，否则取「→」之前最后一个词性关键词（去掉「修饰名词 / 修饰动词」这类说被修饰词的）（副词 / 形容词 / 名词 / 动词原形 / 过去分词 / 现在分词 / 谓语 / 过去时 …）
//   2. 干扰项（或解析没写词性）：先按词形后缀（-ly / -tion / -ous / -ize / -ed / -ing / 复数 -s …），再查单词库 VOCAB 的词性（含去掉 -ed / -s 的原形）
//   3. MANUAL 里人工抽查改过的以它为准（'rc1:N' → 'n.'）
// 跑完会打印每个词的来源（exp / rule / vocab / manual / default），default 的要人工看一眼。
const fs = require('fs'), vm = require('vm'), path = require('path');
const root = path.join(__dirname, '..');
const ctx = vm.createContext({ window: {}, VOCAB_EX: {} });   // data-vocab-4 往 VOCAB_EX 里追加例句，这里用不到
['data-vocab', 'data-vocab-2', 'data-vocab-3', 'data-vocab-4', 'data-practice', 'data-reading-2', 'data-reading-3', 'data-reading-4']
  .forEach((f) => vm.runInContext(fs.readFileSync(path.join(root, 'assets', f + '.js'), 'utf8'), ctx));
const { READING, VOCAB } = vm.runInContext('({READING, VOCAB})', ctx);

const MANUAL = {
  // 干扰项：单词库里没有、词形规则判不出或判错的（2026-10 人工抽查）
  'rc1:A': 'v.', 'rc1:E': 'adj.', 'rc3:G': 'adj.', 'rc5:A': 'v.', 'rc7:N': 'v.', 'rc8:D': 'n.', 'rc10:K': 'n.',
};

const VPOS = {};
VOCAB.forEach((g) => g.words.forEach(([w, p]) => { const k = w.toLowerCase(); if (!/^[a-z-]+$/.test(k) || VPOS[k]) return; const m = String(p).match(/\b(n|v|adj|adv)\./); if (m) VPOS[k] = m[1] + '.'; }));

const KW = [['副词', 'adv.'], ['形容词', 'adj.'], ['名词', 'n.'], ['动词原形', 'v.'], ['过去分词', 'v.'], ['现在分词', 'v.'], ['及物动词', 'v.'], ['动词', 'v.'], ['谓语', 'v.'], ['过去时', 'v.'], ['过去式', 'v.'], ['表语', 'adj.']];
const KWRE = new RegExp(KW.map((x) => x[0]).join('|'), 'g');
function fromExp(e) {
  const head = String(e || '').split('→')[0];
  // 「系动词 / 情态动词 / 不及物动词」后面描述的是空格前后的环境，不算本空词性
  // 「修饰名词 / 修饰动词 X」说的是被修饰的词；「填副词」直接点明本空
  const f = head.match(/填[^，,；;：:]{0,6}?(副词|形容词|名词|动词原形|过去分词|现在分词|动词)/);
  if (f) return KW.find((x) => x[0] === f[1])[1];
  const s = head.replace(/系动词|情态动词|助动词/g, '').replace(/修饰(名词|动词|形容词|副词|现在分词|过去分词)/g, '');
  let last = null, m; KWRE.lastIndex = 0;
  while ((m = KWRE.exec(s))) last = m[0];
  return last ? KW.find((x) => x[0] === last)[1] : null;
}
const ADJ_LY = new Set(['likely', 'friendly', 'costly', 'elderly', 'lonely', 'lively', 'orderly', 'timely', 'ugly', 'unlikely', 'deadly', 'early', 'daily', 'weekly', 'monthly', 'yearly']);
const N_AL = new Set(['approval', 'arrival', 'proposal', 'rival', 'festival', 'signal', 'survival', 'removal', 'disposal', 'renewal', 'manual', 'principal', 'potential', 'capital', 'material', 'individual', 'animal', 'hospital', 'journal', 'interval', 'ritual']);
const ADJ_ATE = new Set(['deliberate', 'moderate', 'accurate', 'adequate', 'appropriate', 'separate', 'private', 'delicate', 'fortunate', 'immediate', 'intimate', 'ultimate', 'desperate', 'elaborate', 'considerate', 'approximate', 'legitimate', 'passionate', 'compassionate', 'affectionate', 'temperate', 'literate', 'innate', 'ornate', 'obstinate', 'subordinate']);
function fromRule(w) {
  if (/(wise|ward|wards|ways)$/.test(w) || ['meanwhile', 'otherwise', 'seldom', 'nevertheless', 'moreover', 'furthermore', 'hence', 'thus', 'virtually'].includes(w)) return 'adv.';
  if (/ly$/.test(w)) return ADJ_LY.has(w) ? 'adj.' : /(ply)$/.test(w) && ['apply', 'reply', 'supply', 'imply', 'comply', 'multiply'].includes(w) ? 'v.' : 'adv.';
  if (N_AL.has(w)) return 'n.';
  if (ADJ_ATE.has(w)) return 'adj.';
  if (/(tion|sion|ment|ness|ity|ance|ence|ship|ism|ure|acy|dom|hood|ics|tude)s?$/.test(w)) return 'n.';
  if (/(ous|ive|able|ible|ful|less|ical|ic|ial|al|ent|ant|ary|ory|ile|ish|esque)$/.test(w)) return 'adj.';
  if (/(ize|ise|ify|ate)$/.test(w)) return 'v.';
  if (/(ed|ing)$/.test(w) && w.length > 5) return 'v.';
  return null;
}
function fromVocab(w) {
  if (VPOS[w]) return VPOS[w];
  const c = [];
  if (/ies$/.test(w)) c.push(w.slice(0, -3) + 'y'); if (/es$/.test(w)) c.push(w.slice(0, -2)); if (/s$/.test(w)) c.push(w.slice(0, -1));
  for (const x of c) if (VPOS[x] === 'n.') return 'n.';   // 复数名词
  return null;
}
const out = {}, report = [];
READING.cloze.forEach((s) => {
  const m = {};
  s.bank.forEach((b) => {
    const L = b[0], w = b.replace(/^[A-Z]\)\s*/, '').trim().toLowerCase();
    const ai = s.answers.indexOf(L);
    let pos = null, src = '';
    if (MANUAL[s.id + ':' + L]) { pos = MANUAL[s.id + ':' + L]; src = 'manual'; }
    if (!pos && ai >= 0) { pos = fromExp(s.exp[ai]); src = 'exp'; }
    if (!pos) { const v = VPOS[w]; const r = fromRule(w); pos = v && !/(ed|ing|s)$/.test(w) ? v : r || fromVocab(w); src = v && pos === v ? 'vocab' : r && pos === r ? 'rule' : pos ? 'vocab' : ''; }
    if (!pos) { pos = 'n.'; src = 'default'; }
    m[L] = pos; report.push([s.id, L, w, pos, src, ai >= 0 ? '答案' : '']);
  });
  out[s.id] = m;
});
const body = `/* 选词填空词库词性（tools/build_cloze_pos.js 生成，勿手改；人工更正写进脚本里的 MANUAL 再重跑）
 * CLOZE_POS = {setId: {字母: 'n.' / 'v.' / 'adj.' / 'adv.'}}；答案词取自解析，干扰项按词形规则 + 单词库推断 */
const CLOZE_POS = ${JSON.stringify(out)};
`;
fs.writeFileSync(path.join(root, 'assets', 'data-cloze-pos.js'), body);
report.forEach((r) => console.log(r.join('\t')));
const cnt = {}; report.forEach((r) => { cnt[r[4]] = (cnt[r[4]] || 0) + 1; });
console.log(`\n${READING.cloze.length} 篇 · ${report.length} 个词 · 来源 ${JSON.stringify(cnt)} → assets/data-cloze-pos.js`);
