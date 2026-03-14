import ContactUs from "@/components/contact-us/ContactUs";
import SeoJsonLd from "@/components/seo/SeoJsonLd";
import { buildStaticPageMetadata } from "@/lib/site-page-seo";
import {
  buildBreadcrumbItemsFromPath,
  buildBreadcrumbSchema,
  buildLocalBusinessSchema,
  buildOrganizationSchema,
  fetchSeoOverride,
} from "@/lib/seo";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const path = "/contact-us";
  const override = await fetchSeoOverride(path, locale);
  return buildStaticPageMetadata({ locale, path, override });
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
