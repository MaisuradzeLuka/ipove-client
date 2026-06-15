"use client";

import Link from "next/link";
import { HiOutlineMapPin } from "react-icons/hi2";
import { useCategoryName } from "@/contexts/locale-context";
import { ListingOwnerLink } from "@/components/users/listing-owner-link";
import {
  formatCompensation,
  formatExperienceYears,
} from "@/lib/listings/display";
import { listingCoverForListing } from "@/lib/listings/cover";
import type { Listing } from "@/lib/listings/types";

type ListingCardProps = {
  listing: Listing;
};

export function ListingCard({ listing }: ListingCardProps) {
  const categoryName = useCategoryName();
  const coverUrl = listingCoverForListing(listing);
  const compensation = formatCompensation(
    listing.hourlyRate,
    listing.compensationType,
  );
  const experience = formatExperienceYears(listing.experienceYears);

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-background-surface shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-accent/40 hover:shadow-lg">
      <Link
        href={`/listings/${listing.listingId}`}
        className="flex min-h-0 flex-1 flex-col outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset">
        <div className="relative aspect-[5/4] w-full overflow-hidden bg-background-muted">
          {coverUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={coverUrl}
              alt=""
              className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
          ) : (
            <div className="flex size-full items-center justify-center bg-gradient-to-br from-accent-soft/80 via-background-muted to-background-surface">
              <span className="text-6xl" aria-hidden>
                {listing.category.icon}
              </span>
            </div>
          )}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/50 to-transparent" />

          {compensation ? (
            <span className="absolute bottom-3 left-3 rounded-lg bg-accent px-3 py-1.5 text-sm font-bold text-foreground-on-accent shadow-md">
              {compensation}
            </span>
          ) : null}

          <span className="absolute bottom-3 right-3 inline-flex items-center gap-1 rounded-lg bg-black/55 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
            <HiOutlineMapPin className="size-3.5" aria-hidden />
            {listing.city}
          </span>
        </div>

        <div className="flex flex-col gap-2 p-4">
          <p className="text-xs font-medium text-foreground-accent">
            <span aria-hidden>{listing.category.icon}</span>{" "}
            {categoryName(listing.category)}
          </p>

          <h3 className="line-clamp-2 text-base font-semibold leading-snug text-foreground transition-colors group-hover:text-foreground-accent">
            {listing.title}
          </h3>
        </div>
      </Link>

      <div className="border-t border-border px-4 pb-4 pt-3">
        <ListingOwnerLink owner={listing.owner} subtitle={experience} />
      </div>
    </article>
  );
}
