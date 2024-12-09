import { LOCALES } from "../../locales";

export const HomePage = () => {
  return (
    <div className="flex h-screen">
      <p className="mx-auto my-auto">{t("PAGES.HOME.TITLE")}</p>
    </div>
  );
};
