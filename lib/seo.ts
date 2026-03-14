import type { Metadata } from "next";
import { cache } from "react";
import { LOCALIZATION_LANGUAGE } from "@/constants";

export type FaqItem = {
  question: string;
  answer: string;
};

export type SeoOverride = {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  canonical?: string;
  robots?: Metadata["robots"];
  author?: string;
  publisher?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  faqs?: FaqItem[];
};

export type SeoInput = {
  title: string;
  description: string;
  path: string;
  locale: string;
  image?: string;
  type?: "website" | "article" | "product";
  keywords?: string[];
  author?: string;
  publisher?: string;
  robots?: Metadata["robots"];
  canonical?: string;
};

const FALLBACK_SITE_URL = "https://www.avidorganics.net";
const DEFAULT_AUTHOR = "Avid Organics Pvt. Ltd.";
const DEFAULT_PUBLISHER = "Avid Organics Pvt. Ltd.";
const DEFAULT_OG_IMAGE = "/logo-tagline.png";
const TITLE_MAX_LENGTH = 60;
const DESCRIPTION_MAX_LENGTH = 160;
const LOCAL_SEO_PATHS = new Set([
  "",
  "/about-us",
  "/about-us/manufacturing-excellence",
  "/about-us/executive-leadership",
  "/market/pharmaceuticals",
  "/market/personal-care-and-cosmetics",
  "/market/food-and-beverages",
  "/market/animal-nutrition",
  "/market/industrial-and-specialty-applications",
  "/sustainability",
  "/contact-us",
  "/careers/life",
  "/careers/jobs",
  "/media/news",
  "/media/events",
  "/media/blog",
  "/media/downloads",
  "/privacy-policy",
  "/terms-and-conditions",
]);

const GEO_KEYWORDS: Record<string, string[]> = {
  india: [
    "India",
    "Indian manufacturer",
    "Vadodara",
    "Gujarat",
    "India export manufacturer",
  ],
  usa: [
    "United States",
    "United States",
    "North America",
    "US market",
  ],
  europe: [
    "Europe",
    "EU",
    "Germany",
    "UK",
    "France",
    "Netherlands",
    "European market",
  ],
  global: [
    "global supply",
    "global distribution",
    "export",
    "international supply",
  ],
};

// Stop words to filter from keyword extraction
const STOP_WORDS = new Set([
  "the", "a", "an", "and", "or", "but", "in", "on", "at", "to", "for",
  "of", "with", "by", "from", "as", "is", "was", "are", "were", "been",
  "be", "have", "has", "had", "do", "does", "did", "will", "would", "could",
  "should", "may", "might", "can", "this", "that", "these", "those", "it",
  "its", "about", "into", "through", "during", "before", "after", "above",
  "below", "up", "down", "out", "off", "over", "under", "again", "further",
  "then", "once", "here", "there", "when", "where", "why", "how", "all",
  "each", "other", "some", "such", "only", "own", "same", "so", "than",
  "too", "very", "just", "our",
]);

// Clean tracking parameters from URLs for canonical consolidation
function removeTrackingParams(url: string, params: string[] = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "ref",
  "referral",
  "fbclid",
  "gclid",
  "msclkid",
  "source",
  "campaign",
]): string {
  if (typeof window === "undefined" && !url.includes("?")) return url;
  try {
    const urlObj = new URL(url);
    params.forEach((param) => urlObj.searchParams.delete(param));
    return urlObj.toString();
  } catch {
    return url;
  }
}

