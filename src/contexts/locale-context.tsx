"use client";

import { useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { setCurrentLocale } from "@/lib/i18n/current-locale";
import { getMessages, type Messages } from "@/lib/i18n/get-messages";
import {
  LOCALE_COOKIE,
  LOCALE_MAX_AGE,
  type Locale,
} from "@/lib/i18n/locales";

type LocaleContextValue = {
  locale: Locale;
  messages: Messages;
  setLocale: (locale: Locale) => void;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

function writeLocaleCookie(locale: Locale) {
  document.cookie = `${LOCALE_COOKIE}=${locale};path=/;max-age=${LOCALE_MAX_AGE};samesite=lax`;
}

export function LocaleProvider({
  children,
  initialLocale,
}: {
  children: ReactNode;
  initialLocale: Locale;
}) {
  setCurrentLocale(initialLocale);
  const router = useRouter();
  const [locale, setLocaleState] = useState(initialLocale);

  useEffect(() => {
    setLocaleState(initialLocale);
    setCurrentLocale(initialLocale);
  }, [initialLocale]);

  const setLocale = useCallback(
    (next: Locale) => {
      if (next === locale) return;
      writeLocaleCookie(next);
      setLocaleState(next);
      setCurrentLocale(next);
      router.refresh();
    },
    [locale, router],
  );

  const messages = useMemo(() => getMessages(locale), [locale]);

  const value = useMemo(
    () => ({ locale, messages, setLocale }),
    [locale, messages, setLocale],
  );

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error("useLocale must be used within LocaleProvider");
  }
  return context;
}

export function useMessages() {
  return useLocale().messages;
}

export function useCategoryName() {
  const { locale } = useLocale();
  return (category: { nameKa: string; nameEn?: string }) =>
    locale === "en" ? category.nameEn || category.nameKa : category.nameKa;
}
