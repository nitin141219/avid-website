import Jobs from "@/components/careers/jobs/Jobs";
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
  const path = "/careers/jobs";
  const override = await fetchSeoOverride(path, locale);

  return buildSeoMetadata(
    {
      title: "Careers & Job Openings | Join Avid Organics Team",
      description: "Explore career opportunities at Avid Organics. Join our team of chemical industry professionals. Open positions in pharmaceutical manufacturing, quality control, R&D, production, and more. Apply now for jobs in India.",
      path,
      locale,
      type: "website",
      keywords: [
        "Avid Organics careers",
        "chemical industry jobs",
        "pharmaceutical manufacturing jobs",
        "chemistry jobs India",
        "quality control jobs",
        "production jobs chemicals",
        "R&D jobs pharmaceutical",
        "chemical engineer jobs",
        "laboratory jobs",
        "manufacturing jobs India",
        "specialty chemicals careers",
        "pharmaceutical industry careers",
      ],
    },
    override || undefined
  );
}

export default async function JobsPage({ params }: Props) {
  const { locale } = await params;
  const path = "/careers/jobs";
  
  const res = await fetch(
    "https://avidorganics.keka.com/careers/api/embedjobs/default/active/c118cdbe-bd51-42c6-b7af-a6db01af3177",
    { cache: "no-store" }
  );

  const jobs = await res.json();
  const breadcrumbItems = buildBreadcrumbItemsFromPath(path, locale);
  const schemas = [buildOrganizationSchema(), buildBreadcrumbSchema(breadcrumbItems)];

  return (
    <>
      <SeoJsonLd schemas={schemas} />
      <Jobs jobs={jobs} />
    </>
  );
}
