export interface ProductPageData {
  hero: {
    title: string;
    subtitle: string;
  };

  information: {
    title: { type: "icon" | "text"; src: string; className?: string; gapPx?: number };
    image?: string;
    images?: string[];
    tag?: string;
    subText?: string;
    description: string;
    bioBasedContent?: string;
    casNumber?: string;
    molecularFormula?: string;
    molecularWeight?: string;
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
        title: { type: "icon", src: "/images/product/avigaHP70.webp" },
        image: "/images/product/avigaHP70.webp",
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
            icon: "/images/product/ad.webp",
            description: "applications.items.0.description",
          },
          {
            id: 2,
            title: "applications.items.1.title",
            icon: "/images/product/paf.webp",
            description: "applications.items.1.description",
          },
          {
            id: 3,
            title: "applications.items.2.title",
            icon: "/images/product/ps.webp",
            description: "applications.items.2.description",
          },
          {
            id: 4,
            title: "applications.items.3.title",
            icon: "/images/product/is.webp",
            description: "applications.items.3.description",
          },
        ],
      },
      qualityInfo: {
        title: "qualityInfo.title",
        subtitle: "qualityInfo.subtitle",
        manufacturingStandards: [
          { id: 1, src: "/images/sustainability/sgs14.webp", size: "h-22" },
          { id: 2, src: "/images/sustainability/sgs45.webp", size: "h-22" },
          { id: 3, src: "/images/sustainability/reach.webp", size: "h-22" },
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
    "aviga-bio-t": {
      hero: {
        title: "hero.title",
        subtitle: "hero.subtitle",
      },
      information: {
        title: {
          type: "icon",
          src: "/images/product/avigabioT.webp",
          className: "object-contain mt-2",
          gapPx: 12,
        },
        image: "/images/product/Product Slide Show/aviga-bio-t/Aviga Bio T-personal.webp",
        images: ["/images/product/Product Slide Show/aviga-bio-t/Aviga Bio T-personal.webp"],
        subText: "information.subText",
        description: "information.description",
        bioBasedContent: "information.bioBasedContent",
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
            icon: "/images/product/cs.webp",
            description: "applications.items.0.description",
          },
          {
            id: 2,
            title: "applications.items.1.title",
            icon: "/images/product/idc.webp",
            description: "applications.items.1.description",
          },
          {
            id: 3,
            title: "applications.items.2.title",
            icon: "/images/product/of.webp",
            description: "applications.items.2.description",
          },
          {
            id: 4,
            title: "applications.items.3.title",
            icon: "/images/product/tp.webp",
            description: "applications.items.3.description",
          },
          {
            id: 5,
            title: "applications.items.4.title",
            icon: "/images/product/lm.webp",
            description: "applications.items.4.description",
          },
          {
            id: 6,
            title: "applications.items.5.title",
            icon: "/images/product/sac.webp",
            description: "applications.items.5.description",
          },
        ],
      },
      qualityInfo: {
        title: "qualityInfo.title",
        subtitle: "qualityInfo.subtitle",
        manufacturingStandards: [
          { id: 1, src: "/images/sustainability/sgs14.webp", size: "h-22" },
          { id: 2, src: "/images/sustainability/sgs45.webp", size: "h-22" },
          { id: 3, src: "/images/sustainability/reach.webp", size: "h-22" },
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
    "aviga-t": {
      hero: {
        title: "hero.title",
        subtitle: "hero.subtitle",
      },
      information: {
        title: { type: "icon", src: "/images/product/avigaT.webp" },
        image: "/images/product/avigaT-product.webp",
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
            icon: "/images/product/cs.webp",
            description: "applications.items.0.description",
          },
          {
            id: 2,
            title: "applications.items.1.title",
            icon: "/images/product/idc.webp",
            description: "applications.items.1.description",
          },
          {
            id: 3,
            title: "applications.items.2.title",
            icon: "/images/product/of.webp",
            description: "applications.items.2.description",
          },
          {
            id: 4,
            title: "applications.items.3.title",
            icon: "/images/product/tp.webp",
            description: "applications.items.3.description",
          },
          {
            id: 5,
            title: "applications.items.4.title",
            icon: "/images/product/lm.webp",
            description: "applications.items.4.description",
          },
          {
            id: 6,
            title: "applications.items.5.title",
            icon: "/images/product/sac.webp",
            description: "applications.items.5.description",
          },
        ],
      },
      qualityInfo: {
        title: "qualityInfo.title",
        subtitle: "qualityInfo.subtitle",
        manufacturingStandards: [
          { id: 1, src: "/images/sustainability/sgs14.webp", size: "h-22" },
          { id: 2, src: "/images/sustainability/sgs45.webp", size: "h-22" },
          { id: 3, src: "/images/sustainability/reach.webp", size: "h-22" },
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
        title: { type: "icon", src: "/images/product/aviglyHP.webp" },
        image: "/images/product/avigly-hp-img.webp",
        images: [
          "/images/product/avigly-hp-img.webp",
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
            icon: "/images/product/api.webp",
            description: "applications.items.0.description",
          },
          {
            id: 2,
            title: "applications.items.1.title",
            icon: "/images/product/paf.webp",
            description: "applications.items.1.description",
          },
          {
            id: 3,
            title: "applications.items.2.title",
            icon: "/images/product/pe.webp",
            description: "applications.items.2.description",
          },
          {
            id: 4,
            title: "applications.items.3.title",
            icon: "/images/product/nu.webp",
            description: "applications.items.3.description",
          },
          {
            id: 5,
            title: "applications.items.4.title",
            icon: "/images/product/fb.webp",
            description: "applications.items.4.description",
          },
          {
            id: 6,
            title: "applications.items.5.title",
            icon: "/images/product/an.webp",
            description: "applications.items.5.description",
          },
        ],
      },
      qualityInfo: {
        title: "qualityInfo.title",
        subtitle: "qualityInfo.subtitle",
        manufacturingStandards: [
          { id: 1, src: "/images/footer/logo1.webp", size: "h-22" },
          { id: 2, src: "/images/sustainability/sgs14.webp", size: "h-22" },
          { id: 3, src: "/images/sustainability/sgs45.webp", size: "h-22" },
          { id: 4, src: "/images/footer/logo3.webp", size: "h-22" },
          { id: 5, src: "/images/footer/logo6.webp", size: "h-22" },
          { id: 6, src: "/images/sustainability/fssai.webp", size: "w-22! h-22" },
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
        title: { type: "icon", src: "/images/product/aviglyT.webp" },
        image: "/images/product/avigly-t-img.webp",
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
            icon: "/images/product/ci.webp",
            description: "applications.items.0.description",
          },
          {
            id: 2,
            title: "applications.items.1.title",
            icon: "/images/product/ip.webp",
            description: "applications.items.1.description",
          },
          {
            id: 3,
            title: "applications.items.2.title",
            icon: "/images/product/ss.webp",
            description: "applications.items.2.description",
          },
        ],
      },
      qualityInfo: {
        title: "qualityInfo.title",
        subtitle: "qualityInfo.subtitle",
        manufacturingStandards: [
          { id: 1, src: "/images/sustainability/sgs14.webp", size: "h-22" },
          { id: 2, src: "/images/sustainability/sgs45.webp", size: "h-22" },
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
        title: { type: "icon", src: "/images/product/avitau.webp" },
        image: "/images/product/avitau-img.webp",
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
            icon: "/images/product/enrgy.webp",
            description: "applications.items.0.description",
          },
          {
            id: 2,
            title: "applications.items.1.title",
            icon: "/images/product/brain.webp",
            description: "applications.items.1.description",
          },
          {
            id: 3,
            title: "applications.items.2.title",
            icon: "/images/product/ps.webp",
            description: "applications.items.2.description",
          },
          {
            id: 4,
            title: "applications.items.3.title",
            icon: "/images/product/an.webp",
            description: "applications.items.3.description",
          },
        ],
      },
      qualityInfo: {
        title: "qualityInfo.title",
        subtitle: "qualityInfo.subtitle",
        manufacturingStandards: [
          { id: 1, src: "/images/footer/logo1.webp", size: "h-22" },
          { id: 2, src: "/images/sustainability/sgs14.webp", size: "h-22" },
          { id: 3, src: "/images/sustainability/sgs45.webp", size: "h-22" },
          { id: 4, src: "/images/footer/logo3.webp", size: "h-22" },
          { id: 5, src: "/images/footer/logo6.webp", size: "h-22" },
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
        image: "/images/product/guaiacol.webp",
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
            icon: "/images/product/ffi.webp",
            description: "applications.items.0.description",
          },
          {
            id: 2,
            title: "applications.items.1.title",
            icon: "/images/product/ps.webp",
            description: "applications.items.1.description",
          },
          {
            id: 3,
            title: "applications.items.2.title",
            icon: "/images/product/sc.webp",
            description: "applications.items.2.description",
          },
          {
            id: 4,
            title: "applications.items.3.title",
            icon: "/images/product/rnd.webp",
            description: "applications.items.3.description",
          },
        ],
      },
      qualityInfo: {
        title: "qualityInfo.title",
        subtitle: "qualityInfo.subtitle",
        manufacturingStandards: [
          { id: 1, src: "/images/sustainability/sgs14.webp", size: "h-22" },
          { id: 2, src: "/images/sustainability/sgs45.webp", size: "h-22" },
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
        image: "/images/product/chlorhexidine-base.webp",
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
            icon: "/images/product/and.webp",
            description: "applications.items.0.description",
          },
          {
            id: 2,
            title: "applications.items.1.title",
            icon: "/images/product/ocp.webp",
            description: "applications.items.1.description",
          },
          {
            id: 3,
            title: "applications.items.2.title",
            icon: "/images/product/ps.webp",
            description: "applications.items.2.description",
          },
          {
            id: 4,
            title: "applications.items.3.title",
            icon: "/images/product/ia.webp",
            description: "applications.items.3.description",
          },
        ],
      },
      qualityInfo: {
        title: "qualityInfo.title",
        subtitle: "qualityInfo.subtitle",
        manufacturingStandards: [
          { id: 1, src: "/images/sustainability/sgs14.webp", size: "h-22" },
          { id: 2, src: "/images/sustainability/sgs45.webp", size: "h-22" },
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
        image: "/images/product/mehq.webp",
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
            icon: "/images/product/pi.webp",
            description: "applications.items.0.description",
          },
          {
            id: 2,
            title: "applications.items.1.title",
            icon: "/images/product/rms.webp",
            description: "applications.items.1.description",
          },
          {
            id: 3,
            title: "applications.items.2.title",
            icon: "/images/product/scs.webp",
            description: "applications.items.2.description",
          },
          {
            id: 4,
            title: "applications.items.3.title",
            icon: "/images/product/ips.webp",
            description: "applications.items.3.description",
          },
        ],
      },
      qualityInfo: {
        title: "qualityInfo.title",
        subtitle: "qualityInfo.subtitle",
        manufacturingStandards: [
          { id: 1, src: "/images/sustainability/sgs14.webp", size: "h-22" },
          { id: 2, src: "/images/sustainability/sgs45.webp", size: "h-22" },
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
