import Link from "next/link";
import { ListingOwnerAvatar } from "@/components/home/listing-owner-avatar";
import { listingOwnerDisplayName } from "@/lib/listings/display";
import type { ListingOwner } from "@/lib/listings/types";
import { publicUserProfilePath } from "@/lib/users/types";

type ListingOwnerLinkProps = {
  owner: ListingOwner;
  subtitle?: string | null;
  size?: "sm" | "md";
  className?: string;
};

export function ListingOwnerLink({
  owner,
  subtitle,
  size = "sm",
  className = "",
}: ListingOwnerLinkProps) {
  const name = listingOwnerDisplayName(owner);

  return (
    <Link
      href={publicUserProfilePath(owner.userId)}
      className={`group/owner flex min-w-0 items-center gap-2.5 rounded-lg outline-none transition-colors hover:bg-accent-soft/40 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-ring-offset ${className}`}>
      <ListingOwnerAvatar owner={owner} size={size} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-foreground transition-colors group-hover/owner:text-foreground-accent">
          {name}
        </p>
        {subtitle ? (
          <p className="truncate text-xs text-foreground-muted">{subtitle}</p>
        ) : null}
      </div>
    </Link>
  );
}
