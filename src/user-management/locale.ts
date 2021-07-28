import { Locale } from "../middleware/auth/type";

export const langDefault = process.env.LOCALE_LANG_DEFAULT || "en";
export const countryDefault = process.env.LOCALE_COUNTRY_DEFAULT || "US";
export const localeDefault: Locale = {
  country: countryDefault,
  lang: langDefault,
};
