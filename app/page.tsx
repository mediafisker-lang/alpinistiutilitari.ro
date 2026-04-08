import type { Metadata } from "next";

import { CommunitySection } from "@/components/community-section";
import { HeroSection } from "@/components/hero-section";
import { HowItWorksSection } from "@/components/how-it-works-section";
import {
  getCommunityLinks,
  getHomepageStats,
} from "@/lib/data";
import { buildMetadata, siteName, siteUrl } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  description:
    "Cortina North Pipera, Ilfov: portal comunitar pentru sesizari, vot si informatii utile despre complex Pipera si apartamente Pipera.",
  path: "/",
  keywords: [
    "apartamente Pipera",
    "complex Pipera",
    "cortina north",
    "cortinanorth",
    "complex de lux",
    "complex cortina",
    "cortina spa",
    "cortina welleness",
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
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "Ce este Cortina North Pipera?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Cortina North este un complex rezidential din zona Pipera, cu apartamente si facilitati de lifestyle.",
            },
          },
          {
            "@type": "Question",
            name: "Unde gasesc informatii despre sesizari, stare si vot?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Portalul comunitatii reuneste sesizari, voturi si actualizari intr-un singur loc, usor de accesat de pe mobil si desktop.",
            },
          },
          {
            "@type": "Question",
            name: "Ce cautari alternative folosesc rezidentii?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Uneori apar cautari precum cortinanorth, complex cortina, cortina spa sau cortina welleness.",
            },
          },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <HeroSection stats={stats} />
      <HowItWorksSection />
      <CommunitySection links={links} />
    </>
  );
}
