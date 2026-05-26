import { HOME_FEED_LIMIT } from "@/lib/listings/home-feed";

export type CompensationType = "one_time" | "monthly" | "hourly" | "negotiable";
export type WorkMode = "onsite" | "remote" | "hybrid";
export type ListingSortBy =
  | "newest"
  | "oldest"
  | "price_asc"
  | "price_desc"
  | "popular";

export type ListingFiltersState = {
  q?: string;
  categorySlug?: string;
  groupSlug?: string;
  city?: string;
  compensationType?: CompensationType;
  minExperience?: string;
  workMode?: WorkMode;
  sortBy?: ListingSortBy;
};

export const GEORGIAN_CITIES = [
  "თბილისი",
  "ბათუმი",
  "ქუთაისი",
  "რუსთავი",
  "გორი",
  "ზუგდიდი",
  "ფოთი",
  "სამტრედია",
  "ხაშური",
  "თელავი",
] as const;

export function parseListingFilters(
  params: URLSearchParams,
): ListingFiltersState {
  const sortBy = params.get("sortBy");
  const compensationType = params.get("compensationType");
  const workMode = params.get("workMode");

  return {
    q: params.get("q") ?? undefined,
    categorySlug: params.get("categorySlug") ?? undefined,
    groupSlug: params.get("groupSlug") ?? undefined,
    city: params.get("city") ?? undefined,
    compensationType:
      compensationType === "one_time" ||
      compensationType === "monthly" ||
      compensationType === "hourly" ||
      compensationType === "negotiable"
        ? compensationType
        : undefined,
    minExperience: params.get("minExperience") ?? undefined,
    workMode:
      workMode === "onsite" || workMode === "remote" || workMode === "hybrid"
        ? workMode
        : undefined,
    sortBy:
      sortBy === "newest" ||
      sortBy === "oldest" ||
      sortBy === "price_asc" ||
      sortBy === "price_desc" ||
      sortBy === "popular"
        ? sortBy
        : undefined,
  };
}

export function filtersToSearchParams(
  filters: ListingFiltersState,
): URLSearchParams {
  const params = new URLSearchParams();
  if (filters.q) params.set("q", filters.q);
  if (filters.categorySlug) {
    params.set("categorySlug", filters.categorySlug);
  } else if (filters.groupSlug) {
    params.set("groupSlug", filters.groupSlug);
  }
  if (filters.city) params.set("city", filters.city);
  if (filters.compensationType) {
    params.set("compensationType", filters.compensationType);
  }
  if (filters.minExperience) params.set("minExperience", filters.minExperience);
  if (filters.workMode) params.set("workMode", filters.workMode);
  if (filters.sortBy) params.set("sortBy", filters.sortBy);
  return params;
}

export function buildListingsApiQuery(filters: ListingFiltersState): string {
  const params = filtersToSearchParams(filters);
  if (!params.has("limit")) params.set("limit", "24");
  if (!params.has("sortBy") && !hasFilterParams(filters)) {
    params.set("sortBy", "popular");
  }
  const query = params.toString();
  return `/api/v1/listings${query ? `?${query}` : ""}`;
}

export function buildHomeFeedQuery(): string {
  return `/api/v1/listings?limit=${HOME_FEED_LIMIT}&sortBy=popular`;
}

export function hasActiveHomeFilters(filters: ListingFiltersState): boolean {
  return Boolean(
    filters.q ||
      filters.categorySlug ||
      filters.groupSlug ||
      filters.city ||
      filters.compensationType ||
      filters.minExperience ||
      filters.workMode ||
      filters.sortBy,
  );
}

function hasFilterParams(filters: ListingFiltersState): boolean {
  return Boolean(
    filters.q ||
      filters.categorySlug ||
      filters.groupSlug ||
      filters.city ||
      filters.compensationType ||
      filters.minExperience ||
      filters.workMode,
  );
}
