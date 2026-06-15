import { getCurrentLocale } from "@/lib/i18n/current-locale";
import { getMessages } from "@/lib/i18n/get-messages";
import type { CompensationType, ListingOwner, WorkMode } from "@/lib/listings/types";

function messages() {
  return getMessages(getCurrentLocale());
}

export function listingOwnerDisplayName(owner: ListingOwner): string {
  const full = [owner.name, owner.lastname].filter(Boolean).join(" ").trim();
  const m = messages();
  return full || m.publicProfile.professional;
}

export function formatExperienceYears(years: number | null): string | null {
  if (years == null) return null;
  return getCurrentLocale() === "en"
    ? `${years} yr. experience`
    : `${years} წ. გამოცდილება`;
}

export function formatCompensation(
  rate: number | null,
  type: CompensationType,
): string | null {
  const m = messages();
  if (type === "negotiable") return m.filters.compensationNegotiable;
  if (rate == null) return null;
  switch (type) {
    case "one_time":
      return `₾${rate} ${m.filters.compensationOneTimeShort}`;
    case "monthly":
      return `₾${rate}/${m.filters.compensationMonthlyShort}`;
    case "hourly":
      return `₾${rate}/${m.filters.compensationHourlyShort}`;
    default:
      return `₾${rate}`;
  }
}

export function formatWorkMode(mode: WorkMode): string {
  return messages().filters.workModeLabel(mode);
}

/** @deprecated use formatCompensation */
export function formatHourlyRate(rate: number | null): string | null {
  if (rate == null) return null;
  return getCurrentLocale() === "en" ? `₾${rate}/hr` : `₾${rate}/საათში`;
}
