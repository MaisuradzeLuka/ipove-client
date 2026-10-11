"use client";

import { useEffect, useState } from "react";
import { AVATAR_FALLBACK_SRC, avatarSrc } from "@/lib/auth/avatar";
import { listingOwnerDisplayName } from "@/lib/listings/display";
import type { ListingOwner } from "@/lib/listings/types";

type ListingOwnerAvatarProps = {
  owner: ListingOwner;
  size?: "sm" | "md" | "lg";
  className?: string;
};

const sizeClasses = {
  sm: "size-8 text-xs",
  md: "size-10 text-sm",
  lg: "size-20 text-xl",
};

export function ListingOwnerAvatar({
  owner,
  size = "sm",
  className = "",
}: ListingOwnerAvatarProps) {
  const sizeClass = sizeClasses[size];
  const label = listingOwnerDisplayName(owner);
  const src = avatarSrc(owner.avatar);
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
