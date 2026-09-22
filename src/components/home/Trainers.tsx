import { motion } from "framer-motion";

const trainers = [
  {
    name: "Abbe",
    experience: "12 years",
    role: "Traffic instructor B - founder",
    languages: "SV - EN - AR - KU",
    quote: "If your hands shake in the first lesson, you're exactly the kind of student I like to teach.",
    image: "/images/Bob.webp",
    position: "object-[50%_35%]",
  },
  {
    name: "Amran",
    experience: "9 years",
    role: "City driving - nerves",
    languages: "SV - EN - AR",
    quote: "We can take an empty parking lot as long as you need. The city can wait.",
    image: "/images/Amran.webp",
    position: "object-[50%_32%]",
  },
  {
    name: "Josef",
    experience: "14 years",
    role: "Highway & darkness",
    languages: "SV - EN",
    quote: "Approach is a rhythm, not a leap. We practise until it feels natural.",
    image: "/images/Josef.webp",
    position: "object-[50%_34%]",
  },
  {
    name: "Zana",
    experience: "8 years",
    role: "Intensive & exam",
    languages: "SV - EN - AR",
    quote: "Intense doesn't mean stressed. It means we don't waste a minute.",
    image: "/images/Zana.webp",
    position: "object-[50%_32%]",
  },
];

export function Trainers() {
  return (
    <section className="bg-[#f7fbf4] px-5 py-20 sm:px-8 sm:py-24 lg:px-12">
      <div className="mx-auto max-w-[1560px]">
        <div className="max-w-5xl">
          <p className="text-xs font-black uppercase tracking-[0.42em] text-primary sm:text-sm">
            Driving Instructor
          </p>
          <h2 className="mt-6 max-w-4xl font-serif text-[2.8rem] font-medium leading-[0.98] tracking-tight text-dark sm:text-6xl lg:text-7xl">
            People you actually want to sit{" "}
            <span className="italic text-primary">next to.</span>
          </h2>
        </div>

        <div className="mt-14 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:mt-20 lg:grid-cols-4">
          {trainers.map((trainer, index) => (
            <motion.article
              key={trainer.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-70px" }}
              transition={{ delay: index * 0.06, duration: 0.55 }}
              className="group"
            >
              <div className="aspect-[4/5] overflow-hidden rounded-[1.65rem] bg-primary-100 shadow-sm ring-1 ring-primary-200/60">
                <img
                  src={trainer.image}
                  alt={`${trainer.name}, Kornu driving instructor`}
                  className={`h-full w-full object-cover ${trainer.position} transition duration-700 group-hover:scale-[1.035]`}
                />
              </div>

              <div className="mt-7">
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="text-2xl font-black tracking-tight text-slate-950">
                    {trainer.name}
                  </h3>
                  <p className="shrink-0 text-sm font-bold text-slate-500">
                    {trainer.experience}
                  </p>
                </div>

                <p className="mt-2 text-lg font-semibold leading-7 text-primary">
                  {trainer.role}
                </p>
                <p className="mt-3 text-sm font-semibold leading-6 text-slate-500">
                  Language : {trainer.languages}
                </p>
                <p className="mt-5 font-serif text-xl italic leading-8 text-slate-600">
                  &ldquo; {trainer.quote} &rdquo;
                </p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
