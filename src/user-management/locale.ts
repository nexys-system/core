import { Locale } from "../middleware/auth/type";

export const langDefault = process.env.LOCALE_LANG_DEFAULT || "en";
export const countryDefault = process.env.LOCALE_COUNTRY_DEFAULT || "US";
export const localeDefault: Locale = {
  country: countryDefault,
  lang: langDefault,
};

export const headerAcceptLanguageToLocale = (
  acceptLanguage?: string
): Locale => {
  if (!acceptLanguage) {
    return localeDefault;
  }
  const [langString] = acceptLanguage.split(";");

  const [lang, country] = langString.split("-");

  if (!lang || !country) {
    return localeDefault;
  }
  return { lang, country };
};
