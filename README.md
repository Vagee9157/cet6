# 疯狂CET6

大学英语六级（CET-6）备考页面，目标 500（留足过 425 的余量）。纯前端，手机电脑都能用，离线可看。

**在线地址** → https://vagee9157.github.io/cet6/

## 有什么

| 板块 | 内容 |
|---|---|
| 首页 | 预测分（离 500 差几分 · 距考试天数 · 连续学习天数）、首次诊断入口、今日计划（按考试日期分阶段 + 提分排行生成，带预计分钟）、上周周报、提分排行、710 分拆解条（点一段看策略）、各模块考点与解题套路（听力 / 阅读 / 写作 / 翻译 / 词汇 / 考试结构） |
| 单词 | 590 个高频词按 20 个主题分组（主题网格，点开切换），翻转闪卡 + 朗读，背面按词性逐行列出全部常见义项（六级常考的熟词生义单独标出），每词 3 个例句带中文翻译、可逐句朗读，**点例句里任意单词弹出释义**；背面还有**词根词缀拆分 + 记忆提示、词族派生词（形容词 / 副词 / 名词，点一下朗读）、动词变形**；单词和例句配了 Kokoro 神经网络语音录音（`tools/gen_vocab_audio.py`，每词一个文件 `assets/wa/`），没配上的退回设备朗读，「我的 · 朗读声音」可选设备声音（按自然度排序）；另有「熟词生义」一档 125 词；认识 / 模糊 / 不认识三档，不认识的进生词本；**到期复习词先做判定题**（英→中四选一，生词本默认看中文拼英文），答对按 1 / 3 / 7 / 14 / 30 / 60 天拉长间隔、答错重置，考前 3 天内的到期提前 |
| 听读 | **常速真人听力**（NASA「Houston We Have a Podcast」/ NOAA「Ocean Podcast」访谈片段，3.5–5 分钟、每分钟约 150–180 词，与真题语速相当；按六级长对话 / 讲座题型配题，原文逐段时间与录音对齐）；**慢速真人听力 30 篇**（VOA Learning English，默认 1.2 倍速）；六级题型听力 28 篇（长对话 8 / 篇章 8 / 讲座 12），全部配神经网络语音录音（Kokoro，对话男女分角色），可选"只听原文"或"考试节奏"（真题格式播报题目 + 每题 12 秒作答），交卷后原文逐句高亮、点句重听、阅读（仔细阅读 / 段落匹配 / 选词填空，点选作答，计时；标「真实原文」的取自 NIH、NASA、NOAA 等美国政府机构文章，公有领域，只删节不改写）；宽屏左文右题 |
| 写译 | 写作 14 篇（议论 / 名言 / 图表 / 应用文）提纲 + 范文（加分句高亮）；翻译 18 段（文化 / 经济社会 / 历史 / 地理 / 科技 / 教育）关键词 + 参考译文；**关键词卡**（800+ 个翻译关键词，看中文打英文，按真题主题频次分组）和**模板句卡**（450 句范文高分表达挖空补全），间隔复习；估分后显示「初稿 → 最近」趋势、标出最弱一项并给一条改写任务，改完一键再估 |
| 我的 | 生词本、错题本、进度；**我的真题库**：把自己的真题 PDF / 扫描图导入浏览器本地（IndexedDB，不上传不入库）随时翻看 |
| 真题索引 | 首页"近十年真题回顾"：2016–2025 每套的作文题、翻译主题、阅读听力话题 + 题型/主题分布统计（只收元信息，不收原文） |
| 模考 | 在线做一整套卷（和打印版同结构同题量、同卷号同一套题）：写作 30′ → 听力 30′（各段录音按顺序各放一遍，带题目播报和作答停顿，可开练习模式重听）→ 阅读 40′ → 翻译 30′，每部分倒计时、到点自动进下一部分，作答实时保存可续做；交卷后听力阅读自动判分、写译对照范文自评档次，按官方结构折成 710 分，报告逐题看解析 |
| 模拟卷 | `paper.html`：从题库随机组一份完整试卷（听力 25 题、阅读 30 题，与真题同量），按真卷版式排：封面与注意事项、试题册（Part I–IV，英文 Directions）、答题卡 1（写作 + 听力涂卡）、答题卡 2（阅读涂卡 + 翻译）、教师用答案页（答案、解析、范文、译文、听力原文）；A4 精确分页，可打印 / 存 PDF；`?seed=` 固定卷号 |

