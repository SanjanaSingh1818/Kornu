import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { GalleryItem } from "../../content/defaults";
import { useLanguage } from "../../i18n";
import { CmsLink } from "../CmsLink";
import { Icon } from "../Icon";

// Screen-reader labels only; visible texts ("Alla", "bilder") come from Sanity via t.galleryUi.
const UI = {
  sv: { open: "Visa bild", close: "Stäng", prev: "Föregående bild", next: "Nästa bild" },
  en: { open: "View photo", close: "Close", prev: "Previous photo", next: "Next photo" },
  ar: { open: "عرض الصورة", close: "إغلاق", prev: "الصورة السابقة", next: "الصورة التالية" },
};

function Tile({ image, index, onOpen, label }: { image: GalleryItem; index: number; onOpen: () => void; label: string }) {
  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 24, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.94 }}
      transition={{ duration: 0.45, delay: Math.min(index, 8) * 0.04, ease: [0.16, 1, 0.3, 1] }}
    >
      <button
        type="button"
        onClick={onOpen}
        aria-label={`${label}: ${image.title}`}
        className="group relative block aspect-[4/5] w-full overflow-hidden rounded-2xl sm:rounded-[1.75rem] bg-primary-900 text-left shadow-[0_18px_50px_rgba(6,78,59,0.14)] ring-1 ring-black/5 transition duration-500 hover:-translate-y-1.5 hover:shadow-[0_30px_70px_rgba(6,78,59,0.24)] focus:outline-none focus-visible:ring-4 focus-visible:ring-primary-300"
      >
        <img src={image.src} alt={image.title} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition duration-[900ms] ease-out group-hover:scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-dark/90 via-dark/15 to-transparent opacity-80 transition duration-500 group-hover:opacity-100" />
        {image.tag && (
          <span className="absolute left-2.5 top-2.5 max-w-[calc(100%-1.25rem)] truncate rounded-full border border-white/25 bg-white/15 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[.14em] text-white backdrop-blur-md sm:left-4 sm:top-4 sm:px-3 sm:text-[10px] sm:tracking-[.18em]">
            {image.tag}
          </span>
        )}
        <span className="absolute right-4 top-4 grid h-10 w-10 scale-75 place-items-center rounded-full bg-white text-dark opacity-0 shadow-lg transition duration-300 group-hover:scale-100 group-hover:opacity-100" aria-hidden>
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" /></svg>
        </span>
        <span className="absolute inset-x-3 bottom-3 translate-y-1 transition duration-500 group-hover:translate-y-0 sm:inset-x-5 sm:bottom-5">
          <span className="block text-sm font-extrabold leading-tight tracking-tight text-white sm:text-xl">{image.title}</span>
          <span className="mt-2 block h-0.5 w-10 rounded-full bg-primary-400 transition-all duration-500 group-hover:w-20" />
        </span>
      </button>
    </motion.li>
  );
}

