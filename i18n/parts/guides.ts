import type { ToolId } from "@/lib/tools/registry";

/**
 * How-to guide shown under each tool: a short intro for the search intent, steps that match the
 * real UI labels, and FAQs. Exam-specific rules (sizes, ages, marks) never go here: they come from
 * the exam data, so these texts stay true for every exam.
 */
export type Guide = { intro: string; steps: string[]; faq: { q: string; a: string }[] };

export const guidesEn: Record<ToolId, Guide> = {
  "resize-image": {
    intro:
      "Need a photo at an exact pixel size, or just smaller, for a form, a website or WhatsApp? Set the new width and height in pixels, cm or inches, or scale by a percentage. The photo is resized right in your browser and you download it straight away.",
    steps: [
      "Tap “Choose image” (or “Take photo” on a phone) and pick your photo.",
      "Pick “By percentage” and slide or tap 25%, 50% or 75%, or pick “By size” and type the width and height.",
      "Keep “Keep proportions” ticked so the face is not stretched; untick it only when you need an exact shape.",
      "Tap “Apply” and check the new size shown under the photo.",
      "Tap “Download” to save the resized photo.",
    ],
    faq: [
      {
        q: "Is my photo uploaded to a server?",
        a: "No. The resizing happens inside your own browser using your phone or computer's processor. The photo is never sent anywhere, and after your first visit the tool keeps working even without internet.",
      },
      {
        q: "How do I resize in cm or inches?",
        a: "Choose “By size”, then set Unit to Centimetres or Inches. A DPI box appears: the tool multiplies the size by the DPI to get pixels. 300 DPI suits printing; 72–100 is typical for screens and online forms.",
      },
      {
        q: "Why does my photo look blurry after making it bigger?",
        a: "Enlarging cannot add detail that the camera never captured, so the pixels are only stretched. If you ask for more than 4× the original size, the tool warns you and you have to tap “Apply anyway”. Start from a larger original photo where possible.",
      },
      {
        q: "Resizing did not reduce the KB enough. What now?",
        a: "Fewer pixels usually means fewer KB, but not to an exact number. After resizing, open the Compress tab, type the maximum KB you need and tap “Compress”. Then download once; both changes are saved together.",
      },
    ],
  },
  "crop-image": {
    intro:
      "Cut away extra background or pick just one part of a photo. Choose a ready shape such as square, 4:3, 16:9, 3:4 or passport (3.5×4.5 cm), type your own ratio, or crop freely. Good for profile pictures, documents and photos that must fit a fixed box.",
    steps: [
      "Tap “Choose image” and pick your photo.",
      "Under Shape, tap Free, 1:1, 4:3, 16:9, 3:4, Passport or Custom.",
      "Drag the box to move it and drag the round handle (or use the “Crop box size” slider) to resize it.",
      "Tap “Crop”, then “Download”.",
    ],
    faq: [
      {
        q: "Does cropping also make the photo a fixed pixel size?",
        a: "No, crop only cuts the picture; the size shown as “Crop: W × H px” is what you keep. If a form also wants an exact pixel size, open the Resize tab after cropping and type it there before you download.",
      },
      {
        q: "Can I undo a wrong crop?",
        a: "Yes. Tap “Undo” to go back one step, or “Start over” to return to the photo as you first opened it. Your original file on the phone is never changed; you only save a new copy when you tap Download.",
      },
      {
        q: "What does the Passport shape do?",
        a: "It locks the crop box to the 3.5 : 4.5 shape of a common passport photo, so the picture is not squashed later. It does not check face position or background; use the Photo resizer if you need an exam-ready photo.",
      },
      {
        q: "Does it work on a phone?",
        a: "Yes. The crop box responds to touch: drag with one finger to move it and pull the round handle to resize. Everything runs in the phone's browser, so the picture stays on your device.",
      },
    ],
  },
  "compress-image": {
    intro:
      "Bring a photo under a KB limit for an online form, email or chat. Type the maximum size (or tap 20, 50, 100, 200 or 500 KB) and the tool finds the best quality that fits. You see the before and after size before downloading.",
    steps: [
      "Tap “Choose image” and pick your photo.",
      "Keep “Target size (KB)” selected and type the maximum KB, or tap a ready size.",
      "Tap “Compress” and check the “Before → after” line.",
      "Tap “Download”.",
    ],
    faq: [
      {
        q: "Why could the tool not reach my KB target?",
        a: "Very large photos can hold too much detail for a tiny KB limit. The tool first lowers quality, then shrinks the pixels; if it still can't fit it shows the smallest size it made. Crop away empty background or resize the photo first, then compress again.",
      },
      {
        q: "My file is PNG. Why is the KB still high?",
        a: "PNG is lossless, so it has no quality setting and only fewer pixels can make it smaller. Tap “Use JPG”: JPG files of photos are usually many times smaller at almost the same look.",
      },
      {
        q: "Will compression make my photo look bad?",
        a: "At normal targets the change is hard to see. Very small targets can show blocky edges. You can switch to “Quality” and set it yourself, and “Original quality” removes the compression again.",
      },
      {
        q: "Where does the compression happen?",
        a: "On your own device. The browser re-encodes the image locally; no copy goes to any server, so it is safe for ID cards and personal photos.",
      },
    ],
  },
  "convert-image": {
    intro:
      "Change a photo between JPG, PNG and WebP when a site accepts only one format. Pick the format to save as and download. It also opens GIF and BMP images, and works without installing any app.",
    steps: [
      "Tap “Choose image” and pick your file.",
      "Under “Save as”, tap JPG, PNG or WebP.",
      "Check the size line under the picture.",
      "Tap “Download”.",
    ],
    faq: [
      {
        q: "JPG or PNG: which should I pick?",
        a: "JPG is best for photos and gives small files, which most forms want. PNG keeps sharp edges and transparency, so it suits logos, screenshots and graphics, but photo files get much larger.",
      },
      {
        q: "Why did the transparent background turn white?",
        a: "JPG cannot store transparency, so see-through areas are filled with white. Choose PNG or WebP if you need to keep the transparent background.",
      },
      {
        q: "Can I open iPhone HEIC photos?",
        a: "Only if your browser can read HEIC. If you see an error, on iPhone set Settings → Camera → Formats → Most Compatible, or share the photo as JPG first, then open it here.",
      },
      {
        q: "WebP is greyed out. Why?",
        a: "Some browsers (often Safari) cannot save WebP. JPG and PNG still work everywhere. The conversion itself happens on your device and nothing is uploaded.",
      },
    ],
  },
  "rotate-flip-image": {
    intro:
      "Fix a sideways or upside-down photo, or mirror a selfie so the text reads correctly. Rotate left, right or 180°, flip horizontally or vertically, and download the corrected picture in seconds.",
    steps: [
      "Tap “Choose image” and pick your photo.",
      "Tap “Rotate left”, “Rotate right” or “Rotate 180°” until it is straight.",
      "Tap “Flip horizontal” or “Flip vertical” to mirror it if needed.",
      "Tap “Download”.",
    ],
    faq: [
      {
        q: "My photo looks straight in the gallery but sideways on the website. Why?",
        a: "Phones often save a rotation tag instead of turning the pixels, and some websites ignore that tag. Opening the photo here and downloading it again saves it with the pixels the right way up.",
      },
      {
        q: "Does rotating reduce the quality?",
        a: "Turning by 90° steps just moves the pixels, so nothing is lost in the rotation. The file is saved again in its own format, so the KB may change slightly.",
      },
      {
        q: "How do I fix a mirrored selfie?",
        a: "Tap “Flip horizontal” once. Text and the side of your hair parting will then appear as others see them.",
      },
      {
        q: "Is the photo sent anywhere?",
        a: "No. The rotation runs inside the browser on your phone or computer. You can even turn off mobile data after the page loads and it will still work.",
      },
    ],
  },
  "add-text-to-image": {
    intro:
      "Write a name, date, caption or watermark on a photo, in Hindi or English. Choose the size, colour and position, add a background box, or repeat the text diagonally across the whole picture as a watermark before sharing it.",
    steps: [
      "Tap “Choose image” and pick your photo.",
      "Type in “Your text (Hindi or English)”.",
      "Set the text size, colour, “Bold”, “Background box” and opacity.",
      "Drag the text on the photo or use “Quick position”; tick “Repeat across the photo (watermark)” for a tiled watermark.",
      "Tap “Add text”, then “Download”.",
    ],
    faq: [
      {
        q: "Can I type in Hindi?",
        a: "Yes. Type or paste Devanagari text in the box; a Hindi font loads automatically so matras and half letters print correctly. You can mix Hindi and English in the same line.",
      },
      {
        q: "How do I watermark a document photo before sharing it?",
        a: "Type something like “Only for XYZ verification”, tick “Repeat across the photo (watermark)”, lower the opacity and set the angle. The text repeats over the whole picture, so it is hard to crop out.",
      },
      {
        q: "Can I add text in two places?",
        a: "Yes. Tap “Add text” for the first one, then change the text and position and tap “Add text” again. “Undo” removes the last one if you make a mistake.",
      },
      {
        q: "Is my document safe?",
        a: "The text is drawn onto the picture inside your browser. The image never leaves your device, which matters when you are marking ID cards or certificates.",
      },
    ],
  },
  "blur-image": {
    intro:
      "Hide a face, phone number, Aadhaar number or any private detail before you share a photo or screenshot. Drag over the area and blur or pixelate it. You can hide several areas one after another, and undo any of them.",
    steps: [
      "Tap “Choose image” and pick your photo or screenshot.",
      "Drag on the photo to mark the part to hide, or tap “Whole photo”.",
      "Pick “Blur” or “Pixelate” and set the strength.",
      "Tap “Blur this area” (or “Pixelate this area”); repeat for other areas.",
      "Tap “Download”.",
    ],
    faq: [
      {
        q: "Blur or pixelate: which hides better?",
        a: "Both work when the strength is high. For numbers and small text, pixelate with a large block size is the safest, because no letter shapes remain. Zoom into the result to check before sharing.",
      },
      {
        q: "Can someone remove the blur later?",
        a: "The downloaded file contains only the blurred pixels, not the original underneath. Keep the strength high enough that the text is unreadable, and share the downloaded copy, not the original.",
      },
      {
        q: "I blurred the wrong part. What do I do?",
        a: "Tap “Undo” to remove the last blur, or “Start over” to go back to the original. Each area you hide is a separate step.",
      },
      {
        q: "Does the photo get uploaded for blurring?",
        a: "No. Hiding private details on a server would defeat the purpose, so all blurring is done locally in your browser.",
      },
    ],
  },
  "image-to-text": {
    intro:
      "Copy Hindi or English text out of a photo, scanned page or screenshot instead of typing it again. Pick the language, tap Get text, then edit, copy or download the result as a .txt file. Text is read on your device.",
    steps: [
      "Tap “Choose image” or “Take photo” (you can also paste a screenshot).",
      "Under “Text language”, choose Hindi, English or Hindi + English.",
      "Tap “Get text” and wait for the progress to finish.",
      "Correct any mistakes in the text box, then tap “Copy” or “Download .txt”.",
    ],
    faq: [
      {
        q: "Does it read handwriting?",
        a: "Printed text works best. Handwriting is often read wrongly, especially joined Hindi writing, so treat the result as a draft and check every word before you use it in a form.",
      },
      {
        q: "Why does it need internet the first time?",
        a: "The language data (a few MB, shown under the language choice) downloads once. After that it is stored by the browser and text reading works offline. Your image is still read on your device, never uploaded.",
      },
      {
        q: "The result is full of wrong letters. How do I fix it?",
        a: "Use good light without shadow or glare, hold the phone straight above the page, and crop to only the text you need. Also check that the right language is selected: Hindi text read as English gives nonsense.",
      },
      {
        q: "Can I use a PDF?",
        a: "This tool takes images (JPG, PNG, WebP). Take a screenshot of the PDF page, or a photo of the printed page, and open that.",
      },
    ],
  },
  "bulk-resize": {
    intro:
      "Resize up to 100 photos at once and download them together as a ZIP. Scale by percentage, fit inside a box, make every image exactly the same size, or keep each under a KB limit. Handy for product photos, class records and document sets.",
    steps: [
      "Tap “Choose images” and select all the photos (use “Add more images” for more).",
      "Under “Resize by”, pick Percentage, “Fit within W × H”, “Exact W × H” or “Max size (KB)” and fill in the numbers.",
      "Choose the “Output format” (or keep “Same as original”).",
      "Tap “Resize N images” and wait for the progress.",
      "Tap “Download all (.zip)”, or download single images from the list.",
    ],
    faq: [
      {
        q: "What happens when the shape doesn't match with Exact W × H?",
        a: "You choose: “Crop to fill” trims the edges so the picture fills the size, and “Add white bars” keeps the whole picture and fills the empty sides with white.",
      },
      {
        q: "How many photos can I add?",
        a: "Up to 100 at a time. Very large photos take longer and use more memory, so on an older phone work in smaller batches. Files that are not supported images are skipped with a message.",
      },
      {
        q: "Why was a PNG saved as JPG?",
        a: "With a KB limit, PNG files are saved as JPG so the size can actually be controlled. GIF and BMP are saved as PNG, and transparent areas become white.",
      },
      {
        q: "Are my photos uploaded to make the ZIP?",
        a: "No. Each photo is resized and the ZIP is built inside your browser, so even a large batch never leaves your device.",
      },
    ],
  },
  "photo-resize": {
    intro:
      "Make your passport-size photo ready for an online application form. Pick your exam and the size, KB range and format from its official notification are filled in; or set your own. Crop around the face, make the photo, and see a checklist before you download.",
    steps: [
      "Tap “Choose photo” or “Take photo”.",
      "Drag the crop box so your face sits inside the guide; use “Crop size” and “Rotate” if needed.",
      "Check the rules line (“Set for …”), or open “Size settings” to enter width, height and KB yourself.",
      "Tap “Make Photo” and read the checklist.",
      "If everything shows ✅, tap “Download”.",
    ],
    faq: [
      {
        q: "Where do the exam's size and KB rules come from?",
        a: "On an exam page they come from that exam's data, taken from its notification, and you can tap “Change sizes” to adjust them. Notifications change, so always compare with the latest one before submitting.",
      },
      {
        q: "The checklist says the background is too dark. What should I do?",
        a: "The tool checks the photo's edges and warns if they look dark or coloured; it does not replace the background. Take a new photo in daylight against a plain white or light wall and try again.",
      },
      {
        q: "Why is the photo a little smaller in pixels than I expected?",
        a: "If the photo cannot get under the maximum KB at full size, the pixels are reduced too and a note tells you. If a very plain photo is below the minimum KB, hidden padding is added without affecting quality.",
      },
      {
        q: "Is it okay to use on a phone? Does my photo get uploaded?",
        a: "It is built for phones, including the camera button. The photo is cropped and compressed in the browser and is not uploaded anywhere.",
      },
    ],
  },
  "signature-resize": {
    intro:
      "Turn a phone photo of your signature into a clean upload: white paper, dark ink, cropped close and at the right KB. Pick your exam and the rules from its official notification are filled in, or enter your own size.",
    steps: [
      "Sign on plain white paper, then tap “Take photo” or “Choose photo”.",
      "Tap “Auto-crop to signature”, or drag the box around it yourself.",
      "Keep “Clean background” on, pick Black or Blue ink, and move “Darkness” if lines look too thin or too thick.",
      "Tap “Make Signature” and check the checklist.",
      "Tap “Download”.",
    ],
    faq: [
      {
        q: "My paper looks grey and shadowy. Will it be accepted?",
        a: "“Clean background” turns light grey paper and shadows white and makes the ink solid. If faint strokes disappear, lower the Darkness value; if dirt remains, raise it. A photo in good daylight gives the cleanest result.",
      },
      {
        q: "Which pen should I use?",
        a: "Use a dark black or blue pen that writes thick and smooth. Pencil and light gel ink are hard to clean. Follow your exam's notification for the ink colour it asks for.",
      },
      {
        q: "Why does it say it could not get under the KB limit?",
        a: "That happens when the crop is very large compared to the KB allowed. Crop tighter around the signature, or use “Change sizes” for fewer pixels if the rules allow, then make it again.",
      },
      {
        q: "Does my signature get stored anywhere?",
        a: "No. Cleaning and resizing run in your browser, and the signature exists only in the file you download.",
      },
    ],
  },
  "thumb-resize": {
    intro:
      "Prepare a left thumb impression for an exam form: clean the paper to white, make the ink dark, crop it and bring it to the right size and KB. Pick your exam and the rules from its official notification are filled in.",
    steps: [
      "Press your thumb on an ink pad and then on plain white paper.",
      "Tap “Take photo” or “Choose photo”, then “Auto-crop to signature” or drag the box around the print.",
      "Keep “Clean background” on, choose Black or Blue ink, and adjust “Darkness” until the ridges are clear.",
      "Tap “Make Thumb impression”, check the list, then tap “Download”.",
    ],
    faq: [
      {
        q: "The thumb lines are not visible after cleaning. What's wrong?",
        a: "Too much ink fills the ridges into a blob, and too little leaves gaps. Press once, without rolling, with a light coat of ink. Then try moving the Darkness slider both ways before taking a new photo.",
      },
      {
        q: "Left or right thumb?",
        a: "Use the thumb your exam's notification asks for; many ask for the left. The tool does not check which thumb you used.",
      },
      {
        q: "Can I take the photo with my phone?",
        a: "Yes. Hold the phone straight above the paper in good light, avoid your own shadow, and fill most of the screen with the print. Everything is processed on the phone.",
      },
      {
        q: "What file format will I get?",
        a: "JPG by default, or what the exam asks for. Outside exam mode you can choose JPG or PNG in “Size settings”.",
      },
    ],
  },
  "declaration-resize": {
    intro:
      "Some exams ask for a handwritten declaration as an image. Photograph the page, and this tool makes the paper white and the writing dark, crops it, and brings it to the right size and KB. Pick your exam and the rules from its official notification are filled in.",
    steps: [
      "Write the declaration text from your notification on plain white paper and sign it if asked.",
      "Tap “Take photo” or “Choose photo”.",
      "Tap “Auto-crop to signature” to crop around the writing, or drag the box yourself.",
      "Keep “Clean background” on and adjust “Darkness” until every letter is clear.",
      "Tap “Make Handwritten declaration”, check the list, then tap “Download”.",
    ],
    faq: [
      {
        q: "What text should I write?",
        a: "Copy the exact wording given in your exam's notification, in the language and style it asks for. This tool only prepares the image; it does not provide or check the declaration text.",
      },
      {
        q: "Letters look broken or too thick after cleaning.",
        a: "Move the Darkness slider: lower keeps fainter strokes, higher removes more paper shadow. Tap “Auto” to go back. Writing with a dark pen and taking the photo in daylight helps most.",
      },
      {
        q: "The page photo is tilted. Can I fix it?",
        a: "“Rotate” turns it in 90° steps only. For a small tilt, retake the photo with the phone held flat and straight above the page.",
      },
      {
        q: "Is the declaration uploaded?",
        a: "Not by this tool. It is processed in your browser; you upload the downloaded file to the exam site yourself.",
      },
    ],
  },
  "age-calculator": {
    intro:
      "Find your exact age in years, months and days on any date, or on an exam's cutoff date. Pick your exam and the age limits and cutoff from its official notification are filled in, with category relaxation, so you see eligibility at once.",
    steps: [
      "Choose your exam, or keep “No exam (just calculate age)”.",
      "Enter your “Date of birth” as on your 10th certificate.",
      "With an exam, choose your Category and tick PwD or Ex-serviceman if they apply.",
      "Without an exam, set “Age on date” and, if you like, the minimum and maximum age.",
      "Read your age and the eligible or not eligible result below.",
    ],
    faq: [
      {
        q: "How is the age counted?",
        a: "In completed years, months and days from your date of birth to the cutoff date. The result also shows the allowed date-of-birth range, which is easier to compare with the notification.",
      },
      {
        q: "Why is the Ex-serviceman result marked approximate?",
        a: "Ex-serviceman relaxation is usually worked out after subtracting the years of military service, which differs for each person. Use the result as a guide and check the notification's rule.",
      },
      {
        q: "Can I use it for a job that isn't in the list?",
        a: "Yes. Choose “No exam”, enter the cutoff date from that notification in “Age on date”, and type the minimum and maximum age. Relaxation is not added in this mode, because it differs for every recruitment.",
      },
      {
        q: "Is my date of birth saved?",
        a: "No. The calculation happens on the page itself; your date of birth isn't sent or stored anywhere.",
      },
    ],
  },
  "pdf-compress": {
    intro:
      "Shrink a PDF to 100, 200, 300 or 500 KB, or any size you type, so it fits an upload limit. Good for marksheets, certificates and scanned documents. The PDF is compressed in your browser page by page.",
    steps: [
      "Tap “Choose PDF” and pick the file.",
      "Under “Target size”, tap a size or type your own in “Custom KB”.",
      "Tap “Compress PDF” and wait while each page is processed.",
      "Check that the text is still readable, then tap “Download PDF”.",
    ],
    faq: [
      {
        q: "Why can't I select text in the compressed PDF?",
        a: "To reach the size, each page is turned into an image and saved with lower quality. The pages look the same but text becomes part of the picture. That is fine for uploads, but keep your original for editing.",
      },
      {
        q: "It says it could not get under my target. What can I do?",
        a: "Some long or very detailed PDFs can't fit a tiny limit even at the lowest quality. Try a larger target, remove pages you don't need, or scan at a lower resolution. If your PDF is already small enough, it is kept untouched.",
      },
      {
        q: "My PDF won't open in the tool.",
        a: "The file may be damaged or protected with a password. Download an unlocked copy, or print it to a new PDF, and try again.",
      },
      {
        q: "Is it safe for certificates and ID documents?",
        a: "Yes. The PDF is read and rebuilt inside your browser; it is never uploaded, so your documents stay on your own device.",
      },
    ],
  },
  "image-to-pdf": {
    intro:
      "Turn phone photos of marksheets, certificates or notes into one PDF for an upload or email. Add photos, put them in order, choose A4 or photo-sized pages, and download. Phone rotation is fixed automatically.",
    steps: [
      "Tap “Choose photos” and pick one or more images; use “Add more” for extra pages.",
      "Use ↑ and ↓ to set the page order, and ✕ to remove a page.",
      "Choose the Page size: “A4” or “Same as photo”.",
      "Tap “Make PDF”, then “Download PDF”.",
    ],
    faq: [
      {
        q: "A4 or Same as photo?",
        a: "A4 places each photo on a standard page with margins, which prints neatly. Same as photo makes each page exactly the size of the picture, with no white borders.",
      },
      {
        q: "The PDF is bigger than the upload limit.",
        a: "Photos are already re-saved at a sensible size, but many pages add up. Open the downloaded PDF in our Compress PDF tool and choose a KB target.",
      },
      {
        q: "Will the pages come out sideways?",
        a: "Every photo is re-drawn using the phone's rotation information, so pages normally come out upright. If one is still wrong, fix it first with the Rotate & flip tool.",
      },
      {
        q: "Are my documents uploaded?",
        a: "No. The PDF is created on your phone or computer. Nothing is sent to a server.",
      },
    ],
  },
  "pdf-merge": {
    intro:
      "Join several PDFs, such as marksheets, certificates and an ID, into one file in the order you choose. Pages are copied as they are, so quality does not change. Useful when a form allows only one PDF upload.",
    steps: [
      "Tap “Choose PDFs” and pick two or more files; use “Add more” for others.",
      "Use ↑ and ↓ to set the order, and ✕ to remove a file.",
      "Tap “Merge PDFs”.",
      "Tap “Download PDF”.",
    ],
    faq: [
      {
        q: "Does merging reduce quality?",
        a: "No. Pages are copied without re-compressing them, so text stays selectable and images stay sharp. The merged file is roughly the total size of the files you joined.",
      },
      {
        q: "The merged PDF is too big for the form.",
        a: "Run the merged file through the Compress PDF tool with the KB limit you need.",
      },
      {
        q: "It says a PDF could not be opened.",
        a: "That file may be damaged or password-protected. Get an unlocked copy of it, then add it again.",
      },
      {
        q: "Do I need to install anything?",
        a: "No. It runs in the browser on phone or computer, and the files never leave your device.",
      },
    ],
  },
  "passport-photo-sheet": {
    intro:
      "Print many passport photos from one picture: make an A4 sheet with 8, 16 or 32 photos, with cutting lines, ready for any print shop or home printer. Choose passport (3.5 × 4.5 cm) or stamp (2.5 × 3 cm) size.",
    steps: [
      "Tap “Choose photo” and pick a front-facing photo.",
      "Drag the crop box so the face sits inside the guide.",
      "Choose the “Number of photos” and “Photo size”.",
      "Tap “Make print sheet”.",
      "Download the PDF or JPG and print it.",
    ],
    faq: [
      {
        q: "Why do the photos print in the wrong size?",
        a: "The printer is probably scaling the page. Choose 100% scale or “Actual size” in the print settings, not “Fit to page”. The sheet is made at 300 DPI for A4 paper.",
      },
      {
        q: "Why did the size switch to stamp when I picked 32?",
        a: "32 passport-size photos don't fit on one A4 page, so stamp size is chosen. Pick 8 or 16 for passport size.",
      },
      {
        q: "Should I take the PDF or the JPG to the shop?",
        a: "Either works. PDF keeps the exact page size and is safest for printing; JPG is easier to send on WhatsApp. Ask the shop to print at actual size.",
      },
      {
        q: "Does the photo leave my phone?",
        a: "No. The sheet is drawn in your browser. Only you decide where the downloaded file goes.",
      },
    ],
  },
  "image-convert": {
    intro:
      "Convert one or many images between JPG and PNG when a form or app accepts only one type. It also opens WebP, GIF and BMP files. Each converted image gets its own download button.",
    steps: [
      "Tap “Choose images” and pick one or more files.",
      "Next to “Convert to”, tap PNG or JPG.",
      "Tap “Convert”.",
      "Tap “Download” next to each file.",
    ],
    faq: [
      {
        q: "What happens to a transparent background?",
        a: "PNG keeps transparency. JPG cannot store it, so transparent areas become white.",
      },
      {
        q: "Why is the PNG much bigger than my JPG?",
        a: "PNG saves every pixel exactly, which suits graphics but makes photo files large. If you need a small file for a form, convert to JPG instead.",
      },
      {
        q: "One file shows ⚠️ and no download.",
        a: "That file could not be read by your browser, for example an iPhone HEIC photo on a browser without HEIC support. Share it as JPG from the phone first, then convert.",
      },
      {
        q: "Where are the files converted?",
        a: "In your browser. The images are not uploaded, and the tool works offline once the page has loaded.",
      },
    ],
  },
  "typing-test": {
    intro:
      "Practise typing for skill tests in English, Mangal Inscript, Mangal Remington (GAIL) or Krutidev. Pick a time and passage, type, and get net and gross speed, accuracy, KDPH and a list of your mistakes. Pick your exam and its language, layout and time are set.",
    steps: [
      "Choose an exam (optional) or keep “Free practice”.",
      "Pick the Language, “Keyboard layout”, Time and Passage (or “My own passage”).",
      "Set Options like “Allow backspace”, then start typing; the timer starts with your first key.",
      "Tap “Submit” when done, or let the time run out.",
      "Read your result and mistakes, then tap “Start again” or “Next passage”.",
    ],
    faq: [
      {
        q: "Do I need a Krutidev or Mangal font installed?",
        a: "No. For Krutidev and Remington you press the same keys as in the exam and the tool turns them into Hindi on screen. Tap “Show key chart” if you forget where a letter is.",
      },
      {
        q: "How are net speed and mistakes calculated?",
        a: "Gross speed counts keystrokes ÷ 5 per minute. Wrong, missed or extra words are full mistakes; punctuation, capital or space differences are half mistakes. Open “How this is calculated” under the result for every formula. Each exam marks differently, so treat it as practice.",
      },
      {
        q: "Can I practise on a phone?",
        a: "Yes, but skill tests are taken on a computer keyboard, so practise there when you can. On a phone, English and Inscript work with the phone's keyboard.",
      },
      {
        q: "Are my results saved?",
        a: "Your recent tests and best net speed are kept only in this browser on this device. Nothing is sent to us.",
      },
    ],
  },
  "answer-key": {
    intro:
      "Check your expected score as soon as the answer key is out. Save your response sheet page, open it here, choose the exam or enter the marks, and get correct, wrong and unattempted counts with negative marking, section-wise.",
    steps: [
      "Open your response sheet on the official website and save the page (.html or .mhtml).",
      "Tap “Upload saved page (.html / .mhtml)”, or paste the page source or answer lines.",
      "Choose your exam for its marking scheme, or pick “Custom marking” and enter + and − marks.",
      "Tap “Calculate score”.",
      "Review the wrong answers list and tap “Copy summary” to share.",
    ],
    faq: [
      {
        q: "How do I save the response sheet on a phone?",
        a: "In Chrome, open the response sheet, tap the ⋮ menu and choose Download (or Share → Save page). The .mhtml file works. Copying just the visible text doesn't work because the correct answers are only green ticks.",
      },
      {
        q: "Why is my official score different?",
        a: "This is an estimate. Normalisation, bonus marks, and dropped or changed questions in the final key can all change the official result.",
      },
      {
        q: "My exam's page isn't read. What can I do?",
        a: "Type one line per question: question number, your option, correct option (e.g. 12 B C). Use - for not attempted, and a line like “# Reasoning” to start a new section.",
      },
      {
        q: "Is my roll number or response sheet uploaded?",
        a: "No. The saved page is read on your phone or computer, and nothing in it is sent anywhere.",
      },
    ],
  },
  "my-forms": {
    intro:
      "Keep every government form you apply for in one list: status, application number, fee, last date, admit card, exam and result dates, and notes. The next date for each form is shown with how many days are left.",
    steps: [
      "Tap “Add a form”.",
      "Choose the exam from the list or type its name.",
      "Fill in the status, application number, fee and dates you know.",
      "Tap “Save”; use “Edit” whenever something changes.",
      "Tap “Export backup” now and then to keep a copy.",
    ],
    faq: [
      {
        q: "Where is my list stored?",
        a: "Only in this browser on this phone. There is no account and nothing is sent to a server, which also means clearing browser data deletes the list.",
      },
      {
        q: "How do I move my list to a new phone?",
        a: "Tap “Export backup” to download a file, send it to your new phone, and use “Import backup” there.",
      },
      {
        q: "Does it fill in exam dates automatically?",
        a: "No. Choosing from the list only fills the exam name. Enter the dates yourself from the official notification or admit card, so they are always the ones that apply to you.",
      },
      {
        q: "It says it could not save.",
        a: "Your browser storage may be full or you may be in private/incognito mode, where storage is cleared or blocked. Open the site in a normal tab.",
      },
    ],
  },
  countdown: {
    intro:
      "See how many days are left until your exam, plus every other upcoming date from My Forms, and tick off syllabus topics as you finish them. Add an exam date in a few seconds and come back to track your preparation.",
    steps: [
      "Under “Add an exam date”, type the exam name and pick the date.",
      "Tap “Add countdown”.",
      "Under “Syllabus checklist”, paste topics from the official syllabus, one per line, and tap “Add topics”.",
      "Tick topics as you finish them; the done count updates.",
    ],
    faq: [
      {
        q: "Does FormSaathi give the syllabus?",
        a: "No. Copy the topics from your exam's official syllabus. That way the list always matches what your exam actually covers.",
      },
      {
        q: "Is this linked to My Forms?",
        a: "Yes. Dates you add here appear in My Forms, and the countdown shows upcoming dates from every form there. Tap “Open My Forms” to add fees, application numbers and other dates.",
      },
      {
        q: "Will I get a reminder?",
        a: "No notifications are sent. Open the page to see the days left; it works offline after your first visit, so you can add it to your home screen.",
      },
      {
        q: "Who can see my checklist?",
        a: "No one else. It is saved only in this browser on your device, with no login.",
      },
    ],
  },
  "resume-maker": {
    intro:
      "Make a clean one-page resume in Hindi or English and download it as a PDF. Fill in contact, education, experience, skills and personal details, choose a Classic or Modern design, add a photo if you want, and see a live preview.",
    steps: [
      "Choose the “Language of the document” and the Design (Classic or Modern).",
      "Fill in name and contact, career objective, education and experience; add a photo if you like.",
      "Add skills, languages, personal details, place and date.",
      "Check the Preview, then tap “Download PDF” or “Print”.",
    ],
    faq: [
      {
        q: "I am a fresher. What about work experience?",
        a: "Leave the experience section empty and it won't be printed. Put internships, typing speed or computer courses under skills instead.",
      },
      {
        q: "Is a photo necessary?",
        a: "No, it is optional. Many private jobs prefer no photo; some government or local jobs expect one. Use a clear passport-style picture if you add it.",
      },
      {
        q: "Will my details be lost if I close the page?",
        a: "What you type is saved automatically in this browser on this phone, so you can come back later. “Clear form” wipes it. Nothing is uploaded.",
      },
      {
        q: "Can I make it in Hindi?",
        a: "Yes. Choose हिंदी as the document language; headings switch to Hindi and you can type your details in Devanagari.",
      },
    ],
  },
  "biodata-maker": {
    intro:
      "Make a neat marriage biodata in Hindi or English, with photo, and download it as a PDF to share on WhatsApp or print. Fill in personal, family and contact details; empty fields are left out automatically.",
    steps: [
      "Choose the “Language of the document”; tick “Print a line at the top (e.g. ॥ श्री गणेशाय नमः ॥)” if you want one.",
      "Add a photo, then fill in personal details such as date, time and place of birth, height, education and occupation.",
      "Add family details and brothers/sisters with “Add brother/sister”.",
      "Fill in contact details, check the Preview, and tap “Download PDF”.",
    ],
    faq: [
      {
        q: "Do I have to fill every field?",
        a: "No. Empty fields are not printed, so leave out anything you don't want to share, such as income or caste.",
      },
      {
        q: "Can I change the top line?",
        a: "Yes. Tick the option and type your own line, such as a family deity's name, or untick it to leave the top plain.",
      },
      {
        q: "How do I send it on WhatsApp?",
        a: "Tap “Download PDF”, then share the downloaded file from your phone's Downloads or Files app. PDF keeps the layout the same on every phone.",
      },
      {
        q: "Who can see my family details?",
        a: "Only you. Details are kept in this browser on your phone so you can edit them later, and they are never uploaded.",
      },
    ],
  },
  "letter-maker": {
    intro:
      "Make an application letter, an NOC from a parent or employer, or a self-declaration in Hindi or English. Fill in a few details, edit the ready text as you like, and download a PDF to print and sign. These are general formats, not official ones.",
    steps: [
      "Under “Choose a letter”, pick the kind of letter and the document language.",
      "Fill in the details: names, address, purpose, and the “To” address, place and date.",
      "Edit the heading, subject or body in “Letter text (edit freely)” if needed.",
      "Check the Preview, then tap “Download PDF” or “Print”, and sign the printout.",
    ],
    faq: [
      {
        q: "Is this an official government format?",
        a: "No. These are general formats. If your exam, office or department gives its own format, use that exact one; you can still type its wording into the letter text here.",
      },
      {
        q: "I edited the text. Why don't my detail changes show now?",
        a: "Once you edit the letter text yourself, it is not overwritten. Tap “Rebuild text from details” to regenerate it, which replaces your edits.",
      },
      {
        q: "How do I sign it?",
        a: "Print the PDF and sign by hand above your name. If you need it as a file, scan or photograph the signed page and use our Images to PDF tool.",
      },
      {
        q: "Is the letter saved anywhere online?",
        a: "No. Your details stay in this browser on your phone, and the PDF is made on the device.",
      },
    ],
  },
};

