import BlogDetails from "@/components/blog/BlogDetails";
import SeoJsonLd from "@/components/seo/SeoJsonLd";
import {
  buildBreadcrumbItemsFromPath,
  buildBreadcrumbSchema,
  buildOrganizationSchema,
  buildSeoMetadata,
  getSiteUrl,
  generateSmartTitle,
  generateSmartDescription,
  buildArticleKeywords,
  buildArticleSchema,
} from "@/lib/seo";
import { normalizeResponsiveImageSources } from "@/lib/utils";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";

type Props = {
  params: Promise<{ slug: string; locale: string }>;
  // searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

function getBlogEndpoints(slug: string, locale: string) {
  const directBackend = process.env.BACKEND_URL
    ? `${process.env.BACKEND_URL}/api/v1/get-blog/${slug}?locale=${locale}`
    : "";
  const publicApi = process.env.NEXT_PUBLIC_BASE_URL
    ? `${process.env.NEXT_PUBLIC_BASE_URL}/api/blogs/${slug}?locale=${locale}`
    : "";
  const hardFallback = (process.env.NEXT_PUBLIC_BASE_URL || "").includes("avidorganics.net")
    ? `https://api.avidorganics.net/api/v1/get-blog/${slug}?locale=${locale}`
    : "";

  return [directBackend, publicApi, hardFallback].filter(
    (endpoint, index, arr) => Boolean(endpoint) && arr.indexOf(endpoint) === index
  );
}

const fetchBlogPayload = cache(async (slug: string, locale: string) => {
  const endpoints = getBlogEndpoints(slug, locale);
  let lastStatus = 500;

  for (const endpoint of endpoints) {
    try {
      const res = await fetch(endpoint, {
        cache: "force-cache",
        next: { revalidate: 3600 }, // Revalidate every hour
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
  const payload = await fetchBlogPayload(slug, locale);

  if (!payload.ok && payload.status === 404) {
    return {
      title: "Blog Not Found",
      robots: { index: false, follow: false },
    };
  }
  if (!payload.ok) {
    return {
      title: slug.replace(/-/g, " "),
      description: "Avid Organics Blog Article",
      robots: { index: false, follow: false },
    };
  }

  const blog = payload.data;
  if (!blog) {
    return {
      title: "Blog Not Found",
      robots: { index: false, follow: false },
    };
  }

  const path = `/media/blog/${slug}`;

  // Generate smart title
  const smartTitle = generateSmartTitle({
    name: blog.title,
    type: "article",
  });

  // Generate smart description
  const smartDescription = generateSmartDescription({
    name: blog.title,
    type: "article",
    summary: blog.sub_title || blog.description,
  });

  // Extract keywords from blog content
  const dynamicKeywords = buildArticleKeywords({
    title: blog.title,
    summary: blog.sub_title,
    content: blog.content || blog.description,
    tags: blog.tags || [],
  });

  return buildSeoMetadata(
    {
      title: smartTitle,
      description: smartDescription,
      path,
      locale,
      type: "article",
      image: blog.image,
      author: blog.author || "Avid Organics Pvt. Ltd.",
      keywords: dynamicKeywords,
    },
    undefined
  );
}

async function getBlog(slug: string, locale: string) {
  const payload = await fetchBlogPayload(slug, locale);
  if (!payload.ok || !payload.data) {
    return null;
  }

  return {
    blog: payload.data ?? {},
  };
}

export default async function Blog({ params }: Props) {
  const { slug, locale } = await params;
  const blogData = await getBlog(slug, locale);

  const blog = blogData?.blog;
  if (!blogData || !blog) {
    return notFound();
  }

  const path = `/media/blog/${slug}`;
  const blogUrl = `${getSiteUrl()}/${locale}${path}`;
  const breadcrumbItems = buildBreadcrumbItemsFromPath(path, locale);
  const schemas = [
    buildOrganizationSchema(),
    buildBreadcrumbSchema(breadcrumbItems),
    buildArticleSchema({
      title: blog.title,
      description: blog.sub_title || blog.description,
      image: blog.image || "https://www.avidorganics.net/logo-tagline.png",
      url: blogUrl,
      datePublished: blog.published_at,
      dateModified: blog.updated_at || blog.published_at,
      author: blog.author || "Avid Organics",
    }),
  ];

  return (
    <>
      <SeoJsonLd schemas={schemas} />
      <BlogDetails data={blog} />
    </>
  );
}
