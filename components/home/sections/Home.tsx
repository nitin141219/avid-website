import HeroSection from "@/components/hero/HeroSection";
import BeganSection from "@/components/home/sections/BeganSection";
import OurKeyProducts from "@/components/home/sections/OurKeyProducts";
import OurMarkets from "@/components/home/sections/OurMarkets";
import StatsSection from "@/components/home/sections/StatsSection";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";

const GlobalPresence = dynamic(() => import("@/components/home/sections/GlobalPresence"));
const PressReleasesSection = dynamic(() => import("@/components/home/sections/PressReleasesSection"));

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
