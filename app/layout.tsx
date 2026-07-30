import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site/header";
import { SiteFooter } from "@/components/site/footer";
import { WhatsAppFloat } from "@/components/site/whatsapp-float";
import { PwaRegistrar } from "@/components/site/pwa-registrar";
import {
  buildMetadata,
  buildOrganizationJsonLd,
  buildPlatformLocalBusinessJsonLd,
} from "@/lib/seo";

const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

const baseMetadata = buildMetadata({
  title: "Alpinisti Utilitari Romania - firme pe judete, orase si servicii",
  description:
    "Trimiti o cerere pentru servicii de alpinism direct catre firmele din judetul tau si primesti rapid oferte relevante.",
});

export const metadata: Metadata = {
  ...baseMetadata,
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION || undefined,
    other: process.env.BING_SITE_VERIFICATION
      ? {
          "msvalidate.01": process.env.BING_SITE_VERIFICATION,
        }
      : undefined,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#0063f7" },
    { media: "(prefers-color-scheme: dark)", color: "#081a3a" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationJsonLd = buildOrganizationJsonLd();
  const localBusinessJsonLd = buildPlatformLocalBusinessJsonLd();

  return (
    <html
      lang="ro-RO"
      data-scroll-behavior="smooth"
      className={manrope.variable}
    >
      <body className="min-h-screen bg-[#F5F7F9] font-sans text-[#16202A] antialiased selection:bg-[#176B87]/20 selection:text-[#16202A]">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
        />
        <PwaRegistrar />
        <div className="flex min-h-screen flex-col">
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
          <WhatsAppFloat />
        </div>
      </body>
    </html>
  );
}
