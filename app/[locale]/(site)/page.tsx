import Home from "@/components/home/sections/Home";
import SeoJsonLd from "@/components/seo/SeoJsonLd";
import { defaultHomeFaqs } from "@/lib/seo-content";
import {
  buildBreadcrumbItemsFromPath,
  buildBreadcrumbSchema,
  buildFaqSchema,
  buildOrganizationSchema,
  buildLocalBusinessSchema,
  buildSeoMetadata,
  fetchSeoOverride,
  getSiteUrl,
  buildGeoKeywords,
} from "@/lib/seo";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const path = "";
  const override = await fetchSeoOverride(path, locale);

  // Dynamic homepage SEO with approved claims
  const homeTitle = "Avid Organics - India's Leading Manufacturer of Glycine and Glycolic Acid | Specialty Chemicals";
  const homeDescription = "India's leading manufacturer of Glycine and Glycolic Acid. Rapidly emerging leader in specialty chemicals, setting benchmarks in the chemical industry. Proudly made in India for the world. Pharmaceutical grade glycine, cosmetic grade glycolic acid, taurine. FSSAI, FDA & REACH certified.";
  
  // Homepage keywords aligned with content clusters and target keywords
  const baseKeywords = [
    // Core positioning
    "India's leading manufacturer",
    "specialty chemicals manufacturer",
    "rapidly emerging leader",
    "made in India for the world",
    
    // Core products and applications (Glycine cluster)
    "glycine manufacturer",
    "pharmaceutical grade glycine",
    "glycine CAS 56-40-6",
    "glycine for pharmaceutical formulations",
    "pharmaceutical synthesis",
    "food grade glycine",
    
    // Glycolic Acid cluster
    "glycolic acid manufacturer",
    "cosmetic grade glycolic acid",
    "glycolic acid CAS 79-14-1",
    "glycolic acid supplier",
    "glycolic acid for cosmetics",
    
    // Amino acids portfolio
    "taurine manufacturer India",
    "amino acid manufacturer",
    "amino acid specifications",
    
    // Product specifications
    "USP grade glycine specifications",
    "pharmaceutical amino acid standards",
    "USP grade",
    "BP grade",
    "EP grade",
    
    // Certifications
    "GMP certified chemicals",
    "ISO certified manufacturer",
    "FSSAI certified",
    "FDA approved",
    "REACH compliant",
  ];
  
  // Add comprehensive geo-keywords for India, USA, Europe, and global reach
  const geoKeywords = buildGeoKeywords(["india", "usa", "europe", "global"]);
  const homeKeywords = [...baseKeywords, ...geoKeywords];

  return buildSeoMetadata(
    {
      title: homeTitle,
      description: homeDescription,
      path,
      locale,
      type: "website",
      image: `${getSiteUrl()}/logo-tagline.png`,
      keywords: homeKeywords,
    },
    override || undefined
  );
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  const path = "";
  const override = await fetchSeoOverride(path, locale);
  const faqs = override?.faqs?.length ? override.faqs : defaultHomeFaqs;
  const breadcrumbItems = buildBreadcrumbItemsFromPath(path, locale);
  
  // Build comprehensive schemas including regional LocalBusiness for geo-targeting
  // FAQs and info sections only in schema (JSON-LD), not visible on page
  const schemas = [
    buildOrganizationSchema(),
    buildLocalBusinessSchema("india"), // India market focus
    buildLocalBusinessSchema("usa"), // USA market focus
    buildLocalBusinessSchema("europe"), // Europe market focus
    buildBreadcrumbSchema(breadcrumbItems),
    buildFaqSchema(faqs),
  ];

  return (
    <>
      <SeoJsonLd schemas={schemas} />
      <Home />
    </>
  );
}
