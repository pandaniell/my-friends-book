import type { I18nMap } from "types/i18n";

export const loadI18nBundle = async <
  T extends keyof I18nMap,
  U extends (keyof I18nMap[T])[]
>(
  language: T,
  namespaces: U
) => {
  const chosenLanguage = ["en", "nl"].includes(language) ? language : "en";

  const bundles = await Promise.all<[keyof I18nMap[T], I18nMap[T][U[number]]]>(
    namespaces.map(async (namespace) => {
      const json = await import(
        `../locales/${chosenLanguage}/${namespace}.json`
      );

      return [namespace, json.default];
    })
  );

  return { [language]: Object.fromEntries(bundles) };
};
