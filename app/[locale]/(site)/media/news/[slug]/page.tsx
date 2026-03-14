import NewsDetails from "@/components/news/NewsDetails";
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
import { cache } from "react";

type Props = {
  params: Promise<{ slug: string; locale: string }>;
  // searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

function getNewsEndpoints(slug: string, locale: string) {
  const directBackend = process.env.BACKEND_URL
    ? `${process.env.BACKEND_URL}/api/v1/get-news/${slug}?locale=${locale}`
    : "";
  const publicApi = process.env.NEXT_PUBLIC_BASE_URL
    ? `${process.env.NEXT_PUBLIC_BASE_URL}/api/news/${slug}?locale=${locale}`
    : "";
  const hardFallback = (process.env.NEXT_PUBLIC_BASE_URL || "").includes("avidorganics.net")
    ? `https://api.avidorganics.net/api/v1/get-news/${slug}?locale=${locale}`
    : "";

  return [directBackend, publicApi, hardFallback].filter(
    (endpoint, index, arr) => Boolean(endpoint) && arr.indexOf(endpoint) === index
  );
}

const fetchNewsPayload = cache(async (slug: string, locale: string) => {
  const endpoints = getNewsEndpoints(slug, locale);
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
        return { ok: true as const, status: res.status, data: json?.data ?? null };
      }

      lastStatus = res.status;
      if (res.status === 404) {
        return { ok: false as const, status: 404, data: null };
      }
    } catch {
      // Try the next endpoint on network failures.
    }
  }

  return { ok: false as const, status: lastStatus, data: null };
});

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, locale } = await params;
  const payload = await fetchNewsPayload(slug, locale);

  if (!payload.ok && payload.status === 404) {
    return {
      title: "News Not Found",
      robots: { index: false, follow: false },
    };
  }
  if (!payload.ok) {
    return {
      title: slug.replace(/-/g, " "),
      description: "Avid Organics News",
      robots: { index: false, follow: false },
    };
  }

  const news = payload.data;
  if (!news) {
    return {
      title: "News Not Found",
      robots: { index: false, follow: false },
    };
  }

  const path = `/media/news/${slug}`;

  // Generate smart title
  const smartTitle = generateSmartTitle({
    name: news.title,
    type: "article",
  });

  // Generate smart description
  const smartDescription = generateSmartDescription({
    name: news.title,
    type: "article",
    summary: news.sub_title || news.description,
  });

  // Extract keywords from news content
  const dynamicKeywords = buildArticleKeywords({
    title: news.title,
    summary: news.sub_title,
    content: news.content || news.description,
    tags: news.tags || [],
  });

  return buildSeoMetadata(
    {
      title: smartTitle,
      description: smartDescription,
      path,
      locale,
      type: "article",
      image: news.image,
      author: news.author || "Avid Organics Pvt. Ltd.",
      keywords: dynamicKeywords,
    },
    undefined
  );
}

async function getNews(slug: string, locale: string) {
  const payload = await fetchNewsPayload(slug, locale);
  if (!payload.ok || !payload.data) {
    return null;
  }

  return {
    event: payload.data ?? {},
  };
}

export default async function Event({ params }: Props) {
  const { slug, locale } = await params;
  const newsData = await getNews(slug, locale);

  const news = newsData?.event;
  if (!newsData || !news) {
    return notFound();
  }

  const path = `/media/news/${slug}`;
  const newsUrl = `${getSiteUrl()}/${locale}${path}`;
  const breadcrumbItems = buildBreadcrumbItemsFromPath(path, locale);
  const schemas = [
    buildOrganizationSchema(),
    buildBreadcrumbSchema(breadcrumbItems),
    buildArticleSchema({
      title: news.title,
      description: news.sub_title || news.description,
      image: news.image || "https://www.avidorganics.net/logo-tagline.png",
      url: newsUrl,
      datePublished: news.published_at,
      dateModified: news.updated_at || news.published_at,
      author: news.author || "Avid Organics",
    }),
  ];

  return (
    <>
      <SeoJsonLd schemas={schemas} />
      <NewsDetails data={news} />
    </>
  );
}
