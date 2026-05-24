"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ListingForm } from "@/components/listings/listing-form";
import { useAuth } from "@/contexts/auth-context";
import { messages } from "@/lib/i18n/messages";

export default function NewListingPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/sign-in?next=/dashboard/listings/new");
    }
  }, [isLoading, user, router]);

  if (isLoading || !user) {
    return (
      <main className="mx-auto w-full max-w-lg flex-1 px-6 py-12">
        <p className="text-sm text-foreground-muted">{messages.dashboard.loading}</p>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-lg flex-1 px-6 py-12">
      <h1 className="text-2xl font-semibold tracking-tight text-foreground">
        {messages.listingForm.createTitle}
      </h1>
      <p className="mt-2 text-sm text-foreground-muted">
        {messages.listingForm.createSubtitle}
      </p>

      <article className="mt-8 rounded-xl bg-background-surface p-6 shadow-sm ring-1 ring-border">
        <ListingForm mode="create" defaultCity={user.city ?? undefined} />
      </article>

      <p className="mt-6 text-center text-sm text-foreground-muted">
        <Link href="/dashboard" className="text-foreground-accent hover:text-accent-hover">
          {messages.dashboard.backToList}
        </Link>
      </p>
    </main>
  );
}
