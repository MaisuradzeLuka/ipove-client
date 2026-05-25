import { userDisplayName } from "@/lib/auth/display";
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

function initials(user: Pick<User, "name" | "lastname" | "email">) {
  const name = [user.name, user.lastname].filter(Boolean).join(" ").trim();
  if (name) {
    return name
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("");
  }
  return user.email[0]?.toUpperCase() ?? "?";
}

export function UserAvatar({
  user,
  size = "md",
  className = "",
}: UserAvatarProps) {
  const sizeClass = sizeClasses[size];
  const label = userDisplayName(user as User);

  if (user.avatar) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={user.avatar}
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
      className={`inline-flex shrink-0 items-center justify-center rounded-full bg-accent-soft font-semibold text-foreground-accent ring-2 ring-border cursor-pointer ${sizeClass} ${className}`}
    >
      {initials(user)}
    </span>
  );
}
