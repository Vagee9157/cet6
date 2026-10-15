/* 扩展题库：writing（由子代理填充，格式与 data-practice.js / data-vocab.js 一致，追加到现有数组） */

WRITING.push(
  {
    id: 'w4', title: '议论文 · Is it wise to pursue a hobby seriously?',
    prompt: 'Directions: For this part, you are allowed 30 minutes to write an essay on the question "Is it wise to pursue a hobby seriously?" You should state your view and give reasons. You should write at least 150 words but no more than 200 words.',
    outline: ['第一段：现象（越来越多年轻人投入大量时间在爱好上）+ 设问 + 明确立场', '第二段：理由一 培养课堂学不到的能力（耐心、自律）；理由二 调节心理压力；理由三 结交朋友', '第三段：让步（不能挤占主业）+ 重申只要平衡就是明智投资'],
    sample: `In recent years, more and more young people have taken up hobbies such as photography, running or playing the guitar, and some even devote years to them. This raises a question: is it wise to pursue a hobby seriously? In my view, the answer is a definite yes.

To begin with, a hobby pursued with dedication teaches skills that classrooms rarely offer. Practicing the piano for an hour every day, for example, builds patience and discipline, qualities that later prove valuable at work. Not only does a serious hobby sharpen our abilities, but it also protects our mental health. When pressure from study or work becomes overwhelming, a familiar activity that we truly enjoy serves as a reliable source of comfort. Moreover, hobbies connect people. Few friendships are as solid as those formed on a hiking trail or in a chess club.

There is no denying that a hobby should never crowd out our main responsibilities. Were it to take over all our time, it would become a burden rather than a pleasure. Still, as long as balance is kept, pursuing a hobby seriously is a wise investment in a richer life.`,
    notes: ['首段"现象 + 设问 + 立场"三句搞定，不绕弯。', '倒装 "Not only does a serious hobby ..., but it also ..." 衔接两个理由。', '末段 "There is no denying that ..." 让步，再用虚拟倒装 "Were it to take over ..." 说明风险，最后一句回扣论点。', '全文 192 词。'],
  },
  {
    id: 'w5', title: '议论文 · The importance of lifelong learning',
    prompt: 'Directions: For this part, you are allowed 30 minutes to write an essay on the importance of lifelong learning in a rapidly changing world. You should write at least 150 words but no more than 200 words.',
    outline: ['第一段：背景（技术更新快，大学知识易过时）+ 观点（终身学习是必需而非选择）', '第二段：理由一 保持职场竞争力（新职业例子 + 强调句）；理由二 丰富生活、保持好奇心（祖父学英语的例子）', '第三段：让步（在职学习不易）+ 条件已成熟 + 倒装句收尾'],
    sample: `With technology advancing at a dizzying speed, the knowledge acquired at university can become outdated within a few years. It is therefore widely agreed that learning should not end with a diploma. Lifelong learning, in my opinion, has become a necessity rather than a choice.

First and foremost, continuous learning keeps us competitive in the job market. Many of today's jobs, from data analysis to short video editing, did not exist a decade ago, and those who stopped learning after graduation have found themselves struggling to keep up. It is adaptability, not a single qualification, that secures a career in such a changing world. Besides, learning enriches life beyond work. Faced with new ideas, we stay curious, and curiosity is what keeps the mind young. My grandfather, who started learning English at seventy, now chats happily with foreign tourists in the park.

Admittedly, finding time to study while working full-time is far from easy. Yet with online courses and digital libraries available around the clock, the obstacles have never been smaller. Only by treating learning as a lifelong habit can we meet the future with confidence.`,
    notes: ['开头独立主格 "With technology advancing at ..., ..." 交代背景，比 Nowadays 高一档。', '强调句 "It is adaptability, not a single qualification, that ..." 放在理由一末尾点题。', '过去分词开头 "Faced with new ideas, we ..." 非谓语结构；具体例子（祖父七十岁学英语）让论证不空。', '结尾 "Only by ... can we ..." 倒装收束。全文 186 词。'],
  },
  {
    id: 'w6', title: '名言类 · "It is not the mountain we conquer but ourselves."',
    prompt: 'Directions: Write an essay commenting on the saying "It is not the mountain we conquer but ourselves." You can cite examples to illustrate your point. 150–200 words.',
    outline: ['第一段：解释名言（真正的胜利来自克服自身的恐惧、懒惰和怀疑）+ 表态', '第二段：举例论证（备考学生的内在障碍）+ 虚拟语气对比 + 推广到运动员、创业者', '第三段：启示：面对困难先向内看；倒装句收尾'],
    sample: `The saying "It is not the mountain we conquer but ourselves" reminds us that the real victory in any challenge lies within. The mountain is only a mirror; what we truly overcome are our own fear, laziness and doubt. I find this idea both wise and inspiring.

Consider a student preparing for a demanding examination. The test itself is fixed and indifferent, yet the temptation to give up, the anxiety on the eve of the exam and the urge to check the phone every five minutes are all obstacles that come from inside. Had she merely memorized the textbook, she would have learned little; by mastering her own weaknesses, she grows in a way that outlasts any grade. The same holds true for athletes, entrepreneurs and ordinary people alike. External difficulties are often beyond our control, whereas the way we respond to them is entirely our own choice.

Therefore, when facing a mountain in life, we should turn our attention inward first. Only after we have conquered ourselves can the summit, whatever it may be, truly be reached.`,
    notes: ['首段先用自己的话解释名言（the mountain is only a mirror），再表态，是名言题的固定节奏。', '虚拟语气 "Had she merely memorized the textbook, she would have learned little" 做对比论证。', '"External difficulties are ..., whereas ..." 对比句 + "The same holds true for ..." 推广例子。', '末段 "when facing ..." 非谓语开头，"Only after ... can the summit ... be reached" 倒装收尾。全文 178 词。'],
  },
  {
    id: 'w7', title: '图表类 · College students\' daily phone use',
    // 图表作文的图：柱状图 + 饼图，由 assets/chart.js 画成 SVG（站内写作页与模拟卷共用）
    chart: {
      bar: { title: 'Average Daily Phone Use of College Students', unit: 'hours', data: [['2015', 2.1], ['2020', 4.3], ['2025', 6.2]] },
      pie: { title: 'How the Time Was Spent (2025)', data: [['Short videos', 45], ['Social media', 20], ['Study', 15], ['Others', 20]] },
    },
    prompt: 'Directions: For this part, you are allowed 30 minutes to write an essay based on the chart below. The bar chart shows the average time Chinese college students spent on mobile phones per day: 2.1 hours in 2015, 4.3 hours in 2020 and 6.2 hours in 2025. A pie chart for 2025 shows that 45% of the time went to short videos, 20% to social media, 15% to study and 20% to others. Describe the chart, explain the causes and give your comments. 150–200 words.',
    outline: ['第一段：描述数据（十年翻了近三倍；2025 年近一半时间刷短视频，学习仅 15%）', '第二段：原因两三条（手机功能集成、短视频算法留人、校园压力下的逃避）', '第三段：评价 + 建议（设定屏幕时间，强调自律而非设备本身）'],
    sample: `As is clearly shown in the chart, the time college students spend on their phones has soared over the past decade. In 2015, students used their phones for about two hours a day on average; by 2020 the figure had doubled to 4.3 hours, and in 2025 it climbed further to 6.2 hours. Notably, nearly half of that time in 2025 went to short videos, while only fifteen percent was devoted to study.

Several factors account for this striking change. For one thing, smartphones have become far more powerful, combining entertainment, shopping and social life in a single device. For another, short video platforms are deliberately designed to hold attention, so that users scroll far longer than they intend. Equally important is the pressure of campus life, which makes the phone an easy escape from stress.

There is no denying that phones bring convenience, but spending six hours a day on them inevitably erodes concentration and sleep. Were students to set clear limits on screen time, they would find more room for reading, exercise and face-to-face conversation. It is self-discipline, rather than the device itself, that decides whether technology serves us or enslaves us.`,
    notes: ['图表题首段必须有数字：起点、终点、倍数关系各写一句，饼图挑最突出的一块说。', '"As is clearly shown in the chart" 是描述图表的固定起手；"by 2020 the figure had doubled" 注意过去完成时。', '倒装 "Equally important is the pressure of ..." 引出第三个原因，避免 Thirdly。', '末段 "There is no denying that ..." 让步 + 虚拟 "Were students to ..." + 强调句 "It is self-discipline ... that ..." 三连。全文 194 词。'],
  },
  {
    id: 'w8', title: '应用文 · 新生欢迎会演讲稿',
    prompt: 'Directions: Suppose you are invited to deliver a speech at the orientation for freshmen on how to make the most of university life. Write the speech in 150–200 words. Do not sign your own name; use "Li Ming" instead.',
    outline: ['称呼 Dear freshmen / Good morning, everyone', '第一段：表示荣幸 + 自我身份（学长）+ 引出三条建议', '第二段：三条建议（用好图书馆实验室 / 走出舒适区 / 照顾身体和友谊），每条配一句理由或例子', '第三段：升华（大学是起点不是终点）+ 祝愿 + Thank you；落款 Li Ming'],
    sample: `Dear freshmen,

Good morning! It is my great honor to stand here, on behalf of the senior students, to welcome you to our university. Four years ago I sat exactly where you are now, excited and a little lost, so allow me to share three pieces of advice.

First, make full use of the library and the laboratories rather than merely passing exams. Not until I began a research project in my second year did I realize how much the campus had to offer. Second, step out of your comfort zone. Join a club, run for a position in the student union, or volunteer in the community. Were you to spend four years only in the dormitory, you would graduate with a degree but without real growth. Third, take care of your body and your friendships. Regular exercise and a few trustworthy friends will carry you through the hardest weeks far better than energy drinks.

University is not a finish line but a starting point. May you leave here four years from now with knowledge, confidence and memories worth keeping. Thank you!

Li Ming`,
    notes: ['演讲稿格式：称呼 + 问候 + 表示荣幸开场，结尾 Thank you，落款 Li Ming。', '三条建议用 First / Second / Third 清晰分层，每条后面跟一句理由或亲身经历。', '倒装 "Not until I began ... did I realize ..." 和虚拟 "Were you to spend ..., you would ..." 各用一次，演讲稿里显得有力而不突兀。', '结尾 "May you leave here ... with ..." 祝愿句式是演讲稿的标准收尾。正文 180 词。'],
  }
);