const INDUSTRY_KEYWORDS: Record<string, string[]> = {
  pharmaceuticals: [
    "pharmaceutical chemicals",
    "pharmaceutical formulations",
    "pharmaceutical intermediates",
    "excipient ingredients",
    "regulated supply",
  ],
  "animal-nutrition": [
    "animal nutrition ingredients",
    "feed additives",
    "amino acids for feed",
    "livestock nutrition",
    "pet nutrition ingredients",
  ],
  "food-and-beverages": [
    "food ingredients",
    "food grade ingredients",
    "beverage ingredients",
    "flavor support ingredients",
    "nutrition ingredients",
  ],
  "industrial-and-specialty-applications": [
    "industrial chemicals",
    "technical grade chemicals",
    "specialty applications",
    "process chemicals",
    "custom industrial formulations",
  ],
  "personal-care-and-cosmetics": [
    "cosmetic ingredients",
    "personal care ingredients",
    "skin care ingredients",
    "glycolic acid for skin care",
    "cosmetic formulation ingredients",
  ],
};

const PRODUCT_CATEGORY_KEYWORDS: Record<string, string[]> = {
  "alpha-hydroxy-acids": [
    "glycolic acid",
    "alpha hydroxy acid",
    "glycolic acid CAS 79-14-1",
    "cosmetic grade glycolic acid",
    "glycolic acid manufacturer",
  ],
  "amino-acids": [
    "glycine",
    "amino acid",
    "USP grade",
    "taurine",
    "glycine CAS 56-40-6",
    "pharmaceutical grade glycine",
    "taurine manufacturer",
    "amino acid manufacturer",
  ],
  "speciality-chemicals": [
    "specialty chemicals",
    "chemical intermediates",
    "fine chemicals",
    "custom synthesis",
  ],
  "citrates": ["citrate", "buffering agent", "chelating agent"],
};

export function getSiteUrl() {
  return process.env.NEXT_PUBLIC_BASE_URL || FALLBACK_SITE_URL;
}

function normalizeSeoPath(path: string) {
  if (!path) return "";
  const normalized = String(path).trim();
  if (!normalized || normalized === "/") return "";
  return normalized.startsWith("/") ? normalized : `/${normalized}`;
}

function shouldSkipRemoteSeoOverride(path: string) {
  if (process.env.ENABLE_REMOTE_SEO_OVERRIDES_FOR_LOCAL_PAGES === "true") {
    return false;
  }

  const normalizedPath = normalizeSeoPath(path);
  if (LOCAL_SEO_PATHS.has(normalizedPath)) {
    return true;
  }

  return normalizedPath.startsWith("/product/");
}

function trimToWordBoundary(text: string, maxLength: number) {
  const normalized = text.replace(/\s+/g, " ").trim();
  if (normalized.length <= maxLength) return normalized;

  const sliced = normalized.slice(0, maxLength + 1);
  const lastSpace = sliced.lastIndexOf(" ");

  if (lastSpace > Math.floor(maxLength * 0.6)) {
    return sliced.slice(0, lastSpace).trim();
  }

  return normalized.slice(0, maxLength).trim();
}

export function ensureTitleLength(title: string, maxLength: number = TITLE_MAX_LENGTH) {
  return trimToWordBoundary(title, maxLength);
}

export function ensureDescriptionLength(
  description: string,
  maxLength: number = DESCRIPTION_MAX_LENGTH
) {
  return trimToWordBoundary(description, maxLength);
}

/**
 * Extract keywords from text content using NLP-like techniques
 */
export function extractKeywordsFromText(text: string, maxKeywords: number = 10): string[] {
  if (!text) return [];
  
  // Remove HTML tags and special characters
  const cleanText = text
    .replace(/<[^>]*>/g, " ")
    .replace(/[^a-zA-Z0-9\s-]/g, " ")
    .toLowerCase();
  
  // Split into words and filter
  const words = cleanText.split(/\s+/);
  const wordFrequency: Record<string, number> = {};
  
  words.forEach(word => {
    // Filter out stop words and short words
    if (word.length > 3 && !STOP_WORDS.has(word)) {
      wordFrequency[word] = (wordFrequency[word] || 0) + 1;
    }
  });
  
  // Sort by frequency and return top keywords
  return Object.entries(wordFrequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, maxKeywords)
    .map(([word]) => word);
}