## 内容说明

- 六级真题版权归教育部教育考试院，本站**不收录历年原卷**；练习题按真题的题型、篇幅、难度和出题套路自编。
- 考试结构、分值、时间依据全国大学英语四、六级考试官网公布的考试大纲。
- 真人听力与「真实原文」阅读只用美国联邦政府机构自产的作品（公有领域），不收通讯社稿件和第三方内容；题目为本站自编。
- 六级题型听力用 Kokoro 神经网络语音录制。

## 目录

```
index.html              主站
paper.html              一键组卷（A4）
assets/data-outline.js  考点 CHAPTERS / 关键数字 NUMBERS
assets/data-vocab.js    词汇 VOCAB
assets/data-practice.js 首批题：听力 LISTENING / 阅读 READING / 写作 WRITING / 翻译 TRANSLATION
assets/data-*-2.js        扩展题库（追加到同名数组）
assets/data-pastpapers.js 近十年真题索引 PAST（元信息）
assets/data-real.js      真人听力 REAL（慢速 VOA + 常速 NASA/NOAA，含逐段时间 segs）
assets/data-vocab-ex.js  单词例句 VOCAB_EX（每词 3 句 + 中文）
assets/data-vocab-senses.js 单词多义项 VOCAB_SENSES（[词性, 释义, 熟词生义?1]）
assets/data-vocab-gloss.js  例句点词小词典 VOCAB_GLOSS（单词库以外的词形 → 简短释义）
assets/data-vocab-5.js   熟词生义 125 词
assets/data-vocab-morph.js 词形与记忆 VOCAB_MORPH（i 变形 / f 词族 / r 词根词缀 / m 记忆提示）
assets/data-vocab-audio.js 单词 + 例句录音索引 VOCAB_AUDIO（[文件, [[起, 止] × 段]]）
assets/paper.css         模拟卷版式
tools_validate.js        题库自检：node tools_validate.js
assets/app.js           主站逻辑
assets/paper.js         组卷逻辑（打印版排版）
assets/draw.js          抽题（打印版与在线模考共用，优先抽没做过的、按记录还原同一卷号）
assets/exam.js          在线模考
assets/learn.js         学习闭环 window.CET6Learn：预测分 / 今日计划 / 错因 / 错题重测 / 打卡周报
assets/recall.js        提取练习 window.CET6Recall：关键词卡 / 模板句（间隔复习）+ 写译估分趋势与改写任务
assets/review.js        今日复习 window.CET6Review：跨模块到期项合成一个连续复习流程 + 考点「记住了 → 练一题」
assets/drills.js        专项训练 window.CET6Drills：定位训练 / 同义替换 / 逐句听写 / 先读选项预判 / 倍速爬坡
assets/data-paraphrase.js 同义替换库 PARA（tools/build_paraphrase.js 生成，勿手改）
tools/build_paraphrase.js 从题库解析抽同义替换短语对：node tools/build_paraphrase.js
assets/readtools.js     做题页工具 window.CET6RT：限时模式 / 速度追踪 / 选词填空两步作答 / 原文点词
assets/data-cloze-pos.js 选词填空词库词性 CLOZE_POS（tools/build_cloze_pos.js 生成，勿手改）
tools/build_cloze_pos.js 推断选词填空词库词性：node tools/build_cloze_pos.js
assets/style.css        样式（浅色 / 深色）
```

## 学习闭环（数据）

测 → 诊断 → 排优先级 → 延迟重测，逻辑在 `assets/learn.js`（`window.CET6Learn`），状态都在 localStorage `cet6.v1` 的 `S` 里。启动时 `CET6Learn.init()` 做一次幂等迁移（旧记录补 `sub`、错题补 `due` / `streak`、补空容器），旧数据不会报错。

