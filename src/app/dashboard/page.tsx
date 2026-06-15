"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { HiOutlinePencil, HiOutlinePlus, HiOutlineTrash } from "react-icons/hi2";
import { DashboardListingsSkeleton, DashboardPageSkeleton } from "@/components/skeletons";
import { useAuth } from "@/contexts/auth-context";
import { deleteListing, getMyListings } from "@/lib/api/listings";
import { useCategoryName, useMessages } from "@/contexts/locale-context";
import type { Listing } from "@/lib/listings/types";

export default function DashboardPage() {
  const messages = useMessages();
  const categoryName = useCategoryName();
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loadingListings, setLoadingListings] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadListings = useCallback(async () => {
    setLoadingListings(true);
    setError(null);
    try {
      const data = await getMyListings();
      setListings(data.listings);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : messages.auth.somethingWrong,
      );
    } finally {
      setLoadingListings(false);
    }
  }, [messages]);

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/sign-in?next=/dashboard");
    }
  }, [isLoading, user, router]);

  useEffect(() => {
    if (!user) return;
    void loadListings();
  }, [user, loadListings]);

  async function handleDelete(listing: Listing) {
    if (!window.confirm(messages.dashboard.deleteConfirm(listing.title))) {
      return;
    }
    try {
      await deleteListing(listing.listingId);
      setListings((current) =>
        current.filter((item) => item.listingId !== listing.listingId),
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : messages.auth.somethingWrong,
      );
    }
  }

  if (isLoading || !user) {
    return <DashboardPageSkeleton />;
  }

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-12">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            {messages.dashboard.title}
          </h1>
          <p className="mt-2 text-sm text-foreground-muted">
            {messages.dashboard.subtitle}
          </p>
        </div>
        <Link
          href="/dashboard/listings/new"
          className="inline-flex items-center gap-1.5 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-foreground-on-accent transition-colors hover:bg-accent-hover">
          {messages.nav.addListing}
        </Link>
      </div>

      {error ? (
        <div
          role="alert"
          className="mt-6 rounded-lg bg-error-soft px-4 py-3 text-sm text-error-foreground">
          {error}
        </div>
      ) : null}

      {loadingListings ? (
        <DashboardListingsSkeleton />
      ) : listings.length === 0 ? (
        <div className="mt-8 rounded-xl border border-dashed border-border bg-background-muted/50 px-6 py-12 text-center">
          <p className="font-medium text-foreground">{messages.dashboard.empty}</p>
          <p className="mt-2 text-sm text-foreground-muted">
            {messages.dashboard.emptyHint}
          </p>
          <Link
            href="/dashboard/listings/new"
            className="mt-4 inline-flex rounded-lg bg-accent px-4 py-2 text-sm font-medium text-foreground-on-accent transition-colors hover:bg-accent-hover">
            {messages.nav.addListing}
          </Link>
        </div>
      ) : (
        <ul className="mt-8 space-y-3">
          {listings.map((listing) => (
            <li
              key={listing.listingId}
              className="rounded-xl border border-border bg-background-surface p-4 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs" aria-hidden>
                      {listing.category.icon}
                    </span>
                    <span className="text-xs font-medium text-foreground-accent">
                      {categoryName(listing.category)}
                    </span>
                    <StatusPill status={listing.status} />
                  </div>
                  <h2 className="mt-1 text-base font-semibold text-foreground">
                    <Link
                      href={`/listings/${listing.listingId}`}
                      className="hover:text-foreground-accent">
                      {listing.title}
                    </Link>
                  </h2>
                  <p className="mt-1 text-sm text-foreground-muted">
                    {listing.city}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/dashboard/listings/${listing.listingId}/edit`}
                    className="inline-flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-background-muted">
                    <HiOutlinePencil className="size-3.5" aria-hidden />
                    {messages.dashboard.edit}
                  </Link>
                  <button
                    type="button"
                    onClick={() => void handleDelete(listing)}
                    className="inline-flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-error transition-colors hover:bg-error-soft">
                    <HiOutlineTrash className="size-3.5" aria-hidden />
                    {messages.dashboard.delete}
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

function StatusPill({ status }: { status: Listing["status"] }) {
  const messages = useMessages();
  return (
    <span className="rounded-full bg-background-muted px-2 py-0.5 text-xs text-foreground-muted">
      {messages.listingDetail.statusLabel(status)}
    </span>
  );
}
