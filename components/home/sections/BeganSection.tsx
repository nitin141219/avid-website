"use client";

import { Link } from "@/i18n/navigation";
import researchImage from "@/public/images/home/began/research.webp";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
const milestones = [
  {
    icon: "/images/home/began/Where-It-Began_icon.webp",
    key: "began",
    link: "/about-us#history",
  },
  {
    icon: "/images/home/began/How-we-Operate_icon.webp",
    key: "operate",
    link: "/about-us/manufacturing-excellence",
  },
  {
    icon: "/images/home/began/What-next_icon.webp",
    key: "next",
    link: "/sustainability",
  },
];

export default function BeganSection() {
  const t = useTranslations("milestones");

  return (
    <section className="bg-gray-section">
      <div className="gap-8 md:gap-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 py-10 sm:py-16 text-left container-inner">
        {milestones.map((item) => (
          <div key={item.key} className="flex flex-col items-start w-full">
            <div className="flex items-center gap-2">
              <Image
                src={item.icon}
                alt={item.key}
                className="flex-[0_0_48px] md:flex-[0_0_56px] min-w-12 md:min-w-14"
                width={56}
                height={56}
              />
              <h3 className="font-extrabold text-off-black text-xl md:text-2xl leading-tight">
                {t(`${item.key}.title.0`)} <br /> {t(`${item.key}.title.1`)}
              </h3>
            </div>
            <div className="my-4 border-light-dark border-t w-30"></div>
            <p className="mb-6 md:mb-10 font-medium text-medium-dark text-sm md:text-base leading-relaxed">
              {t(`${item.key}.description`)}
            </p>
            <Link
              href={item.link}
              className="flex justify-between items-center bg-secondary hover:bg-secondary/90 mt-auto px-4 py-2 w-full sm:w-fit sm:min-w-60 text-white text-sm"
            >
              {t(`${item.key}.button`)} <ArrowRight size={16} />
            </Link>
          </div>
        ))}
      </div>
      {/* <div className="relative w-full h-130"> */}
      {/* <Image
        src="/images/home/began/research.webp"
        alt="research"
        width={1200}
        height={800}
        className="w-full h-auto"
      /> */}
      {/* </div> */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: "easeInOut" }}
        className="relative w-full h-60 lg:h-80 xl:h-110 overflow-hidden"
      >
        <Image
          src={researchImage}
          alt="Research"
          fill
          className="object-cover"
          placeholder="blur"
        />
      </motion.div>
    </section>
  );
}

