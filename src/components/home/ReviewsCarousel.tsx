import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useLanguage, type Lang } from "../../i18n";

type GoogleReview = {
  id: string;
  author: string;
  photo: string | null;
  rating: number;
  text: string;
  createTime: string;
};

type GoogleReviewsResponse = {
  averageRating: number | null;
  totalReviewCount: number | null;
  reviews: GoogleReview[];
};

type GoogleReviewsSummary = Pick<GoogleReviewsResponse, "averageRating" | "totalReviewCount">;

const VERIFIED_GOOGLE_REVIEWS: GoogleReview[] = [
  {
    id: "vedran-m",
    author: "Vedran M.",
    photo: null,
    rating: 5,
    text: "Jätte bra trafikskola, med ännu bättre lärare!! Rekommenderar starkt",
    createTime: "11 feb. 2026",
  },
  {
    id: "ahmed-sohael",
    author: "Ahmed Sohael",
    photo: null,
    rating: 5,
    text: "Great Traffic School. Got my license finally. Ahmed and all instructors will help you alot :)",
    createTime: "5 feb. 2026",
  },
  {
    id: "venugopal-nair",
    author: "Venugopal Nair",
    photo: null,
    rating: 5,
    text: "A big thank you to Abbe and Lena for their valuable feedback and insights on my driving – it truly helped me earn my driving license!\n\nI’d also like to express my appreciation to Kör Nu Trafikskola for arranging lessons on such short notice. I highly recommend the school to anyone looking for personalised driving instruction. Hopefully, they’ll be able to accommodate based on availability.",
    createTime: "a year ago",
  },
  {
    id: "syed-umer-bukhari",
    author: "Syed Umer Bukhari",
    photo: null,
    rating: 5,
    text: "Finally got my driving licence! Highly recommend Kör.nu!\n\nHuge thanks to Ahmed for his support and for arranging lessons at short notice, and to Illi for her excellent teaching and patience.\n\nThey focus on your weak areas without pushing unnecessary lessons.\n\nBig plus: you can practise some classes in the actual test car, like the Volvo XC40, which really helps build confidence!\n\nFriendly, professional, and genuinely focused on helping you become a safe driver. 🚗",
    createTime: "4 weeks ago",
  },
  {
    id: "sharon-francis",
    author: "Sharon Francis",
    photo: null,
    rating: 5,
    text: "I would highly recommend KörNu trafikskola if you want to pass the driving test in the first attempt. Proffessional way of teaching. All the teachers have good practical knowledge. Special mention to Lena, Diyar and Husam. The tips and the technique they teach really works on the road. They don’t just focus on making you pass the driving test, but train you to be a better driver overall. Trafic school is also flexible in scheduling the classes. Each 80 mins training lessons they have is worth it.",
    createTime: "6 months ago",
  },
  {
    id: "semih-temo",
    author: "Semih Temo",
    photo: null,
    rating: 5,
    text: "I started from scratch with them, and they are excellent; the management and instructors are cooperative, understanding, and experienced. I recommend coming here to anyone who wants to get a driver's license.",
    createTime: "Edited a month ago",
  },
  {
    id: "hilda-hao",
    author: "Hilda HAO",
    photo: null,
    rating: 5,
    text: "I got my driving license yesterday🥳\n\nI would like to share my experience of Körnu for supporting me throughout this journey, and especially for assigning me such an excellent coach, Lena.\n\nLena has been professional, organized, and dedicated. She created a clear and personalized plan for my driving practice, and she was always flexible with scheduling, even in very early morning to fit my needs.\n\nShe gave me clear explanations when I made mistakes, and she always encouraged me when I did things right. That constant balance of support and constructive feedback really helped build my confidence behind the wheel.\n\nI highly recommend Körnu to anyone working toward your driving license.\nGood luck 🍀",
    createTime: "a year ago",
  },
  {
    id: "chamara-kanchana-wimalachandra",
    author: "Chamara Kanchana Wimalachandra",
    photo: null,
    rating: 5,
    text: "I passed my manual driving license! My instructor, Mrs. Lena, was fantastic—she is a very intelligent and skilled driving instructor. The management team was also supportive throughout the process. I highly recommend this school for their flexibility and great service. Good luck to all the other students!",
    createTime: "10 months ago",
  },
  {
    id: "kanika-saxena",
    author: "Kanika Saxena",
    photo: null,
    rating: 5,
    text: "I had a fantastic experience with kör nu. My instructor Lena was patient, encouraging, and truly invested in my progress. One thing I really appreciated was that she didn’t hesitate to take me onto high-speed roads. This really helped me overcome my fears and built my confidence much faster than I expected. She constantly motivated me, celebrated my small improvements, and made me believe I could do it. The lessons were well-structured, the car was always in great condition, and scheduling was flexible. Thanks to their guidance and support, I now feel confident behind the wheel and obtained my driving license. I highly recommend Körnu to anyone wanting to learn driving!",
    createTime: "a year ago",
  },
  {
    id: "aswathi-chakrapani",
    author: "Aswathi Chakrapani",
    photo: null,
    rating: 5,
    text: "I had the best experience with Kör nu driving school. Their theory material and two wonderful teachers Peter and Lena helped me pass the theory as well as practical test in the first attempt. I took close to 15 hours driving classes and waited for them to tell me I am ready for the test and I took it slow and steady which really helped. More than passing the test, they both has inspired me a lot to be a good driver putting safety and others first.",
    createTime: "Edited a year ago",
  },
];

