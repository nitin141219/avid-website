import { FaqItem } from "@/lib/seo";

export type InfoSection = {
  title: string;
  body: string;
};

export const defaultInfoSections = (topic: string): InfoSection[] => [
  {
    title: `What is ${topic}?`,
    body: `${topic} is manufactured by Avid Organics for regulated and industrial applications, with technical documentation and export support for customers in India, the United States, and Europe.`,
  },
  {
    title: `${topic} applications`,
    body: `Common applications include pharmaceutical formulations, personal care products, food additives, and industrial processing where purity, performance, and stability are essential. Our teams help select grades that match your process requirements and end-use performance targets.`,
  },
  {
    title: `Industries served`,
    body: `${topic} is used in pharmaceuticals, food and beverages, personal care, animal nutrition, and industrial specialty applications where batch consistency and documentation support matter.`,
  },
  {
    title: `Safety, compliance, and certifications`,
    body: `We provide documentation support, safety data, and regulatory guidance for compliant handling and import/export needs. Ask our team about available certifications and tailored support for your region.`,
  },
  {
    title: `Why choose Avid Organics`,
    body: `Choose Avid Organics for consistent quality, dependable logistics, and responsive technical support across qualification, commercial onboarding, and recurring supply.`,
  },
];

export const homeIntroContent = {
  eyebrow: "Manufacturer Overview",
  title: "Glycine and Glycolic Acid Manufacturer in India",
  body: [
    "Avid Organics has manufactured specialty chemical intermediates since 2007 from Vadodara, Gujarat, serving regulated customers across pharmaceutical, food, personal care, and industrial markets. Our integrated facility operates with annual capacity of 4,200 MT, including 2,400 MT of glycine and 2,000 MT of glycolic acid, supported by in-house quality, production, and supply chain teams of more than 150 professionals.",
    "Our operating systems include FSSC 22000, ISO 14001, and ISO 45001, with HALAL, KOSHER, and SMETA certifications supporting customer qualification requirements. For European customers, our glycolic acid portfolio includes REACH registration support. Procurement teams work with us for batch documentation, export-ready packaging, and responsive technical communication aligned to forecasted demand.",
  ],
};

export const defaultHomeFaqs: FaqItem[] = [
  {
    question: "What grades of glycine do you supply?",
    answer:
      "We supply glycine in pharmaceutical and technical grades depending on end use, regulatory requirements, and impurity limits. Typical procurement discussions cover assay, chloride, sulfate, heavy metals, loss on drying, residue on ignition, bulk density, and particle size profile. For pharmaceutical and nutraceutical applications, customers generally request alignment to USP or equivalent internal specifications, together with batch CoA, SDS, and handling information. For industrial applications, the focus is usually on functional performance, consistency, and cost efficiency. Final released specification should always be confirmed against the intended application, market, and customer validation protocol before commercial supply.",
  },
  {
    question: "What does formaldehyde-free glycine mean in your process?",
    answer:
      "Formaldehyde-free glycine refers to glycine manufactured without using a formaldehyde-based synthesis route. For procurement and regulatory teams, that matters because process route affects impurity profile, customer perception, and product positioning in sensitive applications. In practical terms, buyers usually want clarity on the raw material pathway, likely residuals, and how the process supports batch-to-batch consistency. This is especially relevant for pharmaceutical, personal care, and food-related applications where supplier questionnaires often include specific route-of-manufacture disclosures. The process statement should be supported by the technical data package and answered consistently across commercial, quality, and regulatory communication.",
  },
  {
    question: "What certifications and documents are available during supplier qualification?",
    answer:
      "Supplier qualification packages should include current certification copies, product specification, Certificate of Analysis format, Safety Data Sheet, allergen or origin statements where relevant, and export documentation requirements. Avid’s visible credentials across the site include FSSC 22000, ISO 14001, ISO 45001, HALAL, KOSHER, and SMETA, with REACH positioning for glycolic acid in Europe. Procurement teams should also request confirmation of manufacturing site address, quality system scope, shelf life, packaging configuration, and change control expectations. For regulated customers, it is useful to define in advance which documents are available at quotation stage versus after NDA, approval, or first commercial order.",
  },
  {
    question: "How do you control batch-to-batch consistency for glycine and glycolic acid?",
    answer:
      "Consistency starts with a controlled raw material stream, validated process parameters, in-process checks, and defined finished product release criteria. For buyers and formulators, the critical point is not only meeting one batch specification, but controlling variability across multiple shipments over time. Batch reproducibility should be discussed in terms of assay range, color, pH, moisture, key impurities, and physical performance during customer use. A sound supplier will also define retention sample practices, deviation handling, and lot traceability. Where customer processes are sensitive, it is appropriate to request representative CoAs from multiple lots before approval and to establish a formal notification process for any specification-impacting changes.",
  },
  {
    question: "What supply capacity can you support for long-term contracts?",
    answer:
      "Visible capacity claims across Avid content indicate total annual capacity of 4,200 MT, including 2,400 MT for glycine and 2,000 MT for glycolic acid. For procurement managers, the more important discussion is how that capacity is allocated across grades, geographies, and contract structures. Long-term supply planning should cover monthly call-off volume, safety stock assumptions, lead time by pack size, export lane constraints, and peak-season scheduling. For strategic accounts, forecast visibility improves production planning and shipment reliability. A supplier should be prepared to confirm standard lead times, expedited order conditions, and whether packaging, labeling, or document sets can be standardized across recurring purchase orders.",
  },
  {
    question: "What packaging and logistics options are available for export shipments?",
    answer:
      "Packaging should match both product grade and the customer’s receiving process. Avid’s glycolic acid page already signals options such as carboys, drums, totes, and bulk ISO tanks, which is the right direction for industrial and multinational buyers. Glycine buyers typically also want clarity on bag or drum type, liner specification, palletization, batch segregation, and container loading efficiency. Export readiness includes labeling, dangerous goods classification where applicable, document accuracy, and storage guidance through transit and warehousing. For US, UK, and EU customers, it is useful to confirm who manages shipment documentation, which Incoterms are supported, and how technical or regulatory questions are handled after dispatch.",
  },
];

