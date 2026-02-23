import { marketPages } from "@/components/market/data";
import MarketTemplate from "@/components/market/MarketTemplate";
import SeoJsonLd from "@/components/seo/SeoJsonLd";
import { defaultMarketFaqs } from "@/lib/seo-content";
import {
  buildBreadcrumbItemsFromPath,
  buildBreadcrumbSchema,
  buildFaqSchema,
  buildOrganizationSchema,
  buildSeoMetadata,
  fetchSeoOverride,
  getSiteUrl,
  generateSmartTitle,
  generateSmartDescription,
  buildMarketKeywords,
} from "@/lib/seo";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const slug = "industrial-and-specialty-applications";
  const data = marketPages[slug];
  if (!data) {
    return {
      title: "Market Not Found",
      robots: { index: false, follow: false },
    };
  }

  const t = await getTranslations(`market.${slug}`);
  const marketName = t(data.hero.title);
  const marketDescription = t(data.description);
  const path = `/market/${slug}`;
  const override = await fetchSeoOverride(path, locale);
  const heroImage = data.hero.image;
  const absoluteImage = heroImage.startsWith("http") ? heroImage : `${getSiteUrl()}${heroImage}`;

  // Extract solutions for better keywords
  const solutions = data.solutions?.map((solution) => {
    try {
      return t(solution.title);
    } catch {
      return "";
    }
  }).filter(Boolean) || [];

  // Extract product applications
  const applications = data.products?.map(product => {
    try {
      return product.subtitle || "";
    } catch {
      return "";
    }
  }).filter(Boolean) || [];

  // Build dynamic title
  const dynamicTitle = generateSmartTitle({
    name: marketName,
    type: "market",
  });

  // Build dynamic description
  const dynamicDescription = generateSmartDescription({
    name: marketName,
    type: "market",
    summary: marketDescription,
    applications: applications.length > 0 ? applications : undefined,
  });

  // Build smart keywords from content
  const dynamicKeywords = buildMarketKeywords({
    marketName,
    marketSlug: slug,
    solutions,
    description: marketDescription,
  });

  return buildSeoMetadata(
    {
      title: dynamicTitle,
      description: dynamicDescription,
      path,
      locale,
      type: "website",
      image: absoluteImage,
      keywords: dynamicKeywords,
    },
    override || undefined
  );
}

export default async function IndustrialAndSpecialtyPage({ params }: Props) {
  const { locale } = await params;
  const slug = "industrial-and-specialty-applications";
  const data = marketPages[slug];

  if (!data) return notFound();
  const t = await getTranslations(`market.${slug}`);
  const marketName = t(data.hero.title);
  const path = `/market/${slug}`;
  const override = await fetchSeoOverride(path, locale);
  const faqs = override?.faqs?.length ? override.faqs : defaultMarketFaqs(marketName);

  const breadcrumbItems = buildBreadcrumbItemsFromPath(path, locale);
  const schemas = [
    buildOrganizationSchema(),
    buildBreadcrumbSchema(breadcrumbItems),
    buildFaqSchema(faqs),
  ];

  return (
    <>
      <SeoJsonLd schemas={schemas} />
      <MarketTemplate data={data} slug={slug} />
    </>
  );
}
