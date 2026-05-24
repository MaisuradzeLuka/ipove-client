"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { HiOutlineMagnifyingGlass } from "react-icons/hi2";
import { messages } from "@/lib/i18n/messages";

type HeroSearchProps = {
  initialQuery?: string;
  initialCity?: string;
  categorySlug?: string;
};

export function HeroSearch({
  initialQuery = "",
  initialCity = "",
  categorySlug,
}: HeroSearchProps) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const [city, setCity] = useState(initialCity);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    const q = query.trim();
    const c = city.trim();
    if (q) params.set("q", q);
    if (c) params.set("city", c);
    if (categorySlug) params.set("categorySlug", categorySlug);
    const search = params.toString();
    router.push(search ? `/?${search}` : "/");
  }

  return (
    <section className="rounded-2xl bg-background-muted px-6 py-10 sm:px-10 sm:py-12">
      <h1 className="text-center text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
        {messages.home.heroTitle}
      </h1>
      <p className="mx-auto mt-3 max-w-lg text-center text-sm text-foreground-muted sm:text-base">
        {messages.home.heroSubtitle}
      </p>

      <form
        onSubmit={handleSubmit}
        className="mx-auto mt-8 flex max-w-2xl flex-col gap-3 sm:flex-row">
        <label className="sr-only" htmlFor="home-search-q">
          {messages.home.searchLabel}
        </label>
        <input
          id="home-search-q"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={messages.home.searchPlaceholder}
          className="min-w-0 flex-1 rounded-lg border border-border bg-background-surface px-4 py-2.5 text-foreground outline-none placeholder:text-foreground-subtle focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-ring-offset"
        />
        <label className="sr-only" htmlFor="home-search-city">
          {messages.home.cityLabel}
        </label>
        <input
          id="home-search-city"
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder={messages.home.cityPlaceholder}
          className="sm:w-40 rounded-lg border border-border bg-background-surface px-4 py-2.5 text-foreground outline-none placeholder:text-foreground-subtle focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-ring-offset"
        />
        <button
          type="submit"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-foreground-on-accent transition-colors hover:bg-accent-hover">
          <HiOutlineMagnifyingGlass className="size-4" aria-hidden />
          {messages.home.searchSubmit}
        </button>
      </form>
    </section>
  );
}
