import { Skeleton } from "@/components/skeletons/skeleton";

type PageHeaderSkeletonProps = {
  subtitle?: boolean;
};

export function PageHeaderSkeleton({ subtitle = true }: PageHeaderSkeletonProps) {
  return (
    <header className="mb-6" aria-hidden>
      <Skeleton className="h-7 w-48 sm:h-8 sm:w-64" />
      {subtitle ? <Skeleton className="mt-2 h-4 w-72 max-w-full" /> : null}
    </header>
  );
}
