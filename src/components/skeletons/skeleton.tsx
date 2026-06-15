import type { ReactNode } from "react";

type SkeletonProps = {
  className?: string;
};

export function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse rounded-md bg-background-muted ${className}`}
      aria-hidden
    />
  );
}

type SkeletonContainerProps = {
  label: string;
  children: ReactNode;
  className?: string;
};

export function SkeletonContainer({
  label,
  children,
  className = "",
}: SkeletonContainerProps) {
  return (
    <div
      role="status"
      aria-busy="true"
      aria-label={label}
      className={className}>
      <span className="sr-only">{label}</span>
      {children}
    </div>
  );
}
