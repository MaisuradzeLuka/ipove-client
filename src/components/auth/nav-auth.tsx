"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { UserAvatar } from "@/components/auth/user-avatar";
import { useAuth } from "@/contexts/auth-context";
import { userDisplayName } from "@/lib/auth/display";
import { useMessages } from "@/contexts/locale-context";

type NavAuthProps = {
  variant?: "dropdown" | "inline";
  onNavigate?: () => void;
};

const linkClass =
  "block rounded-lg px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-background-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-ring-offset";

export function NavAuth({ variant = "dropdown", onNavigate }: NavAuthProps) {
  const messages = useMessages();
  const { user, isLoading, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  if (isLoading) {
    return (
      <div
        className={
          variant === "inline"
            ? "flex items-center gap-3 px-3 py-2"
            : undefined
        }
        aria-hidden>
        {variant === "inline" ? (
          <>
            <div className="size-10 shrink-0 rounded-full bg-background-muted" />
            <div className="h-4 w-28 rounded bg-background-muted" />
          </>
        ) : (
          <div className="size-8 rounded-full bg-background-muted" />
        )}
      </div>
    );
  }

  if (!user) {
    return (
      <Link
        href="/sign-in"
        onClick={onNavigate}
        className={
          variant === "inline"
            ? `${linkClass} text-center text-foreground-accent hover:text-accent-hover`
            : "rounded-lg px-3 py-1.5 text-sm font-medium text-foreground-accent transition-colors hover:text-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-ring-offset"
        }
      >
        {messages.nav.logIn}
      </Link>
    );
  }

  if (variant === "inline") {
    return (
      <div className="space-y-1">
        <Link
          href="/profile"
          onClick={onNavigate}
          className="flex items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-background-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-ring-offset">
          <UserAvatar user={user} size="md" />
          <span className="min-w-0 truncate text-sm font-medium text-foreground">
            {userDisplayName(user)}
          </span>
        </Link>
        <Link
          href="/dashboard"
          onClick={onNavigate}
          className={linkClass}
        >
          {messages.nav.myListings}
        </Link>
        <Link
          href="/profile"
          onClick={onNavigate}
          className={linkClass}
        >
          {messages.nav.profile}
        </Link>
        <button
          type="button"
          onClick={() => {
            onNavigate?.();
            void signOut();
          }}
          className={`w-full text-left ${linkClass}`}
        >
          {messages.nav.signOut}
        </button>
      </div>
    );
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="rounded-full outline-none transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-ring-offset"
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={messages.nav.accountMenu}
      >
        <UserAvatar user={user} size="sm" />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 z-50 mt-2 w-48 rounded-xl border border-border bg-background-surface py-1 shadow-md"
        >
          <p className="truncate px-3 py-2 text-xs text-foreground-muted">
            {userDisplayName(user)}
          </p>
          <Link
            href="/dashboard"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="block px-3 py-2 text-sm text-foreground transition-colors hover:bg-background-muted"
          >
            {messages.nav.myListings}
          </Link>
          <Link
            href="/profile"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="block px-3 py-2 text-sm text-foreground transition-colors hover:bg-background-muted"
          >
            {messages.nav.profile}
          </Link>
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setOpen(false);
              void signOut();
            }}
            className="w-full px-3 py-2 text-left text-sm text-foreground transition-colors hover:bg-background-muted"
          >
            {messages.nav.signOut}
          </button>
        </div>
      )}
    </div>
  );
}
