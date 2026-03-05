import type { Metadata } from "next";
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

// Enhanced regional keywords for India's leading manufacturer positioning
const REGION_KEYWORDS = [
  "India",
  "USA",
  "Europe",
  "manufacturer",
  "specialty chemicals",
  "glycine manufacturer",
  "glycolic acid manufacturer",
];

// Specific regional keywords for better geo-targeting
const GEO_KEYWORDS: Record<string, string[]> = {
  india: [
    "India",
    "Indian",
    "Mumbai",
    "Delhi",
    "Bangalore",
    "Hyderabad",
    "Chennai",
    "Pune",
    "Gujarat",
    "Maharashtra",
    "Proudly made in India",
    "Indian manufacturer",
    "India's leading manufacturer",
    "Made in India for the world",
    "pan India",
    "all India",
    "FSSAI",
    "CDSCO",
    "Indian Pharmacopoeia",
  ],
  usa: [
    "USA",
    "United States",
    "American",
    "FDA approved",
    "USP grade",
    "North America",
    "USA distribution",
    "ship to USA",
    "US market",
    "pharmaceutical grade glycine",
  ],
  europe: [
    "Europe",
    "European",
    "EU",
    "Germany",
    "UK",
    "United Kingdom",
    "France",
    "Spain",
    "Italy",
    "Netherlands",
    "Belgium",
    "REACH compliant",
    "CE certified",
    "European Pharmacopoeia",
    "BP grade",
    "EU market",
    "glycine supplier Europe",
    "glycolic acid Europe",
    "ship to Europe",
  ],
  global: [
    "worldwide",
    "international",
    "global distribution",
    "export",
    "import",
    "worldwide shipping",
    "international delivery",
    "cross-border",
    "specialty chemicals manufacturer",
  ],
};

