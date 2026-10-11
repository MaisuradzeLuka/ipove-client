"use client";

import { useEffect, useState } from "react";
import { userDisplayName } from "@/lib/auth/display";
import { AVATAR_FALLBACK_SRC, avatarSrc } from "@/lib/auth/avatar";
import type { User } from "@/lib/auth/types";

type UserAvatarProps = {
  user: Pick<User, "name" | "lastname" | "email" | "avatar">;
  size?: "sm" | "md" | "lg";
  className?: string;
};

const sizeClasses = {
  sm: "size-8 text-xs",
  md: "size-10 text-sm",
  lg: "size-16 text-lg",
};

export function UserAvatar({
  user,
  size = "md",
  className = "",
}: UserAvatarProps) {
  const sizeClass = sizeClasses[size];
  const label = userDisplayName(user as User);
  const src = avatarSrc(user.avatar);
  const [failed, setFailed] = useState(false);

  useEffect(() => setFailed(false), [src]);

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={failed ? AVATAR_FALLBACK_SRC : src}
      alt=""
      title={label}
      onError={() => setFailed(true)}
      className={`inline-flex shrink-0 rounded-full object-cover ring-2 ring-border ${sizeClass} ${className}`}
    />
  );
}