/**
 * Smart keyword builder with content-aware extraction
 */
function normalizeKeyword(keyword: string) {
  return keyword.replace(/\s+/g, " ").trim();
}

export function buildKeywords(additional: string[] = [], maxKeywords: number = 12) {
  const deduped = new Map<string, string>();

  additional
    .map((keyword) => normalizeKeyword(keyword))
    .filter(Boolean)
    .forEach((keyword) => {
      const key = keyword.toLowerCase();
      if (!deduped.has(key)) {
        deduped.set(key, keyword);
      }
    });

  return Array.from(deduped.values()).slice(0, maxKeywords);
}

/**
 * Build geo-targeted keywords for specific regions
 */
export function buildGeoKeywords(regions: ("india" | "usa" | "europe" | "global")[] = ["india", "usa", "europe"]): string[] {
  const keywords: string[] = [];
  
  regions.forEach(region => {
    if (GEO_KEYWORDS[region]) {
      keywords.push(...GEO_KEYWORDS[region]);
    }
  });
  
  return keywords;
}

/**
 * Build product-specific keywords from product data
 */
export function buildProductKeywords({
  productName,
  category,
  applications,
  description,
}: {
  productName: string;
  category?: string;
  applications?: string[];
  description?: string;
}): string[] {
  const keywords: string[] = [];
  
  // Add product name variations
  keywords.push(productName);
  
  // Add category keywords
  if (category && PRODUCT_CATEGORY_KEYWORDS[category]) {
    keywords.push(...PRODUCT_CATEGORY_KEYWORDS[category]);
  }
  
  // Add application-based keywords
  if (applications?.length) {
    applications.forEach(app => {
      const appLower = app.toLowerCase();
      Object.entries(INDUSTRY_KEYWORDS).forEach(([key, industryKeys]) => {
        if (appLower.includes(key.replace(/-/g, " "))) {
          keywords.push(...industryKeys);
        }
      });
    });
  }
  
  // Extract keywords from description
  if (description) {
    const extracted = extractKeywordsFromText(description, 4);
    keywords.push(...extracted);
  }

  const lowerName = productName.toLowerCase();
  if (lowerName.includes("glycine")) {
    keywords.push("glycine manufacturer", "glycine supplier", "glycine applications");
  }
  if (lowerName.includes("glycolic")) {
    keywords.push("glycolic acid manufacturer", "glycolic acid supplier", "glycolic acid applications");
  }
  if (lowerName.includes("taurine")) {
    keywords.push("taurine manufacturer", "taurine supplier", "taurine applications");
  }

  keywords.push("Avid Organics");

  return buildKeywords(keywords, 12);
}

/**
 * Build market/industry-specific keywords
 */
export function buildMarketKeywords({
  marketName,
  marketSlug,
  solutions,
  description,
}: {
  marketName: string;
  marketSlug?: string;
  solutions?: string[];
  description?: string;
}): string[] {
  const keywords: string[] = [];
  
  // Add market name
  keywords.push(marketName);
  
  // Add industry-specific keywords
  if (marketSlug && INDUSTRY_KEYWORDS[marketSlug]) {
    keywords.push(...INDUSTRY_KEYWORDS[marketSlug]);
  }
  
  // Add solution-based keywords
  if (solutions?.length) {
    keywords.push(...solutions);
  }
  
  // Extract from description
  if (description) {
    const extracted = extractKeywordsFromText(description, 4);
    keywords.push(...extracted);
  }

  keywords.push("Avid Organics");

  return buildKeywords(keywords, 10);
}

/**
 * Build blog/article keywords from content
 */