export const defaultProductFaqs = (productName: string): FaqItem[] => {
  const normalized = productName.toLowerCase();

  if (normalized.includes("glycine")) {
    return [
      {
        question: `What glycine specifications are typically reviewed during qualification for ${productName}?`,
        answer:
          "For glycine qualification, procurement and QA teams usually review assay, clarity, chloride, sulfate, ammonium, heavy metals, residue on ignition, loss on drying, bulk density, and particle size profile. The exact release range depends on the grade and the customer’s process sensitivity. Pharmaceutical and nutraceutical buyers generally also request confirmation against pharmacopeial expectations, together with representative batch CoAs and change-control expectations. In practice, approval decisions are made not only on a specification sheet but on evidence of repeatability across multiple lots, the responsiveness of technical support, and the completeness of the documentation package.",
      },
      {
        question: `Can ${productName} support pharmaceutical-grade and regulated applications?`,
        answer:
          "Pharmaceutical and other regulated applications require more than a high assay result. Buyers normally assess whether the supplier can provide the right quality documentation, impurity control rationale, and traceability expectations for the intended end use. For glycine, this often includes pharmacopeial alignment, defined release testing, lot traceability, SDS, CoA format review, and clear communication on manufacturing route and change notification. The correct way to qualify supply is to match the released specification to the customer’s validated requirement rather than assuming one grade fits every formulation, market, or regulatory pathway.",
      },
      {
        question: `What does formaldehyde-free glycine manufacturing mean for buyers?`,
        answer:
          "For technical and regulatory teams, a formaldehyde-free glycine route matters because route of synthesis can influence impurity expectations, questionnaire responses, and the positioning of the ingredient in regulated or sensitive applications. Buyers commonly ask for a clear statement on route of manufacture, likely residuals, and the controls used to maintain batch consistency. This is especially relevant where internal supplier qualification documents ask direct questions on raw material pathway, process chemistry, or restricted substances. The value is not just marketing language; it is the ability to answer quality, procurement, and regulatory questions with the same documented process narrative.",
      },
      {
        question: `What packaging and documentation are typically available for ${productName}?`,
        answer:
          "Glycine buyers usually need clarity on pack size, bag or drum type, liner construction, palletization, lot coding, shelf life, and loading configuration for export shipments. The documentation discussion is equally important and generally covers product specification, CoA, SDS, origin declarations where relevant, and commercial/export paperwork. For strategic accounts, packaging standardization across repeat orders can reduce receiving issues and simplify internal quality checks. Before finalizing a supply program, procurement teams should confirm the standard lead time, release-document timing, and whether any market-specific labeling or qualification documents are needed for the final destination.",
      },
      {
        question: `How should supply capacity be evaluated for long-term glycine contracts?`,
        answer:
          "Annual capacity is a useful starting point, but long-term supply decisions should also examine monthly production planning, grade allocation, safety stock approach, and shipment lead time by pack format and destination. A buyer should understand how demand is forecast, how urgent allocations are handled, and whether documentation and labeling can be standardized across repeat shipments. Multi-lot consistency matters as much as nameplate capacity. For strategic programs, it is sensible to review sample CoAs from more than one batch, align on change notification expectations, and define the document set that must accompany every commercial release.",
      },
      {
        question: `Which teams usually evaluate ${productName} before approval?`,
        answer:
          "On B2B accounts, glycine approval usually involves procurement, quality assurance, regulatory, and application or formulation teams. Procurement focuses on continuity, lead time, commercial structure, and packaging efficiency. QA reviews the specification, release testing, traceability, and change-control discipline. R&D or formulation teams assess how the material behaves in the actual process, including dissolution, compatibility, and consistency across batches. Regulatory teams may review route-of-manufacture disclosures and supporting statements. A supplier tends to perform best in qualification when the same technical answers are available consistently across commercial, quality, and regulatory communication.",
      },
    ];
  }

  if (normalized.includes("glycolic")) {
    return [
      {
        question: `What glycolic acid specifications are most important when qualifying ${productName}?`,
        answer:
          "For glycolic acid, qualification typically starts with concentration, color, clarity, free acid balance where relevant, pH, residue profile, and the impurity limits that matter for the intended use. Cosmetic, pharmaceutical-intermediate, and industrial cleaning applications can each prioritize different specification details. Buyers generally also review packaging compatibility, transport classification, storage conditions, and the consistency of CoA reporting across lots. The most reliable qualification process compares multiple production batches rather than relying on a single typical value sheet, especially where downstream process performance depends on tight control of color, odor, or trace impurities.",
      },
      {
        question: `Why is a formaldehyde-free MCA route relevant for glycolic acid buyers?`,
        answer:
          "A formaldehyde-free monochloroacetic acid route is relevant because process chemistry influences impurity expectations, customer audits, and end-market acceptability. Procurement and regulatory teams increasingly ask suppliers to explain not only what specification is released, but how the product is made and which process choices support cleaner composition and more consistent batch performance. This is especially relevant for personal care, pharmaceutical-intermediate, and export markets where route-of-manufacture disclosures may appear in qualification questionnaires. A documented process narrative also helps commercial, QA, and regulatory teams speak with one voice during supplier approval and technical review.",
      },
      {
        question: `Can ${productName} support Europe-focused procurement requirements?`,
        answer:
          "For Europe-focused procurement, buyers usually want confirmation on REACH positioning, available document support, packaging formats for the destination market, and the responsiveness of the supplier’s technical contact points. The qualification conversation typically includes the product specification, SDS, CoA format, storage guidance, and how shipment documents are managed for EU import workflows. Where the glycolic acid is being used in regulated or customer-audited applications, the supplier’s ability to explain manufacturing controls and change notification becomes just as important as the initial quotation. The strongest qualification packages reduce follow-up questions across procurement, QA, and regulatory teams.",
      },
      {
        question: `What packaging options should buyers review for ${productName}?`,
        answer:
          "For glycolic acid, packaging review should cover concentration, pack material compatibility, venting requirements where relevant, palletization, labeling, and the preferred receiving format at the customer site. Different accounts may need carboys, drums, totes, or bulk supply depending on monthly consumption and handling systems. Procurement teams should also confirm lot segregation, documentation timing, and what precautions are recommended for storage during transit and warehousing. A practical packaging discussion improves both safety and total cost because it affects unloading efficiency, container utilization, damaged-goods risk, and the consistency of internal handling procedures at the destination facility.",
      },
      {
        question: `How do buyers assess supply reliability for ${productName}?`,
        answer:
          "Reliable glycolic acid supply is evaluated through more than annual capacity. Buyers generally review monthly output planning, lead time by packaging format, export lane stability, and how quickly technical or documentation questions are resolved. Accounts with regular call-offs often benefit from agreed forecasting windows, safety-stock assumptions, and a standard document set for each dispatch. When process sensitivity is high, qualification should include representative CoAs from more than one lot and an understanding of how deviations or changes are communicated. This reduces risk during scale-up, repeat ordering, and multinational supply programs that depend on stable released quality.",
      },
      {
        question: `Which applications most often require deeper technical review of ${productName}?`,
        answer:
          "The deepest technical review usually happens in personal care, pharmaceutical-intermediate, electronics or precision cleaning, and specialty industrial applications where impurity profile, color, concentration control, and route of manufacture materially affect performance. In those cases, buyers and formulators often ask for more than a brochure: they want release parameters, typical values, storage guidance, and clarity on how the product behaves across repeated batches. These discussions frequently involve QA, procurement, and the end-use technical team together. The qualification process is strongest when the supplier can connect manufacturing controls directly to the application requirements under review.",
      },
    ];
  }

  return [
    {
      question: `Where can I source ${productName} from Avid Organics?`,
      answer:
        `Avid Organics manufactures ${productName} with export support for customers across India, the United States, the United Kingdom, Germany, France, and the Netherlands. Qualification discussions usually cover grade alignment, packaging format, documentation, and lead time rather than price alone. Buyers should confirm the intended application, pack size, destination market, and any market-specific document expectations early in the process. That allows technical, quality, and commercial teams to align the correct release specification and shipment setup before the first sample or commercial order is issued.`,
    },
    {
      question: `What technical documents are usually available for ${productName}?`,
      answer:
        `The standard technical package normally includes a product specification, Safety Data Sheet, and Certificate of Analysis format, with additional statements discussed according to the end market and qualification process. Procurement teams often also ask about shelf life, packaging construction, lot coding, storage guidance, and change-control expectations. For customers operating in regulated or audited environments, it is useful to agree up front which documents are available during supplier qualification and which require NDA or account approval. A clear document roadmap reduces delays during onboarding and helps internal stakeholders review the same information set.`,
    },
    {
      question: `How is supply reliability evaluated for ${productName}?`,
      answer:
        `Supply reliability should be reviewed through capacity, planning discipline, lot-to-lot consistency, and responsiveness to technical queries. Strategic buyers typically assess monthly production planning, lead times by pack format, export documentation readiness, and how deviations or change notifications are handled. When an application is sensitive, multi-lot CoA review is often more valuable than a single typical specification sheet. A dependable supplier should be able to explain how orders are scheduled, how documentation is issued, and what support is available if a receiving, labeling, or qualification question arises after dispatch.`,
    },
  ];
};

