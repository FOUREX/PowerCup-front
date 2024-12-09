import i18n from "i18next"
import {initReactI18next} from "react-i18next";

import en from "./locales/en.json"
import ua from "./locales/ua.json"

type Locale = keyof typeof TRANSLATIONS;

const TRANSLATIONS = {
  en: en,
  ua: ua,
} as const;

const getCurrentLocale = (): Locale => "ua";

i18n
  .use(initReactI18next)
  .init({
    lng: getCurrentLocale(),
    fallbackLng: "en",
    resources: {
      en: { translation: TRANSLATIONS.en },
      ua: { translation: TRANSLATIONS.ua },
    },
    debug: true
  }).then()

export { i18n };
export const LOCALES = TRANSLATIONS[getCurrentLocale()];
