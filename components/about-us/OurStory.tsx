// "use client";

// import { EmblaCarouselType } from "embla-carousel";
// import useEmblaCarousel from "embla-carousel-react";
// import { useMotionValueEvent, useScroll } from "framer-motion";
// import { ChevronLeft, ChevronRight } from "lucide-react";
// import { useCallback, useEffect, useState } from "react";
// import styles from "./our-story.module.css";
// const items = [
//   {
//     year: "2007",
//     text: "Established in Vadodara with a focus on glycolic acid production that met international standards. Secured first export order within months, positioning Avid among the few Indian manufacturers able to meet strict quality requirements.",
//   },
//   {
//     year: "2012",
//     text: "Achieved commercial-scale glycine production and began multinational customer qualification, positioning the company as India's largest amino acid manufacturer by volume.",
//   },
//   {
//     year: "2014",
//     text: "Commissioned a purpose-built 18,000 sq. m. manufacturing facility in Pochva, Vadodara with integrated production and contract manufacturing capabilities.",
//   },
//   {
//     year: "2017",
//     text: "Secured foundational food-grade compliance to support regulated markets.",
//   },
//   {
//     year: "2019",
//     text: "Achieved FSSC 22000 certification for food safety and high-purity applications.",
//   },
//   {
//     year: "2020",
//     text: "Implemented ISO 14001 and ISO 45001, formalizing environmental responsibility and workplace safety.",
//   },
//   {
//     year: "2021",
//     text: "Obtained HALAL, KOSHER, and SMETA certifications. Strengthened market position as a major supplier across Europe, the America, and Asia-Pacific.",
//   },
//   {
//     year: "2023",
//     text: "Reduced carbon emissions per unit output by 22 percent from 2018 levels through energy optimization and renewable sourcing.",
//   },
//   {
//     year: "2025",
//     text: "Completed EU REACH registration for glycolic acid and expanded international presence through subsidiaries in the US and Europe to support direct commercial engagement.",
//   },
// ];
// export default function OurStorySection() {
//   const [prevBtnDisabled, setPrevBtnDisabled] = useState(true);
//   const [nextBtnDisabled, setNextBtnDisabled] = useState(true);

//   const [emblaRef, emblaApi] = useEmblaCarousel({ dragFree: true, align: "end" });

//   const onPrevButtonClick = useCallback(() => {
//     if (!emblaApi) return;
//     emblaApi.scrollPrev();
//   }, [emblaApi]);

//   const onNextButtonClick = useCallback(() => {
//     if (!emblaApi) return;
//     emblaApi.scrollNext();
//   }, [emblaApi]);

//   const onSelect = useCallback((emblaApi: EmblaCarouselType) => {
//     setPrevBtnDisabled(!emblaApi.canScrollPrev());
//     setNextBtnDisabled(!emblaApi.canScrollNext());
//   }, []);

//   useEffect(() => {
//     if (!emblaApi) return;

//     onSelect(emblaApi);
//     emblaApi.on("reInit", onSelect).on("select", onSelect);
//   }, [emblaApi, onSelect]);

//   return (
//     <section
//       className={"relative bg-primary text-white py-16 overflow-hidden " + styles["our-story"]}
//       id="our-story"
//     >
//       <div className="container-inner relative">
//         {/* Title */}
//         <h2 className="text-2xl md:text-3xl font-extrabold">Our Story</h2>
//         <div className="h-px block w-12 bg-white/60 mt-2 max-lg:mx-auto mb-16"></div>
//         <div className="relative select-none">
//           {!prevBtnDisabled && (
//             <button
//               className="absolute top-1/2 -left-4 -translate-y-1/2 cursor-pointer"
//               onClick={onPrevButtonClick}
//             >
//               <ChevronLeft size={50} />
//             </button>
//           )}
//           {!nextBtnDisabled && (
//             <button
//               className="absolute top-1/2 -right-4 -translate-y-1/2 cursor-pointer"
//               onClick={onNextButtonClick}
//             >
//               <ChevronRight size={50} />
//             </button>
//           )}
//           <div className={styles.viewport} ref={emblaRef}>
//             <div className={"items-center " + styles.container}>
//               {items.map((item) => (
//                 <div key={item.year} className={"group space-y-3 " + styles.slide}>
//                   <p className="text-center text-xs px-3 group-even:invisible">{item.text}</p>
//                   <div className="relative min-w-80 h-80 flex items-center justify-center">
//                     <div className="relative z-10">
//                       <div className="absolute -top-5 -left-5 w-[calc(100%+40px)] h-[calc(50%+20px)] border-2 border-white border-b-0 rotate-180 group-odd:rotate-0 origin-bottom" />
//                       <div className="w-24 h-24 bg-white flex items-center justify-center shadow-lg border-[3px] border-white/30">
//                         <span className="text-2xl font-extrabold text-green-600">{item.year}</span>
//                       </div>
//                     </div>
//                     <div className="absolute top-1/2 left-0 w-[calc(50%-66px)] border-t-2 border-white"></div>
//                     <div className="absolute top-1/2 right-0 w-[calc(50%-66px)] border-t-2 border-white"></div>
//                     <div className="absolute left-1/2 h-[calc(50%-66px)] border-l-2 border-white group-odd:top-0 group-even:bottom-0"></div>
//                     <div className="absolute left-1/2 -translate-x-1/2 w-[calc(50%-66px)] border-t-2 border-white group-odd:top-0 group-even:bottom-0"></div>
//                   </div>
//                   <p className="text-center text-xs px-3 group-odd:invisible">{item.text}</p>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }

