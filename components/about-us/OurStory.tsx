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

import { motion, SpringOptions, useSpring, useAnimationFrame } from "framer-motion";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useCallback, useRef, useState, useEffect } from "react";
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
  const CARD_WIDTH = 320;
  const TOTAL_CARDS_WIDTH = CARD_WIDTH * items.length;
  const END_X = -(TOTAL_CARDS_WIDTH - contentWidth);
  const physics: SpringOptions = { damping: 50, mass: 0.5, stiffness: 400 };
  const [isPaused, setIsPaused] = useState(false);
  const [isAutoPlay, setIsAutoPlay] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [yearIndex, setYearIndex] = useState(0);
  const clickLockRef = useRef(false);
  const autoStepTimerRef = useRef(0);
  const wheelAccumulatorRef = useRef(0);
  const lastWheelStepRef = useRef(0);
  const spring = useSpring(0, physics);
  const visibleCards = contentWidth > 0 ? Math.max(1, Math.floor(contentWidth / CARD_WIDTH)) : 1;
  const maxFirstIndex = Math.max(0, items.length - visibleCards);

  const scrollToIndex = useCallback(
    (index: number) => {
      const clamped = Math.max(0, Math.min(maxFirstIndex, index));
      setActiveIndex(clamped);
    },
    [maxFirstIndex]
  );

  // unified navigation helper: moves year, background and timeline atomically
  const goToYear = useCallback(
    (index: number) => {
      // clamp year index within bounds [0, items.length-1]
      const bounded = Math.max(0, Math.min(items.length - 1, index));

      // compute activeIndex (based on visible cards)
      const clampedActive = Math.max(0, Math.min(maxFirstIndex, bounded));

      const nextBg = bounded % bgImages.length;

      // perform atomic updates (batched by React)
      setYearIndex(bounded);
      setBgIndex(nextBg);
      setActiveIndex(clampedActive);

      // immediately move spring so the visual matches
      if (contentWidth > 0) {
        const xVal = Math.max(END_X, -(clampedActive * CARD_WIDTH));
        spring.set(xVal);
      }
    },
    [items.length, bgImages.length, CARD_WIDTH, contentWidth, END_X, maxFirstIndex, spring]
  );

  // Wheel navigation removed: Prev/Next buttons control navigation exclusively.

  // Auto-scroll using animation frame
  useAnimationFrame((t, delta) => {
    if (isAutoPlay && !isPaused && contentWidth > 0 && maxFirstIndex > 0) {
      autoStepTimerRef.current += delta;
      if (autoStepTimerRef.current >= 2200) {
        autoStepTimerRef.current = 0;
        setActiveIndex((prev) => (prev >= maxFirstIndex ? 0 : prev + 1));
      }
    }
  });

  useEffect(() => {
    if (contentWidth > 0) {
      const xVal = Math.max(END_X, -(activeIndex * CARD_WIDTH));
      spring.set(xVal);
    }
  }, [activeIndex, contentWidth, END_X, spring]);

  useEffect(() => {
    if (activeIndex > maxFirstIndex) {
      setActiveIndex(maxFirstIndex);
    }
  }, [activeIndex, maxFirstIndex]);

  const setContentNode = useCallback((node: HTMLDivElement | null) => {
    contentRef.current = node;
    if (node) {
      setContentWidth(node.clientWidth || 0);
    }
  }, []);

  // Background image changes only via `yearIndex` now (no scroll-driven updates)

  // sync background image and active scroll position to selected `yearIndex`
  useEffect(() => {
    const idx = yearIndex % bgImages.length;

    // ensure the scrolling/timeline position matches the selected year
    const clamped = Math.max(0, Math.min(maxFirstIndex, yearIndex));
    setActiveIndex(clamped);

    // immediately update spring position so UI reflects the change in one step
    if (contentWidth > 0) {
      const xVal = Math.max(END_X, -(clamped * CARD_WIDTH));
      spring.set(xVal);
    }
  }, [yearIndex, bgImages.length, maxFirstIndex, contentWidth, END_X, spring]);

  return (
    <section
      ref={wrapperRef}
      className={"relative bg-primary text-white min-h-screen overflow-hidden max-w-full " + styles["our-story"]}
      id="history"
    >
      {/* Sticky viewport */}
      <div className="sticky top-0 h-screen flex items-start pt-12 md:pt-14 pb-10 max-w-full">
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
        <div className="absolute left-20 top-1/2 -translate-y-1/2 z-40">
          <motion.button
            whileTap={{ scale: 0.95 }}
            aria-label="Previous year"
            onClick={() => {
              if (clickLockRef.current || yearIndex <= 0) return;
              clickLockRef.current = true;
              const next = yearIndex - 1;

              // use unified helper to avoid any racing
              goToYear(next);

              window.setTimeout(() => (clickLockRef.current = false), 500);
            }}
            className={`bg-white/90 text-black p-3 rounded-full shadow-lg touch-manipulation ${yearIndex <= 0 ? 'opacity-40 pointer-events-none' : ''}`}
          >
            <ChevronLeft size={22} />
          </motion.button>
        </div>

        {/* Right button placed at line location (connector removed) */}
        <div className="absolute right-20 top-1/2 -translate-y-1/2 z-40">
          <motion.button
            whileTap={{ scale: 0.95 }}
            aria-label="Next year"
            onClick={() => {
              if (clickLockRef.current) return;
              clickLockRef.current = true;
              const isLast = yearIndex >= items.length - 1;
              const next = isLast ? 0 : yearIndex + 1;

              // use unified helper to avoid any racing
              goToYear(next);

              window.setTimeout(() => (clickLockRef.current = false), 500);
            }}
            className="bg-white/90 text-black p-3 rounded-full shadow-lg touch-manipulation"
          >
            <ChevronRight size={22} />
          </motion.button>
        </div>
        <div className="container-inner relative w-full overflow-x-hidden overflow-y-visible">
          {/* Title */}
          <h2 className="text-2xl md:text-3xl font-extrabold">{t("title")}</h2>
          <div className="h-px block w-12 bg-white/60 mt-2 max-lg:mx-auto mb-5"></div>

          {/* Horizontal Translate Container */}
          <div ref={setContentNode} className="overflow-x-hidden overflow-y-visible relative pb-6">
            <motion.div style={{ x: spring }} className={styles.container + " items-center w-max max-w-full"}>
              {items.map((item) => (
                <div key={item.year} className={"group space-y-2 " + styles.slide}>
                  <p className="text-center text-xs md:text-sm px-3 leading-relaxed group-even:invisible">{item.text}</p>
                  <div className="relative min-w-80 h-72 md:h-[19rem] flex items-center justify-center">
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
