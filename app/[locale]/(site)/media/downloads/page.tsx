import Downloads from "@/components/downloads/Downloads";
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

export const revalidate = 300;

const DOCUMENT_CATEGORY = {
  PRODUCT: "PRODUCT",
  CERTIFICATE: "CERTIFICATE",
} as const;

function normalizeDocumentCategory(value: unknown) {
  const normalized = String(value || "").trim().toUpperCase();
  if (normalized === DOCUMENT_CATEGORY.PRODUCT || normalized === DOCUMENT_CATEGORY.CERTIFICATE) {
    return normalized;
  }
  return "";
}

function normalizeDownloadsPayload(payload: any) {
  const groupedCandidate = payload?.data || payload || {};

  if (
    groupedCandidate &&
    (Array.isArray(groupedCandidate[DOCUMENT_CATEGORY.PRODUCT]) ||
      Array.isArray(groupedCandidate[DOCUMENT_CATEGORY.CERTIFICATE]))
  ) {
    return {
      [DOCUMENT_CATEGORY.PRODUCT]: Array.isArray(groupedCandidate[DOCUMENT_CATEGORY.PRODUCT])
        ? groupedCandidate[DOCUMENT_CATEGORY.PRODUCT]
        : [],
      [DOCUMENT_CATEGORY.CERTIFICATE]: Array.isArray(groupedCandidate[DOCUMENT_CATEGORY.CERTIFICATE])
        ? groupedCandidate[DOCUMENT_CATEGORY.CERTIFICATE]
        : [],
    };
  }

  const documents = Array.isArray(groupedCandidate)
    ? groupedCandidate
    : Array.isArray(groupedCandidate?.documents)
      ? groupedCandidate.documents
      : Array.isArray(groupedCandidate?.data)
        ? groupedCandidate.data
        : [];

  return documents.reduce(
    (acc: Record<string, any[]>, document: any) => {
      const category = normalizeDocumentCategory(document?.category);
      if (!category) return acc;
      acc[category].push(document);
      return acc;
    },
    {
      [DOCUMENT_CATEGORY.PRODUCT]: [],
      [DOCUMENT_CATEGORY.CERTIFICATE]: [],
    }
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const path = "/media/downloads";
  const override = await fetchSeoOverride(path, locale);
  return buildStaticPageMetadata({ locale, path, override });
}

async function getDownloads() {
  const endpoints = [
    process.env.BACKEND_URL ? `${process.env.BACKEND_URL}/api/v1/customer/get-document` : "",
    process.env.NEXT_PUBLIC_BASE_URL ? `${process.env.NEXT_PUBLIC_BASE_URL}/api/downloads` : "",
    (process.env.NEXT_PUBLIC_BASE_URL || "").includes("avidorganics.net")
      ? "https://api.avidorganics.net/api/v1/customer/get-document"
      : "",
  ].filter((url, index, arr) => Boolean(url) && arr.indexOf(url) === index);

  try {
    for (const endpoint of endpoints) {
      try {
        const res = await fetch(endpoint, { next: { revalidate: 300 } });
        if (!res.ok) continue;

        const json = await res.json();
        return {
          downloads: normalizeDownloadsPayload(json),
        };
      } catch {
        // Try next endpoint.
      }
    }

    return {
      downloads: {},
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
