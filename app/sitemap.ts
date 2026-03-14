import { MetadataRoute } from "next";
import { getCustomerBlogs } from "../components/blog/BlogList";
import { getCustomerEvents } from "../components/event/EventList";
import { getCustomerNews } from "../components/news/NewsList";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://www.avidorganics.net";
  const locales = ["en", "de", "fr", "es"];

  const normalizeLastModified = (value?: string | Date | null) => {
    if (!value) return undefined;

    const parsed = value instanceof Date ? value : new Date(value);
    return Number.isNaN(parsed.getTime()) ? undefined : parsed;
  };

  // Helper function to generate entries for all languages
  const generateLocaleEntries = (
    path: string,
    priority: number = 0.7,
    changeFreq: "monthly" | "weekly" | "daily" = "weekly",
    lastModified?: string | Date | null
  ) => {
    const languages: Record<string, string> = {};
    locales.forEach((lang) => {
      languages[lang] = `${baseUrl}/${lang}${path}`;
    });
    languages["en-us"] = `${baseUrl}/en${path}`;
    languages["en-gb"] = `${baseUrl}/en${path}`;
    languages["en-nl"] = `${baseUrl}/en${path}`;
    languages["de-de"] = `${baseUrl}/de${path}`;
    languages["fr-fr"] = `${baseUrl}/fr${path}`;
    languages["x-default"] = `${baseUrl}/en${path}`;
    const normalizedLastModified = normalizeLastModified(lastModified);

    return locales.map((lang) => ({
      url: `${baseUrl}/${lang}${path}`,
      ...(normalizedLastModified ? { lastModified: normalizedLastModified } : {}),
      changeFrequency: changeFreq as any,
      priority: priority,
      alternates: {
        languages,
      },
    }));
  };

  // 1. Static Routes
  const staticPaths = [
    "",
    "/contact-us",
    "/about-us",
    "/about-us/manufacturing-excellence",
    "/about-us/executive-leadership",
    "/sustainability",
    "/media/news",
    "/media/events",
    "/media/blog",
    "/media/downloads",
    "/careers/life",
    "/careers/jobs",
    "/privacy-policy",
    "/terms-and-conditions",
  ];
  const staticRoutes = staticPaths.flatMap((path) =>
    generateLocaleEntries(path, path === "" ? 1.0 : 0.8, "monthly")
  );

  // 2. Market Pages
  const marketPaths = [
    "/market/animal-nutrition",
    "/market/food-and-beverages",
    "/market/industrial-and-specialty-applications",
    "/market/personal-care-and-cosmetics",
    "/market/pharmaceuticals",
  ];
  const marketRoutes = marketPaths.flatMap((path) => generateLocaleEntries(path, 0.7, "monthly"));

  // 3. Product Pages
  const productPaths = [
    "/product/alpha-hydroxy-acids/aviga-bio-hp-70",
    "/product/alpha-hydroxy-acids/aviga-bio-t",
    "/product/alpha-hydroxy-acids/aviga-hp-70",
    "/product/alpha-hydroxy-acids/aviga-t",
    "/product/amino-acids/avigly-hp",
    "/product/amino-acids/avigly-t",
    "/product/amino-acids/avitau",
    "/product/aromatic-and-fine-chemicals/guaiacol",
    "/product/specialty-chemicals-and-intermediates/chlorhexidine-base",
    "/product/specialty-chemicals-and-intermediates/mehq",
  ];
  const productRoutes = productPaths.flatMap((path) => generateLocaleEntries(path, 0.8, "monthly"));

  // 4. Blogs Pages (Dynamic)
  const blogData = await getCustomerBlogs({ limit: "1000", page: "1" });
  const blogRoutes = (blogData?.blogs || []).flatMap((blog: any) =>
    generateLocaleEntries(`/media/blog/${blog.slug}`, 0.6, "weekly", blog.updated_at || blog.published_at)
  );

  // 5. Events Pages (Dynamic)
  const eventData = await getCustomerEvents({ limit: "1000", page: "1" });
  const eventRoutes = (eventData?.events || []).flatMap((event: any) =>
    generateLocaleEntries(`/media/events/${event.slug}`, 0.6, "weekly", event.updated_at || event.published_at)
  );

  // 6. News Pages (Dynamic)
  const newsData = await getCustomerNews({ limit: "1000", page: "1" });
  const newsRoutes = (newsData?.news || []).flatMap((news: any) =>
    generateLocaleEntries(`/media/news/${news.slug}`, 0.6, "weekly", news.updated_at || news.published_at)
  );

  return [
    ...staticRoutes,
    ...marketRoutes,
    ...productRoutes,
    ...blogRoutes,
    ...eventRoutes,
    ...newsRoutes,
  ];
}
