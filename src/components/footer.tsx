import Link from "next/link";
import {
  HiOutlineEnvelope,
  HiOutlineMapPin,
  HiOutlinePhone,
} from "react-icons/hi2";
import { Logo } from "@/components/logo/logo";
import {
  footerData,
  formatFooterAddress,
} from "@/lib/footer-data";
import { messages } from "@/lib/i18n/messages";

const iconClass = "size-4 shrink-0 text-foreground-accent";

export function Footer() {
  const year = new Date().getFullYear();
  const fullAddress = formatFooterAddress();

  return (
    <footer className="mt-auto border-t border-border bg-background-surface/90 backdrop-blur-sm">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2 lg:col-span-1">
            <Link
              href="/"
              className="inline-block rounded-md outline-none transition-opacity hover:opacity-80 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-ring-offset">
              <Logo size="sm" />
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-foreground-muted">
              {footerData.tagline}
            </p>
          </div>

          <nav aria-label={messages.footer.footerNav}>
            <h2 className="text-sm font-semibold text-foreground">
              {messages.footer.explore}
            </h2>
            <ul className="mt-4 space-y-2.5">
              {footerData.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-foreground-muted transition-colors hover:text-foreground-accent">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="text-sm font-semibold text-foreground">
              {messages.footer.contact}
            </h2>
            <ul className="mt-4 space-y-3">
              <li>
                <a
                  href={`mailto:${footerData.contact.email}`}
                  className="inline-flex items-start gap-2.5 text-sm text-foreground-muted transition-colors hover:text-foreground-accent">
                  <HiOutlineEnvelope className={iconClass} aria-hidden />
                  {footerData.contact.email}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${footerData.contact.phone.replace(/\s/g, "")}`}
                  className="inline-flex items-start gap-2.5 text-sm text-foreground-muted transition-colors hover:text-foreground-accent">
                  <HiOutlinePhone className={iconClass} aria-hidden />
                  {footerData.contact.phone}
                </a>
              </li>
              <li>
                <address className="inline-flex items-start gap-2.5 not-italic text-sm text-foreground-muted">
                  <HiOutlineMapPin className={iconClass} aria-hidden />
                  {fullAddress}
                </address>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-foreground">
              {messages.footer.follow}
            </h2>
            <ul className="mt-4 space-y-2.5">
              {footerData.social.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-foreground-muted transition-colors hover:text-foreground-accent">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-border pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-foreground-subtle">
            {messages.footer.copyright(year)}
          </p>
          <nav
            aria-label={messages.footer.legalNav}
            className="flex flex-wrap gap-x-6 gap-y-2">
            {footerData.legal.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-sm text-foreground-muted transition-colors hover:text-foreground-accent">
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
