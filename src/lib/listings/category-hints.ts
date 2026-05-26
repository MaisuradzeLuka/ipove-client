import type { CategoryGroup } from "@/lib/categories/types";
import { messages } from "@/lib/i18n/messages";

export type CategoryHints = {
  photo: string;
  title: string;
  description: string;
};

const GROUP_HINTS: Record<string, CategoryHints> = {
  technology: {
    photo: messages.listingForm.hintsTechPhoto,
    title: messages.listingForm.hintsTechTitle,
    description: messages.listingForm.hintsTechDescription,
  },
  design: {
    photo: messages.listingForm.hintsDesignPhoto,
    title: messages.listingForm.hintsDesignTitle,
    description: messages.listingForm.hintsDesignDescription,
  },
  services: {
    photo: messages.listingForm.hintsServicesPhoto,
    title: messages.listingForm.hintsServicesTitle,
    description: messages.listingForm.hintsServicesDescription,
  },
  education: {
    photo: messages.listingForm.hintsEducationPhoto,
    title: messages.listingForm.hintsEducationTitle,
    description: messages.listingForm.hintsEducationDescription,
  },
};

const DEFAULT_HINTS: CategoryHints = {
  photo: messages.listingForm.hintsDefaultPhoto,
  title: messages.listingForm.hintsDefaultTitle,
  description: messages.listingForm.hintsDefaultDescription,
};

export function getCategoryHints(
  groups: CategoryGroup[],
  categoryId: string,
): CategoryHints {
  for (const group of groups) {
    if (group.children.some((c) => c.categoryId === categoryId)) {
      return GROUP_HINTS[group.slug] ?? DEFAULT_HINTS;
    }
  }
  return DEFAULT_HINTS;
}

export function findCategoryGroup(
  groups: CategoryGroup[],
  categoryId: string,
): CategoryGroup | null {
  for (const group of groups) {
    if (group.children.some((c) => c.categoryId === categoryId)) {
      return group;
    }
  }
  return null;
}
