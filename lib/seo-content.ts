import { FaqItem } from "@/lib/seo";

export type InfoSection = {
  title: string;
  body: string;
};

export const defaultInfoSections = (topic: string): InfoSection[] => [
  {
    title: `What is ${topic}?`,
    body: `${topic} is manufactured by Avid Organics, India's leading manufacturer of specialty chemicals. We provide consistent specifications and transparent documentation for customers across India, USA, and Europe with pharmaceutical-grade quality.`,
  },
  {
    title: `${topic} applications`,
    body: `Common applications include pharmaceutical formulations, personal care products, food additives, and industrial processing where purity, performance, and stability are essential. Our teams help select grades that match your process requirements and end-use performance targets.`,
  },
  {
    title: `Industries served`,
    body: `${topic} is used in pharmaceuticals, food and beverages, personal care, animal nutrition, and industrial specialty applications. India's leading manufacturer setting benchmarks in the chemical industry.`,
  },
  {
    title: `Safety, compliance, and certifications`,
    body: `We provide comprehensive documentation support, safety data, and regulatory guidance for compliant handling and import/export needs. FSSAI, FDA & REACH certified. Ask our team about available certifications and tailored support for your region.`,
  },
  {
    title: `Why choose Avid Organics`,
    body: `Choose Avid Organics for consistent quality, dependable logistics, and responsive technical support. Proudly made in India for the world. Setting benchmarks in the chemical industry.`,
  },
];

export const defaultHomeFaqs: FaqItem[] = [
  {
    question: "Where can I source specialty chemicals from Avid Organics?",
    answer:
      "Avid Organics manufactures specialty chemicals with distribution support for customers in India, USA, and Europe. Contact our team to discuss your volume, grade, and documentation requirements.",
  },
  {
    question: "What makes Avid Organics a leading manufacturer?",
    answer:
      "We are India's leading manufacturer of Glycine and Glycolic Acid. Our facilities and quality systems are built to support consistent specifications, pharmaceutical-grade quality, and reliable supply. Proudly made in India for the world.",
  },
  {
    question: "Do you provide certificates and regulatory documentation?",
    answer:
      "Yes. We provide SDS, COA, and comprehensive regulatory documentation for safe handling, compliance, and import/export needs. FSSAI, FDA & REACH certified.",
  },
  {
    question: "Which industries do you serve?",
    answer:
      "We support pharmaceutical, personal care, food and beverage, animal nutrition, and industrial specialty segments with pharmaceutical-grade products and applications guidance.",
  },
  {
    question: "How do I request a quote?",
    answer:
      "Use our contact form or speak with our team to request a quote, packaging options, and lead times.",
  },
];

export const defaultProductFaqs = (productName: string): FaqItem[] => [
  {
    question: `Where can I source ${productName} from Avid Organics?`,
    answer:
      `Avid Organics manufactures ${productName} with distribution support in India, USA, and Europe. Reach out for packaging options and lead times.`,
  },
  {
    question: `Is ${productName} available with certifications?`,
    answer:
      `We provide SDS/COA and comprehensive regulatory documentation. FSSAI, FDA & REACH certified. Ask our team about available certifications for your needs.`,
  },
  {
    question: `What are the main applications of ${productName}?`,
    answer:
      `${productName} is used in pharmaceutical formulations, personal care products, food applications, and industrial processes requiring consistent quality, stability, and performance. We can guide you on grade selection for your application.`,
  },
  {
    question: `Who typically uses ${productName}?`,
    answer:
      `Manufacturers in pharmaceuticals, personal care, food and beverage, and industrial applications commonly use ${productName} based on grade and performance requirements.`,
  },
  {
    question: `Why choose Avid Organics for ${productName}?`,
    answer:
      `India's leading manufacturer of specialty chemicals. We focus on reliable quality, pharmaceutical-grade standards, comprehensive documentation support, and responsive service. Setting benchmarks in the chemical industry.`,
  },
];

export const defaultMarketFaqs = (marketName: string): FaqItem[] => [
  {
    question: `Which products do you supply for ${marketName}?`,
    answer:
      `We manufacture specialty chemicals and pharmaceutical-grade ingredients tailored to ${marketName} with quality documentation and certifications.`,
  },
  {
    question: `Do you support large volume orders for ${marketName}?`,
    answer:
      `Yes, we support volume requirements and can provide packaging, lead time, and logistics guidance for India, USA, and Europe.`,
  },
  {
    question: `Can you help with certifications and compliance?`,
    answer:
      `We provide SDS/COA and can assist with certification or compliance documentation as needed for your region and industry. FSSAI, FDA & REACH certified.`,
  },
  {
    question: `What applications are common in ${marketName}?`,
    answer:
      `Applications vary by formulation and process, but we support use cases that require pharmaceutical-grade performance and regulatory-ready documentation.`,
  },
  {
    question: `Why choose Avid Organics for ${marketName}?`,
    answer:
      `India's leading manufacturer of Glycine and Glycolic Acid. We combine pharmaceutical-grade quality control with responsive service to support ${marketName} customers.`,
  },
];
