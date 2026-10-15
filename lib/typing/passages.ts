/**
 * Original practice passages written for FormSaathi (plain language, neutral topics).
 * Hindi passages avoid characters that need Alt codes in Krutidev/Remington (ऑ, ॉ, ऊ, ङ, ञ),
 * so every word can be typed on a normal keyboard in all three Hindi layouts.
 */
import type { TypingLanguage } from "./layouts";

export type Passage = { id: string; language: TypingLanguage; title: { en: string; hi: string }; text: string };

export const PASSAGES: Passage[] = [
  {
    id: "en-civic",
    language: "english",
    title: { en: "The local panchayat", hi: "स्थानीय पंचायत" },
    text: `Local government is the level of government that people meet most often in daily life. In villages, the gram panchayat looks after roads, drains, street lights, drinking water and the cleanliness of public places. In towns and cities, the same work is done by a municipal council or a municipal corporation. Members of these bodies are chosen by the people through regular elections, and seats are reserved so that women and weaker sections also have a voice. A gram sabha, which includes every adult voter of the village, meets a few times every year. In these meetings people can ask questions about the money that was spent, suggest new works and point out problems that need attention. When citizens take part in such meetings, the work of the panchayat becomes more open and more honest. Many useful schemes reach families through the panchayat office, such as help for building houses, pensions for the elderly and work under rural employment programmes. Records of these schemes are often displayed on a notice board so that anyone can read them. A good citizen keeps an eye on these records, pays local taxes on time and helps to keep the surroundings clean. Strong local government depends not only on elected members and officers but also on the daily interest of ordinary people.`,
  },
  {
    id: "en-environment",
    language: "english",
    title: { en: "Saving water at home", hi: "घर में पानी की बचत" },
    text: `Water is one of the most precious resources we have, yet much of it is wasted every day without anyone noticing. A tap that drips once every second can waste several thousand litres in a single year. Fixing leaking taps and pipes is therefore the simplest way to save water at home. While brushing teeth or shaving, the tap should be closed instead of being left open. Vegetables can be washed in a bowl, and the same water can later be used for plants. Washing machines and dishwashers should be run only when they are full. In many parts of the country, rain falls heavily for a few months and then the land stays dry for the rest of the year. Rainwater harvesting helps to store this water for later use. Water from rooftops can be collected in tanks or directed into pits that recharge the ground below. Over time, this raises the level of water in nearby wells and hand pumps. Farmers can also save a large amount of water by using drip irrigation, which delivers water directly to the roots of plants. Schools, offices and housing societies can put up simple notices to remind people to close taps properly. Saving water is not the duty of the government alone. Every small effort made by a family adds up and helps to secure water for the next generation.`,
  },
  {
    id: "en-geography",
    language: "english",
    title: { en: "Rivers of India", hi: "भारत की नदियाँ" },
    text: `India is a land of many rivers, and these rivers have shaped the life of its people for thousands of years. The rivers of the north, such as the Ganga, the Yamuna and the Brahmaputra, begin in the snow covered Himalayas. Because they are fed by melting snow as well as by rain, they carry water throughout the year. The wide plains through which they flow are among the most fertile lands in the world, and a large part of the population lives there. The rivers of the south, such as the Godavari, the Krishna and the Kaveri, begin in the Western Ghats and flow east into the Bay of Bengal. They depend mainly on the monsoon, so their flow is much lower in the dry months. The Narmada and the Tapi are different because they flow west into the Arabian Sea through narrow valleys. Many old towns and places of pilgrimage grew up on the banks of rivers, since water was needed for drinking, farming and trade. Today, dams built on these rivers provide water for irrigation and help to produce electricity. At the same time, rivers face serious problems from waste water, plastic and the overuse of their water. Keeping rivers clean and flowing is important for farmers, for wildlife and for the cities that depend on them.`,
  },
  {
    id: "en-technology",
    language: "english",
    title: { en: "Digital payments", hi: "डिजिटल भुगतान" },
    text: `In the last few years, the way people pay for goods and services has changed a great deal. A vegetable seller on the street, a small tea shop and a large store can all accept money directly through a mobile phone. The buyer simply scans a printed code, enters the amount and confirms the payment with a secret number. The money reaches the bank account of the seller within seconds. This system has reduced the need to carry cash and has made it easier to keep a record of spending. It is also useful for sending money to family members who live in another city. However, digital payments must be used with care. The secret number should never be shared with anyone, not even with a person who claims to be calling from a bank. To receive money, a person never needs to enter a secret number, so any such request is a sign of fraud. Messages that promise prizes, lottery wins or cash back in return for clicking on a link should be ignored. It is a good habit to check the name of the receiver before confirming any payment. If money is lost through fraud, the bank and the cyber crime helpline should be informed at once. With a little awareness, digital payments can be both convenient and safe for everyone.`,
  },
  {
    id: "en-health",
    language: "english",
    title: { en: "Sleep and study", hi: "नींद और पढ़ाई" },
    text: `Many students believe that studying late into the night is the best way to prepare for an examination. In reality, the brain needs proper sleep to store what has been learnt during the day. During deep sleep, new information is sorted and fixed in memory, which is why a topic often feels clearer the next morning. A young adult usually needs between seven and nine hours of sleep every night. Going to bed and waking up at the same time each day helps the body to settle into a steady rhythm. Bright screens, such as mobile phones and laptops, make it harder to fall asleep, so they should be kept away for some time before bed. Heavy meals and strong tea or coffee late in the evening can also disturb sleep. A short walk, light stretching or a few minutes of quiet reading can help the mind to relax. It is better to study in focused sessions of forty to fifty minutes with short breaks in between than to sit for long hours without a pause. Regular exercise, clean drinking water and simple home cooked food also support concentration. A student who is well rested makes fewer careless mistakes, reads questions more carefully and manages time better in the examination hall. Good sleep is not a waste of study time but a part of it.`,
  },
  {
    id: "en-transport",
    language: "english",
    title: { en: "Public transport", hi: "सार्वजनिक परिवहन" },
    text: `As towns and cities grow, the number of vehicles on their roads grows even faster. Traffic jams waste time and fuel, and the smoke from engines makes the air unhealthy to breathe. Good public transport is one of the most effective answers to these problems. A single bus can carry as many people as forty or fifty cars, while using far less road space and fuel. Metro rail systems in several cities now carry lakhs of passengers every day in comfort and at a steady speed. Suburban trains have served large cities for many decades and remain the lifeline of millions of workers. For public transport to succeed, it must be reliable, safe and easy to use. Buses and trains should run on time, stops should be well lit and clearly marked, and tickets should be simple to buy. Footpaths and cycle lanes near stations help people to complete the last part of their journey without a vehicle. Women, children, elderly people and persons with disabilities should be able to travel without fear or difficulty. Citizens also have a role to play. Standing in a queue, giving seats to those who need them and keeping vehicles clean make the journey better for everyone. When more people choose shared transport, roads become less crowded and cities become better places to live.`,
  },
  {
    id: "hi-civic",
    language: "hindi",
    title: { en: "Gram Sabha", hi: "ग्राम सभा" },
    text: `ग्राम सभा गाँव के लोकतंत्र की सबसे मजबूत कड़ी है। गाँव का हर वयस्क मतदाता इसका सदस्य होता है और साल में कई बार इसकी बैठक होती है। इन बैठकों में गाँव के विकास की योजनाएँ बनाई जाती हैं और पिछले कामों का हिसाब रखा जाता है। पंचायत को यह बताना होता है कि किस काम पर कितना पैसा खर्च हुआ और कौन सा काम अभी अधूरा है। यदि किसी सड़क, नाली या कुएँ का काम ठीक से नहीं हुआ है तो लोग बैठक में सवाल पूछ सकते हैं। गरीब परिवारों को आवास, पेंशन और रोजगार जैसी योजनाओं का लाभ देने के लिए नामों की सूची भी ग्राम सभा में पढ़ी जाती है। इससे गलत नाम जुड़ने की संभावना कम हो जाती है और सही व्यक्ति तक मदद पहुँचती है। महिलाओं की भागीदारी बढ़ाने के लिए कई जगह अलग महिला सभा भी आयोजित की जाती है। जब गाँव के लोग नियमित रूप से बैठकों में आते हैं और अपनी बात खुलकर रखते हैं, तब पंचायत का काम अधिक पारदर्शी बनता है। एक जागरूक नागरिक का कर्तव्य है कि वह केवल शिकायत न करे, बल्कि सुझाव भी दे और गाँव के सामूहिक कामों में हाथ बँटाए। मजबूत ग्राम सभा से ही मजबूत गाँव और मजबूत देश का निर्माण होता है।`,
  },
  {
    id: "hi-environment",
    language: "hindi",
    title: { en: "Trees and the environment", hi: "पेड़ और पर्यावरण" },
    text: `पेड़ हमारे जीवन के सच्चे साथी हैं। वे हमें साँस लेने के लिए स्वच्छ हवा, खाने के लिए फल और रहने के लिए छाया देते हैं। पेड़ों की जड़ें मिट्टी को बाँधकर रखती हैं, जिससे वर्षा के समय मिट्टी का कटाव कम होता है। जिन क्षेत्रों में घने जंगल होते हैं, वहाँ का तापमान आसपास के खुले क्षेत्रों की तुलना में कम रहता है। पेड़ अनेक पक्षियों, कीटों और जानवरों का घर भी हैं। शहरों में बढ़ती आबादी और नए निर्माण के कारण पेड़ों की संख्या लगातार घट रही है। इसका असर गर्मी, प्रदूषण और पानी की कमी के रूप में दिखाई देता है। इस समस्या का सरल उपाय है कि हम अधिक से अधिक पेड़ लगाएँ और उनकी देखभाल करें। केवल पौधा लगा देना पर्याप्त नहीं है, उसे कम से कम दो तीन साल तक पानी और सुरक्षा की आवश्यकता होती है। स्कूलों में बच्चे अपने नाम से एक पौधा गोद ले सकते हैं और उसकी बढ़त को देख सकते हैं। गाँवों में सड़क के किनारे और तालाबों के आसपास स्थानीय पेड़ लगाना सबसे अधिक लाभदायक होता है। नीम, पीपल, बरगद और आम जैसे पेड़ लंबे समय तक जीवित रहते हैं और अनेक जीवों को सहारा देते हैं। यदि हर परिवार हर वर्ष एक पेड़ लगाए और उसे बड़ा करे, तो आने वाली पीढ़ी को एक हरा भरा और स्वस्थ वातावरण मिलेगा।`,
  },
  {
    id: "hi-geography",
    language: "hindi",
    title: { en: "The Thar desert", hi: "थार का मरुस्थल" },
    text: `भारत के उत्तर पश्चिम भाग में थार का मरुस्थल स्थित है। इसका अधिकतर भाग राजस्थान में है और कुछ हिस्सा गुजरात, पंजाब और हरियाणा तक फैला हुआ है। यहाँ वर्षा बहुत कम होती है और गर्मियों में दिन का तापमान बहुत अधिक हो जाता है। रात के समय रेत जल्दी ठंडी हो जाती है, इसलिए दिन और रात के तापमान में बड़ा अंतर रहता है। हवा के साथ रेत के टीले अपनी जगह बदलते रहते हैं। इतनी कठिन परिस्थितियों के बाद भी यहाँ के लोगों ने जीवन जीने के अनोखे तरीके विकसित किए हैं। पानी को बचाने के लिए घरों के पास टाँके और गाँवों में बड़े तालाब बनाए जाते हैं, जिनमें वर्षा का पानी जमा किया जाता है। भेड़ और बकरी पालना यहाँ के लोगों का प्रमुख काम है, क्योंकि ये पशु कम पानी में भी जीवित रह सकते हैं। यहाँ के लोग बाजरा, मोठ और ग्वार जैसी फसलें उगाते हैं, जिन्हें कम पानी की आवश्यकता होती है। रंग बिरंगे कपड़े, लोक संगीत और मेले इस क्षेत्र की संस्कृति को खास बनाते हैं। नहरों के आने से कुछ क्षेत्रों में खेती बढ़ी है, परंतु पानी का सोच समझकर उपयोग करना आज भी उतना ही जरूरी है।`,
  },
  {
    id: "hi-technology",
    language: "hindi",
    title: { en: "Online safety", hi: "इंटरनेट पर सुरक्षा" },
    text: `आज मोबाइल फोन और इंटरनेट हमारे दैनिक जीवन का हिस्सा बन गए हैं। पढ़ाई, बैंक का काम, सरकारी फार्म भरना और परिवार से बात करना, सब कुछ अब फोन पर हो जाता है। इस सुविधा के साथ कुछ खतरे भी जुड़े हुए हैं, जिनसे बचने के लिए थोड़ी सावधानी जरूरी है। सबसे पहले, अपना पासवर्ड मजबूत रखें और उसे किसी के साथ साझा न करें। एक ही पासवर्ड को कई जगह प्रयोग करना ठीक नहीं है। बैंक या किसी कार्यालय के नाम से आने वाले संदेशों में दिए गए लिंक पर बिना जाँचे क्लिक न करें। कोई भी बैंक कभी फोन पर आपका गुप्त नंबर या एक बार वाला कोड नहीं माँगता है। यदि कोई व्यक्ति इनाम, नौकरी या लाटरी का लालच देकर पैसे माँगे, तो समझ लें कि यह धोखा है। अपने फोन में केवल भरोसेमंद स्रोत से ही ऐप डालें और समय समय पर उन्हें अपडेट करते रहें। सोशल मीडिया पर अपनी निजी जानकारी, जैसे घर का पता या पहचान पत्र की फोटो, सबके साथ साझा न करें। यदि किसी के साथ इंटरनेट पर धोखा हो जाए तो उसे तुरंत बैंक और साइबर अपराध की हेल्पलाइन पर इसकी सूचना देनी चाहिए। थोड़ी सी जागरूकता से हम इंटरनेट का पूरा लाभ सुरक्षित रूप से उठा सकते हैं।`,
  },
  {
    id: "hi-health",
    language: "hindi",
    title: { en: "Yoga and health", hi: "योग और स्वास्थ्य" },
    text: `अच्छा स्वास्थ्य जीवन की सबसे बड़ी पूँजी है। आजकल लोग घंटों तक कुर्सी पर बैठकर काम करते हैं और शारीरिक मेहनत बहुत कम हो गई है। इसका परिणाम मोटापा, कमर दर्द, तनाव और नींद की कमी जैसी समस्याओं के रूप में सामने आता है। योग इन समस्याओं से बचने का एक सरल और सस्ता उपाय है। इसके लिए किसी महंगे साधन की आवश्यकता नहीं होती, केवल एक दरी और थोड़ी सी खुली जगह काफी है। सुबह के समय खाली पेट योग करना सबसे अधिक लाभदायक माना जाता है। शुरुआत में आसान आसनों से करनी चाहिए और धीरे धीरे अभ्यास बढ़ाना चाहिए। प्राणायाम से साँस लेने की क्षमता बढ़ती है और मन शांत रहता है। परीक्षा की तैयारी कर रहे विद्यार्थियों के लिए यह विशेष रूप से उपयोगी है, क्योंकि इससे ध्यान लगाने की शक्ति बढ़ती है। योग के साथ संतुलित भोजन, पर्याप्त पानी और समय पर सोना भी उतना ही जरूरी है। यदि किसी व्यक्ति को कोई पुरानी बीमारी है, तो उसे नया अभ्यास शुरू करने से पहले डाक्टर की सलाह लेनी चाहिए। नियमित रूप से थोड़ा सा अभ्यास भी शरीर को लचीला और मन को प्रसन्न रखता है।`,
  },
  {
    id: "hi-library",
    language: "hindi",
    title: { en: "The village library", hi: "गाँव का पुस्तकालय" },
    text: `पुस्तकालय ज्ञान का भंडार होता है। जिस गाँव या कस्बे में एक अच्छा पुस्तकालय होता है, वहाँ के बच्चों और युवाओं को आगे बढ़ने के अधिक अवसर मिलते हैं। हर परिवार के लिए सभी किताबें और समाचार पत्र खरीदना संभव नहीं होता, परंतु पुस्तकालय में ये सब एक ही जगह पर मिल जाते हैं। प्रतियोगी परीक्षाओं की तैयारी कर रहे विद्यार्थी यहाँ शांत वातावरण में बैठकर घंटों पढ़ाई कर सकते हैं। कई पंचायतों ने अपने भवनों में छोटे पुस्तकालय शुरू किए हैं, जहाँ सामान्य ज्ञान, इतिहास, गणित और भाषा की किताबें रखी गई हैं। कुछ स्थानों पर कंप्यूटर और इंटरनेट की सुविधा भी दी गई है, ताकि विद्यार्थी फार्म भर सकें और नई जानकारी पा सकें। पुस्तकालय को अच्छी तरह चलाने में गाँव के लोगों की भूमिका भी महत्वपूर्ण है। पढ़ी हुई पुरानी किताबें दान करके और समय पर किताबें वापस लौटाकर हर व्यक्ति इसमें सहयोग कर सकता है। पुस्तकालय में शोर न करना, किताबों के पन्ने न मोड़ना और उन पर कुछ न लिखना भी अच्छे पाठक की पहचान है। जब बच्चे बचपन से ही किताबों से दोस्ती कर लेते हैं, तो पढ़ने की यह आदत जीवन भर उनका साथ देती है।`,
  },
];

export const passagesFor = (language: TypingLanguage) => PASSAGES.filter((p) => p.language === language);
