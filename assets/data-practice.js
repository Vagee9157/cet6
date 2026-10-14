/* 练习题：按六级真题题型、长度、难度自编（非历年原卷）。
 * 听力 script 用浏览器 TTS 朗读；questions 的 a 为正确选项下标。 */

const LISTENING = [
  {
    id: 'lc1', type: 'conv', title: '长对话 · 实习经历', minutes: 3,
    script: `W: So, Mark, I heard you just finished a summer internship at a marketing firm. How did it go?
M: Honestly, it was nothing like what I expected. I thought I'd be sitting in meetings and brainstorming campaign ideas, but for the first two weeks they had me cleaning up customer databases.
W: That sounds tedious.
M: It was, at first. But then my supervisor explained that every campaign starts with knowing who you are talking to. Once I understood why the data mattered, the work felt less pointless.
W: Did you eventually get to do anything creative?
M: I did. In the last month they let me draft social media posts for a small client, a local bakery. Two of my posts actually went out, and one of them got more engagement than anything the client had posted before.
W: That must have felt great.
M: It did, but what I valued most was the feedback. My supervisor went through every draft line by line. She was tough, but she never made me feel stupid.
W: Would you go back if they offered you a job?
M: I'd consider it. The pay was low and the commute was awful, but I learned more in ten weeks than in a whole semester. The one thing I'd want is a clearer path for promotion. Right now most people there seem to stay in the same role for years.
W: So it's a question of long-term prospects rather than the work itself.
M: Exactly. I liked the people and the work. I'm just not sure it's where I want to be at thirty.`,
    questions: [
      { q: 'What did Mark do during the first two weeks of his internship?', opts: ['Attended client meetings.', 'Organized customer data.', 'Designed advertising campaigns.', 'Wrote social media posts.'], a: 1, exp: '原文 "they had me cleaning up customer databases"，选项用 organized customer data 同义替换。' },
      { q: 'Why did the work feel less pointless to Mark later on?', opts: ['He was moved to a creative team.', 'His supervisor praised his efforts.', 'He realized how the data was used.', 'The client gave positive feedback.'], a: 2, exp: '"Once I understood why the data mattered, the work felt less pointless."' },
      { q: 'What did Mark value most about the internship?', opts: ['The chance to work with a local client.', 'The detailed feedback from his supervisor.', 'The success of his social media post.', 'The friendly atmosphere in the office.'], a: 1, exp: '"what I valued most was the feedback"。注意 "the success of the post" 是干扰项——有提到但不是 valued most。' },
      { q: 'What concerns Mark about accepting a job offer from the firm?', opts: ['The low salary.', 'The long commute.', 'The limited career advancement.', 'The heavy workload.'], a: 2, exp: '转折 "The one thing I\'d want is a clearer path for promotion" 才是真正的 concern；薪水和通勤只是顺带提到。' },
    ],
  },
  {
    id: 'lc2', type: 'conv', title: '长对话 · 搬到小城市', minutes: 3,
    script: `M: Linda, I was surprised to hear you're leaving the city. You always said you'd never move.
W: I know. But the rent went up again this year, and I realized I was spending over half my income just to live in a tiny apartment.
M: Where are you going?
W: A town about two hours north. My company lets us work remotely three days a week, so I only need to come in on Tuesdays and Thursdays.
M: Isn't the commute going to be exhausting on those days?
W: It's long, but the train has good Wi-Fi, so I can work on the way. I'll count those two hours as part of my working day, so I won't get home any later than I do now. And on the other days I'll have a garden, a quiet street, and a house that costs less than my current rent.
M: What about your social life? Everyone you know is here.
W: That's the part I worry about most, to be honest. I've already joined a hiking group there, and a friend from college lives nearby. It will take time, but I think it's worth it.
M: And if it doesn't work out, you could always come back.
W: True. I'm only renting the house for the first year, so I'm not locked in. But I really hope I won't need to.
M: Do you think more people will do what you're doing?
W: I think so. The town has grown by almost ten percent in the last three years, and most of the newcomers are from the city, like me. But that only continues as long as companies keep allowing remote work. If they call everyone back to the office five days a week, the whole plan falls apart.
M: Well, I'll miss our lunches. But I might come up for a weekend to see this garden of yours.
W: Please do. I'll need help pulling weeds.`,
    questions: [
      { q: 'Why has Linda decided to leave the city?', opts: ['She found a better job elsewhere.', 'Her apartment is too far from the office.', 'Housing has become too expensive.', 'She wants to live closer to her family.'], a: 2, exp: '"the rent went up again ... spending over half my income just to live in a tiny apartment"。' },
      { q: 'How will Linda handle the long commute?', opts: ['By working on the train.', 'By driving instead of taking the train.', 'By staying in the city on workdays.', 'By asking to work fully remotely.'], a: 0, exp: '"the train has good Wi-Fi, so I can work on the way"。' },
      { q: 'What does Linda worry about most?', opts: ['The cost of maintaining a house.', 'Losing touch with her friends.', 'The lack of public transport.', 'Being called back to the office.'], a: 1, exp: '"What about your social life? — That\'s the part I worry about most."' },
      { q: 'What does Linda think will determine whether others follow her example?', opts: ['The price of houses in small towns.', 'The quality of train services.', 'Companies\' policies on remote work.', 'The availability of jobs outside cities.'], a: 2, exp: '"as long as companies keep allowing remote work ... If they call everyone back ... the whole plan falls apart."' },
    ],
  },
  {
    id: 'lp1', type: 'passage', title: '听力篇章 · 城市中的蜜蜂', minutes: 3,
    script: `Over the past decade, beekeeping has quietly spread from the countryside into the hearts of major cities. Rooftops in London, Paris and Tokyo now host thousands of hives, and city councils often encourage the trend as a way to support pollinators and connect residents with nature. At first glance, cities seem like an unlikely home for bees. Yet studies have found that urban bees can be healthier than their rural cousins. The reason is diversity. In farmland, bees often face vast fields of a single crop, which blooms for a few weeks and then offers nothing. In cities, parks, gardens and street trees provide a mix of flowers from early spring to late autumn. Urban areas also use far fewer pesticides than commercial farms. However, researchers are now warning that enthusiasm may have gone too far. In some districts of London, the number of hives has grown so fast that there is not enough food to go around. Honeybees, which are essentially farm animals, compete with wild bees and other insects for the same flowers. When hives are too dense, wild species, many of which are already in decline, lose out. The scientists are not asking cities to ban beekeeping. Instead, they suggest that anyone who wants to help pollinators should plant flowers before buying a hive. A balcony full of lavender, they say, does more good than another box of honeybees on a crowded roof.`,
    questions: [
      { q: 'Why can city bees be healthier than those in the countryside?', opts: ['Cities have milder winters.', 'City flowers are more nutritious.', 'They have varied food sources for a longer season.', 'They face fewer natural enemies.'], a: 2, exp: '"The reason is diversity ... a mix of flowers from early spring to late autumn."' },
      { q: 'What problem has emerged in parts of London?', opts: ['Beekeepers lack proper training.', 'There are too many hives for the available flowers.', 'Residents complain about bee stings.', 'Pesticide use in parks has increased.'], a: 1, exp: '"the number of hives has grown so fast that there is not enough food to go around."' },
      { q: 'What do the scientists recommend?', opts: ['Banning beekeeping in crowded districts.', 'Limiting the number of hives per roof.', 'Planting flowers before keeping bees.', 'Moving honeybees back to farms.'], a: 2, exp: '"they suggest that anyone who wants to help pollinators should plant flowers before buying a hive."' },
    ],
  },
  {
    id: 'll1', type: 'lecture', title: '讲座 · 睡眠与记忆', minutes: 4,
    script: `Good morning. Today I want to talk about something all of you do, though probably not enough of: sleep. For a long time, scientists assumed that sleep was simply a period of rest, a time when the brain switched off. We now know that the opposite is true. During sleep, the brain is extremely busy, and one of its main tasks is sorting through the day's experiences and deciding what to keep. Brain scans show that during deep sleep, the hippocampus, a small region that holds new information for a short time, replays the events of the day and passes them on to the cortex for long-term storage. Let me describe an experiment from my own lab. We asked two groups of students to learn a list of word pairs in the evening. One group then slept for eight hours. The other group stayed awake and was tested the next morning after a night without sleep. The difference was striking. The sleep group remembered about forty percent more of the pairs. Frankly, I expected the tired group to catch up once they had rested. But when we tested both groups again a week later, after everyone had caught up on sleep, the gap had not closed. Those who missed sleep on the first night never recovered the memories they had failed to consolidate. So the lesson is not simply that sleep helps. It is that the night immediately after learning is a window that does not reopen. We have since repeated the study with more than three hundred students and with different kinds of material, from vocabulary to math problems, and the pattern holds every time. This has obvious implications for how you study. Pulling an all-nighter before an exam may let you cram facts into short-term memory, but it also prevents the brain from storing what you learned that day. A far better strategy is to study in the afternoon, review briefly before bed, and then sleep a full night. One more point. Many students tell me they will sleep when the exams are over. But our data suggest that what you lose during exam season does not come back. Treat sleep as part of studying, not as its opposite.`,
    questions: [
      { q: 'What did scientists once believe about sleep?', opts: ['It was a time of intense brain activity.', 'It helped the body more than the mind.', 'It was merely a period of inactivity.', 'It was less important than diet.'], a: 2, exp: '"scientists assumed that sleep was simply a period of rest ... the brain switched off"。' },
      { q: 'What did the speaker\'s experiment find a week later?', opts: ['Both groups remembered the same amount.', 'The sleep-deprived group had caught up.', 'The sleep group forgot most of the pairs.', 'The gap between the groups remained.'], a: 3, exp: '"the gap had not closed ... never recovered the memories"。' },
      { q: 'What does the speaker say about staying up all night before an exam?', opts: ['It is useful for difficult subjects.', 'It blocks the storage of that day\'s learning.', 'It works only for short-term facts.', 'It is harmless if done occasionally.'], a: 1, exp: '"it also prevents the brain from storing what you learned that day"。C 只说了一半，是干扰。' },
      { q: 'What is the speaker\'s advice to students?', opts: ['Study late at night when it is quiet.', 'Catch up on sleep after exams.', 'Regard sleep as part of studying.', 'Review notes early in the morning.'], a: 2, exp: '结尾 "Treat sleep as part of studying, not as its opposite."' },
    ],
  },
];

