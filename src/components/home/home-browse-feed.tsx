import { CategorySectionsFeed } from "@/components/home/category-sections-feed";
import { HomeCategoryNav } from "@/components/home/home-category-nav";
import type { CategoryGroup } from "@/lib/categories/types";
import type { CategoryListingSection } from "@/lib/listings/home-feed";

type HomeBrowseFeedProps = {
  groups: CategoryGroup[];
  sections: CategoryListingSection[];
};

export function HomeBrowseFeed({ groups, sections }: HomeBrowseFeedProps) {
  return (
    <>
      <HomeCategoryNav groups={groups} />
      <CategorySectionsFeed sections={sections} />
    </>
  );
}
