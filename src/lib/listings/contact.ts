import type { ListingOwner } from "@/lib/listings/types";

export function ownerHasContact(owner: ListingOwner): boolean {
  return Boolean(owner.email || owner.phoneNumber);
}

export function formatPhoneDisplay(phone: number): string {
  const digits = String(phone).replace(/\D/g, "");
  if (digits.length === 9) {
    return `${digits.slice(0, 3)} ${digits.slice(3, 5)} ${digits.slice(5, 7)} ${digits.slice(7, 9)}`;
  }
  return digits;
}

export function phoneTelHref(phone: number): string {
  const digits = String(phone).replace(/\D/g, "");
  if (digits.length === 9) {
    return `tel:+995${digits}`;
  }
  return `tel:${digits}`;
}
