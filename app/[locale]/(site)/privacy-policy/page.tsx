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
  const path = "/privacy-policy";
  const override = await fetchSeoOverride(path, locale);
  return buildStaticPageMetadata({ locale, path, override });
}

export default async function PrivacyPolicyPage({ params }: Props) {
  const { locale } = await params;
  const path = "/privacy-policy";
  const { default: PrivacyPolicyContent } = await import(`@/localization/${locale}/privacy.mdx`);
  const breadcrumbItems = buildBreadcrumbItemsFromPath(path, locale);
  const schemas = [buildOrganizationSchema(), buildBreadcrumbSchema(breadcrumbItems)];

  return (
    <>
      <SeoJsonLd schemas={schemas} />
      <div className={"container-inner py-16"}>
        <PrivacyPolicyContent />
      </div>
    </>
  );
}