**题型 key（sub）**：`conv` 长对话 / `passage` 听力篇章 / `lecture` 讲座 / `slowreal` 慢速 VOA / `cloze` 选词填空 / `match` 段落匹配 / `mc` 仔细阅读；写译用 `write` / `trans`。真人常速听力按 `r.type` 归 `conv` / `lecture`；慢速 VOA 记 `slowreal`，**不计入预测**（语速约 100 词/分，明显慢于考试，会把听力预测抬高）。模考内部用 `pas` / `lec`，对外统一成上面的 key。

| 字段 | 格式 | 说明 |
|---|---|---|
| `S.hist[i].sub` / `S.sets[id].sub` | 题型 key | `recordSet(id, r, t, wrongs, rights, sec, via)` 写入；旧记录用 `subOf(id)` 补 |
| `S.hist[i].via` | `'exam'` / `'diag'` | 模考 / 诊断交卷时带上；练习交卷没有 |
| `S.wtScore[题目id]` | `[{ts, kind, score, band, via, items, manual?}]` | 写译估分。`score` 0–15，`band` 档（14/11/8/5/2/0），`kind` write/trans，`via` wt（写译页「估分」）/ exam / diag，`items` `[[分项名, 0–10]]`，`manual` 模考报告手动改的档（以它为准）；每题最多 10 条；空白作答不记 |
| `S.examDate` | `'YYYY-MM-DD'` | 考试日期；缺省 = 今天之后最近的 6 月 / 12 月第二个周六（`defaultExamDate()`） |
| `S.dailyMin` | 30 / 60 / 90 | 每天可用分钟，缺省 60 |
| `S.dayPlan` | `{key, d, tasks}` | 今日计划，`key = 日期|dailyMin|examDate`，变了就重排；`tasks[i] = {k, sub?, id?, ch?, min, must?}`，`k` ∈ retest / vocab / set / wt / outline / exam |
| `S.wrong[key]` 新增 | `sub`, `cause`, `cd`, `due`, `streak`, `last` | `cause` ∈ loc 定位错 / syn 同义替换没认出 / vocab 生词卡住 / trap 被干扰项骗 / ear 没听清 / time 时间不够（`CAUSE_BY` 按题型给子集），`cd` 标错因日期；`due` 下次重测日期，`streak` 隔天连对次数，`last` 最近一次作答日期 |
| `S.causeLog[key]` | `{c, d, sub}` | 错因日志（错题移出后仍保留，周统计用），最多 500 条 |
| `S.rt` | `[{d, ts, key, ok, sub}]` | 错题重测记录（打卡 / 周报题量用），最多 600 条 |
| `S.weekSeen` | 周一日期 | 已关闭的周报 |
| `S.exams[i].diag` / `S.exam.diag` | bool | 诊断卷；`sel` 里数字表示该题型只取前 n 篇（诊断 `{conv:1, lec:1, mc:1, match:true, trans:true}`） |
| `S.mastered[k]` | 勾选日期（旧值 1） | 「看考点」任务按当天勾了几条判完成 |
| `S.vstage[词id]` | 连续答对 / 认识次数 | 认识的词按 `VGAP=[1,3,7,14,30,60]` 取间隔（第 1 次后 3 天 … 第 5 次后 60 天，第 6 次后不再出现）；不认识 1 天、模糊 2 天。到期日经 `CET6Recall.capDue` 处理：不超过考试日期，考前 3 天内的到期提前到考前第 3 天 |
| `S.vsv` | 2 | 单词间隔版本。缺省 = 旧数据（7 / 21 天两档）：启动时把认识词的阶段 1→2、2→3、≥3→5 迁移一次 |
| `S.vqk` | `'spell'` / `'mc'` | 生词本判定题方式，缺省拼写（易混词「a / b」和超长短语仍四选一） |
| `S.cards[id]` | `{due, stage, last, wrongN, n}` | 关键词卡 `tk:<翻译id>:<keys 下标>`、模板句 `hl:<写作id>:<hl 下标>`。答对 `stage+1`，间隔按 `[1,3,7,14,30]`（stage ≥4 恒 30 天），答错 `stage=0`、`wrongN+1`、明天再来；`n` 首次学的日期（每天新卡额度：关键词 10、模板句 5）；同样经 `capDue` |
| `S.vnewAuto` | bool | 每日新词「按建议」。缺省：存档里没有 `vnew`（新用户）为 true，老用户 false；点 10 / 20 / 30 置 false |
| `S.vsug` | `{key, n, core, hi, days}` | 当天的建议新词数缓存，`key = 日期|考试日期`。`n = (未学基础+核心 + 0.5 × 未学高频) / max(1, 剩余天数 − 14)`，夹在 10–40 |
| `S.act[日期]` | `{vr, vn, cd}` | 按天计数：单词复习（之前见过的词当天第一次标记 / 判定）、新词、关键词卡 / 模板句作答；保留 60 天。打卡和周报用 |
| `S.rvLog[日期]` | `{n, left, done}` | 今日复习：当天到期总数 `n`（中途新到期的会加上）、最后一次看到还剩 `left`、`done = n − left`；首页 / 复习流程 / 页面隐藏时更新，保留 60 天。周报「复习完成率」= Σdone / Σn |
| `S.rvq` | `{d, skip, done, ok}` | 当天复习流程会话：跳过的项 key（重开时排最后）、流程里做完 / 答对的项数 |
| `S.dayPlan.tasks[i].k` 新增 `review` | `{k:'review', min, must:1}` | 今日复习，排第一（取代原来的 `retest`；旧计划里的 `retest` 照常显示）。完成 = 队列清空 |
| `S.dayPlan.tasks[i].k` 新增 `cards` | `{k:'cards', sub:'tk'/'hl', min}` | 关键词卡 / 模板句：打基础期有到期才往前排，专项期跟在写译后，冲刺期必做；完成 = 今天到期和新卡额度都做完 |