// Region-specific certification keywords for compliance and quality assurance
const CERTIFICATION_KEYWORDS: Record<string, string[]> = {
  india: [
    "FSSAI certified",
    "FSSAI approved",
    "CDSCO registered",
    "Indian Pharmacopoeia compliant",
    "IP grade",
    "GMP certified India",
    "ISO certified India",
    "Make in India certified",
    "BIS certified",
    "AYUSH approved",
  ],
  usa: [
    "FDA approved",
    "FDA registered",
    "USP grade",
    "USP certified",
    "cGMP certified",
    "NSF certified",
    "Kosher certified",
    "Halal certified USA",
    "GRAS status",
    "DEA registered",
  ],
  europe: [
    "REACH compliant",
    "REACH registered",
    "CE certified",
    "BP grade",
    "European Pharmacopoeia",
    "EP grade",
    "GMP certified EU",
    "ISO 9001 certified",
    "ECHA registered",
    "Halal certified EU",
  ],
  global: [
    "ISO 9001:2015",
    "ISO 14001:2015",
    "OHSAS 18001",
    "GMP certified",
    "WHO-GMP",
    "Kosher certified",
    "Halal certified",
    "Non-GMO certified",
    "Organic certified",
    "Pharmaceutical grade",
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

// Industry and application keywords
const INDUSTRY_KEYWORDS: Record<string, string[]> = {
  "pharmaceuticals": ["pharmaceutical", "API", "excipient", "drug formulation", "GMP certified"],
  "animal-nutrition": ["animal feed", "livestock", "pet food", "bioavailability", "feed additive"],
  "food-and-beverages": ["food grade", "beverage", "FSSAI approved", "preservative", "flavor enhancer"],
  "industrial-and-specialty-applications": ["industrial chemical", "specialty application", "technical grade"],
  "personal-care-and-cosmetics": ["cosmetic grade", "skincare", "personal care", "dermatology", "beauty product"],
};

const PRODUCT_CATEGORY_KEYWORDS: Record<string, string[]> = {
  "alpha-hydroxy-acids": [
    "glycolic acid",
    "AHA",
    "lactic acid",
    "citric acid",
    "alpha hydroxy acid",
    "glycolic acid CAS 79-14-1",
    "cosmetic grade glycolic acid",
    "glycolic acid applications",
  ],
  "amino-acids": [
    "glycine",
    "amino acid",
    "protein building block",
    "USP grade",
    "BP grade",
    "pharmaceutical grade",
    "taurine",
    "glycine CAS 56-40-6",
    "pharmaceutical grade glycine",
    "taurine manufacturer India",
    "amino acid specifications",
  ],
  "speciality-chemicals": ["specialty chemical", "fine chemical", "custom synthesis"],
  "citrates": ["citrate", "buffering agent", "chelating agent"],
};

export function getSiteUrl() {
  return process.env.NEXT_PUBLIC_BASE_URL || FALLBACK_SITE_URL;
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
export function buildKeywords(additional: string[] = []) {
  const all = [...REGION_KEYWORDS, ...additional].filter(Boolean);
  return Array.from(new Set(all));
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
    const extracted = extractKeywordsFromText(description, 5);
    keywords.push(...extracted);
  }
  
  // Add common product keywords with approved claims
  keywords.push(
    "high purity",
    "certified quality",
    "industrial grade",
    "pharmaceutical formulations",
    "specialty chemicals"
  );
  
  // Add region-specific certification keywords (top 3 from each region)
  keywords.push(
    ...CERTIFICATION_KEYWORDS.india.slice(0, 3),
    ...CERTIFICATION_KEYWORDS.usa.slice(0, 3),
    ...CERTIFICATION_KEYWORDS.europe.slice(0, 3),
    ...CERTIFICATION_KEYWORDS.global.slice(0, 2)
  );
  
  // Add geo-targeted keywords for India, USA, Europe
  const geoKeywords = buildGeoKeywords(["india", "usa", "europe"]);
  keywords.push(...geoKeywords.slice(0, 8)); // Add top 8 geo keywords
  
  return buildKeywords(keywords);
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
    const extracted = extractKeywordsFromText(description, 5);
    keywords.push(...extracted);
  }
  
  // Add market-specific terms
  keywords.push(
    "industry solutions",
    "specialized chemicals",
    "application specific",
    "custom formulation"
  );
  
  // Add certification keywords for market credibility (top 2 from each region)
  keywords.push(
    ...CERTIFICATION_KEYWORDS.india.slice(0, 2),
    ...CERTIFICATION_KEYWORDS.usa.slice(0, 2),
    ...CERTIFICATION_KEYWORDS.europe.slice(0, 2),
    ...CERTIFICATION_KEYWORDS.global.slice(0, 2)
  );
  
  // Add geo-targeted keywords for global reach
  const geoKeywords = buildGeoKeywords(["india", "usa", "europe", "global"]);
  keywords.push(...geoKeywords.slice(0, 10)); // Add top 10 geo keywords
  
  return buildKeywords(keywords);
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
    const contentKeywords = extractKeywordsFromText(content, 8);
    keywords.push(...contentKeywords);
  }
  
  return buildKeywords(keywords);
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
    case "product":
      return `${baseName} - Premium Quality Manufacturer | Made in India | Avid Organics`;
    case "market":
      return `${baseName} Solutions - Specialty Chemicals for ${baseName} Industry | Avid Organics`;
    case "article":
      return `${baseName} | Avid Organics Insights`;
    case "page":
    default:
      return `${baseName}${action ? " - " + action : ""} | Avid Organics`;
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
    return summary.slice(0, 160);
  }
  
  switch (type) {
    case "product": {
      let desc = `${name} from Avid Organics - India's leading manufacturer of specialty chemicals. `;
      if (features?.length) {
        desc += `${features.slice(0, 2).join(", ")}. `;
      }
      if (applications?.length) {
        desc += `For ${applications.slice(0, 2).join(", ")}. `;
      }
      desc += "FSSAI, FDA & REACH certified. Proudly made in India for the world. High purity, GMP quality.";
      return desc.slice(0, 160);
    }
    case "market": {
      let desc = `Specialized chemicals for ${name} industry. `;
      if (summary) {
        desc += summary + " ";
      }
      if (applications?.length) {
        desc += `Solutions for ${applications.slice(0, 2).join(", ")}. `;
      }
      desc += "FSSAI, FDA & REACH certified. Trusted globally. Custom formulations available.";
      return desc.slice(0, 160);
    }
    case "article": {
      return summary || `Explore ${name} - insights and updates from Avid Organics, a leading specialty chemicals manufacturer serving global industries.`;
    }
    default: {
      return summary || `Learn more about ${name} at Avid Organics - your trusted partner for specialty chemicals and pharmaceutical ingredients.`;
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
    "en-in": `${baseUrl}/en${normalizedPath}`,
    "en-us": `${baseUrl}/en${normalizedPath}`,
    "en-gb": `${baseUrl}/en${normalizedPath}`,
    "x-default": `${baseUrl}/en${normalizedPath}`,
  };
}

