"use client";

import { Link } from "@/i18n/navigation";
import Image from "next/image";
import CountUp from "react-countup";

import { useTranslations } from "next-intl";

function LifeMainContent() {
  const t = useTranslations("careers.life");
  const safety = [
    {
      icon: "/images/sustainability/icon-1.png",
      title: t("safety.metrics.injuries.title"),
      text: t("safety.metrics.injuries.text"),
    },
    {
      icon: "/images/sustainability/icon-2.png",
      title: t("safety.metrics.compliance.title"),
      text: t("safety.metrics.compliance.text"),
    },
    {
      icon: "/images/sustainability/icon-3.png",
      text: t("safety.metrics.audits.text"),
    },
  ];
  return (
    <div>
      <section className="relative py-16 container-inner">
        <h2 className="font-extrabold text-off-black text-2xl md:text-3xl max-lg:text-center">
          {t("culture.title")}
        </h2>
        <div className="bg-light-dark mt-0.5 mb-6 w-12 h-px" />
        <p className="md:gap-16 mb-5 w-full max-w-6xl font-medium text-medium-dark">
          {t("culture.description1")}
        </p>
        <p className="md:gap-16 font-medium text-medium-dark">{t("culture.description2")}</p>
      </section>
      <div className="bg-gray-section py-16">
        <section className="relative container-inner">
          <h2 className="font-extrabold text-off-black text-2xl md:text-3xl max-lg:text-center">
            {t("why_work_with_us.title")}
          </h2>
          <div className="bg-light-dark mt-1 mb-6 w-12 h-px" />
          <p className="md:gap-16 mb-16 w-full max-w-6xl font-medium text-medium-dark">
            {t("why_work_with_us.intro")}
          </p>
          <h3 className="font-extrabold text-off-black text-xl leading-tight">
            {t("why_work_with_us.metrics_title")}
          </h3>
          <div className="bg-light-dark mt-2 mb-6 w-12 h-px"></div>
          <div className="items-center md:items-end md:space-x-10 max-md:space-y-10 grid grid-cols-1 md:grid-cols-3 mb-16">
            <div className="text-medium-dark">
              {t("why_work_with_us.employees_prefix")}
              <div>
                <CountUp
                  end={150}
                  duration={4}
                  separator=""
                  className="font-medium text-primary text-5xl"
                  suffix="+"
                />{" "}
                {t("why_work_with_us.employees_suffix")}
              </div>{" "}
              {t("why_work_with_us.continents_prefix")}{" "}
              <span className="font-bold text-off-black">
                {t("why_work_with_us.continents_highlight")}
              </span>
            </div>
            <div className="before:bottom-0 before:left-0 before:md:absolute relative before:bg-gray-300 md:pl-10 before:w-0.5 before:h-10 text-medium-dark">
              <div>
                <CountUp
                  end={85}
                  duration={4}
                  separator=""
                  className="font-medium text-primary text-5xl"
                  suffix="%"
                />
              </div>{" "}
              <span className="font-bold text-off-black">
                {t("why_work_with_us.retention_highlight")}
              </span>
            </div>
            <div className="before:bottom-0 before:left-0 before:md:absolute relative before:bg-gray-300 md:pl-10 before:w-0.5 before:h-10 text-medium-dark">
              <div>
                <CountUp
                  end={40}
                  duration={4}
                  separator=""
                  className="font-medium text-primary text-5xl"
                  suffix="%"
                />{" "}
                {t("why_work_with_us.promotions_suffix")}
              </div>{" "}
              {t("why_work_with_us.promotions_timeframe")}
            </div>
          </div>
          <div className="items-center md:items-start md:space-x-10 max-md:space-y-10 grid grid-cols-1 md:grid-cols-3 mb-16">
            <div className="text-medium-dark">
              <p className="font-bold text-primary">{t("why_work_with_us.tenure_highlight")}</p>
              <p>{t("why_work_with_us.tenure_desc1")}</p>
              <p>{t("why_work_with_us.tenure_desc2")}</p>
            </div>
            <div className="before:top-0 before:left-0 before:md:absolute relative before:bg-gray-300 md:pl-10 before:w-0.5 before:h-10 text-medium-dark">
              <p className="font-bold text-primary">{t("why_work_with_us.collab_highlight")}</p>
              <p>{t("why_work_with_us.collab_desc1")}</p>
              <p>{t("why_work_with_us.collab_desc2")}</p>
            </div>
            <div className="before:top-0 before:left-0 before:md:absolute relative before:bg-gray-300 md:pl-10 before:w-0.5 before:h-10 text-medium-dark">
              <p className="font-bold text-primary">{t("why_work_with_us.diversity_highlight")}</p>
              <p>{t("why_work_with_us.diversity_desc")}</p>
            </div>
          </div>
        </section>
      </div>
      <section className="relative py-16 container-inner">
        <h2 className="font-extrabold text-off-black text-2xl md:text-3xl max-lg:text-center">
          {t("learning.title")}
        </h2>
        <div className="bg-light-dark mt-1 mb-6 w-12 h-px" />
        <p className="md:gap-16 mb-6 w-full max-w-6xl font-medium text-medium-dark">
          {t("learning.description1")}
        </p>
        <p className="md:gap-16 w-full max-w-6xl font-medium text-medium-dark">
          {t("learning.description2")}
        </p>
      </section>
      <section className="md:pt-16 max-md:pb-16">
        <div className="flex flex-col-reverse gap-10 md:grid md:grid-cols-2 container-inner">
          <div>
            <h2 className="font-extrabold text-off-black text-2xl md:text-3xl max-lg:text-center">
              {t("safety.title")}
            </h2>
            <div className="bg-light-dark mt-1 mb-6 w-12 h-px" />
            <p className="md:gap-16 mb-16 w-full max-w-6xl font-medium text-medium-dark">
              {t("safety.description")}
            </p>
          </div>
          <div className="relative w-full h-90">
            <Image
              src="/images/life/Safety.jpg"
              alt="Renewable Energy Operations"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>
      <section className="bg-gray-section -mt-12 py-16">
        <div className="container-inner">
          <h3 className="font-extrabold text-off-black text-xl leading-tight">
            {t("safety.metrics_title")}
          </h3>
          <div className="bg-light-dark mt-2 mb-6 w-12 h-px"></div>
          <div className="gap-4 grid grid-cols-1 md:grid-cols-3">
            {safety.map((i) => (
              <div key={i.text} className="flex flex-col items-start w-full max-w-100">
                <div className="flex items-start gap-2">
                  <div className="relative flex flex-[0_0_72px] justify-start items-center size-18">
                    <Image src={i.icon} alt={i.text} fill />
                  </div>
                  <div>
                    <p className="font-extrabold text-off-black leading-tight">{i.title}</p>
                    <p className="font-medium text-medium-dark leading-relaxed">{i.text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-16">
        <div className="gap-10 grid md:grid-cols-2 container-inner">
          <div className="relative w-full h-90">
            <Image
              src="/images/life/Diversity.jpg"
              alt="Renewable Energy Operations"
              fill
              className="object-cover"
            />
          </div>
          <div>
            <h2 className="font-extrabold text-off-black text-2xl md:text-3xl max-lg:text-center">
              {t("diversity.title")}
            </h2>
            <div className="bg-light-dark mt-1 mb-6 w-12 h-px" />
            <p className="md:gap-16 mb-6 w-full max-w-6xl font-medium text-medium-dark">
              {t("diversity.description")}
            </p>
          </div>
        </div>
      </section>
      <section className="bg-primary py-16">
        <div className="container-inner">
          <div>
            <h2 className="font-extrabold text-white text-2xl md:text-3xl max-lg:text-center">
              {t("benefits.title")}
            </h2>
            <div className="bg-white/60 mt-1 mb-6 w-12 h-px" />
            <p className="md:gap-16 w-full max-w-6xl font-normal text-white">
              {t("benefits.intro")}
            </p>
            <p className="md:gap-16 mb-6 w-full max-w-6xl font-normal text-white">
              {t("benefits.philosophy")}
            </p>
            <h4 className="font-semibold text-white leading-tight">
              {t("benefits.offering_title")}
            </h4>
            <div className="bg-white/60 mt-2 mb-6 w-12 h-px" />
            <ul className="font-normal text-white list-[square] list-outside">
              {[
                t("benefits.list.compensation"),
                t("benefits.list.performance"),
                t("benefits.list.development"),
                t("benefits.list.inclusive"),
                t("benefits.list.growth"),
              ].map((i) => (
                <li key={i}>{i}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>
      <section className="relative py-16 container-inner">
        <h2 className="font-extrabold text-off-black text-2xl md:text-3xl max-lg:text-center">
          {t("join.title")}
        </h2>
        <div className="bg-light-dark mt-1 mb-6 w-12 h-px" />
        <p className="md:gap-16 mb-10 w-full max-w-6xl font-medium text-medium-dark">
          {t("join.description")}
        </p>
        <Link
          href="/careers/jobs#current-openings"
          className="flex justify-between items-center bg-secondary hover:bg-secondary/90 mt-auto px-4 py-2 w-max text-white text-sm"
        >
          {t("join.cta")}
        </Link>
      </section>
    </div>
  );
}

export default LifeMainContent;
