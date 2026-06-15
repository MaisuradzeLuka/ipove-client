"use client";

import { useEffect, useState } from "react";
import { useLocale, useMessages } from "@/contexts/locale-context";
import { localeOptions, type Locale } from "@/lib/i18n/locales";

const segmentClass = (active: boolean) =>
  [
    "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm font-medium transition-all duration-200",
    active
      ? "bg-background-surface text-foreground shadow-sm"
      : "text-foreground-muted hover:text-foreground",
  ].join(" ");

export function LocaleSelector() {
  const { locale, setLocale } = useLocale();
  const messages = useMessages();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <div
      role="group"
      aria-label={messages.locale.group}
      className="inline-flex rounded-lg bg-background-muted p-1 ring-1 ring-border">
      {localeOptions.map((option) => {
        const active = mounted && locale === option.value;
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={active}
            disabled={!mounted}
            onClick={() => setLocale(option.value as Locale)}
            className={segmentClass(active)}>
            <span className="text-xs font-semibold tracking-wide">
              {option.shortLabel}
            </span>
          </button>
        );
      })}
    </div>
  );
}
