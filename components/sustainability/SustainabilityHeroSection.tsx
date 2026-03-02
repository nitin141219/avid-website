"use client";

import sustainabilityImage from "@/public/images/sustainability/sustainability_hero.webp";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
// import Image from "next/image";
import DotsOverlay from "../dots-overlay/DotsOverlay";

export default function SustainabilityHeroSection() {
  const t = useTranslations("Sustainability.Hero");

  return (
    <div className="relative bg-gray-section overflow-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="relative w-full aspect-[1200/1675] sm:aspect-auto sm:h-[34rem] lg:h-150 overflow-hidden"
      >
        {/* Desktop Background Image */}
        <div
          className="hidden md:block absolute inset-0 bg-cover bg-no-repeat bg-bottom"
          style={{
            backgroundImage: `url(${sustainabilityImage.src})`,
          }}
        />
        {/* Mobile Background Image */}
        <div
          className="md:hidden block absolute inset-0 bg-cover bg-no-repeat bg-bottom"
          style={{
            backgroundImage: "url('/mobile/sustainability/sustainability-hero.webp')",
          }}
        />
        <DotsOverlay className="z-1 opacity-70" />
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="z-20 absolute inset-0 flex flex-col py-10 sm:py-16 text-left container-inner"
      >
        <div className="mt-auto">
          <h1 className="font-extrabold text-white text-3xl leading-relaxed">{t("title")}</h1>
          <h2 className="font-extrabold text-white text-3xl">{t("subtitle")}</h2>
        </div>
      </motion.div>
    </div>
  );
}





