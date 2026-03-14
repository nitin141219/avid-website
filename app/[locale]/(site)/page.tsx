import Home from "@/components/home/sections/Home";
import SeoJsonLd from "@/components/seo/SeoJsonLd";
import { getHomeNews, getHomepageSlides } from "@/lib/home-data";
import { getLocalizedHomeFaqs } from "@/lib/seo-content";
import { buildStaticPageMetadata } from "@/lib/site-page-seo";
import {
  buildBreadcrumbItemsFromPath,
  buildBreadcrumbSchema,
  buildFaqSchema,
  buildOrganizationSchema,
  fetchSeoOverride,
} from "@/lib/seo";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const path = "";
  const override = await fetchSeoOverride(path, locale);
  return buildStaticPageMetadata({ locale, path, override });
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  const path = "";
  const override = await fetchSeoOverride(path, locale);
  const faqs = override?.faqs?.length ? override.faqs : getLocalizedHomeFaqs(locale);
  const breadcrumbItems = buildBreadcrumbItemsFromPath(path, locale);
  const initialNews = await getHomeNews(locale);
  const initialSlides = await getHomepageSlides(locale);
  
  // FAQs and breadcrumb context are exposed via JSON-LD without adding visible duplicate content.
  const schemas = [
    buildOrganizationSchema(),
    buildBreadcrumbSchema(breadcrumbItems),
    ...(faqs.length ? [buildFaqSchema(faqs)] : []),
  ];

  return (
    <>
      <SeoJsonLd schemas={schemas} />
      <Home initialNews={initialNews} initialSlides={initialSlides} />
    </>
  );
}
