import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type Lang = "en" | "sv" | "ar";

export const languageOptions: { code: Lang; label: string; flag: string; dir: "ltr" | "rtl" }[] = [
  { code: "sv", label: "Swedish", flag: "🇸🇪", dir: "ltr" },
  { code: "en", label: "English", flag: "🇬🇧", dir: "ltr" },
  { code: "ar", label: "Arabic", flag: "🇸🇦", dir: "rtl" },
];

const sv = {
  nav: { home: "Hem", courses: "Kurser", packages: "Paket", simulator: "Simulator", gallery: "Galleri", about: "Om", contact: "Kontakt", book: "Boka testlektion", studentLogin: "Student login", pupil: "Elev", pupilText: "Logga in på elevportalen", ecommerce: "E-handel", ecommerceText: "Boka via trafikskolaonline" },
  hero: { badge: "Trafikskola i Stockholm", titleA: "Kör mot ditt körkort med", titleB: "Kör Nu.", text: "Körkortsutbildning på svenska, engelska och arabiska. Digitala teorimaterial, körövningar och enkel onlinebokning.", book: "Boka testlektion", packages: "Se paket & priser", stats: [["3", "Språk"], ["100+", "Körövningar"], ["98%", "Godkänd"]] },
  benefits: [
    ["Flexibla tider", "Körlektioner kvällar, helger och vardagar - när det passar dig.", "calendar"],
    ["Moderna bilar", "Säkra fordon med dubbelkommandon och automatisk växellåda.", "car"],
    ["Certifierade lärare", "Tålmodiga, erfarna instruktörer som undervisar på flera språk.", "person"],
    ["Nära Trafikverket", "Smidig planering inför teori, riskutbildning och körprov.", "pin"],
  ],
  journey: {
    tag: "Din väg till körkortet",
    title: "Från första testet till trygg förare.",
    text: "En tydlig plan där varje steg låses upp i takt med din körning, från körkortstillstånd till uppkörning.",
    steps: [
      ["Körkortstillstånd", "Ansök hos Transportstyrelsen och starta din plan."],
      ["Risk 1", "Teoretisk kurs om alkohol, droger och trötthet."],
      ["Risk 2", "Halkkörning och kontrollövningar."],
      ["Teoriprov", "Öva smart och gör provet hos Trafikverket."],
      ["Uppkörning", "Uppvärmning och sista förberedelser."],
      ["Körkort!", "Grattis - du är nu en licensierad förare."],
    ],
  },
  packages: {
    tag: "Paket & priser", title: "Välj det paket som passar dig.", text: "Alla lektioner är 80 minuter och inkluderar professionell handledning, moderna bilar och tydlig planering.", popular: "Populärt", price: "Pris inkl. moms", buy: "Boka", readMore: "Läs mer", moreBenefits: "fler fördelar", help: "Behöver du rådgivning?", call: "Ring oss på",
    descriptions: ["En trygg start för dig som vill bygga grunderna med tydlig planering.", "För dig som vill kombinera körlektioner med Riskettan och teoriträning.", "Snabb och fokuserad förberedelse inför teori, riskutbildning och prov.", "Ett balanserat upplägg med mer körning och komplett stöd.", "För dig som vill ha extra körvana, teori och riskmoment samlat.", "Vår mest heltäckande plan med prioriterade tider och provförberedelse."],
    durations: ["Flexibel utbildningstid", "Flexibel utbildningstid", "10 intensiva dagar", "Flexibel utbildningstid", "Flexibel utbildningstid", "Komplett plan"],
    items: [
      ["Grundpaketet", "5 körlektioner (80 min)", ["5 körlektioner (80 min)", "Digitalt teoripaket", "Personlig studieplan"]],
      ["Mellanpaketet", "10 körlektioner (80 min) + Risk 1", ["10 körlektioner (80 min)", "Riskettan", "Obegränsade teoriprov", "Låna bil till prov"]],
      ["Intensivpaket", "15 körlektioner (80 min) + Risk 1 & 2", ["15 körlektioner (80 min)", "Risk 1 & Risk 2", "Komplett teoripaket", "Provförberedelse"]],
      ["Mellanpaket", "10 körlektioner (80 min) + Risk 1-2 + Teori", ["10 körlektioner (80 min)", "Risk 1 & Risk 2", "Teoriutbildning & inskrivning", "Körhäfte ingår"]],
      ["Stort Paket", "15 körlektioner (80 min) + Risk 1-2 + Teori", ["15 körlektioner (80 min)", "Risk 1 & Risk 2", "Teoriutbildning & inskrivning", "Körhäfte ingår"]],
      ["Komplettpaket", "25 körlektioner (80 min) + Risk 1-2 + Teori", ["25 körlektioner (80 min)", "Risk 1 & Risk 2", "Handledarutbildning", "Prioriterade tider", "Låna bil till uppkörning"]],
    ],
  },
  quiz: { tag: "Testa dina körkortskunskaper", title: "Testa din körkortsteori", text: "Svara på några exempel frågor innan ditt riktiga prov.", all: "Alla", question: "Fråga", result: "Se resultat", next: "Nästa fråga", retry: "Försök igen", good: "Bra jobbat!", practice: "Öva lite mer!", got: "Du fick", of: "av", correct: "rätt",
    questions: [
      { id: 1, category: "Vägmärken", question: "Vad innebär ett rött runt märke med en vit horisontell balk?", options: ["Stopp", "Förbud mot all trafik", "Förbud att stanna", "Motorväg slutar"], correct: 0, explanation: "Det röda runda märket med vit balk betyder stopp. Du måste stanna helt." },
      { id: 2, category: "Vägmärken", question: "Vilket märke anger att du har väjningsplikt?", options: ["Röd cirkel", "Gul romb", "Vit triangel med röd kant", "Blå fyrkant"], correct: 2, explanation: "Den vita triangeln med röd kant och spets nedåt är väjningspliktsmärket." },
      { id: 3, category: "Trafikregler", question: "I en okontrollerad korsning, vem har företräde?", options: ["Den som kör fortast", "Fordon från vänster", "Fordon från höger", "Den som kom först"], correct: 2, explanation: "Högerregeln gäller när inget annat anges." },
      { id: 4, category: "Hastighet & Säkerhet", question: "Hur ökar bromssträckan om du dubblar hastigheten?", options: ["Dubbelt", "Tre gånger", "Fyra gånger", "Lika mycket"], correct: 2, explanation: "Bromssträckan ökar med kvadraten på hastigheten." },
      { id: 5, category: "Alkohol & Droger", question: "Var går promillegränsen för rattfylleri i Sverige?", options: ["0,5 promille", "0,2 promille", "0,8 promille", "1,0 promille"], correct: 1, explanation: "Gränsen för rattfylleri i Sverige är 0,2 promille." },
      { id: 6, category: "Riskutbildning", question: "Vad handlar Risktvåan om?", options: ["Alkohol och droger", "Halkbana och praktisk riskkörning", "Teoriprov", "Handledarkurs"], correct: 1, explanation: "Risktvåan är praktisk och handlar bland annat om halka, bromsning och sladd." },
      { id: 7, category: "Förarprovet", question: "Hur många frågor måste du ha rätt på teoriprovet?", options: ["45 av 65", "52 av 65", "55 av 65", "60 av 65"], correct: 1, explanation: "Du behöver 52 rätt av 65 frågor för att bli godkänd." },
      { id: 8, category: "Säkerhet", question: "Vad är defensiv körning?", options: ["Köra fort", "Förutse risker och anpassa körningen", "Köra nära bilen framför", "Använda mobiltelefon"], correct: 1, explanation: "Defensiv körning betyder att du planerar, håller avstånd och undviker onödiga risker." },
    ] },
  simulator: { tag: "Öva. Förbättra. Lyckas.", title: "Testa dina kunskaper i vår körsimulator.", text: "Träna reaktion, observation, parkering och trafikrytm i realistiska simulatorsessioner.", start: "Starta simulator", city: "Stadskörning", motorway: "Motorväg", night: "Mörkerkörning" },
  braking: { tag: "Risktvåan Förberedelse", title: "Braking Distance Visualizer", text: "Testa hur väglaget påverkar stoppsträckan. Det här får du lära dig live på halkbanan under Risktvåan.", variables: "Variabler & Väglag", speed: "Hastighet", choose: "Välj väglag", stopping: "Stoppsträcka", reaction: "Reaktion", braking: "Broms", total: "Total", conditions: ["Is / Snö", "Våt", "Torr", "Grus"] },
  reviews: { tag: "Google Reviews", title: "Vad säger våra elever?", based: "baserat på 124 omdömen", verified: "Verifierat via Google", items: [
    ["Johanna Bergqvist", "för 2 veckor sedan", "Fantastisk körskola! Klarade uppkörningen på första försöket tack vare Kornu. Jättepedagogiska lärare.", "JB"],
    ["Sven Malmström", "för 1 månad sedan", "Rekommenderar starkt! Riskettan och Risktvåan var otroligt lärorika. Professionellt team.", "SM"],
    ["Emma Wallin", "för 3 månader sedan", "Tack för tålamodet! Klarade provet och är nu stolt bilförare.", "EW"],
    ["Marcus Lindgren", "för 2 månader sedan", "Supersmidigt upplägg. Priset var rimligt och lärarna riktigt duktiga.", "ML"],
    ["Fatima Al-Hassan", "för 1 vecka sedan", "Underbar skola! Lärarna pratar även arabiska vilket hjälpte mig enormt.", "FA"],
  ] },
  visit: { tag: "Hitta till oss", title: "Besök oss i Stockholm", text: "Vi finns på Sveavägen 122, nära T-bana Rådmansgatan.", address: "Adress", contact: "Kontakt", hours: "Öppettider", open: "Öppna länk", schedule: "Mån-Tor 09:00-18:00\nFredag 09:00-16:00\nLördag 10:00-14:00" },
  final: { tag: "Redo att starta i Stockholm?", title: "Boka din första lektion och få en personlig körkortsplan.", button: "Boka din lektion", location: "Stockholm" },
  pay: { title: "Slutför betalning", successTitle: "Betalning genomförd", selected: "Valt paket", contact: "Kontaktuppgifter", name: "Namn", email: "E-post", phone: "Telefon", personal: "Personnummer (ÅÅÅÅMMDD-XXXX)", transmission: "Välj växellåda", manual: "Manuell", automatic: "Automat", notes: "Anteckningar", method: "Betalningsmetod", card: "Kort", swish: "Swish", cardNumber: "Kortnummer", expiry: "MM / ÅÅ", secure: "Säker betalning", pay: "Betala", openSwish: "Öppna Swish", swishRedirect: "", processing: "", wait: "", done: "", thanks: "", orderNumber: "", close: "Stäng", checkout: "Stripe Checkout", successPending: "Tack för din beställning", successPendingText: "Stripe Checkout är slutförd. Din betalning och bokning hanteras nu via vår Stripe-webhook. Klarna-betalningar kan slutföras separat.", sessionReceived: "Din Checkout-referens har tagits emot.", cancelled: "Betalningen avbröts", cancelledText: "Ingen betalning har bekräftats. Du kan återvända och försöka igen." },
  footer: { text: "Kornu Trafikskola i Stockholm hjälper nya förare att bli trygga, säkra och självständiga. Utbildning på svenska, engelska och arabiska.", quick: "Snabblänkar", courses: "Kurser", contact: "Kontakt", rights: "Alla rättigheter förbehållna.", city: "Körskola i Stockholm" },
  about: { eyebrow: "Om oss", title: "Kornu Trafikskola Stockholm", text: "Vi hjälper elever att bli trygga förare med tydliga paket, teoristöd och modern lektionsplanering." },
  pages: {
    courses: ["Kurser", "Körkortsutbildning för din vardag.", "Manuell, automat, intensivkurs och kompletterande körmoment med erfarna lärare."],
    packages: ["Paket & priser", "Tydliga paket utan krångel.", "Välj ett startpaket, totalpaket eller intensivt upplägg. Vi hjälper dig hitta rätt nivå innan du bokar."],
    gallery: ["Galleri", "Elever, bilar och ögonblick från Kör Nu.", "En samlad bildbank med Kör Nu Trafikskola och våra glada elever."],
    simulator: ["Simulator", "Öva innan trafiken känns skarp.", "Träna reaktion, observation, stadskörning, motorväg och mörkerkörning i Kör Nu-simulatorn."],
    contact: ["Kontakt", "Prata med oss om ditt körkort.", "Kontakta oss för paket, testlektioner och planering inför prov."],
  },
  courses: {
    cards: [
      ["Manuell körning", "Lär dig kopplingskontroll och stadskörning med professionell handledning.", "Från 495 kr / lektion"],
      ["Automat körning", "Fokusera på trafikflöde, säkerhet och beslutsfattande utan växelstress.", "Från 495 kr / lektion"],
      ["Intensivkurs", "Strukturerad och snabb väg till körkort med dagliga lektioner.", "Paket från 7 249 kr"],
      ["Motorvägskörning", "Infarter, hastighetsbedömning och säkra motorvägsrutiner.", "Från 1 450 kr"],
      ["Mörkerkörning", "Observation, hastighetsval och körning på våt vägbana.", "Från 1 250 kr"],
    ],
  },
};

