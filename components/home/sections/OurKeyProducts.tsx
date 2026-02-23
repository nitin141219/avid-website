"use client";

import { Link } from "@/i18n/navigation";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useState } from "react";
import { getResponsiveImageSources } from "@/lib/utils";
const products = [
  {
    id: 2,
    name: "AviGly™",
    series: true,
    subtitle: "avigly.subtitle",
    image: "/images/home/products/Avigly.png",
    logo: "/images/home/products/AviGlylogo.png",
    link: "/product/amino-acids/avigly-hp",
    description: "avigly.description",
  },
  {
    id: 1,
    name: "AviGa™",
    series: true,
    subtitle: "aviga.subtitle",
    image: "/images/home/products/Aviga.png",
    logo: "/images/home/products/AviGalogo.png",
    link: "/product/alpha-hydroxy-acids/aviga-hp-70",
    description: "aviga.description",
  },
  {
    id: 3,
    name: "AviVan™",
    series: false,
    subtitle: "avivan.subtitle",
    image: "/images/home/products/Avitau.png",
    logo: "/images/home/products/AviTaulogo.webp",
    link: "/product/amino-acids/avitau",
    description: "avivan.description",
  },
];

const sizeClassNames = {
  article:
    "max-w-75 lg:max-w-70 min-[1130px]:max-w-80 xl:max-w-90 2xl:max-w-100  lg:last:-mr-10 min-[1130px]:last:-mr-11 xl:last:-mr-12 2xl:last:-mr-13",
  image: "size-80 lg:size-70 min-[1130px]:size-80 xl:size-90 2xl:size-100",
  imagePosition: "-left-8 xs:-left-11 lg:-left-10 min-[1130px]:-left-11 xl:-left-12 2xl:-left-13",
  imageTextPosition:
    "right-8 xs:right-11 lg:right-10 min-[1130px]:right-11 xl:right-12 2xl:right-13 top-17 xs:top-25 lg:top-22 min-[1130px]:top-25 xl:top-20",
  arrowPosition: "right-10 xs:right-14 bottom-2",
  contentPosition:
    "pr-8 xs:pr-11 lg:pr-10 min-[1130px]:pr-11 xl:pr-12 2xl:pr-13 xs:max-w-80 lg:max-w-70 min-[1130px]:max-w-80 xl:max-w-90 2xl:max-w-100",
  spacing: "px-0",
};

export default function OurKeyProducts() {
  const [activeIndex, setActiveIndex] = useState(1);
  const t = useTranslations("key-products");
  return (
    <section className="relative bg-primary overflow-hidden text-white">
      <div className="py-10 md:py-14 container-inner">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="max-lg:text-center"
        >
          <h2 className="mb-3 sm:mb-6 font-extrabold text-2xl md:text-3xl">{t("title")}</h2>
          <p className="mb-1 sm:mb-4 font-normal text-base md:text-lg">
            {t("tagline")}
            <span className="block bg-white/60 max-lg:mx-auto mt-2 w-12 h-px"></span>
          </p>
          <p className="max-lg:mx-auto w-full sm:w-4/5 font-light text-xs xs:text-sm md:text-base sm:whitespace-pre-line">
            {t("description")}
          </p>
        </motion.div>

        {/* grid */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className={
            "mt-2 sm:mt-6 lg:mt-10 xl:mt-12 flex flex-wrap justify-evenly lg:justify-between gap-6 place-content-center" +
            ` ${sizeClassNames.spacing}`
          }
        >
          {products.map((p) => {
            const imageSource = getResponsiveImageSources(p as any);

            return (
            <article
              key={p.id}
              onMouseEnter={() => setActiveIndex(p.id)}
              className={"flex flex-col items-start" + ` ${sizeClassNames.article}`}
            >
              <Link href={p.link}>
                {/* cyan panel with image */}
                <div className={"relative overflow-visible group" + ` ${sizeClassNames.image}`}>
                  {/* image sits inside the left part of the cyan tile */}
                  <div
                    className={"absolute size-full rounded-sm" + ` ${sizeClassNames.imagePosition}`}
                  >
                    <Image
                      src={imageSource.desktop}
                      alt={p.name}
                      fill
                      className={`hidden md:block object-contain object-bottom transition-all duration-500 origin-bottom max-lg:contrast-105 max-lg:saturate-115
                      ${activeIndex === p.id ? " lg:scale-110 contrast-105 saturate-115 grayscale-0" : " lg:contrast-100 lg:grayscale-40"}
                    `}

                      // sizes="(min-width: 1024px) 33vw, (min-width: 768px) 45vw, 100vw"
                    />
                    <Image
                      src={imageSource.mobile}
                      alt={p.name}
                      fill
                      className={`md:hidden object-contain object-bottom transition-all duration-500 origin-bottom max-lg:contrast-105 max-lg:saturate-115
                      ${activeIndex === p.id ? " lg:scale-110 contrast-105 saturate-115 grayscale-0" : " lg:contrast-100 lg:grayscale-40"}
                    `}
                    />
                  </div>

                  {/* textual block on the right inside cyan panel */}
                  <div
                    className={
                      "absolute justify-end w-fit flex flex-col pr-4 origin-bottom-left transition-transform duration-500 " +
                      sizeClassNames.imageTextPosition +
                      ` ${activeIndex === p.id ? " lg:scale-110" : ""}`
                    }
                  >
                    <div className="flex items-end">
                      <div className="w-[90px] h-[30px] lg:w-20 lg:h-[26px] relative flex-shrink-0">
                        <Image
                          src={p.logo}
                          width={90}
                          height={30}
                          alt={p.name}
                          className="object-contain"
                        />
                      </div>
                      {/* <span className="font-bold text-white text-base sm:text-lg xl:text-xl 2xl:text-2xl leading-tight">
                        {p.name}
                      </span> */}
                      {p.series ? (
                        <span className="text-[10px] text-white/90 sm:text-xs xl:text-sm 2xl:text-base">
                          {t("series")}
                        </span>
                      ) : null}
                    </div>
                    <div className="bg-white/60 my-1 w-10 h-px"></div>
                    <div className="text-[10px] text-white sm:text-xs xl:text-sm 2xl:text-base">
                      {t(p.subtitle)}
                    </div>
                  </div>

                  {/* small arrow control bottom-right */}
                  <div
                    className={
                      "absolute transition-transform duration-500 " +
                      sizeClassNames.arrowPosition +
                      ` ${activeIndex === p.id ? " lg:scale-130 lg:translate-x-4" : ""}`
                    }
                  >
                    <ArrowRight size={18} strokeWidth={1.6} />
                  </div>
                </div>
              </Link>
            </article>
          );
          })}
        </motion.div>
      </div>

      {/* bottom white strip */}
      {/* <div className="bg-white h-6"></div> */}
    </section>
  );
}
