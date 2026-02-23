import ExecutiveLeadership from "@/components/executive-leadership/ExecutiveLeadership";
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
  const path = "/about-us/executive-leadership";
  const override = await fetchSeoOverride(path, locale);

  return buildSeoMetadata(
    {
      title: "Executive Leadership Team | Avid Organics",
      description: "Meet the leadership team at Avid Organics. Experienced executives driving innovation in specialty chemicals, pharmaceutical ingredients, and sustainable manufacturing. Industry experts in chemical production and quality assurance.",
      path,
      locale,
      type: "website",
      keywords: [
        "Avid Organics leadership",
        "executive team",
        "chemical industry leaders",
        "pharmaceutical manufacturing experts",
        "specialty chemicals executives",
        "management team",
        "industry expertise",
        "chemical company leadership",
        "GMP certified leadership",
        "pharmaceutical industry experts",
      ],
    },
    override || undefined
  );
}

export default async function ExecutiveLeadershipPage({ params }: Props) {
  const { locale } = await params;
  const path = "/about-us/executive-leadership";
  const breadcrumbItems = buildBreadcrumbItemsFromPath(path, locale);
  const schemas = [buildOrganizationSchema(), buildBreadcrumbSchema(breadcrumbItems)];

  return (
    <>
      <SeoJsonLd schemas={schemas} />
      <ExecutiveLeadership />
    </>
  );
}
