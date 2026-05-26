import { HomeBrowseFeed } from "@/components/home/home-browse-feed";
import { ListingFilters } from "@/components/home/listing-filters";
import { ListingGrid } from "@/components/home/listing-grid";
import { serverFetch } from "@/lib/api/server";
import type { CategoriesResponse } from "@/lib/categories/types";
import { messages } from "@/lib/i18n/messages";
import {
  buildHomeFeedQuery,
  buildListingsApiQuery,
  hasActiveHomeFilters,
  type ListingFiltersState,
} from "@/lib/listings/filters";
import { groupListingsByCategory } from "@/lib/listings/home-feed";
import { getListingsHeading } from "@/lib/listings/home-heading";
import type { ListingsResponse } from "@/lib/listings/types";

type HomePageProps = {
  searchParams: Promise<ListingFiltersState & { q?: string }>;
};

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const filters: ListingFiltersState = {
    q: params.q,
    categorySlug: params.categorySlug,
    groupSlug: params.groupSlug,
    city: params.city,
    compensationType: params.compensationType,
    minExperience: params.minExperience,
    workMode: params.workMode,
    sortBy: params.sortBy,
  };

  const browseMode = !hasActiveHomeFilters(filters);
  let categories: CategoriesResponse = { groups: [] };
  let listings: ListingsResponse = {
    listings: [],
    page: 1,
    limit: 20,
    total: 0,
  };
  let loadError = false;

  try {
    if (browseMode) {
      [categories, listings] = await Promise.all([
        serverFetch<CategoriesResponse>("/api/v1/categories"),
        serverFetch<ListingsResponse>(buildHomeFeedQuery()),
      ]);
    } else {
      [categories, listings] = await Promise.all([
        serverFetch<CategoriesResponse>("/api/v1/categories"),
        serverFetch<ListingsResponse>(buildListingsApiQuery(filters)),
      ]);
    }
  } catch {
    loadError = true;
  }

  const heading = getListingsHeading(
    filters,
    categories.groups,
    listings.total,
  );
  const sections = groupListingsByCategory(
    listings.listings,
    categories.groups,
  );

  return (
    <>
      <ListingFilters categories={categories.groups} filters={filters} />

      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-8">
        {loadError ? (
          <div
            role="alert"
            className="rounded-xl border border-error/30 bg-error-soft px-6 py-8 text-center">
            <p className="font-medium text-error-foreground">
              {messages.home.loadError}
            </p>
            <p className="mt-2 text-sm text-error-foreground/80">
              {messages.home.loadErrorHint}
            </p>
          </div>
        ) : browseMode ? (
          <HomeBrowseFeed groups={categories.groups} sections={sections} />
        ) : (
          <ListingGrid
            listings={listings.listings}
            title={heading.title}
            subtitle={heading.subtitle}
          />
        )}
      </main>
    </>
  );
}
