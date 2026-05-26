export function verifyEmailCallbackURL(): string {
  if (typeof window === "undefined") return "/verify-email";
  return `${window.location.origin}/verify-email`;
}