export const defaultMarketFaqs = (marketName: string): FaqItem[] => [
  {
    question: `Which products do you supply for ${marketName}?`,
    answer:
      `We supply specialty chemicals and performance materials aligned to ${marketName} requirements, with grade selection guided by end use, documentation needs, and process sensitivity. Qualification typically starts with product fit, but buyers also assess packaging format, batch documentation, and the supplier’s ability to support recurring shipments. The best supply programs are built by matching the released specification and document package to the intended application rather than treating all use cases as interchangeable. That is especially important where technical teams, procurement, and QA each review the material from a different perspective.`,
  },
  {
    question: `Do you support large volume orders for ${marketName}?`,
    answer:
      `Yes. High-volume programs are usually planned around monthly call-off forecasts, agreed pack sizes, export lanes, and the documentation that must accompany each release. For procurement teams, continuity depends not only on annual capacity but also on how production is allocated, how urgent requirements are handled, and whether packaging and labels can be standardized across repeat orders. When a market has sensitive validation requirements, multi-lot review and change-notification expectations should also be agreed early so scaling up does not create unnecessary qualification delays.`,
  },
  {
    question: `Can you help with certifications and compliance?`,
    answer:
      `We provide the technical documentation and supporting information commonly needed during supplier qualification, including specification review, CoA format, SDS, and available certification references. Compliance discussions usually vary by market, destination country, and customer audit requirements, so the practical approach is to define the exact document set needed for commercial onboarding before sampling or first shipment. That keeps procurement, QA, and regulatory review aligned and reduces the risk of rework once the sourcing process is already underway.`,
  },
  {
    question: `What applications are common in ${marketName}?`,
    answer:
      `Applications vary by formulation and process, but the common thread is that buyers in ${marketName} usually need consistency, technical clarity, and supply continuity. Depending on the use case, that can mean tighter impurity review, more detailed storage and packaging guidance, or closer coordination between technical and commercial teams. The strongest supplier relationship is built when the material specification, route-of-manufacture questions, and shipment setup are all aligned with the downstream process rather than treated as separate conversations.`,
  },
  {
    question: `Why choose Avid Organics for ${marketName}?`,
    answer:
      `For ${marketName} customers, supplier choice is usually based on a combination of technical fit, documentation readiness, and dependable commercial execution. Avid’s advantage is the ability to support those discussions together rather than in silos. Buyers can evaluate manufacturing capability, available quality systems, document support, and export readiness within one qualification process. That reduces friction between sourcing, QA, and application teams and makes it easier to move from initial review to repeat commercial supply with a clearer understanding of specifications, lead times, and communication expectations.`,
  },
];

