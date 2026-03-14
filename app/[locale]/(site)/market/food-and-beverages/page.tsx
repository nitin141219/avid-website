import { marketPages } from "@/components/market/data";
import MarketTemplate from "@/components/market/MarketTemplate";
import SeoJsonLd from "@/components/seo/SeoJsonLd";
import { getLocalizedMarketFaqs } from "@/lib/seo-content";
import { buildStaticPageMetadata } from "@/lib/site-page-seo";
import {
  buildBreadcrumbItemsFromPath,
  buildBreadcrumbSchema,
  buildFaqSchema,
  buildOrganizationSchema,
  fetchSeoOverride,
} from "@/lib/seo";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const slug = "food-and-beverages";
  const path = `/market/${slug}`;
  const override = await fetchSeoOverride(path, locale);
  return buildStaticPageMetadata({ locale, path, override });
}

export default async function FoodAndBeveragesPage({ params }: Props) {
  const { locale } = await params;
  const slug = "food-and-beverages";
  const data = marketPages[slug];

  if (!data) return notFound();
  const t = await getTranslations(`market.${slug}`);
  const marketName = t(data.hero.title);
  const path = `/market/${slug}`;
  const override = await fetchSeoOverride(path, locale);
  const faqs = override?.faqs?.length ? override.faqs : getLocalizedMarketFaqs(marketName, locale);

  const breadcrumbItems = buildBreadcrumbItemsFromPath(path, locale);
  const schemas = [
    buildOrganizationSchema(),
    buildBreadcrumbSchema(breadcrumbItems),
    ...(faqs.length ? [buildFaqSchema(faqs)] : []),
  ];

  return (
    <>
      <SeoJsonLd schemas={schemas} />
      <MarketTemplate data={data} slug={slug} />
    </>
  );
}