**今日复习（`assets/review.js`，`window.CET6Review`）**：`queue()` 汇总到期项——单词（`dailyPlan().review` 里今天还没刷的）、错题（`dueList()`，含同义替换错题）、关键词卡 / 模板句（`CET6Recall.dueAll()`）、听写错句（`CET6Drills.dictDue()`），按 `(过期天数 + 1) × 权重` 降序；权重：错题 = 题型单题分值（`TMAP[sub].pt`，同义替换错题按出处题型），单词 / 卡 / 听写句 = 1。`info()` → `{n, min, by, q, total, done}`（单词 0.3、卡 0.4、听写 1、错题 1.5 分钟 / 项）。`open()` 在首页里一项接一项做：单词用 `CET6.vreview`（与单词页判定题同规则）、错题用 `CET6Learn.retestOne`、卡用 `CET6Recall.mountOne`、听写用 `CET6Drills.dictReview`；做完的项不再到期，所以退出后重开就是剩下的。`outlineTry(ch, i)` / `outlineGo(a)`：考点勾「这条我记住了」后给一个相关练习入口（听力 / 阅读 → 推荐一篇对应题型或同义替换 / 听写专项，写作 → 作文或模板句卡，翻译 → 翻译或关键词卡，词汇 → 今日单词 / 选词填空；考试结构章没有对应练习，只记勾选）。

**重测规则**：交卷答错（练习 / 模考 / 诊断）→ `streak=0`、`due=明天`，保留已选错因；之后答对（重做整套或单题重测）只有与 `last` 隔 ≥1 天才 `streak+1`，间隔 `GAPS=[1,3,7]` 按 streak 取，`streak` 到 `CLEAR_AT=2` 移出错题本；重测答错重置为 1 天。同一天重做答对不计数也不删除。

**CET6Learn 接口**

