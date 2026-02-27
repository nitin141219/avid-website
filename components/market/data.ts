export interface MarketPageData {
  hero: {
    title: string;
    subtitle: string;
    image: string;
    imageMobile: string;
    className?: string;
  };
  description: string;
  solutions: {
    title: string;
    text: string;
  }[];
  productsTitle: string;
  products: {
    title: {
      type: "icon" | "text";
      src: string;
      className?: string;
    };
    subtitle?: string;
    subtitleClassName?: string;
    desc: string;
    image: string;
    link: string;
  }[];
  productButton: {
    link: string;
    text: string;
  };
}

export const marketPages: Record<string, MarketPageData> = {
  "animal-nutrition": {
    hero: {
      title: "hero.title",
      subtitle: "hero.subtitle",
      image: "/images/market/animal.jpg",
      imageMobile: "/mobile/markets/animal.jpg",
      className: "mt-auto",
    },
    description: "description",
    solutions: [
      {
        title: "solutions.enhanced_bioavailability.title",
        text: "solutions.enhanced_bioavailability.text",
      },
      {
        title: "solutions.guaranteed_stability.title",
        text: "solutions.guaranteed_stability.text",
      },
      {
        title: "solutions.efficient_production.title",
        text: "solutions.efficient_production.text",
      },
    ],
    productsTitle: "productsTitle",
    products: [
      {
        title: { type: "icon", src: "/images/product/aviglyHP.png", className: "w-34" },
        subtitle: "products.avigly_hp.subtitle",
        desc: "products.avigly_hp.desc",
        image: "/images/market/image.jpg",
        link: "/product/amino-acids/avigly-hp",
      },
      {
        title: { type: "icon", src: "/images/product/avitau.png", className: "mb-2" },
        subtitle: "products.avitau.subtitle",
        desc: "products.avitau.desc",
        image: "/images/market/image15.jpg",
        link: "/product/amino-acids/avitau",
      },
    ],
    productButton: {
      link: "/",
      text: "View Our Animal Nutrition Portfolio",
    },
  },
  "food-and-beverages": {
    hero: {
      title: "hero.title",
      subtitle: "hero.subtitle",
      image: "/images/market/food-beverages.jpg",
      imageMobile: "/mobile/markets/food-beverages.jpg",
      className: "mt-auto",
    },
    description: "description",
    solutions: [
      {
        title: "solutions.consistent_performance.title",
        text: "solutions.consistent_performance.text",
      },
      {
        title: "solutions.assured_food_safety.title",
        text: "solutions.assured_food_safety.text",
      },
      {
        title: "solutions.sustainable_sourcing.title",
        text: "solutions.sustainable_sourcing.text",
      },
    ],
    productsTitle: "Featured Products",
    products: [
      {
        title: { type: "icon", src: "/images/product/aviglyHP.png", className: "w-34" },
        subtitle: "products.avigly_hp.subtitle",
        desc: "products.avigly_hp.desc",
        image: "/images/market/image18.png",
        link: "/product/amino-acids/avigly-hp",
      },
      {
        title: { type: "icon", src: "/images/product/avitau.png", className: "mb-2" },
        subtitle: "products.avitau.subtitle",
        desc: "products.avitau.desc",
        image: "/images/product/avitau-img.png",
        link: "/product/amino-acids/avitau",
      },
    ],
    productButton: {
      link: "/",
      text: "Partner with Our Food & Beverage Team",
    },
  },
  "industrial-and-specialty-applications": {
    hero: {
      title: "hero.title",
      subtitle: "hero.subtitle",
      image: "/images/market/industry.jpg",
      imageMobile: "/mobile/markets/industry.jpg",
      className: "my-auto",
    },
    description: "description",
    solutions: [
      {
        title: "solutions.predictable_reactivity.title",
        text: "solutions.predictable_reactivity.text",
      },
      {
        title: "solutions.process_compatibility.title",
        text: "solutions.process_compatibility.text",
      },
      {
        title: "solutions.sustainable_manufacturing.title",
        text: "solutions.sustainable_manufacturing.text",
      },
    ],
    productsTitle: "Featured Products",
    products: [
      {
        title: { type: "icon", src: "/images/product/avigabioT.png", className: "mb-2" },
        subtitle: "products.aviga_bio_t.subtitle",
        subtitleClassName: "whitespace-pre-line text-sm sm:text-base",
        desc: "products.aviga_bio_t.desc",
        image: "/images/product/Product Slide Show/aviga-bio-t/Aviga Bio T-personal.png",
        link: "/product/alpha-hydroxy-acids/aviga-bio-t",
      },
      {
        title: { type: "icon", src: "/images/product/avigaT.png", className: "mb-2" },
        subtitle: "products.aviga_t.subtitle",
        subtitleClassName: "whitespace-pre-line text-sm sm:text-base",
        desc: "products.aviga_t.desc",
        image: "/images/market/image14.jpg",
        link: "/product/alpha-hydroxy-acids/aviga-t",
      },
      {
        title: { type: "text", src: "MEHQ" },
        desc: "products.mehq.desc",
        image: "/images/market/image16.jpg",
        link: "/product/specialty-chemicals-and-intermediates/mehq",
      },
      {
        title: { type: "text", src: "Chlorhexidine" },
        subtitle: "products.chlorhexidine.subtitle",
        desc: "products.chlorhexidine.desc",
        image: "/images/market/image10.jpg",
        link: "/product/specialty-chemicals-and-intermediates/chlorhexidine-base",
      },
    ],
    productButton: {
      link: "/",
      text: "View Our Animal Nutrition Portfolio",
    },
  },
  "personal-care-and-cosmetics": {
    hero: {
      title: "hero.title",
      subtitle: "hero.subtitle",
      image: "/images/market/personal-care.jpg",
      imageMobile: "/mobile/markets/personal-care.jpg",
      className: "ml-auto mt-auto",
    },
    description: "description",
    solutions: [
      {
        title: "solutions.controlled_activity.title",
        text: "solutions.controlled_activity.text",
      },
      {
        title: "solutions.formulation_stability.title",
        text: "solutions.formulation_stability.text",
      },
      {
        title: "solutions.uncompromising_purity.title",
        text: "solutions.uncompromising_purity.text",
      },
    ],
    productsTitle: "Featured Products",
    products: [
      {
        title: { type: "icon", src: "/images/product/avigabioHP70.png", className: "w-40 mb-2" },
        subtitle: "products.aviga_bio_hp.subtitle",
        subtitleClassName: "whitespace-nowrap text-sm sm:text-base",
        desc: "products.aviga_bio_hp.desc",
        image: "/images/market/image19.jpg",
        link: "/product/alpha-hydroxy-acids/aviga-bio-hp-70",
      },
      {
        title: { type: "icon", src: "/images/product/avigaHP70.png", className: "w-30 mb-2" },
        subtitle: "products.aviga_hp.subtitle",
        desc: "products.aviga_hp.desc",
        image: "/images/market/image17.jpg",
        link: "/product/alpha-hydroxy-acids/aviga-hp-70",
      },
      {
        title: { type: "icon", src: "/images/product/aviglyHP.png", className: "w-34" },
        subtitle: "products.avigly_hp.subtitle",
        desc: "products.avigly_hp.desc",
        image: "/images/market/image8.jpg",
        link: "/product/amino-acids/avigly-hp",
      },
      {
        title: { type: "icon", src: "/images/product/avitau.png", className: "object-contain mb-1" },
        subtitle: "products.avitau.subtitle",
        desc: "products.avitau.desc",
        image: "/images/market/image9.jpg",
        link: "/product/amino-acids/avitau",
      },
      {
        title: { type: "text", src: "Chlorhexidine" },
        subtitle: "products.chlorhexidine_base.subtitle",
        desc: "products.chlorhexidine_base.desc",
        image: "/images/market/image7.jpg",
        link: "/product/specialty-chemicals-and-intermediates/chlorhexidine-base",
      },
    ],
    productButton: {
      link: "/",
      text: "Discuss Your Formulation Challenge",
    },
  },
  pharmaceuticals: {
    hero: {
      title: "hero.title",
      subtitle: "hero.subtitle",
      image: "/images/market/pharma.jpg",
      imageMobile: "/mobile/markets/pharma.jpg",
      className: "ml-auto mt-auto",
    },
    description: "description",
    solutions: [
      {
        title: "solutions.stringent_quality_standards.title",
        text: "solutions.stringent_quality_standards.text",
      },
      {
        title: "solutions.formulation_stability.title",
        text: "solutions.formulation_stability.text",
      },
      {
        title: "solutions.uncompromising_purity.title",
        text: "solutions.uncompromising_purity.text",
      },
    ],
    productsTitle: "Featured Products",
    products: [
      {
        title: { type: "icon", src: "/images/product/aviglyHP.png", className: "w-34" },
        subtitle: "products.avigly_hp.subtitle",
        desc: "products.avigly_hp.desc",
        image: "/images/product/avigly-hp-img.png",
        link: "/product/amino-acids/avigly-hp",
      },
      {
        title: { type: "icon", src: "/images/product/avitau.png", className: "mb-2" },
        subtitle: "products.avitau.subtitle",
        desc: "products.avitau.desc",
        image: "/images/market/image13.jpg",
        link: "/product/amino-acids/avitau",
      },
      {
        title: { type: "text", src: "Chlorhexidine" },
        subtitle: "products.chlorhexidine_base.subtitle",
        desc: "products.chlorhexidine_base.desc",
        image: "/images/market/image5.jpg",
        link: "/product/specialty-chemicals-and-intermediates/chlorhexidine-base",
      },
      {
        title: { type: "text", src: "Guaiacol" },
        desc: "products.guaiacol.desc",
        image: "/images/market/image6.jpg",
        link: "/product/aromatic-and-fine-chemicals/guaiacol",
      },
      {
        title: { type: "text", src: "MEHQ" },
        desc: "products.mehq.desc",
        image: "/images/market/image1.jpg",
        link: "/product/specialty-chemicals-and-intermediates/mehq",
      },
    ],
    productButton: {
      link: "/",
      text: "Request Regulatory Information",
    },
  },
};
