"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { HiOutlineXMark } from "react-icons/hi2";
import { Select, type SelectOption } from "@/components/select";
import type { CategoryGroup } from "@/lib/categories/types";
import { useCategoryName, useMessages } from "@/contexts/locale-context";
import {
  filtersToSearchParams,
  GEORGIAN_CITIES,
  type ListingFiltersState,
} from "@/lib/listings/filters";

type ListingFiltersProps = {
  categories: CategoryGroup[];
  filters: ListingFiltersState;
};

function FilterSelect({
  label,
  value,
  options,
  onChange,
  onClear,
  disabled = false,
  active = false,
}: {
  label: string;
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  onClear?: () => void;
  disabled?: boolean;
  active?: boolean;
}) {
  const messages = useMessages();

  return (
    <Select
      variant="filter"
      label={label}
      value={value}
      options={options}
      disabled={disabled}
      active={active}
      clearLabel={`${label} — ${messages.filters.clear}`}
      onChange={onChange}
      onClear={onClear}
    />
  );
}

function flattenCategories(groups: CategoryGroup[]) {
  return groups.flatMap((group) => group.children);
}

export function ListingFilters({ categories, filters }: ListingFiltersProps) {
  const messages = useMessages();
  const categoryName = useCategoryName();
  const router = useRouter();

  const applyFilters = useCallback(
    (next: ListingFiltersState) => {
      const params = filtersToSearchParams(next);
      const search = params.toString();
      router.push(search ? `/?${search}` : "/");
    },
    [router],
  );

  function update(partial: Partial<ListingFiltersState>) {
    applyFilters({ ...filters, ...partial });
  }

  const categoryOptions: SelectOption[] = [
    { value: "", label: messages.filters.all },
    ...flattenCategories(categories).map((cat) => ({
      value: cat.slug,
      label: `${cat.icon} ${categoryName(cat)}`,
    })),
  ];

  const cityOptions: SelectOption[] = [
    { value: "", label: messages.filters.all },
    ...GEORGIAN_CITIES.map((city) => ({ value: city, label: city })),
  ];

  const compensationOptions: SelectOption[] = [
    { value: "", label: messages.filters.all },
    { value: "one_time", label: messages.filters.compensationOneTime },
    { value: "monthly", label: messages.filters.compensationMonthly },
    { value: "hourly", label: messages.filters.compensationHourly },
    { value: "negotiable", label: messages.filters.compensationNegotiable },
  ];

  const experienceOptions: SelectOption[] = [
    { value: "", label: messages.filters.all },
    { value: "1", label: messages.filters.experience1 },
    { value: "3", label: messages.filters.experience3 },
    { value: "5", label: messages.filters.experience5 },
    { value: "10", label: messages.filters.experience10 },
  ];

  const sortOptions: SelectOption[] = [
    { value: "popular", label: messages.filters.sortPopular },
    { value: "newest", label: messages.filters.sortNewest },
    { value: "oldest", label: messages.filters.sortOldest },
    { value: "price_asc", label: messages.filters.sortPriceAsc },
    { value: "price_desc", label: messages.filters.sortPriceDesc },
  ];

  const workModeOptions: SelectOption[] = [
    { value: "", label: messages.filters.all },
    { value: "onsite", label: messages.filters.workModeOnsite },
    { value: "remote", label: messages.filters.workModeRemote },
    { value: "hybrid", label: messages.filters.workModeHybrid },
  ];

  const hasActiveFilters = Boolean(
    filters.q ||
    filters.categorySlug ||
    filters.groupSlug ||
    filters.city ||
    filters.compensationType ||
    filters.minExperience ||
    filters.workMode ||
    filters.sortBy,
  );

  const sortValue = filters.sortBy ?? "popular";

  return (
    <section
      aria-label={messages.home.activeFilters}
      className="border-b border-border bg-background-muted/40">
      <div className="mx-auto max-w-6xl px-6 py-4">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          <FilterSelect
            label={messages.filters.category}
            value={filters.categorySlug ?? ""}
            options={categoryOptions}
            active={Boolean(filters.categorySlug)}
            onChange={(categorySlug) =>
              update({ categorySlug: categorySlug || undefined })
            }
            onClear={() => update({ categorySlug: undefined })}
          />
          <FilterSelect
            label={messages.filters.city}
            value={filters.city ?? ""}
            options={cityOptions}
            active={Boolean(filters.city)}
            onChange={(city) => update({ city: city || undefined })}
            onClear={() => update({ city: undefined })}
          />
          <FilterSelect
            label={messages.filters.compensation}
            value={filters.compensationType ?? ""}
            options={compensationOptions}
            active={Boolean(filters.compensationType)}
            onChange={(compensationType) =>
              update({
                compensationType:
                  compensationType === ""
                    ? undefined
                    : (compensationType as ListingFiltersState["compensationType"]),
              })
            }
            onClear={() => update({ compensationType: undefined })}
          />
          <FilterSelect
            label={messages.filters.experience}
            value={filters.minExperience ?? ""}
            options={experienceOptions}
            active={Boolean(filters.minExperience)}
            onChange={(minExperience) =>
              update({ minExperience: minExperience || undefined })
            }
            onClear={() => update({ minExperience: undefined })}
          />
          <FilterSelect
            label={messages.filters.workMode}
            value={filters.workMode ?? ""}
            options={workModeOptions}
            active={Boolean(filters.workMode)}
            onChange={(workMode) =>
              update({
                workMode:
                  workMode === ""
                    ? undefined
                    : (workMode as ListingFiltersState["workMode"]),
              })
            }
            onClear={() => update({ workMode: undefined })}
          />
          <FilterSelect
            label={messages.filters.sortBy}
            value={sortValue}
            options={sortOptions}
            active={Boolean(filters.sortBy && filters.sortBy !== "popular")}
            onChange={(sortBy) =>
              update({
                sortBy:
                  sortBy === "popular"
                    ? undefined
                    : (sortBy as ListingFiltersState["sortBy"]),
              })
            }
            onClear={() => update({ sortBy: undefined })}
          />
        </div>

        {hasActiveFilters ? (
          <div className="mt-3 flex justify-end">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground-muted transition-colors hover:text-error-foreground">
              <HiOutlineXMark className="size-4" aria-hidden />
              {messages.filters.clear}
            </Link>
          </div>
        ) : null}
      </div>
    </section>
  );
}
