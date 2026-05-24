import { apiFetch } from "@/lib/api/client";
import type { CategoriesResponse } from "@/lib/categories/types";

export function getCategories() {
  return apiFetch<CategoriesResponse>("/api/v1/categories");
}
