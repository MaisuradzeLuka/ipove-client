"use client";

import Link from "next/link";
import { HiOutlineArrowRight } from "react-icons/hi2";
import { ListingCard } from "@/components/home/listing-card";
import { useCategoryName, useMessages } from "@/contexts/locale-context";
import type { CategoryListingSection } from "@/lib/listings/home-feed";

type CategorySectionsFeedProps = {
  sections: CategoryListingSection[];
};

export function CategorySectionsFeed({ sections }: CategorySectionsFeedProps) {
  const messages = useMessages();
  const categoryName = useCategoryName();

  if (sections.length === 0) {
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
    <div className="space-y-12">
      {sections.map(({ group, listings }) => (
        <section
          key={group.slug}
          id={`section-${group.slug}`}
          aria-labelledby={`section-heading-${group.slug}`}
          className="scroll-mt-28">
          <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
            <div className="min-w-0">
              <h2
                id={`section-heading-${group.slug}`}
                className="text-base font-semibold leading-snug tracking-tight text-foreground sm:text-xl md:text-2xl">
                <span className="text-lg sm:text-xl" aria-hidden>
                  {group.icon}
                </span>{" "}
                {categoryName(group)}
              </h2>
              <p className="mt-1 text-sm text-foreground-muted">
                {messages.home.listingsCount(listings.length)}
              </p>
            </div>
            <Link
              href={`/?groupSlug=${encodeURIComponent(group.slug)}`}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm font-medium text-foreground-accent transition-colors hover:text-accent-hover">
              {messages.home.seeAll}
              <HiOutlineArrowRight className="size-4" aria-hidden />
            </Link>
          </div>

          <ul className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {listings.map((listing) => (
              <li key={listing.listingId} className="h-full">
                <ListingCard listing={listing} />
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
