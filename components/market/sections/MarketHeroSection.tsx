"use client";

import DotsOverlay from "@/components/dots-overlay/DotsOverlay";
import { getResponsiveImageSources } from "@/lib/utils";
import { MarketPageData } from "../data";

function MarketHeroSection({ data, t }: { data: MarketPageData["hero"]; t: any }) {
  const imageSource = getResponsiveImageSources(data as any);
  return (
    <div className="relative bg-gray-section overflow-hidden">
      <div className="parallax-hero relative w-full aspect-[1200/1675] sm:aspect-auto sm:h-[34rem] lg:h-150 overflow-hidden">
        {/* Desktop Background Image */}
        <div
          className="parallax-hero__image hidden md:block absolute inset-0 bg-cover bg-no-repeat bg-center"
          style={{
            backgroundImage: `url(${imageSource.desktop})`,
          }}
        />
        {/* Mobile Background Image */}
        <div
          className="parallax-hero__image md:hidden block absolute inset-0 bg-cover bg-no-repeat bg-center"
          style={{
            backgroundImage: `url(${imageSource.mobile})`,
          }}
        />
        <DotsOverlay className="z-1 opacity-70" />
      </div>

      <div className="z-20 absolute inset-0 flex flex-col py-10 sm:py-16 text-left container-inner">
        <div className={data.className}>
          <h1 className="font-extrabold text-primary text-3xl">{t(data.title)}</h1>
          <div className="bg-light-dark my-3 w-12 h-px"></div>
          <p className="max-w-3xl font-medium text-off-black">{t(data.subtitle)}</p>
        </div>
      </div>
    </div>
  );
}

export default MarketHeroSection;

