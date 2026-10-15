/** Privacy, about and contact pages. Each section is a heading plus paragraphs. */
type Page = { title: string; description: string; sections: { h: string; p: string[] }[] };

const REPO = "https://github.com/hanishjindal770-coder/formsaathi";

export const infoEn = {
  links: { privacy: "Privacy policy", about: "About", contact: "Contact" },
  updated: "Last updated: 15 October 2026",
  privacy: {
    title: "Privacy policy",
    description: "FormSaathi works on your device. Your photos, PDFs and documents are never uploaded.",
    sections: [
      { h: "Your files stay on your device", p: ["Every tool on FormSaathi (resizing, cropping, compressing, converting, PDF tools, typing test, answer-key calculator and document makers) runs inside your browser. Your photos, signatures, PDFs and response sheets are processed on your phone or computer and are never sent to us or to anyone else."] },
      { h: "What is saved in your browser", p: ["Some tools remember things for you in your browser's local storage: your last chosen exam and language, your My Forms list, typing test history and the details you typed into the resume, biodata or letter makers. This stays on your device. You can delete it any time by clearing your browser's site data, and My Forms has an export button so you can keep a backup."] },
      { h: "Analytics", p: ["We may use Cloudflare Web Analytics to count page visits. It does not use cookies, does not track you across sites and does not collect personal information."] },
      { h: "Advertising", p: ["We may show ads from Google AdSense to keep the site free. Google and its partners may use cookies to show ads based on your visits to this and other websites. You can turn off personalised ads at https://adssettings.google.com. Where the law requires it, we will ask for your consent first."] },
      { h: "Links to other sites", p: ["Exam pages link to official notifications on government websites. Those sites have their own privacy policies."] },
      { h: "Children", p: ["FormSaathi is meant for students preparing for exams. We do not knowingly collect personal information from anyone, including children."] },
      { h: "Changes and contact", p: ["If this policy changes, we will update this page and the date above. Questions? See the contact page."] },
    ],
  } satisfies Page,
  about: {
    title: "About FormSaathi",
    description: "Free image, PDF and exam form tools that work right in your browser.",
    sections: [
      { h: "What FormSaathi is", p: ["FormSaathi is a free set of tools for photos, PDFs and online forms: resize, crop, compress and convert images, make and compress PDFs, and prepare documents for job and exam applications. It works on any phone, needs no sign-up, and keeps working offline after your first visit."] },
      { h: "Built for exam forms", p: ["Many Indian government exam forms reject photos and signatures for the wrong size, KB or background. FormSaathi includes presets for popular exams such as SSC, RRB, IBPS, SBI, UPSC and state exams, taken from their official notifications. Every exam page links to the official notification, and we mark clearly when a rule has not been checked yet."] },
      { h: "Not a government website", p: ["FormSaathi is an independent website. It is not linked to SSC, UPSC, RRB, IBPS, SBI or any state commission. Always confirm the rules in the official notification before you submit a form."] },
      { h: "Private by design", p: ["Your files never leave your device. There is no upload server, so there is nothing for us to store or lose."] },
    ],
  } satisfies Page,
  contact: {
    title: "Contact",
    description: "Report a problem, a wrong exam rule or suggest a new tool.",
    sections: [
      { h: "Report a problem or a wrong exam rule", p: [`Open an issue on our GitHub page: ${REPO}/issues. Please include the page link and, for exam rules, the link to the official notification.`] },
      { h: "Suggest a tool", p: ["Tell us which tool would save you time. We read every suggestion."] },
    ],
  } satisfies Page,
  repoIssues: `${REPO}/issues`,
  openIssue: "Open GitHub issues",
};

