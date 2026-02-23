import { IMAGE_DIMENSION } from "@/constants";
import { useTranslations } from "next-intl";
import SocialShare from "../blog/SocialShare";
import EventContent from "./EventContent";
import EventHeroSection from "./EventHeroSection";

export default function EventDetails({ data }: { data: any }) {
  const tCommon = useTranslations("common");
  return (
    <div className="mx-auto w-full">
      <div
        className="mx-auto w-full"
        style={{
          maxWidth: IMAGE_DIMENSION.EVENT.width,
        }}
      >
        <EventHeroSection data={data} />
        <EventContent data={data} />
      <div className="flex flex-wrap justify-between container-inner">
        <div className="flex-[0_0_100%] my-10">
          <div className="flex items-center gap-3 ml-auto w-fit">
            <span className="font-medium text-medium-dark">{tCommon("share_post")}:</span>
            <SocialShare title={data?.title} />
          </div>
        </div>
      </div>
      {/* <PressReleasesSection title="Related Posts" /> */}
      </div>
    </div>
  );
}
