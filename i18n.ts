import common from "locales/en/common.json";
import greetings from "locales/en/greetings.json";
export type I18nMap = Record<typeof locales[number], I18nNamespace>;
export interface I18nNamespace {
    common: typeof common;
    greetings: typeof greetings;
}
export const locales = (["en", "nl"] as const);