export function buildArticleKeywords({
  title,
  summary,
  content,
  tags,
}: {
  title: string;
  summary?: string;
  content?: string;
  tags?: string[];
}): string[] {
  const keywords: string[] = [];
  
  // Add tags if available
  if (tags?.length) {
    keywords.push(...tags);
  }
  
  // Extract from title
  const titleKeywords = extractKeywordsFromText(title, 3);
  keywords.push(...titleKeywords);
  
  // Extract from summary
  if (summary) {
    const summaryKeywords = extractKeywordsFromText(summary, 5);
    keywords.push(...summaryKeywords);
  }
  
  // Extract from content
  if (content) {
    const contentKeywords = extractKeywordsFromText(content, 6);
    keywords.push(...contentKeywords);
  }

  keywords.push("Avid Organics");

  return buildKeywords(keywords, 10);
}

/**
 * Generate smart title from content
 */
export function generateSmartTitle({
  name,
  type = "product",
  category,
  action,
}: {
  name: string;
  type?: "product" | "market" | "article" | "page";
  category?: string;
  action?: string;
}): string {
  const baseName = name.trim();
  
  switch (type) {
    case "product": {
      const lowerName = baseName.toLowerCase();
      let title = `${baseName} | Avid Organics`;

      if (lowerName.includes("glycine")) {
        title = `${baseName} | Glycine Manufacturer | Avid Organics`;
      } else if (lowerName.includes("glycolic")) {
        title = `${baseName} | Glycolic Acid Manufacturer | Avid Organics`;
      } else if (lowerName.includes("taurine")) {
        title = `${baseName} | Taurine Manufacturer | Avid Organics`;
      } else if (category) {
        title = `${baseName} | ${category} | Avid Organics`;
      }

      return ensureTitleLength(title);
    }
    case "market":
      if (/pharmaceutical/i.test(baseName)) {
        return ensureTitleLength("Chemicals for Pharmaceuticals | Avid Organics");
      }
      if (/personal care|cosmetic/i.test(baseName)) {
        return ensureTitleLength("Chemicals for Personal Care | Avid Organics");
      }
      if (/food/i.test(baseName)) {
        return ensureTitleLength("Chemicals for Food & Beverage | Avid Organics");
      }
      if (/animal/i.test(baseName)) {
        return ensureTitleLength("Chemicals for Animal Nutrition | Avid Organics");
      }
      if (/industrial/i.test(baseName)) {
        return ensureTitleLength("Chemicals for Industrial Applications | Avid Organics");
      }
      return ensureTitleLength(`${baseName} Solutions | Avid Organics`);
    case "article":
      return ensureTitleLength(`${baseName} | Avid Organics`);
    case "page":
    default:
      return ensureTitleLength(`${baseName}${action ? " - " + action : ""} | Avid Organics`);
  }
}

/**
 * Generate smart description from content
 */
export function generateSmartDescription({
  name,
  type = "product",
  summary,
  features,
  applications,
}: {
  name: string;
  type?: "product" | "market" | "article" | "page";
  summary?: string;
  features?: string[];
  applications?: string[];
}): string {
  if (summary && summary.length >= 120) {
    // Use provided summary if it's substantial
    return ensureDescriptionLength(summary);
  }
  
  switch (type) {
    case "product": {
      let desc = `${name} from Avid Organics for regulated and industrial applications. `;
      if (features?.length) {
        desc += `${features.slice(0, 2).join(", ")}. `;
      }
      if (applications?.length) {
        desc += `For ${applications.slice(0, 2).join(", ")}. `;
      }
      desc += "Export supply with technical support, batch documentation, and dependable quality.";
      return ensureDescriptionLength(desc);
    }
    case "market": {
      let desc = `Specialty chemicals for ${name} applications from Avid Organics. `;
      if (summary) {
        desc += summary + " ";
      }
      if (applications?.length) {
        desc += `Solutions for ${applications.slice(0, 2).join(", ")}. `;
      }
      desc += "Technical support, export documentation, and dependable global supply.";
      return ensureDescriptionLength(desc);
    }
    case "article": {
      return ensureDescriptionLength(
        summary ||
          `Explore ${name} with technical insights and industry updates from Avid Organics.`
      );
    }
    default: {
      return ensureDescriptionLength(
        summary || `Learn more about ${name} at Avid Organics, manufacturer of specialty chemicals.`
      );
    }
  }
}

