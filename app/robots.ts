import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const disallowedPrivatePaths = [
    "/admin/",
    "/dashboard/",
    "/api/",
    "/auth/",
    "/login",
    "/signup",
    "/forgot-password",
    "/reset-password",
    "/*/admin/",
    "/*/login",
    "/*/signup",
    "/*/forgot-password",
    "/*/settings",
    "/*/history",
    "/*/reset-password/",
  ];

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: disallowedPrivatePaths,
        crawlDelay: 1, // 1 second between requests for all crawlers
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: disallowedPrivatePaths,
        crawlDelay: 0, // No delay for Google
      },
      // Explicitly allow AI crawlers for better AI search visibility
      {
        userAgent: "GPTBot", // ChatGPT
        allow: "/",
        disallow: disallowedPrivatePaths,
        crawlDelay: 0, // Prioritize AI crawlers
      },
      {
        userAgent: "ChatGPT-User", // ChatGPT browsing mode
        allow: "/",
        disallow: disallowedPrivatePaths,
        crawlDelay: 0,
      },
      {
        userAgent: "Google-Extended", // Google Bard/Gemini
        allow: "/",
        disallow: disallowedPrivatePaths,
        crawlDelay: 0,
      },
      {
        userAgent: "CCBot", // Common Crawl (used by many AI)
        allow: "/",
        disallow: disallowedPrivatePaths,
        crawlDelay: 5, // Slower crawl for respectful indexing
      },
      {
        userAgent: "anthropic-ai", // Claude
        allow: "/",
        disallow: disallowedPrivatePaths,
        crawlDelay: 0,
      },
      {
        userAgent: "Claude-Web", // Claude web search
        allow: "/",
        disallow: disallowedPrivatePaths,
        crawlDelay: 0,
      },
      {
        userAgent: "PerplexityBot", // Perplexity AI
        allow: "/",
        disallow: disallowedPrivatePaths,
        crawlDelay: 0,
      },
      {
        userAgent: "Applebot-Extended", // Apple Intelligence
        allow: "/",
        disallow: disallowedPrivatePaths,
        crawlDelay: 0,
      },
      {
        userAgent: "FacebookBot", // Meta AI
        allow: "/",
        disallow: disallowedPrivatePaths,
        crawlDelay: 2,
      },
      {
        userAgent: "Bytespider", // ByteDance (TikTok)
        allow: "/",
        disallow: disallowedPrivatePaths,
        crawlDelay: 2,
      },
      {
        userAgent: "Diffbot", // AI data extraction
        allow: "/",
        disallow: disallowedPrivatePaths,
        crawlDelay: 5,
      },
    ],
    sitemap: "https://www.avidorganics.net/sitemap.xml",
  };
}

