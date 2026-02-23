"use client";

import leadershipImage from "@/public/images/leadership/leadership-bg.jpg";
import leadershipMobile from "@/public/mobile/about-us/executive-leadership.jpg";
import { motion, useInView } from "framer-motion";
import { useTranslations } from "next-intl";
import { useRef } from "react";
import DotsOverlay from "../dots-overlay/DotsOverlay";

export default function ExecutiveLeadershipHeroSection() {
  const t = useTranslations("menu");
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
        className="relative w-full h-150"
      >
        {/* Desktop Background Image */}
        <div
          className="hidden md:block absolute inset-0 bg-cover bg-no-repeat bg-bottom bg-fixed"
          style={{
            backgroundImage: `url(${leadershipImage.src})`,
          }}
        />
        {/* Mobile Background Image */}
        <div
          className="md:hidden block absolute inset-0 bg-cover bg-no-repeat bg-bottom"
          style={{
            backgroundImage: `url(${leadershipMobile.src})`,
          }}
        />
        <DotsOverlay className="z-1" />
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="z-1 absolute inset-0 flex flex-col py-16 text-left container-inner"
      >
        <div className="mt-auto mb-20">
          <h1 className="font-extrabold text-white text-3xl">{t("submenu.leadership")}</h1>
        </div>
      </motion.div>{" "}
    </div>
  );
}
