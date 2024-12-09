import i18n from "i18next";
import {initReactI18next} from "react-i18next";

import en from "./locales/en.json"
import ua from "./locales/ua.json"

type Locale = "en" | "ua";

const getCurrentLocale = (): Locale => "ua";

declare module "i18next" {
  interface CustomTypeOptions {
    resources: {
      en: typeof import("./locales/en.json");
      ua: typeof import("./locales/ua.json");
    };
  }
}


i18n
  .use(initReactI18next)
  .init({
    lng: getCurrentLocale(),
    fallbackLng: "en",
    resources: {
      en: { translation: en },
      ua: { translation: ua },
    },
    debug: true
  }).then()

export { i18n };
