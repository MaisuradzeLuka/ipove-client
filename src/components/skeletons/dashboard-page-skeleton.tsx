"use client";

import { Skeleton, SkeletonContainer } from "@/components/skeletons/skeleton";
import { useMessages } from "@/contexts/locale-context";

function DashboardListingRowSkeleton() {
  return (
    <li
      className="rounded-xl border border-border bg-background-surface p-4 shadow-sm"
      aria-hidden>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-5 w-14 rounded-full" />
          </div>
          <Skeleton className="h-5 w-3/4 max-w-xs" />
          <Skeleton className="h-4 w-24" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-20 rounded-lg" />
          <Skeleton className="h-8 w-20 rounded-lg" />
        </div>
      </div>
    </li>
  );
}

export function DashboardListingsSkeleton({ count = 4 }: { count?: number }) {
  return (
    <ul className="mt-8 space-y-3" aria-hidden>
      {Array.from({ length: count }, (_, index) => (
        <DashboardListingRowSkeleton key={index} />
      ))}
    </ul>
  );
}

export function DashboardPageSkeleton() {
  const messages = useMessages();

  return (
    <SkeletonContainer label={messages.dashboard.loading}>
      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-12">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-2" aria-hidden>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64 max-w-full" />
          </div>
          <Skeleton className="h-9 w-36 rounded-lg" aria-hidden />
        </div>

        <DashboardListingsSkeleton />
      </main>
    </SkeletonContainer>
  );
}