- `predict({asOf}?)` → `{total, parts, types, rank, ready, hasDiag, gap500, low}`。每题型取最近 8 次（写译 5 次）按 0.8^i 衰减、按题数加权，再向 60% 收缩（客观题 4 题、写译 0.5 篇的先验）；题量 < 8 题 / 写译 < 2 篇标 `low`（数据不足）。`types[k] = {name, part, max, pts, rate, n, low, pt, room, key}`，满分按官方 710 结构（长对话 8×7.1、篇章 7×7.1、讲座 10×14.2、选词 10×3.55、匹配 10×7.1、仔细 10×14.2、写译 15 档×7.1）。`rank` 按 `pt × (1 − rate)` 降序 = 提分排行；`ready` = 做过诊断或 ≥4 个题型有数据。
- `subOf(id)`、`logWt(kind, id, gradeResult, via, ts?)`、`setWtManual(id, ts, v)`
- `applyResult(wrongs, rights)`（recordSet 调）、`retestAnswer(key, ok)`、`dueList()`、`setCause(key, c)`、`causeHTML(key, kind)`（任意页面插入即可用，点击由全局委托处理）
- `examDate()`、`dailyMin()`、`daysLeft()`、`phase()`（>60 天 base 打基础 / 21–60 focus 专项 / <21 sprint 冲刺）、`planToday()` → `{tasks(含 done/f/title), total, budget, phase, days}`
- `studyDays()`（由 hist / sets / vseen / wtScore / exams / rt / mastered / cards / drill / act / rvLog 日期推算）、`logAct(k, n?)`、`retestOne(host, key, onNext)`、`pickSet(sub)`；周报 `weekReport()` 新增 `act`（单词复习 / 新词 / 卡片）、`drill`（专项题量）、`rvRate`（复习完成率）、`streak()`、`weekReport()`、`weekStart()`
- 渲染：`planHTML()`、`rankHTML(pr)`、`weekHTML()`、`meTopHTML()`、`causeChartHTML()`、`wrongExtraHTML(w)`、`diagHTML(lv)`、`openRetest()`；首页点击 / 改值交给 `homeClick(e)` / `homeChange(e)`
- `window.CET6Recall`：`capDue(last, raw)`、`judge(input, alts)`（宽松比对）、`tkCards()` / `hlCards()` / `themes()`、`counts(kind)`、`grade(id, ok)`、`mount(el, kind)`、`planInfo()`、`trendHTML(id, opt)`、`markLow(el, gr)`、`rewriteTask(kind, item, text, gr)`；`window.CET6` 新增 `openWTItem(kind, id, text?)`（模考报告「去写译页改写这篇」，也可用 `#wt=<题目 id>` 直达）；`window.CET6Game` 新增 `distractors` / `overlap`；`window.CET6Grade` 新增 `stem` / `sentences` / `paras`
- `window.CET6Exam` 新增 `startDiag()`、`diagMinutes()`、`DIAG_SEL`；`window.CET6` 新增 `qLoc(kind, set, i)`（解析引文在原文里的段落 / 录音段）、`clozeCtx`、`goSet`、`renderHome`、`openOutline`、`openVocabDaily`、`openWT`

## 专项训练（数据）

听读页顶部「专项训练」卡，逻辑在 `assets/drills.js`（`window.CET6Drills`），在听读页内打开（`CET6.openDrill(k)`）。

