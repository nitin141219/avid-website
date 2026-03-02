import HeroSection from "@/components/hero/HeroSection";
import BeganSection from "@/components/home/sections/BeganSection";
import OurKeyProducts from "@/components/home/sections/OurKeyProducts";
import OurMarkets from "@/components/home/sections/OurMarkets";
import PressReleasesSection from "@/components/home/sections/PressReleasesSection";
import StatsSection from "@/components/home/sections/StatsSection";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";

const GlobalPresence = dynamic(() => import("@/components/home/sections/GlobalPresence"));

export default function Home({ initialNews = [] }: { initialNews?: any[] }) {
  const t = useTranslations();
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
      <div style={{ contentVisibility: "auto", containIntrinsicSize: "900px" }}>
        <GlobalPresence />
      </div>
      <PressReleasesSection title={t("press_release.title")} initialNews={initialNews} />
    </>
  );
}
