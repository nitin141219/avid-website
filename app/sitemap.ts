import { MetadataRoute } from "next";
import { getCustomerBlogs } from "../components/blog/BlogList";
import { getCustomerEvents } from "../components/event/EventList";
import { getCustomerNews } from "../components/news/NewsList";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://www.avidorganics.net";
  const locales = ["en", "de", "fr", "es"];

  // Helper function to generate entries for all languages
  const generateLocaleEntries = (
    path: string,
    priority: number = 0.7,
    changeFreq: "monthly" | "weekly" | "daily" = "weekly"
  ) => {
    const languages: Record<string, string> = {};
    locales.forEach((lang) => {
      languages[lang] = `${baseUrl}/${lang}${path}`;
    });
    // Use x-default instead of regional variants to consolidate duplicates (en-in, en-us, en-gb all point to /en)
    languages["x-default"] = `${baseUrl}/en${path}`;

    return locales.map((lang) => ({
      url: `${baseUrl}/${lang}${path}`,
      lastModified: new Date(),
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
    generateLocaleEntries(`/media/blog/${blog.slug}`, 0.6, "weekly")
  );

  // 5. Events Pages (Dynamic)
  const eventData = await getCustomerEvents({ limit: "1000", page: "1" });
  const eventRoutes = (eventData?.events || []).flatMap((event: any) =>
    generateLocaleEntries(`/media/events/${event.slug}`, 0.6, "weekly")
  );

  // 6. News Pages (Dynamic)
  const newsData = await getCustomerNews({ limit: "1000", page: "1" });
  const newsRoutes = (newsData?.news || []).flatMap((news: any) =>
    generateLocaleEntries(`/media/news/${news.slug}`, 0.6, "weekly")
  );

  // 7. Paginated Blog Pages
  const blogPages = blogData?.pagination?.total_page || 1;
  const paginatedBlogRoutes = Array.from({ length: Math.max(1, blogPages - 1) }, (_, i) => {
    const page = i + 2; // Start from page 2
    return generateLocaleEntries(`/media/blog?page=${page}`, 0.5, "weekly");
  }).flat();

  // 8. Paginated News Pages
  const newsPages = newsData?.pagination?.total_page || 1;
  const paginatedNewsRoutes = Array.from({ length: Math.max(1, newsPages - 1) }, (_, i) => {
    const page = i + 2; // Start from page 2
    return generateLocaleEntries(`/media/news?page=${page}`, 0.5, "weekly");
  }).flat();

  // 9. Paginated Event Pages
  const eventPages = eventData?.pagination?.total_page || 1;
  const paginatedEventRoutes = Array.from({ length: Math.max(1, eventPages - 1) }, (_, i) => {
    const page = i + 2; // Start from page 2
    return generateLocaleEntries(`/media/events?page=${page}`, 0.5, "weekly");
  }).flat();

  return [
    ...staticRoutes,
    ...marketRoutes,
    ...productRoutes,
    ...blogRoutes,
    ...paginatedBlogRoutes,
    ...eventRoutes,
    ...paginatedEventRoutes,
    ...newsRoutes,
    ...paginatedNewsRoutes,
  ];
}
