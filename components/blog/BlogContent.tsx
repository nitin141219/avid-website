import { useLocale } from "next-intl";
import RichText from "../rich-text/RichText";
import { getLocalizedContent } from "@/lib/getLocalizedContent";

export default function BlogContent({ data }: any) {
  const locale = useLocale();
  const content = getLocalizedContent(data, "content", locale);
  return (
    <div>
      <RichText content={content} className="mt-5" />
    </div>
  );
}