function Lightbox({ images, index, onClose, onMove, ui }: { images: GalleryItem[]; index: number; onClose: () => void; onMove: (step: number) => void; ui: (typeof UI)["sv"] }) {
  const image = images[index];

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowRight") onMove(document.dir === "rtl" ? -1 : 1);
      if (event.key === "ArrowLeft") onMove(document.dir === "rtl" ? 1 : -1);
    };
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose, onMove]);

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={image.title}
      className="fixed inset-0 z-[80] flex flex-col bg-dark/95 backdrop-blur-xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <div className="flex items-center justify-between px-5 py-4 text-white sm:px-8">
        <span className="text-sm font-bold tabular-nums text-white/70">{index + 1} / {images.length}</span>
        <button type="button" onClick={onClose} aria-label={ui.close} className="grid h-11 w-11 place-items-center rounded-full bg-white/10 text-2xl transition hover:bg-white/20">×</button>
      </div>

      <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 sm:px-20" onClick={(e) => e.stopPropagation()}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.img
            key={image.src}
            src={image.src}
            alt={image.title}
            className="max-h-full max-w-full cursor-grab rounded-2xl object-contain shadow-[0_40px_120px_rgba(0,0,0,0.5)] active:cursor-grabbing"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.25 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.6}
            onDragEnd={(_, info) => { if (Math.abs(info.offset.x) > 80) onMove(info.offset.x < 0 ? 1 : -1); }}
          />
        </AnimatePresence>
        {images.length > 1 && (
          <>
            <button type="button" onClick={() => onMove(-1)} aria-label={ui.prev} className="absolute left-2 top-1/2 hidden h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/25 sm:left-6 sm:grid">
              <Icon name="arrow" className="h-5 w-5 rotate-180" />
            </button>
            <button type="button" onClick={() => onMove(1)} aria-label={ui.next} className="absolute right-2 top-1/2 hidden h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/25 sm:right-6 sm:grid">
              <Icon name="arrow" className="h-5 w-5" />
            </button>
          </>
        )}
      </div>

      <div className="px-5 pb-3 pt-4 text-center" onClick={(e) => e.stopPropagation()}>
        <p className="text-lg font-extrabold text-white">{image.title}</p>
        {image.tag && <p className="mt-1 text-xs font-bold uppercase tracking-[.2em] text-primary-300">{image.tag}</p>}
      </div>
      <div className="flex justify-center gap-2 overflow-x-auto px-5 pb-6" onClick={(e) => e.stopPropagation()}>
        {images.map((thumb, i) => (
          <button
            key={`${thumb.src}-${i}`}
            type="button"
            onClick={() => onMove(i - index)}
            aria-label={thumb.title}
            className={`h-14 w-12 shrink-0 overflow-hidden rounded-lg transition ${i === index ? "opacity-100 ring-2 ring-primary-400" : "opacity-40 hover:opacity-80"}`}
          >
            <img src={thumb.src} alt="" className="h-full w-full object-cover" />
          </button>
        ))}
      </div>
    </motion.div>
  );
}

