"use client";

import { ArrowRight, MoveRight } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { getResponsiveImageSources } from "@/lib/utils";
import DotsOverlay from "../dots-overlay/DotsOverlay";
import { MarketPageData } from "./data";
import MarketHeroSection from "./sections/MarketHeroSection";

export default function MarketTemplate({
  data,
  slug,
}: {
  data: MarketPageData;
  slug: string;
}) {
  const marketT = useTranslations("market");
  const t = useTranslations("market." + slug);
  const menuT = useTranslations("menu");
  return (
    <section>
      {/* Hero Section */}
      <MarketHeroSection data={data.hero} t={t} />
      {/* Description Section */}
      <div className="py-16 container-inner">
        <div className="md:gap-16 md:columns-2 font-medium text-medium-dark">
          {t(data.description)}
        </div>
      </div>

      {/* Solutions Section */}
      <div className="py-16 container-inner">
        <h2 className="mb-10 font-extrabold text-primary text-3xl">
          {marketT("our_solution")} <br />
          {t(data.hero.title)}
        </h2>

        <div className="gap-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {data.solutions.map((s, i) => (
            <div key={i}>
              <h3 className="font-bold text-off-black">{t(s.title)}</h3>
              <div className="bg-light-dark mt-0.5 mb-2 w-12 h-px"></div>
              <p className="font-medium text-medium-dark leading-relaxed">{t(s.text)}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="relative mb-5 w-full h-14">
        <DotsOverlay opacity={0.7} />
      </div>
      {/* Featured Products Section */}

      <div className="relative bg-primary">
        <div className="py-16 container-inner">
          <h2 className="mb-16 font-extrabold text-white text-3xl">
            {marketT("featured_products")}
          </h2>

          <div className="gap-16 grid sm:grid-cols-2">
            {data.products.map((p, i) => {
              const imageSource = getResponsiveImageSources(p as any);

              return (
              <Link href={p.link} key={i} className="group max-w-100">
                {/* Image Block */}
                <div className="relative w-full aspect-2/1 overflow-hidden">
                  <Image
                    src={imageSource.desktop}
                    alt={p?.title?.src}
                    fill
                    className="hidden md:block object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <Image
                    src={imageSource.mobile}
                    alt={p?.title?.src}
                    fill
                    className="md:hidden object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="z-1 absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(255,255,255),transparent_50%)] pointer-events-none"></div>
                  <div className="z-1 absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(255,255,255),transparent_20%)] pointer-events-none"></div>
                  <div className="bottom-6 left-4 z-2 absolute drop-shadow text-normal-black">
                    {p?.title?.type === "icon" ? (
                      <div className="w-[100px] h-[20px] relative">
                        <Image
                          width={100}
                          height={20}
                          quality={100}
                          src={p?.title?.src}
                          alt={p?.title?.src}
                          className={p?.title?.className || "object-contain"}
                        />
                      </div>
                    ) : (
                      <h3 className={(p?.subtitle ? "" : "mb-9") + " text-[28px] font-black"}>
                        {p?.title?.src}
                      </h3>
                    )}
                    {p?.subtitle && (
                      <>
                        <div className="border-light-dark border-b w-12"></div>
                        <p
                          className={`pr-8 font-normal text-medium-dark leading-snug ${
                            p?.subtitleClassName || "text-base sm:text-lg"
                          }`}
                        >
                          {t.has(p?.subtitle) ? t(p?.subtitle) : p?.subtitle}
                        </p>
                      </>
                    )}
                  </div>
                  <div className="right-3 bottom-3 z-2 absolute">
                    <ArrowRight size={18} className="opacity-100" />
                  </div>
                </div>

                {/* Underline */}
                <div className="mt-4 mb-2 border-white/60 border-b w-12"></div>

                {/* Description */}
                <p className="text-white leading-relaxed">{t(p.desc)}</p>
              </Link>
            );
            })}

            <Link
              href="/contact-us"
              className="inline-flex items-center gap-4 col-start-1 bg-white hover:bg-gray-200 mt-0 px-4 py-2 w-fit h-9 font-medium text-off-black transition"
            >
              {menuT("contact_us")} <MoveRight className="size-5" strokeWidth={2} />
            </Link>
          </div>
        </div>
        {data.products && data.products?.length >= 3 && data.products?.length % 2 !== 0 ? (
          <div className="hidden sm:block right-0 bottom-60 z-0 absolute w-[calc(50%-32px)] h-50">
            <DotsOverlay opacity={0.7} />
          </div>
        ) : null}
      </div>
    </section>
  );
}
