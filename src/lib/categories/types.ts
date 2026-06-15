export type CategoryItem = {
  categoryId: string;
  slug: string;
  nameKa: string;
  nameEn: string;
  icon: string;
  parentId: string | null;
  sortOrder: number;
};

export type CategoryGroup = {
  categoryId: string;
  slug: string;
  nameKa: string;
  nameEn: string;
  icon: string;
  sortOrder: number;
  children: CategoryItem[];
};

export type CategoriesResponse = {
  groups: CategoryGroup[];
};
