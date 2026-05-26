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

function initials(owner: ListingOwner) {
  const name = [owner.name, owner.lastname].filter(Boolean).join(" ").trim();
  if (name) {
    return name
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("");
  }
  return "?";
}

export function ListingOwnerAvatar({
  owner,
  size = "sm",
  className = "",
}: ListingOwnerAvatarProps) {
  const sizeClass = sizeClasses[size];
  const label = listingOwnerDisplayName(owner);

  if (owner.avatar) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={owner.avatar}
        alt=""
        title={label}
        className={`rounded-full object-cover ring-2 ring-border ${sizeClass} ${className}`}
      />
    );
  }

  return (
    <span
      aria-hidden
      title={label}
      className={`inline-flex shrink-0 items-center justify-center rounded-full bg-accent-soft font-semibold text-foreground-accent ring-2 ring-border ${sizeClass} ${className}`}>
      {initials(owner)}
    </span>
  );
}
