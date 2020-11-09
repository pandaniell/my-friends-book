import type { I18nMap } from "i18n";
import { createContext, PropsWithChildren, useEffect } from "react";

export interface I18nContext {
  locale: keyof I18nMap;
  resources: Record<keyof I18nMap, I18nMap[keyof I18nMap]>;
}

export const i18nContext = createContext<I18nContext | null>(null);

export const I18nProvider = ({
  children,
  locale,
  resources,
}: PropsWithChildren<I18nContext>) => {
  useEffect(() => {
    const html = document.querySelector("html");

    if (html) {
      /**
       * @see https://meta.wikimedia.org/wiki/Template:List_of_language_names_ordered_by_code
       */
      const RTL_LANGUAGES = [
        "ar", // Arabic
        "arc", // Aramaic
        "dv", // Divehi
        "fa", // Persian
        "ha", // Hakka Chinese
        "he", // Hebrew
        "khw", // Khowar
        "ks", // Kashmiri
        "ku", // Kurdish
        "ps", // Pashto
        "ur", // Urdu
        "yi", // Yiddish
      ];

      html.setAttribute("lang", locale);
      html.setAttribute("dir", RTL_LANGUAGES.includes(locale) ? "rtl" : "ltr");
      html.setAttribute("lang", locale);
    }
  }, [locale]);

  useEffect(() => {
    document.cookie = `NEXT_LOCALE=${locale}; max-age=31536000; path=/`;
  }, [locale]);

  return (
    <i18nContext.Provider value={{ locale, resources }}>
      {children}
    </i18nContext.Provider>
  );
};
