"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { HiOutlineBars3, HiOutlineXMark } from "react-icons/hi2";
import { AddListingLink } from "@/components/nav/add-listing-link";
import { NavSearch } from "@/components/nav/nav-search";
import { NavAuth } from "@/components/auth/nav-auth";
import { LocaleSelector } from "@/components/locale-selector";
import { ThemeToggle } from "@/components/theme-toggle";
import { useMessages } from "@/contexts/locale-context";

export function NavMobileMenu() {
  const messages = useMessages();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  function close() {
    setOpen(false);
  }

  const menu = open ? (
    <div className="fixed inset-0 z-[var(--z-modal)] md:hidden">
      <button
        type="button"
        className="absolute inset-0 bg-black/40"
        aria-label={messages.nav.closeMenu}
        onClick={close}
      />

      <div
        id="mobile-nav-menu"
        role="dialog"
        aria-modal="true"
        aria-label={messages.nav.main}
        className="absolute inset-y-0 right-0 flex h-dvh max-h-dvh w-full max-w-sm flex-col border-l border-border bg-background-surface shadow-lg pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-border px-4">
          <span className="text-sm font-medium text-foreground">
            {messages.nav.main}
          </span>
          <button
            type="button"
            onClick={close}
            className="inline-flex size-10 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-background-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-ring-offset"
            aria-label={messages.nav.closeMenu}>
            <HiOutlineXMark className="size-6" aria-hidden />
          </button>
        </div>

        <div className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto overscroll-contain p-4">
          <NavSearch className="w-full" onNavigate={close} />

          <AddListingLink
            className="w-full justify-center"
            onNavigate={close}
          />

          <NavAuth variant="inline" onNavigate={close} />

          <div className="space-y-3 border-t border-border pt-4">
            <p className="text-xs font-medium uppercase tracking-wide text-foreground-muted">
              {messages.locale.group}
            </p>
            <LocaleSelector />
          </div>

          <div className="space-y-3 border-t border-border pt-4">
            <p className="text-xs font-medium uppercase tracking-wide text-foreground-muted">
              {messages.theme.group}
            </p>
            <ThemeToggle showLabels />
          </div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex size-10 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-background-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-ring-offset"
        aria-expanded={open}
        aria-controls="mobile-nav-menu"
        aria-label={messages.nav.openMenu}>
        <HiOutlineBars3 className="size-6" aria-hidden />
      </button>

      {mounted && menu ? createPortal(menu, document.body) : null}
    </>
  );
}
