"use client";

import { Button } from "@/components/ui/button";
import useEmblaCarousel from "embla-carousel-react";
import { motion } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { DateTime } from "luxon";
import Image from "next/image";
import { useCallback } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { getResponsiveImageSources } from "@/lib/utils";
import styles from "./styles/style.module.css"; // ✅ Module import

interface BlogRelatedPostSectionProps {
  title: string;
  postList: any[];
}

export default function BlogRelatedPostSection({ title, postList }: BlogRelatedPostSectionProps) {
  const locale = useLocale();
  const tCommon = useTranslations("common");
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "center",
  });

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  return (
    <section className="relative py-10 sm:py-16 overflow-hidden text-off-black">
      <div className={`container-inner relative ${styles.press}`}>
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="mb-10 sm:mb-16 font-extrabold text-2xl md:text-3xl max-lg:text-center"
        >
          {title}
        </motion.h2>
        {postList?.length > 3 ? (
          <>
            <Button
              onClick={scrollPrev}
              size="icon"
              variant="link"
              className="hidden md:flex top-1/2 -left-5 z-10 absolute text-off-black -translate-y-1/2"
            >
              <ChevronLeft strokeWidth={1} className="size-10" />
            </Button>
            <Button
              onClick={scrollNext}
              size="icon"
              variant="link"
              className="hidden md:flex top-1/2 -right-5 z-10 absolute text-off-black -translate-y-1/2"
            >
              <ChevronRight strokeWidth={1} className="size-10" />
            </Button>
          </>
        ) : null}

        {/* Embla Carousel */}
        <div className={`${styles.viewport} cursor-grab active:cursor-grabbing`} ref={emblaRef}>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className={styles.container}
          >
            {postList?.map((item: any) => {
              const imageSource = getResponsiveImageSources(item);

              return (
                <Link
                  href={`/media/blog/${item.slug}`}
                  key={item?._id}
                  className={styles.slide}
                >
                  <div className="flex flex-col bg-gray-section h-full transition group">
                    <div className="w-full aspect-video overflow-hidden">
                      <Image
                        src={imageSource.desktop}
                        unoptimized
                        width={480}
                        height={280}
                        alt={item?.title}
                        className="hidden md:block w-full h-full object-cover"
                      />
                      <Image
                        src={imageSource.mobile}
                        unoptimized
                        width={480}
                        height={280}
                        alt={item?.title}
                        className="md:hidden w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex flex-col flex-1 justify-between p-5">
                      <div>
                        <h3 className="inline-block font-bold text-off-black text-base xl:text-xl">
                          {item.title}
                          {item.sub_title ? ":" : ""}
                        </h3>{" "}
                        {item.sub_title && (
                          <span className="font-normal text-medium-dark text-base xl:text-xl">
                            {item.sub_title}
                          </span>
                        )}
                      </div>
                      <div>
                        <div className="bg-light-dark mt-8 mb-5 w-25 h-px"></div>
                        <div className="flex justify-between items-center text-medium-dark text-sm">
                          <span>
                            {item.published_at
                              ? DateTime.fromISO(item.published_at).setLocale(locale).toFormat("DDD")
                              : null}
                          </span>
                          <Button variant="secondary">
                            {tCommon("more_details")} <ArrowRight />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