- **定位训练**（`locate`）：题池 = 仔细阅读 `questions[].q` + 段落匹配 `items[].s` 里，解析引号英文能用 app.js `tokIndex` / `findQuote` 在原文找到、且命中不超过 3 句的题（运行时预处理一次）。点句子判对错，错了标出正确句并滚过去；每轮 10 题，计时，优先没做过的（`S.locSeen`）。
- **同义替换**（`para`）：题库 `assets/data-paraphrase.js` 的 `PARA = [{a: 题干 / 选项短语, b: 原文短语, src: 题目 id, exp}]`，四选一，干扰项依次取同篇其他原文短语、同篇原文里长度相近的片段、别篇短语。做错进 `S.wrong`（`kind:'para'`, `sub:'para'`, key `para:<题目 id>:<a|b 哈希>`），走 `CET6Learn` 的延迟重测（`prep` 把 `kind 'para'` 交给 `CET6Drills.rtItem` 渲染）；答对调 `applyResult([], [key])` 按隔天规则计连对。
- **逐句听写**（`dict`）：六级题型听力用 `AUDIO` 逐句时间（跳过题目播报，4–30 词的句子）；常速真人用官方逐段时间，超过 30 词的长段按句拆、起止按字数估算（页面有提示）。可重播、0.8× / 1.0×；LCS 词级对比标漏听 / 错听 / 多写；漏听的实词一键加生词本：在单词库（`ALLWORDS`，含简单变形还原）里的标「不认识」，否则存 `S.myWords`（我的 → 生词本显示，可删）。
- **先读选项预判**：练习页六级题型听力在「考试节奏」下，第一次按播放先进 30 秒读选项（可跳过），每题选预计考点（细节 / 原因 / 态度 / 建议 / 数字），交卷后按题干关键词粗分类对照（`qType`）。
- **倍速爬坡**：同一篇听力第 2 次自动 1.1×、第 3 次起 1.2×（慢速 VOA 在默认语速上 +0.1 / +0.2，最多 1.4×），播放器显示当前倍速来源；手动点语速以手动为准，`S.rampOff` 关闭。

| 字段 | 格式 | 说明 |
|---|---|---|
| `S.drill[日期]` | `{locate:{n,ok}, para:{n,ok}, dict:{n,ok,w,wok}, pre:{n,ok}}` | 每日训练量，保留 60 天。`dict` 的 `n` 句数、`ok` 正确率 ≥90% 的句数、`w` / `wok` 原文词数 / 写对词数；`pre` 预判题数 / 命中数 |
| `S.myWords` | `[{w, d, src, ctx}]` | 听写收的单词库外生词，最多 500 |
| `S.dictBad` | `[{id, k, t, acc, d, n, st?, due?}]` | 听写正确率 < 80% 的句子（`k` 句子键：录音段序号，长段拆句为 `段.句`），最多 200。进「今日复习」：`due` 缺省 = `d` + 1 天；重听重写 ≥80% 移出，仍 <80% 则 `st+1`、按 `[1,3,7]` 天拉开（7 天封顶）；听写页里同一句再写到 ≥80% 也移出，再错重置为明天 |
| `S.dictPos[题目 id]` / `S.dictLast` / `S.dictG` / `S.dictRate` | 数字 / id / `'cet'`·`'real'` / 0.8·1 | 听写进度、上次那篇、素材组、语速 |
| `S.locSeen` / `S.paraSeen` | 数组 | 做过的定位题 / 同义替换（出题时排后） |
| `S.rampOff` | bool | 关闭倍速爬坡 |

**今日计划**：专项阶段（21–60 天）`buildPlan` 会加一项 `{k:'drill', sub: locate / para / dict, min}`（`CET6Drills.planTask`：近两周头号错因 syn → 同义替换、loc → 定位、ear → 听写，否则按提分排行第一的客观题型），完成标准 = 当天该项做满 10 题 / 组 / 句。

**改了题库要重跑同义替换库**：`node tools/build_paraphrase.js`（可重复运行，结果只取决于题库；抽「X 同义替换 / 对应 / 即 / 指 / 替换 Y」「Y 替换为 / 改写为 X」两边都是英文短语的小句，过滤超长和纯虚词，去重）。

**任务预计分钟**：阅读 `set.minutes`；听力 录音时长/60 + 题数×0.3；单词 新词×0.5 + 复习×0.2；关键词卡 / 模板句 到期×0.4 + 新卡×0.6；写作 / 翻译 30；看考点 10；错题重测 每题 1.5（一次最多 10 道）；完整模考 130。

## 做题页工具（数据）

逻辑在 `assets/readtools.js`（`window.CET6RT`），app.js 在做题页 / 阅读列表 / 练习记录里调它的钩子。

