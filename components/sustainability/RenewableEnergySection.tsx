"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { MultilineText } from "../MultilineText";
export default function RenewableEnergySection() {
  const t = useTranslations("Sustainability.RenewableEnergy");
  return (
    <section className="bg-gray-section">
      <div className="flex flex-col-reverse items-center gap-16 lg:grid lg:grid-cols-2 container-inner">
        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="pb-4 lg:pb-0"
        >
          <h2 className="mb-10 font-extrabold text-primary text-3xl">
            <MultilineText text={t("title")} />
          </h2>
          <h3 className="font-bold text-off-black">{t("subtitle")}</h3>
          <div className="bg-light-dark mt-0.5 mb-2 w-12 h-px" />
          <p className="font-medium text-medium-dark leading-relaxed">{t("description")}</p>
        </motion.div>

        {/* Right Image */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="relative w-full h-120"
        >
          <Image
            src="/images/sustainability/energy.jpg"
            alt="Renewable Energy Operations"
            fill
            className="object-cover"
          />
        </motion.div>
      </div>
    </section>
  );
}
