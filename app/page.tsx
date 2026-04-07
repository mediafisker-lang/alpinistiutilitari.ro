import type { Metadata } from "next";
import Script from "next/script";

import { CommunitySection } from "@/components/community-section";
import { HeroSection } from "@/components/hero-section";
import { HowItWorksSection } from "@/components/how-it-works-section";
import { QuickJoinBanner } from "@/components/quick-join-banner";
import {
  getCommunityLinks,
  getHomepageStats,
} from "@/lib/data";
import { buildMetadata, siteName, siteUrl } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  description:
    "Cortina North Bucuresti Ilfov: portalul comunitatii cu actualizari, sesizari, voturi, stadiul asociatiei si acces la grupurile interne pentru rezidenti.",
  path: "/",
  keywords: [
    "Cortina North Bucuresti Ilfov",
    "rezidenti Cortina North Bucuresti",
    "portal comunitate Cortina North Bucuresti",
    "asociatie proprietari Cortina North Bucuresti",
  ],
});

export default async function HomePage() {
  const [links, stats] = await Promise.all([getCommunityLinks(), getHomepageStats()]);

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        name: siteName,
        url: siteUrl,
        inLanguage: "ro",
        description:
          "Portalul comunitatii Cortina North din Bucuresti si Ilfov pentru sesizari, voturi si actualizari.",
      },
      {
        "@type": "Organization",
        name: siteName,
        url: siteUrl,
        areaServed: ["Bucuresti", "Ilfov"],
        sameAs: links.map((link) => link.url),
        description:
          "Comunitatea Cortina North din Bucuresti si Ilfov, cu portal dedicat pentru actualizari, sesizari si participare.",
      },
      {
        "@type": "CollectionPage",
        name: "Portal comunitate Cortina North",
        url: siteUrl,
        about: ["Cortina North", "Bucuresti", "Ilfov", "asociatie de proprietari", "comunitate rezidentiala"],
        isPartOf: {
          "@type": "WebSite",
          name: siteName,
          url: siteUrl,
        },
      },
    ],
  };

  return (
    <>
      <Script
        id="cortina-north-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <HeroSection stats={stats} />
      <HowItWorksSection />
      <QuickJoinBanner />
      <CommunitySection links={links} />
    </>
  );
}
