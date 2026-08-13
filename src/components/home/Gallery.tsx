import { motion } from "framer-motion";
import { GALLERY_IMAGES } from "../../data";
import { useLanguage } from "../../i18n";
import { Icon } from "../Icon";

export function Gallery({ preview = false }: { preview?: boolean }) {
  const { t } = useLanguage();
  const images = preview ? GALLERY_IMAGES.slice(0, 8) : GALLERY_IMAGES;

  return (
    <section id="gallery" className="bg-primary-50 px-6 py-24 sm:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-black uppercase tracking-[.26em] text-primary">{t.pages.gallery[0]}</p>
            <h2 className="mt-4 text-4xl font-extrabold tracking-[-0.04em] text-dark sm:text-6xl">{t.pages.gallery[1]}</h2>
          </div>
          {preview && <a href="/gallery" className="inline-flex items-center gap-3 text-sm font-bold text-dark">{t.nav.gallery} <Icon name="arrow" className="h-4 w-4" /></a>}
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {images.map((image, i) => (
            <motion.figure key={image.src} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ delay: i * .04, duration: .55 }}
              className={`group overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-primary-200/50 ${i === 0 && !preview ? "sm:col-span-2 sm:row-span-2" : ""}`}>
              <div className={`${i === 0 && !preview ? "h-full min-h-[420px]" : "h-72"} overflow-hidden`}>
                <img src={image.src} alt={image.title} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
              </div>
              <figcaption className="border-t border-primary-100 bg-white p-4">
                <p className="text-base font-extrabold tracking-tight text-dark">{image.title}</p>
                <p className="mt-1 text-xs font-bold uppercase tracking-[.2em] text-primary">{image.tag}</p>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
