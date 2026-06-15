"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ListingForm } from "@/components/listings/listing-form";
import { useAuth } from "@/contexts/auth-context";
import { getListingById } from "@/lib/api/listings";
import { useMessages } from "@/contexts/locale-context";
import type { Listing } from "@/lib/listings/types";

export default function EditListingPage() {
  const messages = useMessages();
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { user, isLoading } = useAuth();
  const [listing, setListing] = useState<Listing | null>(null);
  const [loadingListing, setLoadingListing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace(`/sign-in?next=/dashboard/listings/${params.id}/edit`);
    }
  }, [isLoading, user, router, params.id]);

  useEffect(() => {
    if (!user || !params.id) return;
    setLoadingListing(true);
    getListingById(params.id)
      .then(({ listing: data }) => {
        if (data.userId !== user.userId) {
          router.replace("/dashboard");
          return;
        }
        setListing(data);
      })
      .catch(() => setError(messages.listingForm.loadFailed))
      .finally(() => setLoadingListing(false));
  }, [user, params.id, router]);

  if (isLoading || !user || loadingListing) {
    return (
      <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-12">
        <p className="text-sm text-foreground-muted">{messages.dashboard.loading}</p>
      </main>
    );
  }

  if (error || !listing) {
    return (
      <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-12">
        <p className="text-sm text-error">{error ?? messages.listingForm.loadFailed}</p>
        <Link
          href="/dashboard"
          className="mt-4 inline-block text-sm text-foreground-accent hover:text-accent-hover">
          {messages.dashboard.backToList}
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-12">
      <h1 className="text-2xl font-semibold tracking-tight text-foreground">
        {messages.listingForm.editTitle}
      </h1>
      <p className="mt-2 text-sm text-foreground-muted">{listing.title}</p>

      <article className="mt-8 rounded-xl bg-background-surface p-6 shadow-sm ring-1 ring-border">
        <ListingForm mode="edit" listing={listing} />
      </article>

      <p className="mt-6 text-center text-sm text-foreground-muted">
        <Link href="/dashboard" className="text-foreground-accent hover:text-accent-hover">
          {messages.dashboard.backToList}
        </Link>
      </p>
    </main>
  );
}
