import type { Messages } from "@/lib/i18n/get-messages";
import type { CategoryGroup } from "@/lib/categories/types";

export type CategoryHints = {
  photo: string;
  title: string;
  description: string;
};

function getGroupHints(messages: Messages): Record<string, CategoryHints> {
  return {
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
}

function getDefaultHints(messages: Messages): CategoryHints {
  return {
    photo: messages.listingForm.hintsDefaultPhoto,
    title: messages.listingForm.hintsDefaultTitle,
    description: messages.listingForm.hintsDefaultDescription,
  };
}

export function getCategoryHints(
  groups: CategoryGroup[],
  categoryId: string,
  messages: Messages,
): CategoryHints {
  const groupHints = getGroupHints(messages);
  const defaultHints = getDefaultHints(messages);

  for (const group of groups) {
    if (group.children.some((c) => c.categoryId === categoryId)) {
      return groupHints[group.slug] ?? defaultHints;
    }
  }
  return defaultHints;
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
