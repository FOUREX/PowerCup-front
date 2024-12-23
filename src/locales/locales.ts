import i18n from "i18next";
import {initReactI18next} from "react-i18next";

import en from "./locales/en.json"
import ua from "./locales/ua.json"

type Locale = "en" | "ua";

const getCurrentLocale = (): Locale => "ua";

i18n
  .use(initReactI18next)
  .init({
    lng: getCurrentLocale(),
    fallbackLng: "en",
    resources: {
      en: { translation: en },
      ua: { translatnion: ua },
    },
    debug: true
  }).then()

export { i18n };