export function buildImageAlt(base: string, includeKeywords: boolean = true) {
  const normalized = base?.trim() || "Avid Organics product";
  if (!includeKeywords) return normalized;
  return `${normalized} - manufacturer, specialty chemicals, made in India, distributed worldwide`;
}

export function buildHreflangAlternates(path: string) {
  const baseUrl = getSiteUrl();
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const locales = LOCALIZATION_LANGUAGE.map((item) => item.value);
  const localeAlternates: Record<string, string> = {};

  locales.forEach((locale) => {
    localeAlternates[locale] = `${baseUrl}/${locale}${normalizedPath}`;
  });

  return {
    ...localeAlternates,
    "en-us": `${baseUrl}/en${normalizedPath}`,
    "en-gb": `${baseUrl}/en${normalizedPath}`,
    "en-nl": `${baseUrl}/en${normalizedPath}`,
    "de-de": `${baseUrl}/de${normalizedPath}`,
    "fr-fr": `${baseUrl}/fr${normalizedPath}`,
    "x-default": `${baseUrl}/en${normalizedPath}`,
  };
}

export function buildSeoMetadata(input: SeoInput, override?: SeoOverride): Metadata {
  const baseUrl = getSiteUrl();
  const mergedTitle = ensureTitleLength(override?.title || input.title);
  const mergedDescription = ensureDescriptionLength(override?.description || input.description);
  const mergedImage = override?.image || input.image || DEFAULT_OG_IMAGE;
  const mergedKeywords = buildKeywords([...(input.keywords || []), ...(override?.keywords || [])]);
  const mergedAuthor = override?.author || input.author || DEFAULT_AUTHOR;
  const mergedPublisher = override?.publisher || input.publisher || DEFAULT_PUBLISHER;
  const cleanPath = removeTrackingParams(`${baseUrl}/${input.locale}${input.path}`);
  const mergedCanonical = override?.canonical || input.canonical || cleanPath;
  const mergedRobots = override?.robots || input.robots || { 
    index: true, 
    follow: true,
    // AI crawler specific directives
    "max-snippet": -1, // Allow unlimited text snippets for AI
    "max-image-preview": "large", // Allow large image previews
    "max-video-preview": -1, // Allow unlimited video previews
  };

  const ogType = input.type === "product" ? "website" : input.type || "website";

  return {
    title: {
      absolute: mergedTitle,
    },
    description: mergedDescription,
    keywords: mergedKeywords,
    authors: [{ name: mergedAuthor }],
    creator: mergedAuthor,
    publisher: mergedPublisher,
    robots: mergedRobots,
    alternates: {
      canonical: mergedCanonical,
      languages: buildHreflangAlternates(input.path),
    },
    openGraph: {
      type: ogType,
      url: mergedCanonical,
      title: override?.ogTitle || mergedTitle,
      description: override?.ogDescription || mergedDescription,
      images: [
        {
          url: override?.ogImage || mergedImage,
          width: 1200,
          height: 630,
          alt: override?.ogTitle || mergedTitle,
        },
      ],
      siteName: "Avid Organics",
      locale: input.locale,
    },
    twitter: {
      card: "summary_large_image",
      title: override?.twitterTitle || mergedTitle,
      description: override?.twitterDescription || mergedDescription,
      images: [override?.twitterImage || mergedImage],
      creator: "@avid_organics",
    },
    // Additional metadata for AI crawlers
    other: {
      // Help AI understand the business type
      "article:publisher": "Avid Organics Pvt. Ltd.",
      "og:business": "chemicals_manufacturer",
      "og:type": ogType,
    },
    metadataBase: new URL(baseUrl),
  };
}

