"use client";
import dynamic from "next/dynamic";
import SustainabilityDescriptionSection from "./SustainabilityDescriptionSection";
import SustainabilityHeroSection from "./SustainabilityHeroSection";

// Lazy load heavy sections
const RenewableEnergySection = dynamic(() => import("./RenewableEnergySection"));
const SustainabilityFrameworkSection = dynamic(() => import("./SustainabilityFrameworkSection"));
const EnvironmentalStewardshipSection = dynamic(() => import("./EnvironmentalStewardshipSection"));
const SocialResponsibilitySection = dynamic(() => import("./SocialResponsibilitySection"));
const GovernanceSection = dynamic(() => import("./GovernanceSection"));
const PerformanceReportingSection = dynamic(() => import("./PerformanceReportingSection"));
const GlobalAlignmentSection = dynamic(() => import("./GlobalAlignmentSection"));
const OurVisionSection = dynamic(() => import("./OurVisionSection"));
const PartnerSection = dynamic(() => import("./PartnerSection"));

const Sustainability = () => {
  return (
    <>
      <SustainabilityHeroSection />
      <SustainabilityDescriptionSection />
      <RenewableEnergySection />
      <SustainabilityFrameworkSection />
      <EnvironmentalStewardshipSection />
      <SocialResponsibilitySection />
      <GovernanceSection />
      <PerformanceReportingSection />
      <GlobalAlignmentSection />
      <OurVisionSection />
      <PartnerSection />
    </>
  );
};

export default Sustainability;
