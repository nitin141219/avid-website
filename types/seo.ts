// Types for SEO metadata
export interface AdminSeoInput {
  title?: string;
  description?: string;
  keywords?: string;
  author?: string;
  canonical?: string;
  og_title?: string;
  og_description?: string;
  og_image?: string;
  twitter_title?: string;
  twitter_description?: string;
  twitter_image?: string;
  faqs?: string; // JSON stringified FaqItem[]
}

export const DEFAULT_SEO_VALUES: AdminSeoInput = {
  title: "",
  description: "",
  keywords: "",
  author: "Avid Organics Pvt. Ltd.",
  canonical: "",
  og_title: "",
  og_description: "",
  og_image: "",
  twitter_title: "",
  twitter_description: "",
  twitter_image: "",
  faqs: JSON.stringify([]),
};