export type SeoLocale = "en" | "de" | "fr" | "es";

const normalizeSeoLocale = (locale: string): SeoLocale =>
  locale === "de" || locale === "fr" || locale === "es" ? locale : "en";

export function getLocalizedHomeIntro(locale: string) {
  const current = normalizeSeoLocale(locale);

  if (current === "de") {
    return {
      eyebrow: "Herstellerprofil",
      title: "Hersteller von Glycin und Glykolsaeure in Indien",
      body: [
        "Avid Organics produziert seit 2007 Spezialchemikalien in Vadodara, Gujarat, fuer Kunden aus Pharma, Lebensmittel, Personal Care und industriellen Anwendungen. Unser integrierter Standort verfuegt ueber eine Jahreskapazitaet von 4.200 MT, darunter 2.400 MT Glycin und 2.000 MT Glykolsaeure, getragen von mehr als 150 Mitarbeitenden in Qualitaet, Produktion und Lieferkette.",
        "Unsere Systeme umfassen FSSC 22000, ISO 14001 und ISO 45001 sowie HALAL-, KOSHER- und SMETA-Nachweise. Fuer europaeische Kunden unterstuetzen wir Glykolsaeure zudem mit REACH-bezogener Dokumentation. Einkaufs- und Technikteams arbeiten mit uns an Chargendokumentation, exportgerechter Verpackung und belastbarer Kommunikationsplanung.",
      ],
      resourcesTitle: "Ressourcen fuer Einkaeufer",
      resourceLabels: {
        glycine: "Lieferant fuer pharmazeutisches Glycin",
        glycolic: "Hersteller von Glykolsaeure",
        docs: "Technische Datenblaetter und Zertifikate",
        manufacturing: "Produktion und Qualitaetssysteme",
      },
      faqTitle: "Technische FAQ fuer Einkauf und Entwicklung",
      relatedTitle: "Weiterfuehrende Ressourcen",
      productFaqSuffix: "FAQ",
    };
  }

  if (current === "fr") {
    return {
      eyebrow: "Profil du fabricant",
      title: "Fabricant de glycine et d'acide glycolique en Inde",
      body: [
        "Avid Organics fabrique des intermediaires chimiques de specialite depuis 2007 a Vadodara, Gujarat, pour les secteurs pharmaceutique, alimentaire, cosmetique et industriel. Notre site integre dispose d'une capacite annuelle de 4 200 MT, dont 2 400 MT de glycine et 2 000 MT d'acide glycolique, avec plus de 150 collaborateurs en qualite, production et supply chain.",
        "Nos systemes comprennent FSSC 22000, ISO 14001 et ISO 45001, ainsi que des certifications HALAL, KOSHER et SMETA. Pour les clients europeens, notre offre d'acide glycolique s'appuie aussi sur un support documentaire lie a REACH. Les equipes achats et techniques travaillent avec nous sur la documentation de lot, l'emballage export et la planification des approvisionnements.",
      ],
      resourcesTitle: "Ressources pour les achats",
      resourceLabels: {
        glycine: "Fournisseur de glycine grade pharmaceutique",
        glycolic: "Fabricant d'acide glycolique",
        docs: "Fiches techniques et certificats",
        manufacturing: "Excellence industrielle et systemes qualite",
      },
      faqTitle: "FAQ technique pour achats et R&D",
      relatedTitle: "Ressources associees",
      productFaqSuffix: "FAQ",
    };
  }

  if (current === "es") {
    return {
      eyebrow: "Perfil del fabricante",
      title: "Fabricante de glicina y acido glicolico en India",
      body: [
        "Avid Organics fabrica intermediarios quimicos especializados desde 2007 en Vadodara, Gujarat, para clientes de los sectores farmaceutico, alimentario, cuidado personal e industrial. Nuestra planta integrada cuenta con una capacidad anual de 4.200 MT, incluyendo 2.400 MT de glicina y 2.000 MT de acido glicolico, respaldada por mas de 150 profesionales en calidad, produccion y cadena de suministro.",
        "Nuestros sistemas incluyen FSSC 22000, ISO 14001 e ISO 45001, junto con certificaciones HALAL, KOSHER y SMETA. Para clientes europeos, nuestra cartera de acido glicolico dispone tambien de soporte documental relacionado con REACH. Los equipos de compras y tecnico trabajan con nosotros en documentacion por lote, embalaje para exportacion y planificacion de suministro.",
      ],
      resourcesTitle: "Recursos para compras",
      resourceLabels: {
        glycine: "Proveedor de glicina grado farmaceutico",
        glycolic: "Fabricante de acido glicolico",
        docs: "Fichas tecnicas y certificados",
        manufacturing: "Excelencia operativa y sistemas de calidad",
      },
      faqTitle: "FAQ tecnica para compras e I+D",
      relatedTitle: "Recursos relacionados",
      productFaqSuffix: "FAQ",
    };
  }

  return {
    ...homeIntroContent,
    resourcesTitle: "Buyer Resources",
    resourceLabels: {
      glycine: "Pharmaceutical Grade Glycine Supplier",
      glycolic: "Glycolic Acid Manufacturer",
      docs: "Technical Data Sheets and Certificates",
      manufacturing: "Manufacturing Excellence and Quality Systems",
    },
    faqTitle: "Technical FAQ for Procurement and R&D Teams",
    relatedTitle: "Related Resources",
    productFaqSuffix: "FAQ",
  };
}

