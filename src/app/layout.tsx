import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import { Noto_Sans_Georgian } from "next/font/google";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { Providers } from "@/components/providers";
import { getServerLocale, getServerMessages } from "@/lib/i18n/server";
import { setCurrentLocale } from "@/lib/i18n/current-locale";
import "./globals.css";

const notoGeorgian = Noto_Sans_Georgian({
  variable: "--font-geist-sans",
  subsets: ["georgian", "latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const messages = await getServerMessages();
  return {
    title: messages.metadata.title,
    description: messages.metadata.description,
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getServerLocale();
  setCurrentLocale(locale);

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={`${notoGeorgian.variable} ${geistMono.variable} h-full bg-background text-foreground antialiased`}>
      <body className="flex min-h-full flex-col bg-background">
        <Providers initialLocale={locale}>
          <Navbar />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
