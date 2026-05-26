import type { Listing } from "@/lib/listings/types";

export type PublicUser = {
  userId: string;
  name: string | null;
  lastname: string | null;
  avatar: string | null;
  city: string | null;
  createdAt: string;
};

export type PublicUserProfileResponse = {
  user: PublicUser;
  listings: Listing[];
};

export function publicUserDisplayName(user: PublicUser): string {
  const full = [user.name, user.lastname].filter(Boolean).join(" ").trim();
  return full || "პროფესიონალი";
}

export function publicUserProfilePath(userId: string): string {
  return `/users/${userId}`;
}

export function formatMemberSince(iso: string): string {
  return new Intl.DateTimeFormat("ka-GE", {
    year: "numeric",
    month: "long",
  }).format(new Date(iso));
}