export function getLocalizedHomeFaqs(locale: string): FaqItem[] {
  const current = normalizeSeoLocale(locale);
  if (current === "en") return defaultHomeFaqs;
  if (current === "de") {
    return [
      {
        question: "Welche Glycinqualitaeten liefern Sie?",
        answer:
          "Wir liefern Glycin in pharmazeutischen und technischen Qualitaeten, abgestimmt auf Anwendung, regulatorische Anforderungen und zulaessige Verunreinigungen. Typische Qualifizierungsgespraeche betreffen Gehalt, Chlorid, Sulfat, Schwermetalle, Trocknungsverlust, Schuettdichte und Partikelprofil. Fuer regulierte Anwendungen werden zusaetzlich Chargen-CoA und SDS erwartet.",
      },
      {
        question: "Was bedeutet formaldehydfreies Glycin im Herstellprozess?",
        answer:
          "Formaldehydfreies Glycin bedeutet, dass die Synthese ohne formaldehydbasierte Route erfolgt. Fuer Einkauf, Qualitaet und Regulatory ist das relevant, weil die Prozessroute das Verunreinigungsprofil, Auditfragen und die Positionierung in sensiblen Anwendungen beeinflusst. Kunden erwarten eine konsistente Aussage zu Rohstoffpfad, Reststoffen und Chargenkonstanz.",
      },
      {
        question: "Welche Zertifikate und Dokumente stehen fuer die Lieferantenqualifizierung zur Verfuegung?",
        answer:
          "Im Qualifizierungspaket stehen in der Regel Spezifikation, CoA-Format, SDS, Zertifikatskopien sowie exportrelevante Unterlagen im Mittelpunkt. Sichtbare Nachweise auf der Website umfassen FSSC 22000, ISO 14001, ISO 45001, HALAL, KOSHER und SMETA sowie REACH-bezogene Unterstuetzung fuer Glykolsaeure.",
      },
    ];
  }
  if (current === "fr") {
    return [
      {
        question: "Quelles qualites de glycine fournissez-vous ?",
        answer:
          "Nous fournissons de la glycine en qualites pharmaceutiques et techniques selon l'application, les exigences reglementaires et les limites d'impuretes. Les evaluations achats et qualite portent habituellement sur le titre, les chlorures, sulfates, metaux lourds, perte a la dessiccation et profil granulometrique. Pour les usages reglementes, un CoA de lot et une SDS sont egalement attendus.",
      },
      {
        question: "Que signifie une glycine sans formaldehyde dans votre procede ?",
        answer:
          "Une glycine sans formaldehyde signifie que la voie de synthese n'utilise pas de procede base sur le formaldehyde. Pour les achats, la qualite et les affaires reglementaires, cela influe sur le profil d'impuretes, les questionnaires fournisseur et le positionnement dans les applications sensibles. Les clients attendent une explication coherente de la voie de fabrication et de la repetabilite lot a lot.",
      },
      {
        question: "Quels certificats et documents sont disponibles pour la qualification fournisseur ?",
        answer:
          "Un dossier de qualification comprend generalement la specification produit, le format de CoA, la fiche de donnees de securite, des copies de certificats et les documents necessaires a l'exportation. Les references visibles incluent FSSC 22000, ISO 14001, ISO 45001, HALAL, KOSHER et SMETA, ainsi qu'un support lie a REACH pour l'acide glycolique.",
      },
    ];
  }
  return [
    {
      question: "Que grados de glicina suministran?",
      answer:
        "Suministramos glicina en grados farmaceuticos y tecnicos segun la aplicacion, las exigencias regulatorias y los limites de impurezas. En la homologacion suelen revisarse ensayo, cloruros, sulfatos, metales pesados, perdida por secado y perfil de particula. Para usos regulados tambien se solicita CoA por lote y SDS.",
    },
    {
      question: "Que significa glicina libre de formaldehido en su proceso?",
      answer:
        "La glicina libre de formaldehido significa que la sintesis no utiliza una ruta basada en formaldehido. Para compras, calidad y regulatory esto es importante porque la ruta de fabricacion influye en el perfil de impurezas, los cuestionarios de homologacion y la percepcion del producto en aplicaciones sensibles. Los clientes esperan una explicacion consistente de la ruta de proceso y de la repetibilidad entre lotes.",
    },
    {
      question: "Que certificaciones y documentos estan disponibles durante la homologacion del proveedor?",
      answer:
        "El paquete de homologacion suele incluir especificacion de producto, formato de CoA, SDS, copias de certificaciones y documentos necesarios para exportacion. Entre las referencias visibles se incluyen FSSC 22000, ISO 14001, ISO 45001, HALAL, KOSHER y SMETA, ademas de soporte relacionado con REACH para el acido glicolico.",
    },
  ];
}

