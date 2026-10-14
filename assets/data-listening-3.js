/* 扩展题库第 3 批：listening（追加到同名数组） */
LISTENING.push(
  {
    id: 'lc5', type: 'conv', title: '长对话 · 活动策划岗位面试', minutes: 3,
    script: `M: Good morning, Ms. Carter. Thanks for coming in.
W: Thank you. I'm glad to finally meet you in person after our phone call last week.
M: Likewise. So, you've applied for the event coordinator position. Your resume says you've been working at a hotel for the past three years. Why do you want to leave?
W: I've learned a lot there, especially about handling guests when things go wrong. But the hotel mostly hosts the same kind of business conferences over and over. I'm looking for a role where I can plan events from the very first idea, not just manage the rooms and the catering.
M: I see. Our events are quite varied. One week it's a charity concert, the next it's a food festival for five thousand people. Can you give me an example of a time you dealt with a serious problem under pressure?
W: Sure. Last spring, two hours before a wedding reception, the kitchen lost power. The chef was panicking. I called a restaurant nearby that we had worked with before, arranged for them to cook the main course, and had our own staff serve it as if nothing had happened. Most of the guests never knew.
M: Impressive. And how did the couple react?
W: They actually sent us a thank you letter, and they've booked their anniversary dinner with us.
M: That's the kind of thinking we need. Now, I should mention that this job involves a fair amount of travel, maybe one week in every month. Would that be an issue?
W: Not at all. In fact, it's one of the things that attracted me. My only concern is the weekends. I understand most events happen on Saturdays and Sundays.
M: They do, but we give coordinators two weekdays off to make up for it.
W: That sounds fair.
M: Do you have any questions for me?
W: Yes. What would you say is the biggest challenge for someone new in this role?
M: Honestly, it's learning to say no. Clients always want more than their budget allows, and new coordinators tend to promise everything. The best people are polite but firm.
W: That's really useful to know. I'll admit that saying no to people is something I still need to work on.
M: I appreciate your honesty. We'll be making a decision by the end of next week.`,
    questions: [
      { q: "Why does the woman want to leave her current job?", opts: ["She finds dealing with hotel guests stressful.", "She wants to plan events from the beginning.", "She is not satisfied with her salary.", "She wants to work fewer hours each week."], a: 1, exp: "原文 “I'm looking for a role where I can plan events from the very first idea”，from the very first idea 改写为 from the beginning；A 与她说从处理客人中学到很多相反。" },
      { q: "What did the woman do when the kitchen lost power?", opts: ["She moved the reception to another hotel.", "She asked the chef to cook on a gas stove.", "She had a nearby restaurant prepare the main course.", "She explained the problem to the guests and apologized."], a: 2, exp: "“I called a restaurant nearby ... arranged for them to cook the main course”，C 为同义改写；D 与 “Most of the guests never knew” 矛盾。" },
      { q: "What does the man say about working on weekends?", opts: ["Coordinators get two days off during the week in return.", "Coordinators are paid extra for weekend events.", "Only senior staff have to work at weekends.", "Weekend work is limited to one week a month."], a: 0, exp: "“we give coordinators two weekdays off to make up for it”，make up for it 对应 in return；D 把“每月出差一周”张冠李戴。" },
      { q: "What does the woman admit at the end of the interview?", opts: ["She has little experience with large festivals.", "She dislikes traveling for work.", "She is applying for other jobs as well.", "She needs to get better at refusing requests."], a: 3, exp: "“saying no to people is something I still need to work on”，saying no 改写为 refusing requests，work on 对应 get better at；B 与 “Not at all” 相反。" },
    ],
  },
  {
    id: 'lc6', type: 'conv', title: '长对话 · 留学项目咨询', minutes: 3,
    script: `W: Hi, I have an appointment with the study abroad office. My name is Lucy Chen.
M: Hi Lucy, I'm Mark. Come on in. You said in your email that you're trying to decide between two programs?
W: Yes. One is a semester in Edinburgh, and the other is a full year in Seoul. I'm majoring in international business, and both have courses that would count toward my degree.
M: Both are strong programs. Let's start with the practical side. Have you thought about the cost?
W: That's my main worry. The Seoul program lasts a whole year, so I assumed it would be much more expensive.
M: Actually, that's a common misunderstanding. Living costs in Seoul are lower than in Edinburgh, and the Seoul program comes with a partial scholarship for students who take Korean language classes. When you add it all up, the year in Seoul costs only slightly more than the semester in Edinburgh.
W: Really? I had no idea. But I don't speak any Korean at all.
M: You wouldn't need to. The business courses there are taught in English. The language classes are an extra, and they start from the beginner level. Many of our students say the language turned out to be the most valuable part of the year.
W: My other concern is graduating on time. If I'm away for a whole year, will I fall behind?
M: Let me check your record. You've already completed most of your required courses, so as long as you take two approved business courses each semester abroad, you'll graduate with your class.
W: That's a relief. What about internships? My parents keep telling me that an internship matters more than studying abroad.
M: Here's something your parents might like. The Seoul program includes a summer placement with a local company. Students work there for eight weeks, and some have even received job offers afterward.
W: That would definitely help me convince them. Is there a deadline I should know about?
M: Yes. Applications for next fall close on March first, and you'll need two letters of recommendation. I'd suggest asking your professors now, since they get very busy around that time.
W: OK. I think I'm leaning toward Seoul. I'll talk it over with my parents this weekend and then start on the application.`,
    questions: [
      { q: "What was Lucy's main worry at first?", opts: ["How much the programs would cost.", "Whether she could get a scholarship.", "Which program had better teachers.", "How far each city was from home."], a: 0, exp: "被问到 cost 时她说 “That's my main worry”；B 中奖学金是男士后来提到的信息，并非她的担忧。" },
      { q: "What does the man say about the program in Seoul?", opts: ["Students must already know some Korean.", "It costs far more than the Edinburgh program.", "Its total cost is close to that of the Edinburgh program.", "Its courses cannot count toward a business degree."], a: 2, exp: "“the year in Seoul costs only slightly more than the semester in Edinburgh”，only slightly more 改写为 close to；B 正是男士纠正的误解。" },
      { q: "What must Lucy do in order to graduate on time?", opts: ["Finish her required courses before leaving.", "Take two approved business courses each semester.", "Complete an internship during the summer.", "Return before the end of the spring semester."], a: 1, exp: "“as long as you take two approved business courses each semester abroad, you'll graduate with your class”；A 是她已经基本完成的事，不是条件。" },
      { q: "What will Lucy probably do next?", opts: ["Apply to both programs at the same time.", "Ask the man to write her a recommendation letter.", "Look for an internship in her hometown.", "Discuss the Seoul program with her parents."], a: 3, exp: "结尾 “I'm leaning toward Seoul. I'll talk it over with my parents this weekend”，talk it over 对应 discuss；推荐信应找 professors，不是男士。" },
    ],
  },
  {
    id: 'lc7', type: 'conv', title: '长对话 · 室友之间的矛盾', minutes: 3,
    script: `M: Hey, Emma, do you have a minute? There's something I've been meaning to talk to you about.
W: Sure, Josh. What's up? You sound serious.
M: It's about the kitchen. I don't want to make a big deal out of it, but the dishes have been piling up in the sink for days. Last night I wanted to cook dinner and there wasn't a single clean pan.
W: Oh. I know, I'm sorry. I've had three exams this week and I've basically been living on instant noodles. I kept telling myself I'd wash everything on the weekend.
M: I understand you're busy, but so am I. And it's not just this week. The same thing happened last month, too.
W: That's fair. But can I bring something up as well, since we're talking?
M: Of course. Go ahead.
W: It's your friends. They come over almost every night and stay until after midnight. My room is right next to the living room, and I can hear every word. I've had real trouble sleeping before my exams.
M: Really? Why didn't you say something earlier? I had no idea it was that loud.
W: I didn't want to seem unfriendly. They're nice people. I just need some quiet on weeknights.
M: OK, now I feel bad. How about this? From Sunday to Thursday, my friends leave by ten. On Friday and Saturday, we can be more flexible.
W: That would make a huge difference. And for the dishes, what if we make a simple rule? Whoever cooks washes up the same day. No exceptions.
M: Sounds good to me. Maybe we could also put a chart on the fridge for the bigger chores, like cleaning the bathroom and taking out the trash. We could switch every week.
W: I like that. Honestly, I was worried this conversation would turn into a big fight.
M: Me too. I almost sent you a text message instead, but I thought it was better to talk face to face.
W: I'm glad you did. Actually, let me go and wash those pans right now.
M: I'll help you dry them. And let's check in again at the end of the month to see how the new system is working.`,
    questions: [
      { q: "What problem does the man raise first?", opts: ["The woman often cooks late at night.", "Dirty dishes have been left in the sink.", "The woman's friends are too noisy.", "The kitchen equipment is broken."], a: 1, exp: "开头 “the dishes have been piling up in the sink for days”，piling up 改写为 have been left；C 把噪音问题的主体弄反了，是男士的朋友吵。" },
      { q: "Why didn't the woman complain about the noise earlier?", opts: ["She thought the man already knew about it.", "She was too busy with her exams.", "She did not want to appear unfriendly.", "She was planning to move out soon."], a: 2, exp: "“I didn't want to seem unfriendly”，seem 改写为 appear；B 中考试是她洗碗拖延的理由，不是没提噪音的理由。" },
      { q: "What do the speakers agree about the man's friends?", opts: ["They will leave by ten on weeknights.", "They will no longer visit the apartment.", "They will only come over on weekends.", "They will stay in the man's room."], a: 0, exp: "“From Sunday to Thursday, my friends leave by ten”，Sunday to Thursday 即 weeknights；C 说只在周末来，改变了约定内容。" },
      { q: "How do the speakers probably feel at the end of the conversation?", opts: ["Annoyed that nothing was really settled.", "Worried that they will argue again.", "Embarrassed about their earlier behavior.", "Relieved that they solved things calmly."], a: 3, exp: "女士说 “I was worried this conversation would turn into a big fight”，男士附和后两人一起去洗锅、约定月底复盘，可见因平和解决而松了口气；B 是谈话前的担心。" },
    ],
  },
  {
    id: 'lc8', type: 'conv', title: '长对话 · 电台访谈桌游咖啡馆店主', minutes: 3,
    script: `W: Good afternoon, and welcome to Local Voices. Today I'm joined by Sam Patel, who opened a board game cafe on Main Street two years ago. Sam, thanks for being here.
M: Thanks for having me.
W: For listeners who haven't visited, what exactly is a board game cafe?
M: Basically, it's a cafe where you pay a small table fee, about five dollars per person, and then you can play any of the four hundred games on our shelves for as long as you like. We also serve coffee, sandwiches, and snacks.
W: Before this, you worked as an accountant, right? What made you change careers?
M: Yes, for nearly ten years. The job was stable, but I spent all day looking at screens. On weekends my friends and I would play board games, and I noticed how differently people behaved. They laughed, they argued, they actually looked at each other. I thought, there must be other people who want that.
W: Was it hard to get started?
M: Very. The banks weren't interested in lending money to someone with no restaurant experience. In the end I borrowed from my family and sold my car. The first six months were tough. Some days we had fewer than ten customers.
W: So what turned things around?
M: Two things. First, we hired what we call game guides, staff members who teach the rules so customers don't have to read a thick instruction booklet. That made a big difference for beginners. Second, local schools and companies started booking us for team events. Now those bookings make up about a third of our income.
W: Interesting. Who are your typical customers?
M: That's what surprised me most. I expected mainly college students, but we get families, retired couples, even people on first dates. A board game takes the pressure off conversation.
W: What's next for the cafe?
M: People keep asking me to open a second location. But to be honest, I'd rather do one place well. My plan is to expand into the empty shop next door and add a quiet room for longer strategy games.
W: Sam Patel, thank you so much, and good luck.`,
    questions: [
      { q: "Why did Sam give up his job as an accountant?", opts: ["He wanted a place where people interact face to face.", "He was offered a job at a restaurant.", "He wanted to design his own board games.", "He was tired of working on weekends."], a: 0, exp: "他提到整天看屏幕，而玩桌游时 “they actually looked at each other ... there must be other people who want that”，即面对面交流；D 与原文不符，周末是他玩桌游的时间。" },
      { q: "How did Sam pay for opening the cafe?", opts: ["He got a loan from a local bank.", "He used money from family and sold his car.", "He found a business partner.", "He saved money from his accounting job."], a: 1, exp: "“I borrowed from my family and sold my car”；A 正好相反，银行不愿放贷。" },
      { q: "According to Sam, what helped turn his business around?", opts: ["Lowering the table fee for students.", "Adding a full dinner menu.", "Having staff explain game rules to customers.", "Advertising on local radio stations."], a: 2, exp: "“we hired what we call game guides, staff members who teach the rules”，teach the rules 改写为 explain game rules；其余选项均未提及。" },
      { q: "What does Sam plan to do in the future?", opts: ["Open a second cafe in another area.", "Sell the cafe to a larger company.", "Focus on college students as customers.", "Make his current cafe larger."], a: 3, exp: "“I'd rather do one place well ... expand into the empty shop next door”，expand 对应 make larger；A 是别人的建议，他明确不打算这样做。" },
    ],
  },
  {
    id: 'lp5', type: 'passage', title: '听力篇章 · 光污染与野生动物', minutes: 3,
    script: `For most of history, nights on Earth were dark. Today, more than eighty percent of the world's population lives under skies polluted by artificial light, and scientists are discovering that the glow from our streets and buildings is causing serious problems for wildlife.

Migrating birds are among the most affected. Many species travel at night and use the stars to find their way. When they fly over brightly lit cities, they become confused and circle buildings until they are exhausted, or they crash into windows. In one American city, volunteers collected more than a thousand dead birds beneath a single office tower over the course of one autumn.

Insects suffer too. A streetlight can attract moths from hundreds of meters away, and many of them die from exhaustion or are eaten before morning. Because moths pollinate plants at night, this matters for plants as well. One European study found that fields near streetlights received about sixty percent fewer visits from nighttime pollinators, and the plants there produced less fruit.

The good news is that light pollution is one of the easiest environmental problems to fix. Unlike plastic in the ocean, it disappears the moment we turn the lights off. Several cities now dim office towers during migration seasons. Others have replaced white streetlights with warmer amber lights, which attract far fewer insects, and fitted shields so that light points down at the road instead of up into the sky.

Experts say individuals can help as well, by closing their curtains at night and switching off outdoor lights that are not really needed.`,
    questions: [
      { q: "Why do migrating birds have trouble flying over cities at night?", opts: ["They cannot find enough food there.", "City noise frightens them away.", "Bright lights confuse their sense of direction.", "Tall buildings block the wind they rely on."], a: 2, exp: "“use the stars to find their way. When they fly over brightly lit cities, they become confused”，find their way 对应 sense of direction。" },
      { q: "What did the European study find about plants near streetlights?", opts: ["They grew taller than other plants.", "They produced less fruit.", "They attracted more moths during the day.", "They flowered earlier in the year."], a: 1, exp: "“the plants there produced less fruit”，原词复现；C 把夜间传粉者改成白天，且方向错误。" },
      { q: "Why does the speaker say light pollution is relatively easy to deal with?", opts: ["Its effects stop as soon as lights are turned off.", "Most people are already aware of the problem.", "New lights are cheaper than old ones.", "It affects only a small number of species."], a: 0, exp: "“it disappears the moment we turn the lights off”，disappears the moment 改写为 stop as soon as；其余选项未提及。" },
    ],
  },
  {
    id: 'lp6', type: 'passage', title: '听力篇章 · 刷卡为何让人花更多', minutes: 3,
    script: `Have you ever noticed that it feels easier to spend money with a card than with cash? Psychologists have a name for the uncomfortable feeling we get when we hand over money. They call it the pain of paying, and research suggests that the way we pay changes how strongly we feel it.

In one experiment, students were asked how much they would offer for tickets to a sold out concert. Half were told they would have to pay in cash, and half by credit card. The card group offered, on average, about twice as much. Other studies have found that shoppers who pay by card tend to buy more items and are more likely to pick up unhealthy snacks at the checkout.

Why does this happen? When we count out bills, we see our money physically leaving us, and that loss feels real. A card, by contrast, separates the pleasure of buying from the pain of paying, especially when the bill arrives weeks later. Phone payments and one click online shopping make the separation even greater, because there is almost no effort involved at all.

Businesses understand this well. That is why many hotels, theme parks, and cruise ships let guests pay with wristbands or room charges instead of money. Customers stop thinking about prices and simply enjoy themselves.

This does not mean we should all go back to cash. But experts suggest a few simple habits. Check your spending every day, rather than once a month. Remove saved card details from shopping websites, so that each purchase takes a little more effort. And before buying something expensive, imagine paying for it in cash. If that feels painful, it may be a sign to wait.`,
    questions: [
      { q: "What did the experiment with concert tickets show?", opts: ["Students preferred paying in cash.", "Students paying by card were willing to pay more.", "Most students could not afford the tickets.", "Card users regretted their purchases later."], a: 1, exp: "“The card group offered, on average, about twice as much”，twice as much 改写为 willing to pay more。" },
      { q: "According to the passage, why does paying by card feel less painful?", opts: ["It separates buying from the act of paying.", "Card users usually have more money.", "Banks offer rewards for card payments.", "Prices are lower when paying by card."], a: 0, exp: "“A card ... separates the pleasure of buying from the pain of paying”，A 为同义改写；B、C、D 均未提及。" },
      { q: "Why do some hotels and theme parks use wristbands or room charges?", opts: ["To reduce the risk of theft.", "To speed up lines at the checkout.", "To make guests less aware of prices.", "To collect data about their customers."], a: 2, exp: "“Customers stop thinking about prices and simply enjoy themselves”，stop thinking about prices 改写为 less aware of prices。" },
      { q: "Which habit do experts recommend?", opts: ["Using only cash for everyday purchases.", "Checking spending once at the end of each month.", "Paying for expensive items by phone.", "Making online purchases slightly less convenient."], a: 3, exp: "“Remove saved card details ... so that each purchase takes a little more effort”，D 为改写；A 与 “This does not mean we should all go back to cash” 相反；B 把 every day 改成了 once a month。" },
    ],
  },
  {
    id: 'lp7', type: 'passage', title: '听力篇章 · 成人学外语真的更难吗', minutes: 3,
    script: `It is widely believed that children are better language learners than adults. Watch a family move to a new country, and within a year the children are chatting with the neighbors while their parents still struggle to order a meal. But researchers say the full picture is more complicated.

In the early stages, adults actually learn faster. Studies comparing learners of different ages have found that in the first few months, adults and teenagers pick up grammar and vocabulary more quickly than young children. Adults can use their reading skills, memorize word lists, and understand explanations of grammar rules, while a six year old cannot.

Where children have a clear advantage is in the long run, especially in pronunciation. People who start a language before the age of about ten are far more likely to end up sounding like native speakers. Those who start later often keep a noticeable accent, even after decades of use.

However, part of the children's advantage may have little to do with their brains. Children who move abroad usually go to school, where they spend hours each day surrounded by the new language and are pushed to make friends. Adults, on the other hand, often work with people who share their first language and go home to speak it with their families. Children are also less embarrassed about making mistakes.

For adult learners, then, the message is encouraging. Age is not the barrier that many people assume. What matters more is how much time you spend actually using the language, and your willingness to sound foolish while you do it.`,
    questions: [
      { q: "What do studies show about the first few months of learning?", opts: ["Young children learn grammar fastest.", "Learners of all ages progress at the same speed.", "Adults make faster progress than young children.", "Teenagers learn more slowly than adults."], a: 2, exp: "“in the early stages, adults actually learn faster ... more quickly than young children”；A 与之相反，D 把成人和青少年的关系改了，二者都快于幼儿。" },
      { q: "In what area do early starters have a lasting advantage?", opts: ["Pronunciation.", "Vocabulary size.", "Reading speed.", "Knowledge of grammar rules."], a: 0, exp: "“a clear advantage is in the long run, especially in pronunciation”，in the long run 对应 lasting。" },
      { q: "What is the speaker's message to adult learners?", opts: ["They should start learning as young as possible.", "They should avoid making mistakes in public.", "They should focus on memorizing word lists.", "Using the language often matters more than age."], a: 3, exp: "结尾 “Age is not the barrier ... What matters more is how much time you spend actually using the language”；B 与 willingness to sound foolish 相反。" },
    ],
  },
  {
    id: 'lp8', type: 'passage', title: '听力篇章 · 运动前该不该拉伸', minutes: 3,
    script: `For decades, coaches told athletes to stretch before exercise. Many of us still begin a run by reaching down to touch our toes and holding the position for thirty seconds. Yet sports scientists now say this familiar routine may do more harm than good.

The kind of stretching most people do is called static stretching, in which you hold a muscle in a lengthened position without moving. A large review of more than one hundred studies found that holding a stretch for over a minute before exercise made muscles temporarily weaker and slower. Sprinters who stretched this way ran slightly slower times, and jumpers did not jump as high. The effect was small, but in competitive sport, small differences decide who wins.

What about injuries? Here the evidence is surprising. In one study of more than a thousand army recruits, half stretched before training and half did not. After twelve weeks, injury rates in the two groups were almost exactly the same.

So what should we do instead? Experts recommend what is called a dynamic warm up. This means moving the body through the motions of the activity, at a gradually increasing speed. Before a run, for example, you might walk briskly, then jog gently, then do some leg swings. This raises body temperature and prepares the muscles without weakening them.

Static stretching is not useless, however. Done after exercise, or as a separate session, it is an effective way to improve flexibility over time. The point is simply that timing matters. Save the long stretches for when your workout is over.`,
    questions: [
      { q: "What did the review of over one hundred studies find?", opts: ["Long stretches before exercise weaken muscles for a while.", "Stretching helps sprinters run faster.", "Most athletes stretch for too short a time.", "Short stretches cause more injuries than long ones."], a: 0, exp: "“holding a stretch for over a minute before exercise made muscles temporarily weaker and slower”，temporarily 改写为 for a while；B 与 ran slightly slower times 相反。" },
      { q: "What did the study of army recruits show?", opts: ["Recruits who stretched were injured less often.", "Stretching before training did not reduce injuries.", "Recruits who did not stretch felt more tired.", "Injuries were mainly caused by running."], a: 1, exp: "“injury rates in the two groups were almost exactly the same”，即拉伸没有降低受伤率；A 是人们的传统认知。" },
      { q: "What does a dynamic warm up involve?", opts: ["Holding each muscle still for a minute.", "Resting completely before a race.", "Repeating the movements of the activity at rising speed.", "Lifting light weights to build strength."], a: 2, exp: "“moving the body through the motions of the activity, at a gradually increasing speed”，C 为同义改写；A 描述的是 static stretching。" },
      { q: "What does the speaker suggest about static stretching?", opts: ["It should be avoided completely.", "It works best right before a competition.", "It is useful only for professional athletes.", "It should be done after a workout."], a: 3, exp: "结尾 “Save the long stretches for when your workout is over”；A 与 “Static stretching is not useless” 相反。" },
    ],
  },
  {
    id: 'll7', type: 'lecture', title: '讲座 · 多任务处理的隐性代价', minutes: 4,
    script: `Good morning, everyone. Today I want to talk about something almost all of you did before this class started, and probably during it as well. I mean multitasking. Many students believe they can listen to a lecture, answer messages, and browse social media at the same time without missing anything. Cognitive science tells a different story.

Let's start with what is actually happening in the brain. For most tasks that require attention, we cannot truly do two things at once. Instead, the brain switches rapidly between them, and each switch has a cost. You have to drop one set of rules, remember where you were in the other task, and start again. Researchers call this the switch cost. Individually, these costs are tiny, often less than a second. But when you switch dozens of times an hour, they add up. Some estimates suggest that heavy switching can reduce productive time by as much as forty percent.

There is also a cost to accuracy. In one common type of experiment, participants sort numbers and letters according to a rule. When the rule stays the same, people are fast and make few errors. When they must change rules every few trials, both their speed and their accuracy drop noticeably.

Now, here is the part many of you will find surprising. Researchers at one American university compared people who multitask heavily in daily life with people who rarely do. You might expect the heavy multitaskers to be better at it, since they get so much practice. In fact, they performed worse. They were more easily distracted by irrelevant information, and they were slower to switch between tasks. One explanation is that constant multitasking trains the brain to respond to every new input, even unimportant ones.

There are exceptions. If one task is completely automatic, like walking, you can combine it with something else, such as talking, without much loss. The problem arises when both tasks require conscious thought.

So what can you do? My advice is to work in focused blocks. Choose a period, say twenty five minutes, during which you do just one thing, and put your phone in another room, not just face down on the desk. Then take a short break before starting the next block. You will likely find that you finish the same work in far less time. And yes, that includes listening to me for the next forty minutes.`,
    questions: [
      { q: "What is the lecture mainly about?", opts: ["How social media affects students' grades.", "The hidden costs of switching between tasks.", "Ways to improve memory before exams.", "Why some people are born good at multitasking."], a: 1, exp: "讲座从 “switch cost” 入手，讲时间、准确率及重度多任务者的代价，B 概括主题；D 与研究结论相反。" },
      { q: "What happens when participants have to change rules frequently?", opts: ["They become slower and less accurate.", "They quickly get used to the new rules.", "They become faster but make more errors.", "They lose interest in the task."], a: 0, exp: "“When they must change rules every few trials, both their speed and their accuracy drop noticeably”；C 只改对了一半，速度也下降。" },
      { q: "What did the research on heavy multitaskers find?", opts: ["They were better at switching due to practice.", "They remembered information more accurately.", "They were more easily distracted than others.", "They preferred to work on automatic tasks."], a: 2, exp: "“they performed worse. They were more easily distracted by irrelevant information”；A 是 “You might expect” 的预期，被 In fact 否定。" },
      { q: "What does the speaker advise students to do?", opts: ["Keep their phones face down while studying.", "Combine studying with light physical activity.", "Take a long break after every lecture.", "Concentrate on a single task for a set period."], a: 3, exp: "“work in focused blocks ... during which you do just one thing”，D 为改写；A 正是讲者说 “not just face down on the desk” 所否定的做法。" },
    ],
  },
  {
    id: 'll8', type: 'lecture', title: '讲座 · 默认选项的力量', minutes: 4,
    script: `Today's topic in our behavioral economics series is one of the simplest and most powerful ideas in the field, the default option. A default is what happens if you make no active choice. And it turns out that defaults shape our decisions far more than traditional economics would predict.

Traditional economic models assume that people weigh costs and benefits and pick the option that serves them best. Under that assumption, it should not matter much which option is selected in advance, because a rational person would simply switch if another option were better. Yet the evidence says otherwise.

Consider retirement savings. At many companies, employees used to have to fill out a form to join the company savings plan. Participation rates were often below half. When some companies changed the rules so that new employees were enrolled automatically but could leave at any time, participation jumped to around ninety percent. Nothing else had changed. Not the money, not the benefits, only the default.

We see the same pattern elsewhere. Countries where citizens are organ donors unless they choose not to be have far higher donor rates than countries where people must sign up. Even something as small as the default setting on office thermostats, set one degree lower in winter, reduced energy use without many complaints.

Why are defaults so powerful? Economists point to three reasons. The first is effort. Changing an option requires time and attention, so people put it off. The second is that people often see the default as a recommendation, assuming someone has chosen it for a good reason. The third is that we tend to fear losses more than we value gains, so giving up the default feels like losing something.

Of course, this power can be misused. Some companies make free trials turn into paid subscriptions automatically, knowing that many customers will forget to cancel. So my message today has two parts. If you ever design systems, whether for a business or a government, choose defaults that genuinely serve people's interests. And as consumers, take a moment to examine the options that have already been chosen for you. Not choosing is still a choice.`,
    questions: [
      { q: "What is the lecture mainly about?", opts: ["How preset options influence people's decisions.", "Why people fail to save enough for retirement.", "How companies design their benefit plans.", "Why traditional economic models are always wrong."], a: 0, exp: "开场点题 “the default option ... defaults shape our decisions far more than traditional economics would predict”，preset options 对应 default；B、C 只是例子。" },
      { q: "What happened when companies enrolled new employees automatically?", opts: ["Many employees complained about the change.", "The companies had to offer more benefits.", "Participation in the savings plan rose sharply.", "Fewer employees stayed with the company."], a: 2, exp: "“participation jumped to around ninety percent. Nothing else had changed”；B 与 “not the benefits” 相反。" },
      { q: "What does the speaker advise consumers to do?", opts: ["Avoid signing up for free trials.", "Check the options that were chosen for them in advance.", "Always choose the default option.", "Let experts make financial decisions for them."], a: 1, exp: "结尾 “take a moment to examine the options that have already been chosen for you”，examine 改写为 check；A 中免费试用只是被滥用的例子，并非建议本身。" },
    ],
  },
  {
    id: 'll9', type: 'lecture', title: '讲座 · 期望路径与城市设计', minutes: 4,
    script: `Good afternoon. Walk across almost any university campus or city park, and you will notice narrow strips of worn grass cutting across the lawns. These informal trails are known as desire paths. They form when enough people decide that the official sidewalk does not take them where they want to go, or takes too long to get there. Today I would like to explain why planners have started to treat these paths not as damage, but as valuable information.

For a long time, the standard response to desire paths was to fight them. Planners put up fences, planted bushes, or posted signs telling people to keep off the grass. These measures rarely worked. People simply found another route, or stepped over the fence. Studies of pedestrian behavior show that walkers will almost always choose the shortest route if it saves more than a few seconds, whatever the designer intended.

Some designers have taken a very different approach. There is a story, repeated in many planning textbooks, about a university that put up its new buildings but deliberately left the grass between them without any paths for a whole year. At the end of the year, the planners looked at where the grass had been worn away and paved exactly those lines. The result was a network of walkways that students actually used.

Today, technology makes this approach much easier. Planners can study anonymous location data from phones, or use cameras to track how people move through a square. In one European city, this kind of analysis revealed that most people crossing a large plaza avoided its center, because there was no shade. After trees were planted, movement patterns changed completely within a single summer.

The broader lesson goes beyond grass and sidewalks. Desire paths remind us that people's behavior often reveals needs they would never mention in a survey. Good design begins with observation, not assumption.

So, for your project this term, I want each group to choose a public space on or near campus. Spend at least three hours watching how people actually use it, and then propose one change based on what you see, not on what you think people should do.`,
    questions: [
      { q: "What does the lecture mainly discuss?", opts: ["How to protect lawns from damage.", "Why universities need more sidewalks.", "How informal walking routes can guide design.", "The history of city parks."], a: 2, exp: "开场 “planners have started to treat these paths not as damage, but as valuable information”，C 概括主题；A 正是讲者要反驳的旧观念。" },
      { q: "How did planners traditionally respond to desire paths?", opts: ["They tried to block them.", "They turned them into official paths.", "They studied them using cameras.", "They asked walkers for their opinions."], a: 0, exp: "“the standard response ... was to fight them. Planners put up fences, planted bushes, or posted signs”；B、C 是后来的新做法。" },
      { q: "What did the university in the story do?", opts: ["It built paths before the buildings were finished.", "It asked students to vote on where paths should go.", "It planted trees to give walkers shade.", "It waited a year before deciding where to build paths."], a: 3, exp: "“left the grass between them without any paths for a whole year ... paved exactly those lines”；C 是欧洲广场的例子，主体换了。" },
      { q: "What are students asked to do for their project?", opts: ["Survey people about a public space.", "Observe a public space and suggest a change.", "Design a new park for the campus.", "Map the desire paths in their city."], a: 1, exp: "“Spend at least three hours watching how people actually use it, and then propose one change”，watching 对应 observe，propose 对应 suggest；A 与 “needs they would never mention in a survey” 的观点相悖。" },
    ],
  },
  {
    id: 'll10', type: 'lecture', title: '讲座 · 虚假信息为何传得快', minutes: 4,
    script: `Today we are going to look at a question that has become central to communication studies. Why does false information travel so quickly, and what, if anything, can be done about it?

Let's begin with the evidence. A team of researchers analyzed more than one hundred thousand news stories shared on a major social media platform over a period of ten years. They found that false stories reached more people, and reached them faster, than true ones. In fact, true stories took about six times as long as false ones to reach the same number of people.

You might assume that automated accounts, often called bots, were responsible. But when the researchers removed bot activity from the data, the pattern remained. Humans, not machines, were the main drivers. So why do people share false stories? The researchers found that false stories tended to be more novel, more surprising than true ones. And they triggered stronger emotions, such as disgust and fear. We share things that surprise us, partly because passing on new information makes us look well informed.

So how should we respond? The traditional approach is fact checking, which means correcting false claims after they spread. Fact checks do help, but they have a basic weakness. They arrive late, and corrections usually reach far fewer people than the original story did.

This has led researchers to explore an approach borrowed from medicine, known as prebunking. The idea works like a vaccine. Instead of correcting one particular falsehood, you expose people in advance to a weakened form of the techniques used to mislead them, such as fake experts, highly emotional language, or false choices between two extremes. In several experiments, people who watched short videos explaining these techniques, or played online games in which they created fake headlines themselves, became noticeably better at spotting misleading content later. And the effect held across different political views.

Prebunking is no magic cure. The effect fades over a few weeks, much like some vaccines, and needs boosters. But it suggests that teaching people how manipulation works may be more effective than chasing every false claim one by one.

For next week, please find one example of misleading content online and identify which technique it uses.`,
    questions: [
      { q: "What is the lecture mainly about?", opts: ["How bots are used to spread news.", "Why false information spreads and how to resist it.", "How news stories are produced and edited.", "The role of vaccines in public health."], a: 1, exp: "开场 “Why does false information travel so quickly, and what ... can be done about it?”，B 涵盖原因与对策；A 中 bots 被研究排除，D 只是类比。" },
      { q: "According to the research, why were false stories shared more widely?", opts: ["They were spread mainly by automated accounts.", "They came from more trusted sources.", "They were more surprising and emotional.", "They were shorter and easier to read."], a: 2, exp: "“false stories tended to be more novel, more surprising ... triggered stronger emotions”；A 与 “Humans, not machines, were the main drivers” 相反。" },
      { q: "What does the speaker conclude about prebunking?", opts: ["Teaching how manipulation works may beat correcting each false claim.", "Its effects last a lifetime once it is learned.", "It works only for people with certain political views.", "It should completely replace fact checking."], a: 0, exp: "“teaching people how manipulation works may be more effective than chasing every false claim one by one”；B 与 “The effect fades” 相反，C 与 “held across different political views” 相反。" },
    ],
  },
  {
    id: 'll11', type: 'lecture', title: '讲座 · 课程录像是帮手还是陷阱', minutes: 4,
    script: `Good morning. Over the past few years, almost every university has started recording its lectures and posting them online. Students love it. In surveys, more than ninety percent say recordings are useful. Today I want to look at what research says about how recordings affect learning, because the answer is less straightforward than you might think.

First, the benefits. Recordings are especially valuable for students whose first language is not English, who can pause and replay difficult explanations. They also help students with disabilities, students who work part time, and anyone who is sick. For these groups, recordings make education fairer, and that alone is a strong argument for keeping them.

The concerns arise when recordings replace attendance rather than support it. One study at a large university followed how students used recordings over a full semester. Students who attended lectures and used recordings to review difficult parts got the highest grades. But students who skipped class and planned to watch later did significantly worse. Many of them never caught up. The recordings piled up, and in the week before the exam, some students tried to watch twenty hours of lectures, often at double speed.

Why does this hurt learning? Cramming is part of the answer. We know from decades of research that spreading study over time leads to much better long term memory than packing it into a few days. Another factor is attention. When watching at home, students are far more likely to be interrupted by their phones or by other people.

So what should universities and students do? Removing recordings would harm the very students who need them most, so that is not the solution. Instead, some universities now release recordings with short quizzes built in, which encourage students to watch actively. Others keep recordings online for only a few weeks to discourage last minute viewing marathons.

As for you, my recommendation is simple. Treat recordings as a tool for review, not a replacement for being here. If you really must miss a lecture, watch the recording within the same week, and take notes just as you would in class.`,
    questions: [
      { q: "What is the lecture mainly about?", opts: ["How to record lectures of high quality.", "Why students should stop using recordings.", "How lecture recordings affect student learning.", "Why attendance rules should be stricter."], a: 2, exp: "开场 “what research says about how recordings affect learning”，C 原意复现；B 与讲者 “Removing recordings ... is not the solution” 相反。" },
      { q: "Which students does the speaker say benefit greatly from recordings?", opts: ["Students who speak English as a second language.", "Students who already get high grades.", "Students who prefer to study at night.", "Students who take online courses only."], a: 0, exp: "“especially valuable for students whose first language is not English”，A 为同义改写。" },
      { q: "What happened to students who skipped class and planned to watch later?", opts: ["They got the highest grades.", "They performed significantly worse.", "They took better notes than others.", "They watched each lecture several times."], a: 1, exp: "“students who skipped class and planned to watch later did significantly worse”；A 属于上课并用录像复习的学生，对象换了。" },
      { q: "What does the speaker recommend?", opts: ["Watching recordings at double speed to save time.", "Saving recordings for the week before the exam.", "Taking quizzes after every lecture.", "Using recordings mainly to review what was taught."], a: 3, exp: "“Treat recordings as a tool for review, not a replacement for being here”；A、B 正是讲者批评的做法，C 是部分大学的措施而非给学生的建议。" },
    ],
  },
  {
    id: 'll12', type: 'lecture', title: '讲座 · 含糖饮料税有用吗', minutes: 4,
    script: `Good afternoon. Today's lecture deals with a public health tool that has become increasingly popular, and increasingly controversial, over the past decade. I am talking about taxes on sugary drinks.

The reasoning behind these taxes is fairly simple. Sugary drinks are one of the largest sources of added sugar in many people's diets, and they are strongly linked to obesity, type two diabetes, and tooth decay. Unlike most foods, these drinks provide almost no nutritional value. So if higher prices reduce consumption, the public health benefits could be considerable.

More than fifty countries and cities have now introduced such taxes, which gives us a good deal of real world evidence. A review of studies from several countries found that a tax which raised prices by about ten percent reduced purchases of sugary drinks by roughly the same amount. In one major American city, sales of taxed drinks fell by more than a third within a year.

One of the most interesting cases is the United Kingdom. Rather than taxing all sugary drinks equally, the government set different rates depending on how much sugar a drink contained, and it announced the plan two years in advance. Many companies responded by changing their recipes before the tax even began. As a result, the amount of sugar sold in soft drinks dropped substantially, even though total drink sales barely changed. In other words, the tax worked mainly by changing the products, not the customers.

Critics raise reasonable objections. These taxes take a larger share of income from poorer households. And in some places, people simply drove to neighboring towns to buy cheaper drinks. Supporters reply that poorer communities also suffer most from diet related disease, so they stand to gain the most, especially if the money raised is spent on things like school sports or free drinking water.

So what can we conclude? A sugar tax on its own will not solve obesity. But the evidence suggests it works best when it is designed to encourage healthier products, and when the money it raises is visibly returned to the community. Policy makers should treat it as one part of a broader strategy that also includes health education and clearer food labels.`,
    questions: [
      { q: "What is the lecture mainly about?", opts: ["The causes of rising obesity rates.", "How companies market sugary drinks.", "Why people prefer sweet flavors.", "The effectiveness of taxes on sugary drinks."], a: 3, exp: "开场点题 “taxes on sugary drinks”，全篇讨论其效果与争议；A 只是背景。" },
      { q: "What was special about the tax in the United Kingdom?", opts: ["It led companies to cut the sugar in their drinks.", "It greatly reduced the total number of drinks sold.", "It was introduced without any warning.", "It applied the same rate to all sugary drinks."], a: 0, exp: "“Many companies responded by changing their recipes ... the tax worked mainly by changing the products”；B 与 “total drink sales barely changed” 相反，C、D 也与原文相反。" },
      { q: "What does the speaker suggest policy makers do?", opts: ["Raise the tax until people stop buying sugary drinks.", "Combine the tax with other measures and return the revenue to communities.", "Replace the tax with better food labels.", "Apply the tax only in wealthy neighborhoods."], a: 1, exp: "结尾 “works best when ... the money it raises is visibly returned to the community ... one part of a broader strategy”，B 综合改写；C 把“包括”改成了“替代”。" },
    ],
  }
);
