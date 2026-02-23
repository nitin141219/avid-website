import { productPages } from "@/components/product/data";
import ProductTemplate from "@/components/product/ProductTemplate";
import SeoJsonLd from "@/components/seo/SeoJsonLd";
import { defaultProductFaqs } from "@/lib/seo-content";
import { resolveProductSlideshowImages } from "@/lib/product-slideshow";
import {
  buildBreadcrumbItemsFromPath,
  buildBreadcrumbSchema,
  buildFaqSchema,
  buildOrganizationSchema,
  buildProductSchema,
  buildSeoMetadata,
  fetchSeoOverride,
  getSiteUrl,
  generateSmartTitle,
  generateSmartDescription,
  buildProductKeywords,
} from "@/lib/seo";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";

// Force dynamic rendering to support cookies in parent layout
export const dynamic = 'force-dynamic';
export const revalidate = 3600; // Revalidate every hour (ISR)

type Props = {
  params: Promise<{ category: string; slug: string; locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category, slug, locale } = await params;
  const resolvedSlug = slug === "aviga-hp-70" ? "aviga-hp" : slug;
  const data = productPages?.[category]?.[resolvedSlug];
  if (!data) {
    return {
      title: "Product Not Found",
      robots: { index: false, follow: false },
    };
  }

  const t = await getTranslations(`product.${category}.${resolvedSlug}`);
  
  // Use subText as the actual product name (e.g., "Glycolic Acid 70% Cosmetic Grade", "AviGa HP70")
  // If subText is not available, fall back to hero title
  const productName = data.information?.subText 
    ? t(data.information.subText) 
    : t(data.hero.title);
  const productDescription = t(data.hero.subtitle);
  const path = `/product/${category}/${slug}`;
  const override = await fetchSeoOverride(path, locale);
  const productImage = data.information?.image || "/logo-tagline.png";
  const absoluteImage = productImage.startsWith("http")
    ? productImage
    : `${getSiteUrl()}${productImage}`;

  // Extract applications for better keywords
  const applications = data.applications?.items?.map((item) => {
    try {
      // Handle both string and string[] for item.title
      const title = Array.isArray(item.title) ? item.title[0] : item.title;
      return typeof title === 'string' ? t(title) : "";
    } catch {
      return "";
    }
  }).filter(Boolean) || [];

  // Extract features/qualities
  const features: string[] = [];
  if (data.qualityInfo?.otherStandards) {
    data.qualityInfo.otherStandards.forEach(standard => {
      try {
        features.push(t(standard.title));
      } catch {
        // ignore translation errors
      }
    });
  }

  // Get category display name
  const categoryDisplayName = category.split("-").map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(" ");

  // Build dynamic title with actual product name
  const dynamicTitle = generateSmartTitle({
    name: productName,
    type: "product",
    category: categoryDisplayName,
  });

  // Build dynamic description
  const dynamicDescription = generateSmartDescription({
    name: productName,
    type: "product",
    summary: productDescription,
    features: features.length > 0 ? features : undefined,
    applications: applications.length > 0 ? applications : undefined,
  });

  // Build smart keywords from actual content
  const dynamicKeywords = buildProductKeywords({
    productName,
    category,
    applications,
    description: productDescription,
  });

  return buildSeoMetadata(
    {
      title: dynamicTitle,
      description: dynamicDescription,
      path,
      locale,
      type: "product",
      image: absoluteImage,
      keywords: dynamicKeywords,
    },
    override || undefined
  );
}

export default async function ProductDetailPage({ params }: Props) {
  const { category, slug, locale } = await params;

  const resolvedSlug = slug === "aviga-hp-70" ? "aviga-hp" : slug;
  const data = productPages?.[category]?.[resolvedSlug];
  if (!data) return notFound();

  const t = await getTranslations(`product.${category}.${resolvedSlug}`);
  
  // Use subText as the actual product name (e.g., "Glycolic Acid 70% Cosmetic Grade", "AviGa HP70")
  // If subText is not available, fall back to hero title
  const productName = data.information?.subText 
    ? t(data.information.subText) 
    : t(data.hero.title);
  const productDescription = t(data.hero.subtitle);
  const path = `/product/${category}/${slug}`;
  const override = await fetchSeoOverride(path, locale);
  const faqs = override?.faqs?.length ? override.faqs : defaultProductFaqs(productName);
  const productImage = data.information?.image || "/logo-tagline.png";
  const absoluteImage = productImage.startsWith("http")
    ? productImage
    : `${getSiteUrl()}${productImage}`;
  const productUrl = `${getSiteUrl()}/${locale}${path}`;
  const slideshowImages = await resolveProductSlideshowImages({
    slug: resolvedSlug,
    productName,
    fallbackImage: productImage,
  });

  const breadcrumbItems = buildBreadcrumbItemsFromPath(path, locale);
  const schemas = [
    buildOrganizationSchema(),
    buildBreadcrumbSchema(breadcrumbItems),
    buildProductSchema({
      name: productName,
      description: productDescription,
      image: absoluteImage,
      url: productUrl,
    }),
    buildFaqSchema(faqs),
  ];

  return (
    <>
      <SeoJsonLd schemas={schemas} />
      <ProductTemplate
        data={data}
        slideshowImages={slideshowImages}
        params={{
          category,
          slug: resolvedSlug,
        }}
      />
    </>
  );
}
