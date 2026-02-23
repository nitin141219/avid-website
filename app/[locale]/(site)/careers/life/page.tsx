import LifeHeroSection from "@/components/careers/life/LifeHeroSection";
import LifeMainContent from "@/components/careers/life/LifeMainContent";
import SeoJsonLd from "@/components/seo/SeoJsonLd";
import {
  buildBreadcrumbItemsFromPath,
  buildBreadcrumbSchema,
  buildOrganizationSchema,
  buildSeoMetadata,
  fetchSeoOverride,
} from "@/lib/seo";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const path = "/careers/life";
  const override = await fetchSeoOverride(path, locale);

  return buildSeoMetadata(
    {
      title: "Life at Avid Organics | Company Culture & Work Environment",
      description: "Discover life at Avid Organics. Experience our dynamic work culture, employee benefits, professional development opportunities, and innovation-driven environment. Join a team committed to excellence in specialty chemicals.",
      path,
      locale,
      type: "website",
      keywords: [
        "life at Avid Organics",
        "company culture",
        "work environment chemicals",
        "employee benefits",
        "professional development",
        "innovation culture",
        "team collaboration",
        "employee growth",
        "workplace diversity",
        "chemical industry culture",
        "career development",
      ],
    },
    override || undefined
  );
}

export default async function LifePage({ params }: Props) {
  const { locale } = await params;
  const path = "/careers/life";
  const breadcrumbItems = buildBreadcrumbItemsFromPath(path, locale);
  const schemas = [buildOrganizationSchema(), buildBreadcrumbSchema(breadcrumbItems)];

  return (
    <>
      <SeoJsonLd schemas={schemas} />
      <LifeHeroSection />
      <LifeMainContent />
    </>
  );
}
