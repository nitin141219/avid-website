"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import Image from "next/image";

export default function SocialResponsibilitySection() {
  const t = useTranslations("Sustainability.SocialResponsibility");
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="py-16 container-inner"
      id="social-responsibility"
    >
      {/* Top section */}
      <div className="flex flex-col-reverse items-end lg:gap-16 lg:grid lg:grid-cols-2">
        <div className="py-16 w-full">
          <h2 className="font-extrabold text-off-black text-2xl md:text-3xl">
            {t.rich("title", {
              br: () => <br />,
            })}
          </h2>
        </div>
        <div className="relative w-full h-72 sm:h-96 lg:h-120 overflow-hidden">
          <Image
            src="/images/sustainability/social-responsibility.webp"
            alt="Social Responsibility"
            fill
            className="object-cover"
          />
        </div>
      </div>
      {/* Features */}
      <div className="gap-16 grid md:grid-cols-2 my-16">
        {[
          {
            title: t("features.ethical.title"),
            desc: <>{t("features.ethical.description")}</>,
          },
          {
            title: t("features.health_safety.title"),
            desc: <>{t("features.health_safety.description")}</>,
          },
          {
            title: t("features.community.title"),
            desc: (
              <>
                {t("features.community.description")}
                <ul className="mt-2 pl-5 list-disc">
                  <li>{t("features.community.list.0")}</li>
                  <li>{t("features.community.list.1")}</li>
                  <li>{t("features.community.list.2")}</li>
                </ul>
              </>
            ),
          },
          {
            title: t("features.miyawaki.title"),
            desc: (
              <>
                {t("features.miyawaki.description_part1")}{" "}
                <span className="font-light text-3xl">{t("features.miyawaki.count")}</span>{" "}
                {t("features.miyawaki.description_part2")}
              </>
            ),
          },
        ].map((item) => (
          <div key={item.title} className="flex flex-col items-start w-full">
            <h3 className="font-extrabold text-off-black text-xl leading-tight">{item.title}</h3>
            <div className="bg-light-dark mt-2 mb-3 w-12 h-px"></div>
            <div className="font-medium text-medium-dark leading-relaxed">{item.desc}</div>
          </div>
        ))}
      </div>
    </motion.section>
  );
}
