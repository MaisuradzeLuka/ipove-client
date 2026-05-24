import Link from "next/link";
import { HiOutlineMapPin } from "react-icons/hi2";
import { ListingOwnerAvatar } from "@/components/home/listing-owner-avatar";
import {
  formatExperienceYears,
  formatHourlyRate,
  listingOwnerDisplayName,
} from "@/lib/listings/display";
import { messages } from "@/lib/i18n/messages";
import type { Listing } from "@/lib/listings/types";

type ListingCardProps = {
  listing: Listing;
};

export function ListingCard({ listing }: ListingCardProps) {
  const experience = formatExperienceYears(listing.experienceYears);
  const hourlyRate = formatHourlyRate(listing.hourlyRate);

  return (
    <article className="group flex h-full flex-col rounded-xl border border-border bg-background-surface p-5 shadow-sm transition-shadow hover:shadow-md">
      <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-accent-soft px-2.5 py-1 text-xs font-medium text-foreground-accent">
        <span aria-hidden>{listing.category.icon}</span>
        {listing.category.nameKa}
      </span>

      <Link
        href={`/listings/${listing.listingId}`}
        className="mt-3 flex flex-1 flex-col rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-ring-offset">
        <h3 className="text-base font-semibold text-foreground transition-colors group-hover:text-foreground-accent">
          {listing.title}
        </h3>
        <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-foreground-muted">
          {listing.description}
        </p>
      </Link>

      <ul className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-xs text-foreground-muted">
        <li className="inline-flex items-center gap-1">
          <HiOutlineMapPin className="size-3.5 shrink-0" aria-hidden />
          {listing.city}
        </li>
        {experience ? <li>{experience}</li> : null}
        {hourlyRate ? (
          <li className="font-medium text-foreground-accent">{hourlyRate}</li>
        ) : null}
      </ul>

      {listing.skills.length > 0 ? (
        <ul className="mt-3 flex flex-wrap gap-1.5">
          {listing.skills.slice(0, 3).map((skill) => (
            <li
              key={skill}
              className="rounded-full bg-background-muted px-2 py-0.5 text-xs text-foreground-muted">
              {skill}
            </li>
          ))}
        </ul>
      ) : null}

      <footer className="mt-4 flex items-center justify-between gap-3 border-t border-border pt-4">
        <div className="flex min-w-0 items-center gap-2">
          <ListingOwnerAvatar owner={listing.owner} />
          <span className="truncate text-sm text-foreground-muted">
            {listingOwnerDisplayName(listing.owner)}
          </span>
        </div>
        <Link
          href={`/listings/${listing.listingId}`}
          className="shrink-0 rounded-lg bg-accent px-3 py-1.5 text-xs font-medium text-foreground-on-accent transition-colors hover:bg-accent-hover">
          {messages.home.viewListing}
        </Link>
      </footer>
    </article>
  );
}