export const fetchSeoOverride = cache(async (path: string, locale: string) => {
  if (shouldSkipRemoteSeoOverride(path)) {
    return null;
  }

  const rawEndpoints = [
    process.env.BACKEND_URL || "",
    (process.env.NEXT_PUBLIC_BASE_URL || "").includes("avidorganics.net")
      ? "https://api.avidorganics.net"
      : "",
  ];

  const endpointBases = rawEndpoints.filter(
    (value, index, arr) => Boolean(value) && arr.indexOf(value) === index
  );
  if (endpointBases.length === 0) return null;

  for (const base of endpointBases) {
    try {
      const url = new URL("/api/v1/get-seo", base);
      url.searchParams.set("path", path);
      url.searchParams.set("locale", locale);

      const res = await fetch(url.toString(), {
        next: { revalidate: 300 },
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        if (res.status === 404) return null;
        if (res.status === 403) continue;
        continue;
      }

      const data = await res.json();
      return (data?.data || null) as SeoOverride | null;
    } catch {
      // Network errors are expected on unreachable local backends; try next endpoint.
      continue;
    }
  }

  return null;
});

export function buildOrganizationSchema() {
  const baseUrl = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${baseUrl}/#organization`,
    name: "Avid Organics Pvt. Ltd.",
    alternateName: "Avid Organics",
    description:
      "Manufacturer of glycine, glycolic acid, and specialty chemicals for pharmaceutical, food, personal care, and industrial applications.",
    url: baseUrl,
    logo: {
      "@type": "ImageObject",
      url: `${baseUrl}/logo.png`,
      width: 600,
      height: 60,
    },
    image: `${baseUrl}/logo-tagline.png`,
    email: "info@avidorganics.net",
    telephone: "+91-265-2370829",
    foundingDate: "2007",
    address: {
      "@type": "PostalAddress",
      streetAddress: "409/410 Sears Towers, Sevasi",
      addressLocality: "Vadodara",
      addressRegion: "Gujarat",
      postalCode: "391101",
      addressCountry: "IN",
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "sales",
        email: "info@avidorganics.net",
        telephone: "+91-265-2370829",
        areaServed: ["US", "GB", "DE", "FR", "NL", "IN"],
        availableLanguage: ["en", "de", "fr"],
      },
    ],
    areaServed: [
      { "@type": "Country", name: "India" },
      { "@type": "Country", name: "United States" },
      { "@type": "Country", name: "United Kingdom" },
      { "@type": "Country", name: "Germany" },
      { "@type": "Country", name: "France" },
      { "@type": "Country", name: "Netherlands" },
    ],
    numberOfEmployees: {
      "@type": "QuantitativeValue",
      value: 150,
    },
    knowsAbout: [
      "Specialty Chemicals",
      "Glycine Manufacturing",
      "Glycolic Acid Manufacturing",
      "Pharmaceutical Ingredients",
      "Amino Acids",
      "Alpha Hydroxy Acids",
      "Chemical Manufacturing",
      "Taurine Manufacturing",
      "Formaldehyde-free Glycine",
      "Pharmaceutical Grade Glycine",
    ],
    award: [
      "FSSC 22000",
      "ISO 14001",
      "ISO 45001",
      "HALAL",
      "KOSHER",
      "SMETA",
    ],
    sameAs: [
      "https://www.linkedin.com/company/avid-organics/",
      "https://x.com/avid_organics",
      "https://www.facebook.com/profile.php?id=100090349187598",
      "https://www.instagram.com/avidorganics/",
      "https://youtube.com/@avidorganics?si=tL1AMVvxf03b0ziX",
    ],
  };
}

/**
 * Build LocalBusiness schema for regional SEO targeting
 */
