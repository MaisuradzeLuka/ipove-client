import Link from "next/link";
import { HiOutlineArrowLeft, HiOutlineMapPin } from "react-icons/hi2";
import { ListingOwnerAvatar } from "@/components/home/listing-owner-avatar";
import {
  formatExperienceYears,
  formatHourlyRate,
  listingOwnerDisplayName,
} from "@/lib/listings/display";
import { messages } from "@/lib/i18n/messages";
import type { Listing } from "@/lib/listings/types";

type ListingDetailViewProps = {
  listing: Listing;
  isOwner?: boolean;
};

function ListingHeaderTop({
  listing,
  isOwner,
}: {
  listing: Listing;
  isOwner?: boolean;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-soft px-3 py-1 text-sm font-medium text-foreground-accent">
        <span aria-hidden>{listing.category.icon}</span>
        {listing.category.nameKa}
      </span>
      {isOwner && listing.status !== "active" ? (
        <span className="rounded-full bg-warning-soft px-3 py-1 text-xs font-medium text-warning-foreground">
          {messages.listingDetail.statusLabel(listing.status)}
        </span>
      ) : null}
    </div>
  );
}

export function ListingDetailView({ listing, isOwner }: ListingDetailViewProps) {
  const experience = formatExperienceYears(listing.experienceYears);
  const hourlyRate = formatHourlyRate(listing.hourlyRate);

  return (
    <article>
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-foreground-accent transition-colors hover:text-accent-hover">
        <HiOutlineArrowLeft className="size-4" aria-hidden />
        {messages.listingDetail.backHome}
      </Link>

      <header className="mt-6 rounded-2xl border border-border bg-background-surface p-6 sm:p-8">
        <ListingHeaderTop listing={listing} isOwner={isOwner} />

        <h1 className="mt-4 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          {listing.title}
        </h1>

        <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm text-foreground-muted">
          <li className="inline-flex items-center gap-1.5">
            <HiOutlineMapPin className="size-4 shrink-0" aria-hidden />
            {listing.city}
          </li>
          {experience ? <li>{experience}</li> : null}
          {hourlyRate ? (
            <li className="font-medium text-foreground-accent">{hourlyRate}</li>
          ) : null}
        </ul>

        <div className="mt-6 flex items-center gap-3 border-t border-border pt-6">
          <ListingOwnerAvatar owner={listing.owner} size="md" />
          <div>
            <p className="font-medium text-foreground">
              {listingOwnerDisplayName(listing.owner)}
            </p>
            <p className="text-sm text-foreground-muted">
              {messages.listingDetail.professional}
            </p>
          </div>
        </div>
      </header>

      <section className="mt-8">
        <h2 className="text-lg font-semibold text-foreground">
          {messages.listingDetail.about}
        </h2>
        <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-foreground-muted sm:text-base">
          {listing.description}
        </p>
      </section>

      {listing.skills.length > 0 ? (
        <section className="mt-8">
          <h2 className="text-lg font-semibold text-foreground">
            {messages.listingDetail.skills}
          </h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {listing.skills.map((skill) => (
              <li
                key={skill}
                className="rounded-full bg-accent-soft px-3 py-1 text-sm font-medium text-foreground-accent">
                {skill}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {listing.examples.length > 0 ? (
        <section className="mt-8">
          <h2 className="text-lg font-semibold text-foreground">
            {messages.listingDetail.portfolio}
          </h2>
          <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {listing.examples.map((url) => (
              <li key={url}>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block overflow-hidden rounded-xl border border-border bg-background-surface transition-shadow hover:shadow-md">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={url}
                    alt=""
                    className="aspect-video w-full object-cover"
                  />
                </a>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="mt-10 rounded-xl border border-border bg-background-muted px-6 py-8 text-center">
        <p className="text-sm text-foreground-muted">
          {messages.listingDetail.contactHint}
        </p>
        {isOwner ? (
          <Link
            href={`/dashboard/listings/${listing.listingId}/edit`}
            className="mt-4 inline-flex rounded-lg bg-accent px-4 py-2 text-sm font-medium text-foreground-on-accent transition-colors hover:bg-accent-hover">
            {messages.listingDetail.editOwn}
          </Link>
        ) : null}
      </section>
    </article>
  );
}
