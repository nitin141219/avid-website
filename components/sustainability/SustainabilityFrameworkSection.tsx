"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import Image from "next/image";

export default function SustainabilityFrameworkSection() {
  const t = useTranslations("Sustainability.SustainabilityFramework");
  const pillars = t.raw("items");

  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="bg-white py-20 container-inner"
    >
      <div>
        <h2 className="mb-6 font-extrabold text-primary text-2xl md:text-3xl">{t("title")}</h2>
        <h3 className="font-bold text-off-black">{t("subtitle")}</h3>
        <div className="bg-light-dark mt-0.5 mb-2 w-12 h-px" />
        <p className="font-medium text-medium-dark leading-relaxed">{t("description")}</p>
      </div>
      <div className="gap-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mt-16">
        {pillars.map((pillar: any, index: any) => (
          <div key={index} className="flex flex-col items-start w-full max-w-100">
            <div className="flex items-center gap-2">
              <div className="relative flex flex-[0_0_72px] justify-start items-center size-18">
                <Image src={pillar.icon} alt={pillar.title.join(" ")} fill />
              </div>
              <h3 className="font-extrabold text-off-black text-3xl leading-tight">
                {pillar.title[0]} <br /> {pillar.title[1]}
              </h3>
            </div>
            <div className="my-4 border-light-dark border-t w-30"></div>
            <p className="font-medium text-medium-dark leading-relaxed">{pillar.description}</p>
          </div>
        ))}
      </div>
    </motion.section>
  );
}
