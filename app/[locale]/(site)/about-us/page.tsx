import AboutUs from "@/components/about-us/AboutUs";
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
  const path = "/about-us";
  const override = await fetchSeoOverride(path, locale);

  return buildSeoMetadata(
    {
      title: "About Avid Organics | India's Leading Glycine & Glycolic Acid Manufacturer",
      description: "Learn about Avid Organics - India's leading manufacturer of Glycine and Glycolic Acid. Rapidly emerging leader in specialty chemicals, setting benchmarks in the chemical industry. FSSAI, FDA & REACH certified. Serving India, USA, Europe.",
      path,
      locale,
      type: "website",
      keywords: [
        "about Avid Organics",
        "India's leading manufacturer",
        "glycine manufacturer",
        "glycolic acid manufacturer",
        "specialty chemicals manufacturer",
        "pharmaceutical grade glycine",
        "chemical company India",
        "FSSAI certified manufacturer",
        "FDA approved chemicals",
        "REACH compliant",
        "GMP certified",
        "ISO certified chemical company",
        "made in India for the world",
        "setting benchmarks",
        "pharmaceutical ingredients manufacturer",
      ],
    },
    override || undefined
  );
}

export default async function AboutUsPage({ params }: Props) {
  const { locale } = await params;
  const path = "/about-us";
  const breadcrumbItems = buildBreadcrumbItemsFromPath(path, locale);
  const schemas = [buildOrganizationSchema(), buildBreadcrumbSchema(breadcrumbItems)];

  return (
    <>
      <SeoJsonLd schemas={schemas} />
      <AboutUs />
    </>
  );
}
