"use client";

import Link from "next/link";
import { HiOutlineArrowLeft, HiOutlineMapPin } from "react-icons/hi2";
import { ListingContactSection } from "@/components/listings/listing-contact-section";
import { ListingLocationSection } from "@/components/listings/listing-location-section";
import { ListingOwnerLink } from "@/components/users/listing-owner-link";
import { useCategoryName, useMessages } from "@/contexts/locale-context";
import {
  formatCompensation,
  formatExperienceYears,
  formatWorkMode,
} from "@/lib/listings/display";
import { listingCoverForListing } from "@/lib/listings/cover";
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
  const messages = useMessages();
  const categoryName = useCategoryName();

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-soft px-3 py-1 text-sm font-medium text-foreground-accent">
        <span aria-hidden>{listing.category.icon}</span>
        {categoryName(listing.category)}
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
  const messages = useMessages();
  const coverUrl = listingCoverForListing(listing);
  const experience = formatExperienceYears(listing.experienceYears);
  const compensation = formatCompensation(
    listing.hourlyRate,
    listing.compensationType,
  );
  const workMode = formatWorkMode(listing.workMode);

  return (
    <article>
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-foreground-accent transition-colors hover:text-accent-hover">
        <HiOutlineArrowLeft className="size-4" aria-hidden />
        {messages.listingDetail.backHome}
      </Link>

      {coverUrl || listing.examples.length > 0 ? (
        <section className="mt-6 overflow-hidden rounded-2xl border border-border bg-background-surface">
          {coverUrl ? (
            <div className="relative aspect-[21/9] overflow-hidden sm:aspect-[2.5/1]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={coverUrl}
                alt=""
                className="size-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            </div>
          ) : null}

          {listing.examples.length > 1 ? (
            <ul className="grid grid-cols-3 gap-1 p-1 sm:grid-cols-6">
              {listing.examples.map((url) => (
                <li key={url} className="overflow-hidden rounded-lg">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={url}
                    alt=""
                    className="aspect-square w-full object-cover"
                  />
                </li>
              ))}
            </ul>
          ) : null}
        </section>
      ) : null}

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
          {compensation ? (
            <li className="font-medium text-foreground-accent">{compensation}</li>
          ) : null}
          <li>{workMode}</li>
        </ul>

        <div className="mt-6 border-t border-border pt-6">
          <ListingOwnerLink
            owner={listing.owner}
            subtitle={messages.listingDetail.professional}
            size="md"
            className="-mx-2 px-2 py-2"
          />
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

      <ListingLocationSection listing={listing} />

      <ListingContactSection
        owner={listing.owner}
        isOwner={isOwner}
        listingId={listing.listingId}
      />
    </article>
  );
}