const en: typeof sv = {
  nav: { home: "Home", courses: "Courses", packages: "Packages", simulator: "Simulator", gallery: "Gallery", about: "About", contact: "Contact", book: "Book test lesson", studentLogin: "Student login", pupil: "Pupil", pupilText: "Log in to the student portal", ecommerce: "E-commerce", ecommerceText: "Book via traffic school online" },
  hero: { badge: "Traffic school in Stockholm", titleA: "Drive toward your licence with", titleB: "Kör Nu.", text: "Driving licence training in Swedish, English and Arabic. Digital theory material, driving exercises and simple online booking.", book: "Book test lesson", packages: "See packages & prices", stats: [["3", "Languages"], ["100+", "Driving exercises"], ["98%", "Pass rate"]] },
  benefits: [["Flexible times", "Driving lessons on evenings, weekends and weekdays.", "calendar"], ["Modern cars", "Safe vehicles with dual controls and automatic transmission.", "car"], ["Certified teachers", "Patient, experienced instructors teaching in several languages.", "person"], ["Test-ready planning", "Clear preparation for theory, risk training and the driving test.", "pin"]],
  journey: { ...sv.journey, tag: "Your route to the licence", title: "From the first test to a confident driver.", text: "A clear plan from learner permit to the final driving test.", steps: [["Learner permit", "Apply through Transportstyrelsen and start your plan."], ["Risk 1", "Theory course about alcohol, drugs and tiredness."], ["Risk 2", "Skid training and control exercises."], ["Theory test", "Practise smart and take the test at Trafikverket."], ["Driving test", "Warm-up and final preparation."], ["Licence!", "Congratulations - you are now a licensed driver."]] },
  packages: { ...sv.packages, tag: "Packages & prices", title: "Choose the package that suits you.", text: "All lessons are 80 minutes and include professional guidance, modern cars and clear planning.", popular: "Popular", price: "Price incl. VAT", buy: "Book", readMore: "Read more", moreBenefits: "more benefits", help: "Need advice?", call: "Call us at", descriptions: ["A safe start for students who want to build the fundamentals with clear planning.", "For students who want driving lessons, Risk 1 and focused theory practice.", "Fast, focused preparation for theory, risk training and the driving test.", "A balanced route with more driving time and complete support.", "For students who want extra driving experience, theory and risk training together.", "Our most complete plan with priority times and driving test preparation."], durations: ["Flexible learning time", "Flexible learning time", "10 intensive days", "Flexible learning time", "Flexible learning time", "Complete plan"], items: [["Starter package", "5 driving lessons (80 min)", ["5 driving lessons (80 min)", "Digital theory package", "Personal study plan"]], ["Middle package", "10 driving lessons (80 min) + Risk 1", ["10 driving lessons (80 min)", "Risk 1", "Unlimited theory tests", "Borrow car for test"]], ["Intensive package", "15 driving lessons (80 min) + Risk 1 & 2", ["15 driving lessons (80 min)", "Risk 1 & Risk 2", "Complete theory package", "Test preparation"]], ["Middle package", "10 driving lessons (80 min) + Risk 1-2 + Theory", ["10 driving lessons (80 min)", "Risk 1 & Risk 2", "Theory training & registration", "Driving booklet included"]], ["Large package", "15 driving lessons (80 min) + Risk 1-2 + Theory", ["15 driving lessons (80 min)", "Risk 1 & Risk 2", "Theory training & registration", "Driving booklet included"]], ["Complete package", "25 driving lessons (80 min) + Risk 1-2 + Theory", ["25 driving lessons (80 min)", "Risk 1 & Risk 2", "Supervisor course", "Priority times", "Borrow car for driving test"]]] },
  quiz: { tag: "Test your Driving License skills", title: "Test your Driving Theory", text: "Answer a few sample theory questions before your real test.", all: "All", question: "Question", result: "See result", next: "Next question", retry: "Try again", good: "Good work!", practice: "Practise a little more!", got: "You got", of: "of", correct: "correct",
    questions: [
      { id: 1, category: "Road signs", question: "What does a red round sign with a white horizontal bar mean?", options: ["Stop", "No entry for traffic", "No stopping", "Motorway ends"], correct: 0, explanation: "The red round sign with a white bar means stop. You must come to a complete stop." },
      { id: 2, category: "Road signs", question: "Which sign means you must give way?", options: ["Red circle", "Yellow diamond", "White triangle with red border", "Blue square"], correct: 2, explanation: "The white triangle with a red border and point down is the give-way sign." },
      { id: 3, category: "Traffic rules", question: "At an uncontrolled intersection, who has priority?", options: ["The fastest driver", "Vehicles from the left", "Vehicles from the right", "Whoever arrived first"], correct: 2, explanation: "The right-hand rule applies when no other sign or signal says otherwise." },
      { id: 4, category: "Speed & safety", question: "How does braking distance change if you double your speed?", options: ["Doubles", "Triples", "Becomes four times longer", "Stays the same"], correct: 2, explanation: "Braking distance increases with the square of speed." },
      { id: 5, category: "Alcohol & drugs", question: "What is the drink-driving limit in Sweden?", options: ["0.5 per mille", "0.2 per mille", "0.8 per mille", "1.0 per mille"], correct: 1, explanation: "The drink-driving limit in Sweden is 0.2 per mille." },
      { id: 6, category: "Risk training", question: "What is Risk 2 about?", options: ["Alcohol and drugs", "Skid track and practical risk driving", "Theory test", "Supervisor course"], correct: 1, explanation: "Risk 2 is practical and covers slippery roads, braking and skidding." },
      { id: 7, category: "Driving test", question: "How many correct answers do you need on the theory test?", options: ["45 of 65", "52 of 65", "55 of 65", "60 of 65"], correct: 1, explanation: "You need 52 correct answers out of 65 to pass." },
      { id: 8, category: "Safety", question: "What is defensive driving?", options: ["Driving fast", "Predicting risks and adapting your driving", "Driving close behind", "Using a mobile phone"], correct: 1, explanation: "Defensive driving means planning, keeping distance and avoiding unnecessary risks." },
    ] },
  simulator: { tag: "Practise. Improve. Succeed.", title: "Test your skills in our driving simulator.", text: "Train reaction, observation, parking and traffic rhythm in realistic simulator sessions.", start: "Start simulator", city: "City driving", motorway: "Motorway", night: "Night driving" },
  braking: { tag: "Risk 2 preparation", title: "Braking Distance Visualizer", text: "Test how road conditions affect stopping distance. This is what you learn live during Risk 2.", variables: "Variables & road conditions", speed: "Speed", choose: "Choose condition", stopping: "Stopping distance", reaction: "Reaction", braking: "Braking", total: "Total", conditions: ["Ice / Snow", "Wet", "Dry", "Gravel"] },
  reviews: { tag: "Google Reviews", title: "What do our students say?", based: "based on 124 reviews", verified: "Verified via Google", items: [
    ["Johanna Bergqvist", "2 weeks ago", "Fantastic driving school! I passed the driving test on the first try thanks to Kornu. Very pedagogical teachers.", "JB"],
    ["Sven Malmström", "1 month ago", "Highly recommended! Risk 1 and Risk 2 were incredibly useful. Professional team.", "SM"],
    ["Emma Wallin", "3 months ago", "Thanks for the patience! I passed the test and am now a proud driver.", "EW"],
    ["Marcus Lindgren", "2 months ago", "Very smooth setup. The price was fair and the teachers were really skilled.", "ML"],
    ["Fatima Al-Hassan", "1 week ago", "Wonderful school! The teachers also speak Arabic, which helped me a lot.", "FA"],
  ] },
  visit: { tag: "Find us", title: "Visit us in Stockholm", text: "You can find us at Sveavägen 122, near Rådmansgatan metro station.", address: "Address", contact: "Contact", hours: "Opening hours", open: "Open link", schedule: "Mon-Thu 09:00-18:00\nFriday 09:00-16:00\nSaturday 10:00-14:00" },
  final: { tag: "Ready to start in Stockholm?", title: "Book your first lesson and get a personal licence plan.", button: "Book your lesson", location: "Stockholm" },
  pay: { title: "Complete payment", successTitle: "Payment completed", selected: "Selected package", contact: "Contact details", name: "Name", email: "Email", phone: "Phone", personal: "Personal identity number (YYYYMMDD-XXXX)", transmission: "Choose transmission", manual: "Manual", automatic: "Automatic", notes: "Notes (optional): have you driven before, booked a test or want to add anything?", method: "Payment method", card: "Card", swish: "Swish", cardNumber: "Card number", expiry: "MM / YY", secure: "Secure SSL-encrypted payment", pay: "Pay", openSwish: "Open Swish", swishRedirect: "", processing: "", wait: "", done: "", thanks: "", orderNumber: "", close: "Close", checkout: "Stripe Checkout", successPending: "Thank you for your order", successPendingText: "Stripe Checkout is complete. Your payment and booking are now handled through our Stripe webhook. Klarna payments may complete separately.", sessionReceived: "Your Checkout reference was received.", cancelled: "Payment cancelled", cancelledText: "No payment has been confirmed. You can return and try again." },
  footer: { text: "Kornu Traffic School in Stockholm helps new drivers become confident, safe and independent. Training in Swedish, English and Arabic.", quick: "Quick links", courses: "Courses", contact: "Contact", rights: "All rights reserved.", city: "Driving school in Stockholm" },
  about: { eyebrow: "About", title: "Kornu Traffic School Stockholm", text: "We help students become confident drivers with clear packages, theory support and modern lesson planning." },
  pages: {
    courses: ["Courses", "Driving licence training for your everyday life.", "Manual, automatic, intensive courses and extra driving moments with experienced teachers."],
    packages: ["Packages & prices", "Clear packages without hassle.", "Choose a starter, complete or intensive package. We help you find the right level before booking."],
    gallery: ["Gallery", "Students, cars and moments from Kör Nu.", "A collected gallery with Kör Nu Traffic School and happy students."],
    simulator: ["Simulator", "Practise before traffic feels real.", "Train reaction, observation, city driving, motorway and night driving in the Kör Nu simulator."],
    contact: ["Contact", "Talk to us about your licence.", "Contact us for packages, test lessons and planning before your test."],
  },
  courses: {
    cards: [
      ["Manual driving", "Learn clutch control and city driving with professional guidance.", "From 495 kr / lesson"],
      ["Automatic driving", "Focus on traffic flow, safety and decisions without gear stress.", "From 495 kr / lesson"],
      ["Intensive course", "A structured and faster route to your licence with daily lessons.", "Packages from 7,249 kr"],
      ["Motorway driving", "Entrances, speed judgement and safe motorway routines.", "From 1,450 kr"],
      ["Night driving", "Observation, speed choice and driving on wet roads.", "From 1,250 kr"],
    ],
  },
};

