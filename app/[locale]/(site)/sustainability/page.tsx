import Sustainability from "@/components/sustainability/Sustainability";
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
  const path = "/sustainability";
  const override = await fetchSeoOverride(path, locale);

  return buildSeoMetadata(
    {
      title: "Sustainability & Environmental Responsibility | Avid Organics",
      description: "Avid Organics' commitment to sustainable chemical manufacturing. ISO 14001 certified, eco-friendly processes, waste reduction, renewable energy. Responsible chemistry for pharmaceutical and specialty chemicals.",
      path,
      locale,
      type: "website",
      keywords: [
        "sustainable chemistry",
        "eco-friendly chemical manufacturing",
        "green chemistry",
        "ISO 14001 certified",
        "environmental responsibility",
        "waste reduction chemicals",
        "renewable energy manufacturing",
        "sustainable pharmaceutical ingredients",
        "carbon footprint reduction",
        "responsible chemical production",
        "environmental compliance",
        "sustainable specialty chemicals",
        "green manufacturing practices",
        "circular economy chemicals",
      ],
    },
    override || undefined
  );
}

export default async function SustainabilityPage({ params }: Props) {
  const { locale } = await params;
  const path = "/sustainability";
  const breadcrumbItems = buildBreadcrumbItemsFromPath(path, locale);
  const schemas = [buildOrganizationSchema(), buildBreadcrumbSchema(breadcrumbItems)];

  return (
    <>
      <SeoJsonLd schemas={schemas} />
      <Sustainability />
    </>
  );
}
