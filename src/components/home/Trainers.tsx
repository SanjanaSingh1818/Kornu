
import { motion } from "framer-motion";

const trainers = [
  {
    name: "Abbe",
    experience: "12 år",
    role: "Trafiklärare B – grundare",
    languages: "SV – EN – AR – KU",
    quote:
      "Om händerna skakar på första lektionen är du precis den elev jag tycker om att undervisa.",
    image: "/images/Bob.webp",
    position: "object-[50%_35%]",
  },
  {
    name: "Amran",
    experience: "9 år",
    role: "Stadskörning – nervositet",
    languages: "SV – EN – AR",
    quote:
      "Vi kan stanna på en tom parkering så länge du behöver. Staden kan vänta.",
    image: "/images/Amran.webp",
    position: "object-[50%_32%]",
  },
  {
    name: "Josef",
    experience: "14 år",
    role: "Motorväg & mörkerkörning",
    languages: "SV – EN",
    quote:
      "Påfarten handlar om rytm, inte om att kasta sig in. Vi tränar tills det känns naturligt.",
    image: "/images/Josef.webp",
    position: "object-[50%_34%]",
  },
  {
    name: "Zana",
    experience: "8 år",
    role: "Intensivkurs & uppkörning",
    languages: "SV – EN – AR",
    quote:
      "Intensivt betyder inte stressigt. Det betyder att vi tar vara på varje minut.",
    image: "/images/Zana.webp",
    position: "object-[50%_32%]",
  },
];

export function Trainers() {
  return (
    <section className="bg-[#f7fbf4] px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
      <div className="mx-auto max-w-[1560px]">
        {/* Section heading */}
        <div className="max-w-4xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-primary sm:text-xs">
            Våra trafiklärare
          </p>

          <h2 className="mt-5 max-w-3xl font-serif text-[2.35rem] font-medium leading-[1.05] tracking-tight text-dark sm:text-5xl lg:text-6xl">
            Människor du faktiskt vill sitta{" "}
            <span className="italic text-primary">bredvid.</span>
          </h2>
        </div>

        {/* Trainers */}
        <div className="mt-12 grid gap-x-7 gap-y-12 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4">
          {trainers.map((trainer, index) => (
            <motion.article
              key={trainer.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-70px" }}
              transition={{
                delay: index * 0.06,
                duration: 0.5,
                ease: "easeOut",
              }}
              className="group"
            >
              {/* Image */}
              <div className="aspect-[4/5] overflow-hidden rounded-[1.5rem] bg-primary-100 shadow-sm ring-1 ring-primary-200/60">
                <img
                  src={trainer.image}
                  alt={`${trainer.name}, trafiklärare på Kornu`}
                  className={`h-full w-full object-cover ${trainer.position} transition duration-700 group-hover:scale-[1.035]`}
                />
              </div>

              {/* Content */}
              <div className="mt-6">
                {/* Name + experience */}
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="text-xl font-semibold tracking-tight text-slate-950 sm:text-[1.4rem]">
                    {trainer.name}
                  </h3>

                  <p className="shrink-0 text-xs font-medium text-slate-500 sm:text-sm">
                    {trainer.experience}
                  </p>
                </div>

                {/* Role */}
                <p className="mt-2 text-base font-medium leading-6 text-primary sm:text-[1.05rem]">
                  {trainer.role}
                </p>

                {/* Languages */}
                <p className="mt-2.5 text-xs font-medium tracking-wide text-slate-500 sm:text-sm">
                  Språk: {trainer.languages}
                </p>

                {/* Quote */}
                <p className="mt-4 font-serif text-[1.05rem] italic leading-7 text-slate-600 sm:text-lg sm:leading-7">
                  “{trainer.quote}”
                </p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
