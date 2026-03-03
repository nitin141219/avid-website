"use client";

import HeroSection from "@/components/hero/HeroSection";
import BeganSection from "@/components/home/sections/BeganSection";
import OurKeyProducts from "@/components/home/sections/OurKeyProducts";
import OurMarkets from "@/components/home/sections/OurMarkets";
import PressReleasesSection from "@/components/home/sections/PressReleasesSection";
import StatsSection from "@/components/home/sections/StatsSection";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";

const GlobalPresence = dynamic(() => import("@/components/home/sections/GlobalPresence"));

export default function Home({ initialNews = [] }: { initialNews?: any[] }) {
  const t = useTranslations();
  const globalPresenceRef = useRef<HTMLDivElement | null>(null);
  const [shouldFetchNews, setShouldFetchNews] = useState(initialNews.length > 0);

  useEffect(() => {
    if (shouldFetchNews) return;
    if (!globalPresenceRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShouldFetchNews(true);
          observer.disconnect();
        }
      },
      {
        // Start loading while user is around Global Presence section.
        rootMargin: "0px 0px 600px 0px",
        threshold: 0.1,
      }
    );

    observer.observe(globalPresenceRef.current);
    return () => observer.disconnect();
  }, [shouldFetchNews]);

  return (
    <>
      <HeroSection />
      <div style={{ contentVisibility: "auto", containIntrinsicSize: "1200px" }}>
        <OurMarkets />
      </div>
      <div style={{ contentVisibility: "auto", containIntrinsicSize: "1200px" }}>
        <OurKeyProducts />
      </div>
      <div style={{ contentVisibility: "auto", containIntrinsicSize: "900px" }}>
        <BeganSection />
      </div>
      <div style={{ contentVisibility: "auto", containIntrinsicSize: "700px" }}>
        <StatsSection />
      </div>
      <div
        ref={globalPresenceRef}
        style={{ contentVisibility: "auto", containIntrinsicSize: "900px" }}
      >
        <GlobalPresence />
      </div>
      <PressReleasesSection
        title={t("press_release.title")}
        initialNews={initialNews}
        shouldFetch={shouldFetchNews}
      />
    </>
  );
}
