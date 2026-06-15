import { Skeleton } from "@/components/skeletons/skeleton";

export function ListingFiltersSkeleton() {
  return (
    <section
      className="border-b border-border bg-background-muted/40"
      aria-hidden>
      <div className="mx-auto max-w-6xl px-6 py-4">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          {Array.from({ length: 6 }, (_, index) => (
            <Skeleton key={index} className="min-h-13 rounded-lg" />
          ))}
        </div>
      </div>
    </section>
  );
}
