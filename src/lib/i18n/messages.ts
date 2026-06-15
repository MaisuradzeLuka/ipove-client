import { getMessages } from "@/lib/i18n/get-messages";
import { DEFAULT_LOCALE } from "@/lib/i18n/locales";

/** @deprecated Prefer getServerMessages() or useMessages() */
export const messages = getMessages(DEFAULT_LOCALE);

export { getMessages, type Messages } from "@/lib/i18n/get-messages";
export { getServerLocale, getServerMessages } from "@/lib/i18n/server";