const REVIEW_TRANSLATIONS: Record<string, Record<Lang, { text: string; time: string }>> = {
  "vedran-m": {
    sv: { text: "Jätte bra trafikskola, med ännu bättre lärare!! Rekommenderar starkt", time: "11 feb. 2026" },
    en: { text: "Really great driving school, with even better teachers!! Highly recommend.", time: "11 Feb 2026" },
    ar: { text: "مدرسة قيادة رائعة جداً، ومعلمون أفضل!! أوصي بها بشدة.", time: "11 فبراير 2026" },
  },
  "ahmed-sohael": {
    sv: { text: "Fantastisk trafikskola. Jag fick äntligen mitt körkort. Ahmed och alla lärare hjälper dig jättemycket :)", time: "5 feb. 2026" },
    en: { text: "Great Traffic School. Got my license finally. Ahmed and all instructors will help you alot :)", time: "5 Feb 2026" },
    ar: { text: "مدرسة قيادة رائعة. حصلت أخيراً على رخصتي. أحمد وجميع المدربين سيقدمون لك الكثير من المساعدة :)", time: "5 فبراير 2026" },
  },
  "venugopal-nair": {
    sv: { text: "Stort tack till Abbe och Lena för deras värdefulla återkoppling och insikter om min körning – det hjälpte mig verkligen att ta körkort!\n\nJag vill också tacka Kör Nu Trafikskola för att de ordnade lektioner med så kort varsel. Jag rekommenderar varmt skolan till alla som söker personlig körundervisning. Förhoppningsvis kan de ordna tider i mån av tillgänglighet.", time: "för ett år sedan" },
    en: { text: "A big thank you to Abbe and Lena for their valuable feedback and insights on my driving – it truly helped me earn my driving license!\n\nI’d also like to express my appreciation to Kör Nu Trafikskola for arranging lessons on such short notice. I highly recommend the school to anyone looking for personalised driving instruction. Hopefully, they’ll be able to accommodate based on availability.", time: "a year ago" },
    ar: { text: "جزيل الشكر لعبّي ولينا على ملاحظاتهما القيّمة ونصائحهما حول قيادتي؛ فقد ساعدتني حقاً في الحصول على رخصة القيادة!\n\nكما أود أن أشكر مدرسة Kör Nu Trafikskola على ترتيب الدروس في وقت قصير. أوصي بالمدرسة بشدة لكل من يبحث عن تعليم قيادة شخصي. آمل أن يتمكنوا من توفير المواعيد حسب التوافر.", time: "منذ عام" },
  },
  "syed-umer-bukhari": {
    sv: { text: "Jag fick äntligen mitt körkort! Rekommenderar Kör.nu varmt!\n\nStort tack till Ahmed för stödet och för att han ordnade lektioner med kort varsel, och till Illi för hennes utmärkta undervisning och tålamod.\n\nDe fokuserar på dina svaga områden utan att pressa dig till onödiga lektioner.\n\nEtt stort plus är att du kan öva vissa lektioner i den riktiga provbilen, till exempel Volvo XC40, vilket verkligen bygger självförtroende!\n\nVänliga och professionella, med ett genuint fokus på att hjälpa dig bli en säker förare. 🚗", time: "för 4 veckor sedan" },
    en: { text: "Finally got my driving licence! Highly recommend Kör.nu!\n\nHuge thanks to Ahmed for his support and for arranging lessons at short notice, and to Illi for her excellent teaching and patience.\n\nThey focus on your weak areas without pushing unnecessary lessons.\n\nBig plus: you can practise some classes in the actual test car, like the Volvo XC40, which really helps build confidence!\n\nFriendly, professional, and genuinely focused on helping you become a safe driver. 🚗", time: "4 weeks ago" },
    ar: { text: "حصلت أخيراً على رخصة القيادة! أوصي بـ Kör.nu بشدة!\n\nجزيل الشكر لأحمد على دعمه وترتيب الدروس في وقت قصير، ولإيلي على تعليمها الممتاز وصبرها.\n\nيركزون على نقاط ضعفك دون الضغط عليك لأخذ دروس غير ضرورية.\n\nومن المزايا الكبيرة إمكانية التدرب في بعض الدروس بسيارة الاختبار الفعلية، مثل Volvo XC40، مما يساعد حقاً على بناء الثقة!\n\nفريق ودود ومحترف ويركز بصدق على مساعدتك لتصبح سائقاً آمناً. 🚗", time: "منذ 4 أسابيع" },
  },
  "sharon-francis": {
    sv: { text: "Jag rekommenderar KörNu Trafikskola varmt om du vill klara körprovet på första försöket. Professionell undervisning och alla lärare har god praktisk kunskap. Särskilt tack till Lena, Diyar och Husam. Tipsen och tekniken de lär ut fungerar verkligen ute på vägen. De fokuserar inte bara på att du ska klara provet, utan utbildar dig också till en bättre förare. Trafikskolan är flexibel med schemaläggningen. Varje 80-minuterslektion är värd det.", time: "för 6 månader sedan" },
    en: { text: "I would highly recommend KörNu trafikskola if you want to pass the driving test in the first attempt. Proffessional way of teaching. All the teachers have good practical knowledge. Special mention to Lena, Diyar and Husam. The tips and the technique they teach really works on the road. They don’t just focus on making you pass the driving test, but train you to be a better driver overall. Trafic school is also flexible in scheduling the classes. Each 80 mins training lessons they have is worth it.", time: "6 months ago" },
    ar: { text: "أوصي بشدة بمدرسة KörNu لتعليم القيادة إذا كنت ترغب في اجتياز اختبار القيادة من المحاولة الأولى. أسلوب التدريس احترافي وجميع المعلمين لديهم خبرة عملية جيدة. شكر خاص لـ Lena وDiyar وHusam. النصائح والتقنيات التي يعلمونها مفيدة فعلاً على الطريق. لا يركزون فقط على نجاحك في الاختبار، بل يدربونك لتصبح سائقاً أفضل بشكل عام. كما أن المدرسة مرنة في جدولة الدروس. كل درس تدريبي مدته 80 دقيقة يستحق ذلك.", time: "منذ 6 أشهر" },
  },
  "semih-temo": {
    sv: { text: "Jag började från grunden och de är utmärkta; ledningen och instruktörerna är hjälpsamma, förstående och erfarna. Jag rekommenderar alla som vill ta körkort att komma hit.", time: "redigerad för en månad sedan" },
    en: { text: "I started from scratch with them, and they are excellent; the management and instructors are cooperative, understanding, and experienced. I recommend coming here to anyone who wants to get a driver's license.", time: "Edited a month ago" },
    ar: { text: "بدأت معهم من الصفر، وهم ممتازون؛ فالإدارة والمدربون متعاونون ومتفهّمون وذوو خبرة. أوصي كل من يريد الحصول على رخصة قيادة بالدراسة هنا.", time: "تم التعديل قبل شهر" },
  },
  "hilda-hao": {
    sv: { text: "Jag fick mitt körkort igår🥳\n\nJag vill dela med mig av min upplevelse av Körnu, som stöttade mig under hela resan, och särskilt tacka för att jag fick en så utmärkt lärare som Lena.\n\nLena var professionell, strukturerad och engagerad. Hon skapade en tydlig och personlig plan för min körträning och var alltid flexibel med tiderna, även tidiga morgnar när det passade mig.\n\nHon förklarade tydligt när jag gjorde misstag och uppmuntrade mig alltid när jag gjorde rätt. Den balansen mellan stöd och konstruktiv feedback hjälpte mig verkligen att bygga självförtroende bakom ratten.\n\nJag rekommenderar Körnu varmt till alla som tar körkort.\nLycka till 🍀", time: "för ett år sedan" },
    en: { text: "I got my driving license yesterday🥳\n\nI would like to share my experience of Körnu for supporting me throughout this journey, and especially for assigning me such an excellent coach, Lena.\n\nLena has been professional, organized, and dedicated. She created a clear and personalized plan for my driving practice, and she was always flexible with scheduling, even in very early morning to fit my needs.\n\nShe gave me clear explanations when I made mistakes, and she always encouraged me when I did things right. That constant balance of support and constructive feedback really helped build my confidence behind the wheel.\n\nI highly recommend Körnu to anyone working toward your driving license.\nGood luck 🍀", time: "a year ago" },
    ar: { text: "حصلت على رخصة القيادة بالأمس🥳\n\nأود أن أشارك تجربتي مع Körnu التي دعمتني طوال هذه الرحلة، وأشكرهم بشكل خاص على تعييني معلمة ممتازة مثل Lena.\n\nكانت Lena محترفة ومنظمة ومخلصة. أعدّت لي خطة واضحة وشخصية للتدرب على القيادة، وكانت مرنة دائماً في المواعيد، حتى في الصباح الباكر بما يناسب احتياجاتي.\n\nكانت تشرح أخطائي بوضوح وتشجعني دائماً عندما أقوم بالأمور بشكل صحيح. هذا التوازن المستمر بين الدعم والملاحظات البنّاءة ساعدني كثيراً على بناء ثقتي خلف المقود.\n\nأوصي بشدة بـ Körnu لكل من يسعى للحصول على رخصة القيادة.\nحظاً موفقاً 🍀", time: "منذ عام" },
  },
  "chamara-kanchana-wimalachandra": {
    sv: { text: "Jag klarade mitt manuella körprov! Min lärare, Lena, var fantastisk – en mycket kunnig och skicklig trafiklärare. Ledningen var också ett stort stöd under hela processen. Jag rekommenderar varmt skolan för dess flexibilitet och fina service. Lycka till alla andra elever!", time: "för 10 månader sedan" },
    en: { text: "I passed my manual driving license! My instructor, Mrs. Lena, was fantastic—she is a very intelligent and skilled driving instructor. The management team was also supportive throughout the process. I highly recommend this school for their flexibility and great service. Good luck to all the other students!", time: "10 months ago" },
    ar: { text: "اجتزت اختبار القيادة للسيارة اليدوية! كانت معلمتي، السيدة Lena، رائعة؛ فهي ذكية جداً وماهرة في تعليم القيادة. كما كان فريق الإدارة داعماً طوال العملية. أوصي بشدة بهذه المدرسة لما تتميز به من مرونة وخدمة ممتازة. أتمنى التوفيق لجميع الطلاب الآخرين!", time: "منذ 10 أشهر" },
  },
  "kanika-saxena": {
    sv: { text: "Jag hade en fantastisk upplevelse med Kör Nu. Min lärare Lena var tålmodig, uppmuntrande och verkligen engagerad i mina framsteg. Jag uppskattade särskilt att hon tog med mig ut på vägar med högre hastigheter. Det hjälpte mig att övervinna min rädsla och bygga självförtroende snabbare än väntat. Hon motiverade mig hela tiden, uppmärksammade mina framsteg och fick mig att tro på mig själv. Lektionerna var välstrukturerade, bilen var alltid i gott skick och schemaläggningen flexibel. Tack vare deras stöd känner jag mig trygg bakom ratten och har nu körkort. Jag rekommenderar Körnu varmt!", time: "för ett år sedan" },
    en: { text: "I had a fantastic experience with kör nu. My instructor Lena was patient, encouraging, and truly invested in my progress. One thing I really appreciated was that she didn’t hesitate to take me onto high-speed roads. This really helped me overcome my fears and built my confidence much faster than I expected. She constantly motivated me, celebrated my small improvements, and made me believe I could do it. The lessons were well-structured, the car was always in great condition, and scheduling was flexible. Thanks to their guidance and support, I now feel confident behind the wheel and obtained my driving license. I highly recommend Körnu to anyone wanting to learn driving!", time: "a year ago" },
    ar: { text: "كانت تجربتي مع Kör Nu رائعة. كانت معلمتي Lena صبورة ومشجعة ومهتمة حقاً بتقدمي. وقدّرت كثيراً أنها لم تتردد في أخذي إلى الطرق السريعة. ساعدني ذلك على التغلب على مخاوفي وبناء ثقتي بنفسي أسرع بكثير مما توقعت. كانت تحفزني باستمرار وتحتفي بتحسناتي الصغيرة وتجعلني أؤمن بقدرتي. كانت الدروس منظمة جيداً، والسيارة بحالة ممتازة دائماً، والمواعيد مرنة. بفضل توجيههم ودعمهم أصبحت واثقة خلف المقود وحصلت على رخصة القيادة. أوصي بشدة بـ Körnu لكل من يرغب في تعلم القيادة!", time: "منذ عام" },
  },
  "aswathi-chakrapani": {
    sv: { text: "Jag hade den bästa upplevelsen på Kör Nu trafikskola. Teorimaterialet och de två fantastiska lärarna Peter och Lena hjälpte mig att klara både teoriprovet och körprovet på första försöket. Jag tog nästan 15 timmars körlektioner och väntade på att de skulle säga att jag var redo för provet. Jag tog det lugnt och metodiskt, vilket hjälpte mycket. Viktigare än att klara provet är att de inspirerade mig att bli en bra förare som sätter säkerheten och andra först.", time: "redigerad för ett år sedan" },
    en: { text: "I had the best experience with Kör nu driving school. Their theory material and two wonderful teachers Peter and Lena helped me pass the theory as well as practical test in the first attempt. I took close to 15 hours driving classes and waited for them to tell me I am ready for the test and I took it slow and steady which really helped. More than passing the test, they both has inspired me a lot to be a good driver putting safety and others first.", time: "Edited a year ago" },
    ar: { text: "كانت تجربتي في مدرسة Kör Nu لتعليم القيادة هي الأفضل. ساعدتني المواد النظرية والمعلمان الرائعان Peter وLena على اجتياز الاختبار النظري والعملي من المحاولة الأولى. أخذت ما يقارب 15 ساعة من دروس القيادة وانتظرت حتى يخبراني بأنني أصبحت مستعدة للاختبار. تقدمت بهدوء وثبات، وهذا ساعدني كثيراً. والأهم من اجتياز الاختبار أنهما ألهماني لأكون سائقة جيدة تضع السلامة والآخرين في المقام الأول.", time: "تم التعديل قبل عام" },
  },
};

