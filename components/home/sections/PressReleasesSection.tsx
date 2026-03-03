"use client";

import useEmblaCarousel from "embla-carousel-react";
import { motion } from "framer-motion";
import { MoveRight } from "lucide-react";
import { DateTime } from "luxon";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import type { WheelEvent } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "@/components/AvidToast";
import { getResponsiveImageSources } from "@/lib/utils";
import styles from "../styles/press-release.module.css"; // ✅ Module import

interface PressReleasesProps {
  title: string;
  initialNews?: any[];
}

export default function PressReleasesSection({ title, initialNews = [] }: PressReleasesProps) {
  const locale = useLocale();
  const [newsData, setNewsData] = useState(initialNews);
  const [loading, setLoading] = useState(initialNews.length === 0);
  const [isHovered, setIsHovered] = useState(false);
  const lastWheelAt = useRef(0);
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "center",
  });

  const handleWheel = useCallback(
    (event: WheelEvent<HTMLDivElement>) => {
      if (!emblaApi) return;

      const now = Date.now();
      if (now - lastWheelAt.current < 280) return;
      lastWheelAt.current = now;

      const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
      if (delta === 0) return;

      event.preventDefault();
      if (delta > 0) {
        emblaApi.scrollNext();
      } else {
        emblaApi.scrollPrev();
      }
    },
    [emblaApi]
  );

  const fetchNews = async () => {
    setLoading(true);
    const query = new URLSearchParams({
      limit: String(6),
      page: String(1),
      locale,
    }).toString();
    try {
      const res = await fetch(`/api/news?${query}`);
      const data = await res.json();
      if (!res.ok) {
        toast.error(data?.message || "Get News failed");
      }
      setNewsData(Array.isArray(data?.data?.news) ? data.data.news : []);
    } catch (error: any) {
      setNewsData([]);
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialNews.length > 0) return;
    fetchNews();
  }, [initialNews.length, locale]);

  useEffect(() => {
    if (!emblaApi || newsData.length <= 1 || isHovered) return;

    const interval = window.setInterval(() => {
      emblaApi.scrollNext();
    }, 3000);

    return () => window.clearInterval(interval);
  }, [emblaApi, isHovered, newsData.length]);

  if (loading) {
    return (
      <section className="relative bg-primary py-10 sm:py-16 overflow-hidden text-white">
        <div className={`container-inner relative ${styles.press}`}>
          <h2 className="mb-10 sm:mb-16 font-extrabold text-2xl md:text-3xl max-lg:text-center">
            {title}
          </h2>
          <div className={styles.viewport}>
            <div className={styles.container}>
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className={styles.slide}>
                  <div className="flex flex-col h-full">
                    <div className="bg-white/20 w-full aspect-video animate-pulse" />
                    <div className="py-5 text-left">
                      <div className="bg-white/20 mb-3 w-4/5 h-5 animate-pulse" />
                      <div className="bg-white/20 mb-6 w-3/5 h-5 animate-pulse" />
                      <div className="bg-white/30 mb-4 w-20 h-px" />
                      <div className="bg-white/20 w-24 h-4 animate-pulse" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (newsData?.length === 0 || !newsData) {
    return (
      <section className="relative bg-primary py-10 sm:py-16 overflow-hidden text-white">
        <div className={`container-inner relative ${styles.press}`}>
          <h2 className="mb-10 sm:mb-16 font-extrabold text-2xl md:text-3xl max-lg:text-center">
            {title}
          </h2>
          <div className="text-center text-white/80">
            News & announcements will appear here shortly.
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative bg-primary py-10 sm:py-16 overflow-hidden text-white">
      <div className={`container-inner relative ${styles.press}`}>
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="mb-10 sm:mb-16 font-extrabold text-2xl md:text-3xl max-lg:text-center"
        >
          {title}
        </motion.h2>
        {/* Embla Carousel */}
        <div
          className={`${styles.viewport} cursor-grab active:cursor-grabbing`}
          ref={emblaRef}
          onWheel={handleWheel}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
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
                        width={480}
                        height={280}
                        alt={item?.title}
                        sizes="(min-width: 768px) 480px, 100vw"
                        className="hidden md:block w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 group-active:scale-105"
                      />
                      <Image
                        src={imageSource.mobile}
                        width={480}
                        height={280}
                        alt={item?.title}
                        sizes="(max-width: 767px) 100vw, 480px"
                        className="md:hidden w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 group-active:scale-105"
                      />
                  </div>
                  <div className="flex flex-col flex-1 justify-between py-5 text-left">
                    <div>
                      <h3 className="text-base xl:text-xl">
                        <span className="font-bold">{item.title}</span>
                      </h3>
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
                          className="transition-all -translate-x-4 group-hover:translate-x-0 group-active:translate-x-0 duration-300"
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


