import { messages } from "@/lib/i18n/messages";

/** Site footer content — replace with real company data when ready. */

export const footerData = {
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

export function formatFooterAddress() {
  const { street, city, postalCode, country } = footerData.address;
  return `${street}, ${city} ${postalCode}, ${country}`;
}
