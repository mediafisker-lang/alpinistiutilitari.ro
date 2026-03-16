import { BenefitsSection } from "@/components/benefits-section";
import { CommunitySection } from "@/components/community-section";
import { HeroSection } from "@/components/hero-section";
import { HowItWorksSection } from "@/components/how-it-works-section";
import { IssueForm } from "@/components/issue-form";
import { JoinForm } from "@/components/join-form";
import { ProgressSection } from "@/components/progress-section";
import { PublicIssuesList } from "@/components/public-issues-list";
import { SectionHeading } from "@/components/section-heading";
import { UpdatesSection } from "@/components/updates-section";
import { VoteazaSchimbarileSection } from "@/components/voteaza-schimbarile-section";
import { getCommunityLinks, getPublicIssues, getPublicProgress, getPublicUpdates } from "@/lib/data";

export default async function HomePage() {
  const [progress, links, updates, issues] = await Promise.all([
    getPublicProgress(),
    getCommunityLinks(),
    getPublicUpdates(),
    getPublicIssues(),
  ]);

  return (
    <>
      <HeroSection />
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
          <div className="mt-8">
            <JoinForm />
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
