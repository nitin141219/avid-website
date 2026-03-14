import { useTranslations } from "next-intl";
import { FileText } from "lucide-react";
import SocialShare from "../blog/SocialShare";
import NewsContent from "./NewsContent";
import NewsDetailHeroSection from "./NewsDetailHeroSection";

function formatFileSize(size?: number | string | null) {
  const bytes = Number(size || 0);
  if (!Number.isFinite(bytes) || bytes <= 0) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

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
  const downloadSize = formatFileSize(
    data?.download_size || data?.downloadSize || data?.pdf_size || data?.pdfSize
  );

  return (
    <div className="mx-auto px-4 w-full">
      <div className="container-inner">
        <NewsDetailHeroSection data={data} />
        <NewsContent data={data} />

        {downloadUrl ? (
          <section className="mt-14">
            <h2 className="font-extrabold text-primary text-3xl md:text-4xl">Downloads</h2>
            <div className="bg-light-dark mt-1 mb-6 w-12 h-px" />
            <a
              href={downloadUrl}
              target="_blank"
              rel="noopener noreferrer"
              download
              className="group flex items-center gap-5 border border-primary/60 hover:bg-primary/5 hover:border-primary px-5 md:px-6 py-5 w-full max-w-[520px] transition-colors duration-300"
            >
              <div className="flex justify-center items-center border border-primary/20 group-hover:bg-primary group-hover:border-primary w-15 h-15 text-primary group-hover:text-white transition-colors duration-300">
                <FileText className="w-7 h-7" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-extrabold text-off-black group-hover:text-primary text-xl md:text-2xl leading-tight transition-colors duration-300">
                  {downloadTitle}
                </p>
                <div className="flex items-center gap-4 mt-2 text-base">
                  <span className="font-semibold text-primary uppercase">PDF</span>
                  {downloadSize ? (
                    <>
                      <span className="bg-light-dark w-px h-5" />
                      <span className="text-medium-dark">{downloadSize}</span>
                    </>
                  ) : null}
                </div>
              </div>
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
