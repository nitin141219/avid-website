"use client";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import Image from "next/image";

export default function OurVisionSection() {
  const t = useTranslations("Sustainability.OurVision");
  return (
    <section className="py-16">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="space-y-16 container-inner"
      >
        {/* Top section */}
        <div className="items-end md:gap-16 grid md:grid-cols-2">
          <div className="relative w-full h-120 overflow-hidden">
            <Image
              src="/images/sustainability/co2.jpg"
              alt="Environmental Stewardship"
              // width={600}
              // height={400}
              fill
              className="object-cover"
            />
          </div>
          <div className="py-16 w-full">
            <h2 className="font-extrabold text-primary text-2xl md:text-3xl">
              {t.rich("title", {
                br: () => <br />,
              })}
            </h2>
            <div className="bg-light-dark my-3 w-12 h-px"></div>
            <p className="mt-2 font-bold text-off-black">{t("subtitle")}</p>
          </div>
        </div>

        {/* Future targets */}
        <div className="flex md:flex-row flex-col justify-between items-start gap-10 w-full max-w-5xl">
          <div className="w-full max-w-50">
            <p className="font-light text-off-black text-6xl">{t("targets.ghg.value")}</p>
            <p className="font-medium text-medium-dark text-sm">
              {t("targets.ghg.text")} <br />
              {t("targets.ghg.by_text")} <span className="font-extrabold text-black/80">2030</span>
            </p>
          </div>
          <div className="w-full max-w-38">
            <p className="font-light text-off-black text-6xl">{t("targets.renewable.value")}</p>
            <p className="font-medium text-medium-dark text-sm">
              {t("targets.renewable.text")} <br />
              {t("targets.renewable.by_text")}{" "}
              <span className="font-extrabold text-black/80">2025</span>
            </p>
          </div>
          <div className="w-full max-w-65">
            <p className="font-light text-off-black text-6xl">{t("targets.net_zero.value")}</p>
            <p className="font-medium text-medium-dark text-sm">
              {t("targets.net_zero.by_text")}
              <span className="font-extrabold text-black/80"> 2040</span>
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
