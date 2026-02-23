import { useTranslations } from "next-intl";
import Image from "next/image";

const pillars = [
  {
    icon: "/images/about-us/GOAL.png",
    title: "pillars.mission.title",
    description: "pillars.mission.description",
  },
  {
    icon: "/images/about-us/EYE.png",
    title: "pillars.vision.title",
    description: "pillars.vision.description",
  },
];
function AboutMainSection() {
  const t = useTranslations("about");

  return (
    <>
      <section className="py-16 container-inner">
        <div className="md:gap-16 font-medium text-medium-dark">{t("main.p1")}</div>
        <div className="md:gap-16 mt-5 font-medium text-medium-dark">{t("main.p2")}</div>
        <div className="md:gap-16 mt-5 font-medium text-medium-dark">{t("main.p3")}</div>
      </section>
      <section className="bg-gray-section">
        <div className="gap-16 grid md:grid-cols-2 py-16 container-inner">
          {pillars.map((pillar, index) => (
            <div key={index} className="flex flex-col items-start gap-8 w-full">
              <div className="flex items-center gap-5">
                <div className="relative flex flex-[0_0_72px] justify-start items-center size-18">
                  <Image src={pillar.icon} alt={pillar.title} fill />
                </div>
                <div className="flex flex-col justify-between h-full">
                  <h3 className="mt-3 font-extrabold text-off-black text-3xl leading-tight">
                    {t(pillar.title)}
                  </h3>
                  <div className="border-light-dark border-t w-12"></div>
                </div>
              </div>
              <p className="font-medium text-medium-dark leading-relaxed">
                {t(pillar.description)}
              </p>
            </div>
          ))}
        </div>
      </section>
      <section className="z-0 relative bg-gray-200 mb-5">
        <Image
          src="/images/about-us/vs-bg.jpg"
          fill
          alt="Value System"
          className="-z-1 absolute object-cover"
          quality={100}
        />
        <div className="py-16 container-inner">
          <div className="flex sm:flex-row flex-col items-start sm:items-center gap-5 mt-16">
            <div className="relative flex flex-[0_0_72px] justify-start items-center size-18">
              <Image src={"/images/about-us/ValueSystemIcon.png"} alt={"Value System"} fill />
            </div>
            <div className="flex flex-col justify-between h-full">
              <h2 className="font-extrabold text-off-black text-2xl md:text-3xl">
                {t("valueSystem.title")}
              </h2>
              <div className="bg-light-dark my-3 w-12 h-px"></div>
              <p className="mt-2 font-medium text-medium-dark leading-relaxed">
                {t("valueSystem.description")}
              </p>
            </div>
          </div>

          <div className="gap-16 grid md:grid-cols-2 my-16">
            {["agility", "value", "innovation", "development"].map((key) => (
              <div key={key} className="flex flex-col items-start w-full">
                <h3 className="font-extrabold text-off-black text-xl leading-tight">
                  {t(`valueSystem.${key}.title`)}
                </h3>
                <div className="mb-5 font-medium text-medium-dark leading-relaxed">
                  {t(`valueSystem.${key}.desc`)}
                </div>
                <div className="bg-light-dark mt-auto w-12 h-px"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default AboutMainSection;
