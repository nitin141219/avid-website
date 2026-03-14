"use client";

import { AnimatePresence, LazyMotion, domAnimation, m } from "framer-motion";
import { MoveRight } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { Link } from "@/i18n/navigation";
import { SLIDESHOW_AUTOPLAY_MS, SLIDESHOW_TRANSITION_SECONDS } from "@/constants/slideshow";
import { getResponsiveImageSources } from "@/lib/utils";
import SlideImage1 from "@/public/images/hero/banner_1.webp";
import SlideImage2 from "@/public/images/hero/banner_2.webp";
import SlideImage3 from "@/public/images/hero/banner_3.webp";
import AvigaBioLogo from "@/public/images/hero/aviga-bio-logo.png";
import { HomepageSlide } from "@/types/homepage-slide";
import Image from "next/image";
import { useTranslations } from "next-intl";
import DotsOverlay from "../dots-overlay/DotsOverlay";

const AVIGA_BIO_LOGO_ALT = "Aviga Bio";
const fallbackSlides = [
  {
    id: 3,
    position: 2,
    img: SlideImage3,
    mobileImg: "/mobile/main-banner/1.webp",
    title: null,
    titleKey: "slide_1_title",
    subtitle: null,
    subtitleKey: null,
    buttonText: null,
    buttonKey: "slide_1_button",
    align: "right",
    link: "/sustainability",
  },
  {
    id: 2,
    position: 4,
    img: SlideImage2,
    mobileImg: "/mobile/main-banner/2.webp",
    title: null,
    titleKey: "slide_2_title",
    subtitle: null,
    subtitleKey: null,
    buttonText: null,
    buttonKey: "slide_2_button",
    align: "right",
    link: "/about-us/manufacturing-excellence#researchDevelopment",
  },
  {
    id: 1,
    position: 3,
    img: SlideImage1,
    mobileImg: "/mobile/main-banner/3.webp",
    title: null,
    titleKey: "slide_3_title",
    subtitle: null,
    subtitleKey: null,
    buttonText: null,
    buttonKey: "slide_3_button",
    align: "left",
    link: "/contact-us",
  },
];

const AVIGA_BIO_HP70_MOBILE_IMAGE = "/mobile/main-banner/aviga-bio-hp70.jpeg";

type HeroSectionProps = {
  slides?: HomepageSlide[];
};

