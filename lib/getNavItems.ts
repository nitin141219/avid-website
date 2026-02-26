import { getTranslations } from "next-intl/server";
export interface NavItemType {
  name: string;
  href: string;
  description?: string;
  isMenuClickable?: boolean;
  submenu?: {
    name: string;
    href: string;
    children?: {
      name: string;
      href: string;
    }[];
  }[];
}

export async function getNavItems(locale: string): Promise<NavItemType[]> {
  const t = await getTranslations({ locale, namespace: "menu" });

  return [
    {
      name: t("about"),
      description: t("about_description"),
      href: "/about-us",
      isMenuClickable: true,
      submenu: [
        { name: t("submenu.our_company"), href: "/about-us" },
        { name: t("submenu.history"), href: "/about-us#history" },
        { name: t("submenu.manufacturing"), href: "/about-us/manufacturing-excellence" },
        { name: t("submenu.leadership"), href: "/about-us/executive-leadership" },
      ],
    },
    {
      name: t("markets"),
      description: t("markets_description"),
      href: "#",
      submenu: [
        { name: t("submenu.animal_nutrition"), href: "/market/animal-nutrition" },
        { name: t("submenu.food_beverage"), href: "/market/food-and-beverages" },
        { name: t("submenu.industrial"), href: "/market/industrial-and-specialty-applications" },
        { name: t("submenu.personal_care"), href: "/market/personal-care-and-cosmetics" },
        { name: t("submenu.pharma"), href: "/market/pharmaceuticals" },
      ],
    },
    {
      name: t("products"),
      description: t("products_description"),
      href: "#",
      submenu: [
        {
          name: t("products_alpha"),
          href: "alpha-hydroxy-acids",
          children: [
            { name: t("aviga_bio_hp"), href: "/product/alpha-hydroxy-acids/aviga-bio-hp-70" },
            { name: t("aviga_bio_t"), href: "/product/alpha-hydroxy-acids/aviga-bio-t" },
            { name: t("aviga_hp"), href: "/product/alpha-hydroxy-acids/aviga-hp-70" },
            { name: t("aviga_t"), href: "/product/alpha-hydroxy-acids/aviga-t" },
          ],
        },
        {
          name: t("products_amino"),
          href: "amino-acids",
          children: [
            { name: t("avigly_hp"), href: "/product/amino-acids/avigly-hp" },
            { name: t("avigly_t"), href: "/product/amino-acids/avigly-t" },
            { name: t("avitau"), href: "/product/amino-acids/avitau" },
          ],
        },
        {
          name: t("products_aromatic"),
          href: "aromatic-and-fine-chemicals",
          children: [
            { name: t("guaiacol"), href: "/product/aromatic-and-fine-chemicals/guaiacol" },
          ],
        },
        {
          name: t("products_specialty"),
          href: "specialty-chemicals-and-intermediates",
          children: [
            {
              name: t("chlorhexidine"),
              href: "/product/specialty-chemicals-and-intermediates/chlorhexidine-base",
            },
            { name: t("mehq"), href: "/product/specialty-chemicals-and-intermediates/mehq" },
          ],
        },
      ],
    },
    {
      name: t("sustainability"),
      description: t("sustainability_description"),
      isMenuClickable: true,
      href: "/sustainability",
      submenu: [
        { name: t("submenu.environmental"), href: "/sustainability#environmental-stewardship" },
        { name: t("submenu.social"), href: "/sustainability#social-responsibility" },
        {
          name: t("submenu.governance"),
          href: "/sustainability#governance-product-stewardship",
        },
      ],
    },
    {
      name: t("media"),
      description: t("media_description"),
      href: "#",
      submenu: [
        { name: t("submenu.news"), href: "/media/news" },
        { name: t("submenu.events"), href: "/media/events" },
        { name: t("submenu.blogs"), href: "/media/blog" },
        { name: t("submenu.downloads"), href: "/media/downloads" },
      ],
    },
    {
      name: t("careers"),
      description: t("careers_description"),
      href: "#",
      submenu: [
        { name: t("submenu.life"), href: "/careers/life" },
        { name: t("submenu.jobs"), href: "/careers/jobs" },
      ],
    },
  ];
}
