import News from "@/components/news/News";
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
  const path = "/media/news";
  const override = await fetchSeoOverride(path, locale);

  return buildSeoMetadata(
    {
      title: "Latest News & Announcements | Avid Organics",
      description: "Stay updated with Avid Organics' latest news, product launches, company announcements, industry achievements, certifications, expansions, and pharmaceutical ingredient innovations. Breaking news in specialty chemicals.",
      path,
      locale,
      type: "website",
      keywords: [
        "Avid Organics news",
        "company announcements",
        "product launches",
        "pharmaceutical news",
        "specialty chemicals updates",
        "industry achievements",
        "certification announcements",
        "business expansion",
        "chemical industry news",
        "manufacturing updates",
        "press releases",
        "corporate news",
      ],
    },
    override || undefined
  );
}

export default async function NewsPage({ searchParams, params }: any) {
  const { locale } = await params;
  const path = "/media/news";
  const resolvedParams = await searchParams;
  const breadcrumbItems = buildBreadcrumbItemsFromPath(path, locale);
  const schemas = [buildOrganizationSchema(), buildBreadcrumbSchema(breadcrumbItems)];

  return (
    <>
      <SeoJsonLd schemas={schemas} />
      <News searchParams={resolvedParams} />
    </>
  );
}
