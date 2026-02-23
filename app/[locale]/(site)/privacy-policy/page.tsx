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
  const path = "/privacy-policy";
  const override = await fetchSeoOverride(path, locale);

  return buildSeoMetadata(
    {
      title: "Privacy Policy | Avid Organics",
      description: "Avid Organics Privacy Policy. Learn how we collect, use, protect, and manage your personal data. GDPR compliant. Your privacy and data security are our priorities.",
      path,
      locale,
      type: "website",
      keywords: [
        "privacy policy",
        "data protection",
        "GDPR compliance",
        "personal information",
        "data security",
        "privacy rights",
        "cookie policy",
        "data usage",
      ],
    },
    override || undefined
  );
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
