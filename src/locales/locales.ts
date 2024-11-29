/**
 * Piece of shid but for this case ok.
 * Use 'TranslationStructure' as template for each lang and don't forget to update it
 */
type Locale = "en" | "ua";

type TranslationStructure = {
  NAVBAR: {
    TEAMS: string;
    MATCHES: string;
    TOURNAMENTS: string;
    LOGIN: string;
    LOGOUT: string;
    REGISTER: string;
  };
  PAGES: {
    LOGIN: {
      AUTH: string;
      USERNAME: string;
      PASSWORD: string;
      ENTER_PASSWORD: string;
      ENTER_USERNAME: string;
      LOGIN: string;
    };
    HOME: {
      TITLE: string;
    };
  };
};

type Translations = {
  [key in Locale]: TranslationStructure;
};

const getCurrentLocale = (): Locale => {
  return "ua"; // Simulating a locale getter, e.g., from a browser or config
};

const TRANSLATIONS: Translations = {
  en: {
    NAVBAR: {
      TEAMS: "Teams",
      MATCHES: "Matches",
      TOURNAMENTS: "Tournaments",
      LOGIN: "Login",
      LOGOUT: "Logout",
      REGISTER: "Register",
    },
    PAGES: {
      LOGIN: {
        AUTH: "Authorization",
        USERNAME: "Username",
        LOGIN: "Login",
        PASSWORD: "Password",
        ENTER_PASSWORD: "Enter password!",
        ENTER_USERNAME: "Enter username!",
      },
      HOME: {
        TITLE: "Home page!!!",
      },
    },
  },
  ua: {
    NAVBAR: {
      TEAMS: "Команди",
      MATCHES: "Матчі",
      TOURNAMENTS: "Турніри",
      LOGIN: "Увійти",
      LOGOUT: "Вийти",
      REGISTER: "Зареєструватися",
    },
    PAGES: {
      LOGIN: {
        AUTH: "Авторизація",
        USERNAME: "Логін",
        LOGIN: "Увійти",
        PASSWORD: "Пароль",
        ENTER_PASSWORD: "Введіть пароль!",
        ENTER_USERNAME: "Введіть логін!",
      },
      HOME: {
        TITLE: "Ти вдома козаче :)",
      },
    },
  },
};

export const LOCALES = TRANSLATIONS[getCurrentLocale()];
