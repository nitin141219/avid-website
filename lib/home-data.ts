import { HomepageSlide } from "@/types/homepage-slide";
import { getMongoDb } from "@/lib/mongodb";
import { normalizeResponsiveImageSources } from "@/lib/utils";

type NewsItem = {
  _id: string;
  slug: string;
  title: string;
  sub_title?: string;
  author?: string;
  image?: string;
  image_mobile?: string;
  imageMobile?: string;
  mobileImage?: string;
  published_at?: string;
};

type SpotlightItem = {
  _id: string;
  slug: string;
  title: string;
  image?: string;
  image_mobile?: string;
  imageMobile?: string;
  mobileImage?: string;
  type?: string;
};

function extractSpotlightItems(payload: any): SpotlightItem[] {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.data?.spotlights)) return payload.data.spotlights;
  if (Array.isArray(payload?.data?.spotlight)) return payload.data.spotlight;
  if (Array.isArray(payload?.spotlights)) return payload.spotlights;
  if (Array.isArray(payload?.spotlight)) return payload.spotlight;
  return [];
}

function getApiBaseUrl() {
  return process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BASE_URL || "";
}

function buildHomepageSlideImageUrl(value?: string | null): string {
  if (!value) return "";
  if (/^https?:\/\//i.test(value) || value.startsWith("/")) return value;

  const backendBase = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL || "";
  if (!backendBase) return value;

  return `${backendBase.replace(/\/+$/, "")}/image/homepage-slide/${value}`;
}

function resolveLocalizedSlideField(
  slide: HomepageSlide,
  field: "title" | "cta_text",
  locale: string
): string {
  const candidates = [
    slide[`${field}_${locale}`],
    slide[`${field}${locale.charAt(0).toUpperCase()}${locale.slice(1)}`],
    typeof slide[field] === "object" && slide[field] !== null
      ? (slide[field] as Record<string, unknown>)[locale]
      : undefined,
    typeof slide.translations === "object" && slide.translations !== null
      ? (slide.translations as Record<string, unknown>)[`${field}_${locale}`]
      : undefined,
    typeof slide.translations === "object" && slide.translations !== null
      ? (
          (slide.translations as Record<string, unknown>)[locale] as
            | Record<string, unknown>
            | undefined
        )?.[field]
      : undefined,
    slide[`${field}_en`],
    typeof slide[field] === "object" && slide[field] !== null
      ? (slide[field] as Record<string, unknown>).en
      : undefined,
    slide[field],
  ];

  for (const candidate of candidates) {
    if (typeof candidate === "string" && candidate.trim().length > 0) {
      return candidate;
    }
  }

  return "";
}

async function fetchCustomerNews(
  baseUrl: string,
  locale: string,
  limit: number
): Promise<NewsItem[]> {
  const endpoint = baseUrl.includes("api.avidorganics.net")
    ? "/api/v1/customer/get-news"
    : process.env.BACKEND_URL
      ? "/api/v1/customer/get-news"
      : "/api/news";

  const url = new URL(endpoint, baseUrl);
  url.searchParams.set("limit", String(limit));
  url.searchParams.set("page", "1");
  url.searchParams.set("locale", locale);

  const res = await fetch(url.toString(), {
    next: { revalidate: 120 },
  });

  if (!res.ok) return [];
  const json = await res.json();
  if (!Array.isArray(json?.data?.news)) return [];

  return json.data.news.map((item: NewsItem) => normalizeResponsiveImageSources(item));
}

export async function getHomeNews(locale: string, limit = 6): Promise<NewsItem[]> {
  const apiBaseUrl = getApiBaseUrl();
  if (!apiBaseUrl) return [];

  try {
    const primary = await fetchCustomerNews(apiBaseUrl, locale, limit);
    if (primary.length > 0) return primary;

    const publicBase = process.env.NEXT_PUBLIC_BASE_URL || "";
    if (publicBase.includes("avidorganics.net")) {
      const fallback = await fetchCustomerNews("https://api.avidorganics.net", locale, limit);
      if (fallback.length > 0) return fallback;
    }

    return [];
  } catch (error) {
    console.error("Failed to preload home news:", error);
    try {
      const publicBase = process.env.NEXT_PUBLIC_BASE_URL || "";
      if (publicBase.includes("avidorganics.net")) {
        return await fetchCustomerNews("https://api.avidorganics.net", locale, limit);
      }
      return [];
    } catch {
      return [];
    }
  }
}

export async function getSpotlights(): Promise<SpotlightItem[]> {
  const backendUrl = process.env.BACKEND_URL;
  const apiBaseUrl = getApiBaseUrl();
  if (!apiBaseUrl) return [];

  const endpoint = backendUrl ? "/api/v1/get-spotlight" : "/api/get-spotlight";
  let url: URL;
  try {
    url = new URL(endpoint, apiBaseUrl);
  } catch {
    return [];
  }

  try {
    const res = await fetch(url.toString(), {
      next: { revalidate: 300 },
    });

    if (!res.ok) return [];

    const json = await res.json();
    const items = extractSpotlightItems(json);
    if (items.length === 0) return [];

    return items.map((item: SpotlightItem) => ({
      ...normalizeResponsiveImageSources(item),
    }));
  } catch (error) {
    console.error("Failed to preload spotlights:", error);
    return [];
  }
}

async function fetchHomepageSlides(baseUrl: string, locale: string): Promise<HomepageSlide[]> {
  const endpoint = baseUrl.includes("api.avidorganics.net")
    ? "/api/v1/customer/get-homepage-slides"
    : process.env.BACKEND_URL
      ? "/api/v1/customer/get-homepage-slides"
      : "/api/customer/get-homepage-slides";

  const url = new URL(endpoint, baseUrl);
  url.searchParams.set("locale", locale);

  const res = await fetch(url.toString(), {
    next: { revalidate: 120 },
  });

  if (!res.ok) return [];
  const json = await res.json();
  const rawSlides = Array.isArray(json?.data) ? json.data : [];

  return rawSlides.map((item: HomepageSlide) =>
    normalizeResponsiveImageSources({
      ...item,
      title: resolveLocalizedSlideField(item, "title", locale),
      cta_text: resolveLocalizedSlideField(item, "cta_text", locale),
    })
  );
}

async function fetchHomepageSlidesFromMongo(locale: string): Promise<HomepageSlide[]> {
  try {
    const db = await getMongoDb();
    const slides = await db
      .collection("homepage_slides")
      .find({ is_active: true })
      .sort({ position: 1, created_at: 1 })
      .toArray();

    return slides.map((item: any) =>
      normalizeResponsiveImageSources({
        _id: String(item._id),
        title: resolveLocalizedSlideField(item, "title", locale),
        cta_text: resolveLocalizedSlideField(item, "cta_text", locale),
        cta_link: item.cta_link || "",
        position: Number(item.position || 0),
        align: item.align === "right" ? "right" : "left",
        image: buildHomepageSlideImageUrl(item.image),
        image_mobile: buildHomepageSlideImageUrl(
          item.image_mobile || item.imageMobile || item.mobileImage
        ),
        imageMobile: buildHomepageSlideImageUrl(item.imageMobile || item.image_mobile),
        mobileImage: buildHomepageSlideImageUrl(item.mobileImage || item.image_mobile),
        is_active: Boolean(item.is_active),
        title_en: item.title_en,
        title_de: item.title_de,
        title_fr: item.title_fr,
        title_es: item.title_es,
        cta_text_en: item.cta_text_en,
        cta_text_de: item.cta_text_de,
        cta_text_fr: item.cta_text_fr,
        cta_text_es: item.cta_text_es,
      } as HomepageSlide)
    );
  } catch (error) {
    console.error("Failed to load homepage slides from MongoDB:", error);
    return [];
  }
}

export async function getHomepageSlides(locale: string): Promise<HomepageSlide[]> {
  const mongoSlides = await fetchHomepageSlidesFromMongo(locale);
  if (mongoSlides.length > 0) return mongoSlides;

  const apiBaseUrl = getApiBaseUrl();
  if (!apiBaseUrl) return [];

  try {
    const primary = await fetchHomepageSlides(apiBaseUrl, locale);
    if (primary.length > 0) return primary;

    const publicBase = process.env.NEXT_PUBLIC_BASE_URL || "";
    if (publicBase.includes("avidorganics.net")) {
      const fallback = await fetchHomepageSlides("https://api.avidorganics.net", locale);
      if (fallback.length > 0) return fallback;
    }

    return [];
  } catch (error) {
    console.error("Failed to preload homepage slides:", error);
    try {
      const publicBase = process.env.NEXT_PUBLIC_BASE_URL || "";
      if (publicBase.includes("avidorganics.net")) {
        return await fetchHomepageSlides("https://api.avidorganics.net", locale);
      }
      return [];
    } catch {
      return [];
    }
  }
}
