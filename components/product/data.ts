export interface ProductPageData {
  hero: {
    title: string;
    subtitle: string;
  };

  information: {
    title: { type: "icon" | "text"; src: string; className?: string };
    image?: string;
    images?: string[];
    tag?: string;
    subText?: string;
    description: string;
  };

  applications: {
    title: string;
    items: {
      id: number;
      title: string[] | string;
      icon: string;
      description: string;
    }[];
  };

  qualityInfo: {
    title: string;
    subtitle: string;
    manufacturingStandards: {
      id: number;
      src: string;
      size: string;
    }[];
    otherStandards: {
      id: number;
      title: string;
      description: string;
    }[];
  };

  supplyChain: {
    title: string;
    subtitle: string;
    packagingOptions: {
      id: number;
      value: string;
      unit: string;
      texts: string | string[];
    }[];
    otherOptions?: {
      id: number;
      title: string;
      description: string;
    }[];
    packagingText?: string;
    technicalSupport?: string;
    buttons?: { label: string; slug: string }[];
    linkButtons?: { label: string; link: string }[];
  };
}

export const productPages: Record<string, Record<string, ProductPageData>> = {
  "alpha-hydroxy-acids": {
    "aviga-hp": {
      hero: {
        title: "hero.title",
        subtitle: "hero.subtitle",
      },
      information: {
        title: { type: "icon", src: "/images/product/avigaHP70.png" },
        image: "/images/product/alpha.jpg",
        tag: "HP",
        subText: "information.subText",
        description: "information.description",
        casNumber: "79-14-1",
        molecularFormula: "C₂H₄O₃",
        molecularWeight: "76.05 g/mol",
      },
      applications: {
        title: "applications.title",
        items: [
          {
            id: 1,
            title: "applications.items.0.title",
            icon: "/images/product/ad.png",
            description: "applications.items.0.description",
          },
          {
            id: 2,
            title: "applications.items.1.title",
            icon: "/images/product/paf.png",
            description: "applications.items.1.description",
          },
          {
            id: 3,
            title: "applications.items.2.title",
            icon: "/images/product/ps.png",
            description: "applications.items.2.description",
          },
          {
            id: 4,
            title: "applications.items.3.title",
            icon: "/images/product/is.png",
            description: "applications.items.3.description",
          },
        ],
      },
      qualityInfo: {
        title: "qualityInfo.title",
        subtitle: "qualityInfo.subtitle",
        manufacturingStandards: [
          { id: 1, src: "/images/sustainability/sgs14.png", size: "h-22" },
          { id: 2, src: "/images/sustainability/sgs45.png", size: "h-22" },
          { id: 3, src: "/images/sustainability/reach.png", size: "h-22" },
        ],
        otherStandards: [
          {
            id: 1,
            title: "qualityInfo.otherStandards.0.title",
            description: "qualityInfo.otherStandards.0.description",
          },
          {
            id: 2,
            title: "qualityInfo.otherStandards.1.title",
            description: "qualityInfo.otherStandards.1.description",
          },
        ],
      },
      supplyChain: {
        title: "supplyChain.title",
        subtitle: "supplyChain.subtitle",
        packagingOptions: [
          {
            id: 1,
            value: "25",
            unit: "supplyChain.packagingOptions.0.unit",
            texts: "supplyChain.packagingOptions.0.texts",
          },
          {
            id: 2,
            value: "250",
            unit: "supplyChain.packagingOptions.1.unit",
            texts: "supplyChain.packagingOptions.1.texts",
          },
          {
            id: 3,
            value: "1250",
            unit: "supplyChain.packagingOptions.2.unit",
            texts: "supplyChain.packagingOptions.2.texts",
          },
        ],
        packagingText: "supplyChain.packagingText",
        buttons: [
          { label: "supplyChain.buttons.0.label", slug: "aviga-hp-pds" },
          { label: "supplyChain.buttons.1.label", slug: "aviga-hp-sds" },
        ],
        linkButtons: [{ label: "supplyChain.linkButtons.0.label", link: "/contact-us" }],
      },
    },
    "aviga-t": {
      hero: {
        title: "hero.title",
        subtitle: "hero.subtitle",
      },
      information: {
        title: { type: "icon", src: "/images/product/avigaT.png" },
        image: "/images/product/avigaT-product.jpg",
        subText: "information.subText",
        description: "information.description",
        casNumber: "79-14-1",
        molecularFormula: "C₂H₄O₃",
        molecularWeight: "76.05 g/mol",
      },
      applications: {
        title: "applications.title",
        items: [
          {
            id: 1,
            title: "applications.items.0.title",
            icon: "/images/product/cs.png",
            description: "applications.items.0.description",
          },
          {
            id: 2,
            title: "applications.items.1.title",
            icon: "/images/product/idc.png",
            description: "applications.items.1.description",
          },
          {
            id: 3,
            title: "applications.items.2.title",
            icon: "/images/product/of.png",
            description: "applications.items.2.description",
          },
          {
            id: 4,
            title: "applications.items.3.title",
            icon: "/images/product/tp.png",
            description: "applications.items.3.description",
          },
          {
            id: 5,
            title: "applications.items.4.title",
            icon: "/images/product/lm.png",
            description: "applications.items.4.description",
          },
          {
            id: 6,
            title: "applications.items.5.title",
            icon: "/images/product/sac.png",
            description: "applications.items.5.description",
          },
        ],
      },
      qualityInfo: {
        title: "qualityInfo.title",
        subtitle: "qualityInfo.subtitle",
        manufacturingStandards: [
          { id: 1, src: "/images/sustainability/sgs14.png", size: "h-22" },
          { id: 2, src: "/images/sustainability/sgs45.png", size: "h-22" },
          { id: 3, src: "/images/sustainability/reach.png", size: "h-22" },
        ],
        otherStandards: [
          {
            id: 1,
            title: "qualityInfo.otherStandards.0.title",
            description: "qualityInfo.otherStandards.0.description",
          },
          {
            id: 2,
            title: "qualityInfo.otherStandards.1.title",
            description: "qualityInfo.otherStandards.1.description",
          },
        ],
      },
      supplyChain: {
        title: "supplyChain.title",
        subtitle: "supplyChain.subtitle",
        packagingOptions: [
          {
            id: 1,
            value: "25",
            unit: "supplyChain.packagingOptions.0.unit",
            texts: "supplyChain.packagingOptions.0.texts",
          },
          {
            id: 2,
            value: "250",
            unit: "supplyChain.packagingOptions.1.unit",
            texts: "supplyChain.packagingOptions.1.texts",
          },
          {
            id: 3,
            value: "1250",
            unit: "supplyChain.packagingOptions.2.unit",
            texts: "supplyChain.packagingOptions.2.texts",
          },
        ],
        packagingText: "supplyChain.packagingText",
        buttons: [
          { label: "supplyChain.buttons.0.label", slug: "aviga-t-pds" },
          { label: "supplyChain.buttons.1.label", slug: "aviga-t-sds" },
        ],
        linkButtons: [{ label: "supplyChain.linkButtons.0.label", link: "/contact-us" }],
      },
    },
  },
  "amino-acids": {
    "avigly-hp": {
      hero: {
        title: "hero.title",
        subtitle: "hero.subtitle",
      },
      information: {
        title: { type: "icon", src: "/images/product/aviglyHP.png" },
        image: "/images/product/avigly-hp-img.png",
        images: [
          "/images/product/avigly-hp-img.png",
        ],
        subText: "information.subText",
        description: "information.description",
        casNumber: "56-40-6",
        molecularFormula: "C₂H₅NO₂",
        molecularWeight: "75.03 g/mol",
      },
      applications: {
        title: "applications.title",
        items: [
          {
            id: 1,
            title: "applications.items.0.title",
            icon: "/images/product/api.png",
            description: "applications.items.0.description",
          },
          {
            id: 2,
            title: "applications.items.1.title",
            icon: "/images/product/paf.png",
            description: "applications.items.1.description",
          },
          {
            id: 3,
            title: "applications.items.2.title",
            icon: "/images/product/pe.png",
            description: "applications.items.2.description",
          },
          {
            id: 4,
            title: "applications.items.3.title",
            icon: "/images/product/nu.png",
            description: "applications.items.3.description",
          },
          {
            id: 5,
            title: "applications.items.4.title",
            icon: "/images/product/fb.png",
            description: "applications.items.4.description",
          },
          {
            id: 6,
            title: "applications.items.5.title",
            icon: "/images/product/an.png",
            description: "applications.items.5.description",
          },
        ],
      },
      qualityInfo: {
        title: "qualityInfo.title",
        subtitle: "qualityInfo.subtitle",
        manufacturingStandards: [
          { id: 1, src: "/images/footer/logo1.png", size: "h-22" },
          { id: 2, src: "/images/sustainability/sgs14.png", size: "h-22" },
          { id: 3, src: "/images/sustainability/sgs45.png", size: "h-22" },
          { id: 4, src: "/images/footer/logo3.png", size: "h-22" },
          { id: 5, src: "/images/footer/logo6.png", size: "h-22" },
          { id: 6, src: "/images/sustainability/fssai.png", size: "w-22! h-22" },
        ],
        otherStandards: [
          {
            id: 1,
            title: "qualityInfo.otherStandards.0.title",
            description: "qualityInfo.otherStandards.0.description",
          },
          {
            id: 2,
            title: "qualityInfo.otherStandards.1.title",
            description: "qualityInfo.otherStandards.1.description",
          },
        ],
      },
      supplyChain: {
        title: "supplyChain.title",
        subtitle: "supplyChain.subtitle",
        packagingOptions: [
          {
            id: 1,
            value: "25",
            unit: "supplyChain.packagingOptions.0.unit",
            texts: "supplyChain.packagingOptions.0.texts",
          },
          {
            id: 2,
            value: "50",
            unit: "supplyChain.packagingOptions.1.unit",
            texts: "supplyChain.packagingOptions.1.texts",
          },
          {
            id: 3,
            value: "500-1000",
            unit: "supplyChain.packagingOptions.2.unit",
            texts: "supplyChain.packagingOptions.2.texts",
          },
        ],
        buttons: [
          { label: "supplyChain.buttons.0.label", slug: "avigly-hp-pds" },
          { label: "supplyChain.buttons.1.label", slug: "avigly-hp-sds" },
        ],
        linkButtons: [{ label: "supplyChain.linkButtons.0.label", link: "/contact-us" }],
      },
    },
    "avigly-t": {
      hero: {
        title: "hero.title",
        subtitle: "hero.subtitle",
      },
      information: {
        title: { type: "icon", src: "/images/product/aviglyT.png" },
        image: "/images/product/avigly-t-img.png",
        subText: "information.subText",
        description: "information.description",
        casNumber: "56-40-6",
        molecularFormula: "C₂H₅NO₂",
        molecularWeight: "75.03 g/mol",
      },
      applications: {
        title: "applications.title",
        items: [
          {
            id: 1,
            title: "applications.items.0.title",
            icon: "/images/product/ci.png",
            description: "applications.items.0.description",
          },
          {
            id: 2,
            title: "applications.items.1.title",
            icon: "/images/product/ip.png",
            description: "applications.items.1.description",
          },
          {
            id: 3,
            title: "applications.items.2.title",
            icon: "/images/product/ss.png",
            description: "applications.items.2.description",
          },
        ],
      },
      qualityInfo: {
        title: "qualityInfo.title",
        subtitle: "qualityInfo.subtitle",
        manufacturingStandards: [
          { id: 1, src: "/images/sustainability/sgs14.png", size: "h-22" },
          { id: 2, src: "/images/sustainability/sgs45.png", size: "h-22" },
        ],
        otherStandards: [
          {
            id: 1,
            title: "qualityInfo.otherStandards.0.title",
            description: "qualityInfo.otherStandards.0.description",
          },
          {
            id: 2,
            title: "qualityInfo.otherStandards.1.title",
            description: "qualityInfo.otherStandards.1.description",
          },
        ],
      },
      supplyChain: {
        title: "supplyChain.title",
        subtitle: "supplyChain.subtitle",
        packagingOptions: [
          {
            id: 1,
            value: "25",
            unit: "supplyChain.packagingOptions.0.unit",
            texts: "supplyChain.packagingOptions.0.texts",
          },
          {
            id: 2,
            value: "500/1000",
            unit: "supplyChain.packagingOptions.1.unit",
            texts: "supplyChain.packagingOptions.1.texts",
          },
        ],
        packagingText: "supplyChain.packagingText",
        buttons: [
          { label: "supplyChain.buttons.0.label", slug: "avigly-t-pds" },
          { label: "supplyChain.buttons.1.label", slug: "avigly-t-sds" },
        ],
        linkButtons: [{ label: "supplyChain.linkButtons.0.label", link: "/contact-us" }],
      },
    },
    avitau: {
      hero: {
        title: "hero.title",
        subtitle: "hero.subtitle",
      },
      information: {
        title: { type: "icon", src: "/images/product/avitau.png" },
        image: "/images/product/avitau-img.png",
        subText: "information.subText",
        description: "information.description",
        casNumber: "107-35-7",
        molecularFormula: "C₂H₇NO₃S",
        molecularWeight: "125.15 g/mol",
      },
      applications: {
        title: "applications.title",
        items: [
          {
            id: 1,
            title: "applications.items.0.title",
            icon: "/images/product/enrgy.png",
            description: "applications.items.0.description",
          },
          {
            id: 2,
            title: "applications.items.1.title",
            icon: "/images/product/brain.png",
            description: "applications.items.1.description",
          },
          {
            id: 3,
            title: "applications.items.2.title",
            icon: "/images/product/ps.png",
            description: "applications.items.2.description",
          },
          {
            id: 4,
            title: "applications.items.3.title",
            icon: "/images/product/an.png",
            description: "applications.items.3.description",
          },
        ],
      },
      qualityInfo: {
        title: "qualityInfo.title",
        subtitle: "qualityInfo.subtitle",
        manufacturingStandards: [
          { id: 1, src: "/images/footer/logo1.png", size: "h-22" },
          { id: 2, src: "/images/sustainability/sgs14.png", size: "h-22" },
          { id: 3, src: "/images/sustainability/sgs45.png", size: "h-22" },
          { id: 4, src: "/images/footer/logo3.png", size: "h-22" },
          { id: 5, src: "/images/footer/logo6.png", size: "h-22" },
        ],
        otherStandards: [
          {
            id: 1,
            title: "qualityInfo.otherStandards.0.title",
            description: "qualityInfo.otherStandards.0.description",
          },
        ],
      },
      supplyChain: {
        title: "supplyChain.title",
        subtitle: "supplyChain.subtitle",
        packagingOptions: [
          {
            id: 1,
            value: "25",
            unit: "supplyChain.packagingOptions.0.unit",
            texts: "supplyChain.packagingOptions.0.texts",
          },
          {
            id: 2,
            value: "25",
            unit: "supplyChain.packagingOptions.1.unit",
            texts: "supplyChain.packagingOptions.1.texts",
          },
        ],
        packagingText: "supplyChain.packagingText",
        buttons: [
          { label: "supplyChain.buttons.0.label", slug: "avitau-pds" },
          { label: "supplyChain.buttons.1.label", slug: "avitau-sds" },
        ],
        linkButtons: [{ label: "supplyChain.linkButtons.0.label", link: "/contact-us" }],
      },
    },
  },
  "aromatic-and-fine-chemicals": {
    guaiacol: {
      hero: {
        title: "hero.title",
        subtitle: "hero.subtitle",
      },
      information: {
        title: { type: "text", src: "Guaiacol" },
        image: "/images/product/guaiacol.jpg",
        description: "information.description",
        casNumber: "90-05-1",
        molecularFormula: "C₇H₈O₂",
        molecularWeight: "124.14 g/mol",
      },
      applications: {
        title: "applications.title",
        items: [
          {
            id: 1,
            title: "applications.items.0.title",
            icon: "/images/product/ffi.png",
            description: "applications.items.0.description",
          },
          {
            id: 2,
            title: "applications.items.1.title",
            icon: "/images/product/ps.png",
            description: "applications.items.1.description",
          },
          {
            id: 3,
            title: "applications.items.2.title",
            icon: "/images/product/sc.png",
            description: "applications.items.2.description",
          },
          {
            id: 4,
            title: "applications.items.3.title",
            icon: "/images/product/rnd.png",
            description: "applications.items.3.description",
          },
        ],
      },
      qualityInfo: {
        title: "qualityInfo.title",
        subtitle: "qualityInfo.subtitle",
        manufacturingStandards: [
          { id: 1, src: "/images/sustainability/sgs14.png", size: "h-22" },
          { id: 2, src: "/images/sustainability/sgs45.png", size: "h-22" },
        ],
        otherStandards: [
          {
            id: 1,
            title: "qualityInfo.otherStandards.0.title",
            description: "qualityInfo.otherStandards.0.description",
          },
          {
            id: 2,
            title: "qualityInfo.otherStandards.1.title",
            description: "qualityInfo.otherStandards.1.description",
          },
        ],
      },
      supplyChain: {
        title: "supplyChain.title",
        subtitle: "supplyChain.subtitle",
        packagingOptions: [
          {
            id: 1,
            value: "25",
            unit: "supplyChain.packagingOptions.0.unit",
            texts: "supplyChain.packagingOptions.0.texts",
          },
        ],
        packagingText: "supplyChain.packagingText",
        linkButtons: [{ label: "supplyChain.linkButtons.0.label", link: "/contact-us" }],
      },
    },
  },
  "specialty-chemicals-and-intermediates": {
    "chlorhexidine-base": {
      hero: {
        title: "hero.title",
        subtitle: "hero.subtitle",
      },
      information: {
        title: { type: "text", src: "Chlorhexidine Base" },
        image: "/images/product/chlorhexidine-base.jpg",
        description: "information.description",
        casNumber: "55-56-1",
        molecularFormula: "C₂₂H₃₀Cl₂N₁₀",
        molecularWeight: "505.45 g/mol",
      },
      applications: {
        title: "applications.title",
        items: [
          {
            id: 1,
            title: "applications.items.0.title",
            icon: "/images/product/and.png",
            description: "applications.items.0.description",
          },
          {
            id: 2,
            title: "applications.items.1.title",
            icon: "/images/product/ocp.png",
            description: "applications.items.1.description",
          },
          {
            id: 3,
            title: "applications.items.2.title",
            icon: "/images/product/ps.png",
            description: "applications.items.2.description",
          },
          {
            id: 4,
            title: "applications.items.3.title",
            icon: "/images/product/ia.png",
            description: "applications.items.3.description",
          },
        ],
      },
      qualityInfo: {
        title: "qualityInfo.title",
        subtitle: "qualityInfo.subtitle",
        manufacturingStandards: [
          { id: 1, src: "/images/sustainability/sgs14.png", size: "h-22" },
          { id: 2, src: "/images/sustainability/sgs45.png", size: "h-22" },
        ],
        otherStandards: [
          {
            id: 1,
            title: "qualityInfo.otherStandards.0.title",
            description: "qualityInfo.otherStandards.0.description",
          },
          {
            id: 2,
            title: "qualityInfo.otherStandards.1.title",
            description: "qualityInfo.otherStandards.1.description",
          },
        ],
      },
      supplyChain: {
        title: "supplyChain.title",
        subtitle: "supplyChain.subtitle",
        packagingOptions: [
          {
            id: 1,
            value: "25",
            unit: "supplyChain.packagingOptions.0.unit",
            texts: "supplyChain.packagingOptions.0.texts",
          },
        ],
        packagingText: "supplyChain.packagingText",
        buttons: [
          { label: "supplyChain.buttons.0.label", slug: "chlorhexidine-base-pds" },
          { label: "supplyChain.buttons.1.label", slug: "chlorhexidine-base-sds" },
        ],
        linkButtons: [{ label: "supplyChain.linkButtons.0.label", link: "/contact-us" }],
      },
    },
    mehq: {
      hero: {
        title: "hero.title",
        subtitle: "hero.subtitle",
      },
      information: {
        title: { type: "text", src: "MEHQ" },
        subText: "information.subText",
        image: "/images/product/mehq.jpg",
        description: "information.description",
        casNumber: "150-76-5",
        molecularFormula: "C₇H₈O₂",
        molecularWeight: "124.14 g/mol",
      },
      applications: {
        title: "applications.title",
        items: [
          {
            id: 1,
            title: "applications.items.0.title",
            icon: "/images/product/pi.png",
            description: "applications.items.0.description",
          },
          {
            id: 2,
            title: "applications.items.1.title",
            icon: "/images/product/rms.png",
            description: "applications.items.1.description",
          },
          {
            id: 3,
            title: "applications.items.2.title",
            icon: "/images/product/scs.png",
            description: "applications.items.2.description",
          },
          {
            id: 4,
            title: "applications.items.3.title",
            icon: "/images/product/ips.png",
            description: "applications.items.3.description",
          },
        ],
      },
      qualityInfo: {
        title: "qualityInfo.title",
        subtitle: "qualityInfo.subtitle",
        manufacturingStandards: [
          { id: 1, src: "/images/sustainability/sgs14.png", size: "h-22" },
          { id: 2, src: "/images/sustainability/sgs45.png", size: "h-22" },
        ],
        otherStandards: [
          {
            id: 1,
            title: "qualityInfo.otherStandards.0.title",
            description: "qualityInfo.otherStandards.0.description",
          },
          {
            id: 2,
            title: "qualityInfo.otherStandards.1.title",
            description: "qualityInfo.otherStandards.1.description",
          },
        ],
      },
      supplyChain: {
        title: "supplyChain.title",
        subtitle: "supplyChain.subtitle",
        packagingOptions: [
          {
            id: 1,
            value: "25",
            unit: "supplyChain.packagingOptions.0.unit",
            texts: "supplyChain.packagingOptions.0.texts",
          },
        ],

        packagingText: "supplyChain.packagingText",
        buttons: [
          { label: "supplyChain.buttons.0.label", slug: "mehq-pds" },
          { label: "supplyChain.buttons.1.label", slug: "mehq-sds" },
        ],
        linkButtons: [{ label: "supplyChain.linkButtons.0.label", link: "/contact-us" }],
      },
    },
  },
};
