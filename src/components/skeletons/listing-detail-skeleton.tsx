"use client";

import { Skeleton, SkeletonContainer } from "@/components/skeletons/skeleton";
import { useMessages } from "@/contexts/locale-context";

export function ListingDetailSkeleton() {
  const messages = useMessages();

  return (
    <SkeletonContainer label={messages.listingDetail.loading}>
      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-8 sm:py-10">
        <article>
          <Skeleton className="h-4 w-28" />

          <section
            className="mt-6 overflow-hidden rounded-2xl border border-border bg-background-surface"
            aria-hidden>
            <Skeleton className="aspect-[21/9] rounded-none sm:aspect-[2.5/1]" />
            <ul className="grid grid-cols-3 gap-1 p-1 sm:grid-cols-6">
              {Array.from({ length: 6 }, (_, index) => (
                <li
                  key={index}
                  className={index >= 3 ? "hidden sm:block" : undefined}>
                  <Skeleton className="aspect-square w-full rounded-lg" />
                </li>
              ))}
            </ul>
          </section>

          <header
            className="mt-6 rounded-2xl border border-border bg-background-surface p-6 sm:p-8"
            aria-hidden>
            <Skeleton className="h-7 w-36 rounded-full" />
            <Skeleton className="mt-4 h-8 w-4/5 sm:h-9" />
            <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-20" />
            </div>
            <div className="mt-6 flex items-center gap-2.5 border-t border-border pt-6">
              <Skeleton className="size-10 shrink-0 rounded-full" />
              <div className="min-w-0 flex-1 space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
          </header>

          <section className="mt-8" aria-hidden>
            <Skeleton className="h-6 w-24" />
            <div className="mt-3 space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-11/12" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </section>

          <section className="mt-8" aria-hidden>
            <Skeleton className="h-6 w-20" />
            <div className="mt-3 flex flex-wrap gap-2">
              <Skeleton className="h-7 w-16 rounded-full" />
              <Skeleton className="h-7 w-24 rounded-full" />
              <Skeleton className="h-7 w-20 rounded-full" />
            </div>
          </section>

          <section className="mt-8" aria-hidden>
            <Skeleton className="h-6 w-28" />
            <Skeleton className="mt-2 h-4 w-32" />
            <Skeleton className="mt-4 h-56 w-full rounded-xl sm:h-72" />
            <Skeleton className="mt-3 h-4 w-40" />
          </section>

          <section
            className="mt-10 rounded-2xl border border-border bg-background-surface p-6 sm:p-8"
            aria-hidden>
            <Skeleton className="h-6 w-24" />
            <Skeleton className="mt-5 h-12 w-full rounded-xl sm:w-44" />
            <Skeleton className="mt-3 h-3 w-56" />
          </section>
        </article>
      </main>
    </SkeletonContainer>
  );
}
