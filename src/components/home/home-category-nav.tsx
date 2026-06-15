"use client";

import Link from "next/link";
import type { CategoryGroup } from "@/lib/categories/types";
import { useCategoryName, useMessages } from "@/contexts/locale-context";

type HomeCategoryNavProps = {
  groups: CategoryGroup[];
};

export function HomeCategoryNav({ groups }: HomeCategoryNavProps) {
  const messages = useMessages();
  const categoryName = useCategoryName();

  if (groups.length === 0) return null;

  return (
    <nav aria-labelledby="home-categories-heading" className="mb-10">
      <h2
        id="home-categories-heading"
        className="mb-4 text-base font-semibold tracking-tight text-foreground sm:text-lg">
        {messages.home.browseCategories}
      </h2>
      <ul className="grid grid-cols-2 items-stretch gap-3 sm:grid-cols-4">
        {groups.map((group) => (
          <li key={group.slug} className="h-full">
            <Link
              href={`#section-${group.slug}`}
              className="flex h-full w-full flex-col items-center gap-2 rounded-2xl border border-border bg-background-surface px-3 py-4 text-center shadow-xs transition-all hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:px-4 sm:py-5">
              <span className="shrink-0 text-2xl sm:text-3xl" aria-hidden>
                {group.icon}
              </span>
              <span className="flex flex-1 items-center text-xs font-semibold leading-snug text-foreground sm:text-sm">
                {categoryName(group)}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
