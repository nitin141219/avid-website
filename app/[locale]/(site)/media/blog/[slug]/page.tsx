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
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ slug: string; locale: string }>;
  // searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, locale } = await params;
  
  let blogData;
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/blogs/${slug}?locale=${locale}`, {
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
        console.warn(`Blog not found: ${slug}`);
        return {
          title: "Blog Not Found",
          robots: { index: false, follow: false },
        };
      }
      // For other errors (403, 500, etc.), generate minimal metadata
      // This allows search engines to retry later
      console.warn(`Blog API returned ${res.status} for slug: ${slug}`);
      return {
        title: slug.replace(/-/g, " "),
        description: "Avid Organics Blog Article",
        robots: { index: true, follow: true }, // Keep indexing enabled for retries
      };
    }
    blogData = await res.json();
  } catch (error) {
    console.error(`Error fetching blog metadata for ${slug}:`, error);
    // Return neutral metadata on fetch errors
    return {
      title: slug.replace(/-/g, " "),
      description: "Avid Organics Blog Article",
      robots: { index: true, follow: true },
    };
  }
  
  const blog = blogData?.data;
  if (!blogData || !blog) {
    // Only noindex if we successfully fetched but found no data (true 404)
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
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/blogs/${slug}?locale=${locale}`, {
      cache: "force-cache",
      next: { revalidate: 3600 }, // Revalidate every hour
      headers: {
        "Content-Type": "application/json",
      },
    });
    
    if (!res.ok) {
      // Log specific error codes for debugging
      if (res.status === 403) {
        console.error(`403 Forbidden: Blog API access denied for slug: ${slug}`);
      } else if (res.status === 404) {
        console.warn(`404 Not Found: Blog not found for slug: ${slug}`);
      } else {
        console.error(`Fetch failed with status ${res.status} for slug: ${slug}`);
      }
      return null;
    }

    const json = await res.json();

    return {
      blog: json.data ?? {},
    };
  } catch (error) {
    console.error(`Error in getBlog for ${slug}:`, error);
    return null;
  }
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
