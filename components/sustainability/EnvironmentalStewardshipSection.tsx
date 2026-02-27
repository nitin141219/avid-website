"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import Image from "next/image";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";

export default function EnvironmentalStewardshipSection() {
  const t = useTranslations("Sustainability.EnvironmentalStewardship");
  const features = t.raw("features");
  const target1Text = t("future_targets.target1.text");
  const target1TextWithBreak = target1Text.replace(" (", "\n(");
  const target2Value = t("future_targets.target2.value");
  const target2Number = Number.parseFloat(target2Value.replace(/[^0-9.-]/g, ""));
  const target2IsNumeric = Number.isFinite(target2Number);
  // Improved intersection observer for mobile reliability
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.05, // Lower threshold for mobile
    rootMargin: "0px 0px 0px 0px", // Remove negative margin
  });
  return (
    <section
      ref={ref}
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
          <div className="relative w-full h-72 sm:h-96 lg:h-120 overflow-hidden">
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
              {/* Animated counter for Miyawaki Forest Initiative and vision numbers */}
              {item.count ? (
                <p className="font-medium text-medium-dark leading-relaxed">
                  {item.description_part1}{" "}
                  {inView ? (
                    <CountUp
                      end={Number.parseInt(String(item.count).replace(/[^\d-]/g, ""), 10) || 0}
                      duration={4}
                      separator="," 
                      className="font-bold text-primary text-2xl"
                    />
                  ) : (
                    <span className="font-bold text-primary text-2xl">0</span>
                  )}
                  {" "}{item.description_part2}
                </p>
              ) : (
                <p className="font-medium text-medium-dark leading-relaxed">{item.desc}</p>
              )}
            </div>
          ))}
        </div>

        {/* Future targets */}
        <div>
          <h3 className="mb-4 font-extrabold text-off-black text-xl leading-tight">
            {t("future_targets.title")}
          </h3>
          <div className="flex md:flex-row flex-col items-start md:items-end gap-8 md:gap-10">
            <div className="grid grid-cols-[auto_1fr] items-end gap-3 w-full md:max-w-[26rem]">
              <p className="font-light text-off-black text-6xl leading-none whitespace-nowrap flex-shrink-0">
                {inView ? (
                  <CountUp
                    end={50}
                    duration={4}
                    suffix="%"
                    className="font-light text-off-black text-6xl leading-none whitespace-nowrap"
                  />
                ) : (
                  <span className="font-light text-off-black text-6xl leading-none whitespace-nowrap">0%</span>
                )}
              </p>
              <p className="font-medium text-medium-dark text-xs leading-relaxed max-w-[16rem] whitespace-pre-line">
                {target1TextWithBreak} {" "}
                <span className="font-extrabold text-black/80">2030</span>
              </p>
            </div>
            <div className="max-md:hidden bg-gray-400 w-0.5 h-10" />
            <div className="grid grid-cols-[auto_1fr] items-end gap-3 w-full">
              <p className="font-light text-off-black text-6xl leading-none whitespace-nowrap flex-shrink-0">
                {target2IsNumeric ? (
                  inView ? (
                    <CountUp
                      end={target2Number}
                      duration={4}
                      suffix="%"
                      className="font-light text-off-black text-6xl leading-none whitespace-nowrap"
                    />
                  ) : (
                    <span className="font-light text-off-black text-6xl leading-none whitespace-nowrap">0%</span>
                  )
                ) : (
                  target2Value
                )}
              </p>
              <p className="mb-1 font-medium text-medium-dark text-xs leading-relaxed">
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
              sizes="200px"
            />
            <p className="font-medium text-medium-dark leading-relaxed">{t("reporting.text2")}</p>
            {/* No animated counters here, just static text */}
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
