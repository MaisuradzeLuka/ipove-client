"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { HiOutlineXMark } from "react-icons/hi2";
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

type Option = { value: string; label: string };

const optionClass = (selected: boolean) =>
  [
    "w-full px-3 py-2 text-left text-sm transition-colors",
    "hover:bg-background-muted focus-visible:bg-background-muted focus-visible:outline-none",
    selected
      ? "bg-background-muted font-semibold text-foreground"
      : "text-foreground",
  ].join(" ");

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
  options: Option[];
  onChange: (value: string) => void;
  onClear?: () => void;
  disabled?: boolean;
  active?: boolean;
}) {
  const messages = useMessages();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const selectedLabel =
    options.find((opt) => opt.value === value)?.label ?? label;
  const showActive = active && !disabled;

  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  function selectOption(next: string) {
    onChange(next);
    setOpen(false);
  }

  return (
    <div
      ref={rootRef}
      className={`group relative min-h-13 rounded-lg border bg-background-surface transition-colors ${
        open ? "z-20" : ""
      } ${
        disabled
          ? "cursor-not-allowed border-border/60 bg-background-subtle/50 opacity-70"
          : open
            ? "border-foreground-subtle/50"
            : "border-border hover:border-foreground-subtle/50"
      }`}>
      <button
        type="button"
        disabled={disabled}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={label}
        onClick={() => setOpen((current) => !current)}
        onKeyDown={(e) => {
          if (disabled) return;
          if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setOpen(true);
          }
        }}
        className="flex h-full min-h-13 w-full flex-col justify-center px-3 py-2.5 pr-9 text-left disabled:cursor-not-allowed">
        {showActive ? (
          <>
            <span className="text-xs text-foreground-muted">{label}</span>
            <span className="truncate text-sm font-semibold text-foreground">
              {selectedLabel}
            </span>
          </>
        ) : (
          <span className="truncate text-sm text-foreground-muted">
            {disabled ? (options[0]?.label ?? label) : label}
          </span>
        )}
      </button>

      {showActive && onClear ? (
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onClear();
          }}
          className="absolute right-2.5 top-1/2 z-10 -translate-y-1/2 rounded p-0.5 text-foreground-subtle transition-colors hover:text-foreground"
          aria-label={`${label} — ${messages.filters.clear}`}>
          <HiOutlineXMark className="size-4" aria-hidden />
        </button>
      ) : !disabled ? (
        <span
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-foreground-subtle"
          aria-hidden>
          ▾
        </span>
      ) : null}

      {open && !disabled ? (
        <ul
          role="listbox"
          aria-label={label}
          className="absolute left-0 right-0 top-full z-50 mt-1 max-h-60 overflow-auto rounded-lg border border-border bg-background-surface py-1 shadow-md">
          {options.map((opt) => {
            const selected = opt.value === value;
            return (
              <li key={opt.value || "all"} role="presentation">
                <button
                  type="button"
                  role="option"
                  aria-selected={selected}
                  onClick={() => selectOption(opt.value)}
                  className={optionClass(selected)}>
                  {opt.label}
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
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

  const categoryOptions: Option[] = [
    { value: "", label: messages.filters.all },
    ...flattenCategories(categories).map((cat) => ({
      value: cat.slug,
      label: `${cat.icon} ${categoryName(cat)}`,
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
