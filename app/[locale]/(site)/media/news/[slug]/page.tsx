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

type Props = {
  params: Promise<{ slug: string; locale: string }>;
  // searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, locale } = await params;
  
  let newsData;
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/news/${slug}?locale=${locale}`, {
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
        console.warn(`News not found: ${slug}`);
        return {
          title: "News Not Found",
          robots: { index: false, follow: false },
        };
      }
      // For other errors (403, 500, etc.), generate minimal metadata
      console.warn(`News API returned ${res.status} for slug: ${slug}`);
      return {
        title: slug.replace(/-/g, " "),
        description: "Avid Organics News",
        robots: { index: true, follow: true }, // Keep indexing enabled for retries
      };
    }
    newsData = await res.json();
  } catch (error) {
    console.error(`Error fetching news metadata for ${slug}:`, error);
    // Return neutral metadata on fetch errors
    return {
      title: slug.replace(/-/g, " "),
      description: "Avid Organics News",
      robots: { index: true, follow: true },
    };
  }
  
  const news = newsData?.data;
  if (!newsData || !news) {
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
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/news/${slug}?locale=${locale}`, {
      cache: "force-cache",
      next: { revalidate: 3600 }, // Revalidate every hour
      headers: {
        "Content-Type": "application/json",
      },
    });
    
    if (!res.ok) {
      // Log specific error codes for debugging
      if (res.status === 403) {
        console.error(`403 Forbidden: News API access denied for slug: ${slug}`);
      } else if (res.status === 404) {
        console.warn(`404 Not Found: News not found for slug: ${slug}`);
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
    console.error(`Error in getNews for ${slug}:`, error);
    return null;
  }
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
