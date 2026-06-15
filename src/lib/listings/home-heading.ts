import type { Messages } from "@/lib/i18n/get-messages";
import type { Locale } from "@/lib/i18n/locales";
import { getCategoryName } from "@/lib/categories/display";
import type { CategoryGroup } from "@/lib/categories/types";
import type { ListingFiltersState } from "@/lib/listings/filters";

export function getListingsHeading(
  filters: ListingFiltersState,
  groups: CategoryGroup[],
  total: number,
  messages: Messages,
  locale: Locale,
): { title: string; subtitle?: string } {
  if (filters.q) {
    return {
      title: messages.home.searchResults(filters.q),
      subtitle: messages.home.listingsCount(total),
    };
  }

  if (filters.categorySlug) {
    for (const group of groups) {
      const cat = group.children.find((c) => c.slug === filters.categorySlug);
      if (cat) {
        return {
          title: `${cat.icon} ${getCategoryName(cat, locale)}`,
          subtitle: messages.home.listingsCount(total),
        };
      }
    }
  }

  if (filters.groupSlug) {
    const group = groups.find((g) => g.slug === filters.groupSlug);
    if (group) {
      return {
        title: `${group.icon} ${getCategoryName(group, locale)}`,
        subtitle: messages.home.listingsCount(total),
      };
    }
  }

  const hasFilters =
    filters.city ||
    filters.compensationType ||
    filters.minExperience ||
    filters.workMode ||
    filters.sortBy;

  if (hasFilters) {
    return {
      title: messages.home.filteredListings,
      subtitle: messages.home.listingsCount(total),
    };
  }

  return {
    title: messages.home.popularListings,
    subtitle: messages.home.listingsCount(total),
  };
}
