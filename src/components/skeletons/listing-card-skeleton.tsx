import { Skeleton } from "@/components/skeletons/skeleton";

export function ListingCardSkeleton() {
  return (
    <article
      className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-background-surface shadow-sm"
      aria-hidden>
      <Skeleton className="aspect-[5/4] w-full rounded-none" />

      <div className="flex flex-col gap-2 p-4">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-4/5" />
      </div>

      <div className="border-t border-border px-4 pb-4 pt-3">
        <div className="flex items-center gap-3">
          <Skeleton className="size-9 shrink-0 rounded-full" />
          <div className="min-w-0 flex-1 space-y-1.5">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
      </div>
    </article>
  );
}
