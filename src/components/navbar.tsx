import Link from "next/link";
import { AddListingLink } from "@/components/nav/add-listing-link";
import { NavMobileMenu } from "@/components/nav/nav-mobile-menu";
import { NavSearch } from "@/components/nav/nav-search";
import { NavAuth } from "@/components/auth/nav-auth";
import { LocaleSelector } from "@/components/locale-selector";
import { Logo } from "@/components/logo/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { getServerMessages } from "@/lib/i18n/server";

export async function Navbar() {
  const messages = await getServerMessages();

  return (
    <header className="sticky top-0 z-[var(--z-sticky)] border-b border-border bg-background-surface/90 backdrop-blur-sm">
      <nav
        className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-6 px-6"
        aria-label={messages.nav.main}>
        <div className="flex min-w-0 items-center gap-4">
          <Link
            href="/"
            className="shrink-0 rounded-md outline-none transition-opacity hover:opacity-80 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-ring-offset">
            <Logo size="md" />
          </Link>
          <div className="hidden md:block">
            <NavSearch />
          </div>
        </div>

        <div className="hidden shrink-0 items-center gap-3 md:flex">
          <AddListingLink />
          <NavAuth />
          <LocaleSelector />
          <ThemeToggle />
        </div>

        <div className="md:hidden">
          <NavMobileMenu />
        </div>
      </nav>
    </header>
  );
}
