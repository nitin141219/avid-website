import { useTranslations } from "next-intl";
import SocialShare from "../blog/SocialShare";
import NewsContent from "./NewsContent";
import NewsDetailHeroSection from "./NewsDetailHeroSection";

export default function NewsDetails({ data }: { data: any }) {
  const tCommon = useTranslations("common");
  return (
    <div className="mx-auto px-4 w-full">
      <div className="container-inner">
        <NewsDetailHeroSection data={data} />
        <NewsContent data={data} />
      <div className="flex flex-wrap justify-between container-inner">
        <div className="flex-[0_0_100%] my-10">
          <div className="flex items-center gap-3 ml-auto w-fit">
            <span className="font-medium text-medium-dark"> {tCommon("share_post")}:</span>
            <SocialShare title={data?.title} />
          </div>
        </div>
      </div>
      {/* <PressReleasesSection title="Related Posts" /> */}
      </div>
    </div>
  );
}
