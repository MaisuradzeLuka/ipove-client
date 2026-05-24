import { ActiveFilters } from "@/components/home/active-filters";
import {
  CategoryGrid,
  findCategoryBySlug,
} from "@/components/home/category-grid";
import { HeroSearch } from "@/components/home/hero-search";
import { ListingGrid } from "@/components/home/listing-grid";
import { serverFetch } from "@/lib/api/server";
import type { CategoriesResponse } from "@/lib/categories/types";
import { messages } from "@/lib/i18n/messages";
import type { ListingsResponse } from "@/lib/listings/types";

type HomePageProps = {
  searchParams: Promise<{
    q?: string;
    city?: string;
    categorySlug?: string;
  }>;
};

function buildListingsPath(params: {
  q?: string;
  city?: string;
  categorySlug?: string;
}) {
  const search = new URLSearchParams();
  if (params.q) search.set("q", params.q);
  if (params.city) search.set("city", params.city);
  if (params.categorySlug) search.set("categorySlug", params.categorySlug);
  const query = search.toString();
  return `/api/v1/listings${query ? `?${query}` : ""}`;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const { q, city, categorySlug } = await searchParams;

  let categories: CategoriesResponse = { groups: [] };
  let listings: ListingsResponse = {
    listings: [],
    page: 1,
    limit: 20,
    total: 0,
  };
  let loadError = false;

  try {
    [categories, listings] = await Promise.all([
      serverFetch<CategoriesResponse>("/api/v1/categories"),
      serverFetch<ListingsResponse>(
        buildListingsPath({ q, city, categorySlug }),
      ),
    ]);
  } catch {
    loadError = true;
  }

  const activeCategory = findCategoryBySlug(categories.groups, categorySlug);

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-8 sm:py-10">
      <HeroSearch
        initialQuery={q ?? ""}
        initialCity={city ?? ""}
        categorySlug={categorySlug}
      />

      {loadError ? (
        <div
          role="alert"
          className="mt-8 rounded-xl border border-error/30 bg-error-soft px-6 py-8 text-center">
          <p className="font-medium text-error-foreground">
            {messages.home.loadError}
          </p>
          <p className="mt-2 text-sm text-error-foreground/80">
            {messages.home.loadErrorHint}
          </p>
        </div>
      ) : (
        <>
          <div className="mt-10">
            <ActiveFilters
              query={q}
              city={city}
              categorySlug={categorySlug}
              categoryName={activeCategory?.nameKa}
            />
          </div>

          <div className="mt-10">
            <CategoryGrid
              groups={categories.groups}
              activeCategorySlug={categorySlug}
            />
          </div>

          <div className="mt-12">
            <ListingGrid
              listings={listings.listings}
              total={listings.total}
            />
          </div>
        </>
      )}
    </main>
  );
}
