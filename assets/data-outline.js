/* 六级考点大纲：考试结构、各题型解题套路、高频考点
 * hot: 2 必考 / 1 常考 / 0 了解 */
const CHAPTERS = [
  {
    id: 'exam', name: '考试结构与得分策略', icon: '🎯',
    intro: '先搞清分值和时间，425 分是怎么凑出来的，比埋头做题重要。',
    points: [
      { t: '卷面结构与分值（满分 710）', hot: 2, body: `
        <table>
          <tr><th>部分</th><th>题型</th><th>题量</th><th>分值占比</th><th>时间</th></tr>
          <tr><td>写作</td><td>短文写作</td><td>1 篇</td><td>15%（106.5 分）</td><td>30 分钟</td></tr>
          <tr><td rowspan="3">听力</td><td>长对话</td><td>2 篇 8 题</td><td>8%</td><td rowspan="3">25 分钟</td></tr>
          <tr><td>听力篇章</td><td>2 篇 7 题</td><td>7%</td></tr>
          <tr><td>讲座 / 讲话</td><td>3 篇 10 题</td><td>20%</td></tr>
          <tr><td rowspan="3">阅读</td><td>选词填空</td><td>1 篇 10 题</td><td>5%</td><td rowspan="3">40 分钟</td></tr>
          <tr><td>长篇阅读（段落匹配）</td><td>1 篇 10 题</td><td>10%</td></tr>
          <tr><td>仔细阅读</td><td>2 篇 10 题</td><td>20%</td></tr>
          <tr><td>翻译</td><td>汉译英段落</td><td>1 段</td><td>15%（106.5 分）</td><td>30 分钟</td></tr>
        </table>
        <p>听力、阅读各 <b>248.5 分</b>，写作、翻译各 <b>106.5 分</b>。总时长 <b>130 分钟</b>，<b>先考写作</b>，再听力，然后阅读和翻译一起发卷（70 分钟自己分配）。</p>`, tip: '听 35% 读 35% 写 15% 译 15%；写作先考、听力 25 分钟、读译共 70 分钟。' },
      { t: '425 分怎么凑', hot: 2, body: `
        <p>六级没有"及格线"，<b>425 分</b>是报考口译和多数单位的认可线。按各部分满分折算，一个稳妥的组合：</p>
        <table>
          <tr><th>部分</th><th>满分</th><th>目标</th><th>折算</th></tr>
          <tr><td>听力</td><td>248.5</td><td>做对 18/25</td><td>≈ 165</td></tr>
          <tr><td>阅读</td><td>248.5</td><td>做对 21/30（仔细阅读 8、匹配 7、选词 6）</td><td>≈ 170</td></tr>
          <tr><td>写作</td><td>106.5</td><td>11–12 分档（满分 15）</td><td>≈ 75</td></tr>
          <tr><td>翻译</td><td>106.5</td><td>10–11 分档</td><td>≈ 70</td></tr>
          <tr><td colspan="3"><b>合计</b></td><td><b>≈ 480</b></td></tr>
        </table>
        <ul>
          <li><b>仔细阅读</b>每题 2%，是单题分值最高的客观题，10 题要拿 8 个；<b>讲座</b>10 题占 20%，是听力的大头。</li>
          <li><b>选词填空</b>每题只有 0.5%，难且分少，<b>最后做，别超 8 分钟</b>。</li>
          <li>写作和翻译是"保底分"：模板 + 不犯语法错 = 稳拿 60% 以上。</li>
        </ul>`, tip: '仔细阅读 8/10 + 讲座 7/10 + 写译各拿六成 = 425 稳过。' },
      { t: '分数换算与报告', hot: 0, body: `
        <ul>
          <li>报道分采用<b>常模参照</b>：原始分经加权、等值后转换到 220–710 区间，所以"做对几题 = 多少分"只能估算。</li>
          <li>总分 <b>220 分以上</b>即发成绩报告单；<b>425 分及以上</b>可报考口语考试（CET-SET6）。</li>
          <li>各单项也有分数：听力、阅读满分 248.5，写作、翻译满分 106.5。</li>
        </ul>`, tip: '220 以上有成绩单，425 以上可报口语。' },
      { t: '考场时间分配', hot: 2, body: `
        <ul>
          <li><b>写作 30 分钟</b>：审题 3 分钟、列提纲 2 分钟、写 20 分钟、检查 5 分钟。写作期间<b>不能翻看后面的试题</b>。</li>
          <li><b>听力 25 分钟</b>：每段录音只放一遍。利用题目间隔<b>提前读选项</b>，听力结束后立即收答题卡 1，边听边涂。</li>
          <li><b>阅读 + 翻译 70 分钟</b>建议顺序：仔细阅读（25 分钟）→ 段落匹配（15 分钟）→ 翻译（25 分钟）→ 选词填空（5 分钟兜底）。</li>
          <li>翻译写在答题卡 2 的指定区域，<b>不要先打草稿再誊写</b>，时间不够；直接写、写整洁。</li>
        </ul>`, tip: '阅读顺序：仔细 → 匹配 → 翻译 → 选词填空兜底。' },
    ],
  },
  {
    id: 'listen', name: '听力', icon: '🎧',
    intro: '占 35%。六级听力的关键不是"听懂每个词"，而是提前预判、抓住同义替换。',
    points: [
      { t: '三种题型的套路', hot: 2, body: `
        <table>
          <tr><th>题型</th><th>内容</th><th>出题点</th></tr>
          <tr><td>长对话 2 篇（8 题）</td><td>采访、校园/职场对话，每篇约 3 分钟</td><td>开头的身份 / 话题；转折处（but / actually / however）；最后一题常问态度或总结</td></tr>
          <tr><td>听力篇章 2 篇（7 题）</td><td>科普、社会类短文，每篇 3–4 题</td><td>首句主旨；数字、年份、因果；例子的作用</td></tr>
          <tr><td>讲座 / 讲话 3 篇（10 题）</td><td>学术讲座、报告，每篇 3–4 题，长度最长</td><td>讲座主题（首题）；研究的发现 / 结论；举例说明的观点；演讲者的建议</td></tr>
        </table>
        <p>所有题目均为<b>四选一</b>，题目<b>按录音顺序</b>出，答案在录音中<b>几乎都有同义改写</b>，听到和选项一模一样的词反而要警惕。</p>`, tip: '顺序出题 + 同义替换；原词重现多半是陷阱。' },
      { t: '听前：用间隙读选项', hot: 2, body: `
        <ul>
          <li>每段录音前有 10 秒左右的指令时间，加上每题后 13 秒作答时间，<b>用来读下一组选项</b>，不要恋战上一题。</li>
          <li>读选项时划出<b>主语、动词、否定词、数字</b>，判断问题类型：四个选项都是动词短语 → 问"做什么 / 建议"；都是形容词 → 问态度；都有 because → 问原因。</li>
          <li>选项<b>共同的词</b>就是话题；<b>互相矛盾的选项</b>里往往有答案。</li>
        </ul>`, tip: '选项共有词 = 话题；互相矛盾的两项里出答案。' },
      { t: '听中：抓信号词', hot: 2, body: `
        <ul>
          <li><b>转折</b>：but, however, yet, actually, in fact, on the contrary —— 后面是重点。</li>
          <li><b>因果</b>：because, since, as a result, that's why, lead to, due to。</li>
          <li><b>强调</b>：especially, in particular, most importantly, what matters is, the key / point is。</li>
          <li><b>结论</b>：so, therefore, in short, all in all, the bottom line is。</li>
          <li><b>举例</b>：for example / instance, such as, take ... as an example —— 例子本身不考，考它<b>证明的观点</b>。</li>
          <li>讲座里 <b>research shows / a study found / according to</b> 后面的内容是高频考点。</li>
        </ul>`, tip: '转折后、研究发现后、"most importantly" 后必出题。' },
      { t: '常见同义替换', hot: 2, body: `
        <table>
          <tr><th>录音说</th><th>选项写</th></tr>
          <tr><td>cut down on / reduce / lower</td><td>decrease / limit</td></tr>
          <tr><td>boost / enhance / promote</td><td>improve / increase</td></tr>
          <tr><td>be fed up with / can't stand</td><td>be tired of / dislike</td></tr>
          <tr><td>once in a while / now and then</td><td>occasionally</td></tr>
          <tr><td>have a hard time doing</td><td>find it difficult to</td></tr>
          <tr><td>be likely to / tend to</td><td>probably / usually</td></tr>
          <tr><td>figure out / work out</td><td>understand / solve</td></tr>
          <tr><td>a great deal of / a host of</td><td>a lot of / many</td></tr>
          <tr><td>drop out of school</td><td>quit school</td></tr>
          <tr><td>make ends meet</td><td>afford basic living</td></tr>
        </table>`, tip: '听到口语短语，找选项里的书面同义词。' },
      { t: '每天怎么练', hot: 1, body: `
        <ul>
          <li>一天一套（25 分钟）+ <b>精听</b>错题所在段落：先盲听 2 遍，再看原文找没听出的词，最后跟读 1 遍。</li>
          <li>把"听到了但没反应过来"的词记进生词本，这类比完全不认识的词更值得练。</li>
          <li>语速：本站 TTS 默认 1.0 倍，考前两周把练习调到 1.1–1.2 倍，考场上会觉得慢。</li>
        </ul>`, tip: '精听错题段落：盲听 → 对原文 → 跟读。' },
    ],
  },
  {
    id: 'read', name: '阅读', icon: '📖',
    intro: '占 35%。三种题型的做法完全不同，仔细阅读分最高，先做它。',
    points: [
      { t: '仔细阅读（每题 2%，优先级最高）', hot: 2, body: `
        <ul>
          <li>2 篇文章各 5 题，<b>题目顺序 = 文章顺序</b>，最后一题常问主旨 / 作者态度。</li>
          <li>做法：<b>先读题干</b>（不读选项），划出定位词（专有名词、数字、特殊名词），回文章找到对应段落，<b>读懂那两三句</b>再看选项。</li>
          <li>正确选项特征：对原文的<b>同义改写</b>、语气留有余地（may, some, tend to）。</li>
          <li>错误选项特征：<b>原词堆砌但关系改了</b>、绝对化（all, never, only）、<b>张冠李戴</b>（把 A 的观点安在 B 头上）、无中生有。</li>
          <li>态度题：作者态度多为 <b>cautious / objective / skeptical / supportive</b>，极端词（indifferent, hostile）一般不选。</li>
        </ul>`, tip: '题干定位 → 读懂两三句 → 选同义改写；绝对化、原词堆砌先排除。' },
      { t: '长篇阅读 / 段落匹配', hot: 2, body: `
        <ul>
          <li>1 篇 1200 词左右、10–15 段，10 个陈述句，每句找出信息所在段落（<b>一段可被选多次，有的段不被选</b>）。</li>
          <li>不要通读文章。<b>先读 10 个题干</b>，划出定位词：数字、年份、人名、大写词、专业名词 → 回文章扫读匹配。</li>
          <li>没有明显定位词的题最后做，用<b>排除法</b>：剩下哪些段落没被用过。</li>
          <li>题干和原文一定是<b>同义改写</b>，看到关键词原封不动出现要再核对句意。</li>
          <li>时间 15 分钟内，做完 7 题就已经达标。</li>
        </ul>`, tip: '先读题干划定位词，再扫段落；一段可多选。' },
      { t: '选词填空（15 选 10，最后做）', hot: 1, body: `
        <ul>
          <li>先给 15 个备选词<b>标词性</b>：n. / v. / adj. / adv.，同一个词可能兼类，按常见用法标。</li>
          <li>看空格前后判断词性：冠词 / 形容词后 → 名词；主语后无谓语 → 动词；名词前 → 形容词；动词前后 → 副词。</li>
          <li>先填有把握的，<b>用过的词划掉</b>，剩下的空用排除法。</li>
          <li>每题 0.5%，<b>不要超过 8 分钟</b>，做不完直接猜词性匹配的。</li>
        </ul>`, tip: '备选词先标词性，空格判词性，用掉就划。' },
      { t: '阅读高频词组', hot: 1, body: `
        <table>
          <tr><td>account for</td><td>解释；占（比例）</td><td>be subject to</td><td>受……影响；易遭受</td></tr>
          <tr><td>attribute A to B</td><td>把 A 归因于 B</td><td>in the wake of</td><td>紧随……之后</td></tr>
          <tr><td>give rise to</td><td>导致</td><td>at the expense of</td><td>以……为代价</td></tr>
          <tr><td>take ... into account</td><td>考虑到</td><td>on the grounds that</td><td>以……为理由</td></tr>
          <tr><td>be bound to</td><td>必然会</td><td>in the long run</td><td>从长远看</td></tr>
          <tr><td>pose a threat to</td><td>对……构成威胁</td><td>shed light on</td><td>阐明</td></tr>
          <tr><td>cope with</td><td>应对</td><td>lag behind</td><td>落后</td></tr>
        </table>`, tip: 'account for / attribute to / give rise to / in the long run 是阅读常客。' },
    ],
  },
  {
    id: 'write', name: '写作', icon: '✍️',
    intro: '占 15%。阅卷按"总体印象"给 15 分制，结构清晰 + 零低级错误 = 11 分档。',
    points: [
      { t: '近年题型', hot: 2, body: `
        <ul>
          <li><b>观点议论类</b>（最常见）：给一句话或一个现象，要求谈看法。如 "Why do people like to live in a big city?"、"the importance of mutual understanding"。</li>
          <li><b>名言 / 谚语类</b>："Beauty of the soul is the essential beauty." 要求解释并论证。</li>
          <li><b>应用文</b>：写一封信（建议信、感谢信）、一则通知、一篇演讲稿，近年偶有。</li>
          <li><b>图表 / 漫画类</b>：描述 + 评论，六级比四级少见但要会。</li>
          <li>要求 <b>150–200 词</b>，少于 120 词扣分，超长不加分。</li>
        </ul>`, tip: '议论最常见；150–200 词；应用文格式别丢分。' },
      { t: '三段式结构', hot: 2, body: `
        <p><b>第一段（3 句）</b>：引出话题 → 点明观点。<br>
        <b>第二段（5–6 句）</b>：两个理由（Firstly / What's more），每个理由 + 一句解释 + 一个例子。<br>
        <b>第三段（2–3 句）</b>：重申观点 + 建议或展望。</p>
        <p>议论文开头万能句：</p>
        <ul>
          <li>Nowadays, there is a growing concern over ... / ... has become a topic of heated discussion.</li>
          <li>When it comes to ..., opinions vary from person to person. As far as I am concerned, ...</li>
          <li>The saying "..." conveys a profound message: ...</li>
        </ul>
        <p>结尾：</p>
        <ul>
          <li>To sum up / In conclusion, ... Only in this way can we ...</li>
          <li>Therefore, it is high time that we (should) ...</li>
        </ul>`, tip: '开头 3 句，中间两理由各带例子，结尾重申 + 建议。' },
      { t: '提分的句式', hot: 2, body: `
        <ul>
          <li><b>倒装</b>：Only by doing so can we ... / Not only does it ..., but it also ...</li>
          <li><b>强调句</b>：It is ... that ...</li>
          <li><b>虚拟语气</b>：It is high time that we took ... / If ..., we would ...</li>
          <li><b>非谓语开头</b>：Faced with ..., / Having realized ..., / Given that ...</li>
          <li><b>There is no denying that ... / It goes without saying that ...</b></li>
          <li><b>定语从句</b>把两句合一句：..., which in turn ...</li>
        </ul>
        <p>每篇用 <b>3–4 个</b>就够，堆太多反而生硬。</p>`, tip: '倒装、强调、虚拟、非谓语各用一次。' },
      { t: '词汇升级', hot: 2, body: `
        <table>
          <tr><th>常见</th><th>升级</th><th>常见</th><th>升级</th></tr>
          <tr><td>important</td><td>crucial / vital / essential</td><td>think</td><td>hold / maintain / argue</td></tr>
          <tr><td>good</td><td>beneficial / favorable</td><td>bad</td><td>detrimental / adverse</td></tr>
          <tr><td>many</td><td>a multitude of / numerous</td><td>very</td><td>considerably / remarkably</td></tr>
          <tr><td>show</td><td>demonstrate / indicate / reveal</td><td>help</td><td>facilitate / contribute to</td></tr>
          <tr><td>solve</td><td>address / tackle / cope with</td><td>people</td><td>individuals / the public</td></tr>
          <tr><td>more and more</td><td>an increasing number of</td><td>in my opinion</td><td>from my perspective</td></tr>
        </table>`, tip: 'important → crucial；think → maintain；solve → address。' },
      { t: '阅卷扣分点', hot: 2, body: `
        <ul>
          <li><b>主谓一致、时态、单复数、冠词</b>这四类低级错误最伤分；写完必须检查一遍。</li>
          <li>不要通篇简单句，也不要一句话写五行；<b>长短句交替</b>。</li>
          <li>不写中式英语：<b>"with the development of society"</b> 这种万金油开头阅卷老师看腻了。</li>
          <li>字迹工整、分段清楚；应用文要有称呼、落款。</li>
          <li>不要跑题：把题目里的关键词在首段和末段<b>各出现一次</b>。</li>
        </ul>`, tip: '检查主谓一致 / 时态 / 单复数 / 冠词；关键词首尾各出现一次。' },
    ],
  },
  {
    id: 'trans', name: '翻译', icon: '🔁',
    intro: '占 15%。汉译英段落，180–200 字，主题几乎固定在中国文化、历史、经济、社会发展。',
    points: [
      { t: '评分标准', hot: 2, body: `
        <table>
          <tr><th>档</th><th>分</th><th>特征</th></tr>
          <tr><td>优</td><td>13–15</td><td>译文准确表达原文意思，用词贴切，行文流畅，基本无语言错误</td></tr>
          <tr><td>良</td><td>10–12</td><td>基本表达原文意思，文字通顺连贯，无重大语言错误</td></tr>
          <tr><td>中</td><td>7–9</td><td>勉强表达原文意思，用词欠准确，语言错误相当多，部分是严重错误</td></tr>
          <tr><td>差</td><td>4–6</td><td>仅表达小部分原文意思，用词不准，有相当多的严重语言错误</td></tr>
        </table>
        <p>阅卷看<b>整体</b>：意思译全、句子完整、没有大语法错，就能到 10 分档。<b>不会的词绕过去</b>（用上义词或解释），千万别空着。</p>`, tip: '意思译全 + 句子完整 + 无大错 = 10 分档；不会的词换说法。' },
      { t: '高频主题词', hot: 2, body: `
        <table>
          <tr><th>文化</th><th>经济社会</th></tr>
          <tr><td>传统文化 traditional culture · 春节 the Spring Festival · 书法 calligraphy · 京剧 Peking Opera · 丝绸之路 the Silk Road · 四大发明 the Four Great Inventions · 儒家思想 Confucianism · 中医 traditional Chinese medicine · 剪纸 paper-cutting · 茶文化 tea culture · 非物质文化遗产 intangible cultural heritage</td>
          <td>改革开放 reform and opening-up · 经济增长 economic growth · 城镇化 urbanization · 可持续发展 sustainable development · 脱贫 poverty alleviation · 高铁 high-speed railway · 电子商务 e-commerce · 移动支付 mobile payment · 人工智能 artificial intelligence · 共享单车 bike-sharing · 一带一路 the Belt and Road Initiative · 生态文明 ecological civilization</td></tr>
        </table>`, tip: '文化 + 经济两张词表背熟，翻译一半的词就有了。' },
      { t: '常用句式', hot: 2, body: `
        <ul>
          <li><b>"……是……之一"</b>：... is one of the most ... in China.</li>
          <li><b>"有着悠久的历史"</b>：... boasts / has a long history of over 2,000 years.</li>
          <li><b>"被认为 / 被视为"</b>：... is regarded / considered as ...</li>
          <li><b>"随着……的发展"</b>：With the development of ..., / As ... develops, ...</li>
          <li><b>"越来越多的人"</b>：An increasing number of people ...</li>
          <li><b>"不仅……而且"</b>：not only ... but also ... / ... as well as ...</li>
          <li><b>"据说 / 据报道"</b>：It is said / reported that ...</li>
          <li><b>无主句</b>（"应该加强……"）：用被动 → ... should be strengthened. 或加主语 we / the government。</li>
        </ul>`, tip: '无主句用被动；"之一"用 one of the most。' },
      { t: '翻译步骤', hot: 1, body: `
        <ol>
          <li>通读全段，<b>确定时态</b>（介绍文化 → 一般现在时；讲历史 → 过去时；讲变化 → 现在完成时）。</li>
          <li>一句一句拆：找<b>主干（主谓宾）</b>，再把修饰成分挂上去（定语从句、分词、介词短语）。</li>
          <li>中文长句<b>拆成两句英文</b>，比写一个带三个从句的长句安全。</li>
          <li>专有名词不会写：<b>拼音 + 解释</b>，如 "Hanfu, the traditional clothing of the Han people"。</li>
          <li>写完检查：冠词、单复数、主谓一致、时态统一。</li>
        </ol>`, tip: '先定时态，再找主干，长句拆两句，专有名词拼音 + 解释。' },
    ],
  },
  {
    id: 'vocab', name: '词汇', icon: '🔤',
    intro: '六级大纲 5500 词，但核心高频就 1000 左右。本站精选 300 个最常出现在听力、阅读和作文里的词。',
    points: [
      { t: '怎么背最有效', hot: 1, body: `
        <ul>
          <li>用"单词"页的<b>闪卡模式</b>：看英文想中文，点"认识 / 不认识"，不认识的自动进生词本，隔天复习。</li>
          <li>每天 <b>40 个新词 + 复习昨天的</b>，考前 30 天刚好过完两轮。</li>
          <li>重点记<b>词性和搭配</b>，六级考的是"这个词在句子里怎么用"，不是孤立释义。</li>
          <li>听力词汇要<b>读出声</b>，认识但听不出等于不认识。</li>
        </ul>`, tip: '闪卡 40 个/天，不认识的进生词本隔天再刷。' },
      { t: '高频词缀', hot: 1, body: `
        <table>
          <tr><th>词缀</th><th>含义</th><th>例</th></tr>
          <tr><td>un- / in- / im- / dis-</td><td>否定</td><td>unprecedented, inadequate, impartial, disparity</td></tr>
          <tr><td>-ate / -ify / -ize</td><td>动词化</td><td>alleviate, intensify, prioritize</td></tr>
          <tr><td>-tion / -ment / -ness</td><td>名词化</td><td>implementation, sustainability</td></tr>
          <tr><td>-able / -ive / -ous</td><td>形容词</td><td>sustainable, comprehensive, conspicuous</td></tr>
          <tr><td>over- / under-</td><td>过度 / 不足</td><td>overwhelm, underestimate</td></tr>
          <tr><td>pre- / post-</td><td>前 / 后</td><td>precede, postpone</td></tr>
        </table>`, tip: '看词缀猜词性，选词填空靠它救命。' },
    ],
  },
];

