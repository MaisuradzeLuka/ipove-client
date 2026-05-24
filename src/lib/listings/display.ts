import type { ListingOwner } from "@/lib/listings/types";

export function listingOwnerDisplayName(owner: ListingOwner): string {
  const full = [owner.name, owner.lastname].filter(Boolean).join(" ").trim();
  return full || "პროფესიონალი";
}

export function formatExperienceYears(years: number | null): string | null {
  if (years == null) return null;
  return `${years} წ. გამოცდილება`;
}

export function formatHourlyRate(rate: number | null): string | null {
  if (rate == null) return null;
  return `₾${rate}/საათში`;
}
