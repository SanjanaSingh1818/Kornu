import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type Lang = "en" | "sv" | "ar";

export const languageOptions: { code: Lang; label: string; flag: string; dir: "ltr" | "rtl" }[] = [
  { code: "en", label: "English", flag: "🇬🇧", dir: "ltr" },
  { code: "sv", label: "Swedish", flag: "🇸🇪", dir: "ltr" },
  { code: "ar", label: "Arabic", flag: "🇸🇦", dir: "rtl" },
];

const sv = {
  nav: { home: "Startsida", services: "Tjänster", simulator: "Simulator", gallery: "Galleri", about: "Om oss", contact: "Kontakt", book: "Boka testlektion", studentLogin: "Student login", pupil: "Elev", pupilText: "Logga in på elevportalen", ecommerce: "E-handel", ecommerceText: "Boka via trafikskolaonline" },
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
    tag: "Paket & priser", title: "Välj det paket som passar dig.", text: "Alla lektioner är 80 minuter och inkluderar professionell handledning, moderna bilar och tydlig planering.", popular: "Populärt", price: "Pris inkl. moms", buy: "Köp paket", help: "Behöver du rådgivning?", call: "Ring oss på",
    items: [
      ["Grundpaketet", "5 körlektioner (80 min)", ["5 körlektioner (80 min)", "Digitalt teoripaket", "Personlig studieplan"]],
      ["Mellanpaketet", "10 körlektioner (80 min) + Risk 1", ["10 körlektioner (80 min)", "Riskettan", "Obegränsade teoriprov", "Låna bil till prov"]],
      ["Intensivpaket", "15 körlektioner (80 min) + Risk 1 & 2", ["15 körlektioner (80 min)", "Risk 1 & Risk 2", "Komplett teoripaket", "Provförberedelse"]],
      ["Mellanpaket", "10 körlektioner (80 min) + Risk 1-2 + Teori", ["10 körlektioner (80 min)", "Risk 1 & Risk 2", "Teoriutbildning & inskrivning", "Körhäfte ingår"]],
      ["Stort Paket", "15 körlektioner (80 min) + Risk 1-2 + Teori", ["15 körlektioner (80 min)", "Risk 1 & Risk 2", "Teoriutbildning & inskrivning", "Körhäfte ingår"]],
      ["Komplettpaket", "25 körlektioner (80 min) + Risk 1-2 + Teori", ["25 körlektioner (80 min)", "Risk 1 & Risk 2", "Handledarutbildning", "Prioriterade tider", "Låna bil till uppkörning"]],
    ],
  },
  quiz: { tag: "Testa dina körkortskunskaper", title: "Testa din körkortsteori", text: "Svara på några exempel frågor innan ditt riktiga prov.", question: "Fråga", result: "Se resultat", next: "Nästa fråga", retry: "Försök igen", good: "Bra jobbat!", practice: "Öva lite mer!", got: "Du fick", of: "av", correct: "rätt" },
  simulator: { tag: "Öva. Förbättra. Lyckas.", title: "Testa dina kunskaper i vår körsimulator.", text: "Träna reaktion, observation, parkering och trafikrytm i realistiska simulatorsessioner.", start: "Starta simulator", city: "Stadskörning", motorway: "Motorväg", night: "Mörkerkörning" },
  braking: { tag: "Risktvåan Förberedelse", title: "Braking Distance Visualizer", text: "Testa hur väglaget påverkar stoppsträckan. Det här får du lära dig live på halkbanan under Risktvåan.", variables: "Variabler & Väglag", speed: "Hastighet", choose: "Välj väglag", stopping: "Stoppsträcka", reaction: "Reaktion", braking: "Broms", total: "Total", conditions: ["Is / Snö", "Våt", "Torr", "Grus"] },
  reviews: { tag: "Google Reviews", title: "Vad säger våra elever?", based: "baserat på 124 omdömen", verified: "Verifierat via Google" },
  visit: { tag: "Hitta till oss", title: "Besök oss i Stockholm", text: "Vi finns på Sveavägen 122, nära T-bana Rådmansgatan.", address: "Adress", contact: "Kontakt", hours: "Öppettider", open: "Öppna länk" },
  final: { tag: "Redo att starta i Stockholm?", title: "Boka din första lektion och få en personlig körkortsplan.", button: "Boka din lektion", location: "Stockholm" },
  pay: { title: "Slutför betalning", successTitle: "Betalning genomförd", selected: "Valt paket", contact: "Kontaktuppgifter", name: "Namn", email: "E-post", phone: "Telefon", personal: "Personnummer (ÅÅÅÅMMDD-XXXX)", transmission: "Välj växellåda", manual: "Manuell", automatic: "Automat", notes: "Anteckningar (valfritt): har du kört tidigare, bokat prov eller vill lägga till något?", method: "Betalningsmetod", card: "Kort", swish: "Swish", cardNumber: "Kortnummer", expiry: "MM / ÅÅ", secure: "Säker betalning krypterad med SSL", pay: "Betala", openSwish: "Öppna Swish", processing: "Bearbetar betalning...", wait: "Vänligen vänta medan vi verifierar din betalning.", done: "Betalning genomförd!", thanks: "Tack för din bokning. Vi har skickat en bekräftelse till din e-post.", close: "Stäng" },
  footer: { text: "Kornu Trafikskola i Stockholm hjälper nya förare att bli trygga, säkra och självständiga. Utbildning på svenska, engelska och arabiska.", quick: "Snabblänkar", courses: "Kurser", contact: "Kontakt", rights: "Alla rättigheter förbehållna.", city: "Körskola i Stockholm" },
  about: { eyebrow: "Om oss", title: "Kornu Trafikskola Stockholm", text: "Vi hjälper elever att bli trygga förare med tydliga paket, teoristöd och modern lektionsplanering." },
  pages: {
    courses: ["Kurser", "Körkortsutbildning för din vardag.", "Manuell, automat, intensivkurs och kompletterande körmoment med erfarna lärare."],
    packages: ["Paket & priser", "Tydliga paket utan krångel.", "Välj ett startpaket, totalpaket eller intensivt upplägg. Vi hjälper dig hitta rätt nivå innan du bokar."],
    gallery: ["Galleri", "Elever, bilar och ögonblick från Kör Nu.", "En samlad bildbank med Kör Nu Trafikskola och våra glada elever."],
    simulator: ["Simulator", "Öva innan trafiken känns skarp.", "Träna reaktion, observation, stadskörning, motorväg och mörkerkörning i Kör Nu-simulatorn."],
    contact: ["Kontakt", "Prata med oss om ditt körkort.", "Kontakta oss för paket, testlektioner och planering inför prov."],
  },
};

