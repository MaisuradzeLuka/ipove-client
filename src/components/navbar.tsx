import Link from "next/link";
import { AddListingLink } from "@/components/nav/add-listing-link";
import { NavAuth } from "@/components/auth/nav-auth";
import { Logo } from "@/components/logo/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { messages } from "@/lib/i18n/messages";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background-surface/90 backdrop-blur-sm">
      <nav
        className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-6"
        aria-label={messages.nav.main}>
        <Link
          href="/"
          className="rounded-md outline-none transition-opacity hover:opacity-80 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-ring-offset">
          <Logo size="sm" />
        </Link>
        <div className="flex items-center gap-3">
          <AddListingLink />
          <NavAuth />
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