export const guidesHi: typeof guidesEn = {
  "resize-image": {
    intro:
      "फ़ॉर्म, वेबसाइट या WhatsApp के लिए फोटो किसी तय पिक्सल साइज़ में चाहिए, या बस छोटी करनी है? चौड़ाई-ऊँचाई पिक्सल, cm या इंच में डालें, या प्रतिशत से छोटा करें। फोटो आपके ब्राउज़र में ही बदलती है और तुरंत डाउनलोड हो जाती है।",
    steps: [
      "“फ़ोटो चुनें” दबाएँ (फ़ोन पर “फ़ोटो खींचें” भी है) और अपनी फोटो लें।",
      "“प्रतिशत से” चुनकर 25%, 50% या 75% दबाएँ, या “साइज़ डालकर” चुनकर चौड़ाई और ऊँचाई लिखें।",
      "“अनुपात वही रखें” पर टिक रहने दें ताकि चेहरा खिंचे नहीं; ठीक-ठीक आकार चाहिए तभी हटाएँ।",
      "“लागू करें” दबाएँ और फोटो के नीचे नया साइज़ देख लें।",
      "“डाउनलोड” दबाकर फोटो सेव करें।",
    ],
    faq: [
      {
        q: "क्या मेरी फोटो किसी सर्वर पर जाती है?",
        a: "नहीं। साइज़ आपके अपने फ़ोन या कंप्यूटर के ब्राउज़र में बदला जाता है, फोटो कहीं नहीं भेजी जाती। एक बार साइट खुल जाए तो बाद में बिना इंटरनेट के भी यह टूल चलता है।",
      },
      {
        q: "cm या इंच में साइज़ कैसे करें?",
        a: "“साइज़ डालकर” चुनें, फिर “इकाई” में सेंटीमीटर या इंच चुनें। एक DPI बॉक्स आएगा, उसी से पिक्सल निकाले जाते हैं। प्रिंट के लिए 300 DPI ठीक है, ऑनलाइन फ़ॉर्म और स्क्रीन के लिए आमतौर पर 72–100।",
      },
      {
        q: "बड़ा करने पर फोटो धुंधली क्यों हो गई?",
        a: "जो डिटेल कैमरे ने खींची ही नहीं, वह बड़ा करने से नहीं आती, पिक्सल बस खिंच जाते हैं। असली फोटो से 4 गुना से ज़्यादा बड़ा करने पर टूल चेतावनी देता है और “फिर भी लागू करें” दबाना पड़ता है। हो सके तो बड़ी असली फोटो से शुरू करें।",
      },
      {
        q: "साइज़ छोटा किया पर KB उतना कम नहीं हुआ, अब क्या करें?",
        a: "कम पिक्सल से KB आमतौर पर घटता है, पर किसी तय नंबर तक नहीं। साइज़ बदलने के बाद “KB कम” टैब खोलें, ज़्यादा से ज़्यादा KB लिखें और “KB कम करें” दबाएँ। फिर एक बार डाउनलोड करें, दोनों बदलाव साथ में सेव होंगे।",
      },
    ],
  },
  "crop-image": {
    intro:
      "फोटो का फालतू बैकग्राउंड हटाना है या सिर्फ़ एक हिस्सा चाहिए? स्क्वायर, 4:3, 16:9, 3:4 या पासपोर्ट (3.5×4.5 cm) जैसा तैयार आकार चुनें, अपना अनुपात डालें, या फ़्री क्रॉप करें। प्रोफ़ाइल फोटो, डॉक्यूमेंट और तय बॉक्स वाली फोटो के लिए काम का है।",
    steps: [
      "“फ़ोटो चुनें” दबाकर फोटो लें।",
      "“आकार” में फ़्री, 1:1, 4:3, 16:9, 3:4, पासपोर्ट या “अपना” चुनें।",
      "बॉक्स को खींचकर हिलाएँ और गोल हैंडल (या “क्रॉप बॉक्स का साइज़” स्लाइडर) से छोटा-बड़ा करें।",
      "“क्रॉप करें” दबाएँ, फिर “डाउनलोड”।",
    ],
    faq: [
      {
        q: "क्या क्रॉप करने से फोटो तय पिक्सल की हो जाती है?",
        a: "नहीं, क्रॉप सिर्फ़ फोटो काटता है; “क्रॉप: W × H px” में जो साइज़ दिखता है वही रहता है। अगर फ़ॉर्म को ठीक पिक्सल साइज़ भी चाहिए, तो क्रॉप के बाद “साइज़” टैब में वह साइज़ डालें, फिर डाउनलोड करें।",
      },
      {
        q: "गलत क्रॉप हो गया, वापस कैसे करें?",
        a: "“पहले जैसा” दबाने से एक कदम पीछे जाते हैं, और “फिर से शुरू” से वही फोटो मिलती है जो पहली बार खोली थी। फ़ोन में रखी आपकी असली फ़ाइल कभी नहीं बदलती, डाउनलोड पर नई कॉपी बनती है।",
      },
      {
        q: "पासपोर्ट आकार क्या करता है?",
        a: "यह क्रॉप बॉक्स को पासपोर्ट फोटो के 3.5 : 4.5 आकार में बाँध देता है ताकि बाद में फोटो दबे या खिंचे नहीं। यह चेहरे की जगह या बैकग्राउंड नहीं जाँचता; परीक्षा के लिए फोटो चाहिए तो फोटो रिसाइज़र इस्तेमाल करें।",
      },
      {
        q: "क्या यह फ़ोन पर चलता है?",
        a: "हाँ। क्रॉप बॉक्स टच से चलता है: एक उँगली से खिसकाएँ और गोल हैंडल खींचकर साइज़ बदलें। सब कुछ फ़ोन के ब्राउज़र में होता है, फोटो आपके पास ही रहती है।",
      },
    ],
  },
  "compress-image": {
    intro:
      "ऑनलाइन फ़ॉर्म, ईमेल या चैट के लिए फोटो को तय KB से नीचे लाना है? ज़्यादा से ज़्यादा KB लिखें (या 20, 50, 100, 200, 500 KB दबाएँ), टूल उस साइज़ में सबसे अच्छी क्वालिटी ढूँढ लेता है। डाउनलोड से पहले पहले और बाद का साइज़ दिखता है।",
    steps: [
      "“फ़ोटो चुनें” दबाकर फोटो लें।",
      "“KB साइज़” चुना रहने दें और ज़्यादा से ज़्यादा KB लिखें, या तैयार साइज़ दबाएँ।",
      "“KB कम करें” दबाएँ और “पहले → अब” वाली लाइन देखें।",
      "“डाउनलोड” दबाएँ।",
    ],
    faq: [
      {
        q: "मेरा KB टारगेट पूरा क्यों नहीं हुआ?",
        a: "बहुत बड़ी फोटो में इतनी डिटेल होती है कि बहुत कम KB में नहीं आती। टूल पहले क्वालिटी घटाता है, फिर पिक्सल; फिर भी न हो तो सबसे छोटा साइज़ बता देता है। पहले फालतू बैकग्राउंड क्रॉप करें या साइज़ छोटा करें, फिर दोबारा KB कम करें।",
      },
      {
        q: "मेरी फ़ाइल PNG है, KB कम क्यों नहीं हो रहा?",
        a: "PNG में क्वालिटी सेटिंग नहीं होती, उसे सिर्फ़ पिक्सल घटाकर छोटा किया जा सकता है। “JPG इस्तेमाल करें” दबाएँ: फोटो के लिए JPG फ़ाइल कई गुना छोटी बनती है और दिखने में लगभग वैसी ही रहती है।",
      },
      {
        q: "क्या KB कम करने से फोटो खराब दिखेगी?",
        a: "सामान्य टारगेट पर फ़र्क मुश्किल से दिखता है। बहुत कम KB पर किनारे चौकोर-से दिख सकते हैं। “क्वालिटी” चुनकर खुद भी सेट कर सकते हैं, और “असली क्वालिटी” से बदलाव हट जाता है।",
      },
      {
        q: "कंप्रेस कहाँ होता है?",
        a: "आपके अपने डिवाइस पर। ब्राउज़र ही फोटो को दोबारा सेव करता है, कोई कॉपी सर्वर पर नहीं जाती, इसलिए आईडी कार्ड और निजी फोटो के लिए भी सुरक्षित है।",
      },
    ],
  },
  "convert-image": {
    intro:
      "वेबसाइट सिर्फ़ एक ही फ़ॉर्मेट ले रही है? फोटो को JPG, PNG और WebP में आपस में बदलें। किस फ़ॉर्मेट में सेव करना है चुनें और डाउनलोड करें। GIF और BMP भी खुल जाती हैं, कोई ऐप डालने की ज़रूरत नहीं।",
    steps: [
      "“फ़ोटो चुनें” दबाकर फ़ाइल लें।",
      "“किस फ़ॉर्मेट में सेव करें” में JPG, PNG या WebP दबाएँ।",
      "फोटो के नीचे साइज़ वाली लाइन देख लें।",
      "“डाउनलोड” दबाएँ।",
    ],
    faq: [
      {
        q: "JPG लूँ या PNG?",
        a: "फोटो के लिए JPG सबसे अच्छा है, फ़ाइल छोटी बनती है और ज़्यादातर फ़ॉर्म यही माँगते हैं। PNG तेज़ किनारे और पारदर्शिता रखता है, इसलिए लोगो, स्क्रीनशॉट और ग्राफ़िक के लिए ठीक है, पर फोटो की फ़ाइल काफ़ी बड़ी हो जाती है।",
      },
      {
        q: "पारदर्शी बैकग्राउंड सफ़ेद क्यों हो गया?",
        a: "JPG में पारदर्शिता होती ही नहीं, इसलिए वह हिस्सा सफ़ेद भर दिया जाता है। पारदर्शी बैकग्राउंड रखना है तो PNG या WebP चुनें।",
      },
      {
        q: "iPhone की HEIC फोटो खुलेगी?",
        a: "तभी, जब आपका ब्राउज़र HEIC पढ़ सके। गलती दिखे तो iPhone में Settings → Camera → Formats → Most Compatible चुनें, या फोटो को पहले JPG में शेयर करें, फिर यहाँ खोलें।",
      },
      {
        q: "WebP बटन धुंधला क्यों है?",
        a: "कुछ ब्राउज़र (अक्सर Safari) WebP सेव नहीं कर पाते। JPG और PNG हर जगह चलते हैं। बदलाव आपके डिवाइस पर ही होता है, कुछ अपलोड नहीं होता।",
      },
    ],
  },
  "rotate-flip-image": {
    intro:
      "फोटो टेढ़ी या उल्टी आ गई, या सेल्फ़ी में लिखावट उल्टी दिख रही है? बाएँ, दाएँ या 180° घुमाएँ, दाएँ-बाएँ या ऊपर-नीचे उल्टा करें, और सही फोटो कुछ सेकंड में डाउनलोड करें।",
    steps: [
      "“फ़ोटो चुनें” दबाकर फोटो लें।",
      "फोटो सीधी होने तक “बाएँ घुमाएँ”, “दाएँ घुमाएँ” या “180° घुमाएँ” दबाएँ।",
      "ज़रूरत हो तो “उल्टा (दाएँ-बाएँ)” या “उल्टा (ऊपर-नीचे)” दबाएँ।",
      "“डाउनलोड” दबाएँ।",
    ],
    faq: [
      {
        q: "गैलरी में फोटो सीधी है, पर वेबसाइट पर टेढ़ी दिखती है, क्यों?",
        a: "फ़ोन अक्सर पिक्सल घुमाने की जगह फ़ाइल में बस घुमाने का निशान रख देते हैं, और कुछ वेबसाइट उसे नहीं मानतीं। यहाँ खोलकर दोबारा डाउनलोड करने से फोटो सच में सीधी होकर सेव होती है।",
      },
      {
        q: "क्या घुमाने से क्वालिटी कम होती है?",
        a: "90° के हिसाब से घुमाने में पिक्सल सिर्फ़ अपनी जगह बदलते हैं, कुछ खोता नहीं। फ़ाइल अपने ही फ़ॉर्मेट में दोबारा सेव होती है, इसलिए KB थोड़ा ऊपर-नीचे हो सकता है।",
      },
      {
        q: "उल्टी सेल्फ़ी कैसे ठीक करें?",
        a: "एक बार “उल्टा (दाएँ-बाएँ)” दबाएँ। फिर लिखावट और बालों की माँग वैसी दिखेगी जैसी दूसरों को दिखती है।",
      },
      {
        q: "क्या फोटो कहीं भेजी जाती है?",
        a: "नहीं। घुमाने का काम आपके फ़ोन या कंप्यूटर के ब्राउज़र में होता है। पेज खुलने के बाद मोबाइल डेटा बंद कर दें, तब भी चलेगा।",
      },
    ],
  },
  "add-text-to-image": {
    intro:
      "फोटो पर नाम, तारीख, कैप्शन या वॉटरमार्क लिखें, हिंदी या अंग्रेज़ी में। साइज़, रंग और जगह चुनें, पीछे बॉक्स लगाएँ, या शेयर करने से पहले टेक्स्ट को पूरी फोटो पर तिरछा दोहराकर वॉटरमार्क बनाएँ।",
    steps: [
      "“फ़ोटो चुनें” दबाकर फोटो लें।",
      "“आपका टेक्स्ट (हिंदी या English)” में लिखें।",
      "टेक्स्ट का साइज़, रंग, “मोटा (Bold)”, “पीछे बॉक्स” और गहराई (Opacity) सेट करें।",
      "टेक्स्ट को फोटो पर खींचें या “जल्दी जगह चुनें” से जगह दें; वॉटरमार्क के लिए “पूरी फ़ोटो पर दोहराएँ (वॉटरमार्क)” पर टिक करें।",
      "“टेक्स्ट जोड़ें” दबाएँ, फिर “डाउनलोड”।",
    ],
    faq: [
      {
        q: "क्या हिंदी में लिख सकते हैं?",
        a: "हाँ। बॉक्स में देवनागरी टाइप या पेस्ट करें; हिंदी फ़ॉन्ट अपने आप लोड होता है, इसलिए मात्राएँ और आधे अक्षर सही छपते हैं। एक ही लाइन में हिंदी और English दोनों लिख सकते हैं।",
      },
      {
        q: "डॉक्यूमेंट की फोटो शेयर करने से पहले वॉटरमार्क कैसे लगाएँ?",
        a: "“सिर्फ़ XYZ वेरिफ़िकेशन के लिए” जैसा कुछ लिखें, “पूरी फ़ोटो पर दोहराएँ (वॉटरमार्क)” पर टिक करें, गहराई कम करें और तिरछापन सेट करें। टेक्स्ट पूरी फोटो पर दोहराया जाता है, इसलिए काटकर हटाना मुश्किल होता है।",
      },
      {
        q: "क्या दो जगह टेक्स्ट लिख सकते हैं?",
        a: "हाँ। पहला लिखकर “टेक्स्ट जोड़ें” दबाएँ, फिर टेक्स्ट और जगह बदलकर दोबारा “टेक्स्ट जोड़ें” दबाएँ। गलती हो तो “पहले जैसा” से आखिरी वाला हट जाता है।",
      },
      {
        q: "मेरा डॉक्यूमेंट सुरक्षित है?",
        a: "टेक्स्ट आपके ब्राउज़र में ही फोटो पर बनाया जाता है। फोटो आपके डिवाइस से बाहर नहीं जाती, जो आईडी कार्ड या सर्टिफ़िकेट पर निशान लगाते समय बहुत ज़रूरी है।",
      },
    ],
  },
  "blur-image": {
    intro:
      "फोटो या स्क्रीनशॉट शेयर करने से पहले चेहरा, मोबाइल नंबर, आधार नंबर या कोई भी निजी जानकारी छिपाएँ। उस हिस्से पर उँगली खींचें और धुंधला या पिक्सल वाला कर दें। एक के बाद एक कई हिस्से छिपा सकते हैं, और हर एक वापस भी हो सकता है।",
    steps: [
      "“फ़ोटो चुनें” दबाकर फोटो या स्क्रीनशॉट लें।",
      "जो हिस्सा छिपाना है उस पर उँगली खींचें, या “पूरी फ़ोटो” दबाएँ।",
      "“धुंधला” या “पिक्सल वाला” चुनें और ताकत सेट करें।",
      "“यह हिस्सा धुंधला करें” (या “यह हिस्सा पिक्सल करें”) दबाएँ; बाकी हिस्सों के लिए दोहराएँ।",
      "“डाउनलोड” दबाएँ।",
    ],
    faq: [
      {
        q: "धुंधला या पिक्सल, कौन ज़्यादा अच्छे से छिपाता है?",
        a: "ताकत ज़्यादा हो तो दोनों ठीक हैं। नंबर और छोटे अक्षरों के लिए बड़े खाने वाला पिक्सल सबसे सुरक्षित है, क्योंकि अक्षरों का आकार बिल्कुल नहीं बचता। शेयर करने से पहले ज़ूम करके देख लें।",
      },
      {
        q: "क्या कोई बाद में धुंधलापन हटा सकता है?",
        a: "डाउनलोड हुई फ़ाइल में सिर्फ़ धुंधले पिक्सल होते हैं, नीचे असली फोटो नहीं होती। ताकत इतनी रखें कि अक्षर पढ़े न जाएँ, और असली नहीं, डाउनलोड वाली कॉपी ही शेयर करें।",
      },
      {
        q: "गलत हिस्सा धुंधला हो गया, क्या करें?",
        a: "“पहले जैसा” दबाकर आखिरी बदलाव हटाएँ, या “फिर से शुरू” से असली फोटो पर लौटें। हर छिपाया गया हिस्सा अलग कदम होता है।",
      },
      {
        q: "क्या धुंधला करने के लिए फोटो अपलोड होती है?",
        a: "नहीं। निजी जानकारी छिपाने के लिए उसे सर्वर पर भेजना उल्टा पड़ता, इसलिए सारा काम आपके ब्राउज़र में ही होता है।",
      },
    ],
  },
  "image-to-text": {
    intro:
      "फोटो, स्कैन पेज या स्क्रीनशॉट से हिंदी या अंग्रेज़ी टेक्स्ट कॉपी करें, दोबारा टाइप करने की ज़रूरत नहीं। भाषा चुनें, “टेक्स्ट निकालें” दबाएँ, फिर टेक्स्ट ठीक करें, कॉपी करें या .txt फ़ाइल में डाउनलोड करें। टेक्स्ट आपके डिवाइस पर ही पढ़ा जाता है।",
    steps: [
      "“फोटो चुनें” या “फोटो खींचें” दबाएँ (स्क्रीनशॉट पेस्ट भी कर सकते हैं)।",
      "“लिखावट की भाषा” में हिंदी, English या हिंदी + English चुनें।",
      "“टेक्स्ट निकालें” दबाएँ और प्रोग्रेस पूरी होने दें।",
      "बॉक्स में गलतियाँ ठीक करें, फिर “कॉपी करें” या “.txt डाउनलोड करें” दबाएँ।",
    ],
    faq: [
      {
        q: "क्या हाथ की लिखावट पढ़ता है?",
        a: "छपा हुआ टेक्स्ट सबसे अच्छा पढ़ा जाता है। हाथ की लिखावट, खासकर जुड़ी हुई हिंदी, अक्सर गलत पढ़ी जाती है। इसे कच्चा ड्राफ़्ट मानें और फ़ॉर्म में डालने से पहले हर शब्द जाँच लें।",
      },
      {
        q: "पहली बार इंटरनेट क्यों चाहिए?",
        a: "भाषा का डेटा (कुछ MB, भाषा चुनने के नीचे लिखा है) एक बार डाउनलोड होता है। फिर ब्राउज़र उसे रख लेता है और बिना इंटरनेट भी टेक्स्ट पढ़ा जाता है। फोटो तब भी आपके डिवाइस पर ही पढ़ी जाती है, अपलोड नहीं होती।",
      },
      {
        q: "नतीजे में बहुत गलत अक्षर आ रहे हैं, कैसे सुधारें?",
        a: "अच्छी रोशनी रखें, छाया या चमक न हो, फ़ोन को पेज के ठीक ऊपर सीधा पकड़ें, और सिर्फ़ ज़रूरी टेक्स्ट वाला हिस्सा क्रॉप करें। सही भाषा चुनी है यह भी देखें: हिंदी को English में पढ़वाने पर बेकार नतीजा आता है।",
      },
      {
        q: "क्या PDF डाल सकते हैं?",
        a: "यह टूल फोटो (JPG, PNG, WebP) लेता है। PDF पेज का स्क्रीनशॉट लें या छपे पेज की फोटो खींचें, और वह खोलें।",
      },
    ],
  },
  "bulk-resize": {
    intro:
      "एक साथ 100 तक फोटो का साइज़ बदलें और सब एक ZIP में डाउनलोड करें। प्रतिशत से छोटा करें, किसी बॉक्स के अंदर लाएँ, सबको बिल्कुल एक साइज़ का बनाएँ, या हर फोटो को KB लिमिट में रखें। प्रोडक्ट फोटो, स्कूल रिकॉर्ड और डॉक्यूमेंट के सेट के लिए आसान।",
    steps: [
      "“फोटो चुनें” दबाकर सारी फोटो चुनें (और के लिए “और फोटो जोड़ें”)।",
      "“किस तरह छोटा करें” में “प्रतिशत (%)”, “W × H के अंदर”, “ठीक W × H” या “अधिकतम साइज़ (KB)” चुनकर नंबर भरें।",
      "“आउटपुट फ़ॉर्मेट” चुनें (या “जैसा था वैसा” रहने दें)।",
      "“N फोटो का साइज़ बदलें” दबाएँ और प्रोग्रेस पूरी होने दें।",
      "“सब डाउनलोड करें (.zip)” दबाएँ, या सूची से एक-एक फोटो डाउनलोड करें।",
    ],
    faq: [
      {
        q: "“ठीक W × H” में फोटो का आकार मेल न खाए तो क्या होता है?",
        a: "आप चुनते हैं: “काटकर भरें (crop)” किनारे काटकर पूरा साइज़ भर देता है, और “सफ़ेद पट्टी जोड़ें” पूरी फोटो रखकर खाली जगह सफ़ेद भर देता है।",
      },
      {
        q: "कितनी फोटो डाल सकते हैं?",
        a: "एक बार में 100 तक। बहुत बड़ी फोटो में ज़्यादा समय और मेमोरी लगती है, इसलिए पुराने फ़ोन पर छोटे-छोटे बैच में करें। जो फ़ाइल सही फोटो नहीं है वह मैसेज के साथ छोड़ दी जाती है।",
      },
      {
        q: "PNG, JPG में क्यों सेव हुई?",
        a: "KB लिमिट के साथ PNG को JPG में सेव करते हैं ताकि साइज़ सच में कंट्रोल हो सके। GIF और BMP, PNG में सेव होती हैं, और पारदर्शी हिस्सा सफ़ेद हो जाता है।",
      },
      {
        q: "ZIP बनाने के लिए फोटो अपलोड होती हैं?",
        a: "नहीं। हर फोटो और ZIP फ़ाइल आपके ब्राउज़र में ही बनती है, इसलिए बड़ा बैच भी आपके डिवाइस से बाहर नहीं जाता।",
      },
    ],
  },
  "photo-resize": {
    intro:
      "ऑनलाइन फ़ॉर्म के लिए अपनी पासपोर्ट साइज़ फोटो तैयार करें। अपनी परीक्षा चुनें, उसके ऑफ़िशियल नोटिफ़िकेशन से साइज़, KB और फ़ॉर्मेट अपने आप भर जाते हैं; या खुद साइज़ डालें। चेहरे के हिसाब से क्रॉप करें, फोटो बनाएँ, और डाउनलोड से पहले चेकलिस्ट देखें।",
    steps: [
      "“फोटो चुनें” या “फोटो खींचें” दबाएँ।",
      "क्रॉप बॉक्स खींचकर चेहरा गाइड के अंदर रखें; ज़रूरत हो तो “क्रॉप साइज़” और “घुमाएँ” इस्तेमाल करें।",
      "नियम वाली लाइन (“… के लिए सेट”) देखें, या “साइज़ सेटिंग” खोलकर चौड़ाई, ऊँचाई और KB खुद भरें।",
      "“फोटो तैयार करें” दबाएँ और चेकलिस्ट पढ़ें।",
      "सब पर ✅ हो तो “डाउनलोड करें” दबाएँ।",
    ],
    faq: [
      {
        q: "परीक्षा का साइज़ और KB कहाँ से आता है?",
        a: "परीक्षा वाले पेज पर ये उस परीक्षा के डेटा से आते हैं, जो नोटिफ़िकेशन से लिया गया है, और “साइज़ बदलें” से आप इन्हें बदल सकते हैं। नोटिफ़िकेशन बदलते रहते हैं, इसलिए सबमिट से पहले नए नोटिफ़िकेशन से ज़रूर मिलाएँ।",
      },
      {
        q: "चेकलिस्ट में बैकग्राउंड बहुत गहरा बता रहा है, क्या करूँ?",
        a: "टूल फोटो के किनारे देखकर बताता है कि बैकग्राउंड गहरा या रंगीन तो नहीं; यह बैकग्राउंड बदलता नहीं है। दिन की रोशनी में सादी सफ़ेद या हल्की दीवार के सामने नई फोटो खींचें और दोबारा बनाएँ।",
      },
      {
        q: "फोटो के पिक्सल मेरी सोच से थोड़े कम क्यों हैं?",
        a: "पूरे साइज़ पर अधिकतम KB से नीचे न आए, तो पिक्सल भी घटाए जाते हैं और नीचे इसका नोट दिखता है। बहुत सादी फोटो न्यूनतम KB से कम बने, तो छिपी पैडिंग जोड़ी जाती है, क्वालिटी पर असर नहीं पड़ता।",
      },
      {
        q: "क्या फ़ोन पर ठीक चलता है? फोटो अपलोड तो नहीं होती?",
        a: "यह फ़ोन के लिए ही बना है, कैमरा बटन के साथ। फोटो का क्रॉप और KB कम करना ब्राउज़र में ही होता है, फोटो कहीं अपलोड नहीं होती।",
      },
    ],
  },
  "signature-resize": {
    intro:
      "सिग्नेचर की फ़ोन वाली फोटो को साफ़ अपलोड लायक बनाएँ: सफ़ेद कागज़, गहरी स्याही, पास से क्रॉप और सही KB। अपनी परीक्षा चुनें, उसके ऑफ़िशियल नोटिफ़िकेशन के नियम अपने आप भर जाते हैं, या अपना साइज़ डालें।",
    steps: [
      "सादे सफ़ेद कागज़ पर सिग्नेचर करें, फिर “फोटो खींचें” या “फोटो चुनें” दबाएँ।",
      "“सिग्नेचर पर अपने आप क्रॉप करें” दबाएँ, या बॉक्स खुद खींचें।",
      "“बैकग्राउंड साफ़ करें” चालू रखें, स्याही काला या नीला चुनें, और लाइनें पतली या मोटी लगें तो “गहराई” बदलें।",
      "“सिग्नेचर तैयार करें” दबाएँ और चेकलिस्ट देखें।",
      "“डाउनलोड करें” दबाएँ।",
    ],
    faq: [
      {
        q: "कागज़ भूरा-सा और छाया वाला दिख रहा है, चलेगा?",
        a: "“बैकग्राउंड साफ़ करें” हल्के भूरे कागज़ और छाया को सफ़ेद और स्याही को गहरा कर देता है। हल्की लाइनें गायब हों तो गहराई कम करें, गंदगी बचे तो बढ़ाएँ। दिन की अच्छी रोशनी में खींची फोटो सबसे साफ़ आती है।",
      },
      {
        q: "कौन-सा पेन इस्तेमाल करें?",
        a: "गहरा काला या नीला पेन जो मोटा और साफ़ चले। पेंसिल और हल्की जेल स्याही ठीक से साफ़ नहीं होती। स्याही का रंग वही रखें जो आपकी परीक्षा का नोटिफ़िकेशन बताए।",
      },
      {
        q: "KB लिमिट में नहीं आ पाया, ऐसा क्यों?",
        a: "यह तब होता है जब क्रॉप, मान्य KB के हिसाब से बहुत बड़ा हो। सिग्नेचर के पास से क्रॉप करें, या नियम इजाज़त दें तो “साइज़ बदलें” से पिक्सल कम करें, फिर दोबारा बनाएँ।",
      },
      {
        q: "क्या मेरा सिग्नेचर कहीं सेव होता है?",
        a: "नहीं। साफ़ करना और साइज़ बदलना आपके ब्राउज़र में होता है, सिग्नेचर सिर्फ़ उसी फ़ाइल में रहता है जो आप डाउनलोड करते हैं।",
      },
    ],
  },
  "thumb-resize": {
    intro:
      "परीक्षा फ़ॉर्म के लिए बाएँ अंगूठे का निशान तैयार करें: कागज़ सफ़ेद, स्याही गहरी, सही क्रॉप, और सही साइज़ व KB। अपनी परीक्षा चुनें, उसके ऑफ़िशियल नोटिफ़िकेशन के नियम अपने आप भर जाते हैं।",
    steps: [
      "अंगूठा स्टांप पैड पर दबाएँ, फिर सादे सफ़ेद कागज़ पर लगाएँ।",
      "“फोटो खींचें” या “फोटो चुनें” दबाएँ, फिर “सिग्नेचर पर अपने आप क्रॉप करें” दबाएँ या निशान के चारों ओर बॉक्स खींचें।",
      "“बैकग्राउंड साफ़ करें” चालू रखें, स्याही काला या नीला चुनें, और लाइनें साफ़ दिखने तक “गहराई” बदलें।",
      "“अंगूठे का निशान तैयार करें” दबाएँ, चेकलिस्ट देखें, फिर “डाउनलोड करें”।",
    ],
    faq: [
      {
        q: "साफ़ करने के बाद अंगूठे की लाइनें नहीं दिख रहीं, गड़बड़ क्या है?",
        a: "ज़्यादा स्याही से लाइनें भरकर धब्बा बन जाती हैं, कम स्याही से बीच-बीच में खाली रह जाता है। हल्की स्याही लेकर एक बार दबाएँ, घुमाएँ नहीं। नई फोटो लेने से पहले गहराई का स्लाइडर दोनों तरफ़ खिसकाकर देखें।",
      },
      {
        q: "बायाँ अंगूठा या दायाँ?",
        a: "वही अंगूठा लगाएँ जो आपकी परीक्षा का नोटिफ़िकेशन माँगे; ज़्यादातर बायाँ माँगते हैं। टूल यह नहीं जाँचता कि कौन-सा अंगूठा लगा है।",
      },
      {
        q: "क्या फ़ोन से फोटो ले सकते हैं?",
        a: "हाँ। अच्छी रोशनी में फ़ोन को कागज़ के ठीक ऊपर सीधा रखें, अपनी छाया न पड़ने दें, और निशान स्क्रीन का बड़ा हिस्सा भरे। सारा काम फ़ोन पर ही होता है।",
      },
      {
        q: "कौन-से फ़ॉर्मेट में फ़ाइल मिलेगी?",
        a: "आमतौर पर JPG, या जो परीक्षा माँगे। परीक्षा चुने बिना “साइज़ सेटिंग” में JPG या PNG चुन सकते हैं।",
      },
    ],
  },
  "declaration-resize": {
    intro:
      "कुछ परीक्षाएँ हाथ से लिखी घोषणा की फोटो माँगती हैं। पेज की फोटो लें, यह टूल कागज़ सफ़ेद और लिखावट गहरी करके क्रॉप करता है और सही साइज़ व KB में लाता है। अपनी परीक्षा चुनें, उसके ऑफ़िशियल नोटिफ़िकेशन के नियम अपने आप भर जाते हैं।",
    steps: [
      "नोटिफ़िकेशन में दिया घोषणा का टेक्स्ट सादे सफ़ेद कागज़ पर लिखें, और कहा गया हो तो सिग्नेचर करें।",
      "“फोटो खींचें” या “फोटो चुनें” दबाएँ।",
      "लिखावट के आसपास क्रॉप के लिए “सिग्नेचर पर अपने आप क्रॉप करें” दबाएँ, या बॉक्स खुद खींचें।",
      "“बैकग्राउंड साफ़ करें” चालू रखें और हर अक्षर साफ़ दिखने तक “गहराई” बदलें।",
      "“हस्तलिखित घोषणा तैयार करें” दबाएँ, चेकलिस्ट देखें, फिर “डाउनलोड करें”।",
    ],
    faq: [
      {
        q: "कौन-सा टेक्स्ट लिखना है?",
        a: "आपकी परीक्षा के नोटिफ़िकेशन में जो शब्द दिए हैं, वही उसी भाषा और तरीके से लिखें। यह टूल सिर्फ़ फोटो तैयार करता है, घोषणा का टेक्स्ट न देता है न जाँचता है।",
      },
      {
        q: "साफ़ करने के बाद अक्षर टूटे या बहुत मोटे दिख रहे हैं।",
        a: "गहराई का स्लाइडर खिसकाएँ: कम करने पर हल्की लाइनें बचती हैं, बढ़ाने पर कागज़ की छाया ज़्यादा हटती है। “ऑटो” से वापस डिफ़ॉल्ट पर आ जाते हैं। गहरे पेन से लिखना और दिन की रोशनी में फोटो लेना सबसे ज़्यादा मदद करता है।",
      },
      {
        q: "पेज की फोटो तिरछी है, ठीक हो सकती है?",
        a: "“घुमाएँ” सिर्फ़ 90° के हिसाब से घुमाता है। हल्की तिरछी फोटो के लिए फ़ोन को पेज के ठीक ऊपर सीधा रखकर दोबारा फोटो लें।",
      },
      {
        q: "क्या घोषणा कहीं अपलोड होती है?",
        a: "इस टूल से नहीं। यह आपके ब्राउज़र में बनती है; डाउनलोड हुई फ़ाइल आप खुद परीक्षा की साइट पर अपलोड करते हैं।",
      },
    ],
  },
  "age-calculator": {
    intro:
      "किसी भी तारीख पर, या परीक्षा की कट-ऑफ तारीख पर, अपनी सही उम्र साल, महीने और दिन में निकालें। अपनी परीक्षा चुनें, उसके ऑफ़िशियल नोटिफ़िकेशन से आयु सीमा और कट-ऑफ तारीख वर्ग की छूट के साथ अपने आप भर जाती है, और पात्रता तुरंत दिखती है।",
    steps: [
      "अपनी परीक्षा चुनें, या “कोई परीक्षा नहीं (सिर्फ़ उम्र निकालें)” रहने दें।",
      "“जन्म तिथि” वही डालें जो 10वीं के सर्टिफ़िकेट में है।",
      "परीक्षा चुनी है तो अपना वर्ग चुनें, और लागू हो तो “दिव्यांग (PwD)” या “भूतपूर्व सैनिक” पर टिक करें।",
      "परीक्षा नहीं चुनी है तो “इस तारीख पर उम्र” डालें, चाहें तो न्यूनतम और अधिकतम आयु भी।",
      "नीचे अपनी उम्र और पात्र / पात्र नहीं का नतीजा देखें।",
    ],
    faq: [
      {
        q: "उम्र कैसे गिनी जाती है?",
        a: "जन्म तिथि से कट-ऑफ तारीख तक पूरे हुए साल, महीने और दिन गिने जाते हैं। नतीजे में मान्य जन्म तिथि की रेंज भी दिखती है, जिसे नोटिफ़िकेशन से मिलाना आसान है।",
      },
      {
        q: "भूतपूर्व सैनिक वाला नतीजा अनुमानित क्यों लिखा है?",
        a: "भूतपूर्व सैनिक की छूट आमतौर पर सैन्य सेवा के साल घटाकर निकाली जाती है, जो हर व्यक्ति की अलग होती है। नतीजे को अंदाज़ा मानें और नोटिफ़िकेशन का नियम ज़रूर देखें।",
      },
      {
        q: "जो भर्ती सूची में नहीं है, उसके लिए भी चलेगा?",
        a: "हाँ। “कोई परीक्षा नहीं” चुनें, उस नोटिफ़िकेशन की कट-ऑफ तारीख “इस तारीख पर उम्र” में डालें, और न्यूनतम व अधिकतम आयु लिखें। इस तरीके में छूट नहीं जोड़ी जाती, क्योंकि हर भर्ती में अलग होती है।",
      },
      {
        q: "क्या मेरी जन्म तिथि सेव होती है?",
        a: "नहीं। हिसाब इसी पेज पर होता है; आपकी जन्म तिथि न कहीं भेजी जाती है, न रखी जाती है।",
      },
    ],
  },
  "pdf-compress": {
    intro:
      "अपलोड लिमिट में लाने के लिए PDF को 100, 200, 300 या 500 KB, या अपने लिखे किसी भी साइज़ में छोटा करें। मार्कशीट, सर्टिफ़िकेट और स्कैन डॉक्यूमेंट के लिए ठीक है। PDF आपके ब्राउज़र में पेज-दर-पेज कंप्रेस होती है।",
    steps: [
      "“PDF चुनें” दबाकर फ़ाइल लें।",
      "“लक्ष्य साइज़” में कोई साइज़ दबाएँ, या “अपना KB” में खुद लिखें।",
      "“PDF कंप्रेस करें” दबाएँ और हर पेज पूरा होने तक रुकें।",
      "अक्षर अब भी पढ़ने में आ रहे हैं यह देखें, फिर “PDF डाउनलोड करें” दबाएँ।",
    ],
    faq: [
      {
        q: "कंप्रेस हुई PDF में टेक्स्ट सेलेक्ट क्यों नहीं होता?",
        a: "साइज़ तक पहुँचने के लिए हर पेज इमेज में बदलकर कम क्वालिटी में सेव होता है। पेज वैसे ही दिखते हैं पर टेक्स्ट फोटो का हिस्सा बन जाता है। अपलोड के लिए यह ठीक है, पर एडिट करने के लिए असली फ़ाइल संभालकर रखें।",
      },
      {
        q: "टारगेट से कम नहीं हो पाई, अब क्या करें?",
        a: "कुछ लंबी या बहुत डिटेल वाली PDF सबसे कम क्वालिटी पर भी बहुत छोटी लिमिट में नहीं आतीं। बड़ा टारगेट आज़माएँ, फालतू पेज हटाएँ, या कम रेज़ोल्यूशन पर स्कैन करें। PDF पहले से छोटी हो तो उसे बिना बदले वैसे ही रखा जाता है।",
      },
      {
        q: "मेरी PDF टूल में खुल ही नहीं रही।",
        a: "फ़ाइल खराब हो सकती है या उस पर पासवर्ड लगा हो सकता है। बिना पासवर्ड वाली कॉपी डाउनलोड करें, या उसे नई PDF में प्रिंट करके फिर कोशिश करें।",
      },
      {
        q: "सर्टिफ़िकेट और आईडी के लिए सुरक्षित है?",
        a: "हाँ। PDF आपके ब्राउज़र में ही पढ़ी और दोबारा बनाई जाती है; कभी अपलोड नहीं होती, आपके डॉक्यूमेंट आपके डिवाइस पर ही रहते हैं।",
      },
    ],
  },
  "image-to-pdf": {
    intro:
      "मार्कशीट, सर्टिफ़िकेट या नोट्स की फ़ोन वाली फोटो से अपलोड या ईमेल के लिए एक PDF बनाएँ। फोटो जोड़ें, क्रम सेट करें, A4 या फोटो जितना पेज चुनें, और डाउनलोड करें। फ़ोन की टेढ़ी फोटो अपने आप सीधी हो जाती है।",
    steps: [
      "“फोटो चुनें” दबाकर एक या ज़्यादा फोटो लें; और पेज के लिए “और जोड़ें”।",
      "↑ और ↓ से पेज का क्रम सेट करें, और ✕ से पेज हटाएँ।",
      "“पेज साइज़” में “A4” या “फोटो जितना” चुनें।",
      "“PDF बनाएँ” दबाएँ, फिर “PDF डाउनलोड करें”।",
    ],
    faq: [
      {
        q: "A4 चुनें या फोटो जितना?",
        a: "A4 हर फोटो को किनारों के साथ सामान्य पेज पर रखता है, जो प्रिंट में साफ़ आता है। “फोटो जितना” हर पेज को ठीक फोटो के साइज़ का बनाता है, बिना सफ़ेद किनारों के।",
      },
      {
        q: "PDF अपलोड लिमिट से बड़ी बन गई।",
        a: "फोटो पहले से ठीक-ठाक साइज़ में सेव होती हैं, पर ज़्यादा पेज होने पर साइज़ बढ़ जाता है। डाउनलोड हुई PDF को हमारे “PDF को KB में कंप्रेस करें” टूल में खोलें और KB टारगेट चुनें।",
      },
      {
        q: "क्या पेज टेढ़े आएँगे?",
        a: "हर फोटो फ़ोन की घुमाव वाली जानकारी के हिसाब से दोबारा बनती है, इसलिए पेज आमतौर पर सीधे आते हैं। फिर भी कोई टेढ़ा हो तो पहले “इमेज घुमाएँ और पलटें” टूल से ठीक करें।",
      },
      {
        q: "क्या मेरे डॉक्यूमेंट अपलोड होते हैं?",
        a: "नहीं। PDF आपके फ़ोन या कंप्यूटर पर ही बनती है, सर्वर पर कुछ नहीं जाता।",
      },
    ],
  },
  "pdf-merge": {
    intro:
      "मार्कशीट, सर्टिफ़िकेट और आईडी जैसी कई PDF को अपने चुने क्रम में एक फ़ाइल में जोड़ें। पेज जैसे हैं वैसे ही कॉपी होते हैं, इसलिए क्वालिटी नहीं बदलती। जब फ़ॉर्म सिर्फ़ एक PDF लेता हो तब काम का है।",
    steps: [
      "“PDF चुनें” दबाकर दो या ज़्यादा फ़ाइलें लें; बाकी के लिए “और जोड़ें”।",
      "↑ और ↓ से क्रम सेट करें, और ✕ से फ़ाइल हटाएँ।",
      "“PDF जोड़ें” दबाएँ।",
      "“PDF डाउनलोड करें” दबाएँ।",
    ],
    faq: [
      {
        q: "क्या जोड़ने से क्वालिटी कम होती है?",
        a: "नहीं। पेज दोबारा कंप्रेस किए बिना कॉपी होते हैं, इसलिए टेक्स्ट सेलेक्ट होता रहता है और फोटो साफ़ रहती हैं। नई फ़ाइल लगभग सब फ़ाइलों के कुल साइज़ जितनी होती है।",
      },
      {
        q: "जोड़ी हुई PDF फ़ॉर्म के लिए बहुत बड़ी है।",
        a: "उसे “PDF को KB में कंप्रेस करें” टूल में अपनी KB लिमिट के साथ चलाएँ।",
      },
      {
        q: "कोई PDF नहीं खुली, ऐसा लिखा आया।",
        a: "वह फ़ाइल खराब हो सकती है या उस पर पासवर्ड है। उसकी बिना पासवर्ड वाली कॉपी लेकर दोबारा जोड़ें।",
      },
      {
        q: "क्या कुछ इंस्टॉल करना पड़ेगा?",
        a: "नहीं। यह फ़ोन या कंप्यूटर के ब्राउज़र में चलता है, और फ़ाइलें आपके डिवाइस से बाहर नहीं जातीं।",
      },
    ],
  },
  "passport-photo-sheet": {
    intro:
      "एक फोटो से कई पासपोर्ट फोटो प्रिंट करें: 8, 16 या 32 फोटो वाली A4 शीट, काटने की लाइनों के साथ, किसी भी फोटो की दुकान या घर के प्रिंटर के लिए तैयार। पासपोर्ट (3.5 × 4.5 cm) या स्टाम्प (2.5 × 3 cm) साइज़ चुनें।",
    steps: [
      "“फोटो चुनें” दबाकर सामने से खींची फोटो लें।",
      "क्रॉप बॉक्स खींचकर चेहरा गाइड के अंदर रखें।",
      "“फोटो की संख्या” और “फोटो साइज़” चुनें।",
      "“प्रिंट शीट बनाएँ” दबाएँ।",
      "PDF या JPG डाउनलोड करके प्रिंट करें।",
    ],
    faq: [
      {
        q: "प्रिंट में फोटो गलत साइज़ की क्यों आती हैं?",
        a: "प्रिंटर शायद पेज को छोटा-बड़ा कर रहा है। प्रिंट सेटिंग में 100% स्केल या “Actual size” चुनें, “Fit to page” नहीं। शीट A4 कागज़ के लिए 300 DPI पर बनती है।",
      },
      {
        q: "32 चुनते ही साइज़ स्टाम्प क्यों हो गया?",
        a: "32 पासपोर्ट साइज़ फोटो एक A4 पेज पर नहीं आतीं, इसलिए स्टाम्प साइज़ चुन लिया जाता है। पासपोर्ट साइज़ के लिए 8 या 16 चुनें।",
      },
      {
        q: "दुकान पर PDF ले जाएँ या JPG?",
        a: "दोनों चलेंगे। PDF में पेज का साइज़ पक्का रहता है, प्रिंट के लिए यही सबसे सुरक्षित है; JPG WhatsApp पर भेजना आसान है। दुकान वाले से असली साइज़ पर प्रिंट करने को कहें।",
      },
      {
        q: "क्या फोटो मेरे फ़ोन से बाहर जाती है?",
        a: "नहीं। शीट आपके ब्राउज़र में बनती है। डाउनलोड हुई फ़ाइल कहाँ भेजनी है, यह सिर्फ़ आप तय करते हैं।",
      },
    ],
  },
  "image-convert": {
    intro:
      "जब फ़ॉर्म या ऐप सिर्फ़ एक तरह की फ़ाइल ले, तो एक या कई फोटो को JPG और PNG में आपस में बदलें। WebP, GIF और BMP फ़ाइलें भी खुलती हैं। हर बदली हुई फोटो का अपना डाउनलोड बटन होता है।",
    steps: [
      "“इमेज चुनें” दबाकर एक या ज़्यादा फ़ाइलें लें।",
      "“किसमें बदलें” के आगे PNG या JPG दबाएँ।",
      "“बदलें” दबाएँ।",
      "हर फ़ाइल के आगे “डाउनलोड करें” दबाएँ।",
    ],
    faq: [
      {
        q: "पारदर्शी बैकग्राउंड का क्या होता है?",
        a: "PNG में पारदर्शिता बनी रहती है। JPG इसे रख नहीं सकता, इसलिए पारदर्शी हिस्सा सफ़ेद हो जाता है।",
      },
      {
        q: "PNG मेरी JPG से बहुत बड़ी क्यों है?",
        a: "PNG हर पिक्सल को बिल्कुल वैसा ही सेव करता है, जो ग्राफ़िक के लिए ठीक है पर फोटो की फ़ाइल बड़ी कर देता है। फ़ॉर्म के लिए छोटी फ़ाइल चाहिए तो JPG में बदलें।",
      },
      {
        q: "एक फ़ाइल पर ⚠️ है और डाउनलोड नहीं है।",
        a: "आपका ब्राउज़र वह फ़ाइल नहीं पढ़ पाया, जैसे बिना HEIC सपोर्ट वाले ब्राउज़र में iPhone की HEIC फोटो। फ़ोन से पहले उसे JPG में शेयर करें, फिर बदलें।",
      },
      {
        q: "फ़ाइलें कहाँ बदलती हैं?",
        a: "आपके ब्राउज़र में। फोटो अपलोड नहीं होतीं, और पेज एक बार खुलने के बाद टूल बिना इंटरनेट भी चलता है।",
      },
    ],
  },
  "typing-test": {
    intro:
      "स्किल टेस्ट के लिए English, मंगल Inscript, मंगल Remington (GAIL) या कृतिदेव में टाइपिंग का अभ्यास करें। समय और पैराग्राफ़ चुनें, टाइप करें, और नेट व ग्रॉस स्पीड, शुद्धता, KDPH और गलतियों की सूची पाएँ। अपनी परीक्षा चुनें, उसकी भाषा, लेआउट और समय अपने आप सेट हो जाते हैं।",
    steps: [
      "परीक्षा चुनें (ज़रूरी नहीं) या “खुला अभ्यास” रहने दें।",
      "भाषा, “कीबोर्ड लेआउट”, समय और पैराग्राफ़ (या “अपना पैराग्राफ़”) चुनें।",
      "“बैकस्पेस चालू” जैसे विकल्प सेट करें, फिर टाइप करना शुरू करें; पहला बटन दबाते ही टाइमर चलता है।",
      "पूरा होने पर “सबमिट करें” दबाएँ, या समय खत्म होने दें।",
      "रिज़ल्ट और गलतियाँ देखें, फिर “फिर से शुरू करें” या “अगला पैराग्राफ़” दबाएँ।",
    ],
    faq: [
      {
        q: "क्या कृतिदेव या मंगल फ़ॉन्ट इंस्टॉल करना होगा?",
        a: "नहीं। कृतिदेव और Remington में आप वही बटन दबाते हैं जो परीक्षा में दबाएँगे, टूल उन्हें स्क्रीन पर हिंदी में बदल देता है। कोई अक्षर भूल जाएँ तो “की-चार्ट दिखाएँ” दबाएँ।",
      },
      {
        q: "नेट स्पीड और गलतियाँ कैसे गिनी जाती हैं?",
        a: "ग्रॉस स्पीड = कीस्ट्रोक ÷ 5, प्रति मिनट। गलत, छूटा या फालतू शब्द पूरी गलती है; विराम चिह्न, कैपिटल या स्पेस का फ़र्क आधी गलती। हर फ़ॉर्मूला रिज़ल्ट के नीचे “यह कैसे निकाला गया” में है। हर परीक्षा अलग तरह से जाँचती है, इसे अभ्यास ही मानें।",
      },
      {
        q: "क्या फ़ोन पर अभ्यास कर सकते हैं?",
        a: "हाँ, पर स्किल टेस्ट कंप्यूटर कीबोर्ड पर होता है, इसलिए जब हो सके वहीं अभ्यास करें। फ़ोन पर English और Inscript फ़ोन के कीबोर्ड से चल जाते हैं।",
      },
      {
        q: "क्या मेरे रिज़ल्ट सेव होते हैं?",
        a: "आपके पिछले टेस्ट और सबसे अच्छी नेट स्पीड सिर्फ़ इसी डिवाइस के ब्राउज़र में रहते हैं। हमारे पास कुछ नहीं आता।",
      },
    ],
  },
  "answer-key": {
    intro:
      "आंसर की आते ही अपना अनुमानित स्कोर देखें। रिस्पॉन्स शीट वाला पेज सेव करें, यहाँ खोलें, परीक्षा चुनें या नंबर डालें, और नेगेटिव मार्किंग के साथ सेक्शन के हिसाब से सही, गलत और छोड़े गए प्रश्न पाएँ।",
    steps: [
      "ऑफ़िशियल वेबसाइट पर अपनी रिस्पॉन्स शीट खोलें और पेज सेव करें (.html या .mhtml)।",
      "“सेव किया पेज अपलोड करें (.html / .mhtml)” दबाएँ, या पेज सोर्स / उत्तर की लाइनें पेस्ट करें।",
      "मार्किंग स्कीम के लिए अपनी परीक्षा चुनें, या “अपनी मार्किंग डालें” चुनकर + और − नंबर डालें।",
      "“स्कोर निकालें” दबाएँ।",
      "गलत उत्तरों की सूची देखें और शेयर करने के लिए “सारांश कॉपी करें” दबाएँ।",
    ],
    faq: [
      {
        q: "फ़ोन पर रिस्पॉन्स शीट कैसे सेव करें?",
        a: "Chrome में रिस्पॉन्स शीट खोलें, ⋮ मेन्यू दबाएँ और Download चुनें (या Share → Save page)। .mhtml फ़ाइल चलेगी। सिर्फ़ दिख रहा टेक्स्ट कॉपी करने से काम नहीं बनता, क्योंकि सही उत्तर सिर्फ़ हरे टिक होते हैं।",
      },
      {
        q: "मेरा ऑफ़िशियल स्कोर अलग क्यों आया?",
        a: "यह सिर्फ़ अनुमान है। नॉर्मलाइज़ेशन, बोनस नंबर, और फ़ाइनल की में हटाए या बदले गए प्रश्नों से ऑफ़िशियल रिज़ल्ट बदल सकता है।",
      },
      {
        q: "मेरी परीक्षा का पेज नहीं पढ़ा जा रहा, क्या करूँ?",
        a: "हर प्रश्न की एक लाइन लिखें: प्रश्न नंबर, आपका विकल्प, सही विकल्प (जैसे 12 B C)। छोड़ा हो तो - लिखें, और नया सेक्शन “# Reasoning” जैसी लाइन से शुरू करें।",
      },
      {
        q: "क्या मेरा रोल नंबर या रिस्पॉन्स शीट अपलोड होती है?",
        a: "नहीं। सेव किया पेज आपके फ़ोन या कंप्यूटर पर ही पढ़ा जाता है, उसकी कोई जानकारी कहीं नहीं भेजी जाती।",
      },
    ],
  },
  "my-forms": {
    intro:
      "जितने सरकारी फ़ॉर्म भरे हैं, सब एक सूची में रखें: स्थिति, आवेदन नंबर, फीस, अंतिम तिथि, एडमिट कार्ड, परीक्षा और रिज़ल्ट की तारीख, और नोट्स। हर फ़ॉर्म की अगली तारीख और उसमें कितने दिन बाकी हैं, सामने दिखता है।",
    steps: [
      "“फॉर्म जोड़ें” दबाएँ।",
      "“सूची से चुनें” में परीक्षा चुनें या उसका नाम लिखें।",
      "स्थिति, आवेदन नंबर, फीस और जो तारीखें पता हैं, भरें।",
      "“सेव करें” दबाएँ; कुछ बदले तो “बदलें” से अपडेट करें।",
      "बीच-बीच में “बैकअप डाउनलोड करें” दबाकर कॉपी रख लें।",
    ],
    faq: [
      {
        q: "मेरी सूची कहाँ सेव होती है?",
        a: "सिर्फ़ इसी फ़ोन के इसी ब्राउज़र में। कोई अकाउंट नहीं, सर्वर पर कुछ नहीं जाता; इसका मतलब यह भी है कि ब्राउज़र का डेटा साफ़ करने पर सूची मिट जाएगी।",
      },
      {
        q: "नए फ़ोन में सूची कैसे ले जाएँ?",
        a: "“बैकअप डाउनलोड करें” से फ़ाइल डाउनलोड करें, उसे नए फ़ोन में भेजें, और वहाँ “बैकअप वापस लाएँ” दबाएँ।",
      },
      {
        q: "क्या परीक्षा की तारीखें अपने आप भरती हैं?",
        a: "नहीं। सूची से चुनने पर सिर्फ़ परीक्षा का नाम भरता है। तारीखें ऑफ़िशियल नोटिफ़िकेशन या एडमिट कार्ड से खुद डालें, ताकि वही रहें जो आप पर लागू हैं।",
      },
      {
        q: "“सेव नहीं हो पाया” लिखा आ रहा है।",
        a: "ब्राउज़र की स्टोरेज भरी हो सकती है, या आप प्राइवेट/इनकॉग्निटो मोड में हैं जहाँ स्टोरेज बंद या मिट जाती है। साइट को सामान्य टैब में खोलें।",
      },
    ],
  },
  countdown: {
    intro:
      "देखें परीक्षा में कितने दिन बचे हैं, साथ में My Forms की बाकी आने वाली तारीखें भी, और सिलेबस के टॉपिक पूरे होते ही टिक करें। कुछ सेकंड में परीक्षा की तारीख जोड़ें और रोज़ अपनी तैयारी ट्रैक करें।",
    steps: [
      "“परीक्षा की तारीख जोड़ें” में परीक्षा का नाम लिखें और तारीख चुनें।",
      "“काउंटडाउन जोड़ें” दबाएँ।",
      "“सिलेबस चेकलिस्ट” में ऑफ़िशियल सिलेबस के टॉपिक, हर लाइन में एक, पेस्ट करें और “टॉपिक जोड़ें” दबाएँ।",
      "जो टॉपिक पूरा हो उस पर टिक करें; पूरे टॉपिक की गिनती अपने आप बदलती है।",
    ],
    faq: [
      {
        q: "क्या FormSaathi सिलेबस देता है?",
        a: "नहीं। अपनी परीक्षा के ऑफ़िशियल सिलेबस से टॉपिक कॉपी करें। इससे सूची हमेशा वही रहती है जो आपकी परीक्षा में सच में आता है।",
      },
      {
        q: "क्या यह My Forms से जुड़ा है?",
        a: "हाँ। यहाँ जोड़ी तारीखें My Forms में दिखती हैं, और काउंटडाउन वहाँ के हर फ़ॉर्म की आने वाली तारीखें दिखाता है। फीस, आवेदन नंबर और दूसरी तारीखें जोड़ने के लिए “My Forms खोलें” दबाएँ।",
      },
      {
        q: "क्या रिमाइंडर आएगा?",
        a: "कोई नोटिफ़िकेशन नहीं भेजा जाता। बचे दिन देखने के लिए पेज खोलें; पहली बार के बाद यह बिना इंटरनेट भी खुलता है, इसलिए इसे होम स्क्रीन पर जोड़ सकते हैं।",
      },
      {
        q: "मेरी चेकलिस्ट कौन देख सकता है?",
        a: "कोई और नहीं। यह बिना लॉगिन के सिर्फ़ आपके डिवाइस के ब्राउज़र में सेव रहती है।",
      },
    ],
  },
  "resume-maker": {
    intro:
      "हिंदी या अंग्रेज़ी में एक साफ़-सुथरा रिज़्यूमे बनाएँ और PDF में डाउनलोड करें। संपर्क, पढ़ाई, अनुभव, कौशल और व्यक्तिगत जानकारी भरें, सादा या मॉडर्न डिज़ाइन चुनें, चाहें तो फोटो लगाएँ, और साथ-साथ प्रीव्यू देखें।",
    steps: [
      "“डॉक्यूमेंट की भाषा” और डिज़ाइन (सादा या मॉडर्न) चुनें।",
      "नाम और संपर्क, उद्देश्य, पढ़ाई और अनुभव भरें; चाहें तो फोटो जोड़ें।",
      "कौशल, भाषाएँ, व्यक्तिगत जानकारी, स्थान और दिनांक भरें।",
      "प्रीव्यू देखें, फिर “PDF डाउनलोड करें” या “प्रिंट करें” दबाएँ।",
    ],
    faq: [
      {
        q: "मैं फ्रेशर हूँ, अनुभव में क्या लिखूँ?",
        a: "अनुभव वाला हिस्सा खाली छोड़ दें, वह प्रिंट नहीं होगा। इंटर्नशिप, टाइपिंग स्पीड या कंप्यूटर कोर्स को कौशल में लिखें।",
      },
      {
        q: "क्या फोटो ज़रूरी है?",
        a: "नहीं, यह आपकी मर्ज़ी है। कई प्राइवेट नौकरियों में बिना फोटो वाला रिज़्यूमे पसंद किया जाता है, कुछ सरकारी या लोकल नौकरियों में फोटो की उम्मीद रहती है। लगाएँ तो साफ़ पासपोर्ट जैसी फोटो लगाएँ।",
      },
      {
        q: "पेज बंद करने पर भरी जानकारी मिट जाएगी?",
        a: "नहीं, जो लिखते हैं वह इसी फ़ोन के ब्राउज़र में अपने आप सेव होता है, बाद में लौटकर पूरा कर सकते हैं। “फ़ॉर्म खाली करें” से सब मिटता है। कुछ भी अपलोड नहीं होता।",
      },
      {
        q: "क्या हिंदी में बना सकते हैं?",
        a: "हाँ। डॉक्यूमेंट की भाषा में हिंदी चुनें; हेडिंग हिंदी में हो जाती हैं और आप अपनी जानकारी देवनागरी में लिख सकते हैं।",
      },
    ],
  },
  "biodata-maker": {
    intro:
      "फोटो के साथ सुंदर शादी का बायोडाटा हिंदी या अंग्रेज़ी में बनाएँ और WhatsApp पर भेजने या प्रिंट के लिए PDF डाउनलोड करें। व्यक्तिगत, परिवार और संपर्क की जानकारी भरें; खाली छोड़ी जानकारी अपने आप हट जाती है।",
    steps: [
      "“डॉक्यूमेंट की भाषा” चुनें; ऊपर कोई लाइन चाहिए तो “सबसे ऊपर एक लाइन छापें (जैसे ॥ श्री गणेशाय नमः ॥)” पर टिक करें।",
      "फोटो जोड़ें, फिर जन्म तिथि, समय, स्थान, कद, शिक्षा और व्यवसाय जैसी जानकारी भरें।",
      "परिवार की जानकारी भरें और “भाई/बहन जोड़ें” से भाई-बहन जोड़ें।",
      "संपर्क भरें, प्रीव्यू देखें, और “PDF डाउनलोड करें” दबाएँ।",
    ],
    faq: [
      {
        q: "क्या हर जानकारी भरना ज़रूरी है?",
        a: "नहीं। खाली छोड़ी जानकारी प्रिंट नहीं होती, इसलिए जो बताना नहीं चाहते, जैसे आय या जाति, उसे खाली छोड़ दें।",
      },
      {
        q: "सबसे ऊपर वाली लाइन बदल सकते हैं?",
        a: "हाँ। विकल्प टिक करके अपनी लाइन लिखें, जैसे कुलदेवता का नाम, या टिक हटाकर ऊपर का हिस्सा खाली रखें।",
      },
      {
        q: "WhatsApp पर कैसे भेजें?",
        a: "“PDF डाउनलोड करें” दबाएँ, फिर फ़ोन के Downloads या Files ऐप से वह फ़ाइल शेयर करें। PDF में लेआउट हर फ़ोन पर एक जैसा दिखता है।",
      },
      {
        q: "मेरे परिवार की जानकारी कौन देख सकता है?",
        a: "सिर्फ़ आप। जानकारी आपके फ़ोन के ब्राउज़र में रहती है ताकि बाद में बदल सकें, और कभी अपलोड नहीं होती।",
      },
    ],
  },
  "letter-maker": {
    intro:
      "हिंदी या अंग्रेज़ी में प्रार्थना पत्र, माता-पिता या नौकरी वाली संस्था का NOC, या स्व-घोषणा पत्र बनाएँ। थोड़ी जानकारी भरें, तैयार मैटर अपने हिसाब से बदलें, और प्रिंट करके सिग्नेचर के लिए PDF डाउनलोड करें। ये सामान्य फ़ॉर्मेट हैं, ऑफ़िशियल नहीं।",
    steps: [
      "“कौन-सा पत्र बनाना है” में पत्र का प्रकार और डॉक्यूमेंट की भाषा चुनें।",
      "जानकारी भरें: नाम, पता, उद्देश्य, और “सेवा में” का पता, स्थान और दिनांक।",
      "ज़रूरत हो तो “पत्र का मैटर (अपने हिसाब से बदलें)” में शीर्षक, विषय या मुख्य मैटर बदलें।",
      "प्रीव्यू देखें, फिर “PDF डाउनलोड करें” या “प्रिंट करें” दबाएँ, और प्रिंट पर सिग्नेचर करें।",
    ],
    faq: [
      {
        q: "क्या यह सरकारी ऑफ़िशियल फ़ॉर्मेट है?",
        a: "नहीं, ये सामान्य फ़ॉर्मेट हैं। अगर आपकी परीक्षा, दफ़्तर या विभाग ने अपना फ़ॉर्मेट दिया है, तो वही इस्तेमाल करें; उसके शब्द यहाँ पत्र के मैटर में टाइप कर सकते हैं।",
      },
      {
        q: "मैटर बदलने के बाद ऊपर की जानकारी बदलने से पत्र क्यों नहीं बदल रहा?",
        a: "एक बार खुद मैटर बदलने पर वह अपने आप नहीं बदलता, ताकि आपके बदलाव बचे रहें। “जानकारी से मैटर दोबारा बनाएँ” दबाएँ, पर इससे आपके बदलाव मिट जाएँगे।",
      },
      {
        q: "सिग्नेचर कैसे करें?",
        a: "PDF प्रिंट करें और अपने नाम के ऊपर हाथ से सिग्नेचर करें। फ़ाइल चाहिए तो सिग्नेचर वाले पेज की फोटो खींचकर हमारे “फोटो से PDF बनाएँ” टूल से PDF बना लें।",
      },
      {
        q: "क्या पत्र कहीं ऑनलाइन सेव होता है?",
        a: "नहीं। आपकी जानकारी आपके फ़ोन के ब्राउज़र में रहती है, और PDF भी डिवाइस पर ही बनती है।",
      },
    ],
  },
};
