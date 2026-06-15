"use client";

import { ListingGridSkeleton } from "@/components/skeletons/listing-grid-skeleton";
import { Skeleton, SkeletonContainer } from "@/components/skeletons/skeleton";
import { useMessages } from "@/contexts/locale-context";

export function ProfilePageSkeleton() {
  const messages = useMessages();

  return (
    <SkeletonContainer label={messages.profile.loading}>
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-8 sm:py-10">
        <header className="mb-8 space-y-2" aria-hidden>
          <Skeleton className="h-8 w-40 sm:h-9 sm:w-48" />
          <Skeleton className="h-4 w-full max-w-2xl" />
        </header>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,320px)_1fr] lg:items-start">
          <aside className="space-y-4" aria-hidden>
            <section className="overflow-hidden rounded-2xl border border-border bg-background-surface p-6 shadow-sm">
              <div className="flex flex-col items-center gap-4">
                <Skeleton className="size-24 rounded-full" />
                <Skeleton className="h-5 w-32" />
              </div>
              <div className="mt-4 space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-2/3" />
              </div>
              <Skeleton className="mt-5 h-10 w-full rounded-xl" />
            </section>

            <section className="rounded-2xl border border-border bg-background-surface p-5 shadow-sm">
              <Skeleton className="h-5 w-36" />
              <Skeleton className="mt-3 h-2 w-full rounded-full" />
              <div className="mt-4 space-y-2">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-5/6" />
              </div>
            </section>

            <div className="grid grid-cols-2 gap-3">
              <Skeleton className="h-24 rounded-2xl" />
              <Skeleton className="h-24 rounded-2xl" />
            </div>
          </aside>

          <div className="space-y-6" aria-hidden>
            <section className="rounded-2xl border border-border bg-background-surface p-6 shadow-sm">
              <Skeleton className="h-6 w-40" />
              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                <Skeleton className="h-11 w-full rounded-lg" />
                <Skeleton className="h-11 w-full rounded-lg" />
              </div>
              <Skeleton className="mt-5 h-11 w-full rounded-lg" />
            </section>

            <section className="rounded-2xl border border-border bg-background-surface p-6 shadow-sm">
              <Skeleton className="h-6 w-36" />
              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                <Skeleton className="h-11 w-full rounded-lg" />
                <Skeleton className="h-11 w-full rounded-lg" />
              </div>
              <Skeleton className="mt-5 h-11 w-full rounded-lg" />
              <div className="mt-6 flex justify-end">
                <Skeleton className="h-10 w-36 rounded-xl" />
              </div>
            </section>

            <section className="rounded-2xl border border-border bg-background-surface p-6 shadow-sm">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div className="space-y-2">
                  <Skeleton className="h-6 w-44" />
                  <Skeleton className="h-4 w-28" />
                </div>
                <Skeleton className="h-4 w-24" />
              </div>
              <div className="mt-6">
                <ListingGridSkeleton count={3} showHeader={false} />
              </div>
            </section>
          </div>
        </div>
      </main>
    </SkeletonContainer>
  );
}
