import type { Listing, ListingOwner } from "@/lib/listings/types";

function isImageUrl(url: string): boolean {
  return /^https?:\/\//i.test(url);
}

export function listingCoverImage(
  examples: string[],
  owner: ListingOwner,
): string | null {
  const first = examples.find(isImageUrl);
  if (first) return first;
  if (owner.avatar) return owner.avatar;
  return null;
}

export function listingCoverForListing(listing: Listing): string | null {
  return listingCoverImage(listing.examples, listing.owner);
}
