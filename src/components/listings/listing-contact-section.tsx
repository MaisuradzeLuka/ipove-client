"use client";

import Link from "next/link";
import { useState } from "react";
import { HiOutlineEnvelope, HiOutlinePhone } from "react-icons/hi2";
import { useMessages } from "@/contexts/locale-context";
import {
  formatPhoneDisplay,
  ownerHasContact,
  phoneTelHref,
} from "@/lib/listings/contact";
import type { ListingOwner } from "@/lib/listings/types";

type ListingContactSectionProps = {
  owner: ListingOwner;
  isOwner?: boolean;
  listingId: string;
};

export function ListingContactSection({
  owner,
  isOwner,
  listingId,
}: ListingContactSectionProps) {
  const messages = useMessages();
  const [revealed, setRevealed] = useState(false);
  const hasContact = ownerHasContact(owner);

  if (isOwner) {
    return (
      <section className="mt-10 rounded-2xl border border-border bg-background-surface p-6 sm:p-8">
        <h2 className="text-lg font-semibold text-foreground">
          {messages.listingDetail.contactTitle}
        </h2>
        {!hasContact ? (
          <p className="mt-2 text-sm text-foreground-muted">
            {messages.listingDetail.contactOwnerHint}
          </p>
        ) : null}
        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            href={`/dashboard/listings/${listingId}/edit`}
            className="inline-flex rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-foreground-on-accent transition-colors hover:bg-accent-hover">
            {messages.listingDetail.editOwn}
          </Link>
          <Link
            href="/profile"
            className="inline-flex rounded-lg border border-border bg-background-muted px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-background-subtle">
            {messages.listingDetail.contactOwnerProfile}
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="mt-10 rounded-2xl border border-border bg-background-surface p-6 sm:p-8">
      <h2 className="text-lg font-semibold text-foreground">
        {messages.listingDetail.contactTitle}
      </h2>

      {!hasContact ? (
        <p className="mt-3 text-sm text-foreground-muted">
          {messages.listingDetail.contactUnavailable}
        </p>
      ) : !revealed ? (
        <div className="mt-5">
          <button
            type="button"
            onClick={() => setRevealed(true)}
            className="inline-flex w-full items-center justify-center rounded-xl bg-accent px-6 py-3.5 text-base font-semibold text-foreground-on-accent shadow-sm transition-colors hover:bg-accent-hover sm:w-auto">
            {messages.listingDetail.contactReveal}
          </button>
          <p className="mt-3 text-xs text-foreground-muted">
            {messages.listingDetail.messageSoon}
          </p>
        </div>
      ) : (
        <ul className="mt-5 space-y-3">
          {owner.phoneNumber ? (
            <li>
              <a
                href={phoneTelHref(owner.phoneNumber)}
                className="flex items-center gap-4 rounded-xl border border-border bg-background-muted/60 px-4 py-3.5 transition-colors hover:border-accent/40 hover:bg-accent-soft/30">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent-soft text-foreground-accent">
                  <HiOutlinePhone className="size-5" aria-hidden />
                </span>
                <span className="min-w-0">
                  <span className="block text-xs font-medium text-foreground-muted">
                    {messages.listingDetail.contactPhone}
                  </span>
                  <span className="block text-base font-semibold text-foreground">
                    {formatPhoneDisplay(owner.phoneNumber)}
                  </span>
                </span>
              </a>
            </li>
          ) : null}
          {owner.email ? (
            <li>
              <a
                href={`mailto:${owner.email}`}
                className="flex items-center gap-4 rounded-xl border border-border bg-background-muted/60 px-4 py-3.5 transition-colors hover:border-accent/40 hover:bg-accent-soft/30">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent-soft text-foreground-accent">
                  <HiOutlineEnvelope className="size-5" aria-hidden />
                </span>
                <span className="min-w-0">
                  <span className="block text-xs font-medium text-foreground-muted">
                    {messages.listingDetail.contactEmail}
                  </span>
                  <span className="block truncate text-base font-semibold text-foreground">
                    {owner.email}
                  </span>
                </span>
              </a>
            </li>
          ) : null}
        </ul>
      )}
    </section>
  );
}
