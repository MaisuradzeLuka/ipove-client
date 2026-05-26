import type { CompensationType, ListingOwner, WorkMode } from "@/lib/listings/types";
import { messages } from "@/lib/i18n/messages";

export function listingOwnerDisplayName(owner: ListingOwner): string {
  const full = [owner.name, owner.lastname].filter(Boolean).join(" ").trim();
  return full || "პროფესიონალი";
}

export function formatExperienceYears(years: number | null): string | null {
  if (years == null) return null;
  return `${years} წ. გამოცდილება`;
}

export function formatCompensation(
  rate: number | null,
  type: CompensationType,
): string | null {
  if (type === "negotiable") return messages.filters.compensationNegotiable;
  if (rate == null) return null;
  switch (type) {
    case "one_time":
      return `₾${rate} ${messages.filters.compensationOneTimeShort}`;
    case "monthly":
      return `₾${rate}/${messages.filters.compensationMonthlyShort}`;
    case "hourly":
      return `₾${rate}/${messages.filters.compensationHourlyShort}`;
    default:
      return `₾${rate}`;
  }
}

export function formatWorkMode(mode: WorkMode): string {
  return messages.filters.workModeLabel(mode);
}

/** @deprecated use formatCompensation */
export function formatHourlyRate(rate: number | null): string | null {
  if (rate == null) return null;
  return `₾${rate}/საათში`;
}
