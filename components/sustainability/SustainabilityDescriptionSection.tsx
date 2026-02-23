import { useTranslations } from "next-intl";

export default function SustainabilityDescriptionSection() {
  const t = useTranslations("Sustainability.Description");
  return (
    <div className="py-16 container-inner">
      <div className="md:gap-16 md:columns-2 font-medium text-medium-dark">{t("text")}</div>
    </div>
  );
}
