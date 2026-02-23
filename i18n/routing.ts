import { LOCALIZATION_LANGUAGE } from "@/constants";
import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  /* 
    TODO: USE LANGUAGES
    en: ENGLISH
    de: GERMAN
    fr: FRENCH
    es: SPANISH
  */

  locales: LOCALIZATION_LANGUAGE.map((i) => i.value),
  defaultLocale: "en",
});
