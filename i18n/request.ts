import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  // Typically corresponds to the `[locale]` segment
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;

  const commonMessages = (await import(`@/localization/${locale}/common.json`)).default;
  const headerMessages = (await import(`@/localization/${locale}/header.json`)).default;
  const homeMessages = (await import(`@/localization/${locale}/home.json`)).default;
  const aboutMessages = (await import(`@/localization/${locale}/about.json`)).default;
  const mediaMessages = (await import(`@/localization/${locale}/media.json`)).default;
  const marketMessages = (await import(`@/localization/${locale}/market.json`)).default;
  const careersMessages = (await import(`@/localization/${locale}/careers.json`)).default;
  const sustainabilityMessages = (await import(`@/localization/${locale}/sustainability.json`))
    .default;
  const loginMessages = (await import(`@/localization/${locale}/login.json`)).default;
  const signUpMessages = (await import(`@/localization/${locale}/sign-up.json`)).default;
  const contactMessages = (await import(`@/localization/${locale}/contact.json`)).default;
  const productMessages = (await import(`@/localization/${locale}/product.json`)).default;
  return {
    locale,
    messages: {
      ...commonMessages,
      ...headerMessages,
      ...homeMessages,
      ...aboutMessages,
      ...mediaMessages,
      ...marketMessages,
      ...careersMessages,
      ...sustainabilityMessages,
      ...loginMessages,
      ...signUpMessages,
      ...contactMessages,
      ...productMessages,
    },
  };
});
