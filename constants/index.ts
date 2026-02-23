import { Bell, Files, Mail, Newspaper, SquareChartGantt, Users } from "lucide-react";

export const PAGINATION_DATA = { limit: 10, page: 1 };

export const DOCUMENT_CATEGORY = {
  PRODUCT: "PRODUCT",
  CERTIFICATE: "CERTIFICATE",
};

// 1472 X 608
export const IMAGE_DIMENSION = {
  BLOG: {
    width: 1120,
    height: 465,
    screenWidth: 1120,
  },
  EVENT: {
    width: 1120,
    height: 465,
    screenWidth: 1120,
  },
  NEWS: {
    width: 1120,
    height: 465,
    screenWidth: 1120,
  },
};

export const SIDEBAR_ITEMS = [
  {
    title: "Users",
    url: "/admin/users",
    icon: Users,
    activeUrls: ["/admin/users"],
  },
  {
    title: "Documents",
    url: "/admin/documents",
    icon: Files,
    activeUrls: ["/admin/documents"],
  },
  {
    title: "Blogs",
    url: "/admin/blogs",
    icon: SquareChartGantt,
    activeUrls: ["/admin/blogs", "/admin/blogs/add", "/admin/blogs/edit"],
  },
  {
    title: "News",
    url: "/admin/news",
    icon: Newspaper,
    activeUrls: ["/admin/news", "/admin/news/add", "/admin/news/edit"],
  },
  {
    title: "Events",
    url: "/admin/events",
    icon: Bell,
    activeUrls: ["/admin/events", "/admin/events/add", "/admin/events/edit"],
  },
  {
    title: "Contact Us",
    url: "/admin/contact-us",
    icon: Mail,
    activeUrls: ["/admin/contact-us", "/admin/contact-us/view"],
  },
];

export const LOCALIZATION_LANGUAGE = [
  {
    label: "English",
    value: "en",
  },
  {
    label: "German",
    value: "de",
  },
  {
    label: "French",
    value: "fr",
  },
  {
    label: "Spanish",
    value: "es",
  },
];
