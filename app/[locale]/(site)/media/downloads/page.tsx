import Downloads from "@/components/downloads/Downloads";
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
  const path = "/media/downloads";
  const override = await fetchSeoOverride(path, locale);

  return buildSeoMetadata(
    {
      title: "Downloads & Resources | Technical Data Sheets | Avid Organics",
      description: "Download technical data sheets (TDS), certificates of analysis (COA), safety data sheets (SDS), product brochures, and quality certificates for Avid Organics' pharmaceutical ingredients and specialty chemicals.",
      path,
      locale,
      type: "website",
      keywords: [
        "technical data sheets",
        "TDS download",
        "certificate of analysis",
        "COA download",
        "safety data sheets",
        "SDS download",
        "product brochures",
        "quality certificates",
        "MSDS download",
        "pharmaceutical documentation",
        "chemical specifications",
        "product literature",
      ],
    },
    override || undefined
  );
}

async function getDownloads() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/downloads`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`Fetch failed with status ${res.status}`);
    }

    const json = await res.json();

    return {
      downloads: json.data || {},
    };
  } catch (error) {
    console.error("Error fetching downloads:", error);

    return {
      downloads: {},
    };
  }
}

export default async function DownloadsPage({ params }: Props) {
  const { locale } = await params;
  const path = "/media/downloads";
  const { downloads } = await getDownloads();
  const breadcrumbItems = buildBreadcrumbItemsFromPath(path, locale);
  const schemas = [buildOrganizationSchema(), buildBreadcrumbSchema(breadcrumbItems)];

  return (
    <>
      <SeoJsonLd schemas={schemas} />
      <Downloads downloads={downloads} />
    </>
  );
}