export function buildLocalBusinessSchema(region: "india" | "usa" | "europe" = "india") {
  const baseUrl = getSiteUrl();
  
  const regionalData = {
    india: {
      name: "Avid Organics Pvt. Ltd.",
      address: {
        "@type": "PostalAddress",
        addressCountry: "IN",
        addressRegion: "Gujarat",
        addressLocality: "Vadodara",
        postalCode: "391101",
        streetAddress: "409/410 Sears Towers, Sevasi",
      },
      telephone: "+91-265-2370829",
      priceRange: "$$$",
      areaServed: [
        "India",
        "Gujarat",
        "Vadodara",
      ],
      keywords:
        "glycine manufacturer India, glycolic acid manufacturer India, specialty chemicals India, pharmaceutical ingredients India, export-ready manufacturer",
    },
    usa: {
      name: "Avid Organics America Inc.",
      address: {
        "@type": "PostalAddress",
        addressCountry: "US",
        addressRegion: "Texas",
        addressLocality: "Texas",
        streetAddress: "5021 Vernon Avenue S, #209",
      },
      telephone: undefined,
      priceRange: "$$$",
      areaServed: ["United States", "North America", "USA", "US"],
      keywords:
        "glycine supplier USA, glycolic acid supplier USA, pharmaceutical ingredients USA, specialty chemicals USA",
    },
    europe: {
      name: "Avid Organics Europe B.V. (i.o.)",
      address: {
        "@type": "PostalAddress",
        addressCountry: "NL",
        addressRegion: "Limburg",
        addressLocality: "Maastricht",
        postalCode: "6221 KX",
        streetAddress: "Avenue Ceramique 221",
      },
      telephone: null,
      priceRange: "$$$",
      areaServed: [
        "Europe",
        "Netherlands",
        "Germany",
        "France",
        "EU",
      ],
      keywords:
        "glycine supplier Europe, glycolic acid supplier Europe, specialty chemicals Netherlands, pharmaceutical ingredients Europe, REACH support",
    },
  };

  const data = regionalData[region];

  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${baseUrl}/#localbusiness-${region}`,
    name: data.name,
    image: `${baseUrl}/logo-tagline.png`,
    url: baseUrl,
    ...(data.telephone ? { telephone: data.telephone } : {}),
    priceRange: data.priceRange,
    address: data.address,
    areaServed: data.areaServed,
    keywords: data.keywords,
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "18:00",
    },
    sameAs: [
      "https://www.linkedin.com/company/avid-organics/",
      "https://x.com/avid_organics",
      "https://www.facebook.com/profile.php?id=100090349187598",
    ],
  };
}

