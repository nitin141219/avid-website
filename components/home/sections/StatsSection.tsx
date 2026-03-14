"use client";

import DotsOverlay from "@/components/dots-overlay/DotsOverlay";
import { useTranslations } from "next-intl";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";

const stats = [
  {
    value: 2000,
    suffix: "+",
    title: "mt_annual",
    subtitle: "glycolic_acid_capacity",
  },
  {
    value: 2400,
    suffix: "+",
    title: "mt_annual",
    subtitle: "glycine_capacity",
  },
  {
    value: 19,
    suffix: "+",
    title: "years",
    subtitle: "manufacturing_excellence",
  },
];

export default function StatsSection() {
  const t = useTranslations("stats");
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.5,
  });

  return (
    <section ref={ref} className="bg-white pt-10 pb-6 sm:py-16">
      <div className="container-inner grid sm:grid-cols-3 md:grid-cols-[auto_auto_auto] gap-6 justify-between">
        {stats.map((stat, i) => (
          <div key={i} className="flex flex-col min-w-fit md:min-w-55 lg:min-w-70 xl:min-w-80">
            <h2 className="text-[70px] sm:text-[60px] md:text-[70px] xl:text-[80px] 2xl:text-[100px] font-light text-primary leading-none">
              {inView ? <CountUp end={stat.value} duration={4} separator="" /> : 0}
              {stat.suffix}
            </h2>
            <div className="my-3 h-px w-15 bg-light-dark"></div>
            <p className="text-base sm:text-sm md:text-base xl:text-lg text-medium-dark font-medium">
              {t(stat.title)} <br /> {t(stat.subtitle)}
            </p>
          </div>
        ))}
      </div>
      <div className="w-full h-10 sm:h-14 mt-6 sm:mt-14 relative">
        <DotsOverlay opacity={0.7} />
      </div>
    </section>
  );
}
