import EventDetails from "@/components/event/EventDetails";
import SeoJsonLd from "@/components/seo/SeoJsonLd";
import {
  buildBreadcrumbItemsFromPath,
  buildBreadcrumbSchema,
  buildOrganizationSchema,
  buildSeoMetadata,
  generateSmartTitle,
  generateSmartDescription,
  buildArticleKeywords,
  getSiteUrl,
  buildArticleSchema,
} from "@/lib/seo";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ slug: string; locale: string }>;
  // searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, locale } = await params;
  
  let eventData;
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/events/${slug}?locale=${locale}`, {
      cache: "force-cache",
      next: { revalidate: 3600 }, // Revalidate every hour
      headers: {
        "Content-Type": "application/json",
      },
    });
    
    // Handle errors appropriately
    if (!res.ok) {
      // Only return noindex for true 404s, not temporary failures
      if (res.status === 404) {
        console.warn(`Event not found: ${slug}`);
        return {
          title: "Event Not Found",
          robots: { index: false, follow: false },
        };
      }
      // For other errors (403, 500, etc.), generate minimal metadata
      console.warn(`Events API returned ${res.status} for slug: ${slug}`);
      return {
        title: slug.replace(/-/g, " "),
        description: "Avid Organics Event",
        robots: { index: true, follow: true }, // Keep indexing enabled for retries
      };
    }
    eventData = await res.json();
  } catch (error) {
    console.error(`Error fetching event metadata for ${slug}:`, error);
    // Return neutral metadata on fetch errors
    return {
      title: slug.replace(/-/g, " "),
      description: "Avid Organics Event",
      robots: { index: true, follow: true },
    };
  }
  
  const event = eventData?.data;
  if (!eventData || !event) {
    return {
      title: "Event Not Found",
      robots: { index: false, follow: false },
    };
  }

  const path = `/media/event/${slug}`;

  // Generate smart title
  const smartTitle = generateSmartTitle({
    name: event.title,
    type: "article",
  });

  // Generate smart description
  const smartDescription = generateSmartDescription({
    name: event.title,
    type: "article",
    summary: event.sub_title || event.description,
  });

  // Extract keywords from event content
  const dynamicKeywords = buildArticleKeywords({
    title: event.title,
    summary: event.sub_title,
    content: event.content || event.description,
    tags: event.tags || [],
  });

  return buildSeoMetadata(
    {
      title: smartTitle,
      description: smartDescription,
      path,
      locale,
      type: "article",
      image: event.image,
      author: event.author || "Avid Organics Pvt. Ltd.",
      keywords: dynamicKeywords,
    },
    undefined
  );
}

async function getEvent(slug: string, locale: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/events/${slug}?locale=${locale}`, {
      cache: "force-cache",
      next: { revalidate: 3600 }, // Revalidate every hour
      headers: {
        "Content-Type": "application/json",
      },
    });
    
    if (!res.ok) {
      // Log specific error codes for debugging
      if (res.status === 403) {
        console.error(`403 Forbidden: Events API access denied for slug: ${slug}`);
      } else if (res.status === 404) {
        console.warn(`404 Not Found: Event not found for slug: ${slug}`);
      } else {
        console.error(`Fetch failed with status ${res.status} for slug: ${slug}`);
      }
      return null;
    }

    const json = await res.json();

    return {
      event: json.data ?? {},
    };
  } catch (error) {
    console.error(`Error in getEvent for ${slug}:`, error);
    return null;
  }
}

export default async function Event({ params }: Props) {
  const { slug, locale } = await params;
  const eventData = await getEvent(slug, locale);

  const event = eventData?.event;
  if (!eventData || !event) {
    return notFound();
  }

  const path = `/media/event/${slug}`;
  const eventUrl = `${getSiteUrl()}/${locale}${path}`;
  const breadcrumbItems = buildBreadcrumbItemsFromPath(path, locale);
  const schemas = [
    buildOrganizationSchema(),
    buildBreadcrumbSchema(breadcrumbItems),
    buildArticleSchema({
      title: event.title,
      description: event.sub_title || event.description,
      image: event.image || "https://www.avidorganics.net/logo-tagline.png",
      url: eventUrl,
      datePublished: event.published_at,
      dateModified: event.updated_at || event.published_at,
      author: event.author || "Avid Organics",
    }),
  ];

  return (
    <>
      <SeoJsonLd schemas={schemas} />
      <EventDetails data={event} />
    </>
  );
}
