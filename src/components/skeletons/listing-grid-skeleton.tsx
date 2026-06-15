import { ListingCardSkeleton } from "@/components/skeletons/listing-card-skeleton";
import { PageHeaderSkeleton } from "@/components/skeletons/page-header-skeleton";

type ListingGridSkeletonProps = {
  count?: number;
  showHeader?: boolean;
};

export function ListingGridSkeleton({
  count = 6,
  showHeader = true,
}: ListingGridSkeletonProps) {
  return (
    <section aria-hidden>
      {showHeader ? <PageHeaderSkeleton /> : null}
      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: count }, (_, index) => (
          <li key={index} className="h-full">
            <ListingCardSkeleton />
          </li>
        ))}
      </ul>
    </section>
  );
}
