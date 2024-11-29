import { LOCALES } from "../../locales";

/**
 * Use arow functions. I just like them more
 */
export const HomePage = () => {
  return (
    <div className="flex h-screen">
      <p className="mx-auto my-auto">{LOCALES.PAGES.HOME.TITLE}</p>
    </div>
  );
};
