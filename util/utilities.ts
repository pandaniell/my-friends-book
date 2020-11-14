import type { I18nMap } from "i18n";

export const loadI18nBundle = async <
  T extends keyof I18nMap,
  U extends (keyof I18nMap[T])[]
>(
  locale: T,
  namespaces: U
) => {
  const bundles = await Promise.all<[keyof I18nMap[T], I18nMap[T][U[number]]]>(
    namespaces.map(async (namespace) => {
      const json = await import(`../locales/${locale}/${namespace}.json`);

      return [namespace, json.default];
    })
  );

  return { [locale]: Object.fromEntries(bundles) };
};