const READING = {
  cloze: [
    {
      id: 'rc1', title: '选词填空 · 远程办公', minutes: 8,
      bank: ['A) adapt', 'B) collaborate', 'C) commute', 'D) considerably', 'E) distracted', 'F) emerged', 'G) flexibility', 'H) isolation', 'I) likewise', 'J) monitor', 'K) productive', 'L) prospect', 'M) reluctant', 'N) routine', 'O) sustain'],
      // 正确答案：空格序号 → 选项字母
      text: `Before 2020, working from home was a rare privilege. Then, almost overnight, millions of employees were told to stay away from the office, and a vast, unplanned experiment [1] . Three years on, the results are clearer, and they are more mixed than either enthusiasts or skeptics predicted.
On the positive side, most workers report that the [2] to choose where and when they work has improved their lives. Hours once lost to the daily [3] are now spent with family or on exercise. Surveys show that employees are, on average, slightly more [4] at home, largely because they face fewer interruptions from colleagues.
Yet the same surveys reveal a quieter cost. Many people, especially those who live alone, describe a growing sense of [5] . Informal conversations, the kind that happen by the coffee machine, have largely disappeared, and younger staff in particular find it harder to learn from senior colleagues. Managers, [6] , complain that it is difficult to [7] performance when they cannot see their teams.
Companies have responded in different ways. Some have called everyone back five days a week, only to find that experienced employees were [8] to return and began looking elsewhere. Others have settled on a hybrid [9] , typically three days in the office and two at home. Whether such arrangements can [10] the benefits of both worlds, or merely combine their drawbacks, remains an open question.`,
      answers: ['F', 'G', 'C', 'K', 'H', 'I', 'J', 'M', 'N', 'O'],
      exp: ['主语 experiment 后缺谓语，过去时 → emerged', 'the ___ to choose：名词，"灵活性" → flexibility', 'the daily ___：名词，通勤 → commute', 'more ___ at home：形容词，高效 → productive', 'a growing sense of ___：名词，孤独 → isolation', 'Managers, ___, complain：副词，同样地 → likewise', 'to ___ performance：动词，监控 → monitor', 'were ___ to return：形容词，不情愿 → reluctant', 'a hybrid ___：名词，惯例/模式 → routine', 'can ___ the benefits：动词，维持 → sustain'],
    },
  ],
  match: [
    {
      id: 'rm1', title: '段落匹配 · 城市如何应对高温', minutes: 15,
      paras: [
        ['A', 'Every summer the headlines repeat themselves: record temperatures, overwhelmed hospitals, warnings to stay indoors. Heat now kills more people in many countries than floods, storms and earthquakes combined, yet it rarely receives the same attention, partly because its victims die quietly, at home, one by one. A flood leaves behind dramatic images of broken bridges and ruined houses; a heat wave leaves almost nothing to photograph. Even the death toll is uncertain. Heat is seldom recorded as a cause on death certificates, so the true figure often emerges only months later, when statisticians compare deaths with normal levels.'],
        ['B', 'Cities suffer most. Concrete and asphalt absorb sunlight during the day and release it at night, so that urban centers can be five to seven degrees hotter than the surrounding countryside. The layout of the city adds to the problem, since narrow streets lined with tall buildings trap warm air. This "heat island" effect means that the people with the least ability to escape, the elderly, the poor and those without air conditioning, are also those most exposed. A study of over a hundred American cities found that, within the same city, low-income neighborhoods were often several degrees hotter than wealthy ones.'],
        ['C', 'Some cities have begun to treat heat as the emergency it is. In 2021, Miami appointed the world\'s first "chief heat officer", a post since copied by Athens, Santiago and Freetown. Her job is not to invent new technology but to make sure that existing measures, from cooling centers to public messaging, actually reach the people who need them. The thinking behind the role is that heat, like fire or flooding, needs someone who is clearly in charge. Previously, responsibility was split among several departments, each assuming another was dealing with it.'],
        ['D', 'The cheapest measure is also the oldest: trees. A mature tree can lower the temperature beneath it by several degrees through shade and the evaporation of water from its leaves. The benefit is not limited to the ground under the branches, because trees also shade walls and windows and reduce the energy needed to keep nearby buildings comfortable. Studies in Los Angeles found that neighborhoods with little tree cover were consistently hotter and had higher rates of heat-related illness than leafy districts a few kilometers away.'],
        ['E', 'Yet planting trees is slower and harder than it sounds. A sapling takes decades to provide real shade, needs water during exactly the dry months when cities ration it, and often dies within a few years because nobody is paid to look after it. Several ambitious "million tree" campaigns have quietly fallen short of their targets for precisely these reasons. Experts now argue that a modest budget for watering and pruning matters more than the number of trees put in the ground on a single, well-publicized day.'],
        ['F', 'Buildings offer faster results. Painting roofs white reflects sunlight instead of absorbing it, and can cut indoor temperatures noticeably at almost no cost. Ahmedabad in India, which lost hundreds of residents in a 2010 heat wave, has since painted thousands of roofs in low-income areas and reports a sharp fall in deaths. Measurements there showed that rooms under treated roofs were two to five degrees cooler than similar rooms under ordinary tin or concrete.'],
        ['G', 'Air conditioning is the obvious answer, and in rich countries it is nearly universal. But it has a catch. Every unit pumps heat out into the street, raising outdoor temperatures further, and the electricity it consumes often comes from fossil fuels, worsening the very problem it is meant to relieve. Cities that rely on it alone are, in effect, cooling their rooms by heating their planet. The challenge is growing quickly: global demand for cooling is expected to triple by the middle of the century, mostly in hot, fast-growing countries.'],
        ['H', 'Water is another underused tool. Paris has reopened old fountains and installed hundreds of misting stations, and plans to let residents swim in the Seine. Even simple drinking fountains matter, since in many cities a person without money cannot get a glass of water outdoors without buying it. Seville has revived an ancient technique, channeling cool air from underground water tanks into public squares, borrowed from the Persian engineers who cooled palaces a thousand years ago. A trial in one square near the city center lowered the air temperature by several degrees while using little more power than a small pump.'],
        ['I', 'Perhaps the hardest change is cultural. In Spain, the afternoon siesta was long mocked as laziness; it is now being reconsidered as sensible adaptation. Some employers in southern Europe have begun shifting outdoor work to early morning and evening, and a few countries are debating legal limits on working hours during extreme heat. Schools in some regions have likewise moved exams and sports days away from the hottest weeks of the year. Such changes cost little, but they challenge long-standing habits about when people should work, study and rest.'],
        ['J', 'None of these measures is sufficient on its own. Trees take decades, white roofs help only those indoors, water features cool a square but not a city. The lesson from the places that have cut heat deaths is that they combined many modest steps and, crucially, aimed them at the neighborhoods where people were actually dying. Even a well-chosen mix of measures, however, depends on two further things: knowing when danger is coming, and building cities that hold less heat in the first place.'],
        ['K', 'Early warning is the first of these. Weather services can now predict a dangerous heat wave several days ahead, and the most effective systems combine the forecast with health data, so that alerts are issued not at a fixed temperature but when local conditions are known to raise death rates. Research also shows that the first hot spell of the summer tends to be the deadliest, because bodies have not yet adjusted. A forecast alone, however, changes little. After a heat wave in 2003 killed some fifteen thousand people in France, towns began keeping registers of older and disabled residents, and volunteers now phone or visit them during every alert.'],
        ['L', 'The second is planning. Stuttgart, a German city in a deep valley, has for decades protected the green hillsides around it from development, so that cool air formed there at night can flow down into the center along open "ventilation corridors". Planners check proposed buildings against maps of these air flows and reject those that would block them. Several Chinese cities, among them Wuhan, have since drawn up similar plans. Such measures work slowly and force difficult choices about land that developers would gladly build on. Yet streets and buildings last a century or more, and the decisions made today will shape how hot cities feel for generations.'],
      ],
      items: [
        { s: 'An Indian city has seen far fewer heat deaths after a simple change to its buildings.', a: 'F' },
        { s: 'Heat-related deaths attract less attention partly because they happen unnoticed.', a: 'A' },
        { s: 'Tree-planting programs often fail because no one is responsible for the young trees.', a: 'E' },
        { s: 'Successful cities have focused their efforts on the areas where deaths occur.', a: 'J' },
        { s: 'An official\'s role is to ensure existing solutions reach vulnerable residents.', a: 'C' },
        { s: 'A traditional midday rest is being viewed in a new light.', a: 'I' },
        { s: 'Districts with few trees showed more cases of heat-related illness.', a: 'D' },
        { s: 'A cooling method used today was borrowed from engineers centuries ago.', a: 'H' },
        { s: 'Those least able to escape heat are also the most exposed to it.', a: 'B' },
        { s: 'A common cooling technology makes the outdoor environment hotter.', a: 'G' },
      ],
    },
  ],
  mc: [
    {
      id: 'rp1', title: '仔细阅读 · 大学该不该教"实用"技能', minutes: 12,
      text: `For most of the twentieth century, a university degree was a reliable ticket to a comfortable life. That bargain is now in question. Tuition has risen far faster than wages, and graduates increasingly find themselves in jobs that do not require the degree they paid so much for. Not surprisingly, students and their parents have begun to ask a blunt question: what, exactly, is a university for?
One answer, popular with politicians, is that universities should teach "practical" skills, meaning whatever employers say they need this year. Some governments have begun to fund courses according to the salaries their graduates earn, so that engineering is rewarded and philosophy is punished. The logic seems unassailable: why spend public money on subjects that do not pay?
The trouble is that nobody knows which skills will matter in a decade. Fifteen years ago, universities were urged to produce more programmers; today, software that writes software threatens to make many of them redundant. The jobs that have proved most durable are those that demand judgment, communication and the ability to learn something new, precisely the capacities that a narrow vocational training tends to neglect.
This is not an argument for ignoring the job market. Students deserve honest information about what graduates in each field actually earn, and universities that take fees for courses leading nowhere should be ashamed. But there is a difference between informing choice and dictating it. A funding system that rewards only immediate salary will, over time, hollow out the very disciplines, from history to pure mathematics, on which practical innovation ultimately depends.
Perhaps the most useful thing a university can do is to refuse the false choice. The best courses, in any subject, teach students to read carefully, argue clearly and tolerate uncertainty. Employers, when asked what they actually value, list exactly these things. The skills are not "practical" in the sense of being attached to a particular job. They are practical in the deeper sense of being useful for every job, including the ones that do not yet exist.`,
      questions: [
        { q: 'Why has the value of a university degree come into question?', opts: ['Universities have lowered their academic standards.', 'Degrees have become costlier while delivering less.', 'Employers no longer trust university qualifications.', 'Fewer students are able to complete their studies.'], a: 1, exp: '第一段："Tuition has risen far faster than wages, and graduates increasingly find themselves in jobs that do not require the degree"。' },
        { q: 'What do some governments do in the name of practicality?', opts: ['Require universities to consult employers on courses.', 'Replace philosophy courses with engineering ones.', 'Fund programs based on their graduates\' earnings.', 'Cut public money for all humanities subjects.'], a: 2, exp: '第二段："fund courses according to the salaries their graduates earn"。B、D 过度推断。' },
        { q: 'What does the author say about the example of programmers?', opts: ['It shows that technical skills are the safest investment.', 'It proves that universities respond too slowly to demand.', 'It illustrates how hard it is to predict future needs.', 'It suggests that programming should be taught earlier.'], a: 2, exp: '第三段首句 "nobody knows which skills will matter in a decade"，程序员例子用来证明这一点。' },
        { q: 'What is the author\'s attitude toward using job-market data?', opts: ['It should guide students but not control funding.', 'It is unreliable and should be disregarded.', 'It should decide which courses universities offer.', 'It matters only for vocational subjects.'], a: 0, exp: '第四段："a difference between informing choice and dictating it"。' },
        { q: 'In what sense are reading, arguing and tolerating uncertainty "practical", according to the author?', opts: ['They are required by most employers today.', 'They are useful across all kinds of jobs.', 'They lead directly to well-paid positions.', 'They can be taught in a short time.'], a: 1, exp: '末段："practical in the deeper sense of being useful for every job, including the ones that do not yet exist."' },
      ],
    },
    {
      id: 'rp2', title: '仔细阅读 · 算法推荐与注意力', minutes: 12,
      text: `When the first online video platforms appeared, their recommendation systems were simple: they showed you what was popular. Within a few years, that approach had been replaced by algorithms that study each user individually, learning from every click, pause and scroll which content keeps that particular person watching. The result, by the companies\' own measures, has been a spectacular success. Average time spent on the leading platforms has more than doubled in a decade.
Whether this counts as success for users is another matter. Critics argue that the systems are optimized for a single variable, engagement, which is not the same as satisfaction, let alone well-being. A video that makes you angry holds your attention at least as well as one that makes you happy, and the algorithm does not care which. Over millions of users, this creates a slow drift toward whatever is most provocative.
The companies reply that they merely give people what they want, and that users are free to leave at any time. This defense is weaker than it sounds. Wanting to watch one more video at midnight and wanting to have watched it are different things, as anyone who has done so knows. Economists call this a gap between present and future preferences, and systems designed to exploit the former will, almost by definition, work against the latter.
Some platforms have experimented with alternatives. One tested a version of its feed that asked users, once a week, to rate how they felt about the time they had spent. Engagement fell by a few percent; reported satisfaction rose sharply. The experiment was quietly dropped, a decision that tells us more about the business model than any public statement could.
Regulation is now being discussed in several countries, but the most promising changes may come from users themselves. A growing number are turning off autoplay, deleting apps from their phones, or switching to services that charge a fee instead of selling attention. These remain a minority. But they are a reminder that the algorithm, however clever, still needs us to open the app.`,
      questions: [
        { q: 'How have recommendation systems changed since the early days of online video?', opts: ['They have become less accurate.', 'They now rely on individual viewing behavior.', 'They focus more on popular content.', 'They have been simplified for speed.'], a: 1, exp: '首段："algorithms that study each user individually, learning from every click..."' },
        { q: 'What is the critics\' main objection to the algorithms?', opts: ['They promote content that is false.', 'They measure only how long people watch.', 'They ignore what is popular.', 'They make videos shorter and shallower.'], a: 1, exp: '第二段："optimized for a single variable, engagement"。' },
        { q: 'Why does the author find the companies\' defense weak?', opts: ['Users cannot easily delete their accounts.', 'Most users do not know how the algorithm works.', 'What people want now differs from what they want later.', 'Watching videos at night is bad for health.'], a: 2, exp: '第三段 "a gap between present and future preferences"。' },
        { q: 'What can we learn from the experiment mentioned in Paragraph 4?', opts: ['Users dislike being asked about their feelings.', 'Satisfaction and engagement always move together.', 'The company valued engagement over satisfaction.', 'Weekly surveys reduce time spent online.'], a: 2, exp: '"The experiment was quietly dropped, a decision that tells us more about the business model"：满意度升了却被放弃，说明公司更看重 engagement。' },
        { q: 'What does the author imply in the last paragraph?', opts: ['Regulation will soon solve the problem.', 'Users still have the power to change things.', 'Paid services will replace free platforms.', 'Most people will never change their habits.'], a: 1, exp: '末句 "the algorithm ... still needs us to open the app" 强调用户的主动权。' },
      ],
    },
  ],
};

