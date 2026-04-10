import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site/header";
import { SiteFooter } from "@/components/site/footer";
import { WhatsAppFloat } from "@/components/site/whatsapp-float";
import { buildMetadata, buildOrganizationJsonLd } from "@/lib/seo";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
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

  return (
    <html
      lang="ro-RO"
      data-scroll-behavior="smooth"
      className={`${plusJakarta.variable} ${spaceGrotesk.variable}`}
    >
      <body className="min-h-screen bg-slate-50 font-sans text-slate-950 antialiased selection:bg-[#0063f7]/20 selection:text-slate-950">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
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