export function Gallery({ preview = false }: { preview?: boolean }) {
  const { t, site, lang } = useLanguage();
  const ui = UI[lang] ?? UI.sv;
  const all = preview ? site.gallery.slice(0, 8) : site.gallery;
  const tags = useMemo(() => Array.from(new Set(all.map((image) => image.tag).filter(Boolean))), [all]);
  const [filter, setFilter] = useState<string | null>(null);
  const images = filter ? all.filter((image) => image.tag === filter) : all;
  const [open, setOpen] = useState<number | null>(null);
  const move = useCallback((step: number) => setOpen((current) => (current === null ? null : (current + step + images.length) % images.length)), [images.length]);
  const close = useCallback(() => setOpen(null), []);

  const grid = (
    <motion.ul layout className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 xl:grid-cols-4">
      <AnimatePresence mode="popLayout">
        {images.map((image, i) => (
          <Tile key={`${image.src}-${image.title}`} image={image} index={i} label={ui.open} onOpen={() => setOpen(i)} />
        ))}
      </AnimatePresence>
    </motion.ul>
  );

  const lightbox = (
    <AnimatePresence>
      {open !== null && images[open] && <Lightbox images={images} index={open} onClose={close} onMove={move} ui={ui} />}
    </AnimatePresence>
  );

  if (preview) {
    return (
      <section id="gallery" className="bg-primary-50 px-4 py-20 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-black uppercase tracking-[.26em] text-primary">{t.pages.gallery[0]}</p>
              <h2 className="mt-3 max-w-3xl text-3xl font-extrabold tracking-[-0.03em] text-dark sm:text-5xl">{t.pages.gallery[1]}</h2>
            </div>
            {site.galleryLinkLabel && (
              <CmsLink href={site.buttons.galleryLink} className="inline-flex shrink-0 items-center gap-3 rounded-full bg-dark px-5 py-3 text-sm font-bold text-white transition hover:bg-primary">
                {site.galleryLinkLabel} <Icon name="arrow" className="h-4 w-4" />
              </CmsLink>
            )}
          </div>
          {grid}
        </div>
        {lightbox}
      </section>
    );
  }

  const fan = all.slice(0, 3);
  return (
    <>
      <section className="relative overflow-hidden bg-dark px-4 pb-20 pt-36 text-white sm:px-6 sm:pt-40 lg:pb-28">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-40 top-10 h-[28rem] w-[28rem] rounded-full bg-primary/25 blur-[120px]" />
          <div className="absolute -right-20 bottom-0 h-[22rem] w-[22rem] rounded-full bg-primary-400/15 blur-[110px]" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
        </div>

        <div className="relative mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[1.05fr_.95fr]">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}>
            <p className="inline-flex items-center gap-2 rounded-full border border-primary-400/30 bg-primary-900/40 px-4 py-1.5 text-xs font-bold uppercase tracking-[.22em] text-primary-300">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary-400" />
              {t.pages.gallery[0]}
            </p>
            <h1 className="mt-6 text-4xl font-extrabold leading-[1.02] tracking-[-0.04em] sm:text-6xl lg:text-7xl">{t.pages.gallery[1]}</h1>
            <p className="mt-6 max-w-xl text-base leading-8 text-white/65 sm:text-lg">{t.pages.gallery[2]}</p>
            <div className="mt-9 flex flex-wrap items-center gap-6">
              <div>
                <p className="text-4xl font-extrabold text-primary-400">{all.length}</p>
                <p className="mt-1 text-xs font-bold uppercase tracking-[.2em] text-white/50">{t.galleryUi.photos}</p>
              </div>
              <span className="h-12 w-px bg-white/15" />
              <div className="flex -space-x-3">
                {all.slice(3, 8).map((image, i) => (
                  <img key={`${image.src}-${i}`} src={image.src} alt="" className="h-12 w-12 rounded-full border-2 border-dark object-cover" />
                ))}
              </div>
            </div>
          </motion.div>

          <div className="relative mx-auto hidden h-[440px] w-full max-w-md lg:block" aria-hidden>
            {fan.map((image, i) => {
              const pose = [
                { rotate: -9, x: -70, y: 30, z: 1 },
                { rotate: 7, x: 80, y: 10, z: 2 },
                { rotate: -2, x: 0, y: -10, z: 3 },
              ][i];
              return (
                <motion.div
                  key={`${image.src}-${i}`}
                  className="absolute left-1/2 top-1/2 h-[360px] w-[270px] -ml-[135px] -mt-[180px] overflow-hidden rounded-[2rem] border-4 border-white/90 shadow-[0_40px_90px_rgba(0,0,0,0.45)]"
                  style={{ zIndex: pose.z }}
                  initial={{ opacity: 0, rotate: 0, x: 0, y: 60 }}
                  animate={{ opacity: 1, rotate: pose.rotate, x: pose.x, y: pose.y }}
                  whileHover={{ scale: 1.04, rotate: 0, zIndex: 10 }}
                  transition={{ duration: 0.9, delay: 0.15 + i * 0.12, ease: [0.16, 1, 0.3, 1] }}
                >
                  <img src={image.src} alt="" className="h-full w-full object-cover" />
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="gallery" className="scroll-mt-28 bg-primary-50 px-4 py-14 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-7xl">
          {tags.length > 1 && (
            <div className="-mx-4 mb-8 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0">
              {[null, ...tags].map((tag) => {
                const active = filter === tag;
                const count = tag ? all.filter((image) => image.tag === tag).length : all.length;
                return (
                  <button
                    key={tag ?? "all"}
                    type="button"
                    onClick={() => setFilter(tag)}
                    className={`inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-bold transition ${active ? "bg-dark text-white shadow-lg" : "bg-white text-slate-700 ring-1 ring-primary-200/60 hover:ring-primary-300"}`}
                  >
                    {tag ?? t.galleryUi.all}
                    <span className={`rounded-full px-2 py-0.5 text-[11px] ${active ? "bg-primary-400 text-dark" : "bg-primary-50 text-primary-dark"}`}>{count}</span>
                  </button>
                );
              })}
            </div>
          )}
          {grid}
        </div>
        {lightbox}
      </section>
    </>
  );
}
