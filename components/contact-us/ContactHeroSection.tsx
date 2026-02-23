"use client";

import contactUsImage from "@/public/images/contact-us/contactus_bg.jpg";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import DotsOverlay from "../dots-overlay/DotsOverlay";

export default function ContactHeroSection() {
  const [loaded, setLoaded] = useState(false);
  const t = useTranslations("menu")

  useEffect(() => {
    // Preload actual image
    const img = new Image();
    img.src = contactUsImage.src;
    img.onload = () => setLoaded(true);
    return () => { };
  }, []);
  return (
    <div className="relative bg-gray-section overflow-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="relative w-full h-150 overflow-hidden"
        style={{
          //   backgroundImage: `url(/images/market/animal.jpg)`,
          backgroundImage: `url(${loaded ? contactUsImage.src : contactUsImage.blurDataURL})`,
          filter: loaded ? "blur(0px)" : "blur(12px)",
          backgroundAttachment: "fixed",
          backgroundPosition: "bottom",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
      >
        <DotsOverlay className="z-1" />
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="container-inner flex flex-col py-16 text-left absolute inset-0 z-1"
      >
        <div className="mt-auto mb-20">
          <h1 className="text-3xl font-extrabold text-primary">{t("contact_us")}</h1>
        </div>
      </motion.div>{" "}
    </div>
  );
}
