"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { CustomIcon } from "../ui/custom-icon";

const LinkedInShareButton = dynamic(
  () => import("next-share").then((mod) => mod.LinkedinShareButton),
  { ssr: false }
);
const TwitterShareButton = dynamic(
  () => import("next-share").then((mod) => mod.TwitterShareButton),
  { ssr: false }
);
const FacebookShareButton = dynamic(
  () => import("next-share").then((mod) => mod.FacebookShareButton),
  { ssr: false }
);

interface SocialShareProps {
  title: string;
}

function SocialShare({ title }: SocialShareProps) {
  const pathname = usePathname();

  const shareUrl = process.env.NEXT_PUBLIC_BASE_URL + pathname;

  return (
    <>
      <LinkedInShareButton url={shareUrl} title={title}>
        <span className="inline-flex items-center justify-center bg-light-dark text-white w-9 h-7 transform skew-x-14 hover:bg-secondary transition-all duration-300">
          <CustomIcon name="linkedin" className="w-4 h-4 transform -skew-x-14" />
        </span>
      </LinkedInShareButton>

      <TwitterShareButton url={shareUrl} title={title}>
        <span className="inline-flex items-center justify-center bg-light-dark text-white w-9 h-7 transform skew-x-14 hover:bg-secondary transition-all duration-300">
          <CustomIcon name="twitter" className="w-4 h-4 transform -skew-x-14" />
        </span>
      </TwitterShareButton>

      <FacebookShareButton url={shareUrl} title={title}>
        <span className="inline-flex items-center justify-center bg-light-dark text-white w-9 h-7 transform skew-x-14 hover:bg-secondary transition-all duration-300">
          <CustomIcon name="facebook" className="w-4 h-4 transform -skew-x-14" />
        </span>
      </FacebookShareButton>
    </>
  );
}

export default SocialShare;
