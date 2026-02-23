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
  const path = "/terms-and-conditions";
  const override = await fetchSeoOverride(path, locale);

  return buildSeoMetadata(
    {
      title: "Terms and Conditions | Avid Organics",
      description: "Avid Organics Terms and Conditions. Review our terms of service, usage policies, liability limitations, and legal agreements for purchasing specialty chemicals and pharmaceutical ingredients.",
      path,
      locale,
      type: "website",
      keywords: [
        "terms and conditions",
        "terms of service",
        "usage policy",
        "legal agreement",
        "purchase terms",
        "liability disclaimer",
        "service agreement",
        "user agreement",
      ],
    },
    override || undefined
  );
}

export default async function TermsAndConditionsPage({ params }: Props) {
  const { locale } = await params;
  const path = "/terms-and-conditions";
  const { default: TermsAndConditionsContent } = await import(`@/localization/${locale}/terms.mdx`);
  const breadcrumbItems = buildBreadcrumbItemsFromPath(path, locale);
  const schemas = [buildOrganizationSchema(), buildBreadcrumbSchema(breadcrumbItems)];

  return (
    <>
      <SeoJsonLd schemas={schemas} />
      <div className={"container-inner py-16"}>
        <TermsAndConditionsContent />
      </div>
    </>
  );
}
