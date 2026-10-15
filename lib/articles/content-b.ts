import type { Article } from "./types";

export const articlesB: Article[] = [
  // 1. Image to text
  {
    slug: "how-to-extract-text-from-image",
    tools: ["image-to-text"],
    published: "2026-10-15",
    en: {
      title: "How to Extract Text from an Image (Hindi and English OCR, Free)",
      description: "Copy Hindi or English text from a photo or screenshot for free. Step by step OCR guide that works on your phone, with no image upload.",
      intro: "Typing out a notice, a certificate or a page from a book by hand is slow and full of mistakes. An image to text tool, also called OCR, reads the letters in a photo and gives you text you can copy, edit and paste. This guide shows how to do it for Hindi and English, right in your browser.",
      sections: [
        {
          h: "What “image to text” (OCR) actually does",
          p: [
            "OCR stands for optical character recognition. The tool looks at the shapes in your photo, works out which letters they are, and turns them into normal text. The result is something you can paste into a form, a WhatsApp message, a Word file or your notes.",
            "It works best on clear, printed text: notices, typed letters, printed forms, book pages and screenshots. Handwriting is much harder, and the result is often wrong, so treat it as a rough draft at best.",
          ],
        },
        {
          h: "How to extract text from an image, step by step",
          p: ["You can use the FormSaathi Image to text (OCR) tool on a phone or a computer. There is no sign up."],
          list: [
            "Open the Image to text tool and tap “Choose image”, or “Take photo” to use your camera. On a computer you can also drop an image on the page or paste one with Ctrl+V. JPG, PNG and WebP are supported.",
            "Under “Text language”, pick Hindi, English, or Hindi + English if the page mixes both.",
            "Tap “Get text”. The tool first prepares the image and then shows the reading progress.",
            "Check the text in the box. You can edit it right there to fix any wrong letters.",
            "Tap “Copy” to paste it anywhere, or “Download .txt” to save it as a text file.",
          ],
          ordered: true,
        },
        {
          h: "Choosing the right language matters",
          p: [
            "The tool reads text using a language model for Hindi, for English, or for both together. If you pick English for a Hindi notice, you will get strange symbols instead of words. If your page has Hindi headings with English names and numbers, choose Hindi + English.",
            "The first time you use a language, the tool downloads its language data, which is a few MB. The page shows the size before you start. After that it is stored in your browser and the tool also works offline.",
          ],
        },
        {
          h: "Tips for a cleaner result",
          p: ["Most OCR mistakes come from the photo, not the tool. A few small habits make a big difference."],
          list: [
            "Use good light with no shadow or glare on the page.",
            "Hold the phone straight above the page so the lines are level, not tilted.",
            "Crop the photo to just the part you need. Less clutter means faster and cleaner text.",
            "Use a screenshot instead of a photo of a screen whenever you can.",
            "If nothing is found, try a sharper photo or check that the right language is selected.",
          ],
        },
        {
          h: "Your image stays on your device",
          p: [
            "Many online OCR sites upload your picture to their server. That is a real worry when the image is an Aadhaar card, a marksheet or a bank letter. FormSaathi reads the text inside your browser on your own phone or computer. The image is never uploaded, and the text is not sent anywhere either.",
          ],
        },
        {
          h: "Always check before you use the text in a form",
          p: [
            "OCR can confuse similar looking characters, such as 0 and O, 1 and l, or some Hindi matras. Names, roll numbers, dates and registration numbers must be exact on a government form. Read the extracted text once against the original before you paste it into any application.",
          ],
        },
      ],
      faq: [
        { q: "Can I extract Hindi text from a photo?", a: "Yes. Choose Hindi as the text language, or Hindi + English if the page has both. Printed Devanagari text gives the best results." },
        { q: "Does it read handwriting?", a: "It may pick up some words, but handwriting is often read wrongly. The tool is built for printed text and screenshots." },
        { q: "Is my image uploaded to a server?", a: "No. The text is read inside your browser on your own device. Your image never leaves your phone or computer." },
        { q: "Why does it need the internet the first time?", a: "The first use of each language downloads its language data. After that it is saved in your browser and the tool works offline." },
        { q: "Can I edit the text before copying it?", a: "Yes. The result appears in an editable box, so you can fix mistakes, then copy it or download it as a .txt file." },
      ],
    },
    hi: {
      title: "फोटो से टेक्स्ट कैसे निकालें (हिंदी और English OCR, फ्री)",
      description: "किसी फोटो या स्क्रीनशॉट से हिंदी या English टेक्स्ट मुफ़्त में कॉपी करें। फोन पर चलने वाला आसान OCR तरीका, फोटो कहीं अपलोड नहीं होती।",
      intro: "किसी नोटिस, सर्टिफिकेट या किताब के पेज को हाथ से टाइप करना थकाने वाला काम है और गलतियाँ भी होती हैं। फोटो से टेक्स्ट निकालने वाला टूल, जिसे OCR कहते हैं, फोटो के अक्षर पढ़कर आपको ऐसा टेक्स्ट देता है जिसे आप कॉपी और बदल सकते हैं। यहाँ जानिए हिंदी और English दोनों के लिए यह कैसे करें।",
      sections: [
        {
          h: "OCR असल में क्या करता है",
          p: [
            "OCR फोटो में बनी आकृतियों को देखकर पहचानता है कि कौन-सा अक्षर है, और उन्हें सामान्य टेक्स्ट में बदल देता है। यह टेक्स्ट आप किसी फ़ॉर्म, WhatsApp मैसेज या नोट्स में चिपका सकते हैं।",
            "छपा हुआ साफ़ टेक्स्ट सबसे अच्छा पढ़ा जाता है, जैसे नोटिस, टाइप किए पत्र, किताब के पेज और स्क्रीनशॉट। हाथ की लिखावट अक्सर गलत पढ़ी जाती है, इसलिए उस पर ज़्यादा भरोसा न करें।",
          ],
        },
        {
          h: "फोटो से टेक्स्ट निकालने के स्टेप",
          p: ["FormSaathi का Image to text (OCR) टूल फोन और कंप्यूटर दोनों पर चलता है, कोई लॉगिन नहीं चाहिए।"],
          list: [
            "टूल खोलें और “फोटो चुनें” दबाएँ, या कैमरे से लेने के लिए “फोटो खींचें”। कंप्यूटर पर फोटो पेज पर छोड़ भी सकते हैं या Ctrl+V से पेस्ट कर सकते हैं। JPG, PNG और WebP चलती हैं।",
            "“लिखावट की भाषा” में हिंदी, English, या दोनों मिले हों तो हिंदी + English चुनें।",
            "“टेक्स्ट निकालें” दबाएँ। पहले फोटो तैयार होगी, फिर पढ़ने की प्रगति दिखेगी।",
            "बॉक्स में आया टेक्स्ट देखें। गलत अक्षर वहीं ठीक कर सकते हैं।",
            "“कॉपी करें” से कहीं भी चिपकाएँ, या “.txt डाउनलोड करें” से फ़ाइल सेव करें।",
          ],
          ordered: true,
        },
        {
          h: "सही भाषा चुनना क्यों ज़रूरी है",
          p: [
            "अगर हिंदी नोटिस के लिए English चुन लेंगे तो शब्दों की जगह अजीब निशान आएँगे। जिस पेज पर हिंदी के साथ अंग्रेज़ी नाम या नंबर भी हों, वहाँ हिंदी + English चुनें।",
            "किसी भाषा को पहली बार चलाने पर उसका भाषा डेटा डाउनलोड होता है, जो कुछ MB का होता है। पेज पर इसका साइज़ पहले से दिखता है। उसके बाद यह ब्राउज़र में सेव रहता है और टूल बिना इंटरनेट भी चलता है।",
          ],
        },
        {
          h: "साफ़ नतीजे के लिए कुछ आसान बातें",
          p: ["ज़्यादातर गलतियाँ फोटो की वजह से होती हैं, टूल की वजह से नहीं।"],
          list: [
            "अच्छी रोशनी रखें, पेज पर छाया या चमक न हो।",
            "फोन को पेज के ठीक ऊपर सीधा रखें ताकि लाइनें टेढ़ी न हों।",
            "सिर्फ़ ज़रूरी हिस्सा क्रॉप करें, इससे काम तेज़ और साफ़ होगा।",
            "स्क्रीन की फोटो खींचने के बजाय स्क्रीनशॉट लें।",
            "कुछ न मिले तो साफ़ फोटो लें या भाषा दोबारा जाँचें।",
          ],
        },
        {
          h: "आपकी फोटो आपके फोन में ही रहती है",
          p: [
            "बहुत सी OCR वेबसाइटें आपकी फोटो अपने सर्वर पर भेजती हैं। आधार कार्ड, मार्कशीट या बैंक के कागज़ के लिए यह ठीक नहीं। FormSaathi में टेक्स्ट आपके ब्राउज़र में, आपके ही फोन या कंप्यूटर पर पढ़ा जाता है। फोटो कहीं अपलोड नहीं होती और टेक्स्ट भी कहीं नहीं जाता।",
          ],
        },
        {
          h: "फ़ॉर्म में डालने से पहले एक बार ज़रूर मिलाएँ",
          p: [
            "OCR कभी-कभी मिलते-जुलते अक्षरों में गड़बड़ कर देता है, जैसे 0 और O, 1 और l, या कुछ मात्राएँ। सरकारी फ़ॉर्म में नाम, रोल नंबर और तारीख बिल्कुल सही होने चाहिए, इसलिए निकाले गए टेक्स्ट को असली कागज़ से एक बार मिला लें।",
          ],
        },
      ],
      faq: [
        { q: "क्या फोटो से हिंदी टेक्स्ट निकल सकता है?", a: "हाँ। भाषा में हिंदी चुनें, या पेज पर दोनों भाषाएँ हों तो हिंदी + English। छपा हुआ देवनागरी टेक्स्ट सबसे अच्छा पढ़ा जाता है।" },
        { q: "क्या हाथ की लिखावट पढ़ी जाती है?", a: "कुछ शब्द पढ़ लिए जाएँ, पर लिखावट अक्सर गलत पढ़ी जाती है। यह टूल छपे टेक्स्ट और स्क्रीनशॉट के लिए बना है।" },
        { q: "क्या मेरी फोटो किसी सर्वर पर जाती है?", a: "नहीं। टेक्स्ट आपके ब्राउज़र में ही पढ़ा जाता है। फोटो आपके फोन या कंप्यूटर से बाहर नहीं जाती।" },
        { q: "पहली बार इंटरनेट क्यों चाहिए?", a: "हर भाषा पहली बार चलाने पर उसका भाषा डेटा डाउनलोड होता है। उसके बाद टूल बिना इंटरनेट चलता है।" },
        { q: "क्या कॉपी करने से पहले टेक्स्ट बदल सकते हैं?", a: "हाँ। नतीजा ऐसे बॉक्स में आता है जिसमें आप सुधार कर सकते हैं, फिर कॉपी करें या .txt फ़ाइल डाउनलोड करें।" },
      ],
    },
  },

  // 2. Merge PDF
  {
    slug: "how-to-merge-pdf-files",
    tools: ["pdf-merge", "pdf-compress"],
    published: "2026-10-15",
    en: {
      title: "How to Merge PDF Files into One (Free, on Your Phone)",
      description: "Join several PDF files into one in the order you want, free and without uploading. Then shrink the merged PDF to the KB size your form allows.",
      intro: "Many online forms ask for one PDF, but your marksheets, certificates and ID proofs are often in separate files. Merging them puts everything into a single file in the right order. Here is how to do it on a phone or computer, without sending your documents to anyone.",
      sections: [
        {
          h: "When you need to merge PDFs",
          p: [
            "A form may have a single upload box for “educational certificates” or “supporting documents”. A college or office may ask you to email one combined file. Or you simply want your 10th and 12th marksheets together so they are easy to find later.",
            "Merging keeps each page as it is. It does not change the text or the quality of the pages, it only joins the files one after another.",
            "If some of your documents are photos rather than PDFs, turn them into a PDF first with the Images to PDF tool, then merge that file with the rest.",
          ],
        },
        {
          h: "How to merge PDF files, step by step",
          p: ["Use the FormSaathi Merge PDFs tool. It works in your browser on Android, iPhone and computers."],
          list: [
            "Open Merge PDFs and tap “Choose PDFs”. You can select several files at once.",
            "To add files from another folder, tap “Add more”.",
            "Set the order with the up and down arrows next to each file. Remove a wrong file with the remove button.",
            "When you have at least two PDFs, tap “Merge PDFs”.",
            "Check the result line, which shows the size in KB and the total number of pages, then tap “Download PDF”.",
          ],
          ordered: true,
        },
        {
          h: "Get the order right before you merge",
          p: [
            "The pages come out in the same order as the list. Put documents in a sensible order, for example from the oldest qualification to the newest, or in the order the form lists them. If the notification says how the documents should be arranged, follow that.",
            "Open the downloaded file once and scroll through it. Missing pages or pages in the wrong order are a common reason for documents being rejected.",
          ],
        },
        {
          h: "Merged file too big? Compress it next",
          p: [
            "Joining files adds up their sizes, so a merged PDF is often larger than the upload limit. Use the Compress PDF to KB tool after merging.",
          ],
          list: [
            "Tap “Choose PDF” and pick the merged file.",
            "Under “Target size”, tap 100, 200, 300 or 500 KB, or type your own number in “Custom KB”.",
            "Tap “Compress PDF” and wait while each page is processed.",
            "Download the new file and check that every page is still readable.",
          ],
          ordered: true,
        },
        {
          h: "What compression does to your pages",
          p: [
            "If the PDF is already under your target, it is kept exactly as it is, with no loss of quality. If it is larger, the pages are turned into images to reach the size. That means the text can no longer be selected, so zoom in and confirm that small print, marks and stamps are still clear. If not, try a bigger target size.",
            "Always use the KB limit given in the official notification or on the form itself. Limits are different for every form and can change.",
          ],
        },
        {
          h: "Private by design",
          p: [
            "Your marksheets and ID proofs contain personal details. FormSaathi merges and compresses PDFs inside your browser, so the files never leave your phone or computer and nothing is uploaded to a server.",
          ],
        },
      ],
      faq: [
        { q: "How many PDFs can I merge at once?", a: "You need at least two. You can keep adding files with “Add more”. Very large files depend on your phone’s memory." },
        { q: "Can I change the order of the files?", a: "Yes. Use the up and down arrows next to each file before you tap “Merge PDFs”. The pages follow that order." },
        { q: "Does merging reduce quality?", a: "No. Merging only joins the pages. Quality changes only if you then compress the file to a smaller KB size." },
        { q: "Can I merge a password protected PDF?", a: "No. A locked PDF cannot be opened by the tool. Remove the password with the app that created it, then try again." },
        { q: "Are my documents uploaded?", a: "No. Everything happens inside your browser on your own device. Your files are never sent anywhere." },
      ],
    },
    hi: {
      title: "कई PDF को एक PDF में कैसे जोड़ें (फ्री, फोन पर)",
      description: "कई PDF फ़ाइलों को अपनी पसंद के क्रम में एक फ़ाइल में जोड़ें, बिना अपलोड किए। फिर उसे फ़ॉर्म की KB लिमिट तक छोटा करें।",
      intro: "कई ऑनलाइन फ़ॉर्म एक ही PDF माँगते हैं, जबकि आपकी मार्कशीट, सर्टिफिकेट और पहचान पत्र अलग-अलग फ़ाइलों में होते हैं। इन्हें जोड़ने से सब कुछ सही क्रम में एक फ़ाइल में आ जाता है। जानिए फोन या कंप्यूटर पर यह कैसे करें, वो भी बिना अपने कागज़ किसी को भेजे।",
      sections: [
        {
          h: "PDF जोड़ने की ज़रूरत कब पड़ती है",
          p: [
            "किसी फ़ॉर्म में “शैक्षणिक प्रमाण पत्र” के लिए एक ही अपलोड बॉक्स होता है। कोई कॉलेज या दफ़्तर एक ही फ़ाइल ईमेल करने को कहता है। या आप बस 10वीं और 12वीं की मार्कशीट एक साथ रखना चाहते हैं।",
            "जोड़ने से पेजों में कोई बदलाव नहीं होता। क्वालिटी वैसी ही रहती है, फ़ाइलें बस एक के बाद एक लग जाती हैं।",
            "अगर कुछ कागज़ PDF नहीं बल्कि फोटो हैं, तो पहले Images to PDF टूल से उनकी PDF बनाएँ, फिर उसे बाकी फ़ाइलों के साथ जोड़ें।",
          ],
        },
        {
          h: "PDF जोड़ने के स्टेप",
          p: ["FormSaathi का Merge PDFs टूल Android, iPhone और कंप्यूटर के ब्राउज़र में चलता है।"],
          list: [
            "टूल खोलें और “PDF चुनें” दबाएँ। एक साथ कई फ़ाइलें चुन सकते हैं।",
            "किसी दूसरे फ़ोल्डर की फ़ाइल डालनी हो तो “और जोड़ें” दबाएँ।",
            "हर फ़ाइल के पास बने ऊपर और नीचे वाले तीर से क्रम ठीक करें। गलत फ़ाइल “हटाएँ” से निकाल दें।",
            "कम से कम दो PDF होने पर “PDF जोड़ें” दबाएँ।",
            "नतीजे में KB साइज़ और कुल पेज दिखेंगे। फिर “PDF डाउनलोड करें” दबाएँ।",
          ],
          ordered: true,
        },
        {
          h: "जोड़ने से पहले क्रम ठीक कर लें",
          p: [
            "पेज उसी क्रम में आते हैं जिसमें लिस्ट में फ़ाइलें हैं। समझदारी वाला क्रम रखें, जैसे पुरानी पढ़ाई से नई तक, या जिस क्रम में फ़ॉर्म में लिखा हो। अगर नोटिफ़िकेशन में क्रम बताया गया है तो वही मानें।",
            "डाउनलोड के बाद फ़ाइल एक बार खोलकर पूरी देख लें। पेज छूट जाना या उल्टा क्रम, कागज़ रिजेक्ट होने की आम वजह है।",
          ],
        },
        {
          h: "जुड़ी हुई फ़ाइल बड़ी हो गई? उसे कंप्रेस करें",
          p: ["फ़ाइलें जोड़ने से साइज़ भी जुड़ जाता है, इसलिए अक्सर फ़ाइल अपलोड लिमिट से बड़ी हो जाती है। तब Compress PDF to KB टूल इस्तेमाल करें।"],
          list: [
            "“PDF चुनें” दबाकर जुड़ी हुई फ़ाइल चुनें।",
            "“लक्ष्य साइज़” में 100, 200, 300 या 500 KB चुनें, या “अपना KB” में खुद नंबर लिखें।",
            "“PDF कंप्रेस करें” दबाएँ और हर पेज के बनने तक रुकें।",
            "नई फ़ाइल डाउनलोड करें और देखें कि हर पेज पढ़ने में आ रहा है।",
          ],
          ordered: true,
        },
        {
          h: "कंप्रेस करने पर पेजों का क्या होता है",
          p: [
            "अगर PDF पहले से ही लक्ष्य साइज़ से छोटी है, तो वह जैसी है वैसी रखी जाती है। बड़ी हो तो साइज़ घटाने के लिए पेज इमेज में बदल दिए जाते हैं, इसलिए टेक्स्ट सेलेक्ट नहीं होगा। ज़ूम करके देखें कि छोटे अक्षर, नंबर और मुहर साफ़ हैं। धुंधले हों तो बड़ा साइज़ चुनें।",
            "KB लिमिट हमेशा ऑफ़िशियल नोटिफ़िकेशन या फ़ॉर्म में लिखी हुई ही मानें। हर फ़ॉर्म की लिमिट अलग होती है और बदल भी सकती है।",
          ],
        },
        {
          h: "आपके कागज़ आपके पास ही",
          p: [
            "मार्कशीट और पहचान पत्र में निजी जानकारी होती है। FormSaathi में PDF जोड़ना और छोटा करना आपके ब्राउज़र में ही होता है। फ़ाइलें आपके फोन या कंप्यूटर से बाहर नहीं जातीं, कुछ भी अपलोड नहीं होता।",
          ],
        },
      ],
      faq: [
        { q: "एक बार में कितनी PDF जोड़ सकते हैं?", a: "कम से कम दो चाहिए। “और जोड़ें” से फ़ाइलें बढ़ाते रह सकते हैं। बहुत बड़ी फ़ाइलें फोन की मेमोरी पर निर्भर करती हैं।" },
        { q: "क्या फ़ाइलों का क्रम बदल सकते हैं?", a: "हाँ। “PDF जोड़ें” दबाने से पहले ऊपर और नीचे वाले तीर से क्रम बदलें। पेज उसी क्रम में आएँगे।" },
        { q: "क्या जोड़ने से क्वालिटी कम होती है?", a: "नहीं। जोड़ने में सिर्फ़ पेज एक साथ लगते हैं। क्वालिटी तभी बदलती है जब आप फ़ाइल को कम KB में कंप्रेस करते हैं।" },
        { q: "पासवर्ड वाली PDF जुड़ सकती है?", a: "नहीं। लॉक PDF टूल में नहीं खुलती। पहले उसका पासवर्ड हटाएँ, फिर कोशिश करें।" },
        { q: "क्या मेरे कागज़ अपलोड होते हैं?", a: "नहीं। सारा काम आपके ब्राउज़र में आपके ही फोन या कंप्यूटर पर होता है।" },
      ],
    },
  },

  // 3. Crop photo
  {
    slug: "how-to-crop-photo-online",
    tools: ["crop-image", "resize-image"],
    published: "2026-10-15",
    en: {
      title: "How to Crop a Photo Online (Square, Passport or Any Shape)",
      description: "Crop any photo to square, 4:3, 16:9, passport or a custom shape in your browser. Free, works on phones, and your photo is never uploaded.",
      intro: "Cropping cuts away the parts of a photo you do not need, like a cluttered background or extra space around a document. It is also the first step before resizing a photo for a form. This guide shows how to crop to the shape you want, quickly and privately.",
      sections: [
        {
          h: "Why crop before you resize",
          p: [
            "Resizing changes how many pixels a photo has, but it keeps the same shape. If you resize a wide phone photo into a tall box, the face gets stretched or squashed. Cropping first to the right shape avoids that.",
            "Cropping also removes things that should not be in the picture, such as a hand holding a certificate, a messy table, or the edge of another page.",
          ],
        },
        {
          h: "How to crop a photo, step by step",
          p: ["Open the FormSaathi Crop image tool. It is part of a small photo editor, so the same screen also has tabs to resize, compress and convert."],
          list: [
            "Tap “Choose image” or “Take photo”. You can also drop or paste an image. JPG, PNG, WebP, GIF and BMP open.",
            "Make sure the Crop tab is selected.",
            "Under “Shape”, pick Free, 1:1, 4:3, 16:9, 3:4, Passport 3.5×4.5 cm, or Custom to type your own width to height ratio.",
            "Drag the box to move it over the part you want. Drag the round handle to make it bigger or smaller, or use the “Crop box size” slider.",
            "Tap “Crop”, then tap “Download” to save the result.",
          ],
          ordered: true,
        },
        {
          h: "Which shape should you choose?",
          p: ["The shape is the ratio of width to height. Pick it based on where the photo will be used."],
          list: [
            "1:1 for a square profile picture.",
            "3:4 or Passport for a portrait style photo of a person.",
            "4:3 or 16:9 for landscape pictures and screenshots.",
            "Free when you just want to trim the edges of a document.",
            "Custom when a form asks for a box with specific proportions, for example matching a width and height in pixels.",
          ],
        },
        {
          h: "Then resize to the exact size",
          p: [
            "After cropping, switch to the Resize tab, or open the Resize image tool. Choose “By percentage” to scale everything down, or “By size” to type a width and height. The unit can be pixels, centimetres or inches, with a DPI setting for cm and inches. Keep “Keep proportions” on so the photo is not stretched, then tap “Apply”.",
            "If an upload box also has a KB limit, use the Compress tab after that. For an exam photo, check the sizes in the official notification first, because every exam sets its own rules.",
          ],
        },
        {
          h: "Undo and start again freely",
          p: [
            "Every change can be undone with “Undo”, and “Start over” takes you back to the original photo. The screen shows the current size in pixels and KB, so you always know what you will download.",
            "If the photo is sideways, fix it in the Rotate tab before cropping. Cropping a tilted or turned photo often cuts off the part you wanted to keep.",
          ],
        },
        {
          h: "Your photo is not uploaded",
          p: [
            "Many photo sites send your image to a server to process it. FormSaathi crops, resizes and saves your photo inside your browser. The picture never leaves your phone or computer, which matters when it shows your face, your ID or your documents.",
          ],
        },
      ],
      faq: [
        { q: "How do I crop a photo into a perfect square?", a: "Choose the 1:1 shape, move the box over the part you want, and tap “Crop”. The result will be exactly square." },
        { q: "Is there a passport photo crop option?", a: "Yes. The Passport 3.5×4.5 cm shape keeps the right proportions. For a printed sheet of photos, use the Passport photo print sheet tool." },
        { q: "Will cropping reduce the quality?", a: "No. Cropping only removes the outer parts. The pixels you keep stay the same. Quality changes only if you then compress the photo." },
        { q: "Can I crop on my phone?", a: "Yes. Drag the box with your finger to move it and drag the round handle to resize it." },
        { q: "Is my photo uploaded anywhere?", a: "No. All editing happens in your browser on your own device." },
      ],
    },
    hi: {
      title: "फोटो ऑनलाइन क्रॉप कैसे करें (चौकोर, पासपोर्ट या किसी भी आकार में)",
      description: "किसी भी फोटो को चौकोर, 4:3, 16:9, पासपोर्ट या अपने आकार में ब्राउज़र में ही क्रॉप करें। फ्री, फोन पर चलता है, फोटो अपलोड नहीं होती।",
      intro: "क्रॉप करने का मतलब है फोटो का बेकार हिस्सा काटकर हटाना, जैसे पीछे का बिखरा सामान या कागज़ के आसपास की खाली जगह। फ़ॉर्म के लिए फोटो का साइज़ बदलने से पहले भी यही पहला काम है। यहाँ जानिए फोटो को मनचाहे आकार में जल्दी और सुरक्षित तरीके से कैसे काटें।",
      sections: [
        {
          h: "साइज़ बदलने से पहले क्रॉप क्यों करें",
          p: [
            "साइज़ बदलने से पिक्सल कम या ज़्यादा होते हैं, पर फोटो की शेप वही रहती है। चौड़ी फोटो को लंबे बॉक्स में ज़बरदस्ती फ़िट करेंगे तो चेहरा खिंचा या दबा दिखेगा। पहले सही शेप में क्रॉप करने से यह दिक्कत नहीं आती।",
            "क्रॉप से वो चीज़ें भी हट जाती हैं जो फोटो में नहीं होनी चाहिए, जैसे कागज़ पकड़ा हुआ हाथ, मेज़ का सामान या दूसरे पेज का किनारा।",
          ],
        },
        {
          h: "फोटो क्रॉप करने के स्टेप",
          p: ["FormSaathi का Crop image टूल खोलें। यह एक छोटे फोटो एडिटर का हिस्सा है, इसलिए उसी स्क्रीन पर साइज़ बदलने, KB कम करने और फ़ॉर्मेट बदलने के टैब भी हैं।"],
          list: [
            "“फ़ोटो चुनें” या “फोटो खींचें” दबाएँ। फोटो छोड़ या पेस्ट भी कर सकते हैं। JPG, PNG, WebP, GIF और BMP खुलती हैं।",
            "देखें कि “क्रॉप” टैब चुना हुआ है।",
            "“आकार” में फ़्री, 1:1, 4:3, 16:9, 3:4, पासपोर्ट 3.5×4.5 cm, या अपना अनुपात लिखने के लिए “अपना” चुनें।",
            "बॉक्स को खींचकर ज़रूरी हिस्से पर लाएँ। गोल हैंडल खींचकर बॉक्स छोटा-बड़ा करें, या “क्रॉप बॉक्स का साइज़” स्लाइडर इस्तेमाल करें।",
            "“क्रॉप करें” दबाएँ, फिर “डाउनलोड” से सेव करें।",
          ],
          ordered: true,
        },
        {
          h: "कौन-सा आकार चुनें",
          p: ["आकार यानी चौड़ाई और ऊँचाई का अनुपात। फोटो कहाँ लगनी है, उसी हिसाब से चुनें।"],
          list: [
            "प्रोफ़ाइल फोटो के लिए 1:1 यानी चौकोर।",
            "किसी व्यक्ति की खड़ी फोटो के लिए 3:4 या पासपोर्ट।",
            "आड़ी फोटो और स्क्रीनशॉट के लिए 4:3 या 16:9।",
            "कागज़ के किनारे काटने हों तो फ़्री।",
            "फ़ॉर्म में तय चौड़ाई और ऊँचाई वाला बॉक्स हो तो “अपना” में वही अनुपात डालें।",
          ],
        },
        {
          h: "फिर सही साइज़ में बदलें",
          p: [
            "क्रॉप के बाद “साइज़” टैब पर जाएँ, या Resize image टूल खोलें। सब कुछ एक साथ छोटा करना हो तो “प्रतिशत से”, और चौड़ाई-ऊँचाई लिखनी हो तो “साइज़ डालकर” चुनें। इकाई पिक्सल, सेंटीमीटर या इंच हो सकती है, cm और इंच के लिए DPI भी डाल सकते हैं। “अनुपात वही रखें” चालू रखें ताकि फोटो न खिंचे, फिर “लागू करें” दबाएँ।",
            "अगर KB की लिमिट भी है तो उसके बाद “KB कम” टैब इस्तेमाल करें। परीक्षा की फोटो के लिए साइज़ हमेशा ऑफ़िशियल नोटिफ़िकेशन से देखें, क्योंकि हर परीक्षा के नियम अलग होते हैं।",
          ],
        },
        {
          h: "गलती हो तो वापस जाएँ",
          p: [
            "हर बदलाव “पहले जैसा” से वापस हो सकता है, और “फिर से शुरू” से असली फोटो पर लौट सकते हैं। स्क्रीन पर अभी का साइज़ पिक्सल और KB में दिखता रहता है।",
            "फोटो टेढ़ी या उल्टी हो तो क्रॉप से पहले “घुमाएँ” टैब में उसे सीधा कर लें। घूमी हुई फोटो क्रॉप करने पर अक्सर ज़रूरी हिस्सा कट जाता है।",
          ],
        },
        {
          h: "आपकी फोटो अपलोड नहीं होती",
          p: [
            "कई वेबसाइटें फोटो एडिट करने के लिए उसे अपने सर्वर पर भेजती हैं। FormSaathi में क्रॉप, साइज़ और सेव, सब आपके ब्राउज़र में होता है। फोटो आपके फोन या कंप्यूटर से बाहर नहीं जाती, जो आपके चेहरे और कागज़ों के लिए ज़रूरी है।",
          ],
        },
      ],
      faq: [
        { q: "फोटो को बिल्कुल चौकोर कैसे काटें?", a: "1:1 आकार चुनें, बॉक्स को सही जगह लाएँ और “क्रॉप करें” दबाएँ। फोटो पूरी तरह चौकोर बनेगी।" },
        { q: "क्या पासपोर्ट फोटो वाला क्रॉप है?", a: "हाँ। पासपोर्ट 3.5×4.5 cm आकार सही अनुपात रखता है। एक पेज पर कई फोटो छापनी हों तो Passport photo print sheet टूल इस्तेमाल करें।" },
        { q: "क्या क्रॉप से क्वालिटी कम होती है?", a: "नहीं। क्रॉप में सिर्फ़ बाहर का हिस्सा कटता है, बचा हिस्सा वैसा ही रहता है। क्वालिटी तभी बदलती है जब आप KB कम करते हैं।" },
        { q: "क्या फोन पर क्रॉप कर सकते हैं?", a: "हाँ। उँगली से बॉक्स खिसकाएँ और गोल हैंडल खींचकर उसे छोटा-बड़ा करें।" },
        { q: "क्या मेरी फोटो कहीं अपलोड होती है?", a: "नहीं। सारी एडिटिंग आपके ब्राउज़र में आपके ही फोन या कंप्यूटर पर होती है।" },
      ],
    },
  },

  // 4. Age calculator
  {
    slug: "how-to-calculate-age-for-exam-form",
    tools: ["age-calculator"],
    published: "2026-10-15",
    en: {
      title: "How to Calculate Age for a Government Exam Form (on the Cutoff Date)",
      description: "Learn how exam age is counted on a cutoff date, how category relaxation works in general, and how to find your exact age in years, months and days.",
      intro: "Every government recruitment has an age limit, and many candidates lose a chance because they count their age on the wrong date. Your age for a form is not your age today. It is your age on a cutoff date fixed in the notification. Here is how that works and how to check it in a few seconds.",
      sections: [
        {
          h: "What the cutoff date means",
          p: [
            "Each notification names one date on which age is counted, often written as “age as on” a certain date. Your age on that day decides whether you are eligible, no matter when you fill the form or when the exam is held.",
            "The cutoff date is different for every notification, even for the same exam in different years. Never reuse last year’s date. Always read it from the current official notification.",
          ],
        },
        {
          h: "How age is counted",
          p: [
            "Age is counted in completed years, months and days from your date of birth up to the cutoff date. Use the date of birth printed on your matriculation (10th) certificate or the document the notification asks for, because that is what will be checked.",
            "Pay attention to the wording of the upper limit. Some notifications say you must be “not more than” a certain age, others say you must “not have attained” it. These can give different results for someone whose birthday falls close to the cutoff date. The notification usually also gives the allowed range of birth dates, which is the safest thing to compare with.",
          ],
        },
        {
          h: "Category age relaxation, in general",
          p: [
            "Many recruitments allow extra years on the upper age limit for some groups, for example reserved categories, persons with disabilities and ex-servicemen. This is called age relaxation. The relaxation is added to the upper limit only; the minimum age usually stays the same.",
            "How many years each group gets, whether relaxations can be combined, and which certificate you need all depend on the recruitment and the post. Ex-servicemen relaxation is often worked out after deducting the period of military service. Do not assume the numbers from one exam apply to another. Read the relaxation table in the notification and keep a valid category certificate ready.",
          ],
        },
        {
          h: "How to check your age with the calculator",
          p: ["The FormSaathi Age calculator does the counting for you."],
          list: [
            "Open the Age calculator. Under “Exam”, leave “No exam (just calculate age)” selected.",
            "Enter your “Date of birth”.",
            "In “Age on date”, enter the cutoff date from the notification.",
            "Your age appears in years, months and days.",
            "Optionally, type the “Minimum age” and “Maximum age” from the notification to see whether you are eligible and the allowed range of birth dates. This simple check uses the general limits only, without relaxation.",
          ],
          ordered: true,
        },
        {
          h: "Using an exam from the list",
          p: [
            "If your exam appears in the “Exam” list, you can select it. You then choose your “Category” and tick “Person with disability (PwD)” or “Ex-serviceman” if they apply, and the tool shows eligibility with the relaxation saved for that exam. Rules change with every notification, so treat this as a quick check and confirm every number in the official notification before you apply.",
          ],
        },
        {
          h: "Common mistakes to avoid",
          p: ["These errors lead to rejected forms more often than you might think."],
          list: [
            "Counting age on today’s date or the exam date instead of the cutoff date.",
            "Typing a date of birth that differs from the 10th certificate.",
            "Claiming relaxation without a valid certificate for the category.",
            "Using an old notification’s cutoff date or relaxation table.",
          ],
        },
      ],
      faq: [
        { q: "On which date is age calculated for a government exam?", a: "On the cutoff date given in that recruitment’s notification. It changes from one notification to the next, so always check the current one." },
        { q: "Which date of birth should I use?", a: "The one on your matriculation (10th) certificate or the document named in the notification, because that is what is verified." },
        { q: "Does age relaxation change the minimum age?", a: "Usually not. Relaxation normally adds years to the upper age limit only. The notification gives the exact rule." },
        { q: "How many years of relaxation will I get?", a: "It depends on the recruitment, the post and your category. Check the relaxation table in the official notification." },
        { q: "Is my date of birth saved or sent anywhere?", a: "No. The calculation happens in your browser and nothing is uploaded." },
      ],
    },
    hi: {
      title: "सरकारी परीक्षा फ़ॉर्म के लिए उम्र कैसे निकालें (कट-ऑफ तारीख पर)",
      description: "जानिए परीक्षा में उम्र कट-ऑफ तारीख पर कैसे गिनी जाती है, वर्ग वाली आयु छूट कैसे काम करती है और अपनी सही उम्र वर्ष, महीने, दिन में कैसे निकालें।",
      intro: "हर सरकारी भर्ती में उम्र की सीमा होती है, और कई उम्मीदवार गलत तारीख पर उम्र गिनकर मौका गँवा देते हैं। फ़ॉर्म के लिए आपकी उम्र आज की उम्र नहीं होती। यह नोटिफ़िकेशन में दी गई कट-ऑफ तारीख पर गिनी जाती है। आइए समझें यह कैसे होता है और कुछ सेकंड में कैसे जाँचें।",
      sections: [
        {
          h: "कट-ऑफ तारीख का मतलब",
          p: [
            "हर नोटिफ़िकेशन में एक तारीख दी जाती है जिस पर उम्र गिनी जाती है, जिसे अक्सर “इस तारीख को आयु” लिखा जाता है। उसी दिन आपकी उम्र तय करती है कि आप पात्र हैं या नहीं, चाहे फ़ॉर्म कभी भी भरें या परीक्षा कभी भी हो।",
            "यह तारीख हर नोटिफ़िकेशन में अलग होती है, एक ही परीक्षा के अलग-अलग सालों में भी। पिछले साल की तारीख न मानें, हमेशा नए ऑफ़िशियल नोटिफ़िकेशन से देखें।",
          ],
        },
        {
          h: "उम्र कैसे गिनी जाती है",
          p: [
            "जन्म तिथि से कट-ऑफ तारीख तक पूरे हुए वर्ष, महीने और दिन गिने जाते हैं। जन्म तिथि वही लें जो 10वीं के सर्टिफिकेट में या नोटिफ़िकेशन में बताए कागज़ में लिखी है, क्योंकि जाँच उसी से होगी।",
            "ऊपरी सीमा के शब्दों पर ध्यान दें। कहीं लिखा होता है “इतनी उम्र से ज़्यादा नहीं”, तो कहीं “इतनी उम्र पूरी न की हो”। जिनका जन्मदिन कट-ऑफ के आसपास है, उनके लिए इन दोनों का नतीजा अलग हो सकता है। नोटिफ़िकेशन में अक्सर मान्य जन्म तिथियों की सीमा भी दी होती है, उसी से मिलाना सबसे सुरक्षित है।",
          ],
        },
        {
          h: "वर्ग के हिसाब से आयु छूट, आम तौर पर",
          p: [
            "कई भर्तियों में कुछ वर्गों को अधिकतम आयु में कुछ साल की छूट मिलती है, जैसे आरक्षित वर्ग, दिव्यांग और भूतपूर्व सैनिक। छूट आमतौर पर सिर्फ़ ऊपरी सीमा में जुड़ती है, न्यूनतम आयु वही रहती है।",
            "किस वर्ग को कितने साल मिलेंगे, छूट जुड़ सकती है या नहीं, और कौन-सा सर्टिफिकेट चाहिए, यह सब भर्ती और पद पर निर्भर करता है। भूतपूर्व सैनिक की छूट अक्सर सैन्य सेवा का समय घटाकर निकाली जाती है। एक परीक्षा के नंबर दूसरी पर लागू न करें। नोटिफ़िकेशन की छूट वाली टेबल पढ़ें और सही वर्ग प्रमाण पत्र तैयार रखें।",
          ],
        },
        {
          h: "कैलकुलेटर से उम्र कैसे जाँचें",
          p: ["FormSaathi का Age calculator गिनती आपके लिए कर देता है।"],
          list: [
            "Age calculator खोलें। “परीक्षा” में “कोई परीक्षा नहीं (सिर्फ़ उम्र निकालें)” रहने दें।",
            "“जन्म तिथि” डालें।",
            "“इस तारीख पर उम्र” में नोटिफ़िकेशन की कट-ऑफ तारीख डालें।",
            "आपकी उम्र वर्ष, महीने और दिन में दिखेगी।",
            "चाहें तो नोटिफ़िकेशन से “न्यूनतम आयु” और “अधिकतम आयु” भी लिखें, तो पता चलेगा आप पात्र हैं या नहीं और मान्य जन्म तिथि की सीमा क्या है। यह सामान्य जाँच बिना छूट के होती है।",
          ],
          ordered: true,
        },
        {
          h: "लिस्ट में अपनी परीक्षा हो तो",
          p: [
            "अगर आपकी परीक्षा “परीक्षा” वाली लिस्ट में है तो उसे चुनें। फिर अपना “वर्ग” चुनें और लागू हो तो “दिव्यांग (PwD)” या “भूतपूर्व सैनिक” पर टिक करें। टूल उस परीक्षा के लिए सेव की गई छूट के साथ नतीजा दिखाएगा। नियम हर नोटिफ़िकेशन के साथ बदल सकते हैं, इसलिए इसे जल्दी की जाँच मानें और आवेदन से पहले हर नंबर ऑफ़िशियल नोटिफ़िकेशन से मिलाएँ।",
          ],
        },
        {
          h: "ये गलतियाँ न करें",
          p: ["इन छोटी गलतियों से फ़ॉर्म अक्सर रिजेक्ट हो जाते हैं।"],
          list: [
            "कट-ऑफ तारीख के बजाय आज की या परीक्षा की तारीख पर उम्र गिनना।",
            "10वीं के सर्टिफिकेट से अलग जन्म तिथि भरना।",
            "सही सर्टिफिकेट के बिना छूट लेना।",
            "पुराने नोटिफ़िकेशन की कट-ऑफ तारीख या छूट टेबल इस्तेमाल करना।",
          ],
        },
      ],
      faq: [
        { q: "सरकारी परीक्षा में उम्र किस तारीख पर गिनी जाती है?", a: "उस भर्ती के नोटिफ़िकेशन में दी गई कट-ऑफ तारीख पर। यह हर नोटिफ़िकेशन में बदलती है, इसलिए हमेशा नया नोटिफ़िकेशन देखें।" },
        { q: "कौन-सी जन्म तिथि डालें?", a: "जो 10वीं के सर्टिफिकेट में या नोटिफ़िकेशन में बताए कागज़ में लिखी है, क्योंकि जाँच उसी से होती है।" },
        { q: "क्या छूट से न्यूनतम आयु भी बदलती है?", a: "आमतौर पर नहीं। छूट ज़्यादातर सिर्फ़ अधिकतम आयु में जुड़ती है। सही नियम नोटिफ़िकेशन में होता है।" },
        { q: "मुझे कितने साल की छूट मिलेगी?", a: "यह भर्ती, पद और आपके वर्ग पर निर्भर है। ऑफ़िशियल नोटिफ़िकेशन की छूट वाली टेबल देखें।" },
        { q: "क्या मेरी जन्म तिथि कहीं सेव या भेजी जाती है?", a: "नहीं। हिसाब आपके ब्राउज़र में ही होता है, कुछ भी अपलोड नहीं होता।" },
      ],
    },
  },

  // 5. Bulk resize
  {
    slug: "how-to-resize-many-images-at-once",
    tools: ["bulk-resize", "compress-image"],
    published: "2026-10-15",
    en: {
      title: "How to Resize Many Images at Once (Bulk Resize, Free)",
      description: "Resize up to 100 photos together by percent, pixels or KB, then download them all as a ZIP. Free, works in your browser, nothing is uploaded.",
      intro: "Resizing photos one by one takes forever when you have a whole folder of them. A bulk resizer applies the same setting to every image in one go. This guide explains each option and how to get all your files back in a single ZIP.",
      sections: [
        {
          h: "When bulk resizing helps",
          p: [
            "Phone cameras take very large photos. A batch of them can be too heavy to email, share or upload to a website. Teachers sharing class photos, shop owners preparing product pictures and anyone sending scanned pages can save a lot of time by resizing everything together.",
          ],
        },
        {
          h: "How to resize many images at once",
          p: ["Open the FormSaathi Bulk resize tool."],
          list: [
            "Tap “Choose images” and select your photos, or drop them on the page. You can add up to 100 images at a time in JPG, PNG, WebP, GIF or BMP. Use “Add more images” to add from another folder.",
            "Under “Resize by”, pick one of the four modes explained below and fill in the numbers.",
            "Choose an “Output format”: Same as original, JPG, PNG or WebP. For JPG and WebP you can also set the quality.",
            "Tap the “Resize” button, which shows how many images will be processed. You can cancel at any time.",
            "Download images one by one, or tap “Download all (.zip)” to get them in a single file.",
          ],
          ordered: true,
        },
        {
          h: "The four resize modes",
          p: ["Each mode suits a different job."],
          list: [
            "Percentage: every image is scaled by the same percent, for example 50 percent to halve the width and height.",
            "Fit within W × H: each image shrinks to fit inside a box. The shape is kept and small images are not enlarged. Good for making a mixed set of photos “no bigger than” a size.",
            "Exact W × H: every image comes out exactly that size. When a photo’s shape does not match, choose “Crop to fill” or “Add white bars”.",
            "Max size (KB): the pixel size is kept and the quality is lowered, shrinking the image only if needed, so each file stays under your KB limit.",
          ],
        },
        {
          h: "Understanding the results",
          p: [
            "After processing, each image shows its new size and how much smaller or bigger it became, along with a total before and after. If one photo cannot get under the KB limit, it is marked so you can handle it separately.",
            "A few format notes: GIF and BMP are saved as PNG. With a KB limit, PNG files are saved as JPG so the size can be controlled. Transparent areas become white.",
          ],
        },
        {
          h: "Need finer control for one photo?",
          p: [
            "Bulk resize applies one setting to all images. If a single photo needs special care, such as reaching a precise KB size while keeping a face sharp, use the Compress image tool for that file. You can choose a target size in KB or set the quality yourself and compare the before and after size.",
            "For exam uploads, check the exact photo and signature rules in the official notification, since every exam has its own.",
          ],
        },
        {
          h: "No upload, even for 100 photos",
          p: [
            "Most bulk resizers upload every picture to a server. FormSaathi does all the work inside your browser, so your photos never leave your phone or computer. Even the ZIP file is made on your device.",
            "Since the work happens on your device, a big batch of large photos can take a little longer on an older phone. Keep the page open until the progress count finishes, and the photos already done stay ready to download even if you stop midway.",
          ],
        },
      ],
      faq: [
        { q: "How many images can I resize at once?", a: "Up to 100 images at a time. For more, finish one batch, download the ZIP, and start the next." },
        { q: "Can I bring every photo under a KB limit?", a: "Yes. Choose “Max size (KB)” under “Resize by” and enter the limit. Each image is compressed to stay under it." },
        { q: "Will my photos get stretched?", a: "Not with Percentage or Fit within W × H, which keep the shape. With Exact W × H, choose “Crop to fill” or “Add white bars” to avoid stretching." },
        { q: "How do I download all the resized photos?", a: "Tap “Download all (.zip)” to get every image in one ZIP file." },
        { q: "Are my photos uploaded?", a: "No. Everything, including the ZIP, is made inside your browser on your own device." },
      ],
    },
    hi: {
      title: "एक साथ कई फोटो का साइज़ कैसे बदलें (Bulk Resize, फ्री)",
      description: "100 तक फोटो का साइज़ एक साथ प्रतिशत, पिक्सल या KB से बदलें और सबको एक ZIP में डाउनलोड करें। फ्री, ब्राउज़र में चलता है, कुछ अपलोड नहीं होता।",
      intro: "पूरे फ़ोल्डर की फोटो एक-एक करके छोटी करने में बहुत समय लगता है। Bulk resize टूल एक ही सेटिंग सभी फोटो पर एक बार में लगा देता है। यहाँ हर विकल्प आसान भाषा में समझाया गया है, और यह भी कि सारी फ़ाइलें एक ZIP में कैसे लें।",
      sections: [
        {
          h: "एक साथ साइज़ बदलना कब काम आता है",
          p: [
            "फोन के कैमरे बहुत बड़ी फोटो खींचते हैं। ऐसी कई फोटो ईमेल करने, शेयर करने या वेबसाइट पर डालने में भारी पड़ती हैं। क्लास की फोटो भेजने वाले शिक्षक, सामान की फोटो बनाने वाले दुकानदार या स्कैन पेज भेजने वाला कोई भी, सब एक साथ छोटा करके काफ़ी समय बचा सकता है।",
          ],
        },
        {
          h: "एक साथ कई फोटो छोटी करने के स्टेप",
          p: ["FormSaathi का Bulk resize टूल खोलें।"],
          list: [
            "“फोटो चुनें” दबाकर फोटो चुनें, या पेज पर छोड़ दें। एक बार में 100 तक JPG, PNG, WebP, GIF या BMP फोटो ले सकते हैं। दूसरे फ़ोल्डर से डालने के लिए “और फोटो जोड़ें” दबाएँ।",
            "“किस तरह छोटा करें” में नीचे बताए चार तरीकों में से एक चुनें और नंबर भरें।",
            "“आउटपुट फ़ॉर्मेट” चुनें: जैसा था वैसा, JPG, PNG या WebP। JPG और WebP में क्वालिटी भी सेट कर सकते हैं।",
            "“फोटो का साइज़ बदलें” बटन दबाएँ, उस पर फोटो की गिनती भी दिखती है। बीच में “रोकें” भी दबा सकते हैं।",
            "हर फोटो अलग डाउनलोड करें, या “सब डाउनलोड करें (.zip)” से एक ही फ़ाइल में लें।",
          ],
          ordered: true,
        },
        {
          h: "चार तरीके, अलग-अलग काम के लिए",
          p: ["अपने काम के हिसाब से तरीका चुनें।"],
          list: [
            "प्रतिशत: हर फोटो उसी प्रतिशत से छोटी होगी, जैसे 50 प्रतिशत से चौड़ाई-ऊँचाई आधी।",
            "W × H के अंदर: हर फोटो इस बॉक्स के अंदर आ जाएगी। शेप वही रहेगी और छोटी फोटो बड़ी नहीं होगी।",
            "ठीक W × H: हर फोटो ठीक इसी साइज़ की बनेगी। शेप मेल न खाए तो “काटकर भरें” या “सफ़ेद पट्टी जोड़ें” चुनें।",
            "अधिकतम साइज़ (KB): पिक्सल साइज़ वही रहता है, क्वालिटी कम करके (ज़रूरत हो तो फोटो छोटी करके) हर फ़ाइल को KB लिमिट में लाया जाता है।",
          ],
        },
        {
          h: "नतीजे को समझें",
          p: [
            "काम पूरा होने पर हर फोटो का नया साइज़ और वो कितने प्रतिशत छोटी या बड़ी हुई, यह दिखता है, साथ में कुल पहले और बाद का साइज़ भी। कोई फोटो KB लिमिट में न आ पाए तो उस पर अलग से निशान लगता है।",
            "ध्यान दें: GIF और BMP, PNG में सेव होती हैं। KB लिमिट के साथ PNG को JPG में सेव किया जाता है ताकि साइज़ कंट्रोल हो सके। पारदर्शी हिस्सा सफ़ेद हो जाता है।",
          ],
        },
        {
          h: "किसी एक फोटो पर बारीकी से काम करना हो तो",
          p: [
            "Bulk resize सभी फोटो पर एक ही सेटिंग लगाता है। अगर किसी एक फोटो को ठीक-ठीक KB में लाना है और चेहरा भी साफ़ रखना है, तो उसके लिए Compress image टूल इस्तेमाल करें। वहाँ KB साइज़ या क्वालिटी खुद तय करके पहले और बाद का साइज़ देख सकते हैं।",
            "परीक्षा के लिए फोटो और हस्ताक्षर के नियम हमेशा ऑफ़िशियल नोटिफ़िकेशन से देखें, क्योंकि हर परीक्षा के नियम अलग होते हैं।",
          ],
        },
        {
          h: "100 फोटो हों तब भी कोई अपलोड नहीं",
          p: [
            "ज़्यादातर bulk resize वेबसाइटें हर फोटो अपने सर्वर पर भेजती हैं। FormSaathi में सारा काम आपके ब्राउज़र में होता है, फोटो आपके फोन या कंप्यूटर से बाहर नहीं जातीं। ZIP फ़ाइल भी आपके ही डिवाइस पर बनती है।",
            "काम आपके डिवाइस पर होता है, इसलिए पुराने फोन पर बड़ी फोटो का बड़ा बैच थोड़ा समय ले सकता है। गिनती पूरी होने तक पेज खुला रखें। बीच में रोक भी दें तो जो फोटो बन चुकी हैं वे डाउनलोड के लिए तैयार रहती हैं।",
          ],
        },
      ],
      faq: [
        { q: "एक बार में कितनी फोटो छोटी कर सकते हैं?", a: "एक बार में 100 तक। ज़्यादा हों तो पहला बैच पूरा करके ZIP डाउनलोड करें, फिर अगला शुरू करें।" },
        { q: "क्या सभी फोटो को एक KB लिमिट में ला सकते हैं?", a: "हाँ। “किस तरह छोटा करें” में “अधिकतम साइज़ (KB)” चुनें और लिमिट लिखें। हर फोटो उसके अंदर लाई जाएगी।" },
        { q: "क्या फोटो खिंच जाएँगी?", a: "प्रतिशत और “W × H के अंदर” में शेप वही रहती है। “ठीक W × H” में खिंचाव से बचने के लिए “काटकर भरें” या “सफ़ेद पट्टी जोड़ें” चुनें।" },
        { q: "सारी फोटो एक साथ कैसे डाउनलोड करें?", a: "“सब डाउनलोड करें (.zip)” दबाएँ, सारी फोटो एक ZIP फ़ाइल में मिल जाएँगी।" },
        { q: "क्या मेरी फोटो अपलोड होती हैं?", a: "नहीं। ZIP समेत सब कुछ आपके ब्राउज़र में, आपके ही डिवाइस पर बनता है।" },
      ],
    },
  },

  // 6. Resume
  {
    slug: "how-to-make-resume-online-free",
    tools: ["resume-maker", "letter-maker"],
    published: "2026-10-15",
    en: {
      title: "How to Make a Resume Online for Free (Hindi or English PDF)",
      description: "Make a clean resume in Hindi or English, with or without a photo, and download it as a PDF. Free, no sign up, and your details stay on your phone.",
      intro: "A neat, simple resume is often all you need for a private job, an apprenticeship, a contract post or a walk in interview. You do not need a paid app or a computer to make one. This guide shows how to build a resume step by step and save it as a PDF from your phone.",
      sections: [
        {
          h: "What a good basic resume includes",
          p: [
            "Keep it to the facts an employer actually looks for. A short, tidy one or two page resume is easier to read than a long, decorated one.",
          ],
          list: [
            "Name, mobile number, email and an address for contact.",
            "A one or two line career objective.",
            "Education, newest first, with board or university, year and marks.",
            "Work experience, if any, with the post, organisation, period and what you did.",
            "Skills such as computer, typing or accounts software, and the languages you know.",
            "Personal details and a declaration with place, date and signature.",
          ],
        },
        {
          h: "How to make your resume, step by step",
          p: ["Open the FormSaathi Resume maker (PDF). There is no account or login."],
          list: [
            "Under “Language of the document”, choose Hindi or English. The headings on the PDF are printed in that language.",
            "Pick a “Design”: Classic or Modern.",
            "Fill “Name and contact”. Adding a photo is optional: tap “Choose photo” if you want one.",
            "Add your education with “Add education”, and your jobs with “Add experience”.",
            "Fill skills, languages, personal details and the declaration. Leave the declaration line empty to use the standard line.",
            "Check the “Preview”, then tap “Download PDF” or “Print”.",
          ],
          ordered: true,
        },
        {
          h: "Tips for freshers",
          p: [
            "If you have never worked, leave the experience section empty. It will not be printed at all, so there is no awkward blank heading. Put the focus on your education and skills instead.",
            "List practical skills you can actually show, such as MS Office, Hindi and English typing, or accounting software. Write your career objective in simple words about the kind of work you want.",
            "Projects, training, NCC, NSS or volunteer work can go under skills or education details. Keep each point short and true, because an interviewer may ask you about anything on the page.",
          ],
        },
        {
          h: "Your work is saved on your phone",
          p: [
            "Everything you type is saved automatically in your browser on this phone, so you can close the page and come back later to edit. Nothing is uploaded to any server. When you want to start fresh, use “Clear form”.",
            "Because the data lives only in this browser, it will not appear on another phone or computer. Keep the downloaded PDF safe as well.",
          ],
        },
        {
          h: "Need a cover letter, NOC or declaration too?",
          p: [
            "Some employers and offices also ask for an application letter, a no objection certificate or a self declaration. The FormSaathi Letter maker gives simple, editable formats for an application letter, an NOC from a parent or guardian, an NOC from an employer, and a self declaration. You fill the details, edit the text freely, and download a PDF.",
            "These are general formats only. If your office, department or exam gives its own format, use that exact format instead.",
          ],
        },
        {
          h: "Before you send it",
          p: ["Run through this short checklist."],
          list: [
            "Your mobile number and email are correct.",
            "Dates, marks and names match your certificates.",
            "There are no spelling mistakes in headings or your name.",
            "The file name is clear, for example your name followed by resume.",
          ],
        },
      ],
      faq: [
        { q: "Can I make a resume in Hindi?", a: "Yes. Choose Hindi under “Language of the document” and the PDF headings will be in Hindi. You can type your details in Hindi or English." },
        { q: "Is a photo required on the resume?", a: "No. The photo is optional. Add one only if the employer asks for it or it is common in your field." },
        { q: "I am a fresher. What do I put under experience?", a: "Leave it empty. The experience section is then not printed at all." },
        { q: "Can I edit my resume later?", a: "Yes. Your details are saved automatically in this browser, so you can return, change them and download a new PDF." },
        { q: "Is my information uploaded?", a: "No. The resume is made inside your browser and nothing is sent to a server." },
      ],
    },
    hi: {
      title: "ऑनलाइन फ्री में resume कैसे बनाएँ (हिंदी या English PDF)",
      description: "हिंदी या English में साफ़-सुथरा resume बनाएँ, फोटो के साथ या बिना, और PDF डाउनलोड करें। फ्री, कोई लॉगिन नहीं, जानकारी आपके फोन में ही रहती है।",
      intro: "प्राइवेट नौकरी, अप्रेंटिसशिप, संविदा पद या वॉक-इन इंटरव्यू के लिए अक्सर एक सादा और साफ़ resume ही काफ़ी होता है। इसके लिए न पैसे वाले ऐप की ज़रूरत है, न कंप्यूटर की। यहाँ जानिए फोन से ही resume बनाकर PDF कैसे सेव करें।",
      sections: [
        {
          h: "एक अच्छे resume में क्या हो",
          p: ["वही बातें लिखें जो नौकरी देने वाला सच में देखता है। एक-दो पेज का साफ़ resume लंबे सजे-धजे resume से बेहतर पढ़ा जाता है।"],
          list: [
            "नाम, मोबाइल नंबर, ईमेल और संपर्क का पता।",
            "एक-दो लाइन का उद्देश्य (Career objective)।",
            "पढ़ाई, सबसे नई सबसे ऊपर, बोर्ड या विश्वविद्यालय, वर्ष और अंक के साथ।",
            "काम का अनुभव हो तो पद, संस्था, अवधि और क्या काम किया।",
            "कौशल जैसे कंप्यूटर, टाइपिंग या अकाउंट्स सॉफ़्टवेयर, और कौन-सी भाषाएँ आती हैं।",
            "व्यक्तिगत जानकारी और स्थान, दिनांक व हस्ताक्षर के साथ घोषणा।",
          ],
        },
        {
          h: "Resume बनाने के स्टेप",
          p: ["FormSaathi का Resume maker (PDF) खोलें। कोई अकाउंट या लॉगिन नहीं चाहिए।"],
          list: [
            "“डॉक्यूमेंट की भाषा” में हिंदी या English चुनें। PDF की हेडिंग उसी भाषा में छपेंगी।",
            "“डिज़ाइन” में सादा या मॉडर्न चुनें।",
            "“नाम और संपर्क” भरें। फोटो ज़रूरी नहीं है, लगानी हो तो “फोटो चुनें” दबाएँ।",
            "“पढ़ाई जोड़ें” से पढ़ाई और “अनुभव जोड़ें” से नौकरी जोड़ें।",
            "कौशल, भाषाएँ, व्यक्तिगत जानकारी और घोषणा भरें। घोषणा की लाइन खाली छोड़ें तो सामान्य लाइन लग जाएगी।",
            "“प्रीव्यू” देखें, फिर “PDF डाउनलोड करें” या “प्रिंट करें” दबाएँ।",
          ],
          ordered: true,
        },
        {
          h: "फ्रेशर के लिए सुझाव",
          p: [
            "अगर अभी तक नौकरी नहीं की है तो अनुभव वाला हिस्सा खाली छोड़ दें। वह प्रिंट ही नहीं होगा, इसलिए कोई खाली हेडिंग नहीं दिखेगी। ध्यान अपनी पढ़ाई और कौशल पर रखें।",
            "वही कौशल लिखें जो आप सच में कर सकते हैं, जैसे MS Office, हिंदी और अंग्रेज़ी टाइपिंग या Tally। उद्देश्य सीधी भाषा में लिखें कि आप किस तरह का काम चाहते हैं।",
            "प्रोजेक्ट, ट्रेनिंग, NCC, NSS या कोई सेवा कार्य हो तो उसे कौशल या पढ़ाई की जानकारी में लिख सकते हैं। हर बात छोटी और सच्ची रखें, क्योंकि इंटरव्यू में पेज की किसी भी बात पर सवाल हो सकता है।",
          ],
        },
        {
          h: "आपका काम फोन में ही सेव रहता है",
          p: [
            "जो भी आप भरते हैं, वह इसी फोन के ब्राउज़र में अपने आप सेव होता है। पेज बंद करके बाद में लौटकर बदलाव कर सकते हैं। कुछ भी किसी सर्वर पर अपलोड नहीं होता। नए सिरे से शुरू करना हो तो “फ़ॉर्म खाली करें” दबाएँ।",
            "क्योंकि जानकारी सिर्फ़ इसी ब्राउज़र में है, वह दूसरे फोन या कंप्यूटर पर नहीं दिखेगी। डाउनलोड की गई PDF भी संभालकर रखें।",
          ],
        },
        {
          h: "साथ में आवेदन पत्र, NOC या घोषणा पत्र चाहिए?",
          p: [
            "कई जगह resume के साथ प्रार्थना पत्र, अनापत्ति प्रमाण पत्र (NOC) या स्व-घोषणा पत्र भी माँगा जाता है। FormSaathi के Letter maker में प्रार्थना पत्र, माता-पिता या अभिभावक का NOC, नौकरी वाली संस्था का NOC और स्व-घोषणा पत्र के आसान फ़ॉर्मेट हैं। जानकारी भरें, टेक्स्ट अपने हिसाब से बदलें और PDF डाउनलोड करें।",
            "ये सिर्फ़ सामान्य फ़ॉर्मेट हैं। अगर आपके दफ़्तर, विभाग या परीक्षा ने अपना फ़ॉर्मेट दिया है तो वही इस्तेमाल करें।",
          ],
        },
        {
          h: "भेजने से पहले एक बार देख लें",
          p: ["यह छोटी सी लिस्ट मिला लें।"],
          list: [
            "मोबाइल नंबर और ईमेल सही हैं।",
            "तारीखें, अंक और नाम सर्टिफिकेट से मेल खाते हैं।",
            "हेडिंग या नाम में कोई स्पेलिंग गलती नहीं है।",
            "फ़ाइल का नाम साफ़ है, जैसे आपका नाम और उसके बाद resume।",
          ],
        },
      ],
      faq: [
        { q: "क्या हिंदी में resume बना सकते हैं?", a: "हाँ। “डॉक्यूमेंट की भाषा” में हिंदी चुनें, PDF की हेडिंग हिंदी में आएँगी। जानकारी हिंदी या English में लिख सकते हैं।" },
        { q: "क्या resume में फोटो ज़रूरी है?", a: "नहीं, फोटो वैकल्पिक है। तभी लगाएँ जब नौकरी देने वाला माँगे या आपके क्षेत्र में चलन हो।" },
        { q: "मैं फ्रेशर हूँ, अनुभव में क्या लिखूँ?", a: "उसे खाली छोड़ दें। तब अनुभव वाला हिस्सा प्रिंट ही नहीं होगा।" },
        { q: "क्या बाद में resume बदल सकते हैं?", a: "हाँ। जानकारी इसी ब्राउज़र में अपने आप सेव रहती है, लौटकर बदलें और नई PDF डाउनलोड करें।" },
        { q: "क्या मेरी जानकारी अपलोड होती है?", a: "नहीं। Resume आपके ब्राउज़र में ही बनता है, कुछ भी सर्वर पर नहीं जाता।" },
      ],
    },
  },

  // 7. Marriage biodata
  {
    slug: "how-to-make-marriage-biodata",
    tools: ["biodata-maker"],
    published: "2026-10-15",
    en: {
      title: "How to Make a Marriage Biodata (Free Format in Hindi or English)",
      description: "Make a neat marriage biodata with photo, family details and contact in Hindi or English, and download it as a PDF. Free and private, nothing uploaded.",
      intro: "A marriage biodata is the first thing families share when a match is being discussed. It should be clear, honest and easy to read on a phone. This guide explains what to include and how to make a tidy biodata PDF in a few minutes.",
      sections: [
        {
          h: "What to include in a marriage biodata",
          p: ["Most families look for the same basic details. Include what is relevant to you and leave out the rest."],
          list: [
            "Personal details: full name, date of birth, time and place of birth, height.",
            "Religion, caste and gotra, if your family wants them mentioned.",
            "Education, occupation and income.",
            "Family: father’s and mother’s names and occupations, brothers and sisters.",
            "Contact: mobile number and address.",
            "A recent, clear photo.",
          ],
        },
        {
          h: "How to make a biodata, step by step",
          p: ["Open the FormSaathi Marriage biodata maker (PDF)."],
          list: [
            "Under “Language of the document”, choose Hindi or English.",
            "If you like, tick the option to print a line at the top, such as ॥ श्री गणेशाय नमः ॥, and type your own line.",
            "Tap “Choose photo” to add a photo.",
            "Fill “Personal details”, then the “Family” section. Use “Add brother/sister” for each sibling, with relation, name and details such as married or occupation.",
            "Add your contact details and anything else you want to mention.",
            "Check the “Preview”, then tap “Download PDF” or “Print”.",
          ],
          ordered: true,
        },
        {
          h: "Empty fields are simply left out",
          p: [
            "You do not have to fill every box. Any field you leave empty is not printed, so there are no blank lines like “Gotra: ” on the final page. This makes it easy to keep the biodata short or to skip details your family prefers not to share.",
          ],
        },
        {
          h: "Choosing a good photo",
          p: [
            "Use a recent photo with good light and a plain background, where your face is clearly visible. Avoid heavy filters and group photos. If your photo needs trimming first, crop it with the Crop image tool and then add it here.",
          ],
        },
        {
          h: "Writing tips that make a good impression",
          p: ["Small things make a biodata look more trustworthy."],
          list: [
            "Write height in a clear format, for example 5 ft 6 in.",
            "Give income in a simple form, such as per year, if you choose to include it.",
            "Describe occupation precisely, with the post and organisation.",
            "Keep spellings of names consistent in Hindi and English.",
            "Read the preview once with a family member before sharing.",
          ],
        },
        {
          h: "Sharing and printing your biodata",
          p: [
            "Most families share a biodata on WhatsApp. Send the downloaded PDF as a document rather than a screenshot, so the text stays sharp when the other family zooms in. A PDF also keeps the layout the same on every phone.",
            "If you need paper copies, tap “Print” or take the PDF to any print shop. Print on plain white A4 paper. When something changes, such as a new job or a new phone number, open the tool again, update the field and download a fresh PDF so old copies are not passed around.",
          ],
        },
        {
          h: "Private and saved on your phone",
          p: [
            "A biodata holds very personal information: birth time, family names, phone number and photo. FormSaathi makes the PDF in your browser and uploads nothing. Your details are saved automatically on this phone so you can come back and update them later, and “Clear form” removes everything when you are done.",
          ],
        },
      ],
      faq: [
        { q: "Can I make a biodata in Hindi?", a: "Yes. Choose Hindi as the language of the document. The printed labels will be in Hindi." },
        { q: "Can I add ॥ श्री गणेशाय नमः ॥ at the top?", a: "Yes. Tick the option to print a line at the top and type the line you want." },
        { q: "Do I have to fill caste, gotra and income?", a: "No. Leave any field empty and it will not be printed." },
        { q: "How do I share the biodata on WhatsApp?", a: "Download the PDF and send it as a document from WhatsApp, or print it." },
        { q: "Is my biodata uploaded anywhere?", a: "No. It is made in your browser and your details are saved only on this phone." },
      ],
    },
    hi: {
      title: "शादी का बायोडाटा कैसे बनाएँ (हिंदी या English में फ्री फ़ॉर्मेट)",
      description: "फोटो, परिवार की जानकारी और संपर्क के साथ सुंदर शादी का बायोडाटा हिंदी या English में बनाएँ और PDF डाउनलोड करें। फ्री, कुछ अपलोड नहीं होता।",
      intro: "रिश्ते की बात शुरू होते ही सबसे पहले बायोडाटा भेजा जाता है। यह साफ़, सच्चा और फोन पर आसानी से पढ़ने लायक होना चाहिए। यहाँ जानिए बायोडाटा में क्या लिखें और कुछ ही मिनट में उसकी साफ़-सुथरी PDF कैसे बनाएँ।",
      sections: [
        {
          h: "शादी के बायोडाटा में क्या लिखें",
          p: ["ज़्यादातर परिवार यही बुनियादी बातें देखते हैं। जो आपके लिए ज़रूरी हो वही लिखें।"],
          list: [
            "व्यक्तिगत जानकारी: पूरा नाम, जन्म तिथि, जन्म समय, जन्म स्थान और कद।",
            "धर्म, जाति और गोत्र, अगर परिवार लिखना चाहे।",
            "शिक्षा, नौकरी या व्यवसाय और आय।",
            "परिवार: पिता और माता का नाम व व्यवसाय, भाई-बहन।",
            "संपर्क: मोबाइल नंबर और पता।",
            "हाल की साफ़ फोटो।",
          ],
        },
        {
          h: "बायोडाटा बनाने के स्टेप",
          p: ["FormSaathi का Marriage biodata maker (PDF) खोलें।"],
          list: [
            "“डॉक्यूमेंट की भाषा” में हिंदी या English चुनें।",
            "चाहें तो सबसे ऊपर एक लाइन छापने का विकल्प चुनें, जैसे ॥ श्री गणेशाय नमः ॥, और अपनी लाइन लिखें।",
            "“फोटो चुनें” दबाकर फोटो लगाएँ।",
            "“व्यक्तिगत जानकारी” भरें, फिर “परिवार”। हर भाई या बहन के लिए “भाई/बहन जोड़ें” दबाएँ और रिश्ता, नाम व जानकारी, जैसे विवाहित या नौकरी, लिखें।",
            "संपर्क की जानकारी और कुछ और बताना हो तो वह भी जोड़ें।",
            "“प्रीव्यू” देखें, फिर “PDF डाउनलोड करें” या “प्रिंट करें” दबाएँ।",
          ],
          ordered: true,
        },
        {
          h: "खाली जानकारी छपती ही नहीं",
          p: [
            "हर खाना भरना ज़रूरी नहीं। जो खाना खाली छोड़ेंगे वह प्रिंट नहीं होगा, इसलिए PDF में “गोत्र: ” जैसी खाली लाइनें नहीं दिखेंगी। इससे बायोडाटा छोटा रखना या कोई बात न बताना आसान हो जाता है।",
          ],
        },
        {
          h: "अच्छी फोटो कैसे चुनें",
          p: [
            "हाल की ऐसी फोटो लें जिसमें रोशनी अच्छी हो, पीछे सादा बैकग्राउंड हो और चेहरा साफ़ दिखे। ज़्यादा फ़िल्टर और ग्रुप फोटो से बचें। फोटो को पहले काटना हो तो Crop image टूल से क्रॉप करें, फिर यहाँ लगाएँ।",
          ],
        },
        {
          h: "लिखने के छोटे सुझाव",
          p: ["छोटी-छोटी बातें बायोडाटा को भरोसेमंद बनाती हैं।"],
          list: [
            "कद साफ़ लिखें, जैसे 5 फुट 6 इंच।",
            "आय लिखनी हो तो आसान तरीके से लिखें, जैसे सालाना।",
            "नौकरी साफ़ बताएँ, पद और संस्था के नाम के साथ।",
            "नामों की स्पेलिंग हिंदी और English में एक जैसी रखें।",
            "भेजने से पहले परिवार के किसी सदस्य के साथ प्रीव्यू एक बार पढ़ लें।",
          ],
        },
        {
          h: "बायोडाटा शेयर और प्रिंट कैसे करें",
          p: [
            "ज़्यादातर परिवार बायोडाटा WhatsApp पर भेजते हैं। स्क्रीनशॉट के बजाय डाउनलोड की गई PDF को डॉक्यूमेंट के रूप में भेजें, ताकि ज़ूम करने पर भी अक्षर साफ़ दिखें। PDF हर फोन पर एक जैसी दिखती है।",
            "कागज़ पर चाहिए तो “प्रिंट करें” दबाएँ या PDF किसी भी प्रिंट की दुकान पर ले जाएँ। सादे सफ़ेद A4 कागज़ पर प्रिंट करें। नई नौकरी या नया फोन नंबर जैसा कुछ बदले, तो टूल दोबारा खोलकर वह खाना बदलें और नई PDF डाउनलोड करें, ताकि पुरानी कॉपी आगे न जाए।",
          ],
        },
        {
          h: "निजी और आपके फोन में सेव",
          p: [
            "बायोडाटा में बहुत निजी जानकारी होती है, जैसे जन्म समय, परिवार के नाम, फोन नंबर और फोटो। FormSaathi PDF आपके ब्राउज़र में ही बनाता है, कुछ भी अपलोड नहीं होता। जानकारी इसी फोन में अपने आप सेव रहती है ताकि बाद में बदल सकें, और काम पूरा होने पर “फ़ॉर्म खाली करें” से सब मिटा सकते हैं।",
          ],
        },
      ],
      faq: [
        { q: "क्या हिंदी में बायोडाटा बना सकते हैं?", a: "हाँ। डॉक्यूमेंट की भाषा में हिंदी चुनें, छपे हुए शीर्षक हिंदी में आएँगे।" },
        { q: "क्या सबसे ऊपर ॥ श्री गणेशाय नमः ॥ लिख सकते हैं?", a: "हाँ। सबसे ऊपर लाइन छापने का विकल्प चुनें और अपनी पसंद की लाइन लिखें।" },
        { q: "क्या जाति, गोत्र और आय भरना ज़रूरी है?", a: "नहीं। कोई भी खाना खाली छोड़ दें, वह प्रिंट नहीं होगा।" },
        { q: "बायोडाटा WhatsApp पर कैसे भेजें?", a: "PDF डाउनलोड करें और WhatsApp में डॉक्यूमेंट के रूप में भेजें, या प्रिंट निकाल लें।" },
        { q: "क्या मेरा बायोडाटा कहीं अपलोड होता है?", a: "नहीं। यह आपके ब्राउज़र में बनता है और जानकारी सिर्फ़ इसी फोन में सेव रहती है।" },
      ],
    },
  },

  // 8. Answer key
  {
    slug: "how-to-check-answer-key-and-calculate-score",
    tools: ["answer-key"],
    published: "2026-10-15",
    en: {
      title: "How to Check the Answer Key and Calculate Your Score (with Negative Marking)",
      description: "Use your response sheet and the answer key to count right and wrong answers, apply negative marking, and estimate your exam score in minutes.",
      intro: "After a computer based exam, the conducting body usually releases a response sheet and a provisional answer key. Matching them question by question tells you roughly what you scored. This guide explains the negative marking math and how to get an estimate quickly, without counting by hand.",
      sections: [
        {
          h: "Response sheet vs answer key",
          p: [
            "The response sheet shows each question with the option you chose. The answer key shows the correct option. In many online response sheets, both appear on the same page: your answer is listed and the correct option is marked, often with a green tick.",
            "Your score is simply how many you got right, minus a penalty for the ones you got wrong, if the exam has negative marking.",
          ],
        },
        {
          h: "How negative marking works",
          p: [
            "Every exam sets its own marks, so read the marking scheme in the official notification. The math is always the same: score = (correct × marks for a correct answer) minus (wrong × marks cut for a wrong answer). Questions you did not attempt usually give zero.",
            "Here is an example with made up numbers. Say each correct answer gives 1 mark and a wrong answer costs one quarter of a mark. If you got 60 right and 20 wrong, your score is 60 minus 20 × 0.25, which is 60 minus 5, so 55.",
            "This is why guessing can hurt. With a quarter mark penalty, four wrong guesses cancel out one correct answer.",
          ],
        },
        {
          h: "How to get your response sheet file",
          p: ["The FormSaathi Answer key score calculator reads the saved response sheet page."],
          list: [
            "Open the response sheet link from the official website and log in.",
            "On a computer, press Ctrl+S and save the page as “Webpage, HTML only” or complete.",
            "On a phone in Chrome, use the menu and choose Download, or Share and then save the page. The .mhtml file works too.",
            "You can also open the page source and copy all of it.",
          ],
          ordered: true,
        },
        {
          h: "How to calculate your score, step by step",
          p: ["Once you have the saved page, the rest takes about a minute."],
          list: [
            "Under “Exam (marking scheme)”, choose your exam if it is listed, or pick “Custom marking” and enter “Marks for correct (+)” and the negative marks for a wrong answer from your notification.",
            "Tap “Upload saved page (.html / .mhtml)” and pick the saved file, or paste the page source into the box.",
            "Tap “Calculate score”.",
            "See attempted, correct, wrong and not attempted counts, section by section, with your total score.",
            "Open the list of wrong answers to see your answer and the correct one for each, and use “Copy summary” to share your result.",
          ],
          ordered: true,
        },
        {
          h: "No saved page? Type the answers as lines",
          p: [
            "If your response sheet is in a different layout, you can paste simple lines instead: one line per question with the question number, your option and the correct option, for example “12 B C”. Use a hyphen for a question you left, write B/C if two options are correct, and start a new section with a line like “# Reasoning”.",
            "Copied page text on its own does not work, because the correct answers are shown only as ticks. Upload the saved page or paste the page source instead.",
          ],
        },
        {
          h: "Why your official score may differ",
          p: [
            "The result is an estimate. The final score can change because of answer key corrections after objections, dropped questions, bonus marks and normalisation across shifts. If a question shows no correct option, the tool does not count it and tells you so; check the official notice for how it was treated.",
            "Your response sheet is read only on your phone. Nothing is uploaded.",
          ],
        },
      ],
      faq: [
        { q: "How is negative marking calculated?", a: "Multiply your wrong answers by the penalty per wrong answer and subtract that from the marks for correct answers. The exact marks come from your exam’s notification." },
        { q: "Do unattempted questions reduce my score?", a: "Usually not. Unattempted questions normally give zero, but always check the marking rules in the notification." },
        { q: "What if my exam is not in the list?", a: "Choose “Custom marking” and enter the marks for a correct answer and the penalty for a wrong one from the notification." },
        { q: "Why is my estimate different from the final result?", a: "Final scores can change due to revised answer keys, dropped questions, bonus marks and normalisation." },
        { q: "Is my response sheet uploaded?", a: "No. The file is read inside your browser on your own device." },
      ],
    },
    hi: {
      title: "आंसर की कैसे मिलाएँ और स्कोर कैसे निकालें (नेगेटिव मार्किंग के साथ)",
      description: "अपनी रिस्पॉन्स शीट और आंसर की से सही-गलत उत्तर गिनें, नेगेटिव मार्किंग लगाएँ और कुछ ही मिनट में अपना अनुमानित स्कोर जानें।",
      intro: "कंप्यूटर आधारित परीक्षा के बाद आमतौर पर रिस्पॉन्स शीट और प्रोविज़नल आंसर की जारी होती है। दोनों को प्रश्न-दर-प्रश्न मिलाने से पता चलता है कि आपके लगभग कितने नंबर आए। यहाँ नेगेटिव मार्किंग का हिसाब और हाथ से गिने बिना जल्दी अनुमान निकालने का तरीका बताया गया है।",
      sections: [
        {
          h: "रिस्पॉन्स शीट और आंसर की में फ़र्क",
          p: [
            "रिस्पॉन्स शीट में हर प्रश्न के साथ आपका चुना विकल्प होता है। आंसर की में सही विकल्प होता है। कई ऑनलाइन रिस्पॉन्स शीट में दोनों एक ही पेज पर होते हैं, आपका उत्तर लिखा होता है और सही विकल्प पर अक्सर हरा टिक लगा होता है।",
            "आपका स्कोर बस इतना है: कितने सही हुए, और नेगेटिव मार्किंग हो तो गलत उत्तरों के लिए कितने कटे।",
          ],
        },
        {
          h: "नेगेटिव मार्किंग का हिसाब",
          p: [
            "हर परीक्षा के नंबर अलग होते हैं, इसलिए मार्किंग स्कीम ऑफ़िशियल नोटिफ़िकेशन में पढ़ें। हिसाब हमेशा एक जैसा है: स्कोर = (सही उत्तर × सही पर नंबर) में से (गलत उत्तर × गलत पर कटने वाले नंबर) घटाएँ। छोड़े गए प्रश्नों पर आमतौर पर शून्य मिलता है।",
            "एक उदाहरण, नंबर सिर्फ़ समझाने के लिए हैं। मान लीजिए सही उत्तर पर 1 नंबर मिलता है और गलत पर एक चौथाई नंबर कटता है। आपके 60 सही और 20 गलत हैं, तो स्कोर होगा 60 में से 20 × 0.25 यानी 5 घटाकर, कुल 55।",
            "इसीलिए अंदाज़े से उत्तर देना नुकसान कर सकता है। एक चौथाई की कटौती में चार गलत अंदाज़े एक सही उत्तर के बराबर नंबर खा जाते हैं।",
          ],
        },
        {
          h: "रिस्पॉन्स शीट की फ़ाइल कैसे लें",
          p: ["FormSaathi का Answer key score calculator सेव किया हुआ रिस्पॉन्स शीट पेज पढ़ता है।"],
          list: [
            "ऑफ़िशियल वेबसाइट से रिस्पॉन्स शीट का लिंक खोलें और लॉगिन करें।",
            "कंप्यूटर पर Ctrl+S दबाएँ और पेज को “Webpage, HTML only” या complete में सेव करें।",
            "फोन पर Chrome के मेन्यू से Download चुनें, या Share से पेज सेव करें। .mhtml फ़ाइल भी चलती है।",
            "चाहें तो पेज का सोर्स खोलकर पूरा कॉपी भी कर सकते हैं।",
          ],
          ordered: true,
        },
        {
          h: "स्कोर निकालने के स्टेप",
          p: ["सेव किया पेज मिल गया तो बाकी काम लगभग एक मिनट का है।"],
          list: [
            "“परीक्षा (मार्किंग स्कीम)” में अपनी परीक्षा चुनें अगर लिस्ट में है, नहीं तो “अपनी मार्किंग डालें” चुनकर नोटिफ़िकेशन से सही पर नंबर और गलत पर कटने वाले नंबर लिखें।",
            "“सेव किया पेज अपलोड करें (.html / .mhtml)” दबाकर फ़ाइल चुनें, या बॉक्स में पेज सोर्स पेस्ट करें।",
            "“स्कोर निकालें” दबाएँ।",
            "सेक्शन के हिसाब से किए, सही, गलत और छोड़े प्रश्न, और कुल स्कोर दिखेगा।",
            "गलत उत्तरों की लिस्ट में हर प्रश्न का आपका और सही उत्तर देखें, और “सारांश कॉपी करें” से नतीजा शेयर करें।",
          ],
          ordered: true,
        },
        {
          h: "सेव पेज नहीं है? उत्तर लाइन में लिखें",
          p: [
            "अगर रिस्पॉन्स शीट किसी और तरह की है, तो आसान लाइनें पेस्ट करें: हर प्रश्न की एक लाइन, जिसमें प्रश्न नंबर, आपका विकल्प और सही विकल्प हो, जैसे “12 B C”। छोड़ा हो तो हाइफ़न (-) लिखें, दो विकल्प सही हों तो B/C, और नया सेक्शन “# Reasoning” जैसी लाइन से शुरू करें।",
            "पेज से कॉपी किया सिर्फ़ टेक्स्ट काम नहीं करता, क्योंकि सही उत्तर उसमें सिर्फ़ टिक के रूप में होते हैं। सेव किया पेज अपलोड करें या पेज सोर्स पेस्ट करें।",
          ],
        },
        {
          h: "ऑफ़िशियल स्कोर अलग क्यों हो सकता है",
          p: [
            "यह सिर्फ़ अनुमान है। आपत्तियों के बाद आंसर की बदलने, प्रश्न हटने, बोनस नंबर और अलग-अलग शिफ़्ट के नॉर्मलाइज़ेशन से फ़ाइनल स्कोर बदल सकता है। जिस प्रश्न में कोई सही विकल्प न दिखे, टूल उसे नहीं गिनता और बता देता है; उसके बारे में ऑफ़िशियल नोटिस देखें।",
            "आपकी रिस्पॉन्स शीट सिर्फ़ आपके फोन पर पढ़ी जाती है। कुछ भी अपलोड नहीं होता।",
          ],
        },
      ],
      faq: [
        { q: "नेगेटिव मार्किंग कैसे गिनते हैं?", a: "गलत उत्तरों की संख्या को हर गलत पर कटने वाले नंबर से गुणा करें और सही उत्तरों के नंबर में से घटा दें। सही नंबर आपकी परीक्षा के नोटिफ़िकेशन में होते हैं।" },
        { q: "क्या छोड़े गए प्रश्नों से नंबर कटते हैं?", a: "आमतौर पर नहीं, उन पर शून्य मिलता है। फिर भी नोटिफ़िकेशन में मार्किंग के नियम ज़रूर देखें।" },
        { q: "मेरी परीक्षा लिस्ट में नहीं है तो?", a: "“अपनी मार्किंग डालें” चुनें और नोटिफ़िकेशन से सही पर मिलने वाले और गलत पर कटने वाले नंबर लिखें।" },
        { q: "मेरा अनुमान फ़ाइनल रिज़ल्ट से अलग क्यों है?", a: "बदली हुई आंसर की, हटाए गए प्रश्न, बोनस नंबर और नॉर्मलाइज़ेशन से फ़ाइनल स्कोर बदल सकता है।" },
        { q: "क्या मेरी रिस्पॉन्स शीट अपलोड होती है?", a: "नहीं। फ़ाइल आपके ब्राउज़र में, आपके ही डिवाइस पर पढ़ी जाती है।" },
      ],
    },
  },
];
