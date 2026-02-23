import ContactUs from "@/components/contact-us/ContactUs";
import SeoJsonLd from "@/components/seo/SeoJsonLd";
import {
  buildBreadcrumbItemsFromPath,
  buildBreadcrumbSchema,
  buildLocalBusinessSchema,
  buildOrganizationSchema,
  buildSeoMetadata,
  fetchSeoOverride,
  buildGeoKeywords,
} from "@/lib/seo";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const path = "/contact-us";
  const override = await fetchSeoOverride(path, locale);
  const geoKeywords = buildGeoKeywords(["india", "usa", "europe", "global"]);

  return buildSeoMetadata(
    {
      title: "Contact Avid Organics | India's Leading Glycine & Glycolic Acid Manufacturer",
      description: "Contact Avid Organics - India's leading manufacturer of Glycine and Glycolic Acid. Available in India, USA, Europe. FSSAI, FDA & REACH certified. Request quotes, samples, or technical support.",
      path,
      locale,
      type: "website",
      keywords: [
        "contact Avid Organics",
        "glycine manufacturer contact",
        "glycolic acid manufacturer",
        "pharmaceutical grade glycine",
        "request quote",
        "pharmaceutical ingredients inquiry",
        "specialty chemicals manufacturer",
        "technical support chemicals",
        "sample request",
        "India's leading manufacturer",
        ...geoKeywords.slice(0, 10),
      ],
    },
    override || undefined
  );
}

export default async function ContactUsPage({ params }: Props) {
  const { locale } = await params;
  const path = "/contact-us";
  const breadcrumbItems = buildBreadcrumbItemsFromPath(path, locale);
  const schemas = [
    buildOrganizationSchema(),
    buildLocalBusinessSchema("india"),
    buildLocalBusinessSchema("usa"),
    buildLocalBusinessSchema("europe"),
    buildBreadcrumbSchema(breadcrumbItems),
  ];

  return (
    <>
      <SeoJsonLd schemas={schemas} />
      <ContactUs />
    </>
  );
}
