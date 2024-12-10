import {useTranslation} from "react-i18next";

export const HomePage = () => {
  const { t }: { t: (key: string, options?: object) => string } = useTranslation()

  return (
    <div className="flex h-screen">
      <p className="mx-auto my-auto">{t("PAGES.HOME.TITLE")}</p>
    </div>
  );
};
