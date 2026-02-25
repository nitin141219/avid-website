"use client";

import { Button } from "@/components/ui/button";
import useEmblaCarousel from "embla-carousel-react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, MoveRight } from "lucide-react";
import { DateTime } from "luxon";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import { useCallback, useEffect, useState } from "react";
import { toast } from "@/components/AvidToast";
import { getResponsiveImageSources } from "@/lib/utils";
import styles from "../styles/press-release.module.css"; // ✅ Module import

interface PressReleasesProps {
  title: string;
}

export default function PressReleasesSection({ title }: PressReleasesProps) {
  const locale = useLocale();
  const [newsData, setNewsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "center",
  });

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  const fetchNews = async () => {
    setLoading(true);
    const query = new URLSearchParams({
      limit: String(6),
      page: String(1),
    }).toString();
    try {
      const res = await fetch(`/api/news?${query}`, {
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data?.message || "Get News failed");
      }
      setNewsData(data?.data?.news);
    } catch (error: any) {
      setNewsData([]);
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  if (loading || newsData?.length === 0 || !newsData) {
    return null;
  }

  return (
    <section className="relative bg-primary py-10 sm:py-16 overflow-hidden text-white">
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
        {newsData?.length > 3 ? (
          <>
            <Button
              onClick={scrollPrev}
              size="icon"
              variant="link"
              className="hidden md:flex top-1/2 -left-5 z-10 absolute text-white -translate-y-1/2"
            >
              <ChevronLeft strokeWidth={1} className="size-10" />
            </Button>
            <Button
              onClick={scrollNext}
              size="icon"
              variant="link"
              className="hidden md:flex top-1/2 -right-5 z-10 absolute text-white -translate-y-1/2"
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
            {newsData?.map((item: any) => {
              const imageSource = getResponsiveImageSources(item);

              return (
                <Link
                  href={`/media/news/${item.slug}`}
                  key={item?._id}
                  className={styles.slide}
                >
                  <div className="flex flex-col h-full transition group">
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
                  <div className="flex flex-col flex-1 justify-between py-5 text-left">
                    <div>
                      <h3 className="inline-block font-bold text-base xl:text-xl">
                        {item.title}
                      </h3>{" "}
                      {item.sub_title && (
                        <span className="font-normal text-white/85 text-base xl:text-xl">
                          {item.sub_title}
                        </span>
                      )}
                    </div>
                    <div>
                      <div className="bg-white/70 mt-8 mb-5 w-25 h-px"></div>
                      <div className="flex justify-between items-center text-gray-200 text-sm">
                        <span>
                          {item.published_at
                            ? DateTime.fromISO(item.published_at).setLocale(locale).toFormat("DDD")
                            : null}
                        </span>
                        <MoveRight
                          size={24}
                          className="transition-all -translate-x-4 group-hover:translate-x-0 duration-300"
                          strokeWidth={1}
                        />
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
