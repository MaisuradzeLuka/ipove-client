import { getCurrentLocale } from "@/lib/i18n/current-locale";
import { getMessages } from "@/lib/i18n/get-messages";
import type { Messages } from "@/lib/i18n/get-messages";

/** Site footer content — replace with real company data when ready. */

export function getFooterData(messages: Messages) {
  return {
    tagline: messages.footer.tagline,
    address: messages.footer.address,
    contact: {
      email: "hello@ipove.com",
      phone: "+995 555 123 456",
    },
    links: [
      { label: messages.footer.links.home, href: "/" },
      { label: messages.footer.links.signIn, href: "/sign-in" },
      { label: messages.footer.links.signUp, href: "/sign-up" },
      { label: messages.footer.links.profile, href: "/profile" },
    ],
    social: [
      { label: "GitHub", href: "https://github.com" },
      { label: "LinkedIn", href: "https://linkedin.com" },
      { label: "Twitter", href: "https://twitter.com" },
    ],
    legal: [
      { label: messages.footer.legal.privacy, href: "#" },
      { label: messages.footer.legal.terms, href: "#" },
    ],
  } as const;
}

export function formatFooterAddress(messages: Messages) {
  const { street, city, postalCode, country } = getFooterData(messages).address;
  return `${street}, ${city} ${postalCode}, ${country}`;
}

/** @deprecated Use getFooterData(messages) */
export const footerData = getFooterData(getMessages(getCurrentLocale()));
