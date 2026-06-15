"use client";

import Link from "next/link";
import { HiOutlineArrowLeft, HiOutlineMapPin } from "react-icons/hi2";
import { ListingCard } from "@/components/home/listing-card";
import { ListingOwnerAvatar } from "@/components/home/listing-owner-avatar";
import { useMessages } from "@/contexts/locale-context";
import type { Listing } from "@/lib/listings/types";
import {
  formatMemberSince,
  publicUserDisplayName,
  type PublicUser,
} from "@/lib/users/types";

type PublicProfileViewProps = {
  user: PublicUser;
  listings: Listing[];
};

export function PublicProfileView({ user, listings }: PublicProfileViewProps) {
  const messages = useMessages();
  const name = publicUserDisplayName(user);
  const memberSince = formatMemberSince(user.createdAt);

  return (
    <article>
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-foreground-accent transition-colors hover:text-accent-hover">
        <HiOutlineArrowLeft className="size-4" aria-hidden />
        {messages.publicProfile.backHome}
      </Link>

      <header className="mt-6 rounded-2xl border border-border bg-background-surface p-6 sm:p-8">
        <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
          <ListingOwnerAvatar
            owner={{
              userId: user.userId,
              name: user.name,
              lastname: user.lastname,
              avatar: user.avatar,
            }}
            size="lg"
          />
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              {name}
            </h1>
            <p className="mt-1 text-sm text-foreground-muted">
              {messages.publicProfile.professional}
            </p>
            <ul className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-sm text-foreground-muted sm:justify-start">
              {user.city ? (
                <li className="inline-flex items-center gap-1.5">
                  <HiOutlineMapPin className="size-4 shrink-0" aria-hidden />
                  {user.city}
                </li>
              ) : null}
              <li>{messages.publicProfile.memberSince(memberSince)}</li>
              <li>{messages.publicProfile.listingsCount(listings.length)}</li>
            </ul>
          </div>
        </div>
      </header>

      <section className="mt-10" aria-labelledby="profile-listings-heading">
        <h2
          id="profile-listings-heading"
          className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
          {messages.publicProfile.listingsTitle}
        </h2>

        {listings.length === 0 ? (
          <div className="mt-6 rounded-xl border border-dashed border-border bg-background-muted/50 px-6 py-16 text-center">
            <p className="text-base font-medium text-foreground">
              {messages.publicProfile.noListings}
            </p>
          </div>
        ) : (
          <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {listings.map((listing) => (
              <li key={listing.listingId} className="h-full">
                <ListingCard listing={listing} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </article>
  );
}
