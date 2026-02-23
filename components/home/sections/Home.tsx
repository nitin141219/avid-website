import HeroSection from "@/components/hero/HeroSection";
import BeganSection from "@/components/home/sections/BeganSection";
import GlobalPresence from "@/components/home/sections/GlobalPresence";
import OurKeyProducts from "@/components/home/sections/OurKeyProducts";
import OurMarkets from "@/components/home/sections/OurMarkets";
import PressReleasesSection from "@/components/home/sections/PressReleasesSection";
import StatsSection from "@/components/home/sections/StatsSection";
import { useTranslations } from "next-intl";

export default function Home() {
  const t = useTranslations();
  return (
    <>
      <HeroSection />
      <OurMarkets />
      <OurKeyProducts />
      <BeganSection />
      <StatsSection />
      <GlobalPresence />
      <PressReleasesSection title={t("press_release.title")} />
    </>
  );
}
