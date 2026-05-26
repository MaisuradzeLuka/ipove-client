"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { HiOutlineXMark } from "react-icons/hi2";
import type { CategoryGroup } from "@/lib/categories/types";
import { messages } from "@/lib/i18n/messages";
import {
  filtersToSearchParams,
  GEORGIAN_CITIES,
  type ListingFiltersState,
} from "@/lib/listings/filters";

type ListingFiltersProps = {
  categories: CategoryGroup[];
  filters: ListingFiltersState;
};

type Option = { value: string; label: string };

function FilterSelect({
  label,
  value,
  options,
  onChange,
  disabled = false,
  active = false,
}: {
  label: string;
  value: string;
  options: Option[];
  onChange: (value: string) => void;
  disabled?: boolean;
  active?: boolean;
}) {
  return (
    <label
      className={`group flex flex-col gap-1.5 rounded-xl border p-3 transition-all duration-200 ${
        disabled
          ? "cursor-not-allowed border-border/60 bg-background-subtle/50 opacity-70"
          : active
            ? "border-accent/50 bg-accent-soft/40 shadow-sm ring-1 ring-accent/20"
            : "border-border bg-background-surface shadow-xs hover:border-accent/30 hover:shadow-sm"
      }`}>
      <span className="text-xs font-medium text-foreground-muted">{label}</span>
      <div className="relative">
        <select
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          className="h-8 w-full cursor-pointer appearance-none truncate rounded-md border-0 bg-transparent pr-7 text-sm font-medium text-foreground outline-none disabled:cursor-not-allowed"
          aria-label={label}>
          {options.map((opt) => (
            <option key={opt.value || "all"} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {!disabled ? (
          <span
            className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-foreground-subtle transition-colors group-hover:text-foreground-accent"
            aria-hidden>
            ▾
          </span>
        ) : null}
      </div>
    </label>
  );
}

function flattenCategories(groups: CategoryGroup[]) {
  return groups.flatMap((group) => group.children);
}

export function ListingFilters({ categories, filters }: ListingFiltersProps) {
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

  const categoryOptions: Option[] = [
    { value: "", label: messages.filters.all },
    ...flattenCategories(categories).map((cat) => ({
      value: cat.slug,
      label: `${cat.icon} ${cat.nameKa}`,
    })),
  ];

  const cityOptions: Option[] = [
    { value: "", label: messages.filters.all },
    ...GEORGIAN_CITIES.map((city) => ({ value: city, label: city })),
  ];

  const compensationOptions: Option[] = [
    { value: "", label: messages.filters.all },
    { value: "one_time", label: messages.filters.compensationOneTime },
    { value: "monthly", label: messages.filters.compensationMonthly },
    { value: "hourly", label: messages.filters.compensationHourly },
    { value: "negotiable", label: messages.filters.compensationNegotiable },
  ];

  const experienceOptions: Option[] = [
    { value: "", label: messages.filters.all },
    { value: "1", label: messages.filters.experience1 },
    { value: "3", label: messages.filters.experience3 },
    { value: "5", label: messages.filters.experience5 },
    { value: "10", label: messages.filters.experience10 },
  ];

  const sortOptions: Option[] = [
    { value: "popular", label: messages.filters.sortPopular },
    { value: "newest", label: messages.filters.sortNewest },
    { value: "oldest", label: messages.filters.sortOldest },
    { value: "price_asc", label: messages.filters.sortPriceAsc },
    { value: "price_desc", label: messages.filters.sortPriceDesc },
  ];

  const workModeOptions: Option[] = [
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
      <div className="mx-auto max-w-6xl space-y-3 px-6 py-5">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <FilterSelect
            label={messages.filters.category}
            value={filters.categorySlug ?? ""}
            options={categoryOptions}
            active={Boolean(filters.categorySlug)}
            onChange={(categorySlug) =>
              update({ categorySlug: categorySlug || undefined })
            }
          />
          <FilterSelect
            label={messages.filters.city}
            value={filters.city ?? ""}
            options={cityOptions}
            active={Boolean(filters.city)}
            onChange={(city) => update({ city: city || undefined })}
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
          />
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <FilterSelect
            label={messages.filters.experience}
            value={filters.minExperience ?? ""}
            options={experienceOptions}
            active={Boolean(filters.minExperience)}
            onChange={(minExperience) =>
              update({ minExperience: minExperience || undefined })
            }
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
          />
          <FilterSelect
            label={messages.filters.rating}
            value=""
            options={[{ value: "", label: messages.filters.ratingSoon }]}
            onChange={() => undefined}
            disabled
          />
        </div>

        {hasActiveFilters ? (
          <div className="flex justify-end pt-1">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background-surface px-3.5 py-2 text-sm font-medium text-foreground-muted shadow-xs transition-all hover:border-error/40 hover:bg-error-soft/30 hover:text-error-foreground">
              <HiOutlineXMark className="size-4" aria-hidden />
              {messages.filters.clear}
            </Link>
          </div>
        ) : null}
      </div>
    </section>
  );
}