- **限时模式**：阅读做题页「限时」开关（只阅读，听力不需要），倒计时取 `S.timeLim`（缺省 = 考场节奏：仔细阅读每篇 8、段落匹配 15、选词填空 5 分钟），阅读列表「限时设置」卡里 ± 1 分钟（2–30）。做到一半打开限时会从那一刻起重新倒计时；最后 60 秒变红；到 0 自动交卷，结果卡标「限时交卷」。
- **速度追踪**：「我的 · 练习记录」按题型取最近 10 次练习交卷（不含模考 / 诊断）的平均用时，对比考场时限（固定 8 / 15 / 5，不随 ± 变）和正确率；超时最多的题型给一句提示和跳转（段落匹配 / 仔细阅读 → 定位训练 `CET6.openDrill('locate')`，选词填空 → 开两步作答做一篇）；不超时但正确率 < 60% → 同义替换。
- **两步作答**（选词填空，`S.clozeStep`）：点空格 → 先选这空的词性（n. / v. / adj. / adv.，名词可选单复数、动词可选时态，可跳过）→ 词库里同词性的词亮起再选词；交卷后每空对照「词性判断 ✓/✗」（选了形式且词性对时再对形式，形式按答案词形 -s / -ed / -ing 推断），结果卡显示总数。
- **原文点词**：阅读原文、听力原文（交卷后或打开原文时）里，电脑双击、手机长按 300ms（移动 >10px 视为滚动取消，触发后吞掉随后的 click，不会点句重听），或打开「点词」模式单击，弹出气泡：单词库（含 -s / -ed / -ing / -ly 还原）里有的显示释义，「加入生词本」= 标不认识；没有的存 `S.myWords`（`ctx` = 所在句子，`src` = 题目 id），我的 → 生词本显示。

| 字段 | 格式 | 说明 |
|---|---|---|
| `S.timed` | bool | 限时开关 |
| `S.timeLim` | `{mc, match, cloze}` 分钟 | 缺省 8 / 15 / 5 |
| `S.clozeStep` | bool | 选词填空两步作答 |
| `S.tapWord` | bool | 点词模式 |
| `S.hist[i].tl` / `.to` / `.pos` | 分钟 / 1 / `{n, ok}` | 限时练的时长、时间到自动交卷、两步作答词性判断数 / 对数（旧记录没有，不影响） |
| `S.drafts[id].pos` | `{空序号: {p, f?}}` | 未交卷的词性选择（`f` ∈ sg / pl / base / s / ed / ing） |

**改了选词填空题库要重跑词性表**：`node tools/build_cloze_pos.js`（可重复运行，结果只取决于题库 + 单词库 + 脚本里的 `MANUAL`）。答案词取解析（「填 X 词」优先，否则「→」前最后一个词性关键词），干扰项按词形后缀 + 单词库推断；运行时打印每个词的来源（exp / rule / vocab / manual / default），default 和 rule 的抽查一下，改错的写进 `MANUAL` 再跑。

## 加题

往 `assets/data-practice.js` 对应数组里追加即可，格式照现有条目；改完把 `index.html`、`paper.html`、`sw.js` 里的 `?v=N` 加 1，并把 `sw.js` 的 `CACHE` 版本号加 1。

## 加常速真人听力

```
python3 -m venv tools/asr && tools/asr/bin/pip install faster-whisper imageio-ffmpeg   # 一次性，tools/asr 不入库
python3 tools/pod_fetch.py <工作目录> <清单.json>        # 下载整期音频 + 官方逐字稿（按说话人分话轮）
#   选段 + 出题 → <工作目录>/realN.sel.json（话轮范围、type、小标题、4 题）
tools/asr/bin/python tools/pod_clip.py <工作目录> N …   # whisper 对齐 → 截出 assets/audio/realN.m4a（AAC 96k）+ 逐段时间
python3 tools/pod_merge.py <工作目录> N …               # 写进 assets/data-real.js
node tools_validate.js
```

只收美国政府机构自产节目，片段避开片头片尾和配乐（配乐多为商用授权，非公有领域）。