function isGoogleReviewsResponse(value: unknown): value is GoogleReviewsResponse {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<GoogleReviewsResponse>;
  return Array.isArray(candidate.reviews);
}

function Arrow({ direction }: { direction: "previous" | "next" }) {
  return (
    <svg className={`h-5 w-5 ${direction === "previous" ? "rotate-180" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5 12h14M13 5l7 7-7 7" />
    </svg>
  );
}

export function ReviewsCarousel() {
  const { t, site, lang } = useLanguage();
  const [googleSummary, setGoogleSummary] = useState<GoogleReviewsSummary | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/google-reviews")
      .then(async (response) => {
        const payload: unknown = await response.json();
        if (!response.ok || !isGoogleReviewsResponse(payload)) {
          throw new Error("Google reviews are unavailable.");
        }
        if (!cancelled) {
          setGoogleSummary({
            averageRating: payload.averageRating,
            totalReviewCount: payload.totalReviewCount,
          });
        }
      })
      .catch((error: unknown) => {
        if (!cancelled) console.warn("[reviews] Using local review content because Google reviews could not be loaded.", error);
      });
    return () => { cancelled = true; };
  }, []);

  const reviews = VERIFIED_GOOGLE_REVIEWS;
  useEffect(() => {
    if (paused || reviews.length < 2) return;
    const timer = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % reviews.length);
    }, 5000);
    return () => window.clearInterval(timer);
  }, [paused, reviews.length]);

  const averageRating = googleSummary?.averageRating ?? 5;
  const reviewCount = googleSummary?.totalReviewCount;
  const count = reviewCount ?? 168;
  const reviewLabel = lang === "sv" ? "Google-recensioner" : lang === "ar" ? "تقييمات Google" : "Google Reviews";
  const locale = lang === "sv" ? "sv-SE" : lang === "ar" ? "ar" : "en-GB";
  const visibleReviews = [0, 1, 2].map((offset) => reviews[(activeIndex + offset) % reviews.length]).filter((review): review is GoogleReview => Boolean(review));

  const move = (offset: number) => {
    setActiveIndex((index) => (index + offset + reviews.length) % reviews.length);
  };

  return (
    <section className="relative z-10 overflow-hidden border-y border-slate-100 bg-white py-14 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <span className="text-xs font-black uppercase tracking-wider text-slate-500">{t.reviews.tag}</span>
          <h2 className="mt-2 text-3xl font-black tracking-tight text-primary-dark">{t.reviews.title}</h2>
        </div>

        <div
          className="grid items-center gap-5 lg:grid-cols-[190px_40px_minmax(0,1fr)_40px]"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={() => setPaused(false)}
        >
          <a href={site.reviewsUrl} target="_blank" rel="noopener noreferrer" className="text-center transition hover:opacity-80 lg:text-left">
            <p className="font-extrabold text-slate-900">{site.siteName}</p>
            <p className="mt-1 text-2xl leading-none tracking-tight text-amber-400" aria-label={`${averageRating} out of 5 stars`}>★★★★★</p>
            <p className="mt-1 text-sm font-bold text-slate-700">{averageRating.toFixed(1)} / 5</p>
            <p className="mt-1 text-sm font-semibold text-slate-600">{count ? `${count} ${reviewLabel}` : reviewLabel}</p>
            <span className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-primary-dark">
              {t.reviews.verified}
              <span className="font-black text-[#4285F4]" aria-hidden="true">G</span>
            </span>
          </a>

          <button type="button" onClick={() => move(-1)} aria-label="Previous reviews" className="hidden h-10 w-10 place-items-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-primary-dark lg:grid">
            <Arrow direction="previous" />
          </button>

          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="grid gap-4 sm:grid-cols-3"
          >
            {visibleReviews.map((review, index) => (
              <article key={review.id} className={`min-w-0 rounded-2xl bg-slate-50 p-5 ${index > 0 ? "hidden sm:block" : ""}`}>
                <div className="flex items-center gap-3">
                  {review.photo ? (
                    <img src={review.photo} alt="" className="h-11 w-11 rounded-full object-cover" />
                  ) : (
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-primary-900 text-sm font-bold text-white">
                      {review.author.split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase()}
                    </span>
                  )}
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-sm font-extrabold text-slate-800">{review.author}</h3>
                    <p className="truncate text-xs text-slate-500">
                      {REVIEW_TRANSLATIONS[review.id]?.[lang].time ?? (
                        Number.isNaN(Date.parse(review.createTime))
                          ? review.createTime
                          : new Date(review.createTime).toLocaleDateString(locale, { day: "numeric", month: "short", year: "numeric" })
                      )}
                    </p>
                  </div>
                  <span className="font-black text-[#4285F4]" aria-label="Google review">G</span>
                </div>
                <p className="mt-3 text-lg leading-none tracking-tight text-amber-400" aria-label={`${review.rating} out of 5 stars`}>{"★".repeat(Math.max(0, Math.min(5, review.rating)))}</p>
                {review.text && <p className="mt-3 line-clamp-4 min-h-20 whitespace-pre-line text-sm leading-6 text-slate-700">{REVIEW_TRANSLATIONS[review.id]?.[lang].text ?? review.text}</p>}
              </article>
            ))}
          </motion.div>

          <button type="button" onClick={() => move(1)} aria-label="Next reviews" className="hidden h-10 w-10 place-items-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-primary-dark lg:grid">
            <Arrow direction="next" />
          </button>
        </div>

        <div className="mt-6 flex items-center justify-center gap-2">
          <button type="button" onClick={() => move(-1)} aria-label="Previous reviews" className="grid h-9 w-9 place-items-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-primary-dark lg:hidden">
            <Arrow direction="previous" />
          </button>
          {reviews.map((review, index) => (
            <button
              key={review.id}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`Show review ${index + 1}`}
              aria-current={index === activeIndex}
              className={`h-2 rounded-full transition-all ${index === activeIndex ? "w-6 bg-primary" : "w-2 bg-slate-300"}`}
            />
          ))}
          <button type="button" onClick={() => move(1)} aria-label="Next reviews" className="grid h-9 w-9 place-items-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-primary-dark lg:hidden">
            <Arrow direction="next" />
          </button>
        </div>
      </div>
    </section>
  );
}
