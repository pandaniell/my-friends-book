import { i18nContext } from "I18nProvider";
import { useCallback, useContext, useMemo } from "react";
import type { I18nMap } from "../types/i18n";

export function useTranslation<
  T extends keyof I18nMap[keyof I18nMap],
  U extends keyof I18nMap[keyof I18nMap][T]
>(namespace: T) {
  const context = useContext(i18nContext);

  if (!context) {
    throw Error("useTranslation hook must be called within I18nProvider.");
  }

  const t = useCallback(
    (key: U) => context.resources[context.locale][namespace][key],
    [namespace, context]
  );

  return useMemo(() => ({ t, locale: context.locale }), [context, namespace]);
}
