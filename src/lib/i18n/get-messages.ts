import type { Locale } from "@/lib/i18n/locales";
import { enMessages } from "@/lib/i18n/messages/en";
import { kaMessages } from "@/lib/i18n/messages/ka";

export type Messages = typeof kaMessages;

const catalogs: Record<Locale, Messages> = {
  ka: kaMessages,
  en: enMessages as unknown as Messages,
};

export function getMessages(locale: Locale): Messages {
  return catalogs[locale];
}