const ar: typeof sv = {
  ...sv,
  nav: { home: "الرئيسية", courses: "الدورات", packages: "الباقات", simulator: "المحاكي", gallery: "المعرض", about: "من نحن", contact: "اتصل بنا", book: "احجز درس تجربة", studentLogin: "دخول الطالب", pupil: "الطالب", pupilText: "تسجيل الدخول إلى بوابة الطالب", ecommerce: "المتجر", ecommerceText: "احجز عبر نظام مدرسة القيادة" },
  hero: { badge: "مدرسة قيادة في ستوكهولم", titleA: "ابدأ طريقك نحو رخصة القيادة مع", titleB: "Kör Nu.", text: "تدريب رخصة القيادة بالسويدية والإنجليزية والعربية، مع مواد نظرية رقمية وتمارين قيادة وحجز سهل عبر الإنترنت.", book: "احجز درس تجربة", packages: "شاهد الباقات والأسعار", stats: [["3", "لغات"], ["+100", "تمارين قيادة"], ["98%", "نسبة النجاح"]] },
  benefits: [["أوقات مرنة", "دروس قيادة مساء وعطلات ونهاية الأسبوع.", "calendar"], ["سيارات حديثة", "سيارات آمنة بمعدات تدريب وتحكم مزدوج.", "car"], ["مدربون معتمدون", "مدربون صبورون وذوو خبرة بعدة لغات.", "person"], ["تخطيط واضح", "تحضير للنظرية وتدريب المخاطر واختبار القيادة.", "pin"]],
  journey: { tag: "طريقك إلى الرخصة", title: "من الخطوة الأولى إلى قيادة واثقة.", text: "خطة واضحة من تصريح القيادة إلى اختبار القيادة النهائي.", steps: [["تصريح القيادة", "قدّم عبر Transportstyrelsen وابدأ خطتك."], ["Risk 1", "دورة نظرية عن الكحول والمخدرات والتعب."], ["Risk 2", "تدريب الانزلاق وتمارين التحكم."], ["اختبار النظرية", "تدرّب بذكاء ثم أدِ الاختبار لدى Trafikverket."], ["اختبار القيادة", "تجهيز نهائي قبل الاختبار العملي."], ["الرخصة!", "تهانينا، أصبحت سائقاً مرخصاً."]] },
  packages: { ...en.packages, tag: "الباقات والأسعار", title: "اختر الباقة المناسبة لك.", text: "كل الدروس مدتها 80 دقيقة وتشمل إرشاداً احترافياً وسيارات حديثة وخطة واضحة.", popular: "الأكثر طلباً", price: "السعر شامل الضريبة", buy: "احجز", readMore: "اقرأ المزيد", moreBenefits: "مزايا إضافية", help: "تحتاج إلى نصيحة؟", call: "اتصل بنا على", descriptions: ["بداية آمنة لمن يريد بناء الأساس بخطة واضحة.", "للطلاب الذين يريدون دروس قيادة مع Risk 1 وتدريب نظري.", "تحضير سريع ومركز للنظرية وتدريب المخاطر والاختبار.", "مسار متوازن مع وقت قيادة أكثر ودعم كامل.", "لمن يريد خبرة قيادة إضافية مع النظرية وتدريب المخاطر.", "خطتنا الأشمل مع أوقات أولوية وتحضير لاختبار القيادة."], durations: ["وقت تعلم مرن", "وقت تعلم مرن", "10 أيام مكثفة", "وقت تعلم مرن", "وقت تعلم مرن", "خطة كاملة"], items: [["باقة البداية", "5 دروس قيادة (80 دقيقة)", ["5 دروس قيادة (80 دقيقة)", "باقة نظرية رقمية", "خطة دراسة شخصية"]], ["الباقة المتوسطة", "10 دروس قيادة (80 دقيقة) + Risk 1", ["10 دروس قيادة (80 دقيقة)", "Risk 1", "اختبارات نظرية غير محدودة", "استعارة سيارة للاختبار"]], ["الباقة المكثفة", "15 درس قيادة (80 دقيقة) + Risk 1 & 2", ["15 درس قيادة (80 دقيقة)", "Risk 1 & Risk 2", "باقة نظرية كاملة", "تحضير للاختبار"]], ["باقة متوسطة", "10 دروس قيادة (80 دقيقة) + Risk 1-2 + نظرية", ["10 دروس قيادة (80 دقيقة)", "Risk 1 & Risk 2", "تدريب نظري وتسجيل", "كتيب قيادة"]], ["باقة كبيرة", "15 درس قيادة (80 دقيقة) + Risk 1-2 + نظرية", ["15 درس قيادة (80 دقيقة)", "Risk 1 & Risk 2", "تدريب نظري وتسجيل", "كتيب قيادة"]], ["الباقة الكاملة", "25 درس قيادة (80 دقيقة) + Risk 1-2 + نظرية", ["25 درس قيادة (80 دقيقة)", "Risk 1 & Risk 2", "دورة مشرف", "أوقات أولوية", "استعارة سيارة للاختبار"]]] },
  quiz: { tag: "اختبر مهارات رخصة القيادة", title: "اختبر معلوماتك النظرية", text: "أجب عن بعض الأسئلة التدريبية قبل الاختبار الحقيقي.", all: "الكل", question: "سؤال", result: "عرض النتيجة", next: "السؤال التالي", retry: "حاول مرة أخرى", good: "عمل رائع!", practice: "تدرّب أكثر قليلاً!", got: "حصلت على", of: "من", correct: "صحيح",
    questions: [
      { id: 1, category: "إشارات الطريق", question: "ماذا تعني إشارة دائرية حمراء وبداخلها خط أبيض أفقي؟", options: ["توقف", "ممنوع دخول المركبات", "ممنوع الوقوف", "نهاية الطريق السريع"], correct: 0, explanation: "هذه الإشارة تعني توقف، ويجب أن تتوقف تماماً." },
      { id: 2, category: "إشارات الطريق", question: "أي إشارة تعني وجوب إعطاء الأولوية؟", options: ["دائرة حمراء", "معين أصفر", "مثلث أبيض بحافة حمراء", "مربع أزرق"], correct: 2, explanation: "المثلث الأبيض بحافة حمراء ورأسه للأسفل هو إشارة إعطاء الأولوية." },
      { id: 3, category: "قواعد المرور", question: "في تقاطع غير منظم، لمن تكون الأولوية؟", options: ["للسائق الأسرع", "للمركبات من اليسار", "للمركبات من اليمين", "لمن وصل أولاً"], correct: 2, explanation: "تطبق قاعدة اليمين عندما لا توجد إشارة أو تعليمات أخرى." },
      { id: 4, category: "السرعة والسلامة", question: "كيف تتغير مسافة الفرملة إذا ضاعفت السرعة؟", options: ["تتضاعف", "تصبح ثلاثة أضعاف", "تصبح أربعة أضعاف", "لا تتغير"], correct: 2, explanation: "مسافة الفرملة تزيد مع مربع السرعة." },
      { id: 5, category: "الكحول والمخدرات", question: "ما حد الكحول للقيادة في السويد؟", options: ["0.5 بالألف", "0.2 بالألف", "0.8 بالألف", "1.0 بالألف"], correct: 1, explanation: "حد القيادة تحت تأثير الكحول في السويد هو 0.2 بالألف." },
      { id: 6, category: "تدريب المخاطر", question: "عن ماذا يتحدث Risk 2؟", options: ["الكحول والمخدرات", "حلبة الانزلاق والقيادة العملية", "اختبار النظرية", "دورة المشرف"], correct: 1, explanation: "Risk 2 عملي ويتناول الطرق الزلقة والفرملة والانزلاق." },
      { id: 7, category: "اختبار القيادة", question: "كم إجابة صحيحة تحتاج في اختبار النظرية؟", options: ["45 من 65", "52 من 65", "55 من 65", "60 من 65"], correct: 1, explanation: "تحتاج إلى 52 إجابة صحيحة من أصل 65 للنجاح." },
      { id: 8, category: "السلامة", question: "ما معنى القيادة الدفاعية؟", options: ["القيادة بسرعة", "توقع المخاطر وتكييف القيادة", "القيادة قريباً من السيارة أمامك", "استخدام الهاتف"], correct: 1, explanation: "القيادة الدفاعية تعني التخطيط وترك مسافة وتجنب المخاطر غير الضرورية." },
    ] },
  simulator: { tag: "تدرّب. تحسّن. انجح.", title: "اختبر مهاراتك في محاكي القيادة.", text: "تدرّب على رد الفعل والملاحظة والركن وإيقاع المرور في جلسات محاكاة واقعية.", start: "ابدأ المحاكي", city: "قيادة داخل المدينة", motorway: "الطريق السريع", night: "القيادة ليلاً" },
  braking: { tag: "تحضير Risk 2", title: "حاسبة مسافة التوقف", text: "اختبر كيف تؤثر حالة الطريق على مسافة التوقف. هذا ما تتعلمه عملياً في Risk 2.", variables: "المتغيرات وحالة الطريق", speed: "السرعة", choose: "اختر حالة الطريق", stopping: "مسافة التوقف", reaction: "رد الفعل", braking: "الفرملة", total: "الإجمالي", conditions: ["جليد / ثلج", "مبلل", "جاف", "حصى"] },
  reviews: { tag: "تقييمات Google", title: "ماذا يقول طلابنا؟", based: "بناءً على 124 تقييماً", verified: "موثق عبر Google", items: [
    ["Johanna Bergqvist", "منذ أسبوعين", "مدرسة قيادة رائعة! نجحت في اختبار القيادة من أول محاولة بفضل Kornu. المدربون ممتازون.", "JB"],
    ["Sven Malmström", "منذ شهر", "أنصح بها بشدة! كان Risk 1 و Risk 2 مفيدين جداً. فريق محترف.", "SM"],
    ["Emma Wallin", "منذ 3 أشهر", "شكراً على الصبر! نجحت في الاختبار وأصبحت سائقة فخورة.", "EW"],
    ["Marcus Lindgren", "منذ شهرين", "تنظيم سهل جداً. السعر مناسب والمدربون ماهرون.", "ML"],
    ["Fatima Al-Hassan", "منذ أسبوع", "مدرسة رائعة! يتحدث المدربون العربية أيضاً وهذا ساعدني كثيراً.", "FA"],
  ] },
  visit: { tag: "اعثر علينا", title: "زرنا في ستوكهولم", text: "نحن في Sveavägen 122 بالقرب من محطة Rådmansgatan.", address: "العنوان", contact: "التواصل", hours: "ساعات العمل", open: "افتح الرابط", schedule: "الإثنين-الخميس 09:00-18:00\nالجمعة 09:00-16:00\nالسبت 10:00-14:00" },
  final: { tag: "جاهز للبدء في ستوكهولم؟", title: "احجز أول درس واحصل على خطة شخصية لرخصة القيادة.", button: "احجز درسك", location: "ستوكهولم" },
  pay: { ...en.pay, title: "إكمال الدفع", successTitle: "تم الدفع", selected: "الباقة المختارة", contact: "بيانات التواصل", name: "الاسم", email: "البريد الإلكتروني", phone: "الهاتف", personal: "رقم الهوية الشخصية (YYYYMMDD-XXXX)", transmission: "اختر نوع ناقل الحركة", manual: "يدوي", automatic: "أوتوماتيك", notes: "ملاحظات اختيارية: هل قدت سابقاً أو حجزت اختباراً؟", method: "طريقة الدفع", card: "بطاقة", swish: "Swish", cardNumber: "رقم البطاقة", expiry: "MM / YY", secure: "دفع آمن ومشفر", pay: "ادفع", openSwish: "افتح Swish", swishRedirect: "سيتم تحويلك إلى تطبيق Swish لإكمال دفع", processing: "جاري معالجة الدفع...", wait: "يرجى الانتظار أثناء التحقق من الدفع.", done: "تم الدفع!", thanks: "شكراً لحجزك. أرسلنا تأكيداً إلى بريدك الإلكتروني.", orderNumber: "رقم الطلب", close: "إغلاق" },
  footer: { text: "تساعد Kornu Traffic School في ستوكهولم الطلاب الجدد على القيادة بثقة وأمان واستقلالية. التدريب متوفر بالسويدية والإنجليزية والعربية.", quick: "روابط سريعة", courses: "الدورات", contact: "التواصل", rights: "جميع الحقوق محفوظة.", city: "مدرسة قيادة في ستوكهولم" },
  about: { eyebrow: "من نحن", title: "Kornu Traffic School Stockholm", text: "نساعد الطلاب على أن يصبحوا سائقين واثقين من خلال باقات واضحة ودعم نظري وتخطيط حديث للدروس." },
  pages: {
    courses: ["الدورات", "تدريب رخصة القيادة لحياتك اليومية.", "دروس يدوي وأوتوماتيك ودورات مكثفة مع مدربين ذوي خبرة."],
    packages: ["الباقات والأسعار", "باقات واضحة بدون تعقيد.", "اختر باقة بداية أو باقة كاملة أو مكثفة، وسنساعدك في اختيار المستوى المناسب قبل الحجز."],
    gallery: ["المعرض", "طلاب وسيارات ولحظات من Kör Nu.", "معرض صور لمدرسة Kör Nu وطلابنا السعداء."],
    simulator: ["المحاكي", "تدرّب قبل أن تصبح حركة المرور حقيقية.", "تدرّب على رد الفعل والملاحظة والمدينة والطريق السريع والقيادة الليلية."],
    contact: ["التواصل", "تحدث معنا عن رخصة القيادة.", "تواصل معنا للباقات ودروس التجربة والتخطيط قبل الاختبار."],
  },
  courses: {
    cards: [
      ["قيادة يدوية", "تعلّم التحكم بالقابض والقيادة داخل المدينة مع إرشاد احترافي.", "من 495 كرونة / درس"],
      ["قيادة أوتوماتيك", "ركز على حركة المرور والسلامة واتخاذ القرار بدون ضغط تبديل السرعات.", "من 495 كرونة / درس"],
      ["دورة مكثفة", "طريق منظم وأسرع نحو الرخصة مع دروس يومية.", "باقات من 7,249 كرونة"],
      ["قيادة الطريق السريع", "الدخول للطريق وتقدير السرعة وروتين الطريق السريع الآمن.", "من 1,450 كرونة"],
      ["القيادة الليلية", "الملاحظة واختيار السرعة والقيادة على الطرق المبللة.", "من 1,250 كرونة"],
    ],
  },
};

export const translations = { en, sv, ar };

const LanguageContext = createContext<{ lang: Lang; setLang: (lang: Lang) => void; t: typeof sv } | null>(null);
const LANGUAGE_STORAGE_KEY = "kornu-lang-v2";

function isLang(value: string | null): value is Lang {
  return value === "sv" || value === "en" || value === "ar";
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    return isLang(stored) ? stored : "sv";
  });
  const t = translations[lang] || translations.sv;

  const setLang = (next: Lang) => {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, next);
    setLangState(next);
  };

  useEffect(() => {
    const option = languageOptions.find((item) => item.code === lang) || languageOptions[0];
    document.documentElement.lang = lang;
    document.documentElement.dir = option.dir;
  }, [lang]);

  const value = useMemo(() => ({ lang, setLang, t }), [lang, t]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within LanguageProvider");
  return context;
}
