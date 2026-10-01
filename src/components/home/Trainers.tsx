import { motion } from "framer-motion";
import { useLanguage } from "../../i18n";

export function Trainers() {
  const { site } = useLanguage();
  const { trainers, trainersText } = site;
  return (
    <section className="bg-[#f7fbf4] px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
      <div className="mx-auto max-w-[1560px]">
        {/* Section heading */}
        <div className="max-w-4xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-primary sm:text-xs">
            {trainersText.tag}
          </p>

          <h2 className="mt-5 max-w-3xl font-serif text-[2.35rem] font-medium leading-[1.05] tracking-tight text-dark sm:text-5xl lg:text-6xl">
            {trainersText.title}{" "}
            <span className="italic text-primary">{trainersText.highlight}</span>
          </h2>
        </div>

        {/* Trainers */}
        <div className="mt-12 grid gap-x-7 gap-y-12 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4">
          {trainers.map((trainer, index) => (
            <motion.article
              key={`${trainer.name}-${index}`}
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
                  alt={trainer.name}
                  style={{ objectPosition: trainer.position }}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.035]"
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
                  {trainersText.languagesLabel}: {trainer.languages}
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
