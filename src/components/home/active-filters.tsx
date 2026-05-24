import Link from "next/link";
import { messages } from "@/lib/i18n/messages";

type ActiveFiltersProps = {
  query?: string;
  city?: string;
  categoryName?: string;
  categorySlug?: string;
};

export function ActiveFilters({
  query,
  city,
  categoryName,
  categorySlug,
}: ActiveFiltersProps) {
  const hasFilters = Boolean(query || city || categorySlug);
  if (!hasFilters) return null;

  function buildClearHref(omit: "q" | "city" | "category") {
    const params = new URLSearchParams();
    if (omit !== "q" && query) params.set("q", query);
    if (omit !== "city" && city) params.set("city", city);
    if (omit !== "category" && categorySlug) {
      params.set("categorySlug", categorySlug);
    }
    const search = params.toString();
    return search ? `/?${search}` : "/";
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm text-foreground-muted">
        {messages.home.activeFilters}
      </span>
      {query ? (
        <FilterChip
          label={`${messages.home.filterQuery}: ${query}`}
          href={buildClearHref("q")}
        />
      ) : null}
      {city ? (
        <FilterChip
          label={`${messages.home.filterCity}: ${city}`}
          href={buildClearHref("city")}
        />
      ) : null}
      {categoryName && categorySlug ? (
        <FilterChip
          label={categoryName}
          href={buildClearHref("category")}
        />
      ) : null}
      <Link
        href="/"
        className="text-sm text-foreground-accent transition-colors hover:text-foreground-accent/80">
        {messages.home.clearAllFilters}
      </Link>
    </div>
  );
}

function FilterChip({ label, href }: { label: string; href: string }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1 rounded-full border border-border bg-background-surface px-3 py-1 text-xs font-medium text-foreground transition-colors hover:border-accent hover:text-foreground-accent">
      {label}
      <span aria-hidden className="text-foreground-subtle">
        ×
      </span>
    </Link>
  );
}
