"use client";

import DotsOverlay from "@/components/dots-overlay/DotsOverlay";
import jobsImage from "@/public/images/life/Jobs.jpg";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

export default function JobsHeroSection() {
  const t = useTranslations("menu.submenu");

  return (
    <div className="relative bg-gray-section overflow-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="relative w-full h-[26rem] sm:h-[34rem] lg:h-150 overflow-hidden"
      >
        {/* Desktop Background Image */}
        <div
          className="hidden md:block absolute inset-0 bg-cover bg-no-repeat bg-bottom"
          style={{
            backgroundImage: `url(${jobsImage.src})`,
          }}
        />
        {/* Mobile Background Image */}
        <div
          className="md:hidden block absolute inset-0 bg-cover bg-no-repeat bg-bottom"
          style={{
            backgroundImage: `url(${jobsImage.src})`,
          }}
        />
        <DotsOverlay className="z-1" />
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="z-1 absolute inset-0 flex flex-col py-10 sm:py-16 text-left container-inner"
      >
        <div className="mt-auto mb-8 sm:mb-20">
          <h1 className="font-extrabold text-primary text-3xl">{t("jobs")}</h1>
        </div>
      </motion.div>{" "}
    </div>
  );
}