const en: typeof sv = {
  nav: { home: "Home page", services: "Services", simulator: "Simulator", gallery: "Gallery", about: "About Us", contact: "Contact", book: "Book test lesson", studentLogin: "Student login", pupil: "Pupil", pupilText: "Log in to the student portal", ecommerce: "E-commerce", ecommerceText: "Book via traffic school online" },
  hero: { badge: "Traffic school in Stockholm", titleA: "Drive toward your licence with", titleB: "Kör Nu.", text: "Driving licence training in Swedish, English and Arabic. Digital theory material, driving exercises and simple online booking.", book: "Book test lesson", packages: "See packages & prices", stats: [["3", "Languages"], ["100+", "Driving exercises"], ["98%", "Pass rate"]] },
  benefits: [["Flexible times", "Driving lessons on evenings, weekends and weekdays.", "calendar"], ["Modern cars", "Safe vehicles with dual controls and automatic transmission.", "car"], ["Certified teachers", "Patient, experienced instructors teaching in several languages.", "person"], ["Test-ready planning", "Clear preparation for theory, risk training and the driving test.", "pin"]],
  journey: { ...sv.journey, tag: "Your route to the licence", title: "From the first test to a confident driver.", text: "A clear plan from learner permit to the final driving test.", steps: [["Learner permit", "Apply through Transportstyrelsen and start your plan."], ["Risk 1", "Theory course about alcohol, drugs and tiredness."], ["Risk 2", "Skid training and control exercises."], ["Theory test", "Practise smart and take the test at Trafikverket."], ["Driving test", "Warm-up and final preparation."], ["Licence!", "Congratulations - you are now a licensed driver."]] },
  packages: { ...sv.packages, tag: "Packages & prices", title: "Choose the package that suits you.", text: "All lessons are 80 minutes and include professional guidance, modern cars and clear planning.", popular: "Popular", price: "Price incl. VAT", buy: "Buy package", help: "Need advice?", call: "Call us at", items: [["Starter package", "5 driving lessons (80 min)", ["5 driving lessons (80 min)", "Digital theory package", "Personal study plan"]], ["Middle package", "10 driving lessons (80 min) + Risk 1", ["10 driving lessons (80 min)", "Risk 1", "Unlimited theory tests", "Borrow car for test"]], ["Intensive package", "15 driving lessons (80 min) + Risk 1 & 2", ["15 driving lessons (80 min)", "Risk 1 & Risk 2", "Complete theory package", "Test preparation"]], ["Middle package", "10 driving lessons (80 min) + Risk 1-2 + Theory", ["10 driving lessons (80 min)", "Risk 1 & Risk 2", "Theory training & registration", "Driving booklet included"]], ["Large package", "15 driving lessons (80 min) + Risk 1-2 + Theory", ["15 driving lessons (80 min)", "Risk 1 & Risk 2", "Theory training & registration", "Driving booklet included"]], ["Complete package", "25 driving lessons (80 min) + Risk 1-2 + Theory", ["25 driving lessons (80 min)", "Risk 1 & Risk 2", "Supervisor course", "Priority times", "Borrow car for driving test"]]] },
  quiz: { tag: "Test your Driving License skills", title: "Test your Driving Theory", text: "Answer a few sample theory questions before your real test.", question: "Question", result: "See result", next: "Next question", retry: "Try again", good: "Good work!", practice: "Practise a little more!", got: "You got", of: "of", correct: "correct" },
  simulator: { tag: "Practise. Improve. Succeed.", title: "Test your skills in our driving simulator.", text: "Train reaction, observation, parking and traffic rhythm in realistic simulator sessions.", start: "Start simulator", city: "City driving", motorway: "Motorway", night: "Night driving" },
  braking: { tag: "Risk 2 preparation", title: "Braking Distance Visualizer", text: "Test how road conditions affect stopping distance. This is what you learn live during Risk 2.", variables: "Variables & road conditions", speed: "Speed", choose: "Choose condition", stopping: "Stopping distance", reaction: "Reaction", braking: "Braking", total: "Total", conditions: ["Ice / Snow", "Wet", "Dry", "Gravel"] },
  reviews: { tag: "Google Reviews", title: "What do our students say?", based: "based on 124 reviews", verified: "Verified via Google" },
  visit: { tag: "Find us", title: "Visit us in Stockholm", text: "You can find us at Sveavägen 122, near Rådmansgatan metro station.", address: "Address", contact: "Contact", hours: "Opening hours", open: "Open link" },
  final: { tag: "Ready to start in Stockholm?", title: "Book your first lesson and get a personal licence plan.", button: "Book your lesson", location: "Stockholm" },
  pay: { title: "Complete payment", successTitle: "Payment completed", selected: "Selected package", contact: "Contact details", name: "Name", email: "Email", phone: "Phone", personal: "Personal identity number (YYYYMMDD-XXXX)", transmission: "Choose transmission", manual: "Manual", automatic: "Automatic", notes: "Notes (optional): have you driven before, booked a test or want to add anything?", method: "Payment method", card: "Card", swish: "Swish", cardNumber: "Card number", expiry: "MM / YY", secure: "Secure SSL-encrypted payment", pay: "Pay", openSwish: "Open Swish", processing: "Processing payment...", wait: "Please wait while we verify your payment.", done: "Payment completed!", thanks: "Thanks for your booking. We have sent a confirmation to your email.", close: "Close" },
  footer: { text: "Kornu Traffic School in Stockholm helps new drivers become confident, safe and independent. Training in Swedish, English and Arabic.", quick: "Quick links", courses: "Courses", contact: "Contact", rights: "All rights reserved.", city: "Driving school in Stockholm" },
  about: { eyebrow: "About Us", title: "Kornu Traffic School Stockholm", text: "We help students become confident drivers with clear packages, theory support and modern lesson planning." },
  pages: {
    courses: ["Courses", "Driving licence training for your everyday life.", "Manual, automatic, intensive courses and extra driving moments with experienced teachers."],
    packages: ["Packages & prices", "Clear packages without hassle.", "Choose a starter, complete or intensive package. We help you find the right level before booking."],
    gallery: ["Gallery", "Students, cars and moments from Kör Nu.", "A collected gallery with Kör Nu Traffic School and happy students."],
    simulator: ["Simulator", "Practise before traffic feels real.", "Train reaction, observation, city driving, motorway and night driving in the Kör Nu simulator."],
    contact: ["Contact", "Talk to us about your licence.", "Contact us for packages, test lessons and planning before your test."],
  },
};

