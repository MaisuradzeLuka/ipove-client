export const LOCALES = ["ka", "en"] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "ka";

export const LOCALE_COOKIE = "ipove-locale";

export const LOCALE_MAX_AGE = 60 * 60 * 24 * 365;

export function isLocale(value: string | null | undefined): value is Locale {
  return value === "ka" || value === "en";
}

export const localeOptions: { value: Locale; shortLabel: string }[] = [
  { value: "ka", shortLabel: "ქარ" },
  { value: "en", shortLabel: "EN" },
];
