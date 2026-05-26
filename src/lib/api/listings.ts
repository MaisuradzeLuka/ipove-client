import { apiFetch } from "@/lib/api/client";
import type {
  CreateListingPayload,
  ListingResponse,
  ListingsQuery,
  ListingsResponse,
  UpdateListingPayload,
} from "@/lib/listings/types";

function toQueryString(params: ListingsQuery): string {
  const search = new URLSearchParams();

  if (params.page != null) search.set("page", String(params.page));
  if (params.limit != null) search.set("limit", String(params.limit));
  if (params.categoryId) search.set("categoryId", params.categoryId);
  if (params.categorySlug) search.set("categorySlug", params.categorySlug);
  if (params.city) search.set("city", params.city);
  if (params.q) search.set("q", params.q);
  if (params.compensationType) {
    search.set("compensationType", params.compensationType);
  }
  if (params.minExperience != null) {
    search.set("minExperience", String(params.minExperience));
  }
  if (params.workMode) search.set("workMode", params.workMode);
  if (params.sortBy) search.set("sortBy", params.sortBy);

  const query = search.toString();
  return query ? `?${query}` : "";
}

export function getListings(params: ListingsQuery = {}) {
  return apiFetch<ListingsResponse>(`/api/v1/listings${toQueryString(params)}`);
}

export function getMyListings() {
  return apiFetch<ListingsResponse>("/api/v1/listings/mine");
}

export function getListingById(listingId: string) {
  return apiFetch<ListingResponse>(`/api/v1/listings/${listingId}`);
}

export function createListing(body: CreateListingPayload) {
  return apiFetch<ListingResponse>("/api/v1/listings", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function updateListing(listingId: string, body: UpdateListingPayload) {
  return apiFetch<ListingResponse>(`/api/v1/listings/${listingId}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });
}

export function deleteListing(listingId: string) {
  return apiFetch<void>(`/api/v1/listings/${listingId}`, {
    method: "DELETE",
  });
}
