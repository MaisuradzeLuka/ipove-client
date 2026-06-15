"use client";

import { ListingFiltersSkeleton } from "@/components/skeletons/listing-filters-skeleton";
import { ListingGridSkeleton } from "@/components/skeletons/listing-grid-skeleton";
import { Skeleton, SkeletonContainer } from "@/components/skeletons/skeleton";
import { useMessages } from "@/contexts/locale-context";

export function HomePageSkeleton() {
  const messages = useMessages();

  return (
    <SkeletonContainer label={messages.home.loading}>
      <ListingFiltersSkeleton />

      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-8">
        <section className="mb-10" aria-hidden>
          <Skeleton className="mb-4 h-6 w-40" />
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {Array.from({ length: 4 }, (_, index) => (
              <li key={index}>
                <Skeleton className="h-24 rounded-2xl" />
              </li>
            ))}
          </ul>
        </section>

        <ListingGridSkeleton count={6} />
      </main>
    </SkeletonContainer>
  );
}
