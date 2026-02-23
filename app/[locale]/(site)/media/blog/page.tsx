import Blogs from "@/components/blog/Blogs";
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
  const path = "/media/blog";
  const override = await fetchSeoOverride(path, locale);

  return buildSeoMetadata(
    {
      title: "Industry Insights & Blog | Specialty Chemicals | Avid Organics",
      description: "Explore Avid Organics' blog for insights on pharmaceutical ingredients, specialty chemicals, industry trends, GMP manufacturing, quality assurance, and chemical innovations. Expert articles on APIs, amino acids, and fine chemicals.",
      path,
      locale,
      type: "website",
      keywords: [
        "chemical industry blog",
        "pharmaceutical insights",
        "specialty chemicals articles",
        "GMP manufacturing news",
        "API industry updates",
        "amino acids blog",
        "fine chemicals articles",
        "quality assurance insights",
        "chemical innovations",
        "pharmaceutical manufacturing blog",
        "industry trends chemicals",
        "technical articles chemicals",
      ],
    },
    override || undefined
  );
}

export default async function BlogsPage({ searchParams, params }: any) {
  const { locale } = await params;
  const path = "/media/blog";
  const resolvedParams = await searchParams;
  const breadcrumbItems = buildBreadcrumbItemsFromPath(path, locale);
  const schemas = [buildOrganizationSchema(), buildBreadcrumbSchema(breadcrumbItems)];

  return (
    <>
      <SeoJsonLd schemas={schemas} />
      <Blogs searchParams={resolvedParams} />
    </>
  );
}
