import Jobs from "@/components/careers/jobs/Jobs";
import SeoJsonLd from "@/components/seo/SeoJsonLd";
import { buildStaticPageMetadata } from "@/lib/site-page-seo";
import {
  buildBreadcrumbItemsFromPath,
  buildBreadcrumbSchema,
  buildOrganizationSchema,
  fetchSeoOverride,
} from "@/lib/seo";
import type { Metadata } from "next";

export const revalidate = 300;

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const path = "/careers/jobs";
  const override = await fetchSeoOverride(path, locale);
  return buildStaticPageMetadata({ locale, path, override });
}

export default async function JobsPage({ params }: Props) {
  const { locale } = await params;
  const path = "/careers/jobs";
  
  const res = await fetch(
    "https://avidorganics.keka.com/careers/api/embedjobs/default/active/c118cdbe-bd51-42c6-b7af-a6db01af3177",
    { next: { revalidate } }
  );

  const jobs = res.ok ? await res.json() : [];
  const breadcrumbItems = buildBreadcrumbItemsFromPath(path, locale);
  const schemas = [buildOrganizationSchema(), buildBreadcrumbSchema(breadcrumbItems)];

  return (
    <>
      <SeoJsonLd schemas={schemas} />
      <Jobs jobs={jobs} />
    </>
  );
}
