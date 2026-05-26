import type { CategoryGroup } from "@/lib/categories/types";
import type { Listing } from "@/lib/listings/types";

export const HOME_SECTION_SIZE = 4;
export const HOME_FEED_LIMIT = 50;

export type CategoryListingSection = {
  group: CategoryGroup;
  listings: Listing[];
};

export function groupListingsByCategory(
  listings: Listing[],
  groups: CategoryGroup[],
  perSection = HOME_SECTION_SIZE,
): CategoryListingSection[] {
  const slugToGroup = new Map<string, CategoryGroup>();
  for (const group of groups) {
    for (const child of group.children) {
      slugToGroup.set(child.slug, group);
    }
  }

  const buckets = new Map<string, Listing[]>();
  for (const group of groups) {
    buckets.set(group.slug, []);
  }

  for (const listing of listings) {
    const group = slugToGroup.get(listing.category.slug);
    if (!group) continue;
    buckets.get(group.slug)?.push(listing);
  }

  return groups
    .map((group) => ({
      group,
      listings: (buckets.get(group.slug) ?? [])
        .sort((a, b) => b.viewCount - a.viewCount)
        .slice(0, perSection),
    }))
    .filter((section) => section.listings.length > 0);
}

export function findCategoryGroup(
  groups: CategoryGroup[],
  slug: string | undefined,
): CategoryGroup | undefined {
  if (!slug) return undefined;
  return groups.find((group) => group.slug === slug);
}
