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
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
            className="mb-3 font-extrabold text-primary text-3xl md:text-4xl"
          >
            {title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
            className="font-normal text-medium-dark text-base xl:text-xl"
          >
            {subTitle}
          </motion.p>
        </div>
        {/* Hero Image */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
          className="relative mx-auto mt-8 rounded-lg w-full h-full overflow-hidden"
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
            className="hidden md:block w-full object-cover"
          />
          <Image
            src={heroImage.mobile}
            alt={data?.title || "Blog image"}
            width={IMAGE_DIMENSION.NEWS.width}
            height={IMAGE_DIMENSION.NEWS.height}
            sizes="(max-width: 767px) 100vw, 1120px"
            className="md:hidden w-full object-cover"
          />
        </motion.div>
      </div>
    </section>
  );
}
