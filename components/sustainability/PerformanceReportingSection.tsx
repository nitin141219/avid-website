"use client";

import greenImage from "@/public/images/sustainability/green.jpg";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import Image from "next/image";

const PerformanceReportingSection = () => {
  const t = useTranslations("Sustainability.PerformanceReporting");
  return (
    <section>
      <div className="relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className="relative w-full h-80 xl:h-110 overflow-hidden"
        >
          <Image
            src={greenImage}
            alt="Performance and Reporting"
            fill
            className="object-cover"
            placeholder="blur"
            quality={100}
          />
        </motion.div>
        <div className="z-20 absolute inset-0 flex flex-col py-16 text-left container-inner">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="mt-auto"
          >
            <h2 className="font-extrabold text-white text-3xl">
              {t.rich("title", {
                br: () => <br />,
              })}
            </h2>
            <div className="bg-white/60 my-3 w-12 h-px"></div>
            <p className="max-w-3xl font-medium text-white">{t("subtitle")}</p>
          </motion.div>
        </div>
      </div>
      <div className="py-16 container-inner">
        <p className="w-full max-w-3xl font-medium text-medium-dark">{t("description")}</p>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="gap-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 my-8"
        >
          {[
            {
              icon: "/images/sustainability/icon-8.png",
              title: t("items.ghg"),
            },
            {
              icon: "/images/sustainability/icon-9.png",
              title: t("items.water"),
            },
            {
              icon: "/images/sustainability/icon-10.png",
              title: t("items.health"),
            },
            {
              icon: "/images/sustainability/icon-11.png",
              title: t("items.diversity"),
            },
            {
              icon: "/images/sustainability/icon-12.png",
              title: t("items.governance"),
            },
          ].map((i) => (
            <div key={i.icon} className="flex flex-col flex-1 min-h-full">
              <div className="flex justify-center items-center bg-primary p-4 h-30">
                <div className="relative size-20">
                  <Image src={i.icon} alt={i.title} fill />
                </div>
              </div>
              <div className="flex-1 bg-gray-section p-4 font-medium text-medium-dark text-center">
                {i.title}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default PerformanceReportingSection;