/* 数字速记：考试关键数字 */
const NUMBERS = [
  { g: '分值与时间', rows: [
    ['总分 / 认可线', '710 / 425'],
    ['听力 / 阅读满分', '各 248.5（35%）'],
    ['写作 / 翻译满分', '各 106.5（15%）'],
    ['总时长', '130 分钟'],
    ['写作时间 / 字数', '30 分钟 / 150–200 词'],
    ['听力时间 / 题数', '25 分钟 / 25 题'],
    ['阅读 + 翻译时间', '70 分钟（建议阅读 45、翻译 25）'],
    ['翻译字数', '汉语 180–200 字'],
  ]},
  { g: '题量', rows: [
    ['长对话', '2 篇 8 题（8%）'],
    ['听力篇章', '2 篇 7 题（7%）'],
    ['讲座 / 讲话', '3 篇 10 题（20%）'],
    ['选词填空', '15 选 10（5%，每题 0.5%）'],
    ['段落匹配', '10 题（10%）'],
    ['仔细阅读', '2 篇 10 题（20%，每题 2%）'],
  ]},
  { g: '单题含金量（按 710 分折算）', rows: [
    ['仔细阅读 1 题', '≈ 14 分'],
    ['讲座 1 题', '≈ 14 分'],
    ['段落匹配 1 题', '≈ 7 分'],
    ['长对话 / 篇章 1 题', '≈ 7 分'],
    ['选词填空 1 题', '≈ 3.5 分'],
  ]},
];
