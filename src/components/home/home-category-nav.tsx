import Link from "next/link";
import type { CategoryGroup } from "@/lib/categories/types";
import { messages } from "@/lib/i18n/messages";

type HomeCategoryNavProps = {
  groups: CategoryGroup[];
};

export function HomeCategoryNav({ groups }: HomeCategoryNavProps) {
  if (groups.length === 0) return null;

  return (
    <nav aria-labelledby="home-categories-heading" className="mb-10">
      <h2
        id="home-categories-heading"
        className="mb-4 text-lg font-semibold tracking-tight text-foreground">
        {messages.home.browseCategories}
      </h2>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {groups.map((group) => (
          <li key={group.slug}>
            <Link
              href={`#section-${group.slug}`}
              className="flex flex-col items-center gap-2 rounded-2xl border border-border bg-background-surface px-4 py-5 text-center shadow-xs transition-all hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              <span className="text-3xl" aria-hidden>
                {group.icon}
              </span>
              <span className="text-sm font-semibold leading-snug text-foreground">
                {group.nameKa}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
