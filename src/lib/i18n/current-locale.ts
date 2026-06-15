import {
  DEFAULT_LOCALE,
  type Locale,
} from "@/lib/i18n/locales";

let currentLocale: Locale = DEFAULT_LOCALE;

export function getCurrentLocale(): Locale {
  return currentLocale;
}

export function setCurrentLocale(locale: Locale): void {
  currentLocale = locale;
}
