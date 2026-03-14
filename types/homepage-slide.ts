export type HomepageSlide = {
  _id: string;
  title: string;
  cta_text: string;
  cta_link: string;
  position: number;
  align: "left" | "right";
  image: string;
  image_mobile?: string;
  imageMobile?: string;
  mobileImage?: string;
  is_active: boolean;
} & Record<string, unknown>;
