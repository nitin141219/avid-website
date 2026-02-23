import FacebookIcon from "@/public/assets/icons/facebook.svg";
import InstagramIcon from "@/public/assets/icons/instagram.svg";
import LinkedinIcon from "@/public/assets/icons/linkedin.svg";
import TwitterIcon from "@/public/assets/icons/twitter.svg";
import YoutubeIcon from "@/public/assets/icons/youtube.svg";
import React from "react";

const icons = {
  linkedin: LinkedinIcon,
  facebook: FacebookIcon,
  instagram: InstagramIcon,
  youtube: YoutubeIcon,
  twitter: TwitterIcon,
};

export type IconName = keyof typeof icons;

interface IconProps extends React.SVGProps<SVGSVGElement> {
  name: IconName;
  className?: string;
}

export function CustomIcon({ name, className, ...props }: IconProps) {
  const IconComponent = icons[name];
  if (!IconComponent) return null;

  return <IconComponent className={className} {...props} />;
}