export function toTitleCaseSegment(segment: string) {
  const s = decodeURIComponent(segment)
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .replace(/[#_]+/g, "")
    .trim();

  return s
    .split(" ")
    .map((word) => (word ? word[0].toUpperCase() + word.slice(1).toLowerCase() : ""))
    .join(" ");
}

export function buildBreadcrumbItemsFromPath(path: string, locale: string) {
  const baseUrl = getSiteUrl();
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const segments = normalizedPath.split("/").filter(Boolean);
  const items: { name: string; url: string }[] = [
    {
      name: "Home",
      url: `${baseUrl}/${locale}`,
    },
  ];

  segments.forEach((segment, index) => {
    const url = `${baseUrl}/${locale}/${segments.slice(0, index + 1).join("/")}`;
    items.push({
      name: toTitleCaseSegment(segment),
      url,
    });
  });

  return items;
}

export function buildBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function buildFaqSchema(items: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function buildProductSchema(input: {
  name: string;
  description: string;
  image: string;
  url: string;
  brand?: string;
  sku?: string;
  applications?: string[];
}) {
  const lowerName = input.name.toLowerCase();
  const inferredCas = lowerName.includes("glycine")
    ? "56-40-6"
    : lowerName.includes("glycolic")
      ? "79-14-1"
      : undefined;
  const inferredCategory = lowerName.includes("glycine")
    ? "Amino Acid"
    : lowerName.includes("glycolic")
      ? "Alpha Hydroxy Acid"
      : "Specialty Chemical";
  const applicationProperties = (input.applications || [])
    .filter(Boolean)
    .slice(0, 8)
    .map((application) => ({
      "@type": "PropertyValue",
      name: "Primary Application",
      value: application,
    }));

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: input.name,
    description: input.description,
    image: [input.image],
    sku: input.sku,
    mpn: inferredCas,
    category: inferredCategory,
    brand: {
      "@type": "Brand",
      name: input.brand || "Avid Organics",
    },
    url: input.url,
    manufacturer: {
      "@type": "Organization",
      name: "Avid Organics",
      url: getSiteUrl(),
    },
    offers: {
      "@type": "Offer",
      url: input.url,
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: {
        "@type": "Organization",
        name: "Avid Organics",
        url: getSiteUrl(),
      },
    },
    additionalProperty: [
      ...(inferredCas
        ? [
            {
              "@type": "PropertyValue",
              name: "CAS Number",
              value: inferredCas,
            },
          ]
        : []),
      {
        "@type": "PropertyValue",
        name: "Certifications",
        value: "FSSC 22000, ISO 14001, ISO 45001, HALAL, KOSHER, SMETA",
      },
      {
        "@type": "PropertyValue",
        name: "Supply Capability",
        value: "Export documentation, technical support, and batch traceability for regulated and industrial customers",
      },
      {
        "@type": "PropertyValue",
        name: "Markets Served",
        value: "India, United States, United Kingdom, Germany, France, Netherlands",
      },
      ...applicationProperties,
    ],
    audience: {
      "@type": "Audience",
      audienceType: "B2B, Industrial, Pharmaceutical, Research",
      geographicArea: [
        { "@type": "Country", name: "India" },
        { "@type": "Country", name: "United States" },
        { "@type": "Country", name: "United Kingdom" },
        { "@type": "Country", name: "Germany" },
        { "@type": "Country", name: "France" },
      ],
    },
  };
}

/**
 * Build Author schema for content expertise signals (EEAT)
 */
export function buildAuthorSchema(author?: { name?: string; expertise?: string; image?: string }) {
  const authorName = author?.name || "Avid Organics Team";
  const expertise = author?.expertise || "Specialty Chemicals Manufacturing, Pharmaceutical Ingredients, Industrial Solutions";
  
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": authorName,
    "url": "https://www.avidorganics.net/about-us/executive-leadership",
    "sameAs": [
      "https://www.linkedin.com/company/avid-organics",
      "https://www.facebook.com/avidorganics",
      "https://www.instagram.com/avidorganics",
    ],
    "image": author?.image || "https://www.avidorganics.net/logo-tagline.png",
    "jobTitle": "Author & Industry Expert",
    "expertise": expertise,
    "affiliation": {
      "@type": "Organization",
      "name": "Avid Organics Pvt. Ltd.",
      "url": "https://www.avidorganics.net",
    },
  };
}

/**
 * Build Website SearchAction schema for sitelinks searchbox
 */
export function buildWebsiteSearchSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "url": "https://www.avidorganics.net",
    "name": "Avid Organics",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://www.avidorganics.net/search?q={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  };
}

/**
 * Build Article schema with author for blog/news/event pages
 */
export function buildArticleSchema(input: {
  title: string;
  description: string;
  image: string;
  url: string;
  datePublished?: string;
  dateModified?: string;
  author?: string;
  authorImage?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": input.title,
    "description": input.description,
    "image": [input.image],
    "url": input.url,
    "datePublished": input.datePublished || new Date().toISOString(),
    "dateModified": input.dateModified || new Date().toISOString(),
    "author": {
      "@type": "Organization",
      "name": input.author || "Avid Organics",
      "logo": "https://www.avidorganics.net/logo.png",
      "url": "https://www.avidorganics.net",
    },
    "publisher": {
      "@type": "Organization",
      "name": "Avid Organics",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.avidorganics.net/logo.png",
        "width": 220,
        "height": 50,
      },
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": input.url,
    },
  };
}
