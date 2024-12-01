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
  TEAM_MEMBER_ROLE: {
    OWNER: string;
    ADMIN: string;
    MEMBER: string;
    RESERVED: string;
  }
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
    TEAMS: {
      ALL_TEAMS: string;
      MY_TEAMS: string;
      MEMBERS: string;
      MATCHES: string;
      TOURNAMENTS: string;
      CREATE_TEAM: string;
      TEAM_NOT_SELECTED: string;
      NAME: string;
      ENTER_TEAM_NAME: string;
      ADD_MEMBER: string;
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
    TEAM_MEMBER_ROLE: {
      OWNER: "Owner",
      ADMIN: "Admin",
      MEMBER: "Member",
      RESERVED: "Reserved",
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
      TEAMS: {
        ALL_TEAMS: "All teams",
        MY_TEAMS: "My teams",
        MEMBERS: "Members",
        MATCHES: "Matches",
        TOURNAMENTS: "Tournaments",
        CREATE_TEAM: "Create team",
        TEAM_NOT_SELECTED: "Team not selected",
        NAME: "Name",
        ENTER_TEAM_NAME: "Enter team name!",
        ADD_MEMBER: "Add member",
      }
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
    TEAM_MEMBER_ROLE: {
      OWNER: "Власник",
      ADMIN: "Адмін",
      MEMBER: "Учасник",
      RESERVED: "Резезервний",
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
      TEAMS: {
        ALL_TEAMS: "Всі команди",
        MY_TEAMS: "Мої команди",
        MEMBERS: "Учасники",
        MATCHES: "Матчі",
        TOURNAMENTS: "Турніри",
        CREATE_TEAM: "Створити команду",
        TEAM_NOT_SELECTED: "Команда не вибрана",
        NAME: "Назва",
        ENTER_TEAM_NAME: "Введіть назву команди!",
        ADD_MEMBER: "Додати учасника",
      }
    },
  },
};

export const LOCALES = TRANSLATIONS[getCurrentLocale()];