export default function HeroSection({ slides = [] }: HeroSectionProps) {
  const [index, setIndex] = useState(0);
  const t = useTranslations("hero");
  const resolvedSlides = useMemo(
    () => [
      ...slides
        .slice()
        .sort((a, b) => Number(a.position || 0) - Number(b.position || 0))
        .map((slide) => {
          const responsive = getResponsiveImageSources(slide, slide.image);
          const normalizedTitle = (slide.title || "").toLowerCase();
          const shouldUseAvigaBioMobileOverride =
            Number(slide.position || 0) === 1 ||
            (normalizedTitle.includes("aviga") && normalizedTitle.includes("bio"));

          return {
            id: slide._id,
            position: Number(slide.position || 0),
            img: { src: responsive.desktop },
            mobileImg: shouldUseAvigaBioMobileOverride
              ? AVIGA_BIO_HP70_MOBILE_IMAGE
              : responsive.mobile,
            title: slide.title,
            titleKey: null,
            subtitle: null,
            subtitleKey: null,
            buttonText: slide.cta_text,
            buttonKey: null,
            align: slide.align === "right" ? "right" : "left",
            link: slide.cta_link,
          };
        }),
      ...fallbackSlides,
    ].sort((a, b) => Number(a.position || 0) - Number(b.position || 0)),
    [slides]
  );
  const isFirstSlide = index === 0;

  useEffect(() => {
    if (resolvedSlides.length <= 1) return;

    const nextSlide = resolvedSlides[(index + 1) % resolvedSlides.length];
    const preloadAfterIdle = () => {
      const desktopImage = new window.Image();
      desktopImage.src = nextSlide.img.src;

      if (nextSlide.mobileImg !== nextSlide.img.src) {
        const mobileImage = new window.Image();
        mobileImage.src = nextSlide.mobileImg;
      }
    };

    if ("requestIdleCallback" in globalThis) {
      const idleId = globalThis.requestIdleCallback(preloadAfterIdle, { timeout: 1500 });
      return () => globalThis.cancelIdleCallback(idleId);
    }

    const timeoutId = globalThis.setTimeout(preloadAfterIdle, 1200);
    return () => globalThis.clearTimeout(timeoutId);
  }, [index, resolvedSlides]);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % resolvedSlides.length);
    }, SLIDESHOW_AUTOPLAY_MS);

    return () => clearInterval(interval);
  }, [resolvedSlides]);

  useEffect(() => {
    if (index >= resolvedSlides.length) {
      setIndex(0);
    }
  }, [index, resolvedSlides.length]);

  const current = resolvedSlides[index];
  const isRightAlignedSlide = current.align === "right";
  const slideTitle = current.titleKey ? t(current.titleKey) : current.title || "";
  const slideSubtitle = current.subtitleKey ? t(current.subtitleKey) : current.subtitle;
  const slideButtonText = current.buttonKey ? t(current.buttonKey) : current.buttonText || "Explore";
  const normalizedSlideTitle = slideTitle.toLowerCase();
  const showAvigaBioLogo =
    Number(current.position || 0) === 1 ||
    (normalizedSlideTitle.includes("aviga") && normalizedSlideTitle.includes("bio"));

  return (
    <section className="relative bg-white w-full h-[100svh] min-h-[42rem] overflow-hidden max-w-full">
      <LazyMotion features={domAnimation}>
        <AnimatePresence initial={false}>
          <m.div
            key={current.id}
            className="absolute inset-0 max-w-full"
            variants={{
              initial: { opacity: 0 },
              animate: { opacity: 1 },
              fadeout: { opacity: 0 },
            }}
            initial="initial"
            animate="animate"
            exit="fadeout"
            transition={{ duration: SLIDESHOW_TRANSITION_SECONDS, ease: "easeInOut" }}
          >
            <DotsOverlay className="z-1" />
            <div className="absolute inset-0 block w-full h-full max-w-full">
              <Image
                src={current.img.src}
                alt={slideTitle}
                fill
                priority={isFirstSlide}
                fetchPriority={isFirstSlide ? "high" : "auto"}
                sizes="100vw"
                className="hidden md:block w-full h-full object-cover max-w-full"
              />
              <Image
                src={current.mobileImg}
                alt={slideTitle}
                fill
                priority={isFirstSlide}
                fetchPriority={isFirstSlide ? "high" : "auto"}
                sizes="100vw"
                className="md:hidden w-full h-full object-cover max-w-full"
              />
            </div>
          </m.div>
        </AnimatePresence>
        <div className="relative z-10 h-full max-w-full">
          <AnimatePresence initial={false} mode="wait">
            <m.div
              className={`container-inner relative z-10 flex h-full w-full items-end pb-30 md:pb-45 ${
                isRightAlignedSlide ? "justify-end" : "justify-start"
              }`}
              key={`text-${current.id}`}
              initial={index !== 0 ? { opacity: 0, y: 12 } : false}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <div
                className={`max-w-md md:max-w-xl xl:max-w-2xl text-white ${
                  isRightAlignedSlide ? "ml-auto" : ""
                }`}
              >
                {showAvigaBioLogo ? (
                  <Image
                    src={AvigaBioLogo}
                    alt={AVIGA_BIO_LOGO_ALT}
                    priority={isFirstSlide}
                    className="mb-4 h-auto w-[280px] max-w-full"
                  />
                ) : null}
                <h2 className="font-bold text-3xl xs:text-3xl md:text-4xl xl:text-5xl leading-tight">
                  {slideTitle}
                </h2>
                <div className="bg-white/60 mt-2 w-45 h-px"></div>
                {slideSubtitle ? (
                  <p className="mt-3 font-light text-white text-sm md:text-base xl:text-xl">
                    {slideSubtitle}
                  </p>
                ) : null}
                <Link
                  href={current.link}
                  aria-label={`${slideButtonText}: ${slideTitle}`}
                  className={
                    "flex items-center gap-5 bg-transparent hover:bg-white shadow-xs px-3 sm:px-6 py-1 sm:py-2 border w-fit hover:text-black text-xs sm:text-sm uppercase transition-all duration-300" +
                    ` ${slideSubtitle ? "mt-6" : "mt-4"}`
                  }
                >
                  {slideButtonText}
                  <span className="sr-only"> {slideTitle}</span>
                  <MoveRight className="size-5" strokeWidth={1} />
                </Link>
              </div>
            </m.div>
          </AnimatePresence>
        </div>
      </LazyMotion>
      <div className="bottom-8 left-1/2 z-20 absolute flex gap-3 -translate-x-1/2">
        {resolvedSlides.map((_, idx) => (
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




