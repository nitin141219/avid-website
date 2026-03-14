"use client";

import DotsOverlay from "@/components/dots-overlay/DotsOverlay";
import { Link } from "@/i18n/navigation";
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { getResponsiveImageSources } from "@/lib/utils";

const markets = [
  {
    title: "title",
    href: "#",
    isPrimary: true,
  },
  {
    title: "personal_care",
    href: "/market/personal-care-and-cosmetics",
    img: "/images/home/markets/Personal-Care-image.webp",
    icon: "/images/home/markets/Personal-Care-icon.webp",
  },
  {
    title: "pharma",
    href: "/market/pharmaceuticals",
    img: "/images/home/markets/Pharmaceuticals-Image.webp",
    icon: "/images/home/markets/Pharmaceuticals-icon.webp",
  },
  {
    title: "food_beverage",
    href: "/market/food-and-beverages",
    img: "/images/home/markets/Food-Beverage-Image.webp",
    icon: "/images/home/markets/Food-Beverage-Icon.webp",
  },
  {
    title: "animal_nutrition",
    href: "/market/animal-nutrition",
    img: "/images/home/markets/Animal-Nutrition-image.webp",
    icon: "/images/home/markets/Animal-Nutrition-icon.webp",
  },
  {
    title: "industrial",
    href: "/market/industrial-and-specialty-applications",
    img: "/images/home/markets/Industrial-Specialty-Applications-image.webp",
    icon: "/images/home/markets/Industrial-Specialty-Applications-icon.webp",
  },
];

export default function OurMarkets() {
  const t = useTranslations("our-market");
  return (
    <section className="pt-10 pb-6 sm:pt-14 sm:pb-7 bg-white">
      <div className="container-inner">
        {/* <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="text-2xl md:text-3xl font-extrabold text-gray-800 mb-6 sm:mb-12"
        >
          Our Markets
        </motion.h2> */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="grid gap-3 xs:gap-5 sm:gap-8 grid-cols-2 lg:grid-cols-3"
        >
          {markets.map((item) => {
            return item.isPrimary ? (
              <div
                key={item.title}
                className="bg-primary text-white px-4 xs:px-8 sm:px-12 flex items-center justify-center"
              >
                <p className="text-sm xs:text-base sm:text-2xl font-semibold leading-relaxed">
                  {t(item.title)}
                </p>
              </div>
            ) : (
              <div key={item.title}>
                <Link href={item.href} className="group relative overflow-hidden block">
                  {/* Background image */}
                  {item.img && (
                    (() => {
                      const imageSource = getResponsiveImageSources(
                        {
                          image: item.img,
                          imageMobile: (item as any).imgMobile,
                          mobileImage: (item as any).mobileImg,
                        },
                        item.img
                      );

                      return (
                        <>
                          <Image
                            src={imageSource.desktop}
                            alt={item.title}
                            width={400}
                            height={300}
                            sizes="(min-width: 1280px) 24vw, (min-width: 1024px) 29vw, (min-width: 768px) 31vw, 46vw"
                            className="hidden md:block object-cover w-full h-full transition-transform duration-500 group-hover:scale-120"
                          />
                          <Image
                            src={imageSource.mobile}
                            alt={item.title}
                            width={400}
                            height={300}
                            sizes="(max-width: 767px) 46vw, 400px"
                            className="md:hidden object-cover w-full h-full transition-transform duration-500 group-hover:scale-120"
                          />
                        </>
                      );
                    })()
                  )}

                  {/* Centered icon + title */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-1 sm:p-4">
                    {item.icon && (
                      <Image
                        src={item.icon}
                        alt={`${item.title} icon`}
                        width={70}
                        height={70}
                        loading="lazy"
                        sizes="70px"
                        className="mb-1 sm:mb-2 size-8 xs:size-10 sm:size-15 xl:size-17.5"
                        aria-hidden="true"
                      />
                    )}
                    <p className="text-[10px] xs:text-xs sm:text-sm xl:text-base font-light">
                      {t(item.title)}
                    </p>
                    <ExternalLink
                      strokeWidth={1.5}
                      className="group-hover:scale-130 transition-transform duration-300 mt-1  sm:mt-3 size-4 sm:size-6 min-h-4 sm:min-h-6"
                    />
                  </div>
                </Link>
              </div>
            );
          })}
        </motion.div>
      </div>
      <div className="w-full h-10 sm:h-14 mt-6 sm:mt-14 relative">
        <DotsOverlay opacity={0.7} />
      </div>
    </section>
  );
}
