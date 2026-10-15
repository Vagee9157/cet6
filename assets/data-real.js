/* 真人听力（公有领域，美国政府作品）。
 * 慢速：VOA Learning English 录音与逐字稿（无 org 字段，real1–30）。
 * 常速：NASA「Houston We Have a Podcast」/ NOAA「Ocean Podcast」节目片段（org 字段），按官方逐字稿截取，segs 为逐段时间（秒，已与录音对齐）。
 * questions 为本站按六级题型自编。 */
const REAL = [
 {
  "id": "real1",
  "title": "Methods for Protecting Earth against an Asteroid Strike",
  "date": "2025-03-12",
  "src": "assets/audio/real1.m4a",
  "dur": 316.7,
  "url": "https://learningenglish.voanews.com/a/methods-for-protecting-earth-against-an-asteroid-strike/7989189.html",
  "words": 628,
  "script": "Astronomers following asteroid activity in space estimate there is a very small chance an object large enough to destroy a whole city could strike Earth in 2032.\nBut space agency officials say even if such an asteroid keeps heading on a path toward Earth, the world is now much better-equipped to defend itself against such a threat.\nThe American space agency NASA recently estimated there was a 3.1 percent chance that asteroid 2024 YR4 would hit Earth on December 22, 2032. That is the highest probability predicted for such a large space rock in modern times.\nRichard Moissl is head of the European Space Agency's (ESA) planetary defense office. While recognizing the risk the asteroid could present, he told the French news agency AFP people should not panic over such predictions.\nAstronomers have noted that the more data they gather, the odds of a direct asteroid hit are expected to keep rising over time. However, scientists say at a certain point the odds will likely drop down to zero.\nMoissl said he thinks it is important to remember that even in the unlikely event the probability keeps rising to 100 percent, the world is \"not defenseless.\"\nHere are some methods currently being considered as defensive measures to keep humanity safe in case there is a real threat.\nSend a spacecraft to hit it\nOnly one planetary defense method has been tried against an asteroid. In 2022, NASA's Double Asteroid Redirection Test (DART) sent a spacecraft into the 160-meter-wide Dimorphos asteroid. The effort successfully changed the asteroid’s orbit around a larger space rock.\nBruce Betts is chief scientist for the nonprofit Planetary Society. He told AFP that space agencies could hit the 2024 YR4 asteroid with several spacecrafts, observing how each one changed the path.\nThe asteroid discovered in December is estimated to be 40-90 meters wide -- about half the size of Dimorphos.\n\"You have to take care not to overdo it,\" Moissl warned. He said this is because if a spacecraft only partly destroys an asteroid, it could send smaller pieces of the space rock heading toward Earth.\nNon-contact methods\nA separate idea would involve sending a large spacecraft to fly alongside a threatening asteroid. The spacecraft would not touch the asteroid, but would use its gravitational force to pull it away from Earth.\nMoissl said another non-contact plan would put a spacecraft near the asteroid to eject a continuous flow of atoms to push the asteroid off course.\nScientists have also considered painting one side of the asteroid white. They believe this could increase the light the object reflects to make it slowly change course.\nContact methods\nOne idea is to use a nuclear weapon against a threatening asteroid. In laboratory tests, researchers found that X-rays from a nuclear blast could move a rock. But this is considered more of a plan for kilometers-wide asteroids like the one that killed off the dinosaurs. And this method also carries the risk that a nuclear explosion could send additional pieces of the asteroid falling toward Earth.\nA similar method – but one considered less dangerous – would involve shooting laser beams from a spacecraft to destroy the side of an asteroid in an effort to push it away from Earth.\nIf all else fails\nMoissl said that if all else fails, at least the world will have a good idea where a threatening asteroid would strike. Since astronomers believe most asteroids would at most threaten to destroy one city, efforts could be organized to get people out of an area before a strike.\n\"Seven-and-a-half years is a long time to prepare,\" Moissl added. He also noted that even with the rising odds involving 2024 YR4, there is still about a 97 percent chance the asteroid will miss Earth.",
  "questions": [
   {
    "q": "What do space agency officials say about a possible asteroid strike in 2032?",
    "opts": [
     "The odds of a hit have already dropped to zero.",
     "Only NASA has the means to stop the asteroid.",
     "The world is now better able to defend itself.",
     "People in large cities should prepare to leave now."
    ],
    "a": 2,
    "exp": "原文 \"the world is now much better-equipped to defend itself against such a threat\"，better able to defend itself 同义替换 better-equipped to defend。原文说概率会先升、最终可能降到零，并非已经为零；疏散是最后才提的兜底方案。"
   },
   {
    "q": "What did NASA's DART mission achieve in 2022?",
    "opts": [
     "It changed the orbit of an asteroid.",
     "It broke an asteroid into many smaller pieces.",
     "It measured the exact size of asteroid 2024 YR4.",
     "It pulled an asteroid away using gravitational force."
    ],
    "a": 0,
    "exp": "原文 \"The effort successfully changed the asteroid's orbit around a larger space rock\"。用引力拉开是后文另一种 non-contact 设想，属张冠李戴。"
   },
   {
    "q": "Why does Moissl warn against overdoing a spacecraft strike?",
    "opts": [
     "It would waste several expensive spacecraft.",
     "It might push the asteroid closer to the Moon.",
     "It would take too many years to prepare.",
     "Broken pieces of the asteroid could head toward Earth."
    ],
    "a": 3,
    "exp": "原文 \"if a spacecraft only partly destroys an asteroid, it could send smaller pieces of the space rock heading toward Earth\"，broken pieces 对应 smaller pieces。"
   },
   {
    "q": "According to Moissl, what could be done if all other methods fail?",
    "opts": [
     "Fire a nuclear weapon at the asteroid.",
     "Move people out of the area likely to be hit.",
     "Paint one side of the asteroid white.",
     "Build underground shelters in the target city."
    ],
    "a": 1,
    "exp": "原文 \"efforts could be organized to get people out of an area before a strike\"，move people out 替换 get people out。核武器和涂白都是前文提到的其他方法，不是 if all else fails 的答案。"
   }
  ]
 },
 {
  "id": "real2",
  "title": "Study Shows How Earth’s Orbit Affects Ice Ages",
  "date": "2025-03-10",
  "src": "assets/audio/real2.m4a",
  "dur": 270.9,
  "url": "https://learningenglish.voanews.com/a/study-shows-how-earth-s-orbit-affects-ice-ages/7997495.html",
  "words": 463,
  "script": "A recent study suggests the next ice age will likely begin in about 11,000 years unless emissions change the effects of natural climate cycles.\nAn ice age is a period of reduced temperatures causing ice to cover large areas of the northern and southern parts of the world.\nA group of scientists studied changes in the shape of the Earth’s orbit around the sun, the tilt of the Earth’s axis and the movement of the axis itself, called a wobble. These three motions are believed to happen in cycles. The Serbian scientist Milutin Milankovitch developed a theory about 100 years ago that these cycles affected Earth’s long-term climate.\nThe team noted that small changes in Earth’s orbit around the Sun caused predictable cycles of warming and cooling over a period of about 100,000 years.\nThese findings permitted the team to determine how the three factors of tilt, wobble, and the shape of Earth's orbit might have affected the Earth’s climate over the last 900,000 years.\nThe group published its findings in Science on February 27.\nThe scientists examined a million-year record of climate by looking at ice sheets across the northern half of the world and deep ocean temperatures.\nThey then compared this data with small but regular changes in Earth’s orbit over time.\nThe lead writer of the study is Stephen Barker, a professor at Cardiff University in Britain. He told the French News Agency (AFP) that for many years it has been difficult for scientists to show exactly how small changes in Earth’s orbit have led to huge changes between warm and cold periods.\nEarth is believed to go through cycles of ice ages and warm periods. The last ice age is thought to have ended around 11,700 years ago. Scientists, such as Milankovitch, have long seen a connection between Earth's orbit and climate.\nHowever, researchers have struggled to precisely date when each of the climate changes happened. It has also been difficult for them to know exactly which orbit positions affect the start and stop of cold or warm periods.\nBarker said his team of researchers studied slow changes in temperature over long periods of time instead of only looking at shorter periods of change between cold and warm climates.\nBarker told AFP, \"We would expect a glaciation to occur within the next 11,000 years, and it would end in 66,000 years' time.\"\nLorraine Lisiecki is a professor at the University of California, Santa Barbara, and a co-writer of the study. She said the study shows that changes in climate over tens of thousands of years are not random.\nThe team aims to expand its findings to investigate the long-term effects of human activity on climate. They also want to find out how it might affect Earth’s natural climate cycles.",
  "questions": [
   {
    "q": "What does the recent study suggest about the next ice age?",
    "opts": [
     "It began about 11,700 years ago.",
     "It will probably begin in roughly 11,000 years.",
     "It will end within the next 11,000 years.",
     "It has been stopped by human emissions."
    ],
    "a": 1,
    "exp": "原文 \"the next ice age will likely begin in about 11,000 years unless emissions change the effects of natural climate cycles\"，probably 替换 likely。11,700 年前是上次冰期结束的时间；66,000 年后才结束；排放只是可能改变，并非已经阻止。"
   },
   {
    "q": "What has long been difficult for scientists, according to Stephen Barker?",
    "opts": [
     "Collecting ice records from the northern half of the world.",
     "Measuring deep ocean temperatures over a million years.",
     "Getting their research published in the journal Science.",
     "Showing how small orbit changes caused huge climate shifts."
    ],
    "a": 3,
    "exp": "原文 \"it has been difficult for scientists to show exactly how small changes in Earth's orbit have led to huge changes between warm and cold periods\"，climate shifts 替换 changes between warm and cold periods。冰盖和深海温度是研究使用的数据，不是难点。"
   },
   {
    "q": "What does Lorraine Lisiecki say the study shows?",
    "opts": [
     "Long-term climate changes follow a regular pattern.",
     "Climate changes over long periods happen randomly.",
     "Human activity has ended natural climate cycles.",
     "The last ice age ended earlier than once believed."
    ],
    "a": 0,
    "exp": "原文 \"changes in climate over tens of thousands of years are not random\"，follow a regular pattern 是 not random 的正面改写；第一个干扰项正好反着说。"
   },
   {
    "q": "What does the research team plan to do next?",
    "opts": [
     "Predict the exact date the current warm period ends.",
     "Collect new ice records from the southern half of the world.",
     "Study how human activity affects climate in the long run.",
     "Test Milankovitch's theory with new computer models."
    ],
    "a": 2,
    "exp": "原文 \"The team aims to expand its findings to investigate the long-term effects of human activity on climate\"，in the long run 替换 long-term effects。"
   }
  ]
 },
 {
  "id": "real3",
  "title": "Scientists Link Gene to Human Speech",
  "date": "2025-03-08",
  "src": "assets/audio/real3.m4a",
  "dur": 259.1,
  "url": "https://learningenglish.voanews.com/a/scientists-link-gene-to-human-speech/7985890.html",
  "words": 504,
  "script": "A new study suggests the beginnings of human speech are linked to genetics. The research identifies a protein – found only in people – that may have helped early humans develop spoken communication.\nScientists involved in the study say this new speaking ability became important for humans’ survival. For example, speech permitted individuals to share information, organize activities and pass down knowledge. These abilities are now seen as an advantage humans had over their relatives, such as the Neanderthals and Denisovans.\nThe researchers recently published their findings in a study in the journal Nature Communications.\nLiza Finestack teaches about speech and hearing at the University of Minnesota. She told The Associated Press (AP) the new study is \"a good first step to start looking at the specific genes\" that may affect speech and language development. Finestack was not involved in the study.\nDr. Robert Darnell has long been studying the protein – called NOVA1 – at his laboratory at New York’s Rockefeller University. He helped lead the new research and was a writer of the study. Darnell told the AP the genetic version, or variant, included the protein that helped humans develop into the “dominant species” that remains today.\nThe latest research involved scientists using CRISPR gene editing methods to replace the NOVA1 protein found in mice with the one found in humans. The aim was to test the real-life effects of the genetic variant. The researchers were surprised to learn that the variant changed the way the animals called out to each other.\nBaby mice with the human variant made a different sound than normal mice do when their mother came around. Adult male mice with the variant also made different sounds when they were near a female they wanted to mate with.\nDarnell said both of these situations gave the mice a reason to speak. Those with the human variant \"spoke differently,\" demonstrating the gene’s influence in speech, he added.\nThis is not the first time a gene has been linked to speech. In 2001, British scientists said they had discovered the first gene tied to a language and speech disorder.\nResearchers called this human language gene FOXP2. But even though FOXP2 was found to be linked to human language, the variant in modern humans was not found in our species alone. Later research found it was shared with Neanderthals. The NOVA1 variant in modern humans, on the other hand, is found only in our species, Darnell said.\nThe presence of a gene variant is not the only thing that permits people to speak. The ability also depends on physical elements in the human throat and areas of the brain that work together to help people produce speech and understand language.\nDarnell said he hopes the recent work can lead to new ways to treat speech-related problems.\nThe University of Minnesota's Finestack noted the genetic findings could also one day permit scientists to identify people who might need help developing speech and language early in life.\n\"That's certainly a possibility,\" she said.",
  "questions": [
   {
    "q": "What does the new study suggest about human speech?",
    "opts": [
     "A protein unique to humans may have helped it develop.",
     "Neanderthals spoke better than early modern humans.",
     "It developed mainly through changes in the throat.",
     "It depends on a protein shared with most animals."
    ],
    "a": 0,
    "exp": "原文 \"identifies a protein ... found only in people ... that may have helped early humans develop spoken communication\"，unique to humans 替换 found only in people。喉部结构后文说也有作用，但不是研究发现的主旨。"
   },
   {
    "q": "What happened after mice were given the human version of NOVA1?",
    "opts": [
     "They learned to copy simple human speech sounds.",
     "They became more aggressive toward female mice.",
     "They called out to each other in a different way.",
     "The baby mice stopped calling for their mothers."
    ],
    "a": 2,
    "exp": "原文 \"the variant changed the way the animals called out to each other\"，幼鼠和成年雄鼠都 \"made a different sound\"，而不是停止叫唤或模仿人声。"
   },
   {
    "q": "How is NOVA1 different from the speech gene FOXP2?",
    "opts": [
     "It was discovered by British scientists in 2001.",
     "Its modern human version exists only in our species.",
     "It is closely linked to speech disorders in children.",
     "It was also found in Neanderthals."
    ],
    "a": 1,
    "exp": "原文 \"The NOVA1 variant in modern humans, on the other hand, is found only in our species\"。2001 年英国科学家发现、与 Neanderthals 共有的都是 FOXP2，属张冠李戴。"
   },
   {
    "q": "What does Liza Finestack think the findings may one day allow?",
    "opts": [
     "Replacing damaged speech genes in human patients.",
     "Teaching animals to produce human language.",
     "Proving that speech depends only on genes.",
     "Identifying people who need early help with speech."
    ],
    "a": 3,
    "exp": "原文 \"permit scientists to identify people who might need help developing speech and language early in life\"。原文明确说基因变异 \"is not the only thing that permits people to speak\"，排除最后一项。"
   }
  ]
 },
 {
  "id": "real4",
  "title": "New Discovery Could Explain What Gives Mars its Red Color",
  "date": "2025-03-02",
  "src": "assets/audio/real4.m4a",
  "dur": 326.0,
  "url": "https://learningenglish.voanews.com/a/new-discovery-could-explain-what-gives-mars-its-red-color/7990107.html",
  "words": 482,
  "script": "Scientists say they might have identified the mineral on Mars that is responsible for making the planet appear red.\nNew data collected on Mars through several methods suggests the substance, called ferrihydrite, is likely found in dust and rock material across wide areas of the planet. The team carrying out the research describes ferrihydrite as an “iron oxide mineral.”\nThe mineral appears reddish in color and can form in water-rich environments. The scientists said discovering large amounts of it on Mars adds to existing evidence that the planet might have held a large supply of liquid water in the past.\nThe research was carried out by an international team led by America’s Brown University and the University of Bern in Switzerland. The findings recently appeared in a study published in Nature Communications.\nThe researchers noted that scientists have long wondered about the exact substance that gives Mars – which is also known as the Red Planet – its deep red color. Past studies had suggested a mineral called hematite might be the cause.\nThe study is based on Martian data collected by several spacecraft. These include the Mars Reconnaissance Orbiter, operated by the American space agency NASA. In addition, information was captured by instruments aboard the European Space Agency’s (ESA's) Mars Express and Trace Gas orbiters. Some data also came from exploring vehicles, called rovers, operating on Mars.\nIn their examinations, the researchers also used manmade, or synthetic, material designed to look and feel similar to real Martian dust.\nAdomas Valantinas currently works as a researcher at Brown University’s Department of Earth, Environment & Planetary Sciences. He helped write the study. Valantinas noted the mystery of why Mars is red had been considered “for hundreds, if not thousands, of years.”\nValantinas recognized his team was not the first to consider ferrihydrite as a possible reason for the coloring of Mars. But he noted, “it has never been proven as we have now, using observational data and novel laboratory methods…”\nValantinas noted the discovery of widespread ferrihydrite suggests Mars once held liquid water that would have made it possible for the planet to support some form of life.\n\"Our study reveals that ferrihydrite formation on Mars required the presence of both oxygen…and water capable of reacting with iron,” he added. “These conditions were very different from the dry, cold environment of Mars today.\"\nJohn Mustard is a planetary expert at Brown University and was a co-writer of the study. He called it “a door-opening opportunity” for future research. But he added that additional study is needed to confirm the team’s latest findings.\n\"As exciting as the new findings are, we realize that our results can only be verified by samples from Mars, which are currently being collected by NASA's Perseverance rover,” Mustard said. He added, “When we get those back, we will be able to check whether our theory about ferrihydrite is correct.\"",
  "questions": [
   {
    "q": "What have the scientists possibly identified on Mars?",
    "opts": [
     "A large supply of liquid water under the surface.",
     "The mineral that gives the planet its red color.",
     "Clear signs of ancient life in Martian rocks.",
     "The reason Mars lost most of its oxygen."
    ],
    "a": 1,
    "exp": "原文 \"might have identified the mineral on Mars that is responsible for making the planet appear red\"，gives the planet its red color 替换 responsible for making the planet appear red。水是推论，不是现在发现的。"
   },
   {
    "q": "What does the presence of large amounts of ferrihydrite suggest?",
    "opts": [
     "Mars has always been a dry and cold planet.",
     "Hematite is spread across most of the planet.",
     "Martian dust can form without any water.",
     "Mars may once have held plenty of liquid water."
    ],
    "a": 3,
    "exp": "原文 \"adds to existing evidence that the planet might have held a large supply of liquid water in the past\"，plenty of 替换 a large supply of。hematite 是过去研究的旧说法。"
   },
   {
    "q": "What is new about this team's work, according to Valantinas?",
    "opts": [
     "It proved the idea with observations and new lab methods.",
     "It was the first to suggest ferrihydrite as the cause.",
     "It relied only on rock samples brought back from Mars.",
     "It used data from a single NASA spacecraft."
    ],
    "a": 0,
    "exp": "原文 \"it has never been proven as we have now, using observational data and novel laboratory methods\"，new 替换 novel。原文明说团队 \"was not the first to consider ferrihydrite\"；数据来自多艘航天器。"
   },
   {
    "q": "What does John Mustard say is needed to confirm the findings?",
    "opts": [
     "Creating more synthetic Martian dust in labs.",
     "Collecting data from additional orbiting spacecraft.",
     "Examining samples that are returned from Mars.",
     "Sending a new type of rover to the planet."
    ],
    "a": 2,
    "exp": "原文 \"our results can only be verified by samples from Mars, which are currently being collected by NASA's Perseverance rover\"，confirm 替换 verify。合成尘土是已经用过的研究手段。"
   }
  ]
 },
 {
  "id": "real5",
  "title": "Japan’s Toyota Builds a City-like Center to Test Robotics, AI",
  "date": "2025-02-26",
  "src": "assets/audio/real5.m4a",
  "dur": 335.6,
  "url": "https://learningenglish.voanews.com/a/japan-s-toyota-builds-a-city-like-center-to-test-robotics-ai/7987758.html",
  "words": 490,
  "script": "Japanese automaker Toyota says it is building a research center in a city-like setting to test robotics, artificial intelligence (AI) and autonomous vehicle technologies.\nToyota recently announced it had completed the first part, or phase, of the center, called Woven City. It sits near the southern Japanese city of Susono. Company officials recently showed off the latest progress to reporters from the Associated Press.\nDaisuke Toyoda is an executive for Toyota who is helping lead the project. He told the AP that the center was not designed to be a “smart city.” However, it aims to carry out technology research and development and be “a test course for mobility.”\nThe company said Woven City would serve as a “Living Laboratory.” It aims to test technology systems to support future changes in “the movement of people, goods, information and energy.”\nToyoda said the center is meant to be a place where researchers and technology company officials can come together and share ideas. It will also seek to establish a community with a shared desire “to co-create, develop and refine” new technology products and services.\nWoven City was built on the grounds of a closed Toyota automobile factory. The automaker said the project’s first phase covers about 47,000 square meters. When completed, it will spread out over 294,000 square meters.\nBuilding operations on Woven City began in 2021. All the buildings are connected by underground passageways. Among planned testing activities will include self-driving vehicles making waste pickups and completing deliveries around the area. Testing operations will center on how people living in cities can best interact with changing technologies.\nCurrently, no one lives in Woven City. When it opens, officials plan on having about 100 people living there. They will be called “weavers.” These are workers employed by Toyota and its partner companies making other products.\nWhen AP reporters visited the area, Japanese coffee maker UCC was serving hot drinks from a self-driving bus. The bus was parked in an area surrounded by still-empty housing.\nToyota has supported electric vehicle (EV) technology in the past. However, the company is currently involved in a push for hydrogen, the energy of choice in Woven City.\nKeisuke Konishi is an automobile expert at Japan’s Quick Corporate Valuation Research Center. He told the AP Toyota has plans to expand into self-driving vehicle services to compete with Google’s Waymo and other large companies.\nKonishi noted the company has the money for such development even if it means building up a completely new business. “Toyota has the money to do all that,” he said.\nToyota officials have said they do not expect Woven City to make money, at least not for the first few years.\nSeveral other futuristic developments have been planned in other areas of the world over the years. They have included efforts in Toronto, Canada; Saudi Arabia; Abu Dhabi; and San Francisco, California. But those projects are either still being developed or have been canceled.",
  "questions": [
   {
    "q": "How does Daisuke Toyoda describe Woven City?",
    "opts": [
     "A test site for future mobility technology.",
     "A smart city built for ordinary residents.",
     "A new factory for producing electric vehicles.",
     "A tourist attraction showing future cars."
    ],
    "a": 0,
    "exp": "原文 \"the center was not designed to be a smart city ... it aims to ... be a test course for mobility\"，test site 替换 test course。smart city 被明确否定。"
   },
   {
    "q": "Who will live in Woven City when it opens?",
    "opts": [
     "Engineers invited from Google's Waymo.",
     "Families chosen from the nearby city of Susono.",
     "Around 1,000 volunteers testing new robots.",
     "About 100 workers from Toyota and its partners."
    ],
    "a": 3,
    "exp": "原文 \"officials plan on having about 100 people living there ... workers employed by Toyota and its partner companies\"。Waymo 是后文提到的竞争对手。"
   },
   {
    "q": "What energy is Toyota currently pushing for in Woven City?",
    "opts": [
     "It relies mainly on electric vehicle batteries.",
     "It is promoting hydrogen as the preferred energy.",
     "It uses solar panels on all the buildings.",
     "It burns fuel made from collected waste."
    ],
    "a": 1,
    "exp": "原文 \"the company is currently involved in a push for hydrogen, the energy of choice in Woven City\"，preferred energy 替换 energy of choice。电动车是丰田过去支持的方向，属时间错位。"
   },
   {
    "q": "What do Toyota officials say about Woven City's earnings?",
    "opts": [
     "It will soon earn more than Waymo's services.",
     "It will pay for itself within the first year.",
     "It is unlikely to make money in its early years.",
     "Its profits will fund similar cities abroad."
    ],
    "a": 2,
    "exp": "原文 \"Toyota officials have said they do not expect Woven City to make money, at least not for the first few years\"，early years 替换 first few years。"
   }
  ]
 },
 {
  "id": "real6",
  "title": "How Daylight Saving Time Affects Health",
  "date": "2025-03-06",
  "src": "assets/audio/real6.m4a",
  "dur": 431.3,
  "url": "https://learningenglish.voanews.com/a/how-daylight-savings-time-affects-health/8001173.html",
  "words": 666,
  "script": "Much of the United States “springs forward” on Sunday, March 9th, for daylight saving time. Worldwide, many other countries also observe daylight saving time, starting and ending on different dates.\nThe time change can leave people tired and perhaps unhappy the next day. But it also might even harm health. Some studies have found an increase in heart attacks and strokes right after the March time change.\nHowever, there are ways to ease the effects of the time change, including getting more sunshine. The light helps reset your circadian rhythm for healthful sleep.\nWhen does daylight saving time start?\nIn the U.S., daylight saving time begins Sunday at 2:00 in the morning. The time change will reverse on November 2 when clocks “fall back” as daylight saving time ends.\nThe state of Hawaii and most of the state of Arizona do not make the spring change. Those areas remain on standard time along with Puerto Rico, American Samoa, Guam and the U.S. Virgin Islands.\nSome people try to prepare for the change to daylight saving time by going to bed a little earlier two or three nights ahead. But with a third of American adults already not getting the suggested seven hours of nightly sleep, catching up can be difficult.\nThe brain\nThe brain has a kind of clock that is set by exposure to sunlight and darkness. This clock, known as the circadian rhythm, is on a roughly 24-hour cycle. It governs when we become sleepy and when we are more wakeful. The rhythms change with age. This is one reason that early-to-rise young children turn into hard-to-wake teenagers.\nMorning light resets the rhythm. By evening, levels of a hormone called melatonin begin to increase, leading to tiredness. Too much light in the evening — that extra hour from daylight saving time — delays the melatonin increase. As a result, the cycle gets delayed.\nThe circadian rhythm affects more than sleep. It also influences heart rate, blood pressure, hormone releases and other systems.\nHealth effects\nSleep deprivation, or lack of sleep, is linked to heart disease, weight conditions, problems with thinking and remembering, and more.\nDeadly car crash numbers increase the first few days after the spring time change, a study of U.S. traffic deaths says. The risk of crashes is highest in the morning, it found. Researchers suggested sleep deprivation might be responsible.\nThe time change also has a link to the heart. The American Heart Association points to studies that suggest an increase in heart attacks on the Monday after daylight saving time begins, and in strokes for two days afterward.\nDoctors already know that heart attacks, especially severe ones, are a bit more common on Mondays generally — and in the morning, when blood is more likely to clot.\nResearchers do not know why the time change would add to that Monday connection. But it is possible the sudden circadian change influences other issues such as high blood pressure in people already at risk.\nPrepare for daylight saving time\nTo prepare for daylight saving time, experts offer some advice. Slowly move bedtimes about 15 or 20 minutes earlier for several nights before the time change. Try to rise earlier the next morning, too. Go outside for early morning sunshine the first week of daylight saving time. This is another way to help reset your body’s clock. Start daily activities, like dinner or exercise, a little earlier. This may help tell your body to start getting used to the new conditions, sleep experts suggest.\nDaytime sleeping, the drug caffeine and light from phones and other electronic devices can make an earlier bedtime even harder.\nEnd daylight saving time?\nAmericans have discussed ending daylight saving time. But so far, no official changes have been made.\nHealth groups such as the American Medical Association and American Academy of Sleep Medicine believe it is time to end time changes. The groups suggest that staying with standard time year-round works better for human biology and sleep needs.",
  "questions": [
   {
    "q": "What have some studies found about the March time change?",
    "opts": [
     "People sleep longer during the following week.",
     "Car accidents become less common in the evening.",
     "Heart attacks and strokes rise right after it.",
     "Most adults feel happier the next day."
    ],
    "a": 2,
    "exp": "原文 \"Some studies have found an increase in heart attacks and strokes right after the March time change\"，rise 替换 increase。原文说次日会 tired and perhaps unhappy，与最后一项相反。"
   },
   {
    "q": "What happens when people get too much light in the evening?",
    "opts": [
     "The rise in melatonin comes later than usual.",
     "The body produces melatonin much earlier.",
     "People wake up earlier the next morning.",
     "Blood pressure falls during the night."
    ],
    "a": 0,
    "exp": "原文 \"Too much light in the evening ... delays the melatonin increase\"，comes later 替换 delays。"
   },
   {
    "q": "When is the risk of deadly car crashes highest after the spring change?",
    "opts": [
     "In the evening of the first Monday.",
     "About two weeks after the change.",
     "Late at night before the clocks change.",
     "In the mornings of the first few days."
    ],
    "a": 3,
    "exp": "原文 \"Deadly car crash numbers increase the first few days after the spring time change ... The risk of crashes is highest in the morning\"。"
   },
   {
    "q": "What do health groups like the American Medical Association suggest?",
    "opts": [
     "Keeping daylight saving time all year round.",
     "Keeping standard time throughout the whole year.",
     "Moving the spring time change to November.",
     "Going to bed earlier every Sunday night."
    ],
    "a": 1,
    "exp": "原文 \"staying with standard time year-round works better for human biology and sleep needs\"，throughout the whole year 替换 year-round。第一个干扰项把 standard time 换成 daylight saving time。"
   }
  ]
 },
 {
  "id": "real7",
  "title": "Study: Electrical Medical Device Helps Improve Muscle Strength",
  "date": "2025-02-20",
  "src": "assets/audio/real7.m4a",
  "dur": 325.1,
  "url": "https://learningenglish.voanews.com/a/study-electrical-medical-device-helps-improve-muscle-strength-/7972394.html",
  "words": 518,
  "script": "Researchers recently reported new evidence from a study of a medical device placed inside the body, a spine-stimulating implant.\nThree people with a muscle-destroying disease got a little stronger after using the implant. They were able to stand and walk more easily because of electrical stimulation to their spinal cord.\nMarco Capogrosso is an assistant professor at the University of Pittsburg, or Pitt, who led the research. \"These people were definitely not expecting an improvement,\" he said. Capogrosso said, \"They were getting better and better,\" over the study that lasted one month.\nReturning muscle function\nThe implant was able to return some muscle function, at least temporarily. The implant was already being tested to treat paralysis in other patients. This new evidence suggests it might also aid diseases of the nervous system like spinal muscle atrophy, or SMA.\nSMA is a genetic disease that slowly destroys motor neurons, nerve cells in the spinal cord that control muscles. That leads muscles to waste away, especially in the legs, hips, and shoulders and sometimes those involved with breathing and swallowing. There is no cure. A gene therapy can save the lives of very young children with a severe form of the disease, and there are some medicines to slow the disease in older patients.\nStimulating the spinal cord with low levels of electricity has long been used to treat chronic, or long-term, pain. Capogrosso's team also has tested it to help people paralyzed by strokes or spinal cord injury move their arms and legs with assistance. The system sends electrical signals to nerves that have stopped reacting. This has the effect of activating the muscles.\nCapogrosso wondered if that same technology might help patients with SMA by stimulating sensory nerves to signal damaged muscle cells causing them to move. The researchers at the University of Pittsburgh published their study in Nature Medicine.\nThey implanted electrodes over the lower spinal cord of the three adults with SMA. Using the device did not return normal movement but with a few hours of spinal stimulation a week, all soon experienced improvements in muscle strength and function, the researchers wrote.\n\"You never get better\"\nFifty-seven-year-old Doug McCullough took part in the study. \"With a progressive disease you never get any better,\" he said, adding, “So having any improvement is just a really surreal and very exciting benefit.\"\nAll three subjects increased how far they could walk in six minutes by the study's end.\nCapogrosso said they could walk farther because they got less tired and “even a person this many years into the disease can improve.\"\nResearchers found the improvements did not disappear as soon as the stimulator was turned off. But they did decrease a few months after the study ended.\nNeuroscientist Susan Harkema led similar studies of stimulation for spinal cord injuries while at the University of Louisville. She warned that the new study is small and did not last very long but said it was an important test of the device. She said it should be tested next with other muscle-degenerating diseases.\nCapogrosso said some small but longer studies are beginning.",
  "questions": [
   {
    "q": "What did the study find about the spine-stimulating implant?",
    "opts": [
     "It fully restored normal walking in all patients.",
     "It made patients with a muscle disease somewhat stronger.",
     "It cured a genetic disease of the nervous system.",
     "It reduced long-term pain in stroke patients."
    ],
    "a": 1,
    "exp": "原文 \"Three people with a muscle-destroying disease got a little stronger after using the implant\"，somewhat 替换 a little。原文说 \"did not return normal movement\" 且 SMA \"There is no cure\"。"
   },
   {
    "q": "What does SMA do to the body?",
    "opts": [
     "It slowly destroys nerve cells that control muscles.",
     "It damages the brain areas used for speech.",
     "It causes sudden paralysis after an injury.",
     "It weakens the bones in the legs and hips."
    ],
    "a": 0,
    "exp": "原文 \"SMA is a genetic disease that slowly destroys motor neurons, nerve cells in the spinal cord that control muscles\"。腿、臀部是肌肉萎缩的部位，不是骨头变弱。"
   },
   {
    "q": "Why could the patients walk farther by the end of the study?",
    "opts": [
     "They also received gene therapy.",
     "They used the device for hours every day.",
     "Their damaged nerve cells grew back completely.",
     "They did not get tired as quickly."
    ],
    "a": 3,
    "exp": "原文 \"they could walk farther because they got less tired\"。使用频率是 \"a few hours of spinal stimulation a week\"，不是每天。"
   },
   {
    "q": "What does Susan Harkema say about the new study?",
    "opts": [
     "It proved the device works for every disease.",
     "It lasted too long to be practical for patients.",
     "It was limited in size but still important.",
     "It should not be repeated with other diseases."
    ],
    "a": 2,
    "exp": "原文 \"the new study is small and did not last very long but said it was an important test of the device\"，limited in size 替换 small。她建议 \"should be tested next with other muscle-degenerating diseases\"，与最后一项相反。"
   }
  ]
 },
 {
  "id": "real8",
  "title": "How to Lower Your Risk of Dementia Starting in Middle Age",
  "date": "2025-02-10",
  "src": "assets/audio/real8.m4a",
  "dur": 363.4,
  "url": "https://learningenglish.voanews.com/a/how-to-lower-your-risk-of-dementia-starting-in-middle-age/7937612.html",
  "words": 694,
  "script": "New research suggests the risk of Americans developing dementia over a lifetime may be much higher than once thought. A new study predicts about one million Americans will likely develop the disease each year by 2060. That is about twice the number of people estimated in earlier studies.\nThe new finding is based on a large study involving a team from major U.S. medical centers and other research organizations. It recently appeared in the publication Nature Medicine. The study found that after age 55, people face up to a 42 percent chance of developing dementia, if they live long enough.\nThe research showed the risk of dementia is highest after age 75. But the good news is that there are steps people can take to reduce the risks. One of them is controlling high blood pressure and other conditions, such as diabetes or being severely overweight, meaning obese. Health experts advise everyone, even those in middle age, to take steps to avoid such problems.\nDr. Josef Coresh of NYU Langone Health was a lead writer of the study. He told The Associated Press, \"All of our research suggests what you do in midlife really matters.”\nWhat is Dementia?\nIt can be quite common for older people to take longer to remember a name or where they placed certain objects. But research on dementia suggests it is not a normal part of aging. Rather, the disease is a progressive loss of memory, language and other cognitive abilities over time. Getting older is currently the biggest risk and the U.S. population is aging at a fast rate.\nDementia has many forms, the most common being Alzheimer's. Because the disease is linked to silent changes in the brain, signs or symptoms of dementia might not start showing until many years later. Other kinds include vascular dementia, when heart disease or small strokes limit blood flow to the brain. Many people also have mixed causes, meaning vascular problems could worsen existing dementia.\nDr. James Galvin is an Alzheimer's specialist at the University of Miami. He noted that aging by itself is \"not a guarantee that someone will develop dementia.\" Galvin was not involved in the new study. But he said the latest findings on that support previous research.\nDementia risk by age\nEarlier studies estimated about 14 percent of men and 23 percent of women would develop some form of dementia during their lifetime. Since women live longer than men, they are more likely to get it.\nBut the latest research examined more recent data from a U.S. study that followed the heart health and cognitive abilities of about 15,000 older adults from 1987 until 2020. In that group, the risk for dementia averaged 35 percent for men and 48 percent for women.\nOne reason for the different rates is that the group of people studied lived longer. The study shows how the risk changes with additional years of life. Only 4 percent of people developed dementia between the ages of 55 and 75. Coresh describes this difference as an important 20-year window for protecting brain health. For people surviving common health threats until 75, the dementia risk then jumped — to 20 percent by age 85 and 42 percent between the ages of 85 and 95.\nBlack Americans had a slightly higher risk, 44 percent, than white individuals at 41 percent.\nWays to help lower dementia risk\nThere are some health risks people cannot control. Besides age, people can inherit a gene version, or variant, called APOE4. This can raise the risk of getting Alzheimer's later in life.\nBut medical researchers have identified some things people can do to delay, or possibly even prevent developing dementia. The University of Miami’s Galvin advises people to exercise, avoid obesity and control blood pressure. He noted that, \"What's good for your heart is good for your brain.”\nStay socially and cognitively active, too, Galvin said. He urges people to try hearing aids if age brings hearing loss, which can create social isolation. He added, \"There are things that we have control over, and those things I think would be really, really important to build a better brain as we age.\"",
  "questions": [
   {
    "q": "What does the new research suggest about dementia in America?",
    "opts": [
     "New cases will fall by half by 2060.",
     "It is a normal part of growing older.",
     "Most people develop it before age 55.",
     "The lifetime risk is much higher than once believed."
    ],
    "a": 3,
    "exp": "原文 \"the risk of Americans developing dementia over a lifetime may be much higher than once thought\"，once believed 替换 once thought。原文预测 2060 年病例约是早前估计的两倍；且明说 dementia \"is not a normal part of aging\"。"
   },
   {
    "q": "According to Dr. Josef Coresh, what really matters for dementia risk?",
    "opts": [
     "Starting medical treatment after age 75.",
     "What people do during middle age.",
     "Taking genetic tests early in childhood.",
     "Avoiding all hospital visits in old age."
    ],
    "a": 1,
    "exp": "原文 \"what you do in midlife really matters\"，during middle age 替换 in midlife。75 岁后是风险最高的阶段，不是起作用的时期。"
   },
   {
    "q": "Why did the latest study find higher dementia rates than earlier studies?",
    "opts": [
     "The people it studied lived longer lives.",
     "More women than men took part in it.",
     "It included only patients with heart disease.",
     "It used a newer test for Alzheimer's."
    ],
    "a": 0,
    "exp": "原文 \"One reason for the different rates is that the group of people studied lived longer\"。女性寿命更长是用来解释男女差异的，属张冠李戴。"
   },
   {
    "q": "Why does Dr. Galvin urge people to try hearing aids?",
    "opts": [
     "Hearing loss is the first sign of Alzheimer's.",
     "Hearing aids can lower high blood pressure.",
     "Hearing loss can leave people socially isolated.",
     "Hearing aids directly repair damaged memory."
    ],
    "a": 2,
    "exp": "原文 \"He urges people to try hearing aids if age brings hearing loss, which can create social isolation\"，leave people socially isolated 替换 create social isolation。"
   }
  ]
 },
 {
  "id": "real9",
  "title": "Visitors Laugh Away Troubles at the HaHaHouse Museum",
  "date": "2025-02-14",
  "src": "assets/audio/real9.m4a",
  "dur": 266.7,
  "url": "https://learningenglish.voanews.com/a/visitors-laugh-away-troubles-at-the-hahahouse-museum-/7973482.html",
  "words": 460,
  "script": "A new museum of laughter in Croatia is offering to help people deal with the negativity of modern life.\nVisitors to the HaHaHouse in the Croatian capital Zagreb walk into a little cloud of white smoke when they step inside. Its purpose is to blow away their worries before they climb into a \"giant washing machine\".\nThen they move down a twisting slide into a space filled with little white balls where their trip to a happier place starts.\nForty-three-year-old Andrea Golubic is the museum’s creator. Golubic said she got the idea during the COVID-19 pandemic. At that time, many people were feeling down, depressed and alone: \"I realized that I had a mission -- to heal people with laughter.\"\nThe idea \"came straight from the heart\", Golubic told the French News Agency (AFP). She had ideas for many of the museum elements in one day: “that's how the HaHaHouse began.\"\nGolubic said a picture of her when she was seven-year-old inspired her. “I was constantly joking as a kid,\" she added.\nVisitors press a button to be \"disinfected from negativity\" as soon as they step inside the museum, which has eight interactive zones, or areas.\nOne has rubber chickens singing cheerfully. They sing songs like ABBA's \"Dancing Queen.\" There is a karaoke room with distorted voices and a \"Sumo Arena\" for wrestling in puffed up clothes.\nThere is also some serious history of humor from ancient to modern times told through theatre, film or the internet.\nThe museum also explains different kinds of humor. These include word play, slapstick, dark humor and satire.\nInner child\nGolubic said the HaHaHouse is popular with everyone from small children to older people. Adults say it is a good excuse to act like a child.\n\"All those who still feel a bit of childish joy and embrace their inner child, will recharge themselves,\" she said.\nRetiree Bruno Dadic told AFP he was pleased by his visit \"as there is never enough humor in life.\n\"Laughter is a medicine for the soul,\" he said.\nAleksandar Suka celebrated his fifth birthday with a visit. Visiting with his mother, the little boy said he liked lying on the \"Bed of Nails\" since they tickled him.\nSinger Zorica Bucic, from the coastal town of Split, said the museum was just right for our times.\n\"Entering here is like entering childhood, being relieved of all problems,” she said. Bucic added that if you could come to museum often, you would not need to visit a psychologist.\nPsychologist Petar Kraljevic told AFP that laughter is a kind of weapon which gives people strength to face their problems. He said that if doctors could advise their patients to have \"three hours of laughter” a day, people would feel much better.",
  "questions": [
   {
    "q": "What is the main purpose of the HaHaHouse?",
    "opts": [
     "To teach children the history of theatre.",
     "To help people handle negativity through laughter.",
     "To train comedians in different kinds of humor.",
     "To raise money for mental health services."
    ],
    "a": 1,
    "exp": "原文 \"A new museum of laughter in Croatia is offering to help people deal with the negativity of modern life\"，handle 替换 deal with。幽默史只是馆内一部分内容。"
   },
   {
    "q": "When did Andrea Golubic get the idea for the museum?",
    "opts": [
     "When she was seven years old.",
     "After visiting a museum in Split.",
     "While working with a psychologist.",
     "During the pandemic, when many people felt lonely."
    ],
    "a": 3,
    "exp": "原文 \"Golubic said she got the idea during the COVID-19 pandemic. At that time, many people were feeling down, depressed and alone\"，lonely 替换 alone。七岁的照片只是给她灵感，不是产生想法的时间。"
   },
   {
    "q": "What do adult visitors say about the museum?",
    "opts": [
     "It gives them a reason to act like children.",
     "It is designed mainly for small children.",
     "It teaches them to handle stress at work.",
     "It is too noisy for older visitors."
    ],
    "a": 0,
    "exp": "原文 \"Adults say it is a good excuse to act like a child\"，a reason 替换 a good excuse。原文说它受 \"everyone from small children to older people\" 欢迎，并非主要为儿童设计。"
   },
   {
    "q": "What does psychologist Petar Kraljevic believe about laughter?",
    "opts": [
     "It can replace visits to a psychologist.",
     "Doctors already prescribe it to their patients.",
     "It gives people strength to deal with problems.",
     "Three hours of it a day is too much."
    ],
    "a": 2,
    "exp": "原文 \"laughter is a kind of weapon which gives people strength to face their problems\"，deal with 替换 face。不用看心理医生是歌手 Bucic 的话，属张冠李戴；三小时是他的假设建议，并非医生已在做。"
   }
  ]
 },
 {
  "id": "real10",
  "title": "What Is Art Deco and Why Is It Popular Again?",
  "date": "2025-01-17",
  "src": "assets/audio/real10.m4a",
  "dur": 336.9,
  "url": "https://learningenglish.voanews.com/a/what-is-art-deco-and-why-is-it-popular-again-/7935369.html",
  "words": 591,
  "script": "Art Deco is an international artistic style that was popular in the 1920s and 1930s.\nNow, interest in the style and its qualities is growing. A new generation is enjoying the style’s roots and turning it into something new.\nA public showing, or exhibition, at the Museum of the City of New York provides a look at the style that helped define the city 100 years ago.\nFamous Art Deco buildings include the Chrysler Building, the Empire State Building, Rockefeller Center and Radio City Music Hall.\nThe public showing, called “Art Deco City: New York Postcards from the Leonard A. Lauder Collection,” also has clothing and film clips from the time.\nIn London, the Victoria and Albert Museum has a collection of day and evening clothing, jewelry and more. The collection comes from Les Ballets Russes, a dance company that had a major effect on fashion.\nAnd in Paris, organizers of the 2024 Olympics created Art Deco posters last year to celebrate the games and mark the one hundred years since the 1924 Olympics, which Paris also hosted.\nA style of the 1920s and 30s\nExperts have different opinions about Art Deco. Design writer Arricca Elin Sansone, for example, said last year in Elle Décor magazine: “Ask three historians to define the term Art Deco, and you’ll likely get three varying answers.”\nAppearing after World War I, the first Art Deco era had a spirit of creativity and freedom. With the aim of appearing modern, the style became one of the most important forms of design in the 1920s and early 1930s.\nThe Art Deco style is believed to have first appeared at the 1925 International Exhibition of Modern Decorative and Industrial Arts, in Paris.\nThe early 1930s saw the development of the style in Miami where South Beach’s Art Deco District is popular with visitors and a center for design.\nIn some large cities, low-rise buildings of two or three floors turned into landscapes of high-rise skyscrapers. Public and private spaces showed themes involving geometrical designs and luxurious materials.\nIn transportation, faster cars and better trains suggested a new age while jazz music urged people to celebrate.\n“A fashionable renaissance”\nThe same energy can be found in today’s fashion shows and red-carpet events for stars. Some of today’s colorful clothing suggests the Jazz Age, another name for the period when Art Deco was popular. Stars like Zendaya, Gigi Hadid, Beyoncé and Demi Lovato have used elements of the Deco era in new ways.\n“The aesthetic of the 1920s is enjoying a fashionable renaissance,” said Kirsty Thatcher of the Australian fashion magazine Russh. A “renaissance” represents a rebirth of something from the past.\nNew York-based interior designer Vanessa DeLeon told the Associated Press, “The boldness and elegance of Art Deco are what appeals to me.”\nJamie Watkins and Tom Kennedy of the London design company Divine Savages include Art Deco elements in their collections of products for the home. Watkins suggested: “It’s no wonder we’re drawn to it again.”\nLynda Klich is the co-organizer or curator of the exhibition at the Museum of the City of New York. Klich noted that postcards were the social media of their day. Travelers at the time busily wrote messages to friends and family. New York’s famous Art Deco buildings appear in over 250 postcards. There is also a selection of clothing from the 1920s, shoes and other objects.\n“Art Deco was the look that sold the city to the world,” said co-curator Lilly Tuttle.\nThe exhibition in New York City runs through February 17.",
  "questions": [
   {
    "q": "What does the speaker say about Art Deco today?",
    "opts": [
     "It first appeared in New York in the 1930s.",
     "It is now used mainly in sports posters.",
     "Experts fully agree on how to define it.",
     "Interest in the style is growing again."
    ],
    "a": 3,
    "exp": "原文 \"Now, interest in the style and its qualities is growing. A new generation is enjoying the style's roots\"。巴黎奥运海报只是例子之一。"
   },
   {
    "q": "What point does design writer Arricca Elin Sansone make?",
    "opts": [
     "Historians define the term Art Deco differently.",
     "Art Deco was most important after the 1940s.",
     "Art Deco developed first in Miami's South Beach.",
     "Historians are losing interest in Art Deco."
    ],
    "a": 0,
    "exp": "原文 \"Ask three historians to define the term Art Deco, and you'll likely get three varying answers\"，define differently 替换 varying answers。"
   },
   {
    "q": "Where is Art Deco believed to have first appeared?",
    "opts": [
     "At the 1924 Olympic Games in Paris.",
     "In Miami during the early 1930s.",
     "At a design exhibition held in Paris in 1925.",
     "At a museum collection in London."
    ],
    "a": 2,
    "exp": "原文 \"first appeared at the 1925 International Exhibition of Modern Decorative and Industrial Arts, in Paris\"。1924 年巴黎奥运和 30 年代的 Miami 都是原文提到的干扰信息。"
   },
   {
    "q": "What does curator Lynda Klich say about postcards from that period?",
    "opts": [
     "They were mostly sent by famous architects.",
     "They were the social media of their time.",
     "They showed more clothing than buildings.",
     "They were sold only to foreign visitors."
    ],
    "a": 1,
    "exp": "原文 \"Klich noted that postcards were the social media of their day\"，of their time 替换 of their day。"
   }
  ]
 },
 {
  "id": "real11",
  "title": "Researchers Use Chemical Examinations and Human Smell to Study Ancient Remains",
  "date": "2025-02-21",
  "src": "assets/audio/real11.m4a",
  "dur": 341.6,
  "url": "https://learningenglish.voanews.com/a/researchers-use-chemical-examinations-and-human-smell-to-study-ancient-remains/7980863.html",
  "words": 574,
  "script": "A recent study about the smell of Egyptian mummies reached some surprising findings. The ancient bodies did not smell bad, the researchers found. Instead, they say, the remains mostly smelled good.\nCecilia Bembibre is director of research at University College London's Institute for Sustainable Heritage. “In films and books, terrible things happen to those who smell mummified bodies,” she said. “We were surprised at the pleasantness of them.\"\nThe researchers reported the leading descriptions of the smells as “woody,” “spicy” and “sweet.” They also reported a floral or flowery smell. That smell could be from pine and juniper resins used in mummification; a process designed to protect the body from decay.\nThe study appeared recently in the Journal of the American Chemical Society. It used both chemical examinations and several human smellers to study nine mummies. The mummies, some around 5,000 years old, had been housed at the Egyptian Museum in Cairo.\nBembibre, one of the report’s writers, said the researchers wanted to study the smell of mummies because it has long been a subject of interest for the public and researchers alike.\nShe added that even fiction writers have written pages of work on the subject — for good reason.\nScent, or smell, was an important consideration in the mummification process. This process used oils and plant-based materials to protect the body and its spirit for the afterlife. Mummification was largely used for powerful people such as pharaohs and other leaders.\nPleasant smells were linked with purity and gods. Bad smells were signs of corruption and decay.\nResearchers did not want to directly measure the mummies, because doing so might be damaging. Instead, researchers were able to take measurements that did not involve touching the mummies. Researchers from UCL and the University of Ljubljana in Slovenia were able to measure smells, pesticides, and other effects due to mold, bacteria or microorganisms.\nUsing technical instruments to measure air molecules released from sarcophagi was very important, said Matija Strlič, a chemistry professor at the University of Ljubljana.\n\"It tells us potentially what social class a mummy was from and therefore reveals a lot of information about the mummified body....\" he said. “We believe that this approach is potentially of huge interest to other types of museum collections.”\nBarbara Huber of the Max Planck Institute of Geoanthropology in Germany was not involved in the study. Huber said the findings provide important data on compounds that could preserve or damage mummified remains. The information could be used to better protect the ancient bodies for future generations.\nHuber said that over thousands of years, differing conditions have changed the scents of the mummies in a major way.\nHuber wrote a study two years ago that examined a jar that had contained mummified organs of a woman. The goal was to identify the material used to preserve the organs and what that would show about ancient trade paths.\nResearchers of the current study hope to do something similar. They want to use their findings to develop “smellscapes” to recreate the scents they discovered. They also want to change the experience for future museumgoers.\nBembibre said museums generally ask visitors to experience everything with their eyes. She added that seeing mummies through “a glass case reduces the experience because we don’t get to smell them.”\nSmelling the scents of mummification would improve the museum visitors’ experiences, she suggested, as smell is one of the ways that people understand the world.",
  "questions": [
   {
    "q": "What did the recent study find about the Egyptian mummies?",
    "opts": [
     "They smelled much worse than films suggest.",
     "Their smells had stayed the same for centuries.",
     "They mostly gave off pleasant smells.",
     "They were damaged by the human smellers."
    ],
    "a": 2,
    "exp": "原文 \"The ancient bodies did not smell bad... the remains mostly smelled good\"，gave off pleasant smells 替换 smelled good。Huber 指出几千年来气味已大幅改变，故\"气味未变\"错；研究刻意避免接触木乃伊，未造成损坏。"
   },
   {
    "q": "Why did the researchers avoid measuring the mummies directly?",
    "opts": [
     "Doing so might cause damage to them.",
     "The museum in Cairo refused to give permission.",
     "The smells were too weak to be measured.",
     "Mold and bacteria made the work unsafe."
    ],
    "a": 0,
    "exp": "原文 \"Researchers did not want to directly measure the mummies, because doing so might be damaging\"，cause damage 对应 be damaging。霉菌、细菌是测量对象而非不直接测量的原因，博物馆拒绝未提及。"
   },
   {
    "q": "According to Matija Strlič, what can the air measurements reveal?",
    "opts": [
     "Which ancient trade paths the Egyptians used.",
     "The exact age of each mummified body.",
     "Which oils were sold in ancient Cairo.",
     "What social class a mummy came from."
    ],
    "a": 3,
    "exp": "原文 \"It tells us potentially what social class a mummy was from\"。古代贸易路线是 Huber 两年前研究罐子时想弄清的问题，属张冠李戴；年代、油料买卖均非其所述。"
   },
   {
    "q": "What does Bembibre suggest about museum visits?",
    "opts": [
     "Visitors should mainly rely on their eyes.",
     "It would improve visitors' experiences.",
     "Mummies should be taken out of glass cases.",
     "Smellscapes would protect mummies from decay."
    ],
    "a": 1,
    "exp": "原文 \"Smelling the scents of mummification would improve the museum visitors' experiences\"，make visits more meaningful 同义改写 improve experiences。博物馆一般只让人用眼看是她批评的现状；她只说玻璃柜削弱体验，并未建议取出木乃伊。"
   }
  ]
 },
 {
  "id": "real12",
  "title": "Researchers: Oldest Evidence of Lead Pollution Found in Greece",
  "date": "2025-02-09",
  "src": "assets/audio/real12.m4a",
  "dur": 270.9,
  "url": "https://learningenglish.voanews.com/a/researchers-oldest-evidence-of-lead-pollution-found-in-greece/7962381.html",
  "words": 432,
  "script": "Ancient Greece produced the earliest records of democracy - and, scientists now say, lead pollution.\nThat is the finding of a study that recently appeared in Communications Earth and Environment. The researchers studied sediment cores removed from mainland Greece and below the Aegean Sea. They found in the cores the oldest known evidence of lead pollution in the environment dating back around 5,200 years.\nThat is 1,200 years older than the former oldest evidence of lead pollution. That evidence was discovered in Serbia.\nIn ancient times, lead was released into the atmosphere as a product of copper and silver production. The toxic, or poisonous, metal turned to dust over time and settled onto the soil.\nJoseph Maran of Heidelberg University was a co-writer of the new study.\n“Silver was used for jewelry, for special objects — but it wasn't found in a pure state,” it was mined in ore combined with lead, Maran said\nThe place with the earliest signs of lead is in northeastern Greece, near the island of Thasos. Past evidence suggests Thasos was one of the area’s most important places for silver mining and metalwork, said Maran.\nYale historian Joseph Manning, who was not involved in the study, said “Lead released from smelting is the world’s first form of toxic or industrial pollution.”\nThe researchers found that levels of lead contamination remained fairly low in ancient Greece. The levels remained low throughout the Bronze Age, the Classical period and the Hellenistic period. The Classical period is famous for Athenian democracy, and the thinkers Socrates and Plato. And the Hellenistic period saw Greek cultural influence reach its height across the Mediterranean.\nBut the new study shows that around 2,150 years ago “a very strong and abrupt increase\" in lead releases caused by human activities took place across Greece, said co-writer Andreas Koutsodendris of Heidelberg University.\nAround that time, the Roman army won control of the Greek peninsula, completely changing the area’s society and economy. As Roman trade, colonies and shipping grew across the Mediterranean Sea and Black Sea, demand for silver coins also grew. As a result, more smelting was required, Koutsodendris said.\nLater the Roman Empire used lead to make tools for eating and building, including pipes.\nPast research – including a study of ice cores from Greenland – had detected high levels of lead across much of the Northern Hemisphere during Roman times.\nBut the new study adds a more exact “and local picture to how lead levels changed,” said Nathan Chellman. Chellman, an environmental scientist at the University of Nevada, Reno, was not involved in the research.",
  "questions": [
   {
    "q": "What did the researchers find in the sediment cores?",
    "opts": [
     "The earliest written records of ancient democracy.",
     "The oldest known evidence of lead pollution.",
     "Signs that lead pollution first began in Serbia.",
     "Lead pollution dating back about 1,200 years."
    ],
    "a": 1,
    "exp": "原文 \"They found in the cores the oldest known evidence of lead pollution in the environment dating back around 5,200 years\"。1,200 年是比塞尔维亚旧证据早出的年数，不是年代本身；塞尔维亚是原先最早证据的出处，民主只是开篇类比。"
   },
   {
    "q": "How was lead released into the air in ancient times?",
    "opts": [
     "Through burning wood for heating and cooking.",
     "From pipes and tools used for building.",
     "By mining pure silver to make jewelry.",
     "As a byproduct of copper and silver production."
    ],
    "a": 3,
    "exp": "原文 \"lead was released into the atmosphere as a product of copper and silver production\"，byproduct 替换 a product of。用铅做管道工具是后来罗马帝国的事；Maran 明确说银并非以纯净状态存在。"
   },
   {
    "q": "What caused the sharp rise in lead releases about 2,150 years ago?",
    "opts": [
     "Rising demand for silver coins under Roman control.",
     "Greek culture spreading across the Mediterranean region.",
     "Athenian democracy encouraging trade in metals.",
     "The discovery of new silver mines near Thasos."
    ],
    "a": 0,
    "exp": "原文 \"the Roman army won control of the Greek peninsula... demand for silver coins also grew. As a result, more smelting was required\"。希腊文化影响达到顶峰是希腊化时期，彼时铅含量仍低；雅典民主同属低污染的古典时期。"
   },
   {
    "q": "What does Nathan Chellman say about the new study?",
    "opts": [
     "It challenges the findings from Greenland ice cores.",
     "It proves lead levels stayed low in Roman times.",
     "It offers a more exact local picture of lead levels.",
     "It shows the Romans first used lead for pipes."
    ],
    "a": 2,
    "exp": "原文 \"the new study adds a more exact 'and local picture to how lead levels changed'\"，offers 替换 adds。新研究是在格陵兰冰芯研究基础上补充而非推翻；罗马时期铅含量高而非低。"
   }
  ]
 },
 {
  "id": "real13",
  "title": "Study: Millions of Europeans Could Die from Heat by 2100",
  "date": "2025-02-06",
  "src": "assets/audio/real13.m4a",
  "dur": 290.6,
  "url": "https://learningenglish.voanews.com/a/study-millions-of-europeans-could-die-from-heat-by-2100/7957412.html",
  "words": 443,
  "script": "A new study warns that millions of Europeans could die from heat-related causes by the end of the century.\nThe study was based on computer simulations of predicted climate activity in 854 different European cities. It found that extreme temperatures, mostly heat, could kill as many as 2.3 million people in Europe by 2100.\nThe researchers said the number of predicted deaths could be reduced if nations are able to find better ways of cutting carbon pollution levels and dealing with extreme heat.\nCurrently, cold weather kills far more people in Europe than hot weather. But the study found that as temperatures continue to rise, deaths from cold weather will lessen over time. However, heat-related deaths are predicted to rise sharply.\nScientists at the London School of Hygiene and Tropical Medicine led the research. The results appeared recently in a study in the publication Nature Medicine.\nThe researchers urged increased efforts to reduce greenhouse gases and expand indoor air-cooling systems and cooling centers in parts of Europe. Without such efforts, places in Italy, southern Spain and Greece are likely to see large increases in heat deaths related to climate change, the study found.\nOn the other hand, much of Scandinavia and Britain are predicted to see fewer temperature-related deaths, largely because low temperatures are expected to become more moderate.\nPierre Masselot studies the environmental effects of human health at the London School of Hygiene and Tropical Medicine. He helped lead the research.\nMasselot told the Associated Press that drops in cold deaths in northern parts of Europe are happening in areas not as populated as places further south. “The Mediterranean is a so-called climate hotspot,\" he said. \"It's a region that is warming much quicker than the rest of the world. And Malta is right in the middle of it.”\nThe study predicts Malta’s temperature-related deaths will increase by 269 people for every 100,000 individuals by the end of the century. On the other hand, Ireland’s rate is expected to drop slightly to 15 per 100,000 people.\nEuropean officials reported several heat waves have killed thousands of people in recent years across the continent. The highest number was in 2003, when about 70,000 deaths were recorded.\nAmong the areas predicted to see the most deaths from future temperature rises is Barcelona, Spain. The study found almost 250,000 people could die from temperature-related causes in that city by 2100. And the study warned that Rome and Naples could have up to 150,000 deaths.\nThe study predicted that more than 5.8 million extra heat deaths would be linked to climate change. At the same time, the study found cold-related deaths would drop by 3.5 million.",
  "questions": [
   {
    "q": "What does the new study warn about Europe?",
    "opts": [
     "Up to 2.3 million people could die from extreme temperatures.",
     "Cold weather will remain the main killer by 2100.",
     "Heat deaths in 854 cities have already doubled.",
     "About 70,000 people will die from heat every year."
    ],
    "a": 0,
    "exp": "原文 \"extreme temperatures, mostly heat, could kill as many as 2.3 million people in Europe by 2100\"，up to 替换 as many as。854 是模拟的城市数；70,000 是 2003 年热浪的死亡人数；研究预测寒冷致死会减少。"
   },
   {
    "q": "What is true about temperature-related deaths in Europe today?",
    "opts": [
     "Heat already kills more people than cold does.",
     "Deaths from both heat and cold are falling.",
     "Cold weather kills far more people than hot weather.",
     "Cold-related deaths are rising sharply each year."
    ],
    "a": 2,
    "exp": "原文 \"Currently, cold weather kills far more people in Europe than hot weather\"。热死人数大幅上升是对未来的预测，不是现状，且 rise sharply 说的是热而非冷。"
   },
   {
    "q": "What did the researchers urge some parts of Europe to do?",
    "opts": [
     "Move people from southern Spain to northern Europe.",
     "Expand indoor air-cooling systems and cooling centers.",
     "Build more heating systems in Scandinavia and Britain.",
     "Stop counting deaths caused by extreme heat waves."
    ],
    "a": 1,
    "exp": "原文 \"The researchers urged increased efforts to reduce greenhouse gases and expand indoor air-cooling systems and cooling centers\"。斯堪的纳维亚和英国预计温度相关死亡会减少，并无增建供暖的建议；迁移人口未提及。"
   },
   {
    "q": "What does the study predict about climate-linked deaths overall?",
    "opts": [
     "Cold-related deaths will fall by 5.8 million.",
     "Rome will see more deaths than Barcelona.",
     "Ireland's death rate will rise to 269 per 100,000.",
     "Extra heat deaths will far exceed the drop in cold deaths."
    ],
    "a": 3,
    "exp": "原文 \"more than 5.8 million extra heat deaths... cold-related deaths would drop by 3.5 million\"，580 万多于 350 万，即增加的热死亡远超减少的冷死亡。选项把两个数字对调；巴塞罗那约 25 万多于罗马、那不勒斯的 15 万；269 是马耳他的数据，爱尔兰是降到 15。"
   }
  ]
 },
 {
  "id": "real14",
  "title": "Study Finds India’s Tiger Population Doubled in 12 Years",
  "date": "2025-02-05",
  "src": "assets/audio/real14.m4a",
  "dur": 356.9,
  "url": "https://learningenglish.voanews.com/a/study-finds-india-s-tiger-population-doubled-in-12-years/7958833.html",
  "words": 516,
  "script": "A recent study says India has doubled its tiger population in 12 years.\nResearchers said the gain came from efforts to protect the big cats from hunters, and to protect against the loss of tiger habitat and prey, among other things.\nThe National Tiger Conservation Authority said the number of tigers grew from an estimated 1,706 in 2010 to around 3,682 in 2022. Those numbers mean India is home to about 75 percent of the total tiger population.\nThe research shows that a reduction in conflict between humans and wildlife also played a part in the population growth. The study credited efforts to improve economic conditions for communities near tiger habitats. The researchers said the growth in the tiger population also led to improvements in local economies through increased ecotourism.\nThe study appears in the publication Science. It said India's success demonstrates that wildlife protection can help both biodiversity and nearby communities.\n“The common belief is that human densities preclude an increase in tiger populations,\" said Yadvendradev Jhala. Jhala is a scientist at Bengaluru-based Indian National Academy of Sciences and was the study’s lead writer. “What the research shows is that it's not the human density, but the attitude of people, which matters more.”\nWildlife conservationists and ecologists welcomed the study. But they said making the source data available to a larger group of scientists would aid tigers and other wildlife in India. The study was based on data collected by Indian government-supported organizations.\nArjun Gopalaswamy is an ecologist who knows how to measure wildlife populations. He said that estimates from India’s official tiger observation program have been undependable. He said some of the numbers in the study are much higher than past estimates of tiger populations from the same datasets. But he added that the study's findings seem to have corrected a data problem noted repeatedly by scientists since 2011 related to tiger population size and their range.\nThe study said tigers disappeared in some areas. These included habitats that were not near national parks or other protected areas, and areas of increased development, increased human use of forest resources and areas with armed conflict.\n“Without community support and participation and community benefits, conservation is not possible in our country,” said Jhala.\nThat means local people need to see good results from their efforts to save tigers.\nTigers are spread across about 138,200 square kilometers of India. But just 25 percent of the area is rich in tiger prey and is protected. Another 45 percent of tiger habitat is shared with about 60 million people, the study said.\nJhala said strong wildlife protection legislation is the “backbone” of tiger conservation in India. “Habitat is not a constraint, it's the quality of the habitat which is a constraint,” he said.\nWildlife biologist Ravi Chellam, who did not take part in the study, praised the tiger conservation efforts as promising. But, he said, such efforts need to be extended to other wild animals to better care for the whole ecosystem in India.\nChellam said several kinds of Indian wildlife are “on the edge,” and need more attention.",
  "questions": [
   {
    "q": "What does the recent study say about India's tigers?",
    "opts": [
     "Their number fell by about 75 percent since 2010.",
     "Their population reached about 1,706 in 2022.",
     "They have moved into areas with armed conflict.",
     "Their population doubled over a period of 12 years."
    ],
    "a": 3,
    "exp": "原文 \"India has doubled its tiger population in 12 years\"，1,706 (2010) 增至 3,682 (2022)。1,706 是 2010 年数据；75% 是印度老虎占全球的比例；武装冲突地区是老虎消失的地方。"
   },
   {
    "q": "According to Jhala, what matters more for tiger numbers?",
    "opts": [
     "The number of people living near tiger habitats.",
     "People's attitude rather than how many people live nearby.",
     "The total size of forest land for tigers.",
     "Laws that keep villagers out of national parks."
    ],
    "a": 1,
    "exp": "原文 \"it's not the human density, but the attitude of people, which matters more\"，how many people live nearby 解释 human density。人口密度是他否定的常见看法；他还说 \"Habitat is not a constraint\"，故面积不是关键。"
   },
   {
    "q": "What did Arjun Gopalaswamy say about India's official tiger estimates?",
    "opts": [
     "They are freely shared with all scientists.",
     "They have always matched the study's numbers.",
     "They have not always been reliable.",
     "They were collected without government support."
    ],
    "a": 2,
    "exp": "原文 \"estimates from India's official tiger observation program have been undependable\"，not always been reliable 替换 undependable。学者恰恰呼吁公开数据；研究中部分数字远高于以往估计；数据来自政府支持的机构。"
   },
   {
    "q": "What does Ravi Chellam suggest?",
    "opts": [
     "Protection efforts should be extended to other wild animals.",
     "Wildlife protection laws should be made much stronger.",
     "More tigers should be moved into protected areas.",
     "Ecotourism near tiger habitats should be limited."
    ],
    "a": 0,
    "exp": "原文 \"such efforts need to be extended to other wild animals to better care for the whole ecosystem\"。立法是保护\"支柱\"是 Jhala 的说法，属张冠李戴；生态旅游在文中是带来经济好处的正面因素。"
   }
  ]
 },
 {
  "id": "real15",
  "title": "AI Tools Often Used for Fake Product Reviews",
  "date": "2025-01-01",
  "src": "assets/audio/real15.m4a",
  "dur": 481.6,
  "url": "https://learningenglish.voanews.com/a/ai-tools-often-used-for-fake-product-reviews/7911616.html",
  "words": 751,
  "script": "Artificial intelligence (AI) tools that permit people to produce online reviews have put sellers, service providers and buyers in unfamiliar territory, public protection groups and researchers say.\nFalse, or fake, reviews have long appeared on many popular websites such as Amazon and Yelp. The reviews are often traded on private social media groups between fake review dealers and businesses willing to pay. Sometimes, businesses get good reviews in exchange for offering buyers rewards such as gift cards.\nBut AI tools, popularized by OpenAI’s ChatGPT, permit people to produce reviews faster and in greater numbers, technology industry experts say.\nWhere are AI-generated reviews appearing?\nFake reviews are found across a wide range of industries, from e-commerce and travel to services such as home repairs, medical care and music lessons.\nThe Transparency Company is a technology company and public protection group that uses software to detect fake reviews. The company said it started to see AI-generated reviews appear in large numbers in mid-2023. The reviews have increased quickly ever since.\nFor a recently released report, The Transparency Company examined 73 million reviews in three areas: home, legal and medical services. Nearly 14 percent of the reviews were likely fake. The company expressed a “high degree of confidence” that 2.3 million reviews were partly or entirely AI-produced.\nLast September, the Federal Trade Commission (FTC) took legal action against the company behind an AI writing tool and content producer called Rytr. The FTC accused Rytr of offering a service that could pollute the marketplace with fake reviews.\nThe FTC, which banned the sale or purchase of fake reviews in 2024, said some of Rytr’s buyers used the tool to produce hundreds and perhaps thousands of reviews. The reviews appeared in support of garage door repair companies, sellers of copied designer handbags and other businesses.\nWhat are companies doing?\nMajor companies are developing policies for how AI-generated content fits into their systems for removing fake reviews. Some companies already employ special programs and investigative teams to find and remove fake reviews. Still, the companies are giving users some ability to use AI.\nSpokespeople for Amazon and Trustpilot, for example, said they would permit buyers to post AI-assisted reviews as long as the buyers represent their true experience. Yelp has taken a more cautious approach, saying its rules require reviewers to write their own reviews.\nThe Coalition for Trusted Reviews, which Amazon, Trustpilot, Glassdoor, Tripadvisor, Expedia and Booking.com launched last year, said that even though people may put AI to illegal use, the technology also presents “an opportunity to push back against those who seek to use reviews to mislead others.”\nThe FTC’s rule banning fake reviews, which took effect in October, permits the agency to fine businesses and individuals who take part in fake reviews. Tech companies hosting such reviews are protected from the penalty. This is because they are not legally responsible under U.S. law for the content that outsiders post on their websites.\nTech companies, including Amazon, Yelp and Google, have sued fake review dealers they accuse of selling fake reviews on their sites. The companies say their technology has blocked or removed a large number of suspect reviews and suspicious accounts. However, some experts say they could be doing more.\n“Their efforts thus far are not nearly enough,” said Kay Dean, a former federal criminal investigator who runs a public protection group called Fake Review Watch. “If these tech companies are so committed to eliminating review fraud on their platforms, why is it that I, one individual who works with no automation, can find hundreds or even thousands of fake reviews on any given day?”\nFinding fake reviews\nConsumers can try to find fake reviews by watching out for a few possible warning signs, researchers say. Overly good or bad reviews are suspect. Highly specialized terms that repeat a product’s full name or model number are another possible clue.\nWhen it comes to AI, research done by Balázs Kovács, a Yale professor, has shown that people cannot tell the difference between AI-created and human-written reviews. Some AI detectors may also be fooled by shorter texts, which are common in online reviews, the study said.\nHowever, there are some AI clues that online shoppers and service seekers should keep in mind. Panagram Labs says reviews written with AI are often longer, highly structured and include “empty descriptors.” Empty descriptors include general phrases and attributes or characteristics. The writing also often includes overused phrases or opinions like “the first thing that struck me” and “game-changer.”",
  "questions": [
   {
    "q": "What do technology experts say AI tools allow people to do?",
    "opts": [
     "Detect fake reviews more easily than before.",
     "Trade reviews secretly on social media groups.",
     "Produce reviews faster and in greater numbers.",
     "Get gift cards in exchange for good reviews."
    ],
    "a": 2,
    "exp": "原文 \"AI tools... permit people to produce reviews faster and in greater numbers\"。在私密社交群交易评论、用礼品卡换好评都是 AI 出现之前就存在的做法，属提到但不是答案。"
   },
   {
    "q": "What did The Transparency Company find in its recent report?",
    "opts": [
     "Nearly 14 percent of the reviews were likely fake.",
     "About 2.3 million reviews were written entirely by humans.",
     "Most fake reviews were about music lessons.",
     "AI reviews first appeared in large numbers in 2024."
    ],
    "a": 0,
    "exp": "原文 \"Nearly 14 percent of the reviews were likely fake\"。2.3 million 是部分或全部由 AI 生成的评论，选项把关系改反；AI 评论大量出现始于 2023 年中；音乐课只是涉及行业之一。"
   },
   {
    "q": "What does Kay Dean think of the tech companies' efforts?",
    "opts": [
     "They have removed most suspicious accounts.",
     "They are far from enough to stop review fraud.",
     "They depend too heavily on automation.",
     "They should be fined by the FTC."
    ],
    "a": 1,
    "exp": "原文 \"Their efforts thus far are not nearly enough\"，far from enough 替换 not nearly enough。大量删除可疑账号是公司自己的说法；no automation 说的是她本人；平台受法律保护不被罚款。"
   },
   {
    "q": "According to Panagram Labs, what is a sign of an AI-written review?",
    "opts": [
     "It usually repeats a product's model number.",
     "It is usually shorter than human reviews.",
     "It is easy for most readers to spot.",
     "It is often long and highly structured."
    ],
    "a": 3,
    "exp": "原文 \"reviews written with AI are often longer, highly structured and include 'empty descriptors'\"。重复型号是一般虚假评论的线索，非 AI 专属；短文本只是会骗过检测器；Kovács 研究表明人们分辨不出 AI 评论。"
   }
  ]
 },
 {
  "id": "real16",
  "title": "Study: Around Half of US Teens Always Online",
  "date": "2024-12-26",
  "src": "assets/audio/real16.m4a",
  "dur": 262.7,
  "url": "https://learningenglish.voanews.com/a/study-around-half-of-us-teens-always-online/7902911.html",
  "words": 419,
  "script": "Nearly half of American teenagers – children ages 13 to 17 - say they are online “constantly” despite concerns about the effects of social media and smartphones on their mental health.\nThe information comes from a report that was recently released by the Pew Research Center.\nAs in past years, YouTube was the most popular platform teenagers used. Around 90 percent said they watched videos on the website, down slightly from 95 percent in 2022. Nearly 75 percent of those questioned said they visit YouTube every day.\nThere was a small downward change in several popular apps teens used. For example, 63 percent of teens said they used TikTok, down from 67 percent. Snapchat use went to 55 percent from 59 percent. This small decline could be due to pandemic-era restrictions easing up and kids having more time to see friends in person. But the change is probably not big enough to be truly meaningful.\nX saw the biggest decline among teenage users. Only 17 percent of teenagers said they use X, down from 23 percent in 2022, the year Elon Musk bought the platform.\nReddit usage remained the same at 14 percent. About 6 percent of teenagers said they use Threads, Meta’s answer to X that launched in 2023.\nThe report comes as countries around the world try to understand the effects of social media on young people’s well-being.\nAustralia recently passed a law banning children under 16 from social networks. Still, it is unclear how the Australian government will be able to enforce the age limit. It is also unclear whether such a ban will come with unexpected or bad effects, such as isolating some children.\nMeta’s messaging service WhatsApp was different in that it saw the number of teenage users increase to 23 percent from 17 percent in 2022.\nPew also asked teenagers how often they use different online platforms. A small but notable number said they are on them “almost constantly.” For YouTube, 15 percent reported constant use, for TikTok, 16 percent, and for Snapchat, 13 percent.\nAs in previous public opinion studies, girls were more likely to use TikTok almost constantly while boys went to YouTube. There was no meaningful gender difference in the use of Snapchat, Instagram and Facebook.\nAround 25 percent of Black and Hispanic teens said they visit TikTok almost constantly, compared with just 8 percent of white teenagers.\nThe report was based on a public opinion study of 1,391 U.S. teenagers that ran from September 18 to October 10, 2024.",
  "questions": [
   {
    "q": "What does the Pew report find about American teenagers?",
    "opts": [
     "Most of them have cut back on smartphone use.",
     "Nearly half say they are online almost all the time.",
     "Fewer of them go online than in 2022.",
     "They spend more time with friends than online."
    ],
    "a": 1,
    "exp": "原文 \"Nearly half of American teenagers... say they are online 'constantly'\"，almost all the time 替换 constantly。各平台仅小幅下降且不显著；与朋友见面只是对小幅下降的可能解释。"
   },
   {
    "q": "What happened to teenage use of X?",
    "opts": [
     "It stayed the same at 14 percent.",
     "It rose to 23 percent from 17 percent.",
     "It was mostly replaced by Threads.",
     "It saw the biggest decline among all platforms."
    ],
    "a": 3,
    "exp": "原文 \"X saw the biggest decline among teenage users... down from 23 percent in 2022\"。保持 14% 的是 Reddit；从 17% 升到 23% 的是 WhatsApp；Threads 仅约 6%，没说取代 X。"
   },
   {
    "q": "What remains unclear about Australia's new law?",
    "opts": [
     "Whether it covers children under 13 or 16.",
     "Whether other countries will pass similar laws.",
     "How the government will enforce the age limit.",
     "How much it will cost social media companies."
    ],
    "a": 2,
    "exp": "原文 \"it is unclear how the Australian government will be able to enforce the age limit\"。法律明确针对 16 岁以下；文中另一不确定点是是否会带来孤立儿童等副作用，选项均未涉及。"
   },
   {
    "q": "What did the report find about TikTok use?",
    "opts": [
     "Black and Hispanic teens used it constantly more than white teens.",
     "Boys were more likely than girls to use it constantly.",
     "Its use rose from 63 percent to 67 percent.",
     "There was no gender difference in its use."
    ],
    "a": 0,
    "exp": "原文 \"Around 25 percent of Black and Hispanic teens said they visit TikTok almost constantly, compared with just 8 percent of white teenagers\"。女孩更常持续用 TikTok，男孩偏 YouTube；使用率是从 67% 降到 63%；无性别差异的是 Snapchat、Instagram 和 Facebook。"
   }
  ]
 },
 {
  "id": "real17",
  "title": "Researchers Hope to Bring Back American Chestnuts",
  "date": "2024-12-23",
  "src": "assets/audio/real17.m4a",
  "dur": 332.9,
  "url": "https://learningenglish.voanews.com/a/researchers-hope-to-bring-back-american-chestnuts/7904410.html",
  "words": 461,
  "script": "“Chestnuts roasting on an open fire,\nJack Frost nipping at your nose…”\nThis classic song written by Bob Wells and Mel Tormé in 1944 has long brought to mind the image of Christmas for generations of Americans.\nAt one time, the American Chestnut was among the most common and largest trees in the eastern United States. The wood was used to cover the walls of homes and schools. The leaves helped add nutrients to the soil. And men on street corners sold chestnuts cooked on open fire.\nHowever, in the late 19th century, some East Asian varieties of chestnut trees brought to the U.S. carried a fungus that killed almost all American chestnuts.\nEfforts to bring back the chestnut\nThe American Chestnut Foundation (TACF) is a non-profit organization based in the eastern state of North Carolina. It has been working with researchers for over 30 years to bring the trees back to eastern U.S. forests.\nAmerican chestnuts now exist mostly as huge root systems that grow into small trees. The fungus harms them when the small trees start to develop fully. East Asian varieties, like those that brought the fungus in the first place, are resistant to the fungus.\nResearchers have tried to save American chestnuts by cross-breeding, or mixing, them with one kind of Chinese chestnut that can fight off the fungus. Progress has been slow, however. The trees the researchers have grown could not resist the fungus well enough to become large and healthy trees.\nThat is why scientists are now trying to combine two methods: cross-breeding and genetically modifying, or changing, the genes of American chestnut trees. They hope this will improve the tree’s ability to resist attack from the fungus.\nBut, progress was delayed by a recent mix-up involving two varieties of genetically modified American chestnuts. Scientists at the State University of New York (SUNY) had hoped to get approval for the new seed this year.\nPossible effects of climate change\nA changing climate and warmer temperatures may also make restoring the chestnut difficult in some areas.\nA team at Virginia Tech University published a study this summer about this issue. They looked at projected future climates and then measured the shortest distance the trees would have to move to survive well in a new climate.\nFor now, researchers know their work might not be successful in their lifetimes. The process has been slow. And two of the first chestnut restoration experts, Bill Powell and Chuck Maynard, both died in the past 13 months.\nLinda McGuigan helped support Powell’s and Maynard’s research for years at SUNY’s College of Environmental Science and Forestry.\n“The project moves on, lives on. And we honor their memory,” McGuigan said. “I want to do something good for the future, for my children.”",
  "questions": [
   {
    "q": "What happened to American chestnuts in the late 19th century?",
    "opts": [
     "A fungus carried by Asian trees killed almost all of them.",
     "They were cut down to build homes and schools.",
     "They were replaced by Chinese chestnut trees.",
     "A cold climate stopped them from growing fully."
    ],
    "a": 0,
    "exp": "原文 \"some East Asian varieties of chestnut trees brought to the U.S. carried a fungus that killed almost all American chestnuts\"。木材用于房屋学校是早年的用途，不是消失原因；中国栗只是用来杂交。"
   },
   {
    "q": "Why has progress with cross-breeding been slow?",
    "opts": [
     "Chinese chestnuts were unable to fight off the fungus.",
     "The new trees could not resist the fungus well enough.",
     "The fungus destroyed the trees' huge root systems.",
     "Scientists could not get approval for the new seeds."
    ],
    "a": 1,
    "exp": "原文 \"The trees the researchers have grown could not resist the fungus well enough to become large and healthy trees\"。能抵抗真菌的正是中国栗，关系改反；真菌在小树长成时才伤害它们，根系仍存活；审批是后文转基因方法的事。"
   },
   {
    "q": "What delayed the progress of the newer combined approach?",
    "opts": [
     "A lack of money from the American Chestnut Foundation.",
     "Public opposition to genetically modified trees.",
     "The deaths of the two leading experts.",
     "A mix-up involving two genetically modified varieties."
    ],
    "a": 3,
    "exp": "原文 \"progress was delayed by a recent mix-up involving two varieties of genetically modified American chestnuts\"。两位专家去世是后文提到的，并非导致延误的原因；资金和公众反对未提及。"
   },
   {
    "q": "What does Linda McGuigan say about the project?",
    "opts": [
     "It should end now that the experts have died.",
     "It will succeed within her own lifetime.",
     "It will go on in memory of the experts.",
     "Her children should take over the research."
    ],
    "a": 2,
    "exp": "原文 \"The project moves on, lives on. And we honor their memory\"，go on 替换 moves on。研究者承认生前可能看不到成功；\"for my children\" 是为了后代，而非让孩子接手。"
   }
  ]
 },
 {
  "id": "real18",
  "title": "Robot Leads Cattle to Greener Fields",
  "date": "2024-12-22",
  "src": "assets/audio/real18.m4a",
  "dur": 291.7,
  "url": "https://learningenglish.voanews.com/a/robot-leads-cattle-to-greener-fields/7899193.html",
  "words": 471,
  "script": "Researchers in Australia are using a robot powered by artificial intelligence (AI) to improve the way farmers raise cattle.\nThe robot has four wheels and is painted red.\nResearchers have named the robot cow SwagBot. It can drive by itself and move cows from one field to another based on the condition of the soil and plant life.\nResearchers at the University of Sydney in Australia said SwagBot is becoming the world’s first “smart cow.” They believe it can make cattle farming more efficient and put less pressure on the environment.\nSwagbot was first launched in 2016. At that time, it could only move around fields where cattle graze. Over time, scientists have added sensors and AI systems to the robot.\nThese systems help SwagBot judge the health, type, and thickness of grasses and plants in fields and to observe the health of the cattle.\nThe robot uses this information to move cattle to the best areas for grazing. The goal is to move cattle to a new grazing area before they have damaged the grass in a particular field. This can prevent damage to the soil. The robot can also send the information back to farmers.\nSalah Sukkarieh is a professor of robotics and intelligent systems at the University of Sydney. His team made SwagBot. He said that once cattle feel at ease near the robot, they follow it around.\n\"You want to move the animals to the right part of the pasture where there is good protein, good carbs,\" he said. Sukkarieh added that it is important to move the cattle easily and without fences.\nAustralia is one of the world's biggest exporters of beef. It has around 30 million cattle spread across large areas that are often dry. As a result, some pastures are of low quality and do not have a lot of grass.\nFarmers carefully assess how many animals their land can support. However, many farmers have little control over where the animals graze within large areas of land. Overgrazing can lead to poor soil that supports less plant and animal life.\nErin O'Neill is a part-time farmer who watched a recent demonstration of the robot in a field north of Sydney. She said the robot can help farmers get detailed information about the current condition of their fields.\nShe said the robot can tell farmers “what bits of pasture are most nutritious, particularly if you've got cattle like we do that are pregnant.” O’Neill added that pregnant cattle need high-quality pastures to aid them through pregnancy.\nSwagBot is still in development. It is part of a growing movement in agriculture towards robotics. Farming experts hope robots can make production more efficient. Robots could also reduce the need for workers in places, like Australia, where finding workers in areas with a low population can be difficult.",
  "questions": [
   {
    "q": "What is SwagBot able to do?",
    "opts": [
     "Milk cows automatically without help from farmers.",
     "Build fences to keep cattle in fields.",
     "Help farmers decide when to sell cattle.",
     "Move cattle between fields based on land conditions."
    ],
    "a": 3,
    "exp": "原文 \"move cows from one field to another based on the condition of the soil and plant life\"，land conditions 概括 soil and plant life。Sukkarieh 强调不用围栏引导牛群，故建围栏错。"
   },
   {
    "q": "What is the goal of moving cattle to a new grazing area?",
    "opts": [
     "To help cattle feel at ease near the robot.",
     "To increase the number of cattle on each farm.",
     "To prevent damage to the grass and soil.",
     "To keep cattle away from dry areas."
    ],
    "a": 2,
    "exp": "原文 \"The goal is to move cattle to a new grazing area before they have damaged the grass... This can prevent damage to the soil\"。牛对机器人放松后会跟随，是前提而非目的；干旱地区是澳大利亚背景信息。"
   },
   {
    "q": "Why does Erin O'Neill find the robot useful?",
    "opts": [
     "It shows which parts of a pasture are most nutritious.",
     "It reduces the need for workers on farms.",
     "It helps pregnant cattle give birth safely.",
     "It tells farmers how many cattle to keep."
    ],
    "a": 0,
    "exp": "原文 \"what bits of pasture are most nutritious, particularly if you've got cattle like we do that are pregnant\"，parts 替换 bits。减少用工需求是文末农业专家的期望，属张冠李戴；怀孕的牛需要优质牧草，并非帮助分娩。"
   },
   {
    "q": "What do farming experts hope robots can do?",
    "opts": [
     "Help Australia export more beef than any country.",
     "Reduce the need for workers in thinly populated areas.",
     "Replace cattle on low-quality pastures.",
     "Attract more people to live in rural areas."
    ],
    "a": 1,
    "exp": "原文 \"Robots could also reduce the need for workers in places... where finding workers in areas with a low population can be difficult\"，thinly populated 替换 low population。澳大利亚是牛肉出口大国是背景信息，并非期望。"
   }
  ]
 },
 {
  "id": "real19",
  "title": "Geothermal Development Faces Barriers in Southeast Asia",
  "date": "2024-12-17",
  "src": "assets/audio/real19.m4a",
  "dur": 393.2,
  "url": "https://learningenglish.voanews.com/a/geothermal-development-faces-barriers-in-southeast-asia/7889701.html",
  "words": 607,
  "script": "Indonesia and the Philippines aim to increase their use of geothermal energy to move away from highly polluting fossil fuels.\nHowever, money issues, governmental rules, and community protests have slowed the growth of geothermal energy production.\nGeothermal energy uses heat from underground reservoirs of hot water to produce electricity. Environmental experts see geothermal as a good source of clean energy because it can provide power 24 hours a day. Geothermal power plants also require little maintenance and can last for many years.\nCountries with high geothermal possibilities — such as the United States, Indonesia and the Philippines — have areas where volcanic activity naturally carries hot water or steam to the Earth’s surface. The hot water or steam can also be reached by drilling into the ground.\nMarit Brommer is head of the International Geothermal Association based in Germany. She told The Associated Press, “We’re essentially standing on our own sun, which we can get clean, reliable energy from.”\nGeothermal energy in Southeast Asia\nIn Southeast Asia, geothermal energy production is expected to increase ten times greater from 2020 to 2050, reaching 276 million megawatt-hours, the International Energy Agency says.\nAfter the U.S., Indonesia and the Philippines are the second and third-largest users of geothermal energy in the world.\nStill, Indonesia uses less than one-tenth of its large reserves of geothermal energy. Six percent of the country’s power supply comes from geothermal sources.\nAnd the Philippines has only developed about eight percent of its geothermal resources. It makes up 14.6 percent of the country’s energy use.\nBoth countries plan to expand their production of geothermal energy. Indonesia aims to increase geothermal production by at least 8 percent by 2030. The Philippine government is targeting several projects to increase geothermal capacity by nearly 1.5 gigawatts, nearly doubling its current use.\nFacing difficulties\nHowever, developing new geothermal projects is costly and sometimes risky for companies when they test and drill to look for reservoirs. That makes it hard to get money for development, said Shigeru Yamamura. He is an energy specialist at the Asia Development Bank.\n“That’s the most difficult part of developers, because (in terms of money) they cannot take 100 percent of the exploration risk themselves,” Yamamura said.\nThe Philippine government has announced plans to auction for developing geothermal projects. The government is also preparing a “smart green grid plan” that centers on renewable energy. The plans may make it more likely that banks will give loans to private companies seeking to develop geothermal projects.\nThe Indonesian Ministry of Energy and Mineral Resources says it is working to shorten the wait time to get permits for new geothermal projects. It is also considering ways to increase the amount of money companies could make from the projects.\nThe World Bank is providing a $150 million loan to increase Indonesian investments in geothermal energy. And the Green Climate Fund and the Clean Technology Fund are providing $127.5 million.\nStill, community pushback can slow development even when there is enough money.\nIn Indonesia, villagers have protested geothermal projects. They say the projects are not safe and can harm the environment. Several geothermal projects in Indonesia have had deadly gas leaks in the past five years.\nIn the Philippines, protests have led at least one company to pay money to Indigenous groups for the use of their lands.\nBrommer, of the International Geothermal Association, thinks governments and businesses should work with nearby communities.\n“We need to show that this development benefits all people, not just a company,” she said. “It’s not about being a good neighbor; it’s about being the best neighbor and really working with communities to respect their concerns.”",
  "questions": [
   {
    "q": "What has slowed geothermal growth in Indonesia and the Philippines?",
    "opts": [
     "A lack of volcanic activity in both countries.",
     "High maintenance costs of geothermal power plants.",
     "Money issues, government rules and community protests.",
     "Competition from cheap and polluting fossil fuels."
    ],
    "a": 2,
    "exp": "原文 \"money issues, governmental rules, and community protests have slowed the growth of geothermal energy production\"。文中说地热电站维护需求很少；两国地热资源丰富，并不缺火山活动。"
   },
   {
    "q": "Why do environmental experts see geothermal as a good clean energy source?",
    "opts": [
     "It is cheap and safe to drill for.",
     "It can provide power 24 hours a day.",
     "It never causes harmful gas leaks.",
     "It needs little investment to develop."
    ],
    "a": 1,
    "exp": "原文 \"it can provide power 24 hours a day\"。后文明确说勘探钻探 costly and sometimes risky，印尼还发生过致命气体泄漏，开发也很费钱，三个干扰项都与原文相反。"
   },
   {
    "q": "Why is it hard to get money for geothermal development?",
    "opts": [
     "Banks refuse all loans to private companies.",
     "Governments take too long to issue permits.",
     "Developers must share profits with local villagers.",
     "Exploring for reservoirs is costly and risky."
    ],
    "a": 3,
    "exp": "原文 \"developing new geothermal projects is costly and sometimes risky for companies when they test and drill to look for reservoirs. That makes it hard to get money\"。缩短审批等待是印尼政府的改进措施，不是融资难的原因；银行只是可能更愿放贷，并未全部拒绝。"
   },
   {
    "q": "What does Brommer think governments and businesses should do?",
    "opts": [
     "Work with local communities and respect their concerns.",
     "Pay Indigenous groups for the use of their land.",
     "Build projects far away from local villages.",
     "Let companies take all the exploration risk."
    ],
    "a": 0,
    "exp": "原文 \"governments and businesses should work with nearby communities\" 及 \"really working with communities to respect their concerns\"。向原住民付费是菲律宾某公司因抗议所做的事，属张冠李戴；开发商无法承担全部勘探风险是 Yamamura 的话。"
   }
  ]
 },
 {
  "id": "real20",
  "title": "Airbus Delays Development of Hydrogen-Powered Aircraft",
  "date": "2025-02-18",
  "src": "assets/audio/real20.m4a",
  "dur": 312.8,
  "url": "https://learningenglish.voanews.com/a/airbus-delays-development-of-hydrogen-powered-aircraft/7972798.html",
  "words": 445,
  "script": "European manufacturer Airbus has announced a delay in its development efforts of a hydrogen-powered aircraft. The company explained that progress on the project has been slower and more complex than expected.\nAirbus had set a goal to make a zero-emission airplane by 2035. The company has not announced a new target date for the plane’s production. But the French union Force Ouvrière said some of its aircraft workers were recently told the technology was running five to 10 years behind, Reuters news agency reported.\nThe French news agency AFP reported Airbus also said it had reduced the program’s budget by 25 percent, but was still examining ways to reduce emissions.\n\"Our ambition and roadmap towards decarbonizing. . .remain unchanged,\" an Airbus spokesman told AFP.\nIn September 2020, Airbus presented three hydrogen-fueled airplane designs, called ZEROe, as part of its efforts to decarbonize.\nOther airplane manufacturers, however, have centered more on renewable fuels or developing electric-powered planes for short-distance flights.\nAirbus noted it has no plans to completely stop developing hydrogen-powered aircraft technology. The company said it sees hydrogen as “a revolutionary energy source for aviation.\"\nHowever, Airbus said in a statement to Reuters it recognizes that developing systems to produce, transport, and store hydrogen represent “a huge challenge requiring global collaboration and investment.\"\nDifficulties with hydrogen\nHydrogen motors do not release gases that can warm the earth’s atmosphere. Instead, they release water.\nHowever, much of the hydrogen used for fuel is produced using natural gas or coal. Both of these production methods often release carbon dioxide gas, which can warm the atmosphere.\nRunning renewable electricity through water can produce hydrogen without adding to carbon emissions. However, this process is generally more costly. Transporting and storing hydrogen also present problems.\nAs a gas at room temperature, hydrogen takes up a very large space. This makes it impossible to use as fuel. It first needs to be turned into a liquid to be transported or stored. And it needs to be cooled to -253° Celsius to be liquefied. This cooling process requires its own source of energy. Liquified hydrogen still takes up four times the space of jet fuel.\nThe airline industry trade association IATA believes aviation will reach most of its reduction in emissions by using sustainable aviation fuel (SAF). It believes other technologies, like hydrogen, will take longer to develop.\nSAF uses food and plant waste from cities, agricultural and forest wastes, and other non-petroleum sources. This fuel is then added to jet fuel in mixtures of 10 to 50 percent to become SAF.\nAirbus says it agrees that SAF can also play an important part in reducing emissions, particularly for medium and long-distance flights.",
  "questions": [
   {
    "q": "Why did Airbus delay its hydrogen-powered aircraft?",
    "opts": [
     "Its workers refused to support the project.",
     "Progress was slower and more complex than expected.",
     "Other makers had already built electric planes.",
     "It no longer saw hydrogen as useful."
    ],
    "a": 1,
    "exp": "原文 \"progress on the project has been slower and more complex than expected\"。工会只是转述技术落后 5 到 10 年；Airbus 仍称氢是 \"a revolutionary energy source\"。"
   },
   {
    "q": "What did Airbus say about the hydrogen program?",
    "opts": [
     "It had cut the program's budget by a quarter.",
     "It would still produce the plane by 2035.",
     "It would completely stop developing hydrogen technology.",
     "It had set a new date for production."
    ],
    "a": 0,
    "exp": "原文 \"it had reduced the program's budget by 25 percent\"，a quarter 替换 25 percent。2035 是原目标，现已推迟且未公布新日期；Airbus 明确表示不会完全停止。"
   },
   {
    "q": "What is one problem with using hydrogen as fuel?",
    "opts": [
     "Hydrogen motors release gases that warm the atmosphere.",
     "Liquid hydrogen takes up less space than jet fuel.",
     "It must be cooled to an extremely low temperature.",
     "Making it from water costs less than from coal."
    ],
    "a": 2,
    "exp": "原文 \"it needs to be cooled to -253° Celsius to be liquefied. This cooling process requires its own source of energy\"。氢发动机排放的是水；液氢体积是航空燃油的四倍；用水电解制氢通常更贵。"
   },
   {
    "q": "What does the airline trade group IATA believe?",
    "opts": [
     "Hydrogen will soon replace jet fuel completely.",
     "Electric planes will serve long-distance flights.",
     "SAF is useful only for short-distance flights.",
     "Sustainable aviation fuel will bring most emission cuts."
    ],
    "a": 3,
    "exp": "原文 \"aviation will reach most of its reduction in emissions by using sustainable aviation fuel (SAF)\"。IATA 认为氢等技术需要更久；电动飞机是其他厂商针对短途航线的方向；Airbus 说 SAF 尤其适用于中长途。"
   }
  ]
 },
 {
  "id": "real21",
  "title": "What Are the Good Effects of Walking?",
  "date": "2024-11-21",
  "src": "assets/audio/real21.m4a",
  "dur": 418.2,
  "url": "https://learningenglish.voanews.com/a/what-are-the-good-effects-of-walking-/7865636.html",
  "words": 672,
  "script": "Many medical experts say that walking is an easy way to improve physical and mental health, support fitness and prevent disease. They advise that walking is a great first step toward a healthy life although other forms of exercise are also important.\nGood effects of walking\nDr. Sarah Eby is a sports medicine physician with Mass General Brigham in the state of Massachusetts. Eby said walking has many good effects and people do not need extra things. “You don’t need equipment and you don’t need a gym membership,” Eby noted “And the benefits are so vast.”\nThe U.S. surgeon general, a federal health officer, recommends that adults get at least two and a half hours of moderate-intensity physical activity every week.\nWalking helps meet that goal. Exercise lowers the risk of heart disease, high blood pressure, dementia, depression and many kinds of cancer.\nWalking also helps blood sugar levels, is good for bone health, and can help people lose weight and sleep better. That is what Julie Schmied said. She is a health care worker with Norton Healthcare in Kentucky, which runs the free Get Healthy Walking Club.\nWalking is also a relatively low-impact exercise that puts less pressure on joints than other exercises while strengthening the heart and lungs.\nJames Blankenship is 68 years old. He said joining a walking club at the Louisville Zoo last year helped him recover after a heart attack and a complex triple-bypass heart operation in 2022.\n“My cardiologist says I’m doing great,” he said.\nSome say walking is not enough. Anita Gust teaches exercise science at the University of Minnesota Crookston. Gust said walking “is not enough for overall health and well-being” because it does not provide resistance training that builds muscle strength and endurance.\nSome health experts say that is especially important for healthy bone development in women as they age.\nExperts recommend adding other activities at least twice weekly. These could include using weights, gym equipment or one’s own body for resistance exercises. Training that improves flexibility, like yoga or stretching, can also be helpful.\nHow much should you walk?\nMany people have heard about the walking goal of 10,000 steps a day. This advice dates back to a 1960s marketing campaign in Japan. But, experts note that this is only a guideline.\nShmied said the average American walks about 3,000 to 4,000 steps a day, and it is fine to increase that number to 10,000.\nSetting a time goal can also be useful. Shmied suggests dividing the recommended 150 minutes per week into 30 minutes a day, or 10 minutes three times a day, for five days. During rainy or snowy weather, people can walk in malls or on treadmills.\nAs they become seasoned walkers, they can speed up or walk up hills while still keeping the activity level moderate.\n“If you can talk but not sing,” Eby said, “that’s what we consider moderate-intensity exercise.”\nStaying with your walking program\nWalking with friends, including dogs, is one way to keep walking.\nWalking clubs have appeared across the nation. In 2022, 31-year-old personal trainer Brianna Joye Kohn started City Girls Who Walk with a TikTok post inviting others to walk with her in New York.\n“We had 250 girls show up,” she said.\nSince then, the group has walked every Sunday for around 40 minutes, with some meeting afterward for a meal or coffee.\nThe Louisville Zoo launched its walking club in 1987. It joined with Norton Healthcare in 2004 to expand it and now has more than 15,000 registered members. Every day from March 1 through October 31, people walk around and around the zoo before it officially opens.\nRecently, Janet Rapp walked down a path through the city zoo, waving at friends and stopping briefly to greet big flightless birds called emus that she knows by name.\nThe 71-year-old retiree starts each morning this way with a walking club.\n“I’m obsessed,” she said. Not only does it ease her joint pain, “it just gives me energy…And then it calms me, too.”",
  "questions": [
   {
    "q": "What do many medical experts say about walking?",
    "opts": [
     "It can replace all other forms of exercise.",
     "It is an easy first step toward better health.",
     "It works best with a gym membership.",
     "It is mainly useful for losing weight."
    ],
    "a": 1,
    "exp": "原文 \"walking is an easy way to improve physical and mental health\" 且 \"a great first step toward a healthy life\"，easy first step toward better health 为同义改写。原文同时说 \"other forms of exercise are also important\"，排除可替代其他运动；Eby 明确说不需要 gym membership；减肥只是众多好处之一。"
   },
   {
    "q": "Why does Anita Gust think walking is not enough?",
    "opts": [
     "It puts too much pressure on the joints.",
     "It cannot strengthen the heart and lungs.",
     "It takes too much time every week.",
     "It does not build muscle strength and endurance."
    ],
    "a": 3,
    "exp": "原文 \"it does not provide resistance training that builds muscle strength and endurance\"。原文说步行 \"puts less pressure on joints\" 且 \"strengthening the heart and lungs\"，前两项与原文相反；时间多少未作为理由。"
   },
   {
    "q": "How can walkers tell their exercise is moderate, according to Eby?",
    "opts": [
     "They are able to talk but not sing.",
     "They walk up hills without stopping.",
     "They reach 10,000 steps every day.",
     "They feel no pain in their joints."
    ],
    "a": 0,
    "exp": "原文 \"If you can talk but not sing\"，\"that's what we consider moderate-intensity exercise\"。爬坡是熟练后提速的建议；10,000 步只是 guideline；关节不痛是 Janet Rapp 的感受，均非判断标准。"
   },
   {
    "q": "What does Janet Rapp say about her morning walks at the zoo?",
    "opts": [
     "They help her lose weight quickly.",
     "They make her too tired for the day.",
     "They ease her pain and give her energy.",
     "They let her train emus at the zoo."
    ],
    "a": 2,
    "exp": "原文说散步 \"ease her joint pain\"，且 \"it just gives me energy\"，ease her pain and give her energy 直接对应。她只是向认识的 emus 打招呼，并非训练它们；减肥、疲惫均未提及。"
   }
  ]
 },
 {
  "id": "real22",
  "title": "Can Bees, Dogs Identify Cancer Earlier Than Machines?",
  "date": "2024-11-19",
  "src": "assets/audio/real22.m4a",
  "dur": 313.2,
  "url": "https://learningenglish.voanews.com/a/can-bees-dogs-identify-cancer-earlier-than-machines-/7861654.html",
  "words": 579,
  "script": "Researchers at Michigan State University recently found that bees’ sense of “smell” is sensitive enough to identify chemical smells of cancer.\nBees sense chemicals in their environment using antennae, structures on their heads, which serve as “noses” to sense smells.\nThe researchers wrote in a study published last month that honeybees can sniff out lung cancer on a patient’s breath.\nDebajit Saha is an assistant professor of biomedical engineering at Michigan State University. He was part of a team that published the research.\n“Our world is visual. [The] insects’ world is all based on smell, so their sense of smell is very, very good,” Saha said.\n“There is quite a bit of research that shows that when some cancer grows inside our body, our breath actually changes. Our research does show that honeybees can detect lung cancer and possibly other diseases based on the smell of those cells.”\nSaha and his team placed bees in small harnesses and attached small wires to their brains. The insects were then placed near chemicals that are like the breath of a person with lung cancer.\nThe scientists said that the bees could tell the difference between the cancer breath and the laboratory copy of the healthy human breath 93 percent of the time. The scientists added that the bees could also tell the difference between different kinds of lung cancer.\nThe discovery could help doctors detect many cancers, including lung, breast, head and neck, and colorectal cancers, earlier than other methods. Saha says detecting cancers this way would be an improvement. “The reason is, many times we detect the cancer late,” when a growth has become too big to control easily. But, he added, when cancer starts growing the breath starts changing much earlier.\nHe hopes to develop a system that a patient will be able to breathe into and which can be carried around easily. This would deliver test results immediately.\n“Hopefully, within the next five years, we'll have something to show that humans can be diagnosed using these insect brain disc sensors,” Saha said.\nDogs can also help find cancer\nUsing animals to detect cancer is not a new idea. At the Penn Vet Working Dog Center at the University of Pennsylvania, researchers are training dogs to smell some kinds of cancer.\nCindy Otto is executive director of the Penn Vet Working Dog Center in Philadelphia. She said many other animals also have very good senses of smell. “But part of what makes dogs so good is that they cooperate with humans, and so, they communicate that information,” she added.\nThe dogs are in a program where they live with families and are brought to “work” each day. Not all dogs can do this work. Otto said,\n“They need to love it to be engaged. And so, it's a really fun game for them.”\nSome researchers say that dogs detect cancer better than machines. They note that a dog’s sense of smell is 10,000 to 100,000 times sharper than that of humans.\nAmritha Mallikarjun is another postdoctoral researcher at the center. She said dogs are more sensitive to smells than any machines sold today. But the scientists hope to create a machine that will identify disease just as well as dogs.\nOtto said doctors in ancient Greece and Rome used odor as a tool to identify disease. She hopes the researchers can build on that “and advance the health of not only humans, but dogs and other species as well.”",
  "questions": [
   {
    "q": "What did the Michigan State University researchers find?",
    "opts": [
     "Bees can smell lung cancer on human breath.",
     "Bees can see cancer cells better than machines.",
     "Bees are easier to train than working dogs.",
     "Bees can help cure some kinds of lung cancer."
    ],
    "a": 0,
    "exp": "原文 \"honeybees can sniff out lung cancer on a patient's breath\"，smell 替换 sniff out。原文强调昆虫世界 \"all based on smell\" 而非视觉；未比较训练难度；研究是检测而非治疗。"
   },
   {
    "q": "Why does Saha think detecting cancer through breath would be an improvement?",
    "opts": [
     "It is cheaper than any blood test today.",
     "It can identify 93 percent of all cancers.",
     "Breath changes long before cancer is usually found.",
     "It allows doctors to stop cancer from growing."
    ],
    "a": 2,
    "exp": "原文 \"many times we detect the cancer late\"，而 \"when cancer starts growing the breath starts changing much earlier\"。93 percent 是蜜蜂区分癌症呼吸与健康呼吸的准确率，属数字挪用；价格未提；能否阻止癌症生长原文未说。"
   },
   {
    "q": "What makes dogs especially good at finding cancer, according to Cindy Otto?",
    "opts": [
     "They have the sharpest sense of smell of all animals.",
     "They live inside the research center every day.",
     "They are rewarded with food for each success.",
     "They cooperate and share information with humans."
    ],
    "a": 3,
    "exp": "原文 \"part of what makes dogs so good is that they cooperate with humans, and so, they communicate that information\"。Otto 承认 \"many other animals also have very good senses of smell\"，排除最强嗅觉；狗是与家庭同住、每天来 work；食物奖励未提，原文说这对它们是 \"a really fun game\"。"
   },
   {
    "q": "What do the scientists at the Penn Vet center hope to do?",
    "opts": [
     "Replace all working dogs with cheaper machines.",
     "Build a machine that detects disease as well as dogs.",
     "Train every kind of dog to find cancer.",
     "Return to the medical methods of ancient Rome."
    ],
    "a": 1,
    "exp": "原文 \"the scientists hope to create a machine that will identify disease just as well as dogs\"。原文说 \"Not all dogs can do this work\"；Otto 是希望在古希腊罗马用气味诊病的基础上 build on，而非回到古法；没有说要取代狗。"
   }
  ]
 },
 {
  "id": "real23",
  "title": "How Hard Should You Train?",
  "date": "2024-10-28",
  "src": "assets/audio/real23.m4a",
  "dur": 310.2,
  "url": "https://learningenglish.voanews.com/a/how-hard-should-you-train-/7823051.html",
  "words": 612,
  "script": "“No pain, no gain” is an old saying in English. It means that one has to suffer or work hard in order to succeed or make progress.\nThe expression is now often used to push people to train harder or exercise more to get good effects.\nBut just how much pain do you have to have from weight training? The answer depends on what you are trying to gain, fitness experts say.\nFor years, some trainers have told people that to get the best results, they need to train “until failure.”\nTraining “until failure” means that you do an exercise until you cannot do one more repetition. Some recent studies, however, suggest training “until failure” with weights may only help some people.\n“If somebody wants to increase muscle mass as much as they possibly can, then training to failure is something to consider,” said Michael Zourdos of Florida Atlantic University.\nZourdos co-wrote a review of 55 research papers on the subject in the scientific publication Sports Medicine.\nZourdos and colleagues found that lifting weights “until failure” may build bigger muscles. But training in such a way is not needed to increase strength. He said people who work out hard, but do not push themselves to exhaustion, will still likely make their health and fitness better. “There is a difference between training for health and training for elite performance benefits,” he said.\nFor the average person simply looking to increase their fitness levels, Zourdos said it is much easier to get results. He explained people who work out regularly would benefit from an intense session that comes within five to 10 repetitions of failure.\nHe also said “failure training” often comes at a cost. People who train until failure might be so tired and in so much pain that they skip their next workout or two.\nIn rare cases, extremely difficult training can even be harmful. One example is the condition called rhabdomyolysis, where damaged muscles begin to break down, possibly causing kidney damage.\nJames Fisher is a sport science expert and advisor in Southampton, England. He said many people are not interested in the idea of working until complete exhaustion.\n“What we’re really talking about is how hard you should work when you go to the gym,” he said.\nFisher added that the idea should be understood to mean that people can spend less time in the gym — if they work hard.\n“If you’re short on time, then you can push yourself harder, and then you don’t need to work out as long,” he said.\nFisher explained that to increase strength, it is necessary to push your muscles to a certain level.\n“If you lift a weight you can easily lift ten times or more, you never really work hard enough,” he said. “Now, if we increase the weight so that on the ninth and 10th rep, it feels ... hard, that will benefit your muscle...”\nStill, Fisher said that the best workout is “one that people will actually do,” regardless of how hard they push themselves. He said that strength training is probably the best single thing people can do for their health, quality of life and longevity.\nWhatever your fitness goal, Fisher said the idea of failure training can be included into your workout. People should then rest the muscle group they have trained for about two days, he said.\nFor people who have more experience, experts suggest saving the failure training for some of the workouts, or on the last set of exercises in your session.\n“It’s not meant to be for every person, every time they work out,” Fisher said. “This is a tough way to exercise.”",
  "questions": [
   {
    "q": "What did Zourdos and his colleagues find about training until failure?",
    "opts": [
     "It is the only way to increase strength.",
     "It harms most people who lift weights.",
     "It may build bigger muscles but is not needed for strength.",
     "It benefits all people in the same way."
    ],
    "a": 2,
    "exp": "原文 \"may build bigger muscles. But training in such a way is not needed to increase strength\"。只有极少数情况才有害（\"In rare cases\"），且研究说它 \"may only help some people\"，其余三项均改变了程度或关系。"
   },
   {
    "q": "What cost of failure training does Zourdos mention?",
    "opts": [
     "People may feel so tired that they skip workouts.",
     "People usually suffer serious kidney damage.",
     "People lose interest in the gym forever.",
     "People need much more expensive equipment."
    ],
    "a": 0,
    "exp": "原文 \"People who train until failure might be so tired and in so much pain that they skip their next workout or two\"。肾损伤只在 \"rare cases\" 的 rhabdomyolysis 中可能出现，usually serious 夸大了程度；后两项原文未提。"
   },
   {
    "q": "What does James Fisher suggest for people who are short on time?",
    "opts": [
     "Lift light weights more than ten times.",
     "Work harder so they can train for less time.",
     "Avoid strength training until they have time.",
     "Train until complete exhaustion every session."
    ],
    "a": 1,
    "exp": "原文 \"If you're short on time, then you can push yourself harder, and then you don't need to work out as long\"。Fisher 说轻松举十次以上的重量 \"never really work hard enough\"；他也说很多人对练到完全力竭不感兴趣，且失败训练 \"not meant to be for every person, every time\"。"
   },
   {
    "q": "What does Fisher believe is the best workout?",
    "opts": [
     "One that always ends in total failure.",
     "One done every day without any rest.",
     "One designed for elite athletes only.",
     "One that people will actually keep doing."
    ],
    "a": 3,
    "exp": "原文 the best workout is \"one that people will actually do\"，无论强度多大。他建议训练后让肌肉群休息约两天，排除每天不休息；失败训练 \"not meant to be for every person\"；精英表现训练是 Zourdos 区分的另一类目标。"
   }
  ]
 },
 {
  "id": "real24",
  "title": "Has Human Life Expectancy Reached Its Limit?",
  "date": "2024-10-20",
  "src": "assets/audio/real24.m4a",
  "dur": 336.7,
  "url": "https://learningenglish.voanews.com/a/has-human-life-expectancy-reached-its-limit-/7817392.html",
  "words": 612,
  "script": "A new study says humanity is hitting the upper limit of life expectancy.\nDevelopments in medical technology and genetic research are not leading to major increases in lifespan overall, the researchers said.\nThe study was published recently in Nature Aging.\n“We have to recognize there’s a limit” and possibly change ideas about when people should retire and how much money they will need to live out their lives, said S. Jay Olshansky of the University of Illinois-Chicago. Olshansky was the lead writer of the study.\nMark Hayward of the University of Texas was not involved in the study. However, he called it “a valuable addition to the mortality literature.”\n“We are reaching a plateau” in life expectancy, he said.\nIt is always possible that some new development could push survival to greater lengths, “but we don’t have that now,” Hayward said.\nWhat is life expectancy?\nLife expectancy is an estimate of the average number of years a baby born in a particular year might expect to live. The measurement assumes death rates at the time of birth do not change.\nLife expectancy is one of the world’s most important health measures. Still the life expectancy measurement has problems. For example, life expectancy is an estimate that cannot include new developments or changes that might affect the length of people’s lives.\nThese unknown developments could include pandemics or new treatments for diseases.\nIn the recent study, Olshansky and other researchers followed life expectancy estimates for the years 1990 to 2019. They took information from a database administered by the Max Planck Institute for Demographic Research.\nThe researchers paid special attention to eight of the places in the world where people live the longest: Australia, France, Hong Kong, Italy, Japan, South Korea, Spain and Switzerland.\nThe United States does not rank in the top 40, but it was included in the study because the researchers live in the U.S. Also, some experts have made estimates that life expectancy in the U.S. would increase greatly in the 2000s, Olshansky said.\nWho lives the longest?\nWomen continue to live longer than men. Female life expectancy improvements are still happening — but at a slower rate, the researchers found. In 1990, the average amount of improvement was about 2.5 years every 10 years. In the 2010s, it was 1.5 years — but almost zero in the United States.\nLife expectancy measurements in the U.S. are more difficult. The country is affected by a number of causes of early death. Examples include drug overdoses, shootings, weight problems and uneven health care services.\nBut in one calculation, the researchers estimated what would happen in all nine places if all deaths before age 50 were prevented. The increase at best was still only 1.5 years, Olshansky said.\nThe study suggests that there is a limit to how long most people live, and we have almost hit it, Olshansky said.\n“We’re squeezing less and less life out of these life-extending technologies. And the reason is, aging gets in the way,” he said.\nIt may seem common to hear of a person living to 100. Former U.S. President Jimmy Carter, for example, recently celebrated his 100th birthday.\nIn 2019, a little over two percent of Americans made it to 100, compared to about five percent in Japan and nine percent in Hong Kong, Olshansky said.\nIt is likely that the number of people who reach 100 will grow in the years ahead, experts say, but that is because of population growth. The percentage of people hitting 100 will remain limited, likely with fewer than 15 percent of women and 5 percent of men making it that long in most countries, Olshansky said.",
  "questions": [
   {
    "q": "What does the new study published in Nature Aging say?",
    "opts": [
     "Medical technology is greatly extending human lifespan.",
     "Genetic research will soon add many years to life.",
     "People should retire much earlier than they do now.",
     "Human life expectancy is nearing its upper limit."
    ],
    "a": 3,
    "exp": "原文 \"humanity is hitting the upper limit of life expectancy\"，nearing its upper limit 为同义改写。原文说医学技术和基因研究 \"are not leading to major increases in lifespan\"；Olshansky 只说可能需要改变退休时间的观念，并未说要更早退休。"
   },
   {
    "q": "What is one problem with the life expectancy measurement?",
    "opts": [
     "It only counts babies born in one country.",
     "It cannot include future changes like new treatments.",
     "It ignores the differences between men and women.",
     "It assumes death rates rise every single year."
    ],
    "a": 1,
    "exp": "原文 \"life expectancy is an estimate that cannot include new developments or changes\"，例如 \"pandemics or new treatments for diseases\"。原文说该测算假设出生时死亡率 \"do not change\"，与最后一项相反；其余两项未提。"
   },
   {
    "q": "What did the researchers find about female life expectancy?",
    "opts": [
     "It has stopped improving in every place studied.",
     "It is now lower than that of men.",
     "It is still improving, but at a slower rate.",
     "It improved 2.5 years per decade in the 2010s."
    ],
    "a": 2,
    "exp": "原文 \"Female life expectancy improvements are still happening\"，只是速度变慢。几乎为零仅指美国，扩大到所有地区属张冠李戴；女性仍比男性长寿；每十年 2.5 年是 1990 年的数据，2010 年代是 1.5 年。"
   },
   {
    "q": "Why will the number of people reaching 100 probably grow?",
    "opts": [
     "Because the population itself is getting larger.",
     "Because new technology will slow down aging.",
     "Because early deaths before 50 will be prevented.",
     "Because more countries will follow Japan's example."
    ],
    "a": 0,
    "exp": "原文 \"the number of people who reach 100 will grow in the years ahead... but that is because of population growth\"。Olshansky 说 \"aging gets in the way\"，技术延寿效果递减；预防 50 岁前死亡只是一项假设计算，最多增加 1.5 年；学习日本未提。"
   }
  ]
 },
 {
  "id": "real25",
  "title": "How Bad Are Ultraprocessed Foods?",
  "date": "2024-09-09",
  "src": "assets/audio/real25.m4a",
  "dur": 351.2,
  "url": "https://learningenglish.voanews.com/a/how-bad-are-ultraprocessed-foods-/7765418.html",
  "words": 732,
  "script": "Most Americans eat ultraprocessed foods every day. These are foods that you cannot make at home because they contain flavors and chemicals that change the taste or feel of the food.\nSuch food may also go through preparation methods that are not possible in a home kitchen. They are usually high in salt, sugar and fat. Americans may eat them in the form of sugary cereals at breakfast, frozen pizzas at dinner, and in-between bites like potato chips, sodas and ice cream.\nUltraprocessed foods make up about 60 percent of the American diet. For children and teenagers, it is even higher – about two-thirds of what they eat.\nScientists have connected eating ultraprocessed foods to poor health results. Being overweight is one such result and that may lead to diabetes and heart disease. Other possible health risks include depression and dementia. One recent study suggested that eating these foods may raise the risk of early death.\nNutrition science is complex, though, and most research so far has found connections -- not proof -- regarding the health effects of these foods.\nFood manufacturers argue that processing increases food safety and food supplies. They say it also offers a low-cost, easy way to provide a diverse and nutritious diet.\nThe Associated Press asked several nutrition experts to explain these foods so that people can make informed choices.\nWhat are ultraprocessed foods?\nMost foods are processed, whether it is by freezing, grinding, fermentation, pasteurization or other means. In 2009, Brazilian epidemiologist Carlos Monteiro and his team first proposed a way to classify foods by how much they are processed, not by their nutrient content. This is called the Nova classification system. It is used by international bodies like the World Health Organization.\nKevin Hall is a researcher who studies metabolism and diet at the National Institutes of Health. He said that foods at the top of the Nova four-level scale are foods prepared with industrial processes and ingredients such as additives, colors and preservatives that you could not use in a home kitchen.\n\"These are most, but not all, of the packaged foods you see,\" Hall said.\nAre ultraprocessed foods harmful?\nNot all processing is unhealthy, Hall noted. Whole-grain bread, yogurt, tofu and infant formula are all highly processed, for example. But they are also nutritious.\nStill, many studies suggest that diets high in ultraprocessed foods are tied to poor health results. The exact cause is still unclear.\nHall and his partners carried out a small study with 20 people who came to live at a health center for a month. Some of the people ate ultraprocessed foods, while others ate unprocessed foods. The two groups got the same amount of calories, sugar, fat, fiber and nutrients for two weeks. They could eat as much as they liked.\nWhen people ate the diet of ultraprocessed foods, they took in about 500 calories per day more than when they ate unprocessed foods, researchers found. They gained an average of about 1 kilogram during the study period. People who ate only unprocessed foods for the same amount of time lost about 1 kilogram.\nA new study is currently taking place and its results should appear next year.\nShould ultraprocessed foods be regulated?\nDr. Neena Prasad is director of the Bloomberg Philanthropies' Food Policy Program. She said such foods are often made to be both low-cost and very tasty.\n\"You just can't stop eating them,\" Prasad said. She said she believes leaders have enough facts to change policies. This could mean raising taxes on sugary drinks, limiting salt in these foods and controlling how advertisers sell the foods to children.\nEarlier this year, Food and Drug Administration Commissioner Robert Califf told a group of food policy experts that ultraprocessed foods are a complex subject. However, Califf said, \"We've got to have the scientific basis and then we've got to follow through.\"\nHow should consumers manage ultraprocessed foods at home?\nAviva Musicus is science director for the Center for Science in the Public Interest. She said buyers should check information printed on food containers and make choices based on the current U.S. Dietary Guidelines.\n\"We have really good evidence that added sugar is not great for us. We have evidence that high-sodium foods are not great for us,\" she said.\nMusicus added, \"We have great evidence that fruits and vegetables which are minimally processed are really good for us.\"",
  "questions": [
   {
    "q": "What does the passage say about ultraprocessed foods in America?",
    "opts": [
     "They make up two-thirds of adults' diets.",
     "Young people eat an even larger share of them.",
     "Most Americans eat them only at breakfast.",
     "Most families can easily make them at home."
    ],
    "a": 1,
    "exp": "原文 \"Ultraprocessed foods make up about 60 percent of the American diet. For children and teenagers, it is even higher\"，young people 对应 children and teenagers。三分之二是青少年的比例，安到成人身上属张冠李戴；早餐只是例子之一；原文说 \"you cannot make at home\"。"
   },
   {
    "q": "What has most research so far found about these foods' health effects?",
    "opts": [
     "There are links to poor health but no proof.",
     "They clearly cause early death in most people.",
     "They have no effect on people's weight.",
     "They are safer than unprocessed foods."
    ],
    "a": 0,
    "exp": "原文 \"most research so far has found connections\" 而非 \"proof\"，links 替换 connections。早死风险只是 \"One recent study suggested\"，clearly cause 夸大程度；超重是相关结果之一；更安全是食品厂商的说法而非研究发现。"
   },
   {
    "q": "What happened when people in Hall's study ate ultraprocessed foods?",
    "opts": [
     "They lost about one kilogram in two weeks.",
     "They were offered more calories than the other group.",
     "They ate less because they disliked the taste.",
     "They took in about 500 more calories each day."
    ],
    "a": 3,
    "exp": "原文 \"they took in about 500 calories per day more than when they ate unprocessed foods\"。减重约 1 公斤的是吃未加工食品的人，属张冠李戴；两组获得的热量 \"the same amount\"；不喜欢口味与原文相反。"
   },
   {
    "q": "What does Aviva Musicus advise food buyers to do?",
    "opts": [
     "Avoid every processed food, including yogurt.",
     "Support higher taxes on sugary drinks.",
     "Read food labels and follow the dietary guidelines.",
     "Wait for the results of Hall's new study."
    ],
    "a": 2,
    "exp": "原文 \"buyers should check information printed on food containers and make choices based on the current U.S. Dietary Guidelines\"，read food labels 替换 check information printed on food containers。Hall 说酸奶等加工食品也有营养；征税是 Prasad 的政策建议，属张冠李戴；新研究结果未作为建议依据。"
   }
  ]
 },
 {
  "id": "real26",
  "title": "Learn to Have Better Balance and Prevent Falls as You Age",
  "date": "2025-01-20",
  "src": "assets/audio/real26.m4a",
  "dur": 339.6,
  "url": "https://learningenglish.voanews.com/a/learn-to-have-better-balance-and-prevent-falls-as-you-age/7935384.html",
  "words": 652,
  "script": "To age well, doctors say we should remember the importance of good balance. It matters when you wash yourself, put clothing on and, generally, move around in your home and elsewhere. As we age, good balance permits us to live more independently.\nDifficulties with balance can be dangerous. The United States Centers for Disease Control reports that three million older people in America seek medical care for fall-related injuries each year. But we can prevent some falls, said Roopa Anmolsingh. She is a geriatrician, a doctor who specializes in treating old people. She is also the creator of the balance class program at Cleveland Clinic in Ohio. She said that \"Some people have a misconception that part of getting old is, you're going to fall. That's not true. You can control how you fall, or if you fall.\"\nTo prevent falls, geriatricians say people should start asking themselves questions about their balance as early as 50 years old. Here are the questions:\nDo I ever feel unsteady?\nIf you feel unsteady, or lose balance, from time to time, ask your doctor to check all your body systems that can affect balance. Along with muscle and bone problems, unsteadiness can also result from poor blood pressure, inner-ear problems, nervous system issues and more.\nMaybe you do not have unsteadiness but wonder about your skill at balancing. You can test yourself easily and at home to find out if you need any medical intervention.\nStand next to a wall or something that can provide support if needed. Raise one leg. Can you hold that position for 10 seconds? Now try the other leg. If you can stand on each leg alone for 10 seconds, you should be fine, said Greg W. Hartley, a professor of physical therapy specializing in geriatrics at the University of Miami in Florida.\n\"If you can't do that, then you should probably go see a physical therapist,\" he said. A physical therapist treats people with conditions or injuries that affect body movement.\nAnother at-home test is called TUG, for \"timed up and go.\" Hartley suggests doing this test with supervision. You begin the test from a seated position. Then, stand up and start a timer immediately. Walk three meters, turn and walk back to your seat. Stop the timer as soon as you sit down. If the test takes you longer to complete than 15 seconds, your risk for falling is very high. But, if you do it in 12 seconds or less, your fall risk is almost zero.\nAlso, The National Council on Aging offers an online set of questions to predict your risk of a fall.\nWhat can I do to improve balance?\nBecause muscle mass lessens in most people during their 30s, geriatricians say the best way to keep good balance is to stay physically active throughout life. Anmolsingh says it is never too late to act on that advice.\nActivities including tai chi and yoga are good for older adults because they involve controlled movements while shifting body weight. There also are simpler exercises people can work into their everyday lives.\nAnmolsingh says standing on one foot while waiting in line at a store is good. Or, at home, sit down and stand up several times straight without using a support. Another easy exercise is the three-way leg lift. Hold on to a support, then lift a leg to the front, then to the side and then to the back.\nHow often should I do the exercises?\nThe National Institute of Aging says people should spend at least 150 minutes per week in general physical activity to improve balance and overall health.\nHartley said exercises done on a usual basis help train the brain to react correctly when you start to fall.\n\"Just like an athlete needs to do repetition to train for a sport, you're doing repetition to train for everyday balance activities,\" he said.",
  "questions": [
   {
    "q": "What does Roopa Anmolsingh say about falls in old age?",
    "opts": [
     "Most older people will fall at least once.",
     "Falls are mainly caused by inner-ear problems.",
     "Falling is not an unavoidable part of aging.",
     "Only doctors can help older people avoid falls."
    ],
    "a": 2,
    "exp": "原文 \"Some people have a misconception that part of getting old is, you're going to fall. That's not true. You can control how you fall, or if you fall.\" 内耳问题只是失衡的多种原因之一；原文强调自己可以控制，并非只能靠医生。"
   },
   {
    "q": "When should a person see a physical therapist, according to Hartley?",
    "opts": [
     "When they feel unsteady from time to time.",
     "When they finish the TUG test within 12 seconds.",
     "When they reach the age of 50.",
     "When they cannot stand on each leg for 10 seconds."
    ],
    "a": 3,
    "exp": "原文 \"If you can stand on each leg alone for 10 seconds, you should be fine... If you can't do that, then you should probably go see a physical therapist\"。偶尔不稳应 \"ask your doctor\" 检查身体系统，属张冠李戴；12 秒内完成 TUG 风险几乎为零；50 岁是开始自问平衡问题的年龄。"
   },
   {
    "q": "What does it mean if the TUG test takes longer than 15 seconds?",
    "opts": [
     "The person has a very high risk of falling.",
     "The person's fall risk is almost zero.",
     "The person must take the test without help.",
     "The person should repeat the test next week."
    ],
    "a": 0,
    "exp": "原文 \"If the test takes you longer to complete than 15 seconds, your risk for falling is very high\"。风险几乎为零对应 12 秒以内；Hartley 建议有人 supervision 下做测试，与无人协助相反；重测未提。"
   },
   {
    "q": "Why are regular balance exercises helpful, according to Hartley?",
    "opts": [
     "They bring back all muscle lost in one's 30s.",
     "They train the brain to react when falling.",
     "They prepare older people to play sports.",
     "They replace the need for general physical activity."
    ],
    "a": 1,
    "exp": "原文 \"exercises done on a usual basis help train the brain to react correctly when you start to fall\"。肌肉从 30 多岁开始减少，但原文没说能全部恢复；运动员只是类比；原文仍建议每周至少 150 分钟一般性运动。"
   }
  ]
 },
 {
  "id": "real27",
  "title": "Would You Pay $344 for a Coffee?",
  "date": "2024-11-25",
  "src": "assets/audio/real27.m4a",
  "dur": 254.6,
  "url": "https://learningenglish.voanews.com/a/would-you-pay-344-for-a-coffee-/7876022.html",
  "words": 434,
  "script": "A Scottish dairy, or milk cow farm, is offering what it calls Britain’s costliest coffee: one cup for $344.\nIt is a huge price for a little cup of coffee, but the man selling it offers a deal sweetener: a share of a dairy farm.\nFor that price, they also receive 34 shares in Mossgiel Organic Dairy. The company offers the deal in a crowdfunding campaign it opened. It hopes to raise enough money to enlarge its sustainable operation and produce more milk.\nInvestors who buy 34 shares get a certificate for a special coffee drink called a flat white. Holders can present their certificate and get their flat white at one of 13 coffee shops in Scotland that use the dairy's milk.\nThe dairy’s owner, Bryce Cunningham, notes his coffee costs 80 times the usual price. \"We know it sounds crazy, but when you break it down, it’s a pretty good deal. How much is the future of farming worth,” he asked.\nThe price tops the $320 for a flat white at Shot London, a coffee bar in the wealthy Mayfair and Marylebone neighborhoods. That flat white was made with rare coffee beans from Okinawa, Japan. The Telegraph newspaper reported in April that it was the most costly coffee in Britain.\nCunningham is seeking about $375,000 from small investors in order to secure a much larger bank loan. He had already raised more than a third of his goal when he offered the flat white farm shares deal.\nThe loan he is seeking is worth more than $1.1 million. He says that financing will help him double operations and expand out of Scotland all the way to London.\nShareholders receive other rewards, too, such as farm visits, milk transport deals and invitations to special events. But investors are also given a standard warning that they could lose some or all of the money they invest.\nThe dairy farm in Mauchline, about 40 kilometers south of Glasgow, is historic. The famous 18th-century Scottish poet Robert Burns once worked at the farm. Burns, considered the national poet of Scotland, wrote while working in the fields there for two years. An image of his face is on each glass container of Mossgiel milk.\nTodd Whiteford is an owner of The Good Coffee Cartel in Glasgow, that is serving the costly cups. He said the store has been using Mossgiel's milk for several years. He said other milk producers cannot meet the quality of Mossgiel’s milk. He said it makes “rounder, smoother and sweeter” drinks.\n“Theirs is the best. I’ll argue with anyone about that,” Whiteford said.",
  "questions": [
   {
    "q": "What do buyers of the $344 coffee also receive?",
    "opts": [
     "Free coffee for a year in Scotland.",
     "Rare coffee beans from Okinawa, Japan.",
     "A free trip to coffee shops in London.",
     "A share of ownership in the dairy farm."
    ],
    "a": 3,
    "exp": "原文 \"For that price, they also receive 34 shares in Mossgiel Organic Dairy\"，a share of ownership 对应 shares。冲绳稀有咖啡豆是 Shot London 那杯 $320 咖啡的特点，属张冠李戴；扩张到伦敦是农场计划，非买家所得。"
   },
   {
    "q": "Why is Cunningham raising money from small investors?",
    "opts": [
     "To help him get a much larger bank loan.",
     "To pay off the farm's old debts.",
     "To open 13 new coffee shops in Scotland.",
     "To buy rare coffee beans for his drinks."
    ],
    "a": 0,
    "exp": "原文 \"Cunningham is seeking about $375,000 from small investors in order to secure a much larger bank loan\"。13 家是已在使用该农场牛奶的咖啡店，并非新开；还债与买豆均未提及。"
   },
   {
    "q": "What is special about the dairy farm in Mauchline?",
    "opts": [
     "It was started by the poet Robert Burns.",
     "A famous Scottish poet once worked there.",
     "It is the largest dairy farm near Glasgow.",
     "It sells its milk only to London buyers."
    ],
    "a": 1,
    "exp": "原文 \"The famous 18th-century Scottish poet Robert Burns once worked at the farm\"。Burns 只是在那里干过活并写作，不是创办者；原文只说农场离 Glasgow 约 40 公里，未说最大；扩张至伦敦是未来计划。"
   },
   {
    "q": "What does Todd Whiteford think of Mossgiel's milk?",
    "opts": [
     "It is too costly for his coffee shop.",
     "It tastes about the same as other milk.",
     "It is better than milk from other producers.",
     "It makes coffee stronger and more bitter."
    ],
    "a": 2,
    "exp": "原文 \"other milk producers cannot meet the quality of Mossgiel's milk\" 和 \"Theirs is the best\"。他说这种奶让饮品 \"rounder, smoother and sweeter\"，与 stronger and more bitter 相反；他已用了多年，未嫌贵。"
   }
  ]
 },
 {
  "id": "real28",
  "title": "Power Outages Threaten Ice Cream Industry in Ecuadorean Town",
  "date": "2024-12-10",
  "src": "assets/audio/real28.m4a",
  "dur": 305.8,
  "url": "https://learningenglish.voanews.com/a/power-outages-threaten-ice-cream-industry-in-ecuadorean-town/7892713.html",
  "words": 589,
  "script": "In Ecuador, power outages threaten ice cream businesses in the small town of Salcedo in the country’s central highlands.\nIce cream production in Salcedo began in the middle of the 1900s. Women working in a Roman Catholic religious center there would make a fruit drink with milk from the area's dairy farms. One of the female religious workers, called nuns, began collecting the unused drink mixture. She turned it into creamy popsicles, frozen treats that quickly became popular.\nThe nuns sold the popsicles in town to gather money for the poor. But the people of Salcedo saw a business opportunity and began trying new flavors and methods. Soon ice cream lovers came to support the industry in the town.\nHowever, a recent wave of power outages is threatening Salcedo's ice-cream industry. The daily loss of electrical power, began earlier this year. Each outage can last up to 14 hours. The problem is a long period without rain. Ecuador gets much of its power from hydroelectric centers which depend on lakes and rainwater.\nGabriel Pumasunta is part owner, with his two brothers, of the Polar Bear ice-cream factory. He said that if the power outages continue this month, they will have to shut down the factory. Pumasunta said that much of his product has melted because of power outages.\nBefore September, Polar Bear was producing 60,000 popsicles per month. Now, the small company makes 10,000 popsicles per month. The business has been forced to let go of eight of its 10 employees. Pumasunta is spending the company's savings and those of his family. He now works on the plant's machines himself. His parents are helping to run the factory.\nSevere business losses from power outages\nEcuador’s President Daniel Noboa has not been able to solve the electricity crisis. The chamber of commerce in Guayaquil, Ecuador's largest city, estimates that power outages are creating weekly losses of $700 million for Ecuadorian businesses.\nGermán Soria is president of the association of artisanal ice-cream makers. He said that before the power crisis, Salcedo had 80 small- and medium-sized ice-cream makers and three large factories. Now, 30 of these smaller businesses have had to close. Even the large factories are slowing production.\nSoria's own ice-cream business is no longer operating. He said he stopped production three weeks ago and had to sell some equipment, as well as some land to pay his debts.\nHe said that the outages happen at unexpected times. That means buyers, like small stores, are unwilling to purchase ice cream because they are unsure whether it will melt.\nLocal officials say the power crisis has cost 300 jobs in Salcedo. The town is known for its fruit-flavored ice-cream, including flavors such as blackberries and taxo, a kind of tropical fruit.\nNew sources of power\nThe Ecuadorian government has bought some large electric generators that run on oil or gas. But as Marco Acuña, the president of Ecuador's national guild of engineers, said: \"They do not have the capacity to make up for the current deficit.\"\nIn Salcedo, the collapse of the ice-cream industry has hurt the local economy. Dairy farms, fruit growers, transporters and small stores that sell popsicles all feel the effects.\n\"Before (the power cuts) we would buy up to 150 popsicles a day,\" said Maria Juliette López, who owns a small store on the Panamerican highway where tourists and truck drivers stop to buy snacks. \"Now we can only take up to 40 popsicles a day, because any product that is left over will melt,” she said.",
  "questions": [
   {
    "q": "How did ice cream production in Salcedo begin?",
    "opts": [
     "Local dairy farmers began selling frozen milk.",
     "A nun turned an unused fruit drink into popsicles.",
     "Tourists asked shops for new fruit flavors.",
     "A large factory opened to help poor families."
    ],
    "a": 1,
    "exp": "原文 \"One of the female religious workers, called nuns, began collecting the unused drink mixture. She turned it into creamy popsicles\"。牛奶来自当地奶场，但不是奶农开创；修女卖冰棍是为穷人筹钱，并非建工厂。"
   },
   {
    "q": "What is the cause of the power outages in Ecuador?",
    "opts": [
     "Old power lines in the central highlands.",
     "Too much electricity used by ice cream factories.",
     "A long dry period without enough rain.",
     "The rising cost of oil and gas."
    ],
    "a": 2,
    "exp": "原文 \"The problem is a long period without rain. Ecuador gets much of its power from hydroelectric centers\"，dry period 替换 period without rain。燃油燃气发电机是政府的应对措施，并非停电原因。"
   },
   {
    "q": "What has happened to the Polar Bear factory?",
    "opts": [
     "It has already shut down completely.",
     "It has hired eight new workers.",
     "It has sold land to pay its debts.",
     "It now makes far fewer popsicles each month."
    ],
    "a": 3,
    "exp": "原文 \"Before September, Polar Bear was producing 60,000 popsicles per month. Now, the small company makes 10,000\"。工厂只是在停电持续时 \"will have to shut down\"；它是裁掉 10 人中的 8 人；卖地还债的是 Soria，属张冠李戴。"
   },
   {
    "q": "Why does Maria Juliette López buy fewer popsicles now?",
    "opts": [
     "Any popsicles left unsold would melt.",
     "Fewer tourists stop at her store now.",
     "Popsicle prices have risen too much.",
     "The government limits ice cream sales."
    ],
    "a": 0,
    "exp": "原文 \"Now we can only take up to 40 popsicles a day, because any product that is left over will melt\"，left unsold 替换 left over。游客与卡车司机只是说明商店位置；涨价与政府限售均未提。"
   }
  ]
 },
 {
  "id": "real29",
  "title": "Improve Your Learning By Teaching",
  "date": "2021-04-20",
  "src": "assets/audio/real29.m4a",
  "dur": 327.7,
  "url": "https://learningenglish.voanews.com/a/improve-your-learning-by-teaching-/5728658.html",
  "words": 637,
  "script": "You might be looking for new ways to improve your understanding of something you are studying. Perhaps you are seeking better methods to remember important information.\nOne way to help you reach these goals is to try teaching – not as a job, but as a way to improve your own learning.\nIn today’s Education Tips, we will explore how teaching could help your studies.\nBackground\nResearchers and educators have been interested in the link between teaching and learning for quite some time.\nA 1982 study found that tutoring helped both the tutors and the people who studied with them.\nTutoring means teaching one person or a very small group of students.\n“Like the children they helped, the tutors gained a better understanding of and developed more positive attitudes toward the subject matter covered in the tutorial program,” the researchers wrote.\nAttitude is a term that means the way you think or feel about something.\nAlso in the 1980s, Jean-Pol Martin, a French teacher in Germany, developed a way of teaching that asked students to teach each other. Martin taught language classes, but he expanded his “Learning by Teaching” method, also called LdL, to include other subjects as well.\nMore recent studies\nMore recent studies have looked at the link between teaching and memory. A 2013 study, which we briefly described in a previous Education Tips, found that teaching had a strong effect on understanding and learning.\nAn important part of the study compared the learning results of people who actually taught a lesson to those who simply prepared but did not teach.\n“Overall, these findings suggest that when students actually teach the content of a lesson, they develop a deeper and more persistent understanding of the material than from solely preparing to teach,” the researchers wrote.\nPersistent is a term that means continuing beyond the usual or expected amount of time.\nWhy Does Teaching Improve Learning?\nScientists have also explored the question of why teaching improves learning.\nA 2018 study suggests that teaching may help your learning because you have to remember the information you have learned as you continue to teach. Experts call this “retrieval.”\nThe researchers wrote that “retrieval practice possibly causes the learning benefits of teaching.”\nPractice is a term that means to do something over and over again to become better at it.\nThe basic idea is that if you want to improve your memory of what you have learned, you have to practice remembering that information.\nWhile retrieval may be one reason that teaching helps learning, there could be other reasons. The issue remains an open question.\nIdeas for how to start teaching\nThe good news is that there are many ways that you can improve your learning by teaching.\nOne way might be to teach your family or friends about something that you are learning. For example, you could teach your parents about English grammar or vocabulary.\nYou could also try teaching a younger person – perhaps a cousin, brother or sister. Try to make your lessons simple and clear, and ask them what they do not understand.\nThe process of teaching and asking for feedback will help you realize that you may not understand some things as well as you thought you did. That is an important, necessary step in the learning process.\nAnother idea is to imagine yourself describing a lesson to someone, or to write the lesson down. In the Guardian newspaper, David Robson suggests that you could write an email describing what you have learned in great detail.\nA final idea for those who like technology: You could record video of yourself teaching information. You could then send the lesson to friends or put it on YouTube or some other social media service.\nGive teaching a try and let us know if it improves your learning!",
  "questions": [
   {
    "q": "What did the 1982 study find about tutoring?",
    "opts": [
     "It helped both the tutors and their students.",
     "It helped the students but not the tutors.",
     "It worked only for young children.",
     "It was most useful in language classes."
    ],
    "a": 0,
    "exp": "原文 \"tutoring helped both the tutors and the people who studied with them\"。语言课是 Jean-Pol Martin 的 LdL 方法起源，属张冠李戴；且 Martin 后来扩展到其他学科。"
   },
   {
    "q": "What did the 2013 study suggest?",
    "opts": [
     "Preparing to teach is as useful as teaching.",
     "Teaching helps memory only for a short time.",
     "Students learn best from experienced teachers.",
     "Actually teaching leads to deeper understanding than preparing."
    ],
    "a": 3,
    "exp": "原文 \"when students actually teach the content of a lesson, they develop a deeper and more persistent understanding of the material than from solely preparing to teach\"。persistent 意为持久，与短时有效相反；仅准备不如真正去教。"
   },
   {
    "q": "What may explain the learning benefits of teaching, according to a 2018 study?",
    "opts": [
     "Teachers feel more positive about the subject.",
     "Teachers spend more hours preparing lessons.",
     "Teachers must keep recalling what they have learned.",
     "Teachers get paid to study the material."
    ],
    "a": 2,
    "exp": "原文 \"teaching may help your learning because you have to remember the information you have learned as you continue to teach\"，即 retrieval，recalling 替换 remember。态度更积极是 1982 年研究对 tutors 的描述，属张冠李戴；原文强调教学 \"not as a job\"。"
   },
   {
    "q": "Why is it useful to ask the people you teach for feedback?",
    "opts": [
     "It makes your lessons simple and clear.",
     "It shows what you do not understand well.",
     "It helps younger people learn grammar faster.",
     "It saves time compared with writing emails."
    ],
    "a": 1,
    "exp": "原文 \"The process of teaching and asking for feedback will help you realize that you may not understand some things as well as you thought you did\"。make lessons simple and clear 是同段的另一条建议，并非反馈的作用；写邮件是 David Robson 的另一种方法。"
   }
  ]
 },
 {
  "id": "real30",
  "title": "How to Break Bad Habits",
  "date": "2020-12-29",
  "src": "assets/audio/real30.m4a",
  "dur": 321.3,
  "url": "https://learningenglish.voanews.com/a/how-to-break-bad-habits-/5654403.html",
  "words": 676,
  "script": "Imagine you are studying English. Perhaps you are learning new words or expressions. But then you feel the need to check your phone. Perhaps you look on social media.\nYou return to your studies, only to look again at your phone a short time later. This process, when repeated many times, could reduce your ability to learn new material. It is what you might call a bad habit – a custom or repeated action that has a negative effect on you or your goals.\nToday, on Education Tips, we will explore how you can break bad habits, such as repeatedly checking your phone.\nWhat are habits?\nIn an earlier Education Tips story, we explored habits. Habits are ways of dealing with issues in your environment. You often do not think about them.\nIn the earlier report, we discussed how habits are made. Now, a quick reminder for you. James Clear, in his book Atomic Habits, describes a four-step process by which habits are made. These steps are cue, craving, response, and reward.\nA cue is a signal. It tells your brain to do something: to begin a behavior. A craving is a desire for something. The response, or reaction, is the habit that you perform. The response gives you a reward.\n“Rewards are the end goal of every habit,” Clear writes.\nIn our cell phone example, the cue is seeing the cell phone. The craving is the desire or urge to check your phone. The response is checking your phone. The reward might be seeing something interesting on social media, for example.\nJames Clear notes that to break bad habits, you need to think about each step in the habit-making process.\nTo break a habit, he writes, you should think about making the bad habit invisible, unattractive, difficult and unsatisfying.\nTo make your phone invisible, you could hide it away. To make it unattractive, you could think about why it is a good idea to stop checking the phone. To make phone use difficult, you can increase the space between you and your phone. To make your phone unsatisfying, you could make a habit contract. For example, you could ask a family member to watch your behavior and point out when you check your phone. You could promise to pay that person every time you look at the device while you are studying.\nMore ideas about reducing cell phone use\nWendy Wood is a psychologist and an expert on habits. In the book Good Habits, Bad Habits, she offers some ideas on how people can cut back on their cell phone use.\nOne suggestion is to wear a wristwatch. This will limit at least one reason for looking at the phone – checking the time.\nWood notes the importance of increasing the number of steps you need to take in order to use your cell phone.\n“Silence it. Turn it off. Switch on your phone’s Do Not Disturb mode,” she writes. She adds that you can move your phone to a place that is more difficult to reach. For example, you can put your phone inside a backpack.\nWood also suggests another way to think about cell phone use. She says you can add a new, healthy habit onto your cell phone habit. “What about if every time you check your phone, you call one member of your family just to say hello and have a quick … chat?” she asks.\nFinally, Wood suggests one kind of reward you could give yourself for not looking at your phone: reading a good book.\nClosing thoughts\nToday, we discussed ideas for reducing your cell phone use. But you can use these ideas to break other behaviors.\nThe important thing to remember is that people can change their habits. But they must think carefully about their surroundings or environment. You might decide to stop doing an action, but if such an action is very easy for you to do, you will probably continue doing it.\nHabit changes take time. But with patience, planning, and repetition, you can do it.",
  "questions": [
   {
    "q": "What is this Education Tips program mainly about?",
    "opts": [
     "How habits help people learn English faster.",
     "Why social media harms language students.",
     "Ways to break bad habits like checking phones.",
     "How James Clear wrote his book Atomic Habits."
    ],
    "a": 2,
    "exp": "原文 \"Today, on Education Tips, we will explore how you can break bad habits, such as repeatedly checking your phone\"。学英语只是开头情境；社交媒体是例子中的奖励；Clear 的书被引用但不是主题。"
   },
   {
    "q": "According to Clear, how can you make phone use unsatisfying?",
    "opts": [
     "Hide the phone where you cannot see it.",
     "Promise to pay someone each time you check it.",
     "Keep the phone farther away from you.",
     "Think about why checking it is a bad idea."
    ],
    "a": 1,
    "exp": "原文 \"To make your phone unsatisfying, you could make a habit contract... You could promise to pay that person every time you look at the device\"。藏起来对应 invisible，拉开距离对应 difficult，思考为何不该看对应 unattractive，均属张冠李戴。"
   },
   {
    "q": "Why does Wendy Wood suggest wearing a wristwatch?",
    "opts": [
     "It removes one reason for looking at the phone.",
     "It reminds students when to stop studying.",
     "It serves as a reward for not using phones.",
     "It makes the phone harder to reach."
    ],
    "a": 0,
    "exp": "原文 \"This will limit at least one reason for looking at the phone\"，即看时间。Wood 建议的奖励是读一本好书；让手机难拿是放进背包等另外的做法，属张冠李戴。"
   },
   {
    "q": "What is the speaker's final point about changing habits?",
    "opts": [
     "Habits cannot change once they are formed.",
     "Easy actions are the easiest ones to stop.",
     "These ideas work only for phone habits.",
     "It takes time, but patience and planning help."
    ],
    "a": 3,
    "exp": "原文 \"Habit changes take time. But with patience, planning, and repetition, you can do it.\" 原文说 \"people can change their habits\"；动作越容易做越可能继续做，与第二项相反；原文说这些方法也可用于 \"break other behaviors\"。"
   }
  ]
 },
 {
  "id": "real31",
  "title": "Using AI Wisely and Responsibly at NASA",
  "episode": "AI at NASA",
  "org": "NASA",
  "show": "NASA · Houston We Have a Podcast",
  "type": "conv",
  "date": "29 May 2026",
  "src": "assets/audio/real31.m4a",
  "dur": 234.6,
  "url": "https://www.nasa.gov/podcasts/nasa-podcasts/ai-at-nasa/",
  "words": 600,
  "script": "Nilufar Ramji: So let’s, let’s talk about what not to do. What don’t you do with AI? And any advice on how we can adopt the technology and be safe, given that we’re a federal agency? What do we not do?\nKevin Murphy: So you know, I think I would say that you explore using AI, but you don’t let it make your decisions for you, right? You don’t want to set up a chat bot which responds to all your emails in your inbox, right? You want to be careful. You don’t know what it will say. And there have been horror stories out there, kind of in in the media or the tech news circles, where people have done that, you know, they’ve given AI access to all their social media accounts. It’s a disaster. You don’t want to do things like that. So use common sense, I think, is the best way to put it. Things that you need to do and are need to be high quality, need to be reviewed by you.\nNilufar Ramji: I completely agree, although the notion of a clear and manageable inbox sounds dreamy, we need to make sure that we humans are doing like you said, our due diligence and checking our work. I’m smiling at that on the inside, one day, my inbox will be manageable. Okay, so-\nKevin Murphy: I don’t know about that!\nNilufar Ramji: We can sure dream. Let’s talk a little bit about workforce so people like me, I remember a couple of summers ago, NASA did this thing called the summer of AI, where we were learning, and we had different opportunities for brown bag lunches and to kind of talk about how we can adopt that technology here. So tell us a little bit about how your team are helping to train the workforce.\nKevin Murphy: So today, we have a number of opportunities which are primarily discussion based. We are evaluating how we are going to make that transition from kind of just generalized discussions into an environment where people can learn how to use it more effectively. So I’d say that, you know, participate in the discussions in the communities of practice for now, but over the next, you know, little bit we’ll have a much more concentrated area in terms of how we enable the workforce to do this. There are a bunch of people out there that that are AI experts at centers and other places, and I would encourage people to go and reach out to them, because they have a lot of deep bench knowledge.\nNilufar Ramji: That’s fantastic. And you know, I I’m a Office of Communications employee, so I have to ask this question, we can generate so many AI images lately, like I know that you know, just looking scrolling through my feeds during the Artemis II mission, I saw photos of the moon that I knew were definitely AI generated. So just in that vein of conversation, how are we as an agency ensuring that all of our content is factual and real, and ensure that the public knows that we are not generating any mission imagery, and that we are putting out real time operations and real time imagery.\nKevin Murphy: NASA has a responsibility to the American public and the taxpayers that we would never publish things that could be misinterpreted as actual mission imagery or scientific information, which was AI generated. For things that would look like generative AI, which we can use potentially for, you know, future states or simulations of activities, you know, we do put an AI generated by AI label on them.",
  "segs": [
   [
    0.0,
    13.2,
    "Nilufar Ramji",
    "So let’s, let’s talk about what not to do. What don’t you do with AI? And any advice on how we can adopt the technology and be safe, given that we’re a federal agency? What do we not do?"
   ],
   [
    13.2,
    59.2,
    "Kevin Murphy",
    "So you know, I think I would say that you explore using AI, but you don’t let it make your decisions for you, right? You don’t want to set up a chat bot which responds to all your emails in your inbox, right? You want to be careful. You don’t know what it will say. And there have been horror stories out there, kind of in in the media or the tech news circles, where people have done that, you know, they’ve given AI access to all their social media accounts. It’s a disaster. You don’t want to do things like that. So use common sense, I think, is the best way to put it. Things that you need to do and are need to be high quality, need to be reviewed by you."
   ],
   [
    59.2,
    77.4,
    "Nilufar Ramji",
    "I completely agree, although the notion of a clear and manageable inbox sounds dreamy, we need to make sure that we humans are doing like you said, our due diligence and checking our work. I’m smiling at that on the inside, one day, my inbox will be manageable. Okay, so-"
   ],
   [
    77.4,
    79.4,
    "Kevin Murphy",
    "I don’t know about that!"
   ],
   [
    79.4,
    107.8,
    "Nilufar Ramji",
    "We can sure dream. Let’s talk a little bit about workforce so people like me, I remember a couple of summers ago, NASA did this thing called the summer of AI, where we were learning, and we had different opportunities for brown bag lunches and to kind of talk about how we can adopt that technology here. So tell us a little bit about how your team are helping to train the workforce."
   ],
   [
    107.8,
    157.5,
    "Kevin Murphy",
    "So today, we have a number of opportunities which are primarily discussion based. We are evaluating how we are going to make that transition from kind of just generalized discussions into an environment where people can learn how to use it more effectively. So I’d say that, you know, participate in the discussions in the communities of practice for now, but over the next, you know, little bit we’ll have a much more concentrated area in terms of how we enable the workforce to do this. There are a bunch of people out there that that are AI experts at centers and other places, and I would encourage people to go and reach out to them, because they have a lot of deep bench knowledge."
   ],
   [
    157.5,
    200.4,
    "Nilufar Ramji",
    "That’s fantastic. And you know, I I’m a Office of Communications employee, so I have to ask this question, we can generate so many AI images lately, like I know that you know, just looking scrolling through my feeds during the Artemis II mission, I saw photos of the moon that I knew were definitely AI generated. So just in that vein of conversation, how are we as an agency ensuring that all of our content is factual and real, and ensure that the public knows that we are not generating any mission imagery, and that we are putting out real time operations and real time imagery."
   ],
   [
    200.4,
    234.6,
    "Kevin Murphy",
    "NASA has a responsibility to the American public and the taxpayers that we would never publish things that could be misinterpreted as actual mission imagery or scientific information, which was AI generated. For things that would look like generative AI, which we can use potentially for, you know, future states or simulations of activities, you know, we do put an AI generated by AI label on them."
   ]
  ],
  "questions": [
   {
    "q": "What is the man's main advice about using AI?",
    "opts": [
     "Federal employees should avoid AI tools until clear rules are made.",
     "People can try AI out but should not let it make decisions for them.",
     "AI is best used for routine tasks like clearing one's inbox.",
     "AI results are reliable as long as they come from trusted tools."
    ],
    "a": 1,
    "exp": "原文 \"you explore using AI, but you don't let it make your decisions for you\"，can try AI out 同义替换 explore using AI。A 与 explore using AI 相反；C 是主持人的玩笑愿望，男士恰恰反对让 chatbot 处理邮件；D 无中生有，原文强调重要的东西 \"need to be reviewed by you\"。"
   },
   {
    "q": "What does the man mention as an example of misusing AI?",
    "opts": [
     "Using it to summarize stories in the tech news.",
     "Asking it to review work that must be of high quality.",
     "Discussing its use in communities of practice.",
     "Letting a chatbot reply to all of one's emails automatically."
    ],
    "a": 3,
    "exp": "原文 \"You don't want to set up a chat bot which responds to all your emails in your inbox\"，reply to all of one's emails automatically 同义替换。A 偷换，tech news 只是 horror stories 出现的地方；B 张冠李戴，原文说高质量的工作要由人自己 review；C 是他推荐的做法。"
   },
   {
    "q": "How is NASA's workforce mainly learning about AI at present?",
    "opts": [
     "Through discussion-based activities such as communities of practice.",
     "Through a required summer course organized every year.",
     "Through a concentrated training platform that was just launched.",
     "Through one-on-one sessions with outside technology firms."
    ],
    "a": 0,
    "exp": "原文 \"today, we have a number of opportunities which are primarily discussion based\" 并建议 \"participate in the discussions in the communities of practice for now\"，mainly 对应 primarily。B 的 summer of AI 是主持人回忆的几年前活动；C 是 \"over the next, you know, little bit\" 将来才有的；D 无中生有，他建议找的是各中心内部的 AI 专家。"
   },
   {
    "q": "What does NASA do with AI-generated images showing possible future activities?",
    "opts": [
     "It avoids producing such images altogether.",
     "It publishes them alongside real mission photos.",
     "It clearly marks them as having been made by AI.",
     "It only releases them when the public requests them."
    ],
    "a": 2,
    "exp": "原文 \"we do put an AI generated by AI label on them\"，clearly marks them as made by AI 同义替换 put a label。A 错，原文说可用于 \"future states or simulations\"；B 与 \"would never publish things that could be misinterpreted as actual mission imagery\" 相反；D 无中生有。"
   }
  ]
 },
 {
  "id": "real32",
  "title": "How Space Data Helps Disaster Preparedness",
  "episode": "Natural Disaster Response",
  "org": "NASA",
  "show": "NASA · Houston We Have a Podcast",
  "type": "conv",
  "date": "09 May 2025",
  "src": "assets/audio/real32.m4a",
  "dur": 258.8,
  "url": "https://www.nasa.gov/podcasts/houston-we-have-a-podcast/natural-disaster-response/",
  "words": 739,
  "script": "Dane Turner: Fantastic. So what kinds of things are you able to learn from, from all of these different areas that you can learn from space that you can’t get from the ground.\nWill Stefanov: Well, the vantage point from space allows you to see a much larger area in a very holistic snapshot in time. Way, when you’re on the ground, you’re fairly limited to dealing with what’s right around you. When you have the the broader view from orbital or airborne data, you can get a much you can get a sense, a more regional sense, of what’s happening. You can see, all right, well, we’re working on this firefront Right here, but Oh, there’s another fire front which we’re seeing over here. So it helps. It works together with the ground observations, just to make sure that we have a broader contextual view of an event and what’s happening with it. It’s also useful for sort of, in a post event type of way. It’s useful to help improve the science on disasters and what, how their what their effects are. For instance, say, the data that we’ve collected from the Southern California wildfires, that information, those maps that we developed, they were useful in the moment for emergency response. They can also now be useful for people researching what happens after vegetation is removed following a wildfire, what happens to the. Soil properties after a after a big wildfire goes through, what? How does that affect? Landslide formation, soil and soil mobilization and runoff, all those things. All that research then feeds into better preparedness for the next thing you know, the next time it happens, we have a better sense of these are the kind of things we need to be looking out for. These are the kind of effects we can expect to happen after this event.\nDane Turner: So all this data really helps, long term, to to help with with the response, not just the response, but also preparing afterwards, preparing for maybe the next event or just the rebuilding of the event, and make sure everything is is going along correctly for that\nWill Stefanov: absolutely. And some of this data can also be used. One of the thing that once, something that’s very big in emergency management training, and for us to DRCS, is simulations, you know, preparing people for how to respond to an event. You know, what are the steps that need to be taken. And this data that we collect and keep after an event is also directly useful for those kind of simulations. You know, we don’t have to make up an event from scratch. We can say, this is this actually happened, and this is what we actually saw. And we can design our training programs accordingly.\nDane Turner: What kind of simulations do you do to prepare?\nWill Stefanov: they’re usually, they’re called, generally, the tabletop simulations. So you could have a very common simulation for our part of the country down here is Hurricane simulations. You know, we just construct a scenario where there’s a cat three hurricane, which is here we’ll just use Houston, because here we are, a cat three hurricane is predicted to impact Houston in a week. You know, what? What do we do? How do we prepare for it? This is where you engage the various organizations that would be involved in a response and the preparation for it. And so, from the NASA’s, the NASA perspective, we would be engaged in, all right, what happens when we activate? You know, we in this simulation, we receive a request from FEMA. We want to know we would like before imagery, imagery during the event and after imagery. And so then we work through the simulation and we model what happens. Like, what sensors do we have available at the time the hurricane is passing, what’s the weather conditions going to be like? You know, if we can’t, if it’s completely cloud covered, do we have other assets that we can use? So, like radar assets that can image the ground surface through the clouds. And so we work all those processes to make sure that we’re coordinating with each other. We’re talking we’re scheduling data collections from the various sensors, we’re engaging the appropriate science teams that would need to be engaged to develop products, and making sure that how all of our reporting channels are set up correctly.",
  "segs": [
   [
    0.0,
    11.7,
    "Dane Turner",
    "Fantastic. So what kinds of things are you able to learn from, from all of these different areas that you can learn from space that you can’t get from the ground."
   ],
   [
    11.7,
    111.3,
    "Will Stefanov",
    "Well, the vantage point from space allows you to see a much larger area in a very holistic snapshot in time. Way, when you’re on the ground, you’re fairly limited to dealing with what’s right around you. When you have the the broader view from orbital or airborne data, you can get a much you can get a sense, a more regional sense, of what’s happening. You can see, all right, well, we’re working on this firefront Right here, but Oh, there’s another fire front which we’re seeing over here. So it helps. It works together with the ground observations, just to make sure that we have a broader contextual view of an event and what’s happening with it. It’s also useful for sort of, in a post event type of way. It’s useful to help improve the science on disasters and what, how their what their effects are. For instance, say, the data that we’ve collected from the Southern California wildfires, that information, those maps that we developed, they were useful in the moment for emergency response. They can also now be useful for people researching what happens after vegetation is removed following a wildfire, what happens to the. Soil properties after a after a big wildfire goes through, what? How does that affect? Landslide formation, soil and soil mobilization and runoff, all those things. All that research then feeds into better preparedness for the next thing you know, the next time it happens, we have a better sense of these are the kind of things we need to be looking out for. These are the kind of effects we can expect to happen after this event."
   ],
   [
    111.3,
    130.0,
    "Dane Turner",
    "So all this data really helps, long term, to to help with with the response, not just the response, but also preparing afterwards, preparing for maybe the next event or just the rebuilding of the event, and make sure everything is is going along correctly for that"
   ],
   [
    130.0,
    163.6,
    "Will Stefanov",
    "absolutely. And some of this data can also be used. One of the thing that once, something that’s very big in emergency management training, and for us to DRCS, is simulations, you know, preparing people for how to respond to an event. You know, what are the steps that need to be taken. And this data that we collect and keep after an event is also directly useful for those kind of simulations. You know, we don’t have to make up an event from scratch. We can say, this is this actually happened, and this is what we actually saw. And we can design our training programs accordingly."
   ],
   [
    163.6,
    165.8,
    "Dane Turner",
    "What kind of simulations do you do to prepare?"
   ],
   [
    165.8,
    258.8,
    "Will Stefanov",
    "they’re usually, they’re called, generally, the tabletop simulations. So you could have a very common simulation for our part of the country down here is Hurricane simulations. You know, we just construct a scenario where there’s a cat three hurricane, which is here we’ll just use Houston, because here we are, a cat three hurricane is predicted to impact Houston in a week. You know, what? What do we do? How do we prepare for it? This is where you engage the various organizations that would be involved in a response and the preparation for it. And so, from the NASA’s, the NASA perspective, we would be engaged in, all right, what happens when we activate? You know, we in this simulation, we receive a request from FEMA. We want to know we would like before imagery, imagery during the event and after imagery. And so then we work through the simulation and we model what happens. Like, what sensors do we have available at the time the hurricane is passing, what’s the weather conditions going to be like? You know, if we can’t, if it’s completely cloud covered, do we have other assets that we can use? So, like radar assets that can image the ground surface through the clouds. And so we work all those processes to make sure that we’re coordinating with each other. We’re talking we’re scheduling data collections from the various sensors, we’re engaging the appropriate science teams that would need to be engaged to develop products, and making sure that how all of our reporting channels are set up correctly."
   ]
  ],
  "questions": [
   {
    "q": "What does the man see as the main advantage of observing disasters from space?",
    "opts": [
     "It removes the need for observers on the ground.",
     "It gives a wider overall picture of an event at a single moment.",
     "It allows emergency teams to put out fires more quickly.",
     "It provides close-up details of damaged buildings."
    ],
    "a": 1,
    "exp": "原文 \"allows you to see a much larger area in a very holistic snapshot in time\"，a wider overall picture at a single moment 同义替换 larger area / holistic snapshot in time。A 与 \"works together with the ground observations\" 相反；C 以偏概全，火线只是举例看到另一处火线；D 无中生有。"
   },
   {
    "q": "How can the maps made during the Southern California wildfires be used later?",
    "opts": [
     "To help researchers study how wildfires affect soil and landslides.",
     "To decide where damaged homes should be rebuilt.",
     "To teach firefighters how to operate space sensors.",
     "To predict exactly when the next wildfire will start."
    ],
    "a": 0,
    "exp": "原文 \"useful for people researching what happens after vegetation is removed following a wildfire\"，并提到 soil properties、landslide formation。B 偷换，rebuilding 是主持人下一句的泛泛说法；C 无中生有；D 偷换概念，原文只说 \"better sense of\" 该注意什么，不是精确预测时间。"
   },
   {
    "q": "Why does the man say data collected after real events is useful for training?",
    "opts": [
     "It lowers the cost of running tabletop exercises.",
     "It shows trainees which agencies failed to respond.",
     "It allows simulations to be dropped from training.",
     "It lets simulations be based on what actually happened."
    ],
    "a": 3,
    "exp": "原文 \"we don't have to make up an event from scratch. We can say, this is this actually happened\"，based on what actually happened 同义替换。A、B 无中生有；C 与原文相反，数据正是用来做 simulations 的。"
   },
   {
    "q": "In the hurricane simulation, what would the team do if the area were completely covered by clouds?",
    "opts": [
     "Wait until the weather became clear again.",
     "Ask FEMA to send aircraft to take photos.",
     "Turn to other instruments, such as radar.",
     "Rely only on images taken before the storm."
    ],
    "a": 2,
    "exp": "原文 \"if it's completely cloud covered, do we have other assets that we can use? So, like radar assets that can image the ground surface through the clouds\"，other instruments 同义替换 other assets。B 张冠李戴，FEMA 是提需求的一方；D 偷换，before imagery 只是 FEMA 要求的三类影像之一；A 无中生有。"
   }
  ]
 },
 {
  "id": "real33",
  "title": "An Astronaut's Advice on Lifelong Learning",
  "episode": "The Pursuit of Lifelong Learning",
  "org": "NASA",
  "show": "NASA · Houston We Have a Podcast",
  "type": "conv",
  "date": "28 Mar 2025",
  "src": "assets/audio/real33.m4a",
  "dur": 212.6,
  "url": "https://www.nasa.gov/podcasts/houston-we-have-a-podcast/the-pursuit-of-lifelong-learning/",
  "words": 547,
  "script": "Kenna Pell: Got two last questions. The first one is you as a lifelong learner. Do you have any suggestions on how people can do that? I was gonna say here on the ground, but just in general, I mean volunteering, reading, podcasts. What do you recommend?\nJonny Kim: Curiosity is a prerequisite. If you’re not having fun or you’re not passionate about what you’re learning, then it’s going to seem like you’re studying, and no one wants to study for a long period of time. You have to be passionate about what you’re learning. You also have to remove this facade that you’re too old or you’re too ingrained to learn something new. If you think like that, you can’t be a lifelong learner. Lifelong learners have this purity about the love of learning something new and the humility that they’ll never have it all, but if you have the hunger we talked about, that curiosity and remove any kind of inhibition that you can’t learn, you can really learn anything. I mean the world, with the resources we have at hand, there’s never been a better time to learn anything new. You could pick up a computer, and with acute keystrokes, you can learn how to do car maintenance or how to build a new computer, or how to code. And I think that’s just such an important love to have, and something that I hope to instill in my own kids. My oldest, as mentioned, 13, and he really wanted to build a computer. Of course, he wanted to build a gaming computer, but I wanted to take advantage of this, this new, this desire. And so my deal with him was, well, if you go and learn all the different components of a computer and how to build one and use YouTube. Do we’ll build one together, and that was one of the cool things we got to do over the summer during one of my trips back to the States.\nKenna Pell: Awesome What does a typical day look like for you? Time you get up, coffee or tea, you work out in the morning or the evening\nJonny Kim: My schedule is very erratic these days, because half, about 40 to 45% of my time is spent in a different country, or just not in Houston. So a lot of time in planes and airports on travel and when I’m home, you know, it’s just my family. They haven’t seen me for six weeks. And you know, there’s so many things to catch up on, and so I My schedule is pretty day to day. I could not really tell you an average what I’m doing, nor what time I regularly wake up. I used to be a pretty disciplined early morning waker with early morning workouts at just the demands of my job these days don’t allow for that, and so I sneak them in when I can, I try and wake up early because I’m generally more productive in the mornings. And, you know, in Houston, I might be doing a podcast with you, or the next day I might be getting in the space suit and learning about AMS or some of the other payloads that we might encounter during our mission on the space station.",
  "segs": [
   [
    0.0,
    17.4,
    "Kenna Pell",
    "Got two last questions. The first one is you as a lifelong learner. Do you have any suggestions on how people can do that? I was gonna say here on the ground, but just in general, I mean volunteering, reading, podcasts. What do you recommend?"
   ],
   [
    17.4,
    127.0,
    "Jonny Kim",
    "Curiosity is a prerequisite. If you’re not having fun or you’re not passionate about what you’re learning, then it’s going to seem like you’re studying, and no one wants to study for a long period of time. You have to be passionate about what you’re learning. You also have to remove this facade that you’re too old or you’re too ingrained to learn something new. If you think like that, you can’t be a lifelong learner. Lifelong learners have this purity about the love of learning something new and the humility that they’ll never have it all, but if you have the hunger we talked about, that curiosity and remove any kind of inhibition that you can’t learn, you can really learn anything. I mean the world, with the resources we have at hand, there’s never been a better time to learn anything new. You could pick up a computer, and with acute keystrokes, you can learn how to do car maintenance or how to build a new computer, or how to code. And I think that’s just such an important love to have, and something that I hope to instill in my own kids. My oldest, as mentioned, 13, and he really wanted to build a computer. Of course, he wanted to build a gaming computer, but I wanted to take advantage of this, this new, this desire. And so my deal with him was, well, if you go and learn all the different components of a computer and how to build one and use YouTube. Do we’ll build one together, and that was one of the cool things we got to do over the summer during one of my trips back to the States."
   ],
   [
    127.0,
    138.4,
    "Kenna Pell",
    "Awesome What does a typical day look like for you? Time you get up, coffee or tea, you work out in the morning or the evening"
   ],
   [
    138.4,
    212.6,
    "Jonny Kim",
    "My schedule is very erratic these days, because half, about 40 to 45% of my time is spent in a different country, or just not in Houston. So a lot of time in planes and airports on travel and when I’m home, you know, it’s just my family. They haven’t seen me for six weeks. And you know, there’s so many things to catch up on, and so I My schedule is pretty day to day. I could not really tell you an average what I’m doing, nor what time I regularly wake up. I used to be a pretty disciplined early morning waker with early morning workouts at just the demands of my job these days don’t allow for that, and so I sneak them in when I can, I try and wake up early because I’m generally more productive in the mornings. And, you know, in Houston, I might be doing a podcast with you, or the next day I might be getting in the space suit and learning about AMS or some of the other payloads that we might encounter during our mission on the space station."
   ]
  ],
  "questions": [
   {
    "q": "What does the man consider essential for being a lifelong learner?",
    "opts": [
     "Following a strict study timetable.",
     "Being truly curious and passionate about the subject.",
     "Getting formal training at a university.",
     "Having guidance from experienced teachers."
    ],
    "a": 1,
    "exp": "原文 \"Curiosity is a prerequisite\" 和 \"You have to be passionate about what you're learning\"，essential 同义替换 prerequisite。A 反向，他说当成 studying 就没人能坚持；C、D 无中生有，他强调的是借助电脑和网上资源自学。"
   },
   {
    "q": "What belief does the man say people must get rid of in order to keep learning?",
    "opts": [
     "That they are too old or too set in their ways to learn.",
     "That making mistakes in front of others is shameful.",
     "That learning must be directly useful for their jobs.",
     "That they should master a subject before moving on."
    ],
    "a": 0,
    "exp": "原文 \"remove this facade that you're too old or you're too ingrained to learn something new\"，get rid of 同义替换 remove，too set in their ways 对应 too ingrained。D 偷换，他说学习者要谦虚地承认 \"they'll never have it all\"；B、C 无中生有。"
   },
   {
    "q": "What deal did the man make with his oldest son?",
    "opts": [
     "He would buy his son a gaming computer as a reward.",
     "He would teach his son to code during his trips home.",
     "They would build a computer together once the son learned how.",
     "His son would watch online videos to repair the family car."
    ],
    "a": 2,
    "exp": "原文 \"if you go and learn all the different components of a computer and how to build one ... we'll build one together\"。A 偷换，儿子想要游戏电脑，但约定是一起组装而非买；B 张冠李戴，coding 只是举例可学的技能；D 把 car maintenance 这一泛泛举例安到儿子身上。"
   },
   {
    "q": "Why is the man's daily schedule so irregular these days?",
    "opts": [
     "He has to care for his three children on his own.",
     "He prefers working late at night when it is quiet.",
     "He records interviews and podcasts almost every day.",
     "He spends a large part of his time away from Houston."
    ],
    "a": 3,
    "exp": "原文 \"about 40 to 45% of my time is spent in a different country, or just not in Houston\"，a large part of his time away from Houston 同义替换。B 与 \"I'm generally more productive in the mornings\" 相反；C 以偏概全，podcast 只是在 Houston 时可能做的事之一；A 无中生有。"
   }
  ]
 },
 {
  "id": "real34",
  "title": "How Astronauts Sleep on the Space Station",
  "episode": "Spaceflight Adaptation",
  "org": "NASA",
  "show": "NASA · Houston We Have a Podcast",
  "type": "conv",
  "date": "31 Jan 2025",
  "src": "assets/audio/real34.m4a",
  "dur": 218.1,
  "url": "https://www.nasa.gov/podcasts/houston-we-have-a-podcast/spaceflight-adaptation/",
  "words": 691,
  "script": "Host: That’s great. Now, I’ve heard it both ways on sleep. Some astronauts say they sleep the best they’ve ever slept in space. While I’ve heard some say that they prefer their own bed at home, how does space impact astronauts sleep pattern?\nJ.D. Polk: Well, the one good news is, uh, you know, gravity causes your tongue to fall back in your throat, and you can snore on the ground. <laugh>, you don’t snore in space. Uh, your, your tongue does not fall back in the back of your throat due to gravity. So, uh, you know, uh, we don’t have any complaint about, uh, astronaut, uh, you know, John, John over heres snoring and keeping the rest of us awake. It does not happen. So that’s, that’s one good thing, uh, about space flight. Um, but, uh, you know, you have 17 sunrises and sunsets, so it, it’s difficult to get into a circadian rhythm. Um, and that’s one of the reasons that it’s important that we have, uh, a, a timeline when they get up and they go to bed, and we have certain lighting that occurs with, uh, with an amount, uh, some small amount of blue light and other things that are, that are in that lighting to give them some feeling of daylight, if you will, uh, to help get their cortisol, uh, aligned and, and so that they can sleep. Um, some folks, uh, you know, sleep only six hours normally, and, and they find that they’re sleeping only six hours on ISS as well. And, and as you mentioned, some people, uh, you know, sleep like a bug in a rug, and they’re, they’re, uh, sleeping and feel like it’s the best sleep they’ve ever had. Uh, you don’t have to worry about turnover, you know, feeling like you’ve compressed this arm or that leg too much. You know, sometimes we all do that when we’re, uh, lying in bed at night and feel like we’ve laid it on one side too long, don’t really get that on orbit. And so, uh, some people feel like it’s the most restful sleep they’ve ever had.\nHost: Can you explain the sleeping quarters on the station? How do you prevent an astronaut from floating off in the middle of their sleep?\nJ.D. Polk: Yeah, sometimes it’s just as simple as having, uh, what, what amounts to a sleeping bag, if you will, that keeps them, uh, in place, but also we want them to be able hear any cautions for alarms or, you know, if there’s a fire alarm or smoke alarm or something else going on. So we have a sleep quarters that allows them, uh, you know, to where they can hear the caution and warnings. Uh, but also, uh, some folks feel like they need, uh, like a compression or a cover or, or some feeling of a cocoon, if you will. And so they can have that as well. And that’s, uh, but very often they sleep and their arms float up, uh, and their elbows are bent and, and they’re just, you know, floating in front of ’em. And, uh, and that’s typically the position that, uh, a lot of them sleep in.\nHost: How long does it typically take for astronauts to adapt to sleep on orbit?\nJ.D. Polk: You know, I think that really depends on the astronaut. Uh, some folks adapt very quickly. Um, some folks take a while to get into the, the rhythm, uh, and the timeline. And I think probably that also aligns with how often you have flown that when you’re a first time flyer and it’s new and it’s exciting and, and, you know, you’re, you’re nervous ’cause you don’t wanna, uh, you wanna make sure you follow the instructions on the, the procedures that you’re doing and et cetera. Um, you know, you probably have some apprehension and it takes you a while to, to, you know, calm down and be ready to, to sleep. Whereas, uh, repeat flyers are like, oh, it’s bedtime. And so it, it probably does, uh, change a little bit based on frequency of flight.",
  "segs": [
   [
    0.0,
    14.9,
    "Host",
    "That’s great. Now, I’ve heard it both ways on sleep. Some astronauts say they sleep the best they’ve ever slept in space. While I’ve heard some say that they prefer their own bed at home, how does space impact astronauts sleep pattern?"
   ],
   [
    14.9,
    113.6,
    "J.D. Polk",
    "Well, the one good news is, uh, you know, gravity causes your tongue to fall back in your throat, and you can snore on the ground. <laugh>, you don’t snore in space. Uh, your, your tongue does not fall back in the back of your throat due to gravity. So, uh, you know, uh, we don’t have any complaint about, uh, astronaut, uh, you know, John, John over heres snoring and keeping the rest of us awake. It does not happen. So that’s, that’s one good thing, uh, about space flight. Um, but, uh, you know, you have 17 sunrises and sunsets, so it, it’s difficult to get into a circadian rhythm. Um, and that’s one of the reasons that it’s important that we have, uh, a, a timeline when they get up and they go to bed, and we have certain lighting that occurs with, uh, with an amount, uh, some small amount of blue light and other things that are, that are in that lighting to give them some feeling of daylight, if you will, uh, to help get their cortisol, uh, aligned and, and so that they can sleep. Um, some folks, uh, you know, sleep only six hours normally, and, and they find that they’re sleeping only six hours on ISS as well. And, and as you mentioned, some people, uh, you know, sleep like a bug in a rug, and they’re, they’re, uh, sleeping and feel like it’s the best sleep they’ve ever had. Uh, you don’t have to worry about turnover, you know, feeling like you’ve compressed this arm or that leg too much. You know, sometimes we all do that when we’re, uh, lying in bed at night and feel like we’ve laid it on one side too long, don’t really get that on orbit. And so, uh, some people feel like it’s the most restful sleep they’ve ever had."
   ],
   [
    113.6,
    120.3,
    "Host",
    "Can you explain the sleeping quarters on the station? How do you prevent an astronaut from floating off in the middle of their sleep?"
   ],
   [
    120.3,
    163.8,
    "J.D. Polk",
    "Yeah, sometimes it’s just as simple as having, uh, what, what amounts to a sleeping bag, if you will, that keeps them, uh, in place, but also we want them to be able hear any cautions for alarms or, you know, if there’s a fire alarm or smoke alarm or something else going on. So we have a sleep quarters that allows them, uh, you know, to where they can hear the caution and warnings. Uh, but also, uh, some folks feel like they need, uh, like a compression or a cover or, or some feeling of a cocoon, if you will. And so they can have that as well. And that’s, uh, but very often they sleep and their arms float up, uh, and their elbows are bent and, and they’re just, you know, floating in front of ’em. And, uh, and that’s typically the position that, uh, a lot of them sleep in."
   ],
   [
    163.8,
    170.3,
    "Host",
    "How long does it typically take for astronauts to adapt to sleep on orbit?"
   ],
   [
    170.3,
    218.1,
    "J.D. Polk",
    "You know, I think that really depends on the astronaut. Uh, some folks adapt very quickly. Um, some folks take a while to get into the, the rhythm, uh, and the timeline. And I think probably that also aligns with how often you have flown that when you’re a first time flyer and it’s new and it’s exciting and, and, you know, you’re, you’re nervous ’cause you don’t wanna, uh, you wanna make sure you follow the instructions on the, the procedures that you’re doing and et cetera. Um, you know, you probably have some apprehension and it takes you a while to, to, you know, calm down and be ready to, to sleep. Whereas, uh, repeat flyers are like, oh, it’s bedtime. And so it, it probably does, uh, change a little bit based on frequency of flight."
   ]
  ],
  "questions": [
   {
    "q": "What does the man say about snoring in space?",
    "opts": [
     "It is one of the most common complaints among crew members.",
     "It does not occur because gravity no longer pulls the tongue back.",
     "It is reduced by the special lighting on the station.",
     "It only happens during an astronaut's first few nights."
    ],
    "a": 1,
    "exp": "原文 \"you don't snore in space. Uh, your, your tongue does not fall back in the back of your throat due to gravity\"，does not occur 同义替换 don't snore。A 与 \"we don't have any complaint\" 相反；C 张冠李戴，灯光是用来调节作息的；D 无中生有。"
   },
   {
    "q": "Why does the station use lighting that contains some blue light?",
    "opts": [
     "To help astronauts keep a regular sleep-wake rhythm.",
     "To warn astronauts of fire or smoke at night.",
     "To reduce the power used during long missions.",
     "To limit astronauts' sleep to about six hours."
    ],
    "a": 0,
    "exp": "原文 \"you have 17 sunrises and sunsets, so it, it's difficult to get into a circadian rhythm\"，灯光 \"give them some feeling of daylight ... so that they can sleep\"，keep a regular sleep-wake rhythm 对应 get into a circadian rhythm。B 张冠李戴到睡眠舱的警报设计；D 偷换，six hours 是说有人在地面就只睡六小时；C 无中生有。"
   },
   {
    "q": "Why are the sleeping quarters designed so that astronauts can still hear?",
    "opts": [
     "So that they can chat with crew members before sleeping.",
     "So that they can listen to music to help them relax.",
     "So that they can receive the next day's schedule.",
     "So that they can respond to warnings like fire alarms."
    ],
    "a": 3,
    "exp": "原文 \"we want them to be able hear any cautions for alarms or ... if there's a fire alarm or smoke alarm\"，warnings 同义替换 cautions and warnings。A、B、C 均无中生有，C 借用了前文 timeline 的影子。"
   },
   {
    "q": "According to the man, what affects how quickly astronauts adapt to sleeping in orbit?",
    "opts": [
     "Their age and physical fitness.",
     "The size of their sleeping bags.",
     "How many times they have flown before.",
     "How long they usually sleep on Earth."
    ],
    "a": 2,
    "exp": "原文 \"that also aligns with how often you have flown\"，并对比首飞者紧张、\"repeat flyers are like, oh, it's bedtime\"，how many times they have flown 同义替换 frequency of flight。D 偷换前文六小时睡眠的例子；B 借用 sleeping bag 的影子；A 无中生有。"
   }
  ]
 },
 {
  "id": "real35",
  "title": "Why UV Light Is Replacing Water Filters",
  "episode": "Deep Space Hydration",
  "org": "NASA",
  "show": "NASA · Houston We Have a Podcast",
  "type": "conv",
  "date": "16 Jun 2023",
  "src": "assets/audio/real35.m4a",
  "dur": 204.0,
  "url": "https://www.nasa.gov/podcasts/houston-we-have-a-podcast/ep-293-deep-space-hydration/",
  "words": 627,
  "script": "Host: Let’s go back to UVs for a second…\nMicah Johnson: Yeah. Yeah.\nHost: because definitely it’s related to the filters, right? So just, it sounded like the legacy had multiple filters to get rid of that…\nMicah Johnson: Yeah. So for microbial control, specifically, once you removed the iodine, so once you removed the iodine, you no longer had this biocide in your water. So the 0.2 micron filter that was in the PWD design was downstream of this iodine filter. So you remove the iodine, now water’s flowing through un-iodinated, so stuff could grow. So then you have this 0.2 micron filter that was supposed to, you know, remove, you know, if there was anything to potentially grow in between this would remove it on its way out.\nHost: One for, one for the iodine, and one for the nasties.\nKate Toon: Right?\nMicah Johnson: Yes.\nHost: OK.\nKate Toon: Now, whereas UV, right, isn’t a filter anymore.\nMicah Johnson: Yeah.\nKate Toon: It’s, you know, it’s the sterilization of water via the, the UV lights…\nHost: OK.\nKate Toon: that are hitting, you know, the surface area of the water. And, you know, legacy PWD, the 0.2-micron filter did do well.\nMicah Johnson: Yeah. It works…\nKate Toon: You know, once we had the constant flow, the 0.2 filter did its job and we actually used that kind of 0.2 filter…\nMicah Johnson: It’s used all-over.\nKate Toon: all-over station. It’s not just in the, the potable water dispenser. So, very common so to speak, item on station, but trying to move away from that with the UV lights.\nMicah Johnson: Yeah. So because what we’re gaining from this in terms of exploration is, you know, now you’re talking really long-duration type activities. So this has a shelf life. So if you’re talking six months, a year shelf life, that’s not, it’s not going to make it for something where your mission is two years.\nHost: Yeah.\nMicah Johnson: And so, or three years or whatever. And so, the benefit of the UV reactor is, is it is based on the life of the bulb. I mean, there’s a couple factors that go into it, but one of the main things in terms of its life — what limits its life is the fact of it has this LED and as you know, you know, here in for terrestrial applications, LEDs last pretty long. So…\nHost: Yeah.\nMicah Johnson: this thing has upwards to eight-to-ten-thousand hours of operation. And because we only turn it on when we’re using it and every so often we turn it on, you know, you’re not using it constantly. So I mean ours, you know, through our usage assumptions and things like that, this, it should last eight to ten years. And so, I mean, I don’t have to replace a 0.2 micron every year now.\nHost: Yeah.\nMicah Johnson: So…\nHost: Just a little bit more power.\nMicah Johnson: Yeah.\nHost: And now you can reduce your filtering usage by half or something.\nMicah Johnson: Yeah.\nKate Toon: And, and further, you know, what we’ve found through utilizing this technology is that, you know, we, the UV light, like on terrestrial, you know, uses and how these bulbs work, it’s actually an ever-growing market. It’s only improving exponentially almost for UV reactor lights as sterilization. So, you know, there’s even promise perhaps in the future if you can get down to a certain power level usage because you can’t just have these for sterilization everywhere. It would probably be too much power with the technology…\nMicah Johnson: Yeah.\nKate Toon: as it is today. But the market is growing. And so, you know, proving out this technology now just at the fundamental level for other applications on larger scale could be hugely beneficial and kind of a paradigm shift for sterilization on, for water systems in general. So it’s, it’s the beginning to something of this technology usage that I think has a lot of spaceflight applications in the future.",
  "segs": [
   [
    0.0,
    1.3,
    "Host",
    "Let’s go back to UVs for a second…"
   ],
   [
    1.3,
    2.8,
    "Micah Johnson",
    "Yeah. Yeah."
   ],
   [
    2.8,
    8.6,
    "Host",
    "because definitely it’s related to the filters, right? So just, it sounded like the legacy had multiple filters to get rid of that…"
   ],
   [
    8.6,
    43.4,
    "Micah Johnson",
    "Yeah. So for microbial control, specifically, once you removed the iodine, so once you removed the iodine, you no longer had this biocide in your water. So the 0.2 micron filter that was in the PWD design was downstream of this iodine filter. So you remove the iodine, now water’s flowing through un-iodinated, so stuff could grow. So then you have this 0.2 micron filter that was supposed to, you know, remove, you know, if there was anything to potentially grow in between this would remove it on its way out."
   ],
   [
    43.4,
    44.9,
    "Host",
    "One for, one for the iodine, and one for the nasties."
   ],
   [
    44.9,
    45.7,
    "Kate Toon",
    "Right?"
   ],
   [
    45.7,
    46.0,
    "Micah Johnson",
    "Yes."
   ],
   [
    46.0,
    46.4,
    "Host",
    "OK."
   ],
   [
    46.4,
    47.8,
    "Kate Toon",
    "Now, whereas UV, right, isn’t a filter anymore."
   ],
   [
    47.8,
    49.2,
    "Micah Johnson",
    "Yeah."
   ],
   [
    49.2,
    51.6,
    "Kate Toon",
    "It’s, you know, it’s the sterilization of water via the, the UV lights…"
   ],
   [
    51.6,
    54.0,
    "Host",
    "OK."
   ],
   [
    54.0,
    58.4,
    "Kate Toon",
    "that are hitting, you know, the surface area of the water. And, you know, legacy PWD, the 0.2-micron filter did do well."
   ],
   [
    58.4,
    62.7,
    "Micah Johnson",
    "Yeah. It works…"
   ],
   [
    62.7,
    66.7,
    "Kate Toon",
    "You know, once we had the constant flow, the 0.2 filter did its job and we actually used that kind of 0.2 filter…"
   ],
   [
    66.7,
    70.6,
    "Micah Johnson",
    "It’s used all-over."
   ],
   [
    70.6,
    81.6,
    "Kate Toon",
    "all-over station. It’s not just in the, the potable water dispenser. So, very common so to speak, item on station, but trying to move away from that with the UV lights."
   ],
   [
    81.6,
    90.4,
    "Micah Johnson",
    "Yeah. So because what we’re gaining from this in terms of exploration is, you know, now you’re talking really long-duration type activities. So this has a shelf life. So if you’re talking six months, a year shelf life, that’s not, it’s not going to make it for something where your mission is two years."
   ],
   [
    90.4,
    99.2,
    "Host",
    "Yeah."
   ],
   [
    99.2,
    110.2,
    "Micah Johnson",
    "And so, or three years or whatever. And so, the benefit of the UV reactor is, is it is based on the life of the bulb. I mean, there’s a couple factors that go into it, but one of the main things in terms of its life — what limits its life is the fact of it has this LED and as you know, you know, here in for terrestrial applications, LEDs last pretty long. So…"
   ],
   [
    110.2,
    121.3,
    "Host",
    "Yeah."
   ],
   [
    121.3,
    133.9,
    "Micah Johnson",
    "this thing has upwards to eight-to-ten-thousand hours of operation. And because we only turn it on when we’re using it and every so often we turn it on, you know, you’re not using it constantly. So I mean ours, you know, through our usage assumptions and things like that, this, it should last eight to ten years. And so, I mean, I don’t have to replace a 0.2 micron every year now."
   ],
   [
    133.9,
    140.1,
    "Host",
    "Yeah."
   ],
   [
    140.1,
    146.4,
    "Micah Johnson",
    "So…"
   ],
   [
    146.4,
    147.1,
    "Host",
    "Just a little bit more power."
   ],
   [
    147.1,
    147.7,
    "Micah Johnson",
    "Yeah."
   ],
   [
    147.7,
    149.3,
    "Host",
    "And now you can reduce your filtering usage by half or something."
   ],
   [
    149.3,
    150.9,
    "Micah Johnson",
    "Yeah."
   ],
   [
    150.9,
    165.6,
    "Kate Toon",
    "And, and further, you know, what we’ve found through utilizing this technology is that, you know, we, the UV light, like on terrestrial, you know, uses and how these bulbs work, it’s actually an ever-growing market. It’s only improving exponentially almost for UV reactor lights as sterilization. So, you know, there’s even promise perhaps in the future if you can get down to a certain power level usage because you can’t just have these for sterilization everywhere. It would probably be too much power with the technology…"
   ],
   [
    165.6,
    180.2,
    "Micah Johnson",
    "Yeah."
   ],
   [
    180.2,
    204.0,
    "Kate Toon",
    "as it is today. But the market is growing. And so, you know, proving out this technology now just at the fundamental level for other applications on larger scale could be hugely beneficial and kind of a paradigm shift for sterilization on, for water systems in general. So it’s, it’s the beginning to something of this technology usage that I think has a lot of spaceflight applications in the future."
   ]
  ],
  "questions": [
   {
    "q": "What was the purpose of the 0.2-micron filter in the old water dispenser?",
    "opts": [
     "To catch microbes that might grow after the iodine was removed.",
     "To take the iodine out of the drinking water.",
     "To keep the water pressure in the system steady.",
     "To cool the water before the crew drank it."
    ],
    "a": 0,
    "exp": "原文 \"you remove the iodine, now water's flowing through un-iodinated, so stuff could grow. So then you have this 0.2 micron filter ... this would remove it on its way out\"，catch microbes 对应 remove anything that could grow。B 张冠李戴，去碘的是上游的 iodine filter；C、D 无中生有。"
   },
   {
    "q": "How is the UV system different from the old filter?",
    "opts": [
     "It removes iodine more completely than the filter.",
     "It needs to be replaced about every six months.",
     "It is already used all over the space station.",
     "It sterilizes water with light instead of trapping particles."
    ],
    "a": 3,
    "exp": "原文 \"UV, right, isn't a filter anymore. It's ... the sterilization of water via the, the UV lights\"，sterilizes water with light 同义替换。B 张冠李戴，六个月到一年的保质期说的是 0.2 微米滤芯；C 同样是说滤芯 \"used all-over station\"；A 无中生有。"
   },
   {
    "q": "Why is the filter unsuitable for long exploration missions?",
    "opts": [
     "It is too heavy to send into space.",
     "Its shelf life is shorter than such missions would last.",
     "It uses too much power to run continuously.",
     "It slows the flow of water through the dispenser."
    ],
    "a": 1,
    "exp": "原文 \"if you're talking six months, a year shelf life ... it's not going to make it for something where your mission is two years\"，shelf life shorter than the mission 是对 not going to make it 的改写。C 偷换，耗电问题是针对 UV 大规模推广说的；A、D 无中生有。"
   },
   {
    "q": "What is the woman's view of UV sterilization technology?",
    "opts": [
     "It is too expensive to be used widely on Earth.",
     "It will be fitted on every spacecraft within ten years.",
     "It could change water sterilization in general if power use drops.",
     "It is mainly useful for short missions near Earth."
    ],
    "a": 2,
    "exp": "原文 \"there's even promise perhaps in the future if you can get down to a certain power level usage\" 和 \"could be hugely beneficial and kind of a paradigm shift for sterilization ... for water systems in general\"，change water sterilization in general 同义替换 paradigm shift。A 偷换，她说的障碍是耗电而非价格，且市场在增长；B 借用 \"eight to ten years\" 寿命的影子；D 与其服务长期探索任务相反。"
   }
  ]
 },
 {
  "id": "real36",
  "title": "Why Portable Ultrasound Appeals to Doctors",
  "episode": "Ultrasounds Anywhere",
  "org": "NASA",
  "show": "NASA · Houston We Have a Podcast",
  "type": "conv",
  "date": "17 Jun 2022",
  "src": "assets/audio/real36.m4a",
  "dur": 238.5,
  "url": "https://www.nasa.gov/podcasts/houston-we-have-a-podcast/ultrasounds-anywhere/",
  "words": 590,
  "script": "Host: Dan, this, this level of access and level of user-friendliness seems to be a huge component to this, to this incredible technology. And, and Scott described pitching this to other surgeons who reacted with, you know, a surprise and then amazement and, in its applicabilities. I wonder if you’ve received the same level of excitement when, when reaching out to others that have helped it to what it seems like continue to grow?\nDaniel Siegal: Absolutely. We have wonderful colleagues in our surgery department, in our emergency medicine department, in our internal medicine department. It’s really gotten to the point where people recognize that a portable ultrasound has all of the power of a stethoscope in that it gives you the ability to not only listen but also look and see what’s going on in real time inside the body. So I wouldn’t be surprised if in five years or so, or possibly even sooner, we see most physicians starting out in medical school not having a stethoscope around their neck but having one of these portable ultrasound devices. And it even translates to what happens with patients. When I’m in a room scanning a patient and they see the actual images coming up on the screen in real time, documenting whatever their problem might be, they become more engaged as well. And so, it just goes to show that the power of seeing a picture right in front of you in real time is so much more valuable than anything we’ve really ever had before.\nHost: Scott, I want to circle back on the surgeons. How you, you, you mentioned their level of excitement. I wonder from your perspective as a surgeon, a very experienced surgeon, what, what you find most useful and fascinating about this technology and about this access that’s getting you and many other surgeons in particular that, that, that particular focus of medicine, on board with, with this capability?\nScott Dulchavsky: Yeah. Surgeons are pretty impatient individuals and, in that we like immediacy of action; often we’re forced into that — in a trauma scenario, minutes, minutes, count in that, and having to wait for a diagnostic examination can be life-threatening in that. So I think I really appreciate the immediacy of information that it provides. Dan mentioned, but it deserves additional emphasis, that rather than a, it’s not a polaroid of what’s going on, it’s a movie camera. And so certain things you can only pick up when you can pick up motion in that: the way we diagnose a collapsed lung is watching the motion of the lung, and that can be lost sometimes in a singular chest x-ray or things like that. And then finally, I think having a tool that is, has such broad applicability in that you don’t have to have a hammer for this one and a nail driver for that thing and then the screwdriver for this, in that you have a single machine that you change some settings on and you can use it to look — is your bone broken, or do you have an infection in your, in a cavity in that, are you pregnant, do you have appendicitis in that, all with the same darn device. And that, that, oh, by the way, cost less than a couple thousand dollars now from $250,000 when we first started this and that. So I really appreciate that this technology, it can, is really at the forefront of how to be almost, you know, seeing into the human body in real time.",
  "segs": [
   [
    0.0,
    30.5,
    "Host",
    "Dan, this, this level of access and level of user-friendliness seems to be a huge component to this, to this incredible technology. And, and Scott described pitching this to other surgeons who reacted with, you know, a surprise and then amazement and, in its applicabilities. I wonder if you’ve received the same level of excitement when, when reaching out to others that have helped it to what it seems like continue to grow?"
   ],
   [
    30.5,
    109.2,
    "Daniel Siegal",
    "Absolutely. We have wonderful colleagues in our surgery department, in our emergency medicine department, in our internal medicine department. It’s really gotten to the point where people recognize that a portable ultrasound has all of the power of a stethoscope in that it gives you the ability to not only listen but also look and see what’s going on in real time inside the body. So I wouldn’t be surprised if in five years or so, or possibly even sooner, we see most physicians starting out in medical school not having a stethoscope around their neck but having one of these portable ultrasound devices. And it even translates to what happens with patients. When I’m in a room scanning a patient and they see the actual images coming up on the screen in real time, documenting whatever their problem might be, they become more engaged as well. And so, it just goes to show that the power of seeing a picture right in front of you in real time is so much more valuable than anything we’ve really ever had before."
   ],
   [
    109.2,
    136.0,
    "Host",
    "Scott, I want to circle back on the surgeons. How you, you, you mentioned their level of excitement. I wonder from your perspective as a surgeon, a very experienced surgeon, what, what you find most useful and fascinating about this technology and about this access that’s getting you and many other surgeons in particular that, that, that particular focus of medicine, on board with, with this capability?"
   ],
   [
    136.0,
    238.5,
    "Scott Dulchavsky",
    "Yeah. Surgeons are pretty impatient individuals and, in that we like immediacy of action; often we’re forced into that — in a trauma scenario, minutes, minutes, count in that, and having to wait for a diagnostic examination can be life-threatening in that. So I think I really appreciate the immediacy of information that it provides. Dan mentioned, but it deserves additional emphasis, that rather than a, it’s not a polaroid of what’s going on, it’s a movie camera. And so certain things you can only pick up when you can pick up motion in that: the way we diagnose a collapsed lung is watching the motion of the lung, and that can be lost sometimes in a singular chest x-ray or things like that. And then finally, I think having a tool that is, has such broad applicability in that you don’t have to have a hammer for this one and a nail driver for that thing and then the screwdriver for this, in that you have a single machine that you change some settings on and you can use it to look — is your bone broken, or do you have an infection in your, in a cavity in that, are you pregnant, do you have appendicitis in that, all with the same darn device. And that, that, oh, by the way, cost less than a couple thousand dollars now from $250,000 when we first started this and that. So I really appreciate that this technology, it can, is really at the forefront of how to be almost, you know, seeing into the human body in real time."
   ]
  ],
  "questions": [
   {
    "q": "What does Dan predict about medical students in the future?",
    "opts": [
     "They will rely less on stethoscopes than on X-ray machines.",
     "They may carry portable ultrasound devices instead of stethoscopes.",
     "They will need five years of training to perform ultrasounds.",
     "They will learn to look inside the body before learning to listen."
    ],
    "a": 1,
    "exp": "原文 \"we see most physicians starting out in medical school not having a stethoscope around their neck but having one of these portable ultrasound devices\"，carry ... instead of stethoscopes 同义替换 not having a stethoscope ... but having。\"five years\" 是预测实现的时间，不是培训时长，C 偷换概念；A 的 X-ray 原文没有提到，无中生有；D 原文只说超声既能 listen 又能 look，没说学习顺序。"
   },
   {
    "q": "According to Dan, how do patients react when they see the images on the screen in real time?",
    "opts": [
     "They feel anxious about what the images might reveal.",
     "They ask the doctor to explain every image in detail.",
     "They become more involved in their own care.",
     "They trust portable devices more than large machines."
    ],
    "a": 2,
    "exp": "原文 \"they become more engaged as well\"，more involved 同义替换 more engaged。原文强调实时看到画面\"so much more valuable\"，并没有提到病人焦虑、要求逐一解释或比较设备大小，A、B、D 均无中生有。"
   },
   {
    "q": "Why does Scott say surgeons particularly value this technology?",
    "opts": [
     "It allows them to avoid performing risky operations.",
     "It removes the need for a radiologist during surgery.",
     "It produces clearer still pictures than a chest X-ray.",
     "It gives them information at once when every minute counts."
    ],
    "a": 3,
    "exp": "原文 \"in a trauma scenario, minutes, minutes, count ... I really appreciate the immediacy of information that it provides\"，at once 对应 immediacy，when every minute counts 对应 minutes count。C 偷换概念：原文说超声\"not a polaroid ... it's a movie camera\"，强调动态而非静态图更清晰；A、B 原文未提及。"
   },
   {
    "q": "What point does Scott make by mentioning a hammer, a nail driver and a screwdriver?",
    "opts": [
     "One machine with adjusted settings can check for many conditions.",
     "Surgeons need a different device for each kind of injury.",
     "Ultrasound works best when combined with other tools.",
     "The device is as easy to operate as common household tools."
    ],
    "a": 0,
    "exp": "原文 \"you have a single machine that you change some settings on and you can use it to look — is your bone broken ... infection ... pregnant ... appendicitis\"，one machine with adjusted settings 对应 single machine that you change some settings on。B 恰是原文用工具比喻所否定的情况；D 偷换：比喻说的是用途广，而不是操作简单；C 无中生有。"
   }
  ]
 },
 {
  "id": "real37",
  "title": "How Space Food Has Improved on the Station",
  "episode": "Mars Ep. 6: Eat Like a Martian",
  "org": "NASA",
  "show": "NASA · Houston We Have a Podcast",
  "type": "conv",
  "date": "10 Feb 2023",
  "src": "assets/audio/real37.m4a",
  "dur": 264.4,
  "url": "https://www.nasa.gov/podcasts/houston-we-have-a-podcast/mars-ep-6-eat-like-a-martian/",
  "words": 681,
  "script": "Host: Grace, in your career, I’m wondering and curious about how you’ve seen food science progress, particularly on the International Space Station. I wonder if there has been lessons learned from the — you know, we’re coming up on 20 years of continuous human habitation and there is definitely some, some advances, I believe, that have occurred with life on the station and eating food on the station, a lot of things that we’ve learned — things that you’ve seen in your career that have progressed significantly to improve the way astronauts eat on station.\nGrace Douglas: Yeah, and I would say a lot of that is just providing more variety: getting the choice up there, getting the variety, and getting higher quality foods and healthier foods too, options with healthier processed foods. So, one of the, the big changes that was made with the space food system in the last ten years was a significant sodium reduction, and that was specifically done because sodium can exacerbate a lot of negative health impacts and it can exacerbate things like bone loss. And so, the sodium content in a processed food system tends to be higher than in a food system where you’re eating some fresh foods. And so one of the big, one of the big challenges was to reduce that sodium content, and they were able to do that by developing foods using different spices, using high-quality ingredients, and then also trying to provide a wide variety of food so that crew could find foods that they did like. One of the other things that we’ve seen in spaceflight is crew really enjoy having options with condiments. It is one of the things that they can customize, so providing condiments. Preference foods is very important to crew, which is a challenge as we move forward to missions that might have less preference food due to lack of resupply opportunities, and the potential that some food might be prepositioned even before a crew is selected. And so, there are, I would say that the biggest advance was probably providing a wide variety of foods in the lightweight flexible packaging so that it would meet resource requirements, shelf-life requirements, and also provide the crew just with a lot of options.\nHost: Very interesting. Now, for a Mars mission, how are you feeling based on the position we’re in now with the variety, with that standard menu that you were talking about? Do you think it needs to be expanded upon to satisfy a crew member that would be on a Mars mission for several years to make sure they do have enough variety? Do you think that we’re sitting pretty good now or do we need to have even more variety?\nGrace Douglas: So, and that’s definitely a challenge is figuring out what, how to set up a food system for a mission to Mars where you might not have this resupply. You know, when you have more variety, the challenge is you still only have the same mass and volume that you’re sending the food in. So right now a lot of the foods on the International Space Station are single servings, they’re, you know, they’re smaller servings so crew can choose a lot of different foods in a day. And when you’re sending food to the International Space Station, whether you send, if you send more variety then you’re sending less of each type of product. So if you send ten asparagus, then you might — versus five asparagus — if you only send five asparagus you might also be able to send five broccoli. And if you, you know, so you can kind of see in the same box you can either have a lot of something that somebody might like, or you can have a lot of variety. So once you start getting to a lot of variety, you might have two or three of a serving of one type of product. And so if you really like that product, then you might only see it once a week or once every two weeks.",
  "segs": [
   [
    0.0,
    40.4,
    "Host",
    "Grace, in your career, I’m wondering and curious about how you’ve seen food science progress, particularly on the International Space Station. I wonder if there has been lessons learned from the — you know, we’re coming up on 20 years of continuous human habitation and there is definitely some, some advances, I believe, that have occurred with life on the station and eating food on the station, a lot of things that we’ve learned — things that you’ve seen in your career that have progressed significantly to improve the way astronauts eat on station."
   ],
   [
    40.4,
    158.8,
    "Grace Douglas",
    "Yeah, and I would say a lot of that is just providing more variety: getting the choice up there, getting the variety, and getting higher quality foods and healthier foods too, options with healthier processed foods. So, one of the, the big changes that was made with the space food system in the last ten years was a significant sodium reduction, and that was specifically done because sodium can exacerbate a lot of negative health impacts and it can exacerbate things like bone loss. And so, the sodium content in a processed food system tends to be higher than in a food system where you’re eating some fresh foods. And so one of the big, one of the big challenges was to reduce that sodium content, and they were able to do that by developing foods using different spices, using high-quality ingredients, and then also trying to provide a wide variety of food so that crew could find foods that they did like. One of the other things that we’ve seen in spaceflight is crew really enjoy having options with condiments. It is one of the things that they can customize, so providing condiments. Preference foods is very important to crew, which is a challenge as we move forward to missions that might have less preference food due to lack of resupply opportunities, and the potential that some food might be prepositioned even before a crew is selected. And so, there are, I would say that the biggest advance was probably providing a wide variety of foods in the lightweight flexible packaging so that it would meet resource requirements, shelf-life requirements, and also provide the crew just with a lot of options."
   ],
   [
    158.8,
    188.9,
    "Host",
    "Very interesting. Now, for a Mars mission, how are you feeling based on the position we’re in now with the variety, with that standard menu that you were talking about? Do you think it needs to be expanded upon to satisfy a crew member that would be on a Mars mission for several years to make sure they do have enough variety? Do you think that we’re sitting pretty good now or do we need to have even more variety?"
   ],
   [
    188.9,
    264.4,
    "Grace Douglas",
    "So, and that’s definitely a challenge is figuring out what, how to set up a food system for a mission to Mars where you might not have this resupply. You know, when you have more variety, the challenge is you still only have the same mass and volume that you’re sending the food in. So right now a lot of the foods on the International Space Station are single servings, they’re, you know, they’re smaller servings so crew can choose a lot of different foods in a day. And when you’re sending food to the International Space Station, whether you send, if you send more variety then you’re sending less of each type of product. So if you send ten asparagus, then you might — versus five asparagus — if you only send five asparagus you might also be able to send five broccoli. And if you, you know, so you can kind of see in the same box you can either have a lot of something that somebody might like, or you can have a lot of variety. So once you start getting to a lot of variety, you might have two or three of a serving of one type of product. And so if you really like that product, then you might only see it once a week or once every two weeks."
   ]
  ],
  "questions": [
   {
    "q": "What major change does the woman say was made to the space food system in the last ten years?",
    "opts": [
     "Fresh foods were added to every crew member's menu.",
     "The amount of sodium in the foods was greatly cut.",
     "Single servings were replaced with larger portions.",
     "Processed foods were removed because of bone loss."
    ],
    "a": 1,
    "exp": "原文 \"one of the big changes that was made with the space food system in the last ten years was a significant sodium reduction\"，greatly cut 同义替换 significant reduction。D 张冠李戴：bone loss 是降钠的原因，并非撤掉加工食品；A 原文只是说含新鲜食物的体系钠更低，没说加了新鲜食物；C 与原文\"single servings\"仍在使用相反。"
   },
   {
    "q": "How did food scientists achieve that change?",
    "opts": [
     "By letting crew members add their own condiments.",
     "By switching to lightweight flexible packaging.",
     "By using different spices and high-quality ingredients.",
     "By sending fewer kinds of processed food."
    ],
    "a": 2,
    "exp": "原文 \"they were able to do that by developing foods using different spices, using high-quality ingredients\"，几乎同义复述。A 的 condiments 是船员喜欢的个性化选项，B 的 flexible packaging 是她说的最大进步，都不是降钠手段，属张冠李戴；D 与原文\"provide a wide variety of food\"相反。"
   },
   {
    "q": "What does the woman consider the biggest advance in space food?",
    "opts": [
     "Letting each crew member choose preference foods before launch.",
     "Placing food at the destination before a crew is selected.",
     "Reducing the total weight of food sent to the station.",
     "Offering a wide variety of foods in light, flexible packages."
    ],
    "a": 3,
    "exp": "原文 \"the biggest advance was probably providing a wide variety of foods in the lightweight flexible packaging\"，light, flexible packages 对应 lightweight flexible packaging。B 的 prepositioning 是未来任务面临的挑战；A 的 preference foods 她说很重要但会受限；C 只抓住\"resource requirements\"，以偏概全。"
   },
   {
    "q": "What does the woman illustrate with the example of asparagus and broccoli?",
    "opts": [
     "More variety means less of each food in the same mass and volume.",
     "Astronauts generally prefer vegetables to other kinds of food.",
     "Fresh vegetables cannot be kept long on a mission to Mars.",
     "Single servings waste much of the limited space in a box."
    ],
    "a": 0,
    "exp": "原文 \"you still only have the same mass and volume ... if you send more variety then you're sending less of each type of product\"，举芦笋和西兰花说明同一箱里要么某样多、要么品种多。B、C 原文未提及；D 偷换：原文说单份小包装是为了让船员每天有多种选择，并非浪费空间。"
   }
  ]
 },
 {
  "id": "real38",
  "title": "Why Voting from Space Matters to Astronauts",
  "episode": "Voting From Space",
  "org": "NASA",
  "show": "NASA · Houston We Have a Podcast",
  "type": "conv",
  "date": "01 Nov 2024",
  "src": "assets/audio/real38.m4a",
  "dur": 226.1,
  "url": "https://www.nasa.gov/podcasts/houston-we-have-a-podcast/voting-from-space/",
  "words": 640,
  "script": "Host: Karen, we were just talking, you know, and having some fun about voting stickers. A lot of astronauts see this as a prideful moment from what I’ve read, what I’ve seen. And even Butch and Suni themselves, we were just talking about them and they talked about how it was an honor to be a part of this process. And your conversation with them and talking about morale and especially the timeliness of them and others on station, what have those communications been like from, I guess, a motivational standpoint for them to be a, a beacon of this process and support this process, 250 miles plus above the Earth’s atmosphere?\nKaren Adkins: Yeah, I think it’s an important right and duty for every American. And I think, you know, very important to them. And so, you know, I know that they really appreciate all of the assistance and help being able to do the things. Those things that seem easy and here on the ground become a little bit more complicated. And when it’s, you have to, you know, do it through all these systems that are in place. But I know that they really appreciate all of the assistance by NASA and the organization to exercise their duty and a right to vote.\nMarta Durham: Dr. Linda Godwin was the person, the first person to help with that process, that secure process. And that was something that she commented on, similar to what Karen just said about how, for somebody who’s living on board the ISS, especially with the long missions we have these days, even doing the small things that we might think about that we can do here on Earth, being able to do those things, just brings another level of comfort of from home.\nKaren Adkins: Yes, exactly. Yeah. It’s just that to be, you know, it’s very important to feel connected to what’s going on here on Earth and be able to, you know, do what everybody else here is doing, which is it’s an important thing right now for everybody.\nMarta Durham: It’s not hard to imagine if we’re up there and we had a presidential election going on and you’re just not able to participate. It would not feel good.\nKaren Adkins: Right, exactly.\nHost: Well, I love that this is a major moment that can connect all of us, regardless of what our addresses that we put on our postcards. But Marta, you brought up a great point too, and we were talking about it before we started to do that. Not all astronauts are based or have their addresses listed as Texas, so you have to work with other states and their processes as well. How does that happen? I’d imagine when you approach them, if it’s an astronaut from a new state and it’s a new process, maybe they have a few questions to ask. Maybe they’re excited to be a part of something so unique. How does a non-Texas astronaut, in terms of address and process work out in a moment like this?\nMarta Durham: It’s usually a military astronaut, and they’re used to using the FPCA and voting from any place around the world. So it’s not that much unusual for them. It’s the clerks in those states that get really excited. They’re actually, the two that I’ve worked with in the past, out of state clerks, have been very gracious and accommodating, even though they don’t have a law like we do in Texas. But they’ve not had any problems, which I think reflects on how secure the system is that NASA has put in place to do this. They have confidence that our system is private and secure. And like I said, we’ve worked very well with them, but they do get excited about it. They’re really happy to be a part of that voting and space process.",
  "segs": [
   [
    0.0,
    36.8,
    "Host",
    "Karen, we were just talking, you know, and having some fun about voting stickers. A lot of astronauts see this as a prideful moment from what I’ve read, what I’ve seen. And even Butch and Suni themselves, we were just talking about them and they talked about how it was an honor to be a part of this process. And your conversation with them and talking about morale and especially the timeliness of them and others on station, what have those communications been like from, I guess, a motivational standpoint for them to be a, a beacon of this process and support this process, 250 miles plus above the Earth’s atmosphere?"
   ],
   [
    36.8,
    76.2,
    "Karen Adkins",
    "Yeah, I think it’s an important right and duty for every American. And I think, you know, very important to them. And so, you know, I know that they really appreciate all of the assistance and help being able to do the things. Those things that seem easy and here on the ground become a little bit more complicated. And when it’s, you have to, you know, do it through all these systems that are in place. But I know that they really appreciate all of the assistance by NASA and the organization to exercise their duty and a right to vote."
   ],
   [
    76.2,
    105.4,
    "Marta Durham",
    "Dr. Linda Godwin was the person, the first person to help with that process, that secure process. And that was something that she commented on, similar to what Karen just said about how, for somebody who’s living on board the ISS, especially with the long missions we have these days, even doing the small things that we might think about that we can do here on Earth, being able to do those things, just brings another level of comfort of from home."
   ],
   [
    105.4,
    124.5,
    "Karen Adkins",
    "Yes, exactly. Yeah. It’s just that to be, you know, it’s very important to feel connected to what’s going on here on Earth and be able to, you know, do what everybody else here is doing, which is it’s an important thing right now for everybody."
   ],
   [
    124.5,
    136.8,
    "Marta Durham",
    "It’s not hard to imagine if we’re up there and we had a presidential election going on and you’re just not able to participate. It would not feel good."
   ],
   [
    136.8,
    139.3,
    "Karen Adkins",
    "Right, exactly."
   ],
   [
    139.3,
    174.9,
    "Host",
    "Well, I love that this is a major moment that can connect all of us, regardless of what our addresses that we put on our postcards. But Marta, you brought up a great point too, and we were talking about it before we started to do that. Not all astronauts are based or have their addresses listed as Texas, so you have to work with other states and their processes as well. How does that happen? I’d imagine when you approach them, if it’s an astronaut from a new state and it’s a new process, maybe they have a few questions to ask. Maybe they’re excited to be a part of something so unique. How does a non-Texas astronaut, in terms of address and process work out in a moment like this?"
   ],
   [
    174.9,
    226.1,
    "Marta Durham",
    "It’s usually a military astronaut, and they’re used to using the FPCA and voting from any place around the world. So it’s not that much unusual for them. It’s the clerks in those states that get really excited. They’re actually, the two that I’ve worked with in the past, out of state clerks, have been very gracious and accommodating, even though they don’t have a law like we do in Texas. But they’ve not had any problems, which I think reflects on how secure the system is that NASA has put in place to do this. They have confidence that our system is private and secure. And like I said, we’ve worked very well with them, but they do get excited about it. They’re really happy to be a part of that voting and space process."
   ]
  ],
  "questions": [
   {
    "q": "According to Karen, how do astronauts feel about voting from space?",
    "opts": [
     "They find the process too complicated to be worthwhile.",
     "They regard it as a NASA tradition rather than a choice.",
     "They value it as a duty and appreciate the support they get.",
     "They would rather vote before launch than use the system."
    ],
    "a": 2,
    "exp": "原文 \"it's an important right and duty for every American ... they really appreciate all of the assistance by NASA\"，value it as a duty 对应 important right and duty，appreciate the support 对应 appreciate all of the assistance。A 偷换：原文只说地面上简单的事在太空\"a little bit more complicated\"，没说不值得；B、D 无中生有。"
   },
   {
    "q": "What did Linda Godwin say about astronauts on long missions, according to Marta?",
    "opts": [
     "Doing small everyday tasks from Earth gives them comfort.",
     "They should be excused from voting during long missions.",
     "They need more privacy when filling in secure forms.",
     "They miss their families more than anything else on Earth."
    ],
    "a": 0,
    "exp": "原文 \"even doing the small things that we might think about that we can do here on Earth ... just brings another level of comfort of from home\"，small everyday tasks 对应 small things，gives them comfort 对应 brings comfort from home。C 借用了原文 secure process 的影子，但 Godwin 的评论并非关于隐私；B、D 无中生有。"
   },
   {
    "q": "Why does Karen think it is important for astronauts to take part in elections?",
    "opts": [
     "It sets a good example for young voters on Earth.",
     "It helps them stay connected to what is going on at home.",
     "It proves that the station's communication links work.",
     "It lets NASA test new election technology in orbit."
    ],
    "a": 1,
    "exp": "原文 \"it's very important to feel connected to what's going on here on Earth and be able to do what everybody else here is doing\"，stay connected 同义替换 feel connected。Marta 随后补充，若无法参与总统选举\"It would not feel good\"，也印证这一点。A、C、D 原文均未提及。"
   },
   {
    "q": "What does Marta say about election clerks in states other than Texas?",
    "opts": [
     "They worry that military astronauts are unfamiliar with the forms.",
     "They require a special state law before accepting votes.",
     "They have had several problems with the voting process.",
     "They are excited and trust the security of NASA's system."
    ],
    "a": 3,
    "exp": "原文 \"It's the clerks in those states that get really excited ... They have confidence that our system is private and secure\"，trust the security 对应 have confidence that our system is ... secure。A 张冠李戴：原文说军人宇航员习惯用 FPCA；B 偷换：原文说那些州没有德州那样的法律也照样配合；C 与原文\"they've not had any problems\"相反。"
   }
  ]
 },
 {
  "id": "real39",
  "title": "Four Ways Space Station Research Benefits Humanity",
  "episode": "Our Orbiting Lab's Benefits for Humanity",
  "org": "NASA",
  "show": "NASA · Houston We Have a Podcast",
  "type": "conv",
  "date": "18 Oct 2024",
  "src": "assets/audio/real39.m4a",
  "dur": 268.6,
  "url": "https://www.nasa.gov/podcasts/houston-we-have-a-podcast/our-orbiting-labs-benefits-for-humanity/",
  "words": 734,
  "script": "Host: And so as we speak right now, I know the International Space Station is flying right over Hurricane Helene. And so we’re providing some commentary on that and meteorologists are tuned in to see a little bit of that from a different perspective. There are so many different benefits, so much to break down here. Can you go into some of the different areas? I know there’s four different areas of the benefits of humanity that we break it down into. Can you do that for us here? What are those four?\nMeghan Everett: Yes. So those four areas are scientific benefits, exploration benefits, societal benefits, and economic benefits.\nHost: Okay. So with scientific, exploration, societal, and economic, let’s go to our first one, which is benefits to science. Can you give a high-level explanation for that and then we’ll take a deeper dive with some examples?\nMeghan Everett: Sure. I’ll go through that one. And before I start on that, I want to highlight that while we break these down into four different categories, they aren’t kind of siloed in each one of those, right? And so they overlap and they integrate with each other and sometimes it’s hard to figure out which one goes in which category, but really we want to talk about how science on the space station benefits Earth. But I’ll start off with the science benefits. And so a lot of the science that we do on Earth is actually limited by gravity. And so we can improve our scientific discoveries and advancements if we move these things to a microgravity environment. And some of the things that we have in space is absence of buoyancy and sedimentation. We have an absence of convection. So that’s where if you think about if you boil something on your stove, hot things rise and your cooler things kind of move to the bottom of the pot. And in space we don’t have that, everything just stays in the same location. And then we have an absence of hydrostatic pressure. So everything kind of has equal pressure on it. And these are really important factors when we talk about biomanufacturing and material processing and some of the physical sciences in space. So when we remove gravity, it really gives biologists these unique insights to the stresses and responses to humans, plants, light forms, and physical sciences. We can really open up kind of a whole new opportunity of studying things such as boiling points, melting points, fluids mixing, gases mixing, all kinds of phenomena that we just can’t do on Earth.\nTranscript: The other area of science that we’ll definitely talk about in more detail later is some of the external pieces of hardware that we have on the space station where we talked about remote sensing and even things with Hurricane Helene and looking at the different weather predictions.\nHost: So high-level explanation for benefits to science. Now let’s move on to benefits for exploration.\nMeghan Everett: Okay. So as we said, right now, the space station is the only place that we have humans living and operating in space. And at NASA, we want to go to the Moon, and we want to go to other destinations. And in order to do this, we need to use the space station as a proving ground for developing hardware and seeing how humans respond to space. So a lot of these technology demonstrations, they do just that. We develop hardware for future exploration vehicles, and we help understand the human adaptations to longer durations in space.\nHost: So benefits to science exploration. How about benefits to society?\nMeghan Everett: Alright, so when we talk about benefits to society, we think about things such as monitoring climate change, and how we can do that to help humans in the long term. We also can talk about medical advances and how we can create technologies or even drug type therapies for better understanding and treating diseases for humans on Earth.\nHost: And last but not least, how about economy benefits?\nMeghan Everett: Alright. And so when we talk about benefits to the economy, generally, we’re really talking about kind of like nurturing that commercial space economy and how we can do commercial research. And some of the things that we’re doing on the space station right now include satellite services and even in-space manufacturing. And hopefully these will really start to stimulate the U.S. economy here on Earth.",
  "segs": [
   [
    0.0,
    24.7,
    "Host",
    "And so as we speak right now, I know the International Space Station is flying right over Hurricane Helene. And so we’re providing some commentary on that and meteorologists are tuned in to see a little bit of that from a different perspective. There are so many different benefits, so much to break down here. Can you go into some of the different areas? I know there’s four different areas of the benefits of humanity that we break it down into. Can you do that for us here? What are those four?"
   ],
   [
    24.7,
    35.2,
    "Meghan Everett",
    "Yes. So those four areas are scientific benefits, exploration benefits, societal benefits, and economic benefits."
   ],
   [
    35.2,
    47.0,
    "Host",
    "Okay. So with scientific, exploration, societal, and economic, let’s go to our first one, which is benefits to science. Can you give a high-level explanation for that and then we’ll take a deeper dive with some examples?"
   ],
   [
    47.0,
    151.0,
    "Meghan Everett",
    "Sure. I’ll go through that one. And before I start on that, I want to highlight that while we break these down into four different categories, they aren’t kind of siloed in each one of those, right? And so they overlap and they integrate with each other and sometimes it’s hard to figure out which one goes in which category, but really we want to talk about how science on the space station benefits Earth. But I’ll start off with the science benefits. And so a lot of the science that we do on Earth is actually limited by gravity. And so we can improve our scientific discoveries and advancements if we move these things to a microgravity environment. And some of the things that we have in space is absence of buoyancy and sedimentation. We have an absence of convection. So that’s where if you think about if you boil something on your stove, hot things rise and your cooler things kind of move to the bottom of the pot. And in space we don’t have that, everything just stays in the same location. And then we have an absence of hydrostatic pressure. So everything kind of has equal pressure on it. And these are really important factors when we talk about biomanufacturing and material processing and some of the physical sciences in space. So when we remove gravity, it really gives biologists these unique insights to the stresses and responses to humans, plants, light forms, and physical sciences. We can really open up kind of a whole new opportunity of studying things such as boiling points, melting points, fluids mixing, gases mixing, all kinds of phenomena that we just can’t do on Earth."
   ],
   [
    151.0,
    166.9,
    "Transcript",
    "The other area of science that we’ll definitely talk about in more detail later is some of the external pieces of hardware that we have on the space station where we talked about remote sensing and even things with Hurricane Helene and looking at the different weather predictions."
   ],
   [
    166.9,
    173.6,
    "Host",
    "So high-level explanation for benefits to science. Now let’s move on to benefits for exploration."
   ],
   [
    173.6,
    210.5,
    "Meghan Everett",
    "Okay. So as we said, right now, the space station is the only place that we have humans living and operating in space. And at NASA, we want to go to the Moon, and we want to go to other destinations. And in order to do this, we need to use the space station as a proving ground for developing hardware and seeing how humans respond to space. So a lot of these technology demonstrations, they do just that. We develop hardware for future exploration vehicles, and we help understand the human adaptations to longer durations in space."
   ],
   [
    210.5,
    215.1,
    "Host",
    "So benefits to science exploration. How about benefits to society?"
   ],
   [
    215.1,
    240.3,
    "Meghan Everett",
    "Alright, so when we talk about benefits to society, we think about things such as monitoring climate change, and how we can do that to help humans in the long term. We also can talk about medical advances and how we can create technologies or even drug type therapies for better understanding and treating diseases for humans on Earth."
   ],
   [
    240.3,
    244.4,
    "Host",
    "And last but not least, how about economy benefits?"
   ],
   [
    244.4,
    268.6,
    "Meghan Everett",
    "Alright. And so when we talk about benefits to the economy, generally, we’re really talking about kind of like nurturing that commercial space economy and how we can do commercial research. And some of the things that we’re doing on the space station right now include satellite services and even in-space manufacturing. And hopefully these will really start to stimulate the U.S. economy here on Earth."
   ]
  ],
  "questions": [
   {
    "q": "What does the woman emphasize about the four categories of benefits?",
    "opts": [
     "They are ranked by their importance to people on Earth.",
     "They often overlap and can be hard to separate clearly.",
     "They were created mainly to attract commercial users.",
     "They apply only to research done outside the station."
    ],
    "a": 1,
    "exp": "原文 \"they aren't kind of siloed ... they overlap and they integrate with each other and sometimes it's hard to figure out which one goes in which category\"，hard to separate clearly 对应 hard to figure out which one goes in which category。A 原文没有排序；C 以偏概全，商业只是其中一类；D 原文提到外部设备只是科学收益的一部分。"
   },
   {
    "q": "Why does the woman mention boiling something on a stove?",
    "opts": [
     "To show how astronauts cook their meals in orbit.",
     "To explain the danger of high temperatures in space.",
     "To illustrate convection, which is missing in microgravity.",
     "To compare boiling points measured on Earth and in space."
    ],
    "a": 2,
    "exp": "原文 \"We have an absence of convection. So that's where if you think about if you boil something on your stove, hot things rise ... And in space we don't have that\"，missing 同义替换 absence。D 借用了后文 studying boiling points 的影子，但举炉灶的例子是解释对流，偷换目的；A、B 无中生有。"
   },
   {
    "q": "According to the woman, how does the space station support exploration?",
    "opts": [
     "It serves as a launch site for missions to the Moon.",
     "It supplies the fuel needed for future exploration vehicles.",
     "It trains astronauts to monitor climate change from orbit.",
     "It is a place to test hardware and study human adaptation."
    ],
    "a": 3,
    "exp": "原文 \"we need to use the space station as a proving ground for developing hardware and seeing how humans respond to space\"，a place to test 对应 proving ground，study human adaptation 对应 understand the human adaptations。C 张冠李戴：监测气候变化属于社会收益；A 原文只说想去月球，未说空间站是发射场；B 无中生有。"
   },
   {
    "q": "What does the woman say about the economic benefits?",
    "opts": [
     "They come from building up a commercial space economy.",
     "They result mainly from selling weather forecast data.",
     "They depend on medical advances made on the station.",
     "They are limited to satellite services at present."
    ],
    "a": 0,
    "exp": "原文 \"we're really talking about kind of like nurturing that commercial space economy and how we can do commercial research\"，building up 同义替换 nurturing。B 借用 Hurricane Helene 天气预报的影子；C 是社会收益的内容，张冠李戴；D 以偏概全，原文还提到 in-space manufacturing。"
   }
  ]
 },
 {
  "id": "real40",
  "title": "From Lab Discovery to Faster Brain Medicines",
  "episode": "Improving Precision Neuroscience",
  "org": "NASA",
  "show": "NASA · Houston We Have a Podcast",
  "type": "conv",
  "date": "02 Jun 2023",
  "src": "assets/audio/real40.m4a",
  "dur": 192.8,
  "url": "https://www.nasa.gov/podcasts/houston-we-have-a-podcast/ep-291-improving-precision-neuroscience/",
  "words": 598,
  "script": "Host: And Shane, I want to do all of that, right? I definitely want to, I think what we’re going to talk about mainly is we’re going to lead up to talking about this experiment on, on board ISS, why microgravity is such an interesting place for this idea of modeling, right? But, but I do want to, to set some context. Let’s start there. Let’s start about, you know, like there, I think there’s different ways that you can approach modeling. You know, there’s probably different companies that you could have gone to, but you decided to be a co-founder of, of this company. Can you talk about the inspiration of kind of going off on your own and saying, “you know what, I think I, I think I want to start, I think I want to build something from the ground up.”\nShane Hagerty: You know, just to be very clear, this is a, a team effort. It was a group of people…\nHost: Sure.\nShane Hagerty: who shared this vision. You know, we’re standing on the shoulders of many people’s work, and it’s a, you know, at this time, at this time point, a whole operation, you know, built on initially discoveries from Boston Children’s Hospital and my Harvard Medical School where I joined, you know, back in 2017 to try to do something different to what I’d been doing before. And the, the motivation to, to spin out our discoveries from academia into this biotech was just a simple question of we’ve made these exciting discoveries, how quickly can we see if they’re going to help patients? And that’s the quickest way to do it through biotech rather than in an academic setting where you, you dig into details, you know, you’re, you, you move a little bit more slowly. Here, with the right people, with the right support, we want to make it therapeutic, and we want to test it in the patients, you know, in a very safe and effective way as quickly as possible. And that excited me, and that’s, you know, why we, we took that, that leap. But it was based on, you know, as I said, many, many years of work, primarily from my professor in Boston Children’s Hospital in Harvard Medical School, professor Zhigang He. You know, the company’s really founded around his discoveries. And, and right now, my job really is just to separate those from a pre-clinical, you know, breakthrough, scientific discovery into an actual medicine.\nHost: The — absolutely fascinating speed seems to be one of the important drivers here, and I think that’s really important, right? Is, is your, like, you know, you know, you, you mentioned speed as a primary driver. Really, what I think what you’re, the motivation here is you want to help people out. You want to develop drugs as quickly as possible. You, there, there are people that, that need these sorts of remedies and, and your, what you’re trying to do is get them, get them their help as fast as possible.\nShane Hagerty: That’s correct. And, you know, there’s a lot of room for improvement in medications for neurological disorder. It’s a very difficult area to develop drugs for. Hard to study the brain. It’s, it’s, it can be fairly inaccessible. You know, it’s not like you, you know, you can take a, a blood sample, for example. So it can, it can be complicated, but there’s a lot of exciting new developments, new models, things we’re working on. And I think in this century, we see huge progress in how we treat these disorders.",
  "segs": [
   [
    0.0,
    39.0,
    "Host",
    "And Shane, I want to do all of that, right? I definitely want to, I think what we’re going to talk about mainly is we’re going to lead up to talking about this experiment on, on board ISS, why microgravity is such an interesting place for this idea of modeling, right? But, but I do want to, to set some context. Let’s start there. Let’s start about, you know, like there, I think there’s different ways that you can approach modeling. You know, there’s probably different companies that you could have gone to, but you decided to be a co-founder of, of this company. Can you talk about the inspiration of kind of going off on your own and saying, “you know what, I think I, I think I want to start, I think I want to build something from the ground up.”"
   ],
   [
    39.0,
    41.5,
    "Shane Hagerty",
    "You know, just to be very clear, this is a, a team effort. It was a group of people…"
   ],
   [
    41.5,
    44.0,
    "Host",
    "Sure."
   ],
   [
    44.0,
    133.1,
    "Shane Hagerty",
    "who shared this vision. You know, we’re standing on the shoulders of many people’s work, and it’s a, you know, at this time, at this time point, a whole operation, you know, built on initially discoveries from Boston Children’s Hospital and my Harvard Medical School where I joined, you know, back in 2017 to try to do something different to what I’d been doing before. And the, the motivation to, to spin out our discoveries from academia into this biotech was just a simple question of we’ve made these exciting discoveries, how quickly can we see if they’re going to help patients? And that’s the quickest way to do it through biotech rather than in an academic setting where you, you dig into details, you know, you’re, you, you move a little bit more slowly. Here, with the right people, with the right support, we want to make it therapeutic, and we want to test it in the patients, you know, in a very safe and effective way as quickly as possible. And that excited me, and that’s, you know, why we, we took that, that leap. But it was based on, you know, as I said, many, many years of work, primarily from my professor in Boston Children’s Hospital in Harvard Medical School, professor Zhigang He. You know, the company’s really founded around his discoveries. And, and right now, my job really is just to separate those from a pre-clinical, you know, breakthrough, scientific discovery into an actual medicine."
   ],
   [
    133.1,
    160.4,
    "Host",
    "The — absolutely fascinating speed seems to be one of the important drivers here, and I think that’s really important, right? Is, is your, like, you know, you know, you, you mentioned speed as a primary driver. Really, what I think what you’re, the motivation here is you want to help people out. You want to develop drugs as quickly as possible. You, there, there are people that, that need these sorts of remedies and, and your, what you’re trying to do is get them, get them their help as fast as possible."
   ],
   [
    160.4,
    192.8,
    "Shane Hagerty",
    "That’s correct. And, you know, there’s a lot of room for improvement in medications for neurological disorder. It’s a very difficult area to develop drugs for. Hard to study the brain. It’s, it’s, it can be fairly inaccessible. You know, it’s not like you, you know, you can take a, a blood sample, for example. So it can, it can be complicated, but there’s a lot of exciting new developments, new models, things we’re working on. And I think in this century, we see huge progress in how we treat these disorders."
   ]
  ],
  "questions": [
   {
    "q": "What does the man stress when asked why he co-founded his company?",
    "opts": [
     "He wanted to work independently of his professor.",
     "It came from a group of people who shared one vision.",
     "He had always planned to leave academic research.",
     "It was built mainly on discoveries he made alone."
    ],
    "a": 1,
    "exp": "原文 \"this is a, a team effort. It was a group of people… who shared this vision\"，came from a group of people 对应 team effort / group of people。D 张冠李戴：原文说公司\"founded around his discoveries\"，指的是他的教授 Zhigang He；A、C 无中生有。"
   },
   {
    "q": "Why did the team move their discoveries from academia into a biotech company?",
    "opts": [
     "Universities refused to pay for testing on patients.",
     "Biotech companies pay closer attention to details.",
     "They hoped to study the brain without taking samples.",
     "It was the quickest way to learn if the work helps patients."
    ],
    "a": 3,
    "exp": "原文 \"how quickly can we see if they're going to help patients? And that's the quickest way to do it through biotech rather than in an academic setting\"，learn if the work helps patients 对应 see if they're going to help patients。B 正好说反：原文说学术环境才\"dig into details ... move a little bit more slowly\"；A、C 无中生有。"
   },
   {
    "q": "According to the man, why is it hard to develop drugs for neurological disorders?",
    "opts": [
     "The brain is difficult to reach and to study.",
     "Patients are unwilling to join clinical trials.",
     "Blood samples give misleading data about the brain.",
     "New research models cost too much for most firms."
    ],
    "a": 0,
    "exp": "原文 \"Hard to study the brain. It's ... fairly inaccessible. You know, it's not like you can take a blood sample\"，difficult to reach 同义替换 inaccessible。C 偷换：原文是说大脑不能像抽血那样取样，并非血样有误导；D 原文提到 new models 是积极进展，并非成本问题。"
   },
   {
    "q": "What is the man's attitude toward treating neurological disorders in this century?",
    "opts": [
     "Cautious, since current medicines rarely work at all.",
     "Doubtful, since the brain remains largely a mystery.",
     "Hopeful, since new developments may bring huge progress.",
     "Indifferent, since his job focuses on a single therapy."
    ],
    "a": 2,
    "exp": "原文 \"there's a lot of exciting new developments, new models ... in this century, we see huge progress in how we treat these disorders\"，hopeful 对应 exciting / huge progress。A 偷换：原文 \"a lot of room for improvement in medications\" 是说有改进空间，不是基本无效；B 虽有\"hard to study the brain\"的影子，但他的态度并不悲观。"
   }
  ]
 },
 {
  "id": "real41",
  "title": "Hard Work and Lifelong Learning in a Space Career",
  "episode": "Laser Communications",
  "org": "NASA",
  "show": "NASA · Houston We Have a Podcast",
  "type": "conv",
  "date": "09 Nov 2023",
  "src": "assets/audio/real41.m4a",
  "dur": 188.7,
  "url": "https://www.nasa.gov/podcasts/houston-we-have-a-podcast/laser-communications/",
  "words": 540,
  "script": "Host: Yeah. You know what I found interesting, Jason, is you talked about you didn’t do particularly well in school, but what you just mentioned there, each part of your background, of your career, was working on some very complicated stuff. I wonder did you push yourself a little harder to be able to understand some of these complicated things? Maybe driven by your fascination with Star Wars and wanting to enter into a world of space and just pushing yourself. But I mean, you’re talking about some complicated stuff. So how’d you navigate that?\nJason Mitchell: No pun intended, right?\nHost: You see what I did there.\nJason Mitchell: Yeah, there you go. It’s a good lead-in. It was always a challenge for me on the academic side to just sort of get up to speed. So you’re absolutely right. It was really mostly about hard work, right? Putting in the hard work to get that deeper understanding. Fortunately, that focus actually just kind of snowballed. And so it was a, you know, sort of a positive reinforcing habit that once I learned what I needed to do, right? Sometimes it’s about really understanding how you need to learn, just being able to apply that in new situations, and then focus really on getting down to the heart of what are the basics. Because most times, the basics are exactly that. They’re just basics. The rest of it is sort of the dressing that you need to accomplish that basic thing. And that’s where the complexities really get built up. But those are things that are, you know, just like building a Lego, right? You just got a bunch of simple blocks. You just have to put them together in the right shape that you want. And that’s the real complexity, not necessarily the basic fundamental things. Maybe you think about the basic math or fundamental physics of it.\nHost: You describe it so seeming seemingly simple, but I believe the way that you got there was exactly as you said, through the hard work. It was the dedication that got you to a point where you finally were able to understand it, grasp it, and you had to push yourself probably along the way to do a lot of these complicated things. I mean, you talked about working with pulsars. That’s an interesting solution to solving navigation problems. How do you find your way through the sky and just finding unique solutions and diving deep into a subject to better understand it? You’ve got to kind of go along with the flow there.\nJason Mitchell: Yeah. And it’s fun. I mean, I think that underscores the whole point. But at least for me, it’s not everybody’s thing, but sort of that increased lifelong learning is sort of one of the things that drives me. I’m very much interested in doing unique things and in particular, things that enable us as humans to do and learn more, right? I mean, I didn’t fall into the science side for the most part. That was not something that resonated with me. But doing the kinds of things that I was interested in helped me enable other things. And so being able to play that role was very satisfying for me.",
  "segs": [
   [
    0.0,
    34.6,
    "Host",
    "Yeah. You know what I found interesting, Jason, is you talked about you didn’t do particularly well in school, but what you just mentioned there, each part of your background, of your career, was working on some very complicated stuff. I wonder did you push yourself a little harder to be able to understand some of these complicated things? Maybe driven by your fascination with Star Wars and wanting to enter into a world of space and just pushing yourself. But I mean, you’re talking about some complicated stuff. So how’d you navigate that?"
   ],
   [
    34.6,
    36.7,
    "Jason Mitchell",
    "No pun intended, right?"
   ],
   [
    36.7,
    38.6,
    "Host",
    "You see what I did there."
   ],
   [
    38.6,
    107.7,
    "Jason Mitchell",
    "Yeah, there you go. It’s a good lead-in. It was always a challenge for me on the academic side to just sort of get up to speed. So you’re absolutely right. It was really mostly about hard work, right? Putting in the hard work to get that deeper understanding. Fortunately, that focus actually just kind of snowballed. And so it was a, you know, sort of a positive reinforcing habit that once I learned what I needed to do, right? Sometimes it’s about really understanding how you need to learn, just being able to apply that in new situations, and then focus really on getting down to the heart of what are the basics. Because most times, the basics are exactly that. They’re just basics. The rest of it is sort of the dressing that you need to accomplish that basic thing. And that’s where the complexities really get built up. But those are things that are, you know, just like building a Lego, right? You just got a bunch of simple blocks. You just have to put them together in the right shape that you want. And that’s the real complexity, not necessarily the basic fundamental things. Maybe you think about the basic math or fundamental physics of it."
   ],
   [
    107.7,
    146.1,
    "Host",
    "You describe it so seeming seemingly simple, but I believe the way that you got there was exactly as you said, through the hard work. It was the dedication that got you to a point where you finally were able to understand it, grasp it, and you had to push yourself probably along the way to do a lot of these complicated things. I mean, you talked about working with pulsars. That’s an interesting solution to solving navigation problems. How do you find your way through the sky and just finding unique solutions and diving deep into a subject to better understand it? You’ve got to kind of go along with the flow there."
   ],
   [
    146.1,
    188.7,
    "Jason Mitchell",
    "Yeah. And it’s fun. I mean, I think that underscores the whole point. But at least for me, it’s not everybody’s thing, but sort of that increased lifelong learning is sort of one of the things that drives me. I’m very much interested in doing unique things and in particular, things that enable us as humans to do and learn more, right? I mean, I didn’t fall into the science side for the most part. That was not something that resonated with me. But doing the kinds of things that I was interested in helped me enable other things. And so being able to play that role was very satisfying for me."
   ]
  ],
  "questions": [
   {
    "q": "What does the host find interesting about the man?",
    "opts": [
     "He became interested in space only after joining NASA.",
     "He worked on very complex projects despite a weak school record.",
     "He chose his career path entirely by random chance.",
     "He did well in physics and math from an early age."
    ],
    "a": 1,
    "exp": "原文 \"you didn't do particularly well in school, but ... each part of your background, of your career, was working on some very complicated stuff\"，weak school record 对应 didn't do particularly well in school，very complex projects 对应 very complicated stuff。C 偷换：说话人说并非完全 random walk；A、D 与原文（小时候受 Star Wars 吸引、学业吃力）相反。"
   },
   {
    "q": "According to the man, how did he overcome his academic difficulties?",
    "opts": [
     "By choosing subjects that came naturally to him.",
     "By studying with more experienced colleagues.",
     "By memorizing complicated details one by one.",
     "By working hard until the effort became a self-reinforcing habit."
    ],
    "a": 3,
    "exp": "原文 \"It was really mostly about hard work ... that focus actually just kind of snowballed ... a positive reinforcing habit\"，self-reinforcing habit 同义替换 positive reinforcing habit。C 与原文相反，他强调抓住 basics 而不是死记复杂细节；A、B 原文未提，无中生有。"
   },
   {
    "q": "Why does the man mention building with Lego?",
    "opts": [
     "To show that complexity comes from combining simple basics correctly.",
     "To explain why the fundamental physics was hard for him.",
     "To describe a hobby that sparked his interest in engineering.",
     "To compare space navigation to assembling a toy."
    ],
    "a": 0,
    "exp": "原文 \"You just got a bunch of simple blocks. You just have to put them together in the right shape ... that's the real complexity, not necessarily the basic fundamental things\"，combining simple basics correctly 对应 put simple blocks together in the right shape。B 相反，他说基础本身并不复杂；C 把比喻说成真实爱好，无中生有；D 张冠李戴，乐高比喻针对学习方法而非导航。"
   },
   {
    "q": "What does the man say motivates him in his work?",
    "opts": [
     "A strong passion for pure scientific research.",
     "The chance to prove his teachers wrong.",
     "Lifelong learning and enabling people to do and learn more.",
     "The challenge of solving navigation problems with pulsars."
    ],
    "a": 2,
    "exp": "原文 \"increased lifelong learning is sort of one of the things that drives me ... things that enable us as humans to do and learn more\"，motivates 对应 drives me。A 与原文 \"I didn't fall into the science side ... That was not something that resonated with me\" 相反；D 是主持人提到的具体例子，以偏概全；B 无中生有。"
   }
  ]
 },
 {
  "id": "real43",
  "title": "Why Ocean Plastics Are Hard to Clean Up",
  "episode": "Ocean Garbage Patches",
  "org": "NOAA",
  "show": "NOAA Ocean Podcast",
  "type": "conv",
  "date": "",
  "src": "assets/audio/real43.m4a",
  "dur": 232.8,
  "url": "https://oceanservice.noaa.gov/podcast/mar18/nop14-ocean-garbage-patches.html",
  "words": 658,
  "script": "Troy Kitch: I would think that most of the plastics that ends up in the ocean are bigger pieces ... like bags and bottles and plastic toys. But you're saying that most of the plastic is so small that's it's hard or impossible to see. Can you talk a little more about the plastic debris in the ocean ... why it's so small?\nDianna Parker: There are many different kinds of plastics out in the ocean and they come from a number of different sources. So, there are teeny, tiny micro plastics out there that were either manufactured to be small — for example, the microbeads in face wash can be plastic; there are also little, tiny plastic pellets that we sometimes call ‘'nurdles' that are used to make larger items but then there are also tiny plastics that are shards of larger items. Plastics never really go away. They just break down over and over and over again until they become smaller and smaller from sunlight and other environmental factors [like] waves, big storms, those kind of things.\nTroy Kitch: So we have these vast regions in the ocean where the water column looks like a peppery soup because of all these small bits and pieces of plastic. I would imagine this plastic kind of looks like food. Do we know if fish and birds are eating this stuff?\nDianna Parker: We know that some species of birds and fish eat micro plastics. They even eat some larger plastics. So for example, the Laysan Albatross in the Northwestern Hawaiian Islands, we know that just about every dead albatross found on Midway Atoll has some form of plastic in its stomach. We don't know if that's what killed it, but we know that this is becoming a big problem. So we know that there are micro plastics in the ocean. We know that birds and fish and even some larger marine mammals eat these plastics. We know there are chemicals in the plastics and we know that the chemicals can absorb other toxic chemicals that are floating around in the ocean. So now the big question is, what are those plastics doing to the animals that eat them.\nTroy Kitch: I'm sure you get this question a lot: we know marine debris in the ocean is a bad thing ... so why don't we just clean it up? Especially if most of the trash is contained in 'garbage patch' areas because of the way the debris naturally accumulates because of ocean currents.\nDianna Parker: The words 'garbage patch' accurately describes what it is, because these are patches of ocean that contain our garbage. But they're not areas where you can easily go through and skim trash off the surface. First of all, because they are tiny micro plastics that aren't easily removable from the ocean. But also just because of the size of this area. We did some quick calculations that if you tried to clean up less than one percent of the North Pacific Ocean it would take 67 ships one year to clean up that portion. And the bottom line is that until we prevent debris from entering the ocean at the source, it's just going to keep congregating in these areas. We could go out and clean it all up and then still have the same problem on our hands as long as there's debris entering the ocean.\nTroy Kitch: And that's really the big problem — to prevent the debris from entering the ocean in the first place. So what can you, me, or anyone do to help?\nDianna Parker: There's so much that we can do to keep debris from entering the ocean. It's as simple as changing your individual behavior every day, creating less waste, reusing what you can, remembering to recycle ... littering is obviously a no-no. And then going out and joining a beach cleanup. It's difficult to really understand the problem until you get out there and see it first-hand, how bad the problem is.",
  "segs": [
   [
    0.0,
    16.7,
    "Troy Kitch",
    "I would think that most of the plastics that ends up in the ocean are bigger pieces ... like bags and bottles and plastic toys. But you're saying that most of the plastic is so small that's it's hard or impossible to see. Can you talk a little more about the plastic debris in the ocean ... why it's so small?"
   ],
   [
    16.7,
    60.1,
    "Dianna Parker",
    "There are many different kinds of plastics out in the ocean and they come from a number of different sources. So, there are teeny, tiny micro plastics out there that were either manufactured to be small — for example, the microbeads in face wash can be plastic; there are also little, tiny plastic pellets that we sometimes call ‘'nurdles' that are used to make larger items but then there are also tiny plastics that are shards of larger items. Plastics never really go away. They just break down over and over and over again until they become smaller and smaller from sunlight and other environmental factors [like] waves, big storms, those kind of things."
   ],
   [
    60.1,
    73.9,
    "Troy Kitch",
    "So we have these vast regions in the ocean where the water column looks like a peppery soup because of all these small bits and pieces of plastic. I would imagine this plastic kind of looks like food. Do we know if fish and birds are eating this stuff?"
   ],
   [
    73.9,
    130.8,
    "Dianna Parker",
    "We know that some species of birds and fish eat micro plastics. They even eat some larger plastics. So for example, the Laysan Albatross in the Northwestern Hawaiian Islands, we know that just about every dead albatross found on Midway Atoll has some form of plastic in its stomach. We don't know if that's what killed it, but we know that this is becoming a big problem. So we know that there are micro plastics in the ocean. We know that birds and fish and even some larger marine mammals eat these plastics. We know there are chemicals in the plastics and we know that the chemicals can absorb other toxic chemicals that are floating around in the ocean. So now the big question is, what are those plastics doing to the animals that eat them."
   ],
   [
    130.8,
    145.7,
    "Troy Kitch",
    "I'm sure you get this question a lot: we know marine debris in the ocean is a bad thing ... so why don't we just clean it up? Especially if most of the trash is contained in 'garbage patch' areas because of the way the debris naturally accumulates because of ocean currents."
   ],
   [
    145.7,
    198.5,
    "Dianna Parker",
    "The words 'garbage patch' accurately describes what it is, because these are patches of ocean that contain our garbage. But they're not areas where you can easily go through and skim trash off the surface. First of all, because they are tiny micro plastics that aren't easily removable from the ocean. But also just because of the size of this area. We did some quick calculations that if you tried to clean up less than one percent of the North Pacific Ocean it would take 67 ships one year to clean up that portion. And the bottom line is that until we prevent debris from entering the ocean at the source, it's just going to keep congregating in these areas. We could go out and clean it all up and then still have the same problem on our hands as long as there's debris entering the ocean."
   ],
   [
    198.5,
    206.6,
    "Troy Kitch",
    "And that's really the big problem — to prevent the debris from entering the ocean in the first place. So what can you, me, or anyone do to help?"
   ],
   [
    206.6,
    232.8,
    "Dianna Parker",
    "There's so much that we can do to keep debris from entering the ocean. It's as simple as changing your individual behavior every day, creating less waste, reusing what you can, remembering to recycle ... littering is obviously a no-no. And then going out and joining a beach cleanup. It's difficult to really understand the problem until you get out there and see it first-hand, how bad the problem is."
   ]
  ],
  "questions": [
   {
    "q": "What does the woman say about where tiny plastics in the ocean come from?",
    "opts": [
     "Most of them are lost fishing gear.",
     "They all come from beauty products like face wash.",
     "Some are made small on purpose and others are pieces of larger items.",
     "They are produced when seawater reacts with plastic bags."
    ],
    "a": 2,
    "exp": "原文 \"tiny micro plastics out there that were either manufactured to be small ... but then there are also tiny plastics that are shards of larger items\"，made small on purpose 同义替换 manufactured to be small，pieces of larger items 对应 shards of larger items。B 以偏概全，洗面奶微珠只是例子之一；A 张冠李戴，渔具是较大垃圾；D 无中生有。"
   },
   {
    "q": "Why do plastics in the ocean become smaller and smaller?",
    "opts": [
     "Sunlight, waves and storms break them down repeatedly.",
     "Fish and birds chew them into small pieces.",
     "Ocean currents dissolve them over time.",
     "They are designed to fall apart in water."
    ],
    "a": 0,
    "exp": "原文 \"They just break down over and over and over again until they become smaller and smaller from sunlight and other environmental factors [like] waves, big storms\"，repeatedly 对应 over and over again。C 偷换概念，原文说 plastics never really go away，并非溶解；B、D 原文未提。"
   },
   {
    "q": "What does the woman say about the dead albatrosses found on Midway Atoll?",
    "opts": [
     "Plastic in their stomachs was proven to have killed them.",
     "Only a few of them had swallowed any plastic.",
     "They mostly ate large plastic items rather than small ones.",
     "Nearly all contained plastic, though the cause of death is unclear."
    ],
    "a": 3,
    "exp": "原文 \"just about every dead albatross found on Midway Atoll has some form of plastic in its stomach. We don't know if that's what killed it\"，nearly all 同义替换 just about every，cause of death is unclear 对应 don't know if that's what killed it。A 与原文相反；B 与 just about every 相反；C 原文只说也会吃较大塑料，没有比较哪种更多。"
   },
   {
    "q": "What is the woman's view on cleaning up the garbage patches?",
    "opts": [
     "It could be done by 67 ships within a single year.",
     "It will not solve the problem unless debris is stopped at its source.",
     "It is easy because the trash floats on the surface.",
     "It is pointless, so individuals can do little to help."
    ],
    "a": 1,
    "exp": "原文 \"until we prevent debris from entering the ocean at the source, it's just going to keep congregating in these areas\"，stopped at its source 同义替换 prevent debris ... at the source。A 偷换概念，67 艘船一年只能清理不到 1% 的北太平洋；C 与原文 not areas where you can easily ... skim trash off the surface 相反；D 与她随后说的 There's so much that we can do 相反。"
   }
  ]
 },
 {
  "id": "real44",
  "title": "What Mussels Revealed About Microplastic Pollution",
  "episode": "The Microplastic-Mussel Connection: Part One",
  "org": "NOAA",
  "show": "NOAA Ocean Podcast",
  "type": "conv",
  "date": "",
  "src": "assets/audio/real44.m4a",
  "dur": 224.5,
  "url": "https://oceanservice.noaa.gov/podcast/sep20/nop39-microplastic-mussels-part-one.html",
  "words": 617,
  "script": "Host: Amy, I want to get back to the study now and ask for your perspective on why looking at microplastic concentrations in bivalves was a good fit for what you wanted to investigate.\nAmy Uhrin: For any organism to be considered a biomonitor, ideally the organism should be globally distributed, it should be abundant, and it should be known to respond to your contaminant of interest. And these were are all the case for the freshwater mussels in the Great Lakes. That’s why the Mussel Watch program uses them. But in addition, something that’s good about bivalves for biomonitoring is that they are sedentary so they don’t move, and they often form reef type structures. So there are a lot of them and they are easy to collect. Also, relative to their size, they filter a lot of water, and they often can retain the tiny particles that are found suspended in the water, which includes chemicals and microplastics. So they are effectively serving as a water sampling device. And then lastly, and I mentioned this before, a lot of these bivalves are important as a seafood resource. And for bivalves in particular, those that are eaten, we eat the whole animal. So there is the potential human health concerns and then the economic concerns because there is a lot of industry surrounding some of these bivalve species.\nHost: Could you talk a bit about what you knew going into this study, and what the Mussel Watch study confirmed?\nAmy Uhrin: A lot of the work with these particular invasive freshwater mussels had been done in the laboratory. So we knew that when these mussels were exposed to microplastics of a particular size and of a particular concentration in the lab, they did ingest them. But they hadn’t yet been documented as coming from mussels collected in the wild. So we did learn that, yes, these mussels do ingest microplastics in the wild. And we learned that microfibers were actually the most common type of microplastic that was ingested. And this is interesting because it’s consistent with previous studies of microplastics in the Milwaukee Harbor food web, and it also aligns with data that has been collected on other bivalve species that have been studied in this region and globally and have been analyzed for microplastics. And also the range of microplastics that we found in our bivalves are consistent with values that were published from other studies for both freshwater and saltwater species.\nHost: What were some of the other results of the microplastics study?\nAmy Uhrin: We were actually a little surprised by our results because they weren’t as clear as we thought they would be. So we expected that we would see more plastic in the bigger mussels, and we would see more plastic in these areas that were closer to some of these pollution sources. But we really had mixed results. What happened was, there was a lot of variation involved, and so the microplastic concentrations in the mussels varied a lot among the different size classes. So it wasn’t always the largest mussels that had the most microplastic. And there was a lot of variation in microplastic concentration across the different months that we sampled. Basically, there was so much variation because of that, that it was hard to really tease apart what was going on at a particular site in Milwaukee Bay, because so much variation was happening in other areas. So it was kind of difficult to definitively say, yes, there were more microplastics in mussels here versus there. And so that led us to conclude that, you know, possibly these freshwater invasive mussels might not serve as a good biomonitor for microplastic pollution in the Great Lakes.",
  "segs": [
   [
    0.0,
    10.6,
    "Host",
    "Amy, I want to get back to the study now and ask for your perspective on why looking at microplastic concentrations in bivalves was a good fit for what you wanted to investigate."
   ],
   [
    10.6,
    82.4,
    "Amy Uhrin",
    "For any organism to be considered a biomonitor, ideally the organism should be globally distributed, it should be abundant, and it should be known to respond to your contaminant of interest. And these were are all the case for the freshwater mussels in the Great Lakes. That’s why the Mussel Watch program uses them. But in addition, something that’s good about bivalves for biomonitoring is that they are sedentary so they don’t move, and they often form reef type structures. So there are a lot of them and they are easy to collect. Also, relative to their size, they filter a lot of water, and they often can retain the tiny particles that are found suspended in the water, which includes chemicals and microplastics. So they are effectively serving as a water sampling device. And then lastly, and I mentioned this before, a lot of these bivalves are important as a seafood resource. And for bivalves in particular, those that are eaten, we eat the whole animal. So there is the potential human health concerns and then the economic concerns because there is a lot of industry surrounding some of these bivalve species."
   ],
   [
    82.4,
    88.7,
    "Host",
    "Could you talk a bit about what you knew going into this study, and what the Mussel Watch study confirmed?"
   ],
   [
    88.7,
    149.5,
    "Amy Uhrin",
    "A lot of the work with these particular invasive freshwater mussels had been done in the laboratory. So we knew that when these mussels were exposed to microplastics of a particular size and of a particular concentration in the lab, they did ingest them. But they hadn’t yet been documented as coming from mussels collected in the wild. So we did learn that, yes, these mussels do ingest microplastics in the wild. And we learned that microfibers were actually the most common type of microplastic that was ingested. And this is interesting because it’s consistent with previous studies of microplastics in the Milwaukee Harbor food web, and it also aligns with data that has been collected on other bivalve species that have been studied in this region and globally and have been analyzed for microplastics. And also the range of microplastics that we found in our bivalves are consistent with values that were published from other studies for both freshwater and saltwater species."
   ],
   [
    149.5,
    153.4,
    "Host",
    "What were some of the other results of the microplastics study?"
   ],
   [
    153.4,
    224.5,
    "Amy Uhrin",
    "We were actually a little surprised by our results because they weren’t as clear as we thought they would be. So we expected that we would see more plastic in the bigger mussels, and we would see more plastic in these areas that were closer to some of these pollution sources. But we really had mixed results. What happened was, there was a lot of variation involved, and so the microplastic concentrations in the mussels varied a lot among the different size classes. So it wasn’t always the largest mussels that had the most microplastic. And there was a lot of variation in microplastic concentration across the different months that we sampled. Basically, there was so much variation because of that, that it was hard to really tease apart what was going on at a particular site in Milwaukee Bay, because so much variation was happening in other areas. So it was kind of difficult to definitively say, yes, there were more microplastics in mussels here versus there. And so that led us to conclude that, you know, possibly these freshwater invasive mussels might not serve as a good biomonitor for microplastic pollution in the Great Lakes."
   ]
  ],
  "questions": [
   {
    "q": "According to the woman, why are mussels useful for monitoring pollution?",
    "opts": [
     "They move widely, so they sample water across the lakes.",
     "They stay in one place, are plentiful and filter a lot of water.",
     "They break down microplastics and chemicals quickly.",
     "They are native to the Great Lakes and easy to identify."
    ],
    "a": 1,
    "exp": "原文 \"they are sedentary so they don't move ... there are a lot of them ... relative to their size, they filter a lot of water\"，stay in one place 同义替换 sedentary，plentiful 对应 there are a lot of them。A 与 don't move 相反；C 相反，原文说它们会 retain（留住）微粒；D 错，原文明确说这些是 invasive mussels（入侵物种）。"
   },
   {
    "q": "Why does the woman mention that people eat the whole animal?",
    "opts": [
     "To explain why bivalves are popular in restaurants.",
     "To argue that mussel harvesting should be banned.",
     "To show that mussels have little economic value.",
     "To point out the possible risks to human health."
    ],
    "a": 3,
    "exp": "原文 \"those that are eaten, we eat the whole animal. So there is the potential human health concerns\"，possible risks to human health 同义替换 potential human health concerns。C 与 a lot of industry surrounding ... bivalve species 相反；A、B 原文未提。"
   },
   {
    "q": "What did the study confirm about the mussels?",
    "opts": [
     "Wild mussels do take in microplastics, mostly microfibers.",
     "Mussels only take in microplastics under laboratory conditions.",
     "Microbeads were the most common plastic found in them.",
     "Their plastic levels were far higher than in other studies."
    ],
    "a": 0,
    "exp": "原文 \"yes, these mussels do ingest microplastics in the wild. And we learned that microfibers were actually the most common type\"，take in 同义替换 ingest。B 偷换概念，实验室结果是此前已知，这次证实的正是野外也会摄入；C 张冠李戴，最常见的是 microfibers；D 与 consistent with values ... from other studies 相反。"
   },
   {
    "q": "What is the woman's view of the study's other results?",
    "opts": [
     "They clearly showed that larger mussels hold more plastic.",
     "They proved that sites near pollution sources are worst.",
     "They were mixed, so the mussels may not be a reliable monitor.",
     "They confirmed that the mussels are an ideal biomonitor."
    ],
    "a": 2,
    "exp": "原文 \"we really had mixed results ... possibly these freshwater invasive mussels might not serve as a good biomonitor\"，not a reliable monitor 同义替换 might not serve as a good biomonitor。A、B 是研究者事先的预期，结果并未证实（it wasn't always the largest mussels）；D 与结论相反。"
   }
  ]
 },
 {
  "id": "real45",
  "title": "Where Harmful Algal Blooms Come From",
  "episode": "NOAA Ocean Podcast: Harmful Algal Blooms ( HABs)",
  "org": "NOAA",
  "show": "NOAA Ocean Podcast",
  "type": "conv",
  "date": "",
  "src": "assets/audio/real45.m4a",
  "dur": 216.3,
  "url": "https://oceanservice.noaa.gov/podcast/nov18/nop20-harmful-algal-blooms.html",
  "words": 620,
  "script": "Host: So are harmful algal blooms only found along the Gulf Coast or can they be found in other coasts as well?\nSteve Kibler: There are harmful algal blooms throughout the U.S. – throughout the world, really. They can occur in marine environments and also freshwater environments. We’re just talking about different species of algae that can be causing them. In Florida, Karenia brevis is a very common harmful algal bloom cause, and it also occurs across the rest of the Gulf and even into Mexico as well. In different parts of the U.S., for example New England states, the harmful algal bloom that occurs there is called Alexandrium catenella. It’s a similar type of organism, but different species and different toxins are involved. And there are also blooms on the west coast of the U.S., all the way up to Alaska, different blooms in Hawaii, and the inland states in lakes and reservoirs.\nHost: What is the actual cause of a harmful algal bloom – have you been able to determine what specifically is causing this?\nSteve Kibler: So, harmful algal blooms are a natural process. They’ve occurred long before humans lived in the U.S., for example. Some of the earliest history of European colonists recorded harmful algal bloom problems when they arrived in Florida, back in the 1500’s. However, humans can cause environmental changes that promote the development of harmful algal blooms, maybe making them worse. For example, a common trigger for freshwater HABs is nutrient runoff. In a small pond or reservoir, within a housing development – retention ponds are a common place to see freshwater harmful algal blooms happening. Sometimes they can be toxic, sometimes they just look gross…they discolor the water, smell funny, cause fish kills…but nutrient runoff is a very common one for freshwater environments. Not so much on the coast where it’s more of a natural progression of wind, weather, and ocean currents that often drive these.\nHost: So when you say “nutrient runoff”, can you explain that a little bit more?\nSteve Kibler: Sure. When I say “runoff” it means, simply, dissolved chemicals that are in the water on the land. This can be because of rainfall or because of farm irrigation, can be effluent from sewage treatment plants. All this material ends up in the water system and then eventually makes its way to the ocean, and coastal environments often times see high levels of nutrients just because of this runoff. This can contribute to harmful algal blooms.\nHost: We’re all connected, right? We always talk about how water [exists from] “rivers to the sea”, and that truly happens.\nSteve Kibler: That’s right!\nHost: You’ve said that this is a natural occurrence...is there any way to stop it from continuing, or to prevent it from occurring?\nSteve Kibler: There’s a little bit that can be done to prevent it – situations where runoff can be controlled can sometimes help prevent the development of harmful algal blooms, or make them so that they’re less severe. But in other instances, it’s a natural offshoot of human population growth, so it’s much more difficult to get a handle on. It’s hard to get millions of people to change the way that they live, and, in a sense, there’s probably no easy way to prevent harmful algal blooms from occurring in most instances. Like in the Gulf of Mexico, for instance, we’re talking about a large regional area where the cells can be distributed over thousands of square miles and there’s just simply no way to be able to remove these from the environment without harming the environment itself.\nHost: Yeah, so removing it may actually do more harm than good.\nSteve Kibler: Right – then you have the toxins to deal with as well, which may already be dissolved in the water.",
  "segs": [
   [
    0.0,
    5.8,
    "Host",
    "So are harmful algal blooms only found along the Gulf Coast or can they be found in other coasts as well?"
   ],
   [
    5.8,
    48.8,
    "Steve Kibler",
    "There are harmful algal blooms throughout the U.S. – throughout the world, really. They can occur in marine environments and also freshwater environments. We’re just talking about different species of algae that can be causing them. In Florida, Karenia brevis is a very common harmful algal bloom cause, and it also occurs across the rest of the Gulf and even into Mexico as well. In different parts of the U.S., for example New England states, the harmful algal bloom that occurs there is called Alexandrium catenella. It’s a similar type of organism, but different species and different toxins are involved. And there are also blooms on the west coast of the U.S., all the way up to Alaska, different blooms in Hawaii, and the inland states in lakes and reservoirs."
   ],
   [
    48.8,
    56.8,
    "Host",
    "What is the actual cause of a harmful algal bloom – have you been able to determine what specifically is causing this?"
   ],
   [
    56.8,
    114.2,
    "Steve Kibler",
    "So, harmful algal blooms are a natural process. They’ve occurred long before humans lived in the U.S., for example. Some of the earliest history of European colonists recorded harmful algal bloom problems when they arrived in Florida, back in the 1500’s. However, humans can cause environmental changes that promote the development of harmful algal blooms, maybe making them worse. For example, a common trigger for freshwater HABs is nutrient runoff. In a small pond or reservoir, within a housing development – retention ponds are a common place to see freshwater harmful algal blooms happening. Sometimes they can be toxic, sometimes they just look gross…they discolor the water, smell funny, cause fish kills…but nutrient runoff is a very common one for freshwater environments. Not so much on the coast where it’s more of a natural progression of wind, weather, and ocean currents that often drive these."
   ],
   [
    114.2,
    117.6,
    "Host",
    "So when you say “nutrient runoff”, can you explain that a little bit more?"
   ],
   [
    117.6,
    144.7,
    "Steve Kibler",
    "Sure. When I say “runoff” it means, simply, dissolved chemicals that are in the water on the land. This can be because of rainfall or because of farm irrigation, can be effluent from sewage treatment plants. All this material ends up in the water system and then eventually makes its way to the ocean, and coastal environments often times see high levels of nutrients just because of this runoff. This can contribute to harmful algal blooms."
   ],
   [
    144.7,
    148.0,
    "Host",
    "We’re all connected, right? We always talk about how water [exists from] “rivers to the sea”, and that truly happens."
   ],
   [
    148.0,
    151.2,
    "Steve Kibler",
    "That’s right!"
   ],
   [
    151.2,
    160.7,
    "Host",
    "You’ve said that this is a natural occurrence...is there any way to stop it from continuing, or to prevent it from occurring?"
   ],
   [
    160.7,
    207.2,
    "Steve Kibler",
    "There’s a little bit that can be done to prevent it – situations where runoff can be controlled can sometimes help prevent the development of harmful algal blooms, or make them so that they’re less severe. But in other instances, it’s a natural offshoot of human population growth, so it’s much more difficult to get a handle on. It’s hard to get millions of people to change the way that they live, and, in a sense, there’s probably no easy way to prevent harmful algal blooms from occurring in most instances. Like in the Gulf of Mexico, for instance, we’re talking about a large regional area where the cells can be distributed over thousands of square miles and there’s just simply no way to be able to remove these from the environment without harming the environment itself."
   ],
   [
    207.2,
    210.8,
    "Host",
    "Yeah, so removing it may actually do more harm than good."
   ],
   [
    210.8,
    216.3,
    "Steve Kibler",
    "Right – then you have the toxins to deal with as well, which may already be dissolved in the water."
   ]
  ],
  "questions": [
   {
    "q": "What does the man say about where harmful algal blooms occur?",
    "opts": [
     "They are found mainly along the Gulf Coast.",
     "The same species causes them all over the U.S.",
     "They happen in the ocean but not in lakes.",
     "They appear in both salt water and fresh water worldwide."
    ],
    "a": 3,
    "exp": "原文 \"There are harmful algal blooms throughout the U.S. – throughout the world, really. They can occur in marine environments and also freshwater environments\"，salt water and fresh water 同义替换 marine and freshwater environments。A 是主持人的提问前提，被否定；B 错，新英格兰是另一种 Alexandrium catenella；C 与 lakes and reservoirs 相反。"
   },
   {
    "q": "Why does the man mention European colonists arriving in Florida?",
    "opts": [
     "To suggest that the colonists caused the first blooms.",
     "To show that the blooms are a natural process older than modern settlement.",
     "To explain how scientists first studied the blooms.",
     "To prove that blooms have become less severe over time."
    ],
    "a": 1,
    "exp": "原文 \"harmful algal blooms are a natural process. They've occurred long before humans lived in the U.S. ... European colonists recorded harmful algal bloom problems ... back in the 1500's\"，提殖民者记录是为了说明藻华是自然现象、由来已久。A 与 natural process 相反；C 只是记录不是科学研究；D 原文反而说人类活动可能使其 worse。"
   },
   {
    "q": "What does the man say about nutrient runoff?",
    "opts": [
     "It commonly triggers freshwater blooms, less so coastal ones.",
     "It is the main driver of blooms along the coast.",
     "It comes only from farms near the ocean.",
     "It is harmless once it reaches the sea."
    ],
    "a": 0,
    "exp": "原文 \"a common trigger for freshwater HABs is nutrient runoff ... Not so much on the coast where it's more of a natural progression of wind, weather, and ocean currents\"，commonly triggers 同义替换 common trigger。B 偷换，沿海主要由风、天气、洋流驱动；C 以偏概全，还有降雨和污水处理厂排放；D 与 This can contribute to harmful algal blooms 相反。"
   },
   {
    "q": "What is the man's attitude toward preventing harmful algal blooms?",
    "opts": [
     "Confident that controlling runoff can stop all blooms.",
     "Hopeful that people will soon change the way they live.",
     "Doubtful, since little can be done in most cases.",
     "Supportive of removing algae cells from the Gulf of Mexico."
    ],
    "a": 2,
    "exp": "原文 \"there's probably no easy way to prevent harmful algal blooms from occurring in most instances\"，little can be done 同义替换 no easy way to prevent。A 以偏概全，控制径流只是 sometimes help；B 与 It's hard to get millions of people to change the way that they live 相反；D 与 no way to remove these ... without harming the environment 相反。"
   }
  ]
 },
 {
  "id": "real46",
  "title": "Sea Level Rise and the Future of Coastal Flooding",
  "episode": "2022 Sea Level Rise Technical Report",
  "org": "NOAA",
  "show": "NOAA Ocean Podcast",
  "type": "conv",
  "date": "",
  "src": "assets/audio/real46.m4a",
  "dur": 251.5,
  "url": "https://oceanservice.noaa.gov/podcast/feb22/nop52-sea-level-rise.html",
  "words": 700,
  "script": "Host: Mark, one thing that is striking about this report is how specific it is.\nMark Osler: We're specifically telling you, with a fair degree of certainty, this is how it will change in detail, by location. And so We are able to look at those statements of future conditions and plan and adapt. The hope is that this information is indeed sobering, but is also empowering and becomes the basis for action. That it is not a poorly defined statement that the future may be less nice than the present. This report is telling you: this is where the coastal water levels will be, on average. This is how the extremes are changing. And so, you can take that to the bank for the next coming decades, which is critical for financial planning, urban planning, all sorts of insurance and risk transfer implications can rely on this data in a way that is much more specific that we are able to produce for many other aspects of our changing climate.\nHost: William, we've talked about increases in minor and moderate flooding due to sea level rise. Can you talk about the differences between minor, moderate, and major coastal flooding?\nWilliam Sweet: The coastal flooding that we've been monitoring due to increases of sea level rise — we're calling this high tide flooding — are becoming much more common now than they used to be. And so we have elevations on land that the Weather Service in partnership with local emergency managers have established through years of impact monitoring, and they have made these elevation thresholds for three severity levels: minor, moderate, and major. Minor flooding typically is mostly disruptive, causes a delay or a deviation in your path to work, whether you're walking or driving. But moderate or major flooding more often causes damaging impacts, or can be destructive. And when these are likely to occur, the Weather Service issues coastal flood warnings for a significant risk to property and life. As more people move to the coast and sea levels continue to rise, that risk is really growing and it's growing rapidly.\nHost: I'd like to talk about this risk in coming years. We're now in the midst of accelerating sea level rise around the world and the report points to what we can expect in the next three decades. But what can we expect beyond that?\nWilliam Sweet: Over the last several years, we have witnessed the impacts of sea level rise occurring now. Flooding of streets when it's sunny outside. More times than not, there's no localized storm and there's water coming out of stormwater systems, onto the streets, getting up towards people's property, getting up towards people's businesses. And that's sea level rise, plain and simple. So I think the sense of urgency is pretty much there. Folks know what sea level rise looks like. It's the increase frequency of these kind of events that used to be in response to a big storm and it made sense. You were flooding because there was a storm. But now, we are flooding more often than not when there's no storm in sight. And so what this report does, is it says there is to be more of that. That is to be expected. And by how much are these flood frequencies likely to change is largely due to the amount of sea level rise that occurs. And that amount of future sea level rise is very much related to the amount of future emissions that we pump into the atmosphere. Not so much the next 30 years, that's pretty much baked in to the system at this point, and so that's why we have very good guidance as to what we expect to happen in the next 30 years. But beyond that, it's collectively in our hands as to how much sea levels are potentially going to rise. More emissions equals more heating, equals more ice melt, equals more thermal expansion, equals higher sea levels, equals more flooding. And that we are trying to put in context for the United States as to what to expect now, a few decades from now, and potentially what could happen by the end of the century and beyond.",
  "segs": [
   [
    0.0,
    5.4,
    "Host",
    "Mark, one thing that is striking about this report is how specific it is."
   ],
   [
    5.4,
    63.2,
    "Mark Osler",
    "We're specifically telling you, with a fair degree of certainty, this is how it will change in detail, by location. And so We are able to look at those statements of future conditions and plan and adapt. The hope is that this information is indeed sobering, but is also empowering and becomes the basis for action. That it is not a poorly defined statement that the future may be less nice than the present. This report is telling you: this is where the coastal water levels will be, on average. This is how the extremes are changing. And so, you can take that to the bank for the next coming decades, which is critical for financial planning, urban planning, all sorts of insurance and risk transfer implications can rely on this data in a way that is much more specific that we are able to produce for many other aspects of our changing climate."
   ],
   [
    63.2,
    73.1,
    "Host",
    "William, we've talked about increases in minor and moderate flooding due to sea level rise. Can you talk about the differences between minor, moderate, and major coastal flooding?"
   ],
   [
    73.1,
    131.2,
    "William Sweet",
    "The coastal flooding that we've been monitoring due to increases of sea level rise — we're calling this high tide flooding — are becoming much more common now than they used to be. And so we have elevations on land that the Weather Service in partnership with local emergency managers have established through years of impact monitoring, and they have made these elevation thresholds for three severity levels: minor, moderate, and major. Minor flooding typically is mostly disruptive, causes a delay or a deviation in your path to work, whether you're walking or driving. But moderate or major flooding more often causes damaging impacts, or can be destructive. And when these are likely to occur, the Weather Service issues coastal flood warnings for a significant risk to property and life. As more people move to the coast and sea levels continue to rise, that risk is really growing and it's growing rapidly."
   ],
   [
    131.2,
    144.7,
    "Host",
    "I'd like to talk about this risk in coming years. We're now in the midst of accelerating sea level rise around the world and the report points to what we can expect in the next three decades. But what can we expect beyond that?"
   ],
   [
    144.7,
    251.5,
    "William Sweet",
    "Over the last several years, we have witnessed the impacts of sea level rise occurring now. Flooding of streets when it's sunny outside. More times than not, there's no localized storm and there's water coming out of stormwater systems, onto the streets, getting up towards people's property, getting up towards people's businesses. And that's sea level rise, plain and simple. So I think the sense of urgency is pretty much there. Folks know what sea level rise looks like. It's the increase frequency of these kind of events that used to be in response to a big storm and it made sense. You were flooding because there was a storm. But now, we are flooding more often than not when there's no storm in sight. And so what this report does, is it says there is to be more of that. That is to be expected. And by how much are these flood frequencies likely to change is largely due to the amount of sea level rise that occurs. And that amount of future sea level rise is very much related to the amount of future emissions that we pump into the atmosphere. Not so much the next 30 years, that's pretty much baked in to the system at this point, and so that's why we have very good guidance as to what we expect to happen in the next 30 years. But beyond that, it's collectively in our hands as to how much sea levels are potentially going to rise. More emissions equals more heating, equals more ice melt, equals more thermal expansion, equals higher sea levels, equals more flooding. And that we are trying to put in context for the United States as to what to expect now, a few decades from now, and potentially what could happen by the end of the century and beyond."
   ]
  ],
  "questions": [
   {
    "q": "What does Mark hope the report will do for people?",
    "opts": [
     "Warn them that the future will simply be worse than today.",
     "Give them precise information that empowers them to act.",
     "Convince them to move away from crowded coastal cities.",
     "Remove the need for insurance and financial planning."
    ],
    "a": 1,
    "exp": "原文 \"The hope is that this information is indeed sobering, but is also empowering and becomes the basis for action\"，empowers them to act 同义替换 empowering and becomes the basis for action。A 偷换：他恰恰说报告不是 \"a poorly defined statement that the future may be less nice than the present\"；D 说反，原文是保险等领域可以依赖这些数据，而非不再需要；C 无中生有。"
   },
   {
    "q": "According to William, what is typically the effect of minor coastal flooding?",
    "opts": [
     "It causes serious damage to homes and businesses.",
     "It leads the Weather Service to issue flood warnings.",
     "It mainly disrupts people's daily trips, such as commuting.",
     "It happens much less often now than it used to."
    ],
    "a": 2,
    "exp": "原文 \"Minor flooding typically is mostly disruptive, causes a delay or a deviation in your path to work\"，disrupts people's daily trips 同义替换 delay or deviation in your path to work。A、B 张冠李戴，说的是 moderate 和 major flooding（damaging impacts、coastal flood warnings）；D 说反，原文是 \"becoming much more common now\"。"
   },
   {
    "q": "Why does William mention streets flooding when it is sunny outside?",
    "opts": [
     "To show that sea level rise is already affecting people today.",
     "To explain why weather forecasts for coastal cities often fail.",
     "To prove that city stormwater systems are poorly designed.",
     "To argue that big storms are hitting the coast more often."
    ],
    "a": 0,
    "exp": "原文 \"we have witnessed the impacts of sea level rise occurring now. Flooding of streets when it's sunny outside... And that's sea level rise, plain and simple\"，already affecting people today 对应 impacts... occurring now。D 偷换：他强调的是 \"flooding more often than not when there's no storm in sight\"，并非风暴变多；C 以水从 stormwater systems 涌出为影子，但原文没说设计不好；B 无中生有。"
   },
   {
    "q": "What does William say will decide how much sea levels rise beyond the next 30 years?",
    "opts": [
     "Natural changes that humans are unable to influence.",
     "The rise that is already locked into the climate system.",
     "How quickly people continue moving to the coast.",
     "The amount of emissions we release in the future."
    ],
    "a": 3,
    "exp": "原文 \"that amount of future sea level rise is very much related to the amount of future emissions... beyond that, it's collectively in our hands\"，emissions we release 同义替换 emissions that we pump into the atmosphere。B 张冠李戴：\"baked in to the system\" 指的是未来 30 年；A 与 \"in our hands\" 相反；C 是上一轮回答里讲风险增长的原因，与海平面上升幅度无关。"
   }
  ]
 },
 {
  "id": "real47",
  "title": "How NOAA Helps Before and After Hurricanes",
  "episode": "Hurricane Preparedness and Response",
  "org": "NOAA",
  "show": "NOAA Ocean Podcast",
  "type": "lecture",
  "date": "",
  "src": "assets/audio/real47.m4a",
  "dur": 230.1,
  "url": "https://oceanservice.noaa.gov/podcast/may24/nop74-hurricane-preparedness.html",
  "words": 673,
  "script": "Forbes: Now that we’ve covered that let’s talk a bit about what NOAA’s Ocean Service does in hurricane response before hurricanes hit, when they hit, and long after the storms pass. Here’s NOAA Ocean’s Troy Kitch with the details:\nKitch: One critical service the NOS provides is near real-time ocean and weather observations at locations affected by tropical storms from the National Water Level Observation Network. This network is made up over 200 stations around the country that continuously monitor water levels. During coastal storms, water levels can rise to flood levels. So it’s of course good to know and predict how high these water levels are going to get.\nHost: The Coastal Inundation Dashboard delivers real-time water level information at locations across the Nation through the lens of coastal flooding. During a hurricane or tropical storm that threatens the U.S., a storm-specific custom dashboard is created to highlight how coastal water levels are responding to the storm.\nDuring a storm, water levels shown on the Coastal Inundation Dashboard can include dangerous storm surge. If you find yourself near life-threatening inundation, please follow evacuation and other safety guidance issued by the National Hurricane Center. Find links to the Hurricane Center in our show notes.\nTroy goes on to tell us how the Ocean Service also is highly involved in the response to a hurricane AFTER the storm hits…\nKitch: NOS also plays a lead role in navigational surveys, aerial photography surveys, and hazardous spill response. After a hurricane strikes, emergency Navigation Response Teams help get ports and waterways back open as fast as possible. They use sonar and divers to check for obstructions and hazards to navigation. This work is critical – not only does it help get our waterways and ports flowing again so supplies can get to the people who need them in these areas, it also helps to get commerce back up and running in the region. And while these teams are out doing their work, they’re also collecting data that they’ll use to update navigational charts for the area that mariners rely on.\nNext up, let’s talk about aerial surveys. Many people don’t know this, but the Ocean Service begins flying survey missions to take pictures of coastal areas hit by a hurricane just days after the storm strikes and makes the photographs available on the internet to help those most affected by the hurricane determine if their homes, businesses, and properties had been damaged or destroyed. And finally, the NOS plays a major role after a hurricane hits by responding to hazardous material spills to survey vessels, pipelines, wells, or containers that may be leaking hazardous fuel, oil, or chemicals. And they fly on missions to locate and track offshore sources of spills. This data is combined with current weather and water conditions to develop computer models to help predict spill movement and to figure out where the greatest pollution threats are likely to occur. Added to this, the office lends a hand with vessel salvage, shoreline cleanup, and helping to understand how spills will affect natural resources in the region. Scientists and economists also assess the injuries done to natural resources caused by hazardous spills, grounding and debris in the area.\nSo the Ocean Service plays a big role in the immediate aftermath of a hurricane, but the work doesn’t stop there. For weeks, months, and even years after a hurricane hits the shores, the work continues to better understand the effect of the hurricane, in recovery planning, and in monitoring the effects of contaminants released from the storm on the environment. Long after the storm strikes, there are many big questions that need answered: what is the economic impact of the storm? What is the ecological impact – the cost to the environment? Where is the debris concentrated? How much wetlands were lost? These products can include everything from aerial imagery of the affected region from before and after the storm, digital elevation data to measure how the coastline changed as a result of the storm, to long-term recovery plans.",
  "segs": [
   [
    0.0,
    14.5,
    "Forbes",
    "Now that we’ve covered that let’s talk a bit about what NOAA’s Ocean Service does in hurricane response before hurricanes hit, when they hit, and long after the storms pass. Here’s NOAA Ocean’s Troy Kitch with the details:"
   ],
   [
    14.5,
    43.8,
    "Kitch",
    "One critical service the NOS provides is near real-time ocean and weather observations at locations affected by tropical storms from the National Water Level Observation Network. This network is made up over 200 stations around the country that continuously monitor water levels. During coastal storms, water levels can rise to flood levels. So it’s of course good to know and predict how high these water levels are going to get."
   ],
   [
    43.8,
    62.3,
    "Host",
    "The Coastal Inundation Dashboard delivers real-time water level information at locations across the Nation through the lens of coastal flooding. During a hurricane or tropical storm that threatens the U.S., a storm-specific custom dashboard is created to highlight how coastal water levels are responding to the storm."
   ],
   [
    62.3,
    77.8,
    "Host",
    "During a storm, water levels shown on the Coastal Inundation Dashboard can include dangerous storm surge. If you find yourself near life-threatening inundation, please follow evacuation and other safety guidance issued by the National Hurricane Center. Find links to the Hurricane Center in our show notes."
   ],
   [
    77.8,
    85.9,
    "Host",
    "Troy goes on to tell us how the Ocean Service also is highly involved in the response to a hurricane AFTER the storm hits…"
   ],
   [
    85.9,
    121.8,
    "Kitch",
    "NOS also plays a lead role in navigational surveys, aerial photography surveys, and hazardous spill response. After a hurricane strikes, emergency Navigation Response Teams help get ports and waterways back open as fast as possible. They use sonar and divers to check for obstructions and hazards to navigation. This work is critical – not only does it help get our waterways and ports flowing again so supplies can get to the people who need them in these areas, it also helps to get commerce back up and running in the region. And while these teams are out doing their work, they’re also collecting data that they’ll use to update navigational charts for the area that mariners rely on."
   ],
   [
    121.8,
    183.7,
    "Kitch",
    "Next up, let’s talk about aerial surveys. Many people don’t know this, but the Ocean Service begins flying survey missions to take pictures of coastal areas hit by a hurricane just days after the storm strikes and makes the photographs available on the internet to help those most affected by the hurricane determine if their homes, businesses, and properties had been damaged or destroyed. And finally, the NOS plays a major role after a hurricane hits by responding to hazardous material spills to survey vessels, pipelines, wells, or containers that may be leaking hazardous fuel, oil, or chemicals. And they fly on missions to locate and track offshore sources of spills. This data is combined with current weather and water conditions to develop computer models to help predict spill movement and to figure out where the greatest pollution threats are likely to occur. Added to this, the office lends a hand with vessel salvage, shoreline cleanup, and helping to understand how spills will affect natural resources in the region. Scientists and economists also assess the injuries done to natural resources caused by hazardous spills, grounding and debris in the area."
   ],
   [
    183.7,
    230.1,
    "Kitch",
    "So the Ocean Service plays a big role in the immediate aftermath of a hurricane, but the work doesn’t stop there. For weeks, months, and even years after a hurricane hits the shores, the work continues to better understand the effect of the hurricane, in recovery planning, and in monitoring the effects of contaminants released from the storm on the environment. Long after the storm strikes, there are many big questions that need answered: what is the economic impact of the storm? What is the ecological impact – the cost to the environment? Where is the debris concentrated? How much wetlands were lost? These products can include everything from aerial imagery of the affected region from before and after the storm, digital elevation data to measure how the coastline changed as a result of the storm, to long-term recovery plans."
   ]
  ],
  "questions": [
   {
    "q": "What does the speaker say about the National Water Level Observation Network?",
    "opts": [
     "Its stations keep watch on water levels at over 200 sites nationwide.",
     "Its stations issue evacuation orders when a storm approaches.",
     "Its stations measure wind speeds inside a hurricane.",
     "Its stations forecast where a hurricane will reach land."
    ],
    "a": 0,
    "exp": "原文 \"This network is made up over 200 stations around the country that continuously monitor water levels\"，keep watch on 同义替换 continuously monitor。B 张冠李戴：疏散等安全指引来自 National Hurricane Center；C、D 无中生有，原文只说站点提供海洋和天气观测并帮助预测水位。"
   },
   {
    "q": "What is the main job of the Navigation Response Teams after a hurricane?",
    "opts": [
     "To rescue people who are trapped by floodwaters.",
     "To repair damaged ships, pipelines and wells.",
     "To reopen ports and waterways so supplies and trade can resume.",
     "To gather data mainly for research on future storms."
    ],
    "a": 2,
    "exp": "原文 \"help get ports and waterways back open as fast as possible... so supplies can get to the people who need them... get commerce back up and running\"，trade can resume 对应 commerce back up and running。D 以偏概全：收集数据更新海图只是顺带工作，且是为航海图而非风暴研究；B 张冠李戴：vessels、pipelines、wells 出现在危险品泄漏应对部分，且是勘查而非修理；A 无中生有。"
   },
   {
    "q": "What does the speaker say many people don't know about the aerial surveys?",
    "opts": [
     "They usually begin several weeks after a storm.",
     "Their photos are kept for government use only.",
     "They are used to predict the path of the next storm.",
     "Their photos are taken within days and put online to show damage."
    ],
    "a": 3,
    "exp": "原文 \"the Ocean Service begins flying survey missions to take pictures... just days after the storm strikes and makes the photographs available on the internet to help those most affected... determine if their homes... had been damaged\"，put online 同义替换 available on the internet。A 与 just days after 相反；B 与公开上网相反；C 无中生有。"
   },
   {
    "q": "What is the main point of the speaker's final part?",
    "opts": [
     "Most lost wetlands recover within a few months of a storm.",
     "The Ocean Service keeps working for years after a hurricane passes.",
     "Recovery depends mostly on money raised by local communities.",
     "Debris is the most serious long-term problem a storm leaves behind."
    ],
    "a": 1,
    "exp": "原文 \"the work doesn't stop there. For weeks, months, and even years after a hurricane hits the shores, the work continues\"，keeps working for years 同义替换 work continues... even years after。A 偷换：原文只是提出 \"How much wetlands were lost?\" 这一问题；D 以偏概全，debris 只是众多问题之一；C 无中生有，economic impact 是要评估的问题，不是资金来源。"
   }
  ]
 },
 {
  "id": "real48",
  "title": "NOAA's Role in Offshore Wind for Hawaii",
  "episode": "Offshore Wind Energy",
  "org": "NOAA",
  "show": "NOAA Ocean Podcast",
  "type": "conv",
  "date": "",
  "src": "assets/audio/real48.m4a",
  "dur": 216.3,
  "url": "https://oceanservice.noaa.gov/podcast/mar17/nop02-wind-energy.html",
  "words": 571,
  "script": "Host: I had the chance to talk with the two primary scientists working on this project in Hawaii, Bryan Costa and Dr. Matt Kendall from the National Centers for Coastal Ocean Science. We began the discussion by talking a bit about NOAA's role in Offshore Wind Energy projects and how they became involved in the support for this effort. Bryan was the first to explain:\nBryan Costa: NOAA's work in offshore wind, particularly NOS, or the National Ocean Service…it's been pretty diverse over the years since 2011. Its included things like conducting surveys of what local residents feel about offshore wind, [and] how they use the ocean. It's also included work such as mapping the seafloor habitats, and characterizing those habitats, and also predicting where certain animals might be in the ocean. These products were designed to inform the leasing process…including siting, anchor placement, cable routing, construction and operation.\nHost: Matt had a great way to further explain the process to me.\nMatt Kendall: So you've got a few main players in siting offshore wind development… you've got a municipality that needs power, you've got an industry that can place offshore wind turbines and get power, and then you've got an agency that regulates and leases the seafloor for where those things [turbines] can get placed…and that is BOEM, the Bureau of Ocean Energy Management. They're the main regulatory agency in this. NOAA's role is providing them information to help make decisions about where to place things so that they don't impact the environmental issues that Bryan was talking about – they don't impact seabird flyaways, deep corals for where things are going to be anchored, or some communities where they are going to have to pass the power line from offshore up into the municipality where it gets hooked up…\nHost: Next we talked about some of the greatest benefits of Wind Energy in Hawaii, and why is this a good fit for NOAA support.\nMatt Kendall: Hawaii is really a perfect fit for getting power from a couple of different things. Anybody that has been there knows that they have an abundance of sunshine – and driving around you see a lot of solar panels on roofs. Anybody that's been to the beach knows there is always a nice breeze – and they have an abundant natural resource there that can be harnessed to get a lot of their power. In fact, the state of Hawaii has set a goal of achieving 100% of their energy need [supplied by] renewable sources by the year 2040.\nBryan Costa: The state of Hawaii stands to benefit in several ways from offshore wind. First – the state's energy prices are the highest in the Nation, and they are so high because over half of the state's electricity is generated from imported oil. Generating more electricity from local sources, like wind, really could help reduce the cost of electricity in Hawaii. Also, it has the potential to reduce emissions that are harmful to human health, as well as to create jobs in a new business sector, and to help the state of Hawaii rely less on foreign energy sources and to achieve greater energy independence. That said, wind energy is a pretty new industry in the U.S. – its more developed in Europe, in particular – so there are potential impacts and trade-offs and it will require further analysis as the wind energy releasing process unfolds in Hawaii and in the U.S. at large.",
  "segs": [
   [
    0.0,
    21.3,
    "Host",
    "I had the chance to talk with the two primary scientists working on this project in Hawaii, Bryan Costa and Dr. Matt Kendall from the National Centers for Coastal Ocean Science. We began the discussion by talking a bit about NOAA's role in Offshore Wind Energy projects and how they became involved in the support for this effort. Bryan was the first to explain:"
   ],
   [
    21.3,
    58.2,
    "Bryan Costa",
    "NOAA's work in offshore wind, particularly NOS, or the National Ocean Service…it's been pretty diverse over the years since 2011. Its included things like conducting surveys of what local residents feel about offshore wind, [and] how they use the ocean. It's also included work such as mapping the seafloor habitats, and characterizing those habitats, and also predicting where certain animals might be in the ocean. These products were designed to inform the leasing process…including siting, anchor placement, cable routing, construction and operation."
   ],
   [
    58.2,
    62.8,
    "Host",
    "Matt had a great way to further explain the process to me."
   ],
   [
    62.8,
    117.8,
    "Matt Kendall",
    "So you've got a few main players in siting offshore wind development… you've got a municipality that needs power, you've got an industry that can place offshore wind turbines and get power, and then you've got an agency that regulates and leases the seafloor for where those things [turbines] can get placed…and that is BOEM, the Bureau of Ocean Energy Management. They're the main regulatory agency in this. NOAA's role is providing them information to help make decisions about where to place things so that they don't impact the environmental issues that Bryan was talking about – they don't impact seabird flyaways, deep corals for where things are going to be anchored, or some communities where they are going to have to pass the power line from offshore up into the municipality where it gets hooked up…"
   ],
   [
    117.8,
    126.0,
    "Host",
    "Next we talked about some of the greatest benefits of Wind Energy in Hawaii, and why is this a good fit for NOAA support."
   ],
   [
    126.0,
    160.6,
    "Matt Kendall",
    "Hawaii is really a perfect fit for getting power from a couple of different things. Anybody that has been there knows that they have an abundance of sunshine – and driving around you see a lot of solar panels on roofs. Anybody that's been to the beach knows there is always a nice breeze – and they have an abundant natural resource there that can be harnessed to get a lot of their power. In fact, the state of Hawaii has set a goal of achieving 100% of their energy need [supplied by] renewable sources by the year 2040."
   ],
   [
    160.6,
    216.3,
    "Bryan Costa",
    "The state of Hawaii stands to benefit in several ways from offshore wind. First – the state's energy prices are the highest in the Nation, and they are so high because over half of the state's electricity is generated from imported oil. Generating more electricity from local sources, like wind, really could help reduce the cost of electricity in Hawaii. Also, it has the potential to reduce emissions that are harmful to human health, as well as to create jobs in a new business sector, and to help the state of Hawaii rely less on foreign energy sources and to achieve greater energy independence. That said, wind energy is a pretty new industry in the U.S. – its more developed in Europe, in particular – so there are potential impacts and trade-offs and it will require further analysis as the wind energy releasing process unfolds in Hawaii and in the U.S. at large."
   ]
  ],
  "questions": [
   {
    "q": "According to Bryan, what were NOAA's offshore wind products designed to do?",
    "opts": [
     "Persuade local residents to support new wind farms.",
     "Guide decisions in leasing, such as where turbines go.",
     "Replace earlier surveys of how people use the ocean.",
     "Help companies build and run offshore turbines."
    ],
    "a": 1,
    "exp": "原文 \"These products were designed to inform the leasing process…including siting, anchor placement, cable routing\"，guide decisions 同义替换 inform，where turbines go 对应 siting。A 偷换：NOAA 只是调查居民对海上风电的看法（surveys of what local residents feel），不是说服他们；C 张冠李戴，调查本身就是工作内容之一；D 张冠李戴，construction and operation 只是租赁流程的环节，造和运营风机是 industry 的事。"
   },
   {
    "q": "How does Matt describe NOAA's part in siting offshore wind projects?",
    "opts": [
     "It regulates and leases the seafloor where turbines are placed.",
     "It buys the power produced to supply local towns.",
     "It provides information so turbines avoid harming the environment.",
     "It lays the power lines that connect turbines to the shore."
    ],
    "a": 2,
    "exp": "原文 \"NOAA's role is providing them information to help make decisions about where to place things so that they don't impact the environmental issues\"，avoid harming the environment 同义替换 don't impact the environmental issues。A 张冠李戴：管理和出租海床的是 BOEM；B 张冠李戴自 municipality that needs power；D 偷换：原文只说电缆要穿过某些社区、不能影响它们。"
   },
   {
    "q": "Why does Matt think Hawaii is a perfect fit for renewable energy?",
    "opts": [
     "It has plenty of sunshine and steady ocean breezes.",
     "It has already met its goal of using only renewable power.",
     "Its residents have refused to install solar panels.",
     "It already has the largest wind market in the country."
    ],
    "a": 0,
    "exp": "原文 \"they have an abundance of sunshine... there is always a nice breeze\"，plenty of sunshine and steady breezes 同义替换 abundance of sunshine / always a nice breeze。B 偷换：100% 可再生是到 2040 年的目标，尚未实现；C 与 \"you see a lot of solar panels on roofs\" 相反；D 无中生有。"
   },
   {
    "q": "What is Bryan's attitude toward offshore wind in Hawaii?",
    "opts": [
     "Enthusiastic, since he sees it as free of any risk.",
     "Doubtful, because the technology is still too new.",
     "Indifferent, because Europe is far more advanced.",
     "Positive, but aware of trade-offs needing more study."
    ],
    "a": 3,
    "exp": "原文 \"The state of Hawaii stands to benefit in several ways... That said, ... there are potential impacts and trade-offs and it will require further analysis\"，先列好处、再提醒权衡，即 positive but cautious。A 忽略了 trade-offs；B 偷换：他只说美国这个行业还新，并不怀疑；C 由 \"more developed in Europe\" 曲解而来。"
   }
  ]
 },
 {
  "id": "real49",
  "title": "Seagrass: Basic Facts and Why It Matters",
  "episode": "Seagrass: Ecosystem Services Provider",
  "org": "NOAA",
  "show": "NOAA Ocean Podcast",
  "type": "conv",
  "date": "",
  "src": "assets/audio/real49.m4a",
  "dur": 257.8,
  "url": "https://oceanservice.noaa.gov/podcast/mar23/nop63-seagrass.html",
  "words": 588,
  "script": "Uhrin: Seagrasses are rooted flowering plants that grow in semi salty water to full seawater in the intertidal and subtidal zones of the ocean. They live entirely submerged under the water’s surface, and they evolved from terrestrial plants that migrated back to the ocean many millions of years ago. Seagrass plants have stems, leaves, roots, and — just like land plants — they are capable of photosynthesis, but despite looking like land grasses, seagrasses are actually more closely related to lilies and ginger plants. And there are 72 species of seagrass globally. Seagrasses can cover large areas of the seafloor, forming what we call beds or meadows and, in fact, some seagrass meadows are large enough to be seen from space, which is really cool. Seagrass ecosystems provide habitat for hundreds of species, and they’re among the most productive ecosystems in the world. Using DNA sequencing, a patch of seagrass off the coast of Spain has been identified as the oldest living organism on Earth. Some of the plants in that particular patch were found to be 80,000 and 200,000 years old, which is staggering.\nHost: Now you mentioned the ecosystems of seagrass, are there specific areas where they typically thrive? Do they prefer warmer climates, colder, or does it not really matter?\nUhrin: So seagrasses actually occur in tropical, subtropical, temperate and polar climates. They’re found along the shorelines of every continent except Antarctica, and their distribution is in abundance, so where they occur along the shore is largely controlled by light availability. So I mentioned before that they photosynthesize, so they need to have light. So they are most commonly found in shallow, coastal waters and they typically occur in areas that are sheltered from high winds and waves and areas that have muddy or sandy sediments.\nHost: So you actually kind of led into my next question. I was gonna ask, why are seagrass considered to be important for the health of the ocean, and you kind of touched on that, could you explain a little bit more in detail?\nUhrin: Yeah, absolutely, they are really important. They actually provide many different types of ecosystem services, so an ecosystem service is the benefit that humans gain from the natural environment. So I mentioned previously that seagrasses do provide critical habitat, refuge, and feeding areas for many important animals, including a number of species that are commercially important for seafood like crabs, scallops, shrimp, flounder, so of course, if you like seafood, you are benefiting from the seagrass helping out those critters during their lifecycle. The seagrass canopy can reduce the energy from waves and tides that's flowing over the grass and trapping fine sediment that accumulates. So this protects shorelines from erosion, kind of creates a buffer if you will, if storms pass through and there are some other services that seagrass provides to us that are not so obvious because they are nonmaterial benefits. These are things or benefits that people would gain simply by interacting with the environment; in this case, interacting with the seagrass; for example, perhaps if you are like me and enjoy snorkeling in a seagrass bed and seeing all the cool critters that hang out there. So that’s another type of benefit from seagrasses. And lastly, seagrasses also contribute to the most basic cycles that marine ecosystems need to function. For example, seagrasses use and recycle nutrients from both the water column and the sediments, and they release oxygen into the water which is why they are sometimes called the “lungs of the sea.”",
  "segs": [
   [
    0.0,
    86.3,
    "Uhrin",
    "Seagrasses are rooted flowering plants that grow in semi salty water to full seawater in the intertidal and subtidal zones of the ocean. They live entirely submerged under the water’s surface, and they evolved from terrestrial plants that migrated back to the ocean many millions of years ago. Seagrass plants have stems, leaves, roots, and — just like land plants — they are capable of photosynthesis, but despite looking like land grasses, seagrasses are actually more closely related to lilies and ginger plants. And there are 72 species of seagrass globally. Seagrasses can cover large areas of the seafloor, forming what we call beds or meadows and, in fact, some seagrass meadows are large enough to be seen from space, which is really cool. Seagrass ecosystems provide habitat for hundreds of species, and they’re among the most productive ecosystems in the world. Using DNA sequencing, a patch of seagrass off the coast of Spain has been identified as the oldest living organism on Earth. Some of the plants in that particular patch were found to be 80,000 and 200,000 years old, which is staggering."
   ],
   [
    86.3,
    96.6,
    "Host",
    "Now you mentioned the ecosystems of seagrass, are there specific areas where they typically thrive? Do they prefer warmer climates, colder, or does it not really matter?"
   ],
   [
    96.6,
    137.7,
    "Uhrin",
    "So seagrasses actually occur in tropical, subtropical, temperate and polar climates. They’re found along the shorelines of every continent except Antarctica, and their distribution is in abundance, so where they occur along the shore is largely controlled by light availability. So I mentioned before that they photosynthesize, so they need to have light. So they are most commonly found in shallow, coastal waters and they typically occur in areas that are sheltered from high winds and waves and areas that have muddy or sandy sediments."
   ],
   [
    137.7,
    150.4,
    "Host",
    "So you actually kind of led into my next question. I was gonna ask, why are seagrass considered to be important for the health of the ocean, and you kind of touched on that, could you explain a little bit more in detail?"
   ],
   [
    150.4,
    257.8,
    "Uhrin",
    "Yeah, absolutely, they are really important. They actually provide many different types of ecosystem services, so an ecosystem service is the benefit that humans gain from the natural environment. So I mentioned previously that seagrasses do provide critical habitat, refuge, and feeding areas for many important animals, including a number of species that are commercially important for seafood like crabs, scallops, shrimp, flounder, so of course, if you like seafood, you are benefiting from the seagrass helping out those critters during their lifecycle. The seagrass canopy can reduce the energy from waves and tides that's flowing over the grass and trapping fine sediment that accumulates. So this protects shorelines from erosion, kind of creates a buffer if you will, if storms pass through and there are some other services that seagrass provides to us that are not so obvious because they are nonmaterial benefits. These are things or benefits that people would gain simply by interacting with the environment; in this case, interacting with the seagrass; for example, perhaps if you are like me and enjoy snorkeling in a seagrass bed and seeing all the cool critters that hang out there. So that’s another type of benefit from seagrasses. And lastly, seagrasses also contribute to the most basic cycles that marine ecosystems need to function. For example, seagrasses use and recycle nutrients from both the water column and the sediments, and they release oxygen into the water which is why they are sometimes called the “lungs of the sea.”"
   ]
  ],
  "questions": [
   {
    "q": "What does the scientist say about seagrasses?",
    "opts": [
     "They are a kind of grass that grows partly above the water.",
     "They are closer relatives of lilies and ginger than of grasses.",
     "They cannot carry out photosynthesis under the water.",
     "They first lived in the ocean and later moved onto land."
    ],
    "a": 1,
    "exp": "原文 \"despite looking like land grasses, seagrasses are actually more closely related to lilies and ginger plants\"，closer relatives of 同义替换 more closely related to。A 与 \"live entirely submerged\" 相反；C 与 \"capable of photosynthesis\" 相反；D 说反，原文是从陆地植物演化而来、后来 \"migrated back to the ocean\"。"
   },
   {
    "q": "What mainly determines where seagrasses grow along the shore?",
    "opts": [
     "The temperature of the water.",
     "The amount of salt in the water.",
     "How much light reaches them.",
     "How strong the waves and winds are."
    ],
    "a": 2,
    "exp": "原文 \"where they occur along the shore is largely controlled by light availability\"，how much light reaches them 同义替换 light availability，mainly 对应 largely。A 错：热带到极地都有分布；B 错：从半咸水到海水都能长；D 以偏概全，避风浪只是它们常见的生境特点，不是决定因素。"
   },
   {
    "q": "Why does the scientist mention crabs, scallops and shrimp?",
    "opts": [
     "To warn that these animals are damaging seagrass beds.",
     "To explain why seagrass meadows are shrinking worldwide.",
     "To suggest that people should eat less seafood.",
     "To show that seafood lovers benefit from seagrass habitats."
    ],
    "a": 3,
    "exp": "原文 \"species that are commercially important for seafood like crabs, scallops, shrimp... if you like seafood, you are benefiting from the seagrass\"，seafood lovers benefit 同义替换 if you like seafood, you are benefiting。A、B、C 均无中生有，她提到这些动物是为了说明海草为其提供栖息和觅食场所。"
   },
   {
    "q": "What is the main point of the scientist's answer about why seagrasses matter?",
    "opts": [
     "They provide many kinds of benefits, from habitat to oxygen.",
     "Their value lies mainly in supporting the fishing industry.",
     "People value them mostly as places for snorkeling.",
     "They matter chiefly because they stop storms reaching land."
    ],
    "a": 0,
    "exp": "原文 \"They actually provide many different types of ecosystem services\"，随后依次讲栖息地、防侵蚀、浮潜等非物质收益、营养循环和释放氧气（\"lungs of the sea\"），many kinds of benefits 同义替换 many different types of ecosystem services。B、C、D 都是以偏概全，只抓住其中一项服务。"
   }
  ]
 },
 {
  "id": "real50",
  "title": "How Water Level Stations Help Warn of Tsunamis",
  "episode": "Water Level Stations and their Role in Tsunami Detection",
  "org": "NOAA",
  "show": "NOAA Ocean Podcast",
  "type": "conv",
  "date": "",
  "src": "assets/audio/real50.m4a",
  "dur": 218.5,
  "url": "https://oceanservice.noaa.gov/podcast/mar22/nop54-tsunami-support.html",
  "words": 617,
  "script": "Host: How exactly do these water level stations assist with supporting tsunami response efforts?\nPaul Fanelli: CO-OPS coastal water level stations are a critical component of tsunami detection. Most stations collect and disseminate water level information in real-time every six minutes. This is sufficient for most applications like tracking the tides for navigation and even measuring storm surge from tropical storms and hurricanes. Tsunami waves can travel at 500 miles per hour or more over the open ocean. When waves reach the coast, they do slow down, but still can move onshore at speeds of 20 to 30 miles per hour. In order to record the peak tsunami wave height as precisely as possible when the wave comes ashore, CO-OPS stations are configured to transmit updated water level observations every minute and store 15-second water level measurements locally at the station, which can be retrieved remotely.\nHost: Wow. With tsunamis being able to move as fast as jet planes, time is of the essence when you need to warn the public. Let’s talk about the U.S. Tsunami Warning System, which is run by the NOAA Tsunami Program. What role does it play in responding to tsunami threats?\nPaul Fanelli: The U.S. Tsunami Warning System is composed of two parts. First, monitoring for tsunamis and the earthquakes that cause them and second, providing timely and accurate tsunami messages to the public to effectively warn them of potential danger. These messages are broadcast through local radio and television, wireless emergency alerts, NOAA Weather Radio and NOAA websites (like Tsunami.gov).\nNOAA operates two tsunami warning centers, which are staffed 24 hours a day, seven days a week. The National Tsunami Warning Center serves the continental United States, Alaska, and Canada. The Pacific Tsunami Warning Center directly serves the Hawaiian Islands, the U.S. Pacific and Caribbean territories, and the British Virgin Islands, and is the primary international forecast center for the Pacific and Caribbean region.\nHost: How does CO-OPS support these centers?\nPaul Fanelli: CO-OPS works very closely with the tsunami warning centers to help support the tsunami warning system. The two tsunami warning centers use sea level data to verify the existence and height of a tsunami after a seismic event. The dense network of coastal water level stations maintained by CO-OPS provide the tsunami warning centers with confirmation of tsunami arrival time and height and can be used to update tsunami arrival times and potential wave heights for locations farther away.\nHost: This information helps the warning centers better communicate impacts from a tsunami and the potential danger to the public.\nThe January 2022 volcanic eruption in the Tonga Islands that resulted in a tsunami was a significant and unique event. Only 5% of tsunamis are caused by volcanic activity. Was the wave generated from this event different from other tsunami events?\nPaul Fanelli: While CO-OPS’ response to this event was similar to more typical tsunamis that are generated from earthquakes, the data from this event was truly unique and CO-OPS’ sensor network provided a wealth of observations that we are only beginning to analyze.\nHost: That sounds really fascinating. What would be one observation that really stood out to you?\nPaul Fanelli: One interesting feature about this event was its timing relative to the tide. When the initial tsunami waves reached Hawaii and then the west coast, many locations were close to high tide. The height of the tsunami waves on top of the tide resulted in record or near record water levels at some locations.\nObserved water levels at Nawiliwili, Hawaii, were the highest since Hurricane Iniki in 1992. Water levels at Port San Luis, California, reached about three and a half feet above normal high tide, setting a new record for this location, which has data dating back to the 1940’s.",
  "segs": [
   [
    0.0,
    6.1,
    "Host",
    "How exactly do these water level stations assist with supporting tsunami response efforts?"
   ],
   [
    6.1,
    48.4,
    "Paul Fanelli",
    "CO-OPS coastal water level stations are a critical component of tsunami detection. Most stations collect and disseminate water level information in real-time every six minutes. This is sufficient for most applications like tracking the tides for navigation and even measuring storm surge from tropical storms and hurricanes. Tsunami waves can travel at 500 miles per hour or more over the open ocean. When waves reach the coast, they do slow down, but still can move onshore at speeds of 20 to 30 miles per hour. In order to record the peak tsunami wave height as precisely as possible when the wave comes ashore, CO-OPS stations are configured to transmit updated water level observations every minute and store 15-second water level measurements locally at the station, which can be retrieved remotely."
   ],
   [
    48.4,
    67.0,
    "Host",
    "Wow. With tsunamis being able to move as fast as jet planes, time is of the essence when you need to warn the public. Let’s talk about the U.S. Tsunami Warning System, which is run by the NOAA Tsunami Program. What role does it play in responding to tsunami threats?"
   ],
   [
    67.0,
    88.3,
    "Paul Fanelli",
    "The U.S. Tsunami Warning System is composed of two parts. First, monitoring for tsunamis and the earthquakes that cause them and second, providing timely and accurate tsunami messages to the public to effectively warn them of potential danger. These messages are broadcast through local radio and television, wireless emergency alerts, NOAA Weather Radio and NOAA websites (like Tsunami.gov)."
   ],
   [
    88.3,
    110.3,
    "Paul Fanelli",
    "NOAA operates two tsunami warning centers, which are staffed 24 hours a day, seven days a week. The National Tsunami Warning Center serves the continental United States, Alaska, and Canada. The Pacific Tsunami Warning Center directly serves the Hawaiian Islands, the U.S. Pacific and Caribbean territories, and the British Virgin Islands, and is the primary international forecast center for the Pacific and Caribbean region."
   ],
   [
    110.3,
    113.8,
    "Host",
    "How does CO-OPS support these centers?"
   ],
   [
    113.8,
    140.6,
    "Paul Fanelli",
    "CO-OPS works very closely with the tsunami warning centers to help support the tsunami warning system. The two tsunami warning centers use sea level data to verify the existence and height of a tsunami after a seismic event. The dense network of coastal water level stations maintained by CO-OPS provide the tsunami warning centers with confirmation of tsunami arrival time and height and can be used to update tsunami arrival times and potential wave heights for locations farther away."
   ],
   [
    140.6,
    148.2,
    "Host",
    "This information helps the warning centers better communicate impacts from a tsunami and the potential danger to the public."
   ],
   [
    148.2,
    166.8,
    "Host",
    "The January 2022 volcanic eruption in the Tonga Islands that resulted in a tsunami was a significant and unique event. Only 5% of tsunamis are caused by volcanic activity. Was the wave generated from this event different from other tsunami events?"
   ],
   [
    166.8,
    178.9,
    "Paul Fanelli",
    "While CO-OPS’ response to this event was similar to more typical tsunamis that are generated from earthquakes, the data from this event was truly unique and CO-OPS’ sensor network provided a wealth of observations that we are only beginning to analyze."
   ],
   [
    178.9,
    186.0,
    "Host",
    "That sounds really fascinating. What would be one observation that really stood out to you?"
   ],
   [
    186.0,
    202.3,
    "Paul Fanelli",
    "One interesting feature about this event was its timing relative to the tide. When the initial tsunami waves reached Hawaii and then the west coast, many locations were close to high tide. The height of the tsunami waves on top of the tide resulted in record or near record water levels at some locations."
   ],
   [
    202.3,
    218.5,
    "Paul Fanelli",
    "Observed water levels at Nawiliwili, Hawaii, were the highest since Hurricane Iniki in 1992. Water levels at Port San Luis, California, reached about three and a half feet above normal high tide, setting a new record for this location, which has data dating back to the 1940’s."
   ]
  ],
  "questions": [
   {
    "q": "Why are the stations set to send data every minute when a tsunami comes?",
    "opts": [
     "Because one-minute data is needed for tracking ordinary tides.",
     "To record the highest wave height as precisely as possible.",
     "Because tsunamis move more slowly than storm surges near shore.",
     "To save storage space at each station during the event."
    ],
    "a": 1,
    "exp": "原文 \"In order to record the peak tsunami wave height as precisely as possible... transmit updated water level observations every minute\"，highest wave height 同义替换 peak tsunami wave height。A 张冠李戴：追踪潮汐每六分钟一次就够了；C 无中生有，原文只说海啸靠岸时减速到每小时 20–30 英里；D 无中生有，原文说 15 秒数据存在本地。"
   },
   {
    "q": "How do the water level stations help the tsunami warning centers?",
    "opts": [
     "They predict when undersea earthquakes will happen.",
     "They keep the centers staffed around the clock.",
     "They broadcast warnings over local radio and TV.",
     "They confirm when a tsunami arrives and how high it is."
    ],
    "a": 3,
    "exp": "原文 \"provide the tsunami warning centers with confirmation of tsunami arrival time and height\"，confirm when... and how high 同义替换 confirmation of arrival time and height。B 张冠李戴：24 小时值守的是两个预警中心；C 张冠李戴：广播是预警系统发布消息的渠道；A 无中生有。"
   },
   {
    "q": "What does the man say about the data from the Tonga event?",
    "opts": [
     "It was truly unique, and its analysis has only just begun.",
     "It looked much the same as data from earthquake tsunamis.",
     "It has already been fully studied by the warning centers.",
     "It was too limited to tell scientists anything new."
    ],
    "a": 0,
    "exp": "原文 \"the data from this event was truly unique... a wealth of observations that we are only beginning to analyze\"，analysis has only just begun 同义替换 only beginning to analyze。B 偷换：与地震海啸相似的是 CO-OPS 的应对方式（response），不是数据；C、D 与原文相反。"
   },
   {
    "q": "What stood out to the man about the Tonga tsunami?",
    "opts": [
     "It started from a volcano that erupted during low tide.",
     "It reached Hawaii before any station could detect it.",
     "It arrived near high tide, pushing water to record levels.",
     "It was the highest water seen in California since 1992."
    ],
    "a": 2,
    "exp": "原文 \"many locations were close to high tide. The height of the tsunami waves on top of the tide resulted in record or near record water levels\"，pushing water to record levels 对应 resulted in record water levels。D 张冠李戴：1992 年（Hurricane Iniki）说的是夏威夷 Nawiliwili，加州 Port San Luis 是自 1940 年代有记录以来的新高；A 与 high tide 相反；B 无中生有。"
   }
  ]
 }
];
