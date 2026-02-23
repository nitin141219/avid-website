"use client";

import pressImage from "@/public/images/news/press.jpg";
import pressMobile from "@/public/mobile/news/mobilepress.jpg";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import DotsOverlay from "../dots-overlay/DotsOverlay";

export default function NewsHeroSection() {
  const t = useTranslations("news");

  return (
    <div className="relative bg-gray-section overflow-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="relative w-full h-150 overflow-hidden"
      >
        {/* Desktop Background Image */}
        <div
          className="hidden md:block absolute inset-0 bg-cover bg-no-repeat bg-bottom-right bg-fixed"
          style={{
            backgroundImage: `url(${pressImage.src})`,
          }}
        />
        {/* Mobile Background Image */}
        <div
          className="md:hidden block absolute inset-0 bg-cover bg-no-repeat bg-bottom-right"
          style={{
            backgroundImage: `url(${pressMobile.src})`,
          }}
        />
        <DotsOverlay className="z-1 opacity-70" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="z-20 absolute inset-0 flex flex-col py-16 text-left container-inner"
      >
        <div className="mt-auto">
          <h1 className="font-extrabold text-primary text-3xl">{t("title")}</h1>
        </div>
      </motion.div>
    </div>
  );
}