export const infoHi: typeof infoEn = {
  links: { privacy: "प्राइवेसी पॉलिसी", about: "हमारे बारे में", contact: "संपर्क" },
  updated: "पिछला अपडेट: 15 अक्टूबर 2026",
  privacy: {
    title: "प्राइवेसी पॉलिसी",
    description: "FormSaathi आपके डिवाइस पर ही काम करता है। आपकी फोटो, PDF और डॉक्यूमेंट कभी अपलोड नहीं होते।",
    sections: [
      { h: "आपकी फ़ाइलें आपके डिवाइस पर ही रहती हैं", p: ["FormSaathi का हर टूल (रिसाइज़, क्रॉप, कंप्रेस, कन्वर्ट, PDF टूल, टाइपिंग टेस्ट, आंसर की कैलकुलेटर और डॉक्यूमेंट मेकर) आपके ब्राउज़र के अंदर ही चलता है। आपकी फोटो, सिग्नेचर, PDF और रिस्पॉन्स शीट आपके फ़ोन या कंप्यूटर पर ही प्रोसेस होती हैं और हमें या किसी और को कभी नहीं भेजी जातीं।"] },
      { h: "आपके ब्राउज़र में क्या सेव होता है", p: ["कुछ टूल आपकी सुविधा के लिए ब्राउज़र की लोकल स्टोरेज में चीज़ें याद रखते हैं: आपकी चुनी हुई परीक्षा और भाषा, My Forms की सूची, टाइपिंग टेस्ट का रिकॉर्ड और रिज़्यूमे, बायोडाटा या पत्र मेकर में भरी जानकारी। यह सब आपके डिवाइस पर ही रहता है। ब्राउज़र की साइट डेटा साफ़ करके इसे कभी भी मिटा सकते हैं, और My Forms में बैकअप डाउनलोड करने का बटन है।"] },
      { h: "एनालिटिक्स", p: ["पेज विज़िट गिनने के लिए हम Cloudflare Web Analytics का इस्तेमाल कर सकते हैं। यह कुकी इस्तेमाल नहीं करता, आपको दूसरी साइटों पर ट्रैक नहीं करता और कोई निजी जानकारी नहीं लेता।"] },
      { h: "विज्ञापन", p: ["साइट को मुफ़्त रखने के लिए हम Google AdSense के विज्ञापन दिखा सकते हैं। Google और उसके पार्टनर इस और दूसरी वेबसाइटों पर आपकी विज़िट के आधार पर विज्ञापन दिखाने के लिए कुकी इस्तेमाल कर सकते हैं। पर्सनलाइज़्ड विज्ञापन https://adssettings.google.com पर बंद कर सकते हैं। जहाँ कानून ज़रूरी बनाता है, वहाँ हम पहले आपकी सहमति लेंगे।"] },
      { h: "दूसरी वेबसाइटों के लिंक", p: ["परीक्षा पेजों पर सरकारी वेबसाइटों की आधिकारिक अधिसूचना के लिंक हैं। उन साइटों की अपनी प्राइवेसी पॉलिसी होती है।"] },
      { h: "बच्चे", p: ["FormSaathi परीक्षा की तैयारी करने वाले छात्रों के लिए है। हम जानबूझकर किसी की, बच्चों समेत, निजी जानकारी नहीं लेते।"] },
      { h: "बदलाव और संपर्क", p: ["अगर यह पॉलिसी बदलती है, तो हम यह पेज और ऊपर की तारीख अपडेट करेंगे। कोई सवाल? संपर्क पेज देखें।"] },
    ],
  },
  about: {
    title: "FormSaathi के बारे में",
    description: "मुफ़्त इमेज, PDF और परीक्षा फॉर्म टूल, जो सीधे आपके ब्राउज़र में चलते हैं।",
    sections: [
      { h: "FormSaathi क्या है", p: ["FormSaathi फोटो, PDF और ऑनलाइन फॉर्म के लिए मुफ़्त टूल का सेट है: इमेज रिसाइज़, क्रॉप, कंप्रेस और कन्वर्ट करें, PDF बनाएँ और छोटी करें, और नौकरी व परीक्षा के आवेदन के लिए डॉक्यूमेंट तैयार करें। यह हर फ़ोन पर चलता है, साइन-अप की ज़रूरत नहीं, और पहली बार खोलने के बाद बिना इंटरनेट भी चलता है।"] },
      { h: "परीक्षा फॉर्म के लिए बना", p: ["कई सरकारी परीक्षा फॉर्म गलत साइज़, KB या बैकग्राउंड की वजह से फोटो और सिग्नेचर रिजेक्ट कर देते हैं। FormSaathi में SSC, RRB, IBPS, SBI, UPSC और राज्य परीक्षाओं के प्रीसेट हैं, जो उनकी आधिकारिक अधिसूचना से लिए गए हैं। हर परीक्षा पेज पर आधिकारिक अधिसूचना का लिंक है, और जो नियम अभी जाँचा नहीं गया उसे साफ़ बताया जाता है।"] },
      { h: "यह सरकारी वेबसाइट नहीं है", p: ["FormSaathi एक स्वतंत्र वेबसाइट है। इसका SSC, UPSC, RRB, IBPS, SBI या किसी राज्य आयोग से कोई संबंध नहीं है। फॉर्म जमा करने से पहले आधिकारिक अधिसूचना में नियम ज़रूर जाँच लें।"] },
      { h: "शुरू से प्राइवेट", p: ["आपकी फ़ाइलें आपके डिवाइस से बाहर नहीं जातीं। कोई अपलोड सर्वर नहीं है, इसलिए हमारे पास रखने या खोने के लिए कुछ भी नहीं है।"] },
    ],
  },
  contact: {
    title: "संपर्क",
    description: "कोई दिक्कत, गलत परीक्षा नियम बताएँ या नया टूल सुझाएँ।",
    sections: [
      { h: "दिक्कत या गलत परीक्षा नियम बताएँ", p: [`हमारे GitHub पेज पर issue खोलें: ${REPO}/issues। पेज का लिंक ज़रूर दें, और परीक्षा नियम के लिए आधिकारिक अधिसूचना का लिंक भी।`] },
      { h: "नया टूल सुझाएँ", p: ["बताइए कौन सा टूल आपका समय बचाएगा। हम हर सुझाव पढ़ते हैं।"] },
    ],
  },
  repoIssues: `${REPO}/issues`,
  openIssue: "GitHub issues खोलें",
};
