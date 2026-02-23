"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import Image from "next/image";

export default function EnvironmentalStewardshipSection() {
  const t = useTranslations("Sustainability.EnvironmentalStewardship");
  const features = t.raw("features");
  return (
    <section
      className="z-0 relative bg-gray-section py-8 overflow-x-hidden"
      id="environmental-stewardship"
    >
      <div className="top-0 -right-6 -z-1 absolute size-85">
        <Image src="/assets/svg/bg.svg" alt="footer-bg" fill priority />
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="space-y-16 container-inner"
      >
        {/* Top section */}
        <div className="items-end lg:gap-16 grid grid-cols-1 lg:grid-cols-2">
          <div className="relative w-full h-120 overflow-hidden">
            <Image
              src="/images/sustainability/enviormental.jpg"
              alt="Environmental Stewardship"
              fill
              className="object-cover duration-300"
            />
          </div>
          <div className="py-16 w-full">
            <h2 className="font-extrabold text-off-black text-2xl md:text-3xl">
              {t.rich("title", {
                br: () => <br />,
              })}
            </h2>
          </div>
        </div>

        {/* Features */}
        <div className="gap-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((item: any) => (
            <div key={item.title} className="flex flex-col items-start w-full max-w-100">
              <div className="flex items-center gap-2 mb-4">
                <div className="relative flex flex-[0_0_72px] justify-start items-center h-full min-h-18 size-18">
                  <Image
                    src={item.icon}
                    alt={item.title}
                    className="w-full h-auto object-contain"
                    fill
                  />
                </div>
                <h3 className="font-extrabold text-off-black text-xl leading-tight">
                  {item.title}
                </h3>
              </div>
              <p className="font-medium text-medium-dark leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Future targets */}
        <div>
          <h3 className="mb-4 font-extrabold text-off-black text-xl leading-tight">
            {t("future_targets.title")}
          </h3>
          <div className="flex md:flex-row flex-col items-start md:items-center gap-10">
            <div className="flex items-center gap-3 w-full max-w-64">
              <p className="font-light text-off-black text-6xl">
                {t("future_targets.target1.value")}
              </p>
              <p className="font-medium text-medium-dark text-xs">
                {t("future_targets.target1.text")}{" "}
                <span className="font-extrabold text-black/80">2030</span>
              </p>
            </div>
            <div className="max-md:hidden bg-gray-400 w-0.5 h-10" />
            <div className="flex items-center gap-3 w-full">
              <p className="font-light text-off-black text-6xl">
                {t("future_targets.target2.value")}
              </p>
              <p className="mt-auto mb-1 font-medium text-medium-dark text-xs">
                {t("future_targets.target2.text")}
                <span className="font-extrabold text-black/80"> 2040</span>
              </p>
            </div>
          </div>
        </div>

        <div className="flex md:flex-row flex-col justify-between items-start gap-10 pt-10">
          <div className="space-y-1">
            <p className="font-medium text-medium-dark leading-relaxed">{t("reporting.text1")}</p>
            <Image
              src="/images/sustainability/climate_registry.png"
              alt="The Climate Registry"
              width={200}
              height={60}
              unoptimized
            />
            <p className="font-medium text-medium-dark leading-relaxed">{t("reporting.text2")}</p>
          </div>
          <div>
            <h3 className="font-bold text-off-black">{t("reporting.validation_title")}</h3>
            <div className="bg-light-dark my-2 w-12 h-px"></div>
            <h3 className="font-bold text-off-black">{t("reporting.iso")}</h3>
            <p className="font-medium text-medium-dark leading-relaxed">
              {t("reporting.commitment")}
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
