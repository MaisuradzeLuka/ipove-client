import type { User } from "@/lib/auth/types";

export function userDisplayName(user: User): string {
  const full = [user.name, user.lastname].filter(Boolean).join(" ").trim();
  return full || user.email;
}