TRANSLATION.push(
  {
    id: 't4', title: '京剧', theme: '文化',
    zh: '京剧是中国影响最大的戏曲剧种，被誉为"国粹"。它形成于十九世纪的北京，融合了徽剧、汉剧等多种地方戏曲的特点。京剧表演讲究唱、念、做、打，演员通过程式化的动作来表达人物的情感。京剧的角色主要分为生、旦、净、丑四大行当。脸谱是京剧的一大特色，不同的颜色代表不同的性格，例如红色象征忠诚，白色则代表奸诈。2010年，京剧被列入联合国教科文组织人类非物质文化遗产名录。如今，许多学校开设了京剧课程，让年轻一代了解并传承这门古老的艺术。',
    en: `Peking Opera is the most influential form of traditional Chinese opera and is honored as the "quintessence of Chinese culture." It took shape in Beijing in the nineteenth century, combining the features of several regional operas such as Hui Opera and Han Opera. A Peking Opera performance emphasizes singing, recitation, acting and martial arts, and performers express the emotions of their characters through stylized movements. The roles in Peking Opera fall into four main types: sheng (male roles), dan (female roles), jing (painted-face roles) and chou (clowns). Facial makeup is a distinctive feature of Peking Opera: different colors stand for different personalities. Red, for example, symbolizes loyalty, while white represents treachery. In 2010, Peking Opera was inscribed on UNESCO's list of the Intangible Cultural Heritage of Humanity. Today, many schools offer Peking Opera courses so that the younger generation can understand and carry on this ancient art.`,
    keys: ['戏曲剧种 form of traditional Chinese opera', '被誉为国粹 be honored as the quintessence of Chinese culture', '形成于 take shape in', '唱、念、做、打 singing, recitation, acting and martial arts', '程式化的动作 stylized movements', '行当 role types', '脸谱 facial makeup / painted face', '被列入……名录 be inscribed on the list of', '非物质文化遗产 intangible cultural heritage', '传承 carry on / pass down'],
    notes: ['"融合了……特点"用现在分词 combining ... 挂在主句后，不另起句。', '"例如红色象征忠诚，白色则代表奸诈"是对比，用 while 连接两个分句；前面的总述用冒号引出。', '"被列入名录"是历史事件，用一般过去时被动 was inscribed on；"如今……开设"回到一般现在时。'],
  },
  {
    id: 't5', title: '苏州园林', theme: '文化',
    zh: '苏州园林是中国古典园林的杰出代表，距今已有两千多年的历史。这些园林大多由文人或退休官员建造，是他们追求理想生活的场所。园林主人常在此读书、作画、宴请宾客。苏州园林面积不大，却通过假山、流水、亭台和花木的巧妙布局，营造出"咫尺之内再造乾坤"的意境。园林中的每一扇窗、每一条小径都经过精心设计，使人移步换景。1997年，拙政园等四座园林被列入世界文化遗产名录。如今，苏州园林每年吸引数百万游客，成为人们了解中国传统美学的重要窗口。',
    en: `The classical gardens of Suzhou are an outstanding example of traditional Chinese gardens, with a history of more than two thousand years. Most of them were built by scholars or retired officials as places where they could pursue their ideal way of life. The owners often read, painted and entertained guests there. Although these gardens are small in area, they create a world of their own within a limited space through the ingenious arrangement of rockeries, streams, pavilions, flowers and trees. Every window and every path in the gardens is carefully designed, so that the scenery changes with each step the visitor takes. In 1997, four of the gardens, including the Humble Administrator's Garden, were added to the World Heritage List. Today, the gardens of Suzhou attract millions of visitors every year and have become an important window through which people learn about traditional Chinese aesthetics.`,
    keys: ['古典园林 classical gardens', '杰出代表 an outstanding example / representative of', '文人 scholars / men of letters', '退休官员 retired officials', '假山 rockeries', '亭台 pavilions', '巧妙布局 ingenious arrangement / layout', '移步换景 the scenery changes with each step', '世界文化遗产名录 the World Heritage List', '传统美学 traditional aesthetics'],
    notes: ['"咫尺之内再造乾坤"不要直译，意译成 create a world of their own within a limited space 即可。', '"面积不大，却……"用 Although ... small in area, they ... 处理转折。', '"使人移步换景"是结果，用 so that 从句；"拙政园"写不出专名可以只译 four gardens。'],
  },
  {
    id: 't6', title: '移动支付', theme: '经济社会',
    zh: '近年来，移动支付在中国迅速普及，深刻改变了人们的消费方式。无论是在大型商场还是街边小摊，人们只需用手机扫描二维码，就能在几秒钟内完成付款。移动支付的兴起得益于智能手机的普及、互联网技术的进步以及完善的金融基础设施。据统计，中国移动支付用户已超过九亿，交易规模居世界首位。移动支付不仅提高了交易效率，也减少了使用现金带来的不便和风险。与此同时，政府和企业也在不断加强对个人信息和资金安全的保护，使人们能够更加放心地享受这一便利。',
    en: `In recent years, mobile payment has become widespread in China and has profoundly changed the way people spend money. Whether in a large shopping mall or at a street stall, people simply scan a QR code with their phones and complete the payment within seconds. The rise of mobile payment owes much to the popularity of smartphones, advances in Internet technology and a well-developed financial infrastructure. According to statistics, the number of mobile payment users in China has exceeded nine hundred million, and the volume of transactions ranks first in the world. Mobile payment has not only improved the efficiency of transactions but also reduced the inconvenience and risks associated with cash. Meanwhile, the government and businesses are continuously strengthening the protection of personal information and financial security, so that people can enjoy this convenience with greater peace of mind.`,
    keys: ['迅速普及 become widespread rapidly', '消费方式 the way people spend money / consumption patterns', '扫描二维码 scan a QR code', '得益于 owe much to / benefit from', '金融基础设施 financial infrastructure', '据统计 according to statistics', '交易规模居世界首位 the volume of transactions ranks first in the world', '个人信息 personal information', '放心地 with peace of mind'],
    notes: ['"无论是……还是……"译成 Whether ... or ... 放句首，主句主语 people 补出来。', '"得益于"后面三个并列名词，保持结构平行：the popularity of ..., advances in ..., and a ... infrastructure。', '"使人们能够更加放心地……"是前一句的结果，用 so that 从句接上，不要另起一句主语不明的话。'],
  },
  {
    id: 't7', title: '乡村振兴', theme: '经济社会',
    zh: '乡村振兴是中国近年来的一项重要国家战略，旨在缩小城乡差距，实现农村的全面发展。长期以来，大量农村劳动力涌入城市，导致许多村庄出现人口减少、土地闲置等问题。为了改变这一状况，政府加大了对农村基础设施的投入，改善了道路、供水和网络条件。同时，电子商务的发展使农产品能够直接销往全国各地，农民的收入显著提高。越来越多的年轻人选择返乡创业，发展特色农业和乡村旅游。可以预见，随着各项政策的落实，中国农村将焕发出新的活力。',
    en: `Rural revitalization is a major national strategy that China has adopted in recent years, aiming to narrow the gap between urban and rural areas and achieve the all-round development of the countryside. For a long time, large numbers of rural workers have flocked to cities, leaving many villages with shrinking populations and idle farmland. To change this situation, the government has increased investment in rural infrastructure and improved roads, water supply and Internet access. At the same time, the growth of e-commerce has enabled agricultural products to be sold directly to every part of the country, and farmers' incomes have risen significantly. An increasing number of young people are choosing to return to their hometowns to start businesses, developing specialty farming and rural tourism. It can be expected that, as these policies are put into practice, rural China will take on new vitality.`,
    keys: ['乡村振兴 rural revitalization', '国家战略 national strategy', '缩小城乡差距 narrow the gap between urban and rural areas', '农村劳动力 rural workers / rural labor force', '土地闲置 idle farmland', '基础设施 infrastructure', '返乡创业 return to one\'s hometown to start a business', '特色农业 specialty farming', '焕发新的活力 take on new vitality'],
    notes: ['"旨在"用 aiming to 分词结构挂在主句后，后面两个动词 narrow ... and achieve ... 并列。', '"导致……等问题"不必译 problems，用 leaving many villages with ... 分词表结果更简洁。', '"可以预见"是无主句，固定译法 It can be expected that ...；"随着……落实"用 as 从句插在中间。'],
  },
  {
    id: 't8', title: '新能源汽车', theme: '科技',
    zh: '新能源汽车是指以非常规燃料为动力的汽车，主要包括纯电动汽车和插电式混合动力汽车。近十年来，在政府补贴和技术进步的推动下，中国新能源汽车产业发展迅猛。2023年，中国新能源汽车的产量和销量均超过九百万辆，连续多年位居世界第一。与传统燃油车相比，新能源汽车噪音小、运行成本低，并且能够显著减少尾气排放。目前，全国已建成数百万个充电桩，续航里程不足的问题正在逐步得到解决。可以预见，新能源汽车将在实现碳中和目标的过程中发挥越来越重要的作用。',
    en: `New energy vehicles refer to vehicles powered by unconventional fuels, mainly including pure electric vehicles and plug-in hybrid vehicles. Over the past decade, driven by government subsidies and technological progress, China's new energy vehicle industry has grown at a remarkable pace. In 2023, both the production and sales of new energy vehicles in China exceeded nine million, ranking first in the world for several consecutive years. Compared with traditional fuel-powered cars, new energy vehicles produce less noise, cost less to run and significantly reduce exhaust emissions. At present, millions of charging stations have been built across the country, and the problem of limited driving range is gradually being solved. It is foreseeable that new energy vehicles will play an increasingly important role in achieving the goal of carbon neutrality.`,
    keys: ['新能源汽车 new energy vehicles', '非常规燃料 unconventional fuels', '纯电动汽车 pure electric vehicles', '插电式混合动力汽车 plug-in hybrid vehicles', '政府补贴 government subsidies', '连续多年 for several consecutive years', '尾气排放 exhaust emissions', '充电桩 charging stations / charging piles', '续航里程 driving range', '碳中和 carbon neutrality'],
    notes: ['"是指……的汽车"用 refer to vehicles powered by ...，过去分词 powered 做后置定语。', '"在……的推动下"译成 driven by ... 放句首做状语，主语仍是 industry。', '"正在逐步得到解决"是被动进行时 is gradually being solved；"可以预见"用 It is foreseeable / expected that。'],
  },
  {
    id: 't9', title: '职业教育', theme: '教育',
    zh: '职业教育是中国教育体系的重要组成部分，旨在培养具有实践技能的高素质技术人才。过去，不少家长认为职业学校不如普通大学，导致职业教育长期不受重视。近年来，随着制造业升级和服务业发展，社会对技术工人的需求大幅增加，职业教育的地位也随之提高。政府出台了一系列政策，鼓励学校与企业合作，让学生在学习理论的同时参与真实的生产过程。许多职业院校毕业生的就业率高于普通本科院校。可以预见，职业教育将为中国经济的高质量发展提供有力的人才支撑。',
    en: `Vocational education is an important part of China's education system, aiming to cultivate high-quality technical talent with practical skills. In the past, many parents believed that vocational schools were inferior to regular universities, so vocational education was neglected for a long time. In recent years, with the upgrading of manufacturing and the growth of the service sector, the demand for skilled workers has increased sharply, and the status of vocational education has risen accordingly. The government has introduced a series of policies to encourage cooperation between schools and enterprises, allowing students to take part in real production processes while learning theory. The employment rate of graduates from many vocational colleges is higher than that of regular undergraduate institutions. It can be expected that vocational education will provide strong talent support for the high-quality development of China's economy.`,
    keys: ['职业教育 vocational education', '重要组成部分 an important part / component of', '实践技能 practical skills', '技术人才 technical talent', '不如 be inferior to', '不受重视 be neglected', '制造业升级 the upgrading of manufacturing', '出台政策 introduce / roll out policies', '就业率 employment rate', '人才支撑 talent support'],
    notes: ['"旨在培养……人才"用 aiming to cultivate ... 分词结构；"具有实践技能的"后置为 with practical skills。', '"导致职业教育长期不受重视"用 so 引出结果分句，被动 was neglected 处理"不受重视"。', '"就业率高于普通本科院校"要补出比较对象 that of ...，不能直接 higher than institutions。'],
  }
);
