import Events from "@/components/event/Events";
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
  const path = "/media/event";
  const override = await fetchSeoOverride(path, locale);

  return buildSeoMetadata(
    {
      title: "Events, Exhibitions & Trade Shows | Avid Organics",
      description: "Discover Avid Organics' upcoming events, industry exhibitions, trade shows, webinars, and pharmaceutical conferences. Meet us at CPhI, CPHI India, chemical industry events, and networking opportunities worldwide.",
      path,
      locale,
      type: "website",
      keywords: [
        "pharmaceutical events",
        "chemical exhibitions",
        "trade shows",
        "CPhI events",
        "CPHI India",
        "industry conferences",
        "specialty chemicals events",
        "pharma exhibitions",
        "networking events",
        "webinars chemicals",
        "industry meetups",
        "business events",
      ],
    },
    override || undefined
  );
}

export default async function EventsPage({ searchParams, params }: any) {
  const { locale } = await params;
  const path = "/media/event";
  const resolvedParams = await searchParams;
  const breadcrumbItems = buildBreadcrumbItemsFromPath(path, locale);
  const schemas = [buildOrganizationSchema(), buildBreadcrumbSchema(breadcrumbItems)];

  return (
    <>
      <SeoJsonLd schemas={schemas} />
      <Events searchParams={resolvedParams} />
    </>
  );
}
