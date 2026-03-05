import { useTranslations } from "next-intl";
import { Download, FileText } from "lucide-react";
import SocialShare from "../blog/SocialShare";
import NewsContent from "./NewsContent";
import NewsDetailHeroSection from "./NewsDetailHeroSection";

export default function NewsDetails({ data }: { data: any }) {
  const tCommon = useTranslations("common");
  const downloadUrl =
    data?.download_pdf ||
    data?.downloadPdf ||
    data?.pdf ||
    data?.pdf_file ||
    data?.pdfFile ||
    data?.attachment ||
    data?.file ||
    "";
  const downloadTitle =
    data?.download_title ||
    data?.downloadTitle ||
    data?.pdf_title ||
    data?.pdfTitle ||
    "Copy of news and announcement";

  return (
    <div className="mx-auto px-4 w-full">
      <div className="container-inner">
        <NewsDetailHeroSection data={data} />
        <NewsContent data={data} />

        {downloadUrl ? (
          <section className="mt-12">
            <h2 className="font-bold text-primary text-4xl">Downloads</h2>
            <a
              href={downloadUrl}
              target="_blank"
              rel="noopener noreferrer"
              download
              className="group flex justify-between items-center gap-4 bg-[#f5f5f6] hover:bg-[#ececee] mt-6 px-5 py-4 border border-[#d8d8df] w-full max-w-xl transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className="bg-white p-3 border border-[#d8d8df]">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-primary text-xl leading-tight">{downloadTitle}</p>
                  <p className="mt-1 text-primary/80 text-sm">PDF</p>
                </div>
              </div>
              <Download className="w-5 h-5 text-primary" />
            </a>
          </section>
        ) : null}

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
