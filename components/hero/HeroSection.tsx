"use client";

import { AnimatePresence, motion } from "framer-motion";
import { MoveRight } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

import { Link } from "@/i18n/navigation";
import { SLIDESHOW_AUTOPLAY_MS, SLIDESHOW_TRANSITION_SECONDS } from "@/constants/slideshow";
import SlideImage1 from "@/public/images/hero/banner_1.jpg";
import SlideImage2 from "@/public/images/hero/banner_2.jpg";
import SlideImage3 from "@/public/images/hero/banner_3.jpg";
import { useTranslations } from "next-intl";
import DotsOverlay from "../dots-overlay/DotsOverlay";

const slides = [
  {
    id: 3,
    img: SlideImage3,
    titleKey: "slide_1_title",
    subtitleKey: null,
    buttonKey: "slide_1_button",
    align: "right",
    link: "/sustainability",
  },
  {
    id: 2,
    img: SlideImage2,
    titleKey: "slide_2_title",
    subtitleKey: null,
    buttonKey: "slide_2_button",
    align: "right",
    link: "/about-us/manufacturing-excellence#researchDevelopment",
  },
  {
    id: 1,
    img: SlideImage1,
    titleKey: "slide_3_title",
    subtitleKey: null,
    buttonKey: "slide_3_button",
    align: "left",
    link: "/contact-us",
  },
];

export default function HeroSection() {
  const [index, setIndex] = useState(0);
  const t = useTranslations("hero");

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, SLIDESHOW_AUTOPLAY_MS);

    return () => clearInterval(interval);
  }, []);

  const current = slides[index];
  const isRightAlignedSlide = current.align === "right";

  return (
    <section className="relative bg-white w-full h-[100svh] min-h-[42rem] overflow-hidden max-w-full">
      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          className="absolute inset-0 max-w-full"
          variants={{
            initial: { opacity: 0, scale: 1.02 },
            animate: { opacity: 1, scale: 1 },
            fadeout: { opacity: 0, scale: 1 },
          }}
          initial="initial"
          animate="animate"
          exit="fadeout"
          transition={{ duration: SLIDESHOW_TRANSITION_SECONDS, ease: "easeOut" }}
        >
          <DotsOverlay className="z-1" />
          <Image
            src={current.img}
            alt={t(current.titleKey)}
            fill
            priority
            placeholder="blur"
            className="object-cover max-w-full"
          />
        </motion.div>
      </AnimatePresence>

      {/* Text container */}
      <div className="relative z-10 h-full max-w-full">
        <AnimatePresence mode="wait">
          <motion.div
            className={
              `container-inner relative z-10 flex h-full w-full items-end pb-30 md:pb-45 ${
                isRightAlignedSlide ? "justify-end" : "justify-start"
              }`
            }
            key={`text-${current.id}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
          >
            <div
              className={`max-w-md md:max-w-xl xl:max-w-2xl text-white ${
                isRightAlignedSlide ? "ml-auto" : ""
              }`}
            >
              {/* <div className="white-flare"></div> */}
              <h1 className="font-bold text-3xl xs:text-3xl md:text-4xl xl:text-5xl leading-tight">
                {t(current.titleKey)}
              </h1>
              <div className="bg-white/60 mt-2 w-45 h-px"></div>
              {current.subtitleKey ? (
                <p className="mt-3 font-light text-white text-sm md:text-base xl:text-xl">
                  {t(current.subtitleKey)}
                </p>
              ) : null}
              <Link
                href={current.link}
                className={
                  "flex items-center gap-5 bg-transparent hover:bg-white shadow-xs px-3 sm:px-6 py-1 sm:py-2 border w-fit hover:text-black text-xs sm:text-sm uppercase transition-all duration-300" +
                  ` ${current.subtitleKey ? "mt-6" : "mt-4"}`
                }
              >
                {t(current.buttonKey)} <MoveRight className="size-5" strokeWidth={1} />
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="bottom-8 left-1/2 z-20 absolute flex gap-3 -translate-x-1/2">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => {
              setIndex(idx);
            }}
            aria-label={`Go to slide ${idx + 1}`}
            className={`h-3 w-10 transition-all cursor-pointer duration-300 ${
              idx === index ? "bg-white/50 w-18" : "bg-white/20"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
