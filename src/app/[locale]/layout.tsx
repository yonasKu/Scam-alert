import type { Metadata } from "next";
import { Acme, Nunito } from "next/font/google";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

import "../globals.css";

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

// Static metadata
export const metadata: Metadata = {
  title: "Scam Watch - Report Price Gouging",
  description: "Community platform for reporting price gouging and overcharges",
};

type Props = {
  children: React.ReactNode;
  params: { locale: string };
};

export default function Layout(props: Props) {
  const { children } = props;
  
  return (
    <html lang="en" suppressHydrationWarning className={`${acmeFont.variable} ${nunitoFont.variable}`}>
      <body className="min-h-screen flex flex-col" suppressHydrationWarning>
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
