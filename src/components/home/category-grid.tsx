import Link from "next/link";
import { messages } from "@/lib/i18n/messages";
import type { CategoryGroup, CategoryItem } from "@/lib/categories/types";

type CategoryGridProps = {
  groups: CategoryGroup[];
  activeCategorySlug?: string;
};

function flattenCategories(groups: CategoryGroup[]): CategoryItem[] {
  return groups.flatMap((group) => group.children);
}

export function CategoryGrid({
  groups,
  activeCategorySlug,
}: CategoryGridProps) {
  const categories = flattenCategories(groups);

  return (
    <section aria-labelledby="categories-heading">
      <h2
        id="categories-heading"
        className="text-lg font-semibold text-foreground">
        {messages.home.categoriesTitle}
      </h2>
      <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {categories.map((category) => {
          const isActive = activeCategorySlug === category.slug;
          return (
            <li key={category.categoryId}>
              <Link
                href={
                  isActive
                    ? "/"
                    : `/?categorySlug=${encodeURIComponent(category.slug)}`
                }
                className={`flex flex-col items-center gap-2 rounded-xl border px-3 py-4 text-center transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-ring-offset ${
                  isActive
                    ? "border-accent bg-accent-soft text-foreground-accent"
                    : "border-border bg-background-surface text-foreground hover:border-accent hover:bg-accent-soft/60"
                }`}>
                <span className="text-2xl" aria-hidden>
                  {category.icon}
                </span>
                <span className="text-xs font-medium leading-snug">
                  {category.nameKa}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export function findCategoryBySlug(
  groups: CategoryGroup[],
  slug: string | undefined,
): CategoryItem | undefined {
  if (!slug) return undefined;
  return flattenCategories(groups).find((c) => c.slug === slug);
}
