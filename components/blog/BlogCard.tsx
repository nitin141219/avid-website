import { ArrowRight } from "lucide-react";
import { DateTime } from "luxon";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { getResponsiveImageSources } from "@/lib/utils";
import { Button } from "../ui/button";

export default function BlogCard({ post }: any) {
  const locale = useLocale();
  const tCommon = useTranslations("common");
  const postImage = getResponsiveImageSources(post);
  const date = post.published_at
    ? DateTime.fromISO(post.published_at).setLocale(locale).toFormat("DDD")
    : null;
  return (
    <Link href={`/media/blog/${post.slug}`}>
      <div className="flex flex-col bg-gray-section h-full transition">
        <div className="w-full aspect-video overflow-hidden">
          <Image
            src={postImage.desktop}
            unoptimized
            width={480}
            height={280}
            alt={post?.title}
            className="hidden md:block w-full h-full object-cover"
          />
          <Image
            src={postImage.mobile}
            unoptimized
            width={480}
            height={280}
            alt={post?.title}
            className="md:hidden w-full h-full object-cover"
          />
        </div>
        <div className="flex flex-col flex-1 justify-between p-5">
          <div>
            <h3 className="inline-block font-bold text-off-black text-base xl:text-xl">
              {post.title}
              {post.sub_title ? ":" : ""}
            </h3>{" "}
            {post.sub_title && (
              <span className="font-normal text-medium-dark text-base xl:text-xl">
                {post.sub_title}
              </span>
            )}
          </div>
          <div>
            <div className="bg-light-dark mt-8 mb-5 w-25 h-px"></div>
            <div className="flex justify-between items-center text-medium-dark text-sm">
              <span>{date}</span>
              <Button variant="secondary">
                {tCommon("more_details")} <ArrowRight />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
