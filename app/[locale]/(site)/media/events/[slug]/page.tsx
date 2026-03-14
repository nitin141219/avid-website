import EventDetails from "@/components/event/EventDetails";
import SeoJsonLd from "@/components/seo/SeoJsonLd";
import {
  buildBreadcrumbItemsFromPath,
  buildBreadcrumbSchema,
  buildArticleSchema,
  buildOrganizationSchema,
  buildSeoMetadata,
  generateSmartTitle,
  generateSmartDescription,
  buildArticleKeywords,
  getSiteUrl,
} from "@/lib/seo";
import { normalizeResponsiveImageSources } from "@/lib/utils";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";

type Props = {
  params: Promise<{ slug: string; locale: string }>;
  // searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

function getEventEndpoints(slug: string, locale: string) {
  const directBackend = process.env.BACKEND_URL
    ? `${process.env.BACKEND_URL}/api/v1/get-event/${slug}?locale=${locale}`
    : "";
  const publicApi = process.env.NEXT_PUBLIC_BASE_URL
    ? `${process.env.NEXT_PUBLIC_BASE_URL}/api/events/${slug}?locale=${locale}`
    : "";
  const hardFallback = (process.env.NEXT_PUBLIC_BASE_URL || "").includes("avidorganics.net")
    ? `https://api.avidorganics.net/api/v1/get-event/${slug}?locale=${locale}`
    : "";

  return [directBackend, publicApi, hardFallback].filter(
    (endpoint, index, arr) => Boolean(endpoint) && arr.indexOf(endpoint) === index
  );
}

const fetchEventPayload = cache(async (slug: string, locale: string) => {
  const endpoints = getEventEndpoints(slug, locale);
  let lastStatus = 500;

  for (const endpoint of endpoints) {
    try {
      const res = await fetch(endpoint, {
        next: { revalidate: 3600 },
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        const json = await res.json();
        return {
          ok: true as const,
          status: res.status,
          data: json?.data ? normalizeResponsiveImageSources(json.data) : null,
        };
      }

      lastStatus = res.status;
      if (res.status === 404) {
        return { ok: false as const, status: 404, data: null };
      }
    } catch {
      // Try next endpoint.
    }
  }

  return { ok: false as const, status: lastStatus, data: null };
});

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, locale } = await params;
  const payload = await fetchEventPayload(slug, locale);
  if (!payload.ok || !payload.data) {
    return {
      title: "Event Not Found",
      robots: { index: false, follow: false },
    };
  }
  const event = payload.data;

  const path = `/media/events/${slug}`;

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
  const payload = await fetchEventPayload(slug, locale);
  if (!payload.ok || !payload.data) {
    return null;
  }

  return {
    event: payload.data ?? {},
  };
}

export default async function Event({ params }: Props) {
  const { slug, locale } = await params;
  const eventData = await getEvent(slug, locale);

  const event = eventData?.event;
  if (!eventData || !event) {
    return notFound();
  }

  const path = `/media/events/${slug}`;
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
