"use client";

import excellenceImage from "@/public/images/manufacturing-excellence/excellence-hero.webp";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import DotsOverlay from "../dots-overlay/DotsOverlay";

export default function ManufacturingExcellenceHeroSection() {
  const t = useTranslations("menu");

  return (
    <div className="relative bg-gray-section overflow-hidden">
      <motion.div
        initial={false}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="parallax-hero relative w-full aspect-[1200/1675] sm:aspect-auto sm:h-[34rem] lg:h-150"
      >
        {/* Desktop Background Image */}
        <div
          className="parallax-hero__image hidden md:block absolute inset-0 bg-cover bg-no-repeat bg-bottom"
          style={{
            backgroundImage: `url(${excellenceImage.src})`,
          }}
        />
        {/* Mobile Background Image */}
        <div
          className="parallax-hero__image md:hidden block absolute inset-0 bg-cover bg-no-repeat bg-bottom"
          style={{
            backgroundImage: "url('/mobile/about-us/manufacturing-excellence.webp')",
          }}
        />
        <DotsOverlay className="z-1" />
      </motion.div>
      <motion.div
        initial={false}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="z-1 absolute inset-0 flex flex-col py-10 sm:py-16 text-left container-inner"
      >
        <div className="mt-auto mb-10">
          <h1 className="font-extrabold text-white text-3xl leading-relaxed whitespace-break-spaces">
            {t("submenu.manufacturing").replace(" ", "\n")}
          </h1>
        </div>
      </motion.div>{" "}
    </div>
  );
}

