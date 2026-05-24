"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { messages } from "@/lib/i18n/messages";

function SunIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      className={className}
      aria-hidden>
      <circle cx="10" cy="10" r="3.25" />
      <path d="M10 2.5v1.5M10 16v1.5M3.52 3.52l1.06 1.06M15.42 15.42l1.06 1.06M2.5 10h1.5M16 10h1.5M3.52 16.48l1.06-1.06M15.42 4.58l1.06-1.06" />
    </svg>
  );
}

function MoonIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden>
      <path d="M16.5 12.25a6.75 6.75 0 1 1-8-10 5.5 5.5 0 0 0 8 10Z" />
    </svg>
  );
}

const segmentClass = (active: boolean) =>
  [
    "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm font-medium transition-all duration-200",
    active
      ? "bg-background-surface text-foreground shadow-sm"
      : "text-foreground-muted hover:text-foreground",
  ].join(" ");

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = mounted && resolvedTheme === "dark";
  const isLight = mounted && !isDark;

  return (
    <div
      role="group"
      aria-label={messages.theme.group}
      className="inline-flex rounded-lg bg-background-muted p-1 ring-1 ring-border">
      <button
        type="button"
        aria-pressed={isLight}
        disabled={!mounted}
        onClick={() => setTheme("light")}
        className={segmentClass(isLight)}>
        <SunIcon className="size-4 shrink-0" />
        <span className="hidden sm:inline">{messages.theme.light}</span>
      </button>
      <button
        type="button"
        aria-pressed={isDark}
        disabled={!mounted}
        onClick={() => setTheme("dark")}
        className={segmentClass(isDark)}>
        <MoonIcon className="size-4 shrink-0" />
        <span className="hidden sm:inline">{messages.theme.dark}</span>
      </button>
    </div>
  );
}