const WRITING = [
  {
    id: 'w1', title: '议论文 · Why do people choose to live in big cities?',
    prompt: 'Directions: For this part, you are allowed 30 minutes to write an essay on why people choose to live in big cities despite the high cost. You should write at least 150 words but no more than 200 words.',
    outline: ['第一段：现象 + 观点（尽管成本高，大城市仍吸引人）', '第二段：理由一 机会多（工作、教育）+ 例子；理由二 资源与便利（医疗、文化、交通）', '第三段：承认代价，重申选择合理，建议理性权衡'],
    sample: `Nowadays, an increasing number of young people are flocking to big cities such as Beijing and Shanghai, even though rent and living costs there are notoriously high. Why are they willing to pay such a price? From my perspective, the answer lies in opportunity and convenience.

To begin with, big cities offer opportunities that smaller places simply cannot match. Leading companies, top universities and research institutions are concentrated there, which means more jobs, higher salaries and faster career growth. A graduate in a metropolis may receive several interview invitations within a week, whereas his counterpart in a small town might wait for months. What is more, the quality of public resources is remarkably higher. The best hospitals, museums, concert halls and subway networks are located in large cities, making daily life not only more convenient but also richer in experience.

Admittedly, the cost of urban living is a heavy burden, and the pressure can be exhausting. Nevertheless, for most people the benefits still outweigh the drawbacks. Only by weighing both sides carefully can we decide where to build our future.`,
    notes: ['首段用 "From my perspective, the answer lies in ..." 直接给观点。', '两个理由各配一个具体对比（graduate vs counterpart），比空喊 "more opportunities" 有说服力。', '末段 "Admittedly ... Nevertheless ..." 让步 + 转折，最后倒装句收尾。', '全文 198 词。'],
  },
  {
    id: 'w2', title: '名言类 · "Beauty of the soul is the essential beauty."',
    prompt: 'Directions: Write an essay commenting on the saying "Beauty of the soul is the essential beauty." You can cite examples to illustrate your point. 150–200 words.',
    outline: ['第一段：解释名言含义，表明赞同', '第二段：论证——外在美短暂，内在美持久；举例（如志愿者、普通人的善举）', '第三段：呼吁重视修养而非只关注外表'],
    sample: `The saying "Beauty of the soul is the essential beauty" conveys a profound message: what truly makes a person beautiful is not appearance but character. I could not agree more with this view.

There is no denying that physical beauty is pleasant, but it is also fragile. Youth fades, fashions change, and even the most striking face is forgotten once the person leaves the room. Beauty of the soul, by contrast, grows stronger with time. Consider the volunteers who spent months in flooded villages last summer, carrying supplies through knee-deep water. Few of them would appear in a fashion magazine, yet nobody who saw them would deny that they were beautiful. It was their kindness, courage and sense of responsibility that moved people, and such qualities leave a far deeper impression than any face.

Therefore, instead of spending hours in front of the mirror, we should devote more effort to cultivating honesty, compassion and integrity. Only when we are beautiful inside can we be truly admired by others.`,
    notes: ['开头 "conveys a profound message: ..." 是名言题的标准起手。', '对比论证：外在 fragile vs 内在 grows stronger，再举一个具体例子。', '强调句 "It was their kindness ... that moved people" 提分。', '全文 182 词。'],
  },
  {
    id: 'w3', title: '应用文 · 写一封建议信',
    prompt: 'Directions: Suppose your university is planning to improve its library services. Write a letter to the library director offering your suggestions. 150–200 words. Do not sign your own name; use "Li Ming" instead.',
    outline: ['称呼 Dear Sir or Madam / Dear Mr. Director', '第一段：自我介绍 + 写信目的', '第二段：两到三条建议，每条一句理由', '第三段：感谢 + 期待回复；落款 Yours sincerely, Li Ming'],
    sample: `Dear Sir or Madam,

I am a junior majoring in English, and I am writing to offer some suggestions regarding the library services, which I use almost every day.

First of all, I would suggest extending the opening hours during the examination period. At present the library closes at ten, but many students are only beginning their most productive hours at that time. Keeping even one reading room open until midnight would be a great help. Secondly, the online reservation system for study rooms could be improved. Rooms are frequently booked but left empty, so introducing a simple check-in rule, under which a reservation is cancelled if nobody arrives within fifteen minutes, would make better use of the space. Finally, it would be worthwhile to add more power sockets in the reading areas, since most of us now rely on laptops for research.

I believe these changes would benefit a large number of students at little cost. Thank you for taking the time to consider my suggestions, and I look forward to your reply.

Yours sincerely,
Li Ming`,
    notes: ['格式分：称呼、落款、分段缺一不可。', '建议用 "I would suggest doing / it would be worthwhile to do" 这种委婉语气。', '每条建议后面跟一句 since / because 理由，字数自然就够。', '正文 176 词。'],
  },
];

