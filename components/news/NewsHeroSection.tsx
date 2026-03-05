"use client";

import pressImage from "@/public/images/news/press.webp";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import DotsOverlay from "../dots-overlay/DotsOverlay";

export default function NewsHeroSection() {
  const t = useTranslations("news");

  return (
    <div className="relative bg-gray-section overflow-hidden">
      <motion.div
        initial={false}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="parallax-hero relative w-full aspect-[1200/1675] sm:aspect-auto sm:h-[24rem] lg:h-150 overflow-hidden"
      >
        {/* Desktop Background Image */}
        <div
          className="parallax-hero__image hidden md:block absolute inset-0 bg-cover bg-no-repeat bg-bottom-right"
          style={{
            backgroundImage: `url(${pressImage.src})`,
          }}
        />
        {/* Mobile Background Image */}
        <div
          className="parallax-hero__image md:hidden block absolute inset-0 bg-cover bg-no-repeat bg-bottom-right"
          style={{
            backgroundImage: "url('/mobile/news/mobilepress.webp')",
          }}
        />
        <DotsOverlay className="z-1 opacity-70" />
      </motion.div>

      <motion.div
        initial={false}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="z-20 absolute inset-0 flex flex-col py-10 sm:py-16 text-left container-inner"
      >
        <div className="mt-auto">
          <h1 className="font-extrabold text-primary text-3xl">{t("title")}</h1>
        </div>
      </motion.div>
    </div>
  );
}





