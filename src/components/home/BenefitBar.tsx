import { motion } from "framer-motion";
import { BENEFITS } from "../../data";
import { Icon } from "../Icon";

export function BenefitBar() {
  return (
    <section className="relative -mt-px border-t border-white/10 bg-[#05281F]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 divide-y divide-white/10 sm:grid-cols-2 sm:divide-x sm:divide-y-0 xl:grid-cols-4">
          {BENEFITS.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.45,
                delay: index * 0.08,
              }}
              className="group flex items-center gap-4 px-4 py-5 transition-all duration-300 hover:bg-white/[0.04] sm:px-5 lg:px-6"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20 transition group-hover:scale-110">
                <Icon
                  name={benefit.icon}
                  className="h-5 w-5"
                />
              </div>

              <div className="min-w-0">
                <h3 className="text-[15px] font-semibold text-white">
                  {benefit.title}
                </h3>

                <p className="mt-1 line-clamp-2 text-sm leading-6 text-white/65">
                  {benefit.text}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}