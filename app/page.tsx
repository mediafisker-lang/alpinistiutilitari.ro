import type { Metadata } from "next";
import Script from "next/script";

import { BenefitsSection } from "@/components/benefits-section";
import { CommunitySection } from "@/components/community-section";
import { HeroSection } from "@/components/hero-section";
import { HowItWorksSection } from "@/components/how-it-works-section";
import { IssueForm } from "@/components/issue-form";
import { JoinConversionPanel } from "@/components/join-conversion-panel";
import { JoinForm } from "@/components/join-form";
import { ProgressSection } from "@/components/progress-section";
import { PublicIssuesList } from "@/components/public-issues-list";
import { QuickJoinBanner } from "@/components/quick-join-banner";
import { SectionHeading } from "@/components/section-heading";
import { UpdatesSection } from "@/components/updates-section";
import { VoteazaSchimbarileSection } from "@/components/voteaza-schimbarile-section";
import {
  getCommunityLinks,
  getHomepageStats,
  getPublicIssues,
  getPublicProgress,
  getPublicUpdates,
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
  const [progress, links, updates, issues, stats] = await Promise.all([
    getPublicProgress(),
    getCommunityLinks(),
    getPublicUpdates(),
    getPublicIssues(),
    getHomepageStats(),
  ]);

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
      <QuickJoinBanner />
      <CommunitySection links={links} />
      <BenefitsSection />
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <SectionHeading
            eyebrow="Actiune"
            title="Alege rapid ce vrei sa faci"
            description="Te inscrii daca vrei sa fii tinut la curent. Trimiti o sesizare daca vrei sa semnalezi o problema concreta."
            className="max-w-4xl"
            descriptionClassName="lg:whitespace-nowrap"
          />
          <div className="mt-8 grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(320px,360px)]">
            <JoinForm />
            <JoinConversionPanel stats={stats} />
          </div>
          <div
            id="sesizari"
            className="scroll-mt-24 mt-8 grid gap-5 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]"
          >
            <IssueForm />
            <PublicIssuesList issues={issues} />
          </div>
        </div>
      </section>
      <ProgressSection items={progress} />
      <HowItWorksSection />
      <VoteazaSchimbarileSection />
      <UpdatesSection updates={updates} />
    </>
  );
}
