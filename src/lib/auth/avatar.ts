export const AVATAR_FALLBACK_SRC = "/avatar-fallback.svg";

export function avatarSrc(avatar: string | null | undefined): string {
  const value = avatar?.trim();
  if (!value || value === "null") return AVATAR_FALLBACK_SRC;
  return value;
}
