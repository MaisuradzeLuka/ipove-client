import Link from "next/link";
import { Logo } from "@/components/logo/logo";
import type { ReactNode } from "react";

type AuthCardProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
};

export function AuthCard({ title, subtitle, children, footer }: AuthCardProps) {
  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-6 py-12">
      <div className="mb-8 flex justify-center">
        <Link
          href="/"
          className="rounded-md outline-none transition-opacity hover:opacity-80 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-ring-offset">
          <Logo size="md" />
        </Link>
      </div>

      <article className="rounded-xl bg-background-surface p-6 shadow-sm ring-1 ring-border sm:p-8">
        <header className="text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            {title}
          </h1>
          <p className="mt-2 text-sm text-foreground-muted">{subtitle}</p>
        </header>
        <div className="mt-8">{children}</div>
        <footer className="mt-6 border-t border-border pt-6 text-center text-sm text-foreground-muted">
          {footer}
        </footer>
      </article>
    </main>
  );
}
