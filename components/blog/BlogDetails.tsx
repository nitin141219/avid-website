import { useTranslations } from "next-intl";
import BlogContent from "./BlogContent";
import BlogHeroSection from "./BlogHeroSection";
import BlogRelatedPostSection from "./BlogRelatedPost";
import SocialShare from "./SocialShare";

export default function BlogDetails({ data }: { data: any }) {
  const tCommon = useTranslations("common");
  return (
    <div className="mx-auto px-4 w-full">
      <div className="container-inner">
        <BlogHeroSection data={data} />
        <BlogContent data={data} />

      <div className="flex flex-wrap justify-between container-inner">
        <div className="flex-[0_0_100%] my-10">
          <div className="flex items-center gap-3 ml-auto w-fit">
            <span className="font-medium text-medium-dark">{tCommon("share_post")}:</span>
            <SocialShare title={data?.title} />
          </div>
        </div>
      </div>
      {data?.related_blogs?.length ? (
        <BlogRelatedPostSection title={tCommon("related_posts")} postList={data?.related_blogs} />
      ) : null}
      </div>
    </div>
  );
}
