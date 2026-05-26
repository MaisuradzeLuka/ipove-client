import { ListingCard } from "@/components/home/listing-card";
import { messages } from "@/lib/i18n/messages";
import type { Listing } from "@/lib/listings/types";

type ListingGridProps = {
  listings: Listing[];
  title: string;
  subtitle?: string;
};

export function ListingGrid({ listings, title, subtitle }: ListingGridProps) {
  if (listings.length === 0) {
    return (
      <section>
        <header className="mb-6">
          <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
            {title}
          </h2>
          {subtitle ? (
            <p className="mt-1 text-sm text-foreground-muted">{subtitle}</p>
          ) : null}
        </header>
        <div className="rounded-xl border border-dashed border-border bg-background-muted/50 px-6 py-16 text-center">
          <p className="text-base font-medium text-foreground">
            {messages.home.noListings}
          </p>
          <p className="mt-2 text-sm text-foreground-muted">
            {messages.home.noListingsHint}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section aria-labelledby="listings-heading">
      <header className="mb-6">
        <h2
          id="listings-heading"
          className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
          {title}
        </h2>
        {subtitle ? (
          <p className="mt-1 text-sm text-foreground-muted">{subtitle}</p>
        ) : null}
      </header>

      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {listings.map((listing) => (
          <li key={listing.listingId} className="h-full">
            <ListingCard listing={listing} />
          </li>
        ))}
      </ul>
    </section>
  );
}