export function buildSeoMetadata(input: SeoInput, override?: SeoOverride): Metadata {
  const baseUrl = getSiteUrl();
  const mergedTitle = override?.title || input.title;
  const mergedDescription = override?.description || input.description;
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
    title: mergedTitle,
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
      creator: "@avidorganics", // Add Twitter handle for better AI attribution
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

export async function fetchSeoOverride(path: string, locale: string) {
  const backendUrl = process.env.BACKEND_URL;
  if (!backendUrl) {
    console.warn("BACKEND_URL not configured, skipping SEO override fetch");
    return null;
  }

  const url = new URL(`${backendUrl}/api/v1/get-seo`);
  url.searchParams.set("path", path);
  url.searchParams.set("locale", locale);

  try {
    const res = await fetch(url.toString(), { 
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
    });
    
    if (!res.ok) {
      // Log specific errors for debugging
      if (res.status === 403) {
        console.error(`403 Forbidden: SEO API access denied for path: ${path}, locale: ${locale}`);
      } else if (res.status === 404) {
        // 404 is expected when no override exists, don't log as error
        console.debug(`No SEO override found for path: ${path}, locale: ${locale}`);
      } else {
        console.warn(`SEO API returned ${res.status} for path: ${path}, locale: ${locale}`);
      }
      return null;
    }
    
    const data = await res.json();
    return (data?.data || null) as SeoOverride | null;
  } catch (error) {
    console.error(`Error fetching SEO override for ${path}:`, error);
    return null;
  }
}

export function buildOrganizationSchema() {
  const baseUrl = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Avid Organics",
    alternateName: "Avid Organics Pvt. Ltd.",
    description: "India's leading manufacturer of Glycine and Glycolic Acid. Rapidly emerging leader in specialty chemicals, setting benchmarks in the chemical industry. Proudly made in India for the world.",
    url: baseUrl,
    logo: {
      "@type": "ImageObject",
      url: `${baseUrl}/logo.png`,
      width: "600",
      height: "60",
    },
    image: `${baseUrl}/logo-tagline.png`,
    email: "info@avidorganics.net",
    foundingDate: "2010", // Update with actual founding year
    address: {
      "@type": "PostalAddress",
      addressCountry: "IN",
      addressRegion: "India",
    },
    areaServed: [
      {
        "@type": "Country",
        name: "India",
      },
      {
        "@type": "Country",
        name: "United States",
      },
      {
        "@type": "Country",
        name: "United Kingdom",
      },
      {
        "@type": "Place",
        name: "Europe",
      },
    ],
    knowsAbout: [
      "Specialty Chemicals",
      "Glycine Manufacturing",
      "Glycolic Acid Manufacturing",
      "Pharmaceutical Ingredients",
      "Amino Acids",
      "Alpha Hydroxy Acids",
      "Chemical Manufacturing",
      "Taurine Manufacturing",
      "GMP Certified Chemicals",
      "ISO Certified Manufacturing",
    ],
    makesOffer: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Specialty Chemicals Supply",
          description: "High-purity specialty chemicals for pharmaceutical, food, personal care, and industrial applications",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Pharmaceutical Ingredients Supply",
          description: "GMP certified pharmaceutical ingredients and excipients",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Amino Acids Supply",
          description: "USP/BP grade amino acids for pharmaceutical and animal nutrition applications",
        },
      },
    ],
    sameAs: [
      "https://www.linkedin.com/company/avid-organics/",
      "https://x.com/avid_organics",
      "https://www.facebook.com/profile.php?id=100090349187598",
      "https://www.instagram.com/avidorganics/",
      "https://youtube.com/@avidorganics?si=tL1AMVvxf03b0ziX",
    ],
    // Enhanced geo-targeting
    "@id": `${baseUrl}/#organization`,
    // Global distribution network
    serviceArea: [
      {
        "@type": "GeoShape",
        addressCountry: "IN",
        name: "India - Nationwide Coverage",
      },
      {
        "@type": "GeoShape",
        addressCountry: "US",
        name: "United States",
      },
      {
        "@type": "GeoShape",
        addressCountry: "GB",
        name: "United Kingdom",
      },
      {
        "@type": "GeoShape",
        addressCountry: "DE",
        name: "Germany",
      },
      {
        "@type": "GeoShape",
        addressCountry: "FR",
        name: "France",
      },
      {
        "@type": "GeoShape",
        addressCountry: "ES",
        name: "Spain",
      },
      {
        "@type": "GeoShape",
        addressCountry: "IT",
        name: "Italy",
      },
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
      name: "Avid Organics - India Operations",
      address: {
        "@type": "PostalAddress",
        addressCountry: "IN",
        addressRegion: "Maharashtra",
        addressLocality: "Mumbai", // Update with actual city
        postalCode: "400001", // Update with actual postal code
        streetAddress: "Avid Organics Headquarters", // Update with actual address
      },
      telephone: null,
      priceRange: "$$$",
      geo: {
        "@type": "GeoCoordinates",
        latitude: "19.0760", // Update with actual coordinates
        longitude: "72.8777",
      },
      areaServed: [
        "India",
        "Mumbai",
        "Delhi",
        "Bangalore",
        "Hyderabad",
        "Chennai",
        "Pune",
        "Gujarat",
        "Maharashtra",
      ],
      keywords: "glycine manufacturer India, glycolic acid manufacturer India, India's leading manufacturer, specialty chemicals India, pharmaceutical ingredients India, FSSAI certified, GMP certified manufacturer India, made in India",
    },
    usa: {
      name: "Avid Organics - USA Distribution",
      address: {
        "@type": "PostalAddress",
        addressCountry: "US",
        addressRegion: "NY", // Update with actual state
        addressLocality: "New York", // Update with actual city
        postalCode: "10001", // Update with actual postal code
        streetAddress: "USA Distribution Center", // Update with actual address
      },
      telephone: "+1-888-570-2843",
      priceRange: "$$$",
      geo: {
        "@type": "GeoCoordinates",
        latitude: "40.7128", // Update with actual coordinates
        longitude: "-74.0060",
      },
      areaServed: [
        "United States",
        "North America",
        "USA",
        "US",
      ],
      keywords: "glycine supplier Europe, pharmaceutical grade glycine, glycolic acid USA, pharmaceutical ingredients USA, FDA approved chemicals, USP grade, specialty chemicals USA"
    },
    europe: {
      name: "Avid Organics - Europe Distribution",
      address: {
        "@type": "PostalAddress",
        addressCountry: "GB",
        addressRegion: "England",
        addressLocality: "London", // Update with actual city
        postalCode: "EC1A 1AA", // Update with actual postal code
        streetAddress: "Europe Distribution Center", // Update with actual address
      },
      telephone: null,
      priceRange: "$$$",
      geo: {
        "@type": "GeoCoordinates",
        latitude: "51.5074", // Update with actual coordinates
        longitude: "-0.1278",
      },
      areaServed: [
        "Europe",
        "United Kingdom",
        "Germany",
        "France",
        "Spain",
        "Italy",
        "Netherlands",
        "Belgium",
        "EU",
      ],
      keywords: "glycine supplier Europe, glycolic acid supplier, REACH compliant chemicals, BP grade, pharmaceutical ingredients UK, specialty chemicals Europe, pharmaceutical grade glycine manufacturer"
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
    geo: data.geo,
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
      {
        "@type": "PropertyValue",
        name: "Certifications",
        value: "FSSAI Certified, FDA Approved, REACH Compliant, GMP Certified, ISO 9001:2015",
      },
      {
        "@type": "PropertyValue",
        name: "Compliance",
        value: "Indian Pharmacopoeia (IP), United States Pharmacopeia (USP), British Pharmacopoeia (BP), European Pharmacopoeia (EP)",
      },
      {
        "@type": "PropertyValue",
        name: "Quality Standards",
        value: "WHO-GMP, cGMP, ISO 14001:2015",
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
