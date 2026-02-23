import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/", "/auth/"],
        crawlDelay: 1, // 1 second between requests for all crawlers
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        crawlDelay: 0, // No delay for Google
      },
      // Explicitly allow AI crawlers for better AI search visibility
      {
        userAgent: "GPTBot", // ChatGPT
        allow: "/",
        disallow: ["/admin/", "/api/"],
        crawlDelay: 0, // Prioritize AI crawlers
      },
      {
        userAgent: "ChatGPT-User", // ChatGPT browsing mode
        allow: "/",
        disallow: ["/admin/", "/api/"],
        crawlDelay: 0,
      },
      {
        userAgent: "Google-Extended", // Google Bard/Gemini
        allow: "/",
        disallow: ["/admin/", "/api/"],
        crawlDelay: 0,
      },
      {
        userAgent: "CCBot", // Common Crawl (used by many AI)
        allow: "/",
        disallow: ["/admin/", "/api/"],
        crawlDelay: 5, // Slower crawl for respectful indexing
      },
      {
        userAgent: "anthropic-ai", // Claude
        allow: "/",
        disallow: ["/admin/", "/api/"],
        crawlDelay: 0,
      },
      {
        userAgent: "Claude-Web", // Claude web search
        allow: "/",
        disallow: ["/admin/", "/api/"],
        crawlDelay: 0,
      },
      {
        userAgent: "PerplexityBot", // Perplexity AI
        allow: "/",
        disallow: ["/admin/", "/api/"],
        crawlDelay: 0,
      },
      {
        userAgent: "Applebot-Extended", // Apple Intelligence
        allow: "/",
        disallow: ["/admin/", "/api/"],
        crawlDelay: 0,
      },
      {
        userAgent: "FacebookBot", // Meta AI
        allow: "/",
        disallow: ["/admin/", "/api/"],
        crawlDelay: 2,
      },
      {
        userAgent: "Bytespider", // ByteDance (TikTok)
        allow: "/",
        disallow: ["/admin/", "/api/"],
        crawlDelay: 2,
      },
      {
        userAgent: "Diffbot", // AI data extraction
        allow: "/",
        disallow: ["/admin/", "/api/"],
        crawlDelay: 5,
      },
    ],
    sitemap: "https://www.avidorganics.net/sitemap.xml",
  };
}

