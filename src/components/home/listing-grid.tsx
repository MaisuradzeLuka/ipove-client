import { ListingCard } from "@/components/home/listing-card";
import { messages } from "@/lib/i18n/messages";
import type { Listing } from "@/lib/listings/types";

type ListingGridProps = {
  listings: Listing[];
  total: number;
};

export function ListingGrid({ listings, total }: ListingGridProps) {
  if (listings.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-background-muted/50 px-6 py-16 text-center">
        <p className="text-base font-medium text-foreground">
          {messages.home.noListings}
        </p>
        <p className="mt-2 text-sm text-foreground-muted">
          {messages.home.noListingsHint}
        </p>
      </div>
    );
  }

  return (
    <section aria-labelledby="listings-heading">
      <div className="flex items-baseline justify-between gap-4">
        <h2
          id="listings-heading"
          className="text-lg font-semibold text-foreground">
          {messages.home.listingsTitle}
        </h2>
        <p className="text-sm text-foreground-muted">
          {messages.home.listingsCount(total)}
        </p>
      </div>
      <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {listings.map((listing) => (
          <li key={listing.listingId}>
            <ListingCard listing={listing} />
          </li>
        ))}
      </ul>
    </section>
  );
}
