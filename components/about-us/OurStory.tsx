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

import { motion, SpringOptions, useScroll, useSpring, useTransform, useAnimationFrame } from "framer-motion";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useCallback, useRef, useState, useEffect } from "react";
import styles from "./our-story.module.css";

export default function OurStorySection() {
  const t = useTranslations("about.story");
  const wrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [contentWidth, setContentWidth] = useState(0);
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
  const [progress, setProgress] = useState(0); // 0 to 1
  const spring = useSpring(0, physics);

  // Auto-scroll using animation frame
  useAnimationFrame((t, delta) => {
    if (!isPaused && contentWidth > 0) {
      setProgress((prev) => {
        let next = prev + delta * 0.00004; // speed factor
        if (next > 1) next = 0; // loop
        return next;
      });
    }
  });

  // Map progress (0-1) to x (0 to END_X)
  useEffect(() => {
    if (contentWidth > 0) {
      const xVal = progress * (END_X);
      spring.set(xVal);
    }
  }, [progress, contentWidth, END_X, spring]);

  const setContentNode = useCallback((node: HTMLDivElement | null) => {
    contentRef.current = node;
    if (node) {
      setContentWidth(node.clientWidth || 0);
    }
  }, []);

  return (
    <section
      ref={wrapperRef}
      className={"relative bg-primary text-white h-[300vh] " + styles["our-story"]}
      id="history"
    >
      {/* Sticky viewport */}
      <div className="sticky top-0 h-screen flex items-center">
        <Image
          src="/images/about-us/story-bg.jpg"
          fill
          alt={t("title")}
          className="absolute -z-1 object-cover"
          quality={100}
        />
        <div className="container-inner relative w-full overflow-hidden">
          {/* Title */}
          <h2 className="text-2xl md:text-3xl font-extrabold">{t("title")}</h2>
          <div className="h-px block w-12 bg-white/60 mt-2 max-lg:mx-auto mb-8"></div>
          {/* Horizontal Translate Container */}
          <div
            ref={setContentNode}
            className="overflow-hidden relative"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={() => setIsPaused(true)}
            onTouchEnd={() => setIsPaused(false)}
          >
            <div className={styles["our-story-gradient"]}></div>
            <motion.div style={{ x: spring }} className={styles.container + " items-center w-max"}>
              {items.map((item) => (
                <div key={item.year} className={"group space-y-3 " + styles.slide}>
                  <p className="text-center text-sm px-3 group-even:invisible">{item.text}</p>
                  <div className="relative min-w-80 h-80 flex items-center justify-center">
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
                  <p className="text-center text-sm px-3 group-odd:invisible">{item.text}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
