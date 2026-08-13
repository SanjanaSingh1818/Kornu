import { useMemo, useState } from "react";
import { useLanguage } from "../../i18n";

type Question = {
  id: number;
  category: string;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
};

const QUESTIONS: Question[] = [
  { id: 1, category: "Vägmärken", question: "Vad innebär ett rött runt märke med en vit horisontell balk?", options: ["Stopp", "Förbud mot all trafik", "Förbud att stanna", "Motorväg slutar"], correct: 0, explanation: "Det röda runda märket med vit balk betyder stopp. Du måste stanna helt." },
  { id: 2, category: "Vägmärken", question: "Vilket märke anger att du har väjningsplikt?", options: ["Röd cirkel", "Gul romb", "Vit triangel med röd kant", "Blå fyrkant"], correct: 2, explanation: "Den vita triangeln med röd kant och spets nedåt är väjningspliktsmärket." },
  { id: 3, category: "Trafikregler", question: "I en okontrollerad korsning, vem har företräde?", options: ["Den som kör fortast", "Fordon från vänster", "Fordon från höger", "Den som kom först"], correct: 2, explanation: "Högerregeln gäller när inget annat anges." },
  { id: 4, category: "Hastighet & Säkerhet", question: "Hur ökar bromssträckan om du dubblar hastigheten?", options: ["Dubbelt", "Tre gånger", "Fyra gånger", "Lika mycket"], correct: 2, explanation: "Bromssträckan ökar med kvadraten på hastigheten." },
  { id: 5, category: "Alkohol & Droger", question: "Var går promillegränsen för rattfylleri i Sverige?", options: ["0,5 promille", "0,2 promille", "0,8 promille", "1,0 promille"], correct: 1, explanation: "Gränsen för rattfylleri i Sverige är 0,2 promille." },
  { id: 6, category: "Riskutbildning", question: "Vad handlar Risktvåan om?", options: ["Alkohol och droger", "Halkbana och praktisk riskkörning", "Teoriprov", "Handledarkurs"], correct: 1, explanation: "Risktvåan är praktisk och handlar bland annat om halka, bromsning och sladd." },
  { id: 7, category: "Förarprovet", question: "Hur många frågor måste du ha rätt på teoriprovet?", options: ["45 av 65", "52 av 65", "55 av 65", "60 av 65"], correct: 1, explanation: "Du behöver 52 rätt av 65 frågor för att bli godkänd." },
  { id: 8, category: "Säkerhet", question: "Vad är defensiv körning?", options: ["Köra fort", "Förutse risker och anpassa körningen", "Köra nära bilen framför", "Använda mobiltelefon"], correct: 1, explanation: "Defensiv körning betyder att du planerar, håller avstånd och undviker onödiga risker." },
];

const CATEGORIES = ["Alla", ...Array.from(new Set(QUESTIONS.map((q) => q.category)))];

function pickQuestions(category: string) {
  const pool = category === "Alla" ? QUESTIONS : QUESTIONS.filter((q) => q.category === category);
  return [...pool].sort(() => Math.random() - 0.5).slice(0, Math.min(6, pool.length));
}

export function TheoryQuiz() {
  const { t } = useLanguage();
  const [category, setCategory] = useState("Alla");
  const [questions, setQuestions] = useState(() => pickQuestions("Alla"));
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const current = questions[index];
  const pct = useMemo(() => Math.round((score / questions.length) * 100), [questions.length, score]);

  const restart = (nextCategory = category) => {
    setCategory(nextCategory);
    setQuestions(pickQuestions(nextCategory));
    setIndex(0);
    setSelected(null);
    setScore(0);
    setDone(false);
  };

  const answer = (option: number) => {
    if (selected !== null) return;
    setSelected(option);
    if (option === current.correct) setScore((value) => value + 1);
  };

  if (done) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-sm">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-primary-50 text-3xl">🏆</div>
        <h3 className="mt-4 text-xl font-black text-primary-dark">{pct >= 70 ? t.quiz.good : t.quiz.practice}</h3>
        <p className="mt-1 text-sm font-medium text-slate-500">{t.quiz.got} <strong className="text-primary-dark">{score} {t.quiz.of} {questions.length}</strong> {t.quiz.correct} ({pct}%).</p>
        <div className="mx-auto mt-4 h-2 max-w-sm overflow-hidden rounded-full bg-slate-100">
          <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${pct}%` }} />
        </div>
        <button onClick={() => restart()} className="mt-5 rounded-xl bg-primary px-5 py-2.5 text-xs font-black text-white shadow transition hover:bg-primary-600">
          {t.quiz.retry}
        </button>
      </div>
    );
  }

  return (
    <section className="relative z-10 bg-primary-50 px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-4xl">
        <div className="mx-auto mb-8 max-w-2xl text-center">
          <span className="rounded-full border border-primary-100 bg-white px-3.5 py-1.5 text-xs font-black uppercase tracking-wider text-primary-dark">{t.quiz.tag}</span>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-primary-dark">{t.quiz.title}</h2>
          <p className="mt-2 text-sm font-medium leading-6 text-slate-500">{t.quiz.text}</p>
        </div>

        <div className="mb-4 flex flex-wrap items-center gap-2">
          {CATEGORIES.map((item) => (
            <button key={item} onClick={() => restart(item)} className={`rounded-full border px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider transition ${category === item ? "border-primary bg-primary text-white" : "border-slate-200 bg-white text-slate-600 hover:border-primary-200"}`}>
              {item}
            </button>
          ))}
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-500">
            <span>{t.quiz.question} {index + 1} / {questions.length}</span>
            <span className="rounded-full border border-primary-100 bg-primary-50 px-2 py-1 text-primary">{current.category}</span>
          </div>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100">
            <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${((index + 1) / questions.length) * 100}%` }} />
          </div>
          <h3 className="mt-5 text-base font-extrabold leading-snug text-primary-dark">{current.question}</h3>
          <div className="mt-5 space-y-2.5">
            {current.options.map((option, optionIndex) => {
              const answered = selected !== null;
              const isCorrect = optionIndex === current.correct;
              const isWrong = answered && optionIndex === selected && !isCorrect;
              return (
                <button key={option} onClick={() => answer(optionIndex)} disabled={answered} className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-xs font-semibold transition ${isCorrect && answered ? "border-primary bg-primary-50 text-primary-dark" : isWrong ? "border-red-300 bg-red-50 text-red-700" : "border-slate-200 bg-white text-slate-700 hover:border-primary-200 hover:bg-slate-50"}`}>
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full border border-current text-[10px] font-black">{String.fromCharCode(65 + optionIndex)}</span>
                  <span className="flex-1">{option}</span>
                </button>
              );
            })}
          </div>
          {selected !== null && (
            <>
              <div className="mt-4 rounded-xl border border-primary-100 bg-primary-50 p-4 text-xs font-medium leading-6 text-primary-dark">{current.explanation}</div>
              <button onClick={() => index + 1 >= questions.length ? setDone(true) : (setIndex((value) => value + 1), setSelected(null))} className="mt-4 rounded-xl bg-primary px-5 py-2.5 text-xs font-black text-white shadow transition hover:bg-primary-600">
                {index + 1 >= questions.length ? t.quiz.result : t.quiz.next}
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