export function getLocalizedProductFaqs(productName: string, locale: string): FaqItem[] {
  const current = normalizeSeoLocale(locale);
  if (current === "en") return defaultProductFaqs(productName);
  if (current === "de") {
    return [
      {
        question: `Welche technischen Punkte werden bei ${productName} typischerweise geprueft?`,
        answer:
          `Bei der Qualifizierung von ${productName} pruefen Einkaufs-, QA- und Technikteams in der Regel Spezifikation, relevante Verunreinigungen, physikalische Kennwerte, Chargendokumentation und die Wiederholbarkeit ueber mehrere Lose. Entscheidend sind stabile Freigabewerte, ein belastbares CoA-Format und technische Reaktionsfaehigkeit.`,
      },
      {
        question: `Welche Dokumente sind fuer ${productName} ueblicherweise verfuegbar?`,
        answer:
          `Im Qualifizierungsprozess stehen fuer ${productName} typischerweise Spezifikation, CoA-Format, Sicherheitsdatenblatt sowie Angaben zu Verpackung, Haltbarkeit und Aenderungsmanagement im Fokus. Bei regulierten Anwendungen sollte frueh abgestimmt werden, welche Unterlagen fuer Sampling, Freigabe und Serienlieferung erforderlich sind.`,
      },
      {
        question: `Wie wird die Versorgungssicherheit fuer ${productName} bewertet?`,
        answer:
          `Versorgungssicherheit fuer ${productName} wird ueber Kapazitaet, Produktionsplanung, Loskonstanz, Vorlaufzeiten und Exportabwicklung bewertet. Strategische Kunden betrachten die monatliche Planbarkeit, die Standardisierung von Dokumenten und die Geschwindigkeit, mit der technische oder regulatorische Rueckfragen beantwortet werden.`,
      },
    ];
  }
  if (current === "fr") {
    return [
      {
        question: `Quels points techniques sont generalement examines pour ${productName} ?`,
        answer:
          `Pour ${productName}, les equipes achats, qualite et techniques examinent en general la specification, les impuretes pertinentes, les caracteristiques physiques, la documentation de lot et la repetabilite sur plusieurs productions. Sont particulierement attendus des valeurs de liberation stables, un format de CoA clair et une reponse technique rapide.`,
      },
      {
        question: `Quels documents sont habituellement disponibles pour ${productName} ?`,
        answer:
          `Pour ${productName}, le processus de qualification s'appuie generalement sur la specification produit, le format de CoA, la fiche de donnees de securite et, selon le besoin, des informations sur l'emballage, la duree de conservation et la gestion des changements. Pour les applications reglementees, il est utile de definir tres tot le jeu documentaire requis.`,
      },
      {
        question: `Comment evaluer la fiabilite d'approvisionnement pour ${productName} ?`,
        answer:
          `La fiabilite d'approvisionnement de ${productName} est evaluee a travers la capacite, la planification de production, la constance lot a lot, les delais et la maitrise documentaire a l'export. Les clients strategiques examinent egalement la standardisation des documents et la rapidite de reponse aux questions techniques ou reglementaires.`,
      },
    ];
  }
  return [
    {
      question: `Que aspectos tecnicos suelen revisarse para ${productName}?`,
      answer:
        `En la homologacion de ${productName}, los equipos de compras, calidad y tecnico suelen revisar la especificacion, las impurezas relevantes, las propiedades fisicas, la documentacion por lote y la repetibilidad entre varias producciones. Se valoran especialmente valores de liberacion estables, un formato de CoA claro y capacidad de respuesta tecnica.`,
    },
    {
      question: `Que documentos suelen estar disponibles para ${productName}?`,
      answer:
        `Para ${productName}, el proceso de homologacion normalmente incluye especificacion de producto, formato de CoA, ficha de datos de seguridad y, cuando aplica, informacion adicional sobre embalaje, vida util y control de cambios. En aplicaciones reguladas conviene definir desde el inicio el paquete documental requerido.`,
    },
    {
      question: `Como se evalua la fiabilidad de suministro para ${productName}?`,
      answer:
        `La fiabilidad de suministro de ${productName} se evalua a traves de capacidad, planificacion de produccion, consistencia lote a lote, plazos de entrega y control documental para exportacion. Los clientes estrategicos suelen revisar la estandarizacion de documentos y la rapidez con la que se atienden cuestiones tecnicas o regulatorias.`,
    },
  ];
}

