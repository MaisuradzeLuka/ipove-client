"use client";

import Link from "next/link";
import { HiOutlinePlus } from "react-icons/hi2";
import { useAuth } from "@/contexts/auth-context";
import { messages } from "@/lib/i18n/messages";

export function AddListingLink() {
  const { user, isLoading } = useAuth();

  if (isLoading || !user) return null;

  return (
    <Link
      href="/dashboard/listings/new"
      className="inline-flex items-center gap-1.5 rounded-lg bg-accent px-3 py-1.5 text-sm font-medium text-foreground-on-accent transition-colors hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-ring-offset">
      <HiOutlinePlus className="size-4" aria-hidden />
      {messages.nav.addListing}
    </Link>
  );
}
