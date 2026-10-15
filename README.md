# 疯狂CET6

大学英语六级（CET-6）备考页面，目标 500（留足过 425 的余量）。纯前端，手机电脑都能用，离线可看。

**在线地址** → https://vagee9157.github.io/cet6/

## 有什么

| 板块 | 内容 |
|---|---|
| 首页 | 710 分拆解条（点一段看策略）、今天的四件事、各模块考点与解题套路（听力 / 阅读 / 写作 / 翻译 / 词汇 / 考试结构） |
| 单词 | 590 个高频词按 20 个主题分组（主题网格，点开切换），翻转闪卡 + 朗读，背面每词 3 个例句带中文翻译、可逐句朗读；认识 / 模糊 / 不认识三档，不认识的进生词本 |
| 听读 | **常速真人听力**（NASA「Houston We Have a Podcast」/ NOAA「Ocean Podcast」访谈片段，3.5–5 分钟、每分钟约 150–180 词，与真题语速相当；按六级长对话 / 讲座题型配题，原文逐段时间与录音对齐）；**慢速真人听力 30 篇**（VOA Learning English，默认 1.2 倍速）；六级题型听力 28 篇（长对话 8 / 篇章 8 / 讲座 12），全部配神经网络语音录音（Kokoro，对话男女分角色），可选"只听原文"或"考试节奏"（真题格式播报题目 + 每题 12 秒作答），交卷后原文逐句高亮、点句重听、阅读（仔细阅读 / 段落匹配 / 选词填空，点选作答，计时；标「真实原文」的取自 NIH、NASA、NOAA 等美国政府机构文章，公有领域，只删节不改写）；宽屏左文右题 |
| 写译 | 写作 14 篇（议论 / 名言 / 图表 / 应用文）提纲 + 范文（加分句高亮）；翻译 18 段（文化 / 经济社会 / 历史 / 地理 / 科技 / 教育）关键词 + 参考译文 |
| 我的 | 生词本、错题本、进度；**我的真题库**：把自己的真题 PDF / 扫描图导入浏览器本地（IndexedDB，不上传不入库）随时翻看 |
| 真题索引 | 首页"近十年真题回顾"：2016–2025 每套的作文题、翻译主题、阅读听力话题 + 题型/主题分布统计（只收元信息，不收原文） |
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
assets/paper.css         模拟卷版式
tools_validate.js        题库自检：node tools_validate.js
assets/app.js           主站逻辑
assets/paper.js         组卷逻辑
assets/style.css        样式（浅色 / 深色）
```

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
