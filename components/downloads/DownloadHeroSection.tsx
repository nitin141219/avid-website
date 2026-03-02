"use client";

import downloadsImage from "@/public/images/downloads/downloads.webp";
import { motion, useInView } from "framer-motion";
import { useTranslations } from "next-intl";
import { useRef } from "react";
import DotsOverlay from "../dots-overlay/DotsOverlay";

export default function DownloadHeroSection() {
  const t = useTranslations("menu.submenu");
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: true,
  });

  return (
    <div className="relative bg-gray-section overflow-hidden" ref={ref}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="relative w-full aspect-[1200/1675] sm:aspect-auto sm:h-[34rem] lg:h-150"
      >
        {/* Desktop Background Image */}
        <div
          className="hidden md:block absolute inset-0 bg-cover bg-no-repeat bg-bottom"
          style={{
            backgroundImage: `url(${downloadsImage.src})`,
          }}
        />
        {/* Mobile Background Image */}
        <div
          className="md:hidden block absolute inset-0 bg-cover bg-no-repeat bg-bottom"
          style={{
            backgroundImage: "url('/mobile/news/Downloads.webp')",
          }}
        />
        <DotsOverlay className="z-1" />
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="z-1 absolute inset-0 flex flex-col py-10 sm:py-16 text-left container-inner"
      >
        <div className="mt-auto mb-5">
          <h1 className="font-extrabold text-primary text-3xl">{t("downloads")}</h1>
        </div>
      </motion.div>
    </div>
  );
}





