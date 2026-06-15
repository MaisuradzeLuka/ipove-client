"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState, Suspense } from "react";
import { HiOutlineMagnifyingGlass } from "react-icons/hi2";
import { useMessages } from "@/contexts/locale-context";

type NavSearchProps = {
  className?: string;
  onNavigate?: () => void;
};

function NavSearchInner({ className, onNavigate }: NavSearchProps) {
  const messages = useMessages();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const q = query.trim();
    const params = new URLSearchParams(searchParams.toString());
    if (q) {
      params.set("q", q);
    } else {
      params.delete("q");
    }
    const search = params.toString();
    router.push(search ? `/?${search}` : "/");
    onNavigate?.();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`relative ${className ?? "w-52 sm:w-64 lg:w-72"}`}>
      <HiOutlineMagnifyingGlass
        className="pointer-events-none absolute left-3 top-1/2 size-[18px] -translate-y-1/2 text-foreground-subtle"
        aria-hidden
      />
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={messages.nav.searchPlaceholder}
        className="h-10 w-full rounded-lg border border-border bg-background py-2 pl-10 pr-3 text-sm text-foreground outline-none placeholder:text-foreground-subtle transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-ring-offset"
      />
    </form>
  );
}

export function NavSearch(props: NavSearchProps) {
  return (
    <Suspense>
      <NavSearchInner {...props} />
    </Suspense>
  );
}
