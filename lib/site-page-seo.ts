import { buildSeoMetadata, getSiteUrl, type SeoOverride } from "@/lib/seo";

type StaticSeoPath =
  | ""
  | "/about-us"
  | "/about-us/manufacturing-excellence"
  | "/about-us/executive-leadership"
  | "/market/pharmaceuticals"
  | "/market/personal-care-and-cosmetics"
  | "/market/food-and-beverages"
  | "/market/animal-nutrition"
  | "/market/industrial-and-specialty-applications"
  | "/sustainability"
  | "/contact-us"
  | "/careers/life"
  | "/careers/jobs"
  | "/media/news"
  | "/media/events"
  | "/media/blog"
  | "/media/downloads"
  | "/privacy-policy"
  | "/terms-and-conditions";

type StaticSeoConfig = {
  title: string;
  description: string;
  keywords: string[];
};

const STATIC_PAGE_SEO: Record<StaticSeoPath, StaticSeoConfig> = {
  "": {
    title: "Glycine & Glycolic Acid Manufacturer | Avid Organics",
    description:
      "Manufacturer of glycine and glycolic acid with export supply, batch documentation, and technical support for pharma, personal care, food, and industry.",
    keywords: [
      "Avid Organics",
      "glycine manufacturer",
      "glycolic acid manufacturer",
      "pharmaceutical grade glycine",
      "cosmetic grade glycolic acid",
      "food grade glycine",
      "amino acid manufacturer",
      "specialty chemical manufacturer",
      "batch documentation",
      "technical support",
      "export chemical supplier",
    ],
  },
  "/about-us": {
    title: "About Avid Organics | Glycine & Glycolic Acid Manufacturer",
    description:
      "Learn about Avid Organics, a specialty chemical manufacturer from India supplying glycine, glycolic acid, and export-ready materials for regulated markets worldwide.",
    keywords: [
      "Avid Organics",
      "about Avid Organics",
      "specialty chemical company India",
      "glycine manufacturer India",
      "glycolic acid manufacturer India",
      "chemical manufacturer Vadodara",
      "specialty chemical manufacturer",
      "global chemical supplier",
    ],
  },
  "/about-us/manufacturing-excellence": {
    title: "Manufacturing Excellence | High-Purity Chemicals | Avid Organics",
    description:
      "Explore Avid Organics manufacturing excellence in process control, quality systems, batch traceability, and high-purity chemical production for global customers.",
    keywords: [
      "Avid Organics manufacturing",
      "manufacturing excellence",
      "high-purity chemical manufacturing",
      "batch traceability",
      "quality assurance chemicals",
      "process control manufacturing",
      "specialty chemical production",
    ],
  },
  "/about-us/executive-leadership": {
    title: "Executive Leadership | Avid Organics",
    description:
      "Meet the executive leadership team guiding Avid Organics across specialty chemical manufacturing, global market development, quality, and sustainable growth.",
    keywords: [
      "Avid Organics leadership",
      "executive leadership",
      "chemical industry leadership",
      "specialty chemicals management",
      "manufacturing leadership team",
      "company leadership",
    ],
  },
  "/market/pharmaceuticals": {
    title: "Pharmaceutical Chemicals Manufacturer | Avid Organics",
    description:
      "Glycine, glycolic acid, and specialty chemicals for pharmaceutical formulations, synthesis, and regulated supply with documentation, quality assurance, and export support.",
    keywords: [
      "Avid Organics pharmaceuticals",
      "pharmaceutical chemicals manufacturer",
      "glycine for pharmaceutical formulations",
      "pharmaceutical synthesis",
      "USP grade glycine",
      "glycolic acid pharmaceutical applications",
      "regulated pharmaceutical supply",
      "pharmaceutical ingredients manufacturer",
    ],
  },
  "/market/personal-care-and-cosmetics": {
    title: "Personal Care & Cosmetic Ingredients | Avid Organics",
    description:
      "Source glycolic acid and specialty ingredients for skin care, cosmetics, and personal care formulations with quality documentation and dependable global supply.",
    keywords: [
      "Avid Organics personal care",
      "personal care ingredients manufacturer",
      "cosmetic grade glycolic acid",
      "glycolic acid for cosmetics",
      "skin care ingredients manufacturer",
      "cosmetic formulation ingredients",
      "personal care ingredients supplier",
    ],
  },
  "/market/food-and-beverages": {
    title: "Food & Beverage Ingredients Manufacturer | Avid Organics",
    description:
      "Food-grade glycine and specialty ingredients for flavor, nutrition, and formulation performance backed by batch documentation and export-ready supply.",
    keywords: [
      "Avid Organics food ingredients",
      "food grade glycine",
      "food ingredient manufacturer",
      "beverage ingredient supplier",
      "specialty food ingredients",
      "amino acid for food applications",
      "nutrition ingredients supplier",
    ],
  },
  "/market/animal-nutrition": {
    title: "Animal Nutrition Ingredients | Avid Organics",
    description:
      "Amino acids and specialty ingredients for animal nutrition applications with consistent quality, technical support, and reliable international supply.",
    keywords: [
      "Avid Organics animal nutrition",
      "animal nutrition ingredients",
      "amino acid manufacturer",
      "feed additive supplier",
      "glycine for animal nutrition",
      "specialty feed ingredients",
      "livestock nutrition ingredients",
    ],
  },
  "/market/industrial-and-specialty-applications": {
    title: "Industrial & Specialty Chemicals Manufacturer | Avid Organics",
    description:
      "Industrial and specialty chemicals from Avid Organics for process performance, custom applications, and reliable export supply with technical support.",
    keywords: [
      "Avid Organics industrial chemicals",
      "industrial specialty chemicals",
      "technical grade chemicals",
      "specialty applications manufacturer",
      "industrial chemical supplier",
      "custom application chemicals",
      "process chemical manufacturer",
    ],
  },
  "/sustainability": {
    title: "Sustainability | Responsible Chemical Manufacturing | Avid Organics",
    description:
      "See how Avid Organics advances responsible chemical manufacturing through renewable energy, safety systems, resource efficiency, and long-term sustainability goals.",
    keywords: [
      "Avid Organics sustainability",
      "sustainability chemicals",
      "responsible chemical manufacturing",
      "renewable energy manufacturing",
      "environmental responsibility",
      "safe manufacturing systems",
      "sustainable specialty chemicals",
    ],
  },
  "/contact-us": {
    title: "Contact Avid Organics | Global Chemical Supply Support",
    description:
      "Contact Avid Organics for product enquiries, technical documents, pricing, samples, and export support for glycine, glycolic acid, and specialty chemicals.",
    keywords: [
      "contact Avid Organics",
      "Avid Organics contact",
      "request glycine quote",
      "glycolic acid enquiry",
      "technical documents request",
      "chemical samples request",
      "chemical supplier contact",
    ],
  },
  "/careers/life": {
    title: "Life at Avid Organics | Culture, Safety & Growth",
    description:
      "Discover life at Avid Organics through our culture of safety, learning, collaboration, and career growth in specialty chemical manufacturing.",
    keywords: [
      "Avid Organics careers culture",
      "life at Avid Organics",
      "chemical company culture",
      "safety and growth culture",
      "manufacturing workplace culture",
      "career development",
    ],
  },
  "/careers/jobs": {
    title: "Careers at Avid Organics | Chemical Industry Jobs",
    description:
      "Explore current job openings at Avid Organics across manufacturing, quality, R&D, operations, and commercial roles in specialty chemicals.",
    keywords: [
      "Avid Organics jobs",
      "Avid Organics careers",
      "chemical industry jobs",
      "manufacturing jobs India",
      "quality control jobs",
      "R&D jobs chemicals",
      "specialty chemicals careers",
    ],
  },
  "/media/news": {
    title: "News & Press Releases | Avid Organics",
    description:
      "Read the latest Avid Organics news, announcements, certifications, product updates, market expansion, and manufacturing milestones.",
    keywords: [
      "Avid Organics press releases",
      "Avid Organics news",
      "press releases",
      "manufacturing updates",
      "certification announcements",
      "chemical company news",
      "industry updates",
    ],
  },
  "/media/events": {
    title: "Events & Exhibitions | Avid Organics",
    description:
      "Track Avid Organics events, exhibitions, trade shows, and industry meetings across pharmaceutical and specialty chemical markets.",
    keywords: [
      "Avid Organics exhibitions",
      "Avid Organics events",
      "chemical exhibitions",
      "pharmaceutical trade shows",
      "industry meetings",
      "specialty chemicals events",
      "industry events",
    ],
  },
  "/media/blog": {
    title: "Industry Insights & Blog | Avid Organics",
    description:
      "Explore Avid Organics articles on specialty chemicals, procurement, manufacturing quality, compliance, and regulated-market supply insights.",
    keywords: [
      "Avid Organics blog",
      "chemical industry blog",
      "specialty chemicals insights",
      "regulated supply insights",
      "manufacturing quality articles",
      "chemical procurement insights",
      "industrial chemistry insights",
    ],
  },
  "/media/downloads": {
    title: "Technical Documents & Certificates | Avid Organics",
    description:
      "Download product documents, technical data, safety sheets, certificates, and qualification files for Avid Organics materials and supply programs.",
    keywords: [
      "Avid Organics downloads",
      "technical documents download",
      "safety data sheets",
      "certificate download",
      "product specifications",
      "supplier qualification documents",
      "chemical documentation",
    ],
  },
  "/privacy-policy": {
    title: "Privacy Policy | Avid Organics",
    description:
      "Review the Avid Organics privacy policy covering data collection, communication, storage, and your rights when using our website.",
    keywords: [
      "Avid Organics privacy policy",
      "privacy policy",
      "data protection",
      "website privacy notice",
      "personal data rights",
      "data handling policy",
    ],
  },
  "/terms-and-conditions": {
    title: "Terms & Conditions | Avid Organics",
    description:
      "Read the terms and conditions for using the Avid Organics website, services, downloadable materials, and communications.",
    keywords: [
      "Avid Organics terms and conditions",
      "terms and conditions",
      "website terms",
      "service terms",
      "download terms",
      "legal terms Avid Organics",
    ],
  },
};

export function buildStaticPageMetadata({
  locale,
  path,
  override,
}: {
  locale: string;
  path: StaticSeoPath;
  override?: SeoOverride | null;
}) {
  const config = STATIC_PAGE_SEO[path];

  return buildSeoMetadata(
    {
      title: config.title,
      description: config.description,
      path,
      locale,
      type: "website",
      image: `${getSiteUrl()}/logo-tagline.png`,
      keywords: config.keywords,
    },
    override || undefined
  );
}
