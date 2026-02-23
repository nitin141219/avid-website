import { useLocale } from "next-intl";
import RichText from "../rich-text/RichText";
import { getLocalizedContent } from "@/lib/getLocalizedContent";

export default function EventContent({ data }: any) {
  const locale = useLocale();
  const content = getLocalizedContent(data, "content", locale);
  // const date = data.published_at
  //   ? DateTime.fromISO(data.published_at).setLocale(locale).toFormat("DDD")
  //   : null;
  return (
    <div>
      {/* Top Right Date Box */}
      {/* <div className="bg-secondary ml-auto px-4 py-2 w-max text-white text-sm">
        {date} {data?.author ? "| " + data?.author : ""}
      </div> */}

      <RichText content={content} className="mt-5" />
    </div>
  );
}
