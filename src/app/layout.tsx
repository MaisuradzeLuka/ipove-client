import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import { Noto_Sans_Georgian } from "next/font/google";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { Providers } from "@/components/providers";
import { messages } from "@/lib/i18n/messages";
import "./globals.css";

const notoGeorgian = Noto_Sans_Georgian({
  variable: "--font-geist-sans",
  subsets: ["georgian", "latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: messages.metadata.title,
  description: messages.metadata.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ka"
      suppressHydrationWarning
      className={`${notoGeorgian.variable} ${geistMono.variable} h-full bg-background text-foreground antialiased`}>
      <body className="flex min-h-full flex-col bg-background">
        <Providers>
          <Navbar />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
