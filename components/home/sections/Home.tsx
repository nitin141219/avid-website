import HeroSection from "@/components/hero/HeroSection";
import BeganSection from "@/components/home/sections/BeganSection";
import OurKeyProducts from "@/components/home/sections/OurKeyProducts";
import OurMarkets from "@/components/home/sections/OurMarkets";
import StatsSection from "@/components/home/sections/StatsSection";
import { HomepageSlide } from "@/types/homepage-slide";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";

const GlobalPresence = dynamic(() => import("@/components/home/sections/GlobalPresence"));
const PressReleasesSection = dynamic(() => import("@/components/home/sections/PressReleasesSection"));

export default function Home({
  initialNews = [],
  initialSlides = [],
}: {
  initialNews?: any[];
  initialSlides?: HomepageSlide[];
}) {
  const t = useTranslations();

  return (
    <>
      <HeroSection slides={initialSlides} />
      <div className="deferred-section" style={{ ["--deferred-size" as string]: "1200px" }}>
        <OurMarkets />
      </div>
      <div className="deferred-section" style={{ ["--deferred-size" as string]: "1200px" }}>
        <OurKeyProducts />
      </div>
      <div className="deferred-section" style={{ ["--deferred-size" as string]: "900px" }}>
        <BeganSection />
      </div>
      <div className="deferred-section" style={{ ["--deferred-size" as string]: "700px" }}>
        <StatsSection />
      </div>
      <div className="deferred-section" style={{ ["--deferred-size" as string]: "900px" }}>
        <GlobalPresence />
      </div>
      <div className="deferred-section" style={{ ["--deferred-size" as string]: "1000px" }}>
        <PressReleasesSection title={t("press_release.title")} initialNews={initialNews} />
      </div>
    </>
  );
}