export function getLocalizedMarketFaqs(marketName: string, locale: string): FaqItem[] {
  const current = normalizeSeoLocale(locale);
  if (current === "en") return defaultMarketFaqs(marketName);
  if (current === "de") {
    return [
      {
        question: `Welche Produkte liefern Sie fuer ${marketName}?`,
        answer:
          `Fuer ${marketName} liefern wir Spezialchemikalien und Funktionsmaterialien, deren Auswahl nach Anwendung, Dokumentationsbedarf und Prozesssensitivitaet erfolgt. In der Qualifizierung werden neben dem Produktfit auch Verpackung, Chargennachweise und die Faehigkeit fuer wiederkehrende Lieferungen geprueft.`,
      },
      {
        question: `Unterstuetzen Sie groessere Bedarfe in ${marketName}?`,
        answer:
          `Ja. Groessere Programme werden typischerweise ueber Monatsabrufe, Packgroessen, Exportwege und die benoetigte Dokumentation geplant. Fuer strategische Kunden spielen Produktionsplanung, Vorlaufzeiten und die Standardisierung von Unterlagen und Kennzeichnung eine wichtige Rolle.`,
      },
      {
        question: `Koennen Sie bei Compliance und Qualifizierungsunterlagen helfen?`,
        answer:
          `Wir unterstuetzen mit Spezifikationen, CoA-Format, SDS und den im Qualifizierungsprozess benoetigten Zertifikatsreferenzen. Welche Unterlagen erforderlich sind, haengt von Markt, Zielland und Kundenaudit ab. Deshalb sollte der Dokumentenumfang moeglichst frueh abgestimmt werden.`,
      },
    ];
  }
  if (current === "fr") {
    return [
      {
        question: `Quels produits fournissez-vous pour ${marketName} ?`,
        answer:
          `Pour ${marketName}, nous fournissons des produits chimiques de specialite et des materiaux de performance selectionnes selon l'application, les exigences documentaires et la sensibilite du procede. Lors de la qualification, les clients examinent aussi le conditionnement, les preuves de lot et la capacite a soutenir des livraisons recurrentes.`,
      },
      {
        question: `Pouvez-vous soutenir des volumes importants pour ${marketName} ?`,
        answer:
          `Oui. Les programmes de volume sont en general planifies autour des appels mensuels, des formats de conditionnement, des flux export et du jeu documentaire attendu pour chaque expedition. Les clients strategiques evaluent egalement la planification, les delais et la standardisation des documents et etiquettes.`,
      },
      {
        question: `Pouvez-vous aider sur la conformite et les documents de qualification ?`,
        answer:
          `Nous accompagnons les clients avec la specification, le format de CoA, la SDS et les references de certification utiles a la qualification fournisseur. Le contenu exact depend du marche, du pays de destination et des exigences d'audit. Il est donc preferable de definir tres tot le perimetre documentaire necessaire.`,
      },
    ];
  }
  return [
    {
      question: `Que productos suministran para ${marketName}?`,
      answer:
        `Para ${marketName} suministramos quimicos especializados y materiales funcionales seleccionados segun la aplicacion, la necesidad documental y la sensibilidad del proceso. Durante la homologacion, los clientes revisan tambien el embalaje, la evidencia por lote y la capacidad para sostener envios recurrentes.`,
    },
    {
      question: `Pueden soportar volumenes altos para ${marketName}?`,
      answer:
        `Si. Los programas de mayor volumen suelen planificarse alrededor de pedidos mensuales, formatos de empaque, rutas de exportacion y el paquete documental esperado para cada despacho. Los clientes estrategicos tambien revisan planificacion, plazos y estandarizacion de documentos y etiquetas.`,
    },
    {
      question: `Pueden ayudar con cumplimiento y documentos de homologacion?`,
      answer:
        `Apoyamos a los clientes con especificacion, formato de CoA, SDS y referencias de certificacion utiles en la homologacion del proveedor. El contenido exacto depende del mercado, del pais de destino y de los requisitos de auditoria. Por eso conviene definir pronto el alcance documental necesario.`,
    },
  ];
}
