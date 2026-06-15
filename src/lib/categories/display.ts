import type { Locale } from "@/lib/i18n/locales";

export type LocalizedCategoryName = {
  nameKa: string;
  nameEn: string;
};

export function getCategoryName(
  category: LocalizedCategoryName,
  locale: Locale,
): string {
  if (locale === "en") {
    return category.nameEn || category.nameKa;
  }
  return category.nameKa;
}
