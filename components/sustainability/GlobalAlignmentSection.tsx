"use client";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import Image from "next/image";

export default function GlobalAlignmentSection() {
  const t = useTranslations("Sustainability.GlobalAlignment");
  return (
    <section className="bg-gray-section">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="items-center gap-16 grid md:grid-cols-2 container-inner"
      >
        {/* Left Content */}
        <div className="py-10">
          <h2 className="font-extrabold text-primary text-3xl">{t("title")}</h2>
          <div className="bg-light-dark my-4 w-12 h-px"></div>
          <h3 className="mb-4 font-bold text-off-black">{t("subtitle")}</h3>
          <p className="mb-8 font-medium text-medium-dark leading-relaxed">{t("description")}</p>
          <ul className="space-y-4 mt-2 pl-5 font-medium text-medium-dark leading-relaxed list-disc">
            <li>
              <span className="font-bold text-off-black">{t("items.sdg.label")}</span>
              {t("items.sdg.text")}
            </li>
            <li>
              <span className="font-bold text-off-black">{t("items.paris.label")}</span>
              {t("items.paris.text")}
            </li>
            <li>
              <span className="font-bold text-off-black">{t("items.registry.label")}</span>
              {t("items.registry.text")}
            </li>
          </ul>
        </div>

        {/* Right Image */}
        <div className="relative w-full h-full min-h-120 overflow-hidden">
          <Image
            src="/images/sustainability/global.jpg"
            alt="Renewable Energy Operations"
            fill
            className="object-cover"
          />
        </div>
      </motion.div>
    </section>
  );
}
