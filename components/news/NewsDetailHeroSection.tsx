"use client";

import { IMAGE_DIMENSION } from "@/constants";
import { getResponsiveImageSources } from "@/lib/utils";
import { motion } from "framer-motion";
import { DateTime } from "luxon";
import Image from "next/image";
import { useLocale } from "next-intl";
import { getLocalizedContent } from "@/lib/getLocalizedContent";

export default function NewsDetailHeroSection({ data }: any) {
  const locale = useLocale();
  const heroImage = getResponsiveImageSources(data);
  const date = data.published_at
    ? DateTime.fromISO(data.published_at).setLocale(locale).toFormat("DDD")
    : null;
  const title = getLocalizedContent(data, "title", locale);
  const subTitle = getLocalizedContent(data, "sub_title", locale);
  return (
    <section className="bg-white">
      <div className="py-10">
        <div className="mb-8">
          {/* Date */}
          <div className="py-2 w-max font-medium text-primary text-base">
            {date} {data?.author ? "| " + data?.author : ""}
          </div>
          {/* Title */}
          <motion.h1
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="mb-3 font-extrabold text-primary text-3xl md:text-4xl"
          >
            {title}
          </motion.h1>
          <motion.p
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="font-normal text-medium-dark text-base xl:text-xl"
          >
            {subTitle}
          </motion.p>
        </div>
        {/* Hero Image */}
        <motion.div
          initial={false}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="parallax-hero relative mx-auto mt-8 rounded-lg w-full h-full overflow-hidden"
          style={{
            maxWidth: IMAGE_DIMENSION.NEWS.width,
            maxHeight: IMAGE_DIMENSION.NEWS.height,
          }}
        >
          <Image
            src={heroImage.desktop}
            alt={data?.title || "Blog image"}
            width={IMAGE_DIMENSION.NEWS.width}
            height={IMAGE_DIMENSION.NEWS.height}
            sizes="(min-width: 768px) 1120px, 100vw"
            className="parallax-hero__image hidden md:block w-full object-cover will-change-transform"
          />
          <Image
            src={heroImage.mobile}
            alt={data?.title || "Blog image"}
            width={IMAGE_DIMENSION.NEWS.width}
            height={IMAGE_DIMENSION.NEWS.height}
            sizes="(max-width: 767px) 100vw, 1120px"
            className="parallax-hero__image md:hidden w-full object-cover will-change-transform"
          />
        </motion.div>
      </div>
    </section>
  );
}
