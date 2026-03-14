import News from "@/components/news/News";
import SeoJsonLd from "@/components/seo/SeoJsonLd";
import { buildStaticPageMetadata } from "@/lib/site-page-seo";
import {
  buildBreadcrumbItemsFromPath,
  buildBreadcrumbSchema,
  buildOrganizationSchema,
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
  return buildStaticPageMetadata({ locale, path, override });
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
