import common from "locales/en/common.json";
import greetings from "locales/en/greetings.json";
export const locales = ["en", "nl"] as const;
export type I18nMap = Record<
  typeof locales[number],
  {
    common: typeof common;
    greetings: typeof greetings;
  }
>;
