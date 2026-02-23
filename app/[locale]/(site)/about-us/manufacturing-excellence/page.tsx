import ManufacturingExcellence from "@/components/manufacturing-excellence/ManufacturingExcellence";
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
  const path = "/about-us/manufacturing-excellence";
  const override = await fetchSeoOverride(path, locale);

  return buildSeoMetadata(
    {
      title: "Manufacturing Excellence & Quality Assurance | Avid Organics",
      description: "Avid Organics' state-of-the-art manufacturing facilities. GMP certified, ISO 9001:2015, WHO-GMP compliant. Advanced quality control, cGMP processes, FSSAI, FDA & REACH certified production for pharmaceutical and specialty chemicals.",
      path,
      locale,
      type: "website",
      keywords: [
        "GMP certified manufacturing",
        "pharmaceutical grade production",
        "ISO 9001:2015 facility",
        "cGMP processes",
        "quality assurance chemicals",
        "WHO-GMP compliant",
        "state-of-the-art facility",
        "quality control laboratory",
        "FSSAI certified facility",
        "FDA approved manufacturing",
        "REACH compliant production",
        "pharmaceutical manufacturing excellence",
        "specialty chemicals facility",
        "advanced manufacturing processes",
      ],
    },
    override || undefined
  );
}

export default async function ManufacturingExcellencePage({ params }: Props) {
  const { locale } = await params;
  const path = "/about-us/manufacturing-excellence";
  const breadcrumbItems = buildBreadcrumbItemsFromPath(path, locale);
  const schemas = [buildOrganizationSchema(), buildBreadcrumbSchema(breadcrumbItems)];

  return (
    <>
      <SeoJsonLd schemas={schemas} />
      <ManufacturingExcellence />
    </>
  );
}
