import type { Article } from "./types";

/**
 * Blog articles, batch A: photo size, PDF size, signature, cm to pixels, formats, photos to PDF,
 * photo rejection and passport photo sheets. Exam rules are never stated here: readers are always
 * sent to the official notification or the exam's page on this site.
 */
export const articlesA: Article[] = [
  {
    slug: "how-to-reduce-photo-size-in-kb",
    tools: ["compress-image", "resize-image", "photo-resize"],
    published: "2026-10-15",
    en: {
      title: "How to Reduce Photo Size in KB for Online Forms (Free, No Upload)",
      description:
        "Reduce a photo's size in KB on your phone for any online form. Learn why photos are so heavy, how to hit a KB target and what to do when it won't fit.",
      intro:
        "A phone photo is often 2 to 5 MB, while an online form may accept only a few dozen KB. This guide shows how to bring a photo under a KB limit without making it look bad, using free tools that run in your browser. Your photo is never uploaded to any server.",
      sections: [
        {
          h: "Why is my photo so many KB?",
          p: [
            "The size of a photo file depends on two things: how many pixels it has and how much detail each part holds. A modern phone camera saves 12 megapixels or more, which is far more than an online form needs. A photo of 4000 × 3000 pixels can easily be 3 MB, even though the form will only show it in a small box.",
            "Busy backgrounds, noise from low light and sharp patterns also add KB, because the file has to store all that detail. A plain light wall behind you gives a smaller file than a crowded room.",
          ],
        },
        {
          h: "Two ways to make a photo smaller: KB and pixels",
          p: [
            "Compression keeps the same pixel size but stores the picture more efficiently, at a slightly lower quality. Resizing reduces the number of pixels. Both lower the KB, and for very small limits you usually need both.",
            "If the form gives an exact pixel size, resize to that first. If it only gives a KB limit, try compression alone. If compression cannot reach the target, the photo has too many pixels for the limit and needs resizing too.",
          ],
        },
        {
          h: "Steps: reduce photo size to a target KB",
          p: ["Open the Compress image tool on this site and follow these steps. They work the same on a phone or a computer."],
          list: [
            "Tap “Choose image” (or “Take photo” on a phone) and pick your photo.",
            "Keep “Target size (KB)” selected and type the maximum size in “Maximum size in KB”, or tap a ready size such as 20, 50, 100, 200 or 500 KB.",
            "Tap “Compress” and check the “Before → after” line under the photo.",
            "If the result looks fine, tap “Download”.",
          ],
          ordered: true,
        },
        {
          h: "When compression is not enough",
          p: [
            "If the tool says it could not reach your KB target, it shows the smallest size it managed to make. That means there are too many pixels or too much detail for the limit. Open the Crop tab and cut away empty background, or open the Resize tab, pick “By size” and type a smaller width with “Keep proportions” ticked. Then return to the Compress tab and tap “Compress” again.",
            "If your photo is a PNG, the KB can stay high because PNG has no quality setting. Tap “Use JPG”: for photos, JPG files are usually many times smaller and look almost the same.",
          ],
        },
        {
          h: "Making a photo for an exam or job form",
          p: [
            "Exam and job forms usually set a pixel size, a minimum and maximum KB and a format all at once. Many forms ask for a passport-size photo somewhere in the range of a few dozen KB, but the exact numbers differ from form to form, so always read the official notification for yours.",
            "For these forms, the Photo resizer is easier. Open your exam's page on this site and the size, KB range and format are filled in for you, or open “Size settings” to enter them yourself. Tap “Make Photo” and a checklist shows whether the format, KB, dimensions and background look right before you download.",
          ],
        },
        {
          h: "Tips for a small file that still looks good",
          p: ["A few habits make it much easier to reach a low KB without a blurry face."],
          list: [
            "Take the photo in daylight; low light adds grainy noise that costs KB.",
            "Stand in front of a plain white or light wall.",
            "Crop close to the head and shoulders instead of keeping the whole room.",
            "Compress once from the original instead of compressing an already compressed copy again and again.",
            "Zoom in after compressing and check that the eyes and face edges are still clear.",
          ],
        },
        {
          h: "Is it safe to compress ID photos online?",
          p: [
            "With this site, nothing is uploaded. The photo is opened, resized and compressed inside your own browser using your phone's or computer's processor, and the only copy that leaves the tool is the file you download. That makes it safe for ID cards, certificates and personal photos, and it keeps working even on a slow connection once the page has loaded.",
          ],
        },
      ],
      faq: [
        {
          q: "How do I reduce a photo to exactly 50 KB?",
          a: "Type 50 in “Maximum size in KB” and tap “Compress”. The tool finds the best quality that stays under 50 KB, so the result is usually a little below the number, which is what forms accept.",
        },
        {
          q: "Will reducing KB make my photo blurry?",
          a: "At normal targets the change is hard to see. Very small targets on large photos can look blocky. Crop or resize first so fewer pixels need to fit, and the face stays clearer.",
        },
        {
          q: "My form also has a minimum KB. What should I do?",
          a: "Use the Photo resizer and enter both values in “Size settings”, or open your exam's page on this site. If a very plain photo comes out below the minimum, the tool adds hidden padding without changing how it looks.",
        },
        {
          q: "Can I reduce the KB of a photo on my phone without an app?",
          a: "Yes. Everything runs in the phone's browser. Open the tool, tap “Choose image” or “Take photo”, compress and download. No app or sign-up is needed.",
        },
        {
          q: "Is my photo uploaded anywhere?",
          a: "No. The photo is processed on your own device and never sent to a server. Only you decide where the downloaded file goes.",
        },
      ],
    },
    hi: {
      title: "फोटो का साइज़ KB में कैसे कम करें (फ्री, बिना अपलोड)",
      description:
        "ऑनलाइन फ़ॉर्म के लिए फोटो का KB अपने फ़ोन पर ही कम करें। जानें फोटो इतनी भारी क्यों होती है, तय KB तक कैसे लाएँ और न हो तो क्या करें। फोटो कहीं अपलोड नहीं होती।",
      intro:
        "फ़ोन से खींची फोटो अक्सर 2 से 5 MB की होती है, जबकि ऑनलाइन फ़ॉर्म कुछ ही KB की फोटो लेता है। इस गाइड में जानिए कि फोटो को बिना खराब किए KB लिमिट के अंदर कैसे लाएँ। सारे टूल आपके ब्राउज़र में ही चलते हैं, फोटो किसी सर्वर पर नहीं जाती।",
      sections: [
        {
          h: "मेरी फोटो इतने ज़्यादा KB की क्यों है?",
          p: [
            "फोटो का साइज़ दो बातों पर टिका है: उसमें कितने पिक्सल हैं और हर हिस्से में कितनी बारीकी है। आजकल के फ़ोन 12 मेगापिक्सल या उससे ज़्यादा की फोटो खींचते हैं, जो फ़ॉर्म की ज़रूरत से कहीं ज़्यादा है। 4000 × 3000 पिक्सल की फोटो आराम से 3 MB की हो जाती है, जबकि फ़ॉर्म में वह एक छोटे से डिब्बे में दिखती है।",
            "भरा-भरा बैकग्राउंड, कम रोशनी में आने वाले दाने और बारीक डिज़ाइन भी KB बढ़ाते हैं। सादी हल्की दीवार के आगे खींची फोटो छोटी फ़ाइल बनाती है।",
          ],
        },
        {
          h: "फोटो छोटी करने के दो तरीके: KB और पिक्सल",
          p: [
            "कंप्रेस करने में पिक्सल वही रहते हैं, बस फोटो थोड़ी कम क्वालिटी में ज़्यादा समझदारी से सेव होती है। रिसाइज़ करने में पिक्सल कम होते हैं। दोनों से KB घटता है, और बहुत कम KB चाहिए तो अक्सर दोनों करने पड़ते हैं।",
            "फ़ॉर्म में पिक्सल साइज़ दिया हो तो पहले वही साइज़ करें। सिर्फ़ KB दिया हो तो पहले बस कंप्रेस करके देखें। कंप्रेस से बात न बने तो समझिए पिक्सल ज़्यादा हैं, और रिसाइज़ भी करना होगा।",
          ],
        },
        {
          h: "तरीका: फोटो को तय KB तक लाएँ",
          p: ["इस साइट पर “इमेज कंप्रेस करें” टूल खोलें और ये कदम अपनाएँ। फ़ोन और कंप्यूटर दोनों पर यही तरीका है।"],
          list: [
            "“फ़ोटो चुनें” दबाएँ (फ़ोन पर “फ़ोटो खींचें” भी है) और अपनी फोटो लें।",
            "“KB साइज़” चुना रहने दें और “ज़्यादा से ज़्यादा KB” में नंबर लिखें, या 20, 50, 100, 200 या 500 KB वाला तैयार बटन दबाएँ।",
            "“KB कम करें” दबाएँ और फोटो के नीचे “पहले → अब” वाली लाइन देखें।",
            "फोटो ठीक लगे तो “डाउनलोड” दबाएँ।",
          ],
          ordered: true,
        },
        {
          h: "सिर्फ़ कंप्रेस से काम न बने तो",
          p: [
            "अगर टूल बताए कि आपका KB नहीं आ पाया, तो वह सबसे छोटा साइज़ दिखाता है जो बन सका। इसका मतलब है कि फोटो में पिक्सल या बारीकी उस लिमिट के लिए ज़्यादा है। “क्रॉप” टैब में फालतू बैकग्राउंड काट दें, या “साइज़” टैब में “साइज़ डालकर” चुनकर छोटी चौड़ाई लिखें और “अनुपात वही रखें” पर टिक रहने दें। फिर “KB कम” टैब में जाकर दोबारा “KB कम करें” दबाएँ।",
            "फोटो PNG हो तो KB ज़्यादा रह सकता है, क्योंकि PNG में क्वालिटी सेटिंग नहीं होती। “JPG इस्तेमाल करें” दबाएँ, फोटो के लिए JPG फ़ाइल कई गुना छोटी बनती है और दिखती लगभग वैसी ही है।",
          ],
        },
        {
          h: "परीक्षा या नौकरी के फ़ॉर्म के लिए फोटो",
          p: [
            "परीक्षा और नौकरी के फ़ॉर्म आमतौर पर पिक्सल साइज़, कम से कम और ज़्यादा से ज़्यादा KB और फ़ॉर्मेट, तीनों एक साथ माँगते हैं। कई फ़ॉर्म कुछ दर्जन KB की पासपोर्ट साइज़ फोटो माँगते हैं, पर सही नंबर हर फ़ॉर्म में अलग होते हैं, इसलिए अपने फ़ॉर्म का ऑफ़िशियल नोटिफ़िकेशन ज़रूर पढ़ें।",
            "ऐसे फ़ॉर्म के लिए “फोटो रिसाइज़र” ज़्यादा आसान है। इस साइट पर अपनी परीक्षा का पेज खोलें तो साइज़, KB और फ़ॉर्मेट पहले से भरे मिलेंगे, या “साइज़ सेटिंग” खोलकर खुद भरें। “फोटो तैयार करें” दबाएँ, फिर चेकलिस्ट में देखें कि फ़ॉर्मेट, KB, साइज़ और बैकग्राउंड ठीक हैं या नहीं।",
          ],
        },
        {
          h: "छोटी फ़ाइल, फिर भी साफ़ फोटो: काम की बातें",
          p: ["कुछ आदतें अपनाने से कम KB में भी चेहरा साफ़ रहता है।"],
          list: [
            "दिन की रोशनी में फोटो खींचें, कम रोशनी के दाने KB बढ़ाते हैं।",
            "सादी सफ़ेद या हल्के रंग की दीवार के आगे खड़े हों।",
            "पूरा कमरा रखने के बजाय सिर और कंधों के पास से क्रॉप करें।",
            "असली फोटो से एक बार कंप्रेस करें, पहले से कंप्रेस हुई फोटो को बार-बार कंप्रेस न करें।",
            "कंप्रेस के बाद ज़ूम करके देखें कि आँखें और चेहरे के किनारे साफ़ हैं।",
          ],
        },
        {
          h: "क्या ID वाली फोटो ऑनलाइन कंप्रेस करना सुरक्षित है?",
          p: [
            "इस साइट पर कुछ भी अपलोड नहीं होता। फोटो आपके अपने ब्राउज़र में खुलती है और आपके फ़ोन या कंप्यूटर पर ही छोटी होती है। टूल से बाहर सिर्फ़ वही फ़ाइल जाती है जो आप डाउनलोड करते हैं। इसलिए आधार, सर्टिफ़िकेट या निजी फोटो के लिए भी यह सुरक्षित है, और पेज एक बार खुल जाए तो धीमे नेट पर भी चलता है।",
          ],
        },
      ],
      faq: [
        {
          q: "फोटो को ठीक 50 KB का कैसे करें?",
          a: "“ज़्यादा से ज़्यादा KB” में 50 लिखें और “KB कम करें” दबाएँ। टूल 50 KB के अंदर सबसे अच्छी क्वालिटी ढूँढता है, इसलिए फ़ाइल अक्सर 50 से थोड़ी कम बनती है, और फ़ॉर्म यही मानते हैं।",
        },
        {
          q: "KB कम करने से फोटो धुंधली तो नहीं होगी?",
          a: "सामान्य साइज़ पर फ़र्क मुश्किल से दिखता है। बड़ी फोटो को बहुत कम KB में लाने पर किनारे चौकोर-से दिख सकते हैं। पहले क्रॉप या रिसाइज़ करें, तो चेहरा ज़्यादा साफ़ रहेगा।",
        },
        {
          q: "मेरे फ़ॉर्म में कम से कम KB भी लिखा है, क्या करूँ?",
          a: "“फोटो रिसाइज़र” में “साइज़ सेटिंग” खोलकर दोनों नंबर भरें, या इस साइट पर अपनी परीक्षा का पेज खोलें। बहुत सादी फोटो न्यूनतम से छोटी बने तो टूल छुपी पैडिंग जोड़ देता है, फोटो दिखने में नहीं बदलती।",
        },
        {
          q: "क्या बिना ऐप के फ़ोन पर फोटो का KB कम हो सकता है?",
          a: "हाँ। सब कुछ फ़ोन के ब्राउज़र में चलता है। टूल खोलें, “फ़ोटो चुनें” या “फ़ोटो खींचें” दबाएँ, KB कम करें और डाउनलोड करें। न ऐप चाहिए, न लॉगिन।",
        },
        {
          q: "क्या मेरी फोटो कहीं अपलोड होती है?",
          a: "नहीं। फोटो आपके अपने डिवाइस पर ही बदलती है और किसी सर्वर पर नहीं जाती। डाउनलोड हुई फ़ाइल कहाँ भेजनी है, यह सिर्फ़ आप तय करते हैं।",
        },
      ],
    },
  },
  {
    slug: "how-to-compress-pdf-size",
    tools: ["pdf-compress", "image-to-pdf"],
    published: "2026-10-15",
    en: {
      title: "How to Compress PDF Size to 100, 200 or 500 KB Online",
      description:
        "Shrink a PDF to 100, 200 or 500 KB for an online form, right in your browser. See why scanned PDFs are big, how to compress them and keep the text readable.",
      intro:
        "Scanned marksheets and certificates often come out as PDFs of several MB, while upload boxes accept far less. Here is how to compress a PDF to a KB target in your browser, what happens to the pages, and how to keep them readable. The file stays on your device the whole time.",
      sections: [
        {
          h: "Why are scanned PDFs so large?",
          p: [
            "A PDF made by a scanner or a scanning app is really a set of photos, one per page. If the scanner works at a high resolution, or the app saves each page in high quality, every page can weigh hundreds of KB. Ten pages can quickly reach several MB.",
            "PDFs made directly from a computer, such as a typed letter saved as PDF, are usually small, because the text is stored as text rather than as a picture. Those rarely need compressing.",
          ],
        },
        {
          h: "Steps: compress a PDF to a KB target",
          p: ["Open the Compress PDF to KB tool on this site and follow these steps."],
          list: [
            "Tap “Choose PDF” and pick the file.",
            "Under “Target size”, tap 100, 200, 300 or 500 KB, or type your own number in “Custom KB”.",
            "Tap “Compress PDF” and wait while each page is processed. You can see the page count as it works.",
            "Open the result, check that the text is still readable, then tap “Download PDF”.",
          ],
          ordered: true,
        },
        {
          h: "What the tool does to your pages",
          p: [
            "To reach the size, each page is turned into an image and saved again at a lower quality. The pages look the same, but text becomes part of the picture, so you can no longer select or copy it. That is fine for form uploads, where the reader only needs to see the page. Keep your original PDF for anything you want to edit later.",
            "If your PDF is already under the target, it is kept exactly as it is, with no quality lost. You will see a message saying so.",
          ],
        },
        {
          h: "If the PDF still won't fit",
          p: ["Some long or very detailed PDFs cannot fit a tiny limit even at the lowest quality. In that case the tool tells you it could not get under the target. Try these in order:"],
          list: [
            "Choose a slightly larger target if the form allows it.",
            "Remove pages the form does not need, such as blank backs of pages.",
            "Scan again at a lower resolution; for upload, the text only needs to be clearly readable on screen.",
            "Split the content into separate uploads if the form has more than one upload box.",
          ],
        },
        {
          h: "Making a small PDF from photos in the first place",
          p: [
            "If you photographed the documents with your phone, you can skip the scanner app and use the Images to PDF tool. Tap “Choose photos”, put the pages in order with ↑ and ↓, choose “A4” or “Same as photo” as the Page size, then tap “Make PDF” and “Download PDF”. Photos are re-saved at a sensible size, so the PDF is usually much smaller than one from a high-quality scan.",
            "If that PDF is still over the limit, open it in Compress PDF to KB and pick your target.",
          ],
        },
        {
          h: "What size should my PDF be?",
          p: [
            "There is no single answer. Forms set their own limits for each document, and they change between notifications. Many forms list limits in the range of a few hundred KB per document, but always read the official notification or the help text next to the upload box for your exact limit. Aim to stay a little under it, not exactly at it.",
          ],
        },
        {
          h: "Privacy: your documents stay on your device",
          p: [
            "Marksheets, caste certificates and ID cards hold personal details. This tool reads and rebuilds the PDF inside your own browser, so the file is never uploaded to a server. Nothing is stored online, and the only copy is the one you download.",
          ],
        },
      ],
      faq: [
        {
          q: "Why can't I select text in the compressed PDF?",
          a: "To reach the KB size, pages are turned into images. The text is still visible but is now part of the picture. Keep your original PDF if you need to copy text or edit it.",
        },
        {
          q: "My PDF won't open in the tool. Why?",
          a: "It may be damaged or protected with a password. Download an unlocked copy, or print it to a new PDF from your PDF viewer, then try again.",
        },
        {
          q: "Can I compress a PDF on my phone?",
          a: "Yes. The tool works in the phone's browser. Long PDFs take a little longer on older phones, because every page is processed on the device itself.",
        },
        {
          q: "Does compressing reduce the number of pages?",
          a: "No. Every page is kept in the same order. Only the size of each page's image is reduced.",
        },
        {
          q: "Is it safe for certificates?",
          a: "Yes. The PDF never leaves your device. It is processed in the browser and nothing is sent to any server.",
        },
      ],
    },
    hi: {
      title: "PDF का साइज़ कम कैसे करें: 100, 200 या 500 KB तक",
      description:
        "ऑनलाइन फ़ॉर्म के लिए PDF को 100, 200 या 500 KB तक अपने ब्राउज़र में छोटा करें। जानें स्कैन की PDF बड़ी क्यों होती है और अक्षर पढ़ने लायक कैसे रखें।",
      intro:
        "स्कैन की हुई मार्कशीट और सर्टिफ़िकेट की PDF अक्सर कई MB की बनती है, जबकि फ़ॉर्म इससे बहुत कम लेता है। यहाँ जानिए PDF को तय KB तक कैसे लाएँ, पेजों के साथ क्या होता है और अक्षर साफ़ कैसे रखें। पूरे समय फ़ाइल आपके ही डिवाइस पर रहती है।",
      sections: [
        {
          h: "स्कैन की PDF इतनी बड़ी क्यों होती है?",
          p: [
            "स्कैनर या स्कैन वाले ऐप से बनी PDF असल में फोटो का एक सेट होती है, हर पेज की एक फोटो। स्कैनर ज़्यादा रेज़ोल्यूशन पर चले या ऐप हर पेज ऊँची क्वालिटी में सेव करे, तो एक-एक पेज सैकड़ों KB का हो जाता है। दस पेज मिलकर कई MB बन जाते हैं।",
            "कंप्यूटर पर सीधे बनी PDF, जैसे टाइप किया लेटर, आमतौर पर छोटी होती है, क्योंकि उसमें अक्षर फोटो की तरह नहीं, टेक्स्ट की तरह रखे जाते हैं। ऐसी PDF को अक्सर कंप्रेस करने की ज़रूरत नहीं पड़ती।",
          ],
        },
        {
          h: "तरीका: PDF को तय KB तक लाएँ",
          p: ["इस साइट पर “PDF को KB में कंप्रेस करें” टूल खोलें और ये कदम अपनाएँ।"],
          list: [
            "“PDF चुनें” दबाकर फ़ाइल लें।",
            "“लक्ष्य साइज़” में 100, 200, 300 या 500 KB दबाएँ, या “अपना KB” में खुद नंबर लिखें।",
            "“PDF कंप्रेस करें” दबाएँ और हर पेज पूरा होने तक रुकें। काम के साथ पेज की गिनती दिखती रहती है।",
            "नतीजा खोलकर देखें कि अक्षर पढ़ने में आ रहे हैं, फिर “PDF डाउनलोड करें” दबाएँ।",
          ],
          ordered: true,
        },
        {
          h: "टूल आपके पेजों के साथ क्या करता है",
          p: [
            "साइज़ घटाने के लिए हर पेज को इमेज बनाकर थोड़ी कम क्वालिटी में दोबारा सेव किया जाता है। पेज दिखने में वैसे ही रहते हैं, पर अक्षर तस्वीर का हिस्सा बन जाते हैं, इसलिए उन्हें सेलेक्ट या कॉपी नहीं कर सकते। फ़ॉर्म में अपलोड के लिए इससे कोई दिक्कत नहीं, क्योंकि वहाँ पेज बस देखा जाता है। आगे बदलाव करने के लिए असली PDF संभालकर रखें।",
            "अगर आपकी PDF पहले से तय साइज़ से छोटी है, तो उसे बिल्कुल वैसे ही रखा जाता है, क्वालिटी में कोई कमी नहीं होती। टूल यह बात मैसेज में बता देता है।",
          ],
        },
        {
          h: "फिर भी PDF छोटी न हो तो",
          p: ["कुछ लंबी या बहुत बारीक PDF सबसे कम क्वालिटी पर भी बहुत छोटी लिमिट में नहीं आतीं। तब टूल बताता है कि साइज़ नहीं आ पाया। ये उपाय क्रम से आज़माएँ:"],
          list: [
            "फ़ॉर्म इजाज़त दे तो थोड़ा बड़ा साइज़ चुनें।",
            "जो पेज ज़रूरी नहीं, जैसे पीछे के खाली पेज, उन्हें हटा दें।",
            "कम रेज़ोल्यूशन पर दोबारा स्कैन करें, अपलोड के लिए बस इतना चाहिए कि स्क्रीन पर अक्षर साफ़ पढ़ें।",
            "फ़ॉर्म में एक से ज़्यादा अपलोड बॉक्स हों तो कागज़ों को अलग-अलग फ़ाइलों में बाँट दें।",
          ],
        },
        {
          h: "शुरू से ही फोटो से छोटी PDF बनाएँ",
          p: [
            "अगर कागज़ों की फोटो फ़ोन से खींची है, तो स्कैन ऐप की जगह “फोटो से PDF बनाएँ” टूल इस्तेमाल करें। “फोटो चुनें” दबाएँ, ↑ और ↓ से पेजों का क्रम ठीक करें, “पेज साइज़” में “A4” या “फोटो जितना” चुनें, फिर “PDF बनाएँ” और “PDF डाउनलोड करें” दबाएँ। फोटो पहले से ठीक-ठाक साइज़ में सेव होती हैं, इसलिए यह PDF अक्सर ऊँची क्वालिटी के स्कैन से काफ़ी छोटी बनती है।",
            "यह PDF भी लिमिट से बड़ी हो, तो उसे “PDF को KB में कंप्रेस करें” में खोलकर अपना साइज़ चुन लें।",
          ],
        },
        {
          h: "मेरी PDF कितने KB की होनी चाहिए?",
          p: [
            "इसका एक जवाब नहीं है। हर फ़ॉर्म हर कागज़ के लिए अपनी लिमिट रखता है, और नए नोटिफ़िकेशन में यह बदल भी सकती है। कई फ़ॉर्म में यह कुछ सौ KB के आसपास होती है, पर अपनी सही लिमिट ऑफ़िशियल नोटिफ़िकेशन या अपलोड बॉक्स के पास लिखी जानकारी से ही लें। फ़ाइल को लिमिट से थोड़ा नीचे रखें, ठीक उसी नंबर पर नहीं।",
          ],
        },
        {
          h: "प्राइवेसी: आपके कागज़ आपके डिवाइस पर ही रहते हैं",
          p: [
            "मार्कशीट, जाति प्रमाण पत्र और ID कार्ड में निजी जानकारी होती है। यह टूल PDF को आपके अपने ब्राउज़र में पढ़कर दोबारा बनाता है, फ़ाइल किसी सर्वर पर अपलोड नहीं होती। ऑनलाइन कुछ भी सेव नहीं होता, आपके पास बस वही कॉपी होती है जो आप डाउनलोड करते हैं।",
          ],
        },
      ],
      faq: [
        {
          q: "कंप्रेस की हुई PDF में टेक्स्ट सेलेक्ट क्यों नहीं होता?",
          a: "KB घटाने के लिए पेज इमेज में बदले जाते हैं। अक्षर दिखते रहते हैं पर अब तस्वीर का हिस्सा हैं। टेक्स्ट कॉपी या बदलना हो तो असली PDF रखें।",
        },
        {
          q: "मेरी PDF टूल में नहीं खुल रही, क्यों?",
          a: "फ़ाइल खराब हो सकती है या उस पर पासवर्ड लगा हो सकता है। बिना पासवर्ड वाली कॉपी लें, या PDF व्यूअर से उसे नई PDF में प्रिंट करके दोबारा आज़माएँ।",
        },
        {
          q: "क्या फ़ोन पर PDF कंप्रेस हो सकती है?",
          a: "हाँ, टूल फ़ोन के ब्राउज़र में चलता है। पुराने फ़ोन पर लंबी PDF में थोड़ा ज़्यादा समय लगता है, क्योंकि हर पेज फ़ोन पर ही बनता है।",
        },
        {
          q: "क्या कंप्रेस करने से पेज कम हो जाते हैं?",
          a: "नहीं। सारे पेज उसी क्रम में रहते हैं, बस हर पेज की इमेज का साइज़ घटता है।",
        },
        {
          q: "क्या सर्टिफ़िकेट के लिए यह सुरक्षित है?",
          a: "हाँ। PDF आपके डिवाइस से बाहर नहीं जाती। सब कुछ ब्राउज़र में होता है और किसी सर्वर पर कुछ नहीं भेजा जाता।",
        },
      ],
    },
  },
  {
    slug: "signature-size-for-online-form",
    tools: ["signature-resize", "crop-image"],
    published: "2026-10-15",
    en: {
      title: "Signature Size for Online Form: How to Scan, Crop and Resize",
      description:
        "Make your signature upload-ready for an online form: sign, photograph, clean the background and fit the KB and pixel size, all in your browser with no upload.",
      intro:
        "The signature box on an online form is small, but it causes a lot of rejected uploads: grey paper, faint ink, too much empty space or a file that is too heavy. This guide walks through making a clean signature image from a phone photo and fitting it to the size your form asks for. Everything happens in your browser.",
      sections: [
        {
          h: "What forms usually check in a signature",
          p: [
            "Most forms look at the file format, the KB size and often the pixel width and height. Some also ask for a particular ink colour or say the signature must be on white paper. The exact rules differ from form to form, so read the official notification for yours before you start. On this site you can open your exam's page and the signature rules from its data are filled in for you.",
            "Many forms ask for a signature file of only a few KB to a few dozen KB, and a wide, short shape. Treat those as typical ranges only, not as the rule for your form.",
          ],
        },
        {
          h: "Before you take the photo",
          p: ["A good starting photo saves you from fighting with settings later."],
          list: [
            "Sign on plain white paper with a dark pen that writes smoothly. Avoid pencil and very light gel ink.",
            "Sign at your normal size, inside an area roughly the shape of the box on the form.",
            "Photograph it in daylight, holding the phone straight above the paper so there is no slant.",
            "Keep your hand and the phone's shadow off the paper.",
          ],
        },
        {
          h: "Steps: make a clean signature with the Signature resizer",
          p: ["Open the Signature resizer on this site, or your exam's signature page, and follow these steps."],
          list: [
            "Tap “Take photo” or “Choose photo”.",
            "Tap “Auto-crop to signature”, or drag the box around it yourself.",
            "Keep “Clean background” on, pick Black or Blue under ink colour, and move “Darkness” if the lines look too thin or too thick.",
            "If you are not on an exam page, open “Size settings” and enter the width, height and KB from your form.",
            "Tap “Make Signature”, read the checklist, then tap “Download”.",
          ],
          ordered: true,
        },
        {
          h: "What “Clean background” does",
          p: [
            "A phone photo of white paper is rarely white. It is usually light grey, with shadows and uneven light. “Clean background” turns that paper white and makes the ink solid, so the signature looks like it was scanned.",
            "If thin strokes disappear, lower the Darkness value. If grey patches or dirt remain, raise it. The aim is a crisp signature on a pure white background, with nothing else in the frame.",
          ],
        },
        {
          h: "Cropping: not too tight, not too loose",
          p: [
            "Leave a small margin of white around the signature so no stroke touches the edge. Too much empty space makes the signature tiny when the form shrinks it to fit the box, and it wastes KB.",
            "If you only need to crop and not clean the image, the Crop image tool works too. Pick “Free” or type a ratio under “Custom”, drag the box, and tap “Crop”. For a form upload with a KB limit, the Signature resizer is still the better choice because it also handles the size.",
          ],
        },
        {
          h: "When the signature will not fit the KB limit",
          p: [
            "If the tool says it could not get under the KB limit, the crop is probably large compared with the KB allowed. Crop closer to the signature, or use “Change sizes” for fewer pixels if the form's rules allow it, then tap “Make Signature” again. A cleaner background also helps, because plain white areas take very few KB.",
          ],
        },
      ],
      faq: [
        {
          q: "Should I sign in black or blue ink?",
          a: "Use whatever your form's notification asks for. If it says nothing, a dark black or blue pen with a smooth, thick line gives the cleanest result. The tool keeps the ink colour you pick.",
        },
        {
          q: "Can I draw my signature on the phone screen instead?",
          a: "The Signature resizer works from a photo of a real signature on paper. Many forms expect your actual handwritten signature, so sign on paper and photograph it.",
        },
        {
          q: "My signature looks broken after cleaning. Why?",
          a: "The Darkness value is too high for a light pen, so faint parts are being turned white. Lower it, or sign again with a darker pen.",
        },
        {
          q: "What size should my signature be?",
          a: "Check your form's official notification or open your exam's page on this site. Sizes and KB limits differ between forms, so there is no single correct size.",
        },
        {
          q: "Is my signature stored anywhere?",
          a: "No. Cleaning and resizing happen in your browser. The signature exists only in the file you download.",
        },
      ],
    },
    hi: {
      title: "ऑनलाइन फ़ॉर्म के लिए सिग्नेचर का साइज़: स्कैन, क्रॉप और रिसाइज़ कैसे करें",
      description:
        "ऑनलाइन फ़ॉर्म के लिए सिग्नेचर तैयार करें: कागज़ पर साइन करें, फोटो लें, बैकग्राउंड साफ़ करें और KB व पिक्सल साइज़ ठीक करें। सब ब्राउज़र में, बिना अपलोड।",
      intro:
        "फ़ॉर्म में सिग्नेचर का डिब्बा छोटा होता है, पर सबसे ज़्यादा गड़बड़ यहीं होती है: भूरा कागज़, हल्की स्याही, बहुत खाली जगह या भारी फ़ाइल। इस गाइड में जानिए फ़ोन की फोटो से साफ़ सिग्नेचर कैसे बनाएँ और फ़ॉर्म के साइज़ में कैसे लाएँ। सारा काम आपके ब्राउज़र में होता है।",
      sections: [
        {
          h: "फ़ॉर्म सिग्नेचर में आमतौर पर क्या देखते हैं",
          p: [
            "ज़्यादातर फ़ॉर्म फ़ाइल का फ़ॉर्मेट, KB और अक्सर पिक्सल में चौड़ाई-ऊँचाई जाँचते हैं। कुछ स्याही का रंग या सफ़ेद कागज़ पर साइन भी माँगते हैं। ये नियम हर फ़ॉर्म में अलग होते हैं, इसलिए शुरू करने से पहले अपने फ़ॉर्म का ऑफ़िशियल नोटिफ़िकेशन पढ़ें। इस साइट पर अपनी परीक्षा का पेज खोलें तो सिग्नेचर के नियम पहले से भरे मिलते हैं।",
            "कई फ़ॉर्म कुछ KB से लेकर कुछ दर्जन KB तक की, चौड़ी और कम ऊँचाई वाली सिग्नेचर फ़ाइल माँगते हैं। इसे सिर्फ़ आम अंदाज़ा मानें, अपने फ़ॉर्म का नियम नहीं।",
          ],
        },
        {
          h: "फोटो खींचने से पहले",
          p: ["शुरुआत में अच्छी फोटो हो तो बाद में सेटिंग से जूझना नहीं पड़ता।"],
          list: [
            "सादे सफ़ेद कागज़ पर गहरे रंग के ऐसे पेन से साइन करें जो साफ़ चले। पेंसिल और बहुत हल्की जेल पेन से बचें।",
            "अपने आम साइज़ में साइन करें, लगभग फ़ॉर्म वाले डिब्बे जैसे आकार की जगह में।",
            "दिन की रोशनी में फोटो लें, फ़ोन को कागज़ के ठीक ऊपर सीधा रखें ताकि सिग्नेचर तिरछा न दिखे।",
            "हाथ और फ़ोन की परछाईं कागज़ पर न पड़ने दें।",
          ],
        },
        {
          h: "तरीका: “सिग्नेचर रिसाइज़र” से साफ़ सिग्नेचर बनाएँ",
          p: ["इस साइट पर “सिग्नेचर रिसाइज़र” खोलें, या अपनी परीक्षा का सिग्नेचर वाला पेज, और ये कदम अपनाएँ।"],
          list: [
            "“फोटो खींचें” या “फोटो चुनें” दबाएँ।",
            "“सिग्नेचर पर अपने आप क्रॉप करें” दबाएँ, या बॉक्स खुद खींचकर सिग्नेचर के चारों ओर रखें।",
            "“बैकग्राउंड साफ़ करें” चालू रखें, स्याही का रंग काला या नीला चुनें, और लाइनें पतली या मोटी लगें तो “गहराई” बदलें।",
            "परीक्षा वाले पेज पर नहीं हैं तो “साइज़ सेटिंग” खोलकर फ़ॉर्म की चौड़ाई, ऊँचाई और KB भरें।",
            "“सिग्नेचर तैयार करें” दबाएँ, चेकलिस्ट पढ़ें, फिर “डाउनलोड करें” दबाएँ।",
          ],
          ordered: true,
        },
        {
          h: "“बैकग्राउंड साफ़ करें” क्या करता है",
          p: [
            "फ़ोन से खींची सफ़ेद कागज़ की फोटो शायद ही सफ़ेद आती है। वह हल्की भूरी होती है, उस पर छाया और कम-ज़्यादा रोशनी होती है। “बैकग्राउंड साफ़ करें” कागज़ को सफ़ेद और स्याही को गहरा कर देता है, ताकि सिग्नेचर स्कैन किया हुआ लगे।",
            "पतली लाइनें गायब हों तो “गहराई” कम करें। भूरे धब्बे या गंदगी बचे तो बढ़ाएँ। मकसद है साफ़ सफ़ेद बैकग्राउंड पर साफ़ सिग्नेचर, और फ़्रेम में कुछ और नहीं।",
          ],
        },
        {
          h: "क्रॉप: न बहुत पास, न बहुत दूर",
          p: [
            "सिग्नेचर के चारों ओर थोड़ी सफ़ेद जगह छोड़ें ताकि कोई लाइन किनारे को न छुए। बहुत ज़्यादा खाली जगह हो तो फ़ॉर्म में डिब्बे के हिसाब से छोटा होने पर सिग्नेचर बहुत छोटा दिखेगा, और KB भी बेकार जाएगा।",
            "सिर्फ़ क्रॉप करना हो, साफ़ नहीं, तो “इमेज क्रॉप करें” टूल भी चलेगा। “फ़्री” चुनें या “अपना” में अनुपात लिखें, बॉक्स खींचें और “क्रॉप करें” दबाएँ। पर फ़ॉर्म में KB लिमिट हो तो “सिग्नेचर रिसाइज़र” बेहतर है, क्योंकि वह साइज़ भी संभालता है।",
          ],
        },
        {
          h: "सिग्नेचर KB लिमिट में न आए तो",
          p: [
            "अगर टूल बताए कि KB लिमिट के नीचे नहीं आ पाया, तो शायद क्रॉप मान्य KB के हिसाब से बड़ा है। सिग्नेचर के और पास से क्रॉप करें, या फ़ॉर्म के नियम इजाज़त दें तो “साइज़ बदलें” से पिक्सल कम करें, फिर दोबारा “सिग्नेचर तैयार करें” दबाएँ। साफ़ बैकग्राउंड भी मदद करता है, क्योंकि सादी सफ़ेद जगह बहुत कम KB लेती है।",
          ],
        },
      ],
      faq: [
        {
          q: "काले पेन से साइन करूँ या नीले से?",
          a: "जो आपके फ़ॉर्म का नोटिफ़िकेशन कहे वही करें। कुछ न लिखा हो तो गहरा काला या नीला, मोटी और साफ़ लाइन वाला पेन सबसे अच्छा नतीजा देता है। आप जो रंग चुनेंगे, टूल वही रखेगा।",
        },
        {
          q: "क्या फ़ोन की स्क्रीन पर उँगली से साइन बना सकते हैं?",
          a: "“सिग्नेचर रिसाइज़र” कागज़ पर किए असली साइन की फोटो से काम करता है। कई फ़ॉर्म आपका असली हाथ का साइन चाहते हैं, इसलिए कागज़ पर साइन करके फोटो लें।",
        },
        {
          q: "साफ़ करने के बाद सिग्नेचर टूटा-टूटा क्यों दिख रहा है?",
          a: "हल्के पेन के लिए “गहराई” ज़्यादा है, इसलिए हल्के हिस्से सफ़ेद हो रहे हैं। उसे कम करें, या गहरे पेन से दोबारा साइन करें।",
        },
        {
          q: "मेरा सिग्नेचर कितने साइज़ का होना चाहिए?",
          a: "अपने फ़ॉर्म का ऑफ़िशियल नोटिफ़िकेशन देखें या इस साइट पर अपनी परीक्षा का पेज खोलें। हर फ़ॉर्म का साइज़ और KB अलग होता है, कोई एक सही साइज़ नहीं है।",
        },
        {
          q: "क्या मेरा सिग्नेचर कहीं सेव होता है?",
          a: "नहीं। साफ़ करना और साइज़ बदलना आपके ब्राउज़र में होता है। सिग्नेचर सिर्फ़ उसी फ़ाइल में रहता है जो आप डाउनलोड करते हैं।",
        },
      ],
    },
  },
  {
    slug: "cm-to-pixels-photo-size",
    tools: ["resize-image", "photo-resize"],
    published: "2026-10-15",
    en: {
      title: "CM to Pixels for Photo Size: DPI Formula with Examples",
      description:
        "Convert photo size from cm to pixels with the DPI formula. Worked examples like 3.5 × 4.5 cm at 300 DPI = 413 × 531 px, and how to resize to it in your browser.",
      intro:
        "Forms and print shops often give photo sizes in centimetres, but a digital photo is measured in pixels. The link between the two is DPI. This guide explains the simple formula, works through common examples and shows how to resize a photo to the result on your phone.",
      sections: [
        {
          h: "Pixels, centimetres and DPI in plain words",
          p: [
            "A digital photo has no real size on its own. It is just a grid of pixels, for example 600 pixels wide and 800 tall. It only gets a size in cm when it is printed or when someone decides how many pixels should fit into each inch.",
            "That number is DPI, dots per inch (often written PPI for screens). At 300 DPI, every inch of paper holds 300 pixels. Since one inch is 2.54 cm, you can turn any cm size into pixels once you know the DPI.",
          ],
        },
        {
          h: "The formula",
          p: [
            "pixels = cm ÷ 2.54 × DPI. Do it once for the width and once for the height, and round to the nearest whole pixel.",
            "Going the other way, cm = pixels ÷ DPI × 2.54. For example, 413 pixels at 300 DPI is 413 ÷ 300 × 2.54, about 3.5 cm.",
          ],
        },
        {
          h: "Worked examples",
          p: [
            "Example 1: a 3.5 × 4.5 cm passport-style photo at 300 DPI. Width: 3.5 ÷ 2.54 = 1.378 inches, × 300 = 413 px. Height: 4.5 ÷ 2.54 = 1.772 inches, × 300 = 531 px. So the photo is 413 × 531 pixels.",
            "Example 2: the same 3.5 × 4.5 cm at 200 DPI gives 276 × 354 px, and at 100 DPI it gives 138 × 177 px. Same shape, far fewer pixels, so a much smaller file.",
            "Example 3: a stamp-size 2.5 × 3 cm photo at 300 DPI. 2.5 ÷ 2.54 × 300 = 295 px and 3 ÷ 2.54 × 300 = 354 px, so 295 × 354 px.",
          ],
          list: [
            "3.5 × 4.5 cm at 300 DPI = 413 × 531 px",
            "3.5 × 4.5 cm at 200 DPI = 276 × 354 px",
            "3.5 × 4.5 cm at 100 DPI = 138 × 177 px",
            "2.5 × 3 cm at 300 DPI = 295 × 354 px",
            "A4 page, 21 × 29.7 cm at 300 DPI = 2480 × 3508 px",
          ],
        },
        {
          h: "Which DPI should I use?",
          p: [
            "For printing, 300 DPI is the usual choice because it looks sharp on paper. For screens and online forms, 72 to 100 DPI is typical, which keeps the pixel count and the KB low.",
            "If your form gives a size in cm and also names a DPI, use that DPI. If it gives the size in pixels, ignore cm and DPI and type the pixels directly. When the form gives only cm and no DPI, read the notification again for any note; the pixel size you need depends on it. When an exam page on this site has its sizes in cm, the Photo resizer's checklist shows the conversion it used, in the form “cm at DPI = pixels”, so you can compare it with the notification.",
          ],
        },
        {
          h: "Steps: resize a photo using cm and DPI",
          p: ["The Resize image tool does the maths for you."],
          list: [
            "Tap “Choose image” and pick your photo.",
            "Pick “By size”, then set Unit to “Centimetres (cm)”.",
            "Type the width and height in cm, and type the DPI in the DPI box.",
            "Check the “New size” line, which shows the result in pixels, then tap “Apply”.",
            "Tap “Download” to save the photo.",
          ],
          ordered: true,
        },
        {
          h: "Keep the shape right before you resize",
          p: [
            "If your photo's shape does not match the cm shape, resizing with “Keep proportions” off will stretch the face. Crop first. In the Crop tab, the “Passport 3.5×4.5 cm” shape locks the box to that ratio, and “Custom” lets you type any width : height. Then resize, and the face keeps its natural look.",
            "For an exam photo with a KB limit, the Photo resizer combines crop, size and KB in one step. Everything runs in your browser and the photo is never uploaded.",
          ],
        },
      ],
      faq: [
        {
          q: "How many pixels is 3.5 × 4.5 cm?",
          a: "It depends on the DPI. At 300 DPI it is 413 × 531 px, at 200 DPI 276 × 354 px, and at 100 DPI 138 × 177 px. Use the DPI your form or printer asks for.",
        },
        {
          q: "Does changing DPI alone change the file size?",
          a: "Not by itself. The KB comes from the pixels and the detail. Using a lower DPI in the formula gives fewer pixels, and that is what makes the file smaller.",
        },
        {
          q: "Why does my form show my photo smaller or larger than the cm size?",
          a: "Screens do not show cm. A form displays the photo in a box of its own size. What matters for the upload is the pixel size, KB and format the form asks for.",
        },
        {
          q: "Can I convert inches to pixels the same way?",
          a: "Yes, and it is even simpler: pixels = inches × DPI. In the Resize image tool, set Unit to “Inches (in)”.",
        },
      ],
    },
    hi: {
      title: "फोटो साइज़ cm से पिक्सल में कैसे बदलें: DPI फ़ॉर्मूला और उदाहरण",
      description:
        "फोटो का साइज़ cm से पिक्सल में DPI फ़ॉर्मूले से बदलें। उदाहरण: 300 DPI पर 3.5 × 4.5 cm = 413 × 531 px। साथ में ब्राउज़र में रिसाइज़ करने का आसान तरीका।",
      intro:
        "फ़ॉर्म और फोटो की दुकान अक्सर साइज़ सेंटीमीटर में बताते हैं, पर डिजिटल फोटो पिक्सल में नापी जाती है। दोनों को जोड़ने वाली चीज़ है DPI। यहाँ आसान फ़ॉर्मूला, कुछ हल किए उदाहरण और फ़ोन पर उसी साइज़ में फोटो बदलने का तरीका दिया गया है।",
      sections: [
        {
          h: "पिक्सल, सेंटीमीटर और DPI आसान भाषा में",
          p: [
            "डिजिटल फोटो का अपना कोई असली साइज़ नहीं होता। वह बस पिक्सल का जाल है, जैसे 600 पिक्सल चौड़ी और 800 ऊँची। cm में उसका साइज़ तभी बनता है जब उसे प्रिंट करें, या तय करें कि एक इंच में कितने पिक्सल आएँगे।",
            "यही नंबर DPI है, यानी डॉट्स पर इंच। 300 DPI का मतलब है कागज़ के हर इंच में 300 पिक्सल। एक इंच 2.54 cm का होता है, इसलिए DPI पता हो तो किसी भी cm साइज़ को पिक्सल में बदल सकते हैं।",
          ],
        },
        {
          h: "फ़ॉर्मूला",
          p: [
            "पिक्सल = cm ÷ 2.54 × DPI। एक बार चौड़ाई के लिए और एक बार ऊँचाई के लिए करें, और नज़दीकी पूरे नंबर तक गोल कर लें।",
            "उल्टा निकालना हो तो cm = पिक्सल ÷ DPI × 2.54। जैसे 300 DPI पर 413 पिक्सल = 413 ÷ 300 × 2.54, यानी लगभग 3.5 cm।",
          ],
        },
        {
          h: "हल किए हुए उदाहरण",
          p: [
            "उदाहरण 1: 300 DPI पर 3.5 × 4.5 cm की पासपोर्ट जैसी फोटो। चौड़ाई: 3.5 ÷ 2.54 = 1.378 इंच, × 300 = 413 px। ऊँचाई: 4.5 ÷ 2.54 = 1.772 इंच, × 300 = 531 px। यानी फोटो 413 × 531 पिक्सल की होगी।",
            "उदाहरण 2: वही 3.5 × 4.5 cm, 200 DPI पर 276 × 354 px और 100 DPI पर 138 × 177 px बनती है। आकार वही, पर पिक्सल बहुत कम, इसलिए फ़ाइल भी बहुत छोटी।",
            "उदाहरण 3: 300 DPI पर 2.5 × 3 cm की स्टाम्प साइज़ फोटो। 2.5 ÷ 2.54 × 300 = 295 px और 3 ÷ 2.54 × 300 = 354 px, यानी 295 × 354 px।",
          ],
          list: [
            "300 DPI पर 3.5 × 4.5 cm = 413 × 531 px",
            "200 DPI पर 3.5 × 4.5 cm = 276 × 354 px",
            "100 DPI पर 3.5 × 4.5 cm = 138 × 177 px",
            "300 DPI पर 2.5 × 3 cm = 295 × 354 px",
            "300 DPI पर A4 पेज (21 × 29.7 cm) = 2480 × 3508 px",
          ],
        },
        {
          h: "कौन सा DPI लूँ?",
          p: [
            "प्रिंट के लिए आमतौर पर 300 DPI लिया जाता है, कागज़ पर फोटो साफ़ आती है। स्क्रीन और ऑनलाइन फ़ॉर्म के लिए 72 से 100 DPI आम है, इससे पिक्सल और KB दोनों कम रहते हैं।",
            "फ़ॉर्म cm के साथ DPI भी बताए तो वही DPI लें। फ़ॉर्म सीधे पिक्सल बताए तो cm और DPI छोड़ दें और सीधे पिक्सल डालें। सिर्फ़ cm दिया हो और DPI नहीं, तो नोटिफ़िकेशन फिर से ध्यान से पढ़ें, क्योंकि पिक्सल उसी पर टिके हैं। इस साइट के जिस परीक्षा पेज पर साइज़ cm में है, वहाँ “फोटो रिसाइज़र” की चेकलिस्ट बताती है कि cm को किस DPI पर कितने पिक्सल में बदला गया, ताकि आप नोटिफ़िकेशन से मिलान कर सकें।",
          ],
        },
        {
          h: "तरीका: cm और DPI से फोटो रिसाइज़ करें",
          p: ["“इमेज रिसाइज़ करें” टूल यह हिसाब खुद कर देता है।"],
          list: [
            "“फ़ोटो चुनें” दबाकर फोटो लें।",
            "“साइज़ डालकर” चुनें, फिर “इकाई” में “सेंटीमीटर (cm)” चुनें।",
            "चौड़ाई और ऊँचाई cm में लिखें, और DPI बॉक्स में DPI लिखें।",
            "“नया साइज़” वाली लाइन में पिक्सल देखें, फिर “लागू करें” दबाएँ।",
            "“डाउनलोड” दबाकर फोटो सेव करें।",
          ],
          ordered: true,
        },
        {
          h: "रिसाइज़ से पहले आकार ठीक कर लें",
          p: [
            "फोटो का आकार cm वाले आकार से मेल न खाए और “अनुपात वही रखें” हटा दें, तो चेहरा खिंच जाएगा। इसलिए पहले क्रॉप करें। “क्रॉप” टैब में “पासपोर्ट 3.5×4.5 cm” वाला आकार बॉक्स को उसी अनुपात में बाँध देता है, और “अपना” में कोई भी चौड़ाई : ऊँचाई लिख सकते हैं। फिर रिसाइज़ करें, चेहरा अपने असली रूप में रहेगा।",
            "KB लिमिट वाली परीक्षा की फोटो के लिए “फोटो रिसाइज़र” क्रॉप, साइज़ और KB एक साथ संभाल लेता है। सब कुछ आपके ब्राउज़र में होता है, फोटो कहीं अपलोड नहीं होती।",
          ],
        },
      ],
      faq: [
        {
          q: "3.5 × 4.5 cm कितने पिक्सल होते हैं?",
          a: "यह DPI पर टिका है। 300 DPI पर 413 × 531 px, 200 DPI पर 276 × 354 px और 100 DPI पर 138 × 177 px। जो DPI फ़ॉर्म या प्रिंटर माँगे, वही लें।",
        },
        {
          q: "क्या सिर्फ़ DPI बदलने से फ़ाइल का साइज़ बदलता है?",
          a: "अपने आप नहीं। KB पिक्सल और बारीकी से बनता है। फ़ॉर्मूले में कम DPI लेने से पिक्सल कम बनते हैं, और उसी से फ़ाइल छोटी होती है।",
        },
        {
          q: "फ़ॉर्म में मेरी फोटो cm साइज़ से छोटी या बड़ी क्यों दिखती है?",
          a: "स्क्रीन cm में नहीं दिखाती। फ़ॉर्म फोटो को अपने डिब्बे के साइज़ में दिखाता है। अपलोड के लिए असली बात है फ़ॉर्म के माँगे पिक्सल, KB और फ़ॉर्मेट।",
        },
        {
          q: "क्या इंच को भी ऐसे ही पिक्सल में बदल सकते हैं?",
          a: "हाँ, और यह और आसान है: पिक्सल = इंच × DPI। “इमेज रिसाइज़ करें” टूल में “इकाई” को “इंच (in)” कर दें।",
        },
      ],
    },
  },
  {
    slug: "jpg-vs-png-vs-webp",
    tools: ["convert-image", "compress-image"],
    published: "2026-10-15",
    en: {
      title: "JPG vs PNG vs WebP: Which Image Format Should You Use?",
      description:
        "JPG, PNG or WebP? See how each format works, which one gives the smallest file, which keeps transparency, and which to pick for online forms and WhatsApp.",
      intro:
        "JPG, PNG and WebP all store pictures, but they do it very differently, and picking the wrong one can make a file several times larger or get it rejected by a form. Here is what each format is good at and how to switch between them in your browser without uploading anything.",
      sections: [
        {
          h: "JPG (JPEG): the everyday photo format",
          p: [
            "JPG is lossy: it throws away small details the eye hardly notices, which makes photo files small. You can choose the quality, so the same photo can be 40 KB or 400 KB. JPG and JPEG are the same format, only the file extension differs.",
            "JPG has no transparency. Any see-through area is filled with a solid colour, usually white. Text and sharp lines can get faint smudges around them at low quality.",
          ],
        },
        {
          h: "PNG: sharp edges and transparency",
          p: [
            "PNG is lossless: every pixel is kept exactly. That makes it perfect for screenshots, logos, diagrams and anything with text, and it supports transparent backgrounds.",
            "The downside is size. A camera photo saved as PNG is often many times larger than the same photo as JPG, and there is no quality slider to bring it down. To make a PNG smaller you have to reduce its pixels or convert it.",
          ],
        },
        {
          h: "WebP: smaller files for the web",
          p: [
            "WebP is a newer format that can work like JPG (lossy) or like PNG (lossless with transparency). For photos it usually gives a smaller file than JPG at a similar look, which is why many websites use it.",
            "The catch is support. Most modern browsers open WebP, but many upload forms, older apps and some printing shops still do not accept it. Some browsers, often Safari, also cannot save WebP, so the option may be greyed out.",
          ],
        },
        {
          h: "Which one should I pick?",
          p: ["A quick guide for common jobs:"],
          list: [
            "Online exam or job form: the format the notification names. Many forms list JPG or JPEG for photos and signatures, but always check yours.",
            "Sharing photos on WhatsApp or email: JPG.",
            "Screenshots, documents with small text, logos: PNG.",
            "A logo or sticker that needs a transparent background: PNG, or WebP if the place you are using it accepts WebP.",
            "Your own website or blog: WebP, with JPG as a fallback.",
          ],
        },
        {
          h: "Steps: convert an image between JPG, PNG and WebP",
          p: ["Open the Convert image tool on this site."],
          list: [
            "Tap “Choose image” and pick your file. It also opens GIF and BMP images.",
            "Under “Save as”, tap JPG, PNG or WebP.",
            "Check the size line under the picture to see the new KB.",
            "Tap “Download”.",
          ],
          ordered: true,
        },
        {
          h: "Converting and compressing together",
          p: [
            "Changing the format often changes the KB a lot. A PNG photo turned into JPG can drop from a few MB to a few hundred KB. If you then need a specific limit, open the Compress tab, type the maximum KB and tap “Compress”. If you are in the Compress tool with a PNG, the “Use JPG” button does the switch for you.",
            "Remember that converting cannot bring back lost detail. Turning a low-quality JPG into PNG makes the file bigger but does not make it sharper.",
          ],
        },
        {
          h: "Privacy",
          p: [
            "Conversion happens on your own device. The browser decodes the image and saves it again in the new format locally, so the picture is never uploaded to a server. That is the same for every image tool on this site.",
          ],
        },
      ],
      faq: [
        {
          q: "Is JPEG the same as JPG?",
          a: "Yes. They are the same format with a different file extension. A form that asks for JPEG will accept a .jpg file in the vast majority of cases, but follow the form's own instructions if it says otherwise.",
        },
        {
          q: "Why did my transparent background turn white?",
          a: "JPG cannot store transparency, so see-through areas are filled with white. Save as PNG or WebP if you need to keep the transparent background.",
        },
        {
          q: "Does converting JPG to PNG improve quality?",
          a: "No. PNG keeps every pixel exactly, but it cannot recreate detail the JPG already lost. You get a larger file that looks the same.",
        },
        {
          q: "Why is WebP greyed out?",
          a: "Your browser cannot save WebP. JPG and PNG still work everywhere. Try another browser, such as Chrome, if you specifically need WebP.",
        },
        {
          q: "Can I open iPhone HEIC photos?",
          a: "Only if your browser can read HEIC. If you see an error, set Settings → Camera → Formats → Most Compatible on the iPhone, or share the photo as JPG first.",
        },
      ],
    },
    hi: {
      title: "JPG, PNG या WebP: कौन सा इमेज फ़ॉर्मेट कब इस्तेमाल करें?",
      description:
        "JPG, PNG या WebP? जानें हर फ़ॉर्मेट कैसे काम करता है, किससे सबसे छोटी फ़ाइल बनती है, कौन पारदर्शिता रखता है, और फ़ॉर्म व WhatsApp के लिए कौन सा चुनें।",
      intro:
        "JPG, PNG और WebP तीनों तस्वीर सेव करते हैं, पर तरीका बिल्कुल अलग है। गलत फ़ॉर्मेट चुनने से फ़ाइल कई गुना बड़ी हो सकती है या फ़ॉर्म उसे ठुकरा सकता है। यहाँ जानिए कौन सा फ़ॉर्मेट किस काम का है, और ब्राउज़र में बिना अपलोड के इन्हें कैसे बदलें।",
      sections: [
        {
          h: "JPG (JPEG): रोज़ की फोटो का फ़ॉर्मेट",
          p: [
            "JPG में थोड़ी बारीकी छोड़ दी जाती है जो आँख को मुश्किल से दिखती है, इसी से फोटो की फ़ाइल छोटी बनती है। क्वालिटी आप चुन सकते हैं, इसलिए एक ही फोटो 40 KB की भी हो सकती है और 400 KB की भी। JPG और JPEG एक ही फ़ॉर्मेट है, बस नाम का आखिरी हिस्सा अलग है।",
            "JPG में पारदर्शिता नहीं होती। पारदर्शी हिस्सा किसी रंग से भर जाता है, आमतौर पर सफ़ेद। कम क्वालिटी पर अक्षरों और तीखी लाइनों के आसपास हल्के धब्बे दिख सकते हैं।",
          ],
        },
        {
          h: "PNG: तीखे किनारे और पारदर्शिता",
          p: [
            "PNG में हर पिक्सल बिल्कुल वैसा ही रहता है, कुछ नहीं छोड़ा जाता। इसलिए स्क्रीनशॉट, लोगो, डायग्राम और अक्षरों वाली तस्वीरों के लिए यह बढ़िया है, और इसमें पारदर्शी बैकग्राउंड भी रह सकता है।",
            "दिक्कत है साइज़। कैमरे की फोटो PNG में सेव करें तो वह JPG से कई गुना बड़ी बनती है, और उसे घटाने के लिए क्वालिटी का कोई स्लाइडर नहीं होता। PNG छोटी करनी हो तो पिक्सल घटाने पड़ते हैं या फ़ॉर्मेट बदलना पड़ता है।",
          ],
        },
        {
          h: "WebP: वेब के लिए छोटी फ़ाइल",
          p: [
            "WebP नया फ़ॉर्मेट है जो JPG की तरह भी चल सकता है और PNG की तरह पारदर्शिता के साथ भी। फोटो के लिए यह आमतौर पर JPG से छोटी फ़ाइल बनाता है और दिखने में लगभग वैसा ही रहता है, इसीलिए कई वेबसाइटें इसे इस्तेमाल करती हैं।",
            "पर हर जगह यह नहीं चलता। ज़्यादातर नए ब्राउज़र WebP खोल लेते हैं, लेकिन कई फ़ॉर्म, पुराने ऐप और कुछ प्रिंट की दुकानें इसे नहीं लेतीं। कुछ ब्राउज़र, अक्सर Safari, WebP सेव भी नहीं कर पाते, इसलिए वह बटन धुंधला दिख सकता है।",
          ],
        },
        {
          h: "मैं कौन सा चुनूँ?",
          p: ["आम कामों के लिए छोटी सी गाइड:"],
          list: [
            "ऑनलाइन परीक्षा या नौकरी का फ़ॉर्म: जो फ़ॉर्मेट नोटिफ़िकेशन में लिखा है। कई फ़ॉर्म फोटो और सिग्नेचर के लिए JPG या JPEG माँगते हैं, पर अपना फ़ॉर्म ज़रूर देखें।",
            "WhatsApp या ईमेल पर फोटो भेजना: JPG।",
            "स्क्रीनशॉट, छोटे अक्षरों वाले कागज़, लोगो: PNG।",
            "पारदर्शी बैकग्राउंड वाला लोगो या स्टिकर: PNG, या जहाँ WebP चलता हो वहाँ WebP।",
            "अपनी वेबसाइट या ब्लॉग: WebP, और साथ में JPG भी।",
          ],
        },
        {
          h: "तरीका: इमेज को JPG, PNG और WebP में बदलें",
          p: ["इस साइट पर “इमेज कन्वर्ट करें” टूल खोलें।"],
          list: [
            "“फ़ोटो चुनें” दबाकर फ़ाइल लें। GIF और BMP इमेज भी खुल जाती हैं।",
            "“किस फ़ॉर्मेट में सेव करें” में JPG, PNG या WebP दबाएँ।",
            "तस्वीर के नीचे साइज़ वाली लाइन में नया KB देखें।",
            "“डाउनलोड” दबाएँ।",
          ],
          ordered: true,
        },
        {
          h: "फ़ॉर्मेट बदलना और KB कम करना साथ में",
          p: [
            "फ़ॉर्मेट बदलने से अक्सर KB काफ़ी बदल जाता है। PNG फोटो को JPG करने पर वह कुछ MB से घटकर कुछ सौ KB की हो सकती है। फिर कोई तय लिमिट चाहिए तो “KB कम” टैब खोलें, ज़्यादा से ज़्यादा KB लिखें और “KB कम करें” दबाएँ। “इमेज कंप्रेस करें” टूल में PNG खोली हो तो “JPG इस्तेमाल करें” बटन यह बदलाव खुद कर देता है।",
            "याद रखें, फ़ॉर्मेट बदलने से खोई हुई बारीकी वापस नहीं आती। कम क्वालिटी की JPG को PNG बनाने से फ़ाइल बड़ी होगी, पर फोटो ज़्यादा साफ़ नहीं होगी।",
          ],
        },
        {
          h: "प्राइवेसी",
          p: [
            "फ़ॉर्मेट आपके अपने डिवाइस पर बदलता है। ब्राउज़र इमेज को खोलकर वहीं नए फ़ॉर्मेट में सेव करता है, तस्वीर किसी सर्वर पर अपलोड नहीं होती। इस साइट के हर इमेज टूल में यही होता है।",
          ],
        },
      ],
      faq: [
        {
          q: "क्या JPEG और JPG एक ही हैं?",
          a: "हाँ, फ़ॉर्मेट एक ही है, बस फ़ाइल के नाम का आखिरी हिस्सा अलग है। JPEG माँगने वाले ज़्यादातर फ़ॉर्म .jpg फ़ाइल ले लेते हैं, फिर भी फ़ॉर्म में कुछ और लिखा हो तो वही मानें।",
        },
        {
          q: "मेरा पारदर्शी बैकग्राउंड सफ़ेद क्यों हो गया?",
          a: "JPG में पारदर्शिता नहीं होती, इसलिए पारदर्शी हिस्सा सफ़ेद हो जाता है। बैकग्राउंड पारदर्शी रखना हो तो PNG या WebP में सेव करें।",
        },
        {
          q: "क्या JPG को PNG करने से क्वालिटी बढ़ती है?",
          a: "नहीं। PNG हर पिक्सल वैसा ही रखता है, पर JPG में जो बारीकी पहले ही चली गई, उसे वापस नहीं ला सकता। फ़ाइल बड़ी हो जाती है, फोटो वैसी ही रहती है।",
        },
        {
          q: "WebP वाला बटन धुंधला क्यों है?",
          a: "आपका ब्राउज़र WebP सेव नहीं कर पाता। JPG और PNG हर जगह चलते हैं। WebP ही चाहिए तो Chrome जैसा दूसरा ब्राउज़र आज़माएँ।",
        },
        {
          q: "क्या iPhone की HEIC फोटो खुल सकती है?",
          a: "तभी, जब आपका ब्राउज़र HEIC पढ़ सके। एरर आए तो iPhone में Settings → Camera → Formats → Most Compatible चुनें, या फोटो को पहले JPG में शेयर करें।",
        },
      ],
    },
  },
  {
    slug: "how-to-convert-photos-to-pdf",
    tools: ["image-to-pdf", "pdf-merge", "pdf-compress"],
    published: "2026-10-15",
    en: {
      title: "How to Convert Photos to PDF on Your Phone (Free, No App)",
      description:
        "Turn phone photos of documents into one PDF in your browser. Put pages in order, pick A4 or photo size, join PDFs and shrink to a KB limit. No upload.",
      intro:
        "Many forms and offices want documents as a single PDF, but what you usually have is a set of photos on your phone. This guide shows how to turn those photos into a neat PDF, join it with other PDFs and bring it under an upload limit, all in your browser without installing an app.",
      sections: [
        {
          h: "Take good photos of your documents first",
          p: ["The PDF can only be as clear as the photos you put in it. A minute of care here saves a re-upload later."],
          list: [
            "Lay the page flat on a dark, plain surface so its edges stand out.",
            "Use daylight or a bright room and avoid the phone's own shadow.",
            "Hold the phone straight above the page so the text is not slanted.",
            "Fill the frame with the page, without cutting off any corner.",
            "Zoom in on the photo and check that small text is readable before moving on.",
          ],
        },
        {
          h: "Steps: make a PDF from photos",
          p: ["Open the Images to PDF tool on this site."],
          list: [
            "Tap “Choose photos” and pick one or more images. Use “Add more” for extra pages.",
            "Use ↑ and ↓ to put the pages in order, and ✕ to remove one you do not need.",
            "Choose the Page size: “A4” or “Same as photo”.",
            "Tap “Make PDF”.",
            "Tap “Download PDF”.",
          ],
          ordered: true,
        },
        {
          h: "A4 or “Same as photo”?",
          p: [
            "“A4” puts each photo on a standard A4 page with margins. It prints neatly and looks like a normal document, which suits marksheets, certificates and letters.",
            "“Same as photo” makes each page exactly the size of the picture, with no white border. It suits photos that are not page-shaped, such as an ID card or a receipt, or when you want nothing around the picture.",
            "Pages come out upright in most cases, because each photo is drawn using the phone's rotation information. If one is still sideways, fix it first with the Rotate & flip image tool and add it again.",
          ],
        },
        {
          h: "Joining several PDFs into one file",
          p: [
            "Sometimes you have a mix: a PDF from the college, another from a scanner and the one you just made from photos. If the form allows only one upload, join them with the Merge PDFs tool. Tap “Choose PDFs” and pick two or more files, use ↑ and ↓ to set the order, then tap “Merge PDFs” and “Download PDF”.",
            "Merging copies the pages as they are, so quality does not change and text stays selectable. The merged file is roughly the total size of the files you joined.",
          ],
        },
        {
          h: "Bringing the PDF under the upload limit",
          p: [
            "Photos are already re-saved at a sensible size when the PDF is made, but many pages add up. If the file is over the form's limit, open it in the Compress PDF to KB tool, pick 100, 200, 300 or 500 KB under “Target size” or type your own in “Custom KB”, and tap “Compress PDF”.",
            "Compression turns each page into an image at a lower quality, so check that small text is still readable before you download. Limits differ between forms, so take the number from your official notification or the note next to the upload box.",
          ],
        },
        {
          h: "Your documents never leave your phone",
          p: [
            "Making, merging and compressing all happen inside your browser. No photo or PDF is uploaded to a server, nothing is stored online, and there is no sign-up. That matters when the pages are your marksheets, Aadhaar or bank documents.",
          ],
        },
      ],
      faq: [
        {
          q: "How many photos can I put in one PDF?",
          a: "There is no fixed number in the tool, but every page adds size and very long PDFs take longer to build on older phones. For uploads, include only the pages the form asks for.",
        },
        {
          q: "Can I change the page order after adding photos?",
          a: "Yes. Use ↑ and ↓ next to each page before tapping “Make PDF”. If you already made the PDF, change the order and tap “Make PDF” again.",
        },
        {
          q: "The PDF is too big for the form. What now?",
          a: "Open the downloaded PDF in Compress PDF to KB and choose the KB limit you need. Removing pages you do not need also helps.",
        },
        {
          q: "Do I need to install an app?",
          a: "No. It works in the browser on any phone or computer, and the files stay on your device.",
        },
      ],
    },
    hi: {
      title: "फोटो से PDF कैसे बनाएँ: फ़ोन पर फ्री, बिना ऐप",
      description:
        "कागज़ों की फ़ोन वाली फोटो को ब्राउज़र में एक PDF बनाएँ। पेजों का क्रम ठीक करें, A4 या फोटो साइज़ चुनें, PDF जोड़ें और KB लिमिट तक छोटा करें। बिना अपलोड।",
      intro:
        "कई फ़ॉर्म और दफ़्तर कागज़ एक PDF में माँगते हैं, जबकि आपके फ़ोन में अक्सर बस कुछ फोटो होती हैं। इस गाइड में जानिए उन फोटो से साफ़-सुथरी PDF कैसे बनाएँ, दूसरी PDF के साथ कैसे जोड़ें और अपलोड लिमिट तक कैसे छोटा करें। सब ब्राउज़र में, कोई ऐप डाले बिना।",
      sections: [
        {
          h: "पहले कागज़ों की अच्छी फोटो लें",
          p: ["PDF उतनी ही साफ़ बनेगी जितनी साफ़ फोटो होंगी। यहाँ एक मिनट की सावधानी बाद में दोबारा अपलोड से बचाती है।"],
          list: [
            "कागज़ को गहरे रंग की सादी सतह पर सीधा रखें ताकि उसके किनारे साफ़ दिखें।",
            "दिन की रोशनी या उजले कमरे में फोटो लें, फ़ोन की अपनी परछाईं से बचें।",
            "फ़ोन को कागज़ के ठीक ऊपर सीधा रखें ताकि अक्षर तिरछे न आएँ।",
            "पूरा कागज़ फ़्रेम में भरें, कोई कोना कटे नहीं।",
            "आगे बढ़ने से पहले फोटो में ज़ूम करके देखें कि छोटे अक्षर पढ़ने में आ रहे हैं।",
          ],
        },
        {
          h: "तरीका: फोटो से PDF बनाएँ",
          p: ["इस साइट पर “फोटो से PDF बनाएँ” टूल खोलें।"],
          list: [
            "“फोटो चुनें” दबाकर एक या ज़्यादा फोटो लें। और पेज जोड़ने के लिए “और जोड़ें” दबाएँ।",
            "↑ और ↓ से पेजों का क्रम ठीक करें, और जो पेज नहीं चाहिए उसे ✕ से हटाएँ।",
            "“पेज साइज़” में “A4” या “फोटो जितना” चुनें।",
            "“PDF बनाएँ” दबाएँ।",
            "“PDF डाउनलोड करें” दबाएँ।",
          ],
          ordered: true,
        },
        {
          h: "A4 चुनें या “फोटो जितना”?",
          p: [
            "“A4” हर फोटो को किनारों के साथ सामान्य A4 पेज पर रखता है। प्रिंट में साफ़ आता है और आम कागज़ जैसा दिखता है, इसलिए मार्कशीट, सर्टिफ़िकेट और लेटर के लिए ठीक है।",
            "“फोटो जितना” हर पेज को ठीक फोटो के साइज़ का बनाता है, बिना सफ़ेद किनारे के। यह उन चीज़ों के लिए ठीक है जो पेज जैसी नहीं होतीं, जैसे ID कार्ड या रसीद।",
            "ज़्यादातर पेज सीधे ही आते हैं, क्योंकि हर फोटो फ़ोन की घुमाव वाली जानकारी के हिसाब से बनती है। फिर भी कोई पेज टेढ़ा आए तो पहले “इमेज घुमाएँ और पलटें” टूल से ठीक करें और दोबारा जोड़ें।",
          ],
        },
        {
          h: "कई PDF को एक फ़ाइल में जोड़ना",
          p: [
            "कभी-कभी आपके पास अलग-अलग फ़ाइलें होती हैं: एक PDF कॉलेज से मिली, एक स्कैनर से बनी और एक अभी फोटो से बनाई। फ़ॉर्म में सिर्फ़ एक अपलोड हो तो “PDF जोड़ें” टूल से इन्हें मिला दें। “PDF चुनें” दबाकर दो या ज़्यादा फ़ाइलें लें, ↑ और ↓ से क्रम ठीक करें, फिर “PDF जोड़ें” और “PDF डाउनलोड करें” दबाएँ।",
            "जोड़ते समय पेज जैसे के तैसे कॉपी होते हैं, इसलिए क्वालिटी नहीं बदलती और टेक्स्ट सेलेक्ट होता रहता है। जुड़ी हुई फ़ाइल का साइज़ लगभग सब फ़ाइलों के कुल साइज़ जितना होता है।",
          ],
        },
        {
          h: "PDF को अपलोड लिमिट के अंदर लाना",
          p: [
            "PDF बनाते समय फोटो पहले से ठीक-ठाक साइज़ में सेव होती हैं, पर ज़्यादा पेज हों तो साइज़ बढ़ जाता है। फ़ाइल फ़ॉर्म की लिमिट से बड़ी हो तो उसे “PDF को KB में कंप्रेस करें” टूल में खोलें, “लक्ष्य साइज़” में 100, 200, 300 या 500 KB चुनें या “अपना KB” में खुद लिखें, और “PDF कंप्रेस करें” दबाएँ।",
            "कंप्रेस करने पर हर पेज कम क्वालिटी की इमेज बनता है, इसलिए डाउनलोड से पहले देख लें कि छोटे अक्षर पढ़ने में आ रहे हैं। हर फ़ॉर्म की लिमिट अलग होती है, इसलिए नंबर ऑफ़िशियल नोटिफ़िकेशन या अपलोड बॉक्स के पास लिखी बात से ही लें।",
          ],
        },
        {
          h: "आपके कागज़ आपके फ़ोन से बाहर नहीं जाते",
          p: [
            "PDF बनाना, जोड़ना और छोटा करना, सब आपके ब्राउज़र में होता है। कोई फोटो या PDF किसी सर्वर पर अपलोड नहीं होती, ऑनलाइन कुछ सेव नहीं होता और लॉगिन भी नहीं चाहिए। मार्कशीट, आधार या बैंक के कागज़ों के लिए यह बहुत मायने रखता है।",
          ],
        },
      ],
      faq: [
        {
          q: "एक PDF में कितनी फोटो डाल सकते हैं?",
          a: "टूल में कोई तय गिनती नहीं है, पर हर पेज से साइज़ बढ़ता है और पुराने फ़ोन पर लंबी PDF बनने में समय लगता है। अपलोड के लिए सिर्फ़ वही पेज डालें जो फ़ॉर्म माँगता है।",
        },
        {
          q: "फोटो जोड़ने के बाद पेजों का क्रम बदल सकते हैं?",
          a: "हाँ। “PDF बनाएँ” दबाने से पहले हर पेज के पास ↑ और ↓ इस्तेमाल करें। PDF बन चुकी हो तो क्रम बदलकर फिर से “PDF बनाएँ” दबाएँ।",
        },
        {
          q: "PDF फ़ॉर्म के लिए बहुत बड़ी है, अब क्या करूँ?",
          a: "डाउनलोड हुई PDF को “PDF को KB में कंप्रेस करें” में खोलें और अपनी KB लिमिट चुनें। जो पेज ज़रूरी नहीं, उन्हें हटाने से भी मदद मिलती है।",
        },
        {
          q: "क्या कोई ऐप डालना पड़ेगा?",
          a: "नहीं। यह किसी भी फ़ोन या कंप्यूटर के ब्राउज़र में चलता है, और फ़ाइलें आपके डिवाइस पर ही रहती हैं।",
        },
      ],
    },
  },
  {
    slug: "why-photo-rejected-in-online-form",
    tools: ["photo-resize", "crop-image", "compress-image"],
    published: "2026-10-15",
    en: {
      title: "Why Is My Photo Rejected in an Online Form? Common Reasons and Fixes",
      description:
        "Photo rejected or not uploading in an online form? See the usual causes, from wrong KB and pixel size to a dark background, and how to fix each one for free.",
      intro:
        "Few things are more stressful than a photo upload error close to the last date. The good news is that most rejections come from a handful of simple causes. Go through this list, fix what applies, and check your photo against the official notification before you upload again.",
      sections: [
        {
          h: "1. The file is too big or too small in KB",
          p: [
            "This is the most common reason. Many forms set a maximum KB and some also set a minimum. A phone photo of several MB will always be refused, and a heavily compressed photo can fall below the minimum.",
            "Fix: use the Compress image tool and type the maximum KB, or use the Photo resizer and enter both the minimum and maximum in “Size settings”. If a very plain photo comes out below the minimum, the Photo resizer adds hidden padding without changing how it looks.",
          ],
        },
        {
          h: "2. Wrong pixel size or shape",
          p: [
            "Some forms check the width and height in pixels, or show your photo in a box of a fixed shape. A wide or square photo then gets refused, or appears squashed.",
            "Fix: crop to the right shape first, then resize. In the Crop image tool, the “Passport 3.5×4.5 cm” shape and the “Custom” ratio lock the box to the shape you need. The Photo resizer does crop and size together and its checklist shows the dimensions it produced.",
          ],
        },
        {
          h: "3. Wrong file format",
          p: [
            "A form that accepts only JPG or JPEG will refuse a PNG, WebP or HEIC file, even if it looks the same. iPhone photos are often HEIC by default.",
            "Fix: convert the photo to the format the form asks for with the Convert image tool, or let the Photo resizer save it as JPG, its default format.",
          ],
        },
        {
          h: "4. Background, face position and photo quality",
          p: [
            "Forms that are checked by a person, or by software, may refuse photos with a dark or busy background, a face that is too small or cut off, sunglasses, a cap, heavy shadows or blur. Requirements on background colour, face size and how recent the photo is vary, so read your notification carefully.",
            "Fix: take a new photo in daylight against a plain white or light wall, looking straight at the camera. In the Photo resizer, place your face inside the guide in the crop box. Its checklist warns if the background looks dark or coloured, but it does not replace the background, so a new photo is the real fix.",
          ],
        },
        {
          h: "5. Name and date missing, or the wrong document",
          p: [
            "Some notifications ask for the candidate's name and the date the photo was taken to be printed on the photo. Others ask for something else entirely. Uploading a signature in the photo slot, or the other way round, is also a common slip.",
            "Fix: read what each upload box asks for. On an exam page of this site where the rules ask for name and date, the Photo resizer shows boxes for them, and the checklist confirms they were added.",
          ],
        },
        {
          h: "6. Upload problems that are not about the photo",
          p: ["Sometimes the photo is fine and the problem is elsewhere."],
          list: [
            "A slow or dropping connection: wait for the upload to finish before moving to the next step.",
            "A file name with unusual symbols: rename it to something simple like photo.jpg.",
            "A photo that looks sideways on the website: open it in the Rotate & flip image tool and download it again so the pixels are saved upright.",
            "The site is busy near the last date: try again at a quieter time, and do not leave it to the final day.",
          ],
        },
        {
          h: "A quick check before you upload",
          p: [
            "Open the latest official notification and note the format, pixel size, KB range and any rule on background, name or date. Then make the photo with the Photo resizer, or open your exam's page on this site where these values are filled in from its data, and compare them with the notification once more. The checklist shows each item with ✅ or ⚠️. Everything runs in your browser and the photo is never uploaded to us.",
          ],
        },
      ],
      faq: [
        {
          q: "My photo is under the KB limit but still rejected. Why?",
          a: "Check the minimum KB, the pixel size, the format and any rules on background or name and date. Any one of these can cause a rejection even when the KB is right.",
        },
        {
          q: "Can the tool change my background to white?",
          a: "No. The Photo resizer checks the edges of the photo and warns if they look dark or coloured, but it does not replace the background. Take a new photo against a plain light wall.",
        },
        {
          q: "What photo size should I use for my exam?",
          a: "Use the size in the latest official notification for your exam. On this site, open your exam's page to see the sizes taken from its data, and always compare them with the notification.",
        },
        {
          q: "My form says the image is invalid but it opens fine on my phone.",
          a: "The phone may be showing a HEIC or WebP file, or one with a rotation tag. Convert it to JPG with the Convert image tool, or make it with the Photo resizer, and upload the new file.",
        },
        {
          q: "Is it safe to fix my photo on this site?",
          a: "Yes. Cropping, resizing and compressing all happen in your browser. Your photo is not uploaded or stored anywhere.",
        },
      ],
    },
    hi: {
      title: "ऑनलाइन फ़ॉर्म में फोटो रिजेक्ट क्यों होती है? आम कारण और उपाय",
      description:
        "ऑनलाइन फ़ॉर्म में फोटो रिजेक्ट हो रही है या अपलोड नहीं हो रही? गलत KB, गलत पिक्सल साइज़ से लेकर गहरे बैकग्राउंड तक, आम कारण और उनका फ्री उपाय जानें।",
      intro:
        "आखिरी तारीख के पास फोटो अपलोड में एरर आए तो बहुत घबराहट होती है। अच्छी बात यह है कि ज़्यादातर फोटो कुछ आसान कारणों से ही रिजेक्ट होती हैं। यह लिस्ट देखें, जो लागू हो उसे ठीक करें, और दोबारा अपलोड से पहले ऑफ़िशियल नोटिफ़िकेशन से फोटो का मिलान कर लें।",
      sections: [
        {
          h: "1. फ़ाइल KB में बहुत बड़ी या बहुत छोटी है",
          p: [
            "यह सबसे आम कारण है। कई फ़ॉर्म ज़्यादा से ज़्यादा KB तय करते हैं, कुछ कम से कम KB भी। कई MB की फ़ोन वाली फोटो हमेशा रिजेक्ट होगी, और बहुत ज़्यादा कंप्रेस की गई फोटो न्यूनतम से नीचे जा सकती है।",
            "उपाय: “इमेज कंप्रेस करें” टूल में ज़्यादा से ज़्यादा KB लिखें, या “फोटो रिसाइज़र” में “साइज़ सेटिंग” खोलकर न्यूनतम और अधिकतम दोनों KB भरें। बहुत सादी फोटो न्यूनतम से छोटी बने तो “फोटो रिसाइज़र” छुपी पैडिंग जोड़ देता है, फोटो दिखने में नहीं बदलती।",
          ],
        },
        {
          h: "2. पिक्सल साइज़ या आकार गलत है",
          p: [
            "कुछ फ़ॉर्म पिक्सल में चौड़ाई-ऊँचाई जाँचते हैं, या फोटो को तय आकार के डिब्बे में दिखाते हैं। ऐसे में चौड़ी या चौकोर फोटो रिजेक्ट हो जाती है या दबी हुई दिखती है।",
            "उपाय: पहले सही आकार में क्रॉप करें, फिर साइज़ बदलें। “इमेज क्रॉप करें” टूल में “पासपोर्ट 3.5×4.5 cm” आकार और “अपना” अनुपात बॉक्स को ज़रूरी आकार में बाँध देते हैं। “फोटो रिसाइज़र” क्रॉप और साइज़ एक साथ करता है और चेकलिस्ट में बनी हुई फोटो का साइज़ दिखाता है।",
          ],
        },
        {
          h: "3. फ़ाइल का फ़ॉर्मेट गलत है",
          p: [
            "जो फ़ॉर्म सिर्फ़ JPG या JPEG लेता है, वह PNG, WebP या HEIC फ़ाइल ठुकरा देगा, चाहे फोटो दिखने में एक जैसी हो। iPhone की फोटो अक्सर पहले से HEIC में होती हैं।",
            "उपाय: “इमेज कन्वर्ट करें” टूल से फोटो को फ़ॉर्म के माँगे फ़ॉर्मेट में बदलें, या “फोटो रिसाइज़र” से बनाएँ, जो पहले से JPG में सेव करता है।",
          ],
        },
        {
          h: "4. बैकग्राउंड, चेहरे की जगह और फोटो की क्वालिटी",
          p: [
            "जिन फ़ॉर्म की जाँच कोई इंसान या सॉफ़्टवेयर करता है, वे गहरे या भरे-भरे बैकग्राउंड, बहुत छोटे या कटे चेहरे, काला चश्मा, टोपी, गहरी छाया या धुंधली फोटो को रिजेक्ट कर सकते हैं। बैकग्राउंड का रंग, चेहरे का साइज़ और फोटो कितनी पुरानी हो, ये नियम हर फ़ॉर्म में अलग हैं, इसलिए नोटिफ़िकेशन ध्यान से पढ़ें।",
            "उपाय: दिन की रोशनी में सादी सफ़ेद या हल्की दीवार के आगे, कैमरे की ओर सीधे देखते हुए नई फोटो लें। “फोटो रिसाइज़र” में क्रॉप बॉक्स की गाइड के अंदर चेहरा रखें। उसकी चेकलिस्ट बताती है कि बैकग्राउंड गहरा या रंगीन तो नहीं, पर वह बैकग्राउंड बदलती नहीं, इसलिए असली उपाय नई फोटो ही है।",
          ],
        },
        {
          h: "5. नाम और तारीख नहीं है, या गलत कागज़ लगा दिया",
          p: [
            "कुछ नोटिफ़िकेशन फोटो पर उम्मीदवार का नाम और फोटो खींचने की तारीख छपी हुई माँगते हैं। कुछ बिल्कुल अलग चीज़ माँगते हैं। फोटो वाली जगह पर सिग्नेचर, या सिग्नेचर की जगह फोटो अपलोड कर देना भी आम गलती है।",
            "उपाय: हर अपलोड बॉक्स में क्या माँगा है, ध्यान से पढ़ें। इस साइट के जिस परीक्षा पेज के नियम नाम और तारीख माँगते हैं, वहाँ “फोटो रिसाइज़र” में उनके लिए बॉक्स आते हैं, और चेकलिस्ट बताती है कि वे जुड़ गए।",
          ],
        },
        {
          h: "6. अपलोड की दिक्कतें जो फोटो की वजह से नहीं हैं",
          p: ["कभी फोटो बिल्कुल ठीक होती है और गड़बड़ कहीं और होती है।"],
          list: [
            "धीमा या बार-बार कटने वाला नेट: अगले कदम पर जाने से पहले अपलोड पूरा होने दें।",
            "फ़ाइल के नाम में अजीब चिह्न: नाम बदलकर photo.jpg जैसा आसान नाम रखें।",
            "वेबसाइट पर फोटो टेढ़ी दिखे: “इमेज घुमाएँ और पलटें” टूल में खोलकर दोबारा डाउनलोड करें ताकि फोटो सीधी सेव हो।",
            "आखिरी तारीख के पास साइट पर भीड़: कम भीड़ वाले समय में कोशिश करें, और काम आखिरी दिन पर न छोड़ें।",
          ],
        },
        {
          h: "अपलोड से पहले जल्दी से जाँच लें",
          p: [
            "सबसे नया ऑफ़िशियल नोटिफ़िकेशन खोलें और फ़ॉर्मेट, पिक्सल साइज़, KB और बैकग्राउंड, नाम या तारीख का नियम लिख लें। फिर “फोटो रिसाइज़र” से फोटो बनाएँ, या इस साइट पर अपनी परीक्षा का पेज खोलें जहाँ ये नंबर उसके डेटा से भरे मिलते हैं, और एक बार फिर नोटिफ़िकेशन से मिलाएँ। चेकलिस्ट हर बात के आगे ✅ या ⚠️ दिखाती है। सब कुछ आपके ब्राउज़र में होता है, फोटो हमारे पास अपलोड नहीं होती।",
          ],
        },
      ],
      faq: [
        {
          q: "फोटो KB लिमिट के अंदर है, फिर भी रिजेक्ट क्यों हुई?",
          a: "न्यूनतम KB, पिक्सल साइज़, फ़ॉर्मेट और बैकग्राउंड या नाम-तारीख के नियम देखें। KB ठीक होने पर भी इनमें से कोई एक बात फोटो रिजेक्ट करा सकती है।",
        },
        {
          q: "क्या टूल मेरा बैकग्राउंड सफ़ेद कर सकता है?",
          a: "नहीं। “फोटो रिसाइज़र” फोटो के किनारे जाँचकर बताता है कि वे गहरे या रंगीन तो नहीं, पर बैकग्राउंड नहीं बदलता। सादी हल्की दीवार के आगे नई फोटो लें।",
        },
        {
          q: "मेरी परीक्षा के लिए फोटो का साइज़ क्या होना चाहिए?",
          a: "अपनी परीक्षा के सबसे नए ऑफ़िशियल नोटिफ़िकेशन वाला साइज़ लें। इस साइट पर अपनी परीक्षा का पेज खोलकर उसके डेटा से लिए साइज़ देख सकते हैं, पर नोटिफ़िकेशन से मिलान हमेशा करें।",
        },
        {
          q: "फ़ॉर्म कहता है इमेज गलत है, पर फ़ोन में ठीक खुलती है।",
          a: "फ़ोन शायद HEIC या WebP फ़ाइल, या घुमाव वाले टैग वाली फ़ाइल दिखा रहा है। “इमेज कन्वर्ट करें” से उसे JPG बनाएँ, या “फोटो रिसाइज़र” से बनाकर नई फ़ाइल अपलोड करें।",
        },
        {
          q: "क्या इस साइट पर फोटो ठीक करना सुरक्षित है?",
          a: "हाँ। क्रॉप, रिसाइज़ और कंप्रेस सब आपके ब्राउज़र में होता है। आपकी फोटो कहीं अपलोड या सेव नहीं होती।",
        },
      ],
    },
  },
  {
    slug: "how-to-make-passport-size-photo-sheet",
    tools: ["passport-photo-sheet", "crop-image"],
    published: "2026-10-15",
    en: {
      title: "How to Make a Passport Size Photo Sheet for Printing (A4, Free)",
      description:
        "Make an A4 sheet of 8, 16 or 32 passport size photos from one picture, ready to print at home or a shop. Free, in your browser, and your photo is not uploaded.",
      intro:
        "Forms, admission offices and ID cards keep asking for printed passport size photos, and a studio visit every time adds up. With one good photo you can make a full A4 sheet yourself and print it at home or at any print shop. Here is how, plus the printer setting that most people get wrong.",
      sections: [
        {
          h: "What you need",
          p: [
            "Just a clear, front-facing photo with a plain light background, taken in good light. A phone camera is fine. Stand a little away from the wall to avoid shadows behind you, look straight at the camera and keep your face fully visible.",
            "Passport photo sizes and rules on background, face size and expression vary between forms and offices, so check the form you are applying with. This tool offers two common sizes: passport (3.5 × 4.5 cm) and stamp (2.5 × 3 cm).",
          ],
        },
        {
          h: "Steps: make the sheet",
          p: ["Open the Passport photo print sheet tool on this site."],
          list: [
            "Tap “Choose photo” and pick a front-facing photo.",
            "Drag the crop box so the face sits inside the guide.",
            "Choose the “Number of photos” (8, 16 or 32) and the “Photo size”.",
            "Tap “Make print sheet”.",
            "Tap the PDF or JPG download button under the finished sheet.",
          ],
          ordered: true,
        },
        {
          h: "How many photos fit on A4?",
          p: [
            "An A4 page is 21 × 29.7 cm. Passport-size photos fit 8 or 16 to a page, with cutting lines between them. 32 passport-size photos do not fit, so when you pick 32 the tool switches to stamp size, and you will see a note if a choice does not fit.",
            "The sheet is drawn at 300 DPI, which is sharp enough for photo printing. At that resolution a 3.5 × 4.5 cm photo is 413 × 531 pixels, so start from a photo that is at least that large around the face.",
          ],
        },
        {
          h: "Print at actual size, not “Fit to page”",
          p: [
            "This is where most sheets go wrong. Many printers and phone print dialogs shrink the page slightly to “fit” it, and then every photo comes out a little smaller than it should be.",
            "In the print settings choose 100% scale or “Actual size”, not “Fit to page”. If you take the file to a shop, ask them to print at actual size on A4. Measure one printed photo with a ruler to confirm before cutting the whole sheet.",
          ],
        },
        {
          h: "PDF or JPG?",
          p: [
            "The PDF keeps the exact A4 page size and is the safest choice for printing. The JPG is easier to send on WhatsApp to a print shop. Both contain the same sheet.",
            "Glossy photo paper gives the most studio-like result. Plain paper is fine for practice or for forms that only need a pasted copy, but it fades faster.",
          ],
        },
        {
          h: "Need a different shape first?",
          p: [
            "If your photo includes too much background, or your face is not centred, crop it first with the Crop image tool. Choose the Passport shape so the box stays in proportion, drag the box and tap “Crop”, then “Download”, and open the result in the print sheet tool.",
            "For an online upload rather than a print, use the Photo resizer instead. It makes a single photo at the pixel size and KB your form asks for.",
          ],
        },
        {
          h: "Your photo stays on your device",
          p: [
            "The sheet is drawn inside your browser. Your photo is not uploaded to any server, and only you decide where the downloaded PDF or JPG goes.",
          ],
        },
      ],
      faq: [
        {
          q: "Why do my printed photos come out smaller than 3.5 × 4.5 cm?",
          a: "The printer is scaling the page. Choose 100% scale or “Actual size” in the print settings instead of “Fit to page”, and print on A4 paper.",
        },
        {
          q: "Why did the size change to stamp when I picked 32?",
          a: "32 passport-size photos do not fit on one A4 page, so stamp size is used. Pick 8 or 16 to keep passport size.",
        },
        {
          q: "Is 3.5 × 4.5 cm the official passport photo size?",
          a: "It is a common size, but requirements differ between forms, offices and countries. Always check the size and rules given on the form you are submitting.",
        },
        {
          q: "Can I print the sheet from my phone?",
          a: "Yes, if your phone is connected to a printer. Otherwise send the PDF or JPG to a print shop. In both cases, print at actual size.",
        },
        {
          q: "Is my photo uploaded?",
          a: "No. The sheet is created in your browser and the photo never leaves your device.",
        },
      ],
    },
    hi: {
      title: "पासपोर्ट साइज़ फोटो की A4 शीट कैसे बनाएँ (प्रिंट के लिए, फ्री)",
      description:
        "एक फोटो से 8, 16 या 32 पासपोर्ट साइज़ फोटो वाली A4 शीट बनाएँ, घर पर या दुकान पर प्रिंट के लिए तैयार। फ्री, ब्राउज़र में, और फोटो कहीं अपलोड नहीं होती।",
      intro:
        "फ़ॉर्म, एडमिशन और ID कार्ड के लिए बार-बार पासपोर्ट साइज़ फोटो चाहिए होती हैं, और हर बार स्टूडियो जाना महँगा पड़ता है। एक अच्छी फोटो से आप खुद पूरी A4 शीट बना सकते हैं और घर पर या किसी भी प्रिंट की दुकान पर छपवा सकते हैं। यहाँ पूरा तरीका है, और वह प्रिंट सेटिंग भी जिसमें ज़्यादातर लोग गलती करते हैं।",
      sections: [
        {
          h: "क्या चाहिए",
          p: [
            "बस सामने से खींची एक साफ़ फोटो, सादे हल्के बैकग्राउंड के साथ और अच्छी रोशनी में। फ़ोन का कैमरा काफ़ी है। दीवार से थोड़ा आगे खड़े हों ताकि पीछे छाया न पड़े, कैमरे की ओर सीधे देखें और पूरा चेहरा साफ़ दिखे।",
            "पासपोर्ट फोटो का साइज़ और बैकग्राउंड, चेहरे के साइज़ या भाव के नियम हर फ़ॉर्म और दफ़्तर में अलग होते हैं, इसलिए जिस फ़ॉर्म के लिए फोटो चाहिए उसे ज़रूर देखें। यह टूल दो आम साइज़ देता है: पासपोर्ट (3.5 × 4.5 cm) और स्टाम्प (2.5 × 3 cm)।",
          ],
        },
        {
          h: "तरीका: शीट बनाएँ",
          p: ["इस साइट पर “पासपोर्ट फोटो प्रिंट शीट” टूल खोलें।"],
          list: [
            "“फोटो चुनें” दबाकर सामने से खींची फोटो लें।",
            "क्रॉप बॉक्स खींचकर चेहरा गाइड के अंदर रखें।",
            "“फोटो की संख्या” (8, 16 या 32) और “फोटो साइज़” चुनें।",
            "“प्रिंट शीट बनाएँ” दबाएँ।",
            "तैयार शीट के नीचे PDF या JPG वाला डाउनलोड बटन दबाएँ।",
          ],
          ordered: true,
        },
        {
          h: "A4 पर कितनी फोटो आती हैं?",
          p: [
            "A4 पेज 21 × 29.7 cm का होता है। पासपोर्ट साइज़ की 8 या 16 फोटो एक पेज पर, काटने की लाइनों के साथ, आ जाती हैं। 32 पासपोर्ट साइज़ फोटो नहीं आतीं, इसलिए 32 चुनने पर टूल स्टाम्प साइज़ कर देता है, और कोई चुनाव फ़िट न हो तो मैसेज दिखता है।",
            "शीट 300 DPI पर बनती है, जो फोटो प्रिंट के लिए काफ़ी साफ़ है। इस हिसाब से 3.5 × 4.5 cm की फोटो 413 × 531 पिक्सल की होती है, इसलिए चेहरे के आसपास कम से कम इतनी बड़ी फोटो से शुरू करें।",
          ],
        },
        {
          h: "“Actual size” पर प्रिंट करें, “Fit to page” पर नहीं",
          p: [
            "ज़्यादातर गड़बड़ यहीं होती है। कई प्रिंटर और फ़ोन के प्रिंट विकल्प पेज को “फ़िट” करने के लिए थोड़ा छोटा कर देते हैं, और फिर हर फोटो सही साइज़ से थोड़ी छोटी छपती है।",
            "प्रिंट सेटिंग में 100% स्केल या “Actual size” चुनें, “Fit to page” नहीं। फ़ाइल दुकान पर ले जाएँ तो A4 पर actual size में छापने को कहें। पूरी शीट काटने से पहले एक छपी फोटो को स्केल से नापकर देख लें।",
          ],
        },
        {
          h: "PDF लें या JPG?",
          p: [
            "PDF में A4 पेज का साइज़ बिल्कुल सही रहता है, प्रिंट के लिए यह सबसे सुरक्षित है। JPG को WhatsApp पर प्रिंट वाले को भेजना आसान है। दोनों में शीट एक जैसी है।",
            "चमकीले फोटो पेपर पर स्टूडियो जैसा नतीजा आता है। सादा कागज़ अभ्यास के लिए या सिर्फ़ चिपकाने वाले फ़ॉर्म के लिए ठीक है, पर उस पर फोटो जल्दी फीकी पड़ती है।",
          ],
        },
        {
          h: "पहले आकार ठीक करना है?",
          p: [
            "फोटो में बैकग्राउंड बहुत ज़्यादा हो या चेहरा बीच में न हो, तो पहले “इमेज क्रॉप करें” टूल से क्रॉप करें। पासपोर्ट आकार चुनें ताकि बॉक्स सही अनुपात में रहे, बॉक्स खींचें, “क्रॉप करें” और फिर “डाउनलोड” दबाएँ, और वह फोटो प्रिंट शीट टूल में खोलें।",
            "प्रिंट की जगह ऑनलाइन अपलोड के लिए फोटो चाहिए तो “फोटो रिसाइज़र” इस्तेमाल करें। वह फ़ॉर्म के माँगे पिक्सल और KB में एक फोटो बनाता है।",
          ],
        },
        {
          h: "आपकी फोटो आपके डिवाइस पर ही रहती है",
          p: [
            "शीट आपके ब्राउज़र में ही बनती है। फोटो किसी सर्वर पर अपलोड नहीं होती, और डाउनलोड हुई PDF या JPG कहाँ जाएगी, यह सिर्फ़ आप तय करते हैं।",
          ],
        },
      ],
      faq: [
        {
          q: "छपी हुई फोटो 3.5 × 4.5 cm से छोटी क्यों आ रही हैं?",
          a: "प्रिंटर पेज को छोटा-बड़ा कर रहा है। प्रिंट सेटिंग में “Fit to page” की जगह 100% स्केल या “Actual size” चुनें, और A4 कागज़ पर छापें।",
        },
        {
          q: "32 चुनने पर साइज़ स्टाम्प क्यों हो गया?",
          a: "32 पासपोर्ट साइज़ फोटो एक A4 पेज पर नहीं आतीं, इसलिए स्टाम्प साइज़ लिया जाता है। पासपोर्ट साइज़ चाहिए तो 8 या 16 चुनें।",
        },
        {
          q: "क्या 3.5 × 4.5 cm ही सरकारी पासपोर्ट फोटो साइज़ है?",
          a: "यह एक आम साइज़ है, पर हर फ़ॉर्म, दफ़्तर और देश के नियम अलग हो सकते हैं। जिस फ़ॉर्म में फोटो लगानी है, उसमें दिया साइज़ और नियम ज़रूर देखें।",
        },
        {
          q: "क्या फ़ोन से ही शीट प्रिंट कर सकते हैं?",
          a: "हाँ, अगर फ़ोन प्रिंटर से जुड़ा है। नहीं तो PDF या JPG प्रिंट की दुकान पर भेज दें। दोनों में actual size पर ही छपवाएँ।",
        },
        {
          q: "क्या मेरी फोटो अपलोड होती है?",
          a: "नहीं। शीट आपके ब्राउज़र में बनती है और फोटो आपके डिवाइस से बाहर नहीं जाती।",
        },
      ],
    },
  },
];
