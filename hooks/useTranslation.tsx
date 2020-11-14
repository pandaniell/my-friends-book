import type { I18nNamespace } from "i18n";
import { i18nContext } from "I18nProvider";
import { useCallback, useContext, useMemo } from "react";

type GetI18nKeys<T> = T extends keyof I18nNamespace
  ? `${T}:${Extract<keyof I18nNamespace[T], string>}`
  : never;

// @TODO: Infer interpolation when "json as const" support ever comes to TypeScript
const interpolate = (translation: string, interpolation: object) => {
  return Object.entries(interpolation).reduce(
    (originalTranslation, [key, value]) => {
      const placeholder = `{{${key}}}`;
      const keyInTranslation = originalTranslation.includes(placeholder);

      if (keyInTranslation) {
        return originalTranslation.replace(placeholder, `${value}`);
      }

      return originalTranslation;
    },
    translation
  );
};

// @TODO: Make return type more explicit
export const useTranslation = <
  T extends keyof I18nNamespace,
  U extends T | T[]
>(
  _ns: U
) => {
  const context = useContext(i18nContext);

  if (!context) {
    throw Error("useTranslation hook must be called within I18nProvider.");
  }

  const { locale, resources } = context;
  const namespace: keyof I18nNamespace | Array<keyof I18nNamespace> = _ns;

  const t = useCallback(
    (
      key: U extends T
        ? string & keyof I18nNamespace[U]
        : GetI18nKeys<U extends (infer V)[] ? V : never>,
      interpolation?: object
    ) => {
      let translation: string;

      if (!Array.isArray(namespace)) {
        const match = resources[locale][namespace]![
          key as keyof I18nNamespace[keyof I18nNamespace]
        ];

        translation = match ?? key;
      } else {
        const [nsKey, nsValue] = key.split(":") as [
          keyof I18nNamespace,
          keyof I18nNamespace[keyof I18nNamespace]
        ];

        translation = resources[locale][nsKey]![nsValue];
      }

      return interpolation
        ? interpolate(translation, interpolation)
        : translation;
    },
    [namespace, context]
  );

  return useMemo(() => ({ t, locale: context.locale }), [context, namespace]);
};