const ar: typeof sv = {
  ...sv,
  nav: { home: "الرئيسية", services: "الخدمات", simulator: "المحاكي", gallery: "المعرض", about: "من نحن", contact: "اتصل بنا", book: "احجز درس تجربة", studentLogin: "دخول الطالب", pupil: "الطالب", pupilText: "تسجيل الدخول إلى بوابة الطالب", ecommerce: "المتجر", ecommerceText: "احجز عبر نظام مدرسة القيادة" },
  hero: { badge: "مدرسة قيادة في ستوكهولم", titleA: "ابدأ طريقك نحو رخصة القيادة مع", titleB: "Kör Nu.", text: "تدريب رخصة القيادة بالسويدية والإنجليزية والعربية، مع مواد نظرية رقمية وتمارين قيادة وحجز سهل عبر الإنترنت.", book: "احجز درس تجربة", packages: "شاهد الباقات والأسعار", stats: [["3", "لغات"], ["+100", "تمارين قيادة"], ["98%", "نسبة النجاح"]] },
  benefits: [["أوقات مرنة", "دروس قيادة مساء وعطلات ونهاية الأسبوع.", "calendar"], ["سيارات حديثة", "سيارات آمنة بمعدات تدريب وتحكم مزدوج.", "car"], ["مدربون معتمدون", "مدربون صبورون وذوو خبرة بعدة لغات.", "person"], ["تخطيط واضح", "تحضير للنظرية وتدريب المخاطر واختبار القيادة.", "pin"]],
  journey: { tag: "طريقك إلى الرخصة", title: "من الخطوة الأولى إلى قيادة واثقة.", text: "خطة واضحة من تصريح القيادة إلى اختبار القيادة النهائي.", steps: [["تصريح القيادة", "قدّم عبر Transportstyrelsen وابدأ خطتك."], ["Risk 1", "دورة نظرية عن الكحول والمخدرات والتعب."], ["Risk 2", "تدريب الانزلاق وتمارين التحكم."], ["اختبار النظرية", "تدرّب بذكاء ثم أدِ الاختبار لدى Trafikverket."], ["اختبار القيادة", "تجهيز نهائي قبل الاختبار العملي."], ["الرخصة!", "تهانينا، أصبحت سائقاً مرخصاً."]] },
  packages: { ...en.packages, tag: "الباقات والأسعار", title: "اختر الباقة المناسبة لك.", text: "كل الدروس مدتها 80 دقيقة وتشمل إرشاداً احترافياً وسيارات حديثة وخطة واضحة.", popular: "الأكثر طلباً", price: "السعر شامل الضريبة", buy: "شراء الباقة", help: "تحتاج إلى نصيحة؟", call: "اتصل بنا على", items: [["باقة البداية", "5 دروس قيادة (80 دقيقة)", ["5 دروس قيادة (80 دقيقة)", "باقة نظرية رقمية", "خطة دراسة شخصية"]], ["الباقة المتوسطة", "10 دروس قيادة (80 دقيقة) + Risk 1", ["10 دروس قيادة (80 دقيقة)", "Risk 1", "اختبارات نظرية غير محدودة", "استعارة سيارة للاختبار"]], ["الباقة المكثفة", "15 درس قيادة (80 دقيقة) + Risk 1 & 2", ["15 درس قيادة (80 دقيقة)", "Risk 1 & Risk 2", "باقة نظرية كاملة", "تحضير للاختبار"]], ["باقة متوسطة", "10 دروس قيادة (80 دقيقة) + Risk 1-2 + نظرية", ["10 دروس قيادة (80 دقيقة)", "Risk 1 & Risk 2", "تدريب نظري وتسجيل", "كتيب قيادة"]], ["باقة كبيرة", "15 درس قيادة (80 دقيقة) + Risk 1-2 + نظرية", ["15 درس قيادة (80 دقيقة)", "Risk 1 & Risk 2", "تدريب نظري وتسجيل", "كتيب قيادة"]], ["الباقة الكاملة", "25 درس قيادة (80 دقيقة) + Risk 1-2 + نظرية", ["25 درس قيادة (80 دقيقة)", "Risk 1 & Risk 2", "دورة مشرف", "أوقات أولوية", "استعارة سيارة للاختبار"]]] },
  quiz: { tag: "اختبر مهارات رخصة القيادة", title: "اختبر معلوماتك النظرية", text: "أجب عن بعض الأسئلة التدريبية قبل الاختبار الحقيقي.", question: "سؤال", result: "عرض النتيجة", next: "السؤال التالي", retry: "حاول مرة أخرى", good: "عمل رائع!", practice: "تدرّب أكثر قليلاً!", got: "حصلت على", of: "من", correct: "صحيح" },
  simulator: { tag: "تدرّب. تحسّن. انجح.", title: "اختبر مهاراتك في محاكي القيادة.", text: "تدرّب على رد الفعل والملاحظة والركن وإيقاع المرور في جلسات محاكاة واقعية.", start: "ابدأ المحاكي", city: "قيادة داخل المدينة", motorway: "الطريق السريع", night: "القيادة ليلاً" },
  braking: { tag: "تحضير Risk 2", title: "حاسبة مسافة التوقف", text: "اختبر كيف تؤثر حالة الطريق على مسافة التوقف. هذا ما تتعلمه عملياً في Risk 2.", variables: "المتغيرات وحالة الطريق", speed: "السرعة", choose: "اختر حالة الطريق", stopping: "مسافة التوقف", reaction: "رد الفعل", braking: "الفرملة", total: "الإجمالي", conditions: ["جليد / ثلج", "مبلل", "جاف", "حصى"] },
  reviews: { tag: "تقييمات Google", title: "ماذا يقول طلابنا؟", based: "بناءً على 124 تقييماً", verified: "موثق عبر Google" },
  visit: { tag: "اعثر علينا", title: "زرنا في ستوكهولم", text: "نحن في Sveavägen 122 بالقرب من محطة Rådmansgatan.", address: "العنوان", contact: "التواصل", hours: "ساعات العمل", open: "افتح الرابط" },
  final: { tag: "جاهز للبدء في ستوكهولم؟", title: "احجز أول درس واحصل على خطة شخصية لرخصة القيادة.", button: "احجز درسك", location: "ستوكهولم" },
  pay: { ...en.pay, title: "إكمال الدفع", successTitle: "تم الدفع", selected: "الباقة المختارة", contact: "بيانات التواصل", name: "الاسم", email: "البريد الإلكتروني", phone: "الهاتف", personal: "رقم الهوية الشخصية (YYYYMMDD-XXXX)", transmission: "اختر نوع ناقل الحركة", manual: "يدوي", automatic: "أوتوماتيك", notes: "ملاحظات اختيارية: هل قدت سابقاً أو حجزت اختباراً؟", method: "طريقة الدفع", card: "بطاقة", swish: "Swish", cardNumber: "رقم البطاقة", expiry: "MM / YY", secure: "دفع آمن ومشفر", pay: "ادفع", openSwish: "افتح Swish", processing: "جاري معالجة الدفع...", wait: "يرجى الانتظار أثناء التحقق من الدفع.", done: "تم الدفع!", thanks: "شكراً لحجزك. أرسلنا تأكيداً إلى بريدك الإلكتروني.", close: "إغلاق" },
  footer: { text: "تساعد Kornu Traffic School في ستوكهولم الطلاب الجدد على القيادة بثقة وأمان واستقلالية. التدريب متوفر بالسويدية والإنجليزية والعربية.", quick: "روابط سريعة", courses: "الدورات", contact: "التواصل", rights: "جميع الحقوق محفوظة.", city: "مدرسة قيادة في ستوكهولم" },
  about: { eyebrow: "من نحن", title: "Kornu Traffic School Stockholm", text: "نساعد الطلاب على أن يصبحوا سائقين واثقين من خلال باقات واضحة ودعم نظري وتخطيط حديث للدروس." },
  pages: {
    courses: ["الدورات", "تدريب رخصة القيادة لحياتك اليومية.", "دروس يدوي وأوتوماتيك ودورات مكثفة مع مدربين ذوي خبرة."],
    packages: ["الباقات والأسعار", "باقات واضحة بدون تعقيد.", "اختر باقة بداية أو باقة كاملة أو مكثفة، وسنساعدك في اختيار المستوى المناسب قبل الحجز."],
    gallery: ["المعرض", "طلاب وسيارات ولحظات من Kör Nu.", "معرض صور لمدرسة Kör Nu وطلابنا السعداء."],
    simulator: ["المحاكي", "تدرّب قبل أن تصبح حركة المرور حقيقية.", "تدرّب على رد الفعل والملاحظة والمدينة والطريق السريع والقيادة الليلية."],
    contact: ["التواصل", "تحدث معنا عن رخصة القيادة.", "تواصل معنا للباقات ودروس التجربة والتخطيط قبل الاختبار."],
  },
};

export const translations = { en, sv, ar };

const LanguageContext = createContext<{ lang: Lang; setLang: (lang: Lang) => void; t: typeof sv } | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => (localStorage.getItem("kornu-lang") as Lang) || "en");
  const t = translations[lang] || translations.en;

  const setLang = (next: Lang) => {
    localStorage.setItem("kornu-lang", next);
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