const TRANSLATION = [
  {
    id: 't1', title: '中国茶文化', theme: '文化',
    zh: '茶是中国人日常生活中不可缺少的饮品。中国是茶的故乡，饮茶的历史可以追溯到三千多年前。茶不仅是一种饮料，更承载着丰富的文化内涵。古代文人常常以茶会友，吟诗作画。唐代的陆羽撰写了世界上第一部茶学专著《茶经》，对后世影响深远。如今，茶馆遍布中国的大街小巷，成为人们休闲交流的重要场所。目前，中国的茶叶产量和茶园面积均居世界首位。随着中国与世界交往的加深，茶文化也传播到了世界各地，越来越多的外国人开始了解并喜爱中国茶。',
    en: `Tea is an indispensable drink in the daily life of the Chinese people. China is the homeland of tea, and the history of tea drinking can be traced back more than three thousand years. Tea is not merely a beverage; it also carries rich cultural connotations. In ancient times, scholars often gathered over tea to compose poems and paint. In the Tang Dynasty, Lu Yu wrote The Classic of Tea, the world's first book devoted to tea, which had a profound influence on later generations. Today, teahouses can be found in streets and lanes across China and have become important places for people to relax and socialize. At present, China ranks first in the world in both tea output and the area of its tea plantations. As China's exchanges with the rest of the world deepen, tea culture has spread to every corner of the globe, and an increasing number of foreigners are beginning to understand and love Chinese tea.`,
    keys: ['不可缺少的 indispensable / essential', '追溯到 be traced back to', '承载文化内涵 carry cultural connotations', '以茶会友 gather over tea（直译 make friends through tea 也可）', '遍布大街小巷 can be found in streets and lanes / everywhere', '随着……加深 as ... deepen(s)', '唐代 the Tang Dynasty', '《茶经》 The Classic of Tea', '对后世影响深远 have a profound influence on later generations', '居世界首位 rank first in the world'],
    notes: ['"不仅……更……"用 not merely ... ; it also ... 拆成两个分句最稳。', '"古代文人"译 scholars in ancient times 即可，不必纠结 literati。', '最后一句很长，按逗号拆成两个并列句，用 and 连接。'],
  },
  {
    id: 't2', title: '高铁', theme: '经济社会',
    zh: '近年来，中国高速铁路发展迅速，已建成世界上规模最大、运营速度最快的高铁网络。2008 年，中国第一条时速达三百五十公里的高铁京津城际铁路开通运营。截至 2023 年底，全国高铁运营里程已超过四万五千公里。高铁的出现极大地缩短了城市之间的时空距离，使得"一日生活圈"成为可能。它不仅方便了人们的出行，也促进了区域经济的协调发展。许多游客选择乘坐高铁旅行，因为它准时、舒适且环保。预计到 2035 年，中国高铁运营里程将进一步增加，连接更多的中小城市。',
    en: `In recent years, China's high-speed railway has developed rapidly, and the country has built the world's largest high-speed rail network with the fastest operating speed. In 2008, China's first high-speed line with a speed of 350 kilometers per hour, the Beijing-Tianjin Intercity Railway, was put into operation. By the end of 2023, the country's high-speed rail lines in operation had exceeded 45,000 kilometers. The emergence of high-speed rail has greatly shortened the travel time between cities, making a "one-day living circle" possible. It has not only made travel more convenient for people but also promoted the coordinated development of regional economies. Many tourists choose to travel by high-speed rail because it is punctual, comfortable and environmentally friendly. It is estimated that by 2035, the operating mileage of China's high-speed railway will increase further, connecting more small and medium-sized cities.`,
    keys: ['高速铁路 high-speed railway / rail', '规模最大 the largest in scale', '缩短时空距离 shorten the travel time / the distance between', '协调发展 coordinated development', '准时、舒适、环保 punctual, comfortable and environmentally friendly', '预计 it is estimated / expected that', '运营里程 operating mileage', '开通运营 be put into operation / open to traffic', '截至……底 by the end of ...', '城际铁路 intercity railway'],
    notes: ['"已建成……网络"主语换成 the country，避免 "China\'s railway has built" 这种主语错位。', '"使得……成为可能"用 making ... possible 分词结构挂在主句后。', '"预计到 2035 年"固定句型 It is estimated that by 2035, ...'],
  },
  {
    id: 't3', title: '垃圾分类', theme: '社会',
    zh: '随着城市化进程的加快，中国许多城市面临着垃圾处理的巨大压力。早在 2000 年，北京、上海等八个城市就被确定为首批垃圾分类试点城市。为了改善环境，政府开始在全国推行垃圾分类制度，2019 年上海率先实行强制性垃圾分类。居民需要将垃圾分为可回收物、厨余垃圾、有害垃圾和其他垃圾四类。起初，不少人觉得这样做很麻烦，但经过宣传和教育，越来越多的人认识到垃圾分类的重要性。如今，垃圾分类已逐渐成为一种生活习惯，为建设美丽中国作出了贡献。',
    en: `With the acceleration of urbanization, many cities in China are facing enormous pressure in waste disposal. As early as 2000, eight cities, including Beijing and Shanghai, were selected as the first pilot cities for garbage sorting. In order to improve the environment, the government has begun to promote a garbage sorting system across the country, and in 2019 Shanghai took the lead in making garbage sorting mandatory. Residents are required to sort their garbage into four categories: recyclables, kitchen waste, hazardous waste and other waste. At first, many people found it troublesome, but through publicity and education, more and more people have come to realize the importance of garbage sorting. Today, sorting garbage has gradually become a daily habit, contributing to the building of a beautiful China.`,
    keys: ['城市化进程加快 the acceleration of urbanization', '垃圾处理 waste disposal', '推行……制度 promote / implement a ... system', '可回收物 recyclables', '厨余垃圾 kitchen waste', '有害垃圾 hazardous waste', '认识到……重要性 come to realize the importance of', '作出贡献 contribute to', '试点城市 pilot city', '首批 the first batch / the first group of', '率先 take the lead in', '强制性 mandatory / compulsory'],
    notes: ['"居民需要……"译成被动 are required to 更地道。', '四类垃圾用冒号列举，专有名词不会写就用解释：waste that can be recycled。', '最后一句"为……作出贡献"用 contributing to 分词收尾。'],
  },
];