"use client";

import { motion, SpringOptions } from "framer-motion";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { CSSProperties, useCallback, useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import styles from "./our-story.module.css";

export default function OurStorySection() {
  const t = useTranslations("about.story");
  const wrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [contentWidth, setContentWidth] = useState(0);
  // use exactly 5 images for the slideshow
  const bgImages = [
    "/images/about-us/History/History Images-1.jpg",
    "/images/about-us/History/History Images-2.jpg",
    "/images/about-us/History/History Images-3.jpg",
    "/images/about-us/History/History Images-4.jpg",
    "/images/about-us/History/History Images-5.jpg",
  ];
  const [bgIndex, setBgIndex] = useState(0);
  const items = [
    { year: "2007", text: t("items.2007") },
    { year: "2012", text: t("items.2012") },
    { year: "2014", text: t("items.2014") },
    { year: "2017", text: t("items.2017") },
    { year: "2019", text: t("items.2019") },
    { year: "2020", text: t("items.2020") },
    { year: "2021", text: t("items.2021") },
    { year: "2023", text: t("items.2023") },
    { year: "2025", text: t("items.2025") },
  ];

  // --- Auto-scroll logic ---
  const CARD_WIDTH = contentWidth > 0 && contentWidth < 640 ? 260 : 320;
  const physics: SpringOptions = { damping: 50, mass: 0.5, stiffness: 400 };
  const [yearIndex, setYearIndex] = useState(0);
  const isMobileViewport = contentWidth > 0 && contentWidth < 640;

  const getCenteredX = useCallback(
    (index: number) => {
      if (contentWidth <= 0) return 0;
      if (isMobileViewport) {
        const centerOffset = (contentWidth - CARD_WIDTH) / 2;
        const centered = centerOffset - index * CARD_WIDTH;
        const minX = centerOffset - (items.length - 1) * CARD_WIDTH;
        const maxX = centerOffset;
        return Math.max(minX, Math.min(maxX, centered));
      }
      const minX = Math.min(0, contentWidth - items.length * CARD_WIDTH);
      const maxX = 0;
      // Desktop: move exactly one card per click with pinned start/end (no edge gaps).
      return Math.max(minX, Math.min(maxX, -(index * CARD_WIDTH)));
    },
    [CARD_WIDTH, contentWidth, isMobileViewport, items.length]
  );

  // unified navigation helper: moves year, background and timeline atomically
  const goToYear = useCallback(
    (index: number) => {
      // clamp year index within bounds [0, items.length-1]
      const bounded = Math.max(0, Math.min(items.length - 1, index));
      // Single source of truth for timeline + background.
      setYearIndex(bounded);
    },
    [items.length]
  );

  // Wheel navigation removed: Prev/Next buttons control navigation exclusively.

  useEffect(() => {
    if (typeof window === "undefined") return;

    const scrollToHistory = () => {
      if (window.location.hash !== "#history") return;
      const section = document.getElementById("history");
      if (!section) return;
      const top = section.getBoundingClientRect().top + window.scrollY - 120;
      window.scrollTo({ top, behavior: "smooth" });
    };

    const timer = window.setTimeout(scrollToHistory, 50);
    window.addEventListener("hashchange", scrollToHistory);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("hashchange", scrollToHistory);
    };
  }, []);

  const setContentNode = useCallback((node: HTMLDivElement | null) => {
    contentRef.current = node;
    if (node) {
      setContentWidth(node.clientWidth || 0);
    }
  }, []);

  useEffect(() => {
    const node = contentRef.current;
    if (!node || typeof window === "undefined") return;

    const updateWidth = () => setContentWidth(node.clientWidth || 0);
    updateWidth();

    const observer = new ResizeObserver(() => updateWidth());
    observer.observe(node);
    window.addEventListener("resize", updateWidth);
    window.addEventListener("orientationchange", updateWidth);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateWidth);
      window.removeEventListener("orientationchange", updateWidth);
    };
  }, []);

  // Background image changes only via `yearIndex` now (no scroll-driven updates)

  // Sync background image and timeline position from selected year.
  useEffect(() => {
    const idx = yearIndex % bgImages.length;
    setBgIndex(idx);
  }, [yearIndex, bgImages.length]);

  return (
    <section
      ref={wrapperRef}
      style={{ "--slide-size": `${CARD_WIDTH}px` } as CSSProperties}
      className={"relative bg-primary text-white min-h-[72svh] md:min-h-[100svh] overflow-hidden max-w-full scroll-mt-24 " + styles["our-story"]}
      id="history"
    >
      {/* Sticky viewport */}
      <div className="sticky top-0 h-[72svh] md:h-[100svh] flex items-center md:items-start pt-0 md:pt-14 pb-0 md:pb-10 max-w-full">
        <div className="absolute inset-0 -z-10 pointer-events-none">
          {bgImages.map((src, i) => (
            <Image
              key={src}
              src={encodeURI(src)}
              fill
              alt={`${t("title")} ${i + 1}`}
              className="object-cover transition-opacity duration-700 ease-in-out"
              style={{ opacity: i === bgIndex ? 1 : 0 }}
              quality={80}
            />
          ))}
        </div>
        {/* Prev/Next buttons — always visible, centered vertically */}
        {/* Left button placed at line location (connector removed) */}
        <div className="absolute left-3 sm:left-6 lg:left-20 top-1/2 -translate-y-1/2 z-40">
          <motion.button
            whileTap={{ scale: 0.95 }}
            aria-label="Previous year"
            onClick={() => {
              if (yearIndex <= 0) return;
              const next = yearIndex - 1;
              goToYear(next);
            }}
            className={`bg-white/90 text-black p-3 rounded-full shadow-lg touch-manipulation ${yearIndex <= 0 ? 'opacity-40 pointer-events-none' : ''}`}
          >
            <ChevronLeft size={22} />
          </motion.button>
        </div>

        {/* Right button placed at line location (connector removed) */}
        <div className="absolute right-3 sm:right-6 lg:right-20 top-1/2 -translate-y-1/2 z-40">
          <motion.button
            whileTap={{ scale: 0.95 }}
            aria-label="Next year"
            onClick={() => {
              const isLast = yearIndex >= items.length - 1;
              const next = isLast ? 0 : yearIndex + 1;
              goToYear(next);
            }}
            className="bg-white/90 text-black p-3 rounded-full shadow-lg touch-manipulation"
          >
            <ChevronRight size={22} />
          </motion.button>
        </div>
        <div className="container-inner relative w-full overflow-x-hidden overflow-y-visible">
          {/* Title */}
          <h2 className="text-2xl md:text-3xl font-extrabold">{t("title")}</h2>
          <div className="h-px block w-12 bg-white/60 mt-2 mb-5"></div>

          {/* Horizontal Translate Container */}
          <div ref={setContentNode} className="overflow-x-hidden overflow-y-visible relative pb-6">
            <motion.div
              animate={{ x: getCenteredX(yearIndex) }}
              transition={{ type: "spring", ...physics }}
              className={styles.container + " items-center w-max max-w-full"}
            >
              {items.map((item) => (
                <div key={item.year} className={"group space-y-2 " + styles.slide}>
                  <p className="text-center text-xs md:text-sm px-3 leading-relaxed group-even:invisible">{item.text}</p>
                  <div className="relative min-w-[260px] sm:min-w-80 h-64 sm:h-72 md:h-[19rem] flex items-center justify-center">
                    <div className="relative z-10">
                      <div className="absolute -top-5 -left-5 w-[calc(100%+40px)] h-[calc(50%+20px)] border-2 border-white border-b-0 rotate-180 group-odd:rotate-0 origin-bottom" />
                      <div className="w-24 h-24 bg-white flex items-center justify-center shadow-lg border-[3px] border-white/30">
                        <span className="text-2xl font-extrabold text-green-600">{item.year}</span>
                      </div>
                    </div>
                    <div className="absolute top-1/2 left-0 w-[calc(50%-66px)] border-t-2 border-white"></div>
                    <div className="absolute top-1/2 right-0 w-[calc(50%-66px)] border-t-2 border-white"></div>
                    <div className="absolute left-1/2 h-[calc(50%-66px)] border-l-2 border-white group-odd:top-0 group-even:bottom-0"></div>
                    <div className="absolute left-1/2 -translate-x-1/2 w-[calc(50%-66px)] border-t-2 border-white group-odd:top-0 group-even:bottom-0"></div>
                  </div>
                  <p className="text-center text-xs md:text-sm px-3 leading-relaxed group-odd:invisible">{item.text}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
