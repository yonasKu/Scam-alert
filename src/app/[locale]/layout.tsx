import type { Metadata } from "next";
import { Acme, Nunito } from "next/font/google";
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

import "@/app/globals.css";

const acmeFont = Acme({
  weight: ["400"],
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
});

const nunitoFont = Nunito({
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

// Can be imported from a shared config
const locales = ['en', 'am'];

export function generateStaticParams() {
  return locales.map((locale) => ({locale}));
}

// Static metadata - Can be localized later if needed
export const metadata: Metadata = {
  title: "Scam Watch - Report Price Gouging",
  description: "Community platform for reporting price gouging and overcharges",
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  // Extract the locale from params
  const { locale } = params;

  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale)) notFound();

  let messages;
  try {
    messages = (await import(`../../../messages/${locale}.json`)).default;
  } catch (error: unknown) {
    // If we can't load the messages, the locale is not supported
    // Log the error for debugging purposes
    console.error(`Failed to load messages for locale ${locale}:`, error);
    notFound();
  }
  
  return (
    <html lang={locale} className={`${acmeFont.variable} ${nunitoFont.variable}`}>
      <body suppressHydrationWarning className="min-h-screen flex flex-col">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
